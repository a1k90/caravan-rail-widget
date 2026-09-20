with open('caravan-tracking-widget.html', 'r', encoding='utf-8') as f:
    widget_html = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# 1. Fix link tag in <head>
index_html = index_html.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Unbounded:wght@600;700;800&display=swap" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Unbounded:wght@600;700;800&display=swap" rel="stylesheet" />'
)

# 2. Embed widget_html directly inside <div id="tracking">
tracking_start = '<div id="tracking">'
tracking_end = '</div>\n\n    </div>\n  </main>'

# Find tracking div
pos_start = index_html.find(tracking_start)
pos_script = index_html.find('<!-- СКРИПТ ВСТРАИВАНИЯ ВИДЖЕТА')

# We replace from pos_start to the end of <script>
before_tracking = index_html[:pos_start + len(tracking_start)]

new_tracking_content = '\n' + widget_html + '\n      </div>\n    </div>\n  </main>\n\n  <footer class="site-footer">\n    <p>© 2026 Caravan Railroad. Международный железнодорожный оператор и экспедитор. Все права защищены.</p>\n  </footer>\n\n  <script>\n    // Автоматическое переключение на нужный таб при наличии хэша в URL (например #calc)\n    window.addEventListener("DOMContentLoaded", function() {\n      if (window.location.hash === "#calc") {\n        var calcBtn = document.querySelector("#caravan-tracking-root [data-tab=\'calc\']");\n        if (calcBtn) calcBtn.click();\n      }\n    });\n  </script>\n</body>\n</html>'

final_index = before_tracking + new_tracking_content

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(final_index)

print('Updated index.html with embedded widget and closed link tag. Length:', len(final_index))
