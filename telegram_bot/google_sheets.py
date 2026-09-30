"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
Google Sheets Cloud Persistence Service
Provides permanent cloud storage for Users and Leads across Render restarts.
Also triggers native Gmail dispatch from kingsonyuk@gmail.com to info@caravanrailroad.com.
"""

import json
import logging
import ssl
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List

from .config import GOOGLE_SHEETS_URL

logger = logging.getLogger("google_sheets_sync")


def _execute_request(req: urllib.request.Request, timeout: int = 25) -> bytes:
    """Execute HTTP request to Google Apps Script Web App."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
    except Exception:
        ctx = ssl._create_unverified_context()
    with urllib.request.urlopen(req, context=ctx, timeout=timeout) as resp:
        return resp.read()


def is_sheets_configured() -> bool:
    """Check if Google Sheets Web App URL is set."""
    return bool(GOOGLE_SHEETS_URL and GOOGLE_SHEETS_URL.startswith("http"))


def ping_sheets() -> tuple:
    """Verify connection to Google Sheets Web App."""
    if not is_sheets_configured():
        return False, "GOOGLE_SHEETS_URL not configured"
    try:
        url = f"{GOOGLE_SHEETS_URL}?action=ping"
        req = urllib.request.Request(url, headers={"User-Agent": "CaravanBot/1.0"})
        raw = _execute_request(req, timeout=10)
        data = json.loads(raw.decode("utf-8"))
        return True, data
    except Exception as e:
        return False, str(e)


def sync_user_to_sheets(telegram_id: int, full_name: str, company_name: str, phone: str, email: str, language: str = 'ru') -> bool:
    """Save or update user registration in Google Sheets."""
    if not is_sheets_configured():
        return False
    try:
        payload = {
            "action": "register_user",
            "telegram_id": str(telegram_id),
            "full_name": full_name or "",
            "company_name": company_name or "",
            "phone": phone or "",
            "email": email or "",
            "language": language or "ru"
        }
        req = urllib.request.Request(
            GOOGLE_SHEETS_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "CaravanBot/1.0"}
        )
        raw = _execute_request(req, timeout=15)
        data = json.loads(raw.decode("utf-8"))
        logger.info(f"User {telegram_id} successfully synced to Google Sheets: {data}")
        return True
    except Exception as e:
        logger.error(f"Failed to sync user {telegram_id} to Google Sheets: {e}")
        return False


def get_user_from_sheets(telegram_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve user registration from Google Sheets (survives Render restarts)."""
    if not is_sheets_configured():
        return None
    try:
        url = f"{GOOGLE_SHEETS_URL}?action=get_user&telegram_id={telegram_id}"
        req = urllib.request.Request(url, headers={"User-Agent": "CaravanBot/1.0"})
        raw = _execute_request(req, timeout=10)
        data = json.loads(raw.decode("utf-8"))
        if data.get("ok") and data.get("found"):
            return data.get("user")
        return None
    except Exception as e:
        logger.error(f"Failed to get user {telegram_id} from Google Sheets: {e}")
        return None


def sync_lead_to_sheets(lead: dict, user: dict, html_content: str = None) -> bool:
    """Save lead to Google Sheets and trigger email dispatch to info@caravanrailroad.com."""
    if not is_sheets_configured():
        return False
    try:
        payload = {
            "action": "create_lead",
            "telegram_id": str(user.get("telegram_id", "")),
            "lead": lead,
            "user": user,
            "html": html_content or ""
        }
        req = urllib.request.Request(
            GOOGLE_SHEETS_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "CaravanBot/1.0"}
        )
        raw = _execute_request(req, timeout=20)
        data = json.loads(raw.decode("utf-8"))
        logger.info(f"Lead {lead.get('lead_number')} synced to Google Sheets: {data}")
        return True
    except Exception as e:
        logger.error(f"Failed to sync lead to Google Sheets: {e}")
        return False


def get_leads_from_sheets(telegram_id: int) -> List[Dict[str, Any]]:
    """Fetch user's historical leads directly from Google Sheets."""
    if not is_sheets_configured():
        return []
    try:
        url = f"{GOOGLE_SHEETS_URL}?action=get_leads&telegram_id={telegram_id}"
        req = urllib.request.Request(url, headers={"User-Agent": "CaravanBot/1.0"})
        raw = _execute_request(req, timeout=10)
        data = json.loads(raw.decode("utf-8"))
        if data.get("ok"):
            return data.get("leads", [])
        return []
    except Exception as e:
        logger.error(f"Failed to get leads for {telegram_id} from Google Sheets: {e}")
        return []

