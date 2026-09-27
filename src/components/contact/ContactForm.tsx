'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { SUBJECTS, type Subject } from '@/content/club';
import { ArrowRight } from '@/components/ui/icons';
import styles from './Contact.module.css';

// ?objet=partenariat|academie|presse|supporters présélectionne l'objet.
const fromQuery = (v: string | null): Subject | null => SUBJECTS.find(s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase() === v?.toLowerCase()) ?? null;

export default function ContactForm() {
  const params = useSearchParams();
  const [subject, setSubject] = useState<Subject>('Supporters');
  const [sent, setSent] = useState(false);

  const q = params.get('objet');
  useEffect(() => {
    const s = fromQuery(q);
    if (s) {
      setSubject(s);
      setSent(false);
    }
  }, [q]);

  // TODO : brancher sur l'API d'envoi (formulaire serverless ou backend club).
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.sent} role="status">
        <h2 className={`display ${styles.sentTitle}`}>Message envoyé</h2>
        <p>Merci ! Nous revenons vers vous sous 48 h.</p>
        <button type="button" className="btn btn--ink" onClick={() => setSent(false)}>
          Nouveau message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <div>
        <span className="field-label" id="subject-label">
          Objet
        </span>
        <div className={styles.chips} role="radiogroup" aria-labelledby="subject-label">
          {SUBJECTS.map(s => (
            <button key={s} type="button" role="radio" aria-checked={subject === s} onClick={() => setSubject(s)} className={styles.chip} data-on={subject === s || undefined}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <label htmlFor="c-name" className="field-label">
            Nom
          </label>
          <input id="c-name" name="name" required placeholder="Votre nom" autoComplete="name" className="input" />
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">
            E-mail
          </label>
          <input id="c-email" name="email" type="email" required placeholder="vous@exemple.com" autoComplete="email" className="input" />
        </div>
      </div>
      {subject === 'Partenariat' && (
        <div>
          <label htmlFor="c-company" className="field-label">
            Entreprise
          </label>
          <input id="c-company" name="company" placeholder="Nom de votre entreprise" autoComplete="organization" className="input" />
        </div>
      )}
      <div>
        <label htmlFor="c-message" className="field-label">
          Message
        </label>
        <textarea id="c-message" name="message" rows={6} placeholder="Votre message" className="input" />
      </div>
      <input type="hidden" name="subject" value={subject} />
      <div>
        <button type="submit" className="btn btn--primary">
          Envoyer <ArrowRight />
        </button>
      </div>
    </form>
  );
}
