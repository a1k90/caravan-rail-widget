/**
 * CARAVAN RAILROAD & MULTIMODAL LOGISTICS
 * Google Apps Script Web App for Telegram & WhatsApp Bots
 * 
 * Автоматически создает вкладки "Пользователи" и "Заявки",
 * сохраняет регистрации клиентов и заявки навсегда,
 * отдает историю для раздела "Мои заявки".
 */

/**
 * Функция быстрой проверки и первичной авторизации:
 * Выберите 'testSetup' вверху редактора и нажмите 'Выполнить' (Run).
 * Это сразу создаст таблицы и проверит отправку почты.
 */
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  initSheets(ss);
  Logger.log("Вкладки 'Пользователи' и 'Заявки' успешно созданы!");
  try {
    var myEmail = Session.getActiveUser().getEmail() || "kingsonyuk@gmail.com";
    GmailApp.sendEmail(
      myEmail,
      "[Caravan Railroad] Проверка подключения бота",
      "Поздравляем! Google Apps Script успешно подключен и готов отправлять заявки Caravan Railroad.",
      { name: "Caravan Railroad Bot" }
    );
    Logger.log("Тестовое письмо отправлено на " + myEmail);
  } catch (err) {
    Logger.log("Предупреждение по отправке: " + err);
  }
}

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  if (!params.action) {
    params.action = "ping";
  }
  return handleRequest(e, params);
}

function doPost(e) {
  var data = {};
  try {
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    data = (e && e.parameter) ? e.parameter : {};
  }
  return handleRequest(e, data);
}

function handleRequest(e, params) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    initSheets(ss);
    
    var action = params.action;
    var result = { ok: true };
    
    if (action === "ping" || !action) {
      result.status = "active";
      result.message = "Caravan Railroad Google Sheets Gateway Active";
      result.connected_account = "kingsonyuk@gmail.com";
      result.timestamp = new Date().toISOString();
    } else if (action === "get_user") {
      result = getUser(ss, params.telegram_id);
    } else if (action === "register_user") {
      result = registerUser(ss, params);
    } else if (action === "create_lead") {
      result = createLead(ss, params);
    } else if (action === "get_leads") {
      result = getLeads(ss, params.telegram_id);
    } else {
      result = { ok: false, error: "Unknown action: " + action };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Автоматическое создание и оформление красивых шапок таблиц в фирменном стиле Caravan Railroad
 */
function initSheets(ss) {
  // 1. Вкладка "Пользователи"
  var userSheet = ss.getSheetByName("Пользователи");
  if (!userSheet) {
    userSheet = ss.insertSheet("Пользователи");
    var userHeaders = [["Telegram ID", "Фамилия Имя", "Организация", "Телефон", "Email", "Язык", "Дата регистрации"]];
    userSheet.getRange(1, 1, 1, userHeaders[0].length).setValues(userHeaders)
      .setBackground("#0b2545").setFontColor("#ffffff").setFontWeight("bold");
    userSheet.setFrozenRows(1);
    userSheet.setColumnWidth(1, 130);
    userSheet.setColumnWidth(2, 180);
    userSheet.setColumnWidth(3, 220);
    userSheet.setColumnWidth(4, 160);
    userSheet.setColumnWidth(5, 200);
  }
  
  // 2. Вкладка "Заявки"
  var leadSheet = ss.getSheetByName("Заявки");
  if (!leadSheet) {
    leadSheet = ss.insertSheet("Заявки");
    var leadHeaders = [["Номер заявки", "Дата и время", "Организация", "Контактное лицо", "Телефон", "Email", "Telegram / WhatsApp", "Направление", "Параметры перевозки", "Статус"]];
    leadSheet.getRange(1, 1, 1, leadHeaders[0].length).setValues(leadHeaders)
      .setBackground("#134074").setFontColor("#ffffff").setFontWeight("bold");
    leadSheet.setFrozenRows(1);
    leadSheet.setColumnWidth(1, 130);
    leadSheet.setColumnWidth(2, 150);
    leadSheet.setColumnWidth(3, 200);
    leadSheet.setColumnWidth(4, 180);
    leadSheet.setColumnWidth(5, 160);
    leadSheet.setColumnWidth(6, 180);
    leadSheet.setColumnWidth(7, 160);
    leadSheet.setColumnWidth(8, 200);
    leadSheet.setColumnWidth(9, 320);
    leadSheet.setColumnWidth(10, 120);
  }
}

function getUser(ss, tgId) {
  var sheet = ss.getSheetByName("Пользователи");
  var data = sheet.getDataRange().getValues();
  var strTgId = String(tgId).trim();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === strTgId) {
      return {
        ok: true,
        found: true,
        user: {
          telegram_id: data[i][0],
          full_name: data[i][1],
          company_name: data[i][2],
          phone: data[i][3],
          email: data[i][4],
          language: data[i][5],
          is_registered: 1
        }
      };
    }
  }
  return { ok: true, found: false };
}

function registerUser(ss, p) {
  var sheet = ss.getSheetByName("Пользователи");
  var data = sheet.getDataRange().getValues();
  var strTgId = String(p.telegram_id).trim();
  var now = Utilities.formatDate(new Date(), "GMT+5", "yyyy-MM-dd HH:mm:ss");
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === strTgId) {
      if (p.full_name) sheet.getRange(i + 1, 2).setValue(p.full_name);
      if (p.company_name) sheet.getRange(i + 1, 3).setValue(p.company_name);
      if (p.phone) sheet.getRange(i + 1, 4).setValue(p.phone);
      if (p.email) sheet.getRange(i + 1, 5).setValue(p.email);
      if (p.language) sheet.getRange(i + 1, 6).setValue(p.language);
      return { ok: true, action: "updated" };
    }
  }
  
  sheet.appendRow([
    strTgId,
    p.full_name || "",
    p.company_name || "",
    p.phone || "",
    p.email || "",
    p.language || "ru",
    now
  ]);
  return { ok: true, action: "created" };
}

function createLead(ss, p) {
  var sheet = ss.getSheetByName("Заявки");
  var now = Utilities.formatDate(new Date(), "GMT+5", "yyyy-MM-dd HH:mm:ss");
  var u = p.user || {};
  var l = p.lead || {};
  
  var detailsStr = "";
  var detailsObj = l.details || p.details || {};
  for (var k in detailsObj) {
    if (detailsObj[k]) {
      var cleanK = String(k).replace(/_/g, " ");
      detailsStr += cleanK.charAt(0).toUpperCase() + cleanK.slice(1) + ": " + detailsObj[k] + "\n";
    }
  }
  
  var contactSource = u.username ? "@" + u.username : String(p.telegram_id || u.telegram_id || p.wa_phone || "");
  
  sheet.appendRow([
    l.lead_number || p.lead_number || "CR-LEAD",
    now,
    u.company_name || "",
    u.full_name || "",
    u.phone || "",
    u.email || "",
    contactSource,
    l.service_name || l.service_type || p.service_name || "Логистика",
    detailsStr.trim(),
    "НОВАЯ"
  ]);

  // Отправка письма напрямую с этого Gmail аккаунта на info@caravanrailroad.com
  try {
    var leadNum = l.lead_number || p.lead_number || "CR-LEAD";
    var sName = l.service_name || l.service_type || p.service_name || "Логистика";
    var compName = u.company_name || "Клиент";
    var subj = "[Caravan Lead " + leadNum + "] " + sName + " — " + compName;
    var htmlContent = p.html || (
      "<h3>Новая заявка: " + leadNum + "</h3>" +
      "<p><b>Организация:</b> " + compName + "</p>" +
      "<p><b>Контактное лицо:</b> " + (u.full_name || "—") + "</p>" +
      "<p><b>Телефон:</b> " + (u.phone || "—") + "</p>" +
      "<p><b>Email:</b> " + (u.email || "—") + "</p>" +
      "<p><b>Направление:</b> " + sName + "</p>" +
      "<pre>" + detailsStr + "</pre>"
    );

    try {
      GmailApp.sendEmail("info@caravanrailroad.com", subj, detailsStr, {
        name: "Caravan Railroad Bot",
        htmlBody: htmlContent
      });
    } catch (gErr) {
      MailApp.sendEmail({
        to: "info@caravanrailroad.com",
        name: "Caravan Railroad Bot",
        subject: subj,
        body: detailsStr,
        htmlBody: htmlContent
      });
    }
  } catch (mErr) {
    Logger.log("Email dispatch error: " + mErr);
  }
  
  return { ok: true, lead_number: l.lead_number || p.lead_number };
}

function getLeads(ss, tgId) {
  var sheet = ss.getSheetByName("Заявки");
  var data = sheet.getDataRange().getValues();
  var strTgId = String(tgId).trim();
  var leads = [];
  
  for (var i = data.length - 1; i >= 1; i--) {
    var rowContact = String(data[i][6]).trim();
    if (rowContact.indexOf(strTgId) !== -1 || (strTgId.length > 5 && rowContact === strTgId)) {
      leads.push({
        lead_number: data[i][0],
        created_at: String(data[i][1]),
        company_name: data[i][2],
        full_name: data[i][3],
        service_name: data[i][7],
        details: data[i][8],
        status: data[i][9]
      });
      if (leads.length >= 10) break;
    }
  }
  return { ok: true, leads: leads };
}
