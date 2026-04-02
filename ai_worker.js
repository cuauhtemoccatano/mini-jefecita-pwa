/**
 * Mini Jefecita - Neural Web Worker (ai_worker.js)
 * High-fidelity background intelligence.
 */
let generator = null;

self.onmessage = async (e) => {
    const { type, data } = e.data;

    try {
        if (type === 'init') {
            const { modelName, device } = data;
            const { pipeline, env, TextStreamer } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3');
            
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            generator = await pipeline('text-generation', modelName, {
                device: device,
                progress_callback: (progress) => {
                    self.postMessage({ type: 'progress', data: progress });
                }
            });

            self.postMessage({ type: 'ready', data: { modelName, device } });
        }

        if (type === 'generate') {
            if (!generator) {
                self.postMessage({ type: 'error', data: "Cerebro no inicializado." });
                return;
            }

            const { fullPrompt, settings } = data;
            const { TextStreamer } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3');
            
            let accumulated = "";
            const streamer = new TextStreamer(generator.tokenizer, {
                skip_prompt: true,
                callback_function: (chunk) => {
                    accumulated += chunk.replace('<|im_end|>', '');
                    self.postMessage({ type: 'chunk', data: accumulated });
                }
            });

            await generator(fullPrompt, { 
                ...settings,
                streamer: streamer 
            });

            self.postMessage({ type: 'complete', data: accumulated });
        }
    } catch (err) {
        self.postMessage({ type: 'error', data: err.message });
    }
};
