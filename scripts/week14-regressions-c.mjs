// Week-14 MamaBee sleep regression series, part C: 6 month and 18 month sleep regressions
// as DRAFTS only (never published by this script). Numbers follow the series canonical
// sheet (wake windows, naps, feeds) and every medical claim cites a source listed at the
// end of its article. Cover images are copied from a related published article.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week14-regressions-c.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week14-regressions-c.mjs
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
  '6-month-sleep-regression': ['6-month-old-schedule', 'when-to-start-solids', 'baby-teething-symptoms'],
  '18-month-sleep-regression': ['baby-bedtime-routine', 'baby-separation-anxiety', 'baby-sleep-training-methods'],
}

const articles = [

  A('6-month-sleep-regression',
    '6 Month Sleep Regression: Signs, How Long & What Helps',
    'Is the 6 month sleep regression real? What disrupts sleep at 6 months, how long it lasts, a sample 3-nap day and calm fixes for nights, naps and bedtime.',
    ['6 month sleep regression', '6 month old sleep regression', '6 month old waking at night', '6 month old sleep', 'baby sleep regression'],
    {
      glance: {
        caption: '6 month sleep regression at a glance',
        headers: ['What', 'At 6 months'],
        rows: [
          ['Is it a classic regression?', 'Not usually. Many experts do not list 6 months, and the Sleep Foundation says many babies do not have one'],
          ['When it happens', 'Around 6 months, often alongside new skills, first solids or first teeth'],
          ['Common signs', 'More night waking, short or skipped naps, fussing at bedtime, rolling or sitting up in the crib, extra clinginess'],
          ['Typical causes', 'Rolling and sitting, starting solids, teething, early separation awareness, longer wake windows, nap changes'],
          ['How long', 'Usually a few days or weeks (Sleep Foundation)'],
          ['What helps', 'Daytime skill practice, wake windows of about 2 to 2.5 hours, a steady bedtime routine, calm night responses, teething comfort'],
          ['Sleep needed', '12 to 16 hours in 24 hours, naps included (AASM, 4 to 12 months)'],
        ],
      },
      causes: {
        caption: 'What often disrupts sleep around 6 months',
        headers: ['Disruptor', 'What you might notice', 'What helps'],
        rows: [
          ['Rolling', 'Rolls onto the tummy in the crib and protests', 'Floor practice rolling both ways. If your baby rolls both ways comfortably, the AAP says you do not need to turn them back'],
          ['Sitting', 'Sits up in the crib and cannot get back down', 'Practice sitting to lying on the floor. Lower the crib mattress before your baby can sit (AAP)'],
          ['Starting solids', 'A new routine, firmer or smellier poop, a gassy evening', 'One new food at a time, 3 to 5 days apart (CDC), offered earlier in the day'],
          ['Teething', 'Drooling, chewing, fussing, harder to settle', 'A cold teether or chilled washcloth, gentle gum massage'],
          ['Separation awareness', 'Cries when you leave, wants you at night', 'Short, predictable goodbyes and brief, calm check-ins'],
          ['Longer wake windows', 'Fights naps or bedtime, or wakes early', 'Wake windows of about 2 to 2.5 hours, about 3 before bed'],
          ['Night feeds', 'Wakes and seems hungry', 'Feed calmly if hungry; ask your pediatrician whether a night feed is still needed'],
        ],
      },
      sample: {
        caption: 'Sample 6 month old sleep schedule: 7:00 AM wake, 3 naps',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up, milk feed', 'Start the day at about the same time, even after a rough night'],
          ['8:00 AM', 'Solids: meal 1 (if started)', 'A good slot for trying a new food'],
          ['9:15 AM', 'Nap 1 (about 1 hr 15 min)', 'Wake window: 2 hr 15 min'],
          ['10:30 AM', 'Wake up, milk feed', 'Floor time: rolling, reaching, supported sitting'],
          ['12:45 PM', 'Nap 2 (about 1 hr 30 min)', 'Wake window: 2 hr 15 min'],
          ['2:15 PM', 'Wake up, milk feed', 'A walk, books, play'],
          ['4:45 PM', 'Nap 3: short catnap (about 30 min)', 'Wake window: 2 hr 30 min. A stroller or carrier nap is fine'],
          ['5:15 PM', 'Wake up', 'Last wake window of the day'],
          ['5:45 PM', 'Solids: meal 2 (once on two meals)', 'Familiar foods are best in the evening'],
          ['7:00 PM', 'Bedtime routine and milk feed', 'Same steps in the same order every night'],
          ['7:45 PM', 'Asleep for the night', 'Wake window: 2 hr 30 min. Move bedtime earlier after short naps'],
        ],
      },
    },
`**Six months is not usually considered a classic sleep regression, but many babies do sleep worse around this age. The usual reasons are new skills like rolling and sitting, starting solids, first teeth, early separation awareness and wake windows that are getting longer. It usually passes within a few days or weeks. Wake windows of about 2 to 2.5 hours, a steady bedtime routine and plenty of daytime practice help most babies.**
If your baby is suddenly up at night again, you have not undone anything. This guide covers what is really going on at 6 months, how long it tends to last and what you can do tonight. For a quick overview of every age, see our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide.
## 6 month sleep regression at a glance
[[TABLE:glance]]
## Is the 6 month sleep regression real?
"Sleep regression" is a popular term, not a medical diagnosis, and research on exact ages is limited. Many sleep experts do not count 6 months among the classic regressions, and our own age-by-age guide does not list it. The Sleep Foundation says some babies have a 6-month sleep regression but many do not, and that in most cases there is no single cause.
What is real is that six months is a busy time, and several changes often land in the same few weeks. Think of it as a common, temporary bump that lines up with development, not a sign that something is wrong.
If the trouble started earlier, around 3 to 4 months, read our [4 month sleep regression](/mamabee/articles/4-month-sleep-regression) guide. That change is different, because it comes from a lasting shift in how babies cycle through sleep.
## Signs of a 6 month sleep regression
- Waking more often at night after a stretch of longer sleep
- Short naps, or fighting the second or third nap
- Fussing or crying at bedtime when your baby used to settle easily
- Rolling onto the tummy or sitting up in the crib, then getting upset
- Wanting you more, and crying when you leave the room
- Seeming hungrier at night, or more distracted during daytime feeds
- Waking earlier in the morning
These signs overlap with teething, illness and a schedule that no longer fits, so look at the whole picture. A fever, ear pain or a baby who seems unwell is not a regression. See the pediatrician section below.
## Why sleep changes around 6 months
The Sleep Foundation notes that babies develop at an uneven pace and may be more sensitive to overstimulation, separation anxiety and other disturbances. At 6 months, these are the usual suspects.
[[TABLE:causes]]
### Rolling and sitting
By 6 months, the CDC lists rolling from tummy to back and leaning on the hands to sit among the things most babies do. New skills often get practiced in the crib: a baby rolls over and gets stuck, or sits up and does not yet know how to lie back down.
Always place your baby on their back to sleep. The AAP says that if your baby is comfortable rolling both ways, you do not need to keep turning them back. Stop swaddling once your baby shows signs of trying to roll.
### Starting solids
The AAP and CDC recommend starting solids at about 6 months, once your baby shows readiness signs. New foods mean a new routine, and poop changes too. The AAP says stools become firmer, more varied in color and stronger smelling, and some undigested food is normal.
At this age solids are mostly practice. Breast milk or formula is still the main nutrition. Our guide to [when to start solids](/mamabee/articles/when-to-start-solids) covers readiness and first foods.
### Teething
The AAP says first teeth typically appear between 6 and 10 months, usually the lower front teeth first, though discomfort can start earlier. Swollen, tender gums can make it harder to settle. Teething does not cause fever or diarrhea, so call your pediatrician if you see either. Our [baby teething symptoms](/mamabee/articles/baby-teething-symptoms) guide covers the signs.
### Early separation awareness
The AAP says some babies show separation anxiety as early as 4 to 5 months, and most develop it more strongly around 9 months. At 6 months, many babies clearly know their familiar people and notice when you walk away. Waking and looking for you is a sign of healthy attachment, not something you caused. See [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) for more.
### Wake windows getting longer
At 6 months, most babies do best with wake windows of about 2 to 2.5 hours, stretching toward 3 hours before bed. A rhythm that suited your baby at 4 or 5 months may now leave them not tired enough at nap time, which can look like nap fights, short naps or early waking. Stretch too far and you get an overtired baby instead. Our [wake windows by age](/mamabee/articles/wake-windows-by-age) guide explains the ranges.
### Nap changes
Most 6 month olds still take 3 naps. Some move to 2 between 6 and 8 months, and the short third nap is usually the first one they fight. That does not mean it is time to drop it yet. Our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide explains the signs.
### Night feeds
The AAP says it is normal for a 6 month old to wake during the night and go back to sleep after a few minutes. Some babies still feed once or twice at night at this age. Whether your baby still needs a night feed depends on their growth and feeding, so it is a question for your pediatrician, often at the 6-month checkup.
## How long does the 6 month sleep regression last?
The Sleep Foundation says a 6-month sleep regression usually lasts for a few days or weeks, though a plateau in sleep progress can last longer. In practice, things often settle once a new skill feels easy or a tooth comes through.
Judge the trend over a week or two rather than the worst night. If poor sleep goes on for more than a few weeks, keeps getting worse or comes with signs of illness, talk to your pediatrician.
## What helps during the 6 month sleep regression
### Practice new skills during the day
Give plenty of floor time and tummy time. Let your baby practice rolling both ways, and gently help them go from sitting to lying down. The goal is for the new skill to feel ordinary by bedtime, so the crib is less of a practice space.
### Get the wake windows right
Aim for about 2 to 2.5 hours between naps, with the last stretch before bed reaching toward 3 hours. Watch for cues like rubbing eyes, staring off and fussing. After a day of short naps, move bedtime earlier, as early as 6:30 PM. The [baby sleep schedule generator](/mamabee/tools/baby-sleep-schedule-generator) and [wake window calculator](/mamabee/tools/wake-window-calculator) can help you plan the day.
### Keep bedtime boring and the same
Use the same few steps in the same order every night: for example, a bath or wash, pajamas, a feed, a book and a song. The AAP's Brush, Book, Bed routine is a simple model, and brushing fits right in once the first tooth arrives.
The AAP suggests putting babies to bed drowsy rather than fully asleep, noting that babies who are rocked or held to sleep may struggle to go back to sleep when they wake at night. If that is not realistic this week, that is fine. Our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide has more ideas.
### Pause, then respond calmly
Because short wakings are normal at 6 months, a brief pause gives your baby a chance to resettle. If the crying builds, go in. If your baby seems hungry, feed them; the AAP suggests keeping night feeds and changes low-key. Busy babies often feed less during the day, so offer some daytime feeds in a quiet room.
### Make solids gentle on sleep
Offer new foods at breakfast or lunch rather than dinner, so you see any reaction during the day. The CDC suggests waiting 3 to 5 days between new foods. Keep evening meals to foods your baby already knows.
### Comfort sore gums
The AAP suggests a soft teething toy, a chilled washcloth or cold teether (not frozen solid) and gentle gum massage. If your baby seems very uncomfortable, ask your pediatrician about acetaminophen. Avoid benzocaine numbing products, homeopathic teething tablets or gels and teething necklaces.
### Help with separation
Play peekaboo, and keep goodbyes short and cheerful. The AAP suggests using the same ritual each time. At bedtime, the same routine and a brief, calm check-in tell your baby you are still nearby.
### Keep the crib safe for a mover
- **Back to sleep, every sleep,** on a firm, flat surface with only a fitted sheet
- **Nothing soft in the crib:** no pillows, blankets, bumpers or stuffed toys before 12 months
- **Room-share without bed-sharing** for at least the first 6 months (AAP)
- **Lower the mattress before your baby can sit,** and to the lowest setting before they can stand
- **A sleep sack that leaves the arms free** instead of a swaddle once your baby tries to roll
Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) covers the full list.
## What to avoid (and what not to worry about)
- **Do not overhaul everything on night three.** Change one thing at a time and give it several days.
- **Do not put cereal in a bottle** to help your baby sleep. The AAP warns it can cause choking and too much weight gain, and it should only be used for reflux with your doctor's advice.
- **Do not use weighted sleep sacks or blankets,** or products that claim to reduce the risk of SIDS. The AAP says there is no evidence they work.
- **Do not drop the third nap** just because your baby fights it some days. Most 6 month olds still need it.
- **Try not to start sleep props you would not want to keep.** Survival nights are allowed, though.
Things you can stop worrying about:
- A baby who rolls onto the tummy and is comfortable rolling both ways
- A few refused spoonfuls of food, since milk is still doing the heavy lifting
- A night feed at 6 months, which can still be normal
- A mix of good and bad nights while things settle
## Sample 6 month old sleep schedule
This sample uses a 7:00 AM wake-up, three naps and wake windows of about 2 to 2.5 hours. It matches our full 6 month day. If you have not started solids yet, skip those rows.
[[TABLE:sample]]
That adds up to about 3 hours 15 minutes of day sleep and about 11 hours 15 minutes at night. During a rough patch, the times matter less than keeping the start and end of the day steady. For an early-riser version and full feeding details, see our [6 month old schedule](/mamabee/articles/6-month-old-schedule).
## Sleep training during the 6 month regression
You do not have to sleep train, and you do not have to wait if you have decided to. Some families start a gentle method around 6 months. Others wait until a tooth is through or a new skill has settled, because it is easier to tell what is working in a calm week.
If you are thinking about it, ask your pediatrician first, especially about night feeds. Our [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) guide compares the options without pushing any one of them.
## When to call your pediatrician
Call your pediatrician if your 6 month old:
- Has a fever that lasts more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down. Call right away if your baby looks very ill, is unusually drowsy or is very fussy.
- Has signs of an ear infection: ear pain that is often worse at night, fever, not responding to sounds as usual, or fluid draining from the ear. The AAP notes that ear tugging on its own is not a reliable sign.
- Has fewer wet diapers than usual, a dry mouth, fewer tears or a sunken soft spot, which can be signs of dehydration
- Refuses several milk feeds in a row, or gets a rash, vomiting or diarrhea after a new food. Call 911 for trouble breathing or swelling of the lips, face or tongue.
- Loses skills they once had, or is not doing the CDC's 6-month items, such as rolling from tummy to back, reaching for a toy or taking turns making sounds with you
- Has sleep that keeps getting worse, or has not improved after a few weeks
More is in our guide on [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do).
[[CTA||See how naps and nights are trending through the 6 month bump with MamaBee.]]
## How MamaBee can help
In a rough patch, it is hard to remember whether nights are actually getting better. MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, breastfeeds with left and right timers, bottles, pumping, solids and diapers, all on one timeline with 7-day insights that show how naps and nights are trending. Two caregivers stay in sync in real time. Sleep Coach nap prediction is part of MamaBee Premium.
## Frequently asked questions
### Is there a 6 month sleep regression?
Not in the classic sense. Many experts do not list 6 months as a regression, but sleep often gets bumpy around this age because of rolling, sitting, solids, teething and longer wake windows.
### How long does the 6 month sleep regression last?
The Sleep Foundation says it usually lasts a few days or weeks. If poor sleep continues longer or comes with signs of illness, check in with your pediatrician.
### Why is my 6 month old suddenly waking up at night?
Common reasons are practicing rolling or sitting, teething, early separation awareness, a schedule that no longer fits and hunger. The AAP says short night wakings are normal at 6 months.
### Can starting solids affect my baby's sleep?
New foods can bring a new routine and changes in digestion, so offering new foods earlier in the day helps. Do not add cereal to a bottle to help sleep; the AAP warns against it.
### Should a 6 month old still eat at night?
Some 6 month olds still wake once or twice to feed, and that can be normal. Ask your pediatrician whether your baby still needs a night feed based on their growth.
### Is it teething or a sleep regression?
It can be both, since first teeth often arrive between 6 and 10 months. Drooling, chewing and swollen gums point to teething, but teething does not cause fever or diarrhea.
## The takeaway
The 6 month sleep regression is less a regression than a crowded month: rolling, sitting, solids, teeth and growing awareness all at once. It usually passes within a few days or weeks. Keep wake windows around 2 to 2.5 hours, practice new skills by day, keep bedtime predictable and the crib safe, and ask your pediatrician about night feeds. Next month, many babies start moving to two naps, covered in our [7 month old schedule](/mamabee/articles/7-month-old-schedule).
[[CTA||Log naps, night wakings and first foods in MamaBee, free on iPhone.]]
Sources: [Sleep Foundation: 6-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/6-month-sleep-regression), [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [CDC: Milestones by 6 Months](https://www.cdc.gov/act-early/milestones/6-months.html), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Getting Your Baby to Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx), [AAP HealthyChildren: Brush, Book, Bed](https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Brush-Book-Bed.aspx), [AAP HealthyChildren: Starting Solid Foods](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx), [CDC: Introducing Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Soothing Separation Anxiety](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Soothing-Your-Childs-Separation-Anxiety.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('18-month-sleep-regression',
    '18 Month Sleep Regression: Signs, How Long & What Helps',
    'The 18 month sleep regression explained: bedtime battles, molars, separation anxiety and nap refusal, how long it lasts, a 1-nap sample day and what helps.',
    ['18 month sleep regression', '18 month old sleep regression', 'toddler sleep regression', '18 month old sleep schedule', 'toddler bedtime battles'],
    {
      glance: {
        caption: '18 month sleep regression at a glance',
        headers: ['What', 'At 18 months'],
        rows: [
          ['When it happens', 'Around 18 months; timing varies from child to child'],
          ['Common signs', 'Bedtime stalling, crying when you leave, night waking, fighting or skipping the nap, early waking'],
          ['Typical causes', 'Independence and "no", separation anxiety, molars and canines, new words and skills, nap and schedule changes'],
          ['How long', 'Rarely more than a few weeks (Sleep Foundation)'],
          ['What helps', 'One nap at a steady time, a short predictable routine, clear limits, simple choices, brief and boring check-ins'],
          ['Naps', 'Most toddlers are on 1 afternoon nap by 18 months, about 1.5 to 3 hours (Nationwide Children\'s)'],
          ['Sleep needed', '11 to 14 hours in 24 hours, nap included (AASM, 1 to 2 years)'],
        ],
      },
      causes: {
        caption: 'What often disrupts toddler sleep around 18 months',
        headers: ['Cause', 'What you might see', 'What helps'],
        rows: [
          ['Independence', 'Stalling, "no", one more book, one more drink', 'Clear limits set in advance and two simple choices'],
          ['Separation anxiety', 'Crying the moment you leave, calling for you at night', 'The same short goodbye ritual, and coming back when you said you would'],
          ['Molars and canines', 'Chewing, drooling, waking upset', 'A cold teether or damp cool washcloth; ask about pain relief'],
          ['New skills and words', 'Standing or chattering in the crib, restless sleep', 'Lots of active play and talk during the day'],
          ['Nap changes', 'A short or skipped nap, a cranky evening', 'One nap at a steady time and an earlier bedtime after short naps'],
          ['Schedule changes', 'Wobbly sleep after travel, daycare or a new sibling', 'Keep wake time, nap time and bedtime as steady as you can'],
        ],
      },
      sample: {
        caption: 'Sample 18 month old sleep schedule: 7:00 AM wake, 1 nap',
        headers: ['Time', 'What happens', 'Notes'],
        rows: [
          ['7:00 AM', 'Wake up', 'Open the curtains; daylight and an active morning help'],
          ['7:30 AM', 'Breakfast', ''],
          ['9:30 AM', 'Snack and active play', 'Outdoors if you can'],
          ['11:45 AM', 'Lunch', ''],
          ['12:30 PM', 'Nap (about 2 hours)', 'Awake 5 hr 30 min. Same time every day'],
          ['2:30 PM', 'Wake up, snack', 'Avoid letting the nap run late into the afternoon'],
          ['5:30 PM', 'Dinner', ''],
          ['6:45 PM', 'Bedtime routine', 'Bath or wash, pajamas, brush teeth, two books, one song'],
          ['7:30 PM', 'Asleep for the night', 'Awake 5 hr. About 11.5 hours of night sleep'],
        ],
      },
    },
`**The 18 month sleep regression is a common, temporary stretch of bedtime battles, night waking or nap refusal in young toddlers. It usually lines up with a push for independence, separation anxiety, molars coming in and a burst of new words and skills. The Sleep Foundation says the symptoms rarely last more than a few weeks. One well-timed nap, a short and steady bedtime routine and calm, consistent limits help most.**
Your easygoing sleeper now says "no" at bedtime, calls for you after lights out and treats the nap as optional. It is exhausting, and very typical for this age. This guide goes deep on 18 months; for every age at a glance, see our [baby sleep regressions by age](/mamabee/articles/baby-sleep-regressions-by-age) guide.
## 18 month sleep regression at a glance
[[TABLE:glance]]
## Is the 18 month sleep regression real?
"Sleep regression" is a popular term, not a medical diagnosis, and research on exact ages is limited. The Sleep Foundation says regressions typically do not have one single cause and that several factors may be involved.
What is real is that a lot changes around 18 months. Your toddler is walking, climbing, understanding far more words and discovering they have opinions, and each of those can show up at bedtime or at 2 AM. It is a temporary bump tied to development, not a sign that sleep is broken.
## Signs of the 18 month sleep regression
- Stalling at bedtime: one more book, one more drink, one more hug
- Crying or protesting as soon as you leave the room
- Waking at night and calling for you, or standing up in the crib
- Fighting the nap, skipping it or taking a much shorter one
- Waking earlier in the morning
- Clinginess one minute and "no" to everything the next
The Sleep Foundation also lists longer or more frequent naps as a possible sign. A toddler with a fever, pain or other signs of illness is not having a regression; see the pediatrician section below.
## Why sleep changes at 18 months
[[TABLE:causes]]
### Independence and "no"
The AAP says that in the second year, toddlers show increasing independence, swing back and forth between independence and clinginess, and begin to show defiant behavior, particularly with the adults they feel most comfortable with. Bedtime is when you are asking them to stop the fun, so it is a natural place to push back. The Sleep Foundation links bedtime resistance to wanting more independence or to being overstimulated in the evening.
### Separation anxiety
The AAP says separation challenges often begin at 15 or 18 months in toddlers. The CDC notes that by 18 months, most toddlers move away from you but look back to make sure you are close by. That same need to check in can wake them at night. KidsHealth describes it simply: "Where's Mommy? Where's Daddy?" Our [baby separation anxiety](/mamabee/articles/baby-separation-anxiety) guide covers it in depth.
### Molars and canines
According to the American Dental Association, the upper first molars usually come in between 13 and 19 months and the lower first molars between 14 and 18 months, with canines from about 16 to 23 months. So many 18 month olds are cutting their biggest teeth so far. KidsHealth lists teething pain among the common causes of toddler night waking. Teething does not cause fever (AAP). See [baby teething symptoms](/mamabee/articles/baby-teething-symptoms).
### A busy brain: new words and new skills
By 18 months, the CDC lists walking without holding on, climbing on and off a couch or chair, trying to say three or more words besides "mama" or "dada," and following one-step directions. The AAP notes that 1 year olds understand more than you may think, and that understanding grows before they can say many words. The Sleep Foundation adds that newer mobility and physical skills can make toddlers restless at night.
### Nap and schedule changes
KidsHealth says that at around 18 months, or sometimes sooner, most toddlers condense two naps into one afternoon nap. A brand-new single nap can be short for a while, which leaves a toddler overtired by bedtime. Travel, starting daycare, a new sibling or a change in routine can also unsettle sleep, and the Sleep Foundation lists adjusting to a changed schedule as a factor. See our [baby nap transitions](/mamabee/articles/baby-nap-transitions) guide.
### Screens and dreams
KidsHealth notes that screen time can disrupt a child's sleep and that dreams and nightmares can begin to affect toddlers, though the Sleep Foundation says nightmares are uncommon at this age. The CDC says screen time is not recommended for children younger than 2, apart from video calls with loved ones.
## How long does the 18 month sleep regression last?
The Sleep Foundation says the symptoms of an 18-month sleep regression rarely last more than a few weeks. It also advises bringing it up with your pediatrician if sleep problems continue for a month or more.
Toddlers learn fast what gets them one more story, so the limits you keep during these weeks tend to stick. Judge the trend over a week or two, not the hardest night.
## What helps during the 18 month sleep regression
### Protect one good nap
Nationwide Children's Hospital says that by 18 months, most toddlers have given up the morning nap and take one long afternoon nap of 1.5 to 3 hours. Keep it at about the same time every day, and do not let it run too late, since napping late in the afternoon can make it hard to fall asleep at bedtime. After a short nap, move bedtime a little earlier. If your toddler is still mid-transition, an occasional two-nap day is fine.
### Keep the bedtime routine short and predictable
The CDC suggests steady routines for sleeping and eating. KidsHealth advises sticking with a routine that works and not letting it get too long. The AAP's Brush, Book, Bed is an easy model: brush teeth, read a book or two, then bed at a regular time each night. Soft lighting and a reassuring goodnight help, the Sleep Foundation adds. Our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide has a step-by-step version.
### Set clear, kind limits
Nationwide Children's suggests setting clear limits when a toddler stalls at bedtime, such as how many books you will read. KidsHealth suggests deciding ahead of time how many drinks of water you will allow, then sticking to it. Say it the same way every night: "Two books, one song, then lights out." When the books are done, the answer is a warm but firm goodnight.
### Offer simple choices
The CDC suggests giving simple choices between two things. At bedtime, that might be which pajamas, which of two books or which stuffed animal comes along. A small choice meets the need for control without opening the whole routine up for debate.
### Make goodbyes predictable
The AAP advises keeping goodbyes short and sweet, using the same ritual each time and coming back when you said you would. At bedtime, "I'll check on you in a few minutes" works only if you do it. During the day, the Sleep Foundation suggests short separations so your toddler gets used to calm time with other trusted adults.
### Keep night visits brief and boring
KidsHealth warns that too much interaction at night can backfire, so keep visits brief and boring. The Sleep Foundation suggests giving your toddler a chance to calm down before you respond, and, if needed, soothing from a little farther away each time.
### Comfort sore gums
A cold teether, a damp cool washcloth or gentle gum massage can help. If your toddler seems very uncomfortable, ask your pediatrician about acetaminophen. The AAP advises avoiding benzocaine and lidocaine products, homeopathic teething tablets or gels and teething necklaces.
### Get the day right
The Sleep Foundation suggests plenty of physical activity and natural daylight. Keep the bedroom dark and quiet; a dim night light can help if your toddler seems afraid of the dark.
### Safe sleep after 12 months
The AAP's safe sleep recommendations, including keeping blankets and soft toys out of the crib, are written for babies up to 1 year. KidsHealth says that after 12 months it is OK to put a light blanket in the crib, and that a lovey, such as a small soft blanket or stuffed animal, is OK and can be a real comfort. Skip extra-large soft toys, and make sure comfort items are not choking hazards. Keep the mattress at its lowest setting and skip bumpers, which the AAP says toddlers can use to climb out. Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) has the full list.
## What to avoid (and what not to worry about)
### Keep the crib
A regression is not a good reason to move to a big bed. Nationwide Children's says most toddlers switch from a crib to a bed between 2 and 3 years of age, and that moving too early can disrupt sleep. A crib also holds the line on bedtime limits that an 18 month old cannot yet hold for themselves.
The exception is safety. The AAP says it is time to move to a bed when your child is 35 inches (89 cm) tall or when the side rail is lower than about three-quarters of their height, roughly nipple level. If your toddler keeps climbing out even with the mattress at its lowest setting, KidsHealth suggests a toddler bed with a side rail. Read [baby-proofing your home](/mamabee/articles/baby-proofing-your-home) before making the switch.
### Other things to avoid
- **Bringing your toddler into your bed as a fix.** The Sleep Foundation says it is best not to.
- **Dropping the nap** because your toddler fights it for a week. Most 18 month olds still need one nap.
- **A longer and longer routine.** Extra steps tend to become new negotiations.
Things you can stop worrying about: a few rough nights in a row, a lovey your toddler insists on, and protests at goodbye, which are a sign of a strong bond.
## Sample 18 month old sleep schedule
This sample uses a 7:00 AM wake-up and one afternoon nap of about 2 hours, within the 1.5 to 3 hour range Nationwide Children's describes. Times vary from toddler to toddler, so use it as a starting point.
[[TABLE:sample]]
That adds up to about 2 hours of day sleep and about 11.5 hours at night, or 13.5 hours in total, within the AASM's 11 to 14 hours for 1 to 2 year olds. On a short-nap day, move bedtime earlier, toward 7 PM.
We do not have a full 18 month schedule page yet. For moving from two naps to one, see [baby nap transitions](/mamabee/articles/baby-nap-transitions), and for the evening, see our [baby bedtime routine](/mamabee/articles/baby-bedtime-routine) guide.
## Sleep training during the 18 month regression
There is no single right answer. Some families wait for a regression to pass before changing anything; others find a clear, consistent approach is what a limit-testing toddler needs. Either way, consistency matters more than the method. Our [baby sleep training methods](/mamabee/articles/baby-sleep-training-methods) guide compares approaches neutrally, and your pediatrician can help you decide, especially if teething or illness is in the mix.
## When to call your pediatrician
Call your pediatrician if your 18 month old:
- Has a fever that lasts more than 24 hours, a temperature that rises above 104°F (40°C) repeatedly, or still acts sick once the fever comes down. Call right away if your toddler looks very ill, is unusually drowsy or is very fussy.
- Has signs of an ear infection: ear pain that is often worse at night, fever, not responding when you speak as usual, or fluid draining from the ear. The AAP notes that ear tugging on its own is not a reliable sign, since many toddlers tug to self-soothe.
- Has fewer wet diapers than usual, a dry mouth or fewer tears, which can be signs of dehydration
- Loses skills they once had, or is not doing the CDC's 18-month items, such as walking without holding on, pointing to show you something, trying to say three or more words besides "mama" or "dada," or following a one-step direction
- Has sleep problems that continue for a month or more
The CDC's advice is simple: you know your child best, so do not wait. The 18-month checkup includes developmental and autism screening under the AAP's Bright Futures schedule; see our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) and [baby milestones by month](/mamabee/articles/baby-milestones-by-month). For fevers, see [baby fever and what to do](/mamabee/articles/baby-fever-what-to-do).
[[CTA||See whether naps and nights are settling with MamaBee.]]
## How MamaBee can help
When every bedtime feels like a negotiation, it helps to see the bigger picture. MamaBee is an iPhone baby tracker with no ads, and everyday logging is free: sleep, bottles, solids, diapers and more, all on one timeline with 7-day insights that show how naps and nights are trending. Two caregivers stay in sync in real time, so whoever does bedtime knows how the nap went. Sleep Coach nap prediction is part of MamaBee Premium.
## Frequently asked questions
### What are the signs of the 18 month sleep regression?
Common signs are bedtime stalling, crying when you leave the room, new night waking, fighting or skipping the nap and early waking. Some toddlers nap longer instead.
### How long does the 18 month sleep regression last?
The Sleep Foundation says symptoms rarely last more than a few weeks. If sleep problems continue for a month or more, talk to your pediatrician.
### How long should an 18 month old nap?
Most 18 month olds take one afternoon nap of about 1.5 to 3 hours, according to Nationwide Children's Hospital. Keep it at a steady time and not too late in the afternoon.
### What time should an 18 month old go to bed?
Many toddlers this age go to bed between about 6:30 and 8 PM. Choose a time that, with the nap, adds up to 11 to 14 hours of sleep in 24 hours (AASM).
### Should I move my 18 month old to a toddler bed?
Usually not because of a regression. Most toddlers move to a bed between 2 and 3 years; move sooner only for safety, such as when your child reaches 35 inches or keeps climbing out (AAP).
### Is it the 18 month sleep regression or molars?
Often both, since first molars usually arrive between 13 and 19 months (ADA). Chewing, drooling and sore gums point to teething, but teething does not cause fever.
## The takeaway
The 18 month sleep regression is a toddler working through big changes: independence, separation anxiety, molars, new words and a new one-nap day. It rarely lasts more than a few weeks. Protect one good nap, keep the routine short and the same, set clear limits with small choices, keep the crib, and call your pediatrician if something seems off. Calm consistency now is what carries you through.
[[CTA||Track naps and bedtimes through the 18 month regression with MamaBee, free on iPhone.]]
Sources: [Sleep Foundation: 18-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/18-month-sleep-regression), [Nationwide Children's Hospital: Sleep in Toddlers](https://www.nationwidechildrens.org/sleep-in-toddlers), [KidsHealth: Toddler Sleep, 1 to 2 Year Olds](https://kidshealth.org/en/parents/sleep12yr.html), [KidsHealth: Naps](https://kidshealth.org/en/parents/naps.html), [AASM: Recommended Sleep for Pediatric Populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/), [CDC: Milestones by 18 Months](https://www.cdc.gov/act-early/milestones/18-months.html), [AAP HealthyChildren: Emotional Development, 1 Year Olds](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Emotional-Development-1-Year-Olds.aspx), [AAP HealthyChildren: Language Development, 1 Year Olds](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Language-Development-1-Year-Olds.aspx), [AAP HealthyChildren: Soothing Separation Anxiety](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Soothing-Your-Childs-Separation-Anxiety.aspx), [ADA MouthHealthy: Primary Tooth Development Chart](https://www.mouthhealthy.org/-/media/project/ada-organization/ada/mouthhealthy/files/activity-sheets/adaprimarytoothdev_eng.pdf), [AAP HealthyChildren: Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx), [AAP HealthyChildren: Brush, Book, Bed](https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Brush-Book-Bed.aspx), [AAP HealthyChildren: Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [AAP HealthyChildren: Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx), [AAP HealthyChildren: Fever](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx), [AAP HealthyChildren: Ear Infections](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
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
