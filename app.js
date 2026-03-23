// ---------------------------------------------------------
// 1. ESTADO GLOBAL & PERSISTENCIA (v2.6.0)
// ---------------------------------------------------------
let userData = JSON.parse(localStorage.getItem('user_settings') || '{"name": "Usuario", "jadeName": "Jade", "color": "#00C4B4", "vibe": "💚", "brain": "AUTO"}');
let healthData = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "cals": 0}');
let generator = null;
let isDownloadingAI = false;

// Helpers
const saveSettings = () => localStorage.setItem('user_settings', JSON.stringify(userData));
const saveHealth = () => localStorage.setItem('health_data', JSON.stringify(healthData));

// ---------------------------------------------------------
// 2. MOTOR DE UI (ARRANQUE RÁPIDO)
// ---------------------------------------------------------
function applyPersonalization() {
    const mainTitle = document.querySelector('.home-header h1 .jade-name-label');
    if (mainTitle) mainTitle.textContent = userData.name;
    const vibeEl = document.getElementById('jade-vibe-label');
    if (vibeEl) vibeEl.textContent = userData.vibe;
    document.documentElement.style.setProperty('--primary', userData.color);
    document.querySelectorAll('.jade-name-display').forEach(el => el.textContent = userData.jadeName);
}

function updateGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    let text = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
    el.textContent = `${text.toUpperCase()}, ${userData.name.toUpperCase()}`;
}

function updateHealthUI() {
    const stepsEl = document.getElementById('health-steps');
    const calsEl = document.getElementById('health-cals');
    if (stepsEl) stepsEl.textContent = (healthData.steps || 0).toLocaleString();
    if (calsEl) calsEl.textContent = healthData.cals || 0;
}

// ---------------------------------------------------------
// 3. GESTIÓN DE PESTAÑAS (FIABLE)
// ---------------------------------------------------------
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-view');
            console.log('Cambiando a vista:', target);
            
            views.forEach(v => v.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            const targetView = document.getElementById(`view-${target}`);
            if (targetView) {
                targetView.classList.add('active');
                tab.classList.add('active');
            }
        });
    });
}

// ---------------------------------------------------------
// 4. MÓDULOS DE HERRAMIENTAS
// ---------------------------------------------------------
function initReminders() {
    document.getElementById('btn-add-reminder')?.addEventListener('click', () => {
        const input = document.getElementById('reminder-input');
        if (input && input.value) {
            const list = document.getElementById('reminders-list');
            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `<span>${input.value}</span><button class="btn-check">✓</button>`;
            list.prepend(item);
            input.value = '';
        }
    });
}

function initJournal() {
    document.getElementById('btn-unlock-journal')?.addEventListener('click', () => {
        document.getElementById('lock-overlay').style.display = 'none';
        document.getElementById('journal-content').style.opacity = '1';
    });
}

function initSettings() {
    const modal = document.getElementById('settings-modal');
    document.getElementById('btn-settings')?.addEventListener('click', () => {
        document.getElementById('set-name').value = userData.name;
        document.getElementById('set-jade-name').value = userData.jadeName;
        document.getElementById('set-vibe').value = userData.vibe;
        modal.style.display = 'flex';
    });

    document.getElementById('btn-close-settings')?.addEventListener('click', () => modal.style.display = 'none');

    document.getElementById('btn-save-settings')?.addEventListener('click', () => {
        userData.name = document.getElementById('set-name').value.trim() || "Usuario";
        userData.jadeName = document.getElementById('set-jade-name').value.trim() || "Jade";
        userData.vibe = document.getElementById('set-vibe').value.trim() || "💚";
        saveSettings();
        modal.style.display = 'none';
        applyPersonalization();
        updateGreeting();
    });
}

// ---------------------------------------------------------
// 5. MOTOR IA (CARGA BAJO DEMANDA)
// ---------------------------------------------------------
async function initAI() {
    // Solo cargamos la IA si el usuario entra al chat o si el dispositivo es potente
    if (generator || isDownloadingAI) return;

    try {
        console.log('Iniciando carga de IA bajo demanda...');
        const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
        
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        isDownloadingAI = true;

        const level = userData.brain || 'PRO';
        const modelName = level === 'MASTER' ? 'Xenova/Qwen1.5-0.5B-Chat' : 'Xenova/SmolLM2-135M-Instruct';

        generator = await pipeline('text-generation', modelName);
        console.log('IA Lista:', modelName);
        isDownloadingAI = false;
    } catch (e) {
        console.error("Este dispositivo no soporta la IA local:", e);
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) chatContainer.innerHTML = '<p style="padding:20px; opacity:0.6;">⚠️ La IA local no es compatible con este dispositivo aún.</p>';
    }
}

async function initChat() {
    document.getElementById('btn-send-chat')?.addEventListener('click', async () => {
        const input = document.getElementById('chat-input');
        if (!input.value) return;

        // Si la IA no está lista, intentamos cargarla al primer clic
        if (!generator) {
            const chatBox = document.getElementById('chat-container');
            chatBox.innerHTML += '<div class="message ai">Despertando mi cerebro... espera un momento 🧠</div>';
            await initAI();
        }

        const text = input.value;
        const chatBox = document.getElementById('chat-container');
        chatBox.innerHTML += `<div class="message user">${text}</div>`;
        input.value = '';

        if (generator) {
            const system = `Eres el asistente de ${userData.name}. Sé elegante.`;
            const chat = [{ role: 'system', content: system }, { role: 'user', content: text }];
            const fullPrompt = generator.tokenizer.apply_chat_template(chat, { tokenize: false, add_generation_prompt: true });
            const output = await generator(fullPrompt, { max_new_tokens: 64, temperature: 0.7 });
            let reply = output[0].generated_text.split('assistant\n')[1] || "Estoy procesando...";
            chatBox.innerHTML += `<div class="message ai">${reply.replace('<|im_end|>', '').trim()}</div>`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// ---------------------------------------------------------
// 6. INICIALIZACIÓN FINAL
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('Mini Jefecita v2.6.0 (Stability First)');
    
    // 1. Activar UI básica inmediatamente
    applyPersonalization();
    updateGreeting();
    initTabs();
    initReminders();
    initJournal();
    initSettings();
    initChat();
    updateHealthUI();

    // 2. Ocultar el loader agresivamente
    const loader = document.getElementById('ai-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
});

// Service Worker (Opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW Error'));
    });
}
