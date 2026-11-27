// 2026-11-27: add a short, topic-specific "How MamaBee helps" section to 62 articles that had App Store CTAs but no MamaBee section.
// The section goes directly before the article's LAST appCta block (so the article ends section -> CTA).
// Drafts only: inserts into an existing drafts.<id> (patch insert, ifRevisionId) or creates drafts.<id> from the published doc.
// Never writes published docs, never publishes, never deletes. Idempotent. DRY=1 prints 3 samples + a summary without writing.
// Facts come only from reports/briefs/MAMABEE-FIRST-BRIEF.md (Bee AI, Sleep Coach, Allergen Test, full vaccine schedule = Premium).
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const c = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_WRITE_TOKEN})
const DRY = !!process.env.DRY

// Each entry: [H2 heading, ...lines]. A line starting with "- " is a bullet. **text** is bold.
const S = {
  'en/4-month-sleep-regression': ['How MamaBee helps you through the 4-month regression',
    'When every night feels broken in the same way, a log is what shows you it is actually changing. MamaBee lets you record each wake-up, feed and nap with one thumb, in the dark, with no ads popping up at 3 AM.',
    '- **7-day insights** show whether night wakings are creeping down, so you can see the regression easing before you feel it.',
    '- **Free real-time sync for two caregivers** means whoever is up knows when the last feed was, without waking the other.',
    '- **Sleep Coach (Premium)** predicts the next nap from your baby\'s own wake windows, which helps when naps shrink to 30 minutes.',
    'MamaBee is free on iPhone. Start logging tonight and let next week\'s pattern do the reassuring.'],
  'en/are-baby-tracker-apps-safe': ['How MamaBee handles your baby\'s data',
    'We build MamaBee at Realm Labs, so here is plainly how it works. It is local-first: your logs stay on your iPhone and only reach our servers if you turn on Co-Parent Sharing. Your data is never sold and never used to train external AI, and there are no ads on any tier, free or Premium.',
    'You also stay in control of your own records. Export everything to CSV or JSON, or make a PDF for your pediatrician, whenever you like. If two of you are logging, real-time sync for two caregivers is free, so you never have to pay just to share.',
    'If that sounds like the kind of tracker you want, MamaBee is free to try on iPhone.'],
  'en/baby-bedtime-routine': ['How MamaBee helps your bedtime routine stick',
    'A routine works because it repeats, and it is easier to keep repeating when you can see it paying off. With MamaBee you log bedtime, the last feed and any night wakings in a tap or two, and the timeline shows the whole evening at a glance.',
    '- **7-day insights** reveal whether bedtime is drifting later or nights are getting longer since you started.',
    '- **Free sync for two caregivers** means whoever does bath and books can log it, and the other parent sees the same picture.',
    '- **Widgets** keep your baby\'s day on your Home Screen, so checking the last feed takes a glance.',
    '- **Sleep Coach (Premium)** predicts naps from your baby\'s wake windows, which helps protect the last nap before bed.',
    'Download MamaBee free on iPhone and give your new routine a week of logs.'],
  'en/baby-constipation-relief': ['How MamaBee helps you spot real constipation',
    'The difference between normal straining and true constipation lives in the pattern: how often, how hard, and what changed. Memory is terrible at this when you are short on sleep. MamaBee lets you log every diaper with one thumb, so you are not guessing about yesterday.',
    '- See poops alongside **feeds and solids** on one timeline, which helps when a new food or formula arrives.',
    '- Use **7-day insights** to check whether dirty diapers really are getting fewer.',
    '- Add a **custom log** for anything you are trying, like extra water after 6 months or tummy massage.',
    '- Export a **pediatrician PDF** before the appointment, so the doctor sees days of data instead of a rough guess.',
    'MamaBee is free on iPhone with no ads. Start the log today and bring it to your next visit.'],
  'en/baby-diaper-rash-treatment': ['How MamaBee helps with diaper rash',
    'Most rashes come down to how long skin stays wet, and that is hard to judge across a blurry day. MamaBee logs each change in one tap, wet, dirty, mixed or dry, so you can see the real gaps between changes and close them when a rash flares.',
    '- Log **solids** too, since a new food can change stools and set off irritation.',
    '- Record the cream you used in the **medicine log**, so you know what went on and when.',
    '- If you need to see the doctor, a **pediatrician PDF** shows the days leading up to it.',
    '- **Free two-caregiver sync** keeps both parents on the same changing rhythm.',
    'Try MamaBee free on iPhone and give that sore little bottom a better chance to heal.'],
  'en/baby-eczema-care': ['How MamaBee helps you track eczema flare-ups',
    'Eczema triggers are rarely obvious on the day. They show up when you look back over a week or two, and MamaBee gives you one place to keep the clues.',
    '- Log **baths** as an activity and moisturizer or prescribed creams in the **medicine log**, so you know exactly what was applied and when.',
    '- Record flare-ups under **symptoms** and line them up against **new foods** on the timeline.',
    '- Use a **custom log** for anything else you are testing, like a new laundry detergent.',
    '- Bring a **pediatrician PDF** to appointments, so your doctor sees the pattern and not just today\'s skin.',
    'MamaBee is free on iPhone with no ads. Start your eczema log today and make the next flare easier to read.'],
  'en/baby-feeding-schedule-by-age': ['How MamaBee helps you find your baby\'s feeding rhythm',
    'Every chart in this guide is an average. Your baby\'s own schedule only appears once you write it down, and MamaBee makes that take seconds: breastfeeds with left and right timers, bottles with amounts, pumping sessions and, later, solids.',
    'The timeline and 7-day insights show how far apart feeds really are and how that shifts month by month. Free real-time sync for two caregivers means the 2 AM bottle and the 6 AM nurse land on the same record. At checkups, WHO growth percentiles and a pediatrician PDF give your doctor the full picture.',
    'Download MamaBee free on iPhone and let your baby\'s real schedule show itself.'],
  'en/baby-fever-what-to-do': ['How MamaBee helps when your baby has a fever',
    'When your baby is hot and miserable, the questions come fast: what was the last reading, when was the last dose, is she still drinking? MamaBee keeps the answers in one place, so you are not relying on memory at 2 AM.',
    '- Log each **temperature** reading and **medicine** dose with the time, so whoever is on duty can see when the last dose was given.',
    '- Track **feeds and wet diapers** alongside, which your doctor will likely ask about.',
    '- **Free sync for two caregivers** keeps you both looking at the same record.',
    '- Share a **pediatrician PDF** if you call or visit.',
    'MamaBee keeps the record; it is not a medical tool. For any fever under 3 months, or any red flag above, call your doctor right away.',
    'Get MamaBee free on iPhone so the record is ready when you need it.'],
  'en/baby-first-cold': ['How MamaBee helps through your baby\'s first cold',
    'A cold is mostly a week of watching: is she feeding okay, are the diapers still wet, is the temperature creeping up? MamaBee lets you log all of it in a couple of taps between rounds of saline and suction.',
    '- **Feeds and diapers** on one timeline, so a dip in either is easy to spot.',
    '- **Temperature, symptoms and medicine** logs, each with the time attached.',
    '- **7-day insights** to see whether sleep and feeding are bouncing back as she recovers.',
    '- A **pediatrician PDF** ready if you need to call the doctor.',
    'MamaBee is free on iPhone. Download it now and keep the whole cold week in one calm place.'],
  'en/baby-growth-spurts': ['How MamaBee helps you spot a growth spurt',
    'Growth spurts feel endless while you are in one. A simple count of feeds per day is often what tells you it is a two- or three-day surge and not a problem with your supply.',
    'MamaBee logs breastfeeds with left and right timers, bottles and pumping in one tap, and its 7-day insights make the spike, and the return to normal, easy to see. Enter weight and length and you get WHO growth percentiles, so you can watch the growth all that feeding is building. Free two-caregiver sync lets a partner give a bottle and log it without asking you what happened last.',
    'Download MamaBee free on iPhone before the next hungry day arrives.'],
  'en/baby-led-weaning': ['How MamaBee helps with baby-led weaning',
    'In the first weeks of baby-led weaning, it is hard to remember which foods they actually tried, which ones they gagged on, and whether that rash came after the egg or the toast. MamaBee keeps track for you.',
    '- Log each **solid food** meal in a tap, right next to milk feeds, so you can see milk staying the main event.',
    '- Scroll the **timeline** to see what you offered this week and spot gaps in iron-rich foods.',
    '- Record any **symptoms**, so a possible reaction has a date and a food attached.',
    '- **Premium** adds the **Solid Food Allergen Test**, which helps you introduce allergens one at a time and keeps the record.',
    'MamaBee is free on iPhone with no ads. Let it remember the menu while you enjoy the mess.'],
  'en/baby-milestones-by-month': ['How MamaBee helps you follow your baby\'s milestones',
    'MamaBee includes a checklist of 45+ CDC milestones, so you can tick off the first social smile, the first roll and the first wobbly steps as they happen, instead of trying to remember the month later.',
    'Milestones sit alongside the rest of your baby\'s day, from sleep and feeds to activities like tummy time, plus WHO growth percentiles once you enter weight and length. Before a well-child visit, export a pediatrician PDF so you can talk about what you have actually seen. And because milestones are ranges, treat the checklist as a record, not a scorecard.',
    'Get MamaBee free on iPhone and keep every first in one place.'],
  'en/baby-nap-transitions': ['How MamaBee helps you time a nap transition',
    'The signs your baby is ready to drop a nap, like fighting one nap, short naps or a creeping bedtime, only become clear over a week or two. MamaBee makes them visible.',
    '- Log every nap with a tap and read the **timeline** to see which nap keeps getting refused.',
    '- **7-day insights** show whether total day sleep is shrinking or just shuffling around.',
    '- **Sleep Coach (Premium)** predicts the next nap from your baby\'s actual wake windows, handy while the schedule is in flux.',
    '- **Free sync for two caregivers** means both of you put the baby down at the same times during the switch.',
    'Try MamaBee free on iPhone and let the logs tell you when it is time.'],
  'en/baby-pacifier-guide': ['How MamaBee helps when you are ready to wean the pacifier',
    'Weaning goes more smoothly when you know where you are starting from. If you are cutting the pacifier back to sleep times only, MamaBee helps you watch how sleep responds.',
    '- Log naps and nights in one tap, then compare the weeks before and after with **7-day insights**.',
    '- Add a **custom log** for pacifier use if you want to watch it shrink.',
    '- **Free real-time sync for two caregivers** keeps both parents consistent, which is half the battle.',
    '- **Bee AI (Premium)** knows your baby\'s log and can help you think through a rough night of weaning.',
    'Download MamaBee free on iPhone and make the change one calm step at a time.'],
  'en/baby-play-and-activities-by-age': ['How MamaBee helps you see play and development add up',
    'You do not need a schedule for play, but it is lovely to watch it add up. In MamaBee you can log activities like tummy time, reading and outdoor time, and see them on the same timeline as naps and feeds. That makes it easier to find the happy, awake stretch that suits play best.',
    'The checklist of 45+ CDC milestones gives the first grab, the first peekaboo giggle and the first crawl somewhere to live. And if your partner has the afternoon shift, free sync for two caregivers lets you see what the two of them got up to.',
    'MamaBee is free on iPhone. Start logging the fun stuff today.'],
  'en/baby-poop-color-chart': ['How MamaBee helps you keep an eye on diapers',
    'One odd-colored diaper is usually nothing. A change that lasts several days is worth a call. MamaBee makes it easy to tell the two apart.',
    '- Log every diaper, wet, dirty, mixed or dry, with one tap.',
    '- See diapers next to **feeds, solids and medicine** on the timeline, since a new food or supplement can change the color.',
    '- Check **7-day insights** for how often your baby is pooping now compared with last week.',
    '- Bring a **pediatrician PDF**, so your doctor sees dates and counts.',
    'If you see red, white or black stool, call your pediatrician first and log it second. For everything else, download MamaBee free on iPhone and stop trying to remember yesterday\'s diapers.'],
  'en/baby-proofing-your-home': ['How MamaBee helps you baby-proof one step ahead',
    'The best time to baby-proof is just before your baby gains a new skill. MamaBee\'s checklist of 45+ CDC milestones keeps the next skills on your radar, so the outlet covers and stair gates go in before the first crawl, not after it.',
    'As you tick off rolling, sitting and pulling up, you will know it is time for the next stage of the checklist above. MamaBee also keeps symptoms, medicine and doctor visits in one place, so if a bump or a scare ever leads to a call to your pediatrician, the details are already written down.',
    'Download MamaBee free on iPhone and stay one milestone ahead of your explorer.'],
  'en/baby-reflux-and-spit-up': ['How MamaBee helps you tell a happy spitter from a problem',
    'The key reflux questions are about the whole picture: is your baby feeding well, gaining weight and content between feeds? MamaBee helps you answer them with a record instead of worry.',
    '- Log feeds with **left and right timers** or bottle amounts, so you can see whether smaller, more frequent feeds are helping.',
    '- Note spit-ups and unsettled spells under **symptoms**, with the time.',
    '- Enter weight to see **WHO growth percentiles**, the clearest sign of how your baby is growing.',
    '- Export a **pediatrician PDF** if you want to talk it through with your doctor.',
    'MamaBee is free on iPhone with no ads. Try it for a week of feeds and see what the pattern says.'],
  'en/baby-separation-anxiety': ['How MamaBee helps during a clingy phase',
    'Separation anxiety often shows up in sleep first: more night wakings, harder bedtimes, shorter naps. Seeing that in a log helps you remember it is a phase with an end.',
    '- Log naps and wakings in one tap and use **7-day insights** to watch the clingy weeks ease.',
    '- **Free real-time sync for two caregivers** lets whoever does drop-off or bedtime see how the day went.',
    '- **Bee AI (Premium)** knows your baby\'s log and can help you think through a new settling plan.',
    'None of this replaces the cuddles; it just makes the hard weeks easier to see clearly.',
    'Download MamaBee free on iPhone and watch the phase pass, one day at a time.'],
  'en/baby-sign-language': ['How MamaBee helps you celebrate first signs',
    'The first time your baby signs "milk", you will want to remember the day. MamaBee gives those moments a home.',
    '- Use a **custom log** to record each new sign as it appears, and watch the list grow.',
    '- Follow communication skills in the checklist of **45+ CDC milestones**, from babbling to first words.',
    '- Keep it all on one **timeline** with feeds and sleep, so you can look back at when each sign first showed up.',
    '- Share with your partner through **free two-caregiver sync**, so you both use and answer the same signs.',
    'MamaBee is free on iPhone. Try it and keep every little conversation.'],
  'en/baby-sleep-regressions-by-age': ['How MamaBee helps you through any sleep regression',
    'Every regression in this guide has the same problem: in the middle of it, you cannot tell whether it is getting better. A sleep log can. MamaBee records naps, night wakings and feeds with one thumb, and the 7-day insights show when the wakings start to drop.',
    'When naps shift at 8 to 10 months or the move to one nap looms, Sleep Coach (Premium) predicts the next nap from your baby\'s real wake windows. Premium also adds unlimited Bee AI, an assistant that knows your log, plus 30, 90 and 365-day insights for comparing this regression with the last. Logging and two-caregiver sync stay free, with no ads.',
    'Get MamaBee free on iPhone and see the regression lift.'],
  'en/baby-sleep-training-methods': ['How MamaBee helps you see if sleep training is working',
    'Whichever method you choose, the hardest part is judging progress at 3 AM. The real answer is in the trend over one to two weeks, and that is exactly what MamaBee shows you.',
    '- Log bedtime and each waking with one thumb, in the dark.',
    '- Compare nights with **7-day insights**, so a single bad night does not derail the plan.',
    '- **Free real-time sync for two caregivers** keeps you both running the same method at the same times, which matters for consistency.',
    '- **Sleep Coach (Premium)** predicts naps from wake windows, so an overtired afternoon does not undo your bedtime work.',
    'MamaBee is free on iPhone with no ads. Start logging the night you begin.'],
  'en/baby-sun-safety': ['How MamaBee helps on hot, sunny days',
    'Sun and heat change a baby\'s day: they may feed more, nap less or just seem off. MamaBee helps you keep an eye on all of it without a notebook in the beach bag.',
    '- Log **feeds and wet diapers** to check your baby is keeping up with milk on hot days.',
    '- Track naps in the shade or the stroller, so outings do not wreck the routine.',
    '- Add **outdoor time** as an activity and see how much sun time your days really include.',
    '- If a sunburn or heat rash needs attention, log **symptoms and temperature** and share a **pediatrician PDF**.',
    'Download MamaBee free on iPhone before your next day out.'],
  'en/baby-teething-symptoms': ['How MamaBee helps you tell teething from something else',
    'Teething gets blamed for almost everything. A short log helps you see whether a cranky week lines up with a new tooth, or with something worth a call to the doctor.',
    '- Record fussiness and drooling under **symptoms**, and each new tooth in a **custom log**.',
    '- Watch **sleep and feeds** in 7-day insights to see how long each teething wave lasts.',
    '- Log **temperature** and any **medicine** your pediatrician recommends, with times.',
    '- Share a **pediatrician PDF** if a fever or a rough week needs a professional look.',
    'MamaBee is free on iPhone. Try it and make the next tooth less of a mystery.'],
  'en/baby-vaccine-schedule-explained': ['How MamaBee helps you keep track of vaccines',
    'MamaBee includes a vaccine schedule so you can see what is coming up. The free version shows the first 3 months, and MamaBee Premium unlocks the full schedule.',
    'Around shot days, the rest is free: log temperature, any medicine your doctor suggests, feeds and sleep, so you can see how your baby bounced back and remember it for next time. Doctor visits go in the log too, and you can export a pediatrician PDF before the next checkup. Your official vaccine record still comes from your doctor\'s office, so keep that card safe.',
    'Download MamaBee free on iPhone and make vaccine days a little calmer.'],
  'en/breastfeeding-vs-formula': ['How MamaBee helps however you feed',
    'Breast, bottle, formula, pumped milk or a mix of all four: MamaBee logs it without judgment. Breastfeeds have left and right timers, bottles record amounts, and pumping sessions sit on the same timeline.',
    'For combination feeding that is especially handy. Free real-time sync for two caregivers means your partner can log the night bottle while you sleep, and you both see when your baby last ate. The 7-day insights show how your mix is working day to day, and the pediatrician PDF makes checkups easier. There are no ads on any tier.',
    'Get MamaBee free on iPhone, whichever way you feed.'],
  'en/c-section-recovery': ['How MamaBee helps while you recover',
    'After surgery you are told not to lift much more than your baby, and you should not be carrying every feed time in your head either. MamaBee is built for one-thumb logging, which matters when you are sore and feeding in bed.',
    '- **Free real-time sync for two caregivers** lets your partner take over diapers and logging while you rest.',
    '- Log feeds with **left and right timers** to keep track of sides in the hazy first weeks.',
    '- See the day at a glance on the **timeline** instead of asking, "When did she last eat?"',
    'MamaBee tracks your baby, not your incision. For pain, fever or bleeding, follow the warning signs above and call your doctor.',
    'MamaBee is free on iPhone. Let it hold the details while you heal.'],
  'en/cluster-feeding': ['How MamaBee helps you get through cluster feeding',
    'At 9 PM, after the fifth feed in three hours, it is easy to believe something is wrong. A feed log usually tells a gentler story: a predictable evening cluster, often followed by a longer stretch.',
    '- Start and stop **left and right breastfeeding timers** with one thumb, so you remember which side is next.',
    '- Use **7-day insights** to see the cluster arrive at about the same time each evening.',
    '- Check **wet and dirty diapers** in the same app, the real proof your baby is getting enough.',
    '- **Free two-caregiver sync** lets your partner follow the marathon from the next room and step in with water, snacks or a burp cloth.',
    'Try MamaBee free on iPhone tonight and see the pattern behind the marathon.'],
  'en/colic-in-babies': ['How MamaBee helps on colicky evenings',
    'Colic is defined by time: hours of crying, several days a week, for weeks. That makes a record genuinely useful. It shows when spells start, whether they are easing, and what your pediatrician needs to hear.',
    '- Log crying spells under **symptoms** with the time, and what you tried in a **custom log**.',
    '- See spells beside **feeds and sleep** on one timeline, to spot overtiredness or feeding patterns.',
    '- Use **7-day insights** to watch the weeks pass, because colic usually fades and it helps to see it happen.',
    '- **Free sync for two caregivers** makes it easier to take turns, which matters for your own wellbeing.',
    'MamaBee is free on iPhone. Download it and make the hard evenings a little easier to understand.'],
  'en/contact-naps-and-independent-sleep': ['How MamaBee helps you move toward independent naps',
    'When you start gently shifting away from contact naps, the question is which nap to try first. Usually it is the one where your baby is already sleepiest, and a few days of logs will show you which one that is.',
    '- Log every nap with a tap, and use a **custom log** to note contact nap or crib.',
    '- Use **7-day insights** to compare nap lengths as you start practising transfers.',
    '- **Sleep Coach (Premium)** predicts the next nap from your baby\'s wake windows, so you can start winding down early enough.',
    '- **Free two-caregiver sync** lets your partner practise transfers too.',
    'MamaBee is free on iPhone. Enjoy the cuddles and let the log handle the planning.'],
  'en/dream-feed': ['How MamaBee helps you decide if the dream feed works',
    'This guide suggests judging a dream feed over two weeks, not one night. That is far easier with a log than with memory.',
    '- Log the dream feed and every night waking with one thumb, in the dark.',
    '- Compare the first long stretch with and without it using **7-day insights**.',
    '- Track **bottle amounts or breastfeeding sides**, so you can see how much the dream feed actually takes.',
    '- **Free sync for two caregivers** means the partner doing the 10 PM feed logs it, and you see it in the morning.',
    'Download MamaBee free on iPhone and let two weeks of data make the call.'],
  'en/dressing-baby-for-sleep': ['How MamaBee helps you find the right sleep setup',
    'Getting the layers right is mostly trial and error, and it changes with the seasons. MamaBee helps you remember what worked.',
    '- Log every sleep, and add a **custom log** for the sleep sack TOG or layers used that night.',
    '- Compare nights with **7-day insights** to see whether a lighter or warmer setup brought fewer wakings.',
    '- If your baby feels warm and you want to check, record **temperature** readings in the same app.',
    '- **Free two-caregiver sync** means whoever does bedtime knows tonight\'s setup.',
    'MamaBee is free on iPhone with no ads. Try it through the next change of season.'],
  'en/flying-with-a-baby': ['How MamaBee helps when you fly with your baby',
    'Travel scrambles everything: feeds happen at the gate, naps happen on your lap, and a time zone change makes the clock meaningless. MamaBee keeps the thread.',
    '- Log feeds, naps and diapers in a tap, wherever you are; your logs live on your phone.',
    '- See the last feed at a glance on the **timeline**, handy when you want to time a feed for takeoff.',
    '- Use **7-day insights** to watch sleep settle back into a rhythm after jet lag.',
    '- **Free two-caregiver sync** helps when you split up at security or the hotel.',
    'Download MamaBee free on iPhone before your trip, and land with the whole day on record.'],
  'en/how-many-wet-diapers-newborn': ['How MamaBee helps you count wet diapers',
    'In the first week the numbers change every day, and it is hard to remember whether that was the fourth wet diaper or the fifth. MamaBee logs each change in one tap: wet, dirty, mixed or dry.',
    'The timeline shows today\'s diapers, and the 7-day insights show whether wet diapers are climbing toward six or more a day. Feeds sit on the same timeline, so you see diapers and feeding together, which is what your pediatrician will ask about. Export a pediatrician PDF before the first checkup, and use free two-caregiver sync so your partner\'s night changes count too.',
    'If you are worried about dehydration, call your doctor first; the log is a helper, not a diagnosis. Get MamaBee free on iPhone.'],
  'en/how-much-should-a-newborn-eat': ['How MamaBee helps you know your newborn is eating enough',
    'Ounces and minutes are only part of the story. Hunger cues, diapers and weight tell the rest, and MamaBee keeps all of them in one app.',
    '- Log breastfeeds with **left and right timers**, or bottles with amounts, in one tap.',
    '- Track **wet and dirty diapers** next to feeds, the simplest proof that milk is going in.',
    '- Enter weight to follow **WHO growth percentiles** over time.',
    '- Export a **pediatrician PDF**, so your doctor sees real numbers at the next visit.',
    '- **Free two-caregiver sync** keeps night feeds by either parent on one record.',
    'MamaBee is free on iPhone with no ads. Try it and leave the 3 AM math to the app.'],
  'en/how-often-to-bathe-a-baby': ['How MamaBee helps you keep bath days simple',
    'Two or three baths a week is easy to plan and surprisingly easy to lose track of. MamaBee lets you log a bath as an activity in a tap, so you can see when the last one was without guessing.',
    'If bath is part of bedtime, the timeline shows bath, feed and sleep together, and 7-day insights can show whether bath nights bring an easier settle. Got a baby with dry skin? Log moisturizer or prescribed creams in the medicine log and flare-ups under symptoms to share with your pediatrician. Free sync for two caregivers means the parent on bath duty logs it for both of you.',
    'Try MamaBee free on iPhone and make bath time one less thing to remember.'],
  'en/how-to-burp-a-baby': ['How MamaBee helps you work out what settles your baby',
    'Some babies burp easily; others need a different position or a mid-feed break. Logging feeds alongside fussy spells helps you see what makes the difference.',
    '- Track breastfeeds with **left and right timers** or bottles with amounts, so you know when a switch-sides burp is due.',
    '- Use a **custom log** to note which burping position worked.',
    '- Record spit-up or unsettled spells under **symptoms**, then look back over the week.',
    '- **Free sync for two caregivers** lets both of you use the technique that works.',
    'MamaBee is free on iPhone. Give it a week and see what keeps your baby comfortable.'],
  'en/how-to-cut-baby-nails': ['How MamaBee helps with the little care routines',
    'Nail trims are easiest while your baby sleeps, and a few days of MamaBee\'s sleep log will show you when the long, deep naps usually happen, so the clippers can be ready.',
    'Add a custom log for nail trims, too, and you will see at a glance that fingers were done on Tuesday and toes are due. Baths, medicine and other routines sit on the same timeline, and free real-time sync for two caregivers means that whoever does the trim, the other one knows. If a small nick still looks sore days later, a symptoms entry with the date helps when you call the pediatrician.',
    'Get MamaBee free on iPhone and keep the small stuff from slipping.'],
  'en/how-to-get-baby-to-sleep-through-the-night': ['How MamaBee helps you stretch the nights',
    'Progress toward sleeping through the night is slow and uneven, which is exactly why a log helps. MamaBee records every night waking and night feed with one thumb, and the 7-day insights show the longest stretch growing, even in weeks when it does not feel that way.',
    '- **Free real-time sync for two caregivers** lets you take shifts and both see what happened overnight.',
    '- **Sleep Coach (Premium)** predicts naps from wake windows, since good days set up better nights.',
    '- **Bee AI (Premium)** knows your baby\'s log and can help you think through night weaning.',
    '- **30, 90 and 365-day insights (Premium)** let you look back over months, not just a week.',
    'MamaBee is free on iPhone. Start logging tonight.'],
  'en/how-to-swaddle-a-baby': ['How MamaBee helps through the swaddle months',
    'Swaddling is a short season that ends once your baby shows signs of rolling, and a log helps you get the most from it and know when to stop.',
    '- Log sleep with one thumb and see whether swaddled nights bring longer stretches.',
    '- Watch for rolling in the checklist of **45+ CDC milestones**, your cue to switch to an arms-free sleep sack.',
    '- Compare the first week out of the swaddle with **7-day insights**, so you can see sleep settle again.',
    '- **Free sync for two caregivers** keeps both parents on the same swaddle rules.',
    'MamaBee is free on iPhone. Download it and make the switch out of the swaddle smoother.'],
  'en/introducing-a-bottle-to-breastfed-baby': ['How MamaBee helps with breast and bottle together',
    'Once a bottle joins the mix, keeping track gets harder: who fed, which side, how much, and when you need to pump to protect your supply. MamaBee holds it all on one timeline.',
    '- Log breastfeeds with **left and right timers**, bottles with amounts, and **pumping** sessions.',
    '- **Free real-time sync for two caregivers** lets your partner log the bottle they gave, so you know when to pump.',
    '- **7-day insights** show how the balance of breast and bottle is shifting.',
    '- Bring a **pediatrician PDF** to checkups to show feeding and diapers together.',
    'Try MamaBee free on iPhone and make combination feeding feel simple.'],
  'en/introducing-allergens-to-baby': ['How MamaBee helps you introduce allergens',
    'The method in this guide, one allergen at a time with time to watch in between, is easy to describe and hard to keep straight across nine foods and several weeks. MamaBee\'s Solid Food Allergen Test, part of Premium, keeps that record for you.',
    'Everyday food logging is free: record each solid food, and log any symptoms with the time, so a possible reaction has a food and a date attached. Export a pediatrician PDF to share the history. If your baby has severe eczema, talk to your pediatrician before you begin; the app keeps the record, but your doctor makes the plan.',
    'Download MamaBee free on iPhone, and try Premium when you are ready to start.'],
  'en/newborn-gas-relief': ['How MamaBee helps you find gas triggers',
    'Gas often follows a pattern: a fast let-down, a gulpy bottle, or feeding lying flat. A few days of logs can show you yours.',
    '- Log feeds with **left and right timers** or bottle amounts in one tap.',
    '- Note gassy, fussy spells under **symptoms** to see when they happen relative to feeds.',
    '- Add what helped, like bicycle legs or a burp break, in a **custom log**.',
    '- Use the **timeline** to see feeds, fussiness and sleep together.',
    '- Bring a **pediatrician PDF** if the fussiness worries you.',
    'MamaBee is free on iPhone with no ads. Start the log and look for the pattern.'],
  'en/newborn-hiccups': ['How MamaBee helps you spot the hiccup pattern',
    'Hiccups are almost always harmless, but if they bother you, it helps to know when they happen. Often they cluster around fast or big feeds.',
    '- Log feeds in one tap, with breastfeeding sides or bottle amounts.',
    '- Add hiccup spells as a **custom log** and see them on the **timeline** next to feeds.',
    '- If spit-up or fussiness comes along with them, record it under **symptoms** and share a **pediatrician PDF**.',
    '- **Free two-caregiver sync** lets both of you try mid-feed burps and compare results.',
    'Try MamaBee free on iPhone and see the pattern within a week.'],
  'en/newborn-sleep-schedule': ['How MamaBee helps you follow your newborn\'s rhythm',
    'A newborn sleep schedule is really a rhythm you discover, and MamaBee is built for discovering it. Log every nap, night stretch and feed with one thumb, and the timeline shows how the day actually flowed.',
    'Within a week, the 7-day insights start to show when your baby tends to sleep and for how long. Free real-time sync for two caregivers lets you split the nights and both see the last feed. When you want help guessing the next nap, Sleep Coach (Premium) predicts it from your baby\'s real wake windows. Every tier is ad-free.',
    'Get MamaBee free on iPhone and find your newborn\'s rhythm together.'],
  'en/newborn-witching-hour': ['How MamaBee helps through the witching hour',
    'The witching hour often follows a timeline: tiredness builds through the afternoon, then the evening cluster feed begins. Seeing that in a log can make the fussiest hours feel more predictable.',
    '- Log feeds and naps with one thumb, and note crying spells under **symptoms**.',
    '- Look at **7-day insights** to see when the fussy stretch starts and whether it is getting shorter.',
    '- **Free real-time sync for two caregivers** lets you tag-team the evening and both know the last feed time.',
    '- **Sleep Coach (Premium)** predicts the next nap, which helps you get ahead of late-afternoon overtiredness.',
    'MamaBee is free on iPhone. Try it this evening and watch your baby\'s evening pattern take shape.'],
  'en/postpartum-hair-loss': ['How MamaBee helps you make room for yourself',
    'MamaBee cannot stop shedding hair, but it can take a little weight off your mind while your body resets. It keeps your baby\'s feeds, sleep and diapers on one timeline, so you are not carrying every detail in your head.',
    'Free real-time sync for two caregivers lets your partner take on more of the logging and the night duty, and the pediatrician PDF means baby checkups need less prep. That leaves a few more minutes for your own care, including a visit to your doctor if the shedding goes on past a year or comes with other symptoms.',
    'Download MamaBee free on iPhone and give yourself a little more breathing room.'],
  'en/postpartum-recovery-mental-health': ['How MamaBee helps lighten the mental load',
    'A lot of postpartum exhaustion is the mental load: remembering when the baby last ate, which side, how many diapers. MamaBee takes that off your plate.',
    '- One-thumb logging for feeds, sleep and diapers, so the details live in the app, not in your head.',
    '- **Free real-time sync for two caregivers** lets your partner take a night shift with the full picture, so you can get a longer stretch of sleep.',
    '- A **pediatrician PDF** makes baby checkups quicker, leaving room to ask about you, too.',
    'MamaBee is not a mental health tool. If you are struggling, the help listed at the top of this article comes first.',
    'Get MamaBee free on iPhone and hand over some of the remembering.'],
  'en/protecting-baby-from-household-chemicals': ['How MamaBee helps you keep health details in one place',
    'Most of this guide is about the home, not an app. But when something does go wrong, a clear record helps.',
    '- Log any **medicine** your baby gets with the time, so every caregiver can see what was already given.',
    '- Note a rash, cough or other **symptoms** with the date, useful if you have just switched cleaners or detergent.',
    '- Keep **doctor visits** alongside everything else.',
    '- **Free two-caregiver sync** means both of you see the same record.',
    'If you think your baby swallowed something harmful, call Poison Control (1-800-222-1222 in the US) right away, before anything else.',
    'MamaBee is free on iPhone. Set it up today so the record is there when you need it.'],
  'en/safe-sleep-guidelines': ['How MamaBee helps you track sleep, safely',
    'Safe sleep is about the space, not the app: alone, on the back, in a crib. What MamaBee adds is a way to log every nap and night stretch without lights, paper or a pen in the nursery.',
    '- One-thumb logging in the dark for sleep and night feeds.',
    '- **Free sync for two caregivers**, so whoever takes the overnight knows when the baby went down.',
    '- Watch for rolling in the checklist of **45+ CDC milestones**, your signal to stop swaddling.',
    '- **7-day insights** show how sleep is changing as your baby grows.',
    'MamaBee is free on iPhone. Log the sleep, then put the phone down and rest.'],
  'en/the-wonder-weeks-leaps': ['How MamaBee helps you see your baby\'s own rhythm',
    'Leap charts give you an average; your baby keeps their own calendar. MamaBee helps you build it from real days.',
    '- Log fussy spells under **symptoms** and sleep with one thumb, so the hard weeks are visible.',
    '- Tick off new skills in the checklist of **45+ CDC milestones** and see whether they follow the stormy days.',
    '- Use **7-day insights** to see when a rough week is passing.',
    '- **Bee AI (Premium)** knows your log and can help you think through a clingy, sleepless stretch.',
    'MamaBee is free on iPhone. Track the storms and the new skills that come after them.'],
  'en/tummy-time-guide': ['How MamaBee helps you build the tummy time habit',
    'Tummy time works best in small, frequent doses, which makes it easy to lose count. MamaBee lets you log each session as an activity in a tap, so those three-minute bursts add up somewhere you can see.',
    'The timeline shows tummy time next to naps and feeds, which helps you find the happy, awake moments that suit it best. As head control and rolling arrive, tick them off in the checklist of 45+ CDC milestones. And with free sync for two caregivers, your partner\'s sessions count too.',
    'Get MamaBee free on iPhone and turn tummy time into a daily habit.'],
  'en/wake-windows-by-age': ['How MamaBee helps you find your baby\'s wake window',
    'The chart above is your starting point. Your baby\'s real wake window shows up once you log a few days of naps, and MamaBee makes that easy with one-thumb logging, even with a baby in your arms.',
    '- The **timeline** shows each awake stretch, so you can see which length brings easy naps and which ends in tears.',
    '- **7-day insights** reveal how your baby\'s day is shifting as wake windows grow.',
    '- **Sleep Coach (Premium)** uses your baby\'s own wake windows to predict the next nap, so you can start winding down in time.',
    '- **Free two-caregiver sync** keeps both parents on the same nap plan.',
    'MamaBee is free on iPhone. Start logging today and let your baby\'s pattern show itself.'],
  'en/when-can-babies-drink-water': ['How MamaBee helps you track drinks and diapers',
    'Before 6 months, hydration comes from milk, and diapers are how you know it is enough. After 6 months, small sips of water join meals. MamaBee covers both stages.',
    '- Log breastfeeds and bottles in one tap, with **wet diapers** right beside them.',
    '- Once solids start, record meals as **solids** and add water sips with a **custom log** if you want to see them.',
    '- Use **7-day insights** on hot days or when your baby is unwell, to see whether feeds and diapers are keeping up.',
    '- Share a **pediatrician PDF** if you are worried about hydration.',
    'MamaBee is free on iPhone with no ads. Download it and take the guesswork out of "is it enough?"'],
  'en/when-to-start-solids': ['How MamaBee helps you start solids',
    'The first weeks of solids are a blur of tiny spoonfuls and surprised faces. MamaBee keeps track so you do not have to.',
    '- Log each **solid food** meal in a tap, alongside milk feeds, so you can see milk staying the main event.',
    '- Look back on the **timeline** to remember what your baby has tried and when.',
    '- Note any **symptoms** after a new food, with the time.',
    '- **MamaBee Premium** adds the **Solid Food Allergen Test**, to introduce allergens one at a time and keep a record you can share.',
    '- **Free two-caregiver sync** lets whoever handles lunch log it too.',
    'Get MamaBee free on iPhone and enjoy the messy meals.'],

  // ---- Localized ----
  'ko/baby-feeding-schedule-by-age': ['MamaBee로 수유량·수유텀 기록이 쉬워지는 방법',
    '표에 나온 수유량과 수유텀은 평균일 뿐이에요. 우리 아기만의 리듬은 며칠만 기록해 봐도 보이기 시작해요. MamaBee에서는 모유 수유 좌우 타이머, 분유 양, 유축을 한 손으로 기록할 수 있고, 무료 버전에도 광고가 없어요.',
    '- **타임라인과 7일 인사이트**로 실제 수유 간격이 얼마나 벌어지고 있는지 한눈에 볼 수 있어요.',
    '- **부부 2명 실시간 공유가 무료**라서, 새벽수유를 교대해도 "마지막에 언제 먹었지?"를 서로 묻지 않아도 돼요.',
    '- **기저귀 기록**과 키·몸무게를 입력하면 보이는 **WHO 백분위**로, 잘 먹고 있다는 신호를 함께 확인할 수 있어요.',
    '- 영유아검진이나 소아과 진료 전에는 **소아과용 PDF**로 기록을 보여 줄 수 있어요.',
    'MamaBee는 아이폰에서 무료로 시작할 수 있어요. 다음 수유부터 가볍게 기록해 보세요.'],
  'ko/wake-windows-by-age': ['MamaBee가 깨시 맞추기를 도와주는 방법',
    '깨시는 표보다 기록이 더 정확하게 알려 줘요. MamaBee에서 낮잠과 밤잠을 한 손으로 기록하면, 아기가 깨어 있던 시간이 타임라인에 그대로 쌓여요.',
    '- **7일 인사이트**로 낮잠 횟수와 낮잠 길이가 어떻게 달라지는지 볼 수 있어요.',
    '- **부부 2명 실시간 공유(무료)** 덕분에 누가 재우든 같은 시간표로 재울 수 있어요.',
    '- **프리미엄 Sleep Coach**는 아기의 실제 깨시를 바탕으로 다음 낮잠 시간을 예측해요.',
    '- **프리미엄 Bee AI**는 우리 아기 기록을 알고 있어서, 낮잠이 자꾸 짧을 때 함께 고민해 줘요.',
    'MamaBee는 아이폰에서 무료로 시작할 수 있어요. 내일 첫 낮잠부터 기록해 보세요.'],
  'ko/well-baby-visit-schedule': ['MamaBee로 영유아검진 준비하는 방법',
    '검진 날 받는 질문은 대부분 비슷해요. 잘 먹는지, 잘 자는지, 기저귀는 충분한지, 잘 크고 있는지요. 평소에 MamaBee로 기록해 두면 대답이 훨씬 쉬워져요.',
    '- 검진 전에 **소아과용 PDF**로 수유·수면·기저귀 기록을 정리해 가세요.',
    '- 키와 몸무게를 입력하면 **WHO 백분위**로 성장 흐름을 볼 수 있어요. 검진 결과지와 기준이 다를 수 있다는 점은 위에서 설명했어요.',
    '- **CDC 발달 이정표 45개 이상** 체크리스트에 아기의 새로운 모습을 남겨 두면, 문진표를 쓸 때 참고가 돼요.',
    '- **예방접종 일정**은 무료 버전에서 첫 3개월까지 보이고, 전체 일정은 프리미엄에서 볼 수 있어요.',
    'MamaBee는 광고 없이 아이폰에서 무료로 쓸 수 있어요. 다음 검진 전에 한번 시작해 보세요.'],
  'pt-br/how-many-wet-diapers-newborn': ['Como o MamaBee ajuda a acompanhar as fraldas',
    'Na primeira semana, o número de fraldas muda todo dia, e às 3 da manhã ninguém lembra se aquela era a quarta ou a quinta. No MamaBee você registra cada troca com um toque: xixi, cocô, mista ou seca, de graça e sem anúncios.',
    '- A **linha do tempo** mostra as fraldas ao lado das mamadas, e os **resumos de 7 dias** ajudam a ver se o xixi está chegando a 6 ou mais fraldas por dia.',
    '- Com a **sincronização em tempo real para 2 cuidadores**, grátis, as trocas que o parceiro faz de madrugada também entram na conta.',
    '- Antes da consulta, gere um **PDF para o pediatra** com fraldas e mamadas.',
    'O app ajuda a registrar, mas não substitui o pediatra: se notar sinais de desidratação, procure atendimento.',
    'Experimente o MamaBee no iPhone: é grátis para começar.'],
  'zh-cn/baby-feeding-schedule-by-age': ['MamaBee 怎么帮你记奶量',
    '奶量表只是参考，宝宝自己的节奏要靠记录才看得清。在 MamaBee 里，母乳左右计时、奶瓶奶量、吸奶和辅食都能单手几秒记下，所有版本都没有广告。',
    '- **时间线和7天趋势**：看清两顿奶实际隔多久，以及这一周和上一周有什么变化。',
    '- **两人实时同步免费**：夫妻轮流夜奶，接班的人一打开就知道上一顿是几点喂的。',
    '- **尿不湿记录和 WHO 生长百分位**：输入身高体重后，配合尿量一起看宝宝有没有吃够。',
    '- **儿保前导出 PDF**：带给医生看，比凭记忆说更准确。',
    'MamaBee 目前只支持 iPhone，免费就能开始。从下一顿奶开始记吧。'],
  'zh-cn/how-many-wet-diapers-newborn': ['MamaBee 怎么帮你数尿不湿',
    '头一周每天的标准都在变，半夜换完尿不湿，很难记清这是第四片还是第五片。MamaBee 可以单手一键记录尿、便、混合、干四种情况，免费、没有广告。',
    '- 在**时间线**上，尿不湿和喂奶排在一起，再用**7天趋势**看湿尿不湿是不是在往每天6片以上走。',
    '- **两人实时同步免费**，另一半夜里换的尿不湿也会算进去。',
    '- 去儿保或看医生前，导出一份**给医生看的 PDF**。',
    '记录只是帮你看清情况，不能代替医生判断；发现脱水信号或大便发白，请及时就医。',
    '在 iPhone 上免费下载 MamaBee，把数尿不湿这件事交给它。'],
  'zh-tw/baby-feeding-schedule-by-age': ['MamaBee怎麼幫你記奶量',
    '奶量表是起點，寶寶真正的節奏要記下來才看得到。MamaBee可以單手記錄親餵左右邊計時、瓶餵奶量、擠奶和副食品，所有方案都沒有廣告。',
    '- **時間軸和7天趨勢**：看清兩餐之間實際隔多久，以及這週和上週有什麼不同。',
    '- **夫妻2人即時同步免費**：輪流夜奶時，接手的人一打開就知道寶寶上一餐喝了多少。',
    '- **尿布紀錄和WHO成長百分位**：輸入身高體重後，搭配濕尿布次數一起看寶寶有沒有喝夠。',
    '- **看診前匯出PDF**：給小兒科醫師看，比憑記憶說更清楚。',
    'MamaBee目前只有iPhone版，免費就能開始。從下一餐開始記吧。'],
}

// ---- block helpers (same block/span shape as scripts/week15-links.mjs) ----
let usedKeys = new Set()
const k = () => { let x; do { x = randomUUID().replace(/-/g, '').slice(0, 12) } while (usedKeys.has(x)); usedKeys.add(x); return x }
const spans = (s) => s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => p.startsWith('**') ? {_type: 'span', _key: k(), text: p.slice(2, -2), marks: ['strong']} : {_type: 'span', _key: k(), text: p, marks: []})
const h2 = (text) => ({_type: 'block', _key: k(), style: 'h2', markDefs: [], children: [{_type: 'span', _key: k(), text, marks: []}]})
const line = (s) => s.startsWith('- ') ? {_type: 'block', _key: k(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: spans(s.slice(2))} : {_type: 'block', _key: k(), style: 'normal', markDefs: [], children: spans(s)}
const canon = (v) => Array.isArray(v) ? v.map(canon) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((x) => [x, canon(v[x])])) : v
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))
const txt = (b) => (b.children || []).map((x) => x.text).join('')
const collectKeys = (v, set) => { if (Array.isArray(v)) v.forEach((x) => collectKeys(x, set)); else if (v && typeof v === 'object') { if (v._key) set.add(v._key); Object.values(v).forEach((x) => collectKeys(x, set)) } return set }
const FAQ = /^(Frequently asked questions|자주 묻는 질문|Perguntas frequentes|常见问题|常見問題)$/i
const words = (lines) => lines.join(' ').replace(/\*\*/g, '').replace(/^- /gm, '').split(/\s+/).filter(Boolean).length

// ---- content guards (owner rules) ----
const BANNED = /android|apple watch|white noise|baby monitor|monitor|privacy label|promo|\$\s?\d|R\$|NT\$|¥|RM\d|S\$|갤럭시|안드로이드|安卓|best overall|most accurate/i
const PREMIUM_ONLY = /Bee AI|Sleep Coach|Allergen Test|full (vaccine )?schedule|365-day|30, 90/i
function guard(key, [heading, ...lines]) {
  if (!/MamaBee/.test(heading)) throw new Error(`${key}: heading must name MamaBee`)
  for (const l of [heading, ...lines]) {
    if (BANNED.test(l)) throw new Error(`${key}: banned term in "${l.slice(0, 80)}"`)
    if (PREMIUM_ONLY.test(l) && !/Premium|프리미엄/.test(l)) throw new Error(`${key}: Premium feature without Premium label: "${l.slice(0, 80)}"`)
  }
  if (/\bfree\b[^.]*\b(Bee AI|Sleep Coach|Allergen Test)/i.test(lines.join(' '))) throw new Error(`${key}: possible "free" Premium feature`)
  if (key.startsWith('en/')) { const n = words(lines); if (n < 90 || n > 160) throw new Error(`${key}: ${n} words (want 90–160)`) }
}

const keys = Object.keys(S)
if (keys.length !== 62) throw new Error(`expected 62 entries, have ${keys.length}`)
for (const key of keys) guard(key, S[key])

const results = {updated: {}, skipped: [], drafts: []}
const samples = new Set(['en/baby-poop-color-chart', 'en/wake-windows-by-age', 'ko/well-baby-visit-schedule'])
const summary = []

for (const key of keys) {
  const [lang, slug] = key.split('/')
  let pubId = `mamabee-${slug}`
  if (lang !== 'en') {
    pubId = await c.fetch(`*[_type=="article" && slug.current==$slug && language==$lang && !(_id in path("drafts.**"))][0]._id`, {slug, lang})
    if (!pubId) { results.skipped.push(`${key}: no published doc found`); continue }
  }
  const draftId = `drafts.${pubId}`
  const [pub, draft] = await Promise.all([c.getDocument(pubId), c.getDocument(draftId)])
  if (!pub && !draft) { results.skipped.push(`${key}: ${pubId} not found`); continue }
  if (lang !== 'en' && pub && pub.language !== lang) { results.skipped.push(`${key}: ${pubId} language mismatch (${pub.language})`); continue }
  const base = draft || pub
  const body = base.body || []

  // idempotency: H2 with MamaBee after the last FAQ H2, or H3 with MamaBee after the FAQ section ends, or our exact heading anywhere
  const [heading, ...lines] = S[key]
  let faq = -1; body.forEach((b, i) => { if (b.style === 'h2' && FAQ.test(txt(b).trim())) faq = i })
  const faqEnd = faq < 0 ? 0 : (() => { const j = body.findIndex((b, i) => i > faq && b.style === 'h2'); return j < 0 ? body.length : j })()
  const already = body.some((b, i) => (b.style === 'h2' && i > faq && /MamaBee/.test(txt(b))) || (b.style === 'h3' && i >= faqEnd && /MamaBee/.test(txt(b))) || ((b.style === 'h2' || b.style === 'h3') && txt(b).trim() === heading))
  if (already) { results.skipped.push(`${key}: already has a MamaBee H2/H3 after the FAQ (${draft ? 'draft' : 'published'})`); continue }

  const ctaIdx = body.map((b, i) => (b._type === 'appCta' ? i : -1)).filter((i) => i >= 0).at(-1)
  if (ctaIdx === undefined) { results.skipped.push(`${key}: no appCta block`); continue }
  if (faq > ctaIdx) { results.skipped.push(`${key}: FAQ sits after the last CTA, needs manual placement`); continue }

  usedKeys = collectKeys(base, new Set())
  const blocks = [h2(heading), ...lines.map(line)]
  const newKeys = new Set(blocks.flatMap((b) => [b._key, ...b.children.map((s) => s._key)]))
  const newBody = [...body.slice(0, ctaIdx), ...blocks, ...body.slice(ctaIdx)]

  // verify: every existing block unchanged and in order; CTA count unchanged; section sits directly before the last CTA; keys unique
  const kept = newBody.filter((b) => !newKeys.has(b._key))
  if (!same(kept, body)) throw new Error(`${key}: existing blocks changed — stopping`)
  const ctaCount = (arr) => arr.filter((b) => b._type === 'appCta').length
  if (ctaCount(newBody) !== ctaCount(body)) throw new Error(`${key}: CTA count changed — stopping`)
  const lastCta = newBody.map((b, i) => (b._type === 'appCta' ? i : -1)).filter((i) => i >= 0).at(-1)
  if (newBody[lastCta]._key !== body[ctaIdx]._key || newBody[lastCta - blocks.length]._key !== blocks[0]._key) throw new Error(`${key}: placement check failed — stopping`)
  // block _keys must be unique in body; our new keys must be fresh (not used anywhere in the existing doc)
  const blockKeys = newBody.map((b) => b._key)
  if (new Set(blockKeys).size !== blockKeys.length) throw new Error(`${key}: duplicate block _key — stopping`)
  const existing = collectKeys(base, new Set())
  if ([...newKeys].some((x) => existing.has(x))) throw new Error(`${key}: new _key collides with an existing key — stopping`)

  const mode = draft ? 'insert-into-existing-draft' : 'new-draft-from-published'
  summary.push(`${key.padEnd(52)} ${mode.padEnd(26)} at ${ctaIdx}/${body.length}  ${lang === 'en' ? words(lines) + ' words' : ''}`)
  if (DRY) {
    if (samples.has(key)) {
      console.log(`\n==== SAMPLE ${key} → ${draftId} (${mode}), inserted before block ${ctaIdx} (CTA: "${body[ctaIdx].heading}")`)
      console.log(`  …previous block: [${body[ctaIdx - 1].style || body[ctaIdx - 1]._type}] ${txt(body[ctaIdx - 1]).slice(0, 90)}…`)
      for (const b of blocks) console.log(`  ${b.style === 'h2' ? '## ' : b.listItem ? '  • ' : ''}${b.children.map((s) => (s.marks.includes('strong') ? `**${s.text}**` : s.text)).join('')}`)
      console.log(`  [CTA] ${body[ctaIdx].heading}`)
    }
    continue
  }

  const pubRevBefore = pub?._rev
  if (draft) {
    await c.patch(draftId).ifRevisionId(draft._rev).insert('before', `body[_key=="${body[ctaIdx]._key}"]`, blocks).commit()
  } else {
    const {_rev, ...rest} = pub
    await c.create({...rest, _id: draftId, body: newBody})
  }
  // post-write verification
  const after = await c.getDocument(draftId)
  if (!same(after.body, newBody)) throw new Error(`${key}: post-write body mismatch in ${draftId} — stopping`)
  if (pub) { const p2 = await c.getDocument(pubId); if (p2._rev !== pubRevBefore) throw new Error(`${key}: published doc ${pubId} changed — stopping`) }
  results.updated[lang] = (results.updated[lang] || 0) + 1
  results.drafts.push(`${draftId} (${draft ? 'modified' : 'created'})`)
  console.log('saved', draftId, draft ? '(existing draft)' : '(new draft)')
}

console.log('\n---- summary ----\n' + summary.join('\n'))
if (results.skipped.length) console.log('\nskipped:\n  ' + results.skipped.join('\n  '))
if (!DRY) console.log('\nupdated per language:', results.updated, '\n\ndrafts:\n  ' + results.drafts.join('\n  '))
else console.log(`\nDRY: ${summary.length} would be written, ${results.skipped.length} skipped`)
