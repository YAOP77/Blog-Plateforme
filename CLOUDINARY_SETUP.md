# 🎨 Configuration Cloudinary

## ✅ Migration terminée !

Votre application utilise maintenant **Cloudinary** au lieu de Vercel Blob pour le stockage des images.

---

## 🔑 Variables d'Environnement à ajouter sur Vercel

### **Allez dans Settings → Environment Variables** et ajoutez :

### 1. **CLOUDINARY_CLOUD_NAME**
```
CLOUDINARY_CLOUD_NAME
```
**Valeur** : (Votre Cloud Name depuis Cloudinary Dashboard)
```
votre-cloud-name
```
**Environnements** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 2. **CLOUDINARY_API_KEY**
```
CLOUDINARY_API_KEY
```
**Valeur** : (Votre API Key depuis Cloudinary Dashboard)
```
123456789012345
```
**Environnements** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 3. **CLOUDINARY_API_SECRET**
```
CLOUDINARY_API_SECRET
```
**Valeur** : (Votre API Secret depuis Cloudinary Dashboard)
```
VOTRE-API-SECRET-ICI
```
**Environnements** : ☑️ Production, ☑️ Preview, ☑️ Development

---

## ✨ Avantages de Cloudinary

1. **25 GB gratuit** (vs 500 MB Vercel Blob)
2. **Optimisation automatique** : compression, formats modernes
3. **Transformations d'images** : 
   - Avatars automatiquement redimensionnés à 400x400
   - Détection de visage pour le recadrage
4. **CDN global** : images rapides partout
5. **Indépendant de Vercel** : portable vers d'autres plateformes

---

## 📁 Organisation du Stockage

Les images sont organisées dans des dossiers :
- **`blog-articles/`** : Images des articles
- **`blog-avatars/`** : Avatars utilisateurs (redimensionnés à 400x400)

---

## 🚀 Déploiement

1. **Ajoutez les 3 variables** dans Vercel Environment Variables
2. **Redéployez** : Deployments → ⋯ → Redeploy
3. **Testez** : Créez un article avec une image

---

## 📊 URLs des Images

Les images seront accessibles via :
```
https://res.cloudinary.com/votre-cloud-name/image/upload/v1234567890/blog-articles/image.jpg
```

---

## 🔧 Configuration Locale

Pour tester en local, créez un fichier `.env.local` :

```bash
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# Autres variables...
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 🎯 Ce qui a changé

### Avant (Vercel Blob)
```typescript
const blob = await put(image.name, image, {
  access: 'public',
  addRandomSuffix: true,
});
imageUrl = blob.url;
```

### Après (Cloudinary)
```typescript
const result = await cloudinary.uploader.upload_stream({
  folder: "blog-articles",
  resource_type: "image",
}).end(buffer);
imageUrl = result.secure_url;
```

---

## ✅ Checklist

- [ ] Variables Cloudinary ajoutées dans Vercel
- [ ] Application redéployée
- [ ] Test d'upload d'article avec image
- [ ] Test d'upload d'avatar utilisateur

**Tout devrait fonctionner parfaitement maintenant !** 🎉

