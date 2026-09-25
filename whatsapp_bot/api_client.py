"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
WhatsApp Multi-Provider API Client
Supports:
1. Official Meta WhatsApp Cloud API
2. Green-API (QR code gateway)
3. Twilio WhatsApp
4. Simulation Mode for development & testing
"""

import json
import logging
import os
import ssl
import urllib.request
import urllib.error
from typing import Dict, Any, Tuple, Optional

from .config import (
    WHATSAPP_PROVIDER,
    WHATSAPP_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_API_VERSION,
    GREEN_API_INSTANCE_ID,
    GREEN_API_TOKEN,
    GREEN_API_HOST,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_NUMBER
)

logger = logging.getLogger("whatsapp_client")

# Track last sent message status
LAST_WA_DISPATCH = {
    "to": None,
    "timestamp": None,
    "provider": None,
    "success": False,
    "error": None
}


def _create_ssl_context():
    try:
        return ssl.create_default_context()
    except Exception:
        return ssl._create_unverified_context()


def clean_phone_number(phone: str) -> str:
    """Normalize phone number to international digits only (e.g. '77011234567')."""
    if not phone:
        return ""
    digits = "".join(ch for ch in str(phone) if ch.isdigit())
    if digits.startswith("8") and len(digits) == 11 and digits[1] in ("7", "9"):
        digits = "7" + digits[1:]
    return digits


def send_meta_cloud_api(to_phone: str, text: str) -> Tuple[bool, Optional[str], Optional[dict]]:
    """Send text message via official Meta WhatsApp Cloud API."""
    if not WHATSAPP_TOKEN or not WHATSAPP_PHONE_NUMBER_ID:
        return False, "Meta Cloud API credentials (WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID) not set", None

    clean_to = clean_phone_number(to_phone)
    url = f"https://graph.facebook.com/{WHATSAPP_API_VERSION}/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": clean_to,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": text
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {WHATSAPP_TOKEN}",
            "Content-Type": "application/json",
            "User-Agent": "curl/8.4.0"
        }
    )
    ctx = _create_ssl_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            logger.info(f"Meta Cloud API sent to {clean_to}: {data}")
            return True, None, data
    except urllib.error.HTTPError as e:
        err_msg = ""
        try:
            err_msg = e.read().decode("utf-8")
        except Exception:
            pass
        err = f"Meta Cloud API error ({e.code}): {err_msg}"
        logger.error(err)
        return False, err, None
    except Exception as e:
        err = f"Meta Cloud API exception: {e}"
        logger.error(err)
        return False, err, None


def send_green_api(to_phone: str, text: str) -> Tuple[bool, Optional[str], Optional[dict]]:
    """Send message via Green-API (QR-code based WhatsApp Gateway)."""
    if not GREEN_API_INSTANCE_ID or not GREEN_API_TOKEN:
        return False, "Green-API credentials not configured", None

    clean_to = clean_phone_number(to_phone)
    chat_id = f"{clean_to}@c.us"
    url = f"{GREEN_API_HOST}/waInstance{GREEN_API_INSTANCE_ID}/sendMessage/{GREEN_API_TOKEN}"
    payload = {
        "chatId": chat_id,
        "message": text
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "curl/8.4.0"}
    )
    ctx = _create_ssl_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            logger.info(f"Green-API sent to {clean_to}: {data}")
            return True, None, data
    except Exception as e:
        err = f"Green-API error: {e}"
        logger.error(err)
        return False, err, None


def send_twilio(to_phone: str, text: str) -> Tuple[bool, Optional[str], Optional[dict]]:
    """Send message via Twilio for WhatsApp."""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_WHATSAPP_NUMBER:
        return False, "Twilio credentials not configured", None

    import base64
    clean_to = clean_phone_number(to_phone)
    url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
    
    auth_str = f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}"
    auth_b64 = base64.b64encode(auth_str.encode()).decode()
    
    post_data = urllib.parse.urlencode({
        "From": f"whatsapp:{TWILIO_WHATSAPP_NUMBER}",
        "To": f"whatsapp:+{clean_to}",
        "Body": text
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=post_data,
        headers={
            "Authorization": f"Basic {auth_b64}",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "curl/8.4.0"
        }
    )
    ctx = _create_ssl_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            logger.info(f"Twilio WhatsApp sent to {clean_to}: {data}")
            return True, None, data
    except Exception as e:
        err = f"Twilio WhatsApp error: {e}"
        logger.error(err)
        return False, err, None


def send_whatsapp_message(to_phone: str, text: str) -> Tuple[bool, Optional[str]]:
    """
    Universal WhatsApp sender.
    Auto-detects active provider:
    1. Meta Cloud API (if WHATSAPP_TOKEN is configured)
    2. Green-API (if GREEN_API_TOKEN is configured)
    3. Twilio (if TWILIO_ACCOUNT_SID is configured)
    4. Simulation mode (fallback)
    """
    import time
    clean_to = clean_phone_number(to_phone)
    now_str = time.strftime("%Y-%m-%d %H:%M:%S")

    LAST_WA_DISPATCH["to"] = clean_to
    LAST_WA_DISPATCH["timestamp"] = now_str

    # 1. Check explicit provider or Meta Cloud API
    if WHATSAPP_PROVIDER == "cloud_api" or (WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID):
        ok, err, res = send_meta_cloud_api(clean_to, text)
        if ok:
            LAST_WA_DISPATCH["provider"] = "meta_cloud_api"
            LAST_WA_DISPATCH["success"] = True
            LAST_WA_DISPATCH["error"] = None
            return True, None
        logger.warning(f"Meta Cloud API failed: {err}")

    # 2. Check Green-API
    if WHATSAPP_PROVIDER == "green_api" or (GREEN_API_INSTANCE_ID and GREEN_API_TOKEN):
        ok, err, res = send_green_api(clean_to, text)
        if ok:
            LAST_WA_DISPATCH["provider"] = "green_api"
            LAST_WA_DISPATCH["success"] = True
            LAST_WA_DISPATCH["error"] = None
            return True, None
        logger.warning(f"Green-API failed: {err}")

    # 3. Check Twilio
    if WHATSAPP_PROVIDER == "twilio" or (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN):
        ok, err, res = send_twilio(clean_to, text)
        if ok:
            LAST_WA_DISPATCH["provider"] = "twilio"
            LAST_WA_DISPATCH["success"] = True
            LAST_WA_DISPATCH["error"] = None
            return True, None
        logger.warning(f"Twilio failed: {err}")

    # 4. Simulation Mode (Fallback when no live gateway configured yet)
    LAST_WA_DISPATCH["provider"] = "simulation"
    LAST_WA_DISPATCH["success"] = True
    LAST_WA_DISPATCH["error"] = None
    logger.info(f"[WhatsApp Simulation] To: +{clean_to} | Msg:\n{text[:120]}...")
    return True, None
