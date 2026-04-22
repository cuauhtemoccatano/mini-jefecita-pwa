import React, { useState, useEffect } from 'react';
import { useStore } from './js/store/useStore';

// Components
import Aura from './components/Aura';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CommandPortal from './components/CommandPortal';
import SettingsModal from './components/SettingsModal';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import PwaToast from './components/PwaToast';

// Views placeholders - to be converted
import ExerciseView from './components/ExerciseView.jsx';
import RemindersView from './components/RemindersView.jsx';
import JournalView from './components/JournalView.jsx';
import ZenView from './components/ZenView.jsx';
import OnboardingCeremony from './components/OnboardingCeremony.jsx';

/**
 * App (v4.1.0) - Neural React Edition
 * Orquestador maestro del 100% de la interfaz.
 */
export default function App() {
  const { userData, activeView, setView, initAI } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    // Inicializar IA bajo demanda o por estado
    if (userData.onboarded) {
      initAI();
      
      // Heartbeat somático legacy bridge (opcional)
      const interval = setInterval(() => {
        if (document.body.classList.contains('brain-thinking')) {
          if (window.navigator?.vibrate) window.navigator.vibrate([15, 100, 10]);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [userData.onboarded]);

  if (!userData.onboarded) {
    return (
      <div className="onboarding-root">
        <OnboardingCeremony />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'inicio': return <HomeView />;
      case 'ejercicio': return <ExerciseView />;
      case 'avisos': return <RemindersView />;
      case 'diario': return <JournalView />;
      case 'mensajes': return <ChatView />;
      case 'zen': return <ZenView />;
      default: return <HomeView />;
    }
  };

  return (
    <div id="app" className="flex flex-col h-[100dvh] overflow-hidden">
      <PwaToast />
      <Aura />
      
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main id="content" className="flex-1 overflow-y-auto px-5 pb-32">
        {renderView()}
      </main>

      <TabBar />

      {/* Floating Core Button */}
      <div 
        id="liquid-core" 
        className="liquid-button"
        onClick={() => setIsPortalOpen(true)}
      >
        <span className="relative z-10">✨</span>
      </div>

      <CommandPortal 
        isOpen={isPortalOpen} 
        onClose={() => setIsPortalOpen(false)} 
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
