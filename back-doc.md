# Documentation Backend — Time Manager

Cette documentation couvre le service Backend (Node.js + Express + TypeORM + PostgreSQL) de l’application Time Manager : démarrage, configuration, API, migrations et import des données de test.

---

## 1) Démarrage rapide (Docker)

Prérequis: Docker Desktop installé et démarré.

- Lancer toute la stack (frontend, backend, db) en une fois + le build

```cmd
docker-compose up -d --build
```

- Lancer toute la stack (frontend, backend, db) en une fois sans le build

```cmd
docker compose up -d
```

- Démonter la stack

```cmd
docker compose down -v
```

- Logs du backend

```cmd
docker compose logs -f backend | more
```

Par défaut, l’API écoute sur http://localhost:5000.

---

## 2) Configuration et environnement

- Port API: variable d’environnement `API_PORT` (défaut: 5000)
- Connexion BDD: `DATABASE_URL` (défaut en Docker: `postgres://user:password@db:5432/time_manager`)
- TypeORM: migrations activées, `synchronize` désactivé (bonnes pratiques prod)

Au démarrage du conteneur backend, le script `/app/start.sh`:
- compile TypeScript (`npm run build`),
- exécute les migrations (`npm run typeorm:run`),
- démarre l’API (`npm start`).

Exécuter les migrations manuellement (si besoin):

```cmd
docker compose exec backend npm run typeorm:run
```

---

## 3) Documentation API (Swagger)

- UI: http://localhost:5000/docs
- Spécification JSON: http://localhost:5000/docs.json
- Préfixe d’API: toutes les routes sont sous `/api`.

---

## 4) Endpoints principaux

Base: `http://localhost:5000/api`

- Système
  - GET `/health` — statut API/BDD
- Rôles
  - GET `/roles`, POST `/roles`, PUT `/roles/{id}`, DELETE `/roles/{id}`
- Équipes
  - GET `/equipes`, POST `/equipes`, PUT `/equipes/{id}`, DELETE `/equipes/{id}`
- Utilisateurs
  - GET `/utilisateurs`, POST `/utilisateurs`, PUT `/utilisateurs/{id}`, DELETE `/utilisateurs/{id}`
  - GET `/utilisateurs/{id}/horaires` — horaires d’un utilisateur
- Horaires
  - GET `/horaires`, POST `/horaires`, PUT `/horaires/{id}`, DELETE `/horaires/{id}`
- Indicateurs
  - GET `/indicateurs`, POST `/indicateurs`, PUT `/indicateurs/{id}`, DELETE `/indicateurs/{id}`
- Absences
  - GET `/absences`, POST `/absences`, PUT `/absences/{id}`, DELETE `/absences/{id}`
- Cibles d’indicateur
  - GET `/cibles-indicateur`, POST `/cibles-indicateur`, PUT `/cibles-indicateur/{id}`, DELETE `/cibles-indicateur/{id}`
- Jours fériés
  - GET `/jours-feries`, POST `/jours-feries`, PUT `/jours-feries/{id}`, DELETE `/jours-feries/{id}`
- Planning
  - GET `/plannings`, POST `/plannings`, PUT `/plannings/{id}`, DELETE `/plannings/{id}`
- Types d’absence
  - GET `/types-absence`, POST `/types-absence`, PUT `/types-absence/{id}`, DELETE `/types-absence/{id}`
- Types d’horaire
  - GET `/types-horaire`, POST `/types-horaire`, PUT `/types-horaire/{id}`, DELETE `/types-horaire/{id}`
- Rapports (agrégations KPI)
  - GET `/rapports` — paramètres: `userId`, `teamId`, `startDate`, `endDate`, `kpis`, `granularity` (summary|daily)
  - POST `/rapports/recalcul` — brouillon (202 Accepté)

Pour le détail des schémas et exemples, voir Swagger.

---

## 5) Import des données de test (.sql)

Ce projet fournit un jeu de données de test dans `backend\src\test_data.sql`. Il réinitialise les tables cibles et charge des rôles, équipes, utilisateurs, horaires, absences et indicateurs d’exemple.

Prérequis: la base Postgres est démarrée (par ex. `docker compose up -d db`).

Commandes (Windows, cmd.exe):

```cmd
docker cp backend\src\test_data.sql postgres_db:/test_data.sql
docker exec -i postgres_db psql -U user -d time_manager -f /test_data.sql
```

Vérifications rapides:

```cmd
docker exec -i postgres_db psql -U user -d time_manager -c "\dt"
docker exec -i postgres_db psql -U user -d time_manager -c "SELECT COUNT(*) FROM utilisateurs;"
```

Avertissement: ce script TRUNCATE et réinitialise certaines tables. À ne pas exécuter sur une base contenant des données à conserver.

---

## 6) Développement local (sans Docker) — optionnel

Si vous préférez exécuter le backend localement:

- Installer les dépendances

```cmd
cd backend
npm install
```

- Configurer l’URL de BDD (fichier `.env` ou variable d’environnement `DATABASE_URL`)

Exemple:

```cmd
set DATABASE_URL=postgres://user:password@localhost:5432/time_manager
set API_PORT=5000
```

- Lancer en mode développement (ts-node)

```cmd
npm run dev
```

- Lancer en mode production (build + start)

```cmd
npm run build
npm start
```

---

## 7) Référence TypeORM (scripts)

Dans `backend/package.json`:
- `npm run typeorm:run` — exécuter les migrations
- `npm run typeorm:revert` — annuler la dernière migration
- `npm run typeorm:gen` — générer une migration à partir des entités (nécessite une BDD accessible)

Exécution dans le conteneur:

```cmd
docker compose exec backend npm run typeorm:run
```

---

## 8) Points d’attention

- `synchronize` est à `false` (production-friendly): utilisez les migrations.
- Swagger lit les annotations depuis `src/routes/**/*.ts` en dev et `dist/routes/**/*.js` en prod.
- CORS autorise `http://localhost:3000` par défaut (frontend local).
