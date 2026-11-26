// Müəllimin səs yazısını videoya hazırlayır:
//   node ses-hazirla.mjs [ses növü]        ses növü: derin (default) | ince
// Giriş: ses-xam/ qovluğu (gitə düşmür):
//   • ya 21 ayrı fayl: 01.m4a, 02.m4a … 21.m4a (istənilən səs formatı),
//   • ya bir fayl — hissələr arasında ~2 saniyəlik pauza ilə; skript onu pauzalardan 21 hissəyə bölür.
//     Kəsilmə yerləri əl ilə də verilə bilər: ses-xam/kesikler.txt — 20 rəqəm (saniyə), hər sətirdə biri.
// Çıxış: public/ses/01.mp3 … 21.mp3 (səs dəyişdirilmiş) və src/ses.json (hər hissənin müddəti).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const PARTS = 21;
const here = path.dirname(new URL(import.meta.url).pathname);
const rawDir = path.join(here, 'ses-xam');
const outDir = path.join(here, 'public', 'ses');

// Səsin tembrini dəyişən ayarlar: pitch — ucalıq, formant da birlikdə sürüşür ki, səs tanınmasın.
const PRESETS = {
  derin: 'rubberband=pitch=0.84:formant=shifted:pitchq=quality',
  ince: 'rubberband=pitch=1.2:formant=shifted:pitchq=quality',
};
const kind = process.argv[2] ?? 'derin';
if (!PRESETS[kind]) throw new Error(`Naməlum səs növü: ${kind}. Seçin: ${Object.keys(PRESETS).join(', ')}`);

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-v', 'error', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
const dur = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

const files = readdirSync(rawDir).filter((f) => !f.startsWith('.') && f !== 'kesikler.txt').sort();
const cutFile = path.join(rawDir, 'kesikler.txt');
mkdirSync(outDir, { recursive: true });

let parts; // [{ nn, file, start?, end? }]
const numbered = files.filter((f) => /^\d{1,2}\./.test(f));
if (numbered.length > 0) {
  parts = numbered.map((f) => ({ nn: String(parseInt(f, 10)).padStart(2, '0'), file: path.join(rawDir, f) }));
  const missing = Array.from({ length: PARTS }, (_, i) => String(i + 1).padStart(2, '0')).filter((nn) => !parts.some((p) => p.nn === nn));
  if (missing.length) console.log('Diqqət, bu hissələr yoxdur (səhnə səssiz qalacaq):', missing.join(', '));
} else if (files.length === 1) {
  // Bir fayl: ən uzun 20 pauzanı tapıb 21 hissəyə bölürük.
  const src = path.join(rawDir, files[0]);
  const total = dur(src);
  let cuts; // [{ start, end }] — hissələr arasındakı pauzalar
  if (existsSync(cutFile)) {
    cuts = readFileSync(cutFile, 'utf8').split(/\s+/).filter(Boolean).map(Number).map((t) => ({ start: t, end: t }));
    if (cuts.length !== PARTS - 1) throw new Error(`kesikler.txt-də ${PARTS - 1} rəqəm olmalıdır (${cuts.length} var).`);
  } else {
    const err = spawnSync('ffmpeg', ['-hide_banner', '-i', src, '-af', 'silencedetect=noise=-38dB:d=0.7', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
    const starts = [...err.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
    const ends = [...err.matchAll(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)].map((m) => ({ end: Number(m[1]), d: Number(m[2]) }));
    // yalnız danışıq arasındakı pauzalar: əvvəldəki və sondakı sükut sayılmır
    const gaps = ends.map((e, i) => ({ start: starts[i], end: e.end, d: e.d })).filter((g) => g.start > 0.5 && g.end < total - 0.3);
    if (gaps.length < PARTS - 1) throw new Error(`Faylda ${PARTS - 1} pauza tapılmadı (${gaps.length} tapıldı). Hissələr arasında daha uzun pauza edin, hissələri ayrı fayllarda göndərin və ya ses-xam/kesikler.txt yazın.`);
    cuts = gaps.sort((a, b) => b.d - a.d).slice(0, PARTS - 1).sort((a, b) => a.start - b.start);
  }
  parts = Array.from({ length: PARTS }, (_, i) => ({
    nn: String(i + 1).padStart(2, '0'), file: src,
    start: i === 0 ? 0 : (cuts[i - 1].start + cuts[i - 1].end) / 2,
    end: i === PARTS - 1 ? total : (cuts[i].start + cuts[i].end) / 2,
  }));
} else {
  throw new Error('ses-xam/ qovluğunda ya 01…21 adlı fayllar, ya da tək bir fayl olmalıdır.');
}

const durations = {};
for (const p of parts) {
  const cut = p.start != null ? ['-ss', String(p.start), '-to', String(p.end)] : [];
  const out = path.join(outDir, `${p.nn}.mp3`);
  // təmizləmə → səsi dəyişmək → baş/son sükutu kəsmək → səs səviyyəsini bərabərləşdirmək
  const af = [
    'highpass=f=70', 'afftdn=nf=-25',
    PRESETS[kind],
    'silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.1',
    'areverse', 'silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.25', 'areverse',
    'loudnorm=I=-16:TP=-1.5:LRA=11', 'aresample=48000',
  ].join(',');
  ff([...cut, '-i', p.file, '-af', af, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '128k', out]);
  durations[p.nn] = Number(dur(out).toFixed(2));
  console.log(p.nn, durations[p.nn], 'san');
}
writeFileSync(path.join(here, 'src', 'ses.json'), JSON.stringify(durations, null, 2) + '\n');
console.log('hazır: public/ses/ və src/ses.json — indi: npm run render');
