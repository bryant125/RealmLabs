// Week-14 MamaBee "N month old schedule" series, part A: 8 and 9 month old sleep schedules
// as DRAFTS only (never published by this script). Numbers follow the series canonical
// sheet (wake windows, naps, feeds) and every medical claim cites a source listed at the
// end of its article. Cover images are copied from a related published article.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week14-schedules-a.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week14-schedules-a.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[IMG:')){const[name,caption,alt]=line.slice(6,line.indexOf(']]')).split('|');if(!shots[name])throw new Error('missing screenshot: '+name);out.push(img(name,caption,alt))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
const A=(slug,title,description,tags,tables,body)=>({slug,title,description,tags,tables,body})

// Related published article whose coverImage each draft copies (fallbacks in order).
const COVERS = {
  '8-month-old-schedule': ['baby-nap-transitions', 'baby-separation-anxiety', 'wake-windows-by-age'],
  '9-month-old-schedule': ['baby-separation-anxiety', 'baby-led-weaning', 'baby-bedtime-routine'],
}

const articles = [

  A('8-month-old-schedule',
    '8 Month Old Sleep Schedule: Sample Day, Naps & Feeds',
    'A sample 8 month old sleep schedule with 2 naps, wake windows, milk feeds and 3 meals, plus the 8 month regression, crib safety and finger foods.',
    ['8 month old sleep schedule', '8 month old schedule', '8 month old feeding schedule', '8 month old nap schedule', '8 month old routine'],
    {
      glance: {
        caption: '8 month old sleep schedule at a glance (typical ranges)',
        headers: ['What', 'Typical at 8 months'],
        rows: [
          ['Wake window', '2.75 to 3.5 hours, shortest in the morning and longest before bed'],
          ['Naps', '2 for most babies; a few are still finishing the drop from 3'],
          ['Day sleep', 'About 2.5 to 3 hours in total'],
          ['Night sleep', '10 to 12 hours; some babies still wake to feed'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', '4 to 5 a day; breastfed babies may nurse more often'],
          ['Amount per bottle', '6 to 8 oz of formula; no more than about 32 oz a day (AAP)'],
          ['Solids', '2 to 3 small meals a day, with more soft finger foods'],
          ['Water', 'Sips from an open, straw or sippy cup with meals; no more than 8 oz a day (AAP)'],
        ],
      },
      sample: {
        caption: 'Sample 8 month old sleep schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breastfeed or a 6 to 8 oz bottle'],
          ['8:00 AM', 'Solids: breakfast', 'For example, iron-fortified cereal with mashed fruit, or scrambled egg'],
          ['10:00 AM', 'Nap 1 (about 1 hr 30 min)', 'Wake window: 3 hr'],
          ['11:30 AM', 'Wake up, milk feed', 'Floor play: crawling, pulling up, practicing sitting down again'],
          ['12:30 PM', 'Solids: lunch', 'The third meal. Start it when your baby is ready'],
          ['2:45 PM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 3 hr 15 min'],
          ['4:00 PM', 'Wake up, milk feed', 'Outdoor time, books, play'],
          ['5:45 PM', 'Solids: dinner', 'Eat together as a family when you can'],
          ['6:45 PM', 'Bedtime routine and milk feed', 'Bath or wash, pajamas, book, song'],
          ['7:30 PM', 'Asleep for the night', 'Wake window: 3 hr 30 min. Some babies still wake once to feed'],
        ],
      },
      early: {
        caption: 'Variation: 6:00 AM early riser, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:00 AM', 'Wake up, milk feed', 'If your baby stirs earlier, keep the room dark and quiet until 6'],
          ['7:00 AM', 'Solids: breakfast', ''],
          ['8:45 AM', 'Nap 1 (about 1 hr 30 min)', 'Wake window: 2 hr 45 min'],
          ['10:15 AM', 'Wake up, milk feed', ''],
          ['11:30 AM', 'Solids: lunch', ''],
          ['1:30 PM', 'Nap 2 (about 1 hr 30 min)', 'Wake window: 3 hr 15 min'],
          ['3:00 PM', 'Wake up, milk feed', ''],
          ['5:00 PM', 'Solids: dinner', ''],
          ['5:45 PM', 'Bedtime routine and milk feed', ''],
          ['6:30 PM', 'Asleep for the night', 'Wake window: 3 hr 30 min'],
        ],
      },
      feeding: {
        caption: '8 month old feeding schedule: milk and solids through the day (matches the 7:00 AM sample)',
        headers: ['Time', 'Milk', 'Solids'],
        rows: [
          ['7:00 AM', 'Breastfeed or a 6 to 8 oz bottle on waking', ''],
          ['8:00 AM', '', 'Breakfast: iron-fortified cereal or egg, plus soft fruit'],
          ['11:30 AM', 'Breastfeed or bottle after nap 1', ''],
          ['12:30 PM', '', 'Lunch: soft vegetables with beans, lentils or yogurt (once your baby is on 3 meals)'],
          ['4:00 PM', 'Breastfeed or bottle after nap 2', ''],
          ['5:45 PM', '', 'Dinner: soft, small pieces of family food, such as shredded chicken, soft pasta and cooked vegetables'],
          ['6:45 PM', 'Breastfeed or bottle at bedtime', ''],
          ['Overnight', 'Some babies still have 1 feed', ''],
          ['Daily total', '4 to 5 feeds; formula about 32 oz or less (AAP)', '2 to 3 small meals, plus sips of water with meals (up to 8 oz a day)'],
        ],
      },
    },
`**A typical 8 month old sleep schedule has 2 naps, wake windows of about 2.75 to 3.5 hours and about 2.5 to 3 hours of day sleep, plus 10 to 12 hours at night. Most 8 month olds take 4 to 5 milk feeds of 6 to 8 ounces, eat 2 to 3 small meals and go to bed between 6:30 and 8 PM.**
Eight months is a busy age. Many babies are crawling, pulling up on the sofa and protesting when you leave the room. Most have settled into two naps, and three meals are on the way.
The schedule below is a starting point, not a test. If last month's day still fits better, look back at the [7 month old schedule](/mamabee/articles/7-month-old-schedule).
## 8 month old sleep schedule at a glance
[[TABLE:glance]]
These are typical ranges, not exact targets. The American Academy of Sleep Medicine (AASM) says babies from 4 to 12 months need 12 to 16 hours of sleep in 24 hours, naps included, so look at the whole day rather than one nap.
## Sample 8 month old sleep schedule
This sample uses a 7:00 AM wake-up, two naps and wake windows that grow through the day: 3 hours before the first nap, 3 hours 15 minutes before the second and 3.5 hours before bed.
[[TABLE:sample]]
That adds up to about 2 hours 45 minutes of day sleep and about 11.5 hours at night, with four milk feeds during the day. A night feed, if your baby still has one, makes five. Both are normal.
### Variation: the 6:00 AM early riser
If your baby is reliably up at 6, shift the whole day earlier instead of stretching the morning. The first wake window is a little shorter here, and bedtime moves to 6:30 PM.
[[TABLE:early]]
This day has about 3 hours of day sleep and about 11.5 hours at night.
## Sleep at 8 months
### Settling into 2 naps
Most 8 month olds take a morning and an early afternoon nap, about 2.5 to 3 hours in total. If the total is in range and your baby is mostly cheerful when awake, the pattern is working.
Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains how they change, and the [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) builds a day around your baby's wake-up time. The [wake window calculator](/mamabee/tools/wake-window-calculator) helps on days that go off script.
### Finishing the move from 3 naps to 2
If your baby still takes a third nap some days, you are probably near the end of the transition. Signs it is time to drop it for good:
- Fighting or skipping the third nap most days
- The third nap pushing bedtime past 8 PM
- Staying happy through a 3-hour wake window
To finish:
- **Lengthen wake windows gradually**, by about 15 minutes every few days, toward the ranges above.
- **Use an earlier bedtime as the bridge.** On a short-nap day, bedtime at 6:30 PM is better than a late catnap.
- **If you need a catnap, keep it short** (20 to 30 minutes) and end it by about 5 PM so bedtime still lands by 8 PM.
Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide covers every nap drop through toddlerhood.
### The 8 month sleep regression
Many parents notice sleep falling apart somewhere around 8 to 10 months: more night waking, shorter naps and protests at bedtime. "Sleep regression" is a popular term, not a medical diagnosis, but the bump is real for many families. The Sleep Foundation links it to teething, separation anxiety, greater awareness of the world and new physical skills, and describes it as normally short-lived.
Keep the routine steady, give lots of daytime floor time for new skills, and use an earlier bedtime when naps go short. Our full guide to the [8 month sleep regression](/mamabee/articles/8-month-sleep-regression) goes deeper, and [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) shows how this one compares with the [4 month sleep regression](/mamabee/articles/4-month-sleep-regression).
### Separation anxiety at bedtime
The AAP says separation anxiety often begins around this age and usually peaks between 10 and 18 months. It can show up at bedtime: your baby may resist going to sleep without you or wake at night looking for you.
- **Keep the routine the same every night.** Bath or wash, pajamas, milk, book, song, bed. Predictability is reassuring.
- **Say goodnight warmly and briefly.** Lingering often makes the protest longer.
- **Check in calmly if needed**, with short, quiet visits.
- **Practice small separations in the day.** Peek-a-boo and saying "be right back" as you leave the room help your baby learn that you return.
More ideas are in our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide and [bedtime routine](/mamabee/articles/baby-bedtime-routine) guide.
### Crawling, pulling up and crib safety
The AAP says crawling is usually mastered between 7 and 10 months, and some babies scoot instead, which is fine if they use both sides of the body equally. Many also pull up to stand, often in the crib.
- **Lower the crib mattress.** The AAP says to set it at its lowest position before your baby learns to stand. If your baby is already pulling up, do it now.
- **Keep the crib empty:** a fitted sheet only. No pillows, blankets, bumpers or stuffed toys before 12 months.
- **Keep the crib away from windows** and blind cords.
- **Back to sleep is still the rule**; if your baby rolls over on their own, you do not need to turn them back.
- **Use a sleep sack with free arms**, not a swaddle. See [dressing baby for sleep](/mamabee/articles/dressing-baby-for-sleep) and our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines).
If your baby stands in the crib and cannot get down, practice lowering to the floor during the day, and at night lay them down gently with little talking.
### Night sleep and night feeds
Most 8 month olds sleep about 10 to 12 hours at night, but many still wake, and some still feed once. Your pediatrician can tell you whether your baby still needs a night feed. When you are ready to work on longer stretches, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night) and [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods).
## 8 month old feeding schedule
Breast milk or formula is still your baby's main drink at 8 months. Solids are growing, but they add to milk rather than replace it. Here is how milk and meals fit around the 7:00 AM sample day.
[[TABLE:feeding]]
### How much milk does an 8 month old need?
- **Formula or bottle-fed:** the AAP says babies typically take 6 to 8 ounces at each of 4 or 5 feeds by 6 months. Keep the daily total to about 32 ounces or less.
- **Breastfed:** keep nursing on cue. Breastfed babies often feed a little more often than bottle-fed babies.
- **As meals grow,** many babies drink a little less. The AAP's sample menu for 8 to 12 month olds works out to around 24 ounces a day.
Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a rough estimate, and [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows what changes next. No cow's milk as a drink and no juice before 12 months (AAP).
### Moving to 3 meals
Many 8 month olds are ready for a third meal. The AAP's sample menu suggests about 2 to 4 ounces of each food, but appetite varies. Stop when your baby turns away or closes their lips.
- **Offer foods from different groups:** vegetables, fruits, meat or other proteins, yogurt and cheese without added sugar, and whole grains like infant cereals (CDC).
- **Include iron-rich foods** like fortified cereal, meat, eggs and beans.
- **Move to thicker textures.** Around 8 months, the AAP says you can move from smooth purees to coarser, softer foods, such as oatmeal, mashed banana, mashed potato and lumpy purees.
- **Keep offering common allergens** once tolerated, such as egg, dairy, wheat, thinned peanut, sesame and fish. See [introducing allergens to your baby](/mamabee/articles/introducing-allergens-to-baby).
### Finger foods
Once your baby can sit up and bring things to their mouth, the AAP says you can offer finger foods that are soft, easy to swallow and cut into small pieces. Try small pieces of banana, scrambled egg, well-cooked pasta and soft cooked vegetables. Expect plenty of mess. Our [baby-led weaning](/mamabee/articles/baby-led-weaning) guide covers self-feeding.
### Choking safety
- **Seat your baby upright** in a high chair for every meal and snack, never lying down, crawling, in a car seat or a stroller (CDC).
- **Watch your baby the whole time** they eat.
- **Cut food small and soft:** pieces no larger than half an inch, and round foods like grapes cut into tiny pieces (AAP).
- **Skip choking hazards:** whole nuts and seeds, nut butter by the spoonful, popcorn, hot dogs and sausages, chunks of meat or cheese, whole grapes, hard raw vegetables and apple, raisins and hard or sticky candy.
### Drinks and cups
Offer sips of water from an open, straw or sippy cup with meals, no more than 8 ounces a day (AAP). Cup practice now makes moving off the bottle easier later, which the AAP suggests finishing between 12 and 18 months. See [when can babies drink water](/mamabee/articles/when-can-babies-drink-water).
[[CTA||See naps, milk feeds and new foods on one timeline with MamaBee.]]
## What's new at 8 months
### Milestones
By 9 months, the CDC lists these among the things most babies do:
- Is shy, clingy or fearful around strangers
- Reacts when you leave, by looking, reaching for you or crying
- Gets to a sitting position by themselves and sits without support
- Moves things from one hand to the other
- Looks for objects when they drop out of sight, like a spoon or toy
See [baby milestones by month](/mamabee/articles/baby-milestones-by-month). The AAP says to tell your pediatrician if your baby is not sitting alone by 9 months.
### Teething
The AAP says first teeth usually appear between 6 and 10 months, and drooling and fussiness are common. Teething does not cause fever or diarrhea, so call your pediatrician if you see those. A cold teething ring helps; the AAP advises against benzocaine gels. See [baby teething symptoms](/mamabee/articles/baby-teething-symptoms).
### Babyproofing
A crawling baby finds everything. Lock away medicines and cleaning products and save the Poison Help Line, 800-222-1222, in every phone. Our [baby-proofing your home](/mamabee/articles/baby-proofing-your-home) checklist walks through each room, and [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age) has ideas for a baby on the move.
## Common challenges at 8 months and what helps
### Short naps
If your baby wakes happy after 30 to 45 minutes, the nap may simply be short. If they wake crying, pause briefly before going in, since some babies resettle. Check the wake window: both too short and too long can cause short naps. On short-nap days, move bedtime earlier.
### Refusing the second nap
This usually means the first wake window is too short or the first nap too long. Try pushing nap 1 later by 15 minutes, or capping it at about 1.5 hours. Most babies keep two naps well into the second year.
## How to adjust the schedule for your baby
Read cues before the clock: rubbing eyes, staring off and fussing mean it is time to wind down. Anchor wake time and bedtime, and let naps flex. At daycare, ask for a daily log and use an earlier bedtime after short naps.
## When to call your pediatrician
Call your pediatrician if your 8 month old:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick after the fever comes down
- Shows signs of an ear infection: ear pain, fussiness or trouble sleeping, fever, trouble hearing, or fluid draining from the ear. The AAP notes ear tugging alone is not a reliable sign, since babies often do it to self-soothe.
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot
- Refuses several milk feeds in a row, or drinks much less milk than usual
- Gets a rash, vomiting or diarrhea after a new food (stop that food and call). Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Loses skills they once had, is not sitting on their own by 9 months, or you have concerns about the CDC's 9-month milestones. The CDC says to act early and ask about developmental screening.
- Has sleep problems that last much longer than a few weeks or seem to get worse
See [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do). The next checkup is at 9 months; see our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule).
## How MamaBee can help
MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, breastfeeds with left and right timers, bottles, pumping, solids and diapers, all on one timeline. 7-day insights show how naps and nights are trending, and two caregivers stay in sync in real time. Sleep Coach nap prediction is part of MamaBee Premium.
## Frequently asked questions
### How many naps should an 8 month old take?
Most 8 month olds take 2 naps, for about 2.5 to 3 hours of day sleep in total. A few still need a short third nap on some days while they finish the transition.
### How long should an 8 month old be awake between naps?
About 2.75 to 3.5 hours. The first wake window of the day is usually the shortest and the one before bed the longest.
### What time should an 8 month old go to bed?
Most 8 month olds go to bed between 6:30 and 8 PM, about 3.5 hours after the last nap ends. Use the earlier end on short-nap days.
### What is a good feeding schedule for an 8 month old?
A typical day has 4 to 5 milk feeds of 6 to 8 ounces, about 32 ounces or less of formula in total, plus 2 to 3 small meals. Many families offer milk on waking, after each nap and at bedtime, with meals at breakfast, lunch and dinner.
### Is there an 8 month sleep regression?
Many babies sleep worse for a while around 8 to 10 months, alongside crawling, pulling up, teething and separation anxiety. It is a common, temporary disruption, not a diagnosis, and usually settles within a few weeks.
### What finger foods can an 8 month old eat?
Soft foods cut into small pieces, such as banana, scrambled egg, well-cooked pasta, soft cooked vegetables and soft beans. Avoid whole grapes, nuts, popcorn, hot dogs and hard raw vegetables or apple.
## The takeaway
At 8 months, most babies take 2 naps with wake windows of about 2.75 to 3.5 hours, 4 to 5 milk feeds, and 2 to 3 small meals with more finger foods. Lower the crib mattress for a baby who pulls up, keep bedtime steady through separation anxiety and the 8 month sleep regression, and use an earlier bedtime when naps are short. Next month, wake windows stretch a little further and milk feeds start to drop, covered in our [9 month old schedule](/mamabee/articles/9-month-old-schedule).
[[CTA||Track naps, feeds and first finger foods. Try MamaBee free on iPhone.]]
Sources: [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [Sleep Foundation: 8-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/8-month-sleep-regression), [AAP HealthyChildren: Emotional and Social Development, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx), [AAP HealthyChildren: Movement Milestones, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: Sample Menu for an 8 to 12 Month Old](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx), [AAP HealthyChildren: Starting Solid Foods](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx), [CDC: Introducing Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html), [CDC: Choking Hazards](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html), [AAP HealthyChildren: Choking Prevention](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx), [AAP HealthyChildren: Discontinuing the Bottle](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Discontinuing-the-Bottle.aspx), [CDC: Milestones by 9 Months](https://www.cdc.gov/act-early/milestones/9-months.html), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infection Information](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('9-month-old-schedule',
    '9 Month Old Sleep Schedule: Sample Day, Naps & Feeds',
    'A sample 9 month old sleep schedule with 2 naps, 3 to 3.5 hour wake windows, milk feeds, 3 meals and snacks, plus early waking and the 9 month checkup.',
    ['9 month old sleep schedule', '9 month old schedule', '9 month old feeding schedule', '9 month old nap schedule', '9 month sleep regression'],
    {
      glance: {
        caption: '9 month old sleep schedule at a glance (typical ranges)',
        headers: ['What', 'Typical at 9 months'],
        rows: [
          ['Wake window', '3 to 3.5 hours, shortest in the morning and longest before bed'],
          ['Naps', '2 a day'],
          ['Day sleep', 'About 2 to 3 hours in total'],
          ['Night sleep', '10 to 12 hours; some babies still wake'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', '3 to 4 a day; breastfed babies may nurse more often'],
          ['Amount per bottle', '7 to 8 oz of formula; the AAP sample menu for 8 to 12 months adds up to around 24 oz a day'],
          ['Solids', '3 meals a day, plus 1 to 2 snacks if your baby is interested'],
          ['Water', 'Sips from an open, straw or sippy cup with meals; no more than 8 oz a day (AAP)'],
        ],
      },
      sample: {
        caption: 'Sample 9 month old sleep schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breastfeed or a 7 to 8 oz bottle'],
          ['8:00 AM', 'Solids: breakfast', 'For example, oatmeal with soft fruit, or scrambled egg'],
          ['10:00 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 3 hr'],
          ['11:15 AM', 'Wake up, milk feed', 'Floor play: crawling, pulling up, cruising'],
          ['12:15 PM', 'Solids: lunch', ''],
          ['2:30 PM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 3 hr 15 min'],
          ['3:45 PM', 'Wake up, snack', 'For example, yogurt or soft fruit, with water in a cup. Some babies have a milk feed here instead'],
          ['5:30 PM', 'Solids: dinner', 'Eat together as a family when you can'],
          ['6:30 PM', 'Bedtime routine and milk feed', 'Bath or wash, pajamas, book, song'],
          ['7:15 PM', 'Asleep for the night', 'Wake window: 3 hr 30 min'],
        ],
      },
      daycare: {
        caption: 'Variation: a daycare day, 6:30 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:30 AM', 'Wake up, milk feed', 'At home'],
          ['7:15 AM', 'Solids: breakfast', 'At home or at daycare'],
          ['8:00 AM', 'Drop-off', 'A short, cheerful goodbye'],
          ['9:30 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 3 hr'],
          ['10:45 AM', 'Wake up, milk feed', 'Expressed breast milk or a 7 to 8 oz bottle of formula'],
          ['11:45 AM', 'Solids: lunch', ''],
          ['2:00 PM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 3 hr 15 min'],
          ['3:15 PM', 'Wake up, snack', ''],
          ['5:00 PM', 'Pickup', 'Some cuddle and play time to reconnect'],
          ['5:30 PM', 'Solids: dinner', ''],
          ['6:00 PM', 'Bedtime routine and milk feed', ''],
          ['6:45 PM', 'Asleep for the night', 'Wake window: 3 hr 30 min'],
        ],
      },
      feeding: {
        caption: '9 month old feeding schedule: milk and solids through the day (matches the 7:00 AM sample)',
        headers: ['Time', 'Milk', 'Solids'],
        rows: [
          ['7:00 AM', 'Breastfeed or a 7 to 8 oz bottle on waking', ''],
          ['8:00 AM', '', 'Breakfast: oatmeal or iron-fortified cereal, or scrambled egg, plus soft fruit'],
          ['11:15 AM', 'Breastfeed or bottle after nap 1', ''],
          ['12:15 PM', '', 'Lunch: beans, lentils, yogurt or cottage cheese, plus soft cooked vegetables'],
          ['3:45 PM', 'Optional 4th milk feed', 'Snack: yogurt, soft fruit or a whole-grain cracker, plus water in a cup'],
          ['5:30 PM', '', 'Dinner: small soft pieces of chicken, fish or tofu, cooked vegetables and soft pasta'],
          ['6:30 PM', 'Breastfeed or bottle at bedtime', ''],
          ['Daily total', '3 to 4 feeds; around 24 oz in the AAP sample menu', '3 meals plus 1 to 2 snacks; up to 8 oz of water a day'],
        ],
      },
    },
`**A typical 9 month old sleep schedule has 2 naps, wake windows of about 3 to 3.5 hours and about 2 to 3 hours of day sleep, plus 10 to 12 hours at night. Most 9 month olds take 3 to 4 milk feeds of 7 to 8 ounces, eat 3 meals with 1 or 2 snacks and go to bed between 6:30 and 8 PM.**
Nine months is a turning point. Many babies are crawling, pulling up and cruising, and they may cling to you around new people. The day now has a toddler shape: two naps, three meals and a little less milk.
The schedule below is a guide, not a rule. If your baby is still settling into two naps, the [8 month old schedule](/mamabee/articles/8-month-old-schedule) may fit better for a few more weeks.
## 9 month old sleep schedule at a glance
[[TABLE:glance]]
These are typical ranges. The American Academy of Sleep Medicine (AASM) says babies from 4 to 12 months need 12 to 16 hours of sleep in 24 hours, naps included, so judge the whole day rather than one nap.
## Sample 9 month old sleep schedule
This sample uses a 7:00 AM wake-up and wake windows that grow through the day: 3 hours before the first nap, 3 hours 15 minutes before the second and 3.5 hours before bed.
[[TABLE:sample]]
That adds up to about 2.5 hours of day sleep and about 11 hours 45 minutes at night. There are three milk feeds during the day, or four if your baby has milk after the second nap instead of a snack.
### Variation: a daycare day
Daycare nap times are often set by the room, so this sample starts earlier and works backward from a 6:45 PM bedtime. Your daycare's times may differ; the wake windows matter more than the exact clock.
[[TABLE:daycare]]
That is about 2.5 hours of day sleep and about 11 hours 45 minutes at night. If naps at daycare run short, bedtime at 6:30 PM is a helpful safety net. Ask for a daily log of naps and bottles so you can plan the evening.
## Sleep at 9 months
### Two naps with longer wake windows
Most 9 month olds take two naps, about 2 to 3 hours in total. If naps start to fight back, the first fix is usually a slightly longer wake window, not dropping a nap. Most babies keep two naps until well past their first birthday.
Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide shows the ranges, the [wake window calculator](/mamabee/tools/wake-window-calculator) helps on off days, and the [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) builds a full day from your baby's wake-up time.
### Is there a 9 month sleep regression?
Many parents search for a "9 month sleep regression" when nights suddenly get worse. Sleep regression is a popular term, not a medical diagnosis, and the 8, 9 and 10 month bumps are usually the same thing: a temporary disruption that lines up with crawling, pulling to stand, separation anxiety and teething. The Sleep Foundation describes it as normally short-lived, and for most families it settles within a few weeks.
Keep the schedule steady, give plenty of daytime practice for new skills, and respond calmly at night. Our full guide to the [8 month sleep regression](/mamabee/articles/8-month-sleep-regression) covers the 8 to 10 month window in depth, and [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) shows how the bumps fit across the first two years.
### Early morning waking
Early waking is one of the most common complaints at this age. If your baby is up before 6 AM, check these:
- **Light:** blackout curtains or blinds help in summer and as mornings get brighter.
- **Treat pre-6 AM waking as night.** Keep the room dark, your voice quiet and lights off. If your baby is content, give them a few minutes before you go in.
- **The last wake window:** a stretch much longer than 3.5 hours before bed can leave a baby overtired, which often means earlier waking, not later.
- **The first nap:** a first nap that starts very early can turn into a "second half of the night." Push it toward 3 hours after waking.
- **Bedtime:** both too late and too early can play a part. Change it by 15 minutes and watch for a week.
If your baby wakes at 6 and seems well rested, 6 AM may simply be their natural wake time.
### Short naps
A 30 to 45 minute nap now and then is normal. If it happens most days, try a wake window 15 minutes longer before that nap, keep the room dark and give your baby a few minutes to resettle. An earlier bedtime protects the night.
### Night waking and night feeds
Most 9 month olds sleep about 10 to 12 hours at night, but plenty still wake. New skills, separation anxiety, teething and illness are common reasons. Some babies still have a night feed; ask your pediatrician at the 9-month checkup whether your baby needs one. If you want to work on nights, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night) and [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods).
### Safe sleep for a baby who stands
- **Mattress at the lowest setting.** The AAP says to do this before your baby learns to stand.
- **Crib empty:** fitted sheet only, no pillows, blankets, bumpers or stuffed toys before 12 months.
- **No mobiles,** and keep the crib away from windows and cords.
- **Sleep sack with free arms** for warmth instead of a blanket. See [dressing baby for sleep](/mamabee/articles/dressing-baby-for-sleep) and our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines).
## 9 month old feeding schedule
At 9 months, solids become a bigger part of the day, but breast milk or formula is still the main drink until 12 months. Here is how milk and meals fit around the 7:00 AM sample day.
[[TABLE:feeding]]
### How much milk does a 9 month old need?
- **Formula or bottle-fed:** many 9 month olds take 3 to 4 bottles of 7 to 8 ounces. The AAP's sample menu for 8 to 12 month olds works out to around 24 ounces a day, and the AAP advises no more than about 32 ounces of formula in 24 hours.
- **Breastfed:** keep nursing on cue. Breastfed babies often nurse more often than bottle-fed babies.
- **Still no cow's milk as a drink and no juice before 12 months (AAP).** Yogurt and cheese are fine as foods.
If your baby suddenly drinks much less milk, or much more than 32 ounces, mention it to your pediatrician. The [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a rough estimate, and [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows the year ahead.
### Three meals and snacks
Most 9 month olds eat breakfast, lunch and dinner, and some are ready for 1 or 2 small snacks. The AAP sample menu includes a mid-morning and an afternoon snack for 8 to 12 month olds, with portions of about 2 to 4 ounces per food. Let your baby's appetite lead: stop when they turn away or close their lips.
- **Include iron-rich foods** at most meals: meat, poultry, fish, eggs, beans, lentils and iron-fortified cereal.
- **Mix the food groups:** vegetables, fruits, proteins, yogurt and cheese without added sugar, and whole grains (CDC).
- **Keep common allergens in the rotation** once tolerated. See [introducing allergens to your baby](/mamabee/articles/introducing-allergens-to-baby).
### Finger foods and textures
By 9 months, the CDC lists using the fingers to "rake" food toward themselves, and many babies soon start picking up small pieces between thumb and finger. Offer soft foods cut into small pieces: banana, scrambled egg, well-cooked pasta, soft cooked vegetables, beans and small pieces of tender meat. Thicker, lumpier textures help your baby learn to chew. Our [baby-led weaning](/mamabee/articles/baby-led-weaning) guide covers self-feeding.
### Cup practice
The AAP suggests offering a cup once solids start, then finishing the move off the bottle between 12 and 18 months. At 9 months, practice is the goal:
- **Offer water in an open or straw cup** at meals and snacks, up to 8 ounces a day. An open cup will spill; that is part of learning.
- **Try one milk feed in a cup** once your baby is handling it well, often the lunchtime feed.
- **Feed before bed rather than in bed.** The AAP sample menu suggests following a bedtime milk feed with water or brushing your baby's teeth.
See [when can babies drink water](/mamabee/articles/when-can-babies-drink-water) for more.
### Choking safety
- **Seat your baby upright** in a high chair for every meal and snack, never crawling, walking, lying down or in a stroller (CDC).
- **Stay with your baby** the whole time they eat, and keep mealtimes calm.
- **Cut food into pieces no larger than half an inch** (AAP), and cut round foods like grapes into tiny pieces.
- **Skip choking hazards:** whole nuts and seeds, nut butter by the spoonful, popcorn, hot dogs, chunks of meat or cheese, whole grapes, hard raw vegetables and apple, raisins, and hard or sticky candy.
[[CTA||Log milk feeds, meals and naps in one place with MamaBee.]]
## The 9-month checklist and checkup
### CDC milestones by 9 months
The CDC's 9-month checklist (revised in 2022) lists things most babies do by this age, including:
- Is shy, clingy or fearful around strangers
- Looks when you call their name
- Makes lots of different sounds like "mamamama" and "babababa"
- Lifts arms up to be picked up
- Looks for objects when dropped out of sight, like a spoon or toy
- Gets to a sitting position by themselves and sits without support
Crawling is not on the checklist; some babies scoot or skip it. See [baby milestones by month](/mamabee/articles/baby-milestones-by-month) for what comes next.
### When to act early
The CDC says that if your baby is not meeting one or more milestones, has lost skills or you have other concerns, act early: talk with your pediatrician, ask about developmental screening, and you can contact your state's early intervention program directly. You do not need a diagnosis to ask.
### The 9-month well visit
The AAP Bright Futures schedule includes a well-baby visit at 9 months. Along with measurements and a full exam, it includes a structured developmental screening, oral health and safety questions, and any vaccines that are due (plus a flu shot in season). It is a good time to ask about night feeds, milk amounts and early waking. See our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) and [baby vaccine schedule explained](/mamabee/articles/baby-vaccine-schedule-explained).
### Separation anxiety
The AAP says separation anxiety usually peaks between 10 and 18 months, and it may show up at bedtime as protests or night waking. Keep goodbyes calm and brief, plan drop-offs after a nap and a feed, and keep the bedtime routine the same every night. Our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide has more.
For play ideas that build on these skills, such as peek-a-boo and banging blocks together, see [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age).
## How to adjust the schedule for your baby
- **Read cues before the clock.** Rubbing eyes, staring off and fussing mean it is time to wind down.
- **Anchor wake time and bedtime,** and let nap times flex by 15 to 30 minutes.
- **Early riser:** if 6 AM is your baby's natural wake time, shift the sample day an hour earlier and keep bedtime between 6:30 and 8 PM.
- **Daycare:** match weekends to daycare nap times when you can.
## When to call your pediatrician
Call your pediatrician if your 9 month old:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick after the fever comes down
- Shows signs of an ear infection: ear pain, fussiness or new trouble sleeping, fever, trouble hearing, or fluid draining from the ear. The AAP notes ear tugging alone is not a reliable sign.
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot
- Refuses several milk feeds in a row, or is eating and drinking much less than usual
- Gets a rash, vomiting or diarrhea after a new food (stop that food and call). Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Is not sitting on their own, loses skills, or is not doing several of the CDC's 9-month items
- Has sleep problems that last much longer than a few weeks or keep getting worse
If something feels off, call. See [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do).
## How MamaBee can help
At 9 months, it is easy to lose track of how much milk your baby is still taking as meals grow. MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, breastfeeds with left and right timers, bottles, pumping, solids and diapers on one timeline. 7-day insights show how naps and nights are trending, and two caregivers, or a parent and a nanny, stay in sync in real time. Sleep Coach nap prediction is part of MamaBee Premium.
## Frequently asked questions
### How many naps should a 9 month old take?
Most 9 month olds take 2 naps a day, for about 2 to 3 hours of day sleep in total. Most keep two naps until well after their first birthday.
### How long should a 9 month old be awake between naps?
About 3 to 3.5 hours. The first wake window is usually the shortest and the one before bed the longest.
### What time should a 9 month old go to bed?
Usually between 6:30 and 8 PM, about 3.5 hours after the second nap ends. Go earlier on days when naps are short.
### How much milk should a 9 month old drink?
Many 9 month olds take 3 to 4 milk feeds of 7 to 8 ounces. The AAP's sample menu for 8 to 12 months adds up to around 24 ounces a day, with no more than about 32 ounces of formula.
### What should a 9 month old feeding schedule look like?
A common pattern is milk on waking, after the first nap and at bedtime, with breakfast, lunch and dinner in between and 1 to 2 small snacks. Some babies have a fourth milk feed after the second nap.
### Why is my 9 month old waking up at night?
Common reasons include crawling and pulling to stand, separation anxiety, teething, illness and an off schedule. This "9 month sleep regression" is usually temporary; call your pediatrician if it lasts much longer than a few weeks or your baby seems unwell.
## The takeaway
A 9 month old schedule usually means 2 naps, wake windows of about 3 to 3.5 hours, 3 to 4 milk feeds and 3 meals with a snack or two. Use early bedtimes as a safety net for short naps, treat waking before 6 AM as part of the night, and practice with a cup. Bring your questions to the 9-month checkup, and when you are ready for what comes next, see our [10 month old schedule](/mamabee/articles/10-month-old-schedule).
[[CTA||See how naps, nights and feeds are trending. Try MamaBee free on iPhone.]]
Sources: [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [Sleep Foundation: 8-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/8-month-sleep-regression), [CDC: Milestones by 9 Months](https://www.cdc.gov/act-early/milestones/9-months.html), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf), [AAP HealthyChildren: Emotional and Social Development, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: Sample Menu for an 8 to 12 Month Old](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx), [AAP HealthyChildren: Starting Solid Foods](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx), [AAP HealthyChildren: Discontinuing the Bottle](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Discontinuing-the-Bottle.aspx), [CDC: Introducing Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html), [CDC: Choking Hazards](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html), [AAP HealthyChildren: Choking Prevention](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infection Information](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),
]

const DRY = !!process.env.DRY
for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  let coverFrom = null
  for (const rel of COVERS[a.slug] || []) {
    const src = await client.getDocument(`mamabee-${rel}`)
    if (src && src.coverImage) { doc.coverImage = src.coverImage; coverFrom = rel; break }
  }
  if (!DRY) await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  const faqStart = doc.body.findIndex((b) => b.style === 'h2' && b.children[0]?.text === 'Frequently asked questions')
  const faqEnd = doc.body.findIndex((b, i) => i > faqStart && b.style === 'h2')
  const faqs = doc.body.slice(faqStart, faqEnd).filter((b) => b.style === 'h3').length
  const lede = doc.body[0].children.map((s) => s.text).join('').split(/\s+/).filter(Boolean).length
  const hrefs = doc.body.flatMap((b) => (b.markDefs || []).map((d) => d.href).filter(Boolean))
  const internal = [...new Set(hrefs.filter((h) => h.startsWith('/mamabee/')))]
  console.log(`${DRY ? '[DRY] ' : ''}${w >= 1800 && w <= 2600 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${tables} tables, ${faqs} FAQs, lede ${lede}w, title ${a.title.length}c, desc ${a.description.length}c, cover from ${coverFrom || 'NONE'}, ${internal.length} internal links)`)
  if (DRY) console.log('   internal:', internal.join(' '))
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
