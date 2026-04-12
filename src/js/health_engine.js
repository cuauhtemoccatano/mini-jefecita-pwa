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
    const { steps = 0, hrv = 50 } = data;
    if (steps < 2000 && hrv < 40) {
        console.log("🧠 Jade nota tensión. Sugiriendo pausa...");
        triggerHaptic('warning');
    }
}
