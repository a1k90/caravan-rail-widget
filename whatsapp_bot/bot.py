"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
WhatsApp Assistant Bot Engine
Provides identical corporate functionality, 6 logistics wizards,
multilingual interface, SQLite persistence, Resend email dispatch,
and real-time lead forwarding to the Telegram managers' group.
"""

import re
import time
import logging
from typing import Dict, Any, Optional

from telegram_bot.locales import t
from telegram_bot.database import (
    init_db,
    get_wa_user,
    save_or_update_wa_user,
    register_wa_user,
    create_lead,
    get_wa_user_leads
)
from telegram_bot.email_service import send_lead_email
from telegram_bot.config import ADMIN_CHAT_IDS
from .config import DEFAULT_LANGUAGE, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_WEBSITE
from .formatter import to_whatsapp_format, format_numbered_menu, format_whatsapp_lead_summary
from .api_client import send_whatsapp_message, clean_phone_number

logger = logging.getLogger("whatsapp_bot")

# In-memory FSM state dictionary: phone -> {"state": str, "data": dict, "lang": str}
WA_USER_STATES: Dict[str, Dict[str, Any]] = {}
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')


def get_user_lang(phone: str) -> str:
    """Retrieve user language preference from state or DB."""
    clean_p = clean_phone_number(phone)
    if clean_p in WA_USER_STATES and WA_USER_STATES[clean_p].get('lang'):
        return WA_USER_STATES[clean_p]['lang']
    user = get_wa_user(clean_p)
    if user and user.get('language'):
        return user['language']
    return DEFAULT_LANGUAGE


def clear_state(phone: str):
    """Clear conversation state for phone number."""
    clean_p = clean_phone_number(phone)
    if clean_p in WA_USER_STATES:
        lang = WA_USER_STATES[clean_p].get('lang')
        WA_USER_STATES[clean_p] = {'lang': lang} if lang else {}


def send_reply(phone: str, text: str):
    """Send formatted text message to user."""
    send_whatsapp_message(phone, to_whatsapp_format(text))


# ------------------ MENUS & PROMPTS ------------------ #

def send_language_menu(phone: str):
    """Prompt user to choose language."""
    msg = (
        "🌐 *Пожалуйста, выберите язык обслуживания:*\n"
        "Please select your language:\n"
        "请选择您的服务语言:\n\n"
        "*1.* 🇷🇺 Русский\n"
        "*2.* 🇬🇧 English\n"
        "*3.* 🇨🇳 中文\n\n"
        "_👉 Отправьте цифру 1, 2 или 3:_"
    )
    WA_USER_STATES[clean_phone_number(phone)] = {'state': 'SELECTING_LANG', 'data': {}}
    send_reply(phone, msg)


def send_main_menu(phone: str, lang: str):
    """Send corporate main menu in chosen language."""
    clean_p = clean_phone_number(phone)
    user = get_wa_user(clean_p) or {}
    company = user.get('company_name', '')
    
    greeting = f"👋 *Caravan Railroad — Главное меню*" if lang == 'ru' else t(lang, 'main_menu_title')
    if company:
        greeting = f"🏢 *{company}*\n{greeting}"

    options = [
        ("1", t(lang, 'service_rail')),
        ("2", t(lang, 'service_road')),
        ("3", t(lang, 'service_air')),
        ("4", t(lang, 'service_multi')),
        ("5", t(lang, 'service_customs')),
        ("6", t(lang, 'service_forwarding')),
        ("7", t(lang, 'btn_my_leads')),
        ("8", t(lang, 'btn_about')),
        ("9", t(lang, 'btn_change_lang'))
    ]
    
    text = format_numbered_menu(greeting, options, footer="Отправьте цифру нужного раздела (1-9)")
    clear_state(phone)
    WA_USER_STATES[clean_p] = {'lang': lang}
    send_reply(phone, text)


def notify_telegram_managers_from_whatsapp(lead: dict, user: dict, phone: str):
    """Forward incoming WhatsApp lead inquiry directly to the Telegram managers' group."""
    try:
        from telegram_bot.bot import get_bot
        from telegram_bot.database import get_all_admin_chats
        
        target_chats = set(ADMIN_CHAT_IDS or [])
        db_chats = get_all_admin_chats()
        for c in db_chats:
            target_chats.add(c["chat_id"])
            
        if not target_chats:
            return

        bot = get_bot()
        lead_num = lead.get('lead_number', 'CR-LEAD')
        company = user.get('company_name', 'Клиент')
        service = lead.get('service_name', 'Логистика')
        full_name = user.get('full_name', '—')
        email = user.get('email', '—')
        created_at = lead.get('created_at', time.strftime("%Y-%m-%d %H:%M:%S UTC"))
        clean_p = clean_phone_number(phone)
        wa_link = f"https://wa.me/{clean_p}"

        msg = (
            f"🟢 **НОВАЯ ЗАЯВКА ИЗ WHATSAPP: {lead_num}**\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"📱 **Канал:** WhatsApp Assistant Bot\n"
            f"📦 **Направление:** {service}\n"
            f"🏢 **Компания:** {company}\n"
            f"👤 **Контакт:** {full_name}\n"
            f"📞 **WhatsApp:** +{clean_p} ([Открыть диалог в WhatsApp]({wa_link}))\n"
            f"✉️ **Email:** {email}\n"
            f"⏱ **Время:** {created_at}\n\n"
            f"📋 **Параметры перевозки:**\n"
        )
        for k, v in lead.get('details', {}).items():
            if v:
                clean_k = str(k).replace('_', ' ').capitalize()
                msg += f"• **{clean_k}:** {v}\n"
                
        msg += f"\n━━━━━━━━━━━━━━━━━━━━\n👉 _Ответить клиенту в 1 клик:_ {wa_link}"

        for chat_id in target_chats:
            try:
                bot.send_message(chat_id, msg, parse_mode='Markdown')
                logger.info(f"WhatsApp lead {lead_num} forwarded to Telegram group {chat_id}")
            except Exception as e:
                logger.error(f"Failed to forward WhatsApp lead to Telegram chat {chat_id}: {e}")
    except Exception as e:
        logger.error(f"Error in notify_telegram_managers_from_whatsapp: {e}")


def finalize_whatsapp_lead(phone: str, lang: str, data: dict):
    """Save lead to database, dispatch corporate email, notify Telegram managers, and confirm to client."""
    clean_p = clean_phone_number(phone)
    user = get_wa_user(clean_p) or {}
    service_type = data.get('service_type', 'general')
    service_name = data.get('service_name', service_type)
    
    details = {k: v for k, v in data.items() if k not in ('service_type', 'service_name')}
    
    # 1. Create lead in SQLite DB
    lead = create_lead(
        telegram_id=0,
        wa_phone=clean_p,
        channel='whatsapp',
        service_type=service_type,
        service_name=service_name,
        details=details
    )
    
    # User data payload for email
    email_user = {
        'company_name': user.get('company_name', 'Организация'),
        'full_name': user.get('full_name', 'Клиент'),
        'phone': f"+{clean_p}",
        'email': user.get('email', '—'),
        'username': f"wa:+{clean_p}",
        'telegram_id': f"wa:{clean_p}"
    }
    
    # 2. Dispatch Corporate Email via Resend HTTPS API
    send_lead_email(lead, email_user)
    
    # 3. Notify managers in Telegram group in real time
    notify_telegram_managers_from_whatsapp(lead, user, clean_p)
    
    # 4. Confirm to client in WhatsApp
    confirmation_text = format_whatsapp_lead_summary(
        lead_number=lead['lead_number'],
        data=data,
        user=user,
        created_at=lead['created_at']
    )
    send_reply(clean_p, confirmation_text)
    
    # Return to main menu state
    clear_state(clean_p)
    WA_USER_STATES[clean_p] = {'lang': lang}
    time.sleep(0.5)
    send_main_menu(clean_p, lang)


# ------------------ INCOMING MESSAGE PROCESSOR ------------------ #

def process_incoming_whatsapp_message(from_phone: str, text: str, message_id: str = None) -> bool:
    """
    Main entry point for incoming WhatsApp messages.
    Processes user state machine (Registration, Main Menu, 6 Wizards).
    """
    init_db()
    clean_p = clean_phone_number(from_phone)
    if not clean_p:
        return False
        
    text_raw = (text or "").strip()
    text_lower = text_raw.lower()
    
    user = get_wa_user(clean_p)
    lang = get_user_lang(clean_p)
    
    state_info = WA_USER_STATES.get(clean_p, {})
    state = state_info.get('state')
    data = state_info.get('data', {})

    logger.info(f"WhatsApp msg from +{clean_p} (state={state}): {text_raw}")

    # Universal Cancel / Restart triggers
    if text_lower in ('отмена', 'cancel', 'reset', '/cancel', 'стоп', 'stop'):
        clear_state(clean_p)
        send_reply(clean_p, "❌ Действие отменено.")
        send_main_menu(clean_p, lang)
        return True

    if text_lower in ('старт', 'start', '/start', 'меню', 'menu', 'привет', 'hi', 'hello'):
        if user and user.get('is_registered'):
            send_main_menu(clean_p, lang)
            return True
        else:
            send_language_menu(clean_p)
            return True

    # 1. State: Language Selection
    if state == 'SELECTING_LANG':
        chosen_lang = 'ru'
        if text_lower in ('1', 'ru', 'русский', 'russian'):
            chosen_lang = 'ru'
        elif text_lower in ('2', 'en', 'english'):
            chosen_lang = 'en'
        elif text_lower in ('3', 'zh', '中文', 'chinese'):
            chosen_lang = 'zh'
        else:
            send_reply(clean_p, "Пожалуйста, отправьте цифру: 1 (Русский), 2 (English) или 3 (中文)")
            return True
            
        save_or_update_wa_user(clean_p, language=chosen_lang)
        WA_USER_STATES[clean_p] = {'lang': chosen_lang}
        
        # If user is already registered, go to main menu
        if user and user.get('is_registered'):
            send_main_menu(clean_p, chosen_lang)
            return True
            
        # Start registration
        WA_USER_STATES[clean_p] = {'state': 'REG_ASK_COMPANY', 'data': {}, 'lang': chosen_lang}
        welcome_reg = (
            f"👋 *Добро пожаловать в Caravan Railroad & Multimodal Logistics!*\n\n"
            f"Для точного расчета ставок и закрепления персонального менеджера, "
            f"пожалуйста, пройдите быструю регистрацию вашей организации.\n\n"
            f"🏢 *Шаг 1 из 3:* Укажите *наименование вашей организации / компании:*"
        )
        send_reply(clean_p, welcome_reg)
        return True

    # 2. Registration Flow
    if state == 'REG_ASK_COMPANY':
        data['company_name'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'REG_ASK_NAME', 'data': data, 'lang': lang}
        send_reply(clean_p, "👤 *Шаг 2 из 3:* Укажите *Фамилию и Имя контактного лица:*")
        return True

    if state == 'REG_ASK_NAME':
        data['full_name'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'REG_ASK_EMAIL', 'data': data, 'lang': lang}
        send_reply(clean_p, "✉️ *Шаг 3 из 3:* Укажите *корпоративный Email* для отправки расчетов:")
        return True

    if state == 'REG_ASK_EMAIL':
        if not EMAIL_REGEX.match(text_raw):
            send_reply(clean_p, "⚠️ Пожалуйста, введите корректный адрес электронной почты (например, name@company.com):")
            return True
        data['email'] = text_raw
        
        register_wa_user(
            phone=clean_p,
            full_name=data['full_name'],
            company_name=data['company_name'],
            email=data['email'],
            language=lang
        )
        send_reply(clean_p, "🎉 *Регистрация успешно завершена!*\nВаша организация сохранена в системе Caravan Railroad.")
        time.sleep(0.5)
        send_main_menu(clean_p, lang)
        return True

    # 3. If user is not in active wizard, handle Main Menu options
    if not state:
        if not user or not user.get('is_registered'):
            send_language_menu(clean_p)
            return True

        # Main menu routing by number or keyword
        if text_lower in ('1', 'жд', 'ж/д', 'rail', 'вагон'):
            WA_USER_STATES[clean_p] = {'state': 'RAIL_STEP_TYPE', 'data': {'service_type': 'rail'}, 'lang': lang}
            msg = format_numbered_menu(
                "🚂 *Ж/Д логистика (колея 1520 & 1435 мм)*\nВыберите тип услуги:",
                [("1", "🚆 Расчет тарифа и перевозка"), ("2", "📑 Аренда подвижного состава")]
            )
            send_reply(clean_p, msg)
            return True

        elif text_lower in ('2', 'авто', 'road', 'truck'):
            WA_USER_STATES[clean_p] = {'state': 'ROAD_STEP_ROUTE', 'data': {'service_type': 'road', 'service_name': 'Автомобильные перевозки'}, 'lang': lang}
            send_reply(clean_p, "🚛 *Автомобильные перевозки*\nУкажите *маршрут перевозки* (Город отправления ➔ Город назначения):")
            return True

        elif text_lower in ('3', 'авиа', 'air'):
            WA_USER_STATES[clean_p] = {'state': 'AIR_STEP_ROUTE', 'data': {'service_type': 'air', 'service_name': 'Авиаперевозки'}, 'lang': lang}
            send_reply(clean_p, "✈️ *Авиаперевозки грузов*\nУкажите *аэропорты / города отправления и назначения:*")
            return True

        elif text_lower in ('4', 'мультимодал', 'контейнер', 'multi'):
            WA_USER_STATES[clean_p] = {'state': 'MULTI_STEP_ROUTE', 'data': {'service_type': 'multi', 'service_name': 'Мультимодальные перевозки'}, 'lang': lang}
            send_reply(clean_p, "🚢 *Мультимодальные перевозки*\nУкажите *маршрут перевозки* (Страна/Город отправления ➔ Назначения):")
            return True

        elif text_lower in ('5', 'таможня', 'брокер', 'customs'):
            WA_USER_STATES[clean_p] = {'state': 'CUSTOMS_STEP_REGIME', 'data': {'service_type': 'customs', 'service_name': 'Таможенное оформление'}, 'lang': lang}
            msg = format_numbered_menu(
                "📑 *Таможенное оформление и брокерские услуги*\nВыберите таможенный режим:",
                [("1", "Импорт (ИМ-40)"), ("2", "Экспорт (ЭК-10)"), ("3", "Транзит (ТР-80)"), ("4", "Консультация")]
            )
            send_reply(clean_p, msg)
            return True

        elif text_lower in ('6', 'экспедирование', 'тариф', 'forwarding'):
            WA_USER_STATES[clean_p] = {'state': 'FWD_STEP_ADMINS', 'data': {'service_type': 'forwarding', 'service_name': 'Экспедирование и ж/д тарифы'}, 'lang': lang}
            send_reply(clean_p, "🌐 *Экспедирование и оплата провозных платежей*\nУкажите *железные дороги транзита* (например: КЗХ, УТИ, РЖД):")
            return True

        elif text_lower in ('7', 'заявки', 'leads'):
            leads = get_wa_user_leads(clean_p, limit=5)
            if not leads:
                send_reply(clean_p, "📋 У вас пока нет оформленных заявок. Выберите интересующее направление в меню выше для подачи заявки.")
            else:
                lines = ["📋 *Ваши недавние заявки:*", ""]
                for idx, l in enumerate(leads, 1):
                    lines.append(f"*{idx}. {l.get('lead_number')}* — {l.get('service_name', 'Заявка')}")
                    lines.append(f"   📅 {l.get('created_at', '')[:16]} | Статус: `{l.get('status', 'NEW')}`\n")
                send_reply(clean_p, "\n".join(lines))
            time.sleep(0.5)
            send_main_menu(clean_p, lang)
            return True

        elif text_lower in ('8', 'о компании', 'about', 'контакты'):
            about = (
                "🚂 *Caravan Railroad* — международный мультимодальный и железнодорожный логистический оператор.\n\n"
                "🔹 *Собственный и арендованный парк:* 1 480+ вагонов (крытые, полувагоны, цистерны, фитинговые платформы)\n"
                "🔹 *География:* Казахстан, Узбекистан, страны Центральной Азии, Китай, Россия.\n"
                "🔹 *Сервисы:* ж/д тарифы, авиаперевозки, экспедирование, контейнерные поезда, автодоставка, таможенный брокер\n\n"
                f"📞 *Телефон:* {COMPANY_PHONE}\n"
                f"✉️ *Email:* {COMPANY_EMAIL}\n"
                f"🌐 *Сайт:* {COMPANY_WEBSITE}"
            )
            send_reply(clean_p, about)
            time.sleep(0.5)
            send_main_menu(clean_p, lang)
            return True

        elif text_lower in ('9', 'язык', 'lang', 'language'):
            send_language_menu(clean_p)
            return True

        else:
            send_main_menu(clean_p, lang)
            return True

    # 4. FSM Steps for Logistics Wizards
    # --- Rail Wizard ---
    if state == 'RAIL_STEP_TYPE':
        data['service_subtype'] = 'Аренда подвижного состава' if text_raw == '2' else 'Расчет тарифа и перевозка'
        data['service_name'] = f"Ж/Д логистика ({data['service_subtype']})"
        WA_USER_STATES[clean_p] = {'state': 'RAIL_STEP_FROM', 'data': data, 'lang': lang}
        send_reply(clean_p, "📍 Введите *станцию отправления* (наименование или 6-значный код станции):")
        return True

    if state == 'RAIL_STEP_FROM':
        data['станция_отправления'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'RAIL_STEP_TO', 'data': data, 'lang': lang}
        send_reply(clean_p, "🏁 Введите *станцию назначения* (наименование или 6-значный код станции):")
        return True

    if state == 'RAIL_STEP_TO':
        data['станция_назначения'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'RAIL_STEP_CARGO', 'data': data, 'lang': lang}
        send_reply(clean_p, "📦 Укажите *наименование груза* (или код ЕТСНГ / ГНГ, если известен):")
        return True

    if state == 'RAIL_STEP_CARGO':
        data['груз'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'RAIL_STEP_WAGON', 'data': data, 'lang': lang}
        msg = format_numbered_menu(
            "🛠 Выберите *тип подвижного состава*:",
            [
                ("1", "Крытый вагон (138-161 м³)"),
                ("2", "Полувагон (люковый/глуходонный)"),
                ("3", "Платформа (универсальная/фитинговая)"),
                ("4", "Цистерна (нефть/химия/СУГ)"),
                ("5", "Хоппер-зерновоз / Минераловоз"),
                ("6", "Контейнеры (20 / 40 фут)")
            ]
        )
        send_reply(clean_p, msg)
        return True

    if state == 'RAIL_STEP_WAGON':
        wagon_map = {
            '1': 'Крытый вагон (138-161 м³)',
            '2': 'Полувагон',
            '3': 'Платформа фитинговая/универсальная',
            '4': 'Цистерна',
            '5': 'Хоппер-зерновоз',
            '6': 'Контейнеры (20/40 фут)'
        }
        data['тип_вагона'] = wagon_map.get(text_raw, text_raw)
        WA_USER_STATES[clean_p] = {'state': 'RAIL_STEP_VOLUME', 'data': data, 'lang': lang}
        send_reply(clean_p, "⚖️ Укажите *объем партии* (количество вагонов, контейнеров или тонн):")
        return True

    if state == 'RAIL_STEP_VOLUME':
        data['объем_партии'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'WIZARD_CONFIRM', 'data': data, 'lang': lang}
        summary_msg = (
            "📋 *Проверьте параметры вашей заявки:*\n"
            f"• Направление: {data.get('service_name')}\n"
            f"• Отправление: {data.get('станция_отправления')}\n"
            f"• Назначение: {data.get('станция_отправления')}\n"
            f"• Груз: {data.get('груз')}\n"
            f"• Подвижной состав: {data.get('тип_вагона')}\n"
            f"• Объем: {data.get('объем_партии')}\n\n"
            "*1.* ✅ Подтвердить и отправить заявку\n"
            "*2.* ❌ Отменить"
        )
        send_reply(clean_p, summary_msg)
        return True

    # --- Road Wizard ---
    if state == 'ROAD_STEP_ROUTE':
        data['маршрут'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'ROAD_STEP_CARGO', 'data': data, 'lang': lang}
        send_reply(clean_p, "📦 Укажите *наименование груза, вес (тонн) и объем (м³):*")
        return True

    if state == 'ROAD_STEP_CARGO':
        data['параметры_груза'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'ROAD_STEP_TRUCK', 'data': data, 'lang': lang}
        msg = format_numbered_menu(
            "🚛 Выберите *тип автомобильного транспорта*:",
            [
                ("1", "Тент (86-92 м³, до 22 тонн)"),
                ("2", "Мега / Сцепка (100-120 м³)"),
                ("3", "Рефрижератор (температурный режим)"),
                ("4", "Контейнеровоз (20/40 фут)"),
                ("5", "Трал / Негабаритная площадка")
            ]
        )
        send_reply(clean_p, msg)
        return True

    if state == 'ROAD_STEP_TRUCK':
        truck_map = {
            '1': 'Тент (86-92 м³)',
            '2': 'Мега/Сцепка (100-120 м³)',
            '3': 'Рефрижератор',
            '4': 'Контейнеровоз',
            '5': 'Трал / Негабарит'
        }
        data['тип_транспорта'] = truck_map.get(text_raw, text_raw)
        WA_USER_STATES[clean_p] = {'state': 'WIZARD_CONFIRM', 'data': data, 'lang': lang}
        summary_msg = (
            "📋 *Проверьте параметры заявки (Автодоставка):*\n"
            f"• Маршрут: {data.get('маршрут')}\n"
            f"• Груз: {data.get('параметры_груза')}\n"
            f"• Транспорт: {data.get('тип_транспорта')}\n\n"
            "*1.* ✅ Подтвердить и отправить заявку\n"
            "*2.* ❌ Отменить"
        )
        send_reply(clean_p, summary_msg)
        return True

    # --- Air Wizard ---
    if state == 'AIR_STEP_ROUTE':
        data['маршрут'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'AIR_STEP_CARGO', 'data': data, 'lang': lang}
        send_reply(clean_p, "📦 Укажите *характер груза, вес (кг) и габариты мест:*")
        return True

    if state == 'AIR_STEP_CARGO':
        data['параметры_груза'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'WIZARD_CONFIRM', 'data': data, 'lang': lang}
        summary_msg = (
            "📋 *Проверьте параметры заявки (Авиаперевозка):*\n"
            f"• Маршрут: {data.get('маршрут')}\n"
            f"• Груз: {data.get('параметры_груза')}\n\n"
            "*1.* ✅ Подтвердить и отправить заявку\n"
            "*2.* ❌ Отменить"
        )
        send_reply(clean_p, summary_msg)
        return True

    # --- Multimodal Wizard ---
    if state == 'MULTI_STEP_ROUTE':
        data['маршрут'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'MULTI_STEP_CARGO', 'data': data, 'lang': lang}
        send_reply(clean_p, "📦 Укажите *груз, необходимое количество и тип контейнеров (20/40 фут COC/SOC):*")
        return True

    if state == 'MULTI_STEP_CARGO':
        data['параметры_контейнеров'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'WIZARD_CONFIRM', 'data': data, 'lang': lang}
        summary_msg = (
            "📋 *Проверьте параметры заявки (Мультимодал):*\n"
            f"• Маршрут: {data.get('маршрут')}\n"
            f"• Груз и контейнеры: {data.get('параметры_контейнеров')}\n\n"
            "*1.* ✅ Подтвердить и отправить заявку\n"
            "*2.* ❌ Отменить"
        )
        send_reply(clean_p, summary_msg)
        return True

    # --- Customs Wizard ---
    if state == 'CUSTOMS_STEP_REGIME':
        regime_map = {
            '1': 'Импорт (ИМ-40)',
            '2': 'Экспорт (ЭК-10)',
            '3': 'Транзит (ТР-80)',
            '4': 'Таможенная консультация'
        }
        data['режим'] = regime_map.get(text_raw, text_raw)
        WA_USER_STATES[clean_p] = {'state': 'CUSTOMS_STEP_POST', 'data': data, 'lang': lang}
        send_reply(clean_p, "📍 Укажите *таможенный пост / погранпереход оформления и наименование груза:*")
        return True

    if state == 'CUSTOMS_STEP_POST':
        data['детали_оформления'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'WIZARD_CONFIRM', 'data': data, 'lang': lang}
        summary_msg = (
            "📋 *Проверьте параметры заявки (Таможенный брокер):*\n"
            f"• Режим: {data.get('режим')}\n"
            f"• Детали: {data.get('детали_оформления')}\n\n"
            "*1.* ✅ Подтвердить и отправить заявку\n"
            "*2.* ❌ Отменить"
        )
        send_reply(clean_p, summary_msg)
        return True

    # --- Forwarding Wizard ---
    if state == 'FWD_STEP_ADMINS':
        data['железные_дороги'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'FWD_STEP_ROUTE', 'data': data, 'lang': lang}
        send_reply(clean_p, "📍 Укажите *маршрут перевозки и наименование груза:*")
        return True

    if state == 'FWD_STEP_ROUTE':
        data['маршрут_груз'] = text_raw
        WA_USER_STATES[clean_p] = {'state': 'WIZARD_CONFIRM', 'data': data, 'lang': lang}
        summary_msg = (
            "📋 *Проверьте параметры заявки (Экспедирование):*\n"
            f"• Администрации ж/д: {data.get('железные_дороги')}\n"
            f"• Маршрут и груз: {data.get('маршрут_груз')}\n\n"
            "*1.* ✅ Подтвердить и отправить заявку\n"
            "*2.* ❌ Отменить"
        )
        send_reply(clean_p, summary_msg)
        return True

    # --- Confirmation Step for All Wizards ---
    if state == 'WIZARD_CONFIRM':
        if text_lower in ('1', 'да', 'yes', 'отправить', 'подтвердить', 'ок', 'ok'):
            finalize_whatsapp_lead(clean_p, lang, data)
            return True
        else:
            clear_state(clean_p)
            send_reply(clean_p, "❌ Заявка отменена.")
            time.sleep(0.5)
            send_main_menu(clean_p, lang)
            return True

    # Fallback to main menu
    send_main_menu(clean_p, lang)
    return True
