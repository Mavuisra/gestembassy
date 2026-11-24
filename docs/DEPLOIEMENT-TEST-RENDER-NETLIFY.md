# Déploiement test — Render (API) + Netlify (front)

Objectif : démo courte, pas une prod institutionnelle.

## Prérequis

- Repo GitHub : `https://github.com/Mavuisra/gestembassy`
- Compte [Render](https://render.com) + [Netlify](https://netlify.com)
- Postgres Render free (1 DB / workspace, expire ~30 jours) **ou** [Neon](https://neon.tech) / Supabase → coller `DATABASE_URL`

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

Si vous n’utilisez pas la base Blueprint : créer une DB Postgres (Neon OK) et coller `DATABASE_URL`.

### Migrations + seed (obligatoire après 1er deploy)

Si `/api/v1/news/` ou le login back-office renvoient **500**, les tables Postgres manquent souvent.

Shell Render du service → :

```bash
python manage.py migrate --noinput
python manage.py seed_public_content
python manage.py seed_staff
```

Vérifier ensuite : `https://gestembassy.onrender.com/api/v1/health/` puis `/api/v1/news/`.

Comptes seed : voir `README.md` (à changer après le test).

Variable utile le temps du debug : `EXPOSE_ERROR_DETAILS=True` (détail du 500 dans le JSON).

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
- Disque éphémère : uploads media non persistants
- E-mail en console (pas d’SMTP réel)
- Postgres free Render expire après ~30 jours → Neon en secours
