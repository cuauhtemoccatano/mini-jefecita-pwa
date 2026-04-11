// ---------------------------------------------------------
// js/ui_engine.js - Estética y Orquestación de Vistas
// ---------------------------------------------------------
import { userData } from './state.js';
import { healthData } from './state.js';
import { HomeView } from './components/HomeView.js';
import { ChatView } from './components/ChatView.js';
import { ExerciseView } from './components/ExerciseView.js';
import { RemindersView } from './components/RemindersView.js';
import { JournalView } from './components/JournalView.js';
import { ZenView } from './components/ZenView.js';
import { SettingsModal } from './components/SettingsModal.js';

export function triggerHaptic(type = 'light') {
    if (!window.navigator || !window.navigator.vibrate) return;
    switch (type) {
        case 'feather': window.navigator.vibrate(5); break;
        case 'light': window.navigator.vibrate(10); break;
        case 'medium': window.navigator.vibrate([15, 30, 15]); break;
        case 'success': window.navigator.vibrate([10, 50, 10, 50, 10]); break;
        case 'warning': window.navigator.vibrate([100, 50, 100]); break;
        case 'pulse': window.navigator.vibrate([10, 100, 10]); break;
        case 'breath': window.navigator.vibrate([5, 800, 5]); break;
    }
}

// Registro de vistas ya inicializadas
const _initializedViews = new Set();

export function renderView(viewId, component, renderArg) {
    if (_initializedViews.has(viewId)) return;
    const el = document.getElementById(viewId);
    if (!el) return;
    el.innerHTML = renderArg !== undefined ? component.render(renderArg) : component.render();
    component.init();
    _initializedViews.add(viewId);
    if (window.lucide) lucide.createIcons();
}

export function renderAllViews() {
    console.log("🎨 MQA: Renderizando vistas críticas...");
    // Solo inicio y modal de settings al arrancar
    renderView('view-inicio', HomeView, userData);
    renderView('settings-modal', SettingsModal, userData);
}

export function applyPersonalization() {
    const nameLabel = document.querySelector('.user-name-label');
    if (nameLabel) nameLabel.textContent = userData.name;
    
    document.querySelectorAll('.jade-name-display').forEach(el => el.textContent = userData.jadeName);
    
    // Sovereign Aura Foundation
    const activeView = document.querySelector('.tab-item.active')?.getAttribute('data-view') || 'inicio';
    updateAuraMood(activeView);

    // Actualizar elementos dinámicos después del render
    const streakEl = document.getElementById('home-streak-val');
    if (streakEl) streakEl.textContent = userData.streak || 0;
}

export function updateGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    let text = hour < 12 ? "¡Buenos días!" : hour < 19 ? "¡Buenas tardes!" : "¡Buenas noches!";
    el.textContent = `${text} ${userData.name}`;
}

export function syncNeuralAtmosphere(overridingView = null) {
    const aura = document.getElementById('aura-system');
    if (!aura) return;

    // 1. Circadian Baseline
    const hour = new Date().getHours();
    let color = '#00C4B4'; // Default Jade
    let mood = 'default';
    let speed = '25s';
    let blur = '120px';

    if (hour >= 6 && hour < 12) { color = '#00E5FF'; mood = 'morning'; speed = '20s'; } // Aurora Fresh
    else if (hour >= 12 && hour < 18) { color = '#FFB300'; mood = 'energy'; speed = '15s'; } // Solar Active
    else if (hour >= 18 && hour < 22) { color = '#9575CD'; mood = 'introspection'; speed = '35s'; } // Twilight
    else { color = '#1A237E'; mood = 'calm'; speed = '45s'; blur = '160px'; } // Obsidian Night

    // 2. Biometric Nudge (Stress Recovery)
    const currentHRV = healthData?.hrv ?? 70;
    if (currentHRV < 45) {
        color = '#00C4B4'; 
        mood = 'calm'; 
        speed = '50s';
        blur = '200px';
    }

    // 3. UX Influence (View override)
    const view = overridingView || document.querySelector('.tab-item.active')?.getAttribute('data-view');
    if (view === 'diario') { color = '#7E57C2'; mood = 'introspection'; speed = '40s'; }
    if (view === 'ejercicio') { color = '#FF7043'; mood = 'energy'; speed = '10s'; blur = '80px'; }
    if (view === 'zen') { color = '#00C4B4'; mood = 'calm'; speed = '40s'; }

    // 4. Neural Activity (Thinking State)
    if (document.body.classList.contains('brain-thinking')) {
        speed = '2s'; // Fast cognitive pulse
        blur = '100px';
    }

    // Apply Real-time Synthesis
    aura.setAttribute('data-mood', mood);
    aura.style.setProperty('--aura-speed', speed);
    aura.style.setProperty('--aura-blur', blur);

    const primaryColor = userData.auraColor || color;
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--aura-glow', `${primaryColor}33`);
    
    // Algorithm Crystal: Adaptive Contrast (APCA-lite)
    const rgb = hexToRgb(primaryColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    const contrastColor = brightness > 165 ? '#000000' : '#FFFFFF';
    document.documentElement.style.setProperty('--primary-contrast', contrastColor);
    document.documentElement.style.setProperty('--secondary-text', brightness > 165 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)');

    // OS & Platform Sync
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', primaryColor);

    // Snappy Title Update
    const viewNames = { inicio: 'Inicio', ejercicio: 'Salud', avisos: 'Avisos', diario: 'Diario', mensajes: 'Conversar', zen: 'Zen' };
    if (view) document.title = `${userData.jadeName} | ${viewNames[view] || ''}`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 196, b: 180 };
}

export function updateAuraMood(view) {
    syncNeuralAtmosphere(view);
    triggerHaptic(view === 'ejercicio' ? 'medium' : 'feather');
}

export function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    let isTransitioning = false;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            if (isTransitioning) return;
            const target = tab.getAttribute('data-view');
            const currentView = document.querySelector('.view.active');
            const nextView = document.getElementById(`view-${target}`);
            if (!nextView || currentView === nextView) return;

            isTransitioning = true;
            if (currentView) {
                currentView.classList.add('exiting');
                currentView.classList.remove('active');
            }

            // Lazy render de vista si aún no se ha inicializado
            const viewComponentMap = {
                'mensajes':  () => renderView('view-mensajes', ChatView, userData),
                'ejercicio': () => renderView('view-ejercicio', ExerciseView),
                'avisos':    () => renderView('view-avisos', RemindersView),
                'diario':    () => renderView('view-diario', JournalView),
                'zen':       () => renderView('view-zen', ZenView),
            };
            viewComponentMap[target]?.();

            nextView.classList.add('entering');
            nextView.style.display = 'block';
            updateAuraMood(target);

            // AI ya inicializada en app.js — guard interno en initAI() previene duplicados

            // Privacy Handshake (Re-lock solo si el contenido estaba abierto)
            if (target === 'diario') {
                const content = document.getElementById('diario-content');
                const lockScreen = document.getElementById('diario-lock-screen');
                const alreadyUnlocked = content?.style.display === 'block';
                if (!alreadyUnlocked) {
                    import('./components/JournalView.js').then(m => {
                        lockScreen.style.display = 'flex';
                        content.style.display = 'none';
                        m.JournalView.init();
                    });
                }
            }

            requestAnimationFrame(() => {
                nextView.classList.remove('entering');
                nextView.classList.add('active');
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                setTimeout(() => {
                    if (currentView) {
                        currentView.classList.remove('exiting');
                        currentView.style.display = 'none';
                    }
                    isTransitioning = false;
                }, 450); // Faster cycle
            });
        });
    });
}
