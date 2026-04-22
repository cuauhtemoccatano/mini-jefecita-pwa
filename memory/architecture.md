# System Architecture: Neural Modular Orchestration (v3.7.2)

Mini Jefecita v3.7.2 operates on a modern, Vite-powered architecture designed for industrial scalability, high-fidelity performance, and professional-grade PWA deployment.

## The Build System (Vite + Workbox)
The application is orchestrated by **Vite**, utilizing **vite-plugin-pwa** with an `injectManifest` strategy. This allows for fine-grained control over the Service Worker while benefiting from modern bundling, dead-code elimination, and environmental variable injection.

## The Master Orchestrator (`src/main.jsx`)
Entry point de React 19. Gestiona el montaje del árbol de componentes, la sintonización inicial del aura y la hidratación del estado global.

## Core Engines / Logic (`src/js/`)
1.  **State Logic (`store/useStore.js`)**: Zustand store para persistencia y reactividad.
2.  **Neural Link (`hooks/useAI.js`)**: Gestión del worker de Transformers.js y generación.
3.  **Biometric Core (`hooks/useHealth.js`)**: Sincronización de salud y HRV.
4.  **Santuario 3D (`santuario.js`)**: Sub-sistema inmersivo de Three.js.
5.  **RAG Engine (`rag_engine.js`)**: Persistencia semántica vía Supabase.
6.  **Security Layer (`hooks/useAuth.js`)**: Blindaje biométrico v4.1.1.

## UI Paradigm: Neural Components (`src/components/`)
La interfaz es 100% Reactiva. Cada vista es un componente funcional (.jsx) que:
- Gestiona su propio estado local y transiciones.
- Se suscribe al Store global (Zustand) para datos de usuario y aura.
- Utiliza **Lucide-React** para iconografía vectorizada.
- Implementa micro-interacciones dinámicas en `App.jsx`.

## Environment & Security
- **Strict Isolation**: Uses `COOP` (same-origin) and `COEP` (require-corp) headers for WebGPU support.
- **Environment Management**: Centralized in `src/lib/env.js`, leveraging Vite's `import.meta.env` for secure credential handling.
