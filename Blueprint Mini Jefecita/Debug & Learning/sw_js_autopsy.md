# Debug & Learning: `sw.js` (Autopsia Quirúrgica)

## 1. Identidad y Propósito Crítico
- **Nombre:** `sw.js` (Service Worker)
- **Ubicación:** `/sw.js`
- **Tipo:** Controlador de Red (Network Proxy / Background Worker)
- **El "Por Qué":** Un Service Worker es literalmente un servidor proxy corriendo *dentro* del celular del usuario (aislado del hilo principal de la pestaña de Safari/Chrome). Si este archivo desaparece o falla el registro, **la app pierde su estatus de PWA y su superpoder principal: el funcionamiento Offline**. Sin él, si abres "Mini Jefecita" en modo avión o en el metro, la app mostraría la pantalla del dinosaurio en lugar de la UI cacheada.

---

## 2. Anatomía Funcional (Deep Dive)

### Estado y Datos (El Almacén Vault)
El Service Worker carece de estado local persistente en memoria RAM (el OS del celular lo inicia y lo mata a voluntad para ahorrar batería). Su única "memoria" es manipular el disco duro:
- **`CACHE_NAME`** (Constante Versionada): Ej. `'mini-jefecita-v3.1.7'`. Sirve como firma criptográfica de versión. Cada vez que modificas la app, debes incrementar esta variable manualmente (Ej. `v3.1.8`). Esto indica al ecosistema PWA: "El código viejo caducó, genera un nuevo almacén".
- **`ASSETS`** (Constante de Semillas): Un array con 7 rutas absolutas (`/`, `style.css`, `app.js`, etc.). Es la receta mínima viable para constituir el "Esqueleto" de la aplicación (App Shell).

### Lógica de Métodos (Los 3 Eventos Centinelas)
1. **`install` (La Creación)**: Se dispara una sola vez cuando una nueva versión (nuevo `CACHE_NAME`) es detectada.
   *Estrategia*: Abre el almacén del navegador (`caches.open()`) e inserta *obligatoriamente* (`addAll`) todos los ASSETS. Si tan solo uno falla (Ej: error 404), la instalación se aborta, protegiendo al usuario de una app rota corrupta.
2. **`fetch` (El Policía de Tránsito)**: Cada vez que la PWA pide una imagen o un fetch, este método intercepta la señal antes de que salga a internet.
   *Estrategia "Cache First"*: Busca en la bóveda local (`caches.match()`), lo cual toma ~2ms. Si lo encuentra, anula la red y entrega el archivo local. Si no, permite pasar la petición a internet usando `fetch()`. Es una estrategia agresiva anti-latencia.
3. **`activate` (El Exterminador)**: Se dispara cuando el nuevo Service Worker toma control real de la página.
   *Estrategia*: Itera sobre todas las carpetas instaladas en la bóveda, y borra sin piedad (`caches.delete`) cualquiera que no coincida exactamente con `CACHE_NAME`. Evita que el celular del usuario acumule megabytes de versiones viejas a lo largo de los meses.

### Efectos Secundarios (Side Effects)
- **Secuestro Inmortal:** Sigue ejecutando código aunque el usuario haya cerrado la app (recibiendo Prompts nativos de Push si estuvieran configurados).
- **Intercepción Absoluta:** Manipula matemáticamente cómo el motor del navegador resuelve las promesas HTTP (`<img>`, `<script>`).

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info (Inbound):** 
  - Recibe el evento global `FetchEvent` inyectado por el navegador por CADA recurso que pida la app (incluso APIs externas).
  - Recibe eventos de mensajería (`message`) provenientes directamente de `app.js` (Ej. Cuando el *IdleManager* en `app.js` decide que es seguro enviar el JSON `{ type: 'SKIP_WAITING' }`).
- **A dónde va la info (Outbound):** 
  - Retorna objetos `Response` falsificados (locales) hacia el hilo principal de la página, creyendo esta que los descargó de internet.

---

## 4. Guía de Intervención (Para corregir errores críticos)

### Puntos de Fallo Comunes
1. **"Subí un cambio de color a GitHub pero mis usuarios siguen viendo la versión vieja de la app":** Conocido como el **"Infierno de la PWA"**. Revisa si al subir los cambios, cambiaste el nombre string de `CACHE_NAME`. Al ser una política "Cache First", si el string no cambia, `sw.js` jurará que su caché actual es el definitivo, ignorando a Vercel/GitHub eternamente.
2. **"No funciona offline en el primer lanzamiento / Tira pantalla en blanco":** Uno de los links escritos dentro del bloque `ASSETS` tiene un Typo (Ej: pusiste `icon-192.png` pero el archivo se llama `icon_192.png`). Un solo error en `cache.addAll()` rompe toda la Promesa.
3. **"Espacio en disco lleno" o "Almacén Corrupto":** El evento `activate` está fallando al borrar cachés obsoletos, resultando en gigabytes de peso a la app.

### Dónde poner el "Breakpoint" Algorítmico
> [!CAUTION]
> Para "debuggear" el policía de tránsito no uses el tab `Console`. **Debes abrir: DevTools -> Application -> Service Workers**.
> Marca la casilla "Update on reload" temporalmente durante el desarrollo o te volverás loco.
> Inyecta un `console.log('Fetching:', event.request.url)` en la línea 44 antes de `event.respondWith`. Si ves descargas del modelo de IA (.onnx) pasando por aquí, ¡Cuidado! Estás cacheando archivos masivos (GBs) en el almacenamiento estático de la PWA, lo que podría crashear iPhones o agotar el espacio en disco.

### Dependencias de Riesgo
- **Límites de Dispositivo (iOS Safari):** Apple es muy agresivo con los PWA. Si el usuario no agrega Mini Jefecita a su pantalla de inicio ("Add to Homescreen") y no la usa por ~7 días, Safari podría eliminar ("Silently Purge") este caché silenciosamente para liberar espacio, rompiendo la promesa de estar siempre offline.

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
El SW maneja el *Caching* general por un bloque único (`event.respondWith`).
**Deuda Técnica Grave (Inflexibilidad):** Esta es una estrategia manual (Vanilla Proxy). Aplica la mismísima estrategia *"Cache First"* tanto a un logo inmutable (`icon-192.png`) como a un archivo altamente volátil (`app.js`). Si mañana añades una llamada a una API `/api/weather`, este código tratará de cachear el clima para siempre.
**Cómo Escalar:** A medida que la app añada llamadas a bases de datos o analíticas externas, este archivo debe desterrarse por un modelo de enrutador declarativo.

### Consejo Senior (Google Workbox)
**Principio Ignorado: Segregación de Políticas de Red (Network Strategies)**.
El código actual es un "Mazo" que golpea todos los clavos por igual. 
Un Arquitecto de SW sabe que no todos los *bytes* son iguales:
- Los binarios del motor 3D y logos no cambian = **Cache First / Cache Only**.
- La data dinámica JSON o HTML = **Stale While Revalidate** (Muestra rápido lo viejo, pero actualiza en segundo plano) o **Network First** (Intenta recuperar de internet fresco antes de rendirte al local).

*El Estándar:* Reemplazar este archivo casi en su totalidad importando `workbox-sw` de Google. Reduce ~50 líneas de código Vanilla propenso a bugs de asincronía en 5 líneas expresivas que declaran rutas RegEx controlando la caducidad (TTL) por tamaño máximo de megabytes.
