import json, re

# Load stations from railway_stations.json
with open('railway_stations.json', 'r', encoding='utf-8') as f:
    stations = json.load(f)

# Load engine code
with open('railway_calc_engine.js', 'r', encoding='utf-8') as f:
    engine_js = f.read()

# Load current widget HTML
with open('caravan-tracking-widget.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. NEW HTML FOR cr-tab-calc
new_calc_html = """    <div class="cr-tab-content" id="cr-tab-calc">
      <div class="cr-calc-header-box">
        <div class="cr-tab-intro">
          <h3>Железнодорожный калькулятор тарифов (База R-Тариф 1520 мм)</h3>
          <p>Поучастковый расчет провозной платы по железным дорогам стран СНГ (КТЖ, УТИ, РЖД), подбор межгосударственных стыков, расчет аренды парка Caravan Railroad и условий Incoterms 2020.</p>
        </div>

        <div class="cr-submode-toggles">
          <button type="button" class="cr-submode-btn" id="cr-btn-mode-preset">Регулярные направления</button>
          <button type="button" class="cr-submode-btn active" id="cr-btn-mode-custom">Индивидуальный расчет (R-Тариф)</button>
        </div>
      </div>

      <!-- РЕЖИМ А: РЕГУЛЯРНЫЕ МАРШРУТЫ С ОБНОВЛЯЕМЫМИ ЦЕНАМИ -->
      <div id="cr-calc-preset-view" style="display: none;">
        <div class="cr-preset-routes-grid" id="cr-preset-routes-container"></div>
      </div>

      <!-- РЕЖИМ Б: ИНДИВИДУАЛЬНЫЙ РАСЧЕТ ПО СЕТИ И ПРАВИЛАМ R-ТАРИФ -->
      <div id="cr-calc-custom-view" style="display: block;">
        <form id="cr-calc-form" class="cr-calc-form" onsubmit="return false;">
          
          <!-- ВЫБОР СТОРОНЫ ДОГОВОРА (РОЛЬ КЛИЕНТА) -->
          <div class="cr-role-selection-box">
            <label class="cr-field-caption">Ваша сторона в перевозке (определение зоны ответственности):</label>
            <div class="cr-role-pills">
              <label class="cr-role-pill active">
                <input type="radio" name="cr_client_role" value="shipper" checked>
                <span>Грузоотправитель (Shipper)</span>
              </label>
              <label class="cr-role-pill">
                <input type="radio" name="cr_client_role" value="consignee">
                <span>Грузополучатель (Consignee)</span>
              </label>
              <label class="cr-role-pill">
                <input type="radio" name="cr_client_role" value="forwarder">
                <span>Экспедитор / Агент (Forwarder)</span>
              </label>
            </div>
          </div>

          <!-- СЕТКА ПАРАМЕТРОВ РАСЧЕТА -->
          <div class="cr-calc-inputs-grid">
            
            <!-- СТАНЦИЯ ОТПРАВЛЕНИЯ -->
            <div class="cr-form-field cr-station-autocomplete-wrap">
              <label>Станция отправления (название или 6-значный код)</label>
              <div class="cr-input-wrapper">
                <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                <input type="text" id="cr-calc-from" class="cr-input" placeholder="Введите название или код (напр. Кокшетау, 687008)" value="Кокшетау (687008, КТЖ)" autocomplete="off">
                <div id="cr-calc-from-dropdown" class="cr-station-dropdown" style="display: none;"></div>
              </div>
            </div>

            <!-- СТАНЦИЯ НАЗНАЧЕНИЯ -->
            <div class="cr-form-field cr-station-autocomplete-wrap">
              <label>Станция назначения (название или 6-значный код)</label>
              <div class="cr-input-wrapper">
                <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <input type="text" id="cr-calc-to" class="cr-input" placeholder="Введите станцию (напр. Ташкент-Товарный, 720000)" value="Ташкент-Товарный (720000, УТИ)" autocomplete="off">
                <div id="cr-calc-to-dropdown" class="cr-station-dropdown" style="display: none;"></div>
              </div>
            </div>

            <!-- ПОГРАНПЕРЕХОД / СТЫК -->
            <div class="cr-form-field">
              <label>Межгосударственный стыковой пункт / Погранпереход</label>
              <div class="cr-input-wrapper">
                <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <select id="cr-calc-border" class="cr-select">
                  <option value="auto" selected>Определять автоматически по плану формирования</option>
                  <option value="704101">Сарыагаш (эксп.) [КТЖ] / Келес [УТИ] (Казахстан — Узбекистан)</option>
                  <option value="708507">Достык (эксп.) [КТЖ] / Алашанькоу (Китай — Казахстан)</option>
                  <option value="707701">Алтынколь (эксп.) [КТЖ] / Хоргос (Китай — Казахстан)</option>
                  <option value="666501">Илецк I (эксп.) [Ю-Ур / КТЖ] (Россия — Казахстан)</option>
                  <option value="664900">Озинки (эксп.) [Прив / КТЖ] (Россия — Казахстан)</option>
                  <option value="711105">Локоть (эксп.) [З-Сиб / КТЖ] (Россия — Казахстан)</option>
                  <option value="688708">Петропавловск (эксп.) [Ю-Ур / КТЖ] (Россия — Казахстан)</option>
                  <option value="662905">Бейнеу (эксп.) / Каракалпакстан (Мангышлак — Узбекистан)</option>
                  <option value="734606">Галаба (эксп.) [УТИ] / Хайратан (Узбекистан — Афганистан)</option>
                  <option value="736501">Ходжадавлет (эксп.) [УТИ] / Фарап (Узбекистан — Туркменистан)</option>
                  <option value="736003">Кудукли (эксп.) [УТИ] / Пахтаабад (Узбекистан — Таджикистан)</option>
                </select>
              </div>
            </div>

            <!-- РАССТОЯНИЕ -->
            <div class="cr-form-field">
              <label>Расстояние маршрута (км)</label>
              <div class="cr-input-wrapper">
                <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                <input type="number" id="cr-calc-km" class="cr-input" value="1805" min="50" max="15000">
              </div>
              <div class="cr-quick-km">
                <span class="cr-km-chip" data-km="500">500 км</span>
                <span class="cr-km-chip" data-km="1200">1 200 км</span>
                <span class="cr-km-chip" data-km="1805">1 805 км</span>
                <span class="cr-km-chip" data-km="2800">2 800 км</span>
                <span class="cr-km-chip" data-km="4200">4 200 км</span>
              </div>
            </div>

            <!-- РОД ПОДВИЖНОГО СОСТАВА -->
            <div class="cr-form-field">
              <label>Род подвижного состава</label>
              <select id="cr-calc-transport" class="cr-select">
                <option value="grain" selected>Зерновоз / Хоппер (для зерна, 70 тн, 116 м³)</option>
                <option value="boxcar">Крытый вагон (грузовой, 68 тн, 138 м³)</option>
                <option value="gondola">Полувагон (универсальный 4-осный, 70 тн)</option>
                <option value="tank">Цистерна (наливные грузы / ГСМ, 66 тн)</option>
                <option value="platform">Фитинговая платформа (тяжеловесы/негабарит)</option>
                <option value="cont40">Контейнер 40ft High Cube (HQ, 28 тн, 76 м³)</option>
                <option value="cont20">Контейнер 20ft (универсальный, 24 тн, 33 м³)</option>
              </select>
            </div>

            <!-- ПРИНАДЛЕЖНОСТЬ ПАРКА -->
            <div class="cr-form-field">
              <label>Принадлежность подвижного состава</label>
              <select id="cr-calc-park" class="cr-select">
                <option value="caravan" selected>Собственный парк Caravan Railroad (СПС) — фикс. ставка</option>
                <option value="inventory">Инвентарный парк ж/д администраций (КТЖ/УТИ/РЖД)</option>
              </select>
            </div>

            <!-- НОМЕНКЛАТУРА ГРУЗА -->
            <div class="cr-form-field">
              <label>Род груза (ЕТСНГ / ГНГ)</label>
              <select id="cr-calc-cargo" class="cr-select">
                <option value="grain" selected>Зерновые культуры (пшеница, мука, ячмень) — 2 класс</option>
                <option value="metals">Черные и цветные металлы, металлопрокат — 2 класс</option>
                <option value="minerals">Каменный уголь, руда, минсырье — 1 класс</option>
                <option value="building">Цемент, кирпич, стройматериалы — 2 класс</option>
                <option value="oil">Нефтепродукты, мазут, ГСМ (налив) — 2 класс</option>
                <option value="machinery">Промышленное оборудование, техника — 3 класс</option>
                <option value="consumer">Товары народного потребления (ТНП), сборные — 3 класс</option>
                <option value="dangerous">Опасные грузы (ADR / ОГ 2-9 классы) — спецтариф</option>
              </select>
            </div>

            <!-- МАССА ГРУЗА -->
            <div class="cr-form-field">
              <label>Масса груза нетто (тонн)</label>
              <div class="cr-input-wrapper">
                <svg class="cr-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <input type="number" id="cr-calc-weight" class="cr-input" value="68" min="1" max="75">
              </div>
            </div>

            <!-- БАЗИС INCOTERMS 2020 -->
            <div class="cr-form-field">
              <label>Базис поставки (Incoterms 2020)</label>
              <select id="cr-calc-incoterms" class="cr-select">
                <option value="DAP" selected>DAP — Доставка «До двери» (склад получателя)</option>
                <option value="CIP">CIP — Перевозка + Страхование груза (110% стоимости)</option>
                <option value="CPT">CPT — Перевозка оплачена до станции назначения</option>
                <option value="FCA">FCA — Перевозчик в месте отправления (забор у поставщика)</option>
                <option value="DDP">DDP — «Под ключ» (полная таможенная очистка + пошлины + склад)</option>
              </select>
            </div>

            <!-- ВИД СООБЩЕНИЯ -->
            <div class="cr-form-field">
              <label>Вид перевозки</label>
              <select id="cr-calc-freight-type" class="cr-select">
                <option value="rail" selected>Прямая Ж/Д перевозка (поезда / повагонно)</option>
                <option value="multimodal">Мультимодальная (Ж/Д + Авто до склада)</option>
                <option value="intermodal">Интермодальная (Ж/Д + Море / Паромный стык)</option>
              </select>
            </div>

            <!-- ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ -->
            <div class="cr-form-field cr-span-2">
              <label>Дополнительные опции безопасности и сопровождения</label>
              <div class="cr-checkbox-group-inline">
                <label class="cr-checkbox-label">
                  <input type="checkbox" id="cr-opt-security" checked>
                  <span>Военизированная охрана и сменное сопровождение (ВЖДО на всем пути)</span>
                </label>
                <label class="cr-checkbox-label">
                  <input type="checkbox" id="cr-opt-customs">
                  <span>Таможенно-брокерское декларирование и сертификация</span>
                </label>
              </div>
            </div>

          </div>

          <!-- ВИЗУАЛЬНАЯ СХЕМА МАРШРУТА -->
          <div class="cr-route-scheme-card" id="cr-route-scheme-box">
            <div class="cr-rs-header">
              <span class="cr-rs-badge" id="cr-rs-badge">Международное сообщение (Казахстан ➔ Узбекистан)</span>
              <span class="cr-rs-distance" id="cr-rs-distance">Общий путь: 1 805 км</span>
            </div>
            <div class="cr-rs-flow" id="cr-rs-flow">
              <div class="cr-rs-step">
                <span class="cr-rs-dot origin"></span>
                <div>
                  <div class="cr-rs-name" id="cr-rs-from-name">ст. Кокшетау (687008)</div>
                  <div class="cr-rs-sub" id="cr-rs-from-sub">Казахстанские ж.д. (КТЖ)</div>
                </div>
              </div>
              <div class="cr-rs-line">
                <span class="cr-rs-line-info" id="cr-rs-line-1">КТЖ: 1 770 км</span>
              </div>
              <div class="cr-rs-step">
                <span class="cr-rs-dot border"></span>
                <div>
                  <div class="cr-rs-name" id="cr-rs-border-name">ст. Сарыагаш (эксп.) / Келес</div>
                  <div class="cr-rs-sub">Межгосударственный стыковой пункт</div>
                </div>
              </div>
              <div class="cr-rs-line">
                <span class="cr-rs-line-info" id="cr-rs-line-2">УТИ: 35 км</span>
              </div>
              <div class="cr-rs-step">
                <span class="cr-rs-dot dest"></span>
                <div>
                  <div class="cr-rs-name" id="cr-rs-to-name">ст. Ташкент-Товарный (720000)</div>
                  <div class="cr-rs-sub" id="cr-rs-to-sub">Узбекские ж.д. (УТИ)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ДИНАМИЧЕСКИЙ БЛОК: ЗОНА ОТВЕТСТВЕННОСТИ CARAVAN RAILROAD -->
          <div class="cr-incoterms-banner" id="cr-incoterms-banner">
            <div class="cr-ib-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
            <div>
              <div class="cr-ib-title" id="cr-ib-title">Зона ответственности Caravan Railroad: DAP (Delivered at Place)</div>
              <div class="cr-ib-desc" id="cr-ib-desc">
                Компания берет на себя: подачу подвижного состава ➔ станционные сборы ➔ оплату Ж/Д тарифа всех администраций (КТЖ/УТИ) ➔ прохождение межгосударственного стыка ➔ автодоставку «последней мили» непосредственно на склад грузополучателя.
              </div>
            </div>
          </div>

        </form>
      </div>

      <!-- КАРТОЧКА РАСЧИТАННОГО ТАРИФА (R-ТАРИФ ДЕТАЛИЗАЦИЯ) -->
      <div id="cr-calc-result-box" class="cr-calc-result-box">
        <div class="cr-crb-top">
          <div>
            <div class="cr-crb-title" id="cr-quote-route-title">ст. Кокшетау ➔ ст. Ташкент-Товарный</div>
            <div class="cr-quote-badges" id="cr-quote-badges">
              <span class="cr-qbadge" id="cr-qb-transport">Зерновоз / Хоппер (70 тн)</span>
              <span class="cr-qbadge" id="cr-qb-park">Собственный парк Caravan (СПС)</span>
              <span class="cr-qbadge" id="cr-qb-cargo">Зерновые (2 класс)</span>
              <span class="cr-qbadge" id="cr-qb-incoterms">DAP (До склада)</span>
            </div>
          </div>

          <div class="cr-crb-total-box">
            <!-- ПЕРЕКЛЮЧАТЕЛЬ ВАЛЮТ РАСЧЕТА -->
            <div class="cr-currency-pills">
              <button type="button" class="cr-cur-pill active" data-cur="USD">USD ($)</button>
              <button type="button" class="cr-cur-pill" data-cur="KZT">KZT (₸)</button>
              <button type="button" class="cr-cur-pill" data-cur="UZS">UZS (сум)</button>
              <button type="button" class="cr-cur-pill" data-cur="RUB">RUB (₽)</button>
            </div>
            <div class="cr-crb-total-val" id="cr-quote-total-price">$2 680 USD</div>
            <div class="cr-crb-transit" id="cr-quote-transit-days">Нормативный срок доставки: 5-7 суток</div>
          </div>
        </div>

        <div class="cr-client-discount-badge" id="cr-client-discount-pill" style="display: none;">
          Партнерская скидка контрагента: <strong id="cr-client-discount-val">0%</strong>
        </div>

        <!-- ДЕТАЛИЗИРОВАННАЯ ИТОГОВАЯ ТАБЛИЦА ПО СТРАНАМ (ПО СТАНДАРТУ R-ТАРИФ) -->
        <div class="cr-rtariff-table-wrap">
          <div class="cr-rtariff-table-title">Подробности расчета по участкам маршрута (R-Тариф):</div>
          <table class="cr-rtariff-table" id="cr-rtariff-table">
            <thead>
              <tr>
                <th>Страна / Администрация</th>
                <th>Участок маршрута</th>
                <th class="cr-text-right">Расст., км</th>
                <th class="cr-text-right">Ж/Д тариф (Инфраструктура)</th>
                <th class="cr-text-right">Предоставление вагона (Caravan)</th>
                <th class="cr-text-right">Сборы и стык</th>
                <th class="cr-text-right">Охрана ВЖДО</th>
                <th class="cr-text-right">Итого по участку</th>
              </tr>
            </thead>
            <tbody id="cr-rtariff-tbody">
              <!-- Заполняется динамически JS -->
            </tbody>
          </table>
        </div>

        <div class="cr-calc-actions">
          <button type="button" class="cr-btn-primary cr-btn-book" id="cr-btn-open-booking">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Забронировать ставку и запросить официальное КП</span>
          </button>
          <div class="cr-disclaimer-text">
            * Расчет выполнен по алгоритмам Тарифной политики ОСЖД / СНГ, ТП КТЖ и ТП УТИ. Для фиксации ставки нажмите «Забронировать», и заявка будет передана в B2B платформу Caravan Railroad.
          </div>
        </div>
      </div>
    </div>
"""

# Replace cr-tab-calc
start_tag = '<div class="cr-tab-content" id="cr-tab-calc">'
login_tag = 'id="cr-tab-login"'
start_idx = html.find(start_tag)
login_idx = html.find(login_tag)
div_before_login = html.rfind('<div', 0, login_idx)

html_part1 = html[:start_idx]
html_part2 = html[div_before_login:]
html = html_part1 + new_calc_html + '\n\n    ' + html_part2

print('HTML replaced cr-tab-calc successfully.')

# 2. ADD CSS TO <style>
new_css = """
  /* AUTOCOMPLETE DROPDOWN ДЛЯ СТАНЦИЙ */
  .cr-station-autocomplete-wrap { position: relative; }
  .cr-station-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0; right: 0;
    background: #0B1325;
    border: 1px solid var(--cr-amber);
    border-radius: 12px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.75);
    z-index: 1000;
    max-height: 280px;
    overflow-y: auto;
    padding: 6px;
    backdrop-filter: blur(16px);
  }
  .cr-station-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    gap: 10px;
  }
  .cr-station-item:hover { background: rgba(245, 158, 11, 0.18); }
  .cr-st-left { display: flex; align-items: center; gap: 10px; }
  .cr-st-code {
    font-family: monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--cr-amber);
    background: rgba(245, 158, 11, 0.15);
    padding: 2px 6px;
    border-radius: 4px;
  }
  .cr-st-name { font-size: 13px; font-weight: 600; color: #F8FAFC; }
  .cr-st-badges { display: flex; align-items: center; gap: 6px; }
  .cr-st-badge-road {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    background: rgba(37, 99, 235, 0.2);
    color: #60A5FA;
    border: 1px solid rgba(37, 99, 235, 0.3);
  }
  .cr-st-badge-border {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.2);
    color: #F87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  /* ВИЗУАЛЬНАЯ СХЕМА МАРШРУТА */
  .cr-route-scheme-card {
    background: rgba(15, 23, 42, 0.88);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 14px;
    padding: 18px 24px;
    margin: 20px 0;
  }
  .cr-rs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cr-rs-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(245, 158, 11, 0.15);
    color: var(--cr-amber);
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 9999px;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
  .cr-rs-distance { font-size: 13px; color: #94A3B8; font-weight: 600; }
  .cr-rs-flow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .cr-rs-step { display: flex; align-items: center; gap: 10px; }
  .cr-rs-dot {
    width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
  }
  .cr-rs-dot.origin { background: #10B981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
  .cr-rs-dot.border { background: #F59E0B; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5); }
  .cr-rs-dot.dest { background: #3B82F6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
  .cr-rs-name { font-size: 14px; font-weight: 700; color: #F8FAFC; }
  .cr-rs-sub { font-size: 12px; color: #94A3B8; }
  .cr-rs-line {
    flex: 1; height: 2px;
    background: rgba(255, 255, 255, 0.15);
    position: relative;
    min-width: 60px;
    text-align: center;
  }
  .cr-rs-line-info {
    position: absolute;
    top: -18px; left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    color: var(--cr-amber);
    font-weight: 600;
    white-space: nowrap;
  }

  /* ПЕРЕКЛЮЧАТЕЛЬ ВАЛЮТ */
  .cr-currency-pills { display: flex; gap: 6px; margin-bottom: 8px; justify-content: flex-end; }
  .cr-cur-pill {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #94A3B8;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cr-cur-pill.active {
    background: var(--cr-amber);
    color: #070B14;
    border-color: var(--cr-amber);
  }

  /* R-ТАРИФ ТАБЛИЦА */
  .cr-rtariff-table-wrap {
    margin-top: 20px;
    background: rgba(11, 19, 37, 0.85);
    border: 1px solid var(--cr-border);
    border-radius: 12px;
    padding: 16px;
    overflow-x: auto;
  }
  .cr-rtariff-table-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--cr-amber);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 12px;
  }
  .cr-rtariff-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    color: #E2E8F0;
  }
  .cr-rtariff-table th {
    text-align: left;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.04);
    color: #94A3B8;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .cr-rtariff-table td {
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .cr-rtariff-table tr.total-row td {
    font-weight: 800;
    color: var(--cr-amber);
    border-top: 2px solid rgba(245, 158, 11, 0.4);
    background: rgba(245, 158, 11, 0.06);
  }
  .cr-text-right { text-align: right !important; }
  .cr-quote-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
  .cr-qbadge {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 6px;
    color: #CBD5E1;
  }
"""

style_tag = '</style>'
s_idx = html.find(style_tag)
html = html[:s_idx] + new_css + '\n' + html[s_idx:]
print('Added new CSS successfully.')

# 3. INSERT CaravanRailwayEngine INTO SCRIPT
script_start = html.find('<script>') + len('<script>\n')
html = html[:script_start] + engine_js + '\n\n' + html[script_start:]
print('Inserted CaravanRailwayEngine into script.')

with open('caravan-tracking-widget.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Saved caravan-tracking-widget.html successfully! New length:', len(html))
