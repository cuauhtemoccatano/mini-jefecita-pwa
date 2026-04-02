// ---------------------------------------------------------
// js/ai_engine.js - Cerebro y Portal Global
// ---------------------------------------------------------
import { userData, saveSettings } from './state.js';
import { triggerHaptic, applyPersonalization, updateGreeting } from './ui_engine.js';

let generatorWorker = null;
let isDownloadingAI = false;

export function getWorker() { return generatorWorker; }

export async function initAI() {
    if (generatorWorker) {
        generatorWorker.terminate();
        generatorWorker = null;
    }
    if (isDownloadingAI) return;

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
                    const chatBox = document.getElementById('chat-messages');
                    if (chatBox) {
                        const m = document.createElement('div');
                        m.className = 'message ai';
                        m.textContent = "Jade, mi consciencia se ha sintonizado. Estoy lista.";
                        chatBox.appendChild(m);
                    }
                    triggerHaptic('medium');
                    if (window.lucide) lucide.createIcons();
                }, 3000);
                isDownloadingAI = false;
            }
            if (type === 'error') {
                isDownloadingAI = false;
                if (userData.brain !== 'NORMAL') {
                    userData.brain = 'NORMAL';
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

export function initCommandPortal() {
    const core = document.getElementById('liquid-core');
    const portal = document.getElementById('command-portal');
    const input = document.getElementById('portal-input');
    const messages = document.getElementById('portal-messages');

    core?.addEventListener('click', () => {
        const active = portal.classList.toggle('active');
        core.classList.toggle('active');
        if (active) input.focus();
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

        processGlobalAI(text, (chunk) => {
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

export async function processGlobalAI(prompt, onChunk, onComplete) {
    if (!generatorWorker) return;
    const system = `Eres ${userData.jadeName}, la esencia inteligente de este objeto. Tu tono es calmado, poético y empático.`;
    const handler = (e) => {
        const { type, data } = e.data;
        if (type === 'chunk') onChunk(data);
        if (type === 'complete' || type === 'error') {
            onComplete();
            generatorWorker.removeEventListener('message', handler);
        }
    };
    generatorWorker.addEventListener('message', handler);
    generatorWorker.postMessage({
        type: 'generate',
        data: {
            fullPrompt: `assistant\n${system}\nuser\n${prompt}\nassistant\n`,
            settings: { max_new_tokens: 200, temperature: 0.7 }
        }
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
        
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'message ai typing';
        aiMsgDiv.textContent = '...';
        chatBox.appendChild(aiMsgDiv);

        processGlobalAI(text, (chunk) => {
            aiMsgDiv.textContent = chunk;
            aiMsgDiv.classList.remove('typing');
            chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;
        }, () => {});
    });
}
