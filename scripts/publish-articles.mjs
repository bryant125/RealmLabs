// Bulk-creates the batch-1 MamaBee articles as DRAFTS in Sanity.
// Run: SANITY_WRITE_TOKEN=xxx node scripts/publish-articles.mjs
// Drafts (never auto-published) so you review + hit Publish in /studio.
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'

const client = createClient({
  projectId: '1jrna7ry',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const k = () => randomUUID().slice(0, 8)

// --- tiny markdown -> Portable Text converter (paragraphs, ### h3, > quote,
// - bullet, [[CTA|label|heading]], inline **bold** and [text](url) / [text](APP)) ---
function inline(text) {
  const children = [], markDefs = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0, m
  const push = (t, marks = []) => { if (t) children.push({_type: 'span', _key: k(), text: t, marks}) }
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index))
    if (m[1] !== undefined) push(m[1], ['strong'])
    else {
      const key = 'l' + markDefs.length
      if (m[3] === 'APP') markDefs.push({_key: key, _type: 'appLink'})
      else markDefs.push({_key: key, _type: 'link', href: m[3]})
      push(m[2], [key])
    }
    last = m.index + m[0].length
  }
  push(text.slice(last))
  return {children, markDefs}
}
const block = (style, text, extra = {}) => {
  const {children, markDefs} = inline(text)
  return {_type: 'block', _key: k(), style, markDefs, children, ...extra}
}
function md(src) {
  const out = []
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('### ')) out.push(block('h3', line.slice(4)))
    else if (line.startsWith('> ')) out.push(block('blockquote', line.slice(2)))
    else if (line.startsWith('- ')) out.push(block('normal', line.slice(2), {listItem: 'bullet', level: 1}))
    else if (line.startsWith('[[CTA')) {
      const [, label = 'Get the app', heading] = line.slice(2, -2).split('|')
      out.push({_type: 'appCta', _key: k(), label, ...(heading ? {heading} : {})})
    } else out.push(block('normal', line))
  }
  return out
}

const A = (slug, title, description, tags, body) => ({slug, title, description, tags, body})

const articles = [
  A('newborn-sleep-schedule',
    'Newborn Sleep Schedule: What Actually Works in the First 12 Weeks',
    'A gentle, real newborn sleep schedule by wake windows — not the clock. Plus the one thing that finally stopped the 3 AM meltdowns.',
    ['sleep', 'newborn', 'wake windows'],
`It's 3 AM. You've been bouncing a wide-awake baby for forty minutes, you Googled "newborn sleep schedule" with one thumb, and every result gave you a neat little chart your actual baby has clearly never read. I've been exactly there. So let me save you the doom-scroll.
Here's the first hard truth: **newborns don't run on the clock. They run on wake windows** — how long they can happily stay awake before they need to sleep again.
### Rough wake windows by age
- **0–4 weeks:** 35–60 minutes
- **5–8 weeks:** 45–90 minutes
- **9–12 weeks:** 60–120 minutes
The rhythm that saved my sanity was simply **eat → a little awake time → sleep → repeat**. Not a schedule. A loop.
For weeks I tried to force nap times and just made everyone cry. What actually worked was watching *her* instead of the clock — the yawn, the red eyebrows, the thousand-yard stare that means "put me down NOW."
[[CTA|Get MamaBee|Stop doing wake-window math in your head — let MamaBee log it and the pattern shows up on its own.]]
> **Plot twist:** the goal was never *more* sleep. It was catching the window *before* she got overtired — because an overtired newborn fights sleep harder, not less. Ten minutes early beats an hour of screaming.
### Do this tonight
Forget the perfect schedule. Note when your baby wakes, add their wake window, and start winding down before it's up. Track it for three days and your baby's real rhythm appears — more on that in [wake windows by age](/mamabee/articles/wake-windows-by-age).
[[CTA|Track naps in one thumb →]]
*Not medical advice — always check with your pediatrician about your baby's sleep.*`),

  A('how-much-should-a-newborn-eat',
    'How Much Should a Newborn Eat? A Real Feeding Guide by Week',
    'How much a newborn eats by week, the hunger cues to watch, and the diaper trick that tells you they are getting enough — without obsessing over ounces.',
    ['feeding', 'newborn', 'breastfeeding', 'formula'],
`"Is she getting enough?" I asked that question roughly nine hundred times in the first month. It's the quiet worry behind every feed, especially when you can't see the ounces going in.
So here's the ballpark, because you came for numbers:
- **Days 1–3:** tiny — a few teaspoons; their tummy is the size of a marble.
- **Week 1:** ~1–2 oz per feed, 8–12 times a day.
- **Weeks 2–4:** ~2–3 oz per feed.
- **1–2 months:** ~3–4 oz per feed.
Watch for hunger cues before the crying starts: rooting, hands to mouth, smacking lips. Crying is the *late* signal.
[[CTA|Get MamaBee|Log each feed with one tap and watch the daily total add up — no notebook, no 3 AM guessing.]]
> **Plot twist:** the ounces matter far less than what comes *out*. Enough wet and dirty diapers plus steady weight gain is the real proof they're fed — not the number on the bottle. Stop counting ounces, start counting diapers.
### The "enough" checklist
- 6+ wet diapers a day after day 5
- Regular dirty diapers (see our [poop color chart](/mamabee/articles/baby-poop-color-chart))
- Back to birth weight by ~2 weeks
[[CTA|Track feeds & diapers →]]
*Not medical advice — talk to your pediatrician about weight and feeding.*`),

  A('baby-poop-color-chart',
    "Baby Poop Color Chart: What's Normal (and When to Call the Doctor)",
    'A simple baby poop color chart: which colors are totally normal, which three mean call the doctor, and why one weird diaper usually is not the story.',
    ['health', 'diapers', 'newborn'],
`Nobody warns you that a huge part of new parenthood is staring into a diaper like it's a crystal ball. The first time I saw a green one I nearly called poison control. (It was fine. It's almost always fine.)
### The normal spectrum
- **Black/tar (day 1–3):** meconium — expected.
- **Mustard yellow, seedy:** classic breastfed poop.
- **Tan / peanut-butter brown:** classic formula poop.
- **Green:** usually fine — foremilk/hindmilk balance, or just a Tuesday.
[[CTA|Get MamaBee|Log diapers with a tap so you can see changes over days — instead of trying to remember what yesterday looked like.]]
> **Plot twist:** the scary colors are genuinely rare. What your pediatrician actually cares about isn't one odd diaper — it's a *change over time*. That's exactly why logging beats memory: a pattern is a signal, a single diaper usually isn't.
### The three colors to call about
- **Red** (blood)
- **White/chalky** (possible liver issue)
- **Black** after the first week
Anything on that list, call your doctor. Everything else, breathe.
[[CTA|Keep a diaper log →]]
*Not medical advice — when in doubt, call your pediatrician.*`),

  A('4-month-sleep-regression',
    'The 4-Month Sleep Regression: Why It Happens and What Helped Us',
    'The 4-month sleep regression, explained by a parent who survived it: why it happens, how long it lasts, and the three things that actually helped.',
    ['sleep', 'regression', '4 months'],
`For a glorious few weeks, my baby slept. Long stretches. I started to feel human. Then, right around four months, she was up every single hour like a newborn again — and my first panicked thought was, "Did I break my baby?"
You didn't. And honestly, "regression" is the wrong word.
### What's really happening
Around four months, babies' sleep matures into adult-like cycles with light phases they briefly wake from. It's permanent — this is your baby learning to sleep like a person. Which is why it feels like everything you knew stopped working.
[[CTA|Get MamaBee|Logging her wakeups showed me they weren't random — they clustered at the same times, which made them way less scary.]]
> **Plot twist:** it's not a regression at all — it's a *progression*. Her brain leveled up. Once I reframed it from "something's wrong" to "she's developing," I stopped fighting it and started supporting it.
### Three things that helped
- Full wake windows so she was truly tired (see [wake windows by age](/mamabee/articles/wake-windows-by-age))
- Putting her down drowsy-but-awake to practice self-settling
- A boringly consistent wind-down routine
[[CTA|See your baby's sleep pattern →]]
*Not medical advice — every baby is different; ask your pediatrician.*`),

  A('day-with-mamabee-baby-tracker',
    'A Day With MamaBee: How I Stopped Guessing and Started Knowing',
    'A real day-in-the-life with MamaBee, the calm AI baby tracker: one-thumb logging for feeds, sleep and diapers — and the insight it caught that I completely missed.',
    ['baby tracker', 'mamabee', 'app'],
`My first "tracking system" was a whiteboard. Then the Notes app. Then sticky notes on the fridge, a group text with my partner, and — briefly — a spreadsheet I opened exactly twice. By week two I had five broken systems and still couldn't answer the one question that mattered at 3 AM: *when did she last eat?*
That's the whole reason I switched to MamaBee. Here's an honest look at what a day with it actually feels like.
### Morning: one thumb, half asleep
Feed starts — one tap. Nap starts — one tap. Diaper — one tap. That's the point: you're holding a baby with the other arm, so everything is done with a single thumb, without really looking.
### Midday: it does the remembering
"When did she last eat?" isn't a memory game anymore — it's right there. Last feed, last nap, how long she's been awake. No math, no notebook.
[[CTA|Get MamaBee — free|One-thumb logging for feeds, sleep, diapers, and more. Made with honey by parents who were also very tired.]]
### Night: gentle insights, not guilt
At 3 AM MamaBee doesn't shout charts at you. It gives one calm, useful nudge — like when the next nap is likely, or a pattern it noticed. And your data stays yours; it's not for sale.
> **Plot twist:** the most useful thing MamaBee ever did wasn't tracking — it was *noticing*. It quietly flagged that she slept longer on nights after a bath. I'd never have spotted that across a foggy week of sticky notes. One tiny pattern, better nights.
### What to log in your first week
- Feeds (time + side/amount)
- Sleep (start + end)
- Diapers (wet/dirty)
That's enough for the patterns to surface. Everything else is bonus.
[[CTA|Start tracking in one thumb →]]`),

  A('wake-windows-by-age',
    'Wake Windows by Age: The Nap-Timing Cheat Sheet',
    'A simple wake-windows-by-age chart from newborn to 12 months — the nap-timing cheat sheet that turns guesswork into a predictable rhythm.',
    ['sleep', 'wake windows', 'naps'],
`There's a specific meltdown you can almost set your watch to — the one that hits when a baby has been awake ten minutes too long. For weeks I thought it was hunger. It wasn't. It was the window.
### Wake windows by age
- **0–1 mo:** 35–60 min
- **1–2 mo:** 45–90 min
- **3–4 mo:** 75–120 min
- **5–6 mo:** 2–2.5 hr
- **7–9 mo:** 2.5–3.5 hr
- **10–12 mo:** 3–4 hr
[[CTA|Get MamaBee|MamaBee predicts the next nap from your baby's wake windows, so you can wind down before the meltdown — not after.]]
> **Plot twist:** the evening fussiness I kept "fixing" with extra feeds? Not hunger. A missed window by ten minutes. Once I trusted the clock on the window instead of the cry, the witching hour got a lot quieter.
Use these as a starting point, then adjust to *your* baby — some run short, some long. Pair this with our [newborn sleep schedule guide](/mamabee/articles/newborn-sleep-schedule).
[[CTA|Get nap-time predictions →]]
*Not medical advice — a guide, not a rulebook.*`),

  A('tummy-time-guide',
    "Tummy Time: How Much, When to Start, and Why It's Worth the Tears",
    'How much tummy time a baby needs by age, when to start, and easy ways to survive the tears — plus why small daily doses beat one long battle.',
    ['milestones', 'tummy time', 'development'],
`The first time I put my daughter on her tummy she looked at me like I'd personally betrayed her, screamed for ninety seconds, and I gave up. If you've felt that "is this even worth it?" flicker — yes, but not the way I first thought.
### How much, by age
- **Newborn:** 1–2 min, a few times a day (chest-to-chest counts!)
- **1–2 mo:** build toward 10–15 min total/day
- **3–4 mo:** ~20–30 min total/day, in chunks
[[CTA|Get MamaBee|Log little bursts of tummy time so the minutes add up — and you can see the habit build instead of guessing.]]
> **Plot twist:** tummy time isn't really about strength — it's about preventing a flat spot and setting up rolling, sitting, and crawling. And it works in *tiny* doses. Three minutes, six times a day beats one thirty-minute crying marathon.
### Make it easier
- Get down on the floor at their eye level
- A mirror or high-contrast toy
- Right after a nap, before a feed (not on a full tummy)
[[CTA|Track milestones →]]
*Not medical advice — always supervise tummy time.*`),

  A('newborn-gas-relief',
    'Why Is My Newborn So Gassy? Relief That Actually Works',
    'Why newborns get so gassy and the moves that actually bring relief — plus the surprising feeding habit that was the real culprit for us.',
    ['health', 'gas', 'colic', 'newborn'],
`2 AM. Grunting, red face, little legs pulling up to the belly, then a wail. If you've spent a night bicycling a newborn's legs like you're prepping for the Tour de France — hi, me too.
Newborn guts are brand new and still learning. Gas is incredibly common, and rarely serious. But it's miserable, so let's get to relief.
### What actually helps
- **Burp often** — mid-feed and after
- **Bicycle legs** and gentle tummy massage
- **Keep them upright** 15–20 min after eating
- **Check the latch/nipple flow** — fast flow = more swallowed air
[[CTA|Get MamaBee|Logging feeds next to fussy spells helped me spot the trigger instead of blaming everything at random.]]
> **Plot twist:** I was convinced it was the formula. I switched brands twice. The real culprit? She was eating too *fast* and gulping air. Slower feeds and more burp breaks fixed what no formula change could — and I only saw it because the log lined the feeds up against the fuss.
If gas comes with fever, blood in stool, or poor weight gain, call your doctor — that's beyond ordinary gas.
[[CTA|Spot your baby's triggers →]]
*Not medical advice — check with your pediatrician for persistent symptoms.*`),

  A('cluster-feeding',
    'Cluster Feeding: Is My Baby Actually Getting Enough?',
    'Cluster feeding explained: why your baby wants to eat non-stop in the evenings, whether it means low supply, and how to get through the marathon.',
    ['feeding', 'cluster feeding', 'breastfeeding'],
`She ate. Twenty minutes later, she wanted to eat again. And again. It was 6 PM, I was touched-out and starving, and the panic crept in: *she's still hungry — I'm not making enough.*
That's cluster feeding, and almost every parent hits it — classically in the evenings and during growth spurts.
### What it looks like
- Lots of short feeds bunched close together
- Usually late afternoon / evening
- Fussy between feeds, but calm while feeding
[[CTA|Get MamaBee|Seeing the feeds logged made it obvious: this was a predictable evening cluster, not an all-day emergency.]]
> **Plot twist:** cluster feeding usually isn't a sign of *low* supply — it's how your baby *builds* your supply. That relentless evening demand is literally placing tomorrow's order. It's working, not failing.
### Surviving the cluster hours
- Set up a station: water, snacks, phone charger, remote
- Tag-team with a partner between feeds
- Remember it's a phase, not your new forever
Still worried about intake? Check the diaper math in [how much should a newborn eat](/mamabee/articles/how-much-should-a-newborn-eat).
[[CTA|Track feeds & see the pattern →]]
*Not medical advice — see a lactation consultant or doctor with supply concerns.*`),

  A('3am-question-mamabee-ai-tracker',
    'The 3 AM Question Every Parent Googles — and How MamaBee Answers It',
    "Every parent Googles the same thing at 3 AM. Here's how MamaBee's calm AI answers it — with gentle insights, one-thumb logging, and your data kept private.",
    ['ai baby tracker', 'mamabee', 'app'],
`There's one question the whole internet gets asked at 3 AM by exhausted parents who can't remember their own name, let alone the last feed: *"When did she last eat — and is this normal?"*
You can't Google your way to that answer. It's *your* baby, tonight. That gap is exactly what MamaBee was built to close.
### One-thumb logging
Because you're always holding a baby with the other arm. Feeds, sleep, diapers — a tap each, no typing, works in the dark.
### Gentle AI insights
Not a wall of charts. One calm, human line: when the next nap is likely, whether today tracks with the last few days, a pattern worth knowing. Insight, not homework.
[[CTA|Get MamaBee — free|The calm, AI-powered baby tracker. One-thumb logging, gentle 3 AM insights, and your data always stays yours.]]
### Your data stays yours
Your baby's life isn't a product. MamaBee keeps your data private — no selling, no creepy ad targeting.
> **Plot twist:** the feature that actually changed my nights wasn't a chart or an alarm. It was the morning MamaBee gently showed me she was feeding and sleeping right on track — and I realized the thing that needed reassurance wasn't the baby. It was me. Sometimes the most useful thing an app can tell you is *you're doing better than you feel.*
### Check these three things each morning
- Total feeds & sleep vs. the last few days
- The next predicted nap window
- Any gentle insight MamaBee flagged overnight
[[CTA|Meet MamaBee →]]`),
]

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('Missing SANITY_WRITE_TOKEN env var.')
  process.exit(1)
}

const now = new Date().toISOString()
let n = 0
for (const a of articles) {
  const doc = {
    _id: `drafts.mamabee-${a.slug}`,
    _type: 'article',
    brand: 'mamabee',
    title: a.title,
    slug: {_type: 'slug', current: a.slug},
    description: a.description,
    author: 'Realm Labs',
    tags: a.tags,
    publishedAt: now,
    body: md(a.body),
  }
  await client.createOrReplace(doc)
  console.log(`✓ draft: ${a.slug}`)
  n++
}
console.log(`\nDone — ${n} MamaBee drafts created. Open /studio to review & Publish.`)
