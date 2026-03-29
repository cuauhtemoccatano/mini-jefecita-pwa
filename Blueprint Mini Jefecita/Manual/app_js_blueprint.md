# Blueprint: `app.js`

## Identidad del Componente
- **Archivo:** `app.js`
- **Tipo:** Core Logic / Controller
- **Ubicación:** Raíz del proyecto (`/app.js`)

## Responsabilidad Única (SRP)
Actuar como el cerebro central de la PWA, orquestando el estado, la interacción del usuario, la persistencia de datos (Local Storage), la IA en el navegador (WebGPU/WASM) y el ciclo de vida de la aplicación.

## Anatomía Funcional

### Entradas (Inputs/Props)
- **DOM Elements**: Usa los IDs y clases generados por `index.html`.
- **Librerías Externas**: 
  - `Transformers.js` (cdn.jsdelivr.net) para la inferencia de modelos locales.
  - `Three.js` (inyectado globalmente antes) para el renderizado del Santuario.
- **APIs Web Natibas**: `localStorage`, `SpeechSynthesis`, `Navigator.gpu`, `ServiceWorker`, `AudioContext`.

### Variables y Constantes (Estado Global y de Sesión)
- `userData` y `healthData`: Almacenan en JSON los ajustes y métricas vitales (pasos, calorías) recuperados del esquema local.
- `generator`: Mantiene la instancia activa del pipeline de HuggingFace de IA (para inferencias de chat de texto a texto evitando recargas redundantes).
- `isDownloadingAI`, `wakeLock`: Banderas de control de estado del dispositivo y estado de carga neuronal.
- `zen3D...` (renderer, scene, camera, crystals): Referencias persistentes al estado de la animación 3D de WebGL.

### Estado Local
El estado transita dictado por variables de instancia o atributos en Local Storage.
Por ejemplo:
- Al abrir los Settings y guardar, `saveSettings()` sincroniza la mutación en memoria del objeto `userData` con el Disco, para luego purgar y repintar la UI con una llamada a `applyPersonalization()`.

### Lógica de Métodos (Los "Órganos" principales)
- **`initApp()`**: El orquestador o *Bootstrap*. Garantiza que otras subfunciones como `initTabs`, `initJournal`, `initHealthSync` e `initAI` carguen ordenadamente tras montar el DOM.
- **`initAI(retryCount)`**: Inicializa dinámicamente un modelo Small Language Model (SLM) detectando el hardware (`webgpu` vs `wasm`), y ejecuta inferencia con Transformers.js comunicándose con la UI para evitar parpadeos mediante *background processing* en la descarga.
- **`initZenMode()` / `init3DScene()`**: Pone en marcha un motor gráfico básico Three.js, instanciando geometrías reflectantes (`MeshPhongMaterial`) que responden a interacciones táctiles en el canvas.
- **Motor de "Sentient Sync" (`initHealthSync`)**: Expone un "Endpoint simulado" donde otra aplicación (Ej. Atajo de iOS) puede enviarle parámetros por URL GET (`?steps=X&hrv=Y`) que él procesa pasivamente (o activamente vía `checkStressLevels()`).
- **`initIdleManager()`**: Un observador de inactividad (cronómetro) que automatiza las actualizaciones (vía Service Worker `SKIP_WAITING`) solo cuando el usuario está en reposo por más de 60 segundos.

### Efectos Secundarios
- **Red y Caché**: Descarga modelos masivos (Cientos de MBs de pesos ONNX) asíncronamente en caché vía web worker implícito de transformers.js.
- **Hardware**: Reserva la tarjeta gráfica (`navigator.gpu.requestAdapter()`) o dispara audios (`AudioContext.createOscillator()`).
- **DOM**: Modifica casi todas las vistas de la aplicación incrustando HTML dinámico en `.history-list` o alternando visibilidad de `#settings-modal`.

### Manejo de Excepciones
- **Protección de Datos Rotos**: Al arrancar `try { JSON.parse(...) } catch(e)`, si el Schema ha mutado y choca o no existe, aplica un estado base seguro (Hard Reset Graceful).
- **Protección WakeLock**: En `requestWakeLock()`, usa `try/catch` para silenciar advertencias en navegadores que restringen APIs de vigilia de pantalla sin *gestures*.
- **IA Fallbacks**: Incluye un sistema de recuperación `initAI(retryCount + 1)` para evitar abandonar si una promesa HTTP de descarga se rompe intermitentemente en conexiones inestables. Las configuraciones tienen Modelos "Respaldo" parametrizados bajo un Dictionary de hardware.

### Ciclo de Vida
1. **Punto de Montaje**: `document.addEventListener('DOMContentLoaded', initApp)`
2. **Ciclo Interactivo**: Vive suscrito a eventos *click* de navegación, modales o chat. En ciclos de chat, el *Thread* principal queda asincrónicamente esperando un Token Generation iterativo del modelo.
3. **Muerte de Sesión/Reposición**: Destruido/suspendido temporalmente por el Sistema Operativo, su única herencia queda en ServiceWorker o localStorage.
4. **Ciclo del Service Worker Listener**: Constantemente escuche al Background Thread, gatillando `window.location.reload()` si el `controllerchange` marca actualización de Caché exitosa.

---

## Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| `index.html` (Nodos DOM para montar Listeners) | (Ningún otro archivo lo importa directamente al estar centralizado) |
| Web APIs (`navigator` , `window.localStorage`) | El Service Worker (para enviar/recibir comandos `SKIP_WAITING`) |
| HuggingFace Transformers.js (`import(...)`) | |
| `sw.js` (Ciclo de Vida PWA) | |

---

## Flujo de Datos
1. `index.html` importa `app.js` como module.
2. Recupera `userData` al leer LocalStorage y repinta variables temáticas en DOM (`applyPersonalization`).
3. Asinga *Listeners* a pestañas (`initTabs`), configuraciones, o inputs de chat.
4. Invoca en background asincrono a `initAI()`. Ese proceso descarga el Weights de LLM de forma silenciosa mientras `wakeLock` asegura que la pantalla no se apague.
5. Cuando el modelo está en memoria, envía el `systemPrompt` parametrizado con `userData.jadeName` al presionar *Enviar Chat*, decodifica la respuesta via `pipeline` y adjunta al DOM un div contiguo a la conversacion usando InnerHTML.

---

## Sugerencia de Refactorización

> [!TIP]
> **Extracción del Core AI:**
> `app.js` maneja tareas triviales de manipulación del DOM al mismo tiempo que maneja el costoso ciclo de inicialización y promesas de carga del modelo Transformer (`initAI`, variables `generator`, hardware Fallbacks).
> **Mejora:** Abstraer toda la interacción con `transformers.js` hacia un módulo dedicado (`ai-core.js`) o incluso aislar ese procesamiento dentro de un Worker dedicado (`Web Worker`), para así transferir el costo del procesamiento de la Inferencia, evitando que convecir tokens detenga la fluidez de un scroll o animaciones UI principales.

> [!NOTE]
> **Aprendizaje para el Junior:**
> Fíjate en la técnica del `initIdleManager()`. El código no hace recargas agresivas (*Force Reloads*) cuando se baja código nuevo de la aplicación al disco (vía Service Worker) a menos que esté seguro mediante métricas (`Date.now() - lastInteraction`) de que el usuario no está tocando la pantalla o a mitad de un proceso. Esto es lo que separa a una buena PWA de una aplicación molesta: **La Empatía Asíncrona**.
