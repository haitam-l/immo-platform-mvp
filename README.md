# ImmoConnect — MVP plateforme immobilière avec services

Ce projet contient maintenant les services principaux côté serveur :

- inscription, connexion, session JWT en cookie httpOnly, déconnexion ;
- création d’annonces avec validation Zod ;
- ajout d’URLs photos aux annonces ;
- service d’upload Cloudinary via `POST /api/upload` ;
- recherche d’annonces avec filtres ;
- favoris ;
- messagerie interne entre utilisateurs ;
- modération admin des annonces ;
- création de session Stripe Checkout pour une option premium ;
- dashboard utilisateur avec annonces, messages et favoris.

## Installation

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Variables `.env`

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/immo_platform?schema=public"
JWT_SECRET="change-this-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_PREMIUM_LISTING=""
```

## Routes API ajoutées

### Authentification

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Annonces

- `GET /api/listings`
- `POST /api/listings`
- `PATCH /api/admin/listings/:id` avec `{ "status": "ACTIVE" }`, réservé admin

### Photos

- `POST /api/upload`
- Champ multipart : `photos`
- Retour : `{ photos: [{ url, publicId }] }`

### Favoris

- `POST /api/favorites/:listingId`

### Messages

- `POST /api/messages`

### Paiement premium

- `POST /api/payments/premium/:listingId`
- Retour : `{ url }`, à utiliser pour rediriger vers Stripe Checkout.

## Notes importantes

Le dépôt d’annonce actuel accepte des champs `photoUrls`. Le service Cloudinary est prêt côté API, mais il reste à brancher un composant React d’upload dans la page `/publier` pour envoyer les images automatiquement et remplir les URLs retournées.

La modération admin fonctionne côté API, mais il reste à créer une interface `/admin` pour valider/refuser les annonces depuis le navigateur.

Le webhook Stripe est volontairement laissé à faire selon ton modèle économique exact : annonce premium, abonnement agence, remontée automatique, etc.
