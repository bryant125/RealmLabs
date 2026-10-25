// Week-10 MamaBee batch — 5 practical baby-care articles as DRAFTS. Topics picked
// from US Google autocomplete demand (Oct 2026) and checked against CONTENT-LOG.md
// for zero overlap. Every medical number cites a source listed at the end of its
// article. Run: SANITY_WRITE_TOKEN=xxx node scripts/week10-articles.mjs
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

const articles = [


  A('how-many-wet-diapers-newborn',
    'How Many Wet Diapers Should a Newborn Have? Day by Day',
    'How many wet diapers a newborn should have on day 1, 2, 3 and after the first week, plus dirty diapers, dehydration signs and when to call.',
    ['how many wet diapers should a newborn have', 'newborn wet diapers per day', 'wet diapers in 24 hours newborn', 'how many wet diapers day 3', 'breastfed newborn wet diapers'],
    {
      days: {
        caption: 'Expected diapers in the first weeks (minimums, per 24 hours)',
        headers: ['Baby\'s age', 'Wet diapers', 'Dirty diapers', 'What the poop looks like'],
        rows: [
          ['Day 1', '1 or more', '1 or more', 'Black or dark green, thick and sticky (meconium)'],
          ['Day 2', '1 to 2 or more', '1 or more', 'Still dark and sticky'],
          ['Day 3', '3 or more, feeling heavier', '2 or more', 'Changing: brown, green or yellow, getting looser'],
          ['Day 4', '3 or more', '2 or more', 'Greenish to yellow'],
          ['Day 5', '5 or more', '2 or more', 'Yellow, may be quite watery'],
          ['Day 6', '5 or more', '2 or more', 'Yellow and loose'],
          ['Day 7 to week 4', '6 or more heavy wet', '2 or more (many babies go after most feeds)', 'Yellow, loose, often "seedy"'],
        ],
      },
    },
`**A newborn usually has 1 or 2 wet diapers on day 1, about 3 by days 3 and 4, 5 or more by days 5 and 6, and 6 or more heavy wet diapers every 24 hours after the first week. A daily count that keeps climbing, with pale pee, is a good sign feeding is on track.**
Diapers are the one feeding measure you can see. You cannot tell how many ounces a breastfed baby drank, but you can count what comes out. That is why your care team asks about them at every early visit.
These are minimums. More is fine. Watch the trend: the count should rise through the first week, then hold steady.
## How many wet diapers should a newborn have each day?
[[TABLE:days]]
This pattern roughly tracks your baby's age in days for the first few days: one wet diaper on day 1, a few by day 3, five by day 5. After that, the target settles at six or more per 24 hours and stays there through the newborn weeks.
## How many wet diapers on day 1, day 2 and day 3?
**Day 1:** one or two wet diapers is normal. Colostrum, the first milk, comes in small, concentrated amounts, and KidsHealth notes one or two wet diapers may be all you see in the first 24 hours.
**Day 2:** expect one to two or more. Some parents see a small orange, pink or reddish stain in the diaper. These are urates, crystals in concentrated pee. They are common in the first couple of days and usually not a problem.
**Day 3:** the count should reach three or more, and the diapers should start to feel heavier. This is when milk volume usually increases. If you are still seeing urates after the first couple of days, tell your pediatrician or lactation nurse, because that can be a sign your baby is not getting enough milk yet.
## How many wet diapers in 24 hours after the first week?
From about day 5 to 7 onward, look for **6 or more wet diapers in 24 hours, with pee that is nearly colorless or pale yellow.** The American Academy of Pediatrics (AAP) uses this same marker on its HealthyChildren.org site, alongside 8 to 12 feeds a day and a baby who seems content for about 1 to 3 hours between feeds.
Count across a full 24 hours, not since breakfast. Night diapers count too, which is one reason a shared log helps when two people are doing changes.
## How many dirty diapers should a newborn have?
Poop changes fast in the first week, and the color tells you a lot:
- **Days 1 and 2:** at least one a day of meconium, which is black or very dark green and sticky like tar.
- **Days 3 and 4:** at least two a day, turning brown, green or yellow and getting looser.
- **Day 5 onward:** yellow, loose and often seedy. The AAP describes at least 3 to 4 a day once milk is in, and KidsHealth notes many breastfed babies poop after most feeds in the first weeks.
Poop that is still black and sticky by day 4 or 5 is worth a call. For a closer look at colors and textures, see our [baby poop color chart](/mamabee/articles/baby-poop-color-chart).
## How can you tell if a disposable diaper is wet?
Modern disposables are so absorbent that a wet one can look dry. A trick from Cambridge University Hospitals in the UK: pour 2 to 4 tablespoons of water into a clean, dry diaper and feel how heavy it gets. That is roughly what a good wet diaper feels like.
Log a mixed diaper (pee and poop together) as both, so your wet count stays accurate.
[[CTA||Log wet, dirty, mixed and dry diapers in one tap with MamaBee.]]
## Are the numbers different for breastfed and formula-fed babies?
The wet-diaper target after the first week is the same: six or more a day. Breastfed babies may have fewer wet diapers in the first two or three days because colostrum comes in small amounts and milk volume builds over several days.
Poop is where the two groups differ more. Formula-fed babies' poop tends to look different in color and texture from breastfed poop. Because poop varies so much, the wet-diaper count is the more reliable day-to-day hydration check for both groups. If you are unsure how much your baby should be eating, our guide to [how much a newborn should eat](/mamabee/articles/how-much-should-a-newborn-eat) breaks it down by week.
## What are the signs of dehydration in a newborn?
The AAP lists these early warning signs of dehydration in babies:
- Fewer than six wet diapers a day
- Dry, sticky mouth
- Fewer tears when crying
- A sunken soft spot on the top of the head
- Playing or engaging less than usual
Signs of more serious dehydration include being very fussy or very sleepy, sunken eyes, cool and blotchy hands and feet, wrinkled skin, and peeing only once or twice a day. The AAP advises notifying your pediatrician right away if any of these develop.
## When should you call the pediatrician about diapers?
Call your pediatrician the same day if:
- Your baby has fewer wet or dirty diapers than the table shows for their age
- After the first week, there are fewer than six wet diapers in 24 hours
- You still see urates (orange, pink or red crystals) after the first couple of days
- Poop is still black and sticky by day 4 or 5
- Your baby is too sleepy to wake for feeds, or feeds fewer than 8 times in 24 hours
- You see any of the dehydration signs above
Seek urgent care for a baby who is very hard to wake, has cool and blotchy hands and feet, or has peed only once or twice in a day.
Your baby should also have a checkup within 48 to 72 hours of leaving the hospital and at 3 to 5 days old. That visit includes a weight check, which is the other half of the "getting enough" picture. Our [baby weight gain chart](/mamabee/articles/baby-weight-gain-chart) explains what to expect after that.
## How does logging diapers help?
In the first week you are tracking two trends at once, the diaper count and the poop color. That is hard to hold in your head at 3 AM.
In MamaBee you can log wet, dirty, mixed or dry with one thumb. The daily timeline shows today's count next to feeds, so you can see at a glance whether you are on track. If you and a partner both do changes, Co-Parent Sharing keeps both phones in sync in real time. Before your first checkup, export a pediatrician PDF of the last 7 days so your doctor sees real numbers instead of guesses.
## Frequently asked questions
### How many wet diapers should a newborn have on day 2?
On day 2, one to two or more wet diapers is normal. Colostrum comes in small, concentrated amounts, so pee is limited. You may also see orange or pink urate crystals, which are common in the first couple of days. The count should start rising on day 3.
### How many wet diapers should a breastfed baby have in 24 hours?
After the first week, a breastfed baby should have six or more wet diapers in 24 hours, with pale or clear pee. In the first few days the count is lower and rises daily, from one or two on day 1 to five or more by days 5 and 6.
### Is it normal for a newborn to go 4 hours without a wet diaper?
In the first couple of days, gaps between wet diapers can be long because babies take in small amounts of colostrum. What matters is the total across 24 hours and whether it is rising each day. If the daily total falls below the expected count for your baby's age, call your pediatrician.
### What does it mean if my newborn's diaper has orange or pink crystals?
These are urates, crystals in very concentrated pee. They are common and usually harmless in the first couple of days. If you still see them after that, tell your pediatrician, as it can mean your baby needs more milk.
### How many dirty diapers should a newborn have?
At least one a day on days 1 and 2, at least two a day on days 3 and 4, and from day 5, yellow loose stools at least two to four times a day, depending on the source. Many breastfed babies poop after most feeds in the first weeks.
## The takeaway
Expect one wet diaper on day 1, building to five or more by day 5 and six or more heavy wet diapers every day after the first week. Watch the trend, check that poop turns yellow by day 5, and call your pediatrician if the count drops or your baby shows signs of dehydration.
[[CTA||Track every diaper and feed in MamaBee, free and private.]]
Sources: [AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx), [AAP HealthyChildren: Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx), [KidsHealth: Breastfeeding FAQs, Supply and Demand](https://kidshealth.org/en/parents/breastfeed-supply.html), [Cambridge University Hospitals NHS: Signs Your Baby Is Getting Enough Milk](https://www.cuh.nhs.uk/rosie-hospital/maternity/infant-feeding/signs-your-baby-is-getting-enough-milk/), [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('well-baby-visit-schedule',
    'Well Baby Visit Schedule: Chart of Checkups, Birth to 3',
    'The well baby visit schedule from 3 days to age 3: a chart of every checkup, what happens at each, typical shots and what to bring.',
    ['well baby visit schedule', 'well child visit schedule chart', 'well baby checkup schedule', 'baby checkup schedule first year', 'pediatrician visit schedule'],
    {
      visits: {
        caption: 'AAP Bright Futures well-baby visits, birth to age 3',
        headers: ['Visit', 'Main checks', 'Screenings', 'Shots often given (light overview)'],
        rows: [
          ['Newborn (hospital)', 'Full exam, weight, length, head size', 'Newborn blood spot, hearing, bilirubin (jaundice), heart oxygen check', 'Hep B (AAP recommends a birth dose)'],
          ['3 to 5 days', 'Weight vs birth weight, feeding, jaundice', 'Confirm newborn blood and hearing results; breastfeeding check', 'Usually none'],
          ['1 month', 'Growth, feeding, development', 'Parent depression screening', 'Hep B dose 2 may fall here or at 2 months'],
          ['2 months', 'Growth, development, exam', 'Parent depression screening', 'DTaP, Hib, polio, pneumococcal; often rotavirus and Hep B'],
          ['4 months', 'Growth, development, exam', 'Parent depression screening; anemia risk check', 'Second doses of the 2-month series'],
          ['6 months', 'Growth, development, exam', 'Parent depression screening; oral health and lead risk checks', 'Third doses; flu shot in season'],
          ['9 months', 'Growth, development, exam', 'Formal developmental screening; lead and oral health risk', 'Catch-up doses if needed'],
          ['12 months', 'Growth, development, exam', 'Anemia check; lead screening or risk check', 'MMR and chickenpox; other boosters at 12 to 15 months'],
          ['15 months', 'Growth, development, exam', 'Behavior and development check-in', 'DTaP booster (15 to 18 months) and remaining boosters'],
          ['18 months', 'Growth, development, exam', 'Developmental screening and autism screening', 'Catch-up doses; flu in season'],
          ['24 months', 'Growth, BMI starts, exam', 'Autism screening; lead screening or risk check', 'Catch-up doses; flu in season'],
          ['30 months', 'Growth, development, exam', 'Developmental screening', 'Flu in season'],
          ['3 years', 'Growth, BMI, blood pressure', 'Vision screening; hearing risk check', 'Flu in season; yearly visits from here'],
        ],
      },
    },
`**The AAP's Bright Futures schedule recommends well-baby visits at 3 to 5 days, 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then every year from age 3. Each visit checks growth and development, and many include vaccines and screenings. That is 11 checkups after the newborn hospital exam, before your child's third birthday.**
Well-baby visits (also called well-child visits) are the checkups your baby gets when they are healthy. Sick visits are separate. The schedule comes from the American Academy of Pediatrics (AAP) and Bright Futures, and most US pediatric practices follow it.
Knowing what is coming at each visit makes them easier to plan, easier to prepare for, and less of a blur.
## What is the well baby visit schedule?
[[TABLE:visits]]
Your pediatrician may add extra visits, for example weight checks in the first weeks or follow-ups for jaundice or feeding. The AAP notes that if any item on the schedule is missed, it should be brought up to date at the earliest possible time. Missing one visit does not mean starting over.
## What happens at every well-baby visit?
Almost every visit includes the same core pieces:
- **Measurements:** weight and length at every visit, head circumference through 24 months, and weight-for-length through 18 months. BMI replaces weight-for-length from age 2.
- **A full physical exam:** babies are examined fully undressed, so dress your baby in easy layers.
- **Development:** your pediatrician watches for milestones and asks what your baby is doing at home.
- **Questions about you:** how feeding, sleep and family life are going.
- **Anticipatory guidance:** what to expect before the next visit, from rolling to babyproofing.
Growth is plotted on WHO growth charts until age 2. If you want to understand percentiles before the visit, our [baby weight gain chart](/mamabee/articles/baby-weight-gain-chart) explains them simply.
## Why is there a visit at 3 to 5 days old?
The first week is when feeding problems and jaundice show up. The AAP recommends a visit at 3 to 5 days old and within 48 to 72 hours of leaving the hospital. Your pediatrician weighs your baby, compares it to birth weight, checks for jaundice and, for breastfed babies, looks at how breastfeeding is going.
Bring your diaper and feed counts to this one. The doctor will ask. Our guide to [how many wet diapers a newborn should have](/mamabee/articles/how-many-wet-diapers-newborn) shows the day-by-day numbers.
## Why does the pediatrician screen the parent at 1, 2, 4 and 6 months?
Bright Futures recommends screening for maternal depression at the 1, 2, 4 and 6 month visits. It is a short questionnaire about how you are feeling. It is routine, not a judgment, and it is there because a parent's wellbeing affects the whole family. Answer openly. If you are struggling, this is a good place to say so. Our guide to [postpartum recovery and mental health](/mamabee/articles/postpartum-recovery-mental-health) covers what is common and when to get help.
## Which visits include developmental and autism screening?
Pediatricians watch development at every visit. On top of that, Bright Futures recommends a formal developmental screening at **9, 18 and 30 months**, and autism screening at **18 and 24 months**. These use short standardized questionnaires you fill out, often in the waiting room.
It helps to note what your baby is doing in the weeks before. Our [baby milestones by month](/mamabee/articles/baby-milestones-by-month) guide gives you a checklist to compare against.
[[CTA||Log doctor visits, growth and vaccine due dates in MamaBee.]]
## What vaccines are given at well-baby visits?
Most vaccines in the first two years are given at the 2, 4, 6, 12, 15 and 18 month visits. The core infant series (DTaP, Hib, polio and pneumococcal) starts at 2 months, with boosters around 12 to 18 months. MMR and chickenpox come at 12 to 15 months.
As of 2026, the CDC and AAP schedules differ on several vaccines, including hepatitis B, rotavirus, hepatitis A and flu. The AAP still recommends all of them routinely. Ask your pediatrician which schedule the practice follows. For a plain-language walkthrough and tips for comforting your baby, see [the baby vaccine schedule explained](/mamabee/articles/baby-vaccine-schedule-explained).
## What other screenings happen in the first three years?
- **Newborn:** blood spot screening, hearing screening, a bilirubin check and a pulse-oximetry check for heart defects, usually before you leave the hospital.
- **4 months:** a risk check for anemia.
- **6 and 9 months:** oral health risk checks. Fluoride varnish is recommended once the first teeth come in.
- **12 months:** a blood test for anemia, and lead screening or a risk check depending on where you live and your insurance.
- **24 months:** lead screening or risk check again.
- **3 years:** blood pressure and vision screening become routine.
## What should you bring to a well-baby visit?
The AAP suggests bringing your top three to five questions and raising them at the start of the visit. Beyond that, bring:
- **Feeding notes:** how many feeds a day, roughly how long or how much
- **Diaper counts**, especially before the 3 to 5 day and 1 month visits
- **Sleep pattern:** longest stretch, naps, night wakings
- **Any symptoms with dates**, plus any medicines or supplements you are giving
- **Your vaccine record** if you switched practices
- **A spare outfit, diapers and a feed**, since visits can run long
## How MamaBee helps you prepare
A visit goes better when your answers come from a log, not memory. MamaBee lets you log feeds, diapers, sleep, growth, symptoms, medicine and doctor visits, then export a pediatrician PDF of the last 7 days to show at the appointment. Growth entries are plotted with WHO percentiles. The vaccine schedule shows what is due and sends due and overdue reminders, and you can track 45+ CDC milestones between visits.
## Frequently asked questions
### How many well-baby visits are there in the first year?
Following the AAP Bright Futures schedule, there are seven well-baby visits in the first year after the newborn hospital exam: 3 to 5 days, and 1, 2, 4, 6, 9 and 12 months. Your pediatrician may add extra weight checks in the first weeks.
### Is there a well-baby visit at 9 months?
Yes. The 9-month visit is on the AAP schedule and includes a formal developmental screening, growth measurements, a physical exam, and often lead and oral health risk checks. Vaccines are usually only given at this visit if your baby needs catch-up doses.
### What happens at the 2-month well-baby visit?
Your pediatrician measures weight, length and head size, does a full exam, asks about feeding, sleep and development, and screens the parent for depression. It is also the first big vaccine visit, usually including DTaP, Hib, polio and pneumococcal vaccines.
### What if we miss a well-baby visit?
Call your pediatrician to reschedule. The AAP says missed items should be brought up to date at the earliest possible time. Missed vaccines can be caught up without restarting the series.
### When do well-child visits become yearly?
After the 30-month visit, well-child visits happen once a year from age 3 through adolescence, according to the AAP Bright Futures schedule.
## The takeaway
Plan for checkups at 3 to 5 days, 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year. Each one tracks growth and development, and many include shots and screenings. Bring a short question list and a few days of logs, and you will get more out of every visit.
[[CTA||Never lose track of checkups, growth and shots. Try MamaBee free.]]
Sources: [AAP Bright Futures Periodicity Schedule](https://downloads.aap.org/AAP/PDF/periodicity_schedule.pdf), [AAP HealthyChildren: Well-Child Care, A Check-Up for Success](https://www.healthychildren.org/English/family-life/health-management/Pages/Well-Child-Care-A-Check-Up-for-Success.aspx), [AAP HealthyChildren: AAP vs Other Vaccine Schedules](https://www.healthychildren.org/English/tips-tools/ask-the-pediatrician/Pages/what-is-the-difference-between-the-AAP-recommended-immunization-schedule-and-other-vaccine-schedules.aspx), [CDC: Child and Adolescent Immunization Schedule by Age](https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age.html), [CDC: Growth Charts](https://www.cdc.gov/growthcharts/index.htm)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('exclusive-pumping-schedule',
    'Exclusive Pumping Schedule by Month: Newborn to 6 Months',
    'A sample exclusive pumping schedule by age: sessions per day, spacing, expected output, power pumping and when to see a lactation consultant.',
    ['exclusive pumping schedule', 'exclusive pumping schedule newborn', 'exclusive pumping schedule by month', 'exclusive pumping schedule 3 months', 'how often to pump exclusively pumping'],
    {
      schedule: {
        caption: 'Sample exclusive pumping schedule by age (a starting point, not a rule)',
        headers: ['Baby\'s age', 'Sessions per 24 hours', 'Spacing', 'Session length', 'Typical daily output'],
        rows: [
          ['Days 1 to 3', '8 or more (8 to 12)', 'Every 2 to 3 hours, day and night', 'About 15 minutes, plus hand expression', 'Drops to teaspoons of colostrum'],
          ['Days 4 to 14', '8 to 12', 'Every 2 to 2.5 hours by day; no night gap over 4 hours', 'Until 2 minutes after the last drop, usually under 30 minutes', 'Rising fast; full supply usually reached around day 14'],
          ['Weeks 2 to 12', '8 to 12, or 6 to 7 once you reach 25 to 35 oz a day', 'Every 2.5 to 3 hours; keep at least one session overnight', '15 to 20 minutes, some need longer', 'About 25 to 35 oz (750 to 1,035 ml)'],
          ['3 to 4 months', 'Often 6 to 7 if your daily total holds', 'Every 3 to 4 hours; longest gap at night', '15 to 20 minutes', 'About 25 to 35 oz (750 to 1,035 ml)'],
          ['4 to 6 months', 'Fewer if your total stays steady; drop one at a time', 'Even gaps; avoid very long stretches', '15 to 20 minutes', 'About 25 to 35 oz (750 to 1,035 ml)'],
          ['6 months and up', 'Adjust slowly with your pediatrician as solids start', 'Even gaps', 'As needed to stay comfortable', 'Varies as solids increase'],
        ],
      },
      sample: {
        caption: 'Two sample days',
        headers: ['Schedule', 'Pump times'],
        rows: [
          ['8 sessions (early weeks)', '6 AM, 9 AM, 12 PM, 3 PM, 6 PM, 9 PM, 12 AM, 3 AM'],
          ['7 sessions (supply established)', '6 AM, 9 AM, 12 PM, 3 PM, 6 PM, 10 PM, 3 AM'],
        ],
      },
    },
`**A typical exclusive pumping schedule for a newborn is 8 to 12 sessions every 24 hours, about every 2 to 3 hours, with no gap over 4 hours at night. Once you make about 25 to 35 ounces a day, many parents drop to 6 or 7 sessions, then cut back slowly while their daily total holds.**
Exclusive pumping means your baby gets your milk only from a bottle, and your pump does the work a nursing baby would do. Milk supply runs on demand: the more often milk is removed, especially in the early weeks, the more your body makes. That is why the newborn schedule is so frequent.
The schedules below are starting points drawn from hospital lactation guidance and La Leche League. Your body and your baby may need something different, and that is fine.
## What is a good exclusive pumping schedule by month?
[[TABLE:schedule]]
The key number is the **daily total**, not any single session. Babies between one and six months typically need about 750 to 1,035 ml (about 25 to 35 ounces) of breast milk a day, according to La Leche League GB. Children's Health Orange County (CHOC) uses the same 25 to 35 ounce range as a full supply per baby.
## What does an exclusive pumping schedule for a newborn look like?
Start as soon as you can after birth, ideally within 6 hours. In the first days you will get drops to teaspoons of colostrum. That is normal and valuable, and it helps build your supply.
For a newborn, aim for:
- **At least 8 sessions in 24 hours**, ideally 8 to 12
- **Every 2 to 2.5 hours during the day**
- **No more than 4 hours between sessions at night**
- **About 15 minutes per session** in the colostrum stage, then until about 2 minutes after the last drop (usually no more than 30 minutes)
- **Hand expression** added to sessions in the first days, which CHOC notes helps you make more milk
Milk volume usually increases between days 2 and 5, and full supply is often reached around day 14. It can take longer after a premature birth or with some health conditions.
[[TABLE:sample]]
## Do I need to pump at night when exclusively pumping?
In the first months, yes. La Leche League GB recommends at least one overnight session, ideally between 2 and 5 AM, while your supply is building. CHOC advises not going longer than 4 hours at night in the early weeks.
Once your supply is established, you can usually stretch the overnight gap first. Some parents find a 4 to 5 hour stretch works if their total output holds steady. Watch your daily total for a few days after any change.
## What does an exclusive pumping schedule at 3 months look like?
Supply often settles around three to four months. By then many exclusive pumpers are pumping 6 or 7 times a day, about every 3 to 4 hours, with the longest gap at night. CHOC says once you make 25 to 35 ounces a day, you may decrease to 6 or 7 sessions.
If you want to cut more sessions, La Leche League GB suggests going gradually: drop one session at a time, keep recording your daily output, and stretch overnight gaps before cutting daytime sessions. Avoid big jumps, which can lead to blocked ducts or mastitis.
## What about an exclusive pumping schedule at 6 months?
Around 6 months, most babies start solids, but milk is still a major part of their diet. Keep your schedule steady while solids begin, and reduce sessions slowly with your pediatrician's input if your baby's milk intake changes. Our [baby feeding schedule by age](/mamabee/articles/baby-feeding-schedule-by-age) shows how feeds shift through the first year.
## How long should each pumping session be?
Most sessions take 15 to 20 minutes, though some parents need longer. La Leche League GB suggests pumping until milk stops spraying, then continuing for a few more minutes to trigger another let-down. One useful guideline it cites is about two hours of total pumping time across 24 hours, split across your sessions.
Double pumping, both sides at once, may collect more milk in less time, according to the US Office on Women's Health.
## What is power pumping and does it help?
Power pumping copies cluster feeding with short, repeated bursts. A common pattern, described in a medically reviewed Healthline guide, takes one hour:
- Pump 20 minutes
- Rest 10 minutes
- Pump 10 minutes
- Rest 10 minutes
- Pump 10 minutes
Do it once a day in place of a regular session. Results vary, and you may need to keep it up for a week or more before seeing a change. La Leche League GB suggests using it occasionally because it takes a lot of time. If your supply is low, talk to a lactation consultant before relying on it.
[[CTA||Log every pumping session and see your daily total in MamaBee.]]
## Tips that make exclusive pumping easier
- **Track your daily total**, not single sessions. One low session is not a trend.
- **Check flange fit.** Pumping should not hurt. Pain or damaged nipples is a reason to get your fit checked.
- **Pump at the times your baby would eat**, which the Office on Women's Health recommends to keep making milk.
- **Set up a station** with water, snacks, a charger and spare parts so each session is quick to start.
- **Get your partner on bottle duty** at night so you only pump, not pump and feed. See our [newborn night shifts](/mamabee/articles/newborn-night-shifts) guide for split-shift plans.
- **Learn paced bottle feeding** so your baby does not overeat. Our guide to [introducing a bottle](/mamabee/articles/introducing-a-bottle-to-breastfed-baby) explains how.
## When should you see an IBCLC?
A board-certified lactation consultant (IBCLC) can help if:
- Pumping is painful or your nipples are cracked or bleeding
- Your output is not climbing in the first two weeks, or drops and does not recover
- You are pumping more than 35 ounces a day (CHOC suggests talking to a lactation consultant about oversupply)
- You keep getting blocked ducts
- You want to drop sessions or wean and are not sure how
Call your doctor promptly if part of your breast becomes red, hot and painful, especially with fever or flu-like symptoms.
## How MamaBee helps
CHOC recommends keeping a pumping log, on paper or in an app, to help you reach your goals. MamaBee logs each pumping session in one tap, alongside bottles, so you can see how much you made and how much your baby drank on the same daily timeline. 7-day insights make it easy to spot whether your total is holding after you drop a session. If a partner is giving bottles, Co-Parent Sharing keeps both of you in sync.
## Frequently asked questions
### How many times a day should I pump if exclusively pumping?
For a newborn, pump at least 8 times in 24 hours, ideally 8 to 12, about every 2 to 3 hours with no gap over 4 hours at night. Once you make about 25 to 35 ounces a day, many parents can reduce to 6 or 7 sessions.
### How much milk should I be pumping per day?
Babies between one and six months usually need about 25 to 35 ounces (750 to 1,035 ml) of milk a day. That is a common full-supply target for exclusive pumpers. In the first days you will pump much less, from drops to teaspoons of colostrum.
### Can I sleep through the night while exclusively pumping?
In the first months, plan on at least one overnight session while supply builds, with no more than 4 hours between sessions at night in the early weeks. Once supply is established, many parents can stretch the overnight gap, watching that their daily total holds.
### How long does power pumping take to work?
It varies. A typical power pumping session lasts one hour and replaces one regular session a day. Many people need to do it daily for a week or more before seeing a change, and it does not work for everyone. A lactation consultant can help if supply stays low.
### When can I drop pumping sessions?
Many parents reduce once they reach a full supply of about 25 to 35 ounces a day, and supply often settles around three to four months. Drop one session at a time, stretch the night gap first, and watch your daily total before dropping another.
## The takeaway
Start with 8 to 12 sessions a day for a newborn, keep night gaps under 4 hours, and aim for a full supply of about 25 to 35 ounces a day by around two weeks. Once there, reduce gradually while tracking your daily total, and get help from an IBCLC if anything hurts or your output stalls.
[[CTA||Track pumping, bottles and your daily total with MamaBee.]]
Sources: [CHOC: Building Your Milk Supply](https://choc.org/wp-content/uploads/2022/04/Building-Milk-Supply.pdf), [La Leche League GB: Exclusively Expressing](https://www.laleche.org.uk/exclusively-expressing/), [Office on Women's Health: Pumping and Storing Breastmilk](https://www.womenshealth.gov/breastfeeding/pumping-and-storing-breastmilk), [Healthline: Power Pumping](https://www.healthline.com/health/breastfeeding/power-pumping)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('newborn-night-shifts',
    'Newborn Night Shifts: Sample Schedules for Two Parents',
    'Newborn night shift schedules for bottle-fed and breastfed babies, plus a single-parent plan, so each adult gets a protected block of sleep.',
    ['newborn night shift schedule', 'newborn night shifts with partner', 'newborn night shifts breastfeeding', 'splitting night shifts with newborn', 'how to split nights with a newborn'],
    {
      plans: {
        caption: 'Sample newborn night shift plans',
        headers: ['Plan', 'Parent A on duty', 'Parent B on duty', 'Best for'],
        rows: [
          ['Split night (bottle-fed)', '9 PM to 2 AM', '2 AM to 7 AM', 'Formula or pumped milk; both parents home'],
          ['Split night (breastfed)', 'Partner: 9 PM to 2 AM, gives one bottle of pumped milk', 'Nursing parent: 2 AM to 7 AM, nurses as baby wakes', 'Once breastfeeding is going well and you have some pumped milk'],
          ['Breastfed, partner as helper', 'Partner: fetches baby, changes diaper, burps and resettles', 'Nursing parent: feeds only, then goes back to sleep', 'Early weeks, or if you are not using bottles yet'],
          ['Alternating nights', 'Whole night every other night', 'Whole night every other night', 'Bottle-fed babies with longer stretches'],
          ['Single parent with support', 'Helper: one 5-hour block, 1 to 3 nights a week', 'Parent: the rest of the night, plus a daytime nap', 'Solo parents with a trusted relative or friend'],
        ],
      },
    },
`**A newborn night shift schedule splits the night into two blocks, such as 9 PM to 2 AM and 2 AM to 7 AM, so each parent gets about five hours of protected sleep while the other handles feeds and diapers. Breastfeeding families can use one bottle of pumped milk, or a partner who does everything but the feed.**
Newborns feed around the clock, often 8 to 12 times in 24 hours. If both parents wake for every feed, both end up running on broken sleep. Shifts mean one person is on duty and the other is off, out of earshot, sleeping.
It will not give you a full night. The CDC recommends 7 or more hours of sleep for adults, and that is not realistic every night with a newborn. But a single unbroken block, plus a nap when you can, is a lot better than waking every two hours together.
## Why do protected sleep blocks help parents?
Sleep that keeps getting interrupted feels worse than the hours suggest. A large Norwegian study of about 2,800 mothers at seven weeks postpartum found poor sleep was linked to depression even after accounting for other risk factors, such as previous depression and relationship stress. Sleep disturbances and how well mothers felt they slept were the parts most strongly tied to depression.
That study shows a link, not proof that shifts prevent depression. Still, giving each parent a predictable stretch of uninterrupted sleep is one of the simplest things you can control. For more on recovery and mood after birth, see our guide to [postpartum recovery and mental health](/mamabee/articles/postpartum-recovery-mental-health).
## What does a newborn night shift schedule look like?
[[TABLE:plans]]
Pick start and end times that match your baby's longest sleep stretch and your own body clock. A night owl can take the early shift, an early riser the late one. Swap if one of you has to work the next day.
## How do you split night shifts with a bottle-fed baby?
This is the simplest setup, because either parent can do any feed.
- **Parent A (9 PM to 2 AM):** handles every wake-up: bottle, burp, diaper, back down. Logs each feed.
- **Parent B (2 AM to 7 AM):** takes over at handover and does the same.
- **The off-duty parent** sleeps in another room if possible, with a fan or white noise and their phone on Do Not Disturb.
Prep bottles or formula supplies before the first shift starts so nobody is measuring powder half asleep. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) can help you estimate amounts.
## How do night shifts work when breastfeeding?
There are two common approaches.
**Option 1: One bottle of pumped milk.** The partner covers the early shift and gives one bottle of pumped milk. The nursing parent pumps just before going to sleep, so the breasts do not go too long without milk removal, then nurses for the rest of the night. The Office on Women's Health advises pumping at the times your baby would normally eat when you cannot nurse, to keep making milk.
**Option 2: Partner does everything but the feed.** The partner hears the baby, changes the diaper, brings the baby to the nursing parent, then burps, resettles and returns the baby to the bassinet. The nursing parent only feeds and goes straight back to sleep. This works well in the early weeks while breastfeeding is getting established.
If you are introducing a bottle, our guide to [introducing a bottle to a breastfed baby](/mamabee/articles/introducing-a-bottle-to-breastfed-baby) covers timing and paced feeding. If you are exclusively pumping, see our [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) for how to fit night sessions in.
## What if you are a single parent or your partner works nights?
Shifts still work. You just need a second adult for part of the week.
- **Ask a helper for one block** on one to three nights a week, for example 10 PM to 3 AM.
- **Nap during the day** when someone else can watch the baby, rather than when the baby naps and chores are waiting.
- **Keep night wake-ups boring:** dim light, quiet voice, quick diaper change, back down.
- **Move your own bedtime earlier** so your first stretch of sleep lines up with your baby's longest one.
[[CTA||Sync the night log between two caregivers with MamaBee, free.]]
## How do you keep night shifts safe?
Tired adults and sleeping babies need a few firm rules. The AAP's safe sleep guidance:
- **Place your baby on their back** for every sleep, on a firm, flat surface with only a fitted sheet.
- **Keep the crib or bassinet in your room**, close to your bed but not in it, for at least the first 6 months. The on-duty parent should sleep near the baby.
- **Never fall asleep with your baby on a couch or armchair.** The AAP says the risk of sleep-related death is up to 67 times higher there.
- **If you might doze off while feeding in bed**, remove pillows and blankets near the baby and move your baby back to their own sleep space as soon as you wake.
- **Keep soft objects and loose bedding** out of the sleep space.
If you feel yourself nodding off on the couch during a feed, stand up, turn on a light, or hand over early. Our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) covers the full list.
## What should you share at handover?
A two-minute handover saves a lot of guesswork:
- When the last feed was, how much or which side
- The last diaper and whether it was wet or dirty
- Any medicine given and when, so nobody gives a second dose by mistake
- Anything unusual: fussiness, spit-up, a temperature reading
- When the baby is likely to wake next
## How MamaBee keeps the handover seamless
With Co-Parent Sharing, two caregivers can log in MamaBee and see each other's entries in real time, free. The on-duty parent logs feeds, diapers and sleep with one thumb, and the person coming on shift opens the daily timeline and sees exactly what happened. Left/right breastfeeding timers record which side you used. Medicine logs show what was given and when. Home and lock-screen widgets keep logging quick in the dark.
## Frequently asked questions
### How long should each newborn night shift be?
Many families split the night into two blocks of about five hours, such as 9 PM to 2 AM and 2 AM to 7 AM. The goal is one unbroken stretch of sleep for each parent. Adjust times to your baby's longest sleep and your own schedules.
### Can you do night shifts if you are exclusively breastfeeding?
Yes. Either the partner gives one bottle of pumped milk during their shift while the nursing parent pumps before sleeping, or the partner handles everything except the feed itself. The second option works well in the early weeks before a bottle is introduced.
### Should the off-duty parent sleep in a different room?
It helps, because the off-duty parent will not be woken by every grunt. The baby should stay in the on-duty parent's room, in a crib or bassinet near their bed, since the AAP recommends room-sharing without bed-sharing for at least the first 6 months.
### When can we stop doing night shifts?
When night feeds drop and your baby sleeps longer stretches, many families move to alternating nights or stop shifts altogether. There is no set age. Keep shifts as long as they help both of you get enough sleep.
### What if one parent cannot sleep during their off shift?
Keep the off shift for sleep only: phone on Do Not Disturb, a dark room, white noise, and earplugs if someone else is on duty. If sleep problems or low mood continue for more than a couple of weeks, talk to your doctor. If you feel overwhelmed or have thoughts of harming yourself or your baby, the free, confidential National Maternal Mental Health Hotline is open 24/7 by call or text at 1-833-TLC-MAMA (1-833-852-6262). In an emergency, call 911.
## The takeaway
Split the night into two blocks so each parent gets one protected stretch of sleep, and adapt the plan to bottle feeding, breastfeeding or a solo setup. Keep safe sleep rules non-negotiable, especially for the tired parent on duty, and use a quick handover so nobody has to guess what happened.
[[CTA||Hand over the night without the guesswork. Try MamaBee free.]]
Sources: [AAP HealthyChildren: A Parent's Guide to Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx), [Dørheim et al., Sleep and Depression in Postpartum Women (Sleep, 2009)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2704916/), [CDC: About Sleep](https://www.cdc.gov/sleep/about/index.html), [Office on Women's Health: Pumping and Storing Breastmilk](https://www.womenshealth.gov/breastfeeding/pumping-and-storing-breastmilk), [AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('baby-weight-gain-chart',
    'Baby Weight Gain Chart: How Much Should a Baby Gain?',
    'How much weight a baby should gain per week and per month, from the first weeks to 12 months, using WHO data. Percentiles explained, and when to worry.',
    ['how much weight should a baby gain', 'baby weight gain per week', 'baby weight gain per month', 'newborn weight gain first month', 'baby weight gain chart'],
    {
      gain: {
        caption: 'Typical monthly weight gain, birth to 12 months (WHO growth velocity standards)',
        headers: ['Age', 'Girls (median)', 'Boys (median)', 'Middle 50% of babies', 'About per week'],
        rows: [
          ['Birth to 4 weeks', '31 oz (879 g)', '36 oz (1,023 g)', '25 to 43 oz', '8 to 9 oz'],
          ['4 weeks to 2 months', '36 oz (1,011 g)', '42 oz (1,196 g)', '29 to 50 oz', '7.5 to 9 oz'],
          ['2 to 3 months', '25 oz (718 g)', '29 oz (815 g)', '20 to 35 oz', '6 to 6.5 oz'],
          ['3 to 4 months', '21 oz (585 g)', '22 oz (617 g)', '16 to 27 oz', 'About 5 oz'],
          ['4 to 5 months', '17 oz (489 g)', '18 oz (522 g)', '13 to 23 oz', 'About 4 oz'],
          ['5 to 6 months', '14 oz (401 g)', '15 oz (422 g)', '10 to 20 oz', 'About 3.5 oz'],
          ['6 to 7 months', '12 oz (344 g)', '13 oz (357 g)', '8 to 17 oz', 'About 3 oz'],
          ['7 to 8 months', '11 oz (311 g)', '11 oz (316 g)', '6 to 16 oz', 'About 2.5 oz'],
          ['8 to 9 months', '10 oz (273 g)', '10 oz (285 g)', '5 to 15 oz', 'About 2.3 oz'],
          ['9 to 12 months', '8 to 9 oz a month (232 to 245 g)', '8 to 9 oz a month (239 to 259 g)', '3 to 14 oz', 'About 2 oz'],
        ],
      },
    },
`**Most babies lose a little weight after birth and are back to birth weight by about 10 to 14 days. Then they gain roughly 7 to 9 ounces a week for two months, about 5 ounces a week by 3 to 4 months, about 3 ounces by 6 months and about 2 ounces by 12 months.**
Weight is one of the clearest signs your baby is eating enough, which is why it gets checked at every early visit. But healthy babies do not grow in a straight line. They gain in bursts, some weeks more and some less, and a single weigh-in tells you less than the trend over several visits.
The numbers here come from the World Health Organization (WHO) growth standards, which US pediatricians use for babies under 2.
## How much weight should a baby gain per month?
[[TABLE:gain]]
The "median" is the middle baby: half gain more, half gain less. The middle 50% column shows the range where half of all healthy babies fall. Plenty of healthy babies sit outside it. These are monthly increments, and the first row includes the early dip and recovery.
## How much weight do newborns lose, and when do they regain it?
Almost all newborns lose some weight in the first few days while feeding gets established. The AAP's HealthyChildren site says a baby may lose no more than about 8 to 10% of birth weight in the first days before starting to gain again.
Clinicians expect babies to be back to birth weight by about 10 to 14 days. A large 2016 study in Pediatrics of more than 140,000 newborns found that half were back to birth weight by day 9 after a vaginal birth and day 10 after a cesarean. By day 14, 86% of vaginally born babies and 76% of cesarean-born babies were back. So being a little behind at two weeks is not unusual, but your pediatrician will want to follow it closely.
## How much weight should a baby gain in the first month?
Measured from birth, the WHO median gain for the first four weeks is about 31 ounces (879 g) for girls and 36 ounces (1,023 g) for boys, roughly 2 pounds. Because that includes the early loss, most of the gain happens in weeks 2 to 4, once milk is in and feeding is steady.
Texas Children's Hospital describes gain in the first three months as roughly an ounce a day on average, in bursts rather than evenly.
## How much weight should a baby gain by 2 months?
Adding the WHO median monthly gains, a typical baby is about 4 pounds above birth weight by 2 months for girls and close to 5 pounds for boys. That is the fastest growth of the whole first year. Your baby may go through [growth spurts](/mamabee/articles/baby-growth-spurts) along the way, with a few days of hungrier, more frequent feeds.
## How much weight should a baby gain per week?
As a rough guide from the WHO medians:
- **Weeks 2 to 8:** about 7 to 9 ounces a week
- **2 to 3 months:** about 6 ounces a week
- **3 to 4 months:** about 5 ounces a week
- **4 to 6 months:** about 3.5 to 4 ounces a week
- **6 to 9 months:** about 2.5 to 3 ounces a week
- **9 to 12 months:** about 2 ounces a week
Texas Children's notes that typical babies double their birth weight by around 6 months and triple it by 1 year.
[[CTA||Log weight and length in MamaBee and see WHO percentiles instantly.]]
## What do weight percentiles mean?
A percentile compares your baby to a large group of healthy babies of the same age and sex. If your baby is at the 50th percentile, half of babies weigh more and half weigh less. At the 15th percentile, 85 out of 100 babies weigh more.
A few things to keep in mind:
- **There is no "good" percentile.** A baby at the 10th percentile can be as healthy as one at the 90th.
- **The line matters more than the dot.** Most babies roughly follow their own curve over time.
- **Under age 2, US pediatricians use the WHO growth standards.** The CDC recommends WHO charts from birth to 2 and CDC charts from age 2.
- **Home scales vary.** Compare weights from the same scale, with your baby undressed.
## When should you worry about a baby's weight gain?
MedlinePlus, from the US National Library of Medicine, says providers look more closely when a measurement stays below the 10th or above the 90th percentile, or when growth does not follow a percentile line. For example, a drop from the 75th to the 25th percentile between 6 and 9 months would be a concern.
Call your pediatrician if:
- Your baby is not back to birth weight by about 2 weeks
- Your baby lost more than about 10% of birth weight in the first days
- Weight drops across two or more percentile lines between visits, or stays flat
- There are fewer than six wet diapers a day after the first week (see our [wet diaper guide](/mamabee/articles/how-many-wet-diapers-newborn))
- Your baby is too sleepy to feed well, feeds poorly, or seems unwell
Slow gain does not always mean a problem, since some babies are naturally smaller. If gain is too slow, your pediatrician will look at feeding volume, digestion and other causes and suggest next steps. Our guide to [how much a newborn should eat](/mamabee/articles/how-much-should-a-newborn-eat) can help you prepare questions.
## How MamaBee helps you track growth
Growth makes more sense as a line than a list of numbers. In MamaBee you can log weight, length and head size and see WHO percentiles for each entry, so you can watch your baby's curve between visits. Feeds and diapers sit on the same timeline, which helps if your pediatrician asks how feeding is going. Before a checkup, export a pediatrician PDF of the last 7 days. Our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) shows when growth gets measured.
## Frequently asked questions
### How much weight should a newborn gain per week?
After regaining birth weight at around 10 to 14 days, newborns typically gain about 7 to 9 ounces a week through the first two months, based on WHO growth standards. Weekly gain varies, so your pediatrician looks at the trend across several weigh-ins.
### How much weight should a baby gain in the first month?
Measured from birth, the WHO median gain for the first four weeks is about 31 ounces for girls and 36 ounces for boys, roughly 2 pounds. This includes the small weight loss in the first days, so most of the gain comes in weeks 2 to 4.
### When should a baby be back to birth weight?
Clinicians expect babies to regain birth weight by about 10 to 14 days. In a large study, half of newborns were back by day 9 or 10, and most by day 14. If your baby is not back by two weeks, your pediatrician will want to check feeding and weight closely.
### Is it bad if my baby is in a low percentile?
Not by itself. A baby who steadily follows a low percentile line can be perfectly healthy. Pediatricians look more closely when a baby stays below the 10th percentile, or drops across percentile lines over time.
### When do babies double their birth weight?
Typical babies double their birth weight by around 6 months and triple it by their first birthday.
## The takeaway
Expect a small dip after birth, a return to birth weight by about two weeks, then roughly 7 to 9 ounces a week for the first two months, slowing steadily through the first year. Watch the curve, not one number, and call your pediatrician if your baby is slow to regain birth weight or drops across percentile lines.
[[CTA||Track your baby's growth with WHO percentiles in MamaBee.]]
Sources: [WHO: Weight Velocity Standards](https://www.who.int/tools/child-growth-standards/standards/weight-velocity), [Paul et al., Weight Change Nomograms for the First Month After Birth (Pediatrics, 2016)](https://pubmed.ncbi.nlm.nih.gov/27940721/), [CDC: Growth Charts](https://www.cdc.gov/growthcharts/index.htm), [MedlinePlus: Growth Charts](https://medlineplus.gov/ency/article/001910.htm), [Texas Children's: Baby Weight Gain Guide](https://www.texaschildrens.org/blog/baby-weight-gain-guide-their-first-year), [AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx)
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${tables} tables, title ${a.title.length}c, desc ${a.description.length}c)`)
}
console.log('\nDone — DRAFTS only. Nothing is live.')
