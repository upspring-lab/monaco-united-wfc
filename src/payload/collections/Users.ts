import type { CollectionConfig } from 'payload';
import { adminFieldOnly, adminOnly, adminOrSelf } from '../access';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'], group: 'Administration' },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 h
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 min
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    // La création du tout premier compte passe par l'écran « Create first user » de Payload.
    create: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: adminOnly,
    unlock: adminOnly,
  },
  hooks: {
    beforeChange: [
      // Le premier utilisateur créé devient administrateur.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        const { totalDocs } = await req.payload.count({ collection: 'users', req });
        return totalDocs === 0 ? { ...data, role: 'admin' } : data;
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { create: adminFieldOnly, update: adminFieldOnly },
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur', value: 'editor' },
      ],
      admin: {
        description: 'Éditeur : gère le contenu. Administrateur : gère aussi les comptes.',
        // Masqué sur l'écran « premier utilisateur » : ce compte devient administrateur d'office.
        condition: (_data, _sibling, { user }) => !!user,
      },
    },
  ],
};
