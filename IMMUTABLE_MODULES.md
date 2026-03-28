# 🛡️ Inventario de Módulos Inmutables (IMM)

Este documento es un **Contrato de Inmutabilidad**. Su propósito es proteger las funciones núcleo (core) y la infraestructura vital de "Mini Jefecita" contra regresiones causadas por refactorizaciones estéticas, actualizaciones de agentes o "mejora continua" no supervisada.

Cualquier componente listado en este archivo se considera **ESTABLE y CERTIFICADO para Producción**. 

---

## 🚫 Protocolo de Desbloqueo (Unlock Protocol)
Para modificar CUALQUIER archivo o bloque de código listado aquí, un agente debe cumplir **todas** las siguientes condiciones:
1. **Escalada a Opus:** La tarea debe ser ejecutada obligatoriamente por el modelo **Claude Opus** o superior, operando en **Planning Mode**. 
2. **Justificación Explícita:** Se debe proveer al usuario un análisis detallado sobre *por qué* es crítico modificar una estructura inmutable.
3. **Aprobación de Desbloqueo:** El usuario debe responder con la confirmación explícita para proceder a tocar el código.

Si un agente (Gemini Flash, Gemini Pro, o Sonnet) intenta alterar estos archivos bajo tareas rutinarias (Fast Mode), **DEBE abortar la edición inmediatamente** y alertar al usuario.

---

## 🧊 The Freeze List (Módulos Blindados)

A continuación se detalla el código congelado al **27/03/2026** (v3.1.2).

### 1. Sistema de Sincronización y Caché (PWA)
- **Ruta:** `sw.js` (Archivo completo) y `vercel.json`.
- **Razón del Blindaje:** El Service Worker actual (v3.1.2) contiene la lógica perfecta para interceptar el agresivo caché de Vercel sin colisionar con la recarga de página.
- **Checksum visual:** El `sw.js` **no** debe tener `self.skipWaiting()` en el listener `install`. Debe depender siempre de un mensaje postMessage `SKIP_WAITING` dictado por la UI (Toast). El `vercel.json` debe imponer un estricto `Cache-Control: no-cache` sobre `sw.js`.

### 2. Motor de Consciencia de IA (WebGPU)
- **Ruta:** `app.js`
- **Bloque:** Función asíncrona `initAI()`
- **Razón del Blindaje:** Esta función establece la aceleración por hardware (`device: 'webgpu'`), gestiona la jerarquía de carga asíncrona Transformers.js v3, inyecta protección contra reposo móvil (`Wake Lock`), reintentos de conexión, y carga los modelos dinámicamente según la CPU del usuario. Cualquier alteración aquí rompería la IA o causaría cuelgues del dispositivo (OOM).

### 3. Gestor de Actualizaciones en Segundo Plano (Idle Manager)
- **Ruta:** `app.js`
- **Bloque:** Función `initIdleManager()` y Setup de eventos de Window `load` para `navigator.serviceWorker`.
- **Razón del Blindaje:** Gestiona la detección invisible de reposo de la app (60 segundos) o si se minimiza la pestaña en iPhone/Mac para forzar la actualización del *Service Worker* sin interrumpir interacciones en proceso.

### 4. Interfaz Respiratoria (Loader)
- **Ruta:** `index.html` y `style.css`
- **Bloques:** `<div id="ai-bg-downloader">` en HTML y sus propiedades `.ai-bg-downloader` en CSS.
- **Razón del Blindaje:** Eliminamos el div bloqueante de pantalla completa; el renderizado ahora es instantáneo y respira en segundo plano. La barra de descarga de IA ahora usa clases *glassmorphism* que no deben alterarse, ya que el estado del DOM (`if (bgDownloader)`) depende enteramente de la existencia de estos IDs fijos.

---
*Si deseas sumar un archivo al IMM, inclúyelo en la Freeze List documentando el `Razón de Blindaje`.*
