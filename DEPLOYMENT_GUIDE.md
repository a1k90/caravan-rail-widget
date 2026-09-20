# 🚀 Инструкция по развертыванию Мега-Калькулятора Caravan Logistics & Customs

Полноценная цифровая экосистема 4PL логистики и таможенного оформления (Ж/Д 1520 мм, Аренда ПС, Автоперевозки, Авиакарго, Мультимодал, АИС Таможня ВЭД и Умный чек-лист документов).

---

## 🧭 Что входит в состав системы

1. **`caravan_logistics.db`** (33.2 МБ) — Единая оптимизированная база данных SQLite:
   * **13 694 железнодорожные станции** СНГ с кодами ЕСР, дорогами и погранпереходами (МГСП).
   * **13 140 кодов ТН ВЭД** из официальной базы АИС Таможня со ставками пошлин, акцизов и НДС (12%/20%).
   * **409 товарных позиций ЕТСНГ** с тарифными классами и родами вагонов.
   * **144 официальных вида документов** (СМГС, CMR, AWB, коносамент, СТ-1, фитосанитарный, ветеринарный, ГТД/ДТ, ВУ-23М/36М).
   * База суточных ставок аренды парка Caravan Railroad (хопперы-зерновозы, крытые, полувагоны, платформы, цистерны).
   * Международные грузовые авиахабы (CAN, PVG, SVO, IST, DXB, FRA) с формулой IATA Chargeable Weight ($L \times W \times H / 6000$).
2. **`server/server.py`** — Высокоскоростной микросервис REST API (Python 3):
   * Время отклика: **2–5 миллисекунд**!
   * 0 сторонних библиотек (работает из коробки на стандартном Python).
   * Встроенный CORS для работы с любого домена (Tilda, локальный сайт, мобильные приложения).
3. **`caravan-widget.js` и `caravan-widget.css`** — Интерактивный фронтенд-модуль:
   * Весит всего ~190 КБ — открывается на сайте за доли секунды.
   * Переключение 6 модальностей:
     `[ 🚆 Ж/Д 1520 ] [ 🏢 Аренда ПС ] [ 🚛 Автоперевозки ] [ ✈️ Авиакарго ] [ 🌐 Мультимодал ] [ 📋 Таможня & ВЭД ]`
   * Встроенный блок **«📄 Необходимый пакет документов для перевозки»** с кнопками:
     * *«Скопировать чек-лист»* — сохраняет готовый список в буфер обмена.
     * *«В WhatsApp»* — отправляет клиенту или менеджеру готовое сообщение со списком документов.
   * Автоматический офлайн-фоллбэк: если сервер временно недоступен, виджет рассчитывает базовую стоимость на встроенных алгоритмах без ошибок.

---

## 🛠 Вариант 1. Локальный запуск (на вашем компьютере)

Запустить сервер на вашем Mac или Windows-компьютере:

```bash
cd /Users/asilbek/Documents/CaravanRailRoad
PORT=8090 python3 server/server.py
```

### Проверка работы API в браузере:
* Статус сервера: [http://localhost:8090/api/health](http://localhost:8090/api/health)
* Поиск станции (из 13 694): `http://localhost:8090/api/stations?q=Самара`
* Поиск ТН ВЭД (из 13 140): `http://localhost:8090/api/customs/tnved?q=пшеница`
* Локальный стенд виджета: [http://localhost:8085/test_embed.html?v=350](http://localhost:8085/test_embed.html?v=350)

---

## ☁️ Вариант 2. Бесплатный круглосуточный запуск 24/7 (РЕКОМЕНДУЕТСЯ)

Чтобы калькулятор работал 24/7/365 независимо от вашего компьютера, подключите его к бесплатному облаку **Render.com**:

### Шаг 1. Отправьте обновлённые файлы в GitHub
```bash
git add caravan_logistics.db server/ build_mega_database.py caravan-widget.js caravan-widget.css caravan-tracking-widget.html index.html DEPLOYMENT_GUIDE.md
git commit -m "Upgrade: Caravan Mega-Calculator with 6 modalities, AIS Customs & Document Checklist"
git push origin main
```

### Шаг 2. Запуск на Render.com (занимает 2 минуты):
1. Зайдите на [render.com](https://render.com) (вход через GitHub в 1 клик).
2. Нажмите **«New +»** ➔ **«Web Service»**.
3. Выберите ваш репозиторий `CaravanRailRoad`.
4. Заполните настройки:
   * **Name**: `caravan-rail-api`
   * **Language**: `Python 3`
   * **Build Command**: `python3 build_mega_database.py` (или оставить пустым, если файл `.db` залит в git)
   * **Start Command**: `python3 server/server.py`
   * **Plan**: `Free` ($0 / месяц)
5. Нажмите **«Deploy Web Service»**.

Render выдаст вам постоянную защищённую ссылку, например:
👉 **`https://caravan-rail-api.onrender.com`**

---

## 🌐 Как подключить это к вашему сайту на Tilda

В Tilda в HTML-блоке (T123), где размещён виджет Caravan Railroad, укажите **всего 1 строчку с адресом сервера**:

```html
<!-- 1. Указываем адрес API сервера Caravan -->
<script>
  window.CARAVAN_API_URL = "https://caravan-rail-api.onrender.com";
</script>

<!-- 2. Подключение стилей и скрипта виджета Caravan Railroad -->
<link rel="stylesheet" href="https://asilbek00199.github.io/CaravanRailRoad/caravan-widget.css">
<script src="https://asilbek00199.github.io/CaravanRailRoad/caravan-widget.js"></script>
<div id="caravan-tracking-app"></div>
```

---

## 📁 Какие файлы куда заливать (Шпаргалка):

* **В репозиторий GitHub (`origin/main`)**:
  1. `caravan-widget.js` и `caravan-widget.css` — отдаются через GitHub Pages на ваш сайт Tilda.
  2. `server/server.py` и `caravan_logistics.db` — серверная часть для Render.com / облака.
  3. `index.html` — главная страница сайта с интегрированным виджетом.
* **В Tilda (блок T123)**:
  Только короткий 5-строчный код (указан выше). Все обновления стилей, баз и логики подтягиваются на сайт **автоматически** при каждом обновлении репозитория!
