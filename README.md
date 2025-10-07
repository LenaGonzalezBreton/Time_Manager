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
