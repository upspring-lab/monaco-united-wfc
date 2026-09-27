import type { Locale, PageKey } from './config';

// Libellés d'interface. Le contenu éditorial, lui, est traduit dans l'admin (champs localisés).

export type FormError = 'rate' | 'subject' | 'name' | 'email' | 'message';
export type NewsCategory = 'Match' | 'Avant-match' | 'Coupe' | 'Académie' | 'Club' | 'Partenaires';
export type SubjectKey = 'Supporters' | 'Partenariat' | 'Presse' | 'Académie';
export type TierKey = 'main' | 'kit' | 'official' | 'academy';

export interface Dictionary {
  nav: Record<PageKey, string>;
  season: string;
  cta: string;
  a11y: { home: string; lang: string; openMenu: string; closeMenu: string; prev: string; next: string; countdown: string; filterMatches: string; filterLine: string; view: string };
  common: { emailPh: string; seeAll: string; readArticle: string; discover: string; vs: string; crest: string; calendar: string; squad: string; full: string; pts: string; sending: string; noNews: string; backToNews: string };
  home: { news: string; players: string; standings: string; academy: string; videos: string; gallery: string; partners: string; newsletter: string; subscribe: string; subscribed: string; email: string };
  countdown: [string, string, string, string];
  record: (w: number, d: number, l: number) => string;
  newsCats: Record<NewsCategory, string>;
  squad: { players: string; staff: string; lines: { all: string; G: string; D: string; M: string; A: string }; photoSoon: string };
  fixtures: { all: string; home: string; away: string; win: string; draw: string; loss: string; next: string; pending: string };
  match: { cup: string; friendly: string; league: string; round: (n: number) => string; atHome: string; away: string };
  table: { pos: string; club: string; p: string; w: string; d: string; l: string; gd: string; form: string; pts: string; up: string; down: string; letters: { V: string; N: string; D: string } };
  academy: { born: (y: string) => string; askTrial: string; ctaTitle: string };
  partners: { tiers: Record<TierKey, string>; become: string; highlight: string };
  contact: {
    infos: { stadium: string; city: string; email: string; press: string };
    subject: string;
    subjects: Record<SubjectKey, string>;
    name: string;
    namePh: string;
    email: string;
    company: string;
    companyPh: string;
    message: string;
    messagePh: string;
    send: string;
    sentTitle: string;
    sentText: string;
    newMessage: string;
  };
  errors: Record<FormError, string>;
  footer: { tagline: [string, string]; club: string; season: string; follow: string; legal: string };
  meta: { description: string };
}

const fr: Dictionary = {
  nav: { accueil: 'Accueil', equipe: 'Équipe', calendrier: 'Calendrier', classement: 'Classement', actus: 'Actualités', academie: 'Académie', partenaires: 'Partenaires', contact: 'Contact' },
  season: 'Saison',
  cta: 'Devenir partenaire',
  a11y: {
    home: 'Monaco United, accueil',
    lang: 'Changer de langue',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    prev: 'Précédent',
    next: 'Suivant',
    countdown: 'Compte à rebours avant le prochain match',
    filterMatches: 'Filtrer les matchs',
    filterLine: 'Filtrer par poste',
    view: 'Vue',
  },
  common: { emailPh: 'vous@exemple.com', seeAll: 'Tout voir', readArticle: "Lire l'article", discover: 'Découvrir', vs: 'vs', crest: 'Écusson', calendar: 'Calendrier', squad: 'Effectif', full: 'Complet', pts: 'pts', sending: 'Envoi…', noNews: 'Aucune actualité pour le moment.', backToNews: 'Actualités' },
  home: { news: 'Actualités', players: 'Les joueuses', standings: 'Classement', academy: "L'académie", videos: 'Vidéos', gallery: 'Galerie', partners: 'Nos partenaires', newsletter: 'Newsletter', subscribe: "Je m'inscris", subscribed: 'Inscription confirmée. Merci !', email: 'E-mail' },
  countdown: ['Jours', 'Heures', 'Minutes', 'Secondes'],
  record: (w, d, l) => `${w} V, ${d} N, ${l} D`,
  newsCats: { Match: 'Match', 'Avant-match': 'Avant-match', Coupe: 'Coupe', Académie: 'Académie', Club: 'Club', Partenaires: 'Partenaires' },
  squad: { players: 'Joueuses', staff: 'Staff', lines: { all: 'Toutes', G: 'Gardiennes', D: 'Défenseures', M: 'Milieux', A: 'Attaquantes' }, photoSoon: 'Photo à venir' },
  fixtures: { all: 'Tous', home: 'Domicile', away: 'Extérieur', win: 'Victoire', draw: 'Nul', loss: 'Défaite', next: 'Prochain', pending: 'Score à venir' },
  match: { cup: 'Coupe de France', friendly: 'Match amical', league: 'R1', round: n => `J${n}`, atHome: 'à domicile', away: "à l'extérieur" },
  table: { pos: '#', club: 'Club', p: 'J', w: 'V', d: 'N', l: 'D', gd: 'Diff', form: 'Forme', pts: 'Pts', up: 'Montée', down: 'Relégation', letters: { V: 'V', N: 'N', D: 'D' } },
  academy: { born: y => `Nées en ${y}`, askTrial: 'Demander un essai', ctaTitle: "Envie de rejoindre l'académie ?" },
  partners: { tiers: { main: 'Partenaire principal', kit: 'Équipementier', official: 'Partenaire officiel', academy: 'Partenaire académie' }, become: 'Devenez', highlight: 'partenaire' },
  contact: {
    infos: { stadium: 'Stade', city: 'Ville', email: 'E-mail', press: 'Presse' },
    subject: 'Objet',
    subjects: { Supporters: 'Supporters', Partenariat: 'Partenariat', Presse: 'Presse', Académie: 'Académie' },
    name: 'Nom',
    namePh: 'Votre nom',
    email: 'E-mail',
    company: 'Entreprise',
    companyPh: 'Nom de votre entreprise',
    message: 'Message',
    messagePh: 'Votre message',
    send: 'Envoyer',
    sentTitle: 'Message envoyé',
    sentText: 'Merci ! Nous revenons vers vous sous 48 h.',
    newMessage: 'Nouveau message',
  },
  errors: {
    rate: 'Trop de tentatives. Réessayez dans quelques minutes.',
    subject: 'Objet invalide.',
    name: 'Merci d’indiquer votre nom.',
    email: 'Adresse e-mail invalide.',
    message: 'Votre message est trop court (10 caractères minimum).',
  },
  footer: { tagline: ['Football féminin', 'Principauté de Monaco'], club: 'Club', season: 'Saison', follow: 'Suivre le club', legal: 'Mentions légales, confidentialité' },
  meta: { description: 'Monaco United, club de football féminin de la Principauté de Monaco. R1 féminine, Ligue Méditerranée.' },
};

const en: Dictionary = {
  nav: { accueil: 'Home', equipe: 'Squad', calendrier: 'Fixtures', classement: 'Standings', actus: 'News', academie: 'Academy', partenaires: 'Partners', contact: 'Contact' },
  season: 'Season',
  cta: 'Become a partner',
  a11y: {
    home: 'Monaco United, home',
    lang: 'Change language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    prev: 'Previous',
    next: 'Next',
    countdown: 'Countdown to the next match',
    filterMatches: 'Filter matches',
    filterLine: 'Filter by position',
    view: 'View',
  },
  common: { emailPh: 'you@example.com', seeAll: 'See all', readArticle: 'Read the article', discover: 'Discover', vs: 'vs', crest: 'Crest', calendar: 'Fixtures', squad: 'Squad', full: 'Full table', pts: 'pts', sending: 'Sending…', noNews: 'No news yet.', backToNews: 'News' },
  home: { news: 'News', players: 'The players', standings: 'Standings', academy: 'The academy', videos: 'Videos', gallery: 'Gallery', partners: 'Our partners', newsletter: 'Newsletter', subscribe: 'Subscribe', subscribed: "You're subscribed. Thank you!", email: 'Email' },
  countdown: ['Days', 'Hours', 'Minutes', 'Seconds'],
  record: (w, d, l) => `${w} W, ${d} D, ${l} L`,
  newsCats: { Match: 'Match', 'Avant-match': 'Preview', Coupe: 'Cup', Académie: 'Academy', Club: 'Club', Partenaires: 'Partners' },
  squad: { players: 'Players', staff: 'Staff', lines: { all: 'All', G: 'Goalkeepers', D: 'Defenders', M: 'Midfielders', A: 'Forwards' }, photoSoon: 'Photo coming soon' },
  fixtures: { all: 'All', home: 'Home', away: 'Away', win: 'Win', draw: 'Draw', loss: 'Loss', next: 'Next', pending: 'Score pending' },
  match: { cup: 'Coupe de France', friendly: 'Friendly', league: 'R1', round: n => `MD${n}`, atHome: 'home', away: 'away' },
  table: { pos: '#', club: 'Club', p: 'P', w: 'W', d: 'D', l: 'L', gd: 'GD', form: 'Form', pts: 'Pts', up: 'Promotion', down: 'Relegation', letters: { V: 'W', N: 'D', D: 'L' } },
  academy: { born: y => `Born ${y}`, askTrial: 'Request a trial', ctaTitle: 'Want to join the academy?' },
  partners: { tiers: { main: 'Main partner', kit: 'Kit supplier', official: 'Official partner', academy: 'Academy partner' }, become: 'Become a', highlight: 'partner' },
  contact: {
    infos: { stadium: 'Stadium', city: 'City', email: 'Email', press: 'Press' },
    subject: 'Subject',
    subjects: { Supporters: 'Supporters', Partenariat: 'Partnership', Presse: 'Press', Académie: 'Academy' },
    name: 'Name',
    namePh: 'Your name',
    email: 'Email',
    company: 'Company',
    companyPh: 'Your company name',
    message: 'Message',
    messagePh: 'Your message',
    send: 'Send',
    sentTitle: 'Message sent',
    sentText: "Thank you! We'll get back to you within 48 hours.",
    newMessage: 'New message',
  },
  errors: {
    rate: 'Too many attempts. Please try again in a few minutes.',
    subject: 'Invalid subject.',
    name: 'Please enter your name.',
    email: 'Invalid email address.',
    message: 'Your message is too short (10 characters minimum).',
  },
  footer: { tagline: ["Women's football", 'Principality of Monaco'], club: 'Club', season: 'Season', follow: 'Follow the club', legal: 'Legal notice, privacy' },
  meta: { description: "Monaco United, women's football club of the Principality of Monaco. R1, Ligue Méditerranée." },
};

const it: Dictionary = {
  nav: { accueil: 'Home', equipe: 'Squadra', calendrier: 'Calendario', classement: 'Classifica', actus: 'Notizie', academie: 'Accademia', partenaires: 'Partner', contact: 'Contatti' },
  season: 'Stagione',
  cta: 'Diventa partner',
  a11y: {
    home: 'Monaco United, home',
    lang: 'Cambia lingua',
    openMenu: 'Apri il menu',
    closeMenu: 'Chiudi il menu',
    prev: 'Precedente',
    next: 'Successivo',
    countdown: 'Conto alla rovescia per la prossima partita',
    filterMatches: 'Filtra le partite',
    filterLine: 'Filtra per ruolo',
    view: 'Vista',
  },
  common: { emailPh: 'tu@esempio.it', seeAll: 'Vedi tutto', readArticle: "Leggi l'articolo", discover: 'Scopri', vs: 'vs', crest: 'Stemma', calendar: 'Calendario', squad: 'Rosa', full: 'Completa', pts: 'pt', sending: 'Invio…', noNews: 'Nessuna notizia per ora.', backToNews: 'Notizie' },
  home: { news: 'Notizie', players: 'Le giocatrici', standings: 'Classifica', academy: "L'accademia", videos: 'Video', gallery: 'Galleria', partners: 'I nostri partner', newsletter: 'Newsletter', subscribe: 'Iscriviti', subscribed: 'Iscrizione confermata. Grazie!', email: 'E-mail' },
  countdown: ['Giorni', 'Ore', 'Minuti', 'Secondi'],
  record: (w, d, l) => `${w} V, ${d} N, ${l} P`,
  newsCats: { Match: 'Partita', 'Avant-match': 'Prepartita', Coupe: 'Coppa', Académie: 'Accademia', Club: 'Club', Partenaires: 'Partner' },
  squad: { players: 'Giocatrici', staff: 'Staff', lines: { all: 'Tutte', G: 'Portieri', D: 'Difensori', M: 'Centrocampiste', A: 'Attaccanti' }, photoSoon: 'Foto in arrivo' },
  fixtures: { all: 'Tutte', home: 'Casa', away: 'Trasferta', win: 'Vittoria', draw: 'Pareggio', loss: 'Sconfitta', next: 'Prossima', pending: 'Risultato in arrivo' },
  match: { cup: 'Coupe de France', friendly: 'Amichevole', league: 'R1', round: n => `G${n}`, atHome: 'in casa', away: 'in trasferta' },
  table: { pos: '#', club: 'Club', p: 'G', w: 'V', d: 'N', l: 'P', gd: 'DR', form: 'Forma', pts: 'Pt', up: 'Promozione', down: 'Retrocessione', letters: { V: 'V', N: 'N', D: 'P' } },
  academy: { born: y => `Nate nel ${y}`, askTrial: 'Richiedi un provino', ctaTitle: "Vuoi entrare nell'accademia?" },
  partners: { tiers: { main: 'Partner principale', kit: 'Sponsor tecnico', official: 'Partner ufficiale', academy: 'Partner accademia' }, become: 'Diventa', highlight: 'partner' },
  contact: {
    infos: { stadium: 'Stadio', city: 'Città', email: 'E-mail', press: 'Stampa' },
    subject: 'Oggetto',
    subjects: { Supporters: 'Tifosi', Partenariat: 'Partnership', Presse: 'Stampa', Académie: 'Accademia' },
    name: 'Nome',
    namePh: 'Il tuo nome',
    email: 'E-mail',
    company: 'Azienda',
    companyPh: 'Nome della tua azienda',
    message: 'Messaggio',
    messagePh: 'Il tuo messaggio',
    send: 'Invia',
    sentTitle: 'Messaggio inviato',
    sentText: 'Grazie! Ti risponderemo entro 48 ore.',
    newMessage: 'Nuovo messaggio',
  },
  errors: {
    rate: 'Troppi tentativi. Riprova tra qualche minuto.',
    subject: 'Oggetto non valido.',
    name: 'Indica il tuo nome.',
    email: 'Indirizzo e-mail non valido.',
    message: 'Il messaggio è troppo corto (minimo 10 caratteri).',
  },
  footer: { tagline: ['Calcio femminile', 'Principato di Monaco'], club: 'Club', season: 'Stagione', follow: 'Segui il club', legal: 'Note legali, privacy' },
  meta: { description: 'Monaco United, club di calcio femminile del Principato di Monaco. R1, Ligue Méditerranée.' },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, it };

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale] ?? fr;
