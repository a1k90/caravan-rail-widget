#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
apply_full_v383_universal_routing.py
Comprehensive upgrade of Caravan 1520 Railway Routing Engine v3.8.3:
1. Fixes station ownership in SQLite databases (caravan_logistics.db, caravan_rail.db) and railway_stations.json.
2. Adds client-side station attribution sanitizer in autocomplete dropdown.
3. Adds Tukimachi, Hairatan, and Galaba to STATIONS and corridors.
4. Adds Caucasus (baku_tbilisi_batumi, baku_yalama_samur_derbent) and Trans-Siberian (chelyabinsk_vladivostok) corridors.
5. Fixes determineRouteLegs and buildRouteItinerary for:
   - Domestic intra-hub moves (Chukursay ➔ Tukimachi = 14 km, not 500 km).
   - Kazakhstan ➔ Afghanistan transit (Kostanay ➔ Hairatan = 2894 km through Uzbekistan, not via Moscow).
   - Georgia ➔ Uzbekistan Middle Corridor (Tbilisi ➔ Sergeli = 2843 km via Baku/Aktau, not jumping to Saryagash).
   - Georgia ➔ Russia overland route (Poti ➔ Vladivostok = 10,501 km via Azerbaijan/Transsib, not reversing through Kazakhstan).
   - Russia ➔ Uzbekistan transit (Moscow ➔ Chukursay: 3585 km with Iletsk, 5656 km with Lokot).
6. Synchronizes railway_stations.json, railway_calc_engine.js, caravan-tracking-widget.html, index.html, caravan-widget.js, test_embed.html, and tilda-embed-snippet.html.
"""

import sys, os, re, json, sqlite3, subprocess

def update_sqlite():
    print("--- 1. Updating SQLite databases ---")
    for db_path in ['caravan_logistics.db', 'caravan_rail.db']:
        if not os.path.exists(db_path):
            continue
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        
        # Georgia
        cur.execute("""
            UPDATE stations 
            SET country='GEO', country_name='Грузия', admin='ГРЗ', road='57', road_name='Грузинская ж. д. (ГРЗ)' 
            WHERE (substr(code,1,2) IN ('56','57') 
                   OR name_lower LIKE '%тбилиси%' 
                   OR name_lower LIKE '%батуми%' 
                   OR name_lower LIKE '%поти%' 
                   OR name_lower LIKE '%кутаиси%' 
                   OR name_lower LIKE '%рустави%' 
                   OR name_lower LIKE '%гори%' 
                   OR name_lower LIKE '%хашури%' 
                   OR name_lower LIKE '%авчала%' 
                   OR name_lower LIKE '%сенаки%' 
                   OR name_lower LIKE '%садахло%' 
                   OR name_lower LIKE '%гардабани%') 
              AND code NOT IN ('566002', '565103', '566708') 
              AND name_lower NOT LIKE '%ереван%' 
              AND name_lower NOT LIKE '%гюмри%' 
              AND name_lower NOT LIKE '%ахурян%';
        """)
        geo_count = cur.rowcount

        # Armenia
        cur.execute("""
            UPDATE stations 
            SET country='ARM', country_name='Армения', admin='ЮКЖД', road='58', road_name='Южно-Кавказская ж. д. (ЮКЖД)' 
            WHERE substr(code,1,2) IN ('58','59') 
               OR code IN ('566002', '565103', '566708') 
               OR name_lower LIKE '%ереван%' 
               OR name_lower LIKE '%гюмри%' 
               OR name_lower LIKE '%ахурян%';
        """)
        arm_count = cur.rowcount

        # Tukimachi
        cur.execute("""
            UPDATE stations 
            SET road_name='Узбекская ж. д. (УТИ)', country='UZB', country_name='Узбекистан', admin='УТИ', road='73' 
            WHERE code='723511';
        """)

        # Galaba
        cur.execute("""
            UPDATE stations 
            SET road_name='Узбекская ж. д. (УТИ)', country='UZB', country_name='Узбекистан', admin='УТИ', road='73', is_border=1 
            WHERE code IN ('735805', '736304');
        """)

        # Hairatan
        cur.execute("""
            UPDATE stations 
            SET road_name='Афганская ж. д. (АРА)', country='AFG', country_name='Афганистан', admin='АРА', road='135', is_border=1 
            WHERE code='000251';
        """)

        conn.commit()
        conn.close()
        print(f"  {db_path}: {geo_count} Georgian, {arm_count} Armenian stations updated.")

def update_railway_stations_json():
    print("--- 2. Updating railway_stations.json ---")
    with open('railway_stations.json', 'r', encoding='utf-8') as f:
        stations = json.load(f)

    for s in stations:
        code = s.get('code', '')
        name = s.get('name', '').lower()
        p2 = code[:2]

        if code in ['566002', '565103', '566708'] or p2 in ['58', '59'] or 'ахурян' in name or 'ереван' in name or 'гюмри' in name:
            s['country'] = 'ARM'
            s['country_name'] = 'Армения'
            s['admin'] = 'ЮКЖД'
            s['road'] = '58'
            s['road_label'] = 'Южно-Кавказская ж. д. (ЮКЖД)'
        elif p2 in ['56', '57'] or any(w in name for w in ['тбилиси', 'батуми', 'поти', 'кутаиси', 'рустави', 'гори', 'хашури', 'гардабани']):
            s['country'] = 'GEO'
            s['country_name'] = 'Грузия'
            s['admin'] = 'ГРЗ'
            s['road'] = '57'
            s['road_label'] = 'Грузинская ж. д. (ГРЗ)'

    codes = set(s.get('code') for s in stations)
    if '723511' not in codes:
        stations.append({
            "code": "723511",
            "name": "Тукимачи",
            "country": "UZB",
            "country_name": "Узбекистан",
            "admin": "УТИ",
            "road": "73",
            "road_label": "Узбекская ж. д. (УТИ)",
            "is_border": False
        })
        print("  Added Tukimachi (723511)")

    if '735805' not in codes:
        stations.append({
            "code": "735805",
            "name": "Галаба (эксп.)",
            "country": "UZB",
            "country_name": "Узбекистан",
            "admin": "УТИ",
            "road": "73",
            "road_label": "Узбекская ж. д. (УТИ)",
            "is_border": True
        })
        print("  Added Galaba (735805)")

    if '000251' not in codes:
        stations.append({
            "code": "000251",
            "name": "Хайратан (эксп.)",
            "country": "AFG",
            "country_name": "Афганистан",
            "admin": "АРА",
            "road": "135",
            "road_label": "Афганская ж. д. (АРА)",
            "is_border": True
        })
        print("  Added Hairatan (000251)")

    if '980200' not in codes:
        stations.append({
            "code": "980200",
            "name": "Владивосток (эксп.)",
            "country": "RUS",
            "country_name": "Россия",
            "admin": "РЖД",
            "road": "96",
            "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
            "is_border": True
        })
        print("  Added Vladivostok (980200)")

    with open('railway_stations.json', 'w', encoding='utf-8') as f:
        json.dump(stations, f, ensure_ascii=False, indent=2)
    print(f"  Saved railway_stations.json ({len(stations)} stations)")
    return stations

def get_stations_js_formatted(stations):
    return "  var STATIONS = " + json.dumps(stations, ensure_ascii=False, indent=2) + ";\n"

def get_core_routing_block():
    with open('railway_calc_engine.js', 'r', encoding='utf-8') as f:
        text = f.read()
    b_start = text.find("  var BORDER_CROSSINGS = {")
    calc_end = text.find("  return {\n    STATIONS: STATIONS,")
    return text[b_start:calc_end]

def update_js_and_html_files(stations):
    print("--- 3. Updating JS and HTML files with universal routing v3.8.3 ---")
    stations_js = get_stations_js_formatted(stations)
    routing_block = get_core_routing_block()

    autocomplete_sanitizer = """      function sanitizeStationObj(st) {
        if (!st) return st;
        var code = (st.code || '').toString();
        var name = (st.name || '').toLowerCase();
        var p2 = code.substring(0, 2);
        if (code === '565103' || code === '566708' || code === '566002' || name.indexOf('ереван') !== -1 || name.indexOf('гюмри') !== -1 || name.indexOf('ахурян') !== -1) {
          st.country = 'ARM'; st.country_name = 'Армения'; st.admin = 'ЮКЖД'; st.road_label = 'Южно-Кавказская ж. д. (ЮКЖД)'; st.road = 'ЮКЖД';
        } else if (p2 === '56' || p2 === '57' || name.indexOf('тбилиси') !== -1 || name.indexOf('батуми') !== -1 || name.indexOf('поти') !== -1 || name.indexOf('кутаиси') !== -1 || name.indexOf('рустави') !== -1 || name.indexOf('гори') !== -1 || name.indexOf('хашури') !== -1 || name.indexOf('гардабани') !== -1) {
          st.country = 'GEO'; st.country_name = 'Грузия'; st.admin = 'ГРЗ'; st.road_label = 'Грузинская ж. д. (ГРЗ)'; st.road = '57';
        } else if (p2 === '54' || p2 === '55') {
          if (name.indexOf('махачкала') === -1 && name.indexOf('самур') === -1 && name.indexOf('дербент') === -1) {
            st.country = 'AZE'; st.country_name = 'Азербайджан'; st.admin = 'АДЮ'; st.road_label = 'Азербайджанские ж. д. (АДЮ)'; st.road = '55';
          }
        }
        return st;
      }
"""

    for filepath in ['railway_calc_engine.js', 'caravan-widget.js', 'caravan-tracking-widget.html', 'index.html']:
        print(f"  Processing {filepath}...")
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Replace STATIONS array
        st_match = re.search(r'var STATIONS\s*=\s*\[', content)
        if st_match:
            st_start = st_match.start()
            # find the closing semicolon of STATIONS
            st_end = content.find(';\n', st_start)
            if st_end != -1:
                content = content[:st_start] + stations_js.lstrip() + content[st_end+2:]
                print(f"    Replaced STATIONS array in {filepath}")

        # 2. Replace routing block: from 'var BORDER_CROSSINGS = {' to '  return {\n    STATIONS: STATIONS,'
        b_start = content.find("var BORDER_CROSSINGS = {")
        calc_end = content.find("  return {\n    STATIONS: STATIONS,")
        if b_start != -1 and calc_end != -1:
            content = content[:b_start] + routing_block + content[calc_end:]
            print(f"    Replaced universal routing block in {filepath}")
        else:
            print(f"    WARNING: could not find routing block boundaries in {filepath}: b_start={b_start}, calc_end={calc_end}")

        # 3. Add sanitizeStationObj in setupStationAutocomplete
        if 'function sanitizeStationObj' not in content:
            target_render = 'function renderStationDropdown(matches) {'
            if target_render in content:
                content = content.replace(target_render, autocomplete_sanitizer + "\n      " + target_render, 1)
                # Also inside matches.forEach:
                old_foreach = "matches.forEach(function(st) {"
                new_foreach = "matches.forEach(function(st) {\n          st = sanitizeStationObj(st);"
                content = content.replace(old_foreach, new_foreach, 1)
                print(f"    Injected sanitizeStationObj into {filepath}")

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

def update_embeds_and_snippets():
    print("--- 4. Updating embeds and snippets with version 383 / 3.8.3 ---")
    # test_embed.html
    if os.path.exists('test_embed.html'):
        with open('test_embed.html', 'r', encoding='utf-8') as f:
            t = f.read()
        t = re.sub(r'\?v=\d+', '?v=383', t)
        t = re.sub(r'v\d+\.\d+\.\d+', 'v3.8.3', t)
        with open('test_embed.html', 'w', encoding='utf-8') as f:
            f.write(t)
        print("  Updated test_embed.html (?v=383)")

    # tilda-embed-snippet.html
    if os.path.exists('tilda-embed-snippet.html'):
        with open('tilda-embed-snippet.html', 'r', encoding='utf-8') as f:
            t = f.read()
        t = re.sub(r'\?v=\d+\.\d+\.\d+', '?v=3.8.3', t)
        t = re.sub(r'\?v=\d+', '?v=383', t)
        with open('tilda-embed-snippet.html', 'w', encoding='utf-8') as f:
            f.write(t)
        print("  Updated tilda-embed-snippet.html (?v=3.8.3)")

def verify_with_jsc():
    print("--- 5. Verifying calculation engine with JSC ---")
    test_js = """
load('railway_calc_engine.js');

function assertTest(name, cond, msg) {
  if (!cond) {
    print('FAIL: [' + name + '] ' + msg);
    throw new Error('Assertion failed: ' + name);
  } else {
    print('PASS: [' + name + '] ' + msg);
  }
}

// TEST 1: Chukursay -> Tukimachi (domestic intra-hub)
var r1 = CaravanRailwayEngine.calculateTariff({from: 'Чукурсай (720000)', to: 'Тукимачи (723511)'});
assertTest('Test 1: Chukursay -> Tukimachi', r1.totalKm === 14, 'Expected 14 km, got ' + r1.totalKm + ' km');
assertTest('Test 1 stops', r1.itinerary.length === 3, 'Expected 3 stops, got ' + r1.itinerary.length);

// TEST 2: Kostanay -> Hairatan (Kazakhstan to Afghanistan transit)
var r2 = CaravanRailwayEngine.calculateTariff({from: 'Костанай (684001)', to: 'Хайратан (эксп.) (000251)'});
assertTest('Test 2: Kostanay -> Hairatan', r2.totalKm === 2894, 'Expected 2894 km, got ' + r2.totalKm + ' km');
assertTest('Test 2 legs', r2.legs.length === 3, 'Expected 3 legs, got ' + r2.legs.length);
assertTest('Test 2 dest', r2.itinerary[r2.itinerary.length-1].name.indexOf('Хайратан') !== -1, 'Expected dest Hairatan');

// TEST 3: Tbilisi -> Sergeli (Georgia to Uzbekistan Middle Corridor)
var r3 = CaravanRailwayEngine.calculateTariff({from: 'Тбилиси-Сортировочная (эксп.) (560063)', to: 'Сергели (723507)'});
assertTest('Test 3: Tbilisi -> Sergeli', r3.totalKm > 2800 && r3.totalKm < 3000, 'Expected ~2843 km, got ' + r3.totalKm + ' km');
assertTest('Test 3 origin country', r3.fromStation.country === 'GEO' && r3.fromStation.admin === 'ГРЗ', 'Expected GEO / ГРЗ, got ' + r3.fromStation.country + ' / ' + r3.fromStation.admin);

// TEST 4: Poti -> Vladivostok (Georgia to Russia overland)
var r4 = CaravanRailwayEngine.calculateTariff({from: 'Поти (паром, эксп. на Варну) (572003)', to: 'Владивосток (эксп.) (980200)'});
assertTest('Test 4: Poti -> Vladivostok', r4.totalKm === 10501, 'Expected 10501 km, got ' + r4.totalKm + ' km');
assertTest('Test 4 dest code', r4.toStation.code === '980200', 'Expected 980200');

// TEST 5: Moscow -> Chukursay (Transit borders)
var r5_il = CaravanRailwayEngine.calculateTariff({from: 'Москва-Южный Порт (193504)', to: 'Чукурсай (720000)', manualBorder1: '666501', manualBorder2: '704101'});
assertTest('Test 5: Moscow -> Chukursay (Iletsk)', r5_il.totalKm === 3585, 'Expected 3585 km, got ' + r5_il.totalKm + ' km');

var r5_lok = CaravanRailwayEngine.calculateTariff({from: 'Москва-Южный Порт (193504)', to: 'Чукурсай (720000)', manualBorder1: '711105', manualBorder2: '704101'});
assertTest('Test 5: Moscow -> Chukursay (Lokot)', r5_lok.totalKm === 5656, 'Expected 5656 km, got ' + r5_lok.totalKm + ' km');

print('ALL 5 JAVASCRIPT ENGINE TESTS PASSED PERFECTLY!');
"""
    with open('scratch/verify_jsc_run.js', 'w', encoding='utf-8') as f:
        f.write(test_js)

    res = subprocess.run(['/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc', 'scratch/verify_jsc_run.js'], capture_output=True, text=True)
    print(res.stdout)
    if res.returncode != 0:
        print("ERROR in JSC verification:", res.stderr)
        sys.exit(1)

def main():
    print("=========================================================")
    print("  CARAVAN 1520 UNIVERSAL ROUTING & STATIONS UPGRADE v3.8.3")
    print("=========================================================")
    update_sqlite()
    stations = update_railway_stations_json()
    update_js_and_html_files(stations)
    update_embeds_and_snippets()
    verify_with_jsc()
    print("=========================================================")
    print("  UPGRADE COMPLETED SUCCESSFULLY!")
    print("=========================================================")

if __name__ == '__main__':
    main()
