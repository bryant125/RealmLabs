// Week 12: make the tracker scores consistent across the four ranking drafts.
// The canonical overall scores live in best-baby-tracker-apps-compared; the hub
// reuses them, and the feeding / Huckleberry-alternatives pages label their own
// scores as feeding- or value-weighted. Drafts only. Applied 2026-11-15; do NOT
// re-run (it inserts paragraphs). Re-running a week12 article script overwrites
// its draft and loses these edits.
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const k = () => randomUUID().slice(0, 8)
const txt = (b) => b.children.map((s) => s.text).join('')
const para = (parts, extra = {}) => { const markDefs = [], children = []; for (const p of parts) { if (typeof p === 'string') children.push({_type: 'span', _key: k(), text: p, marks: []}); else { const key = 'l' + k(); markDefs.push({_key: key, _type: 'link', href: p.href}); children.push({_type: 'span', _key: k(), text: p.text, marks: [key]}) } } return {_type: 'block', _key: k(), style: 'normal', markDefs, children, ...extra} }
const MAIN = '/mamabee/articles/best-baby-tracker-apps-compared'

// Hub
const hub = await c.getDocument('drafts.mamabee-best-baby-apps')
const i6 = hub.body.findIndex((b) => b._type === 'block' && txt(b).startsWith('A tracker is the one app'))
hub.body[i6] = para(['A tracker is the one app nearly every new parent uses daily, so it is the only category we score point by point. These are the overall scores from our full ', {text: 'baby tracker app ranking', href: MAIN}, ', where each criterion is explained.'])
const t7 = hub.body.findIndex((b, i) => i > i6 && b._type === 'comparisonTable')
const rows = [
  ['Huckleberry', '8.5', 'Best overall', '$68.99/yr', 'iPhone, iPad, Apple Watch, Android'],
  ['Baby Tracker (Nighp)', '8.0', 'Best value', '$4.99 once', 'iPhone, iPad, Apple Watch, Android'],
  ['PiyoLog', '7.5', 'Best for Android families', '$34.99/yr', 'iPhone, iPad, Apple Watch, Android'],
  ['Sprout Baby', '7.25', 'Best for Apple Watch logging', '$59.99/yr', 'iPhone, iPad, Apple Watch, Android'],
  ['MamaBee (our app)', '7.0', 'Best ad-free free tier', '$49.99/yr', 'iPhone only'],
  ['Napper', '6.75', 'Best for sleep schedules', '$69.99/yr', 'iPhone, Apple Watch, Android'],
  ['Nara Baby', '6.0', 'Best for twins and big families', '$9.99/mo or $99.99 once', 'iPhone, Apple Watch, Android'],
  ['Luli', '5.75', '-', 'From $39.99/yr', 'iPhone, iPad, Android'],
]
hub.body[t7] = {_type: 'comparisonTable', _key: hub.body[t7]._key, caption: 'Overall scores out of 10 from our full baby tracker app ranking (seven fixed criteria). Prices from the US App Store, checked November 15, 2026.', headers: ['App', 'Score', 'Best for', 'Cheapest paid (US)', 'Platforms'], rows: rows.map((cells) => ({_type: 'row', _key: k(), cells}))}
const h = hub.body.findIndex((b) => b._type === 'block' && b.style === 'h2' && txt(b) === 'How we scored')
const end = hub.body.findIndex((b, i) => i > h && b._type === 'block' && txt(b).startsWith('Facts were checked on the US App Store'))
hub.body.splice(h + 1, end - h - 1, para(['Tracker scores come from our full ', {text: 'best baby tracker app', href: MAIN}, ' ranking: seven fixed criteria worth 10 points in total (free tier 2, price and value 1.5, ads 1, logging and sharing 1.5, insights and prediction 1.5, platforms 1.5, ratings and track record 1). The same rules apply to MamaBee, which scores lowest on platforms and ratings.']))

// Huckleberry alternatives
const alt = await c.getDocument('drafts.mamabee-huckleberry-alternatives')
const st = alt.body.find((b) => b._type === 'comparisonTable' && b.headers.includes('Total'))
st.caption = 'Value-weighted scores out of 10 for parents leaving Huckleberry over cost: free tier and price carry 4 of the 10 points, so they differ from the overall scores in our best baby tracker app ranking. Huckleberry is shown as the benchmark. Checked November 15, 2026.'
st.headers = st.headers.map((x) => x === 'Total' ? 'Value score' : x)
const hs = alt.body.findIndex((b) => b._type === 'block' && b.style === 'h2' && txt(b) === 'How we scored')
const fc = alt.body.findIndex((b, i) => i > hs && b._type === 'block' && txt(b).startsWith('Every fact was checked'))
alt.body.splice(fc + 1, 0, para(['These scores are weighted toward cost because this page is for people looking for something cheaper. For our general ranking, where Huckleberry scores 8.5 and Baby Tracker 8.0, see the ', {text: 'best baby tracker app', href: MAIN}, ' comparison.']))

// Breastfeeding
const bf = await c.getDocument('drafts.mamabee-best-breastfeeding-apps')
const bt = bf.body.find((b) => b._type === 'comparisonTable' && b.headers.includes('Overall'))
bt.headers = bt.headers.map((x) => x === 'Overall' ? 'Feeding score' : x)
bt.caption += ' These feeding-specific scores differ from our overall baby tracker app ranking, which also weighs sleep prediction and platforms.'
const aw = bf.body.find((b) => b._type === 'comparisonTable' && b.headers[0] === 'Award')
for (const r of aw.rows) if (r.cells[0] === 'Best overall') r.cells[0] = 'Best overall for feeding'

if (process.env.DRY) { console.log('DRY', i6, t7, h, end, hs); process.exit(0) }
for (const d of [hub, alt, bf]) { await c.createOrReplace(d); console.log('saved', d._id) }
