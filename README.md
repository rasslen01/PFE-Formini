# PFE-Formini 🎓

**PFE-Formini** est une application web de gestion de formations, développée dans le cadre d'un Projet de Fin d'Études (PFE). Elle met en relation trois types d'utilisateurs — **étudiants**, **centres de formation** et **administrateurs** — autour d'une plateforme permettant de publier, découvrir et s'inscrire à des formations.

Le frontend est construit avec **React** et **Tailwind CSS**, sur la base du template [Notus React](https://github.com/creativetimofficial/notus-react) (Creative Tim), et communique avec une API REST via **Axios**.

> ⚠️ Ce dépôt contient uniquement le **frontend**. Il nécessite une API backend disponible (par défaut sur `http://localhost:5000`) exposant les routes décrites plus bas.

---

## ✨ Fonctionnalités

### Espace étudiant
- Inscription / connexion (authentification par token JWT)
- Consultation des formations disponibles, avec filtres (centre, lieu, formateur, prix, date)
- Ajout de formations aux favoris
- Inscription à une formation et suivi de ses inscriptions (`MesInscriptions`)
- Gestion des préférences et des paramètres du profil
- Système de badges / gamification (XP, badges attribués)

### Espace centre de formation
- Tableau de bord dédié (statistiques, calendrier)
- Création, modification et suppression de formations (y compris avec image)
- Gestion des étudiants inscrits
- Gestion du profil du centre

### Espace administrateur
- Tableau de bord global (utilisateurs, centres, formations, badges)
- Validation / rejet des centres de formation
- Validation / rejet des formations proposées
- Gestion des utilisateurs (rôles, statut actif/inactif, XP)
- Gestion des types de badges
- Consultation des logs et des tableaux de données

---

## 🛠️ Stack technique

| Catégorie | Technologies |
|---|---|
| Framework UI | React 17, React Router 5 |
| Style | Tailwind CSS 2, Notus React (Creative Tim) |
| Graphiques | Chart.js |
| Requêtes HTTP | Axios |
| Icônes / UI | Font Awesome, Popper.js |
| Animations | GSAP, react-loader-spinner |
| Build | react-scripts (Create React App), Gulp |

---

## 📁 Structure du projet

```
PFE-Formini/
├── public/                   # Fichiers statiques (index.html, favicon, manifest...)
├── src/
│   ├── Services/              # Appels API (Axios) vers le backend
│   │   ├── Apiauth.js          # Authentification (login/register)
│   │   ├── ApiUser.js          # Gestion des utilisateurs
│   │   ├── ApiCentre.js        # Gestion des centres de formation
│   │   ├── ApiFormation.js     # Gestion des formations
│   │   ├── apiInscriptions.js  # Gestion des inscriptions
│   │   └── ApiBadges.js        # Gestion des badges
│   ├── StudentsPages/         # Pages spécifiques à l'espace étudiant
│   ├── components/            # Composants réutilisables (Cards, Navbars, Sidebar, Dropdowns...)
│   ├── layouts/                # Layouts (Admin, Auth, Centre)
│   ├── views/                  # Pages principales (admin, auth, centre, landing...)
│   ├── assets/                 # Images et styles (Tailwind)
│   └── FavoritesContext.js     # Contexte React pour la gestion des favoris
├── package.json
└── tailwind.config.js
```

---

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version LTS recommandée)
- npm
- Une API backend fonctionnelle exposant les routes attendues (voir section [API](#-api-backend-attendue))

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

- `POST /auth/login`, `POST /auth/register`
- `GET/POST/PUT/DELETE /users/...` (gestion des utilisateurs, profil)
- `GET/POST/PUT/DELETE /centres/...` (gestion des centres, validation/rejet)
- `GET/POST/PUT/DELETE /formations/...` (CRUD formations, filtres, validation/rejet)
- `POST/GET/PUT /inscriptions/...` (inscription à une formation, suivi, annulation)
- `GET/POST/PUT /badges...` (gestion des badges et de la gamification)

L'authentification se fait via un **token JWT** stocké dans le `localStorage` et transmis dans l'en-tête `Authorization: Bearer <token>` pour les routes protégées.

> Si vous changez l'URL de l'API, pensez à mettre à jour la constante `apiUrl` dans chacun des fichiers du dossier `src/Services/`.

---

## 🤝 Contribution

Les contributions sont les bienvenues :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Le projet est basé sur le template Notus React, distribué sous licence MIT par Creative Tim. Se référer au fichier `LICENSE.md` du dépôt pour plus de détails.

---

## 👤 Auteur

Projet réalisé dans le cadre d'un Projet de Fin d'Études (PFE) par [rasslen01](https://github.com/rasslen01).
