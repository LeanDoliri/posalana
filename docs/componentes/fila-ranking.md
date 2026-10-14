# Fila del ranking

Una tirada del día en el ranking de la portada: quién tiró, a qué hora, qué tarea le tocó y sus dados.

**Dónde vive:** `src/pages/index.astro`, dentro de `#ranking-container` (el polling de 8 s reemplaza ese bloque entero). Los colores por tarea salen de `colorConfig`.

## Anatomía

- **Bloque** con radio de 16px y un fondo muy suave del color de la tarea (`primary/8`, `secondary/8`, `accent/8`; `foreground/[0.02]` si zafó), borde del mismo color y sombra al pasar el mouse.
- **Avatar** `lg` con borde.
- **Nombre** en Black 900, gris oscuro.
- **Etiquetas** de una línea, `text-xs`:
  - Tarea: la sílaba (`PO`, `SA`, `LA`) sobre el matiz al 15 % de su color, con texto gris oscuro. `NA` va sobre `foreground/10`, también con texto gris oscuro.
  - «Vos»: relleno gris oscuro con texto gris (9.43).
  - Exención: matiz violeta al 10 % con texto gris oscuro.
- **Hora** en `text-xs`, `lutvia-texto-suave`.
- **Tarea en texto**: el emoji de la tarea y su nombre en negrita, gris oscuro («🧽 Lava los platos»).
- **Dados** `xl`, con el que decide en el color de la tarea (ver [Dados](dados.md)).

## Estados

| Estado | Cómo |
|---|---|
| Normal | Fondo al 8 % del color de la tarea |
| Tu fila | Fondo al 15 %, anillo del color de la tarea, sombra y un 1 % más grande; etiqueta «Vos» |
| Al pasar el mouse | Se marca el borde y aparece la sombra |

## Cambió respecto a producción

- La etiqueta de tarea pasa de relleno pleno con texto gris (3.61 sobre rosa, 1.71 sobre cyan, 2.60 sobre violeta) al matiz al 15 % con texto gris oscuro.
- El nombre de la tarea pasa de texto en color a gris oscuro (el color queda en el fondo, la etiqueta y el dado).
- Los textos de 8 y 9 px («Vos», exenciones) suben a `text-xs` (.75rem).
- Hora y texto de la fila que zafó: de `foreground/30` y `/40` a `lutvia-texto-suave`.
- El 1 % de crecimiento de tu fila solo pasa sin movimiento reducido.
