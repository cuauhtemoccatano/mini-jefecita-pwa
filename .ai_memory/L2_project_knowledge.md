# Conocimiento del Proyecto (L2)

## Reglas de Arquitectura
- **Estado Centralizado**: Fuente única de verdad en `src/js/store/useStore.js` (Zustand). Prohibido el estado local disperso para datos de usuario.
- **Hybrid-First**: Migración incremental. El código legacy (`main_legacy.js`) coexiste mediante delegación de eventos.
- **Neural Isolation**: El `ai_worker.js` debe ser instanciado una sola vez a través del store para optimizar RAM.
- **Security-as-Code**: Cifrado local-first (AES-GCM). Prohibida la persistencia de llaves maestras en `localStorage`.

## Convenciones de Desarrollo
- **Iconografía Bimodal**: 
  - `lucide` (ESM) para motores legacy.
  - `lucide-react` para componentes funcionales.
- **Estética "Crystal"**: 
  - Glassmorphism: `backdrop-blur-[30px]`.
  - Contraste: Uso de estándares APCA para legibilidad.
  - Auras: Colores dinámicos vinculados al `userData.auraColor`.
- **Nomenclatura**: Prefijo `mqa-` para IDs de portales o raíces de montaje compartido.

## "Mañas" del Código
- **Sincronización a ráfagas**: El store de Zustand usa un suscriptor (`useStore.subscribe`) en la línea 161 que escribe en `localStorage` ante cualquier cambio. No llames a `saveSettings()` de `state.js` desde React; deja que el store maneje el ciclo de vida de persistencia.
- **Detección de Mobile**: La app decide el layout (Sidebar vs Bottom-bar) puramente mediante Media Queries de CSS (`>=768px`). No intentes forzar layouts mediante JS sin consultar `style.css`.
- **Onboarding Portal**: El portal de inicio (`#mqa-onboarding-portal`) tiene `pointer-events: none` por defecto en el HTML. El código legacy debe activarlo (`auto`) solo cuando la ceremonia sea necesaria.
- **Límite de GitHub (100MB)**: El binario de Node (113MB) bloquea el push. **Nunca** rastrear archivos en `.node/`. El proyecto debe instalarse localmente en cada máquina tras el clonado inicial.
