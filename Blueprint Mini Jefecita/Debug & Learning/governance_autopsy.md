# Debug & Learning: Gobernanza (`AGENTS.md` e `IMMUTABLE_MODULES.md`) (Autopsia Quirúrgica)

## 1. Identidad y Propósito Crítico
- **Nombre:** `AGENTS.md` e `IMMUTABLE_MODULES.md`
- **Ubicación:** Raíz del Repositorio (`/`)
- **Tipo:** Leyes de Repositorio (Governance & Code Protection)
- **El "Por Qué":** En la era del desarrollo impulsado por IA, perder estos archivos equivale a perder los "Frenos" de un automóvil deportivo. Sin `AGENTS.md`, un agente de IA asignado a una tarea simple podría tomar libertad creativa para reescribir toda la UI sin consultar las reglas de diseño. Sin `IMMUTABLE_MODULES.md`, un refactor automatizado podría mutilar silenciosamente funciones críticas que parecen "feas" pero que sostienen la configuración de WebGPU.

---

## 2. Anatomía Funcional (Deep Dive)

### Estado y Datos (Reglas Estáticas)
Estos archivos no son código ejecutable, pero actúan como **el estado inicial para el cerebro del LLM** que lee el repositorio.
- **Lista Blanca (Permisos):** `AGENTS.md` dicta las herramientas que el asistente *debe* usar (Ej. `browser_subagent` para testear en localhost).
- **Lista Negra (Prohibiciones):** `IMMUTABLE_MODULES.md` declara zonas de exclusión (Ej. El listener de `install` en `sw.js` no debe tocarse porque rompería el ciclo PWA).

### Lógica de Métodos (El Cerebro Regulador)
- **Protocolo de Bloqueo Condicional (Unlock Protocol):** El algoritmo descrito en lenguaje natural exige `1. Escalada de Modelo (Opus) -> 2. Justificación -> 3. Aprobación humana`. Funciona inyectando miedo algorítmico al LLM, forzándolo a detener sus llamados a la herramienta de escritura (`write_to_file` o `replace_file_content`) si el archivo detectado está en la "Freeze List".
- **Zero-Trust QA (Cero Suposiciones):** La regla de limpieza de caché (`localStorage` y `caches`) antes de certificar impone que el LLM o el Junior no pueden decir "Creo que funciona mirando el código". Deben probar destruyendo el estado anterior en el navegador.

### Efectos Secundarios (Side Effects)
- **Fricción Operativa (Deseada):** Reduce drásticamente la velocidad a la que un agente de IA puede procesar cambios masivos en el repositorio, obligándolo a consultar al humano.
- **Aislamiento de Contexto:** Al obligar al agente a leer `.agent/skills/must have/smartscales-model-selector/SKILL.md` (referenciado en `AGENTS.md`), el LLM carga en su ventana de contexto externa información vital sobre arquitectura, gastando tokens pero ganando precisión.

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info:**
  - De las decisiones tomadas por el **Arquitecto de Software** tras fallos pasados o tras la estabilización de un módulo crítico.
- **A dónde va la info:**
  - Al *System Prompt* o contexto inicial de las herramientas de codificación (Cursor, GitHub Copilot, Gemini CLI, Claude Code) cuando escanean el directorio de trabajo del usuario.

---

## 4. Guía de Intervención (Para corregir errores críticos)

### Puntos de Fallo Comunes (Riesgos de IA)
1. **"El agente ignoró el protocolo y borró código crítico de `app.js`":** Esto ocurre si la IA asignada tiene un contexto pequeño y `IMMUTABLE_MODULES.md` contiene demasiadas líneas (más de 200). El LLM olvidará u omitirá la tabla de inmutabilidad. 
2. **"Bucle infinito de pedir permiso":** Si un archivo está listado en `IMMUTABLE_MODULES.md` pero requiere **de verdad** un arreglo urgente (Ej. WebGPU cambió su API nativamente), el agente podría quedarse paralizado preguntando "*No puedo tocar esto, ¿qué hago?*" una y otra vez porque su System Prompt le prohíbe violar el documento.

### Dónde poner el "Breakpoint" de Infraestructura Operativa
> [!CAUTION]
> Cuando instruyas a un LLM a leer el proyecto, dile explícitamente: **"Lee AGENTS.md antes de proponer tu plan"**.
> Si el agente falla repetidamente o rompe las reglas, el "debugger" aquí es revisar la redacción del archivo Markdown. **Los LLMs responden pobremente a negaciones** (Ej. "NO toques esto"). Responden excepcionalmente bien a imperativos directos: "DEBES ABORTAR Y PEDIR PERMISO SI EL ARCHIVO ESTÁ EN LA FREEZE LIST".

### Dependencias de Riesgo
- **Evolución del Tooling de IA:** Estos archivos (conocidos como *Agentfiles*) no son un estándar consolidado en la industria del software. Herramientas futuras podrían ignorarlos por completo a menos que se integren directamente en el formato nativo del IDE del desarrollador.

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
Ambos archivos requieren **mantenimiento manual**.
**La Fragilidad (Código Muerto Administrativo):** Si el Arquitecto decide refactorizar `app.js` separándolo en dos archivos (`ai.js` y `ui.js`) el próximo año, y olvida actualizar la "Freeze List" en `IMMUTABLE_MODULES.md`, los nuevos archivos críticos quedarán desprotegidos y los antiguos punteros a `app.js` (que ya no existe) confundirán al agente de IA.
**Cómo Escalar:** Mantener una higiene rigurosa. Un Junior no debe tener miedo a borrar reglas obsoletas de `AGENTS.md` si el contexto tecnológico del proyecto ha cambiado.

### Consejo Senior (Desarrollo Guiado por Agentes)
**Principio Promovido: Defensa en Profundidad (Defense in Depth) para IA.**
Al escribir código que será mantenido tanto por humanos como por agentes autónomos, la arquitectura cambia. Ya no sólo escribes comentarios para explicar un algoritmo complejo; escribes directivas para cercar el comportamiento probabilístico de una máquina.
*Por qué importa:* Las IAs tienden a tomar el "camino de menor resistencia". Si les pides arreglar un diseño, es capaz de reescribir un `style.css` completo en lugar de añadir una clase. Al tener `AGENTS.md` estableciendo explícitamente los *Estándares de Plataforma*, limitas el espacio de búsqueda del LLM, obligándolo a actuar como un cirujano en lugar de una excavadora.
