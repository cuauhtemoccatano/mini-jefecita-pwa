import { pipeline, env, TextStreamer } from '@huggingface/transformers';

/**
 * Mini Jefecita - Neural Web Worker (ai_worker.js)
 * High-fidelity background intelligence.
 */
let generator = null;

env.allowLocalModels = false;
env.useBrowserCache = true;

self.onmessage = async (e) => {
    const { type, data } = e.data;

    try {
        if (type === 'init') {
            const { modelName, device } = data;
            
            let hasGPU = false;
            try { hasGPU = !!self.navigator?.gpu; } catch(_) {}
            console.log(`🧠 Worker: Iniciando [${modelName}] en [${device}]. GPU: ${hasGPU}`);

            generator = await pipeline('text-generation', modelName, {
                device,
                progress_callback: (progress) => {
                    self.postMessage({ type: 'progress', data: progress });
                }
            });

            self.postMessage({ type: 'ready', data: { modelName, device, hasGPU } });
        }

        if (type === 'generate') {
            if (!generator) throw new Error('Cerebro no inicializado.');

            const { fullPrompt, settings } = data;
            
            let accumulated = '';
            const streamer = new TextStreamer(generator.tokenizer, {
                skip_prompt: true,
                callback_function: (chunk) => {
                    const cleaned = chunk
                        .replace('<|im_end|>', '')
                        .replace('<|eot_id|>', '')
                        .replace('<|end_of_text|>', '');
                    accumulated += cleaned;
                    self.postMessage({ type: 'chunk', data: accumulated });
                }
            });

            await generator(fullPrompt, { 
                ...settings,
                streamer,
                stop: ['<|im_end|>', '<|eot_id|>', '<|end_of_text|>', 'user\n', 'assistant\n']
            });

            self.postMessage({ type: 'complete', data: accumulated });
        }
    } catch (err) {
        console.error('💥 Fatal Worker Error:', err);
        self.postMessage({ 
            type: 'error', 
            data: { message: err.message, name: err.name, stack: err.stack, context: type }
        });
    }
};
