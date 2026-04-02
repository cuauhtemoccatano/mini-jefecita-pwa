// ---------------------------------------------------------
// js/components/RemindersView.js
// ---------------------------------------------------------
export const RemindersView = {
    render: () => `
        <header class="view-header">
            <h1>Recordatorios <i data-lucide="bell"></i></h1>
            <p class="caption">Organiza tu día</p>
        </header>

        <div class="smart-input-card">
            <h2>Entrada Mágica <i data-lucide="sparkles" style="width: 14px"></i></h2>
            <p class="card-subtitle">Escribe algo como "cita médico lunes 10am" </p>
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
    }
};
