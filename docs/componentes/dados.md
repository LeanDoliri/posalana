# Dados

Los cuatro dados de una tirada, en fila. El primero es **el que decide** la tarea y va en color; los otros tres, en `lutvia-texto-suave`.

**Dónde vive:** `src/components/DiceDisplay.astro`. Se usa en el podio, la tarjeta de la tirada, el ranking, el historial y el panel de administración.

## Anatomía

- Íconos `fa-dice-one` … `fa-dice-six` de Font Awesome, con `aria-hidden="true"`.
- El contenedor lleva `role="img"` y `aria-label="Dados: 3, 4, 1, 6"`: el lector de pantalla oye los valores, no cuatro íconos.
- Tamaños: `sm`, `md`, `lg` y `xl` (de `text-sm` a `text-6xl`).

## Color del dado que decide

| Caso | Color | Contraste sobre blanco | Por qué alcanza |
|---|---|---|---|
| Sin estado (panel de administración) | `lutvia-oscuro` | 11.04 | — |
| Historial: te toca tarea | `lutvia-rosa` | 4.22 | Indicador no textual (≥ 3:1) |
| Historial: te salvás | `lutvia-cyan` | 2.00 | El estado también va en texto: la etiqueta de la fila dice «NA · Te salvás» |
| Portada: Pone (PO) | `lutvia-rosa` | 4.22 | Indicador no textual |
| Portada: Saca (SA) | `lutvia-cyan` | 2.00 | La fila dice la tarea en texto (etiqueta «SA» y «Saca la mesa») |
| Portada: Lava (LA) | `lutvia-violeta` | 3.04 | Indicador no textual |
| Portada: Nada (NA) | `lutvia-texto-suave` | 5.33 | — |

El cyan nunca es la única señal: siempre hay una etiqueta de tarea en la misma fila. Ese uso está propuesto como Permitido del perfil en lutvia-ds.

El color se pasa con la prop `color` (por ejemplo `choreStyles.SA.dado`) o con `isSafe` (cyan si `true`, rosa si `false`).

## Movimiento

- Entran con la animación de entrada (300 ms). Con `prefers-reduced-motion` no hay animación.
- Al pasar el mouse **no** cambian de tamaño ni giran (antes crecían un 10 % y rotaban).
- Las animaciones del juego que los usan (sacudida al tirar, giro del indicador de carga) son Permitidos del perfil y se apagan con movimiento reducido; ahí las caras tampoco cambian solas.

## Cambió respecto a producción

- Los tres dados que no deciden pasan de `foreground/30` (gris al 30 %, fuera de la paleta) a `lutvia-texto-suave`.
- Sin estado, el dado que decide pasa de cyan (2.00, sin texto que lo acompañe) a `lutvia-oscuro`.
- Se sacan `drop-shadow`, `hover:scale-110` y `hover:rotate-6`.
- Se suma la etiqueta accesible con los valores.
