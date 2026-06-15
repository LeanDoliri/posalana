# 🤖 Contexto para Agentes de IA

Si sos un agente de Inteligencia Artificial (AI) leyendo este repositorio, este archivo contiene las **reglas de negocio y arquitectónicas fundamentales** de POSALANA. 
**CRÍTICO:** Si realizás cambios estructurales o modificás la lógica del juego, DEBÉS actualizar este archivo y el `README.md` para mantener la consistencia.

## 1. Lógica del Juego (Core Business Logic)
- **Tirada Diaria:** Los usuarios tiran 4 dados (d6) una vez por día en la ruta `/api/roll`.
- **Asignación de Tareas:** Se suman los 4 dados. El que saca el número más bajo tiene la peor suerte y le toca la peor tarea (Lava - LA). El siguiente "Saca" (SA), el siguiente "Pone" (PO), y los demás se salvan ("Nada" o "NA" con emoji 🎉).
- **Cláusula Lomito:** Si dos usuarios sacan **exactamente los mismos 4 dados** (misma combinación sin importar el orden), se activa la "Cláusula Lomito". 
  - La UI debe mostrar el emoji de sanguche (`🥪`) en el Navbar y un banner festivo en el Index y en el Historial.
  - El contador de "Días sin Lomito" se reinicia.
  - El usuario especial `lomitotester` sirve exclusivamente para probar esta cláusula duplicando la tirada del administrador.
- **Exenciones (Exemptions):** Quien tenga la mayor cantidad de puntos en una tarea en la temporada `S-1`, queda exento de ella durante toda la temporada `S`.
  - **Cálculo Automático:** Se resuelven dinámicamente comparando los puntajes de la temporada anterior. Si hay empates, todos los empatados se eximen.
  - **Caso Base de Parada Segura:** Si una temporada no tiene tiradas ni puntos cargados a mano, se considera inactiva (`[]`), deteniendo la recursividad histórica para prevenir bucles infinitos en Node.js.
  - **Sobrescritura Manual (Overrides):** Si hay registros en la tabla `exemption` para la temporada actual, se ignoran las automáticas y se aplican las manuales.

## 2. Arquitectura y Tecnologías
- **Frontend/Backend:** Astro con SSR activado. NO es un sitio estático puro.
- **Hosting:** Vercel (Serverless Adapter).
- **Base de Datos:** SQLite alojada en Turso (usando `@libsql/client`).
- **Autenticación:** Sistema propio basado en cookies en Astro, contraseñas hasheadas con `bcryptjs`.
- **Estilos:** Tailwind CSS (versión v4).
- **Componentes Compartidos:**
  - `StatsTable.astro`: Renderiza tablas de estadísticas unificadas (Temporada Actual, Anterior y Año) con parámetros opcionales de color (`theme`) e interactividad (`sortable`).

## 3. UI y Estética (Mandatorio)
- **Diseño Moderno:** El diseño usa una paleta de colores vibrantes (`primary`, `secondary`, `accent`, `background`, `foreground`) definidos en `src/styles/global.css`.
- **Paginación del Historial:** Agrupado por semana calendario (lunes a domingo). Funciona del lado del cliente sin recargar el navegador (`window.history.pushState` y evento `popstate`), con fallback SSR clásico y ancla `#historial-seccion` para auto-scroll.
- **Ordenamiento Interactivo:** La "Tabla Global del Año" permite ordenamiento en cliente al hacer clic en sus cabeceras, actualizando iconos de FontAwesome (`fa-sort`, `fa-sort-up`, `fa-sort-down`) en tiempo real.
- **Responsividad:** Mobile-first obligatorio. En móviles, los dados detallados (`DiceDisplay`) se ocultan inteligentemente en el timeline para mantener el ancho.

## 4. Modo Administrador
- El usuario inicial con rol de `admin` es `ldoliri`.
- Existe una ruta protegida `/admin` que permite:
  - Configurar variables globales (Último Lomito manual y Clave Maestra).
  - Borrar usuarios, anular tiradas y cambiar roles.
  - Cargar puntos manualmente (temporadas pasadas).
  - **Gestión de Exenciones:** Crear (con soporte para temporadas personalizadas) y borrar exenciones manuales que sobrescriben las automáticas.
  - **Fotos de Perfil:** El administrador puede cambiar o eliminar (volviendo al avatar por defecto de Dicebear) las fotos de perfil de todos los usuarios directamente haciendo clic en su avatar en el padrón.

---
**Nota para la IA:** No asumas lógicas estándar de e-commerce o blogs. Este es un juego cerrado entre amigos. Mantené el tono lúdico y respetá estrictamente las variables de los dados.
