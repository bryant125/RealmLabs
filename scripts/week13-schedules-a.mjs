// Week-13 MamaBee "N month old schedule" series, part A: 2 and 3 months, as DRAFTS.
// Demand from US Google Trends (Nov 2026): "2 month old schedule" 1.9x and
// "3 month old schedule" 2.2x "baby tracker app". Numbers follow the series
// canonical sheet (matches our wake-window tools and existing articles); every
// medical claim cites a source listed at the end of its article.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week13-schedules-a.mjs
// DRY=1 builds and prints stats without writing anything.
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

const DRY = process.env.DRY === '1'
// Cover image source per article (published related article with a cover).
const COVER_FROM = {
  '2-month-old-schedule': ['mamabee-newborn-sleep-schedule', 'mamabee-wake-windows-by-age'],
  '3-month-old-schedule': ['mamabee-wake-windows-by-age', 'mamabee-newborn-sleep-schedule'],
}

const articles = [

  A('2-month-old-schedule',
    '2 Month Old Schedule: Sample Day, Naps, Feeds & Bedtime',
    'A sample 2 month old schedule with wake windows, 4 to 6 naps, feeds every 3 to 4 hours and bedtime, plus vaccine-day tips and when to call the doctor.',
    ['2 month old schedule', '2 month old sleep schedule', '2 month old feeding schedule', '2 month old nap schedule', '2 month old routine'],
    {
      glance: {
        caption: '2 month old schedule at a glance (typical ranges; every baby is different)',
        headers: ['At 2 months', 'Typical range'],
        rows: [
          ['Wake window', '60 to 90 minutes'],
          ['Naps', '4 to 6 a day, many of them short'],
          ['Day sleep', 'About 4 to 6 hours'],
          ['Night sleep', 'About 9 to 11 hours, with 1 to 3 wakes to feed'],
          ['Total sleep', 'About 14 to 17 hours in 24 hours'],
          ['Milk feeds', 'Breastfed: on demand, typically 8 to 12 times a day (some babies now 7 to 9). Formula: every 3 to 4 hours'],
          ['Amount per bottle (formula)', 'About 4 to 5 oz'],
          ['Solids', 'None yet. Breast milk or formula only until about 6 months'],
          ['Bedtime', 'Often between 6:30 and 8:00 PM'],
        ],
      },
      sample: {
        caption: 'Sample 2 month old schedule: 7:00 AM wake, 5 naps, bottle-style feed times',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, feed 1', 'Breastfeed or about 4 to 5 oz of formula. Open the curtains so the day feels like day'],
          ['7:15 AM', 'Diaper, cuddles, a few minutes of tummy time', 'Short sessions are fine. Stop when your baby fusses'],
          ['8:15 AM', 'Nap 1 (about 1 hour 30 minutes)', 'After a 75-minute wake window'],
          ['9:45 AM', 'Wake up, diaper, face-to-face play', 'Talk, sing, copy your baby\'s sounds'],
          ['10:00 AM', 'Feed 2', 'About 3 hours after feed 1'],
          ['11:00 AM', 'Nap 2 (about 45 minutes)', 'After a 75-minute wake window. A short nap is normal'],
          ['11:45 AM', 'Wake up, diaper, play', 'A good time for a walk outside'],
          ['1:00 PM', 'Feed 3, then wind down', 'Dim the room. Swaddle only if your baby is not trying to roll'],
          ['1:15 PM', 'Nap 3 (about 1 hour 30 minutes)', 'After a 90-minute wake window. Often the longest nap'],
          ['2:45 PM', 'Wake up, diaper, tummy time and play', 'Toys or your face at eye level'],
          ['4:00 PM', 'Feed 4', 'Fussiness often builds from late afternoon'],
          ['4:15 PM', 'Nap 4 (about 30 minutes)', 'After a 90-minute wake window. A catnap in the carrier or stroller is fine'],
          ['4:45 PM', 'Wake up, calm play', 'Keep things low-key as the fussy evening stretch arrives'],
          ['6:00 PM', 'Nap 5 (about 30 minutes)', 'After a 75-minute wake window. Bridges the gap to bedtime'],
          ['6:30 PM', 'Wake up, start the bedtime routine', 'Diaper, pajamas or sleep sack, lights low'],
          ['7:00 PM', 'Feed 5 (bedtime feed)', 'Many babies cluster feed now: several short feeds close together'],
          ['7:30 PM', 'Bedtime', 'After a 60-minute wake window. On the back, in their own crib or bassinet'],
          ['Overnight', '1 to 3 feeds, for example around 11 PM and 3 AM', 'Lights low, voice quiet, diaper only if needed, straight back down'],
        ],
      },
      early: {
        caption: 'Variation: 6:00 AM early riser, breastfed on demand, 6 shorter naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:00 AM', 'Wake up, nurse', 'Start the day here if your baby is wide awake'],
          ['7:00 AM', 'Nap 1 (about 45 minutes)', 'After a 60-minute wake window. The first window is often the shortest'],
          ['7:45 AM', 'Wake up, nurse, play', ''],
          ['9:00 AM', 'Nap 2 (about 45 minutes)', 'After a 75-minute wake window'],
          ['9:45 AM', 'Wake up, nurse, tummy time', ''],
          ['11:00 AM', 'Nap 3 (about 1 hour 30 minutes)', 'After a 75-minute wake window. A contact nap or stroller nap counts'],
          ['12:30 PM', 'Wake up, nurse, play', ''],
          ['2:00 PM', 'Nap 4 (about 45 minutes)', 'After a 90-minute wake window'],
          ['2:45 PM', 'Wake up, nurse, play', ''],
          ['4:00 PM', 'Nap 5 (about 30 minutes)', 'After a 75-minute wake window'],
          ['4:30 PM', 'Wake up, nurse', 'Evening cluster feeding often starts around here'],
          ['5:45 PM', 'Nap 6 (about 30 minutes)', 'After a 75-minute wake window. A catnap in arms or a carrier is fine'],
          ['6:15 PM', 'Wake up, nurse, start the bedtime routine', ''],
          ['6:45 PM', 'Top-up nurse in a dim room', 'Part of the evening cluster'],
          ['7:15 PM', 'Bedtime', 'After a 60-minute wake window'],
          ['Overnight', '2 to 3 feeds', 'Common for a breastfed 2 month old'],
        ],
      },
    },
`**A typical 2 month old schedule has 4 to 6 naps a day, many of them short, with wake windows of 60 to 90 minutes. Breastfed babies usually feed 8 to 12 times in 24 hours, and formula-fed babies take about 4 to 5 ounces every 3 to 4 hours. Bedtime often lands between 6:30 and 8:00 PM, with 1 to 3 night feeds.**
Two months is when many parents feel the fog lift a little. Your baby is awake for longer, starts smiling back at you, and days and nights are slowly sorting themselves out. It is also a month of short naps, evening fussiness and the first big round of vaccines.
Think of a 2 month old schedule as a loose rhythm, not a timetable. The sample days below show how wake windows, naps and feeds fit together, with the times worked out, so you have something concrete to start from. Then shift it to fit your baby.
[[TABLE:glance]]
## Sample 2 month old schedule
This day starts at 7:00 AM and uses wake windows of 60 to 90 minutes, five naps and five daytime feeds about 3 hours apart. Feed times are written the way a bottle-fed day often looks. If you breastfeed, you will probably nurse more often than this, and that is normal.
[[TABLE:sample]]
That adds up to about 4 hours 45 minutes of day sleep. Bedtime to wake-up is 11½ hours, so after night feeds most babies on this rhythm get roughly 10 to 11 hours at night, about 15 hours in total. That sits inside the 14 to 17 hours the National Sleep Foundation recommends for babies 0 to 3 months.
A note on bottle amounts: seven feeds of 5 ounces would add up to 35 ounces. The AAP suggests formula intake should average no more than about 32 ounces in 24 hours, so it is normal for some feeds, especially at night, to be smaller. Let your baby stop when they show they are full.
### Variation: 6:00 AM early riser, breastfed on demand
Many 2 month olds have days like this one: an earlier start, six shorter naps, and nursing at almost every wake-up, with a cluster of feeds in the evening.
[[TABLE:early]]
Day sleep is again about 4 hours 45 minutes, and bedtime is 7:15 PM. Counting the night, that is around 10 to 11 nursing sessions in 24 hours, inside the 8 to 12 the AAP describes for breastfed babies.
## How does sleep work at 2 months?
### Naps
Naps at this age are all over the place. Many last 30 to 45 minutes, one or two may stretch to an hour or more, and the number changes day to day. That is normal. The timing of the next nap matters more than the length of the last one.
Watch for sleepy cues near the end of the wake window: yawning, staring off, red eyebrows, turning away from faces, fussing. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide covers how to read them. If you want a ready-made starting point, enter your baby's wake-up time in our [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator), or use the [wake window calculator](/mamabee/tools/wake-window-calculator) to time the next nap.
Contact naps, carrier naps and stroller naps all count. If your baby only naps on you right now, that is common at this age. Our guide to [contact naps and independent sleep](/mamabee/articles/contact-naps-and-independent-sleep) explains how to ease toward the crib when you are ready.
### Night sleep
Day and night confusion usually fades by now. You may notice one longer stretch at the start of the night, often the first few hours after bedtime. Night waking is still expected. The AAP notes that babies do not have regular sleep cycles until about 4 months of age, so 1 to 3 night feeds are completely normal at 2 months.
Two things help nights from the AAP's sleep tips: keep night feeds calm and quiet, with dim light and little talking, and make daytime the time for play. A short, predictable [bedtime routine](/mamabee/articles/baby-bedtime-routine) is worth starting now, even if bedtime itself still moves around.
### Safe sleep, and when to stop swaddling
The AAP's safe sleep basics apply to every nap and every night:
- Place your baby on their back to sleep, every time.
- Use a firm, flat, separate sleep surface with only a fitted sheet.
- Share a room, not a bed, ideally for at least the first 6 months.
- Keep pillows, blankets, bumpers and toys out of the crib, and never use weighted swaddles or sleep sacks.
Swaddling deserves a special mention at 2 months. The AAP says to stop swaddling as soon as your baby shows any signs of trying to roll over, and notes some babies start working on rolling as early as 2 months. If you see your baby rocking onto their side or twisting their hips, switch to an arms-free sleep sack, which the AAP says can be used as long as you want. Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) and [how to swaddle a baby](/mamabee/articles/how-to-swaddle-a-baby) cover the details.
## Feeding at 2 months
### Breastfed babies
Feed on demand. The AAP describes 8 to 12 nursing sessions in 24 hours for young breastfed babies, and some babies drop to about 7 to 9 around now as they get more efficient. Evening [cluster feeding](/mamabee/articles/cluster-feeding) is common, and a [growth spurt](/mamabee/articles/baby-growth-spurts) can make your baby hungrier for a few days.
You cannot measure ounces at the breast, so look at the signs the AAP lists: 6 or more wet diapers a day with pale pee, a baby who seems content between feeds, and steady weight gain at checkups.
### Formula-fed babies
Most 2 month olds take about 4 to 5 ounces every 3 to 4 hours. The AAP's rule of thumb is about 2½ ounces of formula per pound of body weight per day, up to an average of about 32 ounces. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) can estimate a range for your baby's weight, and the [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how amounts change over the year.
### Hunger and fullness cues
The CDC lists early hunger signs as putting hands to the mouth, turning toward the breast or bottle, and smacking or licking lips. Fullness looks like closing the mouth or turning the head away. If your baby is not hungry, it is OK to stop.
### No water or solids yet
The CDC advises breast milk or formula only. Babies are not ready for other foods, water or other drinks for about the first 6 months.
[[CTA||See every nap and feed on one timeline with MamaBee.]]
## What's new at 2 months
This is the month of the first real social smiles. The CDC's 2-month checklist (revised in 2022) includes milestones most babies reach by now, such as:
- Smiles when you talk to or smile at them
- Calms down when spoken to or picked up
- Looks at your face, and watches you as you move
- Makes sounds other than crying
- Holds head up when on tummy
Simple play ideas that fit this age, drawn from CDC and AAP tips:
- **Have a "conversation."** Copy your baby's sounds and pause so they can answer.
- **Tummy time, little and often.** The AAP suggests working up to 15 to 30 minutes a day by 7 weeks, spread over short sessions. Our [tummy time guide](/mamabee/articles/tummy-time-guide) has positions that babies tolerate better.
- **Rattle tracking.** Shake a rattle to one side of your baby's head and see if they look for the sound.
- **Mirror time.** A baby-safe mirror during tummy time is fascinating at this age.
- **Talk, read and sing** during feeds, changes and baths.
For the full month-by-month picture, see [baby milestones by month](/mamabee/articles/baby-milestones-by-month) and [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age).
## Common challenges at 2 months and what helps
### Short naps
A nap that ends after 30 to 45 minutes is usually just one sleep cycle. Try waiting a few minutes before going in, since some babies fuss briefly and resettle. If your baby wakes happy, the nap is over. Use the shorter end of the wake window before the next nap so short naps do not stack into an overtired evening.
### The witching hour and evening cluster feeds
Late afternoon and evening fussiness is very common. The AAP notes that fussing usually peaks at about 3 hours a day around 6 weeks, then declines to 1 to 2 hours a day by 3 to 4 months. What helps: dim lights early, offer frequent feeds, use motion such as a carrier or walk, and tag-team with another adult. Our [newborn witching hour](/mamabee/articles/newborn-witching-hour) guide has more ideas and explains how it differs from colic.
### Fussiness after the 2-month shots
The 2-month checkup is usually the first big vaccine visit. The CDC says mild reactions such as soreness where the shot was given, a rash or a fever can happen and soon go away, and that it is normal for some babies to eat less for about 24 hours. Expect a fussier, sleepier day and let the schedule go. Offer feeds more often, cuddle, and use a cool, damp cloth on a sore spot. Ask at the visit whether a pain reliever is OK and at what dose. Because your baby is under 3 months, call your pediatrician for any temperature of 100.4°F or higher. Our [baby vaccine schedule explained](/mamabee/articles/baby-vaccine-schedule-explained) and [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) guides cover what happens at the visit.
### Rolling attempts and the end of the swaddle
If your baby starts rocking side to side or breaks out of the swaddle with a lot of twisting, it is time to stop swaddling. The first few nights in a sleep sack can be bumpy. Keep the rest of the routine the same, and expect naps to be messy for a few days while your baby adjusts.
### Tummy time protests
Many babies dislike tummy time at first. Try it on your chest, across your lap, or on the floor with you face to face. A minute or two several times a day is fine. It all adds up.
## How to adjust the schedule for your baby
The sample days are a shape to work from, not a rule. A few ways to make one fit:
- **Follow cues first.** If your baby is yawning at 50 minutes, put them down. If they are content at 90, you can stretch a little.
- **Anchor the morning.** Starting the day at a similar time makes the rest of the day more predictable.
- **Early riser?** Shift everything earlier, as in the 6:00 AM version, rather than forcing your baby to wait until 7:00.
- **Bad day?** Drop the plan, offer an extra catnap, and start fresh tomorrow.
- **Going back to work or starting daycare?** Share your baby's usual wake windows and feeding pattern with caregivers. If you are breastfeeding, our guide to [introducing a bottle to a breastfed baby](/mamabee/articles/introducing-a-bottle-to-breastfed-baby) covers timing.
- **Born early?** Ask your pediatrician whether to use your baby's adjusted age when comparing sleep and milestones.
If your baby was a newborn very recently, our [newborn sleep schedule](/mamabee/articles/newborn-sleep-schedule) is a useful look back. Next month, see the [3 month old schedule](/mamabee/articles/3-month-old-schedule).
## When to call your pediatrician
Call right away if your 2 month old:
- Has a rectal temperature of 100.4°F (38°C) or higher (AAP guidance for babies under 3 months). See our [baby fever guide](/mamabee/articles/baby-fever-what-to-do).
- Refuses several feeds in a row, or feeds much less than usual
- Has fewer than 6 wet diapers a day, a dry mouth or fewer tears, which the AAP lists as early dehydration signs
- Is unusually sleepy, hard to wake, floppy or very fussy
- Cries in a way that sounds different, or cannot be soothed for hours
Also book a call if your baby has lost skills they had, is not doing most of the CDC 2-month items, or anything about their development worries you. The CDC's advice is simple: don't wait. Call 911 for trouble breathing, blue or gray lips, or a baby you cannot wake.
## How MamaBee can help
If you would like help seeing the pattern, MamaBee is an iPhone baby tracker with no ads. Logging sleep, feeds (with left and right breastfeeding timers, bottles and pumping) and diapers is free, and the timeline and 7-day insights show your baby's longest stretch and typical nap length at a glance. Two caregivers can sync in real time, so whoever is up at 3 AM knows when the last feed was. Sleep Coach, a Premium feature, predicts the next nap from your baby's wake windows. A notebook on the fridge works too. The point is to see the rhythm, not to chase a perfect day.
## Frequently asked questions
### How long should a 2 month old nap?
Naps at 2 months often last 30 to 45 minutes, with one or two longer naps of an hour or more. Across 4 to 6 naps, that usually adds up to about 4 to 6 hours of day sleep.
### How long can a 2 month old stay awake?
Most 2 month olds can stay happily awake for about 60 to 90 minutes, including feeding time. The first wake window of the day is often the shortest.
### What time should a 2 month old go to bed?
Bedtime often falls between 6:30 and 8:00 PM at this age. Some babies still have a later bedtime, and it tends to move earlier over the next few weeks as nights settle.
### How many ounces should a 2 month old drink?
Most formula-fed 2 month olds take about 4 to 5 ounces every 3 to 4 hours. The AAP suggests an average of no more than about 32 ounces of formula in 24 hours.
### Should I wake my 2 month old to eat?
During the day, offering a feed about every 3 hours helps keep more calories in daylight hours. At night, once your baby is gaining weight well and your pediatrician agrees, you usually do not need to wake them to feed.
### When should I stop swaddling my 2 month old?
Stop as soon as your baby shows any signs of trying to roll over, which the AAP notes can start as early as 2 months. Switch to an arms-free sleep sack.
## The takeaway
At 2 months, aim for wake windows of 60 to 90 minutes, 4 to 6 naps of any length, feeds on demand or about every 3 to 4 hours, and a bedtime between 6:30 and 8:00 PM. Expect short naps, fussy evenings and night feeds, keep every sleep safe, and stop swaddling at the first sign of rolling. Some days will look nothing like the sample, and that is normal.
[[CTA||Track naps, feeds and diapers free with MamaBee.]]
Sources: [AAP HealthyChildren: A Parent's Guide to Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Swaddling, Is It Safe?](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx), [AAP HealthyChildren: Getting Your Baby to Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx), [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx), [AAP HealthyChildren: Colic](https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Colic.aspx), [AAP HealthyChildren: Back to Sleep, Tummy to Play](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Back-to-Sleep-Tummy-to-Play.aspx), [AAP HealthyChildren: Fever, When to Call the Pediatrician](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [CDC: Important Milestones by 2 Months](https://www.cdc.gov/act-early/milestones/2-months.html), [CDC: Before, During, and After Shots](https://www.cdc.gov/vaccines-children/before-during-after-shots/index.html), [National Sleep Foundation: How Many Hours of Sleep Do You Really Need?](https://www.thensf.org/how-many-hours-of-sleep-do-you-really-need/)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('3-month-old-schedule',
    '3 Month Old Schedule: Sample Day for Naps, Feeds & Bedtime',
    'A sample 3 month old schedule with 4 to 5 naps, wake windows, feeds and bedtime, plus short naps, distracted feeding and the move out of the swaddle.',
    ['3 month old schedule', '3 month old sleep schedule', '3 month old feeding schedule', '3 month old nap schedule', '3 month old routine'],
    {
      glance: {
        caption: '3 month old schedule at a glance (typical ranges; every baby is different)',
        headers: ['At 3 months', 'Typical range'],
        rows: [
          ['Wake window', '75 to 105 minutes'],
          ['Naps', '4 to 5 a day; many last 30 to 45 minutes'],
          ['Day sleep', 'About 4 to 5 hours'],
          ['Night sleep', 'About 10 to 11 hours, often with 1 to 2 feeds'],
          ['Total sleep', 'About 14 to 16 hours in 24 hours'],
          ['Milk feeds', 'Breastfed: about 6 to 8 or more times a day. Formula: every 3 to 4 hours'],
          ['Amount per bottle (formula)', 'About 4 to 5 oz'],
          ['Solids', 'None yet. Breast milk or formula only until about 6 months'],
          ['Bedtime', 'Often between 6:30 and 8:00 PM'],
        ],
      },
      sample: {
        caption: 'Sample 3 month old schedule: 7:00 AM wake, 4 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, feed 1', 'Breastfeed or about 4 to 5 oz of formula. Open the curtains'],
          ['7:30 AM', 'Diaper, tummy time, play', 'Hold a toy where your baby can swing at it'],
          ['8:30 AM', 'Nap 1 (about 45 minutes)', 'After a 90-minute wake window'],
          ['9:15 AM', 'Wake up, diaper, play', ''],
          ['10:00 AM', 'Feed 2', 'About 3 hours after feed 1. A quiet room helps a distractible feeder'],
          ['10:45 AM', 'Nap 2 (about 1 hour 30 minutes)', 'After a 90-minute wake window. Often the longest nap'],
          ['12:15 PM', 'Wake up, diaper, play', 'A walk outside fits well here'],
          ['1:00 PM', 'Feed 3', ''],
          ['2:00 PM', 'Nap 3 (about 1 hour)', 'After a 105-minute wake window'],
          ['3:00 PM', 'Wake up, diaper, play', 'Floor time, songs, a board book'],
          ['4:00 PM', 'Feed 4', ''],
          ['4:45 PM', 'Nap 4 (about 45 minutes)', 'After a 105-minute wake window. Fine in the stroller or carrier'],
          ['5:30 PM', 'Wake up, calm play', 'Keep the last stretch low-key'],
          ['6:45 PM', 'Bedtime routine and feed 5', 'Bath if it is a bath night, pajamas, sleep sack, feed, a song'],
          ['7:15 PM', 'Bedtime', 'After a 105-minute wake window. Into the crib on their back'],
          ['Overnight', 'Often 1 to 2 feeds', 'Keep them dim, quiet and brief'],
        ],
      },
      shortnaps: {
        caption: 'Variation: short-nap day, 7:00 AM wake, 5 naps and an earlier bedtime',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, feed 1', ''],
          ['8:15 AM', 'Nap 1 (about 45 minutes)', 'After a 75-minute wake window. Short naps call for shorter windows'],
          ['9:00 AM', 'Wake up, play', ''],
          ['10:00 AM', 'Feed 2', ''],
          ['10:30 AM', 'Nap 2 (about 45 minutes)', 'After a 90-minute wake window'],
          ['11:15 AM', 'Wake up, play', ''],
          ['12:45 PM', 'Nap 3 (about 45 minutes)', 'After a 90-minute wake window. Try a contact or stroller nap to stretch it'],
          ['1:30 PM', 'Wake up, feed 3', ''],
          ['3:00 PM', 'Nap 4 (about 45 minutes)', 'After a 90-minute wake window'],
          ['3:45 PM', 'Wake up, play', ''],
          ['4:30 PM', 'Feed 4', ''],
          ['5:00 PM', 'Nap 5 (about 30 minutes)', 'After a 75-minute wake window. A catnap to bridge to bedtime'],
          ['5:30 PM', 'Wake up, calm play', ''],
          ['6:15 PM', 'Bedtime routine and feed 5', ''],
          ['6:45 PM', 'Bedtime', 'After a 75-minute wake window. Earlier, to make up for short naps'],
          ['Overnight', 'Often 1 to 2 feeds', ''],
        ],
      },
    },
`**A typical 3 month old schedule has 4 to 5 naps a day with wake windows of about 75 to 105 minutes, and many naps last only 30 to 45 minutes. Expect about 6 to 8 or more breastfeeds, or 4 to 5 ounces of formula every 3 to 4 hours, a bedtime between 6:30 and 8:00 PM, and often 1 to 2 night feeds.**
Three months is a turning point. Some babies start giving you a longer stretch at night, the evening crying of the newborn weeks is easing, and your baby is far more interested in the world. That interest has a cost: short naps and feeds interrupted by every sound in the room.
This is also the month to get ready for what comes next. Sleep starts changing around 4 months, and rolling attempts mean the swaddle may be on its way out. Below are two sample days with the times worked out, then what to expect with sleep, feeding and development, and what to do when the day does not go to plan.
[[TABLE:glance]]
## Sample 3 month old schedule
This day starts at 7:00 AM with four naps, wake windows of 90 to 105 minutes and five daytime feeds about 3 hours apart. Breastfed babies may nurse more often than this, and that is fine.
[[TABLE:sample]]
That adds up to about 4 hours of day sleep. Bedtime to wake-up is 11 hours 45 minutes, so after 1 to 2 night feeds many babies on this rhythm sleep about 11 hours at night, roughly 15 hours in total. That fits within the 14 to 17 hours the National Sleep Foundation recommends for babies 0 to 3 months.
On bottle amounts: six or seven feeds of 4 to 5 ounces can add up to more than the AAP's suggested average ceiling of about 32 ounces of formula a day. Many babies take less at some feeds. Let your baby's fullness cues lead.
### Variation: the short-nap day
Plenty of 3 month olds take only 30 to 45 minute naps. On those days, five naps with slightly shorter wake windows and an earlier bedtime usually work better than trying to stretch your baby to the next nap.
[[TABLE:shortnaps]]
Day sleep here is about 3½ hours, a little under the usual 4 to 5. That is why bedtime moves earlier, to 6:45 PM. One short-nap day is not a problem. If it happens most days, try the tips under short naps below.
## Sleep at 3 months
### Naps
Short naps are the classic 3-month complaint. A 30 to 45 minute nap is often one sleep cycle, and many babies cannot yet link one cycle to the next during the day. One longer nap, often late morning, is common. The others may stay short for a while.
Wake windows of 75 to 105 minutes are a good guide, but your baby's cues matter more. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains the cues, and you can enter your baby's wake-up time in our [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) for a starting plan, or use the [wake window calculator](/mamabee/tools/wake-window-calculator) for the next nap.
### Night sleep
Some babies now give one longer stretch at the start of the night, and the evening fussiness of the early weeks is fading: the AAP notes crying usually drops to 1 to 2 hours a day by 3 to 4 months. Others still wake every few hours. Both are normal, and 1 to 2 night feeds are common at this age. Do not judge your baby, or yourself, by whether they "sleep through." If longer nights are your goal, our guide on [how to get baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night) covers what helps.
Some families add a [dream feed](/mamabee/articles/dream-feed) before the parents' own bedtime to line up the baby's longest stretch with theirs. It works for some babies and not others.
### Getting ready for the 4-month sleep change
The AAP notes that babies do not have regular sleep cycles until about 4 months. As sleep matures, many babies go through the [4-month sleep regression](/mamabee/articles/4-month-sleep-regression), which can start anywhere from about 3 to 5 months. Early signs include more night waking, naps getting even shorter, and fighting sleep at bedtime.
You do not need to change much ahead of it. Two habits help: keep wake windows age-appropriate so your baby is not overtired, and give your baby some chances to fall asleep in the crib while drowsy. The AAP recommends putting babies down drowsy but awake from 4 months, and 3 months is a fine time to start practicing without pressure.
### A consistent bedtime routine
A short routine in the same order every night, such as diaper, pajamas or sleep sack, feed, a song, then into the crib, tells your baby that sleep is coming. It does not need to be long. Our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide has step-by-step versions.
### Safe sleep and the swaddle transition
Every sleep: on the back, on a firm, flat, separate surface, with nothing soft in the crib, and room-sharing without bed-sharing ideally for the first 6 months, as the AAP recommends. The AAP says to stop swaddling as soon as your baby shows signs of trying to roll. At 3 months, many babies are starting to. Move to an arms-free sleep sack, and avoid weighted sleep products entirely. Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) and [how to swaddle a baby](/mamabee/articles/how-to-swaddle-a-baby) explain the switch.
## Feeding at 3 months
### Breastfed babies
Many breastfed 3 month olds nurse about 6 to 8 or more times a day. Feeds often get faster as your baby gets more efficient, so a short feed can still be a full one. Watch the AAP's signs that your baby is getting enough: 6 or more wet diapers a day, contentment between feeds and steady weight gain. A [growth spurt](/mamabee/articles/baby-growth-spurts) can bring a few hungrier days.
### Formula-fed babies
Most 3 month olds take about 4 to 5 ounces every 3 to 4 hours. The AAP's rule of thumb is about 2½ ounces per pound of body weight per day, averaging no more than about 32 ounces. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a range for your baby's weight, and the [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows what comes next.
### Hunger cues and distracted feeding
The CDC lists early hunger cues as hands to the mouth, turning toward the breast or bottle, and smacking or licking lips. By 4 months, many babies open their mouth when they see the breast or bottle. Fullness looks like closing the mouth, turning away or getting easily distracted, which the AAP notes is often a sign a baby has finished.
### No water or solids yet
Breast milk or formula is all your baby needs for about the first 6 months, according to the CDC. If you are heading back to work, our guides to [introducing a bottle](/mamabee/articles/introducing-a-bottle-to-breastfed-baby) and the [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) can help you plan.
[[CTA||Log naps and feeds in one tap and spot the pattern with MamaBee.]]
## What's new at 3 months
Your baby is becoming much more social and much more physical. The CDC does not have a separate 3-month checklist. By 4 months, the CDC lists milestones such as:
- Smiles on their own to get your attention
- Makes cooing sounds like "oooo" and "aahh," and makes sounds back when you talk
- Turns their head toward the sound of your voice
- Holds their head steady without support when you hold them
- Brings hands to mouth and pushes up onto elbows or forearms on their tummy
At 3 months your baby is on the way to these, so do not expect all of them yet. Play ideas that fit:
- **Cooing conversations.** Talk, pause, and let your baby answer.
- **Tummy time with a target.** Put a toy or your face just in front so your baby pushes up to look. Our [tummy time guide](/mamabee/articles/tummy-time-guide) has positions to try.
- **Swipe and grab.** Hold a soft toy within reach so your baby can swing at it.
- **Mirror and faces.** A baby-safe mirror or photos of faces hold attention.
- **Read and sing** every day, even for a few minutes.
For more, see [baby milestones by month](/mamabee/articles/baby-milestones-by-month) and [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age).
## Common challenges at 3 months and what helps
### Naps that end at 30 to 45 minutes
Give your baby a few minutes before going in, since some fuss and resettle. A dark room helps. If one nap a day is long, protect that one and accept the rest as catnaps for now. Keep the next wake window on the shorter side after a short nap, and use an earlier bedtime on short-nap days.
### Distracted feeding
Suddenly your baby pops off the breast or bottle at every noise. Feed in a quiet, dim room, especially for the first feed of the day and the one before bed. Offer a feed when your baby wakes from a nap, before they are overtired. Short feeds are fine if wet diapers and weight are on track.
### Rolling attempts and the swaddle
If your baby rocks onto their side, kicks their legs over, or wriggles out of the swaddle, stop swaddling. Many families find the first few nights in a sleep sack are unsettled, then sleep comes back. Change one thing at a time, so keep the routine the same.
### Early signs of the 4-month sleep change
More night waking, shorter naps and a baby who fights bedtime can all start before 4 months. Keep the bedtime routine steady, protect wake windows, and know it is a normal stage of brain development. Our guide to [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) explains what comes after.
### Early waking
If your baby is up before 6:00 AM, keep that wake-up dim and quiet, feed, and try to settle them back down. If they are wide awake, start the day and shift naps earlier. Check that bedtime is not too late or the last wake window too long.
## How to adjust the schedule for your baby
- **Cues beat the clock.** If your baby shows sleepy cues at 75 minutes, put them down. If they are happy at 105, you can stretch a little.
- **4 naps or 5?** Short naps usually mean 5 naps. Longer naps usually mean 4. Let the length of the naps decide.
- **Anchor the morning.** A similar wake-up time each day makes naps more predictable.
- **Daycare or a caregiver?** Share your baby's wake windows, nap count and feed amounts. A rhythm that differs a little at daycare is normal.
- **Born early?** Ask your pediatrician whether to use adjusted age when comparing sleep and milestones.
Last month's rhythm is in the [2 month old schedule](/mamabee/articles/2-month-old-schedule). Next month, see the [4 month old schedule](/mamabee/articles/4-month-old-schedule) for the move toward fewer, longer naps.
## When to call your pediatrician
Call right away if your baby:
- Is still under 12 weeks and has a rectal temperature of 100.4°F (38°C) or higher (AAP)
- Has a fever and looks very ill, is unusually drowsy or very fussy, or has a fever lasting more than 24 hours. See our [baby fever guide](/mamabee/articles/baby-fever-what-to-do).
- Refuses feeds or is feeding much less than usual
- Has fewer than 6 wet diapers a day, a dry mouth or fewer tears, early dehydration signs listed by the AAP
- Cries in a new way or cannot be soothed
Also book a call if your baby has lost skills they had, or if as they near 4 months they are not doing items on the CDC's 4-month checklist. The CDC's advice is not to wait. Call 911 for trouble breathing, blue or gray lips, or a baby you cannot wake.
## How MamaBee can help
If you want to see whether short naps are a pattern or a bad day, a simple log helps. MamaBee is an iPhone baby tracker with no ads. Logging sleep, feeds (with left and right breastfeeding timers, bottles and pumping) and diapers is free, and the timeline and 7-day insights show average nap length and your baby's longest night stretch. Two caregivers can sync in real time. Sleep Coach, a Premium feature, predicts the next nap from your baby's wake windows. Paper works too. What matters is seeing the trend.
## Frequently asked questions
### How long should a 3 month old nap?
Many 3 month old naps last 30 to 45 minutes, often with one longer nap in the day. Across 4 to 5 naps, that adds up to about 4 to 5 hours of day sleep.
### How long should a 3 month old be awake between naps?
Most 3 month olds do well with wake windows of about 75 to 105 minutes. Use the shorter end after a short nap and first thing in the morning.
### What time should a 3 month old go to bed?
Bedtime usually falls between 6:30 and 8:00 PM. Move it earlier on days with short naps.
### How many ounces should a 3 month old drink?
Most formula-fed 3 month olds take about 4 to 5 ounces every 3 to 4 hours. The AAP suggests an average of no more than about 32 ounces of formula in 24 hours.
### Should I wake my 3 month old to eat?
During the day, offering a feed about every 3 hours keeps the day on track. At night, if your baby is gaining weight well and your pediatrician agrees, you usually do not need to wake them.
### Is it normal for a 3 month old to wake up at night?
Yes. One or two night feeds are common at 3 months, and some babies wake more often. Sleep patterns are still maturing, and night waking often increases for a while around 4 months.
## The takeaway
At 3 months, plan on 4 to 5 naps, wake windows of about 75 to 105 minutes, feeds every 3 to 4 hours or on demand, and a bedtime between 6:30 and 8:00 PM. Short naps and distracted feeds are normal at this age. Keep a steady bedtime routine, stop swaddling once rolling attempts start, and expect sleep to shift again around 4 months.
[[CTA||Track naps, feeds and diapers free with MamaBee.]]
Sources: [AAP HealthyChildren: A Parent's Guide to Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Swaddling, Is It Safe?](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx), [AAP HealthyChildren: Getting Your Baby to Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx), [AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx), [AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx), [AAP HealthyChildren: Colic](https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Colic.aspx), [AAP HealthyChildren: Fever, When to Call the Pediatrician](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [CDC: Important Milestones by 2 Months](https://www.cdc.gov/act-early/milestones/2-months.html), [CDC: Important Milestones by 4 Months](https://www.cdc.gov/act-early/milestones/4-months.html), [National Sleep Foundation: How Many Hours of Sleep Do You Really Need?](https://www.thensf.org/how-many-hours-of-sleep-do-you-really-need/)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  let coverFrom = null
  for (const id of COVER_FROM[a.slug] || []) {
    const src = await client.getDocument(id)
    if (src?.coverImage) { doc.coverImage = src.coverImage; coverFrom = id; break }
  }
  if (!DRY) await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  const faqs = (() => { const i = doc.body.findIndex((b) => b.style === 'h2' && b.children[0]?.text === 'Frequently asked questions'); let n = 0; for (let j = i + 1; j < doc.body.length && doc.body[j].style !== 'h2'; j++) if (doc.body[j].style === 'h3') n++; return n })()
  const links = doc.body.flatMap((b) => (b.markDefs || []).map((m) => m.href)).filter(Boolean)
  const internal = links.filter((h) => h.startsWith('/mamabee/'))
  const ok = w >= 1800 && w <= 2600 && a.title.length <= 60 && a.description.length >= 140 && a.description.length <= 155
  console.log(`${ok ? '✅' : '⚠️ '} ${DRY ? 'DRY' : 'draft'}: ${a.slug} (~${w} words, ${tables} tables, ${faqs} FAQs, ${internal.length} internal links, title ${a.title.length}c, desc ${a.description.length}c, cover from ${coverFrom || 'NONE'})`)
  if (DRY) console.log('   internal:', [...new Set(internal)].join(' '))
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
