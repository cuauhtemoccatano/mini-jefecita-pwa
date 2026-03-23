# 🤖 Mini Jefecita: Agent Protocol (v2.0.0)

Este documento define las reglas de operación para los agentes de IA que trabajen en el ecosistema "Mini Jefecita".

## 🛠 Skills & Herramientas
- **💎 quality-guide**: localiza en `.agent/skills/quality-guide/`. Úsalo para validar CUALQUIER cambio visual.
- **👁️ ui-visual-validator**: Skill de sistema para validación de responsividad y glassmorphism.
- **�️ verification-before-completion**: PROTOCOLO OBLIGATORIO. Prohibido reportar éxito sin pruebas reales.
- **�🚀 browser_subagent**: Herramienta indispensable para validación QA local (`localhost:8080`).

## 📐 Estándares de Plataforma (v2.0.0)
- **Multi-Layout**:
  - **Mac/Tablets (>=768px)**: Diseño de barra lateral (Sidebar).
  - **iPhone/Móvil (<768px)**: Diseño de barra inferior (Bottom-bar).
- **IA Local**:
  - Máximo 1.8B para Mac (vía selector Maestro).
  - Máximo 135M por defecto en iPhone (vía selector Esencial).

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
*Última actualización: 23-03-2026 | Versión: v2.0.0 (Cloud Prep Edition)*
