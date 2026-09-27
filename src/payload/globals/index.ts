import type { Field, GlobalConfig } from 'payload';
import { anyone, staffOnly } from '../access';
import { revalidateGlobal } from '../hooks/revalidate';

const globalAccess = { read: anyone, update: staffOnly };
const hooks = { afterChange: [revalidateGlobal] };

const pageHead = (name: string, label: string, extra: Field[] = []): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, localized: true },
    { name: 'intro', label: 'Introduction', type: 'textarea', required: true, localized: true, maxLength: 240 },
    ...extra,
  ],
});

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Réglages du site',
  admin: { group: 'Administration' },
  access: globalAccess,
  hooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Coordonnées',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'stadium', label: 'Stade', type: 'text', required: true },
                { name: 'city', label: 'Ville', type: 'text', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'email', label: 'E-mail de contact', type: 'email', required: true },
                { name: 'pressEmail', label: 'E-mail presse', type: 'email' },
              ],
            },
            { name: 'mapQuery', label: 'Recherche Google Maps', type: 'text', required: true, admin: { description: 'Ex. « Stade Didier Deschamps, Cap-d’Ail »' } },
            {
              name: 'notificationEmail',
              label: 'Notifier les messages de contact à',
              type: 'email',
              admin: { description: "Nécessite la configuration SMTP (variables d'environnement)." },
            },
          ],
        },
        {
          label: 'Réseaux sociaux',
          fields: [
            {
              name: 'socials',
              label: 'Réseaux',
              type: 'array',
              fields: [
                { name: 'label', label: 'Nom', type: 'text', required: true },
                { name: 'url', label: 'Lien', type: 'text', required: true, validate: (v: unknown) => /^https:\/\//.test(String(v ?? '')) || 'Lien https requis' },
              ],
            },
          ],
        },
        {
          label: 'Référencement',
          fields: [
            { name: 'metaTitle', label: 'Titre par défaut', type: 'text', localized: true },
            { name: 'metaDescription', label: 'Description par défaut', type: 'textarea', localized: true, maxLength: 200 },
          ],
        },
      ],
    },
  ],
};

export const HomePage: GlobalConfig = {
  slug: 'home',
  label: 'Accueil',
  admin: { group: 'Pages' },
  access: globalAccess,
  hooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroPhotos', label: 'Photos du hero', type: 'upload', relationTo: 'media', hasMany: true, minRows: 3, maxRows: 3, required: true },
            { name: 'tagline', label: 'Accroche du fanion', type: 'textarea', localized: true, defaultValue: 'Football féminin\nPrincipauté de Monaco' },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'band',
              label: 'Bandeau typographique',
              type: 'group',
              fields: [
                { name: 'line1', label: 'Ligne rouge', type: 'text', localized: true, defaultValue: 'Monaco United' },
                { name: 'line2', label: 'Ligne contour', type: 'text', localized: true, defaultValue: 'Jouer pour la Principauté' },
              ],
            },
            {
              name: 'academy',
              label: 'Bloc académie',
              type: 'group',
              fields: [
                { name: 'text', label: 'Texte', type: 'text', localized: true },
                { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
              ],
            },
            { name: 'videosNote', label: 'Mention vidéos', type: 'text', localized: true, admin: { description: 'Ex. « Contenus à venir ». Laisser vide pour masquer.' } },
            { name: 'newsletterText', label: 'Texte newsletter', type: 'text', localized: true },
          ],
        },
        {
          label: 'Galerie',
          fields: [
            {
              name: 'gallery',
              label: 'Mosaïque',
              type: 'array',
              maxRows: 12,
              admin: { description: 'Grille de 4 colonnes : chaque photo occupe 1 ou 2 colonnes et 1 ou 2 rangées.' },
              fields: [
                { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'cols', label: 'Colonnes', type: 'select', defaultValue: '1', options: ['1', '2'] },
                    { name: 'rows', label: 'Rangées', type: 'select', defaultValue: '1', options: ['1', '2'] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const Standings: GlobalConfig = {
  slug: 'standings',
  label: 'Classement',
  admin: { group: 'Saison', description: 'Ordre des lignes = ordre du classement (glisser-déposer).' },
  access: globalAccess,
  hooks,
  fields: [
    { name: 'note', label: 'Mention sous le tableau', type: 'text', localized: true },
    {
      name: 'rows',
      label: 'Classement',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'club', label: 'Club', type: 'relationship', relationTo: 'clubs', required: true },
        {
          type: 'row',
          fields: [
            { name: 'played', label: 'J', type: 'number', min: 0, defaultValue: 0 },
            { name: 'won', label: 'V', type: 'number', min: 0, defaultValue: 0 },
            { name: 'drawn', label: 'N', type: 'number', min: 0, defaultValue: 0 },
            { name: 'lost', label: 'D', type: 'number', min: 0, defaultValue: 0 },
            { name: 'goalDiff', label: 'Diff', type: 'number', defaultValue: 0 },
            { name: 'points', label: 'Pts', type: 'number', min: 0, defaultValue: 0 },
          ],
        },
        {
          name: 'form',
          label: 'Forme (5 derniers)',
          type: 'text',
          admin: { description: 'Lettres V, N ou D, du plus ancien au plus récent. Ex. VVN' },
          validate: (v: unknown) => !v || /^[VND]{1,5}$/.test(String(v)) || 'Uniquement V, N ou D (5 max)',
        },
      ],
    },
  ],
};

export const PagesContent: GlobalConfig = {
  slug: 'pages',
  label: 'Pages intérieures',
  admin: { group: 'Pages' },
  access: globalAccess,
  hooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Équipe', fields: [pageHead('equipe', 'En-tête', [{ name: 'staffNote', label: 'Mention staff', type: 'text', localized: true }])] },
        { label: 'Calendrier', fields: [pageHead('calendrier', 'En-tête')] },
        { label: 'Classement', fields: [pageHead('classement', 'En-tête')] },
        { label: 'Actualités', fields: [pageHead('actus', 'En-tête')] },
        {
          label: 'Académie',
          fields: [
            pageHead('academie', 'En-tête', [
              { name: 'image', label: 'Grande image', type: 'upload', relationTo: 'media' },
              { name: 'ctaTitle', label: 'Titre du CTA', type: 'text', localized: true },
            ]),
          ],
        },
        {
          label: 'Partenaires',
          fields: [
            pageHead('partenaires', 'En-tête', [
              { name: 'pitchTitle', label: 'Titre « Devenez partenaire »', type: 'text', localized: true },
              { name: 'pitchText', label: 'Argumentaire', type: 'textarea', localized: true },
              {
                name: 'offers',
                label: 'Offres',
                type: 'array',
                maxRows: 8,
                fields: [
                  { name: 'title', label: 'Titre', type: 'text', required: true, localized: true },
                  { name: 'text', label: 'Description', type: 'textarea', required: true, localized: true },
                ],
              },
            ]),
          ],
        },
        { label: 'Contact', fields: [pageHead('contact', 'En-tête')] },
      ],
    },
  ],
};
