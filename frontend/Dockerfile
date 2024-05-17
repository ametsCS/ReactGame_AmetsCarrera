# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Compila el proyecto
RUN npm run build

# Usa una imagen base de Nginx para servir el frontend
FROM nginx:alpine

# Copia los archivos compilados al directorio de Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Expone el puerto que Nginx usará
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]