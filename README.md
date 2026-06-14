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
*   **🥩 Cláusula Lomito:** Si dos personas sacan **exactamente los mismos dados** en el mismo día, se activa el cartel festivo de *Lomito* y el contador de "Días sin Lomito" se reinicia a cero.
*   **Panel de Administración (Admin Dashboard):** Un usuario maestro puede acceder a una ruta privada para anular tiradas accidentales, promover nuevos administradores o eliminar cuentas maliciosas.

## 🛠️ Tecnologías Utilizadas

*   **Framework:** [Astro](https://astro.build/) (con adaptador SSR de Node.js).
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño responsive y moderno.
*   **Base de Datos:** SQLite local manejado a través de `@libsql/client`. Todo vive en un simple archivo `sqlite.db`.
*   **Despliegue:** Preparado con un `Dockerfile` y configuración nativa para hostear de manera gratuita en **Fly.io** con volúmenes persistentes.

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

3. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

La aplicación va a estar disponible en `http://localhost:4321`. La base de datos `sqlite.db` se va a crear automáticamente cuando la página intente hacer la primera consulta.

---

## ☁️ Despliegue en Producción (Fly.io)

Este proyecto está configurado para un despliegue sin estrés en Fly.io usando **GitHub Actions**.

### Despliegue Manual
Si tenés instalada la herramienta de [flyctl](https://fly.io/docs/flyctl/install/):
```bash
fly deploy
```

### Base de Datos Persistente
Como la aplicación usa SQLite local, requiere un "Volumen" persistente en el servidor para que los datos no se borren en cada actualización. Podés crearlo así:
```bash
fly volumes create data --size 1
```
*(El archivo `fly.toml` ya está configurado para montar este volumen en `/data` y leer la base de datos de ahí usando variables de entorno).*

---

## 📜 Reglas del Juego

Las reglas oficiales de POSALANA están publicadas dentro de la misma aplicación, actualizadas por última vez el **16 de Junio de 2026**. Podés consultarlas en la pestaña "Reglas" en el menú principal de navegación.

---
*Hecho con ❤️ y algo de suerte en los dados.*
