// Week-15 MamaBee sleep regression series, part C (English): 12 month, 2 year and 3 month
// sleep regressions as DRAFTS only (never published by this script). Numbers follow the series
// canonical sheet (wake windows, naps, feeds) and every medical claim cites a source listed at the
// end of its article. Cover images are copied from a related published article.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week15-en-c.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week15-en-c.mjs
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
  '12-month-sleep-regression': ['baby-nap-transitions', '10-month-old-schedule', 'baby-separation-anxiety'],
  '2-year-sleep-regression': ['baby-separation-anxiety', 'baby-sleep-training-methods', 'baby-bedtime-routine'],
  '3-month-sleep-regression': ['4-month-sleep-regression', '3-month-old-schedule', 'how-to-swaddle-a-baby'],
}

const articles = [

  A('12-month-sleep-regression',
    '12 Month Sleep Regression: Signs, How Long & What Helps',
    'The 12 month sleep regression explained: signs, causes, how long it lasts, why it is rarely time for 1 nap, a 2-nap sample day and what helps at bedtime.',
    ['12 month sleep regression', '1 year sleep regression', '12 month old nap refusal', '12 month old waking at night', '1 year old sleep schedule'],
    {
      glance: {
        caption: '12 month sleep regression at a glance',
        headers: ['What', 'At 12 months'],
        rows: [
          ['When it happens', 'Around the first birthday, often between about 11 and 13 months. Not every baby has one (Sleep Foundation)'],
          ['Common signs', 'More night waking, crying at bedtime, refusing one nap (usually the second), standing in the crib, early waking'],
          ['Typical causes', 'Cruising and first steps, separation anxiety, teething, changes to milk and bottles, a push to 1 nap too early'],
          ['How long', 'Usually no longer than a few weeks (Sleep Foundation)'],
          ['What helps', 'Keep 2 naps, wake windows of about 3 to 4 hours, an earlier bedtime after a skipped nap, a short steady routine'],
          ['Naps', 'Most 12 month olds still need 2 naps; most move to 1 nap by about 18 months (KidsHealth)'],
          ['Sleep needed', '11 to 14 hours in 24 hours, naps included (AASM, 1 to 2 years)'],
        ],
      },
      causes: {
        caption: 'What often disrupts sleep around 12 months',
        headers: ['Cause', 'What you might notice', 'What helps'],
        rows: [
          ['Cruising and first steps', 'Standing or walking along the crib rail instead of sleeping', 'Lots of daytime practice, including bending the knees to sit back down'],
          ['Separation anxiety', 'Crying the moment you leave, waking and calling for you', 'The same short goodbye ritual and brief, calm check-ins'],
          ['Teething', 'Chewing, drooling, waking upset', 'A cold teether or cool washcloth; ask about pain relief'],
          ['Nap refusal', 'Skips or fights the second nap for a few days', 'Keep offering 2 naps; stretch wake windows by 15 minutes; earlier bedtime'],
          ['Milk and bottle changes', 'Fussing at the bedtime feed, waking for a bottle', 'Move milk earlier in the routine, then brush teeth; wean bottles gradually'],
          ['A busy, exciting day', 'Wired at bedtime after a party, travel or a new caregiver', 'A calm last hour and the same bedtime steps as usual'],
        ],
      },
      sample: {
        caption: 'Sample 12 month old sleep schedule: 7:00 AM wake, 2 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk', 'Breastfeed, or milk in a cup with breakfast'],
          ['7:45 AM', 'Breakfast', ''],
          ['10:30 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 3 hr 30 min'],
          ['11:45 AM', 'Wake up, lunch', 'Finger foods and sips of water from a cup'],
          ['3:00 PM', 'Nap 2 (about 1 hr)', 'Wake window: 3 hr 15 min. The nap most likely to be refused'],
          ['4:00 PM', 'Wake up, snack', 'Outdoor play if you can'],
          ['5:30 PM', 'Dinner', ''],
          ['7:00 PM', 'Bedtime routine', 'Milk first, then brush teeth, a book, a song'],
          ['7:45 PM', 'Asleep for the night', 'Wake window: 3 hr 45 min. Move bedtime earlier if nap 2 was skipped'],
        ],
      },
    },
`**The 12 month sleep regression is a common, temporary stretch of night waking, bedtime crying or nap refusal around the first birthday. It usually lines up with cruising, separation anxiety, teething and changes to milk and naps. The Sleep Foundation says symptoms usually last no longer than a few weeks. Keeping two naps helps most.**
If your baby was sleeping well and now fights the second nap, wakes at 2 AM or stands at the crib rail calling for you, you have not undone anything. This guide goes deep on the first birthday. For every age at a glance, see our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide.
## 12 month sleep regression at a glance
[[TABLE:glance]]
## Is the 12 month sleep regression real?
"Sleep regression" is a popular term, not a medical diagnosis, and research on exact ages is limited. The Sleep Foundation says not all 1 year olds have a sleep regression, and that some see their sleep improve or stay about the same at this age. It also notes that a single cause is hard to pin down.
What is real is that the first birthday is a busy time. Your baby is pulling up, cruising and maybe walking, understanding more words and noticing when you leave. Any of those can show up at bedtime. It is a temporary bump tied to development, not a sign that sleep is broken.
The biggest trap at this age is the nap. A few days of nap refusal can look like a baby who is ready for one nap. Most are not, and moving too early is one of the most common reasons sleep falls apart around 12 months.
## Signs of the 12 month sleep regression
- Waking more often at night, and being harder to settle afterward
- Crying, protesting or resisting sleep at bedtime
- Fighting or skipping one nap, usually the afternoon one
- Standing, cruising or babbling in the crib instead of sleeping
- Waking earlier in the morning
- Being extra clingy, especially at drop-off and bedtime
The Sleep Foundation also lists longer naps as a possible sign. A baby with a fever, ear pain or other signs of illness is not having a regression; see the pediatrician section below.
## Why sleep changes around 12 months
[[TABLE:causes]]
### Cruising and first steps
By 12 months, the CDC lists pulling up to stand and walking while holding on to furniture among the things most babies do. The AAP says many babies take their first steps around their first birthday, earlier or later is normal, and babies who are new to standing often do not know how to get back down. A skill this exciting gets practiced everywhere, including the crib at 3 AM.
### Separation anxiety
The AAP says separation anxiety usually peaks between 10 and 18 months, and that it can show up at bedtime: your baby may resist going to sleep without you or wake in the night looking for you. That is a sign of a healthy bond, not a habit you created. Our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide covers it in depth.
### Teething
The Sleep Foundation lists teething pain among the contributors at this age. According to the American Dental Association, the first molars usually arrive between about 13 and 19 months, so some babies start feeling them around the first birthday. Teething does not cause fever (AAP). See [baby teething symptoms](/mamabee/articles/baby-teething-symptoms).
### Milk and bottle changes
At 12 months the AAP advises switching from formula to whole milk, about 16 ounces (2 cups) a day for 12 to 24 month olds, and finishing the move from bottles to cups sometime between 12 and 18 months. The AAP suggests dropping bedtime and nap bottles gradually. A favorite bedtime bottle going away, or a cup that is less soothing, can bring a few unsettled nights.
### A push to one nap too early
Many babies fight the second nap for a few days around the first birthday. KidsHealth says young toddlers may still take two naps and most drop to one by 18 months. Nationwide Children's Hospital says that by 18 months most toddlers have given up the morning nap. So most 12 month olds still need two naps, and a baby moved to one nap too soon is often overtired by bedtime, which can mean more night waking and early mornings, not less. Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide explains the real signs of readiness.
## How long does the 12 month sleep regression last?
The Sleep Foundation says the symptoms of a 12-month sleep regression usually do not last longer than a few weeks. In practice, things often settle once walking feels ordinary, a tooth comes through or the nap schedule fits again.
Judge the trend over a week or two rather than the worst night. The Sleep Foundation advises talking to your pediatrician if sleep problems are serious or last more than a few weeks.
## What helps during the 12 month sleep regression
### Keep two naps
Keep offering both naps, even on days your baby fights one. Quiet time in a dark crib still rests them. If your baby has happily skipped one nap most days for two weeks or more, is not overtired by bedtime and is getting close to 15 months or beyond, it may be time; talk it over with your pediatrician and read our nap transitions guide first.
### Adjust wake windows before dropping a nap
Most 12 month olds do well with wake windows of about 3 to 4 hours, shortest in the morning and longest before bed. If the second nap is refused, try stretching each wake window by about 15 minutes for a few days, staying in that range. The [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) and [wake window calculator](/mamabee/tools/wake-window-calculator) can help you plan the day.
### Use an earlier bedtime on one-nap days
When a nap is skipped, move bedtime earlier, as early as 6:30 PM, so your baby is not running on a 5 or 6 hour wake window. One early night usually fixes one rough day.
### Practice new skills during the day
Give plenty of time to cruise, climb and practice standing. The AAP suggests showing your baby how to bend their knees to lower themselves. At night, lay your baby back down once, calmly and with few words, then give them a chance to settle.
### Keep the bedtime routine short and the same
The Sleep Foundation recommends a consistent pre-bedtime routine and steady nap and bedtime times. The AAP's Brush, Book, Bed routine fits this age well: offer milk first, then brush teeth, read a book and go to bed at the same time each night. Our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide has step-by-step versions.
### Make goodbyes predictable
The Sleep Foundation suggests the same goodbye ritual each night and short practice separations during the day. The AAP advises keeping goodbyes short and sweet and always coming back when you said you would. At bedtime, a brief check-in can reassure a baby who wakes looking for you.
### Comfort sore gums
A cold teether, a cool wet washcloth or gentle gum massage can help (Sleep Foundation). If your baby seems very uncomfortable, ask your pediatrician about pain relief. The AAP advises avoiding benzocaine and lidocaine products, homeopathic teething gels and teething necklaces.
### Get the day right
The Sleep Foundation suggests plenty of activity during the day, especially in natural light, and limiting noise, light and stimulation at bedtime. Outdoor time in the morning is a simple win.
### Keep the crib safe for a walker
- **Mattress at its lowest setting** before your baby can stand (AAP)
- **No bumper pads,** which toddlers can use to climb out (AAP)
- **After 12 months,** KidsHealth says a light blanket and a small lovey are OK in the crib; skip large soft toys
- **Keep the crib away from windows** (AAP) and anything with cords your baby could reach when standing
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) covers the full list.
## What to avoid (and what not to worry about)
- **Do not drop to one nap after a few bad days.** It is the most common way a short regression turns into a long one.
- **Do not bring back a bedtime bottle in the crib** to get through the week. The AAP warns that teeth constantly bathed in milk can lead to tooth decay, and suggests phasing out bedtime bottles gradually.
- **Do not move to a big bed.** Nationwide Children's says most toddlers switch between 2 and 3 years and that switching too early can disrupt sleep.
- **Do not overhaul everything at once.** Change one thing at a time and give it several days.
Things you can stop worrying about: a baby who stands in the crib and then lies down on their own, a week of messy naps, and protests at goodbye, which show a strong attachment.
## Sample 12 month old sleep schedule
This sample uses a 7:00 AM wake-up, two naps and wake windows of about 3 hours 15 minutes to 3 hours 45 minutes, within the 3 to 4 hour range for 10 to 12 month olds.
[[TABLE:sample]]
That adds up to about 2 hours 15 minutes of day sleep and about 11 hours 15 minutes at night, or about 13.5 hours in total, within the AASM's 11 to 14 hours for 1 to 2 year olds. For an early-riser version and the full feeding day, see our [12 month old schedule](/mamabee/articles/12-month-old-schedule). If your baby is a little younger, the [11 month old schedule](/mamabee/articles/11-month-old-schedule) shows the same two-nap rhythm, and our [baby sleep schedule by age](/mamabee/articles/baby-sleep-schedule-by-age) chart covers the whole first year.
## Sleep training during the 12 month regression
There is no single right answer. Some families wait for a regression to pass before changing anything, because a calm week makes it easier to see what works. Others find that a clear, consistent approach helps a baby who is waking for company. Consistency matters more than the method. Our [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) guide compares the options neutrally, and the 12-month checkup is a good time to ask your pediatrician.
## When to call your pediatrician
Call your pediatrician if your 12 month old:
- Has a fever that lasts more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down. Call right away if your baby looks very ill, is unusually drowsy or is very fussy.
- Has signs of an ear infection: ear pain that is often worse at night, fever, not responding to sounds as usual, or fluid draining from the ear. The AAP notes that ear tugging alone is not a reliable sign; tugging with fever or unusual fussiness is worth a call.
- Has fewer wet diapers than usual, a dry mouth or fewer tears, which can be signs of dehydration
- Has breathing that seems unusual during sleep, which the Sleep Foundation lists as a reason to check in
- Loses skills they once had, or is not doing the CDC's 1-year items, such as pulling up to stand, waving bye-bye, calling a parent "mama" or "dada" or looking for a toy they saw you hide
- Has sleep problems that are serious or last more than a few weeks
The 12-month visit is part of the AAP's Bright Futures schedule; see our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule), [baby milestones by month](/mamabee/articles/baby-milestones-by-month) and [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do).
## Frequently asked questions
### How long does the 12 month sleep regression last?
The Sleep Foundation says symptoms usually do not last longer than a few weeks. If sleep problems are serious or go on longer, talk to your pediatrician.
### Is my 12 month old ready for one nap?
Probably not yet. Most babies keep two naps past their first birthday and move to one nap by about 18 months (KidsHealth), so a few days of nap refusal is usually a phase.
### Why is my 1 year old suddenly waking up at night?
Common reasons are practicing standing and walking, separation anxiety, teething, a skipped nap that leaves them overtired and changes to milk or bottles. Illness, such as an ear infection, can look similar, so watch for fever.
### What time should a 12 month old go to bed?
Most 12 month olds go to bed between 6:30 and 8 PM, about 3.5 to 4 hours after the last nap ends. Go earlier after a skipped or short nap.
### Can switching to whole milk affect sleep?
It can bring a few unsettled nights if a favorite bedtime bottle goes away. Offer milk early in the bedtime routine, brush teeth afterward and phase out bottles gradually between 12 and 18 months (AAP).
### Is it the 12 month sleep regression or teething?
It can be both. Drooling, chewing and sore gums point to teething, but teething does not cause fever, so call your pediatrician if your baby has one.
## The takeaway
The 12 month sleep regression is a busy baby working through big changes: standing, first steps, separation anxiety, new teeth and new milk routines. It usually passes within a few weeks. Keep two naps, use wake windows of about 3 to 4 hours, move bedtime earlier on rough days, keep the routine short and the crib safe, and call your pediatrician if something seems off. If sleep wobbles again later, our [18 month sleep regression](/mamabee/articles/18-month-sleep-regression) and [2 year sleep regression](/mamabee/articles/2-year-sleep-regression) guides cover what comes next.
## How MamaBee helps
The hardest part of a regression is not knowing whether it is getting better. At 2 AM, every night feels like the worst one. That is exactly where a simple log earns its place, and MamaBee makes it the easiest thing you do all day.
[[CTA||Stop guessing: see whether naps and nights are improving]]
- **One-thumb logging, free and with no ads:** sleep, naps, night wakings, milk, solids, diapers and more, on one clear timeline
- **7-day insights** that show how naps and nights are trending, so you can tell a two-week phase from a schedule that needs changing
- **Free real-time sync for two caregivers,** so whoever does bedtime knows how the afternoon nap went
- **A pediatrician PDF export** to bring to the 12-month checkup instead of trying to remember
- **MamaBee Premium** adds Sleep Coach nap prediction, so you can time naps without watching the clock, and unlimited Bee AI, an assistant that knows your log and can help you think through a rough night
MamaBee is built for iPhone by a small team at Realm Labs. Your logs stay on your phone unless you turn on Co-Parent Sharing, and your data is never sold.
[[CTA||Get through the 12 month regression with MamaBee, free on iPhone]]
Sources: [Sleep Foundation: 12-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/12-month-sleep-regression), [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [KidsHealth: Naps](https://kidshealth.org/en/parents/naps.html), [KidsHealth: Toddler Sleep, 1 to 2 Year Olds](https://kidshealth.org/en/parents/sleep12yr.html), [Nationwide Children's Hospital: Sleep in Toddlers](https://www.nationwidechildrens.org/sleep-in-toddlers), [CDC: Milestones by 1 Year](https://www.cdc.gov/act-early/milestones/1-year.html), [AAP HealthyChildren: Movement Milestones, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx), [AAP HealthyChildren: Emotional and Social Development, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx), [AAP HealthyChildren: Soothing Separation Anxiety](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Soothing-Your-Childs-Separation-Anxiety.aspx), [AAP HealthyChildren: Recommended Drinks for Young Children](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Recommended-Drinks-for-Young-Children-Ages-0-5.aspx), [AAP HealthyChildren: Discontinuing the Bottle](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Discontinuing-the-Bottle.aspx), [ADA MouthHealthy: Primary Tooth Development Chart](https://www.mouthhealthy.org/-/media/project/ada-organization/ada/mouthhealthy/files/activity-sheets/adaprimarytoothdev_eng.pdf), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Brush, Book, Bed](https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Brush-Book-Bed.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('2-year-sleep-regression',
    '2 Year Sleep Regression: Signs, How Long & What Helps',
    'The 2 year sleep regression explained: bedtime stalling, new fears, a new sibling, potty training and big-kid beds, how long it lasts and what helps.',
    ['2 year sleep regression', '2 year old sleep regression', 'toddler sleep regression', '2 year old waking at night', '2 year old fighting bedtime'],
    {
      glance: {
        caption: '2 year sleep regression at a glance',
        headers: ['What', 'At 2 years'],
        rows: [
          ['When it happens', 'Around the second birthday; timing varies from child to child'],
          ['Common signs', 'Bedtime stalling, calling out or leaving the room, new night waking, early waking, fighting the nap'],
          ['Typical causes', 'Big transitions (a new sibling, a big-kid bed, potty training, a move or daycare), new fears, independence, second molars'],
          ['How long', 'Almost always resolves within a few weeks (UCLA Health)'],
          ['What helps', 'A short steady routine, clear kind limits, small choices, a night light for fears, one big change at a time'],
          ['Naps', 'Most 2 year olds still need 1 afternoon nap; many give it up between 3 and 5 (KidsHealth)'],
          ['Sleep needed', '11 to 14 hours in 24 hours, nap included (AASM and CDC)'],
        ],
      },
      causes: {
        caption: 'Big transitions that often disrupt sleep at 2',
        headers: ['Transition', 'What you might see', 'What helps'],
        rows: [
          ['A new sibling', 'Clinginess, waking at night, wanting a bottle or to be carried again', 'Extra one-on-one time; finish or postpone other big changes (AAP)'],
          ['Crib to big-kid bed', 'Getting out of bed again and again, early waking', 'Keep the crib until about 2 to 3 years unless safety requires a move'],
          ['Potty training', 'Waking to pee, worry about accidents, bedtime stalling with "I need to go"', 'One last potty trip in the routine; fewer drinks right before bed'],
          ['New fears and imagination', 'Scared of the dark or "monsters," bad dreams', 'A dim night light, a lovey, calm reassurance, no scary screens'],
          ['Independence', '"No," one more book, testing every limit', 'Clear limits set in advance and two simple choices'],
          ['Second molars', 'Chewing, drooling, waking upset', 'A cold teether or cool washcloth; ask about pain relief'],
        ],
      },
      sample: {
        caption: 'Sample 2 year old sleep schedule: 7:00 AM wake, 1 nap',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up', 'Open the curtains; daylight helps set the body clock'],
          ['7:30 AM', 'Breakfast', ''],
          ['9:30 AM', 'Snack and active play', 'Outdoors if you can'],
          ['11:45 AM', 'Lunch', ''],
          ['12:30 PM', 'Nap (about 2 hours)', 'Awake 5 hr 30 min. Same time every day'],
          ['2:30 PM', 'Wake up, snack', 'Wake your child by about 3 PM if the nap runs long'],
          ['5:30 PM', 'Dinner', 'Smaller drinks after dinner if potty training'],
          ['6:45 PM', 'Bedtime routine', 'Potty or diaper, pajamas, brush teeth, two books, one song'],
          ['7:45 PM', 'Asleep for the night', 'Awake 5 hr 15 min. About 11 hr 15 min of night sleep'],
        ],
      },
    },
`**The 2 year sleep regression is a common, temporary stretch of bedtime battles, night waking or early rising around the second birthday. It often follows a big change: a new sibling, a big-kid bed, potty training or new fears. UCLA Health says it almost always resolves within a few weeks. Steady routines and one change at a time help.**
Your toddler who used to go down easily now calls you back five times, climbs out of bed or wakes at 3 AM scared of the dark. It is exhausting, and very typical for this age. This guide goes deep on the second birthday; for every age at a glance, see our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide.
## 2 year sleep regression at a glance
[[TABLE:glance]]
## Is the 2 year sleep regression real?
"Sleep regression" is a popular term, not a medical diagnosis, and research on exact ages is limited. UCLA Health describes sleep regression as especially common in toddlers, which is why it is sometimes called the 2-year-old sleep regression, and links it to physical changes, new circumstances and other developments.
What sets age 2 apart is how many big changes land around it: a new baby, potty training, a big-kid bed, a move or daycare, often in the same few months. Each can unsettle sleep on its own. It is a temporary bump, not a sign that your child has forgotten how to sleep.
## Signs of the 2 year sleep regression
- Stalling at bedtime: one more book, one more drink, one more potty trip
- Calling out, crying or coming out of the room after lights out
- Waking at night, sometimes scared or after a bad dream
- Waking earlier in the morning
- Fighting the nap, or lying awake for most of it
- Wanting a bottle, a pacifier or to be carried again, especially after a new baby arrives
A toddler with a fever, pain or other signs of illness is not having a regression; see the pediatrician section below.
## Why sleep changes at 2: the big transitions
[[TABLE:causes]]
### A new sibling
The AAP says to expect an older child of 2 to 4 to regress a little when a new baby arrives. A toilet-trained child might have accidents, or a child might want a bottle again. That is their way of making sure they still have your love and attention. Instead of telling them to act their age, the AAP suggests giving them the attention they need.
The AAP also suggests timing other changes around the baby: if you can, finish toilet training or the switch from crib to bed before the baby arrives. If not, put it off until the baby is settled at home, so your toddler is not learning new things on top of everything else.
### Moving to a big-kid bed
A crib to bed switch is a common trigger. Nationwide Children's Hospital says most toddlers switch from a crib to a bed between 2 and 3 years and that switching too early can disrupt sleep.
The AAP says it is time to move when your child is 35 inches (89 cm) tall or when the crib rail is lower than about three-quarters of their height. If your child climbs out even with the mattress at its lowest setting, KidsHealth suggests a toddler bed or big-kid bed with a side rail. Read [baby-proofing your home](/mamabee/articles/baby-proofing-your-home) first, since a child who can leave the bed can reach the whole room.
### Potty training
The AAP says children show signs of bladder and bowel control between 18 and 24 months, and the average age toilet training begins in the US is between 2 and 3 years. New sensations, worry about accidents and "I need to go" as a bedtime stall can all disturb sleep. UCLA Health suggests limiting drinks before bed during potty training. The AAP suggests delaying toilet training if you are expecting or have just had a baby, or have just moved.
### New fears and imagination
KidsHealth says some nightmares happen when a child is stressed or dealing with a change, and that scary books, shows or movies before bed can lead to them. It suggests staying close, telling your child it was a bad dream and they are safe now, and offering a night light or comfort object.
### Independence and testing limits
The AAP says 2 year olds spend much of their time testing limits, theirs, yours and their environment's, and that their moods swing up and down as part of growing up. Bedtime is when you ask them to stop, so it is a natural place to push back.
### Separation anxiety
The AAP says separation challenges often begin at 15 or 18 months and that most children understand their effect on parents by age 3. A 2 year old may still cry at goodbyes and call for you at night. Our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide covers what helps.
### Second molars
According to the American Dental Association, second molars usually come in between about 23 and 33 months, which makes many 2 year olds' gums sore. Teething does not cause fever (AAP). See [baby teething symptoms](/mamabee/articles/baby-teething-symptoms).
## How long does the 2 year sleep regression last?
UCLA Health says toddler sleep regression is typically short-lived and almost always resolves within a few weeks. Sleep often settles once the new bed, new sibling or new potty routine feels normal.
If sleep problems go on for more than a few weeks or keep getting worse, talk to your pediatrician.
## What helps during the 2 year sleep regression
### One big change at a time
If you can choose the timing, space out the new bed, potty training and other changes. Follow the AAP's advice to finish them before a new baby arrives or wait until the baby is settled. Keeping the rest of life predictable gives your toddler something steady to hold on to.
### Keep the bedtime routine short and predictable
The CDC suggests steady routines for sleeping and a calm, quiet bedtime with steps like pajamas, brushing teeth and reading one or two books. KidsHealth advises sticking with a routine that works and not letting it get too long. The AAP's Brush, Book, Bed is an easy model. Our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide has a step-by-step version.
### Build the stalls into the routine
Put the last potty trip, the last drink and the last hug inside the routine, before lights out. Then the answer to "one more" is warm and simple: "We already did that. Goodnight." Nationwide Children's suggests setting clear limits, such as how many books you will read.
### Offer two simple choices
Small choices meet a 2 year old's need for control: which pajamas, which of two books, which stuffed animal comes to bed. The AAP suggests consistently setting reasonable limits that still let a child explore, and choices are an easy way to do that.
### Help with new fears
Take the fear seriously without making it bigger. A dim night light, a lovey and a short, calm check can help. KidsHealth suggests keeping middle-of-the-night talk brief and saving the bigger conversation, or drawing the dream, for the morning. Skip scary stories before bed, and keep screens out of the last hour; KidsHealth says screen time can disrupt a child's sleep, and the CDC suggests no more than 1 hour a day of children's programs at age 2.
### Keep night visits brief and boring
When your toddler calls out or comes to your room, walk them back to bed calmly with few words. KidsHealth warns that too much interaction at night can backfire. Being boring and consistent is what makes it stop.
### Protect the nap, but watch the timing
Keep one nap at about the same time each day, usually after lunch. Nationwide Children's says napping too late in the afternoon can make it hard to fall asleep at bedtime, so if your child lies awake at night, wake them a little earlier from the nap rather than dropping it. KidsHealth says many children give up the nap between 3 and 5 years. UCLA Health notes that shortening a nap can help some toddlers, while watching for signs of overtiredness.
### Comfort sore gums
A cold teether, a cool washcloth or gentle gum massage can help. Ask your pediatrician about pain relief if your child seems very uncomfortable. The AAP advises avoiding benzocaine and lidocaine products, homeopathic teething gels and teething necklaces.
## What to avoid (and what not to worry about)
- **Do not switch to a big bed to fix the regression.** Most toddlers move between 2 and 3 years; earlier moves can disrupt sleep (Nationwide Children's).
- **Do not drop the nap** because your toddler fights it for a week. Most 2 year olds still need it.
- **Do not start potty training in the middle of a big change,** such as a new baby or a move (AAP).
- **Do not scold a toddler for regressing.** The AAP suggests giving them the attention they need instead of telling them to act their age.
Things you can stop worrying about: a toddler who wants a bottle or to be carried after a new baby arrives, a few bad dreams, and a lovey that comes everywhere.
## Sample 2 year old sleep schedule
This sample uses a 7:00 AM wake-up and one afternoon nap of about 2 hours. Times vary from toddler to toddler, so use it as a starting point.
[[TABLE:sample]]
That adds up to about 2 hours of day sleep and about 11 hours 15 minutes at night, or about 13 hours 15 minutes in total, within the 11 to 14 hours the AASM recommends for 1 to 2 year olds and the CDC lists at age 2. On a no-nap day, move bedtime earlier, toward 7 PM.
For moving from two naps to one and, later, giving up the nap, see [baby nap transitions](/mamabee/articles/baby-nap-transitions). If the trouble started earlier, our [18 month sleep regression](/mamabee/articles/18-month-sleep-regression) guide covers the first toddler bump, and our [12 month sleep regression](/mamabee/articles/12-month-sleep-regression) guide covers the first birthday.
## Sleep training during the 2 year regression
There is no single right answer. Some families wait for a big change to settle; others find a clear, consistent plan is what a limit-testing 2 year old needs. Consistency matters more than the method. Our [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) guide compares approaches neutrally.
## When to call your pediatrician
Call your pediatrician if your 2 year old:
- Has a fever that lasts more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down. Call right away if your child looks very ill or is unusually drowsy.
- Has signs of an ear infection: ear pain that is often worse at night, fever, not responding when you speak as usual, or fluid draining from the ear
- Has fewer wet diapers or trips to the potty than usual, a dry mouth or fewer tears, which can be signs of dehydration
- Has nightmares more than once a week, or bad dreams that often get in the way of sleep, which KidsHealth lists as a reason to talk to the doctor
- Has significant nighttime fears or unusual night waking that worry you (Nationwide Children's)
- Loses skills they once had, or is not doing the CDC's 2-year items, such as saying at least two words together, pointing to things in a book when you ask, kicking a ball or running
The CDC's advice is simple: you know your child best, so do not wait. The 24-month checkup includes developmental and autism screening under the AAP's Bright Futures schedule; see our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule). For fevers, see [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do).
## Frequently asked questions
### How long does the 2 year sleep regression last?
UCLA Health says toddler sleep regression almost always resolves within a few weeks. If sleep problems last longer or keep getting worse, talk to your pediatrician.
### Why is my 2 year old suddenly fighting bedtime?
Common reasons are a big change such as a new sibling, a big-kid bed or potty training, new fears of the dark, testing limits and a nap that runs too late. A short, steady routine with clear limits helps most.
### Should my 2 year old still nap?
Yes, most 2 year olds still need one afternoon nap; Nationwide Children's describes toddler naps of about 1.5 to 3 hours. KidsHealth says many children give up the nap between 3 and 5 years.
### Should I move my 2 year old to a toddler bed during a regression?
Usually not. Most toddlers switch between 2 and 3 years, and moving too early can disrupt sleep; move sooner only for safety, such as at 35 inches tall or if your child keeps climbing out (AAP).
### Can potty training cause a sleep regression?
It can unsettle sleep for a while. Add a last potty trip to the bedtime routine, limit drinks right before bed, and avoid starting during another big change.
### What helps a 2 year old who is scared of the dark?
A dim night light, a comfort object and calm, brief reassurance help, and KidsHealth suggests skipping scary shows and stories before bed. Talk about the fear in the daytime rather than at 2 AM.
## The takeaway
The 2 year sleep regression usually comes from big changes landing at once: a new sibling, a new bed, potty training, new fears and a toddler who loves testing limits. It almost always passes within a few weeks. Keep the routine short and steady, build the stalls into it, offer small choices, make one change at a time, keep the nap and call your pediatrician if something seems off.
## How MamaBee helps
When every bedtime feels like a negotiation, it helps to see the bigger picture. Did the bad nights start with the new bed, or when the nap moved later? MamaBee answers that without you having to remember anything.
[[CTA||See what is really behind the bedtime battles]]
- **One-thumb logging, free and with no ads:** naps, bedtimes, night wakings, solids, diapers, medicine, symptoms and custom logs, all on one timeline
- **7-day insights** that show how naps and nights are trending, so you can see the regression lifting before you feel it
- **Free real-time sync for two caregivers,** so the parent at bedtime knows exactly how the nap went, which matters even more with a new baby in the house
- **Track more than one child:** MamaBee Premium adds multi-baby sync, plus Sleep Coach nap prediction and unlimited Bee AI, an assistant that knows your log and can help you think through a rough week
- **A pediatrician PDF export** for the 2-year checkup
MamaBee is built for iPhone by a small team at Realm Labs. Your logs stay on your phone unless you turn on Co-Parent Sharing, and your data is never sold.
[[CTA||Make the 2 year regression easier to track with MamaBee, free on iPhone]]
Sources: [UCLA Health: How to Handle Your Child's Sleep Regression](https://www.uclahealth.org/news/article/how-handle-your-childs-sleep-regression), [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [CDC: Milestones by 2 Years](https://www.cdc.gov/act-early/milestones/2-years.html), [Nationwide Children's Hospital: Sleep in Toddlers](https://www.nationwidechildrens.org/sleep-in-toddlers), [KidsHealth: Naps](https://kidshealth.org/en/parents/naps.html), [KidsHealth: Toddler Sleep, 1 to 2 Year Olds](https://kidshealth.org/en/parents/sleep12yr.html), [KidsHealth: Nightmares](https://kidshealth.org/en/parents/nightmare.html), [AAP HealthyChildren: Preparing Your Family for a New Baby](https://www.healthychildren.org/English/ages-stages/prenatal/Pages/Preparing-Your-Family-for-a-New-Baby.aspx), [AAP HealthyChildren: The Right Age to Toilet Train](https://www.healthychildren.org/English/ages-stages/toddler/toilet-training/Pages/The-Right-Age-to-Toilet-Train.aspx), [AAP HealthyChildren: Emotional Development, 2 Year Olds](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Emotional-Development-2-Year-Olds.aspx), [AAP HealthyChildren: Soothing Separation Anxiety](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Soothing-Your-Childs-Separation-Anxiety.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [ADA MouthHealthy: Primary Tooth Development Chart](https://www.mouthhealthy.org/-/media/project/ada-organization/ada/mouthhealthy/files/activity-sheets/adaprimarytoothdev_eng.pdf), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Brush, Book, Bed](https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Brush-Book-Bed.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
This article is general information, not medical advice. Always check with your pediatrician about your child.`),

  A('3-month-sleep-regression',
    '3 Month Sleep Regression: Signs, How Long & What Helps',
    'Is the 3 month sleep regression real? Why sleep changes at 3 months, how it links to the 4 month regression, how long it lasts and gentle steps that help.',
    ['3 month sleep regression', '3 month old sleep regression', '3 month old short naps', '3 month old waking at night', '4 month sleep regression early'],
    {
      glance: {
        caption: '3 month sleep regression at a glance',
        headers: ['What', 'At 3 months'],
        rows: [
          ['Is it a separate regression?', 'Usually not. It is most often an early start to the 4 month sleep change, which can begin around 3 months'],
          ['When it happens', 'Sleep starts to consolidate by around 3 to 4 months; some babies have trouble a little earlier or later (Sleep Foundation)'],
          ['Common signs', 'More night waking, short 30 to 45 minute naps, harder to settle, fussing at bedtime'],
          ['Typical causes', 'Maturing sleep cycles, more awareness of the world, the swaddle transition, distracted feeding, wake windows getting longer'],
          ['How long', 'Usually a few days to a few weeks (Sleep Foundation)'],
          ['What helps', 'Wake windows of 75 to 105 minutes, a short steady routine, some practice falling asleep drowsy, calm night feeds'],
          ['Sleep needed', 'About 14 to 17 hours in 24 hours (National Sleep Foundation, up to 3 months)'],
        ],
      },
      causes: {
        caption: 'What often disrupts sleep around 3 months',
        headers: ['Cause', 'What you might notice', 'What helps'],
        rows: [
          ['Maturing sleep cycles', 'Waking fully between cycles, naps that end at 30 to 45 minutes', 'A short pause before going in; some chances to fall asleep drowsy'],
          ['More awareness', 'Distracted by every sound, harder to wind down', 'A dim, quiet room for the last feed and for naps'],
          ['The swaddle transition', 'Startling awake, or unsettled first nights in a sleep sack', 'Stop swaddling at the first signs of rolling; arms-free sleep sack'],
          ['Distracted feeding', 'Short daytime feeds, then hungry at night', 'Some daytime feeds in a quiet room'],
          ['Longer wake windows', 'Fighting naps, or overtired and wired by evening', 'Wake windows of about 75 to 105 minutes; earlier bedtime after short naps'],
          ['A hungrier few days', 'Feeding more often, day and night', 'Feed on cue; it usually settles within days'],
        ],
      },
      sample: {
        caption: 'Sample 3 month old sleep schedule for a rough week: 7:00 AM wake, short naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, feed', 'Open the curtains, even after a rough night'],
          ['8:15 AM', 'Nap 1 (about 40 min)', 'Wake window: 1 hr 15 min'],
          ['8:55 AM', 'Wake up, play', 'Tummy time, faces, talking'],
          ['10:00 AM', 'Feed', 'A quiet room helps a distractible feeder'],
          ['10:25 AM', 'Nap 2 (about 1 hr 15 min)', 'Wake window: 1 hr 30 min. A contact or stroller nap is fine'],
          ['11:40 AM', 'Wake up, play', ''],
          ['1:10 PM', 'Nap 3 (about 40 min)', 'Wake window: 1 hr 30 min'],
          ['1:50 PM', 'Wake up, feed', ''],
          ['3:35 PM', 'Nap 4 (about 40 min)', 'Wake window: 1 hr 45 min'],
          ['4:15 PM', 'Wake up, feed', ''],
          ['5:30 PM', 'Nap 5: catnap (about 20 min)', 'Wake window: 1 hr 15 min. Carrier or stroller'],
          ['5:50 PM', 'Wake up, calm play', 'Keep the last stretch low-key'],
          ['6:50 PM', 'Bedtime routine and feed', 'Diaper, sleep sack, feed, a song'],
          ['7:20 PM', 'Asleep for the night', 'Wake window: 1 hr 30 min. Often 1 to 2 night feeds'],
        ],
      },
    },
`**Most experts do not describe a separate 3 month sleep regression. Sleep that falls apart at 3 months is usually an early start to the 4 month sleep change as sleep cycles mature, plus short naps and the swaddle transition. The Sleep Foundation says it usually lasts a few days to a few weeks. Steady wake windows help.**
If your baby had started giving you longer stretches and is suddenly waking every couple of hours, you have not done anything wrong. This guide explains what is happening at 3 months and what helps right now. Because the cause is usually the same, read it alongside our full [4 month sleep regression](/mamabee/articles/4-month-sleep-regression) guide. For every age at a glance, see [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age).
## 3 month sleep regression at a glance
[[TABLE:glance]]
## Is the 3 month sleep regression real?
"Sleep regression" is a popular term, not a medical diagnosis, and research on exact ages is limited. The 3 month mark is not usually listed as a regression of its own. Many sources, including ours, describe the big change as the 4 month sleep regression, but say it can start earlier.
The Sleep Foundation says a baby's sleep starts to change by around 3 to 4 months as it begins to consolidate, and that some babies have trouble a few months earlier or later than the classic age. The AAP notes that babies do not have regular sleep cycles until about 4 months. So for many babies, the 4 month sleep change simply shows up at 3 months.
We will be candid: if your 3 month old's sleep has changed, the most useful thing you can read is our [4 month sleep regression](/mamabee/articles/4-month-sleep-regression) guide, because the cause and the fixes are the same. This page covers what is different about 3 months: younger wake windows, the swaddle, night feeds and a baby who is only just becoming aware of the world.
## Signs of a 3 month sleep regression
- Waking more often at night after a few weeks of longer stretches
- Naps that end at 30 to 45 minutes, even when your baby still seems tired
- Taking longer to fall asleep, or fussing at bedtime
- Crying or being irritable on waking
- Sleeping less overall, at night and during the day
- Feeding more often, or snacking because feeds keep getting interrupted
The Sleep Foundation lists trouble falling asleep, more night waking, irritability on waking and less total sleep as signs of the 4 month change. These overlap with hunger, a growth spurt and illness, so look at the whole picture. A fever in a baby this young is never a regression; see the pediatrician section below.
## Why sleep changes around 3 months
[[TABLE:causes]]
### Sleep cycles are maturing
Newborns drop quickly into deep sleep. As the brain develops, sleep starts to look more like ours, with lighter and deeper stages and a brief waking at the end of each cycle. The Sleep Foundation says this neurological development changes how a baby cycles through sleep. A baby who used to sleep through those transitions now wakes fully and wants help getting back to sleep. A 30 to 45 minute nap is often one cycle.
### More awareness of the world
At 3 months your baby is far more social and alert. By 4 months the CDC lists smiling to get your attention, cooing and turning toward your voice. The Sleep Foundation notes that greater awareness of surroundings can lead to overstimulation. A busy room, a bright screen or a sibling nearby can make winding down much harder.
### The swaddle transition
The AAP says some babies start working on rolling as early as 2 months, and to stop swaddling as soon as your baby shows any signs of trying to roll. KidsHealth says this is typically at 3 to 4 months. Losing the swaddle often means a few unsettled nights while your baby gets used to having free arms. Our guide on [how to swaddle a baby](/mamabee/articles/how-to-swaddle-a-baby) explains the switch.
### Distracted feeding and night hunger
Many 3 month olds pop off the breast or bottle at every sound. Short daytime feeds can mean more waking at night to make up for it. A hungrier few days from a growth spurt can add to it; see [baby growth spurts](/mamabee/articles/baby-growth-spurts).
### Wake windows are getting longer
At 3 months most babies do well with wake windows of about 75 to 105 minutes. A rhythm that worked at 2 months may now leave your baby not quite tired enough, while stretching too far leaves them overtired and wired. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains the cues.
### The end of the newborn crying peak
On the bright side, the AAP says crying usually peaks at about 3 hours a day by 6 weeks and falls to 1 to 2 hours a day by 3 to 4 months. If evenings are getting calmer while nights get choppier, that is a common pattern at this age.
## How long does the 3 month sleep regression last?
The Sleep Foundation says sleep problems around the 4 month change usually last a few days to a few weeks, depending partly on good sleep habits. Because the change in sleep cycles is lasting, the goal is not to wait for the old sleep to return but to help your baby learn to link cycles.
Judge the trend over a week or two rather than the worst night. If things are not improving after a few weeks, or your baby seems unwell, talk to your pediatrician.
## What helps during the 3 month sleep regression
### Get the wake windows right
Aim for about 75 to 105 minutes between sleeps, shorter in the morning and after short naps. Watch for cues like staring off, red eyes, yawning and fussing. After a day of short naps, move bedtime earlier, as early as 6:30 PM. The [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) and [wake window calculator](/mamabee/tools/wake-window-calculator) can help you plan the day.
### Practice drowsy but awake, without pressure
KidsHealth suggests putting your baby into the crib or bassinet drowsy but still awake. The AAP recommends this from 4 months, so at 3 months it is gentle practice, not a test. Try it once a day, often at bedtime, and help your baby to sleep the rest of the time if you need to.
### Pause before you go in
Babies stir, grunt and even cry briefly between cycles. A short pause gives your baby a chance to resettle. If the crying builds, go in and help. Over time, many babies start linking cycles on their own.
### Keep a short, steady bedtime routine
A diaper, sleep sack, feed, a song and into the crib, in the same order every night, tells your baby that sleep is coming. It does not need to be long. Our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide has versions for young babies.
### Make the room boring
Keep naps and nights dark and calm. The AAP suggests keeping night feeds and changes quiet, without stimulating your baby, and speaking softly if you speak at all.
### Feed in a quiet room
Offer some daytime feeds, and the feed before bed, in a dim room with fewer distractions. Fuller days can mean fewer hungry wakings at night. Night feeds are still normal at 3 months.
### Rescue short naps
Protect one longer nap if your baby takes one, and accept the others as catnaps for now. A contact nap, carrier or stroller nap is fine when a nap would otherwise be lost; see [contact naps and independent sleep](/mamabee/articles/contact-naps-and-independent-sleep).
### Keep every sleep safe
- **Back to sleep, every sleep,** on a firm, flat, separate surface with only a fitted sheet (AAP)
- **Nothing soft in the crib:** no pillows, blankets, bumpers or toys before 12 months
- **Room-share without bed-sharing,** ideally for the first 6 months (AAP)
- **Stop swaddling at the first signs of rolling,** and use an arms-free sleep sack
- **No weighted swaddles or blankets,** which the AAP says can press on a baby's chest and lungs
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) covers the full list.
## What to avoid (and what not to worry about)
- **Do not rush to a new schedule after one bad night.** Give any change several days before judging it.
- **Do not bring your baby into an adult bed** to get through a rough night. Room-share without bed-sharing (AAP).
- **Do not add extras to the crib** to help your baby settle: no pillows, positioners, bumpers or loose blankets (AAP).
- **Do not judge your baby by "sleeping through."** KidsHealth notes that for young babies, sleeping through the night means a stretch of only 5 or 6 hours.
Things you can stop worrying about: rocking or feeding your baby to sleep on hard nights, naps that are short for now, and 1 to 2 night feeds, which are common at this age.
## Sample 3 month old sleep schedule
This sample is built for a rough week, with short naps, wake windows of 75 to 105 minutes and an earlier bedtime. On a calmer week your baby may take 4 longer naps instead.
[[TABLE:sample]]
That adds up to about 3 hours 35 minutes of day sleep, a little under the usual 4 to 5 hours, which is why bedtime moves earlier. Bedtime to wake-up is 11 hours 40 minutes, with 1 to 2 night feeds. For the standard 4-nap day and full feeding details, see our [3 month old schedule](/mamabee/articles/3-month-old-schedule). For the month before and after, see the [2 month old schedule](/mamabee/articles/2-month-old-schedule) and [4 month old schedule](/mamabee/articles/4-month-old-schedule), or our [baby sleep schedule by age](/mamabee/articles/baby-sleep-schedule-by-age) chart.
## Sleep training during the 3 month regression
Most sleep training methods are meant for older babies, and our 4 month guide notes that 4 months is often cited as the earliest starting point. Gentle habits like a steady routine, drowsy-but-awake practice and a short pause before going in are plenty for now. If you are thinking about a method later, our [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) guide compares the options neutrally, and your pediatrician can help you decide when.
## When to call your pediatrician
Call your pediatrician if your 3 month old:
- Is under 12 weeks old and has a rectal temperature of 100.4°F (38°C) or higher. Call right away; do not wait to see if it passes (AAP).
- Has a fever and looks very ill, is unusually drowsy or very fussy, or has a fever that lasts more than 24 hours
- Has signs of an ear infection, such as fever with unusual fussiness, ear pain that seems worse at night, or fluid draining from the ear
- Has fewer than 6 wet diapers a day, a dry mouth, fewer tears or a sunken soft spot, which can be signs of dehydration
- Refuses feeds, is feeding much less than usual or is not gaining weight
- Cries inconsolably for long periods, or the crying is getting worse rather than better
- Is not doing the CDC's 2-month items, such as calming when spoken to or picked up, or holding the head up during tummy time
More is in our guides to [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do) and the [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule); the next routine checkup is at 4 months.
## Frequently asked questions
### Is there a 3 month sleep regression?
Not as a separate regression. Most sleep changes at 3 months are an early start to the 4 month sleep regression, which the Sleep Foundation says can begin around 3 to 4 months.
### How long does the 3 month sleep regression last?
Usually a few days to a few weeks, according to the Sleep Foundation. The change in sleep cycles is lasting, so helping your baby learn to link cycles is what shortens it.
### Why is my 3 month old suddenly waking up every 2 hours?
Common reasons are maturing sleep cycles, distracted daytime feeds, the swaddle transition and a schedule that no longer fits. Check for fever or other signs of illness first.
### Why are my 3 month old's naps only 30 to 45 minutes?
A 30 to 45 minute nap is often one sleep cycle, and many 3 month olds cannot yet link cycles during the day. Keep wake windows of 75 to 105 minutes and use an earlier bedtime after short naps.
### Is it the 3 month sleep regression or a growth spurt?
A growth spurt usually means more feeding for a few days, while a sleep regression lasts longer and brings shorter naps and more waking. They often overlap, so feed on cue.
### Should I stop swaddling during the 3 month regression?
Stop as soon as your baby shows any signs of trying to roll, which the AAP says can happen as early as 2 months. Switch to an arms-free sleep sack.
## The takeaway
A "3 month sleep regression" is usually the 4 month sleep change arriving a little early. Sleep cycles are maturing, your baby is more aware, naps are short and the swaddle may be on its way out. It usually settles within a few days to a few weeks. Keep wake windows around 75 to 105 minutes, practice drowsy but awake without pressure, keep the routine short and every sleep safe, and read our [4 month sleep regression](/mamabee/articles/4-month-sleep-regression) guide for the next few weeks.
## How MamaBee helps
At 3 months, the nights blur together. Was it two wake-ups or four? When did she last eat? Is this getting better? MamaBee gives you real answers in one glance, so you can stop counting in your head and start resting when you can.
[[CTA||Turn the 3 AM blur into a pattern you can see]]
- **One-thumb logging, free and with no ads:** sleep, breastfeeds with left and right timers, bottles, pumping and diapers, all on one timeline you can read half-asleep
- **7-day insights** that show how naps and nights are trending, so you can see the early 4 month change easing
- **Free real-time sync for two caregivers,** so you can split nights and both know when the last feed was
- **A pediatrician PDF export** for the 4-month checkup
- **MamaBee Premium** adds Sleep Coach nap prediction, so you know when the next nap is coming, and unlimited Bee AI, an assistant that knows your log and can help you think through a rough night
MamaBee is built for iPhone by a small team at Realm Labs. Your logs stay on your phone unless you turn on Co-Parent Sharing, and your data is never sold.
[[CTA||Track the 3 month sleep change with MamaBee, free on iPhone]]
Sources: [Sleep Foundation: 4-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/4-month-sleep-regression), [AAP HealthyChildren: Getting Your Baby to Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx), [KidsHealth: Sleep and Your 1- to 3-Month-Old](https://kidshealth.org/en/parents/sleep13m.html), [National Sleep Foundation: How Many Hours of Sleep Do You Really Need?](https://www.thensf.org/how-many-hours-of-sleep-do-you-really-need/), [CDC: Milestones by 2 Months](https://www.cdc.gov/act-early/milestones/2-months.html), [CDC: Milestones by 4 Months](https://www.cdc.gov/act-early/milestones/4-months.html), [AAP HealthyChildren: Swaddling, Is It Safe?](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx), [AAP HealthyChildren: Colic](https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Colic.aspx), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
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
