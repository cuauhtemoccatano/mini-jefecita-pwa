# Design System: Visuality & Materiality

Mini Jefecita's visual language is built on the principles of "Industrial Glass" and "Neural Flow," mirroring the aesthetic elite standards of SmartScales 2.

## Neural Components Pattern
Las vistas no son HTML estático, sino componentes funcionales React (.jsx) que:
- Viven en `src/components/`.
- Utilizan **Aura Hooks** para sintonizar el color basado en biometría.
- **Spectral Core**: Algoritmo que sintetiza el aura basada en el latido biológico (HRV) y el ciclo circadiano.
- **Side-Rail Topology**: Navegación lateral obligatoria para iPad y Desktop (ancho > 768px).
- **Safe-Area Compliance**: Respeto mandatorio de las zonas de exclusión física (notch/home-bar).
- **ProMax Structural Symmetry**: Uso de rejillas de columnas fijas (`repeat(2, 1fr)`) en estadísticas.

## Iconographic Standard: Pure Lucide
To maintain a professional, corporate-grade finish:
- Emojis are strictly banned from the core UI.
- All icons must be vectorized Lucide assets.
- Consistent weights and colors are enforced across all portals.

## Spatial Materiality & Liquid Glass Premium
The interface utilizes **Liquid Glass Premium** standards:
- **Glass Border Premium**: Bordes con gradiente iridiscente sutil (utilidad `.glass-border-premium`).
- **APCA Contrast Compliance**: Uso mandatario de `neutral-400` sobre `neutral-500` para textos secundarios sobre fondos oscuros, garantizando legibilidad industrial.
- **Animation Physics**: Toda transición debe usar curvas Bezier ProMax (`cubic-bezier(0.2, 0, 0, 1)`) para asegurar fluidez orgánica.
- **Micro-interacciones**: El motor `spells_engine.js` gestiona efectos magnéticos y pulsos de IA para elevar la tactilidad digital.
