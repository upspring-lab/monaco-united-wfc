import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Motion from '@/components/motion/Motion';
import { isLocale, LOCALES } from '@/i18n/config';
import { getSettings } from '@/lib/cms';
import '@/styles/globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

// Pages rendues à la première visite puis mises en cache (ISR).
// Chaque publication dans l'admin purge le cache (hooks Payload) ; sinon, rafraîchissement toutes les 10 min.
export const revalidate = 600;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = await getSettings(locale);
  const title = s.metaTitle || 'Monaco United, football féminin';
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: title, template: '%s · Monaco United' },
    description: s.metaDescription || 'Monaco United, club de football féminin de la Principauté de Monaco.',
    icons: { icon: '/assets/logo-red.png' },
    alternates: { languages: Object.fromEntries(LOCALES.map(l => [l, `/${l}`])) },
    openGraph: { siteName: 'Monaco United', locale, type: 'website' },
  };
}

export const viewport: Viewport = { themeColor: '#e41f37' };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const settings = await getSettings(locale);
  return (
    <html lang={locale} className={archivo.variable} suppressHydrationWarning>
      <body>
        {/* Active l'état initial des reveals seulement quand le JS tourne. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('mu-js')" }} />
        <Header locale={locale} />
        <main>
          {children}
          <Motion />
        </main>
        <Footer locale={locale} socials={settings.socials} />
      </body>
    </html>
  );
}
