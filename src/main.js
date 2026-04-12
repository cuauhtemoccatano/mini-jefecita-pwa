// ---------------------------------------------------------
// main.js - Orquestador Maestro
// ---------------------------------------------------------
import './assets/css/style.css';
import './assets/css/awakening.css';
import { 
    createIcons, 
    LayoutDashboard, 
    Activity, 
    Bell, 
    BookOpen, 
    MessageSquare, 
    Sparkles, 
    X, 
    Send, 
    Settings, 
    Bot, 
    Brain, 
    Flame, 
    Footprints, 
    ListChecks, 
    Lock, 
    Palette, 
    Trash2, 
    Zap 
} from 'lucide';
import { OnboardingCeremony } from './components/OnboardingCeremony.js';
import { loadState, userData, saveSettings, healthData } from './js/state.js';
import { renderAllViews, applyPersonalization, updateGreeting, initTabs, triggerHaptic } from './js/ui_engine.js';
import { initAI, initChat, initCommandPortal } from './js/ai_engine.js';
import { initHealthSync, updateHealthUI } from './js/health_engine.js';
import { initZenMode } from './js/santuario.js';
import { syncAppVersion, initIdleManager, initConnectivityAwareness, initInstallManager, predictOptimalBrainTier } from './js/system.js';
import { initCrypto } from './js/crypto_engine.js';
import { syncProfile, restoreProfile, syncReminders, syncHealth, isSupabaseConfigured } from './js/rag_engine.js';
import { initMagneticSpells } from './js/spells_engine.js';

async function initApp() {

    // Inicializar crypto siempre primero
    await initCrypto();

    loadState();

    // Si localStorage fue borrado por Safari, restaurar desde Supabase
    if (isSupabaseConfigured() && !userData.onboarded) {
        const restored = await restoreProfile();
        if (restored) {
            Object.assign(userData, restored);
            saveSettings();
        }
    }
    
    if (!userData.onboarded) {
        const app = document.getElementById('app');
        if (app) app.innerHTML = OnboardingCeremony.render();
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
        initSettings(); // Vinculación después de renderView
        initIdleManager();
        initConnectivityAwareness();
        initInstallManager();
        initMagneticSpells(); // Design Spells: Magnetic interaction
        
        // Auto-Elevation Ceremony
        if (!userData.brain || userData.brain === 'AUTO') {
            const autoTier = await predictOptimalBrainTier();
            userData.brain = autoTier;
            saveSettings();
        }
        
        initAI(); // Inicializar modelo después de detectar hardware
        saveSettings();

        // Sync con Supabase en background (no bloquea UI)
        if (isSupabaseConfigured()) {
            syncProfile().catch(() => {});
            syncHealth(healthData).catch(() => {});
            const reminders = JSON.parse(localStorage.getItem('mqa_reminders') || '[]');
            syncReminders(reminders).catch(() => {});
        }
        
        await syncAppVersion();
        
        try {
            createIcons({
                icons: {
                    LayoutDashboard,
                    Activity,
                    Bell,
                    BookOpen,
                    MessageSquare,
                    Sparkles,
                    X,
                    Send,
                    Settings,
                    Bot,
                    Brain,
                    Flame,
                    Footprints,
                    ListChecks,
                    Lock,
                    Palette,
                    Trash2,
                    Zap
                }
            });
        } catch (e) {
            console.warn("⚠️ MQA: Fallo parcial al renderizar iconos:", e);
        }

        // Clear the refresh guard after successful initialization
        sessionStorage.removeItem('mqa_refreshing');

        // Atmospheric Heartbeat — con guard para evitar múltiples intervals
        if (!window._atmosphereInterval) {
            window._atmosphereInterval = setInterval(() => {
                import('./js/ui_engine.js').then(m => m.syncNeuralAtmosphere());
            }, 60000);
        }

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
    });
} else {
    initApp();
}
