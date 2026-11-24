// Week 14 (2026-11-24): link the regressions hub to the new 6/8/18-month regression articles. Applied once; do not re-run (inserts blocks).
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const k = () => randomUUID().slice(0, 8)
const para = (before, text, after, href) => { const key = 'l' + k(); return {_type: 'block', _key: k(), style: 'normal', markDefs: [{_key: key, _type: 'link', href}], children: [{_type: 'span', _key: k(), text: before, marks: []}, {_type: 'span', _key: k(), text, marks: [key]}, {_type: 'span', _key: k(), text: after, marks: []}]} }
const id = 'mamabee-baby-sleep-regressions-by-age'
const d = await c.getDocument(id)
if (JSON.stringify(d.body).includes('8-month-sleep-regression')) { console.log('already linked'); process.exit(0) }
const h2 = (t) => d.body.findIndex((b) => b.style === 'h2' && b.children.map((x) => x.text).join('') === t)
const ins = [
  [h2('The 18-month regression') + 1, null, para('For the full toddler version, with a one-nap sample day, see our ', '18 month sleep regression guide', '.', '/mamabee/articles/18-month-sleep-regression')],
  [h2('The 8–10 month regression') + 1, null, para('We go deeper, including the "9 month regression", in our ', '8 month sleep regression guide', '.', '/mamabee/articles/8-month-sleep-regression')],
  [h2('The 8–10 month regression'), null, para('Sleep can also wobble around 6 months, though it is not a classic regression. See our ', '6 month sleep regression guide', ' for what changes then.', '/mamabee/articles/6-month-sleep-regression')],
]
// Insert after the section's first paragraph (h2 index + 1) or right before the 8–10 month H2; go from the end so indices stay valid.
ins.sort((a, b) => b[0] - a[0])
for (const [i, , blk] of ins) { if (i < 1) throw new Error('heading not found'); const at = d.body[i - 1]?.style === 'h2' ? i + 1 : i; d.body.splice(at, 0, blk) }
await c.patch(id).set({body: d.body}).commit()
console.log('hub linked:', ins.length, 'paragraphs')
