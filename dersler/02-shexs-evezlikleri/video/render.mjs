// Videonu yaradır: node render.mjs  →  ../erebce-ders-2-video.mp4
// Əvvəlcə şriftləri public/fonts-a köçürür, sonra Remotion ilə render edir.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const fontsDir = path.join(here, 'public', 'fonts');
mkdirSync(fontsDir, { recursive: true });
const fonts = [
  'amiri/files/amiri-arabic-400-normal.woff2',
  'amiri/files/amiri-arabic-700-normal.woff2',
  ...['400', '600', '700', '800'].flatMap((w) => [`inter/files/inter-latin-${w}-normal.woff2`, `inter/files/inter-latin-ext-${w}-normal.woff2`]),
  ...['700', '800'].flatMap((w) => [`montserrat/files/montserrat-latin-${w}-normal.woff2`, `montserrat/files/montserrat-latin-ext-${w}-normal.woff2`]),
];
for (const f of fonts) cpSync(path.join(here, 'node_modules/@fontsource', f), path.join(fontsDir, path.basename(f)));

// Bulud mühitində hazır Chromium; başqa kompüterdə Remotion öz brauzerini yükləyir.
const localShell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = process.env.REMOTION_BROWSER ?? (existsSync(localShell) ? localShell : null);

const out = process.argv[2] ?? path.join(here, '..', 'erebce-ders-2-video.mp4');
const frames = process.argv[3]; // məs. "0-300" — yalnız bir hissəni yoxlamaq üçün
const serveUrl = await bundle({ entryPoint: path.join(here, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'Ders2', browserExecutable });
console.log('müddət:', (composition.durationInFrames / composition.fps).toFixed(1), 'san');
let last = -1;
await renderMedia({
  composition, serveUrl, codec: 'h264', crf: 20, outputLocation: out, browserExecutable,
  frameRange: frames ? frames.split('-').map(Number) : null,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`${p * 10}%`); } },
});
console.log('hazır:', out);
