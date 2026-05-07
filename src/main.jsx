import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/style.css';
import './assets/css/main.css';
import './assets/css/awakening.css';

import App from './App';

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
