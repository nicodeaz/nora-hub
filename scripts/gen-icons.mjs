// One-off brand asset generator. The app icon/favicon/OG image are pure text
// ("NORA" + "HUB"), matching the in-app NoraHubWordmark component's white
// variant - no external logo image involved. Re-run after changing the
// wordmark's colors/style in src/components/NoraHubWordmark.tsx.
// Requires sharp, which isn't a project dependency: run `npm install --no-save sharp` first.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = (p) => path.join(root, 'public', p);

const BLACK = '#000000';
const NORA_COLOR = '#FFFFFF';
const HUB_COLOR = '#F5D3C6'; // matches NoraHubWordmark's white-variant accent

// Renders "NORA" over "HUB", centered as a block, at the given font sizes.
function wordmarkSvg(width, height, noraSize, hubSize, gap) {
  const blockHeight = noraSize + gap + hubSize;
  const top = (height - blockHeight) / 2;
  const noraY = top + noraSize / 2;
  const hubY = top + noraSize + gap + hubSize / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${BLACK}" />
  <text x="50%" y="${noraY}" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${noraSize}" letter-spacing="${noraSize * 0.06}" fill="${NORA_COLOR}">NORA</text>
  <text x="50%" y="${hubY}" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${hubSize}" letter-spacing="${hubSize * 0.06}" fill="${HUB_COLOR}">HUB</text>
</svg>`;
}

async function makeAppIcon(size, outFile) {
  // Keep the wordmark within the ~80% maskable safe zone.
  const wordSize = size * 0.195;
  const gap = size * 0.047;
  const svg = wordmarkSvg(size, size, wordSize, wordSize, gap);
  await sharp(Buffer.from(svg)).png().toFile(pub(outFile));
  console.log('wrote', outFile);
}

async function makeOgImage(outFile) {
  const width = 1200;
  const height = 630;
  const svg = wordmarkSvg(width, height, 110, 110, 26);
  await sharp(Buffer.from(svg)).png().toFile(pub(outFile));
  console.log('wrote', outFile);
}

async function makeFavicon(outFile) {
  const svg = wordmarkSvg(100, 100, 19.5, 19.5, 4.7).replace(
    '<rect width="100" height="100" fill="#000000" />',
    '<rect width="100" height="100" rx="22" fill="#000000" />'
  );
  fs.writeFileSync(pub(outFile), svg);
  console.log('wrote', outFile, `(${(svg.length / 1024).toFixed(1)} KB)`);
}

await makeAppIcon(192, 'pwa-192.png');
await makeAppIcon(512, 'pwa-512.png');
await makeOgImage('og-image.png');
await makeFavicon('favicon.svg');
