<div align="center">

# 🎓 ForMini

### Centralisation des centres de formation en Tunisie

Une plateforme intelligente qui centralise les centres de formation et recommande les meilleures options selon le profil de chaque utilisateur.

[![React](https://img.shields.io/badge/React-17.0.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-2.0.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contribution)

</div>

---

## 📸 Aperçu

<div align="center">
  <img src="C:\Users\rassl\Downloads\landing-page.png" alt="Page d'accueil ForMini" width="100%">
  <p><em>Page d'accueil de la plateforme</em></p>
</div>

---

## 📖 Sommaire

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#️-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [API backend attendue](#-api-backend-attendue)
- [Contribution](#-contribution)
- [Licence](#-licence)
- [Auteur](#-auteur)

---

## 🧭 À propos

**ForMini** est une application web développée dans le cadre d'un Projet de Fin d'Études (PFE). Elle met en relation trois profils d'utilisateurs — **étudiants**, **centres de formation** et **administrateurs** — autour d'une plateforme unique permettant de publier, découvrir et s'inscrire à des formations partout en Tunisie.

Le frontend est construit avec **React** et **Tailwind CSS** (sur la base du template [Notus React](https://github.com/creativetimofficial/notus-react) de Creative Tim) et communique avec une API REST via **Axios**.

> ⚠️ Ce dépôt contient uniquement le **frontend**. Une API backend doit être disponible (par défaut sur `http://localhost:5000`) exposant les routes décrites plus bas.

---

## ✨ Fonctionnalités

### 🧑‍🎓 Espace étudiant
- Inscription / connexion sécurisée (authentification par token JWT)
- Recherche et filtrage des formations (centre, lieu, formateur, prix, date)
- Ajout de formations aux favoris
- Inscription à une formation et suivi de ses inscriptions
- Gestion du profil et des préférences
- Système de gamification (XP, badges)

### 🏫 Espace centre de formation
- Tableau de bord dédié avec statistiques et calendrier
- Création, modification et suppression de formations (avec image)
- Gestion des étudiants inscrits
- Gestion du profil du centre

### 🛡️ Espace administrateur
- Tableau de bord global (utilisateurs, centres, formations, badges)
- Validation ou rejet des centres de formation
- Validation ou rejet des formations proposées
- Gestion des utilisateurs (rôles, statut, XP)
- Gestion des types de badges
- Consultation des logs et tableaux de données

---

## 🛠️ Stack technique

| Catégorie | Technologies |
|---|---|
| **Framework UI** | React 17, React Router 5 |
| **Style** | Tailwind CSS 2, Notus React (Creative Tim) |
| **Graphiques** | Chart.js |
| **Requêtes HTTP** | Axios |
| **Icônes / UI** | Font Awesome, Popper.js |
| **Animations** | GSAP, react-loader-spinner |
| **Build** | Create React App (react-scripts), Gulp |

---

## 📁 Structure du projet

```
ForMini/
├── docs/
│   └── screenshots/           # Captures d'écran pour la documentation
├── public/                    # Fichiers statiques (index.html, favicon, manifest...)
├── src/
│   ├── Services/               # Appels API (Axios) vers le backend
│   │   ├── Apiauth.js           # Authentification (login/register)
│   │   ├── ApiUser.js           # Gestion des utilisateurs
│   │   ├── ApiCentre.js         # Gestion des centres de formation
│   │   ├── ApiFormation.js      # Gestion des formations
│   │   ├── apiInscriptions.js   # Gestion des inscriptions
│   │   └── ApiBadges.js         # Gestion des badges
│   ├── StudentsPages/          # Pages spécifiques à l'espace étudiant
│   ├── components/             # Composants réutilisables (Cards, Navbars, Sidebar...)
│   ├── layouts/                 # Layouts (Admin, Auth, Centre)
│   ├── views/                   # Pages principales (admin, auth, centre, landing...)
│   ├── assets/                  # Images et styles (Tailwind)
│   └── FavoritesContext.js      # Contexte React pour la gestion des favoris
├── package.json
└── tailwind.config.js
```

---

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version LTS recommandée)
- npm
- Une API backend fonctionnelle exposant les routes attendues ([voir ci-dessous](#-api-backend-attendue))

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/rasslen01/PFE-Formini.git
cd PFE-Formini

# 2. Installer les dépendances
npm install

# 3. Compiler les styles Tailwind (à refaire à chaque nouvelle classe utilisée)
npm run build:tailwind

# 4. Lancer l'application en mode développement
npm start
```

L'application est ensuite accessible sur [http://localhost:3000](http://localhost:3000).

> Sous Linux/macOS, l'installation complète peut se faire en une seule commande :
> ```bash
> npm run install:clean
> ```

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm start` | Lance le serveur de développement |
| `npm run build` | Génère le build de production |
| `npm test` | Lance les tests |
| `npm run build:tailwind` | Recompile le CSS Tailwind |
| `npm run eject` | Éjecte la configuration Create React App |

---

## 🔌 API backend attendue

Le frontend consomme une API REST dont l'URL de base par défaut est `http://localhost:5000`. Les principaux endpoints utilisés sont :

| Ressource | Endpoints |
|---|---|
| **Authentification** | `POST /auth/login`, `POST /auth/register` |
| **Utilisateurs** | `GET/POST/PUT/DELETE /users/...` |
| **Centres** | `GET/POST/PUT/DELETE /centres/...` (dont validation/rejet) |
| **Formations** | `GET/POST/PUT/DELETE /formations/...` (CRUD + filtres + validation) |
| **Inscriptions** | `POST/GET/PUT /inscriptions/...` |
| **Badges** | `GET/POST/PUT /badges/...` |

L'authentification se fait via un **token JWT** stocké dans le `localStorage` et transmis dans l'en-tête `Authorization: Bearer <token>` pour les routes protégées.

> Si vous changez l'URL de l'API, mettez à jour la constante `apiUrl` dans chaque fichier du dossier `src/Services/`.

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est basé sur le template Notus React, distribué sous licence MIT par Creative Tim. Voir le fichier `LICENSE.md` pour plus de détails.

---

## 👤 Auteur

Projet réalisé dans le cadre d'un Projet de Fin d'Études (PFE) par **[rasslen01](https://github.com/rasslen01)**.
