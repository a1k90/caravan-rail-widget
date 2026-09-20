/**
 * =========================================================================
 * CARAVAN RAILROAD — Google Apps Script API для Tilda & B2B Bridge
 * =========================================================================
 * Данный скрипт развертывается как Веб-приложение (Web App) внутри Google Таблицы.
 * Поддерживает:
 *  1. action=stats       — получение 3 динамических показателей компании
 *  2. action=track       — быстрый поиск дислокации по номеру вагона/контейнера
 *  3. action=login       — авторизация клиента, выдача вагонов, скидки и коммерческих предложений (КП)
 *  4. action=register    — регистрация нового контрагента
 *  5. action=routes      — регулярные направления с обновляемыми ставками
 *  6. action=calculate   — расчет тарифов по прейскуранту с учетом Incoterms 2020 (DAP, CIP, DDP, FCA)
 *  7. action=order       — сохранение заявки/бронирования и синхронизация с B2B платформой
 * =========================================================================
 */

// URL вебхука вашей B2B платформы (оставьте пустым или укажите URL, когда платформа будет готова)
var B2B_WEBHOOK_URL = ""; 

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var params = e ? e.parameter : {};
  var action = params.action || '';
  
  if (e && e.postData && e.postData.contents) {
    try {
      var postJson = JSON.parse(e.postData.contents);
      for (var key in postJson) {
        params[key] = postJson[key];
      }
      if (postJson.action) action = postJson.action;
    } catch(err) {}
  }

  var responseData = { success: false, message: 'Неизвестное действие' };

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'stats') {
      responseData = getMetrics(ss);
    } else if (action === 'track') {
      var cargoId = (params.id || '').trim();
      var clientLogin = (params.login || params.client_login || '').trim();
      responseData = trackCargo(ss, cargoId, clientLogin);
    } else if (action === 'login') {
      var login = (params.login || '').trim();
      var pass = (params.password || '').trim();
      responseData = clientLogin(ss, login, pass);
    } else if (action === 'register') {
      responseData = registerClient(ss, params);
    } else if (action === 'routes') {
      responseData = getRegularRoutes(ss);
    } else if (action === 'calculate') {
      responseData = calculateFreightRate(ss, params);
    } else if (action === 'order') {
      responseData = saveBookingOrder(ss, params);
    } else {
      responseData = {
        success: true,
        message: 'Caravan Railroad API активен',
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    responseData = {
      success: false,
      error: error.toString()
    };
  }

  var output = ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * 1. Получение 3 динамических метрик компании
 */
function getMetrics(ss) {
  var sheet = ss.getSheetByName('Metrics');
  if (!sheet) {
    return {
      success: true,
      data: {
        wagons: 1480,
        tonnage: 920000,
        routes: 48,
        updated_at: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }
    };
  }

  var data = sheet.getDataRange().getValues();
  var metrics = {};
  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][0]).trim();
    var val = data[i][1];
    metrics[key] = val;
  }

  return {
    success: true,
    data: {
      wagons: metrics['wagons_in_transit'] || 1480,
      tonnage: metrics['cargo_tonnage'] || 920000,
      routes: metrics['routes_count'] || 48,
      updated_at: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
  };
}

/**
 * 2. Поиск дислокации по номеру вагона/контейнера/накладной (с проверкой прав доступа)
 */
function trackCargo(ss, cargoId, clientLogin) {
  if (!clientLogin) {
    return {
      success: false,
      require_auth: true,
      message: 'Отслеживание дислокации доступно только после авторизации в личном кабинете.'
    };
  }

  if (!cargoId) {
    return { success: false, message: 'Укажите номер вагона, контейнера или накладной' };
  }

  var sheet = ss.getSheetByName('Dislocation');
  if (!sheet) {
    return { success: false, message: 'Лист Dislocation не найден' };
  }

  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) {
    return { success: false, message: 'База дислокации пуста' };
  }

  var cleanQuery = cargoId.toLowerCase().replace(/[\s\-_]/g, '');
  var foundRow = null;

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var rowId = String(row[0] || '').toLowerCase().replace(/[\s\-_]/g, '');
    var rowInvoice = String(row[3] || '').toLowerCase().replace(/[\s\-_]/g, '');

    if (rowId === cleanQuery || rowInvoice === cleanQuery || rowId.indexOf(cleanQuery) !== -1) {
      foundRow = row;
      break;
    }
  }

  if (!foundRow) {
    return {
      success: false,
      message: 'Подвижной состав или накладная с номером "' + cargoId + '" не найдены в дислокации Caravan Railroad.'
    };
  }

  // ПРОВЕРКА ПРИНАДЛЕЖНОСТИ ТРАНСПОРТА:
  // Колонка C (индекс 2) содержит client_login привязанного клиента
  var cargoOwnerLogin = String(foundRow[2] || '').trim().toLowerCase();
  var callerLogin = String(clientLogin || '').trim().toLowerCase();

  if (cargoOwnerLogin && callerLogin && cargoOwnerLogin !== callerLogin) {
    return {
      success: false,
      access_denied: true,
      message: 'Доступ ограничен: подвижной состав № ' + cargoId + ' не числится за вашей организацией. Вы можете отслеживать только прикрепленный подвижной состав.'
    };
  }

  return {
    success: true,
    data: formatDislocationRow(foundRow)
  };
}

/**
 * 3. Авторизация клиента, выдача дислокации и коммерческих предложений (КП)
 */
function clientLogin(ss, login, password) {
  if (!login || !password) {
    return { success: false, message: 'Введите логин и пароль' };
  }

  var usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) {
    return { success: false, message: 'Таблица пользователей не найдена' };
  }

  var userRows = usersSheet.getDataRange().getValues();
  var foundUser = null;

  for (var i = 1; i < userRows.length; i++) {
    var uLogin = String(userRows[i][0]).trim().toLowerCase();
    var uPass = String(userRows[i][1]).trim();
    if (uLogin === login.toLowerCase() && uPass === password) {
      foundUser = {
        login: userRows[i][0],
        company: userRows[i][2],
        contact_person: userRows[i][3],
        phone: userRows[i][4],
        email: userRows[i][5],
        role: userRows[i][6] || 'Грузоотправитель',
        discount: parseFloat(userRows[i][7]) || 0,
        b2b_client_id: userRows[i][8] || ('B2B-CR-' + Math.floor(1000 + Math.random() * 9000)),
        status: userRows[i][9] || 'Активен'
      };
      break;
    }
  }

  if (!foundUser) {
    return { success: false, message: 'Неверный логин или пароль клиента' };
  }

  // Получаем вагоны
  var dislocSheet = ss.getSheetByName('Dislocation');
  var clientWagons = [];
  if (dislocSheet) {
    var dislocRows = dislocSheet.getDataRange().getValues();
    for (var j = 1; j < dislocRows.length; j++) {
      if (String(dislocRows[j][2]).trim().toLowerCase() === login.toLowerCase()) {
        clientWagons.push(formatDislocationRow(dislocRows[j]));
      }
    }
  }

  // Получаем коммерческие предложения и заказы (Orders) этого клиента
  var ordersSheet = ss.getSheetByName('Orders');
  var clientProposals = [];
  if (ordersSheet) {
    var oRows = ordersSheet.getDataRange().getValues();
    for (var k = 1; k < oRows.length; k++) {
      var oLogin = String(oRows[k][2] || '').trim().toLowerCase();
      if (oLogin === login.toLowerCase()) {
        clientProposals.push({
          order_id: String(oRows[k][0] || ''),
          date: String(oRows[k][1] || ''),
          company: String(oRows[k][5] || ''),
          role: String(oRows[k][6] || 'Грузоотправитель'),
          incoterms: String(oRows[k][7] || 'DAP'),
          route: String(oRows[k][8] || '') + ' ➔ ' + String(oRows[k][9] || ''),
          transport: String(oRows[k][10] || ''),
          freight_type: String(oRows[k][11] || ''),
          distance_km: oRows[k][12],
          total_price: String(oRows[k][13] || ''),
          kp_status: String(oRows[k][14] || 'КП подписано'),
          kp_pdf_url: String(oRows[k][15] || '#')
        });
      }
    }
  }

  // Если у пользователя пока нет записей в таблице Orders, выдаем тестовое подтвержденное КП
  if (clientProposals.length === 0) {
    clientProposals = getDefaultProposals(foundUser);
  }

  return {
    success: true,
    user: foundUser,
    shipments: clientWagons,
    proposals: clientProposals
  };
}

/**
 * 4. Регистрация нового контрагента
 */
function registerClient(ss, p) {
  var login = (p.login || '').trim();
  var password = (p.password || '').trim();
  var company = (p.company || '').trim();
  var contact = (p.contact || '').trim();
  var phone = (p.phone || '').trim();
  var email = (p.email || '').trim();
  var role = (p.role || 'Грузоотправитель').trim();

  if (!login || !password || !phone) {
    return { success: false, message: 'Пожалуйста, заполните логин, пароль и телефон' };
  }

  var usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) {
    usersSheet = ss.insertSheet('Users');
    usersSheet.appendRow(['login', 'password', 'company_name', 'contact_person', 'phone', 'email', 'client_role', 'discount_percent', 'b2b_client_id', 'status', 'created_at']);
  }

  var rows = usersSheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === login.toLowerCase()) {
      return { success: false, message: 'Пользователь с таким логином уже зарегистрирован' };
    }
  }

  var b2bId = 'B2B-CR-' + Math.floor(1000 + Math.random() * 9000);

  usersSheet.appendRow([
    login,
    password,
    company,
    contact,
    phone,
    email,
    role,
    0,
    b2bId,
    'На модерации',
    new Date().toISOString()
  ]);

  // Дублирование в B2B платформу, если настроен вебхук
  forwardToB2BPlatform({
    type: 'user_registered',
    login: login,
    company: company,
    contact: contact,
    phone: phone,
    email: email,
    role: role,
    b2b_id: b2bId
  });

  return {
    success: true,
    message: 'Заявка на регистрацию принята! Учетная запись синхронизируется с B2B платформой Caravan Railroad.'
  };
}

/**
 * 5. Регулярные маршруты
 */
function getRegularRoutes(ss) {
  var sheet = ss.getSheetByName('Routes');
  if (!sheet) {
    return { success: true, routes: getDefaultRoutes() };
  }

  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) {
    return { success: true, routes: getDefaultRoutes() };
  }

  var routes = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (r[0] || r[1]) {
      routes.push({
        id: String(r[0] || ('R-' + i)),
        from: String(r[1] || ''),
        to: String(r[2] || ''),
        distance_km: parseInt(r[3]) || 0,
        transport: String(r[4] || 'Контейнер 40ft HQ'),
        freight_type: String(r[5] || 'Ж/Д перевозка'),
        incoterms: String(r[6] || 'DAP'),
        price_usd: parseFloat(r[7]) || 0,
        transit_days: String(r[8] || '6-8 дней'),
        included: String(r[9] || 'Полный Ж/Д тариф и экспедирование')
      });
    }
  }

  return { success: true, routes: routes };
}

/**
 * 6. Расчет произвольного маршрута по прейскуранту и Incoterms 2020 (R-Тариф 1520 мм)
 */
function calculateFreightRate(ss, p) {
  var km = Math.max(100, parseInt(p.distance_km) || 1805);
  var transportCode = p.transport_code || 'grain';
  var parkType = p.park_type || 'caravan';
  var cargoCode = p.cargo_type || 'grain';
  var freightType = p.freight_type || 'rail'; 
  var incoterms = (p.incoterms || 'DAP').toUpperCase();
  var clientRole = p.client_role || 'shipper';
  var hasSecurity = p.security === 'true' || p.security === true;
  var hasCustoms = p.customs === 'true' || p.customs === true;
  var discount = parseFloat(p.discount) || 0;
  var currency = (p.currency || 'USD').toUpperCase();

  var rateMap = {
    'gondola': { name: 'Полувагон (универсальный, 70 тн)', rate: 0.44, daily: 32, speed: 380 },
    'boxcar': { name: 'Крытый вагон (грузовой, 68 тн)', rate: 0.46, daily: 38, speed: 380 },
    'grain': { name: 'Зерновоз / Хоппер (70 тн)', rate: 0.48, daily: 42, speed: 360 },
    'tank': { name: 'Цистерна (наливные грузы, 66 тн)', rate: 0.52, daily: 45, speed: 350 },
    'platform': { name: 'Фитинговая платформа (для КТК)', rate: 0.42, daily: 30, speed: 420 },
    'cont20': { name: 'Контейнер 20ft', rate: 0.38, daily: 18, speed: 450 },
    'cont40': { name: 'Контейнер 40ft HQ', rate: 0.55, daily: 28, speed: 480 }
  };

  var cargoMap = {
    'grain': { name: 'Зерновые культуры (пшеница, мука, ячмень)', factor: 1.00 },
    'metals': { name: 'Черные и цветные металлы, металлопрокат', factor: 1.05 },
    'minerals': { name: 'Каменный уголь, руда, сырье', factor: 0.88 },
    'building': { name: 'Цемент, стройматериалы', factor: 0.95 },
    'oil': { name: 'Нефтепродукты, мазут, ГСМ', factor: 1.15 },
    'machinery': { name: 'Оборудование, техника', factor: 1.25 },
    'consumer': { name: 'ТНП, сборный груз', factor: 1.20 },
    'dangerous': { name: 'Опасные грузы (ADR)', factor: 1.35 }
  };

  var curRates = {
    'USD': { rate: 1.0, sym: '$' },
    'KZT': { rate: 485.0, sym: '₸' },
    'UZS': { rate: 12750.0, sym: 'сум' },
    'RUB': { rate: 92.5, sym: '₽' }
  };

  var item = rateMap[transportCode] || rateMap['cont40'];
  var cargoItem = cargoMap[cargoCode] || cargoMap['grain'];
  var modeFactor = (freightType === 'multimodal') ? 1.25 : ((freightType === 'intermodal') ? 1.35 : 1.0);

  // 1. Ж/Д тариф инфраструктуры (поясная дифференциация R-Тариф)
  var infraTariff = Math.round(km * item.rate * cargoItem.factor * modeFactor);

  // 2. Вагонная составляющая (предоставление СПС Caravan Railroad)
  var daysOnWay = Math.ceil(km / item.speed) + 2;
  var wagonProvision = (parkType === 'caravan') ? Math.round(daysOnWay * item.daily * 1.35) : Math.round(infraTariff * 0.45);

  // 3. Сборы за погранпереход и оформление СМГС
  var borderFees = 85 + 45; // Стык + оформление накладной СМГС

  // 4. Incoterms 2020
  var incotermsCost = 0;
  var incotermsNote = "";
  if (incoterms === 'DDP') {
    incotermsCost = 480;
    incotermsNote = "Полный цикл «Под ключ»: забор, Ж/Д перевозка, таможенная очистка и доставка «до двери» получателя";
  } else if (incoterms === 'DAP') {
    incotermsCost = 280;
    incotermsNote = "Доставка до склада получателя (терминал назначения + автодоставка последней мили)";
  } else if (incoterms === 'CIP') {
    incotermsCost = 160;
    incotermsNote = "Оплата фрахта до станции назначения + полное страхование груза (110% стоимости)";
  } else if (incoterms === 'CPT') {
    incotermsCost = 90;
    incotermsNote = "Перевозка оплачена до станции / терминала назначения";
  } else if (incoterms === 'FCA') {
    incotermsCost = 0;
    incotermsNote = "Прием груза на согласованном Ж/Д терминале отправления Caravan Railroad";
  }

  var securityCost = hasSecurity ? (Math.round(km * 0.08) + 45) : 0;
  var customsCost = (hasCustoms && incoterms !== 'DDP') ? 150 : 0;

  var totalUSD = Math.round(infraTariff + wagonProvision + borderFees + incotermsCost + securityCost + customsCost);
  if (discount > 0) {
    totalUSD = Math.round(totalUSD * (1 - discount / 100));
  }

  var curObj = curRates[currency] || curRates['USD'];
  var totalConverted = Math.round(totalUSD * curObj.rate);

  var transitDaysMin = Math.max(2, Math.round(km / (item.speed * 1.15)) + 1);
  var transitDaysMax = Math.max(transitDaysMin + 2, Math.round(km / (item.speed * 0.85)) + 2);

  return {
    success: true,
    data: {
      from: p.from || 'ст. Кокшетау',
      to: p.to || 'ст. Ташкент-Товарный',
      transport_name: item.name,
      park_type: parkType === 'caravan' ? 'Собственный парк СПС (Caravan Railroad)' : 'Инвентарный парк',
      cargo_name: cargoItem.name,
      distance_km: km,
      freight_type: freightType,
      incoterms: incoterms,
      incoterms_note: incotermsNote,
      client_role: clientRole,
      breakdown_usd: {
        infra_tariff: infraTariff,
        wagon_provision: wagonProvision,
        border_and_docs: borderFees,
        incoterms_fees: incotermsCost,
        security_and_customs: securityCost + customsCost
      },
      total_price_usd: totalUSD,
      currency: currency,
      total_converted: totalConverted,
      formatted_total: totalConverted.toLocaleString('ru-RU') + ' ' + curObj.sym,
      transit_days: transitDaysMin + '-' + transitDaysMax + ' суток',
      discount_applied: discount
    }
  };
}

/**
 * 7. Сохранение заявки, бронирования ставки и отправка на B2B платформу
 */
function saveBookingOrder(ss, p) {
  var ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet('Orders');
    ordersSheet.appendRow([
      'order_id', 'created_at', 'client_login', 'contact_name', 'phone', 'company',
      'client_role', 'incoterms', 'route_from', 'route_to', 'transport_type', 
      'freight_type', 'distance_km', 'total_price_usd', 'kp_status', 'kp_pdf_url', 'b2b_sync_status'
    ]);
  }

  var orderId = 'CR-ORD-' + Math.floor(1000 + Math.random() * 9000);
  var createdAt = new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU');

  ordersSheet.appendRow([
    orderId,
    createdAt,
    p.client_login || 'Гость',
    p.contact_name || 'Не указано',
    p.phone || '—',
    p.company || '—',
    p.client_role || 'Грузоотправитель',
    p.incoterms || 'DAP',
    p.route_from || '—',
    p.route_to || '—',
    p.transport_type || '—',
    p.freight_type || '—',
    p.distance_km || '—',
    p.total_price_usd || '—',
    'КП формируется в B2B платформе',
    '#',
    'Синхронизировано'
  ]);

  // Синхронизация с внешней B2B платформой
  forwardToB2BPlatform({
    type: 'new_order_booking',
    order_id: orderId,
    created_at: createdAt,
    client: {
      login: p.client_login,
      name: p.contact_name,
      phone: p.phone,
      company: p.company,
      role: p.client_role
    },
    shipment: {
      from: p.route_from,
      to: p.route_to,
      transport: p.transport_type,
      freight_type: p.freight_type,
      incoterms: p.incoterms,
      distance_km: p.distance_km,
      rate_usd: p.total_price_usd
    }
  });

  return {
    success: true,
    order_id: orderId,
    message: 'Заявка №' + orderId + ' успешно зарегистрирована! Коммерческое предложение формируется и появится в вашем личном кабинете после утверждения руководством.'
  };
}

/**
 * Пересылка данных в B2B платформу по Webhook
 */
function forwardToB2BPlatform(payload) {
  if (!B2B_WEBHOOK_URL) return;
  try {
    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(B2B_WEBHOOK_URL, options);
  } catch(e) {}
}

function getDefaultRoutes() {
  return [
    {
      id: "R-01",
      from: "ст. Достык (эксп.) / Алашанькоу",
      to: "ст. Ташкент-Товарный (УТИ)",
      distance_km: 1850,
      transport: "Контейнер 40ft HQ",
      freight_type: "Ж/Д перевозка",
      incoterms: "DAP (До двери)",
      price_usd: 2450,
      transit_days: "6-8 дней",
      included: "ЖД тариф КТЖ/УТИ, фитинговая платформа, автодоставка до склада"
    },
    {
      id: "R-02",
      from: "ст. Кокшетау (КЗХ)",
      to: "ст. Самарканд (УТИ)",
      distance_km: 2150,
      transport: "Зерновоз / Хоппер (72 тн)",
      freight_type: "Ж/Д перевозка",
      incoterms: "CPT (ст. назначения)",
      price_usd: 2780,
      transit_days: "8-10 дней",
      included: "Повагонная отправка, тариф КЗХ и УТИ, диспетчерский контроль"
    },
    {
      id: "R-03",
      from: "ст. Алтынколь (эксп.) / Хоргос",
      to: "ст. Алматы-1 (КЗХ)",
      distance_km: 340,
      transport: "Полувагон (универсальный)",
      freight_type: "Мультимодальная",
      incoterms: "DDP («Под ключ»)",
      price_usd: 1150,
      transit_days: "2-3 дня",
      included: "Перегруз на стыке, ж/д плечо, таможенная очистка и автодоставка"
    },
    {
      id: "R-04",
      from: "ст. Караганда-Сортировочная",
      to: "ст. Кунград (УТИ) / порт Актау",
      distance_km: 1980,
      transport: "Крытый вагон (грузовой)",
      freight_type: "Интермодальная",
      incoterms: "FOB / CIF",
      price_usd: 2650,
      transit_days: "7-9 дней",
      included: "Сквозная ставка: Ж/Д тариф + перевалка в морском порту"
    }
  ];
}

function getDefaultProposals(user) {
  return [
    {
      order_id: "CR-ORD-8821",
      date: "04.09.2026",
      company: user.company || 'ТОО "КазТрансЛогистик"',
      role: "Грузоотправитель",
      incoterms: "DAP (До склада получателя)",
      route: "ст. Кокшетау ➔ ст. Самарканд",
      transport: "Зерновоз / Хоппер (72 тн)",
      freight_type: "Ж/Д перевозка",
      distance_km: 2150,
      total_price: "$2,641 USD (со скидкой 5%)",
      kp_status: "КП подписано руководством",
      kp_pdf_url: "#"
    },
    {
      order_id: "CR-ORD-8714",
      date: "01.09.2026",
      company: user.company || 'ТОО "КазТрансЛогистик"',
      role: "Грузоотправитель",
      incoterms: "DDP («Под ключ»)",
      route: "ст. Достык ➔ ст. Ташкент-Товарный",
      transport: "Контейнер 40ft HQ",
      freight_type: "Мультимодальная",
      distance_km: 1850,
      total_price: "$2,580 USD",
      kp_status: "Счет на предоплату выставлен",
      kp_pdf_url: "#"
    }
  ];
}

function formatDislocationRow(r) {
  return {
    id: String(r[0] || ''),
    type: String(r[1] || 'Вагон'),
    client_login: String(r[2] || ''),
    invoice_num: String(r[3] || '—'),
    cargo_name: String(r[4] || 'Груз'),
    weight: String(r[5] || '—'),
    station_from: String(r[6] || '—'),
    date_from: formatDateVal(r[7]),
    station_current: String(r[8] || 'В пути'),
    railway_current: String(r[9] || 'Ж/Д'),
    last_operation: String(r[10] || 'Движение поезда'),
    date_operation: formatDateVal(r[11]),
    station_to: String(r[12] || '—'),
    eta: formatDateVal(r[13]),
    progress: Math.min(100, Math.max(0, parseInt(r[14]) || 50)),
    status: String(r[15] || 'В движении'),
    distance_left: String(r[16] || '—')
  };
}

function formatDateVal(val) {
  if (!val) return '—';
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone() || 'GMT+5', 'dd.MM.yyyy HH:mm');
  }
  return String(val);
}
