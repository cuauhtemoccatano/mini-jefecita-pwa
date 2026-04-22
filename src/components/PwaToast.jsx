import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * PwaToast (v4.0.0) - React Edition
 * Notificación premium de actualización y modo offline con integración de changelog dinámico.
 */
export default function PwaToast() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('✨ MQA: PWA Guardián activo.');
      if (r) {
        // Forzar chequeo cada hora
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);

        // Forzar chequeo al volver a la app (Safari / Mobile Fix)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            r.update();
          }
        });
      }
    },
    onRegisterError(error) {
      console.error('❌ MQA: Fallo en el Guardián PWA:', error);
    },
  });

  const [changelog, setChangelog] = useState(null);

  useEffect(() => {
    if (needRefresh) {
      // Intentar cargar las notas de la versión
      fetch('/changelog.json')
        .then(res => res.json())
        .then(data => setChangelog(data))
        .catch(err => console.warn('⚠️ MQA: No se pudo cargar el historial de cambios.', err));
    }
  }, [needRefresh]);

  // Cerrar el toast manualmente
  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  // Ocultar automáticamente si es solo aviso de offline tras 5s
  useEffect(() => {
    if (offlineReady && !needRefresh) {
      const timer = setTimeout(() => setOfflineReady(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, needRefresh]);

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed right-4 left-4 md:right-6 md:left-auto bottom-24 md:bottom-24 z-[6000] md:w-[400px] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-neutral-900/85 backdrop-blur-[30px] border border-white/15 rounded-[28px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_20px_var(--aura-glow)] overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="text-2xl animate-[spin_3s_linear_infinite]">✨</div>
          <div className="flex-1 flex flex-col">
            <span className="text-[15px] font-bold text-white">
              {needRefresh ? 'Actualización disponible' : 'Lista para uso offline'}
            </span>
            {changelog && needRefresh && (
              <span className="text-xs text-primary font-semibold opacity-80">
                v{changelog.version}
              </span>
            )}
          </div>
          <button 
            onClick={close} 
            className="text-neutral-400 text-2xl p-1 leading-none hover:text-white transition-colors"
          >
            &times;
          </button>
        </div>

        {needRefresh && changelog && (
          <div className="mt-5 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
            <p className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3 font-bold">Novedades</p>
            <ul className="flex flex-col gap-2">
              {changelog.notes.map((note, i) => (
                <li key={i} className="text-sm leading-tight text-white/80 relative pl-[18px] before:content-['✦'] before:absolute before:left-0 before:text-primary before:text-[10px]">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {needRefresh && (
            <button 
              onClick={() => updateServiceWorker(true)}
              className="flex-1 bg-primary text-black py-3 rounded-2xl font-bold text-sm shadow-[0_4px_15px_var(--aura-glow)] active:scale-95 transition-all hover:brightness-110"
            >
              Actualizar ahora
            </button>
          )}
          <button 
            onClick={close}
            className="flex-1 bg-white/5 text-white border border-white/10 py-3 rounded-2xl font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            {needRefresh ? 'Más tarde' : 'Entendido'}
          </button>
        </div>
      </div>
    </div>
  );
}
