// ---------------------------------------------------------
// js/system.js - Utilidades de Sistema y Hardware
// ---------------------------------------------------------
import { userData } from './state.js';

export async function getHardwareProfile() {
    let profile = { tier: 'Standard', name: 'Generic' };
    try {
        if (!navigator.gpu) return profile;
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (!adapter) return profile;
        const info = await adapter.requestAdapterInfo();
        profile.name = info.description || info.vendor || 'Apple Silicon';
        if (profile.name.toLowerCase().includes('apple')) profile.tier = 'Elite';
        return profile;
    } catch (e) { return profile; }
}

export async function syncAppVersion() {
    try {
        const res = await fetch('./package.json?t=' + Date.now());
        const pkg = await res.json();
        const label = document.getElementById('app-version-label');
        if (label) label.textContent = `v${pkg.version}`;
        localStorage.setItem('app_version', pkg.version);
    } catch (e) {}
}

export function initIdleManager() {
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') console.log("🌙 Jade en reposo.");
    });
}
