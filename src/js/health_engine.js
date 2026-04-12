// ---------------------------------------------------------
// js/health_engine.js - Sincronización Vital
// ---------------------------------------------------------
import { healthData, saveHealth } from './state.js';
import { triggerHaptic } from './ui_engine.js';

export function updateHealthUI() {
    const stepsEl = document.getElementById('health-steps');
    const calsEl = document.getElementById('health-cals');
    if (stepsEl) stepsEl.textContent = (healthData.steps || 0).toLocaleString();
    if (calsEl) calsEl.textContent = healthData.energy || 0;
}

export function initHealthSync() {
    const params = new URLSearchParams(window.location.search);
    const steps = params.get('steps');
    const hrv = params.get('hrv');

    if (steps || hrv) {
        if (steps) healthData.steps = parseInt(steps);
        if (hrv) healthData.hrv = parseInt(hrv);
        saveHealth();
        updateHealthUI();
        analyzeHealthTrends(healthData);
    }
}

export function analyzeHealthTrends(data) {
    const { steps = 0, hrv = 60 } = data;
    const careSuggestion = document.getElementById('care-suggestion');
    if (!careSuggestion) return;

    // Escenario 1: Tensión / Estrés
    if (hrv < 45) {
        careSuggestion.innerHTML = `
            <div class="care-icon">🍵</div>
            <div class="care-text">
                <span class="care-title">Jade nota tensión</span>
                <span class="care-desc">Tu HRV es bajo. Un momento en el Portal Zen podría equilibrarte.</span>
            </div>
            <button id="btn-care-go" class="btn-primary" onclick="document.querySelector('[data-view=zen]').click()">Ir ahora</button>
        `;
        careSuggestion.classList.remove('hidden');
        triggerHaptic('warning');
    } 
    // Escenario 2: Agotamiento físico
    else if (steps > 10000 && hrv < 55) {
        careSuggestion.innerHTML = `
            <div class="care-icon">🔋</div>
            <div class="care-text">
                <span class="care-title">Día Productivo</span>
                <span class="care-desc">Has superado los 10k pasos. Es momento de recargar energías.</span>
            </div>
            <button id="btn-care-go" class="btn-primary" onclick="document.querySelector('[data-view=zen]').click()">Relajarme</button>
        `;
        careSuggestion.classList.remove('hidden');
        triggerHaptic('light');
    } else {
        careSuggestion.classList.add('hidden');
    }
}
