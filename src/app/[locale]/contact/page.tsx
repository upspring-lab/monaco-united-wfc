import type { Metadata } from 'next';
import { Suspense } from 'react';
import { INFOS } from '@/content/club';
import ContactForm from '@/components/contact/ContactForm';
import PageHead from '@/components/ui/PageHead';
import styles from '@/components/contact/Contact.module.css';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <PageHead title="Contact" intro="Presse, partenariats, supporters ou académie : une seule adresse." />
      <section className={`container ${styles.section}`}>
        <div className={styles.left}>
          <div data-reveal="up" className={styles.map}>
            <iframe
              title="Stade Didier Deschamps, Cap-d'Ail"
              src="https://www.google.com/maps?q=Stade+Didier+Deschamps,+Cap-d%27Ail&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div data-stagger="1" className={styles.infos}>
            {INFOS.map(i => (
              <div key={i.k} className={styles.info}>
                <div className={`label ${styles.infoKey}`}>{i.k}</div>
                <div className={styles.infoVal}>{i.v.includes('@') ? <a href={`mailto:${i.v}`}>{i.v}</a> : i.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div data-reveal="up">
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
