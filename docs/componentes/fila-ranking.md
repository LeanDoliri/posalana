# Fila del ranking

Una tirada del día en el ranking de la portada: quién tiró, a qué hora, qué tarea le tocó y sus dados.

**Dónde vive:** `src/pages/index.astro`, dentro de `#ranking-container` (el polling de 8 s reemplaza ese bloque entero). Los colores por tarea salen de `colorConfig`.

## Anatomía

- **Bloque** con `lutvia-radio-chico` (10px), fondo al 8 % del color de la tarea (`primary/8`, `secondary/8`, `accent/8`; `foreground/[0.02]` si zafó) y borde del mismo color.
- **Avatar** `lg` con borde cyan al 20 %.
- **Nombre** en Black 900, `text-xl`.
- **Etiquetas**:
  - «Vos»: relleno gris oscuro con texto gris, 9 px.
  - Tarea: la sílaba (`PO`, `SA`, `LA`) en relleno pleno de su color con texto gris; `NA` en gris al 10 % con texto gris al 50 %. 10 px, mayúsculas.
  - Exención: violeta al 10 % con texto violeta, 9 px, ícono `fa-shield-halved`.
- **Hora** en Montserrat con `tabular-nums`, gris al 40 %, sobre gris al 5 %.
- **Tarea en texto**: emoji y nombre en el color de la tarea, en negrita («🧽 Lava los platos»).
- **Dados** `xl`, con el que decide en el color de la tarea (ver [Dados](dados.md)).

## Estados

| Estado | Cómo |
|---|---|
| Normal | Fondo al 8 % del color de la tarea |
| Al pasar el mouse | Se marca el borde (45 %) y aparece una sombra |
| Tu fila | Fondo al 15 %, anillo del color de la tarea, sombra y un 1 % más grande |

## Sistema de diseño

Colores, tipografía y radios del sistema. El texto en color, los textos de 9 y 10 px, los fondos al 8 % y el crecimiento de tu fila están en los **Permitidos** del perfil POSALANA.
