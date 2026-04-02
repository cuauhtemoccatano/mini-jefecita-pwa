// ---------------------------------------------------------
// js/components/SettingsModal.js
// ---------------------------------------------------------
export const SettingsModal = {
    render: (userData) => `
        <div class="modal-content">
            <div class="set-group">
                <label for="set-name">¿Cómo te llamas?</label>
                <input type="text" id="set-name" placeholder="Tu nombre..." value="${userData.name}">
            </div>
            <div class="set-group">
                <label for="set-jade-name">Nombre de tu IA</label>
                <input type="text" id="set-jade-name" placeholder="Ej: Jade, Alexa, Minerva..." value="${userData.jadeName}">
            </div>
            <div class="set-group">
                <label for="set-vibe">Aura de IA <i data-lucide="palette" style="width: 14px;"></i></label>
                <input type="text" id="set-vibe" placeholder="Color o palabra clave (ej: esmeralda)..." value="${userData.vibe}">
                <p class="set-desc" style="font-size: 10px; margin-top: 4px; opacity: 0.6;">Jade modula su tono según tu energía vital.</p>
            </div>

            <div class="set-section">
                <label>Potencia de IA <i data-lucide="brain" style="width: 14px;"></i></label>
                <p class="set-desc">Modelos grandes son más listos pero pueden cerrar la app en móvil.</p>
                <select id="set-brain-level" class="set-select">
                    <option value="AUTO" ${(!userData.brain || userData.brain === 'AUTO') ? 'selected' : ''}>Auto-Inteligencia (Recomendado)</option>
                    <option value="ULTRA" ${userData.brain === 'ULTRA' ? 'selected' : ''}>Ultra (Máxima Fidelidad)</option>
                    <option value="PRO" ${userData.brain === 'PRO' ? 'selected' : ''}>Pro (Rendimiento Alto)</option>
                    <option value="AVANZADO" ${userData.brain === 'AVANZADO' ? 'selected' : ''}>Avanzado (Equilibrado)</option>
                    <option value="ESENCIAL" ${userData.brain === 'ESENCIAL' ? 'selected' : ''}>Esencial (Ligero)</option>
                </select>
                <div id="hardware-badge" style="font-size: 10px; color: var(--primary); margin-top: 4px; display: none;">
                    <i data-lucide="check-circle" style="width: 10px;"></i> Hardware Optimizado
                </div>
            </div>

            <div class="set-section">
                <label>Sincronización de Salud <i data-lucide="apple" style="width: 14px;"></i></label>
                <p class="set-desc">Activa este Atajo en iOS para ver tus pasos aquí.</p>
                <button id="btn-copy-shortcut" class="btn-secondary-full">Copiar Enlace de Atajo <i data-lucide="copy" style="width: 14px;"></i></button>
            </div>

            <div class="set-section">
                <label>Sistema <i data-lucide="rocket" style="width: 14px;"></i></label>
                <p class="settings-title">Configuración <span id="app-version-label" style="font-size: 0.7em; opacity: 0.5;">v${localStorage.getItem('app_version') || '3.5.0'}</span></p>
                <div id="silicon-tier-label" style="font-size: 9px; opacity: 0.4; margin-top: 4px; display: none;">Detectando hardware...</div>
                <button id="btn-reset-ai" class="btn-secondary-full" style="background: rgba(255, 69, 0, 0.1); border-color: rgba(255, 69, 0, 0.2); margin-top: 8px;">Re-sintonizar Cerebro <i data-lucide="refresh-cw" style="width: 14px;"></i></button>
                <button id="btn-check-updates" class="btn-secondary-full">Buscar Actualizaciones <i data-lucide="download" style="width: 14px;"></i></button>
            </div>

            <div class="modal-actions">
                <button id="btn-save-settings" class="btn-primary">Guardar</button>
                <button id="btn-close-settings" class="btn-secondary">Cerrar</button>
            </div>
        </div>
    `,
    init: async () => {
        if (window.lucide) lucide.createIcons();
        if (!userData.brain || userData.brain === 'AUTO') {
            document.getElementById('hardware-badge')?.setAttribute('style', 'font-size: 10px; color: var(--primary); margin-top: 4px; display: block;');
        }
    }
};
