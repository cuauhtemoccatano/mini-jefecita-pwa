// ---------------------------------------------------------
// js/state.js - Memoria y Persistencia
// ---------------------------------------------------------

export let userData = null;
export let healthData = null;

export function loadState() {
    try {
        userData = JSON.parse(localStorage.getItem('user_settings') || '{"name": "Jade", "jadeName": "Jefecita", "color": "#00C4B4", "vibe": "💚", "brain": "PRO", "streak": 7, "remindersCount": 3}');
        healthData = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "energy": 0, "hrv": 50}');
    } catch (e) {
        console.warn("🛡️ MQA: Re-armonizando datos de estado...");
        userData = {"name": "Jade", "jadeName": "Jefecita", "color": "#00C4B4", "vibe": "💚", "brain": "PRO", "streak": 0, "remindersCount": 0};
        healthData = {"steps": 0, "energy": 0, "hrv": 50};
    }
}

export const saveSettings = () => localStorage.setItem('user_settings', JSON.stringify(userData));
export const saveHealth = () => localStorage.setItem('health_data', JSON.stringify(healthData));

export function saveAll() {
    saveSettings();
    saveHealth();
}
