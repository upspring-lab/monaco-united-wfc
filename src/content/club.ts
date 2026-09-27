// Contenu du club. Données mockées reprises du prototype de design, à brancher sur le CMS / la FFF.

export const MU = 'Monaco United';

export type Line = 'G' | 'D' | 'M' | 'A';

export interface Fixture {
  j?: number;
  cup?: boolean;
  d: string;
  home: string;
  away: string;
  sh?: number;
  sa?: number;
}

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

// Calendrier officiel R1 F 2026-27 + Coupe de France (source FFF, club 565169).
const RAW_FIXTURES: Fixture[] = [
  { j: 1, d: '2026-09-06', home: MU, away: 'AS Cannes 2', sh: 9, sa: 1 },
  { cup: true, d: '2026-09-13', home: MU, away: 'SC Aubagne Air Bel', sh: 11, sa: 0 },
  { j: 2, d: '2026-09-20', home: MU, away: 'AS Monaco FF', sh: 3, sa: 1 },
  { j: 3, d: '2026-09-27', home: 'St Didier Pernoise', away: MU },
  { cup: true, d: '2026-10-04', home: 'AS Cagnes le Cros', away: MU },
  { j: 4, d: '2026-10-11', home: MU, away: 'Av. C. Avignonnais' },
  { j: 5, d: '2026-11-01', home: 'Sporting Club Toulon', away: MU },
  { j: 6, d: '2026-11-08', home: MU, away: 'SC Aix Féminin' },
  { j: 7, d: '2026-11-15', home: 'Hyères FC', away: MU },
  { j: 8, d: '2026-11-22', home: MU, away: 'FC Féminin Monteux' },
  { j: 9, d: '2026-12-06', home: 'FC de Carros', away: MU },
  { j: 10, d: '2026-12-13', home: MU, away: 'St Marseillais UC' },
  { j: 11, d: '2027-01-10', home: 'AS Cagnes le Cros', away: MU },
  { j: 12, d: '2027-01-17', home: 'AS Monaco FF', away: MU },
  { j: 13, d: '2027-01-24', home: MU, away: 'St Didier Pernoise' },
  { j: 14, d: '2027-02-07', home: 'Av. C. Avignonnais', away: MU },
  { j: 15, d: '2027-02-14', home: MU, away: 'Sporting Club Toulon' },
  { j: 16, d: '2027-02-21', home: 'SC Aix Féminin', away: MU },
  { j: 17, d: '2027-03-14', home: MU, away: 'Hyères FC' },
  { j: 18, d: '2027-03-21', home: 'FC Féminin Monteux', away: MU },
  { j: 19, d: '2027-04-04', home: MU, away: 'FC de Carros' },
  { j: 20, d: '2027-04-11', home: 'St Marseillais UC', away: MU },
  { j: 21, d: '2027-05-02', home: MU, away: 'AS Cagnes le Cros' },
  { j: 22, d: '2027-05-09', home: 'AS Cannes 2', away: MU },
];

export interface Match extends Fixture {
  id: string;
  heure: string;
  ts: number;
  date: string;
  jl: string;
  opp: string;
  isHome: boolean;
  played: boolean;
  dateLong: string;
}

// Les dates sont interprétées à l'heure de Monaco (UTC+2 en saison), coup d'envoi 15h.
export const FIXTURES: Match[] = RAW_FIXTURES.map((f, i) => {
  const [y, mo, da] = f.d.split('-').map(Number);
  const ts = new Date(f.d + 'T15:00:00+02:00').getTime();
  const dow = new Date(Date.UTC(y, mo - 1, da)).getUTCDay();
  const isHome = f.home === MU;
  const M = MONTHS[mo - 1];
  return {
    ...f,
    id: String(i),
    heure: '15:00',
    ts,
    date: da + ' ' + M,
    jl: f.cup ? 'Coupe de France' : 'J' + f.j,
    opp: isHome ? f.away : f.home,
    isHome,
    played: f.sh != null,
    dateLong: (f.cup ? 'Coupe de France, ' : 'R1, ') + DAYS[dow] + ' ' + da + ' ' + M + (isHome ? ', à domicile' : ", à l'extérieur"),
  };
});

/** Prochain match : premier match sans score dont le coup d'envoi + 2h n'est pas passé. */
export function nextMatch(now: number): Match {
  return FIXTURES.find(f => !f.played && f.ts + 2 * 36e5 > now) ?? FIXTURES[FIXTURES.length - 1];
}

export type Result = 'V' | 'N' | 'D';

export function resultOf(m: Match): Result | null {
  if (m.sh == null || m.sa == null) return null;
  const mu = m.isHome ? m.sh : m.sa;
  const op = m.isHome ? m.sa : m.sh;
  return mu > op ? 'V' : mu === op ? 'N' : 'D';
}

export interface Standing {
  team: string;
  j: number;
  g: number;
  n: number;
  p: number;
  diff: string;
  pts: number;
  form: Result[];
}

// Clubs réels, chiffres provisoires sauf Monaco United.
export const TABLE: Standing[] = (
  [
    [MU, 2, 2, 0, 0, '+10', 6, 'VV'],
    ['AS Cagnes le Cros', 2, 2, 0, 0, '+7', 6, 'VV'],
    ['Hyères FC', 2, 1, 1, 0, '+3', 4, 'VN'],
    ['SC Aix Féminin', 2, 1, 1, 0, '+2', 4, 'NV'],
    ['Av. C. Avignonnais', 2, 1, 0, 1, '+1', 3, 'DV'],
    ['St Didier Pernoise', 2, 1, 0, 1, '0', 3, 'VD'],
    ['FC Féminin Monteux', 2, 1, 0, 1, '-1', 3, 'VD'],
    ['AS Monaco FF', 2, 1, 0, 1, '-1', 3, 'VD'],
    ['St Marseillais UC', 2, 0, 1, 1, '-2', 1, 'ND'],
    ['FC de Carros', 2, 0, 1, 1, '-3', 1, 'DN'],
    ['Sporting Club Toulon', 2, 0, 0, 2, '-6', 0, 'DD'],
    ['AS Cannes 2', 2, 0, 0, 2, '-10', 0, 'DD'],
  ] as const
).map(([team, j, g, n, p, diff, pts, form]) => ({ team, j, g, n, p, diff, pts, form: form.split('') as Result[] }));

export interface Player {
  num: number;
  name: string;
  pos: string;
  line: Line;
  nat: string;
  img: string;
}

// Noms et numéros fictifs, à remplacer par l'effectif réel.
export const SQUAD: Player[] = [
  { num: 1, name: 'Léa Marchetti', pos: 'Gardienne', line: 'G', nat: 'France', img: '/assets/ph08.jpg' },
  { num: 16, name: 'Camille Rossi', pos: 'Gardienne', line: 'G', nat: 'Italie', img: '/assets/ph17.jpg' },
  { num: 2, name: 'Inès Bertrand', pos: 'Latérale droite', line: 'D', nat: 'France', img: '/assets/ph02.jpg' },
  { num: 3, name: 'Jade Moreau', pos: 'Latérale gauche', line: 'D', nat: 'France', img: '/assets/ph01.jpg' },
  { num: 4, name: 'Chiara Lombardi', pos: 'Défenseure centrale', line: 'D', nat: 'Italie', img: '/assets/ph05.jpg' },
  { num: 5, name: 'Manon Giraud', pos: 'Défenseure centrale', line: 'D', nat: 'France', img: '/assets/ph04.jpg' },
  { num: 6, name: 'Élise Fontaine', pos: 'Milieu défensive', line: 'M', nat: 'France', img: '/assets/ph06.jpg' },
  { num: 8, name: 'Giulia Ferrara', pos: 'Milieu relayeuse', line: 'M', nat: 'Italie', img: '/assets/ph10.jpg' },
  { num: 10, name: 'Clara Vidal', pos: 'Milieu offensive', line: 'M', nat: 'Monaco', img: '/assets/ph18.jpg' },
  { num: 14, name: 'Nina Duval', pos: 'Milieu', line: 'M', nat: 'France', img: '/assets/ph12.jpg' },
  { num: 7, name: 'Lina Benali', pos: 'Ailière', line: 'A', nat: 'France', img: '/assets/ph19.jpg' },
  { num: 9, name: 'Maëlle Costa', pos: 'Avant-centre', line: 'A', nat: 'Portugal', img: '/assets/ph03.jpg' },
  { num: 11, name: 'Alice Morel', pos: 'Ailière', line: 'A', nat: 'France', img: '/assets/ph09.jpg' },
];

export interface StaffMember {
  name: string;
  role: string;
  img?: string;
}

export const STAFF: StaffMember[] = [
  { name: 'Marco Simone', role: 'Président et entraîneur principal', img: '/assets/ph11.jpg' },
  { name: 'Entraîneur adjoint', role: 'À compléter' },
  { name: 'Entraîneur des gardiennes', role: 'À compléter' },
  { name: 'Préparation physique', role: 'À compléter' },
];

export interface NewsItem {
  cat: string;
  date: string;
  title: string;
  img: string;
  pos: string;
  excerpt: string;
}

export const NEWS: NewsItem[] = [
  { cat: 'Match', date: '20 sept.', title: "Le derby pour Monaco United, 3-1 face à l'AS Monaco FF", img: '/assets/ph14.jpg', pos: '50% 40%', excerpt: 'Deuxième victoire en deux journées de R1 et la tête du championnat.' },
  { cat: 'Avant-match', date: '26 sept.', title: 'Coupe de France : direction Cagnes le 4 octobre', img: '/assets/ph13.jpg', pos: '50% 30%', excerpt: "Prochain tour à l'AS Cagnes le Cros, coup d'envoi 15h." },
  { cat: 'Coupe', date: '13 sept.', title: "11-0 contre Aubagne pour l'entrée en Coupe de France", img: '/assets/ph16.jpg', pos: '50% 40%', excerpt: 'Une qualification nette au stade Didier Deschamps.' },
  { cat: 'Match', date: '6 sept.', title: 'Premier match en R1, large victoire 9-1 contre Cannes', img: '/assets/ph10.jpg', pos: '50% 30%', excerpt: "Après le titre de District 06, l'entrée en Régional 1 est réussie." },
  { cat: 'Académie', date: '2 sept.', title: 'U15 et U18 : les inscriptions sont ouvertes', img: '/assets/ph07.jpg', pos: '50% 50%', excerpt: 'Journées de détection tous les mercredis de septembre.' },
];

export const VIDEOS = [
  { title: 'Résumé : Monaco United vs AS Monaco FF (3-1)', img: '/assets/ph14.jpg' },
  { title: 'Résumé : Monaco United vs SC Aubagne (11-0)', img: '/assets/ph16.jpg' },
  { title: 'Résumé : Monaco United vs AS Cannes 2 (9-1)', img: '/assets/ph10.jpg' },
  { title: 'Les buts du mois de septembre', img: '/assets/ph13.jpg' },
  { title: 'Marco Simone présente la saison', img: '/assets/ph11.jpg' },
];

export const GALLERY = [
  { img: '/assets/ph13.jpg', c: 2, r: 2 },
  { img: '/assets/ph01.jpg', c: 1, r: 1 },
  { img: '/assets/ph04.jpg', c: 1, r: 2 },
  { img: '/assets/ph15.jpg', c: 1, r: 1 },
  { img: '/assets/ph07.jpg', c: 2, r: 1 },
  { img: '/assets/ph05.jpg', c: 2, r: 1 },
];

// Noms de partenaires provisoires.
export const PARTNERS_STRIP = [
  { name: 'Groupe Marzocco', tone: 'accent' },
  { name: 'Erreà', tone: 'ink' },
  { name: 'Votre marque', tone: 'muted' },
  { name: 'Votre marque', tone: 'muted' },
] as const;

export const OFFERS = [
  { t: 'Maillot', d: 'Votre logo porté à chaque match, sur le terrain et dans les médias.' },
  { t: 'Stade', d: 'Panneaux, hospitalités et activations les jours de match.' },
  { t: 'Digital', d: 'Présence sur nos réseaux, contenus co-produits et newsletter.' },
  { t: 'Académie', d: 'Soutenez la formation des jeunes joueuses de la Principauté.' },
];

export const CATEGORIES = [
  { code: 'U9', years: '2018-2019', focus: 'Découverte et plaisir du jeu', slots: 'Mercredi 14h · Samedi 10h' },
  { code: 'U11', years: '2016-2017', focus: 'Technique individuelle', slots: 'Mercredi 14h · Vendredi 17h30' },
  { code: 'U13', years: '2014-2015', focus: 'Jeu collectif', slots: 'Mardi · Jeudi 17h30' },
  { code: 'U15', years: '2012-2013', focus: 'Préformation', slots: 'Lundi · Mercredi · Vendredi 18h' },
  { code: 'U18', years: '2009-2011', focus: "Passerelle vers l'équipe première", slots: '4 séances / semaine' },
];

export const INFOS = [
  { k: 'Stade', v: 'Stade Didier Deschamps' },
  { k: 'Ville', v: "Cap-d'Ail (06), France" },
  { k: 'E-mail', v: 'contact@monacounited.mc' },
  { k: 'Presse', v: 'presse@monacounited.mc' },
];

export const SUBJECTS = ['Supporters', 'Partenariat', 'Presse', 'Académie'] as const;
export type Subject = (typeof SUBJECTS)[number];

export const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'TikTok', href: '#' },
];
