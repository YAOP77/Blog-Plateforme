# Migration des Images vers Vercel Blob

## 📦 Contexte

L'application utilisait auparavant le système de fichiers local (`/public/uploads/`) pour stocker les images. Cela ne fonctionne pas sur Vercel (serverless).

Nous avons migré vers **Vercel Blob Storage** pour stocker toutes les nouvelles images.

## 🔄 Changements Effectués

### 1. API Routes Modifiées

#### `src/app/api/articles/route.ts`
- ❌ **Avant** : `writeFile()` vers `/public/uploads/`
- ✅ **Après** : `put()` vers Vercel Blob avec URL complète

```typescript
// Avant
const imageUrl = `/uploads/${Date.now()}-${image.name}`;
await writeFile(`public${imageUrl}`, Buffer.from(await image.arrayBuffer()));

// Après
const blob = await put(image.name, image, {
  access: 'public',
  addRandomSuffix: true,
});
const imageUrl = blob.url; // URL complète Vercel Blob
```

#### `src/app/api/profile/route.ts`
- Même changement pour les avatars utilisateurs

### 2. Configuration Next.js

#### `next.config.ts`
Ajout de `remotePatterns` pour autoriser les images Vercel Blob :

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

### 3. Dépendances

Ajout du package `@vercel/blob` :
```bash
npm install @vercel/blob
```

## 🗄️ Images Existantes

### Images Statiques (déjà dans le repo)
Les images dans `public/images/` continuent de fonctionner normalement car elles sont déployées avec l'application.

### Images Uploadées (anciennes)
⚠️ **Important** : Les images uploadées avant la migration (stockées en local dans `/public/uploads/`) ne seront **PAS** disponibles sur Vercel.

Si vous avez des images importantes dans `/public/uploads/`, vous devez les migrer manuellement vers Vercel Blob.

## 🔧 Script de Migration (optionnel)

Si vous avez beaucoup d'images à migrer, voici un exemple de script :

```typescript
// scripts/migrate-images.ts
import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

async function migrateImages() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const files = await readdir(uploadsDir);
  
  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const fileBuffer = await readFile(filePath);
    const fileBlob = new Blob([fileBuffer]);
    
    const blob = await put(file, fileBlob, {
      access: 'public',
      addRandomSuffix: false, // Garder le nom original
    });
    
    console.log(`Migré: ${file} -> ${blob.url}`);
    
    // TODO: Mettre à jour la base de données avec la nouvelle URL
  }
}

migrateImages();
```

## ✅ Vérifications Post-Migration

1. **Test Upload** : Publiez un nouvel article avec image
2. **Vérification URL** : L'URL de l'image doit ressembler à :
   ```
   https://xxxxxxxxxx.public.blob.vercel-storage.com/nom-fichier-xxxxx.jpg
   ```
3. **Affichage** : Vérifiez que l'image s'affiche correctement
4. **Base de données** : Les nouvelles images sont stockées avec leur URL complète Vercel Blob

## 🌐 Avantages de Vercel Blob

1. ✅ **CDN Global** : Images servies rapidement partout dans le monde
2. ✅ **Scalabilité** : Pas de limite serverless
3. ✅ **Gratuit** : Jusqu'à 500 MB
4. ✅ **Automatique** : Pas de gestion de serveur
5. ✅ **Sécurisé** : Contrôle d'accès intégré

## 📊 Limites du Plan Gratuit

- **Stockage** : 500 MB
- **Bande passante** : Généreuse (vérifier la doc Vercel)
- **Nombre de fichiers** : Illimité

Au-delà, passage au plan payant ou migration vers AWS S3 / Cloudinary.

## 🆘 Support

En cas de problème :
1. Vérifiez que `BLOB_READ_WRITE_TOKEN` est bien configuré
2. Consultez les logs Vercel
3. Vérifiez la [documentation officielle](https://vercel.com/docs/storage/vercel-blob)

