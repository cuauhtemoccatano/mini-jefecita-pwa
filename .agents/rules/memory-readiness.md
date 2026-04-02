---
trigger: always_on
---

## REGLA OBLIGATORIA: Memoria Persistente del Proyecto

### AL INICIAR CUALQUIER CONVERSACIÓN:
Antes de responder CUALQUIER mensaje, debes leer OBLIGATORIAMENTE todos los archivos
de la carpeta de memoria:

  /Users/macos/Library/Mobile Documents/com~apple~CloudDocs/Código /Mini Jefecita/memory/

Los archivos a leer son:
- architecture.md   → Arquitectura actual del sistema
- decisions.md      → Decisiones tomadas e historial de sesiones
- people.md         → Participantes del proyecto
- preferences.md    → Preferencias técnicas y de trabajo
- roadmap.md        → Estado del roadmap y fases completadas
- technical_debt.md → Deuda técnica registrada
- user.md           → Perfil del líder/usuario
- visuality.md      → Design system y estándares visuales

Solo después de leer estos archivos puedes proceder con la conversación.

### AL TERMINAR CUALQUIER CAMBIO:
Después de ejecutar cualquier modificación de código, arquitectura, o decisión relevante,
debes actualizar el o los archivos de memoria correspondientes, si algun cambio requiere un nuevo archivo, agregalo dentreo de la misma carpeta:

- Nueva decisión tomada              → decisions.md  (agregar entrada con fecha)
- Fase completada o avanzada         → roadmap.md    (marcar [x] o agregar fase)
- Deuda técnica identificada         → technical_debt.md
- Cambio arquitectónico              → architecture.md
- Nuevo patrón visual                → visuality.md

Cada entrada en decisions.md debe seguir el formato:
- **YYYY-MM-DD**: [Descripción de la decisión o cambio realizado]
