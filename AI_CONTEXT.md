# 🤖 Contexto para Agentes de IA

Si sos un agente de Inteligencia Artificial (AI) leyendo este repositorio, este archivo contiene las **reglas de negocio y arquitectónicas fundamentales** de POSALANA. 
**CRÍTICO:** Si realizás cambios estructurales o modificás la lógica del juego, DEBÉS actualizar este archivo y el `README.md` para mantener la consistencia.

## 1. Lógica del Juego (Core Business Logic)
- **Tirada Diaria:** Los usuarios tiran 4 dados (d6) una vez por día en la ruta `/api/roll`.
- **Horario de Tirada (desde 13/10/2026):** Solo se puede tirar de **10:00 a 12:30** (GMT-3). Lo valida `/api/roll` (403 fuera de horario; el usuario `tester` queda exceptuado) y el inicio muestra el botón solo con la ventana abierta (el hero `#hero-container` también se refresca por polling). La lógica vive en `src/utils/schedule.ts`; el horario es configurable desde `/admin` (claves `roll_window_start` / `roll_window_end` en `settings`, con defaults en el código).
- **Veredicto Automático:** Al cierre de la tirada se publica solo el veredicto final en Discord (`maybeSendAutoVerdict`). Se dispara desde el middleware en la primera request posterior al cierre (el polling de 8s del inicio lo hace salir casi en el momento) y desde un cron de Vercel (`vercel.json` → `/api/cron/verdict`, protegido con `CRON_SECRET` si está configurado) como red de seguridad. Es idempotente: hace un "claim" atómico sobre `settings.auto_verdict_last_date` y guarda la hora de envío en `auto_verdict_last_at`; si Discord falla, libera el claim para reintentar. **Si ese día nadie tiró (ej. lunes, viernes y fines de semana, que no se juega) no se envía ningún mensaje**: queda registrado como `sin tiradas`. Se puede desactivar desde `/admin` (`auto_verdict_enabled`).
- **Aviso de Horario Nuevo:** `ScheduleNotice.astro` es un pop-up que se muestra en el inicio una vez por día (localStorage) hasta `SCHEDULE_NOTICE_UNTIL` (18/10/2026). Pasada esa fecha deja de montarse solo; se puede borrar junto con la constante.
- **Asignación de Tareas:** Se comparan los dados secuencialmente (primer dado, luego segundo, tercero y cuarto de menor a mayor). El que saca el tiro más bajo tiene la peor suerte y le toca la peor tarea (Lava - LA). El siguiente "Saca" (SA), el siguiente "Pone" (PO), y los demás se salvan ("Nada" o "NA" con emoji 🎉).
- **Cláusula Lomito:** Si dos usuarios sacan **exactamente los mismos 4 dados en el mismo orden**, se activa la "Cláusula Lomito". 
  - La UI debe mostrar el emoji de sanguche (`🥪`) en el Navbar y un banner festivo en el Index y en el Historial.
  - El contador de "Días sin Lomito" se reinicia.
  - El usuario especial `lomitotester` sirve exclusivamente para probar esta cláusula duplicando la tirada del administrador.
  - **Easter egg (no documentado en el README a propósito):** 7 clicks en menos de 3 segundos sobre el badge "días sin lomito" del Navbar (`[data-lomito-badge]`, desktop y mobile) desatan una lluvia de 🥪/🍟 a pantalla completa (Web Animations API, respeta `prefers-reduced-motion`).
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
  - `VerdictFab.astro`: Burbuja flotante (estilo WhatsApp) que se monta en `Layout.astro` solo para usuarios `admin`. Abre un panel de confirmación y llama a `/api/admin/publish-verdict`. Sus eventos se delegan en `document` una única vez para sobrevivir a los swaps del `ClientRouter`.
- **Actualización en Tiempo Real (Short Polling):**
  - Implementado en `index.astro` mediante consultas periódicas cada 8 segundos al servidor.
  - **Ahorro de recursos (Page Visibility API):** Si la pestaña se minimiza o pasa a segundo plano, el polling se suspende automáticamente para evitar consultas innecesarias a Turso. Al volver a enfocar la página, se reanuda inmediatamente.
  - **Reemplazo Atómico:** Compara e inyecta únicamente los nodos `#ranking-container` y `#lomito-container` usando `DOMParser` para evitar refrescar la página. Si se detecta un nuevo Lomito, dispara confetti automáticamente.
- **Notificaciones de Discord:**
  - Requiere configurar `DISCORD_WEBHOOK_URL` en las variables de entorno.
  - **Tirada Automática:** Llama asíncronamente a `sendDiscordRoll` en la API de tirada para publicar la tirada (en formato numérico) y un CTA al sitio.
  - **Veredicto:** La asignación final consolidada de tareas del día se arma en `src/utils/verdict.ts` (`publishDailyVerdict`), compartido entre el veredicto automático del cierre y el manual (`/api/admin/publish-verdict`).
 El mensaje destaca la cantidad de jugadores distintos que tiraron ese día. El bot usa `public/bot-avatar.png` como `avatar_url`.

## 3. UI y Estética (Mandatorio)
- **Sistema de diseño de Lutvia (obligatorio):** POSALANA sigue el perfil «POSALANA» de [LUTVIA-DEV/lutvia-ds](https://github.com/LUTVIA-DEV/lutvia-ds) (`@lutvia/ds`, instalado desde GitHub). `src/styles/global.css` importa `@lutvia/ds/tailwind.css` y `@lutvia/ds/posalana.css`; **no se escribe ningún color a mano** (nada de hex, `rgba()` ni colores de Tailwind como `emerald-500`): se usan las clases `lutvia-*` (`bg-lutvia-cyan`, `text-lutvia-oscuro`, `text-lutvia-texto-suave`, `border-lutvia-oscuro-16`…). Fuera del CSS, los colores salen de `src/utils/tokens.ts` (favicon generado en `src/pages/favicon.svg.ts` y embeds de Discord).
  - Patrones del núcleo como utilidades en `global.css`: `boton` + `boton-principal` (uno por pantalla) / `boton-secundario` (+ `boton-peligro`), `boton-icono`, `etiqueta`, `campo`, `enlace`, `rotulo`. Colores por tarea en `choreStyles` (`src/utils/chores.ts`).
  - Texto en `lutvia-oscuro` o `lutvia-texto-suave`; cyan y amarillo nunca como texto. Matices de colores vivos al 15 % solo en chips, avatares y etiquetas, con texto oscuro. Nada de texto por debajo de `text-mini` (.75rem).
  - Radios: 24px (`rounded-3xl`) y `shadow-xl` solo en las tarjetas blancas sobre la página gris; filas, campos y bloques clicables en `rounded-lutvia-radio-chico`; bloques internos en `rounded-lutvia-radio`; píldoras en `rounded-lutvia-pildora`, siempre de una línea.
  - Íconos de Font Awesome con `aria-hidden="true"`; botones de solo ícono con `aria-label` y `title`. Foco: anillo rosa de 2 px (global). Toda animación se apaga con `prefers-reduced-motion`.
  - Las piezas propias (dados, fila del ranking, banner de Lomito) tienen ficha en `docs/componentes/`. Si algo no puede cumplir el sistema, se propone como Permitido por PR a lutvia-ds; no se inventa un color.
- **Paginación del Historial:** Agrupado por semana calendario (lunes a domingo). Funciona del lado del cliente sin recargar el navegador (`window.history.pushState` y evento `popstate`), con fallback SSR clásico y ancla `#historial-seccion` para auto-scroll.
- **Selector de Temporadas Anteriores:** En `history.astro`, la tarjeta "Temporadas Anteriores" (al lado de "Temporada Actual", mismo diseño: título en una fila y temporada debajo) lista todas las temporadas cerradas con tiradas o puntos manuales (`getPastSeasonsWithData`), por defecto la más reciente. Cada temporada muestra su tabla y sus exenciones (`getExemptionsForSeason`). Todo se renderiza en SSR y un dropdown propio (listbox accesible con teclado, no `<select>` nativo) solo alterna cuál se ve (sin recargar).
- **Ordenamiento Interactivo:** La "Tabla Global del Año" permite ordenamiento en cliente al hacer clic en sus cabeceras, actualizando iconos de FontAwesome (`fa-sort`, `fa-sort-up`, `fa-sort-down`) en tiempo real.
- **Formato de Fechas:** Toda fecha visible se muestra como día, mes y año (`DD/MM/YYYY`) con `formatDate` de `src/utils/date.ts`. En la base, las URLs (`?week=`) y las comparaciones internas se siguen usando `YYYY-MM-DD`.
- **Página 404:** `src/pages/404.astro` muestra un "tiro inválido" 4 · 👻 · 4 (el dado del medio es un fantasma) con botón para volver al inicio y un "Tirar de nuevo" que solo re-anima los dados (cliente, sin requests).
- **Responsividad:** Mobile-first obligatorio. En móviles, los dados detallados (`DiceDisplay`) se ocultan inteligentemente en el timeline para mantener el ancho.

## 4. Modo Administrador
- El usuario inicial con rol de `admin` es `ldoliri`.
- Existe una ruta protegida `/admin` que permite:
  - Configurar variables globales (Último Lomito manual, horario de tirada y veredicto automático on/off, con el estado de la ventana y del veredicto de hoy).
  - Ver el registro de cambios de contraseña (tabla `password_reset_log`; el reset en `/reset` es libre, sin clave maestra).
  - Borrar usuarios, anular tiradas y cambiar roles.
  - Cargar puntos manualmente (temporadas pasadas).
  - **Gestión de Exenciones:** Crear (con soporte para temporadas personalizadas) y borrar exenciones manuales que sobrescriben las automáticas.
  - **Fotos de Perfil:** El administrador puede cambiar o eliminar (volviendo al avatar por defecto de Dicebear) las fotos de perfil de todos los usuarios directamente haciendo clic en su avatar en el padrón.
  - **Acción Rápida de Discord:** Permite disparar de forma manual (antes del cierre o como reenvío) la publicación del veredicto del día (quién lava, quién saca, quién pone) directamente al canal de Discord.
 Además está disponible desde cualquier página mediante la burbuja flotante `VerdictFab`.
---
**Nota para la IA:** No asumas lógicas estándar de e-commerce o blogs. Este es un juego cerrado entre amigos. Mantené el tono lúdico y respetá estrictamente las variables de los dados.
