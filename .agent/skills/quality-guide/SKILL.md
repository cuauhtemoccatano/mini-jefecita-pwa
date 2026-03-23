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
  - Bordes: `1px solid rgba(255, 255, 255, 0.1)`.

## 2. Estándares de Responsividad (Multi-Layout) 📐
- **Mac / Desktop (>= 1100px)**: Sidebar con etiquetas, 3 columnas (`nav content side`), ancho 1400px.
- **iPad / Tablet (768px - 1099px)**: Sidebar minimalista (solo iconos), 2 columnas (`nav content`).
- **iPhone / Mobile (< 768px)**: Tab Bar inferior fija, 1 columna vertical.

## 3. Armonización de Versiones (Protocolo vX.X.X) 🔄
Para cada actualización, es OBLIGATORIO sincronizar la versión en estos 5 puntos:
1.  **`index.html`**: Actualizar la etiqueta `.loader-version`.
2.  **`index.html` (Busting)**: Cambiar el query string del script: `app.js?v=2.2.1`.
3.  **`sw.js`**: Cambiar el `CACHE_NAME` (Ej: `mini-jefecita-v2.2.1`).
4.  **`app.js`**: Actualizar el log de inicio: `console.log('... v2.2.1')`.
5.  **`package.json`**: Incrementar el campo `"version"`.

## 4. Integridad Técnica
- **LocalStorage**: Nunca sobreescribir objetos sin un `JSON.parse` de seguridad.
- **isDownloadingAI**: Bloquear recargas automáticas mientras el Service Worker o el modelo están en descarga.
- **Face ID**: Sección Diario bloqueada por defecto.

## 5. Rendimiento de IA (Selector de Cerebros)
- **Esencial (135M)**: Por defecto para móviles.
- **Maestro (1.8B)**: Recomendado solo para Mac/Desktop.
- **Reload**: Forzar `location.reload()` tras cambiar el nivel de potencia.

## 6. Verificación Obligatoria (QA Robot)
- **Robot**: Ejecutar `python3 qa_audit.py` antes de cualquier commit importante.
- **Limpieza**: El robot debe ejecutar `localStorage.clear()` para garantizar limpieza total.

## 7. Checklist Pre-Commit
- [ ] ¿Versión sincronizada en los 5 puntos clave?
- [ ] ¿Validada responsividad en Mac (Sidebar) e iPhone (Bottom-bar)?
- [ ] ¿Robot de QA pasado con éxito?
