// Week-15 MamaBee English sleep series, part A: the hub "baby-sleep-schedule-by-age" and
// the "1-month-old-schedule" article, as DRAFTS only (never published by this script).
// Numbers follow the series canonical sheet (wake windows, naps, feeds; matches our tools
// and the published 2-10 month articles) and every medical claim cites a source listed at
// the end of its article. Cover images are copied from a related published article.
// The hub links 11- and 12-month-old-schedule, which are written in parallel and publish together.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week15-en-a.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week15-en-a.mjs
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
  'baby-sleep-schedule-by-age': ['wake-windows-by-age', 'baby-bedtime-routine', 'newborn-sleep-schedule'],
  '1-month-old-schedule': ['newborn-sleep-schedule', '2-month-old-schedule', 'wake-windows-by-age'],
}

const SRC = {
  nsf: '[National Sleep Foundation: How Many Hours of Sleep Do You Really Need?](https://www.thensf.org/how-many-hours-of-sleep-do-you-really-need/)',
  aasm: '[AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/)',
  safe: "[AAP HealthyChildren: A Parent's Guide to Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx)",
  getsleep: '[AAP HealthyChildren: Getting Your Baby to Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx)',
  colic: '[AAP HealthyChildren: Colic](https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Colic.aspx)',
  sf: '[Sleep Foundation: Newborn Sleep Schedule](https://www.sleepfoundation.org/baby-sleep/newborn-sleep-schedule)',
  formula: '[AAP HealthyChildren: Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx)',
  cdcbf: '[CDC: How Much and How Often to Breastfeed](https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/how-much-and-how-often.html)',
  fever: '[AAP HealthyChildren: Fever, When to Call the Pediatrician](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx)',
  milk: '[CDC: Cow’s Milk and Milk Alternatives](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/cows-milk-and-milk-alternatives.html)',
  swaddle: '[AAP HealthyChildren: Swaddling, Is It Safe?](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx)',
  enough: '[AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx)',
  ms1: '[AAP HealthyChildren: Developmental Milestones, 1 Month](https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-1-Month.aspx)',
  cdc2: '[CDC: Important Milestones by 2 Months](https://www.cdc.gov/act-early/milestones/2-months.html)',
  tummy: '[AAP HealthyChildren: Back to Sleep, Tummy to Play](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Back-to-Sleep-Tummy-to-Play.aspx)',
  cries: "[AAP HealthyChildren: Responding to Your Baby's Cries](https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Responding-to-Your-Babys-Cries.aspx)",
  vitd: '[CDC: Vitamin D](https://www.cdc.gov/infant-toddler-nutrition/vitamins-minerals/vitamin-d.html)',
  dehyd: '[AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx)',
  ear: '[AAP HealthyChildren: Ear Infection Information](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx)',
  bf: '[AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)',
}
const sources = (...keys) => 'Sources: ' + keys.map((x) => { if (!SRC[x]) throw new Error('missing source ' + x); return SRC[x] }).join(', ')

const articles = [

  A('baby-sleep-schedule-by-age',
    'Baby Sleep Schedule by Age: Newborn to 12 Months Chart',
    'A baby sleep schedule by age chart from newborn to 12 months: wake windows, naps, day and night sleep and total hours, plus a full schedule for each month.',
    ['baby sleep schedule', 'baby sleep schedule by age', 'baby sleep chart', 'baby nap schedule by age', 'how much should a baby sleep'],
    {
      master: {
        caption: 'Baby sleep schedule by age, newborn to 12 months (typical ranges; every baby is different)',
        headers: ['Age', 'Wake window', 'Naps a day', 'Day sleep', 'Night sleep', 'Total sleep in 24 h'],
        rows: [
          ['Newborn (0 to 4 weeks)', '35 to 60 min', '6 to 8, short, around the clock', 'Spread about evenly between day and night', 'Often 1 to 2 hours at a time between feeds', '14 to 17 h (NSF)'],
          ['1 month', '35 to 60 min', '5 to 8', 'About 6 to 8 h', 'About 8 to 10 h, with 2 to 4 feeds', '14 to 17 h'],
          ['2 months', '60 to 90 min', '4 to 6', 'About 4 to 6 h', 'About 9 to 11 h, with 1 to 3 feeds', '14 to 17 h'],
          ['3 months', '75 to 105 min', '4 to 5', 'About 4 to 5 h', 'About 10 to 11 h, often 1 to 2 feeds', '14 to 16 h'],
          ['4 months', '90 to 120 min', '3 to 4', 'About 3 to 4 h', 'About 10 to 12 h, 0 to 2 feeds', '12 to 16 h (AASM)'],
          ['5 months', '2 to 2.5 h', '3', 'About 3 to 3.5 h', '10 to 12 h', '12 to 16 h'],
          ['6 months', '2 to 2.5 h, up to 3 h before bed', '3', 'About 3 h', '10 to 12 h', '12 to 16 h'],
          ['7 months', '2.5 to 3.5 h', '2 (some still 3)', 'About 2.5 to 3 h', '10 to 12 h', '12 to 16 h'],
          ['8 months', '2.75 to 3.5 h', '2', 'About 2.5 to 3 h', '10 to 12 h', '12 to 16 h'],
          ['9 months', '3 to 3.5 h', '2', 'About 2 to 3 h', '10 to 12 h', '12 to 16 h'],
          ['10 months', '3 to 4 h', '2', 'About 2 to 2.5 h', '10 to 12 h', '12 to 16 h'],
          ['11 months', '3 to 4 h', '2', 'About 2 to 2.5 h', '10 to 12 h', '12 to 16 h'],
          ['12 months', '3 to 4 h', '2 (most move to 1 later)', 'About 2 to 2.5 h', '10 to 12 h', '11 to 14 h (AASM, 1 to 2 years)'],
        ],
      },
      changes: {
        caption: 'Big sleep changes in the first year and what helps',
        headers: ['Around', 'What often changes', 'What helps'],
        rows: [
          ['6 weeks', 'Evening fussing peaks, at about 3 hours a day (AAP)', 'Motion, feeds on cue, a dim, calm evening, tag-teaming with another adult'],
          ['3 to 5 months', 'Sleep cycles mature; many babies wake more (the "4 month sleep regression"), and 4 naps become 3', 'Consistent bedtime routine, calm night wakes, wake windows of 90 to 120 min'],
          ['6 months', 'Rolling, sitting, first solids and teething can unsettle sleep', 'Plenty of floor time by day, a steady routine at night'],
          ['6 to 9 months', '3 naps become 2', 'Stretch wake windows slowly, use an earlier bedtime on short-nap days'],
          ['8 to 10 months', 'Crawling, pulling to stand and separation anxiety', 'Practice new skills by day, short calm check-ins at night'],
          ['11 to 13 months', 'Walking and pushback on naps', 'Keep 2 naps if your baby still needs them; most are not ready for 1 yet'],
          ['13 to 18 months', '2 naps become 1', 'Move the single nap toward midday, lean on an early bedtime'],
        ],
      },
    },
`**In a typical baby sleep schedule, newborns sleep 14 to 17 hours a day in short bursts, with wake windows of 35 to 60 minutes. By 6 months most babies take 3 naps with 2 to 2.5 hour windows. By 12 months most take 2 naps, stay awake 3 to 4 hours and sleep 10 to 12 hours a night.**
This guide puts the whole first year on one page. Start with the chart to see where your baby is now, then jump to the section for their age. Each one links to a full article with a sample day worked out minute by minute, feeding amounts and what to expect that month.
One promise up front: these are typical ranges, not targets. A baby who naps a little less or wakes a little more than the chart can be perfectly healthy. The goal is a rhythm that fits your baby and lets your family rest.
## Baby sleep schedule by age chart
[[TABLE:master]]
Where the numbers come from: total sleep follows the National Sleep Foundation for babies 0 to 3 months (14 to 17 hours) and the American Academy of Sleep Medicine (AASM) for 4 to 12 months (12 to 16 hours, naps included) and 1 to 2 years (11 to 14 hours). Wake windows and nap counts are the same ranges our [wake window calculator](/mamabee/tools/wake-window-calculator) and [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) use.
## How much sleep does a baby need?
In the first weeks, sleep is spread almost evenly between day and night, often in stretches of only 1 to 2 hours. The AAP notes that babies do not have regular sleep cycles until about 4 months of age, which is why early nights are so broken.
From about 4 months, sleep starts to gather into one long night and a few naps. Total sleep drops a little, to 12 to 16 hours, while night sleep grows to 10 to 12 hours and day sleep shrinks from 6 or more hours to about 2 to 3. By the first birthday, the AASM range is 11 to 14 hours.
Look at the whole 24 hours rather than one nap. A short nap followed by a longer one, or an early bedtime after a rough day, all counts.
## How long should a baby be awake between naps?
A wake window is the time your baby is awake between sleeps, feeds included. It grows from 35 to 60 minutes in the newborn weeks to 3 to 4 hours by 10 to 12 months. The first window of the day is usually the shortest, and the last one before bed the longest.
Watch your baby as well as the clock. Yawning, staring off, red eyebrows and fussing usually mean it is time to wind down. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains how to read those cues.
## How to build your baby's sleep schedule in 5 steps
- **Pick a wake-up time.** A steady start to the day makes everything after it more predictable. Many families use 6:00 to 7:30 AM.
- **Add the first wake window** for your baby's age from the chart. That gives you the first nap.
- **Let the nap run, then add the next window.** Repeat through the day. Shorter windows in the morning, longer ones later.
- **Place bedtime after the last window.** From about 2 months, many babies settle into a bedtime between 6:30 and 8:00 PM. After short naps, go earlier.
- **Review after a week.** If your baby fights every nap, try slightly longer windows. If they melt down before each nap, try shorter ones, 10 to 15 minutes at a time.
The [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) does this math for you: enter your baby's age and wake-up time and it suggests nap times and a bedtime.
## Sleep schedules month by month
Each section below is a short summary. Tap through for the full schedule, with two sample days, feeding amounts, milestones and when to call your pediatrician.
### Newborn (0 to 4 weeks)
Newborns eat and sleep around the clock, waking every 2 to 4 hours to feed. There is no real schedule yet, only a loop: feed, a little awake time, sleep. Day and night confusion is common. Bright, social days and dark, boring nights help it fade. See the [newborn sleep schedule](/mamabee/articles/newborn-sleep-schedule).
### 1 month
Still newborn-like, with wake windows of 35 to 60 minutes and 5 to 8 naps of any length. Evening cluster feeding and fussing often build toward a peak around 6 weeks. Some babies offer one slightly longer stretch after bedtime. See the [1 month old sleep schedule](/mamabee/articles/1-month-old-schedule).
### 2 months
Wake windows reach 60 to 90 minutes, with 4 to 6 naps, many of them short. Social smiles arrive, and so do the first big round of vaccines. Stop swaddling at the first sign of rolling. See the [2 month old sleep schedule](/mamabee/articles/2-month-old-schedule).
### 3 months
Windows of 75 to 105 minutes and 4 to 5 naps. Nights often hold one longer stretch, though many babies still feed once or twice. Sleep changes linked to the "4 month" regression can start this early. See the [3 month old sleep schedule](/mamabee/articles/3-month-old-schedule).
### 4 months
Sleep cycles mature, and many babies wake more for a few weeks. Windows of 90 to 120 minutes, and 4 naps turning into 3. See the [4 month old sleep schedule](/mamabee/articles/4-month-old-schedule) and the [4 month sleep regression](/mamabee/articles/4-month-sleep-regression).
### 5 months
Usually 3 naps with 2 to 2.5 hour windows and about 3 to 3.5 hours of day sleep. A more predictable bedtime routine starts to pay off. See the [5 month old sleep schedule](/mamabee/articles/5-month-old-schedule).
### 6 months
Three naps, the last often a short catnap, and first solids fitted between milk feeds. Rolling, sitting and teething can stir up nights. See the [6 month old sleep schedule](/mamabee/articles/6-month-old-schedule) and the [6 month sleep regression](/mamabee/articles/6-month-sleep-regression).
### 7 months
The month many babies move from 3 naps to 2, with mixed days in between. Wake windows stretch to 2.5 to 3.5 hours. See the [7 month old sleep schedule](/mamabee/articles/7-month-old-schedule).
### 8 months
Two naps for most babies and windows of 2.75 to 3.5 hours. Crawling and separation anxiety can bring night waking back. See the [8 month old sleep schedule](/mamabee/articles/8-month-old-schedule) and the [8 month sleep regression](/mamabee/articles/8-month-sleep-regression).
### 9 months
Two naps, windows of 3 to 3.5 hours, 3 meals a day and fewer milk feeds. Pulling to stand in the crib is common. See the [9 month old sleep schedule](/mamabee/articles/9-month-old-schedule).
### 10 months
Windows of 3 to 4 hours, 2 naps of about 2 to 2.5 hours in total, and more finger foods. See the [10 month old sleep schedule](/mamabee/articles/10-month-old-schedule).
### 11 months
A steady two-nap day with 3 to 4 hour windows. Early wake-ups and nap refusals can tempt parents to drop to one nap, but most babies still need two. See the [11 month old sleep schedule](/mamabee/articles/11-month-old-schedule).
### 12 months
Most first birthdays still have 2 naps, and the move to 1 nap usually comes later, often between 13 and 18 months. This is also when many families start whole cow's milk, which the CDC says can begin at 12 months but not before. See the [12 month old sleep schedule](/mamabee/articles/12-month-old-schedule).
## When do babies drop naps?
Nap counts fall as wake windows grow. A rough timeline from our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide:
- **4 naps to 3:** around 3 to 4 months
- **3 naps to 2:** around 6 to 9 months, most often 6 to 8
- **2 naps to 1:** around 13 to 18 months
The signs are similar each time: fighting a nap that used to be easy for 1 to 2 weeks, shorter naps, a later and harder bedtime, and a baby who stays cheerful on less day sleep. Expect a messy in-between phase, and use an earlier bedtime as a bridge.
## Sleep regressions and other big changes
"Sleep regression" is a popular term, not a medical diagnosis. It describes a few weeks of worse sleep that often lines up with new skills, separation anxiety, teething, illness or a nap change. The table shows when these bumps tend to show up.
[[TABLE:changes]]
Our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide covers each one, and the [18 month sleep regression](/mamabee/articles/18-month-sleep-regression) article looks at the toddler years. If a rough patch comes with fever, ear pulling or a baby who seems unwell, call your pediatrician rather than waiting it out.
## What time should a baby go to bed?
In the first weeks, many babies have no clear bedtime, and the "night" often starts after a late evening feed. From about 2 months, bedtimes often settle between 6:30 and 8:00 PM, and that range holds through the first birthday.
An earlier bedtime is often the easiest fix for a rough day. If naps were short, moving bedtime 30 minutes earlier helps prevent the overtired "second wind." A short, predictable routine, such as bath or wash, pajamas, feed, book and song, helps your baby know what comes next. See our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide.
## Night feeds and sleeping through the night
There is no single age when babies "sleep through the night." Some babies give a long stretch by 4 to 6 months, and many still wake in the first year, which is normal. Night feeds are expected early on. The CDC says breastfed babies feed about 8 to 12 times in 24 hours in the first weeks and months, and the AAP notes that most formula-fed babies no longer need a middle-of-the-night feed somewhere between 2 and 4 months. Ask your pediatrician what fits your baby's growth.
When you are ready to work on nights, see [how to get your baby to sleep through the night](/mamabee/articles/how-to-get-baby-to-sleep-through-the-night), the [dream feed](/mamabee/articles/dream-feed) and [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods). Our [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how feeds change through the year.
## Safe sleep at every age
The AAP's safe sleep basics apply to every nap and every night until your baby's first birthday:
- **Back to sleep,** every time. Once your baby rolls both ways on their own, you do not need to turn them back.
- **A firm, flat, separate surface** with only a fitted sheet. Surfaces inclined more than 10 degrees are not safe for sleep.
- **Share a room, not a bed,** for at least the first 6 months.
- **Nothing soft in the crib:** no pillows, blankets, bumpers or toys.
- **Move your baby to a flat surface** as soon as possible if they fall asleep in a car seat, stroller, swing or sling.
- **Stop swaddling** as soon as your baby shows signs of trying to roll, and never use weighted swaddles or sleep sacks.
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) covers the full list, including [how to dress your baby for sleep](/mamabee/articles/dressing-baby-for-sleep).
## When to call your pediatrician
A sleep schedule is not a medical test, but some signs need a call:
- A temperature of 100.4°F (38°C) or higher in a baby younger than 3 months, or a fever with a baby who looks very ill, is unusually drowsy or very fussy
- A baby who is hard to wake for feeds, feeds much less than usual or has fewer wet diapers
- Snoring with pauses in breathing, or noisy, labored breathing during sleep
- Night waking with fever, ear pain that seems worse lying down, or fluid draining from the ear, which can point to an ear infection. The AAP notes that ear tugging alone is common and not a reliable sign
- A rough patch that lasts much longer than a few weeks, or anything that worries you
Call 911 for trouble breathing, blue or gray lips, or a baby you cannot wake. Our [baby fever guide](/mamabee/articles/baby-fever-what-to-do) has more on temperatures.
## Frequently asked questions
### What is a good sleep schedule for a baby?
A good schedule follows your baby's age-appropriate wake windows, starts the day at a steady time and ends with a bedtime between about 6:30 and 8:00 PM from 2 months on. Use the chart as a starting point and adjust to your baby's cues.
### How many hours should a baby sleep by age?
About 14 to 17 hours a day from birth to 3 months (National Sleep Foundation), 12 to 16 hours from 4 to 12 months, and 11 to 14 hours from 1 to 2 years (AASM), naps included.
### How many naps should a baby take?
Newborns take 6 to 8 short naps, 3 to 4 month olds about 4, 5 and 6 month olds about 3, and most babies from 7 or 8 months to their first birthday take 2.
### When do babies go to 2 naps?
Most babies move from 3 naps to 2 between 6 and 9 months, often around 7 months. Signs include fighting the third nap most days and the third nap pushing bedtime past 8 PM.
### When do babies go to 1 nap?
Usually between 13 and 18 months. Most 12 month olds still need 2 naps, so wait for 1 to 2 weeks of clear signs before switching.
### Should I follow a strict clock schedule or wake windows?
Under about 6 months, wake windows and sleepy cues work better than fixed clock times. Older babies often settle into similar times each day, but cues still come first.
## The takeaway
Across the first year, wake windows grow from under an hour to 3 to 4 hours, naps fall from many to 2, and sleep gathers from scattered bursts into a long night. Use the chart to find your baby's age, read that month's full schedule, and give every change a week or two to settle. Off days are part of it.
## How MamaBee helps
Schedules are easiest to follow when you can see what actually happened today. MamaBee is a calm iPhone baby tracker with no ads, built by a small team at Realm Labs for exactly this.
- **One-thumb logging, free:** sleep, breastfeeds with left and right timers, bottles, pumping, diapers and more, even in the dark at 3 AM.
- **See the rhythm:** a timeline and 7-day insights show how naps and nights are trending, so you know when it is time to stretch a wake window or drop a nap.
- **Both parents in sync:** free real-time sharing for 2 caregivers, so whoever is on duty knows when your baby last slept and ate.
- **Ready for checkups:** export a pediatrician PDF, and track growth on WHO percentiles and 45+ CDC milestones.
[[CTA||Stop doing nap math in your head. Track sleep free with MamaBee.]]
When you want more help, MamaBee Premium adds Sleep Coach, which predicts your baby's next nap from their own logged sleep, and unlimited Bee AI, an assistant that knows your log and can answer "is this normal?" questions at any hour. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold.
[[CTA||Know when the next nap is coming. Try MamaBee on iPhone today.]]
${sources('nsf', 'aasm', 'getsleep', 'sf', 'safe', 'swaddle', 'colic', 'cdcbf', 'formula', 'milk', 'fever', 'ear')}
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('1-month-old-schedule',
    '1 Month Old Sleep Schedule: Sample Day, Naps & Feeds',
    'A 1 month old sleep schedule with 35 to 60 minute wake windows, 5 to 8 naps, feeds every 2 to 4 hours and a sample day, plus when to call the doctor.',
    ['1 month old sleep schedule', '1 month old schedule', '1 month old feeding schedule', '1 month old nap schedule', '4 week old sleep schedule'],
    {
      glance: {
        caption: '1 month old sleep schedule at a glance (typical ranges; every baby is different)',
        headers: ['At 1 month', 'Typical range'],
        rows: [
          ['Wake window', '35 to 60 minutes, including the feed; the first of the day is often the shortest'],
          ['Naps', '5 to 8 a day, from 20-minute catnaps to 2-hour stretches'],
          ['Day sleep', 'About 6 to 8 hours in total'],
          ['Night sleep', 'About 8 to 10 hours, broken by 2 to 4 feeds'],
          ['Total sleep', 'About 14 to 17 hours in 24 hours (National Sleep Foundation, 0 to 3 months)'],
          ['Breastfeeding', '8 to 12 times in 24 hours, about every 2 to 4 hours (CDC); cluster feeds are common'],
          ['Formula', 'About 3 to 4 oz every 3 to 4 hours by the end of the first month; no more than about 32 oz a day (AAP)'],
          ['Water and solids', 'None. Breast milk or formula only until about 6 months (CDC)'],
          ['Vitamin D', '400 IU a day for breastfed and partly breastfed babies (CDC)'],
          ['Bedtime', 'Not fixed yet for many babies; 7:00 to 8:00 PM works as a goal, and later is normal for now'],
        ],
      },
      sample: {
        caption: 'Sample 1 month old sleep schedule: 7:00 AM wake, 5 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, feed 1', 'Breastfeed or about 3 to 4 oz of formula. Open the curtains so the day feels like day'],
          ['7:20 AM', 'Diaper, cuddles, a few minutes of tummy time', '3 to 5 minutes is plenty at this age (AAP)'],
          ['7:50 AM', 'Nap 1 (about 1 hour 40 minutes)', 'Wake window: 50 minutes'],
          ['9:30 AM', 'Wake up, feed 2', 'Diaper, then face-to-face time'],
          ['10:25 AM', 'Nap 2 (about 1 hour 45 minutes)', 'Wake window: 55 minutes'],
          ['12:10 PM', 'Wake up, feed 3', 'A short walk outside is a nice change of scene'],
          ['1:10 PM', 'Nap 3 (about 1 hour 35 minutes)', 'Wake window: 60 minutes'],
          ['2:45 PM', 'Wake up, feed 4', 'High-contrast pictures or your face 8 to 12 inches away'],
          ['3:35 PM', 'Nap 4 (about 1 hour 10 minutes)', 'Wake window: 50 minutes'],
          ['4:45 PM', 'Wake up, feed 5', 'Fussiness often builds from late afternoon'],
          ['5:30 PM', 'Nap 5: catnap (about 30 minutes)', 'Wake window: 45 minutes. A carrier, stroller or contact nap is fine'],
          ['6:00 PM', 'Wake up, feed 6', 'Evening cluster feeding often starts here: several short feeds close together'],
          ['6:40 PM', 'Bedtime routine', 'Diaper, swaddle or sleep sack, lights low, a quiet song'],
          ['7:00 PM', 'Down for the night', 'Wake window: 60 minutes. On the back, in their own crib or bassinet'],
          ['Overnight', '2 to 4 feeds, for example around 10 PM, 1 AM and 4 AM', 'Dim light, quiet voice, change the diaper only if needed'],
        ],
      },
      early: {
        caption: 'Variation: 6:00 AM early riser, breastfed on demand, 6 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['6:00 AM', 'Wake up, nurse', 'Start the day here if your baby is wide awake'],
          ['6:45 AM', 'Nap 1 (about 45 minutes)', 'Wake window: 45 minutes'],
          ['7:30 AM', 'Wake up, nurse', ''],
          ['8:20 AM', 'Nap 2 (about 1 hour 30 minutes)', 'Wake window: 50 minutes'],
          ['9:50 AM', 'Wake up, nurse, tummy time', ''],
          ['10:45 AM', 'Nap 3 (about 2 hours)', 'Wake window: 55 minutes. A contact nap or carrier nap counts'],
          ['12:45 PM', 'Wake up, nurse', ''],
          ['1:45 PM', 'Nap 4 (about 1 hour 15 minutes)', 'Wake window: 60 minutes'],
          ['3:00 PM', 'Wake up, nurse', ''],
          ['3:50 PM', 'Nap 5 (about 45 minutes)', 'Wake window: 50 minutes'],
          ['4:35 PM', 'Wake up, nurse', 'Cluster feeding often starts around here'],
          ['5:20 PM', 'Nap 6: catnap (about 30 minutes)', 'Wake window: 45 minutes. In arms or a carrier is fine'],
          ['5:50 PM', 'Wake up, nurse', ''],
          ['6:30 PM', 'Top-up nurse in a dim room, bedtime routine', 'Part of the evening cluster'],
          ['6:50 PM', 'Down for the night', 'Wake window: 60 minutes'],
          ['Overnight', '2 to 4 feeds', 'Common for a breastfed 1 month old'],
        ],
      },
    },
`**A typical 1 month old sleep schedule is still newborn-like: wake windows of 35 to 60 minutes, 5 to 8 naps and about 14 to 17 hours of sleep in 24 hours. Breastfed babies feed 8 to 12 times a day, formula-fed babies take about 3 to 4 ounces every 3 to 4 hours, and night feeds are normal.**
At one month, your baby is a little more awake and a lot more alert, and may fuss more in the evenings. Sleep is still scattered and nights are broken. That is exactly how it should be.
If you are in the very first weeks, our [newborn sleep schedule](/mamabee/articles/newborn-sleep-schedule) covers that stage. This article zooms in on weeks 4 to 8 with a sample day worked out minute by minute, so you have something concrete to lean on. Next month's [2 month old sleep schedule](/mamabee/articles/2-month-old-schedule) shows where things are heading.
## 1 month old sleep schedule at a glance
[[TABLE:glance]]
The National Sleep Foundation recommends 14 to 17 hours of sleep in 24 hours for babies 0 to 3 months, and the AAP notes that newborns may only sleep 1 or 2 hours at a time.
## Sample 1 month old sleep schedule
This day starts at 7:00 AM, uses wake windows of 45 to 60 minutes and has five naps. Feeds come at each wake-up, about 2 to 3 hours apart, which is a typical breastfed rhythm. Formula-fed babies often go a little longer, closer to 3 to 4 hours, and may skip one of these daytime feeds.
[[TABLE:sample]]
That adds up to about 6 hours 40 minutes of day sleep. Bedtime to wake-up is 12 hours. With 3 night feeds of 30 to 45 minutes each, plus some settling, that is roughly 9 to 10 hours of night sleep and about 16 hours in total, inside the 14 to 17 hours recommended for this age.
A note on bottles: nine feeds of 4 ounces would add up to 36 ounces. The AAP says formula intake should average no more than about 32 ounces in 24 hours, so it is normal for some feeds, especially overnight, to be smaller. Let your baby stop when they show they are full.
### Variation: the 6:00 AM early riser, breastfed on demand
Many 1 month olds have days like this one: an earlier start, six naps of mixed length and nursing at almost every wake-up, with a cluster of feeds in the evening.
[[TABLE:early]]
Day sleep is about 6 hours 45 minutes, and bedtime is 6:50 PM. Counting 3 night feeds, that is about 11 nursing sessions in 24 hours, inside the 8 to 12 the CDC describes for breastfed babies.
## How much should a 1 month old sleep?
### Naps
Most 1 month olds nap 5 to 8 times a day for a total of about 6 to 8 hours. Some naps last 20 minutes, others 2 hours, and the pattern changes from day to day. The timing of the next nap matters more than the length of the last one.
Wake windows of 35 to 60 minutes include the feed, the diaper change and a little play. That goes fast. Watch for sleepy cues: yawning, staring off, red eyebrows, turning away from faces and fussing. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains how to read them, and the [wake window calculator](/mamabee/tools/wake-window-calculator) tells you when the next nap is due.
Contact naps, carrier naps and stroller naps all count. If your baby only sleeps on you right now, that is common and fine. Our guide to [contact naps and independent sleep](/mamabee/articles/contact-naps-and-independent-sleep) explains how to ease toward the crib later.
### Night sleep
Expect about 8 to 10 hours of night sleep, broken by 2 to 4 feeds. The AAP notes that babies do not have regular sleep cycles until about 4 months of age, so frequent waking is normal. The Sleep Foundation says sleep in the first couple of months is often split fairly evenly between day and night, and that it starts to consolidate around 2 months.
Some 1 month olds start to give one longer stretch, often right after bedtime. If it comes, enjoy it.
### Day and night confusion
Many babies arrive with days and nights mixed up. To nudge the body clock:
- **Make days bright and social.** Open the curtains, talk, sing and feed near a window.
- **Make nights boring.** Low light, a quiet voice, little eye contact and straight back to sleep after feeds. The AAP suggests not stimulating or waking babies when you feed or change them at night.
### Safe sleep at 1 month
The AAP's safe sleep basics apply to every nap and every night:
- **Back to sleep,** every time.
- **A firm, flat, separate surface** with only a fitted sheet. Nothing inclined more than 10 degrees, and no pillows, blankets, bumpers or toys.
- **Share a room, not a bed,** for at least the first 6 months.
- **Never sleep with your baby on a couch or armchair.** The AAP says the risk is up to 67 times higher.
- **Move your baby to a flat surface** as soon as possible if they fall asleep in a car seat, swing or sling.
- **Swaddle safely.** Leave room for the hips to bend up and out, never use a weighted swaddle, and stop as soon as your baby shows any sign of trying to roll.
- **No hat indoors,** and dress your baby in about one layer more than you would wear.
- **A pacifier at sleep time** can lower SIDS risk. If you breastfeed, the AAP suggests waiting until feeding is well established.
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines), [how to swaddle a baby](/mamabee/articles/how-to-swaddle-a-baby) and [dressing your baby for sleep](/mamabee/articles/dressing-baby-for-sleep) cover the details.
## 1 month old feeding schedule
### Breastfed babies
Feed on cue. The CDC says most exclusively breastfed babies feed every 2 to 4 hours, about 8 to 12 times in 24 hours, and some feed as often as every hour at times, which is called cluster feeding. Evening clusters and hungry days during a growth spurt are both common. See [cluster feeding](/mamabee/articles/cluster-feeding) and [baby growth spurts](/mamabee/articles/baby-growth-spurts).
You cannot measure ounces at the breast, so the AAP points to other signs: 6 or more wet diapers a day with pale or nearly clear pee, a baby who seems satisfied for 1 to 3 hours between feeds, and steady weight gain at checkups. Our guide to [how many wet diapers a newborn should have](/mamabee/articles/how-many-wet-diapers-newborn) has the details.
### Formula-fed babies
The AAP says that by the end of the first month, most formula-fed babies take at least 3 to 4 ounces per feed, about every 3 to 4 hours. A rule of thumb is about 2½ ounces a day for every pound of body weight, up to an average of about 32 ounces. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) estimates a range for your baby's weight, and [how much should a newborn eat](/mamabee/articles/how-much-should-a-newborn-eat) explains hunger cues.
### Should I wake my 1 month old to feed?
Sometimes. The AAP advises waking a formula-fed baby to offer a bottle if they sleep longer than 4 to 5 hours in the first few weeks, and the CDC notes you may need to wake a breastfed baby to feed. Once your baby is gaining well, your pediatrician may say you can let them sleep. Ask at the 1-month visit.
### Vitamin D, water and solids
The CDC recommends 400 IU of vitamin D every day for breastfed and partly breastfed babies, starting soon after birth. Babies who drink 32 ounces or more of formula a day do not need a supplement. No water, juice or solids yet: breast milk or formula only until about 6 months.
## What's new at 1 month
### Development
The AAP describes a 1 month old as a baby who:
- Focuses on things 8 to 12 inches away, about the distance to your face during a feed
- Prefers faces and high-contrast black-and-white patterns
- Has fully mature hearing and may turn toward familiar voices
- Keeps hands in tight fists and brings them toward the mouth
The CDC's first milestone checklist is at 2 months. By then, most babies smile when you talk to them, calm down when picked up, look at your face and hold their head up during tummy time. See [baby milestones by month](/mamabee/articles/baby-milestones-by-month).
### Tummy time
The AAP says you can start tummy time from the day your baby comes home: 3 to 5 minutes, 2 to 3 times a day, working up to 15 to 30 minutes a day by 7 weeks. See our [tummy time guide](/mamabee/articles/tummy-time-guide).
### Crying and the fussy evening
The AAP says newborns routinely cry 1 to 4 hours a day, and regular fussing usually peaks at about 3 hours a day around 6 weeks, then eases to 1 to 2 hours a day by 3 to 4 months. You cannot spoil a young baby by responding. If crying is intense and goes on for hours, see [colic in babies](/mamabee/articles/colic-in-babies) and the [newborn witching hour](/mamabee/articles/newborn-witching-hour).
### The 1-month checkup
The AAP's Bright Futures schedule includes a visit by 1 month. Expect weight, length and head size, questions about feeding and sleep, and a short parent depression screening, which is routine. Our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) covers what to bring.
## Common challenges at 1 month and what helps
### My baby only sleeps when held
Very common. Try the transfer once your baby's arms go floppy, often 15 to 20 minutes in. If it fails, a contact nap is fine while you stay awake, but never on a couch or armchair where you might doze off.
### Short naps
A 20 to 40 minute nap is often one sleep cycle. If your baby wakes happy, the nap is over. Keep the next wake window on the shorter side so short naps do not stack into an overtired evening.
### Evening cluster feeding
Several feeds close together from late afternoon is normal. Set up a comfy spot with water and snacks, and let another adult handle everything else. If gas seems to add to the fussing, see [newborn gas relief](/mamabee/articles/newborn-gas-relief).
### You are running on empty
Split the night if you can. One parent takes the first half, the other the second, so each gets one longer block. Our [newborn night shifts](/mamabee/articles/newborn-night-shifts) guide has templates. If crying ever pushes you to your limit, the AAP says to set your baby down in a safe place, like the crib, and get help from a family member or friend. Never shake a baby.
## How to adjust the schedule for your baby
- **Cues before the clock.** If your baby is yawning at 40 minutes, start winding down.
- **Anchor the morning.** A similar wake-up time each day makes the rest of the day easier to predict.
- **Early riser?** Shift everything earlier, as in the 6:00 AM version.
- **Born early?** Ask your pediatrician whether to use your baby's adjusted age for sleep and milestones.
## When to call your pediatrician
Call right away if your 1 month old:
- Has a temperature of 100.4°F (38°C) or higher. For babies younger than 3 months, the AAP says to call at this level. See our [baby fever guide](/mamabee/articles/baby-fever-what-to-do).
- Is unusually sleepy, hard to wake for feeds or floppy
- Refuses several feeds in a row, or feeds much less than usual
- Has fewer than 6 wet diapers a day, a dry mouth or a sunken soft spot, which can be signs of dehydration
- Cries in a way that sounds different, or cannot be soothed for hours
- Vomits forcefully, or has blood in their stool
Call 911 for trouble breathing, blue or gray lips, or a baby you cannot wake. And call your own doctor if you feel low, anxious or overwhelmed most days. See [postpartum recovery and mental health](/mamabee/articles/postpartum-recovery-mental-health).
## Frequently asked questions
### How long should a 1 month old be awake?
About 35 to 60 minutes at a time, including the feed. The first wake window of the day is often the shortest, and many babies are ready to sleep again within an hour.
### How many naps should a 1 month old take?
Usually 5 to 8 naps a day, adding up to about 6 to 8 hours of day sleep. Naps of 20 minutes to 2 hours are all normal.
### How many hours should a 1 month old sleep?
About 14 to 17 hours in 24 hours, according to the National Sleep Foundation, split fairly evenly between day and night.
### How often should a 1 month old eat?
Breastfed babies feed about 8 to 12 times in 24 hours, every 2 to 4 hours. Formula-fed babies typically take 3 to 4 ounces about every 3 to 4 hours by the end of the first month.
### What time should a 1 month old go to bed?
Many 1 month olds do not have a fixed bedtime yet. Aim for a calm, dim evening and a goal of about 7:00 to 8:00 PM, and expect bedtime to settle over the next few weeks.
### Is it normal for a 1 month old to wake every 2 to 3 hours at night?
Yes. Babies this young need frequent feeds and do not have regular sleep cycles until about 4 months. Ask your pediatrician if you are unsure about weight gain.
## The takeaway
At 1 month, think rhythm, not timetable: wake windows of 35 to 60 minutes, 5 to 8 naps, feeds every 2 to 4 hours and 2 to 4 night feeds. Make days bright and nights dull, keep every sleep safe, and expect fussy evenings that peak around 6 weeks before easing. It does get easier, and you are doing better than you feel.
## How MamaBee helps
At 3 AM, nobody remembers when the last feed started or which side it was. MamaBee is a calm iPhone baby tracker with no ads, made by a small team at Realm Labs to carry that mental load for you.
- **One-thumb logging, free:** sleep, breastfeeds with left and right timers, bottles, pumping and diapers, all easy to tap in the dark.
- **See the last nap and feed at a glance** on the timeline, so you can time the next wake window without doing math at 3 AM.
- **Timeline and 7-day insights** show how naps, nights and feeds are trending, so the fog starts to make sense.
- **Free real-time sync for 2 caregivers,** so whoever takes the night shift knows exactly what happened before.
- **Pediatrician PDF export** for the 1-month and 2-month checkups.
[[CTA||Make the night shift easier. Log feeds and naps free with MamaBee.]]
MamaBee Premium adds Sleep Coach, which predicts the next nap from your baby's own logged sleep, and unlimited Bee AI, an assistant that knows your log and can answer "is this normal?" at any hour. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold.
[[CTA||Get gentle answers at 3 AM. Try MamaBee on iPhone.]]
${sources('nsf', 'getsleep', 'sf', 'safe', 'swaddle', 'cdcbf', 'enough', 'formula', 'vitd', 'ms1', 'cdc2', 'tummy', 'colic', 'cries', 'bf', 'fever', 'dehyd')}
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
