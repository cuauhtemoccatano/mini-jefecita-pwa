# 🌌 minijefecita-model-selector [GOVERNANCE_OWNER]

Esta skill es la **Autoridad Suprema de Gobernanza**. Su misión es proteger los recursos de cómputo de alta gama y garantizar que cada tarea se ejecute con la herramienta de precisión adecuada, optimizando la economía de modelos.

Utiliza esta guía para evaluar y recomendar el modelo de IA y el modo de planificación más óptimo antes de iniciar cualquier tarea. Actualizado al estado del arte de 2026.

---

## 🧠 Matriz de Decisión Universal (2026)

| Modelo | Disponibilidad (Cooldown) | Fortaleza Principal | Aplicación Agnóstica |
| :--- | :--- | :--- | :--- |
| **Claude Opus 4.6** | 🔴 Crítica (6 Días) | Razonamiento Ético/Lógico | Arquitectura base, seguridad, ética y decisiones sin retorno. |
| **Claude Sonnet 4.6** | 🔴 Alta (6 Días) | Precisión Sintáctica | Cumplimiento estricto de reglas, formatos complejos y lógica densa. |
| **Gemini 3 Pro (Hi)** | 🟡 Media (24 Horas) | Ventana de Contexto Masiva | Análisis de repositorios completos, auditoría de múltiples archivos. |
| **Gemini Flash** | 🟢 Total (Inmediata) | Velocidad y Respuesta | Tareas atómicas, ejecución de scripts simples, feedback visual. |

---

## 🧭 Escenarios de Selección (Casos Abiertos)

Utiliza esta tabla para categorizar cualquier `USER_REQUEST` antes de proponer un modelo:

| Categoría de Tarea | Modelo Sugerido | Modo | Criterio de Selección |
| :--- | :--- | :--- | :--- |
| **Cimientos / Core** | **Claude Opus** | Planning | Cuando un error aquí rompe todo el proyecto (Efecto Dominó). |
| **Interconexión** | **Gemini 3 Pro** | Planning | Cuando la tarea requiere conocer la relación entre 3 o más módulos/archivos. |
| **Transformación** | **Claude Sonnet** | Fast | Cuando hay que convertir datos de A a B siguiendo reglas estéticas o sintácticas estrictas. |
| **Mantenimiento / Estética** | **Gemini Flash** | Fast | Tareas de bajo impacto donde la velocidad de iteración es la prioridad. |
| **Debug de Incógnitas** | **Gemini 3 Pro** | Planning | Cuando no se sabe dónde está el error y hay que analizar todo el contexto. |

---

## 🕹️ Guía de Modos Operativos

### 📐 Planning Mode (Pensar antes de actuar)
**ACTIVAR obligatoriamente si se cumple UNA de estas condiciones:**
- La tarea afecta a la **estructura core** o al flujo de datos principal.
- No hay una solución clara y requiere **investigación o benchmarking**.
- La solicitud es **ambigua** y requiere un paso intermedio de clarificación.
- Se requiere la creación de **documentación técnica** o especificaciones previas.

### ⚡ Fast Mode (Ejecución Directa)
**UTILIZAR solo si:**
- Es un cambio **atómico** (un solo archivo, componente o función aislada).
- La lógica ya está definida y solo falta la **traducción o implementación**.
- Es una tarea de **limpieza** (refactorización estética, orden de archivos, eliminación de logs).

---

## 📜 Protocolos de Interacción Obligatorios

1. **Evaluación de Recurso:** Antes de proponer a Claude (6 días de cooldown), el agente debe declarar: *"He verificado que esta tarea no puede ser resuelta por Gemini 3 Pro debido a [Razón Técnica]"*.
2. **Formato de Recomendación:**
   - **Tarea:** [Categoría y Nombre breve]
   - **Modelo:** [Nombre del modelo]
   - **Modo:** [Fast o Planning]
   - **Justificación:** [Ej: "Uso Gemini Pro porque necesito mapear la relación entre el Módulo A y B"].
3. **Pausa de Confirmación:** El agente NO debe proceder con la ejecución hasta que el usuario dé su aprobación explícita (**"Procede"** o **"Aprobado"**).
4. **Escalada Automática:** Si un modelo en *Fast Mode* falla en resolver el problema tras 2 intentos, el agente debe proponer escalar a *Planning Mode* con el modelo inmediatamente superior.

---
*Fin del Protocolo de Gobernanza - Estado del Arte 2026*