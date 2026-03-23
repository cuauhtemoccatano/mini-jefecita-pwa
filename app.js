import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// ---------------------------------------------------------
// 1. MOTOR DE PERSISTENCIA (v2.5.1)
// ---------------------------------------------------------
let userData = JSON.parse(localStorage.getItem('user_settings') || '{"name": "Usuario", "jadeName": "Jade", "color": "#00C4B4", "vibe": "💚", "brain": "AUTO"}');

function applyPersonalization() {
    // Aplicar nombres y colores
    const mainTitle = document.querySelector('.home-header h1 .jade-name-label');
    if (mainTitle) mainTitle.textContent = userData.name;
    
    const vibeEl = document.getElementById('jade-vibe-label');
    if (vibeEl) vibeEl.textContent = userData.vibe;
    
    document.documentElement.style.setProperty('--primary', userData.color);
    
    // En las secciones donde se mencione a Jade
    document.querySelectorAll('.jade-name-display').forEach(el => el.textContent = userData.jadeName);
}

function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;
    const hour = new Date().getHours();
    let text = "Buenas noches";
    if (hour < 12) text = "Buenos días";
    else if (hour < 19) text = "Buenas tardes";
    
    greetingElement.textContent = `${text.toUpperCase()}, ${userData.name.toUpperCase()}`;
}

// ---------------------------------------------------------
// 2. INTEGRACIÓN DE SALUD
// ---------------------------------------------------------
let healthData = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "cals": 0}');

function saveHealthData() {
    localStorage.setItem('health_data', JSON.stringify(healthData));
    updateHealthUI();
}

function updateHealthUI() {
    const stepsEl = document.getElementById('health-steps');
    const calsEl = document.getElementById('health-cals');
    if (stepsEl) stepsEl.textContent = (healthData.steps || 0).toLocaleString();
    if (calsEl) calsEl.textContent = healthData.cals || 0;
}

// ---------------------------------------------------------
// 3. HARDWARE & AJUSTES
// ---------------------------------------------------------
function getDevicePowerLevel() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
        if (renderer.includes('Apple M') || renderer.includes('Apple GPU')) return 'MASTER';
        return 'PRO';
    } catch (e) { return 'NORMAL'; }
}

function initSettings() {
    const modal = document.getElementById('settings-modal');
    const colorDots = document.querySelectorAll('.color-dot');
    let tempColor = userData.color;

    document.getElementById('btn-settings')?.addEventListener('click', () => {
        document.getElementById('set-name').value = userData.name;
        document.getElementById('set-jade-name').value = userData.jadeName;
        document.getElementById('set-vibe').value = userData.vibe;
        const inputBrain = document.getElementById('set-brain-level');
        if (inputBrain) inputBrain.value = userData.brain;
        modal.style.display = 'flex';
    });

    document.getElementById('btn-close-settings')?.addEventListener('click', () => modal.style.display = 'none');

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            tempColor = dot.getAttribute('data-color');
            colorDots.forEach(d => d.style.border = 'none');
            dot.style.border = '2px solid white';
        });
    });

    document.getElementById('btn-save-settings')?.addEventListener('click', () => {
        const oldBrain = userData.brain;
        
        // Actualizar el objeto global
        userData.name = document.getElementById('set-name').value.trim() || "Usuario";
        userData.jadeName = document.getElementById('set-jade-name').value.trim() || "Jade";
        userData.vibe = document.getElementById('set-vibe').value.trim() || "💚";
        userData.color = tempColor;
        userData.brain = document.getElementById('set-brain-level').value;

        // GUARDADO FORZADO EN LOCALSTORAGE
        localStorage.setItem('user_settings', JSON.stringify(userData));

        modal.style.display = 'none';
        
        if (oldBrain !== userData.brain) {
            location.reload();
        } else {
            applyPersonalization();
            updateGreeting();
        }
    });
}

// ---------------------------------------------------------
// 4. IA CORE ENGINE
// ---------------------------------------------------------
let generator = null;
let isDownloadingAI = false;

async function initAI() {
    const loader = document.getElementById('ai-loader');
    const progressBar = document.getElementById('progress-bar');
    
    let level = userData.brain === 'AUTO' || !userData.brain ? getDevicePowerLevel() : userData.brain;
    const modelConfig = {
        'MASTER': { name: 'Xenova/Qwen1.5-0.5B-Chat' },
        'ULTRA': { name: 'Xenova/SmolLM2-360M-Instruct' },
        'PRO': { name: 'Xenova/SmolLM2-135M-Instruct' },
        'NORMAL': { name: 'Xenova/SmolLM2-135M-Instruct' }
    };

    const target = modelConfig[level];

    try {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        
        isDownloadingAI = true;
        generator = await pipeline('text-generation', target.name, {
            progress_callback: (d) => {
                if (d.status === 'progress' && progressBar) {
                    const p = Math.round(d.progress);
                    progressBar.style.width = `${p}%`;
                }
            }
        });
        isDownloadingAI = false;
    } catch (e) {
        console.error("AI Error:", e);
    } finally {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 600);
        }
    }
}

async function generateLocalAI(prompt, systemMsg) {
    if (!generator) return null;
    const chat = [{ role: 'system', content: systemMsg }, { role: 'user', content: prompt }];
    const fullPrompt = generator.tokenizer.apply_chat_template(chat, { tokenize: false, add_generation_prompt: true });
    const output = await generator(fullPrompt, { max_new_tokens: 128, temperature: 0.7, do_sample: true });
    let text = output[0].generated_text;
    if (text.includes('<|im_start|>assistant')) text = text.split('<|im_start|>assistant')[1];
    else if (text.includes('<|assistant|>')) text = text.split('<|assistant|>')[1];
    return text.replace('<|im_end|>', '').replace('</s>', '').trim();
}

// ---------------------------------------------------------
// 5. MÓDULOS
// ---------------------------------------------------------
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
    document.getElementById('btn-save-exercise')?.addEventListener('click', () => {
        alert("Entrenamiento guardado con éxito. 🔥");
    });
}

function initReminders() {
    document.getElementById('btn-add-reminder')?.addEventListener('click', () => {
        const text = document.getElementById('reminder-input').value;
        if (text) {
            const list = document.getElementById('reminders-list');
            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `<span>${text}</span><button class="btn-check">✓</button>`;
            list.prepend(item);
            document.getElementById('reminder-input').value = '';
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

        const system = `Eres el asistente personal de ${userData.name}. Sé breve y elegante.`;
        const reply = await generateLocalAI(text, system);
        
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';
        aiMsg.textContent = reply || "Pensando...";
        chatBox.appendChild(aiMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// ---------------------------------------------------------
// 6. ACTUALIZACIONES & INIT
// ---------------------------------------------------------
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            reg.onupdatefound = () => {
                const installingWorker = reg.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        if (!isDownloadingAI) {
                            const toast = document.getElementById('update-toast');
                            if (toast) toast.classList.remove('hidden');
                        }
                    }
                };
            };
        });
    });
}

document.getElementById('btn-update-now')?.addEventListener('click', () => window.location.reload());

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Mini Jefecita PWA v2.5.1 (Fixed Persistence Edition)');
    applyPersonalization();
    updateGreeting();
    initTabs();
    initExercise();
    initReminders();
    initChat();
    initSettings();
    updateHealthUI();
    await initAI();
});
