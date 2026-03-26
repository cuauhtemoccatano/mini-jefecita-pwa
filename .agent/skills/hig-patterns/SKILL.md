---
name: hig-patterns (Local)
description: "Estándares Apple de micro-interacciones para Mini Jefecita: Tacto, Sonido e Identidad."
---

# 🍎 Apple HIG Integration: Mini Jefecita Standards

Diseñamos para el iPhone siguiendo el rigor de Cupertino.

## 1. El Tacto (Haptic Feedback)
- **Toque de Intención**: Usar `vibrate(10)` para clics sutiles.
- **Toque de Éxito**: Usar patrones de doble vibración suave cuando una tarea se completa o un sistema se desbloquea.
- **Evitar el Ruido**: No usar vibración en scroll o acciones repetitivas que fatiguen la mano de Jade.

## 2. El Sonido (Organic Audio)
- **Tonalidad Zen**: Usar síntesis de onda senoidal pura (sine wave) para evitar distorsiones.
- **Fade**: Todo audio debe tener una envolvente de volumen que empiece y termine en silencio absoluto para evitar "pops" digitales.

## 3. La Física
- Respetar siempre el "rebote" nativo de iOS (`-webkit-overflow-scrolling: touch`).
