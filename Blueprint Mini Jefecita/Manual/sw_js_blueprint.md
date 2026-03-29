# Blueprint: `sw.js` (Service Worker)

## Identidad del Componente
- **Archivo:** `sw.js`
- **Tipo:** Service Worker / Proxy de Red
- **Ubicación:** Raíz del proyecto (`/sw.js`)

## Responsabilidad Única (SRP)
Gestionar el caché de los archivos estáticos para permitir que la aplicación se instale y funcione sin conexión a internet (Offline-first), actuando como un intermediario entre la app y la red.

## Anatomía Funcional

### Entradas (Inputs/Props)
- El entorno de ejecución (`self`, que en un Service Worker apunta a `ServiceWorkerGlobalScope`).
- Peticiones de red (`fetch events`) originadas por la aplicación.
- Mensajes post-message (`message events`) enviados desde `app.js`.

### Variables y Constantes
- **`CACHE_NAME`**: String que define la versión actual del caché (ej. `'mini-jefecita-v3.1.7'`). Es vital cambiar este nombre cuando se despliega código nuevo para forzar la actualización.
- **`ASSETS`**: Array de rutas críticas (`/`, `/index.html`, `/app.js`, etc.) que deben descargarse y guardarse en el almacenamiento del dispositivo inmediatamente durante la instalación.

### Estado Local
El *Estado* en un Service Worker se refiere a qué versión de caché está activa en el dispositivo. No guarda variables dinámicas de usuario; su "memoria" es el `CacheStorage` del navegador.

### Lógica de Métodos (Event Listeners)
1. **`install`**: 
   - *Por qué:* Para pre-cachear los recursos vitales (App Shell).
   - *Qué hace:* Abre el `CACHE_NAME` y usa `cache.addAll(ASSETS)` para descargar todo lo necesario.
2. **`activate`**: 
   - *Por qué:* Para hacer limpieza de la basura antigua.
   - *Qué hace:* Reclama el control de los clientes (`self.clients.claim()`) y borra cualquier caché viejo que no coincida con el `CACHE_NAME` actual, liberando espacio en el móvil.
3. **`fetch`**:
   - *Por qué:* Interceptar las peticiones de red.
   - *Qué hace:* Estrategia **Cache First, falling back to Network**. Si el archivo pedido está en caché, lo devuelve instantáneamente (carga en ms). Si no, va a buscarlo a internet (`fetch(event.request)`).
4. **`message`**:
   - *Por qué:* Para permitir actualizaciones "Silenciosas" controladas por el frontend.
   - *Qué hace:* Escucha si `app.js` le grita `SKIP_WAITING`. Al oírlo, ejecuta `self.skipWaiting()`, lo que fuerza al nuevo Service Worker a tomar el control inmediatamente (desencadenando el refresh en la UI).

### Efectos Secundarios
- Escribe directamente en el disco duro del dispositivo del usuario (CacheStorage).
- Altera la forma en que el navegador resuelve las URLs (intercepta las redes).

### Manejo de Excepciones
El archivo asume que las rutas de `ASSETS` siempre estarán disponibles en el servidor durante la instalación inicial. La función `fetch` usa el operador OR (`||`) elegante: `response || fetch()`. Si ambas fallan (no hay caché y no hay internet), el request simplemente fallará de forma nativa (lo cual podría mejorarse con una página offline por defecto).

### Ciclo de Vida (El más complejo de la Web)
1. **Registro:** `app.js` llama a `navigator.serviceWorker.register()`.
2. **Instalación:** Dispara el evento `install`. Descarga los `ASSETS`. Entra en estado *Waiting*.
3. **Activación:** Si no hay otro Service Worker viejo ejecutándose (o si se llama a `skipWaiting`), dispara `activate` y purga cachés viejos.
4. **Residente:** Se queda "inactivo" vigilando los eventos `fetch` y `message`.

---

## Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| `app.js`, `index.html`, imágenes (Para saber qué cachear en `ASSETS`) | `manifest.json` (Un SW es requisito obligatorio para instalar una PWA) |
| Archivos servidos estáticamente desde el origen de la app | `app.js` (Depende de su control de versiones para mostrar el Toast de actualización) |

---

## Flujo de Datos
1. La app hace una petición (ej. `<link rel="stylesheet" href="style.css">`).
2. El Service Worker captura la petición en el evento `fetch`.
3. Revisa la bóveda de caché: "¿Tengo `style.css` v3.1.7?".
4. **Flujo A (Offline/Rápido):** Sí lo tiene -> Retorna el archivo de la bóveda inmediatamente (2ms).
5. **Flujo B (Online):** No lo tiene -> Deja pasar la petición a internet (300ms).

---

## Sugerencia de Refactorización

> [!TIP]
> **Integración de Workbox:**
> El Service Worker actual está escrito en "Vanilla JS". Aunque funciona, es precario. A medida que la app crezca, cachear modelos pesados de IA (archivos `.onnx`) usando este método básico de "Cache First" puede llevar a problemas severos de almacenamiento.
> **Mejora:** Sugiero refactorizar este archivo utilizando **Google Workbox**. Permitirá crear reglas inteligentes (ej. *Network First* para la API, *Cache First* para CSS/HTML), limitar el tamaño del caché a 50MB máximo, o agregar caducidad (TTL) automática a los recursos, lo cual es fundamental para una app que pretende ser un "Santuario" optimizado en móviles.

> [!NOTE]
> **Aprendizaje para el Junior:**
> Entender el evento `message` con el tipo `SKIP_WAITING` es el nivel pro de las PWAs. Los navegadores por defecto NO aplican código nuevo si el usuario tiene la pestaña abierta. Esto frustra a muchos devs porque empujan a producción pero los usuarios siguen viendo la versión vieja. Este código en `sw.js` colaborando con `app.js` (donde aparece el Toast de "Actualizar") soluciona ese problema permitiendo despliegues continuos sin que los usuarios se queden estancados en el pasado.
