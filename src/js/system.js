// ---------------------------------------------------------
// js/system.js - Utilidades de Sistema, PWA y Atmosfera
// ---------------------------------------------------------
import { syncAtmosphereMatrix } from './ui_engine.js';

export async function getHardwareProfile() {
    let profile = { tier: 'Standard', name: 'Generic', memory: navigator.deviceMemory || 4, battery: 1.0, lowPower: false };
    try {
        if (navigator.getBattery) {
            const b = await navigator.getBattery();
            profile.battery = b.level;
            profile.lowPower = b.level < 0.2 && !b.charging;
        }
        if (!navigator.gpu) return profile;
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (!adapter) return profile;
        const info = await adapter.requestAdapterInfo();
        profile.name = info.description || info.vendor || 'Apple Silicon';
        if (profile.name.toLowerCase().includes('apple') || profile.memory > 8) profile.tier = 'Elite';
        return profile;
    } catch (e) { return profile; }
}

export async function syncAppVersion() {
    try {
        const res = await fetch('./package.json?t=' + Date.now());
        if (!res.ok) throw new Error("Sync failed");
        const pkg = await res.json();
        const label = document.getElementById('app-version-label');
        if (label) label.textContent = `v${pkg.version}`;
        localStorage.setItem('app_version', pkg.version);
    } catch (e) {}
}

export function initConnectivityAwareness() {
    window.addEventListener('online', () => console.log("🌐 Jade: Conexión recuperada."));
    window.addEventListener('offline', () => console.log("📡 Jade: Operando en modo local (Offline)."));
}

export function initInstallManager() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        console.log("✨ MQA: Jade está lista para ser cristalizada como App.");
    });
}

export async function predictOptimalBrainTier() {
    const profile = await getHardwareProfile();
    if (profile.lowPower) return 'ESENCIAL';
    if (profile.tier === 'Elite') return 'ULTRA';
    if (profile.memory >= 8) return 'PRO';
    if (profile.memory >= 4) return 'AVANZADO';
    return 'ESENCIAL';
}

/**
 * Idle Manager con Latido Atmosférico
 * Eliminados imports dinámicos para evitar re-instanciación de módulos
 */
let _atmosphereInterval = null;

export function initIdleManager() {
    const startHeartbeat = () => {
        if (_atmosphereInterval) return;
        _atmosphereInterval = setInterval(() => {
            syncAtmosphereMatrix();
        }, 60000);
    };

    const stopHeartbeat = () => {
        if (_atmosphereInterval) {
            clearInterval(_atmosphereInterval);
            _atmosphereInterval = null;
        }
    };

    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') stopHeartbeat();
        else startHeartbeat();
    });

    startHeartbeat(); // Iniciar al arrancar
}
