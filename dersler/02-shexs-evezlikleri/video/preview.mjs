// Seçilmiş kadrların şəkli: node preview.mjs <qovluq> 100 500 900 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { existsSync } from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const localShell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = process.env.REMOTION_BROWSER ?? (existsSync(localShell) ? localShell : null);
const [outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.join(here, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'Ders2', browserExecutable });
for (const f of frames) await renderStill({ composition, serveUrl, frame: Number(f), output: path.join(outDir, `f${f}.png`), browserExecutable, scale: 0.5 });
console.log('ok');
