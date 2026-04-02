// ---------------------------------------------------------
// js/components/HomeView.js
// ---------------------------------------------------------
export const HomeView = {
    render: (userData) => `
        <header class="home-header">
            <div class="header-main">
                <p id="greeting" class="caption">Cargando...</p>
                <h1><span class="user-name-label">${userData.name}</span> <span id="user-vibe-label">${userData.vibe}</span></h1>
            </div>
            <div class="header-actions">
                <button id="btn-zen-portal" class="btn-zen-trigger" aria-label="Momento de Calma" title="Momento de Calma"><i data-lucide="sparkles"></i></button>
                <button id="btn-settings" class="btn-icon" aria-label="Ajustes"><i data-lucide="settings"></i></button>
            </div>
        </header>

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
            <div class="reminder-list">
                <div class="reminder-row">
                    <span class="dot"></span>
                    <span class="reminder-text">Beber agua</span>
                    <span class="reminder-time">10:00 AM</span>
                </div>
                <div class="reminder-row">
                    <span class="dot"></span>
                    <span class="reminder-text">Entrenamiento Mental</span>
                    <span class="reminder-time">02:00 PM</span>
                </div>
            </div>
        </div>
    `,
    init: () => {
        if (window.lucide) lucide.createIcons();
    }
};
