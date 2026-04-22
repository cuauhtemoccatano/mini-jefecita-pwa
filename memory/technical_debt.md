# Memoria Persistente: Deuda Técnica (Technical Debt)

## Áreas de Vigilancia (Alpha Stable)
- **Latencia de Inferencia**: Aunque la inferencia es local, los modelos 'ULTRA' pueden causar bloqueos en dispositivos con poca RAM.
- **Cobertura RAG**: Se requiere expandir la suite de Vitest para automatizar fallos de recuperación semántica en `rag_engine.js`.

## Objetivos de Calidad Próximos
- [ ] Integrar capturas visuales (Playwright) para regresiones de diseño ProMax.
- [ ] Optimizar el peso de los pesos de ONNX mediante cuantización dinámica.
- [ ] Implementar un test de estrés de memoria para el motor RAG.

## Deuda Resuelta (Hitos)
- [x] **2026-04-22**: Eliminación total del acoplamiento DOM/ID mediante React Component Architecture.
- [x] **2026-04-22**: Resolución de la carencia de tests en lógica crítica (Criptografía).
- [x] **2026-04-12**: Purga de estilos monolíticos en favor de Tailwind v4 semántico.
