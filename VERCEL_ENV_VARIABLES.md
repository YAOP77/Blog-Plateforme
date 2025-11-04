# 🔐 Variables d'Environnement pour Vercel

## ✅ Liste Complète (6 variables)

Copiez-collez ces valeurs dans **Vercel → Settings → Environment Variables**

---

### 1. DATABASE_URL
**Name** :
```
DATABASE_URL
```
**Value** : (Votre URL de base de données PostgreSQL)
```
postgresql://user:password@host:5432/database
```
**Environments** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 2. GOOGLE_CLIENT_ID
**Name** :
```
GOOGLE_CLIENT_ID
```
**Value** : (Votre Google Client ID depuis Google Cloud Console)
```
VOTRE-CLIENT-ID.apps.googleusercontent.com
```
**Environments** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 3. GOOGLE_CLIENT_SECRET
**Name** :
```
GOOGLE_CLIENT_SECRET
```
**Value** : (Votre Google Client Secret depuis Google Cloud Console)
```
GOCSPX-VOTRE-SECRET-ICI
```
**Environments** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 4. NEXTAUTH_URL
**Name** :
```
NEXTAUTH_URL
```
**Value** :
```
https://blog-plateforme.vercel.app
```
**Environments** : ☑️ Production, ☑️ Preview (⚠️ PAS Development)

---

### 5. NEXTAUTH_SECRET
**Name** :
```
NEXTAUTH_SECRET
```
**Value** : (Générez un nouveau secret sécurisé)

**Pour générer** :
- Site web : https://generate-secret.vercel.app/32
- Ou terminal : `openssl rand -base64 32`

**Exemple** (générez le vôtre !) :
```
Xk3m9P2qR8sT4vW6yB1nC5dF7gH0jK2lM4nO6pQ8rS0t
```
**Environments** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 6. CLOUDINARY_CLOUD_NAME
**Name** :
```
CLOUDINARY_CLOUD_NAME
```
**Value** : (Votre Cloud Name depuis Cloudinary Dashboard)
```
votre-cloud-name
```
**Environments** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 7. CLOUDINARY_API_KEY
**Name** :
```
CLOUDINARY_API_KEY
```
**Value** : (Votre API Key depuis Cloudinary Dashboard)
```
123456789012345
```
**Environments** : ☑️ Production, ☑️ Preview, ☑️ Development

---

### 8. CLOUDINARY_API_SECRET
**Name** :
```
CLOUDINARY_API_SECRET
```
**Value** : (Votre API Secret depuis Cloudinary Dashboard)
```
VOTRE-API-SECRET-ICI
```
**Environments** : ☑️ Production, ☑️ Preview, ☑️ Development

---

## 🚀 Procédure Complète

### Étape 1 : Générer NEXTAUTH_SECRET
Allez sur : https://generate-secret.vercel.app/32

Copiez le résultat.

### Étape 2 : Ajouter toutes les variables
1. Allez sur https://vercel.com/pascal-yaos-projects/blog-plateforme
2. **Settings** → **Environment Variables**
3. Pour chaque variable :
   - Cliquez **"Add New"**
   - Collez le **Name**
   - Collez la **Value**
   - Cochez les **Environments**
   - Cliquez **"Save"**

### Étape 3 : Redéployer
1. **Deployments** → Dernier déploiement
2. Cliquez sur **⋯** → **Redeploy**
3. Attendez 1-2 minutes

### Étape 4 : Tester
1. Allez sur votre site
2. Connectez-vous
3. Créez un article avec une image
4. **Ça fonctionne ! 🎉**

---

## ⚠️ Important

- **NEXTAUTH_SECRET** : Générez-en un nouveau (ne réutilisez pas l'exemple)
- **NEXTAUTH_URL** : Doit correspondre à votre domaine Vercel
- **Cloudinary** : Utilisez VOS credentials (ceux fournis ci-dessus)
- **Redéployez** après avoir ajouté les variables !

---

## 📋 Checklist

- [ ] Les 8 variables sont ajoutées dans Vercel
- [ ] NEXTAUTH_SECRET a été généré (nouveau)
- [ ] NEXTAUTH_URL = `https://blog-plateforme.vercel.app`
- [ ] Application redéployée
- [ ] Test de connexion réussi
- [ ] Test d'upload d'image réussi

**Une fois tout coché, votre application sera 100% fonctionnelle ! 🚀**

