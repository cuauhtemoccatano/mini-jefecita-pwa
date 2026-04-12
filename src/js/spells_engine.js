// ---------------------------------------------------------
// js/spells_engine.js - Motor de Micro-interacciones Mágicas
// ---------------------------------------------------------

/**
 * Design Spell: Magnetic Core
 * Hace que los elementos marcados con .btn-zen-trigger tengan atracción magnética.
 */
export function initMagneticSpells() {
    const targets = document.querySelectorAll('.btn-zen-trigger, .btn-icon');
    
    targets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Efecto magnético sutil (atracción hacia el cursor)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            
            // Brillo de aura dinámico si el botón tiene icono
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.filter = `drop-shadow(0 0 10px var(--primary))`;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            // Retorno suave a la posición original
            btn.style.transform = `translate(0px, 0px)`;
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.filter = `none`;
            }
        });
    });
}

/**
 * Design Spell: Neural Pulse
 * Crea un pulso visual en el aura cuando hay actividad de IA.
 */
export function castPulseSpell() {
    const core = document.querySelector('.btn-zen-trigger');
    if (!core) return;

    core.classList.add('pulse-active');
    setTimeout(() => core.classList.remove('pulse-active'), 2000);
}
