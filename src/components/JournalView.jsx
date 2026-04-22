import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, Save, Trash2 } from 'lucide-react';
import { useStore } from '../js/store/useStore';
import { saveMemory } from '../js/rag_engine.js';

/**
 * JournalView (v4.0.0) - React Edition
 * Diario secreto con protección biométrica (WebAuthn).
 */
export default function JournalView() {
  const [isLocked, setIsLocked] = useState(true);
  const [entries, setEntries] = useState([]);
  const [input, setInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Auto-trigger biometry if credential exists
    if (localStorage.getItem('mqa_journal_cred_id')) {
      handleAuth();
    }
  }, []);

  const handleAuth = async () => {
    if (!window.PublicKeyCredential) {
      setIsLocked(false);
      setEntries(loadStoredEntries());
      return;
    }

    try {
      setIsAuthenticating(true);
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const credIdBase64 = localStorage.getItem('mqa_journal_cred_id');

      if (!credIdBase64) {
        // Register biometric
        const credential = await navigator.credentials.create({
          publicKey: {
            rp: { name: 'Mini Jefecita', id: window.location.hostname },
            user: { id: new Uint8Array([1, 2, 3, 4]), name: 'jade_user', displayName: 'Usuario' },
            challenge,
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
            authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' }
          }
        });
        if (credential) {
          const id64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
          localStorage.setItem('mqa_journal_cred_id', id64);
        }
      } else {
        // Authenticate
        const rawId = Uint8Array.from(atob(credIdBase64), c => c.charCodeAt(0));
        await navigator.credentials.get({
          publicKey: {
            challenge,
            allowCredentials: [{ id: rawId, type: 'public-key' }],
            userVerification: 'required'
          }
        });
      }

      setIsLocked(false);
      setEntries(loadStoredEntries());
      if (window.navigator?.vibrate) window.navigator.vibrate(10);
    } catch (err) {
      console.error('🔐 Auth error:', err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loadStoredEntries = () => {
    try {
      return JSON.parse(localStorage.getItem('mqa_journal_entries') || '[]');
    } catch { return []; }
  };

  const handleSave = async () => {
    if (!input.trim()) return;

    const entry = { text: input.trim(), date: new Date().toISOString() };
    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);
    localStorage.setItem('mqa_journal_entries', JSON.stringify(updatedEntries));
    setInput('');

    // Semantic memory sync
    saveMemory({
      type: 'journal',
      content: entry.text,
      metadata: { date: entry.date }
    }).catch(() => {});

    if (window.navigator?.vibrate) window.navigator.vibrate(10);
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
          <Lock className="text-primary" size={32} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Diario Bloqueado</h2>
          <p className="text-xs text-neutral-500 font-medium px-8">Usa FaceID o TouchID para acceder a tus pensamientos.</p>
        </div>
        <button 
          onClick={handleAuth}
          disabled={isAuthenticating}
          className="bg-primary text-black px-10 py-4 rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
        >
          {isAuthenticating ? 'Autenticando...' : 'Desbloquear'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          Cámara Secreta <BookOpen className="text-primary" size={24} />
        </h1>
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest pl-1">Tus trazos de consciencia</p>
      </header>

      <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[32px] p-6 shadow-xl relative overflow-hidden group">
        <textarea 
          className="w-full bg-transparent text-white text-base leading-relaxed placeholder:text-white/20 outline-none resize-none min-h-[160px] custom-scrollbar"
          placeholder="¿Qué hay en tu mente hoy?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-end pt-2">
          <button 
            onClick={handleSave}
            disabled={!input.trim()}
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-30"
          >
            <Save size={18} /> Guardar
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] pl-1">Memorias pasadas</h2>
        <div className="grid gap-4">
          {entries.length > 0 ? (
            entries.slice().reverse().map((e, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] p-6 space-y-3 hover:bg-white/[0.07] transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                    {new Date(e.date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">
                    {new Date(e.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-white/90 text-[15px] leading-relaxed font-medium">
                  {e.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-500 font-medium">Tu historia comienza aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
