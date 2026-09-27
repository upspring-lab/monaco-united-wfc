import type { CollectionConfig } from 'payload';
import { adminOnly, nobody, staffOnly } from '../access';

// Les formulaires publics écrivent via des Server Actions (API locale, validation + rate limit).
// L'API REST ne permet donc aucune création anonyme.

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Message', plural: 'Messages de contact' },
  admin: { group: 'Formulaires', useAsTitle: 'name', defaultColumns: ['name', 'subject', 'email', 'status', 'createdAt'] },
  defaultSort: '-createdAt',
  access: { create: nobody, read: staffOnly, update: staffOnly, delete: adminOnly },
  hooks: {
    afterChange: [
      // Notification e-mail à l'adresse définie dans Réglages (si SMTP configuré).
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || !process.env.SMTP_HOST) return doc;
        try {
          const settings = await req.payload.findGlobal({ slug: 'settings', depth: 0, req });
          if (!settings.notificationEmail) return doc;
          const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
          await req.payload.sendEmail({
            to: settings.notificationEmail,
            replyTo: doc.email,
            subject: `[Site] ${doc.subject} : message de ${doc.name}`,
            html: `<p><strong>${esc(doc.name)}</strong> (${esc(doc.email)})${doc.company ? `, ${esc(doc.company)}` : ''}</p><p>${esc(doc.message ?? '').replace(/\n/g, '<br>')}</p>`,
          });
        } catch (err) {
          req.payload.logger.error({ err }, 'Notification de contact non envoyée');
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'En cours', value: 'in_progress' },
        { label: 'Traité', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'subject',
      label: 'Objet',
      type: 'select',
      required: true,
      options: ['Supporters', 'Partenariat', 'Presse', 'Académie'].map(v => ({ label: v, value: v })),
      admin: { readOnly: true },
    },
    { name: 'name', label: 'Nom', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'email', label: 'E-mail', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'company', label: 'Entreprise', type: 'text', admin: { readOnly: true } },
    { name: 'message', label: 'Message', type: 'textarea', admin: { readOnly: true } },
    { name: 'locale', label: 'Langue', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'internalNote', label: 'Note interne', type: 'textarea' },
  ],
};

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Inscrit', plural: 'Inscrits newsletter' },
  admin: { group: 'Formulaires', useAsTitle: 'email', defaultColumns: ['email', 'locale', 'createdAt'] },
  defaultSort: '-createdAt',
  access: { create: nobody, read: staffOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'email', label: 'E-mail', type: 'email', required: true, unique: true, index: true },
    { name: 'locale', label: 'Langue', type: 'text' },
    { name: 'unsubscribed', label: 'Désinscrit', type: 'checkbox', defaultValue: false },
  ],
};
