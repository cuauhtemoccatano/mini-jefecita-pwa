import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import './assets/css/style.css';
import './assets/css/main.css';
import './assets/css/awakening.css';

// Components
import PwaToast from './components/PwaToast';
import SettingsModal from './components/SettingsModal';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';

// Bridge & Legacy logic
import { initAppLegacy } from './js/main_legacy.js';

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  React.useEffect(() => {
    // Inicializar lógica legacy de fondo
    initAppLegacy();
    
    // Bridge de eventos
    window.mqa_toggleSettings = (open) => setIsSettingsOpen(open);
    
    return () => {
      delete window.mqa_toggleSettings;
    };
  }, []);

  return (
    <>
      <PwaToast />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      <ViewPortal id="view-inicio">
        <HomeView />
      </ViewPortal>
      
      <ViewPortal id="view-mensajes">
        <ChatView />
      </ViewPortal>
    </>
  );
};

// Utilidad de Portal para inyectar en el DOM legacy del index.html
const ViewPortal = ({ id, children }) => {
  const el = document.getElementById(id);
  if (!el) return null;
  return createPortal(children, el);
};

const rootElement = document.getElementById('mqa-react-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
