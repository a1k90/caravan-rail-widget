"""
CARAVAN RAILROAD & MULTIMODAL LOGISTICS
Multilingual Localization Dictionary (RU / EN / ZH)
"""

LOCALES = {
    'ru': {
        'lang_name': 'Русский',
        'choose_lang': '🌐 Пожалуйста, выберите язык обслуживания / Please select language / 请选择语言:',
        'lang_selected': '✅ Выбран язык: Русский',
        
        # Регистрация
        'reg_welcome': (
            '👋 Добро пожаловать в **Caravan Railroad & Multimodal Logistics**!\n\n'
            'Для точного расчета ставок, оформления заявок и закрепления персонального менеджера, '
            'пожалуйста, пройдите быструю регистрацию вашей организации.'
        ),
        'btn_share_contact': '📱 Поделиться номером телефона',
        'ask_phone': 'Пожалуйста, нажмите кнопку ниже или введите контактный номер телефона в международном формате (например, +7 727 345 0000):',
        'ask_name': '👤 Укажите Фамилию и Имя контактного лица:',
        'ask_company': '🏢 Укажите наименование вашей организации / компании:',
        'ask_email': '✉️ Укажите корпоративный Email для отправки коммерческих предложений и расчетов:',
        'invalid_email': '⚠️ Пожалуйста, введите корректный адрес электронной почты (например, name@company.com):',
        'reg_success': '🎉 Регистрация успешно завершена! Ваши данные сохранены в системе Caravan Railroad.',
        
        # Главное меню
        'main_menu_title': '🏢 **Caravan Railroad — Главное меню**\nВыберите интересующее вас направление логистики для подачи заявки:',
        'service_rail': '🚂 Ж/Д перевозки & Аренда вагонов',
        'service_road': '🚛 Автомобильные перевозки',
        'service_air': '✈️ Авиаперевозки',
        'service_multi': '🚢 Мультимодальные перевозки',
        'service_customs': '📑 Таможенное оформление',
        'service_forwarding': '🌐 Экспедирование и ж/д тарифы',
        'btn_my_leads': '📋 Мои заявки',
        'btn_my_profile': '👤 Мой профиль',
        'btn_about': 'ℹ️ О компании и Контакты',
        'btn_change_lang': '🌐 Сменить язык (Language)',
        
        # Навигация
        'btn_back': '◀️ Назад',
        'btn_cancel': '❌ Отмена',
        'btn_skip': 'Пропустить ⏭',
        'btn_confirm': '✅ Отправить заявку',
        'action_cancelled': 'Действие отменено. Возврат в главное меню.',
        
        # Ж/Д перевозки (Wizard)
        'rail_type_title': '🚂 **Ж/Д логистика (колея 1520 & 1435 мм)**\nВыберите тип услуги:',
        'rail_type_tariff': '🚆 Расчет тарифа и перевозка',
        'rail_type_lease': '📑 Аренда подвижного состава',
        'rail_ask_from': '📍 Введите **станцию отправления** (наименование или 6-значный код станции):',
        'rail_ask_to': '🏁 Введите **станцию назначения** (наименование или 6-значный код станции):',
        'rail_ask_cargo': '📦 Укажите **наименование груза** (или код ЕТСНГ / ГНГ, если известен):',
        'rail_ask_wagon_type': '🛠 Выберите **тип подвижного состава**:',
        'wagon_covered': 'Крытый вагон (138-161 м³)',
        'wagon_open': 'Полувагон (люковый/глуходонный)',
        'wagon_platform': 'Платформа (универсальная/фитинговая)',
        'wagon_tank': 'Цистерна (нефть/химия/СУГ)',
        'wagon_hopper': 'Хоппер-зерновоз / Минераловоз',
        'wagon_container': 'Контейнеры (20 / 40 фут)',
        'rail_ask_fleet_opt': '📋 **Предоставление подвижного состава:**',
        'fleet_opt_caravan': '🔹 Требуются вагоны Caravan Railroad (включить в ставку)',
        'fleet_opt_client': '🔸 Собственный/арендованный парк (только тариф и коды)',
        'rail_ask_volume': '🔢 Укажите **объем перевозки** (количество вагонов, контейнеров или вес в тоннах):',
        'rail_ask_comment': '💬 Дополнительные требования (желаемая дата отправки, негабаритность, перегруз) или нажмите "Пропустить":',
        
        # Автоперевозки (Wizard)
        'road_title': '🚛 **Автомобильные перевозки**',
        'road_ask_from': '📍 Укажите **город/страну отправления** (с адресом погрузки, если известно):',
        'road_ask_to': '🏁 Укажите **город/страну назначения** (пункт выгрузки):',
        'road_ask_truck_type': '🚚 Выберите **тип автотранспорта / кузова**:',
        'truck_tent_standard': 'Тент стандарт (86-92 м³, до 22 т)',
        'truck_tent_mega': 'Мегатрейлер (100-120 м³, высота 3м)',
        'truck_ref': 'Рефрижератор (-20°C ... +20°C)',
        'truck_oversized': 'Низкорамный трал (негабарит)',
        'truck_container': 'Контейнеровоз (20/40 фут)',
        'road_ask_weight_vol': '⚖️ Укажите **вес (тонн) и объем (м³)** груза:',
        'road_ask_date': '📅 Планируемая дата готовности груза к перевозке (или нажмите "Пропустить"):',
        
        # Авиаперевозки (Wizard)
        'air_title': '✈️ **Международные авиаперевозки**',
        'air_ask_from': '🛫 Укажите **аэропорт или город отправления**:',
        'air_ask_to': '🛬 Укажите **аэропорт или город назначения**:',
        'air_ask_cargo_type': '📦 Выберите **характер авиагруза**:',
        'air_cargo_general': 'Генеральный коммерческий груз',
        'air_cargo_dgr': 'Опасный груз (DGR / Аккумуляторы)',
        'air_cargo_temp': 'Температурный груз (Perishable / Pharma)',
        'air_cargo_express': 'Срочный экспресс / Чартер',
        'air_ask_dims': '📐 Укажите **вес брутто (кг) и габариты мест (Д×Ш×В см)**:',
        'air_ask_pickup': '🚚 Требуется ли забор груза от склада отправителя (Pick-up)?',
        'btn_yes': 'Да',
        'btn_no': 'Нет (доставка в аэропорт силами клиента)',
        
        # Мультимодальные перевозки (Wizard)
        'multi_title': '🚢 **Мультимодальные & интермодальные перевозки**',
        'multi_ask_route': '🌍 Укажите **маршрут (Откуда ➔ Куда)**:',
        'multi_ask_type': '🔀 Выберите логистическую схему:',
        'multi_sea_rail': 'Море + Ж/Д (Китай/ЮВА ➔ Порты ➔ СНГ)',
        'multi_road_rail': 'Авто + Ж/Д (Европа/Турция ➔ СНГ)',
        'multi_transcaspian': 'ТМТМ / Средний коридор (Каспий)',
        'multi_ask_equipment': '📦 Выберите тип оборудования (контейнеров):',
        'container_20dc': '20’ Dry Container (24-28 т)',
        'container_40hc': '40’ High Cube (до 26 т, 76 м³)',
        'container_40rf': '40’ Reefer (рефрижератор)',
        'multi_ask_qty': '🔢 Укажите **количество контейнеров и вес груза**:',
        
        # Таможенное оформление (Wizard)
        'customs_title': '📑 **Таможенное оформление & ВЭД брокер**',
        'customs_ask_country': '🏛 Укажите **страну и таможенный пост оформления** (например, Казахстан, Алтынколь / Достык / Астана):',
        'customs_ask_regime': '📋 Выберите **таможенный режим**:',
        'customs_import': 'Импорт (Выпуск для внутреннего потребления, ИМ-40)',
        'customs_export': 'Экспорт (ЭК-10)',
        'customs_transit': 'Таможенный транзит (ВТТ, ТР-80)',
        'customs_ask_goods': '🏷 Опишите **товар и укажите код ТН ВЭД** (первые 4-10 знаков, если известны):',
        'customs_ask_certs': '📜 Требуется ли сертификация (СТ-1, фитосанитарный, ветеринарный, ЕАЭС)?',
        
        # Экспедирование (Wizard)
        'fwd_title': '🌐 **Транзитное экспедирование и проплата ж/д тарифов**',
        'fwd_ask_railways': '🛤 Укажите **железные дороги следования** (например, КЗХ, РЖД, УТИ, ТДЖ, ГРЗ):',
        'fwd_ask_border': '🚪 Укажите **пограничные переходы / стыковые станции** (например, Достык, Сарыагаш, Илецк):',
        'fwd_ask_details': '📝 Опишите требуемые услуги (проплата тарифа, охрана, перевалка, слежение):',
        
        # Итог и отправка
        'summary_header': '📋 **Проверьте данные вашей заявки:**\n',
        'summary_confirm_prompt': 'Все верно? Нажмите кнопку **"✅ Отправить заявку"** для отправки на почту логистов `info@caravanrailroad.com`:',
        'lead_submitted': (
            '🎉 **Ваша заявка успешно принята!**\n\n'
            '🔖 **Номер заявки:** `{lead_number}`\n'
            '📅 **Время регистрации:** {created_at}\n\n'
            '📧 Структурированный запрос отправлен в отдел расчетов Caravan Railroad (`info@caravanrailroad.com`).\n'
            '📞 В ближайшее время специалист свяжется с вами по номеру **{phone}** или в Telegram.\n\n'
            'Благодарим за обращение в Caravan Railroad!'
        ),
        
        # Профиль и Заявки
        'profile_title': '👤 **Ваш профиль клиента**',
        'profile_text': (
            '👤 **ФИО:** {full_name}\n'
            '🏢 **Организация:** {company_name}\n'
            '📞 **Телефон:** {phone}\n'
            '✉️ **Email:** {email}\n'
            '🌐 **Язык интерфейса:** {language}\n'
            '🆔 **Telegram ID:** `{telegram_id}`'
        ),
        'btn_edit_profile': '✏️ Изменить данные профиля',
        'my_leads_title': '📋 **История ваших последних заявок:**\n',
        'my_leads_empty': 'У вас пока нет активных заявок. Выберите услугу в главном меню для подачи первой заявки.',
        
        # О компании
        'about_title': 'ℹ️ **О компании Caravan Railroad & Multimodal Logistics**',
        'about_text': (
            '🚂 **Caravan Railroad** — международный мультимодальный и железнодорожный логистический оператор на пространстве 1520 & 1435 мм.\n\n'
            '🔹 **Собственный и арендованный парк:** 1 480+ вагонов (крытые, полувагоны, цистерны, фитинговые платформы)\n'
            '🔹 **География:** Казахстан, Узбекистан, страны Центральной Азии, Китай, Европа, Турция, Кавказ\n'
            '🔹 **Сервисы:** ж/д тарифы, экспедирование, контейнерные поезда, автодоставка, таможенный брокер\n\n'
            '📞 **Телефон:** +7 (727) 345-00-00\n'
            '✉️ **Email:** info@caravanrailroad.com\n'
            '🌐 **Сайт:** https://caravan-rail.com\n'
            '💬 **Поддержка:** @caravan_rail_support'
        )
    },
    
    'en': {
        'lang_name': 'English',
        'choose_lang': '🌐 Please select language / Пожалуйста, выберите язык / 请选择语言:',
        'lang_selected': '✅ Language set to English',
        
        'reg_welcome': (
            '👋 Welcome to **Caravan Railroad & Multimodal Logistics**!\n\n'
            'To receive accurate freight rates, submit inquiries, and get assigned a dedicated logistics manager, '
            'please complete a quick registration of your company.'
        ),
        'btn_share_contact': '📱 Share Phone Number',
        'ask_phone': 'Please tap the button below or enter your contact phone number in international format (e.g. +7 727 345 0000):',
        'ask_name': '👤 Enter Full Name of contact person:',
        'ask_company': '🏢 Enter your Company / Organization name:',
        'ask_email': '✉️ Enter corporate Email address for quotations and calculations:',
        'invalid_email': '⚠️ Please enter a valid email address (e.g. name@company.com):',
        'reg_success': '🎉 Registration completed! Your details are saved in Caravan Railroad.',
        
        'main_menu_title': '🏢 **Caravan Railroad — Main Menu**\nSelect a logistics category to submit an inquiry:',
        'service_rail': '🚂 Rail Freight & Wagon Leasing',
        'service_road': '🚛 Road Transportation',
        'service_air': '✈️ Air Cargo',
        'service_multi': '🚢 Multimodal Transportation',
        'service_customs': '📑 Customs Clearance',
        'service_forwarding': '🌐 Rail Forwarding & Tariffs',
        'btn_my_leads': '📋 My Requests',
        'btn_my_profile': '👤 My Profile',
        'btn_about': 'ℹ️ About & Contacts',
        'btn_change_lang': '🌐 Change Language',
        
        'btn_back': '◀️ Back',
        'btn_cancel': '❌ Cancel',
        'btn_skip': 'Skip ⏭',
        'btn_confirm': '✅ Submit Request',
        'action_cancelled': 'Action cancelled. Returning to main menu.',
        
        'rail_type_title': '🚂 **Rail Logistics (1520 & 1435 mm)**\nSelect service type:',
        'rail_type_tariff': '🚆 Freight rate calculation & transport',
        'rail_type_lease': '📑 Rolling stock lease / provision',
        'rail_ask_from': '📍 Enter **origin railway station** (name or 6-digit code):',
        'rail_ask_to': '🏁 Enter **destination railway station** (name or 6-digit code):',
        'rail_ask_cargo': '📦 Enter **cargo commodity / name** (or NHM / ETSNG code):',
        'rail_ask_wagon_type': '🛠 Select **rolling stock type**:',
        'wagon_covered': 'Boxcar / Covered wagon (138-161 m³)',
        'wagon_open': 'Gondola / Open-top wagon',
        'wagon_platform': 'Flatcar (Universal / Fitting platform)',
        'wagon_tank': 'Tank car (Oil / Chemicals / LPG)',
        'wagon_hopper': 'Hopper / Grain wagon',
        'wagon_container': 'Container block train (20 / 40 ft)',
        'rail_ask_fleet_opt': '📋 **Rolling Stock Provision:**',
        'fleet_opt_caravan': '🔹 Provide Caravan Railroad wagons (include in rate)',
        'fleet_opt_client': '🔸 Own / leased shipper wagons (freight tariff & codes only)',
        'rail_ask_volume': '🔢 Enter **transport volume** (number of wagons, containers or tonnes):',
        'rail_ask_comment': '💬 Additional remarks (target shipping date, OOG, transshipment) or tap "Skip":',
        
        'road_title': '🚛 **Road Freight Transportation**',
        'road_ask_from': '📍 Enter **origin city & country** (with loading address):',
        'road_ask_to': '🏁 Enter **destination city & country**:',
        'road_ask_truck_type': '🚚 Select **truck / trailer type**:',
        'truck_tent_standard': 'Standard Curtainsider (86-92 m³, up to 22t)',
        'truck_tent_mega': 'Mega trailer (100-120 m³, height 3m)',
        'truck_ref': 'Reefer trailer (-20°C ... +20°C)',
        'truck_oversized': 'Lowboy / Heavy-haul trailer (OOG)',
        'truck_container': 'Container chassis (20/40 ft)',
        'road_ask_weight_vol': '⚖️ Enter **gross weight (t) and volume (cbm)**:',
        'road_ask_date': '📅 Cargo readiness date (or tap "Skip"):',
        
        'air_title': '✈️ **International Air Cargo**',
        'air_ask_from': '🛫 Enter **origin airport or city**:',
        'air_ask_to': '🛬 Enter **destination airport or city**:',
        'air_ask_cargo_type': '📦 Select **cargo category**:',
        'air_cargo_general': 'General Commercial Cargo',
        'air_cargo_dgr': 'Dangerous Goods (DGR / Batteries)',
        'air_cargo_temp': 'Temperature Controlled (Pharma / Perishable)',
        'air_cargo_express': 'Urgent Express / Charter',
        'air_ask_dims': '📐 Enter **gross weight (kg) and dimensions (L×W×H cm)**:',
        'air_ask_pickup': '🚚 Door pick-up service required?',
        'btn_yes': 'Yes',
        'btn_no': 'No (delivered to airport by shipper)',
        
        'multi_title': '🚢 **Multimodal & Intermodal Logistics**',
        'multi_ask_route': '🌍 Enter **route (From ➔ To)**:',
        'multi_ask_type': '🔀 Select logistics solution:',
        'multi_sea_rail': 'Sea + Rail (China/SEA ➔ Ports ➔ CIS)',
        'multi_road_rail': 'Road + Rail (Europe/Turkey ➔ CIS)',
        'multi_transcaspian': 'TITR / Middle Corridor (Caspian Sea)',
        'multi_ask_equipment': '📦 Select container equipment:',
        'container_20dc': '20’ Dry Container (24-28 t)',
        'container_40hc': '40’ High Cube (up to 26 t, 76 cbm)',
        'container_40rf': '40’ Reefer (refrigerated)',
        'multi_ask_qty': '🔢 Enter **container quantity and total weight**:',
        
        'customs_title': '📑 **Customs Clearance & Brokerage**',
        'customs_ask_country': '🏛 Enter **country & customs clearance post**:',
        'customs_ask_regime': '📋 Select **customs procedure**:',
        'customs_import': 'Import for domestic use (IM-40)',
        'customs_export': 'Export (EX-10)',
        'customs_transit': 'Customs Transit (TR-80)',
        'customs_ask_goods': '🏷 Describe **goods & HS Code** (first 4-10 digits if known):',
        'customs_ask_certs': '📜 Certificates required (CT-1, Phyto, Veterinary, EAC)?',
        
        'fwd_title': '🌐 **Transit Forwarding & Rail Tariffs**',
        'fwd_ask_railways': '🛤 Enter **railways on transit route** (e.g. KTZ, RZD, UTY, TDZ, GRZ):',
        'fwd_ask_border': '🚪 Enter **border crossings / junctions** (e.g. Dostyk, Saryagash, Iletsk):',
        'fwd_ask_details': '📝 Describe required services (tariff payment, security, tracking, re-loading):',
        
        'summary_header': '📋 **Please review your inquiry details:**\n',
        'summary_confirm_prompt': 'Is everything correct? Tap **"✅ Submit Request"** to forward to `info@caravanrailroad.com`:',
        'lead_submitted': (
            '🎉 **Your inquiry has been successfully received!**\n\n'
            '🔖 **Reference Number:** `{lead_number}`\n'
            '📅 **Registered at:** {created_at}\n\n'
            '📧 Details have been dispatched to Caravan Railroad commercial team (`info@caravanrailroad.com`).\n'
            '📞 Our specialist will reach out to you shortly via phone **{phone}** or Telegram.\n\n'
            'Thank you for choosing Caravan Railroad!'
        ),
        
        'profile_title': '👤 **Your Client Profile**',
        'profile_text': (
            '👤 **Full Name:** {full_name}\n'
            '🏢 **Company:** {company_name}\n'
            '📞 **Phone:** {phone}\n'
            '✉️ **Email:** {email}\n'
            '🌐 **Interface Language:** {language}\n'
            '🆔 **Telegram ID:** `{telegram_id}`'
        ),
        'btn_edit_profile': '✏️ Edit Profile Details',
        'my_leads_title': '📋 **Your Recent Inquiries:**\n',
        'my_leads_empty': 'You have no active inquiries yet. Choose a service from the main menu to place your first request.',
        
        'about_title': 'ℹ️ **About Caravan Railroad & Multimodal Logistics**',
        'about_text': (
            '🚂 **Caravan Railroad** — international multimodal and railway logistics carrier across 1520 & 1435 mm networks.\n\n'
            '🔹 **Fleet:** 1,480+ rolling stock units (boxcars, gondolas, tanks, fitting platforms)\n'
            '🔹 **Network:** Kazakhstan, Uzbekistan, Central Asia, China, Europe, Turkey, Caucasus\n'
            '🔹 **Services:** rail freight tariff calculations, forwarding codes, container trains, road trucking, customs brokerage\n\n'
            '📞 **Phone:** +7 (727) 345-00-00\n'
            '✉️ **Email:** info@caravanrailroad.com\n'
            '🌐 **Website:** https://caravan-rail.com\n'
            '💬 **Telegram Support:** @caravan_rail_support'
        )
    },
    
    'zh': {
        'lang_name': '简体中文',
        'choose_lang': '🌐 请选择语言 / Please select language / Пожалуйста, выберите язык:',
        'lang_selected': '✅ 已选择语言：简体中文',
        
        'reg_welcome': (
            '👋 欢迎使用 **Caravan Railroad 国际铁路与多式联运** 官方服务系统！\n\n'
            '为了向您提供精准的运价测算、专属大客户经理对接与高效发运方案，请先完善企业认证信息。'
        ),
        'btn_share_contact': '📱 一键发送手机号',
        'ask_phone': '请点击下方按钮共享手机号，或按国际格式手动输入（例如：+86 138 0000 0000 或 +7 727 345 0000）：',
        'ask_name': '👤 请输入联系人姓名：',
        'ask_company': '🏢 请输入您所在的企业 / 公司全称：',
        'ask_email': '✉️ 请输入接收报价方案的企业电子邮箱：',
        'invalid_email': '⚠️ 请输入有效的企业邮箱（例如 name@company.com）：',
        'reg_success': '🎉 企业信息登记完成！已成功同步至 Caravan Railroad 全球服务数据库。',
        
        'main_menu_title': '🏢 **Caravan Railroad — 综合物流服务主菜单**\n请选择您需要发运或测算的项目类别：',
        'service_rail': '🚂 国际铁路运输 & 车皮租赁',
        'service_road': '🚛 国际公路汽运卡航',
        'service_air': '✈️ 国际航空货运包机',
        'service_multi': '🚢 海铁与海陆多式联运',
        'service_customs': '📑 全程进出口通关报关',
        'service_forwarding': '🌐 铁路过境代码代缴与代理',
        'btn_my_leads': '📋 我的询价单',
        'btn_my_profile': '👤 企业账户中心',
        'btn_about': 'ℹ️ 关于车队与联系方式',
        'btn_change_lang': '🌐 切换语言 (Language)',
        
        'btn_back': '◀️ 返回上一页',
        'btn_cancel': '❌ 取消操作',
        'btn_skip': '跳过此项 ⏭',
        'btn_confirm': '✅ 确认提交询价单',
        'action_cancelled': '已取消操作，返回主菜单。',
        
        'rail_type_title': '🚂 **国际铁路运输与车皮保障 (1520与1435毫米轨距)**\n请选择业务类别：',
        'rail_type_tariff': '🚆 全程铁路运价测算与发运组织',
        'rail_type_lease': '📑 铁路自备车租赁与车板调配',
        'rail_ask_from': '📍 请输入 **始发火车站**（站名或6位铁路车站代码）：',
        'rail_ask_to': '🏁 请输入 **到达火车站**（站名或6位铁路车站代码）：',
        'rail_ask_cargo': '📦 请输入 **货物品名**（或 ETSNG / GNG 货物代码）：',
        'rail_ask_wagon_type': '🛠 请选择所需 **铁路装备类型**：',
        'wagon_covered': '棚车 / 箱车 (138-161 m³)',
        'wagon_open': '敞车 (通用敞车/高边敞车)',
        'wagon_platform': '平板车 (集装箱集装架专用车板)',
        'wagon_tank': '罐车 (原油/成品油/化工/LPG)',
        'wagon_hopper': '漏斗车 / 散粮车',
        'wagon_container': '集装箱班列 (20/40尺集装箱)',
        'rail_ask_fleet_opt': '📋 **车皮装备提供方式：**',
        'fleet_opt_caravan': '🔹 需要 Caravan 提供车皮（运费含车板使用费）',
        'fleet_opt_client': '🔸 货主自有或自租车皮（仅代付国铁运费与代码）',
        'rail_ask_volume': '🔢 请输入 **发运规模**（车皮数、集装箱柜数或货物总吨数）：',
        'rail_ask_comment': '💬 其他特殊要求（拟发运日期、超限超重、装载加固）或点击“跳过”：',
        
        'road_title': '🚛 **国际公路卡车卡航运输**',
        'road_ask_from': '📍 请输入 **起运城市与国家**（装货地）：',
        'road_ask_to': '🏁 请输入 **目的城市与国家**（卸货地）：',
        'road_ask_truck_type': '🚚 请选择所需 **公路车辆类型**：',
        'truck_tent_standard': '标准篷布帘布车 (86-92 m³，荷载22吨)',
        'truck_tent_mega': '巨无霸大容积高栏车 (100-120 m³，内高3米)',
        'truck_ref': '冷链温控冷藏车 (-20°C ... +20°C)',
        'truck_oversized': '低平板特种轴线车 (大型设备超限超载)',
        'truck_container': '公路集装箱拖车骨架架',
        'road_ask_weight_vol': '⚖️ 请输入 **货物毛重 (吨) 和体积 (立方米)**：',
        'road_ask_date': '📅 货物备妥预计装货日期（或点击“跳过”）：',
        
        'air_title': '✈️ **国际航空货运与急件包机**',
        'air_ask_from': '🛫 请输入 **起运机场或城市**：',
        'air_ask_to': '🛬 请输入 **目的机场或城市**：',
        'air_ask_cargo_type': '📦 请选择 **货物属性类别**：',
        'air_cargo_general': '普通普货商业空运',
        'air_cargo_dgr': '危险品空运 (DGR / 锂电池 / 化工品)',
        'air_cargo_temp': '恒温冷链空运 (生鲜 / 医药试剂)',
        'air_cargo_express': '加急特快包板或定班包机',
        'air_ask_dims': '📐 请输入 **总毛重 (kg) 及外包装件数与尺寸 (长×宽×高 cm)**：',
        'air_ask_pickup': '🚚 是否需要始发地上门提货（Pick-up）？',
        'btn_yes': '需要上门提货',
        'btn_no': '无需提货（货主自行送达机场货站）',
        
        'multi_title': '🚢 **海铁联运与跨里海中间走廊多式联运**',
        'multi_ask_route': '🌍 请输入 **完整多式联运路径（起运点 ➔ 目的港/地）**：',
        'multi_ask_type': '🔀 请选择多式联运架构方案：',
        'multi_sea_rail': '海铁联运 (中国/东南亚 ➔ 枢纽港口 ➔ 独联体中亚内陆)',
        'multi_road_rail': '公铁多式联运 (欧洲/土耳其 ➔ 霍尔果斯/多斯特克 ➔ 中亚)',
        'multi_transcaspian': 'TITR 跨里海中间走廊 (阿克套/巴库 ➔ 黑海 ➔ 欧洲)',
        'multi_ask_equipment': '📦 请选择所需国际海运标准集装箱：',
        'container_20dc': '20’ 标箱 (荷载24-28吨)',
        'container_40hc': '40’ 高箱 (内高2.7米，容积76立方)',
        'container_40rf': '40’ 冷藏集装箱',
        'multi_ask_qty': '🔢 请输入 **集装箱总数量与货物总毛重**：',
        
        'customs_title': '📑 **进出口报关报检与海关事务代理**',
        'customs_ask_country': '🏛 请输入 **报关口岸与海关申报点**（如：哈萨克斯坦霍尔果斯/多斯特克、阿斯塔纳、阿拉木图）：',
        'customs_ask_regime': '📋 请选择 **海关监管方式与申报模式**：',
        'customs_import': '一般贸易进口报关 (IM-40 内销放行)',
        'customs_export': '一般贸易出口报关 (EX-10)',
        'customs_transit': '转关与国际海关过境转运 (TR-80)',
        'customs_ask_goods': '🏷 请详细描述 **货物中文品名及前 4-10 位 HS海关商品编码**：',
        'customs_ask_certs': '📜 是否需要代办产地证、植检证、兽医证或 EAC 欧亚联盟符合性认证？',
        
        'fwd_title': '🌐 **铁路国际联运过境代理与全线运杂费代缴**',
        'fwd_ask_railways': '🛤 请输入 **途经国铁路路局代码**（如：哈铁 KTZ、俄铁 RZD、乌铁 UTY、塔铁 TDZ、格铁 GRZ）：',
        'fwd_ask_border': '🚪 请输入 **边境口岸与换装过轨枢纽**（如：多斯特克、阿腾科里、萨雷阿加什、伊列茨克）：',
        'fwd_ask_details': '📝 请填写需要的服务细项（如：代发过境代码、押运保价、24小时北斗/GPS在途定位）：',
        
        'summary_header': '📋 **请核对您的询价申报清单：**\n',
        'summary_confirm_prompt': '确认信息无误后，请点击 **"✅ 确认提交询价单"** 即时抄送至调度中心 `info@caravanrailroad.com`：',
        'lead_submitted': (
            '🎉 **您的物流询价单已成功提交！**\n\n'
            '🔖 **询价单编号：** `{lead_number}`\n'
            '📅 **建单时间：** {created_at}\n\n'
            '📧 结构化业务数据已直传 Caravan 运费测算中心 (`info@caravanrailroad.com`)。\n'
            '📞 专属多式联运经理将在最短时间内通过电话 **{phone}** 或 Telegram 与您对接。\n\n'
            '感谢您选择 Caravan Railroad 国际供应链！'
        ),
        
        'profile_title': '👤 **企业账户与联络中心**',
        'profile_text': (
            '👤 **联系人：** {full_name}\n'
            '🏢 **企业名称：** {company_name}\n'
            '📞 **联系电话：** {phone}\n'
            '✉️ **电子邮箱：** {email}\n'
            '🌐 **系统语言：** {language}\n'
            '🆔 **Telegram 账号ID：** `{telegram_id}`'
        ),
        'btn_edit_profile': '✏️ 修改企业资料',
        'my_leads_title': '📋 **历史询价记录：**\n',
        'my_leads_empty': '您当前暂无已提交的询价单。请在主菜单选择物流类别发起首次测算。',
        
        'about_title': 'ℹ️ **关于 Caravan Railroad 国际铁路与物流集团**',
        'about_text': (
            '🚂 **Caravan Railroad** — 扎根欧亚大陆桥 1520 与 1435 毫米轨距网的专业铁路与多式联运大承运商。\n\n'
            '🔹 **自备及管控车队：** 1,480+ 辆铁路车皮（棚车、敞车、罐车、专用集装箱平板车板）\n'
            '🔹 **经贸辐射网络：** 哈萨克斯坦、乌兹别克斯坦、中亚全境、中国全境、欧洲多国、土耳其、高加索\n'
            '🔹 **主力核心业务：** 铁路大宗发运、全程提单清关、班列拼箱整箱、国际汽运卡航、海关保税代理\n\n'
            '📞 **全球调度电话：** +7 (727) 345-00-00\n'
            '✉️ **业务受理邮箱：** info@caravanrailroad.com\n'
            '🌐 **官方门户网站：** https://caravan-rail.com\n'
            '💬 **Telegram 在线支持：** @caravan_rail_support'
        )
    }
}


def t(first: str, second: str = None, **kwargs) -> str:
    """
    Получить локализованный текст по ключу с подстановкой параметров.
    Поддерживает вызов как t(lang, key), так и t(key, lang).
    """
    if first in LOCALES and second is not None:
        lang = first
        key = second
    elif second in LOCALES:
        key = first
        lang = second
    else:
        key = first
        lang = second or 'ru'

    lang_dict = LOCALES.get(lang) or LOCALES.get('ru')
    text = lang_dict.get(key)
    if text is None:
        # Fallback на русский язык
        text = LOCALES['ru'].get(key, f"[{key}]")
    
    if kwargs:
        try:
            return text.format(**kwargs)
        except Exception:
            return text
    return text


def format_lead_summary(lang: str, data: dict) -> str:
    """Форматирует параметры собранной заявки в аккуратный Markdown-список для подтверждения."""
    labels = {
        'ru': {
            'rail_type': 'Тип ж/д услуги',
            'origin_station': 'Станция отправления',
            'destination_station': 'Станция назначения',
            'cargo_name': 'Наименование груза',
            'wagon_type': 'Подвижной состав',
            'fleet_provision': 'Предоставление парка',
            'volume': 'Объем перевозки',
            'comments': 'Примечания/Требования',
            'origin_location': 'Пункт погрузки',
            'destination_location': 'Пункт выгрузки',
            'truck_type': 'Тип автотранспорта',
            'weight_and_volume': 'Вес и объем',
            'readiness_date': 'Дата готовности',
            'origin_airport': 'Аэропорт вылета',
            'destination_airport': 'Аэропорт прилета',
            'cargo_category': 'Характер авиагруза',
            'weight_and_dims': 'Вес и габариты (Д×Ш×В)',
            'pickup_required': 'Забор груза (Pick-up)',
            'route': 'Маршрут',
            'multimodal_scheme': 'Логистическая схема',
            'equipment_type': 'Оборудование / Контейнеры',
            'containers_and_weight': 'Кол-во и вес',
            'country_and_post': 'Страна и таможенный пост',
            'customs_regime': 'Таможенный режим',
            'goods_and_hs_code': 'Товар и код ТН ВЭД',
            'certification': 'Сертификация',
            'railway_administrations': 'Железные дороги',
            'border_junctions': 'Погранпереходы / Стыки',
            'forwarding_services': 'Требуемые сервисы'
        },
        'en': {
            'rail_type': 'Rail Service Type',
            'origin_station': 'Origin Station',
            'destination_station': 'Destination Station',
            'cargo_name': 'Cargo Description',
            'wagon_type': 'Rolling Stock',
            'fleet_provision': 'Wagon Provision',
            'volume': 'Volume / Quantity',
            'comments': 'Remarks / Instructions',
            'origin_location': 'Pick-up Location',
            'destination_location': 'Delivery Location',
            'truck_type': 'Truck Type',
            'weight_and_volume': 'Weight & Volume',
            'readiness_date': 'Cargo Ready Date',
            'origin_airport': 'Departure Airport',
            'destination_airport': 'Arrival Airport',
            'cargo_category': 'Air Cargo Category',
            'weight_and_dims': 'Gross Weight & Dims',
            'pickup_required': 'Pick-up Required',
            'route': 'Route',
            'multimodal_scheme': 'Transport Mode',
            'equipment_type': 'Equipment Type',
            'containers_and_weight': 'Quantity & Weight',
            'country_and_post': 'Customs Post & Country',
            'customs_regime': 'Customs Regime',
            'goods_and_hs_code': 'Goods & HS Code',
            'certification': 'Certification',
            'railway_administrations': 'Railways',
            'border_junctions': 'Border Crossings',
            'forwarding_services': 'Services Scope'
        },
        'zh': {
            'rail_type': '铁路服务类型',
            'origin_station': '始发站点',
            'destination_station': '终到站点',
            'cargo_name': '货物中文品名',
            'wagon_type': '车皮/车型种类',
            'fleet_provision': '车皮调配提供方',
            'volume': '发运体量/车数',
            'comments': '特别作业需求',
            'origin_location': '装货出发地',
            'destination_location': '卸货目的地',
            'truck_type': '汽运车型/挂车规格',
            'weight_and_volume': '毛重与体积',
            'readiness_date': '货物备妥发货日',
            'origin_airport': '起飞空运机场',
            'destination_airport': '目的港空运机场',
            'cargo_category': '空运品类特性',
            'weight_and_dims': '单件毛重与外廓尺寸',
            'pickup_required': '上门提货服务',
            'route': '全程联运路径',
            'multimodal_scheme': '多式联运走廊',
            'equipment_type': '集装箱装备箱型',
            'containers_and_weight': '箱量与货重',
            'country_and_post': '申报海关口岸',
            'customs_regime': '报关申报监管方式',
            'goods_and_hs_code': '商品品名及海关编码',
            'certification': '检验检疫/产地证',
            'railway_administrations': '过境铁路路局',
            'border_junctions': '换装国境口岸',
            'forwarding_services': '全段代缴与增值服务'
        }
    }
    
    current_labels = labels.get(lang, labels['ru'])
    lines = []
    
    for key, val in data.items():
        if key in ('service_type', 'service_name'):
            continue
        label = current_labels.get(key, key.replace('_', ' ').capitalize())
        lines.append(f"• **{label}:** {val}")
        
    return "\n".join(lines)

