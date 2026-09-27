import type { Metadata } from 'next';
import { Suspense } from 'react';
import ContactForm from '@/components/contact/ContactForm';
import PageHead from '@/components/ui/PageHead';
import type { Locale } from '@/i18n/config';
import { getPageHead, getSettings } from '@/lib/cms';
import styles from '@/components/contact/Contact.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const head = await getPageHead((await params).locale as Locale, 'contact');
  return { title: head.title, description: head.intro };
}

export default async function ContactPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [head, s] = await Promise.all([getPageHead(locale, 'contact'), getSettings(locale)]);
  const infos = [
    { k: 'Stade', v: s.stadium },
    { k: 'Ville', v: s.city },
    { k: 'E-mail', v: s.email, mail: true },
    { k: 'Presse', v: s.pressEmail, mail: true },
  ].filter(i => i.v);
  return (
    <>
      <PageHead title={head.title} intro={head.intro} />
      <section className={`container ${styles.section}`}>
        <div className={styles.left}>
          {s.mapQuery && (
            <div data-reveal="up" className={styles.map}>
              <iframe
                title={s.mapQuery}
                src={`https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          <div data-stagger="1" className={styles.infos}>
            {infos.map(i => (
              <div key={i.k} className={styles.info}>
                <div className={`label ${styles.infoKey}`}>{i.k}</div>
                <div className={styles.infoVal}>{i.mail ? <a href={`mailto:${i.v}`}>{i.v}</a> : i.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div data-reveal="up">
          <Suspense>
            <ContactForm locale={locale} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
