#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Caravan Rail Engine - Database Builder
Extracts and normalizes stations, cargo, network topology, and tariff matrices
into a high-performance SQLite database: caravan_rail.db
"""

import os
import re
import json
import sqlite3

DB_PATH = "caravan_rail.db"

def init_database():
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception:
            pass

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 1. Stations table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
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
    cur.execute("CREATE INDEX IF NOT EXISTS idx_stations_code ON stations(code);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_stations_name ON stations(name COLLATE NOCASE);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_stations_country ON stations(country);")

    # 2. Cargo ETSNG table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS cargo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code_etsng TEXT UNIQUE NOT NULL,
        code_gng TEXT,
        name TEXT NOT NULL,
        category TEXT,
        tariff_class INTEGER DEFAULT 2,
        default_wagon TEXT DEFAULT 'covered',
        security_required INTEGER DEFAULT 0
    );
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_cargo_code ON cargo(code_etsng);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_cargo_name ON cargo(name COLLATE NOCASE);")

    # 3. Canonical corridors / route legs (TR-4)
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

    # 4. Border crossings (МГСП)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS border_crossings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        country_a TEXT NOT NULL,
        country_b TEXT NOT NULL,
        paired_station TEXT
    );
    """)

    conn.commit()
    return conn

def populate_cargo(conn):
    cur = conn.cursor()
    count = 0
    # Load from railway_cargo_bundle.json
    if os.path.exists("railway_cargo_bundle.json"):
        with open("railway_cargo_bundle.json", "r", encoding="utf-8") as f:
            cargos = json.load(f)
            for c in cargos:
                cur.execute("""
                INSERT OR IGNORE INTO cargo 
                (code_etsng, code_gng, name, category, tariff_class, default_wagon, security_required)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    c.get("code_etsng", ""),
                    c.get("code_gng", ""),
                    c.get("name", ""),
                    c.get("category", "Общие грузы"),
                    c.get("tariff_class", 2),
                    c.get("default_wagon", "covered"),
                    1 if c.get("security_required") else 0
                ))
                count += 1
    conn.commit()
    print(f"✓ Populated {count} cargo items.")

def populate_stations(conn):
    cur = conn.cursor()
    # 1. First import high-precision seed stations from railway_stations.json
    seed_count = 0
    if os.path.exists("railway_stations.json"):
        with open("railway_stations.json", "r", encoding="utf-8") as f:
            seeds = json.load(f)
            for s in seeds:
                cur.execute("""
                INSERT OR REPLACE INTO stations
                (code, name, name_en, country, country_name, admin, road, road_name, is_border, lat, lon)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    s.get("code"),
                    s.get("name"),
                    s.get("name_en", s.get("name")),
                    s.get("country"),
                    s.get("country_name"),
                    s.get("admin", s.get("country")),
                    s.get("road"),
                    s.get("road_label"),
                    1 if s.get("is_border") else 0,
                    s.get("lat"),
                    s.get("lon")
                ))
                seed_count += 1
    print(f"✓ Inserted {seed_count} seed stations with coordinates.")

    # 2. Extract thousands of stations from Stations.ref
    extracted_count = 0
    stations_ref = "rt_app/Stations.ref"
    if os.path.exists(stations_ref):
        with open(stations_ref, "rb") as f:
            raw = f.read()

        # Let's find station records in Stations.ref
        pattern = re.compile(rb'(\d{6})\x00+([^\x00\r\n]{2,60})\x00+([^\x00\r\n]{2,60})\x00+')
        for m in pattern.finditer(raw):
            code = m.group(1).decode("ascii", errors="ignore")
            try:
                name = m.group(2).decode("cp1251")
                name_en = m.group(3).decode("cp1251", errors="ignore")
            except Exception:
                continue

            # Basic sanity check
            if not (any('а' <= c <= 'я' or 'А' <= c <= 'Я' for c in name)):
                continue

            # Standard 1520 mm railway code allocation:
            country = "RUS"
            country_name = "Россия"
            admin = "РЖД"

            c_int = int(code[:2]) if code[:2].isdigit() else 0
            if 66 <= c_int <= 70:
                country = "KAZ"
                country_name = "Казахстан"
                admin = "КТЖ"
            elif 71 == c_int:
                country = "KGZ"
                country_name = "Кыргызстан"
                admin = "КРГ"
            elif 72 <= c_int <= 74:
                if code.startswith("745") or code.startswith("746") or code.startswith("747") or code.startswith("748"):
                    country = "TJK"
                    country_name = "Таджикистан"
                    admin = "ТДЖ"
                else:
                    country = "UZB"
                    country_name = "Узбекистан"
                    admin = "УТИ"
            elif 75 == c_int:
                country = "TKM"
                country_name = "Туркменистан"
                admin = "ТРК"
            elif 21 == c_int or 13 <= c_int <= 15:
                country = "BLR"
                country_name = "Беларусь"
                admin = "БЧ"
            elif 55 <= c_int <= 58:
                country = "AZE"
                country_name = "Азербайджан"
                admin = "АДЮ"
            elif 56 == c_int or 57 == c_int:
                country = "ARM"
                country_name = "Армения"
                admin = "ЮКЖД"
            elif 59 <= c_int <= 61:
                country = "GEO"
                country_name = "Грузия"
                admin = "ГР"

            # Check if station is a border crossing
            is_border = 1 if any(w in name.lower() for w in ['стык', 'эксп', 'погран', 'переход']) else 0

            cur.execute("""
            INSERT OR IGNORE INTO stations
            (code, name, name_en, country, country_name, admin, is_border)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (code, name, name_en, country, country_name, admin, is_border))
            extracted_count += 1

    conn.commit()
    print(f"✓ Processed {extracted_count} stations from Stations.ref. Total in DB: {cur.execute('SELECT COUNT(*) FROM stations').fetchone()[0]}")

def populate_canonical_corridors(conn):
    cur = conn.cursor()
    # Official TR-4 transit corridors and nodal chains
    corridors = [
        # KTZ Transit corridors
        ("666501", "720602", 2080, "КТЖ", "Илецк-1 -> Актобе -> Кандыагаш -> Шалкар -> Саксаульская -> Казалинск -> Кызылорда -> Туркестан -> Арысь -> Сарыагаш", "Транзит РФ-УЗБ через Илецк-Сарыагаш"),
        ("666501", "660309", 1930, "КТЖ", "Илецк-1 -> Актобе -> Кандыагаш -> Макат -> Бейнеу", "Транзит РФ-УЗБ через Илецк-Оазис/Бейнеу"),
        ("660008", "720602", 2150, "КТЖ", "Озинки -> Уральск -> Кандыагаш -> Саксаульская -> Кызылорда -> Сарыагаш", "Транзит РФ-УЗБ через Озинки-Сарыагаш"),
        ("660008", "660309", 1480, "КТЖ", "Озинки -> Уральск -> Атырау -> Макат -> Бейнеу", "Транзит РФ-УЗБ через Озинки-Бейнеу/Оазис"),
        ("707502", "720602", 1878, "КТЖ", "Семей -> Актогай -> Достык/Берлик -> Шу -> Тараз -> Шымкент -> Сарыагаш", "Транзит РФ(Сибирь)-УЗБ через Семей-Сарыагаш"),
        ("707502", "720000", 1906, "КТЖ+УТИ", "Семей -> Актогай -> Шу -> Сарыагаш -> Келес -> Чукурсай", "Полный коридор Семей-Чукурсай"),
        ("690002", "720602", 1540, "КТЖ", "Пресногорьковская -> Тобол -> Есиль -> Астана -> Караганда -> Шу -> Сарыагаш", "Транзит Урал-УЗБ"),
        ("680007", "720602", 1680, "КТЖ", "Петропавловск -> Кокшетау -> Астана -> Караганда -> Шу -> Сарыагаш", "Транзит через Петропавловск"),
        ("664402", "720602", 2190, "КТЖ", "Никельтау -> Кандыагаш -> Саксаульская -> Кызылорда -> Сарыагаш", "Транзит через Орск/Никельтау"),
        ("698004", "720602", 1490, "КТЖ", "Кулунда -> Павлодар -> Караганда -> Шу -> Сарыагаш", "Транзит через Кулунду"),
        ("713007", "720602", 1370, "КТЖ", "Локоть -> Защита -> Актогай -> Шу -> Сарыагаш", "Транзит через Алтай/Локоть"),
        # Uzbekistan border legs
        ("720602", "720000", 28, "УТИ", "Сарыагаш -> Келес -> Чукурсай", "Пограничный переход Сарыагаш - Чукурсай (Ташкент)"),
        ("720602", "722400", 42, "УТИ", "Сарыагаш -> Келес -> Ташкент-Товарный", "Пограничный переход Сарыагаш - Ташкент-Тов."),
        ("720602", "723507", 56, "УТИ", "Сарыагаш -> Келес -> Ташкент-Тов. -> Сергели", "Пограничный переход Сарыагаш - Сергели"),
        ("660309", "738407", 65, "УТИ", "Бейнеу -> Каракалпакия -> Кунград", "Северо-западный вход в Узбекистан"),
    ]

    for c in corridors:
        cur.execute("""
        INSERT INTO canonical_corridors 
        (from_code, to_code, distance_km, transit_admin, via_nodes, description)
        VALUES (?, ?, ?, ?, ?, ?)
        """, c)

    # Border crossings table
    borders = [
        ("666501", "Илецк-1", "RUS", "KAZ", "Илецк-1 / Жайсан"),
        ("660008", "Озинки", "RUS", "KAZ", "Озинки / Семиглавый Мар"),
        ("707502", "Локоть / Семей", "RUS", "KAZ", "Локоть / Жана-Семей"),
        ("690002", "Пресногорьковская", "RUS", "KAZ", "Пресногорьковская / Зауралье"),
        ("680007", "Петропавловск", "RUS", "KAZ", "Петропавловск"),
        ("664402", "Никельтау", "RUS", "KAZ", "Никельтау / Орск"),
        ("698004", "Кулунда", "RUS", "KAZ", "Кулунда / Павлодар"),
        ("720602", "Сарыагаш", "KAZ", "UZB", "Сарыагаш / Келес"),
        ("660309", "Бейнеу", "KAZ", "UZB", "Бейнеу / Каракалпакия (Оазис)"),
        ("720000", "Келес", "UZB", "KAZ", "Келес / Сарыагаш"),
    ]
    for b in borders:
        cur.execute("""
        INSERT OR IGNORE INTO border_crossings (code, name, country_a, country_b, paired_station)
        VALUES (?, ?, ?, ?, ?)
        """, b)

    conn.commit()
    print("✓ Populated canonical corridors and border crossings.")

def main():
    print("--- Starting Caravan Rail Database Builder ---")
    conn = init_database()
    populate_cargo(conn)
    populate_stations(conn)
    populate_canonical_corridors(conn)
    
    cur = conn.cursor()
    st_count = cur.execute("SELECT count(*) FROM stations").fetchone()[0]
    cg_count = cur.execute("SELECT count(*) FROM cargo").fetchone()[0]
    cor_count = cur.execute("SELECT count(*) FROM canonical_corridors").fetchone()[0]
    print(f"\n✓ Database caravan_rail.db created successfully!")
    print(f"  Stations: {st_count}")
    print(f"  Cargo: {cg_count}")
    print(f"  Corridors: {cor_count}")
    conn.close()

if __name__ == "__main__":
    main()
