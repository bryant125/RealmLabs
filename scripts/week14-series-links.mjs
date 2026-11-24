// Week 14 (2026-11-24): connect existing 6/7-month schedules to the new week-14 pages. Applied once; skips if already linked.
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const k = () => randomUUID().slice(0, 8)
const para = (before, text, after, href) => { const key = 'l' + k(); return {_type: 'block', _key: k(), style: 'normal', markDefs: [{_key: key, _type: 'link', href}], children: [{_type: 'span', _key: k(), text: before, marks: []}, {_type: 'span', _key: k(), text, marks: [key]}, {_type: 'span', _key: k(), text: after, marks: []}]} }
const jobs = [
  ['mamabee-7-month-old-schedule', 'Frequently asked questions', 'before', '8-month-old-schedule', para('Looking ahead? Our ', '8 month old sleep schedule', ' shows how the day settles into two naps and three meals.', '/mamabee/articles/8-month-old-schedule')],
  ['mamabee-6-month-old-schedule', 'Sleep at 6 months', 'after', '6-month-sleep-regression', para('If nights suddenly get worse this month, read our ', '6 month sleep regression guide', ' for what usually causes it and what helps.', '/mamabee/articles/6-month-sleep-regression')],
]
for (const [id, heading, where, slug, blk] of jobs) {
  const d = await c.getDocument(id)
  if (JSON.stringify(d.body).includes(`/mamabee/articles/${slug}`)) { console.log('skip (already linked)', id); continue }
  const i = d.body.findIndex((b) => b.style === 'h2' && b.children.map((x) => x.text).join('') === heading)
  if (i < 0) throw new Error(`${id}: heading not found`)
  d.body.splice(where === 'before' ? i : i + 2, 0, blk)
  await c.patch(id).set({body: d.body}).commit()
  console.log('✓', id, '→', slug)
}
