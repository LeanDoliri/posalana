# Banner de Lomito

El aviso festivo que aparece en la portada cuando dos jugadores sacan exactamente los mismos dados en el mismo orden (Cláusula Lomito). Es una pieza propia del juego, no un `Aviso` del núcleo.

**Dónde vive:** `src/pages/index.astro`, dentro de `#lomito-container`. El polling lo inserta en cuanto se activa y dispara el confetti.

## Anatomía

- Tarjeta blanca de 24px de radio con `shadow-xl`, sobre la página `lutvia-gris` (Permitidos del perfil).
- Borde de 2 px en `lutvia-violeta` como acento gráfico.
- **Título** «🥪 ¡Cláusula Lomito activada!» en `lutvia-violeta`, Black 900, `text-2xl` (24 px) y `md:text-3xl`. Es el único texto violeta del producto (Permitido del perfil: 3.04, solo este título y en 24 px o más). El 🥪 va junto al texto y con `aria-hidden`.
- **Quiénes**: «Alexis y Diego rompieron la matrix.», `lutvia-oscuro`, semibold, `text-lg`.
- **Bajada** en `lutvia-texto-suave`.
- `aria-live="polite"`, para que se anuncie cuando lo inserta el polling.

## Movimiento

- Entra con la animación de entrada (escala desde 95 %).
- Confetti de 5 s con los cuatro colores vivos, leídos de los tokens (`--lutvia-rosa`, `--lutvia-cyan`, `--lutvia-amarillo`, `--lutvia-violeta`). Con `prefers-reduced-motion` no se lanza (`disableForReducedMotion` y un chequeo antes de cargarlo).

## En el historial

Cada día con Lomito muestra un bloque blanco con barra izquierda violeta de 4 px y el texto en `lutvia-oscuro`: «🥪 Cláusula Lomito activada por …». En las reglas, la sección de Lomito usa el mismo borde violeta pero con el título en `lutvia-oscuro` (el Permitido es solo para el banner).

## Cambió respecto a producción

- Se saca el patrón de puntos (un SVG en base64 con `#CC66FF` escrito a mano) y la sombra violeta (`shadow-accent/10`).
- El borde pasa de violeta al 60 % a violeta pleno.
- La línea de emojis «🥪🎉🥪» que rebotaba sola (`animate-bounce`) se va: el 🥪 queda junto al título.
- La línea de los jugadores pasa de violeta al 90 % (texto normal a 3.04) a `lutvia-oscuro`; la bajada, de `foreground/70` a `lutvia-texto-suave`.
- El confetti usa la paleta en lugar de los colores por defecto de la librería.
