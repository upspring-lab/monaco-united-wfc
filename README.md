# monaco-united-wfc

Site du club Monaco United (football féminin, R1 féminine, Ligue Méditerranée), en FR / EN / IT. Tout le contenu s'administre depuis un back-office intégré.

Le design de référence est dans `design_handoff_monaco_united/` : prototype HTML et README de handoff.

## Stack

| Couche | Choix |
| --- | --- |
| Site public | Next.js 16 (App Router), TypeScript, CSS Modules, rendu ISR |
| Back-office | [Payload CMS 3](https://payloadcms.com), intégré à la même app sur `/admin` |
| Base de données | PostgreSQL 17 (migrations versionnées dans `src/migrations/`) |
| Médias | Upload Payload, redimensionnés et convertis en WebP par sharp (4 tailles, point focal) |
| Déploiement | Image Docker Node standalone (port 3000) avec un volume pour les médias |

### Ce qui s'administre

- **Contenu**
  - Actualités : brouillons, historique des versions, article en texte riche, mise « à la une ».
  - Médias : texte alternatif et point focal.
  - Vidéos.
- **Équipe** : joueuses (ordre par glisser-déposer, dans l'effectif ou non) et staff.
- **Saison**
  - Clubs, avec leur écusson.
  - Matchs : compétition, journée, coup d'envoi, scores.
  - Classement : les lignes s'ordonnent par glisser-déposer.
- **Club** : partenaires (type, logo, lien, affichage sur l'accueil) et catégories de l'académie.
- **Pages**
  - Accueil : photos du hero, bandeaux, bloc académie, galerie en mosaïque.
  - En-têtes et textes de chaque page intérieure.
  - Offres de partenariat.
- **Formulaires** : messages de contact (avec statut et note interne) et inscrits à la newsletter.
- **Administration** : utilisateurs (rôles admin / éditeur) et réglages (coordonnées, réseaux sociaux, SEO, e-mail de notification).

Chaque champ texte se traduit en FR / EN / IT depuis l'admin. Si une traduction manque, c'est la version française qui s'affiche. Les libellés d'interface (boutons, filtres, dates, en-têtes du classement, messages d'erreur) sont dans `src/i18n/dictionaries.ts`.

### Performance

- Les pages lisent la base directement par l'API locale de Payload, sans appel HTTP.
- Chaque page est rendue une fois puis mise en cache (ISR). Toute modification dans l'admin purge le cache, via des hooks `afterChange` et `afterDelete`, et le site se rafraîchit de toute façon toutes les 10 minutes.
- Les images sont servies en WebP avec `srcset`/`sizes` : le navigateur ne télécharge que la taille utile.
- Le build n'a pas besoin de la base : les pages sont générées à la première visite.

### Sécurité

- **Accès**
  - Public : lecture seule du contenu publié. Les brouillons et les formulaires reçus ne sont jamais exposés.
  - Éditeur : tout le contenu.
  - Administrateur : en plus, les comptes et la suppression des messages.
  - Le premier compte créé devient administrateur. Aucun compte par défaut n'existe.
- **Authentification**
  - Le compte est verrouillé 15 min après 5 échecs de connexion.
  - Sessions de 8 h, cookies `HttpOnly`, `Secure` en production et `SameSite=Lax`.
  - CSRF et CORS sont limités au domaine du site.
- **Surface d'attaque**
  - GraphQL est désactivé.
  - Aucune création anonyme n'est possible via l'API REST.
  - Uploads limités à JPEG, PNG, WebP et AVIF, 10 Mo maximum. Le SVG est exclu (risque de XSS).
- **Formulaires publics** : Server Actions avec validation côté serveur, honeypot anti-robots et limitation de débit (5 envois par tranche de 10 min et par IP). Une adresse déjà inscrite à la newsletter reçoit la même réponse qu'une nouvelle.
- **En-têtes HTTP** : CSP sur le site public, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, et HSTS en production.
- **Secrets** : fournis uniquement par variables d'environnement. `PAYLOAD_SECRET` doit faire au moins 32 caractères en production, sinon l'app refuse de démarrer.
- **Conteneur** : il tourne avec un utilisateur non root.

## Démarrer en local

Prérequis : Node.js 20.9 ou plus récent, et Docker Desktop.

```bash
npm install
cp .env.example .env              # puis renseigner PAYLOAD_SECRET (commande de génération dans le fichier)
docker compose up -d db           # PostgreSQL sur localhost:5432
npm run seed                      # crée le schéma et importe le contenu de la maquette (photos comprises)
npm run dev
```

- Site : http://localhost:3000, qui redirige vers `/fr`.
- Admin : http://localhost:3000/admin. À la première visite, tu crées ton compte administrateur.

Le seed refuse de tourner si la base contient déjà du contenu. `npm run seed -- --force` vide le contenu éditorial et le réimporte ; les comptes et les formulaires reçus sont conservés.

## Faire évoluer le schéma

1. Modifier les collections dans `src/payload/collections/` ou les globals dans `src/payload/globals/`. En dev, le schéma de la base suit le code automatiquement (mode *push*).
2. Régénérer les types : `npm run generate:types`. Si des composants admin ont changé : `npm run generate:importmap`.
3. Avant de merger, créer la migration : `npm run migrate:create -- nom-du-changement`, puis la commiter. Elle sera appliquée automatiquement au démarrage en production.

## Structure

```
src/
  app/
    (frontend)/[locale]/   site public (fr | en | it) ; actions.ts = Server Actions des formulaires
    (payload)/             admin Payload et API REST (/admin, /api)
  payload.config.ts        configuration Payload (base, locales, sécurité, e-mail)
  payload/
    collections/           schéma : contenu, médias, utilisateurs, formulaires
    globals/               accueil, pages, classement, réglages
    hooks/revalidate.ts    purge du cache ISR
    seed/                  contenu initial et photos
  migrations/              migrations SQL générées
  lib/
    cms.ts                 lecture du contenu -> modèles de vue (server-only)
    types.ts, matches.ts   modèles et logique partagés avec les composants client
    rateLimit.ts
  components/              UI du site (aucune dépendance à Payload)
  i18n/config.ts           locales, slugs, libellés de navigation
```

## Production

```bash
docker build -t monaco-united .
docker run -p 3000:3000 \
  -e DATABASE_URI=postgres://… \
  -e PAYLOAD_SECRET=… \
  -e SERVER_URL=https://www.monacounited.mc \
  -v monaco-media:/data/media \
  monaco-united
```

Tu peux aussi lancer la stack complète en local avec `PAYLOAD_SECRET=… docker compose --profile app up --build`.

- Les migrations s'appliquent au démarrage.
- **Ne jamais brancher un `npm run dev` sur la base de production.** Le dev modifie le schéma à la volée (mode *push*). Au démarrage suivant, la prod détecte ces modifications et attend une confirmation interactive avant d'appliquer ses migrations, ce qui bloque le démarrage.
- `SERVER_URL` est lue au démarrage (et non au build) : la même image sert en staging et en production.
- Le volume `/data/media` doit être persistant et sauvegardé, comme la base.
- Place un reverse proxy HTTPS devant l'app, qui transmet `X-Real-IP` : le rate limit s'en sert.

Variables d'environnement : voir `.env.example`.

## Reste à faire

- **Données FFF** : synchroniser automatiquement le calendrier, les scores et le classement (job planifié). Pour l'instant, la saisie se fait dans l'admin.
- **Contenu réel** : effectif, staff, partenaires, écussons adverses, réseaux sociaux. Ce sont des placeholders de la maquette.
- **Traductions** EN / IT du contenu éditorial : elles se saisissent dans l'admin. Les libellés d'interface sont déjà traduits.
- **Newsletter** : brancher un outil d'envoi (Brevo, Mailchimp…) sur la liste des inscrits.
- **Montée en charge** : stockage objet S3 (Scaleway) pour les médias via `@payloadcms/storage-s3`, et rate limit partagé (Redis) si plusieurs instances.
