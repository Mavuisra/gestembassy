# Guide d’installation — Ambassade RDC (Séoul)

Portail de l’Ambassade de la République démocratique du Congo en République de Corée.  
Deux parties : une **API** (backend) et un **site web** (frontend). Sur ta machine, tu lances les deux.

---

## Ce qu’il te faut avant

| Outil | Version conseillée | Pour quoi |
|--------|--------------------|-----------|
| **Python** | 3.12 | Backend |
| **Node.js** | 22 (ou 20+) | Frontend |
| **Git** | — | Cloner le projet |

Vérifie rapidement :

```bash
python --version
node --version
npm --version
```

---

## 1. Récupérer le projet

```bash
git clone https://github.com/Mavuisra/gestembassy.git
cd gestembassy
```

---

## 2. Backend (API Django)

### Étape A — Environnement Python

Depuis la **racine** du projet :

**Windows (PowerShell)**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### Étape B — Fichier de config

```bash
cd backend
copy .env.example .env
```

Sur macOS/Linux : `cp .env.example .env`

Pour le développement local, le fichier d’exemple suffit (SQLite, pas besoin de Postgres).

### Étape C — Base de données + données de démo

Toujours dans `backend`, avec le venv activé :

```bash
python manage.py migrate
python manage.py seed_public_content
python manage.py seed_staff
```

- `migrate` crée les tables  
- `seed_public_content` charge actualités, FAQ, services…  
- `seed_staff` crée un compte agent pour le back-office  

### Étape D — Lancer l’API

```bash
python manage.py runserver
```

Laisse cette fenêtre ouverte. L’API tourne sur :

| Adresse | Rôle |
|---------|------|
| http://127.0.0.1:8000/api/v1/ | API |
| http://127.0.0.1:8000/api/docs/ | Documentation interactive |
| http://127.0.0.1:8000/admin/ | Admin Django |
| http://127.0.0.1:8000/api/v1/health/ | Santé (doit répondre OK) |

**Comptes de démo (à changer hors local)**

| Usage | Identifiant | Mot de passe |
|-------|-------------|--------------|
| Agent back-office | `agent@ambadrcor.local` | `AgentChangeMe!2026` |

---

## 3. Frontend (site React)

Ouvre un **deuxième** terminal (laisse le backend tourner).

### Étape A — Installer les dépendances

```bash
cd frontend
npm install
```

### Étape B — Lancer le site

```bash
npm run dev
```

Le navigateur : **http://127.0.0.1:5173/**

| Page | URL |
|------|-----|
| Portail public | http://127.0.0.1:5173/ |
| Connexion usager | http://127.0.0.1:5173/compte/connexion |
| Back-office agents | http://127.0.0.1:5173/backoffice/login |
| Visiter la RDC | http://127.0.0.1:5173/tourisme |
| Bourses | http://127.0.0.1:5173/bourses |

En local, le front appelle déjà l’API sur `http://127.0.0.1:8000` (proxy Vite). Pas besoin de fichier `.env` pour démarrer.

---

## 4. Checklist « ça marche »

1. Backend lancé → http://127.0.0.1:8000/api/v1/health/ répond `ok`  
2. Frontend lancé → http://127.0.0.1:5173/ affiche l’accueil  
3. Menu **Actualités** charge des articles  
4. Back-office : connexion avec `agent@ambadrcor.local`  

---

## 5. Commandes utiles

**Backend** (venv activé, dossier `backend`)

```bash
python manage.py runserver          # démarrer l’API
pytest                              # lancer les tests
python manage.py seed_public_content
python manage.py seed_staff
```

**Frontend** (dossier `frontend`)

```bash
npm run dev       # développement
npm run build     # build de production
npm run preview   # prévisualiser le build
```

---

## 6. Problèmes fréquents

| Symptôme | Que faire |
|----------|-----------|
| `python` introuvable | Installe Python 3.12 et coche « Add to PATH » |
| Erreur d’activation du venv (Windows) | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` puis réessaie |
| Frontend sans données / erreurs réseau | Vérifie que le backend tourne bien sur le port 8000 |
| Port 8000 ou 5173 déjà pris | Ferme l’autre programme, ou lance `runserver 8001` / change le port Vite |
| Tables manquantes / erreurs DB | Refais `migrate` puis les deux `seed_*` |

---

## 7. Déploiement (Render + Netlify)

Pour mettre en ligne (API sur Render, site sur Netlify) :  
[`docs/DEPLOIEMENT-TEST-RENDER-NETLIFY.md`](docs/DEPLOIEMENT-TEST-RENDER-NETLIFY.md)

---

## Stack (rappel)

- **Backend :** Django + Django REST Framework  
- **Frontend :** React + TypeScript + Vite + Tailwind  
- **Base locale :** SQLite (aucun serveur SQL à installer pour commencer)

Bon courage — en cas de blocage, vérifie d’abord que les deux serveurs (8000 et 5173) tournent en même temps.
