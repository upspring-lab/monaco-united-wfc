# monaco-united-wfc

Site du club Monaco United (football féminin, R1 féminine, Ligue Méditerranée), en FR / EN / IT.

Il reprend le design haute fidélité de `design_handoff_monaco_united/`. Ce dossier sert de référence : prototype HTML, README de handoff et assets.

## Stack

- **Next.js 16 (App Router) + TypeScript**, en export statique (`output: 'export'`).
- **CSS** : tokens et primitives dans `src/styles/globals.css`, puis un CSS Module par composant.
- **Police** : Archivo variable (axes `wdth` + `wght`), auto-hébergée via `next/font`.
- **Motion** : reveals au scroll (IntersectionObserver + WAAPI) et parallax (scroll-driven `ViewTimeline`, statique sans support). Le code est dans `src/components/motion/Motion.tsx` et respecte `prefers-reduced-motion`.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000 → /fr/
npm run build      # export statique dans out/
```

## Structure

```
src/
  app/
    layout.tsx               racine (le <html> est porté par [locale])
    page.tsx                 / → /fr/
    [locale]/                fr | en | it
      layout.tsx             header, footer, police, motion
      page.tsx               accueil
      equipe/ calendrier/ classement/ actualites/ academie/ partenaires/ contact/
  components/
    layout/                  Header (méga-menus, langue, menu mobile), Footer
    home/                    sections de l'accueil
    team/ season/ contact/   pages intérieures
    ui/                      PageHead, StripNav, icônes
    motion/                  reveals et parallax
  content/club.ts            données (calendrier, classement, effectif, actus…)
  i18n/config.ts             locales, slugs, dictionnaires (nav + CTA)
  lib/useNow.ts              horloge client (compte à rebours, prochain match)
```

## Déploiement

L'image Docker est multi-stage : `node:22-alpine` pour le build, puis `nginx:alpine` pour servir le site sur le port **8080**. `nginx.conf` redirige `/` vers `/fr/`.

```bash
docker build -t monaco-united-web .
docker run -p 8080:8080 monaco-united-web
```

## Reste à brancher

Ces points viennent du README de handoff :

- **CMS** (Sanity, Strapi ou Payload) : actualités, joueuses, staff, partenaires, vidéos et galerie. Les contenus sont aujourd'hui dans `src/content/club.ts`, avec des types prêts à être mappés.
- **Données FFF** : calendrier, résultats et classement du club 565169, équipe `2026_205100_SEF_2`, via un job planifié. Les chiffres du classement sont fictifs, sauf ceux de Monaco United.
- **Effectif** : les noms et numéros des joueuses sont fictifs, et le staff est à compléter.
- **Formulaires** : le contact et la newsletter affichent la confirmation mais n'envoient rien pour l'instant (voir les `TODO`).
- **i18n** : seules la navigation et le CTA sont traduits. Le contenu passera par des champs localisés dans le CMS.
- **Images** : conversion AVIF/WebP et `srcset`.
- **Infos à fournir** : adresse, e-mails, réseaux sociaux, écussons adverses, partenaires réels.
