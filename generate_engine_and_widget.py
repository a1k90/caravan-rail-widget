import json, math, os, re

# 1. Load stations and cargo
with open('railway_stations.json', 'r', encoding='utf-8') as f:
    stations = json.load(f)

with open('railway_cargo_bundle.json', 'r', encoding='utf-8') as f:
    cargo_items = json.load(f)

print(f"Loaded {len(stations)} stations and {len(cargo_items)} cargo items")

