// ---------------------------------------------------------
// js/spells_engine.js - Motor de Micro-interacciones Mágicas
// ---------------------------------------------------------

/**
 * Design Spell: Magnetic Core
 * Hace que los elementos marcados con .btn-zen-trigger tengan atracción magnética.
 */
/**
 * Design Spell: Magnetic Core (v4.0.0)
 * Delegación de eventos para soporte dinámico de React.
 */
export function initMagneticSpells() {
    document.addEventListener('mousemove', (e) => {
        const btn = e.target.closest('.btn-zen-trigger, .btn-icon, .liquid-button, .mqa-btn-magnetic');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Atracción magnética sutil
        btn.style.transition = 'transform 0.1s ease-out';
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        
        const icon = btn.querySelector('i, svg');
        if (icon) icon.style.filter = `drop-shadow(0 0 10px var(--primary))`;
    });

    document.addEventListener('mouseout', (e) => {
        const btn = e.target.closest('.btn-zen-trigger, .btn-icon, .liquid-button, .mqa-btn-magnetic');
        if (!btn) return;
        
        btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        btn.style.transform = `translate(0px, 0px)`;
        
        const icon = btn.querySelector('i, svg');
        if (icon) icon.style.filter = `none`;
    });
}

/**
 * Design Spell: Neural Pulse
 * Crea un pulso visual orgánico cuando hay actividad de IA.
 */
export function castPulseSpell() {
    const core = document.getElementById('liquid-core');
    if (!core) return;

    core.classList.add('pulse-neural');
    // La duración y el loop se gestionan vía CSS para estabilidad total
}
