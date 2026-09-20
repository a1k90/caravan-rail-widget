with open('caravan-tracking-widget.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('function setupCalculator()')
end_pos = html.find('function setupBookingModal()', pos)

new_calc_js = """function setupCalculator() {
    var modePresetBtn = document.getElementById('cr-btn-mode-preset');
    var modeCustomBtn = document.getElementById('cr-btn-mode-custom');
    var presetView = document.getElementById('cr-calc-preset-view');
    var customView = document.getElementById('cr-calc-custom-view');

    if (modePresetBtn && modeCustomBtn) {
      modePresetBtn.addEventListener('click', function() {
        modePresetBtn.classList.add('active');
        modeCustomBtn.classList.remove('active');
        presetView.style.display = 'block';
        customView.style.display = 'none';
      });

      modeCustomBtn.addEventListener('click', function() {
        modeCustomBtn.classList.add('active');
        modePresetBtn.classList.remove('active');
        customView.style.display = 'block';
        presetView.style.display = 'none';
        triggerCustomCalculation();
      });
    }

    renderPresetRoutes(DEMO_DATABASE.routes);

    // Роли в договоре
    var rolePills = document.querySelectorAll('#caravan-tracking-root .cr-role-pill');
    rolePills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        rolePills.forEach(function(p) { p.classList.remove('active'); });
        this.classList.add('active');
        var radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        triggerCustomCalculation();
      });
    });

    // Автодополнение станций
    setupStationAutocomplete('cr-calc-from', 'cr-calc-from-dropdown');
    setupStationAutocomplete('cr-calc-to', 'cr-calc-to-dropdown');

    // Переключатель валют
    var curPills = document.querySelectorAll('#caravan-tracking-root .cr-cur-pill');
    curPills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        curPills.forEach(function(p) { p.classList.remove('active'); });
        this.classList.add('active');
        selectedCurrency = this.getAttribute('data-cur') || 'USD';
        triggerCustomCalculation();
      });
    });

    // Слушатели полей расчета
    var calcInputs = [
      'cr-calc-from', 'cr-calc-to', 'cr-calc-border', 'cr-calc-km', 
      'cr-calc-transport', 'cr-calc-park', 'cr-calc-cargo', 'cr-calc-weight',
      'cr-calc-freight-type', 'cr-calc-incoterms', 'cr-opt-security', 'cr-opt-customs'
    ];
    calcInputs.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', triggerCustomCalculation);
        el.addEventListener('change', triggerCustomCalculation);
      }
    });

    var kmChips = document.querySelectorAll('#caravan-tracking-root .cr-km-chip');
    kmChips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        var km = this.getAttribute('data-km');
        var kmInput = document.getElementById('cr-calc-km');
        if (kmInput) {
          kmInput.value = km;
          triggerCustomCalculation();
        }
      });
    });

    // Кнопка печати
    var printBtn = document.getElementById('cr-btn-print-quote');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        window.print();
      });
    }

    setupBookingModal();
    // Первоначальный расчет
    setTimeout(triggerCustomCalculation, 150);
  }

  var selectedCurrency = 'USD';

  function setupStationAutocomplete(inputId, dropdownId) {
    var input = document.getElementById(inputId);
    var dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    input.addEventListener('input', function() {
      var val = this.value.trim();
      if (val.length < 2) {
        dropdown.style.display = 'none';
        return;
      }
      var matches = CaravanRailwayEngine.searchStations(val, 10);
      if (!matches || matches.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      var html = '';
      matches.forEach(function(st) {
        var borderBadge = st.is_border ? '<span class=\"cr-st-badge-border\">СТЫК</span>' : '';
        html += '<div class=\"cr-station-item\" data-code=\"' + st.code + '\" data-name=\"' + escapeHtml(st.name) + '\" data-road=\"' + escapeHtml(st.road_label) + '\" data-land=\"' + escapeHtml(st.country_name) + '\">' +
          '<div class=\"cr-st-left\">' +
            '<span class=\"cr-st-code\">' + st.code + '</span>' +
            '<span class=\"cr-st-name\">' + escapeHtml(st.name) + '</span>' +
          '</div>' +
          '<div class=\"cr-st-badges\">' +
            '<span class=\"cr-st-badge-road\">' + escapeHtml(st.road_label) + '</span>' +
            borderBadge +
          '</div>' +
        '</div>';
      });

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      var items = dropdown.querySelectorAll('.cr-station-item');
      items.forEach(function(item) {
        item.addEventListener('click', function() {
          var sName = this.getAttribute('data-name');
          var sCode = this.getAttribute('data-code');
          var sRoad = this.getAttribute('data-road');
          input.value = sName + ' (' + sCode + ', ' + sRoad + ')';
          dropdown.style.display = 'none';
          triggerCustomCalculation();
        });
      });
    });

    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  function renderPresetRoutes(routes) {
    var container = document.getElementById('cr-preset-routes-container');
    if (!container) return;

    var html = '';
    routes.forEach(function(r, idx) {
      var selectedClass = idx === 0 ? 'selected' : '';
      html += '' +
        '<div class=\"cr-preset-route-card ' + selectedClass + '\" data-route-id=\"' + r.id + '\">' +
          '<div class=\"cr-pr-top\">' +
            '<span>' + escapeHtml(r.from) + '</span>' +
            '<span class=\"cr-pr-arrow\">➔</span>' +
            '<span>' + escapeHtml(r.to) + '</span>' +
          '</div>' +
          '<div class=\"cr-pr-info\">' +
            'ПС: <strong>' + escapeHtml(r.transport) + '</strong> • Базис: <strong>' + escapeHtml(r.incoterms) + '</strong>' +
          '</div>' +
          '<div class=\"cr-pr-bottom\">' +
            '<div class=\"cr-pr-price\">$' + r.price_usd.toLocaleString('ru-RU') + ' USD</div>' +
            '<div class=\"cr-pr-days\">Срок: ' + escapeHtml(r.transit_days) + '</div>' +
          '</div>' +
        '</div>';
    });
    container.innerHTML = html;

    if (routes.length > 0) selectPresetRoute(routes[0]);

    var cards = container.querySelectorAll('.cr-preset-route-card');
    cards.forEach(function(card, index) {
      card.addEventListener('click', function() {
        cards.forEach(function(c) { c.classList.remove('selected'); });
        this.classList.add('selected');
        selectPresetRoute(routes[index]);
      });
    });
  }

  function selectPresetRoute(r) {
    var discount = currentUser ? (currentUser.discount || 0) : 0;
    var price = r.price_usd;
    if (discount > 0) price = Math.round(price * (1 - discount / 100));

    currentCalculatedQuote = {
      from: r.from,
      to: r.to,
      transport: r.transport,
      distance_km: r.distance_km,
      incoterms: r.incoterms,
      client_role: currentUser ? currentUser.role : 'Грузоотправитель',
      total_price_usd: price,
      transit_days: r.transit_days,
      breakdown: r.breakdown || {
        rail: Math.round(price * 0.65),
        wagon: Math.round(price * 0.2),
        incoterms: Math.round(price * 0.1),
        extra: Math.round(price * 0.05)
      }
    };

    updateQuoteDisplay(currentCalculatedQuote, discount);
  }

  function triggerCustomCalculation() {
    var fromVal = (document.getElementById('cr-calc-from') ? document.getElementById('cr-calc-from').value : '') || 'Кокшетау';
    var toVal = (document.getElementById('cr-calc-to') ? document.getElementById('cr-calc-to').value : '') || 'Ташкент-Товарный';
    var borderSelect = document.getElementById('cr-calc-border');
    var manualBorderCode = (borderSelect && borderSelect.value !== 'auto') ? borderSelect.value : null;

    var transportCode = document.getElementById('cr-calc-transport') ? document.getElementById('cr-calc-transport').value : 'grain';
    var parkType = document.getElementById('cr-calc-park') ? document.getElementById('cr-calc-park').value : 'caravan';
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

    // Вызываем расчетное ядро R-Тариф
    var calcResult = CaravanRailwayEngine.calculateTariff({
      from: fromVal,
      to: toVal,
      manualBorderCode: manualBorderCode,
      wagonType: transportCode,
      parkType: parkType,
      cargoType: cargoCode,
      weightTons: weightVal,
      incoterms: incoterms,
      freightType: freightType,
      security: hasSec,
      customs: hasCust,
      clientRole: roleLabel,
      discount: discount,
      currency: selectedCurrency
    });

    // Обновляем отображение расстояния в инпуте если не редактировалось вручную
    var kmInput = document.getElementById('cr-calc-km');
    if (kmInput && (!document.activeElement || document.activeElement.id !== 'cr-calc-km')) {
      kmInput.value = calcResult.route.totalDistanceKm;
    }

    // Обновляем визуальную схему маршрута
    var rsBadge = document.getElementById('cr-rs-badge');
    if (rsBadge) rsBadge.textContent = calcResult.route.messageType;

    var rsDist = document.getElementById('cr-rs-distance');
    if (rsDist) rsDist.textContent = 'Общий путь: ' + calcResult.route.totalDistanceKm.toLocaleString('ru-RU') + ' км';

    var fromNameEl = document.getElementById('cr-rs-from-name');
    if (fromNameEl) fromNameEl.textContent = 'ст. ' + calcResult.route.from.name + ' (' + calcResult.route.from.code + ')';
    var fromSubEl = document.getElementById('cr-rs-from-sub');
    if (fromSubEl) fromSubEl.textContent = calcResult.route.from.country_name + ' (' + calcResult.route.from.road_label + ')';

    var toNameEl = document.getElementById('cr-rs-to-name');
    if (toNameEl) toNameEl.textContent = 'ст. ' + calcResult.route.to.name + ' (' + calcResult.route.to.code + ')';
    var toSubEl = document.getElementById('cr-rs-to-sub');
    if (toSubEl) toSubEl.textContent = calcResult.route.to.country_name + ' (' + calcResult.route.to.road_label + ')';

    var borderBox = document.getElementById('cr-rs-border-name');
    var borderStep = borderBox ? borderBox.closest('.cr-rs-step') : null;
    var line1 = document.getElementById('cr-rs-line-1');
    var line2 = document.getElementById('cr-rs-line-2');

    if (calcResult.route.borderCrossing && calcResult.route.legs.length >= 2) {
      if (borderStep) borderStep.style.display = 'flex';
      if (line2) line2.closest('.cr-rs-line').style.display = 'block';
      if (borderBox) borderBox.textContent = calcResult.route.borderCrossing.name.split('/')[0];
      if (line1) line1.textContent = calcResult.route.legs[0].road + ': ' + calcResult.route.legs[0].distanceKm + ' км';
      if (line2) line2.textContent = calcResult.route.legs[1].road + ': ' + calcResult.route.legs[1].distanceKm + ' км';
    } else {
      if (borderStep) borderStep.style.display = 'none';
      if (line2) line2.closest('.cr-rs-line').style.display = 'none';
      if (line1) line1.textContent = calcResult.route.legs[0].road + ': ' + calcResult.route.totalDistanceKm + ' км';
    }

    // Обновляем баннер Incoterms
    var descObj = INCOTERMS_DESC[incoterms] || INCOTERMS_DESC['DAP'];
    var ibTitle = document.getElementById('cr-ib-title');
    var ibDesc = document.getElementById('cr-ib-desc');
    if (ibTitle) ibTitle.textContent = descObj.title;
    if (ibDesc) ibDesc.textContent = descObj.desc;

    // Рендерим таблицу R-Тариф
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

  function renderRTariffTable(res) {
    var tbody = document.getElementById('cr-rtariff-tbody');
    if (!tbody) return;

    var cur = CaravanRailwayEngine.CURRENCY_RATES[selectedCurrency] || CaravanRailwayEngine.CURRENCY_RATES['USD'];
    var rate = cur.rate;
    var sym = cur.symbol;

    function fmt(usdVal) {
      var converted = Math.round(usdVal * rate);
      return converted.toLocaleString('ru-RU') + ' ' + sym;
    }

    var rowsHtml = '';
    var totalInfra = 0;
    var totalWagon = 0;
    var totalBorder = 0;
    var totalSec = 0;
    var totalSum = 0;

    res.route.legs.forEach(function(leg) {
      totalInfra += leg.infraTariffUSD;
      totalWagon += leg.wagonTariffUSD;
      totalBorder += leg.borderFeeUSD;
      totalSec += leg.securityUSD;
      totalSum += leg.subtotalUSD;

      rowsHtml += '<tr>' +
        '<td><strong>' + escapeHtml(leg.countryName) + '</strong> (' + escapeHtml(leg.road) + ')</td>' +
        '<td>' + escapeHtml(leg.from) + ' ➔ ' + escapeHtml(leg.to) + '</td>' +
        '<td class=\"cr-text-right\">' + leg.distanceKm.toLocaleString('ru-RU') + '</td>' +
        '<td class=\"cr-text-right\">' + fmt(leg.infraTariffUSD) + '</td>' +
        '<td class=\"cr-text-right\">' + fmt(leg.wagonTariffUSD) + '</td>' +
        '<td class=\"cr-text-right\">' + fmt(leg.borderFeeUSD) + '</td>' +
        '<td class=\"cr-text-right\">' + fmt(leg.securityUSD) + '</td>' +
        '<td class=\"cr-text-right\"><strong>' + fmt(leg.subtotalUSD) + '</strong></td>' +
      '</tr>';
    });

    // Строка доп. услуг по Incoterms и оформлению СМГС
    var extraUSD = (res.breakdownUSD.documentationAndIncoterms || 0) + (res.breakdownUSD.customsService || 0);
    if (extraUSD > 0) {
      totalSum += extraUSD;
      rowsHtml += '<tr>' +
        '<td><strong>Сервис Caravan</strong></td>' +
        '<td>Оформление СМГС/ГУ-27 + доставка по Incoterms (' + res.incoterms + ')</td>' +
        '<td class=\"cr-text-right\">—</td>' +
        '<td class=\"cr-text-right\">—</td>' +
        '<td class=\"cr-text-right\">—</td>' +
        '<td class=\"cr-text-right\">' + fmt(extraUSD) + '</td>' +
        '<td class=\"cr-text-right\">—</td>' +
        '<td class=\"cr-text-right\"><strong>' + fmt(extraUSD) + '</strong></td>' +
      '</tr>';
    }

    // ИТОГОВАЯ СТРОКА
    rowsHtml += '<tr class=\"total-row\">' +
      '<td><strong>ИТОГО (ВСЕГО)</strong></td>' +
      '<td>' + res.route.totalDistanceKm.toLocaleString('ru-RU') + ' км (' + res.transitDays + ')</td>' +
      '<td class=\"cr-text-right\">' + res.route.totalDistanceKm.toLocaleString('ru-RU') + '</td>' +
      '<td class=\"cr-text-right\">' + fmt(totalInfra) + '</td>' +
      '<td class=\"cr-text-right\">' + fmt(totalWagon) + '</td>' +
      '<td class=\"cr-text-right\">' + fmt(totalBorder + extraUSD) + '</td>' +
      '<td class=\"cr-text-right\">' + fmt(totalSec) + '</td>' +
      '<td class=\"cr-text-right\" style=\"font-size: 15px; color: #F59E0B;\">' + fmt(res.totals.usd) + '</td>' +
    '</tr>';

    tbody.innerHTML = rowsHtml;
  }

  function updateQuoteDisplay(q, discount) {
    var routeEl = document.getElementById('cr-quote-route-title');
    if (routeEl) routeEl.textContent = q.from + ' ➔ ' + q.to;

    var badgeTrans = document.getElementById('cr-qb-transport');
    if (badgeTrans) badgeTrans.textContent = q.transport;
    var badgePark = document.getElementById('cr-qb-park');
    if (badgePark) badgePark.textContent = q.park_type || 'Собственный парк СПС (Caravan)';
    var badgeCargo = document.getElementById('cr-qb-cargo');
    if (badgeCargo) badgeCargo.textContent = q.cargo_name || 'Груз 2 класс';
    var badgeInco = document.getElementById('cr-qb-incoterms');
    if (badgeInco) badgeInco.textContent = q.incoterms + ' (' + q.client_role + ')';

    var totalEl = document.getElementById('cr-quote-total-price');
    if (totalEl) totalEl.textContent = q.converted_total || ('$' + q.total_price_usd.toLocaleString('ru-RU') + ' USD');

    var transitEl = document.getElementById('cr-quote-transit-days');
    if (transitEl) transitEl.textContent = 'Нормативный срок доставки: ' + q.transit_days;

    var discountPill = document.getElementById('cr-client-discount-pill');
    if (discountPill) {
      if (discount > 0) {
        var discVal = document.getElementById('cr-client-discount-val');
        if (discVal) discVal.textContent = discount + '%';
        discountPill.style.display = 'block';
      } else {
        discountPill.style.display = 'none';
      }
    }
  }
"""

html = html[:pos] + new_calc_js + '\n  ' + html[end_pos:]

with open('caravan-tracking-widget.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated calculator JS functions successfully! Total file length:', len(html))
