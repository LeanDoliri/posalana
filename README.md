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
*   **🥪 Cláusula Lomito:** Si dos personas sacan **exactamente los mismos dados** en el mismo día, se activa el cartel festivo de *Lomito* y el contador de "Días sin Lomito" se reinicia a cero.
*   **Panel de Administración (Admin Dashboard):** Un usuario maestro puede acceder a una ruta privada para anular tiradas accidentales, promover nuevos administradores o eliminar cuentas maliciosas.

## 🛠️ Tecnologías Utilizadas

*   **Framework:** [Astro](https://astro.build/) (con adaptador Serverless para Vercel).
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño responsive y moderno.
*   **Base de Datos:** SQLite alojada gratuitamente en la nube usando [Turso](https://turso.tech/) a través de `@libsql/client`.
*   **Despliegue:** Preparado para hostear de manera **100% gratuita y para siempre** en [Vercel](https://vercel.com/).

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
5. Tocá **Deploy**.

¡Listo! A partir de ahora, cada vez que hagas un `git push` a tu rama principal (`main`), Vercel va a compilar y actualizar la página automáticamente.

## 📜 Reglas del Juego

Las reglas oficiales de POSALANA están publicadas dentro de la misma aplicación, actualizadas por última vez el **16 de Junio de 2026**. Podés consultarlas en la pestaña "Reglas" en el menú principal de navegación.

---
*Hecho con ❤️ y algo de suerte en los dados.*
