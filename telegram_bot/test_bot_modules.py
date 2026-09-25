"""
CARAVAN RAILROAD TELEGRAM BOT
Comprehensive Module Verification Test
Tests Database CRUD, Localization Integrity, Keyboards, Email Generation, and Bot handlers.
"""

import sys
import os
import unittest
from datetime import datetime

# Add root directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from telegram_bot import config
from telegram_bot import database as db
from telegram_bot import locales
from telegram_bot import keyboards
from telegram_bot import email_service


class TestCaravanBotModules(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Use an isolated test database in scratch/
        test_db_dir = os.path.join(config.BASE_DIR, "data")
        os.makedirs(test_db_dir, exist_ok=True)
        db.init_db()

    def test_01_database_user_lifecycle(self):
        """Test user registration, retrieval, and language switching."""
        test_tg_id = 9999901
        
        # 1. Register new corporate user
        user = db.register_user(
            telegram_id=test_tg_id,
            username="logistics_director",
            full_name="Алексей Смирнов",
            company_name="ТОО 'Евразия Трейд'",
            phone="+77011234567",
            email="smirnov@eurasia-trade.kz",
            language="ru"
        )
        self.assertIsNotNone(user)
        self.assertEqual(user['telegram_id'], test_tg_id)
        self.assertEqual(user['company_name'], "ТОО 'Евразия Трейд'")
        self.assertTrue(user['is_registered'])

        # 2. Get user
        fetched = db.get_user(test_tg_id)
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched['email'], "smirnov@eurasia-trade.kz")

        # 3. Change language to English
        updated_user = db.set_user_language(test_tg_id, 'en')
        self.assertEqual(updated_user['language'], 'en')
        self.assertEqual(db.get_user(test_tg_id)['language'], 'en')

    def test_02_database_lead_creation(self):
        """Test lead creation, auto-generated sequence number, and query."""
        test_tg_id = 9999902
        db.register_user(
            telegram_id=test_tg_id,
            username="cargo_agent",
            full_name="Джон Доу",
            company_name="Silk Road Logistics Ltd",
            phone="+77771234567",
            email="info@silkroad.com",
            language="ru"
        )

        lead_details = {
            "rail_type": "Расчет тарифа и перевозка",
            "origin_station": "Достык (код 707406)",
            "destination_station": "Алма-Ата-1 (код 700007)",
            "cargo_name": "Зерно пшеницы (ЕТСНГ 011005)",
            "wagon_type": "Хоппер-зерновоз",
            "fleet_provision": "Вагоны Caravan Railroad",
            "volume": "10 вагонов (700 тонн)",
            "comments": "Срочная подача под погрузку в течение 3 дней"
        }

        lead = db.create_lead(
            telegram_id=test_tg_id,
            service_type="rail",
            service_name="Ж/Д перевозки & Аренда вагонов",
            details=lead_details
        )

        self.assertIsNotNone(lead)
        self.assertTrue(lead['lead_number'].startswith(f"CR-{datetime.now().year}-"))
        self.assertEqual(lead['service_type'], "rail")
        self.assertEqual(lead['status'].upper(), "NEW")

        # Retrieve user leads
        user_leads = db.get_user_leads(test_tg_id)
        self.assertGreaterEqual(len(user_leads), 1)
        self.assertEqual(user_leads[0]['lead_number'], lead['lead_number'])

        # Retrieve lead by unique number
        fetched_lead = db.get_lead_by_number(lead['lead_number'])
        self.assertIsNotNone(fetched_lead)
        self.assertEqual(fetched_lead['details']['wagon_type'], "Хоппер-зерновоз")

    def test_03_locales_completeness(self):
        """Verify all three languages have equivalent key sets."""
        ru_keys = set(locales.LOCALES['ru'].keys())
        en_keys = set(locales.LOCALES['en'].keys())
        zh_keys = set(locales.LOCALES['zh'].keys())

        missing_en = ru_keys - en_keys
        missing_zh = ru_keys - zh_keys

        self.assertEqual(len(missing_en), 0, f"Missing English keys: {missing_en}")
        self.assertEqual(len(missing_zh), 0, f"Missing Chinese keys: {missing_zh}")

        # Check translation helper
        self.assertEqual(locales.t('ru', 'wagon_hopper'), "Хоппер-зерновоз / Минераловоз")
        self.assertIn("Hopper", locales.t('en', 'wagon_hopper'))
        self.assertIn("漏斗车", locales.t('zh', 'wagon_hopper'))

    def test_04_keyboards_generator(self):
        """Test reply and inline keyboard generation across all languages."""
        for lang in ('ru', 'en', 'zh'):
            lang_kb = keyboards.get_language_keyboard()
            self.assertIsNotNone(lang_kb)
            self.assertEqual(len(lang_kb.keyboard), 1)  # 1 row with 3 buttons
            self.assertEqual(len(lang_kb.keyboard[0]), 3)

            main_kb = keyboards.get_main_menu_keyboard(lang)
            self.assertIsNotNone(main_kb)
            self.assertGreaterEqual(len(main_kb.keyboard), 4)

            rail_inline = keyboards.get_rail_type_inline(lang)
            self.assertIsNotNone(rail_inline)
            
            wagon_inline = keyboards.get_wagon_type_inline(lang)
            self.assertIsNotNone(wagon_inline)

            phone_kb = keyboards.get_phone_request_keyboard(lang)
            self.assertIsNotNone(phone_kb)
            btn = phone_kb.keyboard[0][0]
            req = btn.get('request_contact') if isinstance(btn, dict) else getattr(btn, 'request_contact', False)
            self.assertTrue(req)

    def test_05_email_generation_and_logging(self):
        """Test HTML and plain-text email generation and resilient file logging."""
        test_user = {
            "full_name": "Касымхан Жумабаев",
            "company_name": "ТОО 'Караван Трейдинг'",
            "phone": "+7 701 555 7788",
            "email": "kassym@caravan-trading.kz",
            "username": "kassym_rail",
            "telegram_id": 9999903
        }

        test_lead = {
            "lead_number": f"CR-{datetime.now().year}-1999",
            "service_type": "rail",
            "service_name": "Ж/Д перевозки (зерновозы)",
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "details": {
                "Маршрут": "Кокшетау-1 ➔ Сарыагаш-эксп.",
                "Груз": "Пшеница продовольственная 3 класс (код 011005)",
                "Подвижной состав": "Хоппер-зерновоз (116 м³)",
                "Парк": "Вагоны Caravan Railroad (включить в ставку)",
                "Объем": "25 вагонов (1 750 тонн)",
                "Примечания": "Срок отправки: 1-я декада октября 2026 г."
            }
        }

        # 1. Test HTML generation
        html = email_service.generate_lead_html(test_lead, test_user)
        self.assertIn("Caravan Railroad", html)
        self.assertIn("CR-2026-1999", html)
        self.assertIn("ТОО 'Караван Трейдинг'", html)
        self.assertIn("kassym@caravan-trading.kz", html)
        self.assertIn("Кокшетау-1", html)

        # 2. Test plain text generation
        plain = email_service.generate_lead_plain_text(test_lead, test_user)
        self.assertIn("CR-2026-1999", plain)
        self.assertIn("+7 701 555 7788", plain)

        # 3. Test sending/fallback logging
        success = email_service.send_lead_email(test_lead, test_user)
        self.assertTrue(success)

        # 4. Check log file was created and contains the lead
        log_file = os.path.join(config.LOGS_DIR, "emails.log")
        self.assertTrue(os.path.exists(log_file))
        with open(log_file, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("CR-2026-1999", content)

    def test_06_bot_init_and_handlers(self):
        """Test TeleBot initialization and command routing."""
        from telegram_bot.bot import init_bot
        # Initialize bot with a mock/test token
        dummy_token = "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ1234567"
        bot = init_bot(dummy_token)
        self.assertIsNotNone(bot)
        # Verify message handlers exist
        self.assertGreater(len(bot.message_handlers), 0)
        self.assertGreater(len(bot.callback_query_handlers), 0)


if __name__ == '__main__':
    unittest.main(verbosity=2)
