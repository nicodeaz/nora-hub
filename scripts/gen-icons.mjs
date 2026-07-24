// One-off brand asset generator. Re-run after changing ext-assets/nora_hub_transparent.png.
// Requires sharp, which isn't a project dependency: run `npm install --no-save sharp` first.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = (p) => path.join(root, 'public', p);
const ext = (p) => path.join(root, 'ext-assets', p);

const BLACK = '#000000';
// ext-assets/nora_hub_transparent.png: the official NF monogram + "NORA HUB" wordmark, white ink on transparent.
const LOGO_RATIO = 1616 / 1584;

async function makeAppIcon(size, outFile) {
  // Keep the mark within the ~80% maskable safe zone.
  const logoWidth = Math.round(size * 0.66);
  const logoHeight = Math.round(logoWidth * LOGO_RATIO);
  const logoBuf = await sharp(ext('nora_hub_transparent.png')).resize(logoWidth, logoHeight).toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BLACK },
  })
    .composite([
      { input: logoBuf, left: Math.round((size - logoWidth) / 2), top: Math.round((size - logoHeight) / 2) },
    ])
    .png()
    .toFile(pub(outFile));

  console.log('wrote', outFile);
}

async function makeOgImage(outFile) {
  const width = 1200;
  const height = 630;

  const logoHeight = 520;
  const logoWidth = Math.round(logoHeight / LOGO_RATIO);
  const logoBuf = await sharp(ext('nora_hub_transparent.png')).resize(logoWidth, logoHeight).toBuffer();

  await sharp({
    create: { width, height, channels: 4, background: BLACK },
  })
    .composite([
      { input: logoBuf, left: Math.round((width - logoWidth) / 2), top: Math.round((height - logoHeight) / 2) },
    ])
    .png()
    .toFile(pub(outFile));

  console.log('wrote', outFile);
}

async function makeFavicon(outFile) {
  // Downscale before embedding as base64 - the source is 1584x1616, which would
  // otherwise bloat the SVG to 500+ KB for an asset loaded on every page view.
  const smallBuf = await sharp(ext('nora_hub_transparent.png')).resize(240).png().toBuffer();
  const b64 = smallBuf.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="22" fill="#000000" />
  <image href="data:image/png;base64,${b64}" x="17" y="9" width="66" height="67.3" />
</svg>
`;
  fs.writeFileSync(pub(outFile), svg);
  console.log('wrote', outFile, `(${(svg.length / 1024).toFixed(0)} KB)`);
}

await makeAppIcon(192, 'pwa-192.png');
await makeAppIcon(512, 'pwa-512.png');
await makeOgImage('og-image.png');
await makeFavicon('favicon.svg');
