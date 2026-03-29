# Blueprint: Entorno y Exclusiones (`.gitignore`)

## Identidad del Componente
- **Nombre:** `.gitignore`
- **Ubicación:** Raíz del Repositorio (`/`)
- **Tipo:** Lista de Control de Acceso (ACL) para Control de Versiones.

---

## 1. Responsabilidad Única (SRP)
Cercar el repositorio de Git, dictando explícitamente qué archivos generados por herramientas locales, dependencias pesadas o secretos de estado (Environment Variables) tienen prohibido viajar hacia el servidor en la nube (GitHub/Vercel).

## 2. Anatomía Funcional
- **Exclusiones de Volumen (`node_modules/`, `/build`)**: Bloquean la subida de miles de archivos de dependencias de Javascript o carpetas generadas por compiladores (como Vite o React) que la nube puede instalar por su cuenta.
- **Exclusiones de Sistema (`.DS_Store`)**: Bloquea la basura metabólica del sistema operativo macOS (archivos ocultos que guardan metadatos de cómo lucía la carpeta en Finder).
- **Exclusiones de Seguridad (`.env`)**: Bloquea los secretos. Garantiza que las claves de acceso a APIs (Supabase, OpenAI) que viven en la computadora del desarrollador nunca queden expuestas en un repositorio público.
- **Exclusiones de Plataforma (`.vercel`)**: Bloquea el estado local del CLI (Command Line Interface) de Vercel.

---

## 3. Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| **El Motor de Git local:** El comando `git add .` lee este archivo *antes* de mover cualquier cosa al Staging Area. | **Auditorías de Seguridad / DevSecOps:** Necesitan que exista un `.env` listado aquí para asegurar que el repositorio cumple con SOC2/ISO 27001 en el manejo de secretos. |

---

## 4. Sugerencia de Refactorización (Evolución de Procesos)

> [!TIP]
> **Defensa en Profundidad Estructurada:**
> Actualmente, la lista de `.gitignore` tiene apenas 6 líneas y está mezclada sin contexto. 
> **Mejora:** Como dictan las buenas prácticas (*Boilerplates* oficiales de GitHub), el archivo debe comentarse y separarse por categorías. Por ejemplo:
> ```gitignore
> # Dependencias
> node_modules/
> 
> # Builds
> /build
> /dist
> 
> # Entornos y Secretos
> .env
> .env.local
> 
> # QA / Testing
> qa_desktop_mac.png
> qa_mobile_iphone.png
> ```
> Omitir las capturas generadas por `qa_audit.py` en el `.gitignore` actual es un riesgo latente de ensuciar el repositorio con imágenes locales del tester.

> [!NOTE]
> **Aprendizaje para el Junior:**
> Este es el archivo "más silencioso pero más letal" del proyecto. Un solo error aquí (por ejemplo, borrar la línea `.env`) y en tu próximo `git push`, las llaves de base de datos de la empresa quedarán expuestas públicamente en GitHub, obligando a revocar tokens de emergencia y posiblemente causando un incidente de seguridad grave (Data Breach). Maneja este archivo con extremo cuidado.
