import type { MatchVM, Result } from './types';

/** Prochain match : premier match sans score dont le coup d'envoi + 2h n'est pas passé. */
export function nextMatch(matches: MatchVM[], now: number): MatchVM | undefined {
  return matches.find(m => !m.played && m.ts + 2 * 36e5 > now) ?? matches[matches.length - 1];
}

export function resultOf(m: MatchVM): Result | null {
  if (m.sh == null || m.sa == null) return null;
  const mu = m.isHome ? m.sh : m.sa;
  const op = m.isHome ? m.sa : m.sh;
  return mu > op ? 'V' : mu === op ? 'N' : 'D';
}
