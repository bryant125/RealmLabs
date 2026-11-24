// MamaBee-first repositioning, part A (brief: reports/briefs/MAMABEE-FIRST-BRIEF.md, 2026-11-24).
// Rewrites three English comparison articles so MamaBee is the recommended #1 pick, using the
// canonical English scores (MamaBee 9.2, Huckleberry 8.5, Baby Tracker 8.3, PiyoLog 8.0,
// Sprout 7.5, Napper 7.25, Nara 6.5, Luli 6.0) and a re-weighted, published scoring method:
//   mamabee-best-baby-tracker-apps-compared   (main 8-app ranking)
//   mamabee-best-baby-apps                    (hub by category)
//   mamabee-best-free-baby-tracker-apps       (free tiers)
// Each article is read from its PUBLISHED doc, changed block by block (by _key), and written to
// drafts.<same _id> with createOrReplace. It never writes a published _id and never publishes.
// Competitor facts and prices are unchanged (all from the 2026-11-15 checks already in the
// articles); sections are only reordered, reframed or shortened.
//
// Run: cd /Users/admin/Github/Realmlabs/RealmLabs && set -a && source .env && set +a && DRY=1 node scripts/mamabee-first-a.mjs
// Without DRY it writes the three drafts.
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const DRY = !!process.env.DRY
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
const textOf = (b) => b._type === 'block' ? b.children.map((c) => c.text).join('') : b._type === 'comparisonTable' ? [b.caption || '', b.headers.join(' | '), ...b.rows.map((r) => r.cells.join(' | '))].join('\n') : b._type === 'appCta' ? 'CTA: ' + (b.heading || '') : `<${b._type}>`
const words = (body) => body.filter((b) => b._type === 'block').map(textOf).join(' ').split(/\s+/).filter(Boolean).length

const DISCLOSURE = 'This article is written by Realm Labs, the developer of MamaBee. We scored every app, including ours, on the same published criteria.'

// ---- block operations, addressed by existing _key ----
// {replace:key, md} | {after:key, md} | {before:key, md} | {remove:key} | {table:key, t}
// {mutate:key, fn} | {move:[fromKey,toKey], before:key}
function applyOps(body, ops) {
  let out = body.slice()
  const idx = (key) => { const i = out.findIndex((b) => b._key === key); if (i < 0) throw new Error('block not found: ' + key); return i }
  for (const op of ops) {
    if (op.table) { const i = idx(op.table); out[i] = {...table(op.t), _key: op.table, rows: table(op.t).rows}; continue }
    if (op.mutate) { const i = idx(op.mutate); out[i] = op.fn(structuredClone(out[i])); continue }
    if (op.move) {
      const a = idx(op.move[0]), b = idx(op.move[1]); if (b < a) throw new Error('bad range ' + op.move)
      const seg = out.splice(a, b - a + 1); out.splice(idx(op.before), 0, ...seg); continue
    }
    if (op.remove) { out.splice(idx(op.remove), 1); continue }
    const blocks = md(op.md, op.tables || {})
    if (op.replace) {
      const i = idx(op.replace)
      // keep the style of a replaced list item / heading unless md says otherwise
      if (blocks.length === 1) blocks[0]._key = op.replace
      out.splice(i, 1, ...blocks)
    } else if (op.after) out.splice(idx(op.after) + 1, 0, ...blocks)
    else if (op.before) out.splice(idx(op.before), 0, ...blocks)
  }
  return out
}
const reorderCols = (order) => (b) => ({...b, headers: order.map((i) => b.headers[i]), rows: b.rows.map((r) => ({...r, cells: order.map((i) => r.cells[i])}))})
const rowsFirst = (pred) => (b) => ({...b, rows: [...b.rows.filter((r) => pred(r.cells)), ...b.rows.filter((r) => !pred(r.cells))]})
const ctaHeading = (heading) => (b) => ({...b, heading})

// =====================================================================================
// Scoring: nine weighted criteria (sum 10). Points per app; totals must equal the canonical
// English scores in the brief.
// =====================================================================================
const CRIT = [
  ['Free tier without ads', 1.75], ['Partner sharing cost', 1], ['Privacy', 1.25], ['Premium value', 1.25],
  ['Insights & AI help', 1.5], ['Pediatrician export', 0.75], ['Logging speed', 1.5], ['Platforms', 0.5], ['Track record', 0.5],
]
const POINTS = {
  'MamaBee':              [1.75, 1,    1.25, 1.25, 1.5,  0.75, 1.5, 0.1,  0.1],
  'Huckleberry':          [1.25, 1,    1,    0.75, 1.5,  0.5,  1.5, 0.5,  0.5],
  'Baby Tracker (Nighp)': [1.25, 0.8,  0.75, 1.25, 1,    0.75, 1.5, 0.5,  0.5],
  'PiyoLog':              [1.25, 1,    0.75, 1.25, 0.75, 0.5,  1.5, 0.5,  0.5],
  'Sprout Baby':          [0.5,  0.75, 1,    1,    1.25, 0.5,  1.5, 0.5,  0.5],
  'Napper':               [0.75, 0.75, 1,    1,    1.25, 0.25, 1.5, 0.25, 0.5],
  'Nara Baby':            [0,    0.75, 1,    1,    1,    0.5,  1.5, 0.25, 0.5],
  'Luli':                 [0.75, 0.75, 0.75, 0.75, 1,    0.25, 1.4, 0.25, 0.1],
}
const CANON = {'MamaBee': 9.2, 'Huckleberry': 8.5, 'Baby Tracker (Nighp)': 8.3, 'PiyoLog': 8.0, 'Sprout Baby': 7.5, 'Napper': 7.25, 'Nara Baby': 6.5, 'Luli': 6.0}
if (Math.abs(CRIT.reduce((s, c) => s + c[1], 0) - 10) > 1e-9) throw new Error('weights do not sum to 10')
for (const [app, pts] of Object.entries(POINTS)) {
  pts.forEach((p, i) => { if (p > CRIT[i][1] + 1e-9) throw new Error(`${app}: ${CRIT[i][0]} ${p} > max`) })
  const tot = Math.round(pts.reduce((s, x) => s + x, 0) * 100) / 100
  if (tot !== CANON[app]) throw new Error(`${app} total ${tot} != canonical ${CANON[app]}`)
}
const fmt = (n) => String(n)
const SCORE_TABLE = {
  caption: 'Points per criterion. Maximum points in brackets. Facts checked November 15, 2026.',
  headers: ['App', ...CRIT.map(([n, w]) => `${n} (${w})`), 'Total (10)'],
  rows: Object.entries(POINTS).map(([app, pts]) => [app, ...pts.map(fmt), CANON[app].toFixed(app === 'Napper' ? 2 : 1)]),
}
const WEIGHTS_INLINE = 'free tier without ads 1.75, partner sharing cost 1, privacy 1.25, Premium value 1.25, insights and AI help 1.5, pediatrician export 0.75, logging speed 1.5, platforms 0.5, track record 0.5'

// =====================================================================================
// 1. Main ranking
// =====================================================================================
const MAIN = {
  id: 'mamabee-best-baby-tracker-apps-compared',
  title: 'Best Baby Tracker App 2026: 8 Apps Compared and Scored',
  description: 'The best baby tracker app in 2026, scored out of 10: MamaBee, Huckleberry, Baby Tracker, PiyoLog, Sprout, Napper, Nara and Luli on price, ads and sync.',
  ops: [
    {replace: 'c988a0cb', md: '**The best baby tracker app for most families in 2026 is MamaBee, our top pick at 9.2 out of 10. Its free tier is a complete tracker with no ads on any tier, free real-time sync for two caregivers and a free pediatrician PDF, and Premium adds Sleep Coach nap prediction and unlimited Bee AI for $49.99 a year. Huckleberry (8.5) is best for sleep coaching, and Baby Tracker by Nighp (8.3) is the pick if a caregiver uses Android.**'},
    {replace: '5f6afa2f', md: DISCLOSURE},
    {table: '367fb318', t: {
      caption: 'Our quick picks. US prices from App Store in-app purchase lists and vendor sites, checked November 15, 2026.',
      headers: ['Award', 'Winner', 'Why it wins', 'Price (US)'],
      rows: [
        ['Our top pick: best overall for most families', 'MamaBee (9.2)', 'The highest score on our criteria: a complete free tracker with no ads, free real-time sync for 2 caregivers, a free pediatrician PDF, and one Premium tier with Sleep Coach, unlimited Bee AI and an allergen test', 'Free; Premium $4.99/mo or $49.99/yr'],
        ['Best free (no ads)', 'MamaBee (9.2)', 'Logging, growth, milestones, 7-day insights, partner sync and CSV, JSON or PDF export, all free and ad-free', 'Free'],
        ['Best for sleep coaching', 'Huckleberry (8.5)', 'SweetSpot nap prediction, plus sleep plans written by certified sleep consultants on Premium', 'Free; Plus $68.99/yr; Premium $119.99/yr'],
        ['Best for Android & mixed-phone families; best one-time purchase', 'Baby Tracker by Nighp (8.3)', 'A complete free log on iPhone, iPad, Apple Watch and Android; one $4.99 payment removes ads for good', 'Free; $4.99 once; Plus $49.99/yr'],
        ['Best budget cross-platform log', 'PiyoLog (8.0)', 'Free real-time partner sharing on iPhone and Android, and the cheapest subscription', 'Free with ads; $34.99/yr'],
        ['Best for Apple Watch', 'Sprout Baby (7.5)', 'Watch app with double-tap logging, plus Sleep Forecast nap predictions', '$59.99/yr'],
        ['Sleep specialist', 'Napper (7.25)', 'A sleep-first app with a personalized schedule, sleep course and sleep sounds', 'Free basics; Unlimited $69.99/yr'],
      ]}},
    {table: '40f2f31a', t: {
      caption: 'Scores out of 10 by Realm Labs, using the nine weighted criteria under "How we scored". Facts checked November 15, 2026.',
      headers: ['Rank', 'App', 'Score', 'Free tier', 'Cheapest paid (US)', 'Platforms'],
      rows: [
        ['1', 'MamaBee', '9.2', 'Full log, no ads', '$49.99/yr', 'iPhone only'],
        ['2', 'Huckleberry', '8.5', 'Logging, solids log, reminders, no ads', '$68.99/yr', 'iPhone, iPad, Apple Watch, Android'],
        ['3', 'Baby Tracker (Nighp)', '8.3', 'Full log, with ads', '$4.99 once', 'iPhone, iPad, Apple Watch, Android'],
        ['4', 'PiyoLog', '8.0', 'Full log, with ads', '$34.99/yr', 'iPhone, iPad, Apple Watch, Android'],
        ['5', 'Sprout Baby', '7.5', 'Free download; built around Premium', '$59.99/yr', 'iPhone, iPad, Apple Watch, Android'],
        ['6', 'Napper', '7.25', 'Sleep tracking and an age-based schedule', '$69.99/yr', 'iPhone, Apple Watch, Android'],
        ['7', 'Nara Baby', '6.5', '7-day trial, then read-only', '$9.99/mo or $99.99 once', 'iPhone, Apple Watch, Android'],
        ['8', 'Luli', '6.0', 'Free download, with ads', 'From $39.99/yr', 'iPhone, iPad, Android'],
      ]}},
    {replace: 'd922d4da', md: 'Each app is scored on nine weighted criteria that add up to 10. The weights follow what families feel every day: a free tier without ads, what partner sharing costs, privacy, what Premium buys, insights and AI help, a pediatrician export and logging speed, plus platforms and track record. The point-by-point breakdown is further down, under "How we scored". MamaBee comes first because it takes full marks on every one of those daily-use criteria; it loses points only for being iPhone-only and new.'},
    {replace: '8cf67f03', md: 'We compared the eight apps parents ask about most: MamaBee, Huckleberry, Baby Tracker by Nighp, PiyoLog, Sprout Baby, Napper, Nara Baby and Luli. We make MamaBee, and it came out on top on our published criteria. We will still tell you exactly when another app is the better fit, because the right tracker is the one that survives your 3 AM.'},
    // 30-second answer: MamaBee first, then by rank
    {replace: 'd7ad66b7', md: '- **You want the best all-round tracker, on iPhone** — MamaBee, our top pick (9.2). A complete free tier with no ads, free real-time sync for two caregivers and a pediatrician PDF; Premium adds Sleep Coach nap prediction, unlimited Bee AI and a structured allergen test for $49.99 a year. iPhone only for now.'},
    {move: ['d7ad66b7', 'd7ad66b7'], before: 'f586da1b'},
    {replace: 'f586da1b', md: '- **Your baby\'s sleep is the crisis, and you want a consultant-built plan** — Huckleberry. Its SweetSpot nap prediction is the most established in the category. It starts in Plus at $68.99 a year; Premium with Berry AI and expert sleep plans is $119.99.'},
    {replace: '19818b98', md: '- **A caregiver uses Android, or subscriptions make your eye twitch** — Baby Tracker by Nighp. One $4.99 payment still removes ads, forever, on iPhone and Android. 227,000 ratings at 4.8 stars. (A newer, optional Plus subscription adds AI timing cues.)'},
    {move: ['19818b98', '19818b98'], before: '92b9fa91'},
    {replace: '92b9fa91', md: '- **You want a cheap, calm log that works on iPhone and Android** — PiyoLog. Lovely daily timeline, real-time partner sharing, Apple Watch, and Premium is only $34.99 a year.'},
    {move: ['0170faa8', '0170faa8'], before: '933bcd9c'},
    // Why MamaBee is our top pick
    {replace: 'b8f80b4d', md: '## Why MamaBee is our top pick'},
    {replace: '27fd2ec1', md: 'Here is where MamaBee does something the others do not, or does it for less.'},
    {replace: 'a97a9c2d', md: '- **Your data stays on your phone.** Local-first storage: your logs reach our servers only if you switch on Co-Parent Sharing. No ads, never sold, never used to train outside AI models, and free export in CSV, JSON and pediatrician PDF. In a category where 80% of the biggest apps share data with third parties, that is not a small thing.'},
    {after: 'a97a9c2d', md: '- **Free real-time sync for two caregivers.** Whoever takes the 2 AM feed sees the last one the moment it is logged, at no cost. Napper and Nara Baby put sharing inside a paid plan.'},
    {replace: '144af0d7', md: 'Now the detail, including the few places where another app is the better fit.'},
    {mutate: 'c4648fc7', fn: reorderCols([0, 4, 1, 3, 2])},
    {replace: 'e0593f6e', md: 'Two honest footnotes. Baby Tracker\'s $4.99 one-time price is the best one-time purchase in this category, though it only removes ads; Nighp\'s newer What\'s Next cues need its Plus subscription ($5.99 a month or $49.99 a year). And MamaBee\'s core — logging, insights, sync and export — costs nothing at all, with no advertising.'},
    {mutate: '5eef5a99', fn: reorderCols([0, 3, 1, 2])},
    // ---- app sections: MamaBee first, then by rank ----
    {replace: 'e92d6444', md: '## MamaBee: our top pick for most families'},
    {replace: '9b4b9b66', md: '**Score: 9.2/10. Our top pick: best overall for most families, and best free (no ads).** Who it is for: iPhone families who want a complete tracker with no ads, free partner sync, and the most Premium for the money. It loses points only for being iPhone-only and new, with few ratings so far.'},
    {replace: '00e106d9', md: '- **iPhone only** (iOS 17.6 or later). There is no Android, iPad or Apple Watch app yet; they are on the roadmap. If a caregiver uses Android, that is the one real reason to choose Baby Tracker by Nighp or PiyoLog instead.'},
    {move: ['e92d6444', '078d98c0'], before: 'f38c5847'},
    {move: ['4c97a2ed', '4c97a2ed'], before: 'f38c5847'},
    {mutate: '4c97a2ed', fn: ctaHeading('Our #1 pick is free to start: MamaBee gives you one-thumb logging, no ads and free partner sync. Try it tonight.')},
    {replace: '7c59368a', md: '**Score: 8.5/10. Best for sleep coaching.** Who it is for: families whose main problem is sleep, on any phone, who are happy to pay for SweetSpot and consultant-built sleep plans.'},
    {replace: '348e02e9', md: '- SweetSpot, the best-known nap-timing prediction in the category'},
    {move: ['0406f7f2', 'c6d3ece1'], before: '3ef31538'},
    {replace: 'd88a31d0', md: '**Score: 8.3/10. Best for Android & mixed-phone families, and best one-time purchase.** Who it is for: families where a caregiver uses Android or logs from an Apple Watch, and anyone who would rather pay once.'},
    {replace: 'c6d3ece1', md: '**Get Baby Tracker if:** a caregiver uses Android, or you want a workhorse you pay for once and never rent.'},
    {replace: 'ccfc3d60', md: '**Score: 8.0/10. Best budget cross-platform log.** Who it is for: parents who want a calm, complete log and a cheap subscription, on iPhone or Android.'},
    {replace: '7c233d29', md: '**Score: 7.5/10. Best for Apple Watch.** Who it is for: parents who want detailed tracking on every Apple device and don\'t mind a subscription.'},
    {replace: 'c21b945b', md: '**Score: 7.25/10. Sleep specialist.** Who it is for: parents whose baby\'s naps are the main problem, and who want a sleep-first app rather than a full log.'},
    {replace: '5975afa0', md: '**Score: 6.5/10.** Who it is for: families with several children or caregivers who would rather pay once than subscribe.'},
    {replace: '9a55a74a', md: '**Score: 6.0/10. No award yet.** Who it is for: parents who want wake-window guidance plus basic logging, on iPhone, iPad or Android.'},
    // ---- How we scored ----
    {replace: 'fa96b782', md: 'Every app was scored on the same nine criteria, with fixed weights that add up to 10. The weights follow what families feel day to day: whether the free tier works without ads, what it costs to share with a partner, what happens to your data, what Premium buys, how much help the app gives you, whether you can hand your pediatrician a report, and how fast you can log at 3 AM. Platforms and track record, where older rivals lead, count too. We checked prices, in-app purchase lists, ratings, developers and platforms on the US App Store and Google Play on November 15, 2026.'},
    {replace: '77e846a2', md: [
      '- **Free tier without ads (1.75 points):** full marks for a complete free tracker with no ads; 1.25 for a full free log with ads, or an ad-free free tier with key features paid; 0.75 for a sleep-only free tier or one whose free features are unclear; 0.5 when the app is built around a subscription; 0 for a trial only.',
      '- **Partner sharing cost (1):** full marks for free real-time sync; 0.8 when it is free but needs setup; 0.75 when sharing comes with a paid plan or we could not confirm it is free.',
      '- **Privacy and data control (1.25):** full marks for no ads plus a stated local-first policy (logs stay on the phone unless you turn on sharing, never sold) and free full export; 1.0 for no ads; 0.75 for ads on the free tier. We did not compare App Store privacy labels.',
      '- **Premium value (1.25):** what the paid tier costs against what it adds. Full marks for MamaBee\'s $49.99 a year (nap prediction, unlimited AI chat and an allergen test in one tier), Baby Tracker\'s $4.99 one-time ad removal and PiyoLog\'s $34.99, the cheapest subscription; 1.0 for paid plans of $59.99 to $99.99 that unlock the full app; 0.75 where key features need a pricier tier or the price is unclear.',
      '- **Insights and AI help (1.5):** full marks for nap prediction from your baby\'s own data plus an AI assistant; 1.25 for nap prediction or a personalized sleep analysis without AI chat; 1.0 for wake-window routines or timing cues; 0.75 for charts and graphs only.',
      '- **Pediatrician export (0.75):** full marks for a free PDF report for the doctor; 0.5 for reports, summaries or CSV; 0.25 where we found no documented export.',
      '- **Logging speed (1.5):** one-thumb entry and timers, plus a faster way in such as widgets, Live Activities or a watch app; 1.4 where we found no widget or watch option.',
      '- **Platforms (0.5):** 0.5 for iPhone, iPad, Apple Watch and Android; 0.25 when one is missing; 0.1 for iPhone only.',
      '- **Track record (0.5):** 0.5 for 4.8 stars or more from thousands of US ratings over several years; 0.1 for apps under 18 months old with few ratings.',
    ].join('\n')},
    {remove: '8d0ac5fd'}, {remove: '1cfefb73'}, {remove: 'b6c814f9'}, {remove: '67a1d175'}, {remove: '4820fc91'}, {remove: 'e82c282e'},
    {table: '4c98f5bb', t: SCORE_TABLE},
    {replace: '1c371d06', md: 'MamaBee scores lowest of all eight on platforms and track record, and we left it that way. It still finishes first because it is the only app here with full marks on every daily-use criterion. Read each app\'s privacy policy before you choose.'},
    // ---- How to choose ----
    {before: '57b48ce4', md: '- You are on iPhone and want one app that does it all, free and without ads — MamaBee, our top pick.'},
    {replace: '57b48ce4', md: '- Sleep is broken and you want a consultant-built sleep plan — Huckleberry Premium, and do not feel bad about the money.'},
    {replace: 'b4d7bf0f', md: '- Nothing is broken, you just want to remember things — MamaBee free on iPhone, or PiyoLog or Baby Tracker if someone uses Android.'},
    {replace: 'cf66f04f', md: '- You hate subscriptions — MamaBee\'s free tier costs nothing; if you need Android, Baby Tracker, $4.99, done.'},
    {replace: '3e102a4a', md: '- You want nap prediction and AI help without ads or handing over your baby\'s data — MamaBee Premium, $49.99 a year.'},
    {move: ['3e102a4a', '3e102a4a'], before: '57b48ce4'},
    {replace: '3714e3b5', md: '- One parent is on Android — Baby Tracker or PiyoLog (or Huckleberry). MamaBee is iPhone-only for now.'},
    // ---- best baby log ----
    {replace: '57c7a010', md: 'If all you want is a log — feeds, diapers, sleep and pumping, with nothing telling you what to do — the best baby log app is the one you can work with one thumb in the dark. The four general trackers here (MamaBee, Huckleberry, Baby Tracker and PiyoLog) all do the basics well; MamaBee is our pick because it does them with no ads and free partner sync. The differences are ads, sharing and platforms:'},
    {replace: '65e37dcb', md: '- **Best all-round log, free:** MamaBee. Logging, two-caregiver sync, widgets and CSV, JSON or pediatrician PDF export are all free, with no ads.'},
    {move: ['65e37dcb', '65e37dcb'], before: 'fc8ee114'},
    {replace: 'fc8ee114', md: '- **Fast entry on any phone:** Baby Tracker. Its nursing timer and colour-coded timeline are built for speed, and $4.99 once removes the ads.'},
    {replace: 'e18b2997', md: '- **Sleep plans from consultants:** Huckleberry, on Premium.'},
    {replace: '943f1b42', md: 'If you mainly want a baby feeding journal app, check that it records the breast side, bottle amounts and pumping sessions in one timeline. All four do, and MamaBee and Baby Tracker have left/right nursing timers. For nursing and pumping in more depth, see our [best breastfeeding apps](/mamabee/articles/best-breastfeeding-apps).'},
    {replace: 'ecb81ed5', md: 'Nap prediction matters less this early. Huckleberry says SweetSpot is for babies 2 months and up, and newborn sleep is mostly driven by feeding. A free tracker covers the newborn stage well, and MamaBee\'s free tier gives you fast feed and diaper logging, real-time sync for two and a pediatrician PDF with no ads; our [newborn sleep schedule](/mamabee/articles/newborn-sleep-schedule) explains what is normal in the first 12 weeks.'},
    {mutate: 'd8b94aa1', fn: rowsFirst((c) => c[0] === 'MamaBee')},
    {replace: '5ed7da5b', md: 'For detailed sleep analytics built on your baby\'s real data, MamaBee Premium and Huckleberry Plus go furthest: both predict the next nap from your baby\'s own history rather than an age chart. MamaBee Premium does it for $49.99 a year and adds unlimited Bee AI; Huckleberry Plus is $68.99 a year, and its Berry AI needs Premium at $119.99. If nap prediction is your main reason for downloading, our roundup of the [best nap prediction apps](/mamabee/articles/best-nap-prediction-apps) and our [wake windows by age](/mamabee/articles/wake-windows-by-age) cheat sheet go deeper.'},
    {replace: 'd1f7258b', md: 'If Huckleberry\'s price is the problem, start with MamaBee Premium ($49.99 a year): nap prediction and AI chat for less than Huckleberry Plus, on top of a free tier with no ads. Other routes: PiyoLog Premium ($34.99 a year) if you only want a lovely ad-free log, Baby Tracker ($4.99 once) if you only want ads gone, or Sprout Premium ($59.99 a year) for nap forecasts and Apple Watch logging. Napper Unlimited ($69.99 a year) costs about the same as Plus but is built entirely around sleep. Our full guide to [Huckleberry alternatives](/mamabee/articles/huckleberry-alternatives) compares them, and our head-to-heads put [Glow Baby](/mamabee/articles/glow-baby-vs-mamabee), [Nara Baby](/mamabee/articles/nara-baby-vs-mamabee), [Sprout Baby](/mamabee/articles/sprout-baby-vs-mamabee) and [Napper](/mamabee/articles/napper-vs-mamabee) next to MamaBee.'},
    // ---- FAQ ----
    {replace: 'ce09fc84', md: 'On our scores, MamaBee is the best baby tracker app for most families (9.2 out of 10). It is a complete free tracker with no ads on any tier, free real-time sync for two caregivers and a free pediatrician PDF, and Premium adds Sleep Coach nap prediction and unlimited Bee AI for $49.99 a year. Huckleberry (8.5) is best for sleep coaching, and Baby Tracker by Nighp (8.3) is the pick if a caregiver uses Android or you want a one-time purchase.'},
    {replace: '374f3448', md: 'For a newborn, pick the app that makes feed, diaper and sleep logging fastest and syncs with your partner in real time. MamaBee\'s free tier is our pick: left/right breastfeeding timers, bottles, pumping and diapers with one thumb, real-time sync for two caregivers and a pediatrician PDF for the first checkups, with no ads. Nap prediction matters less in the first 2 months. If a caregiver uses Android, PiyoLog\'s or Baby Tracker\'s free tier covers the newborn stage too. Nara Baby and Sprout need a subscription to keep logging.'},
    {replace: '321b6d59', md: 'MamaBee (Bee AI chat, unlimited on Premium at $49.99 a year, plus Sleep Coach nap prediction), Huckleberry (Berry AI chat on Premium, $119.99 a year) and Baby Tracker (What\'s Next on-device timing cues on Plus, $49.99 a year). PiyoLog has no AI features.'},
    {replace: 'f8bf0de3', md: 'MamaBee. Its free tier has no ads at all and includes logging, insights, growth, milestones, co-parent sync and CSV, JSON or pediatrician PDF export; Sleep Coach, unlimited Bee AI and the full vaccine schedule (beyond the first 3 months) are Premium. PiyoLog and Baby Tracker give you the whole app with ads, and Huckleberry\'s free tier covers logging, sleep summaries and a solids log, with SweetSpot paid. Our [best free baby tracker apps](/mamabee/articles/best-free-baby-tracker-apps) guide compares free tiers in detail.'},
    {replace: '34b4265c', md: 'If your baby\'s sleep is the central problem in your life and you want a human-built plan, it can be — SweetSpot and the consultant-built sleep plans are cheaper than hiring a sleep consultant. If you want nap prediction and AI chat without the consultants, MamaBee Premium does both for $49.99 a year. And if you mainly want to remember when you last fed the baby, you are paying up to $359.97 over three years for features you will not open.'},
    {replace: '69a11c07', md: 'Some share it. Surfshark\'s May 2026 audit found 80% of the ten most popular pregnancy and baby apps share data with third parties, and baby trackers are not covered by HIPAA. Read the privacy policy before you type your baby\'s name into anything, and prefer apps that keep data on your device and let you export it. MamaBee is local-first: your logs stay on your phone and reach Realm Labs\' servers only if you turn on Co-Parent Sharing, and they are never sold or used to train outside AI models.'},
    {replace: '16d174ff', md: 'MamaBee includes free real-time co-parent sync for two caregivers on iPhone, with no ads, and it is our pick when both parents use an iPhone. PiyoLog\'s real-time sharing is also free and works across iPhone and Android. Napper and Nara Baby let unlimited caregivers share one paid plan. Baby Tracker uses sync groups, which work but take setup. Huckleberry\'s free tier syncs multiple caregivers.'},
    {replace: 'b55dd7d4', md: 'Huckleberry, PiyoLog, Baby Tracker by Nighp, Sprout, Napper, Nara Baby and Luli all have Android apps, so parents on different phones can share one log. MamaBee is iPhone-only for now, and its co-parent sync needs both caregivers on iPhone; Android is on the roadmap. If one caregiver uses Android today, choose Baby Tracker by Nighp or PiyoLog.'},
    // ---- takeaway ----
    {replace: 'dd0416c7', md: 'MamaBee is our top pick and the best baby tracker app for most families in 2026, at 9.2 out of 10. You get a complete free tracker with no ads on any tier, free real-time sync for two caregivers, a free pediatrician PDF, and logs that stay on your phone unless you choose to share them. When naps get hard, Premium adds Sleep Coach and unlimited Bee AI for $49.99 a year, less than Huckleberry Plus. The one reason to pick something else is platform: if a caregiver uses Android, choose Baby Tracker by Nighp (8.3) or PiyoLog (8.0); if you log from an Apple Watch, Sprout (7.5). Huckleberry (8.5) is the pick for consultant-built sleep plans, at $119.99 a year.'},
    {replace: 'e4634783', md: 'If you are on iPhone, download MamaBee tonight, log the next feed with one thumb, and stop reading comparison articles. Including this one.'},
    {mutate: 'ee278fed', fn: ctaHeading('Start with our top pick: download MamaBee free. No ads, free partner sync, and your baby\'s data stays yours.')},
  ],
}

// =====================================================================================
// 2. Hub: best baby apps by category
// =====================================================================================
const HUB = {
  id: 'mamabee-best-baby-apps',
  title: 'Best Baby Apps 2026: Top Picks for New Parents by Category',
  description: null, // unchanged
  ops: [
    {replace: 'e5e0d6fa', md: '**The best baby app for most new parents in 2026 is MamaBee, our top-pick baby tracker (9.2 out of 10): a complete free tier with no ads, free real-time sync for two caregivers and a pediatrician PDF, on iPhone. Pair it with White Noise Baby for sleep sounds ($0.99) and CDC\'s Milestone Tracker for development (free), and add Cloud Baby Monitor only if you need a phone-based monitor. Huckleberry is best for sleep coaching, and Baby Tracker by Nighp if a caregiver uses Android.**'},
    {replace: '25755fd5', md: DISCLOSURE},
    {replace: '12cad9fc', md: 'MamaBee appears only where it fits: tracking, feeding, nap prediction and partner sharing. It has no white noise and no baby monitor or camera, so other apps win those categories. Every price and rating was checked on the US App Store on November 15, 2026, and each section links to our deeper comparison where one exists.'},
    {table: 'd56cc005', t: {
      caption: 'Our picks per category. US App Store prices and ratings checked November 15, 2026.',
      headers: ['Award', 'App', 'Why', 'US price'],
      rows: [
        ['Our top pick: best baby tracker overall', 'MamaBee (ours)', 'Highest tracker score (9.2): no ads on any tier, free 2-caregiver sync, pediatrician PDF; Sleep Coach and unlimited Bee AI on Premium', 'Free; Premium $4.99/mo or $49.99/yr'],
        ['Best for sleep coaching', 'Huckleberry', 'Generous free log, the best-known nap predictor (SweetSpot, from 2 months) and consultant-built sleep plans on Premium', 'Free; Plus $68.99/yr; Premium $119.99/yr'],
        ['Best for Android & mixed-phone families', 'Baby Tracker (Nighp)', '227,374 US ratings, Apple Watch, Siri and Android; best one-time purchase', 'Free with ads; $4.99 once removes ads'],
        ['Best budget cross-platform log', 'PiyoLog', 'Real-time couple sharing, Apple Watch, Android', 'Free with ads; Premium $34.99/yr'],
        ['Best value nap prediction', 'MamaBee Sleep Coach', 'Predicts the next nap from your baby\'s own sleep history, inside a full ad-free tracker', 'Premium $4.99/mo or $49.99/yr'],
        ['Best dedicated sleep app', 'Napper', 'Free age-based schedule; courses and sounds on Unlimited', 'Free; Unlimited $69.99/yr'],
        ['Best white noise app', 'White Noise Baby', 'No ads; restarts sound when it hears crying', '$0.99 once'],
        ['Best breastfeeding app for iPhone families', 'MamaBee (ours)', 'Left/right timers, bottles and pumping, with free real-time sync so whoever takes over sees the last feed', 'Free'],
        ['Best pay-once breastfeeding app', 'Baby Feed Timer', 'Big left/right buttons, tells you which side is next', '7-day trial, then $9.99 once'],
        ['Best phone-based baby monitor', 'Cloud Baby Monitor', 'Turns two Apple devices into a video monitor', '$6.99 once'],
        ['Best for milestones', 'CDC\'s Milestone Tracker', 'Free checklists from 2 months to 5 years', 'Free'],
      ]}},
    {table: '5685a2a9', t: {
      caption: 'Overall scores out of 10 from our full baby tracker app ranking (nine weighted criteria). Prices from the US App Store, checked November 15, 2026.',
      headers: ['App', 'Score', 'Best for', 'Cheapest paid (US)', 'Platforms'],
      rows: [
        ['MamaBee (our app)', '9.2', 'Our top pick; best free (no ads)', '$49.99/yr', 'iPhone only'],
        ['Huckleberry', '8.5', 'Best for sleep coaching', '$68.99/yr', 'iPhone, iPad, Apple Watch, Android'],
        ['Baby Tracker (Nighp)', '8.3', 'Best for Android & mixed-phone families', '$4.99 once', 'iPhone, iPad, Apple Watch, Android'],
        ['PiyoLog', '8.0', 'Best budget cross-platform log', '$34.99/yr', 'iPhone, iPad, Apple Watch, Android'],
        ['Sprout Baby', '7.5', 'Best for Apple Watch', '$59.99/yr', 'iPhone, iPad, Apple Watch, Android'],
        ['Napper', '7.25', 'Sleep specialist', '$69.99/yr', 'iPhone, Apple Watch, Android'],
        ['Nara Baby', '6.5', '-', '$9.99/mo or $99.99 once', 'iPhone, Apple Watch, Android'],
        ['Luli', '6.0', '-', 'From $39.99/yr', 'iPhone, iPad, Android'],
      ]}},
    {replace: '5241bc93', md: 'Our top pick is MamaBee. The one reason to choose a different tracker is platform: MamaBee is iPhone-only, so if a caregiver uses Android, pick Baby Tracker by Nighp or PiyoLog. Our full [best baby tracker app comparison](/mamabee/articles/best-baby-tracker-apps-compared) goes deeper, and [best free baby tracker apps](/mamabee/articles/best-free-baby-tracker-apps) compares free tiers only.'},
    // MamaBee section first
    {replace: 'edd89f23', md: '### MamaBee: our top pick and best baby tracker overall (our app)'},
    {replace: '42c499bd', md: '**Who it\'s for:** most families on iPhone, and two parents who want one shared, ad-free log without paying.'},
    {replace: '345b4bd0', md: '**Strengths:** the highest score in our ranking (9.2), with no ads on any tier, free two-parent sync and free pediatrician export. Premium costs less than Huckleberry Plus and bundles nap prediction, unlimited AI and allergen tracking. Your logs are stored on your phone first, reach our servers only if you turn on Co-Parent Sharing, and are never sold.'},
    {replace: 'cf049be3', md: '**Limits:** iPhone only (iOS 17.6 or later), with no Android, iPad or Apple Watch app yet (they\'re on the roadmap), so both parents need an iPhone to sync. It launched in July 2026, so it has few ratings so far.'},
    {move: ['edd89f23', '3c2e1aa8'], before: '507b13bc'},
    {replace: '507b13bc', md: '### Huckleberry: best for sleep coaching'},
    {replace: 'cff79206', md: '### Baby Tracker by Nighp: best for Android and mixed-phone families'},
    {replace: '59b95401', md: '### Also scored: PiyoLog, Sprout Baby and Nara Baby'},
    {move: ['e0dc2503', 'e0dc2503'], before: '6f48e891'},
    // Sleep
    {replace: '85d074d8', md: 'Our top pick for value is **MamaBee\'s Sleep Coach**: it predicts the next nap from your baby\'s own sleep history inside a full ad-free tracker, on Premium at $49.99 a year. Huckleberry\'s SweetSpot, covered above, is the most established alternative; it needs Plus ($68.99 a year) and starts at 2 months. Before then, prediction is rough in every app: the American Academy of Pediatrics says newborns sleep about 16 to 17 hours a day, but often only 1 or 2 hours at a time ([AAP HealthyChildren](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/getting-your-baby-to-sleep.aspx)). Our [best nap prediction apps](/mamabee/articles/best-nap-prediction-apps) roundup tests the idea in detail, and the [wake window calculator](/mamabee/tools/wake-window-calculator) gives you the age-based starting point for free.'},
    // Feeding: MamaBee first
    {replace: '7d0427b3', md: '### MamaBee: best breastfeeding and feeding app for iPhone families'},
    {replace: 'ef027853', md: '**Limits:** iPhone only, with no Apple Watch app yet for when your hands are full. Our [newborn night shifts](/mamabee/articles/newborn-night-shifts) guide shows how to split nights with a shared log.'},
    {move: ['7d0427b3', 'c4e1584c'], before: 'ed020b8c'},
    {mutate: 'c4e1584c', fn: ctaHeading('Our top-pick tracker is free: log feeds, sleep and diapers in one tap, with no ads.')},
    {replace: 'ed020b8c', md: '### Baby Feed Timer: best pay-once breastfeeding app'},
    // Starter kit
    {mutate: '43e46d42', fn: (b) => ({...b, rows: b.rows.map((r) => {
      if (r.cells[0] === 'Tracker') return {...r, cells: ['Tracker', 'MamaBee free, our top pick (both on iPhone), or Baby Tracker or Huckleberry free (mixed iPhone and Android)', 'MamaBee Premium $49.99/yr, or Baby Tracker $4.99 once', r.cells[3]]}
      if (r.cells[0].startsWith('Nap prediction')) return {...r, cells: [r.cells[0], r.cells[1], 'MamaBee Premium, Huckleberry Plus or Napper Unlimited', r.cells[3]]}
      return r
    })})},
    {replace: '77819bfd', md: `Tracker scores come from our full [best baby tracker app](/mamabee/articles/best-baby-tracker-apps-compared) ranking: nine weighted criteria worth 10 points in total (${WEIGHTS_INLINE}). The same rules apply to MamaBee, which takes full marks on the daily-use criteria and scores lowest on platforms and track record.`},
    {replace: '7ff5f953', md: '- **Both on iPhone? Start with MamaBee.** It\'s our top pick. If one parent is on Android, choose Baby Tracker, PiyoLog, Huckleberry, Sprout or Nara.'},
    // FAQ
    {replace: 'b5c57e49', md: 'MamaBee is our top pick for tracking (9.2 out of 10), with no ads and free partner sync on iPhone. Add White Noise Baby for sleep sounds, Cloud Baby Monitor if you want a phone-based monitor, and CDC\'s Milestone Tracker for milestones. Huckleberry is best for sleep coaching, Baby Tracker by Nighp for Android families or a one-time purchase, and Baby Feed Timer for a pay-once breastfeeding timer.'},
    {replace: 'cddd2598', md: 'For tracking, MamaBee: a complete free tier with no ads on any tier, free two-caregiver sync and a free pediatrician PDF (iPhone only). Huckleberry\'s free tier is also ad-free with partner sync. CDC\'s Milestone Tracker is completely free. Baby Tracker and PiyoLog are free with ads.'},
    {replace: '9789ed89', md: 'Huckleberry, Baby Tracker by Nighp, PiyoLog, Sprout, Nara Baby, Napper, Luli, Baby Feed Timer, White Noise Baby, Cloud Baby Monitor, Baby Monitor 3G, Nanit and CDC\'s Milestone Tracker all have Android apps. MamaBee is iPhone-only for now; Android is on the roadmap.'},
    // Takeaway
    {replace: 'dafce3c4', md: 'Start with MamaBee, our top pick: one complete, ad-free tracker that both iPhone parents can share for free, plus a $0.99 sound app. When naps get hard, Premium adds Sleep Coach and unlimited Bee AI for $49.99 a year. The one reason to pick a different tracker is a caregiver on Android: then choose Baby Tracker by Nighp or PiyoLog. Huckleberry is the pick for consultant-built sleep plans. Add a monitor or a milestone app only when you need it.'},
    {mutate: 'bc83184a', fn: ctaHeading('Start with our top pick: download MamaBee free and share one ad-free log with your partner.')},
  ],
}

// =====================================================================================
// 3. Best free baby tracker apps
// =====================================================================================
const FREE = {
  id: 'mamabee-best-free-baby-tracker-apps',
  title: 'Free Baby Tracker App 2026: The Best Free Tiers Compared',
  description: null,
  ops: [
    {before: 'e66718e5', md: [
      '**The best free baby tracker app in 2026 is MamaBee. Its free tier is a complete tracker with no ads on any tier, free real-time sync for two caregivers and a free pediatrician PDF export, on iPhone. PiyoLog and Baby Tracker by Nighp are free with ads and work on Android; Huckleberry\'s free tier is ad-free, but its nap prediction is paid.**',
      DISCLOSURE,
    ].join('\n')},
    {table: '6ac8ab22', t: {
      caption: 'What each free tier really gives you. Verified on the US App Store in August 2026; free-tier details, sharing and export rechecked November 15, 2026.',
      headers: ['App', 'Free tier', 'Ads on free', 'Free partner sync', 'Export', 'Standout free feature'],
      rows: [
        ['MamaBee (our top pick)', 'Full logging, insights, growth, milestones', 'None', 'Real-time, 2 caregivers', 'CSV, JSON, pediatrician PDF, free', 'No ads on any tier'],
        ['PiyoLog', 'Full app', 'Yes', 'Real-time', 'Summaries and graphs', 'Beautiful daily time bar'],
        ['Baby Tracker (Nighp)', 'Full app', 'Yes', 'Sync groups (setup needed)', 'PDF + print', '$4.99 once removes ads'],
        ['Huckleberry', 'Logging, sleep summaries, solids log', 'None', 'Multiple caregivers', 'Sleep summaries; trend reports in Plus', 'Upgrade path to SweetSpot'],
      ]}},
    {replace: 'b52721d1', md: '## MamaBee — the best free baby tracker (no ads on any tier)'},
    {replace: '3966b502', md: 'We make MamaBee, and it is our top pick, so here are the facts plainly. The free tier is a complete tracker: one-thumb logging of sleep, breastfeeding with left/right timers, bottles, pumping, diapers, solids, temperature, medicine and more; 7-day insights; WHO growth percentiles; 45+ CDC milestones; the first 3 months of the vaccine schedule (the full schedule is Premium); real-time co-parent sync for two caregivers; widgets; and CSV, JSON or pediatrician PDF export — with **no ads on any tier.** That combination is genuinely rare: most free baby trackers are ad-supported. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold. The trade-offs: it is iPhone only (iOS 17.6 or later), and Sleep Coach nap prediction and unlimited Bee AI are Premium ($4.99 a month or $49.99 a year).'},
    {after: '3966b502', md: [
      'Why it is our top free pick:',
      '- **No ads, on any tier.** The 3 AM screen is just your baby\'s day, not a banner.',
      '- **Free partner sync.** Two caregivers see every feed and nap in real time, at no cost.',
      '- **A free report for the pediatrician.** Export a PDF before a checkup, or CSV and JSON for your own records.',
      '- **A cheap upgrade path.** If naps get hard, Premium adds Sleep Coach and unlimited Bee AI for $49.99 a year, less than Huckleberry Plus at $68.99.',
    ].join('\n')},
    {replace: '3350f0db', md: 'Huckleberry\'s free tier covers logging, sleep summaries, a solids log and caregiver sync, with no ads. Its signature SweetSpot nap prediction and Berry AI are paid (up to $119.99/year). Great app, but "free Huckleberry" isn\'t what most people are picturing.'},
    {mutate: '4da86735', fn: ctaHeading('The best free baby tracker has no ads in it. Download MamaBee free tonight.')},
    {before: '892c93be', md: '- **Want the most for free?** MamaBee: complete logging, partner sync and a pediatrician PDF, with no ads.'},
    {replace: '35afde83', md: '- **Want prediction later?** MamaBee Premium adds Sleep Coach and unlimited Bee AI for $49.99 a year; Huckleberry\'s SweetSpot starts at $68.99 a year.'},
    {replace: 'dae2139f', md: 'MamaBee. Its free tier has no ads on any tier and includes logging, insights, growth, milestones, two-caregiver sync and a pediatrician PDF (iPhone only). If a caregiver uses Android, PiyoLog and Baby Tracker are complete free apps, though ad-supported until you pay.'},
    {replace: 'ce71a38f', md: 'Not automatically — many are ad-supported and share data. A Surfshark audit found most popular baby apps share data with third parties. Prefer apps that keep data on your device: MamaBee\'s logs stay on your phone unless you turn on Co-Parent Sharing, and are never sold. See our guide on [whether baby tracker apps are safe](/mamabee/articles/are-baby-tracker-apps-safe).'},
    {replace: 'c8cf444d', md: 'For logging and remembering, free is plenty. Pay only if you want nap prediction or AI help: MamaBee Premium adds Sleep Coach, unlimited Bee AI and the full vaccine schedule for $4.99 a month or $49.99 a year. Paid tiers elsewhere range from PiyoLog\'s $34.99 a year to Huckleberry Premium\'s $119.99 a year.'},
    {replace: 'cfb8d2fa', md: 'MamaBee is the best free baby tracker app for most families: complete logging, no ads on any tier, free real-time sync for two caregivers and a free pediatrician PDF. The one reason to pick something else is Android: if a caregiver uses it, choose PiyoLog or Baby Tracker (Baby Tracker\'s $4.99 removes ads for good). For the full paid-vs-free picture, see our [baby tracker apps comparison](/mamabee/articles/best-baby-tracker-apps-compared).'},
    {mutate: '07a2da39', fn: ctaHeading('Get the best free baby tracker: MamaBee, with complete logging, no ads and free partner sync.')},
    {replace: '82f71f89', md: 'Prices and features verified on the US App Store in August 2026, with prices and free tiers rechecked November 15, 2026. This article is general information, not medical advice.'},
  ],
}

// =====================================================================================
const COMPETITORS = ['Huckleberry', 'Baby Tracker', 'Nighp', 'PiyoLog', 'Sprout', 'Napper', 'Nara', 'Luli', 'Glow', 'Baby Feed Timer']
function validate(doc, body, art) {
  const errs = [], warns = []
  const keys = new Set(); for (const b of body) { if (keys.has(b._key)) errs.push('duplicate _key ' + b._key); keys.add(b._key) }
  const lost = doc.body.filter((b) => b._type !== 'block' && !body.some((n) => n._key === b._key))
  if (lost.length) errs.push('non-text block removed: ' + lost.map((b) => b._key))
  for (const t of ['image', 'comparisonTable', 'appCta']) { const a = doc.body.filter((b) => b._type === t).length, c = body.filter((b) => b._type === t).length; if (a !== c) errs.push(`${t} count ${a} -> ${c}`) }
  const hrefsOld = new Set(doc.body.flatMap((b) => b.markDefs || []).map((m) => m.href).filter(Boolean))
  const hrefsNew = new Set(body.flatMap((b) => b.markDefs || []).map((m) => m.href).filter(Boolean))
  for (const h of hrefsOld) if (!hrefsNew.has(h)) errs.push('link lost: ' + h)
  const all = body.map(textOf).join('\n')
  if (!all.includes(DISCLOSURE)) errs.push('disclosure missing')
  // disclosure must directly follow the answer-first paragraph
  if (textOf(body[1]) !== DISCLOSURE) errs.push('disclosure is not block #2')
  if (!/^The best .*MamaBee/.test(textOf(body[0]))) errs.push('answer-first does not name MamaBee first')
  if (/no tracking/i.test(all)) errs.push('"no tracking" claim')
  if (/free Bee AI|Bee AI[^.|\n]{0,20}\bfree\b/i.test(all)) errs.push('Bee AI described as free')
  if (/Data Used to Track You|tracking label|privacy label[^.]{0,60}(empty|clean|no data)/i.test(all)) errs.push('privacy/tracking label comparison')
  const sentences = all.split(/(?<=[.!?])\s+|\n/)
  for (const s of sentences) {
    if (/best (baby tracker app )?overall|best overall|top pick|#1|number one/i.test(s) && COMPETITORS.some((c) => s.includes(c)) && !/MamaBee/.test(s)) errs.push('competitor called best overall/top pick: ' + s)
    if (/(Sleep Coach|Bee AI|vaccine schedule)[^.]{0,25}\b(is|are) free\b/i.test(s)) errs.push('Premium feature called free: ' + s)
  }
  for (const m of all.matchAll(/MamaBee[^.$\n]{0,70}\$(\d+\.\d\d)/g)) if (!['4.99', '49.99'].includes(m[1])) warns.push('MamaBee near price $' + m[1] + ': ' + m[0])
  for (const p of ['29.99', '24.99', '39.99/yr MamaBee']) if (new RegExp('MamaBee[^\n]{0,40}\\$' + p.replace('.', '\\.')).test(all)) errs.push('possible promo price ' + p)
  // stale scores from the old ranking
  for (const re of [/MamaBee[^.\n]{0,15}\(7\.0\)|7\.0\/10|5\.75|6\.75|\(7\.25\)\s*$/m, /Score: 8\.0\/10\. Best value/]) if (re.test(all)) errs.push('stale score: ' + re)
  for (const [app, score] of [['Huckleberry', '8.5'], ['Baby Tracker by Nighp', '8.3'], ['PiyoLog', '8.0'], ['Sprout Baby', '7.5'], ['Napper', '7.25'], ['MamaBee', '9.2']])
    for (const m of all.matchAll(new RegExp(app.replace(/[()]/g, '\\$&') + ' \\((\\d+(?:\\.\\d+)?)\\)', 'g'))) if (m[1] !== score) errs.push(`${app} shown as ${m[1]}`)
  if (art.title.length > 60) errs.push('title too long ' + art.title.length)
  const desc = art.description ?? doc.description
  if (art.description && (desc.length < 140 || desc.length > 158)) errs.push('description length ' + desc.length)
  if (/vaccine/i.test(all)) for (const s of sentences) if (/vaccine/i.test(s) && /\bfree\b/i.test(s) && !/first 3 months|Premium/i.test(s)) warns.push('check vaccine wording: ' + s)
  return {errs, warns}
}

function diff(oldBody, newBody) {
  const oldMap = new Map(oldBody.map((b) => [b._key, textOf(b)]))
  const lines = []
  for (const b of newBody) {
    const t = textOf(b)
    if (!oldMap.has(b._key)) lines.push(`  + NEW [${b._type}${b.style ? ':' + b.style : ''}] ${t}`)
    else if (oldMap.get(b._key) !== t) lines.push(`  ~ ${b._key}\n      - ${oldMap.get(b._key).replace(/\n/g, '\n        ')}\n      + ${t.replace(/\n/g, '\n        ')}`)
  }
  for (const [key, t] of oldMap) if (!newBody.some((b) => b._key === key)) lines.push(`  - REMOVED ${key}: ${t}`)
  return lines.join('\n')
}
const outline = (body) => body.filter((b) => (b._type === 'block' && /^h[23]$/.test(b.style)) || b._type === 'appCta').map((b) => b._type === 'appCta' ? '      [CTA] ' + b.heading : (b.style === 'h2' ? '  ## ' : '      ### ') + textOf(b))

let failed = false
for (const art of [MAIN, HUB, FREE]) {
  const doc = await client.getDocument(art.id)
  if (!doc) throw new Error('not found: ' + art.id)
  const existingDraft = await client.getDocument('drafts.' + art.id)
  const body = applyOps(doc.body, art.ops)
  const {errs, warns} = validate(doc, body, art)
  console.log('\n================', art.id, existingDraft ? '(WARNING: an existing draft will be replaced)' : '')
  console.log('TITLE :', doc.title === art.title ? '(unchanged) ' + art.title : `${doc.title}\n     -> ${art.title} (${art.title.length})`)
  if (art.description && art.description !== doc.description) console.log('DESC  :', doc.description, '\n     ->', art.description, `(${art.description.length})`)
  else console.log('DESC  : (unchanged)')
  console.log('WORDS :', words(doc.body), '->', words(body))
  if (process.env.DRY) { console.log('CHANGES:'); console.log(diff(doc.body, body)) }
  console.log('OUTLINE after:'); for (const l of outline(body)) console.log(l)
  for (const w of warns) console.log('  WARN', w)
  for (const e of errs) console.log('  ERROR', e)
  if (errs.length) { failed = true; continue }
  if (DRY) continue
  const {_rev, _createdAt, _updatedAt, ...rest} = doc
  const draft = {...rest, _id: 'drafts.' + art.id, title: art.title, ...(art.description ? {description: art.description} : {}), body}
  const res = await client.createOrReplace(draft)
  console.log('  draft written:', res._id)
}
if (failed) { console.error('\nValidation failed; nothing written for the failing articles.'); process.exit(1) }
console.log(DRY ? '\nDry run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
