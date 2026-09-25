"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
WhatsApp Assistant Bot Configuration Module
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base directories
BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

# Load environment variables
for candidate in [BASE_DIR / '.env', PROJECT_DIR / '.env']:
    if candidate.exists():
        load_dotenv(dotenv_path=candidate, override=False)
load_dotenv()

# WhatsApp Gateway Provider: 'auto', 'cloud_api' (Meta), 'green_api', 'twilio', 'simulation'
WHATSAPP_PROVIDER = os.getenv("WHATSAPP_PROVIDER", "auto").strip().lower()

# 1. Meta WhatsApp Cloud API (Official free tier 1,000 conversations/month)
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "").strip()
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "").strip()
WHATSAPP_BUSINESS_ACCOUNT_ID = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID", "").strip()
WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "caravan_wa_verify_2026").strip()
WHATSAPP_API_VERSION = os.getenv("WHATSAPP_API_VERSION", "v19.0").strip()

# 2. Green-API (QR-code based gateway for standard WhatsApp numbers without Meta verification)
GREEN_API_INSTANCE_ID = os.getenv("GREEN_API_INSTANCE_ID", "").strip()
GREEN_API_TOKEN = os.getenv("GREEN_API_TOKEN", "").strip()
GREEN_API_HOST = os.getenv("GREEN_API_HOST", "https://api.green-api.com").strip().rstrip("/")

# 3. Twilio for WhatsApp
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "").strip()

# Notifications
WHATSAPP_MANAGER_PHONE = os.getenv("WHATSAPP_MANAGER_PHONE", "").strip()

# Company Contact Info
COMPANY_PHONE = "+99895 157 8888"
COMPANY_EMAIL = "info@caravanrailroad.com"
COMPANY_WEBSITE = "https://caravanrailroad.com"
COMPANY_NAME = "Caravan Railroad & Multimodal Logistics"
DEFAULT_LANGUAGE = "ru"
