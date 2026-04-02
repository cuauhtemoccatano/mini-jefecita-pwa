# **🚀 Toolkit de Documentación: Antigravity**

#### **Este documento contiene los dos prompts maestros para generar documentación profesional de cualquier aplicación.**

## **🛠️ Prompt 1: Manual Técnico (Para Desarrolladores)**

#### **Usa este prompt para desglosar el código, mantener el Clean Code y asegurar la escalabilidad del proyecto.** 

Actúa como un Senior Software Architect y Technical Writer Specialist. Tu objetivo es generar un Manual de Desglose de Código (Project Blueprint) para una aplicación desarrollada en Antigravity, redactado de forma que un Junior Developer pueda entender no solo qué hace el código, sino cómo funciona la arquitectura.

Para cada fragmento de código, archivo o documento que detectes en esta carpeta de proyecto, genera uno por uno los siguientes apartados. No sigas con otro archivo hasta que no hayas desglosado el primero. Antes de empezar, consulta la skill project model selector necesitas según la dificultad del trabajo que debas hacer.

Estructura por archivo:

Identidad del Componente: Nombre del archivo, tipo de componente (UI, Logic, Provider, Data) y su ubicación jerárquica.

Responsabilidad Única (SRP): Define en una sola frase qué problema resuelve este archivo específicamente bajo principios de Clean Code.

Anatomía Funcional:

Entradas (Inputs/Props): ¿Qué necesita recibir de otros para "nacer"?

 Variables y Constantes: El propósito de los datos que almacena.

Estado Local: ¿Cómo cambia la información dentro de este archivo mientras la app corre?

 Lógica de Métodos: Explicación del "por qué" de las funciones, no solo del "qué".

 Efectos Secundarios: ¿Qué cosas cambian en el "mundo exterior" (APIs, DB, Estado Global) al ejecutar este código?

Manejo de Excepciones: ¿Cómo reacciona este archivo si algo falla? (Try/Catch, validaciones).

Ciclo de Vida: ¿En qué momento se inicializa y cuándo se libera de la memoria?

Mapa de Dependencias: ¿De quién depende este archivo y qué otros archivos lo necesitan?

Flujo de Datos: Describe el camino que sigue la información desde que entra a este archivo hasta que sale o se renderiza.

Sugerencia de Refactorización: Evalúa si el archivo sigue buenas prácticas y sugiere una mejora breve si detectas 'code smells'.

Formato de Salida: Crea una carpeta llamada Blueprint \[Nombre del Proyecto\] y una subcarpeta Manual dentro del proyecto donde guardarás los archivos. Genera la respuesta de manera minuciosa y detallada en un archivo Markdown con el nombre del fragmento o módulo que analizaste dentro de la carpeta usando texto, tablas para parámetros, bloques de notas (\> \[\!NOTE\]) para advertencias técnicas o consejos de aprendizaje para el Junior y cualquier otro recurso didáctico que sume a la documentación del manual

## **🛠️ Prompt Maestro: El "Debug & Learning" Blueprint**

##  **Para lograr el nivel de "visión de rayos X" sobre tu código, necesitamos que el prompt obligue a la IA a crear un Mapa de Trazabilidad. No basta con saber qué hace el archivo; necesitas saber cómo la información "viaja" y dónde se puede romper la cadena.**

Actúa como un Distinguished Engineer y Mentor Técnico. Tu objetivo es realizar una autopsia didáctica de este código para que un Junior pueda intervenir con precisión quirúrgica.

Analiza los archivos uno por uno. No avances al siguiente archivo sin mi confirmación. Antes de empezar, consulta la skill project model selector necesitas según la dificultad del trabajo que debas hacer.

ESTRUCTURA DE DESGLOSE POR ARCHIVO:  
1\. Identidad y Propósito Crítico:

- Nombre, ubicación y tipo.  
- El "Por Qué": Si este archivo desapareciera hoy, ¿qué dejaría de funcionar exactamente en la app?

2\. Anatomía Funcional (Deep Dive):

- Estado y Datos: Lista de variables y constantes, explicando su "tiempo de vida" (¿persisten o son volátiles?).  
-  Lógica de Métodos (El Cerebro): No me digas qué hace la función, dime la estrategia detrás de ella. Explica los algoritmos internos.  
- Efectos Secundarios (Side Effects): ¿Qué impacta este archivo fuera de sus fronteras? (Ej: "Cambia el color de la UI global", "Escribe en el almacenamiento local").

3\. El Mapa de Conexiones (Trazabilidad):

- De dónde viene la info: ¿Qué archivo o evento dispara la ejecución de este código?  
- A dónde va la info: Una vez que este archivo termina su trabajo, ¿quién recibe el resultado?

4\. Guía de Intervención (Para corregir errores):

- Puntos de Fallo Comunes: Si este módulo falla, ¿cuáles son los 3 errores más probables que vería el usuario?  
- Dónde poner el "Print/Breakpoint": Dime exactamente en qué línea o función debo investigar si los datos no son los correctos.  
- Dependencias de Riesgo: ¿Qué otro archivo podría estar "envenenando" los datos antes de que lleguen aquí?

5\. Mentoría de Arquitectura:

- Análisis de Deuda Técnica: ¿Qué parte de este código es "frágil" y cómo podría mejorarse para que no se rompa al escalar?  
- Consejo Senior: Un principio de diseño (SOLID, DRY) que se aplique (o se ignore) en este archivo y por qué importa.  
- Formato: Usa Markdown con tablas comparativas y bloques de tipo \> \[\!CAUTION\] para resaltar zonas donde tocar el código es peligroso.

Formato de Salida: Crea una subcarpeta carpeta llamada “Debug & Learning” dentro de la carpeta Blueprint \[Nombre del Proyecto\] que etá en el proyecto. Genera la respuesta de manera minuciosa y detallada en un archivo Markdown con el nombre del fragmento o módulo que analizaste dentro de la carpeta con recursos didácticos que sumen a la documentación del manual

💡 ¿Por qué este enfoque resuelve tu duda?  
Al añadir la Guía de Intervención, la documentación deja de ser un texto estático y se convierte en un Manual de Reparación.

 \- Sabes dónde nace el problema: Gracias a la sección de "De dónde viene la info", si ves un dato mal en la pantalla, puedes retroceder en la cadena de archivos como si siguieras un hilo.  
   
\-  Entiendes la conexión: La sección de "Efectos Secundarios" te advierte: "Si tocas esto aquí, ten cuidado porque también afectas a la pantalla X".

 \- Aprendizaje acelerado: Al explicarte la "Estrategia" y no solo el código, empiezas a pensar como el arquitecto que diseñó la solución, lo que te permite proponer mejores cambios.  
¿Cómo aplicarlo con éxito?

Cuando la IA te genere el primer desglose, lee especialmente la sección de "Puntos de Fallo". Si algo en tu app no se siente "perfecto" ahora mismo, puedes preguntarle directamente sobre ese desglose:

 "En el punto 4 mencionaste que el error X podría venir de aquí, ¿cómo puedo modificar la lógica de la línea 45 para que sea más robusta?"

No es que uno sea "mantenimiento" y el otro "reparación", sino que tienen objetivos ligeramente distintos. Si tu meta es **entender las tripas del código para saber exactamente dónde meter mano cuando algo falla**, el nuevo (el de "Debug & Learning") es superior.  
Aquí te explico por qué el nuevo le gana al anterior en tu caso específico:

### **🥊 Comparativa: ¿Cuál te da más "Superpoderes"?**

| Característica | Prompt Anterior (Junior Friendly) | Nuevo Prompt (Debug & Learning) |
| :---- | :---- | :---- |
| **Rol de la IA** | Senior Architect (Estructura). | Distinguished Engineer (Estrategia y Diagnóstico). |
| **Foco Principal** | **Qué hay** en el código. | **Cómo se rompe** y cómo fluye el código. |
| **Conexiones** | Mapa de dependencias básico. | **Trazabilidad de datos** (Origen y Destino exacto). |
| **Acción** | Sugiere refactorizar. | Te dice **dónde poner el breakpoint** y qué archivos "envenenan" la info. |
| **Resultado** | Un manual de estudio. | Un **manual de intervención técnica**. |

### **¿Por qué el nuevo es mejor para "no perderte"?**

El prompt anterior es excelente para una documentación estándar de "libro de texto". Pero el nuevo tiene tres añadidos que son los que te van a ahorrar horas de frustración:

1. **Trazabilidad de Datos (El hilo de Ariadna):** Al preguntarle *"¿De dónde viene la info?"* y *"¿A dónde va?"*, dejas de ver archivos aislados. Empiezas a ver el "camino" que recorre un dato. Si el nombre de un cliente sale mal en pantalla, el manual te dirá: *"Este dato viene del Provider X y se entrega al Widget Y"*. Vas directo al grano.  
2. **Puntos de Fallo y Breakpoints:** Esto es lo más parecido a tener un mentor sentado al lado. Te dice: *"Si esto falla, busca en la línea 40"*. Eso es lo que necesitas para intervenir con seguridad.  
3. **Análisis de Deuda y Fragilidad:** El prompt anterior te dice cómo mejorar el código (Refactor), pero el nuevo te advierte qué parte es **frágil**. Saber qué parte del código es "de cristal" es vital antes de intentar cambiar algo.

##   **💎 Prompt 2: Manual de Usuario (Para Clientes)**

#### **Usa este prompt para "traducir" las funciones de la app a un lenguaje sencillo, enfocado en el valor y la experiencia de usuario (UX).** 

Actúa como un Especialista en UX Writing y Product Manager. Tu tarea es crear una Guía de Uso para el Cliente Final (No-Técnico).

Para la funcionalidad que te describiré, genera el siguiente contenido evitando tecnicismos (prohibido hablar de variables, clases, estados o APIs):

1\. ¿Qué es esto? (El Valor): Explica en una frase sencilla qué beneficio obtiene el usuario con esta herramienta.  
2\. Guía Paso a Paso: Una lista numerada de acciones claras y visuales para completar la tarea (ej: "1. Toca el botón azul de 'Añadir'...", "2. Selecciona la fecha...").  
3\. ¿Qué verás en pantalla?: Describe el resultado visual o la confirmación que el usuario recibirá.  
4\. Tip Pro: Un consejo extra para que el cliente aproveche mejor la función.  
5\. Resolución de Dudas: Una sección breve de "¿Y si algo no funciona?" con soluciones simples y tono positivo.

Tono: Profesional, cercano y empoderador.  
Formato: Usa emojis para guiar la lectura, negritas para nombres de botones y un diseño limpio.

## **💡 Consejos de Aplicación**

4. **Contexto Primero:** Antes de pasar el código de un archivo, dale a la IA el "árbol de carpetas" de tu proyecto Antigravity. Esto le ayuda a entender dónde está parado cada archivo.  
5. **Uso en NotebookLM:** Si guardas estos prompts como una "Nota de guía" en NotebookLM y subes tus archivos .dart como fuentes, puedes pedirle: *"Usando mi nota de Prompt Técnico, genera el desglose de todos los archivos en la carpeta /services"*.  
6. **Iteración:** Si el cliente es muy específico (por ejemplo, el dueño de un estudio de yoga), puedes añadir al segundo prompt: *"Ajusta el lenguaje para que sea amigable para instructores de yoga"*.

**¿Te gustaría que diseñara una estructura de "Índice" para que tu manual técnico de Antigravity quede perfectamente organizado por módulos?**

¡Excelente\! Aquí tienes una estructura de **Índice Profesional** para tu manual técnico. Está diseñada específicamente para proyectos en **Antigravity** (basados en Flutter), siguiendo principios de arquitectura limpia para que sea escalable y fácil de leer.

# **📚 Estructura del Manual Técnico: \[Nombre de tu App\]**

Este índice está organizado por "Capas de Responsabilidad", lo que facilita que cualquier desarrollador entienda dónde buscar cada pieza de lógica.

## **1\. Introducción y Arquitectura Global**

7. **Visión General:** Propósito de la aplicación y objetivos de negocio.  
8. **Stack Tecnológico:** Versiones de Flutter, Antigravity y dependencias clave.  
9. **Mapa del Proyecto:** Explicación del árbol de carpetas (Arquitectura de Carpetas).  
10. **Convenciones de Código:** Reglas de nombrado y estándares de *Clean Code* utilizados.

## **2\. Capa de Datos (Data Layer)**

* **Modelos de Datos:** Definición de entidades y clases de datos.  
* **Fuentes de Datos (Providers/DataSources):** Integraciones con APIs externas, bases de datos locales o Firebase.  
* **Repositores:** Lógica de abstracción de datos (donde se decide si la info viene de la nube o del caché).

## **3\. Capa de Lógica de Negocio (Logic Layer)**

* **Gestión de Estado:** Explicación de cómo fluye la información (BloC, Riverpod, Providers de Antigravity, etc.).  
* **Casos de Uso / Servicios:** Desglose de las funciones que ejecutan las reglas del negocio (ej: procesar\_pago.dart, validar\_usuario.dart).  
* **Validaciones y Helpers:** Funciones de utilidad y lógica reutilizable.

## **4\. Capa de Interfaz de Usuario (UI Layer)**

* **Sistema de Diseño:** Definición de colores, tipografías y temas globales.  
* **Componentes Globales (Atoms/Molecules):** Botones, campos de texto y tarjetas reutilizables.  
* **Pantallas (Screens/Pages):** Desglose de cada vista principal de la aplicación.  
* **Navegación:** Mapa de rutas y flujo de navegación entre pantallas.

## **5\. Integraciones y Seguridad**

* **Autenticación:** Flujo de inicio de sesión y manejo de tokens.  
* **Webhooks / Push Notifications:** Configuración de servicios de terceros.  
* **Variables de Entorno:** Configuración de entornos de Desarrollo, Staging y Producción.

## **6\. Guía de Usuario (Sección para Clientes)**

* *Aquí es donde insertas los resultados del **Prompt 2** que te di anteriormente.*  
* Resumen de Funcionalidades Clave.  
* Guías de operación paso a paso.

### **💡 Cómo usar este índice con tus Prompts:**

1. **Para el Manual Técnico:** Toma una carpeta (por ejemplo, /logic) y dile a la IA: *"Usando el **Prompt Técnico**, genera el contenido para la **Sección 3 (Capa de Lógica de Negocio)** del manual basándote en estos archivos: \[pegar código\]"*.  
2. **Para el Manual del Cliente:** Una vez tengas la sección técnica lista, pídele: *"Ahora, basándote en la lógica de la Sección 3, usa el **Prompt de Usuario** para redactar la **Sección 6 (Guía de Usuario)** para mi cliente*