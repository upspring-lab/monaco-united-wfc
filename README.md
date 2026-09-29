# monaco-united-wfc

Site du club Monaco United (football féminin, R1 féminine, Ligue Méditerranée), en FR / EN / IT. Tout le contenu s'administre depuis un back-office intégré.

Le design de référence est dans `design_handoff_monaco_united/` : prototype HTML et README de handoff.

## Stack

| Couche | Choix |
| --- | --- |
| Site public | Next.js 16 (App Router), TypeScript, CSS Modules, rendu ISR |
| Back-office | [Payload CMS 3](https://payloadcms.com), intégré à la même app sur `/admin` |
| Base de données | PostgreSQL 17 (migrations versionnées dans `src/migrations/`) |
| Médias | Upload Payload, redimensionnés et convertis en WebP par sharp (4 tailles, point focal). Stockés sur S3 (Supabase Storage) ou sur disque |
| Hébergement | **Vercel + Supabase** (PostgreSQL + Storage). Alternative : image Docker Node standalone |
| Synchro sportive | Tâche planifiée Vercel (`/cron/sync`), connecteur de données interchangeable (`src/sync/`) |

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

## Déploiement : Vercel + Supabase

Tout passe par les intégrations Vercel : aucune chaîne de connexion ni clé de stockage à copier à la main.

1. **Vercel > Add New > Project** : importe le repo GitHub. Laisse les réglages par défaut : `vercel.json` fixe la commande de build à `npm run ci`, qui applique les migrations **avant** le build.
2. **Base** : dans le projet Vercel, *Storage* (ou *Integrations*) > **Supabase** > connecte le projet Supabase existant. Vercel injecte `POSTGRES_URL` (pooler en mode transaction), que le code utilise directement.
3. **Photos** : *Storage* > **Create > Blob** > connecte-le au projet. Vercel injecte `BLOB_READ_WRITE_TOKEN`.
4. **Redeploy**, puis crée le compte administrateur sur `https://<domaine>/admin`.
5. Facultatif : `PAYLOAD_SECRET` (sinon dérivé de `SUPABASE_JWT_SECRET`, injecté par l'intégration) et `CRON_SECRET` (requis seulement une fois la synchro sportive branchée).
6. Pour importer le contenu de départ (facultatif) : `vercel env pull .env.production.local`, puis `NODE_ENV=production npm run seed` avec ces variables. Ce `NODE_ENV=production` est obligatoire : il empêche le mode *push* de modifier le schéma de la prod.

Ce que le code gère tout seul :
- **URL du site** : `SERVER_URL` si défini, sinon le domaine de production Vercel.
- **TLS vérifié** vers Supabase, grâce à l'autorité racine publique de Supabase embarquée dans le repo (`src/payload/certs/supabase.ts`).
- **Pool** de 3 connexions par instance.
- **Photos** servies par le CDN Vercel Blob, et uploads directs navigateur → Blob (sans la limite de 4,5 Mo).
- **Rate limit** stocké en base, donc partagé entre les instances.
- **Previews** : les URL de preview sont autorisées pour CORS/CSRF.

**Sécurité Supabase** : Supabase expose le schéma `public` via son API Data, avec une clé `anon` publique. Après chaque migration, `npm run ci` active donc Row Level Security sur **toutes** les tables, sans politique (`src/payload/scripts/enable-rls.ts`) : les rôles `anon` et `authenticated` n'y voient rien, et Payload, propriétaire des tables, n'est pas concerné.

**Ne jamais brancher un `npm run dev` sur la base de production.** Le dev modifie le schéma à la volée (mode *push*), et les migrations de la prod se bloqueraient ensuite sur une confirmation interactive. Utilise un projet Supabase distinct pour le staging ou le dev.

Autres hébergeurs : à la place des intégrations, renseigne `DATABASE_URI` (et `DATABASE_CA_CERT` si l'autorité n'est pas Supabase), plus les `S3_*` pour un bucket S3. Voir `.env.example`.

### Alternative : Docker

```bash
docker build -t monaco-united .
docker run -p 3000:3000 -e DATABASE_URI=… -e PAYLOAD_SECRET=… -e SERVER_URL=https://… -v monaco-media:/data/media monaco-united
```

- Les migrations s'appliquent au démarrage.
- Sans `S3_*`, les médias vont sur le volume `/data/media`, à sauvegarder comme la base.
- Place un reverse proxy HTTPS devant, qui transmet `X-Real-IP`.

## Synchronisation des données sportives

La tâche planifiée `/cron/sync` (définie dans `vercel.json`) tourne chaque soir à 23 h 30 (heure de Monaco), après les matchs du dimanche. Vercel l'appelle avec `CRON_SECRET`, et toute autre requête reçoit une 401. À chaque passage :

1. **Lecture, puis validation** de tout le lot auprès du fournisseur. Si la source est en panne ou renvoie des données incohérentes, **rien n'est écrit**.
2. **Mise à jour idempotente**, par identifiant externe :
   - les matchs déjà saisis à la main sont **adoptés** (rapprochés par jour et affiche) plutôt que dupliqués ;
   - les clubs sont rapprochés par nom.
3. **Respect des corrections manuelles** : un match coché *Ne pas écraser par la synchro* n'est jamais modifié. Le classement a la même option.
4. **Journal** dans l'admin, sous *Saison > Synchronisation FFF* : dernière exécution, résultat, détail.
5. **Purge du cache** du site, puis ménage des compteurs de rate limit.

Test d'intégration du moteur, sur une base de dev seedée qu'il restaure à la fin :

```bash
npx payload run src/sync/__test__/run.test.ts
```

**Source des données** : la FFF bloque les accès automatisés à ses API (protection anti-bot Akamai). Le connecteur prévu est celui de **Score'n'co**, dont l'offre Premium donne une API officielle couvrant Monaco United. Il s'ajoute dans `src/sync/providers.ts` en implémentant `SyncProvider` (`src/sync/types.ts`). Tant que `SYNC_PROVIDER` est vide, la tâche ne fait rien et la saisie reste manuelle dans l'admin.

## Reste à faire

- **Connecteur Score'n'co** : à écrire dès l'accès à leur API (voir *Synchronisation des données sportives*).
- **Contenu réel** : effectif, staff, partenaires, écussons adverses, réseaux sociaux. Ce sont des placeholders de la maquette.
- **Traductions** EN / IT du contenu éditorial : elles se saisissent dans l'admin. Les libellés d'interface sont déjà traduits.
- **Newsletter** : brancher un outil d'envoi (Brevo, Mailchimp…) sur la liste des inscrits.
