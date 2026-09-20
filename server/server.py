#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Caravan Rail Engine - Multi-Modal Logistics & Customs Super-API
Powers:
1. Rail 1520 mm Freight Calculation (R-Tariff parity, intermediate stations)
2. Rolling Stock Fleet Leasing (Хопперы, крытые, полувагоны, платформы, цистерны)
3. International Road Freight (Тенты 86-120 м³, рефрижераторы, негабаритные тралы)
4. Air Cargo Freight (IATA Chargeable weight formulas, air cargo hubs)
5. Multimodal Intermodal Container Logistics (Door-to-Door, 20'/40' HC)
6. AIS Customs Duties & Fiscal Calculator (13,140 TN VED codes, duties, excise, VAT 12%/20%)
7. Smart Document Checklist Generator (Manager offloading system)
"""

import os
import sys
import json
import math
import sqlite3
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8090))

# Locate DB
DB_NAME = "caravan_logistics.db"
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", DB_NAME)
if not os.path.exists(DB_PATH):
    if os.path.exists(DB_NAME):
        DB_PATH = DB_NAME
    elif os.path.exists("caravan_rail.db"):
        DB_PATH = "caravan_rail.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Pre-compiled canonical transit corridors (TR-4)
CANONICAL_CORRIDORS = {
    ("666501", "704101"): {
        "distance": 2080,
        "admin": "КТЖ",
        "nodes": ["Илецк-1 (эксп.)", "Актобе", "Кандыагаш", "Шалкар", "Саксаульская", "Казалинск", "Кызылорда", "Туркестан", "Арысь", "Шымкент", "Сарыагаш (эксп.)"]
    },
    ("660008", "704101"): {
        "distance": 2150,
        "admin": "КТЖ",
        "nodes": ["Озинки (эксп.)", "Семиглавый Мар", "Уральск", "Кандыагаш", "Шалкар", "Казалинск", "Кызылорда", "Туркестан", "Арысь", "Сарыагаш (эксп.)"]
    },
    ("709302", "704101"): {
        "distance": 1850,
        "admin": "КТЖ",
        "nodes": ["Жана-Семей", "Актогай", "Берлик", "Шу", "Луговая", "Тараз", "Тюлькубас", "Шымкент", "Сарыагаш (эксп.)"]
    },
    ("709406", "704101"): {
        "distance": 1850,
        "admin": "КТЖ",
        "nodes": ["Семей", "Актогай", "Берлик", "Шу", "Луговая", "Тараз", "Тюлькубас", "Шымкент", "Сарыагаш (эксп.)"]
    },
    ("660008", "660309"): {
        "distance": 1480,
        "admin": "КТЖ",
        "nodes": ["Озинки (эксп.)", "Уральск", "Атырау", "Макат", "Кульсары", "Бейнеу"]
    },
    ("666501", "660309"): {
        "distance": 1930,
        "admin": "КТЖ",
        "nodes": ["Илецк-1 (эксп.)", "Актобе", "Кандыагаш", "Макат", "Кульсары", "Бейнеу"]
    },
    ("680007", "704101"): {
        "distance": 1680,
        "admin": "КТЖ",
        "nodes": ["Петропавловск", "Кокшетау-1", "Астана", "Караганда", "Мойынты", "Шу", "Шымкент", "Сарыагаш (эксп.)"]
    },
    ("690002", "704101"): {
        "distance": 1540,
        "admin": "КТЖ",
        "nodes": ["Пресногорьковская", "Новоишимская", "Кокшетау-1", "Астана", "Караганда", "Шу", "Сарыагаш (эксп.)"]
    },
    ("704101", "720000"): {
        "distance": 28,
        "admin": "УТИ",
        "nodes": ["Сарыагаш (эксп.)", "Келес (эксп.)", "Чукурсай"]
    },
    ("704101", "722400"): {
        "distance": 42,
        "admin": "УТИ",
        "nodes": ["Сарыагаш (эксп.)", "Келес (эксп.)", "Ташкент-Товарный"]
    },
    ("704101", "723507"): {
        "distance": 56,
        "admin": "УТИ",
        "nodes": ["Сарыагаш (эксп.)", "Келес (эксп.)", "Ташкент-Товарный", "Сергели"]
    }
}

BORDER_STATIONS = {
    "iletsk": {"code": "666501", "name": "Илецк-1 (эксп.)", "country": "RUS/KAZ"},
    "ozinki": {"code": "660008", "name": "Озинки (эксп.)", "country": "RUS/KAZ"},
    "semey": {"code": "709302", "name": "Жана-Семей / Локоть", "country": "RUS/KAZ"},
    "petropavlovsk": {"code": "680007", "name": "Петропавловск", "country": "RUS/KAZ"},
    "zauralye": {"code": "690002", "name": "Пресногорьковская", "country": "RUS/KAZ"},
    "saryagash": {"code": "704101", "name": "Сарыагаш (эксп.)", "country": "KAZ/UZB"},
    "beyneu": {"code": "660309", "name": "Бейнеу / Каракалпакия", "country": "KAZ/UZB"},
    "keles": {"code": "720000", "name": "Келес (эксп.)", "country": "UZB"}
}

def geo_dist(lat1, lon1, lat2, lon2):
    if not (lat1 and lon1 and lat2 and lon2):
        return 450
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2.0)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return int(R * c * 1.46)

# 1. Rail Freight Calculation
def calculate_rail(from_code, to_code, border_pref=None, weight_tons=60, cargo_code="110100", wagon_type="covered"):
    conn = get_db()
    cur = conn.cursor()

    orig = cur.execute("SELECT * FROM stations WHERE code = ?", (from_code,)).fetchone()
    dest = cur.execute("SELECT * FROM stations WHERE code = ?", (to_code,)).fetchone()

    if not orig or not dest:
        conn.close()
        return {"error": "Станция отправления или назначения не найдена"}

    orig = dict(orig)
    dest = dict(dest)

    cargo = cur.execute("SELECT * FROM cargo_etsng WHERE code_etsng = ?", (cargo_code,)).fetchone()
    if cargo:
        cargo = dict(cargo)
    else:
        cargo = {"code_etsng": cargo_code, "name": "Груз общий", "tariff_class": 2}

    is_rus_to_uzb = (orig["country"] in ["RUS", "BLR"] and dest["country"] == "UZB")
    is_kaz_to_uzb = (orig["country"] == "KAZ" and dest["country"] == "UZB")

    legs = []
    all_nodes = []

    b1_key = border_pref or "iletsk"
    if b1_key not in BORDER_STATIONS:
        b1_key = "iletsk"

    b1_station = BORDER_STATIONS[b1_key]
    b2_station = BORDER_STATIONS["saryagash"]

    if is_rus_to_uzb:
        leg1_km = geo_dist(orig["lat"], orig["lon"], 51.16, 54.98) if b1_key == "iletsk" else geo_dist(orig["lat"], orig["lon"], 51.18, 49.72)
        if leg1_km < 80: leg1_km = 80
        legs.append({
            "country": orig["country"],
            "country_name": "Россия (РЖД)" if orig["country"] == "RUS" else "Беларусь (БЧ)",
            "admin": orig["admin"],
            "from": orig["name"],
            "to": b1_station["name"],
            "distance_km": leg1_km
        })
        all_nodes.extend([orig["name"], b1_station["name"]])

        corridor_key = (b1_station["code"], b2_station["code"])
        corridor_data = CANONICAL_CORRIDORS.get(corridor_key, {
            "distance": 2080,
            "nodes": [b1_station["name"], "Актобе", "Кандыагаш", "Шалкар", "Саксаульская", "Казалинск", "Кызылорда", "Туркестан", "Арысь", b2_station["name"]]
        })
        legs.append({
            "country": "KAZ",
            "country_name": "Казахстан (КТЖ)",
            "admin": "КТЖ",
            "from": b1_station["name"],
            "to": b2_station["name"],
            "distance_km": corridor_data["distance"]
        })
        all_nodes.extend(corridor_data["nodes"][1:])

        dest_corridor = CANONICAL_CORRIDORS.get((b2_station["code"], dest["code"]))
        if dest_corridor:
            leg3_km = dest_corridor["distance"]
            uti_nodes = dest_corridor["nodes"]
        else:
            leg3_km = geo_dist(41.45, 69.17, dest["lat"], dest["lon"])
            if leg3_km < 28: leg3_km = 28
            uti_nodes = [b2_station["name"], "Келес (эксп.)", dest["name"]]

        legs.append({
            "country": "UZB",
            "country_name": "Узбекистан (УТИ)",
            "admin": "УТИ",
            "from": b2_station["name"],
            "to": dest["name"],
            "distance_km": leg3_km
        })
        all_nodes.extend(uti_nodes[1:])

    elif is_kaz_to_uzb:
        corridor_key = (orig["code"], b2_station["code"])
        if corridor_key in CANONICAL_CORRIDORS:
            leg1_km = CANONICAL_CORRIDORS[corridor_key]["distance"]
            nodes = CANONICAL_CORRIDORS[corridor_key]["nodes"]
        else:
            leg1_km = geo_dist(orig["lat"], orig["lon"], 41.45, 69.17)
            nodes = [orig["name"], "Узловая ст.", "Шымкент", b2_station["name"]]

        legs.append({
            "country": "KAZ",
            "country_name": "Казахстан (КТЖ)",
            "admin": "КТЖ",
            "from": orig["name"],
            "to": b2_station["name"],
            "distance_km": leg1_km
        })
        all_nodes.extend(nodes)

        dest_corridor = CANONICAL_CORRIDORS.get((b2_station["code"], dest["code"]))
        leg2_km = dest_corridor["distance"] if dest_corridor else 28
        legs.append({
            "country": "UZB",
            "country_name": "Узбекистан (УТИ)",
            "admin": "УТИ",
            "from": b2_station["name"],
            "to": dest["name"],
            "distance_km": leg2_km
        })
        all_nodes.append(dest["name"])

    else:
        d_km = geo_dist(orig["lat"], orig["lon"], dest["lat"], dest["lon"])
        legs.append({
            "country": orig["country"],
            "country_name": orig["country_name"],
            "admin": orig["admin"],
            "from": orig["name"],
            "to": dest["name"],
            "distance_km": d_km
        })
        all_nodes = [orig["name"], dest["name"]]

    total_km = sum(l["distance_km"] for l in legs)

    tariff_class = cargo.get("tariff_class", 2)
    class_coeff = {1: 0.75, 2: 1.0, 3: 1.35}.get(tariff_class, 1.0)
    wagon_coeff = {"covered": 1.0, "grain": 0.95, "platform": 0.90, "tank": 1.10}.get(wagon_type, 1.0)

    tariff_legs = []
    total_cost_usd = 0
    for leg in legs:
        km = leg["distance_km"]
        rate = 0.0145 * class_coeff * wagon_coeff if leg["admin"] == "КТЖ" else (0.0190 if leg["admin"] == "УТИ" else 0.0160)
        leg_cost = round(rate * km * weight_tons + 120, 2)
        total_cost_usd += leg_cost
        tariff_legs.append({
            "country": leg["country_name"],
            "distance_km": km,
            "rate_per_ton_km": round(rate, 4),
            "cost_usd": leg_cost,
            "cost_rub": round(leg_cost * 92.5, 2),
            "cost_uzs": round(leg_cost * 12850, 0)
        })

    num_borders = len(legs) - 1
    transit_days = max(2, int(total_km / 330) + (num_borders * 2))

    clean_nodes = []
    for n in all_nodes:
        if not clean_nodes or clean_nodes[-1] != n:
            clean_nodes.append(n)

    # Generate document checklist for rail
    docs = get_document_checklist("rail", cargo.get("category", "all"), is_import=1)

    conn.close()
    return {
        "status": "success",
        "modality": "rail",
        "origin": orig,
        "destination": dest,
        "cargo": cargo,
        "wagon_type": wagon_type,
        "weight_tons": weight_tons,
        "total_distance_km": total_km,
        "estimated_days": transit_days,
        "legs": tariff_legs,
        "total_cost": {
            "usd": round(total_cost_usd, 2),
            "rub": round(total_cost_usd * 92.5, 2),
            "uzs": round(total_cost_usd * 12850, 0)
        },
        "intermediate_stations": clean_nodes,
        "documents_required": docs
    }

# 2. Fleet Leasing Calculation (Аренда ПС)
def calculate_fleet(wagon_type="grain", count=10, rent_days=30, rent_type="daily", route_from="Акмола", route_to="Ташкент"):
    conn = get_db()
    cur = conn.cursor()
    fleet = cur.execute("SELECT * FROM fleet_rates WHERE wagon_type = ?", (wagon_type,)).fetchone()
    conn.close()

    if not fleet:
        fleet = {
            "wagon_type": wagon_type,
            "title": "Хоппер-зерновоз (116–120 м³)",
            "daily_rate_usd": 42.0,
            "daily_rate_rub": 3900.0,
            "roundtrip_base_usd": 1260.0
        }
    else:
        fleet = dict(fleet)

    daily_rate = fleet["daily_rate_usd"]

    if rent_type == "roundtrip":
        # Roundtrip calculation
        turnaround_days = max(18, int(rent_days))
        wagon_cost = fleet["roundtrip_base_usd"]
        empty_return_fee = 380.0 # Standard empty rail return tariff
        total_per_wagon = wagon_cost + empty_return_fee
        total_usd = total_per_wagon * count
    else:
        # Pure daily leasing
        turnaround_days = rent_days
        total_per_wagon = daily_rate * rent_days
        total_usd = total_per_wagon * count

    docs = get_document_checklist("fleet", "all", is_import=1)

    return {
        "status": "success",
        "modality": "fleet",
        "fleet_type": fleet["title"],
        "wagon_type": wagon_type,
        "wagon_count": count,
        "rent_days": rent_days,
        "rent_type": rent_type,
        "daily_rate_usd": daily_rate,
        "total_cost": {
            "usd": round(total_usd, 2),
            "rub": round(total_usd * 92.5, 2),
            "uzs": round(total_usd * 12850, 0)
        },
        "details": {
            "cost_per_wagon_usd": round(total_per_wagon, 2),
            "turnaround_days": turnaround_days,
            "route": f"{route_from} ➔ {route_to}"
        },
        "documents_required": docs
    }

# 3. Road Trucking Calculation (Авто)
def calculate_road(from_city="Москва", to_city="Ташкент", truck_type="tent", weight_tons=20, volume_m3=86):
    # Standard CIS trucking rates and corridor distances
    dist_map = {
        ("москва", "ташкент"): 3400,
        ("самара", "ташкент"): 2350,
        ("санкт-петербург", "ташкент"): 3950,
        ("алматы", "ташкент"): 810,
        ("астана", "ташкент"): 1550,
        ("екатеринбург", "ташкент"): 2250,
        ("новосибирск", "ташкент"): 2350,
        ("стамбул", "ташкент"): 4800,
        ("урумчи", "ташкент"): 1200
    }
    key = (from_city.lower().strip(), to_city.lower().strip())
    distance_km = dist_map.get(key, 2800)

    # Rates per km (USD)
    rates = {
        "tent": 1.45,       # 86-92 m3 tilt
        "mega": 1.65,       # 110-120 m3 mega
        "reefer": 1.95,     # refrigerated
        "lowbed": 2.60,     # heavy trailer
        "ltl": 0.35         # per pallet / partial
    }
    rate_km = rates.get(truck_type, 1.45)
    freight_usd = round(distance_km * rate_km + 250, 2) # 250 border/terminal fee
    days = max(3, int(distance_km / 550) + 2)

    docs = get_document_checklist("road", "all", is_import=1)

    return {
        "status": "success",
        "modality": "road",
        "from_city": from_city,
        "to_city": to_city,
        "truck_type": truck_type,
        "distance_km": distance_km,
        "estimated_days": days,
        "rate_per_km": rate_km,
        "total_cost": {
            "usd": freight_usd,
            "rub": round(freight_usd * 92.5, 2),
            "uzs": round(freight_usd * 12850, 0)
        },
        "documents_required": docs
    }

# 4. Air Cargo Calculation (Авиа)
def calculate_air(origin_iata="CAN", dest_iata="TAS", gross_weight_kg=350, volume_m3=2.5, is_danger=False):
    conn = get_db()
    cur = conn.cursor()
    orig = cur.execute("SELECT * FROM air_hubs WHERE iata_code = ?", (origin_iata,)).fetchone()
    dest = cur.execute("SELECT * FROM air_hubs WHERE iata_code = ?", (dest_iata,)).fetchone()
    conn.close()

    rate_per_kg = orig["base_rate_per_kg_usd"] if orig else 3.50
    min_charge = orig["min_charge_usd"] if orig else 150.0

    # IATA standard: 1 m3 = 167 kg chargeable weight
    vol_weight = volume_m3 * 167.0
    chargeable_weight = max(gross_weight_kg, vol_weight)

    danger_fee = 180.0 if is_danger else 0.0
    security_handling = round(chargeable_weight * 0.15 + 45.0, 2)
    air_freight = round(chargeable_weight * rate_per_kg, 2)
    total_usd = max(min_charge, air_freight + security_handling + danger_fee)

    docs = get_document_checklist("air", "danger" if is_danger else "all", is_import=1)

    return {
        "status": "success",
        "modality": "air",
        "origin": dict(orig) if orig else {"iata": origin_iata},
        "destination": dict(dest) if dest else {"iata": dest_iata},
        "gross_weight_kg": gross_weight_kg,
        "volume_m3": volume_m3,
        "chargeable_weight_kg": round(chargeable_weight, 1),
        "rate_per_kg_usd": rate_per_kg,
        "estimated_days": "3-5 дней (включая таможенный СВХ)",
        "total_cost": {
            "usd": round(total_usd, 2),
            "rub": round(total_usd * 92.5, 2),
            "uzs": round(total_usd * 12850, 0)
        },
        "breakdown": {
            "air_freight_usd": air_freight,
            "security_handling_usd": security_handling,
            "danger_fee_usd": danger_fee
        },
        "documents_required": docs
    }

# 5. Multimodal Container Calculation (Мультимодал)
def calculate_multimodal(route_corridor="china_uzb", container_type="40hc", count=1, last_mile_city="Ташкент"):
    # Pre-calculated benchmark multi-modal corridors
    corridors = {
        "china_uzb": {
            "title": "Китай (Нинбо/Шанхай) ➔ Алтынколь ➔ Ташкент",
            "sea_thc_usd": 1200,
            "rail_train_usd": 3850,
            "last_mile_usd": 350,
            "days": "16-20 дней"
        },
        "uae_uzb": {
            "title": "ОАЭ (Джебель-Али) ➔ Бендер-Аббас (Иран) ➔ Серахс ➔ Ташкент",
            "sea_thc_usd": 1450,
            "rail_train_usd": 2900,
            "last_mile_usd": 350,
            "days": "22-26 дней"
        },
        "turkey_uzb": {
            "title": "Турция (Мерсин/Стамбул) ➔ Поти ➔ Баку ➔ Актау ➔ Ташкент",
            "sea_thc_usd": 1600,
            "rail_train_usd": 2800,
            "last_mile_usd": 350,
            "days": "18-24 дней"
        }
    }
    c_data = corridors.get(route_corridor, corridors["china_uzb"])
    size_factor = 1.0 if container_type == "40hc" else 0.75
    unit_usd = (c_data["sea_thc_usd"] + c_data["rail_train_usd"]) * size_factor + c_data["last_mile_usd"]
    total_usd = round(unit_usd * count, 2)

    docs = get_document_checklist("multimodal", "all", is_import=1)

    return {
        "status": "success",
        "modality": "multimodal",
        "corridor": c_data["title"],
        "container_type": container_type,
        "container_count": count,
        "estimated_days": c_data["days"],
        "total_cost": {
            "usd": total_usd,
            "rub": round(total_usd * 92.5, 2),
            "uzs": round(total_usd * 12850, 0)
        },
        "legs": [
            {"leg": "Морской фрахт + Терминал (THC)", "cost_usd": round(c_data["sea_thc_usd"] * size_factor, 2)},
            {"leg": "Ускоренный контейнерный поезд (Ж/Д)", "cost_usd": round(c_data["rail_train_usd"] * size_factor, 2)},
            {"leg": f"Автодоставка последней мили ({last_mile_city})", "cost_usd": c_data["last_mile_usd"]}
        ],
        "documents_required": docs
    }

# 6. AIS Customs Duties & Fiscal Calculator (Таможня)
def calculate_customs(tnved_code="1001990000", invoice_value=25000.0, currency="USD", freight_usd=2500.0):
    conn = get_db()
    cur = conn.cursor()
    code_clean = tnved_code.replace(" ", "")
    # Find matching TN VED
    row = cur.execute("SELECT * FROM tnved_codes WHERE code_clean LIKE ? LIMIT 1", (f"{code_clean[:6]}%",)).fetchone()
    conn.close()

    if row:
        row = dict(row)
        title = row["name"]
        duty_pct = row["base_duty_pct"]
        vat_pct = row["vat_pct"]
        excise_pct = row["excise_pct"]
    else:
        title = "Товары прочие"
        duty_pct = 5.0
        vat_pct = 12.0
        excise_pct = 0.0

    # Exchange rates (UZS)
    rates_uzs = {"USD": 12850.0, "EUR": 13950.0, "RUB": 139.0, "UZS": 1.0}
    rate_to_uzs = rates_uzs.get(currency.upper(), 12850.0)

    # Customs value CIF = Invoice + Freight
    customs_val_usd = invoice_value + freight_usd
    customs_val_uzs = customs_val_usd * 12850.0

    duty_amount_usd = round(customs_val_usd * (duty_pct / 100.0), 2)
    excise_amount_usd = round(customs_val_usd * (excise_pct / 100.0), 2)
    # VAT base = Customs value + Duty + Excise
    vat_base_usd = customs_val_usd + duty_amount_usd + excise_amount_usd
    vat_amount_usd = round(vat_base_usd * (vat_pct / 100.0), 2)
    # Customs fee (standard BRV scale)
    customs_fee_usd = 65.0

    total_fiscal_usd = round(duty_amount_usd + excise_amount_usd + vat_amount_usd + customs_fee_usd, 2)
    total_fiscal_uzs = round(total_fiscal_usd * 12850.0, 0)

    docs = get_document_checklist("customs", "all", is_import=1)

    return {
        "status": "success",
        "modality": "customs",
        "tnved": {
            "code": tnved_code,
            "title": title,
            "duty_pct": duty_pct,
            "vat_pct": vat_pct,
            "excise_pct": excise_pct
        },
        "customs_value_usd": round(customs_val_usd, 2),
        "customs_value_uzs": round(customs_val_uzs, 0),
        "payments": {
            "duty_usd": duty_amount_usd,
            "excise_usd": excise_amount_usd,
            "vat_usd": vat_amount_usd,
            "customs_fee_usd": customs_fee_usd,
            "total_usd": total_fiscal_usd,
            "total_uzs": total_fiscal_uzs
        },
        "documents_required": docs
    }

# 7. Smart Document Checklist Generator
def get_document_checklist(modality="rail", cargo_type="all", is_import=1):
    conn = get_db()
    cur = conn.cursor()
    rows = cur.execute("""
    SELECT doc_name, doc_code, is_mandatory, description 
    FROM document_rules 
    WHERE modality = ? OR modality = 'all'
    """, (modality,)).fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "name": r["doc_name"],
            "code": r["doc_code"],
            "mandatory": bool(r["is_mandatory"]),
            "description": r["description"]
        })
    return result

class RailEngineHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/" or path == "/api/health":
            conn = get_db()
            st_c = conn.cursor().execute("SELECT count(*) FROM stations").fetchone()[0]
            cg_c = conn.cursor().execute("SELECT count(*) FROM cargo_etsng").fetchone()[0]
            tn_c = conn.cursor().execute("SELECT count(*) FROM tnved_codes").fetchone()[0] if 'tnved_codes' in [t[0] for t in conn.cursor().execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()] else 0
            conn.close()
            resp = {
                "service": "Caravan Rail & Customs Engine Super-API",
                "version": "3.0.0",
                "status": "healthy",
                "stations_count": st_c,
                "cargo_count": cg_c,
                "tnved_count": tn_c,
                "modalities": ["rail", "fleet", "road", "air", "multimodal", "customs"]
            }
            self._send_json(resp)
            return

        elif path == "/api/stations":
            q = query.get("q", [""])[0].strip()
            limit = int(query.get("limit", [15])[0])
            conn = get_db()
            cur = conn.cursor()
            if q.isdigit():
                rows = cur.execute("""
                SELECT code, name, country, admin, road_name, is_border 
                FROM stations WHERE code LIKE ? LIMIT ?
                """, (f"{q}%", limit)).fetchall()
            else:
                rows = cur.execute("""
                SELECT code, name, country, admin, road_name, is_border 
                FROM stations WHERE name_lower LIKE ? ORDER BY is_border DESC, name ASC LIMIT ?
                """, (f"%{q.lower()}%", limit)).fetchall()

            conn.close()
            results = [{
                "code": r["code"],
                "name": r["name"],
                "country": r["country"],
                "admin": r["admin"],
                "road": r["road_name"],
                "is_border": bool(r["is_border"]),
                "display": f"{r['name']} ({r['code']}) — {r['admin']}"
            } for r in rows]
            self._send_json(results)
            return

        elif path == "/api/cargo":
            q = query.get("q", [""])[0].strip()
            limit = int(query.get("limit", [15])[0])
            conn = get_db()
            cur = conn.cursor()
            if q.isdigit():
                rows = cur.execute("""
                SELECT code_etsng, code_gng, name, category, tariff_class, default_wagon 
                FROM cargo_etsng WHERE code_etsng LIKE ? LIMIT ?
                """, (f"{q}%", limit)).fetchall()
            else:
                rows = cur.execute("""
                SELECT code_etsng, code_gng, name, category, tariff_class, default_wagon 
                FROM cargo_etsng WHERE name_lower LIKE ? LIMIT ?
                """, (f"%{q.lower()}%", limit)).fetchall()

            conn.close()
            results = [{
                "code": r["code_etsng"],
                "code_gng": r["code_gng"],
                "name": r["name"],
                "category": r["category"],
                "class": r["tariff_class"],
                "wagon": r["default_wagon"],
                "display": f"{r['name']} [ЕТСНГ {r['code_etsng']}]"
            } for r in rows]
            self._send_json(results)
            return

        elif path == "/api/customs/tnved":
            q = query.get("q", [""])[0].strip()
            limit = int(query.get("limit", [15])[0])
            conn = get_db()
            cur = conn.cursor()
            q_clean = q.replace(" ", "")
            if q_clean.isdigit():
                rows = cur.execute("""
                SELECT code, name, base_duty_pct, vat_pct, excise_pct 
                FROM tnved_codes WHERE code_clean LIKE ? LIMIT ?
                """, (f"{q_clean}%", limit)).fetchall()
            else:
                rows = cur.execute("""
                SELECT code, name, base_duty_pct, vat_pct, excise_pct 
                FROM tnved_codes WHERE name_lower LIKE ? LIMIT ?
                """, (f"%{q.lower()}%", limit)).fetchall()

            conn.close()
            results = [{
                "code": r["code"],
                "name": r["name"],
                "duty_pct": r["base_duty_pct"],
                "vat_pct": r["vat_pct"],
                "excise_pct": r["excise_pct"],
                "display": f"{r['code']} — {r['name']}"
            } for r in rows]
            self._send_json(results)
            return

        elif path == "/api/calculate" or path == "/api/calculate/rail":
            from_code = query.get("from", [""])[0]
            to_code = query.get("to", [""])[0]
            border = query.get("border", ["iletsk"])[0]
            weight = float(query.get("weight", [60])[0])
            cargo_code = query.get("cargo", ["110100"])[0]
            wagon = query.get("wagon", ["covered"])[0]

            res = calculate_rail(from_code, to_code, border, weight, cargo_code, wagon)
            self._send_json(res)
            return

        else:
            self._send_json({"error": "Endpoint not found"}, status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len) if content_len > 0 else b'{}'
        try:
            data = json.loads(body.decode("utf-8"))
        except Exception:
            data = {}

        if parsed.path == "/api/calculate" or parsed.path == "/api/calculate/rail":
            res = calculate_rail(
                data.get("from", ""),
                data.get("to", ""),
                data.get("border", "iletsk"),
                float(data.get("weight", 60)),
                data.get("cargo", "110100"),
                data.get("wagon", "covered")
            )
            self._send_json(res)
            return

        elif parsed.path == "/api/calculate/fleet":
            res = calculate_fleet(
                wagon_type=data.get("wagon_type", "grain"),
                count=int(data.get("count", 10)),
                rent_days=int(data.get("rent_days", 30)),
                rent_type=data.get("rent_type", "daily"),
                route_from=data.get("from", "Акмола"),
                route_to=data.get("to", "Ташкент")
            )
            self._send_json(res)
            return

        elif parsed.path == "/api/calculate/road":
            res = calculate_road(
                from_city=data.get("from", "Москва"),
                to_city=data.get("to", "Ташкент"),
                truck_type=data.get("truck_type", "tent"),
                weight_tons=float(data.get("weight", 20)),
                volume_m3=float(data.get("volume", 86))
            )
            self._send_json(res)
            return

        elif parsed.path == "/api/calculate/air":
            res = calculate_air(
                origin_iata=data.get("from", "CAN"),
                dest_iata=data.get("to", "TAS"),
                gross_weight_kg=float(data.get("weight", 350)),
                volume_m3=float(data.get("volume", 2.5)),
                is_danger=bool(data.get("is_danger", False))
            )
            self._send_json(res)
            return

        elif parsed.path == "/api/calculate/multimodal":
            res = calculate_multimodal(
                route_corridor=data.get("corridor", "china_uzb"),
                container_type=data.get("container", "40hc"),
                count=int(data.get("count", 1)),
                last_mile_city=data.get("city", "Ташкент")
            )
            self._send_json(res)
            return

        elif parsed.path == "/api/calculate/customs":
            res = calculate_customs(
                tnved_code=data.get("tnved", "1001990000"),
                invoice_value=float(data.get("value", 25000)),
                currency=data.get("currency", "USD"),
                freight_usd=float(data.get("freight", 2500))
            )
            self._send_json(res)
            return

        elif parsed.path == "/api/documents/checklist":
            modality = data.get("modality", "rail")
            cargo_cat = data.get("cargo_category", "all")
            is_imp = int(data.get("is_import", 1))
            docs = get_document_checklist(modality, cargo_cat, is_imp)
            self._send_json({"status": "success", "documents": docs})
            return

        else:
            self._send_json({"error": "Endpoint not found"}, status=404)

def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, RailEngineHandler)
    print(f"======================================================")
    print(f" Caravan Multi-Modal Logistics & Customs API v3.0")
    print(f" Port: {PORT}")
    print(f" Health check: http://localhost:{PORT}/api/health")
    print(f" Search TN VED: http://localhost:{PORT}/api/customs/tnved?q=пшеница")
    print(f"======================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
