# Dados

Los cuatro dados de una tirada, en fila. El primero es **el que decide** la tarea y va en color; los otros tres, en gris oscuro al 30 %.

**Dónde vive:** `src/components/DiceDisplay.astro`. Se usa en el podio, la tarjeta de la tirada, el ranking, el historial y el panel de administración.

## Props

| Prop | Qué hace |
|---|---|
| `die1` … `die4` | Valores de 1 a 6 (`fa-dice-one` … `fa-dice-six` de Font Awesome) |
| `size` | `sm`, `md`, `lg` o `xl` (de `text-sm` a `text-6xl`) |
| `isSafe` | Color del dado que decide: `secondary` (cyan) si te salvás, `primary` (rosa) si te toca tarea |
| `color` | Pisa el color del dado que decide (la portada pasa el de la tarea: PO rosa, SA cyan, LA violeta, NA gris al 30 %) |

Sin `isSafe` ni `color`, el dado que decide va en cyan.

## Movimiento

- Entran con un fundido y zoom desde el 95 %.
- Al pasar el mouse crecen un 10 % y giran 6° (alternando el sentido de dado a dado).
- El primero lleva `drop-shadow-sm`.

## Sistema de diseño

Colores de la paleta. El dado cyan sobre blanco (2.00), los grises al 30 % y el movimiento al pasar el mouse están en los **Permitidos** del perfil POSALANA.
