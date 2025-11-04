# Configuration Vercel pour le Déploiement

## 🚀 Étapes de déploiement sur Vercel

### 1. Configuration Vercel Blob Storage

**Important** : Les images ne peuvent pas être stockées localement sur Vercel (serverless). Vous devez utiliser Vercel Blob.

#### Étapes :

1. **Créer un Blob Store** :
   - Allez sur [Vercel Dashboard - Stores](https://vercel.com/dashboard/stores)
   - Cliquez sur **"Create Database"**
   - Sélectionnez **"Blob"**
   - Choisissez votre projet
   - Cliquez sur **"Create"**

2. **Copier le Token** :
   - Une fois le Blob Store créé, vous verrez `BLOB_READ_WRITE_TOKEN`
   - Copiez cette valeur

3. **Ajouter aux Variables d'Environnement** :
   - Dans votre projet Vercel, allez dans **Settings > Environment Variables**
   - Ajoutez :
     ```
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
     ```

### 2. Variables d'Environnement Requises

Assurez-vous d'avoir toutes ces variables configurées dans Vercel :

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# NextAuth
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre-secret-genere

# Google OAuth
GOOGLE_CLIENT_ID=votre-google-client-id
GOOGLE_CLIENT_SECRET=votre-google-client-secret

# Vercel Blob (IMPORTANT pour les images)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 3. Configuration Google OAuth

Pour l'authentification Google, vous devez autoriser votre domaine Vercel :

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionnez votre projet
3. Allez dans **API & Services > Credentials**
4. Modifiez votre OAuth 2.0 Client ID
5. Ajoutez dans **Authorized redirect URIs** :
   ```
   https://votre-domaine.vercel.app/api/auth/callback/google
   ```

### 4. Déploiement

```bash
# Si vous utilisez Vercel CLI
vercel

# Ou connectez votre repo GitHub/GitLab/Bitbucket à Vercel
# Le déploiement sera automatique à chaque push
```

### 5. Vérification Post-Déploiement

Après le déploiement, testez :

1. ✅ Connexion avec Google OAuth
2. ✅ Publication d'un article avec image
3. ✅ Upload d'un avatar utilisateur
4. ✅ Affichage des images (depuis Vercel Blob)

## 🔧 Dépannage

### Erreur 500 lors de l'upload d'image

**Cause** : Variable `BLOB_READ_WRITE_TOKEN` manquante ou incorrecte

**Solution** :
1. Vérifiez que le token est bien configuré dans Vercel
2. Redéployez l'application après avoir ajouté le token
3. Vérifiez les logs Vercel pour plus de détails

### Images ne s'affichent pas

**Cause** : `remotePatterns` mal configuré dans `next.config.ts`

**Solution** : Vérifiez que vous avez bien :
```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: '**.public.blob.vercel-storage.com',
  },
]
```

### OAuth Google ne fonctionne pas

**Cause** : URL de callback non autorisée

**Solution** : Ajoutez votre domaine Vercel dans les URIs autorisées de Google Cloud Console

## 📚 Ressources

- [Documentation Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Documentation NextAuth.js](https://next-auth.js.org/)
- [Configuration Next.js pour Vercel](https://nextjs.org/docs/app/building-your-application/deploying)

## ⚠️ Notes Importantes

1. **Vercel Blob est gratuit** jusqu'à 500 MB de stockage
2. Les images sont automatiquement servies via CDN
3. Le `addRandomSuffix: true` évite les conflits de noms de fichiers
4. Les anciennes images locales (dans `/uploads`) ne fonctionneront pas sur Vercel

