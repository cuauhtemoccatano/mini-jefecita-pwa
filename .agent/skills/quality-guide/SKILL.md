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

## 2. Consistencia UI
- **Pestañas**: No exceder de 5 iconos en el Tab Bar inferior.
- **Botones**: Radio de borde estándar de `12px` para pequeños y `24px` para tarjetas grandes.
- **Transiciones**: Todas las animaciones deben ser sutiles (`0.3s ease-out`).

## 3. Integridad Técnica (No Regresiones)
- **Service Worker**: Cada vez que se toque `app.js`, `style.css` o `index.html`, se DEBE incrementar la versión en `sw.js` (CACHE_NAME) e `index.html` (Query string).
- **LocalStorage**: Nunca sobreescribir objetos completos sin hacer un `JSON.parse` previo para mantener datos existentes (ej: racha de Jade).
- **Face ID**: La sección de Diario DEBE estar bloqueada por defecto (`isDiarioUnlocked = false`).

## 4. Rendimiento de IA (Invisible AI)
- **Escalado**: No asignar modelos de más de 2B parámetros para evitar cierres inesperados en Safari iOS.
- **Contexto**: El `systemMsg` en `generateLocalAI` debe mantenerse bajo los 200 tokens para que el iPhone responda rápido.

## 5. Checklist Pre-Commit
- [ ] ¿Se ha actualizado el número de versión en los 4 sitios clave (package, index, sw, app)?
- [ ] ¿La interfaz se ve bien en un iPhone 14 Pro vertical (Safe Areas)?
- [ ] ¿El nuevo código respeta la "IA Invisible" (logEvent)?
- [ ] ¿Se han mantenido las transparencias (Glassmorphism)?
