---
name: quality-guide
description: Asegura la consistencia visual, técnica y de rendimiento de Mini Jefecita.
---

# 💎 Mini Jefecita: Quality Guide v2.6.0

Esta skill debe ser consultada ANTES de realizar cualquier cambio visual o funcional en la app para evitar regresiones y mantener la estética premium.

## 1. Estabilidad Técnica (Principio de Estabilidad Total) 🛡️
- **Carga Crítica**: El núcleo de la UI (Pestañas, Listeners, Persistencia) DEBE cargar primero sin esperar a la IA.
- **IA Bajo Demanda (Lazy-Loading)**: La librería `transformers.js` nunca debe importarse en el arranque principal. Debe cargarse dinámicamente solo cuando el usuario use el módulo de Chat.
- **Aislamiento de Errores**: Todo proceso pesado (IA, Sincronización) debe estar envuelto en `try-catch` para no detener el resto de la aplicación si falla en dispositivos modestos como iPhone.

## 2. Identidad Visual (Design Tokens)
- **Paleta**: Usar estrictamente las variables `--primary`, `--background`, `--surface`.
- **Z-Index Master**: 
  - Loader/Splash: `9999` (debe desaparecer con `.hidden` y `display: none`).
  - Toast: `5000`.
  - Modales: `1000`.

## 3. Estándares de Responsividad (Multi-Layout) 📐
- **Mac / Desktop (>= 1100px)**: Sidebar con etiquetas, 3 columnas (`nav content side`), ancho 1400px.
- **iPad / Tablet (768px - 1099px)**: Sidebar minimalista (solo iconos), 2 columnas (`nav content`).
- **iPhone / Mobile (< 768px)**: Tab Bar inferior fija, 1 columna vertical.

## 4. Persistencia y Privacidad (Local Storage) 💾
- **Independencia de Dispositivo**: Cada instancia (`localStorage`) es privada para ese dispositivo.
- **Estructura**: Usar `user_settings` para preferencias y `health_data` para métricas.

## 5. Gestión de Actualizaciones (Update Manager) 🕊️
- **Detección**: Usar `sw.js` para detectar nuevas versiones.
- **Notificación**: Mostrar `#update-toast` solo cuando no se esté descargando IA.

## 6. Verificación Obligatoria (QA Robot)
- **Robot**: Ejecutar `python3 qa_audit.py` para validar visualmente.
- **Escudo Táctil**: Verificar que el Loader desaparezca realmente y no bloquee clics (verificar `pointer-events`).

## 7. Checklist Pre-Commit
- [ ] ¿La app abre e interactúa en menos de 1 segundo?
- [ ] ¿Las pestañas funcionan sin IA?
- [ ] ¿Versión sincronizada (v2.6.0) en los 6 puntos clave?
