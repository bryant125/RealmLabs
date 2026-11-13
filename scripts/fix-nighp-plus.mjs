// Nov 2026: Nighp's Baby Tracker added an optional Plus subscription ($5.99/mo,
// $49.99/yr) with on-device "What's Next" cues; MamaBee has no iPad/Android/Watch
// roadmap claim; vaccine schedule is Premium. Updates mamabee-vs-baby-tracker.
// Dry run by default; --apply to write.
import {createClient} from '@sanity/client'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const ID = 'mamabee-mamabee-vs-baby-tracker'
const FIX = [
  ['$4.99 once, removes ads', '$4.99 once removes ads; optional Plus $5.99/mo or $49.99/yr'],
  ['CELL:e99d3cb6:1:Not offered', '"What\'s Next" timing cues (Plus)'],
  ['iPhone (more on roadmap)', 'iPhone only'],
  ['CELL:b142e1f7:2:Roadmap', 'No'],
  ['$4.99. One time. No subscription, ever.', '$4.99, one time, removes the ads, and you never have to subscribe. A newer optional Plus tier ($5.99 a month or $49.99 a year) adds "What\'s Next" timing cues, but the core log never requires it.'],
  ['Baby Tracker does not pretend to be a sleep coach or an AI companion. It is a log. It is a very good log.', 'At its core Baby Tracker is a log, and a very good one. The optional Plus tier adds on-device "What\'s Next" cues, but it does not try to be an AI companion.'],
  ['No insight of any kind.', 'Insight is light and costs extra.'],
  [' No nap prediction, no pattern detection, no assistant. When you stare', ' The free log has no nap prediction and there is no chat assistant at any tier; Plus adds "What\'s Next" cues for the next feed or sleep. When you stare'],
  ['CELL:4599c57b:3:Never', 'Optional (Plus)'],
  ['Baby Tracker does not offer one at any price.', 'Baby Tracker\'s optional Plus offers "What\'s Next" timing cues.'],
  ['country-specific vaccine schedules with due and overdue reminders.', 'country-specific vaccine schedules with due and overdue reminders (the first 3 months are free; the full schedule is Premium).'],
  ['iPhone first.', 'iPhone only.'],
  [' iPad, Android and Apple Watch are on the roadmap; Baby Tracker covers them today.', ' There is no iPad, Android or Apple Watch app; Baby Tracker covers all of them today.'],
  ['or you actively do not want an app offering opinions and predictions.', 'or you want a log that never asks you to subscribe.'],
  ['none of which Baby Tracker offers at any price.', 'Baby Tracker has no AI chat or allergen test, and its predictions sit behind a separate Plus subscription.'],
  ['A single $4.99 purchase removes them permanently, with no subscription.', 'A single $4.99 purchase removes them permanently. An optional Plus subscription ($5.99 a month or $49.99 a year) adds "What\'s Next" cues.'],
  ['No. It is a fast, reliable log by design — no AI, no predictions, no insights. MamaBee\'s Sleep Coach does predict nap windows, on the Premium tier.', 'Only with Plus. The optional Plus subscription ($5.99 a month or $49.99 a year, as of November 2026) adds on-device "What\'s Next" cues for upcoming feeds and sleep; the free log has no predictions. MamaBee\'s Sleep Coach predicts nap windows on Premium.'],
  ['$4.99 forever, and utterly reliable — with no interest in telling you what any of it means.', '$4.99 to remove ads, and utterly reliable, with optional Plus cues if you want them.'],
]
const d = await c.getDocument(ID), hits = FIX.map(() => 0)
for (const b of d.body) {
  if (b._type === 'block') for (const s of b.children) FIX.forEach(([a, n], i) => { if (!a.startsWith('CELL:') && s.text.includes(a)) { s.text = s.text.replace(a, n); hits[i]++ } })
  if (b._type === 'comparisonTable') for (const r of b.rows) {
    FIX.forEach(([a, n], i) => {
      if (a.startsWith('CELL:')) { const [, key, col, old] = a.split(':'); if (r._key === key && r.cells[+col] === old) { r.cells[+col] = n; hits[i]++ } }
      else r.cells = r.cells.map((x) => { if (x.includes(a)) { hits[i]++; return x.replace(a, n) } return x })
    })
  }
}
FIX.forEach(([a], i) => console.log(hits[i] === 1 ? 'ok  ' : `MISS(${hits[i]})`, a.slice(0, 70)))
if (process.argv.includes('--apply') && hits.every((h) => h === 1)) { await c.patch(ID).set({body: d.body}).commit(); console.log('patched') }
