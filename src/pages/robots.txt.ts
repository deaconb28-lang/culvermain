import type { APIRoute } from 'astro';

// Served from a route rather than public/ so it can follow INDEXABLE and the
// real deployment origin. See the note in astro.config.mjs.
const indexable = process.env.INDEXABLE === 'true';

export const GET: APIRoute = ({ site }) => {
  const body = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
