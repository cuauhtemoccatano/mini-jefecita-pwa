# Blueprint: `index.html`

## Identidad del Componente
- **Archivo:** `index.html`
- **Tipo:** UI / Entry Point
- **Ubicación:** Raíz del proyecto (`/index.html`)

## Responsabilidad Única (SRP)
Define la estructura principal interactiva de la PWA "Mini Jefecita", estableciendo el canvas (DOM) sobre el cual los estilos (`style.css`) y la lógica (`app.js`) operan para crear una experiencia de usuario (UX) inmersiva y fluida.

## Anatomía Funcional

### Entradas (Inputs/Props)
Siendo el archivo raíz HTML, no recibe "props" al estilo de componentes React, pero requiere de recursos externos para "nacer":
- **`style.css`**: Para la capa de presentación y diseño visual.
- **`app.js`**: Para la inyección de la lógica interactiva y dinámica.
- **`manifest.json`**: Para que el navegador reconozca la aplicación como una PWA instalable.
- **`icons/icon-192.png`**: Como ícono de la aplicación (Apple Touch Icon).
- **`three.min.js`** (CDN): Para el renderizado del Santuario 3D en el "Zen View".

### Variables y Constantes (Estructura de Datos en DOM)
El DOM actúa como un estado estático inicial. Define contenedores críticos (`id`s y `class`es) que la lógica usará como referencias:
- **`#app`**: Contenedor principal de la aplicación.
- **`.view`**: Contenedores de las diferentes pantallas (Inicio, Ejercicio, Avisos, Diario, Mensajes, Zen).
- **`#tab-bar`**: Barra de navegación entre pantallas.
- **Modales/Overlays**: `#update-toast`, `#ai-bg-downloader`, `#care-suggestion`, `#settings-modal`, `#diario-lock-screen`.

### Estado Local
El estado de la UI (qué pantalla está activa, si un modal está abierto) está gestionado parcialmente por las clases CSS iniciales (ej. `.view.active`, `.hidden`, `style="display: none;"`).

### Lógica de Métodos (Semántica HTML)
El HTML no tiene "métodos" en sí, pero su semántica dicta la intención:
- **Navegación por Pestañas:** Facilita la transición entre contextos (Inicio, Salud, Avisos, etc.).
- **Modales Preventivos:** Elementos como `#diario-lock-screen` preparan el terreno para la lógica de seguridad (FaceID/TouchID).
- **Santuario 3D (`#zen-3d-canvas`)**: Un canvas dedicado exclusivamente a la experiencia inmersiva con Three.js.

### Efectos Secundarios
Carga recursos externos (CSS, JS, Manifest, WebGL via Three.js), lo que impacta la red y los recursos del dispositivo del usuario (memoria RAM/GPU).

### Manejo de Excepciones
Provee "Empty States" visuales (ej. `<p class="empty-state">No hay registros nuevos.</p>`) como *fallbacks* iniciales por si no hay datos cargados aún, previniendo pantallas en blanco rotas.

### Ciclo de Vida
1. **Parseo HTML**: El navegador lee el archivo y construye el DOM.
2. **Carga de Assets**: CSS y Web Fonts son interpretados, pintando la UI inicial.
3. **Ejecución Lógica**: `app.js` (como `type="module"`) toma el control del DOM inyectando eventos y datos dinámicos.

---

## Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| `style.css` (Interfaz) | `app.js` (Necesita los `ID`s y clases para funcionar) |
| `manifest.json` (Motor PWA) | Navegador (Punto de entrada) |
| `three.min.js` (Motor 3D) |  |
| `app.js` (Cerebro lógico) |  |

---

## Flujo de Datos
1. El usuario abre la PWA.
2. El navegador lee `index.html`.
3. Se invoca a `style.css` para aplicar el diseño y las animaciones base.
4. Se cargan librerías pesadas en paralelo (`three.min.js`).
5. Se ejecuta `app.js`, que localiza los selectores del DOM (ej. `#greeting`, `#exercise-streak-val`) para hidratarlos con la información del usuario (Base de datos local o remota).
6. Las acciones del usuario (click en `#btn-settings`, tabs) disparan eventos gestionados por `app.js`.

---

## Sugerencia de Refactorización

> [!TIP]
> **Refactorización de Modales:**
> Actualmente, los modales (como `#settings-modal` y `#diario-lock-screen`) usan atributos inline como `style="display: none;"` mezclados con clases CSS como `.hidden`.
> **Mejora:** Unifica la estrategia de ocultamiento de elementos del DOM delegándola **completamente al CSS**. Usa clases utilitarias consistentes (ej. `.is-hidden` o `.is-visible`) controladas desde Javascript. Evitar los estilos inline ayuda a mantener el *Clean Code* y facilita animaciones con `opacity` / `transform` o la API de Web Animations.

> [!NOTE]
> **Aprendizaje para el Junior:**
> Fíjate cómo la aplicación usa un contenedor principal `<div id="app">` para albergar múltiples `<section class="view">`. Esto se conoce como estructura **Single Page Application (SPA)** simulada, donde el usuario navega entre pantallas sin refrescar el navegador. La "magia" ocurre ocultando `sections` inactivas y mostrando la `.active` mediante CSS.
