// Week-16 MamaBee English, part B: "when-do-babies-start-talking" and "when-do-babies-roll-over"
// (rolling + sitting up), as DRAFTS only (never published by this script). Milestones follow the
// CDC "Learn the Signs. Act Early." checklists (2022 update), the AAP (HealthyChildren) and the WHO
// Motor Development Study; every medical claim cites a source listed at the end of its article.
// Cover images are copied from a related published article. Refuses to touch a slug that is already published.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week16-en-b.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week16-en-b.mjs
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
  'when-do-babies-start-talking': ['baby-sign-language', 'baby-milestones-by-month', 'baby-play-and-activities-by-age'],
  'when-do-babies-roll-over': ['tummy-time-guide', 'baby-milestones-by-month', 'baby-play-and-activities-by-age'],
}

const SRC = {
  cdc2: '[CDC: Important Milestones by 2 Months](https://www.cdc.gov/act-early/milestones/2-months.html)',
  cdc4: '[CDC: Important Milestones by 4 Months](https://www.cdc.gov/act-early/milestones/4-months.html)',
  cdc6: '[CDC: Important Milestones by 6 Months](https://www.cdc.gov/act-early/milestones/6-months.html)',
  cdc9: '[CDC: Important Milestones by 9 Months](https://www.cdc.gov/act-early/milestones/9-months.html)',
  cdc12: '[CDC: Important Milestones by 1 Year](https://www.cdc.gov/act-early/milestones/1-year.html)',
  cdc15: '[CDC: Important Milestones by 15 Months](https://www.cdc.gov/act-early/milestones/15-months.html)',
  cdc18: '[CDC: Important Milestones by 18 Months](https://www.cdc.gov/act-early/milestones/18-months.html)',
  cdc24: '[CDC: Important Milestones by 2 Years](https://www.cdc.gov/act-early/milestones/2-years.html)',
  cdc30: '[CDC: Important Milestones by 30 Months](https://www.cdc.gov/act-early/milestones/30-months.html)',
  cdcabout: '[CDC: About Learn the Signs. Act Early.](https://www.cdc.gov/act-early/about/index.html)',
  findei: '[CDC: Find Early Intervention](https://www.cdc.gov/FindEI)',
  hearing: '[CDC: Screening and Diagnosis of Hearing Loss](https://www.cdc.gov/hearing-loss-children/screening/index.html)',
  lang47: '[AAP HealthyChildren: Language Development, 4 to 7 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Language-Development-4-to-7-Months.aspx)',
  lang812: '[AAP HealthyChildren: Language Development, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Language-Development-8-to-12-Months.aspx)',
  lang1: '[AAP HealthyChildren: Language Development, 1 Year Olds](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Language-Development-1-Year-Olds.aspx)',
  lang2: '[AAP HealthyChildren: Language Development, 2 Year Olds](https://www.healthychildren.org/English/ages-stages/toddler/Pages/Language-Development-2-Year-Olds.aspx)',
  bilingual: '[AAP HealthyChildren: Young Children Learning Multiple Languages](https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx)',
  concerns: "[AAP HealthyChildren: How to Raise Concerns About a Child's Speech and Language Development](https://www.healthychildren.org/English/ages-stages/toddler/Pages/How-to-Raise-Concerns-about-Childs-Speech-Language-Development.aspx)",
  ms7: '[AAP HealthyChildren: Developmental Milestones, 7 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-7-Months.aspx)',
  nhstalk: '[NHS: Help Your Baby Learn to Talk](https://www.nhs.uk/baby/babys-development/play-and-learning/help-your-baby-learn-to-talk/)',
  move47: '[AAP HealthyChildren: Movement, 4 to 7 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-4-to-7-Months.aspx)',
  move812: '[AAP HealthyChildren: Movement, 8 to 12 Months](https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx)',
  who: '[WHO Motor Development Study: Windows of Achievement for Six Gross Motor Milestones](https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/motor-development-milestones/mm_windows_table.pdf?sfvrsn=cb31ec78_5)',
  tummy: '[AAP HealthyChildren: Back to Sleep, Tummy to Play](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Back-to-Sleep-Tummy-to-Play.aspx)',
  swaddle: '[AAP HealthyChildren: Swaddling, Is It Safe?](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx)',
  safe: "[AAP HealthyChildren: A Parent's Guide to Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx)",
  changing: '[AAP HealthyChildren: Changing Table Safety](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Changing-Table-Safety.aspx)',
  solids: '[CDC: When, What, and How to Introduce Solid Foods](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html)',
}
const sources = (...keys) => 'Sources: ' + keys.map((x) => { if (!SRC[x]) throw new Error('missing source ' + x); return SRC[x] }).join(', ')

const articles = [

  A('when-do-babies-start-talking',
    'When Do Babies Start Talking? From Coos to First Words',
    'When do babies start talking? Most say a first word around 12 months. See the timeline from cooing and babbling to 2-word phrases, plus when to call the doctor.',
    ['when do babies start talking', 'baby first words', 'baby babbling', 'baby talking timeline', 'baby speech milestones'],
    {
      timeline: {
        caption: 'When do babies start talking? The typical timeline (CDC milestone checklists, 2022 update)',
        headers: ['Stage', 'Typical age', 'What it sounds like', 'What the CDC checklist lists'],
        rows: [
          ['Early sounds', 'Birth to 2 months', 'Crying, grunts, sighs and little throaty noises', 'By 2 months: makes sounds other than crying, reacts to loud sounds'],
          ['Cooing', 'By about 4 months', 'Long vowel sounds like "oooo" and "aahh"', 'By 4 months: coos, makes sounds back when you talk, turns head toward your voice'],
          ['Early babbling and play sounds', 'About 4 to 6 months', 'Squeals, laughs, raspberries, first consonant sounds', 'By 6 months: takes turns making sounds with you, blows raspberries, squeals'],
          ['Repeated babbling', 'About 6 to 9 months', '"Mamamama," "bababababa," strings of syllables', 'By 9 months: makes lots of different sounds like "mamamama," lifts arms to be picked up'],
          ['First words', 'Around 12 months', '"Mama," "dada" or another special name, with meaning', 'By 12 months: calls a parent "mama," "dada" or a special name, waves bye-bye, understands "no"'],
          ['More single words', 'About 12 to 18 months', '"Ba" for ball, "da" for dog', 'By 15 months: 1 or 2 words besides mama and dada. By 18 months: 3 or more'],
          ['Two-word phrases', 'Around 2 years', '"More milk," "Daddy go"', 'By 2 years: says at least two words together'],
          ['Little sentences', 'About 2 to 2½ years', '"Doggie run," "I do it"', 'By 30 months: about 50 words, two or more words with an action word'],
        ],
      },
      flags: {
        caption: 'Talk to your pediatrician if your baby…',
        headers: ['By about', 'Bring it up if your baby…', 'Source'],
        rows: [
          ['4 months', 'Does not turn their head to find sounds, or does not coo or make sounds back', 'AAP, CDC'],
          ['6 months', 'Does not laugh or make squealing sounds', 'AAP'],
          ['8 months', 'Does not babble', 'AAP'],
          ['12 months', 'Does not wave bye-bye, or does not call a parent "mama," "dada" or another special name', 'CDC'],
          ['15 months', 'Says no words besides "mama" or "dada"', 'CDC'],
          ['18 months', 'Says fewer than 3 words, or does not follow a simple direction like "Give it to me"', 'CDC'],
          ['2 years', 'Does not put 2 words together', 'CDC'],
          ['Any age', 'Loses words or skills they used to have, or does not seem to hear you', 'CDC'],
        ],
      },
    },
`**Most babies say their first real word around 12 months, often "mama," "dada" or a special name for a parent. Talking starts long before that: cooing by about 4 months, babbling from about 4 to 6 months, "mamamama" strings by 9 months, then more words by 18 months and two-word phrases around age 2.**
If you are wondering whether your baby is "behind," you are in good company. Few things make parents compare notes like first words. The good news is that early talking has a fairly predictable order, even though the exact timing varies a lot from baby to baby.
This guide walks through each stage with the milestones the CDC updated in 2022, shows what you can do at home to help, explains how bilingual babies fit in, and lists the signs worth raising with your pediatrician. For every area of development at once, see our [baby milestones by month](/mamabee/articles/baby-milestones-by-month) guide.
## When do babies start talking? The timeline
[[TABLE:timeline]]
A note on how to read this. The CDC's checklists list skills that **most children, 75% or more, reach by a given age**. That means about a quarter of babies reach each one a little later, and plenty reach it earlier. A missing item is a reason to ask, not a diagnosis.
## Before words: how babies learn to talk
### Listening comes first
From birth, your baby is tuning in to voices, especially yours. By 4 months, the CDC lists turning the head toward the sound of your voice. The AAP notes that babies understand far more than they can say, often long before their first word.
### Cooing (by about 4 months)
Cooing is those soft "oooo" and "aahh" vowel sounds. It often happens during calm, face-to-face moments, after a feed or a nap. By 4 months, the CDC lists cooing and **making sounds back when you talk**. That little back-and-forth is your baby's first conversation.
### Babbling (about 4 to 9 months)
The AAP says babies start to babble at about 4 months, using the rhythms of the language they hear around them. By 6 months, the CDC lists taking turns making sounds with you, blowing raspberries and squealing. By 9 months, babbling turns into strings of repeated syllables like "mamamama" and "bababababa."
Babbling is real practice. Your baby is learning to control lips, tongue and breath, and to copy the sounds of your language.
### Gestures (about 9 to 12 months)
Gestures are part of talking. By 9 months, the CDC lists lifting the arms to be picked up. By 12 months, it lists waving bye-bye. Pointing to ask for something or to get help is on the 15 month checklist. Simple signs can help here too: see [baby sign language](/mamabee/articles/baby-sign-language). Signing does not delay speech.
## When do babies say their first word?
Most babies say a first word with meaning around their first birthday. The CDC's 12 month checklist lists calling a parent "mama," "dada" or another special name. The AAP notes there is **a tremendous variance** in when children start to say recognizable words: some have two or three words by their first birthday, others start a few months later.
### What counts as a first word?
A word counts when your baby uses the same sound for the same thing, again and again. It does not have to sound like the adult word. "Ba" for ball, "wawa" for water or "da" for dog all count. The CDC's 15 month checklist uses exactly these kinds of examples.
### Why "mama" and "dada" come early
Sounds like "m," "b" and "d" are easy to make with the lips and the front of the tongue, so they show up in babbling early. Babies often say "mamama" before they mean it. The switch to a real word happens when they start using it for one person.
## From first words to sentences
### 12 to 18 months: one word at a time
After the first word, new words can trickle in slowly. By 15 months, the CDC lists trying to say one or two words besides "mama" or "dada," looking at a familiar object when you name it and following directions given with a gesture and words. By 18 months, it lists **three or more words** besides "mama" or "dada" and following a one-step direction without a gesture.
Understanding grows much faster than speech at this age. A toddler who says five words may understand dozens.
### Around 2 years: two words together
By 2 years, the CDC lists **saying at least two words together**, like "More milk," pointing to things in a book when you ask and pointing to at least two body parts. The AAP describes two-word sentences such as "Ball up" or "Drink milk" around 24 months.
### Around 2½ years: about 50 words
By 30 months, the CDC lists saying about 50 words, putting two or more words together with an action word, like "Doggie run," and using words like "I," "me" or "we."
## How to help your baby start talking
You do not need flashcards or special toys. Everyday talk is the best teacher. The AAP and NHS suggest:
- **Talk all day.** Narrate what you are doing: "Now we put on your socks. One sock, two socks." The AAP says to keep talking to your baby as much as possible.
- **Get face to face.** Hold your baby close and look at them as you talk, so they can see your mouth and expressions.
- **Copy their sounds.** When your baby says "ba," say "ba" back, then add a word: "ba, ball!" The NHS says repeating sounds back teaches babies to take turns.
- **Pause and wait.** Ask a question, then leave a gap for your baby to answer with a sound, a look or a gesture. The AAP suggests responding as if they are speaking.
- **Sing and read.** Songs help babies hear the rhythm of language. From about 6 months, the NHS says you do not have to read the words in a book, just talk about the pictures. A book and a song are an easy part of a [bedtime routine](/mamabee/articles/baby-bedtime-routine).
- **Name things.** Point and label: "Cup. Your blue cup." Short, clear words are easier to pick out.
- **Turn off background noise.** The NHS suggests limiting TV time for toddlers and switching off the TV and radio so your child can hear you.
- **Build on what they say.** If your toddler says "car," you say "Yes, a red car!" No need to correct; just model the right word.
Play is a natural place for all of this. Our [baby play and activities by age](/mamabee/articles/baby-play-and-activities-by-age) guide has simple ideas for each stage.
## Bilingual babies: do two languages delay talking?
No. The AAP says learning more than one language **does not cause speech or language problems**, and that the milestones are the same no matter how many languages a child hears: a first word around 12 months and two-word phrases by 24 months.
A few things are normal for bilingual babies:
- **Count words in all languages.** The AAP says a child's total should be about the same as a child learning one language. A toddler with 25 English words and 25 Spanish words has about 50 words, just like a toddler with 50 English words.
- **Mixing languages is normal.** Using words from both languages in one sentence does not mean your child is confused. The AAP says that by about age 3, most multilingual children can separate their languages.
- **Speak the language you are most comfortable with.** The AAP and NHS both say parents should use the language that feels natural to them. Rich, warm talk in your strongest language helps more than limited talk in a second one.
If a child does have a speech or language problem, the AAP says it **shows up in all the languages** they use. So do not wait just because your baby hears two languages. If you are worried, ask for an evaluation, ideally with a speech-language pathologist who can assess both languages or work with an interpreter.
## Hearing and talking
Babies learn to talk by hearing. In the US, the CDC's goal is a newborn hearing screening before 1 month, a full evaluation before 3 months if needed, and early intervention before 6 months. It is often done before you leave the hospital.
Passing the newborn screen is reassuring, but hearing loss can also develop later. The CDC says that if you think your child might not hear well, **trust your instincts and ask for a hearing test as soon as possible**. The AAP notes that frequent ear infections can leave fluid behind the eardrum, which can affect hearing for a while.
Signs to mention: your baby does not startle at loud sounds, does not turn toward your voice by about 4 months, or stops babbling.
## Late talkers: when to wait and when to ask
Some toddlers understand lots, follow directions and use gestures well, but say few words. Many catch up. Others need a little help, and help works best early. The AAP is clear: **do not "wait and see"** if you are worried. Speech and language delays are highly treatable.
### When to talk to your pediatrician
[[TABLE:flags]]
Also call if your baby seems to have trouble hearing, if you notice any loss of skills, or if your gut says something is off. You know your baby best.
### What happens next
Your pediatrician will usually check your child's development and hearing and may refer you to a speech-language pathologist. In the US, children under 3 can get a **free evaluation** through their state's early intervention program, and you can call the program yourself. Find your program at the [CDC's early intervention finder](https://www.cdc.gov/FindEI). In the UK, the NHS says you can talk to your GP or health visitor.
Born early? Ask your pediatrician whether to use your baby's adjusted age when you compare milestones.
Speech is checked at every well visit, so bring your questions. Our [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule) shows when those visits happen.
## Talking and the rest of development
Babies often focus on one big skill at a time. A baby who is busy learning to crawl or walk may seem to pause on new words, then catch up. Fussy patches around big developmental jumps are common too; our look at [the Wonder Weeks leaps](/mamabee/articles/the-wonder-weeks-leaps) explains what the science does and does not say. Motor milestones like rolling and sitting come in the same first year; see [when do babies roll over](/mamabee/articles/when-do-babies-roll-over).
## Frequently asked questions
### When do babies start talking?
Most babies say a first word with meaning around 12 months. Before that they coo by about 4 months and babble from about 4 to 9 months. By 2 years, the CDC lists putting two words together.
### When do babies say mama and dada?
Babies often babble "mamama" and "dadada" by 9 months without meaning. Using "mama" or "dada" for the right person usually comes around 12 months, which is on the CDC's 1 year checklist.
### When do babies start babbling?
The AAP says babbling starts at about 4 months. By 6 months many babies blow raspberries and squeal, and by 9 months most make repeated sounds like "bababa."
### How many words should a baby say at 1 year?
There is a wide range. Some babies say 2 or 3 words at their first birthday, and others say their first word a few months later. By 18 months, the CDC lists 3 or more words besides "mama" or "dada."
### Do bilingual babies talk later?
No. The AAP says learning two languages does not cause speech delay and the milestones are the same. Count words in both languages together.
### When should I worry if my baby is not talking?
Talk to your pediatrician if your baby does not babble by 8 months, has no words besides "mama" or "dada" by 15 months, says fewer than 3 words by 18 months, does not use two-word phrases by 2 years, or loses words at any age.
## The takeaway
Talking starts with listening, then coos, babbles, gestures and, around the first birthday, a first word. Two-word phrases usually follow around age 2. You do not need special programs: talk, copy your baby's sounds, pause for a reply, read and sing. And if something feels off, ask early. Speech help works best when it starts soon.
## How MamaBee helps
First words are some of the moments you will most want to remember, and some of the first details your pediatrician will ask about. MamaBee is a calm iPhone baby tracker with no ads, built by a small team at Realm Labs to keep those moments and the everyday care in one place.
- **Milestones, free:** check off 45+ CDC milestones as your baby reaches them, so "when did she first wave?" has a real answer.
- **One-thumb logging, free:** sleep, feeds, diapers, activities and custom logs, so you can note a first "mama" in seconds.
- **Both parents in sync:** free real-time sharing for 2 caregivers, so nobody misses a first word that happened at daycare drop-off.
- **Ready for checkups:** export a pediatrician PDF before well visits, alongside growth on WHO percentiles.
[[CTA||Never forget the first "mama." Track milestones free with MamaBee.]]
When you have questions between visits, MamaBee Premium adds unlimited Bee AI, an assistant that knows your log and can help with "is this normal?" moments at any hour. It does not replace your pediatrician, but it can help you get your questions ready. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold.
[[CTA||Every coo, babble and first word in one place. Get MamaBee on iPhone.]]
${sources('cdc2', 'cdc4', 'cdc6', 'cdc9', 'cdc12', 'cdc15', 'cdc18', 'cdc24', 'cdc30', 'cdcabout', 'lang47', 'lang812', 'lang1', 'lang2', 'ms7', 'bilingual', 'concerns', 'nhstalk', 'hearing', 'findei')}
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  A('when-do-babies-roll-over',
    'When Do Babies Roll Over and Sit Up? Ages, Tips & Safety',
    'When do babies roll over? Most roll tummy to back by 6 months and both ways by about 7. See when babies sit up, tummy time tips and when to stop swaddling.',
    ['when do babies roll over', 'when do babies sit up', 'baby rolling over', 'baby sitting up', 'rolling over and swaddling'],
    {
      timeline: {
        caption: 'When do babies roll over and sit up? Typical ages (ranges vary; every baby is different)',
        headers: ['Skill', 'Typical age', 'Source'],
        rows: [
          ['Lifts head during tummy time', 'By 2 months', 'CDC'],
          ['Pushes up onto elbows and forearms on tummy', 'By 4 months', 'CDC'],
          ['First attempts to roll', 'Some babies from about 2 months', 'AAP'],
          ['Rolls tummy to back', 'By 6 months (many earlier)', 'CDC'],
          ['Pushes up with straight arms on tummy', 'By 6 months', 'CDC'],
          ['Sits propped, leaning forward on hands ("tripod")', 'About 4 to 6 months', 'AAP, CDC'],
          ['Rolls both ways (tummy to back and back to tummy)', 'By about 7 months', 'AAP'],
          ['Sits without support once placed', 'About 6 to 8 months; WHO range 3.8 to 9.2 months', 'AAP, WHO'],
          ['Gets into a sitting position alone', 'By 9 months', 'CDC'],
        ],
      },
      sleep: {
        caption: 'Rolling and safe sleep: what to do',
        headers: ['If your baby…', 'What to do (AAP)'],
        rows: [
          ['Is swaddled and shows any sign of trying to roll', 'Stop swaddling now, for naps and nights. Switch to an arms-free sleep sack or footed pajamas'],
          ['Is starting to roll but cannot roll back yet', 'Keep placing them on their back. If they end up on their tummy and cannot roll back, gently turn them over'],
          ['Rolls both ways comfortably', 'Still place them on their back to start. You do not need to keep turning them back if they roll over on their own'],
          ['Is in a weighted sleep sack or swaddle', 'Stop using it. The AAP advises against weighted swaddles, sacks and blankets at any age'],
          ['Has toys, pillows or bumpers in the crib', 'Take them out. A rolling baby could end up face down against soft items'],
        ],
      },
      flags: {
        caption: 'Movement signs to mention to your pediatrician',
        headers: ['By about', 'Mention it if your baby…', 'Source'],
        rows: [
          ['5 to 6 months', 'Does not roll in either direction', 'AAP, CDC'],
          ['6 months', 'Cannot sit with help', 'AAP'],
          ['7 months', 'Head still flops back when you pull them up to sitting', 'AAP'],
          ['9 months', 'Is not sitting by themselves', 'AAP, CDC'],
          ['Any age', 'Seems very stiff or very floppy, reaches with one hand only, uses one side much more, or loses a skill', 'AAP, CDC'],
        ],
      },
    },
`**Most babies roll from tummy to back first, and the CDC lists rolling tummy to back by 6 months. By about 7 months, many babies roll both ways. Sitting comes next: propped up from about 4 to 6 months and on their own by 6 to 9 months. Stop swaddling at the first sign of rolling.**
Rolling is one of the first big "look what I can do" moments. It is also the moment your baby's sleep setup needs to change, and the moment you can no longer leave them on the bed for "just a second."
This guide covers when babies roll over and sit up, using the CDC's 2022 milestone checklists, the AAP and the WHO, plus how tummy time builds both skills, the safe-sleep rules that change once your baby rolls, and when to check in with your pediatrician. For all the first-year milestones in one place, see our [baby milestones by month](/mamabee/articles/baby-milestones-by-month) guide.
## When do babies roll over and sit up? At a glance
[[TABLE:timeline]]
The CDC's checklists list skills that **most babies, 75% or more, reach by that age**. So a quarter of babies get there a little later, and many get there sooner. Ranges, not deadlines.
## When do babies roll over?
### Tummy to back usually comes first
The AAP says most babies roll from stomach to back before the other way. It is a little easier: a baby pushing up on their arms during tummy time shifts their weight, tips to one side and over they go, sometimes to their own surprise.
Some babies start working on rolling as early as 2 months, the AAP notes. By 6 months, the CDC lists **rolling from tummy to back**.
### Back to tummy takes more strength
Rolling from back to tummy needs stronger neck, core and arm muscles, plus the coordination to reach across the body. The AAP says that by the end of the 4 to 7 month period, babies will probably roll in both directions, though the timing varies.
### What about a newborn who "rolls"?
A very young baby can sometimes tip from tummy to back during tummy time, especially if they arch or push off with a strong reflex. It is often more of a topple than a controlled roll. Treat any rolling, accidental or not, as a cue to review sleep safety below.
### Signs your baby is about to roll
- Pushing up on forearms, then straight arms, during tummy time
- Rocking side to side on their back or tummy
- Kicking hard and twisting the hips to one side
- Reaching across their body for a toy
- Rolling onto their side and getting "stuck"
## How to help your baby roll over
Rolling is built on tummy time and plenty of free floor play. The AAP recommends:
- **Start early.** Tummy time can begin the day your baby comes home: 3 to 5 minutes, 2 to 3 times a day.
- **Build up.** Work toward **15 to 30 minutes of tummy time a day by 7 weeks**, spread across short sessions.
- **Pick good moments.** After a diaper change or when your baby wakes from a nap, not right after a big feed.
- **Use toys as targets.** Place a toy just out of reach, or toys in a circle around your baby, to encourage reaching, rolling and later scooting.
- **Try chest-to-chest.** Lie back and put your baby on your chest. Your face is the best motivation to lift their head.
A few more ideas that many parents find helpful:
- **Lots of floor time on the back, too.** A firm blanket on the floor gives room to kick, twist and practice.
- **Show the move.** Gently guide your baby's hips to one side and let them finish the roll.
- **Less time in containers.** Bouncers, swings and car seats are handy, but babies cannot practice rolling in them.
Hates tummy time? Very common. Short, frequent sessions and getting down on the floor face to face help a lot. Our [tummy time guide](/mamabee/articles/tummy-time-guide) has more tricks, including tips for babies with reflux.
## When do babies sit up?
Sitting develops in stages over several months.
### Sitting with support (about 4 to 6 months)
At first your baby sits only when propped, against you or with pillows behind them while you watch closely. Next comes the "tripod" sit: leaning forward with arms out in front for balance. By 6 months, the CDC lists **leaning on hands to support themselves when sitting**. The AAP flags a baby who cannot sit with help by 6 months as a reason to call.
### Sitting without support (about 6 to 9 months)
The AAP says that by about 6 to 8 months, if you place your baby upright, they will stay sitting without leaning on their arms. By 9 months, the CDC lists **sitting without support**. The WHO's motor development study found that healthy babies in several countries learned to sit without support anywhere from **3.8 to 9.2 months**, which shows how wide normal is.
### Getting into sitting alone (by about 9 months)
Getting from lying down to sitting is a separate, harder skill. Many babies figure it out by rolling onto their tummy, pushing up and swinging back onto their bottom. By 9 months, the CDC lists **getting into a sitting position by themselves**.
## How to help your baby sit up
- **Keep up tummy time.** The same neck, back and arm strength that powers rolling powers sitting.
- **Practice in your lap.** Sit your baby between your legs on the floor, so you are the backrest.
- **Use a cushion ring for falls, not as a seat.** A pillow or folded blanket around your baby softens the tumble while they practice. Stay right there.
- **Put toys slightly to the side.** Reaching while sitting builds balance.
- **Skip devices that hold babies upright** before they can sit. They do not teach sitting, and they are not safe for sleep.
## Rolling, swaddling and safe sleep
This is the most important part. Once your baby starts trying to roll, the sleep rules change.
### When to stop swaddling
The AAP says to **stop swaddling as soon as your baby shows any signs of trying to roll over**. Do not wait until they roll both ways. The risk of suffocation is higher if a swaddled baby rolls onto their tummy, because they cannot use their arms to push up or turn their head.
Switch to an arms-free sleep sack or footed pajamas. The AAP says sleep sacks that do not swaddle can be used as long as you like, but never use weighted swaddles, sacks or blankets. Our [how to swaddle a baby](/mamabee/articles/how-to-swaddle-a-baby) guide has tips for the transition, like going one arm out first.
### What if my baby rolls onto their tummy in their sleep?
Always put your baby down on their back for every nap and every night. The AAP says that once your baby is **comfortable rolling both ways**, you do not need to keep turning them back. Until then, if they roll onto their tummy and cannot get back, gently turn them over.
[[TABLE:sleep]]
The rest of the AAP basics still apply: a firm, flat, separate sleep surface with a fitted sheet, nothing soft in the crib and room-sharing without bed-sharing for at least the first 6 months. See our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines) and [how to dress your baby for sleep](/mamabee/articles/dressing-baby-for-sleep) for what to use instead of a swaddle.
### Rolling and sleep disruptions
New skills often show up at night. A baby who just learned to roll may practice in the crib, roll and then protest. This often lines up with the sleep changes around 4 months and again around 6 months. Lots of rolling practice during the day helps. See the [4 month sleep regression](/mamabee/articles/4-month-sleep-regression) and the [6 month sleep regression](/mamabee/articles/6-month-sleep-regression).
## Rolling and falls
The first roll often happens somewhere it should not: a bed, a sofa or a changing table. The AAP says to **never leave a child unattended on a changing table, even for a moment, even if they are strapped in**. The same thinking applies to beds and sofas.
- Change diapers on the floor if you need to step away, or keep one hand on your baby.
- Put your baby on the floor or in the crib, not on the bed, if you need both hands.
- Set infant seats on the floor, never on a table or counter.
Rolling is also a good time to start baby-proofing. Our [baby-proofing checklist](/mamabee/articles/baby-proofing-your-home) walks you through each room.
## Sitting and starting solids
Being able to sit up alone or with support, with good head and neck control, is one of the CDC's signs that a baby may be ready for solid foods, usually around 6 months. See [when to start solids](/mamabee/articles/when-to-start-solids).
## What if my baby is late to roll or sit?
Every baby has their own timetable, and a few things can shift it:
- **Less tummy time.** Babies who spend little time on their tummy often roll a little later. More floor time usually helps.
- **Bigger or very relaxed babies** may take longer to get the push they need.
- **Some babies skip ahead.** A baby who rolls back to tummy first, or goes straight from rolling to sitting, is not doing it wrong.
- **Born early?** Ask your pediatrician whether to use your baby's adjusted age.
Babies also tend to focus on one big skill at a time. A baby working hard on babbling may seem to pause on moving, and the other way around. Our guide to [when babies start talking](/mamabee/articles/when-do-babies-start-talking) covers the language side of this year.
## When to call your pediatrician
[[TABLE:flags]]
If your baby is not meeting one or more milestones, has lost skills or you have other concerns, the CDC says not to wait: talk to your pediatrician and ask about developmental screening. In the US, children under 3 can also be evaluated for free through the state's [early intervention program](https://www.cdc.gov/FindEI).
Also mention a flat spot on the head or a strong preference for turning one way, which tummy time can help with. Motor skills are checked at every well visit, so bring your questions. See the [well baby visit schedule](/mamabee/articles/well-baby-visit-schedule).
## Frequently asked questions
### When do babies roll over?
Most babies roll from tummy to back first, and the CDC lists it by 6 months. Many roll both ways by about 7 months. Some babies start trying as early as 2 months.
### When do babies sit up?
Most babies sit with support, leaning on their hands, from about 4 to 6 months, and sit without support between 6 and 9 months. By 9 months, the CDC lists sitting without support and getting into sitting alone.
### When should I stop swaddling my baby?
As soon as your baby shows any sign of trying to roll over, the AAP says. For some babies that is around 2 months. Switch to an arms-free sleep sack.
### Is it OK if my baby rolls onto their tummy while sleeping?
Always put your baby down on their back. Once they roll both ways comfortably, the AAP says you do not need to keep turning them back.
### Can babies skip rolling over?
Some babies roll very little and move on to sitting and crawling, especially if they spent less time on the floor. If your baby does not roll in either direction by about 6 months, mention it to your pediatrician.
### How can I help my baby roll over?
Give short, frequent tummy time sessions, building to 15 to 30 minutes a day by 7 weeks (AAP), plus lots of free floor play. Toys placed just out of reach encourage reaching and rolling.
## The takeaway
Rolling usually starts with tummy to back, reaches both ways by about 7 months, and sitting follows between about 4 and 9 months. Tummy time and floor play build both. The moment you see any rolling, stop swaddling, keep the crib bare and never leave your baby alone on a raised surface. Celebrate the wobbly progress, and ask your pediatrician if something feels off.
## How MamaBee helps
The first roll often happens when only one of you is watching. MamaBee is a calm iPhone baby tracker with no ads, built by a small team at Realm Labs so the whole family can keep up with every new skill.
- **Milestones, free:** check off 45+ CDC milestones, from rolling to sitting, the day they happen.
- **Log tummy time and play as activities,** along with sleep, feeds and diapers, all free and one-thumb easy.
- **Both parents in sync:** free real-time sharing for 2 caregivers, so the "she rolled!" moment reaches everyone.
- **Ready for checkups:** export a pediatrician PDF with the details your doctor will ask about.
[[CTA||Catch every first roll. Track milestones free with MamaBee.]]
Rolling can shake up sleep, too. MamaBee Premium adds Sleep Coach, which predicts your baby's next nap from their own logged sleep, and unlimited Bee AI, an assistant that knows your log and can help with "is this normal?" questions at any hour. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold.
[[CTA||New skills, rough nights? Get gentle help from MamaBee on iPhone.]]
${sources('cdc2', 'cdc4', 'cdc6', 'cdc9', 'cdcabout', 'move47', 'move812', 'ms7', 'who', 'tummy', 'swaddle', 'safe', 'changing', 'solids', 'findei')}
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),
]

const DRY = !!process.env.DRY
for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  // Safety: never overwrite a published article with this slug.
  const live = await client.fetch('*[_type=="article"&&brand=="mamabee"&&slug.current==$s&&!(_id in path("drafts.**"))][0]._id', {s: a.slug})
  if (live) { console.log(`⛔ skip ${a.slug}: published doc ${live} already exists`); continue }
  let coverFrom = null
  for (const rel of COVERS[a.slug] || []) {
    const src = await client.getDocument(`mamabee-${rel}`)
    if (src && src.coverImage) { doc.coverImage = src.coverImage; coverFrom = rel; break }
  }
  if (!DRY) await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  const ctas = doc.body.filter((b) => b._type === 'appCta').length
  const faqStart = doc.body.findIndex((b) => b.style === 'h2' && b.children[0]?.text === 'Frequently asked questions')
  const faqEnd = doc.body.findIndex((b, i) => i > faqStart && b.style === 'h2')
  const faqs = doc.body.slice(faqStart, faqEnd).filter((b) => b.style === 'h3').length
  const lede = doc.body[0].children.map((s) => s.text).join('').split(/\s+/).filter(Boolean).length
  const hrefs = doc.body.flatMap((b) => (b.markDefs || []).map((d) => d.href).filter(Boolean))
  const internal = [...new Set(hrefs.filter((h) => h.startsWith('/mamabee/')))]
  console.log(`${DRY ? '[DRY] ' : ''}${w >= 1800 && w <= 2600 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${tables} tables, ${faqs} FAQs, ${ctas} CTAs, lede ${lede}w, title ${a.title.length}c, desc ${a.description.length}c, cover from ${coverFrom || 'NONE'}, ${internal.length} internal links)`)
  if (DRY) console.log('   internal:', internal.join(' '))
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
