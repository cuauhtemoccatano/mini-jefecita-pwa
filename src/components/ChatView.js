// ---------------------------------------------------------
// js/components/ChatView.js
// ---------------------------------------------------------
export const ChatView = {
    render: (userData) => `
        <header class="view-header" style="flex-direction: row; justify-content: space-between; align-items: center; padding-right: 20px;">
            <div>
                <h1>${userData.jadeName} <i data-lucide="bot"></i></h1>
                <p class="caption">Tu asistente sensorial</p>
            </div>
            <button id="btn-clear-chat" class="btn-icon" title="Limpiar Memoria" style="background: rgba(255,255,255,0.05); color: #888;">
                <i data-lucide="trash-2" style="width: 16px;"></i>
            </button>
        </header>

        <div id="chat-container">
            <div id="chat-messages">
                ${userData.chatHistory?.length > 0 ? 
                    userData.chatHistory.map(m => {
                        const safe = m.content
                            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                        return `<div class="message ${m.role === 'user' ? 'user' : 'ai'}">${safe}</div>`;
                    }).join('') :
                    `<div class="message ai">
                        Hola. Soy tu asistente sensorial. Puedo ayudarte con tus entrenamientos, recordatorios o simplemente escucharte. ¿En qué piensas hoy?
                    </div>`
                }
            </div>
        </div>

        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Escribe un mensaje..." autocomplete="off">
            <button id="btn-send-chat" class="btn-primary"><i data-lucide="send"></i></button>
        </div>
    `,
    init: () => {
        if (window.lucide) lucide.createIcons();

        // Sanitizador simple anti-XSS
        const sanitize = (str) => str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        
        document.getElementById('btn-clear-chat')?.addEventListener('click', () => {
            if (confirm("¿Estás seguro de que quieres borrar mi memoria de esta conversación?")) {
                import('../js/state.js').then(m => {
                    m.clearChatHistory();
                    import('../js/ai_engine.js').then(ai => ai.syncHistoryFromState());
                    document.getElementById('chat-messages').innerHTML = `
                        <div class="message ai">Hilos de memoria disueltos. Estoy lista de nuevo.</div>
                    `;
                    if (window.lucide) lucide.createIcons();
                });
            }
        });

        // Scroll al final con pequeño delay para esperar render
        const container = document.getElementById('chat-container');
        if (container) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
    }
};
