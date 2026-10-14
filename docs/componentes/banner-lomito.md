# Banner de Lomito

El aviso festivo que aparece en la portada cuando dos jugadores sacan exactamente los mismos dados en el mismo orden (Cláusula Lomito). Es una pieza propia del juego, no un `Aviso` del núcleo.

**Dónde vive:** `src/pages/index.astro`, dentro de `#lomito-container`. El polling lo inserta en cuanto se activa y dispara el confetti.

## Anatomía

- Tarjeta blanca de 24px de radio, borde violeta al 60 % de 2 px y sombra violeta suave.
- Fondo con un patrón de puntos violeta (SVG en línea).
- «🥪🎉🥪» en `text-5xl`, rebotando.
- **Título** «¡CLÁUSULA LOMITO ACTIVADA!» en violeta, Black 900, `text-2xl` (24 px) y `md:text-3xl`.
- **Quiénes**: «Alexis y Diego rompieron la matrix.», violeta al 90 %, semibold, `text-lg`.
- **Bajada** en gris oscuro al 70 %.

## Movimiento

- Entra con zoom desde el 95 %; los emojis rebotan (`animate-bounce`).
- Confetti de `canvas-confetti` durante 5 s, desde los dos costados.

## Sistema de diseño

Colores de la paleta. El texto violeta, el patrón, la sombra de color, el rebote y el confetti están en los **Permitidos** del perfil POSALANA.
