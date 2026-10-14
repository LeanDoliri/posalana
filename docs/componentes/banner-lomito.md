# Banner de Lomito

El aviso festivo que aparece en la portada cuando dos jugadores sacan exactamente los mismos dados en el mismo orden (Cláusula Lomito). Es una pieza propia del juego, no un `Aviso` del núcleo.

**Dónde vive:** `src/pages/index.astro`, dentro de `#lomito-container`. El polling lo inserta en cuanto se activa y dispara el confetti.

## Anatomía

- Tarjeta blanca de 24px de radio, borde violeta al 60 % y sombra violeta suave.
- Fondo con un patrón de puntos violeta al 10 % (`patron-lomito`, en `global.css`).
- «🥪🎉🥪» grande, que rebota.
- **Título** «¡CLÁUSULA LOMITO ACTIVADA!» en violeta, Black 900, `text-2xl` (24 px) y `md:text-3xl`. Es un Permitido del perfil: violeta como texto (3.04) solo en este título y en 24 px o más.
- **Quiénes**: «Alexis y Diego rompieron la matrix.», gris oscuro, semibold, `text-lg`.
- **Bajada** en `lutvia-texto-suave`.

## Movimiento

- Entra con zoom desde el 95 %; los emojis rebotan (`animate-bounce`).
- Confetti durante 5 s. Con `prefers-reduced-motion`, el rebote lo apaga `@lutvia/ds` y el confetti no se lanza (`disableForReducedMotion`).

## Cambió respecto a producción

- La línea de los jugadores pasa de violeta al 90 % (texto normal a ≈ 2.8) a gris oscuro; la bajada, de `foreground/70` a `lutvia-texto-suave`.
- El patrón de puntos era un SVG en base64 con `#CC66FF` escrito a mano; ahora es un `radial-gradient` sobre el token violeta, con el mismo aspecto.
