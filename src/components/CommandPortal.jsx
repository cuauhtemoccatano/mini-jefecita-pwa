import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../js/store/useStore';
import { useAI } from '../js/hooks/useAI';

/**
 * CommandPortal (v4.1.0) - Neural React Edition
 * Interfaz de comandos rápidos activa con IA local.
 */
export default function CommandPortal({ isOpen, onClose }) {
  const { userData } = useStore();
  const { isReady, isGenerating, generate } = useAI();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (!input.trim() || isGenerating || !isReady) return;
    
    const text = input;
    setInput('');
    setResponse('Pensando...');
    
    await generate(text, 
      (chunk) => setResponse(chunk),
      () => {}
    );
  };

  if (!isOpen) return null;

  return (
    <div id="command-portal" className="view overlay-portal active animate-in slide-in-from-bottom duration-500">
      <div className="portal-header">
        <div className="flex items-center gap-2">
           <Sparkles size={16} className={isGenerating ? "animate-pulse text-primary" : "text-primary"} />
           <span className="portal-title">Comando Neuronal</span>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
      </div>
      
      <div id="portal-messages" className="portal-content">
        <div className="bg-white/5 border border-white/10 p-5 rounded-[24px] text-white/90 text-[14px] leading-relaxed shadow-xl">
           {response || `${userData.jadeName} está lista. ¿Qué comando deseas ejecutar?`}
        </div>
      </div>

      <div className="portal-input-area">
        <input 
          type="text" 
          placeholder={isReady ? "Dime algo..." : "Sincronizando..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={!isReady || isGenerating}
        />
        <button 
          className={`icon-btn ${input.trim() && isReady ? 'primary active' : ''}`} 
          onClick={handleSend}
          disabled={!isReady || isGenerating || !input.trim()}
        >
          {isGenerating ? <Sparkles size={18} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
