# Guide de Dépannage (Troubleshooting)

## 🐛 Erreurs Courantes et Solutions

### 1. Erreur 500 lors de l'upload d'image

**Message d'erreur** :
```
POST /api/articles 500 (Internal Server Error)
```

#### Causes possibles :

#### A. Variable `BLOB_READ_WRITE_TOKEN` manquante

**Solution** :
1. Allez sur [Vercel Dashboard > Stores](https://vercel.com/dashboard/stores)
2. Créez un Blob Store si vous n'en avez pas
3. Copiez le token `BLOB_READ_WRITE_TOKEN`
4. Ajoutez-le dans **Settings > Environment Variables**
5. **Redéployez** l'application (important !)

**Vérification** :
```bash
# En local, créez un fichier .env.local
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

#### B. Fichier trop volumineux

**Limite Vercel** : 4.5 MB par fichier en upload

**Solution** :
- Compressez l'image avant upload
- Ajoutez une validation côté client :

```typescript
if (file.size > 4.5 * 1024 * 1024) {
  alert('Image trop volumineuse (max 4.5 MB)');
  return;
}
```

#### C. Type MIME non supporté

**Solution** : Vérifiez que le fichier est bien une image :

```typescript
const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
if (!validTypes.includes(file.type)) {
  alert('Type de fichier non supporté');
  return;
}
```

---

### 2. Images ne s'affichent pas après upload

**Symptôme** : L'image est uploadée mais ne s'affiche pas sur la page

#### Causes possibles :

#### A. `remotePatterns` non configuré

**Solution** : Vérifiez `next.config.ts` :

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.public.blob.vercel-storage.com',
    },
  ],
}
```

**Puis redéployez** l'application.

#### B. Utilisation de `<img>` au lieu de `<Image>`

Si vous utilisez `next/image`, assurez-vous d'avoir :
- Les `remotePatterns` configurés
- Les props `width` et `height` définies

**Alternative** : Utilisez `<img>` standard avec `eslint-disable` :
```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={imageUrl} alt="..." />
```

#### C. CORS ou politique de sécurité

**Vérification** : Ouvrez la console du navigateur (F12) et cherchez les erreurs CORS.

**Solution** : Vercel Blob gère automatiquement CORS, mais vérifiez que l'URL est correcte.

---

### 3. Base de données : Erreur de connexion

**Message d'erreur** :
```
Error: Can't reach database server
```

#### Solution :

1. **Vérifiez `DATABASE_URL`** :
   ```bash
   # Format correct
   postgresql://user:password@host:5432/database?sslmode=require
   ```

2. **Sur Vercel** :
   - Allez dans **Settings > Environment Variables**
   - Vérifiez que `DATABASE_URL` est bien définie
   - Redéployez après modification

3. **Firewall** :
   - Si vous utilisez un service externe (Neon, Supabase, etc.)
   - Autorisez les IPs de Vercel ou activez l'accès public

---

### 4. NextAuth : Session non persistante

**Symptôme** : L'utilisateur est déconnecté après quelques secondes

#### Solution :

1. **Vérifiez `NEXTAUTH_SECRET`** :
   ```bash
   # Générez un secret sécurisé
   openssl rand -base64 32
   ```

2. **Vérifiez `NEXTAUTH_URL`** :
   ```bash
   # En production
   NEXTAUTH_URL=https://votre-domaine.vercel.app
   
   # En local
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Vérifiez les cookies** :
   - Ouvrez DevTools > Application > Cookies
   - Cherchez `next-auth.session-token`
   - S'il n'existe pas, problème de configuration

---

### 5. Google OAuth : "redirect_uri_mismatch"

**Message d'erreur** :
```
Error 400: redirect_uri_mismatch
```

#### Solution :

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. **API & Services > Credentials**
3. Modifiez votre OAuth 2.0 Client ID
4. Ajoutez dans **Authorized redirect URIs** :
   ```
   https://votre-domaine.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google  # Pour le dev local
   ```
5. **Sauvegardez** et attendez quelques minutes

---

### 6. Erreur TypeScript au build

**Message d'erreur** :
```
Type error: Property 'X' does not exist on type 'Y'
```

#### Solution rapide :

1. **Nettoyez le cache** :
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Vérifiez les types** :
   ```bash
   npm run lint
   ```

3. **Regenerez Prisma Client** :
   ```bash
   npx prisma generate
   ```

---

## 🔍 Logs et Debugging

### Voir les logs Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Cliquez sur un déploiement
4. Onglet **"Functions"** pour voir les logs API

### Debugging en local

Ajoutez des `console.log` stratégiques :

```typescript
// Dans src/app/api/articles/route.ts
console.log("FormData reçu:", {
  title,
  description,
  userId,
  imageSize: image?.size,
  imageType: image?.type,
});
```

### Variables d'environnement

Vérifiez qu'elles sont bien chargées :

```typescript
// En dev
console.log("BLOB_TOKEN présent:", !!process.env.BLOB_READ_WRITE_TOKEN);
```

---

## 📞 Besoin d'aide ?

1. **Documentation officielle** :
   - [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
   - [Next.js](https://nextjs.org/docs)
   - [NextAuth.js](https://next-auth.js.org/)

2. **Communautés** :
   - [Vercel Discord](https://vercel.com/discord)
   - [Next.js Discussions](https://github.com/vercel/next.js/discussions)

3. **Logs détaillés** :
   - Activez le mode verbose en ajoutant `console.log` dans vos API routes
   - Consultez les logs Vercel pour les erreurs serveur

---

## ✅ Checklist Avant Déploiement

- [ ] `BLOB_READ_WRITE_TOKEN` configuré dans Vercel
- [ ] `DATABASE_URL` correcte et accessible
- [ ] `NEXTAUTH_SECRET` généré et défini
- [ ] `NEXTAUTH_URL` correspond au domaine de production
- [ ] `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` définis
- [ ] Redirect URIs Google OAuth mis à jour
- [ ] `next.config.ts` contient les `remotePatterns`
- [ ] `npm run build` passe sans erreur localement
- [ ] Tests d'upload d'image fonctionnent en local

Si tous ces points sont validés, le déploiement devrait réussir ! 🚀

