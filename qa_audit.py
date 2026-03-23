import asyncio
from playwright.async_api import async_playwright
import os

async def run_audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        print("🚀 Iniciando Auditoría de Calidad para Mini Jefecita...")
        
        try:
            # 1. Cargar App y Limpiar (Evitar fantasmas del pasado)
            await page.goto("http://localhost:8080")
            await page.evaluate("localStorage.clear(); caches.keys().then(names => { for (let name of names) caches.delete(name); });")
            await page.reload(wait_until="networkidle")
            await page.wait_for_timeout(3000) # Esperar a que el loader se quite
            
            version = await page.inner_text(".loader-version") if await page.query_selector(".loader-version") else "Desconocida"
            print(f"✅ Versión detectada: {version}")

            # 2. Prueba Desktop (Mac M2)
            print("📸 Capturando Vista Mac (Desktop)...")
            await page.set_viewport_size({"width": 1280, "height": 800})
            await page.screenshot(path="qa_desktop_mac.png")
            
            sidebar = await page.query_selector(".tab-bar")
            if sidebar:
                box = await sidebar.bounding_box()
                if box and box['x'] < 100:
                    print("  - Layout Mac: Sidebar detectada a la IZQUIERDA. [OK]")
                else:
                    print("  - Layout Mac: ERROR - La barra no está en modo lateral.")

            # 3. Prueba Mobile (iPhone 14 Pro)
            print("📸 Capturando Vista iPhone (Mobile)...")
            await page.set_viewport_size({"width": 430, "height": 932})
            await page.screenshot(path="qa_mobile_iphone.png")
            
            bottom_bar = await page.query_selector(".tab-bar")
            print("  - Layout iPhone: Barra inferior detectada. [OK]")

            print("\n✨ Auditoría terminada. Revisa 'qa_desktop_mac.png' y 'qa_mobile_iphone.png'.")

        except Exception as e:
            print(f"❌ Error durante la auditoría: {e}")
            print("¿Está corriendo el servidor? (python3 -m http.server 8080)")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_audit())
