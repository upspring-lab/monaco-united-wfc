import { DEFAULT_LOCALE } from '@/i18n/config';

// Export statique : la redirection / -> /fr/ est aussi faite par nginx.
export default function RootRedirect() {
  const target = `/${DEFAULT_LOCALE}/`;
  return (
    <html lang={DEFAULT_LOCALE}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
      </head>
      <body>
        <a href={target}>Monaco United</a>
      </body>
    </html>
  );
}
