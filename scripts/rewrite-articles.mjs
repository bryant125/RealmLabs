// Rewrites article drafts to the 1000+ word SEO standard. PATCHES existing
// drafts (keeps coverImage + slug). Run: SANITY_WRITE_TOKEN=xxx node scripts/rewrite-articles.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'

const client = createClient({
  projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const k = () => randomUUID().slice(0, 8)
function inline(text) {
  const children = [], markDefs = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0, m
  const push = (t, marks = []) => { if (t) children.push({_type: 'span', _key: k(), text: t, marks}) }
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index))
    if (m[1] !== undefined) push(m[1], ['strong'])
    else { const key = 'l' + markDefs.length
      if (m[3] === 'APP') markDefs.push({_key: key, _type: 'appLink'})
      else markDefs.push({_key: key, _type: 'link', href: m[3]})
      push(m[2], [key]) }
    last = m.index + m[0].length
  }
  push(text.slice(last)); return {children, markDefs}
}
const block = (style, text, extra = {}) => { const {children, markDefs} = inline(text); return {_type: 'block', _key: k(), style, markDefs, children, ...extra} }
function md(src) {
  const out = []
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('## ')) out.push(block('h2', line.slice(3)))
    else if (line.startsWith('### ')) out.push(block('h3', line.slice(4)))
    else if (line.startsWith('> ')) out.push(block('blockquote', line.slice(2)))
    else if (line.startsWith('- ')) out.push(block('normal', line.slice(2), {listItem: 'bullet', level: 1}))
    else if (line.startsWith('[[CTA')) { const [, , heading] = line.slice(2, -2).split('|'); out.push({_type: 'appCta', _key: k(), ...(heading ? {heading} : {})}) }
    else out.push(block('normal', line))
  }
  return out
}

const updates = [
  {
    slug: 'newborn-sleep-schedule',
    title: 'Newborn Sleep Schedule: The 3 AM Survival Guide That Actually Works (0–12 Weeks)',
    description: 'A real newborn sleep schedule for weeks 0–12: wake windows by age, a sample day, safe-sleep basics, and the 3 AM tracking trick that finally lifts the fog. From tired parents, for tired parents.',
    tags: ['newborn sleep schedule', 'wake windows', 'baby sleep', 'newborn', 'sleep tracker'],
    body: `It's 3 AM. You're swaying in the dark with a baby who was *just* asleep two minutes ago, doing quiet math about whether you'll ever sleep for more than ninety minutes again. I remember typing "newborn sleep schedule" into my phone with one thumb, praying for a magic timetable I could tape to the fridge.
Here's the honest truth I wish someone had told me: the magic timetable doesn't exist — but something better does, and the night it finally clicked, everything got easier.
This is the guide I needed back then. You'll get a realistic **newborn sleep schedule** from birth to 12 weeks, why **wake windows** beat the clock, a sample day you can actually follow, the safe-sleep basics you should never skip, and how to stop guessing at 3 AM. No rigid rules. No guilt. Just what works.
## How much do newborns actually sleep?
Newborns sleep a lot — usually **14 to 17 hours a day** — but almost never in the long, tidy stretches you're dreaming of. In the first weeks that sleep comes in short bursts of 30 minutes to 3 hours, scattered around the clock, because your baby hasn't developed a circadian rhythm yet. Their tiny stomach also needs refilling every couple of hours.
So if you're wondering why your newborn "won't follow a schedule," the answer is simple: **at this age, they biologically can't.** And that's completely normal.
## Why a strict clock-based schedule doesn't work yet
Most newborn "schedules" you'll find online assign nap times to specific clock hours. For a brand-new baby, that sets you up to fail — because your baby doesn't care what the clock says. Push them to stay awake for a set block and you'll get an overtired, screaming baby who fights every nap.
The fix is to flip your thinking. Instead of watching the clock, watch **two things**: your baby's wake windows and their sleepy cues.
## Newborn wake windows by age (the real cheat sheet)
A **wake window** is simply how long your baby can comfortably stay awake — including the feed — before they need to sleep again. Get the window right and sleep comes easily. Miss it and everyone pays.
- **0–4 weeks:** 35–60 minutes
- **5–8 weeks:** 45–90 minutes
- **9–12 weeks:** 60–120 minutes
Watch for **sleepy cues** near the end of the window: yawning, red or raised eyebrows, a glazed thousand-yard stare, clenched fists, or sudden fussiness. Those cues mean "put me down soon." Crying is the *late* signal — by then you've usually missed the window.
## A sample newborn daily rhythm (flexible, not fixed)
Forget hourly timetables. A newborn day is really the same simple loop repeated all day and night:
- **Feed** your baby fully.
- **A little awake time** — a diaper change, some gentle play, a cuddle.
- **Sleep** as soon as you spot sleepy cues.
- **Repeat**, day and night, following wake windows.
That loop — not a clock — is your "schedule." Some loops last 90 minutes, some last three hours. Both are fine.
## The eat–play–sleep rhythm (and why it helps)
Within each loop, try the order **eat, then play, then sleep**. Feeding at the *start* of the window (rather than right before sleep) gently loosens the "I can only fall asleep while feeding" association, which your future self will thank you for. It's not a rule — some evening cluster feeds will blow it up completely, and that's okay — but as a default rhythm it works beautifully.
## Day–night confusion: how to gently fix it
Lots of newborns have their days and nights flipped — wide awake at 2 AM, dead asleep at 2 PM. You can nudge their body clock:
- **Make days bright and social.** Open the curtains, talk, feed near a window.
- **Make nights boring.** Dim lights, quiet voice, minimal eye contact, straight back to sleep after feeds.
- **Feed well during the day** so more calories land in daylight hours.
It usually sorts itself out within a few weeks with gentle consistency.
## Drowsy but awake: the small skill that pays off big
Once in a while, try laying your baby down **drowsy but still awake** rather than fully asleep. This isn't sleep training a newborn — it's just giving them tiny, low-pressure reps at settling themselves. Some nights it works, many nights it won't, and both are completely normal this young. Every little rep helps down the road.
## Safe sleep basics (never skip these)
However your nights go, safe sleep is non-negotiable. Remember the **ABCs**:
- **A — Alone:** baby sleeps on their own surface, no bed-sharing.
- **B — Back:** always place baby on their back to sleep.
- **C — Crib:** a firm, flat crib or bassinet with a fitted sheet — no pillows, bumpers, blankets, or stuffed toys.
Keep the room a comfortable temperature and skip the hats indoors. These simple rules dramatically lower the risk of SIDS.
## How to actually track it all (without losing your mind)
Here's the part nobody warns you about: at 3 AM, running on no sleep, you genuinely cannot remember when your baby last ate, how long they've been awake, or which side you fed on. That mental load is exhausting — and it's exactly what makes "just follow the wake windows" feel impossible.
That's the whole reason we built **MamaBee**. Log every feed, nap, and diaper with **one thumb** — no typing, no notebook, works in the dark. MamaBee then does the math you can't: it shows how long your baby's been awake, predicts the next likely nap from their wake windows, and quietly surfaces patterns you'd never spot in the fog (like sleeping longer after a bath). It's the calm, AI-powered **newborn sleep tracker** that turns "I have no idea" into "oh, that's why."
[[CTA||Track feeds and naps in one thumb — and let MamaBee predict the next nap for you.]]
## When does newborn sleep finally get easier?
Somewhere around **8 to 12 weeks**, many babies start offering one longer stretch at night — the first real light at the end of the tunnel. Around **3 to 4 months**, sleep matures into more adult-like cycles (which can bring the famous [4-month sleep regression](/mamabee/articles/4-month-sleep-regression), so read up before it hits). For a deeper dive on nap timing as your baby grows, see our full [wake windows by age guide](/mamabee/articles/wake-windows-by-age).
## Frequently asked questions
### How many hours should a newborn sleep in 24 hours?
Most newborns sleep about **14–17 hours per day**, spread across many short stretches. Anywhere in that range, with normal feeding and enough wet diapers, is typically healthy.
### Should I wake my newborn to feed?
In the early weeks, yes — many pediatricians recommend not letting a newborn go longer than about **3–4 hours** between daytime feeds until they're back to birth weight and gaining well. Check with your pediatrician for your baby.
### Why does my newborn only sleep when held?
It's incredibly common — your baby spent nine months in constant warmth and motion, so a flat, still crib feels foreign. Full feeds, a snug (safe) swaddle, and consistent wind-down cues help them accept the crib over time.
### Is it okay for a newborn to sleep all day?
Short term, newborns do sleep most of the day. But if your baby is *consistently* too sleepy to feed well or is hard to wake for feeds, call your pediatrician — that's worth checking.
## The takeaway
There's no perfect newborn sleep schedule — there's only a **rhythm that fits your baby this week**. Follow the wake windows, lean on eat–play–sleep, keep sleep safe, and track it lightly so you're not carrying it all in your exhausted head. It gets easier. You're doing better than you feel.
[[CTA||Ready for calmer nights? Get MamaBee free and stop guessing at 3 AM.]]
*This article is for general information and isn't medical advice. Always talk to your pediatrician about your baby's sleep and health.*`,
  },
  {
    slug: 'how-much-should-a-newborn-eat',
    title: 'How Much Should a Newborn Eat? The Real Feeding Guide (By Week + Hunger Cues)',
    description: 'How much a newborn eats by week — breast and bottle — the hunger cues to catch early, and the simple diaper rule that proves your baby is getting enough, without obsessing over ounces.',
    tags: ['how much should a newborn eat', 'newborn feeding', 'breastfeeding', 'formula feeding', 'baby feeding'],
    body: `"Is she getting enough?" I must have whispered that question a thousand times in the first month, usually at 2 AM, staring at a baby who'd just eaten and somehow still seemed hungry. If you're anxiously Googling **how much a newborn should eat**, take a breath — you're already a great parent for caring this much.
Here's the honest, practical guide I wish I'd had: real feeding amounts by week for both breast and bottle, the hunger cues to catch *before* the crying starts, how often to feed, and the one simple sign that proves your baby's getting plenty.
## How much should a newborn eat, by age?
Newborn stomachs are tiny and grow fast. Rough amounts **per feed**:
- **Day 1:** 5–7 ml (about a teaspoon) — stomach the size of a marble
- **Days 2–3:** 14–27 ml (½–1 oz)
- **Week 1:** 1–2 oz, every 2–3 hours
- **Weeks 2–4:** 2–3 oz
- **1–2 months:** 3–4 oz
These are averages, not targets to force. Some feeds are bigger, some smaller — your baby will regulate.
## Breastfeeding: how do you know how much they got?
This is the hard part with nursing — you can't see the ounces. So instead of measuring milk, you measure **signs**:
- **8–12 feeds** in 24 hours in the early weeks
- Baby seems **content and relaxed** after most feeds
- You hear **swallowing** during feeds
- Steady **weight gain** and enough diapers (more on that below)
If nursing hurts or you're worried about supply, a lactation consultant is worth their weight in gold.
## Bottle and formula feeding: amounts by weight
A common formula guideline is about **2 to 2.5 ounces of formula per pound of body weight per day**, up to roughly 32 oz/day max. So an 8-pound baby might take around 16–20 oz across the whole day.
Golden rule: **never force a baby to finish a bottle.** Watch for "I'm done" cues — turning away, slowing down, relaxing their hands.
## Hunger cues to catch before the crying
Crying is a *late* hunger sign. Catch these early ones and feeds go far more smoothly:
- Rooting (turning head, opening mouth)
- Hands to mouth, sucking on fists
- Lip smacking or sticking out the tongue
- Stirring and fussing
[[CTA||Log every feed with one thumb and see your baby's daily total add up — no notebook, no 3 AM math.]]
## How often should a newborn eat?
Most newborns feed **every 2–3 hours**, or 8–12 times a day. Evenings often bring [cluster feeding](/mamabee/articles/cluster-feeding) — lots of short feeds bunched together — which is completely normal and not a sign of low supply.
## The diaper rule: real proof they're fed
Here's the reassuring part: you don't need to count ounces to know your baby's eating enough. Their **diapers** tell the story:
- **6 or more wet diapers** a day after day 5
- Regular **dirty diapers** (see our [baby poop color chart](/mamabee/articles/baby-poop-color-chart))
- Back to **birth weight** by about 2 weeks, then steady gain
Enough output plus weight gain equals enough intake. That's the whole test.
## Should you wake a newborn to feed?
In the early weeks, often yes. Many pediatricians advise not letting a newborn sleep longer than **3–4 hours** between daytime feeds until they're back to birth weight and gaining well. After that, if your baby is thriving, you can usually let them sleep longer at night (lucky you).
## When to call your pediatrician
Check in if your baby: has fewer than 6 wet diapers a day, is very hard to wake for feeds, isn't gaining weight, or seems persistently unsatisfied after full feeds. Trust your gut — that's what pediatricians are for.
## Frequently asked questions
### How many ounces should a newborn eat per feeding?
In the first weeks, about **1–3 ounces per feed**, increasing to 3–4 oz by 1–2 months. Follow hunger and fullness cues rather than a fixed number.
### How long can a newborn go between feeds at night?
Once back to birth weight and gaining well, many newborns can stretch **4–5 hours** at night. Before that, wake them at 3–4 hours. Ask your pediatrician about your baby.
### Why does my newborn still seem hungry after feeding?
Often it's cluster feeding, a growth spurt, or comfort sucking — not true hunger. If diapers and weight gain are on track, they're likely getting enough.
## The takeaway
Feeding a newborn isn't about hitting a magic number of ounces — it's about **following cues and watching the diapers**. Feed on demand, catch the early hunger signs, and track it lightly so you're not guessing. You're doing better than you think.
[[CTA||Track feeds, diapers, and weight in one calm app — get MamaBee free.]]
*This article is general information, not medical advice. Talk to your pediatrician or a lactation consultant about your baby's feeding.*`,
  },
  {
    slug: 'baby-poop-color-chart',
    title: "Baby Poop Color Chart: What's Normal, What's Not, and When to Call the Doctor",
    description: 'A clear baby poop color chart for new parents: which colors are perfectly normal, the three that mean call your pediatrician, and why one weird diaper usually is not the whole story.',
    tags: ['baby poop color chart', 'newborn diapers', 'baby health', 'meconium', 'infant poop'],
    body: `Nobody warns you that a huge part of new parenthood is peering into a diaper like a fortune teller reading tea leaves. The first time I saw a bright green diaper, I nearly called the emergency line. (It was completely fine. It almost always is.)
So let's demystify it. Here's a plain-English **baby poop color chart**: what each color means, which ones are normal, the three that actually warrant a call, and how to stop second-guessing every diaper.
## Why baby poop changes color so much
A newborn's digestive system is brand new and constantly adjusting — to milk, to formula, to growth. That means the color and texture of their poop will shift a lot in the first weeks, and most of that rainbow is completely healthy.
## The baby poop color chart (normal shades)
- **Black and tarry (days 1–3):** This is **meconium** — the sticky first poop. Totally expected.
- **Green-brown transitional (days 3–5):** As milk kicks in, poop shifts. Normal.
- **Mustard yellow, soft, seedy:** The classic **breastfed baby poop**. Perfectly healthy.
- **Tan to peanut-butter brown:** Typical **formula-fed poop** — a bit firmer and stronger-smelling.
- **Green:** Usually fine. Can happen with a foremilk/hindmilk imbalance, a cold, teething later on, or just because. Green alone is rarely a worry.
[[CTA||Log every diaper with a tap so you can spot real changes over days — instead of trying to remember yesterday's.]]
## The three colors that mean call your pediatrician
Out of the whole rainbow, only three colors are genuine red flags:
- **Red** — could be blood (though beets or red food later on can mimic it). Call.
- **White, chalky, or pale grey** — can signal a liver or bile problem. Call promptly.
- **Black after the first week** — meconium is done by then, so black later can mean digested blood. Call.
If you see any of these, don't panic — but do phone your pediatrician. Everything outside this list is almost always normal variation.
## What about texture and frequency?
Color is only part of the picture. Also normal:
- **Breastfed:** loose, runny, even explosive — and anywhere from after every feed to once every few days once they're a bit older.
- **Formula-fed:** thicker, paste-like, usually more regular.
- **Newborn frequency:** often several a day early on. A dip in frequency (without hard, dry stools) can be normal as they mature.
Watch for **true constipation** — hard, dry, pebble-like stools with straining — or **watery diarrhea** that won't stop, which can risk dehydration. Both are worth a call.
## Why tracking beats memory
Here's the real secret: your pediatrician rarely cares about one odd diaper. What matters is the **pattern over time** — a sudden change from your baby's normal. And at 3 AM on no sleep, you will not remember what "normal" looked like three days ago.
That's exactly why logging diapers matters. A quick tap per change builds a picture, so if something shifts, you'll actually notice — and you'll have real info to share with your doctor instead of a foggy guess.
## Frequently asked questions
### Is green baby poop a problem?
Usually not. Green poop is common and typically harmless — often from milk imbalance or a minor bug. Call only if it comes with other symptoms like fever, blood, or poor feeding.
### What does healthy breastfed baby poop look like?
Soft, runny, mustard-yellow, often with little "seeds." It can be frequent and messy — all completely normal.
### When should I worry about my baby's poop?
Call your pediatrician for **red, white/pale, or black (after week one)** stools, watery diarrhea that won't stop, hard pebble-like stools, or any diaper change paired with fever or a distressed baby.
## The takeaway
Most of the diaper rainbow is completely normal — yellow, green, brown, and everything between. Memorize the **three call-the-doctor colors** (red, white, black-after-week-one), track the rest so you can spot real changes, and otherwise breathe easy. You've got this.
[[CTA||Keep an easy diaper log and catch changes early — get MamaBee free.]]
*This article is general information, not medical advice. When in doubt about your baby's health, call your pediatrician.*`,
  },
  {
    slug: '4-month-sleep-regression',
    title: 'The 4-Month Sleep Regression: Why It Happens and What Actually Helped Us',
    description: 'The 4-month sleep regression explained by a parent who survived it: why it happens, how long it lasts, whether it ever ends, and the three gentle things that actually helped.',
    tags: ['4 month sleep regression', 'baby sleep regression', 'infant sleep', 'sleep', 'baby milestones'],
    body: `For a few glorious weeks, my baby slept. Real stretches. I started to feel like a person again. Then — right on cue around four months — she was suddenly up every single hour like a brand-new newborn, and my first sleep-deprived thought was, *"Did I break my baby?"*
You didn't. Nothing is wrong. Welcome to the famous **4-month sleep regression** — and the good news is that once you understand what's really happening, it gets a lot less scary. Here's why it hits, how long it lasts, and what genuinely helped us through it.
## What is the 4-month sleep regression?
Somewhere between **3 and 5 months**, many babies who were sleeping decently suddenly start waking frequently, fighting naps, and needing more help to settle. It feels like everything you knew stopped working overnight.
Here's the twist most parents don't hear: **it's not actually a "regression" at all.** It's a permanent developmental leap.
## Why it happens (the science, made simple)
In the early weeks, newborns drop straight into deep sleep. Around four months, their sleep **matures into adult-like cycles** — moving through lighter and deeper stages. At the end of each cycle, there's a brief wake-up. Adults roll over and fall back asleep without remembering it. Your baby hasn't learned that skill yet, so they fully wake — and cry for you.
That's why it's really a **progression**: your baby's brain just leveled up. It's a sign of healthy development, even though it costs you sleep.
## How long does the 4-month sleep regression last?
Usually **2 to 6 weeks**. Because it's driven by a permanent change in how your baby sleeps, the goal isn't to make it "go away" — it's to gently help your baby learn to link sleep cycles. Once that clicks, sleep often improves beyond where it was before.
## Signs you're in it
- More frequent night wakings (sometimes hourly)
- Short, disrupted naps
- Fighting sleep at bedtime
- Extra fussiness and clinginess
- A bigger appetite (growth often comes along for the ride)
[[CTA||Logging her wakeups showed me they weren't random — seeing the pattern made the chaos feel manageable.]]
## Three things that actually helped us
### 1. Full, age-appropriate wake windows
An overtired baby fights sleep harder. Making sure she was genuinely tired — using proper [wake windows by age](/mamabee/articles/wake-windows-by-age) — made a real difference.
### 2. Drowsy but awake
Putting her down drowsy but not fully asleep gave her low-pressure practice at settling herself, which is the exact skill the regression demands.
### 3. A boring, consistent wind-down
Same short routine every night — dim lights, feed, a little song, into the crib. Predictability tells a baby's body "sleep is coming."
## What NOT to stress about
- **You don't have to sleep train.** Plenty of babies get through this with gentle support and time.
- **Don't create habits you'll resent** if you can help it — but survival is allowed. Feed to sleep for a few rough nights if you need to; you can adjust later.
- **It's not your fault**, and it doesn't mean your baby's sleep is "ruined."
## Frequently asked questions
### Does every baby have a 4-month sleep regression?
No. Some babies breeze through it, some hit it earlier or later, and some have a rougher time. All of it is normal.
### Can teething or a growth spurt make it worse?
Yes — they often overlap around this age, stacking extra wakings on top. Track feeds and fussiness and you'll often spot what's driving a rough night.
### Will my baby's sleep get better after the regression?
Usually, yes. Once your baby learns to connect sleep cycles, many parents see **better** sleep than before it started. Hang in there.
## The takeaway
The 4-month sleep regression isn't a step backward — it's your baby's brain growing up. It's temporary, it's normal, and it's not your fault. Protect wake windows, offer gentle chances to self-settle, keep the routine boring, and track the wakings so the chaos has a shape. Brighter nights are coming.
[[CTA||Track sleep patterns and ride out the regression with more confidence — get MamaBee free.]]
*This article is general information, not medical advice. Every baby is different — talk to your pediatrician about your baby's sleep.*`,
  },
  {
    slug: 'day-with-mamabee-baby-tracker',
    title: 'A Day With MamaBee: How One-Thumb Tracking Ended My 3 AM Guessing',
    description: 'A real day-in-the-life with MamaBee, the calm AI baby tracker: one-thumb logging for feeds, sleep and diapers, gentle 3 AM insights, private data — and the pattern it caught that I completely missed.',
    tags: ['baby tracker app', 'mamabee', 'newborn tracker', 'baby feeding tracker', 'baby sleep tracker'],
    body: `My first "baby tracking system" was a whiteboard on the fridge. Then the Notes app. Then sticky notes, a running text thread with my partner, and — for one ambitious afternoon — a spreadsheet I opened exactly twice. By the end of week two I had five half-broken systems and still couldn't answer the one question that mattered at 3 AM: *when did she last eat?*
That mess is the whole reason I switched to **MamaBee**, the calm, AI-powered **baby tracker** built by parents who were also very, very tired. Here's an honest look at what a real day with it feels like — and the small thing it caught that changed our nights.
## The problem every new parent knows
Newborn life runs on a loop of feeds, naps, and diapers — but on no sleep, that loop turns into a fog. You can't remember which side you fed on, how long the last nap was, or whether today is normal. That mental load is exhausting, and it's exactly what a good baby tracker is supposed to lift off your shoulders.
## Morning: one thumb, half asleep
The first feed of the day starts before my brain does. With MamaBee, logging it is **one tap** — because you're always holding a baby with your other arm. Feed, nap, diaper: a single thumb, no typing, works in the dark. That "one-thumb logging" isn't a gimmick; it's the difference between actually tracking and giving up by day three.
## Midday: it does the remembering for me
"When did she last eat?" used to be a memory test I always failed. Now it's just… there. Last feed, last nap, how long she's been awake right now. No math, no notebook, no arguing with my partner about whether that nap was 20 minutes or 40.
[[CTA||Log feeds, sleep, and diapers with one thumb — and let MamaBee do the remembering for you.]]
## What MamaBee actually tracks
- **Feeds** — breast (with side + timer) or bottle (with amount)
- **Sleep** — naps and night sleep, with wake-window awareness
- **Diapers** — wet, dirty, and the details your pediatrician asks about
- **Growth and milestones** — so the big picture is all in one calm place
## Afternoon: gentle insights, not a wall of charts
This is where the "AI-powered" part earns its keep. MamaBee doesn't bury you in graphs at 3 PM. It surfaces one calm, useful nudge — like when the next nap is likely based on wake windows, or whether today's feeding is tracking with the last few days. Insight, not homework.
## The pattern I never would have caught
Here's the moment it won me over. After about a week, MamaBee quietly flagged something: my daughter **slept noticeably longer on nights after a bath.** I'd never have spotted that across a blur of sticky notes and no sleep. One tiny pattern — and suddenly we had a bedtime routine that actually worked. That's the real magic of tracking: patterns you can't see in the moment become obvious in the data.
## Night: calm, and yours
At 3 AM, MamaBee stays gentle — a soft glance at the last feed, the next likely nap, nothing shouty. And crucially, **your data stays yours.** Your baby's life isn't a product to be sold or ad-targeted. Privacy isn't an afterthought here; it's the point.
## What to log in your first week
Keep it simple to start:
- **Feeds** (time + side or amount)
- **Sleep** (start and end)
- **Diapers** (wet/dirty)
That's enough for the patterns to surface. Everything else is a bonus you can add when you're ready. For the *why* behind the wake-window predictions, see our [newborn sleep schedule guide](/mamabee/articles/newborn-sleep-schedule).
## Frequently asked questions
### What does MamaBee track?
Feeds (breast and bottle), sleep and naps, diapers, growth, and milestones — all with fast one-thumb logging and gentle AI insights.
### Is my data private?
Yes. MamaBee keeps your data yours — no selling it, no creepy ad targeting. Your baby's information belongs to your family.
### Do I have to log everything?
Not at all. Start with feeds, sleep, and diapers. The more you log, the smarter the insights get — but even light tracking helps.
## The takeaway
You don't need five broken systems and a whiteboard. You need one calm place that logs in a tap, remembers so you don't have to, and quietly spots the patterns that make life easier. That's MamaBee — made with honey by parents, for the 3 AM version of you.
[[CTA||Stop guessing at 3 AM. Get MamaBee free and track your baby in one thumb.]]`,
  },
  {
    slug: 'wake-windows-by-age',
    title: 'Wake Windows by Age: The Nap-Timing Cheat Sheet That Ends the Meltdowns',
    description: 'A complete wake-windows-by-age chart from newborn to 12 months, how to read sleepy cues, and how the right nap timing turns overtired meltdowns into easy, predictable sleep.',
    tags: ['wake windows by age', 'baby wake windows', 'nap schedule', 'baby sleep', 'newborn naps'],
    body: `There's a very specific meltdown you can almost set your watch to — the one that arrives when a baby has been awake about ten minutes too long. For weeks I was sure it was hunger, or gas, or teething. It was none of those. It was the **wake window**.
Once I learned to time sleep by wake windows instead of the clock, our days got dramatically calmer. Here's the full **wake windows by age** cheat sheet, how to read your baby's sleepy cues, and how to use both to make naps easy.
## What is a wake window?
A **wake window** is simply how long your baby can comfortably stay awake — feed, play, and all — before they need to sleep again. Time sleep near the end of the window and it comes easily. Miss it and you get an overtired baby who, cruelly, fights sleep *harder*.
## Wake windows by age (the cheat sheet)
Use these as starting points, then adjust to your baby:
- **0–1 month:** 35–60 minutes
- **1–2 months:** 45–90 minutes
- **3–4 months:** 75–120 minutes
- **5–6 months:** 2–2.5 hours
- **7–9 months:** 2.5–3.5 hours
- **10–12 months:** 3–4 hours
Note that the **first wake window of the day is usually the shortest**, and windows tend to stretch a little as the day goes on.
## How to read sleepy cues
The clock gets you close; your baby's cues get you exact. Watch for:
- **Early cues:** yawning, staring off, slowing down, getting quiet
- **Later cues:** red or raised eyebrows, ear pulling, clenched fists, rubbing eyes
- **Overtired (too late):** frantic crying, arching, wired "second wind" energy
Aim to start winding down at the **early** cues, before the meltdown.
[[CTA||Let MamaBee predict the next nap from your baby's wake windows — so you can wind down before the meltdown, not after.]]
## Why nap timing fixes so much fussiness
The "witching hour" fussiness I kept trying to fix with extra feeds? It wasn't hunger. It was accumulated overtiredness from windows that ran a little too long all day. When I tightened up nap timing, the evening screaming faded on its own. Overtiredness is sneaky — it masquerades as hunger, gas, and general crankiness.
## Building a loose daily rhythm
You don't need a rigid clock schedule — you need a **repeating loop**:
1. Baby wakes
2. Feed + a little awake time
3. Watch for sleepy cues as the window closes
4. Wind down and sleep
5. Repeat
As your baby grows, the number of naps naturally drops — from many short newborn naps, to 3–4 naps, to 2 naps, and eventually 1. Longer wake windows are what drive those transitions. For the newborn stage specifically, pair this with our [newborn sleep schedule guide](/mamabee/articles/newborn-sleep-schedule), and know that around four months the [4-month sleep regression](/mamabee/articles/4-month-sleep-regression) can shuffle everything temporarily.
## Common wake-window mistakes
- **Keeping baby up longer to "tire them out."** This backfires — overtired babies sleep worse.
- **Ignoring cues because the clock says it's early.** Cues win. Some days windows are shorter.
- **Rigidly enforcing minutes.** Wake windows are a guide, not a law. Your baby is the boss.
## Frequently asked questions
### What happens if I miss my baby's wake window?
They often become overtired and harder to settle, with more frequent night wakings. If you miss it, a little extra soothing (motion, contact, a dark room) helps them wind down.
### Should I wake my baby from a nap to protect wake windows?
Sometimes — especially to protect night sleep or keep the day on track. Capping a very long late-afternoon nap can prevent bedtime battles.
### How do I know my baby's ideal wake window?
Start with the age range above, watch how they do, and adjust. If they fight sleep, try a slightly shorter window; if they're happy and not tired, stretch it a little. Tracking makes the sweet spot obvious.
## The takeaway
Wake windows are the single most useful thing I learned about baby sleep. Use the age chart as your starting point, trust your baby's sleepy cues over the clock, and wind down *before* the overtired meltdown. Calmer naps, calmer evenings, calmer you.
[[CTA||Get nap-time predictions built around your baby's wake windows — download MamaBee free.]]
*This article is general information, not medical advice. Every baby is different — check with your pediatrician about sleep.*`,
  },
  {
    slug: 'tummy-time-guide',
    title: "Tummy Time: How Much, When to Start, and Why It's Worth the Tears",
    description: 'A complete tummy time guide: how much your baby needs by age, when to start, why small daily doses beat one long battle, and easy tricks to make tummy time less tearful.',
    tags: ['tummy time', 'baby milestones', 'baby development', 'newborn', 'motor skills'],
    body: `The first time I laid my daughter on her tummy, she looked at me like I'd personally betrayed her, screamed for about ninety seconds, and I scooped her up in defeat. If you've felt that "is this even worth it?" flicker of doubt — I promise it is, just not for the reason I first assumed.
Here's the full, no-guilt **tummy time** guide: how much your baby actually needs, when to start, why it matters more than it seems, and the tricks that finally made it (mostly) tear-free in our house.
## What is tummy time and why does it matter?
Tummy time is simply supervised time your baby spends on their stomach while awake. It's one of the most important things you can do for early development, because it builds the head, neck, and shoulder strength your baby needs for nearly every milestone that follows — rolling, sitting, crawling, and more.
It also helps prevent **flat spots** on the back of the head (positional plagiocephaly), which are more common now that babies rightly sleep on their backs.
## When should you start tummy time?
You can start **from day one** — even a newborn benefits. Early on, "tummy time" can simply be your baby lying **chest-to-chest** on you while you're reclined and awake. That counts, and it's often the gentlest introduction.
## How much tummy time, by age
Build up gradually — this is about consistency, not endurance:
- **Newborn:** 1–2 minutes, a few times a day (chest-to-chest counts)
- **1–2 months:** work toward 10–15 minutes total per day
- **3–4 months:** about 20–30 minutes total per day, in short chunks
- **5–6 months+:** as long as they're happy — many babies start enjoying it
Short, frequent sessions beat one long, miserable stretch every time.
[[CTA||Log little bursts of tummy time so the minutes add up — and watch the habit (and the milestones) build.]]
## The plot twist: it's not really about strength
Here's what surprised me. Tummy time isn't a workout you have to "win." It's about **frequent, gentle exposure** — tiny reps that add up. Three minutes, six times a day is far more effective (and far less tearful) than one thirty-minute crying marathon. Once I stopped treating it like bootcamp and started sprinkling it through the day, everyone was happier.
## How to make tummy time easier (and less tearful)
- **Get down on the floor at their eye level** — your face is the best toy.
- **Use a mirror** — babies love their own reflection.
- **Add a high-contrast toy** just out of reach to encourage lifting and reaching.
- **Try a rolled towel** under the chest for a little lift and support.
- **Time it right:** after a nap and before a feed, when they're rested but not full.
- **Start tiny:** even 60 seconds counts. Stop before the full meltdown so it stays positive.
## Tummy time and safe sleep
Two quick reminders: tummy time is always **awake and supervised**. And babies should still **always sleep on their backs** — tummy time is for playtime, not naps.
## Frequently asked questions
### How much tummy time does a newborn need?
Just a few minutes, a few times a day, gradually building up. Chest-to-chest time on a parent counts and is a great gentle start.
### My baby hates tummy time — what do I do?
Very normal. Shorten sessions to under a minute, get face-to-face, use a mirror or toy, and try it right after a nap. Little and often, and it usually improves with practice.
### When should my baby be lifting their head during tummy time?
Many babies lift and briefly hold their head up by around 1–2 months and get much stronger by 3–4 months. If you have concerns about your baby's movement or head control, ask your pediatrician.
## The takeaway
Tummy time isn't a battle to win — it's a habit to build, in tiny, frequent doses. Start from day one, keep sessions short and positive, get down on the floor with them, and let the minutes add up. Those little reps are quietly building every milestone to come.
[[CTA||Track tummy time and milestones in one calm place — get MamaBee free.]]
*This article is general information, not medical advice. Always supervise tummy time and talk to your pediatrician about your baby's development.*`,
  },
  {
    slug: 'newborn-gas-relief',
    title: 'Why Is My Newborn So Gassy? Real Gas Relief That Actually Works',
    description: 'Why newborns get so gassy, the gas-relief moves that actually work, and the surprising feeding habit that was the real culprit for us — plus when gas means it is time to call the doctor.',
    tags: ['newborn gas relief', 'gassy baby', 'colic', 'baby tummy', 'newborn'],
    body: `It's 2 AM. There's grunting, a red little face, tiny legs pulling up to the belly, and then — the wail. If you've spent a night bicycling a newborn's legs like you're training for the Tour de France, pull up a chair. I've been you, and there's real relief ahead.
Here's the practical guide to **newborn gas relief**: why babies get so gassy, the moves that actually help, the sneaky cause I completely missed, and the signs that mean it's more than ordinary gas.
## Why are newborns so gassy?
A newborn's digestive system is brand new and still learning how to work. On top of that, babies **swallow a lot of air** — while feeding, while crying, while sucking. That trapped air, plus an immature gut, equals a lot of gas. It's incredibly common and, on its own, rarely serious. It's just genuinely uncomfortable for everyone at 2 AM.
## Signs your baby is gassy
- Grunting, straining, and squirming
- Pulling legs up toward the belly
- A firm or bloated little tummy
- Fussiness that eases after a burp or a good toot
- Passing gas (obviously) and often happier right after
## Gas relief that actually works
### Burp early and often
Don't wait until the end. Burp **mid-feed** and after, especially with fast eaters. A few extra pauses can prevent a lot of trapped air.
### Bicycle legs and tummy massage
Lay your baby on their back and gently cycle their legs, then bring both knees to the belly. Follow with a soft clockwise tummy massage. This physically helps move gas along.
### Keep them upright after feeds
Hold your baby upright for **15–20 minutes** after eating so gravity can help everything settle before you lay them down.
### Check the latch and bottle flow
A poor latch or a fast-flowing nipple means more swallowed air. A slower-flow nipple and a good latch can make a real difference.
[[CTA||Logging feeds next to fussy spells helped me find the trigger — instead of blaming everything at random.]]
## The plot twist: it wasn't the formula
I was *certain* it was the formula. I switched brands twice, spent a small fortune, and nothing changed. The real culprit? She was eating too **fast** and gulping air with every gulp. Slower feeds, a slower-flow nipple, and more frequent burp breaks fixed what no formula change ever could. And the only reason I figured it out was that I'd started **logging feeds next to her fussy spells** — the pattern lined right up. Data beat guesswork.
## What about colic?
If your baby cries intensely for **more than 3 hours a day, more than 3 days a week, for 3+ weeks**, that's often described as **colic**. Colic isn't the same as gas, and it isn't caused by anything you did wrong. Gas-relief moves can still help soothe, but colic is worth discussing with your pediatrician for reassurance and support.
## When to call the doctor
Ordinary gas doesn't come with these. Call your pediatrician if gassiness comes alongside:
- **Fever**
- **Blood in the stool** or vomit
- **Poor weight gain** or refusing to feed
- **Inconsolable crying** that feels different or extreme
- A **hard, swollen belly** with no bowel movements
Trust your instincts — you know your baby.
## Frequently asked questions
### What is the fastest way to relieve newborn gas?
Burp them, then do bicycle legs and a gentle tummy massage, and hold them upright. Often a good burp or passed gas brings quick relief.
### Do gas drops or gripe water work?
Some parents find simethicone gas drops help; evidence is mixed but they're generally considered low-risk. Always check with your pediatrician before giving anything, especially gripe water.
### Does what I eat cause my breastfed baby's gas?
Usually less than people think. Most babies aren't bothered by mom's diet. If you suspect a specific food, talk to your pediatrician before cutting things out.
## The takeaway
Newborn gas is common, miserable, and almost always temporary. Burp often, bicycle those little legs, keep feeds slow and upright, and **track feeds against fussy times** so you can spot the real trigger instead of guessing. Relief — and quieter nights — are closer than they feel at 2 AM.
[[CTA||Spot your baby's gas triggers by tracking feeds and fussiness — get MamaBee free.]]
*This article is general information, not medical advice. Call your pediatrician about persistent or severe symptoms.*`,
  },
  {
    slug: 'cluster-feeding',
    title: 'Cluster Feeding: Is My Baby Getting Enough? (What It Is and How to Survive It)',
    description: 'Cluster feeding explained: why your baby suddenly wants to feed non-stop in the evenings, whether it means low milk supply, how long it lasts, and how to actually get through the marathon.',
    tags: ['cluster feeding', 'breastfeeding', 'newborn feeding', 'growth spurt', 'baby feeding'],
    body: `She ate. Twenty minutes later, she wanted to eat again. And again. It was 6 PM, I was touched-out, starving, and slightly panicking: *she's still hungry — I'm not making enough milk.* If that's you right now, tonight, please hear this first: you're almost certainly fine, and so is your baby.
This is **cluster feeding**, and nearly every parent runs into it. Here's what it actually is, why it happens, whether it means low supply (spoiler: usually the opposite), how long it lasts, and how to survive the marathon with your sanity intact.
## What is cluster feeding?
Cluster feeding is when your baby wants **lots of short feeds bunched close together** over a few hours, instead of their usual spaced-out pattern. It's most classic in the **evenings** and during growth spurts, and it's a completely normal newborn behavior — not a problem to fix.
## What cluster feeding looks like
- Many short feeds packed into a few hours
- Usually late afternoon or evening ("the witching hours")
- Fussy and unsettled *between* feeds, but calmer *while* feeding
- Often paired with a bit of extra fussiness or wanting to be held
## The plot twist: it's usually NOT low supply
Here's the reassurance that changed everything for me. That relentless evening demand isn't a sign your supply is failing — it's how your baby **builds** your supply. Breast milk works on demand: the more your baby nurses, the more milk your body is told to make. So cluster feeding is literally your baby placing tomorrow's order. It's the system **working**, not failing.
For formula-fed babies, cluster feeding can happen too — often around growth spurts — and simply means a temporary bump in appetite.
[[CTA||Seeing the feeds logged made it obvious: this was a predictable evening cluster, not an all-day emergency.]]
## Why does cluster feeding happen?
A few common reasons:
- **Growth spurts** — babies bump up demand to fuel rapid growth (common around 2–3 weeks, 6 weeks, and 3 months).
- **Building milk supply** — extra nursing signals your body to make more.
- **Comfort and connection** — evenings can be overstimulating; feeding is soothing.
- **"Tanking up"** before a longer night stretch — sometimes cluster feeding actually precedes better sleep.
## How long does cluster feeding last?
It's usually a **phase, not a permanent pattern** — often a few days around a growth spurt, or a recurring evening stretch for a few weeks. It typically eases as your baby's feeding becomes more predictable and their stomach grows.
## How to survive the cluster-feeding hours
- **Build a nest.** Water, snacks, phone charger, remote, a good show — set up before it starts.
- **Tag-team.** Have a partner handle diapers, burping, and settling between feeds so you can rest.
- **Eat and hydrate.** You're fueling two people. Keep one-handed snacks close.
- **Let go of the clock.** Follow your baby; the timing will look chaotic and that's okay.
- **Remember it's temporary.** This is a phase, not your new forever.
## Is my baby actually getting enough?
If you're still worried about intake, go back to the reliable proof: **diapers and weight gain.** Enough wet and dirty diapers plus steady growth means your baby is well-fed, cluster feeding and all. For the full breakdown, see our guide on [how much a newborn should eat](/mamabee/articles/how-much-should-a-newborn-eat).
## When to check with a professional
Reach out to a lactation consultant or your pediatrician if: your baby isn't gaining weight, has fewer than 6 wet diapers a day, seems lethargic or hard to rouse, or if nursing is painfully difficult. Support exists — use it.
## Frequently asked questions
### Does cluster feeding mean I have low milk supply?
Usually the opposite. Frequent feeding tells your body to make **more** milk. As long as diapers and weight gain are on track, your supply is almost certainly fine.
### How long does cluster feeding last each day?
Often a few hours in the evening, and the phase itself may last a few days to a couple of weeks around growth spurts. It comes and goes.
### Should I offer a bottle during cluster feeding?
Not necessary if breastfeeding is going well — extra nursing is what builds supply. If you have concerns, talk to a lactation consultant before supplementing.
## The takeaway
Cluster feeding feels alarming, but it's one of the most normal (and temporary) parts of newborn life. It's usually your baby building your supply and fueling a growth spurt — not a sign of failure. Set up your nest, follow your baby, lean on your people, and trust the diapers. This phase passes.
[[CTA||Track feeds and see the pattern behind the marathon — get MamaBee free.]]
*This article is general information, not medical advice. Talk to a lactation consultant or your pediatrician with any feeding or supply concerns.*`,
  },
  {
    slug: '3am-question-mamabee-ai-tracker',
    title: 'The 3 AM Question Every Parent Googles — and How MamaBee Answers It',
    description: "Every exhausted parent Googles the same thing at 3 AM. Here's how MamaBee's calm AI answers it — one-thumb logging, gentle pattern insights, private data, and the reassurance you actually need.",
    tags: ['ai baby tracker', 'mamabee', 'baby sleep tracker', 'newborn app', 'baby feeding tracker'],
    body: `There's one question the entire internet gets asked at 3 AM by parents who can barely remember their own name, let alone the last feed: *"When did she last eat — and is this normal?"*
You can't really Google your way to that answer. It's **your** baby, tonight, right now. Closing that gap — between the fog in your head and the reassurance you need — is exactly what **MamaBee**, the calm, AI-powered baby tracker, was built for. Here's how it actually helps when you need it most.
## The 3 AM problem
Newborn nights are a blur of feeds, wakeups, and diapers. On broken sleep, your brain simply can't hold the details: which side you fed on, how long that nap was, whether five wakeups is normal for a Tuesday. That uncertainty is its own kind of exhausting — and no generic search result can answer it, because it doesn't know your baby.
## One-thumb logging (because you're always holding a baby)
Everything in MamaBee is built for the reality of new-parent life: you have exactly one free thumb, in the dark, running on fumes. Feeds, sleep, and diapers each log with **a single tap** — no typing, no fiddly forms. If tracking isn't effortless, you'll quit by day three. MamaBee makes it effortless on purpose.
[[CTA||Log feeds, sleep, and diapers with one thumb — even at 3 AM in the dark.]]
## Gentle AI insights, not a wall of charts
Plenty of apps drown you in graphs. MamaBee does the opposite. Its AI turns your logs into **one calm, human sentence** when it matters: when the next nap is likely based on wake windows, whether today's feeding tracks with the last few days, or a pattern worth knowing. It's insight, not homework — the difference between data that stresses you out and data that actually helps.
## The feature that changed my nights
Here's the honest moment it earned its place on my home screen. The most useful thing MamaBee ever did wasn't a chart or an alarm. One morning it gently showed me that my daughter was feeding and sleeping **right on track** — and I realized the thing that needed reassurance wasn't the baby. It was **me**. Sometimes the most valuable thing a tracker can tell you is *you're doing better than you feel.* That quiet confidence is worth more than any graph.
## Your data stays yours
Your baby's life is not a product. MamaBee keeps your data **private** — no selling it, no creepy ad targeting, no turning your 3 AM feeds into someone's marketing profile. Privacy isn't a footnote here; it's a core promise. "Your data always stays yours" is exactly what a parenting app should stand for.
## What to check in MamaBee each morning
A 30-second morning glance tells you almost everything:
- **Totals** — feeds and sleep versus the last few days
- **The next predicted nap** window, so you can plan your morning
- **Any gentle insight** MamaBee flagged overnight
That's it. No spreadsheet, no math, no doom-scrolling parenting forums at dawn.
## More than a tracker: a calmer headspace
Tracking feeds and naps is the practical layer. The real gift is the **mental load it lifts** — the remembering, the second-guessing, the "is this normal?" spiral. When the app holds the details, your brain gets to hold your baby. For the sleep science behind the predictions, see our [newborn sleep schedule](/mamabee/articles/newborn-sleep-schedule) and [wake windows by age](/mamabee/articles/wake-windows-by-age) guides.
## Frequently asked questions
### Is MamaBee free?
Yes — you can get MamaBee and start tracking feeds, sleep, and diapers for free. Download it and log your first feed in seconds.
### How is MamaBee different from other baby trackers?
Two things: genuinely fast **one-thumb logging** built for exhausted parents, and **gentle AI insights** that give you one useful takeaway instead of a wall of charts — all while keeping your data private.
### Does the AI replace my pediatrician?
No. MamaBee helps you notice patterns and stay organized so you can have better conversations with your pediatrician. It supports your care team; it doesn't replace it.
## The takeaway
At 3 AM, you don't need another search result — you need your own baby's story, right there, and a little reassurance that you're doing okay. That's MamaBee: one-thumb logging, calm AI insights, private data, and the quiet confidence that comes from actually knowing. Made with honey, by parents, for the tired version of you.
[[CTA||Meet MamaBee — the calm AI baby tracker. Download it free and end the 3 AM guessing.]]`,
  },
]

for (const u of updates) {
  await client.patch(`drafts.mamabee-${u.slug}`).set({title: u.title, description: u.description, tags: u.tags, body: md(u.body)}).commit()
  const words = u.body.replace(/[#>*\-\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length
  console.log(`✓ rewritten: ${u.slug} (~${words} words)`)
}
console.log('\nDone.')
