"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
SQLite Database Layer for Telegram Bot
"""

import sqlite3
import json
from datetime import datetime, timezone
from pathlib import Path
from .config import DB_PATH


def get_connection():
    """Возвращает соединение с базой данных SQLite."""
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=15)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Инициализация таблиц базы данных."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Таблица пользователей (корпоративных клиентов)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                telegram_id INTEGER PRIMARY KEY,
                username TEXT,
                full_name TEXT,
                company_name TEXT,
                phone TEXT,
                email TEXT,
                language TEXT DEFAULT 'ru',
                is_registered INTEGER DEFAULT 0,
                created_at TEXT,
                updated_at TEXT
            )
        """)
        
        # Таблица заявок на логистические услуги
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_number TEXT UNIQUE NOT NULL,
                telegram_id INTEGER NOT NULL,
                service_type TEXT NOT NULL,
                service_subtype TEXT,
                data_json TEXT NOT NULL,
                status TEXT DEFAULT 'NEW',
                created_at TEXT,
                FOREIGN KEY (telegram_id) REFERENCES users (telegram_id)
            )
        """)
        
        # Индексы для быстрого поиска
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_tg_id ON leads(telegram_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_number ON leads(lead_number)")

        # Таблица групп и чатов менеджеров для уведомлений о заявках
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_chats (
                chat_id INTEGER PRIMARY KEY,
                title TEXT,
                chat_type TEXT,
                added_at TEXT
            )
        """)
        
        conn.commit()


def register_admin_chat(chat_id: int, title: str = "", chat_type: str = "group"):
    """Зарегистрировать группу или чат менеджеров для получения заявок."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO admin_chats (chat_id, title, chat_type, added_at)
            VALUES (?, ?, ?, ?)
        """, (chat_id, title or "", chat_type or "group", now))
        conn.commit()


def get_all_admin_chats() -> list:
    """Получить список всех зарегистрированных групп и администраторов."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT chat_id, title, chat_type FROM admin_chats")
        return [dict(r) for r in cursor.fetchall()]



def get_user(telegram_id: int):
    """Получить данные пользователя по telegram_id."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE telegram_id = ?", (telegram_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def save_or_update_user(
    telegram_id: int,
    username: str = None,
    full_name: str = None,
    company_name: str = None,
    phone: str = None,
    email: str = None,
    language: str = None,
    is_registered: int = None
):
    """Создать или обновить профиль пользователя."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE telegram_id = ?", (telegram_id,))
        existing = cursor.fetchone()
        
        if existing:
            query = """
                UPDATE users SET
                    username = COALESCE(?, username),
                    full_name = COALESCE(?, full_name),
                    company_name = COALESCE(?, company_name),
                    phone = COALESCE(?, phone),
                    email = COALESCE(?, email),
                    language = COALESCE(?, language),
                    is_registered = COALESCE(?, is_registered),
                    updated_at = ?
                WHERE telegram_id = ?
            """
            cursor.execute(query, (
                username, full_name, company_name, phone, email, language, is_registered, now, telegram_id
            ))
        else:
            query = """
                INSERT INTO users (
                    telegram_id, username, full_name, company_name, phone, email, language, is_registered, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(query, (
                telegram_id,
                username,
                full_name,
                company_name,
                phone,
                email,
                language or 'ru',
                is_registered if is_registered is not None else 0,
                now,
                now
            ))
        conn.commit()
        return get_user(telegram_id)


def register_user(
    telegram_id: int,
    username: str = None,
    full_name: str = None,
    company_name: str = None,
    phone: str = None,
    email: str = None,
    language: str = 'ru'
):
    """Зарегистрировать или обновить профиль корпоративного клиента."""
    return save_or_update_user(
        telegram_id=telegram_id,
        username=username,
        full_name=full_name,
        company_name=company_name,
        phone=phone,
        email=email,
        language=language,
        is_registered=1
    )


def set_user_language(telegram_id: int, lang: str):
    """Обновить язык интерфейса пользователя."""
    return save_or_update_user(telegram_id, language=lang)


def generate_lead_number():
    """Генерация уникального корпоративного номера заявки формата CR-YYYY-XXXX."""
    now = datetime.now(timezone.utc)
    year = now.year
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM leads WHERE created_at LIKE ?", (f"{year}%",))
        count = cursor.fetchone()['cnt']
        return f"CR-{year}-{1001 + count}"


def create_lead(
    telegram_id: int,
    service_type: str,
    service_subtype: str = None,
    data_dict: dict = None,
    service_name: str = None,
    details: dict = None
) -> dict:
    """Создать заявку в базе данных и вернуть словарь заявки."""
    lead_number = generate_lead_number()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    sub = service_name or service_subtype or service_type
    payload = details if details is not None else (data_dict or {})
    data_json = json.dumps(payload, ensure_ascii=False)
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO leads (lead_number, telegram_id, service_type, service_subtype, data_json, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'NEW', ?)
        """, (lead_number, telegram_id, service_type, sub, data_json, now))
        conn.commit()
        
    return {
        'lead_number': lead_number,
        'telegram_id': telegram_id,
        'service_type': service_type,
        'service_name': sub,
        'service_subtype': sub,
        'details': payload,
        'data': payload,
        'status': 'NEW',
        'created_at': now
    }


def get_user_leads(telegram_id: int, limit: int = 10):
    """Получить список заявок конкретного пользователя."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM leads
            WHERE telegram_id = ?
            ORDER BY id DESC
            LIMIT ?
        """, (telegram_id, limit))
        rows = cursor.fetchall()
        result = []
        for r in rows:
            d = dict(r)
            try:
                d['data'] = json.loads(d['data_json'])
            except Exception:
                d['data'] = {}
            d['details'] = d['data']
            d['service_name'] = d.get('service_subtype') or d.get('service_type')
            result.append(d)
        return result


def get_lead_by_number(lead_number: str):
    """Получить заявку по ее уникальному номеру."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT l.*, u.full_name, u.company_name, u.phone, u.email, u.username
            FROM leads l
            LEFT JOIN users u ON l.telegram_id = u.telegram_id
            WHERE l.lead_number = ?
        """, (lead_number,))
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        try:
            d['data'] = json.loads(d['data_json'])
        except Exception:
            d['data'] = {}
        d['details'] = d['data']
        d['service_name'] = d.get('service_subtype') or d.get('service_type')
        return d


def get_recent_leads(limit: int = 20):
    """Получить последние заявки для панели администратора."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT l.*, u.full_name, u.company_name, u.phone, u.email
            FROM leads l
            LEFT JOIN users u ON l.telegram_id = u.telegram_id
            ORDER BY l.id DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        result = []
        for r in rows:
            d = dict(r)
            try:
                d['data'] = json.loads(d['data_json'])
            except Exception:
                d['data'] = {}
            result.append(d)
        return result


def update_lead_status(lead_number: str, new_status: str):
    """Обновить статус заявки (NEW, IN_PROGRESS, COMPLETED, CANCELLED)."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE leads SET status = ? WHERE lead_number = ?", (new_status, lead_number))
        conn.commit()
