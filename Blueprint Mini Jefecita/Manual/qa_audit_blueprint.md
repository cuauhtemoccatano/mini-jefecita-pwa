# Blueprint: Scripts de Calidad (`qa_audit.py`)

## Identidad del Componente
- **Nombre:** `qa_audit.py`
- **Ubicación:** Raíz del Repositorio (`/`)
- **Tipo:** Motor de Automatización E2E (End-to-End Testing) / Visual Regresion Tester.

---

## 1. Responsabilidad Única (SRP)
Certificar programáticamente que la estructura crítica de navegación y renderizado (DOM) de Mini Jefecita funciona correctamente sin errores humanos, simulando comportamientos de usuario real, e ignorando el caché mediante la limpieza forzada del entorno.

## 2. Anatomía Funcional
- **Dependencia Principal:** Utiliza `playwright` asíncrono (`async_playwright`). A diferencia de bibliotecas como Selenium, Playwright controla un Chromium *Headless* en nivel profundo para probar interceptación de red.
- **Flujo de Ejecución (El Pipeline):**
  1. **Ping de Vida:** Verifica si la app responde en `http://localhost:8080` (Asegurando que el dev levantó el servidor de pruebas).
  2. **Amnesia Forzada:** Ejecuta `localStorage.clear()` y recarga la página. Esto garantiza un estado "Puro", simulando a un usuario instalando la PWA por primera vez.
  3. **Espera de DOM:** Usa `wait_for_selector("#ai-loader", state="hidden")` en lugar de tiempos muertos (`sleep`). Es inteligente, sabe cuándo la app dejó de procesar la inicialización pesada del `app.js`.
  4. **Click-Testing (Núcleo):** Itera sobre un Array de Pestañas (`"ejercicio", "avisos", "diario", "mensajes", "inicio"`). Hace click programático en cada botón de la Bottom-Bar y evalúa la aserción de si el contenedor asociado `#view-X` pasó a estar visible.
  5. **Visual QA:** Genera dos *Screenshots* exactos: Uno a `1280x800` (Mac) y otro a `430x932` (iPhone), escupiendo las fotos al directorio raíz.

---

## 3. Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| **`index.html`:** Los selectores CSS de este script (`.tab-item[data-view='X']`) dependen estrictamente de que el HTML no sufra mutaciones semánticas. | **El Protocolo de Agentes (`AGENTS.md`):** Exige el uso de testing antes de reportar un cierre de tarea exitoso (`verification-before-completion`). |

---

## 4. Sugerencia de Refactorización (Evolución de Procesos)

> [!TIP]
> **Silencio en el Catch de Navegación:**
> Actualmente, en el bloque Try/Catch (#1), si Playwright logra entrar a la página pero ocurre un fallo sutil en uno de los pasos de inicio, el motor podría cerrar el navegador abruptamente ejecutando `return` sin reportar el `stack trace` del error de consola del Chromium.
> **Mejora:** Inyectar un Listener de consola antes del `page.goto()`. Ej: `page.on("console", lambda msg: print(f"Browser Log: {msg.text}"))`. Esto convertiría a este Test E2E en un depurador omnisciente capaz de reportar si existe un error de sintaxis JS o CORS escondido en `app.js` antes siquiera de probar los botones.

> [!NOTE]
> **Aprendizaje para el Junior:**
> Este archivo es la encarnación del concepto de **Zero-Trust QA (Cero Suposiciones)**. Como desarrollador, tu mente tiende a pensar: *"Yo solo cambié el color de un botón, no necesito probar nada"*. Este bot de Python es el juez implacable. En menos de 5 segundos corrobora que no introdujiste accidentalmente un `z-index` que impida hacer clic en las pestañas (causa común de fallo de TAPs en PWA de vidrio). ¡Siempre córrelo antes de un `git push`!
