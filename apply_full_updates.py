import re

with open('railway_calc_engine.js', 'r', encoding='utf-8') as f:
    engine_code = f.read()

def process_file(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace embedded CaravanRailwayEngine block
    engine_start = content.find('var CaravanRailwayEngine = (function()')
    if engine_start != -1:
        engine_end = content.find('// ---------------------------------------------------------------------\n  // ДЕМО-ДАННЫЕ ДЛЯ РЕЖИМА "РЕГУЛЯРНЫЕ МАРШРУТЫ"', engine_start)
        if engine_end == -1:
            engine_end = content.find('// ДЕМО-ДАННЫЕ', engine_start)
        if engine_end != -1:
            # Extract just the IIFE definition from engine_code
            iife_start = engine_code.find('var CaravanRailwayEngine = (function()')
            iife_end = engine_code.find('if (typeof module !==', iife_start)
            if iife_end == -1:
                iife_end = len(engine_code)
            new_engine_part = engine_code[iife_start:iife_end].strip() + '\n\n  '
            content = content[:engine_start] + new_engine_part + content[engine_end:]
            print(f"  Replaced CaravanRailwayEngine in {filepath}")

    # 2. Clean R-Тариф branding in HTML
    replacements = [
        ('Железнодорожный калькулятор тарифов (База R-Тариф 1520 мм)', 'Интеллектуальный калькулятор железнодорожных тарифов 1520 мм'),
        ('Железнодорожный калькулятор тарифов (база R-Тариф 1520 мм)', 'Интеллектуальный калькулятор железнодорожных тарифов 1520 мм'),
        ('Индивидуальный расчет (R-Тариф)', 'Индивидуальный расчет маршрута'),
        ('КАРТОЧКА РАСЧИТАННОГО ТАРИФА (R-ТАРИФ ДЕТАЛИЗАЦИЯ)', 'КАРТОЧКА РАСЧИТАННОГО ТАРИФА И МАРШРУТА'),
        ('Подробности расчета по участкам маршрута (R-Тариф):', 'Поучастковая тарификация железных дорог:'),
        ('ПОДРОБНОСТИ РАСЧЕТА ПО УЧАСТКАМ МАРШРУТА (R-ТАРИФ):', 'ПОУЧАСТКОВАЯ ТАРИФИКАЦИЯ ЖЕЛЕЗНЫХ ДОРОГ:'),
        ('* Расчет выполнен по алгоритмам Тарифной политики ОСЖД / СНГ, ТП КТЖ и ТП УТИ.', '* Расчет выполнен цифровым тарифным ядром Caravan 1520 по правилам железных дорог пространства 1520 мм (ОСЖД / ТП КТЖ / ТП УТИ / Прейскурант 10-01).')
    ]
    for old_txt, new_txt in replacements:
        if old_txt in content:
            content = content.replace(old_txt, new_txt)
            print(f"  Replaced '{old_txt}' -> '{new_txt}'")

    # 3. Replace Cargo Selector with Cargo Autocomplete Search
    cargo_sel_pattern = re.compile(r'<!-- НОМЕНКЛАТУРА ГРУЗА -->\s*<div class="cr-form-field">.*?</div>\s*<!-- МАССА ГРУЗА -->', re.DOTALL)
    new_cargo_html = """<!-- НОМЕНКЛАТУРА ГРУЗА (ЕТСНГ / ГНГ) -->
            <div class="cr-form-field cr-cargo-autocomplete-wrap">
              <label>Номенклатура груза (поиск по названию, коду ЕТСНГ или ГНГ)</label>
              <div class="cr-input-wrapper">
                <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <input type="text" id="cr-calc-cargo-search" class="cr-input" placeholder="Введите название (напр. пшеница, уголь, металл) или код" value="Пшеница прочая (ЕТСНГ: 100199, ГНГ: 10019900)" autocomplete="off" />
                <input type="hidden" id="cr-calc-cargo" value="grain" />
                <input type="hidden" id="cr-calc-cargo-code" value="100199" />
                <div id="cr-calc-cargo-dropdown" class="cr-station-dropdown" style="display: none;"></div>
              </div>
            </div>

            <!-- МАССА ГРУЗА -->"""
    
    if cargo_sel_pattern.search(content):
        content = cargo_sel_pattern.sub(new_cargo_html, content)
        print("  Replaced cargo select with autocomplete in HTML")

    # 4. Insert Primary "Рассчитать маршрут и тариф" button before Route Scheme
    calc_btn_html = """<!-- КНОПКА РАСЧЕТА ТАРИФА И МАРШРУТА -->
          <div class="cr-calc-actions-bar">
            <button type="button" class="cr-btn-primary cr-btn-calc-action" id="cr-btn-execute-calc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
              <span>Рассчитать маршрут и тариф</span>
            </button>
          </div>

          <!-- ВИЗУАЛЬНАЯ СХЕМА МАРШРУТА -->"""
    
    if 'id="cr-btn-execute-calc"' not in content and '<!-- ВИЗУАЛЬНАЯ СХЕМА МАРШРУТА -->' in content:
        content = content.replace('<!-- ВИЗУАЛЬНАЯ СХЕМА МАРШРУТА -->', calc_btn_html)
        print("  Added primary calculate button before route scheme")

    # 5. Add CSS for cr-calc-actions-bar & cr-btn-calc-action if not present
    if '.cr-calc-actions-bar' not in content:
        css_addition = """
  .cr-calc-actions-bar {
    margin: 18px 0 10px 0;
    display: flex;
    justify-content: flex-end;
  }
  .cr-btn-calc-action {
    padding: 14px 28px;
    font-size: 15px;
    font-weight: 700;
    gap: 10px;
    box-shadow: 0 4px 18px rgba(245, 158, 11, 0.4);
    cursor: pointer;
  }
  .cr-btn-calc-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(245, 158, 11, 0.55);
  }
  .cr-cargo-item {
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.15s;
  }
  .cr-cargo-item:hover {
    background: rgba(245, 158, 11, 0.15);
  }
  .cr-cargo-codes {
    font-size: 11px;
    font-weight: 700;
    color: var(--cr-amber, #F59E0B);
    margin-bottom: 2px;
  }
  .cr-cargo-name {
    font-size: 13px;
    color: #FFFFFF;
  }
  .cr-cargo-meta {
    font-size: 11px;
    color: #94A3B8;
    text-align: right;
  }
  .cr-cargo-class {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 10px;
    font-weight: 600;
    margin-left: 6px;
  }
"""
        content = content.replace('/* КАЛЬКУЛЯТОР ТАРИФОВ */', '/* КАЛЬКУЛЯТОР ТАРИФОВ */' + css_addition)
        print("  Added CSS for calculate action bar and cargo items")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {filepath}")

process_file('caravan-tracking-widget.html')
process_file('index.html')
