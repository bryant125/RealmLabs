// BurnScroll launch batch — 10 articles as DRAFTS (brand: burnscroll).
// Run once: node scripts/burnscroll-articles.mjs
// Then attach covers (black/neon style) + publish in /studio.
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

  A('how-to-stop-doomscrolling',
    'How to Stop Doomscrolling (That Actually Works, Not Just "Use Willpower")',
    'Willpower loses to an infinite feed every time. Here is why doomscrolling is engineered to be hard to quit, and the practical system that beats it — friction, triggers, and earning your screen time.',
    ['how to stop doomscrolling', 'stop scrolling', 'doomscrolling', 'phone habits', 'screen time control'],
    {},
`You know the loop. You unlock your phone to check one thing, and forty minutes later you surface from a feed you don't even remember opening, feeling slightly worse than when you started. You promise yourself you'll stop. Tonight you do it again.
Here is the first thing to understand, because it changes everything: **you are not weak.** Doomscrolling is not a discipline problem. It is the intended outcome of thousands of engineers optimising for exactly one thing — your attention — against your unassisted willpower. That is not a fair fight, and pretending it is guarantees you lose.
This is how to actually stop, built on how the habit works rather than how you wish it worked.
## Why "just put it down" never works
Every infinite feed runs on **variable reward** — the same mechanism that makes slot machines addictive. Most pulls give you nothing interesting; occasionally one delivers something genuinely funny, shocking or validating. Your brain cannot predict which, so it keeps pulling. Dopamine spikes in *anticipation* of the reward, not the reward itself, which is why the scrolling feels compulsive even when the content is boring.
Add to that: feeds have no natural stopping cue. A book has chapters, a TV episode ends. A feed is bottomless by design, so the decision to stop has to be made by you, actively, thousands of times — and decision fatigue means you almost never make it.
Willpower is the wrong tool because willpower is a limited resource that runs down over the day. By 9 PM, the exhausted version of you is negotiating with a system that never gets tired. You need a system that works when your willpower is at zero.
## The system that actually works
### 1. Add friction, not rules
The single most effective change is making the app harder to open. Every extra second between impulse and feed gives your conscious brain a chance to intervene. Options, from mild to strong:
- Move the apps off your home screen into a folder on the last page
- Log out after each use, so re-entry needs a password
- Delete the app and use only the browser version (deliberately worse)
- Use a blocker that locks the app entirely until a condition is met
Friction beats rules because rules rely on willpower and friction does not.
### 2. Attack the triggers, not just the habit
Every scroll starts with a trigger — usually boredom, anxiety, or a specific location (the couch, the bed, the toilet). For one day, notice what you feel in the two seconds *before* you reach for your phone. Once you know your triggers, you can plan for them: keep a book by the bed, leave the phone in another room during the trigger window, or replace the reach with a five-minute walk.
### 3. Make the phone boring
Switch your screen to greyscale (Settings → Accessibility → Display → Colour Filters). Feeds are engineered around saturated colour; drain it and the compulsion measurably drops. Turn off all non-human notifications — you do not need a badge from an app that wants your time.
### 4. Earn it, don't ban it
Total bans backfire. The sustainable version is making screen time something you *earn* rather than default into. This is the idea behind [BurnScroll](APP): your distracting apps stay locked until you burn the calories to unlock them — turning the impulse to scroll into a prompt to move. It reframes the feed from a free default into a reward with a price, which is exactly the reframe your brain needs.
[[CTA||Turn the urge to scroll into a reason to move. BurnScroll locks your apps until you earn them back.]]
### 5. Replace, don't just remove
A habit leaves a hole. If you delete the scroll and put nothing there, the vacuum pulls you back. Decide in advance what fills the gap — a specific book, a stretch, a message to a friend, a walk. "Do something else" is too vague to win; "read two pages of the book on my nightstand" is concrete enough to.
### 6. Use the 20-second rule, both ways
Behaviour researchers have a simple principle: we default to whatever takes about 20 seconds less effort. Use it deliberately. Make the bad habit 20 seconds *harder* — log out, bury the app, add a lock — and make the good replacement 20 seconds *easier* — book already open on the table, running shoes by the door. You are not fighting your laziness; you are pointing it at the right target. Most of "self-control" is really just having arranged your environment so the easy option is also the good one.
## What to expect in the first week
The first few days feel genuinely uncomfortable — restlessness, phantom reaches, a low buzz of "I should be checking something." That is your dopamine system recalibrating, and it passes. By the end of a week most people report the urge is quieter and, more surprisingly, that boredom starts to feel okay again. Boredom is where ideas come from; you had just forgotten.
## Frequently asked questions
### Why is doomscrolling so hard to stop?
Because feeds use variable-reward design — the same unpredictable-payoff mechanism as slot machines — and have no natural stopping point. Your willpower is finite; the system is tireless. That is why environment and friction beat willpower.
### How long does it take to break the habit?
The sharpest discomfort usually lasts a few days to a week as your reward system recalibrates. Lasting change comes from keeping the friction in place, not from a one-time effort.
### Does greyscale actually help?
For many people, yes. Feeds are designed around saturated colour and red notification badges; removing colour reduces the visual pull and makes the phone less compelling to reach for.
### Should I just delete social media entirely?
You can, but total bans often rebound. Making access effortful — or earned, as with BurnScroll — tends to be more sustainable than going cold turkey and white-knuckling it.
## The bottom line
Stop blaming your willpower and start changing your environment. Add friction, learn your triggers, drain the colour, kill the notifications, and make screen time something you earn rather than fall into. You are not fighting a bad habit; you are outmanoeuvring a system built by professionals. Do it with a better system, not more guilt.
[[CTA||Stop relying on willpower. Let BurnScroll make scrolling something you earn — free on iPhone.]]
*This article is general wellbeing information, not medical advice. If phone use is seriously affecting your mental health, consider speaking to a professional.*`),

  A('dopamine-detox',
    'Dopamine Detox: What It Actually Is (and What the Science Really Says)',
    'The "dopamine detox" is half brilliant, half nonsense. Here is what dopamine actually does, why you cannot detox from it, and the real version of the idea that genuinely resets your attention.',
    ['dopamine detox', 'dopamine fasting', 'dopamine reset', 'attention span', 'digital wellbeing'],
    {},
`"Dopamine detox" is one of those wellness phrases that is both useful and completely wrong. Wrong, because you cannot detox from dopamine — it is a core neurotransmitter running your movement, motivation and learning, and a genuine absence of it is Parkinson's disease, not enlightenment. Useful, because underneath the bad branding is a real and effective idea.
Let's separate the two, so you get the benefit without the pseudoscience.
## What dopamine actually does
Dopamine is not the "pleasure chemical" — that is the myth that makes the detox idea sound sillier than it is. Dopamine is mostly about **wanting**, not liking. It drives anticipation and motivation: the pursuit of a reward, not the enjoyment of it. This is why you can scroll for an hour, feel no real pleasure, and still keep going. The wanting system is running long after the liking stopped.
The problem with modern feeds, games and junk food is not that they produce dopamine — everything rewarding does. It is that they produce large, fast, unpredictable dopamine hits far more intense and frequent than anything in the environment we evolved for. Against that, slower rewards — reading, deep work, a real conversation, exercise — feel flat by comparison. Your baseline shifts, and ordinary life starts to feel boring.
## What a "dopamine detox" cannot do
You cannot lower your dopamine by fasting from it for a day, and you would not want to. The viral version — sitting in a blank room, avoiding all stimulation, sometimes even conversation and eating — has no scientific basis for "resetting receptors" in 24 hours. Dopamine dynamics do not work on that timescale, and the extreme version can tip into something joyless and a little obsessive.
So if someone sells you a one-day reset that rewires your brain, that part is nonsense.
## What actually works: the real version
The legitimate idea hiding inside the trend is **taking a deliberate break from your most intense, on-demand rewards so slower rewards feel worthwhile again.** That is real, and it works. Here is how to do it properly.
### Target the high-intensity, low-effort rewards
You are not detoxing from dopamine; you are reducing the *supersized* sources: infinite feeds, short-form video, mobile games, gambling-style apps, porn, and constant snacking. These are the ones that flatten everything else by comparison.
### Do it for long enough to matter
A single day does little. A meaningful reset is more like one to four weeks of sharply reduced high-intensity input. Over that window, the slower rewards genuinely start to feel good again — a book becomes absorbing, a walk becomes pleasant rather than boring.
### Don't sit in a void — swap, don't starve
The failed version removes stimulation and adds nothing. The version that works *replaces* the fast rewards with slower, effortful ones: exercise, reading, cooking, making things, seeing people, being outside. You are not chasing zero stimulation; you are re-teaching your brain to value the kind that is good for you.
### Make the fast rewards effortful to reach
The reset only holds if the easy dopamine stays hard to get. This is exactly what [BurnScroll](APP) does for the biggest offender — it locks your feed apps until you burn calories to unlock them, so the intense reward now costs effort *and* gives you a slower, healthier reward (movement) on the way in. That is the real dopamine-detox principle, automated.
[[CTA||Make the easy dopamine earn-only. BurnScroll locks your feeds until you move.]]
## A realistic version you'll actually do
You do not need to quit everything for a month to feel the effect. A gentler on-ramp that works:
- **Weekends first.** Pick Saturday and Sunday and cut the high-intensity rewards hard — no short-form video, no feeds before noon, no mobile games. Fill the space with movement, people and something you make with your hands.
- **Then extend by one weekday** each week as the discomfort eases, until the reduced level is just your normal.
- **Keep one guardrail permanently** so it doesn't snap back — for most people that's making the single worst app effortful to reach, so the easy dopamine never becomes the default again.
The point isn't monastic deprivation for its own sake; it's spending enough time below the flood line that a book, a walk or a conversation stops feeling flat. A few weekends in, they will.
## The exercise connection nobody mentions
Here is the part the detox influencers skip: exercise is one of the few things that reliably and healthily supports your dopamine system over time. It raises baseline motivation, improves mood, and — unlike a feed — the reward builds rather than crashes. Swapping some scroll time for movement is not just removing a bad input; it is adding one of the best possible good ones.
## Frequently asked questions
### Can you actually detox from dopamine?
No. Dopamine is essential to movement and motivation, and you cannot and should not remove it. The useful version is reducing your most intense, on-demand rewards so slower rewards feel rewarding again.
### Does a one-day dopamine detox work?
Not really. A single day of deprivation does not reset your receptors — that is a myth. Meaningful change comes from weeks of reduced high-intensity input combined with more slow, effortful rewards.
### What should I actually cut out?
The supersized, low-effort rewards: infinite feeds, short-form video, mobile games, gambling apps, porn and constant snacking. Not all pleasure — just the engineered, on-demand kind.
### How long until my attention improves?
Many people notice slower rewards feeling better within one to two weeks of a genuine reduction, though it varies. Keeping the fast rewards effortful to reach is what makes it stick.
## The bottom line
Forget the blank-room theatrics. The real idea is sound: cut back hard on your most intense, on-demand rewards for a few weeks, replace them with slower and more effortful ones, and keep the fast dopamine difficult to reach. Do that and ordinary life stops feeling grey. That is not a detox — it is a recalibration, and it actually works. The influencers got the branding wrong and the instinct right: your reward system really has been overloaded, and giving it a genuine break really does bring the quieter pleasures back to life. Just skip the blank room, keep the good rewards flowing, and make the intense ones earn their place.
[[CTA||Recalibrate for real — BurnScroll turns your feeds into a reward you earn by moving. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),

  A('how-to-break-phone-addiction',
    'How to Break Phone Addiction: A Practical Guide That Is Not Just "Delete Everything"',
    'Is it really addiction, or a very strong habit? Either way, here is a realistic, step-by-step plan to take back control of your phone — without moving to a cabin in the woods.',
    ['phone addiction', 'break phone addiction', 'smartphone addiction', 'digital detox', 'screen time'],
    {},
`Somewhere between "I check my phone a lot" and "I have a problem" is where most of us actually live. The average person touches their phone over two thousand times a day and picks it up dozens of times an hour, often with no memory of deciding to. Whether or not that meets a clinical definition of addiction, it is worth fixing — and fixable.
This is a realistic plan. Not "delete everything and buy a flip phone," which nobody sustains, but a set of changes that add up.
## First, is it addiction?
Clinically, "smartphone addiction" is not a formal diagnosis, but the behaviour patterns overlap with genuine behavioural addictions: loss of control, using more than intended, neglecting other things, and discomfort when you can't access it. You do not need a label to act. The useful question is simpler: **is my phone use costing me things I care about** — sleep, focus, presence with people, time? If yes, that is reason enough.
## Measure it first
Before changing anything, look at your real numbers. On iPhone, Screen Time shows your daily average, your most-used apps, and your pickups. Most people are genuinely shocked — the estimate in your head is usually half the truth. You cannot manage what you refuse to look at, so start there for one honest day.
## The plan
### Step 1 — Cut the notifications
Notifications are the leash. Every buzz is an engineered interruption that pulls you back in. Turn off *all* notifications except from actual humans (messages, calls). No news, no social badges, no "someone you may know," no game reminders. This one change alone drops pickups dramatically because most sessions start with a notification, not a decision.
### Step 2 — Redesign your home screen
Your home screen is a menu of temptations. Strip it to tools, not slot machines: keep maps, calendar, camera, notes. Move every feed and game off the first page into a folder further in. Out of sight genuinely means out of mind when the reach is automatic.
### Step 3 — Add friction to the worst offenders
Identify your top two time-sinks from Screen Time and make them harder to reach: log out after each use, delete the app and use the website, or lock them behind a barrier. The goal is to insert a conscious moment between impulse and feed.
### Step 4 — Make it earn-only
The most durable version of friction is turning access into something you earn. [BurnScroll](APP) locks your chosen apps until you burn the calories to unlock them — so instead of opening Instagram on autopilot, you either move your body first or you don't get in. It converts the phone-checking reflex into either exercise or a genuine pause, both of which win.
[[CTA||Make your worst apps earn-only. BurnScroll unlocks them when you move — not before.]]
### Step 5 — Create phone-free zones and times
Pick two that are non-negotiable: **the bedroom** (charge the phone in another room — buy a $10 alarm clock so you have no excuse) and **the first hour after waking** (starting the day in a feed sets a reactive tone you never recover). Add meals if you can. Zones work because they remove the decision entirely.
### Step 6 — Replace the ritual
Phone-checking is often a comfort ritual for boredom or stress. Removing it leaves a gap that pulls you back unless you fill it. Decide your replacements in advance: a walk, a stretch, a real break with tea, a two-minute breathing reset. Vague intentions lose; specific swaps win.
## The 30-day arc: what actually changes and when
Knowing the shape of it helps you push through the hard part.
- **Days 1–3:** the worst of it. Constant phantom reaches, a nagging sense you're missing something, real irritability. This is withdrawal from an engineered habit, and it is temporary.
- **Days 4–10:** the reaches get less frequent. You start noticing how *often* you used to check, because now the impulse is conscious rather than invisible.
- **Weeks 2–3:** boredom stops feeling like an emergency. You reach for a thought instead of a phone in idle moments. Sleep and focus usually improve noticeably here.
- **Week 4 on:** the new normal. The phone becomes a tool you use deliberately rather than a reflex you obey. The friction you set up is what keeps it there — remove it and the old habit will patiently rebuild.
## Handling the withdrawal
Expect a few days of genuine restlessness — reaching for a phone that isn't there, a nagging sense you're missing something. This is normal and it fades. What replaces it is worth the discomfort: longer attention, better sleep, and the return of boredom as a creative state rather than something to be instantly killed.
## Frequently asked questions
### Is phone addiction a real thing?
It is not a formal clinical diagnosis, but the behaviour can mirror genuine behavioural addictions — loss of control, overuse, and distress without access. If your phone use costs you sleep, focus or relationships, it is worth addressing regardless of the label.
### What is the single most effective change?
Turning off all non-human notifications, followed closely by keeping the phone out of the bedroom. Both remove the triggers that start most unwanted sessions.
### Do I have to delete social media?
No. Making it effortful or earn-only is usually more sustainable than deletion. Many people keep the apps but strip the notifications and add friction so use becomes deliberate.
### How long until it gets easier?
The strongest discomfort usually eases within a week. The habits stick when the friction and phone-free zones stay in place, not through ongoing willpower.
## The bottom line
You do not need a cabin in the woods. Measure your use, kill the notifications, redesign your home screen, add friction to the worst apps, protect the bedroom and the first hour, and replace the ritual with something real. Make access earn-only where you can. Small structural changes beat heroic willpower every time — because they keep working on the days your willpower doesn't show up, which are exactly the days that used to undo all your progress.
[[CTA||Take back control without deleting everything — BurnScroll makes your phone earn-only. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. If phone use is seriously affecting your mental health, please speak to a professional.*`),

  A('digital-wellbeing-habits',
    'Digital Wellbeing Habits That Actually Stick (Not Just for January)',
    'Most digital-wellbeing advice fails because it relies on motivation. These habits are built to survive a bad week — small, structural, and designed to run on autopilot.',
    ['digital wellbeing', 'digital wellness', 'healthy phone habits', 'screen time habits', 'tech life balance'],
    {},
`Every January, millions of people resolve to "use their phone less." By February almost all of them are back to baseline. The problem is never the intention — it is that the advice relies on motivation, and motivation is a terrible foundation because it disappears exactly when you need it, on the tired, stressed, boring days.
Habits that stick are structural. They change your environment so the healthy choice is the default and the unhealthy one takes effort. Here are the digital-wellbeing habits actually built to survive a bad week.
## Why most digital-wellbeing advice fails
"Be more mindful with your phone" is not a habit; it is a wish. It requires you to make the same hard decision hundreds of times a day using willpower you have already spent. The habits below work differently: you make one setup decision once, and it keeps paying off with no ongoing effort. That is the whole trick — front-load the willpower into a one-time change to your environment.
## The habits that stick
### 1. The phone sleeps outside the bedroom
The most valuable single habit. Charge your phone in another room overnight and use a cheap alarm clock. This protects your sleep from late-night scrolling and your morning from starting inside a feed. It works because it removes the decision entirely — the phone simply isn't there.
### 2. No phone in the first and last 30 minutes of the day
How you start and end the day sets its tone. Begin in a feed and you are reactive before you have had a thought of your own; end in one and your sleep pays for it. Protect both windows and everything in between improves.
### 3. Notifications are off by default, on by exception
Flip the model. Instead of everything buzzing unless you silence it, nothing buzzes unless you explicitly allow it. Human messages and calls, yes. Everything else, no. You will check what you actually care about on your own schedule, not the app's.
### 4. One screen-free block a day
Protect a recurring window — a walk, a meal, an hour in the evening — where the phone is in another room. Not forever, just a block. It proves to your nervous system that you can be unreachable and nothing bad happens, which is more reassuring than you'd expect.
### 5. Make the worst app earn-only
Pick your single biggest time-sink and stop letting it be free. With [BurnScroll](APP), your chosen apps stay locked until you burn the calories to unlock them — so the app you'd otherwise open on reflex now comes with a small workout attached. It runs automatically, which is exactly why it survives bad weeks: it does not depend on you feeling motivated.
[[CTA||Build one habit that runs itself — BurnScroll locks your worst app until you move.]]
### 6. Greyscale on a schedule
Set your screen to greyscale in the evenings. The drained colour makes the phone markedly less compelling right when your willpower is lowest, nudging you toward winding down instead of scrolling.
### 7. Curate ruthlessly, quarterly
Once every few months, cull. Delete apps you didn't miss, unfollow accounts that leave you worse off, mute the group chats that only add noise. A lighter phone is a calmer phone.
## Make them stick: the meta-habit
Do not try to adopt all seven at once — that is a motivation play and it will fail. Pick **one**, make it automatic over two weeks, then add the next. Stack them slowly. A single habit that survives is worth more than seven that collapse by February.
And anchor new habits to existing ones. "After I brush my teeth, the phone goes on the kitchen charger." "When I sit down to dinner, the phone goes in the drawer." Attaching a new behaviour to an established cue is the most reliable way to make it automatic.
## The workday version
Most digital-wellbeing advice assumes leisure, but the workday is where distraction costs you most. A few habits translate directly:
- **Batch your messages.** Check email and Slack at set times — say, on the hour — rather than reactively. Constant checking is the single biggest focus-killer in knowledge work.
- **One screen, one task.** Close the tabs you aren't using. A visible feed tab is a standing invitation to switch.
- **Phone in a drawer, not on the desk.** Its mere visible presence drains focus even when you don't touch it.
- **Protect a daily deep-work block** where messages are off entirely. One uninterrupted hour beats a whole day of fragmented attention.
These aren't productivity hacks so much as digital-wellbeing habits pointed at the eight hours where your attention is most valuable — and most under attack.
## Frequently asked questions
### Why do my digital-wellbeing resolutions always fail?
Because they rely on motivation, which fades on tired and stressful days. Structural habits — ones that change your environment so the healthy choice is the default — survive where willpower-based intentions collapse.
### What is the most impactful single habit?
Charging your phone outside the bedroom. It protects both your sleep and your morning, and it works by removing the decision entirely rather than relying on restraint.
### How many habits should I start with?
One. Make it automatic over about two weeks, then add another. Trying to change everything at once is the most common reason people give up.
### Does greyscale really make a difference?
For many people it does, especially in the evening. Feeds are built around saturated colour, so removing it lowers the phone's pull when your self-control is weakest.
## The bottom line
Stop relying on motivation. Build structure: phone out of the bedroom, protected windows at the start and end of the day, notifications off by default, one screen-free block, your worst app made earn-only, greyscale in the evenings, and a quarterly cull. Add them one at a time, anchor them to existing routines, and they will still be running long after your January resolution would have died. The measure of a good digital-wellbeing habit is not how impressive it looks in week one — it's whether it survives a genuinely bad week. Build for the bad week, and the good ones take care of themselves.
[[CTA||Start with one habit that sticks — BurnScroll makes screen time earn-only. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),

  A('why-do-we-doomscroll',
    'Why We Doomscroll: The Psychology of Infinite Feeds',
    'Doomscrolling is not a personal failing — it is the predictable result of specific psychological mechanisms, deliberately engineered. Understand the five that trap you, and you can start to escape.',
    ['why do we doomscroll', 'psychology of doomscrolling', 'infinite scroll', 'negativity bias', 'social media psychology'],
    {},
`It is midnight. You are reading your ninth consecutive piece of bad news, none of which you can do anything about, all of which is making you feel worse — and you cannot stop. This is doomscrolling, and if you have ever wondered why something that feels so bad is so hard to quit, the answer is not that you are broken. It is that you are running human psychology that was quietly hijacked.
Here are the five mechanisms doing it to you. Understanding them is the first real step out.
## 1. Negativity bias: bad news grips harder
Your brain evolved to prioritise threats. For an ancestor on the savannah, missing good news cost little, but missing a predator cost everything — so we are wired to pay more attention to negative information. That wiring is useful in a dangerous world and disastrous in an infinite feed, because it means alarming content captures and holds you far more powerfully than good news ever could. Feeds, optimised for engagement, learn this fast and serve you more of what grips you: the bad stuff.
## 2. Variable rewards: the slot-machine effect
This is the big one. Feeds deliver rewards on an *unpredictable* schedule — most posts are dull, but every so often one is funny, shocking or validating. Unpredictable rewards are the most compulsive kind known to psychology; it is precisely how slot machines keep people pulling the lever. Your dopamine system fires in anticipation of the *next* post, not in response to the current one, which is why you keep scrolling through content you are not even enjoying. You are chasing the maybe.
## 3. No stopping cue: designed to be bottomless
Older media had built-in endings — the bottom of the page, the end of the episode. Infinite scroll deliberately removed them. Without a natural stopping point, the decision to quit has to be made actively, by you, over and over. Combine that with decision fatigue and you get sessions that end only when something external interrupts you, never because you chose to stop.
## 4. FOMO and social monitoring: the fear of missing out
We are intensely social animals, evolved to track our group's status and information. Feeds exploit this by making it feel as if something important is always happening without you — a conversation, a crisis, a moment. The anxiety of missing out overrides the knowledge that almost none of it matters, and back in you go to check.
## 5. Anxiety loops: scrolling to soothe what scrolling caused
Here is the cruel twist. In uncertain, frightening times, scrolling *feels* like taking action — gathering information, staying informed, regaining a sense of control. But consuming an endless stream of threats you cannot act on raises anxiety rather than lowering it, which drives you to seek more information to soothe the anxiety the information created. It is a closed loop, and it tightens the more anxious you already are.
## 6. Personalisation: a feed built to hold you specifically
The final layer makes the first five far worse. Modern feeds are not showing everyone the same thing — they learn, from every tap and pause and rewatch, exactly what holds *you*. Over time the algorithm builds a model of your specific weaknesses: the topics that outrage you, the accounts you can't look away from, the content that keeps you up. It is a slot machine that studies you and reweights its reels toward whatever keeps you pulling. This is why quitting feels harder the longer you've used a platform — it has simply gotten better at you. And it's why generic "use less" advice underperforms: you're not up against a feed, you're up against a feed trained on your own behaviour.
## Why understanding this matters
None of these mechanisms are accidents. They are the predictable output of systems engineered by well-resourced teams to maximise the time you spend. Recognising that reframes the whole problem: you are not failing at self-control, you are losing an unfair contest. And unfair contests are not won with more effort — they are won by changing the rules.
## What actually helps
Once you see the mechanisms, the countermeasures make sense:
- **Break the variable reward** by adding friction, so the feed is not a frictionless lever
- **Restore a stopping cue** with time limits and app locks that create the ending the feed refuses to
- **Cut the trigger** by killing notifications, the engineered prompts to re-enter
- **Change the environment**, because environment beats willpower every time
This is the logic behind [BurnScroll](APP): it puts a real cost — burning calories — between you and the feed, which simultaneously breaks the frictionless reward loop and forces the stopping cue the app was built to remove. You are not relying on willpower against a slot machine; you are changing the machine.
[[CTA||Change the rules of the feed. BurnScroll puts a real cost between you and the scroll.]]
## Frequently asked questions
### Why do I doomscroll even when it makes me feel worse?
Because negativity bias makes threatening content grip you, and variable rewards keep you chasing the next post. The bad feeling and the compulsion run on separate systems, so feeling worse does not switch off the wanting.
### Is doomscrolling a sign of anxiety?
It can both reflect and worsen anxiety. Scrolling feels like productively gathering information, but consuming endless unactionable threats tends to raise anxiety, which drives more scrolling — a self-reinforcing loop.
### Why can't I just stop?
Infinite feeds are designed without stopping cues, so quitting requires an active decision hundreds of times a day against decision fatigue. The design, not your willpower, is the problem.
### How do I actually break the cycle?
Change the environment rather than relying on self-control: add friction, restore stopping points with limits or locks, and turn off notifications. Making the feed effortful to reach beats trying to resist it.
## The bottom line
You doomscroll because your ancient threat-detection wiring, your reward system, and your social instincts are being deliberately exploited by bottomless, notification-driven feeds. It is not weakness — it is design. And because it is design, the way out is also design: change your environment so the feed is no longer a frictionless, endless, always-on slot machine. Beat the system with a better system.
[[CTA||Beat the design with a better one — BurnScroll makes the feed something you earn. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),

  A('how-much-screen-time-is-too-much',
    'How Much Screen Time Is Too Much? A Straight Answer for Adults',
    'There is no magic number of hours — but there are clear signs your screen time has tipped from useful to harmful. Here is how to judge your own, and what to do about it.',
    ['screen time limits', 'how much screen time', 'too much screen time', 'average screen time', 'screen time adults'],
    {},
`Search "how much screen time is too much" and you'll get a number thrown at you — two hours, four hours, whatever. For adults, that number is mostly meaningless, and chasing it misses the point. Four hours of work, video calls and navigation is very different from four hours of compulsive late-night scrolling. The question is not *how many hours* but *what the hours are doing to you*.
Here is a straight, honest answer.
## The average, for context
Adults now average somewhere around four to seven hours a day on their phones outside of work, depending on the study and country — and most people underestimate their own use by roughly half. So if your number feels high, you are not unusual. "Normal," though, is not the same as "healthy" — the average is high precisely because the whole environment is engineered to push it up.
## Why the "right number" is the wrong question
Not all screen time is equal, and lumping it together is why hour-count rules fail:
- **Active vs passive.** Video-calling your family, writing, learning, navigating — active, often valuable. Passively consuming an infinite feed — usually not. Same minutes, opposite effect.
- **Chosen vs compulsive.** An hour you decided to spend on something you enjoy is fine. An hour you fell into and can't account for is the problem.
- **Displacing vs additive.** Screen time is harmful largely when it *displaces* things that matter — sleep, movement, real connection, focused work. An hour that costs you an hour of sleep is expensive; an hour on the train that costs you nothing is not.
So stop counting hours and start asking what the hours replace.
## The signs it's actually too much
Regardless of the number on the clock, these are the real red flags:
- You use it far more than you intend, and lose track of time in it
- It's cutting into your **sleep** — scrolling in bed, staying up "one more"
- You reach for it automatically in every idle moment and feel anxious without it
- It's crowding out exercise, hobbies, or time with people
- You feel worse after using it — flatter, more anxious, more scattered — but keep going
- Your focus and attention span feel shorter than they used to
If several of these are true, your screen time has tipped from tool to problem, whatever the hour count says.
## The sleep line is the one that matters most
If you take one hard rule from this, make it about sleep. Screen use in the hour before bed delays sleep, and using the phone *in bed* is linked to worse sleep quality and quantity. Sleep underpins mood, focus, weight and immune function, so screen time that costs sleep is the single most expensive kind. Protect the last hour of your day and the phone in the bedroom, and you have addressed the worst of it.
## What to do about it
You do not need to hit a target number. You need to shift the *composition* and protect the boundaries:
- **Audit it.** Look at your Screen Time breakdown for one honest day. Which apps, and is it active or passive?
- **Protect sleep.** Phone out of the bedroom, nothing in the last hour.
- **Cut the passive, keep the active.** You are not trying to use your phone less overall so much as scroll less and live more.
- **Make the passive apps earn-only.** [BurnScroll](APP) locks your feed apps until you burn the calories to unlock them, so the compulsive, passive time gets a cost while your genuinely useful apps stay free. It targets exactly the screen time that hurts and leaves the rest alone.
[[CTA||Put a cost on the screen time that hurts — BurnScroll locks your feeds until you move.]]
## A simple weekly self-check
Instead of chasing an hour target, run this five-question check once a week. Each "yes" is a point:
- Did my phone cost me sleep this week (in bed, or up too late scrolling)?
- Did I regularly use an app far longer than I meant to?
- Did I reach for my phone in almost every idle moment?
- Did scrolling leave me feeling worse but I kept going anyway?
- Did it crowd out exercise, a hobby, or time with people?
**0–1:** your screen time is probably fine — carry on. **2–3:** drifting; tighten your boundaries, especially around sleep. **4–5:** it's costing you real things, and it's worth making your worst apps earn-only and protecting the bedroom and the last hour of your day. The score matters more than any hour count, because it measures impact rather than time.
## Frequently asked questions
### Is there a recommended screen time limit for adults?
Not a meaningful universal one. Unlike children, adults have no official hour cap, because the *type* of use matters far more than the total. Judge by impact — sleep, focus, mood, relationships — not by a number.
### What is the average daily screen time for adults?
Studies vary, but many put non-work phone use at roughly four to seven hours a day, and people typically underestimate their own by around half. High is common, but common isn't the same as healthy.
### How do I know if my screen time is a problem?
Look for using it more than intended, losing sleep to it, reaching for it compulsively, it crowding out other things, and feeling worse afterward but continuing. These matter more than the hour count.
### What's the most important screen time boundary?
The last hour before bed, and keeping the phone out of the bedroom. Screen time that costs you sleep is the most damaging kind because sleep affects nearly everything else.
## The bottom line
"Too much" is not a number of hours — it is when your screen time starts costing you sleep, focus, movement or connection, or when it stops feeling chosen. Audit what your hours actually contain, protect your sleep ruthlessly, cut the passive and keep the active, and put a real cost on the apps that pull you in. Measured that way, you'll know exactly whether yours is too much — and what to do about it.
[[CTA||Cut the screen time that costs you — BurnScroll makes your feeds earn-only. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),

  A('best-screen-time-apps-compared',
    'Best Screen Time Apps 2026: Freedom vs. Opal vs. one sec vs. BurnScroll',
    'An honest comparison of the top screen-time and app-blocking apps in 2026 — how each one actually works, what it costs, where it wins, and which approach fits how you fail.',
    ['best screen time app', 'app blocker', 'freedom app', 'opal app', 'one sec app'],
    {
      overview: {
        caption: 'Verified July 2026. Prices and features may change.',
        headers: ['', 'Freedom', 'Opal', 'one sec', 'BurnScroll'],
        rows: [
          ['Approach', 'Scheduled blocks', 'Focus sessions', 'Friction pause', 'Earn by exercise'],
          ['Free tier', 'Limited trial', 'Yes, limited', 'Yes, generous', 'Yes'],
          ['Paid', '~$40/yr', '~$100/yr', '~$20/yr', 'Free'],
          ['Platforms', 'iOS, Android, desktop', 'iOS, Mac', 'iOS, Android', 'iPhone'],
          ['Best for', 'Deep-work blocks', 'Data + focus scores', 'Impulse pausing', 'Turning urge into movement'],
        ],
      },
    },
`Screen-time apps mostly fall into a few camps, and the right one depends entirely on *how* you lose control. Someone who needs a locked two-hour work block needs something very different from someone who impulsively opens Instagram forty times a day. This is an honest look at four of the best in 2026 — including our own, BurnScroll — so you can match the tool to your actual failure mode.
## The short version
[[TABLE:overview]]
## Freedom — the scheduled blocker
Freedom is the veteran. Its strength is **scheduled, cross-device blocking**: you set blocklists and sessions, and the chosen sites and apps go dark across your iPhone, Android and computer at once. That cross-device reach is genuinely useful if your distraction hops from phone to laptop.
**Best for:** people who want pre-planned deep-work blocks across every device.
**Watch for:** it runs on schedules and willpower — nothing stops you cancelling a session in a weak moment, and it is a paid subscription.
## Opal — the data-rich focus app
Opal leans into focus *sessions* and analytics, giving you a "focus score," detailed breakdowns and a polished experience. If you are motivated by measurement and want to see your progress quantified, Opal is the most data-forward option here.
**Best for:** people driven by stats and dashboards.
**Watch for:** it is the most expensive on this list, and all the data in the world doesn't help if you dismiss the block anyway.
## one sec — the friction app
one sec has the cleverest single idea: before a chosen app opens, it forces you to take a breath and wait a few seconds, then asks if you really want to continue. That tiny pause breaks the automatic reach, and a surprising share of the time you realise you don't actually want to open it. It is elegant, cheap and genuinely effective for *impulse* opening.
**Best for:** people whose problem is mindless, reflexive opening.
**Watch for:** the pause is easy to click through once the novelty fades; it interrupts the reflex but doesn't add a real cost.
## BurnScroll — earn it by moving
Our approach is different from all three: instead of scheduling, measuring or pausing, [BurnScroll](APP) makes screen time something you **earn with your body.** Your chosen apps stay locked until you burn the calories to unlock them — 100 active calories might buy 20 minutes — and it syncs with Apple Health and Apple Watch so any workout counts. It turns the impulse to scroll into a prompt to move, so the time you do spend is genuinely earned.
**Best for:** people who want their bad habit to power a good one, and who are motivated by turning the urge into exercise.
**Watch for:** it is iPhone-only, and it is deliberately more demanding than a pause — that's the point, but it won't suit someone who just wants a gentle nudge.
[[CTA||Turn the urge to scroll into a workout — BurnScroll unlocks your apps when you move.]]
## ScreenZen and Jomo — the honourable mentions
Two more worth knowing. **ScreenZen** is free and, like one sec, inserts a pause and a prompt before your chosen apps open, plus configurable limits — a strong no-cost pick for impulse control. **Jomo** ("joy of missing out") blends blocking, focus sessions and a friendlier, more gamified design, sitting somewhere between Opal's data focus and one sec's simplicity. Neither changes the core lesson: they're variations on scheduling, pausing and measuring. BurnScroll remains the only one on this page that adds a *physical* cost and turns the urge into exercise, which is the right tool if willpower-and-a-pause hasn't been enough for you.
## How to choose by how you fail
- **You cancel your own focus sessions** → the friction or earn-it models (one sec, BurnScroll) beat pure schedulers, because they add a cost in the moment.
- **You're distracted across phone and laptop** → Freedom, for the cross-device reach.
- **You're motivated by data** → Opal.
- **You open apps on pure reflex** → one sec's pause, or BurnScroll if you want the reflex to trigger movement instead.
- **You want the habit to produce something good** → BurnScroll is the only one here that converts scroll-urges into exercise.
## The honest take
No app fixes this by itself — the best one is the one whose approach matches the moment you actually lose control. Schedulers help planners; pauses help the impulsive; data helps the measurers; and earning-by-movement helps people who want their weakness to fuel a strength. Pick for your failure mode, not the feature list.
## Frequently asked questions
### What is the best free screen time app?
one sec has a generous free tier and BurnScroll is free, so both are strong no-cost options. Freedom and Opal are largely subscription-based, though each has a limited free tier.
### Do screen time apps actually work?
They help most when their method matches your failure mode. Schedulers suit planners; friction apps suit impulsive openers; earn-it apps suit people who want a real cost. None replaces the underlying decision to change.
### What makes BurnScroll different?
Instead of scheduling or pausing, it makes you earn screen time by burning calories, syncing with Apple Health and Apple Watch. It is the only approach here that turns the urge to scroll into exercise.
### Can I use more than one?
Yes, and some people do — for example a scheduler for deep-work blocks plus an earn-it or friction app for impulsive phone use. Start with one that matches your main problem before stacking.
## The bottom line
Freedom blocks on a schedule across devices, Opal measures and gamifies focus, one sec inserts a friction pause, and BurnScroll makes you earn screen time by moving. ScreenZen and Jomo add free pausing and gamified focus to the mix. Match the tool to how you actually fail, not to the longest feature list — and if you want your worst habit to power a better one, that's the box only BurnScroll ticks. The best screen-time app isn't the one with the most features; it's the one whose method survives contact with the exact moment you reach for your phone.
[[CTA||Make scrolling earn-only — download BurnScroll free on iPhone.]]
*Features and prices verified July 2026 and may change. This article is general wellbeing information, not medical advice.*`),

  A('screen-time-and-sleep',
    'Screen Time and Sleep: How Your Phone Is Wrecking Your Rest (and How to Fix It)',
    'It is not just the blue light. Here is how phone use before bed sabotages your sleep on three separate fronts — and the realistic routine that fixes it.',
    ['phone before bed', 'screen time and sleep', 'blue light sleep', 'phone in bedroom', 'better sleep habits'],
    {},
`If you scroll in bed and wonder why you're tired, the two are almost certainly connected. Phone use before sleep is one of the most common and most fixable causes of bad rest — and here is the part most articles miss: **blue light is the least of it.** The bigger damage is what the content does to your brain and what the phone does to your bedtime.
Here is how your phone wrecks your sleep on three fronts, and how to fix each.
## Front 1: the content keeps your brain awake
Sleep needs a winding-down nervous system. Feeds do the opposite. Whether it's outrage, an argument in the comments, exciting news or an anxiety-spiking headline, engaging content activates you — raising alertness and, often, stress hormones right when you need them falling. You cannot lie down calmly after ten minutes of your brain being deliberately stimulated. The feed is engineered to hold your attention, and holding your attention is the enemy of falling asleep.
## Front 2: the phone steals the time itself
This is the simple, brutal one: "just five more minutes" becomes forty, and you lose sleep to the clock directly. This is **sleep procrastination** — delaying bed not because you're not tired, but because the feed won't release you. It has no stopping cue, so you keep going, and the sleep you lose this way is often more than any blue-light effect.
## Front 3: blue light nudges your clock
The famous one, and real but smaller than the hype. Screen light — especially blue wavelengths — can suppress melatonin, the hormone that signals your body it's time to sleep, and shift your internal clock slightly later. Night Shift and dark mode help a little, but they do nothing about fronts 1 and 2, which is why "I use Night Shift" is not the fix people think it is.
## The fix: a realistic wind-down
You don't need a monastic routine. You need to protect the last stretch of your day.
### Set a phone curfew
Pick a time — 30 to 60 minutes before bed — after which the phone is done. This single boundary addresses all three fronts at once: no stimulating content, no lost time, no late light exposure. It is the highest-leverage change you can make.
### Charge the phone outside the bedroom
The most effective sleep habit there is. If the phone isn't in the room, you can't scroll in bed, can't sleep-procrastinate, and can't reach for it at 3 AM. Buy a $10 alarm clock so "I need it for the alarm" stops being an excuse. Out of the room, out of the equation.
### Replace the scroll with a real wind-down
The pre-sleep scroll is usually a habit filling the gap between "done with the day" and "asleep." Fill it deliberately instead: read a physical book, stretch, shower, journal, or just sit. Give your nervous system the boring, low-stimulation input it needs to power down.
### Make the bedtime apps earn-only
If the pull in bed is too strong to resist by intention alone, add a real barrier. [BurnScroll](APP) locks your feed apps until you burn the calories to unlock them — which at bedtime effectively means they stay locked, because you're not about to do a workout at 11 PM just to scroll. It enforces the curfew your willpower can't.
[[CTA||Enforce your own bedtime — BurnScroll locks your feeds so late-night scrolling isn't an option.]]
## The morning matters too
Fixing your nights is half the picture; how you start the day feeds back into it. Reaching for the phone the instant you wake floods a barely-awake brain with stimulation and other people's priorities, spiking stress before you've had a single thought of your own — and it sets a reactive, scattered tone that makes you more prone to scrolling all day, which then wrecks the *next* night. Protect the first 30 minutes: no phone until you're up, moving and ideally have had some daylight, which actually helps set your body clock for better sleep that night. A good morning and a good night are the same loop viewed from two ends — fix one and the other gets easier.
## Why this is worth it
Sleep is the foundation everything else sits on — mood, focus, weight regulation, immune function, even how well you resist the phone the next day. Poor sleep makes you more impulsive and more prone to scrolling, so bad phone-sleep habits feed themselves. Break the cycle at night and the daytime gets easier too.
## Frequently asked questions
### Is it really just blue light that affects sleep?
No — that's the smallest factor. The bigger problems are stimulating content keeping your brain alert and "just five more minutes" stealing sleep time directly. Blue-light filters help a little but don't touch those two.
### How long before bed should I stop using my phone?
Aim for 30 to 60 minutes. A phone curfew addresses stimulation, lost time and light exposure all at once, making it the single most effective change.
### Does keeping my phone out of the bedroom actually help?
Yes — it's one of the most effective sleep habits. If the phone isn't in the room you can't scroll in bed, can't delay sleep with it, and can't reach for it during the night.
### Does Night Shift or dark mode fix the problem?
Only partially. They reduce blue light but do nothing about stimulating content or lost time, which cause most of the sleep damage.
## The bottom line
Your phone wrecks your sleep on three fronts — stimulating content, stolen time, and blue light — and only the first two matter most, which is exactly what filters don't fix. Set a phone curfew, charge the device outside the bedroom, replace the scroll with a real wind-down, and add a hard barrier if you need one. Protect your nights and your days get better too — and because better sleep makes you less impulsive, you'll find the phone easier to resist the next day, turning the vicious cycle into a virtuous one.
[[CTA||Sleep better starting tonight — BurnScroll keeps your feeds locked at bedtime. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. Persistent sleep problems are worth discussing with a doctor.*`),

  A('how-to-improve-focus',
    'How to Focus in a World Built to Distract You',
    'Your attention span is not broken — it is under constant attack. Here is how focus actually works, why modern life shreds it, and a practical system to rebuild deep concentration.',
    ['how to improve focus', 'improve concentration', 'attention span', 'deep work', 'focus tips'],
    {},
`If you can't focus like you used to, you probably blame yourself. Don't. Your attention is not defective — it is under sustained, professional attack. Every app, feed and notification is competing for it, and the ones that win are engineered by teams whose entire job is to fragment your concentration. The good news: focus is trainable, and you can rebuild it once you understand how it actually works.
## Why you can't focus anymore
Focus depends on sustaining attention on one thing while ignoring everything else. Two modern forces make that brutally hard.
**Constant interruption.** Every notification, every buzz, every "quick check" fractures your attention. And the cost is bigger than the interruption itself: after a distraction it can take many minutes to fully re-immerse in a task. Interrupt someone every few minutes and they never reach deep focus at all — they live in a permanent shallow.
**A trained appetite for novelty.** Years of feeds delivering a new hit every few seconds have trained your brain to expect constant novelty. Against that, a single demanding task feels unbearably slow, and the itch to switch to something more stimulating becomes almost reflexive. That itch is the sound of your novelty appetite, not a real need to check anything.
## How focus actually works
Attention is less like a switch and more like a muscle with a warm-up. It takes time to descend into deep concentration — often fifteen to twenty minutes of uninterrupted effort before you hit flow. This has a hard consequence: **if you get interrupted every ten minutes, you never arrive.** You spend all day climbing toward focus and getting knocked back down. Protecting unbroken blocks is therefore not a luxury; it is the whole game.
## The system to rebuild it
### 1. Protect blocks, ruthlessly
Focus lives in uninterrupted time. Block out chunks — start with 25–45 minutes — where you do one thing and nothing else. No email, no "quick checks," no switching. Guard these blocks like appointments, because for your attention they are.
### 2. Remove the phone from the room
Not face-down on the desk — *out of the room.* Research shows that the mere presence of your phone, even switched off, reduces available cognitive capacity: part of your mind stays busy resisting it. The only reliable fix is distance. Out of sight genuinely restores mental bandwidth.
### 3. Kill notifications during focus
A single notification can end a focus block. Turn on Do Not Disturb or a Focus mode for your work windows so nothing can interrupt. You will check messages afterward, and almost nothing genuinely can't wait 40 minutes.
### 4. Train the muscle, don't expect it
If your attention is shredded, you won't do two-hour deep sessions on day one. Start with what you *can* sustain — even 15 minutes — and extend as it strengthens. Focus is trainable, but like any muscle it grows from progressive load, not from a single heroic attempt.
### 5. Starve the novelty itch
The urge to switch is your novelty appetite, and it shrinks when you stop feeding it. Cutting back on the high-frequency reward sources — feeds, short video — outside of work makes deep focus dramatically easier inside it. This is where [BurnScroll](APP) helps: by making your feed apps earn-only, it stops you feeding the novelty appetite in every idle gap, so when you sit down to work the itch is quieter and focus comes faster.
[[CTA||Quiet the itch to switch — BurnScroll makes your distraction apps earn-only.]]
### 6. Give the mind one clear target
Vague tasks invite wandering. Before a focus block, define exactly what "done" looks like: not "work on report" but "write the first two sections." A clear, single target gives attention something to lock onto and makes drifting obvious.
### 7. Work with your energy, not against it
Focus is not evenly available across the day. Most people have a window — often the first few hours after fully waking — when concentration comes easiest, and a slump later on. Fighting your biology by scheduling your hardest thinking for your worst hours guarantees a struggle. Instead, protect your sharpest window for the work that matters most and defend it from meetings and messages, and park shallow, low-stakes tasks in the slump. You'll get more from one focused hour at your peak than three at your trough. Notice your own pattern for a few days, then build the day around it rather than pretending every hour is equal.
## What improvement feels like
Rebuilding focus is gradual, not sudden. Over a few weeks of protected blocks and less novelty-feeding, you'll notice you can stay with one task longer, the itch to switch weakens, and — the real prize — deep work starts to feel good again rather than effortful. That satisfying absorption is what constant switching had stolen.
## Frequently asked questions
### Why is my attention span so short now?
Because constant interruptions fracture your focus and years of high-frequency feeds have trained your brain to crave novelty. It's a trained state, not a permanent defect — which means it can be retrained.
### How long does it take to get into deep focus?
Often fifteen to twenty minutes of uninterrupted work. That's why frequent interruptions are so costly — get knocked back every ten minutes and you never actually arrive at deep focus.
### Does having my phone nearby really matter if it's face-down?
Yes. Studies show the mere presence of your phone reduces available mental capacity, even switched off and face-down. Putting it in another room reliably frees up bandwidth.
### How do I rebuild my focus if it's really bad?
Start with short protected blocks — even 15 minutes — remove the phone, kill notifications, and cut back on feeds outside work. Extend the blocks gradually. Focus grows like a muscle, through progressive practice.
## The bottom line
Your focus isn't broken; it's besieged. Rebuild it by protecting uninterrupted blocks, removing the phone from the room, killing notifications, training the muscle gradually, starving the novelty itch, and giving your mind one clear target at a time. Do that and deep concentration comes back — along with the quiet satisfaction of actually finishing something.
[[CTA||Reclaim your attention — BurnScroll keeps distractions earn-only so focus comes easier. Free on iPhone.]]
*This article is general wellbeing information, not medical advice.*`),

  A('exercise-vs-anxiety',
    'Exercise vs. Anxiety: Why Moving Your Body Beats Scrolling Every Time',
    'When anxiety hits, the phone is the easiest reach and the worst choice. Here is what the science says about movement as an anxiety tool — and how to make it your default instead of the feed.',
    ['exercise for anxiety', 'exercise and anxiety', 'movement mental health', 'anxiety relief', 'scrolling anxiety'],
    {},
`When anxiety rises, what do you reach for? For most of us now, it's the phone — and it's the worst possible choice, because scrolling tends to feed anxiety while feeling like relief. There is a far better tool available, one your body came with: movement. Here is why exercise beats scrolling for anxiety, and how to make it your reflex instead.
## Why we scroll when we're anxious (and why it backfires)
Anxiety creates an urge to *do something*, and scrolling impersonates action. Checking the news feels like gathering information; checking social feels like connecting; both feel like coping. But an endless stream of threats and comparisons you can't act on generally raises anxiety rather than lowering it, and then drives you back for more to soothe the anxiety it created. It's a loop that tightens the more anxious you are — the exact opposite of what you need.
## Why movement works
Exercise is one of the most evidence-backed tools for anxiety there is, and it works through several real mechanisms at once:
- **It burns off the stress response.** Anxiety is a body primed for action — adrenaline and cortisol with nowhere to go. Movement gives that activation an outlet and lets the physical stress response complete and settle, instead of buzzing under the surface.
- **It changes your brain chemistry for the better.** Exercise boosts mood-regulating and calming neurochemistry and, over time, supports the brain systems that keep anxiety in check — a genuine, lasting effect, not just a distraction.
- **It interrupts the spiral.** Anxiety runs on rumination, looping thoughts. Movement pulls your attention into your body and the present moment, breaking the loop in a way scrolling never does.
- **It builds resilience.** Regular exercise is associated with lower baseline anxiety over time, so you're not just treating a spike — you're raising your whole threshold.
Compare that to scrolling, which offers a momentary distraction and usually leaves you more wound up. It isn't close.
## The catch: the phone is easier
Here's the honest problem. In the moment anxiety hits, the phone requires zero effort and movement requires some. The easiest option almost always wins, which is why we scroll even though we *know* a walk would help more. Willpower rarely bridges that gap, because anxiety is exactly the state in which willpower is lowest.
The fix isn't more discipline — it's redesigning the moment so movement becomes the path of least resistance and scrolling doesn't.
## How to make movement your default
### Lower the bar for exercise
The version that works when anxious is not a gym session — it's the smallest thing you'll actually do. A five-minute walk. Ten squats. Going up and down the stairs. Stepping outside. The goal is to interrupt the state and give the stress response an outlet; intensity matters far less than just starting.
### Raise the bar for scrolling
If the phone is effortless, movement can't compete. So add friction to the phone. This is precisely what [BurnScroll](APP) does — and it closes the loop beautifully: when the anxious urge to scroll hits, your feed apps are locked until you burn the calories to unlock them. The reach for the phone becomes a prompt to move, which is the exact thing that actually helps your anxiety. You end up doing the better thing *because* the worse thing now costs effort.
[[CTA||Turn the anxious reach for your phone into movement — BurnScroll locks your feeds until you move.]]
### Pair it with an existing trigger
Attach movement to a moment you already have. "When I feel the urge to doomscroll, I'll do ten squats first." "Before I check my phone after lunch, I walk around the block." Linking the new response to an existing cue makes it automatic faster than relying on remembering.
### Match the movement to the anxiety
Different anxious states respond to different movement, and knowing which helps you pick fast:
- **Racing, wired, too much energy** → something vigorous to burn it off: a brisk walk that turns into a jog, stairs, a few hard intervals. Let the body spend the adrenaline it's holding.
- **Tense, tight, clenched** → something that releases: stretching, yoga, a slow walk while consciously dropping your shoulders and unclenching your jaw.
- **Foggy, frozen, can't start** → the smallest possible movement to break the freeze: stand up, step outside, walk to the end of the street. Motion first, momentum after.
You don't need to analyse it for long — the rule of thumb is simply *move in the way your body is asking to*. The worst choice is always the same one: staying still with the phone.
## A note on limits
Exercise is powerful and, for many people, genuinely comparable to other frontline tools for mild-to-moderate anxiety — but it is not a cure-all. If anxiety is severe, persistent, or interfering with your life, please talk to a doctor or mental-health professional. Movement is a superb tool and often part of the answer; it doesn't replace proper care when you need it.
## Frequently asked questions
### Does exercise really help with anxiety?
Yes — it's one of the most evidence-backed self-help tools for anxiety. It burns off the physical stress response, improves calming brain chemistry, interrupts rumination, and lowers baseline anxiety over time.
### How much exercise do I need to feel calmer?
Less than you'd think. Even a short walk or a few minutes of movement can interrupt an anxiety spike. Consistency matters more than intensity for the longer-term benefit.
### Why do I scroll instead of exercising when anxious?
Because the phone takes zero effort and movement takes some, and anxiety is exactly when your willpower is lowest. The fix is making movement easier to start and the phone harder to reach, rather than relying on discipline.
### Can exercise replace therapy or medication?
Not necessarily. Exercise is a strong tool and often part of the answer, but severe or persistent anxiety deserves professional care. Think of movement as a powerful complement, not a guaranteed substitute.
## The bottom line
When anxiety hits, scrolling feels like relief and usually makes it worse, while movement is one of the best tools you have and usually gets skipped because it's harder to start. Fix the incentives: lower the bar for movement, raise the bar for the phone, and pair the new response to a trigger you already have. Make moving the easy choice and scrolling the effortful one — and let your worst reflex start powering your best one.
[[CTA||Make movement your default — BurnScroll turns the urge to scroll into a reason to move. Free on iPhone.]]
*This article is general wellbeing information, not medical advice. If anxiety is severe or persistent, please speak to a healthcare professional.*`),
]

for (const a of articles) {
  const doc = {_id: `drafts.burnscroll-${a.slug}`, _type: 'article', brand: 'burnscroll', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const t = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words${t?`, ${t} tables`:''})`)
}
console.log('\nDone — 10 BurnScroll DRAFTS. Nothing is live.')
