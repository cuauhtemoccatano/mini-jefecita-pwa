// ---------------------------------------------------------
// js/embedder.js - Embeddings locales con Transformers.js
// Modelo: all-MiniLM-L6-v2 (~23MB, 384 dimensiones)
// Corre completamente en el dispositivo
// ---------------------------------------------------------

import { pipeline, env } from '@huggingface/transformers';

let _pipeline = null;
let _isLoading = false;

const MODEL = 'Xenova/all-MiniLM-L6-v2';

// ---------------------------------------------------------
// Inicializar modelo de embeddings (lazy)
// ---------------------------------------------------------
export async function initEmbedder() {
    if (_pipeline) return _pipeline;
    if (_isLoading) {
        // Esperar si ya está cargando
        while (_isLoading) await new Promise(r => setTimeout(r, 100));
        return _pipeline;
    }

    try {
        _isLoading = true;
        env.allowLocalModels = false;
        env.useBrowserCache = true;

        _pipeline = await pipeline('feature-extraction', MODEL, {
            quantized: true   // versión INT8 — más rápida y pequeña
        });

        console.log('🧬 Embedder listo:', MODEL);
        _isLoading = false;
        return _pipeline;
    } catch (e) {
        _isLoading = false;
        console.error('❌ Error cargando embedder:', e);
        return null;
    }
}

// ---------------------------------------------------------
// Generar embedding de un texto
// Devuelve array de 384 floats
// ---------------------------------------------------------
export async function embed(text) {
    const pipe = await initEmbedder();
    if (!pipe) return null;

    try {
        const output = await pipe(text, {
            pooling: 'mean',
            normalize: true
        });
        // Convertir tensor a array JS
        return Array.from(output.data);
    } catch (e) {
        console.error('❌ Error generando embedding:', e);
        return null;
    }
}

// ---------------------------------------------------------
// Generar embeddings de múltiples textos (batch)
// ---------------------------------------------------------
export async function embedBatch(texts) {
    const results = [];
    for (const text of texts) {
        results.push(await embed(text));
    }
    return results;
}
