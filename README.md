# MR Patrol — GitLab MR Guard

Tableau de bord mystique pour surveiller les Merge Requests d'un projet GitLab self-hosted.

---

## Prérequis

- Node.js 18+
- Un accès à une instance GitLab self-hosted
- Un Personal Access Token GitLab avec le scope `read_api`

---

## Installation

```bash
npm install
npm run dev
```

---

## Connexion à GitLab

### 1. Créer un Personal Access Token

1. Connecte-toi à ton instance GitLab
1. Va dans **Preferences → Access Tokens** (ou `https://gitlab.exemple.com/-/profile/personal_access_tokens`)
1. Clique sur **Add new token**
1. Remplis les champs :
   - **Token name** : `mr-patrol` (ou ce que tu veux)
   - **Expiration date** : optionnel
   - **Scopes** : coche uniquement **`read_api`**
1. Clique sur **Create personal access token**
1. **Copie le token immédiatement** — il ne sera plus affiché après rechargement

### 2. Configurer l'application

1. Lance l'app (`npm run dev`)
1. Clique sur **PARAMÈTRES** en bas à gauche de la sidebar
1. Clique sur **Connexion GitLab** dans le popover
1. Remplis le formulaire :

| Champ | Exemple | Description |
| --- | --- | --- |
| URL de l'instance | `https://gitlab.exemple.com` | URL racine de ton GitLab, sans slash final |
| Personal Access Token | `glpat-xxxxxxxxxxxxxxxxxxxx` | Le token cree a l'etape precedente |
| Chemin du projet | `mon-groupe/mon-projet` | Le path visible dans l'URL GitLab |

1. Clique sur **SE CONNECTER**

La configuration est sauvegardée dans le `localStorage` du navigateur — tu n'auras pas à la ressaisir à chaque visite.

### Trouver le chemin du projet

Le chemin du projet correspond à la partie de l'URL après le domaine :

```text
https://gitlab.exemple.com/mon-groupe/mon-projet
                           ^^^^^^^^^^^^^^^^^^^^^^
                           → mon-groupe/mon-projet
```

Pour un projet imbriqué dans plusieurs groupes :

```text
https://gitlab.exemple.com/equipe/backend/api-service
                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^
                           → equipe/backend/api-service
```

---

## Données récupérées

L'application utilise l'**API GraphQL** de GitLab (`/api/graphql`) pour récupérer :

- Les MRs ouvertes (avertissements divins, compteur en attente)
- Les MRs créées ce mois-ci (stats, lignes ajoutées/supprimées, temps de merge)
- Les membres du projet (page Sabbat / Haut Conseil)

> **CORS** : L'API GraphQL de GitLab autorise les requêtes cross-origin par défaut. Si ton instance a une configuration réseau restrictive (reverse proxy, CSP, etc.), assure-toi que les requêtes depuis `localhost` (en dev) ou ton domaine de déploiement sont autorisées.

---

## Déconnexion

Clique sur **DÉCONNEXION** en bas à gauche de la sidebar pour effacer la configuration et les données.

---

## Stack technique

| Technologie | Usage |
| --- | --- |
| React 19 + TypeScript | UI |
| Vite | Build & dev server |
| Redux Toolkit | State global (donnees GitLab + animations) |
| React Router v6 | Navigation |
| react-i18next | FR / EN |
| SCSS | Styles dark/light |
| FontAwesome | Icones |
| GitLab GraphQL API | Donnees projet |
