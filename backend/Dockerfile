# backend/Dockerfile
# Utiliser une image Node.js officielle
FROM node:20-alpine

# Créer le répertoire de travail
WORKDIR /app

# Installer psql (client PostgreSQL) pour les imports de données
RUN apk add --no-cache postgresql-client python3 make g++

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances avec build from source pour bcrypt
ENV npm_config_build_from_source=true
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
