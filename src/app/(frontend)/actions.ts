'use server';

import config from '@payload-config';
import { getPayload } from 'payload';
import { isLocale } from '@/i18n/config';
import { rateLimit } from '@/lib/rateLimit';

export interface FormState {
  ok: boolean;
  error?: string;
}

const SUBJECTS = ['Supporters', 'Partenariat', 'Presse', 'Académie'] as const;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

const str = (fd: FormData, key: string, max: number) => {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
};

// Champ piège invisible pour les humains : s'il est rempli, c'est un robot. On répond « ok » sans rien enregistrer.
const isBot = (fd: FormData) => str(fd, 'website', 200) !== '';

export async function submitContact(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (!(await rateLimit('contact', 5, 10 * 60 * 1000))) return { ok: false, error: 'Trop de messages envoyés. Réessayez dans quelques minutes.' };

  const subject = str(fd, 'subject', 40);
  const name = str(fd, 'name', 120);
  const email = str(fd, 'email', 254).toLowerCase();
  const company = str(fd, 'company', 160);
  const message = str(fd, 'message', 5000);
  const locale = str(fd, 'locale', 2);

  if (!SUBJECTS.includes(subject as (typeof SUBJECTS)[number])) return { ok: false, error: 'Objet invalide.' };
  if (name.length < 2) return { ok: false, error: 'Merci d’indiquer votre nom.' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Adresse e-mail invalide.' };
  if (message.length < 10) return { ok: false, error: 'Votre message est trop court.' };

  const payload = await getPayload({ config });
  await payload.create({
    collection: 'contact-messages',
    data: {
      subject: subject as (typeof SUBJECTS)[number],
      name,
      email,
      company: subject === 'Partenariat' ? company : undefined,
      message,
      locale: isLocale(locale) ? locale : 'fr',
    },
  });
  return { ok: true };
}

export async function subscribeNewsletter(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (!(await rateLimit('newsletter', 5, 10 * 60 * 1000))) return { ok: false, error: 'Trop de tentatives. Réessayez plus tard.' };

  const email = str(fd, 'email', 254).toLowerCase();
  const locale = str(fd, 'locale', 2);
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Adresse e-mail invalide.' };

  const payload = await getPayload({ config });
  const existing = await payload.find({ collection: 'newsletter-subscribers', where: { email: { equals: email } }, limit: 1, depth: 0 });
  // Réponse identique que l'adresse soit déjà inscrite ou non : pas de fuite d'information.
  if (existing.docs[0]) {
    if (existing.docs[0].unsubscribed) await payload.update({ collection: 'newsletter-subscribers', id: existing.docs[0].id, data: { unsubscribed: false } });
    return { ok: true };
  }
  await payload.create({ collection: 'newsletter-subscribers', data: { email, locale: isLocale(locale) ? locale : 'fr' } });
  return { ok: true };
}
