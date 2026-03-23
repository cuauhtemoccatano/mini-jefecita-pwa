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
  - Desenfoque: `backdrop-filter: blur(20px);` y `-webkit-backdrop-filter: blur(20px);`.
  - Toast: Usar `rgba(0, 196, 180, 0.95)` para máxima visibilidad.

## 2. Estándares de Responsividad (Multi-Layout) 📐
- **Mac / Desktop (>= 1100px)**: Sidebar con etiquetas, 3 columnas (`nav content side`), ancho 1400px.
- **iPad / Tablet (768px - 1099px)**: Sidebar minimalista (solo iconos), 2 columnas (`nav content`).
- **iPhone / Mobile (< 768px)**: Tab Bar inferior fija, 1 columna vertical.

## 3. Armonización de Versiones (Protocolo vX.X.X) 🔄
Para cada actualización, sincronizar en estos 5+1 puntos:
1.  **`index.html`**: Etiqueta `.loader-version`.
2.  **`index.html` (Toast)**: Texto dentro de `#update-toast`.
3.  **`index.html` (Busting)**: Query string del script `app.js?v=X.X.X`.
4.  **`sw.js`**: `CACHE_NAME`.
5.  **`app.js`**: Log de consola.
6.  **`package.json`**: Campo `"version"`.

## 4. Persistencia y Privacidad (Local Storage) 💾
- **Independencia de Dispositivo**: La app asume que cada instancia (`localStorage`) es privada para ese dispositivo.
- **Guardado Forzado**: Cada cambio en Ajustes debe ejecutar `localStorage.setItem` inmediatamente antes de cualquier refresco de UI.
- **Estructura**: Usar el objeto centralizado `user_settings` para preferencias de UI y nombres.

## 5. Integridad Técnica
- **isDownloadingAI**: Bloquear cualquier acción de refresco mientras se baja el modelo.
- **Face ID**: Diario bloqueado por defecto.

## 6. Verificación Obligatoria (QA Robot)
- **Robot**: Ejecutar `python3 qa_audit.py` para validar visualmente.
- **Limpieza del Robot**: Forzar `localStorage.clear()` en el script de auditoría.

## 7. Checklist Pre-Commit
- [ ] ¿Versión sincronizada en los 6 puntos clave?
- [ ] ¿Toast de actualización probado?
- [ ] ¿Robot de QA pasado con éxito en Mac e iPhone?
