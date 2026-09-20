#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Patch Caravan Tracking Widget with API integration, all-station search,
and intermediate stations route sheet (R-Tariff parity).
"""

import re
import subprocess

def patch():
    with open('caravan-tracking-widget.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add CSS for intermediate stations if not present
    css_to_add = """
  /* Станции следования по ТР-4 (Маршрутный лист) */
  .cr-inter-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 215, 0, 0.18);
    border-radius: 4px;
    font-size: 11px;
    color: #e2e8f0;
  }
  .cr-inter-badge.origin {
    border-color: #10b981;
    color: #34d399;
    font-weight: 600;
  }
  .cr-inter-badge.border {
    border-color: #f59e0b;
    color: #fbbf24;
    font-weight: 600;
  }
  .cr-inter-badge.dest {
    border-color: #ef4444;
    color: #f87171;
    font-weight: 600;
  }
  .cr-inter-arrow {
    color: rgba(255, 255, 255, 0.4);
    font-size: 9px;
    margin: 0 2px;
  }
"""
    if '.cr-inter-badge' not in html:
        html = html.replace('</style>', css_to_add + '\n</style>', 1)

    # 2. Add intermediate stations container after cr-rs-flow
    target_flow = '<div class="cr-rs-flow" id="cr-rs-flow">'
    # find closing div for cr-rs-flow
    flow_idx = html.find(target_flow)
    if flow_idx != -1:
        # Find closing tag of cr-route-scheme-card
        scheme_card_end = html.find('</div>\n          </div>\n\n          <!-- BANNER INCOTERMS', flow_idx)
        if scheme_card_end != -1 and 'id="cr-intermediate-stations-wrap"' not in html:
            stations_container = """
            <!-- МАРШРУТНЫЙ ЛИСТ СО ВСЕМИ СТАНЦИЯМИ (Р-ТАРИФ) -->
            <div class="cr-intermediate-stations-wrap" id="cr-intermediate-stations-wrap" style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.12); display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--cr-gold);">
                  <i class="fas fa-route" style="margin-right: 5px;"></i> Станции следования по маршруту (ТР-4 / Р-Тариф)
                </span>
                <span style="font-size: 10px; color: var(--cr-text-muted);" id="cr-intermediate-count"></span>
              </div>
              <div class="cr-intermediate-badges" id="cr-intermediate-badges" style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;"></div>
            </div>
"""
            html = html[:scheme_card_end] + stations_container + html[scheme_card_end:]

    # 3. Add getCaravanApiUrl and renderIntermediateStations functions in JS
    js_helpers = """
  // Caravan Rail Engine API Helper
  function getCaravanApiUrl() {
    if (window.CARAVAN_API_URL) return window.CARAVAN_API_URL.replace(/\\/$/, '');
    if (typeof location !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      return 'http://localhost:8090';
    }
    return null;
  }

  function renderIntermediateStations(stations) {
    var wrap = document.getElementById('cr-intermediate-stations-wrap');
    var badgesEl = document.getElementById('cr-intermediate-badges');
    var countEl = document.getElementById('cr-intermediate-count');
    if (!wrap || !badgesEl) return;

    if (!stations || stations.length === 0) {
      wrap.style.display = 'none';
      return;
    }

    var html = '';
    for (var i = 0; i < stations.length; i++) {
      var stName = stations[i];
      var cls = 'cr-inter-badge';
      if (i === 0) cls += ' origin';
      else if (i === stations.length - 1) cls += ' dest';
      else if (stName.indexOf('стык') !== -1 || stName.indexOf('эксп') !== -1 || stName.indexOf('Сарыагаш') !== -1 || stName.indexOf('Илецк') !== -1 || stName.indexOf('Келес') !== -1) {
        cls += ' border';
      }

      html += '<span class="' + cls + '">' + escapeHtml(stName) + '</span>';
      if (i < stations.length - 1) {
        html += '<span class="cr-inter-arrow">➔</span>';
      }
    }

    badgesEl.innerHTML = html;
    if (countEl) countEl.textContent = 'Узлов: ' + stations.length;
    wrap.style.display = 'block';
  }
"""
    if 'function getCaravanApiUrl' not in html:
        # insert right before setupStationAutocomplete
        target_fn = 'function setupStationAutocomplete('
        html = html.replace(target_fn, js_helpers + '\n  ' + target_fn, 1)

    # 4. Enhance setupStationAutocomplete with parallel API query
    old_autocomplete = """      var matches = CaravanRailwayEngine.searchStations(val, 10);
      if (!matches || matches.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      var html = '';
      matches.forEach(function(st) {"""

    new_autocomplete = """      function renderStationDropdown(matches) {
        if (!matches || matches.length === 0) {
          dropdown.style.display = 'none';
          return;
        }
        var html = '';
        matches.forEach(function(st) {
          var borderBadge = st.is_border ? '<span class="cr-st-badge-border">СТЫК</span>' : '';
          var rLabel = st.road_label || st.road || st.admin || '';
          html += '<div class="cr-station-item" data-code="' + st.code + '" data-name="' + escapeHtml(st.name) + '" data-road="' + escapeHtml(rLabel) + '" data-land="' + escapeHtml(st.country_name || st.country || '') + '">' +
            '<div class="cr-st-left">' +
              '<span class="cr-st-code">' + st.code + '</span>' +
              '<span class="cr-st-name">' + escapeHtml(st.name) + '</span>' +
            '</div>' +
            '<div class="cr-st-badges">' +
              '<span class="cr-st-badge-road">' + escapeHtml(rLabel) + '</span>' +
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
            input.value = sName + ' (' + sCode + (sRoad ? ', ' + sRoad : '') + ')';
            dropdown.style.display = 'none';
            triggerCustomCalculation();
          });
        });
      }

      // 1. Быстрый локальный поиск (0 мс)
      var localMatches = CaravanRailwayEngine.searchStations(val, 10);
      renderStationDropdown(localMatches);

      // 2. Асинхронный поиск по всей базе 13 694 станций (API)
      var apiUrl = getCaravanApiUrl();
      if (apiUrl) {
        fetch(apiUrl + '/api/stations?q=' + encodeURIComponent(val) + '&limit=15')
          .then(function(r) { return r.json(); })
          .then(function(serverData) {
            if (Array.isArray(serverData) && serverData.length > 0) {
              renderStationDropdown(serverData);
            }
          })
          .catch(function() {});
      }
      return;"""

    if old_autocomplete in html:
        # replace the dropdown population logic
        # find the end of old autocomplete block
        end_str = """      var items = dropdown.querySelectorAll('.cr-station-item');
      items.forEach(function(item) {
        item.addEventListener('click', function() {
          var sName = this.getAttribute('data-name');
          var sCode = this.getAttribute('data-code');
          var sRoad = this.getAttribute('data-road');
          input.value = sName + ' (' + sCode + ', ' + sRoad + ')';
          dropdown.style.display = 'none';
          triggerCustomCalculation();
        });
      });"""
        full_old = html[html.find(old_autocomplete):html.find(end_str) + len(end_str)]
        html = html.replace(full_old, new_autocomplete, 1)

    # 5. In triggerCustomCalculation, call renderIntermediateStations
    calc_call = "renderRouteScheme(calcResult.route);"
    if calc_call in html and "renderIntermediateStations" not in html[html.find(calc_call):html.find(calc_call)+600]:
        api_calc_call = """renderRouteScheme(calcResult.route);

    // Отображаем станции по умолчанию из локального ядра
    var defaultNodes = [fromVal];
    if (calcResult.route.border1) defaultNodes.push(calcResult.route.border1.name);
    if (calcResult.route.border2) defaultNodes.push(calcResult.route.border2.name);
    defaultNodes.push(toVal);
    renderIntermediateStations(defaultNodes);

    // Запрашиваем полный постанционный маршрут у сервера Caravan Rail Engine
    var apiUrl = getCaravanApiUrl();
    if (apiUrl) {
      var sFrom = CaravanRailwayEngine.findStation(fromVal);
      var sTo = CaravanRailwayEngine.findStation(toVal);
      var fromCode = sFrom ? sFrom.code : fromVal;
      var toCode = sTo ? sTo.code : toVal;
      var borderParam = manualBorderCode || manualBorder1 || 'iletsk';
      fetch(apiUrl + '/api/calculate?from=' + encodeURIComponent(fromCode) + '&to=' + encodeURIComponent(toCode) + '&border=' + encodeURIComponent(borderParam) + '&weight=' + encodeURIComponent(weightVal))
        .then(function(res) { return res.json(); })
        .then(function(apiData) {
          if (apiData && apiData.intermediate_stations && apiData.intermediate_stations.length > 0) {
            renderIntermediateStations(apiData.intermediate_stations);
          }
        })
        .catch(function() {});
    }"""
        html = html.replace(calc_call, api_calc_call, 1)

    with open('caravan-tracking-widget.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("✓ Patched caravan-tracking-widget.html successfully.")

    # Recompile bundle
    subprocess.run(["python3", "build_widget_bundle.py"], check=True)
    subprocess.run(["python3", "patch_widget_and_index.py"], check=True)
    print("✓ Recompiled widget bundle and synchronized index.html.")

if __name__ == '__main__':
    patch()
