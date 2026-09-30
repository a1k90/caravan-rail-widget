import re

def clean_station_name(raw):
    if not raw: return ''
    # remove ст., brackets, parentheses
    s = re.sub(r'ст\.\s*', '', raw, flags=re.I)
    s = re.sub(r'\(.*?\)', '', s)
    s = re.sub(r'\[.*?\]', '', s)
    word = re.split(r'[\s\-]', s.strip())[0]
    return re.sub(r'[^\u0400-\u04FFa-zA-Z]', '', word).lower()

print("Testing clean_station_name:")
print("ст. Кокшетау I (687008, КТЖ) ->", clean_station_name("ст. Кокшетау I (687008, КТЖ)"))
print("ст. Сарыагаш (эксп.) [КТЖ] ->", clean_station_name("ст. Сарыагаш (эксп.) [КТЖ]"))
print("ст. Келес (эксп.) [УТИ] ->", clean_station_name("ст. Келес (эксп.) [УТИ]"))
print("Ташкент-Товарный (720000, УТИ) ->", clean_station_name("Ташкент-Товарный (720000, УТИ)"))
print("ст. Чукурсай (720000) ->", clean_station_name("ст. Чукурсай (720000)"))
