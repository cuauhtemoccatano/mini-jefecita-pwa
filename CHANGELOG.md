# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.0] - 2026-03-25
### Added
- **Santuario Zen:** Un nuevo espacio inmersivo con diseño de materiales (cristal y luz) para alivio de sobreestimulación.
- **Interacción Táctica:** Bloques de cristal arrastrables con respuesta háptica y alineación por cuadrícula.
- **Voz del Cuidado:** Sistema de síntesis de voz calmada y empática que acompaña a Jade en el Santuario.
- **Biometría (FaceID/TouchID):** Protección real para el Diario usando el Secure Enclave del iPhone.
- **Evolución Invisible:** Gestor de reposo que actualiza la app automáticamente tras 60s de inactividad o al pasar a segundo plano.

### Fixed
- **Física de Desplazamiento:** Corregido el bloqueo de scroll en iPhone mediante el uso de `100dvh` e inercia nativa de Apple.
- **Conflicto de Capas:** Ajustada la especificidad de CSS para evitar que la vista de mensajes bloquee la pantalla de inicio.
- **Robustez del Loader:** Implementada salida de emergencia física (`display: none`) para el protector de carga.

### Changed
- **Arquitectura de Scroll:** Unificado el desplazamiento en un solo contenedor maestro para mayor fluidez.
- **Gestión de Caché:** Actualizada la identidad del Service Worker a `v2.7.0`.

## [2.6.0] - 2026-03-20
### Added
- Edición inicial "Stability First".
- Local AI integration with SmolLM2.
- Tabbed navigation system.
- Basic HealthKit shortcut integration.
