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
    init: async () => {
        if (window.lucide) lucide.createIcons();
        
        const btnUnlock = document.getElementById('btn-unlock-diario');
        const lockScreen = document.getElementById('diario-lock-screen');
        const content = document.getElementById('diario-content');

        const triggerBioAuth = async () => {
            if (!window.PublicKeyCredential) {
                console.warn("🛡️ MQA: WebAuthn no soportado. Usando fallback...");
                lockScreen.style.display = 'none';
                content.style.display = 'block';
                return;
            }

            try {
                // Generar desafío dummy para autenticación local
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);

                const options = {
                    publicKey: {
                        challenge: challenge,
                        timeout: 60000,
                        allowCredentials: [], // Permitir cualquier credencial registrada en el dispositivo
                        userVerification: "required",
                    }
                };

                // En Safari/iOS, esto activará FaceID/TouchID directamente
                await navigator.credentials.get(options);
                
                lockScreen.style.display = 'none';
                content.style.display = 'block';
                import('../ui_engine.js').then(m => m.triggerHaptic('success'));

            } catch (err) {
                console.error("🔐 Error de autenticación:", err);
                import('../ui_engine.js').then(m => m.triggerHaptic('warning'));
            }
        };

        btnUnlock?.addEventListener('click', triggerBioAuth);
        
        // Auto-trigger on init
        triggerBioAuth();
    }
};
