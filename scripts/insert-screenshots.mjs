// Uploads app screenshots and inserts them (phone-framed, captioned) into the
// published app articles. Run: SANITY_WRITE_TOKEN=xxx node scripts/insert-screenshots.mjs <screensDir>
import {createClient} from '@sanity/client'
import {createReadStream} from 'node:fs'
import path from 'node:path'
import {randomUUID} from 'node:crypto'

const dir = process.argv[2]
if (!dir) { console.error('Usage: node scripts/insert-screenshots.mjs <screensDir>'); process.exit(1) }
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
const k = () => randomUUID().slice(0, 8)

// upload each screenshot once, keep asset id by name
const names = ['home-timeline', 'log-formula', 'sleep-coach', 'bee-ai']
const assets = {}
for (const n of names) {
  const a = await client.assets.upload('image', createReadStream(path.join(dir, `${n}.png`)), {filename: `${n}.png`})
  assets[n] = a._id
  console.log(`uploaded ${n}`)
}

const imgBlock = (name, caption, alt) => ({
  _type: 'image', _key: k(), phone: true, caption, alt,
  asset: {_type: 'reference', _ref: assets[name]},
})

// insertions: place image at the END of the section whose H2 contains `after`
const inserts = [
  {slug: 'day-with-mamabee-baby-tracker', after: 'Morning: one thumb', img: () => imgBlock('log-formula', 'Logging a feed is one tap — pick the amount and time, add a photo if you like, done. MamaBee even handles more than one baby.', 'MamaBee formula logging screen')},
  {slug: 'day-with-mamabee-baby-tracker', after: 'Midday: it does the remembering', img: () => imgBlock('home-timeline', "Your baby's whole day on one screen — every feed, nap, diaper and solid — with the one-thumb quick-log bar along the bottom.", 'MamaBee home timeline')},
  {slug: 'day-with-mamabee-baby-tracker', after: 'The pattern I never would', img: () => imgBlock('bee-ai', 'Ask Bee AI anything. It answers using your baby’s own data — like whether they’re sleeping enough — in plain, reassuring language.', 'MamaBee Bee AI chat')},
  {slug: '3am-question-mamabee-ai-tracker', after: 'Gentle AI insights', img: () => imgBlock('sleep-coach', "The Sleep Coach predicts your baby's next nap from their wake windows — and warns you when they're drifting into an overtired window.", 'MamaBee Sleep Coach nap prediction')},
  {slug: '3am-question-mamabee-ai-tracker', after: 'The feature that changed my nights', img: () => imgBlock('bee-ai', 'Bee AI turns your logs into one calm, personalized answer — insight, not a wall of charts.', 'MamaBee Bee AI answer with chart')},
  {slug: 'wake-windows-by-age', after: 'Wake windows by age', img: () => imgBlock('sleep-coach', 'MamaBee’s Sleep Coach turns wake windows into a real next-nap prediction — no mental math required.', 'MamaBee Sleep Coach wake window prediction')},
]

for (const ins of inserts) {
  const id = `mamabee-${ins.slug}`
  const doc = await client.getDocument(id)
  if (!doc) { console.log(`- skip ${ins.slug} (not found)`); continue }
  const body = [...doc.body]
  const start = body.findIndex((b) => b._type === 'block' && b.style === 'h2' && (b.children || []).some((s) => (s.text || '').includes(ins.after)))
  if (start === -1) { console.log(`- skip ${ins.slug}: heading "${ins.after}" not found`); continue }
  // find next h2 after the heading -> insert just before it (end of section)
  let next = body.findIndex((b, i) => i > start && b._type === 'block' && b.style === 'h2')
  if (next === -1) next = body.length
  body.splice(next, 0, ins.img())
  await client.patch(id).set({body}).commit()
  console.log(`✓ inserted into ${ins.slug} after "${ins.after}"`)
}
console.log('\nDone.')
