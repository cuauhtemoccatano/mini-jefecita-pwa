# smartscales-model-selector [GOVERNANCE_OWNER]

Esta skill es la **Autoridad Suprema de Gobernanza** en SmartScales 2. Controla el flujo de aprobación y la selección de infraestructura de IA para todas las sesiones.

Utiliza esta skill para evaluar y recomendar el modelo de IA y el modo de planificación más óptimo antes de iniciar cualquier tarea en el proyecto SmartScales 2. Esta guía está actualizada al estado del arte de 2026.

## 🧠 Matriz de Decisión de Modelos (2026)

| Modelo | Escasez (Cooldown) | Fortaleza Principal | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **Claude Opus 4.6** | 🔴 6 Días | Razonamiento Agéntico Top | Foundational Architecture / Crises |
| **Claude Sonnet 4.6** | 🔴 6 Días | Precisión en Datos Structure | Complex Feature Implementation |
| **Gemini 3 Pro (Hi)** | 🟡 24 Horas | Deep Context / Repo-wide | Multi-file Refactors / Planning |
| **Gemini Flash** | 🟢 Ninguna | Latencia / UI / Iteración | Everyday Coding / UI Tweaks |

## ⚖️ Regla de Economía de Modelos
- **No quemes un Claude** por una tarea que Gemini Pro (24h) puede resolver.
- **No quemes un Gemini Pro** por ajustes visuales que Flash maneja perfectamente.

## 🕹️ Guía de Modos (Fast vs. Planning)

- **Planning Mode:** ACTIVAR obligatoriamente para:
  - Nuevas integraciones de servicios.
  - Cambios en el esquema de la base de datos (Supabase).
  - Definición de prompts sistémicos complejos.
  - Tareas que afecten a múltiples archivos.
- **Fast Mode:** UTILIZAR para:
  - Ajustes visuales (CSS/Tailwind).
  - Corrección de bugs menores ya identificados.
  - Limpieza de logs o refactorización de un solo componente.

## 📜 Protocolos de Interacción

1. **Evaluación Previa:** Antes de ejecutar cualquier `USER_REQUEST`, el agente DEBE emitir un juicio basado en esta skill.
2. **Formato de Recomendación:**
   - **Tarea:** [Nombre breve]
   - **Modelo:** [Nombre del modelo]
   - **Modo:** [Fast o Planning]
   - **Justificación:** [Por qué este modelo es el mejor para este caso]
3. **Pausa de Confirmación:** El agente NO debe proceder con la ejecución hasta que el usuario dé su aprobación explícita tras la recomendación.

## 🛠️ Casos de Uso Específicos de SmartScales

- **Módulo Intelligence/Neural:** Siempre requiere **Claude Opus 4.6** para asegurar que el output estructurado no rompa la UI.
- **Mantenimiento de Roadmap:** Puede realizarse con **Gemini Flash** en modo Fast.
- **Modo Zen:** Requiere **Gemini 3 Pro (High)** por la densidad de contexto y la necesidad de integrar múltiples componentes de UI/UX.
