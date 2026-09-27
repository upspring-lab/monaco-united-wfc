# Handoff : site Monaco United (football féminin)

## Overview
Site multi-pages du club Monaco United (Senior F 1, R1 féminine, Ligue Méditerranée), en trois langues (FR / EN / IT). Objectifs : informer les supporters (matchs, résultats, classement), présenter le club et attirer des partenaires.

Pages : Accueil, Équipe, Calendrier, Classement, Actualités, Académie, Partenaires, Contact.

## About the Design Files
`Monaco United v4.dc.html` est une **référence de design en HTML** : un prototype qui montre le rendu et le comportement attendus. Ce n'est pas du code de production. Il s'ouvre directement dans un navigateur (avec `support.js` et `assets/` à côté).

La tâche consiste à **recréer ce design** dans un vrai environnement. Aucun codebase n'existe encore, donc la recommandation est la suivante :
- **Next.js (App Router) + TypeScript**, avec des routes par locale : `/fr`, `/en`, `/it`.
- **CSS Modules ou Tailwind**, avec les tokens ci-dessous.
- **Contenu dans un CMS headless** (Sanity, Strapi ou Payload) : actualités, joueuses, staff, partenaires, vidéos, galerie.
- **Données de match** (calendrier, résultats, classement) synchronisées depuis la FFF par un job planifié (cron), voir la section « Données ».

La logique du prototype est dans la classe `Component` (`<script data-dc-script>`, en bas du fichier) : données mockées, calculs, handlers. Le template est au-dessus, avec des styles inline.

## Fidelity
**Haute fidélité.** Couleurs, typographie, espacements, découpes et animations sont définitifs. À reproduire au pixel près.

## Design Tokens
- **Couleurs**
  - Rouge club : `#e41f37` (seule couleur d'accent)
  - Rouge foncé (hover) : `#b3122a`
  - Rouge pâle (fond de la ligne Monaco) : `#fdecee`
  - Encre : `#121214`
  - Fond de page : `#f5f5f4`
  - Surfaces : `#fff`
  - Gris : `#e7e7e6`, `#d6d6d4`, `#8d8d90`, `#6b6b70`, `#4a4a4f`
  - Sur fond sombre : blanc à 78 % pour le texte secondaire, à 12 % pour les séparateurs
- **Rayons** : 0 partout (angles droits). Aucune ombre, sauf pour le méga-menu : `0 18px 40px rgba(18,18,20,.14)`.
- **Typographie** : Archivo, via Google Fonts avec l'axe variable de largeur : `wdth 62..125`, `wght 300..900`.
  - **Display** (titres) : `font-stretch:72%`, weight 800, uppercase, letter-spacing -.005em, line-height .84 à .9.
    - H1 de page : `clamp(64px,11vw,176px)`
    - H2 de section : `clamp(48px,6.4vw,96px)`
    - Titre de carte : 24 à 30px
  - **Label** (boutons, onglets, catégories) : `font-stretch:85%`, weight 700, uppercase, letter-spacing .06em, 12 à 15px.
  - **Texte courant** : 15 à 17px, line-height 1.5, `text-wrap:pretty`.
  - « MONACO UNITED » dans la bannière écusson : `font-stretch:112%`, weight 800.
- **Mise en page** : conteneur `max-width:1320px`, padding latéral 24px.
  - Sections : padding vertical de 88 à 104px.
  - Grilles : gap de 8px (cartes collées), 14 à 20px (listes), 36 à 40px (colonnes).
- **Boutons** : hauteur 48px (42px dans la nav), padding 0 22px, style Label 15px.
  - Primaire : fond `#e41f37`, hover `#b3122a`.
  - Contour encre : bordure 1.5px `#121214`, au hover fond encre et texte blanc.
  - Contour blanc : même principe, sur fond sombre ou rouge.
  - Actif : `scale(.97)`.
- **Découpe « chevron »** (reprend la pointe de l'écusson), sur les cartes joueuses et le fanion de la bannière : `clip-path: polygon(0 0,100% 0,100% 90%,50% 100%,0 90%)`.

## Screens / Views

### Header (toutes les pages)
Sticky, fond `rgba(245,245,244,.92)` avec `backdrop-filter: blur(14px)`, bordure basse encre à 10 %. Hauteur 68px, 80px maximum, **toujours sur une seule ligne** sur desktop.

Contenu, de gauche à droite :
- Logo rouge (50px de haut) et « MONACO / UNITED » en Display 22px sur 2 lignes. Clic : retour à l'accueil.
- Méga-menus : Le club, La saison, etc. Hover ou clic ouvre un panneau blanc avec un filet rouge de 3px en haut. Chaque lien est en Display 24px, fond `#fdecee` au hover.
- Bouton de langue 42×42 qui passe FR → EN → IT.
- CTA « Devenir partenaire » : mène à Contact, avec l'objet « Partenariat » présélectionné.

### Accueil
1. **Hero**, variante « Bannière » (défaut). Hauteur `clamp(520px,76vh,700px)`, fond `#121214`.
   - Grille : `clamp(210px,25vw,360px)` pour le fanion, `1fr` pour les photos.
   - Fanion rouge avec la découpe chevron, logo blanc (88 %, 280px max) et le texte « Football féminin / Principauté de Monaco » (Label, letter-spacing .28em).
   - À droite, 3 photos pleine hauteur (gap 4px) avec un léger parallax vertical.
   - Variantes alternatives présentes dans le fichier (prop `hero`) : « Écusson » (reprise exacte des proportions du logo) et « Carrousel » (3 actus en rotation toutes les 6 s avec barres de progression).
2. **Bandeau prochain match** (fond encre).
   - Contenu : écusson Monaco, « vs », écusson adverse (placeholder), nom de l'adversaire, compétition, date, domicile ou extérieur.
   - Compte à rebours J / H / MIN / S en Display 64px, mis à jour chaque seconde.
   - Bouton « Calendrier ».
3. **Actualités** : grande carte (4:3) à gauche, liste de 4 items à droite (vignette 148px carrée, filets fins).
4. **Bandeau typographique** : deux lignes géantes qui défilent en sens opposés au scroll. La première dit « Monaco United » en rouge, la seconde « Jouer pour la Principauté » en contour encre 2px.
5. **Les joueuses** (fond encre) : bande horizontale scroll-snap de cartes chevron (3:4.2), numéro en Display 56px en surimpression. Flèches précédent / suivant, barre de défilement masquée.
6. **Classement (top 3) + Académie** : 3 cartes de classement (la ligne Monaco sur fond `#fdecee`) et un bloc rouge avec une photo en `multiply` à 40 %.
7. **Vidéos** (fond encre) : bande de cartes 9:16 avec un bouton play rouge 48px, flèches.
8. **Galerie** : grille de 4 colonnes en mosaïque (spans 2×2, 1×1, 1×2…), reveal « clip » et parallax.
9. **Newsletter** : bloc rouge, champ e-mail et bouton encre. Après envoi, le message « Inscription confirmée. Merci ! » s'affiche.
10. **Partenaires** : logos seuls, en tuiles blanches de 112px de haut.

### Pages intérieures
Toutes commencent par un en-tête encre : 3 barres rouges (10×44px, gap 7px), puis H1 Display et intro de 17px maximum en blanc à 78 %.

- **Équipe**
  - Toggle « Joueuses / Staff » : 2 colonnes, bordure encre, indicateur rouge qui glisse (300ms, `cubic-bezier(.77,0,.175,1)`).
  - Filtres par poste (Toutes, Gardiennes, Défenseures, Milieux, Attaquantes) : barre blanche en 5 colonnes, indicateur encre glissant.
  - Grille `auto-fill minmax(240px,1fr)` de cartes chevron. Pour le staff, un placeholder « Photo à venir » si pas de photo.
- **Calendrier**
  - Filtres Tous / Domicile / Extérieur.
  - Chaque match est une ligne blanche : compétition (J1 ou « Coupe de France ») et date, affiche, score ou heure, puis un tag :
    - Victoire : fond rouge.
    - Prochain : contour rouge.
    - Score à venir, Domicile ou Extérieur : gris.
  - Bordure gauche de 4px rouge sur les victoires et sur le prochain match.
- **Classement**
  - Colonnes du tableau : #, Club, J, V, N, D, Diff, Forme (pastilles 22px : V rouge, N gris clair, D gris foncé), Pts.
  - La ligne Monaco est en gras sur fond `#fdecee`.
  - Filet gauche rouge pour la montée (1er), gris pour la relégation (11e et 12e).
- **Actualités** : article à la une (image 16:11 et texte), puis grille de cartes.
- **Académie** : grande image parallax, cartes de catégories (code en Display 80px rouge, filet haut rouge), CTA « Demander un essai » qui mène à Contact avec l'objet « Académie ».
- **Partenaires** : partenaire principal et équipementier, titre « Devenez partenaire », 4 offres sur fond encre, CTA.
- **Contact**
  - À gauche : carte Google Maps (Stade Didier Deschamps, Cap-d'Ail, en niveaux de gris) et 4 tuiles d'infos.
  - À droite : formulaire avec des chips d'objet (Supporters, Presse, Partenariat, Académie), Nom et E-mail.
  - Le champ « Entreprise » n'apparaît que si l'objet est « Partenariat ».
  - Après envoi : « Message envoyé ».

### Footer
Fond encre. Logo blanc, colonnes Club, Saison et Réseaux (en-têtes Label rouges), ligne de copyright.

## Interactions & Behavior
Règles de motion (voir `CLAUDE.md` du projet) :
- Courbes :
  - Entrée : `cubic-bezier(.23,1,.32,1)`.
  - Mouvement à l'écran : `cubic-bezier(.77,0,.175,1)`.
  - Jamais d'ease-in.
- Durées UI < 300ms. Presse 160ms avec `scale(.97)`.
- N'animer que `transform`, `opacity` et `clip-path`. Jamais `transition: all`.
- Avec `prefers-reduced-motion`, on garde l'opacité et on supprime le mouvement. Même comportement avec la prop `motion="Sobre"`.

Animations :
- **Reveal au scroll** (IntersectionObserver, `rootMargin: 0 0 -8% 0`, une seule fois) :
  - `up` : translateY(48px) et opacity 0, 750ms.
  - `left` : translateX(-48px), 750ms.
  - `clip` : `inset(100% 0 0 0)` vers `inset(0)`, 1000ms en ease-in-out-quart.
  - `down` (fanion) : translateY(-100%).
  - `stagger` : enfants décalés de 70ms (8 maximum).
  - Les éléments déjà visibles au chargement jouent immédiatement.
- **Parallax** : Scroll-driven animations (`ViewTimeline`), linear. Photos : ±5 à 8 % en Y. Bandeau typographique : 0 à -28 % en X.
  - Fallback : statique (Firefox pour l'instant).
  - En production, une option est GSAP ScrollTrigger ou le CSS `animation-timeline: view()` avec `@supports`.
- **Filtre ou toggle Équipe** : les cartes réapparaissent avec translateY(28px), scale(.96) et opacity, 480ms, décalées de 45ms. L'image fait un zoom de 1.12 à 1 en 700ms. On annule les animations en cours avant de relancer.
- **Carrousel** : fondu de 450ms, zoom de l'image de 1.08 à 1 en 1400ms, textes décalés de 70ms.
- **Méga-menu** : opacity et translateY, fermeture plus rapide que l'ouverture.
- **Hover sur les images** : scale(1.04 à 1.05) en 400ms.

## State Management
- Route / page et locale.
- Filtres :
  - Équipe : `line` (all | G | D | M | A), `squadView` (players | staff).
  - Calendrier : `venue` (all | home | away).
- Formulaires : `subject`, envoi, newsletter envoyée.
- `now`, rafraîchi chaque seconde, pour le compte à rebours.
- Prochain match : premier match sans score dont `kickoff + 2h > now`. Un match passé sans score affiche « Score à venir ».

## Données (réelles au 27/09/2026, à brancher)
- **Source officielle** : FFF Épreuves, club 565169, équipe `2026_205100_SEF_2` (pages `/saison`, `/classement` et `/resultat-calendrier`). Le site FFF bloque l'accès automatisé simple. Solutions :
  - demander un accès API à la Ligue ou à la FFF ;
  - utiliser un fournisseur tiers (SportCorico ou Score'n'co proposent des widgets et des flux) ;
  - à défaut, un scraper côté serveur avec un cache.
- **Calendrier et résultats** : déjà saisis dans le prototype (constante `FIX`).
  - R1 F, 22 journées, du 06/09/2026 au 09/05/2027.
  - Coupe de France : 13/09 11-0 contre Aubagne, 04/10 à Cagnes.
  - Résultats : J1 9-1 contre AS Cannes 2, J2 3-1 contre AS Monaco FF.
- **Classement** : les 12 clubs sont réels, mais **les chiffres sont fictifs sauf Monaco United** (c'est signalé sous le tableau).
- **Effectif** : les noms et numéros des joueuses sont **fictifs**, à remplacer.
- **Staff** : Marco Simone (président et entraîneur principal), les autres postes sont à compléter.
- **Club** : fondé en 2025, champion du District 06 en 2025-26, stade Didier Deschamps à Cap-d'Ail.
- **À fournir** : adresse exacte, e-mails, liens des réseaux sociaux, écussons des adversaires, partenaires réels (les noms actuels sont des placeholders).

## i18n
FR / EN / IT. Seules la navigation et le CTA sont traduits dans le prototype (constante `LANG`). Tout le contenu doit passer par le CMS avec des champs localisés.

## Assets
- `assets/logo-red.png` et `assets/logo-white.png` : écusson officiel, fourni par le club.
- `assets/ph01` à `ph19.jpg` : photos du club (finale), fournies par le club. À optimiser : AVIF ou WebP, `srcset`.

## Files
- `Monaco United v4.dc.html` : le prototype complet (toutes les pages, navigation en état local).
- `support.js` : le runtime nécessaire pour ouvrir le prototype.
- `assets/` : logos et photos.
