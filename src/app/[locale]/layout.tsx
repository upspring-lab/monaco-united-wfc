import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Motion from '@/components/motion/Motion';
import { LOCALES, isLocale } from '@/i18n/config';
import '@/styles/globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  title: { default: 'Monaco United, football féminin', template: '%s · Monaco United' },
  description: 'Monaco United, club de football féminin de la Principauté de Monaco. R1 féminine, Ligue Méditerranée.',
  icons: { icon: '/assets/logo-red.png' },
};

export const viewport: Viewport = { themeColor: '#e41f37' };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
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
        <Footer locale={locale} />
      </body>
    </html>
  );
}
