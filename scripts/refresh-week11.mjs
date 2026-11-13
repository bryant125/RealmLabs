// Week-11 refresh of two LIVE English MamaBee articles that sit on page 2 of Google:
//   A) mamabee-best-baby-tracker-apps-compared  ("baby tracker app", "baby log app", "best newborn tracker app")
//   B) mamabee-newborn-night-shifts             ("newborn night shift schedule", "how to do shifts with newborn")
// Slugs are NOT changed. Images, CTAs and existing tables are kept; blocks are replaced or
// inserted by _key. Competitor prices/ratings re-verified on the US App Store, Nov 14 2026:
//   Huckleberry 4.9 (78.6K): Plus $11.99/mo, $68.99/yr; Premium $14.99/mo, $119.99/yr;
//     free tier now includes a solids log with allergens; SweetSpot is Plus (2+ months).
//   PiyoLog 4.9 (2.7K): Premium $3.49/mo, $34.99/yr.
//   Baby Tracker (Nighp) 4.8 (227K): Remove Ads $4.99 once; new Baby Tracker Plus $5.99/mo,
//     $49.99/yr with "What's Next" on-device AI timing cues; Apple Watch app.
// Usage:
//   node scripts/refresh-week11.mjs --dry     (default) print before/after outline
//   node scripts/refresh-week11.mjs --apply   patch the published docs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
const APPLY = process.argv.includes('--apply')

const k = () => randomUUID().replace(/-/g, '').slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+k();if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}

// ---- body operations (all addressed by existing _key) ----
// replace: swap one block for new blocks (a single replacement keeps the old _key)
// before/after: insert new blocks next to an existing block
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

// ==================================================================================
// A) Best baby tracker app
// ==================================================================================
const A = {
  id: 'mamabee-best-baby-tracker-apps-compared',
  title: 'Best Baby Tracker App 2026: 4 Baby Log Apps Tested & Compared',
  description: 'The best baby tracker app in 2026 depends on your problem. Huckleberry, PiyoLog, Baby Tracker and MamaBee compared on price, sleep charts and partner sync.',
  tags: ['best baby tracker app', 'baby tracker app', 'baby log app', 'best newborn tracker app', 'baby sleep tracker app', 'huckleberry alternative', 'piyolog review', 'baby tracker app comparison'],
  ops: [
    // Answer-first bold opener
    {before: 'bff02888', md: `**The best baby tracker app depends on what you need most. Huckleberry is best for nap prediction (from $68.99 a year). PiyoLog is the best cheap, complete log, and it runs on Android. Baby Tracker is best if you hate subscriptions ($4.99 once to remove ads). MamaBee is best for a complete free tier with no ads, on iPhone.**`},
    // 30-second answer
    {replace: 'f586da1b', md: `- **Your baby's sleep is the crisis, and money is not** — Huckleberry. Its SweetSpot nap prediction is the most refined sleep engine on the market. It starts in Plus at $68.99 a year; Premium with Berry AI is $119.99.`},
    {replace: '19818b98', md: `- **Subscriptions make your eye twitch** — Baby Tracker by Nighp. One $4.99 payment still removes ads, forever. 227,000 ratings at 4.8 stars do not lie. (A newer, optional Plus subscription adds AI timing cues.)`},
    // "Four things only one app here does" is no longer accurate (Huckleberry's free solids log tracks allergens)
    {replace: 'b8f80b4d', md: `## Four things that set MamaBee apart`},
    {replace: '27fd2ec1', md: `Before the detail, here is where MamaBee does something the others do not, or does it differently.`},
    {replace: '73a7a801', md: `- **A complete free tier with no advertising in it.** PiyoLog and Baby Tracker are both funded by ads until you pay. Huckleberry's free tier has no ads, but SweetSpot, Insights and its AI sit behind Plus and Premium. MamaBee's free tier is a complete tracker with no ads, on any tier, ever.`},
    {replace: '4881a92b', md: `- **AI chat for $49.99 a year.** Huckleberry's Berry AI requires the $119.99 Premium tier. MamaBee Premium is $49.99 — less than Huckleberry Plus — and includes unlimited Bee AI plus nap prediction.`},
    {replace: '5379d393', md: `- **A structured allergen test, not just a food log.** Huckleberry's free solids log does track allergens and reactions, and that is genuinely good. MamaBee's Solid Food Allergen Test (Premium) structures peanut, egg, dairy, wheat, soy and fish by introductions, exposure counts and outcomes. PiyoLog and Baby Tracker have no dedicated allergen tracker.`},
    // Main comparison table, re-verified
    T('c4648fc7', {
      caption: 'Verified on the US App Store, as of November 2026.',
      headers: ['', 'Huckleberry', 'PiyoLog', 'Baby Tracker', 'MamaBee'],
      rows: [
        ['Rating', '4.9 (79K)', '4.9 (2.7K)', '4.8 (227K)', 'New'],
        ['Free tier', 'Logging, summaries, solids log', 'Full, with ads', 'Full, with ads', 'Full, no ads'],
        ['Cheapest paid', '$68.99/yr', '$34.99/yr', '$4.99 once (removes ads)', '$49.99/yr'],
        ['Top tier', '$119.99/yr', '$34.99/yr', '$49.99/yr (Plus)', '$49.99/yr — one tier'],
        ['Nap prediction', 'Plus and Premium', 'No', 'Plus (What\'s Next cues)', 'Premium'],
        ['AI chat', 'Premium only', 'No', 'No', 'Free, unlimited on Premium'],
        ['Allergen tracking', 'Free (solids log)', 'No', 'No', 'Premium (structured test)'],
        ['Sleep charts and trends', 'Free summaries; trend reports in Plus', 'Weekly graphs', 'Day, week and month charts', '7-day free; 30/90/365-day Premium'],
        ['Partner sync', 'Yes', 'Real-time, free', 'Yes (sync group)', 'Real-time, 2 caregivers free'],
        ['Apple Watch', 'No', 'Yes', 'Yes', 'No'],
        ['Android', 'Yes', 'Yes', 'Yes', 'No (iPhone only)'],
        ['Ads', 'None', 'Free tier', 'Free tier', 'None'],
        ['Export', 'Reports', 'Summaries', 'PDF + print', 'CSV, JSON, PDF'],
      ],
    }),
    {after: 'c4648fc7', md: `Going deeper on one matchup? See [Huckleberry vs Baby Tracker](/mamabee/articles/huckleberry-vs-baby-tracker), [Luli vs Napper](/mamabee/articles/luli-vs-napper), the [best nap prediction apps](/mamabee/articles/best-nap-prediction-apps), [MamaBee vs PiyoLog](/mamabee/articles/mamabee-vs-piyolog) and the [best free baby tracker apps](/mamabee/articles/best-free-baby-tracker-apps).`},
    // Cost tables
    T('bc4607af', {
      caption: 'Three-year cost of ownership, annual plans, US App Store prices as of November 2026. Monthly billing costs more.',
      headers: ['App', 'Year 1', '3 years', '3 years (monthly billing)'],
      rows: [
        ['Huckleberry Premium', '$119.99', '$359.97', '$539.64'],
        ['Huckleberry Plus', '$68.99', '$206.97', '$431.64'],
        ['PiyoLog Premium', '$34.99', '$104.97', '$125.64'],
        ['Baby Tracker Plus', '$49.99', '$149.97', '$215.64'],
        ['Baby Tracker (remove ads only)', '$4.99', '$4.99', '—'],
        ['MamaBee free core', '$0', '$0', '—'],
        ['MamaBee Premium', '$49.99', '$149.97', '$179.64'],
      ],
    }),
    {replace: 'e0593f6e', md: `Two honest footnotes. Baby Tracker's $4.99 one-time price is still the best value in this entire category, and nothing here beats it, though it only removes ads; Nighp's newer What's Next cues need its Plus subscription ($5.99 a month or $49.99 a year). And MamaBee's core — logging, insights, sync and export — is free forever with no advertising.`},
    T('5eef5a99', {
      caption: 'What each paid tier actually includes, at its annual price (US App Store, November 2026).',
      headers: ['', 'Huckleberry Plus', 'Huckleberry Premium', 'MamaBee Premium'],
      rows: [
        ['Price per year', '$68.99', '$119.99', '$49.99'],
        ['Price per month', '$11.99', '$14.99', '$4.99'],
        ['Nap prediction', 'SweetSpot', 'SweetSpot', 'Sleep Coach'],
        ['AI chat', 'No', 'Berry AI', 'Bee AI, unlimited'],
        ['Allergen tracking', 'Free solids log', 'Free solids log', 'Structured allergen test'],
        ['Human sleep consultants', 'No', 'Yes', 'No'],
        ['Ads', 'None', 'None', 'None'],
        ['3-year total', '$206.97', '$359.97', '$149.97'],
      ],
    }),
    {replace: 'a2dc34da', md: `Read the AI chat row twice. Huckleberry's Berry AI is Premium-only — you cannot get it for $68.99, you have to go to $119.99. MamaBee Premium is $49.99 a year: less than Huckleberry's middle tier, $70 a year less than its top one, and it includes the AI chat, the nap prediction and a structured allergen test.`},
    // Huckleberry
    {replace: 'c75bc15c', md: `Huckleberry is the category giant — 4.9 stars from roughly 79,000 US ratings as of November 2026 — and it earned that. It is not really a tracker with sleep features. It is a sleep product with a tracker attached.`},
    {replace: '1fa2ce2d', md: `SweetSpot sits in the Plus tier (Huckleberry says it is for babies 2 months and up), alongside a schedule creator, Insights, trend reports and AI logging by text, voice or photo. Premium adds expert-built sleep plans and Berry AI, its 24/7 chat assistant — which is where the price jumps to $119.99 a year.`},
    {after: 'e78e02a7', md: `- The free tier now includes a solids log that tracks allergens, reactions and foods tried`},
    {replace: 'b1a8457c', md: `- **The price.** Plus is $11.99 a month or $68.99 a year. Premium is $14.99 a month or $119.99 a year. A one-off Sleep Improvement Plan is another $49.99, and expedited service is $19.99 on top.`},
    // Baby Tracker (Nighp) now has What's Next AI cues + Plus subscription
    {replace: '7b0ba48f', md: `227,000 ratings at 4.8 stars. That is not a trend, that is a decade of exhausted parents voting. Baby Tracker is deliberately unglamorous — no community feed, no articles. Just a colour-coded timeline of your baby's day, entered fast. Its one recent concession to fashion is What's Next, an optional on-device AI feature that turns your logs into timing cues for the next nap, feed and diaper.`},
    {replace: '579a6d31', md: `- **$4.99 once** to remove ads. The core tracker stays free, and no subscription is required.`},
    {after: '7df4255e', md: `- Day, week and month charts, an Apple Watch app, Live Activities and widgets`},
    {replace: '351d051b', md: `- What's Next cues need Baby Tracker Plus ($5.99 a month or $49.99 a year); the one-time $4.99 only removes ads. Still no AI chat.`},
    // MamaBee section accuracy
    {replace: '51f9c50b', md: `Bee AI answers the questions you would otherwise be Googling at 3 AM, using your baby's own log as context — included free, unlimited on Premium. Premium also adds multi-baby sync, extra co-parents beyond the free two, longer insight windows of 30, 90 and 365 days, the full vaccine schedule, and a structured allergen test.`},
    {replace: '2c2bc12c', md: `MamaBee's Solid Food Allergen Test structures it: which allergens have been introduced, when, how many exposures, and what happened each time. Huckleberry's free solids log also tracks allergens and reactions, which is a good reason to look at it. PiyoLog and Baby Tracker log solids but have no dedicated allergen tracker. Our guide to [introducing allergens to your baby](/mamabee/articles/introducing-allergens-to-baby) covers the how.`},
    {replace: '00e106d9', md: `- **iPhone only** (iOS 17.6 or later). There is no Android, iPad or Apple Watch app.`},
    // New query-matching sections, after "How to actually choose"
    {after: '6a3acc56', md: `## What is the best baby log app?
If all you want is a log — feeds, diapers, sleep and pumping, with nothing telling you what to do — the best baby log app is the one you can work with one thumb in the dark. All four apps here do the basics well. The differences are speed, ads and sharing:
- **Fastest entry:** Baby Tracker. Its nursing timer and colour-coded timeline are built for speed, and $4.99 once removes the ads.
- **Clearest daily view:** PiyoLog. The 24-hour time bar shows the whole day at a glance, and partner sharing is real-time and free.
- **No ads without paying:** MamaBee. Logging, two-caregiver sync, widgets and CSV, JSON or pediatrician PDF export are all free.
- **Most guidance:** Huckleberry, once you pay for Plus.
If you mainly want a baby feeding journal app, check that it records the breast side, bottle amounts and pumping sessions in one timeline. All four do; Baby Tracker and MamaBee also have left/right nursing timers.
## What is the best app for newborn tracking?
In the newborn weeks you are logging 8 to 12 feeds a day, counting [wet diapers](/mamabee/articles/how-many-wet-diapers-newborn) and handing over to a partner at night. The best newborn tracker app is the one that makes those three things easy, not the one with the smartest predictions.
- **Fast feed and diaper logging**, with the last side used and a daily diaper count.
- **Real-time partner sync**, so the person taking over at 2 AM sees what just happened. See our [newborn night shifts](/mamabee/articles/newborn-night-shifts) guide for how families split the night.
- **A report for the pediatrician**, because your first checkups ask about feeds, diapers and weight.
Nap prediction matters less this early. Huckleberry says SweetSpot is for babies 2 months and up, and newborn sleep is mostly driven by feeding. A free tracker covers the newborn stage well; our [newborn sleep schedule](/mamabee/articles/newborn-sleep-schedule) explains what is normal in the first 12 weeks.
## Which baby app shows sleep charts and weekly trends?
All four show your baby's sleep over time. They differ in how far back you can look and what you have to pay for it.
[[TABLE:sleepCharts]]
For detailed sleep analytics built on your baby's real data, Huckleberry Plus and MamaBee Premium go furthest: both predict the next nap from your baby's own history rather than an age chart. If nap prediction is your main reason for downloading, our roundup of the [best nap prediction apps](/mamabee/articles/best-nap-prediction-apps) and our [wake windows by age](/mamabee/articles/wake-windows-by-age) cheat sheet go deeper.
## Looking for a cheaper Huckleberry alternative?
If Huckleberry's price is the problem, you have three cheaper routes: PiyoLog Premium ($34.99 a year) if you only want a lovely ad-free log, Baby Tracker ($4.99 once) if you only want ads gone, or MamaBee Premium ($49.99 a year) if you want nap prediction and AI chat for less than Huckleberry Plus. If you are switching from another app, such as Cubtale, Glow Baby, Nara Baby or Sprout, our head-to-head guides compare [Glow Baby](/mamabee/articles/glow-baby-vs-mamabee), [Nara Baby](/mamabee/articles/nara-baby-vs-mamabee), [Sprout Baby](/mamabee/articles/sprout-baby-vs-mamabee) and [Napper](/mamabee/articles/napper-vs-mamabee) with MamaBee.`, tables: {
      sleepCharts: {
        caption: 'Sleep charts and trends, US App Store, as of November 2026',
        headers: ['App', 'Free sleep view', 'Weekly trends', 'Longer-range or paid'],
        rows: [
          ['Huckleberry', 'Sleep summaries, history and averages', 'Trend reports in Plus', 'Insights and SweetSpot in Plus ($68.99/yr)'],
          ['PiyoLog', '24-hour time bar', 'Weekly graphs of sleep, meals, poop and temperature', 'Premium removes ads ($34.99/yr)'],
          ['Baby Tracker', 'Colour-coded daily timeline', 'Day, week and month charts', 'What\'s Next cues in Plus ($49.99/yr)'],
          ['MamaBee', 'Daily timeline', '7-day insights, free', '30, 90 and 365-day insights and Sleep Coach in Premium ($49.99/yr)'],
        ],
      },
    }},
    // FAQ: refresh one answer, add four
    {replace: 'f8bf0de3', md: `For a fully free log, PiyoLog and Baby Tracker both give you the whole app with ads. MamaBee's free tier has no ads at all and includes logging, insights, growth, milestones, co-parent sync and export — though Sleep Coach, unlimited Bee AI and the full vaccine schedule are Premium. Huckleberry's free tier covers logging, sleep summaries and a solids log, with SweetSpot paid. Our [best free baby tracker apps](/mamabee/articles/best-free-baby-tracker-apps) guide compares free tiers in detail.`},
    {after: 'ab984a8d', md: `### What is the best baby tracker app?
There is no single best baby tracker app; it depends on your problem. Huckleberry is best for nap prediction, PiyoLog for a cheap, complete log on iPhone or Android, Baby Tracker for a one-time $4.99 purchase, and MamaBee for a complete free tier with no ads on iPhone.
### What is the best baby tracker app for newborns?
For a newborn, pick the app that makes feed, diaper and sleep logging fastest and syncs with your partner in real time. Any of the four works. Nap prediction matters less in the first 2 months, so a free tier such as MamaBee's, PiyoLog's or Baby Tracker's usually covers the newborn stage.
### Which baby tracker combines logging with AI insights?
Huckleberry (Berry AI chat on Premium, $119.99 a year), Baby Tracker (What's Next on-device timing cues on Plus, $49.99 a year) and MamaBee (Bee AI chat, unlimited on Premium at $49.99 a year, plus Sleep Coach nap prediction). PiyoLog has no AI features.
### Is Baby Tracker by Nighp still a one-time purchase?
Partly. Removing ads is still a one-time $4.99 purchase, and the core tracker is free. Its newer What's Next AI cues need Baby Tracker Plus, a subscription at $5.99 a month or $49.99 a year on the US App Store as of November 2026.`},
    // Takeaway + verification line
    {replace: 'dd0416c7', md: `Huckleberry is the best sleep engine and charges like it. PiyoLog is the most beautiful complete free log. Baby Tracker is the workhorse that still asks for $4.99 once. MamaBee is the calm, private one — a free tier with no ads in it, and a Premium tier that does Huckleberry's job for a fraction of the price, plus a structured allergen test — as long as you are on an iPhone.`},
    {replace: 'd2d806a6', md: `*Prices, ratings and features verified on the US App Store as of November 2026, and may change. This article is general information, not medical advice.*`},
  ],
}

// ==================================================================================
// B) Newborn night shifts
// ==================================================================================
const B = {
  id: 'mamabee-newborn-night-shifts',
  title: 'Newborn Night Shift Schedule: How to Split the Night (Templates)',
  description: 'Newborn night shift schedules with hour-by-hour templates for bottle-fed, breastfed and pumping babies, plus how long to do shifts and work-week plans.',
  tags: ['newborn night shift schedule', 'night shifts with newborn', 'newborn sleep shifts for parents', 'how to do shifts with newborn', 'newborn night shifts with partner', 'newborn night shifts breastfeeding', 'how long to do shifts with newborn', 'splitting night shifts with newborn'],
  ops: [
    {replace: '84961566', md: `**A newborn night shift schedule splits the night into two blocks, usually 9 PM to 2 AM and 2 AM to 7 AM, so each parent gets about five hours of unbroken sleep while the other handles every feed and diaper. Breastfeeding families can use one bottle of pumped milk, or a partner who does everything except the feed.**`},
    // After the existing plans table: hour-by-hour template + more setups
    {after: 'f65835cb', md: `### Hour-by-hour template: the two-shift night
Here is the most common plan written out hour by hour. Screenshot it or copy it onto the fridge, then shift the times to fit your baby.
[[TABLE:template]]
### More shift schedules for different setups
[[TABLE:setups]]
If your baby's longest stretch tends to start late in the evening, a partner-led [dream feed](/mamabee/articles/dream-feed) at the end of the first shift can push that stretch into the second parent's sleep. It tends to work best from around 8 weeks.`, tables: {
      template: {
        caption: 'Two-shift newborn night (bottle or pumped milk)',
        headers: ['Time', 'On duty', 'Off duty', 'What happens'],
        rows: [
          ['8:00 to 9:00 PM', 'Both', '—', 'Last evening feed, diaper, bottles and supplies prepped. Parent B heads to bed.'],
          ['9:00 PM to 2:00 AM', 'Parent A', 'Parent B sleeps (5 hours)', 'A handles every wake-up: feed, burp, diaper, back down. Logs each feed.'],
          ['2:00 AM', 'Handover', '—', 'Two minutes: last feed, last diaper, any medicine, when baby is likely to wake.'],
          ['2:00 to 7:00 AM', 'Parent B', 'Parent A sleeps (5 hours)', 'B handles every wake-up the same way.'],
          ['7:00 AM', 'Both', '—', 'Morning feed. Whoever slept less naps first that day if possible.'],
        ],
      },
      setups: {
        caption: 'Newborn shift schedules by family setup',
        headers: ['Setup', 'Schedule', 'Each adult sleeps', 'Notes'],
        rows: [
          ['Two parents, both home', 'A: 9 PM to 2 AM. B: 2 AM to 7 AM', 'About 5 hours unbroken', 'The default. Swap shifts weekly if one of you is a night owl.'],
          ['One parent back at work', 'Working parent: 8 PM to 1 AM. Home parent: 1 AM to 7 AM', 'Working parent sleeps 1 AM to 7 AM before work', 'Home parent naps in the day. Swap or alternate on weekends.'],
          ['Three adults (grandparent or helper)', '8 PM to 12 AM, 12 to 4 AM, 4 to 8 AM', '8 of the 12 night hours off duty', 'Good for the first weeks if family stays over.'],
          ['Exclusive pumping', 'Partner: 9 PM to 3 AM. Pumping parent: 3 AM to 7 AM', 'Up to about 4 hours, then a quick pump', 'In the early weeks, avoid gaps over 4 hours between night pumps.'],
          ['Breastfeeding, partner helps', 'Partner fetches, changes and resettles all night', 'Nursing parent wakes only to feed', 'Best before a bottle is introduced.'],
          ['Alternating nights', 'One parent covers the whole night', 'A full night every other night', 'Works once feeds are further apart.'],
        ],
      },
    }},
    // Pumping section, after breastfeeding section's last paragraph
    {after: 'b3712c55', md: `## How do you do shifts with a newborn when pumping?
If you exclusively pump, your shift plan has to protect your supply as well as your sleep. In the early weeks, aim for 8 to 12 pumping sessions in 24 hours with no more than about 4 hours between sessions at night, and keep at least one overnight session, ideally between 2 and 5 AM. That means your longest protected block is about 4 hours, not 5.
- **Pump right before you go off duty**, then sleep while your partner gives bottles.
- **Your partner handles every feed**, wash-up and diaper during your off shift, so the pump is your only wake-up.
- **Set one alarm for your overnight pump**, then go straight back to sleep or take over the second shift.
Once your supply is established, many parents can stretch the overnight gap first. Our [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) shows how sessions change month by month.`},
    // Work + should-we + how-long sections, after the single-parent section
    {after: '091033a7', md: `## How do night shifts work when one parent goes back to work?
When one parent returns to work, the goal shifts from equal hours to protecting the working parent's last block before the alarm. A common setup:
- **The working parent takes the early shift**, for example 8 PM to 1 AM, then sleeps 1 AM to 7 AM without interruption.
- **The parent at home takes the late shift** and naps during the day, ideally when someone else can watch the baby.
- **Weekends rebalance it.** The home parent gets a full night off, or a protected sleep-in, on Friday or Saturday.
If the working parent cannot function on a split night, alternate nights instead and keep weekends for the home parent's catch-up.
## Should parents take shifts with a newborn?
For most families, yes. One parent getting a predictable stretch of sleep usually beats two parents waking for every feed. But shifts are not for everyone:
- **They work well** when you can both sleep out of earshot, when the baby takes a bottle, or when the partner can do everything but the feed.
- **They are harder** in the first days of breastfeeding, during [cluster feeding](/mamabee/articles/cluster-feeding) evenings, and in a small home where the off-duty parent still hears every cry.
- **They can feel lonely.** Many parents keep the 8 to 9 PM hour as overlap time, so you still see each other.
## How long should you do shifts with a newborn?
There is no set end date. Most families keep shifts through the early weeks, while babies feed 8 to 12 times in 24 hours, and ease off once the baby has one longer stretch at night and fewer night feeds. Signs you can loosen the plan:
- Your baby is feeding fewer times overnight and settling back quickly.
- One shift regularly has no wake-ups at all.
- Both of you are getting enough sleep to function in the day.
Many families step down gradually: from two shifts every night, to alternating nights, to one parent on call with the other as backup. Our [newborn sleep schedule](/mamabee/articles/newborn-sleep-schedule) explains how sleep stretches lengthen over the first 12 weeks.`},
    // MamaBee section: add internal link context
    {after: 'a5576a2a', md: `Before checkups, export a pediatrician PDF of the last 7 days so your doctor sees real feed and diaper counts. If you are unsure what a normal night looks like, our guides to [how much a newborn should eat](/mamabee/articles/how-much-should-a-newborn-eat) and [how many wet diapers a newborn should have](/mamabee/articles/how-many-wet-diapers-newborn) give the numbers to check against.`},
    // New FAQs (after the existing first FAQ)
    {after: '537a9758', md: `### What is the best night shift schedule for a newborn?
For two parents, the most common is two 5-hour shifts, such as 9 PM to 2 AM and 2 AM to 7 AM. It gives each parent one unbroken block of sleep, which tends to feel better than more hours of broken sleep. With a third adult, three 4-hour shifts work well.
### Who should take the first night shift?
Usually the night owl, or the parent who needs to be up first the next morning, because the early shift is followed by the longer uninterrupted sleep. If you are breastfeeding with one bottle of pumped milk, the partner often takes the first shift while the nursing parent sleeps.
### Can you do 4-hour night shifts with a newborn?
Yes. Shorter shifts suit families with a third adult, such as 8 PM to 12 AM, 12 to 4 AM and 4 to 8 AM, and parents who exclusively pump, since early supply needs a pump at least every 4 hours at night. With only two adults, 5-hour shifts usually give each person a longer unbroken block.
### How do you do night shifts with a newborn and a toddler?
Give one parent the toddler and the other the newborn for the night, then swap the next night so nobody gets two hard nights in a row. Keep the off-duty adult's sleep space as quiet as possible, and nap when someone else can watch both children.`},
  ],
}

// ==================================================================================
const textOf = (b) => (b.children || []).map((c) => c.text).join('')
const words = (body) => body.map((b) => b._type === 'block' ? textOf(b) : b._type === 'comparisonTable' ? [b.caption || '', ...(b.headers || []), ...(b.rows || []).flatMap((r) => r.cells)].join(' ') : '').join(' ').split(/\s+/).filter(Boolean).length
const outline = (body) => body.filter((b) => b._type === 'block' && /^h[23]$/.test(b.style)).map((b) => (b.style === 'h2' ? '  ## ' : '      ### ') + textOf(b))
const firstPara = (body) => { const b = body.find((x) => x._type === 'block' && x.style === 'normal' && !x.listItem); return b ? textOf(b) : '' }
const count = (body, t) => body.filter((b) => b._type === t).length

function validate(doc, body) {
  const keys = new Set(); for (const b of body) { if (keys.has(b._key)) throw new Error('duplicate _key ' + b._key); keys.add(b._key) }
  const txt = body.map((b) => b._type === 'block' ? textOf(b) : JSON.stringify(b)).join(' ')
  const yearly = [...txt.matchAll(/MamaBee[^.]{0,80}\$(\d+\.\d\d) a year|\$(\d+\.\d\d)\/yr — one tier/g)].map((m) => m[1] || m[2]).filter((p) => p !== '49.99')
  if (yearly.length) throw new Error('unexpected MamaBee yearly price: ' + yearly)
  if (/Android[^.]*roadmap|Roadmap/.test(txt)) console.warn('  WARN: roadmap claim remains')
  if (/no tracking/i.test(txt)) throw new Error('"no tracking" claim found')
  if (doc._id.includes('tracker') && !/we make MamaBee/.test(txt)) throw new Error('disclosure missing')
}

for (const spec of [A, B]) {
  const doc = await client.getDocument(spec.id)
  if (!doc) throw new Error('not found: ' + spec.id)
  const draft = await client.getDocument('drafts.' + spec.id)
  const body = applyOps(doc.body, spec.ops)
  validate(doc, body)
  const lost = doc.body.filter((b) => b._type !== 'block' && !body.some((n) => n._key === b._key))
  if (lost.length) throw new Error('non-text block removed: ' + lost.map((b) => b._key))
  console.log('\n================', spec.id, draft ? '(WARNING: a draft also exists)' : '')
  console.log('TITLE  before:', doc.title, `(${doc.title.length})`)
  console.log('TITLE  after: ', spec.title, `(${spec.title.length})`)
  console.log('DESC   before:', doc.description, `(${doc.description.length})`)
  console.log('DESC   after: ', spec.description, `(${spec.description.length})`)
  console.log('TAGS   after: ', spec.tags.join(' | '))
  const fp = firstPara(body); console.log('FIRST PARA (' + fp.split(/\s+/).length + ' words):', fp)
  console.log('WORDS  before:', words(doc.body), ' after:', words(body))
  console.log('BLOCKS images', count(doc.body, 'image'), '->', count(body, 'image'), '| tables', count(doc.body, 'comparisonTable'), '->', count(body, 'comparisonTable'), '| CTAs', count(doc.body, 'appCta'), '->', count(body, 'appCta'))
  const before = new Set(outline(doc.body))
  console.log('OUTLINE after (+ = new):'); for (const l of outline(body)) console.log((before.has(l) ? ' ' : '+') + l)
  for (const l of before) if (!outline(body).includes(l)) console.log('-' + l)
  if (spec.title.length > 65) throw new Error('title too long')
  if (spec.description.length < 120 || spec.description.length > 155) throw new Error('description length ' + spec.description.length)
  if (APPLY) {
    const res = await client.patch(spec.id).ifRevisionId(doc._rev).set({title: spec.title, description: spec.description, tags: spec.tags, body}).commit()
    console.log('APPLIED ->', res._id, res._rev)
  }
}
if (!APPLY) console.log('\n(dry run — pass --apply to patch the published docs)')
