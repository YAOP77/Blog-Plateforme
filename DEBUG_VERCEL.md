# 🔍 Guide de Débogage sur Vercel

## Étapes pour identifier l'erreur 500

### 1. **Tester la route de diagnostic**

Après le déploiement, visitez :
```
https://votre-domaine.vercel.app/api/test-blob
```

Vous devriez voir :
```json
{
  "success": true,
  "blobTokenPresent": true,
  "blobTokenLength": 160,
  "blobTokenPrefix": "vercel_blob_rw_...",
  "env": "production",
  "message": "✅ BLOB_READ_WRITE_TOKEN est configuré"
}
```

**Si `blobTokenPresent` est `false`** :
❌ Le token n'est pas configuré → Ajoutez-le dans Vercel Environment Variables

### 2. **Consulter les logs Vercel**

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **"Deployments"**
4. Sélectionnez le dernier déploiement
5. Cliquez sur **"Functions"**
6. Cherchez `/api/articles` dans la liste
7. Cliquez dessus pour voir les logs détaillés

**Les logs montreront exactement** :
- 📥 "POST /api/articles - Début"
- 📋 Les données reçues (titre, description, userId, image)
- 📤 "Upload image vers Vercel Blob..." (si image présente)
- ❌ L'erreur exacte avec le stack trace

### 3. **Erreurs courantes et solutions**

#### A. `BLOB_READ_WRITE_TOKEN is not defined`

**Cause** : Variable d'environnement manquante

**Solution** :
1. Allez dans **Settings > Environment Variables**
2. Ajoutez `BLOB_READ_WRITE_TOKEN` avec la valeur de votre Blob Store
3. **Redéployez** l'application (important !)

#### B. `Invalid token`

**Cause** : Token incorrect ou expiré

**Solution** :
1. Retournez sur https://vercel.com/dashboard/stores
2. Sélectionnez votre Blob Store
3. Copiez à nouveau le token (il pourrait avoir changé)
4. Mettez à jour la variable d'environnement
5. Redéployez

#### C. `User not found` ou `Session null`

**Cause** : Problème d'authentification

**Solution** :
1. Vérifiez que `NEXTAUTH_SECRET` est défini
2. Vérifiez que `NEXTAUTH_URL` correspond à votre domaine Vercel
3. Reconnectez-vous à l'application
4. Réessayez

#### D. `Database connection error`

**Cause** : `DATABASE_URL` incorrect ou base de données inaccessible

**Solution** :
1. Vérifiez que `DATABASE_URL` est correcte
2. Si vous utilisez un service externe (Neon, Supabase, etc.) :
   - Vérifiez que les IPs Vercel sont autorisées
   - Ou activez l'accès public avec SSL
3. Testez la connexion depuis Vercel CLI :
   ```bash
   vercel env pull
   ```

### 4. **Test en local avec les vraies variables d'environnement**

Pour reproduire l'environnement Vercel en local :

1. **Récupérez les variables d'environnement** :
   ```bash
   vercel env pull .env.local
   ```

2. **Lancez l'application en local** :
   ```bash
   npm run dev
   ```

3. **Testez l'upload d'article** :
   - Si ça fonctionne en local → problème de config Vercel
   - Si ça ne fonctionne pas en local → problème de code

### 5. **Vérification du Blob Store**

1. Allez sur https://vercel.com/dashboard/stores
2. Sélectionnez votre Blob Store
3. Vérifiez qu'il est bien **actif** et **lié à votre projet**
4. Si besoin, créez-en un nouveau et mettez à jour le token

### 6. **Logs détaillés en production**

Avec les logs ajoutés, vous verrez dans Vercel Functions :

```
📥 POST /api/articles - Début
📋 Données reçues: {
  title: "Mon article...",
  description: "Description...",
  userId: "b02979bb-605e-4d6a-a861-734b8182f743",
  hasImage: true,
  imageSize: 524288,
  imageType: "image/jpeg"
}
📤 Upload image vers Vercel Blob...
✅ Image uploadée: https://xxxxxxxxx.public.blob.vercel-storage.com/...
🔍 createArticle - Vérification session...
🔍 createArticle - Recherche utilisateur: user@example.com
💾 createArticle - Création article en DB...
✅ Article créé: abc-123-def
```

**Si vous voyez une erreur entre ces lignes**, vous saurez exactement où ça plante.

### 7. **Commandes utiles Vercel CLI**

```bash
# Voir les logs en temps réel
vercel logs

# Voir les logs d'une fonction spécifique
vercel logs --follow

# Lister les déploiements
vercel ls

# Voir les variables d'environnement
vercel env ls
```

### 8. **Checklist finale**

Avant de contacter le support, vérifiez :

- [ ] `/api/test-blob` retourne `blobTokenPresent: true`
- [ ] Les logs Vercel Functions sont consultés
- [ ] `BLOB_READ_WRITE_TOKEN` est bien configuré dans Vercel
- [ ] Le token est valide (copié depuis le Blob Store)
- [ ] L'application a été redéployée après l'ajout du token
- [ ] La session utilisateur est active (reconnectez-vous si besoin)
- [ ] La base de données est accessible
- [ ] Le test en local avec `vercel env pull` fonctionne

## 🆘 Si le problème persiste

1. **Partagez les logs Vercel Functions** (capture d'écran ou copie)
2. **Partagez le résultat de `/api/test-blob`**
3. **Vérifiez que toutes les variables d'environnement sont définies** :
   - DATABASE_URL ✅
   - NEXTAUTH_URL ✅
   - NEXTAUTH_SECRET ✅
   - GOOGLE_CLIENT_ID ✅
   - GOOGLE_CLIENT_SECRET ✅
   - BLOB_READ_WRITE_TOKEN ✅

Le message d'erreur exact dans les logs Vercel vous donnera la solution ! 🎯

