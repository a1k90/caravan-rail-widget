"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
WhatsApp Text & Menu Formatter
Adapts markdown and structural menus to WhatsApp formatting standards.
"""

import re
from typing import List, Tuple, Optional


def to_whatsapp_format(text: str) -> str:
    """
    Convert Markdown formatting to WhatsApp native formatting:
    - **bold** -> *bold*
    - __bold__ -> *bold*
    - strikethrough ~~text~~ -> ~text~
    """
    if not text:
        return ""
    # Convert **bold** to *bold*
    res = re.sub(r'\*\*(.+?)\*\*', r'*\1*', text)
    # Convert __bold__ to *bold*
    res = re.sub(r'__(.+?)__', r'*\1*', res)
    # Convert ~~strike~~ to ~strike~
    res = re.sub(r'~~(.+?)~~', r'~\1~', res)
    return res


def format_numbered_menu(title: str, options: List[Tuple[str, str]], footer: Optional[str] = None) -> str:
    """
    Format a numbered menu list for WhatsApp.
    Example:
    options = [("1", "🚂 Ж/Д перевозки"), ("2", "🚛 Автоперевозки")]
    """
    lines = [to_whatsapp_format(title), ""]
    for num, label in options:
        lines.append(f"*{num}.* {label}")
    
    if footer:
        lines.append("")
        lines.append(f"_{footer}_")
    else:
        lines.append("")
        lines.append("_👉 Отправьте цифру нужного пункта в ответ:_")
        
    return "\n".join(lines)


def format_whatsapp_lead_summary(lead_number: str, data: dict, user: dict, created_at: str) -> str:
    """Format branded confirmation message for the client in WhatsApp."""
    company = user.get('company_name', 'Организация')
    client = user.get('full_name', 'Клиент')
    service = data.get('service_name', 'Логистические услуги')
    
    msg = (
        f"✅ *ЗАЯВКА {lead_number} ПРИНЯТА!*\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"🏢 *Организация:* {company}\n"
        f"👤 *Контактное лицо:* {client}\n"
        f"📦 *Направление:* {service}\n"
        f"⏱ *Время:* {created_at}\n\n"
        f"*Параметры перевозки:*\n"
    )
    for k, v in data.items():
        if k not in ('service_type', 'service_name') and v:
            clean_k = str(k).replace('_', ' ').capitalize()
            msg += f"• *{clean_k}:* {v}\n"
            
    msg += (
        f"\n━━━━━━━━━━━━━━━━━━━━\n"
        f"Ваша заявка направлена ведущему менеджеру направления.\n"
        f"Расчет ставки и коммерческое предложение будут подготовлены в кратчайшие сроки.\n\n"
        f"📞 *Телефон:* +99895 157 8888\n"
        f"✉️ *Email:* info@caravanrailroad.com\n"
        f"🌐 *Сайт:* https://caravanrailroad.com\n\n"
        f"_Спасибо, что выбираете Caravan Railroad!_"
    )
    return msg
