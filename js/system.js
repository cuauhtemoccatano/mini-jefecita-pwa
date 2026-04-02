// ---------------------------------------------------------
// js/system.js - Utilidades de Sistema, PWA y Atmosfera
// ---------------------------------------------------------

export async function getHardwareProfile() {
    let profile = { 
        tier: 'Standard', 
        name: 'Generic', 
        memory: navigator.deviceMemory || 4,
        battery: 1.0,
        lowPower: false
    };

    try {
        // Battery Awareness
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
        
        // Elite Detection (M2/M3 Heuristic)
        if (profile.name.toLowerCase().includes('apple') || profile.memory > 8) {
            profile.tier = 'Elite';
        }
        
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
        
        const currentLocal = localStorage.getItem('app_version');
        if (currentLocal && currentLocal !== pkg.version) {
            console.log("🚀 MQA: Evolución detectada (Nueva consciencia lista)");
            document.getElementById('update-toast')?.classList.remove('hidden');
        }
        localStorage.setItem('app_version', pkg.version);

        // Registro de Service Worker con gestión de actualizaciones
        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.register('./sw.js');
            
            // Si hay un worker esperando, mostrar el toast
            if (reg.waiting) {
                document.getElementById('update-toast')?.classList.remove('hidden');
            }

            document.getElementById('btn-update-now')?.addEventListener('click', () => {
                if (reg.waiting) {
                    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                } else {
                    window.location.reload();
                }
            });

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                // Persistent guard using sessionStorage
                if (sessionStorage.getItem('mqa_refreshing')) return;
                sessionStorage.setItem('mqa_refreshing', 'true');
                window.location.reload();
            });
        }
    } catch (e) {
        console.warn("🛡️ MQA: Fallo en sincronización de versión/SW.");
    }
}

export function initConnectivityAwareness() {
    const notify = (online) => {
        console.log(online ? "🌐 Jade: Conexión recuperada." : "📡 Jade: Operando en modo local (Offline).");
        // Aura pulse logic could go here
    };
    window.addEventListener('online', () => notify(true));
    window.addEventListener('offline', () => notify(false));
}

export function initInstallManager() {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log("✨ MQA: Jade está lista para ser cristalizada como App.");
        // Logic to show a custom "Install" button in settings could be added here
    });

    // Handle 'appinstalled'
    window.addEventListener('appinstalled', () => {
        console.log("💎 Jade ha sido instalada físicamente.");
        deferredPrompt = null;
    });
}

export async function predictOptimalBrainTier() {
    const profile = await getHardwareProfile();
    console.log("🛠️ MQA Perfil Hardware:", profile);

    if (profile.lowPower) return 'ESENCIAL';
    
    // Heuristic Map
    if (profile.tier === 'Elite') return 'ULTRA';
    if (profile.memory >= 8) return 'PRO';
    if (profile.memory >= 4) return 'AVANZADO';
    
    return 'ESENCIAL';
}

export function initIdleManager() {
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            console.log("🌙 Jade en reposo profundo. Guardando neuronas...");
            // Trigger a quick state save if needed
        } else {
            console.log("☀️ Jade despertando.");
        }
    });
}
