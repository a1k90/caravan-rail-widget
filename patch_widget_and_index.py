#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Patch caravan-tracking-widget.html and index.html to support:
1. Updated CaravanRailwayEngine with full transit routing (RUS -> KAZ [transit] -> UZB)
2. Dual border crossing selectors (Стык 1: РЖД/КТЖ and Стык 2: КТЖ/УТИ)
3. Dynamic route scheme rendering (4 nodes, 3 legs for transit; 3 nodes, 2 legs for bilateral)
4. Dynamic synchronization of distances, tariffs, and route schemes
"""

import re
import os

with open('railway_calc_engine.js', 'r', encoding='utf-8') as f:
    engine_code = f.read().strip()

# DUAL BORDER SELECTOR HTML
BORDER_HTML_REPLACEMENT = """<!-- ПОГРАНПЕРЕХОДЫ / СТЫКИ -->
            <div id="cr-border-selection-container" style="grid-column: 1 / -1;">
              <!-- Одиночный стык (двустороннее сообщение) -->
              <div id="cr-border-single-wrap" class="cr-form-field" style="margin-bottom: 0;">
                <label id="cr-border-single-label">Межгосударственный стыковой пункт</label>
                <div class="cr-input-wrapper">
                  <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <select id="cr-calc-border" class="cr-select">
                    <option value="auto" selected>Определять автоматически по плану формирования</option>
                    <option value="704101">Сарыагаш (эксп.) [КТЖ] / Келес [УТИ] (Казахстан — Узбекистан)</option>
                    <option value="708507">Достык (эксп.) [КТЖ] / Алашанькоу (Китай — Казахстан)</option>
                    <option value="707701">Алтынколь (эксп.) [КТЖ] / Хоргос (Китай — Казахстан)</option>
                    <option value="666501">Илецк I (эксп.) [Ю-Ур / КТЖ] (Россия — Казахстан)</option>
                    <option value="664900">Озинки (эксп.) [Прив / КТЖ] (Россия — Казахстан)</option>
                    <option value="816909">Карталы I (эксп.) [Ю-Ур / КТЖ] (Россия — Казахстан)</option>
                    <option value="815502">Орск (эксп.) [Ю-Ур / КТЖ] (Россия — Казахстан)</option>
                    <option value="711105">Локоть (эксп.) [З-Сиб / КТЖ] (Россия — Казахстан)</option>
                    <option value="688708">Петропавловск (эксп.) [Ю-Ур / КТЖ] (Россия — Казахстан)</option>
                    <option value="843905">Кулунда (эксп.) [З-Сиб / КТЖ] (Россия — Казахстан)</option>
                    <option value="662905">Бейнеу (эксп.) / Каракалпакстан (Мангышлак — Узбекистан)</option>
                    <option value="734606">Галаба (эксп.) [УТИ] / Хайратан (Узбекистан — Афганистан)</option>
                    <option value="736501">Ходжадавлет (эксп.) [УТИ] / Фарап (Узбекистан — Туркменистан)</option>
                    <option value="736003">Кудукли (эксп.) [УТИ] / Пахтаабад (Узбекистан — Таджикистан)</option>
                  </select>
                </div>
              </div>

              <!-- Двойной стык (транзитное сообщение: Россия -> Казахстан [Транзит] -> Узбекистан) -->
              <div id="cr-border-dual-wrap" class="cr-dual-borders-grid" style="display: none;">
                <div class="cr-form-field" style="margin-bottom: 0;">
                  <label id="cr-border-1-label">Стык 1: РЖД ⇄ КТЖ (Вход в транзит)</label>
                  <div class="cr-input-wrapper">
                    <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <select id="cr-calc-border-1" class="cr-select">
                      <option value="auto">Определять автоматически (Оптимальный)</option>
                      <option value="666501">ст. Илецк I (эксп.) [Ю-Ур / КТЖ]</option>
                      <option value="664900">ст. Озинки (эксп.) [Прив / КТЖ]</option>
                      <option value="816909">ст. Карталы I (эксп.) [Ю-Ур / КТЖ]</option>
                      <option value="815502">ст. Орск (эксп.) [Ю-Ур / КТЖ]</option>
                      <option value="688708">ст. Петропавловск (эксп.) [Ю-Ур / КТЖ]</option>
                      <option value="711105">ст. Локоть (эксп.) [З-Сиб / КТЖ]</option>
                      <option value="843905">ст. Кулунда (эксп.) [З-Сиб / КТЖ]</option>
                    </select>
                  </div>
                </div>
                <div class="cr-form-field" style="margin-bottom: 0;">
                  <label id="cr-border-2-label">Стык 2: КТЖ ⇄ УТИ (Выход из транзита)</label>
                  <div class="cr-input-wrapper">
                    <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <select id="cr-calc-border-2" class="cr-select">
                      <option value="auto">Определять автоматически (Оптимальный)</option>
                      <option value="704101">ст. Сарыагаш (эксп.) [КТЖ] / Келес [УТИ]</option>
                      <option value="662905">ст. Бейнеу (эксп.) [КТЖ] / Каракалпакстан [УТИ]</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>"""

CSS_DUAL_BORDERS = """
  .cr-dual-borders-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    width: 100%;
  }
  @media (max-width: 768px) {
    .cr-dual-borders-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
"""

JS_HELPERS_AND_CALC = """
  var lastSyncedRouteKey = '';

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
          var b1Html = '<option value="auto">Определять автоматически (Оптимальный)</option>';
          route.availBorders1.forEach(function(b) {
            b1Html += '<option value="' + b.code + '">' + escapeHtml(b.name) + '</option>';
          });
          b1Select.innerHTML = b1Html;
          if (b1Current && b1Current !== 'auto' && route.availBorders1.some(function(b) { return b.code === b1Current; })) {
            b1Select.value = b1Current;
          }
        }
        if (b2Select) {
          var b2Current = b2Select.value;
          var b2Html = '<option value="auto">Определять автоматически (Оптимальный)</option>';
          route.availBorders2.forEach(function(b) {
            b2Html += '<option value="' + b.code + '">' + escapeHtml(b.name) + '</option>';
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
          var sHtml = '<option value="auto">Определять автоматически по плану формирования</option>';
          route.availBorders.forEach(function(b) {
            sHtml += '<option value="' + b.code + '">' + escapeHtml(b.name) + '</option>';
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
    return name.split('/')[0].replace(/\[.*?\]/g, '').trim();
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

      html += '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot origin"></span>' +
        '<div>' +
          '<div class="cr-rs-name">ст. ' + escapeHtml(route.from.name) + ' (' + escapeHtml(route.from.code) + ')</div>' +
          '<div class="cr-rs-sub">' + escapeHtml(leg1.countryName) + ' (' + escapeHtml(leg1.road) + ')</div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-rs-line">' +
        '<span class="cr-rs-line-info">' + escapeHtml(leg1.road) + ': ' + leg1.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot border"></span>' +
        '<div>' +
          '<div class="cr-rs-name">' + escapeHtml(b1Name) + '</div>' +
          '<div class="cr-rs-sub">Стык 1 (РЖД / КТЖ)</div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-rs-line">' +
        '<span class="cr-rs-line-info">' + escapeHtml(leg2.road) + ': ' + leg2.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot border"></span>' +
        '<div>' +
          '<div class="cr-rs-name">' + escapeHtml(b2Name) + '</div>' +
          '<div class="cr-rs-sub">Стык 2 (КТЖ / УТИ)</div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-rs-line">' +
        '<span class="cr-rs-line-info">' + escapeHtml(leg3.road) + ': ' + leg3.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot dest"></span>' +
        '<div>' +
          '<div class="cr-rs-name">ст. ' + escapeHtml(route.to.name) + ' (' + escapeHtml(route.to.code) + ')</div>' +
          '<div class="cr-rs-sub">' + escapeHtml(leg3.countryName) + ' (' + escapeHtml(leg3.road) + ')</div>' +
        '</div>' +
      '</div>';
    } else if (route.legs && route.legs.length >= 2) {
      var l1 = route.legs[0];
      var l2 = route.legs[1];
      var bName = route.borderCrossing ? formatBorderSchemeName(route.borderCrossing.name) : l1.to;

      html += '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot origin"></span>' +
        '<div>' +
          '<div class="cr-rs-name">ст. ' + escapeHtml(route.from.name) + ' (' + escapeHtml(route.from.code) + ')</div>' +
          '<div class="cr-rs-sub">' + escapeHtml(l1.countryName) + ' (' + escapeHtml(l1.road) + ')</div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-rs-line">' +
        '<span class="cr-rs-line-info">' + escapeHtml(l1.road) + ': ' + l1.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot border"></span>' +
        '<div>' +
          '<div class="cr-rs-name">' + escapeHtml(bName) + '</div>' +
          '<div class="cr-rs-sub">Межгосударственный стыковой пункт</div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-rs-line">' +
        '<span class="cr-rs-line-info">' + escapeHtml(l2.road) + ': ' + l2.distanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot dest"></span>' +
        '<div>' +
          '<div class="cr-rs-name">ст. ' + escapeHtml(route.to.name) + ' (' + escapeHtml(route.to.code) + ')</div>' +
          '<div class="cr-rs-sub">' + escapeHtml(l2.countryName) + ' (' + escapeHtml(l2.road) + ')</div>' +
        '</div>' +
      '</div>';
    } else {
      var domLeg = (route.legs && route.legs[0]) ? route.legs[0] : null;
      var domRoad = domLeg ? domLeg.road : (route.from.road_label || 'Ж/Д');
      var domCountry = domLeg ? domLeg.countryName : (route.from.country_name || '');

      html += '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot origin"></span>' +
        '<div>' +
          '<div class="cr-rs-name">ст. ' + escapeHtml(route.from.name) + ' (' + escapeHtml(route.from.code) + ')</div>' +
          '<div class="cr-rs-sub">' + escapeHtml(domCountry) + ' (' + escapeHtml(domRoad) + ')</div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-rs-line">' +
        '<span class="cr-rs-line-info">' + escapeHtml(domRoad) + ': ' + route.totalDistanceKm.toLocaleString('ru-RU') + ' км</span>' +
      '</div>' +
      '<div class="cr-rs-step">' +
        '<span class="cr-rs-dot dest"></span>' +
        '<div>' +
          '<div class="cr-rs-name">ст. ' + escapeHtml(route.to.name) + ' (' + escapeHtml(route.to.code) + ')</div>' +
          '<div class="cr-rs-sub">' + escapeHtml(domCountry) + ' (' + escapeHtml(domRoad) + ')</div>' +
        '</div>' +
      '</div>';
    }

    flowEl.innerHTML = html;
  }

  function triggerCustomCalculation() {
    var fromVal = (document.getElementById('cr-calc-from') ? document.getElementById('cr-calc-from').value : '') || 'Кокшетау';
    var toVal = (document.getElementById('cr-calc-to') ? document.getElementById('cr-calc-to').value : '') || 'Ташкент-Товарный';
    
    var borderSelect = document.getElementById('cr-calc-border');
    var b1Select = document.getElementById('cr-calc-border-1');
    var b2Select = document.getElementById('cr-calc-border-2');

    var manualBorderCode = (borderSelect && borderSelect.value !== 'auto') ? borderSelect.value : null;
    var manualBorder1 = (b1Select && b1Select.value !== 'auto') ? b1Select.value : null;
    var manualBorder2 = (b2Select && b2Select.value !== 'auto') ? b2Select.value : null;

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

    var roleInput = document.querySelector('input[name="cr_client_role"]:checked');
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
  }
"""

def patch_file(filepath):
    print(f"Patching {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace border HTML
    old_border_pattern = r'<!-- ПОГРАНПЕРЕХОД.*?</div>\s*</div>\s*(?=<!-- РАССТОЯНИЕ)'
    match = re.search(old_border_pattern, content, re.DOTALL)
    if not match:
        print(f"  [ERROR] Border HTML block not found in {filepath}!")
        return False
    
    content = content[:match.start()] + BORDER_HTML_REPLACEMENT + '\n\n            ' + content[match.end():]
    print(f"  [OK] Replaced border HTML block")

    # 2. Add CSS if not present
    if '.cr-dual-borders-grid' not in content:
        insert_css_pos = content.find('.cr-select {')
        if insert_css_pos != -1:
            content = content[:insert_css_pos] + CSS_DUAL_BORDERS.strip() + '\n\n  ' + content[insert_css_pos:]
            print(f"  [OK] Injected .cr-dual-borders-grid CSS")
        else:
            print(f"  [WARN] .cr-select not found for CSS injection")

    # 3. Replace CaravanRailwayEngine block
    engine_start = content.find('var CaravanRailwayEngine =')
    engine_end = content.find('(function() {\n  var CARAVAN_CONFIG = {')
    if engine_start != -1 and engine_end != -1:
        # Check if there is comment header before var CaravanRailwayEngine
        comment_start = content.rfind('/**', 0, engine_start)
        replace_start = comment_start if comment_start != -1 and (engine_start - comment_start < 500) else engine_start
        content = content[:replace_start] + engine_code + '\n\n' + content[engine_end:]
        print(f"  [OK] Replaced CaravanRailwayEngine code block")
    else:
        print(f"  [ERROR] Engine block markers not found in {filepath}!")
        return False

    # 4. Add cr-calc-border-1 and cr-calc-border-2 to calcInputs
    old_calc_inputs = "'cr-calc-from', 'cr-calc-to', 'cr-calc-border', 'cr-calc-km',"
    new_calc_inputs = "'cr-calc-from', 'cr-calc-to', 'cr-calc-border', 'cr-calc-border-1', 'cr-calc-border-2', 'cr-calc-km',"
    if old_calc_inputs in content:
        content = content.replace(old_calc_inputs, new_calc_inputs, 1)
        print(f"  [OK] Updated calcInputs array with border-1 and border-2")

    # 5. Replace triggerCustomCalculation with JS_HELPERS_AND_CALC
    calc_func_start = content.find('function triggerCustomCalculation() {')
    calc_func_end = content.find('function renderRTariffTable(res) {')
    if calc_func_start != -1 and calc_func_end != -1:
        content = content[:calc_func_start] + JS_HELPERS_AND_CALC.strip() + '\n\n  ' + content[calc_func_end:]
        print(f"  [OK] Replaced triggerCustomCalculation and added syncBorderDropdowns & renderRouteScheme")
    else:
        print(f"  [ERROR] triggerCustomCalculation block not found in {filepath}!")
        return False

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Successfully patched {filepath}!")
    return True

if __name__ == '__main__':
    p1 = patch_file('caravan-tracking-widget.html')
    p2 = patch_file('index.html')
    if p1 and p2:
        print("Both files patched successfully! Rebuilding bundle...")
        import build_widget_bundle
        build_widget_bundle.build()
        print("Bundle build finished!")
    else:
        print("Patching failed!")
