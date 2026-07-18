// Second small pass: pushes the remaining drafts comfortably over 1000 words.
// Inserts one more short section before the FAQ. Run ONCE.
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
function md(src){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else out.push(block('normal',line))}return out}

const extra = {
  'how-much-should-a-newborn-eat': `## Feeding on demand beats the clock
In the newborn stage, **responsive (on-demand) feeding** — feeding whenever your baby shows hunger cues rather than by a strict clock — is generally recommended over rigid schedules. It supports milk supply, helps your baby self-regulate, and lowers everyone's stress. Loose rhythms will emerge on their own as your baby grows; you don't need to force them early. Follow the baby now, and the routine comes later.`,
  'baby-poop-color-chart': `## What changes when solids start
Around 6 months, when solid foods enter the picture, expect the diaper drama to level up again: poop gets thicker, browner, smellier, and may briefly feature undigested bits of whatever your baby ate (peas and corn are famous). New colors from foods like beets or blueberries can look alarming but are usually harmless. Once again, the rule holds — a *change* paired with other symptoms is what's worth a call, not a one-off surprise.
## Trust yourself
You will become a genuine expert in your own baby's normal. That instinct is valuable — if a diaper ever makes your gut say "something's off," it's always okay to check with your pediatrician. No question about your baby's health is ever silly.`,
  '4-month-sleep-regression': `## Signs the regression is easing
You're turning the corner when night wakings become less frequent, your baby resettles faster (sometimes without you), naps start to lengthen, and bedtime gets less of a battle. It rarely flips back to "fixed" overnight — it fades gradually over days. If weeks pass with no improvement at all, mention it to your pediatrician to rule out anything else, like reflux or an ear infection.`,
  'wake-windows-by-age': `## The last wake window of the day
Bedtime deserves special attention. The **final wake window before bed is often slightly shorter** than the daytime ones, which helps prevent the overtired "second wind" that makes bedtime a fight. If your baby is wired and hard to settle at night, try moving bedtime a touch earlier rather than later — counterintuitive, but it works.`,
  'tummy-time-guide': `## Make it a daily habit
The easiest way to hit your daily tummy-time minutes is to **attach it to things you already do** — a few minutes after each diaper change, or right after every morning nap. Habit-stacking beats willpower: when tummy time is glued to an existing routine, you'll never have to remember it, and the minutes quietly add up across the day.`,
  'newborn-gas-relief': `## The bottom line on newborn gas
Gas is one of the most common — and most temporary — newborn struggles. Burp often, feed upright and unhurried, bicycle those little legs, and track feeds against the fussy spells so you can spot the real trigger. And remember: a brand-new digestive system simply needs a little time. The grunty nights almost always fade on their own as your baby's gut matures.`,
  'day-with-mamabee-baby-tracker': `## Getting started in 60 seconds
There's no setup marathon. Download MamaBee, add your baby, and log your very next feed with one tap — that's it. You don't need to backfill anything or read a manual; the patterns and insights build themselves as you go. The best time to start tracking is the next feed, whenever that is.`,
  '3am-question-mamabee-ai-tracker': `## The bottom line
The 3 AM question never fully goes away in early parenthood — but with your own baby's story a tap away, it stops being scary. MamaBee gives you fast logging, gentle insight, privacy, and quiet confidence, so the middle-of-the-night worry turns into a calm glance and a "we're okay." That's worth more than any chart.`,
}

for (const [slug, mdText] of Object.entries(extra)) {
  const id = `drafts.mamabee-${slug}`
  const doc = await client.getDocument(id)
  if (!doc || !Array.isArray(doc.body)) { console.log(`- skip ${slug}`); continue }
  const faqIdx = doc.body.findIndex((b) => b._type === 'block' && b.style === 'h2' && (b.children || []).some((s) => (s.text || '').trim() === 'Frequently asked questions'))
  const at = faqIdx === -1 ? doc.body.length : faqIdx
  const newBody = [...doc.body.slice(0, at), ...md(mdText), ...doc.body.slice(at)]
  await client.patch(id).set({body: newBody}).commit()
  let w = 0; for (const b of newBody) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} ${w} ${slug}`)
}
