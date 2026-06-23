# 🎲 POSALANA

**PO**ne, **SA**ca, **LA**va, **NA**da. 
La forma definitiva, justa y basada puramente en el azar para dividir las tareas de la casa después de comer.

![Astro](https://img.shields.io/badge/Astro-0C1120?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 🌟 Características Principales

*   **Autenticación Integrada:** Registro e inicio de sesión seguro usando [Lucia Auth](https://lucia-auth.com/).
*   **Tirada Diaria Única:** Cada usuario solo puede tirar los dados una vez por día. El sistema bloquea intentos múltiples.
*   **Ranking Automático:** Calcula matemáticamente quién saca el número más bajo y asigna automáticamente la peor tarea (Lava), la intermedia (Saca) y la más leve (Pone).
*   **🥪 Cláusula Lomito:** Si dos personas sacan **exactamente los mismos dados en el mismo orden** en el mismo día, se activa el cartel festivo de *Lomito* y el contador de "Días sin Lomito" se reinicia a cero.
*   **Historial con Paginación Semanal:** Muestra las tiradas agrupadas por semana calendario (lunes a domingo) con navegación interactiva fluida (client-side) que previene recargas completas, mantiene el scroll y actualiza la URL y el historial del navegador automáticamente.
*   **Estadísticas y Ordenamiento Interactivo:** Muestra las estadísticas de la temporada actual, anterior y global del año usando el componente `StatsTable`. La tabla del año permite ordenar filas interactivamente por cualquier columna (Jugador, PO, SA, LA, Total).
*   **Exenciones de Tarea Automáticas:** Las personas con más puntos en una tarea durante la temporada anterior quedan automáticamente eximidas de realizarla en la temporada actual, con soporte para empates, anulaciones manuales y base cases seguros contra loops infinitos.
*   **Panel de Administración (Admin Dashboard):** Permite configurar variables, promover administradores, eliminar cuentas, anular tiradas accidentales, cargar puntos manuales históricos y gestionar exenciones (crear/borrar).
*   **Gestión Rápida de Avatares:** El administrador puede cambiar o eliminar las fotos de perfil de todos los usuarios directamente haciendo clic sobre su avatar en el padrón, comprimiendo la imagen en el navegador antes de subirla.
*   **🔄 Actualización en Tiempo Real:** El ranking de la página de inicio se actualiza automáticamente cada 8 segundos sin necesidad de refrescar la página. Utiliza la *Page Visibility API* para pausar automáticamente las consultas al servidor si el usuario cambia de pestaña, minimizando el consumo de base de datos Turso.
*   **👾 Notificaciones de Discord:** Integración automática mediante Webhooks de Discord que notifica al instante cada tirada de dados realizada. Además, incluye un botón manual en el panel del administrador para publicar el veredicto oficial de tareas del día.

## 🛠️ Tecnologías Utilizadas

*   **Framework:** [Astro](https://astro.build/) (con adaptador Serverless para Vercel y SSR activado).
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) para un diseño responsive y moderno.
*   **Base de Datos:** SQLite alojada en la nube usando [Turso](https://turso.tech/) a través de `@libsql/client`.
*   **Despliegue:** Preparado para hostear de manera **100% gratuita y para siempre** en [Vercel](https://vercel.com/).

---

## 🤖 Para Agentes de IA y LLMs

Si sos una IA asignada a este proyecto, leé inmediatamente el archivo [`AI_CONTEXT.md`](AI_CONTEXT.md) en la raíz del proyecto. Contiene reglas arquitectónicas críticas y lógica de negocio (como la Cláusula Lomito). 
**Importante:** Cualquier cambio estructural o de lógica del juego debe quedar reflejado actualizando el `README.md` y el `AI_CONTEXT.md`.

---

## 🚀 Correr el Proyecto Localmente

Si querés descargar el código y probarlo en tu compu, seguí estos pasos:

1. **Clonar el repositorio y entrar a la carpeta:**
   ```bash
   git clone https://github.com/tu-usuario/posalana.git
   cd posalana
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Creá un archivo `.env` en la raíz del proyecto. Si querés usar una base de datos local SQLite para probar, podés dejarlo así:
   ```env
   DATABASE_URL="file:sqlite.db"
   ```

4. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

La aplicación va a estar disponible en `http://localhost:4321`. La base de datos `sqlite.db` se va a crear automáticamente cuando la página intente hacer la primera consulta.

---

## ☁️ Despliegue en Producción (Vercel + Turso)

Este proyecto está configurado para un despliegue gratuito y automático en Vercel.

### 1. Base de Datos en Turso (Gratis)
Como Vercel es un entorno "Serverless" (sin estado), la base de datos no puede vivir en un archivo local. Necesitamos Turso:
1. Entrá a [Turso](https://turso.tech/) y creá una cuenta con GitHub.
2. Creá una base de datos nueva.
3. Obtené la URL de la base de datos (suele ser `libsql://tu-base.turso.io`) y el Token de Autenticación.

### 2. Despliegue en Vercel (Gratis)
1. Subí tu repositorio a GitHub.
2. Entrá a [Vercel](https://vercel.com/) y creá una cuenta con GitHub.
3. Tocá "Add New Project" y elegí tu repositorio de POSALANA.
4. En la sección "Environment Variables" antes de darle a Deploy, agregá:
   - `DATABASE_URL`: La URL de tu base de Turso.
   - `DATABASE_AUTH_TOKEN`: El token de tu base de Turso.
   - `DISCORD_WEBHOOK_URL`: La URL del Webhook del canal de Discord (opcional, para notificaciones).
5. Tocá **Deploy**.

¡Listo! A partir de ahora, cada vez que hagas un `git push` a tu rama principal (`main`), Vercel va a compilar y actualizar la página automáticamente.

## 📜 Reglas del Juego

Las reglas oficiales de POSALANA están publicadas dentro de la misma aplicación, actualizadas por última vez el **16 de Junio de 2026**. Podés consultarlas en la pestaña "Reglas" en el menú principal de navegación.

---
*Hecho con ❤️ y algo de suerte en los dados.*
