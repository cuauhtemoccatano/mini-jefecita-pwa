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
import { OnboardingCeremony } from './components/OnboardingCeremony.js';
import { loadState, userData, saveSettings, healthData } from './js/state.js';
import { initSomaticOrchestrator, renderAllViews, updateUIPersonalization, updateGreeting, initTabs, triggerHaptic, syncAtmosphereMatrix } from './js/ui_engine.js';
import { initAI, initChat, initCommandPortal } from './js/ai_engine.js';
import { initHealthSync, updateHealthUI } from './js/health_engine.js';
import { initZenMode } from './js/santuario.js';
import { syncAppVersion, initIdleManager, initConnectivityAwareness, initInstallManager, predictOptimalBrainTier } from './js/system.js';
import { initCrypto } from './js/crypto_engine.js';
import { syncProfile, restoreProfile, syncReminders, syncHealth, isSupabaseConfigured } from './js/rag_engine.js';
import { initMagneticSpells } from './js/spells_engine.js';

async function initApp() {
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
        const app = document.getElementById('app');
        if (app) app.innerHTML = OnboardingCeremony.render();
        OnboardingCeremony.init();
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
            initAI(); 
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
        console.error("💥 Fallo en la matriz de inicio:", err);
    }
}

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
        updateUIPersonalization();
        initAI(); 
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
