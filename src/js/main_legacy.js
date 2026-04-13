import { 
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
    Zap,
    createIcons
} from 'lucide';
import { OnboardingCeremony } from '../components/OnboardingCeremony.js';
import { loadState, userData, saveSettings, healthData } from './state.js';
import { initSomaticOrchestrator, renderAllViews, updateUIPersonalization, updateGreeting, initTabs, syncAtmosphereMatrix } from './ui_engine.js';
import { initAI, initChat, initCommandPortal } from './ai_engine.js';
import { initHealthSync, updateHealthUI } from './health_engine.js';
import { initZenMode } from './santuario.js';
import { syncAppVersion, initIdleManager, initConnectivityAwareness, initInstallManager, predictOptimalBrainTier } from './system.js';
import { initCrypto } from './crypto_engine.js';
import { syncProfile, restoreProfile, syncReminders, syncHealth, isSupabaseConfigured } from './rag_engine.js';
import { initMagneticSpells } from './spells_engine.js';
// initPWAManager eliminado en v4.0.0 para consolidación en React

export async function initAppLegacy() {
    try {
        await initCrypto();
    } catch (e) {
        if (e.message !== 'CRYPTO_REQUIRED') throw e;
    }

    loadState();

    if (isSupabaseConfigured() && !userData.onboarded) {
        const restored = await restoreProfile();
        if (restored) {
            Object.assign(userData, restored);
            saveSettings();
        }
    }
    
    if (!userData.onboarded) {
        const portal = document.getElementById('mqa-onboarding-portal');
        if (portal) {
            portal.style.pointerEvents = 'auto'; // Habilitar interacción
            portal.innerHTML = OnboardingCeremony.render();
            OnboardingCeremony.init();
        }
        return;
    }

    try {
        loadState();
        renderAllViews();
        updateUIPersonalization();
        updateGreeting();
        
        initCommandPortal();
        initTabs();
        initHealthSync();
        updateHealthUI();
        
        initZenMode();
        initChat();
        initSettings(); 
        initIdleManager();
        initConnectivityAwareness();
        initInstallManager();
        initMagneticSpells();
        
        if (!userData.brain || userData.brain === 'AUTO') {
            const autoTier = await predictOptimalBrainTier();
            userData.brain = autoTier;
            saveSettings();
        }
        
        try {
            initSomaticOrchestrator();
            // initAI() se maneja ahora vía hook en React
        } catch (e) {
            const bgDownloader = document.getElementById('ai-bg-downloader');
            if (bgDownloader) bgDownloader.classList.add('hidden');
        }
        saveSettings();

        if (isSupabaseConfigured()) {
            syncProfile().catch(() => {});
            syncHealth(healthData).catch(() => {});
            const reminders = JSON.parse(localStorage.getItem('mqa_reminders') || '[]');
            syncReminders(reminders).catch(() => {});
        }
        
        await syncAppVersion();
        syncAtmosphereMatrix();

        createIcons({
            icons: {
                LayoutDashboard, Activity, Bell, BookOpen, MessageSquare, Sparkles, X, Send, Settings,
                Bot, Brain, Flame, Footprints, ListChecks, Lock, Palette, Trash2, Zap
            }
        });

        sessionStorage.removeItem('mqa_refreshing');

    } catch (err) {
        console.error("💥 Fallo en la matriz de inicio legacy:", err);
    }
}

function initSettings() {
    document.getElementById('btn-settings')?.addEventListener('click', () => {
        if (window.mqa_toggleSettings) {
            window.mqa_toggleSettings(true);
        } else {
            console.warn("⚛️ MQA: Bridge de React aún no sincronizado.");
        }
    });
}
