# Dados

Los cuatro dados de una tirada, en fila. El primero es **el que decide** la tarea y va en color; los otros tres van en `lutvia-texto-suave`.

**Dónde vive:** `src/components/DiceDisplay.astro`. Se usa en el podio, la tarjeta de la tirada, el ranking, el historial y el panel de administración.

## Anatomía

- Íconos `fa-dice-one` … `fa-dice-six` de Font Awesome, con `aria-hidden="true"` (el valor se lee en el resto de la fila).
- Tamaños: `sm`, `md`, `lg` y `xl` (de `text-sm` a `text-6xl`).

## Color del dado que decide

| Dónde | Color | Contraste sobre blanco | Por qué alcanza |
|---|---|---|---|
| Historial: te toca tarea | `primary` (rosa) | 4.22 | Indicador no textual (≥ 3:1) |
| Historial: te salvás | `secondary` (cyan) | 2.00 | El estado también va en texto: la etiqueta de la fila dice «NA» |
| Portada: Pone (PO) | `primary` (rosa) | 4.22 | Indicador no textual |
| Portada: Saca (SA) | `secondary` (cyan) | 2.00 | La fila dice la tarea en texto (etiqueta «SA» y «Saca la mesa») |
| Portada: Lava (LA) | `accent` (violeta) | 3.04 | Indicador no textual |
| Portada: Nada (NA) | `lutvia-texto-suave` | 5.33 | — |
| Sin estado (tarjeta de la tirada, administración) | `secondary` (cyan) | 2.00 | Decorativo: el valor no depende del color |

El cyan nunca es la única señal. El uso del dado cyan está propuesto como Permitido en LUTVIA-DEV/lutvia-ds#3.

## Movimiento

- Entran con la animación de entrada; al pasar el mouse crecen un 10 % y giran 6°. Con `prefers-reduced-motion` no hay animación ni giro (`motion-safe:`).

## Cambió respecto a producción

- Los tres dados que no deciden pasan de `foreground/30` (≈ 1.8:1) a `lutvia-texto-suave` (5.33).
- Los íconos llevan `aria-hidden="true"`.
