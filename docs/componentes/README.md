# Componentes de POSALANA

Piezas propias del juego. Las reglas de marca (colores, contraste, tipografía, logo) vienen de [LUTVIA-DEV/lutvia-ds](https://github.com/LUTVIA-DEV/lutvia-ds) 2.0.0, y las decisiones de diseño de POSALANA (radios, sombras, matices, animaciones, hovers) están en [`../diseno.md`](../diseno.md).

| Ficha | Pieza | Dónde vive |
|---|---|---|
| [Dados](dados.md) | Los cuatro dados de una tirada | `src/components/DiceDisplay.astro` |
| [Fila del ranking](fila-ranking.md) | Una tirada del día en el ranking de la portada | `src/pages/index.astro` (`#ranking-container`) |
| [Banner de Lomito](banner-lomito.md) | El aviso festivo de la Cláusula Lomito | `src/pages/index.astro` (`#lomito-container`) |
