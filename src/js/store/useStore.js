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
        heartRate: 70,
        sleep: 8,
        cycleDay: null,
      },
      activeView: 'inicio',
      
      // Estado volátil (No persistido)
      aiState: {
        isReady: false,
        isThinking: false,
        isGenerating: false,
        progress: 0,
        status: 'Inactiva',
        error: null,
      },
      worker: null,

      // Acciones de Usuario/Salud
      setUserData: (data) => set((state) => ({ 
        userData: { ...state.userData, ...data } 
      })),

      setView: (view) => set({ activeView: view }),

      setHealthData: (data) => {
        set((state) => {
          const newData = { ...state.healthData, ...data };
          // analyzeHealthTrends simple logic could go here or in a component
          return { healthData: newData };
        });
      },

      syncHealthFromParams: () => {
        const params = new URLSearchParams(window.location.search);
        const steps = params.get('steps');
        const sleep = params.get('sleep');
        const cycleDay = params.get('cycleDay');

        if (steps || hrv || heartRate || energy || sleep || cycleDay) {
          const update = {};
          if (steps) update.steps = parseInt(steps);
          if (hrv) update.hrv = parseInt(hrv);
          if (heartRate) update.heartRate = parseInt(heartRate);
          if (energy) update.energy = parseInt(energy);
          if (sleep) update.sleep = parseFloat(sleep);
          if (cycleDay) update.cycleDay = parseInt(cycleDay);
          
          useStore.getState().setHealthData(update);
          console.log('✨ MQA: Biometría sincronizada vía Atajo Apple.');
        }
      },
      
      // Acciones Neurales (Centralizadas)
      setAIState: (data) => set((state) => ({
        aiState: { ...state.aiState, ...data }
      })),

      setWorker: (worker) => set({ worker }),

      initAI: async () => {
        const state = get();
        if (state.aiState.isReady || state.worker) return;

        state.setAIState({ status: 'Escaneando hardware...', error: null });

        try {
          // 1. Detección Inteligente de Hardware
          let level = state.userData.brain;
          const ua = navigator.userAgent;
          const isMobile = /iPhone|iPad|iPod/i.test(ua);
          const isMac = /Macintosh/i.test(ua) && !isMobile;

          if (level === 'AUTO' || !level) {
            if (isMac) level = 'ULTRA'; // Mac M1/M2/M3
            else if (isMobile && ua.includes('iPad')) level = 'PRO'; // iPad
            else level = 'ESENCIAL'; // iPhone (Económico en batería)
          }

          const modelMappings = {
            'ULTRA':    'onnx-community/Llama-3.2-1B-Instruct',
            'PRO':      'onnx-community/Qwen2.5-0.5B-Instruct',
            'AVANZADO':  'onnx-community/Qwen2.5-0.5B-Instruct',
            'ESENCIAL':  'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
          };
          const modelName = modelMappings[level] || modelMappings['PRO'];

          // 2. Verificación de WebGPU (Hardware Acceleration)
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
              get().setAIState({ status: `Sincronizando ${level}...`, progress: data.progress || 0 });
            }
            if (type === 'ready') {
              get().setAIState({ isReady: true, status: 'Conexión Establecida', progress: 100 });
              console.log(`✨ MQA: Neural Bonded [${level}] via ${device.toUpperCase()} on ${isMac ? 'Mac' : 'iOS'}`);
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
