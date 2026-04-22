# 🤖 Mini Jefecita: Agent Protocol (v4.1.0)

Este documento define las reglas de operación de cumplimiento obligatorio para los agentes de IA en el ecosistema "Mini Jefecita".

## 🛡️ Protocolo de Gobernanza Maestra [CRITICO]
**Antes de ejecutar cualquier cambio**, el agente DEBE:
1. **Verificar el Archivo IMM**: Consultar `IMMUTABLE_MODULES.md` para asegurarse de que el archivo o bloque a modificar no esté protegido por el Inventario de Módulos Inmutables. Si está en la "Freeze List", el agente DEBE detenerse y pedir autorización explícita de nivel Opus.
2. **Seleccionar Modelo**: Consultar la autoridad suprema de código (Skill: `smartscales-model-selector` localizada en `.agent/skills/must have/smartscales-model-selector/skILL.md`).
3. **Validación**: Emitir una recomendación de **Modelo** y **Modo** (Fast/Planning) basada en la matriz de decisión y ESPERAR aprobación explícita del usuario antes de escribir.

## 🛠 Skills & Herramientas
- **⚖️ smartscales-model-selector**: Gatekeeper de infraestructura de IA.
- **🪄 design-spells**: MANDATO ABSOLUTO. Integrar micro-interacciones mágicas y detalles de diseño premium.
- **✨ animejs-animation**: Motor estándar para transiciones fluidas y feedback sensorial.
- **👁️ ui-visual-validator**: Auditoría obligatoria de glassmorphism y responsividad ProMax.
- **💎 quality-guide**: Validación de estándares visuales y coherencia de marca.
- **🛡️ verification-before-completion**: PROTOCOLO OBLIGATORIO de pruebas reales.
- **🚀 browser_subagent**: Validación QA en entorno local.
- **🤖 vercel-ai-sdk-expert**: Implementación de IA estructurada.

## 📐 Estándares de Plataforma (v4.1.0)
- **Engine**: Transformers.js v3 + WebGPU (Aceleración Neuronal).
- **Multi-Layout**:
  - **Mac/Tablets (>=768px)**: Diseño de barra lateral (Sidebar).
  - **iPhone/Móvil (<768px)**: Diseño de barra inferior (Bottom-bar).
- **IA Local**:
  - **Mac M2 (MASTER)**: Llama-3.2-1B-Instruct.
  - **iPhone (ULTRA/PRO)**: Qwen2.5-0.5B-Instruct.
  - **Fallback (NORMAL)**: SmolLM2-135M.

## ☁️ Roadmap de Sincronización (Supabase)
- **Local-First**: Todos los datos se escriben en `localStorage` primero.
- **Auth Separation**: Preparar lógica para que Jade y el Usuario tengan esquemas de base de datos independientes.
- **Offline Sync**: Mantener la app funcional sin internet usando el caché del Service Worker.

## 🚦 Protocolo de Calidad (QA)
1. Levantar servidor local: `python3 -m http.server 8080`.
2. Validar con `browser_subagent`.
3. **Limpieza de Caché**: Ejecutar limpieza de `localStorage` y `caches` antes de certificar una versión.
4. **Cero Suposiciones**: Siguiendo `verification-before-completion`, no se acepta un "creo que funciona". Se requiere evidencia visual o de consola.

---
*Última actualización: 22-04-2026 | Versión: v4.1.0 (Hardware Accelerated Edition)*

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
