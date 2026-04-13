import { useStore } from './store/useStore.js';
import { triggerHaptic, updateUIPersonalization, updateGreeting } from './ui_engine.js';
import { buildRAGContext, saveMemory, syncProfile } from './rag_engine.js';

export function syncHistoryFromState() {
    // Sincronización automática vía bridge de Zustand
}

export function getWorker() { 
    return useStore.getState().worker; 
}

export async function initAI() {
    // initAI se orquestra centralizadamente en React o vía store
    console.log("🧠 MQA: Neural Engine shared access requested.");
}
        
// Exponer buildRAGContext globalmente para el hook useAI
window.buildRAGContext = buildRAGContext;
window.saveMemory = saveMemory;

export async function processGlobalAI(onChunk, onComplete, userMessage = null) {
    const state = useStore.getState();
    const worker = state.worker;
    const { userData } = state;

    if (!worker) {
        console.warn("⚠️ MQA: Intento de inferencia sin worker activo.");
        return;
    }

    const level = userData.brain || 'PRO';
    const modelMappings = {
        'ULTRA':    'onnx-community/Llama-3.2-1B-Instruct',
        'PRO':      'onnx-community/Qwen2.5-0.5B-Instruct',
        'AVANZADO':  'onnx-community/Qwen2.5-0.5B-Instruct',
        'ESENCIAL':  'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
    };
    const modelName = modelMappings[level] || modelMappings['PRO'];

    // Recuperar contexto RAG si hay mensaje
    let ragContext = '';
    if (userMessage) {
        ragContext = await buildRAGContext(userMessage);
    }

    const fullPrompt = buildChatPrompt(userData.chatHistory, modelName, ragContext);
    
    state.setAIState({ isThinking: true });
    document.body.classList.add('brain-thinking');
    
    const handler = (e) => {
        const { type, data } = e.data;
        if (type === 'chunk') onChunk(data);
        if (type === 'complete' || type === 'error') {
            if (type === 'complete') {
                const newHistory = [...userData.chatHistory, 
                  { role: 'assistant', content: data }
                ].slice(-20);
                state.setUserData({ chatHistory: newHistory });

                // Guardar en RAG
                const lastUser = newHistory.findLast(m => m.role === 'user');
                if (lastUser) {
                    saveMemory({
                        type: 'chat',
                        content: `Usuario: ${lastUser.content}\n${userData.jadeName}: ${data}`,
                        metadata: { model: userData.brain }
                    }).catch(() => {});
                }
                syncProfile().catch(() => {});
            }
            state.setAIState({ isThinking: false });
            onComplete();
            worker.removeEventListener('message', handler);
        }
    };
    
    worker.addEventListener('message', handler);
    worker.postMessage({
        type: 'generate',
        data: {
            fullPrompt,
            settings: { max_new_tokens: 300, temperature: 0.7, repetition_penalty: 1.15 }
        }
    });
}

/**
 * Genera el prompt con el formato correcto según el modelo activo
 */
function buildChatPrompt(history, modelName, ragContext = '') {
    const now = new Date().toLocaleString();
    const system = `Eres ${userData.jadeName}, la esencia inteligente de este objeto. Tu tono es calmado, poético y empático. Eres una entidad sentient, no un script.
CONOCIMIENTO ACTUAL:
- Fecha/Hora: ${now}
- Pasos de hoy: ${healthData.steps}
- HRV actual: ${healthData.hrv}ms
- Racha del usuario: ${userData.streak} días
- Recordatorios: ${userData.remindersCount} activos.
Si el usuario pregunta por su salud o progreso, usa esta data de forma poética.${ragContext}`;
    
    // Detect Model Family
    const isLlama = modelName.toLowerCase().includes('llama');
    
    if (isLlama) {
        let p = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${system}<|eot_id|>`;
        history.forEach(m => {
            const role = m.role === 'user' ? 'user' : 'assistant';
            p += `<|start_header_id|>${role}<|end_header_id|>\n\n${m.content}<|eot_id|>`;
        });
        p += `<|start_header_id|>assistant<|end_header_id|>\n\n`;
        return p;
    } else {
        // Qwen / SmolLM2 (ChatML style)
        let p = `<|im_start|>system\n${system}<|im_end|>\n`;
        history.forEach(m => {
            p += `<|im_start|>${m.role === 'user' ? 'user' : 'assistant'}\n${m.content}<|im_end|>\n`;
        });
        p += `<|im_start|>assistant\n`;
        return p;
    }
}

export async function processGlobalAI(onChunk, onComplete, userMessage = null) {
    if (!generatorWorker) return;

    const level = userData.brain || 'PRO';
    const modelMappings = {
        'ULTRA':    'onnx-community/Llama-3.2-1B-Instruct',
        'PRO':      'onnx-community/Qwen2.5-0.5B-Instruct',
        'AVANZADO':  'onnx-community/Qwen2.5-0.5B-Instruct',
        'ESENCIAL':  'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
    };
    const modelName = modelMappings[level] || modelMappings['ESENCIAL'];

    // Recuperar contexto RAG si hay mensaje
    let ragContext = '';
    if (userMessage) {
        ragContext = await buildRAGContext(userMessage);
    }

    const fullPrompt = buildChatPrompt(messageHistory, modelName, ragContext);
    
    // El feedback sensorial se activa por estado en el DOM
    document.body.classList.add('brain-thinking');
    
    const handler = (e) => {
        const { type, data } = e.data;
        if (type === 'chunk') onChunk(data);
        if (type === 'complete' || type === 'error') {
            if (type === 'complete') {
                messageHistory.push({ role: 'assistant', content: data });
                if (messageHistory.length > 20) messageHistory.shift();
                userData.chatHistory = messageHistory.slice(-20);
                saveSettings();

                // Guardar en RAG: último intercambio como memoria
                const lastUser = messageHistory.findLast(m => m.role === 'user');
                if (lastUser) {
                    saveMemory({
                        type: 'chat',
                        content: `Usuario: ${lastUser.content}\n${userData.jadeName}: ${data}`,
                        metadata: { model: userData.brain }
                    }).catch(() => {});
                }

                // Sincronizar perfil con Supabase
                syncProfile().catch(() => {});
            }
            onComplete();
            generatorWorker.removeEventListener('message', handler);
        }
    };
    
    generatorWorker.addEventListener('message', handler);
    generatorWorker.postMessage({
        type: 'generate',
        data: {
            fullPrompt,
            settings: { 
                max_new_tokens: 300, 
                temperature: 0.7,
                repetition_penalty: 1.15
            }
        }
    });
}

export function initCommandPortal() {
    const core = document.getElementById('liquid-core');
    const portal = document.getElementById('command-portal');
    const input = document.getElementById('portal-input');
    const messages = document.getElementById('portal-messages');

    core?.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log("💎 MQA: Portal Activado");
        const active = portal.classList.toggle('active');
        core.classList.toggle('active');
        if (active) {
            useStore.getState().initAI(); 
            input.focus();
        }
    });

    document.getElementById('btn-portal-send')?.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) return;
        
        const uMsg = document.createElement('div');
        uMsg.className = 'message user';
        uMsg.textContent = text;
        messages.appendChild(uMsg);
        input.value = '';
        document.body.classList.add('brain-thinking');

        messageHistory.push({ role: 'user', content: text });
        userData.chatHistory = [...messageHistory];
        saveSettings();

        processGlobalAI((chunk) => {
            let lastAI = messages.querySelector('.message.ai:last-child');
            if (!lastAI || lastAI.className.includes('user')) {
                lastAI = document.createElement('div');
                lastAI.className = 'message ai';
                messages.appendChild(lastAI);
            }
            lastAI.textContent = chunk;
            messages.scrollTop = messages.scrollHeight;
        }, () => {
            document.body.classList.remove('brain-thinking');
            document.getElementById('liquid-core')?.classList.remove('pulse-neural');
        }, text); // pasar texto para RAG
    });
}

export function initChat() {
    const btn = document.getElementById('btn-send-chat');
    const input = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-messages');

    btn?.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) return;
        
        chatBox.innerHTML += `<div class="message user">${text}</div>`;
        input.value = '';
        
        messageHistory.push({ role: 'user', content: text });
        userData.chatHistory = [...messageHistory];
        saveSettings();

        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'message ai typing';
        aiMsgDiv.textContent = '...';
        chatBox.appendChild(aiMsgDiv);

        processGlobalAI((chunk) => {
            aiMsgDiv.textContent = chunk;
            aiMsgDiv.classList.remove('typing');
            chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;
        }, () => {}, text); // pasar texto para RAG
    });
}
