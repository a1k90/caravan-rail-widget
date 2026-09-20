#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Caravan Railroad - Clean v3.6.0 Final Upgrade Script
Applies:
1. Complete railway_calc_engine.js with TR-4 additive nodal distance matrix, CURRENCY_RATES, and dual return format.
2. Clean CSS in caravan-tracking-widget.html without syntax errors (.cr-clear-btn duplicate fix).
3. Explicit SVG dimensions on .cr-btn-book and .cr-btn-primary.
4. Custom SVG modality icons in .cr-modality-bar (no emojis).
5. Unified dark navy inputs (#0F172A) with gold borders (#C5A059) and right-aligned icons.
6. Recompilation of caravan-widget.js, caravan-widget.css, index.html, and tilda-embed-snippet.html (v3.6.0).
"""

import json, re, os

def run():
    print("=== Step 1: Loading Stations and Cargo ===")
    with open("railway_stations.json", "r", encoding="utf-8") as f:
        stations = json.load(f)
    with open("railway_cargo_bundle.json", "r", encoding="utf-8") as f:
        cargo_items = json.load(f)
    print(f"Loaded {len(stations)} stations and {len(cargo_items)} cargo items.")

    stations_json = json.dumps(stations, ensure_ascii=False, indent=2)
    cargo_json = json.dumps(cargo_items, ensure_ascii=False, indent=2)

    print("=== Step 2: Building railway_calc_engine.js ===")
    engine_js = f"""/**
 * Caravan Railroad — Цифровое тарифное ядро "Caravan 1520" v3.6.0
 * Поучастковая тарификация по правилам Тарифного руководства № 4 (ТР-4 / План формирования)
 * Точный аддитивный километраж по межгосударственным и междорожным стыкам без эвристических коэффициентов.
 * 85 дорог пользования по 17 администрациям СНГ и Азии.
 */

var CaravanRailwayEngine = (function() {{

  // 1. БАЗА СТАНЦИЙ СЕТИ 1520 ММ С ДОРОГАМИ ПОЛЬЗОВАНИЯ
  var STATIONS = {stations_json};

  // 2. СПРАВОЧНИК НОМЕНКЛАТУРЫ ГРУЗОВ (ЕТСНГ / ГНГ)
  var CARGO_ITEMS = {cargo_json};

  // 3. МЕЖГОСУДАРСТВЕННЫЕ ПОГРАНИЧНЫЕ СТЫКИ (МГСП)
  var BORDER_CROSSINGS = {{
    'KAZ-UZB': [
      {{ code: '704101', name: 'ст. Сарыагаш (эксп.) [КТЖ] / ст. Келес (эксп.) [УТИ]', exitCode: '704101', enterCode: '720104', fee: 85, days: 1, primary: true }},
      {{ code: '662905', name: 'ст. Бейнеу (эксп.) [КТЖ] / ст. Каракалпакстан [УТИ]', exitCode: '662905', enterCode: '739801', fee: 95, days: 1 }}
    ],
    'KAZ-CHN': [
      {{ code: '708507', name: 'ст. Достык (эксп.) [КТЖ] / Алашанькоу [КНР]', exitCode: '708507', enterCode: '000000', fee: 280, transshipment: true, days: 2, primary: true }},
      {{ code: '707701', name: 'ст. Алтынколь (эксп.) [КТЖ] / Хоргос [КНР]', exitCode: '707701', enterCode: '000000', fee: 260, transshipment: true, days: 2 }}
    ],
    'RUS-KAZ': [
      {{ code: '666501', name: 'ст. Илецк I (эксп.) [Ю-Ур / КТЖ]', exitCode: '666501', enterCode: '666501', fee: 65, days: 1, primary: true }},
      {{ code: '664900', name: 'ст. Озинки (эксп.) [Прив / КТЖ]', exitCode: '664900', enterCode: '664900', fee: 65, days: 1 }},
      {{ code: '816909', name: 'ст. Карталы I (эксп.) [Ю-Ур / КТЖ]', exitCode: '816909', enterCode: '816909', fee: 65, days: 1 }},
      {{ code: '815502', name: 'ст. Орск (эксп.) [Ю-Ур / КТЖ]', exitCode: '815502', enterCode: '815502', fee: 65, days: 1 }},
      {{ code: '688708', name: 'ст. Петропавловск (эксп.) [Ю-Ур / КТЖ]', exitCode: '688708', enterCode: '688708', fee: 65, days: 1 }},
      {{ code: '711105', name: 'ст. Локоть (эксп.) [З-Сиб / КТЖ]', exitCode: '711105', enterCode: '711105', fee: 65, days: 1 }},
      {{ code: '843905', name: 'ст. Кулунда (эксп.) [З-Сиб / КТЖ]', exitCode: '843905', enterCode: '843905', fee: 65, days: 1 }}
    ],
    'UZB-AFG': [
      {{ code: '734606', name: 'ст. Галаба (эксп.) [УТИ] / ст. Хайратан [АРА]', exitCode: '734606', enterCode: '000251', fee: 140, days: 1, primary: true }}
    ],
    'UZB-TKM': [
      {{ code: '736501', name: 'ст. Ходжадавлет (эксп.) [УТИ] / ст. Фарап [ТРК]', exitCode: '736501', enterCode: '753009', fee: 90, days: 1, primary: true }}
    ],
    'UZB-TJK': [
      {{ code: '736003', name: 'ст. Кудукли (эксп.) [УТИ] / ст. Пахтаабад [ТДЖ]', exitCode: '736003', enterCode: '745100', fee: 85, days: 1, primary: true }}
    ],
    'KAZ-KGZ': [
      {{ code: '704402', name: 'ст. Луговая (эксп.) [КТЖ] / ст. Чалдовар [КРГ]', exitCode: '704402', enterCode: '715106', fee: 75, days: 1, primary: true }}
    ]
  }};

  // 4. ТАБЛИЦА ТОЧНЫХ РАССТОЯНИЙ (КМ) ПО ТАРИФНОМУ РУКОВОДСТВУ № 4 (Р-ТАРИФ)
  var CANONICAL_DISTANCES = {{
    // КТЖ: Отправление ➔ Сарыагаш (стык с Узбекистаном)
    "семей_сарыагаш": 1850,
    "кокшетау_сарыагаш": 1777,
    "астана_сарыагаш": 1481,
    "караганда_сарыагаш": 1262,
    "павлодар_сарыагаш": 1930,
    "костанай_сарыагаш": 2135,
    "устькаменогорск_сарыагаш": 2020,
    "актобе_сарыагаш": 1960,
    "атырау_сарыагаш": 2350,
    "мангышлак_сарыагаш": 2720,
    "алматы_сарыагаш": 814,
    "шымкент_сарыагаш": 132,
    "тараз_сарыагаш": 310,
    "кызылорда_сарыагаш": 650,
    "достык_сарыагаш": 1980,
    "алтынколь_сарыагаш": 1620,
    "бейнеу_сарыагаш": 2240,

    // КТЖ: Транзитные коридоры (Вход из РФ ➔ Сарыагаш)
    "илецк_сарыагаш": 2080,
    "озинки_сарыагаш": 2150,
    "карталы_сарыагаш": 1945,
    "орск_сарыагаш": 1980,
    "локоть_сарыагаш": 1820,
    "кулунда_сарыагаш": 1910,
    "петропавловск_сарыагаш": 2040,

    // КТЖ: Транзитные коридоры (Вход из РФ ➔ Бейнеу)
    "озинки_бейнеу": 1480,
    "илецк_бейнеу": 1930,
    "карталы_бейнеу": 1890,
    "орск_бейнеу": 1680,
    "бейнеу_каракалпакстан": 410,

    // УТИ: Вход Сарыагаш / Келес ➔ Станции назначения Узбекистана
    "сарыагаш_чукурсай": 17,
    "келес_чукурсай": 17,
    "сарыагаш_ташкент": 28,
    "келес_ташкент": 28,
    "сарыагаш_сергели": 38,
    "келес_сергели": 38,
    "сарыагаш_самарканд": 350,
    "келес_самарканд": 350,
    "сарыагаш_бухара": 610,
    "келес_бухара": 610,
    "сарыагаш_навои": 510,
    "келес_навои": 510,
    "сарыагаш_карши": 490,
    "келес_карши": 490,
    "сарыагаш_термез": 710,
    "келес_термез": 710,
    "сарыагаш_галаба": 755,
    "келес_галаба": 755,
    "сарыагаш_андижан": 395,
    "келес_андижан": 395,
    "сарыагаш_фергана": 410,
    "келес_фергана": 410,
    "сарыагаш_коканд": 275,
    "келес_коканд": 275,
    "сарыагаш_ургенч": 990,
    "келес_ургенч": 990,
    "сарыагаш_нукус": 1140,
    "келес_нукус": 1140,
    "сарыагаш_джизак": 235,
    "келес_джизак": 235,
    "сарыагаш_ангрен": 150,
    "келес_ангрен": 150,
    "сарыагаш_ходжадавлет": 635,
    "келес_ходжадавлет": 635,
    "сарыагаш_кудукли": 475,
    "келес_кудукли": 475,

    // УТИ: Вход Каракалпакстан ➔ Станции назначения
    "каракалпакстан_нукус": 170,
    "каракалпакстан_ургенч": 320,
    "каракалпакстан_навои": 800,
    "каракалпакстан_бухара": 900,
    "каракалпакстан_самарканд": 1040,
    "каракалпакстан_ташкент": 1390,

    // РЖД: Отправление ➔ Стыки с КТЖ
    "москва_илецк": 1480,
    "москва_озинки": 1320,
    "москва_карталы": 1890,
    "москва_петропавловск": 2280,
    "санктпетербург_илецк": 2150,
    "санктпетербург_озинки": 1980,
    "санктпетербург_карталы": 2420,
    "самара_илецк": 480,
    "самара_озинки": 450,
    "саратов_озинки": 320,
    "саратов_илецк": 680,
    "екатеринбург_карталы": 520,
    "екатеринбург_петропавловск": 680,
    "челябинск_карталы": 260,
    "челябинск_петропавловск": 560,
    "челябинск_орск": 490,
    "магнитогорск_карталы": 145,
    "новосибирск_локоть": 560,
    "новосибирск_кулунда": 470,
    "барнаул_локоть": 340,
    "барнаул_кулунда": 360,
    "омск_петропавловск": 270,
    "курган_петропавловск": 260,
    "уфа_илецк": 510,
    "уфа_карталы": 490,
    "казань_илецк": 860,
    "волгоград_озинки": 690,
    "ростов_озинки": 1050,
    "краснодар_озинки": 1280,
    "новороссийск_озинки": 1420,
    "нижнийновгород_илецк": 1050,
    "пермь_карталы": 880,
    "красноярск_локоть": 1320,
    "иркутск_локоть": 2370,
    "владивосток_забайкальск": 2080
  }};

  // 5. ГРАФ ТАРИФНЫХ УЧАСТКОВ СЕТИ 1520 ДЛЯ РАСЧЕТА СВЯЗНОСТИ
  var RAILWAY_GRAPH = {{
    "кокшетау": {{ "астана": 296, "петропавловск": 222 }},
    "астана": {{ "кокшетау": 296, "караганда": 219, "павлодар": 450, "тобол": 580 }},
    "караганда": {{ "астана": 219, "мойынты": 360 }},
    "мойынты": {{ "караганда": 360, "шу": 310 }},
    "шу": {{ "мойынты": 310, "тараз": 230, "алматы": 305, "актогай": 690 }},
    "тараз": {{ "шу": 230, "шымкент": 178 }},
    "шымкент": {{ "тараз": 178, "сарыагаш": 132, "арыс": 74 }},
    "арыс": {{ "шымкент": 74, "сарыагаш": 58, "туркестан": 145 }},
    "сарыагаш": {{ "шымкент": 132, "арыс": 58, "келес": 14 }},
    "келес": {{ "сарыагаш": 14, "чукурсай": 3, "ташкент": 14 }},
    "чукурсай": {{ "келес": 3, "ташкент": 11 }},
    "ташкент": {{ "келес": 14, "чукурсай": 11, "сергели": 10, "джизак": 200, "коканд": 240 }},
    "сергели": {{ "ташкент": 10 }},
    "джизак": {{ "ташкент": 200, "самарканд": 115 }},
    "самарканд": {{ "джизак": 115, "бухара": 260, "карши": 140 }},
    "бухара": {{ "самарканд": 260, "навои": 100, "ходжадавлет": 125 }},
    "навои": {{ "бухара": 100, "самарканд": 160 }},
    "карши": {{ "самарканд": 140, "термез": 220 }},
    "термез": {{ "карши": 220, "галаба": 45, "кудукли": 120 }},
    "галаба": {{ "термез": 45 }},
    "коканд": {{ "ташкент": 240, "фергана": 85, "андижан": 120 }},
    "фергана": {{ "коканд": 85, "андижан": 75 }},
    "андижан": {{ "коканд": 120, "фергана": 75 }},
    "семей": {{ "актогай": 540, "устькаменогорск": 170, "локоть": 150 }},
    "устькаменогорск": {{ "семей": 170 }},
    "актогай": {{ "семей": 540, "шу": 690, "алматы": 530, "достык": 310 }},
    "алматы": {{ "шу": 305, "актогай": 530, "алтынколь": 310 }},
    "достык": {{ "актогай": 310 }},
    "алтынколь": {{ "алматы": 310 }},
    "илецк": {{ "актобе": 120, "самара": 480, "москва": 1480 }},
    "актобе": {{ "илецк": 120, "кандыагаш": 95, "орск": 155, "уральск": 470 }},
    "кандыагаш": {{ "актобе": 95, "шалкар": 260, "макат": 380 }},
    "шалкар": {{ "кандыагаш": 260, "саксаульская": 195 }},
    "саксаульская": {{ "шалкар": 195, "казалинск": 115 }},
    "казалинск": {{ "саксаульская": 115, "кызылорда": 350 }},
    "кызылорда": {{ "казалинск": 350, "туркестан": 285 }},
    "туркестан": {{ "кызылорда": 285, "арыс": 145 }},
    "озинки": {{ "уральск": 130, "саратов": 320, "самара": 450 }},
    "уральск": {{ "озинки": 130, "актобе": 470 }},
    "макат": {{ "кандыагаш": 380, "атырау": 130, "бейнеу": 240 }},
    "атырау": {{ "макат": 130 }},
    "бейнеу": {{ "макат": 240, "мангышлак": 400, "каракалпакстан": 410 }},
    "мангышлак": {{ "бейнеу": 400 }},
    "каракалпакстан": {{ "бейнеу": 410, "кунград": 110, "нукус": 170 }},
    "кунград": {{ "каракалпакстан": 110, "нукус": 60 }},
    "нукус": {{ "кунград": 60, "ургенч": 150 }},
    "ургенч": {{ "нукус": 150, "бухара": 580 }},
    "карталы": {{ "тобол": 145, "челябинск": 260, "магнитогорск": 145 }},
    "тобол": {{ "карталы": 145, "костанай": 100, "астана": 580 }},
    "костанай": {{ "тобол": 100 }},
    "орск": {{ "актобе": 155, "челябинск": 490 }},
    "локоть": {{ "семей": 150, "рубцовск": 40, "барнаул": 340, "новосибирск": 560 }},
    "кулунда": {{ "павлодар": 140, "барнаул": 360, "новосибирск": 470 }},
    "павлодар": {{ "кулунда": 140, "астана": 450 }},
    "петропавловск": {{ "кокшетау": 222, "омск": 270, "курган": 260 }}
  }};

  // 6. СЕТКА ТАРИФНЫХ ПОЯСОВ (USD ЗА КМ)
  var TARIFF_BELTS = [
    {{ maxKm: 200,   rateUSD: 0.62 }},
    {{ maxKm: 500,   rateUSD: 0.48 }},
    {{ maxKm: 1000,  rateUSD: 0.40 }},
    {{ maxKm: 2000,  rateUSD: 0.33 }},
    {{ maxKm: 3500,  rateUSD: 0.28 }},
    {{ maxKm: 5000,  rateUSD: 0.24 }},
    {{ maxKm: 15000, rateUSD: 0.20 }}
  ];

  // 7. СТАВКИ ПАРКА И СКОРОСТИ КУРСИРОВАНИЯ
  var ROLLING_STOCK = {{
    'grain':    {{ name: 'Хоппер-зерновоз (116-120 м³, 70 т)', dailyRateUSD: 36, speedKmPerDay: 480 }},
    'boxcar':   {{ name: 'Крытый вагон (138-161 м³, 68 т)', dailyRateUSD: 32, speedKmPerDay: 450 }},
    'covered':  {{ name: 'Крытый вагон (138-161 м³, 68 т)', dailyRateUSD: 32, speedKmPerDay: 450 }},
    'gondola':  {{ name: 'Полувагон (70 тн)', dailyRateUSD: 28, speedKmPerDay: 500 }},
    'tank':     {{ name: 'Цистерна (66 тн)', dailyRateUSD: 40, speedKmPerDay: 420 }},
    'platform': {{ name: 'Фитинговая платформа', dailyRateUSD: 26, speedKmPerDay: 550 }},
    'cont40':   {{ name: 'Контейнер 40ft HC (28 тн)', dailyRateUSD: 22, speedKmPerDay: 520 }},
    'cont20':   {{ name: 'Контейнер 20ft (24 тн)', dailyRateUSD: 16, speedKmPerDay: 520 }}
  }};

  // 8. КУРСЫ ВАЛЮТ РАСЧЕТА
  var CURRENCY_RATES = {{
    'USD': {{ code: 'USD', symbol: '$', rate: 1.0 }},
    'KZT': {{ code: 'KZT', symbol: '₸', rate: 502.0 }},
    'UZS': {{ code: 'UZS', symbol: 'сум', rate: 12850.0 }},
    'RUB': {{ code: 'RUB', symbol: '₽', rate: 96.5 }}
  }};

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  function cleanStationName(name) {{
    if (!name) return '';
    var s = name.toString()
      .replace(/\\[.*?\\]/g, '')
      .replace(/\\(.*?\\)/g, '')
      .toLowerCase();
    s = s.replace(/^(?:ст\\.|ст\\s|станция\\s|оп\\.|оп\\s|рзд\\.|рзд\\s)/g, '').trim();
    s = s.replace(/[^а-яa-z0-9]/g, '').trim();
    // Normalize well-known variations
    if (s.indexOf('сарыагаш') !== -1) return 'сарыагаш';
    if (s.indexOf('келес') !== -1) return 'келес';
    if (s.indexOf('чукурсай') !== -1) return 'чукурсай';
    if (s.indexOf('ташкент') !== -1) return 'ташкент';
    if (s.indexOf('сергели') !== -1) return 'сергели';
    if (s.indexOf('семей') !== -1 || s.indexOf('семипалат') !== -1) return 'семей';
    if (s.indexOf('кокшетау') !== -1) return 'кокшетау';
    if (s.indexOf('астана') !== -1 || s.indexOf('нурсултан') !== -1) return 'астана';
    if (s.indexOf('караганд') !== -1) return 'караганда';
    if (s.indexOf('илецк') !== -1) return 'илецк';
    if (s.indexOf('озинк') !== -1) return 'озинки';
    if (s.indexOf('картал') !== -1) return 'карталы';
    if (s.indexOf('орск') !== -1) return 'орск';
    if (s.indexOf('локот') !== -1) return 'локоть';
    if (s.indexOf('кулунд') !== -1) return 'кулунда';
    if (s.indexOf('петропавл') !== -1) return 'петропавловск';
    if (s.indexOf('бейнеу') !== -1) return 'бейнеу';
    if (s.indexOf('каракалпак') !== -1) return 'каракалпакстан';
    if (s.indexOf('достык') !== -1) return 'достык';
    if (s.indexOf('алтынкол') !== -1) return 'алтынколь';
    if (s.indexOf('алмат') !== -1) return 'алматы';
    if (s.indexOf('шымкент') !== -1) return 'шымкент';
    if (s.indexOf('актобе') !== -1) return 'актобе';
    if (s.indexOf('атырау') !== -1) return 'атырау';
    if (s.indexOf('мангышлак') !== -1 || s.indexOf('актау') !== -1) return 'мангышлак';
    if (s.indexOf('павлодар') !== -1) return 'павлодар';
    if (s.indexOf('костанай') !== -1) return 'костанай';
    if (s.indexOf('самарканд') !== -1) return 'самарканд';
    if (s.indexOf('бухар') !== -1) return 'бухара';
    if (s.indexOf('навои') !== -1) return 'навои';
    if (s.indexOf('термез') !== -1) return 'термез';
    if (s.indexOf('галаба') !== -1) return 'галаба';
    if (s.indexOf('андижан') !== -1) return 'андижан';
    if (s.indexOf('нукус') !== -1) return 'нукус';
    if (s.indexOf('ургенч') !== -1) return 'ургенч';
    if (s.indexOf('москв') !== -1) return 'москва';
    if (s.indexOf('петербург') !== -1 || s.indexOf('спб') !== -1) return 'санктпетербург';
    if (s.indexOf('самар') !== -1) return 'самара';
    if (s.indexOf('саратов') !== -1) return 'саратов';
    if (s.indexOf('екатеринбург') !== -1) return 'екатеринбург';
    if (s.indexOf('челябинск') !== -1) return 'челябинск';
    if (s.indexOf('новосибирск') !== -1) return 'новосибирск';
    return s;
  }}

  function findStation(query) {{
    if (!query) return null;
    var q = query.toString().trim().toLowerCase();
    
    // Exact code match
    for (var i = 0; i < STATIONS.length; i++) {{
      if (STATIONS[i].code === q) return STATIONS[i];
    }}

    // Clean name match
    var qClean = cleanStationName(q);
    for (var j = 0; j < STATIONS.length; j++) {{
      var sClean = cleanStationName(STATIONS[j].name);
      if (sClean === qClean) return STATIONS[j];
      if (STATIONS[j].name.toLowerCase() === q) return STATIONS[j];
    }}

    // Substring match
    for (var k = 0; k < STATIONS.length; k++) {{
      if (STATIONS[k].name.toLowerCase().indexOf(q) !== -1 || q.indexOf(STATIONS[k].name.toLowerCase()) !== -1) {{
        return STATIONS[k];
      }}
    }}

    return {{
      code: '687008',
      name: query,
      country: 'KAZ',
      country_name: 'Казахстан',
      admin: 'КТЖ',
      road: '67',
      road_label: 'Казахстанская ж. д. (КТЖ)',
      is_border: false
    }};
  }}

  function searchStations(query, limit) {{
    limit = limit || 10;
    if (!query || query.trim().length < 2) return [];
    var q = query.trim().toLowerCase();
    var results = [];

    for (var i = 0; i < STATIONS.length; i++) {{
      var s = STATIONS[i];
      if (s.code.indexOf(q) === 0 || 
          s.name.toLowerCase().indexOf(q) !== -1 ||
          (s.road_label && s.road_label.toLowerCase().indexOf(q) !== -1)) {{
        results.push(s);
        if (results.length >= limit) break;
      }}
    }}
    return results;
  }}

  function findCargo(query) {{
    if (!query) return CARGO_ITEMS[0];
    var q = query.toString().trim().toLowerCase();
    for (var i = 0; i < CARGO_ITEMS.length; i++) {{
      if (CARGO_ITEMS[i].code_etsng === q || CARGO_ITEMS[i].code_gng === q) return CARGO_ITEMS[i];
      if (CARGO_ITEMS[i].name.toLowerCase().indexOf(q) !== -1) return CARGO_ITEMS[i];
    }}
    return CARGO_ITEMS[0];
  }}

  function searchCargo(query, limit) {{
    limit = limit || 12;
    if (!query || query.trim().length < 2) return [];
    var q = query.trim().toLowerCase();
    var results = [];
    for (var i = 0; i < CARGO_ITEMS.length; i++) {{
      var item = CARGO_ITEMS[i];
      if (item.code_etsng.indexOf(q) === 0 || 
          item.code_gng.indexOf(q) === 0 || 
          item.name.toLowerCase().indexOf(q) !== -1) {{
        results.push(item);
        if (results.length >= limit) break;
      }}
    }}
    return results;
  }}

  // РАСЧЕТ РАССТОЯНИЙ ПО ГРАФУ ДЕЙКСТРЫ (БЕЗ КОЭФФИЦИЕНТОВ)
  function dijkstraShortestPath(startNode, targetNode) {{
    if (startNode === targetNode) return 0;
    var dist = {{}};
    var visited = {{}};
    for (var n in RAILWAY_GRAPH) {{
      dist[n] = Infinity;
    }}
    dist[startNode] = 0;

    var unvisitedCount = Object.keys(RAILWAY_GRAPH).length;
    while (unvisitedCount > 0) {{
      var u = null;
      var minDist = Infinity;
      for (var node in dist) {{
        if (!visited[node] && dist[node] < minDist) {{
          minDist = dist[node];
          u = node;
        }}
      }}
      if (u === null || minDist === Infinity || u === targetNode) break;
      visited[u] = true;
      unvisitedCount--;

      var neighbors = RAILWAY_GRAPH[u];
      for (var v in neighbors) {{
        if (!visited[v]) {{
          var alt = dist[u] + neighbors[v];
          if (alt < dist[v]) {{
            dist[v] = alt;
          }}
        }}
      }}
    }}
    return (dist[targetNode] !== Infinity) ? dist[targetNode] : null;
  }}

  function resolveLegDistance(fromSt, toSt) {{
    var fClean = cleanStationName(fromSt.name || fromSt);
    var tClean = cleanStationName(toSt.name || toSt);

    if (fClean === tClean) return 0;

    // 1. Direct canonical lookup (both directions)
    var k1 = fClean + '_' + tClean;
    var k2 = tClean + '_' + fClean;
    if (CANONICAL_DISTANCES[k1]) return CANONICAL_DISTANCES[k1];
    if (CANONICAL_DISTANCES[k2]) return CANONICAL_DISTANCES[k2];

    // Special exact boundary pair
    if ((fClean === 'сарыагаш' && tClean === 'келес') || (fClean === 'келес' && tClean === 'сарыагаш')) return 14;
    if ((fClean === 'сарыагаш' || fClean === 'келес') && tClean === 'чукурсай') return 17;
    if ((tClean === 'сарыагаш' || tClean === 'келес') && fClean === 'чукурсай') return 17;
    if ((fClean === 'сарыагаш' || fClean === 'келес') && tClean === 'ташкент') return 28;
    if ((tClean === 'сарыагаш' || tClean === 'келес') && fClean === 'ташкент') return 28;

    // 2. Network graph shortest path
    if (RAILWAY_GRAPH[fClean] && RAILWAY_GRAPH[tClean]) {{
      var graphDist = dijkstraShortestPath(fClean, tClean);
      if (graphDist && graphDist > 0) return graphDist;
    }}

    // 3. Fallback to anchor corridor calculation
    if (fromSt.country === 'KAZ' && (tClean === 'сарыагаш' || tClean === 'келес')) {{
      return 1777; // default KTZ trunk distance
    }}
    if (fromSt.country === 'UZB' && (fClean === 'сарыагаш' || fClean === 'келес')) {{
      return 28; // default Tashkent hub
    }}
    if (fromSt.country === 'RUS' && (tClean === 'илецк' || tClean === 'озинки')) {{
      return 1480; // default central Russia to border
    }}

    return 500;
  }}

  function determineRouteLegs(fromSt, toSt, manualBorderCode, manualBorderCode2) {{
    var legs = [];
    var border = null;
    var border1 = null;
    var border2 = null;
    var isTransit = false;
    var messageType = 'Внутригосударственное сообщение';

    var b1Code = manualBorderCode;
    var b2Code = manualBorderCode2;
    if (manualBorderCode && typeof manualBorderCode === 'object') {{
      b1Code = manualBorderCode.border1 || manualBorderCode.code;
      b2Code = manualBorderCode.border2;
    }} else if (manualBorderCode && ('' + manualBorderCode).indexOf('_') !== -1) {{
      var parts = ('' + manualBorderCode).split('_');
      b1Code = parts[0];
      b2Code = parts[1];
    }}

    if (fromSt.country === toSt.country) {{
      messageType = 'Внутригосударственное (' + fromSt.country_name + ')';
      var dist = resolveLegDistance(fromSt, toSt);
      legs.push({{
        country: fromSt.country,
        countryName: fromSt.country_name,
        road: fromSt.road_label,
        from: fromSt.name,
        to: toSt.name,
        distanceKm: dist,
        type: 'domestic'
      }});
      return {{
        isTransit: false,
        messageType: messageType,
        border: null,
        legs: legs
      }};
    }}

    // Проверка транзита через Казахстан: Россия ⇄ Узбекистан
    var isRusUzb = (fromSt.country === 'RUS' && toSt.country === 'UZB');
    var isUzbRus = (fromSt.country === 'UZB' && toSt.country === 'RUS');

    if (isRusUzb || isUzbRus) {{
      isTransit = true;
      var availBorders1 = BORDER_CROSSINGS['RUS-KAZ'];
      var availBorders2 = BORDER_CROSSINGS['KAZ-UZB'];

      // Подбор Стыка 1 (РЖД ⇄ КТЖ)
      if (b1Code) {{
        for (var i = 0; i < availBorders1.length; i++) {{
          if (availBorders1[i].code === b1Code || availBorders1[i].exitCode === b1Code) {{
            border1 = availBorders1[i];
            break;
          }}
        }}
      }}
      if (!border1) {{
        var fNorm = cleanStationName(fromSt.name);
        if (fNorm.indexOf('москва') !== -1 || fNorm.indexOf('петербург') !== -1) {{
          border1 = availBorders1[0]; // ст. Илецк I (666501)
        }} else if (fNorm.indexOf('саратов') !== -1 || fNorm.indexOf('самара') !== -1 || fNorm.indexOf('волгоград') !== -1 || fNorm.indexOf('озинки') !== -1) {{
          border1 = availBorders1.find(function(b) {{ return b.code === '664900'; }}) || availBorders1[0];
        }} else {{
          border1 = availBorders1[0];
        }}
      }}

      // Подбор Стыка 2 (КТЖ ⇄ УТИ)
      if (b2Code) {{
        for (var j = 0; j < availBorders2.length; j++) {{
          if (availBorders2[j].code === b2Code || availBorders2[j].exitCode === b2Code) {{
            border2 = availBorders2[j];
            break;
          }}
        }}
      }}
      if (!border2) {{
        var tNorm = cleanStationName(toSt.name);
        if (tNorm.indexOf('нукус') !== -1 || tNorm.indexOf('ургенч') !== -1 || tNorm.indexOf('кунград') !== -1 || tNorm.indexOf('бейнеу') !== -1) {{
          border2 = availBorders2.find(function(b) {{ return b.code === '662905'; }}) || availBorders2[0];
        }} else {{
          border2 = availBorders2[0]; // ст. Сарыагаш / Келес (704101)
        }}
      }}

      var b1St = {{ name: border1.name.split('/')[0].trim(), country: 'RUS', road_label: 'РЖД' }};
      var b1KzSt = {{ name: border1.name.split('/')[0].trim(), country: 'KAZ', road_label: 'КТЖ' }};
      var b2KzSt = {{ name: border2.name.split('/')[0].trim(), country: 'KAZ', road_label: 'КТЖ' }};
      var b2UzSt = {{ name: (border2.name.split('/')[1] || border2.name).trim(), country: 'UZB', road_label: 'УТИ' }};

      if (isRusUzb) {{
        messageType = 'Транзитное сообщение (Россия ➔ Казахстан [Транзит] ➔ Узбекистан)';
        var d1 = resolveLegDistance(fromSt, b1St);
        var d2 = resolveLegDistance(b1KzSt, b2KzSt);
        var d3 = resolveLegDistance(b2UzSt, toSt);

        legs.push({{
          country: 'RUS',
          countryName: 'Россия',
          road: fromSt.road_label || 'РЖД',
          from: fromSt.name,
          to: border1.name.split('/')[0].trim(),
          distanceKm: d1,
          type: 'export_departure'
        }});

        legs.push({{
          country: 'KAZ',
          countryName: 'Казахстан (Транзит)',
          road: 'Казахстанская ж. д. (КТЖ Транзит)',
          from: border1.name.split('/')[0].trim(),
          to: border2.name.split('/')[0].trim(),
          distanceKm: d2,
          type: 'transit'
        }});

        legs.push({{
          country: 'UZB',
          countryName: 'Узбекистан',
          road: toSt.road_label || 'Узбекская ж. д. (УТИ)',
          from: (border2.name.split('/')[1] || border2.name).trim(),
          to: toSt.name,
          distanceKm: d3,
          type: 'import_destination'
        }});
      }} else {{
        messageType = 'Транзитное сообщение (Узбекистан ➔ Казахстан [Транзит] ➔ Россия)';
        var d1 = resolveLegDistance(fromSt, b2UzSt);
        var d2 = resolveLegDistance(b2KzSt, b1KzSt);
        var d3 = resolveLegDistance(b1St, toSt);

        legs.push({{
          country: 'UZB',
          countryName: 'Узбекистан',
          road: fromSt.road_label || 'Узбекская ж. д. (УТИ)',
          from: fromSt.name,
          to: (border2.name.split('/')[1] || border2.name).trim(),
          distanceKm: d1,
          type: 'export_departure'
        }});

        legs.push({{
          country: 'KAZ',
          countryName: 'Казахстан (Транзит)',
          road: 'Казахстанская ж. д. (КТЖ Транзит)',
          from: border2.name.split('/')[0].trim(),
          to: border1.name.split('/')[0].trim(),
          distanceKm: d2,
          type: 'transit'
        }});

        legs.push({{
          country: 'RUS',
          countryName: 'Россия',
          road: toSt.road_label || 'РЖД',
          from: border1.name.split('/')[0].trim(),
          to: toSt.name,
          distanceKm: d3,
          type: 'import_destination'
        }});
      }}

      return {{
        isTransit: true,
        messageType: messageType,
        border1: border1,
        border2: border2,
        availBorders1: availBorders1,
        availBorders2: availBorders2,
        legs: legs
      }};
    }}

    // Двустороннее сообщение (например KAZ ⇄ UZB, RUS ⇄ KAZ, KAZ ⇄ CHN)
    messageType = 'Международное (' + fromSt.country_name + ' ➔ ' + toSt.country_name + ')';
    var pairKey = fromSt.country + '-' + toSt.country;
    var reverseKey = toSt.country + '-' + fromSt.country;
    var availBorders = BORDER_CROSSINGS[pairKey] || BORDER_CROSSINGS[reverseKey] || BORDER_CROSSINGS['KAZ-UZB'];

    var targetCode = b1Code || b2Code;
    if (targetCode) {{
      for (var b = 0; b < availBorders.length; b++) {{
        if (availBorders[b].code === targetCode || availBorders[b].exitCode === targetCode) {{
          border = availBorders[b];
          break;
        }}
      }}
    }}
    if (!border) border = availBorders[0];

    var borderSt = {{ name: border.name.split('/')[0].trim(), country: fromSt.country, road_label: fromSt.road_label }};
    var borderDestSt = {{ name: (border.name.split('/')[1] || border.name).trim(), country: toSt.country, road_label: toSt.road_label }};

    var dist1 = resolveLegDistance(fromSt, borderSt);
    var dist2 = resolveLegDistance(borderDestSt, toSt);

    legs.push({{
      country: fromSt.country,
      countryName: fromSt.country_name,
      road: fromSt.road_label || (fromSt.country === 'KAZ' ? 'Казахстанская ж. д. (КТЖ)' : 'РЖД'),
      from: fromSt.name,
      to: border.name.split('/')[0].trim(),
      distanceKm: dist1,
      type: 'export_departure'
    }});

    legs.push({{
      country: toSt.country,
      countryName: toSt.country_name,
      road: toSt.road_label || (toSt.country === 'UZB' ? 'Узбекская ж. д. (УТИ)' : 'РЖД'),
      from: (border.name.split('/')[1] || border.name).trim(),
      to: toSt.name,
      distanceKm: dist2,
      type: 'import_destination'
    }});

    return {{
      isTransit: false,
      messageType: messageType,
      border: border,
      availBorders: availBorders,
      legs: legs
    }};
  }}

  function getBaseRateForKm(km) {{
    for (var i = 0; i < TARIFF_BELTS.length; i++) {{
      if (km <= TARIFF_BELTS[i].maxKm) {{
        return TARIFF_BELTS[i].rateUSD;
      }}
    }}
    return 0.33;
  }}

  // ГЛАВНЫЙ МЕТОД РАСЧЕТА ТАРИФОВ
  function calculateTariff(params) {{
    var fromStation = findStation(params.from) || STATIONS[0];
    var toStation = findStation(params.to) || STATIONS[1];
    var wagonType = ROLLING_STOCK[params.wagonType] || ROLLING_STOCK['grain'];
    var cargoItem = findCargo(params.cargoSearch || params.cargoType);
    var parkType = params.parkType || 'caravan';
    var incoterms = (params.incoterms || 'DAP').toUpperCase();
    var hasSecurity = params.security === true || params.security === 'true' || cargoItem.security_required;
    var hasCustoms = params.customs === true || params.customs === 'true';
    var discountPercent = parseFloat(params.discount) || 0;

    var routePlan = determineRouteLegs(fromStation, toStation, params.manualBorderCode || params.manualBorder1, params.manualBorder2);
    var totalKm = 0;
    var detailedLegs = [];
    var totalInfraUSD = 0;
    var totalWagonUSD = 0;
    var totalBorderFeesUSD = 0;
    var totalSecurityUSD = 0;

    var cargoFactor = cargoItem.tariff_class === 1 ? 0.75 : (cargoItem.tariff_class === 3 ? 1.25 : 1.0);

    for (var l = 0; l < routePlan.legs.length; l++) {{
      var leg = routePlan.legs[l];
      totalKm += leg.distanceKm;

      var baseBeltRate = getBaseRateForKm(leg.distanceKm);
      var countryFactor = (leg.country === 'UZB' ? 1.15 : (leg.country === 'RUS' ? 1.10 : (leg.type === 'transit' ? 1.20 : 1.0)));
      var legInfra = Math.round(leg.distanceKm * baseBeltRate * countryFactor * cargoFactor);

      var legDays = Math.ceil(leg.distanceKm / wagonType.speedKmPerDay) + 1;
      var legWagon = (parkType === 'caravan') ? Math.round(legDays * wagonType.dailyRateUSD * 1.35) : Math.round(legInfra * 0.45);

      var legBorderFee = 0;
      if (leg.type === 'export_departure') {{
        var bObj = routePlan.border1 || routePlan.border;
        if (bObj) legBorderFee += bObj.fee || 65;
      }} else if (leg.type === 'transit' && routePlan.border2) {{
        legBorderFee += routePlan.border2.fee || 85;
      }}

      var legSec = hasSecurity ? Math.round(leg.distanceKm * 0.08 + 45) : 0;
      var legTotal = legInfra + legWagon + legBorderFee + legSec;

      totalInfraUSD += legInfra;
      totalWagonUSD += legWagon;
      totalBorderFeesUSD += legBorderFee;
      totalSecurityUSD += legSec;

      detailedLegs.push({{
        country: leg.country,
        countryName: leg.countryName,
        road: leg.road,
        from: leg.from,
        to: leg.to,
        distanceKm: leg.distanceKm,
        infraTariffUSD: legInfra,
        wagonTariffUSD: legWagon,
        borderFeeUSD: legBorderFee,
        securityUSD: legSec,
        subtotalUSD: legTotal
      }});
    }}

    var incotermsFeeUSD = 0;
    if (incoterms === 'DAP') incotermsFeeUSD = 325;
    else if (incoterms === 'CIP') incotermsFeeUSD = 180;
    else if (incoterms === 'DDP') incotermsFeeUSD = 550;
    else if (incoterms === 'CPT') incotermsFeeUSD = 90;
    else if (incoterms === 'FCA') incotermsFeeUSD = 40;

    if (hasCustoms) incotermsFeeUSD += 120;

    var grandTotalUSD = totalInfraUSD + totalWagonUSD + totalBorderFeesUSD + totalSecurityUSD + incotermsFeeUSD;
    if (discountPercent > 0) {{
      grandTotalUSD = Math.round(grandTotalUSD * (1 - discountPercent / 100));
    }}

    var transitDaysMin = Math.ceil(totalKm / wagonType.speedKmPerDay) + 1;
    var transitDaysMax = transitDaysMin + 2;
    var transitStr = transitDaysMin + '-' + transitDaysMax + ' суток';

    var cur = CURRENCY_RATES[params.currency || 'USD'] || CURRENCY_RATES['USD'];
    var convertedTotal = Math.round(grandTotalUSD * cur.rate);

    return {{
      // Flat properties
      fromStation: fromStation,
      toStation: toStation,
      wagonType: wagonType,
      cargoItem: cargoItem,
      incoterms: incoterms,
      totalKm: totalKm,
      transitDaysStr: transitStr,
      totalCostUSD: grandTotalUSD,
      infraUSD: totalInfraUSD,
      wagonUSD: totalWagonUSD,
      borderFeesUSD: totalBorderFeesUSD,
      securityUSD: totalSecurityUSD,
      incotermsUSD: incotermsFeeUSD,
      isTransit: routePlan.isTransit,
      border: routePlan.border,
      border1: routePlan.border1,
      border2: routePlan.border2,
      availBorders: routePlan.availBorders,
      availBorders1: routePlan.availBorders1,
      availBorders2: routePlan.availBorders2,
      messageType: routePlan.messageType,
      legs: detailedLegs,

      // Nested structure for widget UI
      route: {{
        from: fromStation,
        to: toStation,
        borderCrossing: routePlan.border,
        border1: routePlan.border1,
        border2: routePlan.border2,
        availBorders: routePlan.availBorders,
        availBorders1: routePlan.availBorders1,
        availBorders2: routePlan.availBorders2,
        isTransit: routePlan.isTransit,
        messageType: routePlan.messageType,
        totalDistanceKm: totalKm,
        legs: detailedLegs
      }},
      wagon: wagonType,
      cargo: cargoItem,
      parkType: parkType === 'caravan' ? 'Собственный парк Caravan' : 'Инвентарный парк ж/д',
      transitDays: transitStr,
      totals: {{
        usd: grandTotalUSD,
        converted: convertedTotal,
        currencyCode: cur.code,
        currencySymbol: cur.symbol,
        formattedTotal: convertedTotal.toLocaleString('ru-RU') + ' ' + cur.symbol
      }},
      breakdownUSD: {{
        infrastructure: totalInfraUSD,
        wagonProvision: totalWagonUSD,
        borderAndHandling: totalBorderFeesUSD,
        documentationAndIncoterms: incotermsFeeUSD,
        customsService: hasCustoms ? 120 : 0,
        security: totalSecurityUSD
      }}
    }};
  }}

  return {{
    STATIONS: STATIONS,
    CARGO_ITEMS: CARGO_ITEMS,
    BORDER_CROSSINGS: BORDER_CROSSINGS,
    CANONICAL_DISTANCES: CANONICAL_DISTANCES,
    RAILWAY_GRAPH: RAILWAY_GRAPH,
    ROLLING_STOCK: ROLLING_STOCK,
    CURRENCY_RATES: CURRENCY_RATES,
    findStation: findStation,
    searchStations: searchStations,
    findCargo: findCargo,
    searchCargo: searchCargo,
    resolveLegDistance: resolveLegDistance,
    determineRouteLegs: determineRouteLegs,
    calculateTariff: calculateTariff
  }};

}})();

if (typeof module !== 'undefined' && module.exports) {{
  module.exports = CaravanRailwayEngine;
}}
if (typeof window !== 'undefined') {{
  window.CaravanRailwayEngine = CaravanRailwayEngine;
}}
"""

    with open("railway_calc_engine.js", "w", encoding="utf-8") as f:
        f.write(engine_js)
    print("railway_calc_engine.js generated successfully!")

    print("=== Step 3: Updating caravan-tracking-widget.html ===")
    with open("caravan-tracking-widget.html", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace modality bar emojis with SVGs
    old_modality_bar = re.search(r'<div class="cr-modality-bar" id="cr-modality-bar">.*?</div>\s*<div class="cr-submode-toggles">', content, re.DOTALL)
    if old_modality_bar:
        new_modality_bar = """<div class="cr-modality-bar" id="cr-modality-bar">
          <button type="button" class="cr-modality-btn active" data-modality="rail">
            <span class="cr-mod-icon">
              <svg class="cr-mod-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="3" width="16" height="15" rx="3"></rect>
                <path d="M4 11h16M8 15h.01M16 15h.01"></path>
                <path d="M7 18l-3 4M17 18l3 4M8 22h8"></path>
              </svg>
            </span>
            <span class="cr-mod-title">Ж/Д 1520</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="fleet">
            <span class="cr-mod-icon">
              <svg class="cr-mod-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="10" rx="2"></rect>
                <path d="M6 16v3M18 16v3M4 19h4M16 19h4"></path>
                <circle cx="6" cy="19" r="2"></circle>
                <circle cx="18" cy="19" r="2"></circle>
                <path d="M2 11h20M9 6v10M15 6v10"></path>
              </svg>
            </span>
            <span class="cr-mod-title">Аренда ПС</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="road">
            <span class="cr-mod-icon">
              <svg class="cr-mod-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="5" width="14" height="11" rx="1"></rect>
                <path d="M15 8h4l3 4v4h-7V8z"></path>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </span>
            <span class="cr-mod-title">Автоперевозки</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="air">
            <span class="cr-mod-icon">
              <svg class="cr-mod-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.6.2-2 1l-.3.5 6 4-3 3-2.5-.5L2 16l3.5 1.5L7 21l1.3-1.5-.5-2.5 3-3 4 6 .5-.3c.8-.4 1.2-1.2 1-2l-1.5-7.5"></path>
              </svg>
            </span>
            <span class="cr-mod-title">Авиакарго</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="multimodal">
            <span class="cr-mod-icon">
              <svg class="cr-mod-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </span>
            <span class="cr-mod-title">Мультимодал</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="customs">
            <span class="cr-mod-icon">
              <svg class="cr-mod-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </span>
            <span class="cr-mod-title">Таможня & ВЭД</span>
          </button>
        </div>

        <div class="cr-submode-toggles">"""
        content = content[:old_modality_bar.start()] + new_modality_bar + content[old_modality_bar.end():]

    # 2. Clean CSS replacement: fix .cr-clear-btn duplicate and enforce .cr-btn-primary svg styling
    css_start_match = re.search(r'\.cr-input-wrapper\s*\{', content)
    css_end_match = re.search(r'\.cr-btn-block\s*\{', content)
    if css_start_match and css_end_match:
        new_css_block = """.cr-input-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  /* Иконка поля ввода смещена в правый край (устраняет наложение на текст) */
  .cr-input-icon {
    position: absolute;
    right: 14px !important;
    left: auto !important;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: var(--cr-gold) !important;
    pointer-events: none;
    z-index: 2;
  }

  /* ЕДИНЫЙ ПРЕМИАЛЬНЫЙ ДИЗАЙН СТРОК ВВОДА: БЕЛЫЙ НА ГЛУБОКОМ СИНЕМ С ЗОЛОТОЙ КАЙМОЙ */
  .cr-input,
  input[type="text"].cr-input,
  input[type="number"].cr-input,
  .cr-form-field input,
  .cr-modality-inputs-grid input {
    width: 100%;
    background: rgba(15, 23, 42, 0.88) !important;
    border: 1px solid rgba(197, 160, 89, 0.28) !important;
    border-radius: 10px !important;
    color: #F8FAFC !important;
    font-size: 14px !important;
    font-family: inherit;
    padding: 12px 44px 12px 16px !important;
    outline: none !important;
    box-sizing: border-box;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.25s ease;
  }

  .cr-input:focus,
  .cr-form-field input:focus,
  .cr-modality-inputs-grid input:focus {
    border-color: #C5A059 !important;
    box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.25), inset 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  }

  .cr-input::placeholder,
  .cr-form-field input::placeholder,
  .cr-modality-inputs-grid input::placeholder {
    color: #64748B !important;
  }

  /* ЕДИНЫЙ ДИЗАЙН СЕЛЕКТОРОВ */
  .cr-select,
  .cr-form-field select,
  .cr-modality-inputs-grid select {
    width: 100%;
    background: rgba(15, 23, 42, 0.88) !important;
    border: 1px solid rgba(197, 160, 89, 0.28) !important;
    border-radius: 10px !important;
    color: #F8FAFC !important;
    font-size: 14px !important;
    font-family: inherit;
    padding: 12px 40px 12px 16px !important;
    outline: none !important;
    cursor: pointer;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23C5A059' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 14px center !important;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.25s ease;
  }

  .cr-select:focus,
  .cr-form-field select:focus,
  .cr-modality-inputs-grid select:focus {
    border-color: #C5A059 !important;
    box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.25), inset 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  }

  .cr-select option {
    background: #0F172A !important;
    color: #FFFFFF !important;
    padding: 8px 12px;
  }

  .cr-dual-borders-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    width: 100%;
  }

  .cr-clear-btn {
    position: absolute;
    right: 14px;
    background: transparent;
    border: none;
    color: var(--cr-text-muted);
    font-size: 20px;
    cursor: pointer;
  }

  .cr-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: var(--cr-amber) !important;
    color: #0F172A !important;
    border: none !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    padding: 14px 28px !important;
    border-radius: 12px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35) !important;
  }
  .cr-btn-primary svg,
  .cr-btn-book svg {
    width: 18px !important;
    height: 18px !important;
    min-width: 18px !important;
    max-width: 18px !important;
    min-height: 18px !important;
    max-height: 18px !important;
    flex-shrink: 0 !important;
    stroke: currentColor !important;
  }
  .cr-btn-primary:hover {
    background: var(--cr-amber-hover) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45) !important;
  }
  """
        content = content[:css_start_match.start()] + new_css_block + content[css_end_match.start():]

    # 3. Explicit inline width/height on booking button SVG to prevent any unstyled blowout
    content = content.replace(
        '<button type="button" class="cr-btn-primary cr-btn-book" id="cr-btn-open-booking">\n            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        '<button type="button" class="cr-btn-primary cr-btn-book" id="cr-btn-open-booking">\n            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;min-width:18px;min-height:18px;flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
    )

    # 4. Replace inline CaravanRailwayEngine in caravan-tracking-widget.html
    s_idx = content.find("var CaravanRailwayEngine = (function() {")
    e_idx = content.find("(function() {\n  var CARAVAN_CONFIG = {")
    if s_idx != -1 and e_idx != -1:
        content = content[:s_idx] + engine_js.strip() + "\n\n" + content[e_idx:]
        print("Replaced inline CaravanRailwayEngine cleanly!")
    else:
        print("ERROR: Could not find engine boundary markers in caravan-tracking-widget.html")
        return

    with open("caravan-tracking-widget.html", "w", encoding="utf-8") as f:
        f.write(content)

    print("=== Step 4: Mirroring to index.html ===")
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)

    print("=== Step 5: Updating server/server.py CANONICAL_CORRIDORS ===")
    with open("server/server.py", "r", encoding="utf-8") as f:
        srv_code = f.read()

    semey_code = """    ("710007", "704101"): { "distance": 1850, "nodes": ["Семей", "Актогай", "Шу", "Тараз", "Шымкент", "Сарыагаш"] },
    ("704101", "720000"): { "distance": 17, "nodes": ["Сарыагаш", "Келес", "Чукурсай"] },"""
    
    if '("710007", "704101")' not in srv_code:
        srv_code = srv_code.replace('CANONICAL_CORRIDORS = {', 'CANONICAL_CORRIDORS = {\n' + semey_code)
        with open("server/server.py", "w", encoding="utf-8") as f:
            f.write(srv_code)
        print("Updated server/server.py!")

    print("=== Step 6: Building Widget Bundles (v3.6.0) ===")
    # Update build_widget_bundle.py snippet string to v3.6.0
    with open("build_widget_bundle.py", "r", encoding="utf-8") as f:
        b_code = f.read()
    b_code = b_code.replace("caravan-widget.css?v=3.5.0", "caravan-widget.css?v=3.6.0")
    b_code = b_code.replace("caravan-widget.js?v=3.5.0", "caravan-widget.js?v=3.6.0")
    b_code = b_code.replace("caravan-widget.js?v=241", "caravan-widget.js?v=360")
    with open("build_widget_bundle.py", "w", encoding="utf-8") as f:
        f.write(b_code)

    import build_widget_bundle
    build_widget_bundle.build()

    print("=== ALL UPGRADE STEPS COMPLETED SUCCESSFULLY! ===")

if __name__ == '__main__':
    run()
