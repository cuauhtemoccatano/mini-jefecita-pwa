# System Architecture: Neural Modular Orchestration (v3.7.2)

Mini Jefecita v3.7.2 operates on a modern, Vite-powered architecture designed for industrial scalability, high-fidelity performance, and professional-grade PWA deployment.

## The Build System (Vite + Workbox)
The application is orchestrated by **Vite**, utilizing **vite-plugin-pwa** with an `injectManifest` strategy. This allows for fine-grained control over the Service Worker while benefiting from modern bundling, dead-code elimination, and environmental variable injection.

## The Master Orchestrator (`src/main.js`)
The application entry point is a centralized orchestrator. It manages the lifecycle of specialized engines, performs the "Neural Handshake", and handles the **"Awakening Ceremony"** for untethered identities. It is native ESM and serves as the root of the dependency graph.

## Core Engines (`src/js/`)
1.  **State Engine (`state.js`)**: Single source of truth for global data, persistence, and reactive settings synchronization.
2.  **AI Engine (`ai_engine.js`)**: Neural core that manages the Transformers.js background worker, model tiering, and the global Command Portal.
3.  **UI Engine (`ui_engine.js`)**: Master renderer that orchestrates the dynamic injection of "Liquid Components". Includes the **Atmosphere Matrix** (renamed from Spectral Core) for autonomous aura synchronization with a global recursion guard.
4.  **Health Engine (`health_engine.js`)**: Biometric synchronization layer for health data processing and trending.
5.  **Santuario Engine (`santuario.js`)**: Immersive sub-system for Three.js 3D materiality using dynamic ESM imports.
6.  **RAG Engine (`rag_engine.js`)**: Retrieval Augmented Generation layer integrated with the **Supabase SDK** for semantic memory persistence and cloud synchronization.
7.  **System Engine (`system.js`)**: Environmental awareness layer (Hardware profiling, PWA lifecycle, and Atmospheric connectivity).

## UI Paradigm: Liquid Components (`src/components/`)
All views are isolated ES modules that are imported by the UI Engine. This structure prevents monolithic DOM bloat and allows for efficient chunking during the build process.

## Environment & Security
- **Strict Isolation**: Uses `COOP` (same-origin) and `COEP` (require-corp) headers for WebGPU support.
- **Environment Management**: Centralized in `src/lib/env.js`, leveraging Vite's `import.meta.env` for secure credential handling.
