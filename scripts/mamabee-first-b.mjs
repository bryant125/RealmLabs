// MamaBee-first repositioning, part B (brief: reports/briefs/MAMABEE-FIRST-BRIEF.md):
//   huckleberry-alternatives, best-breastfeeding-apps, best-nap-prediction-apps (English).
// Reads each PUBLISHED doc `mamabee-<slug>`, rebuilds the body in code and writes it to
// `drafts.mamabee-<slug>` with createOrReplace. Never writes the published _id, never publishes.
// Competitor facts and prices are kept as published (checked Nov 14/15, 2026); only framing,
// order, scoring criteria and MamaBee copy change. Score totals are computed from the published
// per-criterion scores and weights, and asserted.
// Run:     cd RealmLabs && set -a && source .env && set +a && node scripts/mamabee-first-b.mjs
// Dry run: DRY=1 node scripts/mamabee-first-b.mjs   (prints before/after diff, no writes)
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

const DISCLOSURE = 'This article is written by Realm Labs, the developer of MamaBee. We scored every app, including ours, on the same published criteria.'

// ---------- helpers for editing an existing body ----------
const plain = (b) => b._type === 'block' ? b.children.map(c => c.text).join('')
  : b._type === 'comparisonTable' ? `TABLE ${b.caption || ''} | ${b.headers.join(' | ')} || ${b.rows.map(r => r.cells.join(' | ')).join(' || ')}`
  : b._type === 'appCta' ? `CTA: ${b.heading || ''}` : `${b._type} ${b._key}`
const render = (b) => b._type === 'block' ? `${b.style}${b.listItem ? '/' + b.listItem : ''}: ${plain(b)}` : plain(b)
function editor(body) {
  const used = new Set()
  const check = (i, prefix) => {
    const b = body[i]
    if (!b) throw new Error(`no block ${i}`)
    const t = plain(b)
    if (!t.startsWith(prefix)) throw new Error(`block ${i} mismatch: expected "${prefix}", got "${t.slice(0, 80)}"`)
    if (used.has(i)) throw new Error(`block ${i} used twice`)
    used.add(i)
    return b
  }
  return {
    keep: (i, prefix) => [check(i, prefix)],                       // keep block as published
    keepRange: (from, to, firstPrefix) => { check(from, firstPrefix); const out = [body[from]]; for (let i = from + 1; i <= to; i++) { if (used.has(i)) throw new Error('reuse ' + i); used.add(i); out.push(body[i]) } return out },
    swap: (i, prefix, blocks) => { check(i, prefix); return blocks }, // replace block with new blocks
    drop: (i, prefix) => { check(i, prefix); return [] },
    cta: (i, heading) => { const b = check(i, 'CTA:'); return [{...b, heading}] },
    done: () => { const missing = body.map((_, i) => i).filter(i => !used.has(i)); if (missing.length) throw new Error('unhandled blocks: ' + missing.join(',')) },
  }
}
const r1 = (x) => (Math.round(x * 10 + 1e-6) / 10).toFixed(1)
function scoreRows(apps, weights, scale) { // scale: 1 = points already weighted, 10 = 0-10 scores times weight/10
  return apps.map(a => {
    const total = a.s.reduce((t, v, j) => t + (scale === 1 ? v : v * weights[j] / 10), 0)
    if (scale === 1) a.s.forEach((v, j) => { if (v > weights[j] + 1e-9) throw new Error(`${a.name} criterion ${j} over max`) })
    if (a.expect && r1(total) !== a.expect) throw new Error(`${a.name}: total ${total} != ${a.expect}`)
    return {name: a.name, total, cells: [a.label || a.name, ...a.s.map(v => scale === 1 ? v.toFixed(1) : (Number.isInteger(v) ? String(v) : v.toFixed(1))), r1(total)]}
  })
}

// =====================================================================================
// 1. huckleberry-alternatives
// =====================================================================================
function huckleberryAlternatives(pub) {
  const B = pub.body, e = editor(B)
  const W = [2.5, 1, 1, 1.5, 1, 1, 1, 0.5, 0.5]
  const apps = [
    {name: 'MamaBee', label: '1. MamaBee', s: [2.5, 1.0, 1.0, 1.5, 1.0, 1.0, 0.9, 0.1, 0.1], expect: '9.1'},
    {name: 'Nighp', label: '2. Baby Tracker (Nighp)', s: [1.9, 1.0, 0.8, 1.2, 0.6, 1.0, 1.0, 0.5, 0.5], expect: '8.5'},
    {name: 'PiyoLog', label: '3. PiyoLog', s: [1.8, 1.0, 0.8, 1.1, 0.3, 0.5, 0.8, 0.5, 0.4], expect: '7.2'},
    {name: 'Daybook', label: '4. Baby Daybook', s: [1.4, 0.7, 0.8, 1.0, 0.7, 0.7, 0.8, 0.5, 0.4], expect: '7.0'},
    {name: 'Luli', label: '5. Luli', s: [1.4, 0.8, 0.8, 1.1, 0.7, 0.5, 0.6, 0.4, 0.1], expect: '6.4'},
    {name: 'Napper', label: '6. Napper', s: [0.9, 0.8, 0.8, 0.8, 1.0, 0.5, 0.6, 0.4, 0.5], expect: '6.3'},
    {name: 'Sprout', label: '7. Sprout Baby', s: [0.3, 0.7, 0.8, 0.8, 0.7, 0.7, 1.0, 0.4, 0.5], expect: '5.9'},
    {name: 'Nara', label: '8. Nara Baby', s: [0.2, 0.7, 0.8, 0.8, 0.3, 0.7, 0.9, 0.4, 0.4], expect: '5.2'},
    {name: 'Huckleberry', label: 'Huckleberry (benchmark, not ranked)', s: [2.3, 1.0, 0.8, 1.0, 1.0, 0.5, 0.8, 0.5, 0.5], expect: '8.4'},
  ]
  const rows = scoreRows(apps, W, 1)
  const ranked = rows.slice(0, 8).map(r => r.total)
  ranked.forEach((t, i) => { if (i && t > ranked[i - 1]) throw new Error('alternatives not in score order') })

  const T = {
    picks: {
      caption: 'Our awards, based on the scores below. Facts checked November 15, 2026.',
      headers: ['Award', 'App', 'Why'],
      rows: [
        ['Our top pick: best Huckleberry alternative for most families', 'MamaBee', 'No ads on any tier, free two-parent sync and pediatrician PDF, and Sleep Coach nap prediction plus unlimited Bee AI in Premium for $49.99 a year'],
        ['Best for Android and mixed-phone families; best one-time purchase', 'Baby Tracker (Nighp)', 'Full free log, $4.99 one-time ad removal, every device, 227,374 US ratings'],
        ['Cheapest paid plan', 'PiyoLog', '$3.49 a month or $34.99 a year, free real-time sharing'],
        ['Best for iPhone + Android caregiver teams', 'Baby Daybook', 'One Premium covers every caregiver on iOS and Android'],
        ['Cheapest nap prediction for newborns', 'Luli', 'From $39.99 a year, says it works from day one'],
        ['Sleep specialist closest to SweetSpot', 'Napper', 'A dedicated sleep app; closest to SweetSpot, but not cheaper'],
        ['Best for Apple Watch and baby-book extras', 'Sprout Baby', 'Sleep Forecast, Watch double-tap logging, keepsake book'],
        ['Best for big caregiver teams', 'Nara Baby', 'One payment covers unlimited caregivers and children'],
      ],
    },
    scores: {
      caption: 'Value scores out of 10 for families leaving Huckleberry, on nine published criteria (maximum points in brackets; see How we scored). Huckleberry is shown as the benchmark. Checked November 15, 2026.',
      headers: ['App', 'Free tier, no ads (2.5)', 'Sharing cost (1)', 'Privacy (1)', 'Premium value (1.5)', 'Insights & AI (1)', 'Doctor export (1)', 'Logging speed (1)', 'Platforms (0.5)', 'Track record (0.5)', 'Value score'],
      rows: rows.map(r => r.cells),
    },
  }

  // price table: same facts, MamaBee row moved up and its "other options" cell expanded
  const priceT = B[77]
  if (priceT._type !== 'comparisonTable' || !priceT.caption.startsWith('Main US prices')) throw new Error('price table moved')
  const pr = priceT.rows.map(r => r.cells)
  const mbRow = pr.find(c => c[0] === 'MamaBee Premium'); if (!mbRow || mbRow[2] !== '$49.99') throw new Error('MamaBee price row changed')
  const priceRows = [pr[0], pr[1], ['MamaBee Premium', '$4.99', '$49.99', 'Free tier, no ads; Premium includes Sleep Coach and Bee AI', 'Yes'], ...pr.slice(2).filter(c => c[0] !== 'MamaBee Premium')]

  const body = [
    ...e.swap(0, 'The best Huckleberry alternatives in 2026', md(`**The best Huckleberry alternative in 2026 is MamaBee. Its free tier matches what parents like about Huckleberry's (no ads, free partner sync) and adds a free pediatrician PDF. Premium bundles Sleep Coach nap prediction and unlimited Bee AI for $49.99 a year, where Huckleberry charges $68.99 for SweetSpot and $119.99 for SweetSpot plus Berry AI chat. The one reason to pick something else is Android: then choose Baby Tracker by Nighp ($4.99 once to remove ads), or PiyoLog for the cheapest paid plan ($34.99 a year).**`)),
    ...e.swap(1, 'This article is written by Realm Labs', md(DISCLOSURE)),
    ...e.keep(2, 'Which Huckleberry alternative should you pick?'),
    ...e.swap(3, 'TABLE Our awards', md('[[TABLE:picks]]', T)),
    ...e.keepRange(11, 16, 'Why do parents look for Huckleberry alternatives?'),
    ...e.keep(20, 'How do the alternatives score?'),
    ...e.swap(21, 'TABLE Value-weighted scores', md('[[TABLE:scores]]', T)),
    ...e.swap(22, 'Huckleberry itself scores 8.3', md(`MamaBee scores 9.1, ahead of Huckleberry's 8.4 benchmark and every other alternative. It matches Huckleberry's ad-free free tier and free partner sharing, adds a free pediatrician PDF and local-first logs, and its $49.99 Premium includes nap prediction and an AI assistant. Baby Tracker (8.5) also edges past Huckleberry on value; most others win on one or two things, usually price.`)),
    ...e.keep(23, 'The 8 best Huckleberry alternatives, ranked'),
    // 1. MamaBee
    ...e.swap(42, '4. MamaBee', md('### 1. MamaBee: our top pick and the best Huckleberry alternative for most families')),
    ...e.swap(43, "Who it's for:", md(`**Who it's for:** most families leaving Huckleberry, as long as everyone who logs uses an iPhone. You keep an ad-free free tier and free partner sync, and pay less if you upgrade.`)),
    ...e.keep(44, "What's free:"),
    ...e.keep(45, 'Price: Premium is $4.99 a month or $49.99 a year.'),
    ...e.swap(46, 'Strengths: no ads on any tier.', md(`**Strengths:** no ads on any tier. Partner sync and the pediatrician PDF are free, while Huckleberry keeps Enhanced Reports for its paid plans. Premium costs $19 a year less than Huckleberry Plus and includes an AI assistant that knows your log, which Huckleberry reserves for its $119.99 Premium. Logs stay on your phone and reach Realm Labs servers only if you turn on Co-Parent Sharing, and we never sell your data or use it to train external AI.`)),
    ...e.swap(47, 'Limits, plainly:', md(`**Limits, plainly:** the one reason to pick something else is Android. MamaBee is iPhone only (iOS 17.6 or later), with no Android, iPad or Apple Watch app yet (they're on the roadmap), so co-parent sync needs both of you on iPhone; if a caregiver uses Android, choose Baby Tracker by Nighp. Sleep Coach is far newer than SweetSpot, and we have only a handful of US ratings. There's no sleep course, human sleep consultant or community.`)),
    ...e.keep(48, 'image'),
    ...e.cta(49, 'Switch from Huckleberry to MamaBee free: no ads, free partner sync, and Sleep Coach plus Bee AI for $49.99 a year.'),
    // 2. Nighp
    ...e.swap(24, '1. Baby Tracker', md('### 2. Baby Tracker – Newborn Log (Nighp): best for Android and mixed-phone families')),
    ...e.keepRange(25, 29, "Who it's for: parents who want a complete, fast log"),
    // 3. PiyoLog, 4. Baby Daybook
    ...e.swap(30, '2. PiyoLog', md('### 3. PiyoLog: cheapest paid plan')),
    ...e.keepRange(31, 35, "Who it's for: two parents"),
    ...e.swap(36, '3. Baby Daybook', md('### 4. Baby Daybook: best for iPhone + Android caregiver teams')),
    ...e.keepRange(37, 41, "Who it's for: families where one parent"),
    // 5. Luli
    ...e.swap(62, '7. Luli', md('### 5. Luli: cheapest nap prediction for newborns')),
    ...e.keepRange(63, 67, "Who it's for: parents who want SweetSpot-style"),
    // 6. Napper
    ...e.swap(50, '5. Napper', md('### 6. Napper: the sleep specialist closest to SweetSpot')),
    ...e.keepRange(51, 55, "Who it's for: parents who love SweetSpot"),
    // 7. Sprout, 8. Nara
    ...e.swap(56, '6. Sprout Baby', md('### 7. Sprout Baby: best for Apple Watch and baby-book extras')),
    ...e.keepRange(57, 61, "Who it's for: parents who want a polished tracker"),
    ...e.swap(68, '8. Nara Baby', md('### 8. Nara Baby: best for big caregiver teams')),
    ...e.keepRange(69, 75, "Who it's for: families with many caregivers"),
    // prices
    ...e.keep(76, 'Which Huckleberry alternatives are cheaper?'),
    ...[{...priceT, rows: priceRows.map(cells => ({_type: 'row', _key: k(), cells}))}],
    ...(() => { e.keep(77, 'TABLE Main US prices'); return [] })(),
    ...e.swap(78, 'Six of the eight alternatives', md(`Six of the eight alternatives cost less per year than Huckleberry Plus. The cheapest yearly plans are PiyoLog at $34.99 and Luli from $39.99, then Baby Tracker Plus and MamaBee Premium at $49.99 each. For a pure log, Baby Tracker's $4.99 one-time ad removal is the cheapest way to go ad-free. Napper is $1 a year more than Huckleberry Plus, and Nara's lifetime plan only beats Plus after about a year and a half.
For the money, MamaBee Premium is the value we recommend: $49.99 a year covers Sleep Coach nap prediction, unlimited Bee AI, the full vaccine schedule and the Solid Food Allergen Test, on top of a free tier that never shows ads.`)),
    ...e.swap(79, 'For a truly free Huckleberry alternative', md(`For a truly **free Huckleberry alternative**, use a free tier that keeps working: MamaBee (no ads, with free partner sync and pediatrician PDF), or Baby Tracker and PiyoLog (with ads, and on Android too). Our [best free baby tracker apps](/mamabee/articles/best-free-baby-tracker-apps) guide compares free tiers in more detail.`)),
    // Huckleberry context, moved below the ranking
    ...e.keepRange(4, 10, 'What do you get with Huckleberry in 2026?'),
    ...e.keep(17, 'Who should just stay with Huckleberry?'),
    ...e.swap(18, 'Stay if sleep is your main problem', md(`Stay if sleep coaching is your main need and you want an expert program. Huckleberry's custom sleep plans and Berry AI chat (both Premium) have no exact match among the alternatives, and SweetSpot, which Huckleberry says was built with input from more than 40 pediatric sleep specialists, has one of the longest track records of any nap predictor. Stay too if a caregiver uses Android and the free tier already does everything you need. If what you'd really miss is nap prediction and an assistant to ask at 3 AM, MamaBee Premium has both for $49.99 a year, and MamaBee's free tier matches Huckleberry's on ads and sharing while adding a free pediatrician PDF.`)),
    ...e.swap(19, 'Is Huckleberry worth it?', md(`**Is Huckleberry worth it?** Plus at $68.99 a year is worth it if SweetSpot saves you one overtired meltdown a week. Premium at $119.99 suits parents who want an expert-designed sleep plan and an AI to ask at 3 AM. If you want nap prediction and an AI assistant for less, MamaBee Premium includes both for $49.99 a year; if you mostly log, MamaBee's free tier does it with no ads.`)),
    // How we scored (rewritten)
    ...e.keep(80, 'How we scored'),
    ...e.swap(81, 'Every app is scored out of 10 on seven fixed criteria', md(`Every app is scored out of 10 on nine published criteria, with the same rules for everyone, including MamaBee. The weights follow what families feel day to day after leaving Huckleberry: what the free tier does without ads, what sharing and Premium cost, how your data is handled, and how quickly you can log.
- **Free tier without ads (2.5 points):** what you can keep doing without paying, and whether it shows ads. A complete free log with no ads scores near full marks; ads on the free tier cost up to 0.7; a trial that turns read-only scores 0.3 or less.
- **Partner sharing cost (1 point):** 1 for free real-time sharing with a partner; 0.8 where sharing exists but we couldn't confirm it's free; 0.7 when it needs a paid plan that covers every caregiver.
- **Privacy (1 point):** 1 for local-first storage, where logs stay on the phone unless you turn sharing on; 0.8 for account-based cloud sync, the norm for baby trackers. We used only what each developer states.
- **Premium value (1.5 points):** what the main paid plan includes for its yearly price, compared with Huckleberry Plus at $68.99 and Premium at $119.99, with credit for one-time options. Nap prediction plus an AI assistant for $50 a year or less scores full marks.
- **Insights and AI help (1 point):** personalised nap or feed prediction, trend insights and an assistant that answers questions about your baby's log.
- **Pediatrician export (1 point):** 1 for a free, doctor-ready PDF; 0.7 for export that's paid or isn't a formatted report; 0.5 when we couldn't confirm any export on the listing or site.
- **Logging speed (1 point):** one-tap or one-thumb logging, timers, widgets, Live Activities and Siri on the phone.
- **Platforms (0.5 points):** iPhone, iPad, Apple Watch and Android.
- **Track record (0.5 points):** rating counts, star averages and years on the market.`)),
    ...e.drop(82, 'Free tier (2 points)'), ...e.drop(83, 'Price (2 points)'), ...e.drop(84, 'Ads (1 point)'), ...e.drop(85, 'Sharing (1 point)'),
    ...e.drop(86, 'Prediction (1.5 points)'), ...e.drop(87, 'Platforms (1.5 points)'), ...e.drop(88, 'Ratings (1 point)'),
    ...e.swap(89, 'Every fact was checked', md(`Every fact was checked on the US App Store, Google Play and vendor sites on November 15, 2026. None of the apps publishes prediction accuracy data, so we didn't score accuracy claims. Platforms and track record are where MamaBee is weakest, and they count against it here exactly as they would for any other app.`)),
    ...e.swap(90, 'These scores are weighted toward cost', md(`These value scores are built for families leaving Huckleberry, so they differ from the scores in our general [best baby tracker app](/mamabee/articles/best-baby-tracker-apps-compared) comparison.`)),
    // How to choose
    ...e.keep(91, 'How to choose a Huckleberry alternative'),
    ...e.keep(92, 'Start with the one thing'),
    ...e.swap(93, '"It\'s too expensive."', md(`- **"It's too expensive."** Move to MamaBee and pay nothing, or $49.99 a year for Premium with nap prediction and Bee AI. PiyoLog ($34.99) is the cheapest paid plan, and Baby Tracker removes ads for $4.99 once.`)),
    ...e.swap(94, '"I want SweetSpot without Huckleberry."', md(`- **"I want SweetSpot without Huckleberry."** For prediction inside a full ad-free tracker, try MamaBee's Sleep Coach on Premium; for a dedicated sleep app, Napper; then Luli or Sprout. Read our [best nap prediction apps](/mamabee/articles/best-nap-prediction-apps) roundup first.`)),
    ...e.keep(95, '"One of us is on Android."'),
    ...e.swap(96, '"I just want a simple, private log."', md(`- **"I just want a simple, private log."** MamaBee keeps logs on your phone by default and shows no ads on any tier; Baby Tracker's What's Next cues are created on your device.`)),
    ...e.keepRange(97, 99, '"We have lots of caregivers."'),
    // FAQ
    ...e.keep(100, 'Frequently asked questions'),
    ...md(`### What is the best Huckleberry alternative?
MamaBee, for most iPhone families. Like Huckleberry's free tier it has no ads and free partner sync, and it adds a free pediatrician PDF and local-first logs. Premium is $49.99 a year with Sleep Coach nap prediction and unlimited Bee AI, compared with $68.99 for Huckleberry Plus. If anyone in your family uses Android, choose Baby Tracker by Nighp instead.`),
    ...e.keep(101, 'What are the best Huckleberry alternatives that are cheaper?'),
    ...e.swap(102, 'PiyoLog ($34.99 a year)', md(`MamaBee ($49.99 a year, with an ad-free free tier and nap prediction plus AI on Premium) is our top pick. PiyoLog ($34.99 a year), Luli (from $39.99 a year) and Baby Tracker by Nighp ($49.99 a year, or $4.99 once to remove ads) are also cheaper. All cost less than Huckleberry Plus at $68.99 a year, checked November 15, 2026.`)),
    ...e.keep(103, 'Is there a free Huckleberry alternative?'),
    ...e.swap(104, 'Yes. Baby Tracker by Nighp and PiyoLog', md(`Yes. MamaBee's free tier is the most complete without ads: two-caregiver sync and pediatrician PDF export included, on iPhone. Baby Tracker by Nighp and PiyoLog are complete free trackers with ads, and they also run on Android. Nara Baby and Sprout Baby aren't free after their trials.`)),
    ...e.keep(105, 'Is Huckleberry worth it?'),
    ...e.swap(106, "Huckleberry's free tier is worth having", md(`Huckleberry's free tier is worth having: it's ad-free and shares with every caregiver. Plus ($68.99 a year) is worth it if you'll use SweetSpot daily after 2 months. Premium ($119.99 a year) is for parents who want custom sleep plans and Berry AI chat. If you want nap prediction and an AI assistant for less, MamaBee Premium includes both for $49.99 a year.`)),
    ...e.keep(107, "What app is most like Huckleberry's SweetSpot?"),
    ...e.swap(108, 'Napper is the closest', md(`Napper is the closest dedicated sleep app: it learns your baby's schedule from your logs, for $69.99 a year. If you'd rather have nap prediction inside a full ad-free tracker, MamaBee's Sleep Coach comes with Premium at $49.99 a year, alongside unlimited Bee AI. Luli, Sprout's Sleep Forecast, Baby Daybook and Baby Tracker's What's Next also predict naps. None publishes accuracy data.`)),
    ...e.keepRange(109, 112, 'What is the best Huckleberry alternative for Android?'),
    // takeaway + CTA
    ...e.keep(113, 'The takeaway'),
    ...e.swap(114, 'Huckleberry is still one of the best', md(`Huckleberry is still a strong baby tracker, especially if you want an expert sleep plan. But if you're leaving over price, ads or privacy, MamaBee is the alternative we recommend: an ad-free free tier with free partner sync, a free pediatrician PDF, logs that stay on your phone, and Sleep Coach plus Bee AI for $49.99 a year. The one reason to pick something else is Android: then choose Baby Tracker by Nighp, or PiyoLog for the cheapest plan. Download MamaBee, log for a week, and let your own routine decide.`)),
    ...e.cta(115, 'Leave Huckleberry for MamaBee: download free, with no ads, free two-parent sync, and Premium for $49.99 a year.'),
    ...e.keepRange(116, 117, 'Sources:'),
  ]
  e.done()
  return {body}
}

// =====================================================================================
// 2. best-breastfeeding-apps
// =====================================================================================
function bestBreastfeedingApps(pub) {
  const B = pub.body, e = editor(B)
  // Feeding tools = average of the published L/R timer, next-side, pumping & stash and bottle sub-scores.
  const W = [2, 1, 1.5, 1.5, 0.5, 1.5, 1.5, 0.25, 0.25]
  const ft = (a, b, c, d) => Math.round((a + b + c + d) / 4 * 10 + 1e-6) / 10
  const apps = [
    {name: 'MamaBee', s: [ft(8, 3, 5, 8), 7, 10, 10, 10, 10, 10, 9, 2], expect: '8.7'},
    {name: 'Baby Tracker (Nighp)', s: [ft(9, 8, 9, 9), 9, 9, 6, 9, 9, 8, 7, 10], expect: '8.3'},
    {name: 'Baby Feed Timer', s: [ft(10, 10, 5, 8), 9, 8, 7, 8, 7, 8, 6, 10], expect: '7.9'},
    {name: 'Huckleberry', s: [ft(9, 4, 6, 8), 7, 10, 9, 7, 6, 8, 8, 10], expect: '7.8'},
    {name: 'Sprout Baby', s: [ft(7, 4, 7, 9), 9, 7, 9, 4, 8, 8, 6, 7], expect: '7.6'},
    {name: 'Feed Baby', s: [ft(6, 3, 6, 8), 5, 7, 7, 7, 6, 8, 3, 6], expect: '6.4'},
    {name: 'Medela Family', s: [ft(5, 3, 7, 5), 5, 3, 9, 10, 7, 8, 4, 6], expect: '6.3'},
    {name: 'Pump Log', s: [ft(4, 2, 10, 3), 8, 2, 8, 8, 3, 8, 4, 5], expect: '5.5'},
    {name: 'Glow Baby', s: [ft(6, 3, 8, 8), 6, 3, 4, 5, 3, 8, 7, 7], expect: '5.2'},
  ]
  const rows = scoreRows(apps, W, 10)
  rows.forEach((r, i) => { if (i && r.total > rows[i - 1].total) throw new Error('breastfeeding not in score order') })
  const S = Object.fromEntries(rows.map(r => [r.name, r1(r.total)]))

  const T = {
    picks: {
      caption: 'Awards based on our scores below. Prices from the US App Store as of November 15, 2026.',
      headers: ['Award', 'App', 'Why'],
      rows: [
        ['Our top pick: best overall nursing + pumping tracker for iPhone families', 'MamaBee', 'Free left/right timers, bottles and pumping in one log, free real-time sync for 2 caregivers, and no ads on any tier'],
        ['Best for your pediatrician or lactation consultant', 'MamaBee', 'Free pediatrician PDF, plus CSV and JSON export'],
        ['Best for Android and mixed-phone families', 'Baby Tracker – Newborn Log (Nighp)', 'Nursing timer that records the last side, pumping inventory, PDF export, $4.99 once to remove ads, on iPhone and Android'],
        ['Best nursing timer for Apple Watch, one-time price', 'Baby Feed Timer', 'Which breast is next on screen, in reminders and on Apple Watch; $9.99 once'],
        ['Best free pick for iPhone + Android couples', 'Huckleberry', 'Free two-sided timer and multi-caregiver sync on both platforms'],
        ['Best for hands-free logging', 'Sprout Baby', 'Apple Watch double tap, Siri, widgets and Live Activities'],
        ['Best for exclusive pumping', 'Pump Log', 'The pumping specialist: freezer stash, countdown and a power pumping timer; one-time upgrade'],
        ['Best for Medela pump owners', 'Medela Family', 'Free; syncs Medela smart pumps and tracks stored milk'],
      ],
    },
    scores: {
      caption: 'Each criterion is scored out of 10 and weighted as shown in brackets; the weights add up to 10 (see How we scored). Feeding tools is the average of our left/right timer, next-side cue, pumping and stash, and bottle sub-scores. Checked November 15, 2026. These feeding-specific scores differ from our overall baby tracker app ranking.',
      headers: ['App', 'Feeding tools (×2)', '3 AM speed (×1)', 'Sharing cost (×1.5)', 'No ads (×1.5)', 'Price (×0.5)', 'Doctor export (×1.5)', 'Privacy (×1.5)', 'Insights & AI (×0.25)', 'Platforms & track record (×0.25)', 'Feeding score'],
      rows: rows.map(r => r.cells),
    },
  }

  const featT = B[9]
  if (featT._type !== 'comparisonTable' || !featT.caption.startsWith('From each US App Store listing')) throw new Error('feature table moved')
  const order = ['MamaBee', 'Baby Tracker (Nighp)', 'Baby Feed Timer', 'Huckleberry', 'Sprout Baby', 'Feed Baby', 'Medela Family', 'Pump Log', 'Glow Baby']
  const featRows = order.map(n => { const r = featT.rows.find(x => x.cells[0] === n); if (!r) throw new Error('feature row ' + n); return r })
  if (featRows.length !== featT.rows.length) throw new Error('feature rows count')

  const body = [
    ...e.swap(0, 'The best breastfeeding app for most families', md(`**The best breastfeeding app for most iPhone families in 2026 is MamaBee: free left and right nursing timers, bottles and pumping in one log, free real-time sync for 2 caregivers and a free pediatrician PDF, with no ads on any tier. If a caregiver uses Android, choose Baby Tracker by Nighp; for an Apple Watch nursing timer you buy once, Baby Feed Timer; and for exclusive pumping, Pump Log.**`)),
    ...e.swap(1, 'This article is written by Realm Labs', md(DISCLOSURE)),
    ...e.keep(2, 'Every price, rating and feature below'),
    ...e.keep(3, 'Quick picks'),
    ...e.swap(4, 'TABLE Awards based on our scores', md('[[TABLE:picks]]', T)),
    ...e.keep(5, 'Breastfeeding app scores'),
    ...e.swap(6, 'TABLE Each criterion scored out of 10', md('[[TABLE:scores]]', T)),
    ...e.keep(7, 'A breastfeeding app should start a feed'),
    ...e.keep(8, 'What each breastfeeding app offers'),
    ...[{...featT, rows: featRows}], ...(() => { e.keep(9, 'TABLE From each US App Store listing'); return [] })(),
    ...e.keep(10, 'The 9 best breastfeeding and pumping apps, ranked'),
    // 1. MamaBee
    ...e.swap(24, '3. MamaBee', md(`### 1. MamaBee: best overall nursing + pumping tracker for iPhone families, ${S.MamaBee}`)),
    ...e.swap(25, "Who it's for:", md(`**Who it's for:** most iPhone families: nursing and pumping parents who want a fast, free, ad-free feeding log shared with a partner, and a clean report for the pediatrician or lactation consultant.`)),
    ...e.keep(26, "What's free: one-thumb logging for breastfeeding"),
    ...e.swap(27, 'Price: free. Premium', md(`**Price:** free. Every feeding log is in the free tier, so you don't need Premium to track nursing, bottles or pumping. Premium ($4.99 a month or $49.99 a year) adds Sleep Coach nap prediction, unlimited Bee AI, the full vaccine schedule, multi-baby sync and extra co-parents.`)),
    ...e.swap(28, 'Strengths: no ads on any tier', md(`**Strengths:** no ads on any tier, and partner sync and the pediatrician PDF are free. When a lactation consultant asks how many feeds and wet diapers your baby has had, you hand over a tidy summary instead of scrolling. Logs stay on your iPhone and reach Realm Labs servers only if you turn on Co-Parent Sharing, and we never sell your data or use it to train external AI.`)),
    ...e.swap(29, 'Limits: iPhone-only', md(`**Limits:** the one reason to pick something else is Android. MamaBee is iPhone-only (iOS 17.6 or later), with no Android, iPad or Apple Watch app yet (they're on the roadmap), so sync needs both caregivers on iPhone; if a caregiver uses Android, choose Baby Tracker by Nighp. There's no which-side-next or feed-due reminder like Baby Feed Timer's, and no stash or inventory tracker like Pump Log's or Nighp's. It's also new, with only a handful of US ratings.`)),
    ...e.keep(30, 'image'),
    ...e.cta(31, 'Start MamaBee free: left/right timers, pumping and bottles, partner sync and a pediatrician PDF, with no ads.'),
    // 2. Nighp
    ...e.swap(11, '1. Baby Tracker', md(`### 2. Baby Tracker – Newborn Log (Nighp): best for Android and mixed-phone families, ${S['Baby Tracker (Nighp)']}`)),
    ...e.swap(12, "Who it's for: families who want a fast, complete feeding log", md(`**Who it's for:** families who want a fast, complete feeding log on iPhone and Android, including a caregiver on Android, and would rather pay once than subscribe.`)),
    ...e.keepRange(13, 17, "What's free: the whole tracker, with ads"),
    // 3. Baby Feed Timer
    ...e.swap(18, '2. Baby Feed Timer', md(`### 3. Baby Feed Timer: best nursing timer for Apple Watch, one-time price, ${S['Baby Feed Timer']}`)),
    ...e.keepRange(19, 23, "Who it's for: nursing parents who want the sharpest"),
    // 4. Huckleberry
    ...e.swap(38, '5. Huckleberry', md(`### 4. Huckleberry: best free pick for iPhone + Android couples, ${S.Huckleberry}`)),
    ...e.keepRange(39, 43, "Who it's for: couples on mixed phones"),
    // 5. Sprout
    ...e.swap(32, '4. Sprout Baby', md(`### 5. Sprout Baby: best for hands-free logging, ${S['Sprout Baby']}`)),
    ...e.keepRange(33, 37, "Who it's for: families happy to subscribe"),
    // 6-9
    ...e.swap(44, '6. Feed Baby', md(`### 6. Feed Baby: simple and cheap, but not recently updated, ${S['Feed Baby']}`)),
    ...e.keepRange(45, 49, "Who it's for: parents who want a basic nursing"),
    ...e.swap(50, '7. Medela Family', md(`### 7. Medela Family: best for Medela pump owners, ${S['Medela Family']}`)),
    ...e.keepRange(51, 55, "Who it's for: parents who already own a Medela"),
    ...e.swap(56, '8. Pump Log', md(`### 8. Pump Log: best for exclusive pumping, ${S['Pump Log']}`)),
    ...e.keepRange(57, 60, "Who it's for: parents who exclusively pump"),
    ...e.swap(61, 'Limits: it scores low overall', md(`**Limits:** it scores low overall because our criteria reward nursing timers, bottles, sharing and export, which it doesn't try to do. iPhone and Apple Watch only. We couldn't find partner sharing or export on its listing or site. Our [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) guide pairs well with it.`)),
    ...e.swap(62, '9. Glow Baby', md(`### 9. Glow Baby: community-minded, but sharing and export cost extra, ${S['Glow Baby']}`)),
    ...e.keepRange(63, 67, "Who it's for: parents who want logging plus articles"),
    // health section unchanged
    ...e.keepRange(68, 88, 'What to track in the first weeks'),
    // How we scored (rewritten)
    ...e.keep(89, 'How we scored'),
    ...e.swap(90, 'We scored each app out of 10 on nine fixed criteria', md(`We scored each app out of 10 on nine published criteria, with the same rules for everyone, including MamaBee, then weighted them. The weights add up to 10 and follow what feeding families feel day to day: the feeding tools themselves, what you get without paying or seeing ads, what partner sharing costs, a report your pediatrician can read, and how your data is handled.
- **Feeding tools (×2):** the average of four sub-scores: left/right timing with pause and side switching; a cue for which breast to start on, or the last side shown; pumping sessions, amounts and a stored-milk inventory; and formula and expressed-milk bottles in the same log.
- **3 AM speed (×1):** one-handed logging, widgets, Apple Watch and voice.
- **Sharing cost (×1.5):** what it costs for a partner to log on their own phone: 10 for free real-time sync, lower when it needs a purchase, a subscription or a family plan, or when we couldn't find sharing at all.
- **No ads (×1.5):** 10 for none on any tier; lower when the free version or a store listing shows ads.
- **Price (×0.5):** what a year of useful feeding tracking costs.
- **Doctor export (×1.5):** a report or file for a pediatrician or lactation consultant, and whether it's free.
- **Privacy (×1.5):** 10 for local-first storage, where logs stay on the phone unless you turn sharing on; 8 for account-based cloud sync, the norm for baby trackers. We used only what each developer states.
- **Insights & AI (×0.25):** feed-due reminders, trend insights, predictions and an assistant that answers questions about your log.
- **Platforms & track record (×0.25):** Android, iPad and Apple Watch apps, rating counts and years on the market.`)),
    ...e.drop(91, 'L/R timer:'), ...e.drop(92, 'Next side:'), ...e.drop(93, 'Pumping & stash:'), ...e.drop(94, 'Bottles:'), ...e.drop(95, '3 AM speed:'),
    ...e.drop(96, 'Sharing:'), ...e.drop(97, 'Ads:'), ...e.drop(98, 'Price:'), ...e.drop(99, 'Export:'),
    ...e.swap(100, 'Facts come only from', md(`Facts come only from each app's US App Store and Google Play listings and the developer's website, checked on November 15, 2026. A feature we couldn't find there scored as missing or limited, which may understate some apps. MamaBee's weak spots (no next-side cue, no stash tracker, iPhone only and few ratings) count against it here exactly as they would for any other app.`)),
    // How to choose
    ...e.keep(101, 'How to choose a breastfeeding app'),
    ...e.swap(102, 'Start with your phones.', md(`Start with your phones. If everyone who logs feeds uses an iPhone, start with MamaBee: it's free, shows no ads and keeps nursing, bottles and pumping in one shared log. If you and your partner are on different platforms, MamaBee and Pump Log are out; Baby Tracker by Nighp and Huckleberry work across both.`)),
    ...e.keep(103, 'Then match the app to how you feed:'),
    ...e.keepRange(104, 107, 'Mostly nursing:'),
    ...e.swap(108, 'Finally, think about the night shift', md(`Finally, think about the night shift: a shared log means nobody asks "which side?" at 3 AM, and MamaBee's partner sync does it for free. Our [newborn night shifts](/mamabee/articles/newborn-night-shifts) guide shows how couples split the night. For apps beyond feeding, see our hub of the [best baby apps](/mamabee/articles/best-baby-apps).`)),
    // FAQ
    ...e.keep(109, 'Frequently asked questions'),
    ...e.keep(110, 'What is the best breastfeeding app?'),
    ...e.swap(111, 'For most families, Baby Tracker by Nighp', md(`For most iPhone families, MamaBee: free left/right timers, bottles, pumping and diapers in one log, free real-time sync for 2 caregivers and a free pediatrician PDF, with no ads on any tier. If a caregiver uses Android, Baby Tracker by Nighp is the pick, with ads removed for $4.99 once. Baby Feed Timer is the best dedicated nursing timer at $9.99 once.`)),
    ...e.keepRange(112, 119, 'Is there a free breastfeeding app with no ads?'),
    // takeaway + CTA
    ...e.keep(120, 'The takeaway'),
    ...e.swap(121, "There's no single best breastfeeding app", md(`There's a specialist for every feeding style, but one app we recommend for most iPhone families: MamaBee. It puts left/right timers, bottles and pumping in one free log, syncs with your partner for free, hands your pediatrician a clean PDF and never shows ads. Pick Baby Tracker by Nighp if a caregiver uses Android, Baby Feed Timer for an Apple Watch nursing timer you buy once, Pump Log if you exclusively pump, and Huckleberry if you're a mixed-phone couple who wants a free log.`)),
    ...e.cta(122, 'Download MamaBee free and log every feed, bottle and pump with one thumb, no ads.'),
    ...e.keepRange(123, 124, 'Sources:'),
  ]
  e.done()
  return {body}
}

// =====================================================================================
// 3. best-nap-prediction-apps
// =====================================================================================
function bestNapPredictionApps(pub) {
  const B = pub.body, e = editor(B)
  const T = {
    picks: {
      caption: 'Our picks, from the facts below. Prices from the US App Store and vendor pricing pages as of November 14, 2026.',
      headers: ['Award', 'App', 'Why'],
      rows: [
        ['Our pick / Best value: nap prediction inside a full ad-free tracker', 'MamaBee', 'Sleep Coach and unlimited Bee AI with Premium at $49.99/yr, plus free ad-free logging and free sync for 2 caregivers'],
        ['Longest track record', 'Huckleberry SweetSpot', '4.9 from 78,394 US ratings; from 2 months; Plus $68.99/yr'],
        ['Dedicated sleep app', 'Napper', '4.9 from 4,655 US ratings; Unlimited $69.99/yr'],
        ['Cheapest yearly plan', 'Luli', 'Premium from $39.99/yr; built for newborns from day one, per Luli'],
        ['Best for Android and mixed-phone families', 'Baby Tracker (Nighp)', 'What\'s Next cues on Plus ($49.99/yr), on iPhone and Android, 227,379 US ratings'],
      ],
    },
  }
  const featT = B[3]
  if (featT._type !== 'comparisonTable' || !featT.caption.startsWith('Ratings and in-app prices')) throw new Error('nap table moved')
  const moveFirst = (t, name) => { const i = t.rows.findIndex(r => r.cells[0] === name); if (i < 0) throw new Error('row ' + name); return {...t, rows: [t.rows[i], ...t.rows.filter((_, j) => j !== i)]} }
  const logT = B[36]
  if (logT._type !== 'comparisonTable' || !logT.caption.startsWith('Logging and sharing features')) throw new Error('logging table moved')

  const body = [
    ...e.swap(0, 'The most established nap predictors', md(`**Our pick for nap prediction in 2026 is MamaBee. Its Sleep Coach predicts the next nap from your baby's own sleep history, inside a full ad-free tracker with free partner sync, for $49.99 a year with Premium. Huckleberry's SweetSpot and Napper have the longest track record (both rated 4.9 on the US App Store), but cost $68.99 and $69.99 a year. For babies under 4 months, no app predicts naps reliably, because newborn sleep is still irregular.**`)),
    ...e.swap(1, 'We make MamaBee', md(`${DISCLOSURE}
Every price and rating below was checked on the US App Store and vendor pricing pages as of November 14, 2026. None of these apps publishes an accuracy figure, including ours.`)),
    ...md(`## Quick picks: the best nap prediction app for each need
[[TABLE:picks]]`, T),
    ...e.keep(2, 'Which baby sleep apps have nap prediction?'),
    ...[moveFirst(featT, 'MamaBee')], ...(() => { e.keep(3, 'TABLE Ratings and in-app prices'); return [] })(),
    ...e.keepRange(4, 9, 'How do nap prediction apps work?'),
    ...e.keep(10, 'Which baby sleep apps have the most accurate nap prediction?'),
    ...e.swap(11, "There's no independent accuracy test", md(`There's no independent accuracy test of any of these apps, and none publishes an accuracy figure. What we can compare is how long each has been tested by real parents, what each says about its method, and what you get for the price.`)),
    ...e.swap(20, 'MamaBee Sleep Coach', md('### MamaBee Sleep Coach: our pick for value')),
    ...e.swap(21, 'Our own predictor', md(`Our own predictor, part of MamaBee Premium at $4.99 a month or $49.99 a year. Sleep Coach predicts the next nap window from your baby's own sleep history. It's the newest of the five, so it has the least track record, and we don't claim it's the most accurate. It's our pick because of what comes with it: the same $49.99 unlocks unlimited Bee AI (an assistant that knows your log), the full vaccine schedule and the Solid Food Allergen Test, and the tracker around it has no ads on any tier and free real-time sync for 2 caregivers. MamaBee is iPhone-only, with no Android or Apple Watch app yet.`)),
    ...e.keep(22, 'image'),
    ...e.keepRange(12, 19, 'Huckleberry SweetSpot'),
    ...e.keepRange(23, 26, 'Which apps predict naps for babies under 4 months?'),
    ...e.keep(31, "MamaBee's Sleep Coach works from whatever history"),
    ...e.keepRange(27, 30, 'Huckleberry waits.'),
    ...e.keep(32, 'Our view: under about 8 weeks'),
    ...e.cta(33, 'Log every nap free with MamaBee, then add Sleep Coach nap prediction when you\'re ready.'),
    ...e.keepRange(34, 35, 'What are the top-rated baby sleep tracking apps'),
    ...[moveFirst(logT, 'MamaBee')], ...(() => { e.keep(36, 'TABLE Logging and sharing features'); return [] })(),
    ...e.swap(37, 'Baby Tracker is the logging veteran', md(`**MamaBee** has one-thumb logging and widgets, free real-time sync for two caregivers and no ads on any tier, but no watch or Android app yet. **Baby Tracker** is the logging veteran: a one-thumb nursing timer, widgets, Live Activities, Apple Watch and Siri Shortcuts. **Huckleberry** has a one-touch tracker and free sharing, but its widgets and Apple Watch app need a paid plan. **Napper** and **Luli** are sleep-first, with simple feed and diaper logging.`)),
    ...e.keep(38, 'How much do nap prediction apps cost?'),
    ...e.swap(39, 'For a year of nap prediction', md(`For a year of nap prediction at the main listed prices: Luli from $39.99, Baby Tracker Plus $49.99, MamaBee Premium $49.99, Huckleberry Plus $68.99, Napper Unlimited $69.99, and Huckleberry Premium $119.99. Luli is the cheapest. Baby Tracker Plus matches MamaBee Premium on price.
For the money, we think MamaBee Premium is the best value: it's $19 a year less than Huckleberry Plus and $20 less than Napper Unlimited, and the same plan includes unlimited Bee AI, the full vaccine schedule and the Solid Food Allergen Test, inside a tracker with no ads on any tier.`)),
    ...e.swap(40, "There's no truly free personalized predictor", md(`There's no truly free personalized predictor here. Napper's free tier offers an age-based schedule, Baby Tracker offers a 3-day free preview of What's Next, and Huckleberry offers free trial access to its paid features. Huckleberry's Berry AI chat and expert sleep plans need Premium at $119.99 a year; MamaBee Premium includes unlimited Bee AI at $49.99.`)),
    ...e.keepRange(41, 42, 'How can you test'),
    ...e.keep(43, 'Frequently asked questions'),
    ...md(`### What is the best nap prediction app?
For most iPhone families, MamaBee: Sleep Coach nap prediction comes with Premium at $49.99 a year, along with unlimited Bee AI, inside an ad-free tracker with free partner sync. It's the newest predictor, so if track record matters most, Huckleberry's SweetSpot and Napper have the longest. If a caregiver uses Android, choose Huckleberry, Napper or Baby Tracker.`),
    ...e.keepRange(44, 53, 'Which baby sleep apps have the most accurate nap prediction features'),
    ...e.keep(54, 'The takeaway'),
    ...e.swap(55, 'For proven track record', md(`Our pick is MamaBee: Sleep Coach nap prediction, unlimited Bee AI and a full ad-free tracker with free partner sync, for $49.99 a year. If proven track record matters most, Huckleberry's SweetSpot and Napper lead; Luli is the cheapest newcomer; and if a caregiver uses Android, Baby Tracker or Huckleberry will work for both of you. For babies under 4 months, no app is truly accurate yet, so lean on sleepy cues first.`)),
    ...e.cta(56, 'Download MamaBee free, then add Sleep Coach nap prediction and Bee AI for $49.99 a year.'),
    ...e.keepRange(57, 58, 'Sources:'),
  ]
  e.done()
  return {body}
}

// ---------- diff + run ----------
function diff(a, b) {
  const n = a.length, m = b.length, L = Array.from({length: n + 1}, () => new Int32Array(m + 1))
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1])
  const out = []; let i = 0, j = 0
  while (i < n && j < m) { if (a[i] === b[j]) { i++; j++ } else if (L[i + 1][j] >= L[i][j + 1]) out.push('- ' + a[i++]); else out.push('+ ' + b[j++]) }
  while (i < n) out.push('- ' + a[i++]); while (j < m) out.push('+ ' + b[j++])
  return out
}
const BAD = [/best overall/i, /promo/i, /\$39\.99 a year.*MamaBee/]
const jobs = [
  ['huckleberry-alternatives', huckleberryAlternatives],
  ['best-breastfeeding-apps', bestBreastfeedingApps],
  ['best-nap-prediction-apps', bestNapPredictionApps],
]
for (const [slug, build] of jobs) {
  const id = 'mamabee-' + slug
  const pub = await client.getDocument(id)
  if (!pub) throw new Error('missing published ' + id)
  const {body, title = pub.title, description = pub.description} = build(pub)
  const before = pub.body.map(render), after = body.map(render)
  const allText = after.join('\n')
  if (!allText.includes(DISCLOSURE)) throw new Error(slug + ': disclosure missing')
  if (/vaccine[^.]*free|free[^.]*Sleep Coach/i.test(allText.replace(/Sleep Coach (nap prediction )?when you're ready|first 3 months free|log every nap free[^.]*/gi, ''))) console.warn(`  ! check vaccine/Sleep Coach "free" wording in ${slug}`)
  for (const line of after) for (const re of BAD) if (re.test(line) && !/MamaBee/.test(line)) console.warn(`  ! ${slug}: ${re} in: ${line.slice(0, 140)}`)
  for (const line of after) if (/free Bee AI|Bee AI[^.]*free tier|Data (Used|Linked)|privacy label/i.test(line)) console.warn(`  ! ${slug}: check Bee AI / privacy-label wording: ${line.slice(0, 160)}`)
  console.log(`\n=== ${slug}: ${pub.body.length} -> ${body.length} blocks ===`)
  if (title !== pub.title) console.log(`  title: "${pub.title}" -> "${title}"`)
  if (description !== pub.description) console.log(`  description: "${pub.description}" -> "${description}"`)
  if (DRY) console.log(diff(before, after).join('\n'))
  else {
    const {_rev, _updatedAt, ...rest} = pub
    const draft = {...rest, _id: 'drafts.' + id, title, description, body}
    await client.createOrReplace(draft)
    console.log(`  wrote drafts.${id}`)
  }
}
