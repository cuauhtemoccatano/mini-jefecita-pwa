# Design System: Visuality & Materiality

Mini Jefecita's visual language is built on the principles of "Industrial Glass" and "Neural Flow," mirroring the aesthetic elite standards of SmartScales 2.

## Liquid Components Pattern
UI views are not static HTML. They are dynamic functional modules that:
- Live in `js/components/`.
- Export a `render()` function returning template strings.
- **Spectral Core**: Algoritmo que sintetiza el aura basada en el latido biológico (HRV) y el ciclo circadiano.
- **Side-Rail Topology**: Navegación lateral obligatoria para iPad y Desktop (ancho > 768px) para optimizar el espacio espacial.
- **Safe-Area Compliance**: Respeto mandatorio de las zonas de exclusión física del OS (notch/home-bar) mediante constantes CSS `env`.
- **High-Fidelity Fluidity**: Uso de rejillas adaptativas `repeat(auto-fit)` para evitar saltos bruscos entre dispositivos.
- Export an `init()` function for post-render event binding and Lucide icon creation.

## Iconographic Standard: Pure Lucide
To maintain a professional, corporate-grade finish:
- Emojis are strictly banned from the core UI.
- All icons must be vectorized Lucide assets (`data-lucide` attributes).
- Consistent weights and colors (e.g., `var(--primary)`) are enforced across all portals.

## Spatial Materiality
The "Santuario" module extends the design system into 3D, using Three.js and WebGL to create tactile, glass-morphic experiences that respond to neural status and environmental hardware potential.
