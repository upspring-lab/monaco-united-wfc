/**
 * Importe le contenu initial (données du prototype) dans une base vide.
 * Usage : npm run seed            (refuse si la base contient déjà des clubs)
 *         npm run seed -- --force (vide le contenu éditorial puis réimporte)
 * Ne crée aucun compte : le premier administrateur se crée sur /admin.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import config from '@payload-config';
import { getPayload, type CollectionSlug } from 'payload';
import * as D from './data';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(dirname, 'assets');

const payload = await getPayload({ config });
const ctx = { disableRevalidate: true };
const force = process.argv.includes('--force');

const CONTENT: CollectionSlug[] = ['matches', 'news', 'players', 'staff', 'videos', 'partners', 'academy-categories', 'clubs', 'media'];

const { totalDocs } = await payload.count({ collection: 'clubs' });
if (totalDocs > 0 && !force) {
  payload.logger.warn('La base contient déjà du contenu. Relancer avec --force pour tout réimporter.');
  process.exit(0);
}
if (force) {
  for (const collection of CONTENT) await payload.delete({ collection, where: { id: { exists: true } }, context: ctx });
  payload.logger.info('Contenu existant supprimé.');
}

/** Heure de Monaco : UTC+2 en heure d'été, UTC+1 en hiver (saison 2026-27). */
const kickoff = (d: string, time = '15:00') => {
  const summer = d < '2026-10-25' || d >= '2027-03-28';
  return new Date(`${d}T${time}:00${summer ? '+02:00' : '+01:00'}`).toISOString();
};

const lexical = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      },
    ],
  },
});

// ---------- Médias ----------
const media: Record<string, number> = {};
for (const [key, { alt, focalY }] of Object.entries(D.PHOTOS)) {
  const doc = await payload.create({ collection: 'media', data: { alt, focalX: 50, focalY }, filePath: path.join(ASSETS, `${key}.jpg`), context: ctx });
  media[key] = doc.id;
}
payload.logger.info(`${Object.keys(media).length} photos importées.`);

// ---------- Clubs ----------
const clubs: Record<string, number> = {};
for (const name of D.CLUBS) {
  const doc = await payload.create({ collection: 'clubs', data: { name, isUs: name === D.MU }, context: ctx });
  clubs[name] = doc.id;
}

// ---------- Matchs ----------
for (const f of D.FIXTURES) {
  await payload.create({
    collection: 'matches',
    data: {
      competition: f.cup ? 'cup' : 'league',
      round: f.j,
      kickoff: kickoff(f.d),
      home: clubs[f.home],
      away: clubs[f.away],
      homeScore: f.sh,
      awayScore: f.sa,
    },
    context: ctx,
  });
}

// ---------- Équipe ----------
for (const p of D.SQUAD) {
  await payload.create({
    collection: 'players',
    data: { number: p.num, name: p.name, position: p.pos, line: p.line, nationality: p.nat, photo: media[p.img], active: true },
    context: ctx,
  });
}
for (const s of D.STAFF) {
  await payload.create({ collection: 'staff', data: { name: s.name, role: s.role, photo: s.img ? media[s.img] : undefined }, context: ctx });
}

// ---------- Contenus ----------
for (const n of D.NEWS) {
  await payload.create({
    collection: 'news',
    data: {
      title: n.title,
      category: n.cat as 'Match',
      publishedAt: kickoff(n.d, '10:00'),
      featured: !!n.featured,
      cover: media[n.img],
      excerpt: n.excerpt,
      content: lexical(n.excerpt),
      _status: 'published',
    },
    context: ctx,
  });
}
for (const v of D.VIDEOS) await payload.create({ collection: 'videos', data: { title: v.title, thumbnail: media[v.img] }, context: ctx });
for (const p of D.PARTNERS) {
  await payload.create({
    collection: 'partners',
    data: { name: p.name, tier: p.tier, placement: 'placement' in p ? p.placement : undefined, placeholder: p.placeholder, showOnHome: true },
    context: ctx,
  });
}
for (const c of D.CATEGORIES) await payload.create({ collection: 'academy-categories', data: c, context: ctx });

// ---------- Globals ----------
await payload.updateGlobal({
  slug: 'standings',
  data: {
    note: 'Chiffres provisoires sauf Monaco United, à brancher sur le classement FFF.',
    rows: D.TABLE.map(([club, played, won, drawn, lost, goalDiff, points, form]) => ({ club: clubs[club], played, won, drawn, lost, goalDiff, points, form })),
  },
  context: ctx,
});

await payload.updateGlobal({
  slug: 'home',
  data: {
    heroPhotos: [media.ph18, media.ph13, media.ph10],
    tagline: 'Football féminin\nPrincipauté de Monaco',
    band: { line1: 'Monaco United', line2: 'Jouer pour la Principauté' },
    academy: { text: 'De U9 à U18, la formation des joueuses de la Principauté.', image: media.ph07 },
    videosNote: 'Contenus à venir',
    newsletterText: 'Matchs, résultats et coulisses, une fois par semaine.',
    gallery: D.GALLERY.map(g => ({ image: media[g.img], cols: g.c, rows: g.r })),
  },
  context: ctx,
});

await payload.updateGlobal({
  slug: 'pages',
  data: {
    equipe: { ...D.PAGE_HEADS.equipe, staffNote: 'Staff à compléter avec les noms et photos du club.' },
    calendrier: D.PAGE_HEADS.calendrier,
    classement: D.PAGE_HEADS.classement,
    actus: D.PAGE_HEADS.actus,
    academie: { ...D.PAGE_HEADS.academie, image: media.ph07, ctaTitle: "Envie de rejoindre l'académie ?" },
    partenaires: {
      ...D.PAGE_HEADS.partenaires,
      pitchText: "Associez votre marque à un club ambitieux, visible en Principauté et sur la Côte d'Azur.",
      offers: D.OFFERS,
    },
    contact: D.PAGE_HEADS.contact,
  },
  context: ctx,
});

await payload.updateGlobal({
  slug: 'settings',
  data: {
    stadium: 'Stade Didier Deschamps',
    city: "Cap-d'Ail (06), France",
    email: 'contact@monacounited.mc',
    pressEmail: 'presse@monacounited.mc',
    mapQuery: "Stade Didier Deschamps, Cap-d'Ail",
    socials: [
      { label: 'Instagram', url: 'https://www.instagram.com/' },
      { label: 'Facebook', url: 'https://www.facebook.com/' },
      { label: 'TikTok', url: 'https://www.tiktok.com/' },
    ],
    metaTitle: 'Monaco United, football féminin',
    metaDescription: 'Monaco United, club de football féminin de la Principauté de Monaco. R1 féminine, Ligue Méditerranée.',
  },
  context: ctx,
});

payload.logger.info('Seed terminé.');
process.exit(0);
