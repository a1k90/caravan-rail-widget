#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Assemble and patch railway_calc_engine.js cleanly
"""

import json

# Load STATIONS from railway_stations.json
with open('railway_stations.json', 'r', encoding='utf-8') as f:
    stations_data = json.load(f)

# Load CARGO_ITEMS from railway_cargo_bundle.json
with open('railway_cargo_bundle.json', 'r', encoding='utf-8') as f:
    cargo_data = json.load(f)

print(f'Loaded {len(stations_data)} stations, {len(cargo_data)} cargo items')

stations_json = json.dumps(stations_data, ensure_ascii=False, indent=2)
cargo_json = json.dumps(cargo_data, ensure_ascii=False, indent=2)

engine_code = f"""/**
 * Caravan Railroad — Цифровое тарифное ядро "Caravan 1520"
 * Собственная разработка логистической компании Caravan Railroad.
 * Реализует поучастковую тарификацию по сети железных дорог колеи 1520 мм
 * (Казахстан КТЖ, Узбекистан УТИ, Россия РЖД, стыки с Китаем, Афганистаном, Туркменистаном),
 * транзитные коридоры (РЖД -> КТЖ -> УТИ), расчет нормативного километража, подбор погранпереходов, предоставление парка СПС и Incoterms 2020.
 */

var CaravanRailwayEngine = (function() {{

  // 1. БАЗА СТАНЦИЙ СЕТИ 1520 ММ
  var STATIONS = {stations_json};

  // 2. СПРАВОЧНИК НОМЕНКЛАТУРЫ ГРУЗОВ (ЕТСНГ / ГНГ)
  var CARGO_ITEMS = {cargo_json};

  // 3. МЕЖГОСУДАРСТВЕННЫЕ ПОГРАНИЧНЫЕ СТЫКИ
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

  // 4. КООРДИНАТНАЯ СЕТКА ХАБОВ И УЗЛОВ ДЛЯ РАСЧЕТА ДИСТАНЦИИ (ШИРОТА, ДОЛГОТА)
  var HUB_COORDS = {{
    'астана': [51.16, 71.43],
    'алматы': [43.23, 76.92],
    'караганда': [49.80, 73.08],
    'кокшетау': [53.28, 69.38],
    'шымкент': [42.32, 69.60],
    'актобе': [50.28, 57.16],
    'атырау': [47.11, 51.88],
    'актау': [43.65, 51.16],
    'павлодар': [52.28, 76.96],
    'костанай': [53.21, 63.63],
    'семей': [50.41, 80.25],
    'устькаменогорск': [49.95, 82.60],
    'тараз': [42.90, 71.37],
    'кызылорда': [44.84, 65.50],
    'достык': [45.25, 82.48],
    'алтынколь': [44.15, 80.35],
    'сарыагаш': [41.47, 69.17],
    'бейнеу': [45.32, 55.19],
    'илецк': [51.16, 54.98],
    'озинки': [51.20, 49.70],
    'локоть': [50.98, 81.33],
    'петропавловск': [54.87, 69.15],
    'курык': [43.18, 51.65],
    'луговая': [42.94, 72.76],
    'ташкент': [41.31, 69.24],
    'келес': [41.40, 69.20],
    'сергели': [41.22, 69.22],
    'чукурсай': [41.36, 69.23],
    'самарканд': [39.65, 66.97],
    'бухара': [39.77, 64.42],
    'навои': [40.08, 65.37],
    'карши': [38.86, 65.80],
    'термез': [37.22, 67.27],
    'галаба': [37.19, 67.43],
    'хайратан': [37.21, 67.41],
    'андижан': [40.78, 72.34],
    'фергана': [40.38, 71.78],
    'коканд': [40.53, 70.94],
    'ургенч': [41.55, 60.63],
    'нукус': [42.46, 59.61],
    'джизак': [40.11, 67.84],
    'ангрен': [41.01, 70.14],
    'ходжадавлет': [39.22, 63.60],
    'кудукли': [38.45, 68.10],
    'москва': [55.75, 37.61],
    'санктпетербург': [59.93, 30.33],
    'екатеринбург': [56.83, 60.60],
    'челябинск': [55.16, 61.43],
    'новосибирск': [55.03, 82.92],
    'самара': [53.20, 50.15],
    'омск': [54.98, 73.36],
    'барнаул': [53.35, 83.76],
    'уфа': [54.73, 55.95],
    'казань': [55.79, 49.12],
    'волгоград': [48.70, 44.51],
    'ростов': [47.23, 39.72],
    'краснодар': [45.03, 38.97],
    'новороссийск': [44.72, 37.76],
    'забайкальск': [49.65, 117.33],
    'карталы': [53.05, 60.65],
    'орск': [51.20, 58.56],
    'кулунда': [52.56, 78.94],
    'саратов': [51.54, 46.00],
    'оренбург': [51.77, 55.10],
    'курган': [55.44, 65.34],
    'магнитогорск': [53.41, 58.98]
  }};

  // 5. БАЗОВАЯ ТАБЛИЦА ТОЧНЫХ МЕЖСТАНЦИОННЫХ РАССТОЯНИЙ (КМ) ПО ТАРИФНОМУ РУКОВОДСТВУ
  var CANONICAL_DISTANCES = {{
    // КАЗАХСТАНСКИЕ ХАБЫ НА САРЫАГАШ
    "кокшетау_сарыагаш": 1918,
    "астана_сарыагаш": 1622,
    "караганда_сарыагаш": 1386,
    "павлодар_сарыагаш": 2045,
    "костанай_сарыагаш": 2135,
    "семей_сарыагаш": 1850,
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

    // ТРАНЗИТ КТЖ: ВХОД РЖД/КТЖ ➔ ВЫХОД КТЖ/УТИ (САРЫАГАШ)
    "илецк_сарыагаш": 2080,
    "озинки_сарыагаш": 2350,
    "карталы_сарыагаш": 1980,
    "орск_сарыагаш": 1850,
    "петропавловск_сарыагаш": 2140,
    "локоть_сарыагаш": 2180,
    "кулунда_сарыагаш": 2210,

    // ТРАНЗИТ КТЖ: ВХОД РЖД/КТЖ ➔ ВЫХОД КТЖ/УТИ (БЕЙНЕУ)
    "илецк_бейнеу": 1200,
    "озинки_бейнеу": 1350,
    "орск_бейнеу": 1050,
    "карталы_бейнеу": 1380,
    "петропавловск_бейнеу": 1950,
    "локоть_бейнеу": 2650,
    "кулунда_бейнеу": 2680,
    "бейнеу_каракалпакстан": 410,

    // РЖД: ОТПРАВЛЕНИЕ ➔ СТЫКИ РЖД/КТЖ
    "москва_илецк": 1480,
    "москва_озинки": 1320,
    "москва_карталы": 1890,
    "москва_петропавловск": 2280,
    "санктпетербург_илецк": 2150,
    "санктпетербург_озинки": 2050,
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

    // УТИ: ВХОД КЕЛЕС (САРЫАГАШ) ➔ СТАНЦИИ УЗБЕКИСТАНА
    "келес_ташкент": 35,
    "келес_сергели": 45,
    "келес_чукурсай": 28,
    "келес_самарканд": 350,
    "келес_бухара": 610,
    "келес_навои": 510,
    "келес_карши": 490,
    "келес_термез": 710,
    "келес_галаба": 755,
    "келес_андижан": 395,
    "келес_фергана": 410,
    "келес_коканд": 275,
    "келес_ургенч": 990,
    "келес_нукус": 1140,
    "келес_джизак": 235,
    "келес_ангрен": 150,
    "келес_ходжадавлет": 635,
    "келес_кудукли": 475,

    // УТИ: ВХОД КАРАКАЛПАКСТАН (БЕЙНЕУ) ➔ СТАНЦИИ УЗБЕКИСТАНА
    "каракалпакстан_нукус": 380,
    "каракалпакстан_ургенч": 420,
    "каракалпакстан_бухара": 780,
    "каракалпакстан_навои": 880,
    "каракалпакстан_ташкент": 1250,
    "каракалпакстан_самарканд": 990
  }};

  // 6. ПАРК ВАГОНОВ И ТАРИФЫ ПРЕДОСТАВЛЕНИЯ CARAVAN
  var ROLLING_STOCK = {{
    'grain': {{ name: 'Зерновоз / Хоппер (для зерна, 70 тн, 116 м³)', dailyRateUSD: 38, payloadTons: 70, volumeM3: 116, speedKmPerDay: 350, defaultCargo: '100199' }},
    'boxcar': {{ name: 'Крытый вагон (грузовой, 68 тн, 138 м³)', dailyRateUSD: 34, payloadTons: 68, volumeM3: 138, speedKmPerDay: 380, defaultCargo: '110100' }},
    'gondola': {{ name: 'Полувагон (универсальный 4-осный, 70 тн)', dailyRateUSD: 32, payloadTons: 70, volumeM3: 88, speedKmPerDay: 400, defaultCargo: '270112' }},
    'tank': {{ name: 'Цистерна (наливные грузы / ГСМ, 66 тн)', dailyRateUSD: 42, payloadTons: 66, volumeM3: 85, speedKmPerDay: 360, defaultCargo: '271012' }},
    'platform': {{ name: 'Фитинговая платформа (тяжеловесы/негабарит)', dailyRateUSD: 30, payloadTons: 72, volumeM3: 0, speedKmPerDay: 420, defaultCargo: '720810' }},
    'cont40': {{ name: 'Контейнер 40ft High Cube (HQ, 28 тн, 76 м³)', dailyRateUSD: 28, payloadTons: 28, volumeM3: 76, speedKmPerDay: 450, defaultCargo: '990100' }},
    'cont20': {{ name: 'Контейнер 20ft (универсальный, 24 тн, 33 м³)', dailyRateUSD: 20, payloadTons: 24, volumeM3: 33, speedKmPerDay: 450, defaultCargo: '990100' }}
  }};

  // 7. ТАРИФНЫЕ ПОЯСА ИНФРАСТРУКТУРЫ ($ / КМ)
  var TARIFF_BELTS = [
    {{ maxKm: 200,  rateUSD: 0.78 }},
    {{ maxKm: 500,  rateUSD: 0.65 }},
    {{ maxKm: 1000, rateUSD: 0.54 }},
    {{ maxKm: 2000, rateUSD: 0.44 }},
    {{ maxKm: 3000, rateUSD: 0.38 }},
    {{ maxKm: 9999, rateUSD: 0.33 }}
  ];

  // 8. КУРСЫ ВАЛЮТ
  var CURRENCY_RATES = {{
    'USD': {{ code: 'USD', symbol: '$', rate: 1.0, title: 'Доллар США' }},
    'KZT': {{ code: 'KZT', symbol: '₸', rate: 485.0, title: 'Казахстанский тенге' }},
    'UZS': {{ code: 'UZS', symbol: 'сум', rate: 12750.0, title: 'Узбекский сум' }},
    'RUB': {{ code: 'RUB', symbol: '₽', rate: 92.5, title: 'Российский рубль' }}
  }};

  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ПОИСКА
  function cleanStationName(raw) {{
    if (!raw) return '';
    var s = ('' + raw)
      .replace(/ст\.\s*/gi, '')
      .replace(/\\(.* switch .*?\\)/gi, '')
      .replace(/\\(.*?\\)/g, '')
      .replace(/\\[.*?\\]/g, '')
      .trim();
    var word = s.split(/[\\s\\-]/)[0];
    return word.replace(/[^\\u0400-\\u04FFa-zA-Z]/g, '').toLowerCase();
  }}

  function findStation(query) {{
    if (!query) return null;
    query = ('' + query).trim();

    var codeMatch = query.match(/\\b\\d{{6}}\\b/);
    if (codeMatch) {{
      var extractedCode = codeMatch[0];
      for (var i = 0; i < STATIONS.length; i++) {{
        if (STATIONS[i].code === extractedCode) return STATIONS[i];
      }}
    }}

    var clean = query.replace(/\\(.*?\\)/g, '').replace(/ст\.\\s*/gi, '').trim().toLowerCase();
    if (!clean) return null;

    for (var i = 0; i < STATIONS.length; i++) {{
      if (STATIONS[i].name.toLowerCase().indexOf(clean) !== -1 ||
          clean.indexOf(STATIONS[i].name.toLowerCase()) !== -1) {{
        return STATIONS[i];
      }}
    }}

    var cName = cleanStationName(query);
    if (cName) {{
      for (var i = 0; i < STATIONS.length; i++) {{
        var stClean = cleanStationName(STATIONS[i].name);
        if (stClean && (stClean === cName || stClean.indexOf(cName) !== -1 || cName.indexOf(stClean) !== -1)) {{
          return STATIONS[i];
        }}
      }}
    }}

    return null;
  }}

  function searchStations(query, limit) {{
    limit = limit || 10;
    if (!query || query.trim().length < 2) return [];
    var q = query.trim().toLowerCase();
    var results = [];

    for (var i = 0; i < STATIONS.length; i++) {{
      var st = STATIONS[i];
      if (st.code.indexOf(q) === 0 || st.name.toLowerCase().indexOf(q) !== -1) {{
        results.push(st);
        if (results.length >= limit) break;
      }}
    }}
    return results;
  }}

  function findCargo(query) {{
    if (!query) return CARGO_ITEMS[0];
    var q = ('' + query).trim().toLowerCase();

    var codeMatch = q.match(/\\b\\d{{6}}\\b/);
    if (codeMatch) {{
      var code = codeMatch[0];
      for (var i = 0; i < CARGO_ITEMS.length; i++) {{
        if (CARGO_ITEMS[i].code_etsng === code) return CARGO_ITEMS[i];
      }}
    }}

    for (var i = 0; i < CARGO_ITEMS.length; i++) {{
      if (CARGO_ITEMS[i].name.toLowerCase().indexOf(q) !== -1 ||
          q.indexOf(CARGO_ITEMS[i].name.toLowerCase()) !== -1) {{
        return CARGO_ITEMS[i];
      }}
    }}

    var wagonMap = {{
      'grain': '100199',
      'boxcar': '110100',
      'gondola': '270112',
      'tank': '271012',
      'platform': '720810',
      'cont40': '990100',
      'cont20': '990100'
    }};
    if (wagonMap[q]) {{
      var defCode = wagonMap[q];
      for (var i = 0; i < CARGO_ITEMS.length; i++) {{
        if (CARGO_ITEMS[i].code_etsng === defCode) return CARGO_ITEMS[i];
      }}
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
          item.name.toLowerCase().indexOf(q) !== -1 ||
          item.category.toLowerCase().indexOf(q) !== -1) {{
        results.push(item);
        if (results.length >= limit) break;
      }}
    }}
    return results;
  }}

  function getStationCoords(st) {{
    if (!st || !st.name) return [48.0, 68.0];
    var norm = cleanStationName(st.name);
    for (var k in HUB_COORDS) {{
      if (norm.indexOf(k) !== -1) return HUB_COORDS[k];
    }}
    if (st.country === 'RUS') return [55.75, 37.61];
    if (st.country === 'UZB') return [41.31, 69.24];
    return [48.0, 68.0];
  }}

  function calculateGeoRailwayDistance(c1, c2) {{
    var R = 6371;
    var dLat = (c2[0] - c1[0]) * Math.PI / 180;
    var dLon = (c2[1] - c1[1]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(35, Math.round(R * c * 1.46));
  }}

  function resolveLegDistance(fromSt, toSt) {{
    var fClean = cleanStationName(fromSt.name);
    var tClean = cleanStationName(toSt.name);

    var k1 = fClean + '_' + tClean;
    var k2 = tClean + '_' + fClean;
    if (CANONICAL_DISTANCES[k1]) return CANONICAL_DISTANCES[k1];
    if (CANONICAL_DISTANCES[k2]) return CANONICAL_DISTANCES[k2];

    var c1 = getStationCoords(fromSt);
    var c2 = getStationCoords(toSt);
    return calculateGeoRailwayDistance(c1, c2);
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
        if (fNorm.indexOf('новосибирск') !== -1 || fNorm.indexOf('барнаул') !== -1 || fNorm.indexOf('красноярск') !== -1 || fNorm.indexOf('локоть') !== -1) {{
          border1 = availBorders1.find(function(b) {{ return b.code === '711105'; }}) || availBorders1[0];
        }} else if (fNorm.indexOf('екатеринбург') !== -1 || fNorm.indexOf('челябинск') !== -1 || fNorm.indexOf('магнитогорск') !== -1 || fNorm.indexOf('карталы') !== -1) {{
          border1 = availBorders1.find(function(b) {{ return b.code === '816909'; }}) || availBorders1[0];
        }} else if (fNorm.indexOf('омск') !== -1 || fNorm.indexOf('курган') !== -1 || fNorm.indexOf('петропавловск') !== -1) {{
          border1 = availBorders1.find(function(b) {{ return b.code === '688708'; }}) || availBorders1[0];
        }} else if (fNorm.indexOf('саратов') !== -1 || fNorm.indexOf('самара') !== -1 || fNorm.indexOf('волгоград') !== -1 || fNorm.indexOf('озинки') !== -1) {{
          border1 = availBorders1.find(function(b) {{ return b.code === '664900'; }}) || availBorders1[0];
        }} else {{
          border1 = availBorders1[0]; // ст. Илецк I (666501)
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

      var b1St = {{ name: border1.name.split('/')[0].trim(), country: 'RUS' }};
      var b1KzSt = {{ name: border1.name.split('/')[0].trim(), country: 'KAZ' }};
      var b2KzSt = {{ name: border2.name.split('/')[0].trim(), country: 'KAZ' }};
      var b2UzSt = {{ name: (border2.name.split('/')[1] || border2.name).trim(), country: 'UZB' }};

      if (isRusUzb) {{
        messageType = 'Транзитное сообщение (Россия ➔ Казахстан [Транзит] ➔ Узбекистан)';
        var d1 = resolveLegDistance(fromSt, b1St);
        var d2 = resolveLegDistance(b1KzSt, b2KzSt);
        var d3 = resolveLegDistance(b2UzSt, toSt);

        legs.push({{
          country: 'RUS',
          countryName: 'Россия',
          road: 'РЖД',
          from: fromSt.name,
          to: border1.name.split('/')[0].trim(),
          distanceKm: d1,
          type: 'export_departure'
        }});

        legs.push({{
          country: 'KAZ',
          countryName: 'Казахстан (Транзит)',
          road: 'КТЖ (Транзит)',
          from: border1.name.split('/')[0].trim(),
          to: border2.name.split('/')[0].trim(),
          distanceKm: d2,
          type: 'transit'
        }});

        legs.push({{
          country: 'UZB',
          countryName: 'Узбекистан',
          road: 'УТИ',
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
          road: 'УТИ',
          from: fromSt.name,
          to: (border2.name.split('/')[1] || border2.name).trim(),
          distanceKm: d1,
          type: 'export_departure'
        }});

        legs.push({{
          country: 'KAZ',
          countryName: 'Казахстан (Транзит)',
          road: 'КТЖ (Транзит)',
          from: border2.name.split('/')[0].trim(),
          to: border1.name.split('/')[0].trim(),
          distanceKm: d2,
          type: 'transit'
        }});

        legs.push({{
          country: 'RUS',
          countryName: 'Россия',
          road: 'РЖД',
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

    // Двустороннее сообщение (например KAZ ⇄ UZB, RUS ⇄ KAZ)
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

    var borderSt = {{ name: border.name.split('/')[0].trim(), country: fromSt.country }};
    var borderDestSt = {{ name: (border.name.split('/')[1] || border.name).trim(), country: toSt.country }};

    var dist1 = resolveLegDistance(fromSt, borderSt);
    var dist2 = resolveLegDistance(borderDestSt, toSt);

    legs.push({{
      country: fromSt.country,
      countryName: fromSt.country_name,
      road: fromSt.road_label,
      from: fromSt.name,
      to: border.name.split('/')[0].trim(),
      distanceKm: dist1,
      type: 'export_departure'
    }});

    legs.push({{
      country: toSt.country,
      countryName: toSt.country_name,
      road: toSt.road_label,
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
    var fromStation = findStation(params.from) || STATIONS[11]; // Кокшетау
    var toStation = findStation(params.to) || STATIONS[14];     // Ташкент-Товарный
    var wagonType = ROLLING_STOCK[params.wagonType] || ROLLING_STOCK['grain'];
    var cargoItem = findCargo(params.cargoSearch || params.cargoType);
    var parkType = params.parkType || 'caravan';
    var incoterms = (params.incoterms || 'DAP').toUpperCase();
    var hasSecurity = params.security === true || params.security === 'true' || cargoItem.security_required;
    var hasCustoms = params.customs === true || params.customs === 'true';
    var clientRole = params.clientRole || 'Грузоотправитель';
    var discountPercent = parseFloat(params.discount) || 0;
    var currency = params.currency || 'USD';

    // 1. Построение маршрута и расстояний
    var routePlan = determineRouteLegs(fromStation, toStation, params.manualBorderCode || params.manualBorder1, params.manualBorder2);
    var totalKm = 0;
    var detailedLegs = [];
    var totalInfraUSD = 0;
    var totalWagonUSD = 0;
    var totalBorderFeesUSD = 0;
    var totalSecurityUSD = 0;

    // Класс груза и тарифный коэффициент
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

    // Incoterms надбавки
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

    var curInfo = CURRENCY_RATES[currency] || CURRENCY_RATES['USD'];
    var convertedTotal = Math.round(grandTotalUSD * curInfo.rate);

    return {{
      route: {{
        from: fromStation,
        to: toStation,
        isTransit: routePlan.isTransit,
        borderCrossing: routePlan.border,
        border1: routePlan.border1,
        border2: routePlan.border2,
        availBorders: routePlan.availBorders,
        availBorders1: routePlan.availBorders1,
        availBorders2: routePlan.availBorders2,
        messageType: routePlan.messageType,
        totalDistanceKm: totalKm,
        legs: detailedLegs
      }},
      wagon: wagonType,
      cargo: cargoItem,
      parkType: parkType === 'caravan' ? 'Собственный СПС Caravan Railroad' : 'Инвентарный парк ж/д',
      incoterms: incoterms,
      transitDays: transitStr,
      totals: {{
        usd: grandTotalUSD,
        converted: convertedTotal,
        currencyCode: curInfo.code,
        currencySymbol: curInfo.symbol,
        formattedTotal: convertedTotal.toLocaleString('ru-RU') + ' ' + curInfo.symbol
      }},
      breakdownUSD: {{
        infrastructure: totalInfraUSD,
        wagonProvision: totalWagonUSD,
        borderAndHandling: totalBorderFeesUSD + incotermsFeeUSD,
        security: totalSecurityUSD
      }}
    }};
  }}

  return {{
    STATIONS: STATIONS,
    CARGO_ITEMS: CARGO_ITEMS,
    BORDER_CROSSINGS: BORDER_CROSSINGS,
    ROLLING_STOCK: ROLLING_STOCK,
    CURRENCY_RATES: CURRENCY_RATES,
    cleanStationName: cleanStationName,
    findStation: findStation,
    searchStations: searchStations,
    findCargo: findCargo,
    searchCargo: searchCargo,
    determineRouteLegs: determineRouteLegs,
    calculateTariff: calculateTariff
  }};

}})();

if (typeof window !== 'undefined') {{
  window.CaravanRailwayEngine = CaravanRailwayEngine;
}}
if (typeof module !== 'undefined' && module.exports) {{
  module.exports = CaravanRailwayEngine;
}}
"""

with open('railway_calc_engine.js', 'w', encoding='utf-8') as f:
    f.write(engine_code)

print('Successfully written clean railway_calc_engine.js!')
