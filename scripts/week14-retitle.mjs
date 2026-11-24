// Week 14 (2026-11-24): retarget titles/descriptions to Ahrefs keywords (US volume, KD).
// "N month old sleep schedule" has 3-5x the volume of "N month old schedule". Applied once to published docs.
import {createClient} from '@sanity/client'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const T = {
  '2-month-old-schedule': ['2 Month Old Sleep Schedule: Sample Day, Naps & Feeds', 'A 2 month old sleep schedule with a sample day: 60 to 90 minute wake windows, 4 to 6 naps, feeds every 3 to 4 hours, bedtime and when to call the doctor.'],
  '3-month-old-schedule': ['3 Month Old Sleep Schedule: Sample Day, Naps & Feeds', 'A 3 month old sleep schedule with a sample day: 4 to 5 naps, wake windows, feeding amounts and bedtime, plus short naps and moving out of the swaddle.'],
  '4-month-old-schedule': ['4 Month Old Sleep Schedule: Sample Day, Naps & Feeds', 'A 4 month old sleep schedule with 3-nap and 4-nap sample days, 90 to 120 minute wake windows, feeds and bedtime, plus the 4-month sleep regression.'],
  '5-month-old-schedule': ['5 Month Old Sleep Schedule: Sample Day, Naps & Feeds', 'A 5 month old sleep schedule with 3 naps, 2 to 2.5 hour wake windows, feeds and bedtime, plus early waking, rolling and signs of readiness for solids.'],
  '6-month-old-schedule': ['6 Month Old Sleep Schedule: Sample Day, Naps & Solids', 'A 6 month old sleep and feeding schedule: 3 naps, wake windows, milk feeds and where first solids fit, plus sleep tips and when to call the doctor.'],
  '7-month-old-schedule': ['7 Month Old Sleep Schedule: 2-Nap and 3-Nap Days', 'A 7 month old sleep schedule for 2-nap and 3-nap days, with wake windows, milk feeds and solid meals, plus separation anxiety and night waking.'],
  'baby-diaper-rash-treatment': ['Diaper Rash Treatment for Babies: How to Heal It Fast', 'Diaper rash treatment for babies: how to heal a rash fast at home, which barrier creams help, how to prevent it, and when a rash needs a doctor.'],
  '4-month-sleep-regression': ['4 Month Sleep Regression: Signs, How Long & What Helps', 'The 4 month sleep regression explained: why sleep changes at 3 to 4 months, signs, how long it lasts, and gentle steps that help your baby sleep again.'],
  'newborn-sleep-schedule': ['Newborn Sleep Schedule: Sample Day and Wake Windows', 'A newborn sleep schedule for weeks 0 to 12: how much newborns sleep, wake windows, a sample day, day-night confusion and safe-sleep basics.'],
}
for (const [s, [title, description]] of Object.entries(T)) {
  if (title.length > 60 || description.length > 158) throw new Error(`${s}: title ${title.length} desc ${description.length}`)
  if (process.env.DRY) { console.log('dry', s, title.length, description.length); continue }
  await c.patch(`mamabee-${s}`).set({title, description}).commit()
  console.log('✓', s, title.length, description.length)
}
