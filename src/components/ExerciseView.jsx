import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useStore } from '../js/store/useStore';

/**
 * ExerciseView (v4.0.0) - React Edition
 * Panel de registro de actividad física.
 */
export default function ExerciseView() {
  const { userData, setUserData } = useStore();
  const [duration, setDuration] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Carga de historial legacy si existe
    const stored = JSON.parse(localStorage.getItem('mqa_exercise_history') || '[]');
    setHistory(stored);
  }, []);

  const handleLog = () => {
    if (!duration || parseInt(duration) <= 0) return;
    
    const entry = {
      duration: parseInt(duration),
      date: new Date().toISOString()
    };
    
    const newHistory = [...history, entry];
    setHistory(newHistory);
    localStorage.setItem('mqa_exercise_history', JSON.stringify(newHistory));
    
    // Actualizar racha (simulación simple)
    setUserData({ streak: (userData.streak || 0) + 1 });
    setDuration('');
    
    if (window.navigator?.vibrate) window.navigator.vibrate(10);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-[#FF7043]/20 flex items-center justify-center">
          <Flame className="text-[#FF7043]" size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-white leading-none">{userData.streak || 7}</span>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mt-1">días seguidos</span>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">¿Entrenaste hoy?</h2>
          <p className="text-xs text-neutral-500 font-medium">Registra tu actividad para mantener la racha.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="number" 
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#FF7043]/50 transition-all"
            placeholder="Minutos" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button 
            className="bg-[#FF7043] text-white px-6 rounded-2xl font-bold shadow-lg shadow-[#FF7043]/20 active:scale-95 transition-all"
            onClick={handleLog}
          >
            Registrar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Historial reciente</h2>
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] overflow-hidden">
          {history.length > 0 ? (
            <div className="divide-y divide-white/5">
              {history.slice().reverse().map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF7043]"></div>
                    <span className="text-sm font-medium text-white/90">Sesión de {item.duration} min</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">
                    {new Date(item.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-neutral-500 font-medium">No hay registros nuevos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
