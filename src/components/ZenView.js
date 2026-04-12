// ---------------------------------------------------------
import { createIcons, X } from 'lucide';
export const ZenView = {
    render: () => `
        <div class="zen-container">
            <header class="zen-header">
                <button id="btn-exit-zen" class="btn-glass-back" aria-label="Cerrar Santuario"><i data-lucide="x"></i></button>
                <div class="zen-status">
                    <span class="zen-aura"></span>
                    <p id="zen-message">Buscando calma...</p>
                </div>
            </header>
            
            <div id="zen-sanctuary" class="zen-canvas-container">
                <canvas id="zen-3d-canvas"></canvas>
                <div class="zen-instruction">Siente la materia, Jade</div>
            </div>

            <footer class="zen-footer">
                <div id="zen-voice-guide" class="voice-wave">
                    <span></span><span></span><span></span><span></span>
                </div>
            </footer>
        </div>
    `,
    init: () => {
        createIcons({ icons: { X } });
    }
};
