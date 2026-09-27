import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CmsImage from '@/components/ui/CmsImage';
import { href, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getArticle } from '@/lib/cms';
import styles from '@/components/pages/Pages.module.css';

type Props = { params: Promise<{ locale: string; slug: string }> };

// Rendu à la première visite puis mis en cache (ISR), comme le reste du site.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = await getArticle(locale as Locale, slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt, openGraph: { type: 'article', images: [a.img.src], publishedTime: a.isoDate } };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const a = await getArticle(locale as Locale, slug);
  if (!a) notFound();
  return (
    <article>
      <header className={styles.articleHead}>
        <div className={`container ${styles.articleHeadInner}`}>
          <Link href={href(locale as Locale, 'actus')} className={`label ${styles.back}`}>
            ← {getDictionary(locale as Locale).common.backToNews}
          </Link>
          <div data-reveal="up" className={styles.articleMeta}>
            <span className={`label ${styles.badge}`}>{a.cat}</span>
            <time dateTime={a.isoDate}>{a.date}</time>
          </div>
          <h1 data-reveal="up" className={`display ${styles.articleTitle}`}>
            {a.title}
          </h1>
          <p data-reveal="up" data-delay="90" className={styles.articleExcerpt}>
            {a.excerpt}
          </p>
        </div>
      </header>
      <div className={`container ${styles.articleBody}`}>
        <div data-reveal="clip" className={styles.articleCover}>
          <CmsImage img={a.img} sizes="(max-width: 1120px) 100vw, 1072px" priority />
        </div>
        {a.content && (
          <div className={styles.prose}>
            <RichText data={a.content} />
          </div>
        )}
      </div>
    </article>
  );
}
