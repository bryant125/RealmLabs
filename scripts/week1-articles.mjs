// Creates Week-1 MamaBee article batch as DRAFTS. Run once, then attach covers + publish.
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
function md(src){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
const A=(slug,title,description,tags,body)=>({slug,title,description,tags,body})

const articles = [
  A('baby-milestones-by-month',
    'Baby Milestones Month by Month: What to Expect in the First Year (and When Not to Worry)',
    'A month-by-month baby milestones guide for the first year — motor, social, and language milestones — plus the red flags worth mentioning to your pediatrician. Ranges, not deadlines.',
    ['baby milestones by month', 'baby development', 'first year milestones', 'infant development'],
`The first year is a blur of tiny, enormous firsts — the first real smile, the first roll, the first wobbly step. And somewhere between the wonder, most of us end up Googling *"is my baby on track?"* at midnight. If that's you, breathe: this is a friendly, month-by-month map of **baby milestones**, written by a parent who did all the same anxious counting.
The single most important thing to know up front? **Milestones are ranges, not deadlines.** Your baby is on their own timeline, and "normal" is a wide, generous window.
## Milestones are ranges, not a race
Every milestone has a broad normal window. One baby crawls at 6 months; another skips crawling entirely and cruises at 9 months. Both are completely fine. Comparing your baby to the internet (or to your friend's baby) is a fast track to unnecessary worry. Use this guide as a gentle map, not a scorecard.
There are four broad types of milestones to watch: **motor** (moving), **social/emotional** (connecting), **language** (communicating), and **cognitive** (thinking and problem-solving).
## 0–3 months: the fourth trimester
Your newborn is adjusting to the world. In these weeks, look for:
- Lifting their head briefly during [tummy time](/mamabee/articles/tummy-time-guide)
- That first **social smile** (around 6–8 weeks — pure magic)
- Following objects and faces with their eyes
- Cooing and making early vowel sounds
- Startling at loud noises (the Moro reflex)
## 4–6 months: waking up to the world
This is a fun stretch as your baby becomes far more interactive:
- **Rolling over** (often tummy-to-back first)
- Pushing up on hands during tummy time
- Reaching for and grabbing toys, bringing them to the mouth
- Laughing out loud and babbling ("ba," "ga")
- Recognizing familiar faces and showing clear preferences
## 7–9 months: on the move
Mobility and personality really take off:
- **Sitting without support**
- Starting to crawl, scoot, or bum-shuffle
- Passing objects between hands, using a raking grasp
- Responding to their own name
- **Separation anxiety** and stranger wariness (a normal sign of healthy attachment)
- Babbling strings like "mama" and "dada" (not always with meaning yet)
[[CTA||Log milestones, feeds, and sleep in one calm place — and watch your baby's first year unfold.]]
## 10–12 months: almost a toddler
The finale of an incredible year:
- **Pulling to stand** and **cruising** along furniture
- Maybe those **first independent steps** (though many babies walk after 12 months — totally normal)
- Developing a **pincer grasp** (thumb and finger) to pick up tiny things
- Waving "bye-bye," clapping, pointing
- Saying a first word or two with meaning
- Understanding simple requests ("give me the ball")
## When to talk to your pediatrician
Milestones are flexible, but a few signs are worth mentioning at a check-up — not to alarm you, just because early support helps most when it starts early:
- Not smiling socially by around 3 months
- Not holding head up or pushing up by 4 months
- Not reaching for objects by around 5 months
- Not sitting with help by 9 months
- Losing skills they previously had (this one always warrants a call)
- Not babbling or gesturing by 12 months
You know your baby best. If your gut says something's off, a conversation with your pediatrician is always worth it — never a silly question.
## How tracking milestones actually helps
Here's the quiet benefit of logging milestones as they happen: you get a real record instead of a foggy memory. At your baby's check-ups, your pediatrician will ask what your baby is doing — and "um, I think she rolled last week?" becomes a precise, confident answer. Plus, watching the log fill up over the year is its own kind of joy.
## Frequently asked questions
### At what age should a baby start walking?
Most babies take their first independent steps between **9 and 15 months**, with many walking around their first birthday. Walking later within that range is completely normal — some perfectly healthy babies walk closer to 16–17 months.
### Do premature babies hit milestones later?
Often, yes. For preemies, pediatricians usually track milestones by **adjusted age** (based on the due date, not the birth date) for roughly the first two years. Ask your pediatrician about your baby's adjusted timeline.
### Should I be worried if my baby skips crawling?
Usually not. Crawling isn't actually a required milestone — plenty of babies scoot, roll, or bum-shuffle and go straight to cruising and walking. What matters is that your baby is finding *some* way to move and explore.
## The takeaway
Your baby's first year is a series of ranges, not a race against a checklist. Watch for the big categories — moving, connecting, communicating, thinking — celebrate each first, and trust that your baby is writing their own timeline. Track the moments so you remember them (and can share them at check-ups), and lean on your pediatrician for anything that gives you pause. Enjoy it — it goes fast.
[[CTA||Capture every first — get MamaBee free and track your baby's milestones, feeds, and sleep.]]
*This article is general information, not medical advice. Talk to your pediatrician about your baby's development.*`),

  A('how-to-swaddle-a-baby',
    'How to Swaddle a Baby: A Step-by-Step Guide to Safe, Snug Sleep',
    'Learn how to swaddle a baby step by step, why swaddling calms newborns, the safe-swaddling rules (hips, back-sleeping, when to stop), and easy fixes when your baby breaks free.',
    ['how to swaddle a baby', 'swaddling', 'newborn sleep', 'safe swaddle', 'baby sleep'],
`There's a reason nurses swaddle newborns into those perfect little burritos — a good swaddle can turn a startled, flailing baby into a calm, sleepy one in seconds. But the first time you try it at home with a wriggly newborn and a flat square of fabric, it can feel impossible. I fumbled it for a week before it clicked.
Here's a clear, no-stress guide on **how to swaddle a baby**: why it works, a simple step-by-step, the safety rules that actually matter, when to stop, and what to do when your little escape artist keeps breaking free.
## Why swaddling helps newborns sleep
Newborns come with a built-in **startle (Moro) reflex** — those sudden arm-flings that jolt them awake just as they're drifting off. Swaddling gently contains that reflex, recreating the snug, secure feeling of the womb. The result is often a calmer baby who sleeps longer and settles more easily. It's one of the classic "5 S's" of soothing for good reason.
## How to swaddle a baby, step by step
You just need a thin, breathable square blanket (a large muslin works great):
1. **Make a diamond, fold the top corner down.** Lay the blanket in a diamond shape and fold the top corner down a few inches to make a straight edge.
2. **Place baby on top.** Lay your baby face-up with their **shoulders just below** the folded edge.
3. **Wrap the first side.** Gently hold one arm down against their side, take the blanket corner on that same side, and wrap it snugly across their body, tucking it underneath the opposite side.
4. **Fold up the bottom.** Bring the bottom corner up over their feet — but leave **plenty of room for the legs and hips to bend and move** (more on this below).
5. **Wrap the second side.** Hold the other arm down, take the remaining corner, and wrap it across, tucking it around the back.
You want it **snug around the arms and chest, but loose around the hips.** Snug enough that it won't come undone, but you can still slide two or three fingers between the blanket and your baby's chest.
[[CTA||Track which nights the swaddle helped your baby sleep longer — MamaBee makes the pattern obvious.]]
## Safe swaddling: the rules that matter most
Swaddling is safe when you follow a few key rules:
- **Always place a swaddled baby on their back to sleep.** Never on the side or tummy.
- **Leave room at the hips.** Legs should be able to bend up and out. A too-tight, straight-legged wrap can affect hip development (hip dysplasia). Loose at the hips, snug at the arms.
- **Never swaddle too tightly around the chest.** You should be able to fit a couple of fingers under the fabric so breathing isn't restricted.
- **Don't let baby overheat.** Use a thin, breathable fabric, dress lightly underneath, and keep the room comfortable.
- **Keep the face clear.** The swaddle should stay well below the chin with no loose fabric near the face.
## When to stop swaddling
This is the big one: **stop swaddling as soon as your baby shows any signs of rolling over** — usually somewhere around **2 to 4 months**. A swaddled baby who rolls onto their tummy can't push up or turn their head freely, which is a serious safety risk. The moment you see rolling attempts, it's time to transition out.
## Easy fixes when baby breaks free (and transitioning out)
If your little Houdini keeps escaping, or it's time to move on:
- **Try a zip or velcro swaddle sack** — far easier than a blanket and harder to wriggle out of.
- **Transition to a sleep sack** (a wearable blanket with arms free) once rolling starts — it keeps the cozy feeling without restricting the arms.
- **Go one arm out, then both** if your baby protests the change, to ease the transition over a few nights.
For more on the sleep stage this all fits into, see our [newborn sleep schedule guide](/mamabee/articles/newborn-sleep-schedule) and [wake windows by age](/mamabee/articles/wake-windows-by-age).
## Frequently asked questions
### How tight should a swaddle be?
Snug around the arms and chest so it won't unravel, but loose at the hips so the legs can bend freely. You should be able to slip two or three fingers between the swaddle and your baby's chest.
### Can you swaddle a baby with their arms out?
Yes — many babies sleep well with one or both arms out, especially as they get a little older or are transitioning out of the swaddle. Arms-out can be a helpful middle step before moving fully to a sleep sack.
### When should I stop swaddling my baby?
Stop as soon as your baby starts trying to roll over, typically around 2–4 months. Once rolling begins, switch to an arms-free sleep sack for safety.
## The takeaway
A good swaddle is one of the simplest newborn superpowers — snug arms, loose hips, always on the back, and stop the moment rolling starts. It won't work for every baby, and that's okay, but for many it's the difference between a startled newborn and a peaceful one. Practice a few times, find the wrap (or zip-up sack) that works for you, and enjoy those cozy little-burrito naps while they last.
[[CTA||Get MamaBee free and track your baby's sleep, swaddle nights and all.]]
*This article is general information, not medical advice. Follow safe-sleep guidance and ask your pediatrician with any concerns.*`),

  A('baby-growth-spurts',
    'Baby Growth Spurts: Ages, Signs, and How to Survive the Hungry Days',
    'A parent-friendly guide to baby growth spurts: the common ages they hit, the signs to recognize, how long they last, and how to get through the hungry, fussy, sleepless days.',
    ['baby growth spurts', 'growth spurt baby', 'newborn feeding', 'cluster feeding', 'baby development'],
`One day your baby is in a lovely rhythm. The next, they want to eat *constantly*, they're fussy for no reason, and they've decided sleep is optional. If you're suddenly wondering what happened to your content little baby — you're very likely in the middle of a **growth spurt**.
The good news: growth spurts are completely normal, temporary, and a sign your baby is doing exactly what they're supposed to — growing. Here's what to expect, when they typically hit, how to recognize the signs, and how to survive the hungry, sleepless days with your sanity mostly intact.
## What is a baby growth spurt?
A growth spurt is a short period when your baby grows rapidly — in weight, length, and brain development — over just a few days. To fuel that growth, they need more calories, which is why the hallmark of a growth spurt is a baby who suddenly wants to feed *a lot* more than usual. Their body is placing a bigger order, and they're determined to fill it.
## When do baby growth spurts happen?
Every baby is different, but growth spurts commonly cluster around these ages:
- **Around 1–3 weeks**
- **Around 6 weeks**
- **Around 3 months**
- **Around 6 months**
- **Around 9 months**
These are typical windows, not a fixed schedule — your baby may spurt earlier, later, or on their own pattern entirely. Don't watch the calendar too closely; watch your baby.
## Signs your baby is having a growth spurt
The classic signs tend to show up together:
- **Increased hunger** — wanting to feed far more often, sometimes in [cluster-feeding](/mamabee/articles/cluster-feeding) bursts
- **Fussiness and clinginess** — extra cranky, wanting to be held constantly
- **Changes in sleep** — either sleeping *more* than usual, or waking more often at night
- **Seeming unsatisfied** after feeds that used to be plenty
- A brief return to newborn-like neediness even in an older baby
## How long do growth spurts last?
Blessedly short — usually just **2 to 3 days**, sometimes up to a week. It can feel much longer in the moment (especially at 3 AM), but growth spurts pass quickly. If the "hungry all the time" pattern lasts more than a week or so, it may be something else worth checking with your pediatrician.
## How to survive a growth spurt
### Feed on demand — trust your baby
The most important thing: **follow your baby's hunger cues and feed on demand.** If you're breastfeeding, all that extra nursing tells your body to make more milk to meet the new demand — supply catches up within a day or two. If you're formula feeding, simply offer more when your baby is clearly still hungry. You're not "spoiling" them or overfeeding; you're fueling growth. (For amounts and cues, see [how much a newborn should eat](/mamabee/articles/how-much-should-a-newborn-eat).)
[[CTA||Track the sudden feeding surge and see the spurt for what it is — a phase, not an emergency.]]
### Take care of yourself, too
Growth spurts are draining for parents. Set up a feeding station with water and snacks, let non-essential tasks slide, tag-team night wakings with a partner, and rest whenever you can. You're doing hard, invisible work — be as gentle with yourself as you are with your baby.
### Ride out the fussiness
Extra cuddles, contact, and calm are your friends during a spurt. This isn't the moment to enforce any routine — meet your baby's need for comfort, and know the neediness is temporary.
## Growth spurts vs. something else
Because the signs overlap, it's easy to confuse a growth spurt with other things:
- **Cluster feeding** often *is* part of a growth spurt, but can also just be normal evening behavior.
- **Teething, illness, or a [sleep regression](/mamabee/articles/4-month-sleep-regression)** can cause similar fussiness — tracking feeds and symptoms helps you tell them apart.
- If your baby has a fever, isn't producing enough wet diapers, or seems truly unwell, that's not a growth spurt — call your pediatrician.
## Frequently asked questions
### How do I know if my baby is having a growth spurt or if I have low milk supply?
Growth spurts are temporary (a few days) and, if you feed on demand, your supply quickly rises to meet the demand. Low supply tends to show up as poor weight gain and too few wet diapers over time. Watch the diapers and weight — if those are on track, it's almost certainly a spurt.
### Should I give a bottle during a growth spurt if breastfeeding?
Usually not necessary — the extra nursing is exactly what builds your supply to meet the new demand. Supplementing can actually signal your body to make *less*. If you're worried, check with a lactation consultant before adding bottles.
### Do growth spurts affect sleep?
Yes. Some babies sleep more during a spurt (growth happens during sleep), while others wake more often to feed. Both are normal and temporary.
## The takeaway
Growth spurts are short, intense, and completely normal — your baby is literally growing before your eyes. Feed on demand, lower your expectations for a few days, lean on your support system, and track the surge so you can see it's a passing phase rather than a problem. In a few days, your content little baby will be back — just a bit bigger.
[[CTA||Get MamaBee free and track feeds, sleep, and growth — so every spurt makes sense.]]
*This article is general information, not medical advice. Contact your pediatrician with concerns about feeding, weight, or your baby's health.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  console.log(`✓ draft: ${a.slug} (~${w} words)`)
}
console.log('\nDone.')
