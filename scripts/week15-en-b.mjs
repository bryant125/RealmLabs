// Week-15 MamaBee "N month old schedule" series, part EN-B: 11 and 12 month old sleep schedules
// as DRAFTS only (never published by this script). Numbers follow the series canonical
// sheet (10-12 month row: 3-4 h wake windows, 2 naps) and every medical claim cites a source
// listed at the end of its article. Cover images are copied from a related published article.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week15-en-b.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week15-en-b.mjs
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
  '11-month-old-schedule': ['baby-milestones-by-month', 'contact-naps-and-independent-sleep', '10-month-old-schedule'],
  '12-month-old-schedule': ['when-can-babies-drink-water', 'baby-feeding-schedule-by-age', 'baby-milestones-by-month'],
}

const articles = [

  A('11-month-old-schedule',
    '11 Month Old Sleep Schedule: Sample Day, Naps & Feeds',
    'An 11 month old sleep schedule with 2 naps, 3 to 4 hour wake windows, milk feeds and meals, plus help with nap strikes, early waking and first steps.',
    ['11 month old sleep schedule', '11 month old schedule', '11 month old feeding schedule', '11 month old nap schedule', '11 month old routine'],
    {
      glance: {
        caption: '11 month old schedule at a glance (typical ranges)',
        headers: ['What', 'Typical at 11 months'],
        rows: [
          ['Wake window', '3 to 4 hours; many 11 month olds settle around 3.5 hours'],
          ['Naps', '2 a day; most babies keep 2 naps past their first birthday'],
          ['Day sleep', 'About 2 to 2.5 hours in total'],
          ['Night sleep', '10 to 12 hours; some babies still wake'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', '3 to 4 a day; breastfed babies may nurse more often'],
          ['Amount per bottle', '7 to 8 oz of formula; roughly 24 oz a day is typical (AAP), no more than about 32 oz'],
          ['Solids', '3 meals plus 1 to 2 snacks, mostly soft finger foods'],
          ['Water', 'Sips from an open or straw cup with meals, about 4 to 8 oz a day (AAP)'],
          ['Cow\'s milk', 'Not as a drink until 12 months (AAP); yogurt and cheese are fine as foods'],
        ],
      },
      sample: {
        caption: 'Sample 11 month old sleep schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breastfeed or a 7 to 8 oz bottle'],
          ['7:45 AM', 'Breakfast', 'Offer water in an open or straw cup'],
          ['9:30 AM', 'Snack (optional)', 'Helpful if breakfast was small'],
          ['10:30 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 3 hr 30 min'],
          ['11:45 AM', 'Wake up, milk feed', 'Then floor play: cruising, standing, pushing a box'],
          ['12:30 PM', 'Lunch', 'Soft finger foods plus sips of water'],
          ['3:15 PM', 'Nap 2 (about 1 hr)', 'Wake window: 3 hr 30 min'],
          ['4:15 PM', 'Wake up, snack', 'Some babies still take a milk feed here (a 4th feed)'],
          ['5:45 PM', 'Dinner', 'Eat together when you can'],
          ['7:00 PM', 'Bedtime routine and milk feed', 'Bath or wash, pajamas, teeth, book, song'],
          ['7:45 PM', 'Asleep for the night', 'Wake window: 3 hr 30 min'],
        ],
      },
      rescue: {
        caption: 'Variation: short second nap, earlier bedtime',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', ''],
          ['7:45 AM', 'Breakfast', ''],
          ['10:30 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 3 hr 30 min'],
          ['11:45 AM', 'Wake up, milk feed', ''],
          ['12:30 PM', 'Lunch', ''],
          ['3:15 PM', 'Nap 2 (only 30 min)', 'Wake window: 3 hr 30 min'],
          ['3:45 PM', 'Wake up, snack', 'Keep the late afternoon calm'],
          ['5:30 PM', 'Dinner', ''],
          ['6:15 PM', 'Bedtime routine and milk feed', 'Start early'],
          ['7:00 PM', 'Asleep for the night', 'Wake window: 3 hr 15 min'],
        ],
      },
      feeding: {
        caption: '11 month old feeding schedule (sample, matching the 7:00 AM day)',
        headers: ['Time', 'Milk', 'Food', 'Ideas'],
        rows: [
          ['7:00 AM', 'Breast milk or 7 to 8 oz formula', '', 'Milk first, breakfast a little later'],
          ['7:45 AM', 'Sips of water', 'Breakfast', 'Soft whole-grain toast fingers with a thin smear of nut butter, plus mashed berries'],
          ['9:30 AM', '', 'Snack (optional)', 'Plain whole-milk yogurt with soft peach pieces'],
          ['11:45 AM', 'Breast milk or 7 to 8 oz formula', '', 'After nap 1'],
          ['12:30 PM', 'Sips of water', 'Lunch', 'Egg omelet strips, soft-cooked zucchini, small pieces of ripe avocado'],
          ['4:15 PM', 'Optional 4th milk feed', 'Snack', 'Soft banana pieces or shredded cheese'],
          ['5:45 PM', 'Sips of water', 'Dinner', 'Flaked salmon, soft rice, peas squashed flat, cooked carrot sticks'],
          ['7:00 PM', 'Breast milk or 7 to 8 oz formula', '', 'Before teeth brushing in the bedtime routine'],
        ],
      },
    },
`**An 11 month old sleep schedule usually has 2 naps, 3 to 4 hour wake windows, about 2 to 2.5 hours of day sleep and 10 to 12 hours at night. Most take 3 to 4 milk feeds of 7 to 8 ounces plus 3 meals and 1 to 2 snacks, with bedtime between 6:30 and 8 PM.**
Eleven months is the last stretch before the first birthday, and it can feel like a whole new baby. Many 11 month olds cruise along furniture, stand for a moment on their own and say a first word or two. Naps can wobble, and it is easy to wonder whether one nap is next. For most babies, it is not yet.
The sample days below are a starting point, not a test. To see how the day looked a month ago, read our [10 month old schedule](/mamabee/articles/10-month-old-schedule). For the whole first year on one page, see the [baby sleep schedule by age](/mamabee/articles/baby-sleep-schedule-by-age).
## 11 month old schedule at a glance
[[TABLE:glance]]
These are typical ranges, not targets. The American Academy of Sleep Medicine (AASM) says babies from 4 to 12 months need 12 to 16 hours of sleep in 24 hours, naps included.
## Sample 11 month old sleep schedule
This sample uses a 7:00 AM wake-up, two naps and even wake windows of about 3 hours 30 minutes. Many 11 month olds can stay awake a little longer than they could at 10 months.
[[TABLE:sample]]
That adds up to about 2 hours 15 minutes of day sleep and about 11 hours 15 minutes at night, with three milk feeds and an optional fourth. If your baby still wakes once at night, that is common too.
### Variation: the short second nap
Some days the afternoon nap is only 30 minutes. Instead of pushing to the usual bedtime, start the routine early and let your baby fall asleep sooner.
[[TABLE:rescue]]
Day sleep is about 1 hour 45 minutes, and night sleep is about 12 hours. An earlier bedtime after a short nap is a normal, temporary fix, not a new schedule.
### If your baby wakes at 6:00 AM
Shift the whole day an hour earlier rather than stretching the first wake window: nap 1 at 9:30 AM, nap 2 at 2:15 PM and asleep at about 6:45 PM. Keep the room dark until your chosen wake time, and keep early morning wakings quiet and boring.
## Sleep at 11 months
### Naps
Most 11 month olds still take 2 naps and about 2 to 2.5 hours of day sleep in total. KidsHealth notes that babies this age will likely still take two naps, and that some nap for 30 minutes while others nap for up to 2 hours. If the total is in range and your baby is mostly cheerful, the pattern is working.
Wake windows of about 3 to 4 hours suit most babies now. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains how they change, and the [wake window calculator](/mamabee/tools/wake-window-calculator) turns the last wake-up time into a nap time. To build a whole day, try the [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator).
### Nap strikes: is my 11 month old ready for 1 nap?
Probably not. KidsHealth says that at around 18 months, or sometimes sooner, most toddlers condense their two naps into one afternoon nap. Nationwide Children's Hospital says that by 18 months most toddlers have given up the morning nap. Very few babies are ready before their first birthday.
A week of refused naps at 11 months is usually about something else:
- **New skills:** standing, cruising and practicing first steps in the crib
- **Separation anxiety:** protesting when you leave the room
- **Teething** or the start of a cold
- **Wake windows that are now too short**, so your baby is not tired enough at nap time
What helps before you change anything big:
- **Stretch wake windows by 15 minutes** for a few days, staying within 3 to 4 hours.
- **Offer both naps anyway.** Quiet time in a dark crib still rests your baby.
- **Cap the morning nap** at about 1 to 1.5 hours if the afternoon nap keeps disappearing.
- **Use an earlier bedtime** after a short-nap day, as early as 6:30 PM.
- **Give it 2 weeks.** If your baby happily skips a nap most days for 2 weeks or more, bring it up at the 12-month checkup.
When the time does come, our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide explains the 2-to-1 move step by step.
### Early morning waking
Waking at 5 AM is common around now. Check the usual suspects: a room that gets light early, a first nap that starts very soon after waking, or a bedtime that is too late after a short afternoon nap. Blackout curtains, a consistent wake-up time and a first wake window of at least 3 hours often help.
### Night sleep
Expect about 10 to 12 hours at night. Many 11 month olds still wake sometimes, and some still feed once. Whether your baby needs that feed depends on growth, so ask your pediatrician.
When you are ready to work on nights, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night), [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) and our [bedtime routine](/mamabee/articles/baby-bedtime-routine) guide.
### Separation anxiety at bedtime
The American Academy of Pediatrics (AAP) says separation anxiety usually peaks between 10 and 18 months, and it can show up as a baby who resists sleep without you or wakes looking for you. A short, predictable routine, a calm goodbye and a quick, warm check-in work better than sneaking out. Our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide goes deeper.
### Crib safety for a baby who stands and cruises
- **Keep the mattress at its lowest setting.** The AAP says to lower it before your baby learns to stand.
- **Keep the crib empty:** no pillows, blankets, bumpers or stuffed toys before 12 months. A wearable blanket or sleep sack is fine.
- **Check what your baby can reach** when standing. KidsHealth warns about cords, curtains and anything your baby can touch from the crib.
- **Back to sleep is still the rule** (AAP), even though your baby can roll and sit up on their own.
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) has the full list.
## 11 month old feeding schedule
[[TABLE:feeding]]
### How much milk does an 11 month old need?
Breast milk or formula is still the main drink until 12 months.
- **Formula or bottle-fed:** 3 to 4 feeds of 7 to 8 ounces suits many 11 month olds. The AAP sample menu for 8 to 12 months works out to roughly 24 ounces a day, and the AAP advises no more than about 32 ounces of formula in 24 hours.
- **Breastfed:** keep nursing on cue. Breastfed babies often feed a little more often than bottle-fed babies.
A sudden, large drop in milk is worth mentioning to your pediatrician. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a rough estimate, and the [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how feeds change over the year.
### Solids: 3 meals and 1 to 2 snacks
Most 11 month olds eat 3 meals a day plus 1 or 2 small snacks. There is no set amount. Let your baby decide how much, and stop when they turn away, close their lips or start throwing food.
- **Iron-rich foods** at most meals: meat, poultry, fish, eggs, beans, lentils and iron-fortified cereal.
- **Allergens:** keep offering tolerated allergens like egg, thinned peanut, dairy, wheat, sesame and fish regularly. See [introducing allergens to your baby](/mamabee/articles/introducing-allergens-to-baby).
- **Family foods, softened:** many family meals work if they are soft, cut small and made without added salt or sugar.
- **No juice and no added sugar.** The AAP says babies under 1 should not drink juice.
Our [baby-led weaning](/mamabee/articles/baby-led-weaning) guide covers self-feeding in detail.
**Choking safety:** the CDC says to have your baby sit up in a high chair for every meal and snack and to watch them the whole time. Avoid whole grapes, nuts, chunks of peanut butter, hot dogs, popcorn and hard raw vegetables.
### Get ready for the 12-month switch
- **No cow's milk as a drink yet.** The AAP explains that cow's milk lacks enough iron and other nutrients babies need. Yogurt and cheese are fine as foods.
- **Practice the cup now.** The AAP suggests offering a cup with meals and moving away from bottles gradually, with the bottle gone sometime between 12 and 18 months. About 4 to 8 ounces of water a day in an open or straw cup is the AAP guide for 6 to 12 months. See [when can babies drink water](/mamabee/articles/when-can-babies-drink-water).
- **Move the bedtime milk earlier** in the routine, before teeth brushing. The AAP says not to put babies to bed with a bottle.
Our [12 month old schedule](/mamabee/articles/12-month-old-schedule) covers the switch to whole milk in detail.
## What's new at 11 months
### Milestones
By 12 months, the CDC lists these among the things most babies do:
- Pulls up to stand and walks while holding on to furniture
- Waves bye-bye and calls a parent "mama," "dada" or another special name
- Understands "no" and pauses or stops when you say it
- Looks for things they see you hide, like a toy under a blanket
- Picks up small bits of food between thumb and pointer finger
The AAP says many babies take their first steps around their first birthday, though earlier or later is normal. See [baby milestones by month](/mamabee/articles/baby-milestones-by-month) for the full lists.
### Simple play ideas for an 11 month old
- **Push toys** or an empty box to practice walking
- **Put in, take out:** blocks into a cup or a container
- **Point and name:** name what your baby points at
- **Simple games** like pat-a-cake and peekaboo
More ideas are in [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age).
## When to call your pediatrician
Call your pediatrician if your 11 month old:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down
- Has signs of an ear infection: the AAP lists ear pain that is often worse at night, fever, fluid draining from the ear, or not responding to sounds as usual. Ear tugging alone can be self-soothing; tugging with fever or unusual fussiness is worth a call.
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot
- Refuses several milk feeds in a row, or drinks much less milk than usual
- Gets a rash, vomiting or diarrhea after a new food (stop that food and call). Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Loses skills they once had, or is not doing the CDC's 9-month items, such as sitting without support, looking when you call their name or moving things from one hand to the other
If something feels off, it is always fine to call. See [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do), and our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule): the next routine checkup is at 12 months.
## Frequently asked questions
### How many naps should an 11 month old take?
Most 11 month olds take 2 naps a day, for about 2 to 2.5 hours of day sleep in total. KidsHealth says most toddlers move to one nap at around 18 months, sometimes sooner.
### How long should an 11 month old be awake between naps?
About 3 to 4 hours. Many 11 month olds do well with about 3.5 hours before each nap and before bed.
### What time should an 11 month old go to bed?
Most 11 month olds go to bed between 6:30 and 8 PM, about 3.5 hours after the second nap ends. Go earlier after short naps.
### How much should an 11 month old eat?
Most 11 month olds take 3 to 4 milk feeds of 7 to 8 ounces, roughly 24 ounces a day and no more than about 32 ounces of formula, plus 3 meals and 1 to 2 snacks. Breastfed babies nurse on cue.
### Why is my 11 month old fighting naps?
Common reasons include practicing standing and cruising, separation anxiety, teething, illness and wake windows that have become too short. Stretch wake windows a little and keep offering both naps for 2 weeks before deciding your baby is ready for one.
### Is my 11 month old ready for one nap?
Most are not. Most babies keep 2 naps until somewhere between about 12 and 18 months, and a week of nap strikes at 11 months is usually a phase.
## The takeaway
An 11 month old sleep schedule usually means 2 naps, wake windows of about 3 to 4 hours, 3 to 4 milk feeds and a bedtime between 6:30 and 8 PM. Treat nap strikes as a phase, adjust wake windows first and use an earlier bedtime on rough days. Keep the crib empty and the mattress low, offer plenty of soft finger foods, practice the cup and save cow's milk for after the first birthday. Next month, our [12 month old schedule](/mamabee/articles/12-month-old-schedule) covers the switch to whole milk, and the [12 month sleep regression](/mamabee/articles/12-month-sleep-regression) guide helps if sleep gets bumpy around the birthday.
## How MamaBee helps
The hardest part of this month is telling a phase from a real change. Is your baby truly ready for one nap, or just having a loud week? MamaBee helps you see the answer in your own logs, so you are not deciding at 5 AM on a hunch.
- **One-thumb logging, free and with no ads:** naps, night wakings, breastfeeds with left and right timers, bottles, solids and diapers on one timeline.
- **Insights that show the trend:** see how naps and nights are moving over the past 7 days, so one bad day does not rewrite your plan.
- **Both caregivers in sync:** free real-time sharing for 2 caregivers, so whoever does bedtime knows how the afternoon nap went.
- **Ready for the 12-month checkup:** export a pediatrician PDF of your logs, and tick off milestones as they happen.
[[CTA||Two naps or one? Let your baby's own log tell you. Try MamaBee free.]]
When you want more help, MamaBee Premium adds Sleep Coach nap prediction, which suggests when the next nap is due, and Bee AI, an assistant that knows your baby's log so you can ask questions like "why is she fighting naps?" and get answers that take your baby's own days into account. Your logs stay on your iPhone unless you turn on co-parent sharing, and your data is never sold.
[[CTA||Make the last month before the first birthday calmer. Download MamaBee on iPhone.]]
Sources: [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [KidsHealth: Baby Sleep, 8 to 12 Months](https://kidshealth.org/en/parents/sleep812m.html), [KidsHealth: Toddler Sleep, 1 to 2 Years](https://kidshealth.org/en/parents/sleep12yr.html), [Nationwide Children's Hospital: Sleep in Toddlers](https://www.nationwidechildrens.org/sleep-in-toddlers), [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: Sample Menu for a Baby 8 to 12 Months Old](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx), [AAP HealthyChildren: Recommended Drinks for Young Children](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Recommended-Drinks-for-Young-Children-Ages-0-5.aspx), [AAP HealthyChildren: Why Formula Instead of Cow's Milk](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Why-Formula-Instead-of-Cows-Milk.aspx), [AAP HealthyChildren: Discontinuing the Bottle](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Discontinuing-the-Bottle.aspx), [AAP HealthyChildren: Brush, Book, Bed](https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Brush-Book-Bed.aspx), [AAP HealthyChildren: Introducing Common Food Allergens](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/when-to-introduce-egg-peanut-butter-and-other-common-food-allergens-to-your-baby-food-allergy-prevention-tips.aspx), [CDC: Choking Hazards](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html), [CDC: Milestones by 9 Months](https://www.cdc.gov/act-early/milestones/9-months.html), [CDC: Milestones by 1 Year](https://www.cdc.gov/act-early/milestones/1-year.html), [AAP HealthyChildren: Movement Milestones, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx), [AAP HealthyChildren: Emotional and Social Development, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('12-month-old-schedule',
    '12 Month Old Sleep Schedule: Sample Day, Naps & Feeds',
    'A 12 month old (1 year old) sleep schedule with 2 naps and bedtime, plus a 1 year old feeding schedule, the switch to whole milk and moving off bottles.',
    ['12 month old sleep schedule', '1 year old sleep schedule', '1 year old feeding schedule', '12 month old schedule', '1 year old schedule'],
    {
      glance: {
        caption: '12 month old (1 year old) schedule at a glance (typical ranges)',
        headers: ['What', 'Typical at 12 months'],
        rows: [
          ['Wake window', '3 to 4 hours, usually shortest in the morning and longest before bed'],
          ['Naps', '2 a day for most; 1 nap usually comes later, at around 18 months or sometimes sooner (KidsHealth)'],
          ['Day sleep', 'About 2 to 2.5 hours in total'],
          ['Night sleep', '10 to 12 hours'],
          ['Total sleep', '11 to 14 hours in 24 hours, including naps (AASM, 1 to 2 years)'],
          ['Milk', 'Breast milk as long as you both want, and/or whole cow\'s milk, about 16 oz (2 cups) a day or less (AAP)'],
          ['Cups and bottles', 'Milk mostly in a cup; the bottle gone sometime between 12 and 18 months (AAP)'],
          ['Food', '3 meals and 2 snacks, about 1,000 calories a day (AAP)'],
          ['Water', 'About 8 to 32 oz (1 to 4 cups) a day (AAP)'],
        ],
      },
      sample: {
        caption: 'Sample 12 month old sleep schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up', 'Breastfeed if you are nursing, or go straight to breakfast'],
          ['7:30 AM', 'Breakfast with milk in a cup', 'About 4 oz of whole milk'],
          ['9:30 AM', 'Snack', 'Water in a cup'],
          ['10:15 AM', 'Nap 1 (about 1 hr)', 'Wake window: 3 hr 15 min'],
          ['11:15 AM', 'Wake up, play', 'Outside time or a walk if you can'],
          ['12:00 PM', 'Lunch with milk in a cup', 'About 4 oz of whole milk'],
          ['2:45 PM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 3 hr 30 min'],
          ['4:00 PM', 'Wake up, snack', 'Water in a cup'],
          ['5:30 PM', 'Dinner with milk in a cup', 'About 4 oz of whole milk'],
          ['7:00 PM', 'Bedtime routine', 'Optional small milk or nursing first, then teeth, book, song'],
          ['7:45 PM', 'Asleep for the night', 'Wake window: 3 hr 45 min'],
        ],
      },
      daycare: {
        caption: 'Variation: 6:30 AM wake on a daycare day, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:30 AM', 'Wake up', 'Nurse or cuddle at home'],
          ['7:00 AM', 'Breakfast with milk in a cup', 'At home or at drop-off'],
          ['9:45 AM', 'Nap 1 (about 1 hr)', 'Wake window: 3 hr 15 min'],
          ['10:45 AM', 'Wake up, snack', ''],
          ['11:15 AM', 'Lunch with milk in a cup', ''],
          ['2:15 PM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 3 hr 30 min'],
          ['3:30 PM', 'Wake up, snack', ''],
          ['5:30 PM', 'Dinner with milk in a cup', 'At home after pick-up'],
          ['6:30 PM', 'Bedtime routine', 'Keep it short and calm'],
          ['7:15 PM', 'Asleep for the night', 'Wake window: 3 hr 45 min'],
        ],
      },
      ready: {
        caption: 'One nap or just a phase? Signs to compare',
        headers: ['Usually just a phase', 'May be getting ready for 1 nap'],
        rows: [
          ['Skips naps for a few days during teething, illness or new walking', 'Skips or fights one nap most days for 2 weeks or more'],
          ['Is cranky and rubs eyes by late afternoon after a missed nap', 'Stays cheerful until bedtime on one nap'],
          ['Night sleep falls apart after a one-nap day', 'Sleeps well at night on one-nap days'],
          ['Just turned 12 months', 'Is closer to 15 to 18 months'],
        ],
      },
      feeding: {
        caption: '1 year old feeding schedule (sample, matching the 7:00 AM day)',
        headers: ['Time', 'Drink', 'Meal', 'Ideas'],
        rows: [
          ['7:00 AM', 'Breastfeed (optional)', '', 'Many breastfed toddlers still nurse on waking'],
          ['7:30 AM', 'Whole milk, about 4 oz, in a cup', 'Breakfast', 'Oatmeal with grated apple, or scrambled egg with soft toast fingers'],
          ['9:30 AM', 'Water', 'Snack', 'Plain whole-milk yogurt with mashed berries'],
          ['12:00 PM', 'Whole milk, about 4 oz, in a cup', 'Lunch', 'Thin strips of bean and cheese quesadilla, soft-cooked peppers'],
          ['4:00 PM', 'Water', 'Snack', 'Soft banana slices and thin slices of cheese'],
          ['5:30 PM', 'Whole milk, about 4 oz, in a cup', 'Dinner', 'Shredded chicken, soft pasta, well-cooked broccoli'],
          ['7:00 PM', 'Optional nursing or about 4 oz milk', '', 'Before teeth brushing, never in bed'],
        ],
      },
      changes: {
        caption: 'What changes at 12 months',
        headers: ['', 'Before 12 months', 'From 12 months'],
        rows: [
          ['Main drink', 'Breast milk or formula', 'Breast milk and/or whole cow\'s milk, about 16 oz a day or less'],
          ['Cups and bottles', 'Bottles, plus practice with a cup', 'Mostly cups; finish weaning from the bottle by 12 to 18 months'],
          ['Water', 'About 4 to 8 oz a day', 'About 8 to 32 oz a day'],
          ['Food', '3 meals and 1 to 2 snacks', '3 meals and 2 snacks'],
          ['Crib', 'Nothing soft in the crib', 'A light blanket and a small lovey are OK (KidsHealth)'],
          ['Total sleep', '12 to 16 hours (AASM, 4 to 12 months)', '11 to 14 hours (AASM, 1 to 2 years)'],
        ],
      },
    },
`**A 12 month old sleep schedule has 2 naps, 3 to 4 hour wake windows, about 2 to 2.5 hours of day sleep and 10 to 12 hours at night, with bedtime between 6:30 and 8 PM. A 1 year old feeding schedule means 3 meals, 2 snacks and 16 ounces of whole milk or less, in a cup.**
Happy first birthday to your baby, and to you. Twelve months brings two big changes at once: milk and bottles change, and many parents start asking about one nap. The milk switch is a real 12-month step. The nap change usually is not, at least not yet.
This guide covers the 1 year old sleep schedule and the 1 year old feeding schedule together. For last month's routine, see our [11 month old schedule](/mamabee/articles/11-month-old-schedule), and for the full first year on one page, the [baby sleep schedule by age](/mamabee/articles/baby-sleep-schedule-by-age).
## 12 month old schedule at a glance
[[TABLE:glance]]
These are typical ranges, not targets. The American Academy of Sleep Medicine (AASM) says children aged 1 to 2 years need 11 to 14 hours of sleep in 24 hours, naps included, and babies up to 12 months need 12 to 16 hours.
## Sample 12 month old sleep schedule
This sample uses a 7:00 AM wake-up and two naps. Notice the shape: a shorter morning nap and a slightly longer afternoon nap, with wake windows that grow from about 3 hours 15 minutes to 3 hours 45 minutes before bed.
[[TABLE:sample]]
That adds up to about 2 hours 15 minutes of day sleep and about 11 hours 15 minutes at night. Milk now comes with meals in a cup, and the bedtime milk, if you keep one, happens before teeth brushing.
### Variation: a 6:30 AM daycare day
Daycare days start earlier, so the whole day shifts by 30 minutes.
[[TABLE:daycare]]
Day sleep is still about 2 hours 15 minutes, and night sleep is about 11 hours 15 minutes. If your child's daycare room runs one midday nap, ask whether a short morning rest is possible while your child adjusts, and use an earlier bedtime on those days.
## 1 year old sleep: what changes and what does not
### Naps: keep 2 for now
Most 1 year olds still need two naps. KidsHealth says that at around 18 months, or sometimes sooner, most toddlers condense their two naps into one afternoon nap. Nationwide Children's Hospital says that by 18 months most toddlers have given up the morning nap and take one long afternoon nap of 1.5 to 3 hours.
So the move to one nap usually happens somewhere between about 12 and 18 months, and most babies are closer to the later end. Dropping a nap before your child is ready can leave them overtired, which often shows up as crankiness and more night waking.
### One nap or just a phase?
[[TABLE:ready]]
If your toddler matches the right-hand column for 2 weeks or more, read our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide for the 2-to-1 move. If it looks more like the left column, keep two naps and try the bridge steps below.
### How to get through a nap strike
- **Stretch wake windows by 15 minutes**, staying within about 3 to 4 hours.
- **Shorten the morning nap** to about 45 minutes to 1 hour if the afternoon nap keeps vanishing.
- **Keep offering both naps.** Quiet time in a dark crib still counts as rest.
- **Use an early bedtime**, as early as 6:30 PM, after a day with one nap.
Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide and the [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) can help you plan the day around your own child's wake-up time.
### Night sleep
Expect about 10 to 12 hours at night. Some 1 year olds still wake, and that can be normal. If your child still feeds at night, ask your pediatrician whether that feed is still needed now that daytime meals are bigger.
When you are ready to work on nights, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night), [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) and our [bedtime routine](/mamabee/articles/baby-bedtime-routine) guide.
### The 12 month sleep regression
Many families notice rougher sleep around the first birthday: more night waking, bedtime protests and short naps. The Sleep Foundation notes that common causes include more activity and new physical skills, separation anxiety and teething, and that the symptoms usually do not last longer than a few weeks. Our [12 month sleep regression](/mamabee/articles/12-month-sleep-regression) guide covers what helps, including why it is rarely a sign your child needs one nap.
### Safe sleep after the first birthday
The AAP's safe sleep recommendations, including no blankets or soft toys in the crib, are written for babies up to 1 year. KidsHealth says that after 12 months a light blanket in the crib is OK, and a lovey can be a real comfort. Skip extra-large soft toys or stuffed animals, keep the crib mattress at its lowest setting, and keep cords and curtains out of reach. Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) has the details.
## 1 year old feeding schedule
[[TABLE:feeding]]
That adds up to about 12 to 16 ounces of whole milk, plus water between meals. There is no set amount of food. Let your child decide how much to eat from what you offer.
### Switching to whole cow's milk at 12 months
The AAP says babies should not have cow's milk as a drink until about 12 months. After the first birthday, most children can switch.
- **Choose whole milk.** The AAP advises whole milk for children aged 12 to 24 months. Your pediatrician may suggest 2% milk if there is a concern about weight or a family history of related health problems.
- **About 16 ounces (2 cups) a day or less.** The AAP says more than 24 ounces a day has been linked to iron deficiency when toddlers do not get enough iron-rich foods.
- **Breastfeeding can continue.** The AAP supports breastfeeding for as long as you and your child want, for 2 years or beyond.
- **Toddler milk is not needed.** The AAP calls "transition" or "next stage" toddler drinks unnecessary.
- **Plant milks are not a straight swap.** The AAP says plant-based milks are not recommended in place of dairy milk, with soy milk as the exception. Ask your pediatrician if your child cannot have dairy.
For formula-fed babies, ask at the 12-month checkup how to make the switch for your child. Our [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how feeds changed over the year.
### What changes at 12 months
[[TABLE:changes]]
### Moving from bottle to cup
The AAP suggests offering a cup from about 6 months and finishing the move off the bottle sometime between 12 and 18 months. It is healthiest for children to drink from an open cup by about 2 years.
- **Go gradually.** The AAP suggests limiting bottles to mealtimes at first, then dropping the bottles at other times, especially naps and bedtime.
- **Serve milk in a cup at the table** and water in a cup between meals.
- **Replace the bedtime bottle with comfort.** The AAP suggests extra snuggles, songs or bedtime stories so your child feels reassured.
- **Never put your child to bed with a bottle.** The AAP says the toothbrush should be the last thing to touch the teeth before bed.
Our [when can babies drink water](/mamabee/articles/when-can-babies-drink-water) guide has more on cups and water.
### Meals and snacks
The AAP says 1 year olds need about 1,000 calories a day spread across 3 meals and 2 snacks. It also says many parents notice a sharp drop in appetite after the first birthday, because growth has slowed. That is normal.
- **Toddler portions are small:** the AAP says about a quarter of an adult portion, such as 1 ounce of meat or 2 to 3 tablespoons of beans, 1 to 2 tablespoons of vegetables and a quarter slice of bread.
- **Offer, do not pressure.** The AAP advises encouraging your child to eat without forcing.
- **Keep offering iron-rich foods** like meat, beans, eggs and iron-fortified cereal, especially now that formula is gone.
- **Fruit is better than juice**, according to the AAP.
- **Water:** about 8 to 32 ounces (1 to 4 cups) a day for ages 12 to 24 months (AAP).
**Choking safety:** the AAP says to make sure your child eats only while seated and supervised. Never offer peanuts, whole grapes, cherry tomatoes unless cut in quarters, or whole carrots, and the CDC adds hot dogs, popcorn, chunks of peanut butter and large chunks of cheese to its list.
## What's new at 12 months
### Milestones
By 1 year, the CDC lists these among the things most children do:
- Pulls up to stand and walks while holding on to furniture
- Waves bye-bye and calls a parent "mama," "dada" or another special name
- Understands "no" and pauses or stops when you say it
- Drinks from a cup without a lid, as you hold it
- Picks up small bits of food between thumb and pointer finger
The AAP says many babies take their first steps around their first birthday, though earlier or later is normal. See [baby milestones by month](/mamabee/articles/baby-milestones-by-month) for the full lists.
### The 12-month checkup
The AAP's Bright Futures schedule includes a well-child visit at 12 months. It is a good time to ask about whole milk, bottles, night feeds and naps. See our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) for what comes next.
## When to call your pediatrician
Call your pediatrician if your 1 year old:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down
- Has signs of an ear infection: the AAP lists ear pain that is often worse at night, fever, fluid draining from the ear, or not responding to sounds as usual. Tugging at the ear with fever or unusual fussiness is worth a call.
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot
- Drinks a lot of milk but eats very little food, since too much milk can crowd out iron-rich foods
- Gets a rash, vomiting or diarrhea after a new food or after starting cow's milk. Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Loses skills they once had, or is not doing several of the CDC's 1-year items, such as pulling up to stand, waving or looking for a hidden toy
If something feels off, it is always fine to call. See [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do).
## Frequently asked questions
### How many naps should a 12 month old take?
Most 12 month olds take 2 naps a day, for about 2 to 2.5 hours of day sleep. KidsHealth says most toddlers move to one nap at around 18 months, sometimes sooner.
### What is a good 1 year old sleep schedule?
A common 1 year old sleep schedule is wake at 7 AM, nap at about 10:15 AM and 2:45 PM, and asleep by about 7:45 PM, with 3 to 4 hour wake windows. That gives about 2 hours 15 minutes of naps and about 11 hours at night.
### What time should a 1 year old go to bed?
Most 1 year olds go to bed between 6:30 and 8 PM, about 3.5 to 4 hours after the second nap ends. Go earlier after a short or skipped nap.
### How much milk should a 1 year old drink?
The AAP suggests about 16 ounces (2 cups) of whole milk a day or less, served in a cup. More than 24 ounces a day has been linked to iron deficiency. Breastfed toddlers can keep nursing.
### What does a 1 year old feeding schedule look like?
Most 1 year olds eat 3 meals and 2 snacks a day, with milk at meals and water between them. A simple pattern is breakfast at 7:30, a snack at 9:30, lunch at noon, a snack at 4 and dinner at 5:30.
### Is my 12 month old ready for one nap?
Usually not yet. Most children keep 2 naps until somewhere between about 12 and 18 months. If your child fights one nap most days for 2 weeks or more and stays happy until bedtime, talk it over with your pediatrician and see our nap transitions guide.
## The takeaway
A 12 month old sleep schedule still has 2 naps for most children, with 3 to 4 hour wake windows and a bedtime between 6:30 and 8 PM. The big changes this month are about drinks: whole milk in a cup, about 16 ounces a day or less, and a gradual goodbye to bottles over the next few months. Treat nap strikes and rough nights as a phase first. Looking ahead, our [18 month sleep regression](/mamabee/articles/18-month-sleep-regression) guide covers the next common bumpy patch.
## How MamaBee helps
The first birthday changes a lot at once: milk, cups, meals and maybe naps. MamaBee keeps all of it on one simple timeline, so you can see what is actually changing instead of guessing.
- **Free, ad-free logging with one thumb:** naps, night wakings, nursing, cups of milk, meals, snacks and diapers.
- **Trends at a glance:** insights show how naps and nights are moving over the past 7 days, so you can tell whether a nap strike is a blip or a pattern.
- **Both caregivers in sync:** free real-time sharing for 2 caregivers, so daycare pick-up and bedtime are on the same page.
- **Ready for the 12-month checkup:** export a pediatrician PDF of your logs, check off CDC milestones and track growth on WHO percentiles.
[[CTA||Make the switch to whole milk and cups easier. Try MamaBee free on iPhone.]]
MamaBee Premium adds Sleep Coach nap prediction, which suggests when the next nap is due as your toddler's naps shift, and Bee AI, an assistant that knows your child's log and can help with questions like "is she ready for one nap?" Premium also includes the full vaccine schedule and the Solid Food Allergen Test. Your logs stay on your iPhone unless you turn on co-parent sharing, and your data is never sold.
[[CTA||Two naps, new milk, one calm plan. Download MamaBee for your 1 year old.]]
Sources: [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [KidsHealth: Toddler Sleep, 1 to 2 Years](https://kidshealth.org/en/parents/sleep12yr.html), [Nationwide Children's Hospital: Sleep in Toddlers](https://www.nationwidechildrens.org/sleep-in-toddlers), [Sleep Foundation: 12-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/12-month-sleep-regression), [AAP HealthyChildren: Why Formula Instead of Cow's Milk](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Why-Formula-Instead-of-Cows-Milk.aspx), [AAP HealthyChildren: Recommended Drinks for Young Children](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Recommended-Drinks-for-Young-Children-Ages-0-5.aspx), [AAP HealthyChildren: Discontinuing the Bottle](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Discontinuing-the-Bottle.aspx), [AAP HealthyChildren: Feeding and Nutrition, Your 1 Year Old](https://www.healthychildren.org/English/ages-stages/toddler/nutrition/Pages/Feeding-and-Nutrition-Your-One-Year-Old.aspx), [AAP HealthyChildren: Serving Sizes for Toddlers](https://www.healthychildren.org/English/ages-stages/toddler/nutrition/Pages/Serving-Sizes-for-Toddlers.aspx), [AAP HealthyChildren: Where We Stand, Breastfeeding](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Where-We-Stand-Breastfeeding.aspx), [AAP HealthyChildren: Brush, Book, Bed](https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Brush-Book-Bed.aspx), [CDC: Choking Hazards](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html), [CDC: Milestones by 1 Year](https://www.cdc.gov/act-early/milestones/1-year.html), [AAP HealthyChildren: Movement Milestones, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
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
