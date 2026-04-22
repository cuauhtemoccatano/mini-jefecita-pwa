import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook de IA: Neural Link (v4.0.1)
 * Gestiona la instancia del worker neuronal y la generación de respuestas.
 */
export function useAI() {
  const { userData } = useStore();
  const [isReady, setIsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('Inactiva');
  const workerRef = useRef(null);

  // Inicialización del Motor Neural
  const initAI = useCallback(async () => {
    // Evitar múltiples inicializaciones
    if (workerRef.current || isReady) return;

    setStatus('Sincronizando...');
    
    try {
      const level = userData.brain || 'PRO';
      const modelMappings = {
        'ULTRA':    'onnx-community/Llama-3.2-1B-Instruct',
        'PRO':      'onnx-community/Qwen2.5-0.5B-Instruct',
        'AVANZADO':  'onnx-community/Qwen2.5-0.5B-Instruct',
        'ESENCIAL':  'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
      };
      const modelName = modelMappings[level] || modelMappings['PRO'];

      // Detección de Aceleración por Hardware (WebGPU)
      let device = 'wasm';
      try {
        if (typeof navigator !== 'undefined' && navigator.gpu) {
          const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
          if (adapter) device = 'webgpu';
        }
      } catch (e) {
        console.warn('⚠️ MQA: WebGPU no detectado, usando WASM de respaldo.');
      }

      const workerUrl = new URL('../../ai_worker.js', import.meta.url);
      const worker = new Worker(workerUrl, { type: 'module' });
      workerRef.current = worker;

      worker.onmessage = (e) => {
        const { type, data } = e.data;

        if (type === 'progress') {
          setStatus(`${data.status === 'initiate' ? 'Iniciando' : 'Descargando'} ${level}...`);
        }

        if (type === 'ready') {
          setIsReady(true);
          setStatus(`${userData.jadeName} lista · ${level} · ${device.toUpperCase()}`);
        }

        if (type === 'error') {
          setIsReady(false);
          setStatus('Error de conexión neuronal');
          console.error('💥 MQA: Neural Worker Error:', data);
        }
      };

      worker.postMessage({ type: 'init', data: { modelName, device } });
    } catch (err) {
      setStatus('Fallo Crítico');
      console.error('💥 MQA: Critical AI Load Failure:', err);
    }
  }, [userData.brain, userData.jadeName, isReady]);

  // Generación Transmisión Neural
  const generate = useCallback(async (userMessage, onChunk, onComplete) => {
    if (!workerRef.current || !isReady) return;

    setIsGenerating(true);

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

    // Acceder a setAIState del store
    const { setAIState } = useStore.getState();
    setAIState({ isThinking: true });

    const handler = (e) => {
      const { type, data } = e.data;
      
      if (type === 'chunk') {
        if (onChunk) onChunk(data);
      }
      
      if (type === 'complete') {
        setIsGenerating(false);
        setAIState({ isThinking: false }); // Reset global state
        if (onComplete) onComplete(data);
        workerRef.current.removeEventListener('message', handler);
      }
      
      if (type === 'error') {
        setIsGenerating(false);
        setAIState({ isThinking: false }); // Reset global state
        workerRef.current.removeEventListener('message', handler);
      }
    };

    workerRef.current.addEventListener('message', handler);
    workerRef.current.postMessage({
      type: 'generate',
      data: {
        fullPrompt: prompt,
        settings: { max_new_tokens: 300, temperature: 0.7 }
      }
    });
  }, [userData, isReady]);

  // Cleanup: Terminación del Worker al desmontar
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return { isReady, isGenerating, status, initAI, generate };
}
