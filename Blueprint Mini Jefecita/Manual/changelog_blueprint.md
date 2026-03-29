# Blueprint: Histórico de Evolución (`CHANGELOG.md`)

## Identidad del Componente
- **Nombre:** `CHANGELOG.md`
- **Ubicación:** Raíz del Repositorio (`/`)
- **Tipo:** Documentación Histórica y Control de Versiones Semánticas (SemVer).

---

## 1. Responsabilidad Única (SRP)
Mantener un registro cronológico, estructurado y legible por humanos de todos los cambios notables en el proyecto, sirviendo como la "memoria" oficial para rastrear cuándo se introdujeron características, se arreglaron bugs o se rompieron compatibilidades.

## 2. Anatomía Funcional
- **Basado en Estándares:** Sigue rígidamente el formato de [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (Mayor.Menor.Parche).
- **Categorización Categórica:** Divide los eventos en bloques predefinidos (Ej: `### Added`, `### Changed`, `### Fixed`), evitando mezclar la creación de una función (Added) con la reparación de un error pasado (Fixed).
- **Cronología Inversa:** La versión más reciente (`v3.0.4`) siempre se ubica en la parte superior, garantizando que el lector encuentre el estado actual del proyecto inmediatamente al abrir el archivo.

---

## 3. Mapa de Dependencias

| Necesita de otros | Otros necesitan de él |
| :--- | :--- |
| **Flujo de Git:** Su contenido debe reflejar con precisión los commits o Pull Requests integrados en la rama principal. | **Release Managers / QA:** Necesario para saber qué auditar antes de lanzar a producción. |
| **`package.json`:** Debe coincidir con la variable `"version"` definida en la configuración del proyecto. | **Desarrolladores Junior/AI:** Lo leen para entender por qué ciertas líneas de código legado existen. |

---

## 4. Sugerencia de Refactorización (Evolución de Procesos)

> [!TIP]
> **Vínculos Dinámicos a Commits (Commit Links):**
> Actualmente, las versiones (`## [3.0.4]`) son simples encabezados de texto. 
> **Mejora:** En la parte inferior del archivo, se recomienda agregar "Enlaces de Definición" que apunten directamente a la vista de "Release" o a la comparación de un Diff en GitHub (Ej: `[3.0.4]: https://github.com/usuario/repo/compare/v3.0.1...v3.0.4`). Esto permite que un desarrollador haga clic en una versión y vea línea por línea el código real manipulado, complementando la historia.

> [!NOTE]
> **Aprendizaje para el Junior:**
> Este documento te salvará cuando haya un incendio. Imagina que el cliente dice: *"El sonido 3D ya no funciona"**. En lugar de mirar 5,000 líneas de código a ciegas, abres el Changelog. Le preguntas a la persona: *"¿Cuándo dejó de funcionar?"*. Te responden *"El Miércoles"*. Vas al Changelog y ves que el miércoles se lanzó la v2.9.0 donde el **motor 3D modificó su ciclo de visibilidad (`### Fixed`)**. Inmediatamente sabes qué módulo del proyecto causó la regresión.
