"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
Official Telegram Assistant Bot
Full multilingual implementation with corporate registration,
6 logistics wizards, SQLite persistence, and email dispatch to info@caravanrailroad.com.
"""

import re
import sys
import time
import logging
from typing import Dict, Any, Optional

import telebot
from telebot import types

from .config import (
    BOT_TOKEN,
    DEFAULT_LANGUAGE,
    LOGS_DIR
)
from .database import (
    init_db,
    get_user,
    register_user,
    set_user_language,
    create_lead,
    get_user_leads,
    get_lead_by_number
)
from .locales import t, format_lead_summary
from .keyboards import (
    get_language_keyboard,
    get_phone_request_keyboard,
    get_main_menu_keyboard,
    get_cancel_keyboard,
    get_skip_cancel_keyboard,
    get_confirm_lead_keyboard,
    get_rail_type_inline,
    get_wagon_type_inline,
    get_fleet_opt_inline,
    get_truck_type_inline,
    get_air_cargo_type_inline,
    get_yes_no_inline,
    get_multi_type_inline,
    get_equipment_type_inline,
    get_customs_regime_inline,
    get_profile_edit_inline
)
from .email_service import send_lead_email

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("caravan_bot")

# In-memory FSM state dictionary: tg_id -> {"state": str, "data": dict}
USER_STATES: Dict[int, Dict[str, Any]] = {}

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

def get_user_lang(tg_id: int) -> str:
    """Retrieve user language from state, DB, or fallback to default."""
    if tg_id in USER_STATES and 'lang' in USER_STATES[tg_id]:
        return USER_STATES[tg_id]['lang']
    user = get_user(tg_id)
    if user and user.get('language'):
        return user['language']
    return DEFAULT_LANGUAGE


def clear_state(tg_id: int):
    """Clear user conversation state."""
    if tg_id in USER_STATES:
        # Preserve user language preference in state if available
        lang = USER_STATES[tg_id].get('lang')
        USER_STATES[tg_id] = {'lang': lang} if lang else {}


def init_bot(token: str) -> telebot.TeleBot:
    """Initialize TeleBot instance with all handlers."""
    bot = telebot.TeleBot(token, parse_mode='Markdown')
    
    # ------------------ COMMAND HANDLERS ------------------ #

    @bot.message_handler(commands=['start'])
    def handle_start(message: types.Message):
        # 1. If command is received in a group or supergroup, register it as an admin notifications channel
        if message.chat.type in ('group', 'supergroup'):
            from .database import register_admin_chat
            title = message.chat.title or "Группа менеджеров"
            register_admin_chat(message.chat.id, title, message.chat.type)
            bot.reply_to(
                message,
                f"👋 **Здравствуйте! Caravan Railroad Bot активен в группе «{title}»!**\n\n"
                f"🆔 **Chat ID:** `{message.chat.id}`\n"
                f"✅ Группа успешно подключена!\n"
                f"🔔 Сюда будут мгновенно поступать все новые заявки клиентов из бота в режиме реального времени."
            )
            return

        tg_id = message.from_user.id
        user = get_user(tg_id)
        
        # If user is already registered, greet and show main menu
        if user and user.get('is_registered'):
            lang = user.get('language', DEFAULT_LANGUAGE)
            clear_state(tg_id)
            USER_STATES[tg_id] = {'lang': lang}
            
            welcome_msg = (
                f"👋 {t(lang, 'main_menu_title')}\n\n"
                f"🏢 **{user.get('company_name')}** ({user.get('full_name')})"
            )
            bot.send_message(
                tg_id,
                welcome_msg,
                reply_markup=get_main_menu_keyboard(lang)
            )
            return

        # If user is new or not registered, ask language first
        USER_STATES[tg_id] = {'state': 'SELECTING_LANG', 'data': {}}
        bot.send_message(
            tg_id,
            "🌐 Пожалуйста, выберите язык обслуживания\n"
            "Please select your language\n"
            "请选择您的服务语言:",
            reply_markup=get_language_keyboard()
        )

    @bot.message_handler(commands=['id', 'chatid', 'register_group', 'ping'])
    def handle_group_id_cmd(message: types.Message):
        from .database import register_admin_chat
        chat_id = message.chat.id
        title = message.chat.title or (message.from_user.first_name if message.from_user else "Чат")
        chat_type = message.chat.type
        register_admin_chat(chat_id, title, chat_type)
        bot.reply_to(
            message,
            f"✅ **Канал уведомлений подключен!**\n\n"
            f"📌 **Название:** {title}\n"
            f"🆔 **Chat ID:** `{chat_id}`\n"
            f"🏷 **Тип:** {chat_type}\n\n"
            f"🔔 Все новые заявки клиентов на ж/д тарифы и перевозки будут автоматически приходить сюда."
        )

    @bot.message_handler(content_types=['new_chat_members'])
    def handle_new_member(message: types.Message):
        from .database import register_admin_chat
        if message.chat.type in ('group', 'supergroup'):
            title = message.chat.title or "Группа менеджеров"
            register_admin_chat(message.chat.id, title, message.chat.type)
            try:
                bot_info = bot.get_me()
                for member in message.new_chat_members:
                    if member.id == bot_info.id:
                        bot.send_message(
                            message.chat.id,
                            f"👋 **Здравствуйте! Caravan Railroad Bot успешно подключен к группе «{title}»!**\n\n"
                            f"🆔 **Chat ID:** `{message.chat.id}`\n"
                            f"🔔 Все новые заявки клиентов из Telegram-бота будут публиковаться сюда в реальном времени."
                        )
                        break
            except Exception as e:
                logger.error(f"Error handling new chat member: {e}")

    @bot.message_handler(commands=['cancel'])
    def handle_cancel_cmd(message: types.Message):
        tg_id = message.from_user.id
        lang = get_user_lang(tg_id)
        clear_state(tg_id)
        bot.send_message(
            tg_id,
            t(lang, 'action_cancelled'),
            reply_markup=get_main_menu_keyboard(lang)
        )

    @bot.message_handler(commands=['profile'])
    def handle_profile_cmd(message: types.Message):
        tg_id = message.from_user.id
        show_profile(bot, tg_id)

    @bot.message_handler(commands=['leads'])
    def handle_leads_cmd(message: types.Message):
        tg_id = message.from_user.id
        show_my_leads(bot, tg_id)

    @bot.message_handler(commands=['about', 'help'])
    def handle_about_cmd(message: types.Message):
        tg_id = message.from_user.id
        lang = get_user_lang(tg_id)
        bot.send_message(
            tg_id,
            t(lang, 'about_text'),
            reply_markup=get_main_menu_keyboard(lang)
        )

    @bot.message_handler(commands=['lang'])
    def handle_lang_cmd(message: types.Message):
        tg_id = message.from_user.id
        bot.send_message(
            tg_id,
            "🌐 Выберите язык / Select language / 请选择语言:",
            reply_markup=get_language_keyboard()
        )

    # ------------------ CALLBACK QUERY HANDLERS ------------------ #

    @bot.callback_query_handler(func=lambda call: call.data.startswith('set_lang_'))
    def handle_lang_choice(call: types.CallbackQuery):
        tg_id = call.from_user.id
        selected_lang = call.data.replace('set_lang_', '')
        
        # Save to DB if user exists
        user = get_user(tg_id)
        if user:
            set_user_language(tg_id, selected_lang)
        
        if tg_id not in USER_STATES:
            USER_STATES[tg_id] = {}
        USER_STATES[tg_id]['lang'] = selected_lang
        
        bot.answer_callback_query(call.id, text=t(selected_lang, 'lang_selected'))
        
        # If user is already registered, acknowledge and show main menu
        if user and user.get('is_registered'):
            bot.edit_message_text(
                f"✅ {t(selected_lang, 'lang_selected')}",
                chat_id=tg_id,
                message_id=call.message.message_id
            )
            bot.send_message(
                tg_id,
                t(selected_lang, 'main_menu_title'),
                reply_markup=get_main_menu_keyboard(selected_lang)
            )
            return

        # Start registration flow
        USER_STATES[tg_id] = {
            'state': 'REG_ASK_PHONE',
            'lang': selected_lang,
            'data': {
                'telegram_id': tg_id,
                'username': call.from_user.username or '',
                'language': selected_lang
            }
        }
        
        bot.edit_message_text(
            f"✅ {t(selected_lang, 'lang_selected')}\n\n{t(selected_lang, 'reg_welcome')}",
            chat_id=tg_id,
            message_id=call.message.message_id
        )
        
        bot.send_message(
            tg_id,
            t(selected_lang, 'ask_phone'),
            reply_markup=get_phone_request_keyboard(selected_lang)
        )

    @bot.callback_query_handler(func=lambda call: call.data == "wiz_cancel")
    def handle_wiz_cancel(call: types.CallbackQuery):
        tg_id = call.from_user.id
        lang = get_user_lang(tg_id)
        clear_state(tg_id)
        bot.answer_callback_query(call.id, text=t(lang, 'action_cancelled'))
        bot.send_message(
            tg_id,
            t(lang, 'action_cancelled'),
            reply_markup=get_main_menu_keyboard(lang)
        )

    @bot.callback_query_handler(func=lambda call: call.data.startswith('wiz_'))
    def handle_wizard_callbacks(call: types.CallbackQuery):
        tg_id = call.from_user.id
        lang = get_user_lang(tg_id)
        state_info = USER_STATES.get(tg_id)
        
        if not state_info or 'state' not in state_info:
            bot.answer_callback_query(call.id, "Session expired.")
            bot.send_message(tg_id, t(lang, 'main_menu_title'), reply_markup=get_main_menu_keyboard(lang))
            return

        state = state_info['state']
        data = state_info['data']
        action = call.data
        
        # 1. Rail sub-type
        if state == 'RAIL_ASK_TYPE' and action.startswith('wiz_rail_type:'):
            chosen = action.split(':')[1]
            label = t(lang, 'rail_type_tariff') if chosen == 'tariff' else t(lang, 'rail_type_lease')
            data['rail_type'] = label
            state_info['state'] = 'RAIL_ASK_FROM'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'rail_ask_from'), reply_markup=get_cancel_keyboard(lang))

        # 2. Rail Wagon Type
        elif state == 'RAIL_ASK_WAGON' and action.startswith('wiz_wagon:'):
            w_code = action.split(':')[1]
            w_label = t(lang, f'wagon_{w_code}')
            data['wagon_type'] = w_label
            state_info['state'] = 'RAIL_ASK_FLEET'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {w_label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'rail_ask_fleet_opt'), reply_markup=get_fleet_opt_inline(lang))

        # 3. Rail Fleet Provision
        elif state == 'RAIL_ASK_FLEET' and action.startswith('wiz_fleet:'):
            f_code = action.split(':')[1]
            f_label = t(lang, f'fleet_opt_{f_code}')
            data['fleet_provision'] = f_label
            state_info['state'] = 'RAIL_ASK_VOLUME'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {f_label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'rail_ask_volume'), reply_markup=get_cancel_keyboard(lang))

        # 4. Road Truck Type
        elif state == 'ROAD_ASK_TRUCK' and action.startswith('wiz_truck:'):
            tr_code = action.split(':')[1]
            tr_label = t(lang, f'truck_{tr_code}')
            data['truck_type'] = tr_label
            state_info['state'] = 'ROAD_ASK_WEIGHT_VOL'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {tr_label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'road_ask_weight_vol'), reply_markup=get_cancel_keyboard(lang))

        # 5. Air Cargo Type
        elif state == 'AIR_ASK_TYPE' and action.startswith('wiz_air_type:'):
            a_code = action.split(':')[1]
            a_label = t(lang, f'air_cargo_{a_code}')
            data['cargo_category'] = a_label
            state_info['state'] = 'AIR_ASK_DIMS'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {a_label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'air_ask_dims'), reply_markup=get_cancel_keyboard(lang))

        # 6. Air Pickup
        elif state == 'AIR_ASK_PICKUP' and action.startswith('wiz_pickup:'):
            p_code = action.split(':')[1]
            p_label = t(lang, 'btn_yes') if p_code == 'yes' else t(lang, 'btn_no')
            data['pickup_required'] = p_label
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ Pick-up: {p_label}", chat_id=tg_id, message_id=call.message.message_id)
            prompt_summary_confirmation(bot, tg_id, lang, 'air', 'service_air', data)

        # 7. Multimodal Scheme
        elif state == 'MULTI_ASK_SCHEME' and action.startswith('wiz_multi_type:'):
            m_code = action.split(':')[1]
            m_label = t(lang, f'multi_{m_code}')
            data['multimodal_scheme'] = m_label
            state_info['state'] = 'MULTI_ASK_EQUIP'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {m_label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'multi_ask_equipment'), reply_markup=get_equipment_type_inline(lang))

        # 8. Multimodal Equipment
        elif state == 'MULTI_ASK_EQUIP' and action.startswith('wiz_equip:'):
            eq_code = action.split(':')[1]
            eq_label = t(lang, f'container_{eq_code}')
            data['equipment_type'] = eq_label
            state_info['state'] = 'MULTI_ASK_QTY'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {eq_label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'multi_ask_qty'), reply_markup=get_cancel_keyboard(lang))

        # 9. Customs Regime
        elif state == 'CUSTOMS_ASK_REGIME' and action.startswith('wiz_regime:'):
            r_code = action.split(':')[1]
            r_label = t(lang, f'customs_{r_code}')
            data['customs_regime'] = r_label
            state_info['state'] = 'CUSTOMS_ASK_GOODS'
            bot.answer_callback_query(call.id)
            bot.edit_message_text(f"✔️ {r_label}", chat_id=tg_id, message_id=call.message.message_id)
            bot.send_message(tg_id, t(lang, 'customs_ask_goods'), reply_markup=get_cancel_keyboard(lang))

    @bot.callback_query_handler(func=lambda call: call.data in ('profile_edit', 'profile_lang'))
    def handle_profile_callbacks(call: types.CallbackQuery):
        tg_id = call.from_user.id
        lang = get_user_lang(tg_id)
        if call.data == 'profile_lang':
            bot.answer_callback_query(call.id)
            bot.send_message(
                tg_id,
                "🌐 Выберите язык / Select language / 请选择语言:",
                reply_markup=get_language_keyboard()
            )
        elif call.data == 'profile_edit':
            USER_STATES[tg_id] = {
                'state': 'REG_ASK_PHONE',
                'lang': lang,
                'data': {
                    'telegram_id': tg_id,
                    'username': call.from_user.username or '',
                    'language': lang
                }
            }
            bot.answer_callback_query(call.id)
            bot.send_message(
                tg_id,
                f"✏️ {t(lang, 'ask_phone')}",
                reply_markup=get_phone_request_keyboard(lang)
            )

    # ------------------ CONTACT HANDLER ------------------ #

    @bot.message_handler(content_types=['contact'])
    def handle_contact(message: types.Message):
        tg_id = message.from_user.id
        lang = get_user_lang(tg_id)
        state_info = USER_STATES.get(tg_id)
        
        if not state_info or state_info.get('state') != 'REG_ASK_PHONE':
            # Unexpected contact
            return

        phone = message.contact.phone_number
        if not phone.startswith('+'):
            phone = f"+{phone}"
            
        state_info['data']['phone'] = phone
        state_info['state'] = 'REG_ASK_NAME'
        
        # Suggest full name from Telegram if available
        first_name = message.from_user.first_name or ''
        last_name = message.from_user.last_name or ''
        full_name_hint = f"{first_name} {last_name}".strip()
        
        prompt = t(lang, 'ask_name')
        if full_name_hint:
            prompt += f"\n*(Подсказка: {full_name_hint})*"
            
        bot.send_message(
            tg_id,
            prompt,
            reply_markup=get_cancel_keyboard(lang)
        )

    # ------------------ TEXT MESSAGE HANDLERS ------------------ #

    @bot.message_handler(content_types=['text'])
    def handle_text(message: types.Message):
        # In groups and supergroups, auto-register chat and reply to triggers or mentions
        if message.chat.type in ('group', 'supergroup'):
            from .database import register_admin_chat
            title = message.chat.title or "Группа менеджеров"
            register_admin_chat(message.chat.id, title, message.chat.type)
            text_clean = (message.text or '').strip().lower()
            
            # Words/commands that should trigger an instant status reply in the group
            triggers = [
                'старт', 'start', '/start',
                'айди', 'id', '/id', 'chatid', '/chatid',
                'пинг', 'ping', '/ping',
                'тест', 'test', '/test',
                'бот', 'bot', 'статус', 'status',
                'помощь', 'help', '/help', 'инфо', 'info'
            ]
            bot_user = ""
            try:
                bot_user = (bot.get_me().username or '').lower()
            except Exception:
                pass

            is_trigger = any(
                text_clean == t or text_clean.startswith(t + ' ') or text_clean.startswith(t + '@') or (' ' + t + ' ') in (' ' + text_clean + ' ')
                for t in triggers
            )
            is_mention = bool(bot_user and (f"@{bot_user}" in text_clean))

            if is_trigger or is_mention:
                try:
                    bot.reply_to(
                        message,
                        f"👋 **Caravan Railroad Bot на связи в группе «{title}»!**\n\n"
                        f"🆔 **Chat ID:** `{message.chat.id}`\n"
                        f"📌 **Статус:** `Онлайн / Канал уведомлений подключен`\n\n"
                        f"🔔 Все новые заявки клиентов на расчет ж/д тарифов и мультимодальной логистики "
                        f"будут автоматически публиковаться сюда в режиме реального времени."
                    )
                except Exception as e:
                    logger.error(f"Failed to reply to group trigger: {e}")
            return

        tg_id = message.from_user.id
        text = message.text.strip()
        lang = get_user_lang(tg_id)
        state_info = USER_STATES.get(tg_id, {})
        state = state_info.get('state')
        
        # Check for Cancel button in any language
        cancel_words = [
            t('ru', 'btn_cancel'), t('en', 'btn_cancel'), t('zh', 'btn_cancel'),
            '/cancel', 'Cancel', 'Отмена'
        ]
        if text in cancel_words:
            clear_state(tg_id)
            bot.send_message(
                tg_id,
                t(lang, 'action_cancelled'),
                reply_markup=get_main_menu_keyboard(lang)
            )
            return

        # Check for Skip button
        skip_words = [
            t('ru', 'btn_skip'), t('en', 'btn_skip'), t('zh', 'btn_skip'),
            '/skip', 'Skip', 'Пропустить'
        ]
        is_skip = text in skip_words

        # If user is in an active state machine step, route to FSM
        if state:
            process_fsm_step(bot, message, state, state_info, lang, is_skip)
            return

        # Main Menu button handlers (check against all languages)
        if is_button_match(text, 'btn_my_leads'):
            show_my_leads(bot, tg_id)
        elif is_button_match(text, 'btn_my_profile'):
            show_profile(bot, tg_id)
        elif is_button_match(text, 'btn_about'):
            bot.send_message(tg_id, t(lang, 'about_text'), reply_markup=get_main_menu_keyboard(lang))
        elif is_button_match(text, 'btn_change_lang'):
            bot.send_message(tg_id, "🌐 Select language / Выберите язык / 请选择语言:", reply_markup=get_language_keyboard())
        elif is_button_match(text, 'service_rail'):
            start_rail_wizard(bot, tg_id, lang)
        elif is_button_match(text, 'service_road'):
            start_road_wizard(bot, tg_id, lang)
        elif is_button_match(text, 'service_air'):
            start_air_wizard(bot, tg_id, lang)
        elif is_button_match(text, 'service_multi'):
            start_multi_wizard(bot, tg_id, lang)
        elif is_button_match(text, 'service_customs'):
            start_customs_wizard(bot, tg_id, lang)
        elif is_button_match(text, 'service_forwarding'):
            start_forwarding_wizard(bot, tg_id, lang)
        else:
            # Fallback prompt
            bot.send_message(
                tg_id,
                t(lang, 'main_menu_title'),
                reply_markup=get_main_menu_keyboard(lang)
            )

    return bot


# ------------------ FSM STEP PROCESSOR ------------------ #

def process_fsm_step(bot: telebot.TeleBot, message: types.Message, state: str, state_info: dict, lang: str, is_skip: bool):
    tg_id = message.from_user.id
    text = message.text.strip()
    data = state_info.get('data', {})

    # ================= REGISTRATION FSM ================= #
    if state == 'REG_ASK_PHONE':
        # Manual phone entry
        phone = text
        if not phone.startswith('+'):
            phone = f"+{phone}"
        data['phone'] = phone
        state_info['state'] = 'REG_ASK_NAME'
        bot.send_message(tg_id, t(lang, 'ask_name'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'REG_ASK_NAME':
        data['full_name'] = text
        state_info['state'] = 'REG_ASK_COMPANY'
        bot.send_message(tg_id, t(lang, 'ask_company'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'REG_ASK_COMPANY':
        data['company_name'] = text
        state_info['state'] = 'REG_ASK_EMAIL'
        bot.send_message(tg_id, t(lang, 'ask_email'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'REG_ASK_EMAIL':
        if not EMAIL_REGEX.match(text):
            bot.send_message(tg_id, t(lang, 'invalid_email'), reply_markup=get_cancel_keyboard(lang))
            return
            
        data['email'] = text
        # Complete registration in SQLite
        register_user(
            telegram_id=tg_id,
            username=message.from_user.username or '',
            full_name=data.get('full_name', ''),
            company_name=data.get('company_name', ''),
            phone=data.get('phone', ''),
            email=data.get('email', ''),
            language=lang
        )
        clear_state(tg_id)
        USER_STATES[tg_id] = {'lang': lang}
        
        bot.send_message(
            tg_id,
            t(lang, 'reg_success'),
            reply_markup=get_main_menu_keyboard(lang)
        )

    # ================= RAIL WIZARD FSM ================= #
    elif state == 'RAIL_ASK_FROM':
        data['origin_station'] = text
        state_info['state'] = 'RAIL_ASK_TO'
        bot.send_message(tg_id, t(lang, 'rail_ask_to'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'RAIL_ASK_TO':
        data['destination_station'] = text
        state_info['state'] = 'RAIL_ASK_CARGO'
        bot.send_message(tg_id, t(lang, 'rail_ask_cargo'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'RAIL_ASK_CARGO':
        data['cargo_name'] = text
        state_info['state'] = 'RAIL_ASK_WAGON'
        bot.send_message(tg_id, t(lang, 'rail_ask_wagon_type'), reply_markup=get_wagon_type_inline(lang))

    elif state == 'RAIL_ASK_VOLUME':
        data['volume'] = text
        state_info['state'] = 'RAIL_ASK_COMMENT'
        bot.send_message(tg_id, t(lang, 'rail_ask_comment'), reply_markup=get_skip_cancel_keyboard(lang))

    elif state == 'RAIL_ASK_COMMENT':
        data['comments'] = '—' if is_skip else text
        prompt_summary_confirmation(bot, tg_id, lang, 'rail', 'service_rail', data)

    # ================= ROAD WIZARD FSM ================= #
    elif state == 'ROAD_ASK_FROM':
        data['origin_location'] = text
        state_info['state'] = 'ROAD_ASK_TO'
        bot.send_message(tg_id, t(lang, 'road_ask_to'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'ROAD_ASK_TO':
        data['destination_location'] = text
        state_info['state'] = 'ROAD_ASK_TRUCK'
        bot.send_message(tg_id, t(lang, 'road_ask_truck_type'), reply_markup=get_truck_type_inline(lang))

    elif state == 'ROAD_ASK_WEIGHT_VOL':
        data['weight_and_volume'] = text
        state_info['state'] = 'ROAD_ASK_DATE'
        bot.send_message(tg_id, t(lang, 'road_ask_date'), reply_markup=get_skip_cancel_keyboard(lang))

    elif state == 'ROAD_ASK_DATE':
        data['readiness_date'] = 'По готовности' if is_skip else text
        prompt_summary_confirmation(bot, tg_id, lang, 'road', 'service_road', data)

    # ================= AIR WIZARD FSM ================= #
    elif state == 'AIR_ASK_FROM':
        data['origin_airport'] = text
        state_info['state'] = 'AIR_ASK_TO'
        bot.send_message(tg_id, t(lang, 'air_ask_to'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'AIR_ASK_TO':
        data['destination_airport'] = text
        state_info['state'] = 'AIR_ASK_TYPE'
        bot.send_message(tg_id, t(lang, 'air_ask_cargo_type'), reply_markup=get_air_cargo_type_inline(lang))

    elif state == 'AIR_ASK_DIMS':
        data['weight_and_dims'] = text
        state_info['state'] = 'AIR_ASK_PICKUP'
        bot.send_message(tg_id, t(lang, 'air_ask_pickup'), reply_markup=get_yes_no_inline('wiz_pickup', lang))

    # ================= MULTIMODAL WIZARD FSM ================= #
    elif state == 'MULTI_ASK_ROUTE':
        data['route'] = text
        state_info['state'] = 'MULTI_ASK_SCHEME'
        bot.send_message(tg_id, t(lang, 'multi_ask_type'), reply_markup=get_multi_type_inline(lang))

    elif state == 'MULTI_ASK_QTY':
        data['containers_and_weight'] = text
        prompt_summary_confirmation(bot, tg_id, lang, 'multimodal', 'service_multi', data)

    # ================= CUSTOMS WIZARD FSM ================= #
    elif state == 'CUSTOMS_ASK_COUNTRY':
        data['country_and_post'] = text
        state_info['state'] = 'CUSTOMS_ASK_REGIME'
        bot.send_message(tg_id, t(lang, 'customs_ask_regime'), reply_markup=get_customs_regime_inline(lang))

    elif state == 'CUSTOMS_ASK_GOODS':
        data['goods_and_hs_code'] = text
        state_info['state'] = 'CUSTOMS_ASK_CERTS'
        bot.send_message(tg_id, t(lang, 'customs_ask_certs'), reply_markup=get_skip_cancel_keyboard(lang))

    elif state == 'CUSTOMS_ASK_CERTS':
        data['certification'] = 'Не требуется' if is_skip else text
        prompt_summary_confirmation(bot, tg_id, lang, 'customs', 'service_customs', data)

    # ================= FORWARDING WIZARD FSM ================= #
    elif state == 'FWD_ASK_RAILWAYS':
        data['railway_administrations'] = text
        state_info['state'] = 'FWD_ASK_BORDER'
        bot.send_message(tg_id, t(lang, 'fwd_ask_border'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'FWD_ASK_BORDER':
        data['border_junctions'] = text
        state_info['state'] = 'FWD_ASK_DETAILS'
        bot.send_message(tg_id, t(lang, 'fwd_ask_details'), reply_markup=get_cancel_keyboard(lang))

    elif state == 'FWD_ASK_DETAILS':
        data['forwarding_services'] = text
        prompt_summary_confirmation(bot, tg_id, lang, 'forwarding', 'service_forwarding', data)

    # ================= CONFIRMATION FSM ================= #
    elif state == 'CONFIRM_LEAD':
        btn_confirm_match = is_button_match(text, 'btn_confirm')
        if btn_confirm_match:
            finalize_lead_submission(bot, tg_id, lang, state_info)
        else:
            bot.send_message(
                tg_id,
                t(lang, 'summary_confirm_prompt'),
                reply_markup=get_confirm_lead_keyboard(lang)
            )


# ------------------ WIZARD INITIATORS ------------------ #

def check_registered_before_service(bot: telebot.TeleBot, tg_id: int, lang: str) -> bool:
    """Ensure user is registered before submitting inquiries."""
    user = get_user(tg_id)
    if not user or not user.get('is_registered'):
        USER_STATES[tg_id] = {
            'state': 'REG_ASK_PHONE',
            'lang': lang,
            'data': {'telegram_id': tg_id, 'language': lang}
        }
        bot.send_message(
            tg_id,
            f"{t(lang, 'reg_welcome')}\n\n{t(lang, 'ask_phone')}",
            reply_markup=get_phone_request_keyboard(lang)
        )
        return False
    return True


def start_rail_wizard(bot: telebot.TeleBot, tg_id: int, lang: str):
    if not check_registered_before_service(bot, tg_id, lang):
        return
    USER_STATES[tg_id] = {
        'state': 'RAIL_ASK_TYPE',
        'lang': lang,
        'data': {'service_type': 'rail', 'service_name': t(lang, 'service_rail')}
    }
    bot.send_message(tg_id, t(lang, 'rail_type_title'), reply_markup=get_rail_type_inline(lang))


def start_road_wizard(bot: telebot.TeleBot, tg_id: int, lang: str):
    if not check_registered_before_service(bot, tg_id, lang):
        return
    USER_STATES[tg_id] = {
        'state': 'ROAD_ASK_FROM',
        'lang': lang,
        'data': {'service_type': 'road', 'service_name': t(lang, 'service_road')}
    }
    bot.send_message(
        tg_id,
        f"{t(lang, 'road_title')}\n\n{t(lang, 'road_ask_from')}",
        reply_markup=get_cancel_keyboard(lang)
    )


def start_air_wizard(bot: telebot.TeleBot, tg_id: int, lang: str):
    if not check_registered_before_service(bot, tg_id, lang):
        return
    USER_STATES[tg_id] = {
        'state': 'AIR_ASK_FROM',
        'lang': lang,
        'data': {'service_type': 'air', 'service_name': t(lang, 'service_air')}
    }
    bot.send_message(
        tg_id,
        f"{t(lang, 'air_title')}\n\n{t(lang, 'air_ask_from')}",
        reply_markup=get_cancel_keyboard(lang)
    )


def start_multi_wizard(bot: telebot.TeleBot, tg_id: int, lang: str):
    if not check_registered_before_service(bot, tg_id, lang):
        return
    USER_STATES[tg_id] = {
        'state': 'MULTI_ASK_ROUTE',
        'lang': lang,
        'data': {'service_type': 'multimodal', 'service_name': t(lang, 'service_multi')}
    }
    bot.send_message(
        tg_id,
        f"{t(lang, 'multi_title')}\n\n{t(lang, 'multi_ask_route')}",
        reply_markup=get_cancel_keyboard(lang)
    )


def start_customs_wizard(bot: telebot.TeleBot, tg_id: int, lang: str):
    if not check_registered_before_service(bot, tg_id, lang):
        return
    USER_STATES[tg_id] = {
        'state': 'CUSTOMS_ASK_COUNTRY',
        'lang': lang,
        'data': {'service_type': 'customs', 'service_name': t(lang, 'service_customs')}
    }
    bot.send_message(
        tg_id,
        f"{t(lang, 'customs_title')}\n\n{t(lang, 'customs_ask_country')}",
        reply_markup=get_cancel_keyboard(lang)
    )


def start_forwarding_wizard(bot: telebot.TeleBot, tg_id: int, lang: str):
    if not check_registered_before_service(bot, tg_id, lang):
        return
    USER_STATES[tg_id] = {
        'state': 'FWD_ASK_RAILWAYS',
        'lang': lang,
        'data': {'service_type': 'forwarding', 'service_name': t(lang, 'service_forwarding')}
    }
    bot.send_message(
        tg_id,
        f"{t(lang, 'fwd_title')}\n\n{t(lang, 'fwd_ask_railways')}",
        reply_markup=get_cancel_keyboard(lang)
    )


# ------------------ SUMMARY & SUBMISSION ------------------ #

def prompt_summary_confirmation(bot: telebot.TeleBot, tg_id: int, lang: str, s_type: str, s_name_key: str, data: dict):
    """Show review card and ask user to confirm."""
    USER_STATES[tg_id]['state'] = 'CONFIRM_LEAD'
    data['service_type'] = s_type
    data['service_name'] = t(lang, s_name_key)
    
    summary_text = t(lang, 'summary_header') + "\n"
    summary_text += format_lead_summary(lang, data)
    summary_text += f"\n\n{t(lang, 'summary_confirm_prompt')}"
    
    bot.send_message(
        tg_id,
        summary_text,
        reply_markup=get_confirm_lead_keyboard(lang)
    )


def notify_admins(bot: telebot.TeleBot, lead: dict, user: dict):
    """Forward incoming lead inquiry to admin/manager chat IDs and Telegram groups."""
    from .config import ADMIN_CHAT_IDS
    from .database import get_all_admin_chats
    
    target_chats = set()
    if ADMIN_CHAT_IDS:
        target_chats.update(ADMIN_CHAT_IDS)
        
    try:
        db_chats = get_all_admin_chats()
        for c in db_chats:
            target_chats.add(c["chat_id"])
    except Exception as e:
        logger.error(f"Error fetching admin chats from DB: {e}")
        
    if not target_chats:
        logger.warning(f"No admin chats or groups registered to receive lead {lead.get('lead_number')}")
        return

    lead_num = lead.get('lead_number', 'CR-LEAD')
    company = user.get('company_name', 'Клиент')
    service = lead.get('service_name', 'Логистика')
    phone = user.get('phone', '—')
    email = user.get('email', '—')
    full_name = user.get('full_name', '—')
    tg_user = user.get('username')
    tg_link = f"@{tg_user}" if tg_user else f"ID: {user.get('telegram_id')}"
    created_at = lead.get('created_at', time.strftime("%Y-%m-%d %H:%M:%S UTC"))
    
    msg = (
        f"🚨 **НОВАЯ ЗАЯВКА НА РАСЧЕТ: {lead_num}**\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"📦 **Направление:** {service}\n"
        f"🏢 **Компания:** {company}\n"
        f"👤 **Контакт:** {full_name} ({tg_link})\n"
        f"📞 **Телефон:** {phone}\n"
        f"✉️ **Email:** {email}\n"
        f"⏱ **Время подачи:** {created_at}\n\n"
        f"📋 **Параметры перевозки:**\n"
    )
    for k, v in lead.get('details', {}).items():
        if v:
            clean_k = str(k).replace('_', ' ').capitalize()
            msg += f"• **{clean_k}:** {v}\n"
            
    msg += "\n━━━━━━━━━━━━━━━━━━━━\n_Заявка принята через Caravan Railroad Telegram Bot_"

    for chat_id in target_chats:
        try:
            bot.send_message(chat_id, msg, parse_mode='Markdown')
            logger.info(f"Lead {lead_num} forwarded to admin chat {chat_id}")
        except Exception as e:
            logger.error(f"Failed to forward lead to admin {chat_id}: {e}")


def finalize_lead_submission(bot: telebot.TeleBot, tg_id: int, lang: str, state_info: dict):
    """Persist lead to SQLite, send email to info@caravanrailroad.com, notify admins, and confirm to user."""
    data = state_info.get('data', {})
    service_type = data.get('service_type', 'general')
    service_name = data.get('service_name', service_type)
    
    # Clean details dictionary (omit service_type and service_name)
    details = {k: v for k, v in data.items() if k not in ('service_type', 'service_name')}
    
    # 1. Create lead in SQLite DB
    lead = create_lead(
        telegram_id=tg_id,
        service_type=service_type,
        service_name=service_name,
        details=details
    )
    
    user = get_user(tg_id) or {}
    
    # 2. Dispatch email to info@caravanrailroad.com
    send_lead_email(lead, user)
    
    # 3. Notify admins / managers in Telegram
    notify_admins(bot, lead, user)
    
    # 4. Notify user with confirmation
    phone = user.get('phone', 'указанному номеру')
    conf_msg = t(
        lang,
        'lead_submitted',
        lead_number=lead['lead_number'],
        created_at=lead['created_at'],
        phone=phone
    )
    
    clear_state(tg_id)
    USER_STATES[tg_id] = {'lang': lang}
    
    bot.send_message(
        tg_id,
        conf_msg,
        reply_markup=get_main_menu_keyboard(lang)
    )


# ------------------ PROFILE & LEADS HELPERS ------------------ #

def show_profile(bot: telebot.TeleBot, tg_id: int):
    lang = get_user_lang(tg_id)
    user = get_user(tg_id)
    if not user or not user.get('is_registered'):
        bot.send_message(
            tg_id,
            "Вы еще не зарегистрированы. Пожалуйста, запустите команду /start для регистрации.",
            reply_markup=get_main_menu_keyboard(lang)
        )
        return

    profile_text = t(
        lang,
        'profile_text',
        full_name=user.get('full_name', '—'),
        company_name=user.get('company_name', '—'),
        phone=user.get('phone', '—'),
        email=user.get('email', '—'),
        language=user.get('language', 'ru').upper(),
        telegram_id=tg_id
    )
    bot.send_message(
        tg_id,
        f"{t(lang, 'profile_title')}\n\n{profile_text}",
        reply_markup=get_profile_edit_inline(lang)
    )


def show_my_leads(bot: telebot.TeleBot, tg_id: int):
    lang = get_user_lang(tg_id)
    leads = get_user_leads(tg_id, limit=5)
    
    if not leads:
        bot.send_message(
            tg_id,
            t(lang, 'my_leads_empty'),
            reply_markup=get_main_menu_keyboard(lang)
        )
        return
        
    msg = t(lang, 'my_leads_title') + "\n"
    for idx, l in enumerate(leads, 1):
        num = l.get('lead_number', 'N/A')
        s_name = l.get('service_name', 'Inquiry')
        dt = l.get('created_at', '')[:16]
        status = l.get('status', 'new').upper()
        msg += f"**{idx}. {num}** — {s_name}\n"
        msg += f"   📅 {dt} | Статус: `{status}`\n\n"
        
    bot.send_message(tg_id, msg, reply_markup=get_main_menu_keyboard(lang))


def is_button_match(text: str, key: str) -> bool:
    """Check if message matches key across any supported language."""
    for l in ('ru', 'en', 'zh'):
        val = t(l, key)
        if text.strip().lower() == val.strip().lower():
            return True
        # Partial check for emojis
        if text.strip().endswith(val.strip()):
            return True
    return False


# ------------------ MAIN RUNNER & INSTANCE ACCESS ------------------ #

_bot_instance: Optional[telebot.TeleBot] = None

def get_bot(token: str = None) -> telebot.TeleBot:
    """Return singleton instance of initialized TeleBot."""
    global _bot_instance
    if _bot_instance is None:
        init_db()
        tok = (token or BOT_TOKEN).strip()
        _bot_instance = init_bot(tok)
    return _bot_instance


def run(mode: str = "polling"):
    """Main execution loop for Caravan Railroad bot."""
    init_db()
    
    if not BOT_TOKEN or BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        logger.error(
            "CRITICAL: BOT_TOKEN is not configured! "
            "Please create a bot via @BotFather in Telegram and set TELEGRAM_BOT_TOKEN in .env"
        )
        return

    bot = get_bot(BOT_TOKEN)

    if mode == "webhook":
        logger.info("Bot instance ready for Webhook mode (no polling needed).")
        return bot

    logger.info("Starting Caravan Railroad Telegram Bot polling...")
    try:
        bot.remove_webhook()
        time.sleep(1)
    except Exception as e:
        logger.warning(f"Could not remove webhook before polling: {e}")
    
    while True:
        try:
            bot.infinity_polling(timeout=20, long_polling_timeout=20)
        except Exception as e:
            logger.error(f"Polling error: {e}. Reconnecting in 5 seconds...")
            time.sleep(5)


if __name__ == '__main__':
    run()

