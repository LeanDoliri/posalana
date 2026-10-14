# Componentes de POSALANA

POSALANA usa el sistema de diseño de Lutvia ([LUTVIA-DEV/lutvia-ds](https://github.com/LUTVIA-DEV/lutvia-ds), perfil «POSALANA»). Esta carpeta documenta las piezas propias del juego que **no** tienen ficha en el sistema: allá viven la tarjeta de la tirada (`PosalanaTarjetaTirada`), el botón de tirar (`PosalanaBotonTirar`) y los patrones del núcleo (`Boton`, `Etiqueta`, `Campo`, `Aviso`).

| Ficha | Pieza | Dónde vive |
|---|---|---|
| [Dados](dados.md) | Los cuatro dados de una tirada | `src/components/DiceDisplay.astro` |
| [Fila del ranking](fila-ranking.md) | Una tirada del día en el ranking de la portada | `src/pages/index.astro` (`#ranking-container`) |
| [Banner de Lomito](banner-lomito.md) | El aviso festivo de la Cláusula Lomito | `src/pages/index.astro` (`#lomito-container`) |

## Cómo se aplica el sistema

- `src/styles/global.css` importa `tailwindcss`, `@lutvia/ds/tailwind.css` y `@lutvia/ds/posalana.css`. No hay ningún color escrito a mano: todo sale de un token `--lutvia-*` (clases `bg-lutvia-cyan`, `text-lutvia-oscuro`, `border-lutvia-oscuro-16`…).
- Los patrones del núcleo están como utilidades de Tailwind en `global.css`: `boton` + `boton-principal` / `boton-secundario` (+ `boton-peligro`), `boton-icono`, `etiqueta`, `campo`, `enlace` y `rotulo`.
- Los colores por tarea (etiqueta al 15 %, dado y acento) salen de `choreStyles` en `src/utils/chores.ts`.
- Fuera del CSS (favicon y embeds de Discord) los colores se leen de los tokens con `src/utils/tokens.ts`.
