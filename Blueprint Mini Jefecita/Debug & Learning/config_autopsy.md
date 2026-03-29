# Debug & Learning: Configuración (`manifest.json` y `vercel.json`)

## 1. Identidad y Propósito Crítico
- **Nombres:** `manifest.json`, `vercel.json`, `package.json`
- **Ubicación:** Raíz del Repositorio (`/`)
- **Tipo:** Metadatos de Aplicación y Directivas de Servidor.
- **El "Por Qué":** 
  - Si falta `manifest.json`, el Sistema Operativo (iOS/Android) "degrada" tu aplicación: ya no puede instalarse como app nativa, pierde su ícono, y se convierte en una simple e incómoda pestaña de Safari.
  - Si falta `vercel.json`, el servidor dejará de inyectar las cabeceras de seguridad requeridas por los modelos de IA (SharedArrayBuffer), lo que **paralizará el cerebro de la aplicación (WebGPU)** y el renderizado asíncrono.

---

## 2. Anatomía Funcional (Deep Dive)

### `manifest.json` (El Contrato con el OS)
- **`display: "standalone"`**: La línea vital que separa una página web de una PWA nativa. Obliga al celular a ocultar la barra de URLs y los botones atrás/adelante del navegador.
- **`theme_color` y `background_color`**: Dictan el color del 'Notch' superior en iOS y el color de fondo durante la secuencia de arranque (Splash Screen), evitando el horrible destello blanco nativo.

### `vercel.json` (Las Leyes de la Física del Alojamiento)
Este archivo gobierna cómo el servidor Edge de Vercel responde a las peticiones del usuario, estableciendo **Cabeceras de Seguridad y Aislamiento**.
- **Aislamiento Cruzado (Cross-Origin)**:
  `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: require-corp`.
  Estas cabeceras le dicen al navegador: *"Quiero usar capacidades ultra-rápidas especiales de CPU (SharedArrayBuffer) para correr Inteligencia Artificial. Juro criptográficamente que no estoy incrustando iframes maliciosos de piratas informáticos que puedan robar esta memoria local."* Un requisito estricto de Apple/Google desde 2018 para mitigar la vulnerabilidad *Spectre*.
- **Pólizas Antigravedad de Caché**:
  Ruta `/(sw\.js|manifest\.json)` -> `Cache-Control: public, max-age=0, must-revalidate`.
  Obligan al servidor Edge a **NUNCA guardar en caché el Service Worker**. Si estas reglas no existieran, subirías código nuevo a GitHub, pero tus usuarios seguirían viendo la app vieja durante 24 horas porque el servidor Cloudflare/Vercel retendría el archivo antiguo.

### `package.json` (Motor de Desarrollo)
- **Scripts Minimalistas (`start`)**: Con solo `"start": "python3 -m http.server 8080"`, el proyecto abraza una pureza extrema (Vanilla). No hay `node_modules`. Levantar un mini-servidor de Python asegura que la app se prueba en red local imitando sutilmente a un servidor real, en vez de abrir crudamente el archivo HTML desde el disco duro (`file:///`), lo cual rompería todas las reglas de CORS.

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info:**
  - El motor Safari/Chrome detecta el `<link rel="manifest" href="manifest.json">` en el `<head>` del HTML y lanza la descarga.
  - Vercel escanea el `vercel.json` durante el *Build Phase* para programar sus Edge Nodes globales antes de que exista tráfico.
- **A dónde va la info:**
  - Las Cabeceras de `vercel.json` viajan a las pestañas 'Network' de Chrome DevTools con cada archivo `.js` o `.html`.
  - La Data del `manifest` viaja al Sistema Operativo (Ej: SpringBoard en iOS) para pintar el ícono 192x192px en la pantalla de inicio.

---

## 4. Guía de Intervención (Para corregir errores críticos)

### Puntos de Fallo Comunes
1. **"Me sale un Warning sobre SharedArrayBuffer en Consola y el Chatbot no responde":** Estás corriendo la PWA en una IP de red local (ej: `192.168.1.15:8080`) para probarla en tu iPhone. Safari bloqueará el motor WebGPU de Transformers.js si tu servidor Python local no emite explícitamente las cabeceras CORS de `vercel.json`. (Solución de testing: usa *Localtunnel* o *Ngrok*).
2. **"No me sale la opción de 'Añadir a Pantalla de Inicio' en Safari":** Asegúrate que los íconos del `manifest` existan físicamente, que el tamaño declarado coincida (192, 512), y que el `start_url` devuelva 200 OK.
3. **"Error de CORS al intentar cargar Three.js desde CDN":** Al añadir la cabecera inflexible `Cross-Origin-Embedder-Policy: require-corp` en `vercel.json`, todo script externo (CDN) que importe Mini Jefecita será bloqueado si la URL CDN original no tiene políticas permisivas de CORS de vuelta (`Access-Control-Allow-Origin: *`).

### Dónde poner el "Breakpoint" de Infraestructura
> [!CAUTION]
> Cuando el WebGPU o la UI 3D fallen sin motivo en producción, abre **Network Tab** en Chrome. Haz clic en el recurso `index.html` -> **Headers** -> **Response Headers**.
> Si no ves `Cross-Origin-Embedder-Policy: require-corp` ahí, tu archivo `vercel.json` tiene un error de sintaxis JSON o Vercel ignoró las reglas. Sin eso, la IA no tiene permiso para usar múltiples hilos de tu CPU.

### Dependencias de Riesgo
- La fiabilidad estricta del CDN `cdnjs` en HTML o `jsdelivr` en el JS. Como hemos endurecido las cabeceras del servidor (`vercel`), dependemos de que esos servidores externos sean igual de estrictos habilitando CORS público constante para servirnos los librerías.

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
El proyecto confía su vida a que "Si el HTML y JS puro corre bien en Python Local, correrá bien en Vercel". Al carecer de Linters (ESLint), Formateadores (Prettier) o un compilador (Vite/Webpack) en el `package.json`, la deuda es instrumental.
**La Fragilidad:** Si mañana se integra a un Developer Junior externo, este podría guardar archivos con errores de sintaxis o variables no definidas que Python no le avisará, y al subir a producción, la app se romperá en el móvil del cliente directamente.
**Cómo Escalar:** Al momento de escalar Mini Jefecita, mantener Vanilla JS es admirable, pero se debe añadir un paso de "Build" al `package.json` para minificar los 1,500 líneas de código a un archivo `.min.js` ininteligible y comprimido, reduciendo el gasto de batería y megabytes en el usuario final.

### Consejo Senior (Infrastructure as Code - IaC)
**Principio Demostrado: Infraestructura como Código**.
El uso de `vercel.json` demuestra madurez técnica. En lugar de que el Developer Maestro deba iniciar sesión en el panel visual (Dashboard) de Vercel para hacer clics y configurar cabeceras de seguridad manuales que nadie más puede ver, **todo reside versionado en Git**.
*Por qué importa:* Al encapsular las reglas de Red y Caché en un archivo de texto JSON plano guardado en el repositorio, si un Junior altera las cabeceras de seguridad provocando un hackeo masivo o caída severa, **es visible en un simple Pull Request (PR)**. El equipo entero vigila y puede hacer *Rollback* de la infraestructura en segundos.
