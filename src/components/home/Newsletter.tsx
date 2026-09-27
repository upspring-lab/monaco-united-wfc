'use client';

import { useState, type FormEvent } from 'react';
import styles from './Home.module.css';

export default function Newsletter() {
  const [done, setDone] = useState(false);
  // TODO : brancher sur le service d'e-mailing (Brevo, Mailchimp…).
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };
  return (
    <section className={`container ${styles.nlSection}`}>
      <div data-reveal="up" className={styles.nl}>
        <div>
          <h2 className={`display ${styles.nlTitle}`}>Newsletter</h2>
          <p className={styles.nlText}>Matchs, résultats et coulisses, une fois par semaine.</p>
        </div>
        {done ? (
          <div className={`display ${styles.nlDone}`} role="status">
            Inscription confirmée. Merci !
          </div>
        ) : (
          <form onSubmit={submit} className={styles.nlForm}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label htmlFor="nl-email" className="field-label" style={{ color: '#fff' }}>
                E-mail
              </label>
              <input id="nl-email" type="email" required placeholder="vous@exemple.com" autoComplete="email" className={`input ${styles.nlInput}`} />
            </div>
            <button type="submit" className="btn btn--dark">
              Je m&apos;inscris
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
