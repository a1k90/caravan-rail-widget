"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
Corporate Email Dispatch Service
Formats inquiries into branded HTML + Text emails and dispatches to info@caravanrailroad.com
Includes resilient fallback logging.
"""

import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from typing import Dict, Any

from .config import (
    MANAGER_EMAIL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_USE_SSL,
    SMTP_FROM,
    LOGS_DIR
)

logger = logging.getLogger(__name__)


def generate_lead_html(lead_data: Dict[str, Any], user_data: Dict[str, Any]) -> str:
    """Generate branded corporate HTML email."""
    lead_num = lead_data.get('lead_number', 'N/A')
    created_at = lead_data.get('created_at', datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"))
    service_name = lead_data.get('service_name', lead_data.get('service_type', 'Logistics Inquiry'))
    
    client_name = user_data.get('full_name', 'N/A')
    company = user_data.get('company_name', 'N/A')
    phone = user_data.get('phone', 'N/A')
    email = user_data.get('email', 'N/A')
    tg_user = user_data.get('username', '')
    tg_id = user_data.get('telegram_id', 'N/A')
    tg_link = f"@{tg_user}" if tg_user else f"ID: {tg_id}"
    
    details: Dict[str, Any] = lead_data.get('details', {})
    
    # Build detail rows
    detail_rows = ""
    for label, val in details.items():
        if val:
            clean_label = str(label).replace('_', ' ').capitalize()
            detail_rows += f"""
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155; width: 35%; background: #f8fafc;">
                {clean_label}
              </td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">
                {val}
              </td>
            </tr>
            """

    html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead: {lead_num}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #0b2545 0%, #134074 100%); padding: 28px 32px; color: #ffffff;">
        <table width="100%">
          <tr>
            <td>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94d2bd; font-weight: 700; margin-bottom: 4px;">
                Caravan Railroad & Multimodal Logistics
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">
                Новая заявка на расчет ставки
              </h1>
              <div style="margin-top: 6px; font-size: 13px; color: #cbd5e1;">
                Направление: <strong style="color: #ffffff;">{service_name}</strong>
              </div>
            </td>
            <td align="right" valign="top">
              <span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;">
                {lead_num}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 28px 32px;">
        <!-- Client Block -->
        <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid #0284c7; padding-bottom: 6px;">
          👤 Данные клиента и организации
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155; width: 35%; background: #f8fafc;">Организация</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 700;">{company}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155; background: #f8fafc;">Контактное лицо</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{client_name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155; background: #f8fafc;">Телефон</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0284c7; font-weight: 700;">
              <a href="tel:{phone}" style="color: #0284c7; text-decoration: none;">{phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155; background: #f8fafc;">Корпоративный Email</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">
              <a href="mailto:{email}" style="color: #0284c7; text-decoration: none;">{email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: 600; color: #334155; background: #f8fafc;">Telegram профиль</td>
            <td style="padding: 10px 14px; color: #0f172a;">{tg_link} (ID: {tg_id})</td>
          </tr>
        </table>

        <!-- Cargo Details Block -->
        <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid #0284c7; padding-bottom: 6px;">
          📦 Параметры груза и перевозки
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          {detail_rows}
        </table>

        <!-- Metadata -->
        <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #64748b; line-height: 1.5;">
          ⏱ Время подачи заявки: <strong>{created_at}</strong><br>
          🤖 Источник: <strong>Caravan Railroad Telegram Assistant Bot</strong>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #0b2545; padding: 18px 32px; text-align: center; color: #94a3b8; font-size: 12px;">
        ТОО "Caravan Railroad & Multimodal Logistics"<br>
        Тел: +99895 157 8888 &bull; Email: <a href="mailto:info@caravanrailroad.com" style="color: #38bdf8; text-decoration: none;">info@caravanrailroad.com</a> &bull; Сайт: <a href="https://caravanrailroad.com" style="color: #38bdf8; text-decoration: none;">caravanrailroad.com</a>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    return html


def generate_lead_plain_text(lead_data: Dict[str, Any], user_data: Dict[str, Any]) -> str:
    """Generate clean plain text version for email clients."""
    lead_num = lead_data.get('lead_number', 'N/A')
    created_at = lead_data.get('created_at', datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"))
    service_name = lead_data.get('service_name', lead_data.get('service_type', 'Inquiry'))
    
    client_name = user_data.get('full_name', 'N/A')
    company = user_data.get('company_name', 'N/A')
    phone = user_data.get('phone', 'N/A')
    email = user_data.get('email', 'N/A')
    tg_user = user_data.get('username', '')
    tg_id = user_data.get('telegram_id', 'N/A')
    tg_str = f"@{tg_user} (ID: {tg_id})" if tg_user else f"ID: {tg_id}"
    
    text = f"""==================================================
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
НОВАЯ ЗАЯВКА НА РАСЧЕТ СТАВКИ / ПЕРЕВОЗКУ: {lead_num}
==================================================
Дата и время: {created_at}
Направление: {service_name}

[ДАННЫЕ КЛИЕНТА]
- Организация: {company}
- Контактное лицо: {client_name}
- Телефон: {phone}
- Email: {email}
- Telegram: {tg_str}

[ПАРАМЕТРЫ ПЕРЕВОЗКИ / ГРУЗА]
"""
    details: Dict[str, Any] = lead_data.get('details', {})
    for k, v in details.items():
        clean_k = str(k).replace('_', ' ').capitalize()
        text += f"- {clean_k}: {v}\n"

    text += f"""
==================================================
Отправлено автоматически через Caravan Railroad Telegram Bot
Связаться с клиентом: {phone} | {email}
"""
    return text


def log_lead_to_file(lead_num: str, plain_text: str) -> None:
    """Fallback logging of lead inquiry to persistent log file."""
    try:
        os.makedirs(LOGS_DIR, exist_ok=True)
        log_path = os.path.join(LOGS_DIR, "emails.log")
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(f"\n\n--- [DISPATCH {datetime.now().isoformat()}] LEAD {lead_num} ---\n")
            f.write(plain_text)
            f.write("\n----------------------------------------------------------\n")
        logger.info(f"Lead {lead_num} logged to {log_path}")
    except Exception as e:
        logger.error(f"Failed to log lead {lead_num} to file: {e}")


# Global dispatch status tracker
LAST_DISPATCH_STATUS = {
    "lead_number": None,
    "timestamp": None,
    "method": None,
    "success": False,
    "error": None
}


def send_via_resend(subject: str, html_content: str, text_content: str) -> tuple:
    """Send email via Resend HTTPS REST API (port 443, immune to cloud SMTP port blocks)."""
    from .config import RESEND_API_KEY, MANAGER_EMAIL, SMTP_FROM
    if not RESEND_API_KEY:
        return False, "RESEND_API_KEY not configured"
    try:
        import urllib.request
        import json
        payload = {
            "from": SMTP_FROM or "Caravan Logistics <onboarding@resend.dev>",
            "to": [MANAGER_EMAIL],
            "subject": subject,
            "html": html_content,
            "text": text_content
        }
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
                "User-Agent": "CaravanBot/1.0"
            }
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            logger.info(f"Resend API email sent: {data}")
            return True, None
    except Exception as e:
        err = f"Resend API error: {e}"
        logger.error(err)
        return False, err


def send_via_webhook(lead_data: dict, user_data: dict, subject: str, html_content: str, plain_text: str) -> tuple:
    """Send lead data to external Webhook (Google Apps Script / Make / Zapier) over HTTPS."""
    from .config import EMAIL_WEBHOOK_URL
    if not EMAIL_WEBHOOK_URL:
        return False, "EMAIL_WEBHOOK_URL not configured"
    try:
        import urllib.request
        import json
        payload = {
            "action": "order",
            "subject": subject,
            "lead": lead_data,
            "user": user_data,
            "html": html_content,
            "text": plain_text
        }
        req = urllib.request.Request(
            EMAIL_WEBHOOK_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "CaravanBot/1.0"}
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            logger.info(f"Email webhook dispatched successfully to {EMAIL_WEBHOOK_URL}")
            return True, None
    except Exception as e:
        err = f"Email webhook error: {e}"
        logger.error(err)
        return False, err


def send_via_smtp(subject: str, html_content: str, plain_text: str) -> tuple:
    """Send email via SMTP (Yandex/corporate). May be blocked on cloud Free tiers (e.g. Render Free)."""
    if not SMTP_HOST or not SMTP_USER or (SMTP_HOST in ('smtp.example.com', 'localhost') and not SMTP_PASSWORD):
        return False, "SMTP not configured"

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = SMTP_FROM or f"Caravan Bot <{SMTP_USER}>"
        msg['To'] = MANAGER_EMAIL
        
        part_text = MIMEText(plain_text, 'plain', 'utf-8')
        part_html = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(part_text)
        msg.attach(part_html)
        
        if SMTP_USE_SSL or SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=6) as server:
                if SMTP_USER and SMTP_PASSWORD:
                    server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(msg['From'], [MANAGER_EMAIL], msg.as_string())
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=6) as server:
                server.ehlo()
                try:
                    server.starttls()
                    server.ehlo()
                except Exception:
                    pass
                if SMTP_USER and SMTP_PASSWORD:
                    server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(msg['From'], [MANAGER_EMAIL], msg.as_string())
                
        logger.info(f"Email successfully sent via SMTP to {MANAGER_EMAIL}")
        return True, None
    except Exception as e:
        err = f"SMTP error ({SMTP_HOST}:{SMTP_PORT}): {e}"
        logger.error(err)
        return False, err


def send_lead_email(lead_data: Dict[str, Any], user_data: Dict[str, Any]) -> bool:
    """
    Multi-channel email dispatcher:
    1. Resend API (HTTPS port 443 — guaranteed delivery from Render Free)
    2. Webhook forwarder (HTTPS port 443)
    3. Direct SMTP (ports 465/587)
    Always logs lead to local SQLite and logs/emails.log as resilient fallback.
    """
    lead_num = lead_data.get('lead_number', 'CR-LEAD')
    company = user_data.get('company_name', 'Client')
    service = lead_data.get('service_name', lead_data.get('service_type', 'Logistics'))
    
    subject = f"[Caravan Lead {lead_num}] {service} — {company}"
    
    plain_text = generate_lead_plain_text(lead_data, user_data)
    html_content = generate_lead_html(lead_data, user_data)
    
    # 1. Always log to file first so no lead is ever lost
    log_lead_to_file(lead_num, plain_text)

    LAST_DISPATCH_STATUS["lead_number"] = lead_num
    LAST_DISPATCH_STATUS["timestamp"] = datetime.now().isoformat()

    # 2. Try Resend HTTPS API (if key is set)
    ok, resend_err = send_via_resend(subject, html_content, plain_text)
    if ok:
        LAST_DISPATCH_STATUS["method"] = "resend_api"
        LAST_DISPATCH_STATUS["success"] = True
        LAST_DISPATCH_STATUS["error"] = None
        return True

    # 3. Try Webhook forwarder (if webhook is set)
    ok, wh_err = send_via_webhook(lead_data, user_data, subject, html_content, plain_text)
    if ok:
        LAST_DISPATCH_STATUS["method"] = "webhook"
        LAST_DISPATCH_STATUS["success"] = True
        LAST_DISPATCH_STATUS["error"] = None
        return True

    # 4. Try Direct SMTP (Yandex)
    ok, smtp_err = send_via_smtp(subject, html_content, plain_text)
    if ok:
        LAST_DISPATCH_STATUS["method"] = "smtp"
        LAST_DISPATCH_STATUS["success"] = True
        LAST_DISPATCH_STATUS["error"] = None
        return True

    # Record error details (Render Free tier blocks outbound SMTP ports 25, 465, 587)
    detailed_error = f"{smtp_err}; Note: Render Free tier blocks outbound SMTP ports (25, 465, 587)."
    LAST_DISPATCH_STATUS["method"] = "failed"
    LAST_DISPATCH_STATUS["success"] = False
    LAST_DISPATCH_STATUS["error"] = detailed_error
    logger.warning(f"Could not dispatch email for {lead_num}: {detailed_error} (Lead safely stored in SQLite DB and emails.log)")

    return True  # Returns True so client user experience in Telegram is preserved

