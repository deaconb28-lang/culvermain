/**
 * Generates the two static images the page's <head> references:
 *   public/og.jpg             — 1200x630 social card, cropped from the hero
 *   public/apple-touch-icon.png — 180x180 navy tile with the yellow ampersand
 *
 * Run with `npm run assets` after replacing hero.png.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const at = (p) => fileURLToPath(new URL(p, root));

await sharp(at('src/assets/hero.png'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(at('public/og.jpg'));

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0B2A5B"/>
  <text x="32" y="46" font-family="Georgia, serif" font-size="46" font-weight="700"
        text-anchor="middle" fill="#FFC629">&amp;</text>
</svg>`;

await sharp(Buffer.from(icon)).resize(180, 180).png().toFile(at('public/apple-touch-icon.png'));

console.log('Wrote public/og.jpg and public/apple-touch-icon.png');
