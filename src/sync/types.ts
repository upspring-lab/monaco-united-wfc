// Contrat d'un connecteur de données sportives (Score'n'co, API Ligue/FFF…).
// Un connecteur ne fait que lire et normaliser ; toute l'écriture en base est dans run.ts.

export interface ExternalClub {
  /** Identifiant stable chez le fournisseur, si disponible (sinon rapprochement par nom). */
  externalId?: string;
  name: string;
}

export interface ExternalMatch {
  /** Identifiant stable du match chez le fournisseur : clé de mise à jour idempotente. */
  externalId: string;
  competition: 'league' | 'cup' | 'friendly';
  round?: number;
  /** Date ISO 8601 avec fuseau. */
  kickoff: string;
  home: ExternalClub;
  away: ExternalClub;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface ExternalStandingRow {
  club: ExternalClub;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: number;
  points: number;
  /** V/N/D du plus ancien au plus récent (5 max). */
  form?: string;
}

export interface SyncProvider {
  id: string;
  fetchMatches(): Promise<ExternalMatch[]>;
  fetchStandings(): Promise<ExternalStandingRow[]>;
}
