// Publish only the listed drafts (by slug, optionally lang/slug), leaving other drafts untouched.
// Run: node scripts/publish-ids.mjs en/11-month-old-schedule ja/baby-food-schedule 12-month-old-schedule
import {createClient} from '@sanity/client'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const args = process.argv.slice(2)
if (!args.length) { console.error('usage: publish-ids.mjs [lang/]slug ...'); process.exit(1) }
let n = 0
for (const a of args) {
  const [lang, slug] = a.includes('/') ? a.split('/') : ['en', a]
  const langFilter = lang === 'en' ? '(!defined(language) || language == "en")' : 'language == $lang'
  const drafts = await c.fetch(`*[_type == "article" && _id in path("drafts.**") && slug.current == $slug && ${langFilter}]`, {slug, lang})
  if (drafts.length !== 1) { console.log(`✗ ${a}: found ${drafts.length} drafts, skipped`); continue }
  const {_id, _rev, ...rest} = drafts[0]
  await c.createOrReplace({...rest, _id: _id.replace(/^drafts\./, '')})
  await c.delete(_id)
  console.log(`✓ published ${a}`); n++
}
console.log(`Done — ${n}/${args.length} published.`)
