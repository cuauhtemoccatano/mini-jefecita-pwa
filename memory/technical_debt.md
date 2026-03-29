# Memoria Persistente: Deuda Técnica (Technical Debt)

## Áreas Frágiles
- **Acoplamiento de UI/Lógica**: `app.js` manipula el DOM directamente por IDs. Un cambio en `index.html` rompe la lógica de salud.
- **Payload CSS**: El archivo `style.css` es monolítico, lo que dificulta el mantenimiento por componentes.
- **Testing**: Aunque existe `qa_audit.py`, la cobertura de casos de borde (edge cases) en la IA es baja.

## Recomendaciones de Limpieza
- Implementar un **EventBus** para desacoplar el motor de Salud de la vista.
- Dividir el CSS en componentes (`_chat.css`, `_nav.css`).
