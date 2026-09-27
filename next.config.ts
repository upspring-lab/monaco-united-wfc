import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// CSP du site public. L'admin Payload (/admin) a ses propres besoins et n'est pas concerné.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (isProd ? '' : " 'unsafe-eval'"),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.google.com',
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
];

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/', destination: '/fr', permanent: false }];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/:locale(fr|en|it)/:path*', headers: [{ key: 'Content-Security-Policy', value: csp }] },
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }] },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
