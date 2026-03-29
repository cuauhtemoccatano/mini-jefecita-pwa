# Debug & Learning: `style.css` (Autopsia Quirúrgica)

## 1. Identidad y Propósito Crítico
- **Nombre:** `style.css`
- **Ubicación:** `/style.css`
- **Tipo:** UI Engine / Design Token Manager
- **El "Por Qué":** Si este archivo desaparece, la app se convierte en una lista estática ininteligible de texto plano desprotegiendo la experiencia de usuario. Más crítico aún: perderíamos el control de visibilidad (`display: none` en las clases `.view`). Sin este archivo, **todas las pantallas se superpondrían al mismo tiempo**, paralizando funcionalmente la Single Page Application (SPA).

---

## 2. Anatomía Funcional (Deep Dive)

### Estado y Datos (Micro-estados CSS)
- **Design Tokens (Constantes)**: Declarados en `:root` (Ej. `--primary: #00C4B4`). Aunque son variables CSS, actúan como constantes globales inmutables inyectadas en memoria al compilar el CSSOM.
- **Estados Booleanos (Volátiles)**: Modificadores de estado adheridos a clases. 
  - Ejemplo: `.hidden` (`opacity: 0`) vs su remoción para mostrar elementos.
  - Estos estados solo mutan cuando `app.js` interviene el DOM (intercambiando `.active`).

### Lógica de Métodos (El Cerebro Renderizador)
El algoritmo CSS no usa condicionales lógicos, sino una estrategia de **Aceleración de Hardware**:
- **GPU Offloading:** Animaciones como `@keyframes zenBreath` usan `transform` y `opacity`. Esta es una decisión arquitectónica proactiva: estas propiedades se procesan directamente en la GPU, a diferencia de animar márgenes o anchos, que destruirían la CPU repintando el *Reflow* constantemente (*Layout Thrashing*).
- **Responsive Engine:** El algoritmo `@media` dicta mutaciones radicales de Grid (`grid-template-areas`) basadas en umbrales absolutos (768px y 1100px), transformando la PWA de un diseño de "Tabs" móviles a una vista de "Paneles" de escritorio.

### Efectos Secundarios (Side Effects)
- **Impacto Térmico (Battery Drain)**: Clases como `.ai-bg-downloader` o `.lock-overlay` abusan del `backdrop-filter: blur(25px)`. Este efecto (Glassmorphism) exige un alto cómputo por píxel. Su uso excesivo drena la batería en móviles antiguos.
- **Secuestro del Viewport**: El bloque `body { overflow: hidden; position: fixed; }` anula la habilidad nativa del usuario para generar el rebote "Bounce-scroll" en iOS, forzando a la app a sentirse 100% nativa.

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info (Inbound):** 
  - *Estático:* El navegador lee la etiqueta `<link rel="stylesheet">` en `index.html`.
  - *Dinámico:* `app.js` sobrescribe la variable nativa `--primary` al leer el `userData.color` guardado en el navegador.
- **A dónde va la info (Outbound):** 
  - La información no "sale" del CSS; se inyecta en el *Render Tree* del navegador instruyendo a la pantalla cómo pintar cada píxel cada 16 milisegundos (60fps).

---

## 4. Guía de Intervención (Para corregir errores visuales)

### Puntos de Fallo Comunes
1. **"Toco un botón y no pasa nada (Touch inerte)":** Revisa el `z-index` de los modales. Frecuentemente, el `#settings-modal` transparente (`z-index: 300`) está interceptando el TAP de todo lo que hay debajo porque su contenedor bloquea el layout si no tiene `display: none` o `pointer-events: none`.
2. **"Las pestañas de abajo tapan el contenido final del chat":** Conflicto con la variable `env(safe-area-inset-bottom)`. En algunos navegadores (como Safari en Mac), este valor puede comportarse erráticamente, rompiendo los cálculos en `calc()`.
3. **"Animación a tirones o bajones de FPS":** Alguien ha intentado animar propiedades como `width`, `height`, `margin` o `box-shadow` en un ciclo constante.

### Dónde poner el "Breakpoint" visual
> [!CAUTION]
> CSS no tiene Breakpoints. Tu arma principal aquí es el **"Borde Rojo de la Muerte"**.
> Si algo desplaza el layout y rompe el diseño en móviles, inyecta temporalmente esta línea al final del archivo:
> `* { outline: 1px solid red !important; }`
> Esto expondrá inmediatamente qué contenedor invisible (probablemente una flexbox mal configurada) está robando ancho en la pantalla.

### Dependencias de Riesgo
- La clase `#zen-3d-canvas` convive con eventos de `touch-action: none`. Si este CSS o sus contenedores cambian, el motor *Three.js* podría ser empujado fuera de los límites de la pantalla, dejando la simulación corriendo pasivamente y quemando recursos de la GPU sin ser vista.

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
Con **más de 1,110 líneas**, este archivo es un "God File".
**La Fragilidad:**  El 100% de los elementos habitan el mismo *scope* global. Si cambias una regla general (Ej. `input[type="number"]`), corres el riesgo de destruir inputs numéricos en zonas no pensadas (como dentro de modales o configuraciones futuras).
**El Camino a Escalar:** Para evitar romper la app a futuro, el CSS debe migrarse a módulos. Aislar estilos en archivos como `_chat.css`, `_zen.css`, `_modals.css` usando `@import` (o variables CSS más estrictas orientadas a componentes "Utility First" como Tailwind) previene la sobreescritura accidental.

### Consejo Senior (Clean Code & DRY)
**Principio Violado: Don't Repeat Yourself (DRY)**.
Hay múltiples paneles que repiten constantemente esta combinación exacta para lograr Glassmorphism translúcido:
`background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;`

*Por qué importa:* Si el departamento de diseño decide mañana que el "Glassmorphism" consume demasiada batería y se debe reducir la opacidad en toda la app, un Junior tendría que cazar (Ctrl+F) y modificar 15 bloques distintos a mano. 
Un Senior abstrae ese patrón en unas cuantas variables locales o crea una clase universal `.glass-panel`, logrando que la app escale y se modifique estéticamente desde un único punto de verdad.
