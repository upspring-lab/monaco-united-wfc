import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { s3Storage } from '@payloadcms/storage-s3';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig, type Plugin } from 'payload';
import { en } from '@payloadcms/translations/languages/en';
import { fr } from '@payloadcms/translations/languages/fr';
import sharp from 'sharp';
import { Media } from './payload/collections/Media';
import { Users } from './payload/collections/Users';
import { AcademyCategories, Clubs, Matches, News, Partners, Players, Staff, Videos } from './payload/collections/content';
import { ContactMessages, NewsletterSubscribers } from './payload/collections/submissions';
import { HomePage, PagesContent, Settings, Standings, SyncStatus } from './payload/globals';
import { migrations } from './migrations';
import { SUPABASE_ROOT_CA } from './payload/certs/supabase';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const onVercel = !!process.env.VERCEL;
// URL publique : SERVER_URL si défini, sinon le domaine de production Vercel (variable système), sinon local.
const serverURL =
  process.env.SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');
// Origines autorisées (CORS/CSRF) : le domaine du site, plus l'URL propre à chaque déploiement Vercel (previews).
const origins = [serverURL, ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])];

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`);
  return v;
}

const secret = required('PAYLOAD_SECRET');
if (process.env.NODE_ENV === 'production' && secret.length < 32) {
  throw new Error('PAYLOAD_SECRET doit faire au moins 32 caractères en production.');
}

// ---------- Base de données ----------
// DATABASE_URI, ou POSTGRES_URL injectée par l'intégration Supabase de Vercel (pooler, mode transaction).
const rawDbUrl = process.env.DATABASE_URI || process.env.POSTGRES_URL;
if (!rawDbUrl) throw new Error("Variable d'environnement manquante : DATABASE_URI (ou POSTGRES_URL via l'intégration Supabase)");
const dbUrl = new URL(rawDbUrl);
const isSupabase = /\.supabase\.(co|com)$/.test(dbUrl.hostname);
// TLS vérifié : certificat fourni (DATABASE_CA_CERT) ou autorité racine publique de Supabase, embarquée dans le repo.
// On retire sslmode de l'URL, sinon il prend le pas sur la configuration TLS ci-dessous.
const ca = process.env.DATABASE_CA_CERT?.replace(/\n/g, '\n') ?? (isSupabase ? SUPABASE_ROOT_CA : undefined);
if (ca) ['sslmode', 'sslrootcert', 'supa'].forEach(p => dbUrl.searchParams.delete(p));

// ---------- Médias ----------
// Priorité : Vercel Blob (jeton injecté par Vercel) > bucket S3 > disque local (dev, Docker avec volume).
// Dans les deux premiers cas, les fichiers sont servis par le CDN, et l'upload part directement du navigateur
// (contourne la limite de 4,5 Mo par requête des fonctions Vercel).
function storage(): Plugin {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return vercelBlobStorage({ token: process.env.BLOB_READ_WRITE_TOKEN, alwaysInsertFields: true, clientUploads: true, collections: { media: { disablePayloadAccessControl: true } } });
  }
  if (process.env.S3_BUCKET) {
    return s3Storage({
      bucket: process.env.S3_BUCKET,
      alwaysInsertFields: true,
      clientUploads: process.env.S3_CLIENT_UPLOADS !== 'false',
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => [required('S3_PUBLIC_URL').replace(/\/$/, ''), prefix, filename].filter(Boolean).join('/'),
        },
      },
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'eu-west-3',
        forcePathStyle: true,
        credentials: { accessKeyId: required('S3_ACCESS_KEY_ID'), secretAccessKey: required('S3_SECRET_ACCESS_KEY') },
      },
    });
  }
  // Désactivé, mais garde les mêmes colonnes en base quel que soit l'environnement.
  return vercelBlobStorage({ token: undefined, enabled: false, alwaysInsertFields: true, collections: { media: true } });
}

// E-mail facultatif : sans SMTP, Payload journalise les e-mails dans la console.
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'no-reply@monacounited.mc',
      defaultFromName: process.env.SMTP_FROM_NAME || 'Monaco United',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      },
    })
  : undefined;

export default buildConfig({
  plugins: [storage()],
  email,
  serverURL,
  secret,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Monaco United admin' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { fr, en }, fallbackLanguage: 'fr' },
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
      { code: 'it', label: 'Italiano' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  collections: [News, Players, Staff, Clubs, Matches, Videos, Partners, AcademyCategories, Media, ContactMessages, NewsletterSubscribers, Users],
  globals: [HomePage, PagesContent, Standings, SyncStatus, Settings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: dbUrl.toString(),
      // Serverless : peu de connexions par instance, le pooler Supabase (Supavisor) mutualise.
      max: Number(process.env.DATABASE_POOL_MAX || (onVercel ? 3 : 10)),
      idleTimeoutMillis: 10_000,
      ssl: ca ? { ca, rejectUnauthorized: true } : undefined,
    },
    // En dev, le schéma suit le code (push). En prod, uniquement des migrations versionnées.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
    // Sur Vercel, les migrations sont appliquées au build (script `ci`), pas à chaque démarrage à froid.
    prodMigrations: onVercel ? undefined : migrations,
  }),
  sharp,
  // Surface d'attaque minimale : pas de GraphQL, CORS/CSRF limités au domaine du site.
  graphQL: { disable: true },
  cors: origins,
  csrf: origins,
  upload: { limits: { fileSize: 10 * 1024 * 1024 } }, // 10 Mo
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
});
