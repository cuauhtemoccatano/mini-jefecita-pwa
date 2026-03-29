# Debug & Learning: `index.html` (Autopsia Quirúrgica)

## 1. Identidad y Propósito Crítico
- **Nombre:** `index.html`
- **Ubicación:** `/index.html`
- **Tipo:** Punto de Entrada (UI Entry Point) / Single Page Application Shell
- **El "Por Qué":** Si este archivo desaparece, **no hay aplicación**. Es el lienzo donde todo se dibuja. Define la estructura alámbrica indispensable: sin sus contenedores (`#app`, `.view`), el motor matemático (`app.js`) no tiene dónde inyectar datos, y el motor de estilos (`style.css`) no tiene a quién vestir.

---

## 2. Anatomía Funcional (Deep Dive)

### Estado y Datos
El DOM (Document Object Model) actúa como un estado inicial hardcodeado y pasivo.
- **Identificadores Persistentes (`id="view-..."`)**: Estos nodos viven permanentemente en la memoria del navegador mientras la app esté abierta. Representan los contextos principales (Inicio, Salud, Diario, etc.).
- **Identificadores Volátiles (Data Inyectada)**: Nodos como `<span id="health-steps-val">0</span>` nacen con un valor falso (`0`) que solo sobrevive milisegundos hasta que `app.js` lo sobreescribe.

### Lógica de Métodos (El Cerebro Estructural)
La estrategia detrás de este HTML no es usar múltiples archivos (`ejercicio.html`, `diario.html`), sino implementar un patrón **SPA (Single Page Application) vía CSS**. 
Todos los "Tabs" de la aplicación cargan de golpe al abrir el archivo, pero solo uno tiene la clase `.active`. La lógica dicta que es mucho más rápido y fluido en dispositivos móviles "mostrar/ocultar" capas pre-renderizadas que pedirle al servidor una página web nueva cada vez que tocas un botón.

### Efectos Secundarios (Side Effects)
- **Bloqueo del Hilo Principal:** Al importar `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>` en el `<head>` o cuerpo principal sin `defer` o `async`, este archivo detiene la pintura visual de la app hasta que el motor WebGL 3D baje de internet. Esto ralentiza el FCP (First Contentful Paint).

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info (Inbound):** 
  - El Navegador lee la URL y solicita este archivo al servidor (Vercel).
  - El sistema detecta etiquetas `<link href="style.css">` y `<script src="app.js">` y dispara las descargas.
- **A dónde va la info (Outbound):** 
  - La estructura DOM parseada es entregada como un árbol vivo a `app.js`. Una vez construido, `app.js` asume el control total y este HTML pasa de ser un arquitecto a ser un sirviente ciego de los comandos de Javascript.

---

## 4. Guía de Intervención (Para corregir errores de UI)

### Puntos de Fallo Comunes
1. **"La app está en blanco / No carga el chat":** Revisa la línea donde se importa `app.js`. Si hay un error de tipeo o el archivo JS falla, el HTML se queda estancado en sus valores fantasma (Ej: Mostrará "Cargando..." en vez del saludo).
2. **"Toqué una pestaña y no cambia":** Probablemente alguien borró los atributos `data-view="..."` en los `<button class="tab-item">`. Esos strings DEBEN coincidir exactamente con los `id="view-..."` de las secciones.
3. **"Flasheo de pantalla al abrir un modal":** Problemas de superposición de capas. Ocurre si un `<div class="modal">` se coloca accidentalmente dentro de un contenedor con `overflow: hidden;` en lugar de estar al nivel de la raíz del `<main>` o `body`.

### Dónde poner el "Print / Breakpoint" visual
> [!CAUTION]
> Si la inyección de IA falla y la barra de progreso "se congela" eternamente, inspecciona el nodo `<div id="ai-bg-downloader">`. Modifica temporalmente en DevTools su clase quitando `.hidden`. Si logras verlo, el problema no es de renderizado HTML, sino de la Promesa no resuelta en `app.js`.

### Dependencias de Riesgo
- **Three.js CDN (`cdnjs...`)**: Si Cloudflare cae o la red del usuario bloquea CDN externos, todo el div del modo Zen (`#zen-3d-canvas`) fallará catastróficamente al intentar usar un objeto `THREE` inexistente en el scope global de Javascript.

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
Actualmente, el archivo tiene ~300 líneas y contiene ABSOLUTAMENTE TODA LA VISTA de la app (Inicios, modales de settings, historiales de chat, modos Zen abstractos). 
**La Fragilidad:** Si dos desarrolladores trabajan, uno en el chat y otro en salud, habrá conflictos masivos al fusionar cambios en Git en este único archivo.
**Cómo escalar:** Para que no se rompa al crecer, la aplicación requeriría evolucionar hacia **Web Components** nativos o un framework ligero híbrido (como Astro, Svelte o HTMX) que permita particionar el HTML en fragmentos pequeños (Ej: `<view-chat>`, `<view-zen>`) que se compilan en este `index.html` al hacer build.

### Consejo Senior (Clean Code)
**Principio Violado: Open/Closed Principle (OCP)** (De los principios SOLID aplicados a UI).
El HTML actual está **cerrado** a la extensión sin obligarte a modificar el código base. Si quieres añadir un nuevo Tab (Ej. "Nutrición"), estás obligado a modificar este archivo para inyectar un nuevo `<button>` en la barra y un nuevo `<section class="view">`. 
*Importa porque:* En una arquitectura madura, las vistas deberían inyectarse dinámicamente iterando sobre una configuración (JSON) desde JS, dejando el HTML intacto solo como el contenedor ("Shell") base.
