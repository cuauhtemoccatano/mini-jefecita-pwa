import React, { useState, useEffect, useRef } from 'react';
import { Bot, Trash2, Send, Sparkles } from 'lucide-react';
import { useStore } from '../js/store/useStore';
import { useAI } from '../js/hooks/useAI';

/**
 * ChatView (v4.0.0) - React Edition
 * Interfaz de conversación neural.
 * Gestiona el streaming de IA local, historial de mensajes persistente
 * y limpieza de memoria mediante el motor Zustand + useAI hook.
 */
export default function ChatView() {
  const { userData, clearChatHistory } = useStore();
  const { isReady, isGenerating, status, initAI, generate } = useAI();
  const [input, setInput] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll al final de la conversación
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userData.chatHistory, streamingMessage]);

  // Inicializar IA si no está lista al entrar a la vista
  useEffect(() => {
    if (!isReady && !isGenerating) {
        initAI();
    }
  }, [isReady, initAI]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating || !isReady) return;
    
    const text = input;
    setInput('');
    setStreamingMessage('...');
    
    await generate(text, 
      (chunk) => {
        setStreamingMessage(chunk);
      },
      () => {
        setStreamingMessage('');
      }
    );
  };

  const handleClear = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar mi memoria de esta conversación?")) {
        clearChatHistory();
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* Header Sensorial */}
      <header className="flex justify-between items-center p-6 bg-white/5 backdrop-blur-[30px] rounded-b-[32px] border-b border-white/10 shrink-0 shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            {userData.jadeName} <Bot size={20} className="text-primary" />
          </h1>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
            {isGenerating ? "Procesando Conciencia..." : isReady ? "Enlace Establecido" : status || "Sincronizando..."}
          </p>
        </div>
        <button 
            onClick={handleClear}
            className="p-3 bg-white/5 text-neutral-400 hover:text-red-400 hover:bg-white/10 rounded-2xl transition-all"
            title="Borrar Memoria"
        >
          <Trash2 size={18} />
        </button>
      </header>

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 custom-scrollbar">
        {userData.chatHistory.length === 0 && !streamingMessage && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-[28px] text-white/70 text-[15px] leading-relaxed italic shadow-inner">
                Hola. Soy tu asistente sensorial. Puedo ayudarte con tus entrenamientos, recordatorios o simplemente escucharte. ¿En qué piensas hoy?
            </div>
        )}
        
        {userData.chatHistory.map((m, i) => (
          <div 
            key={i} 
            className={`max-w-[85%] p-4 rounded-[24px] text-[15px] leading-snug animate-in slide-in-from-bottom-2 duration-300 relative ${
              m.role === 'user' 
                ? 'self-end bg-primary text-black font-semibold ml-auto rounded-tr-none shadow-[0_4px_15px_var(--aura-glow)]' 
                : 'self-start bg-white/10 text-white/90 mr-auto rounded-tl-none border border-white/5 shadow-xl'
            }`}
          >
            {m.content}
          </div>
        ))}
        
        {streamingMessage && (
          <div className="max-w-[85%] self-start bg-white/10 text-white/90 mr-auto rounded-[24px] rounded-tl-none p-4 border border-white/5 shadow-glow animate-pulse">
            {streamingMessage}
          </div>
        )}
        <div ref={messagesEndRef} className="h-4 shrink-0" />
      </div>

      {/* Input de Comando */}
      <div className="p-6 shrink-0 bg-gradient-to-t from-black to-transparent">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isReady ? "Escribe un mensaje..." : "Iniciando cerebro..."}
            disabled={!isReady || isGenerating}
            className="w-full bg-white/10 border border-white/10 rounded-[28px] pl-6 pr-14 py-5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:bg-white/20 transition-all font-medium backdrop-blur-md"
            autoComplete="off"
          />
          <button 
            onClick={handleSend}
            disabled={!isReady || isGenerating || !input.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-[20px] transition-all ${
                input.trim() && isReady && !isGenerating 
                ? 'bg-primary text-black shadow-[0_4px_15px_var(--aura-glow)] hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-neutral-600'
            }`}
          >
            {isGenerating ? <Sparkles size={20} className="animate-spin text-primary" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
