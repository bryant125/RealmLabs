// Promotes the Week-4 drafts to published in Sanity.
// Publishing = copy drafts.<id> -> <id>, then remove the draft, in one
// transaction per doc. Re-runnable: skips anything with no draft left.
import {createClient} from '@sanity/client'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const slugs = [
  'best-baby-tracker-apps-compared',
  'mamabee-vs-piyolog',
  'mamabee-vs-baby-tracker',
  'baby-sleep-training-methods',
  'breastfeeding-vs-formula',
  'postpartum-recovery-mental-health',
]

let published = 0
for (const slug of slugs) {
  const draftId = `drafts.mamabee-${slug}`
  const pubId = `mamabee-${slug}`
  const draft = await client.getDocument(draftId).catch(() => null)
  if (!draft) { console.log(`= no draft (already published?): ${slug}`); continue }
  if (!draft.coverImage) { console.error(`✗ SKIPPED ${slug} — no cover image`); continue }
  const {_id, _rev, _createdAt, _updatedAt, ...rest} = draft
  await client.transaction()
    .createOrReplace({...rest, _id: pubId})
    .delete(draftId)
    .commit()
  console.log(`✅ published: ${slug}`)
  published++
}
console.log(`\n${published} article(s) published. The live site rebuilds on the next deploy.`)
