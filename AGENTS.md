# AGENTS.md

Este archivo guía a los agentes de IA (como Antigravity/Claude Code) que trabajan en este repositorio.

## Descripción General del Proyecto

**Mini Jefecita** es una **PWA (Progressive Web App)** de bienestar personal diseñada con un enfoque minimalista y premium. Está personalizada para una usuaria específica llamada "Jade".

- **Stack Tecnológico**: HTML5, CSS3 (Vanilla), JavaScript (ES6+), Service Workers.
- **Enfoque**: Mobile-First, Offline-ready, instalable como aplicación nativa.
- **Diseño**: Minimalista oscuro, acento verde esmeralda (`#00C4B4`).

## Estructura del Código

- `index.html`: Punto de entrada único (Arquitectura SPA). Contiene el TabView y las secciones de contenido.
- `style.css`: Sistema de diseño. Implementa colores corporativos, tipografía y efectos de glassmorphism.
- `app.js`: Lógica principal del lado del cliente, navegación entre pestañas, saludos dinámicos y registro del Service Worker.
- `manifest.json`: Metadatos de la PWA e iconos para instalación.
- `sw.js`: Service Worker para soporte offline y cacheo de recursos.
- `icons/`: Iconos de la aplicación en diferentes tamaños.

## Módulos de la App

| Pestaña | Estado | Función |
|---------|--------|---------|
| Inicio | Activo | Dashboard con saludo, frase motivacional y tarjetas de estado. |
| Ejercicio | Placeholder | Módulo futuro para registro de actividad física. |
| Avisos | Placeholder | Módulo futuro para gestión de recordatorios inteligentes. |
| Mensajes | Placeholder | Módulo futuro para comunicación rápida. |

## Skills Activas

Este proyecto utiliza las siguientes habilidades especializadas:
- **`progressive-web-app`**: Optimización de carga y estrategias offline.
- **`ai-engineer`**: Implementación de lógica inteligente y asistentes integrados.
- **`design-spells`**: Micro-interacciones y detalles visuales de alta gama.
- **`supabase-automation`**: Sincronización de datos persistentes en la nube.
- **`appdeploy`**: Flujo de despliegue a producción.

## Estándares de Codificación

1. **Vanilla Primero**: No usar frameworks (React/Vue) a menos que se solicite explícitamente. Mantener el código ligero y sin dependencias externas.
2. **Estética Premium**: El diseño debe verse costoso y elegante. Usar sombras suaves, desenfoques y acentos de color Teal.
3. **PWA Compliance**: Cualquier cambio debe mantener la validez del manifest y la funcionalidad del service worker.
4. **Respeto al Contexto**: Jade es el centro de la experiencia. Mantener el tono en español y centrado en la persona.

## Despliegue Local

Para probar la app, utiliza un servidor HTTP local para asegurar que el Service Worker funcione (ej. `python3 -m http.server 8080`).
