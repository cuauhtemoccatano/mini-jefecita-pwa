---
name: quality-guide
description: Asegura la consistencia visual, técnica y de rendimiento de Mini Jefecita. la frase para activar esta skill es, "run mqa"
---

# 💎 Mini Jefecita: Quality Guide v2.8.0

Esta skill debe ser consultada ANTES de realizar cualquier cambio visual o funcional en la app para evitar regresiones y mantener la estética premium.

## 1. Estabilidad Técnica (Principio de Estabilidad Total) 🛡️
- **Carga Crítica**: El núcleo de la UI (Pestañas, Listeners, Persistencia) DEBE cargar primero sin esperar a la IA o al motor 3D.
- **Lazy-Loading Sensorial**: 
  - `transformers.js` y `three.js` deben cargarse dinámicamente bajo demanda.
  - El motor 3D del Santuario debe "dormir" (detener loop) cuando la pestaña no es visible para ahorrar batería.
- **Aislamiento de Errores**: Todo proceso pesado debe estar envuelto en `try-catch`.

## 2. Identidad Visual y Sensorial (Materials & Senses)
- **Paleta**: Usar estrictamente las variables `--primary`, `--background`, `--surface`.
- **Materia Viva (3D)**: Los objetos tridimensionales deben ser realistas (física simple, sombras suaves) pero ligeros (<1MB de modelos si se usan externos).
- **Paisaje Sonoro**: 
  - El audio zen debe entrar en "fade-in" progresivo.
  - Obligatorio un control físico de volumen o silencio sutil si el Santuario está activo.
- **Háptica (Feedback)**:
  - Usar vibraciones "Transient" para toques y "Success" para alineación.
  - Prohibido abusar; la vibración debe ser un susurro táctil.

## 3. Estándares de Responsividad (Multi-Layout) 📐
- **Mac / Desktop (>= 1100px)**: Sidebar con etiquetas, 3 columnas.
- **iPhone / Mobile (< 768px)**: Desplazamiento fluido nativo (`100dvh`), Tab Bar fija.

## 4. Gestión de Actualizaciones (Evolution Manager) 🕊️
- **Evolución Invisible**: Actualización automática tras 60s de reposo detectado por `IdleManager`.

## 5. Verificación Obligatoria (QA Robot) 🤖
- **Script**: Ejecutar `python3 qa_audit.py` después de cada cambio.

## 6. Checklist de Integridad v2.8.0 🛡️
- [ ] **3D Loop**: ¿El motor 3D se detiene al salir de la pestaña?
- [ ] **Audio Context**: ¿Se desbloquea el audio solo tras interacción de Jade?
- [ ] **Haptics**: ¿La vibración es sutil y selectiva?
- [ ] **Scrolling**: ¿El desplazamiento en iPhone sigue siendo fluido (sin doble scroll)?

---
*Mini Jefecita - Calidad v2.8.0 (Luz y Sonido Edition)*
