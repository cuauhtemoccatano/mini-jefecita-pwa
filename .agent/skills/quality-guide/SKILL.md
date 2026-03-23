---
name: quality-guide
description: Asegura la consistencia visual, técnica y de rendimiento de Mini Jefecita.
---

# 💎 Mini Jefecita: Quality Guide

Esta skill debe ser consultada ANTES de realizar cualquier cambio visual o funcional en la app para evitar regresiones y mantener la estética premium.

## 1. Identidad Visual (Design Tokens)
- **Paleta**: Usar estrictamente las variables `--primary`, `--background`, `--surface` y `--text-secondary`.
- **Glassmorphism**: 
  - Fondos: `rgba(255, 255, 255, 0.05)` o `rgba(0, 0, 0, 0.6)`.
  - Desenfoque: `backdrop-filter: blur(20px);` y `-webkit-backdrop-filter: blur(20px);` (Vital para iOS).
  - Bordes: `1px solid rgba(255, 255, 255, 0.1)`.

## 2. Estándares de Responsividad (Multi-Layout) 📐
Para evitar regresiones en iPad y Mac, respetar esta jerarquía:
- **Mac / Desktop (>= 1024px)**:
  - Layout: `grid-template-areas: "nav content stats"`.
  - Tab Bar: Debe ser lateral (`position: relative !important`), nunca fija abajo.
  - Max-Width: `1400px` para aprovechar pantallas Retina.
- **iPad / Tablet (768px - 1023px)**:
  - Layout: Sidebar minimalista (solo iconos), sin etiquetas de texto.
  - Grid: `grid-template-columns: 80px 1fr`.
- **iPhone / Mobile (< 768px)**:
  - Layout: Tab Bar inferior fija (`position: fixed; bottom: 0`).
  - Todo el contenido en una sola columna centrada.

## 3. Integración Técnica (No Regresiones)
- **Service Worker**: Incrementar versión en `sw.js` (CACHE_NAME) e `index.html` (Query string) en cada push.
- **LocalStorage**: Mantener integridad de objetos (ej: racha de Jade).
- **Face ID**: Diario bloqueado por defecto.

## 4. Rendimiento de IA (Potencia Variable)
- **Móvil**: 135M (Esencial) por defecto.
- **Mac M2**: 1.8B (Maestro) recomendado.
- **Memoria**: `location.reload()` obligatorio tras cambiar de cerebro en Ajustes.

## 5. Verificación Obligatoria del Agente (Protocolo QA)
- **Robot de QA**: Usar `python3 qa_audit.py` para obtener capturas de Mac e iPhone.
- **Limpieza Forzada**: 
  1. Ejecutar `localStorage.clear()` y `caches.delete('mini-jefecita-vX.X.X')` en la consola de prueba.
  2. Forzar recarga con `location.reload(true)`.

## 6. Validación Visual (UI Visual Validator)
- **Z-Index**: Modales en `3000`, Loader en `2000`, Tab-bar Desktop en `area: nav`.
- **Jerarquía**: El saludo dinámico (`userData.name`) es el foco visual principal.

## 7. Preparación para Supabase
- **Local-First**: La app debe funcionar al 100% offline antes de intentar sincronizar.

## 8. Checklist Pre-Commit
- [ ] ¿Diseño validado en Mac (Sidebar) e iPhone (Bottom-bar)?
- [ ] ¿Versión actualizada en todos los archivos (`sw.js`, `index.html`, `package.json`, `app.js`)?
- [ ] ¿Limpieza de caché realizada en la prueba local?
