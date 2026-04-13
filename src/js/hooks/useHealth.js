import { useMemo } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook de Sincronización Vital
 * Procesa tendencias biométricas y genera sugerencias proactivas de bienestar
 */
export function useHealth() {
  const { healthData } = useStore();

  const trend = useMemo(() => {
    const { steps = 0, hrv = 60 } = healthData || {};
    
    // Escenario 1: Tensión / Estrés
    if (hrv < 45) {
      return {
        type: 'stress',
        icon: '🍵',
        title: 'Jade nota tensión',
        desc: 'Tu HRV es bajo. Un momento en el Portal Zen podría equilibrarte.',
        actionLabel: 'Ir ahora',
        view: 'zen'
      };
    }
    
    // Escenario 2: Agotamiento físico
    if (steps > 10000 && hrv < 55) {
      return {
        type: 'exhaustion',
        icon: '🔋',
        title: 'Día Productivo',
        desc: 'Has superado los 10k pasos. Es momento de recargar energías.',
        actionLabel: 'Relajarme',
        view: 'zen'
      };
    }
    
    return null;
  }, [healthData]);

  return { 
    healthData, 
    trend,
    hasActiveDivergence: !!trend 
  };
}
