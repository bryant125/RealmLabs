// Week-13 MamaBee batch B — "N month old schedule" series, 4 and 5 months, as DRAFTS.
// Built from SCHEDULE-BRIEF.md canonical numbers (wake windows, naps, feeds) so the
// series matches our tools and existing articles. Every medical number cites a source
// listed at the end of its article. Cover images are copied from related published
// articles. DRY=1 builds and prints stats without writing.
// Run: set -a && source .env && set +a && node scripts/week13-schedules-b.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const DRY = process.env.DRY === '1'
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[IMG:')){const[name,caption,alt]=line.slice(6,line.indexOf(']]')).split('|');if(!shots[name])throw new Error('missing screenshot: '+name);out.push(img(name,caption,alt))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
const A=(slug,title,description,tags,tables,body,cover)=>({slug,title,description,tags,tables,body,cover})

const articles = [

  A('4-month-old-schedule',
    '4 Month Old Schedule: Sample Day for Naps, Feeds & Bedtime',
    'A sample 4 month old schedule with 3 to 4 naps, 90 to 120 minute wake windows, feeds and bedtime, plus the 4-month sleep change, rolling and safe sleep.',
    ['4 month old schedule', '4 month old sleep schedule', '4 month old feeding schedule', '4 month old nap schedule', '4 month old routine'],
    {
      glance: {
        caption: '4 month old schedule at a glance',
        headers: ['What', 'Typical at 4 months'],
        rows: [
          ['Wake window', '90 to 120 minutes'],
          ['Naps', '3 to 4 a day, moving toward 3'],
          ['Day sleep', 'About 3 to 4 hours in total'],
          ['Night sleep', 'About 10 to 12 hours, with 0 to 2 feeds'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', 'About 4 to 6 a day if bottle-fed, every 3 to 4 hours; breastfed babies feed on demand and may nurse more often'],
          ['Amount per bottle', 'About 4 to 6 oz of formula or pumped milk; no more than about 32 oz a day (AAP)'],
          ['Solids', 'Not yet. The AAP and CDC advise starting at about 6 months, once your baby shows signs of readiness'],
        ],
      },
      day4: {
        caption: 'Sample 4-nap day for a 4 month old (7:00 AM wake)',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breast or bottle (about 4 to 6 oz). Open the curtains to signal morning.'],
          ['7:20 AM', 'Diaper, play, tummy time', 'First wake window: 90 minutes'],
          ['8:30 AM', 'Nap 1', 'About 1 hour (8:30 to 9:30)'],
          ['9:30 AM', 'Wake, play', 'Wake window: 1 hour 45 minutes'],
          ['10:00 AM', 'Milk feed', 'About 3 hours after the first feed'],
          ['11:15 AM', 'Nap 2', 'About 1 hour 15 minutes (11:15 to 12:30)'],
          ['12:30 PM', 'Wake, floor play or a walk', 'Wake window: 1 hour 45 minutes'],
          ['1:00 PM', 'Milk feed', ''],
          ['2:15 PM', 'Nap 3', 'About 1 hour (2:15 to 3:15)'],
          ['3:15 PM', 'Wake, play', 'Wake window: 1 hour 45 minutes'],
          ['4:00 PM', 'Milk feed', ''],
          ['5:00 PM', 'Nap 4 (catnap)', 'About 30 minutes (5:00 to 5:30), often on the go'],
          ['5:30 PM', 'Wake, calm play', 'Last wake window: 90 minutes'],
          ['6:30 PM', 'Bedtime routine', 'Bath or wipe-down, pajamas, sleep sack, feed (about 6:45), song'],
          ['7:00 PM', 'Asleep in crib or bassinet', 'On the back, nothing else in the sleep space'],
          ['Overnight', '0 to 2 feeds', 'Both are normal at this age. Keep lights low and feeds quiet.'],
        ],
      },
      day3: {
        caption: 'Sample 3-nap day for a 4 month old with longer wake windows (7:00 AM wake)',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', ''],
          ['8:45 AM', 'Nap 1', 'About 1 hour 30 minutes (8:45 to 10:15). Wake window: 1 hour 45 minutes'],
          ['10:15 AM', 'Wake, play', ''],
          ['11:00 AM', 'Milk feed', 'About 4 hours after the first feed'],
          ['12:15 PM', 'Nap 2', 'About 1 hour 30 minutes (12:15 to 1:45). Wake window: 2 hours'],
          ['1:45 PM', 'Wake, play', ''],
          ['3:00 PM', 'Milk feed', ''],
          ['3:45 PM', 'Nap 3 (catnap)', 'About 45 minutes (3:45 to 4:30). Wake window: 2 hours'],
          ['4:30 PM', 'Wake, play', ''],
          ['6:00 PM', 'Bedtime routine with last feed', ''],
          ['6:30 PM', 'Asleep', 'Last wake window: 2 hours. Earlier bedtime makes up for one less nap.'],
          ['Overnight', '0 to 2 feeds', ''],
        ],
      },
    },
`**A typical 4 month old schedule has 3 to 4 naps, wake windows of about 90 to 120 minutes and 3 to 4 hours of daytime sleep. Bottle-fed babies take about 4 to 6 oz every 3 to 4 hours, and breastfed babies nurse on demand. Bedtime usually lands between 6:30 and 8:00 PM.**
Four months is a month of change. Many babies are moving from four naps to three, their sleep is maturing in ways that can mean more night waking, and they are suddenly far more interested in the world than in finishing a feed.
That can make a schedule that worked at [3 months](/mamabee/articles/3-month-old-schedule) fall apart for a while. This is normal. The sample days below are a realistic rhythm to aim for, not a timetable to hit to the minute.
## 4 month old schedule at a glance
[[TABLE:glance]]
## Sample 4 month old schedule
Here is a 4-nap day starting with a 7:00 AM wake-up. Each nap starts 90 minutes to 1 hour 45 minutes after your baby last woke up, and the day adds up to about 3 hours 45 minutes of nap time.
[[TABLE:day4]]
Feeds here come about every 3 hours, with a bedtime feed. Many families feed soon after a nap rather than right before one, so the feed does not become the only way to fall asleep.
### Sample 3-nap day for a 4 month old
Toward the end of the fourth month, many babies can stretch to wake windows of 1 hour 45 minutes to 2 hours. When that happens, the fourth nap no longer fits, and the day looks more like this:
[[TABLE:day3]]
Daytime sleep is still about 3 hours 45 minutes, just in fewer, longer naps, and bedtime moves earlier to 6:30 PM. If your baby is in between, it is fine to do a 4-nap day after short naps and a 3-nap day after long ones.
Want a version built around your own baby? Use our [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator): enter your baby's wake-up time and it maps out naps and bedtime.
[[CTA||Log naps and feeds in one tap and see your baby's real rhythm in MamaBee.]]
## Sleep at 4 months
The American Academy of Sleep Medicine (AASM) recommends 12 to 16 hours of sleep per 24 hours, including naps, for babies 4 to 12 months old. At 4 months that usually means about 3 to 4 hours of naps and 10 to 12 hours at night, with some waking.
### Naps
Expect 3 to 4 naps. The first two are often the longest. The last nap is usually a 30 to 45 minute catnap, often in a stroller or carrier. If your baby falls asleep in a car seat, swing or stroller, move them to a firm, flat sleep surface when you can.
Short naps of 30 to 45 minutes are very common at this age, because many 4-month-olds have not yet learned to drift from one sleep cycle into the next. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains how awake time and nap length work together.
### Night sleep
Many 4-month-olds sleep 10 to 12 hours at night with 0 to 2 feeds. Some no longer wake to eat. Many still do, and that is normal, especially for breastfed babies and during growth spurts. Your pediatrician can tell you whether night feeds are still needed for your baby, based on weight gain and health.
A short, predictable [bedtime routine](/mamabee/articles/baby-bedtime-routine) in the same order each night helps a lot now.
### The 4-month sleep change
Around this age, many babies who were sleeping well start waking more often, fighting naps and needing more help to settle. This is often called the 4-month sleep regression. Your baby's sleep is maturing into adult-like cycles of lighter and deeper sleep, with brief wake-ups between cycles.
The Sleep Foundation notes that the rough patch lasts from a few days to a few weeks for most babies. The change in sleep itself is permanent, and the goal is to help your baby learn to link cycles. Our full guide to the [4-month sleep regression](/mamabee/articles/4-month-sleep-regression) covers what is happening and what helps, step by step.
### Moving from 4 naps to 3
The 4-to-3 nap transition often begins around now. Signs your baby is ready include fighting the last nap for a week or more, taking a long time to fall asleep at bedtime, or the fourth nap pushing bedtime later than 8:00 PM.
To make the change, stretch wake windows slowly toward 2 hours and use an earlier bedtime on 3-nap days. Expect a messy in-between phase where you alternate. Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide walks through each transition.
## Feeding at 4 months
Breast milk or formula is still all your baby needs. Feeds are getting faster, so a shorter feed is not necessarily a smaller one.
### Breastfed babies
Keep feeding on demand. Many breastfed babies settle into feeds roughly every 3 to 4 hours by day, and some still nurse more often, especially in the evening. Wet diapers and steady weight gain at checkups are the best signs your baby is getting enough.
### Bottle-fed babies
At 4 months, most formula-fed babies take about 4 to 6 oz per feed, about 4 to 6 times a day. The AAP suggests an average of about 2.5 oz of formula a day for every pound of body weight, and usually no more than about 32 oz in 24 hours. If your baby regularly wants much more or much less, talk to your pediatrician.
Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) can give you a starting estimate, and our [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how feeds change through the first year.
### Hunger and fullness cues
Hungry babies root, suck on their hands and open their mouths when they see the breast or bottle. Crying is a late hunger sign. The AAP notes that a baby who becomes fidgety or easily distracted during a feed is probably finished. Babies who drain the bottle and keep smacking their lips may still be hungry.
### Is it time for solids?
Not yet, even if your baby stares at your plate. The AAP and the CDC recommend introducing foods other than breast milk or formula at about 6 months, and the CDC says starting before 4 months is not recommended. If your pediatrician suggests starting earlier for a medical reason, follow their advice.
Readiness signs to watch for over the next couple of months include sitting up with support, good head and neck control, opening the mouth when food comes near, and swallowing food rather than pushing it back out. Our guide on [when to start solids](/mamabee/articles/when-to-start-solids) covers the signs in detail.
## What's new at 4 months
Your baby is turning into a much more social little person. By 4 months, the CDC's "Learn the Signs. Act Early." checklist includes:
- Smiles on their own to get your attention
- Chuckles when you try to make them laugh
- Makes sounds back when you talk to them
- Holds their head steady without support when you are holding them
- Brings hands to mouth and pushes up onto elbows or forearms during tummy time
Rolling is not on the CDC's 4-month list, but the AAP notes it usually happens around 3 to 4 months, and it can happen earlier. Many babies roll from tummy to back first. For the full month-by-month picture, see our [baby milestones by month](/mamabee/articles/baby-milestones-by-month).
### The 4-month checkup
The AAP Bright Futures schedule includes a well-baby visit at 4 months. Your pediatrician checks growth and development, asks about feeding and sleep, and usually screens the parent for depression. Many babies also get the second doses of the vaccines started at 2 months. If your baby is fussier or sleepier afterward, plan a gentle day and an earlier bedtime. Our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) and [baby vaccine schedule explained](/mamabee/articles/baby-vaccine-schedule-explained) have the details.
### Simple play ideas for a 4 month old
- **Back-and-forth "talking."** When your baby coos, smile and answer, then pause for their reply. The CDC suggests this to teach turn-taking.
- **Reach and kick.** Lay your baby on a blanket on the floor with a few safe toys within reach, so they can swipe, grab and kick.
- **Tummy time on your chest or the floor.** Short, frequent sessions build the neck and arm strength needed for rolling. Our [tummy time guide](/mamabee/articles/tummy-time-guide) has positions to try.
- **Safe mouthing.** Let your baby explore toys with their mouth, as long as they are not sharp, hot or small enough to choke on.
More ideas by age are in our [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age) guide.
## Common challenges at 4 months and what helps
### Night waking is suddenly back
If your baby is suddenly waking often, the 4-month sleep change is the usual reason. Check wake windows first: an overtired baby fights sleep harder. Try putting your baby down drowsy but awake at bedtime, and give a short pause before going in when they stir, since some babies resettle on their own. Feeding back to sleep on rough nights is fine too.
### Rolling in the crib
Stop swaddling as soon as your baby shows any signs of trying to roll, the AAP advises, because rolling onto the tummy while swaddled raises the risk of suffocation. Switch to a wearable blanket or sleep sack that leaves the arms free. Our [how to swaddle a baby](/mamabee/articles/how-to-swaddle-a-baby) and [dressing baby for sleep](/mamabee/articles/dressing-baby-for-sleep) guides cover the switch.
Keep placing your baby on their back for every sleep. The AAP says that once your baby can roll both ways comfortably, you do not need to keep turning them back over. Keep the crib bare: a firm, flat mattress, a fitted sheet and nothing else. See our [safe sleep guidelines](/mamabee/articles/safe-sleep-guidelines) for the full list.
### Distracted feeding
Suddenly your baby pulls off every few seconds to look at the dog or your face. This is very common at 4 months and does not mean your milk or formula is the problem. What helps:
- Feed in a quiet, dim room for some daytime feeds.
- Offer a feed when your baby is a little sleepy, such as just after waking.
- Keep your phone down and talk less during the feed.
If distracted feeding comes with fewer wet diapers or your baby seems unwell, call your pediatrician.
### Short naps and a cranky late afternoon
If naps keep ending at 30 to 45 minutes, wait a few minutes before getting your baby up, since some will fall back asleep. A dark room helps. On short-nap days, add the extra catnap or move bedtime earlier rather than stretching your baby to the next nap.
## How to adjust the schedule for your baby
Treat the sample days as a rhythm, not a clock. Watch your baby as much as the time.
- **Follow sleepy cues.** Yawning, rubbing eyes, staring off or getting fussy mean it is time to start winding down, even if the wake window says otherwise.
- **For an early riser,** shift the whole day earlier. If your baby wakes at 6:00 AM, the first nap might start around 7:30, and bedtime may land closer to 6:30 PM.
- **For daycare,** share your baby's wake windows and nap count, expect shorter naps in a busy room, and use an earlier bedtime on daycare days.
- **On off days,** start fresh with the next wake-up. One short nap does not undo anything.
When you are ready to look ahead, our [5 month old schedule](/mamabee/articles/5-month-old-schedule) shows how the day changes once three naps settle in.
## When to call your pediatrician
Call your pediatrician if your 4-month-old:
- Refuses feeds, or takes much less milk than usual for more than a day
- Has fewer than six wet diapers a day, a dry mouth or fewer tears, which the AAP lists as early signs of dehydration
- Has a fever and looks very ill, is unusually drowsy or very fussy, or has a fever above 104°F more than once, or a fever lasting more than 24 hours
- Has trouble breathing, or is hard to wake
- Loses a skill they used to have
- Is not doing one or more of the CDC's 4-month milestones, such as holding their head steady when held, bringing hands to mouth or making sounds back when you talk
The AAP's call-right-away rule for any temperature of 100.4°F or higher applies to babies under 3 months, but when in doubt, call. Our [baby fever guide](/mamabee/articles/baby-fever-what-to-do) has more detail.
## How MamaBee can help
A 4-month-old's schedule changes week to week, and patterns are hard to see on little sleep. MamaBee is an ad-free iPhone app where you can log sleep, breast and bottle feeds, pumping and diapers for free, then see the day on one timeline with 7-day insights. Two caregivers can share the log in real time, which helps at handover and at daycare pickup. If you want predicted nap times, the Sleep Coach is part of MamaBee Premium.
## Frequently asked questions
### How long should a 4 month old nap?
Most 4-month-olds nap about 3 to 4 hours in total, spread across 3 to 4 naps. Individual naps range from a 30-minute catnap to about 1.5 hours, and short naps are very common at this age.
### How long should a 4 month old be awake between naps?
A typical wake window at 4 months is about 90 to 120 minutes. Babies taking 4 naps tend to sit at the shorter end, and babies moving to 3 naps stretch toward 2 hours.
### What time should a 4 month old go to bed?
Bedtime for a 4-month-old usually falls between 6:30 and 8:00 PM. Aim for about 90 minutes to 2 hours after the end of the last nap, and move bedtime earlier on days with short or missed naps.
### How many ounces should a 4 month old drink?
Most bottle-fed 4-month-olds take about 4 to 6 oz per feed, about 4 to 6 times a day. The AAP suggests usually no more than about 32 oz of formula in 24 hours.
### Should a 4 month old still eat at night?
Many 4-month-olds still wake for 1 or 2 night feeds, and some do not need any. Both are normal. Ask your pediatrician whether your baby still needs night feeds, based on their growth.
### Can I give my 4 month old baby food?
The AAP and CDC recommend starting solids at about 6 months, once your baby can sit with support, control their head and swallow food instead of pushing it out. Talk to your pediatrician before starting earlier.
## The takeaway
At 4 months, aim for 3 to 4 naps, wake windows of about 90 to 120 minutes, milk feeds every 3 to 4 hours and a bedtime between 6:30 and 8:00 PM. Expect some upheaval as sleep matures and naps drop toward 3. Stop swaddling once rolling starts, keep the crib bare, and wait on solids until about 6 months.
[[CTA||See your 4-month-old's naps, feeds and nights on one timeline. Try MamaBee free.]]
Sources: [AASM: Recommended Amount of Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [AAP HealthyChildren: Amount and Schedule of Baby Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: A Parent's Guide to Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Swaddling, Is It Safe?](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx), [AAP HealthyChildren: Starting Solid Foods](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx), [CDC: When, What, and How to Introduce Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html), [CDC: Important Milestones, Your Baby by Four Months](https://www.cdc.gov/act-early/milestones/4-months.html), [Sleep Foundation: The 4-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/4-month-sleep-regression), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP HealthyChildren: Fever, When to Call the Pediatrician](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`,
    'mamabee-4-month-sleep-regression'),

  A('5-month-old-schedule',
    '5 Month Old Schedule: Sample Day for Naps, Feeds & Bedtime',
    'A sample 5 month old schedule with 3 naps, 2 to 2.5 hour wake windows, feeds and bedtime, plus early waking, rolling and signs of readiness for solids.',
    ['5 month old schedule', '5 month old sleep schedule', '5 month old feeding schedule', '5 month old nap schedule', '5 month old routine'],
    {
      glance: {
        caption: '5 month old schedule at a glance',
        headers: ['What', 'Typical at 5 months'],
        rows: [
          ['Wake window', '2 to 2.5 hours'],
          ['Naps', '3 a day'],
          ['Day sleep', 'About 3 to 3.5 hours in total'],
          ['Night sleep', 'About 10 to 12 hours; some babies still wake to feed'],
          ['Total sleep', '12 to 16 hours in 24 hours, including naps (AASM, 4 to 12 months)'],
          ['Milk feeds', 'About 4 to 6 a day if bottle-fed; breastfed babies feed on demand'],
          ['Amount per bottle', 'About 4 to 6 oz (some babies take up to 6 to 7 oz); no more than about 32 oz a day (AAP)'],
          ['Solids', 'Not yet for most babies. The AAP and CDC advise starting at about 6 months, once your baby shows signs of readiness'],
        ],
      },
      day7: {
        caption: 'Sample 3-nap day for a 5 month old (7:00 AM wake)',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Breast or bottle (about 4 to 6 oz). Daylight and a cheerful "good morning."'],
          ['7:30 AM', 'Diaper, play, tummy time', 'First wake window: 2 hours'],
          ['9:00 AM', 'Nap 1', 'About 1 hour 30 minutes (9:00 to 10:30)'],
          ['10:30 AM', 'Wake, play', 'Wake window: 2 hours 15 minutes'],
          ['11:00 AM', 'Milk feed', 'About 4 hours after the first feed'],
          ['12:45 PM', 'Nap 2', 'About 1 hour 30 minutes (12:45 to 2:15)'],
          ['2:15 PM', 'Wake, play or a walk', 'Wake window: 2 hours 15 minutes'],
          ['3:00 PM', 'Milk feed', ''],
          ['4:30 PM', 'Nap 3 (catnap)', 'About 30 minutes (4:30 to 5:00), often in a stroller or carrier'],
          ['5:00 PM', 'Wake, calm play', 'Last wake window: 2 hours 15 minutes'],
          ['6:45 PM', 'Bedtime routine with last feed', 'Bath or wipe-down, pajamas, sleep sack, feed, book or song'],
          ['7:15 PM', 'Asleep in crib', 'On the back, nothing else in the sleep space'],
          ['Overnight', 'Feeds as needed', 'Some 5-month-olds still wake to eat. That can be normal.'],
        ],
      },
      day6: {
        caption: 'Sample day for a 5 month old early riser (6:00 AM wake)',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:00 AM', 'Wake up, milk feed', 'Keep it calm and dim if it is still dark outside'],
          ['8:00 AM', 'Nap 1', 'About 1 hour 30 minutes (8:00 to 9:30). Wake window: 2 hours'],
          ['9:30 AM', 'Wake, play', ''],
          ['10:00 AM', 'Milk feed', ''],
          ['11:45 AM', 'Nap 2', 'About 1 hour 30 minutes (11:45 to 1:15). Wake window: 2 hours 15 minutes'],
          ['1:15 PM', 'Wake, play', ''],
          ['2:00 PM', 'Milk feed', ''],
          ['3:30 PM', 'Nap 3 (catnap)', 'About 30 minutes (3:30 to 4:00). Wake window: 2 hours 15 minutes'],
          ['4:00 PM', 'Wake, play', ''],
          ['6:00 PM', 'Bedtime routine with last feed', ''],
          ['6:30 PM', 'Asleep', 'Last wake window: 2 hours 30 minutes'],
          ['Overnight', 'Feeds as needed', ''],
        ],
      },
    },
`**A typical 5 month old schedule has 3 naps, wake windows of about 2 to 2.5 hours and 3 to 3.5 hours of daytime sleep. Bottle-fed babies take about 4 to 6 oz, 4 to 6 times a day; breastfed babies nurse on demand. Bedtime is usually 6:30 to 8:00 PM. Most babies are not ready for solids yet.**
Five months is often a calmer month. Many babies have settled into three naps, and days start to feel like they have a shape.
It is also a busy month for development. Your baby may be rolling, grabbing everything in reach and watching every bite you eat. If you are coming from our [4 month old schedule](/mamabee/articles/4-month-old-schedule), the big change is fewer, longer stretches of awake time. The sample days below show how that fits together.
## 5 month old schedule at a glance
[[TABLE:glance]]
## Sample 5 month old schedule
Here is a 3-nap day starting with a 7:00 AM wake-up. Each nap starts 2 hours to 2 hours 15 minutes after your baby last woke up, and the naps add up to about 3.5 hours.
[[TABLE:day7]]
Feeds here come about every 4 hours, with the last one as part of the bedtime routine. The longest wake window of the day is often the one before bed, so it is fine if your baby can handle a little more awake time in the evening than in the morning.
### Sample day for a 6:00 AM early riser
If your baby reliably wakes at 6:00 AM and is happy and rested, you do not have to fight it. Shift the whole day an hour earlier instead:
[[TABLE:day6]]
The nap total is the same, about 3.5 hours, and bedtime moves to 6:30 PM so your baby still gets 10 to 12 hours at night. If the early wake-up is a problem rather than a preference, see the early waking tips below.
To build a day around your own baby's wake-up time, try our [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator): enter your baby's wake-up time and it suggests nap times and a bedtime.
[[CTA||Log naps, feeds and wake-ups in MamaBee and spot your baby's pattern.]]
## Sleep at 5 months
The American Academy of Sleep Medicine (AASM) recommends 12 to 16 hours of sleep per 24 hours, including naps, for babies 4 to 12 months old. At 5 months that is usually about 3 to 3.5 hours of naps plus 10 to 12 hours at night.
### Settling into 3 naps
Most 5-month-olds take 3 naps: two longer naps in the morning and early afternoon, and a short third nap in the late afternoon. If your baby is still taking four, that is fine too. The 4-to-3 transition has a wide range, and many babies make it during this month. Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide explains the signs and how to smooth the change.
The move from 3 naps to 2 usually comes later, around 6 to 9 months.
### Longer wake windows
At 5 months, most babies can stay happily awake for about 2 to 2.5 hours. The first wake window of the day is usually the shortest. If you are not sure where your baby fits, our [wake window calculator](/mamabee/tools/wake-window-calculator) and the [wake windows by age](/mamabee/articles/wake-windows-by-age) guide can help you find a starting point.
If naps are a struggle, try moving the wake window by 15 minutes in one direction for a few days and see what changes.
### The third nap is a catnap
The last nap of the day is often just 30 to 45 minutes. Its job is to bridge your baby to bedtime, not to be a big sleep. Many families let it happen in the stroller or carrier on a walk. If your baby falls asleep in a car seat, swing or stroller, move them to a firm, flat sleep surface when you can.
If your baby refuses the third nap, an earlier bedtime that day is the simplest fix.
### Night sleep
Many 5-month-olds sleep 10 to 12 hours at night. Some still wake for one or more feeds, and that can be completely normal, especially for breastfed babies. Ask your pediatrician whether night feeds are still needed for your baby. If your baby is still in the thick of the [4-month sleep regression](/mamabee/articles/4-month-sleep-regression), the tips in that guide still apply.
A short, consistent [bedtime routine](/mamabee/articles/baby-bedtime-routine) in the same order every night is one of the most helpful things you can keep doing now.
## Feeding at 5 months
Breast milk or formula is still your baby's main food, and it covers everything they need right now.
### Breastfed babies
Keep nursing on demand. Many 5-month-olds feed quickly and efficiently, sometimes in just a few minutes. If your baby has plenty of wet diapers and is growing well at checkups, short feeds are usually not a concern.
### Bottle-fed babies
At 5 months, most formula-fed babies take about 4 to 6 oz per feed, and some take up to 6 to 7 oz, about 4 to 6 times a day. The AAP suggests an average of about 2.5 oz of formula a day per pound of body weight, and usually no more than about 32 oz in 24 hours. Let your baby show you when they have had enough.
Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a starting estimate, and the [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows what comes next.
### Signs your baby is getting ready for solids
Most babies start solids at about 6 months, which is what the AAP and CDC recommend. At 5 months you may start to see readiness signs. The CDC lists signs that your baby is developmentally ready to begin eating food, including:
- Sits up alone or with support
- Controls their head and neck
- Opens their mouth when you offer food
- Swallows food rather than pushing it back out onto their chin
- Brings objects to their mouth and tries to grasp small objects
Interest alone is not readiness. A 5-month-old who grabs your spoon is curious, but look for the full set of signs together. If your pediatrician suggests starting earlier, follow their advice.
When you do start, the AAP says there is no evidence that waiting to introduce foods like egg, dairy or peanut products beyond 4 to 6 months prevents food allergy. Babies with severe eczema or egg allergy may need testing first, so check with your pediatrician. Our guides on [when to start solids](/mamabee/articles/when-to-start-solids) and [introducing allergens](/mamabee/articles/introducing-allergens-to-baby) will help you plan.
## What's new at 5 months
This is a month of reaching, grabbing and rolling. There is no separate CDC checklist for 5 months, but it helps to know what is coming. By 6 months, the CDC lists:
- Laughs, and likes to look at themselves in a mirror
- Takes turns making sounds with you, blows "raspberries" and squeals
- Reaches to grab a toy they want and puts things in their mouth to explore
- Rolls from tummy to back
- Pushes up with straight arms during tummy time and leans on hands to support themselves when sitting
Many babies roll from tummy to back first, and some 5-month-olds are already rolling both ways. Others get there a bit later. For the full picture, see our [baby milestones by month](/mamabee/articles/baby-milestones-by-month).
### Simple play ideas for a 5 month old
- **Just out of reach.** Put a toy a little beyond your baby's hand during tummy time so they stretch, pivot or roll to get it. The CDC includes this in its 6-month tips.
- **Grab-and-pass.** Offer toys that are easy to hold, such as rings, soft blocks or a rattle, and let your baby pass them from hand to hand.
- **Mirror time.** A baby-safe mirror on the floor during tummy time keeps many babies interested a little longer.
- **Copy their sounds.** When your baby babbles or blows raspberries, copy them and wait for a reply.
- **Look at books together.** Point to bright pictures, name them and respond when your baby "talks" back.
More ideas are in our [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age) and [tummy time guide](/mamabee/articles/tummy-time-guide).
## Common challenges at 5 months and what helps
### Early morning waking
Waking before 6:00 AM is one of the most common complaints at this age. What often helps:
- **Make the room very dark.** Early light through the curtains can wake a light sleeper.
- **Check the last wake window.** Too short and your baby is not tired enough at bedtime. Too long and an overtired baby often wakes early. Adjust by 15 minutes at a time.
- **Treat wake-ups before 6:00 AM like night.** Keep the lights off and voices low, feed if needed, and settle back to sleep.
- **Avoid a very early first nap.** If the first nap starts right after an early wake-up, it can turn into the end of night sleep. Stretch it slowly toward the usual wake window.
- **Try an earlier bedtime.** It sounds backward, but an overtired baby can wake earlier, not later.
### Rolling and getting stuck
New rollers often flip onto their tummy in the crib and then get upset. Keep placing your baby on their back for every sleep. The AAP says that once your baby can roll both ways comfortably, you do not need to keep turning them back over. Lots of rolling practice during the day helps them learn to roll back.
If you are still swaddling, stop as soon as your baby shows any signs of trying to roll, as the AAP advises. Use a sleep sack that leaves the arms free, and keep the crib bare. See our [safe sleep guidelines](/mamabee/articles/safe-sleep-guidelines) and [dressing baby for sleep](/mamabee/articles/dressing-baby-for-sleep).
### Short or skipped third nap
A 30-minute third nap is normal. If your baby skips it altogether, move bedtime earlier, toward 6:30 PM, rather than pushing through a long, cranky evening.
### Distracted feeding
The distracted feeding that often starts at 4 months can continue. A quiet, dim room for some feeds, offering a feed right after naps, and keeping the session calm all help. Some babies make up for distracted daytime feeds by eating more in the evening or at night.
### Wanting your food
Grabbing your plate is curiosity, not a sign your baby needs solids. Give them a safe toy to hold at mealtimes and let them sit with the family on your lap.
## How to adjust the schedule for your baby
The sample days are a guide. Your baby's cues matter more than the clock.
- **Watch sleepy cues.** Yawning, rubbing eyes, staring off and fussing mean it is time to wind down, even if the wake window is not over.
- **Move the whole day.** If your baby wakes at 6:00 or 8:00 AM, shift every nap and feed by the same amount, and keep bedtime between 6:30 and 8:00 PM.
- **Rescue short-nap days** with an earlier bedtime, not a later one.
- **For daycare,** share your baby's wake windows and nap count, and use an earlier bedtime on daycare days.
When you are ready, our [6 month old schedule](/mamabee/articles/6-month-old-schedule) shows how the day changes as solids begin.
## When to call your pediatrician
Call your pediatrician if your 5-month-old:
- Refuses feeds, or takes much less milk than usual for more than a day
- Has fewer than six wet diapers a day, a dry mouth or fewer tears, which the AAP lists as early signs of dehydration
- Has a fever and looks very ill, is unusually drowsy or very fussy, or has a fever above 104°F more than once, or a fever lasting more than 24 hours
- Has trouble breathing, or is hard to wake
- Loses a skill they used to have, such as no longer smiling, cooing or holding their head steady
- Is not yet doing some of the CDC's 4-month milestones, or you have any concern about their development
You know your baby best, and the CDC encourages parents not to wait if something feels off. Our [baby fever guide](/mamabee/articles/baby-fever-what-to-do) explains how to take a temperature and what to watch for.
## How MamaBee can help
A good 5-month schedule is easier to find when you can see what actually happened. MamaBee is an ad-free iPhone app where you can log sleep, feeds, pumping, diapers and, later, solids for free, and see each day on one timeline with 7-day insights. Two caregivers can share the log in real time, which helps with daycare and handovers. If you want predicted nap times, the Sleep Coach is part of MamaBee Premium.
## Frequently asked questions
### How many naps should a 5 month old take?
Most 5-month-olds take 3 naps a day, adding up to about 3 to 3.5 hours. Some are still finishing the move from 4 naps, which is normal at this age.
### How long should a 5 month old be awake between naps?
A typical wake window at 5 months is about 2 to 2.5 hours. The first wake window of the day is usually the shortest, and the one before bed is often the longest.
### What time should a 5 month old go to bed?
Most 5-month-olds go to bed between 6:30 and 8:00 PM. Aim for about 2 to 2.5 hours after the end of the last nap, and choose the earlier end on days with short or skipped naps.
### How many ounces should a 5 month old drink?
Most bottle-fed 5-month-olds take about 4 to 6 oz per feed, and some up to 6 to 7 oz, about 4 to 6 times a day. The AAP suggests usually no more than about 32 oz of formula in 24 hours.
### Can a 5 month old start solids?
Most babies start solids at about 6 months, as the AAP and CDC recommend. Wait until your baby shows the readiness signs, such as sitting with support, good head control and swallowing food instead of pushing it out, and talk to your pediatrician before starting earlier.
### Why does my 5 month old wake up so early?
Common reasons include light in the room, a bedtime that is too early or too late for your baby, and a first nap that starts too soon after waking. Make the room dark, treat wake-ups before 6:00 AM like night, and adjust the last wake window in small steps.
## The takeaway
At 5 months, aim for 3 naps, wake windows of about 2 to 2.5 hours, milk feeds of about 4 to 6 oz and a bedtime between 6:30 and 8:00 PM. Let the third nap be short, use an earlier bedtime on rough days, keep your rolling baby's crib bare, and watch for the signs that solids are coming at about 6 months.
[[CTA||Track naps, feeds and wake-ups for your 5-month-old. Try MamaBee free.]]
Sources: [AASM: Recommended Amount of Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [AAP HealthyChildren: Amount and Schedule of Baby Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: Starting Solid Foods](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx), [CDC: When, What, and How to Introduce Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html), [CDC: Important Milestones, Your Baby by Six Months](https://www.cdc.gov/act-early/milestones/6-months.html), [CDC: Important Milestones, Your Baby by Four Months](https://www.cdc.gov/act-early/milestones/4-months.html), [AAP HealthyChildren: A Parent's Guide to Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Swaddling, Is It Safe?](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP HealthyChildren: Fever, When to Call the Pediatrician](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`,
    'mamabee-baby-nap-transitions'),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  const src = await client.getDocument(a.cover)
  if (src?.coverImage) doc.coverImage = src.coverImage
  else console.warn(`⚠️  no coverImage on ${a.cover} for ${a.slug}`)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  const ctas = doc.body.filter((b) => b._type === 'appCta').length
  const faqStart = doc.body.findIndex((b) => b.style === 'h2' && b.children?.[0]?.text === 'Frequently asked questions')
  const faqEnd = doc.body.findIndex((b, i) => i > faqStart && b.style === 'h2')
  const faqs = doc.body.slice(faqStart + 1, faqEnd).filter((b) => b.style === 'h3').length
  const first = doc.body[0].children.map((s) => s.text).join('').split(/\s+/).filter(Boolean).length
  const links = doc.body.flatMap((b) => b.markDefs || []).filter((m) => m._type === 'link')
  const internal = [...new Set(links.filter((m) => m.href.startsWith('/')).map((m) => m.href))]
  const external = [...new Set(links.filter((m) => m.href.startsWith('http')).map((m) => m.href))]
  if (DRY) {
    console.log(`DRY ${a.slug}: ~${w} words, ${tables} tables, ${ctas} CTAs, ${faqs} FAQs, answer-first ${first} words, title ${a.title.length}c, desc ${a.description.length}c, cover ${doc.coverImage ? 'ok' : 'MISSING'}`)
    console.log(`  internal (${internal.length}): ${internal.join(' ')}`)
    console.log(`  external (${external.length}): ${external.join(' ')}`)
    continue
  }
  await client.createOrReplace(doc)
  console.log(`${w >= 1800 && w <= 2600 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${tables} tables, ${faqs} FAQs, title ${a.title.length}c, desc ${a.description.length}c, cover ${doc.coverImage ? 'from ' + a.cover : 'none'})`)
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
