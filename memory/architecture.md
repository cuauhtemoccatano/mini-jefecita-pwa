# System Architecture: Neural Modular Orchestration

Mini Jefecita v3.3.0 operates on a fragmented, engine-based architecture designed for industrial scalability and high-fidelity performance.

## The Master Orchestrator (`app.js`)
The application entry point is a lightweight orchestrator that manages the lifecycle of specialized engines. It performs the "Neural Handshake" and triggers the **"Awakening Ceremony"** (v3.4.0) for untethered identities.

## Core Engines (`js/`)
1.  **State Engine (`state.js`)**: Single source of truth for global data, persistence, and reactive settings synchronization.
2.  **AI Engine (`ai_engine.js`)**: Neural core that manages the Transformers.js background worker, model tiering (ULTRA, PRO, AVANZADO, ESENCIAL), and the global Command Portal.
3.  **UI Engine (`ui_engine.js`)**: Master renderer that orchestrates the dynamic injection of "Liquid Components". Includes the **Spectral Core**, an autonomous algorithm that synchronizes the application aura with circadian rhythms and biometric data.
    - **Spectral Core**: Sub-motor de la UI que define la atmósfera sistémica.
    - **Lazy Neural Activation**: Protocolo de carga retardada para el cerebro de IA. Protege la RAM cargando modelos solo bajo demanda de interacción.
    - **Persistent Lifecycle Guard**: Uso de `sessionStorage` para gestionar el estado de recarga del Service Worker y prevenir bucles infinitos en iOS.
4.  **Health Engine (`health_engine.js`)**: Biometric synchronization layer for health data processing and trending.
5.  **Santuario Engine (`santuario.js`)**: Immersive sub-system for Three.js 3D materiality and neural-acoustic synthesis.
6.  **System Engine (`system.js`)**: Environmental awareness layer (Hardware profiling, PWA lifecycle, and Atmospheric connectivity).
7.  **Identity Vault**: Built into the State Engine, it manages the persistent "Baptized" identity and cross-session conversational memory.

## UI Paradigm: Liquid Components
All views are isolated ES modules (`js/components/`) that are "painted" onto the DOM at runtime. This allows for isolated lifecycle management and prevents monolithic DOM bloat.
