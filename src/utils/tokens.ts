// Lee los colores de marca desde los tokens de @lutvia/ds (lutvia.css) para usarlos fuera del CSS:
// el favicon generado y los embeds de Discord. Así ningún color se escribe a mano en el proyecto.
import lutviaCss from "@lutvia/ds/lutvia.css?raw";

export type ColorLutvia = "rosa" | "cyan" | "amarillo" | "violeta" | "gris" | "oscuro" | "blanco";

export function colorLutvia(nombre: ColorLutvia): string {
    const match = lutviaCss.match(new RegExp(`--lutvia-${nombre}:\\s*(#[0-9a-fA-F]{6})`));
    if (!match) throw new Error(`No existe el token --lutvia-${nombre} en @lutvia/ds`);
    return match[1];
}

// Discord pide el color del embed como entero
export function colorLutviaEntero(nombre: ColorLutvia): number {
    return parseInt(colorLutvia(nombre).slice(1), 16);
}
