#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update handleNonRailCalculation in caravan-tracking-widget.html and index.html
to properly populate all quote badges, route titles, transit days, and detailed tables!
"""

NEW_HANDLER = """  function handleNonRailCalculation(modality) {
    var apiUrl = getCaravanApiUrl();
    var tableWrap = document.querySelector('.cr-rtariff-table-wrap');
    var tableTitle = document.querySelector('.cr-rtariff-table-title');
    var thead = document.querySelector('#cr-rtariff-table thead');
    var tbody = document.getElementById('cr-rtariff-tbody');
    var resBox = document.getElementById('cr-calc-result-box');
    var routeEl = document.getElementById('cr-quote-route-title');
    var badgeTrans = document.getElementById('cr-qb-transport');
    var badgePark = document.getElementById('cr-qb-park');
    var badgeCargo = document.getElementById('cr-qb-cargo');
    var badgeInco = document.getElementById('cr-qb-incoterms');
    var totalEl = document.getElementById('cr-quote-total-price');
    var transitEl = document.getElementById('cr-quote-transit-days');
    var schemeBox = document.getElementById('cr-route-scheme-box');

    if (!tbody) return;
    if (resBox) resBox.style.display = 'block';
    if (schemeBox) schemeBox.style.display = (modality === 'rail') ? 'block' : 'none';

    function fmt(n) {
      return '$' + Math.round(n).toLocaleString('ru-RU');
    }

    if (modality === 'fleet') {
      var wType = (document.getElementById('cr-fleet-type') ? document.getElementById('cr-fleet-type').value : 'grain');
      var wCount = parseInt(document.getElementById('cr-fleet-count') ? document.getElementById('cr-fleet-count').value : 10) || 10;
      var wDays = parseInt(document.getElementById('cr-fleet-days') ? document.getElementById('cr-fleet-days').value : 30) || 30;
      var rType = (document.getElementById('cr-fleet-rent-type') ? document.getElementById('cr-fleet-rent-type').value : 'daily');
      var routeText = (document.getElementById('cr-fleet-route') ? document.getElementById('cr-fleet-route').value : 'Акмола ➔ Сарыагаш');

      var wNames = {
        grain: 'Хоппер-зерновоз (116–120 м³, 70 т)',
        covered: 'Крытый вагон (138–161 м³, 68 т)',
        gondola: 'Полувагон люковый (85 м³, 70 т)',
        platform: 'Фитинговая платформа (20\\'/40\\' HC)',
        tank: 'Ж/Д цистерна (нефть, ГСМ, масла)'
      };
      var rateMap = { grain: 42, covered: 38, gondola: 32, platform: 29, tank: 45 };
      var dailyRate = rateMap[wType] || 40;
      var totalUsd = dailyRate * wDays * wCount;

      if (routeEl) routeEl.textContent = routeText + ' (Аренда подвижного состава)';
      if (badgeTrans) badgeTrans.textContent = (wNames[wType] || 'Вагон Caravan') + ' — ' + wCount + ' ед.';
      if (badgePark) badgePark.textContent = 'Собственный парк СПС (Caravan Railroad)';
      if (badgeCargo) badgeCargo.textContent = (rType === 'daily' ? 'Посуточная аренда' : 'Аренда на кругорейс') + ' (' + wDays + ' сут.)';
      if (badgeInco) badgeInco.textContent = 'Договор аренды и оперирования ПС';
      if (totalEl) totalEl.textContent = fmt(totalUsd) + ' USD';
      if (transitEl) transitEl.textContent = 'Готовность к подаче под погрузку: 2–3 суток';
      if (tableTitle) tableTitle.textContent = 'Расчет стоимости аренды подвижного состава:';

      if (thead) {
        thead.innerHTML = '<tr><th>Наименование услуги</th><th>Параметры</th><th class="cr-text-right">Период / Объем</th><th class="cr-text-right">Ставка</th><th class="cr-text-right" colspan="4">Итого</th></tr>';
      }
      tbody.innerHTML = '<tr><td>Суточная аренда парка Caravan (' + (wNames[wType] || 'Вагоны') + ')</td><td>' + wCount + ' ед. вагонов</td><td class="cr-text-right">' + wDays + ' сут.</td><td class="cr-text-right">$' + dailyRate + '/сут.</td><td class="cr-text-right" colspan="4" style="color:var(--cr-amber); font-weight:700;">' + fmt(totalUsd) + '</td></tr>' +
                        '<tr><td>Диспетчерский мониторинг и слежение за дислокацией 24/7</td><td>АСУ «Caravan Fleet Tracker»</td><td class="cr-text-right">' + wDays + ' сут.</td><td class="cr-text-right">Включено</td><td class="cr-text-right" colspan="4">$0</td></tr>' +
                        '<tr><td>Техническое освидетельствование и допуск (ВУ-23М / ВУ-36М)</td><td>Станция формирования</td><td class="cr-text-right">Перед рейсом</td><td class="cr-text-right">Включено</td><td class="cr-text-right" colspan="4">$0</td></tr>';

      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['fleet']);

      currentCalculatedQuote = {
        from: routeText,
        to: 'Пункт выгрузки',
        transport: wNames[wType] || 'Вагоны Caravan',
        park_type: 'Собственный парк СПС Caravan',
        cargo_name: 'Аренда подвижного состава',
        incoterms: 'Аренда ПС',
        client_role: 'Арендатор',
        total_price_usd: totalUsd,
        transit_days: '2-3 суток'
      };

      if (apiUrl) {
        fetch(apiUrl + '/api/calculate/fleet', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ wagon_type: wType, count: wCount, rent_days: wDays, rent_type: rType })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d && d.documents_required) renderDocumentChecklist(d.documents_required);
        }).catch(function() {});
      }

    } else if (modality === 'road') {
      var rFrom = (document.getElementById('cr-road-from') ? document.getElementById('cr-road-from').value : 'Москва');
      var rTo = (document.getElementById('cr-road-to') ? document.getElementById('cr-road-to').value : 'Ташкент');
      var rType = (document.getElementById('cr-road-type') ? document.getElementById('cr-road-type').value : 'tent');
      var rWeight = parseFloat(document.getElementById('cr-road-weight') ? document.getElementById('cr-road-weight').value : 20) || 20;

      var tNames = {
        tent: 'Тент стандарт (86–92 м³, до 22 т)',
        mega: 'Сцепка Мега (110–120 м³, до 24 т)',
        reefer: 'Рефрижератор (-20°C / +20°C)',
        lowbed: 'Низкорамный трал (негабарит)'
      };
      var baseCost = (rType === 'reefer' ? 6200 : (rType === 'mega' ? 5600 : 4900));
      var totalRoad = baseCost + 250;

      if (routeEl) routeEl.textContent = rFrom + ' ➔ ' + rTo + ' (Международный автофрахт)';
      if (badgeTrans) badgeTrans.textContent = tNames[rType] || 'Еврофура';
      if (badgePark) badgePark.textContent = 'Автопарк Caravan Logistics (FTL)';
      if (badgeCargo) badgeCargo.textContent = 'Груз нетто: ' + rWeight + ' т';
      if (badgeInco) badgeInco.textContent = 'CMR / Доставка «До двери»';
      if (totalEl) totalEl.textContent = fmt(totalRoad) + ' USD';
      if (transitEl) transitEl.textContent = 'Срок автодоставки: 7–9 суток';
      if (tableTitle) tableTitle.textContent = 'Тарификация международной автоперевозки:';

      if (thead) {
        thead.innerHTML = '<tr><th>Наименование расхода</th><th>Маршрут / Параметры</th><th class="cr-text-right">Расстояние</th><th class="cr-text-right">Базис</th><th class="cr-text-right" colspan="4">Сумма</th></tr>';
      }
      tbody.innerHTML = '<tr><td>Международный автофрахт FTL (' + escapeHtml(rFrom) + ' ➔ ' + escapeHtml(rTo) + ')</td><td>' + (tNames[rType] || 'Автопоезд') + '</td><td class="cr-text-right">~3 400 км</td><td class="cr-text-right">FTL</td><td class="cr-text-right" colspan="4" style="color:var(--cr-amber); font-weight:700;">' + fmt(baseCost) + '</td></tr>' +
                        '<tr><td>Таможенный транзит, обеспечение книжки Carnet TIR и CMR</td><td>РФ / Казахстан / Узбекистан</td><td class="cr-text-right">Погранпереходы</td><td class="cr-text-right">Фикс</td><td class="cr-text-right" colspan="4">$250</td></tr>';

      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['road']);

      currentCalculatedQuote = {
        from: rFrom,
        to: rTo,
        transport: tNames[rType] || 'Автофура',
        park_type: 'Автопарк Caravan FTL',
        cargo_name: 'Автоперевозка FTL ' + rWeight + ' т',
        incoterms: 'DAP (До склада)',
        client_role: 'Грузоотправитель',
        total_price_usd: totalRoad,
        transit_days: '7-9 суток'
      };

      if (apiUrl) {
        fetch(apiUrl + '/api/calculate/road', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ from: rFrom, to: rTo, truck_type: rType, weight: rWeight })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d && d.documents_required) renderDocumentChecklist(d.documents_required);
        }).catch(function() {});
      }

    } else if (modality === 'air') {
      var aFrom = (document.getElementById('cr-air-from') ? document.getElementById('cr-air-from').value : 'CAN');
      var aWeight = parseFloat(document.getElementById('cr-air-weight') ? document.getElementById('cr-air-weight').value : 350) || 350;
      var aVol = parseFloat(document.getElementById('cr-air-volume') ? document.getElementById('cr-air-volume').value : 2.5) || 2.5;
      var chWeight = Math.max(aWeight, aVol * 167);
      var airCost = Math.round(chWeight * 3.85 + 120);

      var aNames = { CAN: 'Гуанчжоу (CAN)', PVG: 'Шанхай (PVG)', SVO: 'Москва (SVO)', IST: 'Стамбул (IST)', DXB: 'Дубай (DXB)', FRA: 'Франкфурт (FRA)' };

      if (routeEl) routeEl.textContent = (aNames[aFrom] || aFrom) + ' ➔ Ташкент (TAS) (Авиакарго)';
      if (badgeTrans) badgeTrans.textContent = 'Авиафрахт IATA Cargo';
      if (badgePark) badgePark.textContent = 'Регулярные грузовые рейсы';
      if (badgeCargo) badgeCargo.textContent = 'Вес: ' + aWeight + ' кг (Оплач.: ' + Math.round(chWeight) + ' кг)';
      if (badgeInco) badgeInco.textContent = 'CIP Аэропорт Ташкент (TAS)';
      if (totalEl) totalEl.textContent = fmt(airCost) + ' USD';
      if (transitEl) transitEl.textContent = 'Срок авиадоставки: 3–5 суток';
      if (tableTitle) tableTitle.textContent = 'Калькуляция авиаперевозки:';

      if (thead) {
        thead.innerHTML = '<tr><th>Элемент авиатарифа</th><th>Параметры</th><th class="cr-text-right">Вес / Объем</th><th class="cr-text-right">Тариф</th><th class="cr-text-right" colspan="4">Сумма</th></tr>';
      }
      tbody.innerHTML = '<tr><td>Авиафрахт карго (' + (aNames[aFrom] || aFrom) + ' ➔ TAS)</td><td>Плотность 1:167 (IATA)</td><td class="cr-text-right">' + Math.round(chWeight) + ' кг</td><td class="cr-text-right">$3.85/кг</td><td class="cr-text-right" colspan="4" style="color:var(--cr-amber); font-weight:700;">' + fmt(chWeight * 3.85) + '</td></tr>' +
                        '<tr><td>Терминальная обработка аэропорта назначения TAS и СВХ</td><td>Обработка и выпуск</td><td class="cr-text-right">1 партия</td><td class="cr-text-right">Фикс</td><td class="cr-text-right" colspan="4">$120</td></tr>';

      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['air']);

      currentCalculatedQuote = {
        from: (aNames[aFrom] || aFrom),
        to: 'Ташкент (TAS)',
        transport: 'Авиафрахт Карго',
        park_type: 'IATA Air Carrier',
        cargo_name: 'Авиагруз ' + Math.round(chWeight) + ' кг',
        incoterms: 'CIP Аэропорт Ташкент',
        client_role: 'Грузополучатель',
        total_price_usd: airCost,
        transit_days: '3-5 суток'
      };

      if (apiUrl) {
        fetch(apiUrl + '/api/calculate/air', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ from: aFrom, to: 'TAS', weight: aWeight, volume: aVol })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d && d.documents_required) renderDocumentChecklist(d.documents_required);
        }).catch(function() {});
      }

    } else if (modality === 'multimodal') {
      var mCorridor = (document.getElementById('cr-multi-corridor') ? document.getElementById('cr-multi-corridor').value : 'china_uzb');
      var mCount = parseInt(document.getElementById('cr-multi-count') ? document.getElementById('cr-multi-count').value : 1) || 1;
      var mCity = (document.getElementById('cr-multi-city') ? document.getElementById('cr-multi-city').value : 'Ташкент');
      var mTotal = 5400 * mCount;

      var cNames = {
        china_uzb: 'Китай (Нинбо/Шанхай) ➔ Алтынколь ➔ Ташкент',
        uae_uzb: 'ОАЭ (Джебель-Али) ➔ Бендер-Аббас ➔ Серахс ➔ Ташкент',
        turkey_uzb: 'Турция (Мерсин) ➔ Баку ➔ Актау ➔ Ташкент'
      };

      if (routeEl) routeEl.textContent = (cNames[mCorridor] || mCorridor);
      if (badgeTrans) badgeTrans.textContent = 'Контейнер 40\\' High Cube (' + mCount + ' ед.)';
      if (badgePark) badgePark.textContent = 'Мультимодальный сервис (Море + Ж/Д + Авто)';
      if (badgeCargo) badgeCargo.textContent = 'FCL контейнерная партия';
      if (badgeInco) badgeInco.textContent = 'Door-to-Door (' + mCity + ')';
      if (totalEl) totalEl.textContent = fmt(mTotal) + ' USD';
      if (transitEl) transitEl.textContent = 'Срок мультимодальной доставки: 16–20 суток';
      if (tableTitle) tableTitle.textContent = 'Поэтапный расчет мультимодальной перевозки:';

      if (thead) {
        thead.innerHTML = '<tr><th>Плечо перевозки</th><th>Вид транспорта / Операция</th><th class="cr-text-right">Кол-во</th><th class="cr-text-right">Ставка</th><th class="cr-text-right" colspan="4">Сумма</th></tr>';
      }
      tbody.innerHTML = '<tr><td>Морской фрахт + Перевалка THC в порту погрузки</td><td>Морской контейнеровоз</td><td class="cr-text-right">' + mCount + ' ед.</td><td class="cr-text-right">$1 450/ед</td><td class="cr-text-right" colspan="4">' + fmt(1450 * mCount) + '</td></tr>' +
                        '<tr><td>Ускоренный контейнерный поезд (Сухопутный переход ➔ станция назначения)</td><td>Ж/Д фитинговая платформа</td><td class="cr-text-right">' + mCount + ' ед.</td><td class="cr-text-right">$3 600/ед</td><td class="cr-text-right" colspan="4">' + fmt(3600 * mCount) + '</td></tr>' +
                        '<tr><td>Автодоставка «последней мили» контейнеровозом до склада</td><td>Автоконтейнеровоз (Door)</td><td class="cr-text-right">' + mCount + ' ед.</td><td class="cr-text-right">$350/ед</td><td class="cr-text-right" colspan="4" style="color:var(--cr-amber); font-weight:700;">' + fmt(350 * mCount) + '</td></tr>';

      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['multimodal']);

      currentCalculatedQuote = {
        from: (cNames[mCorridor] || mCorridor).split('➔')[0].trim(),
        to: mCity,
        transport: 'Контейнер 40HC (' + mCount + ' ед.)',
        park_type: 'Мультимодальный контейнерный парк',
        cargo_name: 'FCL Контейнерная партия',
        incoterms: 'Door-to-Door',
        client_role: 'Грузополучатель',
        total_price_usd: mTotal,
        transit_days: '16-20 суток'
      };

      if (apiUrl) {
        fetch(apiUrl + '/api/calculate/multimodal', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ corridor: mCorridor, count: mCount })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d && d.documents_required) renderDocumentChecklist(d.documents_required);
        }).catch(function() {});
      }

    } else if (modality === 'customs') {
      var cVal = parseFloat(document.getElementById('cr-customs-value') ? document.getElementById('cr-customs-value').value : 25000) || 25000;
      var cFreight = parseFloat(document.getElementById('cr-customs-freight') ? document.getElementById('cr-customs-freight').value : 2500) || 2500;
      var tnvedInput = document.getElementById('cr-customs-tnved') ? document.getElementById('cr-customs-tnved').value : '1001 99 000 0 — Пшеница твердая';
      var cTotalBase = cVal + cFreight;
      var cDuty = Math.round(cTotalBase * 0.05);
      var cVat = Math.round((cTotalBase + cDuty) * 0.12);
      var cFee = 65;
      var cTotalFiscal = cDuty + cVat + cFee;

      if (routeEl) routeEl.textContent = 'Таможенная очистка ВЭД: ' + escapeHtml(tnvedInput);
      if (badgeTrans) badgeTrans.textContent = 'Таможенный режим: Импорт 40';
      if (badgePark) badgePark.textContent = 'АИС Таможенный калькулятор';
      if (badgeCargo) badgeCargo.textContent = 'Таможенная стоимость (CIF): ' + fmt(cTotalBase);
      if (badgeInco) badgeInco.textContent = 'DDP («Под ключ» с таможней)';
      if (totalEl) totalEl.textContent = fmt(cTotalFiscal) + ' (~' + Math.round(cTotalFiscal * 12850).toLocaleString('ru-RU') + ' сум)';
      if (transitEl) transitEl.textContent = 'Срок выпуска таможенной декларации (ГТД): 1–2 рабочих дня';
      if (tableTitle) tableTitle.textContent = 'Расчет фискальных таможенных платежей в бюджет:';

      if (thead) {
        thead.innerHTML = '<tr><th>Вид таможенного платежа</th><th>База начисления (USD)</th><th class="cr-text-right">Ставка</th><th class="cr-text-right">Сумма в валюте</th><th class="cr-text-right" colspan="4">Сумма в национальной валюте</th></tr>';
      }
      tbody.innerHTML = '<tr><td>Ввозная таможенная пошлина (базовая ставка)</td><td>' + fmt(cTotalBase) + '</td><td class="cr-text-right">5.0%</td><td class="cr-text-right">' + fmt(cDuty) + '</td><td class="cr-text-right" colspan="4">' + Math.round(cDuty * 12850).toLocaleString('ru-RU') + ' сум</td></tr>' +
                        '<tr><td>Налог на добавленную стоимость (НДС 12% Узбекистан)</td><td>' + fmt(cTotalBase + cDuty) + '</td><td class="cr-text-right">12.0%</td><td class="cr-text-right">' + fmt(cVat) + '</td><td class="cr-text-right" colspan="4">' + Math.round(cVat * 12850).toLocaleString('ru-RU') + ' сум</td></tr>' +
                        '<tr><td>Сбор за таможенное оформление декларации (БРВ)</td><td>Таможенный сбор</td><td class="cr-text-right">Фикс</td><td class="cr-text-right">' + fmt(cFee) + '</td><td class="cr-text-right" colspan="4">' + Math.round(cFee * 12850).toLocaleString('ru-RU') + ' сум</td></tr>';

      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['customs']);

      currentCalculatedQuote = {
        from: 'Граница / Погранпереход',
        to: 'Таможенный пост назначения',
        transport: 'Таможенная декларация (ГТД)',
        park_type: 'АИС Таможенный калькулятор',
        cargo_name: tnvedInput,
        incoterms: 'DDP (Очищен для свободного обращения)',
        client_role: 'Декларант / Брокер',
        total_price_usd: cTotalFiscal,
        transit_days: '1-2 рабочих дня'
      };

      if (apiUrl) {
        fetch(apiUrl + '/api/calculate/customs', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ tnved: tnvedInput, value: cVal, freight: cFreight })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d && d.payments) {
            tbody.innerHTML = '<tr><td>Ввозная таможенная пошлина (' + d.duty_pct + '%)</td><td>' + fmt(d.customs_value_usd) + '</td><td class="cr-text-right">' + d.duty_pct + '%</td><td class="cr-text-right">' + fmt(d.payments.duty_usd) + '</td><td class="cr-text-right" colspan="4">' + Math.round(d.payments.duty_usd * 12850).toLocaleString('ru-RU') + ' сум</td></tr>' +
                              '<tr><td>Налог на добавленную стоимость (НДС ' + d.vat_pct + '%)</td><td>' + fmt(d.customs_value_usd + d.payments.duty_usd) + '</td><td class="cr-text-right">' + d.vat_pct + '%</td><td class="cr-text-right">' + fmt(d.payments.vat_usd) + '</td><td class="cr-text-right" colspan="4">' + Math.round(d.payments.vat_usd * 12850).toLocaleString('ru-RU') + ' сум</td></tr>' +
                              '<tr><td>Сбор за таможенное оформление декларации (БРВ)</td><td>Таможенный сбор</td><td class="cr-text-right">Фикс</td><td class="cr-text-right">' + fmt(d.payments.customs_fee_usd) + '</td><td class="cr-text-right" colspan="4">' + Math.round(d.payments.customs_fee_usd * 12850).toLocaleString('ru-RU') + ' сум</td></tr>';
            if (totalEl) totalEl.textContent = fmt(d.payments.total_usd) + ' (~' + Math.round(d.payments.total_usd * 12850).toLocaleString('ru-RU') + ' сум)';
          }
          if (d && d.documents_required) renderDocumentChecklist(d.documents_required);
        }).catch(function() {});
      }
    }
  }
"""

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('function handleNonRailCalculation(modality) {')
    end_idx = content.find('var lastSyncedRouteKey = \'\';', start_idx)
    if start_idx == -1 or end_idx == -1:
        print(f"Error: Could not locate handleNonRailCalculation in {filename}")
        return False

    content = content[:start_idx] + NEW_HANDLER.strip() + '\n\n  ' + content[end_idx:]
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[OK] Successfully replaced handleNonRailCalculation in {filename}")
    return True

if __name__ == '__main__':
    update_file('caravan-tracking-widget.html')
    update_file('index.html')
    import build_widget_bundle
    build_widget_bundle.build()
    print("[OK] Rebuilt bundle successfully!")
