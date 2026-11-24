// Week-14 MamaBee mixed set B: 10 month old sleep schedule + 8 month sleep regression
// as DRAFTS only (never published by this script). Numbers follow the series canonical
// sheet (wake windows, naps, feeds) and every medical claim cites a source listed at the
// end of its article. Cover images are copied from a related published article.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week14-mixed-b.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week14-mixed-b.mjs
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
  '10-month-old-schedule': ['baby-play-and-activities-by-age', 'baby-bedtime-routine', 'baby-nap-transitions'],
  '8-month-sleep-regression': ['baby-sleep-regressions-by-age', 'baby-separation-anxiety', '4-month-sleep-regression'],
}

const articles = [

  A('10-month-old-schedule',
    '10 Month Old Sleep Schedule: Sample Day, Naps & Feeds',
    'A 10 month old sleep schedule with 2 naps, 3 to 4 hour wake windows, milk feeds, 3 meals and snacks, plus help with nap refusal and standing in the crib.',
    ['10 month old sleep schedule', '10 month old schedule', '10 month old feeding schedule', '10 month old nap schedule', '10 month old routine'],
    {
      glance: {
        caption: '10 month old schedule at a glance (typical ranges)',
        headers: ['What', 'Typical at 10 months'],
        rows: [
          ['Wake window', '3 to 4 hours, shortest in the morning and longest before bed'],
          ['Naps', '2 a day; most babies keep 2 naps past their first birthday'],
          ['Day sleep', 'About 2 to 2.5 hours in total'],
          ['Night sleep', '10 to 12 hours; some babies still wake'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', '3 to 4 a day; breastfed babies may nurse more often'],
          ['Amount per bottle', '7 to 8 oz of formula; roughly 24 oz a day is typical (AAP), no more than about 32 oz'],
          ['Solids', '3 meals plus 1 to 2 snacks, with more finger foods'],
          ['Water', 'Sips from an open or straw cup with meals, about 4 to 8 oz a day (AAP)'],
          ['Cow\'s milk', 'Not as a drink until 12 months (AAP); yogurt and cheese are fine as foods'],
        ],
      },
      sample: {
        caption: 'Sample 10 month old sleep schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breastfeed or a 7 to 8 oz bottle'],
          ['7:45 AM', 'Breakfast', 'For example, iron-fortified oatmeal with mashed banana'],
          ['9:30 AM', 'Snack (optional)', 'Useful if breakfast was small'],
          ['10:15 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 3 hr 15 min'],
          ['11:30 AM', 'Wake up, milk feed', 'Floor play: crawling, pulling up, cruising along the sofa'],
          ['12:15 PM', 'Lunch', 'Finger foods plus sips of water from a cup'],
          ['2:45 PM', 'Nap 2 (about 1 hr)', 'Wake window: 3 hr 15 min'],
          ['3:45 PM', 'Wake up, snack', 'Some babies still take a milk feed here (a 4th feed)'],
          ['5:30 PM', 'Dinner', 'Eat together as a family when you can'],
          ['6:45 PM', 'Bedtime routine and milk feed', 'Bath or wash, pajamas, book, song'],
          ['7:30 PM', 'Asleep for the night', 'Wake window: 3 hr 45 min'],
        ],
      },
      early: {
        caption: 'Variation: 6:00 AM early riser, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:00 AM', 'Wake up, milk feed', 'Keep the room dim until about 6 if your baby wakes earlier'],
          ['7:00 AM', 'Breakfast', ''],
          ['9:15 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 3 hr 15 min'],
          ['10:30 AM', 'Wake up, milk feed', ''],
          ['11:45 AM', 'Lunch', ''],
          ['1:45 PM', 'Nap 2 (about 1 hr)', 'Wake window: 3 hr 15 min'],
          ['2:45 PM', 'Wake up, snack', 'Optional milk feed'],
          ['5:00 PM', 'Dinner', ''],
          ['5:45 PM', 'Bedtime routine and milk feed', ''],
          ['6:30 PM', 'Asleep for the night', 'Wake window: 3 hr 45 min'],
        ],
      },
      feeding: {
        caption: '10 month old feeding schedule (sample, matching the 7:00 AM day)',
        headers: ['Time', 'Milk', 'Food', 'Ideas'],
        rows: [
          ['7:00 AM', 'Breast milk or 7 to 8 oz formula', '', 'Milk first thing, then breakfast a little later'],
          ['7:45 AM', '', 'Breakfast', 'Iron-fortified oatmeal with mashed banana, or soft strips of scrambled egg'],
          ['9:30 AM', '', 'Snack (optional)', 'Plain whole-milk yogurt, or thin slices of soft ripe pear'],
          ['11:30 AM', 'Breast milk or 7 to 8 oz formula', '', 'After nap 1'],
          ['12:15 PM', 'Sips of water', 'Lunch', 'Soft pasta with shredded chicken and carrot sticks cooked until soft'],
          ['3:45 PM', 'Optional 4th milk feed', 'Snack', 'Avocado spears and shredded cheese'],
          ['5:30 PM', 'Sips of water', 'Dinner', 'Mashed beans or lentils, soft roasted sweet potato, well-cooked broccoli'],
          ['6:45 PM', 'Breast milk or 7 to 8 oz formula', '', 'Part of the bedtime routine'],
        ],
      },
    },
`**A typical 10 month old sleep schedule has 2 naps, wake windows of about 3 to 4 hours and about 2 to 2.5 hours of day sleep, plus 10 to 12 hours at night. Most 10 month olds take 3 to 4 milk feeds of 7 to 8 ounces, eat 3 meals and 1 to 2 snacks, and go to bed between 6:30 and 8 PM.**
Ten months is a busy month. Many babies are crawling fast, pulling up on everything and cruising along furniture. Some refuse naps for a few days, which makes parents wonder about one nap. Most babies are not ready yet.
Use the sample days below as a starting point, not a test. To see how the day looked a month ago, read our [9 month old schedule](/mamabee/articles/9-month-old-schedule).
## 10 month old schedule at a glance
[[TABLE:glance]]
These are typical ranges, not targets. The American Academy of Sleep Medicine (AASM) says babies from 4 to 12 months need 12 to 16 hours of sleep in 24 hours, naps included.
## Sample 10 month old sleep schedule
This sample uses a 7:00 AM wake-up, two naps and wake windows that grow through the day: about 3 hours 15 minutes before each nap and 3 hours 45 minutes before bed.
[[TABLE:sample]]
That adds up to about 2 hours 15 minutes of day sleep and about 11.5 hours at night, with three milk feeds and an optional fourth. If your baby still wakes once at night, that is common too.
### Variation: the 6:00 AM early riser
If your baby is up at 6, shift the whole day an hour earlier instead of stretching the first wake window. Bedtime moves earlier too.
[[TABLE:early]]
Day sleep is still about 2 hours 15 minutes, and night sleep is about 11.5 hours.
## Sleep at 10 months
### Naps
Most 10 month olds take 2 naps and about 2 to 2.5 hours of day sleep in total. KidsHealth notes that some babies nap for 30 minutes and others for up to 2 hours. If the total is in range and your baby is mostly cheerful, the pattern is working.
Wake windows of about 3 to 4 hours suit most babies now. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains how they change. To build a day around your own baby, try the [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator): enter your baby's wake-up time and it suggests nap times and a bedtime.
### Nap refusal: is my baby ready for 1 nap?
Probably not yet. KidsHealth says most toddlers condense their two naps into one at around 18 months, sometimes sooner, and that young toddlers often still take two. So most babies keep 2 naps until somewhere between about 12 and 18 months, and very few are ready at 10 months.
A few days of skipped naps at this age is usually a false sign. Common reasons include:
- **New skills:** standing and cruising in the crib instead of sleeping
- **Separation anxiety:** protesting when you leave the room
- **Teething** or the start of a cold
- **Wake windows that are now too short**, so your baby is not tired enough at nap time
What to try before dropping a nap:
- **Stretch wake windows by 15 minutes** for a few days, staying within 3 to 4 hours.
- **Offer the nap anyway.** Quiet time in a dark crib still rests your baby.
- **Use an earlier bedtime** after a day with one nap, as early as 6:30 PM.
- **Give it 2 weeks.** If your baby happily skips one nap most days for 2 weeks or more, talk it over at your next checkup.
Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide covers the move to one nap when the time comes.
### Night sleep
Expect about 10 to 12 hours at night. Many 10 month olds still wake sometimes, and some still feed once. Whether your baby needs that feed depends on growth, so ask your pediatrician.
When you are ready to work on nights, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night), [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) and our [bedtime routine](/mamabee/articles/baby-bedtime-routine) guide.
### Standing and cruising in the crib
Many babies learn to pull up before they learn to get back down, then stand at the crib rail and cry. The American Academy of Pediatrics (AAP) suggests showing your baby during the day how to bend their knees and lower themselves.
At night, lay your baby back down once, calmly, with few words. If they stand again right away, wait a little before going in. This phase usually passes once the skill feels easy.
### Crib safety for a baby who stands
- **Lower the mattress to its lowest setting.** The AAP says to do this before your baby learns to stand.
- **Keep the crib empty:** no pillows, blankets, bumpers or stuffed toys before 12 months. A wearable blanket or sleep sack is fine.
- **Check what your baby can reach** when standing. KidsHealth warns about blind cords, curtains, wall hangings and anything with cords or ribbons near the crib.
- **Back to sleep is still the rule** (AAP).
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) covers the full list.
### Separation anxiety at bedtime
The AAP says separation anxiety usually peaks between 10 and 18 months and can show up at bedtime, with a baby who resists sleep without you or wakes looking for you. A predictable routine helps, and KidsHealth suggests quiet reassurance, a soothing pat and a quick exit. Our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide goes deeper.
## 10 month old feeding schedule
[[TABLE:feeding]]
### How much milk does a 10 month old need?
Breast milk or formula is still the main drink until 12 months.
- **Formula or bottle-fed:** 3 to 4 feeds of 7 to 8 ounces suits many 10 month olds. The AAP sample menu for 8 to 12 months works out to roughly 24 ounces a day, and the AAP advises no more than about 32 ounces of formula in 24 hours.
- **Breastfed:** keep nursing on cue. Breastfed babies often feed a little more often than bottle-fed babies.
A sudden, large drop in milk is worth mentioning to your pediatrician. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a rough estimate, and the [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how feeds change over the year.
### Solids: 3 meals and 1 to 2 snacks
Most 10 month olds eat 3 meals a day, and many add 1 or 2 small snacks. There is no set amount. Stop when your baby turns away, closes their lips or starts throwing food.
- **Coarser textures:** the AAP says that from about 8 months, babies can move on to foods that need more chewing, such as oatmeal, mashed potato, yogurt and lumpy purees.
- **Iron-rich foods** at most meals: meat, poultry, fish, eggs, beans, lentils and iron-fortified cereal.
- **Allergens:** keep offering tolerated allergens like egg, thinned peanut, dairy, wheat, sesame and fish regularly. See [introducing allergens to your baby](/mamabee/articles/introducing-allergens-to-baby).
- **No added sugar and no juice.** The AAP says babies under 1 should not drink juice, and foods with added sugars are not recommended (CDC).
### More finger foods
By 12 months, the CDC lists picking up small bits of food between thumb and pointer finger as a milestone, so many 10 month olds love feeding themselves. Offer soft pieces they can squash between your fingers. Our [baby-led weaning](/mamabee/articles/baby-led-weaning) guide covers self-feeding in detail.
**Choking safety:** the CDC says to have your baby sit up in a high chair for every meal and snack, never while crawling or walking, and to watch them the whole time. Its list of foods to avoid includes:
- Uncut grapes, berries, cherries and cherry tomatoes
- Nuts and seeds, and chunks or spoonfuls of peanut butter
- Hot dogs, sausages and tough chunks of meat
- Large chunks of cheese and whole beans
- Hard raw vegetables or fruit, and popcorn or chips
### Getting ready for the switch at 12 months
- **No cow's milk as a drink before 12 months.** The AAP explains that cow's milk does not have enough iron and other nutrients babies need, and it is harder for them to digest. Yogurt and cheese are fine as foods.
- **After the first birthday**, the AAP says most children can have whole cow's milk, about 16 ounces (2 cups) a day or less. Ask at the 12-month checkup how to make the switch for your child.
- **Practice the cup now.** The AAP suggests about 4 to 8 ounces of water a day for babies 6 to 12 months, in an open, straw or sippy cup. See [when can babies drink water](/mamabee/articles/when-can-babies-drink-water).
[[CTA||See naps, milk feeds and meals on one timeline with MamaBee.]]
## What's new at 10 months
### Milestones
By 12 months, the CDC lists these among the things most babies do:
- Pulls up to stand
- Walks while holding on to furniture
- Waves bye-bye
- Looks for things they see you hide, like a toy under a blanket
- Picks up small bits of food between thumb and pointer finger
At 10 months, most babies are working toward these. The AAP says many babies take their first steps around their first birthday, though earlier or later is normal. See [baby milestones by month](/mamabee/articles/baby-milestones-by-month) for the full lists.
### Teething
The AAP says first teeth usually appear between 6 and 10 months, and teething does not cause fever or diarrhea. A cold teething ring or gum massage can help; the AAP advises against benzocaine gels and homeopathic teething tablets. See our [baby teething symptoms](/mamabee/articles/baby-teething-symptoms) guide.
### Babyproofing for a cruiser
The AAP suggests gates at the top and bottom of stairs and says to avoid baby walkers. The CDC suggests saving the Poison Help Line number, 800-222-1222, in every phone. See [babyproofing your home](/mamabee/articles/baby-proofing-your-home).
### Simple play ideas for a 10 month old
From the CDC's tips for this age:
- **Push toys** like an empty box, to practice walking
- **Hide and find:** cover a toy with a blanket
- **Point and name:** when your baby points, name what they want
More ideas are in [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age).
## Common challenges at 10 months and what helps
### Short naps
A 30-minute nap is not always a problem if your baby wakes happy. If naps are short most days, check the wake window, since too short and too long can both cause short naps. A dark room helps.
### Throwing food
Dropping food is a normal experiment. Offer small amounts, and end the meal calmly when throwing starts. Many babies are simply full.
### Daycare days and off days
Ask daycare for a daily log of naps and meals, and use an earlier bedtime after short naps. After illness, travel or teething, go back to your usual rhythm the next morning.
## When to call your pediatrician
Call your pediatrician if your 10 month old:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down
- Has signs of an ear infection: the AAP lists ear pain that is often worse at night, fever, fluid draining from the ear, or not responding to sounds as usual. Ear tugging alone can be self-soothing, but tugging with fever or unusual fussiness is worth a call.
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot
- Refuses several milk feeds in a row, or drinks much less milk than usual
- Gets a rash, vomiting or diarrhea after a new food (stop that food and call). Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Loses skills they once had, or is not doing the CDC's 9-month items, such as sitting without support, looking when you call their name or moving things from one hand to the other
If something feels off, it is always fine to call. See [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do), and our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule): the next routine checkup is at 12 months.
## How MamaBee can help
MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, breastfeeds with left and right timers, bottles, pumping, solids and diapers, all on one timeline. 7-day insights show how naps and nights are trending, so you can tell whether skipped naps are a phase. Two caregivers stay in sync in real time. Sleep Coach nap prediction is part of MamaBee Premium.
## Frequently asked questions
### How many naps should a 10 month old take?
Most 10 month olds take 2 naps a day, for about 2 to 2.5 hours of day sleep in total. Most babies keep 2 naps until somewhere between about 12 and 18 months.
### How long should a 10 month old be awake between naps?
About 3 to 4 hours. The first wake window of the day is usually the shortest and the one before bed is the longest.
### What time should a 10 month old go to bed?
Most 10 month olds go to bed between 6:30 and 8 PM, about 3.5 to 4 hours after the last nap ends. Go earlier after short naps.
### How much should a 10 month old eat?
Most 10 month olds take 3 to 4 milk feeds of 7 to 8 ounces, roughly 24 ounces a day and no more than about 32 ounces of formula, plus 3 meals and 1 to 2 snacks. Breastfed babies nurse on cue.
### Why is my 10 month old suddenly refusing naps?
Common reasons include practicing standing in the crib, separation anxiety, teething, illness and wake windows that have become too short. Stretch wake windows a little and keep offering both naps for 2 weeks before deciding your baby is ready for one.
### Can my 10 month old have cow's milk?
Not as a drink. The AAP advises waiting until about 12 months for cow's milk, though yogurt and cheese are fine as foods now.
## The takeaway
A 10 month old sleep schedule usually means 2 naps, wake windows of about 3 to 4 hours, 3 to 4 milk feeds and a bedtime between 6:30 and 8 PM. Most babies are not ready for one nap yet, so treat a week of nap refusal as a phase and adjust wake windows first. Lower the crib mattress for your stander, offer more finger foods, practice the cup, and save cow's milk for after the first birthday. If your baby's sleep is wobbling with all the new skills, our [8 month sleep regression](/mamabee/articles/8-month-sleep-regression) guide covers the 8 to 10 month window, and [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) shows what comes later.
[[CTA||Log naps, feeds and meals in MamaBee, free on iPhone.]]
Sources: [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [KidsHealth: Baby Sleep, 8 to 12 Months](https://kidshealth.org/en/parents/sleep812m.html), [KidsHealth: Toddler Sleep, 1 to 2 Years](https://kidshealth.org/en/parents/sleep12yr.html), [KidsHealth: Naps](https://kidshealth.org/en/parents/naps.html), [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: Sample Menu for a Baby 8 to 12 Months Old](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx), [AAP HealthyChildren: Recommended Drinks for Young Children](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Recommended-Drinks-for-Young-Children-Ages-0-5.aspx), [AAP HealthyChildren: Why Formula Instead of Cow's Milk](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Why-Formula-Instead-of-Cows-Milk.aspx), [AAP HealthyChildren: Introducing Common Food Allergens](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/when-to-introduce-egg-peanut-butter-and-other-common-food-allergens-to-your-baby-food-allergy-prevention-tips.aspx), [CDC: Choking Hazards](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html), [CDC: Milestones by 9 Months](https://www.cdc.gov/act-early/milestones/9-months.html), [CDC: Milestones by 1 Year](https://www.cdc.gov/act-early/milestones/1-year.html), [AAP HealthyChildren: Movement Milestones, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx), [AAP HealthyChildren: Social and Emotional Development, 9 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('8-month-sleep-regression',
    '8 Month Sleep Regression: Signs, How Long & What Helps',
    'The 8 month sleep regression (also called the 9 month regression): signs, causes like crawling and separation anxiety, how long it lasts and what helps.',
    ['8 month sleep regression', '9 month sleep regression', '8 to 10 month sleep regression', '8 month old waking at night', 'separation anxiety sleep'],
    {
      glance: {
        caption: '8 month sleep regression at a glance',
        headers: ['What', 'What to expect'],
        rows: [
          ['When it happens', 'Often somewhere between 8 and 10 months, which is why many parents call it the 9 month sleep regression. Not every baby has one.'],
          ['Common signs', 'More night waking, trouble falling asleep, fussing at bedtime, short or skipped naps, standing or crawling in the crib, crying when you leave'],
          ['Typical causes', 'Crawling, pulling to stand and cruising; separation anxiety; the move from 3 naps to 2; teething; needing longer wake windows'],
          ['How long', 'Usually short-lived, often a few weeks (Sleep Foundation). It can last longer if the schedule no longer fits or illness is involved.'],
          ['What helps', 'Daytime practice of new skills, a steady routine, age-right wake windows, calm and brief check-ins, an earlier bedtime after short naps'],
        ],
      },
      sample: {
        caption: 'Sample 8 month old sleep schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Open the curtains: daylight helps set the body clock'],
          ['8:00 AM', 'Breakfast', 'Then floor time to practice crawling and pulling up'],
          ['9:45 AM', 'Nap 1 (about 1 hr 30 min)', 'Wake window: 2 hr 45 min'],
          ['11:15 AM', 'Wake up, milk feed', ''],
          ['12:15 PM', 'Lunch', ''],
          ['2:30 PM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 3 hr 15 min'],
          ['3:45 PM', 'Wake up, milk feed', 'Outdoor time if you can'],
          ['5:30 PM', 'Dinner', ''],
          ['6:30 PM', 'Bedtime routine and milk feed', 'Same short routine every night'],
          ['7:15 PM', 'Asleep for the night', 'Wake window: 3 hr 30 min'],
        ],
      },
    },
`**The 8 month sleep regression is a common, temporary patch of worse sleep that often shows up somewhere between 8 and 10 months: more night waking, bedtime battles and short naps. It usually lines up with crawling, pulling to stand, separation anxiety and the move to 2 naps. For most babies it is short-lived, often a few weeks, and a steady routine helps it pass.**
If your baby was sleeping reasonably well and now wakes at 2 AM standing at the crib rail and crying, you are not imagining it, and you have not broken anything. This stretch is common, and it is often tied to a burst of new skills.
A quick, honest note first: "sleep regression" is a popular term, not a medical diagnosis, and research on exact ages is limited. Not every baby has one, and the timing varies. Our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide gives a short overview of every age. This article goes much deeper on the 8 to 10 month window.
## 8 month sleep regression at a glance
[[TABLE:glance]]
## Signs of the 8 month sleep regression
The Sleep Foundation describes difficulty falling asleep, more night waking, fussiness or agitation around bedtime, and sometimes longer daytime naps with less night sleep. Parents also often notice:
- Waking more often at night, sometimes after weeks of longer stretches
- Crying as soon as you leave the room at bedtime
- Standing, sitting up or crawling around the crib instead of settling
- Short naps, or fighting one nap altogether
- Being clingier during the day
- Wanting extra feeds at night after a distracted day
Teething and illness can look similar, so look at the whole picture.
## Why it happens: development
Around 8 months, a lot changes at once. The Sleep Foundation lists teething, separation anxiety, overstimulation from a growing awareness of the world, and new physical abilities as likely causes. Because so much happens together, it is hard to point to a single cause.
### Crawling, pulling up and standing
The AAP says crawling is usually mastered between 7 and 10 months, and that babies soon pull to stand every chance they get, often before they know how to get back down. A baby who has just learned a skill wants to practice it, including at 2 AM. Standing in the crib and crying because they cannot sit down is very common.
### Separation anxiety
By 9 months, the CDC lists reacting when you leave, by looking, reaching for you or crying, as a milestone. The AAP explains that as babies learn that objects and people still exist when out of sight, they also realize you are somewhere else, which can be upsetting. The AAP says separation anxiety can show up at bedtime, with a baby who resists sleep without you or wakes looking for you. It usually peaks between 10 and 18 months. It is a sign of healthy attachment, not something you caused.
### The 3 to 2 nap transition
Many babies drop their third nap somewhere between 6 and 9 months. While the change is happening, days can be messy: a short nap here, a skipped nap there, and an overtired baby at bedtime. Overtiredness tends to make night waking worse. Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide covers how to make the switch.
### Needing more awake time
At 8 months, many babies can stay happily awake for about 2.75 to 3.5 hours. If the schedule still uses the shorter wake windows from a few months ago, your baby may not be tired enough at bedtime, or may wake early from naps. A small stretch, 15 minutes at a time, often helps. See [wake windows by age](/mamabee/articles/wake-windows-by-age) or try the [wake window calculator](/mamabee/tools/wake-window-calculator).
### Teething
The AAP says first teeth usually appear between 6 and 10 months. Sore gums can make it harder to settle. Teething does not cause a high fever or diarrhea, so if you see those, call your pediatrician. See our [baby teething symptoms](/mamabee/articles/baby-teething-symptoms) guide.
## Is there a 9 month sleep regression?
The 8 month, 9 month and 8 to 10 month sleep regression usually describe the same thing. The developmental changes behind it, such as crawling, pulling to stand, separation anxiety and the move to 2 naps, happen at different times for different babies, so the rough patch can start at 8 months for one baby and 10 months for another.
At 9 months, the most common triggers are pulling to stand in the crib and separation anxiety, which ramps up toward its peak. A 9 month old is also usually settled on 2 naps, with wake windows of about 3 to 3.5 hours. If your 9 month old's sleep falls apart, the same steps in this guide apply. For a full sample day at that age, see our [9 month old schedule](/mamabee/articles/9-month-old-schedule).
## How long does the 8 month sleep regression last?
The Sleep Foundation describes the 8 month regression as normally short-lived and says most sleep regressions resolve within a few weeks. How long it lasts can depend on what is causing it.
A few things can make it drag on:
- **A schedule your baby has outgrown**, such as an unneeded third nap or wake windows that are too short
- **New habits** that stuck, like a feed or a car ride at every wake
- **Illness or an ear infection** hiding behind the "regression"
- **Separation anxiety**, which the AAP says peaks later, between 10 and 18 months, so clinginess may outlast the sleep disruption
If sleep is not improving after several weeks, or it keeps getting worse, the Sleep Foundation suggests raising it with your pediatrician.
## What helps during the 8 month sleep regression
### Practice new skills during the day
Give your baby plenty of floor time to crawl, pull up and cruise. The AAP suggests gently showing your baby how to bend their knees to lower themselves from standing, which can save you many trips to the crib at night. The CDC suggests putting your baby close to things they can safely pull up on.
### Keep the routine steady and short
The Sleep Foundation says a consistent bedtime routine helps babies fall asleep and can reduce night waking. Keep it the same every night: bath or wash, pajamas, milk, a book, a song and into the crib. Our [bedtime routine](/mamabee/articles/baby-bedtime-routine) guide has a simple version.
### Put your baby down drowsy but awake
Both KidsHealth and the Sleep Foundation suggest putting your baby in the crib drowsy but still awake, so they learn to fall asleep there. If your baby fusses, waiting a couple of minutes before going in gives them a chance to resettle.
### Make check-ins calm and boring
When your baby wakes and cries for you, KidsHealth suggests reassuring them quietly that you are there, with a soothing pat and a quick exit. Keep the lights low and your voice soft. If your baby is standing, lay them down once and step back.
### Ease separation anxiety during the day
The AAP suggests short practice separations at home: when your baby crawls into another safe room, wait a moment before following, and call to them instead of rushing in. The CDC suggests a quick, cheerful goodbye instead of sneaking away. The AAP notes babies handle separation better when they are rested and fed, so plan drop-offs after a nap and a meal.
### Get the wake windows right
Too short a wake window, and your baby fights sleep; too long, and they get overtired. The sample day below is a good starting point.
### Use an earlier bedtime after short naps
On a day when naps fall apart, move bedtime earlier rather than adding a late catnap. For example, if the second nap ends at 3:00 PM, a 3.5-hour wake window puts bedtime at 6:30 PM.
### Daylight and a dark room
The Sleep Foundation says daylight during the day helps set your baby's body clock. At night, keep the room dark and quiet. The AAP says new fears, including of the dark, are common around 9 months; a dim night-light is fine if it helps.
### Treat teething pain kindly
A cold, damp washcloth, a teething ring or a gentle gum massage with clean fingers can help. The AAP advises against benzocaine numbing gels and homeopathic teething tablets. Ask your pediatrician before giving any pain reliever.
## What to avoid, and what not to worry about
- **Avoid overhauling everything at once**, so you can see what is working.
- **Avoid dropping to one nap.** A few skipped naps at 8 months do not mean your baby is ready. KidsHealth says babies 8 to 12 months will likely still take two naps a day.
- **Avoid soft items in the crib** to help your baby settle. No pillows, blankets, bumpers or stuffed toys before 12 months (AAP).
- **Avoid new habits you do not want to keep** if you can, such as a feed at every wake. On a truly rough night, do what gets everyone back to sleep safely.
- **Do not worry that you caused it.** The AAP says clinginess at this age is normal, not a result of spoiling.
- **Do not worry if your baby never "slept through."** The Sleep Foundation notes that even many 12 month olds do not yet sleep six or more hours in a row at night.
## Safe sleep for a baby who stands
- **Lower the crib mattress** to its lowest position before your baby learns to stand (AAP).
- **Back to sleep, on a firm, flat, separate surface** with only a fitted sheet. If your baby rolls both ways on their own, you do not need to turn them back.
- **Room-share without bed-sharing**, ideally for at least the first 6 months (AAP).
- **Use a sleep sack**, not a loose blanket.
- **Check what your baby can reach** from standing, like blind cords and curtains (KidsHealth).
See our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) for the full list.
## Sample 8 month old sleep schedule
This sample uses a 7:00 AM wake-up, 2 naps and wake windows of 2 hours 45 minutes, 3 hours 15 minutes and 3.5 hours. During a regression, a steady day like this gives your baby the best chance at a calmer night.
[[TABLE:sample]]
That is about 2 hours 45 minutes of day sleep and about 11 hours 45 minutes at night, with four milk feeds during the day. Some 8 month olds still wake once to feed, and that can be normal. For a 3-nap version, feeding details and more, see our full [8 month old schedule](/mamabee/articles/8-month-old-schedule).
## Sleep training during a regression
There is no single right answer. Some families wait until the rough patch passes before starting any formal sleep training. Others start once their baby is well and not teething, because a consistent response at night can help. Either is reasonable. If your baby is sick, wait until they are better. Our [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) guide compares the common approaches, from gentle to more structured, and [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night) covers the basics.
## When to call your pediatrician
Call your pediatrician if your baby:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down
- Has signs of an ear infection: the AAP lists ear pain that is often worse at night, fever, fluid draining from the ear, or not responding to sounds as usual. Ear tugging alone can be self-soothing, but tugging with fever or unusual fussiness is worth a call.
- Is feeding much less, has fewer wet diapers or bowel movements, or is not gaining weight (Sleep Foundation)
- Breathes noisily or with effort during sleep
- Still sleeps badly after several weeks, or sleep keeps getting worse
- Loses skills they once had, or by 9 months is not doing the CDC's milestones, such as sitting without support, looking when you call their name or moving things from one hand to the other
If something feels off, it is always fine to call. See [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do) and [baby milestones by month](/mamabee/articles/baby-milestones-by-month).
## How MamaBee can help
In a rough week, it is hard to remember whether nights are getting better. MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, breastfeeds with left and right timers, bottles, pumping, solids and diapers on one timeline. 7-day insights show how naps and nights are trending, so you can see the regression easing. Two caregivers stay in sync in real time, which helps when you are taking turns at night. Sleep Coach nap prediction is part of MamaBee Premium.
[[CTA||See whether nights are getting better. Log sleep in MamaBee.]]
## Frequently asked questions
### When does the 8 month sleep regression start?
It often starts somewhere between 8 and 10 months, alongside crawling, pulling to stand and separation anxiety. Some babies never have a noticeable regression.
### How long does the 8 month sleep regression last?
The Sleep Foundation describes it as usually short-lived, and most sleep regressions resolve within a few weeks. If sleep is not improving after several weeks, talk to your pediatrician.
### Is the 9 month sleep regression the same as the 8 month regression?
Usually, yes. Both names describe the same 8 to 10 month window, when new motor skills, separation anxiety and the move to 2 naps can disrupt sleep.
### Why is my 8 month old waking up every hour?
Common reasons include practicing standing or crawling in the crib, separation anxiety, teething, an overtired day and illness such as an ear infection. If waking comes with fever or ear pain, call your pediatrician.
### Should I drop a nap during the 8 month sleep regression?
Drop the third nap if your baby is ready, but keep 2 naps. KidsHealth says babies 8 to 12 months will likely still take two naps a day, so nap refusal now is usually a phase.
### Is it OK to feed my baby back to sleep during a regression?
Some 8 month olds still need a night feed, and that can be normal. Ask your pediatrician whether your baby still needs one, and try not to make a feed the answer to every wake if your baby is not hungry.
## The takeaway
The 8 month sleep regression, also called the 9 month or 8 to 10 month regression, is a common and temporary bump that usually lines up with crawling, standing, separation anxiety and the move to 2 naps. Give your baby lots of daytime practice, keep the routine steady, check wake windows, make night check-ins calm and brief, and lower the crib mattress for your new stander. Most babies come through it in a few weeks. If it drags on or comes with fever or ear pain, call your pediatrician. For the earlier, different 4-month change, see our [4 month sleep regression](/mamabee/articles/4-month-sleep-regression) guide.
Sources: [Sleep Foundation: 8-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/8-month-sleep-regression), [Sleep Foundation: 12-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/12-month-sleep-regression), [AAP HealthyChildren: Social and Emotional Development, 9 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx), [AAP HealthyChildren: Movement Milestones, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx), [CDC: Milestones by 9 Months](https://www.cdc.gov/act-early/milestones/9-months.html), [KidsHealth: Baby Sleep, 8 to 12 Months](https://kidshealth.org/en/parents/sleep812m.html), [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx)
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
