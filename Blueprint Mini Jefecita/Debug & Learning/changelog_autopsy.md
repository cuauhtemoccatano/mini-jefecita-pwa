# Debug & Learning: Histórico de Evolución (`CHANGELOG.md`) (Autopsia Quirúrgica)

## 1. Identidad y Propósito Crítico
- **Nombre:** `CHANGELOG.md`
- **Ubicación:** Raíz del Repositorio (`/`)
- **Tipo:** Bitácora de Auditoría (Audit Trail)
- **El "Por Qué":** Si este archivo desaparece, el proyecto sufre de "Amnesia". El equipo perdería la capacidad de correlacionar reportes de bugs de los usuarios con líneas de tiempo de desarrollo. Sin él, es imposible saber en qué versión exacta se eliminó una característica (Deprecated) o cuándo se añadió una dependencia crítica (Added).

---

## 2. Anatomía Funcional (Deep Dive)

### Estado y Datos (Registros Semánticos)
Este archivo no procesa datos en tiempo real, pero almacena un estado inmutable de hitos pasados.
- **SemVer (Versionado Semántico):** Utiliza corchetes `[3.0.4]` seguidos de la fecha ISO `YYYY-MM-DD`. Esto no es estético, es un estándar (Keep a Changelog) que permite que sistemas CI/CD (Integración Continua) puedan leer el archivo con expresiones regulares (Regex) y generar "Release Notes" automáticos en GitHub.
- **Taxonomía Estricta:** 
  - `Added`: Código nuevo, características inéditas. (Ej. *Sentient Core*).
  - `Changed`: Cambios en funcionalidad existente. (Ej. *Identidad de Sistema*).
  - `Deprecated`: Funciones que pronto se eliminarán.
  - `Removed`: Funciones eliminadas permanentemente.
  - `Fixed`: Resolución de bugs. (Ej. *Fluidez de Navegación*).

### Lógica de Métodos (El Documento como Algoritmo)
- **Lectura LIFO (Last In, First Out):** El archivo completo está invertido cronológicamente. Esto obliga al lector (humano o máquina) a procesar siempre el estado más crítico (el presente) en la línea 7 de lectura, evitando que haga scroll por miles de líneas de historia antigua.

### Efectos Secundarios (Side Effects)
- **Sincronización Obligatoria:** Alterar la versión superior en este archivo OBLIGA matemáticamente al desarrollador a ir a `package.json` y a `sw.js` (al `CACHE_NAME`) para modificar las cadenas de versión. Si estos tres archivos no son idénticos numéricamente, la configuración de la PWA estará desincronizada del registro del equipo.

---

## 3. El Mapa de Conexiones (Trazabilidad)

- **De dónde viene la info:**
  - De las descripciones de los *Commits* de Git aprobados y fusionados (Merged) o directamente del resumen de un *Pull Request*.
- **A dónde va la info:**
  - Es consumida por Agentes de IA (Para entender el contexto de por qué el código es como es).
  - Es consumida por los usuarios para saber "Qué hay de nuevo" si se publica como un popup en la UI de Mini Jefecita.

---

## 4. Guía de Intervención (Para Cazar Errores Críticos)

### Puntos de Fallo Comunes (Disonancia Cognitiva)
1. **"El usuario reporta que su iPhone se sobrecalienta desde ayer, pero no toqué nada de UI":** Vas al `CHANGELOG.md`. Buscas los tags de la última versión y lees que bajo la etiqueta `Added`, se implementó **"Hardware Sync: Aceleración por hardware WebGPU"**. Inmediatamente acabas de asociar un síntoma físico del usuario con un cambio en la infraestructura de IA sin tener que leer código C++.
2. **"Conflictos de Fusión (Merge Conflicts) diarios en Git":** Si múltiples desarrolladores añaden viñetas al tope de la lista `[Unreleased]` simultáneamente, Git se romperá porque todos editaron la misma línea 8 del archivo. (*Tip: Las empresas gigantes usan carpetas separadas con fragmentos `.md` que se unen al final para evitar esto*).

### Dónde poner el "Breakpoint" de Auditoría
> [!CAUTION]
> El error más peligroso de un Junior no es escribir mal una línea de código, es escribir un "Fix" en el código y **olvidar documentarlo aquí**.
> Si vas a depurar algo que juraban haber arreglado, haz un `git blame` del archivo. Si el `CHANGELOG` no menciona el arreglo, asume que el arreglo nunca sucedió o fue borrado accidentalmente en un salto de rama.

### Dependencias de Riesgo
- **Falsa Seguridad:** Si el desarrollador es perezoso y agrupa todos los cambios de una semana bajo una sola viñeta que diga "Mejoras de rendimiento", el `CHANGELOG.md` se vuelve basura inútil. La granularidad es vital para el aislamiento de fallos (*Sandboxing*).

---

## 5. Mentoría de Arquitectura

### Análisis de Deuda Técnica (Fragilidad)
Conforme Mini Jefecita viva por años, este archivo crecerá miles de líneas, volviéndose pesado.
**La Fragilidad (El Archivo Interminable):** Eventualmente, cargar la historia de 5 años ralentiza los repositorios. 
**Cómo Escalar:** Un Senior utiliza archivos separados por grandes hitos anuales (`CHANGELOG_2025.md`) o delega la construcción del archivo a "Bots de automatización de releases" (Ej. *Release Please* o *Semantic Release*) que leen los mensajes estructurados de Git (`feat: ...`, `fix: ...`) y construyen este documento automáticamente por ti al final de un Sprint.

### Consejo Senior (La Psicología del Registro)
**Principio Promovido: Documentación Impulsada por Empatía.**
El Changelog no es un volcado de memoria técnica para máquinas. *No debes escribir:* "Cambié el flag `overflow: hidden` a `overflow: auto` en la línea 45 de `style.css`". 
*Un Arquitecto Senior escribe:* "Corregido el bloqueo de la barra de pestañas que paralizaba el desplazamiento táctil en iOS". 
*Por qué importa:* Tú escribes código para ordenadores, pero escribes Changelogs para humanos (Mánagers de Producto, QAs y tu "Yo" del futuro bajo estrés a las 3 AM). Orientar los cambios al impacto y no al proceso es la marca de un profesional empático.
