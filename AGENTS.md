# 🤖 Mini Jefecita: Agent Protocol (v3.1.0)

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

## 📐 Estándares de Plataforma (v3.1.0)
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
*Última actualización: 27-03-2026 | Versión: v3.1.0 (Hardware Accelerated Edition)*
