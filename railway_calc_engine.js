/**
 * Caravan Railroad — Цифровое тарифное ядро "Caravan 1520" v3.8.3
 * Поучастковая тарификация по правилам Тарифного руководства № 4 (ТР-4 / План формирования)
 * Точный аддитивный километраж по межгосударственным и междорожным стыкам без эвристических коэффициентов.
 * 85 дорог пользования по 17 администрациям СНГ и Азии.
 */

var CaravanRailwayEngine = (function() {

  // 1. БАЗА СТАНЦИЙ СЕТИ 1520 ММ С ДОРОГАМИ ПОЛЬЗОВАНИЯ
  var STATIONS = [
  {
    "code": "035601",
    "name": "Автово (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "560330",
    "name": "Авчала (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "510308",
    "name": "Азов (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Ростов)",
    "is_border": true
  },
  {
    "code": "745402",
    "name": "Айни (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "000243",
    "name": "Акина (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "401401",
    "name": "Аккаржа (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "618404",
    "name": "Аксарайская II (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "679107",
    "name": "Аксу (обп) (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "663404",
    "name": "Актау-Порт (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "689409",
    "name": "Актау-Порт-Паром (эксп. на Туркменбаши I)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "877000",
    "name": "Акяйла (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Томск)",
    "is_border": true
  },
  {
    "code": "719802",
    "name": "Ала-Тоо (эксп.)",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": true
  },
  {
    "code": "538905",
    "name": "Алагир (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Мин. Воды)",
    "is_border": true
  },
  {
    "code": "649101",
    "name": "Алань (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Пенза)",
    "is_border": true
  },
  {
    "code": "814509",
    "name": "Алимбет (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "80",
    "road_label": "Южно-Уральская ж. д. (Оренбург/Карталы/Орск)",
    "is_border": true
  },
  {
    "code": "707701",
    "name": "Алтынколь (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "553002",
    "name": "Алят (эксп. на Курык)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "548803",
    "name": "Алят (эксп. на Туркменбаши I)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "736507",
    "name": "Амузанг (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "869802",
    "name": "Армянск (стык)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Кузбасс)",
    "is_border": true
  },
  {
    "code": "981701",
    "name": "Артем-Приморский I (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "752302",
    "name": "Артык (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "470906",
    "name": "Аршинцево (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "554503",
    "name": "Астара (эксп.)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "566002",
    "name": "Ахурян (эксп.)",
    "country": "ARM",
    "country_name": "Армения",
    "admin": "ЮКЖД",
    "road": "58",
    "road_label": "Южно-Кавказская ж. д. (ЮКЖД)",
    "is_border": true
  },
  {
    "code": "102308",
    "name": "Багратионовск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "291001",
    "name": "Бакарица (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Архангельск)",
    "is_border": true
  },
  {
    "code": "547406",
    "name": "Баку-Торговая Пристань (эксп.)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "104500",
    "name": "Балтийск (паром, эксп. в порты третьих стр.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "104074",
    "name": "Балтийск (паром, эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "103508",
    "name": "Балтийский Лес (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "557709",
    "name": "Бархударлы (эксп.)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "399502",
    "name": "Басарабяска (эксп. на Серпнево I)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "382605",
    "name": "Батево (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "579905",
    "name": "Батуми-Товарная (паром, эксп. на Варну)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "571405",
    "name": "Батуми-Товарная (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "662905",
    "name": "Бейнеу (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "726204",
    "name": "Бекабад (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "747501",
    "name": "Бекобод (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "403303",
    "name": "Белгород-Днестровский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "014501",
    "name": "Белое Море (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "202807",
    "name": "Белынковичи (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Тула)",
    "is_border": true
  },
  {
    "code": "478300",
    "name": "Бердянск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "400606",
    "name": "Береговая (эксп. на Порт Южный)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "386108",
    "name": "Берлебаш (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "558701",
    "name": "Беюк-Кясик (эксп.)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "842903",
    "name": "Бийск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Новосибирск)",
    "is_border": true
  },
  {
    "code": "649008",
    "name": "Биклянь (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Пенза)",
    "is_border": true
  },
  {
    "code": "954901",
    "name": "Благовещенск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "94",
    "road_label": "Забайкальская ж. д. (Могоча/Свободный)",
    "is_border": true
  },
  {
    "code": "986902",
    "name": "Блюхер (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "162440",
    "name": "Богданов-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "664703",
    "name": "Болашак (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "097400",
    "name": "Болдерая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "734709",
    "name": "Болдыр (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "577596",
    "name": "Боржоми (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "351700",
    "name": "Броды (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "134807",
    "name": "Брузги (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "126209",
    "name": "Бугяняй (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "419100",
    "name": "Вадим (эксп. условный)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "368701",
    "name": "Вадул-Сирет (эксп.ЧФР)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "561136",
    "name": "Вазиани (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "083501",
    "name": "Вайвара (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "099209",
    "name": "Вайнеде (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "004930",
    "name": "Вайниккала (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "086302",
    "name": "Валга (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "578207",
    "name": "Вале (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "009490",
    "name": "Вартиус (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "562923",
    "name": "Вели (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "098306",
    "name": "Вентспилс (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "146096",
    "name": "Верейцы-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "645702",
    "name": "Верхняя Терраса (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Пенза)",
    "is_border": true
  },
  {
    "code": "203706",
    "name": "Витемля (оп) (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Тула)",
    "is_border": true
  },
  {
    "code": "980200",
    "name": "Владивосток (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "538801",
    "name": "Владикавказ (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Мин. Воды)",
    "is_border": true
  },
  {
    "code": "611208",
    "name": "Волгоград-Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "611301",
    "name": "Волжский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "073904",
    "name": "Волосово (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "432804",
    "name": "Волчанск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "020108",
    "name": "Выборг (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "131809",
    "name": "Высоко-Литовск (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "020706",
    "name": "Высоцк (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "016507",
    "name": "Выходной (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "519406",
    "name": "Вышестеблиевская (мост, экспорт)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Ростов)",
    "is_border": true
  },
  {
    "code": "523100",
    "name": "Вышестеблиевская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "980501",
    "name": "Гайдамак (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "522004",
    "name": "Гайдук (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "501101",
    "name": "Галута (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "747107",
    "name": "Гаравути (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "160206",
    "name": "Годутишки (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "578620",
    "name": "Гоми (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "579036",
    "name": "Гори (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "138808",
    "name": "Горынь (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "139213",
    "name": "Горынь-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "855142",
    "name": "Граковка (эксп.) (стык)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Алтай/Локоть/Кулунда)",
    "is_border": true
  },
  {
    "code": "398603",
    "name": "Гречень (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "989309",
    "name": "Гродеково (эксп. КЖД)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "521105",
    "name": "Грушевая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "579801",
    "name": "Дедоплис-Цкаро (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "718405",
    "name": "Джалал-Абад (эксп.)",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": true
  },
  {
    "code": "704012",
    "name": "Джетысай (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "720509",
    "name": "Джилга (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "550108",
    "name": "Джульфа (эксп.)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "738004",
    "name": "Джумуртау (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "397704",
    "name": "Джурджулешть (эксп. УЗ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "398001",
    "name": "Джурджулешть-Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000373",
    "name": "Дзамын-Ууд (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "560523",
    "name": "Дзегви (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "968603",
    "name": "Дземги (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Хабаровск)",
    "is_border": true
  },
  {
    "code": "000011",
    "name": "Дзунбаян-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "708507",
    "name": "Достык (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "106101",
    "name": "Драугисте (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "938805",
    "name": "Душанбе II (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "TJK",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "384901",
    "name": "Дьяково (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "474703",
    "name": "Евпатория-Товарная (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "160816",
    "name": "Езерище-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "816504",
    "name": "Елимай (обп) (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "80",
    "road_label": "Южно-Уральская ж. д. (Оренбург/Карталы/Орск)",
    "is_border": true
  },
  {
    "code": "131300",
    "name": "Жабинка (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "637000",
    "name": "Жигулевское Море (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Самара)",
    "is_border": true
  },
  {
    "code": "152171",
    "name": "Житковичи-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "418101",
    "name": "Жовтневая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "759104",
    "name": "Жумуртов (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "159306",
    "name": "Журбин (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "945404",
    "name": "Забайкальск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "94",
    "road_label": "Забайкальская ж. д. (Чита/Забайкальск)",
    "is_border": true
  },
  {
    "code": "946905",
    "name": "Забайкальск (эксп.ДСВН)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "94",
    "road_label": "Забайкальская ж. д. (Чита/Забайкальск)",
    "is_border": true
  },
  {
    "code": "947109",
    "name": "Забайкальск (эксп.ЗЧ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "94",
    "road_label": "Забайкальская ж. д. (Чита/Забайкальск)",
    "is_border": true
  },
  {
    "code": "150405",
    "name": "Закопытье (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "150528",
    "name": "Закопытье-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "310037",
    "name": "Замын-Ууд (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Котлас)",
    "is_border": true
  },
  {
    "code": "037202",
    "name": "Заневский Пост (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "165805",
    "name": "Заольша (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "165627",
    "name": "Заольша-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "103300",
    "name": "Западный-Новый (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "460405",
    "name": "Запорожье-Пристань (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "094807",
    "name": "Земитаны (3 км Рига-Краста эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "615707",
    "name": "Зензели (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "827104",
    "name": "Зерновая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "80",
    "road_label": "Южно-Уральская ж. д. (Курган/Петропавловск)",
    "is_border": true
  },
  {
    "code": "095903",
    "name": "Зиемельблазма (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "682203",
    "name": "Золотая Сопка (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "076003",
    "name": "Ивангород-Нарвский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "504805",
    "name": "Изварино (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "404607",
    "name": "Измаил (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "352609",
    "name": "Изов (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "666501",
    "name": "Илецк I (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "097203",
    "name": "Ильгюциемс (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "402103",
    "name": "Ильичевск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "419208",
    "name": "Ильичевск-Паромная (прочий эксп. Турция)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "402705",
    "name": "Ильичевск-Паромная (прочий эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "402601",
    "name": "Ильичевск-Паромная (эксп. БДЖ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "402207",
    "name": "Ильичевск-Паромная (эксп. на Батуми)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "404005",
    "name": "Ильичевск-Паромная (эксп. на Поти)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "005030",
    "name": "Иматранкоски (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "110200",
    "name": "Индра (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "478403",
    "name": "Инкерман I (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "938504",
    "name": "Исфара (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "92",
    "road_label": "Восточно-Сибирская ж. д. (Улан-Удэ/БАМ)",
    "is_border": true
  },
  {
    "code": "528208",
    "name": "Кавказ (паром эксп. на Поти)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "528104",
    "name": "Кавказ (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "451805",
    "name": "Кайдакская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "100105",
    "name": "Калининград-Сортировочный (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "257208",
    "name": "Кама (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "24",
    "road_label": "Горьковская ж. д. (Н. Новгород)",
    "is_border": true
  },
  {
    "code": "623101",
    "name": "Камышин (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (Волгоград/Астрахань)",
    "is_border": true
  },
  {
    "code": "472407",
    "name": "Камышовая Бухта (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "039903",
    "name": "Капитолово (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "744005",
    "name": "Кара-Суу (эксп. на Савай)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "744202",
    "name": "Кара-Суу (эксп. на Султанабад)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "718208",
    "name": "Карасу-Узбекский (эксп. на Савай)",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": true
  },
  {
    "code": "080503",
    "name": "Кейла (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "720104",
    "name": "Келес (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "470702",
    "name": "Керчь-Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "479707",
    "name": "Керчь-Порт-Паром (эксп. на Поти)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "662002",
    "name": "Кигаш (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "513804",
    "name": "Кизитеринка (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Ростов)",
    "is_border": true
  },
  {
    "code": "317409",
    "name": "Кинешма (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Котлас)",
    "is_border": true
  },
  {
    "code": "678405",
    "name": "Киргильда (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "108107",
    "name": "Клайпеда (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "359505",
    "name": "Клевань (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "201908",
    "name": "Климов (эксп.) (удалена)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Тула)",
    "is_border": true
  },
  {
    "code": "383307",
    "name": "Ключарки (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "439502",
    "name": "Козачок (бп) (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "394803",
    "name": "Колбасна (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "746903",
    "name": "Колхозабад (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "018709",
    "name": "Комсомольск-Мурманский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "990202",
    "name": "Корсаков (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "280806",
    "name": "Котлас-Северный (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Вологда)",
    "is_border": true
  },
  {
    "code": "076207",
    "name": "Котлы (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "985505",
    "name": "Крабовая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "529003",
    "name": "Краснодар II (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "528903",
    "name": "Краснодар-Сортировочный (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "000282",
    "name": "Красное (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "147845",
    "name": "Красный берег-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "099001",
    "name": "Криеву сала (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "648804",
    "name": "Круглое Поле (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Пенза)",
    "is_border": true
  },
  {
    "code": "529304",
    "name": "Крымская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "560631",
    "name": "Ксани (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "424507",
    "name": "Ксениево (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "746000",
    "name": "Кудукли (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "401204",
    "name": "Кулиндорово (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "697509",
    "name": "Кулунда (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "748805",
    "name": "Куляб (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "033305",
    "name": "Купчинская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "746104",
    "name": "Курган-Тюбе (эксп.)",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": true
  },
  {
    "code": "844805",
    "name": "Куркамыс (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Новосибирск)",
    "is_border": true
  },
  {
    "code": "110304",
    "name": "Курцумс (рзд) (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "693602",
    "name": "Курык-Порт (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "693706",
    "name": "Курык-Порт эксп. перев.",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "574795",
    "name": "Кутаиси II (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "619303",
    "name": "Кутум (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "120202",
    "name": "Кяна (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "760807",
    "name": "Левшино (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "76",
    "road_label": "Свердловская ж. д. (Пермь)",
    "is_border": true
  },
  {
    "code": "134328",
    "name": "Лесная-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "391106",
    "name": "Ливада (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "098704",
    "name": "Лиепая-Пасажиеру (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "564007",
    "name": "Лило (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "711302",
    "name": "Локоть (эксп. на Малиновое Озеро)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "711105",
    "name": "Локоть (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "207209",
    "name": "Локоть (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "704402",
    "name": "Луговая (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "076404",
    "name": "Лужская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "165400",
    "name": "Лынтупы (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "352008",
    "name": "Любомль (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "081703",
    "name": "Маарду (эксп. через порт Мийдуранна)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "082208",
    "name": "Маарду (эксп. через порт Мууга)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "725305",
    "name": "Мактаарал (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "132106",
    "name": "Малорита (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "367408",
    "name": "Мамалыга (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "102806",
    "name": "Мамоново (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "744404",
    "name": "Манас (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "096605",
    "name": "Мангали (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "564098",
    "name": "Марнеули (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "986404",
    "name": "Махалино (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "661902",
    "name": "Махамбет (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "543405",
    "name": "Махачкала (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Махачкала)",
    "is_border": true
  },
  {
    "code": "543602",
    "name": "Махачкала (эксп.)(паром)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Махачкала)",
    "is_border": true
  },
  {
    "code": "091404",
    "name": "Мейтене (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "478507",
    "name": "Мекензиевы Горы (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "331800",
    "name": "Могилев-Подольский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "199905",
    "name": "Москва-Южный Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Москва)",
    "is_border": true
  },
  {
    "code": "373606",
    "name": "Мостиска II (эксп. ДБ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "373803",
    "name": "Мостиска II (эксп. ЧД)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "265204",
    "name": "Моховые Горы (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "24",
    "road_label": "Горьковская ж. д. (Киров)",
    "is_border": true
  },
  {
    "code": "123003",
    "name": "Моцкава (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "380807",
    "name": "Мукачево (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "081900",
    "name": "Мууга (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "089207",
    "name": "Мыйзакюла (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "985702",
    "name": "Мыс Астафьева (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "980906",
    "name": "Мыс-Чуркин (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "758607",
    "name": "Найманкул (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "937200",
    "name": "Наушки (эксп. ДСВН)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "92",
    "road_label": "Восточно-Сибирская ж. д. (Улан-Удэ/БАМ)",
    "is_border": true
  },
  {
    "code": "937304",
    "name": "Наушки (эксп. КЖД)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "92",
    "road_label": "Восточно-Сибирская ж. д. (Улан-Удэ/БАМ)",
    "is_border": true
  },
  {
    "code": "984700",
    "name": "Находка (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "984803",
    "name": "Находка (эксп.-уголь)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "986103",
    "name": "Находка-Восточная (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "144014",
    "name": "Негорелое-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "000003",
    "name": "Нерюнгри-Грузовая-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000004",
    "name": "Нерюнгри-Пассажирская-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "100406",
    "name": "Нестеров (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "257903",
    "name": "Нефтекамск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "24",
    "road_label": "Горьковская ж. д. (Н. Новгород)",
    "is_border": true
  },
  {
    "code": "450906",
    "name": "Нижнеднепровск-Пристань (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "004450",
    "name": "Нийрала (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "669209",
    "name": "Никельтау (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "415601",
    "name": "Николаев-Грузовой (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "734408",
    "name": "Нишан (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "759301",
    "name": "Нишон (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "346702",
    "name": "Новоград-Волынский I (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "499407",
    "name": "Новозолотаревка (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "521001",
    "name": "Новороссийск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "392306",
    "name": "Новосавицкая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "035902",
    "name": "Новый Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "000006",
    "name": "ОП 378 км (стык)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000934",
    "name": "ОП Берлебаш (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "024611",
    "name": "ОП Погранкондуши",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "736808",
    "name": "Оазис (рзд) (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "402902",
    "name": "Одесса-Западная (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "404109",
    "name": "Одесса-Застава I (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "419800",
    "name": "Одесса-Лиски (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "400700",
    "name": "Одесса-Пересыпь (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "400409",
    "name": "Одесса-Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "410805",
    "name": "Одесса-Товарная (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "664900",
    "name": "Озинки (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "506000",
    "name": "Океанская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "638709",
    "name": "Октябрьск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Самара)",
    "is_border": true
  },
  {
    "code": "507409",
    "name": "Ольховая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "075806",
    "name": "Ораниенбаум (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "166757",
    "name": "Орша-Восточная-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "166719",
    "name": "Орша-Западная-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "169100",
    "name": "Осиновка (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "341107",
    "name": "Острог (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "636506",
    "name": "Отвага (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Самара)",
    "is_border": true
  },
  {
    "code": "719709",
    "name": "Ош (эксп.)",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": true
  },
  {
    "code": "135000",
    "name": "ПОРЕЧЬЕ-ЭКСПОРТ",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "080908",
    "name": "Палдиски (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "038600",
    "name": "Парнас (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "419706",
    "name": "Паромная (прочий эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000692",
    "name": "Паромная (эксп. Болгария)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "579708",
    "name": "Паромная (эксп. на Батуми)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "572304",
    "name": "Паромная (эксп. на Поти)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "702905",
    "name": "Пахтаарал (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "761301",
    "name": "Пермь II (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "76",
    "road_label": "Свердловская ж. д. (Пермь)",
    "is_border": true
  },
  {
    "code": "688708",
    "name": "Петропавловск (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "100209",
    "name": "Пионерский Курорт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "758008",
    "name": "Питнак (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "738803",
    "name": "Питняк (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "971004",
    "name": "Покровка-Пристань (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Владивосток/Находка)",
    "is_border": true
  },
  {
    "code": "625709",
    "name": "Покровск-Приволжский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (Волгоград/Астрахань)",
    "is_border": true
  },
  {
    "code": "577806",
    "name": "Поничала (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "135509",
    "name": "Поречье (эксп. на Друскининкай)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "614507",
    "name": "Порт Оля (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "461205",
    "name": "Порт-Великое Запорожье (эксп.)",
    "country": "UKR",
    "country_name": "Украина",
    "admin": "УЗ",
    "road": "46",
    "road_label": "Приднепровская ж. д. (УЗ)",
    "is_border": true
  },
  {
    "code": "718903",
    "name": "Пост 38 км (эксп.)",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": true
  },
  {
    "code": "987801",
    "name": "Посьет (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "572003",
    "name": "Поти (паром, эксп. на Варну)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "572200",
    "name": "Поти (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "956201",
    "name": "Поярково (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "94",
    "road_label": "Забайкальская ж. д. (Могоча/Свободный)",
    "is_border": true
  },
  {
    "code": "619604",
    "name": "Правый Берег (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "036200",
    "name": "Предпортовая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "685803",
    "name": "Пресногорьковская (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "418309",
    "name": "Прибугская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "529200",
    "name": "Протока (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "397009",
    "name": "Прут II (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "078109",
    "name": "Пурвмала (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "433609",
    "name": "Пушкарное (рзд) (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "153901",
    "name": "Пхов (эксп. через Мозырьский порт)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "456828",
    "name": "Пятихатки-Стыковая",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "084871",
    "name": "Рава-Русская (эксп. на Верхрату)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "372707",
    "name": "Рава-Русская (эксп. на Гребенне)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "372603",
    "name": "Рава-Русская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "415902",
    "name": "Раздельная I (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "471001",
    "name": "Разъезд 11 км (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "082706",
    "name": "Раквере (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "403407",
    "name": "Рени (эксп. ЧФР)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "404908",
    "name": "Рени-Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "099707",
    "name": "Реньге (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "391303",
    "name": "Рзд 208 км (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "090609",
    "name": "Рига-Краста (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "155930",
    "name": "Рогачев-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "562707",
    "name": "Рустави-Грузовая (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "717807",
    "name": "Рыбачье (эксп.)",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": true
  },
  {
    "code": "985100",
    "name": "Рыбники (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "564204",
    "name": "Садахло (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "033907",
    "name": "Санкт-Петербург-Варшавский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "038402",
    "name": "Санкт-Петербург-Финляндский (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "629004",
    "name": "Саратов-Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (Волгоград/Астрахань)",
    "is_border": true
  },
  {
    "code": "756905",
    "name": "Сарахс (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "095602",
    "name": "Саркандаугава (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "704101",
    "name": "Сарыагаш (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "736206",
    "name": "Сарыасия (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "135706",
    "name": "Свислочь (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "473402",
    "name": "Севастополь-Товарный (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "571833",
    "name": "Сенаки (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "475300",
    "name": "Сиваш (эксп. условный)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "106900",
    "name": "Скуодас (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "151200",
    "name": "Словечно (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "151145",
    "name": "Словечно-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "148706",
    "name": "Слуцк-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "983904",
    "name": "Смоляниново (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "649309",
    "name": "Соболеково (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Пенза)",
    "is_border": true
  },
  {
    "code": "105005",
    "name": "Советск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "968500",
    "name": "Советская Гавань-Город (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Хабаровск)",
    "is_border": true
  },
  {
    "code": "968105",
    "name": "Советская Гавань-Сорт. (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Хабаровск)",
    "is_border": true
  },
  {
    "code": "368102",
    "name": "Сокиряны (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "855903",
    "name": "Соленое Озеро (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Алтай/Локоть/Кулунда)",
    "is_border": true
  },
  {
    "code": "441201",
    "name": "Соловей (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "209501",
    "name": "Соловьевск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Тула)",
    "is_border": true
  },
  {
    "code": "291904",
    "name": "Соломбалка (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Архангельск)",
    "is_border": true
  },
  {
    "code": "374100",
    "name": "Старжава (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "121101",
    "name": "Стасилос (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "383909",
    "name": "Страбичево (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "204408",
    "name": "Суземка (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Тула)",
    "is_border": true
  },
  {
    "code": "202421",
    "name": "Сураж (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Тула)",
    "is_border": true
  },
  {
    "code": "000689",
    "name": "Сухэ-Батор (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "511601",
    "name": "Таганрог (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Ростов)",
    "is_border": true
  },
  {
    "code": "081506",
    "name": "Таллинн (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "088609",
    "name": "Тамсалу (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "560063",
    "name": "Тбилиси-Сортировочная (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "577702",
    "name": "Тбилиси-Товарная (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "560097",
    "name": "Тбилиси-Узловая (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "562514",
    "name": "Телави (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "385105",
    "name": "Тересва (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "150805",
    "name": "Тереховка (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "150782",
    "name": "Тереховка-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "735203",
    "name": "Термез (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "151003",
    "name": "Терюха (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "150354",
    "name": "Терюха-стык",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "207001",
    "name": "Теткино (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "17",
    "road_label": "Московская ж. д. (Тула)",
    "is_border": true
  },
  {
    "code": "563926",
    "name": "Тетри-Цкаро (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "529107",
    "name": "Тимашевская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "984108",
    "name": "Тихоокеанская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "520206",
    "name": "Тихорецкая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Краснодар)",
    "is_border": true
  },
  {
    "code": "682608",
    "name": "Тобол (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "637405",
    "name": "Тольятти (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Самара)",
    "is_border": true
  },
  {
    "code": "431801",
    "name": "Тополи (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000245",
    "name": "Торгунди (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "006780",
    "name": "Торнио (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "619407",
    "name": "Трусово (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "61",
    "road_label": "Приволжская ж. д. (РЖД)",
    "is_border": true
  },
  {
    "code": "533102",
    "name": "Туапсе-Сортировочная (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Мин. Воды)",
    "is_border": true
  },
  {
    "code": "877508",
    "name": "Туркменбаши I (эксп., перев.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Томск)",
    "is_border": true
  },
  {
    "code": "877103",
    "name": "Туркменбаши II (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Томск)",
    "is_border": true
  },
  {
    "code": "715106",
    "name": "Турксиб (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "000360",
    "name": "Турку-Пансио (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "982300",
    "name": "Угловая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "381104",
    "name": "Ужгород (эксп. ЖСР)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "392202",
    "name": "Унгень (эксп. БДЖ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "392109",
    "name": "Унгень (эксп. ЧФР)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "401806",
    "name": "Усатово (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "445121",
    "name": "Успенская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "988607",
    "name": "Уссурийск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "513908",
    "name": "Усть-Донецкая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Ростов)",
    "is_border": true
  },
  {
    "code": "741416",
    "name": "Учкурган (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "970603",
    "name": "Хабаровск I (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Владивосток/Находка)",
    "is_border": true
  },
  {
    "code": "000251",
    "name": "Хайратан (эксп.)",
    "country": "AFG",
    "country_name": "Афганистан",
    "admin": "AFG",
    "road": "135",
    "road_label": "Афганская ж. д. (АРА)",
    "is_border": true
  },
  {
    "code": "002311",
    "name": "Хамина (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000361",
    "name": "Ханко (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "987106",
    "name": "Хасан (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "577100",
    "name": "Хашури (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "002314",
    "name": "Хельсинки-Вуосаари (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000136",
    "name": "Хельсинки-Лансисатама (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "000138",
    "name": "Хельсинки-Сорнаинен (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "418604",
    "name": "Херсон (эксп. морской)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "418506",
    "name": "Херсон (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "418008",
    "name": "Херсон-Порт (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "403002",
    "name": "Химическая (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "984907",
    "name": "Хмыловский (рзд) (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "96",
    "road_label": "Дальневосточная ж. д. (Комсомольск/Сахалин)",
    "is_border": true
  },
  {
    "code": "730801",
    "name": "Ходжадавлет (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "993501",
    "name": "Холмск (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "354107",
    "name": "Хотислав (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "750307",
    "name": "Хужадавлат (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "000012",
    "name": "Цогтцэций-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "571299",
    "name": "Чаква (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "577401",
    "name": "Чаладиди (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "698305",
    "name": "Ченгельды (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "166628",
    "name": "Червено-стык",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Сосногорск)",
    "is_border": true
  },
  {
    "code": "401308",
    "name": "Черноморская (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "424600",
    "name": "Черноморская (эксп.для ОПЗ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "101004",
    "name": "Чернышевское (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "10",
    "road_label": "Калининградская ж. д.",
    "is_border": true
  },
  {
    "code": "399201",
    "name": "Чимишлия (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "380205",
    "name": "Чоп (эксп. МАВ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "380506",
    "name": "Чоп (эксп. ОББ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "380600",
    "name": "Чоп (эксп. ЧД)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "415404",
    "name": "Шабо (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "738201",
    "name": "Шават (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "710600",
    "name": "Шагыр (эксп.)",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": true
  },
  {
    "code": "741505",
    "name": "Шамалды-Сай (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
  },
  {
    "code": "719304",
    "name": "Шамалдысай (эксп.)",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": true
  },
  {
    "code": "550409",
    "name": "Шарур (эксп.)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "158604",
    "name": "Шестеровка (эксп.)",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": true
  },
  {
    "code": "579337",
    "name": "Шиндиси (эксп.)",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": true
  },
  {
    "code": "758205",
    "name": "Шовот (эксп.)",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": true
  },
  {
    "code": "032904",
    "name": "Шушары (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "01",
    "road_label": "Октябрьская ж. д.",
    "is_border": true
  },
  {
    "code": "123501",
    "name": "Шяштокай (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "113707",
    "name": "Эглайне (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "11",
    "road_label": "Литовские ж. д.",
    "is_border": true
  },
  {
    "code": "001287",
    "name": "Эрээнцав (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "351403",
    "name": "Ягодин (эксп. ДБ)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": true
  },
  {
    "code": "554609",
    "name": "Ялама (эксп.)",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": true
  },
  {
    "code": "541109",
    "name": "Яндыки (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Махачкала)",
    "is_border": true
  },
  {
    "code": "310404",
    "name": "Ярославль-Пристань (эксп.)",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "28",
    "road_label": "Северная ж. д. (Котлас)",
    "is_border": true
  },
  {
    "code": "667909",
    "name": "Актобе",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "548502",
    "name": "Алят",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": false
  },
  {
    "code": "722608",
    "name": "Ангрен",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "690002",
    "name": "Астана",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "661705",
    "name": "Атырау",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "138507",
    "name": "Барановичи-Центральные",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": false
  },
  {
    "code": "558631",
    "name": "Беюк-Кясик",
    "country": "AZE",
    "country_name": "Азербайджан",
    "admin": "АДЮ",
    "road": "55",
    "road_label": "Азербайджанские ж. д. (АДЮ)",
    "is_border": false
  },
  {
    "code": "130007",
    "name": "Брест-Центральный",
    "country": "BLR",
    "country_name": "Беларусь",
    "admin": "БЧ",
    "road": "13",
    "road_label": "Белорусская ж. д. (БЧ)",
    "is_border": false
  },
  {
    "code": "718301",
    "name": "Джалал-Абад",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": false
  },
  {
    "code": "726903",
    "name": "Джизак",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "780302",
    "name": "Екатеринбург-Товарный",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "76",
    "road_label": "Свердловская ж. д. (Н. Тагил)",
    "is_border": false
  },
  {
    "code": "663607",
    "name": "Ералиево",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "КТЖ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "930108",
    "name": "Иркутск-Пассажирский",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "92",
    "road_label": "Восточно-Сибирская ж. д. (Улан-Удэ/БАМ)",
    "is_border": false
  },
  {
    "code": "250302",
    "name": "Казань",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "24",
    "road_label": "Горьковская ж. д. (Н. Новгород)",
    "is_border": false
  },
  {
    "code": "673905",
    "name": "Караганда",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "733104",
    "name": "Карши",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "687008",
    "name": "Кокшетау I",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "684001",
    "name": "Костанай",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "746405",
    "name": "Курган-Тюбе",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "ТДЖ",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": false
  },
  {
    "code": "671707",
    "name": "Кызылорда",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "663306",
    "name": "Мангышлак",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "751309",
    "name": "Мары",
    "country": "TKM",
    "country_name": "Туркменистан",
    "admin": "ТРК",
    "road": "75",
    "road_label": "Туркменская ж. д. (ТРК)",
    "is_border": false
  },
  {
    "code": "193504",
    "name": "Москва-Товарная-Павелецкая",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "17",
    "road_label": "Московская ж. д. (Москва)",
    "is_border": false
  },
  {
    "code": "193523",
    "name": "Москва-Товарная-Павелецкая",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "17",
    "road_label": "Московская ж. д. (Москва)",
    "is_border": false
  },
  {
    "code": "731306",
    "name": "Навои",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "850609",
    "name": "Новосибирск-Главный",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Алтай/Локоть/Кулунда)",
    "is_border": false
  },
  {
    "code": "739007",
    "name": "Нукус",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "830709",
    "name": "Омск-Пассажирский",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "83",
    "road_label": "Западно-Сибирская ж. д. (Омск)",
    "is_border": false
  },
  {
    "code": "719605",
    "name": "Ош",
    "country": "KGZ",
    "country_name": "Кыргызстан",
    "admin": "КРГ",
    "road": "70",
    "road_label": "Кыргызская ж. д. (КРГ)",
    "is_border": false
  },
  {
    "code": "696102",
    "name": "Павлодар",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "572107",
    "name": "Поти",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": false
  },
  {
    "code": "510100",
    "name": "Ростов-Товарный",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "51",
    "road_label": "Северо-Кавказская ж. д. (Ростов)",
    "is_border": false
  },
  {
    "code": "657907",
    "name": "Самара",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "63",
    "road_label": "Куйбышевская ж. д. (Уфа/Ульяновск)",
    "is_border": false
  },
  {
    "code": "727809",
    "name": "Самарканд",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "709406",
    "name": "Семей",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "723507",
    "name": "Сергели",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "706304",
    "name": "Тараз",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "722400",
    "name": "Ташкент-Товарный",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "560203",
    "name": "Тбилиси-Товарная",
    "country": "GEO",
    "country_name": "Грузия",
    "admin": "ГРЗ",
    "road": "57",
    "road_label": "Грузинская ж. д. (ГРЗ)",
    "is_border": false
  },
  {
    "code": "735109",
    "name": "Термез",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "000848",
    "name": "Улан-Батор",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "РЖД",
    "road": "РЖД",
    "road_label": "РЖД",
    "is_border": false
  },
  {
    "code": "738305",
    "name": "Ургенч",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "713702",
    "name": "Усть-Каменогорск",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
  },
  {
    "code": "747802",
    "name": "Худжанд",
    "country": "TJK",
    "country_name": "Таджикистан",
    "admin": "TJK",
    "road": "74",
    "road_label": "Таджикская ж. д. (ТДЖ)",
    "is_border": false
  },
  {
    "code": "800008",
    "name": "Челябинск-Главный",
    "country": "RUS",
    "country_name": "Россия",
    "admin": "RUS",
    "road": "80",
    "road_label": "Южно-Уральская ж. д. (Челябинск)",
    "is_border": false
  },
  {
    "code": "720000",
    "name": "Чукурсай",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "UZB",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "698606",
    "name": "Шымкент",
    "country": "KAZ",
    "country_name": "Казахстан",
    "admin": "KAZ",
    "road": "67",
    "road_label": "Казахстанская ж. д. (КТЖ)",
    "is_border": false
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
    "code": "710507",
    "name": "Астана-Пассажирская",
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
    "code": "687103",
    "name": "Кокшетау II",
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
    "code": "713906",
    "name": "Усть-Каменогорск (перев.)",
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
    "code": "769708",
    "name": "Заполье-Уральское",
    "country": "RUS",
    "road": "Sverd",
    "is_border": false,
    "road_label": "РЖД (Сверд)",
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
    "road": "61",
    "is_border": false,
    "road_label": "Приволжская ж. д. (РЖД)",
    "country_name": "Россия",
    "admin": "РЖД"
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
    "code": "741100",
    "name": "Наманган",
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
    "code": "736704",
    "name": "Термез-Порт",
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
    "code": "565103",
    "name": "Ереван",
    "country": "ARM",
    "country_name": "Армения",
    "admin": "ЮКЖД",
    "road": "58",
    "road_label": "Южно-Кавказская ж. д. (ЮКЖД)",
    "is_border": false
  },
  {
    "code": "566708",
    "name": "Гюмри",
    "country": "ARM",
    "country_name": "Армения",
    "admin": "ЮКЖД",
    "road": "58",
    "road_label": "Южно-Кавказская ж. д. (ЮКЖД)",
    "is_border": false
  },
  {
    "code": "723511",
    "name": "Тукимачи",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": false
  },
  {
    "code": "735805",
    "name": "Галаба (эксп.)",
    "country": "UZB",
    "country_name": "Узбекистан",
    "admin": "УТИ",
    "road": "73",
    "road_label": "Узбекская ж. д. (УТИ)",
    "is_border": true
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

  // 3. МЕЖГОСУДАРСТВЕННЫЕ ПОГРАНИЧНЫЕ СТЫКИ (МГСП)
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
      { code: '735805', name: 'ст. Галаба (эксп.) [УТИ] / ст. Хайратан [АРА]', exitCode: '735805', enterCode: '000251', fee: 140, days: 1, primary: true }
    ],
    'UZB-TKM': [
      { code: '736501', name: 'ст. Ходжадавлет (эксп.) [УТИ] / ст. Фарап [ТРК]', exitCode: '736501', enterCode: '753009', fee: 90, days: 1, primary: true }
    ],
    'UZB-TJK': [
      { code: '736003', name: 'ст. Кудукли (эксп.) [УТИ] / ст. Пахтаабад [ТДЖ]', exitCode: '736003', enterCode: '745100', fee: 85, days: 1, primary: true },
      { code: '745609', name: 'ст. Бекабад (эксп.) [УТИ] / ст. Спитамен [ТДЖ]', exitCode: '745609', enterCode: '745007', fee: 85, days: 1 }
    ],
    'KAZ-KGZ': [
      { code: '704402', name: 'ст. Луговая (эксп.) [КТЖ] / ст. Чалдовар [КРГ]', exitCode: '704402', enterCode: '715106', fee: 75, days: 1, primary: true }
    ],
    'RUS-BLR': [
      { code: '206200', name: 'ст. Красное (эксп.) [РЖД] / ст. Осиновка [БЧ]', exitCode: '206200', enterCode: '141001', fee: 70, days: 1, primary: true }
    ],
    'RUS-AZE': [
      { code: '544200', name: 'ст. Самур (эксп.) [РЖД] / ст. Ялама (эксп.) [АДЮ]', exitCode: '544200', enterCode: '558608', fee: 85, days: 1, primary: true }
    ],
    'AZE-GEO': [
      { code: '558701', name: 'ст. Беюк-Кясик (эксп.) [АДЮ] / ст. Гардабани (эксп.) [ГРЗ]', exitCode: '558701', enterCode: '560608', fee: 80, days: 1, primary: true }
    ],
    'GEO-ARM': [
      { code: '561403', name: 'ст. Садахло (эксп.) [ГРЗ] / ст. Айрум (эксп.) [ЮКЖД]', exitCode: '561403', enterCode: '566002', fee: 75, days: 1, primary: true }
    ],
    'KAZ-TKM': [
      { code: '663606', name: 'ст. Болашак (эксп.) [КТЖ] / ст. Серхетяка [ТРК]', exitCode: '663606', enterCode: '750000', fee: 95, days: 1, primary: true }
    ]
  };

  // 4. ТАБЛИЦА ТОЧНЫХ РАССТОЯНИЙ (КМ) ПО ТАРИФНОМУ РУКОВОДСТВУ № 4 (Р-ТАРИФ)
  var CANONICAL_DISTANCES = {
    // Ташкентский железнодорожный узел (внутриузловые перемещения)
    "чукурсай_тукимачи": 14,
    "тукимачи_чукурсай": 14,
    "ташкент_тукимачи": 6,
    "тукимачи_ташкент": 6,
    "тукимачи_сергели": 5,
    "сергели_тукимачи": 5,
    "чукурсай_сергели": 19,
    "сергели_чукурсай": 19,
    "чукурсай_ташкент": 8,
    "ташкент_чукурсай": 8,
    "сарыагаш_тукимачи": 34,
    "тукимачи_сарыагаш": 34,
    "келес_тукимачи": 34,
    "тукимачи_келес": 34,

    // Афганистан: через Сарыагаш / Келес / Галабу
    "сарыагаш_хайратан": 759,
    "хайратан_сарыагаш": 759,
    "келес_хайратан": 759,
    "хайратан_келес": 759,
    "сарыагаш_галаба": 755,
    "галаба_сарыагаш": 755,
    "келес_галаба": 755,
    "галаба_келес": 755,
    "галаба_хайратан": 4,
    "хайратан_галаба": 4,
    "термез_хайратан": 49,
    "хайратан_термез": 49,
    "костанай_хайратан": 2894,
    "хайратан_костанай": 2894,

    // Кавказ (Грузия / Азербайджан)
    "тбилиси_гардабани": 65,
    "гардабани_тбилиси": 65,
    "поти_гардабани": 377,
    "гардабани_поти": 377,
    "батуми_гардабани": 415,
    "гардабани_батуми": 415,
    "гардабани_беюккясик": 15,
    "беюккясик_гардабани": 15,
    "беюккясик_баку": 506,
    "баку_беюккясик": 506,
    "беюккясик_ялама": 724,
    "ялама_беюккясик": 724,
    "ялама_самур": 12,
    "самур_ялама": 12,
    "самур_аксарайская": 680,
    "аксарайская_самур": 680,
    "самур_москва": 2150,
    "москва_самур": 2150,
    "самур_владивосток": 9400,
    "владивосток_самур": 9400,
    "тбилиси_сергели": 2849,
    "сергели_тбилиси": 2849,
    "поти_владивосток": 10501,
    "владивосток_поти": 10501,

    // КТЖ: Отправление ➔ Сарыагаш (стык с Узбекистаном)
    "семей_сарыагаш": 1949,
    "жанасемей_сарыагаш": 1949,
    "семей_чукурсай": 1974,
    "жанасемей_чукурсай": 1974,
    "кокшетау_сарыагаш": 1777,
    "астана_сарыагаш": 1481,
    "караганда_сарыагаш": 1262,
    "павлодар_сарыагаш": 1930,
    "костанай_сарыагаш": 2135,
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
    "бейнеу_сарыагаш": 2240,

    // КТЖ: Транзитные коридоры (Вход из РФ ➔ Сарыагаш)
    "илецк_сарыагаш": 2080,
    "озинки_сарыагаш": 2150,
    "карталы_сарыагаш": 1945,
    "орск_сарыагаш": 1980,
    "локоть_сарыагаш": 1820,
    "кулунда_сарыагаш": 1910,
    "петропавловск_сарыагаш": 2040,

    // КТЖ: Транзитные коридоры (Вход из РФ ➔ Бейнеу)
    "озинки_бейнеу": 1480,
    "илецк_бейнеу": 1930,
    "карталы_бейнеу": 1890,
    "орск_бейнеу": 1680,
    "бейнеу_каракалпакстан": 410,

    // УТИ: Вход Сарыагаш / Келес ➔ Станции назначения Узбекистана
    "сарыагаш_чукурсай": 25,
    "келес_чукурсай": 25,
    "сарыагаш_ташкент": 28,
    "келес_ташкент": 28,
    "сарыагаш_сергели": 38,
    "келес_сергели": 38,
    "сарыагаш_самарканд": 350,
    "келес_самарканд": 350,
    "сарыагаш_бухара": 610,
    "келес_бухара": 610,
    "сарыагаш_навои": 510,
    "келес_навои": 510,
    "сарыагаш_карши": 490,
    "келес_карши": 490,
    "сарыагаш_термез": 710,
    "келес_термез": 710,
    "сарыагаш_галаба": 755,
    "келес_галаба": 755,
    "сарыагаш_андижан": 395,
    "келес_андижан": 395,
    "сарыагаш_фергана": 410,
    "келес_фергана": 410,
    "сарыагаш_коканд": 275,
    "келес_коканд": 275,

    // РФ: Москва ➔ Стыки с Казахстаном
    "москва_илецк": 1480,
    "илецк_москва": 1480,
    "москва_озинки": 1320,
    "озинки_москва": 1320,
    "москва_локоть": 3811,
    "локоть_москва": 3811,
    "москва_карталы": 1940,
    "карталы_москва": 1940,
    "москва_кулунда": 3390,
    "кулунда_москва": 3390,
    "москва_петропавловск": 2340,
    "петропавловск_москва": 2340,
    "петербург_илецк": 2130,
    "илецк_петербург": 2130,
    "петербург_озинки": 1970,
    "озинки_петербург": 1970,
    "петербург_локоть": 4461,
    "локоть_петербург": 4461
  };


  // 6. СЕТКА ТАРИФНЫХ ПОЯСОВ (USD ЗА КМ)
  var TARIFF_BELTS = [
    { maxKm: 200,   rateUSD: 0.62 },
    { maxKm: 500,   rateUSD: 0.48 },
    { maxKm: 1000,  rateUSD: 0.40 },
    { maxKm: 2000,  rateUSD: 0.33 },
    { maxKm: 3500,  rateUSD: 0.28 },
    { maxKm: 5000,  rateUSD: 0.24 },
    { maxKm: 15000, rateUSD: 0.20 }
  ];

  // 7. СТАВКИ ПАРКА И СКОРОСТИ КУРСИРОВАНИЯ
  var ROLLING_STOCK = {
    'grain':    { name: 'Хоппер-зерновоз (116-120 м³, 70 т)', dailyRateUSD: 36, speedKmPerDay: 480 },
    'boxcar':   { name: 'Крытый вагон (138-161 м³, 68 т)', dailyRateUSD: 32, speedKmPerDay: 450 },
    'covered':  { name: 'Крытый вагон (138-161 м³, 68 т)', dailyRateUSD: 32, speedKmPerDay: 450 },
    'gondola':  { name: 'Полувагон (70 тн)', dailyRateUSD: 28, speedKmPerDay: 500 },
    'tank':     { name: 'Цистерна (66 тн)', dailyRateUSD: 40, speedKmPerDay: 420 },
    'platform': { name: 'Фитинговая платформа', dailyRateUSD: 26, speedKmPerDay: 550 },
    'cont40':   { name: 'Контейнер 40ft HC (28 тн)', dailyRateUSD: 22, speedKmPerDay: 520 },
    'cont20':   { name: 'Контейнер 20ft (24 тн)', dailyRateUSD: 16, speedKmPerDay: 520 }
  };

  // 8. КУРСЫ ВАЛЮТ РАСЧЕТА
  var CURRENCY_RATES = {
    'USD': { code: 'USD', symbol: '$', rate: 1.0 },
    'KZT': { code: 'KZT', symbol: '₸', rate: 502.0 },
    'UZS': { code: 'UZS', symbol: 'сум', rate: 12850.0 },
    'RUB': { code: 'RUB', symbol: '₽', rate: 96.5 }
  };

  // МАТРИЦА СВЯЗНОСТИ ЖЕЛЕЗНОДОРОЖНЫХ УЗЛОВ (ГРАФ ДЕЙКСТРЫ)
  var RAILWAY_GRAPH = {
    "москва": { "петербург": 650, "самара": 1043, "саратов": 856, "нижнийновгород": 442, "илецк": 1480, "озинки": 1320, "ростов": 1223, "локоть": 3811, "челябинск": 1940 },
    "петербург": { "москва": 650, "илецк": 2130, "озинки": 1970 },
    "самара": { "москва": 1043, "илецк": 437, "озинки": 380, "саратов": 420, "уфа": 460 },
    "саратов": { "москва": 856, "самара": 420, "озинки": 320, "волгоград": 390 },
    "волгоград": { "саратов": 390, "ростов": 480, "астрахань": 420 },
    "ростов": { "москва": 1223, "волгоград": 480, "минеральныеводы": 470 },
    "илецк": { "москва": 1480, "самара": 437, "актобе": 150, "сарыагаш": 2080, "бейнеу": 1930 },
    "озинки": { "москва": 1320, "саратов": 320, "уральск": 130, "сарыагаш": 2150, "бейнеу": 1480 },
    "актобе": { "илецк": 150, "кандыагаш": 95, "сарыагаш": 1960 },
    "кандыагаш": { "актобе": 95, "шалкар": 260, "макат": 380 },
    "шалкар": { "кандыагаш": 260, "саксаульская": 180 },
    "саксаульская": { "шалкар": 180, "казалинск": 110 },
    "казалинск": { "саксаульская": 110, "кызылорда": 370 },
    "кызылорда": { "казалинск": 370, "туркестан": 280, "сарыагаш": 650 },
    "туркестан": { "кызылорда": 280, "арысь": 150 },
    "арысь": { "туркестан": 150, "шымкент": 75, "сарыагаш": 132 },
    "шымкент": { "арысь": 75, "тараз": 180, "сарыагаш": 132 },
    "тараз": { "шымкент": 180, "шу": 230, "сарыагаш": 310 },
    "шу": { "тараз": 230, "алматы": 310, "отар": 170, "сарыагаш": 540, "актогай": 850, "караганда": 720 },
    "алматы": { "шу": 310, "отар": 140, "сарыагаш": 814, "достык": 1050, "алтынколь": 360, "актогай": 580 },
    "астана": { "кокшетау": 296, "караганда": 219, "павлодар": 449, "костанай": 710, "сарыагаш": 1481 },
    "караганда": { "астана": 219, "мойынты": 365, "сарыагаш": 1262 },
    "мойынты": { "караганда": 365, "шу": 355, "актогай": 410 },
    "кокшетау": { "астана": 296, "петропавловск": 190, "сарыагаш": 1777 },
    "петропавловск": { "кокшетау": 190, "курган": 260, "омск": 275 },
    "челябинск": { "москва": 1940, "екатеринбург": 260, "курган": 256, "карталы": 260 },
    "курган": { "челябинск": 256, "петропавловск": 260, "омск": 530 },
    "омск": { "курган": 530, "петропавловск": 275, "новосибирск": 627 },
    "новосибирск": { "омск": 627, "барнаул": 220, "красноярск": 760, "владивосток": 5800 },
    "красноярск": { "новосибирск": 760, "иркутск": 1080 },
    "иркутск": { "красноярск": 1080, "уланудэ": 456, "чита": 1012 },
    "чита": { "иркутск": 1012, "хабаровск": 2270 },
    "хабаровск": { "чита": 2270, "владивосток": 768 },
    "владивосток": { "хабаровск": 768, "новосибирск": 5800, "самур": 9400 },
    "костанай": { "астана": 710, "тобол": 100, "сарыагаш": 2135 },
    "семей": { "актогай": 480, "локоть": 150, "сарыагаш": 1949 },
    "жанасемей": { "актогай": 480, "локоть": 150, "сарыагаш": 1949 },
    "локоть": { "семей": 150, "барнаул": 370, "новосибирск": 600, "москва": 3811, "сарыагаш": 1820 },
    "сарыагаш": { "арысь": 132, "шымкент": 132, "келес": 13, "чукурсай": 25, "ташкент": 28, "тукимачи": 34, "сергели": 38, "илецк": 2080, "озинки": 2150, "локоть": 1820, "галаба": 755 },
    "келес": { "сарыагаш": 13, "чукурсай": 12, "ташкент": 15, "тукимачи": 21, "сергели": 25, "галаба": 755 },
    "чукурсай": { "келес": 12, "ташкент": 8, "тукимачи": 14, "сергели": 19, "самарканд": 325, "сарыагаш": 25 },
    "ташкент": { "чукурсай": 8, "тукимачи": 6, "сергели": 11, "хаваст": 130, "ангрен": 114 },
    "тукимачи": { "ташкент": 6, "чукурсай": 14, "сергели": 5, "самарканд": 331 },
    "сергели": { "тукимачи": 5, "ташкент": 11, "чукурсай": 19, "хаваст": 120 },
    "самарканд": { "чукурсай": 325, "навои": 140, "карши": 140, "бухара": 257 },
    "карши": { "самарканд": 140, "термез": 220, "дехканабад": 95 },
    "термез": { "карши": 220, "галаба": 45, "хайратан": 49 },
    "галаба": { "термез": 45, "хайратан": 4, "сарыагаш": 755 },
    "хайратан": { "галаба": 4, "термез": 49, "сарыагаш": 759 },
    "баку": { "гянджа": 364, "тбилиси": 624, "ялама": 218 },
    "гянджа": { "баку": 364, "тбилиси": 260 },
    "тбилиси": { "гянджа": 260, "баку": 624, "батуми": 350, "поти": 312, "гардабани": 65 },
    "гардабани": { "тбилиси": 65, "беюккясик": 15 },
    "беюккясик": { "гардабани": 15, "гянджа": 138, "баку": 506, "ялама": 724 },
    "ялама": { "баку": 218, "беюккясик": 724, "самур": 12 },
    "самур": { "ялама": 12, "дербент": 35, "махачкала": 162, "аксарайская": 680, "владивосток": 9400 },
    "батуми": { "тбилиси": 350, "поти": 70 },
    "поти": { "тбилиси": 312, "батуми": 70, "гардабани": 377 }
  };

  // 1. УНИВЕРСАЛЬНАЯ ОЧИСТКА И НОРМАЛИЗАЦИЯ НАЗВАНИЙ СТАНЦИЙ СЕТИ 1520 ММ
  function cleanStationName(name) {
    if (!name) return '';
    var s = (typeof name === 'object' && name !== null) ? (name.name || '') : name.toString();
    s = s.toLowerCase().replace(/ё/g, 'е');
    s = s.replace(/\[.*?\]/g, '').replace(/\[.*/g, '');
    s = s.replace(/\(.*?\)/g, '').replace(/\(.*/g, '');
    s = s.replace(/(?:^|\s+)(?:ст|станция)\.?\s*/gi, ' ');
    s = s.replace(/\s+ii\b/g, ' 2').replace(/-ii\b/g, '-2').replace(/\s+i\b/g, ' 1').replace(/-i\b/g, '-1');
    s = s.replace(/[^\u0400-\u04FFa-zA-Z0-9]/g, '');
    return s;
  }

  // КОРНЕВОЙ КЛЮЧ ДЛЯ ТАРИФНЫХ РУКОВОДСТВ И КАНОНИЧЕСКИХ РАССТОЯНИЙ
  function getStationRootKey(name) {
    if (!name) return '';
    var s = cleanStationName(name);
    if (s.indexOf('тукимачи') !== -1) return 'тукимачи';
    if (s.indexOf('хайратан') !== -1) return 'хайратан';
    if (s.indexOf('владивосток') !== -1) return 'владивосток';
    if (s.indexOf('жанасемей') !== -1) return 'жанасемей';
    if (s.indexOf('семей') !== -1) return 'семей';
    if (s.indexOf('петербург') !== -1 || s.indexOf('питер') !== -1 || s.indexOf('спб') !== -1) return 'петербург';
    if (s.indexOf('москва') !== -1) return 'москва';
    if (s.indexOf('екатеринбург') !== -1 || s.indexOf('свердловск') !== -1) return 'екатеринбург';
    if (s.indexOf('бухара') !== -1) return 'бухара';
    if (s.indexOf('сарыагаш') !== -1 || s.indexOf('сарыагач') !== -1) return 'сарыагаш';
    if (s.indexOf('келес') !== -1) return 'келес';
    if (s.indexOf('чукурсай') !== -1) return 'чукурсай';
    if (s.indexOf('ташкент') !== -1) return 'ташкент';
    if (s.indexOf('сергели') !== -1) return 'сергели';
    if (s.indexOf('самарканд') !== -1) return 'самарканд';
    if (s.indexOf('термез') !== -1) return 'термез';
    if (s.indexOf('галаба') !== -1) return 'галаба';
    if (s.indexOf('костанай') !== -1 || s.indexOf('кустанай') !== -1) return 'костанай';
    if (s.indexOf('астана') !== -1 || s.indexOf('нурсултан') !== -1) return 'астана';
    if (s.indexOf('алматы') !== -1 || s.indexOf('алмаата') !== -1) return 'алматы';
    if (s.indexOf('шымкент') !== -1 || s.indexOf('чимкент') !== -1) return 'шымкент';
    if (s.indexOf('тараз') !== -1 || s.indexOf('джамбул') !== -1) return 'тараз';
    if (s.indexOf('караганда') !== -1) return 'караганда';
    if (s.indexOf('кокшетау') !== -1) return 'кокшетау';
    if (s.indexOf('актобе') !== -1 || s.indexOf('актюбинск') !== -1) return 'актобе';
    if (s.indexOf('илецк') !== -1) return 'илецк';
    if (s.indexOf('озинки') !== -1) return 'озинки';
    if (s.indexOf('карталы') !== -1) return 'карталы';
    if (s.indexOf('локоть') !== -1) return 'локоть';
    if (s.indexOf('минск') !== -1) return 'минск';
    if (s.indexOf('брест') !== -1) return 'брест';
    if (s.indexOf('павлодар') !== -1) return 'павлодар';
    if (s.indexOf('атырау') !== -1) return 'атырау';
    if (s.indexOf('мангышлак') !== -1 || s.indexOf('актау') !== -1) return 'мангышлак';
    if (s.indexOf('нукус') !== -1) return 'нукус';
    if (s.indexOf('ургенч') !== -1) return 'ургенч';
    if (s.indexOf('андижан') !== -1) return 'андижан';
    if (s.indexOf('коканд') !== -1) return 'коканд';
    if (s.indexOf('ростов') !== -1) return 'ростов';
    if (s.indexOf('тбилиси') !== -1) return 'тбилиси';
    if (s.indexOf('батуми') !== -1) return 'батуми';
    if (s.indexOf('поти') !== -1) return 'поти';
    if (s.indexOf('гардабани') !== -1) return 'гардабани';
    if (s.indexOf('беюккясик') !== -1 || s.indexOf('беюк-кясик') !== -1) return 'беюккясик';
    if (s.indexOf('ялама') !== -1) return 'ялама';
    if (s.indexOf('самур') !== -1) return 'самур';
    if (s.indexOf('махачкала') !== -1) return 'махачкала';
    if (s.indexOf('дербент') !== -1) return 'дербент';
    if (s.indexOf('баку') !== -1) return 'баку';
    if (s.indexOf('ереван') !== -1) return 'ереван';
    if (s.indexOf('бишкек') !== -1) return 'бишкек';
    if (s.indexOf('душанбе') !== -1) return 'душанбе';
    return s;
  }

  // 2. УНИВЕРСАЛЬНЫЙ ПОИСК СТАНЦИИ С АВТОМАТИЧЕСКИМ ИЗВЛЕЧЕНИЕМ 6-ЗНАЧНОГО КОДА ЕСР
  function findStation(query) {
    if (!query) return STATIONS[0];
    if (typeof query === 'object' && query !== null && query.code && query.name) return query;

    var rawStr = (typeof query === 'object' && query !== null) ? (query.name || '') : query.toString().trim();
    var codeMatch = rawStr.match(/\b(\d{6})\b/);
    var cleanQ = cleanStationName(rawStr);
    var lowerQ = rawStr.toLowerCase();

    // 0. Поиск строго по 6-значному коду ЕСР
    if (codeMatch) {
      for (var c = 0; c < STATIONS.length; c++) {
        if (STATIONS[c].code === codeMatch[1]) {
          return STATIONS[c];
        }
      }
    }

    // 1. Точное совпадение по коду ЕСР
    for (var i = 0; i < STATIONS.length; i++) {
      if (STATIONS[i].code === rawStr) return STATIONS[i];
    }

    // 2. Точное совпадение по строго очищенному названию
    for (var j = 0; j < STATIONS.length; j++) {
      if (cleanStationName(STATIONS[j].name) === cleanQ) {
        var resSt = Object.assign({}, STATIONS[j]);
        if (codeMatch) resSt.code = codeMatch[1];
        return resSt;
      }
    }

    // 3. Совпадение по началу строгого названия
    for (var k = 0; k < STATIONS.length; k++) {
      var sClean = cleanStationName(STATIONS[k].name);
      if (sClean.indexOf(cleanQ) === 0 || (cleanQ.length >= 4 && cleanQ.indexOf(sClean) === 0)) {
        var resSt2 = Object.assign({}, STATIONS[k]);
        if (codeMatch) resSt2.code = codeMatch[1];
        return resSt2;
      }
    }

    // 4. Поиск по подстроке в оригинальном имени
    for (var l = 0; l < STATIONS.length; l++) {
      if (STATIONS[l].name.toLowerCase().indexOf(cleanQ) !== -1) {
        var resSt3 = Object.assign({}, STATIONS[l]);
        if (codeMatch) resSt3.code = codeMatch[1];
        return resSt3;
      }
    }

    // 5. Динамический синтез станции по введенным данным (с точным определением дороги и страны)
    var detectedCountry = 'RUS';
    var detectedCountryName = 'Россия';
    var detectedAdmin = 'РЖД';
    var roadStr = 'Российские железные дороги (РЖД)';
    var roadCode = '01';

    if (lowerQ.indexOf('тбилиси') !== -1 || lowerQ.indexOf('батуми') !== -1 || lowerQ.indexOf('поти') !== -1 ||
        lowerQ.indexOf('кутаиси') !== -1 || lowerQ.indexOf('рустави') !== -1 || lowerQ.indexOf('боржоми') !== -1 ||
        lowerQ.indexOf('гори') !== -1 || lowerQ.indexOf('хашури') !== -1 || lowerQ.indexOf('авчала') !== -1 ||
        lowerQ.indexOf('сенаки') !== -1 || lowerQ.indexOf('садахло') !== -1 || lowerQ.indexOf('гардабани') !== -1) {
      detectedCountry = 'GEO';
      detectedCountryName = 'Грузия';
      detectedAdmin = 'ГРЗ';
      roadCode = '57';
      roadStr = 'Грузинская ж. д. (ГРЗ)';
    } else if (lowerQ.indexOf('баку') !== -1 || lowerQ.indexOf('гянджа') !== -1 || lowerQ.indexOf('сумгаит') !== -1 ||
               lowerQ.indexOf('алят') !== -1 || lowerQ.indexOf('беюккясик') !== -1 || lowerQ.indexOf('ялама') !== -1) {
      detectedCountry = 'AZE';
      detectedCountryName = 'Азербайджан';
      detectedAdmin = 'АДЮ';
      roadCode = '55';
      roadStr = 'Азербайджанские ж. д. (АДЮ)';
    } else if (lowerQ.indexOf('ереван') !== -1 || lowerQ.indexOf('гюмри') !== -1 || lowerQ.indexOf('ахурян') !== -1) {
      detectedCountry = 'ARM';
      detectedCountryName = 'Армения';
      detectedAdmin = 'ЮКЖД';
      roadCode = '58';
      roadStr = 'Южно-Кавказская ж. д. (ЮКЖД)';
    } else if (lowerQ.indexOf('хайратан') !== -1) {
      detectedCountry = 'AFG';
      detectedCountryName = 'Афганистан';
      detectedAdmin = 'АРА';
      roadCode = '135';
      roadStr = 'Афганская ж. д. (АРА)';
    } else if (lowerQ.indexOf('бишкек') !== -1 || lowerQ.indexOf('аламедин') !== -1 || lowerQ.indexOf('ош') !== -1 ||
               lowerQ.indexOf('джалалабад') !== -1 || lowerQ.indexOf('рыбачье') !== -1) {
      detectedCountry = 'KGZ';
      detectedCountryName = 'Кыргызстан';
      detectedAdmin = 'КРГ';
      roadCode = '71';
      roadStr = 'Кыргызская ж. д. (КРГ)';
    } else if (lowerQ.indexOf('душанбе') !== -1 || lowerQ.indexOf('худжанд') !== -1 || lowerQ.indexOf('курган') !== -1 ||
               lowerQ.indexOf('куляб') !== -1) {
      detectedCountry = 'TJK';
      detectedCountryName = 'Таджикистан';
      detectedAdmin = 'ТДЖ';
      roadCode = '74';
      roadStr = 'Таджикская ж. д. (ТДЖ)';
    } else if (lowerQ.indexOf('ашхабад') !== -1 || lowerQ.indexOf('туркменбаши') !== -1 || lowerQ.indexOf('мары') !== -1 ||
               lowerQ.indexOf('туркменабад') !== -1 || lowerQ.indexOf('чарджоу') !== -1) {
      detectedCountry = 'TKM';
      detectedCountryName = 'Туркменистан';
      detectedAdmin = 'ТРК';
      roadCode = '75';
      roadStr = 'Туркменская ж. д. (ТРК)';
    } else if (lowerQ.indexOf('ташкент') !== -1 || lowerQ.indexOf('чукурсай') !== -1 || lowerQ.indexOf('сергели') !== -1 ||
               lowerQ.indexOf('тукимачи') !== -1 || lowerQ.indexOf('самарканд') !== -1 || lowerQ.indexOf('бухара') !== -1 ||
               lowerQ.indexOf('навои') !== -1 || lowerQ.indexOf('андижан') !== -1 || lowerQ.indexOf('фергана') !== -1 || lowerQ.indexOf('галаба') !== -1 || lowerQ.indexOf('термез') !== -1) {
      detectedCountry = 'UZB';
      detectedCountryName = 'Узбекистан';
      detectedAdmin = 'УТИ';
      roadCode = '73';
      roadStr = 'Узбекская ж. д. (УТИ)';
    } else if (lowerQ.indexOf('алматы') !== -1 || lowerQ.indexOf('астана') !== -1 || lowerQ.indexOf('караганда') !== -1 ||
               lowerQ.indexOf('шымкент') !== -1 || lowerQ.indexOf('семей') !== -1 || lowerQ.indexOf('кокшетау') !== -1 ||
               lowerQ.indexOf('костанай') !== -1 || lowerQ.indexOf('павлодар') !== -1 || lowerQ.indexOf('актобе') !== -1 ||
               lowerQ.indexOf('атырау') !== -1 || lowerQ.indexOf('актау') !== -1) {
      detectedCountry = 'KAZ';
      detectedCountryName = 'Казахстан';
      detectedAdmin = 'КТЖ';
      roadCode = '67';
      roadStr = 'Казахстанская ж. д. (КТЖ)';
    } else if (lowerQ.indexOf('владивосток') !== -1 || lowerQ.indexOf('хабаровск') !== -1) {
      detectedCountry = 'RUS';
      detectedCountryName = 'Россия';
      detectedAdmin = 'РЖД';
      roadCode = '96';
      roadStr = 'Дальневосточная ж. д. (РЖД)';
    } else if (lowerQ.indexOf('минск') !== -1 || lowerQ.indexOf('брест') !== -1 || lowerQ.indexOf('гомель') !== -1 ||
               lowerQ.indexOf('витебск') !== -1 || lowerQ.indexOf('могилев') !== -1 || lowerQ.indexOf('гродно') !== -1) {
      detectedCountry = 'BLR';
      detectedCountryName = 'Беларусь';
      detectedAdmin = 'БЧ';
      roadCode = '13';
      roadStr = 'Белорусская ж. д. (БЧ)';
    } else if (codeMatch) {
      var cPrefix = codeMatch[1].substring(0, 2);
      var cPrefix4 = parseInt(codeMatch[1].substring(0, 4), 10);
      if (codeMatch[1] === '000251' || codeMatch[1].indexOf('00') === 0) {
        detectedCountry = 'AFG';
        detectedCountryName = 'Афганистан';
        detectedAdmin = 'АРА';
        roadCode = '135';
        roadStr = 'Афганская ж. д. (АРА)';
      } else if (['56', '57'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'GEO';
        detectedCountryName = 'Грузия';
        detectedAdmin = 'ГРЗ';
        roadCode = '57';
        roadStr = 'Грузинская ж. д. (ГРЗ)';
      } else if (['54', '55'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'AZE';
        detectedCountryName = 'Азербайджан';
        detectedAdmin = 'АДЮ';
        roadCode = '55';
        roadStr = 'Азербайджанские ж. д. (АДЮ)';
      } else if (['58', '59'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'ARM';
        detectedCountryName = 'Армения';
        detectedAdmin = 'ЮКЖД';
        roadCode = '58';
        roadStr = 'Южно-Кавказская ж. д. (ЮКЖД)';
      } else if (['66', '67', '68', '69', '70'].indexOf(cPrefix) !== -1 || (cPrefix === '71' && cPrefix4 < 7160)) {
        detectedCountry = 'KAZ';
        detectedCountryName = 'Казахстан';
        detectedAdmin = 'КТЖ';
        roadCode = '67';
        roadStr = 'Казахстанская ж. д. (КТЖ)';
      } else if (cPrefix === '71' && cPrefix4 >= 7160) {
        detectedCountry = 'KGZ';
        detectedCountryName = 'Кыргызстан';
        detectedAdmin = 'КРГ';
        roadCode = '71';
        roadStr = 'Кыргызская ж. д. (КРГ)';
      } else if (cPrefix === '75') {
        detectedCountry = 'TKM';
        detectedCountryName = 'Туркменистан';
        detectedAdmin = 'ТРК';
        roadCode = '75';
        roadStr = 'Туркменская ж. д. (ТРК)';
      } else if (['72', '73'].indexOf(cPrefix) !== -1 || (cPrefix === '74' && ['744', '745', '746', '747', '748'].indexOf(codeMatch[1].substring(0, 3)) === -1)) {
        detectedCountry = 'UZB';
        detectedCountryName = 'Узбекистан';
        detectedAdmin = 'УТИ';
        roadCode = '73';
        roadStr = 'Узбекская ж. д. (УТИ)';
      } else if (cPrefix === '74' && ['744', '745', '746', '747', '748'].indexOf(codeMatch[1].substring(0, 3)) !== -1) {
        detectedCountry = 'TJK';
        detectedCountryName = 'Таджикистан';
        detectedAdmin = 'ТДЖ';
        roadCode = '74';
        roadStr = 'Таджикская ж. д. (ТДЖ)';
      } else if (['96', '97', '98'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'RUS';
        detectedCountryName = 'Россия';
        detectedAdmin = 'РЖД';
        roadCode = '96';
        roadStr = 'Дальневосточная ж. д. (РЖД)';
      } else if (['13', '14'].indexOf(cPrefix) !== -1) {
        detectedCountry = 'BLR';
        detectedCountryName = 'Беларусь';
        detectedAdmin = 'БЧ';
        roadCode = '13';
        roadStr = 'Белорусская ж. д. (БЧ)';
      }
    }

    return {
      name: rawStr.split('(')[0].trim(),
      code: codeMatch ? codeMatch[1] : (detectedCountry === 'AFG' ? '000251' : (detectedCountry === 'UZB' ? '720000' : '193504')),
      country: detectedCountry,
      country_name: detectedCountryName,
      admin: detectedAdmin,
      road: roadCode,
      road_label: roadStr,
      is_border: false
    };
  }

  function searchStations(query, limit) {
    limit = limit || 10;
    if (!query || query.trim().length < 2) return [];
    var q = query.trim().toLowerCase();
    var results = [];

    for (var i = 0; i < STATIONS.length; i++) {
      var s = STATIONS[i];
      if (s.code.indexOf(q) === 0 || 
          s.name.toLowerCase().indexOf(q) !== -1 ||
          (s.road_label && s.road_label.toLowerCase().indexOf(q) !== -1)) {
        results.push(s);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  function findCargo(query) {
    if (!query) return CARGO_ITEMS[0];
    var q = query.toString().trim().toLowerCase();
    for (var i = 0; i < CARGO_ITEMS.length; i++) {
      if (CARGO_ITEMS[i].code_etsng === q || CARGO_ITEMS[i].code_gng === q) return CARGO_ITEMS[i];
      if (CARGO_ITEMS[i].name.toLowerCase().indexOf(q) !== -1) return CARGO_ITEMS[i];
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
          item.name.toLowerCase().indexOf(q) !== -1) {
        results.push(item);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  // РАСЧЕТ РАССТОЯНИЙ ПО ГРАФУ ДЕЙКСТРЫ (БЕЗ КОЭФФИЦИЕНТОВ)
  function dijkstraShortestPath(startNode, targetNode) {
    if (startNode === targetNode) return 0;
    var dist = {};
    var visited = {};
    for (var n in RAILWAY_GRAPH) {
      dist[n] = Infinity;
    }
    dist[startNode] = 0;

    while (true) {
      var closest = null;
      var shortest = Infinity;
      for (var node in dist) {
        if (!visited[node] && dist[node] < shortest) {
          shortest = dist[node];
          closest = node;
        }
      }
      if (!closest || shortest === Infinity) break;
      if (closest === targetNode) return dist[targetNode];

      visited[closest] = true;
      var neighbors = RAILWAY_GRAPH[closest];
      if (neighbors) {
        for (var neighbor in neighbors) {
          if (!visited[neighbor]) {
            var newDist = dist[closest] + neighbors[neighbor];
            if (newDist < dist[neighbor]) {
              dist[neighbor] = newDist;
            }
          }
        }
      }
    }
    return (dist[targetNode] !== Infinity) ? dist[targetNode] : null;
  }

  function resolveLegDistance(fromSt, toSt) {
    var fClean = cleanStationName(fromSt.name || fromSt);
    var tClean = cleanStationName(toSt.name || toSt);
    var fRoot = getStationRootKey(fromSt.name || fromSt);
    var tRoot = getStationRootKey(toSt.name || toSt);

    if (fClean === tClean || (fRoot && tRoot && fRoot === tRoot)) return 0;

    // 1. Ташкентский железнодорожный узел
    var tashkentHub = ['чукурсай', 'ташкент', 'сергели', 'тукимачи', 'келес'];
    if (tashkentHub.indexOf(fRoot) !== -1 && tashkentHub.indexOf(tRoot) !== -1) {
      var dMap = {
        'чукурсай_ташкент': 8, 'ташкент_чукурсай': 8,
        'чукурсай_тукимачи': 14, 'тукимачи_чукурсай': 14,
        'чукурсай_сергели': 19, 'сергели_чукурсай': 19,
        'ташкент_тукимачи': 6, 'тукимачи_ташкент': 6,
        'ташкент_сергели': 11, 'сергели_ташкент': 11,
        'тукимачи_сергели': 5, 'сергели_тукимачи': 5,
        'келес_чукурсай': 13, 'чукурсай_келес': 13,
        'келес_ташкент': 21, 'ташкент_келес': 21,
        'келес_тукимачи': 27, 'тукимачи_келес': 27,
        'келес_сергели': 32, 'сергели_келес': 32
      };
      var kk = fRoot + '_' + tRoot;
      if (dMap[kk]) return dMap[kk];
      return 14;
    }

    // 2. Прямой поиск в канонической таблице ТР-4 (по точным и корневым именам)
    var k1 = fClean + '_' + tClean;
    var k2 = tClean + '_' + fClean;
    if (CANONICAL_DISTANCES[k1]) return CANONICAL_DISTANCES[k1];
    if (CANONICAL_DISTANCES[k2]) return CANONICAL_DISTANCES[k2];

    var kr1 = fRoot + '_' + tRoot;
    var kr2 = tRoot + '_' + fRoot;
    if (CANONICAL_DISTANCES[kr1]) return CANONICAL_DISTANCES[kr1];
    if (CANONICAL_DISTANCES[kr2]) return CANONICAL_DISTANCES[kr2];

    // Специальные стыковые перегоны
    if ((fRoot === 'сарыагаш' && tRoot === 'келес') || (fRoot === 'келес' && tRoot === 'сарыагаш')) return 13;
    if ((fRoot === 'сарыагаш' || fRoot === 'келес') && tRoot === 'чукурсай') return 25;
    if ((tRoot === 'сарыагаш' || tRoot === 'келес') && fRoot === 'чукурсай') return 25;
    if ((fRoot === 'сарыагаш' || fRoot === 'келес') && tRoot === 'ташкент') return 28;
    if ((tRoot === 'сарыагаш' || tRoot === 'келес') && fRoot === 'ташкент') return 28;
    if ((fRoot === 'галаба' && tRoot === 'хайратан') || (fRoot === 'хайратан' && tRoot === 'галаба')) return 4;
    if ((fRoot === 'гардабани' && tRoot === 'беюккясик') || (fRoot === 'беюккясик' && tRoot === 'гардабани')) return 15;
    if ((fRoot === 'ялама' && tRoot === 'самур') || (fRoot === 'самур' && tRoot === 'ялама')) return 12;

    // 3. ДИНАМИЧЕСКИЙ ТОПОЛОГИЧЕСКИЙ РАСЧЕТ ПО КОРИДОРАМ ТР-4
    if (typeof calculateDistanceAcrossCorridors === 'function') {
      var corrDist = calculateDistanceAcrossCorridors(fromSt, toSt);
      if (corrDist && corrDist > 0) return corrDist;
    }

    // 4. Кратчайший путь Дейкстры по железнодорожному графу
    if (RAILWAY_GRAPH[fRoot] && RAILWAY_GRAPH[tRoot]) {
      var graphDist = dijkstraShortestPath(fRoot, tRoot);
      if (graphDist && graphDist > 0) return graphDist;
    }
    if (RAILWAY_GRAPH[fClean] && RAILWAY_GRAPH[tClean]) {
      var graphDist2 = dijkstraShortestPath(fClean, tClean);
      if (graphDist2 && graphDist2 > 0) return graphDist2;
    }

    // 5. Запасные магистральные плечи
    if (fromSt.country === 'KAZ' && fRoot !== 'сарыагаш' && fRoot !== 'келес' && (tRoot === 'сарыагаш' || tRoot === 'келес')) {
      return 1777;
    }
    if (fromSt.country === 'UZB' && tRoot !== 'сарыагаш' && tRoot !== 'келес' && (fRoot === 'сарыагаш' || fRoot === 'келес')) {
      return 28;
    }
    if (fromSt.country === 'RUS' && fRoot !== 'илецк' && fRoot !== 'озинки' && (tRoot === 'илецк' || tRoot === 'озинки')) {
      return 1480;
    }

    if (fromSt.country === toSt.country) {
      return 45;
    }

    return 500;
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

    var fCountry = fromSt.country || 'RUS';
    var tCountry = toSt.country || 'UZB';

    // 1. ВНУТРИГОСУДАРСТВЕННОЕ СООБЩЕНИЕ
    if (fCountry === tCountry) {
      messageType = 'Внутригосударственное (' + (fromSt.country_name || fCountry) + ')';
      var dist = resolveLegDistance(fromSt, toSt);
      legs.push({
        country: fCountry,
        countryName: fromSt.country_name || fCountry,
        road: fromSt.road_label || 'Железная дорога',
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

    // 2. ТРАНЗИТ ЧЕРЕЗ КАЗАХСТАН: РОССИЯ ⇄ УЗБЕКИСТАН
    var isRusUzb = (fCountry === 'RUS' && tCountry === 'UZB');
    var isUzbRus = (fCountry === 'UZB' && tCountry === 'RUS');
    if (isRusUzb || isUzbRus) {
      isTransit = true;
      var availBorders1 = BORDER_CROSSINGS['RUS-KAZ'];
      var availBorders2 = BORDER_CROSSINGS['KAZ-UZB'];

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
        if (fNorm.indexOf('москва') !== -1 || fNorm.indexOf('петербург') !== -1) {
          border1 = availBorders1[0]; // ст. Илецк I (666501)
        } else if (fNorm.indexOf('саратов') !== -1 || fNorm.indexOf('самара') !== -1 || fNorm.indexOf('волгоград') !== -1 || fNorm.indexOf('озинки') !== -1) {
          border1 = availBorders1.find(function(b) { return b.code === '664900'; }) || availBorders1[0];
        } else {
          border1 = availBorders1[0];
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

      var b1St = { name: border1.name.split('/')[0].trim(), country: 'RUS', road_label: 'РЖД' };
      var b1KzSt = { name: border1.name.split('/')[0].trim(), country: 'KAZ', road_label: 'КТЖ' };
      var b2KzSt = { name: border2.name.split('/')[0].trim(), country: 'KAZ', road_label: 'КТЖ' };
      var b2UzSt = { name: (border2.name.split('/')[1] || border2.name).trim(), country: 'UZB', road_label: 'УТИ' };

      if (isRusUzb) {
        messageType = 'Транзитное сообщение (Россия ➔ Казахстан [Транзит] ➔ Узбекистан)';
        var d1 = resolveLegDistance(fromSt, b1St);
        var d2 = resolveLegDistance(b1KzSt, b2KzSt);
        var d3 = resolveLegDistance(b2KzSt, toSt) || resolveLegDistance(b2UzSt, toSt) || 25;

        legs.push({ country: 'RUS', countryName: 'Россия', road: fromSt.road_label || 'РЖД', from: fromSt.name, to: border1.name.split('/')[0].trim(), distanceKm: d1, type: 'export_departure' });
        legs.push({ country: 'KAZ', countryName: 'Казахстан (Транзит)', road: 'Казахстанская ж. д. (КТЖ Транзит)', from: border1.name.split('/')[0].trim(), to: border2.name.split('/')[0].trim(), distanceKm: d2, type: 'transit' });
        legs.push({ country: 'UZB', countryName: 'Узбекистан', road: toSt.road_label || 'Узбекская ж. д. (УТИ)', from: (border2.name.split('/')[1] || border2.name).trim(), to: toSt.name, distanceKm: d3, type: 'import_destination' });
      } else {
        messageType = 'Транзитное сообщение (Узбекистан ➔ Казахстан [Транзит] ➔ Россия)';
        var d1 = resolveLegDistance(fromSt, b2UzSt);
        var d2 = resolveLegDistance(b2KzSt, b1KzSt);
        var d3 = resolveLegDistance(b1St, toSt);

        legs.push({ country: 'UZB', countryName: 'Узбекистан', road: fromSt.road_label || 'Узбекская ж. д. (УТИ)', from: fromSt.name, to: (border2.name.split('/')[1] || border2.name).trim(), distanceKm: d1, type: 'export_departure' });
        legs.push({ country: 'KAZ', countryName: 'Казахстан (Транзит)', road: 'Казахстанская ж. д. (КТЖ Транзит)', from: border2.name.split('/')[0].trim(), to: border1.name.split('/')[0].trim(), distanceKm: d2, type: 'transit' });
        legs.push({ country: 'RUS', countryName: 'Россия', road: toSt.road_label || 'РЖД', from: border1.name.split('/')[0].trim(), to: toSt.name, distanceKm: d3, type: 'import_destination' });
      }

      return { isTransit: true, messageType: messageType, border1: border1, border2: border2, availBorders1: availBorders1, availBorders2: availBorders2, legs: legs };
    }

    // 3. КАЗАХСТАН ➔ АФГАНИСТАН (Транзит через Узбекистан: Сарыагаш ➔ Галаба ➔ Хайратан)
    if (fCountry === 'KAZ' && tCountry === 'AFG') {
      messageType = 'Транзитное сообщение (Казахстан ➔ Узбекистан [Транзит] ➔ Афганистан)';
      var bKzUz = BORDER_CROSSINGS['KAZ-UZB'][0]; // Сарыагаш / Келес
      var bUzAf = BORDER_CROSSINGS['UZB-AFG'][0]; // Галаба / Хайратан
      var d1 = resolveLegDistance(fromSt, { name: 'Сарыагаш (эксп.)', code: '704101', country: 'KAZ' });
      var d2 = 755; // Келес -> Галаба транзит УТИ
      var d3 = 4;   // Галаба -> Хайратан мост дружбы

      legs.push({ country: 'KAZ', countryName: 'Казахстан', road: fromSt.road_label || 'Казахстанская ж. д. (КТЖ)', from: fromSt.name, to: 'Сарыагаш (эксп.)', distanceKm: d1, type: 'export_departure' });
      legs.push({ country: 'UZB', countryName: 'Узбекистан (Транзит)', road: 'Узбекская ж. д. (УТИ Транзит)', from: 'Келес (эксп.)', to: 'Галаба (эксп.)', distanceKm: d2, type: 'transit' });
      legs.push({ country: 'AFG', countryName: 'Афганистан', road: 'Афганская ж. д. (АРА)', from: 'Галаба (эксп.)', to: toSt.name, distanceKm: d3, type: 'import_destination' });

      return { isTransit: true, messageType: messageType, border1: bKzUz, border2: bUzAf, legs: legs };
    }

    // 4. ГРУЗИЯ ➔ РОССИЯ (Сквозной сухопутный маршрут через Азербайджан / Дагестан)
    if ((fCountry === 'GEO' && tCountry === 'RUS') || (fCountry === 'RUS' && tCountry === 'GEO')) {
      messageType = 'Международное транзитное сообщение (Грузия ➔ Азербайджан [Транзит] ➔ Россия)';
      var bGeoAze = BORDER_CROSSINGS['AZE-GEO'][0];
      var bAzeRus = BORDER_CROSSINGS['RUS-AZE'][0];
      if (fCountry === 'GEO') {
        var d1 = resolveLegDistance(fromSt, { name: 'Гардабани (эксп.)', code: '560608', country: 'GEO' });
        if (!d1 || d1 <= 0) d1 = (cleanStationName(fromSt.name).indexOf('поти') !== -1 ? 377 : (cleanStationName(fromSt.name).indexOf('батуми') !== -1 ? 415 : 65));
        var d2 = 724; // Беюк-Кясик -> Ялама транзит АДЮ
        var d3 = resolveLegDistance({ name: 'Самур (эксп.)', code: '544200', country: 'RUS' }, toSt);
        if (!d3 || d3 <= 0) d3 = (cleanStationName(toSt.name).indexOf('владивосток') !== -1 ? 9400 : 2150);

        legs.push({ country: 'GEO', countryName: 'Грузия', road: fromSt.road_label || 'Грузинская ж. д. (ГРЗ)', from: fromSt.name, to: 'Гардабани (эксп.)', distanceKm: d1, type: 'export_departure' });
        legs.push({ country: 'AZE', countryName: 'Азербайджан (Транзит)', road: 'Азербайджанские ж. д. (АДЮ Транзит)', from: 'Беюк-Кясик (эксп.)', to: 'Ялама (эксп.)', distanceKm: d2, type: 'transit' });
        legs.push({ country: 'RUS', countryName: 'Россия', road: toSt.road_label || 'РЖД', from: 'Самур (эксп.)', to: toSt.name, distanceKm: d3, type: 'import_destination' });
      } else {
        var d1 = resolveLegDistance(fromSt, { name: 'Самур (эксп.)', code: '544200', country: 'RUS' });
        var d2 = 724;
        var d3 = resolveLegDistance({ name: 'Гардабани (эксп.)', code: '560608', country: 'GEO' }, toSt);

        legs.push({ country: 'RUS', countryName: 'Россия', road: fromSt.road_label || 'РЖД', from: fromSt.name, to: 'Самур (эксп.)', distanceKm: d1, type: 'export_departure' });
        legs.push({ country: 'AZE', countryName: 'Азербайджан (Транзит)', road: 'Азербайджанские ж. д. (АДЮ Транзит)', from: 'Ялама (эксп.)', to: 'Беюк-Кясик (эксп.)', distanceKm: d2, type: 'transit' });
        legs.push({ country: 'GEO', countryName: 'Грузия', road: toSt.road_label || 'Грузинская ж. д. (ГРЗ)', from: 'Гардабани (эксп.)', to: toSt.name, distanceKm: d3, type: 'import_destination' });
      }
      return { isTransit: true, messageType: messageType, border1: bGeoAze, border2: bAzeRus, legs: legs };
    }

    // 5. ГРУЗИЯ ➔ УЗБЕКИСТАН (Средний коридор ТМТМ: Грузия ➔ Азербайджан ➔ Казахстан ➔ Узбекистан)
    if (fCountry === 'GEO' && tCountry === 'UZB') {
      messageType = 'Мультимодальный коридор ТМТМ (Грузия ➔ Азербайджан ➔ Казахстан ➔ Узбекистан)';
      var d1 = resolveLegDistance(fromSt, { name: 'Гардабани (эксп.)', code: '560608', country: 'GEO' }) || 65;
      var d2 = 506; // Беюк-Кясик -> Баку / Алят-Порт
      var d3 = 2240; // Курык/Актау-Порт -> Сарыагаш
      var d4 = resolveLegDistance({ name: 'Келес (эксп.)', code: '720602', country: 'UZB' }, toSt) || 38;

      legs.push({ country: 'GEO', countryName: 'Грузия', road: fromSt.road_label || 'Грузинская ж. д. (ГРЗ)', from: fromSt.name, to: 'Гардабани (эксп.)', distanceKm: d1, type: 'export_departure' });
      legs.push({ country: 'AZE', countryName: 'Азербайджан (Транзит)', road: 'Азербайджанские ж. д. (АДЮ Транзит)', from: 'Беюк-Кясик (эксп.)', to: 'Баку-Пассажирский', distanceKm: d2, type: 'transit' });
      legs.push({ country: 'KAZ', countryName: 'Казахстан (Транзит)', road: 'Казахстанская ж. д. (КТЖ Транзит)', from: 'Мангышлак (Актау)', to: 'Сарыагаш (эксп.)', distanceKm: d3, type: 'transit' });
      legs.push({ country: 'UZB', countryName: 'Узбекистан', road: toSt.road_label || 'Узбекская ж. д. (УТИ)', from: 'Келес (эксп.)', to: toSt.name, distanceKm: d4, type: 'import_destination' });

      return { isTransit: true, messageType: messageType, border1: BORDER_CROSSINGS['AZE-GEO'][0], border2: BORDER_CROSSINGS['KAZ-UZB'][0], legs: legs };
    }

    // 6. СТАНДАРТНОЕ ДВУСТОРОННЕЕ СООБЩЕНИЕ
    messageType = 'Международное (' + (fromSt.country_name || fCountry) + ' ➔ ' + (toSt.country_name || tCountry) + ')';
    var pairKey = fCountry + '-' + tCountry;
    var reverseKey = tCountry + '-' + fCountry;
    var availBorders = BORDER_CROSSINGS[pairKey] || BORDER_CROSSINGS[reverseKey];

    if (!availBorders || availBorders.length === 0) {
      availBorders = BORDER_CROSSINGS['RUS-KAZ'];
    }

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

    var borderSt = { name: border.name.split('/')[0].trim(), country: fCountry, road_label: fromSt.road_label };
    var borderDestSt = { name: (border.name.split('/')[1] || border.name).trim(), country: tCountry, road_label: toSt.road_label };

    var dist1 = resolveLegDistance(fromSt, borderSt);
    var dist2 = resolveLegDistance(borderDestSt, toSt);

    legs.push({
      country: fCountry,
      countryName: fromSt.country_name || fCountry,
      road: fromSt.road_label || 'Железная дорога',
      from: fromSt.name,
      to: border.name.split('/')[0].trim(),
      distanceKm: dist1,
      type: 'export_departure'
    });

    legs.push({
      country: tCountry,
      countryName: toSt.country_name || tCountry,
      road: toSt.road_label || 'Железная дорога',
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

  // 7. ПОСТАНЦИОННЫЕ КОРИДОРЫ ТР-4 (РЕЙЛ-ТАРИФ)
  var CORRIDOR_STATION_CHAINS = {
    "baku_tbilisi_batumi": [
      { name: "Баку-Пассажирский", code: "547406", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 0 },
      { name: "Сумгаит", code: "547603", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 42 },
      { name: "Гянджа", code: "551000", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 322 },
      { name: "Беюк-Кясик (эксп.)", code: "558701", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 138, isBorder: true, borderLabel: "АДЮ ➔ ГРЗ" },
      { name: "Гардабани (эксп.)", code: "560608", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 15, isBorder: true, borderLabel: "АДЮ ➔ ГРЗ" },
      { name: "Рустави", code: "560400", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 20 },
      { name: "Тбилиси-Сортировочная (эксп.)", code: "560063", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 25 },
      { name: "Тбилиси-Товарная", code: "560203", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 5 },
      { name: "Гори", code: "563004", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 76 },
      { name: "Хашури", code: "563606", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 47 },
      { name: "Кутаиси", code: "570008", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 102 },
      { name: "Самтредиа", code: "571208", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 31 },
      { name: "Сенаки", code: "571706", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 40 },
      { name: "Поти (паром, эксп. на Варну)", code: "572003", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 39 },
      { name: "Батуми (эксп.)", code: "576004", road: "Грузинская ж. д. (ГРЗ)", country: "GEO", countryName: "Грузия", dist: 68 }
    ],
    "baku_yalama_samur_derbent": [
      { name: "Баку-Пассажирский", code: "547406", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 0 },
      { name: "Сумгаит", code: "547603", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 42 },
      { name: "Хачмаз", code: "558307", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 125 },
      { name: "Ялама (эксп.)", code: "558608", road: "Азербайджанские ж. д. (АДЮ)", country: "AZE", countryName: "Азербайджан", dist: 51, isBorder: true, borderLabel: "АДЮ ➔ РЖД" },
      { name: "Самур (эксп.)", code: "544200", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 12, isBorder: true, borderLabel: "АДЮ ➔ РЖД" },
      { name: "Дербент", code: "544507", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 35 },
      { name: "Махачкала", code: "545302", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 127 },
      { name: "Кизляр", code: "546305", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 140 },
      { name: "Аксарайская II (эксп.)", code: "618002", road: "Приволжская ж. д.", country: "RUS", countryName: "Россия", dist: 366, isBorder: true, borderLabel: "РЖД ➔ КТЖ" },
      { name: "Астрахань I", code: "618500", road: "Приволжская ж. д.", country: "RUS", countryName: "Россия", dist: 40 }
    ],
    "chelyabinsk_vladivostok": [
      { name: "Челябинск-Главный", code: "800001", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 0 },
      { name: "Курган", code: "820006", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 256 },
      { name: "Петропавловск (эксп.)", code: "688708", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 260 },
      { name: "Омск-Пассажирский", code: "830005", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 275 },
      { name: "Новосибирск-Главный", code: "850005", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 627 },
      { name: "Тайга", code: "870008", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 226 },
      { name: "Красноярск", code: "880007", road: "Красноярская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 514 },
      { name: "Тайшет", code: "920005", road: "Восточно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 412 },
      { name: "Иркутск-Пассажирский", code: "930009", road: "Восточно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 670 },
      { name: "Улан-Удэ", code: "940008", road: "Восточно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 456 },
      { name: "Чита II", code: "945009", road: "Забайкальская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 556 },
      { name: "Хабаровск I", code: "960004", road: "Дальневосточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 2270 },
      { name: "Владивосток (эксп.)", code: "980200", road: "Дальневосточная ж. д. (Комсомольск/Сахалин)", country: "RUS", countryName: "Россия", dist: 768 }
    ],
    "spb_moscow": [
      { name: "Санкт-Петербург-Тов.-Московский", code: "031808", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 0 },
      { name: "Тосно", code: "032209", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 53 },
      { name: "Чудово-Московское", code: "040501", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 65 },
      { name: "Малая Вишера", code: "041203", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 44 },
      { name: "Бологое-Московское", code: "050009", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 157 },
      { name: "Вышний Волочек", code: "051209", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 47 },
      { name: "Тверь", code: "060001", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 119 },
      { name: "Клин", code: "061502", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 80 },
      { name: "Москва-Товарная-Октябрьская", code: "060105", road: "Октябрьская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 85 }
    ],
    "belarus_moscow": [
      { name: "Брест-Северный", code: "130006", road: "Белорусская ж. д. (БЧ)", country: "BLR", countryName: "Беларусь", dist: 0 },
      { name: "Барановичи-Центральные", code: "138304", road: "Белорусская ж. д. (БЧ)", country: "BLR", countryName: "Беларусь", dist: 202 },
      { name: "Минск-Сортировочный", code: "140206", road: "Белорусская ж. д. (БЧ)", country: "BLR", countryName: "Беларусь", dist: 143 },
      { name: "Орша-Центральная", code: "166504", road: "Белорусская ж. д. (БЧ)", country: "BLR", countryName: "Беларусь", dist: 212 },
      { name: "Осиновка (эксп.)", code: "166805", road: "Белорусская ж. д. (БЧ)", country: "BLR", countryName: "Беларусь", dist: 46, isBorder: true, borderLabel: "БЧ ➔ РЖД" },
      { name: "Красное (эксп.)", code: "170104", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 22, isBorder: true, borderLabel: "БЧ ➔ РЖД" },
      { name: "Смоленск-Сортировочный", code: "170000", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 68 },
      { name: "Вязьма", code: "172207", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 175 },
      { name: "Москва-Смоленская", code: "180004", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 243 }
    ],
    "moscow_iletsk": [
      { name: "Москва-Товарная-Павелецкая", code: "193504", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 0 },
      { name: "Домодедово", code: "193307", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 36 },
      { name: "Михнево", code: "193006", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 37 },
      { name: "Ступино", code: "192802", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 26 },
      { name: "Кашира", code: "192709", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 12 },
      { name: "Ожерелье", code: "192605", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 10 },
      { name: "Павелец-Тульский", code: "221302", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 140 },
      { name: "Раненбург (Чаплыгин)", code: "222004", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 75 },
      { name: "Богоявленск", code: "222305", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 42 },
      { name: "Мичуринск-Уральский", code: "222502", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 48 },
      { name: "Тамбов I", code: "223007", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 72 },
      { name: "Кирсанов", code: "223401", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 95 },
      { name: "Ртищево I", code: "223806", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 85 },
      { name: "Аткарск", code: "224207", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 108 },
      { name: "Татищево", code: "224508", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 52 },
      { name: "Саратов-1-Пассажирский", code: "225002", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 42 },
      { name: "Анисовка", code: "225203", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 18 },
      { name: "Урбах", code: "225500", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 74 },
      { name: "Мокроус", code: "225708", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 45 },
      { name: "Ершов", code: "226005", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 52 },
      { name: "Дергачи", code: "226306", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 60 },
      { name: "Озинки (эксп.)", code: "664900", road: "Приволжская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 74, isBorder: true, borderLabel: "РЖД ➔ КТЖ" },
      { name: "Переметная", code: "664101", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 58 },
      { name: "Уральск", code: "664205", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 52 },
      { name: "Федоровка", code: "664506", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 68 },
      { name: "Чингирлау", code: "664807", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 77 },
      { name: "Илецк I (эксп.)", code: "666501", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 22, isBorder: true, borderLabel: "РЖД ➔ КТЖ" }
    ],
    "moscow_samara_iletsk": [
      { name: "Москва-Товарная-Рязанская", code: "193608", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 0 },
      { name: "Рязань I", code: "220009", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 198 },
      { name: "Рузаевка", code: "634002", road: "Куйбышевская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 314 },
      { name: "Сызрань I", code: "635005", road: "Куйбышевская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 236 },
      { name: "Самара", code: "657906", road: "Куйбышевская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 137 },
      { name: "Кинель", code: "658006", road: "Куйбышевская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 41 },
      { name: "Бузулук", code: "810006", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 134 },
      { name: "Оренбург", code: "811901", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 150 },
      { name: "Илецк I (эксп.)", code: "666501", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 70, isBorder: true, borderLabel: "РЖД ➔ КТЖ" }
    ],
    "moscow_lokot": [
      { name: "Москва-Товарная-Ярославская", code: "193504", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 0 },
      { name: "Ярославль-Главный", code: "310009", road: "Северная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 282 },
      { name: "Киров-Котласский", code: "270008", road: "Горьковская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 674 },
      { name: "Пермь II", code: "760009", road: "Свердловская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 487 },
      { name: "Екатеринбург-Сортировочный", code: "780108", road: "Свердловская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 381 },
      { name: "Тюмень", code: "790008", road: "Свердловская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 325 },
      { name: "Омск-Пассажирский", code: "830005", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 560 },
      { name: "Новосибирск-Главный", code: "850005", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 627 },
      { name: "Барнаул", code: "840004", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 220 },
      { name: "Рубцовск", code: "844005", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 215 },
      { name: "Локоть (эксп.)", code: "711105", road: "Западно-Сибирская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 40, isBorder: true, borderLabel: "РЖД ➔ КТЖ" }
    ],
    "iletsk_saryagash": [
      { name: "Илецк I (эксп.)", code: "666501", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Жайсан (эксп.)", code: "666802", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 30 },
      { name: "Мартук", code: "667006", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 65 },
      { name: "Курайлы", code: "667608", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 80 },
      { name: "Актобе", code: "667909", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 30 },
      { name: "Бестамак", code: "668102", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 60 },
      { name: "Алга", code: "668303", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 25 },
      { name: "Тамды", code: "668507", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 45 },
      { name: "Кандыагаш", code: "660007", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 35 },
      { name: "Эмба", code: "669001", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 95 },
      { name: "Мугалжар", code: "669209", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 105 },
      { name: "Биршогыр", code: "669406", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 60 },
      { name: "Шалкар", code: "669904", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 175 },
      { name: "Каукей", code: "670009", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 125 },
      { name: "Саксаульская", code: "670102", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 118 },
      { name: "Аральское Море", code: "670308", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 80 },
      { name: "Камыстыбас", code: "670403", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 80 },
      { name: "Казалинск", code: "670507", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 118 },
      { name: "Майлыбас", code: "670704", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 85 },
      { name: "Тюратам (Байконур)", code: "670901", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 75 },
      { name: "Джусалы", code: "671209", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 98 },
      { name: "Жалагаш", code: "671406", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 82 },
      { name: "Теренозек", code: "671500", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 64 },
      { name: "Кызылорда", code: "671707", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 67 },
      { name: "Берказань", code: "671904", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 55 },
      { name: "Чиили", code: "672127", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 115 },
      { name: "Байгакум", code: "672305", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 58 },
      { name: "Яныкурган", code: "672502", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 93 },
      { name: "Аккум", code: "672703", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 70 },
      { name: "Туркестан", code: "697800", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 93 },
      { name: "Тимур", code: "697904", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 98 },
      { name: "Арысь I", code: "698605", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 106 },
      { name: "Сарыагаш (эксп.)", code: "704101", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 132, isBorder: true, borderLabel: "КТЖ ➔ УТИ" }
    ],
    "lokot_saryagash": [
      { name: "Локоть (эксп.)", code: "711105", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Ауыл (эксп.)", code: "709001", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 18, isBorder: true, borderLabel: "РЖД ➔ КТЖ" },
      { name: "Семей", code: "709406", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 132 },
      { name: "Жана-Семей", code: "709302", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 10 },
      { name: "Шар (Чарская)", code: "709804", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 110 },
      { name: "Жангиз-Тобе", code: "709908", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 55 },
      { name: "Аягоз", code: "707006", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 145 },
      { name: "Актогай", code: "707504", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 165 },
      { name: "Матай", code: "705001", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 180 },
      { name: "Уштобе", code: "705509", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 135 },
      { name: "Сарыозек", code: "705800", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 95 },
      { name: "Капчагай", code: "700505", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 110 },
      { name: "Алматы I", code: "700007", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 70 },
      { name: "Отар", code: "701502", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 140 },
      { name: "Шу (Чу)", code: "701004", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 170 },
      { name: "Турксиб (Луговая)", code: "704506", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 124 },
      { name: "Тараз", code: "706304", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 108 },
      { name: "Тюлькубас", code: "706709", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 146 },
      { name: "Шымкент", code: "698606", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 86 },
      { name: "Арысь I", code: "698605", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 77 },
      { name: "Сарыагаш (эксп.)", code: "704101", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 132, isBorder: true, borderLabel: "КТЖ ➔ УТИ" }
    ],
    "kokshetau_saryagash": [
      { name: "Кокшетау I", code: "687008", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Курорт-Боровое", code: "687205", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 75 },
      { name: "Макинка", code: "687506", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 55 },
      { name: "Акколь (Алексеевка)", code: "687807", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 90 },
      { name: "Шортанды", code: "688104", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 45 },
      { name: "Астана", code: "690002", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 75 },
      { name: "Аршалы (Вишневка)", code: "690407", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 70 },
      { name: "Осакаровка", code: "690708", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 48 },
      { name: "Мырза (Темиртау)", code: "691005", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 57 },
      { name: "Караганда-Сортировочная", code: "673604", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 33 },
      { name: "Караганда", code: "673905", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 14 },
      { name: "Жарык", code: "674403", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 121 },
      { name: "Агадырь", code: "674704", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 74 },
      { name: "Мойынты", code: "675209", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 167 },
      { name: "Чиганак", code: "675707", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 145 },
      { name: "Мынарал", code: "676004", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 54 },
      { name: "Шу (Чу)", code: "701004", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 111 },
      { name: "Турксиб (Луговая)", code: "704506", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 123 },
      { name: "Тараз", code: "706304", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 107 },
      { name: "Тюлькубас", code: "706709", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 145 },
      { name: "Шымкент", code: "698606", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 85 },
      { name: "Бадам", code: "698409", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 18 },
      { name: "Арысь I", code: "698605", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 58 },
      { name: "Сарыагаш (эксп.)", code: "704101", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 131, isBorder: true, borderLabel: "КТЖ ➔ УТИ" }
    ],
    "ural_kartaly_astana": [
      { name: "Екатеринбург-Сортировочный", code: "780108", road: "Свердловская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 0 },
      { name: "Каменск-Уральский", code: "780305", road: "Свердловская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 100 },
      { name: "Челябинск-Главный", code: "800001", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 160 },
      { name: "Троицк", code: "800508", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 125 },
      { name: "Варна", code: "800809", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 65 },
      { name: "Карталы I (эксп.)", code: "801002", road: "Южно-Уральская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 70, isBorder: true, borderLabel: "РЖД ➔ КТЖ" },
      { name: "Тобол (эксп.)", code: "683501", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 145 },
      { name: "Железорудная (Рудный)", code: "683802", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 60 },
      { name: "Костанай", code: "684006", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 40 },
      { name: "Кушмурун", code: "684504", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 120 },
      { name: "Есиль", code: "685009", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 145 },
      { name: "Жалтыр", code: "685507", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 160 },
      { name: "Астана", code: "690002", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 135 }
    ],
    "saryagash_chukursay": [
      { name: "Сарыагаш (эксп.)", code: "704101", road: "Казахстанская ж. д. (КТЖ)", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Келес (эксп.)", code: "720602", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 13, isBorder: true, borderLabel: "КТЖ ➔ УТИ" },
      { name: "Чукурсай", code: "720000", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 12 }
    ],
    "chukursay_bukhara": [
      { name: "Чукурсай", code: "720000", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 0 },
      { name: "Ташкент-Товарный", code: "722400", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 8 },
      { name: "Тукимачи", code: "723511", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 6 },
      { name: "Сергели", code: "723507", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 5 },
      { name: "Янгиер", code: "725409", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 106 },
      { name: "Джизак", code: "726007", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 55 },
      { name: "Галляарал", code: "726308", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 32 },
      { name: "Булунгур", code: "726806", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 48 },
      { name: "Самарканд", code: "727404", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 35 },
      { name: "Каттакурган", code: "728106", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 75 },
      { name: "Навои", code: "729005", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 68 },
      { name: "Бухара II", code: "730101", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 117 }
    ],
    "samarkand_termez_galaba": [
      { name: "Самарканд", code: "727404", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 0 },
      { name: "Карши", code: "732003", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 140 },
      { name: "Дехканабад", code: "732408", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 95 },
      { name: "Ташгузар", code: "732802", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 45 },
      { name: "Кумкурган", code: "734003", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 100 },
      { name: "Термез (эксп.)", code: "735203", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 65 },
      { name: "Галаба (эксп.)", code: "735805", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 45, isBorder: true, borderLabel: "УТИ ➔ АРА (Афганистан)" },
      { name: "Хайратан (эксп.)", code: "000251", road: "Афганская ж. д. (АРА)", country: "AFG", countryName: "Афганистан", dist: 4, isBorder: true, borderLabel: "УТИ ➔ АРА" }
    ],
    "tashkent_andijan": [
      { name: "Ташкент-Товарный", code: "722400", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 0 },
      { name: "Ангрен", code: "724001", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 114 },
      { name: "Пап", code: "740105", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 45 },
      { name: "Коканд", code: "741004", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 81 },
      { name: "Маргилан", code: "742007", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 45 },
      { name: "Андижан I", code: "743004", road: "Узбекская ж. д. (УТИ)", country: "UZB", countryName: "Узбекистан", dist: 45 }
    ],
    "kandyagash_kungrad_urgench": [
      { name: "Кандыагаш", code: "660007", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Шубаркудук", code: "661002", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 85 },
      { name: "Сагиз", code: "661303", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 115 },
      { name: "Макат", code: "662005", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 120 },
      { name: "Кульсары", code: "662402", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 130 },
      { name: "Бейнеу", code: "662700", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 210 },
      { name: "Каракалпакстан (эксп.)", code: "662905", road: "КТЖ / УТИ", country: "UZB", countryName: "Узбекистан", dist: 410, isBorder: true, borderLabel: "КТЖ ➔ УТИ" },
      { name: "Кунград", code: "738305", road: "УТИ", country: "UZB", countryName: "Узбекистан", dist: 110 },
      { name: "Ходжейли", code: "738702", road: "УТИ", country: "UZB", countryName: "Узбекистан", dist: 65 },
      { name: "Нукус", code: "739000", road: "УТИ", country: "UZB", countryName: "Узбекистан", dist: 25 },
      { name: "Ургенч", code: "739509", road: "УТИ", country: "UZB", countryName: "Узбекистан", dist: 150 }
    ],
    "astana_pavlodar": [
      { name: "Астана", code: "690002", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Ерейментау", code: "691503", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 145 },
      { name: "Шидерты", code: "692008", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 110 },
      { name: "Экибастуз I", code: "692309", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 55 },
      { name: "Аксу I", code: "692807", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 115 },
      { name: "Павлодар", code: "693301", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 25 }
    ],
    "makat_atyrau_astrakhan": [
      { name: "Макат", code: "662005", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Доссор", code: "662109", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 30 },
      { name: "Атырау", code: "662306", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 95 },
      { name: "Акколь", code: "662503", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 160 },
      { name: "Ганюшкино (эксп.)", code: "662607", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 140, isBorder: true, borderLabel: "КТЖ ➔ РЖД" },
      { name: "Аксарайская II (эксп.)", code: "618002", road: "Приволжская ж. д.", country: "RUS", countryName: "Россия", dist: 40, isBorder: true, borderLabel: "КТЖ ➔ РЖД" },
      { name: "Астрахань I", code: "618500", road: "Приволжская ж. д.", country: "RUS", countryName: "Россия", dist: 60 }
    ],
    "beyneu_mangyshlak": [
      { name: "Бейнеу", code: "662700", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 0 },
      { name: "Сай-Утес", code: "663004", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 170 },
      { name: "Шетпе", code: "663409", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 130 },
      { name: "Мангышлак (Актау)", code: "663907", road: "КТЖ", country: "KAZ", countryName: "Казахстан", dist: 105 }
    ],
    "moscow_rostov": [
      { name: "Москва-Товарная-Павелецкая", code: "193504", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 0 },
      { name: "Домодедово", code: "193307", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 36 },
      { name: "Кашира", code: "192709", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 75 },
      { name: "Павелец-Тульский", code: "221302", road: "Московская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 150 },
      { name: "Мичуринск-Уральский", code: "222502", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 165 },
      { name: "Воронеж I", code: "250005", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 178 },
      { name: "Лиски", code: "252000", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 98 },
      { name: "Россошь", code: "254006", road: "Юго-Восточная ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 116 },
      { name: "Миллерово", code: "587002", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 154 },
      { name: "Лихая", code: "587207", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 90 },
      { name: "Шахтная", code: "587508", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 65 },
      { name: "Новочеркасск", code: "587809", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 42 },
      { name: "Ростов-Главный", code: "588002", road: "Северо-Кавказская ж. д. (РЖД)", country: "RUS", countryName: "Россия", dist: 51 }
    ]
  };

  function findStationInCorridors(st) {
    var matches = [];
    var stCode = (st.code || "").toString().trim();
    var stClean = cleanStationName(st.name || st);
    var stRoot = getStationRootKey(st.name || st);

    for (var cKey in CORRIDOR_STATION_CHAINS) {
      var chain = CORRIDOR_STATION_CHAINS[cKey];
      for (var idx = 0; idx < chain.length; idx++) {
        var node = chain[idx];
        var nCode = (node.code || "").toString().trim();
        var nClean = cleanStationName(node.name);
        var nRoot = getStationRootKey(node.name);

        if (stCode && nCode && stCode === nCode) {
          matches.push({ key: cKey, index: idx, node: node });
          break;
        }
        if (stClean && nClean && stClean === nClean) {
          matches.push({ key: cKey, index: idx, node: node });
          break;
        }
        if (stRoot && nRoot && stRoot === nRoot) {
          matches.push({ key: cKey, index: idx, node: node });
          break;
        }
      }
    }
    return matches;
  }

  function resolveJunctionStation(st) {
    var code = (st.code || "").toString().trim();
    var name = (st.name || "").toLowerCase();
    if (code.indexOf("00") === 0 || name.indexOf("хайратан") !== -1) return { name: "Галаба (эксп.)", code: "735805", road: "УТИ", country: "UZB", countryName: "Узбекистан" };
    if (code.indexOf("56") === 0 || code.indexOf("57") === 0 || name.indexOf("тбилиси") !== -1 || name.indexOf("поти") !== -1 || name.indexOf("батуми") !== -1) return { name: "Тбилиси-Товарная", code: "560203", road: "ГРЗ", country: "GEO", countryName: "Грузия" };
    if (code.indexOf("54") === 0 || code.indexOf("55") === 0 || name.indexOf("баку") !== -1) return { name: "Баку-Пассажирский", code: "547406", road: "АДЮ", country: "AZE", countryName: "Азербайджан" };
    if (code.indexOf("58") === 0 || name.indexOf("ереван") !== -1) return { name: "Ереван", code: "565103", road: "ЮКЖД", country: "ARM", countryName: "Армения" };
    if (code.indexOf("96") === 0 || code.indexOf("97") === 0 || code.indexOf("98") === 0 || name.indexOf("владивосток") !== -1 || name.indexOf("хабаровск") !== -1) return { name: "Владивосток (эксп.)", code: "980200", road: "РЖД", country: "RUS", countryName: "Россия" };
    if (code.indexOf("83") === 0 || code.indexOf("84") === 0 || code.indexOf("85") === 0 || code.indexOf("87") === 0 || code.indexOf("88") === 0 || code.indexOf("92") === 0 || code.indexOf("93") === 0 || code.indexOf("94") === 0) return { name: "Новосибирск-Главный", code: "850005", road: "РЖД", country: "RUS", countryName: "Россия" };
    if (code.indexOf("61") === 0 || code.indexOf("62") === 0 || name.indexOf("астрахань") !== -1 || name.indexOf("аксарайск") !== -1) return { name: "Аксарайская II (эксп.)", code: "618002", road: "Приволжская ж. д.", country: "RUS", countryName: "Россия" };
    if (code.indexOf("66") === 0) return { name: "Актобе", code: "667909", road: "КТЖ", country: "KAZ", countryName: "Казахстан" };
    if (code.indexOf("67") === 0) return { name: "Кызылорда", code: "671707", road: "КТЖ", country: "KAZ", countryName: "Казахстан" };
    if (code.indexOf("68") === 0) return { name: "Костанай", code: "684006", road: "КТЖ", country: "KAZ", countryName: "Казахстан" };
    if (code.indexOf("698") === 0) return { name: "Шымкент", code: "698606", road: "КТЖ", country: "KAZ", countryName: "Казахстан" };
    if (code.indexOf("69") === 0) return { name: "Астана", code: "690002", road: "КТЖ", country: "KAZ", countryName: "Казахстан" };
    if (code.indexOf("70") === 0) return { name: "Алматы I", code: "700007", road: "КТЖ", country: "KAZ", countryName: "Казахстан" };
    if (code.indexOf("71") === 0) return { name: "Жана-Семей", code: "709302", road: "КТЖ", country: "KAZ", countryName: "Казахстан" };
    if (code.indexOf("72") === 0) return { name: "Чукурсай", code: "720000", road: "УТИ", country: "UZB", countryName: "Узбекистан" };
    if (code.indexOf("73") === 0) return { name: "Самарканд", code: "727404", road: "УТИ", country: "UZB", countryName: "Узбекистан" };
    if (code.indexOf("74") === 0) return { name: "Коканд", code: "741004", road: "УТИ", country: "UZB", countryName: "Узбекистан" };
    if (code.indexOf("75") === 0) return { name: "Ашхабад", code: "750005", road: "ТРК", country: "TKM", countryName: "Туркменистан" };
    if (code.indexOf("13") === 0 || code.indexOf("14") === 0) return { name: "Минск-Сортировочный", code: "140206", road: "БЧ", country: "BLR", countryName: "Беларусь" };
    if (code.indexOf("03") === 0 || code.indexOf("04") === 0 || code.indexOf("05") === 0 || code.indexOf("06") === 0) return { name: "Санкт-Петербург-Тов.-Московский", code: "031808", road: "РЖД", country: "RUS", countryName: "Россия" };
    if (code.indexOf("78") === 0 || code.indexOf("80") === 0) return { name: "Екатеринбург-Сортировочный", code: "780108", road: "РЖД", country: "RUS", countryName: "Россия" };
    return { name: "Москва-Товарная-Павелецкая", code: "193504", road: "РЖД", country: "RUS", countryName: "Россия" };
  }

  function findSharedStation(c1Key, c2Key) {
    var c1 = CORRIDOR_STATION_CHAINS[c1Key];
    var c2 = CORRIDOR_STATION_CHAINS[c2Key];
    if (!c1 || !c2) return null;

    for (var i1 = 0; i1 < c1.length; i1++) {
      var s1 = c1[i1];
      var s1Code = (s1.code || "").toString().trim();
      var s1Clean = cleanStationName(s1.name);
      var s1Root = getStationRootKey(s1.name);

      for (var i2 = 0; i2 < c2.length; i2++) {
        var s2 = c2[i2];
        var s2Code = (s2.code || "").toString().trim();
        var s2Clean = cleanStationName(s2.name);
        var s2Root = getStationRootKey(s2.name);

        if (s1Code && s2Code && s1Code === s2Code) {
          return { idx1: i1, idx2: i2, stop: s1 };
        }
        if (s1Clean && s2Clean && s1Clean === s2Clean) {
          return { idx1: i1, idx2: i2, stop: s1 };
        }
        if (s1Root && s2Root && s1Root === s2Root) {
          return { idx1: i1, idx2: i2, stop: s1 };
        }
      }
    }
    return null;
  }

  function findCorridorPath(startCorrs, endCorrs) {
    for (var s = 0; s < startCorrs.length; s++) {
      if (endCorrs.indexOf(startCorrs[s]) !== -1) {
        return [startCorrs[s]];
      }
    }

    var queue = [];
    var visited = {};
    for (var s = 0; s < startCorrs.length; s++) {
      queue.push([startCorrs[s]]);
      visited[startCorrs[s]] = true;
    }

    while (queue.length > 0) {
      var path = queue.shift();
      var curr = path[path.length - 1];

      if (endCorrs.indexOf(curr) !== -1) {
        return path;
      }

      for (var nextC in CORRIDOR_STATION_CHAINS) {
        if (!visited[nextC]) {
          var shared = findSharedStation(curr, nextC);
          if (shared) {
            visited[nextC] = true;
            var newPath = path.slice();
            newPath.push(nextC);
            queue.push(newPath);
          }
        }
      }
    }
    return null;
  }

  function sliceCorridor(cKey, fromIdx, toIdx) {
    var chain = CORRIDOR_STATION_CHAINS[cKey];
    var result = [];
    if (fromIdx <= toIdx) {
      for (var i = fromIdx; i <= toIdx; i++) {
        result.push(Object.assign({}, chain[i]));
      }
    } else {
      for (var i = fromIdx; i >= toIdx; i--) {
        result.push(Object.assign({}, chain[i]));
      }
    }
    return result;
  }

  function calculateDistanceAcrossCorridors(fromSt, toSt) {
    if (!fromSt || !toSt) return 0;
    var fObj = (typeof fromSt === 'object' && fromSt !== null) ? fromSt : (findStation(fromSt) || { name: fromSt });
    var tObj = (typeof toSt === 'object' && toSt !== null) ? toSt : (findStation(toSt) || { name: toSt });

    var fClean = cleanStationName(fObj.name || fObj);
    var tClean = cleanStationName(tObj.name || tObj);
    var fRoot = getStationRootKey(fObj.name || fObj);
    var tRoot = getStationRootKey(tObj.name || tObj);
    if (fClean === tClean || (fRoot && tRoot && fRoot === tRoot)) return 0;

    var fMatches = findStationInCorridors(fObj);
    var tMatches = findStationInCorridors(tObj);

    var extraDist = 0;
    if (fMatches.length === 0) {
      var jf = resolveJunctionStation(fObj);
      fMatches = findStationInCorridors(jf);
      extraDist += 30;
    }
    if (tMatches.length === 0) {
      var jt = resolveJunctionStation(tObj);
      tMatches = findStationInCorridors(jt);
      extraDist += 30;
    }
    if (fMatches.length === 0 || tMatches.length === 0) return 0;

    var fCorrs = [];
    fMatches.forEach(function(m) { if (fCorrs.indexOf(m.key) === -1) fCorrs.push(m.key); });
    var tCorrs = [];
    tMatches.forEach(function(m) { if (tCorrs.indexOf(m.key) === -1) tCorrs.push(m.key); });

    var path = findCorridorPath(fCorrs, tCorrs);
    if (!path || path.length === 0) return 0;

    var total = 0;
    if (path.length === 1) {
      var cKey = path[0];
      var sIdx = -1, eIdx = -1;
      for (var i = 0; i < fMatches.length; i++) { if (fMatches[i].key === cKey) { sIdx = fMatches[i].index; break; } }
      for (var j = 0; j < tMatches.length; j++) { if (tMatches[j].key === cKey) { eIdx = tMatches[j].index; break; } }
      if (sIdx !== -1 && eIdx !== -1) {
        var sl = sliceCorridor(cKey, sIdx, eIdx);
        for (var k = 1; k < sl.length; k++) total += (sl[k].dist || 0);
      }
    } else {
      for (var p = 0; p < path.length; p++) {
        var curr = path[p];
        var sIdx = -1, eIdx = -1;
        if (p === 0) {
          for (var i = 0; i < fMatches.length; i++) { if (fMatches[i].key === curr) { sIdx = fMatches[i].index; break; } }
          var next = path[p + 1];
          var shared = findSharedStation(curr, next);
          if (shared) {
            var ch = CORRIDOR_STATION_CHAINS[curr];
            for (var c = 0; c < ch.length; c++) {
              if (cleanStationName(ch[c].name) === cleanStationName(shared.stop.name)) { eIdx = c; break; }
            }
          }
        } else if (p === path.length - 1) {
          var prev = path[p - 1];
          var sharedPrev = findSharedStation(prev, curr);
          if (sharedPrev) {
            var ch = CORRIDOR_STATION_CHAINS[curr];
            for (var c = 0; c < ch.length; c++) {
              if (cleanStationName(ch[c].name) === cleanStationName(sharedPrev.stop.name)) { sIdx = c; break; }
            }
          }
          for (var j = 0; j < tMatches.length; j++) { if (tMatches[j].key === curr) { eIdx = tMatches[j].index; break; } }
        } else {
          var prev = path[p - 1];
          var next = path[p + 1];
          var sp = findSharedStation(prev, curr);
          var sn = findSharedStation(curr, next);
          var ch = CORRIDOR_STATION_CHAINS[curr];
          for (var c = 0; c < ch.length; c++) {
            if (cleanStationName(ch[c].name) === cleanStationName(sp.stop.name)) sIdx = c;
            if (cleanStationName(ch[c].name) === cleanStationName(sn.stop.name)) eIdx = c;
          }
        }
        if (sIdx !== -1 && eIdx !== -1) {
          var sl = sliceCorridor(curr, sIdx, eIdx);
          for (var k = 1; k < sl.length; k++) total += (sl[k].dist || 0);
        }
      }
    }
    return total > 0 ? (total + extraDist) : 0;
  }

  // УНИВЕРСАЛЬНЫЙ ТОПОЛОГИЧЕСКИЙ МНОГОКОРИДОРНЫЙ ГЕНЕРАТОР МАРШРУТНОГО ЛИСТА
  function buildRouteItinerary(fromSt, toSt, legs, border1, border2) {
    var originObj = (typeof fromSt === 'object' && fromSt !== null) ? fromSt : (findStation(fromSt) || { name: fromSt, code: "193504", road_label: "РЖД", country: "RUS", country_name: "Россия" });
    var destObj = (typeof toSt === 'object' && toSt !== null) ? toSt : (findStation(toSt) || { name: toSt, code: "720000", road_label: "УТИ", country: "UZB", country_name: "Узбекистан" });

    var targetTotalKm = 0;
    if (Array.isArray(legs) && legs.length > 0) {
      legs.forEach(function(leg) { targetTotalKm += (leg.distanceKm || 0); });
    }
    if (!targetTotalKm || targetTotalKm <= 0) {
      targetTotalKm = resolveLegDistance(originObj, destObj) || 1000;
    }

    var origClean = cleanStationName(originObj.name || originObj);
    var destClean = cleanStationName(destObj.name || destObj);
    var origCode = (originObj.code || "").toString().trim();
    var destCode = (destObj.code || "").toString().trim();

    if (origClean === destClean || (origCode && origCode === destCode)) {
      return [{
        seq: 1,
        code: origCode || "193504",
        name: originObj.name,
        road: originObj.road_label || "Магистраль 1520",
        country: originObj.country || "RUS",
        countryName: originObj.country_name || "Россия",
        segmentKm: 0,
        cumulativeKm: 0,
        isOrigin: true,
        isDestination: true,
        isBorder: false,
        borderLabel: ""
      }];
    }

    function getCorridorChainSegment(sFrom, sTo) {
      var fStObj = (typeof sFrom === 'object' && sFrom !== null) ? sFrom : (findStation(sFrom) || { name: sFrom });
      var tStObj = (typeof sTo === 'object' && sTo !== null) ? sTo : (findStation(sTo) || { name: sTo });

      var fMatches = findStationInCorridors(fStObj);
      var tMatches = findStationInCorridors(tStObj);
      var preFeeder = null;
      var appFeeder = null;

      if (fMatches.length === 0) {
        var jf = resolveJunctionStation(fStObj);
        fMatches = findStationInCorridors(jf);
        preFeeder = Object.assign({}, fStObj, { dist: 0, segmentKm: 0 });
      }
      if (tMatches.length === 0) {
        var jt = resolveJunctionStation(tStObj);
        tMatches = findStationInCorridors(jt);
        appFeeder = Object.assign({}, tStObj, { dist: 25 });
      }
      if (fMatches.length === 0 || tMatches.length === 0) {
        return [Object.assign({}, fStObj, { dist: 0 }), Object.assign({}, tStObj, { dist: 25 })];
      }

      var fCorrs = [];
      fMatches.forEach(function(m) { if (fCorrs.indexOf(m.key) === -1) fCorrs.push(m.key); });
      var tCorrs = [];
      tMatches.forEach(function(m) { if (tCorrs.indexOf(m.key) === -1) tCorrs.push(m.key); });

      var path = findCorridorPath(fCorrs, tCorrs);
      if (!path || path.length === 0) {
        return [Object.assign({}, fStObj, { dist: 0 }), Object.assign({}, tStObj, { dist: 25 })];
      }

      var chainSeg = [];
      if (path.length === 1) {
        var cKey = path[0];
        var sIdx = -1, eIdx = -1;
        for (var i = 0; i < fMatches.length; i++) { if (fMatches[i].key === cKey) { sIdx = fMatches[i].index; break; } }
        for (var j = 0; j < tMatches.length; j++) { if (tMatches[j].key === cKey) { eIdx = tMatches[j].index; break; } }
        chainSeg = sliceCorridor(cKey, sIdx >= 0 ? sIdx : 0, eIdx >= 0 ? eIdx : (CORRIDOR_STATION_CHAINS[cKey].length - 1));
      } else {
        for (var p = 0; p < path.length; p++) {
          var curr = path[p];
          if (p === 0) {
            var sIdx = -1;
            for (var i = 0; i < fMatches.length; i++) { if (fMatches[i].key === curr) { sIdx = fMatches[i].index; break; } }
            var shared = findSharedStation(curr, path[p + 1]);
            chainSeg = chainSeg.concat(sliceCorridor(curr, sIdx >= 0 ? sIdx : 0, shared ? shared.idx1 : (CORRIDOR_STATION_CHAINS[curr].length - 1)));
          } else if (p === path.length - 1) {
            var shared = findSharedStation(path[p - 1], curr);
            var eIdx = -1;
            for (var j = 0; j < tMatches.length; j++) { if (tMatches[j].key === curr) { eIdx = tMatches[j].index; break; } }
            var seg = sliceCorridor(curr, shared ? shared.idx2 : 0, eIdx >= 0 ? eIdx : (CORRIDOR_STATION_CHAINS[curr].length - 1));
            chainSeg = chainSeg.concat(seg.slice(1));
          } else {
            var shPrev = findSharedStation(path[p - 1], curr);
            var shNext = findSharedStation(curr, path[p + 1]);
            var seg = sliceCorridor(curr, shPrev ? shPrev.idx2 : 0, shNext ? shNext.idx1 : (CORRIDOR_STATION_CHAINS[curr].length - 1));
            chainSeg = chainSeg.concat(seg.slice(1));
          }
        }
      }

      if (preFeeder) chainSeg.unshift(preFeeder);
      if (appFeeder) chainSeg.push(appFeeder);
      return chainSeg;
    }

    var stitched = [];

    // ПОУЧАСТКОВАЯ СБОРКА СТАНЦИЙ: если маршрут разбит на участки
    if (Array.isArray(legs) && legs.length > 1) {
      for (var l = 0; l < legs.length; l++) {
        var leg = legs[l];
        var lStart = (l === 0) ? originObj : (findStation(leg.from) || leg.from);
        var lEnd = (l === legs.length - 1) ? destObj : (findStation(leg.to) || leg.to);
        var seg = getCorridorChainSegment(lStart, lEnd);

        if (seg && seg.length > 0) {
          var legKm = leg.distanceKm || 100;
          var segRaw = 0;
          for (var sk = 1; sk < seg.length; sk++) segRaw += (seg[sk].dist || 25);
          if (segRaw > 0 && seg.length > 1) {
            var scSum = 0;
            var maxD = 0;
            var maxDIdx = 1;
            for (var sk = 1; sk < seg.length; sk++) {
              var sc = Math.round((seg[sk].dist || 25) * legKm / segRaw);
              if (sc < 1) sc = 1;
              seg[sk].dist = sc;
              scSum += sc;
              if (sc > maxD) { maxD = sc; maxDIdx = sk; }
            }
            seg[maxDIdx].dist += (legKm - scSum);
          }

          if (stitched.length === 0) {
            stitched = seg;
          } else {
            stitched = stitched.concat(seg.slice(1));
          }
        }
      }
    }

    // Резервная сквозная сборка (для простых или одноучастковых маршрутов)
    if (stitched.length < 2) {
      stitched = getCorridorChainSegment(originObj, destObj);
      var rawSum = 0;
      for (var k = 1; k < stitched.length; k++) rawSum += (stitched[k].dist || 25);
      if (rawSum > 0 && stitched.length > 1) {
        var scaledSum = 0;
        var maxVal = 0;
        var maxIdx = 1;
        for (var k = 1; k < stitched.length; k++) {
          var scaled = Math.round((stitched[k].dist || 25) * targetTotalKm / rawSum);
          if (scaled < 1) scaled = 1;
          stitched[k].dist = scaled;
          scaledSum += scaled;
          if (scaled > maxVal) { maxVal = scaled; maxIdx = k; }
        }
        stitched[maxIdx].dist += (targetTotalKm - scaledSum);
      }
    }

    var result = [];
    var cumKm = 0;

    for (var idx = 0; idx < stitched.length; idx++) {
      var item = stitched[idx];
      var distStep = (idx === 0) ? 0 : (item.dist || 0);
      cumKm += distStep;

      var stDetail = findStation(item.code || item.name) || item;
      var isBorder = !!(item.isBorder || item.borderLabel || stDetail.is_border);
      var borderLbl = item.borderLabel || "";

      if (!borderLbl && isBorder) {
        if (stDetail.name.indexOf("Илецк") !== -1 || stDetail.name.indexOf("Озинки") !== -1 || stDetail.name.indexOf("Локоть") !== -1) {
          borderLbl = "Стык РЖД ➔ КТЖ";
        } else if (stDetail.name.indexOf("Сарыагаш") !== -1 || stDetail.name.indexOf("Келес") !== -1) {
          borderLbl = "Стык КТЖ ➔ УТИ";
        } else if (stDetail.name.indexOf("Галаба") !== -1 || stDetail.name.indexOf("Хайратан") !== -1) {
          borderLbl = "Стык УТИ ➔ АРА";
        } else if (stDetail.name.indexOf("Гардабани") !== -1 || stDetail.name.indexOf("Беюк") !== -1) {
          borderLbl = "Стык АДЮ ➔ ГРЗ";
        } else if (stDetail.name.indexOf("Ялама") !== -1 || stDetail.name.indexOf("Самур") !== -1) {
          borderLbl = "Стык АДЮ ➔ РЖД";
        } else {
          borderLbl = "Пограничный стык";
        }
      }

      result.push({
        seq: idx + 1,
        code: stDetail.code || item.code || "",
        name: (idx === 0) ? originObj.name : ((idx === stitched.length - 1) ? destObj.name : (stDetail.name || item.name)),
        road: stDetail.road_label || item.road || "Магистраль 1520",
        country: stDetail.country || item.country || "RUS",
        countryName: stDetail.country_name || item.countryName || "Россия",
        segmentKm: distStep,
        cumulativeKm: cumKm,
        isOrigin: (idx === 0),
        isDestination: (idx === stitched.length - 1),
        isBorder: isBorder,
        borderLabel: borderLbl
      });
    }

    return result;
  }

  // 8. ГЛАВНЫЙ МЕТОД РАСЧЕТА ТАРИФОВ (CALCULATE TARIFF)
  function calculateTariff(params) {
    params = params || {};
    var fromStation = findStation(params.from) || STATIONS[0];
    var toStation = findStation(params.to) || STATIONS[1];
    var wagonType = ROLLING_STOCK[params.wagonType] || ROLLING_STOCK['grain'];
    var cargoItem = findCargo(params.cargoSearch || params.cargoType);
    var parkType = params.parkType || 'caravan';
    var incoterms = (params.incoterms || 'DAP').toUpperCase();
    var hasSecurity = params.security === true || params.security === 'true' || cargoItem.security_required;
    var hasCustoms = params.customs === true || params.customs === 'true';
    var discountPercent = parseFloat(params.discount) || 0;

    var isTransitPair = (fromStation.country === 'RUS' && toStation.country === 'UZB') ||
                        (fromStation.country === 'UZB' && toStation.country === 'RUS');

    var b1Arg = isTransitPair ? (params.manualBorder1 || (params.manualBorderCode && params.manualBorderCode.border1)) : (params.manualBorderCode || params.manualBorder1);
    var b2Arg = params.manualBorder2 || (params.manualBorderCode && params.manualBorderCode.border2);

    var routePlan = determineRouteLegs(fromStation, toStation, b1Arg, b2Arg);
    var totalKm = 0;
    var detailedLegs = [];
    var totalInfraUSD = 0;
    var totalWagonUSD = 0;
    var totalBorderFeesUSD = 0;
    var totalSecurityUSD = 0;

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

    // Построение постанционного маршрутного листа по ТР4 (Рейл-Тариф)
    var fullItinerary = buildRouteItinerary(fromStation, toStation, detailedLegs, routePlan.border1, routePlan.border2);
    if (fullItinerary && fullItinerary.length > 2) {
      var itinDist = fullItinerary[fullItinerary.length - 1].cumulativeKm;
      if (itinDist > 0) {
        totalKm = itinDist;
      }
    }

    var transitDaysMin = Math.ceil(totalKm / wagonType.speedKmPerDay) + 1;
    var transitDaysMax = transitDaysMin + 2;
    var transitStr = transitDaysMin + '-' + transitDaysMax + ' суток';

    var cur = CURRENCY_RATES[params.currency || 'USD'] || CURRENCY_RATES['USD'];
    var convertedTotal = Math.round(grandTotalUSD * cur.rate);

    return {
      fromStation: fromStation,
      toStation: toStation,
      wagonType: wagonType,
      cargoItem: cargoItem,
      incoterms: incoterms,
      totalKm: totalKm,
      transitDaysStr: transitStr,
      totalCostUSD: grandTotalUSD,
      infraUSD: totalInfraUSD,
      wagonUSD: totalWagonUSD,
      borderFeesUSD: totalBorderFeesUSD,
      securityUSD: totalSecurityUSD,
      incotermsFeeUSD: incotermsFeeUSD,
      legs: detailedLegs,
      routePlan: routePlan,
      itinerary: fullItinerary,
      currency: cur.code,
      currencyRate: cur.rate,
      totalCostLocal: convertedTotal,
      isDomestic: (fromStation.country === toStation.country),
      isTransit: routePlan.isTransit
    };
  }
  return {
    STATIONS: STATIONS,
    CARGO_ITEMS: CARGO_ITEMS,
    BORDER_CROSSINGS: BORDER_CROSSINGS,
    CANONICAL_DISTANCES: CANONICAL_DISTANCES,
    RAILWAY_GRAPH: RAILWAY_GRAPH,
    ROLLING_STOCK: ROLLING_STOCK,
    CURRENCY_RATES: CURRENCY_RATES,
    findStation: findStation,
    searchStations: searchStations,
    findCargo: findCargo,
    searchCargo: searchCargo,
    resolveLegDistance: resolveLegDistance,
    determineRouteLegs: determineRouteLegs,
    calculateTariff: calculateTariff
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CaravanRailwayEngine;
}
if (typeof window !== 'undefined') {
  window.CaravanRailwayEngine = CaravanRailwayEngine;
}
