// Publishes all MamaBee article drafts (draft -> published). Run once.
// Run: SANITY_WRITE_TOKEN=xxx node scripts/publish-live.mjs
import {createClient} from '@sanity/client'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const drafts = await client.fetch('*[_type == "article" && _id in path("drafts.**")]')
if (!drafts.length) { console.log('No drafts to publish.'); process.exit(0) }

for (const draft of drafts) {
  const publishedId = draft._id.replace(/^drafts\./, '')
  const {_id, _rev, ...rest} = draft
  await client.createOrReplace({...rest, _id: publishedId})
  await client.delete(draft._id)
  console.log(`✓ published: ${rest.slug?.current || publishedId}`)
}
console.log(`\nDone — ${drafts.length} articles published.`)
