import type { APIRoute } from "astro";
import { colorLutvia } from "../utils/tokens.js";

// El favicon se arma con los tokens de @lutvia/ds: dos dados, cyan atrás y rosa adelante.
// Se sirve desde el servidor con caché larga (prerenderizarlo correría el middleware y la base en el build).

export const GET: APIRoute = () => {
    const cyan = colorLutvia("cyan");
    const rosa = colorLutvia("rosa");
    const oscuro = colorLutvia("oscuro");
    const blanco = colorLutvia("blanco");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect x="70" y="70" width="260" height="260" rx="48" fill="${cyan}" stroke="${oscuro}" stroke-width="24"/>
  <circle cx="135" cy="135" r="30" fill="${oscuro}"/>
  <circle cx="265" cy="265" r="30" fill="${oscuro}"/>
  <circle cx="200" cy="200" r="30" fill="${oscuro}"/>
  <rect x="180" y="180" width="260" height="260" rx="48" fill="${rosa}" stroke="${oscuro}" stroke-width="24"/>
  <circle cx="245" cy="245" r="30" fill="${blanco}"/>
  <circle cx="375" cy="375" r="30" fill="${blanco}"/>
  <circle cx="245" cy="375" r="30" fill="${blanco}"/>
  <circle cx="375" cy="245" r="30" fill="${blanco}"/>
  <circle cx="310" cy="310" r="30" fill="${blanco}"/>
</svg>`;

    return new Response(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400",
        },
    });
};
