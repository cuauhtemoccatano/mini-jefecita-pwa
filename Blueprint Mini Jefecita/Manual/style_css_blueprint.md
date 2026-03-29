# Blueprint: `style.css`

## Identidad del Componente
- **Archivo:** `style.css`
- **Tipo:** UI / Design System Base
- **Ubicación:** Raíz del proyecto (`/style.css`)

## Responsabilidad Única (SRP)
Gestionar toda la capa de presentación visual, animaciones y responsividad de "Mini Jefecita", proveyendo un sistema de diseño consistente (Dark Mode / Glassmorphism) libre de frameworks externos.

## Anatomía Funcional

### Entradas (Inputs/Props)
No recibe entradas explícitas como una función, pero para que sea funcional requiere:
- El árbol DOM de `index.html` (para que los selectores CSS tengan a qué aplicarse).
- Variables de entorno del dispositivo (`env(safe-area-inset-bottom)`) para respetar el notch en iOS.

### Variables y Constantes (Design Tokens)
Se definen en el seudoclase `:root` para asegurar un *Single Source of Truth* de los colores y dimensiones principales:
- `--primary`: `#00C4B4` (El verde "Jade" característico).
- `--background`: `#0A0A0A` (Fondo puro oscuro).
- `--surface`: `#1A1A1A` (Gris oscuro para tarjetas y elevaciones).
- `--text` / `--text-secondary`: Blancos y grises para tipografías.
- `--safe-area-bottom`: Variable dinámica de iOS.

### Estado Local (Pseudo-estados y Clases de UI)
Maneja visualmente los "estados" de la interfaz alterando propiedades cuando se añaden o quitan ciertas clases desde JS:
- `.hidden`: Oculta elementos (`opacity: 0`, `pointer-events: none`).
- `.active`: Muestra elementos (ej. `display: block` en `.view.active`).
- `:focus` / `:active`: Efectos táctiles y de interacción (ej. escalar botones a `0.98`).

### Lógica de Métodos (Animaciones y Comportamiento)
- **Keyframes**: Define coreografías visuales que dan vida a la UI:
  - `@keyframes zenBreath`: Efecto de respiración (escala y brillo) usado en botones y auras del modo Zen.
  - `@keyframes messageIn`: Aparición fluida de los mensajes en el chat.
  - `@keyframes auraPulse` y `@keyframes waveAnim`: Efectos de sonido/estado para la IA.
- **Responsividad (Media Queries)**: Escalabilidad controlada mediante *breakpoints*:
  - `@media (min-width: 768px)` (Tablets/iPad): Transición del Tab Bar inferior a un menú lateral.
  - `@media (min-width: 1100px)` (Desktop/Mac): Salto a una rejilla (grid) de tres columnas (`nav content side`), aprovechando pantallas ultra anchas.

### Efectos Secundarios
- Afecta directamente el tiempo de renderizado de la GPU. El uso intensivo de `backdrop-filter: blur(...)` o `box-shadow` tiene un impacto directo en el rendimiento, especialmente en dispositivos móviles.

### Manejo de Excepciones
- **Protecciones Mobile**: Reglas como `touch-action: none;` en áreas de drag (Santuario 3D) o `-webkit-tap-highlight-color: transparent;` previenen comportamientos indeseados nativos del navegador móvil.

### Ciclo de Vida
1. **Descarga y Parseo**: Inicialmente bloquea el renderizado (Render-blocking) hasta que el navegador lo descarga.
2. **CSSOM Construction**: Se construye el árbol CSSOM que se combina con el DOM.
3. **Pintado y Composición**: Se aplican a los nodos y se calculan las capas (especialmente para los `backdrop-filter` y animaciones). Permanece residente mientras la página esté abierta.

---

## Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| El navegador (soporte a CSS3 y variables) | `index.html` (Para la presentación visual) |
| Fuentes del sistema (Apple-system, BlinkMacSystemFont) | `app.js` (Para transicionar estados como `.hidden`) |

---

## Flujo de Datos
1. `index.html` vincula el archivo en el `<head>`.
2. El navegador procesa las variables de `:root`.
3. Aplica reseteos globales (`* { margin: 0; }`).
4. Aplica estilos a etiquetas base (`body`, `main`).
5. Asigna estilos específicos mediante *class selectors* a medida que el DOM es generado.
6. A medida que `app.js` altera clases (añadiendo `.active` o `.hidden`), CSS engatilla transiciones (`transition: opacity...`) o animaciones (`animation: ...`).

---

## Sugerencia de Refactorización

> [!TIP]
> **Modularización con CSS Nesting o PostCSS:**
> El archivo tiene más de 1100 líneas. Aunque está bien comentado, mantener todo en un solo `style.css` en una PWA en crecimiento es propenso a colisiones.
> **Mejora:** Evalúa usar CSS Modules nativos (o un preprocesador como Lightning CSS) para separar responsabilidades lógicas por "View" (ej. `diario.css`, `zen.css`, `chat.css`), importándolos en un archivo principal. Esto facilitaría el mantenimiento sin sacrificar rendimiento si se minifica correctamente en producción (ya que hay un `package.json` pero no parece haber un bundler activo).

> [!NOTE]
> **Aprendizaje para el Junior:**
> Observa el uso de `backdrop-filter: blur(10px)`. Esto es lo que genera el famoso efecto "Glassmorphism" (cristal esmerilado) popularizado por iOS. Sin embargo, ten cuidado: este efecto es costoso de calcular para los teléfonos. Procura no anidar múltiples elementos con blur uno encima de otro para cuidar la batería del dispositivo del usuario.
