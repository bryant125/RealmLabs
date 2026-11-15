// Week-13 MamaBee "N month old schedule" series, part C: 6 and 7 month old schedules
// as DRAFTS only (never published by this script). Numbers follow the series canonical
// sheet (wake windows, naps, feeds) and every medical claim cites a source listed at the
// end of its article. Cover images are copied from a related published article.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week13-schedules-c.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week13-schedules-c.mjs
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
  '6-month-old-schedule': ['when-to-start-solids', 'baby-led-weaning', 'baby-feeding-schedule-by-age'],
  '7-month-old-schedule': ['baby-separation-anxiety', 'baby-nap-transitions', 'wake-windows-by-age'],
}

const articles = [

  A('6-month-old-schedule',
    '6 Month Old Schedule: Sample Day for Naps, Solids & Bedtime',
    'A sample 6 month old schedule with 3 naps, wake windows, milk feeds and where first solids fit, plus sleep tips, milestones and when to call the doctor.',
    ['6 month old schedule', '6 month old sleep schedule', '6 month old feeding schedule', '6 month old nap schedule', '6 month old routine'],
    {
      glance: {
        caption: '6 month old schedule at a glance (typical ranges)',
        headers: ['What', 'Typical at 6 months'],
        rows: [
          ['Wake window', '2 to 2.5 hours, stretching toward 3 hours before bedtime'],
          ['Naps', '3 a day (some babies move to 2 between 6 and 8 months)'],
          ['Day sleep', 'About 3 hours in total'],
          ['Night sleep', '10 to 12 hours; some babies still wake to feed'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', '4 to 5 a day; breastfed babies may nurse more often'],
          ['Amount per bottle', '6 to 8 oz of formula; no more than about 32 oz a day (AAP)'],
          ['Solids', 'Start around 6 months once ready: 1 small meal a day, then 2'],
          ['Water', 'Small sips from an open, straw or sippy cup with meals; no more than 8 oz a day (AAP)'],
        ],
      },
      sample: {
        caption: 'Sample 6 month old schedule: 7:00 AM wake, 3 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breastfeed or a 6 to 8 oz bottle'],
          ['8:00 AM', 'Solids: meal 1', 'Once your baby is ready. Start with half a spoonful or less'],
          ['9:15 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 2 hr 15 min'],
          ['10:30 AM', 'Wake up, milk feed', 'Floor play, tummy time, supported sitting'],
          ['12:45 PM', 'Nap 2 (about 1 hr 30 min)', 'Wake window: 2 hr 15 min'],
          ['2:15 PM', 'Wake up, milk feed', 'A walk, books, play'],
          ['4:45 PM', 'Nap 3: short catnap (about 30 min)', 'Wake window: 2 hr 30 min. A stroller or carrier nap is fine'],
          ['5:15 PM', 'Wake up', 'Last wake window of the day'],
          ['5:45 PM', 'Solids: meal 2', 'Add a second meal once the first is going well, often at family dinner'],
          ['7:00 PM', 'Bedtime routine and milk feed', 'Bath or wash, pajamas, book, song'],
          ['7:45 PM', 'Asleep for the night', 'Wake window: 2 hr 30 min. Some babies still wake once to feed'],
        ],
      },
      early: {
        caption: 'Variation: 6:00 AM early riser, 3 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:00 AM', 'Wake up, milk feed', 'Keep the room dim until about 6 if your baby wakes earlier'],
          ['7:00 AM', 'Solids: meal 1', 'Optional; any time your baby is awake and happy works'],
          ['8:00 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 2 hr'],
          ['9:15 AM', 'Wake up, milk feed', ''],
          ['11:30 AM', 'Nap 2 (about 1 hr 30 min)', 'Wake window: 2 hr 15 min'],
          ['1:00 PM', 'Wake up, milk feed', ''],
          ['3:15 PM', 'Nap 3: short catnap (about 30 min)', 'Wake window: 2 hr 15 min'],
          ['3:45 PM', 'Wake up', ''],
          ['4:15 PM', 'Milk feed', 'A smaller feed is fine'],
          ['5:00 PM', 'Solids: meal 2', 'Once your baby is on two meals'],
          ['6:00 PM', 'Bedtime routine and milk feed', ''],
          ['6:30 PM', 'Asleep for the night', 'Wake window: 2 hr 45 min, stretching toward 3 hours'],
        ],
      },
    },
`**A typical 6 month old schedule has 3 naps, wake windows of about 2 to 2.5 hours that stretch toward 3 hours before bed, and about 3 hours of day sleep. Most babies take 4 to 5 milk feeds of 6 to 8 ounces, start one small solid meal once ready, and go to bed between 6:30 and 8 PM.**
Six months is a big month. Many babies are sitting with a little help, grabbing everything in reach and watching every bite you take. Naps settle into a three-nap rhythm, and solid food starts to take a small place between milk feeds.
Use the schedule below as a starting point, not a test. To see how the day looked last month, before solids, read our [5 month old schedule](/mamabee/articles/5-month-old-schedule).
## 6 month old schedule at a glance
[[TABLE:glance]]
Every number here is a range because babies vary. The American Academy of Sleep Medicine (AASM) says babies from 4 to 12 months need 12 to 16 hours of sleep in 24 hours, naps included, so look at the whole day rather than one nap.
## Sample 6 month old schedule
This sample uses a 7:00 AM wake-up, three naps and wake windows of about 2 to 2.5 hours. The solids rows show where many families fit first foods. If you have not started solids yet, skip those rows; the rest of the day stays the same.
[[TABLE:sample]]
That adds up to about 3 hours 15 minutes of day sleep and about 11 hours 15 minutes at night, with four milk feeds during the day. Some babies still have one feed overnight, which makes five. Both are normal.
### Variation: the 6:00 AM early riser
If your baby is up at 6, shift the whole day earlier instead of stretching the morning. Bedtime moves earlier too.
[[TABLE:early]]
This day has five milk feeds because it starts earlier and adds a late-afternoon feed. Day sleep is still about 3 hours 15 minutes, and night sleep is about 11.5 hours.
## Sleep at 6 months
### Naps
Most 6 month olds take 3 naps and about 3 hours of day sleep in total. The first two naps tend to be longer, and the third is often a short catnap. If the total is in range and your baby is mostly cheerful when awake, the pattern is working.
Wake windows of about 2 to 2.5 hours suit many babies, with the last stretch before bed reaching toward 3 hours. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains how they change. To build a day around your own baby, try the [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator): enter your baby's wake-up time and it suggests nap times and a bedtime.
### Is my baby ready for 2 naps?
Some babies move from 3 naps to 2 between 6 and 8 months, but most are not there yet at 6 months. Signs a baby may be getting ready include fighting the third nap on most days, the third nap pushing bedtime past 8 PM, and staying happy through longer wake windows. The change is usually gradual. Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide covers how to handle it, and the [7 month old schedule](/mamabee/articles/7-month-old-schedule) shows a sample two-nap day.
### Night sleep
Expect about 10 to 12 hours at night. Many 6 month olds still wake once or twice, and a night feed can still be normal at this age, especially for breastfed babies. If you are wondering whether your baby still needs one, ask at the 6-month checkup, where your pediatrician will know your baby's weight gain.
When you are ready to work on nights, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night), [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) and our [bedtime routine](/mamabee/articles/baby-bedtime-routine) guide.
### Safe sleep at 6 months
The American Academy of Pediatrics (AAP) safe sleep basics still apply:
- **Back to sleep, every sleep.** If your baby rolls both ways comfortably, the AAP says you do not need to keep turning them back.
- **A firm, flat, separate surface** with only a fitted sheet. No pillows, blankets, bumpers or stuffed toys.
- **Room-share without bed-sharing** for at least the first 6 months.
- **No swaddling** once your baby shows signs of trying to roll. A sleep sack that leaves the arms free is fine.
- **Lower the crib mattress before your baby can sit up alone**, so they cannot lean or pull themselves over the rail.
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) covers the full list.
## Feeding at 6 months
### How much milk does a 6 month old need?
Breast milk or formula is still your baby's main nutrition and stays that way through the first year. Solids at this age are about practice, not replacing milk.
- **Formula or bottle-fed:** the AAP says that by 6 months, babies typically take 6 to 8 ounces at each of 4 or 5 feeds in 24 hours. Keep the daily total to about 32 ounces or less.
- **Breastfed:** keep nursing on cue. Breastfed babies often feed a little more often than bottle-fed babies.
Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a rough daily estimate, and the [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how feeds change over the year.
**Fullness cues:** closing the lips, turning away, or getting fidgety and distracted during a feed usually mean your baby is done.
### Is my baby ready for solids?
The AAP and CDC recommend starting solids at about 6 months, and not before 4 months. Readiness matters more than the date. The CDC lists these signs that your baby:
- Sits up alone or with support
- Controls their head and neck
- Opens their mouth when you offer food
- Swallows food rather than pushing it back out onto the chin
- Brings objects to the mouth and tries to grasp small things
Our guide to [when to start solids](/mamabee/articles/when-to-start-solids) covers readiness and first foods in more detail.
### Where solids fit in the day
- **Start with one small meal a day** when your baby is awake and cheerful. Many families pick mid-morning, a little while after a milk feed, so your baby is neither starving nor full.
- **Start tiny.** The AAP suggests half a spoonful or less at first. Food rolling back out is part of learning.
- **Add a second meal** once the first is going well, often at family dinner.
- **Offer iron-rich foods early**, such as iron-fortified cereal, pureed meat or beans.
- **Try one new food at a time.** The CDC suggests waiting 3 to 5 days between new foods so you can spot a reaction.
- **Include common allergens.** The AAP says there is no evidence that delaying egg, peanut, dairy or sesame prevents allergies. Offer peanut thinned into a puree, never whole nuts or spoonfuls of peanut butter. If your baby has severe eczema or an egg allergy, talk to your pediatrician first. See [introducing allergens to your baby](/mamabee/articles/introducing-allergens-to-baby).
- **Purees, finger foods or both are fine.** Our [baby-led weaning](/mamabee/articles/baby-led-weaning) guide explains self-feeding. Serve soft, mashable textures and skip choking hazards like whole grapes, nuts, popcorn, hot dogs and hard raw vegetables or apple.
- **Offer sips of water with meals** from an open, straw or sippy cup, no more than 8 ounces a day (AAP). See [when can babies drink water](/mamabee/articles/when-can-babies-drink-water).
- **Expect poop to change.** Undigested bits are normal, the AAP says, but very loose, watery or mucus-filled stools mean slow down and talk to your pediatrician if they continue.
[[CTA||See naps, milk feeds and first foods on one timeline with MamaBee.]]
## What's new at 6 months
### Milestones
By 6 months, the CDC lists these among the things most babies do:
- Takes turns making sounds with you
- Reaches to grab a toy they want
- Closes lips to show they do not want more food
- Rolls from tummy to back
- Leans on hands to support themselves when sitting
Our [baby milestones by month](/mamabee/articles/baby-milestones-by-month) guide lists what comes next.
**Sitting with support:** many 6 month olds can sit briefly if they lean forward on their hands or have you behind them. Toppling is how they build balance, so practice on the floor, never on a raised surface.
### Teething may start
The AAP says first teeth usually appear between 6 and 10 months, though discomfort can start earlier. Drooling, chewing and extra fussiness are common. Teething does not cause fever or diarrhea, so call your pediatrician if you see those. A cold teething ring, a gentle gum massage or sips of cold water from a cup can help. The AAP advises against benzocaine numbing gels and homeopathic teething tablets. See our [baby teething symptoms](/mamabee/articles/baby-teething-symptoms) guide.
### The 6-month checkup
The AAP Bright Futures schedule includes a well-baby visit at 6 months: measurements, a full exam, development questions, a parent depression screening, oral health and lead risk checks, and often vaccines (plus a flu shot in season). See our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) and [baby vaccine schedule explained](/mamabee/articles/baby-vaccine-schedule-explained).
### Simple play ideas for a 6 month old
These build on the CDC's tips for this age:
- **Supported sitting:** hold your baby up as they sit and give them a toy to look at.
- **Toys just out of reach** during [tummy time](/mamabee/articles/tummy-time-guide), to encourage rolling and reaching.
- **Back-and-forth sounds:** when your baby babbles, copy them and wait for a reply.
- **The drop game:** when your baby drops a toy, hand it back. It teaches cause and effect.
More ideas are in [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age).
## Common challenges at 6 months and what helps
### Short naps
If your baby wakes happy, the nap may simply be short. If they wake crying, pause briefly before going in, since some babies resettle. Check the wake window: both too short and too long can cause short naps. A dark room helps.
### Fighting the third nap
A stroller walk, the carrier or a contact nap is fine for this short bridge nap. If your baby refuses it and is overtired by evening, move bedtime earlier, toward 6:30 PM. Our guide to [contact naps and independent sleep](/mamabee/articles/contact-naps-and-independent-sleep) explains how to balance both.
### Early morning waking
If your baby wakes well before your usual start, treat it as part of the night: dark room, quiet voice, and wait before starting the day if your baby is content. A late bedtime or an overlong last wake window can also push waking earlier.
### Waking more at night again
New skills and teething often show up at night. Give plenty of floor time during the day, keep night wakes calm and dim, and feed if your baby seems hungry. Our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide explains these bumps.
### Not interested in solids
Pushing food out or only playing with it for weeks is normal, because milk is still doing the heavy lifting. Offer food when your baby is in a good mood and try again another day. Never force a bite.
## How to adjust the schedule for your baby
- **Follow cues first.** Rubbing eyes, staring off, yawning and fussing mean it is time to wind down, whatever the clock says.
- **Anchor the ends of the day.** A steady wake time and bedtime make naps easier to predict.
- **Early riser:** shift the whole day earlier, as in the 6:00 AM variation, and keep bedtime between 6:30 and 8 PM.
- **Daycare:** group nap schedules can mean shorter naps. Ask for a daily log, and use an earlier bedtime after short naps.
- **Off days happen.** Illness, travel and teething can throw things off. Go back to your usual rhythm the next morning.
## When to call your pediatrician
Call your pediatrician if your 6 month old:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick after the fever comes down. (For babies under 3 months, a rectal temperature of 100.4°F or higher is urgent.)
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot, which can be signs of dehydration
- Refuses several milk feeds in a row or is feeding much less than usual
- Gets a rash, vomiting or diarrhea after a new food (stop that food and call). Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Loses skills they once had, or is not doing the CDC's 6-month items, such as reaching for toys, rolling from tummy to back or making sounds with you
If something feels wrong, calling is always reasonable. Our guide on [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do) has more.
## How MamaBee can help
It is easy to forget which food was new on which day. MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, breastfeeds with left and right timers, bottles, pumping, solids and diapers, all on one timeline with 7-day insights. Two caregivers stay in sync in real time. Sleep Coach nap prediction is part of MamaBee Premium.
## Frequently asked questions
### How long should a 6 month old nap?
Most 6 month olds nap about 3 hours a day in total, over 3 naps. The first two are usually longer, and the third is often a short late-afternoon catnap.
### What time should a 6 month old go to bed?
Usually between 6:30 and 8 PM, about 2.5 to 3 hours after the last nap ends. Go earlier on days with short naps.
### How many ounces should a 6 month old drink?
The AAP says most formula-fed 6 month olds take 6 to 8 ounces at each of 4 or 5 feeds a day, about 32 ounces or less in total. Breastfed babies should keep nursing on cue.
### How many times a day should a 6 month old eat solids?
Start with one small meal a day once your baby shows readiness signs, then add a second when the first is going well. Milk is still the main nutrition, so amounts can stay small.
### When do babies go from 3 naps to 2?
Many babies move from 3 naps to 2 between 6 and 8 months. Signs include fighting the third nap most days and the third nap pushing bedtime too late.
### Should a 6 month old still wake up at night to eat?
Some 6 month olds still wake once or twice to feed, and that can be normal. Ask your pediatrician at the 6-month checkup whether your baby still needs a night feed.
## The takeaway
A 6 month old schedule usually means 3 naps, wake windows of about 2 to 2.5 hours, 4 to 5 milk feeds and a bedtime between 6:30 and 8 PM. Once your baby is ready, add one small meal of solids, then two, while milk stays the main food. Follow your baby's cues, keep safe sleep habits, and bring your questions to the 6-month checkup. Next month, many babies start moving to two naps, covered in our [7 month old schedule](/mamabee/articles/7-month-old-schedule).
[[CTA||Log naps, feeds and first foods in MamaBee, free on iPhone.]]
Sources: [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: Starting Solid Foods](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx), [AAP HealthyChildren: Introducing Common Food Allergens](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/when-to-introduce-egg-peanut-butter-and-other-common-food-allergens-to-your-baby-food-allergy-prevention-tips.aspx), [CDC: Introducing Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html), [CDC: Choking Hazards](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html), [CDC: Milestones by 6 Months](https://www.cdc.gov/act-early/milestones/6-months.html), [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Swaddling](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('7-month-old-schedule',
    '7 Month Old Schedule: 2-Nap and 3-Nap Days, Solids & Sleep',
    'Sample 7 month old schedules for 2-nap and 3-nap days, with wake windows, milk feeds, solid meals, separation anxiety, night waking and crib safety tips.',
    ['7 month old schedule', '7 month old sleep schedule', '7 month old feeding schedule', '7 month old nap schedule', '7 month old routine'],
    {
      glance: {
        caption: '7 month old schedule at a glance (typical ranges)',
        headers: ['What', 'Typical at 7 months'],
        rows: [
          ['Wake window', '2.5 to 3.5 hours, shortest in the morning and longest before bed'],
          ['Naps', '2 for most babies; some still need 3'],
          ['Day sleep', 'About 2.5 to 3 hours in total'],
          ['Night sleep', '10 to 12 hours; some babies still wake to feed'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', '4 to 5 a day; breastfed babies may nurse more often'],
          ['Amount per bottle', '6 to 8 oz of formula; no more than about 32 oz a day (AAP)'],
          ['Solids', '2 small meals a day, moving toward 3'],
          ['Water', 'Sips from an open, straw or sippy cup with meals; no more than 8 oz a day (AAP)'],
        ],
      },
      twoNap: {
        caption: 'Sample 7 month old schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breastfeed or a 6 to 8 oz bottle'],
          ['8:00 AM', 'Solids: breakfast', 'For example, iron-fortified cereal with mashed fruit'],
          ['9:45 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 2 hr 45 min'],
          ['11:00 AM', 'Wake up, milk feed', 'Floor play: reaching, rolling, rocking on hands and knees'],
          ['12:00 PM', 'Solids: lunch (optional)', 'Add this third meal later, when your baby is ready'],
          ['2:15 PM', 'Nap 2 (about 1 hr 30 min)', 'Wake window: 3 hr 15 min'],
          ['3:45 PM', 'Wake up, milk feed', 'Outdoor time, books, play'],
          ['5:30 PM', 'Solids: dinner', 'Eat together as a family when you can'],
          ['6:30 PM', 'Bedtime routine and milk feed', 'Bath or wash, pajamas, book, song'],
          ['7:15 PM', 'Asleep for the night', 'Wake window: 3 hr 30 min. Some babies still wake once to feed'],
        ],
      },
      threeNap: {
        caption: 'Sample 7 month old schedule: 7:00 AM wake, 3 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', ''],
          ['8:00 AM', 'Solids: breakfast', ''],
          ['9:30 AM', 'Nap 1 (about 1 hr)', 'Wake window: 2 hr 30 min'],
          ['10:30 AM', 'Wake up, milk feed', ''],
          ['1:00 PM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 2 hr 30 min'],
          ['2:15 PM', 'Wake up, milk feed', ''],
          ['4:45 PM', 'Nap 3: short catnap (about 30 min)', 'Wake window: 2 hr 30 min. Stroller or carrier is fine'],
          ['5:15 PM', 'Wake up', ''],
          ['5:30 PM', 'Solids: dinner', ''],
          ['7:00 PM', 'Bedtime routine and milk feed', ''],
          ['7:45 PM', 'Asleep for the night', 'Wake window: 2 hr 30 min'],
        ],
      },
    },
`**Most 7 month olds are moving from 3 naps to 2, with wake windows of about 2.5 to 3.5 hours and about 2.5 to 3 hours of day sleep. They usually take 4 to 5 milk feeds of 6 to 8 ounces, eat 2 small solid meals (moving toward 3), and go to bed between 6:30 and 8 PM.**
Seven months is often a month of change. Many babies are close to sitting on their own, rocking on hands and knees, and noticing when you leave the room. For many families, this is also the month the third nap goes.
Below are two sample days, one with 2 naps and one with 3, so you can use whichever fits your baby right now. If your baby is still on three naps most days, the [6 month old schedule](/mamabee/articles/6-month-old-schedule) may also help.
## 7 month old schedule at a glance
[[TABLE:glance]]
These are typical ranges, not exact targets. The American Academy of Sleep Medicine (AASM) says babies from 4 to 12 months need 12 to 16 hours of sleep in 24 hours, naps included.
## Sample 7 month old schedule
### 2-nap day
This is the pattern most 7 month olds settle into. It uses a 7:00 AM wake-up and wake windows that grow through the day: about 2 hours 45 minutes before the first nap, 3 hours 15 minutes before the second, and 3.5 hours before bed.
[[TABLE:twoNap]]
That adds up to about 2 hours 45 minutes of day sleep and about 11 hours 45 minutes at night, with four milk feeds during the day. A night feed, if your baby still has one, makes five.
### 3-nap day
Some 7 month olds still need a third nap, especially if their first two naps are short. Wake windows here sit at about 2.5 hours, the low end of the range for this age.
[[TABLE:threeNap]]
That is about 2 hours 45 minutes of day sleep and about 11 hours 15 minutes at night. Bedtime is later on this day because the catnap ends at 5:15 PM.
During the transition, decide each morning based on the first nap: a long one often means two naps will work, and a short one may mean you need the third.
## Sleep at 7 months
### The 3 to 2 nap transition
Babies drop the third nap at different ages, usually somewhere between 6 and 9 months. Signs your baby may be ready:
- Fighting or skipping the third nap on most days
- The third nap pushing bedtime past 8 PM
- Taking a long time to fall asleep for naps
- Staying happy through a 3-hour wake window
How to make the change:
- **Stretch wake windows a little at a time** over several days, rather than jumping straight to a long day.
- **Use an earlier bedtime as the bridge.** On short-nap days, bedtime as early as 6:30 PM prevents an overtired evening.
- **Expect mixed days.** Switching between 2 and 3 naps for a while is normal.
Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide goes deeper, and [wake windows by age](/mamabee/articles/wake-windows-by-age) shows how the ranges change. For a day built around your baby, try the [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator): enter your baby's wake-up time and it suggests nap times and a bedtime.
### Night sleep and night waking
Most 7 month olds sleep about 10 to 12 hours at night. Many still wake, and some still feed once or twice. That can be normal at this age. Your pediatrician can tell you whether your baby still needs a night feed based on growth.
Common reasons for new night waking at 7 months:
- **Separation anxiety:** your baby may wake and look for you
- **New skills:** practicing sitting, kneeling or rocking in the crib
- **Teething discomfort**
- **An overtired day** during the nap transition
- **Hunger** after distracted daytime feeds
Respond calmly and keep nights dim and boring. To work on longer stretches, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night) and [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods). Our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide explains why sleep wobbles around new skills.
### Crib safety for a baby on the move
- **Lower the mattress.** The AAP says to lower it before your baby can sit, and to set it at the lowest position before your baby learns to stand.
- **Remove mobiles** once your baby can get onto hands and knees, or by 5 months, whichever comes first.
- **Keep the crib empty:** no pillows, blankets, bumpers or stuffed toys.
- **Keep the crib away from windows** and blind or curtain cords.
- **Back to sleep is still the rule**, but if your baby rolls both ways on their own, the AAP says you do not need to turn them back.
- **Use a sleep sack that leaves the arms free**, not a swaddle. See [dressing baby for sleep](/mamabee/articles/dressing-baby-for-sleep) and our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines).
## Feeding at 7 months
### How much milk does a 7 month old need?
Breast milk or formula is still the main nutrition at 7 months and stays that way through the first year.
- **Formula or bottle-fed:** most babies take 4 to 5 feeds of 6 to 8 ounces in 24 hours, according to the AAP. Keep the total to about 32 ounces or less.
- **Breastfed:** keep nursing on cue. Breastfed babies often feed a little more often than bottle-fed babies.
If your baby suddenly drinks much less milk as solids increase, mention it to your pediatrician. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a rough estimate, and the [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows what changes next.
### Solids: from 2 meals toward 3
Most 7 month olds eat 2 small meals a day, and some are ready for a third. There is no set amount. Stop when your baby turns away, closes their lips or pushes the spoon away.
- **Variety:** the CDC says that by 7 or 8 months, babies can eat foods from different food groups: vegetables, fruits, meat or other proteins, dairy without added sugars like yogurt and cheese, and whole grains like infant cereals.
- **Iron-rich foods** matter now: iron-fortified cereal, meat, beans and lentils. The CDC suggests varying cereals (oat, barley, multigrain) rather than only rice cereal.
- **Texture:** move from smooth purees toward mashed and finely chopped soft foods. The CDC notes babies may need to try a food again and again before they like it.
- **Finger foods:** once your baby can sit up and bring things to the mouth, the AAP says you can offer soft finger foods. Our [baby-led weaning](/mamabee/articles/baby-led-weaning) guide covers how.
- **Allergens:** once tolerated, keep offering common allergens like egg, thinned peanut, dairy, wheat, sesame and fish regularly. See [introducing allergens to your baby](/mamabee/articles/introducing-allergens-to-baby).
- **Choking safety:** your baby should sit upright in a high chair, supervised, for every meal. Skip whole grapes, nuts, popcorn, hot dogs, chunks of peanut butter and hard raw vegetables or apple.
- **Drinks:** offer sips of water from an open, straw or sippy cup with meals, no more than 8 ounces a day (AAP). See [when can babies drink water](/mamabee/articles/when-can-babies-drink-water). No juice and no cow's milk as a drink before 12 months.
[[CTA||Track naps, milk feeds and every new food with MamaBee.]]
## What's new at 7 months
### Milestones
By 6 months, the CDC lists rolling from tummy to back, reaching for toys and leaning on the hands to sit. By 9 months the CDC lists:
- Sits without support
- Gets to a sitting position by themselves
- Moves things from one hand to the other
- Looks for objects when they drop out of sight
- Reacts when you leave, by looking, reaching for you or crying
So at 7 months, most babies are somewhere in between. See [baby milestones by month](/mamabee/articles/baby-milestones-by-month) for the full lists.
### Sitting and early crawling
Many 7 month olds sit briefly on their own and topple often. Some rock on hands and knees, scoot, roll to get places or creep on their tummy. All of these count, and crawling is not on the CDC checklists. The AAP says to tell your pediatrician if your baby is not sitting alone by 9 months.
### Early separation anxiety
Many babies now tense up around strangers and protest when you leave. The AAP says stranger anxiety is usually one of the first emotional milestones, and separation anxiety usually peaks between 10 and 18 months. It is a sign of healthy attachment, not something you caused. Our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide covers it in depth.
### Babyproofing
The CDC suggests moving sharp or breakable things out of reach, locking away medicines and cleaning products, and saving the Poison Help Line number, 800-222-1222, in every phone.
### Simple play ideas for a 7 month old
These build on the CDC's tips for babies heading toward 9 months:
- **Toys a little out of reach** on a play mat, to encourage scooting or crawling
- **Peek-a-boo** with a cloth over your head
- **Dump and fill:** tip blocks out of a container and put them back
- **Sound games:** when your baby says "bababa," say it back, then add a word like "ball"
More ideas are in [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age).
## Common challenges at 7 months and what helps
### The third nap is a battle
If your baby fights the third nap most of the week, try a 2-nap day with slightly longer wake windows and an early bedtime. If they melt down by late afternoon, go back to three naps for a while.
### Short naps on 2-nap days
When the second nap is short, the stretch to bedtime feels endless. Move bedtime earlier, even to 6:30 PM, rather than adding a late catnap that pushes bedtime too late.
### Separation anxiety at bedtime and drop-offs
The CDC suggests a quick, cheerful goodbye instead of sneaking away, and a warm hello when you return. The AAP notes that babies are more prone to separation anxiety when tired, hungry or sick, so plan drop-offs after a nap and a feed. At bedtime, a steady routine and brief, calm check-ins help.
### Sitting or kneeling in the crib at night
Many babies learn to sit up but not how to lie back down. Practice going from sitting to lying on the floor during the day. At night, lay your baby down gently with little talking. This phase usually passes once the skill is easy.
### Distracted milk feeds
Busy 7 month olds often pop off to look around. Feed in a quiet, dim room, especially in the morning and at bedtime. A distracted baby may make up for it at night, which is one reason night waking can return.
## How to adjust the schedule for your baby
- **Read cues before the clock.** Rubbing eyes, staring off and fussing mean it is time to wind down.
- **Anchor wake time and bedtime**, and let naps flex during the transition.
- **Early riser:** if your baby wakes at 6 AM, shift both sample days an hour earlier and keep bedtime between 6:30 and 8 PM.
- **Daycare:** many daycares move babies to two naps on a group schedule. Ask for a daily log and use an earlier bedtime after short naps.
- **Meals:** pick times that suit your family. Eating together helps your baby learn by watching.
## When to call your pediatrician
Call your pediatrician if your 7 month old:
- Has a fever lasting more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot
- Refuses several milk feeds in a row, or drinks much less milk than usual
- Gets a rash, vomiting or diarrhea after a new food (stop that food and call). Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Has diarrhea while teething, since the AAP says teething does not cause it
- Loses skills they once had, or is not doing the CDC's 6-month items, such as rolling from tummy to back, reaching for toys or making sounds with you
- Is not sitting on their own by 9 months
If something feels off, it is always fine to call. See [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do), and note from our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) that the next routine checkup is at 9 months.
## How MamaBee can help
MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, breastfeeds with left and right timers, bottles, pumping, solids and diapers. 7-day insights show whether two naps are working, and two caregivers stay in sync in real time. Sleep Coach nap prediction is part of MamaBee Premium.
## Frequently asked questions
### How many naps should a 7 month old take?
Most 7 month olds take 2 naps, and some still need 3, for about 2.5 to 3 hours of day sleep. Switching between 2-nap and 3-nap days during the transition is normal.
### How long should a 7 month old be awake between naps?
About 2.5 to 3.5 hours. The first wake window of the day is usually the shortest and the one before bed the longest.
### What time should a 7 month old go to bed?
Most 7 month olds go to bed between 6:30 and 8 PM. Use the earlier end on short-nap days or right after dropping the third nap.
### How much should a 7 month old eat?
Most take 4 to 5 milk feeds of 6 to 8 ounces, about 32 ounces or less a day, plus 2 small solid meals. Breastfed babies nurse on cue, and milk is still the main nutrition.
### How many meals a day should a 7 month old have?
Two small solid meals a day is typical at 7 months, and many babies move toward three. Let your baby's interest set the pace.
### Why is my 7 month old waking up at night again?
Common reasons include separation anxiety, practicing sitting in the crib, teething, an overtired day during the nap transition and hunger. Keep nights calm, and ask your pediatrician if you are unsure whether your baby needs a night feed.
## The takeaway
At 7 months, most babies move from 3 naps to 2, with wake windows of about 2.5 to 3.5 hours, 4 to 5 milk feeds and 2 small meals moving toward 3. Expect mixed days, use an early bedtime as your safety net, and make the crib safe for a baby who is learning to sit and crawl. Separation anxiety and new skills can bring more night waking, and that phase passes.
[[CTA||See your baby's nap transition clearly. Try MamaBee free on iPhone.]]
Sources: [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: Starting Solid Foods](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx), [AAP HealthyChildren: Introducing Common Food Allergens](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/when-to-introduce-egg-peanut-butter-and-other-common-food-allergens-to-your-baby-food-allergy-prevention-tips.aspx), [CDC: Introducing Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html), [CDC: Choking Hazards](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html), [CDC: Milestones by 6 Months](https://www.cdc.gov/act-early/milestones/6-months.html), [CDC: Milestones by 9 Months](https://www.cdc.gov/act-early/milestones/9-months.html), [AAP HealthyChildren: Emotional and Social Development, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx), [AAP HealthyChildren: Movement Milestones, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx), [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [KidsHealth: Cribs](https://kidshealth.org/en/parents/products-cribs.html), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
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
