import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { en } from '@payloadcms/translations/languages/en';
import { fr } from '@payloadcms/translations/languages/fr';
import sharp from 'sharp';
import { Media } from './payload/collections/Media';
import { Users } from './payload/collections/Users';
import { AcademyCategories, Clubs, Matches, News, Partners, Players, Staff, Videos } from './payload/collections/content';
import { ContactMessages, NewsletterSubscribers } from './payload/collections/submissions';
import { HomePage, PagesContent, Settings, Standings } from './payload/globals';
import { migrations } from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`);
  return v;
}

const secret = required('PAYLOAD_SECRET');
if (process.env.NODE_ENV === 'production' && secret.length < 32) {
  throw new Error('PAYLOAD_SECRET doit faire au moins 32 caractères en production.');
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
  globals: [HomePage, PagesContent, Standings, Settings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: required('DATABASE_URI') },
    // En dev, le schéma suit le code (push). En prod, uniquement des migrations versionnées.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  // Surface d'attaque minimale : pas de GraphQL, CORS/CSRF limités au domaine du site.
  graphQL: { disable: true },
  cors: [serverURL],
  csrf: [serverURL],
  upload: { limits: { fileSize: 10 * 1024 * 1024 } }, // 10 Mo
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
});
