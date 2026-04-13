import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      userData: {
        name: "Viajero",
        jadeName: "Jade",
        auraColor: "#00C4B4",
        auraPreset: "jade",
        brain: "AUTO",
        streak: 0,
        remindersCount: 0,
        chatHistory: [],
        onboarded: false,
      },
      healthData: {
        steps: 0,
        energy: 0,
        hrv: 50,
      },
      
      // Estado volátil (No persistido)
      aiState: {
        isReady: false,
        isThinking: false,
        progress: 0,
        status: 'Inactiva',
        error: null,
      },
      worker: null,

      // Acciones de Usuario/Salud
      setUserData: (data) => set((state) => ({ 
        userData: { ...state.userData, ...data } 
      })),
      
      setHealthData: (data) => set((state) => ({ 
        healthData: { ...state.healthData, ...data } 
      })),
      
      // Acciones Neurales (Centralizadas)
      setAIState: (data) => set((state) => ({
        aiState: { ...state.aiState, ...data }
      })),

      setWorker: (worker) => set({ worker }),

      initAI: async () => {
        const state = get();
        if (state.aiState.isReady || state.worker) return;

        state.setAIState({ status: 'Sincronizando...', error: null });

        try {
          const level = state.userData.brain || 'PRO';
          const modelMappings = {
            'ULTRA':    'onnx-community/Llama-3.2-1B-Instruct',
            'PRO':      'onnx-community/Qwen2.5-0.5B-Instruct',
            'AVANZADO':  'onnx-community/Qwen2.5-0.5B-Instruct',
            'ESENCIAL':  'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
          };
          const modelName = modelMappings[level] || modelMappings['PRO'];

          let device = 'wasm';
          try {
            if (typeof navigator !== 'undefined' && navigator.gpu) {
              const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
              if (adapter) device = 'webgpu';
            }
          } catch (e) {}

          const workerInstance = new Worker(new URL('../../ai_worker.js', import.meta.url), { type: 'module' });
          
          workerInstance.onmessage = (e) => {
            const { type, data } = e.data;
            if (type === 'progress') {
              get().setAIState({ status: `Descargando ${level}...`, progress: data.progress || 0 });
            }
            if (type === 'ready') {
              get().setAIState({ isReady: true, status: 'Conexión Establecida', progress: 100 });
              console.log(`✨ MQA: Neural Bonded [${level}] via ${device.toUpperCase()}`);
            }
            if (type === 'error') {
              get().setAIState({ error: data, status: 'Error de Vínculo', isReady: false });
            }
          };

          workerInstance.postMessage({ type: 'init', data: { modelName, device } });
          set({ worker: workerInstance });
        } catch (err) {
          get().setAIState({ error: err.message, status: 'Fallo Crítico' });
        }
      },
      
      clearChatHistory: () => set((state) => ({
        userData: { ...state.userData, chatHistory: [] }
      })),

      resetState: () => set({
        userData: {
          name: "Viajero",
          jadeName: "Jade",
          auraColor: "#00C4B4",
          auraPreset: "jade",
          brain: "AUTO",
          streak: 0,
          remindersCount: 0,
          chatHistory: [],
          onboarded: false,
        },
        healthData: {
          steps: 0,
          energy: 0,
          hrv: 50,
        }
      })
    }),
    {
      name: 'mini-jefecita-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos datos de usuario y salud
      partialize: (state) => ({ 
        userData: state.userData, 
        healthData: state.healthData 
      }),
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('❌ Error rehidratando el nucleo:', error);
          } else if (rehydratedState && !rehydratedState.userData.onboarded) {
            // Intentar migrar datos desde keys antiguas de Vanilla JS
            try {
              const legacyUser = localStorage.getItem('user_settings');
              const legacyHealth = localStorage.getItem('health_data');
              
              if (legacyUser) {
                const parsedUser = JSON.parse(legacyUser);
                rehydratedState.setUserData(parsedUser);
                console.log('✨ MQA: Perfil legacy detectado y migrado.');
              }
              
              if (legacyHealth) {
                const parsedHealth = JSON.parse(legacyHealth);
                rehydratedState.setHealthData(parsedHealth);
                console.log('✨ MQA: Biometría legacy detectada y sincronizada.');
              }
            } catch (err) {
              console.warn('⚠️ Fallo en puente de migración legacy:', err);
            }
          }
        };
      },
    }
  )
);

// Bóveda de Sincronización Legacy (Bridge)
// Mantiene las keys antiguas actualizadas para que el código Vanilla siga funcionando
useStore.subscribe((state) => {
  localStorage.setItem('user_settings', JSON.stringify(state.userData));
  localStorage.setItem('health_data', JSON.stringify(state.healthData));
});
