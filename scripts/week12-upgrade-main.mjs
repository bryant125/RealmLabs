// Week-12 upgrade of the site's top-earning page, saved as a DRAFT only:
//   mamabee-best-baby-tracker-apps-compared  ->  drafts.mamabee-best-baby-tracker-apps-compared
// Goal: page 1 for "baby tracker app" / "best baby tracker app" (GSC Nov 2026: pos 18-19,
// 1,342 impressions in 90 days). Expands 4 apps to 8 (adds Sprout, Napper, Nara Baby, Luli),
// adds a scored ranking (out of 10, published criteria), a "Best for X" quick-pick table near
// the top, and links to the new week-12 roundups. Slug, coverImage, images, CTAs and every
// still-accurate section (incl. the 2026-11-13 refresh-week11 sections) are kept; blocks are
// replaced or inserted by _key, exactly like scripts/refresh-week11.mjs.
//
// Every competitor fact re-checked on November 15, 2026 (US App Store lookup API +
// apps.apple.com in-app purchase lists, Google Play, vendor sites):
//   Huckleberry 4.9 (78,831): Plus $11.99/mo $68.99/yr; Premium $14.99/mo $119.99/yr; Sleep
//     Improvement Plan $49.99; Expedited $19.99. iPhone, iPad, Apple Watch; Play 4.9, 1M+.
//   Baby Tracker (Nighp) 4.8 (227,374): Remove Ads $4.99; Plus $5.99/mo $49.99/yr. iPhone, iPad,
//     Apple Watch; Play 4.9, 1M+, contains ads. 15 languages.
//   PiyoLog 4.9 (2,710): $3.49/mo, $34.99/yr. iPhone, iPad, Apple Watch; Play 4.9, 1M+, ads.
//   Sprout ("Baby Tracker & Newborn Log", Med ART Studios, 2012) 4.8 (31,568): Premium $59.99/yr,
//     $14.99/$19.99/mo, $5.99/wk. iPhone, iPad, Apple Watch; Play 4.1, 10K+. iOS 18.6+.
//   Napper (Napper AB, 2019) 4.9 (4,661), Editors' Choice: Unlimited $69.99/yr (pricing page);
//     IAP up to $129.99/yr. Free = daily sleep tracking + age-based schedule. iPhone, Apple
//     Watch; Play 4.7, 1M+.
//   Nara Baby (Nara Organics, 2019) 4.8 (24,639): FAQ $9.99/mo or $99.99 lifetime, 7-day trial,
//     then read-only. iPhone, Apple Watch; Play 3.0, 100K+. No ads.
//   Luli (SimpleInnovation LLC / AppManage LLC, June 2025) 4.9 (47): $6.99-$7.99/mo,
//     $39.99-$59.99/yr, $99.99 lifetime; "Contains Advertising". iPhone, iPad; Play 4.4, 50K+.
// Fixes found while checking: Huckleberry DOES list Apple Watch (table said No); Bee AI chat is
// Premium (body said "included free"); Huckleberry's free solids log tracks allergens, so the
// "allergen tracker nobody else offers" line is gone.
//
// Run: cd /Users/admin/Github/Realmlabs/RealmLabs && set -a && source .env && set +a && DRY=1 node scripts/week12-upgrade-main.mjs
// Without DRY it writes drafts.mamabee-best-baby-tracker-apps-compared (never publishes).
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
// Reuse the app screenshots already uploaded to Sanity (see scripts/insert-screenshots.mjs).
const shots = {}
for (const n of ['home-timeline', 'sleep-coach', 'bee-ai', 'log-formula', 'log-solids',
                 'comp-huckleberry.png', 'comp-piyolog.png', 'comp-babytracker-home.png']) {
  const f = n.includes('.') ? n : `${n}.png`
  const id = await client.fetch('*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id', {f})
  if (id) shots[n] = id; else console.warn(`⚠️  missing screenshot asset: ${f}`)
}
const img = (name, caption, alt) => ({_type: 'image', _key: k(), phone: !name.startsWith('comp-'), caption, alt, asset: {_type: 'reference', _ref: shots[name]}})
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[IMG:')){const[name,caption,alt]=line.slice(6,line.indexOf(']]')).split('|');if(!shots[name])throw new Error('missing screenshot: '+name);out.push(img(name,caption,alt))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}

const DRY = !!process.env.DRY

const FOOT = 'Competitor prices, ratings, developers and platforms checked on the US App Store, Google Play and each vendor\'s own website on November 15, 2026, and may change. Scores are Realm Labs\' own, using the method above. This article is general information, not medical advice.'

const SRC = 'Sources: [Huckleberry App Store listing](https://apps.apple.com/us/app/huckleberry-baby-tracker/id1169136078), [Huckleberry pricing](https://huckleberrycare.com/pricing), [Baby Tracker App Store listing](https://apps.apple.com/us/app/baby-tracker-newborn-log/id779656557), [PiyoLog App Store listing](https://apps.apple.com/us/app/id1252857347), [Sprout Baby App Store listing](https://apps.apple.com/us/app/baby-tracker-newborn-log/id551448817), [Sprout apps website](https://sprout-apps.com/apps/baby-tracker/), the Sprout help centre article "What happens after subscription is cancelled?", [Napper App Store listing](https://apps.apple.com/us/app/napper-baby-sleep-tracker/id1491340863), [Napper pricing](https://napper.app/en/pricing/), [Nara Baby App Store listing](https://apps.apple.com/us/app/nara-baby-pregnancy-tracker/id1444639029), [Nara Baby FAQ](https://nara.com/pages/nara-baby-app-faqs), [Luli App Store listing](https://apps.apple.com/us/app/luli-baby-sleep-tracker/id6737125193), and each app\'s Google Play listing.'

const DATE = 'checked November 15, 2026'

// ---- body operations (addressed by existing _key), as in refresh-week11.mjs ----
function applyOps(body, ops) {
  let out = body.slice()
  const idx = (key) => { const i = out.findIndex((b) => b._key === key); if (i < 0) throw new Error('block not found: ' + key); return i }
  for (const op of ops) {
    const blocks = typeof op.md === 'string' ? md(op.md, op.tables || {}) : op.blocks
    if (op.replace) {
      const i = idx(op.replace)
      if (blocks.length === 1) blocks[0]._key = op.replace
      out.splice(i, 1, ...blocks)
    } else if (op.after) out.splice(idx(op.after) + 1, 0, ...blocks)
    else if (op.before) out.splice(idx(op.before), 0, ...blocks)
    else if (op.remove) out.splice(idx(op.remove), 1)
  }
  return out
}
const T = (key, t) => ({replace: key, blocks: [{...table(t), _key: key}]})

const ID = 'mamabee-best-baby-tracker-apps-compared'
const TITLE = 'Best Baby Tracker App 2026: 8 Apps Compared and Scored'
const DESCRIPTION = 'The best baby tracker app in 2026, scored out of 10: Huckleberry, Baby Tracker, PiyoLog, Sprout, MamaBee, Napper, Nara and Luli on price, ads and sync.'

const TABLES = {
  awards: {
    caption: `Our quick picks. US prices from App Store in-app purchase lists and vendor sites, ${DATE}.`,
    headers: ['Award', 'Winner', 'Why it wins', 'Price (US)'],
    rows: [
      ['Best overall', 'Huckleberry (8.5)', 'The most refined nap prediction, a polished free log, and apps for every platform', 'Free; Plus $68.99/yr; Premium $119.99/yr'],
      ['Best value', 'Baby Tracker by Nighp (8.0)', 'A complete free log; one $4.99 payment removes ads for good', 'Free; $4.99 once; Plus $49.99/yr'],
      ['Best for Android families', 'PiyoLog (7.5)', 'Free real-time partner sharing on iPhone and Android, and the cheapest subscription', 'Free with ads; $34.99/yr'],
      ['Best for Apple Watch logging', 'Sprout Baby (7.25)', 'Watch app with double-tap logging, plus Sleep Forecast nap predictions', '$59.99/yr'],
      ['Best ad-free free tier', 'MamaBee (7.0)', 'A complete free tracker with no ads, free sync for 2 caregivers and a pediatrician PDF', 'Free'],
      ['Best low-cost nap prediction + AI chat', 'MamaBee (7.0)', 'Sleep Coach and unlimited Bee AI for less than Huckleberry Plus', '$4.99/mo or $49.99/yr'],
      ['Best for sleep schedules', 'Napper (6.75)', 'A sleep-first app with a personalized schedule, sleep course and sleep sounds', 'Free basics; Unlimited $69.99/yr'],
      ['Best for twins and big families', 'Nara Baby (6.0)', 'Every child and caregiver on one plan, with a pay-once option', '$9.99/mo or $99.99 lifetime'],
    ],
  },
  scores: {
    caption: `Scores out of 10 by Realm Labs, using the seven criteria under "How we scored". Facts ${DATE}.`,
    headers: ['Rank', 'App', 'Score', 'Free tier', 'Cheapest paid (US)', 'Platforms'],
    rows: [
      ['1', 'Huckleberry', '8.5', 'Logging, solids log, reminders, no ads', '$68.99/yr', 'iPhone, iPad, Apple Watch, Android'],
      ['2', 'Baby Tracker (Nighp)', '8.0', 'Full log, with ads', '$4.99 once', 'iPhone, iPad, Apple Watch, Android'],
      ['3', 'PiyoLog', '7.5', 'Full log, with ads', '$34.99/yr', 'iPhone, iPad, Apple Watch, Android'],
      ['4', 'Sprout Baby', '7.25', 'Free download; built around Premium', '$59.99/yr', 'iPhone, iPad, Apple Watch, Android'],
      ['5', 'MamaBee', '7.0', 'Full log, no ads', '$49.99/yr', 'iPhone only'],
      ['6', 'Napper', '6.75', 'Sleep tracking and an age-based schedule', '$69.99/yr', 'iPhone, Apple Watch, Android'],
      ['7', 'Nara Baby', '6.0', '7-day trial, then read-only', '$9.99/mo or $99.99 once', 'iPhone, Apple Watch, Android'],
      ['8', 'Luli', '5.75', 'Free download, with ads', 'From $39.99/yr', 'iPhone, iPad, Android'],
    ],
  },
  otherFour: {
    caption: `Sprout, Napper, Nara Baby and Luli, ${DATE} on the US App Store, Google Play and each vendor's site.`,
    headers: ['', 'Sprout Baby', 'Napper', 'Nara Baby', 'Luli'],
    rows: [
      ['Developer', 'Med ART Studios', 'Napper AB', 'Nara Organics', 'SimpleInnovation LLC'],
      ['On the App Store since', '2012', '2019', '2019', '2025'],
      ['US App Store rating', '4.8 (31.6K)', '4.9 (4.7K)', '4.8 (24.6K)', '4.9 (47)'],
      ['Google Play', '4.1, 10K+ downloads', '4.7, 1M+ downloads', '3.0, 100K+ downloads', '4.4, 50K+ downloads'],
      ['Free tier', 'Free download; built around Premium', 'Sleep tracking, age-based schedule', '7-day trial, then read-only', 'Free download, with ads'],
      ['Paid (US)', '$59.99/yr; $14.99 to $19.99/mo', 'Unlimited $69.99/yr; other plans up to $129.99/yr', '$9.99/mo or $99.99 lifetime', '$6.99 to $7.99/mo; $39.99 to $59.99/yr; $99.99 lifetime'],
      ['Nap timing', 'Sleep Forecast predictions', 'Personalized schedule (Unlimited)', 'Nap routine from wake windows', 'Wake windows from your logs'],
      ['Caregivers', 'Real-time family sharing', 'Unlimited, on one subscription', 'Unlimited', 'Partner, nanny or caregiver'],
      ['Apple Watch', 'Yes', 'Yes', 'Yes', 'No'],
      ['Ads', 'None listed', 'None listed', 'None', 'Contains advertising'],
    ],
  },
  breakdown: {
    caption: `Points per criterion. Maximum points in brackets. Facts ${DATE}.`,
    headers: ['App', 'Free tier (2)', 'Price (1.5)', 'Ads (1)', 'Logging & sharing (1.5)', 'Insights (1.5)', 'Platforms (1.5)', 'Ratings (1)', 'Total (10)'],
    rows: [
      ['Huckleberry', '1.5', '0.5', '1', '1.5', '1.5', '1.5', '1', '8.5'],
      ['Baby Tracker (Nighp)', '1.5', '1.5', '0.5', '1.25', '0.75', '1.5', '1', '8.0'],
      ['PiyoLog', '1.5', '1.25', '0.5', '1.5', '0.5', '1.5', '0.75', '7.5'],
      ['Sprout Baby', '0.25', '0.75', '1', '1.5', '1.25', '1.5', '1', '7.25'],
      ['MamaBee', '2', '1.25', '1', '1.25', '1.25', '0.25', '0', '7.0'],
      ['Napper', '0.5', '0.5', '1', '1.25', '1.5', '1.25', '0.75', '6.75'],
      ['Nara Baby', '0', '0.75', '1', '1.5', '0.75', '1.25', '0.75', '6.0'],
      ['Luli', '0.75', '0.75', '0.5', '1.25', '1', '1.25', '0.25', '5.75'],
    ],
  },
}

const ops = [
  // ── Top: answer-first, disclosure, quick picks, scores ──────────────────────
  {replace: 'c988a0cb', md: `**The best baby tracker app for most families in 2026 is Huckleberry, which scored 8.5 out of 10 for its nap prediction and polish. Baby Tracker by Nighp (8.0) is the best value at $4.99 once, and PiyoLog (7.5) is the cheapest subscription on Android. MamaBee (7.0) has the best ad-free free tier on iPhone.**`},
  {after: 'c988a0cb', tables: TABLES, md: `This article is written by Realm Labs, the developer of MamaBee. We ranked our own app with the same criteria as everyone else, and say where others are better.
## Best baby tracker app 2026: quick picks
[[TABLE:awards]]
## Baby tracker app scores: all 8 ranked
[[TABLE:scores]]
Each app is scored on seven fixed criteria that add up to 10: free-tier usefulness, price and value, ads, logging and sharing, insights and prediction, platforms, and ratings. The point-by-point breakdown is further down, under "How we scored". MamaBee comes fifth, mostly because it is iPhone-only and too new to have many ratings.`},
  {before: 'bff02888', md: `## The 3 AM test: what makes a good baby tracker app`},
  {replace: '8cf67f03', md: `We compared the eight apps parents ask about most: Huckleberry, Baby Tracker by Nighp, PiyoLog, Sprout Baby, MamaBee, Napper, Nara Baby and Luli. We make MamaBee, so we will tell you exactly when the others are the better choice. There is no single best baby tracker app for everyone. There is the one that fits your crisis.`},
  // 30-second answer: allergen line was wrong (Huckleberry's free solids log tracks allergens)
  {replace: 'd7ad66b7', md: `- **You want a free tier with no ads in it, and the option to add real intelligence later** — MamaBee. The free core is genuinely free and ad-free; Premium adds Sleep Coach, unlimited Bee AI and a structured allergen test. iPhone only, and newer than the rest.`},
  {after: 'd7ad66b7', md: `- **Sleep is the whole problem and you want a sleep-only app** — Napper. A personalized nap schedule, a sleep course and sleep sounds, in Unlimited at $69.99 a year.
- **You log from your wrist** — Sprout Baby. Its Apple Watch app supports double-tap logging, and Premium is $59.99 a year.
- **Grandparents, a nanny and twins all log** — Nara Baby. One plan covers every child and caregiver: $9.99 a month or $99.99 once.`},
  {replace: '73a7a801', md: `- **A complete free tier with no advertising in it.** PiyoLog, Baby Tracker and Luli show ads until you pay. Huckleberry's free tier has no ads, but SweetSpot, Insights and its AI sit behind Plus and Premium. Nara Baby and Sprout have no ads, but you need a subscription to keep logging. MamaBee's free tier is a complete tracker with no ads, on any tier, ever.`},
  {replace: '144af0d7', md: `Now the detail, including where the other seven beat us.`},
  // ── Side-by-side tables ─────────────────────────────────────────────────────
  T('c4648fc7', {
    caption: `The four general trackers, ${DATE} on the US App Store.`,
    headers: ['', 'Huckleberry', 'PiyoLog', 'Baby Tracker', 'MamaBee'],
    rows: [
      ['Rating', '4.9 (79K)', '4.9 (2.7K)', '4.8 (227K)', 'New'],
      ['Free tier', 'Logging, summaries, solids log', 'Full, with ads', 'Full, with ads', 'Full, no ads'],
      ['Cheapest paid', '$68.99/yr', '$34.99/yr', '$4.99 once (removes ads)', '$49.99/yr'],
      ['Top tier', '$119.99/yr', '$34.99/yr', '$49.99/yr (Plus)', '$49.99/yr — one tier'],
      ['Nap prediction', 'Plus and Premium', 'No', 'Plus (What\'s Next cues)', 'Premium'],
      ['AI chat', 'Premium only', 'No', 'No', 'Premium (unlimited Bee AI)'],
      ['Allergen tracking', 'Free (solids log)', 'No', 'No', 'Premium (structured test)'],
      ['Sleep charts and trends', 'Free summaries; trend reports in Plus', 'Weekly graphs', 'Day, week and month charts', '7-day free; 30/90/365-day Premium'],
      ['Partner sync', 'Yes', 'Real-time, free', 'Yes (sync group)', 'Real-time, 2 caregivers free'],
      ['Apple Watch', 'Yes (Plus and Premium)', 'Yes', 'Yes', 'No'],
      ['Android', 'Yes', 'Yes', 'Yes', 'No (iPhone only)'],
      ['Ads', 'None', 'Free tier', 'Free tier', 'None'],
      ['Export', 'Reports', 'Summaries', 'PDF + print', 'CSV, JSON, PDF'],
    ],
  }),
  {after: 'c4648fc7', tables: TABLES, md: `### Sprout, Napper, Nara Baby and Luli side by side
[[TABLE:otherFour]]`},
  {replace: '73163b4d', md: `Going deeper on one matchup? See [Huckleberry vs Baby Tracker](/mamabee/articles/huckleberry-vs-baby-tracker), [Luli vs Napper](/mamabee/articles/luli-vs-napper), [Napper vs MamaBee](/mamabee/articles/napper-vs-mamabee), [Sprout Baby vs MamaBee](/mamabee/articles/sprout-baby-vs-mamabee), [Nara Baby vs MamaBee](/mamabee/articles/nara-baby-vs-mamabee) and [MamaBee vs PiyoLog](/mamabee/articles/mamabee-vs-piyolog). Leaving Huckleberry? Our [Huckleberry alternatives](/mamabee/articles/huckleberry-alternatives) guide lists cheaper options. Mostly nursing or pumping? Try the [best breastfeeding apps](/mamabee/articles/best-breastfeeding-apps). Want apps beyond tracking? See the [best baby apps](/mamabee/articles/best-baby-apps). On a budget, start with the [best free baby tracker apps](/mamabee/articles/best-free-baby-tracker-apps).`},
  // ── Costs ───────────────────────────────────────────────────────────────────
  T('bc4607af', {
    caption: `Three-year cost of ownership, US App Store and vendor prices, ${DATE}. Luli is left out because it lists several overlapping prices. Monthly billing costs more.`,
    headers: ['App', 'Year 1', '3 years', '3 years (monthly billing)'],
    rows: [
      ['Huckleberry Premium', '$119.99', '$359.97', '$539.64'],
      ['Napper Unlimited', '$69.99', '$209.97', '—'],
      ['Huckleberry Plus', '$68.99', '$206.97', '$431.64'],
      ['Sprout Premium', '$59.99', '$179.97', '$539.64 (at $14.99/mo)'],
      ['Nara Baby (lifetime, or $9.99/mo)', '$99.99', '$99.99', '$359.64'],
      ['Baby Tracker Plus', '$49.99', '$149.97', '$215.64'],
      ['MamaBee Premium', '$49.99', '$149.97', '$179.64'],
      ['PiyoLog Premium', '$34.99', '$104.97', '$125.64'],
      ['Baby Tracker (remove ads only)', '$4.99', '$4.99', '—'],
      ['MamaBee free core', '$0', '$0', '—'],
    ],
  }),
  {after: 'e0593f6e', md: `Nara Baby's $99.99 lifetime plan is the other way to avoid a subscription, and it covers every child and caregiver. But there is no free tier: after a 7-day trial, Nara's FAQ says the app turns read-only until someone pays.`},
  // ── Per-app sections: score lines + accuracy fixes ──────────────────────────
  {after: 'f38c5847', md: `**Score: 8.5/10. Best overall.** Who it is for: families whose main problem is sleep, on any phone, who are happy to pay for the best prediction.`},
  {after: '3ef31538', md: `**Score: 7.5/10. Best for Android families.** Who it is for: parents who want a calm, complete log and a cheap subscription, on iPhone or Android.`},
  {after: '0406f7f2', md: `**Score: 8.0/10. Best value.** Who it is for: anyone who would rather pay once, and families that log from an Apple Watch or an Android phone.`},
  {replace: '887afa6c', md: `- Sync groups across caregivers with iCloud or Dropbox backup; 15 languages; iPhone, iPad and Android`},
  // Sprout, before the mid-article CTA
  {after: 'c6d3ece1', md: `## Sprout Baby: the deepest tracker for Apple Watch
**Score: 7.25/10. Best for Apple Watch logging.** Who it is for: parents who want detailed tracking on every Apple device and don't mind a subscription.
On the App Store, Sprout is listed as "Baby Tracker & Newborn Log" by Med ART Studios, which has made it since 2012. It is a different app from Nighp's Baby Tracker. Its 31,600 US ratings average 4.8 stars, and the listing says Consumer Reports named it a "Best Baby Tracker App".
- **What is free:** it is free to download, but built around Premium. Sprout's help centre says that if you cancel your subscription you keep your data but can't add new entries.
- **Price:** Premium is $59.99 a year, or $14.99 to $19.99 a month, with a $5.99 weekly option.
- **Strengths:** Sleep Forecast predicts the next nap and wake-up; an Apple Watch app with double-tap logging; Siri Shortcuts, widgets and Live Activities; growth against WHO and CDC charts; and a photo memories book.
- **Limits:** no real free tier; the Android app is rated 4.1 on Google Play, lower than on iPhone; and it needs iOS 18.6 or later.
Get Sprout if: you track from your wrist and want one polished app for everything. Our [Sprout Baby vs MamaBee](/mamabee/articles/sprout-baby-vs-mamabee) comparison goes deeper.`},
  // MamaBee
  {after: 'e92d6444', md: `**Score: 7.0/10. Best ad-free free tier, and best low-cost nap prediction with AI chat.** Who it is for: iPhone families who want a complete free tracker with no ads. It loses points for being iPhone-only and new, with very few ratings.`},
  {replace: '51f9c50b', md: `Bee AI answers the questions you would otherwise be Googling at 3 AM, using your baby's own log as context, and it is unlimited on Premium. Premium also adds multi-baby sync, extra co-parents beyond the free two, longer insight windows of 30, 90 and 365 days, the full vaccine schedule, and a structured allergen test.`},
  {replace: '669d0c33', md: `- Free real-time co-parent sync for two caregivers (both on iPhone); multi-baby sync for twins and siblings is Premium`},
  {replace: 'e695bf13', md: `- 45+ official CDC milestones and WHO growth percentiles, free; country-specific vaccine schedules (the first 3 months free, the full schedule on Premium)`},
  {replace: '0d06e9f0', md: `- 13 languages on the App Store, and no ads on any tier`},
  {replace: 'e31e6d25', md: `- We are new. We have a handful of ratings, not Huckleberry's 79,000 or Nighp's decade.`},
  // Napper, Nara Baby, Luli, then How we scored — all before "How to actually choose"
  {before: '9d55f012', tables: TABLES, md: `## Napper: built only for sleep
**Score: 6.75/10. Best for sleep schedules.** Who it is for: parents whose baby's naps are the main problem, and who want a sleep-first app rather than a full log.
Napper is made by Napper AB in Stockholm and has been on the App Store since 2019. It has 4.9 stars from about 4,700 US ratings, an App Store Editors' Choice badge, and more than 1 million downloads on Google Play.
- **What is free:** daily sleep tracking and a sleep schedule based on your baby's age.
- **Price:** Napper Unlimited is $69.99 a year on Napper's pricing page. The App Store also lists other plans, up to $129.99 a year.
- **Strengths:** Unlimited adds a personalized sleep analysis, educational sleep courses, sleep sounds such as white noise and lullabies, trends and statistics, and tracking for feeds, diapers and more. As many caregivers as you like share one subscription.
- **Limits:** the free version is sleep-only; Unlimited costs about the same as Huckleberry Plus; and there is no iPad app.
Get Napper if: you want dedicated sleep coaching and don't need Huckleberry's extras. See [Napper vs MamaBee](/mamabee/articles/napper-vs-mamabee) and [Luli vs Napper](/mamabee/articles/luli-vs-napper).
## Nara Baby: one price for the whole family
**Score: 6.0/10. Best for twins and big families.** Who it is for: families with several children or caregivers who would rather pay once than subscribe.
Nara Baby, from Nara Organics, was for years the simple, free, ad-free tracker parents recommended to each other. Its 24,600 US ratings average 4.8 stars. It is now a paid app.
- **What is free:** a 7-day trial with full access. After that, Nara's FAQ says you can view and export your data but not add new entries until someone subscribes.
- **Price:** $9.99 a month or $99.99 once for lifetime access, according to Nara's FAQ. The App Store also lists promotional prices.
- **Strengths:** unlimited children and caregivers on one plan; Apple Watch, Siri and Live Activities; pregnancy and postpartum tracking; no ads and no extra paid tiers; and data export.
- **Limits:** no free tier; its nap help is a routine built from wake windows rather than a prediction engine; and the Android app is rated 3.0 on Google Play.
Get Nara Baby if: two parents, grandparents and a nanny all log, or you have twins, and $99.99 once beats a subscription. Our [Nara Baby vs MamaBee](/mamabee/articles/nara-baby-vs-mamabee) comparison has the detail.
## Luli: a new sleep-first tracker
**Score: 5.75/10. No award yet.** Who it is for: parents who want wake-window guidance plus basic logging, on iPhone, iPad or Android.
Luli is made by SimpleInnovation LLC (the App Store seller is AppManage LLC) and arrived in June 2025. It is rated 4.9, but from only 47 US ratings, so it is too new to judge on reviews.
- **What is free:** it is free to download, and the listing says it contains advertising. The listing doesn't spell out which features need a subscription.
- **Price:** the App Store lists several overlapping plans: $6.99 to $7.99 a month, $39.99 to $59.99 a year, and $99.99 for lifetime access. Check the in-app offer before you pay.
- **Strengths:** tracks sleep, breast and bottle feeds, solids, diapers and activities; uses your baby's logs to show wake windows and when they are ready to sleep; nap and feed reminders; sharing with a partner, nanny or caregiver; and 24 languages.
- **Limits:** ads; no Apple Watch app; and very few ratings so far.
Get Luli if: you want a sleep-first app on a smaller budget and don't mind ads. See [Luli vs Napper](/mamabee/articles/luli-vs-napper).
## How we scored each baby tracker app
Every app was scored on the same seven criteria, with fixed points that add up to 10. We checked prices, in-app purchase lists, ratings, developers and platforms on the US App Store and Google Play on November 15, 2026.
- **Free-tier usefulness (2 points):** how much you can log, share and export without paying.
- **Price and value (1.5):** what the paid tier costs per year, and what it adds.
- **Ads (1):** full marks for no ads, half for ads you can remove.
- **Logging and sharing (1.5):** one-thumb entry, timers, widgets and real-time partner sync.
- **Insights and prediction (1.5):** charts, trends and nap prediction from your baby's own data.
- **Platforms (1.5):** iPhone, iPad, Apple Watch and Android.
- **Ratings and track record (1):** US App Store rating, number of ratings and years on the market.
[[TABLE:breakdown]]
We did not score privacy, because privacy labels and policies are hard to compare fairly. Read each app's App Store privacy label before you choose. MamaBee scores lowest of all eight on platforms and ratings, and we left it that way.`},
  // ── How to choose: add the new apps ─────────────────────────────────────────
  {after: '3e102a4a', md: `- Sleep is broken and you want a sleep-only app — Napper.
- You log from an Apple Watch — Sprout, or Baby Tracker if you'd rather not subscribe.
- One parent is on Android — Huckleberry, PiyoLog or Baby Tracker. MamaBee is iPhone-only.
- Several caregivers, or twins — Nara Baby's lifetime plan.`},
  // ── Refresh-week11 sections: keep, but they were written for four apps ──────
  {replace: '57c7a010', md: `If all you want is a log — feeds, diapers, sleep and pumping, with nothing telling you what to do — the best baby log app is the one you can work with one thumb in the dark. The four general trackers here (Huckleberry, PiyoLog, Baby Tracker and MamaBee) all do the basics well. The differences are speed, ads and sharing:`},
  {replace: '943f1b42', md: `If you mainly want a baby feeding journal app, check that it records the breast side, bottle amounts and pumping sessions in one timeline. All four do, and Baby Tracker and MamaBee have left/right nursing timers. For nursing and pumping in more depth, see our [best breastfeeding apps](/mamabee/articles/best-breastfeeding-apps).`},
  {replace: '11b549a3', md: `All four general trackers show your baby's sleep over time. They differ in how far back you can look and what you have to pay for it. Napper, the sleep-only app, puts its trends and statistics in its paid Unlimited plan.`},
  {replace: 'd1f7258b', md: `If Huckleberry's price is the problem, you have cheaper routes: PiyoLog Premium ($34.99 a year) if you only want a lovely ad-free log, Baby Tracker ($4.99 once) if you only want ads gone, Sprout Premium ($59.99 a year) for nap forecasts and Apple Watch logging, or MamaBee Premium ($49.99 a year) if you want nap prediction and AI chat for less than Huckleberry Plus. Napper Unlimited ($69.99 a year) costs about the same as Plus but is built entirely around sleep. Our full guide to [Huckleberry alternatives](/mamabee/articles/huckleberry-alternatives) compares them, and our head-to-heads put [Glow Baby](/mamabee/articles/glow-baby-vs-mamabee), [Nara Baby](/mamabee/articles/nara-baby-vs-mamabee), [Sprout Baby](/mamabee/articles/sprout-baby-vs-mamabee) and [Napper](/mamabee/articles/napper-vs-mamabee) next to MamaBee.`},
  // ── FAQ ─────────────────────────────────────────────────────────────────────
  {replace: 'ce09fc84', md: `On our scores, Huckleberry is the best baby tracker app overall (8.5 out of 10), thanks to its nap prediction and polish, though its best features are paid. Baby Tracker by Nighp (8.0) is the best value at $4.99 once, PiyoLog (7.5) the best cheap pick for Android, and MamaBee (7.0) the best ad-free free tier on iPhone.`},
  {replace: '374f3448', md: `For a newborn, pick the app that makes feed, diaper and sleep logging fastest and syncs with your partner in real time. Nap prediction matters less in the first 2 months, so a free tier such as MamaBee's, PiyoLog's or Baby Tracker's usually covers the newborn stage. Nara Baby and Sprout need a subscription to keep logging.`},
  {replace: '16d174ff', md: `PiyoLog's real-time sharing is excellent and free. MamaBee includes free real-time co-parent sync for two caregivers on iPhone. Napper and Nara Baby let unlimited caregivers share one paid plan. Baby Tracker uses sync groups, which work but take setup. Huckleberry's free tier syncs multiple caregivers.`},
  {after: '16d174ff', md: `### Which baby tracker app works on both iPhone and Android?
Huckleberry, PiyoLog, Baby Tracker by Nighp, Sprout, Napper, Nara Baby and Luli all have Android apps, so parents on different phones can share one log. MamaBee is iPhone-only for now, and its co-parent sync needs both caregivers on iPhone.
### Do Nara Baby and Sprout have a free version?
Not really. Nara Baby gives you a 7-day trial; after that you can view and export your data but not add new entries unless you pay $9.99 a month or $99.99 once. Sprout is free to download but built around Premium, at $59.99 a year.`},
  // ── Takeaway, sources, footer ───────────────────────────────────────────────
  {replace: 'dd0416c7', md: `Huckleberry is the best baby tracker app overall and the best sleep engine, and it charges like it. Baby Tracker is the workhorse that still asks for $4.99 once. PiyoLog is the lovely, cheap log that works on Android. Sprout is the deep, Apple Watch-friendly subscription, Napper the sleep specialist, Nara Baby the one-price family plan, and Luli the newcomer to watch. MamaBee is the calm, private one — a free tier with no ads in it, and nap prediction plus AI chat for $49.99 a year — as long as you are on an iPhone.`},
  {replace: 'd2d806a6', md: `${SRC}
${FOOT}`},
]

// ── helpers for the outline / checks ──────────────────────────────────────────
const textOf = (b) => (b.children || []).map((c) => c.text).join('')
const words = (body) => body.filter((b) => b._type === 'block').map(textOf).join(' ').split(/\s+/).filter(Boolean).length
const outline = (body) => body.filter((b) => b._type === 'block' && /^h[23]$/.test(b.style)).map((b) => (b.style === 'h2' ? '  ## ' : '      ### ') + textOf(b))
const firstPara = (body) => { const b = body.find((x) => x._type === 'block' && x.style === 'normal' && !x.listItem); return b ? textOf(b) : '' }
const count = (body, t) => body.filter((b) => b._type === t).length

const doc = await client.getDocument(ID)
if (!doc) throw new Error('not found: ' + ID)
const existingDraft = await client.getDocument('drafts.' + ID)
const body = applyOps(doc.body, ops)

// ── validation ────────────────────────────────────────────────────────────────
const keys = new Set(); for (const b of body) { if (keys.has(b._key)) throw new Error('duplicate _key ' + b._key); keys.add(b._key) }
const lost = doc.body.filter((b) => b._type !== 'block' && !body.some((n) => n._key === b._key))
if (lost.length) throw new Error('non-text block removed: ' + lost.map((b) => b._key))
const allText = body.map((b) => b._type === 'block' ? textOf(b) : JSON.stringify(b)).join(' ')
const badYearly = [...allText.matchAll(/MamaBee[^.]{0,60}\$(\d+\.\d\d)( a year|\/yr)/g)].map((m) => m[1]).filter((p) => p !== '49.99')
if (badYearly.length) throw new Error('unexpected MamaBee yearly price: ' + badYearly)
if (/no tracking/i.test(allText)) throw new Error('"no tracking" claim found')
if (/Bee AI[^.]{0,40}included free|AI chat[^.]{0,10}Free, unlimited/i.test(allText)) throw new Error('Bee AI described as free')
if (/vaccine[^.]{0,40}\bfree\b/i.test(allText.replace(/first 3 months free/g, ''))) console.warn('  WARN: check vaccine wording')
if (!allText.includes('This article is written by Realm Labs, the developer of MamaBee.')) throw new Error('disclosure missing')
const fp = firstPara(body)
if (!/baby tracker app/i.test(fp)) throw new Error('"baby tracker app" missing from first paragraph')
if (!body.some((b) => b.style === 'h2' && /baby tracker app/i.test(textOf(b)))) throw new Error('"baby tracker app" missing from H2s')
if (!TITLE.startsWith('Best Baby Tracker App 2026') || TITLE.length > 60) throw new Error('title rule: ' + TITLE.length)
if (DESCRIPTION.length < 140 || DESCRIPTION.length > 155) throw new Error('description length ' + DESCRIPTION.length)
const hrefs = body.flatMap((b) => b.markDefs || []).map((m) => m.href).filter(Boolean)
for (const need of ['/mamabee/articles/best-baby-apps', '/mamabee/articles/huckleberry-alternatives', '/mamabee/articles/best-breastfeeding-apps']) if (!hrefs.includes(need)) throw new Error('missing link ' + need)
const internal = [...new Set(hrefs.filter((h) => h.startsWith('/mamabee/articles/')).map((h) => h.split('/').pop()))]
const existing = new Set(await client.fetch('*[_type=="article" && brand=="mamabee" && (!defined(language)||language=="en")].slug.current'))
const pending = ['best-baby-apps', 'huckleberry-alternatives', 'best-breastfeeding-apps']
const missing = internal.filter((s) => !existing.has(s) && !pending.includes(s))
if (missing.length) throw new Error('links to unknown slugs: ' + missing)

// ── report ────────────────────────────────────────────────────────────────────
console.log('\n================', ID, existingDraft ? '(WARNING: a draft already exists and will be replaced)' : '')
console.log('TITLE  before:', doc.title, `(${doc.title.length})`)
console.log('TITLE  after: ', TITLE, `(${TITLE.length})`)
console.log('DESC   after: ', DESCRIPTION, `(${DESCRIPTION.length})`)
console.log('FIRST PARA (' + fp.split(/\s+/).length + ' words):', fp)
console.log('WORDS  before:', words(doc.body), ' after:', words(body))
console.log('BLOCKS images', count(doc.body, 'image'), '->', count(body, 'image'), '| tables', count(doc.body, 'comparisonTable'), '->', count(body, 'comparisonTable'), '| CTAs', count(doc.body, 'appCta'), '->', count(body, 'appCta'))
console.log('FAQ questions:', (() => { const i = body.findIndex((b) => b.style === 'h2' && textOf(b) === 'Frequently asked questions'); let n = 0; for (let j = i + 1; j < body.length && body[j].style !== 'h2'; j++) if (body[j].style === 'h3') n++; return n })())
console.log('INTERNAL LINKS:', internal.length, internal.join(', '))
const before = new Set(outline(doc.body))
console.log('OUTLINE after (+ = new):'); for (const l of outline(body)) console.log((before.has(l) ? ' ' : '+') + l)
for (const l of before) if (!outline(body).includes(l)) console.log('-' + l)

if (DRY) { console.log('\nDry run — nothing written.'); process.exit(0) }
const {_rev, _createdAt, _updatedAt, ...rest} = doc
const draft = {...rest, _id: 'drafts.' + ID, title: TITLE, description: DESCRIPTION, body}
const res = await client.createOrReplace(draft)
console.log('\n✅ draft written:', res._id, '(slug', draft.slug.current + ', cover kept:', !!draft.coverImage, ')')
console.log('Done — DRAFT only. Nothing is live.')
