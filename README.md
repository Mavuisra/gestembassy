# Plateforme Ambassade RDC — République de Corée

Portail numérique institutionnel (Django + React + Tailwind), architecture Clean Architecture.

## Stack

- **Backend :** Django 6 + DRF + drf-spectacular (OpenAPI) — Clean Architecture
- **Frontend :** React + TypeScript + Vite + Tailwind
- **Charte :** couleurs RDC, emblème officiel, **aucun arrondi**

## Démarrage rapide

### Backend

```bash
# depuis la racine
.\.venv\Scripts\activate
cd backend
python manage.py migrate
python manage.py seed_public_content
python manage.py runserver
```

- API : http://127.0.0.1:8000/api/v1/
- Docs OpenAPI : http://127.0.0.1:8000/api/docs/
- Admin Django : http://127.0.0.1:8000/admin/ (dev local : `admin` / `AdminChangeMe!2026` — à changer)
- Back-office API : http://127.0.0.1:8000/api/v1/backoffice/

```bash
python manage.py seed_staff
```

Agent back-office (dev) : `agent@ambadrcor.local` / `AgentChangeMe!2026`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Portail public : http://127.0.0.1:5173/
- Back-office : http://127.0.0.1:5173/backoffice/login

## Tests backend

```bash
cd backend
pytest
```

## Déploiement test (Render + Netlify)

Guide pas à pas : [`docs/DEPLOIEMENT-TEST-RENDER-NETLIFY.md`](docs/DEPLOIEMENT-TEST-RENDER-NETLIFY.md)

- **API** : Render (`render.yaml`) + **SQLite** (pas de `DATABASE_URL`)
- **Front** : Netlify (`netlify.toml`, proxy `/api/*` → Render)

## Phase actuelle

PHASE 5–6 (portail + espace usager) et PHASE 7 (back-office agents : demandes, RDV, incidents, contenu, stats, audit). PHASE 8 (notifications).

Contenus marqués **[PROVISOIRE]** en attendant validation institutionnelle.
