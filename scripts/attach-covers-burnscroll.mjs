// Attach every <slug>.png in a folder to draft (or published) burnscroll-<slug>.
// Run: node scripts/attach-covers-burnscroll.mjs <coversDir>
import {createClient} from '@sanity/client'
import {createReadStream, readdirSync} from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
if (!dir) { console.error('Usage: node scripts/attach-covers-burnscroll.mjs <coversDir>'); process.exit(1) }
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})

const files = readdirSync(dir).filter((f) => f.endsWith('.png'))
for (const file of files) {
  const slug = file.replace(/\.png$/, '')
  const asset = await client.assets.upload('image', createReadStream(path.join(dir, file)), {filename: `bs-${file}`})
  const cover = {coverImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}}
  const draftId = `drafts.burnscroll-${slug}`, pubId = `burnscroll-${slug}`
  const exists = await client.getDocument(draftId).catch(() => null)
  await client.patch(exists ? draftId : pubId).set(cover).commit()
  console.log(`✓ cover attached: ${slug} (${exists ? 'draft' : 'published'})`)
}
console.log(`\nDone — ${files.length} covers attached.`)
