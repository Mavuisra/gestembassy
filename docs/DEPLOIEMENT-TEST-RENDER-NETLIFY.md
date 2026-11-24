# Déploiement test — Render (API) + Netlify (front)

Objectif : démo courte, pas une prod institutionnelle.

## Prérequis

- Repo GitHub : `https://github.com/Mavuisra/gestembassy`
- Compte [Render](https://render.com) + [Netlify](https://netlify.com)
- Base : **SQLite** (pas de Postgres pour ce test). Sur Render free, les données sont éphémères (reset au cold start / redeploy).

## 1. API sur Render

### Option Blueprint

1. Dashboard Render → **New** → **Blueprint**
2. Connecter le repo `gestembassy`
3. Valider `render.yaml`
4. URL API actuelle : `https://gestembassy.onrender.com`

### Variables à renseigner (Dashboard → Environment)

Remplacer par vos URLs réelles :

| Clé | Exemple |
|-----|---------|
| `DJANGO_ALLOWED_HOSTS` | `gestembassy.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://drcembassyseoul.netlify.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://drcembassyseoul.netlify.app` |
| `PUBLIC_APP_URL` | `https://drcembassyseoul.netlify.app` |

**Supprimer `DATABASE_URL`** dans l’Environment Render (sinon Django tente Postgres).
Si `DATABASE_URL` pointe vers une base morte/vide, `/api/v1/health/` et `/api/v1/news/`
renvoient **503** `database_unavailable` (plus un faux positif health vert).

Le `startCommand` lance `migrate` + `seed_public_content` + `seed_staff` + `verify_db`
(échec explicite si les tables publiques manquent), puis Gunicorn **1 worker** (SQLite).

Diagnostic rapide : `GET /api/v1/health/` (champ `database`) ou
`EXPOSE_ERROR_DETAILS=true` temporairement sur Render.

Comptes seed : voir `README.md` (à changer après le test).

## 2. Front sur Netlify

1. **Add new site** → Import from Git → `gestembassy`
2. Build settings (déjà dans `netlify.toml`) :
   - Base directory : `frontend`
   - Build command : `npm run build`
   - Publish directory : `frontend/dist`
3. Dans `netlify.toml`, aligner le proxy `/api/*` sur **votre** URL Render réelle
4. Deploy

Avec le proxy Netlify, pas besoin de `VITE_API_BASE` (le front garde `/api/v1`).

Sinon, sans proxy : variable Netlify `VITE_API_BASE=https://VOTRE-API.onrender.com/api/v1` + CORS côté Render.

## 3. Vérifications rapides

- Front : `https://drcembassyseoul.netlify.app/`
- API health : `https://gestembassy.onrender.com/api/v1/health/`
- Back-office : `/backoffice/login`
- Formulaire contact / liste actualités

## Limites du test

- Cold start Render free (~30–60 s au réveil)
- SQLite + disque éphémère : données / media perdus à chaque redémarrage
- E-mail en console (pas d’SMTP réel)
