// Week-5 MamaBee batch as DRAFTS (hiccups, baby-led weaning, dream feed,
// allergen introduction, safe sleep). Health-sensitive topics: every article
// carries a medical disclaimer, and the safe-sleep + allergen ones lead with
// the current AAP / NIAID position rather than folklore. Run once:
//   node scripts/week5-articles.mjs
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

  // ─────────────────────────────────────────────────────────────────────────
  A('safe-sleep-guidelines',
    'Safe Sleep for Babies: The Guidelines, Explained Without the Fear',
    'The current AAP safe sleep guidance in plain English — the ABCs, room-sharing, what to do when your baby starts rolling, and which popular products to skip.',
    ['safe sleep guidelines', 'baby safe sleep', 'sids prevention', 'aap safe sleep', 'crib safety'],
    {
      surfaces: {
        caption: 'If a surface is not a crib, bassinet, portable crib or play yard that meets federal safety standards, it is not for sleeping.',
        headers: ['Surface', 'Safe for sleep?', 'Why'],
        rows: [
          ['Crib, bassinet, play yard', 'Yes', 'Firm, flat, meets federal safety standards'],
          ['Car seat (outside the car)', 'No', 'Inclined and can let the head slump forward'],
          ['Couch or armchair with an adult', 'No', 'Among the highest-risk places a baby can sleep'],
          ['Inclined sleeper or lounger', 'No', 'Federal rules now require sleep surfaces to be nearly flat'],
          ['Adult bed', 'Not advised', 'Soft surfaces, bedding and entrapment gaps'],
          ['Swing, bouncer, stroller', 'Move them', 'Fine while awake and watched, not for real sleep'],
        ],
      },
    },
`There is a particular kind of 2 AM panic that only new parents know: you are standing over the bassinet, your baby is finally asleep, and instead of going to bed you are on your phone reading about whether the swaddle is too loose, whether the room is too warm, whether that blanket your aunt knitted is going to be the thing that ruins everything.
Safe sleep guidance is genuinely important. It is also delivered so anxiously that it can leave you more frightened than informed. So here is the whole thing, calmly: what the current guidance actually says, why each rule exists, and what to do when real life collides with the checklist.
## The short version: the ABCs
Almost all of safe sleep compresses into three letters. Every sleep, every nap, every time:
- **A — Alone.** In their own sleep space. No adults, no siblings, no pets, and nothing else in there with them.
- **B — on their Back.** Every single sleep until their first birthday.
- **C — in a Crib.** Or a bassinet, portable crib or play yard that meets current federal safety standards.
That is the core. Everything below is detail on those three.
## Back to sleep, every time
Placing babies on their backs is the single most effective thing that reduced sleep-related infant deaths, and the reason the "Back to Sleep" campaign is considered one of the great public-health wins of the last few decades.
Two worries come up constantly, and both have reassuring answers. **Choking:** healthy babies on their backs do not choke on spit-up. Their airway anatomy actually protects them better in that position than on the stomach. **Flat head:** positional flattening is common and largely preventable with plenty of supervised [tummy time](https://www.realmlabs.app/mamabee/articles/tummy-time-guide) while awake, and by alternating which end of the crib you lay them down at so they turn their head both ways.
Side-sleeping is not a safe alternative. A baby placed on their side can roll to their stomach before they have the neck strength to get out of trouble.
## The sleep surface itself
Firm, flat, and boring. A mattress that meets safety standards, with a tight-fitting sheet, and **nothing else** — no blankets, pillows, quilts, bumpers, stuffed animals, positioners or wedges. If you press the mattress and your hand leaves a dent, it is too soft.
Crib bumpers are no longer a grey area. Padded bumpers and inclined sleepers were banned from the US market under federal law, and sleep surfaces are now required to be nearly flat. If you were given a hand-me-down inclined sleeper, do not use it, however well-loved it was.
[[TABLE:surfaces]]
The couch deserves its own warning. Falling asleep on a sofa or armchair while holding your baby is one of the most dangerous sleep situations there is — more dangerous than an adult bed. If you are feeding at night and feel yourself fading, feed in bed with the pillows and duvet cleared away rather than on the couch, and put your baby back in their own space as soon as you wake.
## Room-sharing, not bed-sharing
The guidance is to sleep your baby in your room, on their own separate surface, **ideally for at least the first six months**. It is associated with a substantially lower risk, and it also makes night feeds far less punishing on you.
Bed-sharing is where guidance and reality argue with each other, and pretending otherwise does not help anyone. The official position is that babies should not sleep in an adult bed. Many exhausted parents do it anyway, especially while breastfeeding. If you know you might, prepare the bed rather than improvising at 3 AM: firm mattress, no duvet, pillows or loose sheets near the baby, no gap between mattress and wall or headboard, baby on their back, nobody in the bed who smokes, has been drinking, has used sedating medication or drugs, and no other children or pets. Risk is highest for babies under four months, babies born premature or small, and any bed-sharing on a couch or recliner.
[[CTA||Log every nap and night stretch in MamaBee — one thumb, in the dark, without waking anyone.]]
## Temperature, pacifiers and the rest
- **Do not overheat.** Dress your baby in one more light layer than you are comfortable in, and no more. Sweating, damp hair or a flushed, hot chest means too warm.
- **No hats indoors.** Babies release a lot of heat through their heads.
- **Offer a pacifier** at naps and bedtime once feeding is going well. It is associated with lower risk. If it falls out after they are asleep, leave it.
- **Keep the air smoke-free**, during pregnancy and after. This one matters more than most people realise.
- **Breastfeeding and staying on schedule with immunizations** are both associated with reduced risk.
- **Skip the home monitors** sold as risk-reducers. Wearable heart-rate and oxygen gadgets marketed to parents have not been shown to prevent anything, and they generate a lot of false alarms and false comfort.
## What about weighted sleep sacks?
Weighted swaddles, sacks and blankets are not recommended for infant sleep. The concern is straightforward: added weight on a small chest and the sedating effect of pressure on a baby who cannot reliably move it off. A plain, correctly-sized sleep sack is the safer way to keep them warm without loose bedding.
## When your baby starts rolling
This is the moment every parent panics, and it is genuinely the point where the rules change.
**Stop swaddling at the first sign of rolling** — often somewhere around 8 to 12 weeks, sometimes earlier. A swaddled baby who rolls onto their stomach cannot push themselves back up, and that is a serious situation. Move to a sleep sack with arms free.
Once your baby can **roll both ways on their own**, you no longer have to flip them back over all night. Keep placing them on their back to start every sleep, keep the space empty, and let them find their own position. This is normal and expected development, not a failure of your vigilance.
## When to call your pediatrician
Call about any pauses in breathing, gasping, persistent noisy or laboured breathing, or a baby who is unusually hard to rouse. Talk to your doctor before deviating from standard guidance if your baby was premature, has reflux that seems severe, or has any medical condition — babies with certain conditions occasionally get individualised advice, and that advice should come from your own doctor rather than the internet.
## Frequently asked questions
### When can my baby sleep with a blanket?
Keep the sleep space empty until at least the first birthday. After 12 months the risk drops considerably, but a sleep sack remains the easier, safer way to keep a toddler warm.
### My baby rolls onto their stomach at night. Do I have to turn them back?
Once they can roll both directions on their own, no. Start every sleep on the back, keep the crib bare, and let them settle where they like.
### Is room-sharing required for a whole year?
The guidance suggests at least six months, with benefit possible up to a year. Six months is the figure most families work to.
### Are inclined sleepers really banned?
Yes. US federal rules require infant sleep products to be nearly flat, and inclined sleepers and padded crib bumpers are off the market. Do not use a hand-me-down one.
### Does a pacifier cause nipple confusion?
Wait until breastfeeding is well established, usually a few weeks, then offer it. At that point it is associated with reduced risk during sleep.
### Do home breathing monitors prevent SIDS?
There is no good evidence that consumer monitors reduce risk, and they produce frequent false alarms. Safe sleep practices are what actually move the needle.
## The takeaway
Alone, on the back, in a crib — firm flat surface, nothing else in it, in your room for the first six months, no smoke, not too warm, pacifier if they will take it. Stop swaddling the moment rolling starts, and once they roll both ways, let them be.
That is the entire list. You do not need to keep reading at 2 AM. **Put the phone down and go to sleep too.**
[[CTA||Get MamaBee free — log every sleep in one thumb-tap, and stop trying to remember at 3 AM.]]
*This article is general information, not medical advice. Guidance is updated periodically — your pediatrician is the right source for your baby, particularly if they were born premature or have any medical condition. In an emergency, call 911.*`),

  // ─────────────────────────────────────────────────────────────────────────
  A('introducing-allergens-to-baby',
    'How to Introduce Allergens to Your Baby (Without the Guesswork)',
    'The advice reversed: early introduction now helps prevent food allergies. Here is when to start each of the nine major allergens, safe first forms, and exactly what a reaction looks like.',
    ['introducing allergens to baby', 'baby food allergies', 'peanut introduction baby', 'early allergen introduction', 'baby allergy signs'],
    {
      allergens: {
        caption: 'Never give whole nuts, and never a spoonful of thick nut butter — both are choking hazards. Thin and mix instead.',
        headers: ['Allergen', 'Safe first form', 'Notes'],
        rows: [
          ['Peanut', 'Smooth peanut butter thinned with water or milk, or peanut puffs', 'The most studied; earliest priority'],
          ['Egg', 'Well-cooked scrambled or hard-boiled, mashed', 'Always fully cooked, never runny'],
          ['Cow milk', 'Yoghurt or cheese', 'Dairy foods yes; milk as a drink waits until 12 months'],
          ['Tree nuts', 'Smooth almond or cashew butter, thinned', 'Introduce individually, not as a blend'],
          ['Sesame', 'Tahini thinned, or hummus', 'A major US allergen since 2023'],
          ['Wheat', 'Iron-fortified wheat cereal, soft pasta', 'Easy to fold into existing meals'],
          ['Soy', 'Tofu, or plain soy yoghurt', 'Soft tofu mashes well'],
          ['Fish', 'Well-cooked flaked salmon or cod', 'Check carefully for bones'],
          ['Shellfish', 'Well-cooked, finely chopped', 'Often introduced a little later'],
        ],
      },
      reaction: {
        caption: 'Mild reactions are managed at home with your doctor. Anything in the right column is a 911 call.',
        headers: ['Mild — call your doctor', 'Severe — call 911 immediately'],
        rows: [
          ['A few hives around the mouth', 'Trouble breathing, wheezing, noisy breathing'],
          ['Mild redness where food touched skin', 'Swelling of the lips, tongue or throat'],
          ['One episode of vomiting', 'Repeated vomiting with pallor or floppiness'],
          ['Loose stool later that day', 'Widespread hives plus any other symptom'],
          ['Mild fussiness after a new food', 'Going pale, limp, blue, or unresponsive'],
        ],
      },
    },
`If your own parents raised you, they were probably told to keep peanuts away from babies until age three. That advice was wrong. Not slightly out of date — actually backwards. Delaying the major allergens appears to have made childhood food allergy more common, not less.
The evidence that flipped it came from a landmark trial that gave peanut to high-risk infants early and found a dramatic reduction in peanut allergy by age five compared with avoiding it. Guidance across the US changed to match. **Early, regular introduction is now what is recommended.**
So if you are standing in your kitchen holding a jar of peanut butter feeling slightly terrified, that is a normal place to be. Here is how to do it methodically.
## When to start
Start allergens **once your baby is eating solids, generally around six months** — and not before four months. Your baby should already be handling a few simple first foods and showing the [usual readiness signs](https://www.realmlabs.app/mamabee/articles/when-to-start-solids): sitting with good head control, interested in food, no longer pushing everything back out with their tongue.
There is one important exception. **If your baby has severe eczema, an existing egg allergy, or both, talk to your pediatrician first.** Those babies are the highest-risk group, and guidance for them is to introduce peanut earlier — commonly around four to six months — sometimes after allergy testing. That is a conversation with your doctor, not a decision to make from an article.
Once a food is in and tolerated, **keep it in.** Regular exposure, roughly a couple of times a week, is what maintains tolerance. Introducing peanut once in July and never again does not count.
## The nine major allergens
In the US, nine foods account for the large majority of food allergies: milk, egg, peanut, tree nuts, soy, wheat, sesame, fish and shellfish. Sesame was added as the ninth major allergen in 2023, so older baby books will not mention it.
[[TABLE:allergens]]
## The method that keeps it manageable
The point of a system is that if something happens, you know exactly which food caused it.
- **One new allergen at a time.** Never debut two on the same day.
- **Morning or early afternoon**, at home, when you can watch your baby for a couple of hours and your doctor's office is open. Not at 6 PM the night before travel.
- **Start tiny.** A quarter-teaspoon on the tip of a spoon. Wait ten minutes. If nothing happens, offer a bit more.
- **Wait a few days** before adding the next new allergen, so a delayed reaction is still attributable.
- **Keep it plain.** No new spices, no new textures, nothing else new that day.
- **Write it down.** Which food, how much, what time, and anything you noticed. Four allergens in, memory will not be reliable.
That last one is where a tracker earns its place — the MamaBee **Solid Food Allergen Test** walks you through the introductions one at a time and keeps the record, so when your pediatrician asks "when did you introduce egg and what happened," you have an actual answer instead of a guess.
[[CTA||Introduce allergens one at a time with MamaBee's Solid Food Allergen Test — and keep a record your pediatrician can actually use.]]
## What a reaction looks like
Most reactions are mild, appear within minutes to about two hours, and never escalate. But you should be able to tell the two categories apart before you start, not while it is happening.
[[TABLE:reaction]]
**If you see anything in the right-hand column, call 911.** Do not drive to the emergency room, do not phone the pediatrician first, and do not wait to see if it settles. Anaphylaxis in babies can look like sudden pallor and floppiness rather than the dramatic throat-closing you might picture.
For a mild reaction, stop the food, call your pediatrician, and ask before offering it again. Do not give antihistamines to a baby without being told to by a doctor.
## Choking safety, which is a separate risk
Allergy and choking are different dangers, and the foods overlap. Regardless of allergies:
- **Never give whole nuts** to a child under four.
- **Never give a spoonful of thick nut butter.** It sticks to the roof of the mouth. Thin it with water, milk or yoghurt until it is easily swallowed, or spread it very thinly.
- Skip whole grapes, popcorn, raw hard vegetables, hard candy and round chunks of hot dog.
- Baby seated upright in a high chair, always supervised, never eating in a car seat or while crawling around.
- **No honey before 12 months**, allergy aside — the risk there is infant botulism.
## What about family history?
A family history of food allergy raises the odds somewhat, but it does not change the basic advice: early introduction is still recommended, and avoidance is not protective. Mention the history to your pediatrician and follow their lead. Notably, avoiding allergens during pregnancy or breastfeeding has not been shown to prevent allergy in the baby.
## Frequently asked questions
### What age should I introduce peanut to my baby?
For most babies, around six months, once solids are established. For babies with severe eczema or egg allergy, guidance is to introduce earlier — often four to six months — after talking to your pediatrician.
### How long should I wait between new allergens?
A few days is the usual advice. That gap makes a delayed reaction traceable to one specific food.
### Does my baby need allergy testing before I start?
Most babies do not. Testing is generally reserved for high-risk infants — severe eczema, existing egg allergy — and is arranged by your doctor. Routine pre-testing is not recommended and can produce misleading results.
### Can I introduce allergens if my baby has eczema?
Yes, and it matters more for those babies, not less. If the eczema is severe, speak with your pediatrician first about timing and whether testing is warranted.
### What if my baby refuses the food?
Refusal is not a reaction. Offer it again another day in a different form — babies often need many exposures before accepting something new.
### Do I need to keep giving it after the first taste?
Yes. Regular ongoing exposure, a couple of times a week, is what maintains tolerance. Introduce and then abandon is not the same as introducing.
## The takeaway
Start around six months, one allergen at a time, in the morning at home, in tiny amounts, thinned and never whole. Know the difference between a few hives and trouble breathing before you begin. Keep the foods your baby tolerates in regular rotation, and write down what you did.
And if your baby has severe eczema, make the pediatrician call this week rather than next — **for that group, timing genuinely matters.**
[[CTA||Get MamaBee free — and let the Solid Food Allergen Test keep the record for you.]]
*This article is general information, not medical advice. Talk to your pediatrician before introducing allergens, especially if your baby has severe eczema, an existing food allergy, or a strong family history. If you see any sign of a severe reaction, call 911 immediately.*`),

  // ─────────────────────────────────────────────────────────────────────────
  A('baby-led-weaning',
    'Baby-Led Weaning: How to Start, What Is Safe, and What to Skip',
    'What baby-led weaning actually involves, how to cut food safely at each stage, the difference between gagging and choking, and why you do not have to pick a side.',
    ['baby led weaning', 'blw first foods', 'baby led weaning vs purees', 'safe food shapes baby', 'gagging vs choking'],
    {
      approach: {
        caption: 'Most families end up doing some of both. That is not cheating.',
        headers: ['', 'Baby-led weaning', 'Purees'],
        rows: [
          ['Who holds the food', 'Baby', 'Usually you'],
          ['Typical start', 'Around 6 months', 'From about 4–6 months'],
          ['Texture skills', 'Practised early', 'Introduced gradually later'],
          ['Mess', 'Considerable', 'Manageable'],
          ['How much they ate', 'Hard to judge', 'Easy to measure'],
          ['Gagging early on', 'Common and normal', 'Less frequent'],
        ],
      },
      shapes: {
        caption: 'The squish test: if you cannot flatten it between your thumb and forefinger, it is too firm for a baby.',
        headers: ['Stage', 'Cut it like this', 'Example'],
        rows: [
          ['About 6 months', 'Finger-length strips they can palm', 'Roasted sweet potato wedge, avocado spear'],
          ['About 6 months', 'Long enough to stick out of a closed fist', 'Steamed broccoli with a stalk handle'],
          ['About 9 months', 'Pea-sized pieces, once pincer grasp appears', 'Soft diced pear, well-cooked pasta'],
          ['Any stage', 'Grapes and cherry tomatoes quartered lengthwise', 'Never served whole or halved crosswise'],
          ['Any stage', 'Nut butter thinned, never a thick spoonful', 'Stirred into yoghurt or oatmeal'],
        ],
      },
    },
`The first time your baby gags on a piece of food, you will consider abandoning baby-led weaning forever. Your heart rate will go somewhere unpleasant, they will make a sound you have never heard, and then they will push the offending broccoli forward, chew it, and reach for more while you sit there recovering.
That moment is the whole learning curve of BLW compressed into ten seconds. Here is what it actually is, how to do it safely, and why the "BLW versus purees" argument is much less important than the internet suggests.
## What baby-led weaning actually means
Instead of spoon-feeding purees and thickening the texture over months, you offer **soft, appropriately-shaped finger foods from the start** and let your baby feed themselves. They decide what goes in, how much, and how fast.
The claimed benefits — better self-regulation of appetite, earlier comfort with textures, less fuss at family meals — are plausible and popular with parents, though the research is not as decisive as either camp likes to claim. What is clear is that it is a reasonable, safe way to start solids when it is done properly, and that "properly" is doing real work in that sentence.
[[TABLE:approach]]
**You do not have to choose.** A yoghurt you spoon in, and a strip of roasted sweet potato they hold themselves, at the same meal, is completely fine. Most families land there anyway.
## When to start
The same readiness signs apply as for [starting solids](https://www.realmlabs.app/mamabee/articles/when-to-start-solids) generally, and BLW specifically needs the sitting one to be solid:
- **Around six months**, not before
- Can **sit upright with little or no support**, with steady head control
- Has lost the tongue-thrust reflex that pushes food back out
- Actively interested — watching your food, reaching, opening their mouth
If your baby is still slumping in the high chair, they are not ready to self-feed. Give it a couple of weeks.
Milk stays the main event. Breast milk or formula remains your baby's primary nutrition **until twelve months** — early solids are for practice, exposure and iron, not calories. Do not drop milk feeds because meals seem to be going well.
## How to cut food so it is safe
This is the part that actually matters, and it is more specific than "soft food."
[[TABLE:shapes]]
Two rules cover most situations. **The squish test:** you should be able to flatten the piece between your thumb and forefinger. If you cannot, it is too firm. **The shape rule:** early on, pieces should be long — roughly the length of an adult finger — so your baby can hold them in a fist with a bit sticking out to gnaw on. Babies cannot pick up small pieces until the pincer grasp arrives around nine months, and round pieces are the ones that block an airway.
## Foods to avoid entirely
- **Whole nuts** — no child under four
- **Whole or halved grapes, cherry tomatoes, large blueberries** — quarter them lengthwise
- **Popcorn, hard candy, marshmallows, chunks of hard cheese**
- **Raw hard vegetables** — raw carrot sticks, apple chunks. Cook or grate them
- **Round coins of hot dog or sausage** — quarter lengthwise if you serve them at all
- **Thick spoonfuls of nut butter** — thin it into something else
- **Honey before twelve months** — infant botulism risk
- **Added salt and sugar** — babies' kidneys do not handle salt well, so cook their portion before you season yours
## Gagging is not choking
Learning the difference will save you a great deal of unnecessary terror.
**Gagging is loud, red-faced, and productive.** Your baby coughs, retches, their eyes water, and food comes forward. It is a protective reflex — and in babies it triggers much further forward on the tongue than in adults, which is precisely why it happens so often at first. **Gagging means the system is working.** Stay calm, stay close, and let them sort it out. Reaching into their mouth can push food backwards and turn a non-event into an emergency.
**Choking is quiet.** No sound, no effective cough, possibly a look of panic, lips going blue. That is when you act immediately.
Because of that distinction, do two things before you start BLW: **take an infant CPR and choking-response class**, and set the ground rules — baby always upright in a high chair, never in a car seat or reclined, always within arm's reach, never eating while crawling, walking or in the car, and no screens or games at mealtimes.
[[CTA||Log first foods, textures and reactions in MamaBee — so you can actually remember what worked.]]
## Iron matters more than variety at first
Babies are born with iron stores that begin running low around six months, and breast milk is not a major iron source. Whatever method you use, put iron-rich foods in early and often: well-cooked soft meat strips, lentils and beans mashed or in soft patties, tofu, iron-fortified infant cereal, and dark leafy greens cooked soft. Pairing them with vitamin C — a little fruit alongside — helps absorption.
## What the first month realistically looks like
Very little food will be eaten. Expect one small meal a day at first, building toward two or three by around eight or nine months. Expect food in the hair, on the floor, and in places you did not know food could reach. Expect days where they eat nothing at all and days where they demolish everything.
Expect, too, that your job is only to **offer** — what to eat and how much is theirs. Pressuring a baby to take one more bite is the fastest route to a genuinely difficult eater later. And do not read too much into the diaper: whole recognisable pieces of food coming out the other end is completely normal in the first weeks.
## Frequently asked questions
### Is baby-led weaning safe?
Yes, when foods are prepared and shaped correctly and the baby is truly ready. Studies have not found that BLW meaningfully increases choking risk compared with spoon-feeding, provided the safety rules are followed — which is exactly why the cutting and supervision rules are non-negotiable.
### Can I do both baby-led weaning and purees?
Absolutely, and most families do. The combination is not a compromise or a failure of commitment.
### What are the best first foods for baby-led weaning?
Soft, iron-rich, and easy to hold: roasted sweet potato wedges, avocado spears, steamed broccoli with a stalk to grip, soft-cooked meat strips, banana with a bit of peel left as a handle.
### My baby gags at every meal. Should I stop?
Usually not. Frequent gagging in the first weeks is normal and tends to settle quickly as they learn. Persistent gagging past the early weeks, or gagging with distress and no progress, is worth mentioning to your pediatrician.
### How much should my baby actually eat?
At first, barely anything, and that is fine. Milk covers their nutrition until twelve months. Follow their appetite rather than a target.
### When can my baby eat what we eat?
Progressively through the first year, with three caveats that persist: no added salt, no honey before twelve months, and no choking-hazard shapes.
## The takeaway
Wait for real sitting ability at around six months, cut food into long soft strips they can squish, move to pea-sized pieces once the pincer grasp appears, and never serve the hazard list. Learn the difference between gagging and choking before the first meal, take a choking-response class, and stay within arm's reach.
Then let them make a mess. **Your job is what goes on the tray — theirs is what goes in.**
[[CTA||Get MamaBee free — track first foods, textures and reactions without the notebook.]]
*This article is general information, not medical advice. Talk to your pediatrician about when and how to start solids, especially if your baby was premature or has any feeding, developmental or medical concerns.*`),

  // ─────────────────────────────────────────────────────────────────────────
  A('dream-feed',
    'The Dream Feed: How to Do It, When It Works, and When to Drop It',
    'A dream feed can buy you a longer first stretch of sleep — or backfire completely. How to do one properly, how to tell within two weeks if it is working, and how to stop.',
    ['dream feed', 'how to dream feed', 'dream feed baby', 'baby sleep longer stretch', 'night feeds'],
    {
      working: {
        caption: 'Give it ten to fourteen nights, then read the pattern honestly.',
        headers: ['It is working if…', 'It is not working if…'],
        rows: [
          ['The first stretch after it is longer than before', 'They wake at the same time regardless'],
          ['They take it half-asleep and settle straight back', 'They wake fully and take an hour to resettle'],
          ['You are getting a genuine 4–5 hour block', 'You are now awake at 10:30 for no gain'],
          ['Night wakings dropped from three to two', 'A new early-morning waking appeared'],
          ['They feed well at the next morning feed', 'Morning appetite has dropped off'],
        ],
      },
    },
`The dream feed is one of the few baby sleep techniques that costs you nothing to try and occasionally changes your life. The pitch is simple: rather than going to bed at 10:30 PM and being woken at 11:15, you feed your baby just before you turn in — while they are still mostly asleep — and buy yourself a longer unbroken block.
Sometimes it works beautifully. Sometimes it wakes a baby who would have slept another two hours, and you have made your night worse. Here is how to tell which one you have.
## What a dream feed actually is
A feed offered while your baby stays asleep or nearly asleep, usually **somewhere between 10 PM and 11 PM** — timed to just before your own bedtime, not to the clock.
The logic is about aligning your sleep with theirs. Most young babies have a long first stretch after bedtime. If bedtime is 7 PM and the stretch is five hours, they wake at midnight — but you did not go to bed at 7, so you only got two hours. Top them up at 10:30 and the same five-hour stretch lands at 3:30 AM instead, with you asleep for most of it.
You are not adding a feed. You are **moving one earlier**, into a slot where it costs you nothing.
## When to try it
Most families have the best luck **from around eight weeks to four months**, though it can work either side of that. Before about six to eight weeks, babies feed so frequently that a dream feed rarely changes the pattern. Much past six months, many babies no longer need a night feed at all and the dream feed becomes an interruption rather than a help.
It is worth a try if your baby reliably wakes to feed somewhere between 11 PM and 1 AM, and you are going to bed shortly before that. It is not worth trying if they already sleep through, or if they wake every ninety minutes regardless — that is a different problem, usually about [wake windows](https://www.realmlabs.app/mamabee/articles/wake-windows-by-age) or how they fall asleep at bedtime.
## How to actually do one
- **Do not turn on the lights.** A nightlight at most. No talking, no eye contact, no nappy change unless it is genuinely needed.
- **Lift them gently.** Slide a hand under and bring them to you slowly. Sudden lifting wakes babies fully.
- **Stroke the lips or cheek** to trigger rooting rather than forcing the nipple or teat in. Most babies will latch half-asleep.
- **Let them take what they want.** This is usually a shorter feed than a daytime one. Do not push for a full volume.
- **Burp them upright**, gently, for a few minutes. Skipping this is the most common reason a dream feed ends in a wide-awake baby at midnight with [trapped wind](https://www.realmlabs.app/mamabee/articles/newborn-gas-relief).
- **Back down on their back**, in the same sleep space, and leave.
The entire thing should take ten to fifteen minutes. If it routinely takes forty, it is not a dream feed — it is a night feed you have moved earlier, which is a different and less useful thing.
[[CTA||Track the first long stretch in MamaBee and see in a week whether the dream feed is really buying you sleep.]]
## Is it working? Read it after two weeks
The mistake is judging it after two nights. Babies are noisy, variable and going through something roughly every fortnight. Give it **ten to fourteen nights** and then look at the pattern rather than last night.
[[TABLE:working]]
If the right-hand column describes your nights, stop. There is no prize for persisting, and a meaningful minority of babies simply sleep worse when disturbed at 10:30. You have lost nothing but two weeks.
## Common problems
**They wake fully and will not resettle.** Try shifting it thirty minutes earlier or later — you may be catching them at the wrong point in a sleep cycle. If two weeks of adjusting does not help, this baby is not a dream feed baby.
**They will not latch while asleep.** Some babies need to be slightly more awake. Try a nappy change first to rouse them a little, then feed and settle. If that reliably ends in a fully awake baby, abandon it.
**They now wake at 4 AM instead.** Progress, arguably — that is one waking rather than two. Give it another week before deciding.
**Reflux or heavy spit-up.** Keep them upright longer after the feed, and talk to your pediatrician before continuing a lying-down top-up if spit-up is significant.
## How to drop it
Most families stop somewhere between six and nine months, or whenever it stops earning its place. Two ways:
**Taper.** Reduce a bottle by about half an ounce every two or three nights, or shorten nursing by a couple of minutes, until it is negligible — then stop. Gentler on your supply if you are breastfeeding, and easier on your baby.
**Just stop.** If your baby is over six months, eating solids well, gaining weight normally and only taking a token amount at the dream feed, dropping it outright often costs you nothing. Expect two or three unsettled nights.
Talk to your pediatrician before dropping any night feed if there have been weight-gain concerns, if your baby was premature, or if you are unsure. Do not drop it during illness, teething, or the week of a big change like starting daycare.
## Frequently asked questions
### What time should the dream feed be?
Just before you go to bed, typically 10 to 11 PM. Time it to your bedtime rather than the clock — the whole point is protecting your first block of sleep.
### Should I wake my baby for a dream feed?
Not fully. Rouse them just enough to feed. If a genuine wake-up is the only way it works, the technique is probably not right for your baby.
### Do I need to burp after a dream feed?
Yes. A few minutes upright. Skipping it is the single most common reason the feed backfires an hour later.
### Does a dream feed help babies sleep through the night?
For some, meaningfully. For others, not at all, and a few sleep worse. Two weeks of honest tracking will tell you which you have.
### Can I dream feed a breastfed baby?
Yes. Some parents find a bottle of expressed milk easier to give without fully rousing, but nursing works fine and many babies latch half-asleep without trouble.
### At what age should I stop dream feeding?
Commonly six to nine months, or sooner if it stops helping. There is no fixed deadline.
## The takeaway
Feed just before your own bedtime, keep it dark and dull, burp properly, and put them straight back down. Judge it over two weeks rather than two nights. If it buys you a longer first block, keep it. If you are now awake at 10:30 for nothing, drop it without guilt.
It is a tool for **your** sleep as much as your baby's — and a tired parent is a legitimate thing to optimise for.
[[CTA||Get MamaBee free — see your baby's real sleep pattern instead of guessing at it.]]
*This article is general information, not medical advice. Talk to your pediatrician before adding or dropping night feeds, particularly if your baby was premature or there have been any concerns about weight gain.*`),

  // ─────────────────────────────────────────────────────────────────────────
  A('newborn-hiccups',
    'Newborn Hiccups: Why They Happen and What Actually Helps',
    'Newborn hiccups are extremely common and almost always harmless. Why they happen so often, the few things that genuinely help, what to skip, and the rare signs worth a call.',
    ['newborn hiccups', 'baby hiccups', 'how to stop baby hiccups', 'hiccups after feeding baby', 'newborn hiccups sleep'],
    {
      helps: {
        caption: 'Most hiccups stop on their own within ten minutes. Prevention beats treatment.',
        headers: ['Try this', 'Why it helps', 'Skip this'],
        rows: [
          ['Burp mid-feed, not just after', 'Releases trapped air before it builds', 'Startling or scaring them'],
          ['Check the latch or teat size', 'Less swallowed air at source', 'A drink of water under 6 months'],
          ['Hold upright 15–20 minutes after', 'Lets air rise and escape', 'Holding them upside down'],
          ['Offer a pacifier', 'Sucking can settle the diaphragm', 'Gripe water as a routine fix'],
          ['Slow the feed down', 'Gulping is the main trigger', 'Pressing on the soft spot'],
          ['Simply wait', 'They resolve by themselves', 'Waking a sleeping baby'],
        ],
      },
    },
`Your newborn has just finished a feed. They are milk-drunk, floppy, perfect — and then their whole tiny body starts jolting every four seconds, and does not stop for twelve minutes. You hover, you google, you wonder whether you are doing something wrong.
You almost certainly are not. **Newborn hiccups are one of the most common and least dangerous things babies do.** Here is why they happen so relentlessly, the handful of things that genuinely help, and the small number of signs that deserve a phone call.
## Why newborns hiccup so much
A hiccup is a sudden involuntary contraction of the diaphragm — the sheet of muscle under the lungs — followed by the vocal cords snapping shut, which produces the sound.
Babies do this far more than adults for a few overlapping reasons. Their diaphragm and the nerves controlling it are still maturing, so the reflex is triggered easily. They **swallow air** while feeding, especially when gulping, and a stretched stomach presses on the diaphragm from below. And it starts long before birth: many people feel rhythmic fetal hiccups in the third trimester, and researchers suspect they play a role in developing breathing control.
The frequency drops off substantially over the first year as the system matures. In the newborn weeks, several bouts a day is completely ordinary.
## Do hiccups bother your baby?
Overwhelmingly, no. This surprises people, because hiccups are unpleasant for adults. Watch your baby during a bout and you will usually see them entirely unbothered — often continuing to feed, or sleeping straight through.
If your baby seems genuinely distressed, arches their back, cries hard during hiccups or spits up heavily with them, that is worth attention — not because the hiccups are dangerous, but because it may point to reflux or discomfort underneath.
## What actually helps
Honest summary first: **most of the folk remedies do not work, and most hiccups stop on their own within about ten minutes.** The useful interventions are preventive.
[[TABLE:helps]]
The two that make the biggest real-world difference:
**Burp during the feed, not only at the end.** Pause halfway through a bottle, or when switching sides while nursing, and burp then. Swallowed air is the main trigger, and getting it out before it accumulates prevents more hiccups than anything you do afterwards.
**Fix how fast the milk is coming.** Frantic gulping means more swallowed air. If bottle feeding, a slower-flow teat often solves it outright — and check the teat is full of milk rather than half air. If nursing, a very fast letdown can overwhelm a small baby; feeding in a more reclined position, or expressing a little before latching, can settle it.
[[CTA||Track feeds, burps and patterns in MamaBee — and stop guessing at what set your baby off.]]
## What to skip
- **Water.** Do not give water to a baby under six months for hiccups or anything else. Their kidneys cannot handle the extra fluid load, and it can cause a dangerous drop in blood sodium.
- **Gripe water and hiccup drops.** These are sold as supplements rather than medicines, are not regulated like drugs, and are not recommended as routine remedies. Ask your pediatrician before giving your baby any supplement.
- **Startling them.** The adult trick of a sudden shock is useless in babies, and unkind.
- **Holding them upside down, pressing the fontanelle, or pulling on the tongue.** None of these are safe or effective. The soft spot in particular should never be pressed.
- **Waking a sleeping baby.** Babies hiccup through sleep without waking, and it does not affect their breathing. Let them sleep.
## Hiccups and reflux
Frequent hiccups sometimes travel with reflux, because both involve a stretched stomach and an immature valve at the top of it. Hiccups on their own mean nothing. Hiccups **alongside** a cluster of other signs are worth mentioning at your next appointment:
- Frequent forceful spit-up, especially projectile
- Arching the back and crying during or straight after feeds
- Refusing feeds, or feeding in short unhappy bursts
- Poor weight gain
- Persistent coughing or congestion after feeds
Ordinary spit-up in a comfortable, growing baby is a laundry problem, not a medical one. The combination above is the version worth raising.
## Hiccups during sleep
Very common and not a concern. Hiccups do not interfere with breathing, and babies are generally undisturbed by them. Keep the [safe sleep](https://www.realmlabs.app/mamabee/articles/safe-sleep-guidelines) rules as normal — on the back, firm flat surface, nothing in the crib. Do not prop them up or add a wedge to "help with hiccups"; inclined sleep surfaces are not safe.
## When to call your pediatrician
Get in touch if:
- Hiccups seem to cause real, repeated distress
- A bout goes on **more than a couple of hours**, or they happen almost continuously
- They come with vomiting, difficulty breathing, choking or colour change
- Your baby is feeding poorly or not gaining weight as expected
- They are still very frequent well past the first year
Any breathing difficulty, blue or grey colouring, or a baby who is hard to rouse is an emergency — call 911.
## Frequently asked questions
### Why does my newborn get hiccups after every feed?
Because feeding is the trigger: a full stomach and swallowed air both irritate the still-maturing diaphragm. Burping mid-feed and slowing the flow are the most effective preventions.
### Should I feed my baby to stop the hiccups?
Not specifically for hiccups. If they are due a feed, feed them. Adding an unneeded feed puts more into an already stretched stomach.
### Can I give my baby water for hiccups?
No. Water is not safe for babies under six months. It can dilute blood sodium to dangerous levels.
### Does gripe water stop hiccups?
There is no good evidence for it, and these products are not regulated as medicines. Ask your pediatrician before giving any supplement.
### Do hiccups mean my baby has reflux?
Not by themselves. Only in combination with forceful spit-up, feeding distress, arching or poor weight gain is reflux worth investigating.
### Should I wake my baby if they hiccup while asleep?
No. Hiccups do not affect breathing. Let them sleep.
### When do newborn hiccups stop?
Individual bouts usually pass within ten minutes. Overall frequency falls steadily through the first year as the diaphragm and nerves mature.
## The takeaway
Hiccups are normal, harmless, and mostly a sign of a small body still calibrating itself. Burp halfway through feeds, slow the flow, keep them upright for fifteen minutes afterwards, and otherwise leave them alone. Never give water under six months, and never press the soft spot.
Nine times out of ten, **the right response to newborn hiccups is to do nothing at all** — which, at three weeks in, is a genuinely nice thing to be told.
[[CTA||Get MamaBee free — spot the feeding patterns behind the hiccups in a week, not a month.]]
*This article is general information, not medical advice. Contact your pediatrician if your baby seems distressed, is not gaining weight, or if hiccups come with vomiting or breathing difficulty. In an emergency, call 911.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const t = doc.body.filter((b) => b._type === 'comparisonTable').length
  const c = doc.body.filter((b) => b._type === 'appCta').length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${t} tables, ${c} CTA)`)
}
console.log('\nDone — DRAFTS only. Nothing is live. Covers still needed before publishing.')
