// ---------------------------------------------------------
// js/components/JournalView.js
// ---------------------------------------------------------
export const JournalView = {
    render: () => `
        <header class="view-header">
            <h1>Diario Secreto <i data-lucide="book-open"></i></h1>
            <p class="caption">Tus pensamientos son sagrados</p>
        </header>

        <div id="diario-lock-screen" class="lock-overlay">
            <div class="lock-content">
                <span class="icon"><i data-lucide="lock" style="width: 32px"></i></span>
                <h2>Diario Bloqueado</h2>
                <p>Usa FaceID o TouchID para entrar.</p>
                <button id="btn-unlock-diario" class="btn-primary">Desbloquear</button>
            </div>
        </div>

        <div id="diario-content" class="locked-content" style="display: none;">
            <div class="journal-card">
                <textarea id="journal-input" placeholder="¿Cómo te sientes hoy, Jade?"></textarea>
                <button id="btn-save-journal" class="btn-primary">Guardar Momento</button>
            </div>

            <div class="journal-history">
                <h2>Momentos anteriores</h2>
                <div id="journal-list" class="history-list">
                    <p class="empty-state">Tu historia comienza aquí.</p>
                </div>
            </div>
        </div>
    `,
    init: () => {
        if (window.lucide) lucide.createIcons();
    }
};
