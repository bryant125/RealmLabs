// BurnScroll batch 5 — 10 articles on trading 1–2 hours of scrolling for exercise
// (BurnScroll's burn-to-unlock idea), as DRAFTS. Topics picked from US Google
// autocomplete demand (Oct 2026) and checked against the 40 existing articles.
// Every study/number cites a source listed at the end of its article.
// Run: SANITY_WRITE_TOKEN=xxx node scripts/burnscroll-batch5.mjs
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


  A('apps-that-make-you-exercise-to-unlock-your-phone',
    'Apps That Make You Exercise to Unlock Your Phone (2026)',
    'Apps that make you exercise for screen time, compared: price, how each checks your workout, ratings, and which one fits you. Checked October 2026.',
    ['app that makes you exercise for screen time', 'app that makes you exercise to use your phone', 'exercise to unlock apps', 'pushup app blocker', 'free app that makes you exercise for screen time'],
    {
      apps: {
        caption: 'Exercise-to-unlock apps for iPhone compared',
        headers: ['App', 'Developer', 'Price (US)', 'How it checks your exercise', 'Rating (count)', 'Needs'],
        rows: [
          ['BurnScroll', 'Realm Labs Studio', 'Free download; Lifetime Access $29.99 one-time, no subscription', 'Active calories from Apple Health / Apple Watch (about 100 cal = 20 min)', 'Too new to compare', 'iOS 18.6+'],
          ['Pushscroll: Exercise To Scroll', 'Pushscroll GmbH', 'Free; subscriptions listed from $14.99/month, yearly $24.99 to $59.99', 'Camera pose detection counts reps (pushups, squats, lunges, situps and more); steps via Apple Health', '4.7 (17,878)', 'iOS 16.0+'],
          ['PushUp Time: App Blocker', 'Kaman Labs LLC', 'Free; premium plans listed from $1.99/week to $59.99/year', 'On-device AI counts pushups, squats and sit-ups', '4.7 (11,562)', 'iOS 17+'],
          ['ScrollFit - PushUp App Blocker', 'Raukin LLC', 'Free; plans listed from $3.99/week, including lifetime options up to $39.99', 'On-device pose detection counts pushups or squats', '4.7 (3,210)', 'iOS 17+'],
          ['Unrot: Earn your Screen Time', 'Unrot OU', 'Free download; listing says a subscription is required for its features', 'Timer or photo proof of habits (walks, workouts, chores) earns coins', '4.7 (56,980)', 'iOS 18+'],
          ['Steppin: Steps for Screen Time', 'Boston Venture Studio, Inc.', 'Free; no in-app purchases listed', 'Steps from iPhone / Apple Health (default 1 minute per 100 steps)', '4.5 (156)', 'iOS 18.6+'],
        ],
      },
      methods: {
        caption: 'Three ways these apps verify exercise',
        headers: ['Method', 'Apps', 'Best for', 'Trade-off'],
        rows: [
          ['Camera rep counting', 'Pushscroll, PushUp Time, ScrollFit', 'Quick strength sets at home', 'You need space and a propped-up phone; limited exercise list'],
          ['Steps', 'Steppin (and Pushscroll as an extra)', 'Walkers, desk workers', 'Strength work and cycling barely count'],
          ['Active calories', 'BurnScroll', 'People who already move in many ways', 'Needs Apple Health data; a short pushup set adds few calories'],
          ['Timer or photo habits', 'Unrot', 'Mixing exercise with study or chores', 'Relies more on self-honesty'],
        ],
      },
    },
`**The main apps that make you exercise to unlock your phone in 2026 are Pushscroll, PushUp Time and ScrollFit (camera counts your reps), Steppin (steps), Unrot (timed or photo habits) and BurnScroll (active calories from Apple Health). All are free to download on iPhone, and most list paid upgrades for full features.**
The idea behind every app on this list is the same: your distracting apps stay locked until you move. Instead of a timer you can dismiss, the price of an hour on Instagram or TikTok is a walk, a set of pushups or a sweaty workout. If you trade even 1 to 2 hours of scrolling for movement each day, that adds up to a lot of reclaimed time, as we show in [what happens when you stop scrolling](/burnscroll/articles/what-happens-when-you-stop-scrolling).
We searched the US App Store for terms like "pushups unlock apps", "exercise screen time" and "earn screen time workout", then opened each listing to check the developer, price, in-app purchases, rating and how the app confirms you exercised. Apps with almost no ratings, or that don't lock other apps, were left out.
## Which apps make you exercise to use your phone?
[[TABLE:apps]]
Checked on the US App Store, October 2026.
Prices and ratings change often, so check the listing before you subscribe.
### BurnScroll
BurnScroll is our app, so weigh this entry with that in mind. You pick the apps to block with Apple's Screen Time controls. You earn time back by burning active calories in any exercise, read from Apple Health or your Apple Watch. About 100 active calories buys roughly 20 minutes. It does not count reps or use the camera. Any movement that registers active calories counts, from a run to a bike commute to a dance class. It is the newest app here, without enough ratings yet to compare.
### Pushscroll
Pushscroll uses your camera and pose detection to count reps. Its listing names pushups, squats, lunges, jumping jacks, diamond pushups, squat holds and situps, and says one pushup earns one minute of app time. It can also credit steps through Apple Health and has guided workouts and streaks.
### PushUp Time
PushUp Time locks apps until you finish a set of pushups, squats or sit-ups, counted by on-device AI. You choose an unlock window of 15, 30, 60 or 120 minutes, and it works without internet.
### ScrollFit
ScrollFit counts pushups or squats with pose detection and adds scheduled lock modes, such as a night mode from 11pm to 7am. Its listing stresses there is no skip button and no emergency unlock code, so plan for days you can't exercise.
### Unrot
Unrot is the broadest of the group. You earn coins by finishing habits, confirmed with a timer or a photo, and spend coins to open locked apps. Exercise is one option alongside reading, studying and chores. The listing states that an active subscription is required for the features it describes.
### Steppin
Steppin turns steps into screen time, by default 1 minute for every 100 steps, using your iPhone's step counter and Apple Health. It is the simplest option if walking is your main exercise.
[[CTA||Turn any workout into screen time with BurnScroll.]]
## Camera rep counting vs steps vs calories: which is better?
Each approach checks your effort in a different way, and that changes how the app feels day to day.
[[TABLE:methods]]
**Camera rep counting** is the hardest to fake and the fastest. Ten pushups take under a minute. The downside is that you need room on the floor, decent light and a phone propped at the right angle, and you are limited to the moves the app recognizes. It is also easy to do the same exercise every day, which is fine for a habit but narrow for fitness.
**Steps** are easy and low-impact, and you rack them up without thinking. But steps miss cycling, swimming, weights and most home workouts, and some people end up pacing the kitchen to unlock TikTok.
**Active calories** reward any movement your watch or phone records, so a run, a spin class and yard work all count. The trade-off is that the numbers come from Apple Health estimates, and short strength sets register only a few calories. If pushups are your main move, a rep-counting app will credit them more directly.
## Is there a free app that makes you exercise for screen time?
All six apps are free to download in the US. Steppin listed no in-app purchases when we checked. Pushscroll, PushUp Time and ScrollFit list subscriptions, and ScrollFit also lists lifetime options. Unrot's listing says its features need an active subscription. BurnScroll is free to download and unlocks everything with a one-time $29.99 Lifetime Access purchase, with no subscription. Always open the listing's In-App Purchases section before you commit, because trial terms and prices change.
## How do you choose the right app?
- **You love quick home workouts:** pick a camera rep counter like Pushscroll, PushUp Time or ScrollFit.
- **You mostly walk:** Steppin, or any app that reads steps.
- **You already wear an Apple Watch and move in lots of ways:** a calorie-based app like BurnScroll credits all of it.
- **You want screen time tied to studying or chores too:** Unrot's habit system covers more than exercise.
- **You need a hard lock with no escape:** ScrollFit says it has no skip button. Make sure you are fine with that on sick days.
- **Budget matters:** compare the yearly price, not the weekly one, and cancel any trial you don't plan to keep.
Whatever you pick, start with a modest goal. A rule you can keep on a tired Tuesday beats an ambitious one you delete by Friday. Pair it with the built-in tools in [how to set screen time limits on iPhone](/burnscroll/articles/how-to-set-screen-time-limits-on-iphone) for the apps you don't want gated by exercise.
## Do exercise-to-unlock apps work?
There are no published trials of these specific apps yet, so be wary of big claims on any listing. What we do have is research on the ingredients. In a six-week field study of 280 people, the app one sec, which adds a short pause and a choice before a chosen app opens, led users to back out of about one in three opening attempts (36%) and to try opening those apps 37% less often overall. Exercise-to-unlock apps add a much bigger pause, so the same friction effect is likely at work, plus you get the movement.
For the behavioral science of why making exercise the price of scrolling works, and where it falls short, see [pushups to unlock Instagram](/burnscroll/articles/pushups-to-unlock-instagram). For a wider look at blockers that don't involve exercise, see our [screen time apps comparison](/burnscroll/articles/best-screen-time-apps-compared).
## What about Android?
Every app in our table was checked on iOS only, and BurnScroll is iPhone only. Google Play has its own pushup and step-based app locks, so search there for "pushup app lock" or "earn screen time" and run the same checks: developer, price, in-app purchases and recent reviews.
## Frequently asked questions
### What app makes you exercise to use your phone?
Several iPhone apps do this. Pushscroll, PushUp Time and ScrollFit count pushups or squats with your camera. Steppin unlocks apps with steps. Unrot uses timed or photo-confirmed habits. BurnScroll unlocks apps when you burn active calories recorded by Apple Health or an Apple Watch.
### Is there a free app that makes you exercise for screen time?
All of these apps are free to download in the US. When we checked in October 2026, Steppin listed no in-app purchases, while Pushscroll, PushUp Time, ScrollFit and Unrot listed subscriptions or paid plans, and BurnScroll listed a one-time $29.99 Lifetime Access purchase. Check the In-App Purchases section of each listing for current prices.
### Can you cheat exercise-to-unlock apps?
Camera rep counters are hard to fool because pose detection watches your movement. Step apps can be gamed by pacing or shaking the phone. Calorie apps depend on Apple Health estimates. Any app can also be deleted, so these work best when you choose them as a tool rather than a punishment.
### Do pushups count in a calorie-based app like BurnScroll?
Only through the active calories Apple Health records. BurnScroll does not count reps or use the camera. A short pushup set adds few calories, so most people earn time with longer movement like brisk walking, runs, rides or workout classes.
### How much exercise should I trade for screen time?
Start small enough to keep. A common target is 1 to 2 hours less scrolling a day, earned back with 20 to 30 minutes of movement. In BurnScroll, about 100 active calories earns roughly 20 minutes.
## The takeaway
Pick the method that matches how you already like to move: reps, steps or calories. Start with a goal you can hit on your worst day, check the real price before you subscribe, and let the lock do the work your willpower used to. Even one hour of scrolling traded for movement each day is a big win.
[[CTA||Lock your scroll apps and earn them back by moving with BurnScroll.]]
Sources: [Pushscroll on the App Store](https://apps.apple.com/us/app/pushscroll-exercise-to-scroll/id6741765734), [PushUp Time on the App Store](https://apps.apple.com/us/app/pushup-time-app-blocker/id6749405784), [ScrollFit on the App Store](https://apps.apple.com/us/app/scrollfit-pushup-app-blocker/id6757958485), [Unrot on the App Store](https://apps.apple.com/us/app/unrot-earn-your-screen-time/id6746537171), [Steppin on the App Store](https://apps.apple.com/us/app/steppin-steps-for-screen-time/id6737981423), [Grüning et al., PNAS 2023 (one sec field study)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974409/)
This article is general information, not medical advice.`),

  A('what-happens-when-you-stop-scrolling',
    'What Happens When You Stop Scrolling? A Day-by-Day Look',
    'What happens when you stop scrolling for 1 to 2 hours a day and move instead: a research-backed timeline from day 1 to month 4, plus time you get back.',
    ['what happens when you stop scrolling', 'what happens when you stop using social media', 'quitting reels', 'stop scrolling benefits', 'cut screen time 1 hour a day'],
    {
      timeline: {
        caption: 'What changes when you swap 1 to 2 hours of scrolling for movement',
        headers: ['When', 'What you may notice', 'What the research says'],
        rows: [
          ['Day 1', 'Phantom reaching, restlessness, boredom', 'One movement session can ease short-term anxiety (CDC)'],
          ['Week 1', 'Urges drop, evenings feel longer', 'One hour less phone a day for a week improved wellbeing (Brailovskaia 2022)'],
          ['Week 3', 'Less comparison, steadier mood', 'Social media cut to 30 min/day lowered loneliness and depression (Hunt 2018)'],
          ['Week 4', 'More time with people offline', 'Quitting Facebook for 4 weeks raised wellbeing and offline socializing (Allcott 2020)'],
          ['Month 4', 'New habit holds', 'Phone use stayed about 45 min/day lower; activity and life satisfaction up (Brailovskaia 2022)'],
        ],
      },
      reclaimed: {
        caption: 'Time reclaimed by scrolling less',
        headers: ['Cut per day', 'Per week', 'Per year', 'Equal to'],
        rows: [
          ['30 minutes', '3.5 hours', '182.5 hours', 'About 7.6 full days'],
          ['1 hour', '7 hours', '365 hours', 'About 15 full days'],
          ['1.5 hours', '10.5 hours', '547.5 hours', 'About 23 full days'],
          ['2 hours', '14 hours', '730 hours', 'About 30 full days, or 45 waking days'],
        ],
      },
    },
`**When you stop scrolling for 1 to 2 hours a day, the first change is time: up to 730 hours a year. Mood follows. In trials, people who cut social media to 30 minutes a day felt less lonely and depressed within three weeks, and an hour less phone use a day raised life satisfaction and physical activity.**
You don't have to quit your phone to see these changes. The studies below mostly tested cutting back, not going cold turkey, and the people who cut back by an hour often did as well or better than those who quit completely. The best results come when you fill the freed time with something good for you. Movement is the strongest candidate, because it brings its own measurable benefits on top of the time you save.
Here is what the research says happens, step by step.
## What happens on day 1 when you stop scrolling?
Day 1 is mostly about habit. You will probably reach for your phone in the same spots you always do: in line, on the couch, the moment a task gets hard. That reach is a cue-driven habit, not a sign you are failing. Many people also feel restless or bored, which is normal and even useful, as we explain in [the benefits of boredom](/burnscroll/articles/benefits-of-boredom).
This is where movement earns its place. The CDC says some brain benefits of physical activity show up right after a single session of moderate-to-vigorous activity, including reduced short-term feelings of anxiety in adults. A brisk 20-minute walk in place of a 20-minute scroll gives you something the feed can't: you come back calmer, not more wired.
## What happens after a week without scrolling?
In a 2022 randomized study of 619 people at Ruhr University Bochum, researchers had one group give up their smartphone for a week, another cut use by one hour a day, and a third change nothing. Both changes improved participants' lifestyle and wellbeing. Many people find that by the end of week one the urge to check is weaker and evenings feel longer.
A 2024 study from the same team, with 278 working adults, tested an hour less phone use a day, 30 extra minutes of daily activity, or both, for one week. The phone and combined groups reported better work satisfaction, motivation and mental health, and every intervention reduced depressive symptoms. In other words, less scrolling and more moving each helped, and doing both gave the broadest benefits.
[[TABLE:timeline]]
## What happens after 3 weeks off social media?
The best-known trial here comes from the University of Pennsylvania. 143 students were randomly assigned to keep their usual habits or to limit Facebook, Instagram and Snapchat to 10 minutes per platform per day, about 30 minutes in total, for three weeks. The limited group showed significant drops in depression and loneliness, and the effect was strongest for people who were more depressed at the start.
The researchers point to social comparison as one reason. When you scroll less, you spend less time measuring your life against other people's highlights. If that part resonates, our guide on [how to quit social media or cut way back](/burnscroll/articles/how-to-quit-social-media) covers the practical side.
## What happens after a month?
A large randomized experiment published in the American Economic Review paid people to deactivate Facebook for four weeks before the 2018 US midterms. Compared with the control group, they spent less time online and more time on offline activities, including socializing with family and friends. Their subjective wellbeing rose, and they kept using Facebook less after the experiment ended.
That last part matters. A month is often long enough for a new routine to feel normal, so the old amount of scrolling starts to feel like too much.
## What happens after 4 months?
The Bochum team followed people up four months later. The group that had cut one hour a day was still using their phone about 45 minutes less per day than before, slightly more than the group that had quit entirely (38 minutes). Life satisfaction and time spent being physically active had gone up, while symptoms of depression and anxiety had gone down. As the lead researcher put it, it is not necessary to give up the smartphone completely to feel better.
[[CTA||Earn your scroll time by moving first with BurnScroll.]]
## How much time do you get back?
Here is what cutting scrolling adds up to over a year.
[[TABLE:reclaimed]]
Two hours a day is about a month of 24-hour days every year. Even 30 minutes a day buys back more than a week.
## Why replace scrolling with exercise instead of just quitting?
Removing a habit leaves a gap, and gaps get filled by the next easiest thing, often a different app. Putting movement in that slot works for three reasons:
- **It meets a real need.** The CDC recommends 150 minutes of moderate activity a week for adults, such as 30 minutes a day, five days a week, plus two days of muscle strengthening. Trading 30 minutes of scrolling covers that goal.
- **It helps right away.** Activity can help you feel better and sleep better, and regular activity lowers the risk of depression and anxiety, according to the CDC.
- **It changes how screen time feels.** When you earn your scroll by moving first, the feed stops being the default and becomes a deliberate choice.
If sleep is part of your goal, moving your scroll time away from bed helps too. See [screen time and sleep](/burnscroll/articles/screen-time-and-sleep).
## What doesn't happen when you stop scrolling?
The effects in these studies are real but modest. You won't become a different person in a week, and the trials had limits: the Penn study used college students, and the Bochum studies relied on self-reported wellbeing. Some days you will slip. That is fine. Aim for a steady cut, like the ones in our guide to [limiting screen time to 2 hours](/burnscroll/articles/how-to-limit-screen-time-to-2-hours), rather than a perfect streak.
## How BurnScroll helps
BurnScroll locks the apps you pick, using Apple's Screen Time controls, until you burn active calories through any exercise. It reads them from Apple Health or your Apple Watch, and about 100 active calories earns roughly 20 minutes back. A 20 to 30 minute walk or workout becomes the ticket for your evening scroll, so the swap described in this article happens by default instead of by willpower.
## Frequently asked questions
### What happens to your brain when you stop scrolling?
Early on you feel the habit: urges, restlessness and boredom. Over days to weeks, randomized studies show lower depression and loneliness when social media is cut to about 30 minutes a day, and better wellbeing when phone use drops by one hour a day. Exercise in the freed time adds short-term relief from anxiety.
### How long does it take to feel better after cutting social media?
In the University of Pennsylvania trial, people who limited social media to about 30 minutes a day showed lower depression and loneliness after three weeks. In the Bochum studies, improvements in wellbeing showed up after a one-week reduction of one hour a day.
### Do you have to quit social media completely?
No. In a randomized study of 619 people, cutting smartphone use by one hour a day produced longer-lasting benefits than quitting for a week. Moderate, sustainable limits seem to work at least as well as total abstinence.
### How much time do you save by scrolling 2 hours less a day?
Two hours a day is 14 hours a week and 730 hours a year, roughly 30 full days, or about 45 waking days if you sleep 8 hours a night.
### What should I do instead of scrolling?
Movement is a strong choice: a walk, a workout, a bike ride or a sport. It meets the CDC's activity goals, can reduce short-term anxiety, and helps you sleep. Reading, hobbies and time with people are good swaps too.
## The takeaway
When you stop scrolling for an hour or two a day, you get back weeks of time each year, and research links the change to better mood, less loneliness and more activity. Cutting back works as well as quitting. Fill the gap with movement and the benefits stack.
[[CTA||Trade an hour of scrolling for movement with BurnScroll.]]
Sources: [Penn Today: Hunt et al. 2018 social media limit study](https://penntoday.upenn.edu/news/social-media-use-increases-depression-and-loneliness), [Allcott et al., American Economic Review 2020](https://www.aeaweb.org/articles?id=10.1257/aer.20190658), [ScienceDaily: Brailovskaia et al. 2022 smartphone reduction study](https://www.sciencedaily.com/releases/2022/04/220420133554.htm), [Ruhr University Bochum: less smartphone, more activity (2024)](https://news.rub.de/english/press-releases/2024-09-17-psychology-reducing-smartphone-use-increases-work-satisfaction), [CDC: Benefits of Physical Activity](https://www.cdc.gov/physical-activity-basics/benefits/index.html), [CDC: Adult Activity Guidelines](https://www.cdc.gov/physical-activity-basics/guidelines/adults.html)
This article is general information, not medical advice.`),

  A('pushups-to-unlock-instagram',
    'Pushups to Unlock Instagram (and Your Phone): Does It Work?',
    'Pushups to unlock Instagram: the behavioral science behind it, a pushup-to-minutes chart, how calorie-based unlocking works, and how to set it up safely.',
    ['pushups to unlock instagram', 'pushups to unlock phone', 'pushups for screen time', 'exercise to unlock apps', 'earn screen time with pushups'],
    {
      pushups: {
        caption: 'Pushups-to-minutes ideas (pick one rule and keep it)',
        headers: ['Effort', 'Screen time earned', 'Good for'],
        rows: [
          ['5 knee or wall pushups', '5 minutes', 'Beginners, quick checks'],
          ['10 pushups', '10 minutes', 'A one-to-one starter rule'],
          ['20 pushups (split into sets)', '15 to 20 minutes', 'Building strength'],
          ['3 sets of 10 pushups + 30 squats', '30 minutes', 'A mini circuit before a longer scroll'],
          ['20-minute brisk walk', '20 to 30 minutes', 'Rest days or sore arms'],
        ],
      },
      calories: {
        caption: 'How BurnScroll converts active calories to screen time',
        headers: ['Active calories burned', 'Screen time earned (approx.)', 'What that might look like'],
        rows: [
          ['50', '10 minutes', 'A short brisk walk or quick circuit'],
          ['100', '20 minutes', 'Roughly a 20 to 30 minute brisk walk for many adults'],
          ['200', '40 minutes', 'A gym session or a longer walk'],
          ['300', '60 minutes', 'A run, ride or workout class'],
          ['600', '2 hours', 'A long hike or several sessions in a day'],
        ],
      },
    },
`**Yes, making pushups the price of opening Instagram can work. It adds friction the moment you reach for the app, turns a vague intention into a rule, and pairs something you want with something you should do. Research on app friction and "temptation bundling" backs each part, though the effect fades if the rule is too hard to keep.**
The trend is simple. Your phone locks Instagram, TikTok or YouTube, and you get in by dropping for pushups first. It sounds like a gimmick, but it sits on solid behavioral science. Here is why it works, how to set your exchange rate, and how to do it without hurting yourself.
## Does doing pushups to unlock Instagram work?
For many people, yes, because it tackles the real problem. Most scrolling isn't a decision. It is a reflex triggered by boredom, a notification or an awkward pause, and apps are built to keep that reflex smooth, as we cover in [why apps are so addictive](/burnscroll/articles/why-apps-are-addictive). A pushup gate puts a speed bump in the reflex. Sometimes you do the pushups and scroll. Often you decide it isn't worth it. Either outcome is a win.
There are no published trials of pushup-to-unlock apps yet, so the evidence comes from three proven ingredients: friction, commitment devices and temptation bundling.
## Why does friction make you scroll less?
Small obstacles change behavior more than they seem like they should. In a six-week field study published in PNAS, 280 people used one sec, an app that shows a brief pause and a choice before a chosen app opens. Users backed out of about one in three opening attempts (36%) and tried to open those apps 37% less often overall. A controlled experiment in the same paper found that the option to back out did most of the work, with the time delay also playing a role.
A pushup gate is a much bigger pause than one sec's, and it comes with an obvious choice: do the reps, or put the phone down.
## What are commitment devices and temptation bundling?
A **commitment device** is a rule you set in a calm moment that binds you in a weak one. Locking your own apps until you exercise is a classic example.
**Temptation bundling** means pairing something you crave with something you should do more. In a field experiment by Katherine Milkman and colleagues, people who could only listen to gripping audiobooks at the gym visited the gym 51% more often at first than a control group. A softer version, simply encouraging people to save the audiobooks for the gym, raised visits by 29%. The effects faded over time, especially after Thanksgiving. After the study, 61% of participants chose to pay for gym-only access to the audiobooks, which shows people want this kind of help.
Pushups to unlock Instagram flips the bundle: the treat is the scroll, and the price is the exercise. The same lesson applies. Expect a strong start, then build the rule into a routine so it survives busy weeks. For why movement can beat the feed for a mood lift, see [exercise dopamine vs scrolling](/burnscroll/articles/exercise-dopamine-vs-scrolling).
## How many pushups for how many minutes of screen time?
There is no official exchange rate. The right one is a rule you will keep on a bad day. Use these as starting points.
[[TABLE:pushups]]
A few tips for choosing:
- **Start lower than you think.** If 10 pushups feels easy, keep it anyway for a week. Consistency matters more than difficulty.
- **Earn time in blocks.** Earning 15 to 30 minutes at once beats 2-minute unlocks that keep you dropping to the floor.
- **Cap the day.** Decide your daily maximum, for example 1 hour, so a big workout doesn't turn into a 4-hour scroll.
- **Swap moves.** Squats, lunges or a brisk walk give your shoulders a break.
[[CTA||Make movement the price of scrolling with BurnScroll.]]
## How does BurnScroll unlock apps with exercise?
BurnScroll takes a different route from pushup counters. It does not use the camera or count reps. Instead, you pick the apps to lock, using Apple's Screen Time controls, and earn time back by burning **active calories** through any exercise. It reads those calories from Apple Health or your Apple Watch, and about 100 active calories converts to roughly 20 minutes of screen time.
[[TABLE:calories]]
That means pushups count only through the active calories Apple Health records. A short set adds just a few. To put it in context, Harvard Health lists moderate calisthenics at about 135 to 189 calories per 30 minutes for people weighing 125 to 185 pounds, and those figures include the calories you would burn at rest. Expect your active calories to be lower. So in BurnScroll, a pushup habit works best as part of a longer session: a circuit, a walk, a run or a class. If you want every single rep counted, an app that uses camera rep counting fits better. We compare them in [apps that make you exercise to unlock your phone](/burnscroll/articles/apps-that-make-you-exercise-to-unlock-your-phone).
## How do you set up pushups to unlock Instagram?
- **Pick the right apps.** Lock only the ones you scroll mindlessly, usually Instagram, TikTok, YouTube and one game. Leave maps, messages and banking open.
- **Choose your verification.** Camera rep counting for pushups, steps for walkers, or active calories if you move in many ways.
- **Set a modest exchange rate** from the table above.
- **Set a daily cap** so earned time doesn't balloon.
- **Plan for rest days.** Allow a walk to count, or accept a day with less scrolling.
- **Review after two weeks.** Check your screen time report. If you are scrolling less and moving more, keep it. If you keep overriding the lock, make the rule easier, not harder.
Combine this with other low-effort changes from [how to stop doomscrolling](/burnscroll/articles/how-to-stop-doomscrolling).
## Is it safe to do pushups every time you want your phone?
For most healthy adults, short sets of pushups are safe, but a few cautions apply:
- **Use good form.** Keep a straight line from head to heels and lower with control. Switch to knee or wall pushups if your hips sag.
- **Spread the volume.** The CDC recommends muscle strengthening at least 2 days a week for adults. Daily pushups are fine for many people, but vary moves and take easier days if your shoulders, elbows or wrists ache.
- **Stop if it hurts.** Sharp pain, dizziness or chest pain means stop and get checked.
- **Check with your doctor first** if you are pregnant, recovering from an injury or surgery, or have a heart condition or high blood pressure.
## Frequently asked questions
### Do pushups to unlock Instagram really reduce screen time?
They likely do, because they add friction at the moment you reach for the app. In a PNAS study of the friction app one sec, users backed out of 36% of opening attempts and tried to open target apps 37% less often. A pushup gate is a bigger pause, so many attempts end with the phone down.
### How many pushups should I do for 10 minutes of screen time?
There is no standard rule. A simple start is one pushup per minute, so 10 pushups for 10 minutes, or 5 knee pushups if you are a beginner. Pick a rate you can keep daily and set a daily cap.
### Does BurnScroll count pushups?
Not directly. BurnScroll does not use the camera or count reps. It unlocks apps based on active calories recorded in Apple Health or by an Apple Watch, about 100 active calories for roughly 20 minutes. Pushups add calories, but longer sessions earn most of the time.
### Is it bad to do pushups every day?
For most healthy adults, daily short sets are fine with good form. The CDC recommends muscle strengthening at least 2 days a week. Vary your moves, rest when joints ache, and check with a doctor if you have a heart condition, injury or are pregnant.
### What if I can't exercise one day?
Plan for it. Let a short walk count, lower your rate on sick days, or accept a day with less scrolling. A rule that bends a little lasts longer than one you abandon.
## The takeaway
Pushups to unlock Instagram works because it combines friction, a commitment you set in advance and a built-in reward. Keep the exchange rate easy, cap your daily scroll, mix your moves, and the swap from scrolling to moving becomes automatic.
[[CTA||Lock Instagram and earn it back by moving with BurnScroll.]]
Sources: [Grüning et al., PNAS 2023 (one sec field study)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974409/), [Milkman et al., Holding the Hunger Games Hostage at the Gym](https://pmc.ncbi.nlm.nih.gov/articles/PMC4381662/), [Harvard Health: Calories burned in 30 minutes](https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights), [CDC: Adult Activity Guidelines](https://www.cdc.gov/physical-activity-basics/guidelines/adults.html)
This article is general information, not medical advice.`),

  A('earn-screen-time-chart',
    'Earn Screen Time Chart: Free Printable for Kids (Exercise)',
    'A free earn screen time chart for kids: activity-to-minutes table, daily caps by age based on WHO and AAP guidance, plus how to roll it out without fights.',
    ['earn screen time chart', 'earn screen time chart printable', 'screen time chart for kids', 'exercise for screen time kids', 'earn screen time ideas'],
    {
      chart: {
        caption: 'Earn screen time chart (print this table or copy it to the fridge)',
        headers: ['Activity', 'Time spent', 'Screen minutes earned', 'Notes'],
        rows: [
          ['Outdoor play (tag, playground, ball games)', '30 min', '30 min', 'The backbone of the chart'],
          ['Bike, scooter or skateboard ride', '20 min', '20 min', 'Helmet on'],
          ['Walk the dog or family walk', '20 min', '20 min', 'Bonus 10 min if a parent joins'],
          ['Dance party or jump rope', '10 min', '10 min', 'Great for rainy days'],
          ['Pushups, climbing or squats', '10 min', '10 min', 'Counts toward muscle strengthening'],
          ['Sports practice or team game', '60 min', '30 min', 'Already active; half credit keeps caps sane'],
          ['Active chores (raking, vacuuming, carrying groceries)', '15 min', '10 min', 'Moving, not sitting'],
          ['Swimming or a fitness class', '30 min', '30 min', 'Any pace counts'],
        ],
      },
      caps: {
        caption: 'Daily caps by age: official guidance and a suggested chart cap',
        headers: ['Age', 'What the guidance says', 'Daily activity goal', 'Suggested chart cap (our starting point)'],
        rows: [
          ['Under 2', 'WHO: screen time not recommended for 1-year-olds', 'Active play through the day', 'Don\'t use a chart'],
          ['2 to 4', 'WHO: no more than 1 hour; less is better', '180 min of activity, 60 of it energetic (ages 3 to 4)', 'Don\'t use earning; keep a simple routine under 1 hour'],
          ['5 to 8', 'AAP: consistent routines and time limits via a family media plan', 'At least 60 min (CDC, ages 6+)', '1 hour on school days, up to 1.5 on weekends'],
          ['9 to 12', 'AAP: family media plan; protect sleep, activity and homework', 'At least 60 min (CDC)', '1 to 1.5 hours on school days, up to 2 on weekends'],
          ['13 to 17', 'AAP: family media plan and open conversations', 'At least 60 min (CDC)', 'Up to 2 hours of recreational time, agreed together'],
        ],
      },
    },
`**An earn screen time chart lets kids trade active play for screen minutes, usually 1 minute of movement for 1 minute of screens, up to a daily cap. For ages 6 to 17, build it around the CDC's 60 minutes of daily activity, keep caps age-appropriate, and leave homework and sleep out of the deal.**
If screen time battles are a daily thing in your house, a chart can take the arguing out of it. The rule is visible, the same every day, and in your child's control: move first, then screens. The table below is ready to print or copy onto a whiteboard.
The timing is good. WHO reports that 81% of adolescents aged 11 to 17 worldwide don't get enough physical activity. A chart that turns scroll time into play time tackles both problems at once.
## What is an earn screen time chart?
It is a simple list of activities and the screen minutes each one earns. Your child does the activity, marks it, and gets the minutes, up to a daily cap you set. Done well, it shifts the default from "screens unless someone says stop" to "move first, then choose."
## Free printable earn screen time chart
[[TABLE:chart]]
Print this page, or copy the table onto a sheet with columns for each day of the week. Add a checkbox per activity, and a line at the bottom for "Minutes earned today" and "Minutes used."
## How much screen time should kids have by age?
The official guidance is clearest for young children. The WHO says screen time isn't recommended for 1-year-olds, and children aged 2 to 4 should have no more than 1 hour of sedentary screen time a day, with less being better. For school-age kids and teens, the American Academy of Pediatrics doesn't set one number. It recommends a family media plan, with screen-free times and places like meals and bedtime, and consistent routines and limits for younger children.
Activity is clearer. The CDC says children and teens aged 6 to 17 need at least 60 minutes of moderate-to-vigorous activity every day, mostly aerobic, with vigorous activity, muscle strengthening (like climbing or pushups) and bone strengthening (like jumping or running) each on at least 3 days a week.
[[TABLE:caps]]
The suggested caps are our starting points for a chart, not official limits. Adjust for your child, your schedule and your values. For the little ones, see [screen time for toddlers](/burnscroll/articles/screen-time-for-toddlers).
## How do you roll out a screen time chart?
- **Make the plan together.** The AAP recommends building a family media plan with your kids. Ask them which activities they would like on the chart. Buy-in beats enforcement.
- **Set the cap first.** Decide the daily maximum before anyone earns a minute, so a three-hour soccer tournament doesn't turn into a three-hour game marathon.
- **Keep some screen time free.** Homework, video calls with grandparents and creative projects shouldn't need earning.
- **Pick a tracking method.** A fridge chart and stickers for younger kids. A shared note or whiteboard for older ones.
- **Start with a trial week.** Tell your kids you will review it together on Sunday and fix anything that feels unfair.
- **Join in.** A family walk earns everyone minutes and shows that the rule isn't just for kids. Ideas in [screen-free family time](/burnscroll/articles/screen-free-family-time).
[[CTA||Want the same rule for your own phone? Try BurnScroll.]]
## What are the common pitfalls?
- **Making screens the ultimate prize.** If every good thing earns screens, screens start to feel like the most valuable thing in the house. Keep praise, outdoor time and family fun as rewards in their own right.
- **No daily cap.** Earning without a ceiling just moves the problem. Unused minutes shouldn't roll over indefinitely either; a weekly reset keeps it simple.
- **Counting the wrong things.** Sitting chores and homework don't build the 60 minutes kids need. Keep the chart about movement.
- **Ignoring sleep.** No amount of earned time should push into bedtime. The AAP lists media that interferes with physical activity, healthy eating or bedtime as a red flag at any age.
- **Inconsistency.** A chart that is enforced on Monday and forgotten by Thursday teaches kids to wait you out.
- **Punishing slips with big losses.** Small, predictable consequences work better than dramatic ones.
## How do you adapt the chart for teens?
Teens push back on charts that feel babyish. Make it a negotiated agreement instead: an amount of daily activity they choose, an agreed cap on recreational scrolling, and phones out of the bedroom at night. Movement also helps the brain. The CDC notes that right after a session of moderate-to-vigorous activity, children aged 6 to 13 show improved thinking, which makes a quick workout before homework a smart habit; see [exercise before studying](/burnscroll/articles/exercise-before-studying). If your teen's phone use already feels out of control, read our [parent guide to teen phone addiction](/burnscroll/articles/teen-phone-addiction).
## Can an app enforce earn-your-screen-time?
BurnScroll is built for the person who owns the iPhone, so it suits teens with their own iPhone who want to take part, and parents who want to model the habit. It is not a parental-control app. On their own phone, your teen picks the apps to lock, such as TikTok, Instagram or games. They burn active calories in any exercise, read from Apple Health or an Apple Watch, and about 100 active calories unlocks roughly 20 minutes. It works best when your teen chooses it as part of your family agreement, not as a punishment.
## Frequently asked questions
### What is a good earn screen time chart ratio?
A 1-to-1 ratio, one minute of active play for one minute of screen time, is easy for kids to understand. Give half credit for long activities like sports practice so daily caps stay reasonable, and set the cap before anyone starts earning.
### How much screen time should a 10-year-old have?
The AAP doesn't set a single number for school-age children. It recommends a family media plan that protects sleep, physical activity, homework and family time. Many families start around 1 to 1.5 hours of recreational screen time on school days, alongside at least 60 minutes of daily activity as the CDC recommends.
### How much exercise do kids need each day?
The CDC says children and teens aged 6 to 17 need at least 60 minutes of moderate-to-vigorous physical activity every day. Muscle-strengthening and bone-strengthening activities should each be included at least 3 days a week.
### Should homework count on an earn screen time chart?
Most families keep homework and schoolwork separate. Computers used for school shouldn't need earning, and the chart works best when it focuses only on movement and play.
### Do earn screen time charts work for teens?
They work better as a negotiated agreement than a sticker chart. Let teens choose their activities, agree on a daily cap and phone-free bedtime together, and review it every few weeks.
## The takeaway
A good earn screen time chart is simple: movement first, a clear daily cap, and sleep protected. Build it with your kids, start with a one-week trial, and adjust as you go. The real win isn't fewer minutes on a screen, it is more minutes spent moving.
[[CTA||Help your teen earn screen time by moving with BurnScroll.]]
Sources: [CDC: Child Activity Overview](https://www.cdc.gov/physical-activity-basics/guidelines/children.html), [WHO: Children need to sit less and play more (2019)](https://www.who.int/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more), [WHO: Physical activity fact sheet](https://www.who.int/news-room/fact-sheets/detail/physical-activity), [HealthyChildren.org (AAP): Kids and Tech Tips for Parents](https://www.healthychildren.org/English/family-life/Media/Pages/Tips-for-Parents-Digital-Age.aspx), [HealthyChildren.org (AAP): How to Make a Family Media Plan](https://www.healthychildren.org/English/family-life/Media/Pages/How-to-Make-a-Family-Media-Use-Plan.aspx), [CDC: Benefits of Physical Activity](https://www.cdc.gov/physical-activity-basics/benefits/index.html)
This article is general information, not medical advice.`),

  A('how-to-fix-brain-rot',
    'How to Fix Brain Rot: A 2-Week Reset Plan That Works',
    'How to fix brain rot: what it is, what research says about short-form video and attention, and a 2-week plan that swaps scrolling for movement.',
    ['how to fix brain rot', 'how to cure brain rot', 'brain rot', 'brain rot from tiktok', 'how to reset your brain from scrolling'],
    {
      daily: {
        caption: 'The daily brain rot reset plan',
        headers: ['Time of day', 'What to do', 'What it replaces'],
        rows: [
          ['Wake up', 'No phone for the first 30 minutes; water, light, stretch', 'Checking feeds in bed'],
          ['Morning', '10 to 20 minute walk or quick workout', 'Morning scroll with coffee'],
          ['Work or study', '25 to 50 minute focus blocks, phone in another room', 'Constant checking'],
          ['Midday', '5 to 10 minute movement break between blocks', 'Lunchtime reels'],
          ['After work or school', '30 to 60 minutes of real exercise', 'The longest scroll of the day'],
          ['Evening', 'One long-form thing: a book, a film, a hobby, a call', 'Short-form video'],
          ['Bedtime', 'Phone charging outside the bedroom', 'Scrolling in bed'],
        ],
      },
      weeks: {
        caption: 'Two-week progression',
        headers: ['Days', 'Scrolling cut', 'Movement added', 'Focus goal'],
        rows: [
          ['1 to 3', '30 minutes less per day', '15 to 20 minute walk', 'Track urges, don\'t fight them'],
          ['4 to 7', '1 hour less per day', '30 minutes daily', 'Two focus blocks a day'],
          ['8 to 11', '1.5 hours less per day', '30 to 45 minutes daily', 'Read 20 pages or similar'],
          ['12 to 14', '2 hours less per day', '45 to 60 minutes daily', 'Keep what worked; set your long-term limit'],
        ],
      },
    },
`**To fix brain rot, cut 1 to 2 hours of short-form scrolling a day and fill that time with movement and longer-focus activities. Brain rot isn't a diagnosis, but heavy short-form video use is linked to weaker attention, and exercise gives fast, measurable boosts to thinking. A 2-week reset is enough to feel the difference.**
If you have noticed that you can't finish an article, watch a film without checking your phone, or sit with a thought for more than a few seconds, you are not alone. The good news is that attention is a habit as much as a trait, and habits can be retrained. Here is what brain rot means, what the research says, and a simple plan to reset.
## What is brain rot?
Oxford University Press named "brain rot" its Word of the Year for 2024. It defines the term as "the supposed deterioration of a person's mental or intellectual state, especially viewed as the result of overconsumption of material (now particularly online content) considered to be trivial or unchallenging." Use of the term rose by 230% between 2023 and 2024.
The phrase isn't new. Its first recorded use is in Henry David Thoreau's Walden in 1854, where he criticized a society that favored simple ideas over complex ones. What is new is the scale: feeds that serve an endless stream of short clips, each designed to grab you in the first second.
## Is brain rot real?
"Brain rot" is slang, not a medical condition, and no study measures it directly. But researchers have studied what heavy short-form video use is linked to. A 2025 meta-analysis in Psychological Bulletin pooled data from 98,299 participants across 71 studies. Heavier short-form video use was associated with poorer cognition overall, with the strongest links for attention and inhibitory control, the ability to resist an impulse. It was also linked, more weakly, to poorer mental health, especially stress and anxiety. The findings held across youth and adults and across platforms.
Two caveats matter. These are associations, so they can't prove that the videos cause the problems; people who already struggle with attention may scroll more. And many of the studies relied on self-reported measures. Still, the pattern lines up with what many people feel. For more on how the format works on your attention, read [short-form video and your brain](/burnscroll/articles/short-form-video-and-your-brain).
## What are the signs of brain rot?
- You reach for your phone during any pause, even a few seconds long.
- Long videos, books or conversations feel hard to sit through.
- You open an app, close it, and open it again without noticing.
- You feel foggy, restless or flat after a long scroll.
- Your sleep slips because the scroll runs late.
If several of these fit, the reset below is for you. If you also feel persistently low, anxious, or struggle to function at work or school, talk to a doctor or mental health professional.
## How do you fix brain rot?
The fix has two parts: take away the input that trains short attention, and add the activities that train it back.
**Cut the scroll, not the phone.** In a randomized study of 619 people, cutting smartphone use by one hour a day improved wellbeing, and those benefits lasted longer than in a group that quit for a week. Four months later, the reduction group still used their phones about 45 minutes less per day, with more physical activity and fewer symptoms of depression and anxiety.
**Move instead.** A review of the evidence behind the 2018 Physical Activity Guidelines for Americans found strong evidence that single bouts of moderate-to-vigorous activity produce short-term benefits for cognition after exercise. It found moderate evidence from randomized trials that regular activity improves processing speed, memory and executive function. The CDC adds that physical activity can reduce short-term feelings of anxiety and help you sleep better.
That makes movement a near-perfect swap. The feed fragments your attention; a walk or workout leaves you sharper and calmer.
[[CTA||Swap your scroll time for movement with BurnScroll.]]
## The 2-week brain rot reset plan
This plan cuts scrolling gradually, from 30 minutes to 2 hours a day, and replaces it with movement and focus.
[[TABLE:weeks]]
Each day follows the same rhythm:
[[TABLE:daily]]
A few rules make it stick:
- **Remove the easy path.** Move short-video apps off your home screen and turn off their notifications.
- **Make movement the gate.** Decide that the evening scroll comes only after you move. Short bursts count too; see [exercise snacks](/burnscroll/articles/exercise-snacks).
- **Fill the gap on purpose.** Have a book, a podcast or a hobby ready, so boredom has somewhere to go.
- **Don't aim for zero.** The goal is a lower, chosen amount, not a total ban that collapses by day four.
- **Write down one thing each night** you did with the reclaimed time. It makes the progress visible.
## What should you expect during the reset?
Days 1 to 3 are the hardest. You will feel the pull of the phone in every pause, and that is the habit, not a lack of willpower. By the end of the first week, many people find the urges are quieter. In week two, longer tasks start to feel easier, and the reclaimed time shows up as real things: a finished book, a new running route, a full night of sleep. For more ways to train attention, see [how to improve focus](/burnscroll/articles/how-to-improve-focus). For what research says happens over the following months, read [what happens when you stop scrolling](/burnscroll/articles/what-happens-when-you-stop-scrolling).
## Does a dopamine detox fix brain rot?
A full "dopamine detox" isn't needed and the name oversells the science. A steady cut in scrolling, paired with activities that reward effort, does the same job in a way you can keep. We break down the claims in [dopamine detox: what it is](/burnscroll/articles/dopamine-detox).
## How BurnScroll helps
BurnScroll locks the apps you choose, such as TikTok, Instagram or YouTube, using Apple's Screen Time controls. You earn time back by burning active calories in any exercise, read from Apple Health or your Apple Watch. About 100 active calories earns roughly 20 minutes. That builds the reset's key rule into your phone: move first, then scroll, with less scroll time left over.
## Frequently asked questions
### What is brain rot?
Brain rot is slang for the supposed decline of a person's mental or intellectual state from overconsuming trivial or unchallenging content, especially online. Oxford University Press named it Word of the Year for 2024 after use of the term rose 230% in a year. It is not a medical diagnosis.
### How long does it take to fix brain rot?
Many people notice quieter urges within a week and easier focus within two. In a randomized study, cutting phone use by one hour a day for one week improved wellbeing, and the benefits were still present four months later.
### Can short-form videos damage your attention span?
A 2025 meta-analysis of 71 studies and 98,299 participants found that heavier short-form video use is linked to poorer attention and inhibitory control. The studies show association, not proof of cause, but cutting back is a low-risk step.
### Does exercise help brain fog from scrolling?
Exercise is one of the best-supported ways to sharpen thinking. A review for the US Physical Activity Guidelines found strong evidence that a single bout of moderate-to-vigorous activity gives short-term cognitive benefits, and regular activity improves memory, processing speed and executive function.
### Do I have to delete TikTok to fix brain rot?
No. Cutting back works. Lowering use by 1 to 2 hours a day, keeping short-video apps off your home screen, and earning scroll time with movement is easier to sustain than deleting apps you will reinstall next week.
## The takeaway
Brain rot is slang, but the problem behind it is real: heavy short-form scrolling is linked to weaker attention. Cut 1 to 2 hours of scrolling over two weeks, put movement in its place, and protect your sleep. Attention is trainable, and your reclaimed hours are where you train it.
[[CTA||Start your 2-week reset with BurnScroll.]]
Sources: [Oxford University Press: Brain rot, Word of the Year 2024](https://corp.oup.com/news/brain-rot-named-oxford-word-of-the-year-2024/), [Nguyen et al., Psychological Bulletin 2025 (abstract)](https://ifp.nyu.edu/2025/journal-article-abstracts/bul0000498/), [Erickson et al., Physical Activity, Cognition, and Brain Outcomes (2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6527141/), [CDC: Benefits of Physical Activity](https://www.cdc.gov/physical-activity-basics/benefits/index.html), [ScienceDaily: Brailovskaia et al. 2022 smartphone reduction study](https://www.sciencedaily.com/releases/2022/04/220420133554.htm)
This article is general information, not medical advice.`),


  A('exercise-snacks',
    'Exercise Snacks: 10 Examples, Benefits and the Research',
    'Exercise snacks are 1 to 5 minute bursts of movement. See the stair-climbing and VILPA research, 10 snack ideas, and how to swap phone breaks for them.',
    ['exercise snacks', 'exercise snacks examples', 'exercise snacking', 'vigorous intermittent lifestyle physical activity', 'short bursts of exercise'],
    {
      snacks: {
        caption: 'Effort levels use MET values from the 2024 Adult Compendium of Physical Activities. 1 MET is the energy you burn sitting quietly.',
        headers: ['Exercise snack', 'Time', 'Rough effort'],
        rows: [
          ['Climb 3 flights of stairs, fast', '1 to 2 min', 'Vigorous (stair climbing, fast: 9.3 METs)'],
          ['Jumping jacks', '1 min', 'Vigorous (vigorous calisthenics: 7.5 METs)'],
          ['Burpees, at your own pace', '1 min', 'Vigorous (vigorous calisthenics: 7.5 METs)'],
          ['Jump rope (real or imaginary)', '1 to 2 min', 'Vigorous (rope skipping: 11.0 METs)'],
          ['Pushups (wall, knee or full)', '1 min', 'Moderate to vigorous (calisthenics: 3.8 to 7.5 METs)'],
          ['Bodyweight squats or lunges', '2 min', 'Moderate (moderate calisthenics: 3.8 METs)'],
          ['Brisk walk around the block', '5 min', 'Moderate (brisk walking, 3.5 to 3.9 mph: 4.8 METs)'],
          ['Pace fast while you take a call', '5 min', 'Moderate (walking, 2.8 to 3.4 mph: 3.8 METs)'],
          ['Plank plus crunches', '1 to 2 min', 'Light (light calisthenics: 2.8 METs)'],
          ['Stretch and mobility flow', '3 min', 'Light (stretching, mild: 2.3 METs)'],
        ],
      },
    },
`**Exercise snacks are short bursts of movement, usually 1 to 5 minutes, spread through your day: a fast stair climb, a minute of jumping jacks, a brisk walk. Research links a few 1 to 2 minute vigorous bursts a day with better fitness and lower health risks, and they fit the moments you'd normally spend on your phone.**
Most people don't skip exercise because they hate it. They skip it because a 45-minute workout feels impossible on a busy day. Exercise snacks remove that barrier. You don't change clothes, you don't drive anywhere, and you're done before your coffee cools.
They also solve a second problem. The small gaps in your day, waiting for a meeting, a break between tasks, the minute after you finish lunch, are where most mindless scrolling happens. Fill a few of those gaps with movement and you get two wins at once: more activity and less feed.
## What are exercise snacks?
An exercise snack is any short, deliberate bout of movement, usually done at a moderate to vigorous effort. Researchers also use the term VILPA, short for vigorous intermittent lifestyle physical activity. That describes brief, hard bursts that are part of normal life, like charging up the stairs or walking very fast to catch a bus.
What matters is effort, not equipment. A snack should make you breathe harder than usual for a minute or two. If you can sing while doing it, push a little more. If you can't talk at all, ease off.
## What does the research say about exercise snacks?
The evidence is newer than for traditional workouts, but it's encouraging.
### The stair-climbing study
In a small 2019 study from McMaster University, sedentary young adults climbed a 3-flight stairwell (60 steps) vigorously, 3 times a day with 1 to 4 hours between climbs, 3 days a week for 6 weeks. Compared with a group that didn't train, the climbers had higher peak oxygen uptake afterward, a standard measure of cardio fitness. The authors noted the gain was modest. Still, that's real fitness from roughly a minute of stairs at a time.
### The VILPA study
A 2022 study in Nature Medicine used wrist-worn activity trackers on 25,241 adults in the UK Biobank who said they didn't exercise. Over about 7 years of follow-up, people who did a median of 3 short vigorous bursts a day (each lasting 1 or 2 minutes) had a 38 to 40% lower risk of death from any cause and from cancer, and a 48 to 49% lower risk of death from heart disease, compared with people who did none. This was an observational study, so it shows a link rather than proof of cause. But the size of the link for so little time caught researchers' attention.
### Breaking up sitting
A small Columbia University trial had 11 adults sit for 8 hours on different days, testing different movement breaks. Walking for 5 minutes every 30 minutes cut blood sugar spikes after big meals by 58% compared with sitting all day. All of the walking schedules lowered blood pressure by 4 to 5 mmHg, and most improved mood and reduced fatigue.
## Do exercise snacks count toward the 150 minutes?
Yes. US adults are advised to get at least 150 minutes of moderate activity a week. The first edition of the Physical Activity Guidelines for Americans said only bouts of 10 minutes or more counted. The 2018 second edition removed that rule, so short bouts add up toward your weekly total.
That doesn't mean a few minutes a day replaces everything. It means you no longer have an excuse to do nothing on a busy day.
## 10 exercise snack ideas
Pick two or three you like and keep them on rotation. The best snack is the one you'll do with no warm-up and no special gear.
[[TABLE:snacks]]
If you have a heart condition, joint problems or haven't been active in a while, start with the light and moderate options and check with your doctor before adding vigorous ones.
## Why swap phone breaks for exercise snacks?
Think about your current breaks. You finish a task, pick up the phone, and 15 minutes disappear into a feed. You come back to work feeling no more rested. Swapping even some of those breaks for movement changes three things.
- **You get the activity you keep postponing.** Three or four snacks a day add up to a meaningful chunk of your weekly minutes.
- **You come back clearer.** A break that gets your heart rate up gives you a real reset, which is why we suggest movement in [exercise before studying](/burnscroll/articles/exercise-before-studying).
- **You break the reflex.** Every time you move instead of scroll, the automatic reach for the phone gets a little weaker. That's the core idea behind [how to stop doomscrolling](/burnscroll/articles/how-to-stop-doomscrolling).
[[CTA||Turn your breaks into movement and earn your screen time back.]]
## How do you build the habit?
The easiest way is a simple rule: **every time you reach for your phone on a break, do a snack first.** Here's how to make that stick.
- **Pick your anchors.** Choose 3 moments that happen every day, such as after you get to work, after lunch and mid-afternoon. Those are your snack slots.
- **Decide the snack in advance.** "Stairs after lunch" works better than "some exercise at some point."
- **Make it visible.** Leave a jump rope by your desk or put a sticky note on your laptop.
- **Keep it tiny on bad days.** One minute of squats still counts. Consistency beats intensity.
- **Stack it with something you already do.** Pushups while the kettle boils. A brisk lap while you wait for a call to start.
## How do exercise snacks add up in BurnScroll?
BurnScroll locks the apps you choose to block, such as Instagram, TikTok or games, until you earn the time back with movement. It reads the **active calories** recorded in Apple Health, including from an Apple Watch, and converts them to screen time: about **100 active calories for roughly 20 minutes**. It doesn't count reps or watch you exercise. Any movement that registers active calories counts.
That makes exercise snacks a natural fit. Using the Compendium MET values and a rough formula (MET minus 1, times body weight in kg, times hours), a 70 kg (154 lb) person burns roughly 19 active calories in 2 minutes of fast stairs and roughly 22 in a 5-minute brisk walk. Five snacks like that land near 100 active calories, or about 20 minutes of screen time. Your own numbers will differ with your body and your device, but the pattern holds: small bursts add up. See the [earn screen time chart](/burnscroll/articles/earn-screen-time-chart) for more examples, or see how a set of pushups fits in with [pushups to unlock Instagram](/burnscroll/articles/pushups-to-unlock-instagram).
## Frequently asked questions
### What are some examples of exercise snacks?
Common exercise snacks include climbing a few flights of stairs quickly, a minute of jumping jacks or burpees, a set of pushups or squats, a minute of jump rope and a 5-minute brisk walk. Any activity that raises your breathing for 1 to 5 minutes and needs no setup works. The best choice is the one you can do right where you are.
### How long is an exercise snack?
Most exercise snacks last 1 to 5 minutes. In research, vigorous bursts as short as 1 to 2 minutes have been linked with health benefits, and a stair-climbing study used single climbs of 60 steps. Short is the point: the snack should be easy to start and easy to finish.
### Are exercise snacks as good as a full workout?
Not exactly, but they're far better than nothing. Studies link short vigorous bursts with better fitness and lower health risks, and US guidelines now count bouts of any length toward the 150 weekly minutes. If you enjoy longer workouts, keep them. Snacks fill the gaps on days you can't fit one in.
### How many exercise snacks should I do a day?
In the large 2022 VILPA study, the median was 3 short vigorous bursts a day, and that level was linked with lower risk. That's a reasonable starting target. Add more as they become habit, and mix in a longer walk or workout when you can.
### Can exercise snacks help me use my phone less?
Yes, if you use them to replace phone breaks. When you do a snack each time you reach for your phone on a break, you interrupt the scrolling habit and get active at the same time. Apps that tie screen time to movement make the swap automatic.
## The takeaway
Exercise snacks are 1 to 5 minute bursts of movement, and the research on them is promising: better fitness from stair climbs, lower risk linked to a few vigorous bursts a day, and healthier blood sugar from breaking up sitting. The simplest way to fit them in is to use the moments you'd normally spend scrolling. Reach for your phone, do a snack instead.
[[CTA||Earn your screen time with exercise snacks.]]
Sources: [Stamatakis et al., Nature Medicine 2022](https://www.nature.com/articles/s41591-022-02100-x), [Jenkins et al., Applied Physiology, Nutrition, and Metabolism 2019](https://pubmed.ncbi.nlm.nih.gov/30649897/), [Columbia University Irving Medical Center](https://www.cuimc.columbia.edu/news/rx-prolonged-sitting-five-minute-stroll-every-half-hour), [ODPHP Physical Activity Guidelines for Americans](https://odphp.health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines/current-guidelines/top-10-things-know), [2024 Adult Compendium of Physical Activities](https://pacompendium.com/adult-compendium/)
This article is general information, not medical advice.`),

  A('how-to-limit-screen-time-to-2-hours',
    'How to Limit Screen Time to 2 Hours a Day: A 5-Step Plan',
    'How to limit screen time to 2 hours a day: where the 2-hour rule comes from, a 5-step iPhone plan, and a sample day that fits the budget.',
    ['how to limit screen time to 2 hours', '2 hours screen time per day', '2 hour screen time rule', 'limit screen time', 'daily screen time limit'],
    {
      sampleDay: {
        caption: 'One sample weekday. Leisure screen time only: work, school and texts for logistics are not counted.',
        headers: ['Time', 'Leisure screen time', 'Movement', 'Running total'],
        rows: [
          ['7:00 am', 'None. Phone charges outside the bedroom.', '10-minute walk before breakfast', '0 min'],
          ['12:30 pm', '20 min social media after eating', '10-minute walk first', '20 min'],
          ['3:00 pm', 'None. Break is a stair climb, not a feed.', '2 minutes of stairs', '20 min'],
          ['5:30 pm', '30 min YouTube', '30-minute bike ride or brisk walk', '50 min'],
          ['7:00 pm', 'None. Phones away at dinner.', 'Short walk after dinner', '50 min'],
          ['8:00 pm', '45 min show or games', 'None', '95 min'],
          ['9:30 pm', '15 min social and messages', 'None', '110 min'],
          ['10:00 pm', 'Phone out of the bedroom', 'None', '110 min (10 min spare)'],
        ],
      },
    },
`**To limit screen time to 2 hours a day, measure your current use, set a 120-minute budget for leisure apps only, split it into blocks, gate the most tempting apps behind something you have to do first (like movement), and replace your scrolling cues with a default activity. Expect it to take a few weeks.**
Two hours a day sounds simple. For most people, it's a big cut. The good news is that you don't need perfect willpower. You need a budget you can see, a few rules that run automatically, and a better thing to do in the moments you'd normally reach for your phone.
This plan is built for adults who want to cut back on leisure scrolling, and for parents helping a teen do the same.
## Where does the 2-hour screen time rule come from?
The best-known source is the Canadian 24-Hour Movement Guidelines for Children and Youth, which cover ages 5 to 17. They recommend **no more than 2 hours a day of recreational screen time**, along with at least 60 minutes a day of moderate to vigorous physical activity.
For adults 18 to 64, the Canadian guidelines set a looser limit: no more than 3 hours a day of recreational screen time, no more than 8 hours of total sedentary time, and at least 150 minutes a week of moderate to vigorous activity. So for adults, 2 hours is a stricter, self-chosen target rather than an official rule. It's a reasonable one if scrolling is crowding out sleep, exercise or the people around you.
## How much screen time do people have now?
A lot more than 2 hours. Common Sense Media found that in 2021, US teens averaged 8 hours and 39 minutes a day of entertainment screen use, and tweens averaged 5 hours and 33 minutes. Those figures exclude screens used for school or homework.
If your own number is far above 2 hours, don't try to hit the target on day one. Cut in steps, such as 30 minutes less each week, so the change sticks. For a broader look at what counts as too much, see [how much screen time is too much](/burnscroll/articles/how-much-screen-time-is-too-much).
## What counts toward the 2 hours?
The guidelines talk about recreational screen time. That's the part of your day you choose for entertainment: social media, short videos, streaming shows, games and browsing for fun. It includes the TV, not just your phone.
It doesn't include work, school, navigation or quick messages to sort out plans. Be honest about the gray areas. If "checking email" turns into 20 minutes of browsing, that 20 minutes counts.
## How do you limit screen time to 2 hours a day?
### Step 1: Measure your baseline
On iPhone, open **Settings, then Screen Time**, and tap your daily average to see a day or week of use (on older iOS versions, tap See All App & Website Activity). Note three things: total daily time, your top 3 apps, and how many times you pick up your phone. Write them down. That's your starting point.
### Step 2: Set a 120-minute budget and split it
A single 2-hour pool tends to vanish by lunch. Split it by app type instead. For example: 45 minutes for social media, 45 minutes for video and streaming, 30 minutes for games or anything else. Leave 10 minutes as a buffer so one long video doesn't wreck the whole day.
### Step 3: Set limits in Screen Time
In Screen Time, use Time Allowances (called App Limits on older iOS versions) to set daily caps that match your budget. Add a schedule for the hour before bed (Screen Time Schedule, or Downtime on older iOS versions). Our guide on [how to set screen time limits on iPhone](/burnscroll/articles/how-to-set-screen-time-limits-on-iphone) walks through each option. The catch is that built-in limits are easy to tap past when you're tired or bored.
### Step 4: Gate your worst apps behind movement
This is where most plans either hold or fail. A limit you can dismiss in one tap doesn't change much. A limit that asks you to do something first does. With BurnScroll, the apps you pick stay locked until you earn time with active calories: about 100 active calories for roughly 20 minutes of screen time. A full 2 hours works out to about 600 active calories. That price makes you decide whether the next 20 minutes is worth it, and it means the time you do spend is paid for with movement.
[[CTA||Lock your feeds and earn your 2 hours with movement.]]
### Step 5: Replace the cue, not just the app
Every scrolling session starts with a cue: waiting in line, sitting down after dinner, lying in bed. If you remove the phone but leave the cue, the urge stays. Pick a default for each cue in advance:
- **Short wait:** do an [exercise snack](/burnscroll/articles/exercise-snacks), such as a stair climb or a minute of squats.
- **After dinner:** a 10-minute walk.
- **In bed:** a book on the nightstand and the phone charging in another room.
- **Bored on the couch:** something from [hobbies to replace scrolling](/burnscroll/articles/hobbies-to-replace-scrolling).
## What does a day with 2 hours of screen time look like?
Here is one example of a weekday that fits a 2-hour leisure budget, with movement built in.
[[TABLE:sampleDay]]
Notice the pattern. Screen time comes after movement, not instead of it, and there are no feeds in the first or last hour of the day.
## Why pair the 2-hour limit with exercise?
Cutting screen time leaves a gap, and gaps get filled. If you fill it with movement, you get a second benefit on top of the first. In a large study of US nurses, each extra 2 hours a day of TV watching was linked to a 23% higher risk of obesity, while each hour a day of brisk walking was linked to a 24% lower risk. That study looked at TV and found a link, not proof of cause, but the direction is clear: trading sitting time for moving time is a good swap.
## How can parents help a teen hit 2 hours?
- **Agree on the budget together.** Teens follow rules they helped set.
- **Count only recreational use.** Homework time shouldn't come out of the budget.
- **Protect sleep first.** Phones out of bedrooms at night is a simple, high-impact rule.
- **Tie screen time to activity.** The same guidelines that suggest 2 hours also recommend 60 minutes of activity a day, so linking the two makes sense.
For signs that use has become a bigger problem, see our guide to [teen phone addiction](/burnscroll/articles/teen-phone-addiction).
## Frequently asked questions
### Is 2 hours of screen time a day good?
For children and teens ages 5 to 17, 2 hours of recreational screen time is the limit in the Canadian 24-Hour Movement Guidelines. For adults, the same guidelines suggest no more than 3 hours, so 2 hours is a stricter goal. It's a sensible target if leisure scrolling is cutting into sleep, exercise or relationships.
### Does work or school screen time count toward the 2 hours?
No. The 2-hour guideline refers to recreational screen time: social media, videos, streaming, games and browsing for fun. Screens used for work, school or homework are not included, though it helps to take regular movement breaks during long stretches of either.
### How do I limit my iPhone to 2 hours a day?
Open Settings, then Screen Time, to see your current use. Then set Time Allowances (App Limits on older iOS versions) for your leisure apps that add up to 120 minutes. Because built-in limits are easy to skip, many people add an app that keeps distracting apps locked until a condition is met, such as earning time through exercise.
### How long does it take to cut screen time to 2 hours?
It depends on your starting point. If you use 5 or 6 hours a day, cutting about 30 minutes a week is more realistic than a sudden drop. Most of the work is replacing the cues that trigger scrolling, which takes a few weeks of repetition.
### What should I do instead of scrolling?
Have a default ready for each moment you usually scroll: a short walk or stair climb on breaks, a book in bed, a hobby on the couch. Movement is a strong choice because it replaces sitting time and leaves you feeling more awake, not less.
## The takeaway
The 2-hour figure comes from guidelines for kids and teens, and it's a healthy stretch goal for adult leisure scrolling. Measure first, split your 120 minutes into blocks, set limits, and gate the worst apps behind something you have to do. Replace each scrolling cue with a default, ideally one that gets you moving.
[[CTA||Earn every minute of screen time with movement.]]
Sources: [Canadian 24-Hour Movement Guidelines: Children and Youth](https://csepguidelines.ca/guidelines/children-youth/), [Canadian 24-Hour Movement Guidelines: Adults 18-64](https://csepguidelines.ca/guidelines/adults-18-64/), [Common Sense Media 2021 census](https://www.commonsensemedia.org/press-releases/two-years-into-the-pandemic-media-use-has-increased-17-among-tweens-and-teens), [Apple iPhone User Guide: Screen Time](https://support.apple.com/guide/iphone/get-started-with-screen-time-iphbfa595995/ios), [Hu et al., JAMA 2003](https://pubmed.ncbi.nlm.nih.gov/12684356/)
This article is general information, not medical advice.`),

  A('exercise-dopamine-vs-scrolling',
    'Exercise Dopamine vs. Scrolling: What Your Brain Gets',
    'Does exercise release dopamine? What research says about exercise, dopamine, endocannabinoids and BDNF, and how it compares with the scrolling loop.',
    ['exercise dopamine', 'does exercise release dopamine', 'dopamine from exercise', 'exercise vs scrolling', 'exercise and mood'],
    {
      compare: {
        caption: 'Based only on the studies cited below. Study sessions ranged from about 20 minutes (Facebook) to 45 minutes (running). "Not studied" means no cited evidence either way.',
        headers: ['', 'After a scrolling session', 'After moderate exercise'],
        rows: [
          ['Mood afterward', 'Lower than after browsing other websites (20-minute Facebook session)', 'More euphoria than after walking (45-minute moderate run)'],
          ['Short-term anxiety', 'Not studied', 'Lower after running; CDC lists reduced short-term anxiety right after a session'],
          ['What people expected', 'Expected to feel better afterward, and felt worse', 'Not studied'],
          ['Dopamine and reward', 'Posting follows reward-learning patterns driven by likes', 'Dopamine release during moderate cycling, linked to faster reaction time'],
          ['Endocannabinoids', 'Not studied', 'Anandamide and 2-AG rose after running'],
          ['BDNF', 'Not studied', 'Moderate rise after a single session (meta-analysis)'],
          ['Why the mood changed', 'Feeling of not having done anything meaningful', 'Endocannabinoid signaling is a leading candidate'],
        ],
      },
    },
`**Yes, exercise appears to release dopamine: a 2024 brain-imaging study found dopamine release during moderate cycling, linked to faster reaction times. But dopamine is only part of it. Exercise also raises endocannabinoids and BDNF, and studies link it with better mood afterward. Scrolling taps reward learning too, yet research links it with feeling worse, not better.**
"Dopamine" has become shorthand for anything that feels good, from coffee to new sneakers. That makes it easy to say exercise gives you "good dopamine" and scrolling gives you "bad dopamine." The real picture is more interesting, and more useful, than that slogan.
Here is what the research does and doesn't show, and why it makes a strong case for moving before you scroll.
## What does dopamine actually do?
Dopamine is often called the pleasure chemical, but researchers mostly connect it with motivation, learning and wanting: it helps your brain figure out what's worth going after again. That's why it matters for habits. Things that reliably pay off, or pay off unpredictably, get your attention again and again. For a fuller explanation, see [dopamine detox: what the science says](/burnscroll/articles/dopamine-detox).
## Does exercise release dopamine?
Research suggests it does, though human evidence is still thin. Measuring dopamine in a living human brain requires PET scanning, which is expensive and hard to do while someone is moving.
In a 2024 study in The Journal of Physiology, researchers scanned people as they cycled lying down inside a PET machine. Across three experiments with 52 male participants, moderate cycling increased dopamine release, and that release was linked with faster reaction times. When muscles were made to contract with electrical stimulation instead, the effect didn't appear, which suggests the brain's own drive to move matters. The authors note the sample was small and all male, and that other factors like blood flow and arousal likely play a role too.
So "exercise releases dopamine" is a fair summary. "Exercise floods your brain with dopamine" is not.
## What else does exercise release?
Dopamine gets the headlines, but it isn't the only system involved.
### Endocannabinoids
These are your body's own cannabis-like molecules. In a 2021 trial, 63 adults ran on a treadmill at moderate intensity for 45 minutes or walked. Running led to more euphoria, less anxiety and higher blood levels of two endocannabinoids, anandamide and 2-AG. Researchers now see endocannabinoids as a leading explanation for the "runner's high."
### Endorphins
Endorphins were long credited with the runner's high. In the same 2021 trial, some participants took naltrexone, a drug that blocks opioid receptors. They still felt the euphoria and the drop in anxiety. That suggests endorphins aren't required for the good feeling, though they may still play a part.
### BDNF
Brain-derived neurotrophic factor helps brain cells grow and form new connections. A 2015 meta-analysis of 29 studies with 1,111 participants found that a single session of exercise produced a moderate increase in BDNF, and that regular exercise made that increase larger.
## How does scrolling hit the reward system?
Feeds are built around unpredictable rewards. You don't know whether the next swipe brings something funny, something upsetting or nothing at all, and that uncertainty keeps you swiping. We cover the design side in [why apps are so addictive](/burnscroll/articles/why-apps-are-addictive).
Research backs up the learning part. A 2021 study in Nature Communications analyzed more than a million social media posts from over 4,000 people and found that posting behavior followed the same reward-learning principles seen in animals seeking food: people posted more when likes came faster. A follow-up experiment showed the social rewards directly shaped behavior.
## Why do you feel worse after scrolling?
In a 2014 set of studies, people who spent about 20 minutes on Facebook ended up in a worse mood than people who browsed other websites. The drop was explained by a sense of not having done anything meaningful. People also predicted they'd feel better after Facebook, and they didn't. The effect was small, but that mismatch between expectation and result helps explain why you keep reopening the app.
Exercise tends to work the other way around. It can feel like effort before you start and better once you're done.
## How does scrolling compare with exercise?
Here is what the cited research shows, side by side. Where a study didn't measure something, we say so instead of guessing.
[[TABLE:compare]]
[[CTA||Make the feed wait until you've moved.]]
## How do you use this in real life?
The lesson isn't that scrolling is evil and exercise is perfect. It's about order. If you scroll first, the session tends to stretch on and you skip the walk. If you move first, you get the mood and focus boost, and the scrolling that follows is shorter and more deliberate.
- **Move before you open the feed.** Even 10 to 20 minutes of brisk walking, cycling or stairs counts.
- **Use stress as a cue to move.** When you feel the pull to scroll because you're anxious or restless, try movement first. Our guide on [exercise vs. anxiety](/burnscroll/articles/exercise-vs-anxiety) has ideas.
- **Notice the after-feeling.** Ask yourself how you feel 10 minutes after each one. That honest comparison is more convincing than any study.
## How does BurnScroll fit in?
BurnScroll puts the order into practice. You choose the apps to lock, and they stay locked until you burn active calories, which it reads from Apple Health. About 100 active calories earns roughly 20 minutes of screen time. It doesn't care which exercise you do, only that you moved. So the feed is still there, it just comes after the walk, the run or the bike ride. If you're curious what changes when you scroll less, read [what happens when you stop scrolling](/burnscroll/articles/what-happens-when-you-stop-scrolling).
## Frequently asked questions
### Does exercise release dopamine?
Research suggests it does. A 2024 PET imaging study found that moderate cycling increased dopamine release in the brain, and that the release was linked to faster reaction times. Human studies are still small, and exercise also affects endocannabinoids, endorphins and BDNF, so dopamine is one part of a bigger picture.
### Is exercise dopamine better than scrolling dopamine?
Both involve the brain's reward and learning systems, so it's not a simple good-versus-bad chemical story. The difference is in what comes after. Studies link moderate exercise with better mood and lower anxiety afterward, while a study of Facebook use found people felt worse after scrolling than after other browsing, even though they expected to feel better.
### How long does it take to feel good after exercise?
The CDC notes that some brain benefits, including reduced short-term anxiety in adults, show up right after a session of moderate to vigorous activity. In one trial, people reported more euphoria and less anxiety after 45 minutes of moderate running. Many people notice a change within a single session.
### What causes the runner's high?
Research now points to endocannabinoids as a leading candidate. In a 2021 trial, moderate running raised endocannabinoid levels and improved mood, and blocking opioid receptors did not stop the euphoria. That suggests endorphins aren't required for the runner's high, though they may still contribute.
### What kind of exercise is best for mood?
Most of the studies here used moderate aerobic exercise like cycling or running, where you breathe harder but can still talk. Brisk walking, stairs and cycling are all good options. The best type is the one you'll do regularly.
## The takeaway
Exercise does affect dopamine, but the bigger story is the full package: endocannabinoids, BDNF, better mood and less anxiety afterward. Scrolling also runs on reward learning, yet the evidence links it with feeling worse than expected. You don't need to quit your feed. Just make it wait until after you've moved.
[[CTA||Earn your feed with movement first.]]
Sources: [Ando et al., Journal of Physiology 2024 (University of Portsmouth)](https://www.port.ac.uk/news-events-and-blogs/news/feel-good-hormone-could-explain-why-exercise-helps-boost-your-brain), [Siebers et al., Psychoneuroendocrinology 2021](https://pubmed.ncbi.nlm.nih.gov/33582575/), [Szuhany et al., Journal of Psychiatric Research 2015](https://pubmed.ncbi.nlm.nih.gov/25455510/), [Lindström et al., Nature Communications 2021](https://www.nature.com/articles/s41467-020-19607-x), [Sagioglou and Greitemeyer, Computers in Human Behavior 2014](https://doi.org/10.1016/j.chb.2014.03.003), [CDC: Benefits of Physical Activity](https://www.cdc.gov/physical-activity-basics/benefits/index.html)
This article is general information, not medical advice.`),

  A('screen-time-and-weight-gain',
    'Does Screen Time Cause Weight Gain? What Studies Show',
    'Does screen time cause weight gain? What studies on TV, snacking and sleep show, correlation vs causation, and what 1 hour of walking instead burns.',
    ['screen time and weight gain', 'does screen time cause weight gain', 'screen time and obesity', 'sedentary time and weight', 'calories burned walking vs sitting'],
    {
      swap: {
        caption: 'Estimates for a 70 kg (154 lb) person over 60 minutes. Total = MET x 70 x 1. Active (above resting) = (MET - 1) x 70 x 1. BurnScroll time uses about 100 active calories per 20 minutes. Your device will measure differently.',
        headers: ['Activity (Compendium MET)', 'Total calories', 'Approx. active calories', 'BurnScroll screen time'],
        rows: [
          ['Scrolling while sitting (sitting quietly: 1.0)', '70', '0', '0 min'],
          ['Walking, 2.5 mph (3.0)', '210', '140', 'about 28 min'],
          ['Walking, 2.8 to 3.4 mph (3.8)', '266', '196', 'about 39 min'],
          ['Brisk walking, 3.5 to 3.9 mph (4.8)', '336', '266', 'about 53 min'],
          ['Very brisk walking, 4.0 to 4.4 mph (5.5)', '385', '315', 'about 63 min'],
          ['Leisure cycling, under 10 mph (4.0)', '280', '210', 'about 42 min'],
          ['Stationary bike, 60 watts (5.0)', '350', '280', 'about 56 min'],
          ['Cycling, 12 to 13.9 mph (8.0)', '560', '490', 'about 98 min'],
        ],
      },
    },
`**Screen time doesn't add calories by itself, but studies consistently link more of it with weight gain. The likely reasons are sitting instead of moving, eating while distracted and losing sleep. Most evidence is observational, so it shows a link rather than proof, but a trial that cut children's screen time did slow their weight gain.**
It's easy to blame screens for everything. It's also easy to dismiss the link as obvious: of course people who watch more TV move less. The truth sits in between. Screens shape several habits that affect weight, and some of those effects show up even when activity levels stay the same.
Here's what the research shows for adults and kids, what it can't prove, and what swapping an hour of scrolling for movement adds up to.
## Does screen time cause weight gain?
Not directly. Weight changes when the calories you take in and the calories you burn are out of balance over time. Screen time can push both sides the wrong way: it replaces movement, it encourages extra eating, and late-night use can cut into sleep, which affects appetite.
Most studies on this are observational. They follow people over time and find that heavy screen users gain more weight. That can't fully rule out other explanations, like stress, work schedules or income. A few experiments do test cause and effect, and they point the same way.
## What do studies show for adults?
One of the best-known studies followed women in the US Nurses' Health Study from 1992 to 1998. Among 50,277 women who weren't obese at the start, each extra 2 hours a day of TV watching was linked to a **23% higher risk of becoming obese** and a 14% higher risk of type 2 diabetes, after adjusting for exercise, diet, smoking and other factors.
The flip side was just as striking. Standing or walking around at home for 2 hours a day was linked to a 9% lower risk of obesity, and each hour a day of brisk walking was linked to a 24% lower risk. The study looked at TV, not phones, and it's observational. But the message carries over: hours of seated screen time are hours your body isn't moving.
## What about kids and teens?
Here there's experimental evidence. In a 1999 trial in San Jose, California, one elementary school taught a 6-month, 18-lesson curriculum to help 3rd and 4th graders cut TV, video and video game use. Compared with children at a matched school, those children had smaller increases in BMI, waist size and skinfold thickness over the school year.
Interestingly, the trial found no difference in physical activity or high-fat food intake between the groups. What did change was screen time and the number of meals eaten in front of the TV. That suggests eating habits around screens may matter as much as lost activity.
## Why might screen time lead to weight gain?
### Sitting replaces moving
Sitting and watching a screen burns about 1 MET, the same as sitting quietly. A MET is a unit of energy use where 1 equals your resting rate. Brisk walking is about 4.8 METs. Every hour on the couch is an hour that could have burned three to five times more energy.
### Eating while distracted
A 2013 review of 24 studies found that eating while distracted led to a moderate increase in how much people ate during that meal, and a larger increase in how much they ate later. A screen is one of the easiest things to eat in front of without noticing. If you don't notice what you ate, you're more likely to eat again sooner.
### Lost sleep
A 2017 meta-analysis of sleep studies found that when people's sleep was cut short, they ate about 385 more calories the next day, without burning more. Late-night scrolling is one of the easiest ways to lose sleep. Our guide to [screen time and sleep](/burnscroll/articles/screen-time-and-sleep) explains how phones affect your rest and what to do about it.
## Correlation vs. causation: what can we say?
- **We can say:** heavy screen time is consistently linked with weight gain in adults and kids.
- **We can say:** cutting children's screen time in a controlled trial slowed BMI gain.
- **We can say:** distracted eating and short sleep each lead to eating more in experiments.
- **We can't say:** that screen time alone causes weight gain in every person, or that cutting it will make you lose a specific amount.
[[CTA||Turn your scrolling time into moving time.]]
## What does swapping 1 hour of scrolling for walking or cycling burn?
You can estimate calories with the MET values in the 2024 Adult Compendium of Physical Activities, a standard research reference. The formula is simple:
- **Total calories = MET x body weight in kg x hours**
- **Active calories (above resting) is roughly (MET - 1) x body weight in kg x hours**
Active calories are the ones your movement adds on top of what your body burns at rest, which is closer to what Apple Health logs as active energy. Here's what an hour looks like for a 70 kg (154 lb) person, and what it would earn in BurnScroll.
[[TABLE:swap]]
A heavier person burns more for the same activity, a lighter person less. Hills, fitness and how you measure all change the numbers, so treat this as a ballpark, not a scoreboard.
## What does that mean for your weight?
It means one daily swap adds up to real activity: an hour of brisk walking instead of an hour of scrolling is roughly 266 extra active calories for a 70 kg person. Whether that changes your weight depends on what you eat, how you sleep and many other things. We won't promise weight loss, and you should be wary of anyone who does. What the research does support is that moving more and sitting less is good for your health whatever the scale says.
If an hour feels like a lot, start smaller. [Exercise snacks](/burnscroll/articles/exercise-snacks) of 1 to 5 minutes add up, and a [2-hour leisure screen budget](/burnscroll/articles/how-to-limit-screen-time-to-2-hours) frees up time for longer walks.
## How does BurnScroll help?
BurnScroll locks the apps you choose until you earn time with active calories, which it reads from Apple Health. About 100 active calories unlocks roughly 20 minutes. It doesn't count reps or care what exercise you do. That changes the default: instead of sitting first, you move first, and the scrolling you do is paid for in steps. The [earn screen time chart](/burnscroll/articles/earn-screen-time-chart) shows more activities and what they earn.
## Frequently asked questions
### Does screen time cause weight gain?
Screen time is consistently linked with weight gain, but most studies are observational, so they can't prove cause on their own. Likely reasons include sitting instead of moving, eating while distracted and losing sleep. A school trial that reduced children's screen time did slow their BMI gain, which supports a real effect.
### How many calories does scrolling on your phone burn?
About the same as sitting quietly. The Compendium of Physical Activities rates sitting and watching TV at 1.0 MET, which is your resting rate. For a 70 kg (154 lb) person, that's about 70 calories an hour in total, almost none of it from activity.
### Does eating in front of a screen make you eat more?
Research suggests yes. A review of 24 studies found that distracted eating moderately increased how much people ate at that meal and increased how much they ate later even more. Eating away from screens helps you notice when you're full.
### Can late-night phone use affect weight?
It can, mostly through sleep. Studies show that when sleep is cut short, people eat about 385 more calories the next day on average without burning more. Keeping your phone out of the bedroom protects sleep, which supports healthier eating.
### Will walking instead of scrolling help me lose weight?
It adds activity, which helps your overall energy balance and health. Whether you lose weight also depends on diet, sleep and other factors, so no one can promise a specific result. As an estimate, an hour of brisk walking burns about 266 active calories for a 70 kg person.
## The takeaway
Screen time is linked with weight gain through sitting, distracted snacking and lost sleep, and at least one trial suggests cutting it helps. The link is clearer than the cause, so focus on what you control: swap some scrolling for walking or cycling, eat away from screens and protect your sleep.
[[CTA||Move first, scroll second.]]
Sources: [Hu et al., JAMA 2003](https://pubmed.ncbi.nlm.nih.gov/12684356/), [Robinson, JAMA 1999](https://pubmed.ncbi.nlm.nih.gov/10546696/), [Robinson et al., American Journal of Clinical Nutrition 2013](https://pubmed.ncbi.nlm.nih.gov/23446890/), [Al Khatib et al., European Journal of Clinical Nutrition 2017](https://pubmed.ncbi.nlm.nih.gov/27804960/), [2024 Adult Compendium of Physical Activities](https://pacompendium.com/adult-compendium/)
This article is general information, not medical advice.`),

  A('exercise-before-studying',
    'Exercise Before Studying: Benefits, Timing and a Routine',
    'Exercise before studying can sharpen attention and memory. What studies show, before vs after, a 20-minute routine, and why phone breaks backfire.',
    ['exercise before studying', 'exercise before or after studying', 'benefits of exercise before studying', 'workout before studying', 'exercise and memory'],
    {
      routine: {
        caption: 'A 20-minute pre-study routine at moderate effort: breathing harder, but still able to talk.',
        headers: ['Minutes', 'What to do', 'Why'],
        rows: [
          ['0 to 2', 'Put your phone in another room or lock distracting apps. Write one goal for the session.', 'Studies link phone use and presence with worse attention and memory.'],
          ['2 to 5', 'Easy warm-up: walk, march in place or climb stairs slowly.', 'Ease into moderate effort.'],
          ['5 to 17', 'Brisk walk, easy jog, cycling or stairs at moderate effort.', 'Benefit studies often used about 20 minutes of moderate exercise.'],
          ['17 to 20', 'Slow down, drink water, sit and open your materials.', 'In one study, testing started after heart rate settled.'],
          ['20 to 70', 'Study block of 25 to 50 minutes.', 'Use the window right after exercise for the hardest material.'],
          ['Break', '2 to 5 minutes of stairs, squats or a walk. No phone.', 'Phone breaks led to slower, less accurate work afterward.'],
        ],
      },
    },
`**Yes, exercise before studying can help. Studies of about 20 minutes of moderate exercise, like brisk walking, show modest improvements in attention, and a review found a single session of cardio boosted long-term memory. The effects are small but real, and they beat the usual pre-study ritual of scrolling your phone.**
You sit down to study, open your notes, and somehow end up 20 minutes deep in your phone. Most students know the feeling. A short workout before you start won't make you a genius, but research suggests it can help you focus better and remember more, and it gives you a better ritual than the scroll.
Here's what the studies show, whether to move before or after, and a simple routine you can use today.
## Does exercise before studying help?
The evidence says yes, with realistic expectations. A 2012 meta-analysis pooled 79 studies of single exercise sessions and found a small positive effect on cognitive performance. That held whether people were tested during exercise, right after or after a delay. The effect was larger for some types of thinking and depended on how long and how hard people exercised, and on their fitness.
The CDC also lists improved thinking in children ages 6 to 13 and reduced short-term anxiety in adults among the benefits that show up right after a session of moderate to vigorous activity.
## What do studies show about attention?
In a 2009 study, 20 children around age 9 and a half either rested or walked on a treadmill for 20 minutes at about 60% of their estimated maximum heart rate. After walking, and once their heart rate had settled, they were more accurate on an attention task and scored better on an academic achievement test than after resting. Brain recordings also showed changes linked to attention.
It was a small study in kids, so it's not proof for every learner. But it's a useful template: about 20 minutes of moderate walking, then study.
## What about memory?
A 2013 review with meta-analysis looked at cardio exercise and memory. A single session of exercise had a moderate effect on short-term memory and a moderate-to-large effect on long-term memory. The authors suggest that acute exercise helps by priming the processes your brain uses to encode and store new information, and that timing matters.
Regular exercise over months had smaller effects on memory directly but helps keep the brain's machinery in good shape. The practical upshot: a workout before a study session may help today, and regular workouts support you over the semester.
## Should you exercise before or after studying?
Both can help, but before is the better default for most students.
- **Before:** you start the session more alert and with a clearer head, which helps you pay attention while you take in new material.
- **After:** the memory review suggests exercise may help the brain consolidate what you just learned, but the evidence on exact timing is still mixed.
- **Not right before you collapse:** keep it moderate. The meta-analysis found intensity and duration changed the effect, and most positive studies used moderate effort, not exhausting workouts.
If you have a long session, do both: a walk before, movement breaks during, and a longer workout when you're done.
## What's a good pre-study routine?
Here's a 20-minute routine built around what the studies used. You don't need a gym, and you can do the whole thing outside or on stairs.
[[TABLE:routine]]
Use the first block after the routine for your hardest material, such as problem sets or new concepts, while you're most alert. Save easier review for later.
[[CTA||Lock your feeds while you study, earn them back with movement.]]
## Why is a phone break the worst study break?
Breaks help. Phone breaks don't help much at all. In a Rutgers study of 414 college students solving word puzzles, some took a mid-task break on their phones, some took a break using a computer or paper, and some took no break. Those who used their phones took 19% longer on the rest of the task and solved 22% fewer problems than the other break groups combined. Their results were close to those of students who took no break at all.
It's not only using the phone. A 2023 meta-analysis of 22 studies found an overall negative effect of smartphone use and presence on memory, attention and general cognitive performance, though results varied between studies. A phone on your desk keeps pulling at your attention even when the screen is dark.
A movement break does the opposite. It gets you away from the desk, raises your heart rate a little and doesn't fill your head with new information to process. That's why a 2 to 5 minute [exercise snack](/burnscroll/articles/exercise-snacks) is a better break than a feed check. For more phone-free tactics, see [how to study without your phone](/burnscroll/articles/study-without-your-phone).
## Will a workout make me too tired to study?
Not if you keep it moderate. A brisk walk or easy bike ride should leave you warm and alert, not drained. If you're wiped out after a hard training session, give yourself a longer cooldown and a snack before you start, or save hard workouts for after studying. If you're short on time, even 10 minutes of brisk walking is a better start than 10 minutes of scrolling.
## How does BurnScroll help you study?
BurnScroll locks the apps you choose, such as TikTok, Instagram or games, until you earn screen time with active calories from Apple Health: about 100 active calories for roughly 20 minutes. That fits a study routine well. Your pre-study walk earns time you can spend after the session as a reward, and the feeds stay locked while you work. Pair it with the habits in [how to improve focus](/burnscroll/articles/how-to-improve-focus) and avoid trying to study and scroll at once, which is covered in [the myth of multitasking](/burnscroll/articles/the-myth-of-multitasking).
## Frequently asked questions
### How long should I exercise before studying?
About 10 to 20 minutes of moderate exercise is a good target. A well-known study used 20 minutes of brisk treadmill walking at about 60% of maximum heart rate and found better attention and test performance afterward. You should be breathing harder but still able to talk.
### Is it better to exercise before or after studying?
Before is the better default because it can help you focus while you take in new material. Research suggests exercise after learning may also help memory consolidation, but the evidence on timing is mixed. If you can, take a short walk before and do a longer workout after.
### What kind of exercise is best before studying?
Moderate aerobic exercise like brisk walking, easy jogging, cycling or climbing stairs. Most studies that found benefits used this kind of activity. Avoid exhausting workouts right before a study session, since very hard or long exercise can leave you too tired to focus.
### Does exercise before an exam help?
A short session may help you feel calmer and more alert. The CDC notes reduced short-term anxiety in adults right after moderate to vigorous activity, and studies show small boosts in attention. Keep it light to moderate, leave time to cool down, and don't try a new or intense workout on exam day.
### What should I do on study breaks instead of checking my phone?
Move for 2 to 5 minutes: climb stairs, do squats or walk around the block. In a Rutgers study, students who took phone breaks worked slower and solved fewer problems afterward than students who took other kinds of breaks. A short movement break resets your focus without adding new distractions.
## The takeaway
About 20 minutes of moderate exercise before studying can give you a small but real edge in attention and memory. Keep it moderate, put your phone away before you start, and take movement breaks instead of phone breaks. The scroll can wait until the work is done.
[[CTA||Study first, scroll later, and move to earn it.]]
Sources: [Hillman et al., Neuroscience 2009](https://pubmed.ncbi.nlm.nih.gov/19356688/), [Chang et al., Brain Research 2012](https://pubmed.ncbi.nlm.nih.gov/22480735/), [Roig et al., Neuroscience and Biobehavioral Reviews 2013](https://pubmed.ncbi.nlm.nih.gov/23806438/), [Rutgers University](https://www.rutgers.edu/news/need-mental-break-avoid-your-cell-phone-rutgers-researchers-say), [Böttger et al., Behavioral Sciences 2023](https://pubmed.ncbi.nlm.nih.gov/37754029/), [CDC: Benefits of Physical Activity](https://www.cdc.gov/physical-activity-basics/benefits/index.html)
This article is general information, not medical advice.`),
]

for (const a of articles) {
  const doc = {_id: `drafts.burnscroll-${a.slug}`, _type: 'article', brand: 'burnscroll', title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs Studio', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  console.log(`${w >= 1000 ? '✅' : '⚠️ '} draft: ${a.slug} (~${w} words, ${tables} tables, title ${a.title.length}c, desc ${a.description.length}c)`)
}
console.log('\nDone — DRAFTS only. Nothing is live.')
