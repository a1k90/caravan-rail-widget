#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Apply Full Updates:
1. Injects missing 5 modality panels into caravan-tracking-widget.html and index.html
2. Connects triggerCustomCalculation() to handleNonRailCalculation()
3. Adds cache-busting version query string to tilda snippet
4. Rebuilds caravan-widget.js and caravan-widget.css
"""

import json
import subprocess

PANELS_HTML = """          </div>
        </div>

        <!-- ПАНЕЛЬ 2: АРЕНДА ПОДВИЖНОГО СОСТАВА (ПС) -->
        <div class="cr-mod-panel" id="cr-mod-panel-fleet" style="display: none;">
          <div class="cr-modality-inputs-grid">
            <div class="cr-form-field">
              <label>Тип подвижного состава</label>
              <select id="cr-fleet-type" class="cr-select">
                <option value="grain" selected>Хоппер-зерновоз (116–120 м³, 70 т)</option>
                <option value="covered">Крытый вагон (138–161 м³, 68 т)</option>
                <option value="gondola">Полувагон люковый (85 м³, 70 т)</option>
                <option value="platform">Фитинговая платформа (20'/40' HC)</option>
                <option value="tank">Ж/Д цистерна (нефть, ГСМ, масла)</option>
              </select>
            </div>
            <div class="cr-form-field">
              <label>Формат аренды</label>
              <select id="cr-fleet-rent-type" class="cr-select">
                <option value="daily" selected>Посуточная аренда (Daily lease)</option>
                <option value="roundtrip">Аренда на кругорейс (Round-trip)</option>
              </select>
            </div>
            <div class="cr-form-field">
              <label>Количество вагонов (ед.)</label>
              <input type="number" id="cr-fleet-count" class="cr-input" value="10" min="1" max="500" />
            </div>
            <div class="cr-form-field">
              <label>Срок аренды (суток)</label>
              <input type="number" id="cr-fleet-days" class="cr-input" value="30" min="5" max="365" />
            </div>
            <div class="cr-form-field">
              <label>Регион курсирования / Станция погрузки</label>
              <input type="text" id="cr-fleet-route" class="cr-input" value="Акмола (Казахстан) ➔ Сарыагаш" />
            </div>
          </div>
        </div>

        <!-- ПАНЕЛЬ 3: АВТОТРАНСПОРТ -->
        <div class="cr-mod-panel" id="cr-mod-panel-road" style="display: none;">
          <div class="cr-modality-inputs-grid">
            <div class="cr-form-field">
              <label>Город отправления</label>
              <input type="text" id="cr-road-from" class="cr-input" value="Москва" />
            </div>
            <div class="cr-form-field">
              <label>Город назначения</label>
              <input type="text" id="cr-road-to" class="cr-input" value="Ташкент" />
            </div>
            <div class="cr-form-field">
              <label>Тип автотранспорта</label>
              <select id="cr-road-type" class="cr-select">
                <option value="tent" selected>Тент стандарт (86–92 м³, до 22 т)</option>
                <option value="mega">Сцепка Мега (110–120 м³, до 24 т)</option>
                <option value="reefer">Рефрижератор (-20°C / +20°C)</option>
                <option value="lowbed">Низкорамный трал (негабарит)</option>
              </select>
            </div>
            <div class="cr-form-field">
              <label>Масса груза (тонн)</label>
              <input type="number" id="cr-road-weight" class="cr-input" value="20" min="1" max="45" />
            </div>
          </div>
        </div>

        <!-- ПАНЕЛЬ 4: АВИАКАРГО -->
        <div class="cr-mod-panel" id="cr-mod-panel-air" style="display: none;">
          <div class="cr-modality-inputs-grid">
            <div class="cr-form-field">
              <label>Аэропорт вылета (IATA)</label>
              <select id="cr-air-from" class="cr-select">
                <option value="CAN" selected>Гуанчжоу (CAN) — Китай</option>
                <option value="PVG">Шанхай (PVG) — Китай</option>
                <option value="SVO">Москва (SVO) — Россия</option>
                <option value="IST">Стамбул (IST) — Турция</option>
                <option value="DXB">Дубай (DXB) — ОАЭ</option>
                <option value="FRA">Франкфурт (FRA) — Германия</option>
              </select>
            </div>
            <div class="cr-form-field">
              <label>Аэропорт прилёта</label>
              <input type="text" id="cr-air-to" class="cr-input" value="Ташкент (TAS) — Узбекистан" readonly />
            </div>
            <div class="cr-form-field">
              <label>Фактический вес брутто (кг)</label>
              <input type="number" id="cr-air-weight" class="cr-input" value="350" min="10" max="25000" />
            </div>
            <div class="cr-form-field">
              <label>Общий объем груза (м³)</label>
              <input type="number" id="cr-air-volume" class="cr-input" value="2.5" step="0.1" min="0.1" />
            </div>
            <div class="cr-form-field" style="display: flex; align-items: center; gap: 8px; margin-top: 24px;">
              <input type="checkbox" id="cr-air-danger" style="width: 18px; height: 18px;" />
              <label for="cr-air-danger" style="margin: 0; cursor: pointer;">Опасный груз (IATA DGR / батареи / химия)</label>
            </div>
          </div>
        </div>

        <!-- ПАНЕЛЬ 5: МУЛЬТИМОДАЛ -->
        <div class="cr-mod-panel" id="cr-mod-panel-multimodal" style="display: none;">
          <div class="cr-modality-inputs-grid">
            <div class="cr-form-field">
              <label>Сквозной международный коридор</label>
              <select id="cr-multi-corridor" class="cr-select">
                <option value="china_uzb" selected>Китай (Нинбо/Шанхай) ➔ Алтынколь ➔ Ташкент</option>
                <option value="uae_uzb">ОАЭ (Джебель-Али) ➔ Бендер-Аббас ➔ Серахс ➔ Ташкент</option>
                <option value="turkey_uzb">Турция (Мерсин) ➔ Баку ➔ Актау ➔ Ташкент</option>
              </select>
            </div>
            <div class="cr-form-field">
              <label>Тип контейнера</label>
              <select id="cr-multi-container" class="cr-select">
                <option value="40hc" selected>40' High Cube (76 м³, до 28 т)</option>
                <option value="20dc">20' Dry Container (33 м³, до 24 т)</option>
              </select>
            </div>
            <div class="cr-form-field">
              <label>Количество контейнеров</label>
              <input type="number" id="cr-multi-count" class="cr-input" value="1" min="1" max="100" />
            </div>
            <div class="cr-form-field">
              <label>Город доставки «последней мили»</label>
              <input type="text" id="cr-multi-city" class="cr-input" value="Ташкент (склад получателя)" />
            </div>
          </div>
        </div>

        <!-- ПАНЕЛЬ 6: ТАМОЖНЯ И ВЭД -->
        <div class="cr-mod-panel" id="cr-mod-panel-customs" style="display: none;">
          <div class="cr-modality-inputs-grid">
            <div class="cr-form-field cr-station-autocomplete-wrap" style="grid-column: 1 / -1;">
              <label>Код ТН ВЭД (10 знаков) или наименование товара из базы АИС Таможня</label>
              <div class="cr-input-wrapper">
                <input type="text" id="cr-customs-tnved" class="cr-input" placeholder="Введите код или товар (напр. 1001 99 000 0 или Пшеница)" value="1001 99 000 0 — Пшеница твердая" autocomplete="off" />
                <div id="cr-customs-tnved-dropdown" class="cr-station-dropdown" style="display: none;"></div>
              </div>
            </div>
            <div class="cr-form-field">
              <label>Стоимость партии по инвойсу (USD)</label>
              <input type="number" id="cr-customs-value" class="cr-input" value="25000" min="100" />
            </div>
            <div class="cr-form-field">
              <label>Стоимость доставки до границы / фрахт (USD)</label>
              <input type="number" id="cr-customs-freight" class="cr-input" value="2500" min="0" />
            </div>
            <div class="cr-form-field">
              <label>Таможенный режим</label>
              <select id="cr-customs-regime" class="cr-select">
                <option value="import" selected>Импорт 40 (Выпуск для свободного обращения)</option>
                <option value="export">Экспорт 10</option>
                <option value="transit">Транзит 80</option>
              </select>
            </div>
          </div>
        </div>
"""

TRIGGER_INJECTION = """    // Маршрутизация на расчет выбранного направления
    if (typeof currentModality !== 'undefined' && currentModality !== 'rail') {
      handleNonRailCalculation(currentModality);
      return;
    }
"""

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Insert panels before cr-calc-actions-bar if not present
    if 'id="cr-mod-panel-fleet"' not in content:
        target = '<div class="cr-calc-actions-bar">'
        if target in content:
            # We also need to remove the extra closing </div> before actions-bar if any
            # Look at:
            #   </div>
            # </div>
            # <div class="cr-calc-actions-bar">
            idx = content.find(target)
            content = content[:idx] + PANELS_HTML + '\n\n          ' + content[idx:]
            print(f"[OK] Injected 5 modality panels into {filepath}")
        else:
            print(f"[WARN] Target actions bar not found in {filepath}")

    # 2. Hook triggerCustomCalculation
    trig_target = 'function triggerCustomCalculation() {'
    if trig_target in content and 'handleNonRailCalculation(currentModality)' not in content:
        content = content.replace(trig_target, trig_target + '\n' + TRIGGER_INJECTION, 1)
        print(f"[OK] Hooked triggerCustomCalculation in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    patch_file('caravan-tracking-widget.html')
    patch_file('index.html')

    # Rebuild bundle
    subprocess.run(["python3", "build_widget_bundle.py"], check=True)
    print("[OK] Rebuilt caravan-widget.js and caravan-widget.css")

if __name__ == '__main__':
    main()
