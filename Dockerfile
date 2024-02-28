# Node.js como imagen principal
FROM node:20

# Establecer el directorio de trabajo en el contenedor.
WORKDIR /usr/src/app

# Copie package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Install dependencies
RUN npm install

# Copie el código de la aplicación al directorio de trabajo.
COPY . .

# puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para ejecutar su aplicación
CMD ["node","ts-node", "ts-node src/index.ts"]
