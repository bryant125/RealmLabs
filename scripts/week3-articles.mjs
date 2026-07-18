// Week-3 MamaBee batch as DRAFTS. Run once, then attach covers + publish.
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
  A('when-to-start-solids',
    'When to Start Solids: Signs Your Baby Is Ready (and How to Begin)',
    'When to start solids, the readiness signs that matter more than age, safe first foods, purees vs. baby-led weaning, allergens, and how to make those messy first meals fun.',
    ['when to start solids', 'starting solids', 'baby first foods', 'baby led weaning', 'introducing solids'],
`The first time you offer your baby a spoonful of food, you'll either get a delighted grin or a full-body "how dare you" shudder — and honestly, both are normal. Starting solids is one of the big, messy, joyful milestones, and it comes with a hundred questions. When do we start? What foods? Purees or finger foods? Is my baby even ready?
Here's a calm, practical guide to **when to start solids**, the readiness signs that matter more than the calendar, safe first foods, and how to make those chaotic first meals genuinely fun.
## When should you start solids?
The current guidance is clear: **wait until around 6 months.** Most major health organizations recommend starting solids at about 6 months, and **not before 4 months**. Before then, your baby's digestive system and coordination simply aren't ready, and breast milk or formula provides everything they need.
But "6 months" is a guideline, not a magic date. What matters more is whether your individual baby is showing the **signs of readiness**.
## The real signs your baby is ready for solids
Look for these three key signs together (usually around 6 months):
- **Good head and neck control** — your baby can hold their head steady and sit upright with little or no support.
- **Loss of the tongue-thrust reflex** — they no longer automatically push food back out with their tongue.
- **Interest in food** — they watch you eat, reach for your plate, and open their mouth when food comes near.
Age alone isn't a green light — a 5-month-old chewing their fists is hungry, not necessarily ready for solids. Wait for the readiness signs.
## First foods to try
There's no single "perfect" first food. Good, simple options include:
- Iron-rich foods (important from 6 months): iron-fortified baby cereal, pureed meat, lentils, beans
- Soft vegetables: avocado, sweet potato, carrot, squash
- Fruits: banana, pear, apple (cooked/soft)
Offer one new single-ingredient food at a time, and keep textures smooth or very soft at first.
[[CTA||Track first foods, reactions, and favorites in MamaBee — so you always remember what your baby has tried (and loved).]]
## Purees vs. baby-led weaning
You'll hear about two main approaches — and you can absolutely mix them:
- **Purees (spoon-feeding):** you start with smooth purees and gradually thicken the texture. Familiar, controlled, less messy.
- **Baby-led weaning (BLW):** you skip purees and offer appropriately sized soft finger foods that baby feeds themselves. More independence, more mess, great for developing motor skills.
Neither is "better" — the best approach is the one that fits your baby and your comfort level. Many families do a bit of both.
## Foods and things to avoid
Keep these off the menu in the first year:
- **Honey** — not before 12 months (risk of infant botulism)
- **Whole nuts, popcorn, whole grapes, chunks of hard food** — choking hazards
- **Cow's milk as a main drink** — before 12 months (small amounts in food are fine)
- **Added salt and sugar** — babies don't need them
## Allergens: introduce them early
Current advice has flipped from the old "delay allergens" thinking. Now experts recommend **introducing common allergens early and regularly** (around 6 months), one at a time, including:
- Peanut (as smooth peanut butter thinned with water — never whole nuts)
- Egg (well-cooked)
- Dairy, wheat, soy, fish
Early, consistent exposure may actually help *prevent* allergies. If your baby has severe eczema or a known food allergy, talk to your pediatrician about how to introduce allergens safely.
## Gagging vs. choking (know the difference)
This one scares every new parent. **Gagging is normal and protective** — it's noisy, your baby is red-faced but making sound, and it pushes food forward. **Choking is silent** — no sound, no breathing, a look of distress. Learn the difference (an infant CPR/first-aid class is hugely reassuring), always supervise meals, and never prop-feed.
## Keep it low-pressure and fun
Early solids are about *exploring*, not filling up — "food before one is just for fun." Your baby still gets most nutrition from milk this year. Let them touch, squish, and play with food, expect a spectacular mess, and don't stress about how much actually gets eaten. Your calm, happy energy at the table matters more than a clean bib.
## Frequently asked questions
### Can I start solids at 4 months?
Most guidance says wait until around 6 months and not before 4 months — and only if your baby shows readiness signs. If you're considering starting between 4 and 6 months, check with your pediatrician first.
### How much solid food should a 6-month-old eat?
Very little at first — a few teaspoons once a day is plenty, building up gradually. Milk remains their main source of nutrition throughout the first year, so don't worry about amounts early on.
### Do I need to introduce foods one at a time?
Introducing single foods every few days makes it easier to spot any reaction, especially with allergens. Once foods are well tolerated, you can freely combine them.
## The takeaway
Start solids around 6 months, but let your baby's readiness signs — sitting up, no tongue-thrust, real interest in food — lead the way. Offer iron-rich first foods, introduce allergens early and often, skip honey and choking hazards, and keep the whole thing playful and pressure-free. Track what you try so you remember the wins. It's messy, it's joyful, and it's a milestone worth savoring. For what comes next at the table, see our [baby feeding guide](/mamabee/articles/how-much-should-a-newborn-eat).
[[CTA||Get MamaBee free and log solids, first foods, and reactions — one tap at every messy meal.]]
*This article is general information, not medical advice. Talk to your pediatrician about starting solids, especially with allergy concerns.*`),

  A('baby-teething-symptoms',
    'Baby Teething Symptoms: Signs, Timeline, and What Actually Soothes',
    'Baby teething symptoms explained: the real signs of teething, when teeth come in, what actually soothes sore gums, what NOT to use, and which symptoms are NOT teething at all.',
    ['baby teething symptoms', 'teething', 'baby teeth', 'teething remedies', 'baby fever'],
`One day your happy baby is suddenly drooling like a faucet, gnawing on everything in reach, and waking up cranky at 2 AM — and you find yourself peering into their mouth with a flashlight, hunting for a tooth. Welcome to teething: a weeks-long saga that's rarely as dramatic as the internet makes it sound, but is very real for a fussy baby (and a tired you).
Here's the straightforward guide to **baby teething symptoms**: the signs that are actually teething, when teeth arrive, what genuinely soothes sore gums, and — importantly — what to avoid.
## When do babies start teething?
Most babies get their **first tooth between 4 and 7 months**, though anywhere from 3 to 12 months is normal (a few babies are even born with a tooth). The rough order:
- **6–10 months:** bottom front teeth (central incisors) first
- **8–12 months:** top front teeth
- **9–16 months:** the side incisors
- **13–19 months:** first molars
- **16–23 months:** canines
Most children have their full set of 20 baby teeth by around age 3. Teething comes in waves — a rough few days around each tooth, then calm.
## Real baby teething symptoms
Genuine teething signs are usually mild and localized to the mouth:
- **Excessive drooling** (and sometimes a drool rash on the chin)
- **Chewing and biting** everything they can grab
- **Irritability and fussiness**, especially in the days before a tooth breaks through
- **Sore, swollen, red gums**
- **Mild disrupted sleep** and changes in appetite
- **Rubbing the cheeks or pulling at the ears** on the side a tooth is coming in
[[CTA||Track fussy spells, sleep changes, and new teeth in MamaBee — so you can tell a teething wave from something else.]]
## What is NOT teething (this matters)
Here's the myth worth busting: **teething does not cause high fever, diarrhea, vomiting, or a runny nose.** Teething can cause a very slight rise in temperature at most. If your baby has a true **fever (100.4°F/38°C or higher), diarrhea, vomiting, or cold symptoms, that's an illness — not teething** — and coincidental timing has fooled generations of parents. Don't blame concerning symptoms on teeth; call your pediatrician instead.
## What actually soothes teething
Gentle, safe relief that works:
- **Cold, not frozen.** A chilled (not frozen) teething ring, a cold spoon, or a clean cold washcloth to gnaw on.
- **Gum massage.** Rub your baby's gums with a clean finger — firm pressure feels good.
- **Something safe to chew.** A solid silicone teether they can grip.
- **Extra cuddles and patience.** Comfort goes a long way on a rough day.
- **If needed,** infant acetaminophen or ibuprofen (age-appropriate) can help — but **only with your pediatrician's guidance**, especially for young babies.
## What to avoid
Some popular "remedies" are genuinely unsafe:
- **Amber teething necklaces** — a strangulation and choking risk, with no proven benefit. Skip them.
- **Topical numbing gels with benzocaine** — not recommended for infants (safety concerns).
- **Teething tablets with belladonna** — avoid; some have been recalled.
- **Frozen-solid objects** — too hard and cold; can bruise gums.
When in doubt about any product, ask your pediatrician.
## Caring for those brand-new teeth
As soon as that first tooth appears, start gentle dental care: wipe or brush it twice a day with a soft infant brush and a tiny smear of fluoride toothpaste, and skip sugary drinks and bottles in bed. Early habits protect that hard-won smile.
## Frequently asked questions
### Can teething cause a fever?
Not a real fever. Teething may cause a very slight temperature rise, but a fever of 100.4°F (38°C) or higher is a sign of illness, not teeth — check with your pediatrician.
### How long does teething pain last?
Usually just a few days around each emerging tooth — often worst in the day or two before it breaks through the gum, then it settles until the next one.
### What can I give my baby for teething pain at night?
Cold teethers, gum massage, and comfort are first-line. For pain that's clearly disrupting sleep, ask your pediatrician about age-appropriate infant pain relief — don't use numbing gels or teething tablets.
## The takeaway
Teething is real but rarely as extreme as feared: expect drooling, chewing, and a few cranky days around each tooth. Soothe with cold (not frozen) teethers, gum massage, and cuddles — and skip amber necklaces and numbing gels. Most importantly, remember that fever, diarrhea, and cold symptoms are *not* teething, so trust your instincts and call your doctor when something's off. Track the waves and you'll spot the pattern. Pair this with tips for a calmer night in our [baby bedtime routine guide](/mamabee/articles/baby-bedtime-routine).
[[CTA||Get MamaBee free and track teething, sleep, and fussiness — so you always know what's really going on.]]
*This article is general information, not medical advice. Contact your pediatrician about fever, illness, or teething pain relief.*`),

  A('baby-nap-transitions',
    'Baby Nap Transitions: When Your Baby Drops a Nap (and How to Handle It)',
    'A clear guide to baby nap transitions: when babies drop from 4 to 3 to 2 to 1 nap, the signs they are ready, and how to smooth each transition without an overtired meltdown.',
    ['baby nap transitions', 'dropping a nap', 'baby nap schedule', 'toddler naps', 'baby sleep'],
`Just when you finally crack your baby's nap schedule, they change the rules. Suddenly they're fighting a nap that used to be easy, or waking at dawn, or melting down before bed — and you realize the old routine isn't working anymore. Chances are you've hit a **nap transition**: the bumpy but totally normal process of your baby dropping a nap as they grow.
Here's your map through it: when each nap transition typically happens, the signs your baby is actually ready, and how to smooth the change without tipping into overtired chaos.
## What is a nap transition?
A nap transition is when your baby moves from one number of naps to fewer — because as they grow, their **wake windows lengthen** and they can handle more awake time between sleeps. Each transition means reshuffling the day, and there's usually a messy in-between period where some days need the old number of naps and some need the new one. That inconsistency is normal.
## The typical nap-transition timeline
Every baby is different, but here's the rough roadmap:
- **4 → 3 naps:** around **3–4 months**
- **3 → 2 naps:** around **6–9 months**
- **2 → 1 nap:** around **13–18 months** (this is the big one that lasts into toddlerhood)
- **1 → 0 naps:** around **3–4 years**
Notice the ages are wide ranges — a baby who drops to two naps at 6 months isn't "ahead" of one who does it at 9 months. Watch the signs, not the calendar.
## Signs your baby is ready to drop a nap
Look for a *consistent pattern* (not just one odd day) of these:
- **Fighting a nap** that used to happen easily — taking a long time to fall asleep, or refusing it
- **Taking much shorter naps** than usual
- **Early morning wake-ups** or waking at night for no clear reason
- **Bedtime battles** — not tired enough at the usual bedtime because of too much day sleep
- Being **happy and not overtired** despite less total sleep
One-off bad nap days happen (teething, travel, a [sleep regression](/mamabee/articles/4-month-sleep-regression)). Wait for a pattern of 1–2 weeks before dropping a nap for good.
[[CTA||Track naps and wake windows in MamaBee — the patterns make it obvious when it's time to drop a nap.]]
## How to handle a nap transition smoothly
### Lengthen wake windows gradually
As you drop a nap, your baby needs longer [wake windows](/mamabee/articles/wake-windows-by-age) between the remaining sleeps. Stretch them slowly — by 15–30 minutes every few days — rather than all at once.
### Use an earlier bedtime as a bridge
On days the transition leaves your baby short on sleep, **an earlier bedtime is your best friend.** Moving bedtime up 30–45 minutes prevents overtiredness while their body adjusts.
### Expect an in-between phase
For a couple of weeks, you'll likely alternate: some days the old number of naps, some days the new. That's completely normal — follow your baby's cues day by day rather than forcing a rigid schedule.
### Protect the remaining nap(s)
As naps consolidate, the ones that remain become more important. Keep a consistent, calming wind-down for naps, and try to protect them from being skipped during the adjustment.
## The 2-to-1 transition (the tricky one)
The move from two naps to one — usually somewhere between 13 and 18 months — is the hardest, because for a while your toddler is *almost* ready but not quite. A common trick: on days they clearly still need two, keep them; on days they don't, shift the single nap a bit later (toward early afternoon) and lean on an early bedtime. Within a few weeks, one solid midday nap usually wins out.
## Frequently asked questions
### How do I know if my baby is dropping a nap or just going through a regression?
Regressions are usually temporary (a week or two) and often tied to a leap, teething, or illness, with your baby still *needing* the sleep. A true nap transition shows a consistent pattern over 1–2 weeks of not needing that nap and being fine on less. When unsure, wait it out before dropping the nap.
### Should I wake my baby from a nap during a transition?
Sometimes — capping an over-long or too-late nap can protect night sleep and help the new schedule settle. An early bedtime plus a capped late nap is a common combo during transitions.
### What if dropping a nap makes my baby overtired?
Use an earlier bedtime to catch up, and don't be afraid to go back to the old number of naps for a few more days if they clearly still need it. Transitions aren't all-or-nothing.
## The takeaway
Nap transitions are a normal, if bumpy, part of your baby growing up — from 4 naps down to 3, 2, 1, and eventually none. Follow the signs (consistent nap-fighting, short naps, early wakings) rather than the calendar, stretch wake windows gradually, lean hard on an earlier bedtime, and expect a messy in-between phase. Track the pattern and you'll know exactly when it's time. For the timing behind it all, see our [wake windows by age guide](/mamabee/articles/wake-windows-by-age).
[[CTA||Get MamaBee free and track naps and wake windows — so every nap transition makes sense.]]
*This article is general information, not medical advice. Every baby is different — talk to your pediatrician about your baby's sleep.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words)`)
}
console.log('\nDone.')
