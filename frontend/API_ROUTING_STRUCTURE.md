# Schéma simplifié — API, Routes et Routeur (Frontend)

Ce document présente comment le frontend est structuré autour de l’API, des routes et du routeur. Il inclut un schéma ASCII du flux et des explications concrètes fichier par fichier.

---

## Routeur et routes

- `src/main.tsx`
  - Monte l’application React (React 18) et rend `<App />`.
- `src/App.tsx`
  - Conteneur principal qui injecte le routeur via `<AppRouter />`.
- `src/AppRouter.tsx`
  - Déclare les routes avec `react-router-dom`:
    - `/login` -> `Login`
    - `/dashboard` -> `Dashboard_employe`
    - `/profil` -> `ProfilUtilisateur`
    - `/utilisateurs` -> `ExempleUtilisateurs`
    - `/collaborateurs` -> `Collab`
    - `/equipes` -> `Teams`
    - `/stats` -> `Stats`
    - `/calendrier` -> `Calendrier`
    - `/` et `*` -> redirigés vers `/dashboard` (route par défaut et 404).

Points clés:
- `BrowserRouter` est utilisé, avec une stratégie de redirection par défaut vers le dashboard.
- Les composants de page consomment les services quand ils ont besoin de données.

---

## Couche API (axios)

- `src/config/api.config.ts`
  - Configure l’URL de base et le timeout:
    - `baseURL: 'http://localhost:5000/api'`
    - `timeout: 10000` ms
- `src/services/api.service.ts`
  - Crée une instance axios partagée (`apiClient`) avec `baseURL` et en-têtes JSON.
  - Expose un service générique `ApiService` avec méthodes:
    - `get<T>(url: string): Promise<T>`
    - `post<T>(url: string, data: any): Promise<T>`
    - `put<T>(url: string, data: any): Promise<T>`
    - `delete<T>(url: string): Promise<T>`

Avantage:
- Centralise la configuration HTTP (URL, timeout, en-têtes) et permet d’ajouter plus tard des interceptors (auth, logs, retry, etc.).

---

## Service de domaine: Utilisateurs

- `src/services/utilisateurs.service.ts`
  - Définit `endpoint = '/utilisateurs'` et les opérations:
    - `getAll()` -> `GET /api/utilisateurs`
    - `getById(id)` -> `GET /api/utilisateurs/:id`
    - `create(data)` -> `POST /api/utilisateurs`
    - `update(id, data)` -> `PUT /api/utilisateurs/:id`
    - `delete(id)` -> `DELETE /api/utilisateurs/:id`
  - Typage via `src/types/utilisateur.types.ts` (modèle minimal aligné avec le backend).

---

## Exemple concret de flux de données

Composant: `src/Components/ExempleUtilisateurs.tsx`

1. Le composant se monte et lance `useEffect()`.
2. Appel de `utilisateursService.getAll()`.
3. Le service appelle `ApiService.get('/utilisateurs')`.
4. `ApiService` utilise axios avec `baseURL` -> requête réelle `GET http://localhost:5000/api/utilisateurs`.
5. Le backend répond en JSON.
6. Le state React est mis à jour (`setUtilisateurs(data)`), le composant se re-render.
7. Affichage de la liste d’utilisateurs typée `Utilisateur[]`.

Gestion d’erreur: un message lisible est affiché si la requête échoue (ex: indisponibilité du serveur, 4xx/5xx, timeout).

---

## Ajouter une nouvelle page et ses appels API — Guide rapide

1) Types (facultatif mais recommandé)
- Créer `src/types/maRessource.types.ts` avec l’interface TypeScript.

2) Service
- Créer `src/services/maRessource.service.ts`:
  - Définir `endpoint = '/ma-ressource'`.
  - Exposer `getAll/getById/create/update/delete` en s’appuyant sur `ApiService`.

3) Composant/page
- Créer un composant sous `src/Components` ou une page sous `src/Pages`.
- Consommer le service dans `useEffect` et afficher les données.

4) Route
- Ajouter l’entrée correspondante dans `src/AppRouter.tsx` (ex: `/ma-ressource`).

---

## Notes et bonnes pratiques

- Base URL: pour différents environnements (dev/stage/prod), envisager `import.meta.env` (Vite) pour injecter `VITE_API_BASE_URL` plutôt que de hardcoder l’URL.
- Interceptors axios: utiles pour l’authentification (ajout d’un header `Authorization`), le rafraîchissement de tokens, et la journalisation des erreurs.
- Timeouts et UX: en cas de lenteur réseau, prévoir un état de chargement et des messages d’erreur dédiés (déjà en place dans `ExempleUtilisateurs`).
- Redirections: la redirection `* -> /dashboard` simplifie la 404; si besoin, créer une vraie page 404 dédiée.

---

## Références fichiers

- Routeur et bootstrap
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/AppRouter.tsx`
- API
  - `src/config/api.config.ts`
  - `src/services/api.service.ts`
  - `src/services/utilisateurs.service.ts`
  - `src/types/utilisateur.types.ts`
- Exemple d’usage
  - `src/Components/ExempleUtilisateurs.tsx`

---

Dernière mise à jour: automatique via Copilot — basée sur l’état des fichiers au moment de la génération.

