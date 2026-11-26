import React from 'react';
import { Audio, Composition, Series, Sequence, staticFile } from 'remotion';
import SES from './ses.json';
import { useFonts } from './kit';
import { QUIZ_REVEAL, Dialog, Fourteen, Gender, GroupScene, Intro, MeWe, Number3, Outro, Quiz, Same, Summary, Who, Words } from './scenes';

const S = 30; // 1 saniyə = 30 kadr

// Səhnələr ardıcıllıqla; "d" — müddət (kadr)
const SCENES: { d: number; el: (d: number) => React.ReactElement }[] = [
  { d: 6 * S, el: (d) => <Intro dur={d} /> },
  { d: 6 * S, el: (d) => <Fourteen dur={d} /> },
  { d: 15 * S, el: (d) => <Gender dur={d} /> },
  { d: 16 * S, el: (d) => <Number3 dur={d} /> },
  { d: 17 * S, el: (d) => <GroupScene dur={d} g="m" kicker="1 · haqqında danışdığımız oğlan(lar)" title="O — oğlan" sub="Yanımızda olmayan, haqqında danışdığımız oğlan" items={[{ ar: 'هُوَ', rd: 'huvə', mn: 'o (1 oğlan)' }, { ar: 'هُمَا', rd: 'humə', mn: 'onlar ikisi (2 oğlan)' }, { ar: 'هُمْ', rd: 'hum', mn: 'onlar (3 və çox oğlan)' }]} /> },
  { d: 17 * S, el: (d) => <GroupScene dur={d} g="f" kicker="2 · haqqında danışdığımız qız(lar)" title="O — qız" sub="Yanımızda olmayan, haqqında danışdığımız qız" items={[{ ar: 'هِيَ', rd: 'hiyə', mn: 'o (1 qız)' }, { ar: 'هُمَا', rd: 'humə', mn: 'onlar ikisi (2 qız)' }, { ar: 'هُنَّ', rd: 'hunnə', mn: 'onlar (3 və çox qız)' }]} /> },
  { d: 17 * S, el: (d) => <GroupScene dur={d} g="m" you kicker="3 · danışdığımız oğlan(lar)" title="Sən — oğlan" sub="Qarşımızda duran, onunla danışdığımız oğlan" items={[{ ar: 'أَنْتَ', rd: 'əntə', mn: 'sən (1 oğlan)' }, { ar: 'أَنْتُمَا', rd: 'əntumə', mn: 'siz ikiniz (2 oğlan)' }, { ar: 'أَنْتُمْ', rd: 'əntum', mn: 'siz (3 və çox oğlan)' }]} /> },
  { d: 17 * S, el: (d) => <GroupScene dur={d} g="f" you kicker="4 · danışdığımız qız(lar)" title="Sən — qız" sub="Qarşımızda duran, onunla danışdığımız qız" items={[{ ar: 'أَنْتِ', rd: 'ənti', mn: 'sən (1 qız)' }, { ar: 'أَنْتُمَا', rd: 'əntumə', mn: 'siz ikiniz (2 qız)' }, { ar: 'أَنْتُنَّ', rd: 'əntunnə', mn: 'siz (3 və çox qız)' }]} /> },
  { d: 12 * S, el: (d) => <MeWe dur={d} /> },
  { d: 12 * S, el: (d) => <Same dur={d} /> },
  { d: 12 * S, el: (d) => <Summary dur={d} /> },
  { d: 10 * S, el: (d) => <Who dur={d} /> },
  { d: 11 * S, el: (d) => <Dialog dur={d} title="O kimdir?" left="f" right="m" middle={{ g: 'm', tag: 'Cəfər' }} q={['مَنْ هُوَ؟', 'Mən huvə?', 'O kimdir?']} a={['هُوَ جَعْفَرٌ.', 'Huvə Cəfərun.', 'O, Cəfərdir.']} /> },
  { d: 11 * S, el: (d) => <Dialog dur={d} title="Sən kimsən?" left="m" right="t" q={['مَنْ أَنْتَ؟', 'Mən əntə?', 'Sən kimsən?']} a={['أَنَا مُعَلِّمٌ.', 'Ənə muəllimun.', 'Mən müəlliməm.']} /> },
  { d: 9 * S, el: (d) => <Quiz dur={d} n={1} gs={['f']} ask="Bu qız haqqında danışırıq: «o». Ərəbcə necə?" g="f" ar="هِيَ" rd="hiyə" mn="o (1 qız)" /> },
  { d: 9 * S, el: (d) => <Quiz dur={d} n={2} gs={['m', 'm', 'm']} ask="Bu oğlanlar haqqında: «onlar». Ərəbcə necə?" g="m" ar="هُمْ" rd="hum" mn="onlar (3 və çox oğlan)" /> },
  { d: 9 * S, el: (d) => <Quiz dur={d} n={3} gs={['f', 'f']} you ask="Bu iki qıza deyirik: «siz ikiniz». Ərəbcə necə?" g="f" ar="أَنْتُمَا" rd="əntumə" mn="siz ikiniz (2 qız)" /> },
  { d: 9 * S, el: (d) => <Quiz dur={d} n={4} gs={['f', 'f', 'f']} you ask="Bu qızlara deyirik: «siz». Ərəbcə necə?" g="f" ar="أَنْتُنَّ" rd="əntunnə" mn="siz (3 və çox qız)" /> },
  { d: 10 * S, el: (d) => <Words dur={d} part="1 / 2" words={[{ ar: 'أَبٌ', rd: 'əbun', mn: 'ata', g: 'm' }, { ar: 'أَخٌ', rd: 'əxun', mn: 'qardaş', g: 'm' }, { ar: 'جَدٌّ', rd: 'cəddun', mn: 'baba', g: 'm' }, { ar: 'صَدِيقٌ', rd: 'sadiqun', mn: 'dost (kişi)', g: 'm' }, { ar: 'طَبِيبٌ', rd: 'tabibun', mn: 'həkim (kişi)', g: 'm' }]} /> },
  { d: 10 * S, el: (d) => <Words dur={d} part="2 / 2" words={[{ ar: 'جَدَّةٌ', rd: 'cəddətun', mn: 'nənə', g: 'f' }, { ar: 'صَدِيقَةٌ', rd: 'sadiqatun', mn: 'dost (qadın)', g: 'f' }, { ar: 'طَبِيبَةٌ', rd: 'tabibətun', mn: 'həkim (qadın)', g: 'f' }, { ar: 'اِمْرَأَةٌ', rd: 'imraətun', mn: 'qadın', g: 'f' }, { ar: 'أُخْتٌ', rd: 'uxtun', mn: 'bacı', g: 'f', note: 'mənaca' }]} /> },
  { d: 7 * S, el: (d) => <Outro dur={d} /> },
];
// Səs: src/ses.json — hər hissənin müddəti (saniyə), public/ses/NN.mp3 (ses-hazirla.mjs yaradır).
// Səs səhnənin 0.4-cü saniyəsində başlayır; səhnə səsdən ən azı 1 saniyə uzun olur.
const VOICE_START = 12;
// Testdə cavabın səsi ayrıca faylda: NNb.mp3 — cavab ekranda görünəndə (QUIZ_REVEAL) səslənir.
const nn = (i: number) => String(i + 1).padStart(2, '0');
const voice = (i: number): number | undefined => (SES as Record<string, number>)[nn(i)];
const answer = (i: number): number | undefined => (SES as Record<string, number>)[nn(i) + 'b'];
const sceneLen = (i: number) => {
  const v = voice(i);
  const a = answer(i);
  let d = SCENES[i].d;
  if (v) d = Math.max(d, VOICE_START + Math.ceil((v + 1) * S));
  if (a) d = Math.max(d, QUIZ_REVEAL + Math.ceil((a + 1.5) * S));
  return d;
};
export const TOTAL = SCENES.reduce((a, _, i) => a + sceneLen(i), 0);

const Video: React.FC = () => {
  useFonts();
  return (
    <Series>
      {SCENES.map((s, i) => {
        const d = sceneLen(i);
        return (
          <Series.Sequence key={i} durationInFrames={d}>
            {s.el(d)}
            {voice(i) && <Sequence from={VOICE_START} layout="none"><Audio src={staticFile(`ses/${nn(i)}.mp3`)} /></Sequence>}
            {answer(i) && <Sequence from={QUIZ_REVEAL} layout="none"><Audio src={staticFile(`ses/${nn(i)}b.mp3`)} /></Sequence>}
          </Series.Sequence>
        );
      })}
    </Series>
  );
};

export const Root: React.FC = () => (
  <Composition id="Ders2" component={Video} durationInFrames={TOTAL} fps={S} width={1920} height={1080} />
);
