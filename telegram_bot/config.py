"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
Telegram Bot Configuration Module
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Базовая директория бота
BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

# Загрузка переменных окружения из .env (поиск в telegram_bot/ и в корне проекта)
for candidate in [BASE_DIR / '.env', PROJECT_DIR / '.env']:
    if candidate.exists():
        load_dotenv(dotenv_path=candidate, override=False)
load_dotenv()

# Telegram Bot Token (получается у @BotFather)
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8919607192:AAHDODBt7PjRmgT7M4WRaAivVT6gN8LybnI").strip()

# Корпоративная почта для приема заявок клиентов
MANAGER_EMAIL = os.getenv("MANAGER_EMAIL", "info@caravanrailroad.com").strip()

# Telegram Chat ID администраторов / менеджеров (через запятую)
ADMIN_CHAT_IDS = [
    int(x.strip()) for x in os.getenv("ADMIN_CHAT_IDS", "").split(",") if x.strip().isdigit()
]

# Настройки SMTP для отправки писем
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.yandex.ru").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "465").strip() or 465)
SMTP_USER = os.getenv("SMTP_USER", "bot@caravanrailroad.com").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "juftok-ruhva111").strip()
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "false").lower() in ("true", "1", "yes")
SMTP_USE_SSL = os.getenv("SMTP_USE_SSL", "true").lower() in ("true", "1", "yes")
SMTP_FROM = os.getenv("SMTP_FROM", os.getenv("EMAIL_FROM", "Caravan Railroad Bot <bot@caravanrailroad.com>")).strip()
EMAIL_FROM = SMTP_FROM

# Язык по умолчанию
DEFAULT_LANGUAGE = os.getenv("DEFAULT_LANGUAGE", "ru").strip()

# База данных SQLite и Логи
DB_PATH = os.getenv("DB_PATH", str(BASE_DIR / "caravan_bot.db"))
LOGS_DIR = str(BASE_DIR / "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

# Контакты компании для инфо-раздела
COMPANY_PHONE = "+99895 157 8888"
COMPANY_EMAIL = "info@caravanrailroad.com"
COMPANY_WEBSITE = "https://caravanrailroad.com"
COMPANY_TELEGRAM_SUPPORT = "@caravan_rail_support"

