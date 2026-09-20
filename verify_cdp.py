#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CDP Verification Script for Caravan Railroad Dual Border Routing
Connects to Chrome via WebSocket DevTools Protocol
"""

import asyncio
import base64
import json
import urllib.request
import websockets

async def send_cmd(ws, msg_id, method, params=None):
    payload = {"id": msg_id, "method": method}
    if params:
        payload["params"] = params
    await ws.send(json.dumps(payload))
    while True:
        resp = await ws.recv()
        data = json.loads(resp)
        if data.get("id") == msg_id:
            return data

async def run_verification():
    res = urllib.request.urlopen("http://127.0.0.1:9222/json/list")
    pages = json.loads(res.read().decode())
    target = None
    for p in pages:
        if "localhost:8085" in p.get("url", ""):
            target = p
            break
    if not target:
        target = pages[0]

    ws_url = target["webSocketDebuggerUrl"]
    print(f"Connecting to Chrome page: {target.get('title')} ({ws_url})")

    async with websockets.connect(ws_url, max_size=25*1024*1024) as ws:
        msg_id = 1

        await send_cmd(ws, msg_id, "Page.enable"); msg_id += 1
        await send_cmd(ws, msg_id, "Runtime.enable"); msg_id += 1

        # Navigate to index.html#calc
        print("Navigating to http://localhost:8085/index.html#calc ...")
        await send_cmd(ws, msg_id, "Page.navigate", {"url": "http://localhost:8085/index.html#calc"}); msg_id += 1
        await asyncio.sleep(1.5)

        # 0. BILATERAL DEFAULT ROUTE (Кокшетау -> Ташкент)
        bilateral_js = """
        (function() {
            var calcTabBtn = document.getElementById('cr-calc-tab-btn');
            if (calcTabBtn) calcTabBtn.click();
            var customModeBtn = document.getElementById('cr-btn-mode-custom');
            if (customModeBtn) customModeBtn.click();

            var from = document.getElementById('cr-calc-from');
            var to = document.getElementById('cr-calc-to');
            from.value = 'Кокшетау (687008, КТЖ)';
            to.value = 'Ташкент-Товарный (720000, УТИ)';
            from.dispatchEvent(new Event('input'));
            document.getElementById('cr-btn-execute-calc').click();

            return {
                singleDisplay: document.getElementById('cr-border-single-wrap').style.display,
                dualDisplay: document.getElementById('cr-border-dual-wrap').style.display,
                borderValue: document.getElementById('cr-calc-border').value,
                km: document.getElementById('cr-calc-km').value,
                dist: document.getElementById('cr-rs-distance').innerText
            };
        })()
        """
        r0 = await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": bilateral_js, "returnByValue": True}); msg_id += 1
        print("\n--- 0. BILATERAL ROUTE (Кокшетау -> Ташкент) ---")
        print(json.dumps(r0.get("result", {}).get("result", {}).get("value"), indent=2, ensure_ascii=False))

        await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": "document.getElementById('cr-border-selection-container').scrollIntoView({block: 'center'});"}); msg_id += 1
        await asyncio.sleep(0.4)
        ss0 = await send_cmd(ws, msg_id, "Page.captureScreenshot", {"format": "png"}); msg_id += 1
        with open("screenshot_bilateral_kokshetau_tashkent.png", "wb") as f:
            f.write(base64.b64decode(ss0["result"]["data"]))
        print("Saved screenshot_bilateral_kokshetau_tashkent.png")

        # 1. TRANSIT ROUTE (Москва -> Ташкент) with default borders (Илецк I and Сарыагаш)
        transit_iletsk_js = """
        (function() {
            var from = document.getElementById('cr-calc-from');
            var to = document.getElementById('cr-calc-to');
            from.value = 'Москва-Товарная-Смоленская (198005, РЖД)';
            to.value = 'Ташкент-Товарный (720000, УТИ)';
            from.dispatchEvent(new Event('input'));

            var b1 = document.getElementById('cr-calc-border-1');
            b1.value = '666501'; // Илецк I
            b1.dispatchEvent(new Event('change'));

            var b2 = document.getElementById('cr-calc-border-2');
            b2.value = '704101'; // Сарыагаш
            b2.dispatchEvent(new Event('change'));

            document.getElementById('cr-btn-execute-calc').click();

            return {
                singleDisplay: document.getElementById('cr-border-single-wrap').style.display,
                dualDisplay: document.getElementById('cr-border-dual-wrap').style.display,
                b1: document.getElementById('cr-calc-border-1').value,
                b2: document.getElementById('cr-calc-border-2').value,
                km: document.getElementById('cr-calc-km').value,
                dist: document.getElementById('cr-rs-distance').innerText
            };
        })()
        """
        r1 = await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": transit_iletsk_js, "returnByValue": True}); msg_id += 1
        print("\n--- 1. TRANSIT: ИЛЕЦК I + САРЫАГАШ ---")
        print(json.dumps(r1.get("result", {}).get("result", {}).get("value"), indent=2, ensure_ascii=False))

        await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": "document.getElementById('cr-route-scheme-box').scrollIntoView({block: 'center'});"}); msg_id += 1
        await asyncio.sleep(0.4)
        ss1 = await send_cmd(ws, msg_id, "Page.captureScreenshot", {"format": "png"}); msg_id += 1
        with open("screenshot_transit_iletsk_saryagash.png", "wb") as f:
            f.write(base64.b64decode(ss1["result"]["data"]))
        print("Saved screenshot_transit_iletsk_saryagash.png")

        # 2. TRANSIT ROUTE: SWITCH BORDER 1 TO ОЗИНКИ (664900)
        transit_ozinki_js = """
        (function() {
            var b1 = document.getElementById('cr-calc-border-1');
            b1.value = '664900'; // Озинки
            b1.dispatchEvent(new Event('change'));
            document.getElementById('cr-btn-execute-calc').click();

            return {
                b1: document.getElementById('cr-calc-border-1').value,
                b2: document.getElementById('cr-calc-border-2').value,
                km: document.getElementById('cr-calc-km').value,
                dist: document.getElementById('cr-rs-distance').innerText
            };
        })()
        """
        r2 = await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": transit_ozinki_js, "returnByValue": True}); msg_id += 1
        print("\n--- 2. TRANSIT: ОЗИНКИ + САРЫАГАШ ---")
        print(json.dumps(r2.get("result", {}).get("result", {}).get("value"), indent=2, ensure_ascii=False))

        await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": "document.getElementById('cr-route-scheme-box').scrollIntoView({block: 'center'});"}); msg_id += 1
        await asyncio.sleep(0.4)
        ss2 = await send_cmd(ws, msg_id, "Page.captureScreenshot", {"format": "png"}); msg_id += 1
        with open("screenshot_transit_ozinki_saryagash.png", "wb") as f:
            f.write(base64.b64decode(ss2["result"]["data"]))
        print("Saved screenshot_transit_ozinki_saryagash.png")

        # 3. TRANSIT ROUTE: SWITCH BORDER 2 TO БЕЙНЕУ (662905)
        transit_beyneu_js = """
        (function() {
            var b2 = document.getElementById('cr-calc-border-2');
            b2.value = '662905'; // Бейнеу
            b2.dispatchEvent(new Event('change'));
            document.getElementById('cr-btn-execute-calc').click();

            return {
                b1: document.getElementById('cr-calc-border-1').value,
                b2: document.getElementById('cr-calc-border-2').value,
                km: document.getElementById('cr-calc-km').value,
                dist: document.getElementById('cr-rs-distance').innerText
            };
        })()
        """
        r3 = await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": transit_beyneu_js, "returnByValue": True}); msg_id += 1
        print("\n--- 3. TRANSIT: ОЗИНКИ + БЕЙНЕУ ---")
        print(json.dumps(r3.get("result", {}).get("result", {}).get("value"), indent=2, ensure_ascii=False))

        await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": "document.getElementById('cr-route-scheme-box').scrollIntoView({block: 'center'});"}); msg_id += 1
        await asyncio.sleep(0.4)
        ss3 = await send_cmd(ws, msg_id, "Page.captureScreenshot", {"format": "png"}); msg_id += 1
        with open("screenshot_transit_ozinki_beyneu.png", "wb") as f:
            f.write(base64.b64decode(ss3["result"]["data"]))
        print("Saved screenshot_transit_ozinki_beyneu.png")

        # 4. TARIFF BREAKDOWN TABLE INSPECTION (3 LEGS)
        table_js = """
        (function() {
            document.getElementById('cr-rtariff-table').scrollIntoView({block: 'center'});
            var rows = [];
            var trs = document.querySelectorAll('#cr-rtariff-tbody tr');
            trs.forEach(function(tr) {
                var cols = [];
                tr.querySelectorAll('td').forEach(function(td) { cols.push(td.innerText.trim().replace(/\\s+/g, ' ')); });
                rows.push(cols);
            });
            return rows;
        })()
        """
        r4 = await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": table_js, "returnByValue": True}); msg_id += 1
        rows = r4.get("result", {}).get("result", {}).get("value")
        print("\n--- 4. TARIFF BREAKDOWN TABLE (3 TRANSIT LEGS) ---")
        for row in rows:
            print(" | ".join(row))

        await asyncio.sleep(0.4)
        ss4 = await send_cmd(ws, msg_id, "Page.captureScreenshot", {"format": "png"}); msg_id += 1
        with open("screenshot_tariff_table_3legs.png", "wb") as f:
            f.write(base64.b64decode(ss4["result"]["data"]))
        print("Saved screenshot_tariff_table_3legs.png")

        # 5. TEST EMBEDDED WIDGET (test_embed.html)
        print("\n--- 5. TESTING EMBEDDED WIDGET (test_embed.html) ---")
        await send_cmd(ws, msg_id, "Page.navigate", {"url": "http://localhost:8085/test_embed.html?v=241"}); msg_id += 1
        await asyncio.sleep(1.5)

        embed_test_js = """
        (function() {
            var calcTabBtn = document.getElementById('cr-calc-tab-btn');
            if (calcTabBtn) calcTabBtn.click();
            var customModeBtn = document.getElementById('cr-btn-mode-custom');
            if (customModeBtn) customModeBtn.click();

            var from = document.getElementById('cr-calc-from');
            var to = document.getElementById('cr-calc-to');
            from.value = 'Москва-Товарная-Смоленская (198005, РЖД)';
            to.value = 'Ташкент-Товарный (720000, УТИ)';
            from.dispatchEvent(new Event('input'));

            var b1 = document.getElementById('cr-calc-border-1');
            b1.value = '664900';
            b1.dispatchEvent(new Event('change'));

            document.getElementById('cr-btn-execute-calc').click();

            return {
                singleDisplay: document.getElementById('cr-border-single-wrap').style.display,
                dualDisplay: document.getElementById('cr-border-dual-wrap').style.display,
                b1: document.getElementById('cr-calc-border-1').value,
                b2: document.getElementById('cr-calc-border-2').value,
                km: document.getElementById('cr-calc-km').value,
                dist: document.getElementById('cr-rs-distance').innerText
            };
        })()
        """
        r5 = await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": embed_test_js, "returnByValue": True}); msg_id += 1
        print("Embedded widget verification:", json.dumps(r5.get("result", {}).get("result", {}).get("value"), indent=2, ensure_ascii=False))

        await send_cmd(ws, msg_id, "Runtime.evaluate", {"expression": "document.getElementById('cr-route-scheme-box').scrollIntoView({block: 'center'});"}); msg_id += 1
        await asyncio.sleep(0.4)
        ss5 = await send_cmd(ws, msg_id, "Page.captureScreenshot", {"format": "png"}); msg_id += 1
        with open("screenshot_embedded_tilda_widget.png", "wb") as f:
            f.write(base64.b64decode(ss5["result"]["data"]))
        print("Saved screenshot_embedded_tilda_widget.png")

asyncio.run(run_verification())
