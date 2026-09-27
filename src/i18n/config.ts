export const LOCALES = ['fr', 'en', 'it'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export type PageKey = 'accueil' | 'equipe' | 'calendrier' | 'classement' | 'actus' | 'academie' | 'partenaires' | 'contact';

// Slugs identiques dans toutes les langues ; seule la locale change.
export const PAGE_SLUGS: Record<PageKey, string> = {
  accueil: '',
  equipe: 'equipe',
  calendrier: 'calendrier',
  classement: 'classement',
  actus: 'actualites',
  academie: 'academie',
  partenaires: 'partenaires',
  contact: 'contact',
};

export function href(locale: Locale, page: PageKey, query?: string): string {
  const slug = PAGE_SLUGS[page];
  return `/${locale}/${slug ? slug + '/' : ''}${query ? '?' + query : ''}`;
}

export function pageFromPath(pathname: string): PageKey {
  const slug = pathname.split('/').filter(Boolean)[1] ?? '';
  const entry = (Object.entries(PAGE_SLUGS) as [PageKey, string][]).find(([, s]) => s === slug);
  return entry ? entry[0] : 'accueil';
}

interface Dictionary {
  nav: Record<PageKey, string>;
  season: string;
  cta: string;
}

// Seules la navigation et le CTA sont traduits pour l'instant (cf. handoff) ; le reste viendra du CMS.
export const DICTIONARIES: Record<Locale, Dictionary> = {
  fr: {
    nav: { accueil: 'Accueil', equipe: 'Équipe', calendrier: 'Calendrier', classement: 'Classement', actus: 'Actualités', academie: 'Académie', partenaires: 'Partenaires', contact: 'Contact' },
    season: 'Saison',
    cta: 'Devenir partenaire',
  },
  en: {
    nav: { accueil: 'Home', equipe: 'Squad', calendrier: 'Fixtures', classement: 'Standings', actus: 'News', academie: 'Academy', partenaires: 'Partners', contact: 'Contact' },
    season: 'Season',
    cta: 'Become a partner',
  },
  it: {
    nav: { accueil: 'Home', equipe: 'Squadra', calendrier: 'Calendario', classement: 'Classifica', actus: 'Notizie', academie: 'Accademia', partenaires: 'Partner', contact: 'Contatti' },
    season: 'Stagione',
    cta: 'Diventa partner',
  },
};
