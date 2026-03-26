---
name: 3d-web-experience (Local)
description: "Directrices para la materia viva 3D en Mini Jefecita. Enfoque en Three.js, WebGL y realismo sensorial sin impacto en batería."
---

# 💎 3D Web Experience: Mini Jefecita Standards

Este manual define cómo debe tratarse la materia tridimensional dentro del objeto digital.

## 1. El Santuario de Cristal (Three.js)
- **Geometría Honesta**: Usar formas geométricas puras (Icosaedros, Octaedros) que representen la estructura del pensamiento de Jade.
- **Materiales**: Preferir `MeshPhongMaterial` con transparencia y brillo (`shininess`) elevado para simular cristal real.
- **Luz**: Usar una luz puntual (`PointLight`) de color `--primary` para dar calidez y una luz ambiental suave.

## 2. Optimización Jony Ive (Rigor Energético)
- **Loop Consciente**: El `requestAnimationFrame` debe estar vinculado a un flag `active`. Si la pestaña no es visible, el motor 3D debe detenerse.
- **Canvas Adherido**: El canvas debe usar `alpha: true` para integrarse con el fondo de la app sin costuras.

## 3. Interacción
- Al tocar la materia 3D, esta debe reaccionar físicamente (cambio de escala o rotación) y emitir una señal sonora.
