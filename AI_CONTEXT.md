# 🤖 Contexto para Agentes de IA

Si sos un agente de Inteligencia Artificial (AI) leyendo este repositorio, este archivo contiene las **reglas de negocio y arquitectónicas fundamentales** de POSALANA. 
**CRÍTICO:** Si realizás cambios estructurales o modificás la lógica del juego, DEBÉS actualizar este archivo y el `README.md` para mantener la consistencia.

## 1. Lógica del Juego (Core Business Logic)
- **Tirada Diaria:** Los usuarios tiran 4 dados (d6) una vez por día en la ruta `/api/roll`.
- **Asignación de Tareas:** Se comparan los dados secuencialmente (primer dado, luego segundo, tercero y cuarto de menor a mayor). El que saca el tiro más bajo tiene la peor suerte y le toca la peor tarea (Lava - LA). El siguiente "Saca" (SA), el siguiente "Pone" (PO), y los demás se salvan ("Nada" o "NA" con emoji 🎉).
- **Cláusula Lomito:** Si dos usuarios sacan **exactamente los mismos 4 dados en el mismo orden**, se activa la "Cláusula Lomito". 
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
- **Actualización en Tiempo Real (Short Polling):**
  - Implementado en `index.astro` mediante consultas periódicas cada 8 segundos al servidor.
  - **Ahorro de recursos (Page Visibility API):** Si la pestaña se minimiza o pasa a segundo plano, el polling se suspende automáticamente para evitar consultas innecesarias a Turso. Al volver a enfocar la página, se reanuda inmediatamente.
  - **Reemplazo Atómico:** Compara e inyecta únicamente los nodos `#ranking-container` y `#lomito-container` usando `DOMParser` para evitar refrescar la página. Si se detecta un nuevo Lomito, dispara confetti automáticamente.
- **Notificaciones de Discord:**
  - Requiere configurar `DISCORD_WEBHOOK_URL` en las variables de entorno.
  - **Tirada Automática:** Llama asíncronamente a `sendDiscordRoll` en la API de tirada para publicar la tirada (en formato numérico) y un CTA al sitio.
  - **Veredicto Manual:** Llama a `/api/admin/publish-verdict` para publicar la asignación final consolidada de tareas del día.

## 3. UI y Estética (Mandatorio)
- **Diseño Moderno:** El diseño usa una paleta de colores vibrantes (`primary`, `secondary`, `accent`, `background`, `foreground`) definidos en `src/styles/global.css`. Todos los componentes tipo "tarjeta" y la barra de navegación utilizan fondos blancos puros (`bg-white`) con bordes contrastados (`border-foreground/10`) y sombras fluidas para resaltar nítidamente sobre el fondo gris claro del body (`#EDEDED`).
- **Paginación del Historial:** Agrupado por semana calendario (lunes a domingo). Funciona del lado del cliente sin recargar el navegador (`window.history.pushState` y evento `popstate`), con fallback SSR clásico y ancla `#historial-seccion` para auto-scroll.
- **Ordenamiento Interactivo:** La "Tabla Global del Año" permite ordenamiento en cliente al hacer clic en sus cabeceras, actualizando iconos de FontAwesome (`fa-sort`, `fa-sort-up`, `fa-sort-down`) en tiempo real.
- **Responsividad:** Mobile-first obligatorio. En móviles, los dados detallados (`DiceDisplay`) se ocultan inteligentemente en el timeline para mantener el ancho.

## 4. Modo Administrador
- El usuario inicial con rol de `admin` es `ldoliri`.
- Existe una ruta protegida `/admin` que permite:
  - Configurar variables globales (Último Lomito manual).
  - Ver el registro de cambios de contraseña (tabla `password_reset_log`; el reset en `/reset` es libre, sin clave maestra).
  - Borrar usuarios, anular tiradas y cambiar roles.
  - Cargar puntos manualmente (temporadas pasadas).
  - **Gestión de Exenciones:** Crear (con soporte para temporadas personalizadas) y borrar exenciones manuales que sobrescriben las automáticas.
  - **Fotos de Perfil:** El administrador puede cambiar o eliminar (volviendo al avatar por defecto de Dicebear) las fotos de perfil de todos los usuarios directamente haciendo clic en su avatar en el padrón.
  - **Acción Rápida de Discord:** Permite disparar de forma manual la publicación del veredicto del día (quién lava, quién saca, quién pone) directamente al canal de Discord.
---
**Nota para la IA:** No asumas lógicas estándar de e-commerce o blogs. Este es un juego cerrado entre amigos. Mantené el tono lúdico y respetá estrictamente las variables de los dados.
