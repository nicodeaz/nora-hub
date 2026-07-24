// One-off brand asset generator. Re-run after changing ext-assets/fav.png or public/logo-nora-white.png.
// Requires sharp, which isn't a project dependency: run `npm install --no-save sharp` first.
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = (p) => path.join(root, 'public', p);
const ext = (p) => path.join(root, 'ext-assets', p);

const BLACK = '#000000';
const FAV_RATIO = 274 / 216; // ext-assets/fav.png is 216x274 (NF monogram + HUB wordmark, white on transparent)

async function makeAppIcon(size, outFile) {
  // Keep the mark within the ~80% maskable safe zone.
  const favHeight = Math.round(size * 0.62);
  const favWidth = Math.round(favHeight / FAV_RATIO);
  const favBuf = await sharp(ext('fav.png')).resize(favWidth, favHeight).toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BLACK },
  })
    .composite([
      { input: favBuf, left: Math.round((size - favWidth) / 2), top: Math.round((size - favHeight) / 2) },
    ])
    .png()
    .toFile(pub(outFile));

  console.log('wrote', outFile);
}

async function makeOgImage(outFile) {
  const width = 1200;
  const height = 630;

  const favHeight = 250;
  const favWidth = Math.round(favHeight / FAV_RATIO);
  const favBuf = await sharp(ext('fav.png')).resize(favWidth, favHeight).toBuffer();

  const sigWidth = 380;
  const sigBuf = await sharp(pub('logo-nora-white.png')).resize(sigWidth).toBuffer();
  const sigMeta = await sharp(sigBuf).metadata();

  const gap = 28;
  const blockHeight = favHeight + gap + sigMeta.height;
  const top = Math.round((height - blockHeight) / 2);

  await sharp({
    create: { width, height, channels: 4, background: BLACK },
  })
    .composite([
      { input: favBuf, left: Math.round((width - favWidth) / 2), top },
      { input: sigBuf, left: Math.round((width - sigWidth) / 2), top: top + favHeight + gap },
    ])
    .png()
    .toFile(pub(outFile));

  console.log('wrote', outFile);
}

await makeAppIcon(192, 'pwa-192.png');
await makeAppIcon(512, 'pwa-512.png');
await makeOgImage('og-image.png');
