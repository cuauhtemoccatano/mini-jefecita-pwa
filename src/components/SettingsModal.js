// ---------------------------------------------------------
// js/components/SettingsModal.js - Crystal Edition v3.6.0
// ---------------------------------------------------------
export const SettingsModal = {
    render: (userData) => `
        <div class="modal-content">
            <header class="modal-header">
                <h2>Ajustes de Consciencia</h2>
            </header>
            
            <div class="set-section">
                <label>Personalización de Aura <i data-lucide="palette" style="width: 14px;"></i></label>
                <p class="set-desc">Jade modula su atmósfera según tu elección sensorial.</p>
                <div class="aura-presets">
                    <button class="aura-chip jade ${userData.auraPreset === 'jade' ? 'active' : ''}" data-color="#00C4B4" data-preset="jade" title="Jade (Standard)"><span></span></button>
                    <button class="aura-chip sapphire ${userData.auraPreset === 'sapphire' ? 'active' : ''}" data-color="#00E5FF" data-preset="sapphire" title="Zafiro (Energía)"><span></span></button>
                    <button class="aura-chip amethyst ${userData.auraPreset === 'amethyst' ? 'active' : ''}" data-color="#9575CD" data-preset="amethyst" title="Amatista (Calma)"><span></span></button>
                    <button class="aura-chip obsidian ${userData.auraPreset === 'obsidian' ? 'active' : ''}" data-color="#1A237E" data-preset="obsidian" title="Obsidiana (Foco)"><span></span></button>
                    <button class="aura-chip gold ${userData.auraPreset === 'gold' ? 'active' : ''}" data-color="#FFB300" data-preset="oro" title="Oro (Claridad)"><span></span></button>
                    <button class="aura-chip amber ${userData.auraPreset === 'amber' ? 'active' : ''}" data-color="#FB8C00" data-preset="ambar" title="Ámbar (Vitalidad)"><span></span></button>
                    
                    <div class="custom-aura-input">
                        <input type="color" id="set-aura-hex" value="${userData.auraColor || '#00C4B4'}" title="Color personalizado">
                    </div>
                </div>
                <input type="hidden" id="set-aura-preset" value="${userData.auraPreset || 'jade'}">
            </div>

            <div class="set-section">
                <label for="set-name">Tu Identidad</label>
                <input type="text" id="set-name" placeholder="Tu nombre..." value="${userData.name}">
                
                <label for="set-jade-name" style="margin-top: 15px; display: block;">Nombre de tu IA</label>
                <input type="text" id="set-jade-name" placeholder="Ej: Jade, Alexa..." value="${userData.jadeName || 'Jade'}">
            </div>

            <div class="set-section">
                <label>Potencia de IA <i data-lucide="brain" style="width: 14px;"></i></label>
                <select id="set-brain-level" class="set-select">
                    <option value="AUTO" ${(!userData.brain || userData.brain === 'AUTO') ? 'selected' : ''}>Auto-Inteligencia</option>
                    <option value="ULTRA" ${userData.brain === 'ULTRA' ? 'selected' : ''}>Ultra (Llama-3.2)</option>
                    <option value="PRO" ${userData.brain === 'PRO' ? 'selected' : ''}>Pro (Qwen-2.5)</option>
                    <option value="ESENCIAL" ${userData.brain === 'ESENCIAL' ? 'selected' : ''}>Esencial (SmolLM2)</option>
                </select>
            </div>

            <div class="modal-actions">
                <button id="btn-save-settings" class="btn-primary">Sincronizar</button>
                <button id="btn-close-settings" class="btn-secondary">Cerrar</button>
            </div>
        </div>
    `,
    init: async () => {
        if (window.lucide) lucide.createIcons();
        
        const chips = document.querySelectorAll('.aura-chip');
        const presetInput = document.getElementById('set-aura-preset');
        const hexInput = document.getElementById('set-aura-hex');

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                presetInput.value = chip.dataset.preset;
                hexInput.value = chip.dataset.color;
            });
        });

        hexInput?.addEventListener('input', (e) => {
            chips.forEach(c => c.classList.remove('active'));
            presetInput.value = 'custom';
        });
    }
};
