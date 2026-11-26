import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { Ar, Bubble, C, Crowd, Dots, G, gColor, gSoft, HEAD, Header, NumChip, PCard, Person, Pop, Scene, Star, usePop } from './kit';

const center: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' };
const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 56, color = C.ink, style }) => (
  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, textAlign: 'center', lineHeight: 1.2, ...style }}>{children}</div>
);

/* 1. Üz qabığı */
export const Intro: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} bg={C.navy}>
    <Star x={1150} y={180} size={900} opacity={0.08} />
    <div style={{ position: 'absolute', left: 130, top: 90, fontFamily: HEAD, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: C.gold }}>ƏRƏB DİLİ · DƏRS 2</div>
    <div style={{ position: 'absolute', left: 130, right: 130, top: 230 }}>
      <Pop delay={10}><Ar size={190} color="#fff" weight={700} style={{ display: 'block', textAlign: 'right' }}>ضَمَائِرُ الشَّخْصِ</Ar></Pop>
      <Pop delay={35} from="up"><div style={{ height: 6, width: 220, background: C.gold, margin: '20px 0 40px' }} /></Pop>
      <Pop delay={45} from="up"><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 120, color: '#fff' }}>Şəxs əvəzlikləri</div></Pop>
      <Pop delay={70} from="up"><div style={{ fontSize: 44, color: '#B8C2D8', marginTop: 20 }}>Mən, sən, o, biz, siz, onlar — ərəbcə necə deyilir?</div></Pop>
    </div>
  </Scene>
);

/* 2. 14 əvəzlik */
export const Fourteen: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [20, 80], [0, 14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <Scene dur={dur}>
      <Star x={-200} y={500} size={700} />
      <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 10 }}>
        <Pop delay={0}><Big size={56}>Ərəb dilində</Big></Pop>
        <Pop delay={15}><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 320, color: C.gold, lineHeight: 1 }}>{n}</div></Pop>
        <Pop delay={30}><Big size={64}>şəxs əvəzliyi var!</Big></Pop>
        <Pop delay={100} from="up"><div style={{ fontSize: 44, color: C.muted, marginTop: 30 }}>Qorxma — onları addım-addım, birlikdə öyrənəcəyik 🙂</div></Pop>
      </AbsoluteFill>
    </Scene>
  );
};

/* 3. Cins: Azərbaycan dilində «o» bir sözdür, ərəb dilində iki */
export const Gender: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const phase2 = frame >= 200;
  return (
    <Scene dur={dur}>
      <Header kicker="Birinci sirr · cins" title={phase2 ? <>Ərəb dilində isə — <span style={{ color: C.m }}>oğlan</span> və <span style={{ color: C.f }}>qız</span> üçün ayrı söz!</> : 'Azərbaycan dilində'} />
      <AbsoluteFill style={{ ...center, top: 120, gap: 260 }}>
        {[{ g: 'm' as G, ar: 'هُوَ', rd: 'huvə', mn: 'o (oğlan)' }, { g: 'f' as G, ar: 'هِيَ', rd: 'hiyə', mn: 'o (qız)' }].map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
            <Person g={p.g} h={300} delay={10 + i * 10} phase={i} />
            <div style={{ height: 300, ...center }}>
              {!phase2 && <Pop delay={40 + i * 15}><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: C.ink, background: C.paper, border: `5px solid ${C.line}`, borderRadius: 30, padding: '0 60px' }}>o</div></Pop>}
              {phase2 && <Sequence from={200} layout="none"><PCard g={p.g} ar={p.ar} rd={p.rd} mn={p.mn} delay={10 + i * 40} width={380} /></Sequence>}
            </div>
          </div>
        ))}
      </AbsoluteFill>
      {!phase2 && <Sequence from={90} layout="none"><Pop style={{ position: 'absolute', bottom: 70, left: 0, right: 0 }}><Big size={46} color={C.muted}>Oğlana da «o» deyirik, qıza da «o» deyirik.</Big></Pop></Sequence>}
    </Scene>
  );
};

/* 4. Say: tək / ikilik / cəm */
const NumBox: React.FC<{ gs: G[][]; label: React.ReactNode; note: string; delay: number; hi?: boolean; w: number }> = ({ gs, label, note, delay, hi, w }) => {
  const frame = useCurrentFrame();
  const pulse = hi ? 1 + 0.03 * Math.sin(frame / 6) : 1;
  return (
    <Pop delay={delay}>
      <div style={{ width: w, height: 330, background: hi ? C.goldSoft : C.paper, border: `4px solid ${hi ? C.gold : C.line}`, borderRadius: 30, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', transform: `scale(${pulse})`, position: 'relative' }}>
        {hi && <div style={{ position: 'absolute', top: -26, right: -20, background: C.gold, color: '#fff', fontFamily: HEAD, fontWeight: 800, fontSize: 26, borderRadius: 99, padding: '6px 18px', transform: 'rotate(6deg)' }}>YENİ!</div>}
        <div style={{ display: 'flex', gap: 50, alignItems: 'flex-end', flex: 1 }}>{gs.map((g, i) => <Crowd key={i} gs={g} h={150} delay={delay + 8} gap={-14} />)}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44 }}>{label}</div>
        <div style={{ fontSize: 28, color: C.muted }}>{note}</div>
      </div>
    </Pop>
  );
};
export const Number3: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur}>
    <Header kicker="İkinci sirr · say" title="Neçə nəfərdir?" />
    <div style={{ position: 'absolute', left: 110, right: 110, top: 280, display: 'flex', flexDirection: 'column', gap: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        <Pop delay={15} style={{ width: 300 }}><Big size={40} style={{ textAlign: 'left' }}>Azərbaycan dilində <span style={{ color: C.muted }}>— 2</span></Big></Pop>
        <NumBox w={400} gs={[['n']]} label="Tək" note="1 nəfər" delay={25} />
        <NumBox w={760} gs={[['n', 'n'], ['n', 'n', 'n']]} label="Cəm" note="2 və daha çox" delay={45} />
      </div>
      <Sequence from={170} layout="none">
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <Pop delay={0} style={{ width: 300 }}><Big size={40} style={{ textAlign: 'left' }}>Ərəb dilində <span style={{ color: C.gold }}>— 3</span></Big></Pop>
          <NumBox w={400} gs={[['n']]} label={<><Dots n={1} />Tək</>} note="1 nəfər" delay={15} />
          <NumBox w={360} gs={[['n', 'n']]} label={<><Dots n={2} />İkilik</>} note="2 nəfər" delay={50} hi />
          <NumBox w={370} gs={[['n', 'n', 'n']]} label={<><Dots n={3} />Cəm</>} note="3 və daha çox" delay={85} />
        </div>
      </Sequence>
    </div>
  </Scene>
);

/* 5–8. Hər şəxs üçün üç əvəzlik */
type Item = { ar: string; rd: string; mn: string };
export const GroupScene: React.FC<{ dur: number; g: G; kicker: string; title: React.ReactNode; sub: string; items: [Item, Item, Item]; you?: boolean }> = ({ dur, g, kicker, title, sub, items, you }) => {
  const step = 130;
  return (
    <Scene dur={dur}>
      <Header kicker={kicker} title={<span style={{ color: gColor(g) }}>{title}</span>} sub={sub} />
      <div style={{ position: 'absolute', left: 110, right: 110, top: 330, display: 'flex', justifyContent: 'space-between' }}>
        {items.map((it, i) => (
          <Sequence key={i} from={30 + i * step} layout="none">
            <div style={{ width: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
              <Pop><NumChip n={(i + 1) as 1 | 2 | 3} /></Pop>
              <div style={{ height: 230, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                {you && <Pop delay={14} style={{ position: 'absolute', top: -6, left: -80 }}><span style={{ fontSize: 70 }}>👉</span></Pop>}
                <Crowd gs={Array(i + 1).fill(g)} h={200} delay={6} />
              </div>
              <PCard g={g} ar={it.ar} rd={it.rd} mn={it.mn} delay={30} width={470} />
            </div>
          </Sequence>
        ))}
      </div>
    </Scene>
  );
};

/* 9. Mən və biz */
export const MeWe: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur}>
    <Header kicker="Danışan özü" title="Mən və biz" sub="Bu iki sözü həm oğlan, həm qız eyni cür deyir." />
    <div style={{ position: 'absolute', left: 110, right: 110, top: 330, display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <Pop delay={20}><NumChip n={1} /></Pop>
        <div style={{ height: 230, display: 'flex', alignItems: 'flex-end', gap: 40 }}>
          <Person g="m" h={200} delay={30} /><Person g="f" h={200} delay={40} phase={2} />
        </div>
        <PCard g="n" ar="أَنَا" rd="ənə" mn="mən" delay={60} width={520} />
      </div>
      <Sequence from={140} layout="none">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <Pop><span style={{ display: 'inline-flex', gap: 14 }}><NumChip n={2} /><NumChip n={3} /></span></Pop>
          <div style={{ height: 230, display: 'flex', alignItems: 'flex-end' }}><Crowd gs={['m', 'f', 'm', 'f']} h={200} delay={10} /></div>
          <PCard g="n" ar="نَحْنُ" rd="nəhnu" mn="biz (2 və daha çox)" delay={40} width={520} />
        </div>
      </Sequence>
    </div>
  </Scene>
);

/* 10. Diqqət: humə və əntumə hər iki cins üçün eynidir */
export const Same: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur}>
    <Header kicker="Diqqət!" title="Bu iki söz oğlan üçün də, qız üçün də eynidir" />
    <div style={{ position: 'absolute', left: 110, right: 110, top: 330, display: 'flex', flexDirection: 'column', gap: 40 }}>
      {[{ ar: 'هُمَا', rd: 'humə', m: 'onlar ikisi (2 oğlan)', f: 'onlar ikisi (2 qız)' }, { ar: 'أَنْتُمَا', rd: 'əntumə', m: 'siz ikiniz (2 oğlan)', f: 'siz ikiniz (2 qız)' }].map((r, i) => (
        <Sequence key={i} from={20 + i * 150} layout="none">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
            <Crowd gs={['m', 'm']} h={150} />
            <Row g="m" ar={r.ar} rd={r.rd} mn={r.m} />
            <Pop delay={40}><span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: C.gold }}>=</span></Pop>
            <Row g="f" ar={r.ar} rd={r.rd} mn={r.f} delay={30} />
            <Crowd gs={['f', 'f']} h={150} delay={30} />
          </div>
        </Sequence>
      ))}
    </div>
  </Scene>
);
const Row: React.FC<{ g: G; ar: string; rd: string; mn: string; delay?: number }> = ({ g, ar, rd, mn, delay = 10 }) => (
  <Pop delay={delay}>
    <div style={{ width: 430, background: gSoft(g), border: `4px solid ${gColor(g)}`, borderRadius: 30, padding: '0 26px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Ar size={90} style={{ marginTop: 8 }}>{ar}</Ar>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: gColor(g), marginTop: -6 }}>{rd}</div>
      <div style={{ fontSize: 28 }}>{mn}</div>
    </div>
  </Pop>
);

/* 11. Bütün 14 əvəzlik — cədvəl */
const TABLE: { label: string; g: G; cells: [string, string][] }[] = [
  { label: 'O · oğlan', g: 'm', cells: [['هُوَ', 'huvə'], ['هُمَا', 'humə'], ['هُمْ', 'hum']] },
  { label: 'O · qız', g: 'f', cells: [['هِيَ', 'hiyə'], ['هُمَا', 'humə'], ['هُنَّ', 'hunnə']] },
  { label: 'Sən · oğlan', g: 'm', cells: [['أَنْتَ', 'əntə'], ['أَنْتُمَا', 'əntumə'], ['أَنْتُمْ', 'əntum']] },
  { label: 'Sən · qız', g: 'f', cells: [['أَنْتِ', 'ənti'], ['أَنْتُمَا', 'əntumə'], ['أَنْتُنَّ', 'əntunnə']] },
  { label: 'Mən · Biz', g: 'n', cells: [['أَنَا', 'ənə'], ['نَحْنُ', 'nəhnu']] },
];
export const Summary: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  let k = 0;
  const per = 14;
  const shown = Math.max(0, Math.min(14, Math.floor((frame - 30) / per) + 1));
  return (
    <Scene dur={dur}>
      <div style={{ position: 'absolute', left: 110, top: 50, fontFamily: HEAD, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: C.gold }}>HAMISI BİR YERDƏ</div>
      <div style={{ position: 'absolute', right: 110, top: 30, fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: C.gold }}>{shown} / 14</div>
      <div style={{ position: 'absolute', left: 110, right: 110, top: 120, display: 'grid', gridTemplateColumns: '280px 1fr 1fr 1fr', gap: 14 }}>
        <span />
        {[1, 2, 3].map((n) => <div key={n} style={{ ...center }}><NumChip n={n as 1 | 2 | 3} /></div>)}
        {TABLE.map((r, ri) => (
          <React.Fragment key={ri}>
            <Pop delay={20 + ri * 3 * per} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: r.g === 'n' ? C.ink : gColor(r.g), borderLeft: `10px solid ${r.g === 'n' ? C.gold : gColor(r.g)}`, paddingLeft: 18 }}>{r.label}</div>
            </Pop>
            {r.cells.map(([ar, rd], ci) => {
              const d = 30 + (k++) * per;
              return (
                <Pop key={ci} delay={d} style={{ gridColumn: r.cells.length === 2 && ci === 1 ? 'span 2' : undefined }}>
                  <div style={{ height: 160, background: gSoft(r.g), border: `3px solid ${r.g === 'n' ? C.line : gColor(r.g)}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
                    <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: r.g === 'n' ? C.ink : gColor(r.g) }}>{rd}</span>
                    <Ar size={86}>{ar}</Ar>
                  </div>
                </Pop>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </Scene>
  );
};

/* 12. Sual əvəzliyi مَنْ */
export const Who: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur}>
    <Header kicker="Sual əvəzliyi" title="Kim?" />
    <AbsoluteFill style={{ ...center, gap: 120, top: 80 }}>
      <Pop delay={15}>
        <div style={{ width: 520, height: 520, borderRadius: '50%', background: C.goldSoft, border: `6px solid ${C.gold}`, ...center, flexDirection: 'column' }}>
          <Ar size={200} color={C.gold} weight={700} style={{ lineHeight: 1.5, marginTop: -40 }}>مَنْ</Ar>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, marginTop: -20 }}>mən = kim?</div>
        </div>
      </Pop>
      <Sequence from={110} layout="none">
        <Pop>
          <div style={{ width: 760, background: C.fSoft, border: `4px solid ${C.f}`, borderRadius: 34, padding: '30px 44px', fontSize: 40, lineHeight: 1.45 }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: C.f, marginBottom: 10 }}>⚠️ Qarışdırma!</div>
            Ərəbcə <b>«mən»</b> — <b>«kim?»</b> deməkdir.<br />
            Azərbaycanca «mən» isə ərəbcə <Ar size={64} style={{ verticalAlign: 'middle' }}>أَنَا</Ar> <b>ənə</b> olur.
          </div>
        </Pop>
      </Sequence>
    </AbsoluteFill>
  </Scene>
);

/* 13–14. Dialoqlar */
const Line: React.FC<{ ar: string; rd: string; mn: string }> = ({ ar, rd, mn }) => (
  <>
    <Ar size={110}>{ar}</Ar>
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, marginTop: -10 }}>{rd}</div>
    <div style={{ fontSize: 32, color: C.muted }}>{mn}</div>
  </>
);
export const Dialog: React.FC<{ dur: number; title: string; left: G; right: G; q: [string, string, string]; a: [string, string, string]; middle?: { g: G; tag: string } }> = ({ dur, title, left, right, q, a, middle }) => (
  <Scene dur={dur}>
    <Header kicker="Sual və cavab" title={title} />
    <div style={{ position: 'absolute', left: 140, bottom: 60 }}><Person g={left} h={380} delay={5} /></div>
    <div style={{ position: 'absolute', right: 140, bottom: 60 }}><Person g={right} h={right === 't' ? 440 : 380} delay={15} phase={3} /></div>
    {middle && <div style={{ position: 'absolute', left: 870, bottom: 60 }}><Person g={middle.g} h={300} delay={25} phase={5} tag={middle.tag} tagDelay={200} /></div>}
    <div style={{ position: 'absolute', left: 300, top: 250 }}><Bubble side="left" delay={40}><Line ar={q[0]} rd={q[1]} mn={q[2]} /></Bubble></div>
    <div style={{ position: 'absolute', right: 300, top: middle ? 250 : 330 }}><Bubble side="right" delay={170} color={gColor(right === 't' ? 'm' : right)}><Line ar={a[0]} rd={a[1]} mn={a[2]} /></Bubble></div>
  </Scene>
);

/* 15. Sınaq */
export const QUIZ_REVEAL = 200; // cavabın göründüyü kadr (cavabın səsi də bu anda başlayır)
export const Quiz: React.FC<{ dur: number; n: number; gs: G[]; ask: string; you?: boolean; g: G; ar: string; rd: string; mn: string }> = ({ dur, n, gs, ask, you, g, ar, rd, mn }) => {
  const frame = useCurrentFrame();
  const reveal = QUIZ_REVEAL;
  const count = frame < 60 ? null : frame < reveal ? Math.max(1, 5 - Math.floor((frame - 60) / 28)) : null;
  const tick = usePop(60 + (5 - (count ?? 5)) * 28, 10);
  return (
    <Scene dur={dur}>
      <Header kicker={`Özünü yoxla · ${n} / 4`} title={ask} />
      <div style={{ position: 'absolute', left: 160, top: 330, display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        {you && <Pop delay={10}><span style={{ fontSize: 90 }}>👉</span></Pop>}
        <Crowd gs={gs} h={300} delay={5} />
      </div>
      <div style={{ position: 'absolute', right: 160, top: 300, width: 720, height: 560, ...center }}>
        {frame < reveal && (
          <Pop delay={30}>
            <div style={{ width: 420, height: 420, borderRadius: '50%', border: `8px dashed ${C.gold}`, ...center, flexDirection: 'column' }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 200, color: C.gold, lineHeight: 1 }}>?</div>
              {count && <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: C.ink, transform: `scale(${0.6 + 0.4 * tick})` }}>{count}</div>}
            </div>
          </Pop>
        )}
        {frame >= reveal && <Sequence from={reveal} layout="none"><PCard g={g} ar={ar} rd={rd} mn={mn} size={150} width={620} /></Sequence>}
      </div>
      {frame >= reveal && <Sequence from={reveal + 20} layout="none"><Pop style={{ position: 'absolute', bottom: 60, left: 0, right: 0 }}><Big size={52} color={C.gold}>Düz tapdın? Afərin! ⭐</Big></Pop></Sequence>}
    </Scene>
  );
};

/* 16. Yeni sözlər */
type W = { ar: string; rd: string; mn: string; g: 'm' | 'f'; note?: string };
export const Words: React.FC<{ dur: number; words: W[]; part: string }> = ({ dur, words, part }) => (
  <Scene dur={dur}>
    <Header kicker={`Yeni sözlər · ${part}`} title="Ailə və insanlar" sub="Sözü əzbərləyəndə cinsini də əzbərlə: mavi — müzəkkər, çəhrayı — müənnəs." />
    <div style={{ position: 'absolute', left: 110, right: 110, top: 400, display: 'flex', justifyContent: 'space-between' }}>
      {words.map((w, i) => (
        <Pop key={i} delay={30 + i * 40}>
          <div style={{ width: 316, height: 470, background: w.g === 'm' ? C.mSoft : C.fSoft, border: `4px solid ${gColor(w.g)}`, borderRadius: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ar size={110}>{w.ar}</Ar>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 42, color: gColor(w.g) }}>{w.rd}</div>
            <div style={{ fontSize: 34 }}>{w.mn}</div>
            <div style={{ marginTop: 14, background: gColor(w.g), color: '#fff', borderRadius: 99, padding: '4px 18px', fontWeight: 700, fontSize: 24 }}>{w.g === 'm' ? 'müzəkkər' : 'müənnəs'}{w.note ? ` · ${w.note}` : ''}</div>
          </div>
        </Pop>
      ))}
    </div>
  </Scene>
);

/* 17. Son */
export const Outro: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} bg={C.navy}>
    <Star x={-150} y={-150} size={700} opacity={0.08} />
    <Star x={1350} y={550} size={700} opacity={0.08} />
    <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 30 }}>
      <Pop delay={5}><div style={{ fontSize: 130 }}>🎉</div></Pop>
      <Pop delay={15}><Big size={130} color="#fff">Afərin!</Big></Pop>
      <Pop delay={35} from="up"><div style={{ fontSize: 46, color: '#B8C2D8', textAlign: 'center' }}>Bu gün 14 şəxs əvəzliyini və <Ar size={70} color={C.gold} style={{ verticalAlign: 'middle' }}>مَنْ</Ar> «kim?» sualını öyrəndik.</div></Pop>
      <Pop delay={60} from="up"><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.gold, marginTop: 30 }}>ƏRƏB DİLİ · DƏRS 2</div></Pop>
    </AbsoluteFill>
  </Scene>
);
