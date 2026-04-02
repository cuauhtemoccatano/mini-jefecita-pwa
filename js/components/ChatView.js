// ---------------------------------------------------------
// js/components/ChatView.js
// ---------------------------------------------------------
export const ChatView = {
    render: (userData) => `
        <header class="view-header">
            <h1>${userData.jadeName} <i data-lucide="bot"></i></h1>
            <p class="caption">Tu asistente sensorial</p>
        </header>

        <div id="chat-container">
            <div id="chat-messages">
                <div class="message ai">
                    Hola. Soy tu asistente sensorial. Puedo ayudarte con tus entrenamientos, recordatorios o simplemente escucharte. ¿En qué piensas hoy?
                </div>
            </div>
        </div>

        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Escribe un mensaje..." autocomplete="off">
            <button id="btn-send-chat" class="btn-primary"><i data-lucide="send"></i></button>
        </div>
    `,
    init: () => {
        if (window.lucide) lucide.createIcons();
    }
};
