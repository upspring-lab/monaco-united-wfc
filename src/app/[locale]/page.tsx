import Hero from '@/components/home/Hero';
import { Gallery, HomeNews, PartnersStrip, PlayersStrip, StandingsAcademy, TypeBand, Videos } from '@/components/home/HomeSections';
import Newsletter from '@/components/home/Newsletter';
import NextMatch from '@/components/home/NextMatch';
import type { Locale } from '@/i18n/config';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <Hero />
      <NextMatch locale={locale} buildNow={Date.now()} />
      <HomeNews locale={locale} />
      <TypeBand />
      <PlayersStrip locale={locale} />
      <StandingsAcademy locale={locale} />
      <Videos />
      <Gallery />
      <Newsletter />
      <PartnersStrip />
    </>
  );
}
