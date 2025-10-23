# 🕒 TIME MANAGER — <TRINITY/>

## 🎯 Objectif
Application de gestion du temps permettant aux employés d’enregistrer leurs arrivées/départs et aux managers de suivre les équipes et leurs KPI, selon une approche **DevOps complète**.

---

## ⚙️ Stack Technique

### 🖥️ Frontend — **React.js**
- Framework rapide et modulaire, idéal pour des dashboards dynamiques.
- Ecosystème mature (hooks, router, context).
- Intégration fluide avec une API REST et Docker.

### ⚙️ Backend — **Node.js + Express**
- API RESTful légère et performante.
- Cohérence de langage JS entre frontend et backend.
- Excellent support des tests et de la CI (Jest, Supertest).

### 🗄️ Base de Données — **PostgreSQL**
- Relationnelle, robuste et fiable.
- Parfaite pour la gestion d’équipes et le calcul de KPI.
- Intégration simple.

### 🌐 Reverse Proxy — **Traefik**
- Routage dynamique entre services Docker.
- Configuration via labels, support HTTPS natif.
- Léger et prêt pour la production.

### 🐳 Conteneurisation — **Docker & Docker Compose**
- Environnement reproductible et portable.
- Multi-stage builds pour images optimisées.
- Orchestration des services (frontend, backend, db, proxy).

### 🔄 Intégration Continue — **GitHub Actions**
- Build et test automatisés à chaque PR.
- Génération du rapport de couverture.
- Intégration native avec GitHub.

---

## 🔐 Variables d’environnement: un seul `.env` à la racine

Le projet utilise désormais un unique fichier `.env` à la racine du dépôt. Ce fichier est:
- utilisé par Docker Compose pour alimenter les services,
- chargé par le backend au démarrage (en dev),
- non versionné (voir `.gitignore`).

Exemple minimal de `./.env` (à créer manuellement; ne pas committer):

```
POSTGRES_USER=tm_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=time_manager
API_PORT=5000
TYPEORM_LOGGING=false
FRONTEND_PORT=3000
DATABASE_URL=postgres://tm_user:change_me@localhost:5432/time_manager
```

Notes:
- En Docker, `docker-compose.yml` construit `DATABASE_URL` pour le backend et lui injecte via l’environnement.
- Côté frontend (Create React App), exposez uniquement des variables publiques préfixées `REACT_APP_` si besoin (ex: `REACT_APP_API_URL=http://localhost:5000`). Ne placez aucun secret côté frontend.

Si un ancien `.env` existait dans `backend/` ou des `.env.example` traînent encore localement, supprimez-les pour éviter toute confusion.


---

## 🧩 Résumé

| Composant | Technologie | Raison principale |
|------------|--------------|------------------|
| Frontend | React.js | Rapidité, modularité |
| Backend | Node.js + Express | Cohérence et légèreté |
| Base de données | PostgreSQL | Fiabilité, relations |
| Proxy | Traefik | Routage dynamique |
| Conteneurisation | Docker Compose | Isolation et portabilité |
| CI/CD | GitHub Actions | Automatisation |

---
