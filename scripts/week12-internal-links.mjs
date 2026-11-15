// Week-12 internal links + keyword-overlap fix, saved as Sanity DRAFTS only (never published).
//
// Part 2 — mamabee-best-free-baby-tracker-apps competed with the main page for "baby tracker".
//   Keep it on FREE: title and first paragraph lead with "free", plus one sentence linking to
//   the main page with the anchor "best baby tracker app overall". Also corrects one stale
//   line: Nighp's Baby Tracker now has an optional Plus subscription with What's Next cues
//   (US App Store, checked November 15, 2026: Remove Ads $4.99, Plus $5.99/mo or $49.99/yr).
//
// Part 3 — only 9 of 73 English MamaBee articles linked to best-baby-tracker-apps-compared.
//   Adds ONE contextual sentence to each article below, right after a paragraph that already
//   talks about tracking, logging or writing things down. Feeding articles link
//   best-breastfeeding-apps instead. Nothing else in those articles is changed.
//
// Each draft is a copy of the published doc (drafts.<same id>) with only these blocks added.
// Articles that already link to the target, non-English docs and docs that already have a
// draft are skipped.
// Run: cd /Users/admin/Github/Realmlabs/RealmLabs && set -a && source .env && set +a && DRY=1 node scripts/week12-internal-links.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
// Same inline/block helpers as scripts/week11-articles.mjs: links become {_key:'l0', _type:'link', href}.
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}

const DRY = !!process.env.DRY
const MAIN = '/mamabee/articles/best-baby-tracker-apps-compared'
const BF = '/mamabee/articles/best-breastfeeding-apps'
const textOf = (b) => (b.children || []).map((c) => c.text).join('')
const hrefsOf = (body) => body.flatMap((b) => b.markDefs || []).map((m) => m.href).filter(Boolean)

async function saveDraft(doc, patch) {
  const {_rev, _createdAt, _updatedAt, ...rest} = doc
  const draft = {...rest, ...patch, _id: 'drafts.' + doc._id}
  if (DRY) return draft._id + ' (dry)'
  const res = await client.createOrReplace(draft)
  return res._id
}

const created = []

// ==================================================================================
// Part 2: best-free-baby-tracker-apps
// ==================================================================================
{
  const id = 'mamabee-best-free-baby-tracker-apps'
  const doc = await client.getDocument(id)
  if (!doc) throw new Error('not found: ' + id)
  if (doc.language && doc.language !== 'en') throw new Error('not English: ' + id)
  if (await client.getDocument('drafts.' + id)) throw new Error('a draft already exists for ' + id + ' — not overwriting')
  const title = 'Free Baby Tracker App 2026: The Best Free Tiers Compared'
  const description = 'The best free baby tracker app for 2026: what MamaBee, PiyoLog, Baby Tracker and Huckleberry give you free, which ones show ads, and the catch in each.'
  if (title.length > 60) throw new Error('title too long ' + title.length)
  if (description.length < 140 || description.length > 155) throw new Error('description length ' + description.length)
  const body = doc.body.slice()
  const at = (key) => { const i = body.findIndex((b) => b._key === key); if (i < 0) throw new Error('block not found: ' + key); return i }
  // first paragraph: lead with "free baby tracker app"; same message as before
  const first = block('normal', 'A free baby tracker app is not always free in the way you expect. Some are free because they show you ads. Some are free but lock the useful parts behind a subscription. And a few are genuinely, usefully free. If you want the best free baby tracker app without paying, here is which free tiers are actually worth your time in 2026 — and the catch behind each.')
  first._key = 'e66718e5'
  body.splice(at('e66718e5'), 1, first)
  body.splice(at('e66718e5') + 1, 0, block('normal', `If you are open to paying, see our [best baby tracker app overall](${MAIN}) ranking.`))
  // stale fact: Baby Tracker now has an optional Plus subscription with What's Next cues
  const bt = block('normal', '227,000 ratings say a lot. The free version is complete and ad-supported; a single $4.99 purchase removes ads permanently, and no subscription is required. Fast, reliable, cross-platform (iPhone, iPad, Android). An optional Plus subscription ($5.99 a month or $49.99 a year, US App Store, November 2026) adds What\'s Next timing cues.')
  bt._key = '0f97ec1b'
  body.splice(at('0f97ec1b'), 1, bt)
  const keys = new Set(body.map((b) => b._key)); if (keys.size !== body.length) throw new Error('duplicate keys in ' + id)
  console.log('\n================ Part 2:', id)
  console.log('TITLE  before:', doc.title, `(${doc.title.length})`)
  console.log('TITLE  after: ', title, `(${title.length})`)
  console.log('DESC   before:', doc.description, `(${doc.description.length})`)
  console.log('DESC   after: ', description, `(${description.length})`)
  console.log('FIRST PARA:', textOf(body[0]))
  console.log('ADDED     :', textOf(body[1]))
  console.log('FIXED     :', textOf(body[at('0f97ec1b')]))
  console.log('blocks', doc.body.length, '->', body.length)
  created.push(await saveDraft(doc, {title, description, body}))
}

// ==================================================================================
// Part 3: one contextual link per article
// ==================================================================================
const LINKS = [
  {slug: 'newborn-sleep-schedule', after: '97fdf918', href: MAIN, anchor: 'best baby tracker apps',
    text: `MamaBee isn't the only option, and it is iPhone-only. If you would like to compare first, our ranking of the [best baby tracker apps](${MAIN}) scores eight of them on the same criteria.`},
  {slug: 'wake-windows-by-age', after: '9428a6de', href: MAIN, anchor: 'baby tracker app',
    text: `Any [baby tracker app](${MAIN}) that shows how long your baby has been awake will do this counting for you.`},
  {slug: 'how-many-wet-diapers-newborn', after: '1dc5ce8b', href: MAIN, anchor: 'compare baby tracker apps',
    text: `Most apps let two phones share one diaper count, so it is worth checking partner sync when you [compare baby tracker apps](${MAIN}).`},
  {slug: '4-month-sleep-regression', after: '8320bfdf', href: MAIN, anchor: 'a baby log app',
    text: `A notebook works, but [a baby log app](${MAIN}) puts wakings and feeds on one timeline, which is easier to read at 3 AM.`},
  {slug: 'baby-milestones-by-month', after: '5cf50208', href: MAIN, anchor: 'baby tracker app comparison',
    text: `Many baby trackers keep a milestone log next to feeds and sleep, and our [baby tracker app comparison](${MAIN}) can help you pick one.`},
  {slug: 'baby-poop-color-chart', after: 'aafedb1e', href: MAIN, anchor: 'best baby tracker apps for 2026',
    text: `Paper works fine. If you would rather tap, our roundup of the [best baby tracker apps for 2026](${MAIN}) scores each one on how quick it is to log one-handed.`},
  {slug: 'baby-weight-gain-chart', after: '67d64b7f', href: MAIN, anchor: 'ranking of baby tracker apps',
    text: `Other trackers chart growth too, including Baby Tracker and Sprout against WHO standards, and our [ranking of baby tracker apps](${MAIN}) compares them.`},
  {slug: 'exclusive-pumping-schedule', after: 'f04c7e8c', href: BF, anchor: 'best breastfeeding apps',
    text: `If you are still choosing an app for pumping and bottles, our roundup of the [best breastfeeding apps](${BF}) compares the main options.`},
  {slug: 'newborn-night-shifts', after: 'a5576a2a', href: MAIN, anchor: 'best baby tracker app',
    text: `Co-Parent Sharing needs both caregivers on iPhone. If one of you uses Android, our [best baby tracker app](${MAIN}) ranking shows which apps sync across both.`},
  {slug: 'well-baby-visit-schedule', after: '5d6dbd6a', href: MAIN, anchor: 'how the main baby tracker apps compare',
    text: `Several other trackers can also export a report for your doctor; see [how the main baby tracker apps compare](${MAIN}).`},
  {slug: 'introducing-allergens-to-baby', after: '7a0d7f09', href: MAIN, anchor: 'side-by-side baby tracker comparison',
    text: `Other apps can help too, such as Huckleberry, whose free solids log records allergens and reactions; our [side-by-side baby tracker comparison](${MAIN}) shows the differences.`},
  {slug: 'baby-growth-spurts', after: '24493d7c', href: MAIN, anchor: 'a baby tracker',
    text: `If you want to log it, [a baby tracker](${MAIN}) that counts feeds per day makes both the spike and the return to normal easy to see.`},
  {slug: 'how-much-should-a-newborn-eat', after: '7ada0d65', href: BF, anchor: 'breastfeeding app roundup',
    text: `If you want a simple way to log feeds, our [breastfeeding app roundup](${BF}) compares apps for nursing, bottles and pumping.`},
  {slug: 'baby-nap-transitions', after: 'd176b58d', href: MAIN, anchor: 'comparison of baby tracker apps',
    text: `If you track naps in an app, our [comparison of baby tracker apps](${MAIN}) notes which ones chart sleep over weeks for free.`},
  {slug: 'baby-sleep-regressions-by-age', after: '63a39c94', href: MAIN, anchor: 'baby tracker app rankings',
    text: `If you don't track sleep yet, our [baby tracker app rankings](${MAIN}) show which apps give you weekly sleep trends without paying.`},
]

// Eligible = published English MamaBee articles that don't already link to the main page.
const eligible = await client.fetch(`*[_type=="article" && brand=="mamabee" && (!defined(language)||language=="en") && !(_id in path("drafts.**"))]{_id, "slug": slug.current, language}`)
const bySlug = new Map(eligible.map((d) => [d.slug, d]))
const rows = []
for (const L of LINKS) {
  const meta = bySlug.get(L.slug)
  if (!meta) { rows.push([L.slug, 'SKIPPED: not a published English article', '']); continue }
  const doc = await client.getDocument(meta._id)
  if (doc.language && doc.language !== 'en') { rows.push([L.slug, 'SKIPPED: not English', '']); continue }
  const hrefs = hrefsOf(doc.body)
  if (hrefs.some((h) => h.includes('best-baby-tracker-apps-compared'))) { rows.push([L.slug, 'SKIPPED: already links to main page', '']); continue }
  if (hrefs.includes(L.href)) { rows.push([L.slug, 'SKIPPED: already links to ' + L.href, '']); continue }
  if (await client.getDocument('drafts.' + doc._id)) { rows.push([L.slug, 'SKIPPED: a draft already exists', '']); continue }
  const i = doc.body.findIndex((b) => b._key === L.after)
  if (i < 0) throw new Error(`${L.slug}: block ${L.after} not found`)
  const anchorBlock = doc.body[i]
  if (anchorBlock._type !== 'block' || anchorBlock.style !== 'normal' || anchorBlock.listItem) throw new Error(`${L.slug}: ${L.after} is not a plain paragraph`)
  if (!/track|log|write|record|notebook/i.test(textOf(anchorBlock))) throw new Error(`${L.slug}: anchor paragraph doesn't mention tracking`)
  const nb = block('normal', L.text)
  if ((L.text.match(/\]\(/g) || []).length !== 1) throw new Error(`${L.slug}: exactly one link expected`)
  if (!nb.markDefs.length || nb.markDefs[0].href !== L.href || !L.text.includes(`[${L.anchor}](`)) throw new Error(`${L.slug}: link/anchor mismatch`)
  const body = doc.body.slice(); body.splice(i + 1, 0, nb)
  if (new Set(body.map((b) => b._key)).size !== body.length) throw new Error(`${L.slug}: duplicate key`)
  if (body.length !== doc.body.length + 1) throw new Error(`${L.slug}: unexpected body change`)
  created.push(await saveDraft(doc, {body}))
  rows.push([L.slug, textOf(nb), L.anchor + ' → ' + L.href.split('/').pop()])
}

console.log('\n================ Part 3: internal links')
console.log('| Article | Sentence added | Anchor → target |')
console.log('|---|---|---|')
for (const r of rows) console.log(`| ${r[0]} | ${r[1]} | ${r[2]} |`)
console.log('\nDraft IDs' + (DRY ? ' (dry run, not written)' : '') + ':')
for (const c of created) console.log('  ' + c)
console.log(DRY ? '\nDry run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
