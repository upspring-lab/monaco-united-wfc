// Contenu initial importé par le seed : données du prototype de design.
// Clubs et calendrier réels (FFF, club 565169) ; effectif, classement (hors Monaco United) et partenaires provisoires.

export const MU = 'Monaco United';

/** Photos du club (public/assets) avec leur point focal vertical (%), pour cadrer les visages. */
export const PHOTOS: Record<string, { alt: string; focalY: number }> = {
  ph01: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 25 },
  ph02: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 22 },
  ph03: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 22 },
  ph04: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 22 },
  ph05: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 25 },
  ph06: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 20 },
  ph07: { alt: 'Séance d’entraînement de l’équipe', focalY: 45 },
  ph08: { alt: 'Gardienne de Monaco United', focalY: 20 },
  ph09: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 20 },
  ph10: { alt: 'Joueuse de Monaco United en maillot domicile', focalY: 20 },
  ph11: { alt: 'Marco Simone, président et entraîneur principal', focalY: 18 },
  ph12: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 20 },
  ph13: { alt: 'Joueuses de Monaco United en maillot domicile', focalY: 25 },
  ph14: { alt: 'Joueuses de Monaco United pendant un match', focalY: 40 },
  ph15: { alt: 'Joueuse de Monaco United à l’entraînement', focalY: 30 },
  ph16: { alt: 'Joueuses de Monaco United pendant un match', focalY: 40 },
  ph17: { alt: 'Gardienne de Monaco United', focalY: 20 },
  ph18: { alt: 'Joueuse de Monaco United en maillot domicile', focalY: 20 },
  ph19: { alt: 'Joueuse de Monaco United en maillot domicile', focalY: 20 },
};

export const CLUBS = [
  MU,
  'AS Cannes 2',
  'SC Aubagne Air Bel',
  'AS Monaco FF',
  'St Didier Pernoise',
  'AS Cagnes le Cros',
  'Av. C. Avignonnais',
  'Sporting Club Toulon',
  'SC Aix Féminin',
  'Hyères FC',
  'FC Féminin Monteux',
  'FC de Carros',
  'St Marseillais UC',
];

export const FIXTURES: { j?: number; cup?: boolean; d: string; home: string; away: string; sh?: number; sa?: number }[] = [
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

// [club, J, V, N, D, diff, pts, forme]
export const TABLE: [string, number, number, number, number, number, number, string][] = [
  [MU, 2, 2, 0, 0, 10, 6, 'VV'],
  ['AS Cagnes le Cros', 2, 2, 0, 0, 7, 6, 'VV'],
  ['Hyères FC', 2, 1, 1, 0, 3, 4, 'VN'],
  ['SC Aix Féminin', 2, 1, 1, 0, 2, 4, 'NV'],
  ['Av. C. Avignonnais', 2, 1, 0, 1, 1, 3, 'DV'],
  ['St Didier Pernoise', 2, 1, 0, 1, 0, 3, 'VD'],
  ['FC Féminin Monteux', 2, 1, 0, 1, -1, 3, 'VD'],
  ['AS Monaco FF', 2, 1, 0, 1, -1, 3, 'VD'],
  ['St Marseillais UC', 2, 0, 1, 1, -2, 1, 'ND'],
  ['FC de Carros', 2, 0, 1, 1, -3, 1, 'DN'],
  ['Sporting Club Toulon', 2, 0, 0, 2, -6, 0, 'DD'],
  ['AS Cannes 2', 2, 0, 0, 2, -10, 0, 'DD'],
];

export const SQUAD: { num: number; name: string; pos: string; line: 'G' | 'D' | 'M' | 'A'; nat: string; img: string }[] = [
  { num: 1, name: 'Léa Marchetti', pos: 'Gardienne', line: 'G', nat: 'France', img: 'ph08' },
  { num: 16, name: 'Camille Rossi', pos: 'Gardienne', line: 'G', nat: 'Italie', img: 'ph17' },
  { num: 2, name: 'Inès Bertrand', pos: 'Latérale droite', line: 'D', nat: 'France', img: 'ph02' },
  { num: 3, name: 'Jade Moreau', pos: 'Latérale gauche', line: 'D', nat: 'France', img: 'ph01' },
  { num: 4, name: 'Chiara Lombardi', pos: 'Défenseure centrale', line: 'D', nat: 'Italie', img: 'ph05' },
  { num: 5, name: 'Manon Giraud', pos: 'Défenseure centrale', line: 'D', nat: 'France', img: 'ph04' },
  { num: 6, name: 'Élise Fontaine', pos: 'Milieu défensive', line: 'M', nat: 'France', img: 'ph06' },
  { num: 8, name: 'Giulia Ferrara', pos: 'Milieu relayeuse', line: 'M', nat: 'Italie', img: 'ph10' },
  { num: 10, name: 'Clara Vidal', pos: 'Milieu offensive', line: 'M', nat: 'Monaco', img: 'ph18' },
  { num: 14, name: 'Nina Duval', pos: 'Milieu', line: 'M', nat: 'France', img: 'ph12' },
  { num: 7, name: 'Lina Benali', pos: 'Ailière', line: 'A', nat: 'France', img: 'ph19' },
  { num: 9, name: 'Maëlle Costa', pos: 'Avant-centre', line: 'A', nat: 'Portugal', img: 'ph03' },
  { num: 11, name: 'Alice Morel', pos: 'Ailière', line: 'A', nat: 'France', img: 'ph09' },
];

export const STAFF: { name: string; role: string; img?: string }[] = [
  { name: 'Marco Simone', role: 'Président et entraîneur principal', img: 'ph11' },
  { name: 'Entraîneur adjoint', role: 'À compléter' },
  { name: 'Entraîneur des gardiennes', role: 'À compléter' },
  { name: 'Préparation physique', role: 'À compléter' },
];

export const NEWS: { cat: string; d: string; title: string; img: string; excerpt: string; featured?: boolean }[] = [
  { cat: 'Match', d: '2026-09-20', title: "Le derby pour Monaco United, 3-1 face à l'AS Monaco FF", img: 'ph14', excerpt: 'Deuxième victoire en deux journées de R1 et la tête du championnat.', featured: true },
  { cat: 'Avant-match', d: '2026-09-26', title: 'Coupe de France : direction Cagnes le 4 octobre', img: 'ph13', excerpt: "Prochain tour à l'AS Cagnes le Cros, coup d'envoi 15h." },
  { cat: 'Coupe', d: '2026-09-13', title: "11-0 contre Aubagne pour l'entrée en Coupe de France", img: 'ph16', excerpt: 'Une qualification nette au stade Didier Deschamps.' },
  { cat: 'Match', d: '2026-09-06', title: 'Premier match en R1, large victoire 9-1 contre Cannes', img: 'ph10', excerpt: "Après le titre de District 06, l'entrée en Régional 1 est réussie." },
  { cat: 'Académie', d: '2026-09-02', title: 'U15 et U18 : les inscriptions sont ouvertes', img: 'ph07', excerpt: 'Journées de détection tous les mercredis de septembre.' },
];

export const VIDEOS = [
  { title: 'Résumé : Monaco United vs AS Monaco FF (3-1)', img: 'ph14' },
  { title: 'Résumé : Monaco United vs SC Aubagne (11-0)', img: 'ph16' },
  { title: 'Résumé : Monaco United vs AS Cannes 2 (9-1)', img: 'ph10' },
  { title: 'Les buts du mois de septembre', img: 'ph13' },
  { title: 'Marco Simone présente la saison', img: 'ph11' },
];

export const GALLERY = [
  { img: 'ph13', c: '2', r: '2' },
  { img: 'ph01', c: '1', r: '1' },
  { img: 'ph04', c: '1', r: '2' },
  { img: 'ph15', c: '1', r: '1' },
  { img: 'ph07', c: '2', r: '1' },
  { img: 'ph05', c: '2', r: '1' },
] as const;

export const PARTNERS = [
  { name: 'Groupe Marzocco', tier: 'main', placement: 'Face avant du maillot', placeholder: false },
  { name: 'Erreà', tier: 'kit', placement: 'Tenues match et entraînement', placeholder: false },
  { name: 'Votre marque', tier: 'official', placeholder: true },
  { name: 'Votre marque', tier: 'academy', placeholder: true },
] as const;

export const OFFERS = [
  { title: 'Maillot', text: 'Votre logo porté à chaque match, sur le terrain et dans les médias.' },
  { title: 'Stade', text: 'Panneaux, hospitalités et activations les jours de match.' },
  { title: 'Digital', text: 'Présence sur nos réseaux, contenus co-produits et newsletter.' },
  { title: 'Académie', text: 'Soutenez la formation des jeunes joueuses de la Principauté.' },
];

export const CATEGORIES = [
  { code: 'U9', years: '2018-2019', focus: 'Découverte et plaisir du jeu', slots: 'Mercredi 14h · Samedi 10h' },
  { code: 'U11', years: '2016-2017', focus: 'Technique individuelle', slots: 'Mercredi 14h · Vendredi 17h30' },
  { code: 'U13', years: '2014-2015', focus: 'Jeu collectif', slots: 'Mardi · Jeudi 17h30' },
  { code: 'U15', years: '2012-2013', focus: 'Préformation', slots: 'Lundi · Mercredi · Vendredi 18h' },
  { code: 'U18', years: '2009-2011', focus: "Passerelle vers l'équipe première", slots: '4 séances / semaine' },
];

export const PAGE_HEADS = {
  equipe: { title: "L'équipe", intro: 'Treize joueuses, un staff, une ambition : faire briller la Principauté au plus haut niveau.' },
  calendrier: { title: 'Calendrier', intro: "Régional 1 et Coupe de France. Horaires susceptibles d'évoluer." },
  classement: { title: 'Classement', intro: 'Régional 1 féminin, Ligue Méditerranée. 12 clubs, 22 journées.' },
  actus: { title: 'Actualités', intro: 'Matchs, coulisses, académie : tout ce qui se passe à Monaco United.' },
  academie: { title: 'Académie', intro: 'Cinq catégories, de U9 à U18, pour former les joueuses de demain.' },
  partenaires: { title: 'Partenaires', intro: 'Les entreprises qui accompagnent le club. Et la place qui vous attend.' },
  contact: { title: 'Contact', intro: 'Presse, partenariats, supporters ou académie : une seule adresse.' },
};
