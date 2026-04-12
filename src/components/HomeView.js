// ---------------------------------------------------------
// js/components/HomeView.js
// ---------------------------------------------------------
export const HomeView = {
    render: (userData) => `
        <div class="motivational-card">
            <p id="motivational-text">Preparando tu inspiración... ✨</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <i data-lucide="flame" style="color: #FF7043"></i>
                    <span id="home-streak-val" class="stat-value">${userData.streak || 0}</span>
                </div>
                <p class="stat-label">/ días racha</p>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <i data-lucide="list-checks" style="color: var(--primary)"></i>
                    <span id="home-reminders-val" class="stat-value">${userData.remindersCount || 0}</span>
                </div>
                <p class="stat-label">/ Pendientes</p>
            </div>
        </div>

        <div class="health-metrics-grid">
            <div class="health-mini-card">
                <span class="label">Paso a paso <i data-lucide="footprints" style="width:12px"></i></span>
                <div class="val-group">
                    <span id="health-steps" class="val">0</span>
                    <span class="unit">steps</span>
                </div>
            </div>
            <div class="health-mini-card">
                <span class="label">Energía <i data-lucide="zap" style="width:12px"></i></span>
                <div class="val-group">
                    <span id="health-cals" class="val">0</span>
                    <span class="unit">kcal</span>
                </div>
            </div>
        </div>

        <div class="reminders-section">
            <h2>Próximos recordatorios</h2>
            <div id="home-reminders-list" class="reminder-list">
                <p class="empty-state" style="font-size:13px">Sin avisos próximos.</p>
            </div>
        </div>
    `,
    init: () => {
        if (window.lucide) lucide.createIcons();

        // Cargar próximos 2 recordatorios desde localStorage
        try {
            const reminders = JSON.parse(localStorage.getItem('mqa_reminders') || '[]');
            const upcoming = reminders
                .filter(r => new Date(r.date) >= new Date())
                .slice(0, 2);
            const container = document.getElementById('home-reminders-list');
            if (container && upcoming.length > 0) {
                container.innerHTML = upcoming.map(r => {
                    const d = new Date(r.date);
                    const timeStr = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                    return `<div class="reminder-row">
                        <span class="dot"></span>
                        <span class="reminder-text">${r.label}</span>
                        <span class="reminder-time">${timeStr}</span>
                    </div>`;
                }).join('');
            }
        } catch(e) {}
    }
};
