import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Clock, Zap } from 'lucide-react';
import { useStore } from '../js/store/useStore';
import { useAI } from '../js/hooks/useAI';

/**
 * HomeView (v4.1.0) - Neural React Edition
 * Dashboard principal con percepciones cognitivas en tiempo real.
 */
export default function HomeView() {
  const { userData, healthData } = useStore();
  const { isReady, generate } = useAI();
  const [insight, setInsight] = useState('');

  // Generación de Insight Cognitivo basado en Biometría
  useEffect(() => {
    if (isReady && !insight) {
      const prompt = `Actúa como Jade. Genera una única frase corta (máx 12 palabras) de aliento o consejo poético basada en estos datos: HRV ${healthData.hrv}ms (bajo < 45), Pasos ${healthData.steps}, Nombre Usuario: ${userData.name}. Sé mística y breve.`;
      
      generate(prompt, 
        (chunk) => setInsight(chunk),
        () => {}
      );
    }
  }, [isReady, healthData]);

  const cards = [
    { 
      id: 'energy', 
      title: 'Energía Vital', 
      value: `${healthData?.energy || 85}%`, 
      icon: Zap, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/10' 
    },
    { 
      id: 'hrv', 
      title: 'Resiliencia', 
      value: `${healthData?.hrv || 52} ms`, 
      icon: Activity, 
      color: 'text-primary', 
      bg: 'bg-primary/10' 
    },
    { 
      id: 'streak', 
      title: 'Constancia', 
      value: `${userData.streak || 7} días`, 
      icon: Clock, 
      color: 'text-orange-400', 
      bg: 'bg-orange-400/10' 
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Smart Suggestion Card */}
      <div className="bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-[32px] p-8 mt-4 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary animate-pulse" size={18} />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Percepción de {userData.jadeName}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight min-h-[3.5rem]">
            {insight || "Sintonizando tu estado vital..."}
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-[280px]">
            {insight ? "Inferencia neural completada." : "Leyendo biometría y patrones..."}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Signos Vitales</h3>
        <div className="grid grid-cols-2 gap-4">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 space-y-3">
                <div className={`w-10 h-10 rounded-2xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={card.color} size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{card.title}</p>
                  <p className="text-xl font-bold text-white tracking-tight">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote / Reflection */}
      <div className="p-4 text-center italic">
        <p className="text-neutral-600 text-[13px] leading-relaxed">
          "La consciencia no es algo que se tiene, es algo que se es."
        </p>
      </div>
    </div>
  );
}
