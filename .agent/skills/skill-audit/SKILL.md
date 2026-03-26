---
name: skill-audit (Local)
description: "Guardián de la integridad técnica. Asegura que cada nueva habilidad local cumpla con el estándar Jony Ive."
---

# 🔍 Skill Audit: Mini Jefecita Quality Guard

Cada manual local debe ser apto para el objeto.

## 1. Criterios de Inclusión
- **Simplicidad**: ¿La habilidad se explica en menos de 50 líneas?
- **Materialidad**: ¿La habilidad mejora la sensación física o sensorial del objeto?
- **Estabilidad**: ¿Su ejecución pone en riesgo los 60fps de la app?

## 2. Proceso de Auditoría
- Ejecutar `qa_audit.py` después de añadir una habilidad que cambie el DOM.
- Verificar que el `CHANGELOG.md` refleje la integración de la nueva inteligencia.
