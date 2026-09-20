import re

def update_file_logic(filepath):
    print(f"Updating calculator logic in {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update setupCalculator to call setupCargoAutocomplete and bind cr-btn-execute-calc
    if 'setupCargoAutocomplete' not in content:
        old_call = "setupStationAutocomplete('cr-calc-to', 'cr-calc-to-dropdown');"
        new_call = """setupStationAutocomplete('cr-calc-to', 'cr-calc-to-dropdown');

    // Автодополнение номенклатуры грузов ЕТСНГ / ГНГ
    setupCargoAutocomplete('cr-calc-cargo-search', 'cr-calc-cargo-dropdown');

    // Кнопка принудительного расчета маршрута и тарифа
    var executeCalcBtn = document.getElementById('cr-btn-execute-calc');
    if (executeCalcBtn) {
      executeCalcBtn.addEventListener('click', function() {
        triggerCustomCalculation();
        var resBox = document.getElementById('cr-calc-result-box');
        if (resBox) {
          resBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }"""
        content = content.replace(old_call, new_call)
        print("  Added cargo autocomplete & calculate button listener to setupCalculator")

    # 2. Add setupCargoAutocomplete function definition
    if 'function setupCargoAutocomplete(' not in content:
        cargo_autocomplete_func = """
  function setupCargoAutocomplete(inputId, dropdownId) {
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

      var html = '';
      matches.forEach(function(c) {
        html += '<div class="cr-cargo-item" data-etsng="' + c.code_etsng + '" data-gng="' + c.code_gng + '" data-name="' + escapeHtml(c.name) + '" data-class="' + c.tariff_class + '" data-wagon="' + (c.default_wagon || 'boxcar') + '">' +
          '<div class="cr-cargo-left">' +
            '<div class="cr-cargo-codes">ЕТСНГ: ' + c.code_etsng + ' • ГНГ: ' + c.code_gng + '</div>' +
            '<div class="cr-cargo-name">' + escapeHtml(c.name) + '</div>' +
          '</div>' +
          '<div class="cr-cargo-meta">' +
            '<span>' + escapeHtml(c.category) + '</span>' +
            '<span class="cr-cargo-class">' + c.tariff_class + ' класс</span>' +
          '</div>' +
        '</div>';
      });

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      var items = dropdown.querySelectorAll('.cr-cargo-item');
      items.forEach(function(item) {
        item.addEventListener('click', function() {
          var cName = this.getAttribute('data-name');
          var cEtsng = this.getAttribute('data-etsng');
          var cGng = this.getAttribute('data-gng');
          var cWagon = this.getAttribute('data-wagon');

          input.value = cName + ' (ЕТСНГ: ' + cEtsng + ', ГНГ: ' + cGng + ')';
          dropdown.style.display = 'none';

          // Автоматический подбор подвижного состава
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
  }
"""
        station_auto_pos = content.find('function setupStationAutocomplete(')
        if station_auto_pos != -1:
            content = content[:station_auto_pos] + cargo_autocomplete_func + '\n  ' + content[station_auto_pos:]
            print("  Inserted setupCargoAutocomplete function")

    # 3. Update triggerCustomCalculation to pass cargoSearch & handle km calculation accurately
    old_trigger = "var cargoCode = document.getElementById('cr-calc-cargo') ? document.getElementById('cr-calc-cargo').value : 'grain';"
    new_trigger = """var cargoSearchEl = document.getElementById('cr-calc-cargo-search');
    var cargoSearchVal = cargoSearchEl ? cargoSearchEl.value : '';
    var cargoCode = document.getElementById('cr-calc-cargo') ? document.getElementById('cr-calc-cargo').value : 'grain';"""
    if old_trigger in content and 'cargoSearchVal' not in content:
        content = content.replace(old_trigger, new_trigger)

    # Replace calculateTariff call parameters
    old_call_params = """wagonType: transportCode,
      parkType: parkType,
      cargoType: cargoCode,"""
    new_call_params = """wagonType: transportCode,
      parkType: parkType,
      cargoType: cargoCode,
      cargoSearch: cargoSearchVal,"""
    if old_call_params in content:
        content = content.replace(old_call_params, new_call_params)

    # 4. Make sure km is updated without being blocked
    old_km_update = """var kmInput = document.getElementById('cr-calc-km');
    if (kmInput && (!document.activeElement || document.activeElement.id !== 'cr-calc-km')) {
      kmInput.value = calcResult.route.totalDistanceKm;
    }"""
    new_km_update = """var kmInput = document.getElementById('cr-calc-km');
    if (kmInput) {
      kmInput.value = calcResult.route.totalDistanceKm;
    }"""
    if old_km_update in content:
        content = content.replace(old_km_update, new_km_update)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {filepath}")

update_file_logic('caravan-tracking-widget.html')
update_file_logic('index.html')
