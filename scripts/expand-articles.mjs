// Adds depth to the 9 shorter drafts to clear 1000+ words. Inserts new sections
// right before each article's "Frequently asked questions" block. Idempotent-ish:
// re-running will insert again, so run once. Run: SANITY_WRITE_TOKEN=xxx node scripts/expand-articles.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'

const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const k = () => randomUUID().slice(0, 8)
function inline(text) {
  const children = [], markDefs = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0, m
  const push = (t, marks = []) => { if (t) children.push({_type: 'span', _key: k(), text: t, marks}) }
  while ((m = re.exec(text))) { push(text.slice(last, m.index))
    if (m[1] !== undefined) push(m[1], ['strong'])
    else { const key = 'l' + markDefs.length; if (m[3] === 'APP') markDefs.push({_key: key, _type: 'appLink'}); else markDefs.push({_key: key, _type: 'link', href: m[3]}); push(m[2], [key]) }
    last = m.index + m[0].length }
  push(text.slice(last)); return {children, markDefs}
}
const block = (style, text, extra = {}) => { const {children, markDefs} = inline(text); return {_type: 'block', _key: k(), style, markDefs, children, ...extra} }
function md(src) {
  const out = []
  for (const raw of src.split('\n')) { const line = raw.trim(); if (!line) continue
    if (line.startsWith('## ')) out.push(block('h2', line.slice(3)))
    else if (line.startsWith('### ')) out.push(block('h3', line.slice(4)))
    else if (line.startsWith('> ')) out.push(block('blockquote', line.slice(2)))
    else if (line.startsWith('- ')) out.push(block('normal', line.slice(2), {listItem: 'bullet', level: 1}))
    else out.push(block('normal', line)) }
  return out
}

const extra = {
  'how-much-should-a-newborn-eat': `## Growth spurts: when feeding suddenly ramps up
Just when you think you've found a rhythm, your baby will want to eat *constantly* for a day or two. These are **growth spurts**, and they commonly land around 2–3 weeks, 6 weeks, and 3 months. During a spurt, feed on demand — the extra nursing tells your body to make more milk, and formula-fed babies simply take a bit more. It usually passes within a few days, so ride it out and keep offering.
## Paced bottle feeding (if you use bottles)
If you bottle-feed, try **paced bottle feeding**: hold the bottle closer to horizontal, let your baby pause, and switch sides partway through like you would when nursing. Pacing slows the flow, cuts down swallowed air, and gives your baby time to feel full — which means less gas, less spit-up, and less overfeeding.
## Trust your baby's appetite
One of the kindest shifts you can make is to stop treating feeds as targets to hit. Babies are remarkably good at self-regulating when we follow their cues. Some feeds are full meals, some are snacks, and both are perfectly normal. Your job isn't to force an exact number of ounces — it's to offer the feed, watch your baby, and respond to what they tell you.`,

  'baby-poop-color-chart': `## How often should a baby poop?
Frequency varies wildly and still be normal. **Breastfed babies** may poop after nearly every feed in the early weeks, then — often around 6 weeks — drop to once every few days as their gut matures (that's fine, as long as stools stay soft). **Formula-fed babies** tend to be more regular, usually at least once a day. What matters most is a soft, easy-to-pass stool, not a specific number.
## Constipation vs. normal straining
Newborns grunt, strain, and go red in the face for almost everything — that alone isn't constipation. **True constipation** means hard, dry, pebble-like stools that are painful to pass. If that happens (especially after starting formula or solids later on), mention it to your pediatrician; for young babies, never use laxatives or remedies without medical advice.
## Diarrhea and dehydration
Very watery, frequent, explosive stools — especially with fever, vomiting, or fewer wet diapers — can point to a stomach bug and the risk of dehydration, which is the real concern in babies. Call your pediatrician if diarrhea won't stop or your baby shows fewer wet diapers, a dry mouth, or unusual sleepiness.
## Why a diaper log actually helps
Because "normal" is a moving target in the first months, a quick diaper log turns vague worry into useful facts. Instead of "I think it's been a while?" you'll know exactly how long, what it looked like, and whether today is a real change — the kind of concrete info your pediatrician can actually use.`,

  '4-month-sleep-regression': `## How to help your baby link sleep cycles
The whole regression comes down to one new skill: connecting one sleep cycle to the next without fully waking. You can gently support it. Give a little pause when your baby stirs before rushing in — sometimes they resettle on their own. Offer chances to fall asleep **drowsy but awake** so falling back asleep feels familiar. And keep the sleep environment consistent (dark, cool, a bit of white noise) so waking mid-cycle isn't jarring.
## Should you sleep train during the 4-month regression?
You don't have to. Some families choose a gentle sleep-training approach around this age; many simply ride it out with extra support and time. There's no single right answer — only what fits your baby and your family. If you do want to try a method, four months is often cited as an early starting point, but check with your pediatrician first.
## What about naps?
Naps often get *messier* during the regression before they get better, with short "cat naps" that end after one cycle. Protect age-appropriate [wake windows](/mamabee/articles/wake-windows-by-age), watch for sleepy cues, and don't stress about perfect naps — nighttime sleep usually consolidates first. This is also when many babies begin shifting toward a more predictable nap pattern, so it's a transition, not just a setback.
## Take care of yourself, too
This stretch is genuinely hard on parents. Tag-team night wakings with a partner, nap when you can, lower every non-baby expectation, and remember it's temporary. A rested-enough parent handles a rough night far better than an exhausted one — looking after you *is* looking after your baby.`,

  'day-with-mamabee-baby-tracker': `## Evening: building a routine from your data
By evening, the day's logs turn into something genuinely useful: a picture of what actually happened. That's how we found our bath-then-longer-sleep pattern — and it's how you'll spot your own. Over a week, little truths surface: which wake window fits your baby, when the fussy stretch reliably hits, whether that late nap is stealing bedtime. You stop guessing and start gently adjusting based on real evidence.
## One source of truth for both parents
Newborn care is a team sport, and nothing frays a tired team faster than "wait, did *you* already feed her?" With MamaBee, both parents (and grandparents or a nanny) see the **same up-to-date log**, so the handoff is seamless. No more comparing notes at 3 AM or double-feeding by accident — everyone's on the same page, literally.
## It grows with your baby
The newborn fog doesn't last forever, but tracking stays useful well beyond it. As feeds space out and naps consolidate, MamaBee shifts with you — tracking solids when you start them, watching milestones, and keeping the big-picture history your pediatrician loves to see at check-ups. It's not just a newborn crutch; it's a calm record of your baby's whole first chapter.
## Made for real, tired parents
Everything here comes back to one design principle: new-parent life is hard enough. The app should ask for a single thumb, hand back a little reassurance, and otherwise get out of your way. That's the whole promise — made with honey, by parents who remember exactly how it felt.`,

  'wake-windows-by-age': `## Sample daily rhythms by age
Wake windows turn into a loose daily shape as your baby grows. A few realistic examples (yours will vary):
- **Newborn (many naps):** feed → 45 min awake → nap → repeat, all day and night.
- **4 months (3–4 naps):** ~2 hour windows, with naps spaced through the day and an earlier bedtime.
- **6 months (2–3 naps):** ~2.5 hour windows, often settling toward a morning and afternoon nap.
- **9–12 months (2 naps):** ~3 hour windows, a fairly predictable two-nap day, then eventually one.
Notice the pattern: as windows lengthen, the number of naps naturally drops.
## Wake windows and better nights
Wake windows aren't just about naps — they protect night sleep too. An overtired baby (from windows that ran long all day) actually sleeps *worse* at night, with more wakings. Getting daytime timing right, plus an appropriate final wake window before bed, is one of the biggest levers for a smoother night. Bedtime that's a touch earlier often beats one that's too late.
## Every baby is a little different
Treat the chart as a starting line, not a finish line. Some babies are "sleepy" types who need shorter windows; others are "alert" types who can stretch a bit longer. Watch how your baby does after each window and adjust by 10–15 minutes at a time. The right window is the one that gets you easy sleep and a happy, rested baby — and tracking makes that sweet spot obvious over a few days.`,

  'tummy-time-guide': `## Tummy time positions to try
"On the floor" isn't the only option — variety keeps it interesting and builds different muscles:
- **Chest-to-chest:** recline back with baby on your chest — the gentlest start.
- **Tummy-to-tummy:** lie on your back with baby on your belly, face to face.
- **Lap soothe:** lay baby tummy-down across your lap for short, calming sessions.
- **Football hold:** carry baby tummy-down along your forearm.
- **Floor with a boppy or rolled towel** under the chest for a supported lift.
## Rough tummy-time milestones
Every baby is different, but as a guide: by **1–2 months**, many babies briefly lift their head; by **3–4 months**, they push up on forearms and hold their head steady; by **5–6 months**, many push up on their hands and start to roll. These are ranges, not deadlines — if you have concerns about your baby's head control or movement, ask your pediatrician.
## What if my baby has reflux?
For spitty or refluxy babies, timing is everything. Do tummy time **before** a feed, or wait at least 20–30 minutes **after**, so a full tummy doesn't make things worse. Keep sessions short and stop if your baby seems genuinely uncomfortable rather than just protesting the position.
## Turn it into connection, not a chore
The best tummy-time "tool" is you. Get down at eye level, narrate, sing, make faces, celebrate every head lift. When tummy time becomes play and connection instead of a task on a checklist, both of you start to enjoy it — and the minutes add up almost without trying.`,

  'newborn-gas-relief': `## Feeding position makes a big difference
How you feed shapes how much air goes in. Keep your baby's **head higher than their tummy** during feeds, get a deep latch if nursing, and tip bottles just enough to keep the nipple full (no air in the tip). After the feed, that upright hold isn't optional — it's one of the most effective gas-preventers there is.
## Could it be something in my diet? (breastfeeding)
Most breastfed babies aren't bothered by what mom eats, so you usually don't need to cut foods out. Occasionally a baby reacts to something specific (dairy is the most common culprit). If you strongly suspect a pattern, don't guess in the dark — talk to your pediatrician before eliminating foods, and track feeds against fussy spells so you have real data to share.
## Gas, reflux, or colic — how to tell them apart
It's easy to lump every fuss together, but they differ:
- **Gas:** grunting, pulling legs up, relief after burping or passing gas.
- **Reflux:** frequent spit-up, arching, discomfort during or after feeds.
- **Colic:** intense, inconsolable crying for hours, often same time each day, with no obvious cause.
Knowing which you're dealing with points you to the right fix — and tracking symptoms helps you and your pediatrician see the real pattern.
## Be patient with a brand-new gut
Here's the reassuring bottom line: newborn gas is mostly a maturity thing. Their digestive system is days or weeks old and still learning. As the weeks pass, the grunting, straining nights almost always ease on their own. Your soothing helps in the moment — and time does the rest.`,

  'cluster-feeding': `## Cluster feeding vs. an actual feeding problem
It helps to know the difference. **Normal cluster feeding**: frequent feeds bunched in the evening, a baby who's fussy between but feeds well, with normal diapers and weight gain. **Worth a check**: a baby who seems hungry *all day* every day, isn't gaining, has too few wet diapers, or is hard to rouse. The first is a phase to ride out; the second deserves a call to your pediatrician or lactation consultant.
## It's exhausting — and that's normal too
Nobody warns you how *physically* draining the cluster hours are. Being "touched out," starving, and pinned to the couch for a whole evening is real. That doesn't mean anything is wrong with you or your baby — it means you're doing an intense, invisible job. Naming it helps: this is hard, it's temporary, and needing support doesn't make you any less capable.
## How partners can help during cluster feeds
Cluster feeding is a team event, even when only one person can nurse. A partner can handle everything *around* the feed: bringing water and snacks, burping and settling between feeds, changing diapers, and taking the baby for a walk so the feeding parent can breathe. That support is often what makes the witching hours survivable.
## The reassuring big picture
Cluster feeding is one of those newborn phases that feels enormous in the moment and tiny in the rearview mirror. It's your baby doing exactly what they're designed to do — building your supply, fueling growth, and seeking comfort. Trust the process, watch the diapers, lean on your people, and know it passes.`,

  '3am-question-mamabee-ai-tracker': `## Why generic advice fails at 3 AM
Search results give you *averages* — what a "typical" baby does. But at 3 AM you don't have a typical baby; you have **your** baby, with their own pattern. That's the gap MamaBee fills. By turning your own logs into insight, it answers the question the internet can't: is *this*, for *my* baby, on track? Personal beats generic every single time when you're the one awake at 3 AM.
## Confidence is the real product
New parenthood is a crash course in second-guessing yourself. The quiet gift of tracking is **confidence** — the calm that comes from actually knowing your baby fed well, slept enough, and had a normal day. When the data reassures you, the 3 AM spiral loses its grip. Sometimes the most valuable thing isn't fixing a problem; it's realizing there wasn't one.
## Built for the whole family
Babies aren't raised by one person alone. MamaBee keeps every caregiver — both parents, a grandparent, a nanny — looking at the same shared log, so handoffs are seamless and nobody's guessing what happened on the last shift. One calm source of truth, shared by the people who love your baby most.
## A calmer first chapter
In the end, MamaBee isn't really about data — it's about giving exhausted parents a little breathing room. Log in a tap, get one useful nudge, keep your information private, and let the app carry the mental load so you can be present for the part that matters. That's the whole idea: a calmer first chapter, made with honey, by parents who get it.`,
}

for (const [slug, mdText] of Object.entries(extra)) {
  const id = `drafts.mamabee-${slug}`
  const doc = await client.getDocument(id)
  if (!doc || !Array.isArray(doc.body)) { console.log(`- skip ${slug} (not found)`); continue }
  const faqIdx = doc.body.findIndex((b) => b._type === 'block' && b.style === 'h2' && (b.children || []).some((s) => (s.text || '').trim() === 'Frequently asked questions'))
  const insertAt = faqIdx === -1 ? doc.body.length : faqIdx
  const newBody = [...doc.body.slice(0, insertAt), ...md(mdText), ...doc.body.slice(insertAt)]
  await client.patch(id).set({body: newBody}).commit()
  let w = 0; for (const b of newBody) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  console.log(`✓ expanded ${slug} → ${w} words`)
}
console.log('\nDone.')
