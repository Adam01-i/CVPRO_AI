# CVPro-AI Backend

## Matching CV ↔ Offre d'emploi

Le module d’IA du backend compare un CV et une offre d’emploi de manière déterministe, sécurisée et explicable. Il ne se contente pas d’un score aléatoire : il combine des éléments métier réels du profil candidat et de l’offre.

### Formule de score

Le score final est calculé ainsi :

- Skills : 40%
- Experience : 25%
- Education : 15%
- Semantic/Profile : 20%

$$
score = skillsScore \times 0.40 + experienceScore \times 0.25 + educationScore \times 0.15 + semanticScore \times 0.20
$$

Le résultat est arrondi et forcé dans l’intervalle 0–100.

### Principe

Le matching se base sur :

- compétences CV vs compétences de l’offre ;
- années et pertinence d’expérience professionnelle ;
- niveau d’études et exigence métier ;
- similarité lexicale / profil entre le résumé, les projets, les compétences et la description d’offre ;
- génération d’une explication et de recommandations personnalisées.

Le modèle Prisma `JobMatching` est utilisé pour stocker le résultat de manière idempotente :

- `cvId`
- `jobOfferId`
- `score`
- `skillsScore`
- `experienceScore`
- `educationScore`
- `semanticScore`
- `matchedSkills`
- `missingSkills`
- `explanation`
- `createdAt` / `updatedAt`

La clé unique `@@unique([cvId, jobOfferId])` évite les doublons grâce à `upsert`.

## Endpoints

Tous les endpoints d’IA sont protégés par JWT.

| Méthode | Endpoint | Auth | Fonction |
| --- | --- | --- | --- |
| POST | `/api/v1/ai/matching` | JWT | Calcule et enregistre un matching CV ↔ offre |
| GET | `/api/v1/ai/matching/:cvId/:jobOfferId` | JWT | Récupère le dernier matching enregistré |
| GET | `/api/v1/ai/matching` | JWT | Liste les matchings d’un utilisateur |
| GET | `/api/v1/ai/matching/cv/:cvId/top-jobs` | JWT | Classe les offres actives les plus pertinentes pour un CV |
| POST | `/api/v1/ai/analyze/cv/:cvId` | JWT | Analyse un CV et stocke le résultat `CV_ANALYSIS` |
| GET | `/api/v1/ai/analyze/cv/:cvId/latest` | JWT | Récupère la dernière analyse du CV |
| GET | `/api/v1/ai/analyze/cv/:cvId/history` | JWT | Historique des analyses du CV |
| POST | `/api/v1/ai/improve/cv/:cvId` | JWT | Génère des recommandations d’amélioration basées uniquement sur le CV |
| POST | `/api/v1/ai/improve/cv/:cvId/job/:jobOfferId` | JWT | Génère des recommandations ciblées sur un poste précis |
| GET | `/api/v1/ai/improve/cv/:cvId/latest` | JWT | Dernière recommandation d’amélioration du CV |
| GET | `/api/v1/ai/improve/cv/:cvId/history` | JWT | Historique des recommandations d’amélioration |

### Exemple de body

```json
{
  "cvId": "f1e6a273-7b4b-4de0-a5f1-c3e819c1afdb",
  "jobOfferId": "5d54c157-b8db-4424-b3a9-e6f9d44e1bc8"
}
```

### Exemple de réponse

```json
{
  "id": "0f4e8bb5-058d-4d14-8e5d-5dce4e3f0a2d",
  "cvId": "f1e6a273-7b4b-4de0-a5f1-c3e819c1afdb",
  "jobOfferId": "5d54c157-b8db-4424-b3a9-e6f9d44e1bc8",
  "score": 82,
  "skillsScore": 90,
  "experienceScore": 80,
  "educationScore": 75,
  "semanticScore": 82,
  "matchedSkills": ["Java", "Spring Boot", "PostgreSQL", "Docker"],
  "missingSkills": ["Kubernetes"],
  "explanation": "Le profil correspond fortement à l’offre. Les compétences Java, Spring Boot et PostgreSQL sont bien présentes et l’expérience est cohérente avec le poste. Kubernetes reste la compétence manquante la plus notable.",
  "recommendations": [
    "Ajouter Kubernetes dans vos compétences si vous avez déjà utilisé cette technologie.",
    "Mettre davantage en avant vos expériences backend.",
    "Préciser votre niveau d’expérience avec Spring Boot."
  ]
}
```

## Sécurité

Le matching applique les règles suivantes :

- le `userId` est toujours extrait du JWT et jamais du body ;
- l’utilisateur doit être authentifié ;
- le CV doit exister ;
- le CV doit appartenir à l’utilisateur connecté ;
- l’offre doit exister et être active ;
- si le CV appartient à un autre utilisateur, le service renvoie `403 Forbidden` ;
- si le CV ou l’offre est introuvable, le service renvoie `404 Not Found` ;
- aucune donnée sensible comme `passwordHash` n’est exposée.

## Architecture

Le module `src/ai` contient :

- `ai.controller.ts` : endpoints REST ;
- `ai.service.ts` : logique métier, scoring, sécurité, stockage ;
- `dto/match-cv.dto.ts` : validation UUID ;
- `SemanticMatcher` : abstraction pour remplacer le matching lexique local par un système embeddings/LLM plus tard.

L’architecture est pensée pour évoluer sans couplage fort vers un fournisseur d’IA. Une implémentation concrète peut remplacer `LocalSemanticMatcher` par un service basé sur OpenAI, embeddings ou un vecteur database sans réécrire les endpoints ni la persistance.

## Développement et validation

```bash
npm install
npx prisma generate
npm test -- --runInBand
npm run build
```

## Évolution future

Le moteur local actuel est déterministe et compatible avec les contraintes de production. Il peut évoluer vers :

- OpenAI / LLM pour l’analyse qualitative du CV ;
- embeddings pour la similarité sémantique ;
- vector database pour le ranking des offres ;
- RAG sur les offres, compétences et historique candidat.

La logique métiers reste stable, tandis que le composant de similarité sémantique peut être remplacé sans modifier l’API publique.
