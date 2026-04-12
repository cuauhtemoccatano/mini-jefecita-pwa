// ---------------------------------------------------------
import { createIcons, Flame } from 'lucide';
export const ExerciseView = {
    render: () => `
        <div class="exercise-streak-card">
            <div class="streak-icon"><i data-lucide="flame" style="width: 24px; color: #FF7043"></i></div>
            <div class="streak-details">
                <span id="exercise-streak-val" class="streak-number">7</span>
                <span class="streak-text">días seguidos</span>
            </div>
        </div>

        <div class="log-exercise-card">
            <h2>¿Entrenaste hoy?</h2>
            <p class="card-subtitle">Registra tu actividad para mantener la racha.</p>
            <div class="exercise-inputs">
                <input type="number" id="exercise-duration" placeholder="Minutos" min="1">
                <button id="btn-log-exercise" class="btn-primary">Registrar Sesión</button>
            </div>
        </div>

        <div class="exercise-history">
            <h2>Historial reciente</h2>
            <div id="exercise-list" class="history-list">
                <p class="empty-state">No hay registros nuevos.</p>
            </div>
        </div>
    `,
    init: () => {
        createIcons({ icons: { Flame } });
    }
};
