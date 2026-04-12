// ---------------------------------------------------------
// js/components/RemindersView.js
// ---------------------------------------------------------
import { userData, saveSettings } from '../state.js';

function loadReminders() {
    try {
        return JSON.parse(localStorage.getItem('mqa_reminders') || '[]');
    } catch { return []; }
}

function saveReminders(list) {
    localStorage.setItem('mqa_reminders', JSON.stringify(list));
    userData.remindersCount = list.length;
    saveSettings();
}

function parseReminderText(text) {
    const now = new Date();
    const lower = text.toLowerCase();

    // Detectar hora: "10am", "3pm", "10:30", "14:00"
    const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    let hours = 0, minutes = 0;
    if (timeMatch) {
        hours = parseInt(timeMatch[1]);
        minutes = parseInt(timeMatch[2] || '0');
        if (timeMatch[3] === 'pm' && hours < 12) hours += 12;
        if (timeMatch[3] === 'am' && hours === 12) hours = 0;
    }

    // Detectar día
    let date = new Date(now);
    if (lower.includes('mañana')) date.setDate(date.getDate() + 1);
    else if (lower.includes('lunes'))    { date = nextWeekday(1); }
    else if (lower.includes('martes'))   { date = nextWeekday(2); }
    else if (lower.includes('miércoles') || lower.includes('miercoles')) { date = nextWeekday(3); }
    else if (lower.includes('jueves'))   { date = nextWeekday(4); }
    else if (lower.includes('viernes'))  { date = nextWeekday(5); }
    else if (lower.includes('sábado') || lower.includes('sabado'))   { date = nextWeekday(6); }
    else if (lower.includes('domingo'))  { date = nextWeekday(0); }

    date.setHours(hours, minutes, 0, 0);

    // Limpiar texto de hora y día
    const label = text
        .replace(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi, '')
        .replace(/mañana|lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo/gi, '')
        .replace(/\s+/g, ' ').trim();

    return { label: label || text, date: date.toISOString() };
}

function nextWeekday(target) {
    const now = new Date();
    const day = now.getDay();
    const diff = (target - day + 7) % 7 || 7;
    const result = new Date(now);
    result.setDate(now.getDate() + diff);
    return result;
}

function renderList(list) {
    const container = document.getElementById('reminder-list-active');
    if (!container) return;
    if (list.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay avisos programados.</p>';
        return;
    }
    container.innerHTML = list.map((r, i) => {
        const d = new Date(r.date);
        const dateStr = d.toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' });
        const timeStr = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        return `
        <div class="reminder-row" data-index="${i}">
            <span class="dot"></span>
            <span class="reminder-text">${r.label}</span>
            <span class="reminder-time">${dateStr} ${timeStr}</span>
            <button class="btn-delete-reminder icon-btn" data-index="${i}" title="Eliminar">
                <i data-lucide="x" style="width:12px"></i>
            </button>
        </div>`;
    }).join('');
    if (window.lucide) lucide.createIcons();

    // Listeners de borrado
    container.querySelectorAll('.btn-delete-reminder').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            const updated = loadReminders();
            updated.splice(idx, 1);
            saveReminders(updated);
            renderList(updated);
            // Actualizar Home si está renderizado
            const homeCount = document.getElementById('home-reminders-val');
            if (homeCount) homeCount.textContent = updated.length;
        });
    });
}

export const RemindersView = {
    render: () => `
        <header class="view-header">
            <h1>Recordatorios <i data-lucide="bell"></i></h1>
            <p class="caption">Organiza tu día</p>
        </header>

        <div class="smart-input-card">
            <h2>Entrada Mágica <i data-lucide="sparkles" style="width: 14px"></i></h2>
            <p class="card-subtitle">Escribe algo como "cita médico lunes 10am"</p>
            <div class="reminder-input-area">
                <input type="text" id="reminder-magic-input" placeholder="¿Qué debo recordarte?">
                <button id="btn-parse-reminder" class="btn-primary">Añadir</button>
            </div>
        </div>

        <div class="active-reminders-section">
            <h2>Tus avisos</h2>
            <div id="reminder-list-active" class="history-list">
                <p class="empty-state">No hay avisos programados.</p>
            </div>
        </div>
    `,
    init: () => {
        if (window.lucide) lucide.createIcons();

        const list = loadReminders();
        renderList(list);

        const input = document.getElementById('reminder-magic-input');
        const btn = document.getElementById('btn-parse-reminder');

        const addReminder = () => {
            const text = input?.value.trim();
            if (!text) return;
            const reminder = parseReminderText(text);
            const updated = loadReminders();
            updated.push(reminder);
            updated.sort((a, b) => new Date(a.date) - new Date(b.date));
            saveReminders(updated);
            renderList(updated);
            input.value = '';
            // Actualizar contador en Home
            const homeCount = document.getElementById('home-reminders-val');
            if (homeCount) homeCount.textContent = updated.length;
        };

        btn?.addEventListener('click', addReminder);
        input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') addReminder(); });
    }
};
