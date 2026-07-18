// Retrofits selected MamaBee articles with clean comparison tables (converting
// tabular bullet-lists) and proper numbered lists. Run:
//   SANITY_WRITE_TOKEN=xxx node scripts/retrofit-tables.mjs [--dry]
import {createClient} from '@sanity/client'

const DRY = process.argv.includes('--dry')
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})

let n = 0
const key = () => `rt${Date.now().toString(36)}${(n++).toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`
const textOf = (b) => (b?.children || []).map((c) => c.text || '').join('')
const table = (caption, headers, rows) => ({
  _type: 'comparisonTable', _key: key(), caption,
  headers,
  rows: rows.map((cells) => ({_type: 'row', _key: key(), cells})),
})

// Per-article operations. Each op transforms the body array.
const PLAN = {
  'wake-windows-by-age': (body) => {
    const isAgeBullet = (b) => b.listItem === 'bullet' && /^(0–1 month|1–2 months|3–4 months|5–6 months|7–9 months|10–12 months):/.test(textOf(b))
    const tbl = table(
      "Wake windows are starting points — always adjust to your baby's sleepy cues.",
      ["Baby's age", 'Wake window', 'Naps per day'],
      [
        ['0–1 month', '35–60 min', '6–8 (short)'],
        ['1–2 months', '45–90 min', '5–7'],
        ['3–4 months', '75–120 min', '4–5'],
        ['5–6 months', '2–2.5 hrs', '3'],
        ['7–9 months', '2.5–3.5 hrs', '2–3'],
        ['10–12 months', '3–4 hrs', '2'],
      ]
    )
    return replaceRunWithTable(numberList(body, /^[1-5]\.\s/), isAgeBullet, tbl)
  },
  'how-much-should-a-newborn-eat': (body) => {
    const isAmt = (b) => b.listItem === 'bullet' && /^(Day 1|Days 2–3|Week 1|Weeks 2–4|1–2 months)[::]/.test(textOf(b))
    const tbl = table(
      'Averages, not targets — babies self-regulate. Always follow hunger cues.',
      ["Baby's age", 'Amount per feed', 'How often'],
      [
        ['Day 1', '5–7 ml (~1 tsp)', 'every 1–3 hrs'],
        ['Days 2–3', '14–27 ml (½–1 oz)', 'every 2–3 hrs'],
        ['Week 1', '1–2 oz', 'every 2–3 hrs'],
        ['Weeks 2–4', '2–3 oz', 'every 2–3 hrs'],
        ['1–2 months', '3–4 oz', 'every 3–4 hrs'],
      ]
    )
    return replaceRunWithTable(body, isAmt, tbl)
  },
  'newborn-sleep-schedule': (body) => {
    const isWW = (b) => b.listItem === 'bullet' && /^(0–4 weeks|5–8 weeks|9–12 weeks):/.test(textOf(b))
    const tbl = table(
      'Watch the window and your baby, not the clock — total sleep is spread across many short stretches.',
      ["Baby's age", 'Wake window', 'Total sleep / 24 hrs'],
      [
        ['0–4 weeks', '35–60 min', '14–17 hrs'],
        ['5–8 weeks', '45–90 min', '14–16 hrs'],
        ['9–12 weeks', '60–120 min', '14–16 hrs'],
      ]
    )
    return replaceRunWithTable(body, isWW, tbl)
  },
  'baby-milestones-by-month': (body) => {
    const tbl = table(
      'Milestones are ranges, not deadlines — every baby reaches these on their own timeline.',
      ['Age', 'Big milestones to watch for'],
      [
        ['0–3 months', 'Lifts head briefly, first social smile, tracks faces, cooing'],
        ['4–6 months', 'Rolls over, grabs toys, laughs out loud, babbles'],
        ['7–9 months', 'Sits unsupported, starts crawling, responds to their name'],
        ['10–12 months', 'Pulls to stand, cruises, pincer grasp, first words'],
      ]
    )
    // insert the at-a-glance table right after the "four broad types" intro
    return insertTableAfter(body, (b) => /^There are four broad types of milestones/.test(textOf(b)), tbl)
  },
}

// --- helpers ---
function replaceRunWithTable(body, predicate, tbl) {
  const out = []
  let inserted = false
  for (const b of body) {
    if (predicate(b)) { if (!inserted) { out.push(tbl); inserted = true } continue }
    out.push(b)
  }
  if (!inserted) throw new Error('replaceRunWithTable: no matching blocks found')
  return out
}
function insertTableAfter(body, anchorPredicate, tbl) {
  const out = []
  let inserted = false
  for (const b of body) {
    out.push(b)
    if (!inserted && anchorPredicate(b)) { out.push(tbl); inserted = true }
  }
  if (!inserted) throw new Error('insertTableAfter: anchor not found')
  return out
}
// Convert manually "1. " numbered normal paragraphs into a real numbered list.
function numberList(body, prefixRe) {
  return body.map((b) => {
    if (b._type === 'block' && !b.listItem && b.style === 'normal' && prefixRe.test(textOf(b))) {
      const children = (b.children || []).map((c, i) => i === 0 ? {...c, text: (c.text || '').replace(prefixRe, '')} : c)
      return {...b, listItem: 'number', level: 1, children}
    }
    return b
  })
}

for (const [slug, transform] of Object.entries(PLAN)) {
  const id = 'mamabee-' + slug
  const doc = await client.getDocument(id)
  if (!doc) { console.log(`✗ ${slug}: not found`); continue }
  const before = doc.body.length
  let newBody
  try { newBody = transform(doc.body) } catch (e) { console.log(`✗ ${slug}: ${e.message}`); continue }
  const tables = newBody.filter((b) => b._type === 'comparisonTable').length
  console.log(`${slug}: ${before} → ${newBody.length} blocks, ${tables} table(s)`)
  if (!DRY) { await client.patch(id).set({body: newBody}).commit(); console.log(`  ✓ patched`) }
}
console.log(DRY ? '\nDRY RUN — nothing written.' : '\nDone.')
