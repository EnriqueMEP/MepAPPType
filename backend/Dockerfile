# MEP-Projects Backend
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY src/ ./src/
COPY .modulealiases ./

# Crear directorios necesarios
RUN mkdir -p uploads/avatars uploads/documents uploads/images uploads/crm uploads/rrhh uploads/tasks uploads/chat

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 5000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=5000

# Comando de inicio
CMD ["npm", "start"]
