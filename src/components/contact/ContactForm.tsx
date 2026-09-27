'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { submitContact, type FormState } from '@/app/(frontend)/actions';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { ArrowRight } from '@/components/ui/icons';
import styles from './Contact.module.css';

const SUBJECTS = ['Supporters', 'Partenariat', 'Presse', 'Académie'] as const;
type Subject = (typeof SUBJECTS)[number];

// ?objet=partenariat|academie|presse|supporters présélectionne l'objet.
const fromQuery = (v: string | null): Subject | null => SUBJECTS.find(s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase() === v?.toLowerCase()) ?? null;

const INITIAL: FormState = { ok: false };

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contact;
  const common = getDictionary(locale).common;
  const errors = getDictionary(locale).errors;
  const params = useSearchParams();
  const [subject, setSubject] = useState<Subject>(() => fromQuery(params.get('objet')) ?? 'Supporters');
  const [formKey, setFormKey] = useState(0);
  const [state, action, pending] = useActionState(submitContact, INITIAL);
  const [dismissed, setDismissed] = useState(false);

  const q = params.get('objet');
  useEffect(() => {
    const s = fromQuery(q);
    if (s) setSubject(s);
  }, [q]);

  useEffect(() => setDismissed(false), [state]);

  if (state.ok && !dismissed) {
    return (
      <div className={styles.sent} role="status">
        <h2 className={`display ${styles.sentTitle}`}>{t.sentTitle}</h2>
        <p>{t.sentText}</p>
        <button
          type="button"
          className="btn btn--ink"
          onClick={() => {
            setDismissed(true);
            setFormKey(k => k + 1);
          }}
        >
          {t.newMessage}
        </button>
      </div>
    );
  }

  return (
    <form key={formKey} action={action} className={styles.form}>
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="locale" value={locale} />
      {/* Champ piège anti-robots, invisible et ignoré par les lecteurs d'écran. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className={styles.trap} />
      <div>
        <span className="field-label" id="subject-label">
          {t.subject}
        </span>
        <div className={styles.chips} role="radiogroup" aria-labelledby="subject-label">
          {SUBJECTS.map(s => (
            <button key={s} type="button" role="radio" aria-checked={subject === s} onClick={() => setSubject(s)} className={styles.chip} data-on={subject === s || undefined}>
              {t.subjects[s]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <label htmlFor="c-name" className="field-label">
            {t.name}
          </label>
          <input id="c-name" name="name" required minLength={2} maxLength={120} placeholder={t.namePh} autoComplete="name" className="input" />
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">
            {t.email}
          </label>
          <input id="c-email" name="email" type="email" required maxLength={254} placeholder={common.emailPh} autoComplete="email" className="input" />
        </div>
      </div>
      {subject === 'Partenariat' && (
        <div>
          <label htmlFor="c-company" className="field-label">
            {t.company}
          </label>
          <input id="c-company" name="company" maxLength={160} placeholder={t.companyPh} autoComplete="organization" className="input" />
        </div>
      )}
      <div>
        <label htmlFor="c-message" className="field-label">
          {t.message}
        </label>
        <textarea id="c-message" name="message" rows={6} required minLength={10} maxLength={5000} placeholder={t.messagePh} className="input" />
      </div>
      {state.error && (
        <p className={styles.error} role="alert">
          {errors[state.error]}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn--primary" disabled={pending} aria-busy={pending}>
          {pending ? common.sending : t.send} <ArrowRight />
        </button>
      </div>
    </form>
  );
}
