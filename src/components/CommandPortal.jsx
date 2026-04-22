import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useStore } from '../js/store/useStore';

/**
 * CommandPortal (v4.0.0) - React Edition
 * Interfaz de comandos rápidos y chat AI.
 */
export default function CommandPortal({ isOpen, onClose }) {
  const { userData } = useStore();
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  return (
    <div id="command-portal" className="view overlay-portal active animate-in slide-in-from-bottom duration-500">
      <div className="portal-header">
        <span className="portal-title">Comando Neuronal</span>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
      </div>
      <div id="portal-messages" className="portal-content">
        <div className="message ai">{userData.jadeName} estoy lista. ¿En qué puedo guiarte?</div>
      </div>
      <div className="portal-input-area">
        <input 
          type="text" 
          placeholder="Comando rápido..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setInput('')}
        />
        <button className="icon-btn primary" onClick={() => setInput('')}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
