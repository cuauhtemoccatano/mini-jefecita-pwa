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

## 4. Rendimiento de IA (Potencia Variable)
- **Escalado**: El modelo por defecto en móviles DEBE ser `135M` (Esencial) para evitar crashes por RAM (Jetsam).
- **Selector Manual**: Cualquier cambio de modelo DEBE forzar un `location.reload()` para asegurar que se libere la memoria anterior.
- **Contexto**: El `systemMsg` en `generateLocalAI` debe mantenerse bajo los 200 tokens.

## 5. Integración de Salud (Apple Health)
- **Privacidad**: Los datos de salud (pasos/calorías) solo se guardan en `localStorage`. Nunca se transmiten.
- **Formato**: Los parámetros de entrada esperados son `?steps=X&cals=Y`.
- **Limpieza**: Tras recibir datos de salud, la URL DEBE limpiarse con `history.replaceState` para evitar alertas redundantes.

## 6. Personalización de Usuario
- **Tokens Dinámicos**: Usar siempre la variable `userData.name` en diálogos de IA.
- **Vibe**: El emoji de racha y el color principal deben ser síncronos con el panel de Ajustes.

## 8. Verificación Obligatoria del Agente
- **Prueba en Vivo**: Tras cada despliegue, el Agente DEBE usar el `browser_subagent` para abrir la URL de producción.
- **Checklist de UX**:
  1. Verificar que el saludo sea dinámico (`userData.name`).
  2. Comprobar que el Diario pida Face ID (no entrar directo).
  3. Validar que los botones de Ajustes abran el modal correctamente.
- **Evidencia**: El Agente debe proporcionar un reporte de visualización al usuario.

## 9. Checklist Pre-Commit
- [ ] ¿Se ha actualizado el número de versión en los 4 sitios clave (v1.9.0+)?
- [ ] ¿El nuevo código respeta el bloqueo `isDownloadingAI`?
- [ ] ¿Se han mantenido las transparencias (Glassmorphism)?
- [ ] ¿Funciona el selector de cerebros sin crashear Safari?
