import React, { useEffect, useState } from 'react';
import { Flame, ListChecks, Footprints, Zap } from 'lucide-react';
import { useStore } from '../js/store/useStore';
import { useHealth } from '../js/hooks/useHealth';

/**
 * HomeView (v4.0.0) - React Edition
 * Panel principal de Mini Jefecita.
 * Muestra métricas vitales, racha de conexión y recordatorios próximos de forma reactiva.
 */
export default function HomeView() {
  const { userData } = useStore();
  const { healthData } = useHealth();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    // Carga inicial de recordatorios desde el sistema legacy (mqa_reminders)
    try {
      const stored = JSON.parse(localStorage.getItem('mqa_reminders') || '[]');
      const upcoming = stored
        .filter(r => new Date(r.date) >= new Date())
        .slice(0, 2);
      setReminders(upcoming);
    } catch (e) {
      console.warn('⚠️ MQA: Error cargando recordatorios en Home.', e);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Motivational Card */}
      <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] p-6 shadow-xl">
        <p className="text-white/90 text-[15px] leading-relaxed font-medium">
          Preparando tu inspiración... ✨
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] p-5">
          <div className="flex items-center gap-3 mb-1">
            <Flame className="text-[#FF7043]" size={20} />
            <span className="text-2xl font-bold text-white tracking-tight">{userData.streak || 0}</span>
          </div>
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none">/ días racha</p>
        </div>
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] p-5">
          <div className="flex items-center gap-3 mb-1">
            <ListChecks className="text-primary" size={20} />
            <span className="text-2xl font-bold text-white tracking-tight">{userData.remindersCount || 0}</span>
          </div>
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none">/ pendientes</p>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-5">
          <span className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
            Paso a paso <Footprints size={12} />
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{(healthData.steps || 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase">steps</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-5">
          <span className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
            Energía <Zap size={12} />
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{healthData.energy || 0}</span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">kcal</span>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] pl-1">Próximos recordatorios</h2>
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] overflow-hidden">
          {reminders.length > 0 ? (
            <div className="divide-y divide-white/5">
              {reminders.map((r, i) => {
                const d = new Date(r.date);
                const timeStr = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--aura-glow)]"></div>
                      <span className="text-sm font-medium text-white/90">{r.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-neutral-500">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
               <p className="text-sm text-neutral-500 font-medium">Sin avisos próximos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
