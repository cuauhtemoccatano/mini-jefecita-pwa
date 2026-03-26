// ---------------------------------------------------------
// 1. ESTADO GLOBAL & PERSISTENCIA (v2.6.5)
// ---------------------------------------------------------
let userData, healthData;

try {
    userData = JSON.parse(localStorage.getItem('user_settings') || '{"name": "Jade", "jadeName": "Jefecita", "color": "#00C4B4", "vibe": "💚", "brain": "PRO", "streak": 7, "remindersCount": 3}');
    healthData = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "cals": 0}');
} catch (e) {
    console.warn("Reseteando datos locales por error de formato");
    userData = {"name": "Jade", "jadeName": "Jefecita", "color": "#00C4B4", "vibe": "💚", "brain": "PRO", "streak": 0, "remindersCount": 0};
    healthData = {"steps": 0, "cals": 0};
}

let generator = null;
let isDownloadingAI = false;

// Helpers
const saveSettings = () => localStorage.setItem('user_settings', JSON.stringify(userData));
const saveHealth = () => localStorage.setItem('health_data', JSON.stringify(healthData));

// ---------------------------------------------------------
// 2. MOTOR DE UI (ARRANQUE RÁPIDO)
// ---------------------------------------------------------
function applyPersonalization() {
    try {
        const nameLabel = document.querySelector('.user-name-label');
        if (nameLabel) nameLabel.textContent = userData.name;
        
        const vibeEl = document.getElementById('user-vibe-label');
        if (vibeEl) vibeEl.textContent = userData.vibe;
        
        const streakEl = document.getElementById('home-streak-val');
        if (streakEl) streakEl.textContent = userData.streak || 0;

        const remCountEl = document.getElementById('home-reminders-val');
        if (remCountEl) remCountEl.textContent = userData.remindersCount || 0;

        document.documentElement.style.setProperty('--primary', userData.color);
        
        // Actualizar nombres de la IA en toda la app
        document.querySelectorAll('.jade-name-display').forEach(el => el.textContent = userData.jadeName);
    } catch (e) {
        console.error("Error aplicando personalización:", e);
    }
}

function updateGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    let text = hour < 12 ? "¡Buenos días!" : hour < 19 ? "¡Buenas tardes!" : "¡Buenas noches!";
    el.textContent = `${text} ${userData.name}`;
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
    // IMPORTANTE: Aseguramos que el selector coincida con el HTML (tab-item)
    const tabs = document.querySelectorAll('.tab-item');
    const views = document.querySelectorAll('.view');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-view');
            console.log('Navegando a:', target);
            
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
    document.getElementById('btn-parse-reminder')?.addEventListener('click', () => {
        const input = document.getElementById('reminder-magic-input');
        if (input && input.value.trim()) {
            const list = document.getElementById('reminder-list-active');
            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `
                <div class="reminder-info">
                    <span class="reminder-title">${input.value.trim()}</span>
                    <span class="reminder-time-badge">Pendiente</span>
                </div>
                <button class="btn-check" onclick="this.parentElement.remove()">✓</button>
            `;
            list?.prepend(item);
            input.value = '';
            
            // Incrementar contador
            userData.remindersCount = (userData.remindersCount || 0) + 1;
            saveSettings();
            applyPersonalization();
            
            // Eliminar empty state
            list?.querySelector('.empty-state')?.remove();
        }
    });
}

function initJournal() {
    document.getElementById('btn-unlock-diario')?.addEventListener('click', () => {
        const lock = document.getElementById('diario-lock-screen');
        const content = document.getElementById('diario-content');
        if (lock) lock.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.style.animation = 'fadeIn 0.5s ease-out';
        }
    });
}

function initSettings() {
    const modal = document.getElementById('settings-modal');
    
    // Abrir
    document.getElementById('btn-settings')?.addEventListener('click', () => {
        document.getElementById('set-name').value = userData.name;
        document.getElementById('set-jade-name').value = userData.jadeName;
        document.getElementById('set-vibe').value = userData.vibe;
        document.getElementById('set-brain-level').value = userData.brain || 'PRO';
        modal.style.display = 'flex';
    });

    // Cerrar
    document.getElementById('btn-close-settings')?.addEventListener('click', () => modal.style.display = 'none');

    // Guardar
    document.getElementById('btn-save-settings')?.addEventListener('click', () => {
        userData.name = document.getElementById('set-name').value.trim() || "Jade";
        userData.jadeName = document.getElementById('set-jade-name').value.trim() || "Jefecita";
        userData.vibe = document.getElementById('set-vibe').value.trim() || "💚";
        userData.brain = document.getElementById('set-brain-level').value;
        saveSettings();
        modal.style.display = 'none';
        applyPersonalization();
        updateGreeting();
    });

    // Colores
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            userData.color = dot.getAttribute('data-color');
            document.documentElement.style.setProperty('--primary', userData.color);
        });
    });
}

function initExercise() {
    const btn = document.getElementById('btn-log-exercise');
    const input = document.getElementById('exercise-duration');
    const list = document.getElementById('exercise-list');

    btn?.addEventListener('click', () => {
        if (!input.value || input.value <= 0) return;

        const minutes = input.value;
        const item = document.createElement('div');
        item.className = 'history-item';
        const dateStr = new Date().toLocaleDateString();
        item.innerHTML = `
            <span class="history-date">${dateStr}</span>
            <span class="history-duration">${minutes} min</span>
        `;
        if (list) {
            list.prepend(item);
            list.querySelector('.empty-state')?.remove();
        }
        input.value = '';

        userData.streak = (userData.streak || 0) + 1;
        saveSettings();
        applyPersonalization();
    });
}

// ---------------------------------------------------------
// 5. MOTOR IA (SMOL-LM2)
// ---------------------------------------------------------
async function initAI() {
    if (generator || isDownloadingAI) return;

    try {
        console.log('Despertando cerebro IA...');
        const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
        
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        isDownloadingAI = true;

        const level = userData.brain || 'PRO';
        const modelName = level === 'MASTER' ? 'Xenova/Qwen1.5-0.5B-Chat' : 'Xenova/SmolLM2-135M-Instruct';

        generator = await pipeline('text-generation', modelName);
        console.log('IA Lista y Cargada ✅');
        isDownloadingAI = false;
    } catch (e) {
        console.error("Error crítico en IA local:", e);
        isDownloadingAI = false;
    }
}

function initChat() {
    const btn = document.getElementById('btn-send-chat');
    const input = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-messages');

    btn?.addEventListener('click', async () => {
        if (!input.value.trim()) return;

        const text = input.value.trim();
        chatBox.innerHTML += `<div class="message user">${text}</div>`;
        input.value = '';
        chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;

        if (!generator) {
            chatBox.innerHTML += '<div class="message ai">Iniciando IA masiva... esto puede tardar unos segundos 🧠</div>';
            await initAI();
        }

        if (generator) {
            try {
                const system = `Eres ${userData.jadeName}, la asistente personal de ${userData.name}. Eres motivadora, directa y eficiente.`;
                const messages = [{ role: 'system', content: system }, { role: 'user', content: text }];
                
                const fullPrompt = generator.tokenizer.apply_chat_template(messages, { tokenize: false, add_generation_prompt: true });
                const output = await generator(fullPrompt, { max_new_tokens: 80, temperature: 0.7 });
                
                let reply = output[0].generated_text.split('assistant\n')[1] || "Estoy lista para ayudarte.";
                chatBox.innerHTML += `<div class="message ai">${reply.replace('<|im_end|>', '').trim()}</div>`;
            } catch (err) {
                chatBox.innerHTML += `<div class="message ai">Lo siento, mi motor de pensamiento falló. ¿Puedes repetir?</div>`;
            }
        } else {
            chatBox.innerHTML += `<div class="message ai">Vaya, mi cerebro local no pudo cargar. ¿Tienes conexión a internet?</div>`;
        }
        chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;
    });
}

// ---------------------------------------------------------
// 6. SANTUARIO ZEN (CUIDADO Y MATERIALES)
// ---------------------------------------------------------
function initZenMode() {
    const portal = document.getElementById('btn-zen-portal');
    const exit = document.getElementById('btn-exit-zen');
    const zenView = document.getElementById('view-zen');
    const sanctuary = document.getElementById('zen-sanctuary');
    const zenMsg = document.getElementById('zen-message');
    const voiceWave = document.querySelector('.voice-wave');

    if (!portal) return;

    portal.addEventListener('click', () => {
        zenView.classList.add('active');
        createZenCrystals();
        setTimeout(() => {
            speakZen("Bienvenida al santuario, Jade. Vamos a poner cada cosa en su lugar.");
        }, 1500);
    });

    exit.addEventListener('click', () => {
        zenView.classList.remove('active');
        sanctuary.innerHTML = '<div class="zen-instruction">Organiza el caos, Jade</div>';
        // Reset message
        zenMsg.textContent = "Buscando calma...";
    });

    function createZenCrystals() {
        sanctuary.querySelectorAll('.zen-block').forEach(b => b.remove());
        const icons = ['✨', '💎', '🧊', '🪵', '☁️'];
        
        for (let i = 0; i < 5; i++) {
            const block = document.createElement('div');
            block.className = 'zen-block';
            block.innerHTML = icons[i % icons.length];
            block.style.left = `${Math.random() * 60 + 20}%`;
            block.style.top = `${Math.random() * 60 + 20}%`;
            
            makeDraggable(block);
            sanctuary.appendChild(block);
        }
    }

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        el.onmousedown = dragMouseDown;
        el.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            pos3 = clientX;
            pos4 = clientY;
            document.onmouseup = closeDragElement;
            document.ontouchend = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
            
            if (window.navigator.vibrate) window.navigator.vibrate(10);
        }

        function elementDrag(e) {
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            
            // Check alignment (simplified)
            if (Math.abs(el.offsetLeft % 50) < 10 && Math.abs(el.offsetTop % 50) < 10) {
                el.classList.add('aligned');
                if (window.navigator.vibrate) window.navigator.vibrate(5);
            } else {
                el.classList.remove('aligned');
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            
            checkTotalOrder();
        }
    }

    function checkTotalOrder() {
        const blocks = sanctuary.querySelectorAll('.zen-block');
        const aligned = sanctuary.querySelectorAll('.zen-block.aligned');
        
        if (aligned.length === blocks.length && blocks.length > 0) {
            zenMsg.textContent = "Todo está en paz.";
            speakZen("Todo está en su lugar ahora, Jade. Tú también.");
        }
    }

    function speakZen(text) {
        if (!('speechSynthesis' in window)) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX';
        utterance.rate = 0.8; // Calma
        utterance.pitch = 0.9;
        
        utterance.onstart = () => voiceWave.classList.add('active');
        utterance.onend = () => voiceWave.classList.remove('active');
        
        window.speechSynthesis.speak(utterance);
    }
}

// ---------------------------------------------------------
// 7. INICIALIZACIÓN FINAL MAESTRA
// ---------------------------------------------------------
function initApp() {
    console.log('🚀 Inicializando Mini Jefecita Core...');
    
    try {
        applyPersonalization();
        updateGreeting();
        initTabs();
        initReminders();
        initJournal();
        initSettings();
        initChat();
        initExercise();
        initZenMode();
        updateHealthUI();
    } catch (err) {
        console.error("Fallo crítico en inicialización:", err);
    } finally {
        // Garantizar que el loader siempre desaparezca físicamente
        const loader = document.getElementById('ai-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                loader.style.display = 'none'; // Salida de emergencia física
                console.log('Loader oculto y removido - UI Lista');
            }, 800);
            
            // Segundo intento de seguridad a los 3 segundos
            setTimeout(() => {
                if (!loader.classList.contains('hidden')) {
                    loader.style.display = 'none';
                }
            }, 3000);
        }
    }
}

// Ejecución segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Service Worker (Persistencia PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW Skip'));
    });
}
