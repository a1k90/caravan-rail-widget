/**
 * Caravan Railroad — Цифровое тарифное ядро "Caravan 1520"
 * Собственная разработка логистической компании Caravan Railroad.
 * Реализует поучастковую тарификацию по сети железных дорог колеи 1520 мм
 * (Казахстан КТЖ, Узбекистан УТИ, Россия РЖД, стыки с Китаем, Афганистаном, Туркменистаном),
 * транзитные коридоры (РЖД -> КТЖ -> УТИ), расчет нормативного километража, подбор погранпереходов, предоставление парка СПС и Incoterms 2020.
 */

var CaravanRailwayEngine = (function() {

  // 1. БАЗА СТАНЦИЙ СЕТИ 1520 ММ
  var STATIONS = [
  {
    "code": "000251",
    "name": "Хайратан (эксп.)",
    "country": "AFG",
    "road": "АРА",
    "is_border": true,
    "road_label": "АРА (Афганистан)",
    "country_name": "Афганистан"
  },
  {
    "code": "663404",
    "name": "Актау-Порт (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "707701",
    "name": "Алтынколь (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "662905",
    "name": "Бейнеу (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "708507",
    "name": "Достык (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "666501",
    "name": "Илецк I (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "693602",
    "name": "Курык-Порт (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "711105",
    "name": "Локоть (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "704402",
    "name": "Луговая (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "664900",
    "name": "Озинки (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "688708",
    "name": "Петропавловск (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "704101",
    "name": "Сарыагаш (эксп.)",
    "country": "KAZ",
    "road": "КТЖ",
    "is_border": true,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "945404",
    "name": "Забайкальск (эксп.)",
    "country": "RUS",
    "road": "РЖД",
    "is_border": true,
    "road_label": "РЖД",
    "country_name": "Россия"
  },
  {
    "code": "033907",
    "name": "Санкт-Петербург-Варшавский (эксп.)",
    "country": "RUS",
    "road": "Okt",
    "is_border": true,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "038402",
    "name": "Санкт-Петербург-Финляндский (эксп.)",
    "country": "RUS",
    "road": "Okt",
    "is_border": true,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "938805",
    "name": "Душанбе II (эксп.)",
    "country": "TJK",
    "road": "Tdzh",
    "is_border": true,
    "road_label": "Tdzh",
    "country_name": "Таджикистан"
  },
  {
    "code": "720104",
    "name": "Келес (эксп.)",
    "country": "UZB",
    "road": "УТИ",
    "is_border": true,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "735203",
    "name": "Термез (эксп.)",
    "country": "UZB",
    "road": "Uzb",
    "is_border": true,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "667909",
    "name": "Актобе",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "689503",
    "name": "Актобе I",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "689607",
    "name": "Актобе II",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "700007",
    "name": "Алматы I",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "700100",
    "name": "Алматы II",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "698004",
    "name": "Арысь I",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "690002",
    "name": "Астана",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "710507",
    "name": "Астана-Пассажирская",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "661705",
    "name": "Атырау",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "671823",
    "name": "Берказань",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "703908",
    "name": "Бурундай",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "709302",
    "name": "Жана-Семей",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "673905",
    "name": "Караганда",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "673702",
    "name": "Караганда-Новая",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "673007",
    "name": "Караганда-Сортировочная",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "674000",
    "name": "Караганда-Угольная",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "687008",
    "name": "Кокшетау I",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "687103",
    "name": "Кокшетау II",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "684001",
    "name": "Костанай",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "671707",
    "name": "Кызылорда",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "663306",
    "name": "Мангышлак",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "700204",
    "name": "Медеу",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "698019",
    "name": "ОП Арысь II",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "696102",
    "name": "Павлодар",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "696403",
    "name": "Павлодар-Порт",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "696303",
    "name": "Павлодар-Северный",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "696206",
    "name": "Павлодар-Южный",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "709406",
    "name": "Семей",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "709508",
    "name": "Семей-Грузовой",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "690200",
    "name": "Сороковая",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "706304",
    "name": "Тараз",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "697800",
    "name": "Туркестан",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "665602",
    "name": "Уральск",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "665509",
    "name": "Уральск-Товарная",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "713702",
    "name": "Усть-Каменогорск",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "713906",
    "name": "Усть-Каменогорск (перев.)",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "698606",
    "name": "Шымкент",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "694605",
    "name": "Экибастуз I",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "694709",
    "name": "Экибастуз II",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "694906",
    "name": "Экибастуз III",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "694802",
    "name": "Экибастуз-Северный",
    "country": "KAZ",
    "road": "Kzh",
    "is_border": false,
    "road_label": "КТЖ",
    "country_name": "Казахстан"
  },
  {
    "code": "716908",
    "name": "Аламедин",
    "country": "KGZ",
    "road": "Krg",
    "is_border": false,
    "road_label": "КРГ",
    "country_name": "Кыргызстан"
  },
  {
    "code": "716607",
    "name": "Бишкек I",
    "country": "KGZ",
    "road": "Krg",
    "is_border": false,
    "road_label": "КРГ",
    "country_name": "Кыргызстан"
  },
  {
    "code": "716700",
    "name": "Бишкек II",
    "country": "KGZ",
    "road": "Krg",
    "is_border": false,
    "road_label": "КРГ",
    "country_name": "Кыргызстан"
  },
  {
    "code": "180010",
    "name": "Бекасово I",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "180006",
    "name": "Бекасово-Сортировочное",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "800402",
    "name": "Дубровка-Челябинская",
    "country": "RUS",
    "road": "Ju-Ur",
    "is_border": false,
    "road_label": "РЖД (Ю-Ур)",
    "country_name": "Россия"
  },
  {
    "code": "780506",
    "name": "Екатеринбург-Пассажирский",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "780001",
    "name": "Екатеринбург-Сортировочный",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "780302",
    "name": "Екатеринбург-Товарный",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "769708",
    "name": "Заполье-Уральское",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "250302",
    "name": "Казань",
    "country": "RUS",
    "road": "Gor'k",
    "is_border": false,
    "road_label": "РЖД (Горьк)",
    "country_name": "Россия"
  },
  {
    "code": "250406",
    "name": "Казань (перев.)",
    "country": "RUS",
    "road": "Gor'k",
    "is_border": false,
    "road_label": "РЖД (Горьк)",
    "country_name": "Россия"
  },
  {
    "code": "795100",
    "name": "Каменск-Уральский",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "600909",
    "name": "Мичуринск-Уральский",
    "country": "RUS",
    "road": "Ju-Vost",
    "is_border": false,
    "road_label": "Ju-Vost",
    "country_name": "Россия"
  },
  {
    "code": "060209",
    "name": "Москва-Товарная",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "198002",
    "name": "Москва-Товарная-Киевская",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "191509",
    "name": "Москва-Товарная-Курская",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "191547",
    "name": "Москва-Товарная-Курская",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "193504",
    "name": "Москва-Товарная-Павелецкая",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "193523",
    "name": "Москва-Товарная-Павелецкая",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "194009",
    "name": "Москва-Товарная-Рязанская",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "194013",
    "name": "Москва-Товарная-Рязанская",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "198207",
    "name": "Москва-Товарная-Смоленская",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "195603",
    "name": "Москва-Товарная-Ярославская",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "851508",
    "name": "Новосибирск-Восточный",
    "country": "RUS",
    "road": "Z-Sib",
    "is_border": false,
    "road_label": "РЖД (З-Сиб)",
    "country_name": "Россия"
  },
  {
    "code": "850609",
    "name": "Новосибирск-Главный",
    "country": "RUS",
    "road": "Z-Sib",
    "is_border": false,
    "road_label": "РЖД (З-Сиб)",
    "country_name": "Россия"
  },
  {
    "code": "851005",
    "name": "Новосибирск-Главный (перев.)",
    "country": "RUS",
    "road": "Z-Sib",
    "is_border": false,
    "road_label": "РЖД (З-Сиб)",
    "country_name": "Россия"
  },
  {
    "code": "851207",
    "name": "Новосибирск-Западный",
    "country": "RUS",
    "road": "Z-Sib",
    "is_border": false,
    "road_label": "РЖД (З-Сиб)",
    "country_name": "Россия"
  },
  {
    "code": "851300",
    "name": "Новосибирск-Западный (перев.)",
    "country": "RUS",
    "road": "Z-Sib",
    "is_border": false,
    "road_label": "РЖД (З-Сиб)",
    "country_name": "Россия"
  },
  {
    "code": "850505",
    "name": "Новосибирск-Южный",
    "country": "RUS",
    "road": "Z-Sib",
    "is_border": false,
    "road_label": "РЖД (З-Сиб)",
    "country_name": "Россия"
  },
  {
    "code": "180031",
    "name": "ОП Бекасово-Центральное",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "637814",
    "name": "ОП Новосемейкино",
    "country": "RUS",
    "road": "Kbsh",
    "is_border": false,
    "road_label": "РЖД (Кбш)",
    "country_name": "Россия"
  },
  {
    "code": "834610",
    "name": "ОП Новоуральский",
    "country": "RUS",
    "road": "Z-Sib",
    "is_border": false,
    "road_label": "РЖД (З-Сиб)",
    "country_name": "Россия"
  },
  {
    "code": "179121",
    "name": "ОП Самара-Радица",
    "country": "RUS",
    "road": "Mosk",
    "is_border": false,
    "road_label": "РЖД (Моск)",
    "country_name": "Россия"
  },
  {
    "code": "525524",
    "name": "ОП Уральская",
    "country": "RUS",
    "road": "S-Kav",
    "is_border": false,
    "road_label": "РЖД (С-Кав)",
    "country_name": "Россия"
  },
  {
    "code": "654025",
    "name": "ОП Южно-Уральский заповедник",
    "country": "RUS",
    "road": "Kbsh",
    "is_border": false,
    "road_label": "РЖД (Кбш)",
    "country_name": "Россия"
  },
  {
    "code": "781701",
    "name": "Первоуральск",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "775713",
    "name": "Покровск-Уральский",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "775802",
    "name": "Покровск-Уральский",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "510100",
    "name": "Ростов-Товарный",
    "country": "RUS",
    "road": "S-Kav",
    "is_border": false,
    "road_label": "РЖД (С-Кав)",
    "country_name": "Россия"
  },
  {
    "code": "657907",
    "name": "Самара",
    "country": "RUS",
    "road": "Kbsh",
    "is_border": false,
    "road_label": "РЖД (Кбш)",
    "country_name": "Россия"
  },
  {
    "code": "036002",
    "name": "Санкт-Петербург-Балтийский",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "035300",
    "name": "Санкт-Петербург-Варшавский",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "035315",
    "name": "Санкт-Петербург-Варшавский (пассажирский багаж экс)",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "033061",
    "name": "Санкт-Петербург-Витебский",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "031812",
    "name": "Санкт-Петербург-Главный",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "030006",
    "name": "Санкт-Петербург-Сорт.-Московский",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "033502",
    "name": "Санкт-Петербург-Тов.-Витебский",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "031808",
    "name": "Санкт-Петербург-Тов.-Московский",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "038205",
    "name": "Санкт-Петербург-Финляндский",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "000001",
    "name": "Санкт-Петербургский узел",
    "country": "RUS",
    "road": "Okt",
    "is_border": false,
    "road_label": "РЖД (Окт)",
    "country_name": "Россия"
  },
  {
    "code": "848204",
    "name": "Семейкино",
    "country": "RUS",
    "road": "LUG",
    "is_border": false,
    "road_label": "LUG",
    "country_name": "Россия"
  },
  {
    "code": "849705",
    "name": "Семейкино-Новое",
    "country": "RUS",
    "road": "LUG",
    "is_border": false,
    "road_label": "LUG",
    "country_name": "Россия"
  },
  {
    "code": "637617",
    "name": "Старосемейкино (пп)",
    "country": "RUS",
    "road": "Kbsh",
    "is_border": false,
    "road_label": "РЖД (Кбш)",
    "country_name": "Россия"
  },
  {
    "code": "788107",
    "name": "Туринск-Уральский",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "768207",
    "name": "Углеуральская",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "766428",
    "name": "Хребет-Уральский",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
    "country_name": "Россия"
  },
  {
    "code": "800008",
    "name": "Челябинск-Главный",
    "country": "RUS",
    "road": "Ju-Ur",
    "is_border": false,
    "road_label": "РЖД (Ю-Ур)",
    "country_name": "Россия"
  },
  {
    "code": "800101",
    "name": "Челябинск-Грузовой",
    "country": "RUS",
    "road": "Ju-Ur",
    "is_border": false,
    "road_label": "РЖД (Ю-Ур)",
    "country_name": "Россия"
  },
  {
    "code": "800605",
    "name": "Челябинск-Южный",
    "country": "RUS",
    "road": "Ju-Ur",
    "is_border": false,
    "road_label": "РЖД (Ю-Ур)",
    "country_name": "Россия"
  },
  {
    "code": "804307",
    "name": "Южноуральск",
    "country": "RUS",
    "road": "Ju-Ur",
    "is_border": false,
    "road_label": "РЖД (Ю-Ур)",
    "country_name": "Россия"
  },
  {
    "code": "745205",
    "name": "Душанбе I",
    "country": "TJK",
    "road": "Tdzh",
    "is_border": false,
    "road_label": "Tdzh",
    "country_name": "Таджикистан"
  },
  {
    "code": "745309",
    "name": "Душанбе II",
    "country": "TJK",
    "road": "Tdzh",
    "is_border": false,
    "road_label": "Tdzh",
    "country_name": "Таджикистан"
  },
  {
    "code": "747802",
    "name": "Худжанд",
    "country": "TJK",
    "road": "Tdzh",
    "is_border": false,
    "road_label": "Tdzh",
    "country_name": "Таджикистан"
  },
  {
    "code": "758900",
    "name": "Кенеургенч",
    "country": "TKM",
    "road": "Trk",
    "is_border": false,
    "road_label": "ТРК",
    "country_name": "Туркменистан"
  },
  {
    "code": "505102",
    "name": "Семейкино",
    "country": "UKR",
    "road": "DON",
    "is_border": false,
    "road_label": "DON",
    "country_name": "UKR"
  },
  {
    "code": "508505",
    "name": "Семейкино-Новое",
    "country": "UKR",
    "road": "DON",
    "is_border": false,
    "road_label": "DON",
    "country_name": "UKR"
  },
  {
    "code": "722608",
    "name": "Ангрен",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "743604",
    "name": "Андижан I",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "742003",
    "name": "Андижан II",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "743708",
    "name": "Андижан-Северный",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "743623",
    "name": "Андижан-Южный",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "730002",
    "name": "Бухара I",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "730106",
    "name": "Бухара II",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "726903",
    "name": "Джизак",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "733104",
    "name": "Карши",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "740004",
    "name": "Коканд I",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "742508",
    "name": "Маргилан",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "731306",
    "name": "Навои",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "741100",
    "name": "Наманган",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "739007",
    "name": "Нукус",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "727809",
    "name": "Самарканд",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "723507",
    "name": "Сергели",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "720918",
    "name": "Ташкент-Пассажирский",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "722400",
    "name": "Ташкент-Товарный",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "735109",
    "name": "Термез",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "736704",
    "name": "Термез-Порт",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "738305",
    "name": "Ургенч",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "742601",
    "name": "Фергана I",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "742809",
    "name": "Фергана II",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  },
  {
    "code": "720000",
    "name": "Чукурсай",
    "country": "UZB",
    "road": "Uzb",
    "is_border": false,
    "road_label": "УТИ",
    "country_name": "Узбекистан"
  }
];

  // 2. СПРАВОЧНИК НОМЕНКЛАТУРЫ ГРУЗОВ (ЕТСНГ / ГНГ)
  var CARGO_ITEMS = [
  {
    "code_etsng": "110100",
    "code_gng": "11010011",
    "name": "Мука пшеничная из твердой пшеницы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110311",
    "code_gng": "11031110",
    "name": "Крупа,мука грубого помола из пшеницы твердой",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110311",
    "code_gng": "11031100",
    "name": "Крупа,мука грубого помола из пшеницы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110419",
    "code_gng": "11041910",
    "name": "Зерно пшеницы плющеное и в хлопьях",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110100",
    "code_gng": "11010015",
    "name": "Мука пшеничная из мягкой пшеницы и спельты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100190",
    "code_gng": "10019002",
    "name": "Пшеница, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110100",
    "code_gng": "11010002",
    "name": "Мука из пшеницы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110300",
    "code_gng": "11030000",
    "name": "Крупа из пшеницы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190410",
    "code_gng": "19041003",
    "name": "Пшеница воздушная обжаренная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190410",
    "code_gng": "19041004",
    "name": "Пшеница-суфле",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230230",
    "code_gng": "23023001",
    "name": "Отходы пшеницы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100190",
    "code_gng": "10019091",
    "name": "Пшеница мягкая и меслин семенные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100190",
    "code_gng": "10019099",
    "name": "Спельта прочая, пшеница мягкая и меслин, прочие, кроме поименованных выше",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110311",
    "code_gng": "11031190",
    "name": "Крупа и мука грубого помола из пшеницы мягкой и спельты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032060",
    "name": "Крупа и мука грубого помола в гранулах из пшеницы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042931",
    "name": "Зерно обрушенное пшеницы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042951",
    "name": "Зерно пшеницы дробленое без какой-либо иной обработки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042981",
    "name": "Зерно пшеницы прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110430",
    "code_gng": "11043010",
    "name": "Зародыши пшеницы целые, плющеные, в виде хлопьев или молотые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110710",
    "code_gng": "11071011",
    "name": "Солод неподжаренный из пшеницы в виде муки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110710",
    "code_gng": "11071019",
    "name": "Солод неподжаренный из пшеницы, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190430",
    "code_gng": "19043000",
    "name": "Продукты готовые пищевые, полученные из пшеницы bulgur",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100111",
    "code_gng": "10011100",
    "name": "Пшеница твердая семенная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100119",
    "code_gng": "10011900",
    "name": "Пшеница твердая прочая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100191",
    "code_gng": "10019100",
    "name": "Пшеница прочая и меслин, семенные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100191",
    "code_gng": "10019190",
    "name": "Пшеница прочая и меслин, семенные, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100199",
    "code_gng": "10019900",
    "name": "Пшеница прочая и меслин, кроме семенных",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031930",
    "name": "Крупа,мука грубого помола из ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042903",
    "name": "Зерно ячменя шелушенное с переработкой в сечку или дробленое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100300",
    "code_gng": "10030001",
    "name": "Ячмень посевной",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110290",
    "code_gng": "11029005",
    "name": "Мука из ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031902",
    "name": "Крупа из ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110411",
    "code_gng": "11041101",
    "name": "Хлопья ячменные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110710",
    "code_gng": "11071001",
    "name": "Ячмень пророщенный (пивоваренный)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100300",
    "code_gng": "10030010",
    "name": "Ячмень семенной",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100300",
    "code_gng": "10030090",
    "name": "Ячмень прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032020",
    "name": "Крупа и мука грубого помола в гранулах из ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110419",
    "code_gng": "11041961",
    "name": "Зерно плющеное из ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110419",
    "code_gng": "11041969",
    "name": "Зерно переработанное в хлопья из ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042905",
    "name": "Зерно ячменя обрушенное",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042907",
    "name": "Зерно ячменя дробленое без какой-либо иной обработки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042909",
    "name": "Зерно ячменя прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031920",
    "name": "Крупа и мука грубого помола из ржи или ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032025",
    "name": "Крупа и мука грубого помола в гранулах из ржи или ячменя",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100590",
    "code_gng": "10059000",
    "name": "Кукуруза",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110313",
    "code_gng": "11031390",
    "name": "Крупа,мука грубого помола из кукурузы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110419",
    "code_gng": "11041950",
    "name": "Зерно кукурузы плющеное и в хлопьях",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151521",
    "code_gng": "15152190",
    "name": "Масло кукурузное сырое,к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "070990",
    "code_gng": "07099003",
    "name": "Кукуруза сахарная свежая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100500",
    "code_gng": "10050000",
    "name": "Кукуруза семенная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100510",
    "code_gng": "10051001",
    "name": "Кукуруза дробленая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100590",
    "code_gng": "10059001",
    "name": "Кукуруза, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100590",
    "code_gng": "10059002",
    "name": "Початки кукурузы зеленые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110210",
    "code_gng": "11021001",
    "name": "Мука из кукурузы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110312",
    "code_gng": "11031201",
    "name": "Крупа из кукурузы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110419",
    "code_gng": "11041901",
    "name": "Зерно кукурузы дробленое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151519",
    "code_gng": "15151901",
    "name": "Масло кукурузное необработанное",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190410",
    "code_gng": "19041002",
    "name": "Кукуруза воздушная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230210",
    "code_gng": "23021001",
    "name": "Отходы кукурузы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230890",
    "code_gng": "23089011",
    "name": "Початки кукурузы обрушенные для кормовых целей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230890",
    "code_gng": "23089013",
    "name": "Стебли кукурузы для кормовых целей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "070990",
    "code_gng": "07099060",
    "name": "Кукуруза сахарная свежая или охлажденная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "071040",
    "code_gng": "07104000",
    "name": "Кукуруза сахарная (сырая или сваренная в воде или на пару), мороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "071190",
    "code_gng": "07119030",
    "name": "Кукуруза сахарная, консервированная для кратковременного хранения",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "071290",
    "code_gng": "07129019",
    "name": "Кукуруза сахарная прочая, сушеная, но не подвергнутая дальнейшей обработке",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100510",
    "code_gng": "10051011",
    "name": "Кукуруза семенная, двойные и топкроссные гибриды",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100510",
    "code_gng": "10051013",
    "name": "Кукуруза семенная, тройные гибриды",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100510",
    "code_gng": "10051015",
    "name": "Кукуруза семенная, простые гибриды",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100510",
    "code_gng": "10051019",
    "name": "Кукуруза семенная, прочие гибриды",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100510",
    "code_gng": "10051090",
    "name": "Кукуруза семенная прочая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110220",
    "code_gng": "11022010",
    "name": "Мука кукурузная с содержанием жира до 1,5 мас.%",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110313",
    "code_gng": "11031300",
    "name": "Крупа и мука грубого помола из кукурузы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110313",
    "code_gng": "11031310",
    "name": "Крупа и мука грубого помола из кукурузы с содержанием жира не более 1,5 мас.%",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032040",
    "name": "Крупа и мука грубого помола в гранулах из кукурузы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110423",
    "code_gng": "11042330",
    "name": "Зерно кукурузы обрушенное",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110423",
    "code_gng": "11042390",
    "name": "Зерно кукурузы дробленое без какой-либо иной обработки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110423",
    "code_gng": "11042399",
    "name": "Зерно кукурузы, обработанное прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151521",
    "code_gng": "15152100",
    "name": "Масло кукурузное сырое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151529",
    "code_gng": "15152900",
    "name": "Масло кукурузное и его фракции, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151529",
    "code_gng": "15152990",
    "name": "Масло кукурузное и его фракции, пищевые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230210",
    "code_gng": "23021000",
    "name": "Отруби, высевки, месятки и прочие остатки кукурузы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230210",
    "code_gng": "23021090",
    "name": "Остатки кукурузы, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100510",
    "code_gng": "10051018",
    "name": "Кукуруза семенная, гибриды прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061000",
    "name": "Рис нешелушенный (рис-сырец)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062000",
    "name": "Рис неполированный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063000",
    "name": "Рис полуобрушенный и обрушенный,полированный и неполированный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "400829",
    "code_gng": "40082990",
    "name": "Профили из непористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "400819",
    "code_gng": "40081900",
    "name": "Профили фасонные из пористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "842481",
    "code_gng": "84248110",
    "name": "Приспособления для полива сельскохозяйственные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "860390",
    "code_gng": "86039000",
    "name": "Вагоны моторные,автомотрисы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854449",
    "code_gng": "85444900",
    "name": "Проводники электрические на напряжение до 80В,без соединительных приспособлений",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "860310",
    "code_gng": "86031000",
    "name": "Вагоны моторные,автомотрисы с питанием от внешнего источника электроэнергии",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "401610",
    "code_gng": "40161000",
    "name": "Изделия из пористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "400829",
    "code_gng": "40082900",
    "name": "Изделия из непористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "281210",
    "code_gng": "28121011",
    "name": "Окситрихлорид фосфора (хлористый фосфорил)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "281390",
    "code_gng": "28139010",
    "name": "Сульфиды фосфора,трисульфид фосфора технический",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031950",
    "name": "Крупа,мука грубого помола из риса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100640",
    "code_gng": "10064000",
    "name": "Рис дробленый (рис-сечка)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110819",
    "code_gng": "11081990",
    "name": "Крахмал,кроме рисового",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220410",
    "code_gng": "22041099",
    "name": "Вина игристые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "961000",
    "code_gng": "96100000",
    "name": "Доски грифельные для письма и рисования",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "321590",
    "code_gng": "32159010",
    "name": "Чернила,тушь для письма или рисования",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "290314",
    "code_gng": "29031400",
    "name": "Углерод четыреххлористый",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "292090",
    "code_gng": "29209020",
    "name": "Эфир диметиловый фосфористой кислоты (диметилфосфит)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061001",
    "name": "Рис очищенный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062001",
    "name": "Рис шлифованный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110313",
    "code_gng": "11031301",
    "name": "Крупа из риса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "140490",
    "code_gng": "14049001",
    "name": "Бумага рисовая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "170199",
    "code_gng": "17019902",
    "name": "Сахар рафинированный в кристаллах",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190410",
    "code_gng": "19041005",
    "name": "Рис воздушный обжаренный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190410",
    "code_gng": "19041006",
    "name": "Рис-суфле",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190490",
    "code_gng": "19049001",
    "name": "Рис предварительно отваренный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "210390",
    "code_gng": "21039003",
    "name": "Харисса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220400",
    "code_gng": "22040000",
    "name": "Вино игристое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220600",
    "code_gng": "22060001",
    "name": "Вино рисовое (саке)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230220",
    "code_gng": "23022001",
    "name": "Отходы риса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "250900",
    "code_gng": "25090001",
    "name": "Карбонат кальция природный и некристаллизированный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "253090",
    "code_gng": "25309019",
    "name": "Карбонат кальция природный и кристаллизированный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "270300",
    "code_gng": "27030002",
    "name": "Присыпка торфяная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "270760",
    "code_gng": "27076004",
    "name": "Фенол с примесями (точка кристаллизации менее 39 град. С)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "271290",
    "code_gng": "27129002",
    "name": "Воск нефтяной микрокристаллический",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "281210",
    "code_gng": "28121005",
    "name": "Сера хлористая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "281390",
    "code_gng": "28139007",
    "name": "Трисульфид фосфора",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "290290",
    "code_gng": "29029006",
    "name": "Нафталин без примесей (точка кристаллизации 79,4 С или более)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "290313",
    "code_gng": "29031302",
    "name": "Тетрахлористый углерод без примесей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "290700",
    "code_gng": "29070001",
    "name": "Фенол чистый (точка кристаллизации минимум 39 град. С) и его соли",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "291249",
    "code_gng": "29124903",
    "name": "Металдегид кристалиновый, порошкообразный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "442190",
    "code_gng": "44219014",
    "name": "Приспособления погрузочные деревянные, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "480210",
    "code_gng": "48021001",
    "name": "Бумага рисовальная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "480251",
    "code_gng": "48025101",
    "name": "Картон бристольский, неокрашенный, без покрытия, удельной массой менее 40 г/кв.м",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "490300",
    "code_gng": "49030004",
    "name": "Книги для детей, альбомы для раскрашивания или рисования",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "581010",
    "code_gng": "58101001",
    "name": "Изделия вышитые, мерные, в полосах, с рисунком, с вырезанным основанием",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "843149",
    "code_gng": "84314901",
    "name": "Детали подъемных приспособлений, транспортных устройств",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854130",
    "code_gng": "85413001",
    "name": "Тиристоры (кроме фототиристоров)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854140",
    "code_gng": "85414002",
    "name": "Фототиристоры",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854190",
    "code_gng": "85419001",
    "name": "Детали смонтированных пьезоэлектрических кристаллов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854441",
    "code_gng": "85444101",
    "name": "Кабели телефонные изолированные, с присоединительными элементами",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "901380",
    "code_gng": "90138001",
    "name": "Индикация на жидких кристаллах",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "960330",
    "code_gng": "96033003",
    "name": "Кисточки для рисования",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "960990",
    "code_gng": "96099001",
    "name": "Мел для письма, рисования",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "961000",
    "code_gng": "96100002",
    "name": "Доски для писания, рисования",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "970110",
    "code_gng": "97011003",
    "name": "Рисунки (кроме технических или ремесленных) ручной работы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030269",
    "code_gng": "03026951",
    "name": "Минтай и серебристая сайда свежие или охлажденные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030379",
    "code_gng": "03037955",
    "name": "Минтай и серебристая сайда, мороженые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030760",
    "code_gng": "03076000",
    "name": "Улитки, кроме липариса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061010",
    "name": "Рис нешелушеный (рис-сырец) для посева",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061021",
    "name": "Рис нешелушеный (рис-сырец) пропаренный, короткозерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061023",
    "name": "Рис нешелушеный (рис-сырец) пропаренный, среднезерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061092",
    "name": "Рис нешелушеный (рис-сырец), короткозерный, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061094",
    "name": "Рис нешелушеный (рис-сырец), среднезерный, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062011",
    "name": "Рис шелушеный (неполированный), пропаренный, короткозерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062013",
    "name": "Рис шелушеный (неполированный) пропаренный, среднезерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062092",
    "name": "Рис шелушеный (неполированный), короткозерный, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062094",
    "name": "Рис шелушеный (неполированный), среднезерный, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063021",
    "name": "Рис полуобрушенный, пропаренный, короткозерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063023",
    "name": "Рис полуобрушенный, пропаренный, среднезерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063042",
    "name": "Рис полуобрушенный, прочий, короткозерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063044",
    "name": "Рис полуобрушенный прочий, среднезерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063061",
    "name": "Рис полностью обрушенный пропаренный, короткозерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063063",
    "name": "Рис полностью обрушенный пропаренный, среднезерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063092",
    "name": "Рис полностью обрушенный, прочий, короткозерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063094",
    "name": "Рис полностью обрушенный, прочий, среднезерный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110230",
    "code_gng": "11023000",
    "name": "Мука рисовая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032050",
    "name": "Крупа и мука грубого помола в гранулах из риса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190410",
    "code_gng": "19041030",
    "name": "Продукты готовые пищевые, полученные путем вздувания или обжаривания зерна риса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190490",
    "code_gng": "19049010",
    "name": "Рис, предварительно отваренный или приготовленный другим способом",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220410",
    "code_gng": "22041019",
    "name": "Вина прочие игристые с фактической концентрацией спирта не менее 8,5 об.%",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220600",
    "code_gng": "22060039",
    "name": "Напитки игристые прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220600",
    "code_gng": "22060051",
    "name": "Сидр и перри неигристые, в сосудах емкостью 2 л или менее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220600",
    "code_gng": "22060059",
    "name": "Напитки прочие неигристые, в сосудах емкостью 2 л или менее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220600",
    "code_gng": "22060081",
    "name": "Сидр и перри неигристое, в сосудах емкостью более 2 л",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220600",
    "code_gng": "22060089",
    "name": "Напитки прочие неигристые, в сосудах емкостью более 2л",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230220",
    "code_gng": "23022000",
    "name": "Остатки рисовые:",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230220",
    "code_gng": "23022090",
    "name": "Остатки рисовые, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "281300",
    "code_gng": "28130000",
    "name": "Сульфиды неметаллов; трисульфид фосфора технический",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "285100",
    "code_gng": "28510050",
    "name": "Циан хлористый",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "381129",
    "code_gng": "38112900",
    "name": "Присадки к смазочным маслам прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "390760",
    "code_gng": "39076020",
    "name": "Полиэтилентерефталат, имеющий характеристическую вязкость 78 мл/г или выше",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392111",
    "code_gng": "39211100",
    "name": "Плиты, листы, пленка и полосы или ленты пористые из полимеров стирола",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392112",
    "code_gng": "39211200",
    "name": "Плиты, листы, пленка и полосы или ленты пористые из полимеров винилхлорида",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392113",
    "code_gng": "39211300",
    "name": "Плиты, листы, пленка и полосы или ленты пористые из полиуретанов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392113",
    "code_gng": "39211310",
    "name": "Плиты, листы, пленка и полосы или ленты пористые из полиуретанов гибкие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392113",
    "code_gng": "39211390",
    "name": "Плиты, листы, пленка и полосы или ленты пористые из полиуретанов прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392114",
    "code_gng": "39211400",
    "name": "Плиты, листы, пленка и полосы или ленты пористые из регенерированной целлюлозы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392119",
    "code_gng": "39211900",
    "name": "Плиты, листы, пленка и полосы или ленты пористые из прочих пластмасс",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "392190",
    "code_gng": "39219060",
    "name": "Плиты, листы, пленка и полосы или ленты из продуктов полиприсоединения",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "400811",
    "code_gng": "40081100",
    "name": "Пластины, листы и полосы или ленты из пористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "400821",
    "code_gng": "40082100",
    "name": "Пластины, листы и полосы или ленты из непористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "400821",
    "code_gng": "40082110",
    "name": "Покрытия для полов и маты из непористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "400821",
    "code_gng": "40082190",
    "name": "Прутки и профили фасонные из непористой резины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "401610",
    "code_gng": "40161010",
    "name": "Изделия из пористой резины для технических целей, для гражданской авиации",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "820890",
    "code_gng": "82089000",
    "name": "Ножи и режущие лезвия для машин или механических приспособлений прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "842481",
    "code_gng": "84248130",
    "name": "Приспособления переносные для сельского хозяйства или садоводства",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "842490",
    "code_gng": "84249010",
    "name": "Части приспособлений подсубпозиции 8424 89 20",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "842490",
    "code_gng": "84249030",
    "name": "Части приспособлений подсубпозиции 8424 89 30",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "845691",
    "code_gng": "84569100",
    "name": "Станки для сухого травления рисунка на полупроводниковых материалах",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846610",
    "code_gng": "84661031",
    "name": "Приспособления для крепления токарных станков",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846610",
    "code_gng": "84661090",
    "name": "Приспособления для крепления самораскрывающихся резьбонарезных головок",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846620",
    "code_gng": "84662000",
    "name": "Приспособления для крепления обрабатываемых деталей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846620",
    "code_gng": "84662091",
    "name": "Приспособления для крепления обрабатываемых деталей для токарных станков",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846630",
    "code_gng": "84663000",
    "name": "Головки делительные и другие специальные приспособления к станкам",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846691",
    "code_gng": "84669100",
    "name": "Приспособления к станкам товарной позиции 8464",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846691",
    "code_gng": "84669115",
    "name": "Приспособления к станкам подсубпозиции 8464 1010, 8464 2005 или 8464 9010",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846692",
    "code_gng": "84669200",
    "name": "Приспособления к станкам товарной позиции 8465",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846693",
    "code_gng": "84669300",
    "name": "Приспособления к станкам товарных позиций 8456–8461",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846693",
    "code_gng": "84669317",
    "name": "Приспособления к установкам подсубпозиции 8456 9950",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846694",
    "code_gng": "84669400",
    "name": "Приспособления к станкам товарной позиции 8462 или 8463",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846694",
    "code_gng": "84669410",
    "name": "Приспособления для машин подсубпозиции 8462 2105 или 8462 2905",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "847989",
    "code_gng": "84798900",
    "name": "Машины и механические приспособления прочие, кроме поименованных выше",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "847989",
    "code_gng": "84798965",
    "name": "Установки для выращивания или вытягивания полупроводниковых монокристаллов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "850440",
    "code_gng": "85044050",
    "name": "Выпрямители тока поликристаллические полупроводниковые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "851030",
    "code_gng": "85103000",
    "name": "Приспособления для удаления волос",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854130",
    "code_gng": "85413000",
    "name": "Тиристоры, динисторы и тринисторы, кроме фоточувствительных приборов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854160",
    "code_gng": "85416000",
    "name": "Кристаллы пьезоэлектрические собранные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854221",
    "code_gng": "85422101",
    "name": "Пластины полупроводниковые МОП – структуры, еще не разрезанные на кристаллы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854221",
    "code_gng": "85422105",
    "name": "Кристаллы МОП – структуры",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854221",
    "code_gng": "85422173",
    "name": "Кристаллы прочих схем интегральных монолитных цифровых",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "854229",
    "code_gng": "85422920",
    "name": "Кристаллы прочих схем интегральных монолитных",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "871610",
    "code_gng": "87161000",
    "name": "Прицепы и полуприцепы типа \"дом-автоприцеп\", для проживания или для автотуристов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "901041",
    "code_gng": "90104100",
    "name": "Аппаратура для непосредственного нанесения рисунка на полупроводниковые пластины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "901380",
    "code_gng": "90138020",
    "name": "Устройства на жидких кристаллах активные матричные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "901380",
    "code_gng": "90138030",
    "name": "Устройства на жидких кристаллах, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "901390",
    "code_gng": "90139010",
    "name": "Части и принадлежности устройств на жидких кристаллах",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "902110",
    "code_gng": "90211000",
    "name": "Приспособления ортопедические или для лечения переломов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "902110",
    "code_gng": "90211010",
    "name": "Приспособления ортопедические",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "902110",
    "code_gng": "90211090",
    "name": "Шины и прочие приспособления для лечения переломов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "902780",
    "code_gng": "90278091",
    "name": "Вискозиметры, приборы для измерения пористости и расширения",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "940130",
    "code_gng": "94013000",
    "name": "Мебель для сидения вращающаяся с регулирующими высоту приспособлениями",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "940130",
    "code_gng": "94013090",
    "name": "Мебель для сидения вращающаяся с регулирующими высоту приспособлениями прочая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "940421",
    "code_gng": "94042100",
    "name": "Матрацы из пористой резины или пластмассы, с покрытием или без покрытия",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "960820",
    "code_gng": "96082000",
    "name": "Ручки и маркеры с наконечником из фетра и прочих пористых материалов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "960990",
    "code_gng": "96099000",
    "name": "Пастели, карандаши угольные, мелки для письма или рисования и мелки для портных",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "960990",
    "code_gng": "96099090",
    "name": "Мелки для письма или рисования и мелки для портных",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030259",
    "code_gng": "03025930",
    "name": "Сайда серебристая свежая или охлажденная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030369",
    "code_gng": "03036950",
    "name": "Сайда серебристая, мороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030760",
    "code_gng": "03076090",
    "name": "Улитки прочие, кроме липариса, кроме выделенных отдельно",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061030",
    "name": "Короткозерный нешелушеный рис (рис-сырец)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061050",
    "name": "Среднезерный нешелушеный рис (рис-сырец)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100610",
    "code_gng": "10061090",
    "name": "Рис нешелушеный (рис-сырец) прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062019",
    "name": "Рис шелушеный (неполированный), пропаренный, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100620",
    "code_gng": "10062099",
    "name": "Рис шелушеный, прочий, кроме поименованного отдельно",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063029",
    "name": "Рис полуобрушенный, пропаренный, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063049",
    "name": "Рис полуобрушенный, прочий, кроме поименованного отдельно",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063069",
    "name": "Рис полностью обрушенный пропаренный, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100630",
    "code_gng": "10063099",
    "name": "Рис полностью обрушенный прочий, кроме поименованного отдельно",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100850",
    "code_gng": "10085000",
    "name": "Киноа, или рисовая лебеда (Chenopodium quinoa)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "160558",
    "code_gng": "16055800",
    "name": "Улитки, кроме липариса, готовые или консервированные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220410",
    "code_gng": "22041013",
    "name": "Вино игристое \"Cava\" (\"Кава\") со знаком подлинности происхождения (PDO)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220410",
    "code_gng": "22041015",
    "name": "Вино игристое \"Prosecco\" со знаком подлинности происхождения (PDO)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220410",
    "code_gng": "22041093",
    "name": "Вина прочие игристые виноградные со знаком подлинности происхождения (PDO)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "220410",
    "code_gng": "22041098",
    "name": "Вина прочие игристые виноградные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "285310",
    "code_gng": "28531000",
    "name": "Хлористый циан (хлорциан)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "291910",
    "code_gng": "29191000",
    "name": "Трис (2,3-дибромпропил) фосфат",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "382483",
    "code_gng": "38248300",
    "name": "Смеси, содержащие трис(2,3-дибромпропил) фосфат",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846693",
    "code_gng": "84669330",
    "name": "Приспособления к машинам подсубпозиции 8456 90 20",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "846693",
    "code_gng": "84669370",
    "name": "Приспособления прочее к станкам позиций 8456-8461",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "901310",
    "code_gng": "90131090",
    "name": "Прицелы телескопические для установки на оружии; перископы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "970121",
    "code_gng": "97012100",
    "name": "Картины, рисунки и пастели, возрастом более 100 лет",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "970191",
    "code_gng": "97019100",
    "name": "Картины, рисунки и пастели (кроме материалов возрастом более 100 лет)",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151411",
    "code_gng": "15141100",
    "name": "Масло рапсовое сырое с низким содержанием эруковой кислоты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120500",
    "code_gng": "12050001",
    "name": "Семя рапса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151410",
    "code_gng": "15141001",
    "name": "Масло рапсовое необработанное",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151490",
    "code_gng": "15149001",
    "name": "Масло рапсовое очищенное, не модифицированное химически",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120510",
    "code_gng": "12051000",
    "name": "Семена рапса или кользы, с низким содержанием эруковой кислоты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120510",
    "code_gng": "12051010",
    "name": "Семена рапса или кользы, с низким содержанием эруковой кислоты, для посева",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120510",
    "code_gng": "12051090",
    "name": "Семена рапса или кользы, с низким содержанием эруковой кислоты, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120590",
    "code_gng": "12059000",
    "name": "Семена рапса или кользы, дробленые или недробленые прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151411",
    "code_gng": "15141190",
    "name": "Масло рапсовое сырое с низким содержанием эруковой кислоты, прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230649",
    "code_gng": "23064900",
    "name": "Жмыхи и другие твердые отходы прочие, из семян рапса или кользы:",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120600",
    "code_gng": "12060010",
    "name": "Семена подсолнечника для посева",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120600",
    "code_gng": "12060091",
    "name": "Семена подсолнечника,лущеные;в лузге серого цвета и с белыми полосками",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151211",
    "code_gng": "15121191",
    "name": "Масло подсолнечное сырое,пищевое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151190",
    "code_gng": "15119001",
    "name": "Масло подсолнечное, сафлоровое, хлопковое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151200",
    "code_gng": "15120000",
    "name": "Масло подсолнечное необработанное",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151211",
    "code_gng": "15121102",
    "name": "Масло подсолнечное очищенное, не модифицированное химически",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120600",
    "code_gng": "12060099",
    "name": "Семена подсолнечника, дробленые или недробленые, прочие, кроме лущеных",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151211",
    "code_gng": "15121100",
    "name": "Масло подсолнечное или сафлоровое сырое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151219",
    "code_gng": "15121900",
    "name": "Масло подсолнечное или сафлоровое и их фракции, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151219",
    "code_gng": "15121991",
    "name": "Масло подсолнечное прочее для пищевых продуктов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151219",
    "code_gng": "15121990",
    "name": "Масло подсолнечное или сафлоровое и их фракции, прочие для пищевых продуктов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "121410",
    "code_gng": "12141000",
    "name": "Мука грубого помола и гранулы из люцерны,кормовые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "440500",
    "code_gng": "44050000",
    "name": "Шерсть древесная или тонкая стружка;мука древесная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110100",
    "code_gng": "11010090",
    "name": "Мука пшенично-ржаная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031900",
    "name": "Крупа,мука грубого помола из зерна злаков",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031940",
    "name": "Крупа,мука грубого помола из овса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031990",
    "name": "Крупа,мука грубого помола",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110290",
    "code_gng": "11029030",
    "name": "Мука овсяная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110610",
    "code_gng": "11061000",
    "name": "Мука из сушеных бобовых овощей позиции 0713",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120810",
    "code_gng": "12081000",
    "name": "Мука из соевых бобов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110290",
    "code_gng": "11029090",
    "name": "Мука из зерна злаков",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062000",
    "name": "Мука из сердцевины саговой пальмы,из корнеплодов или клубнеплодов позиции 0714",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230110",
    "code_gng": "23011000",
    "name": "Мука и гранулы из мяса или мясных субпродуктов;шкварки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021090",
    "code_gng": "02109004",
    "name": "Мука пищевая из внутренностей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021090",
    "code_gng": "02109005",
    "name": "Мука пищевая из мяса, субпродуктов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030510",
    "code_gng": "03051001",
    "name": "Мука рыбная пищевая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030619",
    "code_gng": "03061902",
    "name": "Мука из ракообразных пищевая, мороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "030629",
    "code_gng": "03062902",
    "name": "Мука из ракообразных пищевая, немороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "050690",
    "code_gng": "05069001",
    "name": "Мука из кости",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "050710",
    "code_gng": "05071002",
    "name": "Мука из слоновой кости",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110100",
    "code_gng": "11010000",
    "name": "Мука из спельты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110100",
    "code_gng": "11010001",
    "name": "Мука из полбы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110230",
    "code_gng": "11023001",
    "name": "Мука гречневая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110290",
    "code_gng": "11029003",
    "name": "Мука из овса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110290",
    "code_gng": "11029004",
    "name": "Мука из проса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110510",
    "code_gng": "11051001",
    "name": "Мука из картофеля",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110610",
    "code_gng": "11061001",
    "name": "Мука из сухих стручковых",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062004",
    "name": "Мука из крахмалосодержащих пищевых кореньев, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062005",
    "name": "Мука из маниоки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062006",
    "name": "Мука из сладкого картофеля",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062007",
    "name": "Мука из тапиоки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110630",
    "code_gng": "11063001",
    "name": "Мука из каштанов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110630",
    "code_gng": "11063002",
    "name": "Мука из кокосовых орехов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110630",
    "code_gng": "11063003",
    "name": "Мука из фруктов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120890",
    "code_gng": "12089001",
    "name": "Мука из масличных семян, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120890",
    "code_gng": "12089002",
    "name": "Мука из маслосодержащих плодов, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "121210",
    "code_gng": "12121001",
    "name": "Мука из плодов рожкового дерева",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "121410",
    "code_gng": "12141001",
    "name": "Мука из люцерны",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "121490",
    "code_gng": "12149009",
    "name": "Мука из растений для кормовых целей, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190590",
    "code_gng": "19059004",
    "name": "Мука панировочная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230100",
    "code_gng": "23010000",
    "name": "Мука из мяса, внутренностей, непищевая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230120",
    "code_gng": "23012001",
    "name": "Мука из ракообразных непищевая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230120",
    "code_gng": "23012002",
    "name": "Мука из рыбы непищевая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230890",
    "code_gng": "23089007",
    "name": "Мука из стручка цареградского для кормовых целей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "251200",
    "code_gng": "25120005",
    "name": "Мука кремнистая горная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "300290",
    "code_gng": "30029002",
    "name": "Мука кровяная животных для фармацевтичеких целей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "411000",
    "code_gng": "41100003",
    "name": "Мука кожевенная, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "440420",
    "code_gng": "44042007",
    "name": "Шерсть древесная; мука древесная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "440500",
    "code_gng": "44050001",
    "name": "Мука древесная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "440500",
    "code_gng": "44050002",
    "name": "Мука пиловочная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021099",
    "code_gng": "02109990",
    "name": "Мука пищевая из мяса и мясных субпродуктов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110220",
    "code_gng": "11022090",
    "name": "Мука ржаная прочая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110290",
    "code_gng": "11029000",
    "name": "Мука из зерна прочих злаков, кроме поименованных выше",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031910",
    "name": "Крупа и мука грубого помола из ржи",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032000",
    "name": "Крупа и мука грубого помола в гранулах:",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032010",
    "name": "Крупа и мука грубого помола в гранулах из ржи",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032030",
    "name": "Крупа и мука грубого помола в гранулах из овса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110320",
    "code_gng": "11032090",
    "name": "Крупа и мука грубого помола в гранулах прочие, кроме поименованных выше",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110510",
    "code_gng": "11051000",
    "name": "Мука картофельная тонкого и грубого помола и порошок",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110630",
    "code_gng": "11063000",
    "name": "Мука тонкого и грубого помола из фруктов и орехов из продуктов Главы 08",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110630",
    "code_gng": "11063010",
    "name": "Мука тонкого и грубого помола из бананов",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110630",
    "code_gng": "11063090",
    "name": "Мука тонкого и грубого помола из фруктов и орехов, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "071350",
    "code_gng": "07135000",
    "name": "Бобы кормовые,конские,крупносеменные и мелкосеменные,сушеные,лущеные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010290",
    "code_gng": "01029090",
    "name": "Скот крупный рогатый живой,к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010210",
    "code_gng": "01021000",
    "name": "Скот крупный рогатый живой,племенной",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "410441",
    "code_gng": "41044100",
    "name": "Краст из шкур крупного рогатого скота или лошадей,нешлифованный лицевой",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150200",
    "code_gng": "15020090",
    "name": "Жир крупного рогатого скота,овец и коз,кроме жира позиции 1503,",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010210",
    "code_gng": "01021002",
    "name": "Племенные чистопородные животные крупного рогатого скота",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010290",
    "code_gng": "01029004",
    "name": "Скот крупный рогатый убойный",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010290",
    "code_gng": "01029005",
    "name": "Скот крупный рогатый, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020100",
    "code_gng": "02010000",
    "name": "Мясо крупного рогатого скота свежее, туша или полутуша животного",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020200",
    "code_gng": "02020000",
    "name": "Мясо крупного рогатого скота мороженое, туша или полутуша животного",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020210",
    "code_gng": "02021001",
    "name": "Мясо крупного рогатого скота мороженое, рубленое, с костями",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020610",
    "code_gng": "02061001",
    "name": "Печень крупного рогатого скота свежая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020610",
    "code_gng": "02061002",
    "name": "Языки крупного рогатого скота свежие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020621",
    "code_gng": "02062101",
    "name": "Языки крупного рогатого скота пищевые, мороженые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020621",
    "code_gng": "02062102",
    "name": "Печень крупного рогатого скота мороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020622",
    "code_gng": "02062201",
    "name": "Печень крупного рогатого скота пищевая, мороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110290",
    "code_gng": "11029006",
    "name": "Крупы, гранулы из зерновых культур",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110311",
    "code_gng": "11031101",
    "name": "Крупа из спельты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110311",
    "code_gng": "11031102",
    "name": "Крупа из овса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110314",
    "code_gng": "11031401",
    "name": "Крупа из зерновых культур, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110319",
    "code_gng": "11031901",
    "name": "Крупа из ржи",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110600",
    "code_gng": "11060000",
    "name": "Крупа из сухих стручковых",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062001",
    "name": "Крупа из маниоки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062002",
    "name": "Крупа из сладкого картофеля",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110620",
    "code_gng": "11062003",
    "name": "Крупа из тапиоки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150100",
    "code_gng": "15010002",
    "name": "Жир крупного, мелкого рогатого скота",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150200",
    "code_gng": "15020003",
    "name": "Жир крупного рогатого скота топленый",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190120",
    "code_gng": "19012001",
    "name": "Продукты из муки, крупы, крахмала, молока, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "410122",
    "code_gng": "41012201",
    "name": "Шкуры крупного рогатого скота необработанные, свежие, мокросоленые, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "410129",
    "code_gng": "41012901",
    "name": "Шкуры крупного рогатого скота необработанные, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "410439",
    "code_gng": "41043901",
    "name": "Кожи крупного рогатого скота без волосяного покрова дубленые, выделанные, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "843780",
    "code_gng": "84378001",
    "name": "Машины просеивающие для муки зерновых, крупы зерновых",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "860900",
    "code_gng": "86090002",
    "name": "Поддоны крупногабаритные, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010290",
    "code_gng": "01029000",
    "name": "Скот крупный рогатый живой прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010290",
    "code_gng": "01029071",
    "name": "Скот крупный рогатый домашний живой, массой более 300 кг, убойные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010290",
    "code_gng": "01029079",
    "name": "Скот крупный рогатый домашний живой, массой более 300 кг, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020130",
    "code_gng": "02013000",
    "name": "Мясо крупного рогатого скота, свежее или охлажденное, отруба обваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020220",
    "code_gng": "02022000",
    "name": "Мясо крупного рогатого скота, мороженое, отруба прочие необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020220",
    "code_gng": "02022090",
    "name": "Мясо крупного рогатого скота, мороженое, прочие отруба, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020610",
    "code_gng": "02061000",
    "name": "Субпродукты пищевые крупного рогатого скота, свежие или охлажденные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020610",
    "code_gng": "02061091",
    "name": "Печень крупного рогатого скота, свежая или охлажденная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020621",
    "code_gng": "02062100",
    "name": "Языки крупного рогатого скота, мороженые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020622",
    "code_gng": "02062200",
    "name": "Печень крупного рогатого скота, мороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020629",
    "code_gng": "02062900",
    "name": "Субпродукты пищевые крупного рогатого скота, прочие, мороженые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020629",
    "code_gng": "02062991",
    "name": "Диафрагма толстая и диафрагма тонкая крупного рогатого скота, мороженая",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021020",
    "code_gng": "02102000",
    "name": "Мясо крупного рогатого скота соленое, в рассоле, сушеное или копченое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "160250",
    "code_gng": "16025000",
    "name": "Продукты готовые и консервированные из мяса крупного рогатого скота:",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "410150",
    "code_gng": "41015000",
    "name": "Шкуры крупного рогатого скота необработанные, целые, массой более 16 кг",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "410150",
    "code_gng": "41015010",
    "name": "Шкуры крупного рогатого скота необработанные, целые, массой более 16 кг, парные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "410150",
    "code_gng": "41015090",
    "name": "Шкуры крупного рогатого скота необработанные, целые, массой более 16 кг, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "010221",
    "code_gng": "01022190",
    "name": "Скот крупный рогатый живой чистопородный, племенной, прочий",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150210",
    "code_gng": "15021000",
    "name": "Жир топленый крупного рогатого скота, овец или коз, кроме жира позиции 1503",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150290",
    "code_gng": "15029000",
    "name": "Жир прочий крупного рогатого скота, овец или коз, кроме жира позиции 1503",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020230",
    "code_gng": "02023000",
    "name": "Говядина мороженая отруба,обваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020319",
    "code_gng": "02031900",
    "name": "Свинина свежая,кроме туш,полутуш и отрубов позиции 0203 12",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "190590",
    "code_gng": "19059008",
    "name": "Хлеб из муки грубого помола с отрубями",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230230",
    "code_gng": "23023002",
    "name": "Отруби зерновых, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020312",
    "code_gng": "02031200",
    "name": "Свинина свежая или охлажденная, окорока, лопатки и отруба из них, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020312",
    "code_gng": "02031290",
    "name": "Свинина свежая или охлажденная, отруба прочие, необваленные, домашних свиней",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020319",
    "code_gng": "02031911",
    "name": "Свинина свежая или охлажденная, края передние и отруба из них домашних свиней",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020319",
    "code_gng": "02031959",
    "name": "Свинина свежая или охлажденная, отруба прочие, домашних свиней, кроме обваленной",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020322",
    "code_gng": "02032200",
    "name": "Свинина мороженая, окорока, лопатки и отруба из них, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020322",
    "code_gng": "02032211",
    "name": "Свинина мороженая, окорока и отруба из них, необваленные, домашних свиней",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020322",
    "code_gng": "02032219",
    "name": "Свинина мороженая, лопатки и отруба из них необваленные, домашних свиней",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020322",
    "code_gng": "02032290",
    "name": "Свинина мороженая, окорока и отруба из них необваленные, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020329",
    "code_gng": "02032911",
    "name": "Свинина мороженая, края передние и отруба из них домашних свиней",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020329",
    "code_gng": "02032913",
    "name": "Свинина мороженая, корейки и отруба из них домашних свиней, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020329",
    "code_gng": "02032915",
    "name": "Свинина мороженая, грудинки с прослойками и отруба из них, домашних свиней",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020329",
    "code_gng": "02032955",
    "name": "Свинина мороженая, отруба прочие, обваленные, домашних свиней",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020422",
    "code_gng": "02042200",
    "name": "Баранина прочая, свежая или охлажденная, отруба прочие, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020442",
    "code_gng": "02044200",
    "name": "Баранина прочая мороженая, отруба прочие, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020442",
    "code_gng": "02044290",
    "name": "Баранина мороженая, отруба прочие, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020450",
    "code_gng": "02045031",
    "name": "Козлятина свежая или охлажденная, отруба прочие, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020450",
    "code_gng": "02045039",
    "name": "Козлятина свежая или охлажденная, отруба прочие, обваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020450",
    "code_gng": "02045071",
    "name": "Козлятина мороженая, отруба прочие, необваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "020450",
    "code_gng": "02045079",
    "name": "Козлятина мороженая, отруба обваленные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021011",
    "code_gng": "02101111",
    "name": "Окорока и отруба из них домашних свиней, необваленные, соленые или в рассоле",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021011",
    "code_gng": "02101119",
    "name": "Лопатки и отруба из них домашних свиней, необваленные, соленые или в рассоле",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021011",
    "code_gng": "02101131",
    "name": "Окорока и отруба из них домашних свиней, необваленные, сушеные или копченые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021011",
    "code_gng": "02101139",
    "name": "Лопатки и отруба из них домашних свиней, необваленные, сушеные или копченые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021011",
    "code_gng": "02101190",
    "name": "Окорока, лопатки и отруба из них свиные, необваленные, прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021012",
    "code_gng": "02101211",
    "name": "Грудинки (с прослойками) и отруба из них домашних свиней соленые или в рассоле",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021012",
    "code_gng": "02101219",
    "name": "Грудинки (с прослойками) и отруба из них домашних свиней сушеные или копченые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021019",
    "code_gng": "02101900",
    "name": "Свинина соленая, в рассоле, сушеная или копченая, отруба прочие",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021019",
    "code_gng": "02101930",
    "name": "Свинина - передние края и отруба из них домашних свиней соленые или в рассоле",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021019",
    "code_gng": "02101940",
    "name": "Свинина - корейки и отруба из них домашних свиней соленые или в рассоле",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021019",
    "code_gng": "02101960",
    "name": "Свинина - передние края и отруба из них домашних свиней сушеные или копченые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "021019",
    "code_gng": "02101970",
    "name": "Свинина - корейки и отруба из них домашних свиней сушеные или копченые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "160241",
    "code_gng": "16024100",
    "name": "Окорока и их отруба из свинины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "160241",
    "code_gng": "16024110",
    "name": "Изделия из окорока и их отруба домашней свиньи готовые или консервированные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "160241",
    "code_gng": "16024190",
    "name": "Изделия из окорока и их отруба прочих свиней готовые или консервированные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "160242",
    "code_gng": "16024200",
    "name": "Лопаточная часть и ее отруба из свинины",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "840211",
    "code_gng": "84021100",
    "name": "Котлы водотрубные производительностью более 45 т пара в час",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "840212",
    "code_gng": "84021200",
    "name": "Котлы водотрубные производительностью не более 45 т пара в час",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100700",
    "code_gng": "10070000",
    "name": "Сорго зерновое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "720441",
    "code_gng": "72044100",
    "name": "Отходы из черных металлов токарные,фрезерные и от штамповки",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "843710",
    "code_gng": "84371000",
    "name": "Машины для очистки,сортировки и калибровки семян,зерна или сухих бобовых культур",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "843351",
    "code_gng": "84335100",
    "name": "Комбайны зерноуборочные",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042959",
    "name": "Зерно дробленное,к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110411",
    "code_gng": "11041102",
    "name": "Зерно овса дробленое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110412",
    "code_gng": "11041202",
    "name": "Зерно зерновых культур дробленое, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110421",
    "code_gng": "11042101",
    "name": "Зерно овса очищенное, шлифованное, дробленое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110423",
    "code_gng": "11042301",
    "name": "Зерно зерновых культур очищенное, шлифованное, дробленое, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "121300",
    "code_gng": "12130002",
    "name": "Солома зерновых необработанная",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "140190",
    "code_gng": "14019004",
    "name": "Солома зерновых обработанная для плетеных изделий",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "170490",
    "code_gng": "17049010",
    "name": "Какао-бобы в зернах или молотые",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "180100",
    "code_gng": "18010001",
    "name": "Какао-бобы в зернах",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "760110",
    "code_gng": "76011002",
    "name": "Зерна из нелегированного алюминия",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "760120",
    "code_gng": "76012001",
    "name": "Зерна из алюминиевых сплавов",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "843629",
    "code_gng": "84362903",
    "name": "Аппараты для проращивания зерна",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "843710",
    "code_gng": "84371001",
    "name": "Машины просеивающие для зерновых, бобовых культур",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "843710",
    "code_gng": "84371002",
    "name": "Машины сортировочные для зерновых, бобовых культур",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "845910",
    "code_gng": "84591003",
    "name": "Станки фрезерные, металлообрабатывающие, на салазках",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "846490",
    "code_gng": "84649002",
    "name": "Станки фрезерные для обработки бетона, стекла, минеральных веществ",
    "category": "Строительные грузы",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "100700",
    "code_gng": "10070010",
    "name": "Сорго зерновое, гибриды для посева",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100700",
    "code_gng": "10070090",
    "name": "Сорго зерновое, прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110422",
    "code_gng": "11042230",
    "name": "Зерно овса шелушенное и переработанное в сечку или дробленое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110422",
    "code_gng": "11042290",
    "name": "Зерно овса дробленое без какой-либо иной обработки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "110429",
    "code_gng": "11042955",
    "name": "Зерно ржи дробленое без какой-либо иной обработки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "845931",
    "code_gng": "84593100",
    "name": "Станки расточно-фрезерные с числовым программным управлением",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "845951",
    "code_gng": "84595100",
    "name": "Станки консольно-фрезерные с числовым программным управлением",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "845961",
    "code_gng": "84596100",
    "name": "Станки фрезерные прочие с числовым программным управлением",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "845961",
    "code_gng": "84596110",
    "name": "Станки фрезерные инструментальные с числовым программным управлением",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "845969",
    "code_gng": "84596900",
    "name": "Станки фрезерные, кроме станков фрезерных с числовым программным управлением",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100710",
    "code_gng": "10071000",
    "name": "Сорго зерновое семенное",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100710",
    "code_gng": "10071010",
    "name": "Сорго зерновое семенное, гибриды",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100710",
    "code_gng": "10071090",
    "name": "Сорго зерновое семенное, прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "100790",
    "code_gng": "10079000",
    "name": "Сорго зерновое прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "852340",
    "code_gng": "85234059",
    "name": "Диски для лазерных считывающих систем, кроме выделенных отдельно",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "450190",
    "code_gng": "45019003",
    "name": "Шрот пробковый",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230690",
    "code_gng": "23069000",
    "name": "Жмыхи и другие остатки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230310",
    "code_gng": "23031002",
    "name": "Жмыхи сахарного тростника",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "230670",
    "code_gng": "23067001",
    "name": "Жмыхи, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151010",
    "code_gng": "15101000",
    "name": "Масло оливковое из жмыха сырое",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "270112",
    "code_gng": "27011210",
    "name": "Уголь битуминозный коксующийся",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270112",
    "code_gng": "27011290",
    "name": "Уголь битуминозный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270820",
    "code_gng": "27082000",
    "name": "Кокс пековый,полученный из каменноугольной смолы или минеральных смол",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270600",
    "code_gng": "27060000",
    "name": "Смолы каменноугольные,буроугольные,торфяные и прочие минеральные смолы,включая",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251612",
    "code_gng": "25161200",
    "name": "Гранит распиленный на прямоугольные блоки и плиты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "251622",
    "code_gng": "25162200",
    "name": "Песчаник в блоках,плитах прямоугольной формы",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251512",
    "code_gng": "25151200",
    "name": "Мрамор,травертин пиленные на прямоугольные блоки",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "760691",
    "code_gng": "76069100",
    "name": "Листы,ленты из алюминия нелегированного,толщина от 0,2мм,кроме прямоугольных",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "380290",
    "code_gng": "38029000",
    "name": "Продукты минеральные природные активированные;уголь животный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270810",
    "code_gng": "27081000",
    "name": "Пек из каменноугольной смолы и минеральных смол",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "250629",
    "code_gng": "25062901",
    "name": "Кварцит, разделанный на квадратные или прямоугольные пластины",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251400",
    "code_gng": "25140003",
    "name": "Сланец распиленный на квадратные или прямоугольные плиты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "251512",
    "code_gng": "25151201",
    "name": "Мрамор, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251512",
    "code_gng": "25151205",
    "name": "Травертин, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251520",
    "code_gng": "25152002",
    "name": "Алебастр, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251612",
    "code_gng": "25161201",
    "name": "Гранит, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251622",
    "code_gng": "25162201",
    "name": "Песчаник, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251690",
    "code_gng": "25169002",
    "name": "Базальт, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251690",
    "code_gng": "25169007",
    "name": "Камни строительные, разделанные на квадратные или прямоугольные плиты, к.п.о.",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "251690",
    "code_gng": "25169010",
    "name": "Порфир, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "252610",
    "code_gng": "25261002",
    "name": "Стеатит природный, разделанный на квадратные или прямоугольные плиты",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "262100",
    "code_gng": "26210011",
    "name": "Уголь бартяной",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270112",
    "code_gng": "27011201",
    "name": "Уголь коксующийся",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270112",
    "code_gng": "27011202",
    "name": "Мелочь угольная",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270119",
    "code_gng": "27011902",
    "name": "Уголь каменный порошкообразный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270119",
    "code_gng": "27011903",
    "name": "Уголь каменный, к.п.о.",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270120",
    "code_gng": "27012004",
    "name": "Уголь каменный агломерированный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270210",
    "code_gng": "27021001",
    "name": "Уголь бурый порошкообразный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270220",
    "code_gng": "27022001",
    "name": "Уголь бурый агломерированный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040020",
    "name": "Уголь реторный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040021",
    "name": "Уголь электродный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040022",
    "name": "Газ каменноугольный, водяной, низкокалорийный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270500",
    "code_gng": "27050005",
    "name": "Газ каменноугольный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "450200",
    "code_gng": "45020001",
    "name": "Пробка натуральная в виде прямоугольных или квадратных блоков, плит, листов",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "680710",
    "code_gng": "68071002",
    "name": "Изделия из каменноугольного пека в рулонах",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "680790",
    "code_gng": "68079002",
    "name": "Изделия из каменноугольного пека, к.п.о.",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "854590",
    "code_gng": "85459003",
    "name": "Уголь для батарей",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "854590",
    "code_gng": "85459004",
    "name": "Уголь для ламп",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "854590",
    "code_gng": "85459005",
    "name": "Уголь для элементов",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "960990",
    "code_gng": "96099004",
    "name": "Уголь чертежный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270710",
    "code_gng": "27071000",
    "name": "Бензол (продукт высокотем пературной перегонки каменноуголь ной смолы)",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270720",
    "code_gng": "27072000",
    "name": "Толуол (продукт высокотем пературной перегонки каменноуголь ной смолы)",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270730",
    "code_gng": "27073000",
    "name": "Ксилол (продукт высокотем пературной перегонки каменноуголь ной смолы)",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "271290",
    "code_gng": "27129011",
    "name": "Озокерит, воск буроугольный или воск торфяной сырые",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "271290",
    "code_gng": "27129019",
    "name": "Озокерит, воск буроугольный или воск торфяной, прочие",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "850680",
    "code_gng": "85068005",
    "name": "Батареи сухие угольно-цинковые с напряжением 5,5 В или более, но не более 6,5 В",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "853310",
    "code_gng": "85331000",
    "name": "Резисторы постоянные угольные, композитные или пленочные",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "960990",
    "code_gng": "96099010",
    "name": "Пастели и угольные карандаши",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "440210",
    "code_gng": "44021000",
    "name": "Уголь древесный из бамбука",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "440290",
    "code_gng": "44029000",
    "name": "Уголь древесный, прочий (включая уголь, полученный из скорлупы или орехов)",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270119",
    "code_gng": "27011904",
    "name": "Брикеты антрацита",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040030",
    "name": "Кокс и полукокс из лигнита",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040019",
    "name": "Прочие кокс и полукокс из каменного угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "271311",
    "code_gng": "27131100",
    "name": "Кокс нефтяной некальцинированный",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040000",
    "name": "Отходы кокса бурого угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040001",
    "name": "Брикеты газового кокса",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040002",
    "name": "Брикеты кокса бурого угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040003",
    "name": "Отходы кокса каменного угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040004",
    "name": "Брикеты кокса каменного угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040005",
    "name": "Отходы полукокса бурого угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040006",
    "name": "Отходы полукокса каменного угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040007",
    "name": "Брикеты полукокса каменного угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040008",
    "name": "Полукокс бурого угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040009",
    "name": "Кокс бурого угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040010",
    "name": "Полукокс каменного угля, к.п.о.",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040012",
    "name": "Полукокс торфа",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040015",
    "name": "Пыль кокса бурого угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040016",
    "name": "Кокс торфяной",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040017",
    "name": "Пыль кокса каменного угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040018",
    "name": "Пыль полукокса бурого угля",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "271290",
    "code_gng": "27129008",
    "name": "Кокс нефтяной, битум нефтяной; остатки нефти, масел из битуминозных минералов",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270400",
    "code_gng": "27040090",
    "name": "Кокс и полукокс из торфа",
    "category": "Каменный уголь и кокс",
    "tariff_class": 1,
    "default_wagon": "gondola",
    "security_required": false
  },
  {
    "code_etsng": "270820",
    "code_gng": "27082001",
    "name": "Нефть, масла из битуминозных минералов, сырые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "272500",
    "code_gng": "27250000",
    "name": "Бензин моторный,свинец от 0,013 г/л",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "870431",
    "code_gng": "87043100",
    "name": "Средства транспортные грузовые с бензиновым ДВС,масса до 5т",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "870321",
    "code_gng": "87032100",
    "name": "Автомобили легковые с бензиновым ДВС,объем цилиндров до 1000см3",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "871190",
    "code_gng": "87119000",
    "name": "Мотоциклы (включая мопеды) и велосипеды с бензиновым ДВС;коляски,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "871120",
    "code_gng": "87112000",
    "name": "Мотоциклы,мопеды с бензиновым ДВС,объем цилиндров от 50 до 250см3",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "871110",
    "code_gng": "87111000",
    "name": "Мотоциклы,мопеды с бензиновым ДВС,объем цилиндров до 50см3",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "272400",
    "code_gng": "27240001",
    "name": "Бензин автомобильный с содержанием свинца более 0, 013 г/л",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271012",
    "code_gng": "27101231",
    "name": "Бензины авиационные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271012",
    "code_gng": "27101270",
    "name": "Топливо легкое для реактивных двигателей (за исключением авиационного бензина)",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "870210",
    "code_gng": "87021000",
    "name": "Средства транспортные с дизельным ДВС,на 10 человек и более",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "870422",
    "code_gng": "87042200",
    "name": "Средства транспортные грузовые с дизельным ДВС,масса от 5т до 20т",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "860290",
    "code_gng": "86029000",
    "name": "Локомотивы прочие,кроме локомотивов дизель-электрических;тендеры локомотивные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "860210",
    "code_gng": "86021000",
    "name": "Локомотивы дизель-электрические",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "860200",
    "code_gng": "86020000",
    "name": "Локомотивы дизельные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "870210",
    "code_gng": "87021001",
    "name": "Автомобили для перевозки 10 и более человек с дизельным двигателем",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "870210",
    "code_gng": "87021002",
    "name": "Амфибии с дизельным двигателем",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "870210",
    "code_gng": "87021003",
    "name": "Миниавтобусы с дизельным двигателем",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "274400",
    "code_gng": "27440000",
    "name": "Мазут тяжелый",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "274300",
    "code_gng": "27430000",
    "name": "Мазут легкий,суперлегкий",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "274200",
    "code_gng": "27420001",
    "name": "Мазут легкий, суперлегкий",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "272900",
    "code_gng": "27290000",
    "name": "Масла легкие из нефти и битуминозных материалов,",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "273900",
    "code_gng": "27390000",
    "name": "Масла среднетяжелые из нефти и битуминозных материалов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "274900",
    "code_gng": "27490000",
    "name": "Масла тяжелые из нефти,битуминозных материалов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271320",
    "code_gng": "27132000",
    "name": "Битум нефтяной",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271490",
    "code_gng": "27149000",
    "name": "Битум и асфальт природные;асфальтиты и асфальтовые породы",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "481110",
    "code_gng": "48111000",
    "name": "Бумага,картон гудронированные,битуминизированные или асфальтированные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "847432",
    "code_gng": "84743200",
    "name": "Машины для смешивания минеральных веществ с битумом",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270900",
    "code_gng": "27090001",
    "name": "Масла из битуминозных минералов сырые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271312",
    "code_gng": "27131201",
    "name": "Битумы нефтяные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271320",
    "code_gng": "27132002",
    "name": "Масса клейкая битумная",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271390",
    "code_gng": "27139002",
    "name": "Остатки нефтяные из битуминозных минералов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271410",
    "code_gng": "27141001",
    "name": "Сланец битуминозный",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271490",
    "code_gng": "27149002",
    "name": "Битум асфальтовый",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271490",
    "code_gng": "27149003",
    "name": "Битум бурого угля",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271490",
    "code_gng": "27149007",
    "name": "Смеси битуминозные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271500",
    "code_gng": "27150001",
    "name": "Битумы наполнительные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271500",
    "code_gng": "27150002",
    "name": "Эмульсии битумные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271500",
    "code_gng": "27150003",
    "name": "Масса наполнительная для кабелей битуминозная",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271500",
    "code_gng": "27150007",
    "name": "Мастика битумная",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "273200",
    "code_gng": "27320001",
    "name": "Масла среднетяжелые из нефти, битуминозных минералов, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "680710",
    "code_gng": "68071001",
    "name": "Изделия из битума в рулонах",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "680790",
    "code_gng": "68079001",
    "name": "Изделия из битума, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "273200",
    "code_gng": "27320000",
    "name": "Керосин (отличный от авиационного топлива)",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271019",
    "code_gng": "27101925",
    "name": "Керосин осветительный (за исключением топлива для реактивных двигателей)",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "480100",
    "code_gng": "48010000",
    "name": "Бумага газетная в рулонах или листах",
    "category": "Товары народного потребления (ТНП)",
    "tariff_class": 3,
    "default_wagon": "boxcar",
    "security_required": false
  },
  {
    "code_etsng": "730410",
    "code_gng": "73041000",
    "name": "Трубы для нефте-,газопроводов бесшовные,из черных металлов,нечугуные",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "731100",
    "code_gng": "73110010",
    "name": "Емкости из черных металлов,для сжатого,сжиженного газа,бесшовные",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "731100",
    "code_gng": "73110099",
    "name": "Емкости из черных металлов,для сжатого,сжиженного газа,вместимость от 1000л",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "732181",
    "code_gng": "73218100",
    "name": "Печи отопительные из черных металлов,газовые",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "270500",
    "code_gng": "27050003",
    "name": "Газ генераторный",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "490199",
    "code_gng": "49019901",
    "name": "Газеты картонированные в переплете (также коллекции)",
    "category": "Товары народного потребления (ТНП)",
    "tariff_class": 3,
    "default_wagon": "boxcar",
    "security_required": false
  },
  {
    "code_etsng": "730400",
    "code_gng": "73040000",
    "name": "Трубы из железа (кроме чугуна), стали, для нефте-или газопроводов, бесшовные",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "732111",
    "code_gng": "73211101",
    "name": "Плиты бытовые газовые из железа, стали",
    "category": "Товары народного потребления (ТНП)",
    "tariff_class": 3,
    "default_wagon": "boxcar",
    "security_required": false
  },
  {
    "code_etsng": "732111",
    "code_gng": "73211103",
    "name": "Приборы-гриль бытовые газовые из железа, стали",
    "category": "Товары народного потребления (ТНП)",
    "tariff_class": 3,
    "default_wagon": "boxcar",
    "security_required": false
  },
  {
    "code_etsng": "761300",
    "code_gng": "76130000",
    "name": "Емкости из алюминия для сжатых или сжиженных газов",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "761300",
    "code_gng": "76130001",
    "name": "Бутылки из алюминия для сжатых или сжиженных газов",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "843300",
    "code_gng": "84330000",
    "name": "Газонокосилки с двигателем и горизонтально вращающимся ножом",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "846820",
    "code_gng": "84682001",
    "name": "Аппараты для пайки газовые",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "902620",
    "code_gng": "90262001",
    "name": "Приборы для измерения и контроля давления жидкостей или газов, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "280400",
    "code_gng": "28040000",
    "name": "Водород, газы инертные и прочие неметаллы",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730439",
    "code_gng": "73043991",
    "name": "Трубы газовые, наружным диаметром не более 168,3 мм",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730439",
    "code_gng": "73043993",
    "name": "Трубы газовые, наружным диаметром от 168,3 до 406,4 мм",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730439",
    "code_gng": "73043999",
    "name": "Трубы газовые, наружным диаметром более 406,4 мм",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730610",
    "code_gng": "73061000",
    "name": "Трубы для нефте- и газопроводов из черных металлов",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730610",
    "code_gng": "73061090",
    "name": "Трубы для нефте- и газопроводов, сварные спиральношовные, из черных металлов",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "732181",
    "code_gng": "73218190",
    "name": "Печи отопительные, из черных металлов, кроме работающих на газовом виде топлива",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "840590",
    "code_gng": "84059000",
    "name": "Части газогенераторов",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "841960",
    "code_gng": "84196000",
    "name": "Машины для сжижения воздуха или газов",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "842139",
    "code_gng": "84213900",
    "name": "Оборудование для фильтрования или очистки газов, прочее",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "842139",
    "code_gng": "84213910",
    "name": "Оборудование для фильтрования или очистки газов прочее для гражданской авиации",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "842139",
    "code_gng": "84213951",
    "name": "Оборудование для фильтрования или очистки прочих газов с помощью жидкостей",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "842139",
    "code_gng": "84213998",
    "name": "Оборудование для фильтрования или очистки прочих газов, прочее",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "843319",
    "code_gng": "84331990",
    "name": "Косилки для газонов, парков или спортплощадок прочие без двигателя",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "846729",
    "code_gng": "84672980",
    "name": "Машины для подрезки живой изгороди и стрижки газонов",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "846820",
    "code_gng": "84682000",
    "name": "Оборудование и аппараты, работающие на газе, прочие",
    "category": "Машины, оборудование и техника",
    "tariff_class": 3,
    "default_wagon": "cont40",
    "security_required": true
  },
  {
    "code_etsng": "853939",
    "code_gng": "85393900",
    "name": "Лампы газоразрядные, за исключением ламп ультрафиолетового излучения, прочие",
    "category": "Опасные грузы (ADR)",
    "tariff_class": 3,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "940360",
    "code_gng": "94036030",
    "name": "Мебель деревянная магазинная",
    "category": "Товары народного потребления (ТНП)",
    "tariff_class": 3,
    "default_wagon": "boxcar",
    "security_required": false
  },
  {
    "code_etsng": "285390",
    "code_gng": "28539030",
    "name": "Жидкий воздух (с удалением или без удаления инертных газов); сжатый воздух",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "730411",
    "code_gng": "73041100",
    "name": "Трубы для нефте- и газопроводов бесшовные, из коррозионностойкой стали",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730439",
    "code_gng": "73043992",
    "name": "Трубы газовые, наружным диаметром не более 168.3 мм",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730611",
    "code_gng": "73061100",
    "name": "Трубы для нефте- и газопроводов сварные из коррозионностойкой стали",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730611",
    "code_gng": "73061110",
    "name": "Трубы для нефте- и газопроводов сварные прямошовные из коррозионностойкой стали",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730619",
    "code_gng": "73061900",
    "name": "Трубы для нефте- и газопроводов сварные, из черных металлов, прочие",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "730619",
    "code_gng": "73061910",
    "name": "Трубы для нефте- и газопроводов сварные прямошовные, из черных металлов, прочие",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "841470",
    "code_gng": "84147000",
    "name": "Газонепроницаемые шкафы биологической безопасности",
    "category": "Опасные грузы (ADR)",
    "tariff_class": 3,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "120799",
    "code_gng": "12079998",
    "name": "Семена и плоды масличных культур,к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "120799",
    "code_gng": "12079920",
    "name": "Семена и плоды масличных культур для посева,к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "070990",
    "code_gng": "07099039",
    "name": "Маслины свежие,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "273100",
    "code_gng": "27310000",
    "name": "Масло среднетяжелое,топливо авиационное турбинное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "274600",
    "code_gng": "27460000",
    "name": "Масла смазочные неотработанные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "274500",
    "code_gng": "27450000",
    "name": "Масла смазочные отработанные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "271220",
    "code_gng": "27122000",
    "name": "Парафин,масла до 0,75%",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330129",
    "code_gng": "33012900",
    "name": "Масла эфирные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330129",
    "code_gng": "33012991",
    "name": "Масла эфирные,без терпенов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380690",
    "code_gng": "38069000",
    "name": "Спирт канифольный,масла канифольные и переплавленные смолы",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "321000",
    "code_gng": "32100010",
    "name": "Краски масляные,лаки,эмали и политуры",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270799",
    "code_gng": "27079991",
    "name": "Масла для получения продуктов позиции 2803",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270791",
    "code_gng": "27079100",
    "name": "Масла креозотовые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159091",
    "name": "Масла и их фракции в твердом виде,упаковка до 1кг,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380300",
    "code_gng": "38030090",
    "name": "Масло талловое,",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151530",
    "code_gng": "15153090",
    "name": "Масло касторовое и его фракции,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "382313",
    "code_gng": "38231300",
    "name": "Кислоты жирные таллового масла",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159040",
    "name": "Масла сырые,технические",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380520",
    "code_gng": "38052000",
    "name": "Масло сосновое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "040500",
    "code_gng": "04050000",
    "name": "Масло сливочное и жиры и масла,изготовленные из молока;молочные пасты",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "040510",
    "code_gng": "04051090",
    "name": "Масло сливочное,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150300",
    "code_gng": "15030030",
    "name": "Масло животное,техническое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159000",
    "name": "Жиры растительные и масла,кроме указанных в позициях 1515 11 - 1515 50",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150810",
    "code_gng": "15081000",
    "name": "Масло арахисовое сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151491",
    "code_gng": "15149190",
    "name": "Масло горчичное сырое,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151530",
    "code_gng": "15153000",
    "name": "Масло касторовое и его фракции",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151311",
    "code_gng": "15131199",
    "name": "Масло кокосовое сырое,пищевое,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151550",
    "code_gng": "15155000",
    "name": "Масло кунжутное и его фракции",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151511",
    "code_gng": "15151100",
    "name": "Масло льняное сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150910",
    "code_gng": "15091000",
    "name": "Масло оливковое первого (холодного) прессования",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151110",
    "code_gng": "15111000",
    "name": "Масло пальмовое сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151190",
    "code_gng": "15119000",
    "name": "Масло пальмовое и его фракции без изменения химического состава,",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151000",
    "code_gng": "15100090",
    "name": "Масла оливковые,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151219",
    "code_gng": "15121999",
    "name": "Масло сафлоровое,пищевое,к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150710",
    "code_gng": "15071000",
    "name": "Масло соевое сырое,нерафинированное или рафинированное гидратацией",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "151540",
    "code_gng": "15154000",
    "name": "Масло тунговое и его фракции",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151221",
    "code_gng": "15122100",
    "name": "Масло хлопковое сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "152200",
    "code_gng": "15220031",
    "name": "Соапстоки с маслом со свойствами оливкового масла",
    "category": "Черные и цветные металлы",
    "tariff_class": 2,
    "default_wagon": "platform",
    "security_required": true
  },
  {
    "code_etsng": "200570",
    "code_gng": "20057090",
    "name": "Маслины,приготовленные без уксуса,немороженые,к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "380590",
    "code_gng": "38059000",
    "name": "Дипентен и пара-цимол неочищенные,скипидар сульфитный и масла терпеновые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "291213",
    "code_gng": "29121300",
    "name": "Бутаналь (масляный альдегид,нормальный изомер)",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151800",
    "code_gng": "15180039",
    "name": "Масла нелетучие растительные жидкие,смешанные,непищевые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "040490",
    "code_gng": "04049001",
    "name": "Масло сливочное и прочие молочные жиры",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "040500",
    "code_gng": "04050002",
    "name": "Масло сливочное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "120799",
    "code_gng": "12079901",
    "name": "Плоды маслосодержащие, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "120799",
    "code_gng": "12079902",
    "name": "Семена масляничные, к.п.о.",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150420",
    "code_gng": "15042001",
    "name": "Масло из рыб (кроме масла из печени)",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150430",
    "code_gng": "15043001",
    "name": "Масло китовое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150430",
    "code_gng": "15043002",
    "name": "Масло морских млекопитающих",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150910",
    "code_gng": "15091001",
    "name": "Масло оливковое очищенное и необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150990",
    "code_gng": "15099001",
    "name": "Масло оливковое, к. п. о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151000",
    "code_gng": "15100000",
    "name": "Масло оливковое, не модифицированное химически, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151000",
    "code_gng": "15100001",
    "name": "Масло оливковое из выжимок, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151100",
    "code_gng": "15110000",
    "name": "Масло пальмовое необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151110",
    "code_gng": "15111001",
    "name": "Масло пальмовое очищенное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151211",
    "code_gng": "15121101",
    "name": "Масло сафлоровое необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151219",
    "code_gng": "15121901",
    "name": "Масло сафлоровое очищенное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151221",
    "code_gng": "15122101",
    "name": "Масло хлопковое очищенное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151300",
    "code_gng": "15130000",
    "name": "Масло кокосовое необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151311",
    "code_gng": "15131101",
    "name": "Масло копровое необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151311",
    "code_gng": "15131102",
    "name": "Масло кокосовое очищенное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151319",
    "code_gng": "15131901",
    "name": "Масло копровое очищенное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151321",
    "code_gng": "15132101",
    "name": "Масло пальмоядровое необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151329",
    "code_gng": "15132901",
    "name": "Масло пальмоядровое очищенное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151400",
    "code_gng": "15140000",
    "name": "Масло горчичное необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151410",
    "code_gng": "15141002",
    "name": "Масло сурепное необработанное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151490",
    "code_gng": "15149002",
    "name": "Масло сурепное очищенное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151529",
    "code_gng": "15152901",
    "name": "Масло касторовое, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151530",
    "code_gng": "15153001",
    "name": "Масло древесное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151540",
    "code_gng": "15154001",
    "name": "Масло тунговое, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151540",
    "code_gng": "15154002",
    "name": "Масло кунжутное, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159004",
    "name": "Масла растительные, не модифицированные химически, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159005",
    "name": "Масло из семян бука, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159006",
    "name": "Масло маковое, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159007",
    "name": "Масло миндалевое, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159008",
    "name": "Масло ореховое, не модифицированное химически",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151800",
    "code_gng": "15180002",
    "name": "Масла животные, модифицированные химически, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151800",
    "code_gng": "15180004",
    "name": "Масла растительные сиккатированные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151800",
    "code_gng": "15180005",
    "name": "Масла растительные, модифицированные химически, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "160413",
    "code_gng": "16041304",
    "name": "Сардины в масле",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "180400",
    "code_gng": "18040001",
    "name": "Какао-масло",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "180400",
    "code_gng": "18040002",
    "name": "Масло жидкое из какао",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270730",
    "code_gng": "27073003",
    "name": "Масло нафталиновое, необработанное, рафинированное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270791",
    "code_gng": "27079101",
    "name": "Масло креозотовое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270799",
    "code_gng": "27079901",
    "name": "Масла минеральных смол, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270799",
    "code_gng": "27079902",
    "name": "Масла смоляные, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270799",
    "code_gng": "27079903",
    "name": "Масло антраценовое инсектицидное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270900",
    "code_gng": "27090002",
    "name": "Масло сланцевое сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "291560",
    "code_gng": "29156002",
    "name": "Кислоты изомасляные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "291560",
    "code_gng": "29156003",
    "name": "Кислоты масляные и их соли чистые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "291615",
    "code_gng": "29161502",
    "name": "Кислота масляная чистая (минимум 85%) и ее соли",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "292141",
    "code_gng": "29214101",
    "name": "Масло анилиновое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "292690",
    "code_gng": "29269008",
    "name": "Нитрил изомасляной кислоты",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330123",
    "code_gng": "33012301",
    "name": "Масло лавендовое эфирное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330126",
    "code_gng": "33012601",
    "name": "Масла эфирные, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330190",
    "code_gng": "33019001",
    "name": "Концентраты эфирных масел в жирах, в нелетучих маслах, в восках",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "340211",
    "code_gng": "34021101",
    "name": "Масла сульфонированные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380400",
    "code_gng": "38040001",
    "name": "Сульфонаты лигнина (кроме таллового масла)",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380500",
    "code_gng": "38050000",
    "name": "Масло скипидарное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380510",
    "code_gng": "38051001",
    "name": "Масло скипидарное сульфатное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380590",
    "code_gng": "38059001",
    "name": "Масла, содержащие скипидар и полученные от смолокурения",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380630",
    "code_gng": "38063001",
    "name": "Масло смоляное, легкое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380690",
    "code_gng": "38069001",
    "name": "Масло смоляное, тяжелое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380700",
    "code_gng": "38070003",
    "name": "Масло древесного дегтя",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "380810",
    "code_gng": "38081001",
    "name": "Масло антраценовое, являющееся инсектицидом",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "382319",
    "code_gng": "38231903",
    "name": "Масла кислые и рафинированные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "382490",
    "code_gng": "38249014",
    "name": "Масло сивушное, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "382490",
    "code_gng": "38249031",
    "name": "Средства масляные связующие, к.п.о.",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "481140",
    "code_gng": "48114001",
    "name": "Бумага упаковочная промасленная",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "040510",
    "code_gng": "04051030",
    "name": "Масло сливочное рекомбинированное с содержанием жира не более 85 мас.%",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "040510",
    "code_gng": "04051050",
    "name": "Масло сывороточное с содержанием жира не более 85 мас.%",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "071080",
    "code_gng": "07108010",
    "name": "Маслины или оливки (сырые или сваренные в воде или на пару), мороженые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "071120",
    "code_gng": "07112000",
    "name": "Маслины или оливки, консервированные для кратковременного хранения",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "071120",
    "code_gng": "07112090",
    "name": "Маслины или оливки, консервированные для кратковременного хранения, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "120799",
    "code_gng": "12079900",
    "name": "Семена и плоды прочих масличных культур, кроме поименованных выше",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150420",
    "code_gng": "15042000",
    "name": "Жиры и масла из рыбы и их фракции, кроме жира из печени",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150420",
    "code_gng": "15042090",
    "name": "Жиры и масла из рыбы и их фракции (кроме твердых), кроме жира из печени рыб",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150430",
    "code_gng": "15043010",
    "name": "Жиры и масла морских млекопитающих и их твердые фракции",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150430",
    "code_gng": "15043090",
    "name": "Жиры и масла морских млекопитающих, за исключением твердых фракций",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150710",
    "code_gng": "15071090",
    "name": "Масло соевое сырое, нерафинированное или рафинированное гидратацией, прочее",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150790",
    "code_gng": "15079090",
    "name": "Масло соевое и его фракции нерафинированные или рафинированные, для прочих целей",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  },
  {
    "code_etsng": "150810",
    "code_gng": "15081090",
    "name": "Масло сырое арахисовое, прочее",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150910",
    "code_gng": "15091010",
    "name": "Масло оливковое очищенное первого (холодного) прессования",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "150910",
    "code_gng": "15091090",
    "name": "Масло оливковое первого (холодного) прессования, прочее",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151000",
    "code_gng": "15100010",
    "name": "Масла сырые",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151110",
    "code_gng": "15111090",
    "name": "Масло пальмовое сырое, прочее",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151190",
    "code_gng": "15119019",
    "name": "Фракции твердые масла пальмового в первичных упаковках нетто-массой более 1 кг",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151190",
    "code_gng": "15119099",
    "name": "Фракции масла пальмового, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151211",
    "code_gng": "15121199",
    "name": "Масло сафлоровое сырое для пищевых продуктов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151221",
    "code_gng": "15122190",
    "name": "Масло хлопковое сырое, очищенное от госсипола или неочищенное, прочее",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151229",
    "code_gng": "15122900",
    "name": "Масло хлопковое и его фракции прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151229",
    "code_gng": "15122990",
    "name": "Масло хлопковое и его фракции прочие для пищевых продуктов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151311",
    "code_gng": "15131100",
    "name": "Масло кокосовое (копровое) сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151319",
    "code_gng": "15131900",
    "name": "Масло кокосовое (копровое) и его фракции, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151319",
    "code_gng": "15131919",
    "name": "Фракции кокосового масла твердые, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151319",
    "code_gng": "15131999",
    "name": "Фракции кокосового масла прочие, кроме поименованных выше",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151321",
    "code_gng": "15132100",
    "name": "Масло пальмоядровое или масло бабассу сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151321",
    "code_gng": "15132190",
    "name": "Масло пальмоядровое или масло бабассу сырое для пищевых продуктов, прочее",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151329",
    "code_gng": "15132900",
    "name": "Масло пальмоядровое или масло бабассу и их фракции, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151329",
    "code_gng": "15132991",
    "name": "Масло пальмоядровое для пищевых продуктов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151329",
    "code_gng": "15132999",
    "name": "Масло бабассу для пищевых продуктов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151491",
    "code_gng": "15149100",
    "name": "Масло горчичное сырое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151499",
    "code_gng": "15149990",
    "name": "Фракции масла горчичного, для пищевых продуктов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151519",
    "code_gng": "15151900",
    "name": "Масло льняное и его фракции, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151519",
    "code_gng": "15151990",
    "name": "Масло льняное прочее и его фракции пищевое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151550",
    "code_gng": "15155019",
    "name": "Масло кунжутное сырое, пищевое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151550",
    "code_gng": "15155099",
    "name": "Фракции масла кунжутного для пищевых продуктов",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159015",
    "name": "Масло жожоба и ойтиковое; воск из мирта и японский воск; их фракции",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159029",
    "name": "Масло сырое табачное, прочее",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159039",
    "name": "Фракции табачного масла, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159059",
    "name": "Масла сырые, прочие пищевые в твердом виде; в жидком виде",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151590",
    "code_gng": "15159099",
    "name": "Масла прочие и их фракции в твердом виде, прочие; в жидком виде",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151610",
    "code_gng": "15161000",
    "name": "Жиры и масла животные и их фракции",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151610",
    "code_gng": "15161090",
    "name": "Жиры и масла животные и их фракции, прочие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151620",
    "code_gng": "15162000",
    "name": "Жиры и масла растительные и их фракции",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151620",
    "code_gng": "15162010",
    "name": "Масло гидрогенизированное касторовое, так называемый \"опаловый воск\"",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "151790",
    "code_gng": "15179091",
    "name": "Масла нелетучие растительные жидкие, смешанные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "152200",
    "code_gng": "15220091",
    "name": "Фуз масличный и жировые остатки; соапстоки",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270799",
    "code_gng": "27079919",
    "name": "Масла прочие неочищенные",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "270799",
    "code_gng": "27079930",
    "name": "Масла осерненные легкие",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "291560",
    "code_gng": "29156000",
    "name": "Кислоты масляные, валериановые кислоты, их соли и сложные эфиры",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "293090",
    "code_gng": "29309030",
    "name": "DL-2-гидрокси-4-(метилтио)масляная кислота",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330111",
    "code_gng": "33011100",
    "name": "Масло бергамотное",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330111",
    "code_gng": "33011110",
    "name": "Масло бергамотное, содержащее терпены",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330111",
    "code_gng": "33011190",
    "name": "Масло бергамотное, не содержащее терпены",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330112",
    "code_gng": "33011200",
    "name": "Масло апельсиновое",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "330112",
    "code_gng": "33011210",
    "name": "Масло апельсиновое, содержащее терпены",
    "category": "Нефть и нефтепродукты",
    "tariff_class": 2,
    "default_wagon": "tank",
    "security_required": true
  },
  {
    "code_etsng": "999999",
    "code_gng": "99999900",
    "name": "Обобщенная позиция для группы грузов разного класса",
    "category": "Зерновые и с/х культуры",
    "tariff_class": 2,
    "default_wagon": "grain",
    "security_required": false
  }
];

  // 3. МЕЖГОСУДАРСТВЕННЫЕ ПОГРАНИЧНЫЕ СТЫКИ
  var BORDER_CROSSINGS = {
    'KAZ-UZB': [
      { code: '704101', name: 'ст. Сарыагаш (эксп.) [КТЖ] / ст. Келес (эксп.) [УТИ]', exitCode: '704101', enterCode: '720104', fee: 85, days: 1, primary: true },
      { code: '662905', name: 'ст. Бейнеу (эксп.) [КТЖ] / ст. Каракалпакстан [УТИ]', exitCode: '662905', enterCode: '739801', fee: 95, days: 1 }
    ],
    'KAZ-CHN': [
      { code: '708507', name: 'ст. Достык (эксп.) [КТЖ] / Алашанькоу [КНР]', exitCode: '708507', enterCode: '000000', fee: 280, transshipment: true, days: 2, primary: true },
      { code: '707701', name: 'ст. Алтынколь (эксп.) [КТЖ] / Хоргос [КНР]', exitCode: '707701', enterCode: '000000', fee: 260, transshipment: true, days: 2 }
    ],
    'RUS-KAZ': [
      { code: '666501', name: 'ст. Илецк I (эксп.) [Ю-Ур / КТЖ]', exitCode: '666501', enterCode: '666501', fee: 65, days: 1, primary: true },
      { code: '664900', name: 'ст. Озинки (эксп.) [Прив / КТЖ]', exitCode: '664900', enterCode: '664900', fee: 65, days: 1 },
      { code: '816909', name: 'ст. Карталы I (эксп.) [Ю-Ур / КТЖ]', exitCode: '816909', enterCode: '816909', fee: 65, days: 1 },
      { code: '815502', name: 'ст. Орск (эксп.) [Ю-Ур / КТЖ]', exitCode: '815502', enterCode: '815502', fee: 65, days: 1 },
      { code: '688708', name: 'ст. Петропавловск (эксп.) [Ю-Ур / КТЖ]', exitCode: '688708', enterCode: '688708', fee: 65, days: 1 },
      { code: '711105', name: 'ст. Локоть (эксп.) [З-Сиб / КТЖ]', exitCode: '711105', enterCode: '711105', fee: 65, days: 1 },
      { code: '843905', name: 'ст. Кулунда (эксп.) [З-Сиб / КТЖ]', exitCode: '843905', enterCode: '843905', fee: 65, days: 1 }
    ],
    'UZB-AFG': [
      { code: '734606', name: 'ст. Галаба (эксп.) [УТИ] / ст. Хайратан [АРА]', exitCode: '734606', enterCode: '000251', fee: 140, days: 1, primary: true }
    ],
    'UZB-TKM': [
      { code: '736501', name: 'ст. Ходжадавлет (эксп.) [УТИ] / ст. Фарап [ТРК]', exitCode: '736501', enterCode: '753009', fee: 90, days: 1, primary: true }
    ],
    'UZB-TJK': [
      { code: '736003', name: 'ст. Кудукли (эксп.) [УТИ] / ст. Пахтаабад [ТДЖ]', exitCode: '736003', enterCode: '745100', fee: 85, days: 1, primary: true }
    ],
    'KAZ-KGZ': [
      { code: '704402', name: 'ст. Луговая (эксп.) [КТЖ] / ст. Чалдовар [КРГ]', exitCode: '704402', enterCode: '715106', fee: 75, days: 1, primary: true }
    ]
  };

  // 4. КООРДИНАТНАЯ СЕТКА ХАБОВ И УЗЛОВ ДЛЯ РАСЧЕТА ДИСТАНЦИИ (ШИРОТА, ДОЛГОТА)
  var HUB_COORDS = {
    'астана': [51.16, 71.43],
    'алматы': [43.23, 76.92],
    'караганда': [49.80, 73.08],
    'кокшетау': [53.28, 69.38],
    'шымкент': [42.32, 69.60],
    'актобе': [50.28, 57.16],
    'атырау': [47.11, 51.88],
    'актау': [43.65, 51.16],
    'павлодар': [52.28, 76.96],
    'костанай': [53.21, 63.63],
    'семей': [50.41, 80.25],
    'устькаменогорск': [49.95, 82.60],
    'тараз': [42.90, 71.37],
    'кызылорда': [44.84, 65.50],
    'достык': [45.25, 82.48],
    'алтынколь': [44.15, 80.35],
    'сарыагаш': [41.47, 69.17],
    'бейнеу': [45.32, 55.19],
    'илецк': [51.16, 54.98],
    'озинки': [51.20, 49.70],
    'локоть': [50.98, 81.33],
    'петропавловск': [54.87, 69.15],
    'курык': [43.18, 51.65],
    'луговая': [42.94, 72.76],
    'ташкент': [41.31, 69.24],
    'келес': [41.40, 69.20],
    'сергели': [41.22, 69.22],
    'чукурсай': [41.36, 69.23],
    'самарканд': [39.65, 66.97],
    'бухара': [39.77, 64.42],
    'навои': [40.08, 65.37],
    'карши': [38.86, 65.80],
    'термез': [37.22, 67.27],
    'галаба': [37.19, 67.43],
    'хайратан': [37.21, 67.41],
    'андижан': [40.78, 72.34],
    'фергана': [40.38, 71.78],
    'коканд': [40.53, 70.94],
    'ургенч': [41.55, 60.63],
    'нукус': [42.46, 59.61],
    'джизак': [40.11, 67.84],
    'ангрен': [41.01, 70.14],
    'ходжадавлет': [39.22, 63.60],
    'кудукли': [38.45, 68.10],
    'москва': [55.75, 37.61],
    'санктпетербург': [59.93, 30.33],
    'екатеринбург': [56.83, 60.60],
    'челябинск': [55.16, 61.43],
    'новосибирск': [55.03, 82.92],
    'самара': [53.20, 50.15],
    'омск': [54.98, 73.36],
    'барнаул': [53.35, 83.76],
    'уфа': [54.73, 55.95],
    'казань': [55.79, 49.12],
    'волгоград': [48.70, 44.51],
    'ростов': [47.23, 39.72],
    'краснодар': [45.03, 38.97],
    'новороссийск': [44.72, 37.76],
    'забайкальск': [49.65, 117.33],
    'карталы': [53.05, 60.65],
    'орск': [51.20, 58.56],
    'кулунда': [52.56, 78.94],
    'саратов': [51.54, 46.00],
    'оренбург': [51.77, 55.10],
    'курган': [55.44, 65.34],
    'магнитогорск': [53.41, 58.98],
    'экибастуз': [51.72, 75.32],
    'уральск': [51.23, 51.37],
    'туркестан': [43.30, 68.25],
    'бишкек': [42.87, 74.59],
    'аламедин': [42.87, 74.59],
    'душанбе': [38.56, 68.78],
    'худжанд': [40.28, 69.62]
  };

  // 5. БАЗОВАЯ ТАБЛИЦА ТОЧНЫХ МЕЖСТАНЦИОННЫХ РАССТОЯНИЙ (КМ) ПО ТАРИФНОМУ РУКОВОДСТВУ
  var CANONICAL_DISTANCES = {
    // КАЗАХСТАНСКИЕ ХАБЫ НА САРЫАГАШ
    "кокшетау_сарыагаш": 1918,
    "астана_сарыагаш": 1622,
    "караганда_сарыагаш": 1386,
    "павлодар_сарыагаш": 2045,
    "костанай_сарыагаш": 2135,
    "семей_сарыагаш": 1850,
    "устькаменогорск_сарыагаш": 2020,
    "актобе_сарыагаш": 1960,
    "атырау_сарыагаш": 2350,
    "мангышлак_сарыагаш": 2720,
    "алматы_сарыагаш": 814,
    "шымкент_сарыагаш": 132,
    "тараз_сарыагаш": 310,
    "кызылорда_сарыагаш": 650,
    "достык_сарыагаш": 1980,
    "алтынколь_сарыагаш": 1620,

    // ТРАНЗИТ КТЖ: ВХОД РЖД/КТЖ ➔ ВЫХОД КТЖ/УТИ (САРЫАГАШ)
    "илецк_сарыагаш": 2080,
    "озинки_сарыагаш": 2350,
    "карталы_сарыагаш": 1980,
    "орск_сарыагаш": 1850,
    "петропавловск_сарыагаш": 2140,
    "локоть_сарыагаш": 2180,
    "кулунда_сарыагаш": 2210,

    // ТРАНЗИТ КТЖ: ВХОД РЖД/КТЖ ➔ ВЫХОД КТЖ/УТИ (БЕЙНЕУ)
    "илецк_бейнеу": 1200,
    "озинки_бейнеу": 1350,
    "орск_бейнеу": 1050,
    "карталы_бейнеу": 1380,
    "петропавловск_бейнеу": 1950,
    "локоть_бейнеу": 2650,
    "кулунда_бейнеу": 2680,
    "бейнеу_каракалпакстан": 410,

    // РЖД: ОТПРАВЛЕНИЕ ➔ СТЫКИ РЖД/КТЖ
    "москва_илецк": 1480,
    "москва_озинки": 1320,
    "москва_карталы": 1890,
    "москва_петропавловск": 2280,
    "санктпетербург_илецк": 2150,
    "санктпетербург_озинки": 2050,
    "санктпетербург_карталы": 2420,
    "самара_илецк": 480,
    "самара_озинки": 450,
    "саратов_озинки": 320,
    "саратов_илецк": 680,
    "екатеринбург_карталы": 520,
    "екатеринбург_петропавловск": 680,
    "челябинск_карталы": 260,
    "челябинск_петропавловск": 560,
    "челябинск_орск": 490,
    "магнитогорск_карталы": 145,
    "новосибирск_локоть": 560,
    "новосибирск_кулунда": 470,
    "барнаул_локоть": 340,
    "барнаул_кулунда": 360,
    "омск_петропавловск": 270,
    "курган_петропавловск": 260,
    "уфа_илецк": 510,
    "уфа_карталы": 490,
    "казань_илецк": 860,
    "волгоград_озинки": 690,
    "ростов_озинки": 1050,

    // УТИ: ВХОД КЕЛЕС (САРЫАГАШ) ➔ СТАНЦИИ УЗБЕКИСТАНА
    "келес_ташкент": 35,
    "келес_сергели": 45,
    "келес_чукурсай": 28,
    "келес_самарканд": 350,
    "келес_бухара": 610,
    "келес_навои": 510,
    "келес_карши": 490,
    "келес_термез": 710,
    "келес_галаба": 755,
    "келес_андижан": 395,
    "келес_фергана": 410,
    "келес_коканд": 275,
    "келес_ургенч": 990,
    "келес_нукус": 1140,
    "келес_джизак": 235,
    "келес_ангрен": 150,
    "келес_ходжадавлет": 635,
    "келес_кудукли": 475,

    // УТИ: ВХОД КАРАКАЛПАКСТАН (БЕЙНЕУ) ➔ СТАНЦИИ УЗБЕКИСТАНА
    "каракалпакстан_нукус": 380,
    "каракалпакстан_ургенч": 420,
    "каракалпакстан_бухара": 780,
    "каракалпакстан_навои": 880,
    "каракалпакстан_ташкент": 1250,
    "каракалпакстан_самарканд": 990,
    "каракалпакстан_чукурсай": 1250,
    "каракалпакстан_сергели": 1260,

    // ДОПОЛНИТЕЛЬНЫЕ СВЯЗКИ КАЗАХСТАНСКИХ ХАБОВ НА ЧУКУРСАЙ / САРЫАГАШ
    "семей_чукурсай": 1878,
    "семей_ташкент": 1885,
    "кокшетау_чукурсай": 1946,
    "кокшетау_ташкент": 1953,
    "астана_чукурсай": 1650,
    "астана_ташкент": 1657,
    "караганда_чукурсай": 1414,
    "караганда_ташкент": 1421,
    "павлодар_чукурсай": 2073,
    "костанай_чукурсай": 2163,
    "устькаменогорск_чукурсай": 2048,
    "актобе_чукурсай": 1988,
    "шымкент_чукурсай": 160,
    "тараз_чукурсай": 338,
    "экибастуз_сарыагаш": 1890,
    "экибастуз_чукурсай": 1918,
    "уральск_сарыагаш": 2210,
    "туркестан_сарыагаш": 290,

    // РЖД: ПОЛНАЯ МАТРИЦА СТАНЦИЙ ОТПРАВЛЕНИЯ НА ВСЕ 7 СТЫКОВ РЖД/КТЖ
    "москва_орск": 1750,
    "москва_локоть": 3500,
    "москва_кулунда": 3380,
    "санктпетербург_орск": 2380,
    "санктпетербург_петропавловск": 2850,
    "санктпетербург_локоть": 4050,
    "санктпетербург_кулунда": 3950,
    "екатеринбург_илецк": 980,
    "екатеринбург_озинки": 1320,
    "екатеринбург_орск": 810,
    "екатеринбург_локоть": 1680,
    "екатеринбург_кулунда": 1510,
    "челябинск_илецк": 750,
    "челябинск_озинки": 1100,
    "челябинск_локоть": 1490,
    "челябинск_кулунда": 1320,
    "самара_карталы": 820,
    "самара_орск": 730,
    "самара_петропавловск": 1420,
    "самара_локоть": 2680,
    "самара_кулунда": 2520,
    "казань_озинки": 810,
    "казань_карталы": 950,
    "казань_орск": 1120,
    "казань_петропавловск": 1580,
    "уфа_орск": 540,
    "уфа_озинки": 760,
    "уфа_петропавловск": 1080,
    "новосибирск_петропавловск": 920,
    "новосибирск_карталы": 1650,
    "новосибирск_илецк": 2180,
    "новосибирск_озинки": 2540
  };

  // 6. ПАРК ВАГОНОВ И ТАРИФЫ ПРЕДОСТАВЛЕНИЯ CARAVAN
  var ROLLING_STOCK = {
    'grain': { name: 'Зерновоз / Хоппер (для зерна, 70 тн, 116 м³)', dailyRateUSD: 38, payloadTons: 70, volumeM3: 116, speedKmPerDay: 350, defaultCargo: '100199' },
    'boxcar': { name: 'Крытый вагон (грузовой, 68 тн, 138 м³)', dailyRateUSD: 34, payloadTons: 68, volumeM3: 138, speedKmPerDay: 380, defaultCargo: '110100' },
    'gondola': { name: 'Полувагон (универсальный 4-осный, 70 тн)', dailyRateUSD: 32, payloadTons: 70, volumeM3: 88, speedKmPerDay: 400, defaultCargo: '270112' },
    'tank': { name: 'Цистерна (наливные грузы / ГСМ, 66 тн)', dailyRateUSD: 42, payloadTons: 66, volumeM3: 85, speedKmPerDay: 360, defaultCargo: '271012' },
    'platform': { name: 'Фитинговая платформа (тяжеловесы/негабарит)', dailyRateUSD: 30, payloadTons: 72, volumeM3: 0, speedKmPerDay: 420, defaultCargo: '720810' },
    'cont40': { name: 'Контейнер 40ft High Cube (HQ, 28 тн, 76 м³)', dailyRateUSD: 28, payloadTons: 28, volumeM3: 76, speedKmPerDay: 450, defaultCargo: '990100' },
    'cont20': { name: 'Контейнер 20ft (универсальный, 24 тн, 33 м³)', dailyRateUSD: 20, payloadTons: 24, volumeM3: 33, speedKmPerDay: 450, defaultCargo: '990100' }
  };

  // 7. ТАРИФНЫЕ ПОЯСА ИНФРАСТРУКТУРЫ ($ / КМ)
  var TARIFF_BELTS = [
    { maxKm: 200,  rateUSD: 0.78 },
    { maxKm: 500,  rateUSD: 0.65 },
    { maxKm: 1000, rateUSD: 0.54 },
    { maxKm: 2000, rateUSD: 0.44 },
    { maxKm: 3000, rateUSD: 0.38 },
    { maxKm: 9999, rateUSD: 0.33 }
  ];

  // 8. КУРСЫ ВАЛЮТ
  var CURRENCY_RATES = {
    'USD': { code: 'USD', symbol: '$', rate: 1.0, title: 'Доллар США' },
    'KZT': { code: 'KZT', symbol: '₸', rate: 485.0, title: 'Казахстанский тенге' },
    'UZS': { code: 'UZS', symbol: 'сум', rate: 12750.0, title: 'Узбекский сум' },
    'RUB': { code: 'RUB', symbol: '₽', rate: 92.5, title: 'Российский рубль' }
  };

  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ПОИСКА
  function cleanStationName(raw) {
    if (!raw) return '';
    var s = ('' + raw).toLowerCase();
    s = s.replace(/ст\.\s*/gi, '')
         .replace(/\(.* switch .*?\)/gi, '')
         .replace(/\(.*?\)/g, '')
         .replace(/\[.*?\]/g, '')
         .replace(/\bоп\s+/g, '')
         .trim();

    if (s.indexOf('жана-семей') !== -1 || s.indexOf('жана семей') !== -1 || s.indexOf('семей') !== -1) return 'семей';
    if (s.indexOf('санкт-петербург') !== -1 || s.indexOf('санкт петербург') !== -1 || s.indexOf('санктпетербург') !== -1 || s.indexOf('петербург') !== -1) return 'санктпетербург';
    if (s.indexOf('усть-каменогорск') !== -1 || s.indexOf('усть каменогорск') !== -1 || s.indexOf('устькаменогорск') !== -1) return 'устькаменогорск';
    if (s.indexOf('каменск') !== -1 || s.indexOf('новоуральский') !== -1 || s.indexOf('заполье') !== -1 || s.indexOf('первоуральск') !== -1) return 'екатеринбург';
    if (s.indexOf('новосемейкино') !== -1) return 'самара';
    if (s.indexOf('дубровка-челябинская') !== -1 || s.indexOf('челябинск') !== -1) return 'челябинск';
    if (s.indexOf('мичуринск') !== -1 || s.indexOf('бекасово') !== -1) return 'москва';
    if (s.indexOf('берказань') !== -1 || s.indexOf('казань') !== -1) return 'казань';
    if (s.indexOf('ростов') !== -1) return 'ростов';
    if (s.indexOf('арысь') !== -1) return 'шымкент';
    if (s.indexOf('бурундай') !== -1 || s.indexOf('медеу') !== -1) return 'алматы';
    if (s.indexOf('маргилан') !== -1 || s.indexOf('наманган') !== -1) return 'фергана';
    if (s.indexOf('чукурсай') !== -1) return 'чукурсай';
    if (s.indexOf('сергели') !== -1) return 'сергели';
    if (s.indexOf('ташкент') !== -1) return 'ташкент';
    if (s.indexOf('илецк') !== -1) return 'илецк';
    if (s.indexOf('озинки') !== -1) return 'озинки';
    if (s.indexOf('карталы') !== -1) return 'карталы';
    if (s.indexOf('орск') !== -1) return 'орск';
    if (s.indexOf('петропавловск') !== -1) return 'петропавловск';
    if (s.indexOf('локоть') !== -1) return 'локоть';
    if (s.indexOf('кулунда') !== -1) return 'кулунда';
    if (s.indexOf('сарыагаш') !== -1) return 'сарыагаш';
    if (s.indexOf('келес') !== -1) return 'келес';
    if (s.indexOf('бейнеу') !== -1) return 'бейнеу';
    if (s.indexOf('каракалпакстан') !== -1) return 'каракалпакстан';
    if (s.indexOf('сороковая') !== -1) return 'астана';
    if (s.indexOf('экибастуз') !== -1) return 'экибастуз';
    if (s.indexOf('уральск') !== -1) return 'уральск';
    if (s.indexOf('туркестан') !== -1) return 'туркестан';

    var word = s.split(/[\s\-]/)[0];
    return word.replace(/[^\u0400-\u04FFa-zA-Z]/g, '').toLowerCase();
  }

  function findStation(query) {
    if (!query) return null;
    query = ('' + query).trim();

    var codeMatch = query.match(/\b\d{6}\b/);
    if (codeMatch) {
      var extractedCode = codeMatch[0];
      for (var i = 0; i < STATIONS.length; i++) {
        if (STATIONS[i].code === extractedCode) return STATIONS[i];
      }
    }

    var clean = query.replace(/\(.*?\)/g, '').replace(/ст\.\s*/gi, '').trim().toLowerCase();
    if (!clean) return null;

    for (var i = 0; i < STATIONS.length; i++) {
      if (STATIONS[i].name.toLowerCase().indexOf(clean) !== -1 ||
          clean.indexOf(STATIONS[i].name.toLowerCase()) !== -1) {
        return STATIONS[i];
      }
    }

    var cName = cleanStationName(query);
    if (cName) {
      for (var i = 0; i < STATIONS.length; i++) {
        var stClean = cleanStationName(STATIONS[i].name);
        if (stClean && (stClean === cName || stClean.indexOf(cName) !== -1 || cName.indexOf(stClean) !== -1)) {
          return STATIONS[i];
        }
      }
    }

    return null;
  }

  function searchStations(query, limit) {
    limit = limit || 10;
    if (!query || query.trim().length < 2) return [];
    var q = query.trim().toLowerCase();
    var results = [];

    for (var i = 0; i < STATIONS.length; i++) {
      var st = STATIONS[i];
      if (st.code.indexOf(q) === 0 || st.name.toLowerCase().indexOf(q) !== -1) {
        results.push(st);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  function findCargo(query) {
    if (!query) return CARGO_ITEMS[0];
    var q = ('' + query).trim().toLowerCase();

    var codeMatch = q.match(/\b\d{6}\b/);
    if (codeMatch) {
      var code = codeMatch[0];
      for (var i = 0; i < CARGO_ITEMS.length; i++) {
        if (CARGO_ITEMS[i].code_etsng === code) return CARGO_ITEMS[i];
      }
    }

    for (var i = 0; i < CARGO_ITEMS.length; i++) {
      if (CARGO_ITEMS[i].name.toLowerCase().indexOf(q) !== -1 ||
          q.indexOf(CARGO_ITEMS[i].name.toLowerCase()) !== -1) {
        return CARGO_ITEMS[i];
      }
    }

    var wagonMap = {
      'grain': '100199',
      'boxcar': '110100',
      'gondola': '270112',
      'tank': '271012',
      'platform': '720810',
      'cont40': '990100',
      'cont20': '990100'
    };
    if (wagonMap[q]) {
      var defCode = wagonMap[q];
      for (var i = 0; i < CARGO_ITEMS.length; i++) {
        if (CARGO_ITEMS[i].code_etsng === defCode) return CARGO_ITEMS[i];
      }
    }

    return CARGO_ITEMS[0];
  }

  function searchCargo(query, limit) {
    limit = limit || 12;
    if (!query || query.trim().length < 2) return [];
    var q = query.trim().toLowerCase();
    var results = [];

    for (var i = 0; i < CARGO_ITEMS.length; i++) {
      var item = CARGO_ITEMS[i];
      if (item.code_etsng.indexOf(q) === 0 || 
          item.code_gng.indexOf(q) === 0 || 
          item.name.toLowerCase().indexOf(q) !== -1 ||
          item.category.toLowerCase().indexOf(q) !== -1) {
        results.push(item);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  function getStationCoords(st) {
    if (!st || !st.name) return [48.0, 68.0];
    var norm = cleanStationName(st.name);
    for (var k in HUB_COORDS) {
      if (norm.indexOf(k) !== -1) return HUB_COORDS[k];
    }
    if (st.country === 'RUS') return [55.75, 37.61];
    if (st.country === 'UZB') return [41.31, 69.24];
    return [48.0, 68.0];
  }

  function calculateGeoRailwayDistance(c1, c2) {
    var R = 6371;
    var dLat = (c2[0] - c1[0]) * Math.PI / 180;
    var dLon = (c2[1] - c1[1]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(35, Math.round(R * c * 1.46));
  }

  function resolveLegDistance(fromSt, toSt) {
    var fClean = cleanStationName(fromSt.name);
    var tClean = cleanStationName(toSt.name);

    var k1 = fClean + '_' + tClean;
    var k2 = tClean + '_' + fClean;
    if (CANONICAL_DISTANCES[k1]) return CANONICAL_DISTANCES[k1];
    if (CANONICAL_DISTANCES[k2]) return CANONICAL_DISTANCES[k2];

    var c1 = getStationCoords(fromSt);
    var c2 = getStationCoords(toSt);
    return calculateGeoRailwayDistance(c1, c2);
  }

  function determineRouteLegs(fromSt, toSt, manualBorderCode, manualBorderCode2) {
    var legs = [];
    var border = null;
    var border1 = null;
    var border2 = null;
    var isTransit = false;
    var messageType = 'Внутригосударственное сообщение';

    var b1Code = manualBorderCode;
    var b2Code = manualBorderCode2;
    if (manualBorderCode && typeof manualBorderCode === 'object') {
      b1Code = manualBorderCode.border1 || manualBorderCode.code;
      b2Code = manualBorderCode.border2;
    } else if (manualBorderCode && ('' + manualBorderCode).indexOf('_') !== -1) {
      var parts = ('' + manualBorderCode).split('_');
      b1Code = parts[0];
      b2Code = parts[1];
    }

    if (fromSt.country === toSt.country) {
      messageType = 'Внутригосударственное (' + fromSt.country_name + ')';
      var dist = resolveLegDistance(fromSt, toSt);
      legs.push({
        country: fromSt.country,
        countryName: fromSt.country_name,
        road: fromSt.road_label,
        from: fromSt.name,
        to: toSt.name,
        distanceKm: dist,
        type: 'domestic'
      });
      return {
        isTransit: false,
        messageType: messageType,
        border: null,
        legs: legs
      };
    }

    // Проверка транзита через Казахстан: Россия ⇄ Узбекистан
    var isRusUzb = (fromSt.country === 'RUS' && toSt.country === 'UZB');
    var isUzbRus = (fromSt.country === 'UZB' && toSt.country === 'RUS');

    if (isRusUzb || isUzbRus) {
      isTransit = true;
      var availBorders1 = BORDER_CROSSINGS['RUS-KAZ'];
      var availBorders2 = BORDER_CROSSINGS['KAZ-UZB'];

      // If a border code was passed that belongs to KAZ-UZB (exit) and b2Code is not set, reassign it
      if (b1Code && availBorders2.some(function(b) { return b.code === b1Code || b.exitCode === b1Code; }) && !b2Code) {
        b2Code = b1Code;
        b1Code = null;
      }

      // Подбор Стыка 1 (РЖД ⇄ КТЖ)
      if (b1Code) {
        for (var i = 0; i < availBorders1.length; i++) {
          if (availBorders1[i].code === b1Code || availBorders1[i].exitCode === b1Code) {
            border1 = availBorders1[i];
            break;
          }
        }
      }
      if (!border1) {
        var fNorm = cleanStationName(fromSt.name);
        if (fNorm.indexOf('новосибирск') !== -1 || fNorm.indexOf('барнаул') !== -1 || fNorm.indexOf('красноярск') !== -1 || fNorm.indexOf('локоть') !== -1) {
          border1 = availBorders1.find(function(b) { return b.code === '711105'; }) || availBorders1[0];
        } else if (fNorm.indexOf('екатеринбург') !== -1 || fNorm.indexOf('челябинск') !== -1 || fNorm.indexOf('магнитогорск') !== -1 || fNorm.indexOf('карталы') !== -1) {
          border1 = availBorders1.find(function(b) { return b.code === '816909'; }) || availBorders1[0];
        } else if (fNorm.indexOf('омск') !== -1 || fNorm.indexOf('курган') !== -1 || fNorm.indexOf('петропавловск') !== -1) {
          border1 = availBorders1.find(function(b) { return b.code === '688708'; }) || availBorders1[0];
        } else if (fNorm.indexOf('саратов') !== -1 || fNorm.indexOf('самара') !== -1 || fNorm.indexOf('волгоград') !== -1 || fNorm.indexOf('озинки') !== -1) {
          border1 = availBorders1.find(function(b) { return b.code === '664900'; }) || availBorders1[0];
        } else {
          border1 = availBorders1[0]; // ст. Илецк I (666501)
        }
      }

      // Подбор Стыка 2 (КТЖ ⇄ УТИ)
      if (b2Code) {
        for (var j = 0; j < availBorders2.length; j++) {
          if (availBorders2[j].code === b2Code || availBorders2[j].exitCode === b2Code) {
            border2 = availBorders2[j];
            break;
          }
        }
      }
      if (!border2) {
        var tNorm = cleanStationName(toSt.name);
        if (tNorm.indexOf('нукус') !== -1 || tNorm.indexOf('ургенч') !== -1 || tNorm.indexOf('кунград') !== -1 || tNorm.indexOf('бейнеу') !== -1) {
          border2 = availBorders2.find(function(b) { return b.code === '662905'; }) || availBorders2[0];
        } else {
          border2 = availBorders2[0]; // ст. Сарыагаш / Келес (704101)
        }
      }

      var b1St = { name: border1.name.split('/')[0].trim(), country: 'RUS' };
      var b1KzSt = { name: border1.name.split('/')[0].trim(), country: 'KAZ' };
      var b2KzSt = { name: border2.name.split('/')[0].trim(), country: 'KAZ' };
      var b2UzSt = { name: (border2.name.split('/')[1] || border2.name).trim(), country: 'UZB' };

      if (isRusUzb) {
        messageType = 'Транзитное сообщение (Россия ➔ Казахстан [Транзит] ➔ Узбекистан)';
        var d1 = resolveLegDistance(fromSt, b1St);
        var d2 = resolveLegDistance(b1KzSt, b2KzSt);
        var d3 = resolveLegDistance(b2UzSt, toSt);

        legs.push({
          country: 'RUS',
          countryName: 'Россия',
          road: 'РЖД',
          from: fromSt.name,
          to: border1.name.split('/')[0].trim(),
          distanceKm: d1,
          type: 'export_departure'
        });

        legs.push({
          country: 'KAZ',
          countryName: 'Казахстан (Транзит)',
          road: 'КТЖ (Транзит)',
          from: border1.name.split('/')[0].trim(),
          to: border2.name.split('/')[0].trim(),
          distanceKm: d2,
          type: 'transit'
        });

        legs.push({
          country: 'UZB',
          countryName: 'Узбекистан',
          road: 'УТИ',
          from: (border2.name.split('/')[1] || border2.name).trim(),
          to: toSt.name,
          distanceKm: d3,
          type: 'import_destination'
        });
      } else {
        messageType = 'Транзитное сообщение (Узбекистан ➔ Казахстан [Транзит] ➔ Россия)';
        var d1 = resolveLegDistance(fromSt, b2UzSt);
        var d2 = resolveLegDistance(b2KzSt, b1KzSt);
        var d3 = resolveLegDistance(b1St, toSt);

        legs.push({
          country: 'UZB',
          countryName: 'Узбекистан',
          road: 'УТИ',
          from: fromSt.name,
          to: (border2.name.split('/')[1] || border2.name).trim(),
          distanceKm: d1,
          type: 'export_departure'
        });

        legs.push({
          country: 'KAZ',
          countryName: 'Казахстан (Транзит)',
          road: 'КТЖ (Транзит)',
          from: border2.name.split('/')[0].trim(),
          to: border1.name.split('/')[0].trim(),
          distanceKm: d2,
          type: 'transit'
        });

        legs.push({
          country: 'RUS',
          countryName: 'Россия',
          road: 'РЖД',
          from: border1.name.split('/')[0].trim(),
          to: toSt.name,
          distanceKm: d3,
          type: 'import_destination'
        });
      }

      return {
        isTransit: true,
        messageType: messageType,
        border1: border1,
        border2: border2,
        availBorders1: availBorders1,
        availBorders2: availBorders2,
        legs: legs
      };
    }

    // Двустороннее сообщение (например KAZ ⇄ UZB, RUS ⇄ KAZ)
    messageType = 'Международное (' + fromSt.country_name + ' ➔ ' + toSt.country_name + ')';
    var pairKey = fromSt.country + '-' + toSt.country;
    var reverseKey = toSt.country + '-' + fromSt.country;
    var availBorders = BORDER_CROSSINGS[pairKey] || BORDER_CROSSINGS[reverseKey] || BORDER_CROSSINGS['KAZ-UZB'];

    var targetCode = b1Code || b2Code;
    if (targetCode) {
      for (var b = 0; b < availBorders.length; b++) {
        if (availBorders[b].code === targetCode || availBorders[b].exitCode === targetCode) {
          border = availBorders[b];
          break;
        }
      }
    }
    if (!border) border = availBorders[0];

    var borderSt = { name: border.name.split('/')[0].trim(), country: fromSt.country };
    var borderDestSt = { name: (border.name.split('/')[1] || border.name).trim(), country: toSt.country };

    var dist1 = resolveLegDistance(fromSt, borderSt);
    var dist2 = resolveLegDistance(borderDestSt, toSt);

    legs.push({
      country: fromSt.country,
      countryName: fromSt.country_name,
      road: fromSt.road_label,
      from: fromSt.name,
      to: border.name.split('/')[0].trim(),
      distanceKm: dist1,
      type: 'export_departure'
    });

    legs.push({
      country: toSt.country,
      countryName: toSt.country_name,
      road: toSt.road_label,
      from: (border.name.split('/')[1] || border.name).trim(),
      to: toSt.name,
      distanceKm: dist2,
      type: 'import_destination'
    });

    return {
      isTransit: false,
      messageType: messageType,
      border: border,
      availBorders: availBorders,
      legs: legs
    };
  }

  function getBaseRateForKm(km) {
    for (var i = 0; i < TARIFF_BELTS.length; i++) {
      if (km <= TARIFF_BELTS[i].maxKm) {
        return TARIFF_BELTS[i].rateUSD;
      }
    }
    return 0.33;
  }

  // ГЛАВНЫЙ МЕТОД РАСЧЕТА ТАРИФОВ
  function calculateTariff(params) {
    var fromStation = findStation(params.from) || STATIONS[11]; // Кокшетау
    var toStation = findStation(params.to) || STATIONS[14];     // Ташкент-Товарный
    var wagonType = ROLLING_STOCK[params.wagonType] || ROLLING_STOCK['grain'];
    var cargoItem = findCargo(params.cargoSearch || params.cargoType);
    var parkType = params.parkType || 'caravan';
    var incoterms = (params.incoterms || 'DAP').toUpperCase();
    var hasSecurity = params.security === true || params.security === 'true' || cargoItem.security_required;
    var hasCustoms = params.customs === true || params.customs === 'true';
    var clientRole = params.clientRole || 'Грузоотправитель';
    var discountPercent = parseFloat(params.discount) || 0;
    var currency = params.currency || 'USD';

    // 1. Построение маршрута и расстояний
    var b1 = params.manualBorder1 || (params.manualBorderCode && typeof params.manualBorderCode === 'object' ? (params.manualBorderCode.border1 || params.manualBorderCode.code) : params.manualBorderCode);
    var b2 = params.manualBorder2 || (params.manualBorderCode && typeof params.manualBorderCode === 'object' ? params.manualBorderCode.border2 : null);
    var routePlan = determineRouteLegs(fromStation, toStation, b1, b2);
    var totalKm = 0;
    var detailedLegs = [];
    var totalInfraUSD = 0;
    var totalWagonUSD = 0;
    var totalBorderFeesUSD = 0;
    var totalSecurityUSD = 0;

    // Класс груза и тарифный коэффициент
    var cargoFactor = cargoItem.tariff_class === 1 ? 0.75 : (cargoItem.tariff_class === 3 ? 1.25 : 1.0);

    for (var l = 0; l < routePlan.legs.length; l++) {
      var leg = routePlan.legs[l];
      totalKm += leg.distanceKm;

      var baseBeltRate = getBaseRateForKm(leg.distanceKm);
      var countryFactor = (leg.country === 'UZB' ? 1.15 : (leg.country === 'RUS' ? 1.10 : (leg.type === 'transit' ? 1.20 : 1.0)));
      var legInfra = Math.round(leg.distanceKm * baseBeltRate * countryFactor * cargoFactor);

      var legDays = Math.ceil(leg.distanceKm / wagonType.speedKmPerDay) + 1;
      var legWagon = (parkType === 'caravan') ? Math.round(legDays * wagonType.dailyRateUSD * 1.35) : Math.round(legInfra * 0.45);

      var legBorderFee = 0;
      if (leg.type === 'export_departure') {
        var bObj = routePlan.border1 || routePlan.border;
        if (bObj) legBorderFee += bObj.fee || 65;
      } else if (leg.type === 'transit' && routePlan.border2) {
        legBorderFee += routePlan.border2.fee || 85;
      }

      var legSec = hasSecurity ? Math.round(leg.distanceKm * 0.08 + 45) : 0;
      var legTotal = legInfra + legWagon + legBorderFee + legSec;

      totalInfraUSD += legInfra;
      totalWagonUSD += legWagon;
      totalBorderFeesUSD += legBorderFee;
      totalSecurityUSD += legSec;

      detailedLegs.push({
        country: leg.country,
        countryName: leg.countryName,
        road: leg.road,
        from: leg.from,
        to: leg.to,
        distanceKm: leg.distanceKm,
        infraTariffUSD: legInfra,
        wagonTariffUSD: legWagon,
        borderFeeUSD: legBorderFee,
        securityUSD: legSec,
        subtotalUSD: legTotal
      });
    }

    // Incoterms надбавки
    var incotermsFeeUSD = 0;
    if (incoterms === 'DAP') incotermsFeeUSD = 325;
    else if (incoterms === 'CIP') incotermsFeeUSD = 180;
    else if (incoterms === 'DDP') incotermsFeeUSD = 550;
    else if (incoterms === 'CPT') incotermsFeeUSD = 90;
    else if (incoterms === 'FCA') incotermsFeeUSD = 40;

    if (hasCustoms) incotermsFeeUSD += 120;

    var grandTotalUSD = totalInfraUSD + totalWagonUSD + totalBorderFeesUSD + totalSecurityUSD + incotermsFeeUSD;

    if (discountPercent > 0) {
      grandTotalUSD = Math.round(grandTotalUSD * (1 - discountPercent / 100));
    }

    var transitDaysMin = Math.ceil(totalKm / wagonType.speedKmPerDay) + 1;
    var transitDaysMax = transitDaysMin + 2;
    var transitStr = transitDaysMin + '-' + transitDaysMax + ' суток';

    var curInfo = CURRENCY_RATES[currency] || CURRENCY_RATES['USD'];
    var convertedTotal = Math.round(grandTotalUSD * curInfo.rate);

    return {
      route: {
        from: fromStation,
        to: toStation,
        isTransit: routePlan.isTransit,
        borderCrossing: routePlan.border,
        border1: routePlan.border1,
        border2: routePlan.border2,
        availBorders: routePlan.availBorders,
        availBorders1: routePlan.availBorders1,
        availBorders2: routePlan.availBorders2,
        messageType: routePlan.messageType,
        totalDistanceKm: totalKm,
        legs: detailedLegs
      },
      wagon: wagonType,
      cargo: cargoItem,
      parkType: parkType === 'caravan' ? 'Собственный СПС Caravan Railroad' : 'Инвентарный парк ж/д',
      incoterms: incoterms,
      transitDays: transitStr,
      totals: {
        usd: grandTotalUSD,
        converted: convertedTotal,
        currencyCode: curInfo.code,
        currencySymbol: curInfo.symbol,
        formattedTotal: convertedTotal.toLocaleString('ru-RU') + ' ' + curInfo.symbol
      },
      breakdownUSD: {
        infrastructure: totalInfraUSD,
        wagonProvision: totalWagonUSD,
        borderAndHandling: totalBorderFeesUSD + incotermsFeeUSD,
        security: totalSecurityUSD
      }
    };
  }

  return {
    STATIONS: STATIONS,
    CARGO_ITEMS: CARGO_ITEMS,
    BORDER_CROSSINGS: BORDER_CROSSINGS,
    ROLLING_STOCK: ROLLING_STOCK,
    CURRENCY_RATES: CURRENCY_RATES,
    cleanStationName: cleanStationName,
    findStation: findStation,
    searchStations: searchStations,
    findCargo: findCargo,
    searchCargo: searchCargo,
    determineRouteLegs: determineRouteLegs,
    calculateTariff: calculateTariff
  };

})();

if (typeof window !== 'undefined') {
  window.CaravanRailwayEngine = CaravanRailwayEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CaravanRailwayEngine;
}
