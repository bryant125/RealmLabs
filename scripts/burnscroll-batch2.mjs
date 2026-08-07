// BurnScroll batch 2 — 10 new articles as DRAFTS. Distinct from the first 10.
// Run once: node scripts/burnscroll-batch2.mjs
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

  A('teen-phone-addiction',
    'Teen Phone Addiction: A Parent Guide to Signs, Causes and What Actually Helps',
    'Worried about your teen and their phone? The real signs of teen phone addiction, why teenage brains are especially vulnerable, and practical, non-nuclear strategies that actually work.',
    ['teen phone addiction', 'teenager phone addiction', 'kids screen time', 'teen social media', 'parenting screen time'],
    {},
`You've said "get off your phone" so many times it's lost all meaning. Your teenager surfaces from their room, thumbs still twitching, and you're left wondering whether this is normal adolescence or something you should actually worry about. Here's a straight guide for parents: the real signs of teen phone addiction, why teenage brains are uniquely vulnerable, and strategies that work better than confiscation and shouting.
## Is it addiction, or just being a teenager?
First, some perspective: heavy phone use is close to universal among teens, and it's how a lot of their social life now happens. So the question isn't "does my teen use their phone a lot?" — they all do. It's "is the phone **costing** them things that matter?" That's the line between a normal teen and a genuine problem.
Warning signs worth taking seriously:
- **Sleep is suffering** — up half the night on the phone, exhausted in the morning
- **Grades or activities slipping** — dropping hobbies, sports or friendships they used to value
- **Extreme reactions to limits** — panic, rage or despair when the phone is taken away, beyond normal teen grumbling
- **Secrecy** — hiding screens, sneaking devices at night
- **Mood tied to the phone** — anxious or low without it, and often *after* using it
- **Failed attempts to cut down** — they say they want to use it less but can't
A couple of these during a stressful patch is normal. Several, persistently, is worth addressing.
## Why teen brains are especially vulnerable
This isn't just weak willpower, and understanding why helps you respond better. The teenage brain's reward system is highly active, while the prefrontal cortex — the part responsible for impulse control and long-term thinking — isn't fully developed until the mid-twenties. That's a gas pedal with soft brakes.
Social apps are engineered around exactly this: likes, streaks, notifications and infinite feeds deliver unpredictable rewards that hit the teenage reward system hard. Add adolescence's intense need for peer approval and fear of missing out, and you have a perfect storm. Your teen isn't failing to resist a neutral tool — they're up against professionally designed persuasion, with brakes that are still installing. For the mechanics, see [why we doomscroll](/burnscroll/articles/why-do-we-doomscroll).
## What actually helps (and what backfires)
**What backfires:** surprise confiscation, spyware they'll resent and route around, and shame. These damage trust and teach secrecy, not self-regulation — and self-regulation is the actual goal, since they'll have a phone for life.
**What works:**
- **Collaborate, don't dictate.** Involve your teen in setting limits. Rules they helped make, they're far more likely to keep. Explain the *why* — the brain science above lands with teens.
- **Protect sleep first.** The single highest-impact rule: phones charge outside the bedroom overnight. This one change improves sleep, mood and next-day focus. See [screen time and sleep](/burnscroll/articles/screen-time-and-sleep).
- **Create phone-free zones and times.** Meals, the first hour of the day, family time. Applies to everyone — including you.
- **Model it.** Teens have finely tuned hypocrisy detectors. If you're scrolling at dinner, no rule will hold. Your own habits are the loudest lesson.
- **Replace, don't just remove.** Boredom drives phone use. Support the sport, the band, the job, the friends — real-world sources of the connection and status they're seeking online.
- **Use tools as scaffolding, not surveillance.** Agreed-upon limits and app blocks help build the habit while their brakes finish developing. Framed as a shared tool, not a punishment.
[[CTA||BurnScroll turns screen time into something you earn by moving — a limit teens can actually get behind.]]
## Keep the relationship bigger than the phone
The biggest risk in a phone battle is that the phone becomes the whole relationship — every interaction a fight about screens. Don't let it. Stay curious about *what* they're doing online (a lot of it is genuinely social and creative), keep talking, and make home a place with enough going on that the phone isn't the only thing worth doing. A connected teen who trusts you will come to you when something online goes wrong — that matters more than any screen-time number.
## Make the rules apply to the whole house
The fastest way to lose a teen's cooperation is a rule that only binds them. If phones are away at dinner, yours is too. If the first hour is phone-free, it's phone-free for the adults as well. Family-wide rules do two things at once: they remove the "so unfair" argument, and they quietly fix everyone's habits, because most parents scroll more than they'd like to admit. Frame it as "this is how our family does phones," not "this is your punishment." A shared standard is easier to keep and teaches by example — which, with teens, is the only teaching that actually sticks.
## When to get outside help
Talk to your pediatrician or a mental-health professional if phone or social-media use comes with signs of depression or anxiety, withdrawal from all real-world life, self-harm content, or if it's genuinely unmanageable despite consistent effort. Sometimes heavy phone use is a symptom of something deeper that deserves real support.
## Frequently asked questions
### Is teen phone addiction a real diagnosis?
"Phone addiction" isn't a formal clinical diagnosis, but the behaviour patterns — loss of control, distress without the device, neglect of other areas — mirror genuine behavioural addictions. Whether or not it's "official," if it's harming your teen's life it's worth addressing.
### How much screen time is okay for a teenager?
There's no magic number for teens — the type of use and its impact matter more than hours. Focus on protecting sleep, school, activities and real relationships rather than hitting a specific time limit.
### Should I just take my teen's phone away?
Sudden confiscation usually backfires — it breeds resentment and secrecy without building self-control. Collaborative limits, protected sleep, phone-free zones and modelling good habits work far better long term.
### Why can't my teen just put the phone down?
Because the teenage reward system is highly active while impulse control is still developing, and social apps are engineered to exploit exactly that. It's not simple weakness — it's biology meeting persuasive design.
## The bottom line
Heavy phone use is normal for teens; the concern is when it costs sleep, school, activities or wellbeing. Teen brains are genuinely more vulnerable, so lead with understanding, not confiscation. Collaborate on limits, protect sleep above all, model the behaviour you want, replace the phone with real-world alternatives, and keep the relationship bigger than the battle. You're not trying to win a fight — you're helping install the brakes.
[[CTA||Help your teen earn screen time instead of losing it to a feed — get BurnScroll free.]]
*This article is general wellbeing information, not medical or psychological advice. If you're worried about your teen's mental health, speak to a professional.*`),

  A('social-media-and-mental-health',
    'Social Media and Mental Health: What the Research Actually Says',
    'Is social media bad for your mental health? An honest look at what the research shows, who is most at risk, why it affects mood, and how to use social media more safely.',
    ['social media mental health', 'social media anxiety', 'social media depression', 'is social media bad', 'social media wellbeing'],
    {},
`"Social media is destroying our mental health" is a headline you've read a hundred times. "Actually, the evidence is mixed" is the quieter, more accurate follow-up you've probably read less. The truth sits in between, and it matters — because how you use these platforms, and who you are, changes the answer a lot. Here's what the research actually shows, minus the moral panic and minus the tech-industry hand-waving.
## The honest scientific picture
Let's be precise, because both extremes are wrong.
**What's well established:** there's a real *association* between heavy social media use and higher rates of anxiety, depression and poor body image, especially among adolescents and especially among girls. The correlation is consistent enough that major health bodies have raised concerns.
**What's genuinely debated:** whether social media *causes* those problems, or whether people who are already struggling use it more, or both. Most large studies find the average effect is real but **modest** — social media is one factor among many, not a single switch that breaks mental health. The strongest harms cluster in specific people and specific uses, not evenly across everyone.
So the responsible summary: for many people the effect is small; for some — heavy users, teens, those prone to comparison — it's substantial. The goal isn't panic, it's knowing which camp you're in and using it accordingly.
## Why it affects mood
When social media does harm wellbeing, it tends to work through a few clear mechanisms:
- **Social comparison.** Feeds are highlight reels. Comparing your ordinary insides to everyone else's curated outsides reliably lowers mood and self-esteem. Image-heavy platforms hit body image hardest.
- **Passive scrolling.** Silently consuming others' lives (as opposed to actively connecting) is the use most linked to feeling worse. See [why we doomscroll](/burnscroll/articles/why-do-we-doomscroll).
- **Displacement.** Hours scrolling are hours not spent sleeping, exercising, or seeing people in person — all things that protect mental health. Sometimes the harm is what social media *replaces*.
- **FOMO and validation-seeking.** Tying your sense of worth to likes and comments is a fragile place to stand.
- **Sleep disruption.** Late-night scrolling wrecks sleep, and poor sleep is one of the biggest drivers of low mood. See [screen time and sleep](/burnscroll/articles/screen-time-and-sleep).
## Who is most at risk
The research points to some clear risk factors:
- **Adolescents**, whose identity and self-image are still forming
- **Teen girls especially**, for body image and comparison
- **Heavy users** — the more hours, the stronger the association
- **Passive users** who scroll far more than they interact
- **People already anxious or depressed**, for whom it can deepen a spiral
If several of these describe you or your child, the effect is more likely to be real and worth acting on.
## How to use social media more safely
You don't have to quit to protect your mental health. Adjust *how* you use it:
- **Curate ruthlessly.** Unfollow accounts that reliably make you feel worse; follow ones that inform or genuinely lift you. Your feed is editable — most people never edit it.
- **Shift from passive to active.** Message a friend, comment, create — connection helps where silent scrolling harms.
- **Cap the time, especially at night.** Protect sleep and your evenings. Adding friction helps here; see [how to stop doomscrolling](/burnscroll/articles/how-to-stop-doomscrolling).
- **Notice how you feel after.** If a platform or account consistently leaves you flat or anxious, that's data. Act on it.
- **Take regular breaks.** Even short breaks from social media are associated with improved wellbeing for many people.
[[CTA||Take back your evenings — BurnScroll locks the feeds that drain you until you've earned the time.]]
## The 30-day test
If you're not sure whether social media is affecting you, run an experiment instead of guessing. For 30 days, cut your use sharply — delete the apps from your phone, or lock them behind real friction, and use them only briefly from a browser if you must. Then notice what changes: your sleep, your mood, your focus, how often you compare yourself to others, how present you feel with people. Most people who try this report at least some improvement, and — more usefully — they learn exactly *which* platforms and habits were dragging on them. You don't have to quit forever; you just need enough distance to see the effect clearly. Then you can add back what genuinely adds to your life and leave the rest.
## What actually protects mental health
It helps to remember the flip side. The strongest protectors of mental health are consistent and unglamorous: good sleep, regular movement, real-world social connection, and time outdoors. Social media becomes a problem largely when it eats into these. Protect the basics, and social media's downside shrinks — because you're topping up the very things that keep you well. [Exercise in particular](/burnscroll/articles/exercise-vs-anxiety) is one of the best buffers against anxiety there is.
## Frequently asked questions
### Is social media bad for your mental health?
It can be, but the average effect is modest and depends heavily on who you are and how you use it. Heavy, passive use and adolescents are most at risk; light, active use is far less concerning. It's a risk factor, not a guaranteed cause of harm.
### Does quitting social media improve mental health?
Many people report feeling better after breaks or quitting, and studies of short breaks show wellbeing improvements for some. You don't necessarily have to quit entirely — reducing passive use and curating your feed helps too.
### Why does social media make me feel worse?
Usually through social comparison, passive scrolling, lost sleep, and time displaced from things that protect mood. Comparing your real life to others' highlight reels is a particularly reliable mood-lowerer.
### Is social media worse for teenagers?
The associations with anxiety, depression and body image are strongest for adolescents, especially teen girls. Developing brains and identities are more vulnerable to comparison and validation-seeking.
## The bottom line
Social media isn't universally toxic or harmless — it's a modest risk factor that becomes a real problem for heavy, passive users, teens, and people already struggling. It works mainly through comparison, passive scrolling, lost sleep and displaced real-world life. You don't have to quit; curate hard, shift from scrolling to connecting, protect your sleep, and guard the basics — sleep, movement, real relationships — that keep you well in the first place.
[[CTA||Protect your mental health from the mindless scroll — BurnScroll makes it earn-only. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. If you're struggling with anxiety or depression, please reach out to a professional.*`),

  A('nomophobia-fear-of-being-without-your-phone',
    'Nomophobia: The Fear of Being Without Your Phone (and How to Ease It)',
    'Nomophobia — the anxiety of being without your phone — explained: the signs, why it happens, how common it is, and practical steps to loosen the grip your phone has on your nervous system.',
    ['nomophobia', 'phone separation anxiety', 'fear of no phone', 'phone anxiety', 'no mobile phobia'],
    {},
`You leave the house, pat your pocket, and it's not there — and your stomach drops like you've forgotten a child. That jolt of panic has a name: **nomophobia**, short for "no-mobile-phone phobia," the anxiety of being without or unable to use your phone. It sounds faintly ridiculous until it's you, sweating because your battery hit 5%. Here's what it is, why your nervous system does this, and how to loosen the grip.
## What nomophobia actually is
Nomophobia is the discomfort, anxiety or genuine distress people feel when they can't use their phone — because it's lost, out of battery, out of signal, or simply not allowed. It's not (yet) a formal clinical diagnosis, but it's a widely studied and very real modern phenomenon, and for some people it rises to genuinely disruptive anxiety.
It exists because the phone stopped being a gadget and became an extension of us: our memory, our map, our wallet, our social lifeline, our boredom escape hatch, all in one rectangle. Take it away and it feels like losing a limb — because functionally, several of your "limbs" now live in it.
## The signs
You might recognize some of these:
- **Panic or anxiety** when the phone is missing, dying, or out of signal
- **Constant checking** — reaching for it dozens or hundreds of times a day, often unconsciously
- **Never turning it off**, and taking it literally everywhere, including the bathroom
- **Battery anxiety** — stress as the percentage drops, hunting for chargers
- **Phantom vibrations** — feeling a buzz that didn't happen
- **Dread at the idea** of a day, or even an hour, without it
The occasional flicker of this is normal now. Frequent, intense distress is the version worth working on.
## Why your nervous system does this
Two forces combine. First, the phone is a genuine tool we depend on — losing access really does cut you off from navigation, contacts and payment, so *some* concern is rational. Second, and more powerfully, the phone is our primary tool for **avoiding discomfort** — boredom, awkwardness, loneliness, anxiety. Every time you feel a twinge of those and reach for the phone, you get instant relief, and your brain learns the lesson deeper: *discomfort → phone → relief.*
Take the phone away and you lose your main coping mechanism, so the underlying discomfort surges *plus* you feel the anxiety of not having your regulator. It's a loop the [dopamine system](/burnscroll/articles/dopamine-detox) reinforces every single day.
## How to ease the grip
The goal isn't to hate your phone — it's to prove to your nervous system that you're fine without it. That happens through gradual, deliberate exposure.
- **Start with tiny separations.** Leave the phone in another room for 10 minutes while you do something else. Then 30. Then an hour. Each time you survive it, the alarm quiets.
- **Build phone-free zones.** Meals, the bedroom, the first hour of the day. Predictable stretches without it become normal, then comfortable. See [digital wellbeing habits](/burnscroll/articles/digital-wellbeing-habits).
- **Sit with the discomfort.** When you feel the urge to check, pause and just notice the feeling instead of scratching it. It peaks and passes in a minute or two. Every time you let it pass, the loop weakens.
- **Turn off non-human notifications.** Fewer pings mean fewer alarm triggers pulling you back.
- **Address what you're avoiding.** If the phone is how you dodge boredom or anxiety, build other outlets — a walk, a call, movement. [Exercise is a genuine anxiety regulator](/burnscroll/articles/exercise-vs-anxiety).
- **Add friction so checking isn't frictionless.** When the phone is harder to grab on autopilot, the compulsive reach fades.
[[CTA||Loosen the phone's grip — BurnScroll makes mindless checking earn-only, so separation gets easier.]]
## The battery-anxiety tell
Here's a quick way to gauge your own dependence: how do you feel when your battery drops to 10%? If the honest answer is "a jolt of genuine stress," that reaction is worth noticing. It's not really about the battery — it's about losing access to your regulator, your lifeline, your escape hatch, all at once. The fix isn't a bigger power bank; it's proving to yourself that a dead phone for an hour is an inconvenience, not an emergency. Next time the battery runs low, try letting it, and notice that the world keeps turning. Each time you survive being unreachable, the alarm gets quieter — the same exposure principle that eases the broader anxiety, in miniature.
## When it's more than a habit
If phone-separation anxiety is severe — full panic attacks, inability to function without the device, or it's tangled up with broader anxiety — it's worth talking to a mental-health professional. Nomophobia can overlap with generalized anxiety, and the underlying anxiety responds well to proper treatment. There's no shame in it; the environment is genuinely engineered to create this.
## Frequently asked questions
### Is nomophobia a real condition?
It's a widely recognized and studied modern phenomenon, though not (yet) a formal clinical diagnosis. For most people it's mild discomfort; for some it rises to genuine, disruptive anxiety worth addressing.
### How common is nomophobia?
Studies suggest some level of phone-separation anxiety is extremely common among smartphone users, particularly younger people. Mild forms are close to normal now; severe forms are less common but real.
### How do I get over the fear of being without my phone?
Gradual exposure works best: start with short, deliberate separations and build up, create phone-free zones, and practice sitting with the urge to check instead of acting on it. Reducing notifications and adding friction help too.
### Are phantom phone vibrations a sign of nomophobia?
Feeling vibrations that didn't happen is a common sign of a hypervigilant, phone-focused nervous system. It's very common and eases as your overall phone dependence lessens.
## The bottom line
Nomophobia — anxiety at being without your phone — is a real, common product of the phone becoming your memory, lifeline and comfort blanket in one. Ease it by proving to yourself you're okay without it: short deliberate separations that build up, phone-free zones, sitting with the urge instead of scratching it, and building other ways to handle the discomfort the phone usually numbs. And if it's severe, get support — the anxiety underneath responds to treatment.
[[CTA||Prove you don't need it every minute — BurnScroll makes the phone something you reach for on purpose. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. If phone-related anxiety is severe, please speak to a professional.*`),

  A('digital-eye-strain-from-screens',
    'Digital Eye Strain: Why Screens Tire Your Eyes and How to Fix It',
    'Digital eye strain explained: why screens cause tired, dry, aching eyes and headaches, whether blue light is really the culprit, and simple fixes that genuinely work — like the 20-20-20 rule.',
    ['digital eye strain', 'computer eye strain', 'screen eye strain', 'blue light eyes', 'sore eyes from screens'],
    {},
`Eyes aching after a long day of screens? Dry, gritty, maybe a headache creeping in behind them? That's digital eye strain — one of the most common physical side-effects of modern life, and one of the most fixable. Here's what actually causes it (spoiler: it's mostly *not* blue light), and the simple changes that genuinely help.
## What digital eye strain is
Digital eye strain (also called computer vision syndrome) is the cluster of eye and vision discomfort that comes from prolonged screen use. Common symptoms:
- Tired, sore or aching eyes
- Dryness or irritation, or paradoxically watery eyes
- Blurred vision, especially shifting focus from screen to distance
- Headaches, often centered around the eyes or forehead
- Neck and shoulder tension (screens tend to come as a posture package deal)
It's uncomfortable and annoying, but the reassuring headline: digital eye strain does **not** cause permanent eye damage. It's a fatigue-and-dryness problem, not an injury.
## Why screens tire your eyes (and why it's not mainly blue light)
Here's the myth-buster. The wellness industry sells blue-light glasses hard, but the leading research and major eye-health bodies have found **little evidence that blue light from screens is a significant cause of eye strain.** So what actually does it?
- **You stop blinking.** This is the big one. Staring at a screen cuts your blink rate dramatically — often by half or more — so your eyes dry out. Most "eye strain" is really dry eyes.
- **Constant close focus.** Your eye muscles hold a fixed near-focus for hours without a break, and they fatigue like any muscle held in one position.
- **Glare and poor lighting.** Reflections and harsh lighting make your eyes work harder.
- **Screen too close, too bright, or too small.** Your eyes strain to compensate.
- **Uncorrected vision.** An out-of-date glasses prescription forces extra effort.
Notice blue light isn't on that list as a main driver. If blue-light glasses help you, it may be more about the break-reminder ritual than the tint.
## The fixes that actually work
Target the real causes and the strain eases fast.
### The 20-20-20 rule
The single most recommended fix: **every 20 minutes, look at something 20 feet away for 20 seconds.** It relaxes the focusing muscles and, crucially, prompts you to blink. Set a reminder until it's habit.
### Blink on purpose
Since screens suppress blinking, consciously blink fully and often. Lubricating eye drops ("artificial tears") help if your eyes are dry.
### Fix your setup
- Screen about an **arm's length away**, with the top of the screen at or just below eye level
- **Reduce glare** — reposition to avoid reflections, and don't work in the dark with a blazing screen
- **Match brightness** to your surroundings; not brighter than the room
- Bump up **text size** so you're not leaning in and squinting
### Take real breaks
Step away from screens entirely at intervals. Your eyes — and your [posture](/burnscroll/articles/text-neck-phone-posture-fix), and your focus — all benefit. Reducing total screen time is the root-cause fix; see [how much screen time is too much](/burnscroll/articles/how-much-screen-time-is-too-much).
### See an eye doctor
If strain is persistent, get your eyes checked. An outdated prescription is a common hidden cause, and an optometrist can rule out other issues.
[[CTA||Fewer hours staring, happier eyes — BurnScroll caps the mindless scrolling that keeps you glued to the screen.]]
## Don't forget dry-eye basics
Because most digital eye strain is really *dry eye* in disguise, a few small habits aimed squarely at moisture make a bigger difference than any gadget:
- **Blink fully and often** — screens cut your blink rate roughly in half, and half-blinks don't spread tears properly. Consciously close your eyes all the way now and then.
- **Use artificial tears** — cheap lubricating drops genuinely help if your eyes feel gritty; keep a bottle at your desk.
- **Mind the air** — air conditioning, heating and fans dry your eyes further. A humidifier or just angling vents away from your face helps.
- **Stay hydrated** — mild whole-body dehydration shows up in your eyes too.
- **Follow the 20-20-20 rule** — it doubles as a blink prompt, which is half its value.
None of this is high-tech, and that's the point: the fixes match the real cause, which is dryness and fatigue, not blue light.
## What about blue light and sleep?
One caveat: while blue light isn't a major cause of *eye strain*, screen light in the evening can still affect *sleep* by nudging your body clock — a separate issue. So night mode has a place for sleep reasons, just not as an eye-strain cure. See [screen time and sleep](/burnscroll/articles/screen-time-and-sleep).
## Frequently asked questions
### Does blue light cause eye strain?
The evidence says no, not significantly. Major eye-health organizations have found little proof that screen blue light causes eye strain. The real culprits are reduced blinking, sustained close focus, glare and poor setup.
### Do blue light glasses actually work?
For eye strain, the evidence is weak — studies generally don't find they reduce it. If they help you, it may be indirect. They may have more relevance for evening sleep, though limiting evening screen time does that job too.
### What is the 20-20-20 rule?
Every 20 minutes, look at something 20 feet away for 20 seconds. It rests your focusing muscles and prompts blinking, and it's the most widely recommended fix for digital eye strain.
### Can screens permanently damage my eyes?
Digital eye strain is temporary fatigue and dryness, not permanent damage. It's uncomfortable but not harmful long-term. Persistent symptoms still deserve an eye exam to rule out other causes.
## The bottom line
Digital eye strain is real, common, and reversible — and it's caused mostly by not blinking, sustained close focus, glare and poor setup, *not* by blue light. Fix it with the 20-20-20 rule, deliberate blinking, a better screen setup, real breaks, and less total screen time. Skip the blue-light-glasses hype for eye strain (though evening screen limits still help your sleep), and see an optometrist if it persists. Above all, remember the simplest truth here: your eyes were built to look at varied distances and to blink freely, and hours locked onto a close, bright rectangle denies them both. Give them distance, give them breaks, and give them fewer total hours, and most of the strain simply lifts.
[[CTA||Give your eyes a break for real — BurnScroll makes endless scrolling earn-only. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. See an eye-care professional for persistent eye symptoms.*`),

  A('phubbing-phones-and-relationships',
    'Phubbing: How Phones Quietly Damage Your Relationships (and How to Stop)',
    'Phubbing — snubbing people for your phone — is quietly eroding relationships. What the research says about its effect on partners and kids, why we do it, and how to put the phone down.',
    ['phubbing', 'phone and relationships', 'phone addiction relationships', 'phones ruining relationships', 'partner phone'],
    {},
`You're mid-sentence and their eyes flick down to the phone. Something small deflates. There's a word for that now: **phubbing** — phone-snubbing, ignoring the person in front of you for your device. It feels minor in the moment. Across a relationship, the research suggests it adds up to something much bigger. Here's what phubbing does to the people you love, why we all do it, and how to stop.
## What phubbing is
Phubbing is the habit of glancing at, checking, or using your phone while you're supposed to be present with someone — a partner, a child, a friend, a colleague. It's so normalized we barely notice it: the phone on the dinner table, the "mhm" while you're actually reading a text, the reflexive check during a conversation lull.
The problem is that the message it sends, over and over, is: *whatever's on this screen matters more than you right now.* Even when that's not what you mean, that's what lands.
## What the research says it does
This isn't just etiquette — studies of phubbing find real relational cost:
- **Lower relationship satisfaction.** "Partner phubbing" — being phubbed by your significant other — is consistently linked to lower relationship satisfaction and more conflict.
- **Feeling ignored and less close.** Being phubbed makes people feel excluded and less connected, even in short interactions. The mere *presence* of a phone on the table has been shown to reduce the perceived quality and closeness of a conversation.
- **Lower wellbeing.** Partner phubbing has been associated with lower life satisfaction and, in some studies, more depressive feelings in the phubbed partner.
- **Effects on kids.** "Parental phubbing" is a growing area of concern, linked to children feeling less attended-to and to more behavioural and attention issues. Kids notice, and they learn the habit from watching you.
The through-line: connection requires attention, and a phone is an attention thief. You can't fully be with someone while part of you is with the screen.
## Why we all do it
Go easy on yourself — phubbing is the default the technology creates. Notifications are engineered to pull your attention *now*, the phone is a habit loop your brain runs automatically, and there's the fear of missing something. Add [nomophobia](/burnscroll/articles/nomophobia-fear-of-being-without-your-phone) and the reflexive reach during any quiet moment, and phubbing isn't a character flaw — it's a designed behaviour running on autopilot. Which is good news: autopilot behaviours can be reprogrammed.
## How to stop phubbing
- **Make specific times phone-free.** Meals, the first and last part of the day, one-on-one conversations. Phone away — not face-down on the table, *away*, because even visible it costs closeness.
- **Use a "phone stack."** Out with people? Everyone's phones go in a pile, face down. First to reach for theirs loses (or buys coffee). Turns presence into a game.
- **Kill the notifications.** Most phubbing starts with a ping. Silence non-human notifications and the reflexive glance mostly disappears. See [digital wellbeing habits](/burnscroll/articles/digital-wellbeing-habits).
- **Name it kindly.** Agree with your partner on a gentle cue for "you're phubbing me." No shame, just a nudge — and let them use it on you too.
- **Model it for your kids.** They're watching. Phone-free family time teaches attention better than any lecture about their screen use.
- **Add friction.** If the reflexive reach is the problem, make the phone harder to grab mindlessly.
[[CTA||Be present with the people who matter — BurnScroll makes the reflexive phone-grab something you have to earn.]]
## Notice your own phubbing first
Before policing anyone else's phone habits, spend a day catching your own. Most phubbing is invisible to the person doing it — you genuinely don't register the dozens of micro-glances, the "mhm" while half-reading a text, the phone that migrates into your hand the moment a conversation lulls. For one day, just notice each time you reach for the phone while someone's with you. You'll likely be surprised, and that surprise is useful: you can't change a habit you can't see. Awareness alone tends to cut phubbing noticeably, because so much of it runs on pure autopilot — and once you catch the reach, you get to choose differently.
## The upside is immediate
Here's the encouraging part: unlike a lot of wellbeing changes, the payoff from putting the phone down is instant. The next conversation is better. Your partner feels it that evening. Your kid gets the version of you that's actually *there*. You don't have to wait weeks for results — full attention is felt in real time, by everyone in the room, starting with the very next interaction.
## Frequently asked questions
### What does phubbing mean?
Phubbing is "phone snubbing" — ignoring the person you're with to look at or use your phone. It ranges from a quick glance mid-conversation to having the phone out through an entire meal.
### Is phubbing really bad for relationships?
Research links partner phubbing to lower relationship satisfaction, more conflict, feeling ignored, and lower wellbeing in the phubbed partner. Even a visible phone on the table reduces conversation closeness. It's a small habit with a real cumulative cost.
### How does parental phubbing affect children?
Parental phubbing is linked to children feeling less attended-to and to more attention and behaviour difficulties. Kids also learn the habit by watching, so modelling phone-free attention matters.
### How do I stop phubbing my partner?
Create phone-free times and zones, silence notifications, put the phone fully away (not just face-down), agree on a gentle cue for calling it out, and add friction so mindless checking is harder.
## The bottom line
Phubbing feels trivial but quietly erodes relationships — lower satisfaction, less closeness, and real effects on partners and kids — because connection needs the one thing a phone steals: attention. It's a designed, automatic habit, not a character flaw, which means you can change it. Make key moments phone-free, kill notifications, put the device fully away, and model it for your kids. The reward lands immediately, in the very next conversation. And keep the standard simple enough to actually hold: when you're with someone who matters, the phone goes away — not face-down, away. That one rule, kept consistently, quietly repairs more connection than any grand gesture, because the people you love mostly just want the version of you that's fully there.
[[CTA||Give people your full attention again — BurnScroll keeps the feeds locked until you've earned them. Free on iPhone.]]
*This article is general wellbeing information, not medical or relationship advice.*`),

  A('short-form-video-and-your-brain',
    'Short-Form Video and Your Brain: What TikTok and Reels Do to Your Attention',
    'What short-form video does to your attention span and dopamine, why TikTok and Reels are so hard to stop, whether "TikTok brain" is real, and how to undo the effect.',
    ['short form video attention', 'tiktok brain', 'tiktok attention span', 'reels addiction', 'short video dopamine'],
    {},
`You opened TikTok (or Reels, or Shorts) for "a couple of minutes" and resurfaced forty minutes later, unable to name a single thing you watched. Short-form video is the most engineered attention product ever built, and a lot of people quietly suspect it's doing something to their brains. Here's what the science actually supports, what's still hype, and how to undo the effect.
## Why short-form video is uniquely sticky
Short-form video isn't just "video, but shorter." It's a fundamentally more powerful engagement machine than anything before it, for a few reasons:
- **Maximum reward, minimum effort.** Each clip is a complete hit of novelty, humour or emotion in seconds. Your brain gets a payoff constantly, with no waiting.
- **The most refined algorithm ever built.** These feeds learn what holds *you* specifically, faster and more precisely than older platforms, and reweight instantly toward your weaknesses. See [why we doomscroll](/burnscroll/articles/why-do-we-doomscroll).
- **Infinite, effortless, autoplay.** No clicking, no choosing, no stopping point. The next hit arrives before you decide to want it.
- **Variable rewards.** Most clips are mediocre; occasionally one is amazing. That unpredictability is the exact mechanism that makes slot machines compulsive.
Together these make short-form video the purest [dopamine](/burnscroll/articles/dopamine-detox) delivery system in your pocket — which is precisely why "just a couple of minutes" never is.
## Is "TikTok brain" real?
Let's be careful, because this is where hype outruns evidence. The dramatic claim — that short-form video is permanently rewiring or damaging your brain — is **not proven.** The human brain is highly adaptable, and there isn't solid evidence of permanent damage from watching short videos.
What *is* better supported and worth taking seriously:
- **A trained preference for constant novelty.** When your brain gets used to a new hit every few seconds, slower, more demanding tasks — reading, deep work, a long conversation — start to feel unbearably dull by comparison. That's real, and most heavy users feel it.
- **Harder sustained attention in the moment.** Constantly switching between rapid clips is the opposite of practicing sustained focus, and attention is trainable in both directions.
- **Time displacement.** Hours on short-form video are hours not spent on sleep, movement or focused work — an indirect but real cost.
So the honest framing: not "your brain is broken," but "your brain is being *trained* toward craving novelty and away from sustained focus." Training can be reversed. See [how to improve focus](/burnscroll/articles/how-to-improve-focus).
## The signs it's affecting you
- You reach for short-form video in every idle second, automatically
- Longer content — a film, a book, an article — feels harder to sit through than it used to
- You lose large chunks of time with no memory of what you watched
- You feel restless or bored faster when *not* being constantly stimulated
- You struggle to focus on one task without the urge to switch to something faster
## How to undo the effect
The good news: because it's training, not damage, you can retrain.
- **Starve the novelty appetite.** Sharply reduce short-form video for a few weeks. The craving for constant stimulation shrinks when you stop feeding it. This is the core move.
- **Practice sustained attention.** Deliberately do slow, single-focus things — read a chapter, watch a full film, sit with a task for 25 minutes. You're rebuilding a muscle. See [how to improve focus](/burnscroll/articles/how-to-improve-focus).
- **Add real friction.** Log out, delete the app, or lock it behind a barrier so opening it isn't a frictionless reflex. See [how to stop doomscrolling](/burnscroll/articles/how-to-stop-doomscrolling).
- **Get comfortable with boredom again.** Don't fill every gap with a screen. Boredom is where attention and ideas regenerate.
- **Protect sleep.** Short-form video is especially good at stealing bedtime; keep it out of the bedroom.
[[CTA||Retrain your attention — BurnScroll locks the short-video apps until you earn the time by moving.]]
## Why it feels worse than other scrolling
Plenty of people who happily scrolled Instagram or Twitter for years find short-form video hits differently — heavier, harder to climb out of, and oddly hollow afterward. There's a reason. Text and static images still require a little effort: you read, you decide, you move on. Short-form video removes even that. It's fully passive, fully autoplaying, and each clip is engineered as a complete emotional hit, so your brain never has to do anything but receive. That's why forty minutes can vanish with no memory of it — you weren't really *choosing* anything, just being fed. The hollow feeling afterward is the tell: high stimulation, near-zero substance. Recognizing that emptiness is oddly motivating, because it reframes the feed from "a treat I'm giving myself" to "a thing that takes my time and gives back almost nothing."
## Frequently asked questions
### Is TikTok brain a real thing?
The dramatic version — permanent brain damage or rewiring — isn't proven. What's real is that heavy short-form use trains your brain to crave constant novelty and makes sustained focus harder. That's a trained state, and it can be reversed.
### Does short-form video shorten your attention span?
It trains a preference for rapid novelty and away from sustained focus, which makes slower tasks feel harder. Attention is trainable both ways, so reducing short-form use and practicing focus rebuilds it.
### Why is TikTok so much harder to stop than other apps?
It combines maximum reward for minimum effort, the most refined personalization algorithm yet, infinite autoplay with no stopping point, and unpredictable variable rewards — the most engaging combination built so far.
### How do I fix my attention span after too much short-form video?
Sharply cut short-form video for a few weeks, deliberately practice sustained-focus activities, add friction to the apps, get comfortable with boredom, and protect your sleep. It rebuilds with practice.
## The bottom line
Short-form video is the most refined attention product ever made, and while "TikTok brain" as permanent damage is overblown, it genuinely trains you to crave constant novelty and struggle with sustained focus. Because it's training, not damage, you can undo it: starve the novelty appetite for a few weeks, practice slow focus, add friction to the apps, and make peace with boredom. Your attention comes back with practice.
[[CTA||Take your attention back from the endless feed — BurnScroll makes it earn-only. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),

  A('phone-free-morning',
    'The Phone-Free Morning: Why the First Hour Without Your Phone Changes Your Day',
    'Reaching for your phone the second you wake up quietly wrecks your day. Here is what a phone-free morning does for focus, mood and stress — and exactly how to build one that sticks.',
    ['phone free morning', 'morning routine phone', 'stop checking phone morning', 'morning phone habit', 'phone first thing'],
    {},
`Your alarm goes off, your hand finds your phone before your eyes are fully open, and within seconds you're absorbing emails, news and other people's lives — before you've had a single thought of your own. How you start your morning sets the tone for the whole day, and starting it inside your phone sets a tone of reactive, scattered stress. Here's what a phone-free morning does, and how to actually build one.
## Why the first hour matters so much
The morning is a uniquely vulnerable window. Just after waking, your brain is transitioning out of sleep and is especially impressionable. Flood it immediately with notifications, headlines and demands and you achieve three bad things at once:
- **You start the day reactive.** Before you've set a single intention, you're responding to everyone else's — emails, requests, news. You've handed the steering wheel away in the first minute.
- **You spike stress early.** Bad news, work messages and the comparison engine of social media trigger stress hormones before you're even out of bed.
- **You prime the scroll.** That first hit tells your brain today is a day for constant checking, and you chase that dopamine all day. See [dopamine detox](/burnscroll/articles/dopamine-detox).
Protect that first stretch and everything downstream — focus, mood, how much you scroll later — improves.
## What a phone-free morning gives you
Parents of the habit consistently report the same benefits, and they're backed by how attention and stress work:
- **Calmer, less anxious start.** No cortisol spike from the inbox before breakfast.
- **Better focus all day.** You begin in a deep, undistracted state instead of the shallow, switch-happy one the phone creates. See [how to improve focus](/burnscroll/articles/how-to-improve-focus).
- **Your priorities first.** You decide what the day is about before the world tells you.
- **More presence.** You're actually there for your coffee, your family, yourself — instead of half-gone into a screen.
- **Less scrolling overall.** Skip the first hit and the all-day craving is quieter.
## How to build a phone-free morning that sticks
Intentions fail; structure works. Make it nearly automatic:
### Move the phone out of the bedroom
The foundation. If the phone charges in another room, you can't grab it before you're up — and you're not scrolling in bed at night either. Buy a **$10 alarm clock** so "I need it for the alarm" stops being the excuse. This single change does most of the work.
### Decide your first action in advance
Replace "check phone" with a specific first thing: water, stretch, make coffee, step outside, read a page. A concrete replacement beats a vague "don't check the phone." Morning daylight especially helps set your body clock for better sleep that night, too.
### Set a target you can win
Start achievable. Even **20 phone-free minutes** after waking is a real win — extend to 30, then 60 as it gets comfortable. Don't demand a two-hour digital sunrise on day one.
### Delay the inbox and feeds specifically
The apps that hijack mornings are email and social. Keep those closed until you've properly started your day — even if you glance at the time or a message. Adding friction to the worst offenders helps the habit hold.
[[CTA||Win the first hour — BurnScroll keeps the feeds locked until you've earned them, so mornings start clear.]]
## Handling the resistance
The first few mornings feel genuinely odd — a low-grade itch, a sense you're missing something urgent. You almost never are; the emails and posts are still there in an hour, and now you meet them from a steadier place. That itch is just the habit protesting, and it fades within days. Push through the first week and a phone-free morning stops being effort and becomes the version of the morning you actually prefer.
## A simple first-hour template
If a blank "phone-free hour" feels daunting, give it a shape. A template that works for many people: **light, water, movement, intention.** Get some daylight (open the curtains, step outside), drink a glass of water, move your body a little (a stretch, a short walk, anything), and take a moment to decide the one thing that matters most today — before the world hands you its agenda. It doesn't need to be elaborate or Instagrammable; the point isn't a perfect "morning routine," it's simply meeting the day as yourself before you meet it as a responder to notifications. Even a rough version of this beats waking straight into the feed.
## Pair it with a phone-free evening
Mornings and nights are the same loop from two ends. A phone-free morning is far easier when you also keep the phone out of the bedroom at night — better sleep makes you less impulsive, which makes resisting the morning grab easier, which... you get it. See [screen time and sleep](/burnscroll/articles/screen-time-and-sleep). Protect both ends and the whole day improves.
## Frequently asked questions
### Why shouldn't I check my phone first thing in the morning?
Just after waking your brain is impressionable, and flooding it with notifications and news starts your day reactive and stressed, before you've set your own intentions. It also primes all-day scrolling. A phone-free start protects focus and mood.
### How long should a phone-free morning be?
Start with what you can win — even 20 minutes after waking helps — and build toward 30 or 60. Consistency matters more than length; a reliable short window beats an ambitious one you abandon.
### What should I do instead of checking my phone?
Decide in advance: water, stretching, coffee, stepping outside for daylight, reading. A specific replacement beats a vague intention not to check. Morning light also helps your sleep that night.
### How do I stop grabbing my phone when I wake up?
Charge it outside the bedroom and use a cheap alarm clock, so it isn't within reach. Removing the option is far more reliable than relying on willpower first thing.
## The bottom line
How you start your morning sets the tone for your day, and starting inside your phone sets a reactive, stressed, scroll-primed tone. A phone-free first hour gives you a calmer start, better all-day focus, your own priorities first, and less scrolling overall. Build it with structure — phone out of the bedroom, a decided first action, a winnable target — not willpower. Push through the first week's itch and it becomes the morning you'd never trade back.
[[CTA||Start tomorrow clear-headed — BurnScroll locks the morning scroll until you've earned it. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),

  A('text-neck-phone-posture-fix',
    'Text Neck: How Phones Wreck Your Posture and How to Undo It',
    'Text neck explained: how looking down at your phone strains your neck and back, the surprising load it puts on your spine, the signs, and simple fixes and stretches that help.',
    ['text neck', 'phone posture', 'neck pain from phone', 'tech neck', 'phone neck strain'],
    {},
`That ache at the base of your neck after an evening of scrolling isn't your imagination. Look down at your phone for hours a day, for years, and your body sends the bill: "text neck." It's one of the most common modern aches, and the good news is it's largely preventable and fixable once you understand what's happening. Here's the what, the why, and the fix.
## What text neck is
Text neck is the neck and upper-back pain, stiffness and strain caused by looking down at a phone (or tablet, or laptop) for long periods with your head bent forward. It's a repetitive-strain problem: the position itself isn't dangerous for a moment, but held for hours, day after day, it overloads the muscles, joints and ligaments of your neck and upper spine.
## The surprising physics
Here's what makes it worse than it feels. Your head is heavy — around 10–12 pounds in a neutral, upright position. But the further you tilt it forward, the more effective load your neck has to support, because of leverage. At a steep downward phone-looking angle, the strain on your neck can rise to the equivalent of **around 50 or 60 pounds** — like carrying a small child on your neck, for hours a day.
Your neck muscles weren't built to hold that kind of sustained load, so they fatigue, tighten and ache. Over time the strain extends to the joints and discs of the cervical spine.
## The signs
- Aching or stiffness in the neck, especially after phone or screen sessions
- Pain across the shoulders and upper back
- Tightness at the base of the skull; tension headaches
- Reduced neck mobility — harder to turn or tilt your head comfortably
- In more advanced cases, tingling or numbness into the arms or hands (see a doctor for this)
- A gradually more forward-jutting head posture, even when you're not on the phone
## How to fix and prevent it
The core principle is simple: **bring the phone up to your eyes, not your eyes down to the phone** — and don't hold any one position for too long.
### Raise the phone
Hold your phone closer to eye level instead of down in your lap. Yes, you might feel briefly silly with your phone up at face height; your neck will thank you. Even reducing the downward angle helps a lot.
### Take movement breaks
Posture problems come from *sustained* positions. Every 20–30 minutes, look up, roll your shoulders, move your neck through its range. This ties in neatly with the [20-20-20 rule for your eyes](/burnscroll/articles/digital-eye-strain-from-screens) — one break fixes both.
### Strengthen and stretch
- **Chin tucks:** gently draw your chin straight back (making a "double chin"), hold a few seconds, repeat. This counteracts forward-head posture and strengthens the deep neck muscles.
- **Chest and neck stretches:** open the chest and gently stretch the sides and back of the neck to release what phone posture tightens.
- **Upper-back strengthening:** rows and shoulder-blade squeezes support an upright posture.
### Fix your whole setup
It's not just phones — laptops and desks matter. Get screens up toward eye level, sit back in the chair, and stop hunching. Your phone habit and your desk habit compound each other.
### Reduce total screen time
Fewer hours hunched over a device means less cumulative strain. The root-cause fix is simply looking down at a phone less; see [how much screen time is too much](/burnscroll/articles/how-much-screen-time-is-too-much).
[[CTA||Less time hunched over the feed — BurnScroll makes mindless scrolling earn-only, so your neck gets a break.]]
## It's the duration, not the moment
One reassuring reframe: a single glance down at your phone isn't hurting you. Text neck is a *dose* problem — it's the hours, repeated daily for years, that overload the tissues. That changes how you should think about the fix. You don't need perfect posture every second (impossible anyway); you need to break up the sustained load. A few minutes bent over a phone, then a look-up and a shoulder roll, then a few more minutes, does far less damage than an unbroken hour in the same hunched position. So the highest-value habit isn't holding a rigid ideal posture — it's *moving often* and not letting any one position set in. Frequent small resets beat occasional big corrections every time.
## When to see a professional
Most text neck eases with posture changes, movement and stretching. But see a doctor or physical therapist if you have persistent or severe pain, pain that doesn't improve with these changes, or — importantly — any numbness, tingling or weakness in your arms or hands, which can signal nerve involvement and deserves proper assessment.
## Frequently asked questions
### What is text neck?
Text neck is neck and upper-back pain and stiffness caused by looking down at a phone or device for long periods. It's a repetitive-strain issue from holding your head bent forward for hours, day after day.
### How much weight does looking at your phone put on your neck?
Your head weighs about 10–12 pounds upright, but tilting it forward multiplies the effective load through leverage — at a steep phone-looking angle the strain on the neck can reach roughly 50–60 pounds. That's why sustained looking-down aches.
### Can text neck be reversed?
Yes, in most cases. Raising the phone toward eye level, taking movement breaks, stretching and strengthening the neck and upper back, and reducing screen time all help. Persistent pain or any arm numbness needs professional assessment.
### What stretches help text neck?
Chin tucks (drawing the chin straight back), gentle neck and chest stretches, and upper-back strengthening like shoulder-blade squeezes. Combine them with regular movement breaks rather than doing them once.
## The bottom line
Text neck is the very real, very common price of hours spent looking down at a phone — leverage turns your head into a 50-pound load your neck was never meant to hold that long. Fix it by bringing the phone up to eye level, taking frequent movement breaks, stretching and strengthening, sorting out your whole screen setup, and simply spending less time hunched over a device. Get help for persistent pain or any arm numbness.
[[CTA||Give your neck a break — BurnScroll locks the endless scroll until you've earned it. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. See a professional for persistent pain or any numbness or tingling.*`),

  A('how-to-set-screen-time-limits-on-iphone',
    'How to Set Screen Time Limits on iPhone (and Actually Stick to Them)',
    'A step-by-step guide to setting screen time limits on iPhone with Apple Screen Time — app limits, downtime, content limits for kids — plus why the built-in limits are easy to ignore.',
    ['screen time iphone', 'set screen time limits iphone', 'iphone app limits', 'apple screen time', 'limit screen time iphone'],
    {},
`Your iPhone already has a whole toolkit for reining in your screen time built right in — most people just never set it up, or set it up and tap "Ignore Limit" within a week. Here's a straight, step-by-step guide to Apple's Screen Time features, how to set them for yourself and your kids, and the honest reason the built-in limits often aren't enough on their own.
## First, see your actual numbers
Before setting limits, look at the truth. Go to **Settings → Screen Time**. You'll see your daily average, your most-used apps, and how many times you pick up your phone. Most people are genuinely shocked — the estimate in your head is usually about half the reality. You can't manage what you won't look at, so start here for one honest day.
## Setting app limits
This is the core feature for cutting back on specific time-sinks:
- Go to **Settings → Screen Time → App Limits → Add Limit**
- Choose a category (like Social or Entertainment) or tap into a category to pick **individual apps**
- Set the daily time you'll allow — say 30 minutes for social media
- Tap **Add**
When you hit the limit, the app greys out and shows a time's-up screen. Limits reset at midnight, and you can set different limits for different days.
## Setting Downtime
Downtime schedules a window where only apps you choose (and calls) are available — perfect for evenings and mornings:
- **Settings → Screen Time → Downtime → turn on**
- Set a schedule (e.g. 10 PM to 7 AM), every day or custom days
- Under **Always Allowed**, choose the few apps that stay available during downtime
This is the single best setting for protecting sleep and mornings — it makes the [phone-free morning](/burnscroll/articles/phone-free-morning) and better [sleep](/burnscroll/articles/screen-time-and-sleep) close to automatic.
## Limits for kids
If you're managing a child's device, Screen Time is more powerful when set up through **Family Sharing**, because *you* control it from your phone and set a passcode they don't know:
- Set it up via **Family Sharing**, or on their device under Screen Time with a parent passcode
- Use **Content & Privacy Restrictions** to filter mature content, limit purchases, and restrict web content
- Set **App Limits** and **Downtime** for their device
- Use **Communication Limits** to control who they can contact
The passcode is the key difference: without it, limits are just suggestions. For the bigger picture on kids and phones, see [teen phone addiction](/burnscroll/articles/teen-phone-addiction).
## The honest problem with built-in limits
Here's the part Apple won't tell you: for adults, **the built-in limits are trivially easy to ignore.** When you hit an app limit, there's an "Ignore Limit" button right there — one more minute, or ignore for the day. In the exact moment you're most tempted, willpower is at its lowest, and one tap makes the limit vanish. Screen Time is great at *showing* you the problem and okay at *nudging* you, but it doesn't put up much resistance to a determined thumb.
That's the gap. Real behaviour change needs the limit to hold *when you don't want it to* — which means either a passcode you don't control, or a system that puts something between you and the app that's harder to dismiss than a button.
## Making limits that actually hold
- **Set a Screen Time passcode you don't casually know** — or have a partner set it — so "Ignore Limit" isn't a reflex.
- **Stack the settings:** App Limits plus Downtime plus turning off non-human notifications. Layers work better than one lonely limit.
- **Add real friction or stakes.** This is where a dedicated tool goes beyond Apple's. Instead of an "Ignore" button, [BurnScroll](APP) makes you *earn* your screen time by burning calories — so opening a blocked app costs effort, not a tap. It's the resistance the built-in limits lack, and it turns the urge to scroll into a reason to move.
[[CTA||Built-in limits too easy to tap past? BurnScroll makes screen time something you earn, not ignore.]]
## Bonus: two settings that help more than limits
Beyond App Limits and Downtime, two quieter settings punch above their weight:
- **Turn off notifications for non-essential apps.** Settings → Notifications, then ruthlessly disable everything that isn't a real person. Most phone pick-ups start with a notification, so silencing them cuts unwanted sessions at the source — no limit required.
- **Use a Focus mode.** Settings → Focus lets you create modes (Work, Sleep, Personal) that silence chosen apps and people automatically on a schedule or location. It's more flexible than Downtime and can hide distracting apps from your Home Screen entirely while active.
Pair these with your limits and you're shaping the environment, not just capping the clock — which is what actually changes behaviour.
## Frequently asked questions
### How do I set a screen time limit on my iPhone?
Go to Settings → Screen Time → App Limits → Add Limit, choose apps or a category, set your daily allowance, and tap Add. The app greys out when you hit the limit. Use Downtime for scheduled phone-free windows.
### How do I set screen time limits for my child's iPhone?
Set it up through Family Sharing so you control it from your own phone with a passcode your child doesn't know. Use App Limits, Downtime, Communication Limits, and Content & Privacy Restrictions for their device.
### Why doesn't Apple's Screen Time limit actually stop me?
For adults, hitting a limit shows an "Ignore Limit" button — one tap and it's gone, exactly when your willpower is lowest. It's good at showing your usage but puts up little resistance. A passcode you don't control, or a friction-based tool, holds better.
### What's the best Screen Time setting for better sleep?
Downtime scheduled over your evening and night is the most effective — it locks distracting apps during the window automatically, protecting both your sleep and your morning.
## The bottom line
Your iPhone's Screen Time tools — App Limits, Downtime, and Content restrictions for kids — are genuinely useful, and setting them up starts with facing your real usage numbers. For children with a parent-held passcode, they work well. For adults, the built-in "Ignore Limit" button makes them easy to tap past exactly when you're most tempted. Stack the settings, use a passcode you don't control, and add real friction or stakes so your limits hold when your willpower doesn't.
[[CTA||Go beyond the ignorable limit — BurnScroll makes you earn screen time by moving. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. App menus may vary by iOS version.*`),

  A('fomo-and-social-media',
    'FOMO and Social Media: Why You Cannot Stop Checking, and How to Beat It',
    'FOMO — the fear of missing out — is what keeps you compulsively checking social media. What FOMO really is, how feeds are built to exploit it, and how to trade it for JOMO.',
    ['fomo', 'fear of missing out', 'fomo social media', 'how to overcome fomo', 'jomo'],
    {},
`That itch to check — just in case something's happening, just in case you're missing it — has a name: FOMO, the fear of missing out. It's the invisible engine behind a huge amount of compulsive phone checking, and social media is engineered to run on it. Here's what FOMO actually is, why the feeds feed it deliberately, and how to swap it for something much better: the joy of missing out.
## What FOMO really is
FOMO is the anxious sense that others are having rewarding experiences you're absent from — better parties, bigger news, more fun, more success — combined with a compulsive need to stay continuously connected so you don't miss any of it. It's an old, deeply human social instinct: for most of history, missing out on group information could genuinely cost you. Your brain treats "I might be missing something" as a threat worth acting on.
The problem is that this ancient wiring now meets an infinite feed that can *always* show you something you're "missing" — so the threat never resolves, and the checking never ends.
## How social media weaponizes it
Feeds don't just happen to trigger FOMO — they're built to. The mechanisms:
- **The highlight-reel effect.** Everyone posts their best moments, so your feed is a curated stream of peaks. It looks like everyone's life is more exciting than yours, because you're comparing your whole reality to their edited highlights.
- **Real-time everything.** Stories, live streams and "active now" dots create a sense that things are happening *right now* without you, manufacturing urgency to check.
- **Endless novelty.** There's always a new post, so there's always something you haven't seen — the "missing out" feeling can never be satisfied, only fed. See [why we doomscroll](/burnscroll/articles/why-do-we-doomscroll).
- **Metrics and notifications.** Likes, comments and pings tie your social standing to the app and keep pulling you back to check your place in it.
The result is a loop: FOMO drives you to check, checking shows you more things to feel FOMO about, which drives you to check again. The feed profits from every lap.
## What chasing FOMO costs you
The irony is sharp: chasing FOMO delivers the exact thing you feared. While you're staring at a screen making sure you don't miss out, you're **actually** missing out — on the meal in front of you, the person you're with, your own life happening in real time. Constant FOMO is also linked to lower mood, higher anxiety and reduced life satisfaction, precisely because it keeps you comparing and never lets you feel present or content. You trade the real experience you're in for anxiety about experiences you're not.
## How to beat FOMO
- **Name it in the moment.** When you feel the urge to check "just in case," recognize it as FOMO — an old instinct being exploited, not real information. Naming it drains a surprising amount of its power.
- **Curate your feed.** Unfollow the accounts that spark the most comparison and inadequacy. Your FOMO is partly a choice about who you let into your feed.
- **Practice missing out on purpose.** Deliberately skip checking during a meal, an evening, a walk. Each time nothing bad happens, your brain updates: missing out is survivable, even pleasant.
- **Get present.** FOMO lives in the imagined elsewhere. Full attention on where you actually are is its direct antidote — and it's where the real experience is. See [phubbing and relationships](/burnscroll/articles/phubbing-phones-and-relationships).
- **Add friction to checking.** When the reflexive check isn't frictionless, the FOMO loop can't run on autopilot. See [how to stop doomscrolling](/burnscroll/articles/how-to-stop-doomscrolling).
[[CTA||Break the check-just-in-case loop — BurnScroll makes the feeds earn-only, so FOMO can't run your thumb.]]
## The math that kills FOMO
Here's a thought that deflates FOMO fast: you were always going to miss almost everything. There are millions of gatherings, posts, trips and moments happening right now that you will never see, and that's not a tragedy — it's just the nature of being one person with one life. Social media creates the *illusion* that you could keep up if you just checked enough, but the feed is bottomless by design; there is no "caught up." Once you accept that missing out isn't a failure to be fixed but the permanent, unavoidable condition of being alive, the fear loses its grip. You're not missing out on your life by ignoring the feed — you're missing out on your life by *watching* it.
## Trade FOMO for JOMO
There's a better destination than just "less FOMO": **JOMO — the joy of missing out.** It's the genuine contentment of being unreachable, off the grid, fully in your own life without a running anxiety about everyone else's. JOMO is what's on the other side of the fear: the evening with your phone in another room that turns out to be the best part of your week, the vacation you didn't document because you were too busy living it. Once you taste it a few times, missing out stops being a fear and becomes a relief. That's the real win — not white-knuckling less checking, but discovering you didn't want to be checking at all.
## Frequently asked questions
### What is FOMO?
FOMO — fear of missing out — is the anxious feeling that others are having rewarding experiences without you, plus a compulsive need to stay connected so you don't miss anything. Social media amplifies an old human social instinct into a constant, unresolvable itch.
### How does social media cause FOMO?
Through highlight-reel posts that make everyone's life look better than yours, real-time features that manufacture urgency, endless novelty that means you can never be "caught up," and metrics that tie your social standing to the app.
### How do I stop FOMO from social media?
Name it when it strikes, curate your feed to cut comparison triggers, deliberately practice missing out until your brain learns it's safe, get fully present where you are, and add friction so reflexive checking isn't automatic.
### What is JOMO?
JOMO is the joy of missing out — the genuine contentment of being disconnected and fully present in your own life without anxiety about what others are doing. It's the positive flip side of overcoming FOMO.
## The bottom line
FOMO is an ancient social instinct that infinite feeds exploit relentlessly, driving compulsive checking that ironically makes you miss the real life right in front of you. Beat it by naming it, curating your feed, practicing missing out on purpose, getting present, and adding friction to the reflexive check. Then keep going past "less fear" to JOMO — the genuine joy of being off the grid and fully in your own life. That's the version worth wanting.
[[CTA||Swap FOMO for a life you're actually in — BurnScroll makes the feed something you earn. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.burnscroll-${a.slug}`, _type: 'article', brand: 'burnscroll', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs Studio', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words)`)
}
console.log('\nDone — 10 BurnScroll DRAFTS (batch 2). Nothing live.')
