// Modèles de vue consommés par les composants. Indépendants de Payload : tout passe par src/lib/cms.ts.

export type Line = 'G' | 'D' | 'M' | 'A';
export type Result = 'V' | 'N' | 'D';

export interface Img {
  src: string;
  srcSet?: string;
  alt: string;
  /** object-position dérivé du point focal choisi dans l'admin. */
  pos: string;
  width?: number;
  height?: number;
}

export interface MatchVM {
  id: string;
  jl: string;
  date: string;
  dateLong: string;
  heure: string;
  ts: number;
  home: string;
  away: string;
  opp: string;
  oppCrest?: Img;
  isHome: boolean;
  played: boolean;
  sh?: number;
  sa?: number;
}

export interface PlayerVM {
  id: string;
  num: number;
  name: string;
  pos: string;
  line: Line;
  nat: string;
  img: Img;
}

export interface StaffVM {
  id: string;
  name: string;
  role: string;
  img?: Img;
}

export interface NewsVM {
  id: string;
  slug: string;
  cat: string;
  date: string;
  isoDate: string;
  title: string;
  excerpt: string;
  img: Img;
}

export interface StandingVM {
  team: string;
  isUs: boolean;
  j: number;
  g: number;
  n: number;
  p: number;
  diff: string;
  pts: number;
  form: Result[];
}

export interface VideoVM {
  id: string;
  title: string;
  img: Img;
  url?: string;
}

export interface PartnerVM {
  id: string;
  name: string;
  tier: 'main' | 'kit' | 'official' | 'academy';
  placement?: string;
  logo?: Img;
  url?: string;
  placeholder: boolean;
  showOnHome: boolean;
}

export interface CategoryVM {
  code: string;
  years: string;
  focus: string;
  slots: string;
}

export interface SettingsVM {
  stadium: string;
  city: string;
  email: string;
  pressEmail?: string;
  mapQuery: string;
  socials: { label: string; url: string }[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface PageHeadVM {
  title: string;
  intro: string;
}
