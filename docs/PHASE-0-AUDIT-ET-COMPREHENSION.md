# PHASE 0 — AUDIT ET COMPRÉHENSION DU PROJET

**Projet :** Plateforme numérique officielle de l'Ambassade de la République démocratique du Congo en République de Corée  
**Document :** Dossier de conception initiale (Phase 0)  
**Statut :** En attente de validation  
**Date :** 23 novembre 2026  
**Source :** Document Directeur de Conception et de Développement  

---

## 1. Résumé exécutif

Le projet vise à concevoir et développer un **système d'information institutionnel, diplomatique et consulaire** pour l'Ambassade de la RDC en République de Corée — et non un site vitrine.

La plateforme s'organise en **trois espaces** :
- **Portail public** (information, orientation, préparation des démarches)
- **Espace usager** (pré-demandes, documents, rendez-vous, suivi)
- **Back-office administratif** (traitement, CMS, rôles, audit, statistiques)

Elle doit être **trilingue** (FR / EN / KO), **responsive**, **sécurisée**, et conçue pour une utilisation quotidienne par les agents et le public.

**État actuel du dépôt :** le workspace ne contient **aucun code applicatif**. Seul le document directeur est présent. Le projet part donc d'une feuille blanche technique.

**Décision de cadrage Phase 0 :** aucun développement n'est engagé. Cette phase produit l'analyse, la cartographie et la priorisation nécessaires avant l'architecture (Phase 1).

---

## 2. Objectifs généraux et spécifiques

### 2.1 Objectif général
Moderniser, digitaliser et centraliser les services institutionnels et consulaires de l'Ambassade.

### 2.2 Objectifs spécifiques
| # | Objectif | Mesure de succès |
|---|----------|------------------|
| O1 | Informer le public (institution, visas, procédures, actualités) | Contenu administrable, multilingue, accessible |
| O2 | Permettre la préparation et le dépôt de pré-demandes | Formulaires dynamiques + pièces + n° de référence |
| O3 | Permettre la prise de rendez-vous consulaire | Créneaux réels, anti-doublon, confirmation |
| O4 | Permettre le suivi des dossiers | Statuts contrôlés, historique, notifications |
| O5 | Gérer les urgences et l'assistance | Circuit prioritaire, attribution, confidentialité |
| O6 | Donner aux agents un outil opérationnel | Back-office avec permissions et audit |
| O7 | Préparer l'interopérabilité GestionAmbassa | Couche d'intégration abstraite, sans fausse promesse |

### 2.3 Non-objectifs (explicitement hors périmètre immédiat)
- Délivrance automatique de visas ou de passeports
- Invention de tarifs, délais, procédures ou coordonnées officielles
- Intégration réelle GestionAmbassa sans documentation/API fournie
- Déploiement sur infrastructure institutionnelle sans autorisation

---

## 3. Analyse fonctionnelle détaillée

### 3.1 Nature du système
Système d'information à composantes :
1. **CMS institutionnel** (pages, actualités, FAQ, documents)
2. **Workflows administratifs** (demandes, statuts, pièces, agents)
3. **Système de réservation** (calendrier, créneaux, confirmations)
4. **Portail citoyen / usager** (compte, dossiers, notifications)
5. **Centre d'opérations d'urgence** (incidents, priorisation)
6. **Couche d'intégration** (GestionAmbassa, e-mail, SMS, cartes)

### 3.2 Principes métier transverses
- Une **pré-demande** n'est jamais une décision officielle.
- Les **statuts** évoluent selon des transitions contrôlées.
- Les **documents personnels** sont privés, jamais en URL publique.
- Les **contenus institutionnels** sont administrables (pas hardcodés).
- Les **données manquantes** sont marquées comme provisoires.
- Les **services externes non configurés** sont clairement indiqués comme tels.

### 3.3 Domaines fonctionnels
| Domaine | Description | Criticité |
|---------|-------------|-----------|
| Identité & accès | Comptes usagers, agents, rôles, sessions | Critique |
| Contenu institutionnel | Pages, actualités, FAQ, multilinguisme | Haute |
| Procédures consulaires | Visas, passeports, état civil, enregistrement | Critique |
| Documents | Upload, stockage, versions, accès | Critique |
| Rendez-vous | Calendrier, créneaux, convocations | Haute |
| Suivi dossiers | Tracking, historique, observations | Critique |
| Urgences | Signalements, attribution, résolution | Critique |
| Contact / orientation | Routage intelligent des demandes | Moyenne |
| Promotion (éco/culture) | Contenu éditorial sectoriel | Moyenne |
| Administration | CMS, tarifs, stats, audit | Critique |
| Intégrations | E-mail, SMS, PDF, QR, GestionAmbassa | Haute (progressive) |

---

## 4. Présentation des trois espaces

### Espace A — Portail public
**Accès :** sans authentification  
**Rôle :** informer, orienter, préparer  
**Contenu principal :**
- Présentation Ambassade / Ambassadeur / organigramme
- Relations bilatérales RDC–Corée
- Services consulaires (conditions, documents, tarifs administrables)
- Actualités / communiqués / événements
- Investissement, tourisme, coopération universitaire
- FAQ, recherche, contact intelligent, localisation
- Entrée vers pré-demandes / RDV / suivi (redirection vers usager si besoin)

### Espace B — Espace usager
**Accès :** authentifié  
**Rôle :** réaliser et suivre des démarches  
**Contenu principal :**
- Profil
- Pré-demandes (visa, enregistrement, identité, état civil…)
- Upload de pièces
- Rendez-vous
- Suivi dossiers + historique
- Notifications
- Téléchargements autorisés

### Espace C — Back-office
**Accès :** personnel autorisé (RBAC)  
**Rôle :** traiter, administrer, piloter  
**Contenu principal :**
- Tableau de bord opérationnel
- Traitement des demandes et pièces
- Gestion RDV / incidents / usagers
- CMS (contenus, FAQ, tarifs, horaires, documents)
- Rôles & permissions
- Statistiques
- Journal d'audit

**Exigence :** les trois espaces partagent une architecture technique commune (API, modèle de données, sécurité, i18n).

---

## 5. Cartographie des utilisateurs

### 5.1 Acteurs externes
| Acteur | Besoins principaux | Authentification |
|--------|--------------------|------------------|
| Visiteur | Information, orientation | Non |
| Voyageur (visa) | Conditions, pré-demande, RDV, suivi | Oui pour dépôt/suivi |
| Ressortissant congolais | Enregistrement, passeport, état civil, assistance | Oui pour démarches |
| Investisseur / partenaire | Contenu économique, contact | Non (contact possible) |
| Étudiant / université | Coopérations, bourses | Non (candidature éventuelle plus tard) |
| Presse | Communiqués, contact presse | Non |

### 5.2 Acteurs internes
| Rôle | Mission principale |
|------|--------------------|
| Super administrateur | Configuration globale, sécurité, rôles |
| Administrateur | Paramétrage plateforme, utilisateurs |
| Responsable consulaire | Supervision dossiers / priorisation |
| Agent consulaire | Instruction des demandes, pièces, statuts |
| Responsable communication | Actualités, pages, FAQ |
| Agent administratif | Support, RDV, orientation |
| Responsable économique | Contenu investissement / coopération |
| Responsable assistance | Incidents urgents, suivi interventions |

### 5.3 Systèmes externes
| Système | Rôle | Statut connu |
|---------|------|--------------|
| GestionAmbassa | SI interne Ambassade | À clarifier (API/docs inconnues) |
| Fournisseur e-mail | Notifications | À configurer |
| Fournisseur SMS | Rappels / alertes | Architecture prévue, non configuré |
| Naver Map / KakaoMap | Localisation | Intégration à prévoir |
| Stockage objet / fichiers | Documents sensibles | À définir en Phase 1 |

---

## 6. Inventaire exhaustif des modules

| ID | Module | Espace(s) | Priorité métier |
|----|--------|-----------|-----------------|
| M1 | UX / Multilinguisme / Responsive / Recherche / FAQ | A, B, C | P0 |
| M2 | Services consulaires (visa, enregistrement, identité, état civil, bibliothèque) | A, B, C | P0 |
| M3 | Rendez-vous consulaires | A, B, C | P0 |
| M4 | Suivi des dossiers | B, C | P0 |
| M5 | Assistance & urgences + guide pratique | A, C | P0 |
| M6 | Informations institutionnelles & actualités | A, C | P1 |
| M7 | Promotion économique, tourisme, culture, univ. | A, C | P2 |
| M8 | Contact intelligent & localisation | A, C | P1 |
| M9 | Back-office (RBAC, dashboard, CMS, docs, audit) | C | P0 |
| M10 | Intégration GestionAmbassa | Backend | P2 (préparation P1) |
| Transverse | Auth, notifications, PDF/QR, sécurité, i18n, logs | Tous | P0 |

---

## 7. Inventaire des fonctionnalités

### 7.1 Portail public
- Sélecteur de langue FR/EN/KO
- Navigation institutionnelle
- Pages Ambassade / Ambassadeur / organigramme / bilatéral
- Catalogue des services consulaires
- Fiches procédures (conditions, pièces, tarifs, délais) — données admin
- Entrée pré-demande visa
- FAQ dynamique par catégorie
- Recherche globale (procédures, tarifs, formulaires, actualités)
- Actualités / communiqués / événements
- Rubriques investissement / découvrir RDC / coopération univ.
- Contact orienté par catégorie + FAQ contextuelle
- Localisation + liens cartes coréennes
- Urgences : contacts + signalement
- Guide pratique de vie en Corée

### 7.2 Espace usager
- Inscription / connexion / récupération de compte
- Profil usager
- Wizard pré-demande visa (10 étapes)
- Enregistrement consulaire
- Demandes passeport / laissez-passer / perte
- Demandes état civil / légalisations / authentifications
- Upload sécurisé (formats, taille, pièces obligatoires)
- Génération numéro de référence
- Prise / modification / annulation RDV (selon règles)
- Suivi dossier par référence + vérification d'identité
- Notifications in-app (+ e-mail quand configuré)
- Historique des démarches
- Téléchargement documents autorisés

### 7.3 Back-office
- Auth agents + RBAC configurable
- Dashboard KPI réels
- File de demandes (filtres, recherche, affectation)
- Instruction dossier (pièces, observations, statuts)
- Demande de pièces complémentaires
- Gestion RDV (créneaux, fériés, absences, capacité)
- Vérification QR / convocations
- Gestion incidents d'urgence
- CMS contenus multilingues
- Gestion tarifs / horaires / jours fériés
- Bibliothèque documentaire
- Gestion usagers internes et externes
- Statistiques et graphiques
- Journal d'audit complet

### 7.4 Transverse technique
- Validation serveur
- Gestion d'erreurs centralisée
- Stockage privé documents
- Rate limiting / anti-spam
- OpenAPI / versionnement API
- Environnements (dev/staging/prod)
- Tests automatisés
- Couche d'intégration abstraite GestionAmbassa

---

## 8. Parcours utilisateurs principaux

### P1 — Voyageur : pré-demande de visa
1. Consulte conditions (public)
2. Crée un compte / se connecte
3. Sélectionne type de visa
4. Remplit le wizard (identité → passeport → voyage → hébergement → pièces)
5. Vérifie, accepte conditions, soumet
6. Reçoit n° de référence
7. Suit le dossier / reçoit notifications
8. (Optionnel) prend un RDV

### P2 — Ressortissant : enregistrement / document d'identité
1. Accède à la procédure
2. Authentification
3. Formulaire + pièces
4. Soumission → référence
5. Suivi / éventuel complément de pièces
6. RDV si requis pour retrait/dépôt physique

### P3 — Usager : rendez-vous
1. Choisit service + motif
2. Voir dates/créneaux disponibles
3. Réserve
4. Confirmation + PDF + QR (si services configurés)
5. Rappel e-mail/SMS (si configurés)

### P4 — Personne en difficulté : urgence
1. Accède au canal urgence (visible)
2. Remplit signalement (nature, localisation, niveau)
3. Ticket créé avec priorité
4. Agent assistance traite / clôture
5. Traçabilité renforcée

### P5 — Agent consulaire : instruction
1. Connexion back-office
2. Consulte file / recherche dossier
3. Vérifie pièces et données
4. Demande complément ou change statut (selon permission)
5. Action journalisée

### P6 — Responsable communication : publication
1. Rédige actualité (brouillon)
2. Traduit FR/EN/KO
3. Programme / publie
4. Visible sur portail public

---

## 9. Règles métier principales

### 9.1 Demandes
- Toute demande soumise reçoit un **identifiant unique** et un **numéro de référence** lisible.
- Une demande incomplète (pièces obligatoires manquantes) ne peut pas être soumise.
- Les statuts autorisés : Brouillon → Soumis → Reçu → En cours d'instruction → Documents manquants → En attente de validation → Approuvé | Refusé → Prêt pour retrait → Clôturé.
- Les transitions sont **contrôlées** (machine à états) ; pas de saut arbitraire.
- Toute modification de statut est **auditée** (acteur, date, avant/après, motif éventuel).

### 9.2 Documents
- Formats et tailles validés côté serveur.
- Stockage privé ; accès contrôlé par permission + lien de dossier.
- Association obligatoire document ↔ demande.
- Pas d'exposition directe dans un dossier web public.

### 9.3 Rendez-vous
- Respect des horaires, fériés (RDC + Corée), absences, capacité.
- Interdiction des doubles réservations conflictuelles.
- Confirmation + (PDF/QR/e-mail/SMS) selon disponibilité des services.

### 9.4 Contenu institutionnel
- Aucune invention de données officielles.
- Données provisoires clairement marquées.
- Contenu multilingue géré proprement (pas de pages dupliquées désorganisées).

### 9.5 Sécurité / confidentialité
- RBAC côté serveur.
- Urgences = données particulièrement protégées.
- Sessions et secrets gérés selon bonnes pratiques.
- Journalisation des actions sensibles.

### 9.6 Intégrations
- Si service externe non configuré : UI/mécanisme présents, statut « non configuré » explicite.
- GestionAmbassa : couche abstraite tant que l'API n'est pas connue.

---

## 10. Matrice des rôles et permissions (préliminaire)

Légende : C = créer, L = lire, M = modifier, V = valider/changer statut, S = supprimer, A = administrer

| Ressource | Visiteur | Usager | Agent consulaire | Resp. consulaire | Resp. com. | Resp. assistance | Admin | Super admin |
|-----------|----------|--------|------------------|------------------|------------|------------------|-------|-------------|
| Contenu public publié | L | L | L | L | C/L/M | L | A | A |
| FAQ / actualités | L | L | L | L | C/L/M/V | L | A | A |
| Sa propre demande | — | C/L/M* | L/M/V | L/M/V | — | L** | A | A |
| Toutes demandes | — | — | L/M/V*** | L/M/V | — | L** | A | A |
| Documents d'une demande | — | C/L (siens) | L | L | — | L** | A | A |
| Rendez-vous | — | C/L/M (siens) | L/M | L/M/A | — | L | A | A |
| Incidents urgence | C (signalement) | C/L (siens) | L*** | L | — | C/L/M/V | A | A |
| Tarifs / procédures config | L (publié) | L | L | M | — | — | A | A |
| Utilisateurs agents | — | — | — | L | — | — | A | A |
| Rôles / permissions | — | — | — | — | — | — | L | A |
| Audit logs | — | — | — | L*** | — | L*** | L | A |
| Statistiques | — | — | L*** | L | L*** | L*** | L | A |

\* Usager : modification limitée (brouillon / complément demandé)  
\*\* Selon périmètre assistance  
\*\*\* Selon périmètre service / permission fine  

> Cette matrice sera affinée en Phase 1 (modèle de permissions) et Phase 3 (schéma).

---

## 11. Liste des entités métier

### Identité & accès
- User, Profile, Role, Permission, RolePermission, Session/RefreshToken, AuditLog

### Procédures & demandes
- ProcedureType, ProcedureRequirement, VisaCategory  
- Application (demande), ApplicationStatusHistory  
- ApplicantProfile (données demandeur)  
- Document, DocumentType, ApplicationDocument  

### Rendez-vous
- Service, AppointmentReason  
- OpeningHours, Holiday, AgentAbsence  
- TimeSlotConfig, Appointment  

### Urgences
- Incident, IncidentCategory, IncidentNote, IncidentAssignment  

### Contenu & i18n
- Page, PageTranslation  
- NewsArticle, NewsTranslation  
- FaqCategory, FaqItem, FaqTranslation  
- DownloadableFile  
- Tariff, TariffTranslation  
- ContactRequest  
- EconomicSectorSheet, UniversityOpportunity  

### Notifications & intégrations
- Notification, NotificationTemplate  
- OutboxEvent / IntegrationJob (pour e-mail, SMS, GestionAmbassa)  
- GeneratedArtifact (PDF, QR)

### Paramètres
- EmbassySettings (horaires, contacts — admin)  
- FeatureFlag / IntegrationConfig (services externes)

---

## 12. Dépendances entre les modules

```
M1 (i18n/UX) ─────────────────────────────────────────────► tous les modules UI
M9 (Auth/RBAC/Audit) ─────────────────────────────────────► B, C, parties de A sécurisées
M2 (Procédures) ──► Documents ──► M4 (Suivi) ──► Notifications
M2 ──► M3 (RDV) [souvent après ou pendant une demande]
M5 (Urgences) ──► Notifications + Audit renforcé
M6/M7/M8 (Contenu/Contact) ──► CMS (M9)
M4/M3/M2 ──► PDF/QR ──► Notifications
Tous flux métier ──► couche Intégration (M10) [optionnelle au début]
```

**Ordre de fondation technique recommandé :**
1. Socle (auth, RBAC, i18n, erreurs, storage)
2. Modèle procédures + documents + statuts
3. Portail public contenu
4. Espace usager demandes
5. RDV
6. Back-office traitement
7. Urgences
8. Notifications avancées
9. Intégration GestionAmbassa

---

## 13. Risques techniques et fonctionnels

| ID | Risque | Impact | Probabilité | Mitigation |
|----|--------|--------|-------------|------------|
| R1 | Absence de procédures/tarifs officiels validés | Contenu incorrect / blocage métier | Haute | Données provisoires marquées + CMS admin |
| R2 | GestionAmbassa sans API documentée | Intégration impossible à court terme | Haute | Adapter abstrait + registre des besoins |
| R3 | Complexité formulaires dynamiques multi-procédures | Retards, dette technique | Haute | Moteur de formulaires/config par procédure |
| R4 | Sécurité documents personnels | Fuite de données, atteinte diplomatique | Moyenne | Stockage privé, ACL, audit, scan fichiers |
| R5 | Multilinguisme mal conçu (surtout coréen) | UX dégradée, contenus incohérents | Moyenne | i18n UI + translations contenu en base |
| R6 | Charge calendrier RDV (conflits, fériés) | Surbookings | Moyenne | Contraintes DB + verrouillage transactionnel |
| R7 | Scope trop large (10 modules) | Livraison diluée | Haute | Versions MVP → V1 → V2 |
| R8 | E-mail/SMS non configurés | Parcours incomplets | Haute | Fallbacks UI + statut « non configuré » |
| R9 | Ambiguïté juridique conservation documents | Non-conformité | Moyenne | Politique à valider Ambassade |
| R10 | Attentes « délivrance automatique » | Confusion usagers | Moyenne | Libellés « pré-demande » partout |

---

## 14. Informations à obtenir auprès de l'Ambassade

### 14.1 Identité institutionnelle
- [ ] Coordonnées officielles (adresse FR/EN/KO, téléphone, e-mail)
- [ ] Horaires d'ouverture et jours de fermeture
- [ ] Identité visuelle (logo, armoiries, charte couleurs, polices autorisées)
- [ ] Message / biographie Ambassadeur (textes validés)
- [ ] Organigramme et intitulés officiels des services

### 14.2 Règles consulaires
- [ ] Liste officielle des catégories de visas et conditions
- [ ] Listes de pièces par procédure
- [ ] Tarifs officiels
- [ ] Délais indicatifs communicables
- [ ] Procédures passeport / laissez-passer / perte
- [ ] Procédures état civil / légalisations / authentifications
- [ ] Règles d'enregistrement consulaire

### 14.3 Opérations
- [ ] Capacité RDV par service / créneau
- [ ] Processus d'affectation des dossiers
- [ ] Canaux d'urgence officiels
- [ ] Politique de conservation / purge des documents
- [ ] Qui valide les publications (circuit éditorial)

### 14.4 Technique / interopérabilité
- [ ] Existence d'API GestionAmbassa + docs + auth
- [ ] Formats d'échange souhaités
- [ ] Contraintes d'hébergement (pays, cloud, on-prem)
- [ ] Exigences SSO / MFA éventuelles
- [ ] Fournisseurs e-mail / SMS imposés

### 14.5 Juridique
- [ ] Mentions légales / politique de confidentialité
- [ ] Consentements nécessaires sur formulaires
- [ ] Cadre applicable (lois coréennes / RDC / diplomatique)

---

## 15. Proposition de découpage en versions

### MVP (Version 0.1) — Socle exploitable
- Auth usager + agents + RBAC de base
- Portail public : accueil, services, pages institutionnelles (contenu provisoire)
- i18n FR/EN/KO (UI)
- 1 procédure pilote : **pré-demande visa** (wizard + documents + référence)
- Suivi dossier basique
- Back-office : file des demandes + changement de statut + audit minimal
- FAQ + contact simple
- E-mail : architecture prête (envoi réel si config)

### Version 1.0 — Opérations consulaires
- Enregistrement consulaire
- Documents d'identité (passeport / perte / laissez-passer)
- État civil (sous-ensemble prioritaire)
- Rendez-vous complets (calendrier, fériés, capacité)
- CMS actualités + bibliothèque documentaire
- Dashboard statistiques
- Urgences (signalement + traitement)
- PDF confirmation RDV + QR

### Version 1.1 — Enrichissement
- Contact intelligent complet
- Recherche globale avancée
- Guide pratique Corée
- Contenu économique / tourisme / univ.
- SMS (si fournisseur)
- Permissions fines + reporting avancé

### Version 2.0 — Interopérabilité
- Intégration GestionAmbassa réelle (si API)
- Automatisations avancées
- Optimisations perf / accessibilité / hardening prod

---

## 16. Estimation de la complexité relative des modules

Échelle : 1 (faible) → 5 (très élevée)

| Module | Complexité | Justification |
|--------|------------|---------------|
| M1 UX/i18n/Recherche | 4 | Trilingue + Hangul + contenus dynamiques |
| M2 Services consulaires | 5 | Formulaires dynamiques, pièces, règles variables |
| M3 Rendez-vous | 4 | Concurrence, fériés, capacités, artefacts |
| M4 Suivi dossiers | 3 | Machine à états + historique |
| M5 Urgences | 3 | Sensibilité données + priorisation |
| M6 Institutionnel/CMS | 3 | Éditorial multilingue |
| M7 Promo éco/culture | 2 | Surtout contenu |
| M8 Contact/localisation | 2–3 | Routage + cartes |
| M9 Back-office | 5 | RBAC, ops, CMS, stats, audit |
| M10 GestionAmbassa | 4–5 | Inconnue (dépend de l'existant) |
| Notifications/PDF/QR | 3 | Intégrations + fiabilité |

**Charge globale relative :** projet de **grande taille** (SI métier + portail + admin), incompatible avec une livraison monolithique unique.

---

## 17. Proposition de critères d'acceptation (transverses)

Une fonctionnalité est acceptée seulement si :
1. L'interface existe sur le(s) espace(s) concerné(s)
2. Les données sont persistées correctement
3. Les validations client **et** serveur sont en place
4. Les permissions sont appliquées côté serveur
5. Les erreurs sont gérées et compréhensibles (i18n)
6. Les cas vides / loading / erreur sont couverts
7. Les tests automatisés critiques passent
8. Les services externes non configurés sont explicitement signalés
9. Aucune donnée officielle inventée n'est présentée comme définitive
10. L'audit est présent pour les actions sensibles

### Exemples de critères MVP
- **Pré-demande visa :** un usager peut soumettre une demande complète et obtenir un n° de référence ; un agent peut la voir et changer son statut selon transitions autorisées.
- **i18n :** bascule FR/EN/KO sans casse de layout ; messages d'erreur traduits.
- **Documents :** un fichier hors format/taille est rejeté ; un document n'est pas accessible par URL publique anonyme.
- **RBAC :** un agent communication ne peut pas valider une demande de visa.

---

## État du dépôt (constat Phase 0)

```
ambadrcor/
├── # DOCUMENT DIRECTEUR DE CONCEPTION.txt
└── docs/
    └── PHASE-0-AUDIT-ET-COMPREHENSION.md   ← ce document
```

- **Code frontend :** absent  
- **Code backend :** absent  
- **Base de données :** absente  
- **CI/CD :** absent  
- **Tests :** absents  

Le projet est en **démarrage conception**, pas en reprise de code existant.

---

## Synthèse pour validation

### Éléments suffisamment définis
- Vision produit et nature SI (pas vitrine)
- Trois espaces (public / usager / back-office)
- Modules fonctionnels et responsabilités
- Exigence trilingue et responsive
- Workflow visa en 10 étapes
- Statuts de dossiers et besoin de machine à états
- Rôles internes principaux
- Règles : pas d'invention, pas de fausse intégration, phases validées
- Exigence sécurité documents + audit
- Ordre de phases imposé (0 → 11)

### Éléments à clarifier
- Stack technique exacte (à proposer en Phase 1, à valider)
- Données officielles Ambassade (tarifs, procédures, contacts, charte)
- Réalité de GestionAmbassa (API ou non)
- Hébergement cible et contraintes souveraineté / conformité
- Périmètre exact du MVP (validation de la proposition §15)
- Politique de conservation documentaire
- MFA obligatoire ou non pour agents
- Qui fournit les traductions coréennes institutionnelles

### Décisions proposées (à valider)
1. **Démarrer strictement par Phase 0 puis Phase 1** — pas de code avant validation architecture.
2. **Architecture monolithique modulaire** (pas de microservices au départ).
3. **MVP centré visa + suivi + back-office minimal + portail i18n**.
4. **Contenu institutionnel provisoire** clairement labellisé jusqu'à validation Ambassade.
5. **Couche d'intégration GestionAmbassa** dès le socle, sans connecteur réel tant que non documenté.
6. **Moteur de procédures configurable** plutôt que formulaires hardcodés un par un.
7. Stack candidate à détailler en Phase 1 (proposition préliminaire non engageante) :
   - Frontend : Next.js (App Router) + TypeScript
   - Backend : API modulaire (NestJS ou Next route handlers + services) — arbitrage Phase 1
   - DB : PostgreSQL
   - Auth : sessions sécurisées / JWT selon architecture retenue
   - Storage : S3-compatible privé
   - i18n : next-intl ou équivalent + translations contenu en DB

### Prochaines étapes
1. **Votre validation** de ce dossier Phase 0
2. Ajustements éventuels (MVP, rôles, priorités)
3. **Phase 1 — Architecture générale** (diagrammes, choix tech argumentés, structure dossiers)
4. Puis seulement : UX/UI → modèle données → initialisation code

---

**FIN DE LA PHASE 0 — EN ATTENTE D'AUTORISATION EXPLICITE POUR LA PHASE 1.**
