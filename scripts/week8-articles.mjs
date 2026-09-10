// MamaBee week-8 batch — 10 new articles as DRAFTS, 1.2k-1.5k words each.
// Topics checked against existing 50 for zero cannibalization.
// Run once: node scripts/week8-articles.mjs
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

  A('baby-reflux-and-spit-up',
    'Baby Reflux and Spit-Up: What Is Normal and When to Worry',
    'Why babies spit up, the difference between normal reflux and a problem, how to reduce spit-up, the signs of GERD or a milk allergy, and exactly when to call your pediatrician.',
    ['baby reflux', 'baby spit up', 'infant reflux', 'baby gerd', 'reduce baby spit up'],
    {},
`If your baby brings up milk after nearly every feed, soaking through bibs and burp cloths by the dozen, you are almost certainly dealing with normal infant reflux. It looks dramatic and it makes a lot of laundry, but in most cases it is completely harmless and something babies simply grow out of. Here is how to tell normal spit-up from a real problem, how to reduce it, and when it is worth a call to the doctor.
## Why babies spit up so much
Spit-up (reflux) happens because the muscle at the top of a baby's stomach — the valve that keeps food down — is still immature and floppy. Combine that with a tiny stomach, a mostly-liquid diet, and a lot of time lying flat, and milk comes back up easily. It is plumbing, not illness.
This is extremely common: a large share of healthy babies spit up regularly, especially in the first few months. It typically peaks around 4 months and resolves as your baby matures, sits up, and starts solids — most have grown out of it by around 12 months.
## The key phrase: "happy spitter"
Here is the single most useful concept. Doctors distinguish between a **"happy spitter"** and a baby with a real problem. A happy spitter:
- Spits up often, sometimes a lot, but is **content and comfortable**
- Is **gaining weight well** and feeding happily
- Is not distressed by the spitting up — it bothers you more than them
If your baby is a happy spitter, the reflux is a **laundry problem, not a medical one.** No treatment is needed; they will grow out of it. That reassurance alone saves a lot of worry.
## How to reduce spit-up
You cannot stop reflux entirely, but these gentle steps often reduce it:
- **Keep baby upright** during and for 20–30 minutes after feeds — gravity helps keep milk down.
- **Feed smaller amounts more often** rather than large feeds that overfill the stomach.
- **Burp frequently** — during and after feeds — to release trapped air. See our [guide to burping a baby](/mamabee/articles/how-to-burp-a-baby).
- **Avoid over-feeding** — watch fullness cues rather than pushing more.
- **Check bottle nipple flow** — too fast means gulping and more swallowed air; a slower-flow nipple can help.
- **Avoid tummy pressure** after feeds — no tight diapers or bouncing right after eating.
- **Never prop a baby to sleep or use sleep positioners** — always place them on their back to sleep, flat, even with reflux. Safe sleep comes first; see our [safe sleep guide](/mamabee/articles/safe-sleep-guidelines).
[[CTA||Track feeds, spit-up and how baby seems in MamaBee — a clear log helps you and your doctor.]]
## When it might be more than normal reflux
Sometimes reflux crosses into **GERD** (gastroesophageal reflux disease), where it causes genuine discomfort or affects feeding and growth, or points to another issue like a cow's-milk allergy. Signs to watch for:
- **Distress** — arching, crying and clear pain during or after feeds (not a happy spitter)
- **Poor weight gain**, or refusing to feed / feeding much less
- **Forceful, projectile vomiting** (across the room), especially if repeated
- **Green or yellow vomit, or blood** in the spit-up
- **Frequent coughing, choking, or breathing issues** with feeds
- **Blood or mucus in the stool**, eczema, or other allergy signs alongside the reflux
These are reasons to see your pediatrician, who can check for GERD, a milk-protein allergy, or (with forceful projectile vomiting in a young baby) rarer causes that need prompt attention.
## What treatment looks like (if needed)
For a happy spitter, the answer is usually reassurance and the positioning tips above — not medication. If your baby has genuine GERD, your doctor might suggest feeding changes, a trial of a different formula or (for breastfeeding parents) a dairy-elimination trial if a milk allergy is suspected, and only in certain cases, medication. **Do not start reflux medications on your own** — they are not needed for normal spit-up and are used selectively; always follow your pediatrician's guidance.
## What about "silent reflux"?
Some babies bring the milk up but swallow it back down instead of spitting it out — this is often called **silent reflux**, because you never see the tell-tale spit-up. It can be confusing precisely because the usual sign is missing, so parents see the discomfort without the obvious cause. Clues include swallowing or gulping sounds after feeds, frequent hiccups, arching and fussing during or after eating, a sour-milk smell on the breath, and general unsettledness. The important point is the same as for visible reflux: if your baby is otherwise content and growing well, silent reflux is usually still just normal reflux that happens to stay down, and it needs the same gentle handling — upright feeding, smaller feeds, good burping. If your baby seems genuinely uncomfortable, is feeding poorly, or is not gaining weight, mention it to your pediatrician, who can assess whether it is more than normal reflux.
## Reflux and sleep
Reflux and safe sleep sometimes feel at odds — it is tempting to prop a refluxy baby up or let them sleep upright on you because they seem more comfortable. Resist it. The safe-sleep rules do not change for reflux: **always place your baby on their back, on a firm flat surface**, even if they spit up. Babies are well designed to clear their airway when on their back, and the risk of an inclined or unsupervised sleep position far outweighs the comfort. If reflux is disrupting sleep badly, the safe levers are the daytime ones — upright time after feeds, smaller more frequent feeds, and a doctor's review — not a tilted mattress or a night in the swing.
## Frequently asked questions
### Is it normal for my baby to spit up after every feed?
Very often, yes. Frequent spit-up is normal in healthy babies because the valve at the top of the stomach is still immature. If your baby is content and gaining weight well (a "happy spitter"), it is a laundry problem, not a medical one.
### When do babies grow out of reflux?
Reflux typically peaks around 4 months and improves as babies mature, sit upright and start solids, with most growing out of it by around 12 months.
### What is the difference between spit-up and vomiting?
Spit-up is the easy, often effortless flow of milk back up, common and harmless in happy babies. Vomiting is more forceful; repeated projectile vomiting, or green/yellow/bloody vomit, is a reason to call your doctor.
### How can I reduce my baby's spit-up?
Keep them upright during and after feeds, feed smaller amounts more often, burp frequently, avoid overfeeding and tummy pressure after eating, and check the bottle nipple flow. Always still place your baby on their back, flat, to sleep.
## The takeaway
Baby reflux and spit-up are usually normal, harmless, and self-resolving — the key question is whether your baby is a content, growing "happy spitter" (a laundry issue) or is distressed, not gaining weight, or showing warning signs (a medical one). Reduce spit-up with upright feeding, smaller feeds and good burping, keep sleep flat and on the back regardless, and call your pediatrician for the red flags. Most babies simply outgrow it. For related tummy troubles, see our guides on [gas relief](/mamabee/articles/newborn-gas-relief) and [colic](/mamabee/articles/colic-in-babies).
[[CTA||Get MamaBee free — track feeds and spit-up so you can tell a happy spitter from a real problem.]]
*This article is general information, not medical advice. Contact your pediatrician about reflux that causes distress, poor weight gain, or any of the warning signs above.*`),

  A('contact-naps-and-independent-sleep',
    'Contact Naps: Why Your Baby Only Sleeps on You (and How to Change It Gently)',
    'Why your baby will only nap on you, whether contact naps are okay, the safety rules, and gentle step-by-step ways to help your baby nap independently when you are ready.',
    ['contact naps', 'baby only sleeps on me', 'baby will not nap in crib', 'independent naps', 'transfer sleeping baby to crib'],
    {},
`Your baby falls asleep beautifully in your arms — and then wakes the instant you lower them into the crib, as if the mattress were made of lava. If you are spending every nap pinned under a sleeping baby, you are experiencing "contact naps," and you are very much not alone. Here is why babies do this, whether it is a problem, and — when you are ready — how to gently encourage independent naps.
## Why your baby only sleeps on you
Contact napping is not a bad habit your baby has developed to manipulate you. It is **biology and instinct.** For almost all of human history, a baby left alone was a baby in danger, so babies are wired to feel safest — and sleep best — on a warm, familiar body. On you, they have your warmth, your heartbeat, your smell, and gentle motion. In a still, cool crib, all of that vanishes, and their nervous system notices.
The dramatic wake-up on transfer has a name too: babies cycle between light and deep sleep, and the change in temperature, position and contact when you put them down often jolts them awake, especially if they were not deeply asleep yet.
## Are contact naps okay?
Yes — **contact naps are completely fine**, and for many families they are a lovely, connected part of the early months. There is nothing wrong with them, and you are not "creating a rod for your own back" by holding your napping baby. Many parents happily contact-nap for months.
The one non-negotiable is **safety.** A contact nap is only safe when **you are awake and supervising.** The real danger is a parent falling asleep with the baby on a couch, armchair or bed, which is strongly linked to sleep-related risk. So:
- **Stay awake** during contact naps — settle in with a show, a book, a snack.
- If you are exhausted and might doze off, **put your baby down in a safe crib** on their back instead. A safe independent nap beats a risky contact one.
Within that rule, enjoy them as long as they work for you.
## When you might want to change it
Contact naps become a problem only when they stop working for *you* — you cannot get anything done, your back aches, you are touched-out, or you are so tired you risk falling asleep. If that is where you are, it is completely reasonable to gently teach independent naps. There is no "right" age to start, but it is often easier once your baby is past the newborn stage.
## Gentle ways to encourage independent naps
Go slowly and follow your baby — this is a gradual shift, not an overnight switch.
- **Master the transfer.** Wait until your baby is in **deep sleep** (limbs floppy, no flicker when you lift an arm) before transferring — usually 15–20 minutes after they drop off. Lower them **bottom-first, then head**, keeping them close, and keep a hand on them for a moment after.
- **Warm the crib** slightly beforehand (a warm — not hot — surface, removed before you lay them down) so it is not a cold shock. Never leave anything warm in the crib with the baby.
- **Recreate the cues.** White noise, a consistent nap routine, and a dark room mimic the comfort of you. See our [wake windows](/mamabee/articles/wake-windows-by-age) so you are putting them down at the right time.
- **Put down drowsy but awake** sometimes, so they practice falling asleep in the crib rather than only on you.
- **Start with one nap a day** in the crib and keep the others as contact naps — small steps are more sustainable.
- **Use a gradual method** — some parents settle baby in the crib with a hand on the chest, or pick-up-put-down, easing off over days.
[[CTA||Track naps and transfers in MamaBee — see which nap is easiest to move to the crib first.]]
## Safe sleep applies to naps too
Whether in your arms (awake) or the crib, the safe-sleep rules are the same for naps as for night: on the back, on a firm flat surface, in a bare crib with no loose bedding, pillows or positioners. Never let your baby nap unsupervised on a couch, adult bed, or in a car seat or bouncer for long periods. See our [safe sleep guidelines](/mamabee/articles/safe-sleep-guidelines).
## Making peace with the phase
If teaching independent naps is not working yet, or you simply do not have the energy for a project right now, give yourself full permission to keep contact napping. This is a season, not a life sentence — babies who contact-nap for months do go on to sleep independently, and holding your napping baby now does not doom you to holding them forever. The developmental push toward independence arrives on its own: as babies get older, more mobile and more interested in the world, many naturally become easier to put down. In the meantime, protect your own wellbeing — use a supportive chair, keep water and a snack within reach, line up a show or a book, and let the nap be a legitimate rest for you too rather than a guilt-ridden trap. And rope in your partner or a helper for some contact naps so the load is shared. The version of this that burns parents out is doing it resentfully and alone; the version that works is doing it on purpose, comfortably, and with help, until you are ready for the next step.
## Frequently asked questions
### Why will my baby only nap on me?
Because babies are instinctively wired to feel safest and sleep best on a warm, familiar body — your warmth, heartbeat, smell and motion. A still, cool crib lacks all of that, and the change on transfer often wakes them from light sleep.
### Are contact naps bad for my baby?
No. Contact naps are perfectly fine and can be a lovely part of the early months. The only rule is safety: stay awake and supervising during them, and never fall asleep with your baby on a couch, armchair or bed.
### How do I transfer my sleeping baby to the crib without waking them?
Wait until they are in deep sleep (floppy limbs, about 15–20 minutes after dropping off), lower them bottom-first then head while keeping them close, and hold a hand on them for a moment. A warm (not hot) crib surface and white noise help.
### How do I get my baby to nap independently?
Go gradually: perfect the deep-sleep transfer, recreate comfort cues (white noise, dark room, routine), put them down drowsy but awake sometimes, and start with just one crib nap a day while keeping the rest as contact naps.
## The takeaway
Contact naps happen because your baby is wired to sleep best on you — they are normal, fine, and safe as long as you stay awake and never doze off with the baby on a couch or bed. Enjoy them as long as they work for you; and when you are ready for more freedom, teach independent naps gently: nail the deep-sleep transfer, recreate the comfort cues, put down drowsy-but-awake, and move one nap at a time. No rush, no guilt — just small, kind steps. For the timing behind good naps, see [wake windows by age](/mamabee/articles/wake-windows-by-age).
[[CTA||Get MamaBee free — track naps and find the gentlest path to independent sleep.]]
*This article is general information, not medical advice. Always follow safe-sleep guidance and talk to your pediatrician about your baby's sleep.*`),

  A('baby-sign-language',
    'Baby Sign Language: How to Start, Best First Signs, and Does It Really Work',
    'What baby sign language is, whether it actually works, the best first signs to teach, when and how to start, and realistic expectations for communicating with your baby before they talk.',
    ['baby sign language', 'baby signing', 'sign language for babies', 'baby signs', 'teach baby to sign'],
    {},
`Long before babies can talk, they have plenty they want to tell you — they just lack the words. Baby sign language bridges that gap, giving your baby simple hand signs to say "milk," "more," or "all done" months before speech arrives. It can genuinely cut down on frustrated crying for both of you. Here is what it is, whether it works, and how to start.
## What baby sign language is
Baby sign language is a set of simple gestures — often borrowed from or adapted from formal sign languages like ASL — that hearing babies can use to communicate basic needs and wants before they can speak. It works because babies develop the **motor skills for gestures earlier than the ability to talk.** Your baby can physically make a sign months before their mouth can form the word.
It is not about raising a fluent signer; it is a practical bridge across the frustrating gap between wanting something and being able to say it.
## Does it actually work?
Here is the honest picture. **Many parents find baby signing genuinely useful** — babies who sign can often express needs earlier, which reduces the frustration and crying that comes from not being understood. Anecdotally, families love it, and it creates lovely early back-and-forth communication.
What the research is more measured about: the **long-term** claims — that signing dramatically boosts IQ or speeds up talking — are not strongly supported. Studies have not reliably shown lasting advantages in language development or intelligence. And importantly, **signing does not delay speech** — that is a common worry, and it is unfounded; babies drop the signs naturally as words take over.
So the realistic takeaway: sign for the genuine, everyday benefit — earlier communication and less frustration in the here and now — not for a promised head start. That benefit alone is worth it for many families.
## When to start
You can start modeling signs from around **6 to 8 months**, though your baby likely will not sign back until closer to **8 to 12 months**, once their motor skills and understanding catch up. Do not be discouraged by the gap — you are planting seeds. Some babies sign earlier, some later, and that is normal. You can start earlier just by modeling; just keep expectations relaxed about when they will respond.
## The best first signs to teach
Start with a few high-value signs tied to things your baby cares about most — that is where motivation lives:
- **Milk** (opening and closing a fist) — often the first and most useful
- **More** (fingertips of both hands tapping together)
- **All done / finished** (twisting open hands)
- **Eat / food** (fingertips to the mouth)
- **Water / drink**
- Later: **sleep, help, please, mom, dad, and favorites like dog or ball**
Begin with just two or three (milk, more, all done are classics) so it is not overwhelming for either of you, and add more as they catch on.
[[CTA||Log first signs and words in MamaBee — and watch your baby's communication bloom.]]
## How to teach it (the method)
Consistency and repetition are everything:
- **Say the word and make the sign together, every time** the situation comes up. Sign "milk" each time you feed, "more" at every meal, "all done" when finishing.
- **Make eye contact** so your baby sees the sign clearly.
- **Repeat, repeat, repeat.** Babies learn through repetition; it may take weeks of modeling before your baby signs back. Keep going.
- **Get the whole family (and caregivers) using the same signs** for consistency.
- **Respond enthusiastically** when your baby attempts a sign — even a rough approximation. Celebrate it and meet the need, which reinforces that signing works.
- **Keep it fun and pressure-free.** This is play and connection, not a drill. If it stops being enjoyable, ease off.
## Realistic expectations
A few things to keep in mind so you are not disappointed:
- Your baby's signs will be **approximate** at first — a rough version of "more" still counts. Reward the attempt.
- There is usually a **long modeling period** before they sign back. Persistence pays off.
- Not every baby takes to it, and that is okay — it is a tool, not a test.
- Signs **fade naturally** as speech develops, exactly as they should.
## Common mistakes to avoid
A few missteps make signing harder than it needs to be. **Trying too many signs at once** overwhelms both of you — start with two or three and add more only once those land. **Signing without saying the word** misses the point; always pair the gesture with the spoken word so you are building language, not replacing it. **Giving up too soon** is the big one — the weeks-long gap between when you start modeling and when your baby first signs back leads many parents to quit right before it clicks, so keep going even when it feels like nothing is happening. **Inconsistency between caregivers** slows things down, so make sure everyone who cares for your baby uses the same signs. And **correcting or drilling** your baby drains the joy out of it — reward every rough attempt enthusiastically rather than insisting on a perfect gesture. Keep it light, repetitive and consistent, and it tends to work.
## Frequently asked questions
### Does baby sign language delay speech?
No. This is a common worry and it is unfounded — signing does not delay talking. Babies naturally drop the signs as spoken words take over, and signing is generally paired with saying the word aloud, which supports language.
### When should I start baby sign language?
You can start modeling signs around 6 to 8 months, though most babies do not sign back until 8 to 12 months, once their motor skills and understanding develop. Starting earlier just means more modeling before they respond.
### What are the best first signs to teach a baby?
Start with high-value, motivating signs: milk, more, and all done are the classic first three. Add eat, water, sleep, help, and favorites like mom, dad or dog as your baby catches on.
### Does baby sign language actually work?
Many parents find it genuinely reduces frustration by letting babies communicate needs earlier. The bigger claims about boosting IQ or speeding speech are not well supported, but the everyday benefit of earlier communication is real.
## The takeaway
Baby sign language is a practical bridge across the gap between what your baby wants and what they can say — it will not turn them into a genius or speed up talking, and it definitely will not delay speech, but it can genuinely reduce frustration by letting them communicate months before words arrive. Start modeling a few high-value signs like milk, more and all done around 6–8 months, say the word every time you sign, repeat patiently, and celebrate every attempt. Keep it playful, and enjoy the early conversations. For the bigger developmental picture, see [baby milestones month by month](/mamabee/articles/baby-milestones-by-month).
[[CTA||Get MamaBee free — track signs, words and milestones as your baby learns to communicate.]]
*This article is general information, not medical advice. Talk to your pediatrician if you have any concerns about your baby's communication or development.*`),

  A('how-to-burp-a-baby',
    'How to Burp a Baby: Positions, Tips, and What to Do If They Will Not Burp',
    'The best positions for burping a baby, how often and how long to burp, tips for a stubborn burp, whether breastfed babies need burping, and what to do when no burp comes.',
    ['how to burp a baby', 'burping a baby', 'baby wont burp', 'burping positions', 'baby burp tips'],
    {},
`Burping seems like it should be simple — until you are patting a squirmy baby for ten minutes with nothing to show for it, wondering if you are doing it wrong. Getting trapped air up keeps your baby comfortable and reduces spit-up and fussiness, so it is worth knowing the positions and tricks. Here is a practical guide to burping a baby, including what to do when the burp just will not come.
## Why burping matters
Babies swallow air while feeding — especially when bottle-feeding, gulping, or crying beforehand — and that trapped air can make them uncomfortable, fussy, and prone to spitting up. Burping releases it. It is not always dramatic or necessary, but a good burp often settles a squirmy, unhappy baby who has swallowed air mid-feed.
## The three classic burping positions
There is no single "right" way — try each and see which brings up the best burps for your baby:
### 1. Over the shoulder
The most common. Hold your baby upright against your chest with their chin resting on your shoulder, supporting their bottom with one hand. Gently pat or rub their back with the other. Keep a burp cloth on your shoulder — this position produces the most "wet burps."
### 2. Sitting on your lap
Sit your baby upright on your lap, leaning slightly forward. Support their chest and chin with one hand (the heel of your hand on their chest, fingers gently cradling the chin and jaw — never the throat), and pat or rub their back with the other. Great for babies who dislike the shoulder.
### 3. Face-down across your lap
Lay your baby tummy-down across your knees, supporting their head so it is slightly higher than their chest. Gently pat or rub their back. The gentle pressure on the tummy can help release stubborn air.
## The technique
- **Pat gently but firmly**, or use a cupped hand — a soft, rhythmic pat works better than a light tap.
- **Rub upward** — firm strokes up the back can move air up.
- **Keep your baby upright** and supported the whole time.
- **Be patient** — give it a few minutes; the burp does not always come instantly.
[[CTA||Track feeds and how baby settles in MamaBee — spot whether burping is easing the fussiness.]]
## How often and how long to burp
- **During the feed:** burp when switching breasts, or roughly halfway through a bottle. If your baby is gulping or fussy, pause and burp sooner.
- **After the feed:** burp again at the end.
- **How long:** a few minutes is plenty. If nothing comes up after about 5 minutes, it is usually fine to stop (see below).
## Do breastfed babies need burping?
Often less than bottle-fed babies, because a good latch means they swallow less air. But it still helps, especially if your baby feeds fast, has a strong let-down, or seems fussy. Burp breastfed babies when switching sides and after feeds, but do not stress if they rarely produce a big burp — many breastfed babies simply do not need to much.
## What if my baby will not burp?
This is the common worry, and the reassuring answer: **it is usually fine.** If you have tried for about five minutes and no burp comes, your baby may simply not have air to bring up. What to do:
- **Stop after ~5 minutes** — you do not need to force it, and prolonged patting can just frustrate you both.
- **Change positions** — sometimes switching from the shoulder to the lap position releases a stubborn burp.
- **Try gentle movement** — a few gentle leg bicycles, or laying them down and picking them back up, can shift trapped air.
- **Keep them upright** for 10–20 minutes after feeding to let air rise naturally.
- **Watch for later discomfort** — if your baby wakes fussy soon after, try burping again; the air may have moved.
And crucially: **a baby who is content and not spitting up or fussing may simply not need to burp.** If they are happy, you can skip it without worry.
## When trapped air is really gas
If your baby is often uncomfortable, arching or crying with a hard tummy despite burping, they may be dealing with gas further down. See our guide to [newborn gas relief](/mamabee/articles/newborn-gas-relief) for bicycle legs, tummy massage and more. Persistent, intense inconsolable crying may be [colic](/mamabee/articles/colic-in-babies) — worth reading if the crying is extreme.
## Do you always need to burp?
It is worth releasing the pressure — literally — on the idea that every feed must end in a burp. Burping helps, but it is not a rule your baby will suffer for if you occasionally skip it. Some babies swallow very little air and rarely need burping at all; others need it every feed. The best guide is your baby, not the clock. If they finish a feed calm, drift off content, and are not spitting up or squirming, you do not need to wake or jostle them for a burp — let a sleeping baby sleep. Conversely, a baby who is fussing, pulling off the breast or bottle mid-feed, or squirming is telling you to pause and burp. Over the first weeks you will learn your own baby's pattern, and burping will shift from an anxious chore to a quick, intuitive part of feeding. Trust what your baby shows you.
## Frequently asked questions
### How long should I burp my baby?
A few minutes is enough. If no burp comes after about five minutes, it is usually fine to stop — your baby may simply not have air to bring up. You do not need to force it.
### What if my baby will not burp?
It is usually fine. Try changing positions, gentle movement, and keeping them upright for 10–20 minutes after feeding. A content baby who is not spitting up or fussing may simply not need to burp.
### Do I need to burp a breastfed baby?
Often less than a bottle-fed baby, since a good latch means less swallowed air — but it still helps, especially with fast feeders or a strong let-down. Burp when switching sides and after feeds, without stressing if little comes up.
### What is the best burping position?
There is no single best one — try over the shoulder, sitting upright on your lap, and face-down across your lap, and see which brings up the best burps for your baby. Many parents find the shoulder position most reliable.
## The takeaway
Burping releases the air babies swallow while feeding, keeping them comfortable and reducing spit-up — try the three classic positions (over the shoulder, upright on your lap, face-down across your knees) and a firm, patient pat to find what works. Burp mid-feed and after, but do not force it: if no burp comes in about five minutes, or your baby is content, it is fine to move on. If discomfort persists despite burping, it may be gas or colic. Above all, relax — burping is helpful, not a test you can fail. For ongoing tummy trouble, see [newborn gas relief](/mamabee/articles/newborn-gas-relief).
[[CTA||Get MamaBee free — track feeds, burps and fussiness so you can see what keeps your baby comfy.]]
*This article is general information, not medical advice. Talk to your pediatrician about persistent discomfort, poor feeding, or reflux.*`),

  A('when-can-babies-drink-water',
    'When Can Babies Drink Water? A Clear Guide by Age',
    'When babies can safely drink water, why water is dangerous for newborns, how much water once solids start, and safe hydration in hot weather and illness — a clear age-by-age guide.',
    ['when can babies drink water', 'water for babies', 'baby water', 'can newborns have water', 'baby hydration'],
    {
      water: {
        caption: 'A general guide. Always ask your pediatrician about your baby.',
        headers: ['Age', 'Water?', 'What to know'],
        rows: [
          ['Under 6 months', 'No', 'Breast milk or formula only; water can be dangerous'],
          ['6–12 months', 'Small amounts', 'A few sips with solids; milk is still the main drink'],
          ['12 months+', 'Yes, freely', 'Water and whole milk become main drinks'],
        ],
      },
    },
`It seems like the most natural thing in the world to offer a baby a sip of water, especially on a hot day. But for young babies, water is not the harmless drink it is for us — in fact, before 6 months it can be genuinely dangerous. Here is a clear, age-by-age guide to when babies can drink water, how much, and how to keep your baby safely hydrated.
## The short answer
Babies do not need — and should not have — plain water until around **6 months.** Before then, **breast milk or formula provides all the hydration your baby needs**, even in hot weather. From around 6 months, once solids begin, you can offer small amounts of water. At 12 months, water becomes a free-flowing everyday drink.
[[TABLE:water]]
## Why water is dangerous for young babies
This surprises many parents, so it is worth understanding. Giving water to a baby under 6 months can cause real harm for two reasons:
- **Water intoxication.** A baby's kidneys are immature and cannot process extra water well. Too much water dilutes the sodium in their blood, which can cause a dangerous condition called hyponatremia — leading to irritability, drowsiness, low body temperature, and in severe cases seizures. It is rare but serious.
- **Displacing nutrition.** A baby's stomach is tiny. Water fills them up without any calories or nutrients, so they take less milk — which can affect weight gain and, for breastfeeding parents, milk supply.
Formula must always be **mixed exactly to the instructions** — never over-diluted with extra water, which carries the same risks. This is why you never add extra water to bottles or offer sips of water to a newborn, even when it is hot.
## Staying hydrated in the early months
If your baby seems thirsty or it is hot, the answer is **more milk, not water.** Breast milk and formula are mostly water and provide everything your baby needs to stay hydrated. Offer extra feeds in hot weather. Signs your baby is well hydrated: regular wet diapers (roughly 6+ a day once feeding is established), and being alert and content.
Watch for signs of dehydration — fewer wet diapers, a dry mouth, no tears when crying, sunken soft spot, or unusual sleepiness — and contact your doctor if you see them, especially during illness. For hydration during sickness in young babies, follow your pediatrician's advice rather than giving water on your own.
## From 6 months: introducing water
Once your baby starts [solids around 6 months](/mamabee/articles/when-to-start-solids), you can offer **small amounts of water** — a few sips from an open cup or a sippy/straw cup with meals. Key points:
- **Keep it small.** Water is for practice and a little hydration alongside solids, not a replacement for milk. Breast milk or formula remains the main drink through the first year.
- **Use a cup, not a bottle.** Offering water in an open or straw cup helps develop cup-drinking skills and protects emerging teeth.
- **Plain water only** — no juice, sugary drinks, or flavored water for babies.
- **A little is plenty** — think a few ounces total across the day at first.
## From 12 months: water freely
At one year, your baby can drink water freely whenever they are thirsty, and water (along with whole cow's milk) becomes a main drink as milk feeds reduce. Offer water throughout the day, especially with meals and in hot weather, and keep sugary drinks off the menu.
## Drinks to avoid — and what about juice?
As you introduce water, it helps to know what *not* to offer. **Fruit juice is not recommended for babies under 12 months** — even 100% juice adds sugar with little benefit, can displace milk and solids, and is hard on emerging teeth. After the first birthday, juice is best limited to a small amount if given at all, and always in a cup, not a bottle. Also keep away from **sugary drinks, sodas, flavored or sweetened waters, tea, coffee and any caffeinated drinks**, none of which belong in a baby's diet. **Cow's milk as a main drink** should wait until 12 months, since it is not a suitable substitute for breast milk or formula before then (small amounts mixed into food from around 6 months are fine). And skip **plant-based "milks"** as a main drink in the first year unless your pediatrician specifically advises one for an allergy or dietary reason. The simple rule for the first year: breast milk or formula as the main drink, small sips of plain water with solids from 6 months, and nothing sugary.
## Frequently asked questions
### Can newborns drink water?
No. Babies under 6 months should not have plain water — it can cause dangerous water intoxication and fill their tiny stomachs so they take less milk. Breast milk or formula provides all the hydration a young baby needs, even in hot weather.
### When can babies start drinking water?
Around 6 months, once solids begin, you can offer small amounts of water with meals — a few sips from a cup. Milk remains the main drink through the first year, and water becomes a free everyday drink from 12 months.
### How much water can a 6-month-old have?
Just small amounts — a few sips with meals, up to a few ounces total across the day. Water at this stage is for practice and light hydration alongside solids, not a substitute for breast milk or formula.
### How do I keep my baby hydrated in hot weather?
For babies under 6 months, offer more breast milk or formula, not water — milk is mostly water and hydrates fully. From 6 months you can add small sips of water. Watch for regular wet diapers as a sign of good hydration.
## The takeaway
Babies under 6 months should never have plain water — it risks dangerous water intoxication and crowds out the milk they need — so keep hydration to breast milk or formula, even in the heat. From around 6 months you can offer small sips of water with solids in a cup, while milk stays the main drink, and from 12 months water flows freely. When in doubt about a young baby's hydration, especially during illness, offer more milk and call your pediatrician rather than reaching for water. For the solids that water accompanies, see [when to start solids](/mamabee/articles/when-to-start-solids).
[[CTA||Get MamaBee free — track feeds, diapers and hydration so you always know your baby is getting enough.]]
*This article is general information, not medical advice. Do not give water to a baby under 6 months without your pediatrician's guidance.*`),

  A('baby-sun-safety',
    'Baby Sun Safety: Sunscreen, Shade, and Protecting Delicate Skin',
    'How to protect your baby from the sun: why babies under 6 months need shade not sunscreen, when and how to use baby sunscreen, sun-safe clothing, heat safety, and what to avoid.',
    ['baby sun protection', 'baby sunscreen', 'sunscreen for babies', 'baby in the sun', 'protect baby from sun'],
    {},
`A baby's skin is thin, delicate, and far more vulnerable to the sun than ours — and sunburn in infancy is both painful and a real risk factor for skin damage later. The good news is that protecting your baby is simple once you know the age rules, which surprise many parents: for the youngest babies, the answer is shade and clothing, not sunscreen. Here is how to keep your baby sun-safe.
## The golden rule: shade first for young babies
For babies **under 6 months**, the primary advice is to **keep them out of direct sunlight** altogether. Their skin is too thin and sensitive, and sunscreen is generally not recommended for this age (more below). Instead:
- **Keep them in the shade** — under a tree, umbrella, canopy, or stroller shade.
- **Avoid peak sun** — stay out of direct sun during the strongest hours, roughly 10am to 4pm.
- **Dress them in protective clothing** — lightweight long sleeves, long pants, and a wide-brimmed hat.
Shade and clothing are your main tools for the youngest babies, not creams.
## When can babies wear sunscreen?
The standard guidance: **sunscreen is not recommended for babies under 6 months** — keep them out of the sun instead. From **6 months onward**, sunscreen becomes an important part of sun protection, used alongside shade and clothing.
The one exception for young babies: if you truly cannot keep a small area (like the face and backs of the hands) shaded, a **minimal amount of baby-safe sunscreen** on those spots is considered acceptable — but check with your pediatrician, and it is a last resort, not a substitute for shade.
## Choosing and using baby sunscreen (6 months+)
Once your baby is over 6 months:
- **Choose a mineral (physical) sunscreen** with **zinc oxide or titanium dioxide** — these sit on top of the skin and are gentler than chemical sunscreens, which are better for sensitive baby skin.
- **Use "broad spectrum" SPF 30 or higher.**
- **Apply generously** about 15–30 minutes before going out, and **reapply every 2 hours**, and after swimming or sweating.
- **Do not miss** the ears, back of the neck, tops of feet, and hands.
- **Patch test** a new sunscreen on a small area first, since baby skin can react.
## Sun-safe clothing and gear
Clothing is often better protection than sunscreen, and it does not wear off:
- **Wide-brimmed hat** that shades the face, ears and neck
- **Lightweight, tightly-woven long sleeves and pants**, or purpose-made UPF sun-protective clothing
- **UV-protective swimwear** (a rash guard / sun suit) for water play
- **Baby-safe sunglasses** with UV protection, if your baby will tolerate them
- **Stroller shade or canopy** for outings, but never drape a blanket fully over a stroller — it traps heat dangerously (see below)
[[CTA||Track outings, naps and how your baby copes with heat in MamaBee — one calm log.]]
## Heat safety goes hand in hand
Sun protection is not just about UV — babies overheat easily, which is dangerous:
- **Never leave a baby in a parked car**, even briefly — car temperatures rise fatally fast.
- **Do not cover a stroller with a blanket** to make shade; it can trap heat and dramatically raise the temperature inside. Use a proper clip-on stroller shade with airflow.
- **Watch for overheating** — flushed skin, rapid breathing, restlessness or unusual sleepiness. Move to a cool place and offer a feed.
- **Keep young babies hydrated with extra milk** in the heat, not water if under 6 months — see our guide on [when babies can drink water](/mamabee/articles/when-can-babies-drink-water).
- **Dress lightly** indoors and out in hot weather.
## Sun safety on the go
Sun protection is easiest when it is built into your routine rather than remembered in a panic at the beach. Keep a small **sun kit** ready in your diaper bag — a wide-brimmed hat, a lightweight long-sleeved layer, mineral sunscreen (for babies over 6 months), and a clip-on stroller shade — so you are never caught out. Plan outings around the cooler, lower-sun parts of the day where you can: early morning and late afternoon are kinder to baby skin than midday. Remember that **UV passes through clouds**, so overcast days still call for protection, and that reflective surfaces like water, sand and pavement bounce extra UV upward, reaching shaded skin. In the car, a **stick-on window shade** protects your baby from side-window sun on long drives. And model good habits yourself — babies who grow up seeing hats and sunscreen as simply part of going outside carry those habits for life. A little routine now saves a lot of sunburn later.
## Frequently asked questions
### Can I put sunscreen on a baby under 6 months?
Generally no — sunscreen is not recommended under 6 months, and the advice is to keep young babies out of direct sun using shade and clothing instead. If a small area truly cannot be shaded, a minimal amount of baby-safe sunscreen may be acceptable; check with your pediatrician.
### What sunscreen is best for babies?
For babies over 6 months, a mineral (physical) sunscreen with zinc oxide or titanium dioxide, broad spectrum SPF 30 or higher. Mineral formulas are gentler on sensitive skin than chemical sunscreens. Patch test first.
### How do I protect a newborn from the sun?
Keep them out of direct sunlight, especially during peak hours (about 10am–4pm), use shade (umbrella, canopy, tree), and dress them in lightweight long sleeves, long pants and a wide-brimmed hat. Avoid sunscreen at this age.
### Is it dangerous to cover a stroller with a blanket for shade?
Yes. Draping a blanket over a stroller can trap heat and raise the temperature inside to dangerous levels, even if it looks shady. Use a proper clip-on stroller shade that allows airflow instead.
## The takeaway
Protecting your baby from the sun comes down to age: under 6 months, rely on shade, protective clothing and avoiding peak sun rather than sunscreen; from 6 months, add a gentle mineral sunscreen (zinc oxide, SPF 30+, reapplied every 2 hours) on top of shade and clothing. Pair sun safety with heat safety — never a covered stroller or a parked car, watch for overheating, and keep young babies hydrated with extra milk. A little planning keeps your baby's delicate skin safe all summer. For hot-weather hydration, see [when can babies drink water](/mamabee/articles/when-can-babies-drink-water).
[[CTA||Get MamaBee free — track outings, feeds and your baby's comfort through every sunny day.]]
*This article is general information, not medical advice. Talk to your pediatrician about sun protection and sunscreen for your baby.*`),

  A('c-section-recovery',
    'C-Section Recovery: What to Expect Week by Week and How to Heal Well',
    'A realistic guide to recovering from a C-section: the timeline week by week, how to care for your incision, managing pain, what to avoid, warning signs, and being gentle with yourself.',
    ['c-section recovery', 'cesarean recovery', 'c section healing', 'recovery after c section', 'c section incision care'],
    {
      timeline: {
        caption: 'A rough guide — everyone heals differently. Follow your own care team.',
        headers: ['When', 'What is often happening'],
        rows: [
          ['Days 1–7', 'Hospital then home; significant soreness, slow careful movement'],
          ['Weeks 2–3', 'Incision healing, pain easing, still limited lifting'],
          ['Weeks 4–6', 'Gradually more mobile; the 6-week check'],
          ['Weeks 6–12+', 'Cleared for more activity; deeper healing continues for months'],
        ],
      },
    },
`A C-section is major abdominal surgery — and yet new mothers are expected to recover from it while also caring for a newborn around the clock. That combination is genuinely demanding, and you deserve real information and real gentleness. Here is a realistic, week-by-week guide to healing well after a cesarean, caring for your incision, and knowing when to call your doctor.
## First, respect what your body went through
It bears repeating because our culture often glosses over it: a C-section is **major surgery.** Your body needs time to heal on the inside as well as the outside, and pushing too hard too soon can set your recovery back. Full recovery commonly takes **six weeks at minimum, and often longer** — deeper healing continues for months. Be patient and kind with yourself.
## The recovery timeline
[[TABLE:timeline]]
### The first days
You will likely stay in hospital a few days. Expect soreness around the incision, and you will be encouraged to get up and walk gently soon after — this actually helps recovery and reduces the risk of blood clots. Movements like standing, coughing or laughing may hurt; holding a pillow against your incision helps. Bleeding (lochia) is normal, as after any birth.
### Weeks 1–3 at home
Pain steadily eases but is still present. Move slowly and carefully, especially getting in and out of bed. Rest as much as a newborn allows, keep the incision clean and dry, and avoid lifting anything heavier than your baby.
### Weeks 4–6 and the check-up
Most people feel meaningfully better by around six weeks, when you will typically have a postnatal check. This is often when you may be cleared for more activity, exercise and driving — but only when your doctor says so, and based on how *you* feel.
### Beyond six weeks
"Recovered" at six weeks does not mean fully healed. Scar sensation, occasional twinges, and core weakness can continue for months. That is normal.
## Caring for your incision
- **Keep it clean and dry.** Follow your care team's instructions for washing and dressing it.
- **Wear loose, high-waisted clothing** that does not rub the incision (many find high-waisted "C-section" underwear comfortable).
- **Support the incision** when you cough, sneeze, laugh or move, by gently holding a pillow against it.
- **Watch it heal** — some numbness, itching and a raised scar are normal as it recovers.
## Managing pain and moving gently
- **Take pain relief as prescribed** — staying on top of pain helps you move, feed and heal. Ask what is safe while breastfeeding (many options are).
- **Log-roll out of bed** — roll to your side, then push up with your arms, to protect your core.
- **Avoid heavy lifting** — nothing heavier than your baby for the first weeks.
- **No strenuous exercise, driving or heavy housework** until cleared.
- **Gentle walking** is good; build up slowly.
[[CTA||Track your recovery, pain and your baby's needs together in MamaBee — one gentle place.]]
## What to avoid
- **Lifting anything heavier than your baby** in the early weeks
- **Strenuous exercise and core workouts** until cleared by your doctor
- **Driving** until you can do so safely and comfortably and your doctor agrees
- **Stairs repeatedly**, and overdoing it generally — pace yourself
- **Ignoring pain or warning signs** in an effort to "push through"
## Warning signs — call your doctor now
Contact your care team promptly for:
- **Signs of incision infection** — increasing redness, swelling, warmth, pus or foul-smelling discharge, or the wound opening
- **Fever** (a temperature of 100.4°F/38°C or higher)
- **Heavy vaginal bleeding** — soaking a pad an hour, or large clots
- **Severe or worsening pain** rather than gradual improvement
- **Leg pain, redness or swelling, or chest pain and shortness of breath** — possible blood clot, seek urgent care
- **Signs of postpartum depression or anxiety** — this matters as much as physical healing; see our [postpartum recovery and mental health guide](/mamabee/articles/postpartum-recovery-mental-health)
## Be gentle with yourself
Recovering from surgery while caring for a newborn on little sleep is genuinely hard, and there is no prize for doing it alone or "bouncing back." Accept help, rest whenever you can, lower the bar on everything non-essential, and let people bring meals and hold the baby while you heal. Your only jobs are recovering and feeding your baby. And if you feel any grief or complicated feelings about having had a C-section, those are valid too — how your baby arrived does not diminish anything.
## Setting up for an easier recovery
A little preparation makes the early weeks far more manageable, especially since bending, reaching and lifting are exactly what your incision does not want. If you can, set up a **recovery station** where you spend most of your time: diapers, wipes, water, snacks, phone charger, pain medication and burp cloths all within arm's reach, so you are not repeatedly getting up. Keep the **bassinet or crib close** and at a height that does not require deep bending. Wear **loose, high-waisted clothing** and stock up on comfortable underwear that sits above the incision. Have **easy-to-eat, one-handed meals** prepared or delivered. Position everything so you can care for your baby without twisting your core — a supportive feeding pillow helps you hold your baby without pressing on the incision. And say yes to help in advance: line up someone to handle stairs, laundry, older siblings and the heavier chores for the first couple of weeks. The goal is to remove every unnecessary bend, reach and lift from your day so your body can spend its energy healing.
## Frequently asked questions
### How long does it take to recover from a C-section?
At least six weeks for the initial recovery, and often longer, with deeper healing continuing for months. It is major abdominal surgery, so patience matters — most people feel significantly better by the six-week check but are not fully healed then.
### When can I exercise or drive after a C-section?
Usually after your six-week check and only when your doctor clears you and you feel ready. Gentle walking is encouraged early, but strenuous exercise, core workouts, heavy lifting and driving should wait until you are cleared.
### How do I care for my C-section incision?
Keep it clean and dry per your care team's instructions, wear loose high-waisted clothing, support it with a pillow when coughing or moving, and watch for healing. Some numbness, itching and a raised scar are normal.
### What are the warning signs after a C-section?
Call your doctor for incision infection (redness, swelling, pus, foul discharge, wound opening), fever, heavy bleeding, worsening pain, or leg/chest symptoms suggesting a clot. Also seek help for signs of postpartum depression or anxiety.
## The takeaway
A C-section is major surgery, and recovery takes at least six weeks and often longer — so move gently, care for your incision, stay on top of pain relief, avoid heavy lifting and strenuous activity until cleared, and watch for the warning signs of infection or a clot. Just as importantly, be kind to yourself: accept help, rest, and tend to your mental health alongside your body. Healing well means going slow, and that is not weakness — it is wisdom. For the emotional side, see [postpartum recovery and mental health](/mamabee/articles/postpartum-recovery-mental-health).
[[CTA||Get MamaBee free — track your healing and your baby together, so nothing gets lost in the fog.]]
*This article is general information, not medical advice. Follow your own care team, and contact them promptly about any warning signs.*`),

  A('postpartum-hair-loss',
    'Postpartum Hair Loss: Why It Happens and What Actually Helps',
    'Why postpartum hair loss happens, when it starts and stops, whether it is normal, what genuinely helps, and when shedding might signal something else worth checking.',
    ['postpartum hair loss', 'postpartum shedding', 'hair loss after pregnancy', 'postpartum hair', 'hair falling out after baby'],
    {},
`You survived pregnancy and birth, and then a few months in, your hair starts falling out in alarming clumps — in the shower, on your pillow, all over the baby. Take a breath: postpartum hair loss is extremely common, completely normal, and temporary. Here is why it happens, when it ends, and what actually helps (and what does not).
## Why postpartum hair loss happens
The explanation is oddly reassuring. During pregnancy, high estrogen levels put more of your hair into a prolonged "growing" phase, so hair barely sheds — which is why so many people have thick, luscious hair while pregnant. After birth, hormone levels drop sharply, and all that hair that was hanging on suddenly shifts into the "shedding" phase at once.
So you are not losing more hair than normal overall — you are **shedding the extra hair you held onto during pregnancy, all at the same time.** The medical name is telogen effluvium, and it is a normal hormonal reset, not a sign that anything is wrong.
## When it starts and stops
- **Starts:** usually around **3 to 4 months postpartum** (it often surprises people because it is not right after birth).
- **Peaks:** around **4 months.**
- **Resolves:** typically settles by **6 to 12 months postpartum**, with hair returning to its normal fullness by your baby's first birthday for most people.
It can feel dramatic — sometimes genuinely handfuls — but it stops on its own. You are not going bald; your hair is recalibrating.
## What actually helps
Here is the honest part: because this is hormonal, **there is no magic product that stops it**, and it will resolve on its own regardless. But a few things genuinely help you feel and look better while you ride it out:
- **Be gentle with your hair.** Avoid tight ponytails, buns and styles that pull; use a soft scrunchie; brush gently with a wide-tooth comb; and go easy on heat styling and tight braids.
- **Eat well and keep up any prenatal vitamins** your doctor recommends. Good nutrition supports healthy hair; a balanced diet with enough protein, iron and other nutrients matters — especially since new parenthood makes eating well hard.
- **Use volumizing shampoos** and consider a fresh haircut or a shorter style, which can make thinning hair look fuller and is easier to manage with a baby.
- **Be patient and kind to yourself.** It is temporary. Knowing it will pass takes a lot of the worry out of it.
What does *not* work: expensive "hair growth" products marketed to new mothers rarely change the underlying hormonal timeline. Save your money.
[[CTA||Track your postpartum recovery — body and mind — in MamaBee, gently.]]
## When it might be something more
Postpartum shedding is normal, but a few situations are worth a doctor's check:
- **Shedding that is still heavy well beyond 12 months**, or does not improve at all
- **Bald patches or hair coming out in distinct round spots** (different from all-over thinning) — worth checking
- **Other symptoms alongside it** — extreme fatigue, weight changes, feeling cold, low mood — which could point to a **thyroid issue or iron deficiency (anemia)**, both common after birth and both treatable
- Postpartum thyroid problems are surprisingly common and can cause hair changes, so if something feels off beyond normal shedding, ask for a simple blood test.
Mentioning it at your postnatal check is completely reasonable — your doctor can rule out thyroid or iron issues easily.
## A note on how it feels
Losing your hair on top of everything else — the exhaustion, the body changes, the identity shift of new parenthood — can genuinely knock your confidence. That is a valid feeling, not vanity. If postpartum hair loss is adding to low mood, it is worth mentioning, because it often overlaps with the emotional adjustment of the postpartum period. Be as gentle with your feelings as with your hair. See our [postpartum recovery and mental health guide](/mamabee/articles/postpartum-recovery-mental-health).
## Styling tips while it grows back
As the shedding slows, you will notice a fringe of short new baby hairs growing back in, often around your hairline and temples — a sign of recovery, even if those tufts stick up at first. A few tricks help you feel put-together through the awkward regrowth stage. A **shorter or layered cut** makes remaining hair look fuller and is far easier to manage with a baby, and it grows out more gracefully than long hair thinned at the ends. **Volumizing shampoos and a lightweight mousse** at the roots add body. A **deep side part or a bit of texture** disguises thinning at the crown. Soft **headbands, clips or a light styling paste** tame flyaway regrowth around your face. Skip heavy oils and serums that flatten fine new hair, and avoid tight styles that stress the fragile regrowth. Most of all, be patient with the in-between phase — those spiky little baby hairs mean your hair is coming back, right on schedule.
## Frequently asked questions
### When does postpartum hair loss start and stop?
It usually starts around 3 to 4 months postpartum, peaks around 4 months, and resolves by 6 to 12 months, with most people back to their normal hair fullness by their baby's first birthday.
### Is postpartum hair loss normal?
Yes, it is very common and completely normal. It happens because the extra hair you held onto during pregnancy (thanks to high estrogen) all sheds at once when hormones drop after birth. It is a temporary hormonal reset, not a sign of illness.
### How can I stop postpartum hair loss?
There is no product that stops the hormonal shedding, and it resolves on its own. You can be gentle with your hair, eat well and keep up recommended vitamins, use volumizing products or a shorter cut, and be patient — it is temporary.
### When should I see a doctor about postpartum hair loss?
See your doctor if heavy shedding continues well beyond 12 months, you notice distinct bald patches, or it comes with symptoms like extreme fatigue, weight changes or feeling cold — which could indicate a thyroid or iron issue, both common after birth and treatable.
## The takeaway
Postpartum hair loss is a normal, temporary hormonal reset — the extra hair you kept during pregnancy shedding all at once — that starts around 3–4 months and resolves by your baby's first birthday. No product stops it, but gentle hair care, good nutrition and patience help you through it, and a flattering cut can make it easier to live with. If shedding is extreme, patchy, or comes with fatigue or other symptoms, ask your doctor to check your thyroid and iron. Be kind to yourself — this passes. For the wider recovery picture, see [postpartum recovery and mental health](/mamabee/articles/postpartum-recovery-mental-health).
[[CTA||Get MamaBee free — track your own recovery alongside your baby's, because you matter too.]]
*This article is general information, not medical advice. Talk to your doctor about heavy or unusual hair loss, or any other postpartum symptoms.*`),

  A('dressing-baby-for-sleep',
    'How to Dress Your Baby for Sleep: A Simple Temperature Guide',
    'How to dress your baby for sleep safely at any room temperature, what a TOG rating means, how to use sleep sacks and swaddles, and how to tell if your baby is too hot or too cold.',
    ['how to dress baby for sleep', 'baby sleep temperature', 'sleep sack tog', 'what should baby wear to sleep', 'baby too hot sleeping'],
    {
      tog: {
        caption: 'A general guide — adjust to your baby. Overheating is a safety risk, so err cooler.',
        headers: ['Room temp', 'Suggested layers'],
        rows: [
          ['24°C+ / 75°F+', 'Just a diaper or a short-sleeve bodysuit; light 0.5 TOG sack'],
          ['20–24°C / 68–75°F', 'Bodysuit + 1.0 TOG sleep sack'],
          ['16–20°C / 61–68°F', 'Bodysuit + footed sleeper + 2.5 TOG sack'],
          ['Below 16°C / 61°F', 'Add a layer; warm the room if you can'],
        ],
      },
    },
`Dressing a baby for sleep sounds trivial until you are standing over the crib at midnight wondering if they are too hot, too cold, or just right — and knowing that getting it wrong matters, because overheating is a genuine safety concern. The good news: there is a simple system. Here is how to dress your baby for sleep safely at any temperature, what TOG means, and how to read your baby's own signals.
## The golden rule: not too hot
Before layers and TOG, the single most important principle: **babies should not get too warm when they sleep, because overheating is a risk factor for SIDS.** When in doubt, err on the side of slightly cooler rather than warmer. A comfortably cool room and appropriate light layers are safer than a bundled-up, overheated baby.
The recommended room temperature for baby sleep is around **16–20°C (about 68°F)** — cooler than many people expect. You do not need to keep the nursery warm.
## The simple layering rule
A handy guideline: dress your baby in **one more layer than you would wear** to be comfortable in the room — no more. For a baby, a "layer" might be a bodysuit, a sleeper, or a sleep sack. The aim is comfortable warmth, not cozy heat.
[[TABLE:tog]]
Use the table as a starting point and adjust to your baby and your home — every house and baby is a little different.
## What is a TOG rating?
TOG is simply a **measure of how warm a sleep sack or swaddle is** — the higher the number, the warmer it is. It takes the guesswork out of layering:
- **0.5 TOG** — lightweight, for warm rooms/summer
- **1.0 TOG** — all-purpose, for typical room temperatures
- **2.5 TOG** — warm, for cooler rooms/winter
Match the TOG to your room temperature (sleep sacks usually include a guide), and pair it with the right clothing layer underneath. A TOG-rated sleep sack makes dressing for sleep almost foolproof.
## Sleep sacks and swaddles
- **Sleep sacks (wearable blankets)** are the safe modern alternative to loose blankets, which should never go in a crib. They keep your baby warm without any loose bedding — a win for both warmth and [safe sleep](/mamabee/articles/safe-sleep-guidelines).
- **Swaddles** suit newborns who like to be snug, but **stop swaddling as soon as your baby shows any signs of rolling** (usually around 8 weeks or so), switching to a sleep sack that allows arm movement. A swaddled baby who rolls is a safety risk. See [how to swaddle a baby](/mamabee/articles/how-to-swaddle-a-baby).
- **No loose blankets, quilts, or duvets** for babies — a sleep sack replaces them entirely.
[[CTA||Track sleep and room conditions in MamaBee — dial in what helps your baby rest best.]]
## How to tell if your baby is too hot or too cold
Forget their hands and feet — babies' extremities are often cool even when they are perfectly warm, so cool hands are not a reliable sign. Instead:
- **Feel the chest, back of the neck, or tummy.** These should feel comfortably warm — not hot and sweaty, not cold.
- **Signs of overheating:** sweating, damp hair, flushed cheeks, rapid breathing, or feeling hot to the touch on the chest/neck. Remove a layer.
- **Signs of being too cold:** a genuinely cold chest or tummy (not just cool hands). Add a layer.
If your baby feels hot, take a layer off — overheating is the one to avoid most.
## A few more safety notes
- **No hats indoors for sleep** — babies release heat through their heads, and hats can cause overheating.
- **Keep the crib bare** — the sleep sack is the only "bedding" needed.
- **Dress for the room, not the season** — a warm night in a cool, air-conditioned room needs different layers than the thermostat suggests.
- **Check on a very hot night** — offer extra feeds for hydration and use the lightest safe layers.
## Adjusting through seasons and travel
The layering system stays the same, but the numbers shift with your circumstances, so re-check rather than running on autopilot. In **summer**, especially without air conditioning, a hot nursery may call for nothing more than a bodysuit and a 0.5 TOG sack — and on the hottest nights, a diaper and a light sack alone. In **winter**, warm the room to the safe range rather than piling on extra layers or blankets, and reach for a higher-TOG sack over a footed sleeper. **Air conditioning and fans** matter too: a baby sleeping in a cool, air-conditioned room in summer may actually need a warmer layer than the outdoor weather suggests, so dress for the room, not the forecast. When **traveling**, hotel rooms and grandparents' houses run at unfamiliar temperatures — pack a couple of different sack weights and check your baby's chest on the first night in a new place. A cheap **room thermometer** (many baby monitors include one) takes the guesswork out of all of this and is well worth having. Whatever the season, the safety principle never changes: cooler is safer than too warm.
## Frequently asked questions
### What should my baby wear to sleep?
Dress your baby in about one more layer than you would wear to be comfortable in the room, using a TOG-rated sleep sack over a bodysuit or sleeper. Aim for comfortably warm, not hot, and keep the room around 16–20°C (about 68°F).
### What is a TOG rating for sleep sacks?
TOG measures how warm a sleep sack is — 0.5 TOG for warm rooms, 1.0 for typical temperatures, and 2.5 for cooler rooms. Matching the TOG to your room temperature makes dressing for sleep almost foolproof.
### How do I know if my baby is too hot?
Feel their chest, tummy or the back of the neck — not their hands and feet, which are normally cool. Sweating, damp hair, flushed cheeks or a hot chest mean they are too warm; remove a layer, since overheating is a safety risk.
### Can my baby sleep with a blanket?
No — loose blankets are not safe in a crib for babies. Use a wearable sleep sack instead, which keeps your baby warm without any loose bedding. This protects both warmth and safe sleep.
## The takeaway
Dressing your baby for sleep comes down to one principle — do not let them overheat — plus a simple system: dress them in one more layer than you would wear, use a TOG-rated sleep sack matched to a cool room (around 16–20°C), and skip loose blankets and indoor hats entirely. Check warmth on the chest or neck, not the hands, and remove a layer at any sign of overheating. Get this right and your baby sleeps safely and comfortably. For the full sleep-safety picture, see [safe sleep guidelines](/mamabee/articles/safe-sleep-guidelines).
[[CTA||Get MamaBee free — track sleep and what works, so every night is safer and calmer.]]
*This article is general information, not medical advice. Follow safe-sleep guidance and talk to your pediatrician with any concerns.*`),

  A('how-to-cut-baby-nails',
    'How to Cut Baby Nails Safely (Without the Fear)',
    'How to trim your baby fingernails and toenails safely, the best tools, the easiest time to do it, how to avoid cutting the skin, and what to do if you nick your baby.',
    ['how to cut baby nails', 'cutting baby nails', 'trim baby nails', 'baby nail care', 'baby scratching face'],
    {},
`Few ordinary baby-care tasks strike as much fear into new parents as cutting those tiny, paper-thin fingernails — the terror of nicking that impossibly small finger is real. But your baby's nails grow fast and sharp, and left untrimmed they will scratch their own face. Here is how to cut baby nails safely and calmly, so it stops being a two-person, white-knuckle operation.
## Why it matters (and why it feels so scary)
Babies' nails grow surprisingly quickly, and they have little control over their flailing hands, so sharp nails mean scratched cheeks and faces — sometimes alarming-looking scratches near the eyes. So it does need doing, often as much as once or twice a week for fingernails.
It feels scary because the nails are tiny, soft, and hard to distinguish from the fingertip, and babies wriggle. That fear is normal — but with the right tool, timing and technique, it becomes routine.
## The best tools
Use a tool made for babies, not adult clippers:
- **Baby nail clippers** — small, often with a rounded design, are the most popular choice.
- **Baby nail scissors** — small scissors with rounded, blunt tips; many parents find these give the most control on tiny nails.
- **A baby emery board (nail file)** — the safest option for newborns, especially in the first weeks. You simply file the sharp edges down with no risk of cutting skin. Great for the very nervous or for very tiny nails.
- **An electric baby nail file** — gentle rotating files that sand nails down; some parents love them, especially for sleeping babies.
Avoid biting your baby's nails off (a common tip) — it can introduce germs and you cannot see what you are doing.
## The single best trick: timing
The number-one tip that changes everything: **cut your baby's nails while they are asleep or drowsy.** A sleeping baby is relaxed, still, and will not yank their hand away. Many parents do it during a deep nap or after a feed when the baby is milk-drunk and floppy. Other good moments:
- **After a bath**, when nails are softer and easier to trim
- **During a feed**, when they are calm and distracted
- When a **second person can hold and soothe** the baby while you cut
## How to do it safely, step by step
- **Hold the finger firmly.** Isolate the finger you are trimming and press the fingertip pad down and away from the nail, so you can clearly see the nail and avoid the skin.
- **Cut fingernails following the curve** of the nail; **toenails straight across** to help prevent ingrown nails.
- **Trim, do not cut too short** — leave a tiny bit of white; going too short is what nicks the skin.
- **Go slowly, one nail at a time** — you do not have to do all ten in one sitting. Do a few now, a few later if your baby stirs.
- **Work in good light** so you can clearly see nail versus skin.
- **File any sharp edges** afterward for a smooth finish.
[[CTA||Track the little routines — baths, nail trims, and more — in MamaBee, one calm tap at a time.]]
## If you nick the skin
First: **it happens to almost every parent, and it is okay.** Do not panic or feel guilty. Tiny fingertips bleed a lot for their size, which looks scary but is rarely serious. What to do:
- **Stay calm** — your baby takes their cue from you.
- **Apply gentle pressure** with a clean tissue or gauze until the bleeding stops (it usually does quickly).
- **Rinse** gently with a little clean water if needed.
- **Do not use adhesive bandages** on a baby's finger — they are a choking hazard if they come off and can be swallowed.
- **Comfort your baby** with a cuddle or feed. It will heal fast.
If bleeding does not stop after a few minutes of pressure, or the area looks infected later (redness, swelling, pus), contact your doctor — but that is rare.
## Newborn nails: often just file
In the first weeks, newborn nails are extremely soft and thin and attached closely to the skin, which makes clipping risky. Many experts suggest **just filing them with an emery board** at this stage, or gently peeling off the tiny soft tips (only if they are clearly loose). Save the clippers for when the nails firm up a bit. Scratch mittens can help protect the face in the meantime, though babies often dislike having their hands covered.
## Frequently asked questions
### When is the best time to cut a baby's nails?
While your baby is asleep or drowsy — they are relaxed and still, so it is far safer and less stressful. After a bath (when nails are soft) or during a calm feed also work well, ideally with a second person to help soothe.
### What should I use to cut my baby's nails?
Use baby-specific tools: baby nail clippers, small rounded-tip baby scissors, or an emery board (the safest for newborns). An electric baby nail file is another gentle option. Avoid adult clippers and biting the nails off.
### What do I do if I cut my baby's finger?
Stay calm — it happens to almost everyone. Apply gentle pressure with clean gauze until the bleeding stops, rinse if needed, and comfort your baby. Do not use adhesive bandages (a choking hazard). Call your doctor only if bleeding will not stop or it looks infected later.
### How often should I cut my baby's nails?
Fingernails often need trimming once or twice a week because they grow fast and can scratch your baby's face; toenails grow more slowly and need it less often. File sharp edges in between as needed.
## The takeaway
Cutting baby nails is far less terrifying with the right approach: use baby-specific clippers, scissors or a file, and above all do it while your baby is asleep or drowsy so they stay still. Hold the fingertip clear of the nail, trim following the nail's curve (toenails straight across), leave a little white, and go one nail at a time. For newborns, filing is often safest. And if you do nick the skin, stay calm, apply pressure, and know it happens to nearly every parent. With practice, it becomes a quick, routine part of caring for your baby. For more early routines, see our guide on [how often to bathe a baby](/mamabee/articles/how-often-to-bathe-a-baby).
[[CTA||Get MamaBee free — keep every little care routine on track, one gentle tap at a time.]]
*This article is general information, not medical advice. Contact your pediatrician if a cut will not stop bleeding or shows signs of infection.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${a.slug}`, _type: 'article', brand: 'mamabee', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs Studio', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const t = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1200 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words${t?`, ${t} tbl`:''})`)
}
console.log('\nDone — 10 MamaBee week-8 DRAFTS. Nothing live.')
