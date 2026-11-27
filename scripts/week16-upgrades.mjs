// Week-16 (2026-11-27) MamaBee EN upgrades of PUBLISHED articles, saved as DRAFTS only.
// For each article: read the published doc `mamabee-<slug>` (or, if this script already made a
// draft, that draft `drafts.mamabee-<slug>`), insert only the additions listed in
// reports/briefs/WEEK16-BRIEF.md (Agent C) as new Portable Text blocks with fresh _keys, and save
// the whole doc to `drafts.mamabee-<slug>` with createOrReplace. The published doc is never
// written; every existing block, link, CTA, table and the cover are kept as they are.
// Idempotent: each addition has a check and is skipped when already present.
// Cross-link targets how-to-increase-milk-supply, how-long-is-breast-milk-good-for,
// when-do-babies-start-talking and when-do-babies-roll-over (and thrush-in-babies) are this week's
// same-batch drafts and publish together.
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week16-upgrades.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week16-upgrades.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+k();if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
// Same mini-syntax as week13/15 (## ### > - [[TABLE:key]] [[CTA||heading]]) plus "1. " numbered items.
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(/^\d+\. /.test(line))out.push(block('normal',line.replace(/^\d+\. /,''),{listItem:'number',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}

const A = (s) => `/mamabee/articles/${s}`
const text = (b) => (b.children || []).map((s) => s.text).join('')
const words = (blocks) => { let w = 0; for (const b of blocks) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length; return w }
const hasHref = (body, href) => JSON.stringify(body).includes(`"href":"${href}"`)
const hasHeading = (body, h) => body.some((b) => b._type === 'block' && /^h[23]$/.test(b.style) && text(b).trim() === h)
const hasTextStart = (body, start) => body.some((b) => b._type === 'block' && text(b).startsWith(start))
const findH = (body, h, style = 'h2') => { const i = body.findIndex((b) => b._type === 'block' && b.style === style && text(b).trim() === h); if (i < 0) throw new Error(`heading not found: ${h}`); return i }
const findText = (body, start) => { const i = body.findIndex((b) => b._type === 'block' && text(b).startsWith(start)); if (i < 0) throw new Error(`block not found: ${start}`); return i }
// index of the next h2 after i (or body.length): the end of the section that starts at i
const sectionEnd = (body, i) => { const j = body.findIndex((b, n) => n > i && b._type === 'block' && b.style === 'h2'); return j < 0 ? body.length : j }
const FAQ = 'Frequently asked questions'
// insert FAQ items at the end of the FAQ section (just before the next h2, usually "The takeaway")
const faqEnd = (body) => sectionEnd(body, findH(body, FAQ))

const SRC = {
  aapFormula: 'https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx',
  cdcFormula: 'https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/how-much-and-how-often.html',
  cdcBreast: 'https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/how-much-and-how-often.html',
  aapSolids: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
  aapDrinks: 'https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Recommended-Drinks-for-Young-Children-Ages-0-5.aspx',
  cdcCowMilk: 'https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/cows-milk-and-milk-alternatives.html',
  aapEnough: 'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx',
  aapRash: 'https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Diaper-Rash.aspx',
  nhsRash: 'https://www.nhs.uk/baby/caring-for-a-newborn/nappy-rash/',
  sfThrough: 'https://www.sleepfoundation.org/baby-sleep/when-do-babies-sleep-through-night',
  aasm: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/',
  aapSafe: 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx',
  aapGetSleep: 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx',
}

// Each op: {name, done(doc) -> bool (already present → skip), apply(doc) -> blocks inserted}
const UPGRADES = {
  // 1 ─────────────────────────────────────────────────────────────────────────
  'wake-windows-by-age': {
    description: 'Wake windows by age from newborn to 12 months, including newborn wake windows, sleepy cues and overtired signs, plus a chart for easy nap timing.',
    ops: [
      {
        name: 'H2 Newborn wake windows (0–4 weeks and 1–3 months)',
        done: (d) => hasHeading(d.body, 'Newborn wake windows (0–4 weeks and 1–3 months)'),
        apply: (d) => {
          const blocks = md(`## Newborn wake windows (0–4 weeks and 1–3 months)
**Newborn wake windows are short: about 35 to 60 minutes in the first month, counting the feed, diaper change and cuddles. Between 1 and 2 months they stretch to about 45 to 90 minutes, and by 3 to 4 months to about 75 to 120 minutes. Many newborns are ready to sleep again soon after a feed.**
These are the same starting ranges as the chart above, zoomed in on the first three months, when most parents are surprised by how little awake time a baby can handle.
[[TABLE:newborn]]
Newborns also sleep a lot overall. The Sleep Foundation says babies from birth to 3 months need about 14 to 17 hours of sleep in 24 hours, spread across day and night ([Sleep Foundation](${SRC.sfThrough})).
### What counts as awake time for a newborn?
The wake window starts the moment your baby wakes up, not when the feed ends. In the first weeks a feed can take 20 to 40 minutes, so a 45-minute window may leave only a few minutes for a diaper change and some face-to-face time. That is normal. If your newborn falls asleep at the breast or bottle, the window simply ends early.
### Sleepy cues in newborns
Newborn cues are subtle and pass quickly, so start winding down at the first ones:
- **Staring into space** or a glazed, faraway look
- **Turning away** from faces, lights or toys
- **Yawning**, slower or jerkier movements
- **Red or pink eyebrows** and eyelids, rubbing eyes or face
- **Fussing** that a feed or a diaper change does not fix
### Signs your newborn is overtired
If the window ran long, you may see:
- Hard crying that is difficult to soothe, often with an arched back
- Fighting sleep even though your baby is clearly tired
- Very short catnaps, or waking soon after being put down
- A wired, wide-eyed "second wind", often in the evening
When this happens, keep things calm and dim, offer contact, rocking or a feed, and try a slightly shorter window for the next nap. The evening fussy stretch is common in the early weeks too; our [newborn witching hour](${A('newborn-witching-hour')}) guide covers it.
### Newborn wake window tips
- **Count from wake-up.** Note when your baby opens their eyes and plan the next sleep from there.
- **Do not keep a newborn up to "tire them out".** It usually leads to more crying and worse sleep, not better nights.
- **Bright days, dark nights.** Daylight and normal noise by day and dim, quiet night feeds help the body clock form.
- **Contact naps are fine.** Many newborns nap best on a caregiver. For safe sleep, put your baby down on their back on a firm, flat, separate surface with nothing else in it, as the [AAP advises](${SRC.aapSafe}). See our [safe sleep guide](${A('safe-sleep-guidelines')}).
- **Call your pediatrician** if your newborn is very hard to wake for feeds, too sleepy to feed well, or has fewer wet diapers than usual.
For a sample day at each stage, see the [newborn sleep schedule](${A('newborn-sleep-schedule')}), [1 month old sleep schedule](${A('1-month-old-schedule')}), [2 month old sleep schedule](${A('2-month-old-schedule')}) and [3 month old sleep schedule](${A('3-month-old-schedule')}). The [wake window calculator](/mamabee/tools/wake-window-calculator) suggests the next nap time from your baby's age and wake-up time.`, {
            newborn: {
              caption: 'Newborn wake windows: typical starting ranges (adjust to your baby\'s cues)',
              headers: ['Age', 'Wake window', 'Naps per day', 'What awake time looks like'],
              rows: [
                ['0–4 weeks', '35–60 min', '6–8 (short)', 'Feed, burp, diaper change, a few minutes of eye contact, then sleep'],
                ['1–2 months', '45–90 min', '5–7', 'More alert time, first social smiles, short tummy time'],
                ['2–3 months', 'Moving from 45–90 min toward 75–120 min', '4–5', 'Longer, more playful stretches; naps start to form a loose pattern'],
              ],
            },
          })
          const at = findH(d.body, 'How to read sleepy cues')
          d.body.splice(at, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'FAQ: newborn wake windows',
        done: (d) => hasHeading(d.body, 'How long should a newborn be awake between naps?'),
        apply: (d) => {
          const blocks = md(`### How long should a newborn be awake between naps?
About 35 to 60 minutes in the first month, including the feed. Between 1 and 2 months most babies manage about 45 to 90 minutes, and by 3 to 4 months about 75 to 120 minutes.
### Do newborn wake windows include feeding time?
Yes. The window starts when your baby wakes up, so feeding, burping and changing all count. In the first weeks the feed can take up most of it.
### Is it bad if my newborn stays awake for 2 hours?
It happens, especially during evening cluster feeding, and one long stretch is not harmful. If it happens often and your baby is fussy, offer sleep sooner. If your newborn is instead unusually sleepy or hard to wake for feeds, call your pediatrician.`)
          const at = faqEnd(d.body)
          d.body.splice(at, 0, ...blocks)
          return blocks
        },
      },
    ],
  },

  // 2 ─────────────────────────────────────────────────────────────────────────
  'baby-feeding-schedule-by-age': {
    ops: [
      {
        name: 'H2 Baby feeding schedule by month (1, 2, 3, 6, 9, 12)',
        done: (d) => hasHeading(d.body, 'Baby feeding schedule by month: 1, 2, 3, 6, 9 and 12 months'),
        apply: (d) => {
          const blocks = md(`## Baby feeding schedule by month: 1, 2, 3, 6, 9 and 12 months
Here is how feeding usually looks at the ages parents ask about most. Each month has how often babies tend to eat, typical amounts from the AAP and CDC, and a sample rhythm. The times are examples only. Breastfed babies feed on cue and often more frequently than a bottle-fed day suggests, and that is normal.
[[TABLE:bymonth]]
The AAP's rule of thumb for formula is about 2½ ounces per pound of body weight per day, averaging no more than about 32 ounces in 24 hours ([AAP](${SRC.aapFormula})). Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) gives a rough estimate for your baby's weight.
### 1 month
- **How often:** breastfed babies nurse about 8 to 12 times in 24 hours, usually every 2 to 4 hours, sometimes hourly in an evening cluster ([CDC](${SRC.cdcBreast})). Formula-fed babies feed about every 3 to 4 hours ([CDC](${SRC.cdcFormula})).
- **How much:** by the end of the first month, many formula-fed babies take about 3 to 4 ounces per feed ([AAP](${SRC.aapFormula})).
- **Sample rhythm (formula):** 7 AM, 10 AM, 1 PM, 4 PM, 7 PM and 10 PM, plus 1 to 2 night feeds. Breastfed babies usually fit in more feeds than this.
See [how much should a newborn eat](${A('how-much-should-a-newborn-eat')}) for amounts week by week, and the [1 month old schedule](${A('1-month-old-schedule')}) for a full day with naps.
### 2 months
- **How often:** breastfed babies still nurse about 8 to 12 times a day, though some settle at a few fewer. Formula-fed babies feed about every 3 to 4 hours.
- **How much:** about 4 to 5 ounces per bottle for most formula-fed babies, within the AAP's average of about 32 ounces a day or less.
- **Sample rhythm (formula):** 7 AM, 10 AM, 1 PM, 4 PM and a 7 PM bedtime feed, plus 1 to 2 night feeds. Between 2 and 4 months, many formula-fed babies no longer need a middle-of-the-night feed, according to the AAP.
More in our [2 month old schedule](${A('2-month-old-schedule')}).
### 3 months
- **How often:** feeds become quicker and a little more spread out. Many breastfed babies nurse about 6 to 8 times a day, some more. Formula-fed babies feed about every 3 to 4 hours.
- **How much:** about 4 to 5 ounces per bottle is typical.
- **Sample rhythm (formula):** 7 AM, 10:30 AM, 2 PM, 5:30 PM and a 7:30 PM top-up before bed, often with 1 night feed.
More in our [3 month old schedule](${A('3-month-old-schedule')}).
### 6 months
- **How often:** 4 to 5 milk feeds a day, plus first solids once your baby shows the signs of readiness.
- **How much:** the AAP says babies typically take 6 to 8 ounces at each of 4 or 5 feeds by 6 months ([AAP](${SRC.aapFormula})). Breast milk or formula is still the main nutrition, and solids start as small tastes ([AAP: starting solids](${SRC.aapSolids})). Small sips of water from a cup with meals are fine, about 4 to 8 ounces a day at most ([AAP](${SRC.aapDrinks})).
- **Sample rhythm:** 7 AM milk, 8 AM solids, 10:30 AM milk, 2 PM milk, 5:30 PM solids and a 6:30 PM bedtime milk feed.
See [when to start solids](${A('when-to-start-solids')}) for readiness signs and first foods, and the [6 month old schedule](${A('6-month-old-schedule')}) for naps.
### 9 months
- **How often:** 3 to 4 milk feeds a day around 3 solid meals, with 1 to 2 snacks for many babies.
- **How much:** 7 to 8 ounces per bottle, around 24 ounces a day in total, with solids now adding real calories. Offer soft finger foods and a cup with meals.
- **Sample rhythm:** 7 AM milk, 8 AM breakfast, 11 AM milk, 12 PM lunch, 3 PM milk and a snack, 5:30 PM dinner and a 6:45 PM milk feed before bed.
More in our [9 month old schedule](${A('9-month-old-schedule')}).
### 12 months
- **How often:** 3 meals and 2 snacks a day, with milk served alongside. Breastfeeding can continue as long as you both want.
- **How much:** at 12 months babies can switch from formula to whole cow's milk, but not before ([CDC](${SRC.cdcCowMilk})). The AAP suggests about 16 ounces (2 cups) of whole milk a day for 12 to 24 month olds ([AAP](${SRC.aapDrinks})).
- **Sample rhythm:** 7:30 AM breakfast with about 4 ounces of milk in a cup, 9:30 AM snack, 12 PM lunch with milk, 3 PM snack, 5:30 PM dinner with milk.
For the full switch to whole milk and cups, see our [12 month old schedule](${A('12-month-old-schedule')}).`, {
            bymonth: {
              caption: 'Baby feeding schedule by month (typical ranges; follow your baby\'s cues)',
              headers: ['Age', 'How often', 'Typical formula amount', 'Solids'],
              rows: [
                ['1 month', 'Breastfed 8–12 times a day; formula about every 3–4 hrs', 'About 3–4 oz per feed by the end of the month (AAP)', 'None'],
                ['2 months', 'Breastfed 8–12 times a day (some fewer); formula every 3–4 hrs', 'About 4–5 oz', 'None'],
                ['3 months', 'Breastfed often 6–8+ times a day; formula every 3–4 hrs', 'About 4–5 oz', 'None'],
                ['6 months', '4–5 milk feeds', '6–8 oz per feed (AAP); no more than about 32 oz a day', 'Starting: 1 small meal, then 2'],
                ['9 months', '3–4 milk feeds', '7–8 oz; around 24 oz a day', '3 meals + 1–2 snacks'],
                ['12 months', 'Milk with meals and snacks', 'Whole milk about 16 oz a day (AAP)', '3 meals + 2 snacks'],
              ],
            },
          })
          // after the 9–12 months section's CTA, before "What a day roughly looks like, by stage"
          const at = findH(d.body, 'What a day roughly looks like, by stage')
          d.body.splice(at, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'FAQ: feeding by month',
        done: (d) => hasHeading(d.body, 'How much should a 2 month old eat?'),
        apply: (d) => {
          const blocks = md(`### How much should a 2 month old eat?
Most formula-fed 2 month olds take about 4 to 5 ounces every 3 to 4 hours, with no more than about 32 ounces a day (AAP). Breastfed babies usually still nurse about 8 to 12 times in 24 hours.
### How much milk does a 12 month old need?
The AAP suggests about 16 ounces (2 cups) of whole milk a day for 12 to 24 month olds, served in a cup with meals and snacks. Breastfed toddlers can keep nursing.`)
          d.body.splice(faqEnd(d.body), 0, ...blocks)
          return blocks
        },
      },
    ],
  },

  // 3 ─────────────────────────────────────────────────────────────────────────
  'baby-diaper-rash-treatment': {
    ops: [
      {
        name: 'Bold answer-first paragraph at top',
        done: (d) => hasTextStart(d.body, 'The best diaper rash treatment for babies'),
        apply: (d) => {
          const blocks = md(`**The best diaper rash treatment for babies is simple: change diapers as soon as they are wet or dirty, clean gently with water, pat dry, allow diaper-free time and apply a thick layer of zinc oxide or petroleum barrier cream at every change. Most rashes improve within 2 to 3 days. If not, call your pediatrician.**`)
          d.body.splice(0, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'H2 Diaper rash treatment, step by step',
        done: (d) => hasHeading(d.body, 'Diaper rash treatment, step by step'),
        apply: (d) => {
          const blocks = md(`## Diaper rash treatment, step by step
Follow these steps at every diaper change until the skin has healed. They match the advice from the [AAP](${SRC.aapRash}) and the [NHS](${SRC.nhsRash}).
1. **Change the diaper promptly.** Take off a wet or dirty diaper as soon as you notice it, including once overnight if the rash is sore.
2. **Clean gently.** Use lukewarm water and a soft cloth, or alcohol-free and fragrance-free wipes. For poop, a mild, fragrance-free cleanser helps. Avoid soap, bubble bath and scented products.
3. **Pat dry and air out.** Pat, never rub, then let the skin air-dry for a few minutes. Some diaper-free time on a towel each day speeds healing.
4. **Apply a thick barrier layer.** Spread zinc oxide paste or petroleum jelly thickly over the red area. At the next change, wipe away only the soiled part and add more on top rather than scrubbing it all off.
5. **Put on a fresh diaper loosely.** Choose a highly absorbent diaper and do not fasten it too tightly, especially overnight.
6. **Bathe once a day** in plain lukewarm water while the skin is irritated, then pat dry and reapply the barrier cream.
7. **Check progress after 2 to 3 days.** If the rash is fading, keep going. If it is not better, is getting worse or spreading, call your pediatrician. It may be yeast or a bacterial infection that needs a prescription.
**What to skip:** talcum or cornstarch powder, antiseptic creams, and over-the-counter antibiotic ointment, which the AAP advises against for diaper rash. Do not use steroid creams unless your doctor recommends one.`)
          // right after the "How to treat diaper rash fast" section
          const at = sectionEnd(d.body, findH(d.body, 'How to treat diaper rash fast'))
          d.body.splice(at, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'H2 Types of diaper rash (+ thrush-in-babies link)',
        done: (d) => hasHeading(d.body, 'Types of diaper rash'),
        apply: (d) => {
          const blocks = md(`## Types of diaper rash
Not every red bottom is the same rash, and the type decides the treatment. The three main types are irritant, yeast (candida) and bacterial.
[[TABLE:types]]
### Irritant diaper rash
This is the most common type. Urine, poop, friction and sometimes a new wipe, diaper brand or detergent irritate the skin wherever the diaper touches it. It usually responds to frequent changes and a thick barrier cream within 2 to 3 days.
### Yeast (candida) diaper rash
Yeast loves warm, damp skin. Look for shiny, bright red or pink patches with sharp edges, often worst in the skin folds of the groin, sometimes with small red spots around the edges. It often follows a course of antibiotics, for your baby or for a breastfeeding parent. Barrier cream alone does not clear it, so your pediatrician may recommend or prescribe an antifungal cream ([AAP](${SRC.aapRash})).
The same yeast causes oral thrush, so check your baby's mouth too. White patches on the tongue, gums or inner cheeks that do not wipe away can be thrush, and the breastfeeding parent may need treatment at the same time. See our guide to [thrush in babies](${A('thrush-in-babies')}).
### Bacterial diaper rash
This is rare. Staph bacteria can cause yellow crusting, weeping or pimples, and strep can cause bright red skin around the anus. The AAP says any infection in the diaper area needs to be confirmed and treated by your child's doctor, and advises against over-the-counter antibiotic ointment. Call your pediatrician the same day if you see these signs, or if your baby has a fever with the rash.
A rash that also appears outside the diaper area may be eczema or another skin condition. Our [baby eczema care](${A('baby-eczema-care')}) guide can help you tell the difference.`, {
            types: {
              caption: 'Types of diaper rash at a glance',
              headers: ['Type', 'What it looks like', 'Common triggers', 'What helps'],
              rows: [
                ['Irritant (most common)', 'Pink or red skin where the diaper touches; skin folds often spared', 'Wetness, poop, friction, a new wipe, diaper or detergent', 'Frequent changes, air time, thick zinc oxide or petroleum barrier'],
                ['Yeast (candida)', 'Shiny bright red or pink patches with sharp edges, worse in folds, small red spots at the edges', 'Antibiotics; a rash lasting more than 2–3 days; warm, damp skin', 'See your pediatrician; an antifungal cream is often needed'],
                ['Bacterial (staph or strep)', 'Yellow crusts, weeping, pimples or blisters; bright red skin around the anus', 'Broken or very irritated skin', 'Call your pediatrician; needs a doctor\'s diagnosis and treatment'],
              ],
            },
          })
          // after the existing yeast section, before "When to call the doctor"
          const at = findH(d.body, 'When to call the doctor')
          d.body.splice(at, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'FAQ: diaper rash',
        done: (d) => hasHeading(d.body, 'How long does diaper rash take to heal?'),
        apply: (d) => {
          const blocks = md(`### How long does diaper rash take to heal?
Most simple diaper rash improves within 2 to 3 days of frequent changes, air time and a thick barrier cream. If it is not better by then, or it gets worse, call your pediatrician.
### Is petroleum jelly or zinc oxide better for diaper rash?
Both work as barriers that keep moisture off the skin. Zinc oxide paste is a common first choice for a sore rash, and petroleum jelly is a good gentle option for prevention. A thick layer at every change matters more than the brand.
### What does a yeast diaper rash look like?
Shiny, bright red or pink patches with sharp edges, often in the skin folds, with small red spots around the edges. It does not clear with barrier cream alone, so see your pediatrician.
### When should I worry about diaper rash?
Call your pediatrician if the rash has blisters, pus, open sores or yellow crusts, spreads beyond the diaper area, comes with a fever, seems very painful, or does not improve after 2 to 3 days.`)
          d.body.splice(faqEnd(d.body), 0, ...blocks)
          return blocks
        },
      },
    ],
  },

  // 4 ─────────────────────────────────────────────────────────────────────────
  'how-to-get-baby-to-sleep-through-the-night': {
    ops: [
      {
        name: 'Direct answer box at top',
        done: (d) => hasTextStart(d.body, 'Short answer: most babies'),
        apply: (d) => {
          const blocks = md(`> **Short answer: most babies can sleep a 6-hour stretch, the usual meaning of "through the night", somewhere around 4 to 6 months, but many take longer. To help your baby sleep through the night, keep a consistent bedtime routine, time sleep with wake windows, put your baby down drowsy but awake and keep night wake-ups dim and boring.**`)
          d.body.splice(0, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'H2 At what age do babies sleep through the night? (table)',
        done: (d) => hasHeading(d.body, 'At what age do babies sleep through the night? Age-by-age table'),
        apply: (d) => {
          const blocks = md(`## At what age do babies sleep through the night? Age-by-age table
"Sleeping through the night" usually means at least 6 hours in a row, with brief wake-ups that your baby settles from alone. The Sleep Foundation says most babies reach this around 6 months, yet about 38% of 6 month olds and about 28% of 1 year olds still do not, figures from a 2018 study in Pediatrics ([Sleep Foundation](${SRC.sfThrough})). The same study found no link between sleeping through the night and later development, so a baby who still wakes is not behind.
[[TABLE:ages]]
Night sleep and feed ranges match our [baby sleep schedule by age](${A('baby-sleep-schedule-by-age')}) chart. Total sleep is from the Sleep Foundation for newborns and the American Academy of Sleep Medicine ([AASM](${SRC.aasm})) from 4 months. Every baby is different, so use the table as a guide, not a deadline.`, {
            ages: {
              caption: 'At what age do babies sleep through the night? (typical ranges)',
              headers: ['Age', 'Night sleep', 'Night feeds and wake-ups', 'Sleeping 6+ hours in a row?', 'Total sleep in 24 h'],
              rows: [
                ['Newborn (0–4 weeks)', '1–2 hours at a time between feeds', 'Every 2–4 hours; 8–12 feeds in 24 h', 'Not yet, and it should not be pushed', '14–17 h'],
                ['1 month', 'About 8–10 h in total', '2–4 feeds', 'Rare; one slightly longer stretch may appear', '14–17 h'],
                ['2 months', 'About 9–11 h in total', '1–3 feeds', 'Some babies start one longer first stretch', '14–17 h'],
                ['3 months', 'About 10–11 h', 'Often 1–2 feeds', 'A 5–6 hour stretch is possible for some', '14–17 h'],
                ['4–6 months', 'About 10–12 h', '0–2 feeds', 'Many manage 5–6 hours; some sleep the whole night', '12–16 h (AASM)'],
                ['6 months', 'About 10–12 h', '0–2 feeds; ask your pediatrician', 'Most do; about 38% do not yet', '12–16 h (AASM)'],
                ['12 months', 'About 10–12 h', 'Some still wake; check night feeds with your pediatrician', 'About 72% do; about 28% do not yet', '11–14 h (AASM)'],
              ],
            },
          })
          // right after the opening section "First: what "through the night" actually means"
          const at = sectionEnd(d.body, findH(d.body, 'First: what "through the night" actually means'))
          d.body.splice(at, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'FAQ: sleep through the night',
        done: (d) => hasHeading(d.body, 'How can I help my baby sleep through the night?'),
        apply: (d) => {
          const blocks = md(`### How can I help my baby sleep through the night?
Keep a short, consistent bedtime routine, watch wake windows so your baby is not overtired, put them down drowsy but awake, and keep night feeds dim and quiet. Drop night feeds only when your pediatrician agrees your baby no longer needs them.
### How many hours is "sleeping through the night" for a baby?
Usually at least 6 hours in a row, according to the Sleep Foundation. That is shorter than an adult's night, and brief wake-ups that your baby settles from alone still count.
### Is it normal for a 6 month old not to sleep through the night?
Yes. About 38% of 6 month olds are not yet sleeping 6 hours in a row, and research has found no link with later development. Check with your pediatrician if your baby seems unwell, snores or gasps, or is not gaining weight.`)
          d.body.splice(faqEnd(d.body), 0, ...blocks)
          return blocks
        },
      },
    ],
  },

  // 5 ─────────────────────────────────────────────────────────────────────────
  'how-much-should-a-newborn-eat': {
    ops: [
      {
        name: 'H2 Week-by-week table (weeks 1–4)',
        done: (d) => hasHeading(d.body, 'How much should a newborn eat by week? Weeks 1 to 4'),
        apply: (d) => {
          const blocks = md(`## How much should a newborn eat by week? Weeks 1 to 4
**Most newborns take about 1 to 2 ounces per feed in week 1, about 2 to 3 ounces in weeks 2 and 3, and up to about 3 to 4 ounces by the end of the first month if formula-fed. Breastfed babies nurse about 8 to 12 times in 24 hours, so amounts per feed are smaller but more frequent.**
[[TABLE:weeks]]
**The rule of thumb:** the AAP says formula-fed babies take about 2½ ounces of formula per pound of body weight per day, averaging no more than about 32 ounces in 24 hours ([AAP](${SRC.aapFormula})). For a 7½ pound 3 week old, that is about 19 ounces a day, or roughly 2 to 2½ ounces at each of 8 feeds. Our [baby feeding calculator](/mamabee/tools/baby-feeding-calculator) does this math for your baby's weight.
For breastfed babies you cannot see the ounces, and you do not need to. The CDC says most exclusively breastfed babies feed every 2 to 4 hours, about 8 to 12 times in 24 hours, and take a little more at each feed as the weeks go by ([CDC](${SRC.cdcBreast})). Enough wet and dirty diapers and steady weight gain are the real proof ([AAP](${SRC.aapEnough})); see [how many wet diapers a newborn should have](${A('how-many-wet-diapers-newborn')}).
### Feeding a 3 week old
A typical 3 week old takes about 2 to 3 ounces per feed, 8 to 12 times a day if breastfed or about every 2 to 3 hours if formula-fed. A growth spurt often lands around 2 to 3 weeks, so a few days of extra-hungry feeding is normal. Follow your baby's cues rather than the number on the bottle.`, {
            weeks: {
              caption: 'How much a newborn eats by week (averages, not targets; follow hunger and fullness cues)',
              headers: ['Age', 'Breast milk (per feed)', 'Formula (per feed)', 'Feeds in 24 hours'],
              rows: [
                ['Week 1', 'About 1 tsp on day 1, rising to about 1–2 oz by the end of the week', '1–2 oz every 2–3 hours (AAP, CDC)', '8–12 or more'],
                ['Week 2', 'About 2–3 oz', 'About 2–3 oz every 2–3 hours', '8–12'],
                ['Week 3', 'About 2–3 oz', 'About 2–3 oz every 2–3 hours; more during a growth spurt', '8–12'],
                ['Week 4', 'About 2–3 oz, slowly increasing', 'Up to about 3–4 oz every 3–4 hours by the end of the month (AAP)', 'Breastfed 8–12; formula about 6–8'],
              ],
            },
          })
          // right after the existing "How much should a newborn eat, by age?" section
          const at = sectionEnd(d.body, findH(d.body, 'How much should a newborn eat, by age?'))
          d.body.splice(at, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'FAQ: 3 week old + newborn feeding amount',
        done: (d) => hasHeading(d.body, 'How much should a 3 week old eat?'),
        apply: (d) => {
          const blocks = md(`### How much should a 3 week old eat?
About 2 to 3 ounces per feed. Breastfed babies usually nurse 8 to 12 times in 24 hours, and formula-fed babies often feed every 2 to 3 hours, guided by the AAP's rule of about 2½ ounces per pound per day.
### What is a normal newborn feeding amount by week?
Roughly 1 to 2 ounces per feed in week 1, 2 to 3 ounces in weeks 2 and 3, and up to about 3 to 4 ounces by the end of the first month for formula-fed babies. Breastfed babies take similar or smaller amounts more often.
### How much should a newborn eat in 24 hours?
For formula, about 2½ ounces per pound of body weight per day, so around 16 to 20 ounces for an 8 pound baby, and no more than about 32 ounces a day on average (AAP). For breastfed babies, 8 to 12 feeds with plenty of wet diapers is the guide.`)
          d.body.splice(faqEnd(d.body), 0, ...blocks)
          return blocks
        },
      },
    ],
  },

  // 6 ── cross-links to this week's new articles ───────────────────────────────
  'exclusive-pumping-schedule': {
    ops: [
      {
        name: 'link → how-to-increase-milk-supply',
        done: (d) => hasHref(d.body, A('how-to-increase-milk-supply')),
        apply: (d) => {
          const blocks = md(`Power pumping is only one tool. Our guide on [how to increase milk supply](${A('how-to-increase-milk-supply')}) covers what else helps, from session frequency and full emptying to flange fit.`)
          d.body.splice(findText(d.body, 'Do it once a day in place of a regular session') + 1, 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'link → how-long-is-breast-milk-good-for',
        done: (d) => hasHref(d.body, A('how-long-is-breast-milk-good-for')),
        apply: (d) => {
          const blocks = md(`- **Label and store milk safely.** Write the date on every bottle or bag, and check our [breast milk storage guide](${A('how-long-is-breast-milk-good-for')}) for how long pumped milk lasts at room temperature, in the fridge and in the freezer.`)
          d.body.splice(findText(d.body, 'Learn paced bottle feeding') + 1, 0, ...blocks)
          return blocks
        },
      },
    ],
  },
  'baby-milestones-by-month': {
    ops: [
      {
        name: 'link → when-do-babies-roll-over',
        done: (d) => hasHref(d.body, A('when-do-babies-roll-over')),
        apply: (d) => {
          const blocks = md(`Rolling is often the first big motor milestone of this stretch. Our guide to [when babies roll over](${A('when-do-babies-roll-over')}) explains the usual order, from tummy-to-back to sitting up, and how tummy time helps.`)
          d.body.splice(sectionEnd(d.body, findH(d.body, '4–6 months: waking up to the world')), 0, ...blocks)
          return blocks
        },
      },
      {
        name: 'link → when-do-babies-start-talking',
        done: (d) => hasHref(d.body, A('when-do-babies-start-talking')),
        apply: (d) => {
          const blocks = md(`First words build on months of cooing and babbling; see [when do babies start talking](${A('when-do-babies-start-talking')}) for the full path from first sounds to two-word phrases.`)
          d.body.splice(sectionEnd(d.body, findH(d.body, '10–12 months: almost a toddler')), 0, ...blocks)
          return blocks
        },
      },
    ],
  },
  'tummy-time-guide': {
    ops: [
      {
        name: 'link → when-do-babies-roll-over',
        done: (d) => hasHref(d.body, A('when-do-babies-roll-over')),
        apply: (d) => {
          const blocks = md(`Those strong arms and neck are what make rolling possible. Our guide to [when babies roll over](${A('when-do-babies-roll-over')}) covers the typical ages and what comes next.`)
          d.body.splice(sectionEnd(d.body, findH(d.body, 'Rough tummy-time milestones')), 0, ...blocks)
          return blocks
        },
      },
    ],
  },
  'cluster-feeding': {
    ops: [
      {
        name: 'link → how-to-increase-milk-supply',
        done: (d) => hasHref(d.body, A('how-to-increase-milk-supply')),
        apply: (d) => {
          const blocks = md(`If you are still worried about your supply, our guide on [how to increase milk supply](${A('how-to-increase-milk-supply')}) explains what genuinely helps and when to see a lactation consultant.`)
          d.body.splice(findText(d.body, 'For formula-fed babies, cluster feeding can happen too') + 1, 0, ...blocks)
          return blocks
        },
      },
    ],
  },
}

const DRY = !!process.env.DRY
const countFaqs = (body) => { const i = body.findIndex((b) => b.style === 'h2' && text(b) === FAQ); if (i < 0) return 0; return body.slice(i + 1, sectionEnd(body, i)).filter((b) => b.style === 'h3').length }
const summary = []
for (const [slug, up] of Object.entries(UPGRADES)) {
  const pub = await client.getDocument(`mamabee-${slug}`)
  if (!pub) { console.log(`!! published doc not found: mamabee-${slug}`); continue }
  const existingDraft = await client.getDocument(`drafts.mamabee-${slug}`)
  // build on our own earlier draft when it exists (so a rerun keeps it and skips what is there)
  const base = existingDraft || pub
  const doc = JSON.parse(JSON.stringify(base))
  const before = {blocks: doc.body.length, words: words(doc.body), tables: doc.body.filter((b) => b._type === 'comparisonTable').length, ctas: doc.body.filter((b) => b._type === 'appCta').length, faqs: countFaqs(doc.body), desc: doc.description}
  const keysBefore = new Set(doc.body.map((b) => b._key))
  const log = []
  let added = []
  for (const op of up.ops) {
    if (op.done(doc)) { log.push(`   skip (already present): ${op.name}`); continue }
    const blocks = op.apply(doc)
    added = added.concat(blocks)
    log.push(`   + ${op.name} (${blocks.length} blocks, ${words(blocks)} words)`)
  }
  let descChanged = false
  if (up.description && doc.description !== up.description) { doc.description = up.description; descChanged = true; log.push(`   ~ description (${before.desc.length}c → ${up.description.length}c)`) }
  // safety: every original block must still be there, unchanged and in order
  const origKeys = base.body.map((b) => b._key)
  const kept = doc.body.filter((b) => keysBefore.has(b._key)).map((b) => b._key)
  if (JSON.stringify(kept) !== JSON.stringify(origKeys)) throw new Error(`${slug}: original blocks changed`)
  for (const b of base.body) if (JSON.stringify(b) !== JSON.stringify(doc.body.find((x) => x._key === b._key))) throw new Error(`${slug}: block ${b._key} modified`)
  if (pub.coverImage && JSON.stringify(doc.coverImage) !== JSON.stringify(pub.coverImage)) throw new Error(`${slug}: cover changed`)
  const allKeys = doc.body.map((b) => b._key); if (new Set(allKeys).size !== allKeys.length) throw new Error(`${slug}: duplicate _key`)
  const changed = added.length > 0 || descChanged
  doc._id = `drafts.mamabee-${slug}`
  delete doc._rev; delete doc._createdAt; delete doc._updatedAt
  if (changed && !DRY) await client.createOrReplace(doc)
  const after = {blocks: doc.body.length, words: words(doc.body), tables: doc.body.filter((b) => b._type === 'comparisonTable').length, ctas: doc.body.filter((b) => b._type === 'appCta').length, faqs: countFaqs(doc.body)}
  const internal = [...new Set(added.flatMap((b) => (b.markDefs || []).map((m) => m.href)).filter((h) => h && h.startsWith('/mamabee/')))]
  const external = [...new Set(added.flatMap((b) => (b.markDefs || []).map((m) => m.href)).filter((h) => h && h.startsWith('http')))]
  console.log(`${DRY ? '[DRY] ' : ''}${changed ? (DRY ? 'would save' : 'saved') : 'unchanged'} drafts.mamabee-${slug} (base: ${existingDraft ? 'existing draft' : 'published'})`)
  console.log(`   blocks ${before.blocks} → ${after.blocks} | words ${before.words} → ${after.words} (+${after.words - before.words}) | tables ${before.tables} → ${after.tables} | FAQs ${before.faqs} → ${after.faqs} | CTAs ${before.ctas} → ${after.ctas} | title ${doc.title.length}c | desc ${doc.description.length}c | cover ${doc.coverImage ? 'kept' : 'NONE'}`)
  for (const l of log) console.log(l)
  if (internal.length) console.log('   new internal links:', internal.join(' '))
  if (external.length) console.log('   new sources:', external.join(' '))
  summary.push(slug)
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Published docs untouched; nothing is live.')
