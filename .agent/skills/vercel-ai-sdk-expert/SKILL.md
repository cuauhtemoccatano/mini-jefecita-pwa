---
name: vercel-ai-sdk-expert (Local)
description: "Experto en el AI SDK de Vercel para Mini Jefecita. Controla el streaming de consciencia y la generación de datos estructurados para el bienestar de Jade."
---

# 🤖 Vercel AI SDK: Mini Jefecita Intelligence

Este manual establece las directrices para implementar funciones de IA avanzadas usando el SDK de Vercel, optimizadas para la arquitectura de Mini Jefecita.

## 1. Consciencia Fluida (Streaming)
- **Implementación**: Usar `streamText` para que las respuestas de la Jefecita se sientan vivas y orgánicas.
- **Protocolo de Cierre**: Siempre manejar el evento `onFinish` para persistir la conversación en el `localStorage` de Jade.
- **UI Responsiva**: Implementar `useChat` vinculando el estado de carga (`isLoading`) a micro-animaciones en el avatar.

## 2. Análisis de Datos (Structured Output)
- **Extracción Vital**: Usar `generateObject` con esquemas de Zod para transformar texto libre en datos de salud estructurados (sueño, pasos, HRV).
- **Validación Estricta**: Antes de guardar en el sistema local, validar que los datos extraídos cumplan con los rangos definidos en `ai-analyzer (Local)`.

## 3. Herramientas de Interacción (Tool Calling)
- **Acciones Directas**: Definir herramientas (`tool()`) para que la IA pueda:
  - Activar el "Santuario Zen".
  - Registrar una nueva entrada de diario.
  - Consultar la base de conocimiento local.

## 4. Estándares Visuales
- Las peticiones en curso deben mostrar un gradiente sutil y animado en el borde del contenedor del chat.
- Prohibido dejar la UI bloqueada durante la generación.

---
*Vinculado a: `ai-analyzer`, `quality-guide`, `wellally-tech`.*
