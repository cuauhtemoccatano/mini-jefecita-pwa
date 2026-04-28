import { useCallback } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook de IA: Neural Link (v4.1.3)
 * Delega toda la lógica de estado al store global (`useStore`)
 * para evitar fugas de memoria y duplicados en iOS/Safari.
 */
export function useAI() {
  const { 
    userData, 
    worker, 
    aiState, 
    initAI, 
    setAIState 
  } = useStore();

  // Generación Transmisión Neural
  const generate = useCallback(async (userMessage, onChunk, onComplete) => {
    if (!worker || !aiState.isReady) return;

    setAIState({ isThinking: true, isGenerating: true });

    // Recuperar contexto RAG si está disponible
    let ragContext = '';
    try {
      if (typeof window.buildRAGContext === 'function') {
        ragContext = await window.buildRAGContext(userMessage);
      }
    } catch (e) {
      console.warn('⚠️ MQA: RAG Context unavailable.');
    }

    // Construcción de Prompt (ChatML / Llama)
    const now = new Date().toLocaleString();
    const systemPrompt = `Eres ${userData.jadeName}, una esencia inteligente calmada y poética.
    DATOS ACTUALES:
    - Fecha/Hora: ${now}
    ${ragContext}`;

    const modelType = userData.brain === 'ULTRA' ? 'llama' : 'qwen';
    let prompt = '';
    
    if (modelType === 'llama') {
        prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|>`;
        userData.chatHistory.forEach(m => {
            prompt += `<|start_header_id|>${m.role}<|end_header_id|>\n\n${m.content}<|eot_id|>`;
        });
        prompt += `<|start_header_id|>user<|end_header_id|>\n\n${userMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;
    } else {
        prompt = `<|im_start|>system\n${systemPrompt}<|im_end|>\n`;
        userData.chatHistory.forEach(m => {
            prompt += `<|im_start|>${m.role}\n${m.content}<|im_end|>\n`;
        });
        prompt += `<|im_start|>user\n${userMessage}<|im_end|>\n<|im_start|>assistant\n`;
    }

    const handler = (e) => {
      const { type, data } = e.data;
      
      if (type === 'chunk') {
        if (onChunk) onChunk(data);
      }
      
      if (type === 'complete') {
        setAIState({ isThinking: false, isGenerating: false });
        if (onComplete) onComplete(data);
        worker.removeEventListener('message', handler);
      }
      
      if (type === 'error') {
        setAIState({ isThinking: false, isGenerating: false });
        worker.removeEventListener('message', handler);
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({
      type: 'generate',
      data: {
        fullPrompt: prompt,
        settings: { max_new_tokens: 300, temperature: 0.7 }
      }
    });

  }, [userData, aiState.isReady, worker, setAIState]);

  return { 
    isReady: aiState.isReady, 
    isGenerating: aiState.isGenerating, 
    status: aiState.status, 
    initAI, 
    generate 
  };
}
