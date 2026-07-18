// Phone screenshots were inserted right BEFORE a heading, leaving no text to sit
// beside them (empty column). Move each phone image to just AFTER the heading
// that follows it, so it pairs with that section's paragraphs (two-column row).
// Run: SANITY_WRITE_TOKEN=xxx node scripts/reposition-screenshots.mjs [--dry]
import {createClient} from '@sanity/client'
const DRY = process.argv.includes('--dry')
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})

const SLUGS = ['3am-question-mamabee-ai-tracker', 'day-with-mamabee-baby-tracker', 'wake-windows-by-age', 'when-to-start-solids']
const isHeading = (b) => b?._type === 'block' && (b.style === 'h2' || b.style === 'h3')

for (const slug of SLUGS) {
  const id = 'mamabee-' + slug
  const doc = await client.getDocument(id)
  if (!doc) { console.log(`✗ ${slug}: not found`); continue }
  const body = doc.body
  const out = []
  let held = null
  let moved = 0
  for (let i = 0; i < body.length; i++) {
    const b = body[i], next = body[i + 1]
    if (b._type === 'image' && b.phone && isHeading(next)) { held = b; moved++; continue }
    out.push(b)
    if (held && isHeading(b)) { out.push(held); held = null }
  }
  if (held) out.push(held)
  console.log(`${slug}: moved ${moved} screenshot(s), ${body.length} → ${out.length} blocks`)
  if (!DRY && moved) { await client.patch(id).set({body: out}).commit(); console.log('  ✓ patched') }
}
console.log(DRY ? '\nDRY RUN — nothing written.' : '\nDone.')
