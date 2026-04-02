// ---------------------------------------------------------
// app.js - Orquestador Maestro (Modular v3.3.0)
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
        
        initAI(); // Carga de IA con el nivel ya validado
        
        await syncAppVersion();
        if (window.lucide) lucide.createIcons();

        // Perspectiva Holográfica (Sigue en app.js por simplicidad de listeners)
        initHolographic();

    } catch (err) {
        console.error("💥 Fallo en la matriz de inicio:", err);
    }
}

function initHolographic() {
    if (typeof DeviceOrientationEvent !== 'undefined') {
        window.addEventListener('deviceorientation', (e) => {
            const x = (e.gamma / 15).toFixed(2);
            const y = (e.beta / 15).toFixed(2);
            const activeView = document.querySelector('.view.active');
            if (activeView) {
                activeView.querySelectorAll('.stat-card, .motivational-card').forEach(c => {
                    c.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg)`;
                });
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
