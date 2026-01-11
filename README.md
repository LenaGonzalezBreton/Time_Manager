# 🕒 Time Manager - Application de Gestion du Temps

Application web moderne de gestion du temps permettant aux employés d'enregistrer leurs horaires et aux managers de suivre les équipes et leurs KPI.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#️-stack-technique)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)
- [API](#-api)
- [Tests](#-tests)

## ✨ Fonctionnalités

### Pour les Employés
- ⏰ **Timer de pause** : Compteur interactif pour suivre les temps de pause
- 📊 **Dashboard personnel** : Vue d'ensemble des statistiques (présence, retards, heures travaillées)
- 📅 **Calendrier** : Visualisation des horaires de travail (présentiel/télétravail)
- 📈 **Statistiques** : Suivi des KPI personnels

### Pour les Managers
- 👥 **Gestion d'équipe** : Vue et gestion des membres de l'équipe
- 👤 **Gestion des utilisateurs** : Création et administration des comptes
- 📊 **Rapports** : Accès aux statistiques de l'équipe

### Design
- 🎨 **UI moderne** : Interface bleue professionnelle avec gradients
- 📱 **Responsive** : Compatible mobile et desktop
- ♿ **Accessible** : Contraste élevé et navigation claire
- 🌙 **Sidebar élégante** : Navigation intuitive avec états actifs

## ⚙️ Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Frontend** | React + TypeScript + Vite | React 18 |
| **Backend** | Node.js + Express + TypeScript | Node 20 |
| **ORM** | TypeORM | 0.3.x |
| **Base de données** | PostgreSQL | 16 |
| **Conteneurisation** | Docker + Docker Compose | - |
| **Styling** | TailwindCSS | 3.x |
| **Icons** | Lucide React | - |

## 🚀 Installation

### Prérequis
- Docker et Docker Compose installés
- Git

### Étapes

1. **Cloner le repository**
```bash
git clone <repository-url>
cd Time_Manager
```

2. **Créer le fichier `.env`** à la racine du projet
```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=time_manager
API_PORT=5000
FRONTEND_PORT=3000
DATABASE_URL=postgres://user:password@postgres_db:5432/time_manager
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

3. **Lancer l'application avec Docker**
```bash
docker-compose up -d
```

4. **Accéder à l'application**
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

## ⚙️ Configuration

### Variables d'environnement

Le projet utilise un unique fichier `.env` à la racine :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `POSTGRES_USER` | Utilisateur PostgreSQL | `user` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `password` |
| `POSTGRES_DB` | Nom de la base de données | `time_manager` |
| `API_PORT` | Port du backend | `5000` |
| `FRONTEND_PORT` | Port du frontend | `3000` |
| `DATABASE_URL` | URL de connexion complète | `postgres://...` |
| `JWT_SECRET` | Clé secrète pour JWT | `change-in-production` |
| `JWT_EXPIRES_IN` | Durée de validité du token | `24h` |

### Hot-reloading

Le projet est configuré pour le hot-reloading en développement :
- Les modifications du frontend sont visibles après un refresh (F5)
- Les modifications du backend redémarrent automatiquement le serveur

## 📖 Utilisation

### Comptes de test

Après le premier démarrage, des comptes de test sont créés :

**Manager :**
- Email : `alice.martin+mg1@example.test`
- Mot de passe : `pwd`

**Employé :**
- Email : `bob.durand+e1@example.test`
- Mot de passe : `pwd`

### Navigation

- **Dashboard** : Vue d'ensemble avec timer de pause et statistiques
- **Équipe** : Liste des membres de l'équipe (managers uniquement)
- **Utilisateurs** : Gestion des comptes (managers uniquement)
- **Calendrier** : Vue mensuelle des horaires de travail
- **Statistiques** : KPI détaillés

## 🏗️ Architecture

### Structure du projet

```
Time_Manager/
├── frontend/               # Application React
│   ├── src/
│   │   ├── Components/    # Composants réutilisables
│   │   ├── Pages/         # Pages de l'application
│   │   ├── contexts/      # Contextes React (Auth)
│   │   ├── services/      # Services API
│   │   └── types/         # Types TypeScript
│   └── Dockerfile
├── backend/               # API Node.js
│   ├── src/
│   │   ├── controllers/  # Contrôleurs Express
│   │   ├── entities/     # Entités TypeORM
│   │   ├── routes/       # Routes API
│   │   ├── services/     # Logique métier
│   │   └── migrations/   # Migrations de base de données
│   └── Dockerfile
├── docker-compose.yml    # Orchestration des services
└── .env                  # Variables d'environnement
```

### Services Docker

- **frontend_container** : Application React (port 3000)
- **backend_container** : API Express (port 5000)
- **postgres_db** : Base de données PostgreSQL (port 5432)

### Flux d'authentification

1. L'utilisateur se connecte via `/login`
2. Le backend génère un JWT token
3. Le token est stocké dans `localStorage`
4. Toutes les requêtes API incluent le token dans le header `Authorization`
5. Le backend vérifie le token et retourne les données

## 🔌 API

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription (managers uniquement)
- `GET /api/auth/me` - Utilisateur connecté

#### Utilisateurs
- `GET /api/utilisateurs` - Liste des utilisateurs
- `GET /api/utilisateurs/:id` - Détails d'un utilisateur
- `GET /api/utilisateurs/:id/horaires` - Horaires d'un utilisateur
- `GET /api/utilisateurs/:id/absences` - Absences d'un utilisateur
- `GET /api/utilisateurs/:id/indicateurs` - Indicateurs d'un utilisateur

#### Équipes
- `GET /api/equipes` - Liste des équipes
- `GET /api/equipes/:id` - Détails d'une équipe avec membres

#### Horaires
- `GET /api/horaires` - Liste des horaires
- `POST /api/horaires` - Créer un horaire

#### Absences
- `GET /api/absences` - Liste des absences
- `POST /api/absences` - Créer une absence

## 🧪 Tests

### Backend

```bash
cd backend
npm test
```

### Données de test

Le fichier `backend/src/test_data.sql` contient :
- 20 utilisateurs de test
- 5 équipes
- Horaires de janvier 2026 (jours ouvrables uniquement)
- Absences et indicateurs

## 🛠️ Développement

### Commandes utiles

**Redémarrer un service :**
```bash
docker-compose restart frontend
docker-compose restart backend
```

**Voir les logs :**
```bash
docker logs frontend_container
docker logs backend_container
docker logs postgres_db
```

**Accéder à la base de données :**
```bash
docker exec -it postgres_db psql -U user -d time_manager
```

**Rebuild complet :**
```bash
docker-compose down
docker-compose up -d --build
```

### Migrations de base de données

Les migrations TypeORM sont exécutées automatiquement au démarrage du backend.

Pour créer une nouvelle migration :
```bash
cd backend
npm run typeorm:generate -- -n MigrationName
```

## 📝 License

Ce projet est développé dans un cadre éducatif.

## 👥 Contributeurs

Projet développé par l'équipe TRINITY.
