import 'server-only';
import config from '@payload-config';
import { getPayload, type Where } from 'payload';
import { cache } from 'react';
import type { Club, Media, News, Page } from '@/payload-types';
import type { Locale } from '@/i18n/config';
import { getDictionary, type NewsCategory } from '@/i18n/dictionaries';
import type {
  CategoryVM,
  Img,
  MatchVM,
  NewsVM,
  PageHeadVM,
  PartnerVM,
  PlayerVM,
  Result,
  SettingsVM,
  StaffVM,
  StandingVM,
  VideoVM,
} from './types';

// Lecture du contenu via l'API locale de Payload (pas d'aller-retour HTTP).
// `overrideAccess: false` applique les règles d'accès publiques : brouillons exclus.
const payload = () => getPayload({ config });
const common = (locale: Locale) => ({ locale, fallbackLocale: 'fr' as const, overrideAccess: false, depth: 1 });

type Rel<T> = number | T | null | undefined;
const obj = <T>(v: Rel<T>): T | undefined => (v && typeof v === 'object' ? v : undefined);

// ---------- Images ----------

const SIZES = ['thumb', 'md', 'lg', 'xl'] as const;

export function toImg(m: Rel<Media>, fallbackAlt = ''): Img | undefined {
  const media = obj(m);
  if (!media?.url) return undefined;
  const variants = SIZES.map(k => media.sizes?.[k]).filter((s): s is { url: string; width: number } => !!s?.url && !!s.width);
  return {
    src: media.sizes?.lg?.url || media.url,
    srcSet: variants.length ? variants.map(v => `${v.url} ${v.width}w`).join(', ') : undefined,
    alt: media.alt ?? fallbackAlt,
    pos: `${media.focalX ?? 50}% ${media.focalY ?? 50}%`,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  };
}

const PLACEHOLDER_IMG: Img = { src: '/assets/logo-white.png', alt: '', pos: '50% 50%' };

// ---------- Dates (toujours à l'heure de Monaco, quel que soit le fuseau du serveur) ----------

const TZ = 'Europe/Monaco';
const INTL: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB', it: 'it-IT' };
const fmtCache = new Map<string, Intl.DateTimeFormat>();
const fmt = (locale: Locale, opts: Intl.DateTimeFormatOptions) => {
  const key = locale + JSON.stringify(opts);
  if (!fmtCache.has(key)) fmtCache.set(key, new Intl.DateTimeFormat(INTL[locale], { timeZone: TZ, ...opts }));
  return fmtCache.get(key)!;
};

/** « 4 oct. » / « 4 Oct » / « 4 ott ». */
const shortDate = (iso: string, locale: Locale) => fmt(locale, { day: 'numeric', month: 'short' }).format(new Date(iso));
const weekday = (iso: string, locale: Locale) => fmt(locale, { weekday: 'short' }).format(new Date(iso));
const time = (iso: string) => fmt('fr', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));

// ---------- Réglages & pages ----------

export const getSettings = cache(async (locale: Locale): Promise<SettingsVM> => {
  const s = await (await payload()).findGlobal({ slug: 'settings', ...common(locale) });
  return {
    stadium: s.stadium ?? '',
    city: s.city ?? '',
    email: s.email ?? '',
    pressEmail: s.pressEmail ?? undefined,
    mapQuery: s.mapQuery ?? '',
    socials: (s.socials ?? []).map(x => ({ label: x.label, url: x.url })),
    metaTitle: s.metaTitle ?? undefined,
    metaDescription: s.metaDescription ?? undefined,
  };
});

export const getPages = cache(async (locale: Locale): Promise<Page> => (await payload()).findGlobal({ slug: 'pages', ...common(locale) }));

export async function getPageHead(locale: Locale, key: 'equipe' | 'calendrier' | 'classement' | 'actus' | 'academie' | 'partenaires' | 'contact'): Promise<PageHeadVM> {
  const g = (await getPages(locale))[key];
  return { title: g?.title ?? '', intro: g?.intro ?? '' };
}

export const getHome = cache(async (locale: Locale) => {
  const h = await (await payload()).findGlobal({ slug: 'home', ...common(locale) });
  return {
    heroPhotos: (h.heroPhotos ?? []).map(m => toImg(m)).filter((x): x is Img => !!x),
    tagline: h.tagline ?? '',
    band: { line1: h.band?.line1 ?? '', line2: h.band?.line2 ?? '' },
    academy: { text: h.academy?.text ?? '', img: toImg(h.academy?.image) },
    videosNote: h.videosNote ?? '',
    newsletterText: h.newsletterText ?? '',
    gallery: (h.gallery ?? []).map(g => ({ img: toImg(g.image) ?? PLACEHOLDER_IMG, c: Number(g.cols ?? 1), r: Number(g.rows ?? 1) })),
  };
});

// ---------- Actualités ----------

function toNews(n: News, locale: Locale): NewsVM {
  return {
    id: String(n.id),
    slug: n.slug ?? String(n.id),
    cat: getDictionary(locale).newsCats[n.category as NewsCategory] ?? n.category,
    date: shortDate(n.publishedAt, locale),
    isoDate: n.publishedAt,
    title: n.title,
    excerpt: n.excerpt,
    img: toImg(n.cover) ?? PLACEHOLDER_IMG,
  };
}

/** Actualités publiées, la « à la une » la plus récente en premier. */
export const getNews = cache(async (locale: Locale, limit = 20): Promise<NewsVM[]> => {
  const { docs } = await (await payload()).find({ collection: 'news', ...common(locale), sort: ['-featured', '-publishedAt'], limit, pagination: false });
  return docs.map(d => toNews(d, locale));
});

export const getArticle = cache(async (locale: Locale, slug: string) => {
  const { docs } = await (await payload()).find({ collection: 'news', ...common(locale), where: { slug: { equals: slug } }, limit: 1 });
  const doc = docs[0];
  return doc ? { ...toNews(doc, locale), content: doc.content } : null;
});

export const getNewsSlugs = async (): Promise<string[]> => {
  const { docs } = await (await payload()).find({ collection: 'news', overrideAccess: false, select: { slug: true }, limit: 500, pagination: false, depth: 0 });
  return docs.map(d => d.slug).filter((s): s is string => !!s);
};

// ---------- Équipe ----------

export const getPlayers = cache(async (locale: Locale): Promise<PlayerVM[]> => {
  const { docs } = await (await payload()).find({ collection: 'players', ...common(locale), where: { active: { equals: true } }, sort: '_order', pagination: false, limit: 100 });
  return docs.map(p => ({
    id: String(p.id),
    num: p.number,
    name: p.name,
    pos: p.position,
    line: p.line,
    nat: p.nationality ?? '',
    img: toImg(p.photo, p.name) ?? PLACEHOLDER_IMG,
  }));
});

export const getStaff = cache(async (locale: Locale): Promise<StaffVM[]> => {
  const { docs } = await (await payload()).find({ collection: 'staff', ...common(locale), sort: '_order', pagination: false, limit: 50 });
  return docs.map(s => ({ id: String(s.id), name: s.name, role: s.role, img: toImg(s.photo, s.name) }));
});

// ---------- Saison ----------

export const getMatches = cache(async (locale: Locale, where?: Where): Promise<MatchVM[]> => {
  const { docs } = await (await payload()).find({ collection: 'matches', ...common(locale), where, sort: 'kickoff', pagination: false, limit: 200 });
  return docs.map(m => {
    const home = obj<Club>(m.home);
    const away = obj<Club>(m.away);
    const isHome = !!home?.isUs;
    const opp = isHome ? away : home;
    const t = getDictionary(locale).match;
    const played = m.homeScore != null && m.awayScore != null;
    const comp = m.competition === 'cup' ? t.cup : m.competition === 'friendly' ? t.friendly : t.round(m.round ?? 0);
    const compLong = m.competition === 'cup' ? t.cup : m.competition === 'friendly' ? t.friendly : t.league;
    const date = shortDate(m.kickoff, locale);
    return {
      id: String(m.id),
      jl: comp,
      date,
      dateLong: `${compLong}, ${weekday(m.kickoff, locale)} ${date}, ${isHome ? t.atHome : t.away}`,
      heure: time(m.kickoff),
      ts: new Date(m.kickoff).getTime(),
      home: home?.name ?? '?',
      away: away?.name ?? '?',
      opp: opp?.name ?? '?',
      oppCrest: toImg(opp?.crest, opp?.name),
      isHome,
      played,
      sh: m.homeScore ?? undefined,
      sa: m.awayScore ?? undefined,
    };
  });
});

export const getStandings = cache(async (locale: Locale): Promise<{ rows: StandingVM[]; note: string }> => {
  const s = await (await payload()).findGlobal({ slug: 'standings', ...common(locale) });
  const rows = (s.rows ?? []).map(r => {
    const club = obj<Club>(r.club);
    const diff = r.goalDiff ?? 0;
    return {
      team: club?.name ?? '?',
      isUs: !!club?.isUs,
      j: r.played ?? 0,
      g: r.won ?? 0,
      n: r.drawn ?? 0,
      p: r.lost ?? 0,
      diff: diff > 0 ? `+${diff}` : String(diff),
      pts: r.points ?? 0,
      form: (r.form ?? '').split('').filter((c): c is Result => c === 'V' || c === 'N' || c === 'D'),
    };
  });
  return { rows, note: s.note ?? '' };
});

// ---------- Contenus divers ----------

export const getVideos = cache(async (locale: Locale): Promise<VideoVM[]> => {
  const { docs } = await (await payload()).find({ collection: 'videos', ...common(locale), sort: '_order', pagination: false, limit: 30 });
  return docs.map(v => ({ id: String(v.id), title: v.title, img: toImg(v.thumbnail) ?? PLACEHOLDER_IMG, url: v.url ?? undefined }));
});

export const getPartners = cache(async (locale: Locale): Promise<PartnerVM[]> => {
  const { docs } = await (await payload()).find({ collection: 'partners', ...common(locale), sort: '_order', pagination: false, limit: 50 });
  return docs.map(p => ({
    id: String(p.id),
    name: p.name,
    tier: p.tier,
    placement: p.placement ?? undefined,
    logo: toImg(p.logo, p.name),
    url: p.url ?? undefined,
    placeholder: !!p.placeholder,
    showOnHome: !!p.showOnHome,
  }));
});

export const getCategories = cache(async (locale: Locale): Promise<CategoryVM[]> => {
  const { docs } = await (await payload()).find({ collection: 'academy-categories', ...common(locale), sort: '_order', pagination: false, limit: 20 });
  return docs.map(c => ({ code: c.code, years: c.years, focus: c.focus, slots: c.slots }));
});
