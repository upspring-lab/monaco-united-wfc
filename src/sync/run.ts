import type { Payload } from 'payload';
import type { ExternalClub, ExternalMatch, ExternalStandingRow, SyncProvider } from './types';

export interface SyncReport {
  clubsCreated: number;
  matchesCreated: number;
  matchesUpdated: number;
  matchesSkippedLocked: number;
  standingsRows: number | 'locked';
}

// Écritures faites en lot : les hooks de purge du cache sont neutralisés, on purge une seule fois à la fin.
const ctx = { disableRevalidate: true };

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Validation défensive des données reçues : on refuse un lot incohérent plutôt que d'abîmer la base. */
function assertMatches(list: ExternalMatch[]) {
  for (const m of list) {
    if (!m.externalId || !m.home?.name || !m.away?.name || Number.isNaN(Date.parse(m.kickoff))) {
      throw new Error(`Match invalide reçu du fournisseur : ${JSON.stringify(m).slice(0, 200)}`);
    }
  }
}

function assertStandings(rows: ExternalStandingRow[]) {
  for (const r of rows) {
    if (!r.club?.name || [r.played, r.won, r.drawn, r.lost, r.points].some(n => !Number.isInteger(n) || n < 0)) {
      throw new Error(`Ligne de classement invalide : ${JSON.stringify(r).slice(0, 200)}`);
    }
  }
}

/** Rapproche un club externe d'un club en base (identifiant externe, puis nom), ou le crée. */
async function clubResolver(payload: Payload) {
  const { docs } = await payload.find({ collection: 'clubs', limit: 500, pagination: false, depth: 0 });
  const byExt = new Map(docs.filter(c => c.externalId).map(c => [c.externalId!, c]));
  const byName = new Map(docs.map(c => [norm(c.name), c]));
  let created = 0;

  const resolve = async (ext: ExternalClub): Promise<number> => {
    const found = (ext.externalId && byExt.get(ext.externalId)) || byName.get(norm(ext.name));
    if (found) {
      if (ext.externalId && !found.externalId) {
        await payload.update({ collection: 'clubs', id: found.id, data: { externalId: ext.externalId }, context: ctx });
        found.externalId = ext.externalId;
        byExt.set(ext.externalId, found);
      }
      return found.id;
    }
    const doc = await payload.create({ collection: 'clubs', data: { name: ext.name, externalId: ext.externalId }, context: ctx });
    byName.set(norm(doc.name), doc);
    if (doc.externalId) byExt.set(doc.externalId, doc);
    created++;
    return doc.id;
  };
  return { resolve, created: () => created };
}

export async function runSync(payload: Payload, provider: SyncProvider): Promise<SyncReport> {
  // Lecture complète avant toute écriture : si le fournisseur échoue, rien n'est modifié.
  const [matches, standings] = await Promise.all([provider.fetchMatches(), provider.fetchStandings()]);
  assertMatches(matches);
  assertStandings(standings);

  const clubs = await clubResolver(payload);
  const report: SyncReport = { clubsCreated: 0, matchesCreated: 0, matchesUpdated: 0, matchesSkippedLocked: 0, standingsRows: 0 };

  const { docs: existing } = await payload.find({ collection: 'matches', limit: 1000, pagination: false, depth: 0 });
  const byExt = new Map(existing.filter(m => m.externalId).map(m => [m.externalId!, m]));
  // Matchs saisis à la main (ou importés par le seed) avant la première synchro : rapprochés par jour + affiche,
  // pour être adoptés au lieu d'être dupliqués.
  const day = (iso: string) => new Date(iso).toISOString().slice(0, 10);
  const fixtureKey = (kickoff: string, home: unknown, away: unknown) => `${day(kickoff)}|${home}|${away}`;
  const orphans = new Map(existing.filter(m => !m.externalId).map(m => [fixtureKey(m.kickoff, m.home, m.away), m]));

  for (const m of matches) {
    const data = {
      competition: m.competition,
      round: m.round,
      kickoff: new Date(m.kickoff).toISOString(),
      home: await clubs.resolve(m.home),
      away: await clubs.resolve(m.away),
      homeScore: m.homeScore ?? null,
      awayScore: m.awayScore ?? null,
      externalId: m.externalId,
    };
    let current = byExt.get(m.externalId);
    if (!current) {
      const key = fixtureKey(data.kickoff, data.home, data.away);
      current = orphans.get(key);
      if (current) orphans.delete(key);
    }
    if (!current) {
      await payload.create({ collection: 'matches', data, context: ctx });
      report.matchesCreated++;
      continue;
    }
    if (current.lockedFromSync) {
      // Verrouillé : on ne touche qu'au lien avec le fournisseur, jamais aux données saisies.
      if (!current.externalId) await payload.update({ collection: 'matches', id: current.id, data: { externalId: m.externalId }, context: ctx });
      report.matchesSkippedLocked++;
      continue;
    }
    const changed =
      !current.externalId ||
      current.competition !== data.competition ||
      (current.round ?? undefined) !== data.round ||
      new Date(current.kickoff).toISOString() !== data.kickoff ||
      current.home !== data.home ||
      current.away !== data.away ||
      (current.homeScore ?? null) !== data.homeScore ||
      (current.awayScore ?? null) !== data.awayScore;
    if (changed) {
      await payload.update({ collection: 'matches', id: current.id, data, context: ctx });
      report.matchesUpdated++;
    }
  }

  const standingsDoc = await payload.findGlobal({ slug: 'standings', depth: 0 });
  if (standingsDoc.lockedFromSync) {
    report.standingsRows = 'locked';
  } else if (standings.length) {
    const rows = [];
    for (const r of standings) {
      rows.push({
        club: await clubs.resolve(r.club),
        played: r.played,
        won: r.won,
        drawn: r.drawn,
        lost: r.lost,
        goalDiff: r.goalDiff,
        points: r.points,
        form: (r.form ?? '').replace(/[^VND]/g, '').slice(-5) || undefined,
      });
    }
    await payload.updateGlobal({ slug: 'standings', data: { rows }, context: ctx });
    report.standingsRows = rows.length;
  }

  report.clubsCreated = clubs.created();
  return report;
}

export function describe(r: SyncReport): string {
  const standings = r.standingsRows === 'locked' ? 'classement verrouillé (non modifié)' : `classement : ${r.standingsRows} lignes`;
  return [
    `${r.matchesCreated} match(s) ajouté(s), ${r.matchesUpdated} mis à jour`,
    r.matchesSkippedLocked ? `${r.matchesSkippedLocked} verrouillé(s) ignoré(s)` : '',
    r.clubsCreated ? `${r.clubsCreated} club(s) créé(s)` : '',
    standings,
  ]
    .filter(Boolean)
    .join(' · ');
}
