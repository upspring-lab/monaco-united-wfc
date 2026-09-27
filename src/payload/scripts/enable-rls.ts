/**
 * Active Row Level Security sur toutes les tables du schéma public, sans politique.
 *
 * Pourquoi : Supabase expose le schéma public via son API Data (PostgREST) avec une clé « anon » publique.
 * Sans RLS, n'importe qui pourrait lire ou modifier les tables Payload (comptes, messages…).
 * Avec RLS et aucune politique, les rôles anon/authenticated n'ont accès à rien ;
 * Payload se connecte en propriétaire des tables et n'est pas concerné.
 *
 * Exécuté après chaque `payload migrate` (script `ci`), donc aussi pour les tables des futures migrations.
 * Sans effet de bord sur un PostgreSQL classique.
 */
import config from '@payload-config';
import { sql } from '@payloadcms/db-postgres';
import { getPayload } from 'payload';

const payload = await getPayload({ config });
const db = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<{ rows: { tablename: string }[] }> } }).drizzle;

const { rows } = await db.execute(sql`
  SELECT tablename FROM pg_tables
  WHERE schemaname = 'public' AND NOT rowsecurity
`);

for (const { tablename } of rows) {
  await db.execute(sql.raw(`ALTER TABLE "public"."${tablename.replace(/"/g, '""')}" ENABLE ROW LEVEL SECURITY`));
}

payload.logger.info(rows.length ? `RLS activé sur ${rows.length} table(s).` : 'RLS déjà actif sur toutes les tables.');
process.exit(0);
