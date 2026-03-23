// Greeting Logic
function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    const hour = new Date().getHours();
    let text = "Buenas noches";
    
    if (hour < 12) text = "Buenos días";
    else if (hour < 19) text = "Buenas tardes";
    
    greetingElement.textContent = text;
}

// Insights Logic
async function updateMotivationalInsight() {
    const textElement = document.getElementById('motivational-text');
    if (!textElement) return;

    try {
        const response = await fetch('/api/insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                context: {
                    streak: calculateStreak(),
                    remindersCount: reminders.length
                }
            })
        });
        const data = await response.json();
        if (data.insight) {
            textElement.textContent = data.insight;
        }
    } catch (e) {
        textElement.textContent = "¡Tú puedes, Jade! 💚 Mantén el enfoque hoy.";
    }
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

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    context: { streak: calculateStreak() }
                })
            });

            const data = await response.json();
            if (data.reply) {
                addMessage(data.reply, 'ai');
            } else {
                addMessage("Lo siento Jade, estoy teniendo un momento de desconexión. 💚", 'ai');
            }
        } catch (e) {
            // Fallback for local testing without Vercel API
            console.warn('API not available, using mock response');
            setTimeout(() => {
                addMessage(`(Modo Offline) ¡Excelente Jade! 💚 Tu racha de ${calculateStreak()} días es inspiradora.`, 'ai');
            }, 800);
        }
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

        try {
            const response = await fetch('/api/parse-reminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: text })
            });
            const data = await response.json();

            if (data.title) {
                reminders.push({ id: Date.now(), ...data });
                saveReminders();
                input.value = '';
            }
        } catch (e) {
            console.warn('Reminder parsing failed, using simple entry');
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
document.addEventListener('DOMContentLoaded', () => {
    updateGreeting();
    initTabs();
    initExercise();
    initChat();
    initReminders();
    updateMotivationalInsight();
    registerSW();
});
