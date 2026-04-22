import React from 'react';
import { Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { useStore } from '../js/store/useStore';

/**
 * Header (v4.0.0) - React Edition
 * Encabezado global con identidad y acciones.
 */
export default function Header({ onOpenSettings }) {
  const { userData, activeView, setView } = useStore();

  const viewNames = { 
    inicio: 'Inicio', 
    ejercicio: 'Salud', 
    avisos: 'Avisos', 
    diario: 'Diario', 
    mensajes: 'Conversando', 
    zen: 'Zen' 
  };
  
  const viewCaptions = { 
    inicio: null, 
    ejercicio: 'Tu progreso físico', 
    avisos: 'Tus próximas tareas', 
    diario: 'Trazos de consciencia', 
    mensajes: 'Conexión Neuronal', 
    zen: 'Inmersión Total' 
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "¡BUENOS DÍAS!" : hour < 19 ? "¡BUENAS TARDES!" : "¡BUENAS NOCHES!";
  
  const currentTitle = activeView === 'inicio' ? userData.name : viewNames[activeView];
  const currentCaption = activeView === 'inicio' ? greeting : viewCaptions[activeView];

  return (
    <header id="global-header" className="home-header">
      <div className="header-main">
        <p id="global-greeting" className="caption">{currentCaption}</p>
        <h1 id="global-title" className="user-greeting">
          {activeView === 'inicio' ? (
            <>
              <span className="user-name-label">{userData.name}</span>{' '}
              <span id="user-vibe-label"><Sparkles size={24} className="inline text-primary" /></span>
            </>
          ) : (
            currentTitle
          )}
        </h1>
      </div>
      <div className="header-actions">
        <button 
          id="btn-zen-portal" 
          className="btn-zen-trigger" 
          aria-label="Momento de Calma" 
          title="Momento de Calma"
          onClick={() => setView('zen')}
        >
          <Sparkles size={20} />
        </button>
        <button 
          id="btn-settings" 
          className="btn-icon" 
          aria-label="Ajustes"
          onClick={onOpenSettings}
        >
          <SettingsIcon size={20} />
        </button>
      </div>
    </header>
  );
}
