# Projet Bibliothèque – EPITA Web 2025-2026

## Auteurs
- Nom Prénom : Cuanbinh-Michelon Matthieu

## Description
Application web de gestion de bibliothèque (frontend + backend).

## Stack technique
- **Backend** : Node.js, Express, better-sqlite3, jsonwebtoken
- **Frontend** : Vanilla JS (ES modules), CSS custom, pas de framework externe

## Architecture backend
Pattern **Model-Core-Controller** :
- `core/` — database.js (SQLite init + seed), auth.js (JWT middleware)
- `models/` — authorModel.js, bookModel.js
- `controllers/` — authController.js, authorController.js, bookController.js, dashboardController.js
- `server.js` — routes Express REST

## Installation et lancement

```bash
cd back
npm install
npm start
```

L'application est disponible sur **http://localhost:3000**

## Identifiants
- Login : `admin`
- Mot de passe : `password`

## Fonctionnalités
- Authentification JWT
- Tableau de bord (chiffres clés)
- Recherche et liste des livres
- Recherche et liste des auteurs
- Fiche livre (modification)
- Fiche auteur (modification + liste des livres)
- Création d'un livre
- Création d'un auteur

## API REST

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/login | Connexion |
| GET | /api/dashboard | Statistiques |
| GET | /api/books | Liste livres (+ ?search=) |
| GET | /api/books/:id | Détail livre |
| POST | /api/books | Créer un livre |
| PUT | /api/books/:id | Modifier un livre |
| GET | /api/authors | Liste auteurs (+ ?search=) |
| GET | /api/authors/:id | Détail auteur + ses livres |
| POST | /api/authors | Créer un auteur |
| PUT | /api/authors/:id | Modifier un auteur |
