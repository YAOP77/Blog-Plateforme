# Changelog

## [2025-11-04] - Migration Vercel Blob Storage

### ✨ Nouveautés

- **Vercel Blob Storage** : Upload d'images maintenant compatible avec le déploiement serverless Vercel
- **Documentation complète** : Ajout de guides détaillés pour le déploiement et le troubleshooting

### 🔄 Changements

#### API Routes
- `src/app/api/articles/route.ts` :
  - Remplacement de `writeFile()` par Vercel Blob `put()`
  - Images stockées sur CDN global au lieu du système de fichiers local
  
- `src/app/api/profile/route.ts` :
  - Même migration pour les avatars utilisateurs

#### Configuration
- `next.config.ts` :
  - Ajout de `remotePatterns` pour autoriser les images Vercel Blob
  - Support du domaine `**.public.blob.vercel-storage.com`

#### Dépendances
- ➕ Ajout de `@vercel/blob` v2.0.0

### 📚 Documentation

Nouveaux fichiers ajoutés :
- `VERCEL_SETUP.md` : Guide complet de configuration Vercel
- `MIGRATION_IMAGES.md` : Explications sur la migration des images
- `TROUBLESHOOTING.md` : Guide de dépannage détaillé
- `CHANGELOG.md` : Historique des changements

Mises à jour :
- `README.md` : Ajout de liens vers la documentation Vercel Blob

### 🐛 Corrections

- Correction de l'erreur 500 lors de l'upload d'images sur Vercel
- Tous les ESLint warnings et erreurs TypeScript résolus
- Build production passe à 100% sans erreurs

### ⚠️ Breaking Changes

**Important** : Les images uploadées doivent maintenant être stockées sur Vercel Blob.

**Impact** :
- Les anciennes images locales (dans `/public/uploads/`) ne fonctionneront pas sur Vercel
- Variable d'environnement `BLOB_READ_WRITE_TOKEN` **obligatoire** pour le déploiement
- Les nouvelles images ont des URLs complètes (https://....blob.vercel-storage.com/...)

**Migration** :
- Les images statiques dans `public/images/` continuent de fonctionner
- Voir `MIGRATION_IMAGES.md` pour migrer les anciennes images uploadées

### ✅ Tests

- ✅ Build production réussi
- ✅ Lint sans erreurs
- ✅ Types TypeScript valides
- ✅ Pas de warnings ESLint

### 📦 Variables d'Environnement Requises

Pour le déploiement sur Vercel, assurez-vous d'avoir :

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...  # NOUVEAU
```

### 🚀 Déploiement

1. Créer un Blob Store sur Vercel Dashboard
2. Copier le `BLOB_READ_WRITE_TOKEN`
3. Ajouter la variable dans Vercel Environment Variables
4. Déployer l'application

Voir `VERCEL_SETUP.md` pour les instructions détaillées.

---

## [2025-11-04] - Corrections ESLint et TypeScript

### 🐛 Corrections

- Remplacement de tous les types `any` par des types appropriés
- Suppression des imports et variables inutilisés
- Ajout d'attributs `alt` sur toutes les images
- Échappement des apostrophes dans le JSX
- Conversion des `<a>` internes en composants `<Link>`
- Remplacement des `<img>` par `<Image>` où possible

### 📊 Résultats

- **22 routes** générées avec succès
- **0 erreur** de compilation
- **0 warning** ESLint
- **100%** de couverture TypeScript

---

## Version Précédente

### Features
- Système de blog complet avec articles, commentaires et profils
- Authentification Google OAuth via NextAuth.js
- Design responsive avec Tailwind CSS v4
- Animations au scroll avec IntersectionObserver
- Upload d'images pour articles et avatars
- Gestion des utilisateurs avec Prisma ORM

