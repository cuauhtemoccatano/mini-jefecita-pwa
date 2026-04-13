import React, { useState } from 'react';
import { Palette, Brain, X, Check } from 'lucide-react';
import { useStore } from '../js/store/useStore';

/**
 * SettingsModal (v4.0.0) - React Edition
 * Panel de control sensorial y neuronal para Mini Jefecita.
 * Gestiona personalización de aura, identidad y selección de cerebro IA.
 */
export default function SettingsModal({ isOpen, onClose }) {
  const { userData, setUserData } = useStore();
  
  // Estado local para edición sin commit inmediato
  const [formData, setFormData] = useState({ ...userData });

  if (!isOpen) return null;

  const handleSave = () => {
    setUserData(formData);
    onClose();
    
    // Disparar sincronización visual legacy (si es necesario)
    if (window.syncAtmosphereMatrix) {
        window.syncAtmosphereMatrix();
    }
  };

  const auraPresets = [
    { id: 'jade', color: '#00C4B4', title: 'Jade' },
    { id: 'sapphire', color: '#00E5FF', title: 'Zafiro' },
    { id: 'amethyst', color: '#9575CD', title: 'Amatista' },
    { id: 'obsidian', color: '#1A237E', title: 'Obsidiana' },
    { id: 'gold', color: '#FFB300', title: 'Oro' },
    { id: 'amber', color: '#FB8C00', title: 'Ámbar' },
  ];

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-[40px] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <header className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white tracking-tight">Ajustes de Consciencia</h2>
            <span className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.2em]">Neural System v4.0.0</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </header>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Aura Selection */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 uppercase tracking-widest">
              <Palette size={16} className="text-primary" /> Personalización de Aura
            </label>
            <div className="grid grid-cols-6 gap-3">
              {auraPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setFormData({ ...formData, auraPreset: preset.id, auraColor: preset.color })}
                  className={`aspect-square rounded-2xl transition-all duration-300 relative flex items-center justify-center ${
                    formData.auraPreset === preset.id 
                    ? 'scale-110 shadow-[0_0_15px_rgba(0,196,180,0.4)] border-2 border-white/20' 
                    : 'opacity-40 hover:opacity-100 border border-transparent'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.title}
                >
                  {formData.auraPreset === preset.id && <Check size={16} className="text-black" />}
                </button>
              ))}
              <div className="relative group aspect-square rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/50 transition-all overflow-hidden">
                <input 
                  type="color" 
                  value={formData.auraColor}
                  onChange={(e) => setFormData({ ...formData, auraPreset: 'custom', auraColor: e.target.value })}
                  className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer bg-transparent opacity-0"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-neutral-400 text-xs">
                    HEX
                </div>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 italic pl-1">Jade modula su atmósfera según tu elección sensorial.</p>
          </div>

          {/* Identity */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Tu Identidad</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                placeholder="Tu nombre..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Nombre de tu IA</label>
              <input 
                type="text" 
                value={formData.jadeName}
                onChange={(e) => setFormData({ ...formData, jadeName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                placeholder="Ej: Jade, Alexa..."
              />
            </div>
          </div>

          {/* Brain Level */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 uppercase tracking-widest">
              <Brain size={16} className="text-primary" /> Potencia de IA
            </label>
            <div className="relative group">
              <select 
                value={formData.brain}
                onChange={(e) => setFormData({ ...formData, brain: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all hover:bg-white/10"
              >
                <option value="AUTO" className="bg-neutral-900">⚡️ Auto-Inteligencia</option>
                <option value="ULTRA" className="bg-neutral-900">🧠 Ultra (Llama-3.2)</option>
                <option value="PRO" className="bg-neutral-900">💎 Pro (Qwen-2.5)</option>
                <option value="ESENCIAL" className="bg-neutral-900">🍃 Esencial (SmolLM2)</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                <Palette size={14} />
              </div>
            </div>
          </div>
        </div>

        <footer className="p-6 border-t border-white/5 flex gap-4">
          <button 
            onClick={handleSave}
            className="flex-1 bg-primary text-black py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,196,180,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            Sincronizar Cambios
          </button>
        </footer>
      </div>
    </div>
  );
}
