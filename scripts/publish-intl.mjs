// Publishes ONLY localized MamaBee drafts (language set, not English).
// Run: SANITY_WRITE_TOKEN=xxx node scripts/publish-intl.mjs [lang ...]   (dry run: --dry)
import {createClient} from '@sanity/client'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const args = process.argv.slice(2), dry = args.includes('--dry'), langs = args.filter((a) => !a.startsWith('--'))
const drafts = await client.fetch(
  `*[_type == "article" && brand == "mamabee" && _id in path("drafts.**") && defined(language) && language != "en" ${langs.length ? '&& language in $langs' : ''}]`,
  {langs})
for (const d of drafts) {
  const pubId = d._id.replace(/^drafts\./, '')
  if (!pubId.startsWith(`mamabee-${d.language}-`)) { console.log('skip (unexpected id):', d._id); continue }
  if (!d.coverImage) { console.log('skip (no cover):', d._id); continue }
  if (dry) { console.log('would publish:', pubId); continue }
  const {_id, _rev, ...rest} = d
  await client.createOrReplace({...rest, _id: pubId})
  await client.delete(d._id)
  console.log(`✓ published: /mamabee/${d.language}/articles/${d.slug.current}`)
}
console.log(`\n${drafts.length} localized drafts ${dry ? 'checked' : 'processed'}.`)
