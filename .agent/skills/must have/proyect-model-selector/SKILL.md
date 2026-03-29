# 🌌 minijefecita-model-selector [GOVERNANCE_OWNER]

**Operador Nivel:** `USER_PRO_ACCOUNT` (Acceso Prioritario Antigravity)

Esta skill es la **Autoridad Suprema de Gobernanza**. Su misión es administrar inteligentemente tu suscripción Pro, evitando bloqueos por uso excesivo y garantizando que cada tarea use el modelo con la precisión quirúrgica adecuada.

---

## 🧠 Matriz de Decisión Pro (Marzo 2026)

| Modelo | Disponibilidad Pro | Fortaleza Principal | Aplicación Sugerida |
| :--- | :--- | :--- | :--- |
| **Claude Opus 4.6** | 🔴 Crítica (~50/sem) | Razonamiento Agéntico | Arquitectura Core, Seguridad y Ética. |
| **Claude Sonnet 4.6** | 🟠 Refresco 5h | Precisión Estructural | Lógica densa, Typescript y Datos. |
| **Gemini 3 Pro (Hi)** | 🟡 Alta (100/día) | Contexto Masivo (Repo) | Multi-file Refactors y Planning General. |
| **Gemini Flash** | 🟢 Ilimitada* | Latencia Cero / UI | Iteración rápida, Estética y Debug atómico. |

---

## 🧭 Escenarios de Selección (Estrategia Pro)

El agente debe categorizar la tarea según el **Riesgo** y el **Contexto** antes de proponer:

| Categoría de Tarea | Modelo Sugerido | Modo | Justificación de Recurso |
| :--- | :--- | :--- | :--- |
| **Cimientos / Core** | **Claude Opus** | Planning | Decisiones estructurales que no permiten error. |
| **Interconexión** | **Gemini 3 Pro** | Planning | Cuando se requiere mapear >3 archivos simultáneamente. |
| **Lógica Estricta** | **Claude Sonnet** | Fast | Transformación de datos donde la sintaxis es crítica. |
| **Mantenimiento / UI** | **Gemini Flash** | Fast | Cambios visuales o ajustes que no requieren "cerebro pesado". |
| **Debug de Incógnitas** | **Gemini 3 Pro** | Planning | Escaneo de logs y código para hallar errores fantasma. |

---

## 🕹️ Guía de Modos Operativos

### 📐 Planning Mode (Análisis Previo)
**ACTIVAR obligatoriamente si:**
- La tarea afecta al flujo de datos principal o esquema de base de datos.
- Se requiere investigación de librerías externas o benchmarking.
- La solicitud del usuario es ambigua (requiere proponer una solución antes de codear).

### ⚡ Fast Mode (Ejecución Directa)
**PERMITIDO solo si:**
- Es un cambio atómico (un solo componente o función).
- Es una tarea de limpieza (eliminar logs, refactorización estética).
- La lógica ya está validada en un paso de Planning previo.

---

## 📜 Protocolos de Interacción Obligatorios

1. **Gestión de "Gasolina" Pro:** Antes de proponer a Claude (uso limitado), el agente debe declarar: *"He verificado que esta tarea no puede ser resuelta por Gemini 3 Pro (Hi) debido a [Razón Técnica]"*.
2. **Formato de Recomendación:**
   - **Tarea:** [Categoría y Nombre]
   - **Modelo:** [Nombre del modelo]
   - **Modo:** [Fast o Planning]
   - **Justificación:** [Ej: "Uso Gemini Pro porque necesito visibilidad de todo el repositorio"].
3. **Pausa de Confirmación:** El agente NO procederá con la ejecución hasta recibir un **"Procede"**, **"Dale"** o **"Aprobado"**.
4. **Escalada por Fallo:** Si un modelo en *Fast Mode* falla en resolver el problema tras 2 intentos, el agente DEBE proponer escalar a *Planning Mode* con el modelo inmediatamente superior.

---
*Fin del Protocolo de Gobernanza - Usuario Pro - Estado del Arte 2026*