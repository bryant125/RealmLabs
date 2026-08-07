// MamaBee batch (10) as DRAFTS. Mix of App-pillar comparison + parenting.
// Topics checked against CONTENT-LOG for zero keyword cannibalization.
// Run once: node scripts/week6-articles.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
const A=(slug,title,description,tags,tables,body)=>({slug,title,description,tags,tables,body})

const articles = [

  A('protecting-baby-from-household-chemicals',
    'Baby-Safe Home: Household Chemicals and Hygiene Every Parent Should Know',
    'A calm, practical guide to protecting your baby from everyday household chemicals and germs — safer cleaning, plastics and food, safe storage, sensible hygiene, and what actually matters.',
    ['baby safe home', 'household chemicals baby', 'non toxic baby', 'baby hygiene', 'baby chemical safety'],
    {},
`Once your baby starts grabbing, mouthing and crawling, the ordinary house turns into a landscape of things they'll try to eat, lick or spill on themselves. It's easy to spiral into fear about chemicals and germs — the internet is happy to help you panic. So let's do the opposite: a calm, practical guide to what genuinely matters for keeping your baby safe from everyday chemicals and hygiene hazards, and what you can safely stop worrying about.
## Two different risks, don't confuse them
First, separate the two things people lump together, because they need very different responses:
- **Acute poisoning** — a baby swallowing a cleaning product, medicine or detergent pod *right now*. This is the real, immediate, high-stakes danger, and it's almost entirely preventable with storage.
- **Chronic low-level exposure** — long-term contact with certain chemicals in plastics, fragrances and finishes. This is lower-stakes and more debated, worth reducing sensibly without losing sleep.
Put your energy where the risk is biggest: **locking things up beats chasing every trace chemical.** Get the first one right and you've handled the danger that actually sends babies to the ER.
## Lock it up: the single most important step
Accidental poisoning is one of the most common household injuries for small children, and it's preventable. Do this first:
- **Store all cleaning products, laundry pods, medicines, vitamins, cosmetics and alcohol up high and locked** — not under the sink, which is exactly where curious crawlers head. Cabinet locks are cheap.
- **Keep everything in its original container.** Never decant chemicals into cups, water bottles or food containers — a huge cause of accidental poisoning.
- **Laundry and dishwasher pods are especially dangerous** — they look like candy or toys and are highly concentrated. Store them sealed and out of reach.
- **Handbags and visitors' bags** often hold medicines and hand sanitizer — keep them out of baby's reach too.
- **Save the Poison Control number now:** in the US, **1-800-222-1222**, free and 24/7. Put it in your phone and on the fridge. If you suspect your child swallowed something, call immediately — don't wait for symptoms, and don't make them vomit unless told to.
[[CTA||Keep meds, symptoms and doctor visits in one place — MamaBee logs it all for the moments that matter.]]
## Safer cleaning around a baby
You don't need a chemistry degree, just a few sensible habits:
- **Ventilate.** Open a window when cleaning; babies' airways are more sensitive to fumes.
- **Never mix products** — especially bleach and ammonia, which create toxic gas.
- **Clean baby's zones simply.** For floors, high chairs and toys they mouth, plain soap and water or a damp cloth handles most jobs. Simple often beats "stronger."
- **Rinse and dry surfaces** your baby touches or mouths after using any cleaner or disinfectant.
- **Go fragrance-light where you can.** "Fragrance" is a common irritant; unscented or low-fragrance products are a reasonable default for a baby's environment.
## Plastics and food: reduce, don't panic
This is the chronic-exposure side, and a little care goes a long way:
- **Never microwave or pour boiling liquid into plastic.** Heat is what drives chemicals like BPA and phthalates out of plastic into food. Heat food in glass or ceramic instead.
- **Choose glass or stainless bottles and food containers** where practical, and BPA-free plastics otherwise.
- **Retire scratched, cloudy or old plastic** — worn plastic leaches more.
- **Don't put plastic in the dishwasher's hot cycle** if you can hand-wash it instead.
The goal is sensible reduction, not a plastic-free life. Warming a bottle in glass rather than a plastic container is an easy, meaningful win. This matters most as your baby starts solids — see [when to start solids](/mamabee/articles/when-to-start-solids).
## Air, fragrance and smoke
- **Secondhand (and thirdhand) smoke** is one of the clearest, best-proven household risks to babies — linked to SIDS, chest infections and ear infections. Keep your baby's environment completely smoke-free, and note that residue lingers on clothes, furniture and skin.
- **Go easy on air fresheners, plug-ins and scented candles** around babies; fragrance chemicals can irritate developing airways. Fresh air and ventilation are the better "air freshener."
## Hygiene that actually matters (and over-doing it)
Germ safety is real, but more sanitizing isn't always better:
- **Handwashing is the highest-value habit** — yours and, later, your baby's. Wash before feeds and after diaper changes; it prevents more illness than any spray. See [baby's first cold](/mamabee/articles/baby-first-cold).
- **Clean, don't sterilize everything, forever.** Sterilizing bottles matters in the early months. But scrubbing every surface with disinfectant constantly isn't necessary and adds chemical exposure. Normal clean is the goal for most things.
- **A little dirt is okay.** Everyday exposure to ordinary germs is part of how a baby's immune system develops. You're aiming for clean, not sterile.
- **Wash new clothes and bedding** before first use to remove manufacturing residues, ideally in a fragrance-free, baby-friendly detergent.
## A quick room-by-room audit
Ten minutes with this checklist catches most of the real hazards:
- **Kitchen:** cleaners and dishwasher pods out of the under-sink cabinet and up high or locked; sharp items and small magnets away; nothing decanted into food containers.
- **Bathroom:** medicines, vitamins, mouthwash, nail products and cosmetics up high and closed; toilet lid down; no standing water. Many poisonings happen with medicines left on a low shelf or in a handbag.
- **Laundry:** detergent and pods sealed and out of reach — these are among the most dangerous because they look like sweets.
- **Living areas:** houseplants checked (some are toxic if chewed); alcohol out of reach; visitors' bags with pills or sanitizer kept up high.
- **Nursery:** unscented or low-fragrance products where possible; nothing with strong "new plastic" smell left to off-gas in a closed room; wash new items before use.
- **Garage/utility:** the highest-risk zone — pesticides, antifreeze, paint, solvents. Keep the door to it closed and everything locked; antifreeze in particular is sweet-tasting and highly toxic.
You don't have to do it all at once — start with the kitchen and bathroom, since that's where crawlers spend the most time and where the most poisonings happen.
## What you can stop stressing about
Balance matters, so here's permission to relax on a few things: you do not need to buy every "non-toxic" branded product marketed to anxious parents; a normally clean home is fine, not a hazard; and trace exposures from occasional ordinary use are far down the risk list compared to unlocked cabinets and secondhand smoke. Spend your worry budget on the big, proven risks and let the rest go.
## Frequently asked questions
### What is the biggest household chemical danger to babies?
Accidental poisoning from swallowing cleaning products, laundry pods or medicines is the most immediate, serious risk — and it's largely preventable by storing everything locked, up high, and in original containers. Save Poison Control (1-800-222-1222 in the US) in your phone.
### Do I need to buy special non-toxic baby cleaning products?
Not necessarily. Plain soap and water handles most of a baby's zones, and good habits — ventilating, not mixing products, rinsing surfaces, choosing low-fragrance options — matter more than any particular branded product.
### Are plastics dangerous for my baby?
The main concern is heat driving chemicals like BPA out of plastic, so never microwave or pour boiling liquid into plastic — use glass or ceramic to heat food, choose glass or BPA-free containers, and retire worn plastic. Sensible reduction, not panic, is the aim.
### How clean does my home really need to be?
Clean, not sterile. Handwashing and cleaning baby's feeding items matter most; constant disinfecting of every surface isn't necessary and adds exposure. Some everyday germ contact actually helps a baby's immune system develop.
## The takeaway
Protecting your baby from household chemicals is mostly about one high-value move — locking away cleaners, pods and medicines and keeping the Poison Control number handy — plus a handful of sensible habits: ventilate when cleaning, heat food in glass not plastic, keep the air smoke- and fragrance-light, wash hands, and clean rather than sterilize. Skip the fear and the pricey "non-toxic" marketing; put your attention on the big, proven risks and your baby's daily world becomes genuinely safer without the anxiety. For more on everyday baby health, see [baby's first cold](/mamabee/articles/baby-first-cold) and [safe sleep guidelines](/mamabee/articles/safe-sleep-guidelines).
[[CTA||Get MamaBee free — track health, meds and milestones so nothing important slips through.]]
*This article is general information, not medical advice. In a suspected poisoning, call Poison Control (1-800-222-1222 in the US) or your local emergency number immediately.*`),

  A('best-free-baby-tracker-apps',
    'Best Free Baby Tracker Apps 2026: Which Free Tier Is Actually Worth It',
    'The best genuinely free baby tracker apps in 2026 — what each free tier really includes, which ones show ads, and how to pick a free tracker you will actually keep using.',
    ['free baby tracker app', 'best free baby tracker', 'baby tracker no ads', 'free newborn tracker', 'free baby log app'],
    {
      free: {
        caption: 'What each free tier really gives you. Verified on the US App Store, August 2026.',
        headers: ['App', 'Free tier', 'Ads on free', 'Standout free feature'],
        rows: [
          ['MamaBee', 'Full logging + insights', 'None', 'No ads at all, ever'],
          ['PiyoLog', 'Full app', 'Yes', 'Beautiful daily time bar'],
          ['Baby Tracker (Nighp)', 'Full app', 'Yes', '$4.99 once removes ads'],
          ['Huckleberry', 'Logging only', 'None', 'Upgrade path to SweetSpot'],
        ],
      },
    },
`"Free" is the most abused word in the app store. Some baby trackers are free because they show you ads. Some are free but lock the useful parts behind a subscription. And a few are genuinely, usefully free. If you want a tracker without paying, here is which free tiers are actually worth your time in 2026 — and the catch behind each.
## What "free" really means for baby trackers
Before the list, know the three flavours of free:
- **Free with ads** — the whole app works, funded by advertising shown inside it.
- **Free but limited** — logging is free, but the features people actually want are paywalled.
- **Genuinely free** — a complete, useful app at no cost and no ads (rare).
Which one you're getting matters more than the star rating.
## The best free baby trackers, compared
[[TABLE:free]]
## MamaBee — the free tier with no ads
We make MamaBee, so here are the facts plainly. The free tier is a complete tracker: one-tap logging of sleep, feeds, diapers and more, 7-day insights, WHO growth percentiles, 45+ CDC milestones, vaccine schedules, co-parent sync for two, and full export — with **no ads on any tier, ever.** That last part is genuinely rare: most free baby trackers are ad-supported. The trade-offs: it is iPhone only, and the AI features (Sleep Coach prediction, unlimited Bee AI) are Premium.
## PiyoLog — the most beautiful free log
PiyoLog's free version is the whole app, and its daily time-bar view is the clearest "what happened today?" screen in any tracker. The catch is ads — unobtrusive on iPad, but they take real screen space on a phone, which is where you use it at 3 AM. $34.99/year removes them. No prediction or AI at any tier.
## Baby Tracker by Nighp — free, then $4.99 forever
227,000 ratings say a lot. The free version is complete and ad-supported; a single $4.99 purchase removes ads permanently with no subscription ever. Fast, reliable, cross-platform (iPhone, iPad, Android). No prediction or AI — by design.
## Huckleberry — free, but the good stuff isn't
Huckleberry's free tier is essentially basic logging. Its signature SweetSpot nap prediction and Berry AI are paid (up to $119.99/year). Great app, but "free Huckleberry" isn't what most people are picturing.
[[CTA||Want a free baby tracker with no ads in it? MamaBee's free tier has you covered.]]
## Don't forget the free tools
A tracker isn't the only free help available. Alongside a free app, standalone calculators answer specific questions without any download — and they're genuinely useful in the early months:
- A [wake window calculator](/mamabee/tools/wake-window-calculator) to time the next nap
- A [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) to estimate amounts
- A [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) for an age-based routine
- A [due date calculator](/mamabee/tools/due-date-calculator) if you're still expecting
Pair a free tracker with a couple of these and you've covered most of what a new parent needs, at zero cost.
## What free tiers usually *don't* include
Knowing the common paywalls saves disappointment. Across the category, the features most often reserved for paid tiers are: nap or sleep prediction, AI chat assistants, unlimited history and long-range charts (free tiers often cap insights to the last 7 days), unlimited caregivers, and ad removal. If one of those is a must-have, check it's actually free before you commit — "free app" and "the feature I want is free" are frequently not the same thing. The upside: for pure logging and remembering, every app here delivers that at no cost, and logging is what you'll use ninety percent of the time.
## How to choose a free tracker you'll actually keep
- **Hate ads?** MamaBee (free, no ads) or Baby Tracker after the $4.99 unlock.
- **On Android?** PiyoLog or Baby Tracker — MamaBee is iPhone-only.
- **Want it to look beautiful?** PiyoLog's time bar.
- **Want prediction later?** MamaBee's free tier upgrades to Sleep Coach cheaply; Huckleberry's upgrades to SweetSpot expensively.
And the golden rule: pick one and stay. A tracker's value compounds — six weeks of history in a "good enough" free app beats starting over in a "better" one.
## How to actually get started (or switch) for free
Picking a free tracker is easy; using one consistently is what actually helps. A few tips to make it stick:
- **Set it up before you're desperate.** Download and log in during a calm moment, not at 3 AM mid-meltdown. Add your baby's details and pin the app somewhere easy to reach.
- **Put it on your home screen and lock screen.** A tracker you have to hunt for is a tracker you won't use. Widgets, if the app has them, make one-tap logging realistic.
- **Log the big three first.** Sleep, feeds and diapers are the high-value entries. Don't try to track everything from day one — you'll burn out. Add more detail once the habit sticks.
- **Get both parents on it.** If your free tier offers caregiver sharing, use it — a shared log ends the "did you already feed her?" texts and doubles the data quality.
- **Give it a week before judging.** A tracker feels pointless on day one and genuinely useful by day seven, once there's a pattern to see.
**Switching from another app?** There's rarely a direct import between baby trackers, so most people export a summary from the old app for their records and simply start fresh. It sounds worse than it is — a tracker becomes useful again within about a week of new data, so you're not really losing much by moving to one that fits you better.
## Does free mean worse?
A fair worry: is a free tracker just a crippled version of a paid one? Usually not, for the core job. Logging feeds, sleeps and diapers, seeing a daily timeline, and tracking growth are table stakes that every app here does free and does well. What you pay for is the *intelligence and convenience layer* on top — prediction, AI, unlimited history, backup, no ads. Plenty of parents use a free tracker for a baby's entire first year and never feel the lack, because what they needed was a reliable memory, not a sleep algorithm. Start free, use it for a few weeks, and you'll know quickly whether you're bumping into a limit worth paying to remove — or whether free was always enough. Upgrading later is one tap; you won't lose your history.
## Frequently asked questions
### What is the best totally free baby tracker app?
For a free tier with no ads, MamaBee (iPhone only). For a free app on any platform, PiyoLog and Baby Tracker are both complete, though ad-supported until you pay.
### Are free baby tracker apps safe with my data?
Not automatically — many are ad-supported and share data. A Surfshark audit found most popular baby apps share data with third parties. Prefer apps that keep data on your device; see our guide on [whether baby tracker apps are safe](/mamabee/articles/are-baby-tracker-apps-safe).
### Do free baby trackers have ads?
Most do — that's usually how "free" is funded. MamaBee is the exception with no ads on any tier. Baby Tracker clears ads for a one-time $4.99.
### Is a free tracker good enough, or should I pay?
For logging and remembering, free is plenty. Pay only if you want prediction, AI or backup — and even then, prices vary hugely, from $4.99/month down to $34.99/year.
## The takeaway
The best free baby tracker depends on your one dealbreaker: no ads (MamaBee), any platform (PiyoLog, Baby Tracker), or a cheap forever-unlock (Baby Tracker's $4.99). All will log your baby's day; the differences are ads, platform and what you can add later. For the full paid-vs-free picture, see our [baby tracker apps comparison](/mamabee/articles/best-baby-tracker-apps-compared).
[[CTA||Get MamaBee free — complete logging, zero ads, and your data stays on your device.]]
*Prices and features verified on the US App Store, August 2026. This article is general information, not medical advice.*`),

  A('are-baby-tracker-apps-safe',
    'Are Baby Tracker Apps Safe? What They Collect and How to Protect Your Data',
    'Are baby tracker apps safe with your data? What these apps actually collect, why baby trackers fall outside HIPAA, the 2026 research on data-sharing, and how to choose a private one.',
    ['baby tracker app privacy', 'are baby tracker apps safe', 'baby app data privacy', 'baby tracker data', 'private baby tracker'],
    {},
`You type your baby's name, birth date, feeding times, sleep patterns and health notes into an app — some of the most intimate data that exists about a new human being. It is fair to ask: where does all that actually go? The uncomfortable answer for a lot of popular baby apps is "further than you'd think." Here is what baby tracker apps collect, what the research shows, and how to pick one that respects your family.
## Why this matters more than you'd expect
Baby and pregnancy apps hold unusually sensitive data: health information, exact daily routines (useful to anyone wanting to know when you're home), your baby's name and photos, and sometimes location. And here is the part most parents don't know: **baby trackers are not covered by HIPAA.** HIPAA governs doctors and insurers — not a consumer app on your phone. So the health-privacy protections you assume exist often simply don't apply.
## What the 2026 research found
A [Surfshark audit published in 2026](https://surfshark.com/research/chart/baby-trackers-privacy) looked at the ten most popular pregnancy and baby apps and found:
- **80% share data with third parties**
- They collect an average of **11 of 38 possible data types**
- **8 of 10 collect photos**
- **8 of 10 display ads or share data with advertising partners**
"Shares with third parties" typically means advertising networks and analytics companies — and once your data is in an ad ecosystem, you have very little control over where it travels next.
## What baby apps typically collect
Not every app collects everything, but across the category the common items are:
- Your baby's name, date of birth and gender
- Detailed feeding, sleep, diaper and health logs
- Photos you attach
- Your email, and sometimes location and device identifiers
- Usage analytics (which screens you open, how often)
The logs themselves are revealing: a feeding-and-sleep pattern is effectively a map of when someone is awake, home, and occupied.
## How to tell if a baby tracker is safe
You don't need to be a privacy expert. Check these five things before you commit:
- **Where is data stored?** On your device (best) or on the company's servers? "Local-first" apps keep data on your phone by default.
- **Does it show ads?** Ads usually mean data is shared with ad networks. No ads is a good sign.
- **Does it sell or share data?** Read the "Data Used to Track You" section on the App Store listing — Apple requires apps to disclose it.
- **Can you export and delete everything?** If you can't take your data out, it isn't really yours.
- **Is the privacy policy readable?** Vague or missing policies are a red flag.
## What a privacy-respecting tracker looks like
This is the standard we built MamaBee to — and the standard you should hold any app to:
- **Local-first storage** — your logs live on your device, and only reach a server if you deliberately turn on co-parent sharing
- **No ads, ever** — so there's no ad network to share with
- **Never sold, never used to train outside AI models**
- **Full export** — CSV, JSON and a pediatrician PDF, so your data stays portable
[[CTA||Want a baby tracker that keeps your data on your phone? MamaBee is local-first and ad-free.]]
When MamaBee's Bee AI answers a question, only a short summary plus your baby's first name, age and gender go to the language-model provider — never photos or your written notes. That's the kind of specific, limited data flow you want to see spelled out.
## The data types most worth guarding
Not all collected data is equal. A few categories deserve extra caution because of how they can be used or combined:
- **Photos** — 8 of 10 top baby apps collect them. Images can carry location metadata and are the hardest to claw back once shared.
- **Precise routines** — feed and sleep logs reveal when your household is awake, asleep and occupied. That's a behavioural profile, not just baby data.
- **Location** — rarely needed by a tracker; if an app requests it, ask why.
- **Device identifiers** — let advertisers link your baby data to the rest of your digital life across apps.
- **Your baby's name + birth date** — the seed of an identity, years before your child can consent to any of it.
If an app collects these *and* shares with third parties *and* shows ads, that's three strikes — the profile it builds is detailed and it's leaving the building.
## How to read an app's privacy label in 60 seconds
Apple requires every App Store listing to show a privacy summary, and it's the fastest way to vet a tracker before you download. On the app's App Store page, scroll to **"App Privacy"** and look at three things:
- **"Data Used to Track You"** — this is the big red flag. It means data is shared with third parties (usually advertisers) to follow you across other apps and sites. For an app holding your baby's health data, you want this section empty.
- **"Data Linked to You"** — information tied to your identity. Some is normal (an email for your account), but a long list here — health, photos, location, contacts — deserves a second look.
- **"Data Not Linked to You"** — the least concerning bucket; anonymized analytics live here.
A privacy-respecting baby tracker typically shows little or nothing under "Used to Track You," and keeps "Linked to You" short. If the label is long and ad-heavy, that tells you where the app's incentives really sit — no matter how gentle the marketing sounds.
On Android, the Play Store's **"Data safety"** section does the same job: check what's collected, what's shared, and whether you can request deletion.
One more sixty-second check: search the app's name plus "privacy policy" and skim for the words "sell," "share," "advertising" and "third parties." Vague or missing policies are themselves a warning.
## Practical steps to protect your baby's data
- Prefer an app that stores data on-device and shows no ads
- Skip attaching photos to apps that collect them, unless you trust the storage
- Turn off ad personalization in your phone settings
- Read the App Store privacy label before downloading
- Export a backup periodically so you're never locked in
## Frequently asked questions
### Are baby tracker apps covered by HIPAA?
No. HIPAA covers healthcare providers and insurers, not consumer apps. A baby tracker can hold detailed health data with none of HIPAA's protections, which is exactly why the app's own privacy practices matter so much.
### Do baby tracker apps sell my data?
Some share it with third parties, typically ad networks and analytics firms — a 2026 Surfshark audit found 80% of the most popular baby apps do. Others, like local-first apps, don't. Check the App Store privacy label and the policy.
### What is the most private baby tracker?
Look for local-first storage, no ads, and free export. MamaBee is built this way — data stays on your device by default and is never sold. Baby Tracker by Nighp also keeps data in your own iCloud or Dropbox.
### Is it safe to put my baby's photos in an app?
Only if you trust its storage and it doesn't share photos. The Surfshark audit found 8 of 10 popular baby apps collect photos, so be selective.
## The takeaway
Baby tracker apps can be safe — but many popular ones aren't as private as parents assume, and none are protected by HIPAA. Before you type your baby's life into one, check where the data lives, whether it shows ads, and whether you can export and delete it. Choose local-first and ad-free, and you keep the convenience without handing your family's data to advertisers. For which apps do this best, see our [baby tracker comparison](/mamabee/articles/best-baby-tracker-apps-compared).
[[CTA||Get MamaBee free — local-first, no ads, never sold. Your baby's data stays yours.]]
*This article is general information, not medical or legal advice. Always read an app's current privacy policy before use.*`),

  A('how-to-get-baby-to-sleep-through-the-night',
    'How to Get Your Baby to Sleep Through the Night: A Realistic, Gentle Guide',
    'How to help your baby sleep through the night — what "through the night" really means by age, the foundations that matter most, gentle steps that work, and when to expect it.',
    ['baby sleep through the night', 'baby sleeping through the night', 'help baby sleep longer', 'baby night waking', 'longer night sleep'],
    {},
`"Is she sleeping through the night yet?" is the question every new parent dreads, usually asked by someone who slept eight hours. Here is the reassuring truth: night waking is normal, "through the night" means less than you think, and there is a lot you can do to gently stretch those nights — without leaving your baby to cry if that's not your style.
## First: what "through the night" actually means
Set your expectations correctly, because the phrase is misleading. For a baby, sleeping "through the night" is often defined as a **5–6 hour stretch**, not a full 8–12 hours. And the timeline varies hugely:
- **Newborns (0–3 months):** wake every 2–4 hours to feed. This is normal and necessary — do not try to force long stretches yet.
- **4–6 months:** many babies *can* start doing longer stretches, some a full night, but plenty still wake — both are normal.
- **6+ months:** longer nights become more common, though night waking at any age is still within normal range.
If your newborn isn't sleeping through, nothing is wrong. Their tiny stomach and developing rhythms simply aren't built for it yet.
## The foundations that matter most
Before any "method," get these right — they do most of the work.
### A consistent bedtime routine
A short, calm, predictable sequence — dim lights, feed, bath or wipe-down, book, sleep — tells your baby's body that sleep is coming. Consistency is the active ingredient. See our [baby bedtime routine guide](/mamabee/articles/baby-bedtime-routine).
### Right-timed sleep (not overtired)
An overtired baby fights sleep and wakes more. Watch wake windows and sleepy cues so you're putting your baby down at the right moment — our [wake windows by age guide](/mamabee/articles/wake-windows-by-age) has the timings.
### Day-night distinction
Help set their body clock: bright and active during the day, dark and boring at night. Keep night feeds quiet, dim and interaction-free so night stays "for sleeping."
### Full daytime feeds
A baby who takes in enough calories during the day needs fewer at night. Cluster feeds in the evening can help top them up before the long stretch.
## Gentle steps to stretch the nights
Once the foundations are solid and your baby is old enough (check with your pediatrician before dropping night feeds):
- **Put baby down drowsy but awake.** This is the big one. A baby who falls asleep independently at bedtime can resettle themselves at 2 AM. A baby who only falls asleep feeding or rocking will look for that same help on every wake.
- **Pause before responding.** Babies are noisy sleepers and often resettle on their own. A brief pause before you rush in gives them the chance.
- **Try a dream feed.** A gentle feed while your baby is still asleep, around 10–11 PM, can push the first long stretch later. See our [dream feed guide](/mamabee/articles/dream-feed).
- **Keep night wakings boring.** Minimal light, minimal talking, feed or soothe, back to bed. Nothing to stay awake for.
[[CTA||Track night feeds and sleep stretches in MamaBee — and see the pattern that's actually forming.]]
## If you want to go further: sleep training
If gentle steps aren't enough and everyone is depleted, structured sleep training (from around 4–6 months, with your pediatrician's okay) can help — and it ranges from gentle to more direct. It's optional, not required. Our [sleep training methods compared](/mamabee/articles/baby-sleep-training-methods) walks through the options honestly, including the gentlest ones.
## Night weaning, gently (when they're ready)
If your baby is old enough, gaining weight well, and your pediatrician agrees they no longer need overnight calories, you can gently reduce night feeds rather than cutting them cold. A gradual approach is kinder on everyone:
- **For bottle feeds:** reduce the amount by half an ounce every few nights, or add a little water to dilute, until the feed is small enough to drop.
- **For breastfeeds:** shorten the time on the breast by a minute or two every few nights.
- **Push the first feed later** in small increments, using other comfort — a pat, a shush, a partner going in — to bridge the gap.
- **Send in the non-feeding parent** for night wakings; a baby who smells milk holds out for it, but often settles more easily for someone who can't provide it.
Go slowly and follow your baby. If they're clearly hungry, genuinely distressed, or unwell, pause — this isn't a race, and a growth spurt or regression is not the week to night-wean. The goal is to phase out feeds your baby no longer needs, not to withhold ones they do. And always clear it with your pediatrician first, especially if there have ever been any concerns about weight gain.
## Safe sleep always comes first
However you approach nights, keep sleep safe: baby on their back, on a firm flat surface, in a bare crib with no loose bedding, pillows or bumpers. See our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines). Never trade safety for a longer stretch.
## Common mistakes that keep nights broken
If progress has stalled, one of these is often why:
- **Bedtime too late, so baby is overtired.** Counterintuitively, an earlier bedtime frequently means *fewer* wakings, not more.
- **Rushing in at the first sound.** Babies stir and murmur between cycles; darting in can fully wake a baby who'd have resettled.
- **Feeding or rocking all the way to sleep every time.** It's lovely, but it becomes the only way your baby knows to fall asleep — including at 3 AM.
- **A bright, chatty night environment.** Light and interaction tell the brain it's daytime. Keep nights dim and dull.
- **Changing the approach every few days.** Consistency is what teaches the pattern; head-hopping between methods teaches nothing.
Fix the one that sounds like you before adding anything new — often that alone shifts things.
## When to expect it (and when to ask for help)
Many babies manage longer stretches somewhere between 4 and 6 months, but a wide range is normal well beyond that, and regressions are common around developmental leaps. Talk to your pediatrician if your baby is very hard to settle, seems in pain, snores or gasps in sleep, or isn't gaining weight — sleep problems occasionally have a medical cause worth checking.
## Frequently asked questions
### At what age do babies sleep through the night?
Many can manage a 5–6 hour stretch around 4–6 months, and some sleep longer, but night waking well beyond that age is still normal. Newborns are not developmentally ready and should not be pushed.
### What's the single most effective thing I can do?
Put your baby down drowsy but awake so they learn to fall asleep independently — that's what lets them resettle on their own during normal night wakings.
### Should I drop night feeds to get longer sleep?
Only when your baby is old enough and gaining weight well, and ideally after checking with your pediatrician. Some babies still genuinely need a night feed for a while.
### Is it normal for my 8-month-old to still wake at night?
Yes. Night waking at any age is within the normal range, and it often increases temporarily around developmental leaps, teething or illness.
## The takeaway
"Through the night" starts as a 5–6 hour stretch, not a full night, and arrives on its own timeline. Nail the foundations — consistent routine, right-timed and safe sleep, full daytime feeds, day-night distinction — and put your baby down drowsy but awake. Add gentle steps or, if you choose, sleep training when they're old enough. And go easy on yourself: this is developmental, not a test you're failing.
[[CTA||Get MamaBee free — track sleep, spot the pattern, and make the long nights easier to reach.]]
*This article is general information, not medical advice. Talk to your pediatrician about your baby's sleep and before changing night feeds.*`),

  A('baby-sleep-regressions-by-age',
    'Baby Sleep Regressions by Age: When They Hit and How to Get Through Them',
    'Every baby sleep regression explained by age — 4 months, 8–10 months, 12, 18 months and 2 years — why each happens, how long it lasts, and how to survive it without undoing good habits.',
    ['baby sleep regression', 'sleep regression ages', 'sleep regression chart', 'toddler sleep regression', 'baby sleep regression by age'],
    {
      ages: {
        caption: 'A rough guide — timing and intensity vary by baby.',
        headers: ['Regression', 'Usual timing', 'Main driver'],
        rows: [
          ['4-month', '~3.5–5 months', 'Permanent change in sleep cycles'],
          ['8–10 month', '~8–10 months', 'Crawling, separation anxiety, leaps'],
          ['12-month', '~11–13 months', 'Nap transition, walking'],
          ['18-month', '~17–19 months', 'Independence, teething (molars)'],
          ['2-year', '~24 months', 'Fears, big changes, nap dropping'],
        ],
      },
    },
`Just when you think you've cracked your baby's sleep, it falls apart overnight — shorter naps, more night wakings, a baby who suddenly fights bed. This is a sleep regression, and the good news is they're normal, temporary, and usually a sign your baby is *developing*, not breaking. Here's every common regression by age, why it happens, and how to get through without losing the good habits you've built.
## What a sleep regression actually is
A sleep regression is a stretch — usually a couple of weeks — where a baby who slept reasonably well suddenly doesn't. The cause is almost always development: a leap in brain growth, a new physical skill, teething, or a change in sleep needs. The sleep gets worse because something is going *right* underneath. Most last **2 to 6 weeks** and resolve on their own.
## The regressions by age
[[TABLE:ages]]
## The 4-month regression (the big one)
This is the only "regression" that's actually permanent — your baby's sleep matures from newborn sleep into adult-like cycles, and they start waking between cycles the way we all do. It doesn't go back. What helps is teaching independent falling-asleep so they can link cycles on their own. We have a full guide to the [4-month sleep regression](/mamabee/articles/4-month-sleep-regression).
## The 8–10 month regression
Driven by a stack of milestones at once: crawling or pulling up (babies literally practice in the crib), separation anxiety peaking, and a nap transition from three naps to two. Expect more night wakings and short naps.
**What helps:** lots of daytime practice of the new skill so they're less compelled to rehearse at 2 AM, extra reassurance for separation anxiety, and protecting the nap schedule.
## The 12-month regression
Often really a nap issue in disguise — many babies are pushed toward one nap too early. Combined with the excitement of walking, bedtime can get bumpy.
**What helps:** don't drop to one nap too soon (most aren't ready until 14–18 months), and keep bedtime consistent. See our [nap transitions guide](/mamabee/articles/baby-nap-transitions).
## The 18-month regression
The toddler one. A cocktail of asserting independence ("no!"), separation anxiety, and painful molars coming in. Bedtime battles are common.
**What helps:** hold your boundaries kindly and consistently, offer small controlled choices (which pajamas, which book) to satisfy the independence drive, and treat teething pain if present.
## The 2-year regression
Around age two: new fears and imagination, potential arrival of a sibling, moving to a big-kid bed, and dropping the last nap. Any of these can disrupt sleep.
**What helps:** a rock-solid routine, a nightlight for new fears, and not rushing big transitions all at once.
[[CTA||Track the wakings and naps in MamaBee — so you can see when a regression starts and when it lifts.]]
## How to survive any regression (the universal rules)
Whatever the age, the same principles carry you through:
- **Keep your routine steady.** Consistency is the anchor when everything else wobbles.
- **Protect independent sleep.** The habits you keep during a regression are the ones that hold after it.
- **Offer comfort without creating new crutches.** Reassure, but try not to introduce a habit (like a 3 AM feed or a car ride) you don't want to keep for months.
- **Meet extra needs during the day.** More connection, more skill practice, more calories if they're leaping — so nights have less to catch up on.
- **It will pass.** Two to six weeks. Ride it out; don't overhaul everything on night three.
## Regression, or something else?
Not every bad sleep patch is a "regression." Before you file it under development, rule out the common impostors:
- **Teething** — pain, drooling and chewing alongside the wakings; treat the pain and it often eases.
- **Illness** — fever, congestion or ear-pulling. Sleep suffers because your baby is unwell, not leaping.
- **Hunger or a growth spurt** — more feeds needed, day and night, for a stretch.
- **An outgrown schedule** — sometimes "the regression" is really a nap that needs dropping or wake windows that need lengthening. See our [nap transitions guide](/mamabee/articles/baby-nap-transitions).
- **A new habit** — a crutch introduced during a rough week that has quietly become the new normal.
The tell: a true regression lifts within a few weeks and isn't driven by an obvious external cause. If it drags on, look harder at these.
## How to tell a regression is ending
When you're deep in it, a regression feels endless — so it helps to know the signs it's lifting. You'll usually notice the pattern loosen before it fully resolves: wakings become less frequent or shorter, your baby resettles a little more easily, naps start to lengthen again, and the daytime fussiness eases. Often the clearest sign is the new skill "landing" — the rolling, crawling, babbling or standing that was brewing suddenly clicks into place, and sleep settles within days of it. If you're tracking sleep, you'll often see it in the data before you feel it in your body: the 3 AM wake-ups thin out over a week. That's your cue that the routine and habits you held steady are about to pay off — so keep them consistent through the tail end rather than declaring victory (or defeat) too early.
## Look after yourself through it, too
A regression is exhausting for parents, and running on broken sleep makes everything harder to cope with. Tag-team the nights with your partner so nobody takes every wake-up, lower your standards on everything non-essential for a couple of weeks, and accept help when it's offered. Caffeine and daylight are your friends; guilt is not. Remember the frame that makes it bearable: this bad patch is your baby's brain sprinting forward, it is temporary, and the version of you that's rested enough to be patient is worth protecting. If low mood lingers well beyond the regression, though, mention it to your doctor — exhaustion and postpartum mood changes can overlap.
## When it's not just a regression
Call your pediatrician if the sleep disruption comes with fever, ear-pulling, pain, poor feeding or weight concerns, or if "the regression" drags on for many weeks without lifting. Sometimes what looks like a regression is illness, teething needing relief, or a genuine schedule that's stopped fitting.
## Frequently asked questions
### How long do sleep regressions last?
Usually 2 to 6 weeks. If it goes on much longer, look for another cause — illness, teething, hunger, or a schedule that no longer fits your baby's age.
### Is the 4-month regression permanent?
The change in sleep cycles is permanent — sleep matures and doesn't revert. But the rough patch of adjusting to it is temporary, especially once your baby can fall asleep independently.
### Should I sleep train during a regression?
Most experts suggest riding out the regression with consistency rather than starting formal training mid-disruption. Wait until things settle, then address sleep habits if needed.
### Do all babies get every regression?
No. These are common patterns, not guarantees. Some babies breeze through ages that wreck others. Use the ages as a heads-up, not a prophecy.
## The takeaway
Sleep regressions are development in disguise — normal, temporary, and tied to leaps, skills, teething and changing nap needs. Know the ages so they don't blindside you, keep your routine and independent-sleep habits steady through them, meet the extra daytime needs, and wait it out. Two to six weeks later, sleep almost always settles again. For the timings underneath it all, see our [wake windows guide](/mamabee/articles/wake-windows-by-age), and for the deeper dive on the first big one, our [4-month sleep regression guide](/mamabee/articles/4-month-sleep-regression). Above all, hold onto the reframe: a regression is your baby's brain and body sprinting forward. The bad nights are the price of the new skill — and the skill is worth it.
[[CTA||Get MamaBee free — track sleep through every leap and see exactly when the regression lifts.]]
*This article is general information, not medical advice. Talk to your pediatrician if sleep problems persist or come with other symptoms.*`),

  A('colic-in-babies',
    'Colic in Babies: What It Is, Why It Happens, and What Actually Soothes',
    'Colic explained calmly: what colic really is, the rule of threes, why it happens, what genuinely helps a colicky baby, and the red flags that mean it is something else.',
    ['colic baby', 'colic in babies', 'colic symptoms', 'how to soothe colic', 'colic relief'],
    {},
`Few things are harder than a baby who cries for hours and cannot be consoled, while you try everything and nothing works. If that's your evenings right now, you may be dealing with colic — and the two most important things to know up front are: it is not your fault, and it does end. Here's what colic actually is, why it happens, and what genuinely helps.
## What colic actually is
Colic is not a disease or a diagnosis of something wrong — it's a term for **excessive, inconsolable crying in an otherwise healthy, well-fed baby.** The classic definition is the **"rule of threes":** crying for more than **3 hours a day, more than 3 days a week, for more than 3 weeks**, in a baby who is growing normally.
It typically starts around 2–3 weeks, peaks around 6 weeks, and usually resolves by 3–4 months. The crying often clusters in the late afternoon and evening — which overlaps with the [newborn witching hour](/mamabee/articles/newborn-witching-hour), though colic is more intense and prolonged.
## What colic looks like
- Intense crying that sounds like pain or distress, often at a predictable time of day
- A baby who is very hard or impossible to console
- Clenched fists, a red face, legs pulled up or stiffened, an arched back
- Crying that starts and stops for no obvious reason
- A baby who is otherwise feeding, growing and developing normally
That last point matters: a colicky baby is a *healthy* baby who cries a lot, not a sick one.
## Why colic happens
The honest answer: **nobody knows for sure.** Colic has been studied for decades without a single confirmed cause. The leading theories include:
- An immature digestive system and trapped gas
- An overwhelmed nervous system struggling to handle the day's stimulation
- Sensitivity to something in the diet (occasionally cow's-milk protein)
- A developing gut microbiome
- Simply the extreme end of normal infant crying
Because the cause isn't pinned down, no single cure exists — which is why soothing is about finding what works for *your* baby.
## What actually helps
Work through these and keep what your baby responds to:
- **Motion** — rocking, a walk in the carrier or stroller, a gentle car ride. Steady motion soothes many colicky babies.
- **Sound** — white noise, a shush, a vacuum or hairdryer sound mimics the womb.
- **The hold** — holding baby tummy-down along your forearm ("colic hold") can ease gas and comfort.
- **Swaddling** — snug wrapping calms an overwhelmed nervous system. See [how to swaddle](/mamabee/articles/how-to-swaddle-a-baby).
- **A calm, dim environment** — reduce stimulation in the evening before the crying usually starts.
- **Check feeding** — good latch, upright feeding and thorough burping reduce swallowed air; see [gas relief](/mamabee/articles/newborn-gas-relief).
- **Ask about diet** — if you breastfeed, or about formula, talk to your pediatrician before cutting anything; cow's-milk-protein sensitivity is worth discussing if you suspect it.
[[CTA||Log the crying spells and what soothed them in MamaBee — patterns help you and your pediatrician.]]
## The 5 S's: a soothing method worth knowing
Developed by pediatrician Dr. Harvey Karp, the "5 S's" combine techniques that mimic the womb and trigger a baby's calming reflex. They're one of the more reliable frameworks for a colicky baby, done together:
- **Swaddle** — snug wrapping to contain the flailing and calm the nervous system
- **Side or stomach position** — hold baby on their side or tummy *in your arms* to soothe (always place them on their back to actually sleep)
- **Shush** — a loud, steady white-noise "shhh" near the ear, as loud as the crying
- **Swing** — tiny, fast, jiggly motions supporting the head (never shaking)
- **Suck** — offering the breast, a clean finger or a pacifier
The trick is doing several at once and sticking with it for a few minutes before deciding it isn't working. For many colicky babies, the combination succeeds where any single technique fails.
## Looking after yourself matters too
This is not a footnote. Relentless inconsolable crying is genuinely one of the hardest things new parents face, and it can push anyone to the edge. **If you feel overwhelmed, it is okay to put your baby down safely in their crib and step away for a few minutes to breathe.** A few minutes of crying in a safe crib will not harm your baby — but a parent at breaking point is a real risk. Never, ever shake a baby. Share the load, tag in your partner, and reach out to your pediatrician or a helpline if the despair is mounting.
## Colic and feeding: what's worth trying
Because colic often looks like tummy discomfort, feeding tweaks are a common first line — worth trying, but with realistic expectations and your pediatrician's input:
- **Check the latch and flow.** A poor latch or a too-fast bottle nipple means more swallowed air. A slower-flow nipple and a good seal reduce gas. See our [gas relief guide](/mamabee/articles/newborn-gas-relief).
- **Feed more upright, and burp well.** Keeping baby upright during and after feeds, with thorough burping, helps trapped air escape.
- **Ask before cutting foods.** If you breastfeed, a small number of babies react to cow's-milk protein in the parent's diet; if you formula-feed, a different formula occasionally helps. But don't overhaul your diet or switch formula on your own — talk to your pediatrician first, since most diet changes make no difference and an unnecessary elimination diet is hard on you.
- **Paced feeding for bottles.** Holding the bottle horizontal and pausing mimics breastfeeding's rhythm and slows down a gulping, air-swallowing baby.
The honest caveat: for many colicky babies, feeding changes don't fix it, because colic isn't always about digestion. Try the low-risk tweaks, but don't blame yourself if they don't work — that's the nature of colic, not a failure on your part.
## Red flags — when it's not colic
Colic is crying in a *healthy* baby. Call your doctor promptly if the crying comes with any of these, which point to something other than colic:
- Fever, vomiting (especially green or forceful), or diarrhea
- Blood in the stool
- Poor feeding, or fewer wet diapers
- Not gaining weight, or losing weight
- Lethargy, floppiness, or a weak or high-pitched cry
- The crying suddenly changes in character or follows a fall
Trust your instinct — if something feels wrong beyond "a lot of crying," get it checked.
## Frequently asked questions
### When does colic end?
Colic usually peaks around 6 weeks and resolves on its own by 3–4 months. It is self-limiting — it ends even without treatment, though that's cold comfort in the thick of it.
### What causes colic?
No single cause is confirmed. Theories include an immature gut and trapped gas, an overwhelmed nervous system, diet sensitivities, and the gut microbiome. For most babies it's likely a mix, which is why soothing is trial and error.
### Is colic caused by something I'm doing wrong?
No. Colic affects babies across all feeding methods and parenting styles. It is not caused by "bad" parenting, anxiety, or how you hold or feed your baby.
### Does gripe water or probiotics help colic?
Evidence is mixed. Some parents find probiotic drops help, and results for gripe water vary. Talk to your pediatrician before giving any supplement to a young baby.
## The takeaway
Colic is intense, inconsolable crying in a healthy baby, defined by the rule of threes, with no confirmed cause and no single cure — but it always ends, usually by 3–4 months. Work through motion, sound, holding, swaddling and a calm environment to find what soothes your baby, watch for the red flags that mean it's something else, and protect your own wellbeing as fiercely as your baby's. You are not failing; you are getting through one of the hardest stretches of new parenthood.
[[CTA||Get MamaBee free — track the crying, feeds and what helps, so the hard evenings make more sense.]]
*This article is general information, not medical advice. Contact your pediatrician about excessive crying or any of the red-flag symptoms above.*`),

  A('baby-constipation-relief',
    'Baby Constipation: Signs, Causes, and Gentle Ways to Help',
    'Is your baby constipated? How to tell real constipation from normal newborn straining, what causes it, gentle remedies that work, and when to call the doctor.',
    ['baby constipation', 'constipated baby', 'baby constipation relief', 'infant constipation', 'baby hard stool'],
    {},
`Few things worry a new parent like a baby who seems unable to poop — the grunting, the red face, the long gaps. But here's the reassuring part: much of what looks like constipation isn't, and real constipation is usually easy to ease gently. Here's how to tell the difference, what helps, and when it's worth a call to the doctor.
## First: is it actually constipation?
This is the key question, because babies do a lot of dramatic-looking pooping that is completely normal.
**Constipation is about consistency, not frequency or effort.** The real sign is **hard, dry, pellet-like stools** that are difficult and uncomfortable to pass — not how often, and not how much grunting is involved.
Two things that are usually *normal* and get mistaken for constipation:
- **Infant dyschezia** — a baby who cries, grunts and goes red for several minutes before passing a *soft* stool. They simply haven't learned to coordinate pushing yet. Soft stool = not constipated.
- **Infrequent pooping in older/breastfed babies** — a breastfed baby can go several days, even a week, without pooping and be perfectly fine, as long as the stool is soft when it comes.
So: soft stool, however dramatic or infrequent, is generally not constipation.
## What real constipation looks like
- Hard, dry, pebble-like stools
- Stools that are clearly painful to pass; a baby who seems genuinely uncomfortable
- A firm or bloated tummy
- Less interest in feeding
- Occasionally a little bright-red blood on a hard stool (from a small tear) — mention it to your doctor
## What causes baby constipation
Timing gives the biggest clue:
- **Starting solids** — the most common trigger. New foods, especially low-fiber ones like rice cereal, and less liquid intake often firm things up. See [when to start solids](/mamabee/articles/when-to-start-solids).
- **Formula changes or preparation** — switching formula, or mixing it too concentrated, can constipate. Always measure exactly.
- **Not enough fluid** — especially in hot weather or during illness.
- **Weaning off breast milk** — stools often become firmer.
- **Rarely, a medical cause** — which is why persistent constipation should be checked.
Note: **exclusively breastfed babies are rarely truly constipated.** If yours is, mention it to your pediatrician.
## Gentle ways to help
For babies **over 6 months / on solids**, these are the gentle first steps (check with your doctor for younger babies before changing anything):
- **Bicycle legs** — gently move your baby's legs in a cycling motion to stimulate the bowel.
- **Tummy massage** — soft, clockwise circles around the belly button.
- **A warm bath** — relaxes the muscles and often gets things moving.
- **More fluids** — for babies on solids, small amounts of water with meals.
- **The "P" foods** — for babies eating solids: pureed prunes, pears, peaches, plums and apricots. Fiber-rich options over constipating ones like rice cereal and banana.
- **Less of the firming foods** — ease off rice cereal, excess banana and dairy if they seem to be the culprit.
**For young/formula-fed babies:** check your formula measurements first, and ask your pediatrician before offering water, juice or any remedy — young babies shouldn't have extra water without medical advice.
[[CTA||Track diapers and textures in MamaBee — a clear log helps you and your doctor spot real constipation fast.]]
## What not to do
- **Don't give laxatives, suppositories or enemas** without your pediatrician's guidance.
- **Don't add sugar, juice or corn syrup** to bottles as a home remedy for young babies — talk to your doctor first.
- **Don't over-dilute or over-concentrate formula** — always follow the exact ratio.
## Preventing it in the first place
Once things are moving again, a few habits keep constipation from returning, especially around the solids transition:
- **Introduce fiber-rich first foods** — offer pureed pears, prunes, peas and oatmeal rather than leaning heavily on rice cereal and banana.
- **Offer water with meals** once your baby is on solids (small amounts, from around 6 months).
- **Measure formula precisely** — never scoop heaped or add extra powder; the exact ratio matters.
- **Keep up movement** — tummy time and floor kicking help the whole system, including the bowel.
- **Watch the transitions** — starting solids and weaning off breast milk are the classic trigger points, so add fiber and fluids proactively then.
Small, consistent habits prevent far more discomfort than any single remedy fixes.
## Baby poop that looks alarming but usually isn't
Constipation worries send a lot of parents down a rabbit hole of scrutinizing diapers, so here's some reassurance about normal variation that often gets mistaken for a problem:
- **Infrequent isn't the same as constipated.** An older breastfed baby can genuinely go several days, even a week, between poops and be perfectly fine — soft stool when it comes means no constipation.
- **Grunting, straining and going red** while passing a *soft* stool is normal (infant dyschezia); babies simply haven't coordinated pushing yet.
- **Wildly changing colors** — yellow, green, brown, even orange — are usually normal, especially as diet changes. Iron supplements and some foods can darken stool.
- **First foods show up.** Undigested bits of solids (peas, corn, tomato skins) in the diaper are completely normal as the gut learns to process new textures.
The colors that *do* warrant a prompt call are the classic three: **white or chalky** (possible liver issue), **red blood** beyond a tiny streak, and **black** (after the newborn meconium stage). For the full picture, see our [baby poop color chart](/mamabee/articles/baby-poop-color-chart). Everything else is usually just the normal, dramatic variety of baby digestion.
## When to call the doctor
Contact your pediatrician if:
- Your baby is **under a few months old** and seems constipated (get young babies checked rather than treating at home)
- Constipation is persistent or keeps returning
- There's blood in the stool beyond a tiny streak, or you see it repeatedly
- The tummy is hard and swollen, or your baby is vomiting
- Your baby is refusing to feed, seems in real pain, or isn't gaining weight
- Constipation appears alongside fever or lethargy
## Frequently asked questions
### How can I tell if my baby is constipated or just straining?
Look at the stool, not the effort. Hard, dry, pellet-like stools mean constipation. Grunting and going red before passing a *soft* stool is normal (infant dyschezia) and not constipation.
### How long can a breastfed baby go without pooping?
Several days, sometimes up to a week, can be perfectly normal for an older breastfed baby — as long as the stool is soft when it arrives and your baby is comfortable and feeding well.
### What foods help relieve baby constipation?
For babies on solids, the "P" foods — prunes, pears, peaches, plums, apricots — plus more fluids. Ease off constipating foods like rice cereal, excess banana and dairy.
### When is baby constipation an emergency?
Seek prompt care for a hard swollen tummy with vomiting, repeated blood in the stool, refusal to feed, or constipation with fever or lethargy. And always get a very young baby checked rather than treating at home.
## The takeaway
Most "constipation" in babies is actually normal straining or infrequent-but-soft pooping — the real thing is about hard, dry, painful stools. It's most common when starting solids or changing formula, and usually eases with bicycle legs, tummy massage, a warm bath, more fluids and the fiber-rich "P" foods. Skip home laxatives, check formula prep, and call your doctor for young babies or persistent problems. For the bigger digestive picture, see our guides on [gas relief](/mamabee/articles/newborn-gas-relief) and [starting solids](/mamabee/articles/when-to-start-solids).
[[CTA||Get MamaBee free — log every diaper and texture so real constipation never slips past you.]]
*This article is general information, not medical advice. Always consult your pediatrician about constipation, especially in babies under a few months old.*`),

  A('baby-feeding-schedule-by-age',
    'Baby Feeding Schedule by Age: How Often and How Much, From Newborn to 12 Months',
    'A clear baby feeding schedule by age — how often and how much to feed from newborn to 12 months, when solids fit in, and why feeding on cue still beats the clock.',
    ['baby feeding schedule', 'feeding schedule by age', 'how often to feed baby', 'baby feeding chart', 'newborn feeding schedule'],
    {
      sched: {
        caption: 'A general guide. Every baby differs — follow hunger cues and your pediatrician.',
        headers: ['Age', 'Milk feeds', 'Rough amount / feed', 'Solids'],
        rows: [
          ['0–1 month', 'Every 2–3 hrs (8–12/day)', '1.5–3 oz', 'None'],
          ['1–3 months', 'Every 3–4 hrs', '3–5 oz', 'None'],
          ['4–6 months', 'Every 4 hrs', '4–6 oz', 'Maybe starting ~6 mo'],
          ['6–9 months', '4–5 feeds', '6–8 oz', 'Yes, building up'],
          ['9–12 months', '3–4 feeds', '7–8 oz', 'Yes, 3 meals + snacks'],
        ],
      },
    },
`"How often should I feed my baby?" has a frustrating answer: it depends on their age — and even then, cues beat the clock. But a rough map genuinely helps, so here's a clear feeding schedule by age from newborn to one year, plus the one rule that matters more than any timetable.
## The rule that beats every schedule
Before the numbers: **feed on cue, not on a rigid clock.** Babies are very good at regulating their own intake when you watch their hunger and fullness signals. Use the schedule below as a guide to what's typical, not a rule to force. A baby going through a [growth spurt](/mamabee/articles/baby-growth-spurts) will want more, more often — and that's exactly right.
Hunger cues: rooting, hands to mouth, lip-smacking, and fussing. Crying is a *late* cue — try to catch it earlier. Fullness cues: turning away, closing the mouth, relaxing the hands, slowing down.
## Feeding schedule by age
[[TABLE:sched]]
Amounts are a rough guide, and breastfed babies are harder to measure by the ounce — which is fine; trust cues and diaper output. For the detail on amounts, see [how much should a newborn eat](/mamabee/articles/how-much-should-a-newborn-eat).
## Newborn (0–1 month)
Frequent and around the clock: **8–12 feeds in 24 hours**, roughly every 2–3 hours, including overnight. Newborns have tiny stomachs and can't go long. Don't let a newborn sleep too long between feeds in the early weeks — wake to feed if needed until weight gain is well established, as your pediatrician advises. Expect [cluster feeding](/mamabee/articles/cluster-feeding), especially in the evenings.
## 1–3 months
Feeds gradually space out to about every 3–4 hours as the stomach grows and feeds become more efficient. Some babies start a longer stretch at night. Total daily intake matters more than perfect spacing.
## 4–6 months
Feeds settle to roughly every 4 hours. This is when solids *may* begin — but only around 6 months and only with [readiness signs](/mamabee/articles/when-to-start-solids). Milk (breast or formula) is still the main nutrition; early solids are for practice, not calories.
## 6–9 months
Solids ramp up, but **milk remains the primary source of nutrition through the first year** — offer milk before solids. Build from one solid "meal" toward two or three, exploring textures and [allergens](/mamabee/articles/introducing-allergens-to-baby).
## 9–12 months
Three solid meals plus snacks, with 3–4 milk feeds around them. Your baby is shifting toward table foods and more independent eating. Milk feeds naturally reduce as solids provide more.
[[CTA||Track every feed — breast, bottle and solids — in MamaBee, and watch the schedule find its own rhythm.]]
## What a day roughly looks like, by stage
Schedules aren't clocks, but a shape helps. Loose examples:
- **Newborn:** a round-the-clock cycle of feed, short awake time, sleep — repeating every 2–3 hours day and night, with evening cluster feeds.
- **3–4 months:** feeds on waking, roughly every 3–4 hours, naps between, and often one longer stretch at night.
- **6 months:** milk feeds on waking and before naps, with one small solid "meal" slotted into the day for practice — milk still leads.
- **9–12 months:** three solid meals landing near family breakfast, lunch and dinner, milk feeds bookending the day and around naps, snacks between.
The pattern to notice: feeds anchor to wake-ups early on, then gradually reorganize around meals and naps as your baby grows into a day-shaped rhythm.
## A note on breast vs bottle amounts
The ounce figures above apply most cleanly to bottle-fed babies. If you're breastfeeding, you can't measure intake directly — and you don't need to. Feed on cue, let your baby end the feed, and judge sufficiency by diapers and weight gain rather than volume. If you're [combination feeding](/mamabee/articles/breastfeeding-vs-formula), a bottle lets you see amounts on those feeds while breastfeeds stay cue-led. Either way, the body-based signs below matter more than any number.
## Night feeds by age: what's normal
Night feeds are the part of the schedule parents most want to understand, so here's the rough shape. **Newborns** need to feed overnight, usually every 2–4 hours — this is non-negotiable early on and not something to push against. Through **1–3 months**, many babies begin stretching one longer gap at night as their stomach grows. Around **4–6 months**, some babies can go most or all of the night without a feed, but plenty still genuinely need one or two, and that's normal. By **6–12 months**, as solids provide more daytime calories, night feeds often reduce naturally. The key principle: let daytime intake do the heavy lifting so nights can shorten on their own, and don't actively drop night feeds until your baby is old enough, gaining well, and — ideally — your pediatrician agrees. Some babies simply need a night feed longer than others, and following that need isn't "spoiling" them. For how to gently phase them out when the time comes, see [how to get baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night).
## Cluster feeds and growth spurts break the schedule (normally)
Expect your neat schedule to fall apart periodically — and that's fine. During a [growth spurt](/mamabee/articles/baby-growth-spurts), your baby may suddenly want to feed far more often for a couple of days as they signal your supply (or appetite) to increase. Evenings often bring [cluster feeding](/mamabee/articles/cluster-feeding), where feeds bunch close together for a few hours. Neither means your schedule is broken or your supply is failing — they're your baby doing exactly what they should. Ride them out by feeding on cue, and the rhythm re-settles within a few days. A tracker helps here: when you can see "oh, this is day two of feeding every hour," a growth spurt feels like a phase rather than an alarm.
## Signs your baby is getting enough
Forget the exact ounces and watch these instead:
- **Diapers:** roughly 6+ wet diapers a day once feeding is established
- **Weight:** steady gain along their growth curve (your pediatrician tracks this)
- **Demeanor:** content and satisfied after feeds, alert when awake
- **Growth:** hitting length and head-circumference milestones
If those look good, your baby is eating enough — whatever the clock says.
## Frequently asked questions
### How often should a newborn eat?
Every 2–3 hours, about 8–12 times in 24 hours, including overnight. Newborns have tiny stomachs and feed frequently. Follow hunger cues and don't let early-weeks newborns go too long between feeds.
### When do babies drop night feeds?
It varies widely. Many need night feeds through the early months; some drop them around 4–6 months once they're taking enough during the day and gaining well. Check with your pediatrician before actively dropping them.
### Does starting solids replace milk feeds?
Not at first. Through the first year, milk stays the main source of nutrition — solids are added alongside, not instead. Offer milk before solids in the early months of eating.
### Should I feed on a schedule or on demand?
On cue is best for babies — watch hunger and fullness signals rather than forcing a rigid clock. A schedule is a helpful guide to what's typical, not a rule.
## The takeaway
Feeds start frequent (every 2–3 hours for newborns) and gradually space out as your baby grows, with solids joining around 6 months but milk staying primary through the first year. Use the age chart as a map, but let your baby's hunger and fullness cues — and their diapers and growth — be the real guide. That's how babies eat exactly what they need. For amounts, see [how much should a newborn eat](/mamabee/articles/how-much-should-a-newborn-eat), and when solids arrive, [when to start solids](/mamabee/articles/when-to-start-solids) and [introducing allergens](/mamabee/articles/introducing-allergens-to-baby). One last reassurance: almost every parent worries their baby is eating too little or too much at some point. If the diapers are wet, the weight is tracking, and your baby is content, the schedule is working — even on the days it feels chaotic.
[[CTA||Get MamaBee free — log feeds in one tap and let your baby's real schedule reveal itself.]]
*This article is general information, not medical advice. Talk to your pediatrician about your baby's feeding and weight gain.*`),

  A('introducing-a-bottle-to-breastfed-baby',
    'How to Introduce a Bottle to a Breastfed Baby (Without the Battle)',
    'How to introduce a bottle to a breastfed baby: the best time to start, how to avoid refusal, tips for paced bottle feeding, and what to do if your baby says no.',
    ['introducing bottle to breastfed baby', 'bottle feeding breastfed baby', 'baby refuses bottle', 'paced bottle feeding', 'combination feeding bottle'],
    {},
`Whether you're heading back to work, want your partner to share feeds, or just crave a night where someone else does the 2 AM shift, introducing a bottle to a breastfed baby is a common goal — and sometimes a surprisingly stubborn one. Here's how to do it smoothly, when to start, and what to do if your baby flatly refuses.
## When to introduce a bottle
Timing is the trick, and there's a window.
**The sweet spot is around 3–4 weeks old** — once breastfeeding is well established (a good latch, steady weight gain), but before your baby becomes too set in their ways. Introduce it too early and you risk nipple confusion while breastfeeding is still finding its feet; introduce it too late (past ~2 months) and many babies dig in and refuse.
If you've missed that window, don't panic — plenty of older babies take a bottle. It just may take more patience.
## How to introduce it (step by step)
- **Pick a calm, happy moment.** Try when your baby is relaxed and *mildly* hungry — not starving and screaming. A hungry, frustrated baby wants the familiar, not an experiment.
- **Have someone else offer it.** Babies smell their breastfeeding parent and hold out for the real thing. Have your partner or a caregiver give the first bottles, ideally with you out of the room.
- **Warm the milk to body temperature.** Breast milk comes warm; a cold bottle is an easy "no." Match the temperature.
- **Use a slow-flow nipple.** A slow-flow teat mimics the breast and prevents your baby being overwhelmed (or preferring the fast, effortless flow of a bottle).
- **Let baby draw the nipple in.** Touch it to their lips and let them accept it rather than forcing it in — like a good latch.
- **Try paced bottle feeding.** Hold the bottle horizontal, baby fairly upright, and take breaks — this mimics breastfeeding's rhythm, prevents overfeeding, and makes it easier to move between breast and bottle. It's the single most useful technique here.
## If your baby refuses the bottle
Refusal is common and rarely permanent. Work through these:
- **Change who offers it** — sometimes even grandma succeeds where a parent can't.
- **Try different nipple shapes** — some babies are picky; a different teat can flip a "no" to a "yes."
- **Experiment with timing** — drowsy feeds (half-asleep, less opinionated) work for some babies; others do better fully awake and playful.
- **Try different positions** — facing out, in motion, or a spot different from your usual nursing position.
- **Offer, don't force** — end on a calm note. Pushing a distressed baby builds a negative association. Try again next time.
- **Keep milk flowing** — a drop of milk on the nipple tip, or starting at the breast then switching, can bridge the gap.
- **Be patient** — it can take many tries over days. Persistence usually wins.
[[CTA||Track who fed, when, and how much — bottle or breast — in MamaBee, so combo feeding stays simple.]]
## Protecting your milk supply
If you're introducing bottles while wanting to keep breastfeeding, remember supply responds to demand. If a bottle *replaces* a nursing session, consider pumping around that time to protect supply, especially early on. Introduce bottles gradually rather than all at once. A lactation consultant is worth their fee if you're navigating a return to work — see our honest guide to [breastfeeding vs formula and combo feeding](/mamabee/articles/breastfeeding-vs-formula).
## The gear, kept simple
You don't need a cupboard of bottles. Start small and let your baby tell you what works:
- **Buy one or two bottles first, not a set.** Babies are opinionated about nipples; don't stock up until you know what yours accepts.
- **Start with slow-flow ("newborn" or "level 1") nipples.** They mimic the breast's effort and prevent a baby preferring the easy, fast flow of a bottle — a common cause of later breast refusal.
- **Wide-based nipples** encourage a wide, breast-like latch and suit many breastfed babies.
- **Don't chase "anti-colic" claims.** Any decent bottle vented properly and used with paced feeding reduces swallowed air; the fancy systems aren't essential.
- **Have a couple on hand** once one works, so you're never caught without a clean bottle at 2 AM.
If your baby rejects the first nipple, that's information, not failure — try a different shape before assuming they won't take a bottle at all.
## What to put in the bottle — and how much
Expressed breast milk, formula, or a combination — all are fine. Many parents start with expressed breast milk so the taste is familiar, then introduce formula later if needed. There's no wrong answer; a fed baby is the goal.
**How much to offer:** breastfed babies typically take smaller, steadier amounts than formula-fed babies — often around 2–4 ounces per bottle in the early months, rather than the larger volumes formula-fed babies sometimes take. Start on the smaller side and let your baby's fullness cues, not the ounce line, decide when they're done. Paced feeding helps here: it stops a fast bottle from overriding those cues and overfeeding.
**Handling expressed milk safely** matters too, since breast milk isn't formula:
- Fresh expressed milk keeps at room temperature for a few hours, in the fridge for around four days, and in the freezer for months — follow current storage guidelines.
- **Thaw in the fridge or under warm running water, never in the microwave** — microwaving creates dangerous hot spots and damages the milk's protective components.
- **Swirl, don't shake**, to mix separated layers gently.
- **Don't re-freeze** thawed milk, and use leftovers from a started bottle within a couple of hours.
Getting the storage right means all that pumping effort actually makes it into your baby.
## What if I only need occasional bottles?
Not everyone is returning to full-time work — plenty of parents just want the *option* of a bottle for a date night or a longer stretch of sleep. If that's you, the same early-introduction window still applies: offer a bottle regularly (even once every few days) from around 3–4 weeks so your baby stays willing to take one. A baby who never sees a bottle for two months often refuses it exactly when you finally need one. A little maintenance now keeps the option open later.
## Frequently asked questions
### When should I introduce a bottle to a breastfed baby?
Around 3–4 weeks is the common sweet spot — after breastfeeding is well established but before your baby becomes too set to accept a bottle. Introducing much later can lead to more refusal.
### Why does my breastfed baby refuse the bottle?
Often because they smell you and want the breast, dislike the nipple shape or milk temperature, or aren't hungry enough to experiment. Try having someone else offer a body-temperature bottle with a slow-flow teat when baby is calm.
### What is paced bottle feeding?
Holding the bottle horizontal with baby upright and pausing regularly, so the flow mimics breastfeeding. It prevents overfeeding and makes switching between breast and bottle easier — the most useful technique for breastfed babies.
### Will a bottle ruin breastfeeding?
Not if breastfeeding is established first and you protect your supply (pump around replaced feeds early on). Many families successfully combine breast and bottle for months.
## The takeaway
Introduce a bottle around 3–4 weeks once breastfeeding is established, have someone else offer body-temperature milk in a slow-flow teat when your baby is calm, and use paced bottle feeding to keep things gentle. If your baby refuses, change who offers it, the nipple, the timing and the position — and stay patient, because persistence almost always wins. Protect your supply if you're keeping up breastfeeding, and remember any milk in the bottle is the right milk.
[[CTA||Get MamaBee free — track breast and bottle feeds together so sharing the load is effortless.]]
*This article is general information, not medical advice. A lactation consultant or your pediatrician can help with feeding or supply concerns.*`),

  A('the-wonder-weeks-leaps',
    'The Wonder Weeks: What Baby Leaps Are and Whether the Science Holds Up',
    'The Wonder Weeks explained — what the "leaps" are, the signs of a developmental leap, how to support your baby through one, and an honest look at what the science does and does not say.',
    ['wonder weeks', 'baby leaps', 'developmental leap', 'wonder weeks leaps', 'baby mental leap'],
    {},
`If you've been handed the phrase "it's just a leap" by another parent, you've met The Wonder Weeks — the wildly popular idea that babies go through predictable "mental leaps" that turn them fussy, clingy and sleepless right before a burst of new skills. It's comforting and often feels accurate. It's also more controversial, scientifically, than most parents realize. Here's an honest look at both.
## What The Wonder Weeks claims
The Wonder Weeks, based on a book by Dutch researchers, proposes that all babies go through **ten predictable "leaps"** in mental development during roughly the first 20 months, timed from the due date. Each leap, the theory goes, is a jump in perception and understanding that briefly overwhelms the baby — producing fussy, difficult stretches — before unlocking new abilities.
The framework is famous for the **"3 C's"** that signal a leap: **crying, clinginess and crankiness.** Parents often report these arrive right before their baby masters something new.
## The signs of a "leap"
Whatever you make of the theory, the described pattern is one most parents recognize:
- More crying and fussiness than usual, for no obvious reason
- Extra clinginess — wanting to be held constantly, upset when you leave
- Disrupted sleep and shorter naps
- Changes in appetite
- Wanting more comfort and closeness
- ...followed by a new skill: a new sound, a grasp, a roll, a giggle, a realization
## Why leaps and fussiness are real (even if the schedule isn't)
Here's the honest scientific picture, so you can hold the idea lightly:
**What's real:** babies genuinely develop in bursts rather than smoothly, and periods of developmental change are often accompanied by disrupted sleep and mood. Any parent watching a baby "bank" a new skill after a rough week has seen this.
**What's shakier:** the claim that the leaps happen on a *universal, predictable schedule* timed to the due date has **not held up well in independent research.** A study attempting to replicate the fixed timing of the leaps did not find strong support for it. Babies develop on their own varied timelines, not a synchronized calendar.
So the useful takeaway: **the "fussy before a burst of development" pattern is real and reassuring; the precise week-by-week schedule is best treated as a loose guide, not a law.** Don't panic if your baby's leaps don't line up with the app's calendar — that's expected.
## How to support your baby through a leap
Whether you call it a leap, a regression or just a rough week, the support is the same:
- **Offer extra comfort.** Clinginess is a need, not manipulation. More holding, more closeness — you can't spoil a baby with responsiveness.
- **Keep routines steady.** Predictability is an anchor when your baby feels wobbly.
- **Protect sleep.** Fussy phases disrupt sleep; lean on your [wake windows](/mamabee/articles/wake-windows-by-age) and [bedtime routine](/mamabee/articles/baby-bedtime-routine) to limit overtiredness.
- **Give chances to practice** the emerging skill during the day.
- **Lower your own bar.** A leap week is survival mode. Fewer plans, more grace.
- **Remember it passes** — usually within days to a couple of weeks.
[[CTA||Track the fussy days and the new skills in MamaBee — and see your baby's real developmental rhythm.]]
## The ten leaps at a glance
For reference, the leaps are timed from your baby's *due date* (not birth date), which matters for premature babies. The commonly cited windows fall around: **weeks 5, 8, 12, 19, 26, 37, 46, 55, 64 and 75.** Roughly, the early leaps center on the senses and patterns (noticing the world, smooth changes, events), the middle ones on relationships and categories (distance, sequences, how things fit together), and the later ones on systems and independence (making choices, understanding "principles," navigating rules). You'll notice the gaps widen with age — leaps cluster in the busy first year and space out into toddlerhood. Treat these as approximate signposts, not appointments: a baby who gets fussy two weeks off the listed week is completely normal, and a premature baby's leaps track to the adjusted age.
## Leaps vs. sleep regressions: are they the same thing?
Parents often wonder how "leaps" relate to "[sleep regressions](/mamabee/articles/baby-sleep-regressions-by-age)" — because they describe overlapping rough patches. The honest answer: they're two lenses on the same underlying reality. Both point at the fact that development happens in bursts, and those bursts tend to disrupt sleep and mood. The Wonder Weeks frames it around *mental* leaps in perception; the sleep-regression framing focuses on the sleep disruption itself, often tied to physical milestones like rolling or crawling. Don't get tangled trying to decide which one your baby is "in" — the support is identical either way: more comfort, steady routines, protected sleep, and patience. Whether you call this week a leap, a regression or just a hard stretch changes nothing about what your baby needs from you.
## Is the app worth using?
Many parents love The Wonder Weeks app simply because it reframes hard weeks as *progress* rather than something wrong — and that reframe is genuinely valuable for morale. Just use the calendar as a rough guide, not a prophecy. If it makes a fussy Tuesday feel meaningful instead of alarming, it's doing its job. If your baby is "off schedule," that's normal, not a problem.
The one trap to avoid is letting the app create anxiety rather than relieve it — refreshing it to see if a "storm" is coming, or worrying because your baby's fussiness doesn't match the predicted week. If you notice that happening, that's your sign to close the app and just respond to the baby in front of you. The framework is a comfort tool, not a diagnostic one; the moment it starts generating worry instead of dissolving it, it has stopped being useful for you. Trust what you see in your own child over what any calendar predicts.
## Frequently asked questions
### Are The Wonder Weeks scientifically proven?
Partly. That babies develop in bursts with accompanying fussiness is well supported. The specific claim of ten leaps on a universal, due-date-timed schedule has not been reliably replicated in independent research — treat the timing as a loose guide.
### What are the 3 C's of a leap?
Crying, clinginess and crankiness — the fussy signs said to precede a developmental leap. Most parents recognize this pattern even if the exact timing varies.
### How long does a leap last?
Typically a few days to a couple of weeks, ending as the new skill settles in. If a "leap" drags on for many weeks, look for other causes like teething, illness or hunger.
### Should I follow the Wonder Weeks calendar exactly?
No — use it as a rough guide. Babies develop on their own timelines, so don't worry if your baby's fussy phases and skills don't match the predicted weeks.
## The takeaway
The Wonder Weeks captures something real — babies do get fussy, clingy and sleepless around bursts of development — which makes it genuinely reassuring. But the precise leap-by-leap schedule doesn't hold up as a universal law, so hold the calendar loosely. Support your baby the same way through any rough patch: more comfort, steady routines, protected sleep, and grace for yourself. The hard week almost always ends in a new trick. For the sleep side of leaps, see our [sleep regressions by age guide](/mamabee/articles/baby-sleep-regressions-by-age) and [baby milestones month by month](/mamabee/articles/baby-milestones-by-month). Whatever you call these weeks, the kindest thing you can do is stop measuring your baby against a chart and simply meet the baby in front of you — fussy today, brilliant next week, exactly on their own schedule.
[[CTA||Get MamaBee free — track leaps, fussy days and milestones, and see your baby's own rhythm emerge.]]
*This article is general information, not medical advice. Talk to your pediatrician about your baby's development if you have concerns.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs Studio', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const t = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words${t?`, ${t} tbl`:''})`)
}
console.log('\nDone — 10 MamaBee DRAFTS. Nothing live.')
