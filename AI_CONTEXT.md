# 🤖 Contexto para Agentes de IA

Si sos un agente de Inteligencia Artificial (AI) leyendo este repositorio, este archivo contiene las **reglas de negocio y arquitectónicas fundamentales** de POSALANA. 
**CRÍTICO:** Si realizás cambios estructurales o modificás la lógica del juego, DEBÉS actualizar este archivo y el `README.md` para mantener la consistencia.

## 1. Lógica del Juego (Core Business Logic)
- **Tirada Diaria:** Los usuarios tiran 4 dados (d6) una vez por día en la ruta `/api/roll`.
- **Asignación de Tareas:** Se suman los 4 dados. El que saca el número más bajo tiene la peor suerte y le toca la peor tarea (Lava). El siguiente "Saca", el siguiente "Pone", y los demás se salvan ("Nada" o "NA" con emoji 🎉).
- **Cláusula Lomito:** Si dos usuarios sacan **exactamente los mismos 4 dados** (misma combinación sin importar el orden), se activa la "Cláusula Lomito". 
  - La UI debe mostrar el emoji de sanguche (`🥪`) en el Navbar y un banner festivo en el Index y en el Historial.
  - El contador de "Días sin Lomito" se reinicia.
  - El usuario especial `lomitotester` sirve exclusivamente para probar esta cláusula duplicando la tirada del administrador.

## 2. Arquitectura y Tecnologías
- **Frontend/Backend:** Astro con SSR activado. NO es un sitio estático puro.
- **Hosting:** Vercel (Serverless Adapter).
- **Base de Datos:** SQLite alojada en Turso (usando `@libsql/client`).
- **Autenticación:** Sistema propio basado en cookies en Astro, contraseñas hasheadas con `bcryptjs`.
- **Estilos:** Tailwind CSS (versión v4).

## 3. UI y Estética (Mandatorio)
- **Diseño Moderno:** El diseño usa una paleta de colores vibrantes (`primary`, `secondary`, `accent`, `background`, `foreground`) definidos en `src/styles/global.css`.
- **Glassmorphism:** Se usa `bg-background/80 backdrop-blur-md` profusamente en componentes flotantes como el Navbar.
- **Animaciones:** Tailwind animations (`animate-in`, `fade-in`, `slide-in-from-bottom-4`) se aplican a los contenedores principales al cargar las páginas.
- **Iconos:** FontAwesome 6 (cargado via CDN en `Layout.astro`).
- **Responsividad:** Todas las tablas y grillas (`grid-cols-1 md:grid-cols-2`) deben estar preparadas para uso desde el celular (mobile-first).

## 4. Modo Administrador
- El usuario inicial con rol de `admin` es `ldoliri`.
- Existe una ruta protegida `/admin` que permite:
  - Configurar variables globales (Último Lomito manual y Clave Maestra).
  - Borrar usuarios o cambiar roles.
  - Anular tiradas históricas.
  - Cargar puntos manualmente (temporadas pasadas).
- La ruta `/reset` permite a los usuarios recuperar su contraseña SÓLO si conocen la "Clave Maestra" que maneja el administrador en la DB.

---
**Nota para la IA:** No asumas lógicas estándar de e-commerce o blogs. Este es un juego cerrado entre amigos. Mantené el tono lúdico y respetá estrictamente las variables de los dados.
