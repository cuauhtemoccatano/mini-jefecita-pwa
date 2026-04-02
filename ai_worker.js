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
            
            // Auditoría Forense: Verificar entorno de Worker
            const hasGPU = !!navigator.gpu;
            console.log(`🧠 Worker: Iniciando [${modelName}] en [${device}]. GPU Disponible: ${hasGPU}`);

            const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3');
            
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            generator = await pipeline('text-generation', modelName, {
                device: device,
                progress_callback: (progress) => {
                    self.postMessage({ type: 'progress', data: progress });
                }
            });

            self.postMessage({ type: 'ready', data: { modelName, device, hasGPU } });
        }

        if (type === 'generate') {
            if (!generator) throw new Error("Cerebro no inicializado.");

            const { fullPrompt, settings } = data;
            const { TextStreamer } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3');
            
            let accumulated = "";
            const streamer = new TextStreamer(generator.tokenizer, {
                skip_prompt: true,
                callback_function: (chunk) => {
                    // Clean unwanted artifacts
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
                streamer: streamer,
                // Hard stops
                stop: ['<|im_end|>', '<|eot_id|>', '<|end_of_text|>', 'user\n', 'assistant\n']
            });

            self.postMessage({ type: 'complete', data: accumulated });
        }
    } catch (err) {
        console.error("💥 Fatal Worker Error:", err);
        self.postMessage({ 
            type: 'error', 
            data: {
                message: err.message,
                name: err.name,
                stack: err.stack,
                context: type
            } 
        });
    }
};
