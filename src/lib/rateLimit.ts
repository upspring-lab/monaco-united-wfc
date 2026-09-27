import 'server-only';
import { headers } from 'next/headers';

// Limiteur en mémoire à fenêtre glissante. Suffisant pour une instance unique ;
// avec plusieurs instances, déplacer le compteur dans Redis ou dans le reverse proxy.
const buckets = new Map<string, number[]>();

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

/** true si l'appel est autorisé, false si la limite est atteinte. */
export async function rateLimit(scope: string, max: number, windowMs: number): Promise<boolean> {
  const key = `${scope}:${await clientIp()}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter(t => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) if (!v.some(t => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}
