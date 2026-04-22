import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/style.css';
import './assets/css/main.css';
import './assets/css/awakening.css';

import App from './App';

const rootElement = document.getElementById('mqa-react-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
}
