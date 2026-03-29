# Blueprint: Configuración e Infraestructura

## Identidad de los Componentes
Este documento agrupa los archivos de configuración estática que dictan las reglas del servidor, dependencias y propiedades de instalación de "Mini Jefecita".
- **`manifest.json`** (Perfil de Aplicación Web)
- **`package.json`** (Gestor de Paquetes / Scripts)
- **`vercel.json`** (Reglas de Despliegue en la Nube)

---

## 1. `manifest.json` (El DNI de la aplicación)

### Responsabilidad Única (SRP)
Proveer al sistema operativo (iOS, Android, Windows) los metadatos necesarios para tratar a la página web como una aplicación nativa instalable (una PWA o Progressive Web App).

### Anatomía Funcional
- **`name` / `short_name`**: Define cómo se llamará la app en la pantalla de inicio del teléfono ("Mini Jefecita").
- **`display: "standalone"`**: La magia de la PWA. Le dice al celular que oculte la barra de búsqueda de Safari/Chrome y la UI del navegador, lanzando la app en pantalla completa.
- **`theme_color` / `background_color`**: Dicta el color de la barra de estado superior del teléfono (Notch/Dynamic Island) y el color de fondo temporal mientras la app arranca (Splash Screen).
- **`icons`**: Provee los assets gráficos en diferentes resoluciones (`192x192` y `512x512`) para asegurar que el icono se vea nítido independientemente de la densidad de píxeles del celular.

---

## 2. `vercel.json` (Gobernanza del Servidor)

### Responsabilidad Única (SRP)
Sobrescribir el comportamiento por defecto del servidor donde está alojada la app (en este caso, Vercel) manipulando las cabeceras HTTP de las respuestas.

### Anatomía Funcional
El archivo define dos bloques críticos usando *Headers*:
1. **Reglas de Aislamiento Cruzado (Cross-Origin)**
   ```json
   { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
   { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
   ```
   **¿Por qué está esto aquí?**
   Es vital para `app.js`. HuggingFace `transformers.js` usa "SharedArrayBuffer" para paralelizar cálculos de Inteligencia Artificial usando múltiples hilos del procesador (Web Workers). Por razones de seguridad (para evitar ataques tipo *Spectre*), los navegadores bloquean esa memoria compartida a menos que el servidor afirme criptográficamente que la página está "aislada" del resto de internet.
   
2. **Reglas de Caché Severas**
   ```json
   "source": "/(sw\\.js|manifest\\.json)",
   "value": "public, max-age=0, must-revalidate"
   ```
   **¿Por qué está esto aquí?**
   Obliga a Vercel (y al CDN global) a **nunca almacenar en caché** el `sw.js` ni el `manifest.json`. Si Vercel los cacheara por 24 horas, y tú lanzas una actualización urgente de la app, el teléfono de los usuarios jamás se enteraría de que existe un `sw.js` nuevo hasta el día siguiente. `must-revalidate` fuerza al navegador a verificar si el código cambió en cada recarga.

---

## 3. `package.json` (Scripts y Entorno)

### Responsabilidad Única (SRP)
Definir los metadatos del código fuente y proveer comandos estandarizados para el ciclo de desarrollo local.

### Anatomía Funcional
- Solamente define el comando de inicio en la sección `"scripts"`:
  `"start": "python3 -m http.server 8080"`
- Curiosamente, no enumera dependencias (como React, Webpack o Vite) porque la app está construida íntegramente en Vanilla JS interactuando con librerías importadas por CDN (`<script src="...CDN...">` en HTML o `import(CDN)` en JS).
- Establece la versión semántica oficial del proyecto (`"version": "3.1.7"`), que suele usarse para el seguimiento del registro de cambios (`CHANGELOG.md`).

---

## Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| `icons/icon-192.png` (`manifest.json` necesita que la imagen exista) | Plataforma de Hosting (Vercel necesita leer `vercel.json` antes de servir) |
| Entorno Python (`package.json` asume que `python3` está instalado localmente para correr el build) | Navegador (`manifest.json` es interpretado al ver la etiqueta `<link rel="manifest">` en el HTML) |

---

## Sugerencia de Refactorización

> [!TIP]
> **Adición de `start_url` explícita con query params:**
> En el `manifest.json`, el actual `"start_url": "index.html"` es funcional, pero a veces el caché genera bugs al iniciar desde el Home de iOS.
> **Mejora:** Modificarlo a `"start_url": "/?source=pwa"` permite que a futuro tu código analice (por analytics) si los usuarios están usando la PWA instalada o simplemente la están visitando desde un enlace de navegador normal.

> [!NOTE]
> **Aprendizaje para el Junior:**
> Fíjate en el comando `"start": "python3 -m http.server 8080"`. Al no usar Node.js con servidores de desarrollo potentes como Vite o LiveServer (que auto-recargan la página), el dev experience aquí es tosco: si cambias el CSS, debes refrescar manualmente la ventana (y a veces lidiar con el Service Worker local). Sin embargo, iniciar servidores nativos de Python garantiza que los encabezados *Cross-Origin* a veces requeridos por los modelos locales de la IA se prueben sin la parafernalia pesada del ecosistema Node.js.
