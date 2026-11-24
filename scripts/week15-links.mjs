// Week 15 (2026-11-24): connect existing articles to the new week-15 pages. Idempotent: skips a doc that already links the target.
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const k = () => randomUUID().slice(0, 8)
// parts: strings and [text, href] pairs
const para = (...parts) => { const markDefs = [], children = []; for (const p of parts) { if (typeof p === 'string') children.push({_type: 'span', _key: k(), text: p, marks: []}); else { const key = 'l' + k(); markDefs.push({_key: key, _type: 'link', href: p[1]}); children.push({_type: 'span', _key: k(), text: p[0], marks: [key]}) } } return {_type: 'block', _key: k(), style: 'normal', markDefs, children} }
const A = (s) => `/mamabee/articles/${s}`
const jobs = [
  ['baby-sleep-schedule-by-age', 'Sleep regressions and other big changes', 'after', '3-month-sleep-regression', para('Age-by-age guides: the ', ['3 month', A('3-month-sleep-regression')], ', ', ['4 month', A('4-month-sleep-regression')], ', ', ['6 month', A('6-month-sleep-regression')], ', ', ['8 month', A('8-month-sleep-regression')], ', ', ['12 month', A('12-month-sleep-regression')], ', ', ['18 month', A('18-month-sleep-regression')], ' and ', ['2 year', A('2-year-sleep-regression')], ' sleep regressions.')],
  ['baby-sleep-regressions-by-age', 'The 4-month regression (the big one)', 'after', '3-month-sleep-regression', para('Seeing it a few weeks early? Read our ', ['3 month sleep regression guide', A('3-month-sleep-regression')], '.')],
  ['baby-sleep-regressions-by-age', 'The 12-month regression', 'after', '12-month-sleep-regression', para('For the full one-year guide, with a two-nap sample day, see our ', ['12 month sleep regression guide', A('12-month-sleep-regression')], '.')],
  ['baby-sleep-regressions-by-age', 'The 2-year regression', 'after', '2-year-sleep-regression', para('We cover this one in depth in our ', ['2 year sleep regression guide', A('2-year-sleep-regression')], '.')],
  ['baby-sleep-regressions-by-age', 'The regressions by age', 'after', 'baby-sleep-schedule-by-age', para('For naps, wake windows and bedtimes at every age, see our ', ['baby sleep schedule by age chart', A('baby-sleep-schedule-by-age')], '.')],
  ['4-month-sleep-regression', 'Why it happens (the science, made simple)', 'after', '3-month-sleep-regression', para('If the changes start a little earlier, our ', ['3 month sleep regression guide', A('3-month-sleep-regression')], ' explains why.')],
  ['18-month-sleep-regression', 'Frequently asked questions', 'before', '2-year-sleep-regression', para('Looking ahead? Our ', ['2 year sleep regression guide', A('2-year-sleep-regression')], ' covers the next big sleep change.')],
  ['10-month-old-schedule', 'Frequently asked questions', 'before', '11-month-old-schedule', para('Looking ahead? Our ', ['11 month old sleep schedule', A('11-month-old-schedule')], ' shows what changes next month.')],
  ['2-month-old-schedule', 'How does sleep work at 2 months?', 'after', '1-month-old-schedule', para('Coming from the first month? Compare with our ', ['1 month old sleep schedule', A('1-month-old-schedule')], '.')],
]
for (const m of [2, 3, 4, 5, 6, 7, 8, 9, 10]) jobs.push([`${m}-month-old-schedule`, 'Frequently asked questions', 'before', 'baby-sleep-schedule-by-age', para('See every age side by side in our ', ['baby sleep schedule by age chart', A('baby-sleep-schedule-by-age')], '.')])
const cache = {}
for (const [slug, heading, where, target, blk] of jobs) {
  const d = cache[slug] ??= await c.getDocument(`mamabee-${slug}`)
  if (JSON.stringify(d.body).includes(`"${A(target)}"`)) { console.log('skip', slug, '→', target); continue }
  const i = d.body.findIndex((b) => b.style === 'h2' && b.children.map((x) => x.text).join('') === heading)
  if (i < 0) { console.log('!! heading not found', slug, heading); continue }
  d.body.splice(where === 'before' ? i : i + 2, 0, blk); d._dirty = true
  console.log('+', slug, '→', target)
}
for (const [slug, d] of Object.entries(cache)) if (d._dirty) { await c.patch(`mamabee-${slug}`).set({body: d.body}).commit(); console.log('saved', slug) }
