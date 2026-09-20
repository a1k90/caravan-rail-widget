import re

with open('caravan-tracking-widget.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Booking modal HTML to restore before </style> or right after cr-tab-calc
booking_modal_html = """
  <!-- МОДАЛЬНОЕ ОКНО БРОНИРОВАНИЯ СТАВКИ (ДЛЯ B2B ПЛАТФОРМЫ) -->
  <div id="cr-booking-modal" class="cr-booking-modal" style="display: none;">
    <div class="cr-bm-card">
      <div class="cr-bm-header">
        <h4>Бронирование ставки и заказ официального КП</h4>
        <button type="button" class="cr-bm-close" id="cr-bm-close">&times;</button>
      </div>
      <div class="cr-bm-body">
        <div class="cr-bm-summary-text" id="cr-bm-summary-text">
          <!-- Заполняется динамически -->
        </div>
        <form id="cr-booking-form" class="cr-booking-form" onsubmit="return false;">
          <div class="cr-form-field">
            <label>Контактное лицо (ФИО ответственного) *</label>
            <input type="text" id="cr-book-name" class="cr-input" placeholder="Иванов Алексей Петрович" required />
          </div>
          <div class="cr-form-field">
            <label>Телефон для связи и подтверждения *</label>
            <input type="tel" id="cr-book-phone" class="cr-input" placeholder="+7 (___) ___-__-__" required />
          </div>
          <div class="cr-form-field">
            <label>Наименование компании (грузоотправителя/получателя) *</label>
            <input type="text" id="cr-book-company" class="cr-input" placeholder="ТОО / ООО / ИП Название Компании" required />
          </div>
          <div class="cr-bm-actions">
            <button type="submit" class="cr-btn-primary" id="cr-btn-submit-booking">
              Подтвердить бронирование ставки
            </button>
          </div>
        </form>
        <div id="cr-booking-success" class="cr-alert-success" style="display: none;">
          <h4 id="cr-book-success-title">Заявка на расчет и бронирование принята!</h4>
          <p>Специалисты Caravan Railroad зафиксировали ставку и сформируют официальное коммерческое предложение с печатью в вашем личном кабинете B2B в течение 15 минут.</p>
        </div>
      </div>
    </div>
  </div>
"""

# Check where cr-kp-modal is
kp_idx = html.find('<div id="cr-kp-modal"')
if kp_idx != -1 and 'id="cr-booking-modal"' not in html:
    html = html[:kp_idx] + booking_modal_html + '\n  ' + html[kp_idx:]
    print('Inserted booking_modal_html before cr-kp-modal')

# 2. Make all void tags XML/XHTML compliant (<input ... /> and <br />) for Tilda validator
html = re.sub(r'<br\s*>', '<br />', html)

def close_input(match):
    tag = match.group(0)
    if tag.endswith('/>'):
        return tag
    return tag[:-1].rstrip() + ' />'

html = re.sub(r'<input\b[^>]*>', close_input, html)

# 3. In <style>, add Google Fonts @import at the very top so Tilda never needs a <link> tag
if '@import url' not in html:
    font_import = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Unbounded:wght@600;700;800&display=swap');\n"
    style_start = html.find('<style>') + len('<style>\n')
    html = html[:style_start] + '  ' + font_import + html[style_start:]
    print('Added @import fonts to <style>')

with open('caravan-tracking-widget.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Saved caravan-tracking-widget.html successfully!')
