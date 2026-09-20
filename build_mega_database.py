#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Caravan Logistics & Customs - Mega Database Builder
Extracts and integrates:
1. 13,694 Rail Stations (from caravan_rail.db / Stations.ref)
2. 409 Cargo ETSNG items
3. 13,140 TN VED codes from AIS Customs Calculator (info.gs)
4. 144 Customs & Shipping Documents (document_all)
5. Modality Rules, Fleet Leasing Rates, Road & Air Matrices
Outputs unified, high-performance SQLite database: caravan_logistics.db
"""

import os
import sys
import json
import sqlite3
import zipfile
import subprocess

DB_PATH = "caravan_logistics.db"
MSI_EXTRACT_DIR = "extracted_msi_sample"

def init_mega_db():
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception:
            pass

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("PRAGMA journal_mode=WAL;")

    # 1. Stations
    cur.execute("""
    CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        name_lower TEXT,
        name_en TEXT,
        country TEXT,
        country_name TEXT,
        admin TEXT,
        road TEXT,
        road_name TEXT,
        is_border INTEGER DEFAULT 0,
        lat REAL,
        lon REAL
    );
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_st_code ON stations(code);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_st_lower ON stations(name_lower);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_st_country ON stations(country);")

    # 2. Cargo ETSNG
    cur.execute("""
    CREATE TABLE IF NOT EXISTS cargo_etsng (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code_etsng TEXT UNIQUE NOT NULL,
        code_gng TEXT,
        name TEXT NOT NULL,
        name_lower TEXT,
        category TEXT,
        tariff_class INTEGER DEFAULT 2,
        default_wagon TEXT DEFAULT 'covered',
        security_required INTEGER DEFAULT 0
    );
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_cg_code ON cargo_etsng(code_etsng);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_cg_lower ON cargo_etsng(name_lower);")

    # 3. TN VED Codes (Customs AIS)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tnved_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        code_clean TEXT NOT NULL,
        name TEXT NOT NULL,
        name_lower TEXT,
        unit TEXT,
        base_duty_pct REAL DEFAULT 5.0,
        vat_pct REAL DEFAULT 12.0,
        excise_pct REAL DEFAULT 0.0,
        requires_cert INTEGER DEFAULT 0,
        requires_phyto INTEGER DEFAULT 0,
        requires_vet INTEGER DEFAULT 0
    );
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_tnved_code ON tnved_codes(code_clean);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_tnved_lower ON tnved_codes(name_lower);")

    # 4. Official Documents Dictionary (144 documents from AIS Customs)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS documents_all (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doc_code TEXT NOT NULL,
        short_name TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        issuer TEXT,
        is_international INTEGER DEFAULT 1
    );
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_doc_code ON documents_all(doc_code);")

    # 5. Smart Document Rules
    cur.execute("""
    CREATE TABLE IF NOT EXISTS document_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modality TEXT NOT NULL,
        cargo_category TEXT,
        is_import INTEGER DEFAULT 1,
        doc_name TEXT NOT NULL,
        doc_code TEXT,
        is_mandatory INTEGER DEFAULT 1,
        description TEXT
    );
    """)

    # 6. Canonical Rail Corridors
    cur.execute("""
    CREATE TABLE IF NOT EXISTS canonical_corridors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_code TEXT NOT NULL,
        to_code TEXT NOT NULL,
        distance_km INTEGER NOT NULL,
        transit_admin TEXT,
        via_nodes TEXT,
        description TEXT
    );
    """)

    # 7. Fleet Leasing Rates (Аренда ПС)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS fleet_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wagon_type TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        volume_m3 REAL,
        capacity_tons REAL,
        daily_rate_usd REAL NOT NULL,
        daily_rate_rub REAL NOT NULL,
        roundtrip_base_usd REAL NOT NULL,
        description TEXT
    );
    """)

    # 8. Air Freight Hubs (Авиаперевозки)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS air_hubs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        iata_code TEXT UNIQUE NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        airport_name TEXT NOT NULL,
        base_rate_per_kg_usd REAL NOT NULL,
        min_charge_usd REAL DEFAULT 150.0
    );
    """)

    conn.commit()
    return conn

def import_rail_data(conn):
    cur = conn.cursor()
    src_db = "caravan_rail.db"
    if not os.path.exists(src_db):
        print("Warning: caravan_rail.db not found, stations will be empty.")
        return

    src_conn = sqlite3.connect(src_db)
    src_cur = src_conn.cursor()

    # Copy stations
    stations = src_cur.execute("SELECT code, name, name_lower, name_en, country, country_name, admin, road, road_name, is_border, lat, lon FROM stations").fetchall()
    cur.executemany("""
    INSERT OR IGNORE INTO stations 
    (code, name, name_lower, name_en, country, country_name, admin, road, road_name, is_border, lat, lon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, stations)

    # Copy cargo
    cargo = src_cur.execute("SELECT code_etsng, code_gng, name, name_lower, category, tariff_class, default_wagon, security_required FROM cargo").fetchall()
    cur.executemany("""
    INSERT OR IGNORE INTO cargo_etsng
    (code_etsng, code_gng, name, name_lower, category, tariff_class, default_wagon, security_required)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, cargo)

    # Copy corridors
    corridors = src_cur.execute("SELECT from_code, to_code, distance_km, transit_admin, via_nodes, description FROM canonical_corridors").fetchall()
    cur.executemany("""
    INSERT OR IGNORE INTO canonical_corridors
    (from_code, to_code, distance_km, transit_admin, via_nodes, description)
    VALUES (?, ?, ?, ?, ?, ?)
    """, corridors)

    src_conn.close()
    conn.commit()
    print(f"✓ Copied {len(stations)} stations and {len(cargo)} cargo items from caravan_rail.db.")

def import_customs_data(conn):
    cur = conn.cursor()
    info_gs = os.path.join(MSI_EXTRACT_DIR, "info.gs")

    if not os.path.exists(info_gs):
        # Extract from Install.msi if needed
        print(f"Extracting info.gs from Install.msi...")
        subprocess.run(['7z', 'e', 'Install.msi', 'filhfCkw8.xsTvMWDkltmYpDkF9d5o', f'-o{MSI_EXTRACT_DIR}', '-y'], capture_output=True)
        sample_path = os.path.join(MSI_EXTRACT_DIR, "filhfCkw8.xsTvMWDkltmYpDkF9d5o")
        if os.path.exists(sample_path):
            with zipfile.ZipFile(sample_path) as z:
                z.extract('info.gs', MSI_EXTRACT_DIR)

    if not os.path.exists(info_gs):
        print("Warning: info.gs could not be extracted.")
        return

    c_conn = sqlite3.connect(info_gs)
    c_cur = c_conn.cursor()

    # 1. Import TN VED codes
    tn_rows = c_cur.execute("SELECT code, title, unit FROM tnved_code").fetchall()
    print(f"Importing {len(tn_rows)} TN VED codes from AIS Customs...")
    tn_batch = []
    for r in tn_rows:
        raw_code = str(r[0] or '').strip()
        clean_code = raw_code.replace(' ', '')
        name = str(r[1] or '').strip()
        unit = str(r[2] or '796')

        # Heuristics for duties & certificates based on 2-digit group
        grp = clean_code[:2] if clean_code else '00'
        duty_pct = 5.0
        vat_pct = 12.0 # Uzbekistan standard VAT rate
        excise_pct = 0.0
        requires_phyto = 1 if grp in ['06', '07', '08', '09', '10', '11', '12', '14', '23'] else 0
        requires_vet = 1 if grp in ['01', '02', '03', '04', '05', '16'] else 0
        requires_cert = 1 if grp in ['84', '85', '87', '90', '33', '34'] else 0

        # High-duty goods
        if grp in ['22', '24']: # Alcohol & Tobacco
            duty_pct = 20.0
            excise_pct = 30.0
        elif grp in ['87']: # Vehicles
            duty_pct = 15.0
        elif grp in ['10', '11']: # Grain & Flour
            duty_pct = 0.0 # Essential food products often zero-rated in UZB

        tn_batch.append((raw_code, clean_code, name, name.lower(), unit, duty_pct, vat_pct, excise_pct, requires_cert, requires_phyto, requires_vet))

    cur.executemany("""
    INSERT INTO tnved_codes
    (code, code_clean, name, name_lower, unit, base_duty_pct, vat_pct, excise_pct, requires_cert, requires_phyto, requires_vet)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, tn_batch)

    # 2. Import Official Documents
    doc_rows = c_cur.execute("SELECT code, point, title FROM document_all").fetchall()
    print(f"Importing {len(doc_rows)} document types from AIS Customs...")
    doc_batch = []
    for d in doc_rows:
        d_code = str(d[0] or '').strip()
        s_name = str(d[1] or '').strip()
        full_name = str(d[2] or '').strip()
        cat = "Транспортные" if any(k in full_name.upper() for k in ['CMR', 'СМГС', 'КОНОСАМЕНТ', 'TIR', 'АВИА', 'ЖЕЛЕЗНОДОРОЖН']) else \
              ("Разрешительные" if any(k in full_name.upper() for k in ['СЕРТИФИКАТ', 'ЛИЦЕНЗИЯ', 'ВЕТЕРИНАРН', 'ФИТОСАНИТАРН']) else "Таможенные/Коммерческие")
        doc_batch.append((d_code, s_name, full_name, cat, "Госорганы/Перевозчик", 1))

    cur.executemany("""
    INSERT INTO documents_all
    (doc_code, short_name, name, category, issuer, is_international)
    VALUES (?, ?, ?, ?, ?, ?)
    """, doc_batch)

    c_conn.close()
    conn.commit()
    print(f"✓ Imported {len(tn_batch)} TN VED codes and {len(doc_batch)} official documents into mega DB.")

def populate_fleet_and_modality_rules(conn):
    cur = conn.cursor()

    # 1. Fleet Leasing Rates (Аренда ПС Caravan Railroad)
    fleet = [
        ("grain", "Хоппер-зерновоз (116–120 м³)", 120.0, 70.0, 42.0, 3900.0, 1260.0, "Специализированный вагон для бестарной перевозки зерна, пшеницы, ячменя и масличных культур."),
        ("covered", "Крытый вагон (138–161 м³)", 158.0, 68.0, 38.0, 3500.0, 1140.0, "Универсальный крытый вагон для тарной муки, сахара, стройматериалов и упакованных товаров."),
        ("gondola", "Полувагон люковый (85 м³)", 85.0, 70.0, 32.0, 2950.0, 960.0, "Грузовой полувагон для навалочных грузов: угля, руды, металлопроката и щебня."),
        ("platform", "Универсальная / Фитинговая платформа", 0.0, 72.0, 29.0, 2700.0, 870.0, "Платформа для крупнотоннажных контейнеров 20'/40' HC, техники и колесных машин."),
        ("tank", "Железнодорожная цистерна", 73.0, 66.0, 45.0, 4150.0, 1350.0, "Цистерна для наливных грузов, светлых/темных нефтепродуктов и растительных масел.")
    ]
    cur.executemany("""
    INSERT OR REPLACE INTO fleet_rates
    (wagon_type, title, volume_m3, capacity_tons, daily_rate_usd, daily_rate_rub, roundtrip_base_usd, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, fleet)

    # 2. Air Cargo Hubs
    air_hubs = [
        ("TAS", "Ташкент", "Узбекистан", "Международный аэропорт им. Ислама Каримова (TAS)", 2.45, 120.0),
        ("SVO", "Москва", "Россия", "Шереметьево Карго (SVO)", 2.10, 100.0),
        ("IST", "Стамбул", "Турция", "Istanbul Cargo Hub (IST)", 2.80, 140.0),
        ("DXB", "Дубай", "ОАЭ", "Dubai World Central (DWC/DXB)", 2.60, 130.0),
        ("CAN", "Гуанчжоу", "Китай", "Guangzhou Baiyun Cargo (CAN)", 3.85, 160.0),
        ("PVG", "Шанхай", "Китай", "Shanghai Pudong Cargo (PVG)", 3.95, 160.0),
        ("FRA", "Франкфурт", "Германия", "Frankfurt Airport Cargo (FRA)", 3.40, 150.0)
    ]
    cur.executemany("""
    INSERT OR REPLACE INTO air_hubs
    (iata_code, city, country, airport_name, base_rate_per_kg_usd, min_charge_usd)
    VALUES (?, ?, ?, ?, ?, ?)
    """, air_hubs)

    # 3. Smart Document Rules
    doc_rules = [
        # Rail
        ("rail", "all", 1, "Ж/Д накладная СМГС (SMGS)", "0202", 1, "Основной транспортный перевозочный документ железнодорожного сообщения колеи 1520 мм."),
        ("rail", "all", 1, "Коммерческий инвойс (Счёт-фактура)", "0301", 1, "Финансовый документ с описанием стоимости, реквизитов продавца/покупателя и условий Incoterms."),
        ("rail", "all", 1, "Упаковочный лист (Packing List)", "0302", 1, "Поместовая опись веса брутто/нетто, количества мест и упаковки товара."),
        ("rail", "grain", 1, "Фитосанитарный сертификат", "0103", 1, "Обязателен для карантинного контроля зерна, муки, бобовых при пересечении границ."),
        ("rail", "grain", 1, "Сертификат происхождения СТ-1", "0601", 1, "Освобождает от ввозной таможенной пошлины в рамках соглашения о свободной торговле СНГ."),
        ("rail", "danger", 1, "Паспорт безопасности вещества (MSDS)", "0112", 1, "Аварийная карточка и согласование безопасности химических/опасных грузов."),

        # Fleet Leasing
        ("fleet", "all", 1, "Договор аренды подвижного состава / транспортной экспедиции", "0801", 1, "Базовый договор закрепления вагонного парка за арендатором."),
        ("fleet", "all", 1, "Заявка формы ГУ-12 на согласование перевозки", "0802", 1, "Официальное согласование курсирования и погрузки вагонов железнодорожной администрацией."),
        ("fleet", "all", 1, "Акт приема-передачи подвижного состава", "0803", 1, "Фиксирует дату и станцию передачи вагонов в оперирование."),
        ("fleet", "all", 1, "Справка технического состояния (ВУ-23М / ВУ-36М)", "0804", 1, "Подтверждение исправности колесных пар, тормозной системы и годности под погрузку."),

        # Road
        ("road", "all", 1, "Международная автонакладная CMR", "0201", 1, "Договор международной дорожной перевозки грузов на автомобильном плече."),
        ("road", "all", 1, "Книжка Carnet TIR (МДП)", "0204", 0, "Таможенный документ, разрешающий транзитный проезд без вскрытия пломб и досмотра на границах."),
        ("road", "all", 1, "Экспортная декларация страны отправления (EX-1 / ТД)", "0901", 1, "Подтверждает убытие груза и закрытие таможенного режима экспорта."),

        # Air
        ("air", "all", 1, "Авиагрузовая накладная Air Waybill (AWB / MAWB)", "0203", 1, "Документ авиакомпании, подтверждающий принятие груза к воздушной перевозке."),
        ("air", "all", 1, "Инструкция отправителя (Shipper's Letter of Instruction)", "0205", 1, "Указания авиалиниям по маршруту, перегрузке и температурному режиму."),
        ("air", "danger", 1, "Декларация отправителя на опасный груз (IATA DGR)", "0114", 1, "Обязательна при наличии литиевых аккумуляторов, химикатов или магнитов."),

        # Multimodal
        ("multimodal", "all", 1, "Океанский коносамент (Bill of Lading / B/L)", "0206", 1, "Титульный документ морской перевозки контейнера с правами собственности."),
        ("multimodal", "all", 1, "Сквозная мультимодальная накладная FIATA FBL", "0207", 1, "Сквозной экспедиторский документ на комбинированное плечо (море+ж/д+авто)."),

        # Customs
        ("customs", "all", 1, "Грузовая таможенная декларация (ГТД / ДТ)", "0001", 1, "Основной документ таможенного декларирования и выпуска товаров в свободное обращение."),
        ("customs", "all", 1, "Внешнеторговый контракт + Паспорт сделки", "0002", 1, "Контракт поставки с регистрацией в ЕЭИСВО (для Узбекистана) или банке валютного контроля."),
        ("customs", "all", 1, "Сертификат соответствия / Декларация ЕАС / Узстандарт", "0101", 1, "Обязательное подтверждение безопасности продукции нормам технических регламентов.")
    ]

    cur.executemany("""
    INSERT OR REPLACE INTO document_rules
    (modality, cargo_category, is_import, doc_name, doc_code, is_mandatory, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, doc_rules)

    conn.commit()
    print(f"✓ Populated {len(fleet)} fleet types, {len(air_hubs)} air hubs, and {len(doc_rules)} smart document rules.")

def main():
    print("=== Starting Caravan Mega Database Builder ===")
    conn = init_mega_db()
    import_rail_data(conn)
    import_customs_data(conn)
    populate_fleet_and_modality_rules(conn)

    cur = conn.cursor()
    st_c = cur.execute("SELECT count(*) FROM stations").fetchone()[0]
    cg_c = cur.execute("SELECT count(*) FROM cargo_etsng").fetchone()[0]
    tn_c = cur.execute("SELECT count(*) FROM tnved_codes").fetchone()[0]
    doc_c = cur.execute("SELECT count(*) FROM documents_all").fetchone()[0]
    rule_c = cur.execute("SELECT count(*) FROM document_rules").fetchone()[0]
    fl_c = cur.execute("SELECT count(*) FROM fleet_rates").fetchone()[0]
    air_c = cur.execute("SELECT count(*) FROM air_hubs").fetchone()[0]

    print(f"\n==================================================")
    print(f" Caravan Logistics & Customs Mega Database Ready!")
    print(f" Database file: {DB_PATH} ({round(os.path.getsize(DB_PATH)/(1024*1024), 2)} MB)")
    print(f"   Stations: {st_c}")
    print(f"   Cargo ETSNG: {cg_c}")
    print(f"   TN VED Codes (AIS Customs): {tn_c}")
    print(f"   Official Documents: {doc_c}")
    print(f"   Smart Document Rules: {rule_c}")
    print(f"   Fleet Leasing Types: {fl_c}")
    print(f"   Air Cargo Hubs: {air_c}")
    print(f"==================================================")
    conn.close()

if __name__ == "__main__":
    main()
