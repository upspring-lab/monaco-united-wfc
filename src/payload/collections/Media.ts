import path from 'path';
import { fileURLToPath } from 'url';
import type { CollectionConfig } from 'payload';
import { anyone, staffOnly } from '../access';
import { revalidateHooks } from '../hooks/revalidate';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const webp = { format: 'webp' as const, options: { quality: 78 } };

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: { group: 'Contenu', defaultColumns: ['filename', 'alt', 'updatedAt'] },
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: revalidateHooks,
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(dirname, '../../../media'),
    // Pas de SVG : un SVG servi depuis notre domaine peut embarquer du script (XSS).
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumb',
    // L'original est conservé ; le site sert uniquement les déclinaisons WebP ci-dessous.
    imageSizes: [
      { name: 'thumb', width: 400, withoutEnlargement: true, formatOptions: webp },
      { name: 'md', width: 900, withoutEnlargement: true, formatOptions: webp },
      { name: 'lg', width: 1600, withoutEnlargement: true, formatOptions: webp },
      { name: 'xl', width: 2400, withoutEnlargement: true, formatOptions: webp },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Texte alternatif',
      type: 'text',
      localized: true,
      admin: { description: "Décrit l'image pour les lecteurs d'écran. Laisser vide si purement décorative." },
    },
  ],
};
