// ---------------------------------------------------------
// js/state.js - Memoria y Persistencia
// ---------------------------------------------------------

export let userData = null;
export let healthData = null;

export function loadState() {
    try {
        userData = JSON.parse(localStorage.getItem('user_settings') || '{"name": "Viajero", "jadeName": "Jade", "color": "#00C4B4", "vibe": "💚", "brain": "AUTO", "streak": 0, "remindersCount": 0, "chatHistory": [], "onboarded": false}');
        healthData = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "energy": 0, "hrv": 50}');
    } catch (e) {
        console.warn("🛡️ MQA: Re-armonizando datos de estado...");
        userData = {"name": "Viajero", "jadeName": "Jade", "color": "#00C4B4", "vibe": "💚", "brain": "AUTO", "streak": 0, "remindersCount": 0, "chatHistory": [], "onboarded": false};
        healthData = {"steps": 0, "energy": 0, "hrv": 50};
    }
}

export const saveSettings = () => localStorage.setItem('user_settings', JSON.stringify(userData));
export const saveHealth = () => localStorage.setItem('health_data', JSON.stringify(healthData));

export function saveAll() {
    saveSettings();
    saveHealth();
}

export function clearChatHistory() {
    userData.chatHistory = [];
    saveSettings();
}
