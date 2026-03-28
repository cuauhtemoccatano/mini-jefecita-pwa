# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.4] - 2026-03-27
### 🔥 Evolución de Inteligencia (Hardware Accelerated)
- **Engine Upgrade**: Migración a **Transformers.js v3** con soporte oficial para **WebGPU**.
- **Hardware Sync**: Detección automática de GPU (Mac/iPhone) para aceleración por hardware.
- **Nuevos Cerebros**:
  - **MASTER**: `Llama-3.2-1B-Instruct` (Optimizado para Mac M2).
  - **ULTRA/PRO**: `Qwen2.5-0.5B-Instruct` (Máximo razonamiento para iPhone 15/14 Pro).
  - **NORMAL**: `SmolLM2-135M-Instruct` (Eficiencia máxima).
- **Feedback Visual**: Porcentaje de descarga real mostrado directamente en el chat.
- **Estabilidad**: Corregidos errores de referencias nulas en `initZenMode`.


## [3.0.1] - 2026-03-26
### Fixed
- **Fluidez de Navegación:** Corregido el bloqueo de la barra de pestañas cuando el Diario está en estado de protección biométrica.

## [3.0.0] - 2026-03-26
### Added
- **Sentient Core:** Transplante de 5 nuevas habilidades locales de inteligencia y privacidad (`ai-analyzer`, `wellally-tech`, etc.).
- **Sentinel Brain:** Lógica de análisis de estrés integrada en el arranque del sistema.
- **Protocolo de Agentes v3.0:** Actualización de `AGENTS.md` para reflejar la nueva consciencia del objeto.

### Changed
- **Identidad de Sistema:** Elevación de todas las capas (sw.js, package.json, index.html) a la versión 3.0.0.

## [2.9.0] - 2026-03-26
### Added
- **Inteligencia Vital:** Sistema de sincronización proactiva con datos de salud (Pasos, Energía, HRV).
- **Interfaz de Cuidado:** Nueva tarjeta dinámica en Inicio que sugiere el Santuario Zen tras detectar estrés.
- **HealthSync Manager:** Motor de recepción de señales vitales vía Atajos de Apple (URL Params).

### Fixed
- **Optimización de Renderizado:** El motor 3D ahora respeta el ciclo de visibilidad de la pestaña.

## [2.8.0] - 2026-03-26
### Added
- **Materia Viva (3D):** Integración de Three.js con cristales geométricos reales en el Santuario.
- **Paisaje Sonoro:** Sintetizador de audio orgánico (Web Audio) con tonos de cristal reactivos.
- **Micro-háptica:** Feedback táctil refinado siguiendo estándares HIG de Apple.

### Changed
- **Ritmo Tipográfico:** Reajuste del espaciado vertical y vertical rhythm en tarjetas de Inicio (v2.8.0 standards).

## [2.6.0] - 2026-03-20
### Added
- Edición inicial "Stability First".
- Local AI integration with SmolLM2.
- Tabbed navigation system.
- Basic HealthKit shortcut integration.
