// Nov 2026: vaccine schedules are Premium (free shows only the first 3 months).
// Corrects English articles that called them free. Dry run by default; --apply to write.
import {createClient} from '@sanity/client'
const c=createClient({projectId:'1jrna7ry',dataset:'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_WRITE_TOKEN})
const DRY = process.argv[2] !== '--apply'
export const FIXES = [
 ['mamabee-baby-feed-timer-vs-mamabee','All of those, plus vaccines, 45+ CDC milestones','All of those, plus 45+ CDC milestones, vaccines (full schedule on Premium)'],
 ['mamabee-baby-feed-timer-vs-mamabee','Vaccine due dates','Vaccine due dates (Premium)'],
 ['mamabee-baby-feed-timer-vs-mamabee','and you want vaccines, milestones and health in the same place as feeds','and you want milestones and health in the same place as feeds, with the full vaccine schedule on Premium'],
 ['mamabee-baby-vaccine-schedule-explained','Get MamaBee free — track vaccine dates, due reminders and any reactions in one place.','Try MamaBee — track vaccine dates, due reminders and any reactions in one place (full schedule on Premium).'],
 ['mamabee-best-baby-tracker-apps-compared','45+ CDC milestones, country-specific vaccine schedules, co-parent sync','45+ CDC milestones, the first 3 months of your country\'s vaccine schedule (the full schedule is Premium), co-parent sync'],
 ['mamabee-best-baby-tracker-apps-compared','includes logging, insights, growth, milestones, vaccines, co-parent sync and export — though Sleep Coach and unlimited Bee AI are Premium','includes logging, insights, growth, milestones, co-parent sync and export — though Sleep Coach, unlimited Bee AI and the full vaccine schedule are Premium'],
 ['mamabee-best-free-baby-tracker-apps','45+ CDC milestones, vaccine schedules, co-parent sync','45+ CDC milestones, the first 3 months of vaccine schedules (full schedule on Premium), co-parent sync'],
 ['mamabee-napper-vs-mamabee','Sleep, feeds, diapers, growth, health, vaccines, milestones','Sleep, feeds, diapers, growth, health, milestones'],
 ['mamabee-napper-vs-mamabee','doctor visits, vaccines and 45+ CDC milestones.','doctor visits and 45+ CDC milestones (the full vaccine schedule is Premium).'],
 ['mamabee-napper-vs-mamabee','one place for feeds, sleep, health, vaccines and milestones, free,','one place for feeds, sleep, health and milestones, free,'],
 ['mamabee-nara-baby-vs-mamabee','doctor visits, vaccines and 45+ CDC milestones.','doctor visits and 45+ CDC milestones (the full vaccine schedule is Premium).'],
 ['mamabee-nara-baby-vs-mamabee','covers sleep, feeds, diapers, growth, health, vaccines and milestones','covers sleep, feeds, diapers, growth, health and milestones'],
 ['mamabee-sprout-baby-vs-mamabee','health, vaccines and 45+ CDC milestones.','health and 45+ CDC milestones (the full vaccine schedule is Premium).'],
 ['mamabee-well-baby-visit-schedule','The vaccine schedule shows what is due and sends due and overdue reminders','On Premium, the full vaccine schedule shows what is due and sends due and overdue reminders'],
]
const byDoc = {}
for (const f of FIXES) (byDoc[f[0]] ||= []).push(f)
for (const [id, fixes] of Object.entries(byDoc)) {
  const d = await c.getDocument(id); const hits = fixes.map(() => 0)
  const rep = (s) => { if (typeof s !== 'string') return s; fixes.forEach(([, a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); hits[i]++ } }); return s }
  for (const b of d.body) {
    if (b._type === 'block') for (const sp of b.children) sp.text = rep(sp.text)
    if (b._type === 'comparisonTable') for (const r of b.rows) r.cells = r.cells.map(rep)
    if (b._type === 'appCta') b.heading = rep(b.heading)
  }
  fixes.forEach(([, a], i) => console.log(hits[i] === 1 ? 'ok ' : `MISS(${hits[i]}) `, id, '|', a.slice(0, 60)))
  if (!DRY && hits.every((h) => h === 1)) { await c.patch(id).set({body: d.body}).commit(); console.log('  patched', id) }
}
