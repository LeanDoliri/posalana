# Componentes de POSALANA

POSALANA usa el sistema de diseño de Lutvia ([LUTVIA-DEV/lutvia-ds](https://github.com/LUTVIA-DEV/lutvia-ds), perfil «POSALANA»). Esta carpeta documenta las piezas propias del juego que **no** tienen ficha en el sistema; allá viven la tarjeta de la tirada (`PosalanaTarjetaTirada`), el botón de tirar (`PosalanaBotonTirar`) y los patrones del núcleo (`Boton`, `Etiqueta`, `Campo`, `Aviso`).

| Ficha | Pieza | Dónde vive |
|---|---|---|
| [Dados](dados.md) | Los cuatro dados de una tirada | `src/components/DiceDisplay.astro` |
| [Fila del ranking](fila-ranking.md) | Una tirada del día en el ranking de la portada | `src/pages/index.astro` (`#ranking-container`) |
| [Banner de Lomito](banner-lomito.md) | El aviso festivo de la Cláusula Lomito | `src/pages/index.astro` (`#lomito-container`) |

## Cómo se aplica el sistema

- **Colores:** `src/styles/global.css` importa `@lutvia/ds/tailwind.css` y `@lutvia/ds/posalana.css`. Los nombres de siempre (`primary`, `secondary`, `accent`, `background`, `foreground`) apuntan a los tokens (rosa, cyan, violeta, gris y gris oscuro); el proyecto no define colores propios. Fuera del CSS (favicon y embeds de Discord), los colores se leen de los tokens con `src/utils/tokens.ts`.
- **Tipografía:** Montserrat, como pide el núcleo.
- **Radios:** `lutvia-pildora` para acciones, etiquetas y círculos; `lutvia-radio-chico` (10px) para filas, campos, botones y bloques chicos; `lutvia-radio` (14px) para contenedores. Las tarjetas van en 24px (`rounded-3xl`, Permitido).
- **Cifras:** Montserrat con `tabular-nums` (nada de `font-mono`).
- **Todo lo demás** (tarjetas con sombra, matices y desenfoques decorativos, texto en los colores de la marca, animaciones y hovers del juego) es el diseño propio de POSALANA. El perfil lo admite en su lista de **Permitidos**.
