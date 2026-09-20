#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build Caravan Railroad Widget Bundle
Creates:
1. caravan-widget.js (Single-file embeddable SDK for Tilda / external sites)
2. caravan-widget.css (Standalone CSS)
3. tilda-embed-snippet.html (3-line HTML snippet to paste into Tilda T123 block)
4. test_embed.html (Local test page verifying the external embed works)
"""

import json

def build():
    with open('caravan-tracking-widget.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. HTML extraction
    html_end = content.find('<style>')
    html_code = content[:html_end].strip()

    # 2. CSS extraction
    css_start = content.find('<style>') + len('<style>')
    css_end = content.find('</style>')
    css_code = content[css_start:css_end].strip()

    # 3. JS extraction
    js_start = content.find('<script>') + len('<script>')
    js_end = content.rfind('</script>')
    js_code = content[js_start:js_end].strip()

    # Save standalone CSS
    with open('caravan-widget.css', 'w', encoding='utf-8') as f:
        f.write(css_code)

    # Encode HTML & CSS as JSON strings to safely embed in JS without escaping issues
    json_html = json.dumps(html_code, ensure_ascii=False)
    json_css = json.dumps(css_code, ensure_ascii=False)

    bundle_js = f"""/**
 * Caravan Railroad — Интерактивный модуль 1520 мм (Трекинг, Калькулятор, Incoterms 2020)
 * Автономный SDK-бандл для мгновенного внедрения в Tilda Publishing и сторонние CMS.
 * Версия: 2.4.0 (Caravan 1520 Digital Core)
 */
(function() {{
  'use strict';
  if (window.__CARAVAN_RAILROAD_LOADED__) return;
  window.__CARAVAN_RAILROAD_LOADED__ = true;

  var WIDGET_HTML = {json_html};
  var WIDGET_CSS = {json_css};

  // 1. Динамическое внедрение стилей в <head>
  function injectStyles() {{
    if (document.getElementById('caravan-widget-styles')) return;
    var styleEl = document.createElement('style');
    styleEl.id = 'caravan-widget-styles';
    styleEl.textContent = WIDGET_CSS;
    document.head.appendChild(styleEl);
  }}

  // 2. Внедрение разметки виджета в контейнер
  function mountWidget() {{
    injectStyles();

    var container = document.getElementById('caravan-tracking-root') || 
                    document.getElementById('caravan-calc-app') ||
                    document.getElementById('caravan-widget');

    if (!container) {{
      var scriptTag = document.currentScript;
      if (scriptTag && scriptTag.parentNode) {{
        container = document.createElement('div');
        container.id = 'caravan-tracking-root';
        container.className = 'cr-widget';
        scriptTag.parentNode.insertBefore(container, scriptTag);
      }} else {{
        container = document.createElement('div');
        container.id = 'caravan-tracking-root';
        container.className = 'cr-widget';
        document.body.appendChild(container);
      }}
    }}

    container.innerHTML = WIDGET_HTML;

    // 3. Запуск логики калькулятора и трекинга
    runAppLogic();
  }}

  function runAppLogic() {{
{js_code}
  }}

  if (document.readyState === 'loading') {{
    document.addEventListener('DOMContentLoaded', mountWidget);
  }} else {{
    mountWidget();
  }}
}})();
"""

    with open('caravan-widget.js', 'w', encoding='utf-8') as f:
        f.write(bundle_js)

    # 4. Create snippet for Tilda
    snippet_html = """<!-- ====================================================================
     CARAVAN RAILROAD — ВИДЖЕТ ТРЕКИНГА И КАЛЬКУЛЯТОРА ДЛЯ БЛОКА T123 В ТИЛЬДЕ
     Инструкция: Скопируйте этот блок кода целиком и вставьте в блок T123.
     Замените YOUR_CDN_URL на ссылку вашего скрипта (GitHub Pages, jsDelivr или ваш сервер)
     ==================================================================== -->
<div id="caravan-tracking-root"></div>
<script src="https://cdn.jsdelivr.net/gh/USERNAME/CaravanRailRoad@main/caravan-widget.js" defer></script>
"""
    with open('tilda-embed-snippet.html', 'w', encoding='utf-8') as f:
        f.write(snippet_html)

    # 5. Create test page to verify embed works locally
    test_page = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Тест внедрения виджета Caravan Railroad через 2 строки кода</title>
  <style>
    body {
      margin: 0;
      padding: 40px 20px;
      background-color: #070B14;
      font-family: 'Inter', sans-serif;
    }
    .test-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .test-banner {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid #F59E0B;
      padding: 16px;
      border-radius: 8px;
      color: #F59E0B;
      margin-bottom: 24px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="test-container">
    <div class="test-banner">
      ⚡ <b>Демонстрация внедрения в Тильду:</b> На этой странице нет ни одной строчки стилей калькулятора или логики расчетов. Вся система (калькулятор, трекинг, Incoterms, автокомплит станций) загружается ровно через один тег &lt;script src="caravan-widget.js"&gt;.
    </div>

    <!-- ТОЧНО ТАКОЙ ЖЕ КОД ВСТАВЛЯЕТСЯ В T123 ТИЛЬДЫ: -->
    <div id="caravan-tracking-root"></div>
    <script src="caravan-widget.js?v=241" defer></script>
  </div>
</body>
</html>
"""
    with open('test_embed.html', 'w', encoding='utf-8') as f:
        f.write(test_page)

    print("DONE! Generated:")
    print("1. caravan-widget.js")
    print("2. caravan-widget.css")
    print("3. tilda-embed-snippet.html")
    print("4. test_embed.html")

if __name__ == '__main__':
    build()
