# CVPro-AI

> Plateforme de création, gestion et optimisation de CV, avec suivi des candidatures, consultation d'offres d'emploi et analyse intelligente du matching entre un profil et une offre.

[![Backend](https://img.shields.io/badge/backend-NestJS%2011-E0234E?logo=nestjs&logoColor=white)](backend/)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-000000?logo=next.js&logoColor=white)](frontend/)
[![Database](https://img.shields.io/badge/database-PostgreSQL%2017-4169E1?logo=postgresql&logoColor=white)](docker-compose.yml)
[![ORM](https://img.shields.io/badge/ORM-Prisma%207-2D3748?logo=prisma&logoColor=white)](backend/prisma/schema.prisma)

## Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalites](#fonctionnalites)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Prerequis](#prerequis)
- [Installation locale](#installation-locale)
- [Configuration](#configuration)
- [Lancer le projet](#lancer-le-projet)
- [Structure du repository](#structure-du-repository)
- [API](#api)
- [Modele de donnees](#modele-de-donnees)
- [Securite](#securite)
- [Tests et qualite](#tests-et-qualite)
- [Captures des interfaces](#captures-des-interfaces)
- [Deploiement](#deploiement)
- [Depannage](#depannage)
- [Pistes d'evolution](#pistes-devolution)

## Vue d'ensemble

CVPro-AI est une application web full-stack destinée aux candidats qui souhaitent centraliser leur parcours professionnel et améliorer leur recherche d'emploi.

L'application permet de :

- créer plusieurs CV structurés et personnalisables ;
- renseigner expériences, formations, compétences, projets, certifications, langues, téléphones et liens ;
- choisir un modèle et une couleur d'accent pour un CV ;
- consulter des offres d'emploi et déposer une candidature avec un CV ;
- suivre l'état de ses candidatures ;
- analyser un CV et obtenir des recommandations d'amélioration ;
- calculer un score de correspondance entre un CV et une offre ;
- administrer les entreprises et les offres avec un compte `ADMIN`.

Le projet est organisé en deux applications indépendantes dans le même repository :

- `backend/` : API REST NestJS, authentification JWT, logique métier, Prisma et PostgreSQL ;
- `frontend/` : application Next.js avec App Router, interface utilisateur et clients API typés.

## Fonctionnalites

### Gestion du compte

- inscription et connexion ;
- récupération de l'utilisateur courant ;
- modification du mot de passe ;
- profil utilisateur avec informations personnelles et image éventuelle ;
- persistance du jeton JWT côté navigateur via `localStorage`.

### Gestion des CV

Chaque CV peut contenir :

- titre, résumé et profession ;
- coordonnées et adresse structurée ;
- expériences professionnelles ;
- formations ;
- compétences avec niveau et années d'expérience ;
- projets et technologies ;
- certifications ;
- langues ;
- numéros de téléphone multiples ;
- liens LinkedIn, GitHub, portfolio ou liens personnalisés ;
- modèle de rendu et couleur d'accent ;
- statut actif/public.

### Emploi et candidatures

- consultation paginée et filtrable des offres ;
- consultation des entreprises ;
- candidature à une offre avec sélection d'un CV et lettre de motivation ;
- consultation de ses candidatures ;
- retrait d'une candidature ;
- gestion administrative des entreprises, offres et statuts ;
- suivi des statuts : `DRAFT`, `APPLIED`, `UNDER_REVIEW`, `INTERVIEW`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.

### Intelligence et aide à la candidature

Le module IA actuel fonctionne localement et de manière déterministe. Il ne dépend pas encore d'un fournisseur externe d'IA.

Il propose :

- analyse structurée d'un CV ;
- historique des analyses ;
- recommandations d'amélioration générales ;
- recommandations ciblées sur une offre ;
- matching CV/offre avec score global et sous-scores ;
- compétences communes et compétences manquantes ;
- explication et recommandations associées ;
- classement des offres les plus pertinentes pour un CV.

Le score de matching est calculé selon la pondération suivante :

- compétences : `40 %` ;
- expérience : `25 %` ;
- formation : `15 %` ;
- similarité de profil : `20 %`.

```text
score = skillsScore * 0.40
      + experienceScore * 0.25
      + educationScore * 0.15
      + semanticScore * 0.20
```

L'implémentation sémantique locale est isolée derrière une abstraction afin de pouvoir évoluer ultérieurement vers des embeddings, un LLM ou une base vectorielle.

## Architecture

```mermaid
flowchart LR
    Browser["Navigateur"] --> Frontend["Next.js 16\nApp Router"]
    Frontend -->|"/api/v1"| Backend["NestJS 11\nAPI REST"]
    Backend --> Auth["JWT\nGuards & Roles"]
    Backend --> Prisma["Prisma 7"]
    Prisma --> PostgreSQL["PostgreSQL 17"]
    Backend --> Uploads["uploads/\nassets statiques"]
    Backend --> AI["Matching et analyses\nlocales déterministes"]
```

### Flux principal

1. Le navigateur affiche l'interface Next.js.
2. Le frontend appelle l'API versionnée avec `fetch`.
3. Le client API ajoute le jeton `Bearer` lorsqu'un utilisateur est connecté.
4. NestJS valide les DTO avec `ValidationPipe`.
5. Les guards vérifient le JWT et, pour les opérations d'administration, le rôle `ADMIN`.
6. Les services métier utilisent Prisma pour lire ou modifier PostgreSQL.
7. Les résultats sont renvoyés en JSON au frontend.

## Stack technique

| Couche | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4/PostCSS |
| Backend | NestJS 11, TypeScript, Express |
| Authentification | Passport, JWT, bcrypt |
| Validation | `class-validator`, `class-transformer` |
| Persistance | PostgreSQL 17, Prisma 7, `@prisma/adapter-pg` |
| Uploads | Multer, stockage mémoire côté réception, fichiers servis sous `/uploads/` |
| Tests backend | Jest 30, Supertest |
| Infrastructure locale | Docker Compose |

## Prerequis

- Node.js compatible avec les versions utilisées par Next.js 16 et NestJS 11 ;
- npm ;
- Docker et Docker Compose ;
- un port libre `3000` pour le frontend et `4000` pour l'API ;
- le port `5437` libre pour PostgreSQL local.

## Installation locale

Depuis la racine du repository :

```bash
git clone https://github.com/Adam01-i/CVPRO_AI
cd CVPRO-AI
```

### 1. Démarrer PostgreSQL

```bash
docker compose up -d postgres
docker ps --filter name=cvpro-postgres
```

Le service est accessible sur `localhost:5437` depuis la machine hôte.

### 2. Installer et préparer le backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run build
```

Pour le développement, `npx prisma migrate dev` peut être utilisé lorsque de nouvelles migrations sont créées localement.

### 3. Installer le frontend

Dans un autre terminal :

```bash
cd frontend
npm install
cp .env.example .env
```

Les fichiers `.env` sont ignorés par Git : ils doivent rester locaux et ne doivent jamais contenir de secret commité.

## Configuration

### Backend : `backend/.env`

| Variable | Exemple | Description |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://cvpro:cvpro_password@localhost:5437/cvpro_ai?schema=public` | Connexion PostgreSQL utilisée par Prisma |
| `PORT` | `4000` | Port d'écoute de l'API |
| `JWT_SECRET` | `change-me-in-production` | Secret de signature des JWT |
| `JWT_EXPIRES_IN` | `7d` | Durée de validité du JWT |
| `CORS_ORIGINS` | `http://localhost:3000` | Origines autorisées, séparées par des virgules |

### Frontend : `frontend/.env`

| Variable | Exemple | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `/api/v1` | Préfixe utilisé par les clients API dans le navigateur |
| `API_SERVER_URL` | `http://localhost:4000/api/v1` | URL serveur du backend utilisée par la configuration Next.js |
| `ALLOWED_DEV_ORIGINS` | `http://localhost:3000` | Origines autorisées en développement |

En développement local, la configuration par défaut utilise le préfixe frontend `/api/v1`, qui est relayé vers l'API NestJS sur le port `4000`.

## Lancer le projet

### Mode développement

Terminal 1, backend :

```bash
cd backend
npm run start:dev
```

Terminal 2, frontend :

```bash
cd frontend
npm run dev
```

URLs utiles :

- application : [http://localhost:3000](http://localhost:3000) ;
- API : [http://localhost:4000/api/v1](http://localhost:4000/api/v1) ;
- PostgreSQL : `localhost:5437`.

### Mode production local

```bash
cd backend
npm run build
npm run start:prod
```

```bash
cd frontend
npm run build
npm run start
```

## Structure du repository

```text
CVPRO-AI/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── ai/              # analyses, recommandations, matching
│   │   ├── auth/            # inscription, connexion, JWT, rôles
│   │   ├── cvs/             # CV et sous-ressources
│   │   ├── jobs/            # entreprises, offres, candidatures
│   │   ├── prisma/           # client Prisma partagé
│   │   ├── storage/          # gestion du stockage
│   │   └── users/            # profil utilisateur
│   ├── generated/prisma/    # client Prisma généré
│   └── package.json
├── frontend/
│   ├── src/app/             # pages App Router
│   ├── src/components/      # composants UI et métier
│   ├── src/contexts/        # contexte d'authentification
│   ├── src/lib/api/         # clients HTTP par domaine
│   ├── src/types/           # types de l'API
│   └── package.json
├── docker-compose.yml       # PostgreSQL local
├── README.md                # notes historiques de démarrage
└── readme2.md               # documentation complète du projet
```

## API

L'API est préfixée par `/api/v1`. Les routes protégées nécessitent :

```http
Authorization: Bearer <accessToken>
```

### Authentification

| Méthode | Route | Accès |
| --- | --- | --- |
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/me` | JWT |
| `POST` | `/auth/change-password` | JWT |

### CV

| Méthode | Route | Fonction |
| --- | --- | --- |
| `GET` | `/cvs` | Lister les CV de l'utilisateur |
| `POST` | `/cvs` | Créer un CV |
| `GET` | `/cvs/:id` | Consulter un CV |
| `PATCH` | `/cvs/:id` | Modifier un CV |
| `DELETE` | `/cvs/:id` | Supprimer un CV |
| `PATCH` | `/cvs/:id/activate` | Activer un CV |
| `...` | `/cvs/:cvId/experiences`, `/educations`, `/skills`, `/projects`, `/certifications`, `/languages`, `/phones`, `/links` | Gérer les sous-ressources du CV |

Les sous-ressources suivent le même modèle REST : `POST`, `GET`, `PATCH` et `DELETE` selon la ressource.

### Emploi et candidatures

| Méthode | Route | Accès / fonction |
| --- | --- | --- |
| `GET` | `/jobs/companies` | Lister les entreprises |
| `GET` | `/jobs/companies/:id` | Consulter une entreprise |
| `GET` | `/jobs/offers` | Lister et filtrer les offres |
| `GET` | `/jobs/offers/:id` | Consulter une offre |
| `POST` | `/jobs/offers/:id/apply` | Déposer une candidature, JWT |
| `GET` | `/jobs/applications/me` | Voir ses candidatures, JWT |
| `GET` | `/jobs/applications/:id` | Consulter une candidature autorisée, JWT |
| `PATCH` | `/jobs/applications/:id/withdraw` | Retirer sa candidature, JWT |
| `POST/PATCH/DELETE` | `/jobs/companies`, `/jobs/offers` | Administration, `ADMIN` |
| `PATCH` | `/jobs/offers/:id/status` | Activer/désactiver une offre, `ADMIN` |
| `PATCH` | `/jobs/applications/:id/status` | Modifier le statut, `ADMIN` |

### IA et matching

| Méthode | Route | Fonction |
| --- | --- | --- |
| `POST` | `/ai/analyze/cv/:cvId` | Analyser un CV |
| `GET` | `/ai/analyze/cv/:cvId/latest` | Dernière analyse |
| `GET` | `/ai/analyze/cv/:cvId/history` | Historique des analyses |
| `GET` | `/ai/analyze/:analysisId` | Consulter une analyse |
| `POST` | `/ai/improve/cv/:cvId` | Recommandations générales |
| `POST` | `/ai/improve/cv/:cvId/job/:jobOfferId` | Recommandations ciblées |
| `GET` | `/ai/improve/cv/:cvId/latest` | Dernière recommandation |
| `GET` | `/ai/improve/cv/:cvId/history` | Historique des recommandations |
| `POST` | `/ai/matching` | Calculer un matching |
| `GET` | `/ai/matching/:cvId/:jobOfferId` | Récupérer un matching |
| `GET` | `/ai/matching` | Lister les matchings |
| `GET` | `/ai/matching/cv/:cvId/top-jobs` | Classer les offres pour un CV |

Exemple de requête de matching :

```bash
curl -X POST http://localhost:4000/api/v1/ai/matching \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"cvId":"<cv-id>","jobOfferId":"<job-offer-id>"}'
```

## Modele de donnees

Le schéma Prisma couvre notamment :

- `User` : identité, rôle, authentification et relations ;
- `CV` : document principal du candidat ;
- `Experience`, `Education`, `Project`, `Certification`, `Language` ;
- `Skill` et `CVSkill` : catalogue et rattachement des compétences ;
- `CVPhone` et `CVLink` : coordonnées multiples ;
- `Company`, `JobOffer`, `JobOfferSkill` ;
- `JobApplication` : candidature et statut ;
- `AIAnalysis` : analyse, matching ou amélioration ;
- `JobMatching` : résultat idempotent d'un couple CV/offre.

Les migrations sont versionnées dans `backend/prisma/migrations/`. Après une modification du schéma :

```bash
cd backend
npx prisma migrate dev --name description-de-la-migration
npx prisma generate
```

## Securite

Les règles principales implémentées par l'API sont :

- authentification par JWT ;
- mots de passe hachés avec bcrypt ;
- validation et transformation globales des DTO ;
- rejet des propriétés non autorisées avec `whitelist` et `forbidNonWhitelisted` ;
- contrôle d'accès par propriétaire du CV ;
- contrôle des rôles pour les opérations d'administration ;
- `userId` dérivé du JWT plutôt que d'une donnée envoyée par le client ;
- absence de `passwordHash` dans les réponses utilisateur ;
- vérification de l'existence et de l'état actif des offres ;
- configuration CORS explicite via `CORS_ORIGINS`.

En production, remplacer impérativement les valeurs d'exemple, notamment `JWT_SECRET` et le mot de passe PostgreSQL, par des secrets gérés par l'environnement de déploiement.

## Tests et qualite

### Backend

```bash
cd backend
npm test
npm run test:cov
npm run test:e2e
npm run build
npm run lint
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

Avant une pull request, vérifier au minimum :

1. les migrations et le client Prisma sont à jour ;
2. le backend compile ;
3. les tests backend passent ;
4. le frontend compile ;
5. les routes protégées refusent un utilisateur non authentifié ;
6. un utilisateur ne peut pas consulter ou modifier les données d'un autre utilisateur.

## Captures des interfaces

Cette section est volontairement prête à être enrichie avec les captures réelles de l'application. Déposer les images dans `docs/screenshots/` puis remplacer les chemins ci-dessous.

### Page d'accueil

<!-- Ajouter une capture : docs/screenshots/home.png -->
![Page d'accueil](docs/screenshots/home.png)

### Inscription et connexion

<!-- Ajouter une capture : docs/screenshots/auth-login.png -->
![Connexion](docs/screenshots/auth-login.png)

<!-- Ajouter une capture : docs/screenshots/auth-register.png -->
![Inscription](docs/screenshots/auth-register.png)

### Tableau de bord

<!-- Ajouter une capture : docs/screenshots/dashboard.png -->
![Tableau de bord](docs/screenshots/dashboard.png)

### Liste des CV

<!-- Ajouter une capture : docs/screenshots/cv-list.png -->
![Liste des CV](docs/screenshots/cv-list.png)

### Création et édition d'un CV

<!-- Ajouter une capture : docs/screenshots/cv-editor.png -->
![Éditeur de CV](docs/screenshots/cv-editor.png)

### Aperçu d'un CV

<!-- Ajouter une capture : docs/screenshots/cv-preview.png -->
![Aperçu d'un CV](docs/screenshots/cv-preview.png)

### Offres d'emploi

<!-- Ajouter une capture : docs/screenshots/jobs.png -->
![Offres d'emploi](docs/screenshots/jobs.png)

### Détail d'une offre et candidature

<!-- Ajouter une capture : docs/screenshots/job-application.png -->
![Candidature](docs/screenshots/job-application.png)

### Suivi des candidatures

<!-- Ajouter une capture : docs/screenshots/applications.png -->
![Suivi des candidatures](docs/screenshots/applications.png)

### Analyse et recommandations IA

<!-- Ajouter une capture : docs/screenshots/ai-analysis.png -->
![Analyse IA](docs/screenshots/ai-analysis.png)

### Profil utilisateur

<!-- Ajouter une capture : docs/screenshots/profile.png -->
![Profil utilisateur](docs/screenshots/profile.png)

> Conseil : utiliser des captures cohérentes en largeur, masquer les données personnelles et nommer les fichiers avec le format `fonction-ecran.png`.

## Deploiement

Le repository fournit actuellement l'infrastructure locale PostgreSQL via Docker Compose. Pour un déploiement applicatif, prévoir au minimum :

- une base PostgreSQL managée ou persistante ;
- un service backend exécutant `npm run start:prod` après `npm run build` ;
- un service frontend exécutant `npm run start` après `npm run build` ;
- les variables d'environnement injectées par le gestionnaire de secrets ;
- un stockage persistant pour les fichiers uploadés ;
- HTTPS et une liste CORS restreinte ;
- l'exécution de `npx prisma migrate deploy` pendant la livraison ;
- des logs, une supervision et des sauvegardes PostgreSQL.

Le fichier `docker-compose.yml` fourni est adapté au développement local et ne constitue pas à lui seul une configuration de production.

## Depannage

### PostgreSQL ne démarre pas

```bash
docker compose ps
docker compose logs postgres
nc -vz localhost 5437
```

Vérifier qu'aucun autre service n'utilise le port `5437`.

### Prisma ne trouve pas la base

Vérifier `backend/.env`, puis exécuter :

```bash
cd backend
npx prisma generate
npx prisma migrate status
```

### Le frontend ne joint pas l'API

Vérifier :

- que le backend écoute bien sur `4000` ;
- que `API_SERVER_URL` pointe vers `http://localhost:4000/api/v1` ;
- que `NEXT_PUBLIC_API_URL` vaut `/api/v1` en développement ;
- que `CORS_ORIGINS` autorise `http://localhost:3000` ;
- que le navigateur ne conserve pas un ancien jeton dans `localStorage`.

### Le port est déjà utilisé

Modifier `PORT` dans `backend/.env` et adapter `API_SERVER_URL` dans `frontend/.env` ainsi que la configuration de proxy correspondante.

## Pistes d'evolution

- ajouter une génération PDF fiable des CV ;
- brancher un fournisseur LLM ou un modèle d'embeddings derrière l'abstraction sémantique existante ;
- introduire une base vectorielle pour le ranking avancé ;
- ajouter des notifications de candidature ;
- compléter la couverture de tests frontend et end-to-end ;
- ajouter une gestion de stockage objet pour les images et fichiers ;
- fournir des conteneurs applicatifs et une pipeline CI/CD ;
- renforcer l'observabilité et la gestion des événements métier.

## Contribution

1. Créer une branche dédiée.
2. Garder les changements ciblés et cohérents avec le découpage backend/frontend.
3. Ajouter ou mettre à jour les tests concernés.
4. Vérifier lint, build et migrations.
5. Décrire clairement le comportement modifié dans la pull request.

## Licence

Le backend est actuellement déclaré privé avec une licence `UNLICENSED` dans son manifeste npm. Vérifier la politique de distribution du projet avant toute publication externe.