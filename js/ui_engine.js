// ---------------------------------------------------------
// js/ui_engine.js - Estética y Orquestación de Vistas
// ---------------------------------------------------------
import { userData } from './state.js';
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

export function renderAllViews() {
    console.log("🎨 MQA: Renderizando componentes líquidos...");
    
    document.getElementById('view-inicio').innerHTML = HomeView.render(userData);
    document.getElementById('view-mensajes').innerHTML = ChatView.render(userData);
    document.getElementById('view-ejercicio').innerHTML = ExerciseView.render();
    document.getElementById('view-avisos').innerHTML = RemindersView.render();
    document.getElementById('view-diario').innerHTML = JournalView.render();
    document.getElementById('view-zen').innerHTML = ZenView.render();
    document.getElementById('settings-modal').innerHTML = SettingsModal.render(userData);

    // Initial icon bloom
    [HomeView, ChatView, ExerciseView, RemindersView, JournalView, ZenView, SettingsModal].forEach(v => v.init());
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

export function updateAuraMood(view) {
    const aura = document.getElementById('aura-system');
    if (!aura) return;
    
    let mood = 'default';
    let speed = '25s';
    let blur = '120px';
    let color = '#00C4B4';

    if (view === 'diario') { mood = 'introspection'; speed = '45s'; blur = '180px'; color = '#9575CD'; }
    else if (view === 'ejercicio') { mood = 'energy'; speed = '12s'; blur = '80px'; color = '#FF7043'; }
    else if (view === 'zen') { mood = 'calm'; speed = '35s'; blur = '150px'; color = '#00C4B4'; }
    else if (view === 'avisos') { mood = 'warning'; speed = '20s'; blur = '100px'; color = '#81D4FA'; }
    else { color = '#00C4B4'; }

    aura.setAttribute('data-mood', mood);
    aura.style.setProperty('--aura-speed', speed);
    aura.style.setProperty('--aura-blur', blur);

    // Apply Chromatic Leakage
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--aura-glow', `${color}33`);
    
    // Sync System Chrome
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    
    triggerHaptic(view === 'ejercicio' ? 'medium' : 'feather');
    
    // Snappy Title Update
    const viewNames = { inicio: 'Inicio', ejercicio: 'Salud', avisos: 'Avisos', diario: 'Diario', mensajes: 'Conversar', zen: 'Zen' };
    document.title = `${userData.jadeName} | ${viewNames[view] || ''}`;
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
            nextView.classList.add('entering');
            nextView.style.display = 'block';
            updateAuraMood(target);

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
