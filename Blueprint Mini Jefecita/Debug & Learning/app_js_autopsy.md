# Debug & Learning: `app.js` (Autopsia Quirúrgica)

## 1. Identidad y Propósito Crítico
- **Nombre:** `app.js`
- **Ubicación:** `/app.js`
- **Tipo:** Controlador Principal / Motor SLM (Small Language Model) Front-End
- **El "Por Qué":** Si este archivo desapareciera, tendríamos una página "zombie". La UI sería visible, pero las pestañas no cambiarían, el backend de lenguaje (IA) no despertaría para charlar y los datos médicos o recordatorios nunca se guardarían. Es el "Pegamento" entre el hardware del celular (batería, GPU, Audio) y el usuario.

---

## 2. Anatomía Funcional (Deep Dive)

### Estado y Datos (Local vs RAM)
- **Persistentes (Local Storage)**: Las variables globales `userData` y `healthData`. Su tiempo de vida trasciende la sesión del navegador.
- **Volátiles (Residentes en RAM)**:
  - `generator`: Mantiene el Pipeline WebGPU cargado de HuggingFace. Muere si el usuario cierra la pestaña o el OS mata Safari/Chrome por falta de RAM.
  - `isDownloadingAI` & `wakeLock`: Banderas críticas transaccionales. Evitan colisiones si se instancian dos descargas del modelo a la vez y aseguran que el teléfono no apague la pantalla cortando la red mientras se descarga un archivo masivo ONNX.

### Lógica de Métodos (El Cerebro)
La estrategia detrás de `app.js` no es orientada a objetos (no hay Clases `ChatController`), sino procedimental y estructurada por funciones `init()`.
- **Patrón de Bootstrap y *Graceful Degradation* (`initAI`)**: El algoritmo intenta arrancar el Transformer solicitando permiso a la tarjeta gráfica con `navigator.gpu`. Si nota que el celular es viejo o falla, retrocede suavemente (*Fallback*) al entorno `wasm` e impone un modelo más ligero (SmolLM2). Esta estrategia prioriza que la PWA "nunca muera", aceptando peores repuestas en pro de la estabilidad térmica.
- **La Empatía Asíncrona (`initIdleManager`)**: Este algoritmo evita las peores prácticas del desarrollo web. Audita el margen de inactividad (`Date.now() - lastInteractionTime`). Si el Service Worker detecta código nuevo, `app.js` lo retiene en espera; solo manda el comando letal `SKIP_WAITING` cuando el cronómetro asegura que el usuario ha "soltado" el teléfono por más de 1 minuto, logrando una actualización silenciosa y sin interrumpir flujos de trabajo.

### Efectos Secundarios (Side Effects)
- **Impacto Fuerte en Hardware (VRAM/RAM)**: Carga matrices matemáticas masivas (hasta 1GB de RAM) en el hilo secundario del navegador.
- **Intercepción Nativa**: `window.navigator.vibrate` hace vibrar el hardware físico y `window.speechSynthesis.speak` toma control de las cornetas nativas engañando al reproductor de medios del OS.
- **Data Mutability DOM**: Cada vez que cambias de pestaña, manipula las *Class Lists* CSS del árbol DOM global inyectando `.active` destructivamente.

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info (Inbound):** 
  - La URL (`window.location.search`) inyecta parámetros médicos como `?steps=100` desde atajos nativos de iOS (Siri Shortcuts) que son leídos por la función `initHealthSync()`.
  - El usuario tipeando explícitamente en el DOM (Inputs de chat o duración de ejercicio).
  - El sistema de Caché local (LocalStorage).
- **A dónde va la info (Outbound):** 
  - A los *TextNodes* del HTML para visualización (ej: inyectar burbujas HTML al chat mediante `innerHTML`).
  - Devuelve peticiones postMessage (`SKIP_WAITING`) hacia el **Service Worker** (`sw.js`).

---

## 4. Guía de Intervención (Para corregir errores críticos)

### Puntos de Fallo Comunes
1. **"Me quedo atrapado en 'Cargando IA' y Safari crashea o la página parpadea en blanco"**: El modelo local (Ej. Qwen 0.5B o Llama 1B) ha excedido la RAM estricta asignada por iOS a Safari (Típicamente límite de ~2GB). Esto causa un JetSam Event donde Apple mata la pestaña.
2. **"Cambio el nombre de Jade en Ajustes y al recargar no se guardó":** El evento `saveSettings()` falló silenciosamente, probablemenete el usuario tiene el modo incógnito (navegación privada) activo, bloqueando las "Web Storage API".
3. **"El modo Zen no emite sonido de cristal":** El usuario jamás hizo una interacción ("Tap") táctil en pantalla plana antes de iniciar el Zen. Casi todos los navegadores prohíben iniciar operaciones de `AudioContext` pre-interacción para evitar publicidad sonora.

### Dónde poner el "Breakpoint" Algorítmico
> [!CAUTION]
> ¿Tienes un Bug en el chat respondiendo locuras o repitiéndose? ¡No mires la UI! Pon un `debugger` en la línea:
> `const output = await generator(fullPrompt, { max_new_tokens: 80, ...});`
> Examina qué le estás inyectando como variable `fullPrompt`. Usualmente, las plantillas del formato esperado por el modelo (Chat Templates `<|im_start|>`) se corrompen aquí, intoxicando a la IA.

### Dependencias de Riesgo
- La importación CDN perimental de Transformers: `import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3')`. **Si esa URL sufre un Upgrade Breaking o la Red baja (Error 404)**, el código por debajo del `await import` se romperá. Dejará la pestaña y UI funcionales porque el bloque Try/Catch lo rodea, pero la IA jamás funcionará.

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
Las deudas técnicas aquí son severas. El archivo opera como un **Monolito Funcional (God Object)** de casi 700 líneas.
**La Fragilidad (El Acoplamiento):** La función `checkStressLevels` manipula directamente el DOM preguntando por `document.getElementById('care-suggestion')`. Si mañana el líder de UI cambia ese ID por `.tarjeta-de-alerta`, la lógica del ritmo cardíaco (Salud) colapsará la aplicación con un error tipo `TypeError: Cannot read properties of null` sin avisar en la compilación.
**Solución Escalable:** Usar un **Patrón Pub/Sub (EventBus)**. El motor de "Salud" debería simplemente disparar `window.dispatchEvent(new CustomEvent('ESTRES_ALTO', { detail: { hrv } }))` y la capa responsable del menú UI escucha pasivamente para renderizarse. Componentizan todo, no se tocan.

### Consejo Senior (Clean Code)
**Principio Violado: Single Responsibility Principle (SRP)**.
Actualmente, `app.js` es responsable de:
- Lógica de Vistas (Esconde y muestra Tabs).
- I/O Base de datos local (Guarda/Trae de LocalStorage).
- IA Neuronal (Prompts de SLM).
- Control de Dispositivo (Vibraciones / WakeLocks).

*Por qué importa:* Al violar el SRP y no separar preocupaciones, probar este archivo es casi imposible con *Unit Tests* automáticos (Jest, Playwright). Un Arquitecto Senior abstraería el código segregando funciones en módulos (`/services/storage.js`, `/controllers/nav.js`, `/ai/inferenceEngine.js`), permitiendo que el código de razonamiento de la IA pueda ejecutarse en Node.js, Electron o la Web mañana mismo, ya que no sabrá nada sobre el entorno web dom-específico (botones, textAreas o divs).
