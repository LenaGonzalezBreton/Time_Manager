#!/bin/sh
# Build l'application
echo "Build de l'application..."
npm run build
# Run les migrations de la BDD
echo "Run de la migration de la BDD..."
npm run typeorm:run:prod

# Import des données de test si la base est vide
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL non définie, skip du seed de données."
else
  echo "Vérification du schéma et des données (table roles)..."
  HAS_ROLES=$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public.roles') IS NOT NULL" 2>/dev/null | tr -d '[:space:]')
  if [ "$HAS_ROLES" = "t" ]; then
    COUNT_ROLES=$(psql "$DATABASE_URL" -tAc "SELECT COUNT(*) FROM roles" 2>/dev/null | tr -d '[:space:]')
    if [ "$COUNT_ROLES" = "0" ]; then
      echo "Seed: base vide détectée (roles=0). Import de src/test_data.sql..."
      psql -v ON_ERROR_STOP=1 "$DATABASE_URL" -f /app/src/test_data.sql || {
        echo "Erreur pendant l'import des données de test."; exit 1;
      }
      echo "Seed terminé."
    else
      echo "Seed ignoré: des données existent déjà (roles=$COUNT_ROLES)."
    fi
  else
    echo "Table 'roles' absente, seed ignoré (vérifiez les migrations)."
  fi
fi

# Démarre le serveur
echo "Démarre le serveur..."
npm start