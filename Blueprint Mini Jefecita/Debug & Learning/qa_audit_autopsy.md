# Debug & Learning: Scripts de Calidad (`qa_audit.py`) (Autopsia Quirúrgica)

## 1. Identidad y Propósito Crítico
- **Nombre:** `qa_audit.py`
- **Ubicación:** Raíz del Repositorio (`/`)
- **Tipo:** Bot Evaluador E2E (End-to-End Test)
- **El "Por Qué":** Si este archivo desaparece, la app "Mini Jefecita" pierde su garantía de estabilidad en producción. En proyectos con UI complejas basadas en Glassmorphism y Z-Index apilados, es muy fácil romper el "Click" de un botón sin notarlo en código. Este bot es el único ente que "ve" la app como un humano y confirma que la navegación principal no está bloqueada.

---

## 2. Anatomía Funcional (Deep Dive)

### Estado y Datos (Entorno Limpio)
El script no mantiene estado persistente; su objetivo es destruirlo. 
- **`localStorage.clear()`:** Antes de iniciar cualquier evaluación lógica, purga deliberadamente todo estado anterior (`userData`, `healthData` guardados en el Service Worker de pruebas pasadas). Esto garantiza **Idempotencia**: Ejecutar el script 1 vez o 100 veces debe arrojar el mismo resultado determinista.

### Lógica de Métodos (El Cerebro Automatizado)
El algoritmo utiliza la librería `Playwright` (Microsoft) para controlar internamente el motor de renderizado de Chromium.
- **Sincronización por DOM, no por Tiempo:** El uso de `await page.wait_for_selector("#ai-loader", state="hidden")` es una práctica de ingeniería avanzada. Evita el clásico error *Junior* de poner `sleep(5)` (que falla si la PC está lenta o espera de más si está rápida). El bot *escucha* reactivamente los eventos de mutación (MutationObserver) que ocurren en `index.html`.
- **Evaluación de Visibilidad Real:** El método `page.is_visible(view_selector)` no solo comprueba que el `<div>` exista en el HTML. Playwright es tan potente que inyecta matemáticas de colisión; evalúa si el CSS permite que el píxel se dibuje en pantalla o si está oculto por un `display: none` o tapado `opacity: 0`.

### Efectos Secundarios (Side Effects)
- **Generación de Artefactos Visuales:** Escupe literalmente imágenes físicas (`.png`) al directorio donde se corrió: `qa_desktop_mac.png` y `qa_mobile_iphone.png`. Actúan como *"Prueba de Vida"* (Proof of Life) del renderizado bajo dos Layouts del CSS Responsive Grid.

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info (Inbound):** 
  - Del entorno nativo (Python local) conectándose al proceso hijo del navegador Chromium lanzado *Headless* (invisible).
  - Del servidor montado `http://localhost:8080`.
- **A dónde va la info (Outbound):** 
  - Hacia la terminal (Consola) con formato Emojis para una lectura amigable rápida.
  - Hacia el sistema de archivos local creando las capturas QA.

---

## 4. Guía de Intervención (Para corregir errores críticos)

### Puntos de Fallo Comunes
1. **"El QA falla de inmediato diciendo 'Servidor no detectado'":** El bot intenta interactuar con `http://localhost:8080`. Si abriste tu archivo HTML con un Live Server en el puerto `:3000` o dándole doble clic al disco duro (`file:///`), el bot abortará la prueba protegiéndote de probar entornos defectuosos para PWA/CORS.
2. **"El bot se queda atascado en 'Esperando que el loader desaparezca'":** Significa que hay un error letal de Javascript bloqueando la inicialización en `app.js`. El CSS `.hidden` jamás fue aplicado al `<div id="ai-loader">`. Típicamente es un cuelgue por WebGPU o Transformers.js cargando infinitamente o un error tipográfico en el código.
3. **"Falla el Test de Navegación indicando que (No visible)":** Si en terminal arroja `❌ ERROR (No visible)` en la pestaña de `ejercicio`, significa que en `index.html`, o bien la barra táctil inferior (Bottom Bar) cambió su atributo `data-view`, o los IDs de las secciones cambiaron y el JS no está logrando mutar la clase `.active`.

### Dónde poner el "Breakpoint" de Auditoría
> [!CAUTION]
> El bot opera "A ciegas" por defecto (`headless` activado internamente en Playwright).
> Para hacer "Debugging Visual" y ver tú mismo en cámara lenta qué está haciendo el bot mal o dónde hace click, debes modificar temporalmente la Línea 7:
> Cambia `await p.chromium.launch()` a `await p.chromium.launch(headless=False, slow_mo=1000)`
> Esto te abrirá una ventana real de Chrome donde verás al bot tecleando y clicando en tiempo real.

### Dependencias de Riesgo
- La paridad estricta (Acoplamiento de Strings) con `app.js` e `index.html`. El array `{"ejercicio", "avisos", "diario", "mensajes", "inicio"}` está escrito firmemente aquí. Si un diseñador cambia en HTML el nombre del tab "avisos" por "alertas" sin actualizar este bot Python, la cadena CI/CD colapsará reportando fallos falsos.

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
El script es un monolito procedural de un solo flujo (`run_audit`). Carece de un gestor de aserciones (`assert`) puro como `pytest`.
**La Fragilidad:** Si el testeo de "diario" falla, el loop se abortará o reportará sucio pero mezclado. Además, el bot asume siempre el "Camino Feliz" (Happy Path). No testea escenarios de borde, como "Qué pasa si el usuario clica repetidamente el botón mientras el 3D renderiza".
**Cómo Escalar:** A medida que crezca el proyecto, un Senior debe migrar de este script en crudo hacia el ejecutor `@playwright/test` oficial (portado a Javascript/Typescript) o en Python estructurando clases unitarias de testeo separando las responsabilidades de *Clicking*, *Snapshot Testing*, y *Manejo de CORS*.

### Consejo Senior (Flujos Categóricos y Snapshot Testing Automático)
**Principio: *Test de Regresión Visual Automático*.**
El script actual genera capturas (`.png`), pero deja la carga mental en el desarrollador de abrir la foto y decir *"Oh sí, se ve bien"*. Un humano eventualmente se cansará y saltará ese paso.
*El Siguiente Nivel:* Se debería añadir la librería `pixelmatch` o equivalente en Playwright para crear un **Snapshot Diff**. El script compararía las imágenes salvadas hoy matemáticamente contra las imágenes salvadas en el branch `main` ayer, aprobando el test *solamente* si hay 0% de diferencia de píxeles, logrando una automatización QA impenetrable frente a errores de CSS.
