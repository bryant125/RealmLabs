// Uploads competitor App Store marketing screenshots to Sanity so the
// comparison articles can show them. These are each vendor's own promotional
// images from their public App Store listing, used editorially with
// attribution in the caption. Run once:
//   node scripts/upload-competitor-shots.mjs <dir>
import {createClient} from '@sanity/client'
import {createReadStream} from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
if (!dir) { console.error('Usage: node scripts/upload-competitor-shots.mjs <dir>'); process.exit(1) }
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})

const files = [
  'comp-huckleberry-sweetspot.jpg',
  'comp-huckleberry-berry-ai.jpg',
  'comp-piyolog-log.png',
  'comp-babytracker-home.png',
]

for (const f of files) {
  const existing = await client.fetch('*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id', {f})
  if (existing) { console.log(`= already uploaded: ${f}`); continue }
  const a = await client.assets.upload('image', createReadStream(path.join(dir, f)), {filename: f})
  console.log(`✅ uploaded ${f} -> ${a._id}`)
}
console.log('\nDone.')
