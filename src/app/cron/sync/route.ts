import { timingSafeEqual } from 'crypto';
import config from '@payload-config';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import { purgeRateLimits } from '@/lib/rateLimit';
import { getProvider } from '@/sync/providers';
import { describe, runSync } from '@/sync/run';

// Tâche nocturne (vercel.json) : synchro des données sportives + ménage des compteurs de rate limit.
// Vercel l'appelle avec « Authorization: Bearer <CRON_SECRET> » ; toute autre requête est refusée.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(req.headers.get('authorization') ?? '');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(req: Request) {
  if (!authorized(req)) return new Response('Unauthorized', { status: 401 });

  const payload = await getPayload({ config });
  const now = new Date().toISOString();
  const purged = await purgeRateLimits().catch(() => 0);

  let provider;
  try {
    provider = getProvider();
  } catch (err) {
    await payload.updateGlobal({ slug: 'sync-status', data: { lastRunAt: now, status: 'error', message: String(err) } });
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }

  if (!provider) {
    await payload.updateGlobal({ slug: 'sync-status', data: { provider: '—', lastRunAt: now, status: 'disabled', message: 'Aucune source configurée (SYNC_PROVIDER).' } });
    return Response.json({ ok: true, skipped: 'no provider', purged });
  }

  try {
    const report = await runSync(payload, provider);
    const message = describe(report);
    await payload.updateGlobal({ slug: 'sync-status', data: { provider: provider.id, lastRunAt: now, lastSuccessAt: now, status: 'ok', message } });
    revalidatePath('/', 'layout');
    return Response.json({ ok: true, report, purged });
  } catch (err) {
    // Un échec du fournisseur ou des données invalides n'écrivent rien (tout est lu et validé avant).
    // Un échec en cours d'écriture est rattrapé au passage suivant : la synchro est idempotente.
    const message = err instanceof Error ? err.message : String(err);
    payload.logger.error({ err }, 'Synchronisation échouée');
    await payload.updateGlobal({ slug: 'sync-status', data: { provider: provider.id, lastRunAt: now, status: 'error', message: message.slice(0, 2000) } });
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
