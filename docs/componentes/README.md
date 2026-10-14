# Componentes de POSALANA

POSALANA usa el sistema de diseño de Lutvia ([LUTVIA-DEV/lutvia-ds](https://github.com/LUTVIA-DEV/lutvia-ds), perfil «POSALANA»). Esta carpeta documenta las piezas propias del juego que **no** tienen ficha en el sistema; allá viven la tarjeta de la tirada (`PosalanaTarjetaTirada`), el botón de tirar (`PosalanaBotonTirar`) y los patrones del núcleo (`Boton`, `Etiqueta`, `Campo`, `Aviso`).

| Ficha | Pieza | Dónde vive |
|---|---|---|
| [Dados](dados.md) | Los cuatro dados de una tirada | `src/components/DiceDisplay.astro` |
| [Fila del ranking](fila-ranking.md) | Una tirada del día en el ranking de la portada | `src/pages/index.astro` (`#ranking-container`) |
| [Banner de Lomito](banner-lomito.md) | El aviso festivo de la Cláusula Lomito | `src/pages/index.astro` (`#lomito-container`) |

## Cómo se aplica el sistema

- `src/styles/global.css` importa `tailwindcss`, `@lutvia/ds/tailwind.css` y `@lutvia/ds/posalana.css`. Los nombres de siempre (`primary`, `secondary`, `accent`, `background`, `foreground`) los define `posalana.css` apuntando a los tokens (rosa, cyan, violeta, gris y gris oscuro). No hay ningún color escrito a mano: lo que lleva transparencia en el CSS usa `color-mix()` sobre un token.
- El diseño del sitio (tarjetas, radios, sombras, animaciones y hovers) es el de siempre. Lo que cambió es el color del texto, para cumplir la regla de contraste:
  - Texto principal en `text-foreground`; texto secundario en `text-lutvia-texto-suave` (en lugar de `foreground/40` a `/70`).
  - Ningún texto en cyan, rosa o violeta, salvo el wordmark y el título del banner de Lomito (Permitidos). Los íconos sí conservan su color.
  - Sobre rellenos de color (botones cyan, etiquetas), el texto va en gris oscuro.
  - Nada por debajo de `text-xs` (.75rem).
  - Enlaces subrayados, con el subrayado rosa al pasar el mouse. Foco con anillo rosa.
  - Todo lo que se mueve respeta `prefers-reduced-motion`: las animaciones de CSS las apaga `@lutvia/ds`, los hovers que mueven llevan `motion-safe:` y los scripts (confetti, lluvia de lomitos, caras de los dados) se frenan solos.
- Fuera del CSS (favicon y embeds de Discord), los colores se leen de los tokens con `src/utils/tokens.ts`.
