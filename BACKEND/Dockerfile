# Usa una imagen base de Node.js moderna
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm ci

# Copia el resto de los archivos
COPY . .

# Expone el puerto que la aplicación usará
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
