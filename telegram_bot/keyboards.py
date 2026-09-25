"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
Keyboards generator for Telegram Bot (Reply and Inline Keyboards)
Supports RU, EN, ZH localization
"""

from telebot import types
from .locales import t, LOCALES


def get_language_keyboard() -> types.InlineKeyboardMarkup:
    """Inline keyboard for choosing language (RU / EN / ZH)."""
    markup = types.InlineKeyboardMarkup(row_width=3)
    markup.add(
        types.InlineKeyboardButton("🇷🇺 Русский", callback_data="set_lang_ru"),
        types.InlineKeyboardButton("🇬🇧 English", callback_data="set_lang_en"),
        types.InlineKeyboardButton("🇨🇳 中文", callback_data="set_lang_zh")
    )
    return markup


def get_phone_request_keyboard(lang: str = 'ru') -> types.ReplyKeyboardMarkup:
    """Reply keyboard with one-tap contact sharing button."""
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    btn_contact = types.KeyboardButton(text=t(lang, 'btn_share_contact'), request_contact=True)
    btn_cancel = types.KeyboardButton(text=t(lang, 'btn_cancel'))
    markup.row(btn_contact)
    markup.row(btn_cancel)
    return markup


def get_main_menu_keyboard(lang: str = 'ru') -> types.ReplyKeyboardMarkup:
    """Main menu keyboard with 6 logistics services and user actions."""
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    
    # 6 Logistics services
    b_rail = types.KeyboardButton(t(lang, 'service_rail'))
    b_road = types.KeyboardButton(t(lang, 'service_road'))
    b_air = types.KeyboardButton(t(lang, 'service_air'))
    b_multi = types.KeyboardButton(t(lang, 'service_multi'))
    b_customs = types.KeyboardButton(t(lang, 'service_customs'))
    b_forwarding = types.KeyboardButton(t(lang, 'service_forwarding'))
    
    # User actions
    b_leads = types.KeyboardButton(t(lang, 'btn_my_leads'))
    b_profile = types.KeyboardButton(t(lang, 'btn_my_profile'))
    b_about = types.KeyboardButton(t(lang, 'btn_about'))
    b_lang = types.KeyboardButton(t(lang, 'btn_change_lang'))
    
    markup.add(b_rail, b_road)
    markup.add(b_air, b_multi)
    markup.add(b_customs, b_forwarding)
    markup.add(b_leads, b_profile)
    markup.add(b_about, b_lang)
    
    return markup


def get_skip_cancel_keyboard(lang: str = 'ru') -> types.ReplyKeyboardMarkup:
    """Keyboard for wizard steps where input can be skipped."""
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    markup.add(
        types.KeyboardButton(t(lang, 'btn_skip')),
        types.KeyboardButton(t(lang, 'btn_cancel'))
    )
    return markup


def get_cancel_keyboard(lang: str = 'ru') -> types.ReplyKeyboardMarkup:
    """Keyboard with just a Cancel button."""
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton(t(lang, 'btn_cancel')))
    return markup


def get_confirm_lead_keyboard(lang: str = 'ru') -> types.ReplyKeyboardMarkup:
    """Keyboard for final lead confirmation step."""
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    markup.add(
        types.KeyboardButton(t(lang, 'btn_confirm')),
        types.KeyboardButton(t(lang, 'btn_cancel'))
    )
    return markup


# ---------------- Inline Keyboards for Wizards ---------------- #

def get_rail_type_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Rail sub-service: Tariff & transport vs Rolling stock lease."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"🚆 {t(lang, 'rail_type_tariff')}", callback_data="wiz_rail_type:tariff"),
        types.InlineKeyboardButton(f"📑 {t(lang, 'rail_type_lease')}", callback_data="wiz_rail_type:lease"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_wagon_type_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Rail wagon type selector."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"📦 {t(lang, 'wagon_covered')}", callback_data="wiz_wagon:covered"),
        types.InlineKeyboardButton(f"⛏ {t(lang, 'wagon_open')}", callback_data="wiz_wagon:open"),
        types.InlineKeyboardButton(f"📐 {t(lang, 'wagon_platform')}", callback_data="wiz_wagon:platform"),
        types.InlineKeyboardButton(f"🛢 {t(lang, 'wagon_tank')}", callback_data="wiz_wagon:tank"),
        types.InlineKeyboardButton(f"🌾 {t(lang, 'wagon_hopper')}", callback_data="wiz_wagon:hopper"),
        types.InlineKeyboardButton(f"🚢 {t(lang, 'wagon_container')}", callback_data="wiz_wagon:container"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_fleet_opt_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Caravan Railroad fleet vs Shipper's own fleet."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"🔹 {t(lang, 'fleet_opt_caravan')}", callback_data="wiz_fleet:caravan"),
        types.InlineKeyboardButton(f"🔸 {t(lang, 'fleet_opt_client')}", callback_data="wiz_fleet:client"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_truck_type_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Road freight truck type selector."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"🚛 {t(lang, 'truck_tent_standard')}", callback_data="wiz_truck:tent_standard"),
        types.InlineKeyboardButton(f"🚚 {t(lang, 'truck_tent_mega')}", callback_data="wiz_truck:tent_mega"),
        types.InlineKeyboardButton(f"❄️ {t(lang, 'truck_ref')}", callback_data="wiz_truck:reefer"),
        types.InlineKeyboardButton(f"🚜 {t(lang, 'truck_oversized')}", callback_data="wiz_truck:oversized"),
        types.InlineKeyboardButton(f"📦 {t(lang, 'truck_container')}", callback_data="wiz_truck:container"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_air_cargo_type_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Air cargo category selector."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"📦 {t(lang, 'air_cargo_general')}", callback_data="wiz_air_type:general"),
        types.InlineKeyboardButton(f"⚠️ {t(lang, 'air_cargo_dgr')}", callback_data="wiz_air_type:dgr"),
        types.InlineKeyboardButton(f"🌡 {t(lang, 'air_cargo_temp')}", callback_data="wiz_air_type:temperature"),
        types.InlineKeyboardButton(f"⚡️ {t(lang, 'air_cargo_express')}", callback_data="wiz_air_type:express"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_yes_no_inline(prefix: str, lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Generic Yes/No inline selector."""
    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton(f"✅ {t(lang, 'btn_yes')}", callback_data=f"{prefix}:yes"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_no')}", callback_data=f"{prefix}:no")
    )
    return markup


def get_multi_type_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Multimodal logistics scheme selector."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"🌊 {t(lang, 'multi_sea_rail')}", callback_data="wiz_multi_type:sea_rail"),
        types.InlineKeyboardButton(f"🛣 {t(lang, 'multi_road_rail')}", callback_data="wiz_multi_type:road_rail"),
        types.InlineKeyboardButton(f"🚢 {t(lang, 'multi_transcaspian')}", callback_data="wiz_multi_type:transcaspian"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_equipment_type_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Container equipment selector."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"📦 {t(lang, 'container_20dc')}", callback_data="wiz_equip:20dc"),
        types.InlineKeyboardButton(f"📦 {t(lang, 'container_40hc')}", callback_data="wiz_equip:40hc"),
        types.InlineKeyboardButton(f"❄️ {t(lang, 'container_40rf')}", callback_data="wiz_equip:40rf"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_customs_regime_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Customs clearance regime selector."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"📥 {t(lang, 'customs_import')}", callback_data="wiz_regime:import"),
        types.InlineKeyboardButton(f"📤 {t(lang, 'customs_export')}", callback_data="wiz_regime:export"),
        types.InlineKeyboardButton(f"🔄 {t(lang, 'customs_transit')}", callback_data="wiz_regime:transit"),
        types.InlineKeyboardButton(f"❌ {t(lang, 'btn_cancel')}", callback_data="wiz_cancel")
    )
    return markup


def get_profile_edit_inline(lang: str = 'ru') -> types.InlineKeyboardMarkup:
    """Inline button to re-edit profile."""
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(t(lang, 'btn_edit_profile'), callback_data="profile_edit"),
        types.InlineKeyboardButton(t(lang, 'btn_change_lang'), callback_data="profile_lang")
    )
    return markup
