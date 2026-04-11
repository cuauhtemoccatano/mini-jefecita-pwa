// ---------------------------------------------------------
// app.js - Orquestador Maestro (Crystal Edition v3.6.0)
// ---------------------------------------------------------
import { OnboardingCeremony } from './js/components/OnboardingCeremony.js';
import { loadState, userData, saveSettings } from './js/state.js';
import { renderAllViews, applyPersonalization, updateGreeting, initTabs, triggerHaptic } from './js/ui_engine.js';
import { initAI, initChat, initCommandPortal } from './js/ai_engine.js';
import { initHealthSync, updateHealthUI } from './js/health_engine.js';
import { initZenMode } from './js/santuario.js';
import { syncAppVersion, initIdleManager, initConnectivityAwareness, initInstallManager, predictOptimalBrainTier } from './js/system.js';

async function initApp() {
    console.log("🌊 Orquestación Modular Iniciada: Jade despertando...");
    loadState();
    
    if (!userData.onboarded) {
        document.body.innerHTML = OnboardingCeremony.render();
        OnboardingCeremony.init();
        return;
    }

    try {
        loadState();
        renderAllViews();
        applyPersonalization();
        updateGreeting();
        
        initTabs();
        initHealthSync();
        updateHealthUI();
        
        initZenMode();
        initChat();
        initCommandPortal();
        initIdleManager();
        initConnectivityAwareness();
        initInstallManager();
        
        // Auto-Elevation Ceremony
        if (!userData.brain || userData.brain === 'AUTO') {
            const autoTier = await predictOptimalBrainTier();
            console.log(`✨ Silicón Elevation: Aplicando nivel ${autoTier} de forma automática.`);
            userData.brain = autoTier;
        }
        
        // initAI(); // [DEFERRED] Neutral awareness is now lazy to prevent iOS memory crashes
        
        await syncAppVersion();
        if (window.lucide) lucide.createIcons();

        // Clear the refresh guard after successful initialization
        sessionStorage.removeItem('mqa_refreshing');

        // Atmospheric Heartbeat (Autonomous Adaptation)
        setInterval(() => {
            import('./js/ui_engine.js').then(m => m.syncNeuralAtmosphere());
        }, 60000);

        // Perspectiva Holográfica (Sigue en app.js por simplicidad de listeners)
        initHolographic();

    } catch (err) {
        console.error("💥 Fallo en la matriz de inicio:", err);
    }
}

function initHolographic() {
    if (typeof DeviceOrientationEvent !== 'undefined') {
        let ticking = false;
        window.addEventListener('deviceorientation', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const x = (e.gamma / 15).toFixed(2);
                    const y = (e.beta / 15).toFixed(2);
                    const activeView = document.querySelector('.view.active');
                    if (activeView) {
                        activeView.querySelectorAll('.stat-card, .motivational-card').forEach(c => {
                            c.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg)`;
                        });
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Inicialización de Ajustes (Interacción de Estado Directa)
function initSettings() {
    const modal = document.getElementById('settings-modal');
    document.getElementById('btn-settings')?.addEventListener('click', () => {
        document.getElementById('set-name').value = userData.name;
        document.getElementById('set-brain-level').value = userData.brain;
        modal.style.display = 'flex';
    });
    
    document.getElementById('btn-close-settings')?.addEventListener('click', () => modal.style.display = 'none');
    
    document.getElementById('btn-save-settings')?.addEventListener('click', () => {
        userData.name = document.getElementById('set-name').value;
        userData.jadeName = document.getElementById('set-jade-name').value;
        userData.auraPreset = document.getElementById('set-aura-preset').value;
        userData.auraColor = document.getElementById('set-aura-hex').value;
        userData.brain = document.getElementById('set-brain-level').value;
        saveSettings();
        modal.style.display = 'none';
        applyPersonalization();
        initAI(); // Reiniciar si cambió nivel
    });
}

// Disparar App
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        initSettings();
    });
} else {
    initApp();
    initSettings();
}
