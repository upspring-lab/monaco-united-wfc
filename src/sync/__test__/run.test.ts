/**
 * Test d'intégration du moteur de synchro, sur une base de dev seedée.
 * Usage : npx payload run src/sync/__test__/run.test.ts
 * Remet la base dans son état initial à la fin (matchs, clubs et classement restaurés).
 */
import assert from 'node:assert/strict';
import config from '@payload-config';
import { getPayload } from 'payload';
import { runSync } from '../run';
import type { ExternalMatch, ExternalStandingRow, SyncProvider } from '../types';

const payload = await getPayload({ config });
const snapshot = {
  matches: (await payload.find({ collection: 'matches', limit: 1000, pagination: false, depth: 0 })).docs,
  clubs: (await payload.find({ collection: 'clubs', limit: 500, pagination: false, depth: 0 })).docs,
  standings: await payload.findGlobal({ slug: 'standings', depth: 0 }),
};

const fake = (matches: ExternalMatch[], standings: ExternalStandingRow[] = []): SyncProvider => ({
  id: 'fake',
  fetchMatches: async () => matches,
  fetchStandings: async () => standings,
});

const MU = { externalId: 'c-mu', name: 'MONACO UNITED' }; // casse différente : rapprochement par nom normalisé
const j3 = (sh?: number, sa?: number): ExternalMatch => ({
  externalId: 'm-j3',
  competition: 'league',
  round: 3,
  kickoff: '2026-09-27T15:00:00+02:00',
  home: { externalId: 'c-sdp', name: 'St Didier Pernoise' },
  away: MU,
  homeScore: sh,
  awayScore: sa,
});
const newMatch: ExternalMatch = { externalId: 'm-new', competition: 'friendly', kickoff: '2027-06-01T18:00:00+02:00', home: MU, away: { name: 'FC Nouveau Club' } };

try {
  const before = snapshot.matches.length;

  // 1. Premier passage : J3 existante adoptée (pas de doublon), score importé, nouveau club + match créés.
  let r = await runSync(payload, fake([j3(1, 4), newMatch]));
  assert.equal(r.matchesCreated, 1, 'seul le match amical est créé');
  assert.equal(r.matchesUpdated, 1, 'J3 adoptée et mise à jour');
  assert.equal(r.clubsCreated, 1, 'FC Nouveau Club créé');
  const all = (await payload.find({ collection: 'matches', limit: 1000, pagination: false, depth: 0 })).docs;
  assert.equal(all.length, before + 1, 'aucun doublon');
  const j3doc = all.find(m => m.externalId === 'm-j3')!;
  assert.equal(j3doc.homeScore, 1);
  assert.equal(j3doc.awayScore, 4);
  const mu = await payload.find({ collection: 'clubs', where: { isUs: { equals: true } }, depth: 0 });
  assert.equal(mu.docs[0].externalId, 'c-mu', 'identifiant externe posé sur Monaco United');

  // 2. Idempotence : même lot, aucune écriture.
  r = await runSync(payload, fake([j3(1, 4), newMatch]));
  assert.deepEqual([r.matchesCreated, r.matchesUpdated, r.clubsCreated], [0, 0, 0], 'second passage sans effet');

  // 3. Correction manuelle verrouillée : jamais écrasée.
  await payload.update({ collection: 'matches', id: j3doc.id, data: { homeScore: 0, awayScore: 5, lockedFromSync: true } });
  r = await runSync(payload, fake([j3(1, 4)]));
  assert.equal(r.matchesSkippedLocked, 1);
  const locked = await payload.findByID({ collection: 'matches', id: j3doc.id, depth: 0 });
  assert.deepEqual([locked.homeScore, locked.awayScore], [0, 5], 'score manuel conservé');

  // 4. Classement remplacé, sauf s'il est verrouillé.
  r = await runSync(payload, fake([], [{ club: MU, played: 3, won: 3, drawn: 0, lost: 0, goalDiff: 13, points: 9, form: 'VVV' }]));
  assert.equal(r.standingsRows, 1);
  await payload.updateGlobal({ slug: 'standings', data: { lockedFromSync: true } });
  r = await runSync(payload, fake([], [{ club: MU, played: 9, won: 9, drawn: 0, lost: 0, goalDiff: 99, points: 27 }]));
  assert.equal(r.standingsRows, 'locked');
  assert.equal((await payload.findGlobal({ slug: 'standings', depth: 0 })).rows?.[0]?.points, 9, 'classement verrouillé intact');

  // 5. Données invalides : rejet complet, rien n'est écrit.
  const count = (await payload.count({ collection: 'matches' })).totalDocs;
  await assert.rejects(runSync(payload, fake([newMatch, { ...newMatch, externalId: 'm-bad', kickoff: 'pas une date' }])), /invalide/);
  assert.equal((await payload.count({ collection: 'matches' })).totalDocs, count, 'aucune écriture sur lot invalide');

  console.log('✔ Synchro : 5 scénarios OK');
} finally {
  // Restauration de l'état initial.
  const ids = new Set(snapshot.matches.map(m => m.id));
  for (const m of (await payload.find({ collection: 'matches', limit: 1000, pagination: false, depth: 0 })).docs) {
    if (!ids.has(m.id)) await payload.delete({ collection: 'matches', id: m.id, context: { disableRevalidate: true } });
  }
  for (const m of snapshot.matches) {
    await payload.update({
      collection: 'matches',
      id: m.id,
      data: { homeScore: m.homeScore ?? null, awayScore: m.awayScore ?? null, externalId: null, lockedFromSync: false },
      context: { disableRevalidate: true },
    });
  }
  const clubIds = new Set(snapshot.clubs.map(c => c.id));
  for (const c of (await payload.find({ collection: 'clubs', limit: 500, pagination: false, depth: 0 })).docs) {
    if (!clubIds.has(c.id)) await payload.delete({ collection: 'clubs', id: c.id });
    else if (c.externalId) await payload.update({ collection: 'clubs', id: c.id, data: { externalId: null } });
  }
  await payload.updateGlobal({ slug: 'standings', data: { rows: snapshot.standings.rows, lockedFromSync: false } });
  process.exit(process.exitCode ?? 0);
}
