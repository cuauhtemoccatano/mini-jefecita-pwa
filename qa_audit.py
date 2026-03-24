import asyncio
from playwright.async_api import async_playwright
import os

async def run_audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        print("\n🚀 Iniciando Auditoría de Calidad Avanzada para Mini Jefecita...")
        
        try:
            # 1. Cargar App
            # Intentamos detectar si el servidor está corriendo en 8080 o usamos file path
            url = "http://localhost:8080"
            print(f"🔗 Conectando a {url}...")
            
            try:
                await page.goto(url, timeout=5000)
            except:
                print("⚠️  Servidor no detectado. Por favor, corre 'python3 -m http.server 8080' en el directorio raíz.")
                await browser.close()
                return

            # Limpiar estado para prueba pura
            await page.evaluate("localStorage.clear();")
            await page.reload(wait_until="networkidle")
            
            # 2. Verificar Loader
            print("⏳ Esperando que el loader desaparezca...")
            await page.wait_for_selector("#ai-loader", state="hidden", timeout=5000)
            print("✅ Loader oculto correctamente.")

            # 3. Prueba de Navegación (NÚCLEO)
            print("🗺️  Probando navegación entre pestañas...")
            tabs = ["ejercicio", "avisos", "diario", "mensajes", "inicio"]
            for tab_name in tabs:
                tab_selector = f".tab-item[data-view='{tab_name}']"
                view_selector = f"#view-{tab_name}"
                
                await page.click(tab_selector)
                await page.wait_for_selector(view_selector, state="visible")
                
                # Verificar clics bloqueados
                is_visible = await page.is_visible(view_selector)
                if is_visible:
                    print(f"  - Pestaña '{tab_name}': OK")
                else:
                    print(f"  - Pestaña '{tab_name}': ❌ ERROR (No visible)")

            # 4. Prueba Desktop (Layout)
            print("🖥️  Capturando vista Mac...")
            await page.set_viewport_size({"width": 1280, "height": 800})
            await page.screenshot(path="qa_desktop_mac.png")
            
            # 5. Prueba Mobile (Layout)
            print("📱 Capturando vista iPhone...")
            await page.set_viewport_size({"width": 430, "height": 932})
            await page.screenshot(path="qa_mobile_iphone.png")

            print("\n✨ Auditoría terminada con ÉXITO.")
            print("📸 Revisa 'qa_desktop_mac.png' y 'qa_mobile_iphone.png' para validación visual.")

        except Exception as e:
            print(f"\n❌ FALLO CRÍTICO EN AUDITORÍA: {e}")
            print("Asegúrate de que los selectores en index.html coincidan con app.js y qa_audit.py")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_audit())
