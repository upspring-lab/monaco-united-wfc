import Hero from '@/components/home/Hero';
import { Gallery, HomeNews, PartnersStrip, PlayersStrip, StandingsAcademy, TypeBand, Videos } from '@/components/home/HomeSections';
import Newsletter from '@/components/home/Newsletter';
import NextMatch from '@/components/home/NextMatch';
import type { Locale } from '@/i18n/config';
import { getHome, getMatches, getNews, getPartners, getPlayers, getStandings, getVideos } from '@/lib/cms';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const [home, matches, news, players, standings, videos, partners] = await Promise.all([
    getHome(locale),
    getMatches(locale),
    getNews(locale, 5),
    getPlayers(locale),
    getStandings(locale),
    getVideos(locale),
    getPartners(locale),
  ]);
  return (
    <>
      <Hero photos={home.heroPhotos} tagline={home.tagline} />
      <NextMatch locale={locale} matches={matches} renderedAt={Date.now()} />
      <HomeNews locale={locale} news={news} />
      <TypeBand line1={home.band.line1} line2={home.band.line2} />
      <PlayersStrip locale={locale} players={players} />
      <StandingsAcademy locale={locale} rows={standings.rows} academy={home.academy} />
      <Videos locale={locale} videos={videos} note={home.videosNote} />
      <Gallery locale={locale} items={home.gallery} />
      <Newsletter locale={locale} text={home.newsletterText} />
      <PartnersStrip locale={locale} partners={partners} />
    </>
  );
}
