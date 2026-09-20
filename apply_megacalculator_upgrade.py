#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Apply Caravan Mega-Calculator Upgrade:
1. 6 Modalities: Rail 1520, Fleet Leasing, Road, Air, Multimodal, Customs
2. Smart Document Checklist with 1-click copy / WhatsApp sharing
3. Live TN VED autocomplete across 13,140 codes
4. Offline fallback for all 6 modalities
5. Rebuilds caravan-widget.js, caravan-widget.css, and index.html
"""

import os
import re
import subprocess

def apply():
    with open('caravan-tracking-widget.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add CSS styles
    css_add = """
  /* МУЛЬТИМОДАЛЬНЫЙ СУПЕР-КАЛЬКУЛЯТОР: СТИЛИ МОДАЛЬНОСТЕЙ И ЧЕК-ЛИСТА ДОКУМЕНТОВ */
  .cr-modality-bar {
    display: flex;
    gap: 8px;
    margin: 14px 0 18px;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: thin;
  }
  .cr-modality-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #94a3b8;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.25s ease;
  }
  .cr-modality-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f8fafc;
    border-color: rgba(197, 160, 89, 0.4);
  }
  .cr-modality-btn.active {
    background: linear-gradient(135deg, rgba(197, 160, 89, 0.25), rgba(197, 160, 89, 0.06));
    border-color: #c5a059;
    color: #f8fafc;
    box-shadow: 0 4px 14px rgba(197, 160, 89, 0.18);
  }
  .cr-mod-icon {
    font-size: 16px;
  }

  /* Панели модальностей */
  .cr-mod-panel {
    display: none;
    animation: crFadeIn 0.3s ease;
  }
  .cr-mod-panel.active {
    display: block;
  }

  /* ЧЕК-ЛИСТ ДОКУМЕНТОВ */
  .cr-doc-checklist-card {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.8), rgba(7, 11, 20, 0.95));
    border: 1px solid rgba(197, 160, 89, 0.25);
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  .cr-doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 6px;
  }
  .cr-doc-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #c5a059;
    background: rgba(197, 160, 89, 0.12);
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
  }
  .cr-doc-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
    display: flex;
    align-items: center;
  }
  .cr-doc-subtitle {
    margin: 0 0 16px;
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
  }
  .cr-doc-actions {
    display: flex;
    gap: 8px;
  }
  .cr-doc-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #e2e8f0;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cr-doc-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: #c5a059;
  }
  .cr-doc-btn.whatsapp {
    background: rgba(37, 211, 102, 0.12);
    border-color: rgba(37, 211, 102, 0.3);
    color: #4ade80;
  }
  .cr-doc-btn.whatsapp:hover {
    background: rgba(37, 211, 102, 0.2);
    border-color: #25d366;
    color: #fff;
  }
  .cr-doc-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 10px;
  }
  .cr-doc-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 8px;
    align-items: flex-start;
  }
  .cr-doc-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
    background: rgba(197, 160, 89, 0.15);
    color: #c5a059;
  }
  .cr-doc-icon.mandatory {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  .cr-doc-name {
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 3px;
  }
  .cr-doc-desc {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.4;
  }
  .cr-doc-tag {
    display: inline-block;
    font-size: 9px;
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 3px;
    margin-left: 6px;
    text-transform: uppercase;
  }
  .cr-doc-tag.mandatory {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
  }
  .cr-doc-tag.optional {
    background: rgba(148, 163, 184, 0.15);
    color: #cbd5e1;
  }

  /* Специфические поля модальностей */
  .cr-modality-inputs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }
"""
    if '.cr-modality-bar' not in content:
        content = content.replace('</style>', css_add + '\n</style>', 1)

    # 2. Insert Modality Bar HTML right before cr-calc-preset-view
    modality_bar_html = """
        <!-- МУЛЬТИМОДАЛЬНЫЙ СЕЛЕКТОР (6 НАПРАВЛЕНИЙ CARAVAN) -->
        <div class="cr-modality-bar" id="cr-modality-bar">
          <button type="button" class="cr-modality-btn active" data-modality="rail">
            <span class="cr-mod-icon">🚆</span>
            <span class="cr-mod-title">Ж/Д 1520</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="fleet">
            <span class="cr-mod-icon">🏢</span>
            <span class="cr-mod-title">Аренда ПС</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="road">
            <span class="cr-mod-icon">🚛</span>
            <span class="cr-mod-title">Автоперевозки</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="air">
            <span class="cr-mod-icon">✈️</span>
            <span class="cr-mod-title">Авиакарго</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="multimodal">
            <span class="cr-mod-icon">🌐</span>
            <span class="cr-mod-title">Мультимодал</span>
          </button>
          <button type="button" class="cr-modality-btn" data-modality="customs">
            <span class="cr-mod-icon">📋</span>
            <span class="cr-mod-title">Таможня & ВЭД</span>
          </button>
        </div>
"""
    if 'id="cr-modality-bar"' not in content:
        target = '<div class="cr-submode-toggles">'
        content = content.replace(target, modality_bar_html + '\n        ' + target, 1)

    # 3. Add Modality Panels HTML inside cr-calc-custom-view
    # Wrap existing inputs grid in cr-mod-panel-rail
    rail_start = '<div class="cr-calc-inputs-grid">'
    if rail_start in content and 'id="cr-mod-panel-rail"' not in content:
        content = content.replace(rail_start, '<div class="cr-mod-panel active" id="cr-mod-panel-rail">\n          <div class="cr-calc-inputs-grid">', 1)

    # Close rail panel and add fleet, road, air, multimodal, customs panels
    panels_html = """          </div>
        </div>

        <!-- ПАНЕЛЬ 2: АРЕНДА ПОДВИЖНОГО СОСТАВА (ПС) -->
        <div class="cr-mod-panel" id="cr-mod-panel-fleet">
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
        <div class="cr-mod-panel" id="cr-mod-panel-road">
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
        <div class="cr-mod-panel" id="cr-mod-panel-air">
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
        <div class="cr-mod-panel" id="cr-mod-panel-multimodal">
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
        <div class="cr-mod-panel" id="cr-mod-panel-customs">
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
    # Replace end of inputs grid with multi-modality panels
    # Find '</form>' inside cr-calc-custom-view
    form_end = content.find('</form>', content.find('id="cr-calc-custom-view"'))
    if form_end != -1 and 'id="cr-mod-panel-fleet"' not in content:
        # find where cr-calc-inputs-grid ends
        # insert panels_html before button / actions
        btn_action_idx = content.rfind('<div class="cr-calc-actions-row">', 0, form_end)
        if btn_action_idx != -1:
            content = content[:btn_action_idx] + panels_html + '\n\n          ' + content[btn_action_idx:]

    # 4. Insert Smart Document Checklist Card HTML
    doc_checklist_html = """
          <!-- УМНЫЙ ЧЕК-ЛИСТ ДОКУМЕНТОВ (MANAGER OFFLOADING SYSTEM) -->
          <div class="cr-doc-checklist-card" id="cr-doc-checklist-card">
            <div class="cr-doc-header">
              <div class="cr-doc-header-left">
                <span class="cr-doc-badge">АВТОМАТИЧЕСКИЙ ПОДБОР ВЭД</span>
                <h4 class="cr-doc-title"><i class="fas fa-file-contract" style="color: var(--cr-gold); margin-right: 8px;"></i> Необходимый пакет документов для перевозки</h4>
              </div>
              <div class="cr-doc-actions">
                <button type="button" class="cr-doc-btn" id="cr-btn-copy-docs">
                  <i class="far fa-copy"></i> Скопировать чек-лист
                </button>
                <button type="button" class="cr-doc-btn whatsapp" id="cr-btn-wa-docs">
                  <i class="fab fa-whatsapp"></i> В WhatsApp
                </button>
              </div>
            </div>
            <p class="cr-doc-subtitle">Список сопутствующих и разрешительных документов, необходимых для таможенного оформления и беспрепятственного прохождения границ.</p>
            <div class="cr-doc-items-grid" id="cr-doc-items-grid"></div>
          </div>
"""
    if 'id="cr-doc-checklist-card"' not in content:
        # place right before </form> of custom-view
        form_end_idx = content.find('</form>', content.find('id="cr-calc-custom-view"'))
        if form_end_idx != -1:
            content = content[:form_end_idx] + doc_checklist_html + '\n        ' + content[form_end_idx:]

    # 5. Add JavaScript Handlers for Modalities, TN VED Autocomplete & Document Checklist
    js_logic = """
  // =========================================================================
  // МУЛЬТИМОДАЛЬНЫЙ ДВИЖОК CARAVAN: 6 НАПРАВЛЕНИЙ И ЧЕК-ЛИСТ ДОКУМЕНТОВ
  // =========================================================================
  var currentModality = 'rail';

  var DEFAULT_DOCS_BY_MODALITY = {
    rail: [
      { name: 'Ж/Д накладная СМГС (SMGS)', code: '0202', mandatory: true, description: 'Основной международный перевозочный документ железнодорожного сообщения колеи 1520 мм.' },
      { name: 'Коммерческий инвойс (Счёт-фактура)', code: '0301', mandatory: true, description: 'Финансовый документ с реквизитами продавца/покупателя и условиями поставки Incoterms.' },
      { name: 'Упаковочный лист (Packing List)', code: '0302', mandatory: true, description: 'Поместовая опись веса брутто/нетто, количества грузовых мест и упаковки.' },
      { name: 'Фитосанитарный / Ветеринарный сертификат', code: '0103', mandatory: true, description: 'Обязателен для растительных, зерновых или кормовых грузов при пересечении границы.' },
      { name: 'Сертификат происхождения СТ-1', code: '0601', mandatory: true, description: 'Освобождает от уплаты ввозной пошлины в рамках соглашения о свободной торговле СНГ.' }
    ],
    fleet: [
      { name: 'Договор аренды / оперирования подвижного состава', code: '0801', mandatory: true, description: 'Базовый договор закрепления вагонного парка за арендатором на рейс или посуточно.' },
      { name: 'Заявка формы ГУ-12 на перевозку', code: '0802', mandatory: true, description: 'Официальное согласование курсирования и погрузки вагонов железнодорожной администрацией.' },
      { name: 'Акт приема-передачи вагонов', code: '0803', mandatory: true, description: 'Фиксирует дату, станцию и техническое состояние при передаче парка.' },
      { name: 'Справка технического состояния (ВУ-23М / ВУ-36М)', code: '0804', mandatory: true, description: 'Подтверждение исправности колесных пар, тележек и тормозной системы вагонов.' }
    ],
    road: [
      { name: 'Международная автонакладная CMR', code: '0201', mandatory: true, description: 'Договор международной автомобильной перевозки грузов.' },
      { name: 'Книжка Carnet TIR (МДП)', code: '0204', mandatory: false, description: 'Таможенный документ транзита без досмотра и вскрытия пломб на погранпереходах.' },
      { name: 'Экспортная декларация (EX-1 / ТД)', code: '0901', mandatory: true, description: 'Подтверждает факт убытия товара и закрытие режима экспорта.' },
      { name: 'Инвойс и упаковочный лист', code: '0301', mandatory: true, description: 'Коммерческие товаросопроводительные документы для водителя и таможни.' }
    ],
    air: [
      { name: 'Авиагрузовая накладная Air Waybill (AWB)', code: '0203', mandatory: true, description: 'Документ авиакомпании, подтверждающий принятие груза к воздушной перевозке.' },
      { name: 'Инструкция отправителя (SLI)', code: '0205', mandatory: true, description: 'Поручение агенту на экспедирование, обработку и страхование груза в аэропорту.' },
      { name: 'Паспорт безопасности MSDS / Декларация IATA DGR', code: '0114', mandatory: false, description: 'Требуется при наличии литиевых аккумуляторов, жидкостей, магнитов или химии.' }
    ],
    multimodal: [
      { name: 'Океанский коносамент (Bill of Lading / B/L)', code: '0206', mandatory: true, description: 'Титульный документ морской перевозки контейнера с правом распоряжения грузом.' },
      { name: 'Сквозная накладная FIATA FBL', code: '0207', mandatory: true, description: 'Единый сквозной экспедиторский документ на комбинированное плечо (море+ж/д+авто).' },
      { name: 'Транзитная декларация (ТД) в порту перевалки', code: '0902', mandatory: true, description: 'Оформляется для транзитного следования контейнера от морского порта до сухопутной таможни.' }
    ],
    customs: [
      { name: 'Грузовая таможенная декларация (ГТД / ДТ)', code: '0001', mandatory: true, description: 'Основной документ декларирования для выпуска товара в свободное обращение.' },
      { name: 'Внешнеторговый контракт + Регистрация ЕЭИСВО', code: '0002', mandatory: true, description: 'Контракт с банком валютного контроля и регистрацией сделки.' },
      { name: 'Сертификат соответствия / Узстандарт / ЕАС', code: '0101', mandatory: true, description: 'Подтверждение безопасности продукции техническим регламентам.' },
      { name: 'Платежное поручение по таможенным сборам', code: '0701', mandatory: true, description: 'Подтверждение списания пошлины, сборов и НДС с лицевого счета таможни.' }
    ]
  };

  function renderDocumentChecklist(docs) {
    var grid = document.getElementById('cr-doc-items-grid');
    if (!grid) return;
    if (!docs || docs.length === 0) {
      docs = DEFAULT_DOCS_BY_MODALITY[currentModality] || DEFAULT_DOCS_BY_MODALITY['rail'];
    }

    var html = '';
    docs.forEach(function(d) {
      var isMan = d.mandatory !== false;
      var tagCls = isMan ? 'mandatory' : 'optional';
      var tagText = isMan ? 'Обязательный' : 'По запросу';
      var iconCls = isMan ? 'mandatory' : '';
      var iconSymbol = isMan ? '<i class="fas fa-check"></i>' : '<i class="fas fa-info"></i>';

      html += '<div class="cr-doc-item">' +
        '<div class="cr-doc-icon ' + iconCls + '">' + iconSymbol + '</div>' +
        '<div class="cr-doc-content">' +
          '<div class="cr-doc-name">' + escapeHtml(d.name) +
            '<span class="cr-doc-tag ' + tagCls + '">' + tagText + '</span>' +
          '</div>' +
          '<div class="cr-doc-desc">' + escapeHtml(d.description || '') + '</div>' +
        '</div>' +
      '</div>';
    });
    grid.innerHTML = html;
  }

  function setupModalityTabs() {
    var bar = document.getElementById('cr-modality-bar');
    if (!bar) return;

    var btns = bar.querySelectorAll('.cr-modality-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        btns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        currentModality = this.getAttribute('data-modality') || 'rail';

        // Переключаем панели
        var panels = document.querySelectorAll('.cr-mod-panel');
        panels.forEach(function(p) { p.classList.remove('active'); });
        var activePanel = document.getElementById('cr-mod-panel-' + currentModality);
        if (activePanel) activePanel.classList.add('active');

        // Скрываем/показываем блоки специфичные для Ж/Д
        var schemeBox = document.getElementById('cr-route-scheme-box');
        var roleBox = document.querySelector('.cr-role-selection-box');
        if (currentModality === 'rail') {
          if (schemeBox) schemeBox.style.display = 'block';
          if (roleBox) roleBox.style.display = 'block';
        } else {
          if (schemeBox) schemeBox.style.display = 'none';
        }

        // Обновляем чек-лист документов
        renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY[currentModality]);

        // Запускаем перерасчет для выбранной модальности
        triggerCustomCalculation();
      });
    });

    // Настройка кнопок копирования документов
    var copyBtn = document.getElementById('cr-btn-copy-docs');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        var docs = DEFAULT_DOCS_BY_MODALITY[currentModality] || [];
        var text = 'Перечень документов Caravan Railroad (' + currentModality.toUpperCase() + '):\\n';
        docs.forEach(function(d, i) {
          text += (i + 1) + '. ' + d.name + (d.mandatory ? ' [Обязательно]' : '') + ' — ' + d.description + '\\n';
        });
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function() {
            alert('Чек-лист документов скопирован в буфер обмена!');
          });
        }
      });
    }

    var waBtn = document.getElementById('cr-btn-wa-docs');
    if (waBtn) {
      waBtn.addEventListener('click', function() {
        var docs = DEFAULT_DOCS_BY_MODALITY[currentModality] || [];
        var text = 'Здравствуйте! Отправляю перечень документов для перевозки (' + currentModality.toUpperCase() + '):\\n';
        docs.forEach(function(d, i) {
          text += (i + 1) + '. ' + d.name + '\\n';
        });
        window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
      });
    }

    // Настройка автокомплита ТН ВЭД (Таможня)
    setupTnvedAutocomplete();
  }

  function setupTnvedAutocomplete() {
    var input = document.getElementById('cr-customs-tnved');
    var dropdown = document.getElementById('cr-customs-tnved-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', function() {
      var val = this.value.trim();
      if (val.length < 2) {
        dropdown.style.display = 'none';
        return;
      }
      var apiUrl = getCaravanApiUrl();
      if (apiUrl) {
        fetch(apiUrl + '/api/customs/tnved?q=' + encodeURIComponent(val) + '&limit=12')
          .then(function(r) { return r.json(); })
          .then(function(items) {
            if (!Array.isArray(items) || items.length === 0) {
              dropdown.style.display = 'none';
              return;
            }
            var html = '';
            items.forEach(function(it) {
              html += '<div class="cr-station-item" data-code="' + it.code + '" data-name="' + escapeHtml(it.name) + '">' +
                '<div class="cr-st-left">' +
                  '<span class="cr-st-code" style="color: #c5a059;">' + it.code + '</span>' +
                  '<span class="cr-st-name">' + escapeHtml(it.name) + '</span>' +
                '</div>' +
                '<div class="cr-st-badges">' +
                  '<span class="cr-st-badge-road">Пошлина: ' + it.duty_pct + '%</span>' +
                '</div>' +
              '</div>';
            });
            dropdown.innerHTML = html;
            dropdown.style.display = 'block';

            dropdown.querySelectorAll('.cr-station-item').forEach(function(item) {
              item.addEventListener('click', function() {
                input.value = this.getAttribute('data-code') + ' — ' + this.getAttribute('data-name');
                dropdown.style.display = 'none';
                triggerCustomCalculation();
              });
            });
          })
          .catch(function() {});
      }
    });

    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }
"""

    if 'function setupModalityTabs' not in content:
        # inject js_logic before initWidget
        target_init = 'function initWidget() {'
        content = content.replace(target_init, js_logic + '\n\n  ' + target_init, 1)

    # Call setupModalityTabs in initWidget
    if 'setupModalityTabs();' not in content:
        content = content.replace('setupStationAutocomplete(\'cr-calc-to\', \'cr-calc-to-dropdown\');', 'setupStationAutocomplete(\'cr-calc-to\', \'cr-calc-to-dropdown\');\n    setupModalityTabs();', 1)

    # Update triggerCustomCalculation to handle different modalities
    trigger_patch = """    // Обработка модальностей отличных от rail
    if (typeof currentModality !== 'undefined' && currentModality !== 'rail') {
      handleNonRailCalculation(currentModality);
      return;
    }"""

    handle_non_rail_fn = """
  function handleNonRailCalculation(modality) {
    var apiUrl = getCaravanApiUrl();
    var tableBody = document.getElementById('cr-calc-table-body');
    var totalEl = document.getElementById('cr-calc-total');
    if (!tableBody) return;

    if (modality === 'fleet') {
      var wType = (document.getElementById('cr-fleet-type') ? document.getElementById('cr-fleet-type').value : 'grain');
      var wCount = parseInt(document.getElementById('cr-fleet-count') ? document.getElementById('cr-fleet-count').value : 10) || 10;
      var wDays = parseInt(document.getElementById('cr-fleet-days') ? document.getElementById('cr-fleet-days').value : 30) || 30;
      var rType = (document.getElementById('cr-fleet-rent-type') ? document.getElementById('cr-fleet-rent-type').value : 'daily');
      var routeText = (document.getElementById('cr-fleet-route') ? document.getElementById('cr-fleet-route').value : 'Акмола ➔ Ташкент');

      var rateMap = { grain: 42, covered: 38, gondola: 32, platform: 29, tank: 45 };
      var dailyRate = rateMap[wType] || 40;
      var totalUsd = dailyRate * wDays * wCount;

      tableBody.innerHTML = '<tr><td>Суточная аренда парка Caravan (' + wCount + ' ваг. x ' + wDays + ' сут.)</td><td>' + wDays + ' сут.</td><td>$' + dailyRate + '/сут.</td><td>$' + totalUsd.toLocaleString('ru-RU') + '</td></tr>' +
                            '<tr><td>Обеспечение дислокации и подсыла под погрузку</td><td>' + escapeHtml(routeText) + '</td><td>Включено</td><td>$0</td></tr>';
      if (totalEl) totalEl.textContent = '$' + totalUsd.toLocaleString('ru-RU');
      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['fleet']);

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

      var baseCost = (rType === 'reefer' ? 6200 : (rType === 'mega' ? 5600 : 4900));
      tableBody.innerHTML = '<tr><td>Международный автофрахт FTL (' + escapeHtml(rFrom) + ' ➔ ' + escapeHtml(rTo) + ')</td><td>~3 400 км</td><td>$' + baseCost.toLocaleString('ru-RU') + '</td><td>$' + baseCost.toLocaleString('ru-RU') + '</td></tr>' +
                            '<tr><td>Транзитные погранпереходы и таможенное сопровождение</td><td>РФ / КЗХ / УЗБ</td><td>Включено</td><td>$250</td></tr>';
      var totalRoad = baseCost + 250;
      if (totalEl) totalEl.textContent = '$' + totalRoad.toLocaleString('ru-RU');
      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['road']);

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

      tableBody.innerHTML = '<tr><td>Авиафрахт карго (' + aFrom + ' ➔ TAS) Оплачиваемый вес: ' + Math.round(chWeight) + ' кг</td><td>3-5 дней</td><td>$3.85/кг</td><td>$' + Math.round(chWeight * 3.85).toLocaleString('ru-RU') + '</td></tr>' +
                            '<tr><td>Терминальный сбор аэропорта TAS и обработка</td><td>СВХ Карго</td><td>Включено</td><td>$120</td></tr>';
      if (totalEl) totalEl.textContent = '$' + airCost.toLocaleString('ru-RU');
      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['air']);

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
      var mTotal = 5400 * mCount;

      tableBody.innerHTML = '<tr><td>Морской фрахт + Терминальная обработка THC в порту</td><td>Контейнер 40HC x ' + mCount + '</td><td>$1 450/ед</td><td>$' + (1450 * mCount).toLocaleString('ru-RU') + '</td></tr>' +
                            '<tr><td>Ускоренный контейнерный поезд (Ж/Д платформа до Ташкента)</td><td>16-20 дней</td><td>$3 600/ед</td><td>$' + (3600 * mCount).toLocaleString('ru-RU') + '</td></tr>' +
                            '<tr><td>Автодоставка последней мили на склад грузополучателя</td><td>Door-to-Door</td><td>$350/ед</td><td>$' + (350 * mCount).toLocaleString('ru-RU') + '</td></tr>';
      if (totalEl) totalEl.textContent = '$' + mTotal.toLocaleString('ru-RU');
      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['multimodal']);

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
      var cTotalBase = cVal + cFreight;
      var cDuty = Math.round(cTotalBase * 0.05);
      var cVat = Math.round((cTotalBase + cDuty) * 0.12);
      var cFee = 65;
      var cTotalFiscal = cDuty + cVat + cFee;

      tableBody.innerHTML = '<tr><td>Ввозная таможенная пошлина (базовая ставка 5%)</td><td>База: $' + cTotalBase.toLocaleString('ru-RU') + '</td><td>5%</td><td>$' + cDuty.toLocaleString('ru-RU') + '</td></tr>' +
                            '<tr><td>Налог на добавленную стоимость (НДС 12% Узбекистан)</td><td>База: $' + (cTotalBase + cDuty).toLocaleString('ru-RU') + '</td><td>12%</td><td>$' + cVat.toLocaleString('ru-RU') + '</td></tr>' +
                            '<tr><td>Сбор за таможенное оформление (БРВ)</td><td>Декларация</td><td>Фикс</td><td>$' + cFee + '</td></tr>';
      if (totalEl) totalEl.textContent = '$' + cTotalFiscal.toLocaleString('ru-RU') + ' (~' + Math.round(cTotalFiscal * 12850).toLocaleString('ru-RU') + ' сум)';
      renderDocumentChecklist(DEFAULT_DOCS_BY_MODALITY['customs']);

      if (apiUrl) {
        var tnvedVal = document.getElementById('cr-customs-tnved') ? document.getElementById('cr-customs-tnved').value : '1001990000';
        fetch(apiUrl + '/api/calculate/customs', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ tnved: tnvedVal, value: cVal, freight: cFreight })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d && d.documents_required) renderDocumentChecklist(d.documents_required);
        }).catch(function() {});
      }
    }
  }
"""

    if 'function handleNonRailCalculation' not in content:
        # inject handle_non_rail_fn before triggerCustomCalculation
        target_trig = 'function triggerCustomCalculation() {'
        content = content.replace(target_trig, handle_non_rail_fn + '\n  ' + target_trig, 1)

    if 'if (typeof currentModality !== \'undefined\'' not in content:
        target_trig_body = 'function triggerCustomCalculation() {'
        content = content.replace(target_trig_body, target_trig_body + '\n' + trigger_patch, 1)

    with open('caravan-tracking-widget.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ caravan-tracking-widget.html updated with multi-modal panels and document checklist.")

    # Recompile bundles
    subprocess.run(["python3", "build_widget_bundle.py"], check=True)
    subprocess.run(["python3", "patch_widget_and_index.py"], check=True)
    print("✓ Recompiled widget bundle and synchronized index.html.")

if __name__ == '__main__':
    apply()
