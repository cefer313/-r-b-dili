const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/ders.html');
  await p.evaluate(() => document.fonts.ready);
  const fonts = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight));
  console.log('loaded fonts:', [...new Set(fonts)].join(', '));
  const overflow = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg, i) => [i + 1, pg.scrollHeight > pg.clientHeight + 1]).filter(x => x[1]));
  console.log('overflowing pages:', JSON.stringify(overflow));
  await p.pdf({ path: process.argv[2], format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
