# Fila del ranking

Una tirada del día en el ranking de la portada: quién tiró, a qué hora, qué tarea le tocó y sus dados.

**Dónde vive:** `src/pages/index.astro`, dentro de `#ranking-container` (el polling de 8 s reemplaza ese bloque entero). La versión compacta del historial (`src/pages/history.astro`) sigue las mismas reglas.

## Anatomía

- **Bloque** de varias líneas con `lutvia-radio-chico` (10px) y relleno `lutvia-gris`: está dentro de una tarjeta blanca, así que se distingue por el relleno, no por una sombra.
- **Avatar** `lg` con borde blanco.
- **Nombre** en Black 900, `lutvia-oscuro`.
- **Etiquetas** (patrón `Etiqueta` del núcleo, píldoras de una línea en `texto-mini` negrita):
  - Tarea: la sílaba (`PO`, `SA`, `LA`) sobre el matiz al 15 % de su color (`bg-lutvia-rosa/15`, `bg-lutvia-cyan/15`, `bg-lutvia-violeta/15`) con texto `lutvia-oscuro`. `NA` va sobre blanco. Sobre el gris de la fila, el matiz da 7.68 (rosa), 8.51 (cyan) y 8.21 (violeta) con texto oscuro: cumple AA de sobra, aunque queda por debajo del «≥ 8.5» que el perfil calcula sobre blanco.
  - «Vos»: fondo blanco, ícono `fa-circle-user`.
  - Exención: matiz violeta al 15 %, ícono `fa-shield-halved`, «Exento Lava».
- **Hora** en `text-xs`, `lutvia-texto-suave`, cifras tabulares.
- **Tarea en texto**: el emoji de la tarea (`aria-hidden`) y su nombre en negrita, `lutvia-oscuro` («🧽 Lava los platos»).
- **Dados** `xl`, con el que decide en el color de la tarea (ver [Dados](dados.md)).

## Estados

| Estado | Cómo |
|---|---|
| Normal | Relleno `lutvia-gris` |
| Tu fila | Además, anillo de 2 px `lutvia-oscuro` (9.43 sobre gris) y la etiqueta «Vos» |
| Al pasar el mouse | Nada: la fila no es clicable |

## Cambió respecto a producción

- El fondo con el matiz de la tarea (`/8`, `/15`) y el borde de color pasan a `lutvia-gris`: el matiz solo va en chips, avatares y etiquetas.
- La fila propia ya no crece (`scale-[1.01]`) ni lleva sombra; se marca con el anillo oscuro.
- La etiqueta de tarea pasa de relleno pleno con texto `lutvia-gris` (1.71 sobre cyan, 2.60 sobre violeta, 3.61 sobre rosa) al matiz al 15 % con texto oscuro.
- Los textos de 8 y 9 px («Vos», exenciones) suben a `texto-mini` (.75rem).
- El nombre de la tarea pasa de texto en color (rosa, cyan o violeta) a `lutvia-oscuro`.
- La hora deja `font-mono`: todo en Montserrat con `tabular-nums`.
- `rounded-2xl` (16px) pasa a `lutvia-radio-chico`.
