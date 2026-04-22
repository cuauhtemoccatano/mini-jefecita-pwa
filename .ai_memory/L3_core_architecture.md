# Arquitectura Base (L3)

## Stack Tecnológico
- **UI Framework**: React 19 (App Router ready, utilizando Portales).
- **Build Tool**: Vite 5.4 + Tailwind CSS v4.
- **State Management**: Zustand v5 (Persist middleware para `localStorage`).
- **Intelligence Core**: Transformers.js v4 (HuggingFace) + WebGPU Acceleration.
- **Backend / Realtime**: Supabase (PostgreSQL + RLS + Auth).
- **Animations**: Anime.js 3.2 + Three.js (Auras/Visuals).

## Estructura de Carpetas (src/)
- `components/`: Componentes funcionales de React (Chat, Home, Toasts).
- `js/`: 
  - `store/`: Definición de Zustand stores.
  - `hooks/`: Hooks de sistema (useAI).
  - `engines/`: Lógica legacy (spells, auras, audio).
- `lib/`: Configuraciones de cliente (supabase, env).
- `assets/`: 
  - `css/`: Tailwind directives y estilos globales vanilla.
- `ai_worker.js`: Núcleo de inferencia local.
- `sw.js`: Service Worker (Vite PWA Plugin).

## Patrones de Comunicación (The Bridge)
- **React-to-Legacy**: Uso del objeto global `window.mqa_` como bus de eventos. React inyecta funciones en `window` durante el montaje para permitir que el código vanilla controle modales o estados compartidos.
- **Portals Injection**: Las vistas reactivas se inyectan en contenedores `<section>` preexistentes en `index.html` mediante `createPortal`. Esto preserva el DOM legacy (Auras, TabBar) mientras se actualiza el contenido interior de forma reactiva.

## Jerarquía de Estado
- **Source of Truth**: Zustand (`useStore.js`) es el maestro único de datos.
- **Write-Through Persistence**: Zustand sincroniza automáticamente cambios hacia las keys de `localStorage` (`user_settings`, `health_data`) para mantener compatibilidad con el código legacy que aún depende de `state.js`.
- **Legacy Invalidation**: El código vanilla debe leer de `localStorage` al inicio o mediante eventos, asumiendo que el store es el dueño del dato.

## Ciclo de Vida de Montaje
1. **Fase 1 (React Root)**: `main.jsx` crea el root en `#mqa-react-root`.
2. **Fase 2 (Legacy Boot)**: `initAppLegacy()` se dispara desde un `useEffect` en el componente `App`.
3. **Fase 3 (Portal Sync)**: React detecta los IDs del DOM legacy y proyecta los componentes correspondientes (`HomeView`, `ChatView`).
