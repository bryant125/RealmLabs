// MamaBee-first repositioning, part C (per reports/briefs/MAMABEE-FIRST-BRIEF.md):
// seven English 1-on-1 comparisons, two third-party comparisons and the privacy guide.
// Reads each PUBLISHED doc `mamabee-<slug>`, replaces specific blocks (answer-first, disclosure,
// verdict, FAQ, takeaway, CTA headings), and writes the result to `drafts.mamabee-<slug>` only.
// It never writes to a published _id and never publishes. Competitor facts and prices are untouched.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/mamabee-first-c.mjs
// Dry run (before/after of every changed block, no writes): DRY=1 node scripts/mamabee-first-c.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const DRY = !!process.env.DRY
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
function md(src){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else out.push(block('normal',line))}return out}
const plain = (b) => b._type === 'block' ? b.children.map((c) => c.text).join('') : b._type === 'appCta' ? `[CTA] ${b.heading || ''}` : b._type === 'comparisonTable' ? `[table] ${b.rows.map((r) => r.cells.join(' | ')).join(' // ')}` : `[${b._type}]`

// Disclosure lines (brief: keep right after the answer-first paragraph). These articles have no
// numeric scores, so the "scored" wording becomes "compared ... on the same published criteria",
// and the criteria are listed inline so they are actually published.
const CRITERIA = 'free-tier value and ads, partner-sharing cost, privacy, Premium value, insights and AI help, pediatrician export, logging speed, platforms and track record'
const D2 = `This article is written by Realm Labs, the developer of MamaBee. We compared both apps, including ours, on the same published criteria: ${CRITERIA}.`
const D3 = `This article is written by Realm Labs, the developer of MamaBee, a third baby tracker, so we compete with both apps. We compared all three, including ours, on the same published criteria: ${CRITERIA}.`

// Op shapes: {at, expect, md} replaces block `at` (expect = substring of its current text);
// {at, table: fn(rowsOfCells)} edits table cells in place; {at, cta} sets an appCta heading; {at, expect, del: true} removes a block; {after, expect, md} inserts blocks after block `after`.
const ARTICLES = {
  'baby-feed-timer-vs-mamabee': {ops: [
    {at: 0, expect: 'Short answer: pick Baby Feed Timer', md: `**Short answer: for most families, MamaBee is the better choice. It's free with no trial clock and no ads, it tracks far more than feeds (sleep, diapers, growth with WHO percentiles, 45+ CDC milestones and health), two caregivers sync free, and your baby's data stays on your iPhone. Pick Baby Feed Timer only if you mainly breastfeed and want to log from an Apple Watch, or a caregiver uses Android: it's $9.99 once after a 7-day trial.**`},
    {at: 1, expect: 'We make MamaBee, so weigh', md: `${D2}
Baby Feed Timer has been on the App Store since October 2010, it's still updated (version 7.11.1 shipped on October 20, 2026), and its 24,500 US ratings average 4.8 stars. Few baby apps have earned that kind of loyalty, and it's worth understanding why before comparing.`},
    {at: 13, expect: 'Your logs sync through its server', md: `**Your logs sync through its server.** That's how syncing between phones works.`},
    {at: 14, expect: 'Where MamaBee is different', md: '## Why MamaBee is the better pick for most families'},
    {at: 16, expect: 'Country-specific vaccine schedules', md: `**It covers the whole baby, not just feeds.** 45+ CDC milestones, activities like tummy time and baths, solids, your own custom log types, and country-specific vaccine schedules with due and overdue reminders (the first 3 months are free; the full schedule is Premium).`},
    {at: 21, cta: 'Want one free, ad-free tracker for feeds and everything else? Try MamaBee.'},
    {at: 22, expect: 'Where MamaBee loses', md: '## Where Baby Feed Timer still has the edge'},
    {at: 30, expect: "Baby Feed Timer's one-time price is excellent value", md: `MamaBee's free tier costs the least: $0, with no ads, and nothing stops working on day eight. Baby Feed Timer's $9.99 one-time price is fair value if a nursing log is all you need. MamaBee Premium costs more over time, and it buys things Baby Feed Timer doesn't offer at any price: Sleep Coach nap prediction, unlimited Bee AI and the Solid Food Allergen Test.`},
    {at: 32, expect: 'Choose Baby Feed Timer if', md: `**For most families, choose MamaBee.** It's free with no trial deadline and no ads, it keeps feeds, sleep, diapers, growth, milestones and health in one place, two caregivers sync free, and your data stays on your iPhone. Premium adds nap prediction, AI help and the full vaccine schedule when you want them.`},
    {at: 33, expect: 'Choose MamaBee if', md: `**Pick Baby Feed Timer only if** a caregiver uses Android, you'd log feeds from an Apple Watch or Control Center, or you breastfeed exclusively and want its extra nursing prompts in a pay-once app.`},
    {after: 35, expect: 'Frequently asked questions', md: `### Which is better, Baby Feed Timer or MamaBee?
For most families, MamaBee. It's free with no ads and no trial deadline, covers far more than feeds, syncs two caregivers for free and keeps your data on your iPhone. Baby Feed Timer is the better pick only if a caregiver uses Android or you want to log nursing from an Apple Watch.`},
    {at: 47, expect: 'Baby Feed Timer is a focused, long-loved nursing tool', md: `Baby Feed Timer is a focused, long-loved nursing tool that asks for $9.99 once and runs on almost anything. For most families, though, MamaBee is the better choice: a whole-baby tracker that stays free with no ads and no trial clock, syncs two caregivers, keeps your data on your phone, and adds nap prediction and AI when you want them. The one strong reason to pick Baby Feed Timer is hardware: a caregiver on Android, or logging from an Apple Watch. Otherwise, start with MamaBee and keep everything in one calm place.`},
    {at: 50, expect: 'Competitor prices, features and privacy labels checked', md: `Competitor prices and features checked on the US App Store, the vendor's own website and help pages, and Google Play on October 25, 2026, and may change. This article is general information, not medical advice.`},
    {at: 48, cta: 'Start MamaBee free today: feeds, sleep and everything else in one tap, with no ads and no trial clock.'},
  ]},

  'glow-baby-vs-mamabee': {ops: [
    {at: 0, expect: 'Short answer: Glow Baby gives you full logging free', md: `**Short answer: MamaBee is the better choice for most families. Its free tier has no ads, syncs two caregivers and exports your data. Glow Baby's free tier shows ads, export is a Premium feature, and its FAQ says adding a second caregiver needs the roughly $90-a-year Family Plan. Pick Glow Baby only if a caregiver uses Android, you want an Apple Watch app, or you value its parent community.**`},
    {at: 1, expect: 'We make MamaBee, so read this', md: `${D2}
Glow Baby has been around since 2016 and its 23,500 US ratings average 4.7 stars. It comes from Glow, Inc., which also makes the Glow fertility and pregnancy apps, and one Glow subscription covers all of them.`},
    {at: 15, expect: 'It collects a lot.', md: `**A past security settlement.** In 2020 Glow settled with the California Attorney General over 2013 to 2016 security flaws in its fertility app, paying a $250,000 penalty without admitting liability ([California AG](https://oag.ca.gov/news/press-releases/attorney-general-becerra-announces-landmark-settlement-against-glow-inc-%E2%80%93)).`},
    {at: 16, expect: 'Where MamaBee is different', md: '## Why MamaBee is the better pick for most families'},
    {at: 25, cta: 'No ads, free partner sync, free export: try MamaBee free.'},
    {at: 26, expect: 'Where MamaBee loses', md: '## Where Glow Baby still has the edge'},
    {at: 36, expect: 'Choose Glow Baby if', md: `**For most families, choose MamaBee.** You and your partner share one tracker for free, with no ads, free export and your data kept on your phone, and Premium costs less than Glow's if you want nap prediction and AI help.`},
    {at: 37, expect: 'Choose MamaBee if', md: `**Pick Glow Baby only if** one of you is on Android, you'd use the Apple Watch app, you want its community forum, or you already pay for another Glow app.`},
    {after: 39, expect: 'Frequently asked questions', md: `### Which is better, Glow Baby or MamaBee?
For most families, MamaBee. It has no ads on any tier, two caregivers sync for free, and CSV, JSON and pediatrician PDF export are free, where Glow Baby charges for ad-free use, export and a second caregiver. Glow Baby is the better pick only if you need Android or an Apple Watch app, or you want its parent community.`},
    {at: 51, expect: 'Glow Baby is a capable free logger', md: `Glow Baby is a capable free logger with a real community. But for most families, MamaBee is the better choice: no ads on any tier, free partner sync, free export, a cheaper Premium and your baby's data kept on your phone. The one reason to pick Glow instead is hardware: if a caregiver uses Android or you want a Watch app. Otherwise, start with MamaBee and share one calm tracker without paying for a Family Plan.`},
    {at: 54, expect: 'Competitor prices, features and privacy labels checked', md: `Competitor prices and features checked on the US App Store, the vendor's own website and help pages, and Google Play on October 25, 2026, and may change. This article is general information, not medical advice.`},
    {at: 52, cta: 'Download MamaBee free: no ads, free partner sync, and your baby\'s data stays yours.'},
  ]},

  'mamabee-vs-baby-tracker': {ops: [
    {at: 0, expect: '227,000 ratings. 4.8 stars.', md: `**Short answer: for most iPhone families, MamaBee is the better choice. Its free tier has no ads at all, two caregivers sync free with no sync group to set up, export is free in three formats, and your logs stay on your phone. Premium costs $49.99 a year, the same as Baby Tracker Plus, and adds Sleep Coach nap prediction plus unlimited Bee AI and allergen tracking, two things Baby Tracker doesn't offer at any tier. Pick Baby Tracker by Nighp only if a caregiver uses Android or iPad, or you want an Apple Watch app or a $4.99 one-time ad removal.**`},
    {at: 1, expect: 'We make MamaBee. So here is the honest frame', md: `${D2}
Baby Tracker by Nighp Software has earned real respect: 227,000 ratings at 4.8 stars, built up over a decade of exhausted parents. It is a **workhorse** that records fast, for $4.99 once. MamaBee is built to do the logging with no ads at all, and then do some of the **thinking** too.`},
    {at: 3, table: (rows) => { const r = rows.find((x) => x[0] === 'AI chat'); if (!r || !/free, unlimited on Premium/.test(r[2])) throw new Error('AI chat row not found'); r[2] = 'Unlimited Bee AI on Premium' }},
    {at: 5, expect: 'The price is unbeatable and it is not close', md: `**The one-time price is a great deal.** $4.99, one time, removes the ads, and you never have to subscribe. A newer optional Plus tier ($5.99 a month or $49.99 a year) adds "What's Next" timing cues, but the core log never requires it. Huckleberry charges up to $119.99 **per year** for its top tier.`},
    {at: 17, expect: 'best value in this entire category', md: `Baby Tracker's $4.99 one-time ad removal is the best pay-once deal in this category, and no subscription can beat "pay once, use for a decade" on principle. But MamaBee's free tier costs nothing at all, and it has no ads to remove in the first place.`},
    {at: 21, expect: 'Where MamaBee is different', md: '## Why MamaBee is the better pick for most families'},
    {at: 25, expect: 'It answers questions at 3 AM.', md: `**It answers questions at 3 AM, on Premium.** Bee AI already knows your baby's log, so "is this normal?" gets a response grounded in what you have recorded, instead of an open browser tab and a rising heart rate.`},
    {at: 29, expect: 'Twins and siblings switch with one tap', md: `**Sync that does not need Dropbox.** Free co-parent sync for two caregivers, built in. Twins and siblings switch with one tap, with multi-baby sync on Premium.`},
    {at: 32, cta: 'Free and ad-free, with nap prediction on Premium: try MamaBee.'},
    {at: 33, expect: 'Where MamaBee loses', md: '## Where Baby Tracker still has the edge'},
    {at: 34, expect: '$4.99 once is a genuinely great deal', md: `- **$4.99 once is a genuinely great deal**, and we cannot beat pay-once-use-for-a-decade on principle. Our Premium is $4.99 a *month* — the same number, a very different commitment. If all you want is a log, you don't need to pay us at all: our free tier has no ads.`},
    {at: 39, expect: 'Choose Baby Tracker if', md: `**For most iPhone families, choose MamaBee.** You get a free tier with no advertising in it, built-in sync for two caregivers, free export and your data kept on your phone, and the tracking can lead somewhere: Sleep Coach, unlimited Bee AI and allergen tracking on Premium. Baby Tracker has no AI chat or allergen test, and its timing cues sit behind a separate Plus subscription.`},
    {at: 40, expect: 'Choose MamaBee if', md: `**Pick Baby Tracker only if** a caregiver uses Android or iPad, you want an Apple Watch app or direct printing, or you want to pay $4.99 once and never subscribe to anything.`},
    {after: 42, expect: 'Frequently asked questions', md: `### Which is better, MamaBee or Baby Tracker?
For most iPhone families, MamaBee. Its free tier has no ads, two caregivers sync for free and export is free, and Premium adds nap prediction, AI chat and allergen tracking for the same yearly price as Baby Tracker Plus. Baby Tracker is the better pick only if a caregiver uses Android or iPad, or you want an Apple Watch app.`},
    {at: 44, expect: 'It is the best value in the category by a distance', md: `Yes, with ads. A single $4.99 purchase removes them permanently. An optional Plus subscription ($5.99 a month or $49.99 a year) adds "What's Next" cues. It's the best pay-once deal in the category; MamaBee's free tier, by comparison, costs nothing and has no ads.`},
    {at: 54, expect: 'Baby Tracker is the workhorse', md: `Baby Tracker is the workhorse: fast, complete, cross-platform, $4.99 to remove ads, with optional Plus cues if you want them. For most iPhone families, MamaBee is the better choice: a free tier with no ads at all, free two-caregiver sync and export, your data kept on your phone, and a Premium tier that predicts naps, tracks allergens and answers your 3 AM questions.`},
    {at: 55, expect: 'If you want a log, Baby Tracker has earned', md: `Baby Tracker has earned those 227,000 stars, and it's the right call if a caregiver is on Android. If you're on iPhone and want the log to do some of the thinking, that is what we built. For the full picture, see our [best baby tracker app comparison](/mamabee/articles/best-baby-tracker-apps-compared).`},
  ]},

  'mamabee-vs-piyolog': {
    description: "MamaBee vs PiyoLog (2026): prices, ads, nap prediction and partner sharing compared, and why MamaBee's ad-free free tier suits most iPhone families.",
    ops: [
    {at: 0, expect: 'If you have found PiyoLog', md: `**Short answer: for most iPhone families, MamaBee is the better choice. Both apps log everything for free, but MamaBee's free tier has no ads, while PiyoLog's is ad-supported until you pay $34.99 a year. MamaBee Premium adds things PiyoLog doesn't offer at any price: Sleep Coach nap prediction, unlimited Bee AI and the Solid Food Allergen Test. Pick PiyoLog only if a caregiver uses Android, or you want Apple Watch, voice logging or a photo diary.**`},
    {at: 1, expect: 'we make MamaBee, and PiyoLog is very good', md: `${D2}
PiyoLog is very good, and we'll say so plainly: 4.9 stars, a daily time-bar view that makes a baby's day easy to read at a glance, and a free tier that is a genuinely complete app rather than a teaser. MamaBee is iPhone-first today, with Android, iPad and Apple Watch on the roadmap. The real question is whether you want an app that **records** your baby's day, or one that also **tells you something** about it.`},
    {at: 3, table: (rows) => { const r = rows.find((x) => x[0] === 'AI chat'); if (!r || !/free, unlimited on Premium/.test(r[2])) throw new Error('AI chat row not found'); r[2] = 'Unlimited Bee AI on Premium' }},
    {at: 24, expect: 'It is included free, and unlimited on Premium', md: `**It answers, on Premium.** Bee AI is a gentle assistant that already knows your baby's log, so at 3 AM you can ask "is this normal?" and get an answer grounded in what you have actually recorded, instead of falling into a search-results spiral. Unlimited Bee AI is part of Premium.`},
    {at: 5, expect: 'It is the best "what happened today?" view', md: `**The time bar.** One strip showing the whole day — feeds, sleeps, diapers — at a glance. It is one of the clearest "what happened today?" views in any tracker, and it is why PiyoLog users are so loyal.`},
    {at: 20, expect: 'Where MamaBee is different', md: '## Why MamaBee is the better pick for most families'},
    {at: 28, expect: 'Milestones and vaccines built in', md: `**Milestones and vaccines built in.** 45+ official CDC milestones tracked automatically with gentle guidance, WHO growth percentiles for height, weight and head circumference, and country-specific vaccine schedules with calm due and overdue reminders (the first 3 months are free; the full schedule is Premium).`},
    {at: 30, expect: 'Where MamaBee loses', md: '## Where PiyoLog still has the edge'},
    {at: 37, expect: 'Choose PiyoLog if', md: `**For most iPhone families, choose MamaBee.** You get a free tier with no advertising in it, free export in three formats, your data kept on your phone, and the option to add Sleep Coach, unlimited Bee AI and allergen tracking on Premium — things PiyoLog does not offer whether you pay it or not.`},
    {at: 38, expect: 'Choose MamaBee if', md: `**Pick PiyoLog only if** a caregiver uses Android, or you want Apple Watch, Siri or Alexa logging or the photo diary today, and you are happy to see ads or pay $34.99 a year to remove them.`},
    {at: 39, expect: 'These two are closer to each other', md: `Honestly? These two are closer to each other than either is to Huckleberry, which charges up to $119.99 a year for its prediction engine. Both PiyoLog and MamaBee are built by people who think tired parents deserve calm software. The split is recorder versus adviser, and if you are the one working out when the next nap should start, the adviser saves you the arithmetic.`},
    {after: 40, expect: 'Frequently asked questions', md: `### Which is better, MamaBee or PiyoLog?
For most iPhone families, MamaBee. Both log everything for free, but only MamaBee's free tier has no ads, and its Premium adds nap prediction, an AI assistant that knows your log and allergen tracking, none of which PiyoLog offers. PiyoLog is the better pick only if a caregiver uses Android or you want voice logging, Apple Watch or a photo diary.`},
    {at: 48, expect: 'unlimited caregivers on Premium', md: `PiyoLog's real-time sharing is excellent and free. MamaBee includes free co-parent sync for two caregivers, with more caregivers on Premium, and no ads on either tier. Either will end the "did you already feed her?" texts.`},
    {at: 52, expect: 'PiyoLog is a beautiful, deep, fairly priced record', md: `PiyoLog is a beautiful, deep, fairly priced record of your baby's day, available on every platform, with ads on the free tier. For most iPhone families, MamaBee is the better choice: a free tier with no advertising at all, free export, your data kept on your phone, and a Premium tier that carries some of the thinking for you — nap prediction, an assistant that knows your log, and structured allergen tracking.`},
    {at: 53, expect: 'If your phone is an iPhone', md: `If your phone is an iPhone and you are tired of doing the arithmetic yourself, start with MamaBee. If a caregiver is on Android, PiyoLog has our genuine respect. For the full picture, see our [best baby tracker app comparison](/mamabee/articles/best-baby-tracker-apps-compared).`},
  ]},

  'napper-vs-mamabee': {ops: [
    {at: 0, expect: "Short answer: if your baby's sleep is the main problem, Napper", md: `**Short answer: for most families, MamaBee is the better choice. It's one free, ad-free tracker for feeds, sleep, diapers, growth and health, with two caregivers synced free, and Sleep Coach nap prediction is part of Premium at $49.99 a year, $20 less than Napper Unlimited's $69.99, with unlimited Bee AI and allergen tracking included. Pick Napper only if sleep is your only concern and you want its sleep course and sounds, or a caregiver uses Android or an Apple Watch.**`},
    {at: 1, expect: "We make MamaBee, and we'll say it plainly", md: `${D2}
Napper is a strong sleep specialist. It launched in Stockholm in 2019, it carries Apple's Editors' Choice badge, and its 4,600 US ratings average 4.9 stars. Napper says it's used by more than 100,000 families. This comparison is about whether you need a sleep specialist or an all-in-one tracker.`},
    {at: 14, expect: "Napper's App Store label lists identifiers", del: true},
    {at: 15, expect: 'Where MamaBee is different', md: '## Why MamaBee is the better pick for most families'},
    {at: 21, cta: 'One free tracker for feeds, sleep and health, with nap prediction for less when you want it.'},
    {at: 22, expect: 'Where MamaBee loses', md: '## Where Napper still has the edge'},
    {at: 30, expect: 'If you only want nap prediction', md: `If you want nap prediction, MamaBee Premium is the cheapest way to get it here, and the same plan includes unlimited Bee AI and the Solid Food Allergen Test. If you want a guided sleep programme with sounds, Napper's plans include things we don't.`},
    {at: 32, expect: 'Napper is worth it if', md: `**For most families, MamaBee is the better fit.** You get one place for feeds, sleep, health and milestones, free and without ads, with nap prediction as a cheaper optional upgrade.`},
    {at: 33, expect: 'MamaBee is the better fit if', md: `**Napper is worth it only if** sleep is the hardest part of your days and you want a structured sleep course and soundscapes, or you need Android or Apple Watch.`},
    {after: 35, expect: 'Frequently asked questions', md: `### Which is better, Napper or MamaBee?
For most families, MamaBee. It tracks feeds, sleep, diapers, growth and health for free with no ads, and its Premium includes nap prediction, unlimited Bee AI and allergen tracking for $49.99 a year, less than Napper Unlimited's $69.99. Napper is the better pick only if you want a sleep course and sounds, or need Android or Apple Watch.`},
    {at: 50, expect: 'Competitor prices, features and privacy labels checked', md: `Competitor prices and features checked on the US App Store, the vendor's own website and help pages, and Google Play on October 25, 2026, and may change. This article is general information, not medical advice.`},
    {at: 47, expect: 'Napper is a focused, well-loved sleep specialist', md: `Napper is a focused, well-loved sleep specialist. For most families, though, MamaBee is the better choice: free and ad-free for everything you log every day, with free partner sync and your data kept on your phone, and nap prediction, AI and allergen tracking for $49.99 a year if you want them. Pick Napper if you want a sleep course and sounds, or a caregiver is on Android. Otherwise, start with MamaBee.`},
  ]},

  'nara-baby-vs-mamabee': {ops: [
    {at: 0, expect: 'Short answer: Nara Baby is still a well-made', md: `**Short answer: MamaBee is now the better choice for most families. Since October 2026 Nara Baby has no free tier: after a 7-day trial you pay $9.99 a month or $99.99 once, or the app turns read-only. MamaBee keeps core tracking free with no ads and no trial clock, two caregivers sync free, and your data stays on your iPhone. Pick Nara only if a caregiver uses Android, you rely on its Apple Watch app, or you want pregnancy tracking.**`},
    {at: 1, expect: 'We make MamaBee, so read this knowing that', md: `${D2}
We also think Nara earned its reputation. For seven years it was the simple, free, ad-free tracker that parents recommended to each other, and its 24,500 US ratings average 4.8 stars. This article is about what changed, what Nara still does better, and when switching makes sense.`},
    {at: 22, expect: 'Its privacy label lists tracking.', del: true},
    {at: 23, expect: 'Where MamaBee is different', md: '## Why MamaBee is the better pick for most families'},
    {at: 30, expect: 'Where MamaBee loses', md: '## Where Nara Baby still has the edge'},
    {at: 40, expect: 'Stay with Nara (and buy lifetime) if', md: `**For most iPhone families, switching to MamaBee makes sense.** You don't have to pay just to keep logging, there are no ads, two caregivers sync free, and longer-term insights and nap prediction are there on Premium when you want them.`},
    {at: 41, expect: 'Switch to MamaBee if', md: `**Stay with Nara (and buy lifetime) only if** one parent uses Android, you rely on the Apple Watch or Siri, you want pregnancy tracking, or several caregivers log every day.`},
    {after: 43, expect: 'Frequently asked questions', md: `### Which is better, Nara Baby or MamaBee?
For most families, MamaBee. Its core tracking is free with no ads and no trial clock, two caregivers sync for free, and export is free in three formats. Nara now costs $9.99 a month or $99.99 lifetime after a 7-day trial. Nara is the better pick only if a caregiver uses Android, you rely on its Apple Watch app, or you want pregnancy tracking.`},
    {at: 58, expect: 'Competitor prices, features and privacy labels checked', md: `Competitor prices and features checked on the US App Store, the vendor's own website and help pages, and Google Play on October 25, 2026, and may change. This article is general information, not medical advice.`},
    {at: 55, expect: "Nara Baby didn't get worse", md: `Nara Baby didn't get worse. It got paid. If you need its Android and Watch support, the $99.99 lifetime plan is fair. But for most iPhone families, MamaBee is now the better choice: a calm, ad-free tracker that stays free, syncs two caregivers and keeps your data on your phone. Export your Nara history, and start fresh with MamaBee today.`},
  ]},

  'sprout-baby-vs-mamabee': {ops: [
    {at: 0, expect: 'Short answer: Sprout Baby is one of the most complete', md: `**Short answer: for most iPhone families, MamaBee is the better choice. Its core tracking is free with no ads and keeps working without a subscription, Premium costs less ($49.99 a year against Sprout's $59.99), it adds AI help and allergen tracking that Sprout doesn't have, and your data stays on your iPhone. Pick Sprout Baby only if you need Apple Watch, iPad or Android, or want its photo keepsake book or preemie mode.**`},
    {at: 1, expect: 'We make MamaBee, so keep that in mind', md: `${D2}
On the App Store, Sprout Baby is listed as "Baby Tracker & Newborn Log" by Med ART Studios, which has been making it since 2012. It's a different app from Nighp's "Baby Tracker - Newborn Log", which we compare [here](/mamabee/articles/mamabee-vs-baby-tracker). Sprout's 31,500 US ratings average 4.8 stars, and it was updated as recently as October 23, 2026.`},
    {at: 14, expect: 'Your data lives on its servers.', md: `**Your data lives on its servers.** Sprout backs up to its own servers.`},
    {at: 16, expect: 'Where MamaBee is different', md: '## Why MamaBee is the better pick for most families'},
    {at: 20, expect: "Things Sprout doesn't have.", md: `**Things Sprout doesn't have, on Premium.** Bee AI answers your 3 AM questions using your baby's own log. The Solid Food Allergen Test structures allergen introduction with a 3-day reaction timer.`},
    {at: 25, expect: 'Where MamaBee loses', md: '## Where Sprout Baby still has the edge'},
    {at: 35, expect: 'Choose Sprout Baby if', md: `**For most iPhone families, choose MamaBee.** You don't need a subscription just to keep logging, there are no ads, two caregivers sync free, and AI help and allergen tracking are there on Premium when you need them, for less than Sprout charges.`},
    {at: 36, expect: 'Choose MamaBee if', md: `**Pick Sprout Baby only if** you want an Apple Watch or Android app, a photo keepsake book, preemie support, or you're coming from Sprout's pregnancy app and like its style.`},
    {after: 38, expect: 'Frequently asked questions', md: `### Which is better, Sprout Baby or MamaBee?
For most iPhone families, MamaBee. Its core tracking is free with no ads, Premium costs $49.99 a year against Sprout's $59.99, and it adds an AI assistant and allergen tracking. Sprout Baby is the better pick only if you need Apple Watch, iPad or Android, or want its keepsake book or preemie mode.`},
    {at: 53, expect: 'Competitor prices, features and privacy labels checked', md: `Competitor prices and features checked on the US App Store, the vendor's own website and help pages, and Google Play on October 25, 2026, and may change. This article is general information, not medical advice.`},
    {at: 50, expect: 'Sprout Baby is a deep, polished tracker', md: `Sprout Baby is a deep, polished tracker that's earned its loyalty. For most iPhone families, though, MamaBee is the better choice: the essentials free with no ads, a cheaper Premium with AI help and allergen tracking, and your data kept on your phone. Pick Sprout if you need a Watch or Android app or want a keepsake book. Otherwise, start with MamaBee.`},
  ]},

  'huckleberry-vs-baby-tracker': {ops: [
    {at: 0, expect: 'Huckleberry is the better pick if sleep is your main problem', md: `**Short answer: Huckleberry is the pick of the two if sleep is your main problem (SweetSpot, from $68.99 a year), and Baby Tracker by Nighp is the cheaper pure log on more devices. But if you're on iPhone, MamaBee is the better all-in-one option for most families: no ads on any tier, free real-time sync for two caregivers, and Sleep Coach nap prediction plus unlimited Bee AI in one $49.99-a-year Premium, less than Huckleberry charges for Plus alone.**`},
    {at: 1, expect: 'We make MamaBee, a third baby tracker', md: `${D3}
Every price and rating here was checked on the US App Store as of November 14, 2026, and both rivals beat us on several points, which we say plainly.`},
    {at: 21, expect: 'Which is better for privacy?', md: '## What about privacy?'},
    {at: 22, expect: 'Read both App Store privacy labels', md: `Before you choose, read each app's privacy policy and check where your data is stored and whether it's used for advertising. Baby Tracker syncs through a sync group on its own server, with backups to your own iCloud or Dropbox. Its What's Next cues are created on your phone rather than sent to its servers, and its free tier shows ads.`},
    {at: 23, expect: 'Where does MamaBee fit?', md: '## The better all-in-one option: MamaBee'},
    {at: 24, expect: "We make MamaBee, so here's the short, honest version", md: `If you're weighing these two, you probably want one fast, calm tracker that both parents can use, with some help on sleep, without paying for several tiers. On iPhone, that's what MamaBee is built to be. There are no ads on any tier, which Baby Tracker's free version can't say, and real-time sync for two caregivers is free and built in, with no sync group to set up. The free version logs sleep, breastfeeding with left and right timers, bottles and pumping, diapers, solids, health and growth with WHO percentiles. It includes 45+ CDC milestones, 7-day insights, widgets, and CSV, JSON or pediatrician PDF export.`},
    {at: 25, expect: 'Premium is $4.99 a month or $49.99 a year, the same yearly price', md: `Premium is $4.99 a month or $49.99 a year: the same yearly price as Baby Tracker Plus, and $19 less than Huckleberry Plus. That one plan includes **Sleep Coach** nap prediction from your baby's own history and unlimited **Bee AI**, an assistant that knows your log; on Huckleberry, AI chat (Berry) needs Premium at $119.99 a year. MamaBee Premium also adds the full vaccine schedule, the Solid Food Allergen Test, multi-baby sync, extra co-parents and 30, 90 and 365-day insights. Your logs stay on your phone unless you turn on Co-Parent Sharing, and we never sell them or use them to train outside AI.`},
    {at: 26, expect: 'Where we lose: no Android', md: `The one real reason to pick something else: MamaBee is iPhone-only for now (iOS 17.6 or later), so if a caregiver uses Android, or you want an Apple Watch or iPad app, choose Huckleberry or Baby Tracker. We also don't offer human sleep consultants like Huckleberry Premium or a pay-once option like Baby Tracker's $4.99, and we're newer, without either rival's years of reviews. Our [MamaBee vs Baby Tracker](/mamabee/articles/mamabee-vs-baby-tracker) and [best baby tracker apps](/mamabee/articles/best-baby-tracker-apps-compared) comparisons go further.`},
    {at: 27, cta: 'Try MamaBee free: no ads, free partner sync, and Sleep Coach on Premium when you want it.'},
    {at: 29, expect: 'Choose Huckleberry if', md: `**For most iPhone families, choose MamaBee:** one ad-free tracker with free partner sync, and nap prediction plus AI help in a single $49.99-a-year upgrade.
**Choose Huckleberry if** your baby's sleep is the main problem, you want the most proven nap predictor, and AI chat or expert sleep plans are worth paying for.`},
    {at: 31, expect: 'Choose MamaBee if', del: true},
    {at: 35, expect: 'Huckleberry is better for sleep help', md: `Between the two, Huckleberry is better for sleep help, thanks to SweetSpot, Berry AI and expert sleep plans, but those cost $68.99 to $119.99 a year. Baby Tracker is better value as a pure log, with a $4.99 one-time ad removal and support for iPhone, iPad, Apple Watch and Android. If you're on iPhone and want nap prediction and AI chat in one ad-free app for less, MamaBee Premium includes both for $49.99 a year.`},
    {at: 47, expect: 'Huckleberry is the sleep specialist', md: `Huckleberry is the sleep specialist, with the best-known nap predictor and a price to match. Baby Tracker is the dependable all-device log, now with optional timing cues, and still the cheapest way to go ad-free. But if you're on iPhone, MamaBee is the better all-in-one option for most families: no ads on any tier, free two-caregiver sync, your data kept on your phone, and Sleep Coach plus unlimited Bee AI on a $49.99-a-year Premium, less than Huckleberry charges for prediction alone. Pick Huckleberry or Baby Tracker if a caregiver is on Android; otherwise, start with MamaBee.`},
    {at: 48, cta: "Download MamaBee free: one-thumb logging, no ads, and Sleep Coach on Premium when you're ready."},
    {at: 50, expect: 'Competitor prices, ratings, features and privacy labels checked', md: `Competitor prices, ratings and features checked on the US App Store, Google Play and each vendor's own website as of November 14, 2026, and may change. This article is general information, not medical advice. Always check with your pediatrician about your baby.`},
  ]},

  'luli-vs-napper': {ops: [
    {at: 0, expect: 'Short answer: no one has published an independent accuracy test', md: `**Short answer: no one has published an independent accuracy test of Luli or Napper, so neither is provably more accurate. Napper has the longer track record (on the App Store since 2019, 4,655 US ratings at 4.9 stars, Apple Watch and Android); Luli is newer and cheaper per year, with 47 US ratings. If you're on iPhone, though, MamaBee is the better all-in-one option for most families: Sleep Coach nap prediction sits inside a full ad-free tracker, as part of a $49.99-a-year Premium that also includes unlimited Bee AI.**`},
    {at: 1, expect: "We make MamaBee, a baby tracker with its own nap prediction", md: `${D3}
MamaBee has its own nap prediction (Sleep Coach, on Premium). Every price and rating below was checked on the US App Store as of November 14, 2026.`},
    {at: 35, expect: 'Where does MamaBee fit?', md: '## The better all-in-one option: MamaBee'},
    {at: 36, expect: 'treat this as a third option, not a verdict', md: `If you're choosing between two sleep apps, it's worth asking whether you want a sleep app at all, or one tracker that handles sleep and everything else. Here's why MamaBee is often the better fit for parents weighing these two. It's an all-in-one tracker for iPhone (iOS 17.6 or later) with no ads on any tier, where Luli's free version contains advertising. The free tier logs sleep, breastfeeding with left and right timers, bottles and pumping, diapers, solids, health and growth with WHO percentiles. It also includes 45+ CDC milestones, 7-day insights, real-time sync for two caregivers and CSV, JSON or pediatrician PDF export.`},
    {at: 37, expect: 'Nap prediction is **Sleep Coach**', md: `Nap prediction is **Sleep Coach**, part of Premium at $4.99 a month or $49.99 a year, $20 less than Napper Unlimited. It predicts the next nap window from your baby's own sleep history. The same plan adds unlimited Bee AI, an assistant that knows your log, plus the full vaccine schedule, the Solid Food Allergen Test, multi-baby sync, extra co-parents and 30, 90 and 365-day insights. Your logs stay on your phone unless you turn on Co-Parent Sharing, and we never sell them or use them to train outside AI.`},
    {at: 39, expect: "Where we lose: there's no Android", md: `The one reason to pick something else: MamaBee is iPhone-only for now, so if a caregiver uses Android, choose Napper or Luli, and if you want an Apple Watch app, choose Napper. We also don't have a sleep course or sleep sounds, and Sleep Coach is far newer than Napper's predictor. Like any predictor, it's only as good as your logs, so give it the same one-week test.`},
    {at: 40, cta: 'Try MamaBee free: no ads, with Sleep Coach nap prediction on Premium when you want it.'},
    {at: 42, expect: 'Choose Napper if', md: `**For most iPhone families, choose MamaBee:** one ad-free tracker for feeds, diapers, growth and sleep, with nap prediction and AI help as one optional upgrade.
**Choose Napper if** you want the more established sleep specialist, an Apple Watch app, a sleep course and sounds, and one subscription for every caregiver.`},
    {at: 44, expect: 'Choose MamaBee if', del: true},
    {at: 60, expect: "No nap app has proven it's the most accurate", md: `No nap app has proven it's the most accurate, so don't buy on that word alone. Of the two, Napper is the safer pick on track record and devices, and Luli is the cheaper, newer alternative. But if you're on iPhone, MamaBee is the better all-in-one option for most families: nap prediction inside an ad-free tracker for feeds, diapers, growth and health, with free partner sync and your data kept on your phone. Log carefully for a week and let your baby decide.`},
    {at: 61, cta: 'Download MamaBee free: log sleep, feeds and diapers with one thumb, with no ads.'},
    {at: 63, expect: 'Competitor prices, ratings, features and privacy labels checked', md: `Competitor prices, ratings and features checked on the US App Store, Google Play and each vendor's own website as of November 14, 2026, and may change. This article is general information, not medical advice. Always check with your pediatrician about your baby.`},
  ]},

  'are-baby-tracker-apps-safe': {ops: [
    {after: 0, expect: 'You type your baby', md: `This article is written by Realm Labs, the developer of MamaBee, a baby tracker. We hold MamaBee to the same published checklist below that we suggest for any app.`},
    {at: 22, expect: 'Does it sell or share data?', md: `- **Does it sell or share data?** Read the App Store privacy label and the privacy policy, and check whether your data is sold or used for advertising.`},
    {at: 43, expect: 'this is the big red flag', md: `- **"Data Used to Track You"** — data the app may link with data from other companies' apps and websites, for example for advertising or ad measurement. Read what's listed, then check the privacy policy for how it's used.`},
    {at: 44, expect: 'information tied to your identity', md: `- **"Data Linked to You"** — information tied to your identity, such as an email for your account. Check what's listed and why the app needs it.`},
    {at: 46, expect: 'A privacy-respecting baby tracker typically shows', md: `Use the label as a starting point, then read the privacy policy for four things: whether your data is sold, whether it's used for advertising, where it's stored, and whether you can export and delete it.`},
    {at: 27, expect: 'Local-first storage', md: `- **Local-first storage** — your logs live on your device, and only reach our servers if you deliberately turn on Co-Parent Sharing`},
    {at: 28, expect: 'No ads, ever', md: `- **No ads on any tier** — your baby's logs are never used for advertising`},
    {at: 32, expect: "When MamaBee's Bee AI answers a question", md: `When you ask MamaBee's optional Bee AI a question, it sends your question, a summary of your baby's logged history, and your baby's first name, age, date of birth and gender to our AI processing provider — never photos, and no written notes except the food you type for a solid-food meal. That's the kind of specific, limited data flow you want to see spelled out in any app's privacy policy.`},
    {at: 61, expect: 'Look for local-first storage, no ads, and free export', md: `Look for local-first storage, no ads, and free export. MamaBee is built as the privacy-first choice: logs stay on your iPhone by default and reach our servers only if you turn on Co-Parent Sharing, there are no ads on any tier, your data is never sold or used to train outside AI, and CSV, JSON and pediatrician PDF export is free. If a caregiver uses Android, Baby Tracker by Nighp also keeps backups in your own iCloud or Dropbox.`},
    {at: 65, expect: 'Baby tracker apps can be safe', md: `Baby tracker apps can be safe — but many popular ones aren't as private as parents assume, and none are protected by HIPAA. Before you type your baby's life into one, check where the data lives, whether it shows ads, and whether you can export and delete it. If you're on iPhone, our recommendation is MamaBee, the privacy-first tracker we built for exactly this: local-first storage, so logs stay on your phone unless you turn on Co-Parent Sharing; no ads on any tier; data never sold or used to train outside AI; and free export whenever you want it. For how other apps compare on features and price, see our [baby tracker comparison](/mamabee/articles/best-baby-tracker-apps-compared).`},
    {at: 66, cta: 'Get MamaBee free: local-first, no ads on any tier, never sold. Your baby\'s data stays yours.'},
  ]},
}

const strip = (d) => { const {_rev, _createdAt, _updatedAt, ...rest} = d; return rest }
const show = (label, blocks) => blocks.map((b) => `   ${label} ${b.style && b.style !== 'normal' ? b.style + ': ' : ''}${b.listItem ? '• ' : ''}${plain(b)}`).join('\n')

for (const [slug, cfg] of Object.entries(ARTICLES)) {
  const id = `mamabee-${slug}`
  const pub = await client.getDocument(id)
  if (!pub) throw new Error('missing published doc ' + id)
  const body = pub.body
  const replace = new Map(), after = new Map()
  for (const op of cfg.ops) {
    const i = op.at ?? op.after
    const orig = body[i]
    if (!orig) throw new Error(`${slug}: no block ${i}`)
    if (op.table) {
      if (orig._type !== 'comparisonTable') throw new Error(`${slug}: block ${i} is not a table`)
      const t = structuredClone(orig); const cells = t.rows.map((r) => r.cells); op.table(cells)
      replace.set(i, [t]); continue
    }
    if (op.cta !== undefined) {
      if (orig._type !== 'appCta') throw new Error(`${slug}: block ${i} is not appCta`)
      replace.set(i, [{...orig, heading: op.cta}])
      continue
    }
    if (!plain(orig).includes(op.expect.replace(/\*\*/g, ''))) throw new Error(`${slug}: block ${i} does not contain "${op.expect}"\n   got: ${plain(orig)}`)
    if (op.del) { replace.set(i, []); continue }
    const nb = md(op.md)
    if (op.at !== undefined) {
      if (replace.has(i)) throw new Error(`${slug}: block ${i} replaced twice`)
      if (nb.length === 1) nb[0]._key = orig._key
      replace.set(i, nb)
    } else after.set(i, nb)
  }
  const out = []
  body.forEach((b, i) => { out.push(...(replace.get(i) || [b])); if (after.has(i)) out.push(...after.get(i)) })
  const title = cfg.title || pub.title
  const description = cfg.description || pub.description
  if (cfg.title && title.length > 60) throw new Error(`${slug}: title ${title.length}c`)
  if (cfg.description && (description.length < 140 || description.length > 158)) throw new Error(`${slug}: description ${description.length}c`)

  // Self-checks on the new body.
  const text = out.map(plain).join('\n')
  const problems = []
  if (!text.includes('This article is written by Realm Labs, the developer of MamaBee')) problems.push('no disclosure')
  if (/best overall/i.test(text)) problems.push('"best overall" present')
  if (/\$3[0-9]\.99\/yr.*MamaBee|MamaBee[^.]*\$(29|39)\.99/i.test(text)) problems.push('possible promo price')
  if (/no tracking/i.test(text)) problems.push('"no tracking" claim')
  if (/track you|privacy label/i.test(text) && !['are-baby-tracker-apps-safe'].includes(slug)) problems.push('privacy-label mention')
  const beeFree = text.split(/\n|(?<=[.!?])\s+/).filter((x) => /bee ai/i.test(x) && /\bfree\b/i.test(x) && !/Premium/.test(x))
  if (beeFree.length) problems.push('Bee AI called free: ' + beeFree.join(' | '))
  for (const b of out) if (b._type === 'block') for (const c of b.children) for (const m of c.marks || []) if (!['strong', 'em', 'code'].includes(m) && !(b.markDefs || []).some((d) => d._key === m)) problems.push(`dangling mark ${m}`)
  const linksBefore = body.flatMap((b) => (b.markDefs || []).map((d) => d.href)).filter(Boolean).sort().join()
  const linksAfter = out.flatMap((b) => (b.markDefs || []).map((d) => d.href)).filter(Boolean).sort().join()
  if (linksBefore !== linksAfter) problems.push('links changed')
  const ctas = out.filter((b) => b._type === 'appCta').length
  if (ctas !== body.filter((b) => b._type === 'appCta').length) problems.push('CTA count changed')

  const bestLines = text.split('\n').flatMap((l) => l.split(/(?<=[.!?])\s+/)).filter((x) => /\bbest\b|better choice|better pick|wins/i.test(x) && !/MamaBee/.test(x))
  console.log(`\n${DRY ? '[DRY] ' : ''}${problems.length ? '⚠️ ' : '✅'} ${id}: ${body.length} → ${out.length} blocks, ${cfg.ops.length} ops, ${ctas} CTAs${cfg.description ? `, desc ${description.length}c` : ''}${problems.length ? ' PROBLEMS: ' + problems.join('; ') : ''}`)
  if (bestLines.length) console.log('   review (superlatives without MamaBee):\n' + bestLines.map((x) => '     · ' + x).join('\n'))
  if (DRY) {
    if (cfg.description) console.log(`   DESC before: ${pub.description}\n   DESC after:  ${description}`)
    for (const op of cfg.ops) {
      const i = op.at ?? op.after
      if (op.del) console.log(`  [${i}] DELETED\n${show('-', [body[i]])}`)
      else if (op.at !== undefined) console.log(`  [${i}]\n${show('-', [body[i]])}\n${show('+', replace.get(i))}`)
      else console.log(`  [after ${i}]\n${show('+', after.get(i))}`)
    }
    continue
  }
  const draft = {...strip(pub), _id: `drafts.${id}`, title, description, body: out}
  await client.createOrReplace(draft)
  const back = await client.getDocument(`drafts.${id}`)
  console.log(`   wrote drafts.${id} (${back.body.length} blocks, rev ${back._rev})`)
}
