// Week-16 MamaBee English articles, part A: "thrush-in-babies", "how-to-increase-milk-supply"
// and "how-long-is-breast-milk-good-for", as DRAFTS only (never published by this script).
// Every medical claim cites a source listed at the end of its article (AAP HealthyChildren, CDC,
// NHS, US Office on Women's Health, Academy of Breastfeeding Medicine). No medicine doses.
// Cover images are copied from a related published article. The script never overwrites a
// published document: if mamabee-<slug> is already live, that article is skipped.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week16-en-a.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week16-en-a.mjs
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
  'thrush-in-babies': ['baby-diaper-rash-treatment', 'baby-pacifier-guide', 'baby-eczema-care'],
  'how-to-increase-milk-supply': ['exclusive-pumping-schedule', 'cluster-feeding', 'best-breastfeeding-apps'],
  'how-long-is-breast-milk-good-for': ['exclusive-pumping-schedule', 'introducing-a-bottle-to-breastfed-baby', 'breastfeeding-vs-formula'],
}

// Every URL below was checked with plain curl -sIL (HTTP 200) on 2026-11-27.
const SRC = {
  aapThrush: '[AAP HealthyChildren: Thrush and Other Candida Infections](https://www.healthychildren.org/English/health-issues/conditions/infections/Pages/Thrush-and-Other-Candida-Infections.aspx)',
  nhsOral: '[NHS: Oral Thrush (Mouth Thrush)](https://www.nhs.uk/conditions/oral-thrush-mouth-thrush/)',
  nhsBf: '[NHS Best Start in Life: Thrush and Breastfeeding](https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/breastfeeding/breastfeeding-challenges/thrush/)',
  cdcCandida: '[CDC: About Candidiasis](https://www.cdc.gov/candidiasis/about/index.html)',
  aapDiaper: '[AAP HealthyChildren: Diaper Rash](https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Diaper-Rash.aspx)',
  owhChallenges: "[Office on Women's Health: Common Breastfeeding Challenges](https://womenshealth.gov/breastfeeding/breastfeeding-challenges/common-breastfeeding-challenges)",
  owhMaking: "[Office on Women's Health: Making Breast Milk](https://www.womenshealth.gov/breastfeeding/learning-breastfeed/making-breastmilk)",
  enough: '[AAP HealthyChildren: How to Tell if Baby Is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx)',
  warning: '[AAP HealthyChildren: Warning Signs of Breastfeeding Problems](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Warning-Signs-of-Breastfeeding-Problems.aspx)',
  aapWork: '[AAP HealthyChildren: Expressing Breast Milk at Work](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Expressing-Breastmilk-on-the-Job.aspx)',
  abm: '[Academy of Breastfeeding Medicine: Clinical Protocol #9, Use of Galactogogues (2018 revision)](https://www.bfmed.org/protocols)',
  power: '[Healthline (medically reviewed): Power Pumping](https://www.healthline.com/health/breastfeeding/power-pumping)',
  fever: '[AAP HealthyChildren: Fever, When to Call the Pediatrician](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx)',
  cdcStore: '[CDC: Breast Milk Storage and Preparation](https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html)',
  cdcFaq: '[CDC: Breast Milk Storage Questions and Answers](https://www.cdc.gov/breastfeeding/php/guidelines-recommendations/faqs.html)',
  aapStore: '[AAP HealthyChildren: Storing and Preparing Expressed Breast Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Storing-and-Preparing-Expressed-Breast-Milk.aspx)',
  cdcPump: '[CDC: Breast Pump Hygiene](https://www.cdc.gov/hygiene/about/about-breast-pump-hygiene.html)',
}
const sources = (...keys) => 'Sources: ' + keys.map((x) => { if (!SRC[x]) throw new Error('missing source ' + x); return SRC[x] }).join(', ')

const articles = [

  // ───────────────────────────────────────────── 1. Thrush in babies
  A('thrush-in-babies',
    'Thrush in Babies: Signs, Milk Tongue vs Thrush & Treatment',
    "Thrush in babies: spot white patches that won't wipe off, tell thrush from milk tongue, treat mouth and diaper yeast, and when the nursing parent needs care.",
    ['thrush in babies', 'oral thrush baby', 'milk tongue vs thrush', 'baby yeast diaper rash', 'nipple thrush breastfeeding'],
    {
      compare: {
        caption: 'Milk tongue vs oral thrush: how to tell them apart',
        headers: ['', 'Milk tongue (milk residue)', 'Oral thrush (yeast)'],
        rows: [
          ['Where it shows up', 'Usually only on the top of the tongue', 'Tongue, gums, roof of the mouth, inner cheeks and sometimes the lips'],
          ['What it looks like', 'A thin, fairly even white coating', 'Creamy white or yellowish patches, often compared to cottage cheese'],
          ['The wipe test', 'Wipes away easily with a clean, damp cloth', 'Does not wipe off'],
          ['When you see it', 'Right after a feed, then it fades', 'Stays there between feeds and day after day'],
          ['How your baby acts', 'Feeds and behaves as usual', 'May feed fussily, pull off the breast or bottle, or seem sore'],
          ['What to do', 'Nothing; it is normal', 'Call your pediatrician; it usually needs antifungal treatment'],
        ],
      },
      where: {
        caption: 'Where thrush (Candida yeast) can show up, and what to do',
        headers: ['Where', 'Common signs', 'What usually helps'],
        rows: [
          ["Baby's mouth", 'White or yellow patches on the tongue, gums, cheeks or palate that do not wipe off; fussy feeding', 'Antifungal drops or gel your doctor recommends, plus cleaning anything that goes in the mouth'],
          ['Diaper area', 'Shiny, bright red or pink patches with sharp edges, small red bumps around the edges, worst in the skin folds', 'An antifungal cream your pediatrician recommends, frequent changes and air time'],
          ["Breastfeeding parent's nipples", 'Burning pain after feeds, itchy or shiny, flaky skin, sometimes deep shooting breast pain', 'See your own doctor; treatment for you at the same time as your baby, if both are affected'],
        ],
      },
    },
`**Thrush in babies is a common yeast infection that causes creamy white patches on the tongue, gums, inner cheeks or roof of the mouth that do not wipe off. Milk tongue, by contrast, is a thin white coating that wipes away easily after feeds. Thrush needs antifungal treatment from your doctor, and a breastfeeding parent may need treatment too.**
If you just looked into your baby's mouth and saw white, take a breath. Most of the time it is either harmless milk residue or thrush, and thrush is common, treatable and not a sign that you did anything wrong. This guide shows you how to tell the two apart, what treatment looks like, why the nursing parent and the diaper area matter too, and when to call the doctor.
## What is thrush in babies?
Thrush is an infection caused by Candida, a yeast. The CDC notes that everyone has Candida on their skin and in places like the mouth, and most of the time it causes no symptoms. Thrush happens when it overgrows.
The AAP explains that babies can pick up Candida from their mother before or during birth, and that thrush sometimes follows a course of antibiotics, which upset the normal balance of microbes in the body. Young babies get it often, and it is not a hygiene failure.
## Thrush symptoms in babies
Look for:
- **White or yellowish patches** on the tongue, lips, gums, roof of the mouth or inside the cheeks. The NHS describes them as looking like cottage cheese.
- **Patches that do not wipe off** with a clean cloth.
- **Fussy feeding.** Your baby may latch and pull off, seem unsettled at the breast or bottle, or feed less than usual. The AAP notes that thrush can make swallowing painful.
- **A diaper rash that will not clear,** which can be yeast in the diaper area.
Some babies with thrush seem completely untroubled. Others are clearly sore. Both are common.
## Milk tongue vs thrush: how to tell the difference
Milk tongue is simply milk residue. It is very common in babies who feed often, especially in the first weeks. Thrush is an infection. The quickest check is the wipe test: wrap a clean, damp cloth or piece of gauze around your finger and gently wipe the tongue. Milk residue comes off. Thrush patches stay, and the NHS uses exactly that sign: patches that do not wipe off with a clean cloth.
Do not scrub. If a patch does not come away with a gentle wipe, stop and call your pediatrician.
[[TABLE:compare]]
Still not sure? Check again about an hour after a feed. Milk residue fades between feeds. Thrush is still there, and often in places milk does not coat, such as the inner cheeks.
## How is thrush in babies treated?
Call your pediatrician if you think your baby has thrush. They can usually tell by looking. Treatment is an antifungal medicine for the mouth, given as drops or a gel. The AAP says nystatin is often prescribed for oral thrush.
A few important points:
- **Use only what your baby's doctor recommends,** and follow the instructions on the label or prescription exactly. Do not use adult products or leftover medicine.
- **Age matters.** The NHS says babies under 4 months with signs of thrush should see a doctor. In the UK a pharmacist can suggest a mouth gel for older babies, while in the US treatment for babies usually comes from the pediatrician.
- **Finish the course,** even when the patches fade, unless your doctor tells you otherwise.
- **Give it time.** The AAP says most infections improve within about 2 weeks of starting treatment, and it is not uncommon for thrush to come back.
Keep feeding as usual. If your baby is too sore to feed well, tell your doctor, and watch wet diapers closely. A few days of shorter, fussier feeds can dip your supply a little; our guide to [how to increase milk supply](/mamabee/articles/how-to-increase-milk-supply) explains how to protect it.
## Do I need treatment too if I'm breastfeeding?
Possibly. Thrush can pass between a baby's mouth and the nursing parent's nipples, and the Office on Women's Health lists thrush in a baby's mouth as one cause of nipple thrush.
The NHS lists these signs of nipple and breast thrush:
- **Burning nipple pain,** especially after every feed
- **Itchy or tender nipples**
- **Flaky or shiny skin** on the nipple or areola, which can be harder to see on darker skin
- **White patches, tiny blisters or loss of color** on the nipple or areola
The Office on Women's Health also mentions achy breasts or shooting pains deep in the breast during or after feeds.
If you have these symptoms, see your own doctor or midwife rather than treating yourself from your baby's medicine. The NHS says your GP may take a swab from your nipple and your baby's mouth, that you may both be prescribed treatment, and that treating it matters because otherwise it may come back. Your baby's pediatrician treats your baby; your doctor treats you.
One honest caveat: nipple pain is not always thrush. The NHS points out that a poor latch is a common cause. If feeds hurt, ask a lactation consultant (IBCLC) to watch a feed before you assume yeast.
### Can I keep breastfeeding with thrush?
Yes. The NHS advises carrying on breastfeeding if you can. If it is too painful, express your milk for a while instead; our [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) shows how often to pump to keep your supply going. The NHS also says there is currently no evidence that using milk you expressed during thrush causes reinfection, so you can usually use it. Our guide to [how long breast milk is good for](/mamabee/articles/how-long-is-breast-milk-good-for) covers safe storage.
## Thrush in the diaper area
The same yeast likes warm, damp skin, so it often shows up under the diaper. The AAP describes a yeast diaper rash as shiny, bright red or pink patches with sharp edges, sometimes with small pink bumps or pimples, and usually worse in the groin folds. It can follow antibiotics.
A yeast rash often does not improve with barrier cream alone. Your pediatrician may recommend an antifungal cream. Keep changing diapers often, let the skin air out, and wash your hands well before and after changes. Our [diaper rash treatment guide](/mamabee/articles/baby-diaper-rash-treatment) covers everyday rashes and how to tell them apart.
[[TABLE:where]]
## How to stop thrush from spreading or coming back
- **Clean and sterilize what goes in your baby's mouth.** The Office on Women's Health suggests boiling pacifiers and bottle nipples daily for about 10 minutes during treatment, and replacing pacifiers and bottle nipples after a week of treatment. The AAP links long-lasting thrush to pacifiers or bottles that have not been properly cleaned.
- **Clean pump parts.** The Office on Women's Health says to boil pump parts that touch your milk every day during thrush. Check your pump's instructions for which parts are boil-safe.
- **Wash hands well,** especially after diaper changes, and do not share towels.
- **Wash at a high temperature** the bras, towels and baby clothes that touch the affected area, and change breast pads often (NHS).
- **Treat everyone who needs it** at the same time, so you do not pass it back and forth.
Our [baby pacifier guide](/mamabee/articles/baby-pacifier-guide) has more on keeping pacifiers clean and when to use them.
## When to call your doctor
Call your pediatrician if you think your baby has thrush, and call promptly if your baby:
- Is a newborn, or under 4 months with signs of thrush (NHS)
- Is feeding much less than usual, or is too sore to feed
- Has fewer wet diapers than usual. After the first week, the AAP expects 6 or more wet diapers a day with pale urine. See [how many wet diapers a newborn should have](/mamabee/articles/how-many-wet-diapers-newborn).
- Has a temperature of 100.4°F (38°C) or higher and is under 3 months old. See our [baby fever guide](/mamabee/articles/baby-fever-what-to-do).
- Has patches that are not improving after treatment, keep coming back, or spread beyond the mouth
- Has a diaper rash with fever, blisters, pus or crusty sores, or a rash that is not better after 2 to 3 days of treatment (AAP)
Call your own doctor if you have nipple or breast pain that does not go away, or a red, hot, painful area on the breast with fever or flu-like symptoms, which can be a breast infection. Thrush that keeps returning in a baby or parent is worth a proper check rather than another round of guesswork.
## Frequently asked questions
### Is thrush painful for babies?
It can be. Some babies feed as usual, while others are fussy, pull off the breast or bottle, or find swallowing sore. Tell your pediatrician if your baby is feeding less than usual.
### How long does thrush last in babies?
With treatment, the AAP says most infections improve within about 2 weeks, and thrush can return. Finish the course your doctor recommends, and clean pacifiers, bottle nipples and pump parts during treatment.
### Is thrush contagious?
Candida passes easily between a baby's mouth and a nursing parent's nipples, and through pacifiers and bottle nipples. That is why both of you may need treatment and why cleaning feeding items matters.
### Does milk tongue need treatment?
No. Milk tongue is milk residue that wipes away easily with a clean, damp cloth and fades between feeds. If the white does not wipe off, or appears on the gums or cheeks, call your pediatrician.
### Can I breastfeed if my baby has thrush?
Yes. The NHS advises continuing to breastfeed if you can. If it is too painful, express your milk for a while, and see your own doctor about treatment for your nipples.
### Can a pacifier cause thrush?
A pacifier does not cause thrush by itself, but the AAP links long-lasting thrush to pacifiers or bottles that are not properly cleaned. Clean them often, and boil them daily during treatment.
## The takeaway
White patches that do not wipe off are likely thrush; a thin coating that wipes away is milk tongue. Thrush is common and treatable. Call your pediatrician, use only the treatment they recommend, keep feeding, clean anything that goes in your baby's mouth, and see your own doctor if your nipples burn after feeds. Check for a matching rash in the diaper area, too.
## How MamaBee helps
Thrush means a week or two of watching feeds, diapers and doses closely, often while you are sore yourself. MamaBee is a calm iPhone baby tracker with no ads, built by a small team at Realm Labs to keep track of it all so you do not have to.
- **Log every feed free,** including breastfeeds with left and right timers and bottles, so you can see at a glance whether your baby is feeding less than usual.
- **Track wet and dirty diapers** in one tap, the quickest way to spot a baby who is not getting enough.
- **Log medicine, symptoms and temperature,** so you know whether this morning's dose was given and can show the doctor how the patches changed.
- **Free real-time sync for 2 caregivers,** so whoever does the next feed knows what happened at the last one.
- **Pediatrician PDF export** to bring to the follow-up visit.
MamaBee Premium adds unlimited Bee AI, an assistant that knows your baby's log and can help with "is this normal?" questions at 3 AM. It never replaces your pediatrician. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold.
[[CTA||Know exactly when the last feed and dose were. Track it free with MamaBee.]]
Thrush is one bump in a long first year. Having every feed, diaper and symptom in one place makes the next bump easier, too.
[[CTA||Bring a clear feeding and symptom log to your next visit. Download MamaBee on iPhone.]]
${sources('aapThrush', 'nhsOral', 'nhsBf', 'cdcCandida', 'aapDiaper', 'owhChallenges', 'enough', 'fever')}
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),

  // ───────────────────────────────────────────── 2. How to increase milk supply
  A('how-to-increase-milk-supply',
    "How to Increase Milk Supply: What Works (and What Doesn't)",
    'How to increase milk supply with evidence: feed or pump more often, empty the breast, fix the latch, try power pumping, and why lactation cookies are unproven.',
    ['how to increase milk supply', 'increase breast milk supply', 'low milk supply', 'power pumping', 'lactation cookies'],
    {
      check: {
        caption: 'Does it mean low supply? Common worries vs real warning signs',
        headers: ['What you notice', 'Usually normal?', 'What to do'],
        rows: [
          ['Your baby wants to feed constantly some evenings', 'Yes. Cluster feeding is common and helps build supply', 'Follow your baby; check diapers and weight'],
          ['Your breasts feel softer than in the first weeks', 'Often yes, as supply settles', 'Nothing, if diapers and weight are on track'],
          ['Hungrier days around 2 to 3 weeks, 6 weeks or 3 months', 'Yes. These are common growth spurts (OWH)', 'Feed more often for a few days'],
          ['You pump only a little after a feed', 'Often yes. A pump is not a measure of what your baby drinks', 'Judge by diapers and weight, not pump output'],
          ['Your baby is still below birth weight at 2 weeks', 'No', 'Call your pediatrician for a weight check and see an IBCLC'],
          ['Fewer than 6 wet diapers and 4 stools a day after day 7', 'No', 'Call your pediatrician the same day'],
          ['Your milk has not come in by day 5', 'No', 'Call your pediatrician right away (AAP)'],
        ],
      },
      plan: {
        caption: 'A sample supply-boosting day (adapt it with your IBCLC)',
        headers: ['Part of the day', 'If you breastfeed', 'If you exclusively pump'],
        rows: [
          ['Early morning', 'Nurse on both sides, then pump for at least 10 minutes', 'Double pump for at least 10 minutes, even after the flow slows, then hand express briefly'],
          ['Late morning', 'Nurse on cue, using breast compressions when swallowing slows', 'Pump about 3 hours after the last session'],
          ['Afternoon', 'Nurse on cue, and pump after one more feed if you can', 'Pump about every 3 hours'],
          ['Evening', 'Expect cluster feeds and follow your baby', 'Swap one regular session for a 1-hour power pumping session'],
          ['Night', 'Nurse when your baby wakes; in the early weeks, avoid gaps longer than about 4 hours', 'At least one session; in the early weeks, keep gaps under about 4 hours'],
          ['Daily total', '8 to 12 feeds in 24 hours', '8 or more sessions in the early weeks'],
        ],
      },
    },
`**The most reliable way to increase milk supply is to remove milk more often and more completely: breastfeed or pump 8 to 12 times in 24 hours, offer both breasts, get the latch checked, and add a pumping session after some feeds or a daily power pumping hour. Lactation cookies and herbal supplements have little evidence behind them.**
Worrying about milk supply is one of the most common feelings in early parenthood. Sometimes the worry is real and needs help. Often, supply is fine and the signs are being misread. This guide helps you tell which is which, then walks through the strategies with real evidence behind them, what is mostly marketing, and when to bring in a lactation consultant.
## Is your milk supply actually low?
Start here, because many signs that feel like low supply are normal. The Office on Women's Health says there may be times when you think your supply is low but it is actually just fine, including growth spurts at about 2 to 3 weeks, 6 weeks and 3 months, when babies feed more often for a few days. See [baby growth spurts](/mamabee/articles/baby-growth-spurts). Evening [cluster feeding](/mamabee/articles/cluster-feeding) is another classic false alarm.
The best signs are your baby's diapers and weight. The AAP says a baby who is getting enough usually:
- **Feeds at least 8 to 12 times every 24 hours**
- **Has 6 or more wet diapers a day** by 5 to 7 days old, with pale or nearly clear urine
- **Has at least 3 to 4 yellow, loose stools a day** by 5 to 7 days old
- **Seems satisfied** for an average of 1 to 3 hours between feeds
- **Loses no more than 8 to 10 percent** of birth weight in the first days, then starts gaining
Our guides to [how many wet diapers a newborn should have](/mamabee/articles/how-many-wet-diapers-newborn) and the [baby weight gain chart](/mamabee/articles/baby-weight-gain-chart) go into more detail.
[[TABLE:check]]
If the warning signs in that table apply, call your pediatrician first. A fed baby always comes first; supply work happens alongside, not instead.
## How milk supply works
Milk production runs on supply and demand. "The more often your baby breastfeeds, the more milk your breasts will make," says the Office on Women's Health, and emptying the breasts often tells your body to make more. When milk sits in the breast for long stretches, production slows.
That is why nearly every evidence-based tip below comes back to one idea: more frequent, more complete milk removal. The Academy of Breastfeeding Medicine (ABM) puts it bluntly: no supplement will increase supply if milk is not being removed often and well.
## 9 evidence-based ways to increase milk supply
### 1. Feed or pump more often
Aim for at least 8 to 12 feeds in 24 hours in the early weeks, and follow your baby's hunger cues rather than the clock. If you are pumping, the AAP says low supply is most often caused by skipped sessions or not pumping long enough, and that the fix is to pump more often. One extra session a day is a good start.
### 2. Let your baby finish the first breast, then offer the second
The Office on Women's Health advises breastfeeding often, letting your baby decide when to end the feed, and offering both breasts at each feeding.
### 3. Get the latch checked
A shallow latch removes less milk and often hurts. The Office on Women's Health lists good latch and positioning among the first steps for low supply. If feeds are painful, or your baby clicks, falls asleep quickly or seems hungry after most feeds, ask an IBCLC to watch a feed. Burning pain after every feed can also be [thrush](/mamabee/articles/thrush-in-babies), which needs its own treatment.
### 4. Use breast compressions and hands-on pumping
Breast massage and compression help move more milk, says the Office on Women's Health. Gently squeeze and hold the breast when your baby's swallowing slows, or massage while you pump.
### 5. Pump after some feeds
If your baby does not empty the breast well, pumping after nursing can help (Office on Women's Health). The AAP suggests pumping for at least 10 minutes, even if the milk stops flowing sooner. You do not need to do this after every feed; two or three times a day is a realistic start.
### 6. Try power pumping
Power pumping copies cluster feeding with short, repeated bursts. A common pattern, described in a medically reviewed Healthline guide, takes about an hour: pump 20 minutes, rest 10, pump 10, rest 10, pump 10. Do it once a day in place of a regular session. Healthline says some parents notice a change in 1 to 2 days, but it can take a week or longer, and it may not work for everyone. Our [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) explains how to fit it into a full day.
### 7. Keep night sessions in the early weeks
Long night gaps add up. The AAP lists a newborn who sleeps more than 4 hours at night as a reason to wake them to nurse in the early weeks, and suggests a feed at bedtime if your baby sleeps a long stretch. If you pump, keep at least one overnight session while your supply is building.
### 8. Protect supply when you use formula or bottles
The Office on Women's Health suggests avoiding formula or cereal in addition to breast milk, especially in the first 6 months, unless there is a medical reason. If your pediatrician recommends supplementing, do it, and pump around those feeds so your body still gets the signal. Our guide to [introducing a bottle to a breastfed baby](/mamabee/articles/introducing-a-bottle-to-breastfed-baby) covers paced bottle feeding.
### 9. Make sure your pump works for you
The ABM says expressing technique and pumps must actually be effective. Replace worn parts, use a pump that suits how often you pump, and ask an IBCLC to check your flange fit if pumping hurts or output drops suddenly.
## A sample supply-boosting day
This is one way to combine the steps above. It is not a rule. Pick the parts that fit your life, and keep it going for at least a few days before judging the result.
[[TABLE:plan]]
Look after yourself too. Drink to thirst, eat regular meals and rest when you can. The AAP mentions fluids and rest as ways to keep supply up once it rises. On their own they will not replace milk removal, but a depleted parent pumps and feeds less often.
## Do lactation cookies, teas and supplements work?
Honestly, there is little good evidence. In its 2018 protocol on galactogogues (substances meant to boost milk), the ABM says herbs such as fenugreek, goat's rue and milk thistle have little or no scientific evidence for their effectiveness or safety, and that studies are small and poorly controlled. Traditional foods such as oats appear in the same group. The ABM concludes it cannot recommend any specific galactogogue, herbal or prescription.
- **Lactation cookies** are usually oats, brewer's yeast and flaxseed. They are a fine snack if you enjoy them, but they are not a proven way to make more milk.
- **Herbal supplements** are not standardized, can contain contaminants, and can interact with medicines. The ABM notes reports of severe allergic reactions to fenugreek and warns that some herbs affect blood thinners and blood sugar.
- **Beer** is an old myth. The ABM says alcohol may actually reduce milk production.
- **Prescription medicines** are sometimes used under medical supervision, but the ABM notes the US FDA has advised against domperidone for this purpose. Never start one without your doctor.
If you want to try anything, talk to your doctor or IBCLC first, and keep doing the milk-removal steps, because those are what work.
## What can lower milk supply?
- **Infrequent or short milk removal:** skipped feeds or sessions, long night gaps, or a baby who cannot feed effectively
- **Supplementing without pumping** to replace those feeds
- **Medical causes:** the ABM lists insufficient glandular tissue, previous breast surgery, polycystic ovary syndrome, thyroid problems, retained placenta, heavy bleeding after birth, a new pregnancy, heavy smoking or alcohol use, and some medications
If you suspect one of these, ask your doctor. Some have treatments, and knowing the cause takes the guilt out of it.
## When to see an IBCLC or your doctor
An IBCLC (International Board Certified Lactation Consultant) is the specialist for supply problems. Ask your hospital, birth center or pediatrician for a referral; in the US, the Office on Women's Health helpline is 1-800-994-9662.
Call your pediatrician right away if your baby (AAP warning signs):
- Is still below birth weight at 2 weeks, or gains less than 5 to 7 ounces a week after your milk comes in
- Has fewer than 6 wet diapers and 4 stools a day after day 7, dark yellow urine, or stools still dark instead of yellow
- Seems hungry after most feeds, or you rarely hear swallowing once your milk is in
- Is very sleepy and skips feeds
Call your pediatrician immediately if your milk has not come in by day 5. Call your own doctor for severe nipple pain or cracking, or a hot, painful breast with fever. And if supply stress is wearing you down, say so. See [postpartum recovery and mental health](/mamabee/articles/postpartum-recovery-mental-health).
## Frequently asked questions
### How can I increase my milk supply fast?
Remove milk more often: add feeds or pumping sessions, pump for at least 10 minutes after a couple of feeds a day, and try one daily power pumping hour. Most parents need several days to a week of consistency to see a change.
### Does pumping after breastfeeding increase milk supply?
It can, especially if your baby does not empty the breast well. Pumping after a feed tells your body more milk is needed. Two or three sessions a day is a realistic start. Store any extra milk safely using our [breast milk storage guide](/mamabee/articles/how-long-is-breast-milk-good-for).
### Do lactation cookies really work?
There is no good evidence that they do. The Academy of Breastfeeding Medicine says foods and herbs used to boost milk have little or no proven effect. Frequent, effective milk removal works far better.
### Does drinking more water increase milk supply?
Drink to thirst and stay well fed. There is little evidence that drinking more than you need makes more milk. Frequent milk removal is what drives supply.
### How long does it take to increase milk supply?
Some parents notice a difference within a few days of more frequent feeding or pumping, while others need a week or longer. Track your baby's diapers and weight, or your daily pumping total, to see the trend.
### Is power pumping worth it?
For many parents, yes, as a short-term boost. It takes about an hour a day in place of one session, and it does not work for everyone. If nothing changes after a week or two, see an IBCLC.
## The takeaway
Supply follows demand. Before chasing supplements, check whether supply is really low by looking at diapers and weight. If it is, feed or pump more often, empty the breast well, fix the latch and try power pumping. Skip the cookie hype, keep your baby fed, and get an IBCLC on your side early.
## How MamaBee helps
When you are working on supply, numbers calm the worry: how many feeds today, how many wet diapers, how much you pumped. MamaBee is a calm iPhone baby tracker with no ads, made by a small team at Realm Labs for exactly this kind of fog.
- **Breastfeeding timers for left and right,** free, so you remember which side to start on and how often you are really feeding.
- **Pumping and bottle logs,** free, so you can see your sessions across the day and spot the long gaps.
- **Diaper tracking in one tap,** the best everyday sign that your baby is getting enough.
- **Timeline and 7-day insights** that show how feeds and diapers are trending while you try a new plan.
- **Free real-time sync for 2 caregivers,** so a partner can see when the next session is due and bring the water.
- **Pediatrician PDF export** to share with your doctor or IBCLC.
MamaBee Premium adds unlimited Bee AI, an assistant that knows your log and can help you think through "is this normal?" at 3 AM, and longer 30, 90 and 365-day insights. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold.
[[CTA||See every feed, pump and diaper in one place. Start tracking free with MamaBee.]]
A supply plan only works if you can see whether it is working. Let MamaBee keep the count while you focus on your baby.
[[CTA||Bring real numbers to your lactation visit. Download MamaBee on iPhone.]]
${sources('owhMaking', 'owhChallenges', 'enough', 'warning', 'aapWork', 'abm', 'power')}
This article is general information, not medical advice. Always check with your pediatrician, your doctor or an IBCLC about feeding and milk supply.`),

  // ───────────────────────────────────────────── 3. How long is breast milk good for
  A('how-long-is-breast-milk-good-for',
    'How Long Is Breast Milk Good For? Storage Chart & Warming',
    'How long is breast milk good for? CDC breast milk storage guidelines for room temperature, fridge, freezer and thawed milk, plus how to warm breast milk safely.',
    ['how long is breast milk good for', 'breast milk storage guidelines', 'how to warm breast milk', 'how long can breast milk sit out', 'thawing frozen breast milk'],
    {
      storage: {
        caption: 'Breast milk storage guidelines for healthy full-term babies (CDC)',
        headers: ['Type of breast milk', 'Countertop (77°F / 25°C or colder)', 'Refrigerator (40°F / 4°C)', 'Freezer (0°F / -18°C or colder)'],
        rows: [
          ['Freshly expressed or pumped', 'Up to 4 hours', 'Up to 4 days', 'Within about 6 months is best; up to 12 months is acceptable'],
          ['Thawed, previously frozen', '1 to 2 hours', 'Up to 1 day (24 hours) from when fully thawed', 'Never refreeze milk that has fully thawed'],
          ['Left over from a feeding', 'Use within 2 hours after your baby finishes', 'Do not store; discard after 2 hours', 'Do not freeze'],
        ],
      },
      quick: {
        caption: 'How long is breast milk good for after…? Quick answers',
        headers: ['After…', 'Use it within', 'Source'],
        rows: [
          ['Pumping, left on the counter', '4 hours', 'CDC'],
          ['Pumping, in the fridge', '4 days', 'CDC'],
          ['Pumping, in an insulated cooler with frozen ice packs', '24 hours, then use, refrigerate or freeze', 'CDC'],
          ['Thawing in the fridge', '24 hours, counted from when it is fully thawed', 'CDC'],
          ['Warming or bringing to room temperature', '2 hours', 'CDC'],
          ['Your baby starts drinking from the bottle', '2 hours after the feed ends, then discard', 'CDC'],
        ],
      },
    },
`**Freshly pumped breast milk is good for up to 4 hours at room temperature, 4 days in the fridge and about 6 months in the freezer (up to 12 is acceptable), per the CDC. Thawed milk lasts 1 to 2 hours out or 24 hours in the fridge; never refreeze it. Use leftovers within 2 hours.**
Every ounce of pumped milk took effort, so nobody wants to throw it away for no reason, or give a baby milk that has gone off. This guide puts the CDC breast milk storage guidelines on one page, then covers how to freeze, thaw and warm milk safely, what to do in a power outage, and the small details that trip parents up.
## Breast milk storage chart
[[TABLE:storage]]
An easy way to remember the fresh-milk numbers is the AAP's "rule of 4s": 4 hours at room temperature and 4 days in the refrigerator.
These guidelines are for healthy, full-term babies at home. The AAP notes that hospitals may have their own rules for premature or hospitalized babies, so follow your baby's care team if that applies to you.
### Why do different charts give different freezer times?
You may see slightly different numbers elsewhere. The AAP, for example, says milk keeps up to 9 months in a freezer with a separate door and up to 12 months in a deep chest freezer. The CDC explains that freezing keeps milk safe almost indefinitely, but quality declines over time, which is why it says within 6 months is best. Both agree on the main point: use the oldest milk first.
## How long can breast milk sit out?
Freshly expressed milk can sit at room temperature, 77°F (25°C) or colder, for up to 4 hours (CDC). On a hot day or in a warm room, use it or chill it sooner. If you will not use it within a few hours, refrigerate it.
Thawed milk is more fragile. Once frozen milk has thawed and come to room temperature, the CDC says to use it within 1 to 2 hours.
[[TABLE:quick]]
## How to store breast milk safely
- **Wash your hands** with soap and water, or use a hand sanitizer with at least 60 percent alcohol, before you pump or handle milk (CDC).
- **Use the right containers:** breast milk storage bags or clean, food-grade glass or plastic containers with tight-fitting lids. The CDC says never to use disposable bottle liners or plastic bags that are not made for breast milk.
- **Store small amounts.** Freeze 2 to 4 ounces, or about one feed's worth, so less goes to waste (CDC).
- **Label each container** with the date you expressed it, and your baby's name if it is going to childcare.
- **Keep it at the back** of the fridge or freezer, not in the door, where the temperature changes each time it opens.
- **Leave about an inch at the top** of containers you freeze, because milk expands.
- **Freeze it promptly** if you will not use fresh milk within 4 days.
### Can I combine milk from different pumping sessions?
Yes, but cool it first. The CDC says not to add freshly pumped warm milk to milk that is already cold or frozen, because it can rewarm the older milk. Chill the new milk in the fridge, then combine. When you mix milk from different days, go by the date of the oldest milk.
## How to thaw frozen breast milk
Use the oldest milk first. The CDC suggests three ways to thaw:
- **In the refrigerator overnight**
- **In a bowl of warm or lukewarm water**
- **Under lukewarm running water**
Never thaw milk in the microwave. Once milk is fully thawed, use it within 24 hours, counting from when it finished thawing, not from when you took it out of the freezer (CDC). Never refreeze milk that has fully thawed.
### Partly thawed milk
The CDC says milk that has started to thaw but still has ice crystals can be refrozen. Milk that has completely thawed but still feels cold should go in the fridge and be used within the next day, or thrown away.
## How to warm breast milk
Warming is optional. The CDC says breast milk does not need to be warmed and can be served at room temperature or cold. Some babies care, many do not.
If your baby prefers it warm:
- **Keep the container sealed** and set it in a bowl of warm water, or hold it under warm, not hot, running water for a few minutes.
- **Swirl, do not stir hard,** to mix back in any fat that has separated.
- **Test a few drops on your wrist.** It should feel warm, not hot.
- **Never use the microwave or stove.** The CDC warns that microwaves can destroy nutrients and create hot spots that can burn your baby's mouth.
- **Using a bottle warmer?** Follow the manufacturer's instructions and still test the temperature on your wrist.
Once milk has been warmed or brought to room temperature, use it within 2 hours.
## Leftover milk after a feed
Once your baby has drunk from a bottle, the CDC says to use the leftover milk within 2 hours after the feed ends, then throw it away. If you often pour milk down the drain, warm smaller amounts and offer more if your baby is still hungry. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) and [how much should a newborn eat](/mamabee/articles/how-much-should-a-newborn-eat) can help you size bottles.
## Does stored breast milk look or smell different?
It often does, and that is usually fine. Stored milk separates into a creamy layer on top and thinner milk below, which is why the CDC tells you to swirl it. Color can vary from feed to feed. Some parents notice that thawed milk smells soapy or metallic. Lactation consultants usually put this down to natural enzymes in milk, and many babies drink it happily.
Milk that smells clearly sour or spoiled, or that is past the storage times above, should be thrown out. If you are not sure, ask your pediatrician or an IBCLC.
## Power outages, travel and childcare
### In a power outage
The CDC says a full freezer keeps food frozen for about 48 hours, or about 24 hours if it is half full, and an unopened refrigerator keeps food cold for about 4 hours. Keep the doors closed. When power returns, milk that still has ice crystals can be refrozen; fully thawed milk goes in the fridge and is used within a day.
### Traveling with breast milk
Milk keeps in an insulated cooler with frozen ice packs for up to 24 hours (CDC). When you arrive, use it, refrigerate it or freeze it. Our [flying with a baby](/mamabee/articles/flying-with-a-baby) guide has more travel tips.
### Milk for childcare
Label every container with your baby's name and the date, and ask your provider about their own rules (CDC).
## Keep pump parts clean
Clean storage starts with clean pumping. The CDC says to clean pump parts that touch milk as soon as possible after every session and to air-dry them on a clean towel. It also says to sanitize them at least once a day, which matters most for babies under 2 months, babies born early or babies with a weakened immune system. Boiling for 5 minutes, steaming, or a dishwasher sanitize cycle all work if your pump parts are dishwasher-safe.
If you or your baby has thrush, see our guide to [thrush in babies](/mamabee/articles/thrush-in-babies) for extra cleaning steps.
## When to check with your pediatrician
Talk to your pediatrician or your baby's hospital team if your baby was born early or is in the hospital, because storage rules may be stricter. Ask too if your baby is unwell, if you are taking a new medicine and wonder about your milk, or if you are building a freezer stash because your supply feels low. Our guide to [how to increase milk supply](/mamabee/articles/how-to-increase-milk-supply) can help with that.
## Frequently asked questions
### How long is breast milk good for in the fridge?
Freshly expressed milk keeps up to 4 days in the refrigerator at 40°F (4°C) or colder, stored at the back, not in the door (CDC). If you will not use it within 4 days, freeze it.
### How long can breast milk sit out at room temperature?
Up to 4 hours for freshly pumped milk at 77°F (25°C) or colder. Thawed milk should be used within 1 to 2 hours once it reaches room temperature (CDC).
### How long is breast milk good for after warming?
Use warmed milk within 2 hours. Once your baby starts drinking from the bottle, use the rest within 2 hours after the feed ends, then throw it away (CDC).
### Can you refreeze breast milk?
Not once it has fully thawed. The CDC says milk that still has ice crystals can be refrozen, but fully thawed milk should be refrigerated and used within 24 hours.
### How do you warm breast milk without a bottle warmer?
Set the sealed bottle or bag in a bowl of warm water, or hold it under warm running water for a few minutes. Swirl it and test a few drops on your wrist. Never use the microwave or stove.
### Do you have to warm breast milk?
No. The CDC says breast milk can be served cold or at room temperature. Warming is only for babies who prefer it.
## The takeaway
Remember 4, 4 and 6 to 12: fresh milk lasts 4 hours on the counter, 4 days in the fridge and 6 to 12 months in the freezer. Thawed milk lasts 24 hours in the fridge, never refreeze it, and use any leftovers within 2 hours. Thaw and warm with water, never the microwave, and label everything with the date.
## How MamaBee helps
Pumping comes with a lot of small numbers to hold in your head: when you last pumped, how much, and which bottle came from when. MamaBee is a calm iPhone baby tracker with no ads, made by a small team at Realm Labs to carry those numbers for you.
- **Pumping logs, free,** so you can see every session and the gaps between them at a glance.
- **Bottle logs, free,** so you know when your baby last ate and how much, which makes it easier to warm the right amount.
- **Timeline and 7-day insights** showing how feeds and pumping are trending, handy when you are building a freezer stash or returning to work.
- **Free real-time sync for 2 caregivers,** so a partner, grandparent or sitter sees what was fed and when.
- **Pediatrician PDF export** for checkups.
MamaBee Premium adds unlimited Bee AI, an assistant that knows your log and can help with "how long has this bottle been out?" kinds of questions at 3 AM, and longer 30, 90 and 365-day insights. Your logs stay on your phone unless you turn on Co-Parent Sharing, and they are never sold.
[[CTA||Never wonder when you last pumped. Log every session free with MamaBee.]]
Every ounce you pump is worth protecting. Our [exclusive pumping schedule](/mamabee/articles/exclusive-pumping-schedule) helps you plan the sessions, and MamaBee helps you keep track of them.
[[CTA||Make pumping, bottles and handoffs easier. Download MamaBee on iPhone.]]
${sources('cdcStore', 'cdcFaq', 'aapStore', 'cdcPump')}
This article is general information, not medical advice. Always check with your pediatrician about your baby.`),
]

const DRY = !!process.env.DRY
for (const a of articles) {
  const live = await client.getDocument(`mamabee-${a.slug}`)
  if (live) { console.log(`⏭  skip ${a.slug}: a published document already exists`); continue }
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
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
