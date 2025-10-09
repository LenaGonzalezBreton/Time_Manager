#!/bin/sh
# Build l'application
echo "Build de l'application..."
npm run build
# Run les migrations de la BDD
echo "Run de la migration de la BDD..."
npm run typeorm:run
# Démarre le serveur
echo "Démarre le serveur..."
npm start