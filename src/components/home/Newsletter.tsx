'use client';

import { useActionState } from 'react';
import { subscribeNewsletter, type FormState } from '@/app/(frontend)/actions';
import type { Locale } from '@/i18n/config';
import styles from './Home.module.css';

const INITIAL: FormState = { ok: false };

export default function Newsletter({ locale, text }: { locale: Locale; text: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, INITIAL);
  return (
    <section className={`container ${styles.nlSection}`}>
      <div data-reveal="up" className={styles.nl}>
        <div>
          <h2 className={`display ${styles.nlTitle}`}>Newsletter</h2>
          {text && <p className={styles.nlText}>{text}</p>}
        </div>
        {state.ok ? (
          <div className={`display ${styles.nlDone}`} role="status">
            Inscription confirmée. Merci !
          </div>
        ) : (
          <form action={action} className={styles.nlForm}>
            <input type="hidden" name="locale" value={locale} />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className={styles.trap} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <label htmlFor="nl-email" className="field-label" style={{ color: '#fff' }}>
                E-mail
              </label>
              <input id="nl-email" name="email" type="email" required maxLength={254} placeholder="vous@exemple.com" autoComplete="email" className={`input ${styles.nlInput}`} />
            </div>
            <button type="submit" className="btn btn--dark" disabled={pending} aria-busy={pending}>
              {pending ? 'Envoi…' : "Je m'inscris"}
            </button>
            {state.error && (
              <p role="alert" className={styles.nlError}>
                {state.error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
