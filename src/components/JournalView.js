// ---------------------------------------------------------
// js/components/JournalView.js
// ---------------------------------------------------------
import { saveMemory } from '../js/rag_engine.js';

const JOURNAL_KEY = 'mqa_journal_entries';

function loadEntries() {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]'); }
    catch { return []; }
}

function saveEntries(entries) {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

function renderEntries(entries) {
    const list = document.getElementById('journal-list');
    if (!list) return;
    if (!entries.length) {
        list.innerHTML = '<p class="empty-state">Tu historia comienza aquí.</p>';
        return;
    }
    list.innerHTML = entries.slice().reverse().map(e => {
        const date = new Date(e.date).toLocaleDateString('es-MX', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        return `<div class="journal-entry">
            <span class="entry-date">${date}</span>
            <p class="entry-text">${e.text.replace(/</g, '&lt;')}</p>
        </div>`;
    }).join('');
}

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
                <textarea id="journal-input" placeholder="¿Cómo te sientes hoy?"></textarea>
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

        const btnUnlock  = document.getElementById('btn-unlock-diario');
        const lockScreen = document.getElementById('diario-lock-screen');
        const content    = document.getElementById('diario-content');

        // ── Auth ──────────────────────────────────────────────
        const triggerBioAuth = async () => {
            if (!window.PublicKeyCredential) {
                lockScreen.style.display = 'none';
                content.style.display = 'block';
                renderEntries(loadEntries());
                return;
            }

            try {
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);
                const credIdBase64 = localStorage.getItem('mqa_journal_cred_id');

                if (!credIdBase64) {
                    // Primer uso — registrar FaceID
                    const credential = await navigator.credentials.create({
                        publicKey: {
                            rp: { name: 'Mini Jefecita', id: window.location.hostname },
                            user: { id: new Uint8Array([1,2,3,4]), name: 'jade_user', displayName: 'Usuario' },
                            challenge,
                            pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
                            authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' }
                        }
                    });
                    if (credential) {
                        const id64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
                        localStorage.setItem('mqa_journal_cred_id', id64);
                    }
                } else {
                    // Usos posteriores — autenticar
                    const rawId = Uint8Array.from(atob(credIdBase64), c => c.charCodeAt(0));
                    await navigator.credentials.get({
                        publicKey: {
                            challenge,
                            allowCredentials: [{ id: rawId, type: 'public-key' }],
                            userVerification: 'required'
                        }
                    });
                }

                lockScreen.style.display = 'none';
                content.style.display = 'block';
                renderEntries(loadEntries());
                import('../js/ui_engine.js').then(m => m.triggerHaptic('success'));

            } catch (err) {
                console.error('🔐 Auth error:', err);
                import('../js/ui_engine.js').then(m => m.triggerHaptic('warning'));
            }
        };

        btnUnlock?.addEventListener('click', triggerBioAuth);

        // Auto-trigger solo si ya existe credencial
        if (localStorage.getItem('mqa_journal_cred_id')) triggerBioAuth();

        // ── Guardar entrada ───────────────────────────────────
        document.getElementById('btn-save-journal')?.addEventListener('click', async () => {
            const textarea = document.getElementById('journal-input');
            const text = textarea?.value.trim();
            if (!text) return;

            const entry = { text, date: new Date().toISOString() };
            const entries = loadEntries();
            entries.push(entry);
            saveEntries(entries);
            renderEntries(entries);
            textarea.value = '';

            // Guardar en RAG para memoria semántica
            saveMemory({
                type: 'journal',
                content: text,
                metadata: { date: entry.date }
            }).catch(() => {});

            import('../js/ui_engine.js').then(m => m.triggerHaptic('success'));
        });
    }
};
