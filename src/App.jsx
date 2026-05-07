import React, { useState, useEffect } from 'react';
import { useStore } from './js/store/useStore';

// Components
import Aura from './components/Aura';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CommandPortal from './components/CommandPortal';
import SettingsModal from './components/SettingsModal';
import PwaToast from './components/PwaToast';
import OnboardingCeremony from './components/OnboardingCeremony';
import HomeView from './components/HomeView';
import ExerciseView from './components/ExerciseView';
import RemindersView from './components/RemindersView';
import JournalView from './components/JournalView';
import ChatView from './components/ChatView';
import ZenView from './components/ZenView';

import { Sparkles, Bot } from 'lucide-react';
import { initMagneticSpells, castPulseSpell } from './js/spells_engine';

/**
 * App (v4.1.0) - Neural React Edition
 * Orquestador maestro del 100% de la interfaz.
 */
export default function App() {
  console.log('🚀 MQA: App Mounting...');
  const { userData, activeView, setView, initAI, aiState } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  // Spell Initialization (One-time)
  useEffect(() => {
    initMagneticSpells();
  }, []);

  // Neural Activity Observer (Visual & Haptic)
  useEffect(() => {
    if (aiState.isThinking) {
      document.body.classList.add('brain-thinking');
      castPulseSpell();
      // UX Favor: immediate pulse instead of interval
      if (window.navigator?.vibrate) window.navigator.vibrate([20, 50, 10]);
    } else {
      document.body.classList.remove('brain-thinking');
    }
  }, [aiState.isThinking]);

  useEffect(() => {
    // Inicializar IA bajo demanda o por estado
    if (userData.onboarded) {
      initAI();
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
    <div id="app" className="flex flex-col h-[100dvh] overflow-hidden animate-in fade-in zoom-in-95 duration-1000 ease-out-expo">
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
        onPointerDown={() => castPulseSpell()}
        onClick={() => setIsPortalOpen(true)}
      >
        <Sparkles size={24} className="relative z-10 text-black" fill="currentColor" />
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
