# PHASE 1 — ARCHITECTURE GÉNÉRALE

**Statut :** Validée par choix produit (Django + React + Tailwind, Clean Architecture, portail public d'abord)  
**Date :** 23 novembre 2026

---

## 1. Décisions technologiques

| Couche | Choix | Justification |
|--------|-------|---------------|
| Backend | **Django 5 + Django REST Framework** | Mature, sécurisé, admin, ORM robuste, idéal SI institutionnel |
| Architecture backend | **Clean Architecture** | Domaine isolé, cas d'usage testables, indépendance frameworks |
| API | DRF + **drf-spectacular** (OpenAPI 3) | Documentation API automatique et contractuelle |
| Frontend | **React 18 + TypeScript + Vite** | SPA publique maintenable, typage fort |
| Styles | **Tailwind CSS** | Design system institutionnel contrôlé |
| Base de données | **PostgreSQL** (SQLite en dev local initial) | Relationnel, contraintes, audit |
| Auth (prochaine itération) | Sessions Django + tokens API | Sécurité côté serveur |
| Docs code | Docstrings + OpenAPI + README modules | Exigence projet |

## 2. Charte visuelle institutionnelle RDC

- **Bleu ciel RDC** : `#007FFF` (primaire)
- **Jaune** : `#F7D618` (accent institutionnel)
- **Rouge** : `#CE1126` (alerte / urgence)
- **Neutres** : blanc, gris officiel
- **Logo** : emblème (armoiries) de la RDC
- **Formes** : **aucun arrondi** (`border-radius: 0` partout)
- Ton : site gouvernemental — sobre, hiérarchisé, lisible

## 3. Clean Architecture (backend)

```
backend/
  config/                 # settings, urls, wsgi
  apps/
    public_content/       # app Django (ORM models = infrastructure)
  domain/                 # entités + règles métier pures
  application/            # use cases / ports
  infrastructure/         # repositories ORM, storage, email
  interfaces/             # API REST, serializers, permissions
  tests/
```

**Règle de dépendance :** `interfaces → application → domain` ; `infrastructure` implémente les ports ; Django ORM ne fuit pas dans le domaine.

## 4. Frontend public

```
frontend/
  src/
    app/           # routes, providers
    pages/public/  # portail public
    shared/        # UI kit (0 radius), i18n, api client
    assets/        # emblème RDC
```

## 5. Sécurité (socle)

- HTTPS en production
- CSRF / CORS strict
- Headers sécurisés (django-cors-headers + middleware sécurité)
- Validation stricte entrées
- Rate limiting (DRF throttling)
- Secrets via variables d'environnement
- Pas de documents sensibles en public

## 6. Périmètre immédiat

**Portail public uniquement** (Phase 5 partielle) :
Accueil, Ambassade, Services, Visas, Actualités, FAQ, Contact, Assistance, Investir, Multilingue FR/EN/KO.

Espace usager et back-office : phases suivantes.

## 7. Données provisoires

Contenus institutionnels marqués **[PROVISOIRE]** jusqu'à validation Ambassade.
