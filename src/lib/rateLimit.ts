import 'server-only';
import config from '@payload-config';
import { headers } from 'next/headers';
import { getPayload } from 'payload';

// Limiteur à fenêtre glissante stocké dans le KV de Payload (table en base) :
// partagé entre toutes les instances serverless, contrairement à un compteur en mémoire.
// Non atomique : en cas de rafale simultanée, une ou deux requêtes de plus peuvent passer, ce qui reste acceptable ici.

const PREFIX = 'rl:';

export async function clientIp(): Promise<string> {
  const h = await headers();
  // Vercel (et tout reverse proxy correctement configuré) écrase ces en-têtes : ils ne sont pas falsifiables par le client.
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

/** true si l'appel est autorisé, false si la limite est atteinte. */
export async function rateLimit(scope: string, max: number, windowMs: number): Promise<boolean> {
  const payload = await getPayload({ config });
  const key = `${PREFIX}${scope}:${await clientIp()}`;
  const now = Date.now();
  const stored = await payload.kv.get<{ hits: number[] }>(key);
  const hits = (stored?.hits ?? []).filter(t => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  await payload.kv.set(key, { hits, updatedAt: now });
  return true;
}

/** Supprime les compteurs inactifs depuis plus de `olderThanMs` (appelé par la tâche planifiée). */
export async function purgeRateLimits(olderThanMs = 24 * 3600 * 1000): Promise<number> {
  const payload = await getPayload({ config });
  const now = Date.now();
  let removed = 0;
  for (const key of await payload.kv.keys()) {
    if (!key.startsWith(PREFIX)) continue;
    const v = await payload.kv.get<{ updatedAt?: number }>(key);
    if (!v?.updatedAt || now - v.updatedAt > olderThanMs) {
      await payload.kv.delete(key);
      removed++;
    }
  }
  return removed;
}
