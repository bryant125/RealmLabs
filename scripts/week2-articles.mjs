// Week-2 MamaBee batch as DRAFTS. Run once, then attach covers + publish.
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
  A('baby-bedtime-routine',
    'How to Build a Baby Bedtime Routine That Actually Works (Step by Step)',
    'A simple, step-by-step baby bedtime routine that actually works — why routines help babies sleep, what to include, when to start, and how to keep it calm at every age.',
    ['baby bedtime routine', 'baby sleep routine', 'newborn bedtime', 'baby sleep', 'wind down'],
`For the first few weeks, our "bedtime routine" was basically: baby falls asleep mid-feed, we tiptoe to the crib, and pray. It worked until it very much didn't. The night we introduced a real, boring, predictable routine was the night bedtime stopped being a battle — and I only wish we'd started sooner.
If you're wondering how to build a **baby bedtime routine** that actually calms your little one down (instead of winding them up), this is your step-by-step guide: why routines work, exactly what to include, when to start, and how to adapt it as your baby grows.
## Why a bedtime routine works
Babies love predictability. A consistent series of calming steps, done in the same order every night, becomes a powerful signal to your baby's brain and body: *sleep is coming.* Over time, that predictable wind-down helps lower stimulation, cue the release of sleep hormones, and make falling asleep feel safe and automatic. Research consistently links a regular bedtime routine to falling asleep faster, fewer night wakings, and — bonus — calmer parents. It's one of the highest-value habits you can build.
## When should you start a bedtime routine?
You can start a gentle version from birth, though newborns won't follow a strict schedule (and shouldn't be expected to). In the early weeks, focus on the *sequence* — a few calm, consistent steps — rather than a specific clock time. Many families start a more structured, timed routine somewhere around **6 to 12 weeks**, as your baby's day-night rhythm matures. The key is consistency, not perfection.
## The step-by-step baby bedtime routine
Keep it short and repeatable — about **20 to 40 minutes**. A classic, effective order looks like this:
1. **A warm bath.** Not every night is necessary, but a bath is a great "reset" and cue that the day is ending.
2. **Massage and pajamas.** A gentle massage with lotion, then into a clean diaper and sleep clothes (or [swaddle / sleep sack](/mamabee/articles/how-to-swaddle-a-baby)).
3. **A feed.** A calm, unhurried feed — try to keep it from being the *very* last step so your baby doesn't rely on feeding to fall asleep every single time.
4. **A book or a song.** Even a newborn benefits from the soft rhythm of your voice.
5. **Dim the lights, cue words.** Lower the lights, maybe turn on white noise, and use a consistent phrase like "night night, time for sleep."
6. **Into the crib drowsy but awake.** When you can, lay your baby down before they're fully asleep so they get practice settling themselves.
That's it. The magic isn't in any single step — it's in doing the *same steps in the same order* every night.
[[CTA||Track bedtime, feeds, and night wakings in one thumb — and watch your routine start to pay off.]]
## Keep the environment sleep-friendly
Your routine works best in a room that says "sleep":
- **Dark** — blackout curtains help, especially in summer
- **Cool and comfortable** — not too warm
- **White noise** — steady, gentle sound to mask household noise
- **Boring** — no bright screens or stimulating play in the wind-down window
## Adapting the routine as your baby grows
- **Newborn:** keep it very short and flexible; follow [wake windows](/mamabee/articles/wake-windows-by-age) more than the clock.
- **3–6 months:** you can anchor bedtime to a more consistent time as naps regulate.
- **6–12 months:** the routine becomes a cherished, predictable ritual; keep it consistent even through the [4-month sleep regression](/mamabee/articles/4-month-sleep-regression) and travel.
The steps can stay nearly identical for years — that consistency is exactly what makes it powerful.
## Common bedtime routine mistakes
- **Making it too long or too stimulating.** Keep it calm and under ~40 minutes.
- **Starting too late,** when the baby is already overtired and fighting sleep.
- **Being inconsistent** — different order every night dilutes the signal.
- **Always feeding to sleep as the last step,** which can create a strong sleep association that's hard to shift later.
## Take care of yourself, too
A predictable bedtime routine isn't just good for your baby — it hands *you* your evenings back. Knowing roughly when your baby will go down lets you plan, rest, and reconnect with a partner. Protecting that wind-down is protecting your own sanity, and you deserve it.
## Frequently asked questions
### What time should a baby go to bed?
It varies by age, but as babies mature, many do well with a **relatively early bedtime — often between 6:30 and 8:00 PM.** Newborns don't have a fixed bedtime yet; follow wake windows and cues, and let a consistent time emerge over the first few months.
### How long should a baby bedtime routine be?
About **20 to 40 minutes** is the sweet spot — long enough to wind down, short enough that your baby doesn't get overtired or overstimulated waiting for sleep.
### Should the bedtime routine be the same every night?
Yes — that's the whole point. The predictability of the same steps, in the same order, is what signals sleep to your baby. Keep it consistent even when you're tired or traveling.
## The takeaway
A great baby bedtime routine isn't fancy — it's a short, calm, predictable sequence you repeat every single night: wind down, dim the lights, into the crib drowsy but awake. Start gently, keep it consistent, adapt it as your baby grows, and track how it's working. Bedtime can go from a nightly battle to the calmest part of your day. You've got this.
[[CTA||Build a calmer bedtime — get MamaBee free and track sleep, feeds, and your routine.]]
*This article is general information, not medical advice. Talk to your pediatrician about your baby's sleep.*`),

  A('newborn-witching-hour',
    'The Newborn Witching Hour: Why Your Baby Cries Every Evening (and How to Cope)',
    'Why the newborn witching hour happens, when it starts and ends, and gentle, practical ways to soothe evening fussiness — plus how to tell normal crying from something more.',
    ['witching hour baby', 'newborn evening fussiness', 'baby crying evening', 'colic', 'soothing a newborn'],
`Every evening, right around dinnertime, our sweet, calm baby transformed into a tiny, inconsolable siren. Nothing was wrong — she'd been fed, changed, cuddled — and yet the crying came like clockwork. If your evenings look like this too, welcome to the **witching hour**: exhausting, alarming, and completely normal.
Here's what's actually happening during the newborn witching hour, when it starts and (blessedly) ends, and a toolkit of gentle ways to get through it with your baby — and your nerves — intact.
## What is the witching hour?
The "witching hour" is a stretch of predictable **evening fussiness** in newborns, usually somewhere between **5 PM and 11 PM**. Despite the name, it often lasts longer than an hour. Your baby may cry, cluster feed, refuse to settle, and seem generally miserable — even though nothing is obviously wrong. It's one of the most common (and least talked-about) parts of newborn life.
## When does the witching hour start and end?
It typically begins around **2 to 3 weeks** of age, peaks around **6 weeks**, and gradually fades by about **3 to 4 months.** So while it feels endless in the moment, it really is a temporary phase with a clear finish line. Circle "3 months" on your mental calendar and hold on.
## Why does it happen?
There's no single cause — it's usually a pileup of very normal newborn things all landing at once in the evening:
- **Overtiredness.** By evening, small missed [wake windows](/mamabee/articles/wake-windows-by-age) add up, and an overtired baby cries more and settles less.
- **Overstimulation.** After a whole day of lights, sounds, and faces, a newborn's immature nervous system is simply overwhelmed and needs to discharge it — often through crying.
- **[Cluster feeding](/mamabee/articles/cluster-feeding).** Evening is prime cluster-feeding time as babies tank up and build milk supply, which looks a lot like fussiness.
- **A dip in milk supply.** Breast milk supply is naturally a little lower in the evening, which can frustrate a hungry baby.
- **Gas and digestion.** A day's worth of feeding and swallowed air can mean an uncomfortable evening tummy.
The reassuring theme: none of this means you're doing anything wrong. It's developmental, not a reflection of your parenting.
[[CTA||Track feeds and fussy spells and you'll often spot the pattern behind the witching hour — MamaBee makes it visible.]]
## How to cope with the witching hour
No single trick fixes it, but stacking a few soothing tools usually helps. Think of the "5 S's":
- **Swaddle** — a snug [swaddle](/mamabee/articles/how-to-swaddle-a-baby) contains the startle reflex and calms many babies.
- **Side/stomach hold** (in your arms, never for sleep) — the "colic hold" along your forearm can ease a gassy tummy.
- **Shush / white noise** — steady sound mimics the womb and masks stimulation.
- **Swing / sway** — gentle rhythmic motion is deeply soothing.
- **Suck** — feeding or a pacifier can settle an overwhelmed baby.
Other things that genuinely help:
- **Get ahead of overtiredness.** Watch wake windows all day so your baby isn't running on empty by evening.
- **Dim the lights early.** Lower stimulation before the witching hour hits.
- **Go outside or change rooms.** A shift in environment (a walk, fresh air) can reset a crying spell.
- **Tag-team.** Hand the baby to a partner and take ten minutes. A calmer parent soothes a baby better.
## It's okay to put the baby down and breathe
Here's permission you might need: if you've fed, changed, and tried everything, and the crying continues, it is completely okay to place your baby safely in their crib and step away for a few minutes to collect yourself. A crying-but-safe baby is fine for a short break, and a regulated parent is better for everyone. Never shake a baby out of frustration — walk away, breathe, and come back.
## Witching hour vs. colic
The two overlap, so it helps to know the difference. The **witching hour** is predictable evening fussiness that soothing can often (partly) ease. **Colic** is more extreme — the classic definition is crying for **more than 3 hours a day, more than 3 days a week, for 3+ weeks** — often inconsolable and not just in the evening. Colic isn't caused by anything you did, and it too fades with time, but it's worth discussing with your pediatrician for support and reassurance.
## When to call the doctor
Evening fussiness is normal, but call your pediatrician if the crying comes with: a **fever**, vomiting, poor feeding, too few wet diapers, a change in the *sound* of the cry (very high-pitched or weak), or if your gut simply tells you something is wrong. You know your baby.
## Frequently asked questions
### How long does the newborn witching hour last each night?
Often **2 to 3 hours** in the evening, though it varies. As a phase, it usually starts around 2–3 weeks, peaks near 6 weeks, and fades by 3–4 months.
### Is the witching hour a sign something is wrong?
Usually not — it's a normal developmental phase driven by overtiredness, overstimulation, and cluster feeding. It becomes worth a doctor's call only if paired with fever, feeding problems, or other warning signs.
### How do I soothe my baby during the witching hour?
Stack soothing tools: swaddle, white noise, gentle motion, feeding or a pacifier, dim lights, and fresh air. Getting ahead of overtiredness during the day helps the most.
## The takeaway
The witching hour is one of newborn life's great unspoken challenges — hours of evening crying with no obvious cause. But it's normal, it's temporary, and it's not your fault. Stack your soothing tools, protect daytime sleep, tag-team with your partner, and give yourself permission to take a breather. By around three months, those wild evenings quietly disappear — and you'll have earned every peaceful one that follows.
[[CTA||Get MamaBee free and track the fussy hours — sometimes the pattern is the answer.]]
*This article is general information, not medical advice. Contact your pediatrician with concerns about your baby's crying or health.*`),

  A('baby-first-cold',
    "Baby's First Cold: What to Do, What Helps, and When to Call the Doctor",
    "Your baby's first cold, made less scary: the symptoms to expect, safe ways to help them feel better, what NOT to give, and the warning signs that mean call the doctor.",
    ['baby first cold', 'newborn cold', 'baby congestion', 'infant cold remedies', 'baby stuffy nose'],
`The first time your baby gets a cold, it feels enormous. That tiny stuffy nose, the sad little cough, the broken sleep — and the helpless worry that you can't just give them the medicine you'd take yourself. I remember hovering over the crib at 2 AM listening to every snuffly breath. Take heart: colds are incredibly common, usually mild, and something nearly every baby gets through just fine.
Here's a calm, practical guide to your **baby's first cold**: what symptoms to expect, safe ways to help them feel better, what to avoid, and — most importantly — the warning signs that mean it's time to call the doctor.
## Why babies get so many colds
Babies have brand-new immune systems that are still learning, so catching colds is actually part of how that system gets stronger. It's normal for babies and young children to get **many colds a year** — sometimes back to back in the winter months, especially with older siblings or daycare in the mix. Frequent colds are frustrating, but they're usually a sign of a normally developing immune system, not a weak one.
## Common baby cold symptoms
A typical cold brings some mix of:
- **Stuffy or runny nose** (clear mucus that may thicken and turn yellow/green — usually still just a cold)
- **Sneezing and mild cough**
- **A low-grade fever**
- **Fussiness and disrupted sleep**
- **Reduced appetite** (a stuffy nose makes feeding harder)
- **Watery eyes**
Symptoms usually build over a couple of days, peak, and then ease over **7 to 10 days**, though a lingering cough can hang on a little longer.
## How to help your baby feel better
You can't cure a cold — it has to run its course — but you can make your baby much more comfortable:
- **Saline drops + suction.** A few saline nose drops followed by gentle suction with a bulb syringe or nasal aspirator clears congestion, especially before feeds and sleep. This is the single most helpful thing.
- **Keep feeds up.** Offer breast or bottle often in smaller amounts; staying hydrated is key. A stuffy baby may feed less at a time, so feed more frequently.
- **Humidify the air.** A cool-mist humidifier in the room can ease congestion and coughing.
- **Elevate during awake time.** Holding your baby upright can help them breathe easier (but always place them flat on their back to *sleep*).
- **Extra cuddles and rest.** Comfort and sleep are genuinely part of the medicine.
[[CTA||Track feeds, sleep, and temperature through the cold so you can spot changes and share clear info with your pediatrician.]]
## What NOT to give a baby with a cold
This part matters — some common remedies are unsafe for infants:
- **No over-the-counter cough and cold medicines** for babies and young children — they're not recommended and can be dangerous. Never give them without explicit pediatrician guidance.
- **No honey** before **12 months** (risk of infant botulism).
- **No aspirin**, ever, for babies or children.
- **Don't give any fever medicine to a young infant without calling first** — see below.
When in doubt about *anything* you'd give, call your pediatrician before you give it.
## A note on fever in babies
Fever deserves special care in little ones:
- **Under 3 months:** a rectal temperature of **100.4°F (38°C) or higher is a medical emergency** — call your doctor or seek care **immediately**, even if your baby seems okay otherwise.
- **3–6 months and older:** call your pediatrician for guidance on any fever, and follow their advice on whether and how to treat it.
Never guess on infant fever — always check with a professional.
## When to call the doctor
Trust your instincts, and call your pediatrician (or seek urgent care) if your baby has any of these:
- Is **under 3 months** with any fever (100.4°F/38°C+)
- Is **struggling to breathe** — fast breathing, flaring nostrils, ribs pulling in, grunting, or wheezing
- Has a **bluish tint** to lips or skin (emergency)
- Is **refusing to feed** or has far fewer wet diapers (dehydration)
- Is **unusually sleepy, floppy, or hard to wake**
- Has a cough that's **getting worse** or a fever lasting more than a couple of days
- Simply seems **very unwell** — your gut counts
## Frequently asked questions
### How long does a baby's cold last?
Most baby colds last about **7 to 10 days**, with symptoms peaking around days 3–5. A mild lingering cough or runny nose can persist a bit longer, which is usually normal as long as your baby is otherwise improving.
### Can I use a humidifier for my baby's cold?
Yes — a **cool-mist humidifier** in your baby's room can ease congestion and coughing. Clean it regularly to prevent mold, and skip warm-mist versions for safety around little ones.
### When is a baby's cold an emergency?
Seek care immediately for any fever in a baby under 3 months, trouble breathing, bluish lips or skin, refusal to feed, dehydration, or extreme sleepiness. When unsure, always call — pediatric nurse lines exist for exactly this.
## The takeaway
Your baby's first cold is scary, but it's almost always a mild, normal part of growing up. Keep those little nasal passages clear with saline and suction, keep feeds and fluids up, add a humidifier, skip the OTC medicines, and give lots of cuddles. Track the symptoms so you can spot any change quickly — and never hesitate to call your pediatrician, especially with a young baby or a fever. This too shall pass, usually within a week or two, leaving behind a slightly tougher little immune system.
[[CTA||Get MamaBee free and track feeds, sleep, and symptoms — so you're ready if you need to call the doctor.]]
*This article is general information, not medical advice. For a young baby, any fever or breathing concern warrants immediate medical attention — always contact your pediatrician.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words)`)
}
console.log('\nDone.')
