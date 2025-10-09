# backend/Dockerfile
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Compiler TypeScript
RUN npm run build

# Exposer le port du backend
EXPOSE 5000

# Copier le script de démarrage
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Lancer le script de démarrage pour aussi migrer la base de données
CMD ["/app/start.sh"]