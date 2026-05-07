import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/style.css';
import './assets/css/main.css';
import './assets/css/awakening.css';

import App from './App';

// --- AutoUpdateGuard (SmartScales Mode) ---
const autoUpdateGuard = async () => {
    try {
        const response = await fetch('/version.json?t=' + Date.now());
        if (!response.ok) return;
        const serverData = await response.json();
        const localVersion = localStorage.getItem('mqa_v_sync');
        
        if (localVersion && localVersion !== serverData.version) {
            console.log('🔄 MQA: Nueva versión detectada. Limpiando caché...');
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (let r of regs) await r.unregister();
            }
            if ('caches' in window) {
                const keys = await caches.keys();
                for (let k of keys) await caches.delete(k);
            }
            localStorage.setItem('mqa_v_sync', serverData.version);
            window.location.reload();
            return true;
        }
        localStorage.setItem('mqa_v_sync', serverData.version);
    } catch (e) {
        console.warn('⚠️ MQA: Fallo en AutoUpdateGuard:', e);
    }
    return false;
};

const init = async () => {
    const isUpdating = await autoUpdateGuard();
    if (isUpdating) return;

    const rootElement = document.getElementById('mqa-react-root');
    if (rootElement) {
        console.log('✅ MQA: Root element found.');
        
        // Safety Timeout: Force visibility if React fails to trigger animations
        setTimeout(() => {
          rootElement.style.opacity = '1';
          rootElement.style.visibility = 'visible';
        }, 2500);

        try {
            const root = createRoot(rootElement);
            root.render(
              <React.StrictMode>
                <App />
              </React.StrictMode>
            );
            console.log('✅ MQA: Render initiated.');
        } catch (error) {
            console.error('❌ MQA: Render failed:', error);
            rootElement.innerHTML = `
                <div style="color:white; padding:40px; text-align:center; font-family:sans-serif;">
                    <h2 style="color:#00C4B4;">Error de Conexión Neural</h2>
                    <p style="opacity:0.6;">${error.message}</p>
                    <button onclick="location.reload()" style="background:#00C4B4; border:none; padding:10px 20px; border-radius:20px; margin-top:20px; cursor:pointer;">Reintentar</button>
                </div>
            `;
        }
    } else {
        console.error('❌ MQA: Root element #mqa-react-root not found.');
    }
};

init();
