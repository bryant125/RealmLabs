// Exact-text fixes in published Sanity articles. Usage:
//   node scripts/patch-text.mjs fixes.json [--apply]
// fixes.json: {"<docId>": [["old text", "new text"], ...]}. Each old text must
// match exactly once inside a single span, table cell, CTA heading or the
// description; otherwise nothing is written for that doc. Prefix old text
// with "=" to require an exact whole-span/cell match.
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const F = JSON.parse(readFileSync(process.argv[2], 'utf8')), APPLY = process.argv.includes('--apply')
for (const [id, fx] of Object.entries(F)) {
  const d = await c.getDocument(id); const hits = fx.map(() => 0)
  // An old text starting with "=" must equal the whole span/cell (exact match).
  const rep = (s) => {
    if (typeof s !== 'string') return s
    const orig = s
    fx.forEach(([a, b], i) => {
      if (a.startsWith('=')) { if (orig === a.slice(1)) { s = b; hits[i]++ } }
      else if (orig.includes(a)) { s = s.replace(a, b); hits[i]++ }
    })
    return s
  }
  d.description = rep(d.description)
  for (const b of d.body) {
    if (b._type === 'block') for (const sp of b.children) sp.text = rep(sp.text)
    if (b._type === 'comparisonTable') { b.caption = rep(b.caption); for (const r of b.rows) r.cells = r.cells.map(rep) }
    if (b._type === 'appCta') b.heading = rep(b.heading)
  }
  fx.forEach(([a], i) => { if (hits[i] !== 1) console.log(`  MISS(${hits[i]}) ${id}: ${a.slice(0, 70)}`) })
  const ok = hits.every((h) => h === 1)
  console.log(ok ? 'ok ' : 'SKIP', id, `${hits.filter((h) => h === 1).length}/${fx.length}`)
  if (APPLY && ok) { await c.patch(id).set({description: d.description, body: d.body}).commit(); console.log('  patched') }
}
