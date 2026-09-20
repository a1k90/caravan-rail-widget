import json, re

# 1. Load stations and cargo bundle
with open('railway_stations.json', 'r', encoding='utf-8') as f:
    stations = json.load(f)

with open('railway_cargo_bundle.json', 'r', encoding='utf-8') as f:
    cargo_items = json.load(f)

print(f"Loaded {len(stations)} stations and {len(cargo_items)} cargo items")

# 2. Canonical distances from official KTZ & CIS tariff guides (Tariff Manual #4 / R-Tariff standards)
canonical_distances = {
    # КТЖ ➔ Сарыагаш (эксп.) [Южный стык с Узбекистаном]
    'кокшетау_сарыагаш': 1918,
    'астана_сарыагаш': 1622,
    'караганда_сарыагаш': 1386,
    'павлодар_сарыагаш': 2045,
    'костанай_сарыагаш': 2135,
    'семей_сарыагаш': 1850,
    'устькаменогорск_сарыагаш': 2020,
    'актобе_сарыагаш': 1960,
    'атырау_сарыагаш': 2350,
    'мангышлак_сарыагаш': 2720,
    'алматы_сарыагаш': 814,
    'шымкент_сарыагаш': 132,
    'тараз_сарыагаш': 310,
    'кызылорда_сарыагаш': 650,
    'достык_сарыагаш': 1980,
    'алтынколь_сарыагаш': 1620,
    'илецк_сарыагаш': 2080,
    'озинки_сарыагаш': 2350,
    'петропавловск_сарыагаш': 2140,
    'локоть_сарыагаш': 2180,
    'бейнеу_каракалпакстан': 410,

    # РЖД ➔ Погранстыки
    'москва_илецк': 1480,
    'москва_озинки': 1320,
    'санктпетербург_илецк': 2150,
    'екатеринбург_петропавловск': 680,
    'челябинск_петропавловск': 560,
    'новосибирск_локоть': 560,
    'самара_озинки': 450,

    # УТИ ➔ Келес / Ташкент / Внутренние
    'келес_ташкент': 35,
    'келес_сергели': 45,
    'келес_чукурсай': 28,
    'келес_самарканд': 350,
    'келес_бухара': 610,
    'келес_навои': 510,
    'келес_карши': 490,
    'келес_термез': 710,
    'келес_галаба': 755,
    'келес_андижан': 395,
    'келес_фергана': 410,
    'келес_коканд': 275,
    'келес_ургенч': 990,
    'келес_нукус': 1140,
    'келес_джизак': 235,
    'келес_ангрен': 150,
    'келес_ходжадавлет': 635,
    'келес_кудукли': 475
}

# 3. Generate updated railway_calc_engine.js
engine_code = f"""/**
 * Caravan Railroad - Цифровое тарифное ядро "Caravan 1520"
 * Собственная разработка логистической компании Caravan Railroad.
 * Реализует поучастковую тарификацию по сети железных дорог колеи 1520 мм
 * (Казахстан КТЖ, Узбекистан УТИ, Россия РЖД, стыки с Китаем, Афганистаном, Туркменистаном),
 * расчет нормативного километража, подбор погранпереходов, предоставление парка СПС и Incoterms 2020.
 */

var CaravanRailwayEngine = (function() {{

  // 1. БАЗА СТАНЦИЙ СЕТИ 1520 ММ
  var STATIONS = {json.dumps(stations, ensure_ascii=False, indent=2)};

  // 2. БАЗА НОМЕНКЛАТУРЫ ГРУЗОВ (ЕТСНГ И ГНГ)
  var CARGO_ITEMS = {json.dumps(cargo_items, ensure_ascii=False, indent=2)};

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
      {{ code: '711105', name: 'ст. Локоть (эксп.) [З-Сиб / КТЖ]', exitCode: '711105', enterCode: '711105', fee: 65, days: 1 }},
      {{ code: '688708', name: 'ст. Петропавловск (эксп.) [Ю-Ур / КТЖ]', exitCode: '688708', enterCode: '688708', fee: 65, days: 1 }}
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
    'забайкальск': [49.65, 117.33]
  }};

  // 5. БАЗОВАЯ ТАБЛИЦА ТОЧНЫХ МЕЖСТАНЦИОННЫХ РАССТОЯНИЙ (КМ) ПО ТАРИФНОМУ РУКОВОДСТВУ
  var CANONICAL_DISTANCES = {json.dumps(canonical_distances, ensure_ascii=False, indent=2)};

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
      .replace(/ст\\.\\s*/gi, '')
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

    // 1. Поиск по 6-значному коду станции (например 687008, 720000)
    var codeMatch = query.match(/\\b\\d{{6}}\\b/);
    if (codeMatch) {{
      var extractedCode = codeMatch[0];
      for (var i = 0; i < STATIONS.length; i++) {{
        if (STATIONS[i].code === extractedCode) return STATIONS[i];
      }}
    }}

    // 2. Поиск по чистому наименованию
    var clean = query.replace(/\\(.*?\\)/g, '').replace(/ст\\.\\s*/gi, '').trim().toLowerCase();
    if (!clean) return null;

    for (var i = 0; i < STATIONS.length; i++) {{
      if (STATIONS[i].name.toLowerCase() === clean) return STATIONS[i];
    }}

    for (var i = 0; i < STATIONS.length; i++) {{
      var sName = STATIONS[i].name.toLowerCase();
      if (clean.indexOf(sName) !== -1 || sName.indexOf(clean) !== -1) {{
        return STATIONS[i];
      }}
    }}

    // Поиск по первому значимому слову (напр. "Кокшетау", "Москва", "Ташкент")
    var firstWord = clean.split(/[\\s\\-]/)[0];
    if (firstWord.length >= 3) {{
      for (var i = 0; i < STATIONS.length; i++) {{
        if (STATIONS[i].name.toLowerCase().indexOf(firstWord) !== -1) {{
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
      var s = STATIONS[i];
      if (s.code.indexOf(q) === 0 || s.name.toLowerCase().indexOf(q) !== -1) {{
        results.push(s);
        if (results.length >= limit) break;
      }}
    }}
    return results;
  }}

  function findCargo(query) {{
    if (!query) return CARGO_ITEMS[0];
    query = ('' + query).trim().toLowerCase();

    // 1. По коду ЕТСНГ или ГНГ
    var codeMatch = query.match(/\\b\\d{{6,8}}\\b/);
    if (codeMatch) {{
      var c = codeMatch[0];
      for (var i = 0; i < CARGO_ITEMS.length; i++) {{
        if (CARGO_ITEMS[i].code_etsng === c || CARGO_ITEMS[i].code_gng === c) {{
          return CARGO_ITEMS[i];
        }}
      }}
    }}

    // 2. По наименованию
    var clean = query.replace(/\\(.*?\\)/g, '').trim().toLowerCase();
    for (var i = 0; i < CARGO_ITEMS.length; i++) {{
      if (CARGO_ITEMS[i].name.toLowerCase().indexOf(clean) !== -1) {{
        return CARGO_ITEMS[i];
      }}
    }}

    // Первое совпадение по части слова
    var firstWord = clean.split(/[\\s\\-]/)[0];
    if (firstWord.length >= 3) {{
      for (var i = 0; i < CARGO_ITEMS.length; i++) {{
        if (CARGO_ITEMS[i].name.toLowerCase().indexOf(firstWord) !== -1) {{
          return CARGO_ITEMS[i];
        }}
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
    // Коэффициент извилистости и обходов ж/д путей в степных и горных зонах (1.46 по Тарифному руководству)
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

  function determineRouteLegs(fromSt, toSt, manualBorderCode) {{
    var legs = [];
    var border = null;
    var messageType = 'Внутригосударственное сообщение';

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
    }} else {{
      messageType = 'Международное (' + fromSt.country_name + ' ➔ ' + toSt.country_name + ')';
      var pairKey = fromSt.country + '-' + toSt.country;
      var reverseKey = toSt.country + '-' + fromSt.country;
      var availBorders = BORDER_CROSSINGS[pairKey] || BORDER_CROSSINGS[reverseKey] || BORDER_CROSSINGS['KAZ-UZB'];

      if (manualBorderCode) {{
        for (var b = 0; b < availBorders.length; b++) {{
          if (availBorders[b].code === manualBorderCode || availBorders[b].exitCode === manualBorderCode) {{
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
    }}

    return {{
      messageType: messageType,
      border: border,
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
    var routePlan = determineRouteLegs(fromStation, toStation, params.manualBorderCode);
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
      var countryFactor = (leg.country === 'UZB' ? 1.15 : (leg.country === 'RUS' ? 1.10 : 1.0));
      var legInfra = Math.round(leg.distanceKm * baseBeltRate * countryFactor * cargoFactor);

      var legDays = Math.ceil(leg.distanceKm / wagonType.speedKmPerDay) + 1;
      var legWagon = (parkType === 'caravan') ? Math.round(legDays * wagonType.dailyRateUSD * 1.35) : Math.round(legInfra * 0.45);

      var legBorderFee = 0;
      if (leg.type === 'export_departure' && routePlan.border) {{
        legBorderFee += routePlan.border.fee || 85;
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

    // Нормативный срок доставки (сутки)
    var transitMinDays = Math.ceil(totalKm / 380) + 1;
    var transitMaxDays = transitMinDays + 2;
    var transitStr = transitMinDays + '-' + transitMaxDays + ' суток';

    var curInfo = CURRENCY_RATES[currency] || CURRENCY_RATES['USD'];
    var convertedTotal = Math.round(grandTotalUSD * curInfo.rate);

    return {{
      route: {{
        from: fromStation,
        to: toStation,
        borderCrossing: routePlan.border,
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

if (typeof module !== 'undefined' && module.exports) {{
  module.exports = CaravanRailwayEngine;
}}
"""

with open('railway_calc_engine.js', 'w', encoding='utf-8') as f:
    f.write(engine_code)
print("Updated railway_calc_engine.js with canonical tariff distances!")

# 4. Update setupCargoAutocomplete implementation in index.html and caravan-tracking-widget.html
# to display clean single-line tabular rows like R-Tariff
new_setup_cargo_func = """  function setupCargoAutocomplete(inputId, dropdownId) {
    var input = document.getElementById(inputId);
    var dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    input.addEventListener('input', function() {
      var val = this.value.trim();
      if (val.length < 2) {
        dropdown.style.display = 'none';
        return;
      }
      var matches = CaravanRailwayEngine.searchCargo(val, 12);
      if (!matches || matches.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      var html = '<div class="cr-cargo-table-header">' +
        '<span class="cr-col-etsng">ЕТСНГ</span>' +
        '<span class="cr-col-gng">ГНГ</span>' +
        '<span class="cr-col-name">Наименование груза</span>' +
        '<span class="cr-col-class">Класс</span>' +
        '<span class="cr-col-cat">Категория</span>' +
      '</div>';

      matches.forEach(function(c) {
        html += '<div class="cr-cargo-item-row" data-etsng="' + c.code_etsng + '" data-gng="' + c.code_gng + '" data-name="' + escapeHtml(c.name) + '" data-class="' + c.tariff_class + '" data-wagon="' + (c.default_wagon || 'grain') + '">' +
          '<span class="cr-col-etsng">' + c.code_etsng + '</span>' +
          '<span class="cr-col-gng">' + c.code_gng + '</span>' +
          '<span class="cr-col-name">' + escapeHtml(c.name) + '</span>' +
          '<span class="cr-col-class"><span class="cr-cargo-class">' + c.tariff_class + ' кл.</span></span>' +
          '<span class="cr-col-cat">' + escapeHtml(c.category) + '</span>' +
        '</div>';
      });

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      var items = dropdown.querySelectorAll('.cr-cargo-item-row');
      items.forEach(function(item) {
        item.addEventListener('click', function() {
          var cName = this.getAttribute('data-name');
          var cEtsng = this.getAttribute('data-etsng');
          var cGng = this.getAttribute('data-gng');
          var cWagon = this.getAttribute('data-wagon');

          input.value = cName + ' (ЕТСНГ: ' + cEtsng + ', ГНГ: ' + cGng + ')';
          dropdown.style.display = 'none';

          var transportSel = document.getElementById('cr-calc-transport');
          if (transportSel && cWagon) {
            transportSel.value = cWagon;
          }

          triggerCustomCalculation();
        });
      });
    });

    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }"""

# 5. CSS for Single-Line Tabular Cargo Dropdown like R-Tariff
cargo_table_css = """
  /* ТАБЛИЧНОЕ ОТОБРАЖЕНИЕ ГРУЗОВ В СТИЛЕ СТАНДАРТОВ 1520 ММ */
  .cr-cargo-table-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    background: rgba(15, 23, 42, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #94A3B8;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .cr-cargo-item-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: background 0.15s;
    font-size: 13px;
    white-space: nowrap;
  }
  .cr-cargo-item-row:hover {
    background: rgba(245, 158, 11, 0.18);
  }
  .cr-col-etsng {
    width: 65px;
    flex-shrink: 0;
    font-family: monospace;
    font-size: 12px;
    font-weight: 700;
    color: #F59E0B;
  }
  .cr-col-gng {
    width: 80px;
    flex-shrink: 0;
    font-family: monospace;
    font-size: 12px;
    color: #CBD5E1;
  }
  .cr-col-name {
    flex-grow: 1;
    color: #FFFFFF;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cr-col-class {
    width: 55px;
    flex-shrink: 0;
    text-align: center;
  }
  .cr-col-cat {
    width: 140px;
    flex-shrink: 0;
    font-size: 11px;
    color: #64748B;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cr-cargo-class {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(245, 158, 11, 0.15);
    color: #F59E0B;
    font-size: 10px;
    font-weight: 700;
  }
  #cr-calc-cargo-dropdown {
    max-height: 280px;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 560px;
  }
"""

def update_file(filepath):
    print(f"Updating {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace CaravanRailwayEngine block with updated engine
    start_marker = 'var CaravanRailwayEngine = (function()'
    end_marker = 'module.exports = CaravanRailwayEngine;\n}'
    s_idx = content.find(start_marker)
    e_idx = content.find(end_marker, s_idx)
    if s_idx != -1 and e_idx != -1:
        e_idx += len(end_marker)
        content = content[:s_idx] + engine_code.strip() + content[e_idx:]
        print(f"  Injected updated engine into {filepath}")

    # 2. Update setupCargoAutocomplete function
    fn_start = content.find('function setupCargoAutocomplete(')
    if fn_start != -1:
        fn_end = content.find('function setupStationAutocomplete(', fn_start)
        if fn_end != -1:
            content = content[:fn_start] + new_setup_cargo_func + '\n\n  ' + content[fn_end:]
            print(f"  Updated setupCargoAutocomplete function in {filepath}")

    # 3. Add CSS for tabular cargo dropdown
    if '.cr-cargo-table-header' not in content:
        content = content.replace('/* КАЛЬКУЛЯТОР ТАРИФОВ */', '/* КАЛЬКУЛЯТОР ТАРИФОВ */' + cargo_table_css)
        print(f"  Added tabular cargo CSS in {filepath}")

    # 4. If index.html, remove lines 7-9 (<link>) and use @import inside <style>
    if 'index.html' in filepath:
        link_pattern = re.compile(r'<link rel="preconnect".*?<link href=.*?>', re.DOTALL)
        if link_pattern.search(content):
            content = link_pattern.sub('', content)
            print("  Removed <link> tags from head in index.html")
        if '@import url(\'https://fonts.googleapis.com' not in content:
            content = content.replace('<style>', '<style>\n    @import url(\'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Unbounded:wght@600;700;800&display=swap\');\n')
            print("  Added @import inside <style> in index.html")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {filepath}")

update_file('caravan-tracking-widget.html')
update_file('index.html')
