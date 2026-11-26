import React, { useEffect, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Rənglər dərslikdəki kimidir: kişi — mavi, qadın — çəhrayı; cild — tünd göy + qızılı.
export const C = {
  bg: '#FBF7EF', paper: '#FFFFFF', ink: '#1C2333', muted: '#5E6778', line: '#E2E6EE',
  navy: '#15213B', gold: '#C39A4B', goldSoft: '#F7EEDC',
  m: '#2459C4', mSoft: '#E5EDFC', f: '#C23A6D', fSoft: '#FCE6EE', n: '#3A4254', nSoft: '#EEF0F4',
};
export const AR = "'Amiri', serif";
export const UI = "'Inter', sans-serif";
export const HEAD = "'Montserrat', 'Inter', sans-serif";
export type G = 'm' | 'f' | 'n' | 't';
export const gColor = (g: G) => (g === 'm' ? C.m : g === 'f' ? C.f : C.n);
export const gSoft = (g: G) => (g === 'm' ? C.mSoft : g === 'f' ? C.fSoft : C.nSoft);

/* ── Şriftlər ── */
const LATIN = 'U+0000-00FF';
const FONTS: [string, string, string, string?][] = [
  ['Amiri', '400', 'amiri-arabic-400-normal.woff2'],
  ['Amiri', '700', 'amiri-arabic-700-normal.woff2'],
  ...(['400', '600', '700', '800'] as const).flatMap((w) => [
    ['Inter', w, `inter-latin-ext-${w}-normal.woff2`] as [string, string, string],
    ['Inter', w, `inter-latin-${w}-normal.woff2`, LATIN] as [string, string, string, string],
  ]),
  ...(['700', '800'] as const).flatMap((w) => [
    ['Montserrat', w, `montserrat-latin-ext-${w}-normal.woff2`] as [string, string, string],
    ['Montserrat', w, `montserrat-latin-${w}-normal.woff2`, LATIN] as [string, string, string, string],
  ]),
];
export const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(FONTS.map(([fam, w, file, range]) => new FontFace(fam, `url(${staticFile('fonts/' + file)})`, { weight: w, ...(range ? { unicodeRange: range } : {}) }).load().then((ff) => document.fonts.add(ff))))
      .then(() => continueRender(h));
  }, [h]);
};

/* ── Animasiya köməkçiləri ── */
export const usePop = (delay = 0, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 120 } });
};
export const Pop: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties; from?: 'up' | 'scale' }> = ({ delay = 0, children, style, from = 'scale' }) => {
  const s = usePop(delay);
  const t = from === 'up' ? `translateY(${(1 - s) * 60}px)` : `scale(${0.4 + 0.6 * s})`;
  return <div style={{ opacity: Math.min(1, s * 1.6), transform: t, ...style }}>{children}</div>;
};

export const Scene: React.FC<{ dur: number; bg?: string; children: React.ReactNode }> = ({ dur, bg = C.bg, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: bg, fontFamily: UI, color: C.ink, opacity: o }}>{children}</AbsoluteFill>;
};

/* Səhnənin başlığı: solda kiçik qızılı yazı, altında böyük başlıq */
export const Header: React.FC<{ kicker: string; title: React.ReactNode; sub?: React.ReactNode; color?: string }> = ({ kicker, title, sub, color = C.ink }) => (
  <Pop from="up" style={{ position: 'absolute', left: 110, top: 70, right: 110 }}>
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: C.gold }}>{kicker}</div>
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 68, lineHeight: 1.15, color, marginTop: 6 }}>{title}</div>
    {sub && <div style={{ fontSize: 34, color: C.muted, marginTop: 10 }}>{sub}</div>}
  </Pop>
);

export const Ar: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties }> = ({ children, size = 100, color, weight = 400, style }) => (
  <span dir="rtl" style={{ fontFamily: AR, fontSize: size, lineHeight: 1.6, color, fontWeight: weight, unicodeBidi: 'isolate', display: 'inline-block', ...style }}>{children}</span>
);

/* ── Personaj: m — oğlan, f — qız, n — neytral, t — müəllim ── */
export const Person: React.FC<{ g: G; h?: number; delay?: number; phase?: number; tag?: string; tagDelay?: number }> = ({ g, h = 260, delay = 0, phase = 0, tag, tagDelay = 0 }) => {
  const frame = useCurrentFrame();
  const s = usePop(delay, 11);
  const ts = usePop(tagDelay, 12);
  const bob = Math.sin((frame + phase * 17) / 11) * 4;
  const blink = (frame + phase * 23) % 110 < 4 ? 0.15 : 1;
  const body = g === 'm' ? C.m : g === 'f' ? C.f : g === 't' ? C.navy : C.gold;
  const hair = '#3B2A20';
  const skin = '#F3CDA6';
  return (
    <div style={{ position: 'relative', width: h * 0.62, height: h, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 80 + bob}px) scale(${0.6 + 0.4 * s})`, transformOrigin: 'bottom center' }}>
      <svg viewBox="0 0 100 160" width={h * 0.62} height={h} style={{ overflow: 'visible' }}>
        {g === 'f' && <path d="M24 44 Q22 92 34 96 L66 96 Q78 92 76 44 Z" fill={hair} />}
        {/* gövdə */}
        {g === 'f'
          ? <path d="M50 70 L80 150 Q50 158 20 150 Z" fill={body} />
          : <rect x="24" y="70" width="52" height="82" rx="20" fill={body} />}
        {g === 't' && <path d="M50 72 L44 96 L50 104 L56 96 Z" fill={C.gold} />}
        <rect x="44" y="60" width="12" height="14" fill={skin} />
        <circle cx="50" cy="42" r="25" fill={skin} />
        {/* saç */}
        {g === 'f'
          ? <path d="M25 42 Q26 14 50 14 Q74 14 75 42 Q64 26 50 28 Q36 26 25 42 Z" fill={hair} />
          : <path d="M25 40 Q24 14 50 15 Q76 14 75 40 Q70 26 58 27 Q46 22 34 28 Q28 31 25 40 Z" fill={hair} />}
        {g === 'f' && <g fill={C.gold}><circle cx="72" cy="22" r="5" /><path d="M72 22 L82 15 L82 29 Z" /><path d="M72 22 L62 15 L62 29 Z" /></g>}
        {g === 'n' && <path d="M25 40 Q24 14 50 15 Q76 14 75 40 Q70 26 58 27 Q46 22 34 28 Q28 31 25 40 Z" fill={hair} />}
        {/* üz */}
        <ellipse cx="41" cy="44" rx="3" ry={3.4 * blink} fill={C.ink} />
        <ellipse cx="59" cy="44" rx="3" ry={3.4 * blink} fill={C.ink} />
        {g === 't' && <g fill="none" stroke={C.ink} strokeWidth="1.6"><circle cx="41" cy="44" r="7" /><circle cx="59" cy="44" r="7" /><path d="M48 44 L52 44" /></g>}
        <circle cx="35" cy="53" r="3.5" fill="#F2A7A0" opacity=".6" />
        <circle cx="65" cy="53" r="3.5" fill="#F2A7A0" opacity=".6" />
        <path d="M43 54 Q50 60 57 54" stroke={C.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
      {tag && (
        <div style={{ position: 'absolute', left: '50%', top: -58, transform: `translateX(-50%) scale(${ts})`, background: C.paper, border: `3px solid ${C.gold}`, borderRadius: 18, padding: '4px 18px', fontFamily: HEAD, fontWeight: 800, fontSize: 30, whiteSpace: 'nowrap', color: C.ink }}>{tag}</div>
      )}
    </div>
  );
};

/* Bir neçə personaj yan-yana */
export const Crowd: React.FC<{ gs: G[]; h?: number; delay?: number; gap?: number; stagger?: number }> = ({ gs, h = 220, delay = 0, gap = -18, stagger = 8 }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap }}>
    {gs.map((g, i) => <Person key={i} g={g} h={h} delay={delay + i * stagger} phase={i + 1} />)}
  </div>
);

/* Say nişanı: ● tək, ●● ikilik, ●●● cəm */
export const Dots: React.FC<{ n: number; color?: string; size?: number }> = ({ n, color = C.ink, size = 16 }) => (
  <span style={{ display: 'inline-flex', gap: size * 0.45, verticalAlign: 'middle', marginRight: size * 0.6 }}>
    {Array.from({ length: n }).map((_, i) => <i key={i} style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'block' }} />)}
  </span>
);
export const NumChip: React.FC<{ n: 1 | 2 | 3; big?: boolean }> = ({ n, big }) => {
  const label = n === 1 ? 'Tək' : n === 2 ? 'İkilik' : 'Cəm';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', background: C.goldSoft, color: '#7A5A1E', borderRadius: 99, padding: big ? '10px 26px' : '6px 18px', fontFamily: HEAD, fontWeight: 800, fontSize: big ? 34 : 26 }}>
      <Dots n={n} color="#7A5A1E" size={big ? 16 : 12} />{label}
    </span>
  );
};

/* Əvəzlik kartı: ərəbcə + oxunuşu + mənası */
export const PCard: React.FC<{ g: G; ar: string; rd: string; mn: string; size?: number; width?: number; delay?: number }> = ({ g, ar, rd, mn, size = 120, width = 420, delay = 0 }) => (
  <Pop delay={delay}>
    <div style={{ width, background: gSoft(g), border: `4px solid ${gColor(g)}`, borderRadius: 34, padding: '14px 26px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 0 rgba(21,33,59,.08)' }}>
      <Ar size={size} color={C.ink}>{ar}</Ar>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 46, color: gColor(g), marginTop: -8 }}>{rd}</div>
      <div style={{ fontSize: 32, color: C.ink, marginTop: 4, textAlign: 'center' }}>{mn}</div>
    </div>
  </Pop>
);

export const Bubble: React.FC<{ children: React.ReactNode; side: 'left' | 'right'; delay?: number; color?: string }> = ({ children, side, delay = 0, color = C.gold }) => {
  const s = usePop(delay, 12);
  return (
    <div style={{ position: 'relative', opacity: Math.min(1, s * 1.6), transform: `scale(${0.3 + 0.7 * s})`, transformOrigin: side === 'left' ? 'bottom left' : 'bottom right' }}>
      <div style={{ background: C.paper, border: `5px solid ${color}`, borderRadius: 40, padding: '20px 44px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 12px 0 rgba(21,33,59,.08)' }}>{children}</div>
      <svg width="60" height="50" style={{ position: 'absolute', bottom: -44, [side]: 70 }} viewBox="0 0 60 50">
        <path d={side === 'left' ? 'M0 0 L50 0 L8 46 Z' : 'M10 0 L60 0 L52 46 Z'} fill={C.paper} stroke={color} strokeWidth="5" strokeLinejoin="round" />
        <rect x="4" y="-6" width="52" height="9" fill={C.paper} />
      </svg>
    </div>
  );
};

/* Fonda yüngül naxış (dərslikdəki səkkizguşəli ulduz) */
export const Star: React.FC<{ x: number; y: number; size: number; color?: string; opacity?: number }> = ({ x, y, size, color = C.gold, opacity = 0.12 }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', left: x, top: y, opacity, transform: `rotate(${frame / 8}deg)` }}>
      <g fill="none" stroke={color} strokeWidth="1.4"><rect x="20" y="20" width="60" height="60" /><rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" /><circle cx="50" cy="50" r="18" /><circle cx="50" cy="50" r="42" /></g>
    </svg>
  );
};
