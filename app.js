// Greeting Logic
function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    const hour = new Date().getHours();
    let text = "Buenas noches";
    
    if (hour < 12) text = "Buenos días";
    else if (hour < 19) text = "Buenas tardes";
    
    greetingElement.textContent = text;
}

// AI Engine (Local)
let generator = null;

async function initAI() {
    const loader = document.getElementById('ai-loader');
    const progressBar = document.getElementById('progress-bar');
    const loaderDetails = document.getElementById('loader-details');

    try {
        generator = await window.pipeline('text-generation', 'Xenova/SmolLM-135M-Instruct', {
            progress_callback: (data) => {
                if (data.status === 'progress') {
                    const p = Math.round(data.progress);
                    progressBar.style.width = `${p}%`;
                    loaderDetails.textContent = `${p}% - Descargando conocimientos...`;
                }
            }
        });
        
        loader.style.opacity = '0';
        setTimeout(() => loader.style.visibility = 'hidden', 500);
    } catch (e) {
        console.error('Error loading AI:', e);
        loader.innerHTML = '<p>Error al despertar mi cerebro. ¿Tienes conexión?</p>';
    }
}

async function generateLocalAI(prompt, systemMsg) {
    if (!generator) return null;
    
    const fullPrompt = `<|im_start|>system\n${systemMsg}<|im_end|>\n<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`;
    
    const output = await generator(fullPrompt, {
        max_new_tokens: 60,
        temperature: 0.7,
        do_sample: true,
        stop_sequence: '<|im_end|>'
    });

    let text = output[0].generated_text.replace(fullPrompt, '').split('<|im_end|>')[0].trim();
    return text;
}

// Insights Logic
async function updateMotivationalInsight() {
    const textElement = document.getElementById('motivational-text');
    if (!textElement || !generator) return;

    const system = `Eres el coach de Jade. Genera UNA frase corta (máx 15 palabras) con 💚 de inspiración. Contexto: Racha ${calculateStreak()} días.`;
    const insight = await generateLocalAI("Dame una frase de hoy", system);
    
    if (insight) textElement.textContent = insight;
}

// Tab Switching Logic
function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    const views = document.querySelectorAll('.view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetView = tab.getAttribute('data-view');
            
            // Update Active Tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update Active View
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === `view-${targetView}`) {
                    view.classList.add('active');
                }
            });

            // Scroll to top
            document.getElementById('content').scrollTop = 0;
        });
    });
}

// Service Worker Registration
async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('sw.js');
            console.log('SW registered');
        } catch (e) {
            console.error('SW registration failed', e);
        }
    }
}

// Exercise Logic
let exercises = JSON.parse(localStorage.getItem('exercises') || '[]');

function saveExercises() {
    localStorage.setItem('exercises', JSON.stringify(exercises));
    updateExerciseUI();
}

function calculateStreak() {
    if (exercises.length === 0) return 0;
    
    // Sort by date descending
    const sorted = [...exercises].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
        const itemDate = new Date(sorted[i].date);
        itemDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((currentDate - itemDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0 || diffDays === 1) {
            streak++;
            currentDate = itemDate;
        } else {
            break;
        }
    }
    return streak;
}

function updateExerciseUI() {
    const list = document.getElementById('exercise-list');
    const streakElement = document.getElementById('exercise-streak-val');
    const homeStreakElement = document.getElementById('home-streak-val');
    
    const currentStreak = calculateStreak();
    
    // Update Streaks
    if (streakElement) streakElement.textContent = currentStreak;
    if (homeStreakElement) homeStreakElement.textContent = currentStreak;

    // Update List
    if (exercises.length === 0) {
        list.innerHTML = '<p class="empty-state">No hay registros nuevos.</p>';
        return;
    }

    list.innerHTML = exercises
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(ex => `
            <div class="history-item">
                <span class="history-date">${new Date(ex.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</span>
                <span class="history-duration">${ex.duration} min</span>
            </div>
        `).join('');
}

function initExercise() {
    const btn = document.getElementById('btn-log-exercise');
    const durationInput = document.getElementById('exercise-duration');

    if (btn) {
        btn.addEventListener('click', () => {
            const duration = durationInput.value || 30;
            const today = new Date().toISOString();
            
            // Check if already logged today
            const alreadyLogged = exercises.some(ex => 
                new Date(ex.date).toDateString() === new Date().toDateString()
            );

            if (!alreadyLogged) {
                exercises.push({ date: today, duration: parseInt(duration) });
                saveExercises();
                if (durationInput) durationInput.value = '';
                alert('¡Entrenamiento registrado! 🔥');
            } else {
                alert('Ya registraste tu entrenamiento de hoy. ¡Sigue así! 💪');
            }
        });
    }

    updateExerciseUI();
}

// Chat Logic
function addMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    container.appendChild(msgDiv);
    
    // Auto scroll
    container.parentElement.scrollTop = container.parentElement.scrollHeight;
}

async function initChat() {
    const btn = document.getElementById('btn-send-chat');
    const input = document.getElementById('chat-input');

    if (!btn || !input) return;

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        if (!generator) {
            addMessage("Aún estoy cargando mi cerebro... ⌛", 'ai');
            return;
        }

        const system = `Eres el asistente de Jade en su app "Mini Jefecita". Sé breve, elegante y usa 💚. Racha actual: ${calculateStreak()} días.`;
        const reply = await generateLocalAI(text, system);
        addMessage(reply || "Jade, me quedé pensando... ¿Me repites eso? 💚", 'ai');
    };

    btn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Reminders Logic
let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');

function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
    updateRemindersUI();
}

function updateRemindersUI() {
    const list = document.getElementById('reminder-list-active');
    if (!list) return;

    if (reminders.length === 0) {
        list.innerHTML = '<p class="empty-state">No hay avisos programados.</p>';
        return;
    }

    list.innerHTML = reminders
        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
        .map(rem => `
            <div class="reminder-item" id="rem-${rem.id}">
                <span class="dot"></span>
                <div class="reminder-info">
                    <span class="reminder-title">${rem.title}</span>
                    <span class="reminder-time-badge">${rem.date} • ${rem.time}</span>
                </div>
            </div>
        `).join('');
}

async function initReminders() {
    const btn = document.getElementById('btn-parse-reminder');
    const input = document.getElementById('reminder-magic-input');

    if (!btn || !input) return;

    btn.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) return;

        btn.disabled = true;
        btn.textContent = "...";

        if (!generator) {
            alert("La IA se está descargando. Por favor espera un momento.");
            btn.disabled = false;
            btn.textContent = "Añadir";
            return;
        }

        try {
            const system = `Extrae datos de recordatorio en JSON: { "title": "...", "date": "YYYY-MM-DD", "time": "HH:mm" }. Hoy es ${new Date().toLocaleDateString()}.`;
            const jsonText = await generateLocalAI(`Recordatorio: ${text}`, system);
            
            // Basic extraction if model logic fails to give pure JSON
            const data = JSON.parse(jsonText.match(/{.*?}/s)[0]);

            if (data.title) {
                reminders.push({ id: Date.now(), ...data });
                saveReminders();
                input.value = '';
            }
        } catch (e) {
            console.warn('Parsing failed, manual entry', e);
            reminders.push({ 
                id: Date.now(), 
                title: text, 
                date: new Date().toISOString().split('T')[0], 
                time: "09:00" 
            });
            saveReminders();
            input.value = '';
        } finally {
            btn.disabled = false;
            btn.textContent = "Añadir";
        }
    });

    updateRemindersUI();
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    updateGreeting();
    initTabs();
    initExercise();
    initChat();
    initReminders();
    await initAI();
    updateMotivationalInsight();
    registerSW();
});
