import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Greeting Logic
function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    const hour = new Date().getHours();
    let text = "Buenas noches";
    
    if (hour < 12) text = "Buenos días";
    else if (hour < 19) text = "Buenas tardes";
    
    greetingElement.textContent = text;
}

// Health Kit Integration (Shortcuts Bridge)
let healthData = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "cals": 0, "lastUpdate": null}');

function saveHealthData() {
    localStorage.setItem('health_data', JSON.stringify(healthData));
    updateHealthUI();
}

function updateHealthUI() {
    const stepsEl = document.getElementById('health-steps');
    const calsEl = document.getElementById('health-cals');
    
    if (stepsEl) stepsEl.textContent = healthData.steps.toLocaleString();
    if (calsEl) calsEl.textContent = healthData.cals;
}

function checkHealthDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const steps = params.get('steps');
    const cals = params.get('cals');

    if (steps || cals) {
        if (steps) healthData.steps = parseInt(steps);
        if (cals) healthData.cals = parseInt(cals);
        healthData.lastUpdate = new Date().toISOString();
        saveHealthData();
        logEvent('health_sync', { steps, cals });
        window.history.replaceState({}, document.title, "/");
    }
}

// Invisible AI Engine
let brainEvents = JSON.parse(localStorage.getItem('brain_events') || '[]');
let behaviorRules = JSON.parse(localStorage.getItem('behavior_rules') || '{"vibe": "normal", "focus": "balance"}');

function logEvent(type, data = {}) {
    brainEvents.push({ type, data, timestamp: new Date().toISOString() });
    if (brainEvents.length > 50) brainEvents.shift();
    localStorage.setItem('brain_events', JSON.stringify(brainEvents));
}

async function synthesizeLearnings() {
    if (!generator || brainEvents.length < 5) return;
    console.log('Synthesizing learned behavior...');
    const recentEvents = JSON.stringify(brainEvents.slice(-10));
    const system = `Eres el subconsciente de la app. Responde ÚNICAMENTE con JSON: {"vibe": "zen/energetic/focused", "focus": "exercise/reminders/chat"}`;
    
    try {
        const result = await generateLocalAI(`Eventos: ${recentEvents}`, system);
        const newRules = JSON.parse(result.match(/{.*?}/s)[0]);
        behaviorRules = { ...behaviorRules, ...newRules };
        localStorage.setItem('behavior_rules', JSON.stringify(behaviorRules));
        applyBehavioralUI();
    } catch (e) {
        console.warn('Synthesis skipped');
    }
}

function applyBehavioralUI() {
    const root = document.documentElement;
    if (behaviorRules.vibe === 'zen') root.style.setProperty('--primary', '#81D4FA');
    else if (behaviorRules.vibe === 'energetic') root.style.setProperty('--primary', '#FF7043');
    else root.style.setProperty('--primary', userData.color || '#00C4B4');
}

// Hardware & User Settings
function getDevicePowerLevel() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        if (isMac && (renderer.includes('Apple M') || renderer.includes('Apple GPU'))) return 'MASTER';
        if (renderer.includes('A17')) return 'ULTRA';
        if (renderer.includes('A16')) return 'PRO';
        return 'PRO';
    } catch (e) { return 'NORMAL'; }
}

let userData = JSON.parse(localStorage.getItem('user_settings') || '{"name": "Jade", "color": "#00C4B4", "vibe": "💚", "brain": "AUTO"}');

function applyPersonalization() {
    document.querySelectorAll('.user-name-label').forEach(el => el.textContent = userData.name);
    const vibeEl = document.getElementById('user-vibe-label');
    if (vibeEl) vibeEl.textContent = userData.vibe;
    document.documentElement.style.setProperty('--primary', userData.color);
}

function initSettings() {
    const modal = document.getElementById('settings-modal');
    const colorDots = document.querySelectorAll('.color-dot');
    let selectedColor = userData.color;

    document.getElementById('btn-settings')?.addEventListener('click', () => {
        document.getElementById('set-name').value = userData.name;
        document.getElementById('set-vibe').value = userData.vibe;
        const inputBrain = document.getElementById('set-brain-level');
        if (inputBrain) inputBrain.value = userData.brain === 'AUTO' ? getDevicePowerLevel() : userData.brain;
        modal.style.display = 'flex';
    });

    document.getElementById('btn-close-settings')?.addEventListener('click', () => modal.style.display = 'none');

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            selectedColor = dot.getAttribute('data-color');
            colorDots.forEach(d => d.style.border = 'none');
            dot.style.border = '2px solid white';
        });
    });

    document.getElementById('btn-save-settings')?.addEventListener('click', () => {
        const oldBrain = userData.brain;
        userData.name = document.getElementById('set-name').value.trim() || "Jade";
        userData.vibe = document.getElementById('set-vibe').value.trim() || "💚";
        userData.color = selectedColor;
        userData.brain = document.getElementById('set-brain-level').value;
        localStorage.setItem('user_settings', JSON.stringify(userData));
        applyPersonalization();
        modal.style.display = 'none';
        if (oldBrain !== userData.brain) location.reload();
    });

    document.getElementById('btn-copy-shortcut')?.addEventListener('click', (e) => {
        const url = `${window.location.origin}/?steps=RESULTADO`;
        navigator.clipboard.writeText(url).then(() => {
            const btn = e.target;
            const original = btn.textContent;
            btn.textContent = "¡Copiado! ✅";
            setTimeout(() => btn.textContent = original, 2000);
        });
    });
}

// AI Core Engine
let generator = null;
let isDownloadingAI = false;

async function initAI() {
    const loader = document.getElementById('ai-loader');
    const progressBar = document.getElementById('progress-bar');
    const loaderDetails = document.getElementById('loader-details');
    
    let level = userData.brain === 'AUTO' || !userData.brain ? getDevicePowerLevel() : userData.brain;
    const modelConfig = {
        'MASTER': { name: 'Xenova/Qwen1.5-0.5B-Chat', label: 'Cerebro Maestro (0.5B)' },
        'ULTRA': { name: 'Xenova/SmolLM2-360M-Instruct', label: 'Cerebro Ultra (360M)' },
        'PRO': { name: 'Xenova/SmolLM2-135M-Instruct', label: 'Cerebro Pro (135M)' },
        'NORMAL': { name: 'Xenova/SmolLM2-135M-Instruct', label: 'Cerebro Lite (135M)' }
    };

    const target = modelConfig[level];
    const isCached = localStorage.getItem('ai_model_ready') === 'true' && localStorage.getItem('ai_model_name') === target.name;

    try {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        
        if (!isCached && loader) {
            loader.style.visibility = 'visible';
            loader.style.opacity = '1';
        }

        isDownloadingAI = true;
        generator = await pipeline('text-generation', target.name, {
            progress_callback: (d) => {
                if (d.status === 'progress' && progressBar) {
                    const p = Math.round(d.progress);
                    progressBar.style.width = `${p}%`;
                    if (loaderDetails) loaderDetails.textContent = `${p}% - Optimizando para ${level}...`;
                }
            }
        });
        
        localStorage.setItem('ai_model_name', target.name);
        localStorage.setItem('ai_model_ready', 'true');
        isDownloadingAI = false;
    } catch (e) {
        console.error("AI Error:", e);
    } finally {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.visibility = 'hidden';
                loader.style.display = 'none';
            }, 600);
        }
    }
}

async function generateLocalAI(prompt, systemMsg) {
    if (!generator) return null;
    const chat = [{ role: 'system', content: systemMsg }, { role: 'user', content: prompt }];
    const fullPrompt = generator.tokenizer.apply_chat_template(chat, { tokenize: false, add_generation_prompt: true });
    
    const output = await generator(fullPrompt, { max_new_tokens: 128, temperature: 0.7, do_sample: true, repetition_penalty: 1.1 });
    let text = output[0].generated_text;
    if (text.includes('<|im_start|>assistant')) text = text.split('<|im_start|>assistant')[1];
    else if (text.includes('<|assistant|>')) text = text.split('<|assistant|>')[1];
    return text.replace('<|im_end|>', '').replace('</s>', '').trim();
}

// Module Initializers
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-view');
            views.forEach(v => v.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            document.getElementById(`view-${target}`).classList.add('active');
            tab.classList.add('active');
        });
    });
}

function initExercise() {
    const btn = document.getElementById('btn-save-exercise');
    btn?.addEventListener('click', () => {
        const type = document.getElementById('exercise-type').value;
        const dur = document.getElementById('exercise-duration').value;
        if (dur) {
            logEvent('exercise_logged', { type, dur });
            alert(`¡Entrenamiento de ${type} guardado! 🔥`);
        }
    });
}

function initReminders() {
    const btn = document.getElementById('btn-add-reminder');
    btn?.addEventListener('click', () => {
        const text = document.getElementById('reminder-input').value;
        if (text) {
            logEvent('reminder_created', { text });
            const list = document.getElementById('reminders-list');
            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `<span>${text}</span><button class="btn-check">✓</button>`;
            list.prepend(item);
            document.getElementById('reminder-input').value = '';
        }
    });
}

// Journal (Face ID)
let isJournalUnlocked = false;
async function initJournal() {
    const btnLock = document.getElementById('btn-unlock-journal');
    btnLock?.addEventListener('click', async () => {
        try {
            if (window.PublicKeyCredential) {
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);
                await navigator.credentials.get({ publicKey: { challenge, timeout: 60000, userVerification: "required" }});
                document.getElementById('lock-overlay').style.display = 'none';
                document.getElementById('journal-content').style.opacity = '1';
                isJournalUnlocked = true;
                logEvent('journal_unlocked');
            } else {
                alert("FaceID no disponible. Desbloqueando modo manual.");
                document.getElementById('lock-overlay').style.display = 'none';
                document.getElementById('journal-content').style.opacity = '1';
                isJournalUnlocked = true;
            }
        } catch (e) { console.error("Bio Check failed"); }
    });

    document.getElementById('btn-save-journal')?.addEventListener('click', () => {
        const text = document.getElementById('journal-input').value;
        if (text) {
            logEvent('journal_entry_saved');
            alert("Pensamiento guardado en tu diario privado. 🖤");
            document.getElementById('journal-input').value = '';
        }
    });
}

async function initChat() {
    document.getElementById('btn-send-chat')?.addEventListener('click', async () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        const chatBox = document.getElementById('chat-container');
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = text;
        chatBox.appendChild(userMsg);
        input.value = '';

        const system = `Eres el asistente de ${userData.name}. Sé breve y elegante.`;
        const reply = await generateLocalAI(text, system);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';
        aiMsg.textContent = reply || "Me quedé pensando... ¿Me repites?";
        chatBox.appendChild(aiMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                const newSW = reg.installing;
                newSW.addEventListener('statechange', () => {
                    if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                        if (!isDownloadingAI) window.location.reload();
                    }
                });
            });
        });
    });
}

// Global Init
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Mini Jefecita PWA v2.2.1 (Sidebar Selector Fix)');
    applyPersonalization();
    updateGreeting();
    initTabs();
    initExercise();
    initReminders();
    initJournal();
    initSettings();
    checkHealthDeepLink();
    updateHealthUI();
    await initAI();
    setInterval(synthesizeLearnings, 300000);
});
