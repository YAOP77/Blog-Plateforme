# Blog Platform

Une plateforme de blog moderne et interactive construite avec Next.js, Tailwind CSS, Prisma et NextAuth.

## Fonctionnalités

- **Authentification** : Connexion et inscription avec NextAuth (Email/Password, Google OAuth)
- **Gestion d'articles** : Création, modification et suppression d'articles
- **Commentaires** : Système de commentaires interactif sur les articles
- **Profils utilisateurs** : Gestion de profil avec avatar personnalisé
- **Design moderne** : Interface responsive avec animations et effets 3D
- **Optimisation** : Images optimisées avec Next.js Image, lazy loading

## Technologies

- **Frontend** : Next.js 15, React 19, Tailwind CSS v4
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : NextAuth.js
- **Font** : Lexend (Google Fonts)
- **Icons** : React Icons

## Prérequis

- Node.js 20+
- PostgreSQL
- npm, yarn, pnpm ou bun

## Installation

1. Clonez le repository :
```bash
git clone <votre-repo-url>
cd blog-plateforme
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configurez la base de données PostgreSQL :
   - Créez une base de données PostgreSQL
   - Créez un fichier `.env` à la racine du projet :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Générez le client Prisma :
```bash
npx prisma generate
```

5. Exécutez les migrations :
```bash
npx prisma migrate dev
```

6. Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
blog-plateforme/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── api/               # API Routes
│   │   ├── articles/          # Pages articles (création, édition, liste)
│   │   ├── auth/              # Pages authentification
│   │   ├── profile/           # Pages profil
│   │   ├── home/              # Page d'accueil
│   │   └── page.tsx           # Page principale
│   ├── components/            # Composants React réutilisables
│   ├── lib/                   # Utilitaires et fonctions
│   ├── types/                 # Types TypeScript
│   └── generated/             # Client Prisma généré
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   └── migrations/            # Migrations Prisma
├── public/
│   ├── images/                # Images statiques
│   └── uploads/               # Images uploadées
└── package.json
```

## Modèles de données

### User
- `id` : UUID
- `username` : String
- `avatar` : String (optionnel)
- `email` : String (unique)
- `password` : String (hashé avec bcrypt)
- Relations : articles, comments

### Article
- `id` : UUID
- `title` : String
- `description` : String
- `image` : String (optionnel)
- `userId` : String (Foreign Key)
- `deleteAt` : DateTime (soft delete)

### Comment
- `id` : UUID
- `description` : String
- `userId` : String (Foreign Key)
- `articleId` : String (Foreign Key)
- `deleteAt` : DateTime (soft delete)

## Fonctionnalités UI

- **Animations** : Titres animés au scroll avec IntersectionObserver
- **Images optimisées** : Utilisation de `next/image` pour le lazy loading
- **Responsive design** : Interface adaptée mobile et desktop
- **Effets 3D** : Transformations CSS pour un rendu moderne
- **Masques visuels** : Effets de dégradés sur les images et cartes
- **Formulaire interactif** : Validation en temps réel

## Scripts disponibles

```bash
npm run dev      # Lance le serveur de développement
npm run build    # Compile l'application pour la production
npm start        # Lance l'application en mode production
npm run lint     # Vérifie le code avec ESLint
```

## Configuration OAuth Google

Pour activer la connexion avec Google :

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Google+
4. Créez des identifiants OAuth 2.0
5. Ajoutez les credentials dans votre `.env`

## Déploiement

L'application peut être déployée sur Vercel, Netlify ou tout autre hébergeur Node.js.

1. Build l'application :
```bash
npm run build
```

2. Configurez les variables d'environnement sur votre plateforme

3. Déployez !

## License

MIT

## 👨Développeur

Développé avec utilisant les meilleures pratiques de développement web moderne.
