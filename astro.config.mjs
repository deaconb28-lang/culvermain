// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/*
 * Where this build is actually served from. Canonical, og:url, og:image and
 * the sitemap are all derived from it, so it has to match the deployment or
 * link previews point at a host that does not have the assets.
 *
 * Defaults to the pitch deployment. When the site moves to the client's own
 * domain, set both of these in the host's environment:
 *
 *   SITE_URL=https://www.culverandmain.com
 *   INDEXABLE=true
 *
 * INDEXABLE is off by default on purpose: until this is the real site, a
 * public copy of the client's photography and menu should not be in anyone's
 * search index.
 */
const site = process.env.SITE_URL ?? 'https://culverandmain.vercel.app';
const indexable = process.env.INDEXABLE === 'true';

// Static marketing site for CULVER&MAIN. One page, no server runtime.
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  image: {
    // Sharp generates the responsive AVIF/WebP variants for the hero and food photography.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  // No sitemap while the site is not meant to be indexed.
  integrations: indexable ? [sitemap()] : [],
  devToolbar: { enabled: false },
});
