// Week-12 MamaBee ranking article as a DRAFT: best breastfeeding / nursing / pumping
// tracker apps. Google Trends (US, 12 months) puts "breastfeeding app" at 2.8x
// "baby tracker app", and ranked app comparisons are the only MamaBee pages that
// earn Google clicks today.
//
// Every competitor price/rating/platform/feature was checked on the US App Store
// (lookup API + apps.apple.com in-app purchase list), Google Play and each vendor's
// own site on 2026-11-15. Notable: Huckleberry's App Store IAP list now shows Plus
// yearly at $68.99 only; Feed Baby's last iOS update was May 2021; Glow Baby's was
// November 2025; no app called "LatchMe" exists on the US App Store.
// Run: SANITY_WRITE_TOKEN=xxx node scripts/week12-best-breastfeeding-apps.mjs   (DRY=1 to preview)
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
// Reuse the MamaBee app screenshots already uploaded to Sanity (see
// scripts/insert-screenshots.mjs). [[IMG:name|caption|alt]] drops one in,
// phone-framed, and the layout pairs it with the text that follows.
const shots = {}
for (const n of ['home-timeline', 'log-formula', 'comp-babytracker-home.png']) {
  const f = n.includes('.') ? n : `${n}.png`
  const id = await client.fetch('*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id', {f})
  if (id) shots[n] = id; else console.warn(`⚠️  missing screenshot asset: ${f}`)
}
// Competitor images are the vendors' own App Store marketing shots — they already
// carry a device frame, so they render plain rather than in our phone frame.
const img = (name, caption, alt) => ({_type: 'image', _key: k(), phone: !name.startsWith('comp-'), caption, alt, asset: {_type: 'reference', _ref: shots[name]}})
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
// [[TABLE:key]] pulls a comparison table out of the article's `tables` map.
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[IMG:')){const[name,caption,alt]=line.slice(6,line.indexOf(']]')).split('|');if(!shots[name])throw new Error('missing screenshot: '+name);out.push(img(name,caption,alt))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
const A=(slug,title,description,tags,tables,body,coverFrom)=>({slug,title,description,tags,tables,body,coverFrom})

const DRY = !!process.env.DRY

const FOOT = 'Competitor prices, ratings and features checked on the US App Store, Google Play and each vendor\'s own website as of November 15, 2026, and may change. This article is general information, not medical advice. Always check with your pediatrician about your baby.'

const SRC_BFT = '[Baby Feed Timer App Store listing](https://apps.apple.com/us/app/baby-feed-timer-breastfeeding/id395357581), [Baby Feed Timer website](https://babyfeedtimer.app), [Baby Feed Timer on Google Play](https://play.google.com/store/apps/details?id=com.fehnerssoftware.babyfeedtimer)'
const SRC_NIGHP = '[Baby Tracker App Store listing](https://apps.apple.com/us/app/baby-tracker-newborn-log/id779656557), [Baby Tracker FAQ](https://nighp.com/babytracker/babytracker_faq.html), [Baby Tracker on Google Play](https://play.google.com/store/apps/details?id=com.nighp.babytracker_android)'
const SRC_HUCK = '[Huckleberry App Store listing](https://apps.apple.com/us/app/huckleberry-baby-tracker/id1169136078), [Huckleberry pricing](https://huckleberrycare.com/pricing), [Huckleberry on Google Play](https://play.google.com/store/apps/details?id=com.huckleberry_labs.app)'
const SRC_SPROUT = '[Sprout Baby App Store listing](https://apps.apple.com/us/app/baby-tracker-newborn-log/id551448817), [Sprout help centre: after a subscription ends](https://medartstudios.zendesk.com/hc/en-us/articles/1500004099881-What-happens-after-subscription-is-cancelled), [Sprout on Google Play](https://play.google.com/store/apps/details?id=com.mas.apps.baby)'
const SRC_GLOW = '[Glow Baby App Store listing](https://apps.apple.com/us/app/glow-baby-tracker-growth-app/id1077177456), [Glow Baby app FAQ](https://glowing.com/glow-baby-app), [Glow Premium](https://glowing.com/glow-premium)'
const SRC_PUMP = '[Pump Log App Store listing](https://apps.apple.com/us/app/pump-log-track-breast-milk/id814112299), [Pump Log website](https://pumplogapp.com), [Medela Family App Store listing](https://apps.apple.com/us/app/medela-family-breast-feeding/id909275386), [Medela Family on Google Play](https://play.google.com/store/apps/details?id=com.medela.mymedela.live), [Feed Baby App Store listing](https://apps.apple.com/us/app/feed-baby-breastfeeding-app/id868611155)'
const SRC_HEALTH = '[CDC: How Much and How Often to Breastfeed](https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/how-much-and-how-often.html), [CDC: Newborn Breastfeeding Basics](https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/newborn-basics.html), [CDC: What to Expect While Breastfeeding](https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/what-to-expect-while-breastfeeding.html), [AAP HealthyChildren: How to Tell if Your Breastfed Baby is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx), [AAP HealthyChildren: Warning Signs of Breastfeeding Problems](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Warning-Signs-of-Breastfeeding-Problems.aspx), [AAP HealthyChildren: How Often and How Much Should Your Baby Eat?](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/how-often-and-how-much-should-your-baby-eat.aspx)'

const articles = [

  // ─────────────────────────────────────────────────────────────────────────
  A('best-breastfeeding-apps',
    'Best Breastfeeding Apps 2026: 9 Nursing & Pumping Trackers',
    'The best breastfeeding apps for iPhone and Android in 2026, scored on side timers, pumping logs, partner sharing, ads, price and export. Checked Nov 2026.',
    ['best breastfeeding apps', 'breastfeeding app', 'breastfeeding tracker app', 'nursing timer app', 'pumping tracker app'],
    {
      picks: {
        caption: 'Awards based on our scores below. Prices from the US App Store as of November 15, 2026.',
        headers: ['Award', 'App', 'Why'],
        rows: [
          ['Best overall', 'Baby Tracker – Newborn Log (Nighp)', 'Nursing timer that records the last side, pumping inventory, PDF export, $4.99 once to remove ads'],
          ['Best nursing timer', 'Baby Feed Timer', 'Which breast is next on screen, in reminders and on Apple Watch; $9.99 once'],
          ['Best free, ad-free pick on iPhone', 'MamaBee', 'Free left/right timers and free real-time sync for 2 caregivers, with no ads on any tier'],
          ['Best for your pediatrician or lactation consultant', 'MamaBee', 'Free pediatrician PDF, plus CSV and JSON export'],
          ['Best free pick for iPhone + Android couples', 'Huckleberry', 'Free two-sided timer and multi-caregiver sync on both platforms'],
          ['Best for hands-free logging', 'Sprout Baby', 'Apple Watch double tap, Siri, widgets and Live Activities'],
          ['Best for exclusive pumping', 'Pump Log', 'Freezer stash, countdown and a power pumping timer; one-time upgrade'],
          ['Best for Medela pump owners', 'Medela Family', 'Free; syncs Medela smart pumps and tracks stored milk'],
        ],
      },
      scores: {
        caption: 'Each criterion scored out of 10; overall is the plain average of the nine. Features we could not confirm on a listing or vendor site score low. Checked November 15, 2026.',
        headers: ['App', 'L/R timer', 'Next side', 'Pumping & stash', 'Bottles', '3 AM speed', 'Sharing', 'Ads', 'Price', 'Export', 'Overall'],
        rows: [
          ['Baby Tracker (Nighp)', '9', '8', '9', '9', '9', '8', '6', '9', '9', '8.4'],
          ['Baby Feed Timer', '10', '10', '5', '8', '9', '9', '7', '8', '7', '8.1'],
          ['MamaBee', '8', '3', '5', '8', '7', '7', '10', '9', '10', '7.4'],
          ['Sprout Baby', '7', '4', '7', '9', '9', '9', '9', '4', '8', '7.3'],
          ['Huckleberry', '9', '4', '6', '8', '7', '9', '9', '7', '6', '7.2'],
          ['Feed Baby', '6', '3', '6', '8', '5', '7', '7', '7', '6', '6.1'],
          ['Medela Family', '5', '3', '7', '5', '5', '3', '9', '10', '7', '6.0'],
          ['Pump Log', '4', '2', '10', '3', '8', '2', '8', '8', '3', '5.3'],
          ['Glow Baby', '6', '3', '8', '8', '6', '3', '4', '5', '3', '5.1'],
        ],
      },
      features: {
        caption: 'From each US App Store listing, Google Play and the vendor\'s website as of November 15, 2026. "Not stated" means we could not find it on the listing or site.',
        headers: ['App', 'Nursing timer', 'Next-side cue', 'Pumping', 'Partner sharing', 'Android / Apple Watch', 'US price'],
        rows: [
          ['Baby Tracker (Nighp)', 'Time per breast', 'Records the last side used', 'Sessions, amounts, milk inventory', 'Sync group across devices', 'Yes / Yes', 'Free with ads; Remove Ads $4.99 once; Plus $5.99/mo or $49.99/yr'],
          ['Baby Feed Timer', 'L/R, pause, switch mid-feed', 'Yes, plus feed-due reminders', 'Pump log', 'iPhone and Android sync, web viewer', 'Yes / Yes', '7-day trial, then $9.99 once'],
          ['MamaBee', 'Free L/R timers', 'No', 'Pumping and bottle log', 'Free real-time sync for 2 (both on iPhone)', 'No / No', 'Free; Premium $4.99/mo or $49.99/yr'],
          ['Sprout Baby', 'Nursing timer', 'Not stated', 'Timer, time and amount', 'Real-time; one plan covers invitees', 'Yes / Yes', '$59.99/yr, $14.99 to $19.99/mo or $5.99/wk'],
          ['Huckleberry', 'Two-sided timer (free)', 'Not stated', 'Pumping log (free)', 'Caregivers share one account (free)', 'Yes / Yes (paid)', 'Free; Plus $11.99/mo or $68.99/yr; Premium $14.99/mo or $119.99/yr'],
          ['Feed Baby', 'One-touch nursing log', 'Not stated', 'Pump amounts', 'Sync across any number of devices', 'Yes / Yes', 'In-app unlocks $5.99 and $6.99'],
          ['Medela Family', 'Breastfeeding log', 'Not stated', 'Smart-pump sync; milk storage for Medela pump users', 'Not stated', 'Yes / Not stated', 'Free, no in-app purchases'],
          ['Pump Log', 'Pump timer only', 'No', 'Sessions, side, freezer stash, countdown', 'Not stated', 'No / Yes', 'Free to try; Unlimited Records Upgrade $19.99 once'],
          ['Glow Baby', 'Nursing sessions and durations', 'Not stated', 'Pump log with storage details', 'Extra caregivers need the Family Plan (about $90/yr)', 'Yes / Not stated', 'Free with ads; Premium $59.99/yr'],
        ],
      },
      diapers: {
        caption: 'Minimum daily diapers for a breastfed newborn in the first week, from CDC: Newborn Breastfeeding Basics.',
        headers: ['Age', 'Wet diapers (at least)', 'Poops (at least)'],
        rows: [
          ['Day 1', '1', '1'],
          ['Day 2', '2', '3'],
          ['Day 3', '5', '3'],
          ['Day 4', '6', '3'],
          ['Days 5 to 7', '6', '3'],
        ],
      },
    },
`**The best breastfeeding app for most families in 2026 is Baby Tracker by Nighp: a nursing timer that remembers the last side, a pumping inventory and PDF export, with ads removed for $4.99 once. Baby Feed Timer is the best pure nursing timer. MamaBee is the best free, ad-free pick on iPhone, and Pump Log is best for exclusive pumping.**
This article is written by Realm Labs, the developer of MamaBee. We ranked our own app with the same criteria as everyone else, and say where others are better.
Every price, rating and feature below was checked on the US App Store, Google Play and each developer's own website on November 15, 2026.
## Quick picks: the best breastfeeding app for each need
[[TABLE:picks]]
## Breastfeeding app scores
[[TABLE:scores]]
A breastfeeding app should start a feed one-handed in the dark, remember the last side, log pumped milk and bottles, and show the pattern to your partner and doctor. Our [best baby tracker apps](/mamabee/articles/best-baby-tracker-apps-compared) comparison covers sleep and growth; this ranking is only about feeding.
## What each breastfeeding app offers
[[TABLE:features]]
## The 9 best breastfeeding and pumping apps, ranked
### 1. Baby Tracker – Newborn Log (Nighp): best overall, 8.4
**Who it's for:** families who want a fast, complete feeding log on any device and would rather pay once than subscribe.
**What's free:** the whole tracker, with ads: a nursing timer that records time on each breast and the last side used, bottles, pumping amounts, diapers, sleep and WHO growth.
**Price:** Remove Ads is $4.99 once. Plus ($5.99 a month or $49.99 a year) adds What's Next timing cues.
**Strengths:** the best pumping-to-bottle bookkeeping of the general trackers. Nighp's FAQ says the pumping inventory is total pumped milk minus bottle-fed breast milk, and you can correct it by hand. Records export as a PDF to email or print for your doctor. Widgets, Live Activities, Apple Watch and Siri, plus 227,374 US ratings at 4.8 stars since 2014.
**Limits:** the free version shows ads. Nighp's FAQ says the Apple Watch features and Siri Shortcuts come with the paid upgrade. Its listing doesn't mention reminders that say which breast to start on, as Baby Feed Timer's do.
[[IMG:comp-babytracker-home.png|Baby Tracker's home screen shows the last feed, diaper and sleep at a glance. Screenshot: Nighp Software, via the US App Store.|Baby Tracker home screen with color-coded activity cards]]
### 2. Baby Feed Timer: best nursing timer, 8.1
**Who it's for:** nursing parents who want the sharpest left/right timer, an Apple Watch app, and a partner on Android.
**What's free:** a 7-day trial. After that, the developer says, the app stops working, apart from exporting your data, until you buy the full version. You're never billed automatically.
**Price:** $9.99 once for the full version.
**Strengths:** built around nursing since 2010. Big left and right buttons, pause, and switching breasts within one feed. It shows time since the last feed, when the next is due and which breast to use next, and reminders can reach you through Do Not Disturb. It also logs bottles, pumps, diapers, sleep and growth. Data syncs between iPhone and Android, with a web viewer. Apple Watch, Siri and an automatic night theme, and 24,651 US ratings at 4.9 stars.
**Limits:** there's no lasting free tier. Pumping is a log, without a stash tracker. Export is by email rather than a formatted doctor report. Its Google Play listing says it contains ads. Our [Baby Feed Timer vs MamaBee](/mamabee/articles/baby-feed-timer-vs-mamabee) comparison goes deeper.
### 3. MamaBee: best free, ad-free pick on iPhone, 7.4
**Who it's for:** iPhone families who want a free, ad-free feeding log shared with a partner, and a clean report for the doctor.
**What's free:** one-thumb logging for breastfeeding with left and right timers, bottles, pumping and diapers (wet, dirty, mixed or dry), plus sleep, solids and health logs. Also growth with WHO percentiles, 45+ CDC milestones, 7-day insights, widgets, real-time sync for 2 caregivers, and CSV, JSON or pediatrician PDF export.
**Price:** free. Premium ($4.99 a month or $49.99 a year) adds Sleep Coach nap prediction, unlimited Bee AI, the full vaccine schedule, multi-baby sync and extra co-parents.
**Strengths:** no ads on any tier, and partner sync and the pediatrician PDF are free. When a lactation consultant asks how many feeds and wet diapers your baby has had, you hand over a tidy summary instead of scrolling. Logs stay on your iPhone first, and we never sell your data.
**Limits:** iPhone-only (iOS 17.6 or later), with no Android, iPad or Apple Watch app, so sync needs both caregivers on iPhone. No which-side-next or feed-due reminder like Baby Feed Timer's, and no stash or inventory tracker like Pump Log's or Nighp's. It's also new, with only a handful of US ratings.
[[IMG:log-formula|Logging a bottle in MamaBee takes one thumb, then you're back to the baby.|MamaBee screen for logging a formula bottle]]
[[CTA||Try MamaBee free: left/right timers, partner sync and a pediatrician PDF, with no ads.]]
### 4. Sprout Baby: best for hands-free logging, 7.3
**Who it's for:** families happy to subscribe for a polished all-in-one tracker with strong Apple Watch support.
**What's free:** Sprout's App Store listing is built around an auto-renewing subscription. Its help centre says that if you cancel, you can still see everything you entered but can't add new data.
**Price:** Premium is $59.99 a year, $14.99 to $19.99 a month, or $5.99 a week. A $29.99 Short Term Care option is also listed.
**Strengths:** timers for nursing, bottles and pumping. Log from Apple Watch with double tap, by Siri, or from widgets and Live Activities. Sharing is real time, and one subscription covers invited caregivers. It makes a full doctor report and CSV files. 31,568 US ratings at 4.8 stars.
**Limits:** the highest yearly price here, and no logging without a subscription. Its listing doesn't mention a which-side-next cue or a stash tracker. It needs iOS 18.6 or later, and the Android app is much smaller (10K+ downloads).
### 5. Huckleberry: best free pick for iPhone + Android couples, 7.2
**Who it's for:** couples on mixed phones who want a free, ad-free feeding log, and may later pay for sleep help.
**What's free:** a one-touch tracker, a breastfeeding timer for both sides, pumping, reminders and sync across caregivers, who sign in to the same account.
**Price:** Plus is $11.99 a month or $68.99 a year; Premium is $14.99 a month or $119.99 a year. Both are mostly about sleep, such as SweetSpot nap prediction.
**Strengths:** 78,831 US ratings at 4.9 stars and 1M+ Google Play downloads. The free tier works across iPhone and Android, with no ads label on Google Play.
**Limits:** widgets, Live Activities and Apple Watch need a paid plan. Enhanced Reports are paid, and we couldn't find a file export or a which-side-next cue on the listing. See our [Huckleberry vs Baby Tracker](/mamabee/articles/huckleberry-vs-baby-tracker) comparison for more.
### 6. Feed Baby: simple and cheap, but not recently updated, 6.1
**Who it's for:** parents who want a basic nursing, pumping and diaper log with big buttons and device sync.
**What's free:** the app is free to download, with in-app unlocks.
**Price:** two unlocks are listed, at $5.99 and $6.99.
**Strengths:** single-touch feeds, pump amounts, diapers, sleep and growth. Sync between any number of devices, CSV export, Apple Watch and Android. 11,106 US ratings at 4.6 stars.
**Limits:** the last iOS update was in May 2021, so expect rough edges on new iPhones. The listing doesn't mention which-side-next cues. Its Google Play listing says it contains ads.
### 7. Medela Family: best for Medela pump owners, 6.0
**Who it's for:** parents who already own a Medela Sonata, Freestyle Flex or Swing Maxi smart pump.
**What's free:** everything. The US listing has no in-app purchases.
**Price:** free.
**Strengths:** it records sessions in real time from those pumps, and its virtual milk storage tracks your stash and expiration dates. Records export for your pediatrician, and there are expert articles and an Android app.
**Limits:** the milk storage and voice control are only for Medela pump users, per the listing. We couldn't find partner sharing or a which-side-next cue on the listing. US ratings average 4.3 stars from 4,906, the lowest here.
### 8. Pump Log: best for exclusive pumping, 5.3
**Who it's for:** parents who exclusively pump. Its own listing says it is "NOT the all-in-one baby tracker".
**What's free:** free to download and try. The developer says there's no subscription and points you to the app for current free limits.
**Price:** the US listing shows an Unlimited Records Upgrade at $19.99, a one-time purchase.
**Strengths:** the deepest pumping tools here: a power pumping timer, volume and side per session, a freezer stash, and a countdown toward your feeding goal. Full-screen alarms on iOS 26, widgets and Apple Watch. 5,860 US ratings at 4.9 stars.
**Limits:** it scores low overall because our criteria reward nursing timers, bottles and sharing, which it doesn't try to do. iPhone and Apple Watch only. We couldn't find partner sharing or export on its listing or site. Our [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) guide pairs well with it.
### 9. Glow Baby: community-minded, but sharing and export cost extra, 5.1
**Who it's for:** parents who want logging plus articles and a community, and don't mind ads.
**What's free:** full logging, including a breastfeeding tracker and a pump log with storage details, with ads.
**Price:** Glow Premium is $59.99 a year. Glow's FAQ says inviting other caregivers needs the Family Plan, about $90 a year.
**Strengths:** a wide log, AI forecasts for the next nap and feed, and a Premium plan that works across all Glow apps. 23,460 US ratings at 4.7 stars, and an Android app with 1M+ downloads.
**Limits:** without a subscription, Glow's FAQ says you can only track on your own account, and PDF or CSV export is a Premium feature. The free version has ads, and the last iOS update was November 2025. See [Glow Baby vs MamaBee](/mamabee/articles/glow-baby-vs-mamabee).
## What to track in the first weeks
The CDC and the American Academy of Pediatrics (AAP) point to the same few signs that a breastfed newborn is getting enough milk. The AAP suggests that, if you or your pediatrician are concerned about intake, you keep a record of wet diapers and bowel movements in the early days. Any app here can be that record.
### Feeds per day
The CDC says a breastfed baby will feed about 8 to 12 times in 24 hours. In the first days your newborn may want to eat as often as every 1 to 3 hours, and later most exclusively breastfed babies feed every 2 to 4 hours, sometimes closer together during cluster feeding. The AAP notes that newborns usually nurse about every 2 hours, counted from the start of one feed to the start of the next. If your baby's feeds come in bunches, our [cluster feeding guide](/mamabee/articles/cluster-feeding) explains what's normal.
What to log: the start time of every feed and, if you like, which side. Your app's count per 24 hours is the number your pediatrician will want.
### Wet and dirty diapers
Diapers are the easiest output to count. The CDC lists these minimums for the first week:
[[TABLE:diapers]]
The AAP adds that by 5 to 7 days old, a well-fed newborn should have 6 or more wet diapers a day with pale urine, and loose yellow stools. Log wet and dirty separately so the count is easy to read back.
### Weight checks
The CDC says it's normal for breastfed babies to lose some weight in the first week, and they should be back to birth weight by day 10 to 14. The AAP says a well-nourished newborn loses no more than 8% to 10% of birth weight in the first few days. It advises a first checkup no more than 48 hours after hospital discharge, where the weight check shows whether feeds are working. Log each weight your doctor records.
### When to call the pediatrician or a lactation consultant
The CDC lists these signs that a baby might not be getting enough milk, and says to speak to your baby's health care provider right away if you're worried:
- Your baby breastfeeds fewer than 8 times in 24 hours, most days.
- You can't see or hear your baby swallowing while feeding.
- Your baby has trouble staying latched, or you hear clicking sounds.
- Your baby seems fussy after feeds.
- Your baby is still losing weight after day 5.
- By 5 days old, there are fewer than 3 poops and fewer than 6 wet diapers a day.
- Your baby's skin looks a bit yellow.
The AAP's warning signs add feeds consistently shorter than about 10 minutes or longer than about 50 minutes in the first few months, and a baby who still seems hungry after most feeds. For cracked or damaged nipple skin, or pain that doesn't improve over the first 1 to 2 weeks, the CDC suggests talking to a lactation consultant or your doctor or nurse. If you're worried, call right away rather than waiting for a trend.
## How we scored
We scored each app out of 10 on nine fixed criteria, then took the plain average:
- **L/R timer:** left/right timing, pause and side switching.
- **Next side:** a cue for which breast to start on, or the last side shown.
- **Pumping & stash:** sessions, amounts and a stored-milk inventory.
- **Bottles:** formula and expressed milk in the same log.
- **3 AM speed:** one-handed logging, widgets, Apple Watch and voice.
- **Sharing:** how easily a partner logs on their own phone, and the cost.
- **Ads:** 10 for none; lower when the free version or a store listing shows ads.
- **Price:** what a year of useful feeding tracking costs.
- **Export:** a report or file for a pediatrician or lactation consultant.
Facts come only from each app's US App Store and Google Play listings and the developer's website, checked on November 15, 2026. A feature we couldn't find there scored as missing or limited, which may understate some apps.
## How to choose a breastfeeding app
Start with your phones. If you and your partner are on different platforms, MamaBee and Pump Log are out; every other app here has an Android version.
Then match the app to how you feed:
- **Mostly nursing:** Baby Feed Timer's next-side reminders are the best here. MamaBee and Huckleberry give you free left/right timers without them.
- **Nursing plus some pumped bottles:** Nighp's Baby Tracker keeps a running inventory of pumped milk. If you're about to start, read our guide to [introducing a bottle to a breastfed baby](/mamabee/articles/introducing-a-bottle-to-breastfed-baby).
- **Exclusive pumping:** Pump Log, or Medela Family if you own a Medela smart pump.
- **Combination feeding:** any general tracker works. Our [breastfeeding vs formula](/mamabee/articles/breastfeeding-vs-formula) guide covers the trade-offs, and the [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a starting estimate for formula amounts.
Finally, think about the night shift: a shared log means nobody asks "which side?" at 3 AM. Our [newborn night shifts](/mamabee/articles/newborn-night-shifts) guide shows how couples split the night. For apps beyond feeding, see our hub of the [best baby apps](/mamabee/articles/best-baby-apps).
## Frequently asked questions
### What is the best breastfeeding app?
For most families, Baby Tracker by Nighp, because it combines a nursing timer, a pumping inventory and PDF export on iPhone and Android, with ads removed for $4.99 once. Baby Feed Timer is the best dedicated nursing timer at $9.99 once. MamaBee is the best free, ad-free option on iPhone.
### Is there a free breastfeeding app with no ads?
Yes. MamaBee's free tier has left/right timers, bottles, pumping and 2-caregiver sync with no ads on any tier, on iPhone. Huckleberry's free tier has a two-sided timer and caregiver sync on iPhone and Android, with no ads label on Google Play. Medela Family is free with no in-app purchases.
### Which breastfeeding app tells you which side to start on?
Baby Feed Timer shows which breast to use next on screen, in its feed reminders and on Apple Watch. Nighp's Baby Tracker records which side you last used. MamaBee has left/right timers but no next-side reminder.
### What is the best app for tracking pumping and a milk stash?
Pump Log is the most complete for exclusive pumping, with a freezer stash and a countdown, for a $19.99 one-time upgrade. Nighp's Baby Tracker keeps a pumped-milk inventory inside a full baby log, and Medela Family tracks stored milk for Medela pump users.
### What should I track for my pediatrician or lactation consultant?
Track feeds per 24 hours, wet and dirty diapers, and each weight check. The CDC says breastfed babies usually feed 8 to 12 times a day and should be back to birth weight by day 10 to 14. Export or show the summary at the visit.
## The takeaway
There's no single best breastfeeding app, but there is a best one for how you feed. Nighp's Baby Tracker is the strongest all-rounder, Baby Feed Timer the best nursing timer, and Pump Log the pumping specialist. Huckleberry is the free choice for mixed-phone couples. If you're on iPhone and want free timers, free partner sync and a pediatrician PDF with no ads, MamaBee is built for that.
[[CTA||Download MamaBee free and log every feed with one thumb, no ads.]]
Sources: ${SRC_NIGHP}, ${SRC_BFT}, ${SRC_HUCK}, ${SRC_SPROUT}, ${SRC_GLOW}, ${SRC_PUMP}, ${SRC_HEALTH}.
${FOOT}`,
    'mamabee-baby-feed-timer-vs-mamabee'),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  // Borrow the cover from a related, already-published article.
  if (a.coverFrom) {
    const cover = await client.fetch('*[_id==$id][0].coverImage', {id: a.coverFrom})
    if (cover?.asset?._ref) doc.coverImage = {_type: 'image', asset: {_type: 'reference', _ref: cover.asset._ref}}
    else console.warn(`⚠️  no cover found on ${a.coverFrom}`)
  }
  if (DRY) { const w = doc.body.filter((b) => b._type === 'block').reduce((n, b) => n + b.children.reduce((m, s) => m + s.text.split(/\s+/).filter(Boolean).length, 0), 0); console.log(`DRY ${a.slug}: ~${w} words, ${doc.body.filter((b) => b._type === 'comparisonTable').length} tables, title ${a.title.length}c, desc ${a.description.length}c, cover ${doc.coverImage ? 'yes' : 'no'}`); continue }
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${tables} tables, title ${a.title.length}c, desc ${a.description.length}c, cover ${doc.coverImage ? 'yes' : 'no'})`)
}
console.log(DRY ? '\nDry run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
