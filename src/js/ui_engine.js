import { createIcons, Sparkles, Settings, LayoutDashboard, Activity, Bell, BookOpen, MessageSquare, X, Send } from 'lucide';
import { userData } from './state.js';
import { healthData } from './state.js';
import { HomeView } from '../components/HomeView.js';
import { ChatView } from '../components/ChatView.js';
import { ExerciseView } from '../components/ExerciseView.js';
import { RemindersView } from '../components/RemindersView.js';
import { JournalView } from '../components/JournalView.js';
import { ZenView } from '../components/ZenView.js';
import { SettingsModal } from '../components/SettingsModal.js';

export function triggerHaptic(type = 'light') {
    try {
        if (!window.navigator || !window.navigator.vibrate) return;
        switch (type) {
            case 'feather': window.navigator.vibrate(5); break;
            case 'light': window.navigator.vibrate(10); break;
            case 'medium': window.navigator.vibrate([15, 30, 15]); break;
            case 'heartbeat': window.navigator.vibrate([15, 100, 10]); break;
            case 'focus': window.navigator.vibrate([10, 50, 10, 50, 10]); break;
            case 'success': window.navigator.vibrate([10, 50, 10, 50, 10]); break;
            case 'warning': window.navigator.vibrate([100, 50, 100]); break;
            case 'pulse': window.navigator.vibrate([10, 100, 10]); break;
            case 'breath': window.navigator.vibrate([5, 800, 5]); break;
        }
    } catch (e) {}
}

const _initializedViews = new Set();

export function renderView(viewId, component, renderArg) {
    const el = document.getElementById(viewId);
    if (!el) return;
    
    if (_initializedViews.has(viewId)) {
        createIcons({ icons: { Sparkles, Settings, LayoutDashboard, Activity, Bell, BookOpen, MessageSquare, X, Send } });
        return;
    }
    
    el.innerHTML = renderArg !== undefined ? component.render(renderArg) : component.render();
    component.init();
    _initializedViews.add(viewId);
    createIcons({ icons: { Sparkles, Settings, LayoutDashboard, Activity, Bell, BookOpen, MessageSquare, X, Send } });
}

export function renderAllViews() {
    renderView('view-inicio', HomeView, userData);
    renderView('settings-modal', SettingsModal, userData);
}

/**
 * updateUIPersonalization (Anteriormente applyPersonalization)
 * Centraliza la actualización de labels globales.
 * NO llama a la atmósfera para evitar ciclos.
 */
export function updateUIPersonalization() {
    // 1. Labels de usuario y IA
    const nameLabel = document.getElementById('global-title');
    if (nameLabel) {
        nameLabel.innerHTML = `<span class="user-name-label">${userData.name}</span> <span id="user-vibe-label"><i data-lucide="sparkles" style="width: 24px; color: var(--primary)"></i></span>`;
    }
    
    document.querySelectorAll('.jade-name-display').forEach(el => el.textContent = userData.jadeName);
    document.querySelectorAll('.user-name-label').forEach(el => el.textContent = userData.name);
    
    // 2. Elementos de estadísticas
    const streakEl = document.getElementById('home-streak-val');
    if (streakEl) streakEl.textContent = userData.streak || 0;
    
    const brainLevelEl = document.getElementById('set-brain-level');
    if (brainLevelEl) brainLevelEl.value = userData.brain;

    // 4. Re-inicializar iconos de Lucide en todo el documento
    createIcons({ icons: { Sparkles, Settings, LayoutDashboard, Activity, Bell, BookOpen, MessageSquare, X, Send } });
}

export function updateGreeting() {
    const el = document.getElementById('global-greeting');
    if (!el) return;
    const hour = new Date().getHours();
    const text = hour < 12 ? "¡BUENOS DÍAS!" : hour < 19 ? "¡BUENAS TARDES!" : "¡BUENAS NOCHES!";
    el.textContent = text;
}

/**
 * syncAtmosphereMatrix (Anteriormente syncNeuralAtmosphere)
 * Orquestador principal de auras y visuales.
 * Usa un bloqueo global en window para prevenir reentrancia absoluta.
 */
export function syncAtmosphereMatrix(overridingView = null) {
    if (window.__MQA_ATMOSPHERE_LOCKED__) return;
    window.__MQA_ATMOSPHERE_LOCKED__ = true;
    
    try {
        const aura = document.getElementById('aura-system');
        if (!aura) return;

        const hour = new Date().getHours();
        let color = '#00C4B4'; 
        let mood = 'default';
        let speed = '25s';
        let blur = '120px';

        if (hour >= 6 && hour < 12) { color = '#00E5FF'; mood = 'morning'; speed = '20s'; }
        else if (hour >= 12 && hour < 18) { color = '#FFB300'; mood = 'energy'; speed = '15s'; }
        else if (hour >= 18 && hour < 22) { color = '#9575CD'; mood = 'introspection'; speed = '35s'; }
        else { color = '#1A237E'; mood = 'calm'; speed = '45s'; blur = '160px'; }

        const currentHRV = healthData?.hrv ?? 70;
        if (currentHRV < 45) {
            color = '#00C4B4'; mood = 'calm'; speed = '50s'; blur = '200px';
        }

        const view = overridingView || document.querySelector('.tab-item.active')?.getAttribute('data-view');
        if (view === 'diario') { color = '#7E57C2'; mood = 'introspection'; speed = '40s'; }
        if (view === 'ejercicio') { color = '#FF7043'; mood = 'energy'; speed = '10s'; blur = '80px'; }
        if (view === 'zen') { color = '#00C4B4'; mood = 'calm'; speed = '40s'; }

        if (document.body.classList.contains('brain-thinking')) {
            speed = '2s'; blur = '100px';
        }

        aura.setAttribute('data-mood', mood);
        aura.style.setProperty('--aura-speed', speed);
        aura.style.setProperty('--aura-blur', blur);

        const primaryColor = userData.auraColor || color;
        document.documentElement.style.setProperty('--primary', primaryColor);
        document.documentElement.style.setProperty('--aura-glow', `${primaryColor}33`);
        
        const rgb = hexToRgb(primaryColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const contrastColor = brightness > 165 ? '#000000' : '#FFFFFF';
        document.documentElement.style.setProperty('--primary-contrast', contrastColor);
        document.documentElement.style.setProperty('--secondary-text', brightness > 165 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)');

        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', primaryColor);

        const viewNames = { inicio: 'Inicio', ejercicio: 'Salud', avisos: 'Avisos', diario: 'Diario', mensajes: 'Conversando', zen: 'Zen' };
        const viewCaptions = { inicio: null, ejercicio: 'Tu progreso físico', avisos: 'Tus próximas tareas', diario: 'Trazos de consciencia', mensajes: 'Conexión Neuronal', zen: 'Inmersión Total' };
        
        if (view) {
            document.title = `${userData.jadeName} | ${viewNames[view] || ''}`;
            const gTitle = document.getElementById('global-title');
            const gCaption = document.getElementById('global-greeting');
            
            if (view === 'inicio') {
                updateGreeting();
            } else if (gTitle && gCaption) {
                gTitle.textContent = viewNames[view];
                gCaption.textContent = viewCaptions[view] || 'Mini Jefecita';
            }
        }
    } catch (e) {
        console.warn("🛡️ MQA: Sincronización de matriz interrumpida:", e);
    } finally {
        // Reducir lock a lo mínimo indispensable para evitar "drops" de eventos
        window.__MQA_ATMOSPHERE_LOCKED__ = false; 
    }
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
    syncAtmosphereMatrix(view);
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
            triggerHaptic('feather');

            if (currentView) {
                currentView.classList.remove('active');
                currentView.classList.add('exiting');
            }

            const viewComponentMap = {
                'mensajes':  () => renderView('view-mensajes', ChatView, userData),
                'ejercicio': () => renderView('view-ejercicio', ExerciseView),
                'avisos':    () => renderView('view-avisos', RemindersView),
                'diario':    () => renderView('view-diario', JournalView),
                'zen':       () => renderView('view-zen', ZenView),
            };
            viewComponentMap[target]?.();

            nextView.style.display = 'block';
            nextView.classList.add('entering');
            
            updateAuraMood(target);

            requestAnimationFrame(() => {
                setTimeout(() => {
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
                    }, 400); 
                }, 20);
            });
        });
    });
}

let _neuralHeartbeat = null;

export function initSomaticOrchestrator() {
    if (_neuralHeartbeat) return;
    _neuralHeartbeat = setInterval(() => {
        const isThinking = document.body.classList.contains('brain-thinking');
        const core = document.getElementById('liquid-core');
        if (isThinking) {
            triggerHaptic('heartbeat');
            if (core) core.classList.add('pulse-neural');
        } else {
            if (core) core.classList.remove('pulse-neural');
        }
    }, 1500);
}
