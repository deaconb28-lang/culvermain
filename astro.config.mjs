// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static marketing site for CULVER&MAIN. One page, no server runtime.
export default defineConfig({
  site: 'https://www.culverandmain.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  image: {
    // Sharp generates the responsive AVIF/WebP variants for the hero and food photography.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
