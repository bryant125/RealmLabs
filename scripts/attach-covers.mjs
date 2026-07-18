// Uploads generated cover images and attaches them to the matching MamaBee
// article drafts. Run: SANITY_WRITE_TOKEN=xxx node scripts/attach-covers.mjs <coversDir>
import {createClient} from '@sanity/client'
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
if (!dir) { console.error('Usage: node scripts/attach-covers.mjs <coversDir>'); process.exit(1) }
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const client = createClient({
  projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})

const slugs = [
  'newborn-sleep-schedule', 'how-much-should-a-newborn-eat', 'baby-poop-color-chart',
  '4-month-sleep-regression', 'day-with-mamabee-baby-tracker', 'wake-windows-by-age',
  'tummy-time-guide', 'newborn-gas-relief', 'cluster-feeding', '3am-question-mamabee-ai-tracker',
]

for (const slug of slugs) {
  const file = path.join(dir, `${slug}.png`)
  if (!existsSync(file)) { console.log(`- skip (no file): ${slug}`); continue }
  const asset = await client.assets.upload('image', createReadStream(file), {filename: `${slug}.png`})
  await client
    .patch(`drafts.mamabee-${slug}`)
    .set({coverImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}})
    .commit()
  console.log(`✓ cover attached: ${slug}`)
}
console.log('\nDone — covers attached to all drafts.')
