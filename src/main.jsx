import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/style.css';
import './assets/css/main.css';
import './assets/css/awakening.css';

import App from './App';

const rootElement = document.getElementById('mqa-react-root');
if (rootElement) {
    console.log('✅ MQA: Root element found.');
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
        rootElement.innerHTML = `<div style="color:white; padding:20px;">Error de Carga: ${error.message}</div>`;
    }
} else {
    console.error('❌ MQA: Root element #mqa-react-root not found.');
}
