// Nov 2026: the lower yearly price is an in-app promo only, so articles quote just
// the standard monthly/yearly price. Removes promo mentions from Sanity docs and
// the wave-1 source scripts. Dry run by default; --apply to write.
import {createClient} from '@sanity/client'
import {readFileSync, writeFileSync} from 'node:fs'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const APPLY = process.argv.includes('--apply')
const F = {
  ko: {
    'best-baby-tracker-apps-compared': [['이에요. 같은 목록에 ₩66,000짜리 연간 상품도 함께 표시되니, 실제 금액은 앱의 결제 화면에서 확인해 주세요.', '이에요.']],
    'mamabee-vs-babytime': [['이에요(같은 목록에 ₩66,000 연간 상품도 표시돼요).', '이에요.']],
  },
  'pt-br': {
    'best-baby-tracker-apps-compared': [[' (também listado: R$ 249,90/ano)', ''], ['R$ 249,90 a R$ 299,90', 'R$ 299,90'], [' (também listado a 44,99 € por ano)', '']],
    'mamabee-vs-meu-bebe': [[' (há também um plano anual listado a R$ 249,90)', '']],
    'napper-vs-mamabee': [[' (também listado: R$ 249,90/ano)', ''], ['MamaBee Premium (plano de R$ 299,90)', 'MamaBee Premium anual'], ['ROW:MamaBee Premium (plano de R$ 249,90)', '']],
  },
  'zh-cn': {
    'baobaoshu-vs-qinbaobao-vs-mamabee': [['¥328（另列 ¥298 年费项）', '¥328']],
    'best-baby-tracker-apps-compared': [['（另列 ¥298 年费项）', ''], ['（另列 RM199.90）', ''], ['（另列 S$59.98）', '']],
  },
  'zh-tw': {
    'best-baby-tracker-apps-compared': [['另列 NT$1,290 年費項目', '—']],
  },
}
for (const [lang, docs] of Object.entries(F)) {
  // source script
  const sp = `scripts/intl-wave1-${lang}.mjs`; let src = readFileSync(sp, 'utf8')
  for (const [slug, fx] of Object.entries(docs)) {
    const id = `mamabee-${lang}-${slug}`, d = await c.getDocument(id), hits = fx.map(() => 0)
    const rep = (s) => { if (typeof s !== 'string') return s; fx.forEach(([a, b], i) => { if (!a.startsWith('ROW:') && s.includes(a)) { s = s.split(a).join(b); hits[i]++ } }); return s }
    for (const b of d.body) {
      if (b._type === 'block') for (const sp of b.children) sp.text = rep(sp.text)
      if (b._type === 'comparisonTable') {
        fx.forEach(([a], i) => { if (a.startsWith('ROW:')) { const n = b.rows.length; b.rows = b.rows.filter((r) => r.cells[0] !== a.slice(4)); hits[i] += n - b.rows.length } })
        for (const r of b.rows) r.cells = r.cells.map(rep)
      }
    }
    console.log(hits.every((h) => h >= 1) ? 'ok  ' : 'MISS', id, hits.join(','))
    if (APPLY && hits.every((h) => h >= 1)) await c.patch(id).set({body: d.body}).commit()
    for (const [a, b] of fx) {
      if (a.startsWith('ROW:')) { const lines = src.split('\n'); const kept = lines.filter((l) => !l.includes(`'${a.slice(4)}'`)); if (kept.length === lines.length) console.log('  script MISS row', a); src = kept.join('\n') }
      else if (src.includes(a)) src = src.split(a).join(b); else console.log('  script MISS', a.slice(0, 40))
    }
  }
  if (APPLY) writeFileSync(sp, src)
}
console.log(APPLY ? 'applied' : 'dry run')
