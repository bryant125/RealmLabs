// Week-4 MamaBee parenting batch as DRAFTS (sleep training, feeding, postpartum).
// Health-sensitive topics: every article carries a medical disclaimer, and the
// postpartum one leads with crisis resources. Run once:
//   node scripts/week4-articles.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
const A=(slug,title,description,tags,tables,body)=>({slug,title,description,tags,tables,body})

const articles = [

  // ─────────────────────────────────────────────────────────────────────────
  A('baby-sleep-training-methods',
    'Baby Sleep Training Methods Compared: Which One Actually Fits Your Family',
    'Ferber, extinction, chair method, pick-up-put-down and bedtime fading compared honestly — how each works, what the evidence says, how much crying to expect, and how to choose.',
    ['baby sleep training methods', 'ferber method', 'cry it out', 'chair method', 'gentle sleep training'],
    {
      methods: {
        caption: 'There is no single best method. Consistency matters more than which one you pick.',
        headers: ['Method', 'How it works', 'Crying', 'Typical timeline'],
        rows: [
          ['Graduated extinction (Ferber)', 'Check in at lengthening intervals', 'Moderate', '3–7 nights'],
          ['Full extinction', 'No check-ins until morning', 'Most, front-loaded', '3–5 nights'],
          ['Chair method', 'Sit by the crib, move further away every few nights', 'Less', '2–3 weeks'],
          ['Pick-up-put-down', 'Comfort until calm, put down awake, repeat', 'Less, but exhausting', '1–3 weeks'],
          ['Bedtime fading', 'Shift bedtime later to match real sleep pressure', 'Least', '1–2 weeks'],
        ],
      },
    },
`Nobody tells you that the hardest part of sleep training is not the crying. It is standing in the hallway at 9:40 PM, phone in hand, arguing with your partner in a whisper about whether to go back in — while the internet screams at you that you are either coddling your baby or damaging them for life.
So let us take the temperature down. **Sleep training is a tool, not a moral test.** Plenty of families use it. Plenty never do, and their children sleep fine eventually. This is a plain comparison of the main methods, what the research actually supports, and how to pick the one you can stay consistent with — because consistency, not the method, is what decides whether it works.
## First: when is a baby ready?
Most sleep specialists say **around 4 to 6 months at the earliest**, and researchers who study graduated extinction specifically warn that formal sleep training is not appropriate for babies under 6 months. Before that, night waking is not a habit to be fixed — it is biology. Newborns need to feed overnight, their circadian rhythm is not established, and there is nothing to train.
Signs your baby may be ready:
- Around 4–6 months or older, and cleared for it by your pediatrician
- Able to go longer stretches without a night feed (ask your doctor before dropping any)
- Falling asleep only with a specific prop — rocking, feeding, your pinky finger — and waking the moment it disappears
Whatever you do, keep the sleep space safe: firm flat mattress, on the back, no loose bedding, bumpers or pillows, ideally room-sharing without bed-sharing for the first six months.
## The methods, side by side
[[TABLE:methods]]
## Graduated extinction (the Ferber method)
The best known, and the one most people mean by "sleep training." You put your baby down drowsy but awake, leave, and if they cry you return at **set, gradually lengthening intervals** — say 3, then 5, then 10 minutes. Check-ins are brief and boring on purpose: a hand on the chest, a few calm words, out again. You are not there to end the crying, only to prove you have not vanished.
**Why people choose it:** it works quickly for many families, often inside a week, and the check-ins make it bearable for parents who cannot do full extinction.
**Why people skip it:** there is real crying, and the check-ins can re-trigger some babies rather than settle them.
## Full extinction ("cry it out")
Bedtime routine, into the crib, goodnight — and you do not return until morning, apart from safety checks or a planned feed. It is the fastest on paper and by far the hardest to sit through. Many parents cannot do it, which is not a character flaw. **A method you abandon halfway is worse than a gentler one you finish**, because inconsistency teaches your baby that crying long enough eventually works.
## The chair method
You stay in the room, sitting in a chair beside the crib, offering minimal comfort — then every few nights you move the chair further away, until you are out the door. Much gentler on everyone's nerves, and much slower: two to three weeks is typical. Some babies are soothed by your presence; others find a visible-but-unhelpful parent maddening. You will know which you have within about three nights.
## Pick-up-put-down
When your baby cries, you pick them up, soothe until calm, then put them down **awake** — and repeat, sometimes dozens of times. Very low crying, very high parental effort. It suits younger babies and low-tolerance-for-crying households, but it is genuinely exhausting, and past about 8 months many babies become too stimulated by the picking up for it to work.
## Bedtime fading (the underrated one)
This one gets ignored and it should not. Instead of changing how your baby falls asleep, you change **when**. Note the time they actually fall asleep, set bedtime to that time, then once they are dropping off quickly, move bedtime earlier in 15-minute steps.
The insight is simple: a lot of "bedtime resistance" is just a baby being put down before they are biologically tired. Fading works with sleep pressure instead of against it, and it involves the least crying of any approach. If the phrase "sleep training" makes you flinch, start here.
[[CTA||Track naps, wake windows and bedtimes in MamaBee — so you can see whether it is actually working.]]
## What the evidence actually says
Two things worth knowing, because they cut through most of the internet arguing:
**It generally works.** Behavioural methods like graduated extinction reliably improve how fast babies fall asleep and how often they wake, in a fairly short window, when parents apply them consistently.
**No method has been shown to be objectively best.** Studies comparing approaches find they work about equally well over the long run. What varies is how fast, how much crying, and how much parental stamina is required. Follow-up research has not found evidence of lasting harm to attachment or emotional development from standard behavioural sleep training in healthy babies over 6 months.
Which means the honest answer to "which method should I use?" is: **the one you can do the same way, every night, for two weeks.**
## How to actually make it work
- **Pick one and give it 7 nights.** Method-hopping is the most common reason sleep training fails.
- **Get both parents agreeing first.** The 9:40 PM hallway argument is the real enemy.
- **Fix the routine before the method.** Same short, calm sequence every night — dim lights, feed, book, sleep sack, bed.
- **Put them down awake.** This is the whole ballgame. A baby who falls asleep on you will look for you at 2 AM.
- **Expect night three.** It is very often worse than night two. It is also very often the last bad one.
- **Track it.** Memory lies at 3 AM. Written-down data tells you whether things are improving when it does not feel like it.
## When to stop and call your pediatrician
Pause and check in if your baby is sick, teething badly, or has just had a big change like a move or starting daycare — and always before dropping night feeds, especially if there are any concerns about weight gain. Talk to your doctor first if your baby was premature, has reflux, breathing problems, or any medical condition. Snoring, gasping or long pauses in breathing deserve a call regardless of sleep training.
## Frequently asked questions
### What age can you start sleep training?
Most guidance points to around 4–6 months at the earliest, and researchers studying graduated extinction advise waiting until at least 6 months. Before then, frequent night waking is normal and expected. Check with your pediatrician for your baby.
### Does sleep training cause long-term harm?
Follow-up studies of standard behavioural methods in healthy babies over 6 months have not found evidence of lasting harm to attachment or emotional wellbeing. That said, no research replaces your own judgement about your baby and your family.
### Which sleep training method has the least crying?
Bedtime fading, usually — followed by pick-up-put-down and the chair method. Full extinction involves the most, though it is often over fastest.
### How long does sleep training take?
Roughly 3–7 nights for graduated extinction and full extinction; 1–3 weeks for the gentler methods. Night three is commonly the hardest.
### Do I have to sleep train at all?
No. Plenty of families never do and their babies sleep through eventually. Sleep training is one option among several, not a requirement of good parenting.
## The takeaway
There is no best sleep training method — there is the one your family can actually carry out consistently for two weeks. Wait until your baby is old enough, fix the bedtime routine first, put them down awake, pick a single method, and give it a full week before judging it. If crying is the sticking point, start with bedtime fading. And if you decide not to sleep train at all, that is a legitimate choice too. For the timing behind it all, see our [wake windows by age guide](/mamabee/articles/wake-windows-by-age) and [baby bedtime routine guide](/mamabee/articles/baby-bedtime-routine).
[[CTA||Get MamaBee free and track every nap, wake window and bedtime — one tap, even at 3 AM.]]
*This article is general information, not medical advice. Talk to your pediatrician before starting sleep training or changing night feeds, especially if your baby was premature or has any medical condition.*`),

  // ─────────────────────────────────────────────────────────────────────────
  A('breastfeeding-vs-formula',
    'Breastfeeding vs. Formula: An Honest Guide Without the Guilt',
    'What the AAP actually recommends, what formula does and does not do, how combination feeding works, and how to decide without drowning in judgement. A calm, practical guide.',
    ['breastfeeding vs formula', 'combination feeding', 'formula feeding', 'breastfeeding benefits', 'combo feeding baby'],
    {
      compare: {
        caption: 'Both feed your baby. The differences are real but smaller than the internet suggests.',
        headers: ['', 'Breastfeeding', 'Formula', 'Combination'],
        rows: [
          ['Nutrition', 'Adapts as baby grows', 'Regulated, consistent', 'Both'],
          ['Antibodies', 'Yes', 'No', 'Partial'],
          ['Cost', 'Low (pump, supplies)', '~$1,200–2,000/yr', 'In between'],
          ['Night feeds', 'Usually one parent', 'Shareable', 'Shareable'],
          ['Flexibility', 'Pumping needed to share', 'Anyone, anywhere', 'High'],
          ['Physical toll', 'On the feeding parent', 'Shared', 'Shared'],
          ['Tracking intake', 'Harder to measure', 'Exact ounces', 'Mixed'],
        ],
      },
    },
`There is no topic in early parenting where the gap between **the evidence** and **the shouting** is wider than this one. Ask the internet whether to breastfeed or use formula and you will get moral philosophy, marketing, and somebody's aunt — rarely a straight answer.
Here is the straight answer, up front: **breast milk has real, documented advantages, and formula is a safe, regulated, complete food that has raised hundreds of millions of healthy children.** Both of those sentences are true at the same time. Most families end up somewhere between the two poles, and that is normal.
## What the AAP actually recommends
The American Academy of Pediatrics recommends **exclusive breastfeeding for about the first 6 months**, then continued breastfeeding alongside solid foods **for two years or beyond, as mutually desired by mother and child.** The AAP's stated order of preference is milk directly from the mother first, donor milk second, and formula third.
Two words in that recommendation get skipped constantly: **as mutually desired.** The guidance describes an ideal, not an obligation, and it explicitly leaves room for what actually works for you and your baby.
## The two honestly compared
[[TABLE:compare]]
## What breastfeeding genuinely offers
- **Antibodies and immune factors** formula cannot replicate, offering some protection against infections in infancy
- **Milk that changes** — composition shifts across a feed, across the day, and as your baby grows
- **Lower rates of certain conditions** in population studies, including some gut and respiratory infections
- **Health benefits for the feeding parent**, including lower long-term risk of breast and ovarian cancer
- **Free, always the right temperature, and never out of stock**
## What formula genuinely offers
- **Complete nutrition.** Infant formula is tightly regulated and nutritionally complete. A formula-fed baby is a fed baby, full stop.
- **Shared load.** Anyone can do the 3 AM feed. For many households this is the difference between one exhausted parent and two functioning ones.
- **Exact numbers.** You know precisely how much went in — genuinely reassuring if weight gain has been a worry.
- **Freedom.** Medication, returning to work, twins, low supply, adoption, surgery, or simply not wanting to breastfeed — all real reasons, and none of them require justification.
## Combination feeding: what most families actually do
The debate is framed as either/or. Real life mostly is not. Combination feeding — some breast milk, some formula — is extremely common and completely legitimate.
It might look like breastfeeding during the day and one formula bottle at night so you can sleep a longer stretch; or breastfeeding while supplementing for weight gain; or slowly shifting the ratio as you return to work. Any breast milk is beneficial. It does not have to be all or nothing to count.
A practical note: if you want to protect supply while adding formula, introduce bottles gradually and consider pumping around a skipped feed — supply responds to demand. A lactation consultant is worth their fee here.
[[CTA||Log every feed — breast, bottle, formula or pumped — with one thumb in MamaBee.]]
## The part nobody says out loud
Breastfeeding is often described as natural, which people hear as easy. For many it is neither at first. Cracked nipples, a bad latch, cluster feeding, mastitis, low supply, tongue tie, pumping at work in a supply cupboard — these are common, not personal failures.
And this matters: **feeding is not only about milk.** A parent who is depleted, in pain, or sliding into despair is a real factor in a baby's wellbeing. If breastfeeding is costing your mental health, changing the plan is a legitimate medical decision, not a surrender. Talk to your doctor or a lactation consultant before you decide anything at 4 AM while crying — because at 4 AM, everything feels permanent, and almost nothing is.
## What the research does and does not show
Worth knowing, because breastfeeding studies are quoted at parents constantly and rarely with their caveats. Population research consistently links breastfeeding to lower rates of gut and respiratory infections in infancy — that finding is solid and biologically well explained by the antibodies in breast milk.
The claims about long-term outcomes like IQ and obesity are shakier. Families who breastfeed for longer differ from those who do not in income, education, work flexibility and support, and those factors influence child outcomes on their own. Sibling studies, which compare differently-fed children within the same family, tend to show much smaller differences than headline studies do.
So: the short-term immune benefits are real and worth having if breastfeeding works for you. The idea that formula sets your child back for life is not what the evidence shows.
## How to decide (a short, calm framework)
- **Start with what you want.** Your preference is a legitimate input, not a tiebreaker after everyone else's opinion.
- **Add reality.** Supply, medication, work, other children, support at home, mental health history.
- **Try, if you want to try.** Many difficulties in the first few weeks are fixable with good help. Get that help early rather than white-knuckling it.
- **Decide again whenever you like.** This is not a one-time vote. Families move between exclusive breastfeeding, combo feeding and formula constantly.
## Frequently asked questions
### Is formula bad for babies?
No. Infant formula is regulated, nutritionally complete, and safe. Breast milk has advantages formula cannot replicate, but formula is a legitimate way to feed your baby.
### Does combination feeding hurt my milk supply?
It can reduce supply, since supply responds to demand — but many families combo feed successfully for months. Introduce formula gradually and consider pumping around skipped feeds. A lactation consultant can help you plan it.
### How long should I breastfeed?
The AAP suggests exclusive breastfeeding for around 6 months, then continued breastfeeding with solids for two years or more **as mutually desired**. Any amount of breast milk is beneficial; there is no threshold below which it stops counting.
### Is it normal to feel guilty about formula?
Very common, and worth naming as unfair. The guilt usually comes from social pressure rather than evidence. A fed, thriving baby with a functioning parent is the goal.
### Can I switch back to breastfeeding after formula?
Sometimes yes — relactation and rebuilding supply are possible, particularly early on and with support. Speak to a lactation consultant about a realistic plan for your situation.
## The takeaway
Breast milk offers real benefits, formula is safe and complete, and combination feeding is what a great many families do. The right choice is the one that keeps your baby fed and growing **and** keeps you standing. Get good help early if you want to breastfeed, feel no obligation to justify formula, and let yourself change your mind as often as your circumstances change. For how much your baby needs, see our [newborn feeding guide](/mamabee/articles/how-much-should-a-newborn-eat), and for the hungry days, [cluster feeding](/mamabee/articles/cluster-feeding).
[[CTA||Get MamaBee free — track breast, bottle, formula and pumped feeds in one calm place.]]
*This article is general information, not medical advice. Talk to your pediatrician, midwife or a lactation consultant about feeding decisions, supply concerns, or any worries about your baby's weight gain.*`),

  // ─────────────────────────────────────────────────────────────────────────
  A('postpartum-recovery-mental-health',
    'Postpartum Recovery and Mental Health: What Nobody Warns You About',
    'Real postpartum recovery week by week, the difference between baby blues and postpartum depression, when to get help, and the exact numbers to call. You matter too.',
    ['postpartum tips', 'postpartum recovery', 'postpartum depression', 'baby blues', 'fourth trimester'],
    {
      timeline: {
        caption: 'A rough guide. Recovery is not linear and C-section recovery takes longer.',
        headers: ['When', 'What is often happening', 'Watch for'],
        rows: [
          ['Days 1–7', 'Bleeding, cramping, engorgement, huge emotions', 'Heavy bleeding, fever, severe headache'],
          ['Weeks 2–3', 'Baby blues usually lifting, soreness easing', 'Mood not lifting after ~2 weeks'],
          ['Weeks 4–6', 'Bleeding tapers, energy flickers back', 'Pain that worsens rather than improves'],
          ['6-week check', 'Clearance for exercise and sex — for some, not all', 'Say how you actually feel, not "fine"'],
          ['Months 3–12', 'Hair loss, joint aches, hormonal shifts', 'Depression and anxiety can start any time this year'],
        ],
      },
    },
`Everyone asks how the baby is sleeping. Almost nobody asks how **you** are — and if they do, you are expected to say "tired but so happy," even if you have been crying in the shower where nobody can hear you.
This one is about you. What actually happens to your body after birth, what is normal in the first weeks, and — most importantly — how to tell ordinary exhaustion from something that needs treatment. Because postpartum depression is common, treatable, and nothing to be ashamed of, and far too many people wait months before saying anything.
## Get help now if you need it
If you are in crisis, having thoughts of harming yourself or your baby, or you simply need someone to talk to:
- **Postpartum Support International HelpLine — 1-800-944-4773** (call or text; English and Spanish). It connects you to trained volunteers and local resources.
- **988 Suicide & Crisis Lifeline** — call or text **988** in the US, any time, day or night.
- **Emergency services (911)** if you or your baby are in immediate danger.
Thoughts of harming yourself or your baby are a medical emergency, not a character flaw and not something you will be punished for saying out loud. Say it to someone today.
## What actually happens to your body
[[TABLE:timeline]]
The first six weeks include bleeding that gradually lightens, cramping as the uterus contracts back down, soreness or stitches, engorgement when milk comes in, night sweats, and constipation. If you had a C-section, you also had major abdominal surgery — recovery is longer and lifting restrictions are real.
Call your provider promptly for: soaking a pad an hour or passing large clots, fever, a severe or persistent headache, chest pain or shortness of breath, calf pain or swelling, a wound that becomes red or oozes, vision changes, or pain that is getting worse rather than better. These are the ones not to sit on.
## Baby blues or something more?
Up to about **80% of new mothers get the "baby blues"** — tearfulness, mood swings, irritability, feeling overwhelmed — starting in the first few days as hormones crash. It peaks around day 4 or 5 and **lifts on its own within about two weeks.**
**Postpartum depression is different.** It affects roughly **1 in 7 to 1 in 5** new mothers. It can begin any time in the first year, not just the first weeks, and it does not resolve on its own.
Signs it is more than the blues:
- Low mood, emptiness or hopelessness lasting **more than two weeks**
- No pleasure in things you used to enjoy, including your baby
- Guilt or a sense of being a bad parent that will not shift
- Sleeping badly even when the baby sleeps, or wanting to sleep constantly
- Anxiety, racing thoughts, or intrusive frightening images
- Feeling detached from your baby, or that they would be better off without you
- Any thoughts of harming yourself or your baby — **seek help immediately**
Also worth naming: **postpartum anxiety and OCD** are real and often missed, showing up as relentless checking, catastrophic thoughts and physical panic. And **partners get postpartum depression too** — roughly 1 in 10 fathers — which almost nobody screens for.
## The screening you are entitled to
ACOG guidance recommends that everyone receiving prenatal and postpartum care is screened for depression and anxiety using validated tools — at least twice during pregnancy and again after birth. In practice, screening gets missed, rushed, or answered with a reflexive "I'm fine."
So: **at your appointments, answer honestly.** If nobody hands you a questionnaire, say the sentence out loud — "I think I might be depressed." It is the fastest route to help, and it is a normal thing for a doctor to hear.
Treatment works. Talking therapy, peer support, and where appropriate medication — including options compatible with breastfeeding — are all effective. Most people start feeling meaningfully better within weeks of getting real treatment.
[[CTA||MamaBee keeps track of the baby, so you have a little more room to look after you.]]
## Practical things that genuinely help
- **Sleep in shifts.** One parent takes a 4-hour block on duty while the other sleeps properly. Broken sleep is a major driver of low mood.
- **Eat like someone recovering from a marathon.** Keep one-handed food within reach. Hydrate, especially if breastfeeding.
- **Get outside once a day.** Ten minutes of daylight is a real intervention, not a platitude.
- **Accept specific help.** People want to help but ask vaguely. Answer concretely: "bring dinner Thursday," "hold her while I shower."
- **Lower the bar.** The house does not matter. Thank-you cards do not matter. Feeding your baby and staying upright matters.
- **Stay in contact with one adult.** Isolation makes everything worse. One honest text thread counts.
## For partners and family
You are not helping by asking "what do you need?" — decision-making is the depleted resource. Do the thing: take the night shift, make the appointment, do the laundry. Watch for the two-week mark; if the low mood has not lifted, say so gently and offer to make the call. And check on yourself, because partners get depressed too.
## Frequently asked questions
### How long does postpartum recovery take?
The standard checkpoint is six weeks, but full recovery commonly takes months — a year is normal, and longer after a C-section or complications. Hair loss, joint aches and hormonal shifts can continue well past the six-week visit.
### When do baby blues become postpartum depression?
Baby blues start within days and lift within about two weeks. If low mood, anxiety or hopelessness lasts longer than two weeks, or is severe at any point, treat it as postpartum depression and contact your provider.
### Can postpartum depression start months after birth?
Yes. It can begin any time in the first year. A good stretch early on does not mean you are in the clear.
### Can I take antidepressants while breastfeeding?
Several are considered compatible with breastfeeding. Your doctor can weigh the options with you — untreated depression carries risks of its own, so this is a genuine two-sided decision, not an automatic no.
### Do partners get postpartum depression?
Yes — roughly 1 in 10 fathers experience postpartum depression, and non-birthing partners in general are rarely screened. The same advice applies: if it lasts beyond two weeks, get help.
## The takeaway
Your body is recovering from something enormous, and your mind is doing the same. Baby blues are common and lift within two weeks; postpartum depression affects up to 1 in 5, can start any time in the first year, and needs treatment rather than willpower. Answer screening questions honestly, take concrete help, sleep in shifts, and get outside once a day.
And if you take one thing from this: **saying "I am not okay" is the single most useful thing you can do this week.** Call or text PSI on **1-800-944-4773**, or **988** if you are in crisis. You matter, not just as somebody's parent.
[[CTA||Get MamaBee free — let the app do the remembering, so you have a little more left for you.]]
*This article is general information, not medical advice. If you have any concerns about your physical recovery or your mental health, contact your healthcare provider. In an emergency, call 911 or go to your nearest emergency department.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const t = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${t} tables)`)
}
console.log('\nDone — DRAFTS only. Nothing is live.')
