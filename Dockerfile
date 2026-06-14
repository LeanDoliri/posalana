FROM node:22-slim

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir la aplicación de Astro
RUN npm run build

# Configurar variables de entorno para Fly.io
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Iniciar el servidor
CMD ["node", "./dist/server/entry.mjs"]
