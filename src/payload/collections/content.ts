import type { CollectionConfig, FieldHook } from 'payload';
import { anyone, publishedOrStaff, staffOnly } from '../access';
import { revalidateHooks } from '../hooks/revalidate';

const contentAccess = { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly };

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const slugFromTitle: FieldHook = ({ value, data }) => (value ? slugify(String(value)) : data?.title ? slugify(String(data.title)) : value);

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Actualité', plural: 'Actualités' },
  admin: { group: 'Contenu', useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt', '_status'] },
  defaultSort: '-publishedAt',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { ...contentAccess, read: publishedOrStaff },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, localized: true, maxLength: 160 },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      unique: true,
      index: true,
      hooks: { beforeValidate: [slugFromTitle] },
      admin: { position: 'sidebar', description: 'Généré depuis le titre si vide.' },
    },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      required: true,
      defaultValue: 'Match',
      options: ['Match', 'Avant-match', 'Coupe', 'Académie', 'Club', 'Partenaires'].map(v => ({ label: v, value: v })),
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', label: 'Date de publication', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar' } },
    { name: 'featured', label: 'À la une', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: "Mis en avant en tête de l'accueil et des actualités." } },
    { name: 'cover', label: 'Image de couverture', type: 'upload', relationTo: 'media', required: true },
    { name: 'excerpt', label: 'Chapô', type: 'textarea', required: true, localized: true, maxLength: 300 },
    { name: 'content', label: 'Article', type: 'richText', localized: true },
  ],
};

export const Players: CollectionConfig = {
  slug: 'players',
  labels: { singular: 'Joueuse', plural: 'Joueuses' },
  admin: { group: 'Équipe', useAsTitle: 'name', defaultColumns: ['number', 'name', 'line', 'active'] },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'number', label: 'Numéro', type: 'number', required: true, min: 1, max: 99, admin: { width: '20%' } },
        { name: 'name', label: 'Nom', type: 'text', required: true, admin: { width: '80%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'line',
          label: 'Ligne',
          type: 'select',
          required: true,
          options: [
            { label: 'Gardienne', value: 'G' },
            { label: 'Défenseure', value: 'D' },
            { label: 'Milieu', value: 'M' },
            { label: 'Attaquante', value: 'A' },
          ],
        },
        { name: 'position', label: 'Poste', type: 'text', required: true, localized: true, admin: { description: 'Ex. Latérale droite' } },
        { name: 'nationality', label: 'Nationalité', type: 'text', localized: true },
      ],
    },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media', required: true },
    { name: 'active', label: "Dans l'effectif", type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
};

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Membre du staff', plural: 'Staff' },
  admin: { group: 'Équipe', useAsTitle: 'name', defaultColumns: ['name', 'role'] },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'role', label: 'Fonction', type: 'text', required: true, localized: true },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media', admin: { description: 'Facultatif : un placeholder « Photo à venir » est affiché sinon.' } },
  ],
};

export const Clubs: CollectionConfig = {
  slug: 'clubs',
  labels: { singular: 'Club', plural: 'Clubs' },
  admin: { group: 'Saison', useAsTitle: 'name', defaultColumns: ['name', 'isUs'] },
  defaultSort: 'name',
  access: contentAccess,
  hooks: revalidateHooks,
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, unique: true },
    { name: 'crest', label: 'Écusson', type: 'upload', relationTo: 'media' },
    { name: 'isUs', label: "C'est Monaco United", type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'externalId', label: 'Identifiant externe (synchro)', type: 'text', unique: true, index: true, admin: { position: 'sidebar', readOnly: true, description: 'Renseigné par la synchronisation automatique.' } },
  ],
};

export const Matches: CollectionConfig = {
  slug: 'matches',
  labels: { singular: 'Match', plural: 'Matchs' },
  admin: { group: 'Saison', useAsTitle: 'label', defaultColumns: ['label', 'kickoff', 'homeScore', 'awayScore'] },
  defaultSort: 'kickoff',
  access: contentAccess,
  hooks: {
    ...revalidateHooks,
    beforeChange: [
      // Libellé lisible dans l'admin, ex. « J3 · St Didier Pernoise vs Monaco United ».
      async ({ data, originalDoc, req }) => {
        const d = { ...originalDoc, ...data };
        const name = async (ref: unknown) => {
          const id = ref && typeof ref === 'object' ? (ref as { id: number }).id : (ref as number | undefined);
          if (!id) return '?';
          const club = await req.payload.findByID({ collection: 'clubs', id, depth: 0, req, disableErrors: true });
          return club?.name ?? '?';
        };
        const comp = d.competition === 'cup' ? 'Coupe' : d.competition === 'friendly' ? 'Amical' : `J${d.round ?? '?'}`;
        return { ...data, label: `${comp} · ${await name(d.home)} vs ${await name(d.away)}` };
      },
    ],
  },
  fields: [
    { name: 'label', type: 'text', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'competition',
          label: 'Compétition',
          type: 'select',
          required: true,
          defaultValue: 'league',
          options: [
            { label: 'R1 féminine', value: 'league' },
            { label: 'Coupe de France', value: 'cup' },
            { label: 'Match amical', value: 'friendly' },
          ],
        },
        { name: 'round', label: 'Journée', type: 'number', min: 1, admin: { condition: (_, s) => s?.competition === 'league' } },
        {
          name: 'kickoff',
          label: "Coup d'envoi",
          type: 'date',
          required: true,
          index: true,
          admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'home', label: 'Domicile', type: 'relationship', relationTo: 'clubs', required: true },
        { name: 'away', label: 'Extérieur', type: 'relationship', relationTo: 'clubs', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'homeScore', label: 'Score domicile', type: 'number', min: 0 },
        { name: 'awayScore', label: 'Score extérieur', type: 'number', min: 0 },
      ],
    },
    { name: 'note', label: 'Note', type: 'text', localized: true, admin: { description: 'Ex. « Match reporté ». Facultatif.' } },
    { name: 'externalId', label: 'Identifiant externe (synchro)', type: 'text', unique: true, index: true, admin: { position: 'sidebar', readOnly: true, description: 'Renseigné par la synchronisation automatique.' } },
    {
      name: 'lockedFromSync',
      label: 'Ne pas écraser par la synchro',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Cocher après une correction manuelle pour que la synchronisation ne la remplace pas.' },
    },
  ],
};

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Vidéo', plural: 'Vidéos' },
  admin: { group: 'Contenu', useAsTitle: 'title' },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, localized: true },
    { name: 'thumbnail', label: 'Vignette', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', label: 'Lien (YouTube, Instagram…)', type: 'text', validate: (v: unknown) => !v || /^https:\/\//.test(String(v)) || 'Lien https requis' },
  ],
};

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partenaire', plural: 'Partenaires' },
  admin: { group: 'Club', useAsTitle: 'name', defaultColumns: ['name', 'tier', 'showOnHome'] },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    {
      name: 'tier',
      label: 'Type',
      type: 'select',
      required: true,
      defaultValue: 'official',
      options: [
        { label: 'Partenaire principal', value: 'main' },
        { label: 'Équipementier', value: 'kit' },
        { label: 'Partenaire officiel', value: 'official' },
        { label: 'Partenaire académie', value: 'academy' },
      ],
    },
    { name: 'placement', label: 'Visibilité', type: 'text', localized: true, admin: { description: 'Ex. « Face avant du maillot »' } },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media', admin: { description: 'Facultatif : le nom est affiché sinon.' } },
    { name: 'url', label: 'Site web', type: 'text', validate: (v: unknown) => !v || /^https:\/\//.test(String(v)) || 'Lien https requis' },
    { name: 'showOnHome', label: "Afficher sur l'accueil", type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'placeholder', label: 'Emplacement libre (« Votre marque »)', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
};

export const AcademyCategories: CollectionConfig = {
  slug: 'academy-categories',
  labels: { singular: 'Catégorie académie', plural: 'Catégories académie' },
  admin: { group: 'Club', useAsTitle: 'code' },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'code', label: 'Code', type: 'text', required: true, admin: { description: 'Ex. U15' } },
        { name: 'years', label: 'Années de naissance', type: 'text', required: true, admin: { description: 'Ex. 2012-2013' } },
      ],
    },
    { name: 'focus', label: 'Objectif', type: 'text', required: true, localized: true },
    { name: 'slots', label: 'Créneaux', type: 'text', required: true, localized: true },
  ],
};
