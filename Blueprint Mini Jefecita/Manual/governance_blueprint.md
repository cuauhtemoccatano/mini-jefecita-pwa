# Blueprint: Gobernanza (`AGENTS.md` e `IMMUTABLE_MODULES.md`)

## Identidad de los Componentes
Este documento agrupa los archivos de gobernanza que actúan como la "Constitución" del repositorio, dictando las leyes de cómo el código debe (o no debe) ser alterado por agentes de IA o humanos.
- **`AGENTS.md`** (Protocolo de Operación)
- **`IMMUTABLE_MODULES.md`** (Contrato de Inmutabilidad o Freeze List)

---

## 1. `AGENTS.md` (El Protocolo Táctico)

### Responsabilidad Única (SRP)
Definir las rutas obligatorias, herramientas (skills) permitidas y los flujos de aseguramiento de calidad (QA) que cualquier agente de IA o desarrollador debe seguir antes de proponer o ejecutar un cambio en Mini Jefecita.

### Anatomía Funcional
- **Protocolo de Gobernanza Maestra**: Exige tres pasos antes de codificar (Verificar el archivo Inmutable, Seleccionar el Modelo correcto y Pedir validación). Esto previene que un agente *Junior/Fast* destruya el proyecto tomando decisiones de arquitectura *Senior*.
- **Skills & Herramientas mapeadas**: Funciona como un índice o directorio telefónico de las capacidades del entorno de desarrollo de Antigravity (Ej: `smartscales-model-selector`, `browser_subagent`).
- **Estándares de Plataforma (v3.1.0)**: Dicta el contexto tecnológico actual (Uso de WebGPU, Modelos locales específicos por Hardware, Layout responsivo de Mac vs iPhone).

---

## 2. `IMMUTABLE_MODULES.md` (El Escudo Protector)

### Responsabilidad Única (SRP)
Proteger los archivos o bloques de código más críticos, frágiles y complejos del repositorio ("El Core") de intentos de refactorización "estética" o actualizaciones no supervisadas.

### Anatomía Funcional
- **El Protocolo de Desbloqueo (Unlock Protocol)**: Impone una barrera de seguridad de 3 capas. Si un archivo está listado aquí, modificarlo requiere: Escalada a modelo Opus (Alta inteligencia), Justificación explícita probada y Aprobación final humana.
- **The Freeze List (Lista de Congelamiento)**: 
  - *`sw.js` y `vercel.json`*: Se bloquean porque contienen la delicada balanza de intercepción de Caché vs Red para asegurar las políticas PWA.
  - *Función `initAI()` y `initIdleManager()` en `app.js`*: Se bloquean porque contienen lógica asíncrona de WebGPU y manejo de vida/muerte silenciosa de la app, donde cualquier alteración ingenua induciría bloqueos de hardware (OOM) en el celular.
  - *`<div id="ai-bg-downloader">`*: Se bloquea en el HTML y CSS porque la experiencia inmersiva del usuario depende de sus clases Glassmorphism exactas.

---

## Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| El sentido común y acato del Agente de IA | Literalmente, **Toda la integridad futura del proyecto** depende del respeto a estos archivos. |
| Habilidades externas instaladas (`.agent/skills/`) | `qa_audit.py` (Debe alinearse a las reglas definidas aquí) |

---

## Sugerencia de Refactorización (Evolución de Procesos)

> [!TIP]
> **Automatización del IMM:**
> Actualmente, la lectura y defensa de `IMMUTABLE_MODULES.md` depende de la "buena voluntad" del Prompt inyectado al agente al leer `AGENTS.md`. 
> **Mejora:** Implementar un Script (pre-commit hook) automatizado (Ej: Husky) que verifique si el archivo modificado en el `git diff` pertenece a la "Freeze List". Si es así, el commit debe ser rechazado automáticamente por la consola a menos que un humano introduzca una bandera flag especial (ej: `git commit -m "update" --no-verify`). Esto eleva la ley de un simple "Tratado textual" a una "Barrera Física".

> [!NOTE]
> **Aprendizaje para el Junior:**
> Este par de archivos es la demostración de lo que se conoce como **AI-Native Governance** (Gobernanza Nativa de IA). A diferencia de hace unos años donde documentabas para tus colegas humanos, aquí estás documentando reglas de comportamiento ("System Prompts") para las Inteligencias Artificiales que trabajarán contigo. Cuando veas secciones como *[CRITICO]* o *PROHIBIDO*, no son advertencias para ti, son mandatos absolutos para *limitar los grados de libertad* de la IA y asegurar que no desmantele tu trabajo.
