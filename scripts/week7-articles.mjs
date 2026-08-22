// MamaBee week-7 batch — 10 new articles as DRAFTS, 1.2k-1.5k words each.
// Topics checked against existing 40 for zero cannibalization.
// Run once: node scripts/week7-articles.mjs
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

  A('how-often-to-bathe-a-baby',
    'How Often Should You Bathe a Baby? A Simple Guide by Age',
    'How often to bathe a newborn and baby, why less is often better for their skin, safe bath-time steps, water temperature, and how bathing fits into a calm bedtime routine.',
    ['how often to bathe a baby', 'newborn bath', 'baby bath guide', 'baby bath time', 'bathing a newborn'],
    {
      freq: {
        caption: 'A general guide — adjust to your baby and your pediatrician.',
        headers: ['Age', 'Baths per week', 'Notes'],
        rows: [
          ['Newborn (0–1 mo)', '2–3', 'Sponge baths until the cord stump falls off'],
          ['1–6 months', '2–3', 'More can dry the skin; top-and-tail between'],
          ['6–12 months', '3–4 or as needed', 'Crawling and solids mean more mess'],
          ['Toddler', 'Most days', 'Play, food and outdoors make daily reasonable'],
        ],
      },
    },
`New parents often assume a baby needs a bath every day, the way adults shower — and then feel guilty when bath time is a struggle. Here is the reassuring truth: newborns and young babies need surprisingly few baths, and over-bathing can actually harm their delicate skin. This is a simple, calm guide to how often to bathe your baby, how to do it safely, and how to make it a lovely part of the day rather than a battle.
## How often does a baby really need a bath?
Less often than you would think. For a newborn and young baby, **2 to 3 baths a week is plenty.** Babies do not get very dirty — they are not running around — and their skin is thin, sensitive and prone to drying out. Frequent bathing strips the natural oils that protect their skin, which can lead to dryness and irritation.
[[TABLE:freq]]
Between baths, you do not need to do nothing. **Top-and-tailing** — gently cleaning the face, neck, hands and diaper area with a warm damp cloth — keeps your baby fresh daily without a full bath. The parts that actually get dirty (mouth, neck folds, bottom) are the parts you clean often; the rest can wait.
## Newborns: sponge baths first
Until your baby's **umbilical cord stump falls off and heals** (usually within the first couple of weeks), skip the tub entirely and give **sponge baths**. Lay your baby on a towel, keep them wrapped and warm, and wash one area at a time with a damp cloth, exposing only what you are cleaning. Keep the cord stump clean and dry. Once it has healed, you can move to a baby tub.
## How to bathe your baby safely
Safety first, every single time:
- **Never leave your baby alone in the bath, even for a second.** Babies can drown in a very small amount of water, incredibly quickly. If you must step away, take the baby with you.
- **Get everything ready first** — towel, clean diaper, clothes, washcloth — so you never have to leave.
- **Check the water temperature.** Warm, not hot — around body temperature (about 37°C / 98–100°F). Test with your elbow or wrist, or a bath thermometer. Always turn cold water on first and off last.
- **Use only a little water** — a few inches is plenty for a small baby — and support their head and neck the whole time.
- **Keep it short** — five to ten minutes is enough, especially while they are little.
## Keep products simple
A baby's skin does not need much:
- **Plain warm water is fine** for newborns; you barely need soap at all early on.
- When you do use a cleanser, choose a **mild, fragrance-free, tear-free baby wash**, and use a small amount.
- **Skip bubble baths and heavily fragranced products** in the early months — they can irritate delicate skin and, for girls, the urinary area.
- **Moisturize after** if your baby's skin is dry, with a fragrance-free baby-safe lotion, patting skin dry rather than rubbing.
[[CTA||Track baths, bedtime and the whole routine in MamaBee — one calm tap at a time.]]
## Making bath time calm (and part of bedtime)
A warm bath is a wonderful wind-down cue, which is why so many families build it into the evening. The gentle warmth and one-on-one attention help signal that sleep is coming — one reason a bath features in so many [bedtime routines](/mamabee/articles/baby-bedtime-routine). A few tips for a happier bath:
- **Warm the room** and have the towel ready so the transition out is not a cold shock.
- **Get in close** — talk, sing, make eye contact. Your calm voice matters more than any toy.
- **Follow their mood.** If your baby hates the bath right now, keep it short and try a different time of day; many babies who dislike baths as newborns love them a few months later.
- **Never force it.** Bath time should feel safe and pleasant, not like a struggle.
## A word on cradle cap
While we are on bathing and skin: many babies develop **cradle cap** — yellowish, greasy or flaky patches on the scalp — in the early months. It looks alarming but is harmless, is not caused by poor hygiene, and usually clears on its own. To help it along, gently massage a little baby-safe oil into the scalp to soften the flakes, leave it a short while, then softly brush with a soft baby brush and wash out during a bath. Do not pick or scrub hard. If it is widespread, inflamed, spreading beyond the scalp, or seems to bother your baby, mention it to your pediatrician — but for most babies, a gentle approach and time are all it needs.
## A simple bath-time kit
You truly do not need much. A practical starter set: a **baby bath tub** (or a supportive bath seat once they can sit), two or three **soft washcloths**, a **hooded towel** to keep them warm afterward, a **mild fragrance-free cleanser** for when you use one, a **fragrance-free moisturizer** for dry skin, and a **soft brush** for cradle cap. A **bath thermometer** is optional but reassuring for getting the temperature right. Skip the long shopping list of gadgets — warm water, a gentle grip and your attention are the real essentials, and everything else is convenience.
## If your baby hates the bath
Plenty do, especially newborns who dislike being undressed and cold. Try: bathing in a warmer room, keeping a warm washcloth on their tummy for reassurance, getting in the bath with them (with another adult to hand the baby to), or switching to top-and-tailing for a while and trying the tub again later. It almost always passes.
## Frequently asked questions
### How often should I bathe my newborn?
Two to three times a week is plenty for a newborn. Their skin is delicate and over-bathing dries it out. Top-and-tail with a warm cloth on other days to keep them fresh.
### Can I bathe my baby every day?
You can, but you usually do not need to, and daily baths can dry out young skin. If your baby loves a bath as part of the bedtime routine, keep it short, use minimal or no soap, and moisturize afterward.
### What temperature should baby bath water be?
Warm, around body temperature (about 37°C / 98–100°F) — comfortably warm on your wrist or elbow, never hot. Run cold water first and hot last, and always test before your baby goes in.
### When can my newborn have a proper bath instead of a sponge bath?
Once the umbilical cord stump has fallen off and the area has healed, usually within the first week or two. Until then, stick to sponge baths and keep the cord clean and dry.
## The takeaway
Your baby needs far fewer baths than you might expect — 2 to 3 a week for newborns and young babies, with gentle top-and-tailing in between — because their delicate skin does better with less. Give sponge baths until the cord heals, keep the water warm and shallow, never look away, use minimal fragrance-free products, and lean into bath time as a calm bedtime cue. Fewer baths, done gently, are exactly right. For the wind-down that often follows, see our [baby bedtime routine guide](/mamabee/articles/baby-bedtime-routine).
[[CTA||Get MamaBee free — track baths, bedtime and every little moment, gently.]]
*This article is general information, not medical advice. Talk to your pediatrician about your baby's skin or bathing needs.*`),

  A('baby-diaper-rash-treatment',
    'Diaper Rash: How to Treat It Fast and Prevent It Coming Back',
    'What causes diaper rash, how to treat it quickly at home, the best barrier creams, how to prevent it, and the signs a rash needs a doctor rather than a diaper cream.',
    ['diaper rash', 'diaper rash treatment', 'nappy rash', 'diaper rash cream', 'baby bottom rash'],
    {},
`Almost every baby gets diaper rash at some point — that red, sore, unhappy bottom that makes changing time a squirmy protest. The good news: most diaper rash is easily treated at home and clears within a few days, and a few simple habits stop it coming back. Here is how to treat it fast, prevent it, and know when it is something more.
## What causes diaper rash
Diaper rash is mostly irritation, and knowing the cause points straight to the fix. The usual culprits:
- **Wetness and friction** — a wet or dirty diaper against delicate skin, rubbing as your baby moves. This is the number-one cause.
- **Leaving a soiled diaper on too long** — stool and urine irritate skin quickly.
- **New foods** — starting solids changes stool and can trigger rashes; so can new foods in a breastfeeding parent's diet.
- **Antibiotics** — for baby or a breastfeeding parent, which can disrupt the balance of skin and gut bacteria.
- **Chafing or sensitivity** — to a wipe, diaper brand, or detergent.
- **Yeast (thrush)** — a specific kind of rash that needs different treatment (more below).
## How to treat diaper rash fast
The core principle: **keep it clean, dry, and protected.** Remember "ABCD" — Air, Barrier, Cleaning, Diapering.
- **Change diapers often** — as soon as they are wet or soiled. A dry bottom heals; a wet one stays sore.
- **Clean gently.** Use warm water and a soft cloth or fragrance-free wipe; pat dry, do not rub. During a flare, plain water is kindest.
- **Air it out.** Let your baby's bottom air-dry, and give some diaper-free time on a towel each day — air is genuinely healing.
- **Apply a barrier cream** at every change. A thick layer of **zinc oxide** or **petroleum-based** cream protects the skin from moisture. Apply it like frosting — thick — and you do not need to fully wipe it all off at the next change, just the soiled parts.
- **Loosen up.** Make sure diapers are not too tight, so air can circulate.
Most simple diaper rash improves within **2 to 3 days** with this routine.
## Preventing it coming back
Prevention is mostly the same habits, done consistently:
- **Frequent changes** — the single biggest preventer.
- **A thin layer of barrier cream** as routine protection, especially overnight and if your baby is prone to rashes.
- **Gentle, fragrance-free wipes**, or water and cloth for sensitive skin.
- **Let the bottom fully dry** before putting a fresh diaper on.
- **Watch new foods** as solids start — see [when to start solids](/mamabee/articles/when-to-start-solids).
- **The right diaper fit** — snug enough not to leak, loose enough to breathe.
[[CTA||Log diaper changes and spot patterns in MamaBee — so a rash never sneaks up on you.]]
## A quick change routine that keeps rashes away
Building a consistent change routine is what actually prevents recurring rashes, and it takes seconds once it is habit:
- **Wipe front to back**, gently, with a fragrance-free wipe or warm cloth.
- **Pat completely dry** — trapped moisture is the enemy. A few seconds of air here pays off.
- **Apply a thin barrier layer** as routine, or a thick one at the first sign of redness.
- **Fasten snug, not tight**, leaving room for air to circulate.
- **Change promptly** — the longer a wet or dirty diaper sits, the more the skin is exposed to irritation.
Overnight is the highest-risk stretch because the diaper is on for hours, so a slightly thicker barrier layer at bedtime is worth the extra few seconds.
## Cloth vs. disposable and rashes
Parents often ask whether cloth or disposable diapers cause more rashes — the honest answer is that **change frequency matters far more than the type.** Both can be rash-free with prompt changes and a dry bottom, and both can cause rashes if left on too long. Cloth diapers need a thorough wash routine (detergent residue can irritate, so rinse well and avoid fabric softener), while disposables wick moisture away effectively but should still be changed often. Use whichever suits your family and budget; the anti-rash habits are the same either way.
## When it is a yeast rash (and creams do not work)
If a diaper rash is not improving after a few days of good care, it may be a **yeast (candida) infection**, which is common and needs an antifungal cream rather than a barrier cream alone. Signs it might be yeast:
- Bright red, sometimes shiny patches, often in the skin folds
- Small red "satellite" spots dotted around the edges
- Not responding to regular barrier cream after several days
Talk to your pediatrician — they can confirm and recommend an antifungal. It is not a sign you did anything wrong; yeast simply thrives in warm, moist places.
## When to call the doctor
Most diaper rash is minor, but contact your pediatrician if:
- The rash is severe, blistering, or has open sores or bleeding
- It has not improved after 2 to 3 days of good home care
- There is pus, weeping, or yellow crusting (possible bacterial infection)
- Your baby has a fever alongside the rash
- The rash spreads beyond the diaper area
- Your baby seems in significant pain or is very unsettled
These can signal an infection or another skin condition that needs treatment.
## Frequently asked questions
### How do I get rid of diaper rash quickly?
Change diapers frequently, clean gently with water and pat dry, give diaper-free air time, and apply a thick layer of zinc-oxide or petroleum barrier cream at every change. Most rashes improve within 2 to 3 days.
### What is the best diaper rash cream?
A thick barrier cream containing zinc oxide is the standard first choice, applied generously at each change. If the rash looks like yeast (bright red with satellite spots) and is not clearing, your doctor may recommend an antifungal cream instead.
### Should I use powder for diaper rash?
Avoid talcum and cornstarch powders — they can be inhaled and are not recommended for babies. A barrier cream is the safer, more effective choice, and applying it thickly at each change does far more to protect the skin than any powder.
### How do I know if it is a yeast infection?
Yeast rashes are often bright red and shiny, sit in the skin folds, have small satellite spots around the edges, and do not improve with regular barrier cream after a few days of good care. A pediatrician can confirm it and prescribe a suitable antifungal cream.
## The takeaway
Diaper rash is almost universal and usually simple to beat: keep the area clean, dry and air-exposed, change often, and protect with a thick barrier cream — most clears in a few days. Prevent it with those same habits plus a snug-not-tight fit. If it is bright red with satellite spots, blistering, or not improving after a few days, see your doctor, since it may be yeast or an infection. Above all, do not read a diaper rash as a mark against your parenting — nearly every baby gets one, they are rarely a sign of neglect, and the delicate skin down there simply reacts to moisture and friction no matter how attentive you are. Treat it calmly, protect the skin, and it passes. For the digestive changes that can trigger rashes, see [starting solids](/mamabee/articles/when-to-start-solids).
[[CTA||Get MamaBee free — track diapers, foods and health so you can catch what triggers a rash.]]
*This article is general information, not medical advice. Contact your pediatrician for a severe, persistent, or infected-looking rash.*`),

  A('baby-eczema-care',
    'Baby Eczema: How to Soothe It and Keep Flare-Ups Away',
    'What baby eczema looks like, what triggers it, a gentle daily skincare routine that actually helps, safe treatments, and when to see a doctor about your baby eczema.',
    ['baby eczema', 'infant eczema', 'baby eczema treatment', 'eczema flare up', 'baby dry skin'],
    {},
`If your baby has patches of dry, red, itchy skin that come and go, you are likely dealing with eczema — one of the most common skin conditions in babies. It looks uncomfortable (and can be), but with a gentle, consistent routine, most baby eczema is very manageable, and many children grow out of it. Here is what it is, how to soothe it, and how to keep the flare-ups at bay.
## What baby eczema looks like
Eczema (atopic dermatitis) is dry, itchy, inflamed skin. In babies it often shows up as:
- Dry, rough, red or discolored patches
- Commonly on the **cheeks, scalp, and the fronts of arms and legs** in young babies; later, in the creases of elbows and knees
- Skin that can weep, crust or thicken when badly flared
- Itchiness — the hallmark — which makes babies scratch, rub and fuss
It tends to come in **flare-ups** (worse periods) and calmer stretches. It is not contagious, and it is not caused by anything you did.
## Why babies get eczema
Eczema comes down to a **weakened skin barrier.** A baby with eczema has skin that does not hold moisture well and lets irritants in more easily, so it dries out and reacts. There is often a genetic and allergic link — eczema, asthma and hay fever tend to run in families together. Because the barrier is the root issue, the whole treatment strategy is about **repairing and protecting that barrier.**
## The daily routine that actually helps
Consistency beats any single product. The foundation is **moisturize, moisturize, moisturize.**
- **Moisturize at least twice a day**, every day — not just during flares. A thick, fragrance-free cream or ointment (not a thin lotion) locks moisture in. Ointments and creams work better than watery lotions.
- **Moisturize right after bathing** — within a few minutes, on slightly damp skin, to seal in the water. This "soak and seal" step is one of the most effective things you can do.
- **Bathe gently and briefly** in lukewarm (not hot) water, using a mild, fragrance-free cleanser and only where needed. Pat — never rub — dry.
- **Dress in soft, breathable fabrics** like cotton; avoid wool and rough textures directly on the skin.
- **Keep nails short** to limit damage from scratching, and consider cotton mittens during bad flares or at night.
[[CTA||Track flare-ups, triggers and bath days in MamaBee — patterns make eczema easier to manage.]]
## Finding and avoiding triggers
Eczema flares are often set off by irritants or environment. Common ones to watch and reduce:
- **Fragrances** in soaps, lotions, detergents and wipes — go fragrance-free across the board
- **Heat and sweat**, and sudden temperature changes — avoid overheating and overdressing
- **Dry air** — a humidifier can help in dry seasons
- **Harsh fabrics** and detergent residue — use a gentle, fragrance-free detergent and rinse well
- **Saliva and food smears** — wipe and moisturize the cheeks and chin after feeds and drools
Keeping a simple log of when flares happen helps you spot your baby's personal triggers.
## Treatments beyond moisturizer
When moisturizing is not enough during a flare, your pediatrician may recommend:
- **A mild topical steroid cream** (like hydrocortisone) for short courses on flared areas — safe and effective when used as directed. Do not be afraid of appropriately prescribed steroids; under-treating a flare often prolongs it.
- **Wet-wrap therapy** for stubborn flares, guided by your doctor
- **Allergy testing or specialist referral** if eczema is severe or not responding
Always follow your doctor's guidance on medicated creams — how much, how often, and for how long.
## Managing eczema and sleep
Itchy skin and sleep are natural enemies, and eczema flares are a common reason babies wake and fuss at night. A few things help protect sleep during a flare: apply a generous moisturizer (and any prescribed treatment) as part of the bedtime routine so the skin is at its most comfortable overnight; keep the bedroom **cool**, since heat and sweat worsen itching; dress your baby in soft, breathable cotton and avoid overheating with too many layers or a too-warm sleep sack; and keep nails short, with cotton mittens on the worst nights to limit scratching in their sleep. A humidifier can help if the air is dry. If your baby is regularly losing sleep to itching, tell your pediatrician — it is a sign the eczema is not well enough controlled and the treatment plan may need adjusting. Comfortable skin genuinely means better nights for everyone.
## A note on eczema and food allergies
Eczema, especially when moderate to severe, is linked to a higher chance of food allergies. Current guidance actually encourages **introducing common allergens early** (around 6 months) rather than delaying, as this may help prevent allergies — but if your baby has significant eczema, talk to your pediatrician first about how to introduce allergens safely. See our guide to [introducing allergens](/mamabee/articles/introducing-allergens-to-baby).
## When to see a doctor
Check in with your pediatrician if:
- The eczema is widespread, severe, or not improving with good skincare
- The skin looks infected — weeping, yellow crusting, pus, or worsening redness and warmth
- Your baby is losing sleep or very distressed from itching
- You are unsure whether it is eczema or another rash
- You want a treatment plan or a prescription cream
## Frequently asked questions
### What does baby eczema look like?
Dry, itchy, red or discolored patches, often on the cheeks, scalp and limbs in young babies, and later in the elbow and knee creases. It comes in flare-ups and can weep or crust when severe.
### How do I treat my baby's eczema at home?
Moisturize with a thick fragrance-free cream at least twice daily and right after short lukewarm baths, use gentle fragrance-free products, dress in soft cotton, and avoid known triggers. For flares, your doctor may add a mild steroid cream.
### Will my baby grow out of eczema?
Many children improve significantly or grow out of eczema as they get older, though some continue to have sensitive skin. Consistent daily moisturizing helps a great deal in the meantime, and often reduces how often and how badly the eczema flares while you wait for them to outgrow it.
### Are steroid creams safe for babies?
Mild topical steroids are safe and effective for eczema flares when used as directed by your doctor. Under-treating flares often makes them last longer, so follow the prescribed plan rather than avoiding treatment out of worry.
## The takeaway
Baby eczema is common, manageable, and rooted in a fragile skin barrier — so the whole game is repairing and protecting that barrier with frequent, generous, fragrance-free moisturizing, gentle short baths with "soak and seal," soft fabrics, and trigger avoidance. Use prescribed steroid creams properly during flares, and see your doctor for severe, infected or stubborn eczema. With a steady routine, most babies' skin settles beautifully. The mindset that helps most is thinking of eczema as something you *manage* rather than *cure*: there will be good stretches and flares, and the goal is keeping the skin comfortable most of the time through daily moisturizing, not chasing perfect skin. Consistency, not any single miracle product, is what wins — and it genuinely does get easier as your baby grows. For the allergy connection, see [introducing allergens](/mamabee/articles/introducing-allergens-to-baby).
[[CTA||Get MamaBee free — log flare-ups and triggers so you can keep your baby's skin calm.]]
*This article is general information, not medical advice. See your pediatrician for diagnosis and treatment of your baby's skin.*`),

  A('baby-fever-what-to-do',
    'Baby Fever: What Is Normal, What to Do, and When to Worry',
    'What counts as a fever in a baby, how to take a temperature accurately, how to comfort a feverish baby, and the exact ages and signs that mean you should call the doctor now.',
    ['baby fever', 'infant fever', 'baby temperature', 'fever in babies', 'when to worry baby fever'],
    {
      temp: {
        caption: 'A fever is generally 100.4°F (38°C) or higher. When in doubt, call your doctor.',
        headers: ['Baby age', 'What to do about a fever'],
        rows: [
          ['Under 3 months', '100.4°F (38°C)+ — call the doctor or go in right away, always'],
          ['3–6 months', 'Call your doctor; watch closely for how baby seems'],
          ['6+ months', 'Comfort at home; call if high, persistent, or baby seems unwell'],
        ],
      },
    },
`Few things make a parent's stomach drop like a hot little forehead. A fever can be frightening, but here is the reframe that helps: **a fever is not an illness — it is the body doing its job**, raising its temperature to fight off an infection. What matters most is not the exact number, but your baby's age and how they seem. Here is what is normal, how to respond, and the clear signs that mean call the doctor now.
## What counts as a fever?
A fever is a body temperature of **100.4°F (38°C) or higher.** Below that is not a fever. A baby's normal temperature can vary a little through the day and with activity, so a reading slightly above their usual — but under 100.4°F — is not a fever.
Crucially, **how high the fever is does not reliably tell you how serious the illness is.** A high fever can come with a mild virus, and a serious illness can come with only a modest one. So watch your baby, not just the thermometer.
## How to take your baby's temperature accurately
For babies, accuracy matters:
- **Under 3 months:** a **rectal** temperature is the most accurate and the one doctors rely on. It sounds daunting but is safe when done gently with a digital thermometer.
- **Older babies:** rectal is still most accurate; forehead (temporal) and armpit readings are easier and fine for a general sense, though less precise.
- **Avoid** old mercury thermometers and, for young babies, ear thermometers (less reliable under 6 months).
- Note the **time and the number**, and which method you used, so you can tell the doctor.
## What to do by age
This is the part that matters most — the response depends heavily on age.
[[TABLE:temp]]
**Under 3 months is the critical one:** any fever of 100.4°F (38°C) or higher in a baby under three months is treated as a potential emergency, because young infants can get seriously ill quickly and show few other signs. **Call your doctor or go to the emergency department right away — do not wait, and do not give fever medicine before speaking to a professional.**
For **older babies**, a fever with an otherwise okay-seeming baby can often be managed at home with comfort and monitoring — but always trust your instinct and call if something feels off.
## How to comfort a feverish baby
For a baby old enough to manage at home (and with your doctor's okay):
- **Keep them comfortable and hydrated.** Offer extra breast milk or formula; hydration matters more than food. Watch for wet diapers.
- **Dress them lightly** — one light layer. Bundling traps heat and raises the temperature. Keep the room comfortable, not hot.
- **Rest.** Let them sleep and take it easy.
- **Fever medicine, correctly.** For babies over the appropriate age, **infant acetaminophen** (and ibuprofen for babies over 6 months) can ease discomfort — but **dose strictly by weight and your pediatrician's guidance**, never by age alone, and never give aspirin to a child. Only medicate to help them feel better, not to force the number down.
- **Skip cold baths, ice, and alcohol rubs** — they can cause shivering (which raises temperature) and are not recommended.
[[CTA||Log temperatures, meds and symptoms in MamaBee — a clear record helps you and your doctor.]]
## Febrile seizures: frightening but usually harmless
One thing worth understanding *before* it happens, because it is terrifying in the moment: some young children have a **febrile seizure** — a convulsion triggered by a fever, most common between about 6 months and 5 years. The child may stiffen, twitch or jerk, and briefly lose awareness. It is one of the scariest things a parent can witness, but the reassuring truth is that most febrile seizures are **brief and harmless**, and do not cause brain damage or mean your child has epilepsy. If one happens: stay as calm as you can, **place your baby on their side** on a safe surface away from hard objects, do **not** put anything in their mouth or restrain them, and time it. For a first-ever seizure, a seizure lasting more than about 5 minutes, or one with trouble breathing or a blue color, call emergency services immediately. Even for a short one that stops on its own, contact your doctor afterward to check in. Knowing this exists — and that it usually passes without harm — makes it far less frightening if you ever face it.
## When to call the doctor or seek urgent care
Call your doctor promptly — or seek emergency care — for any of these:
- **Any fever in a baby under 3 months** (100.4°F / 38°C or higher)
- A fever in a 3–6 month old, or a fever above about 102°F (39°C) in an older baby
- Fever lasting more than a couple of days, or that keeps returning
- Your baby is **hard to wake, floppy, or unusually unresponsive**
- Trouble breathing, a blue tinge to lips or skin
- A **rash that does not fade when pressed** (glass test) — seek emergency care
- Repeated vomiting, signs of dehydration (few wet diapers, no tears, dry mouth), or a stiff neck
- A **febrile seizure** (stay calm, keep them safe on their side, and seek medical advice)
- Your baby simply seems very unwell, or your gut says something is wrong — trust it
## Frequently asked questions
### What temperature is a fever in a baby?
100.4°F (38°C) or higher is a fever. Below that is not. Remember the height of the fever does not reliably indicate how serious the illness is — your baby's age and how they seem matter more.
### My baby is under 3 months and has a fever — what do I do?
Treat it as urgent. Any fever of 100.4°F (38°C) or higher in a baby under three months means calling your doctor or going to the emergency department right away, without giving fever medicine first. Young infants can become seriously ill quickly.
### How do I take my baby's temperature?
A rectal reading with a digital thermometer is the most accurate for babies, especially under three months. Forehead and armpit readings are easier for older babies but less precise. Avoid ear thermometers under six months.
### Should I give my feverish baby medicine?
Only to ease discomfort, for a baby old enough, dosed by weight and your pediatrician's guidance — never by age alone, and never aspirin. For babies under three months, speak to a doctor before giving anything.
## The takeaway
A fever (100.4°F/38°C or higher) is the body fighting infection, and your response depends above all on age: any fever under 3 months is an emergency — call right away; older babies can often be comforted and monitored at home with fluids, light clothing and correctly-dosed medicine if needed. Watch your baby rather than the number, know the red flags, and always trust your instinct. And keep the whole thing in perspective: fevers are one of the most common and normal parts of a baby getting sick, most are caused by ordinary viruses that pass on their own, and a child who is drinking, weeing and settling reasonably between temperature spikes is usually okay — the thermometer reading matters far less than how they seem. For related illness, see our guide to [baby's first cold](/mamabee/articles/baby-first-cold).
[[CTA||Get MamaBee free — track temperature, medicine and symptoms so nothing gets lost when it matters.]]
*This article is general information, not medical advice. For any fever in a baby under 3 months, or any concern, contact a medical professional immediately.*`),

  A('baby-vaccine-schedule-explained',
    'The Baby Vaccine Schedule, Explained Simply for Parents',
    'A plain-language guide to the baby vaccine schedule: why the timing matters, what to expect at each visit, how to comfort your baby, common side effects, and where to get trusted information.',
    ['baby vaccine schedule', 'baby immunizations', 'infant vaccines', 'baby shots', 'vaccine side effects baby'],
    {},
`The vaccine schedule can feel like a blur of appointments and acronyms, and seeing your baby get a shot is nobody's favorite moment. But those visits are among the most protective things you will ever do for your child. Here is a calm, plain-language guide to how the baby vaccine schedule works, what to expect, and how to make the visits easier — without the jargon.
## Why the schedule is timed the way it is
The vaccine schedule is not arbitrary. It is carefully designed so that babies are **protected as early as possible against diseases that are most dangerous to the very young** — while their own immune systems are still developing. Some vaccines need several doses spaced out to build strong, lasting immunity, which is why your baby gets boosters over the first two years rather than everything at once.
Getting vaccines **on time matters** because a delay leaves your baby unprotected during the window when many of these illnesses are most severe. The recommended schedule reflects decades of research on what timing gives the best protection with the fewest risks.
## The rough shape of the first two years
Exact vaccines and combinations vary by country, so your pediatrician and your national health authority are the source of truth. But the general rhythm in most schedules looks like this:
- **At birth:** often the first hepatitis B dose
- **2, 4, and 6 months:** the main cluster of visits, protecting against illnesses like whooping cough (pertussis), diphtheria, tetanus, polio, Hib, pneumococcal disease, rotavirus and more, usually given as combination shots
- **6 months and older:** annual flu vaccine
- **12–18 months:** boosters plus vaccines like MMR (measles, mumps, rubella) and chickenpox (varicella)
Many vaccines are **combined into single shots** to reduce the number of jabs, and getting several at once is safe — a baby's immune system handles it easily.
## What to expect at a vaccine visit
Knowing the flow makes it less stressful:
- The nurse or doctor will confirm your baby is well enough (a mild cold is usually fine; a significant illness may mean rescheduling — ask).
- Your baby will get one or more quick injections, often in the thigh for little ones.
- It is over fast. The anticipation is worse than the moment.
- You will get a record of what was given and when — **keep this updated**, as you will need it for daycare, school and travel.
## How to comfort your baby through shots
You can genuinely reduce the distress:
- **Hold and cuddle** your baby during and right after — being held is deeply reassuring.
- **Breastfeed or offer a bottle** during or immediately after; sucking and closeness soothe, and the sweetness helps.
- **Stay calm yourself.** Babies read your energy; a steady, gentle voice helps more than you would think.
- **Distract** older babies with a toy, song or funny faces.
- **A little skin-to-skin** afterward works wonders.
[[CTA||Keep your baby's vaccine dates and reactions in MamaBee — never lose track of what is due.]]
## Common side effects (and what is not normal)
Most reactions are **mild, expected, and a sign the vaccine is working:**
- Soreness, redness or slight swelling where the shot was given
- A mild fever
- Being fussier, sleepier, or a bit off for a day or two
- Reduced appetite briefly
Comfort measures help: cuddles, extra fluids, a cool cloth on a sore spot, and — if your pediatrician advises — appropriately dosed infant fever medicine. See our guide to [baby fever](/mamabee/articles/baby-fever-what-to-do).
**Seek medical advice promptly** for the rare signs of a more serious reaction: a high or persistent fever, a fever in a baby under 3 months, inconsolable crying for hours, or any signs of a severe allergic reaction (trouble breathing, swelling of the face, hives) — which are very rare but need immediate care.
## Why so many shots, and why combination vaccines help
Parents are often taken aback by how many vaccines cluster into the early visits — but there is good reason. Babies face the greatest danger from these illnesses in their first months, so protection is front-loaded to cover them as early as possible. To keep the number of actual injections down, many vaccines are delivered as **combination shots** — a single jab protecting against several diseases at once (for example, one shot covering diphtheria, tetanus, whooping cough, polio and Hib together). This means fewer needles and fewer appointments without any loss of protection. And getting several at once is not "too much" for a baby: their immune system encounters countless germs every day, and the antigens in vaccines are a tiny fraction of that everyday load. Spreading vaccines out onto a slower, non-standard schedule does not make them safer — it simply leaves your baby unprotected for longer, which is why pediatric bodies recommend sticking to the standard timing. If the number of shots at one visit worries you, that is a great thing to talk through with your pediatrician rather than delaying.
## Getting trusted information
Vaccines attract a lot of noise online. For accurate, evidence-based information, rely on your **pediatrician** and official public-health sources (such as the CDC in the US or your national health service) rather than social media. If you have questions or worries, your doctor genuinely wants to talk them through — asking is always okay.
## Frequently asked questions
### Is it safe for my baby to get several vaccines at once?
Yes. A baby's immune system easily handles multiple vaccines in one visit, and combination shots are designed to reduce the number of injections. Getting them together means your baby is protected sooner.
### What are the common side effects of baby vaccines?
Most are mild: soreness or redness at the injection site, a low fever, and being fussy or sleepy for a day or two. These usually pass quickly and are a normal sign the immune system is responding.
### Can my baby have vaccines if they have a cold?
Usually yes — a mild illness like a cold is generally not a reason to delay. A more significant illness or high fever may mean rescheduling. Check with your pediatrician if you are unsure.
### What if we miss a scheduled vaccine?
Contact your pediatrician; they can provide a catch-up schedule. It is best to get back on track promptly, since delays leave your baby unprotected, but missing one does not mean starting over.
## The takeaway
The baby vaccine schedule is carefully timed to protect your child against the most dangerous illnesses as early and safely as possible, with doses clustered around 2, 4 and 6 months and boosters through the second year. Expect quick visits, mostly mild side effects, and real reassurance from holding and feeding your baby through them. Keep the records updated, lean on your pediatrician and official sources for information, and stay on schedule where you can. It is completely normal to feel uneasy watching your baby get a shot — but remember you are giving them protection against diseases that were once common causes of infant death and disability, and that few acts of parenting are as quietly powerful. A moment of tears now buys a lifetime of protection. For managing the mild fever that sometimes follows, see [baby fever: what to do](/mamabee/articles/baby-fever-what-to-do).
[[CTA||Get MamaBee free — track vaccine dates, due reminders and any reactions in one place.]]
*This article is general information, not medical advice. Follow the vaccine schedule recommended by your pediatrician and national health authority.*`),

  A('baby-play-and-activities-by-age',
    'Baby Play by Age: Simple Activities That Boost Development (0–12 Months)',
    'Age-by-age baby play ideas that support development, from tummy time and high-contrast cards to peekaboo and stacking — plus why unstructured play and your face matter most.',
    ['baby activities by age', 'baby play ideas', 'baby development activities', 'play with newborn', 'baby milestones play'],
    {},
`You do not need a cupboard full of expensive toys to help your baby learn — in the early months, the best "developmental tool" is you: your face, your voice, and simple everyday play. Play is how babies learn everything, and matching activities to their stage makes it more fun and more useful. Here is a calm, age-by-age guide to playing with your baby through the first year.
## Why play is your baby's real work
Play is not a break from learning for a baby — it *is* the learning. Through play, babies build language, motor skills, problem-solving, and social and emotional understanding. And the single most important ingredient is not a toy; it is **responsive interaction with you** — the back-and-forth of smiles, sounds and attention that scientists call "serve and return." Keep that at the center and everything else is a bonus.
A few principles that hold at every age: **follow your baby's cues** (engage when alert, stop when they look away or fuss), keep it **low-pressure and fun**, and remember that **repetition is how babies master things** — they love doing the same thing over and over for a reason.
## 0–3 months: faces, contrast and tummy time
Newborns see best up close and are drawn to faces and high contrast.
- **Face time.** Hold your baby about 8–12 inches away, make eye contact, talk, sing, and pull gentle expressions. Your face is their favorite thing in the world.
- **High-contrast cards or books** — bold black-and-white patterns are easiest for a newborn's developing vision.
- **Tummy time**, a little and often, to build neck and shoulder strength — see our [tummy time guide](/mamabee/articles/tummy-time-guide).
- **Talk through your day** and respond to their coos; this is the foundation of language.
## 3–6 months: reaching, grabbing and cause-and-effect
Now they are reaching, grasping, and delighting in what their body can do.
- **Rattles and easy-grip toys** to reach for and shake — they are learning cause and effect.
- **Textured toys and safe household objects** to explore (everything goes in the mouth — that is normal exploration).
- **A baby-safe mirror** — babies love the "other baby."
- **Sing songs with actions**, bounce gently, and keep the conversation going. Rhymes and repetition build language and rhythm.
## 6–9 months: sitting, exploring and peekaboo
Sitting up opens a whole new world, and object permanence is developing.
- **Peekaboo** — a genuine developmental game teaching that things (and you) still exist when out of sight, easing separation anxiety too.
- **Stacking cups, soft blocks, and containers** to fill and dump — endlessly fascinating and great for coordination.
- **Balls to roll** back and forth, building motor skills and turn-taking.
- **Board books** — point, name, and let them turn the pages and chew the corners.
- **Safe floor exploration** as they start to move; a bit of freedom to reach and shuffle is powerful.
[[CTA||Track play, milestones and firsts in MamaBee — and see your baby's development unfold.]]
## 9–12 months: crawling, standing and problem-solving
Mobile and curious, they want to figure things out.
- **Push-and-pull toys** and safe furniture to cruise along as they work toward walking.
- **Simple problem-solving toys** — shape sorters, nesting cups, a toy to fish out of a container.
- **"Where is it?" games** — hide a toy under a cloth and let them find it.
- **Naming everything** — narrate objects and actions; their understanding is racing ahead of their speech.
- **Interactive songs** with actions like clapping and waving, which they will start to copy.
## Reading to your baby (start now)
One activity deserves its own mention because the payoff is so large: **reading aloud, from day one.** It does not matter that a newborn cannot follow a plot — hearing your voice, the rhythm of language, and the shared closeness are what count, and early reading is strongly linked to later language and literacy. Make it simple and stage-appropriate: **high-contrast and cloth books** for newborns, **sturdy board books** with big images to point at and name from a few months, and **touch-and-feel or flap books** for older babies who want to interact. Let them chew the corners and turn the pages out of order — that is engagement, not misuse. A book or two woven into the [bedtime routine](/mamabee/articles/baby-bedtime-routine) doubles as a wind-down cue. Just a few minutes of naming pictures and sharing a story, repeated daily, is one of the highest-value things you can do for your baby's developing brain — and it costs nothing but your voice.
## A note on screens
Since it comes up: for babies under about 18–24 months, health guidance recommends avoiding screen time beyond video-chatting with family. Very young brains learn from real, responsive, three-dimensional interaction — your face, your voice, real objects — in a way screens cannot replicate. There is no need for "educational" baby apps or videos in the first year; the simple play in this guide does far more. When screens do enter the picture later, co-viewing and talking about what you see beats passive watching.
## What matters more than any toy
A few reassuring truths to hold onto:
- **You are the best toy.** Interaction beats gadgets every time.
- **Simple wins.** Cardboard boxes, wooden spoons, containers and your kitchen cupboard often beat flashy electronic toys.
- **Unstructured play is valuable.** You do not need to entertain constantly; some independent floor time helps babies learn to explore and focus.
- **Do not compare.** Babies develop on their own timelines; play is for connection and joy, not hitting targets. For the milestones themselves, see [baby milestones month by month](/mamabee/articles/baby-milestones-by-month).
## Frequently asked questions
### What are the best activities for a newborn?
Face-to-face time, talking and singing, high-contrast black-and-white images, and short bursts of tummy time. Newborns are drawn to your face and voice above any toy, so simple interaction is ideal.
### How much should I play with my baby each day?
There is no set amount — weave short bursts of interaction through the day when your baby is alert and happy, and follow their cues. Quality, responsive back-and-forth matters far more than clocked hours, and independent floor time counts too.
### Do babies need lots of toys to develop well?
No. Responsive interaction with you is the most important factor, and simple objects — cups, boxes, spoons, board books — often engage babies more than expensive electronic toys.
### What is "serve and return" play?
It is the back-and-forth of your baby making a sound or expression and you responding — a smile, a word, a gesture. This responsive exchange is one of the most powerful drivers of brain and language development.
## The takeaway
Baby play is simple and profoundly important: match easy activities to your baby's stage — faces and contrast for newborns, reaching and cause-and-effect around 3–6 months, peekaboo and stacking at 6–9 months, and problem-solving as they become mobile — but never lose sight of the fact that *you* are the best toy. Follow their cues, keep it playful, embrace repetition, and skip the pressure and the comparison. The best news of all: this takes the weight off. You do not need to run a curriculum or buy the "developmental" toy of the month — you need to get on the floor, make faces, name things, and read a book, a little and often. That is not just good enough; it is genuinely the best thing for your baby. For where all this play is heading, see [baby milestones month by month](/mamabee/articles/baby-milestones-by-month).
[[CTA||Get MamaBee free — log milestones and playful firsts, and watch your baby grow.]]
*This article is general information, not medical advice. Talk to your pediatrician if you have any concerns about your baby's development.*`),

  A('baby-separation-anxiety',
    'Baby Separation Anxiety: Why It Happens and How to Ease It',
    'When baby separation anxiety starts, why it is a healthy sign of development, and gentle, practical strategies to help your baby cope with goodbyes at daycare, bedtime and beyond.',
    ['baby separation anxiety', 'separation anxiety baby', 'baby clingy', 'daycare drop off crying', 'baby cries when i leave'],
    {},
`One day your happily independent baby suddenly bursts into tears the moment you leave the room — even just to go to the bathroom. Welcome to separation anxiety: exhausting, heart-tugging, and — here is the reassuring part — a completely normal and healthy sign that your baby's development is right on track. Here is why it happens and how to gently help both of you through it.
## What separation anxiety is and when it starts
Separation anxiety is the distress babies feel when apart from their primary caregivers. It typically **begins around 6 to 9 months, often peaks between 10 and 18 months**, and gradually eases through toddlerhood (though it can flare again at times).
Why now? Because your baby has developed **object permanence** — the understanding that you still exist even when they cannot see you. Before this, out of sight really was out of mind. Now they know you are somewhere else, they just do not yet understand that you always come back. Combined with a deep attachment to you, that is a recipe for tears at goodbyes. It is not a step backward — it is a cognitive leap forward.
## The signs
- Crying, clinging or fussing when you leave, or even prepare to leave
- Becoming extra clingy, wanting to be held constantly
- Distress with unfamiliar people or when handed to others
- Waking more at night and being harder to settle (separation anxiety and sleep often collide — see our note below)
- Following you from room to room, upset when you are out of sight
## Gentle strategies that help
You cannot (and should not) prevent all distress, but you can make separations easier and build your baby's confidence that you always return.
- **Practice short separations.** Leave the room briefly and come back, cheerfully. Play **peekaboo** — it is literally a game about people disappearing and reappearing, teaching that you come back.
- **Keep goodbyes short, warm and consistent.** A quick cuddle, a confident "bye-bye, see you soon," and go. Drawn-out, anxious goodbyes make it worse, not better.
- **Never sneak away.** Slipping off without saying goodbye avoids the immediate tears but erodes trust and can make anxiety worse — your baby learns you might vanish at any moment.
- **Build a goodbye ritual.** The same little routine — a kiss, a wave at the window, a special phrase — gives predictability, which is deeply reassuring.
- **Let them warm up** to new people and places at their own pace, from the safety of your arms.
- **Leave something comforting** — a familiar blanket or a caregiver they know — and trust that most babies settle within minutes of you leaving.
[[CTA||Track sleep and settling through clingy phases in MamaBee — so you can see the pattern ease.]]
## Handling daycare and childcare drop-offs
Drop-offs can be the hardest. To ease them:
- **Visit ahead of time** if you can, so the place and people are familiar
- Arrive with a little time to settle rather than rushing
- Do your **short, confident goodbye ritual** and then leave — lingering prolongs the distress
- **Trust the caregivers** — ask them to text you; most babies stop crying very soon after you are gone and happily play
- **Reconnect warmly** at pickup
The tears at drop-off are real but usually brief. A calm, consistent goodbye teaches your baby that daycare is safe and you always come back.
## Building your baby's confidence
Alongside easing goodbyes, you can gently grow your baby's sense that being briefly apart is safe — which is what they are learning. A few ways to build that confidence:
- **Encourage independent play** in short stretches while you stay nearby. Sit close, let them explore a toy on their own, and resist jumping in the instant they fuss — a little space, with you as a safe base, builds security.
- **Narrate your comings and goings** even at home: "I'm going to the kitchen, I'll be right back" — then come back. Every small return teaches the lesson.
- **Give them a secure base.** Counterintuitively, responding warmly to clinginess *now* builds the confidence to separate *later*. You cannot spoil a baby with reassurance; a baby who trusts you will come back becomes braver, not clingier.
- **Introduce a comfort object** — a small safe blanket or soft toy (for supervised, awake time in young babies) can become a reassuring stand-in when you are not there.
The goal is not to push independence before they are ready, but to keep proving, gently and repeatedly, that separations are short and you always return.
## Separation anxiety and sleep
This phase often disrupts sleep, because bedtime is a separation too. Keep your [bedtime routine](/mamabee/articles/baby-bedtime-routine) steady and reassuring, offer comfort without creating brand-new long-term habits, and know it usually settles as the phase passes. It frequently overlaps with developmental leaps — see [sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age).
## When it might be more
Separation anxiety is normal and healthy. But mention it to your pediatrician if it seems extreme, is not easing at all with time, severely disrupts daily life well beyond the typical age range, or comes with other developmental worries. In toddlers and older children, persistent, intense separation anxiety is occasionally worth professional input — but in babies, it is almost always a normal, passing stage.
## Frequently asked questions
### When does baby separation anxiety start and end?
It usually begins around 6 to 9 months, peaks between about 10 and 18 months, and gradually eases through toddlerhood. It can briefly flare again during big changes or developmental leaps.
### Is separation anxiety a bad sign?
No — it is a healthy, normal sign of development. It means your baby has formed a strong attachment to you and has developed object permanence (knowing you exist when out of sight). It is a cognitive leap, not a problem.
### Should I sneak away to avoid the tears?
No. Sneaking off avoids the immediate crying but undermines your baby's trust and can worsen anxiety. A short, warm, consistent goodbye teaches them that you leave *and* come back.
### How can I make daycare drop-offs easier?
Familiarize your baby with the place beforehand, keep a short confident goodbye ritual, hand them to a trusted caregiver, and leave rather than lingering. Most babies settle within minutes, so ask staff to reassure you by text.
## The takeaway
Separation anxiety is a normal, healthy milestone driven by your baby's growing understanding that you exist even when out of sight — it starts around 6–9 months, peaks in the second year, and passes. Ease it with short practice separations, peekaboo, warm and consistent goodbyes (never sneaking off), predictable rituals, and calm confidence at drop-offs. Keep bedtime steady through it, and trust that this clingy chapter is proof of a secure, loving bond. As draining as it is to be followed to the bathroom and cried at over every goodbye, try to hold onto what it really means: your baby loves you so much that your absence is genuinely felt, and they are learning — one small return at a time — that you always come back. That lesson, learned securely now, is the foundation of a confident, independent child later. This phase is exhausting and it is temporary; you are not doing anything wrong. For the sleep side, see [sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age).
[[CTA||Get MamaBee free — track the clingy phases and see them settle, one day at a time.]]
*This article is general information, not medical advice. Talk to your pediatrician if you have concerns about your baby's development or wellbeing.*`),

  A('flying-with-a-baby',
    'Flying With a Baby: A Calm, Practical Survival Guide',
    'How to fly with a baby without the stress: the best age and flights to book, what to pack, easing ear pain on takeoff and landing, feeding and sleep on board, and staying sane.',
    ['flying with a baby', 'traveling with a baby', 'baby on a plane', 'baby ear pain flying', 'air travel with infant'],
    {},
`The thought of flying with a baby strikes fear into most new parents — visions of a screaming infant, judgmental stares, and a diaper blowout at 35,000 feet. Take a breath: with a bit of planning, flying with a baby is very doable, and often easier than you fear (babies frequently sleep through the drone of the engines). Here is a calm, practical guide to getting there with your sanity intact.
## Before you book: timing and flights
A few smart choices up front make everything easier:
- **Age matters a little.** Many parents find the "easy" window is the young, portable, sleepy newborn stage (once your doctor okays travel) or waiting until after the early vaccines — check with your pediatrician about the right time for your baby, especially for very young infants.
- **Book around sleep where you can.** Some families swear by flights during nap time or a longer flight overnight so the baby sleeps; others prefer a well-rested baby on a morning flight. Know your baby.
- **Consider a bassinet.** On long-haul flights, airlines often offer bulkhead bassinets for small babies — request one when booking.
- **Lap infant vs. seat.** Babies under two can usually fly on your lap (often free or discounted), but the safest option is their own seat with an approved car seat. Decide based on budget, flight length and peace of mind.
- **Build in buffer time.** Everything takes longer with a baby; a tight connection is a recipe for stress.
## What to pack in your carry-on
Pack the diaper bag like you might be stuck on the plane for hours (you might). Essentials:
- **More diapers than you think** (roughly one per hour of travel, plus extra), wipes, and changing mat
- **At least one full change of clothes for baby — and a spare top for you** (blowouts are democratic)
- **Feeding supplies** — bottles, formula, or nursing cover as needed; snacks if on solids
- **Comfort items** — a favorite blanket, a couple of toys, a pacifier
- **Muslin cloths** for a hundred uses, plus plenty of plastic/wet bags
- **Any medicines**, and your baby's documents
Keep the true essentials in an easy-to-reach pocket — you do not want to dig for a diaper mid-meltdown.
## The big one: easing ear pain on takeoff and landing
The pressure changes during **takeoff and descent** can hurt a baby's ears, and this is the most common cause of crying. The fix is simple: **have your baby suck and swallow** during these times, which equalizes ear pressure.
- **Feed on takeoff and the beginning of descent** — breast, bottle, or a pacifier all work.
- Time a feed so your baby is drinking as the plane climbs and again as it comes down.
- A pacifier or, for older babies, a sippy cup or snack works too.
Do not stress if they are asleep — sleeping through it is fine; you do not need to wake them to feed unless they seem uncomfortable.
[[CTA||Track feeds, naps and diapers across time zones in MamaBee — travel chaos, organized.]]
## Getting through the airport
- **Wear your baby** in a carrier through security and the terminal — hands free is everything. (You may need to remove them briefly at the security check; staff will guide you.)
- **Gate-check the stroller and car seat** for free right at the aircraft door.
- **Board smart.** Some families use priority boarding to set up; others send one parent to board with the bags while the other keeps the baby moving in the gate area until the last minute, minimizing time strapped in. Pick what suits your baby.
- **Change the diaper right before boarding** to buy time.
## On the plane: feeding, sleeping and surviving
- **Feed on demand** — the schedule goes out the window on travel day, and that is fine.
- **Recreate sleep cues** where you can — a familiar blanket, dimmed light, a cuddle. Motion and white noise (the engines help) often lull babies to sleep.
- **Walk the aisle** with a fussy baby when the seatbelt sign is off.
- **Lower your expectations and let go of the audience.** Most fellow passengers are sympathetic or oblivious, and the ones who are not are not your problem. You will likely never see them again. Your job is your baby, not everyone else's comfort.
- **Accept that some crying may happen** — you are doing your best, and babies cry. It always ends.
## Handling jet lag and time zones
If you are crossing time zones, jet lag is the part that lingers after the flight. A gentle approach helps both of you adjust:
- **For short trips (1–2 time zones),** it is often easiest to keep your baby roughly on home time rather than fully shifting — less disruption for a quick visit.
- **For bigger shifts,** move onto the new time zone as soon as you arrive: feed and sleep by local time, and use **daylight** to reset their body clock — natural light in the morning at your destination is the strongest signal for adjusting.
- **Expect a few rough days.** A baby's body clock typically shifts by roughly an hour a day, so give it time and stay patient with night wakings while they adjust.
- **Keep the sleep routine familiar** — the same wind-down cues, sleep sack and comfort object — so that even in a new place and time, bedtime feels recognizable.
- **Prioritize sleep over a perfect schedule** in the first days back home too; the return adjustment is real, and consistency plus daylight will settle it within a week or so.
Go easy on yourself here — a jet-lagged baby is temporary, and it is nobody's fault.
## Frequently asked questions
### How do I stop my baby's ears hurting on a plane?
Have your baby suck and swallow during takeoff and descent — breastfeeding, a bottle, or a pacifier all equalize the ear pressure that causes pain. Time a feed for the climb and again for the descent.
### What is the best age to fly with a baby?
There is no single best age, but many parents find the young, sleepy newborn stage (with a doctor's okay) or after the first vaccines to be manageable. Check with your pediatrician, especially for very young infants, and choose flights around your baby's sleep.
### Do I need to buy a seat for my baby?
Babies under two can usually travel as a lap infant, often at reduced cost. The safest option, however, is their own seat with an approved car seat. Weigh safety, budget and flight length.
### What should I pack in my carry-on for a baby?
More diapers than you expect, wipes, a changing mat, a full change of clothes for baby plus a spare top for you, feeding supplies, comfort items, muslins and wet bags, and any medicines and documents — with essentials in an easy-reach pocket.
## The takeaway
Flying with a baby is far less scary than it sounds: choose your flight and timing wisely, over-pack the diaper bag, and — the key move — feed or offer a pacifier on takeoff and landing to spare your baby's ears. Wear your baby through the airport, gate-check the gear, feed on demand, recreate sleep cues, and let go of worrying about other passengers. Some tears may happen, and that is okay. You have got this. For managing routines across time zones, a simple tracker helps.
[[CTA||Get MamaBee free — keep feeds, naps and diapers on track even when travel turns the day upside down.]]
*This article is general information, not medical advice. Check with your pediatrician before flying with a young infant.*`),

  A('baby-proofing-your-home',
    'Baby-Proofing Your Home: A Room-by-Room Checklist for Every Stage',
    'A practical baby-proofing checklist by room and by stage — from furniture anchoring and outlet covers to stairs, blind cords and choking hazards — so your home grows safe as your baby moves.',
    ['baby proofing', 'baby proofing checklist', 'childproofing home', 'baby safety home', 'toddler proofing'],
    {},
`The day your baby starts moving, your familiar home reveals itself as an obstacle course of sharp corners, tippy furniture and fascinating electrical outlets. Baby-proofing sounds overwhelming, but done room by room and stage by stage, it is very manageable — and it buys you the priceless ability to relax a little while your baby explores. Here is a practical checklist that grows with your child.
## Start before they are mobile
Do not wait for the first crawl — babies become mobile suddenly, and rolling starts early. A good trick: **get down on the floor at your baby's level** in each room and look around. What can you reach, grab, pull, or put in your mouth? That crawl's-eye view reveals hazards you would never spot standing up.
Tackle the biggest dangers first — the ones that cause the most serious injuries: **furniture tip-overs, falls, drowning, choking, and strangulation.** Get those handled and you have addressed the majority of the real risk.
## The highest-priority fixes (do these first)
- **Anchor furniture and TVs to the wall.** Tip-overs are a leading cause of serious injury — bookcases, dressers and TVs can fall when a baby pulls up on them. Use anti-tip straps or brackets. This is the single most important thing on this list.
- **Secure stairs** with hardware-mounted safety gates at the top and bottom.
- **Cord safety.** Blind and curtain cords are a strangulation hazard — use cordless blinds or keep cords wound up and completely out of reach.
- **Water safety.** Never leave a baby alone near any water — bath, buckets, toilets. Babies can drown in very little water, silently and fast.
- **Choking hazards up high.** Small objects, coins, button batteries, magnets, and small foods must be out of reach. Button batteries and high-powered magnets are especially dangerous if swallowed — treat them as emergencies.
## Room-by-room checklist
### Living room
- Anchor bookshelves, TV units and the TV
- Corner guards on sharp table edges and hearths
- Outlet covers on unused sockets; secure or hide cords and power strips
- Remove or secure wobbly furniture and heavy items on low shelves
- Keep small decor, remotes with batteries, and houseplants (some are toxic) out of reach
### Kitchen
- Cabinet and drawer locks, especially where cleaning products and sharp items live — better still, move chemicals up high (see [household chemical safety](/mamabee/articles/protecting-baby-from-household-chemicals))
- Stove knob covers and use back burners with handles turned in
- Keep hot drinks and appliance cords away from edges
- A locked or high spot for knives, glass and small gadgets
### Bathroom
- Toilet lid lock and never leave standing water
- Medicines, cosmetics and cleaners up high and locked
- Non-slip mat, and always test bath water temperature
- Set the water heater so tap water cannot scald
### Nursery and bedrooms
- A safe crib — firm flat mattress, nothing loose inside (see [safe sleep guidelines](/mamabee/articles/safe-sleep-guidelines))
- Cot away from windows, blind cords and radiators
- Anchor the dresser and changing unit; never leave baby unattended on a changing table
- Outlet covers and secured cords
[[CTA||Track milestones in MamaBee — because knowing "rolling" or "pulling up" is near is your cue to baby-proof.]]
## Proof ahead of each stage
Baby-proofing is not one-and-done — match it to what your baby is about to do:
- **Rolling (from ~4 months):** never leave them on a raised surface; clear the floor of hazards.
- **Crawling (~6–10 months):** outlet covers, stair gates, low-cabinet locks, small objects up.
- **Pulling up and cruising (~9–12 months):** anchor everything they can grab to stand; pad sharp edges at standing height.
- **Walking and climbing (12 months+):** re-scan for new reach, secure windows, and expect them to get into everything you thought was safe.
Do the next stage a little *before* they hit it — babies are always faster than parents expect.
## A starter baby-proofing shopping list
You do not need a giant haul — a focused kit covers most homes:
- **Anti-tip furniture straps / anchors** (the top priority) for dressers, bookshelves and TVs
- **Hardware-mounted safety gates** for the top and bottom of stairs
- **Outlet covers** for unused sockets
- **Cabinet and drawer latches** for anywhere chemicals, medicines or sharp items live
- **Corner and edge guards** for sharp low tables and hearths
- **Cordless blinds** (or cord winders/cleats) to remove strangulation risk
- **Door pinch guards** and, later, door-knob covers for rooms to keep off-limits
- **A toilet lid lock** and **stove knob covers** where relevant
Buy for the big risks first (anchoring, stairs, water, chemicals, cords), fit them before your baby reaches each stage, and add the rest as needed. You can spread the cost over a few months as your baby's mobility grows. Skip the pricey "all-in-one" kits if money is tight — a handful of straps, gates, latches and outlet covers from any hardware store does the same job for far less, and the most important item of all, furniture anchors, is also one of the cheapest.
## Do not forget other homes
Grandparents' and friends' houses, and vacation rentals, are often not baby-proofed. Do a quick crawl's-eye scan when you arrive, keep an extra eye out, and bring a few portable basics (outlet covers, a couple of cabinet latches) if you visit often.
## Frequently asked questions
### When should I start baby-proofing?
Before your baby is mobile — ideally around 3 to 4 months, since rolling and crawling can begin suddenly. Start with the highest-risk items (anchoring furniture, stair gates, water and choking hazards) and add to it as your baby develops.
### What is the most important baby-proofing step?
Anchoring furniture and TVs to the wall. Tip-overs are a leading cause of serious injury to young children, and anti-tip straps are cheap and quick to fit. After that, secure stairs, cords and water access.
### How do I baby-proof on a budget?
Focus on the big risks first — furniture anchors, outlet covers, cabinet latches and stair gates are inexpensive. Get down to floor level to spot hazards, and rearrange to move dangerous items up high rather than buying gadgets for everything.
### Are outlet covers and cabinet locks really necessary?
They meaningfully reduce common risks — electrical outlets and cabinets full of chemicals or sharp objects are exactly what curious crawlers head for. They are cheap, high-value additions once your baby is on the move.
## The takeaway
Baby-proofing is best done room by room, from your baby's eye level, and staged just ahead of each new skill. Prioritize the fixes that prevent the most serious harm — anchoring furniture, securing stairs, cord and water safety, and getting choking hazards up high — then work through each room with a checklist. Keep re-proofing as your baby rolls, crawls, pulls up and walks, and stay alert in un-proofed homes. A little effort buys a lot of peace of mind. One last thing worth saying plainly: baby-proofing reduces risk, but it never replaces supervision — no gate, latch or anchor substitutes for a watchful adult, especially around water and stairs. Think of the gadgets as a safety net that buys you seconds and catches the moments you inevitably miss, not as permission to look away. Set your home up well, keep your eyes on your baby, and you get the best of both: a space where your little one can safely explore, and the freedom for you to breathe a little while they do. For the chemical side specifically, see [protecting your baby from household chemicals](/mamabee/articles/protecting-baby-from-household-chemicals).
[[CTA||Get MamaBee free — track milestones so you always baby-proof one step ahead of your baby.]]
*This article is general information, not medical advice, and not a substitute for constant supervision.*`),

  A('baby-pacifier-guide',
    'Baby Pacifiers: Pros, Cons, Safe Use, and How to Wean Off',
    'A balanced guide to baby pacifiers: the real benefits and drawbacks, safe use, how they relate to breastfeeding and SIDS risk, and gentle ways to wean your baby off the pacifier.',
    ['pacifier', 'baby pacifier', 'dummy', 'pacifier weaning', 'pacifier pros and cons'],
    {},
`Few baby items divide opinion like the pacifier (or dummy). Some parents swear it saved their sanity; others worry about dependence and teeth. The honest answer is that pacifiers have real benefits *and* real drawbacks, and used sensibly they are a perfectly fine tool. Here is a balanced guide to the pros, cons, safe use, and — when the time comes — how to wean off.
## The case for pacifiers
Pacifiers tap into a baby's natural, powerful urge to suck for comfort. The genuine benefits:
- **Soothing.** They calm and comfort babies, help with self-settling, and can be a lifesaver during fussy spells, travel, or medical procedures.
- **A possible SIDS protective effect.** Offering a pacifier at sleep times has been associated with a **reduced risk of SIDS** — a notable safety point, though the reason is not fully understood.
- **Satisfying the sucking reflex** for babies who want to suck beyond feeding.
- **They can be taken away.** Unlike thumb-sucking, a pacifier habit can eventually be removed, giving you more control over weaning.
## The case against (the real drawbacks)
- **Possible breastfeeding interference early on.** Introducing a pacifier before breastfeeding is well established (often suggested around 3–4 weeks) may occasionally interfere with establishing a good latch and supply.
- **Dependence for sleep.** A baby who can only fall asleep with a pacifier may wake and cry for it to be replaced overnight — the "pacifier reinsertion" night shift many parents know well.
- **Ear infections.** Frequent pacifier use has been linked to a somewhat higher rate of ear infections in some studies.
- **Dental effects with prolonged use.** Long-term use past the toddler years can affect the alignment of teeth and the palate — which is why weaning in good time matters.
- **Speech, potentially.** Constant pacifier use in a talking toddler can get in the way of babbling and speech practice.
## Safe pacifier use
If you choose to use one, do it safely:
- **Wait until breastfeeding is well established** (often around 3–4 weeks) before introducing one, if you are breastfeeding. For formula-fed babies, timing is more flexible.
- **Offer at sleep times** for the possible SIDS benefit, but do not force it — if your baby does not want it, that is fine, and if it falls out during sleep you do not need to put it back in.
- **Never attach a pacifier to a cord or string around the neck** — a strangulation hazard. Use only clip-and-short-strap designs made for the purpose, and not during sleep.
- **Choose the right size** for your baby's age, one-piece designs where possible, and **check regularly for wear** — replace any pacifier that is damaged or degraded, as pieces can be a choking hazard.
- **Keep them clean** and never "clean" a pacifier in your own mouth (it transfers bacteria).
- **Do not dip it in anything sweet** like honey or sugar — honey is unsafe under 12 months and sugar harms emerging teeth.
[[CTA||Track sleep and soothing habits in MamaBee — helpful when you decide it is time to wean.]]
## Pacifier vs. thumb-sucking
Parents often weigh the pacifier against the thumb, and there is a genuine trade-off. Both satisfy the same natural sucking urge, but they differ in one key way: **you can take a pacifier away, but you cannot take away a thumb.** A pacifier habit is easier to control and eventually end on your timeline; thumb-sucking is self-soothing that is always available and can be much harder to stop, sometimes continuing for years. On the other hand, a pacifier is one more thing to keep clean, replace, and retrieve at 2 a.m. when it falls out. Dental effects from prolonged use are broadly similar for both if they continue past the toddler years. There is no single right answer — many babies choose for themselves — but if you would like the option to wean on your terms later, a (safely used) pacifier gives you more control than a thumb does. Whichever it is, the same principle applies: gentle in the early years, and work toward stopping by around age 2–3 before it can affect the teeth or speech.
## When and how to wean off
There is no single deadline, but most guidance suggests **beginning to limit pacifier use after about 12 months and aiming to wean by age 2–3** to avoid dental and speech effects. Two broad approaches:
- **Gradual:** limit the pacifier to sleep times only, then to just naps and bedtime, then phase it out. Offer comfort in other ways — a cuddle, a comfort object, words.
- **All at once ("cold turkey"):** for older toddlers, some families do a clean break with a fun ritual — the "paci fairy" who trades pacifiers for a small gift, or "posting" them away. Expect a few rough days, then it is done.
Tips that help: pick a calm time (not during illness, travel or a big change), be consistent once you start, offer lots of extra comfort and patience, and do not reintroduce it "just this once" — that resets the clock.
## Frequently asked questions
### Are pacifiers bad for babies?
Not inherently. Used sensibly, they soothe babies and may even reduce SIDS risk at sleep times. The drawbacks — possible breastfeeding interference early on, sleep dependence, ear infections, and dental effects with prolonged use — are mostly about timing and how long they are used.
### When should I introduce a pacifier?
If breastfeeding, wait until it is well established, often around 3–4 weeks, so it does not interfere with latch and supply. For formula-fed babies, timing is more flexible. Offering one at sleep times is where the possible SIDS benefit applies.
### Do pacifiers help prevent SIDS?
Offering a pacifier at sleep times has been associated with a reduced risk of SIDS, which is why it is sometimes recommended, though the exact reason is unclear. Don't force it, and there is no need to reinsert it if it falls out during sleep.
### When and how should I wean my baby off the pacifier?
Most guidance suggests limiting use after about 12 months and weaning by age 2–3. You can do it gradually (sleep times only, then phase out) or with a clean break and a fun ritual for older toddlers. Choose a calm time and stay consistent.
## The takeaway
Pacifiers are a legitimate, useful tool with genuine upsides — soothing and a possible SIDS-protective effect — balanced against real drawbacks like sleep dependence and, with prolonged use, dental effects. Use them safely: establish breastfeeding first, never on a neck cord, replace worn ones, and keep them clean. Then wean in good time, starting after around 12 months and finishing by age 2–3, gradually or with a clean break. Whatever you choose, a pacifier used thoughtfully is nothing to feel guilty about. Ignore the strong opinions in either direction — the parents who act like a pacifier is a moral failing, and the ones who think a baby must have one. It is simply a tool: helpful for many babies, unnecessary for some, and fine either way when used sensibly and not relied on forever. Trust your own baby's cues and your own judgment over anyone else's rules. For soothing without a pacifier, see our guide to [the newborn witching hour](/mamabee/articles/newborn-witching-hour).
[[CTA||Get MamaBee free — track soothing, sleep and habits so weaning goes as smoothly as possible.]]
*This article is general information, not medical advice. Talk to your pediatrician or dentist about pacifier use and weaning for your child.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs Studio', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const t = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1200 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words${t?`, ${t} tbl`:''})`)
}
console.log('\nDone — 10 MamaBee week-7 DRAFTS. Nothing live.')
