// ---------------------------------------------------------
// js/ai_engine.js - Cerebro y Portal Global (Contextual)
// ---------------------------------------------------------
import { userData, healthData, saveSettings } from './state.js';
import { triggerHaptic, applyPersonalization, updateGreeting } from './ui_engine.js';

let generatorWorker = null;
let isDownloadingAI = false;
let messageHistory = []; 

export function syncHistoryFromState() {
    messageHistory = userData?.chatHistory || [];
}

export function getWorker() { return generatorWorker; }

export async function initAI() {
    if (generatorWorker || isDownloadingAI) return; // [RESILIENTE] No interrumpir ciclo activo

    const bgStatus = document.getElementById('ai-bg-status');
    const bgProgress = document.getElementById('ai-bg-progress');
    const bgDownloader = document.getElementById('ai-bg-downloader');

    try {
        isDownloadingAI = true;
        const level = userData.brain || 'PRO';
        const modelMappings = {
            'ULTRA':    'onnx-community/Llama-3.2-1B-Instruct',
            'PRO':      'onnx-community/Qwen2.5-0.5B-Instruct',
            'AVANZADO':  'onnx-community/Qwen2.5-0.5B-Instruct',
            'ESENCIAL':  'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
        };
        const modelName = modelMappings[level] || modelMappings['ESENCIAL'];
        
        let device = 'wasm';
        if (navigator.gpu) {
            const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
            if (adapter) device = 'webgpu';
        }

        generatorWorker = new Worker('ai_worker.js', { type: 'module' });
        syncHistoryFromState();
        
        generatorWorker.onmessage = (e) => {
            const { type, data } = e.data;
            if (type === 'progress' && data.status === 'progress') {
                if (bgProgress) bgProgress.style.width = `${data.progress.toFixed(0)}%`;
            }
            if (type === 'ready') {
                document.body.classList.add('neural-bonded');
                if (bgDownloader) {
                    bgStatus.textContent = "Conexión plena establecida";
                    setTimeout(() => bgDownloader.classList.add('hidden'), 2000);
                }
                setTimeout(() => {
                    triggerHaptic('medium');
                }, 1000);
                isDownloadingAI = false;
            }
            if (type === 'error') {
                isDownloadingAI = false;
                if (userData.brain !== 'ESENCIAL') {
                    userData.brain = 'ESENCIAL';
                    saveSettings();
                    setTimeout(() => initAI(), 2000);
                }
            }
        };

        generatorWorker.postMessage({ type: 'init', data: { modelName, device } });
    } catch (e) {
        isDownloadingAI = false;
    }
}

/**
 * Genera el prompt con el formato correcto según el modelo activo
 */
function buildChatPrompt(history, modelName) {
    const now = new Date().toLocaleString();
    const system = `Eres ${userData.jadeName}, la esencia inteligente de este objeto. Tu tono es calmado, poético y empático. Eres una entidad sentient, no un script.
CONOCIMIENTO ACTUAL:
- Fecha/Hora: ${now}
- Pasos de hoy: ${healthData.steps}
- HRV actual: ${healthData.hrv}ms
- Racha del usuario: ${userData.streak} días
- Recordatorios: ${userData.remindersCount} activos.
Si el usuario pregunta por su salud o progreso, usa esta data de forma poética.`;
    
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

export async function processGlobalAI(onChunk, onComplete) {
    if (!generatorWorker) return;

    const level = userData.brain || 'PRO';
    const modelMappings = {
        'ULTRA':    'onnx-community/Llama-3.2-1B-Instruct',
        'PRO':      'onnx-community/Qwen2.5-0.5B-Instruct',
        'AVANZADO':  'onnx-community/Qwen2.5-0.5B-Instruct',
        'ESENCIAL':  'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
    };
    const modelName = modelMappings[level] || modelMappings['ESENCIAL'];

    const fullPrompt = buildChatPrompt(messageHistory, modelName);

    const handler = (e) => {
        const { type, data } = e.data;
        if (type === 'chunk') onChunk(data);
        if (type === 'complete' || type === 'error') {
            if (type === 'complete') {
                messageHistory.push({ role: 'assistant', content: data });
                if (messageHistory.length > 20) messageHistory.shift(); 
                userData.chatHistory = [...messageHistory];
                saveSettings();
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

    core?.addEventListener('click', () => {
        const active = portal.classList.toggle('active');
        core.classList.toggle('active');
        if (active) {
            initAI(); // Awakening neural engine on portal demand
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
        });
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
        }, () => {});
    });
}
