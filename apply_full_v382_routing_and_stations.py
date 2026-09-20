#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
apply_full_v382_routing_and_stations.py
Comprehensive upgrade of Caravan 1520 Railway Routing Engine:
1. Fixes station ownership in database (Georgia, Armenia, Azerbaijan, Russia, Kazakhstan).
2. Fixes border 1 dropdown selector in transit routes (Moscow ➔ Chukursay).
3. Adds Caucasus corridor (baku_tbilisi_batumi) to CORRIDOR_STATION_CHAINS.
4. Updates buildRouteItinerary with per-leg corridor stitching through intermediate border junctions.
5. Updates cleanStationName & findStation with complete CIS administration & keyword detection.
6. Synchronizes railway_stations.json, railway_calc_engine.js, caravan-tracking-widget.html, index.html, and caravan-widget.js.
7. Bumps cache-busting queries to ?v=382 / ?v=3.8.2.
"""

import sys, os, re, json, subprocess

def fix_stations_data():
    with open('railway_stations.json', 'r', encoding='utf-8') as f:
        stations = json.load(f)

    for s in stations:
        code = s.get('code', '')
        name = s.get('name', '').lower()
        p2 = code[:2]

        # 1. Armenia (must precede 56/57 check)
        if code in ['566002', '565103', '566708'] or p2 in ['58', '59'] or 'ахурян' in name or 'ереван' in name or 'гюмри' in name:
            s['country'] = 'ARM'
            s['country_name'] = 'Армения'
            s['admin'] = 'ЮКЖД'
            s['road'] = '58'
            s['road_label'] = 'Южно-Кавказская ж. д. (ЮКЖД)'
        # 2. Georgia (strictly remaining 56 and 57)
        elif p2 in ['56', '57']:
            s['country'] = 'GEO'
            s['country_name'] = 'Грузия'
            s['admin'] = 'ГРЗ'
            s['road'] = '57'
            s['road_label'] = 'Грузинская ж. д. (ГРЗ)'
        # 3. Ferry stations
        elif code == '528208':
            s['country'] = 'RUS'
            s['country_name'] = 'Россия'
            s['admin'] = 'РЖД'
            s['road'] = '52'
            s['road_label'] = 'Северо-Кавказская ж. д. (РЖД)'
        elif code in ['402207', '404005']:
            s['country'] = 'UKR'
            s['country_name'] = 'Украина'
            s['admin'] = 'УЗ'
            s['road'] = '40'
            s['road_label'] = 'Одесская ж. д. (УЗ)'
        elif code == '479707':
            s['country'] = 'RUS'
            s['country_name'] = 'Россия'
            s['admin'] = 'КЖД'
            s['road'] = '47'
            s['road_label'] = 'Крымская ж. д.'
        elif code == '461205':
            s['country'] = 'UKR'
            s['country_name'] = 'Украина'
            s['admin'] = 'УЗ'
            s['road'] = '46'
            s['road_label'] = 'Приднепровская ж. д. (УЗ)'
        # 4. Astrakhan / Volgograd Privolzhskaya (Russia)
        elif p2 in ['60', '61']:
            s['country'] = 'RUS'
            s['country_name'] = 'Россия'
            s['admin'] = 'РЖД'
            s['road'] = '61'
            s['road_label'] = 'Приволжская ж. д. (РЖД)'
        # 5. Azerbaijan
        elif code in ['548502', '547406', '548803', '553002', '554503', '557709', '558701', '550108', '550409', '554609', '558631'] or (p2 in ['54', '55'] and 'махачкала' not in name and 'яндыки' not in name):
            s['country'] = 'AZE'
            s['country_name'] = 'Азербайджан'
            s['admin'] = 'АДЮ'
            s['road'] = '55'
            s['road_label'] = 'Азербайджанские ж. д. (АДЮ)'
        # 6. Lokot (Russia)
        elif 'локоть' in name:
            s['country'] = 'RUS'
            s['country_name'] = 'Россия'
            s['admin'] = 'РЖД'
            s['road'] = '83'
            s['road_label'] = 'Западно-Сибирская ж. д. (РЖД)'
        # 7. Kazakhstan
        elif code in ['710600', '715106'] or 'турксиб' in name or 'шагыр' in name:
            s['country'] = 'KAZ'
            s['country_name'] = 'Казахстан'
            s['admin'] = 'КТЖ'
            s['road'] = '67'
            s['road_label'] = 'Казахстанская ж. д. (КТЖ)'

    # Ensure Yerevan and Gyumri exist
    codes = set(x.get('code') for x in stations)
    if '565103' not in codes:
        stations.append({
            'code': '565103',
            'name': 'Ереван',
            'country': 'ARM',
            'country_name': 'Армения',
            'admin': 'ЮКЖД',
            'road': '58',
            'road_label': 'Южно-Кавказская ж. д. (ЮКЖД)',
            'is_border': False
        })
    if '566708' not in codes:
        stations.append({
            'code': '566708',
            'name': 'Гюмри',
            'country': 'ARM',
            'country_name': 'Армения',
            'admin': 'ЮКЖД',
            'road': '58',
            'road_label': 'Южно-Кавказская ж. д. (ЮКЖД)',
            'is_border': False
        })

    with open('railway_stations.json', 'w', encoding='utf-8') as f:
        json.dump(stations, f, ensure_ascii=False, indent=2)
    print(f"Updated railway_stations.json (total stations: {len(stations)})")
    return stations

CLEAN_AND_FIND_STATION_JS = """  // 1. УНИВЕРСАЛЬНАЯ ОЧИСТКА И НОРМАЛИЗАЦИЯ НАЗВАНИЙ СТАНЦИЙ СЕТИ 1520 ММ
  function cleanStationName(name) {
    if (!name) return '';
    var s = (typeof name === 'object' && name !== null) ? (name.name || '') : name.toString();
    s = s.toLowerCase().replace(/ё/g, 'е');
    // Очистка префиксов и суффиксов станций
    s = s.replace(/\\[.*?\\]/g, '').replace(/\\[.*/g, '');
    s = s.replace(/\\(.*?\\)/g, '').replace(/\\(.*/g, '');
    s = s.replace(/(?:^|\\s+)(?:ст|станция)\\.?\\s*/gi, ' ');
    // Римские цифры в арабские для исключения путаницы станций I и II
    s = s.replace(/\\s+ii\\b/g, ' 2').replace(/-ii\\b/g, '-2').replace(/\\s+i\\b/g, ' 1').replace(/-i\\b/g, '-1');
    // Удаляем спецсимволы и пробелы
    s = s.replace(/[^\\u0400-\\u04FFa-zA-Z0-9]/g, '');
    return s;
  }

  // КОРНЕВОЙ КЛЮЧ ДЛЯ ТАРИФНЫХ РУКОВОДСТВ И КАНОНИЧЕСКИХ РАССТОЯНИЙ
  function getStationRootKey(name) {
    if (!name) return '';
    var s = cleanStationName(name);
    if (s.indexOf('жанасемей') !== -1) return 'жанасемей';
    if (s.indexOf('семей') !== -1) return 'семей';
    if (s.indexOf('петербург') !== -1 || s.indexOf('питер') !== -1 || s.indexOf('спб') !== -1) return 'санктпетербург';
    if (s.indexOf('москва') !== -1) return 'москва';
    if (s.indexOf('екатеринбург') !== -1 || s.indexOf('свердловск') !== -1) return 'екатеринбург';
    if (s.indexOf('бухара') !== -1) return 'бухара';
    if (s.indexOf('сарыагаш') !== -1 || s.indexOf('сарыагач') !== -1) return 'сарыагаш';
    if (s.indexOf('келес') !== -1) return 'келес';
    if (s.indexOf('чукурсай') !== -1) return 'чукурсай';
    if (s.indexOf('ташкент') !== -1) return 'ташкент';
    if (s.indexOf('сергели') !== -1) return 'сергели';
    if (s.indexOf('самарканд') !== -1) return 'самарканд';
    if (s.indexOf('термез') !== -1) return 'термез';
    if (s.indexOf('галаба') !== -1) return 'галаба';
    if (s.indexOf('костанай') !== -1 || s.indexOf('кустанай') !== -1) return 'костанай';
    if (s.indexOf('астана') !== -1 || s.indexOf('нурсултан') !== -1) return 'астана';
    if (s.indexOf('алматы') !== -1 || s.indexOf('алмаата') !== -1) return 'алматы';
    if (s.indexOf('шымкент') !== -1 || s.indexOf('чимкент') !== -1) return 'шымкент';
    if (s.indexOf('тараз') !== -1 || s.indexOf('джамбул') !== -1) return 'тараз';
    if (s.indexOf('караганда') !== -1) return 'караганда';
    if (s.indexOf('кокшетау') !== -1) return 'кокшетау';
    if (s.indexOf('актобе') !== -1 || s.indexOf('актюбинск') !== -1) return 'актобе';
    if (s.indexOf('илецк') !== -1) return 'илецк';
    if (s.indexOf('озинки') !== -1) return 'озинки';
    if (s.indexOf('карталы') !== -1) return 'карталы';
    if (s.indexOf('локоть') !== -1) return 'локоть';
    if (s.indexOf('минск') !== -1) return 'минск';
    if (s.indexOf('брест') !== -1) return 'брест';
    if (s.indexOf('павлодар') !== -1) return 'павлодар';
    if (s.indexOf('атырау') !== -1) return 'атырау';
    if (s.indexOf('мангышлак') !== -1 || s.indexOf('актау') !== -1) return 'мангышлак';
    if (s.indexOf('нукус') !== -1) return 'нукус';
    if (s.indexOf('ургенч') !== -1) return 'ургенч';
    if (s.indexOf('андижан') !== -1) return 'андижан';
    if (s.indexOf('коканд') !== -1) return 'коканд';
    if (s.indexOf('ростов') !== -1) return 'ростов';
    if (s.indexOf('тбилиси') !== -1) return 'тбилиси';
    if (s.indexOf('батуми') !== -1) return 'батуми';
    if (s.indexOf('поти') !== -1) return 'поти';
    if (s.indexOf('баку') !== -1) return 'баку';
    if (s.indexOf('ереван') !== -1) return 'ереван';
    if (s.indexOf('бишкек') !== -1) return 'бишкек';
    if (s.indexOf('душанбе') !== -1) return 'душанбе';
    return s;
  }

  // 2. УНИВЕРСАЛЬНЫЙ ПОИСК СТАНЦИИ С АВТОМАТИЧЕСКИМ ИЗВЛЕЧЕНИЕМ 6-ЗНАЧНОГО КОДА ЕСР
  function findStation(query) {
    if (!query) return STATIONS[0];
    if (typeof query === 'object' && query !== null && query.code && query.name) return query;

    var rawStr = (typeof query === 'object' && query !== null) ? (query.name || '') : query.toString().trim();
    var codeMatch = rawStr.match(/\\b(\\d{6})\\b/);
    var cleanQ = cleanStationName(rawStr);
    var lowerQ = rawStr.toLowerCase();

    // 0. Если в строке присутствует 6-значный код ЕСР (например "Жана-Семей (709302, КТЖ)"), ищем строго по коду!
    if (codeMatch) {
      for (var c = 0; c < STATIONS.length; c++) {
        if (STATIONS[c].code === codeMatch[1]) {
          return STATIONS[c];
        }
      }
    }

    // 1. Точное совпадение по коду ЕСР как строке
    for (var i = 0; i < STATIONS.length; i++) {
      if (STATIONS[i].code === rawStr) return STATIONS[i];
    }

    // 2. Точное совпадение по строго очищенному названию (екатеринбургсортировочный !== екатеринбургтоварный)
    for (var j = 0; j < STATIONS.length; j++) {
      if (cleanStationName(STATIONS[j].name) === cleanQ) {
        var resSt = Object.assign({}, STATIONS[j]);
        if (codeMatch) resSt.code = codeMatch[1];
        return resSt;
      }
    }

    // 3. Совпадение по началу строгого названия
    for (var k = 0; k < STATIONS.length; k++) {
      var sClean = cleanStationName(STATIONS[k].name);
      if (sClean.indexOf(cleanQ) === 0 || cleanQ.indexOf(sClean) === 0) {
        var resSt2 = Object.assign({}, STATIONS[k]);
        if (codeMatch) resSt2.code = codeMatch[1];
        return resSt2;
      }
    }

    // 4. Поиск по подстроке в оригинальном имени
    for (var l = 0; l < STATIONS.length; l++) {
      if (STATIONS[l].name.toLowerCase().indexOf(cleanQ) !== -1) {
        var resSt3 = Object.assign({}, STATIONS[l]);
        if (codeMatch) resSt3.code = codeMatch[1];
        return resSt3;
      }
    }

    // 5. Динамический синтез станции по введенным данным (с точным определением дороги и страны)
    var detectedCountry = 'RUS';
    var detectedCountryName = 'Россия';
    var detectedAdmin = 'РЖД';
    var roadStr = 'Российские железные дороги (РЖД)';
    var roadCode = '01';

    // Географический анализ по ключевым словам в названии станции
    if (lowerQ.indexOf('тбилиси') !== -1 || lowerQ.indexOf('батуми') !== -1 || lowerQ.indexOf('поти') !== -1 ||
        lowerQ.indexOf('кутаиси') !== -1 || lowerQ.indexOf('рустави') !== -1 || lowerQ.indexOf('боржоми') !== -1 ||
        lowerQ.indexOf('гори') !== -1 || lowerQ.indexOf('хашури') !== -1 || lowerQ.indexOf('авчала') !== -1 ||
        lowerQ.indexOf('сенаки') !== -1 || lowerQ.indexOf('садахло') !== -1) {
      detectedCountry = 'GEO';
      detectedCountryName = 'Грузия';
      detectedAdmin = 'ГРЗ';
      roadCode = '57';
      roadStr = 'Грузинская ж. д. (ГРЗ)';
    } else if (lowerQ.indexOf('баку') !== -1 || lowerQ.indexOf('гянджа') !== -1 || lowerQ.indexOf('сумгаит') !== -1 ||
               lowerQ.indexOf('алят') !== -1 || lowerQ.indexOf('беюккясик') !== -1 || lowerQ.indexOf('ялама') !== -1) {
      detectedCountry = 'AZE';
      detectedCountryName = 'Азербайджан';
      detectedAdmin = 'АДЮ';
      roadCode = '55';
      roadStr = 'Азербайджанские ж. д. (АДЮ)';
    } else if (lowerQ.indexOf('ереван') !== -1 || lowerQ.indexOf('гюмри') !== -1 || lowerQ.indexOf('ахурян') !== -1) {
      detectedCountry = 'ARM';
      detectedCountryName = 'Армения';
      detectedAdmin = 'ЮКЖД';
      roadCode = '58';
      roadStr = 'Южно-Кавказская ж. д. (ЮКЖД)';
    } else if (lowerQ.indexOf('бишкек') !== -1 || lowerQ.indexOf('аламедин') !== -1 || lowerQ.indexOf('ош') !== -1 ||
               lowerQ.indexOf('джалалабад') !== -1 || lowerQ.indexOf('рыбачье') !== -1) {
      detectedCountry = 'KGZ';
      detectedCountryName = 'Кыргызстан';
      detectedAdmin = 'КРГ';
      roadCode = '71';
      roadStr = 'Кыргызская ж. д. (КРГ)';
    } else if (lowerQ.indexOf('душанбе') !== -1 || lowerQ.indexOf('худжанд') !== -1 || lowerQ.indexOf('курган') !== -1 ||
               lowerQ.indexOf('куляб') !== -1) {
      detectedCountry = 'TJK';
      detectedCountryName = 'Таджикистан';
      detectedAdmin = 'ТДЖ';
      roadCode = '74';
      roadStr = 'Таджикская ж. д. (ТДЖ)';
    } else if (lowerQ.indexOf('ашхабад') !== -1 || lowerQ.indexOf('туркменбаши') !== -1 || lowerQ.indexOf('мары') !== -1 ||
               lowerQ.indexOf('туркменабад') !== -1 || lowerQ.indexOf('чарджоу') !== -1) {
      detectedCountry = 'TKM';
      detectedCountryName = 'Туркменистан';
      detectedAdmin = 'ТРК';
      roadCode = '75';
      roadStr = 'Туркменская ж. д. (ТРК)';
    } else if (lowerQ.indexOf('ташкент') !== -1 || lowerQ.indexOf('чукурсай') !== -1 || lowerQ.indexOf('сергели') !== -1 ||
               lowerQ.indexOf('самарканд') !== -1 || lowerQ.indexOf('бухара') !== -1 || lowerQ.indexOf('навои') !== -1 ||
               lowerQ.indexOf('андижан') !== -1 || lowerQ.indexOf('фергана') !== -1 || lowerQ.indexOf('термез') !== -1) {
      detectedCountry = 'UZB';
      detectedCountryName = 'Узбекистан';
      detectedAdmin = 'УТИ';
      roadCode = '73';
      roadStr = 'Узбекская ж. д. (УТИ)';
    } else if (lowerQ.indexOf('алматы') !== -1 || lowerQ.indexOf('астана') !== -1 || lowerQ.indexOf('караганда') !== -1 ||
               lowerQ.indexOf('шымкент') !== -1 || lowerQ.indexOf('семей') !== -1 || lowerQ.indexOf('кокшетау') !== -1 ||
               lowerQ.indexOf('костанай') !== -1 || lowerQ.indexOf('павлодар') !== -1 || lowerQ.indexOf('актобе') !== -1 ||
               lowerQ.indexOf('атырау') !== -1 || lowerQ.indexOf('актау') !== -1) {
      detectedCountry = 'KAZ';
      detectedCountryName = 'Казахстан';
      detectedAdmin = 'КТЖ';
      roadCode = '67';
      roadStr = 'Казахстанская ж. д. (КТЖ)';
    } else if (lowerQ.indexOf('минск') !== -1 || lowerQ.indexOf('брест') !== -1 || lowerQ.indexOf('гомель') !== -1 ||
               lowerQ.indexOf('витебск') !== -1 || lowerQ.indexOf('могилев') !== -1 || lowerQ.indexOf('гродно') !== -1) {
      detectedCountry = 'BLR';
      detectedCountryName = 'Беларусь';
      detectedAdmin = 'БЧ';
      roadCode = '13';
      roadStr = 'Белорусская ж. д. (БЧ)';
    } else if (codeMatch) {
      var cPrefix = codeMatch[1].substring(0, 2);
      var cPrefix4 = parseInt(codeMatch[1].substring(0, 4), 10);
      if (['56', '57'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'GEO';
        detectedCountryName = 'Грузия';
        detectedAdmin = 'ГРЗ';
        roadCode = '57';
        roadStr = 'Грузинская ж. д. (ГРЗ)';
      } else if (['54', '55'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'AZE';
        detectedCountryName = 'Азербайджан';
        detectedAdmin = 'АДЮ';
        roadCode = '55';
        roadStr = 'Азербайджанские ж. д. (АДЮ)';
      } else if (['58', '59'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'ARM';
        detectedCountryName = 'Армения';
        detectedAdmin = 'ЮКЖД';
        roadCode = '58';
        roadStr = 'Южно-Кавказская ж. д. (ЮКЖД)';
      } else if (['66', '67', '68', '69', '70'].indexOf(cPrefix) !== -1 || (cPrefix === '71' && cPrefix4 < 7160)) {
        detectedCountry = 'KAZ';
        detectedCountryName = 'Казахстан';
        detectedAdmin = 'КТЖ';
        roadCode = '67';
        roadStr = 'Казахстанская ж. д. (КТЖ)';
      } else if (cPrefix === '71' && cPrefix4 >= 7160) {
        detectedCountry = 'KGZ';
        detectedCountryName = 'Кыргызстан';
        detectedAdmin = 'КРГ';
        roadCode = '71';
        roadStr = 'Кыргызская ж. д. (КРГ)';
      } else if (cPrefix === '75') {
        detectedCountry = 'TKM';
        detectedCountryName = 'Туркменистан';
        detectedAdmin = 'ТРК';
        roadCode = '75';
        roadStr = 'Туркменская ж. д. (ТРК)';
      } else if (['72', '73'].indexOf(cPrefix) !== -1 || (cPrefix === '74' && ['744', '745', '746', '747', '748'].indexOf(codeMatch[1].substring(0, 3)) === -1)) {
        detectedCountry = 'UZB';
        detectedCountryName = 'Узбекистан';
        detectedAdmin = 'УТИ';
        roadCode = '73';
        roadStr = 'Узбекская ж. д. (УТИ)';
      } else if (cPrefix === '74' && ['744', '745', '746', '747', '748'].indexOf(codeMatch[1].substring(0, 3)) !== -1) {
        detectedCountry = 'TJK';
        detectedCountryName = 'Таджикистан';
        detectedAdmin = 'ТДЖ';
        roadCode = '74';
        roadStr = 'Таджикская ж. д. (ТДЖ)';
      } else if (['13', '14'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'BLR';
        detectedCountryName = 'Беларусь';
        detectedAdmin = 'БЧ';
        roadCode = '13';
        roadStr = 'Белорусская ж. д. (БЧ)';
      }
    }

    return {
      name: rawStr.split('(')[0].trim(),
      code: codeMatch ? codeMatch[1] : '193504',
      country: detectedCountry,
      country_name: detectedCountryName,
      admin: detectedAdmin,
      road: roadCode,
      road_label: roadStr,
      is_border: false
    };
  }"""

CAUCASUS_CORRIDOR_ENTRY = """    "baku_tbilisi_batumi": [
      { name: "Баку-Пассажирский", code: "547406", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 0 },
      { name: "Сумгаит", code: "547603", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 42 },
      { name: "Гянджа", code: "551000", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 322 },
      { name: "Беюк-Кясик (эксп.)", code: "558701", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 138, isBorder: true, borderLabel: "АДЮ ➔ ГРЗ" },
      { name: "Гардабани (эксп.)", code: "562800", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 20 },
      { name: "Рустави-Грузовая (эксп.)", code: "562707", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 22 },
      { name: "Тбилиси-Товарная", code: "560203", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 35 },
      { name: "Гори (эксп.)", code: "579036", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 76 },
      { name: "Хашури (эксп.)", code: "577100", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 50 },
      { name: "Зестафони", code: "576004", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 64 },
      { name: "Кутаиси II (эксп.)", code: "574795", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 40 },
      { name: "Самтредиа", code: "573006", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 32 },
      { name: "Сенаки (эксп.)", code: "571833", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 38 },
      { name: "Поти (эксп.)", code: "572200", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 40 },
      { name: "Батуми-Товарная (эксп.)", code: "571405", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 72 }
    ],
"""

BUILD_ROUTE_ITINERARY_AND_CALCULATE_JS = """  // УНИВЕРСАЛЬНЫЙ ТОПОЛОГИЧЕСКИЙ МНОГОКОРИДОРНЫЙ ГЕНЕРАТОР МАРШРУТНОГО ЛИСТА
  function buildRouteItinerary(fromSt, toSt, legs, border1, border2) {
    var originObj = (typeof fromSt === 'object' && fromSt !== null) ? fromSt : (findStation(fromSt) || { name: fromSt, code: "193504", road_label: "РЖД", country: "RUS", country_name: "Россия" });
    var destObj = (typeof toSt === 'object' && toSt !== null) ? toSt : (findStation(toSt) || { name: toSt, code: "720000", road_label: "УТИ", country: "UZB", country_name: "Узбекистан" });

    // Целевое суммарное расстояние строго берется из суммы участков (legs)
    var targetTotalKm = 0;
    if (Array.isArray(legs) && legs.length > 0) {
      legs.forEach(function(leg) { targetTotalKm += (leg.distanceKm || 0); });
    }
    if (!targetTotalKm || targetTotalKm <= 0) {
      targetTotalKm = resolveLegDistance(originObj, destObj) || 1000;
    }

    var origClean = cleanStationName(originObj.name || originObj);
    var destClean = cleanStationName(destObj.name || destObj);
    var origCode = (originObj.code || "").toString().trim();
    var destCode = (destObj.code || "").toString().trim();

    // Если отправление и назначение совпадают
    if (origClean === destClean || (origCode && origCode === destCode)) {
      return [{
        seq: 1,
        code: origCode || "193504",
        name: originObj.name,
        road: originObj.road_label || "Магистраль 1520",
        country: originObj.country || "RUS",
        countryName: originObj.country_name || "Россия",
        segmentKm: 0,
        cumulativeKm: 0,
        isOrigin: true,
        isDestination: true,
        isBorder: false,
        borderLabel: ""
      }];
    }

    // Внутренняя функция: нахождение непрерывного участка станций между двумя узлами
    function getCorridorChainSegment(sFrom, sTo) {
      var fStObj = (typeof sFrom === 'object' && sFrom !== null) ? sFrom : (findStation(sFrom) || { name: sFrom });
      var tStObj = (typeof sTo === 'object' && sTo !== null) ? sTo : (findStation(sTo) || { name: sTo });

      var fMatches = findStationInCorridors(fStObj);
      var tMatches = findStationInCorridors(tStObj);
      var preFeeder = null;
      var appFeeder = null;

      if (fMatches.length === 0) {
        var jf = resolveJunctionStation(fStObj);
        fMatches = findStationInCorridors(jf);
        preFeeder = Object.assign({}, fStObj, { dist: 0, segmentKm: 0 });
      }
      if (tMatches.length === 0) {
        var jt = resolveJunctionStation(tStObj);
        tMatches = findStationInCorridors(jt);
        appFeeder = Object.assign({}, tStObj, { dist: 25 });
      }
      if (fMatches.length === 0 || tMatches.length === 0) {
        return [Object.assign({}, fStObj, { dist: 0 }), Object.assign({}, tStObj, { dist: 25 })];
      }

      var fCorrs = [];
      fMatches.forEach(function(m) { if (fCorrs.indexOf(m.key) === -1) fCorrs.push(m.key); });
      var tCorrs = [];
      tMatches.forEach(function(m) { if (tCorrs.indexOf(m.key) === -1) tCorrs.push(m.key); });

      var path = findCorridorPath(fCorrs, tCorrs);
      if (!path || path.length === 0) {
        return [Object.assign({}, fStObj, { dist: 0 }), Object.assign({}, tStObj, { dist: 25 })];
      }

      var chainSeg = [];
      if (path.length === 1) {
        var cKey = path[0];
        var sIdx = -1, eIdx = -1;
        for (var i = 0; i < fMatches.length; i++) { if (fMatches[i].key === cKey) { sIdx = fMatches[i].index; break; } }
        for (var j = 0; j < tMatches.length; j++) { if (tMatches[j].key === cKey) { eIdx = tMatches[j].index; break; } }
        chainSeg = sliceCorridor(cKey, sIdx >= 0 ? sIdx : 0, eIdx >= 0 ? eIdx : (CORRIDOR_STATION_CHAINS[cKey].length - 1));
      } else {
        for (var p = 0; p < path.length; p++) {
          var curr = path[p];
          if (p === 0) {
            var sIdx = -1;
            for (var i = 0; i < fMatches.length; i++) { if (fMatches[i].key === curr) { sIdx = fMatches[i].index; break; } }
            var shared = findSharedStation(curr, path[p + 1]);
            chainSeg = chainSeg.concat(sliceCorridor(curr, sIdx >= 0 ? sIdx : 0, shared ? shared.idx1 : (CORRIDOR_STATION_CHAINS[curr].length - 1)));
          } else if (p === path.length - 1) {
            var shared = findSharedStation(path[p - 1], curr);
            var eIdx = -1;
            for (var j = 0; j < tMatches.length; j++) { if (tMatches[j].key === curr) { eIdx = tMatches[j].index; break; } }
            var seg = sliceCorridor(curr, shared ? shared.idx2 : 0, eIdx >= 0 ? eIdx : (CORRIDOR_STATION_CHAINS[curr].length - 1));
            chainSeg = chainSeg.concat(seg.slice(1));
          } else {
            var shPrev = findSharedStation(path[p - 1], curr);
            var shNext = findSharedStation(curr, path[p + 1]);
            var seg = sliceCorridor(curr, shPrev ? shPrev.idx2 : 0, shNext ? shNext.idx1 : (CORRIDOR_STATION_CHAINS[curr].length - 1));
            chainSeg = chainSeg.concat(seg.slice(1));
          }
        }
      }

      if (preFeeder) chainSeg.unshift(preFeeder);
      if (appFeeder) chainSeg.push(appFeeder);
      return chainSeg;
    }

    var stitched = [];

    // ПОУЧАСТКОВАЯ СБОРКА СТАНЦИЙ: если маршрут разбит на участки (транзит или 2 страны),
    // каждый участок маршрутизируется строго через свои выбранные стыки!
    if (Array.isArray(legs) && legs.length > 1) {
      for (var l = 0; l < legs.length; l++) {
        var leg = legs[l];
        var lStart = (l === 0) ? originObj : (findStation(leg.from) || leg.from);
        var lEnd = (l === legs.length - 1) ? destObj : (findStation(leg.to) || leg.to);
        var seg = getCorridorChainSegment(lStart, lEnd);

        if (seg && seg.length > 0) {
          // Пропорционально калибруем станции этого участка ровно под leg.distanceKm
          var legKm = leg.distanceKm || 100;
          var segRaw = 0;
          for (var sk = 1; sk < seg.length; sk++) segRaw += (seg[sk].dist || 25);
          if (segRaw > 0 && seg.length > 1) {
            var scSum = 0;
            var maxD = 0;
            var maxDIdx = 1;
            for (var sk = 1; sk < seg.length; sk++) {
              var sc = Math.round((seg[sk].dist || 25) * legKm / segRaw);
              if (sc < 1) sc = 1;
              seg[sk].dist = sc;
              scSum += sc;
              if (sc > maxD) { maxD = sc; maxDIdx = sk; }
            }
            seg[maxDIdx].dist += (legKm - scSum);
          }

          if (stitched.length === 0) {
            stitched = seg;
          } else {
            // Исключаем дублирование пограничной станции на стыке участков
            stitched = stitched.concat(seg.slice(1));
          }
        }
      }
    }

    // Резервная сквозная сборка (для простых или одноучастковых маршрутов)
    if (stitched.length < 2) {
      stitched = getCorridorChainSegment(originObj, destObj);
      var rawSum = 0;
      for (var k = 1; k < stitched.length; k++) rawSum += (stitched[k].dist || 25);
      if (rawSum > 0 && stitched.length > 1) {
        var scaledSum = 0;
        var maxVal = 0;
        var maxIdx = 1;
        for (var k = 1; k < stitched.length; k++) {
          var d = stitched[k].dist || 25;
          var scaled = Math.round(d * targetTotalKm / rawSum);
          if (scaled < 1) scaled = 1;
          stitched[k].dist = scaled;
          scaledSum += scaled;
          if (scaled > maxVal) { maxVal = scaled; maxIdx = k; }
        }
        stitched[maxIdx].dist += (targetTotalKm - scaledSum);
      }
    }

    // Принудительная фиксация станции отправления (строго как выбрал пользователь)
    stitched[0].name = originObj.name || stitched[0].name;
    stitched[0].code = originObj.code || stitched[0].code;
    stitched[0].road = originObj.road_label || stitched[0].road;
    stitched[0].country = originObj.country || stitched[0].country;
    stitched[0].countryName = originObj.country_name || stitched[0].countryName;
    stitched[0].isOrigin = true;

    // Принудительная фиксация станции назначения (строго как выбрал пользователь)
    var lastIdx = stitched.length - 1;
    stitched[lastIdx].name = destObj.name || stitched[lastIdx].name;
    stitched[lastIdx].code = destObj.code || stitched[lastIdx].code;
    stitched[lastIdx].road = destObj.road_label || stitched[lastIdx].road;
    stitched[lastIdx].country = destObj.country || stitched[lastIdx].country;
    stitched[lastIdx].countryName = destObj.country_name || stitched[lastIdx].countryName;
    stitched[lastIdx].isDestination = true;

    var cum = 0;
    var itinerary = [];

    for (var k = 0; k < stitched.length; k++) {
      var st = stitched[k];
      var segDist = (k === 0) ? 0 : (st.dist || 0);
      cum += segDist;

      var isBorderSt = false;
      var bLabel = "";
      var cNorm = cleanStationName(st.name);

      if (cNorm === 'сарыагаш' || cNorm === 'келес') {
        isBorderSt = true;
        bLabel = "КТЖ ➔ УТИ";
      } else if (cNorm === 'илецк' || cNorm === 'озинки' || cNorm === 'карталы' || cNorm === 'локоть' || cNorm === 'орск' || cNorm === 'кулунда' || cNorm === 'петропавловск') {
        isBorderSt = true;
        bLabel = "РЖД ➔ КТЖ";
      } else if (cNorm === 'красное' || cNorm === 'осиновка') {
        isBorderSt = true;
        bLabel = "БЧ ➔ РЖД";
      } else if (cNorm === 'достык' || cNorm === 'алтынколь') {
        isBorderSt = true;
        bLabel = "КНР ➔ КТЖ";
      } else if (cNorm === 'галаба' || cNorm === 'хайратан') {
        isBorderSt = true;
        bLabel = "УТИ ➔ АРА";
      } else if (cNorm === 'ходжадавлет' || cNorm === 'фарап' || cNorm === 'сарахс') {
        isBorderSt = true;
        bLabel = "УТИ ➔ ТРК";
      } else if (cNorm === 'кудукли' || cNorm === 'пахтаабад' || cNorm === 'бекабад') {
        isBorderSt = true;
        bLabel = "УТИ ➔ ТДЖ";
      } else if (cNorm === 'бейнеу' || cNorm === 'каракалпакстан') {
        isBorderSt = true;
        bLabel = "КТЖ ➔ УТИ";
      } else if (cNorm === 'беюккясик' || cNorm === 'гардабани') {
        isBorderSt = true;
        bLabel = "АДЮ ➔ ГРЗ";
      }

      itinerary.push({
        seq: k + 1,
        code: (st.code || "000000").toString().trim(),
        name: st.name,
        road: st.road || "Магистраль 1520",
        country: st.country || "CIS",
        countryName: st.countryName || "1520",
        segmentKm: segDist,
        cumulativeKm: cum,
        isOrigin: k === 0,
        isDestination: k === (stitched.length - 1),
        isBorder: isBorderSt || st.isBorder || false,
        borderLabel: bLabel || st.borderLabel || ""
      });
    }

    return itinerary;
  }

  // 7. ИТОГОВЫЙ МУЛЬТИВАЛЮТНЫЙ КАЛЬКУЛЯТОР ТАРИФОВ
  function calculateTariff(params) {
    params = params || {};
    var fromStation = findStation(params.from) || STATIONS[0];
    var toStation = findStation(params.to) || STATIONS[1];
    var wagonType = ROLLING_STOCK[params.wagonType] || ROLLING_STOCK['grain'];
    var cargoItem = findCargo(params.cargoSearch || params.cargoType);
    var parkType = params.parkType || 'caravan';
    var incoterms = (params.incoterms || 'DAP').toUpperCase();
    var hasSecurity = params.security === true || params.security === 'true' || cargoItem.security_required;
    var hasCustoms = params.customs === true || params.customs === 'true';
    var discountPercent = parseFloat(params.discount) || 0;

    var isTransitPair = (fromStation.country === 'RUS' && toStation.country === 'UZB') ||
                        (fromStation.country === 'UZB' && toStation.country === 'RUS');

    // Для транзитных маршрутов Стык 1 строго изолируется от единичных селекторов
    var b1Arg = isTransitPair ? (params.manualBorder1 || (params.manualBorderCode && params.manualBorderCode.border1)) : (params.manualBorderCode || params.manualBorder1);
    var b2Arg = params.manualBorder2 || (params.manualBorderCode && params.manualBorderCode.border2);

    var routePlan = determineRouteLegs(fromStation, toStation, b1Arg, b2Arg);
    var totalKm = 0;
    var detailedLegs = [];
    var totalInfraUSD = 0;
    var totalWagonUSD = 0;
    var totalBorderFeesUSD = 0;
    var totalSecurityUSD = 0;

    var cargoFactor = cargoItem.tariff_class === 1 ? 0.75 : (cargoItem.tariff_class === 3 ? 1.25 : 1.0);

    for (var l = 0; l < routePlan.legs.length; l++) {
      var leg = routePlan.legs[l];
      totalKm += leg.distanceKm;

      var baseBeltRate = getBaseRateForKm(leg.distanceKm);
      var countryFactor = (leg.country === 'UZB' ? 1.15 : (leg.country === 'RUS' ? 1.10 : (leg.type === 'transit' ? 1.20 : 1.0)));
      var legInfra = Math.round(leg.distanceKm * baseBeltRate * countryFactor * cargoFactor);

      var legDays = Math.ceil(leg.distanceKm / wagonType.speedKmPerDay) + 1;
      var legWagon = (parkType === 'caravan') ? Math.round(legDays * wagonType.dailyRateUSD * 1.35) : Math.round(legInfra * 0.45);

      var legBorderFee = 0;
      if (leg.type === 'export_departure') {
        var bObj = routePlan.border1 || routePlan.border;
        if (bObj) legBorderFee += bObj.fee || 65;
      } else if (leg.type === 'transit' && routePlan.border2) {
        legBorderFee += routePlan.border2.fee || 85;
      }

      var legSec = hasSecurity ? Math.round(leg.distanceKm * 0.08 + 45) : 0;
      var legTotal = legInfra + legWagon + legBorderFee + legSec;

      totalInfraUSD += legInfra;
      totalWagonUSD += legWagon;
      totalBorderFeesUSD += legBorderFee;
      totalSecurityUSD += legSec;

      detailedLegs.push({
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
      });
    }

    var incotermsFeeUSD = 0;
    if (incoterms === 'DAP') incotermsFeeUSD = 325;
    else if (incoterms === 'CIP') incotermsFeeUSD = 180;
    else if (incoterms === 'DDP') incotermsFeeUSD = 550;
    else if (incoterms === 'CPT') incotermsFeeUSD = 90;
    else if (incoterms === 'FCA') incotermsFeeUSD = 40;

    if (hasCustoms) incotermsFeeUSD += 120;

    var grandTotalUSD = totalInfraUSD + totalWagonUSD + totalBorderFeesUSD + totalSecurityUSD + incotermsFeeUSD;
    if (discountPercent > 0) {
      grandTotalUSD = Math.round(grandTotalUSD * (1 - discountPercent / 100));
    }

    // Построение постанционного маршрутного листа по ТР4 (Рейл-Тариф)
    var fullItinerary = buildRouteItinerary(fromStation, toStation, detailedLegs, routePlan.border1, routePlan.border2);
    if (fullItinerary && fullItinerary.length > 2) {
      var itinDist = fullItinerary[fullItinerary.length - 1].cumulativeKm;
      if (itinDist > 0) {
        totalKm = itinDist;
      }
    }

    var transitDaysMin = Math.ceil(totalKm / wagonType.speedKmPerDay) + 1;
    var transitDaysMax = transitDaysMin + 2;
    var transitStr = transitDaysMin + '-' + transitDaysMax + ' суток';

    var cur = CURRENCY_RATES[params.currency || 'USD'] || CURRENCY_RATES['USD'];
    var convertedTotal = Math.round(grandTotalUSD * cur.rate);

    return {
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
      incotermsFeeUSD: incotermsFeeUSD,
      legs: detailedLegs,
      routePlan: routePlan,
      itinerary: fullItinerary,
      currency: cur.code,
      currencyRate: cur.rate,
      totalCostLocal: convertedTotal,
      formattedTotal: convertedTotal.toLocaleString('ru-RU') + ' ' + cur.symbol,
      route: {
        from: fromStation,
        to: toStation,
        isTransit: routePlan.isTransit,
        messageType: routePlan.messageType,
        totalDistanceKm: totalKm,
        legs: detailedLegs,
        border: routePlan.border,
        border1: routePlan.border1,
        border2: routePlan.border2,
        availBorders: routePlan.availBorders || [],
        availBorders1: routePlan.availBorders1 || [],
        availBorders2: routePlan.availBorders2 || [],
        itinerary: fullItinerary,
        totalStationsCount: (fullItinerary ? fullItinerary.length : 0)
      },
      wagon: wagonType,
      cargo: cargoItem,
      parkType: parkType === 'caravan' ? 'Собственный парк (СПС Caravan)' : 'Инвентарный парк (КТЖ/УТИ/РЖД)',
      transitDays: transitStr,
      breakdownUSD: {
        infra: totalInfraUSD,
        wagon: totalWagonUSD,
        borders: totalBorderFeesUSD,
        security: totalSecurityUSD,
        incoterms: incotermsFeeUSD
      },
      totals: {
        usd: grandTotalUSD,
        convertedTotal: convertedTotal,
        formattedTotal: convertedTotal.toLocaleString('ru-RU') + ' ' + cur.symbol,
        currencyCode: cur.code
      }
    };
  }"""

def update_railway_calc_engine(stations):
    path = "railway_calc_engine.js"
    with open(path, "r", encoding="utf-8") as f:
        src = f.read()

    # 1. Update STATIONS array
    st_match = re.search(r'var STATIONS\s*=\s*\[', src)
    cargo_match = re.search(r'var CARGO_ITEMS\s*=\s*\[', src)
    if st_match and cargo_match:
        st_start = st_match.start()
        cargo_start = cargo_match.start()
        st_end = src.rfind("];", st_start, cargo_start)
        if st_end != -1:
            st_json = json.dumps(stations, ensure_ascii=False, indent=2)
            st_json_indented = "\n".join("  " + line for line in st_json.split("\n"))
            src = src[:st_start] + "var STATIONS =   " + st_json_indented.strip() + ";\n\n" + src[st_end + 2:]
            print("Updated STATIONS in railway_calc_engine.js")

    # 2. Add Caucasus corridor if not present
    if '"baku_tbilisi_batumi"' not in src:
        cor_idx = src.find('"spb_moscow": [')
        if cor_idx != -1:
            src = src[:cor_idx] + CAUCASUS_CORRIDOR_ENTRY + src[cor_idx:]
            print("Added baku_tbilisi_batumi corridor to CORRIDOR_STATION_CHAINS")

    # 3. Update cleanStationName and findStation
    c_start = src.find("function cleanStationName(name) {")
    search_idx = src.find("function searchStations(query, limit) {")
    if c_start != -1 and search_idx != -1:
        # Include comment above cleanStationName if present
        comm_idx = src.rfind("// 1. УНИВЕРСАЛЬНАЯ ОЧИСТКА", max(0, c_start - 300), c_start)
        if comm_idx != -1:
            c_start = comm_idx
        src = src[:c_start] + CLEAN_AND_FIND_STATION_JS + "\n\n  " + src[search_idx:]
        print("Updated cleanStationName & findStation in railway_calc_engine.js")

    # 4. Update buildRouteItinerary AND calculateTariff in one clean block
    b_start = src.find("// УНИВЕРСАЛЬНЫЙ ТОПОЛОГИЧЕСКИЙ МНОГОКОРИДОРНЫЙ ГЕНЕРАТОР МАРШРУТНОГО ЛИСТА")
    if b_start == -1:
        b_start = src.find("function buildRouteItinerary(fromSt, toSt, legs, border1, border2) {")
    calc_end = src.find("return {\n    STATIONS: STATIONS,")
    if b_start != -1 and calc_end != -1:
        src = src[:b_start] + BUILD_ROUTE_ITINERARY_AND_CALCULATE_JS + "\n\n  " + src[calc_end:]
        print("Updated buildRouteItinerary & calculateTariff in railway_calc_engine.js")

    with open(path, "w", encoding="utf-8") as f:
        f.write(src)
    print("Saved railway_calc_engine.js")
    return src

CLEAN_UI_JS_BLOCK = """  var lastSyncedRouteKey = '';

  function syncBorderDropdowns(route) {
    var singleWrap = document.getElementById('cr-border-single-wrap');
    var dualWrap = document.getElementById('cr-border-dual-wrap');
    var singleSelect = document.getElementById('cr-calc-border');
    var b1Select = document.getElementById('cr-calc-border-1');
    var b2Select = document.getElementById('cr-calc-border-2');

    if (!singleWrap || !dualWrap) return;

    var routeKey = (route.from.country || '') + '-' + (route.to.country || '') + (route.isTransit ? '-transit' : '');

    if (route.isTransit && route.availBorders1 && route.availBorders2) {
      singleWrap.style.display = 'none';
      dualWrap.style.display = 'grid';

      if (lastSyncedRouteKey !== routeKey) {
        if (b1Select) {
          var b1Current = b1Select.value;
          var b1Html = '<option value=\"auto\">Определять автоматически (Оптимальный)</option>';
          route.availBorders1.forEach(function(b) {
            b1Html += '<option value=\"' + b.code + '\">' + escapeHtml(b.name) + '</option>';
          });
          b1Select.innerHTML = b1Html;
          if (b1Current && b1Current !== 'auto' && route.availBorders1.some(function(b) { return b.code === b1Current; })) {
            b1Select.value = b1Current;
          }
        }
        if (b2Select) {
          var b2Current = b2Select.value;
          var b2Html = '<option value=\"auto\">Определять автоматически (Оптимальный)</option>';
          route.availBorders2.forEach(function(b) {
            b2Html += '<option value=\"' + b.code + '\">' + escapeHtml(b.name) + '</option>';
          });
          b2Select.innerHTML = b2Html;
          if (b2Current && b2Current !== 'auto' && route.availBorders2.some(function(b) { return b.code === b2Current; })) {
            b2Select.value = b2Current;
          }
        }
        lastSyncedRouteKey = routeKey;
      }
    } else if (route.availBorders && route.availBorders.length > 0) {
      dualWrap.style.display = 'none';
      singleWrap.style.display = 'block';

      if (lastSyncedRouteKey !== routeKey) {
        if (singleSelect) {
          var sCurrent = singleSelect.value;
          var sHtml = '<option value=\"auto\">Определять автоматически по плану формирования</option>';
          route.availBorders.forEach(function(b) {
            sHtml += '<option value=\"' + b.code + '\">' + escapeHtml(b.name) + '</option>';
          });
          singleSelect.innerHTML = sHtml;
          if (sCurrent && sCurrent !== 'auto' && route.availBorders.some(function(b) { return b.code === sCurrent; })) {
            singleSelect.value = sCurrent;
          }
        }
        lastSyncedRouteKey = routeKey;
      }
    } else {
      dualWrap.style.display = 'none';
      singleWrap.style.display = 'none';
      lastSyncedRouteKey = routeKey;
    }
  }

  function formatBorderSchemeName(name) {
    if (!name) return '';
    return name.split('/')[0].replace(/\\[.*?\\]/g, '').trim();
  }

  function renderRouteScheme(route) {
    var flowEl = document.getElementById('cr-rs-flow');
    if (!flowEl) return;

    var rsBadge = document.getElementById('cr-rs-badge');
    if (rsBadge) rsBadge.textContent = route.messageType;

    var rsDist = document.getElementById('cr-rs-distance');
    if (rsDist) rsDist.textContent = 'Общий путь: ' + route.totalDistanceKm.toLocaleString('ru-RU') + ' км';

    var html = '';

    if (route.isTransit && route.legs && route.legs.length >= 3) {
      var leg1 = route.legs[0];
      var leg2 = route.legs[1];
      var leg3 = route.legs[2];
      var b1Name = route.border1 ? formatBorderSchemeName(route.border1.name) : leg1.to;
      var b2Name = route.border2 ? formatBorderSchemeName(route.border2.name) : leg2.to;

      html += '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot origin\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">ст. ' + escapeHtml(route.from.name) + ' (' + escapeHtml(route.from.code) + ')</div>' +
          '<div class=\"cr-rs-sub\">' + escapeHtml(leg1.countryName) + ' (' + escapeHtml(leg1.road) + ')</div>' +
        '</div>' +
      '</div>' +
      '<div class=\"cr-rs-line\">' +
        '<span class=\"cr-rs-line-info\">' + escapeHtml(leg1.road) + ': ' + leg1.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot border\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">' + escapeHtml(b1Name) + '</div>' +
          '<div class=\"cr-rs-sub\">Стык 1 (РЖД / КТЖ)</div>' +
        '</div>' +
      '</div>' +
      '<div class=\"cr-rs-line\">' +
        '<span class=\"cr-rs-line-info\">' + escapeHtml(leg2.road) + ': ' + leg2.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot border\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">' + escapeHtml(b2Name) + '</div>' +
          '<div class=\"cr-rs-sub\">Стык 2 (КТЖ / УТИ)</div>' +
        '</div>' +
      '</div>' +
      '<div class=\"cr-rs-line\">' +
        '<span class=\"cr-rs-line-info\">' + escapeHtml(leg3.road) + ': ' + leg3.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot dest\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">ст. ' + escapeHtml(route.to.name) + ' (' + escapeHtml(route.to.code) + ')</div>' +
          '<div class=\"cr-rs-sub\">' + escapeHtml(leg3.countryName) + ' (' + escapeHtml(leg3.road) + ')</div>' +
        '</div>' +
      '</div>';
    } else if (route.legs && route.legs.length >= 2) {
      var l1 = route.legs[0];
      var l2 = route.legs[1];
      var bName = route.borderCrossing ? formatBorderSchemeName(route.borderCrossing.name) : l1.to;

      html += '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot origin\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">ст. ' + escapeHtml(route.from.name) + ' (' + escapeHtml(route.from.code) + ')</div>' +
          '<div class=\"cr-rs-sub\">' + escapeHtml(l1.countryName) + ' (' + escapeHtml(l1.road) + ')</div>' +
        '</div>' +
      '</div>' +
      '<div class=\"cr-rs-line\">' +
        '<span class=\"cr-rs-line-info\">' + escapeHtml(l1.road) + ': ' + l1.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot border\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">' + escapeHtml(bName) + '</div>' +
          '<div class=\"cr-rs-sub\">Межгосударственный стыковой пункт</div>' +
        '</div>' +
      '</div>' +
      '<div class=\"cr-rs-line\">' +
        '<span class=\"cr-rs-line-info\">' + escapeHtml(l2.road) + ': ' + l2.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot dest\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">ст. ' + escapeHtml(route.to.name) + ' (' + escapeHtml(route.to.code) + ')</div>' +
          '<div class=\"cr-rs-sub\">' + escapeHtml(l2.countryName) + ' (' + escapeHtml(l2.road) + ')</div>' +
        '</div>' +
      '</div>';
    } else {
      var domLeg = (route.legs && route.legs[0]) ? route.legs[0] : null;
      var domRoad = domLeg ? domLeg.road : (route.from.road_label || 'Ж/Д');
      var domCountry = domLeg ? domLeg.countryName : (route.from.country_name || '');

      html += '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot origin\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">ст. ' + escapeHtml(route.from.name) + ' (' + escapeHtml(route.from.code) + ')</div>' +
          '<div class=\"cr-rs-sub\">' + escapeHtml(domCountry) + ' (' + escapeHtml(domRoad) + ')</div>' +
        '</div>' +
      '</div>' +
      '<div class=\"cr-rs-line\">' +
        '<span class=\"cr-rs-line-info\">' + escapeHtml(domRoad) + ': ' + route.totalDistanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class=\"cr-rs-step\">' +
        '<span class=\"cr-rs-dot dest\"></span>' +
        '<div>' +
          '<div class=\"cr-rs-name\">ст. ' + escapeHtml(route.to.name) + ' (' + escapeHtml(route.to.code) + ')</div>' +
          '<div class=\"cr-rs-sub\">' + escapeHtml(domCountry) + ' (' + escapeHtml(domRoad) + ')</div>' +
        '</div>' +
      '</div>';
    }

    flowEl.innerHTML = html;
  }

  function triggerCustomCalculation() {
    // Маршрутизация на расчет выбранного направления
    if (typeof currentModality !== 'undefined' && currentModality !== 'rail') {
      handleNonRailCalculation(currentModality);
      return;
    }

    var fromVal = (document.getElementById('cr-calc-from') ? document.getElementById('cr-calc-from').value : '') || 'Кокшетау';
    var toVal = (document.getElementById('cr-calc-to') ? document.getElementById('cr-calc-to').value : '') || 'Ташкент-Товарный';
    
    var singleWrap = document.getElementById('cr-border-single-wrap');
    var dualWrap = document.getElementById('cr-border-dual-wrap');
    var borderSelect = document.getElementById('cr-calc-border');
    var b1Select = document.getElementById('cr-calc-border-1');
    var b2Select = document.getElementById('cr-calc-border-2');

    var isDual = dualWrap && dualWrap.style.display !== 'none';
    var manualBorderCode = (!isDual && borderSelect && borderSelect.value !== 'auto') ? borderSelect.value : null;
    var manualBorder1 = (isDual && b1Select && b1Select.value !== 'auto') ? b1Select.value : null;
    var manualBorder2 = (isDual && b2Select && b2Select.value !== 'auto') ? b2Select.value : null;

    var transportCode = document.getElementById('cr-calc-transport') ? document.getElementById('cr-calc-transport').value : 'grain';
    var parkType = document.getElementById('cr-calc-park') ? document.getElementById('cr-calc-park').value : 'caravan';
    var cargoSearchEl = document.getElementById('cr-calc-cargo-search');
    var cargoSearchVal = cargoSearchEl ? cargoSearchEl.value : '';
    var cargoCode = document.getElementById('cr-calc-cargo') ? document.getElementById('cr-calc-cargo').value : 'grain';
    var weightVal = parseInt(document.getElementById('cr-calc-weight') ? document.getElementById('cr-calc-weight').value : 68) || 68;
    var incoterms = document.getElementById('cr-calc-incoterms') ? document.getElementById('cr-calc-incoterms').value : 'DAP';
    var freightType = document.getElementById('cr-calc-freight-type') ? document.getElementById('cr-calc-freight-type').value : 'rail';
    var hasSec = document.getElementById('cr-opt-security') ? document.getElementById('cr-opt-security').checked : true;
    var hasCust = document.getElementById('cr-opt-customs') ? document.getElementById('cr-opt-customs').checked : false;

    var roleInput = document.querySelector('input[name=\"cr_client_role\"]:checked');
    var clientRoleVal = roleInput ? roleInput.value : 'shipper';
    var roleLabel = clientRoleVal === 'shipper' ? 'Грузоотправитель' : 
                   (clientRoleVal === 'consignee' ? 'Грузополучатель' : 'Экспедитор / Агент');

    var discount = currentUser ? (currentUser.discount || 0) : 0;

    // Вызываем расчетное ядро Caravan 1520
    var calcResult = CaravanRailwayEngine.calculateTariff({
      from: fromVal,
      to: toVal,
      manualBorderCode: manualBorderCode,
      manualBorder1: manualBorder1,
      manualBorder2: manualBorder2,
      wagonType: transportCode,
      parkType: parkType,
      cargoType: cargoCode,
      cargoSearch: cargoSearchVal,
      weightTons: weightVal,
      incoterms: incoterms,
      freightType: freightType,
      security: hasSec,
      customs: hasCust,
      clientRole: roleLabel,
      discount: discount,
      currency: selectedCurrency
    });

    // Синхронизируем селекторы погранпереходов
    syncBorderDropdowns(calcResult.route);

    // Обновляем отображение расстояния в инпуте
    var kmInput = document.getElementById('cr-calc-km');
    if (kmInput) {
      kmInput.value = calcResult.route.totalDistanceKm;
    }

    // Обновляем визуальную схему маршрута
    renderRouteScheme(calcResult.route);

    // Обновляем баннер Incoterms
    var descObj = INCOTERMS_DESC[incoterms] || INCOTERMS_DESC['DAP'];
    var ibTitle = document.getElementById('cr-ib-title');
    var ibDesc = document.getElementById('cr-ib-desc');
    if (ibTitle) ibTitle.textContent = descObj.title;
    if (ibDesc) ibDesc.textContent = descObj.desc;

    // Рендерим таблицу тарифов
    renderRTariffTable(calcResult);
    renderRouteItinerary(calcResult.route.itinerary);

    // Запоминаем текущую квоту для бронирования
    currentCalculatedQuote = {
      from: 'ст. ' + calcResult.route.from.name + ' (' + calcResult.route.from.code + ')',
      to: 'ст. ' + calcResult.route.to.name + ' (' + calcResult.route.to.code + ')',
      transport: calcResult.wagon.name,
      park_type: calcResult.parkType,
      cargo_name: calcResult.cargo.name,
      incoterms: incoterms,
      client_role: roleLabel,
      distance_km: calcResult.route.totalDistanceKm,
      total_price_usd: calcResult.totals.usd,
      converted_total: calcResult.totals.formattedTotal,
      currency: calcResult.totals.currencyCode,
      transit_days: calcResult.transitDays,
      breakdown: calcResult.breakdownUSD,
      legs: calcResult.route.legs
    };

    updateQuoteDisplay(currentCalculatedQuote, discount);
  }"""

def sync_html_files(engine_full):
    s_eng = engine_full.find('var CaravanRailwayEngine = (function() {')
    if s_eng == -1:
        print("ERROR: could not find engine start in railway_calc_engine.js")
        return
    engine_body = engine_full[s_eng:].strip() + "\n\n"

    for fname in ['caravan-tracking-widget.html', 'index.html']:
        with open(fname, 'r', encoding='utf-8') as f:
            src = f.read()

        # 1. Update Engine slice
        s_w = src.find('var CaravanRailwayEngine = (function() {')
        e_w = src.find('(function() {\n  var CARAVAN_CONFIG = {')
        if s_w != -1 and e_w != -1:
            src = src[:s_w] + engine_body + src[e_w:]
            print(f"Updated CaravanRailwayEngine in {fname}")

        # 2. Clean and deduplicate UI functions
        first_sync = src.find("function syncBorderDropdowns(route) {")
        if first_sync != -1:
            sync_start = src.rfind("var lastSyncedRouteKey", max(0, first_sync - 150), first_sync)
            if sync_start == -1:
                sync_start = first_sync

            itin_toggle = src.find("window.toggleItineraryList = function(e)")
            if itin_toggle != -1:
                src = src[:sync_start] + CLEAN_UI_JS_BLOCK + "\n\n  " + src[itin_toggle:]
                print(f"Deduplicated UI functions in {fname}")

        with open(fname, 'w', encoding='utf-8') as f:
            f.write(src)
        print(f"Saved {fname}")

def rebuild_bundle_and_bump():
    import build_widget_bundle
    build_widget_bundle.build()
    print("Rebuilt bundle (caravan-widget.js & caravan-widget.css)")

    # Bump version in test_embed.html
    with open('test_embed.html', 'r', encoding='utf-8') as f:
        t = f.read()
    t = re.sub(r'caravan-widget\.js\?v=\d+', 'caravan-widget.js?v=382', t)
    with open('test_embed.html', 'w', encoding='utf-8') as f:
        f.write(t)
    print("Bumped test_embed.html to v=382")

    # Bump version in tilda-embed-snippet.html
    with open('tilda-embed-snippet.html', 'r', encoding='utf-8') as f:
        t = f.read()
    t = re.sub(r'caravan-widget\.(js|css)\?v=[0-9.]+', r'caravan-widget.\1?v=3.8.2', t)
    with open('tilda-embed-snippet.html', 'w', encoding='utf-8') as f:
        f.write(t)
    print("Bumped tilda-embed-snippet.html to v=3.8.2")

if __name__ == '__main__':
    stations = fix_stations_data()
    engine_src = update_railway_calc_engine(stations)
    sync_html_files(engine_src)
    rebuild_bundle_and_bump()
    print("=== All updates completed successfully! ===")
