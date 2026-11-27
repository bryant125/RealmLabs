// Week-15 MamaBee company pages: "mamabee-creator-program" and "mamabee-feature-requests"
// in en, ja, ko, zh-tw, zh-cn and pt-br, saved as DRAFTS only (never published by this script).
// These are company pages, not health articles: no medical claims, no prices, no invented
// percentages, payout schedules, follower minimums, contract terms, features or timelines.
// MamaBee facts follow reports/briefs/MAMABEE-FIRST-BRIEF.md. Contact: support@mamabee.app.
// IDs: EN drafts.mamabee-<slug> (no language field, like other EN docs);
//      localized drafts.mamabee-<lang>-<slug> with language=<lang> (like intl-wave2-*).
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week15-community.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week15-community.mjs
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

// Published article whose coverImage each draft copies (fallbacks in order), per the week-15 brief.
const COVERS = {
  'mamabee-creator-program': ['day-with-mamabee-baby-tracker', '3am-question-mamabee-ai-tracker'],
  'mamabee-feature-requests': ['3am-question-mamabee-ai-tracker', 'day-with-mamabee-baby-tracker'],
}
const MAIL_CREATOR = 'mailto:support@mamabee.app?subject=Creator%20program'
const MAIL_IDEA = 'mailto:support@mamabee.app?subject=Feature%20idea'
const base = (lang) => (lang === 'en' ? '/mamabee/articles/' : `/mamabee/${lang}/articles/`)
const FAQ_H2 = {en: 'Frequently asked questions', ja: 'よくある質問', ko: '자주 묻는 질문', 'zh-tw': '常見問題', 'zh-cn': '常见问题', 'pt-br': 'Perguntas frequentes'}

const PAGES = {}

// ───────────────────────────────── EN ─────────────────────────────────
PAGES.en = [
  A('mamabee-creator-program',
    'MamaBee Creator Program: Partner With Us, No Upfront Cost',
    'Mom or parent creator? Share MamaBee, the ad-free iPhone baby tracker, with your audience and earn a revenue share. No upfront cost, any size welcome.',
    ['mamabee creator program', 'mom influencer program', 'parenting creator partnership', 'revenue share'],
    {
      glance: {
        caption: 'The MamaBee Creator Program at a glance. Full terms are shared by email.',
        headers: ['Question', 'Answer'],
        rows: [
          ['Who it is for', 'Mom, dad and caregiver creators who share parenting life and tips'],
          ['Where', 'Instagram, TikTok, YouTube, blogs, newsletters and other channels'],
          ['Cost to join', 'Nothing. There is no upfront cost'],
          ['How you earn', 'A share of the revenue you bring in'],
          ['What we provide', 'MamaBee Premium access, so you can try every feature properly'],
          ['Audience size', 'Any size is welcome'],
          ['Full terms', 'We share them with you by email'],
          ['How to apply', 'Email support@mamabee.app with the subject "Creator program"'],
        ],
      },
    },
`**The MamaBee Creator Program is for mom and parent creators who share real family life on Instagram, TikTok, YouTube or a blog. You introduce MamaBee to your audience and earn a share of the revenue you bring in. It costs nothing to join, any audience size is welcome, and we give you Premium access to try it properly.**
Hi, we're a small team at Realm Labs, the people who build MamaBee. We made it because we wanted a baby tracker that is calm, fast enough to use with one thumb at 3 AM, and free of ads. We also believe the most trusted advice about baby apps comes from parents who actually use them. That's why we want to work with creators who already help other families get through the newborn months.
## Who is the creator program for?
- **Moms, dads and caregivers who create.** You share parenting life, routines or tips on Instagram, TikTok, YouTube, a blog, a newsletter or anywhere your audience gathers.
- **People who would only recommend what they like.** You use a baby tracker, or you'd like to try one, and you want to tell your followers honestly what you think.
- **Any audience size.** A small account with followers who trust you matters to us as much as a big one.
- **iPhone families.** MamaBee is iPhone only for now (iOS 17.6 or later), so you'll need an iPhone to try it, and it suits audiences where many parents use iPhone.
## How does it work?
- **Step 1: Email us.** Write to [support@mamabee.app](${MAIL_CREATOR}) with the subject "Creator program".
- **Step 2: Get the details.** We reply personally, share the full terms by email and set you up with MamaBee Premium.
- **Step 3: Use it for real.** Track feeds, sleep and diapers with your own baby, and see what fits your family.
- **Step 4: Share it your way.** A day-in-the-life Reel, a night-feed routine on TikTok, a YouTube review or a blog post. Your voice, your format.
- **Step 5: Earn a revenue share.** You earn a share of the revenue you bring in. Exactly how that works is in the terms we send you, so you can decide before you commit.
[[TABLE:glance]]
## What we offer creators
- **No upfront cost.** You never pay anything to join.
- **Premium access.** You can test Sleep Coach nap prediction, unlimited Bee AI and the full vaccine schedule, not just the free features, so your review is based on the whole app.
- **A direct line to the people who build the app.** Your questions and your followers' feedback go straight to our team.
- **Room to be honest.** We would rather you share what you really think, including what MamaBee doesn't do yet.
## What can you tell your audience about MamaBee?
Here is what MamaBee does today, so everything you share is accurate:
- **No ads on any tier**, including the free version.
- **Free real-time sync for 2 caregivers**, so both parents see every feed and nap.
- **Free one-thumb logging:** sleep, breastfeeding with left and right timers, bottles, pumping, diapers, solids, temperature, medicine, symptoms and more.
- **Free growth and development tools:** WHO growth percentiles, 45+ CDC milestones, a timeline with 7-day insights, and a PDF export to bring to the pediatrician.
- **Premium:** Sleep Coach nap prediction, unlimited Bee AI (an assistant that knows your baby's log), the full vaccine schedule, a solid food allergen test, multi-baby sync and extra co-parents.
- **Privacy:** logs stay on the phone and only reach our servers if Co-Parent Sharing is on. We never sell your data.
## How to apply
Email [support@mamabee.app](${MAIL_CREATOR}) with the subject **"Creator program"** and include:
- links to your channels
- the country you live in
- your audience size (a rough number is fine)
- if you like, a line about your family and what you usually share
We read every email and reply personally.
## ${FAQ_H2.en}
### Does it cost anything to join?
No. There is no upfront cost, and we provide Premium access so you can try MamaBee properly.
### Do I need a lot of followers?
No. Creators of any size are welcome. Tell us your audience size in your email so we understand your channel.
### What share of the revenue do creators earn?
We'll share the full terms, including how the revenue share works, by email after you get in touch.
### Do I have to say only good things?
No. Honest content helps parents most. Please label partnership posts the way your country and platform require, for example with #ad.
### Can dads and other caregivers join?
Yes. The program is open to any parent or caregiver who creates parenting content.
[[CTA||Try MamaBee before you share it: the ad-free baby tracker for iPhone.]]
Have an idea for the app itself? See [MamaBee feature requests](${base('en')}mamabee-feature-requests) and tell us what to build next.`),

  A('mamabee-feature-requests',
    'MamaBee Feature Requests: Tell Us What to Build Next',
    'Tell the MamaBee team which features would help you most. Email support@mamabee.app. We read every email and try our best to build workable ideas.',
    ['mamabee feature requests', 'mamabee feedback', 'baby tracker app ideas', 'contact mamabee'],
    {
      today: {
        caption: 'What MamaBee already does (iPhone, iOS 17.6 or later)',
        headers: ['Free', 'Premium'],
        rows: [
          ['No ads, on every tier', 'Everything in Free'],
          ['One-thumb logging: sleep, breastfeeding with left/right timers, bottles, pumping, diapers, solids, temperature, medicine, symptoms, doctor visits, custom logs', 'Sleep Coach nap prediction'],
          ['Real-time sync for 2 caregivers', 'Unlimited Bee AI, an assistant that knows your log'],
          ['WHO growth percentiles and 45+ CDC milestones', 'Full vaccine schedule'],
          ['Timeline, 7-day insights and widgets', 'Solid Food Allergen Test'],
          ['Export to CSV, JSON and a pediatrician PDF', 'Multi-baby sync and extra co-parents'],
          ['First 3 months of the vaccine schedule', '30, 90 and 365-day insights'],
        ],
      },
    },
`**Want MamaBee to do something it doesn't do yet? Email support@mamabee.app with the subject "Feature idea" and tell us what would make your days with a baby easier. We're a small team at Realm Labs. We read every email, and we'll try our best to build the ideas that are workable and help new parents around the world.**
We build MamaBee for moms and parents everywhere, from New York to Tokyo, Seoul, Taipei and São Paulo. Many of the best ideas in a baby tracker start with a parent noticing one small frustration at 3 AM. We can't promise that every idea will be built, or say when, but every message is read by the people who make the app, and it shapes what we work on.
## How do I send a feature request?
- **Write to** [support@mamabee.app](${MAIL_IDEA}).
- **Use the subject** "Feature idea", so your message reaches the right pile.
- **Describe the problem, not only the solution.** "I can't tell which side I fed on last when I'm half asleep" helps us more than "add a button".
- **One idea per email is perfect**, but a list is welcome too.
## What to include in your email
- **Your baby's age**, since needs at 2 weeks are very different from needs at 10 months
- **What you're trying to do**, and what gets in the way today
- **Which phone you use**, such as your iPhone model and iOS version
- **Your country**, because feeding, vaccines and checkups differ around the world
- **A screenshot**, if it helps explain
## What MamaBee already does
Before you write, here is what MamaBee can do today. If something here doesn't work the way you need, that is useful feedback too.
[[TABLE:today]]
## What do parents often ask about?
Tell us if you need any of these. They are the kinds of things parents ask about, not promises or hints about upcoming features:
- **Other devices.** MamaBee is iPhone only today. Tell us if you need it on Android, iPad or Apple Watch, and who in your family would use it.
- **Soothing sounds.** Tell us if you'd use white noise or lullabies inside a tracker.
- **Pregnancy.** Tell us if you'd like to start tracking before your baby arrives.
- **A log or chart we don't have.** Tell us what you track on paper or in your notes app today.
- **Anything that saves a tap.** The small things that would make one-thumb logging even faster.
## What happens after you email?
We read every message. Sometimes we reply with a question so we understand your situation better. We group similar requests, which helps us see what many families need. We'll try our best to build the ideas that are workable, but we can't promise specific features or dates. Found a bug instead? Email the same address and tell us what happened.
## ${FAQ_H2.en}
### Will you build my idea?
We can't promise that, but we read every email and try our best to build workable ideas that help new parents. The more we understand your situation, the better.
### Is MamaBee free?
MamaBee is free to download, with no ads and free everyday logging. Sleep Coach, unlimited Bee AI and the full vaccine schedule are part of Premium.
### Can I suggest something for a different country?
Yes, please do. Tell us your country and what is different there, such as local feeding guidance or how checkups work.
[[CTA||Not using MamaBee yet? Try the ad-free baby tracker on iPhone.]]
Are you a parent creator? Read about the [MamaBee Creator Program](${base('en')}mamabee-creator-program).`),
]

// ───────────────────────────────── JA ─────────────────────────────────
PAGES.ja = [
  A('mamabee-creator-program',
    'MamaBee クリエイター募集｜初期費用なしの提携',
    '育児について発信しているママ・パパへ。MamaBee をフォロワーに紹介し、生まれた売上の一部を受け取るレベニューシェア型の提携です。初期費用なし、フォロワー数は問いません。',
    ['MamaBee', 'クリエイター募集', 'ママインフルエンサー', 'PR案件', 'レベニューシェア'],
    {
      glance: {
        caption: 'MamaBee クリエイタープログラムの概要。詳しい条件はメールでお知らせします。',
        headers: ['項目', '内容'],
        rows: [
          ['対象', '育児について発信しているママ・パパ・家族'],
          ['発信の場', 'Instagram、TikTok、YouTube、アメブロ、X、note など'],
          ['参加費', 'かかりません（初期費用なし）'],
          ['報酬', '紹介から生まれた売上の一部（レベニューシェア）'],
          ['ご用意するもの', 'MamaBee Premium（すべての機能を試せます）'],
          ['フォロワー数', '問いません'],
          ['詳しい条件', 'メールでお知らせします'],
          ['応募方法', 'support@mamabee.app に件名「Creator program」でメール'],
        ],
      },
    },
`**MamaBee クリエイタープログラムは、Instagram、TikTok、YouTube、アメブロなどで育児について発信しているママ・パパのための提携制度です。MamaBee をフォロワーに紹介し、そこから生まれた売上の一部を受け取るレベニューシェア型で、初期費用はかかりません。フォロワー数は問わず、Premium もご用意します。**
はじめまして。MamaBee を開発している Realm Labs の小さなチームです。夜中の授乳中でも片手でさっと記録できて、広告に邪魔されない育児記録アプリがほしい。そんな思いから MamaBee を作りました。
アプリ選びでいちばん頼りになるのは、実際に使っている先輩ママ・パパの声だと私たちは考えています。だからこそ、毎日フォロワーの子育てに寄り添っている発信者の方と一緒に、MamaBee を届けていきたいのです。
## どんな人が対象ですか？
- **育児について発信しているママ・パパ。**Instagram のリールやストーリーズ、TikTok、YouTube、アメブロ（Ameba ブログ）、X、note など、場所は問いません。
- **本当に良いと思ったものだけを紹介したい方。**育児記録アプリを使っている方、これから試してみたい方を歓迎します。
- **フォロワー数の条件はありません。**小さなアカウントでも、信頼してくれるフォロワーがいることのほうが大切です。
- **iPhone をお使いの方。**MamaBee は今のところ iPhone 専用（iOS 17.6以降）です。お試しには iPhone が必要です。
## どんな仕組みですか？
- **1. メールで応募：**[support@mamabee.app](${MAIL_CREATOR}) に、件名「Creator program」で送ってください。
- **2. 条件のご案内：**チームから直接お返事し、詳しい条件をメールでお知らせします。あわせて MamaBee Premium をご用意します。
- **3. 実際に使う：**ご自身の赤ちゃんの授乳・睡眠・おむつを記録して、ご家庭に合うか確かめてください。
- **4. 自分の言葉で紹介：**1日の流れを見せるリール、夜間授乳のルーティン動画、YouTube のレビュー、ブログ記事など、形式は自由です。
- **5. レベニューシェア：**紹介から生まれた売上の一部をお受け取りいただきます。具体的なしくみはお送りする条件に書いてありますので、納得してから参加を決めてください。
[[TABLE:glance]]
## 私たちが提供できること
- **初期費用なし。**参加にお金はかかりません。
- **Premium をご用意。**Sleep Coach（お昼寝の予測）、回数無制限の Bee AI、予防接種スケジュールの全期間まで試せるので、アプリ全体を見たうえで紹介できます。
- **開発チームと直接やりとり。**ご質問やフォロワーさんの声は、アプリを作っている私たちに直接届きます。
- **正直な感想で大丈夫。**MamaBee にまだできないことも含めて、感じたままを伝えてください。
## MamaBee の紹介ポイント
正確に伝えていただけるよう、MamaBee が今できることをまとめました。
- **どのプランでも広告なし。**無料版にも広告は出ません。
- **2人までのリアルタイム同期が無料。**夫婦で授乳やお昼寝の記録をすぐに共有できます。
- **片手で記録（無料）：**睡眠、左右タイマー付きの授乳、ミルク、搾乳、おむつ、離乳食、体温、お薬、症状など。
- **成長と発達（無料）：**WHO の成長曲線パーセンタイル、45項目以上の CDC 発達マイルストーン、タイムラインと7日間のインサイト、小児科で見せられる PDF の書き出し。
- **Premium：**Sleep Coach、回数無制限の Bee AI（記録をふまえて答えるアシスタント）、予防接種スケジュールの全期間、離乳食のアレルゲンテスト、複数の赤ちゃんの同期と3人目以降の家族共有。
- **プライバシー：**記録は基本的に端末の中に保存され、共有をオンにしたときだけ Realm Labs のサーバーに送られます。データを販売することはありません。
## 応募方法
[support@mamabee.app](${MAIL_CREATOR}) に、件名を **「Creator program」** にして、次の内容をお送りください。
- 発信しているチャンネルの URL
- お住まいの国
- フォロワー数（おおよそで大丈夫です）
- よろしければ、ご家族のことや普段発信している内容をひとこと
日本語のメールで大丈夫です。すべてのメールに目を通し、一通ずつお返事します。
## ${FAQ_H2.ja}
### 参加費はかかりますか？
かかりません。初期費用はなく、MamaBee Premium もこちらでご用意します。
### フォロワーが少なくても応募できますか？
できます。フォロワー数の条件はありません。メールにおおよその人数を書いていただければ、チャンネルの様子がつかみやすくなります。
### 報酬の割合はどれくらいですか？
レベニューシェアのしくみを含め、詳しい条件はご連絡いただいたあとにメールでお知らせします。
### 良いことだけを書かないといけませんか？
いいえ。正直な感想こそ、ほかのママ・パパの役に立ちます。なお日本では、2023年10月から景品表示法でいわゆるステルスマーケティングが規制されています。提携の投稿には「PR」などの表記をお願いします。
[[CTA||紹介する前に、まずは広告なしの MamaBee を iPhone で試してみてください]]
アプリへのご要望がある方は「[MamaBee への機能リクエスト](${base('ja')}mamabee-feature-requests)」もご覧ください。`),

  A('mamabee-feature-requests',
    'MamaBee への機能リクエスト・ご意見募集',
    'MamaBee にほしい機能や改善してほしい点を、support@mamabee.app までお送りください。開発チームがすべてのメールに目を通し、実現できるアイデアの形にできるよう力を尽くします。',
    ['MamaBee', '機能リクエスト', 'ご意見募集', '育児記録アプリ'],
    {
      today: {
        caption: 'MamaBee が今できること（iPhone 専用・iOS 17.6以降）',
        headers: ['無料', 'Premium'],
        rows: [
          ['どのプランでも広告なし', '無料版のすべての機能'],
          ['片手で記録：睡眠、左右タイマー付き授乳、ミルク、搾乳、おむつ、離乳食、体温、お薬、症状、受診、カスタム記録', 'Sleep Coach（お昼寝の予測）'],
          ['2人までのリアルタイム同期', '回数無制限の Bee AI（記録をふまえて答えるアシスタント）'],
          ['WHO 成長曲線パーセンタイル、45項目以上の CDC 発達マイルストーン', '予防接種スケジュールの全期間'],
          ['タイムライン、7日間のインサイト、ウィジェット', '離乳食のアレルゲンテスト'],
          ['CSV・JSON・小児科向け PDF の書き出し', '複数の赤ちゃんの同期、3人目以降の家族共有'],
          ['予防接種スケジュール（最初の3か月分）', '30日・90日・365日のインサイト'],
        ],
      },
    },
`**「MamaBee にこんな機能があったらいいのに」と思ったら、support@mamabee.app に件名「Feature idea」でメールをください。私たちは Realm Labs の小さなチームです。いただいたメールにはすべて目を通し、実現できるアイデアは、世界中の新米ママ・パパの助けになるよう形にできるよう力を尽くします。**
MamaBee は、日本、台湾、韓国、アメリカ、ブラジルなど、世界中のママ・パパに使っていただくことを目指して作っています。育児記録アプリの良いアイデアの多くは、夜中の授乳中にふと感じた「ちょっと不便」から生まれます。すべてのご要望にお応えできるとは限らず、時期をお約束することもできませんが、届いた声は開発メンバーが直接読み、これからの開発の参考にしています。
## 機能リクエストの送り方
- **宛先：**[support@mamabee.app](${MAIL_IDEA})
- **件名：**「Feature idea」にしていただくと、確実に担当に届きます。
- **困っていることを書いてください。**「寝ぼけていて、前回どちらの胸で授乳したか分からなくなる」のような具体的な場面が、「ボタンを追加して」よりも大きなヒントになります。
- **1通に1つのアイデア**が理想ですが、まとめて送っていただいても大丈夫です。日本語でどうぞ。
## メールに書いてほしいこと
- **赤ちゃんの月齢**（生後2週と生後10か月では、必要なものがまったく違います）
- **やりたいこと**と、今それがうまくいかない理由
- **お使いのスマホ**（iPhone の機種と iOS のバージョン）
- **お住まいの国**（授乳や予防接種、健診のしくみは国によって違います）
- 説明しやすければ、**スクリーンショット**
## MamaBee が今できること
メールの前に、現在の機能をまとめました。ここにある機能が「思っていた使い方と違う」という声も、大切なフィードバックです。
[[TABLE:today]]
## よくいただくご要望
次のようなものが必要でしたら教えてください。ママ・パパからよく話題に出るものを挙げただけで、今後の追加をお約束したり、予告したりするものではありません。
- **ほかの端末で使いたい。**MamaBee は今のところ iPhone 専用です。Android、iPad、Apple Watch で使いたい方は、ご家族のだれが使うかも添えて教えてください。
- **寝かしつけの音。**ホワイトノイズや子守唄をアプリの中で使いたいかどうか。
- **妊娠中から使いたい。**赤ちゃんが生まれる前から記録を始めたいかどうか。
- **まだない記録やグラフ。**今、紙の育児日記やメモアプリでつけているものを教えてください。
- **タップを1回でも減らしたい。**片手での記録がもっと速くなる、小さな工夫も大歓迎です。
## メールを送ったあとは？
すべてのメールを読みます。状況をよく理解するために、こちらから質問をお返しすることもあります。似たご要望はまとめて整理し、多くのご家庭に必要なものを見きわめています。実現できるアイデアは形にできるよう力を尽くしますが、特定の機能や時期をお約束することはできません。不具合を見つけたときも、同じアドレスに「何が起きたか」を書いてお送りください。
## ${FAQ_H2.ja}
### 送ったアイデアは実現しますか？
お約束はできませんが、すべてのメールに目を通し、新米ママ・パパの助けになる実現可能なアイデアは形にできるよう努めます。状況を詳しく書いていただけるほど助かります。
### MamaBee は無料ですか？
ダウンロードは無料で、広告なしで毎日の記録ができます。Sleep Coach、回数無制限の Bee AI、予防接種スケジュールの全期間は Premium の機能です。
### 日本ならではの要望も送っていいですか？
もちろんです。母子手帳の使い方や乳幼児健診のことなど、日本ならではの事情をぜひ教えてください。
[[CTA||まだ MamaBee を使っていない方は、広告なしの育児記録を iPhone で試してみませんか]]
育児について発信している方は「[MamaBee クリエイタープログラム](${base('ja')}mamabee-creator-program)」もご覧ください。`),
]

// ───────────────────────────────── KO ─────────────────────────────────
PAGES.ko = [
  A('mamabee-creator-program',
    'MamaBee 크리에이터 모집: 수익 공유 파트너십',
    '육아 콘텐츠를 만드는 엄마·아빠 크리에이터를 찾습니다. MamaBee를 소개하고 발생한 수익의 일부를 나누는 방식이에요. 초기 비용은 없고, 팔로워 수와 관계없이 지원할 수 있어요.',
    ['MamaBee', '육아 크리에이터', '육아 인플루언서', '수익 공유'],
    {
      glance: {
        caption: 'MamaBee 크리에이터 프로그램 한눈에 보기. 자세한 조건은 이메일로 안내해 드려요.',
        headers: ['항목', '내용'],
        rows: [
          ['대상', '육아 일상과 팁을 나누는 엄마·아빠·양육자 크리에이터'],
          ['채널', '네이버 블로그, 인스타그램, 유튜브, 틱톡 등'],
          ['참여 비용', '없음 (초기 비용 없음)'],
          ['수익', '소개를 통해 발생한 수익의 일부 (수익 공유)'],
          ['제공', 'MamaBee 프리미엄 이용 권한'],
          ['팔로워 수', '제한 없음'],
          ['자세한 조건', '이메일로 안내'],
          ['지원 방법', 'support@mamabee.app 으로 제목 "Creator program" 메일'],
        ],
      },
    },
`**MamaBee 크리에이터 프로그램은 네이버 블로그, 인스타그램, 유튜브, 틱톡에서 육아 이야기를 나누는 엄마·아빠를 위한 파트너십이에요. 구독자와 이웃에게 MamaBee를 소개하고, 그로 인해 발생한 수익의 일부를 받는 수익 공유 방식이에요. 초기 비용은 없고, 팔로워 수와 상관없이 환영하며, 프리미엄도 제공해 드려요.**
안녕하세요, MamaBee를 만드는 Realm Labs의 작은 팀이에요. 새벽 수유 중에도 한 손으로 빠르게 기록할 수 있고, 광고 없이 차분하게 쓸 수 있는 육아 기록 앱이 있었으면 해서 MamaBee를 만들었어요.
앱을 고를 때 가장 믿음이 가는 건 직접 써 본 선배 엄마·아빠의 후기라고 생각해요. 그래서 이미 많은 가족의 육아를 곁에서 돕고 있는 크리에이터분들과 함께 MamaBee를 알리고 싶어요.
## 어떤 분이 지원할 수 있나요?
- **육아 콘텐츠를 만드는 엄마·아빠·양육자.** 네이버 블로그 육아일기, 인스타그램 릴스, 유튜브 브이로그, 틱톡 등 채널은 상관없어요.
- **정말 좋다고 느낀 것만 추천하고 싶은 분.** 육아 기록 앱을 쓰고 있거나 써 보고 싶은 분이라면 좋아요.
- **팔로워 수 제한은 없어요.** 규모보다 크리에이터를 믿고 찾아오는 이웃이 더 중요해요.
- **아이폰 사용자.** MamaBee는 현재 아이폰 전용(iOS 17.6 이상)이라, 써 보시려면 아이폰이 필요해요.
## 어떻게 진행되나요?
- **1단계, 이메일 지원:** [support@mamabee.app](${MAIL_CREATOR}) 으로 제목을 "Creator program"으로 해서 보내 주세요.
- **2단계, 조건 안내:** 저희 팀이 직접 답장을 드리고, 자세한 조건을 이메일로 안내해 드려요. MamaBee 프리미엄도 함께 준비해 드려요.
- **3단계, 직접 사용:** 아기의 수유, 수면, 기저귀를 기록하면서 우리 집에 맞는지 확인해 보세요.
- **4단계, 나만의 방식으로 소개:** 하루 루틴 릴스, 밤수유 브이로그, 네이버 블로그 사용 후기 등 형식은 자유예요.
- **5단계, 수익 공유:** 소개를 통해 발생한 수익의 일부를 받으세요. 구체적인 방식은 보내 드리는 조건에 담겨 있으니, 충분히 보고 결정하시면 돼요.
[[TABLE:glance]]
## 크리에이터에게 드리는 것
- **초기 비용 없음.** 참여하는 데 돈이 들지 않아요.
- **프리미엄 제공.** Sleep Coach 낮잠 예측, 무제한 Bee AI, 전체 예방접종 일정까지 써 보고 앱 전체를 바탕으로 후기를 쓸 수 있어요.
- **개발팀과 바로 소통.** 궁금한 점이나 구독자 의견이 앱을 만드는 저희에게 바로 전달돼요.
- **솔직한 후기 환영.** MamaBee가 아직 못 하는 부분까지 느낀 그대로 이야기해 주세요.
## MamaBee 소개 포인트
정확하게 소개하실 수 있도록, MamaBee가 지금 할 수 있는 것을 정리했어요.
- **모든 요금제에 광고가 없어요.** 무료 버전도 마찬가지예요.
- **2명까지 실시간 공동양육 동기화가 무료예요.** 엄마가 기록한 수유를 아빠 폰에서 바로 볼 수 있어요.
- **한 손 기록(무료):** 수면, 좌우 타이머가 있는 모유수유, 분유, 유축, 기저귀, 이유식, 체온, 투약, 증상 등.
- **성장·발달(무료):** WHO 성장 백분위, 45개 이상의 CDC 발달 이정표, 타임라인과 7일 인사이트, 소아과에 보여 줄 수 있는 PDF 내보내기.
- **프리미엄:** Sleep Coach, 무제한 Bee AI(기록을 바탕으로 답하는 도우미), 전체 예방접종 일정, 이유식 알레르기 테스트, 다둥이 동기화와 공동양육자 추가.
- **개인정보:** 기록은 기본적으로 휴대폰에 저장되고, 공동양육 공유를 켰을 때만 Realm Labs 서버로 전송돼요. 데이터를 판매하지 않아요.
## 지원 방법
[support@mamabee.app](${MAIL_CREATOR}) 으로 제목을 **"Creator program"** 으로 해서 아래 내용을 보내 주세요.
- 운영 중인 채널 링크
- 사는 나라
- 팔로워나 이웃 수 (대략적인 숫자도 괜찮아요)
- 원하시면 가족 이야기나 주로 다루는 콘텐츠를 한 줄로
한국어로 보내 주셔도 괜찮아요. 모든 메일을 읽고 한 분 한 분께 답장드려요.
## ${FAQ_H2.ko}
### 참여 비용이 있나요?
없어요. 초기 비용이 없고, MamaBee 프리미엄도 저희가 준비해 드려요.
### 팔로워가 적어도 지원할 수 있나요?
네. 팔로워 수 제한이 없어요. 메일에 대략적인 규모를 적어 주시면 채널을 이해하는 데 도움이 돼요.
### 수익 배분 비율은 어떻게 되나요?
수익 공유 방식을 포함한 자세한 조건은 연락 주시면 이메일로 안내해 드려요.
### 좋은 이야기만 써야 하나요?
아니에요. 솔직한 후기가 다른 부모에게 가장 도움이 돼요. 한국에서는 공정거래위원회 지침에 따라 협업 콘텐츠에 '광고', '협찬' 같은 표시를 해야 하니 꼭 표시해 주세요.
[[CTA||소개하기 전에 광고 없는 MamaBee를 아이폰에서 먼저 써 보세요]]
앱에 바라는 기능이 있다면 [MamaBee 기능 제안](${base('ko')}mamabee-feature-requests) 페이지도 확인해 주세요.`),

  A('mamabee-feature-requests',
    'MamaBee 기능 제안: 필요한 기능을 알려 주세요',
    'MamaBee에 바라는 기능이나 개선할 점을 support@mamabee.app 으로 보내 주세요. 개발팀이 모든 메일을 읽고, 실현 가능한 아이디어는 최선을 다해 만들어 볼게요.',
    ['MamaBee', '기능 제안', '육아 앱 피드백', '육아 기록 앱'],
    {
      today: {
        caption: 'MamaBee가 지금 할 수 있는 것 (아이폰 전용, iOS 17.6 이상)',
        headers: ['무료', '프리미엄'],
        rows: [
          ['모든 요금제 광고 없음', '무료 기능 전체'],
          ['한 손 기록: 수면, 좌우 타이머 모유수유, 분유, 유축, 기저귀, 이유식, 체온, 투약, 증상, 진료, 맞춤 기록', 'Sleep Coach 낮잠 예측'],
          ['2명까지 실시간 동기화', '무제한 Bee AI (기록을 바탕으로 답하는 도우미)'],
          ['WHO 성장 백분위, 45개 이상 CDC 발달 이정표', '전체 예방접종 일정'],
          ['타임라인, 7일 인사이트, 위젯', '이유식 알레르기 테스트'],
          ['CSV·JSON·소아과용 PDF 내보내기', '다둥이 동기화, 공동양육자 추가'],
          ['예방접종 일정 첫 3개월', '30·90·365일 인사이트'],
        ],
      },
    },
`**MamaBee에 이런 기능이 있었으면 좋겠다 싶을 때, support@mamabee.app 으로 제목을 "Feature idea"로 해서 메일을 보내 주세요. 저희는 Realm Labs의 작은 팀이에요. 모든 메일을 읽고, 실현 가능한 아이디어는 전 세계 초보 엄마·아빠에게 도움이 되도록 최선을 다해 만들어 볼게요.**
MamaBee는 한국, 일본, 대만, 미국, 브라질 등 세계 곳곳의 엄마·아빠를 위해 만들고 있어요. 좋은 육아 앱 아이디어는 대부분 새벽 수유 중에 느낀 작은 불편함에서 시작돼요. 모든 제안을 반영하거나 시기를 약속드릴 수는 없지만, 보내 주신 의견은 앱을 만드는 팀원이 직접 읽고 앞으로의 개발에 참고해요.
## 기능 제안은 어떻게 보내나요?
- **받는 주소:** [support@mamabee.app](${MAIL_IDEA})
- **제목:** "Feature idea"로 해 주시면 담당자에게 바로 전달돼요.
- **불편한 상황을 적어 주세요.** "비몽사몽이라 마지막에 어느 쪽으로 수유했는지 헷갈려요" 같은 구체적인 장면이 "버튼 하나 추가해 주세요"보다 훨씬 큰 도움이 돼요.
- **메일 한 통에 아이디어 하나**가 가장 좋지만, 여러 개를 모아 보내셔도 괜찮아요. 한국어로 편하게 써 주세요.
## 메일에 적어 주시면 좋은 것
- **아기 개월 수** (생후 2주와 10개월은 필요한 게 전혀 달라요)
- **하고 싶은 일**과 지금 그게 어려운 이유
- **사용하는 휴대폰** (아이폰 모델과 iOS 버전)
- **사는 나라** (수유, 예방접종, 영유아 검진 방식이 나라마다 달라요)
- 설명에 도움이 된다면 **스크린샷**
## MamaBee가 지금 할 수 있는 것
메일을 보내기 전에 현재 기능을 확인해 보세요. 여기 있는 기능이 원하는 방식과 다르다는 의견도 소중한 피드백이에요.
[[TABLE:today]]
## 부모님들이 자주 이야기하는 것
아래 중 필요한 것이 있다면 알려 주세요. 부모님들이 자주 이야기하는 주제를 모은 것일 뿐, 추가를 약속하거나 예고하는 것이 아니에요.
- **다른 기기.** MamaBee는 현재 아이폰 전용이에요. 안드로이드, 아이패드, 애플워치가 필요하다면 가족 중 누가 쓸지도 함께 알려 주세요.
- **재우기 소리.** 백색소음이나 자장가를 앱 안에서 쓰고 싶은지.
- **임신 중 기록.** 아기가 태어나기 전부터 기록을 시작하고 싶은지.
- **아직 없는 기록이나 그래프.** 지금 육아수첩이나 메모 앱에 따로 적고 있는 것을 알려 주세요.
- **탭 한 번이라도 줄이기.** 한 손 기록을 더 빠르게 만드는 작은 아이디어도 환영해요.
## 메일을 보내면 어떻게 되나요?
모든 메일을 읽어요. 상황을 더 잘 이해하기 위해 저희가 질문을 드릴 때도 있어요. 비슷한 제안은 모아서 정리하고, 많은 가족에게 필요한 것이 무엇인지 살펴봐요. 실현 가능한 아이디어는 최선을 다해 만들어 보겠지만, 특정 기능이나 시기를 약속드릴 수는 없어요. 오류를 발견하셨다면 같은 주소로 어떤 일이 있었는지 적어 보내 주세요.
## ${FAQ_H2.ko}
### 제가 보낸 아이디어가 반영되나요?
약속드릴 수는 없지만, 모든 메일을 읽고 초보 부모에게 도움이 되는 실현 가능한 아이디어는 최선을 다해 만들어 볼게요. 상황을 자세히 적어 주실수록 큰 도움이 돼요.
### MamaBee는 무료인가요?
다운로드는 무료이고, 광고 없이 매일 기록할 수 있어요. Sleep Coach, 무제한 Bee AI, 전체 예방접종 일정은 프리미엄 기능이에요.
### 한국 상황에 맞는 제안도 보내도 되나요?
물론이에요. 영유아 검진이나 이유식 방식처럼 한국에서만 필요한 부분이 있다면 꼭 알려 주세요.
[[CTA||아직 MamaBee를 안 써 보셨다면, 광고 없는 육아 기록을 아이폰에서 시작해 보세요]]
육아 콘텐츠를 만드신다면 [MamaBee 크리에이터 프로그램](${base('ko')}mamabee-creator-program)도 확인해 주세요.`),
]

// ───────────────────────────────── ZH-TW ─────────────────────────────────
PAGES['zh-tw'] = [
  A('mamabee-creator-program',
    'MamaBee創作者招募：零成本分潤合作',
    '經營育兒內容的媽媽、爸爸創作者，歡迎加入MamaBee創作者計畫：把MamaBee分享給粉絲，從你帶來的營收中分潤。不需要任何前期費用，粉絲人數不限。',
    ['MamaBee', '創作者招募', '育兒網紅合作', '分潤合作'],
    {
      glance: {
        caption: 'MamaBee創作者計畫一覽。完整條件會用電子郵件寄給你。',
        headers: ['項目', '內容'],
        rows: [
          ['適合誰', '分享育兒日常與經驗的媽媽、爸爸、照顧者'],
          ['平台', 'Threads、Instagram、YouTube、TikTok、Facebook、部落格等'],
          ['加入費用', '不需要（零前期費用）'],
          ['收益方式', '從你帶來的營收中分潤'],
          ['我們提供', 'MamaBee Premium，所有功能都能完整試用'],
          ['粉絲人數', '不限'],
          ['完整條件', '用電子郵件寄給你'],
          ['如何申請', '寄信到support@mamabee.app，主旨「Creator program」'],
        ],
      },
    },
`**MamaBee創作者計畫，是給在Threads、Instagram、YouTube、TikTok或部落格分享育兒生活的媽媽和爸爸的合作方案。你把MamaBee介紹給粉絲，再從你帶來的營收中分潤。加入不需要任何前期費用，粉絲多寡都歡迎，我們也會提供Premium讓你完整試用。**
你好，我們是開發MamaBee的Realm Labs，一個小小的團隊。當初做MamaBee，是因為我們想要一個半夜餵奶時單手就能快速記錄、而且沒有廣告打擾的育兒紀錄App。
我們相信，選App時最值得參考的，是真正用過的爸媽怎麼說。所以我們想和每天陪著粉絲一起帶孩子的創作者合作，讓更多家庭認識MamaBee。
## 誰適合加入？
- **經營育兒內容的媽媽、爸爸、照顧者。**不管是Threads上的育兒日常、Instagram的Reels和限動、YouTube影片、TikTok，還是部落格、Facebook粉專，都可以。
- **只推薦自己真心覺得好用的東西的人。**正在用育兒紀錄App，或想試試看的都歡迎。
- **粉絲人數不限。**比起追蹤數，我們更在意你和粉絲之間的信任。
- **使用iPhone的爸媽。**MamaBee目前只支援iPhone（iOS 17.6以上），試用需要一支iPhone。
## 合作怎麼進行？
- **第1步，寄信申請：**寄到[support@mamabee.app](${MAIL_CREATOR})，主旨寫「Creator program」。
- **第2步，收到完整條件：**團隊會親自回信，用電子郵件說明完整條件，並幫你開通MamaBee Premium。
- **第3步，真的用用看：**記錄寶寶的餵奶、睡眠和尿布，看看適不適合你們家。
- **第4步，用你的方式分享：**一天作息的Reels、夜奶日常的短影音、YouTube開箱，或一篇部落格心得，形式由你決定。
- **第5步，獲得分潤：**從你帶來的營收中分潤。具體怎麼計算，都寫在我們寄給你的條件裡，看清楚再決定就好。
[[TABLE:glance]]
## 我們能給創作者什麼？
- **零前期費用。**加入不用花任何錢。
- **提供Premium。**Sleep Coach小睡預測、無限次Bee AI、完整疫苗時程都能用，讓你根據整個App來分享心得。
- **直接和開發團隊溝通。**你的問題和粉絲的意見，會直接送到做App的我們手上。
- **歡迎說真話。**MamaBee還做不到的地方，也請照實分享。
## 介紹MamaBee時可以說的重點
為了讓你介紹得正確，我們把MamaBee目前的功能整理在這裡：
- **所有方案都沒有廣告**，免費版也一樣。
- **2位照顧者免費即時同步**，媽媽記錄的餵奶，爸爸手機馬上看得到。
- **單手記錄（免費）：**睡眠、親餵左右計時、瓶餵、擠奶、尿布、副食品、體溫、用藥、症狀等。
- **成長與發展（免費）：**WHO成長百分位、45項以上CDC發展里程碑、時間軸與7天趨勢，還能匯出給小兒科醫師看的PDF。
- **Premium：**Sleep Coach、無限次Bee AI（會參考寶寶紀錄回答的助理）、完整疫苗時程、副食品過敏原測試、多寶寶同步與第3位以上家人共享。
- **隱私：**紀錄預設存在手機裡，只有開啟家人共享時才會傳到Realm Labs的伺服器。我們不會販售你的資料。
## 如何申請
寄信到[support@mamabee.app](${MAIL_CREATOR})，主旨寫 **「Creator program」**，並附上：
- 你的頻道或帳號連結
- 你住的國家或地區
- 粉絲人數（大概的數字就可以）
- 願意的話，用一句話介紹你的家庭和平常分享的內容
用中文寫信就可以。每一封信我們都會看，也會一封一封親自回覆。
## ${FAQ_H2['zh-tw']}
### 加入要付費嗎？
不用。沒有任何前期費用，MamaBee Premium也由我們提供。
### 粉絲不多也可以申請嗎？
可以，粉絲人數沒有限制。信裡寫上大概的人數，能幫助我們了解你的頻道。
### 分潤比例是多少？
包含分潤方式在內的完整條件，會在你來信後用電子郵件說明。
### 一定只能說好話嗎？
不用。誠實的心得對其他爸媽最有幫助。合作貼文請依照所在地的法規和平台規定，清楚標示「合作」或「廣告」。
[[CTA||分享之前，先在iPhone上試試沒有廣告的MamaBee]]
對App本身有想法嗎？歡迎看看[MamaBee功能許願](${base('zh-tw')}mamabee-feature-requests)，告訴我們你想要什麼功能。`),

  A('mamabee-feature-requests',
    'MamaBee功能許願：告訴我們你需要什麼',
    '想要MamaBee多一個功能，或有哪裡可以更好？寄信到support@mamabee.app告訴我們。每一封信我們都會看，可行的點子會盡最大努力做出來。',
    ['MamaBee', '功能許願', '意見回饋', '育兒紀錄App'],
    {
      today: {
        caption: 'MamaBee目前的功能（僅支援iPhone，iOS 17.6以上）',
        headers: ['免費', 'Premium'],
        rows: [
          ['所有方案都沒有廣告', '免費版全部功能'],
          ['單手記錄：睡眠、親餵左右計時、瓶餵、擠奶、尿布、副食品、體溫、用藥、症狀、看診、自訂紀錄', 'Sleep Coach小睡預測'],
          ['2位照顧者即時同步', '無限次Bee AI（會參考紀錄回答的助理）'],
          ['WHO成長百分位、45項以上CDC發展里程碑', '完整疫苗時程'],
          ['時間軸、7天趨勢、小工具', '副食品過敏原測試'],
          ['匯出CSV、JSON、給小兒科醫師的PDF', '多寶寶同步、第3位以上家人共享'],
          ['疫苗時程前3個月', '30／90／365天趨勢'],
        ],
      },
    },
`**希望MamaBee多一個功能嗎？寄信到support@mamabee.app，主旨寫「Feature idea」，告訴我們什麼能讓你帶寶寶的日子更輕鬆。我們是Realm Labs的小團隊，每一封信都會看，也會盡最大努力，把可行的點子做出來，幫助世界各地的新手爸媽。**
MamaBee是為世界各地的爸媽做的，從台灣、日本、韓國，到美國和巴西。很多好用的育兒紀錄功能，都是從爸媽半夜餵奶時一個小小的「不方便」開始的。我們沒辦法保證每個想法都會實現，也無法承諾時間，但每一封信都會由做App的團隊成員親自閱讀，並成為我們規劃開發時的參考。
## 怎麼寄功能許願？
- **收件人：**[support@mamabee.app](${MAIL_IDEA})
- **主旨：**寫「Feature idea」，信件才會送到對的人手上。
- **描述遇到的狀況。**像是「半夜睡眼惺忪，記不得上次餵哪一邊」這種具體情境，比「加一個按鈕」更能幫助我們。
- **一封信一個想法最好**，但整理成清單一起寄也沒問題。用中文寫就可以。
## 信裡請附上這些資訊
- **寶寶幾個月大**（2週大和10個月大需要的東西完全不同）
- **你想做什麼**，以及現在卡在哪裡
- **你用的手機**（iPhone型號和iOS版本）
- **你住的國家或地區**（餵養、疫苗和健檢制度各地都不一樣）
- 方便說明的話，附上**螢幕截圖**
## MamaBee現在能做什麼？
寄信之前，可以先看看目前的功能。如果某個功能和你想要的用法不一樣，這也是很寶貴的回饋。
[[TABLE:today]]
## 爸媽常提到的需求
如果你需要以下任何一項，請告訴我們。這些只是爸媽常聊到的主題，不代表我們承諾或預告會推出：
- **其他裝置。**MamaBee目前只支援iPhone。如果你需要Android、iPad或Apple Watch版本，請一併告訴我們家裡是誰會用。
- **哄睡聲音。**你會不會想在App裡用白噪音或搖籃曲？
- **懷孕期間。**你想不想在寶寶出生前就開始記錄？
- **還沒有的紀錄或圖表。**告訴我們你現在記在紙本、兒童健康手冊或備忘錄裡的東西。
- **少按一下也好。**任何能讓單手記錄更快的小點子都歡迎。
## 寄信之後會怎樣？
每一封信我們都會看。有時候為了更了解你的狀況，我們會回信問你問題。相似的需求會整理在一起，幫我們看出哪些是很多家庭都需要的。可行的點子我們會盡最大努力做出來，但無法承諾特定功能或時間。如果是發現Bug，也請寄到同一個信箱，告訴我們發生了什麼事。
## ${FAQ_H2['zh-tw']}
### 我的點子會被做出來嗎？
我們沒辦法保證，但每一封信都會看，對新手爸媽有幫助又可行的點子，我們會盡最大努力做出來。狀況寫得越詳細越好。
### MamaBee是免費的嗎？
下載免費，日常記錄免費而且沒有廣告。Sleep Coach、無限次Bee AI和完整疫苗時程屬於Premium功能。
### 可以提台灣才有的需求嗎？
當然可以。像是兒童健康手冊、兒童預防保健或副食品的習慣，台灣特有的狀況都歡迎告訴我們。
[[CTA||還沒用過MamaBee嗎？在iPhone上試試沒有廣告的育兒紀錄]]
你也在經營育兒內容嗎？歡迎看看[MamaBee創作者計畫](${base('zh-tw')}mamabee-creator-program)。`),
]

// ───────────────────────────────── ZH-CN ─────────────────────────────────
PAGES['zh-cn'] = [
  A('mamabee-creator-program',
    'MamaBee创作者招募：零成本收益分成',
    '做育儿内容的宝妈、宝爸创作者，欢迎加入MamaBee创作者计划：把MamaBee分享给粉丝，从你带来的收入中获得分成。没有任何前期费用，粉丝多少都欢迎。',
    ['MamaBee', '创作者招募', '育儿博主合作', '收益分成'],
    {
      glance: {
        caption: 'MamaBee创作者计划一览。完整条款会通过邮件发给你。',
        headers: ['项目', '内容'],
        rows: [
          ['适合谁', '分享育儿日常和经验的宝妈、宝爸和带娃家人'],
          ['平台', '小红书、抖音、视频号、B站、微信公众号，以及Instagram、TikTok、YouTube等'],
          ['加入费用', '没有（零前期费用）'],
          ['收益方式', '从你带来的收入中获得分成'],
          ['我们提供', 'MamaBee高级版，所有功能都能完整体验'],
          ['粉丝数量', '不限'],
          ['完整条款', '通过邮件发给你'],
          ['如何申请', '发邮件到support@mamabee.app，主题写“Creator program”'],
        ],
      },
    },
`**MamaBee创作者计划，面向在小红书、抖音、B站、Instagram、TikTok或YouTube分享育儿生活的宝妈和宝爸。你把MamaBee推荐给粉丝，再从你带来的收入中获得分成。加入不需要任何前期费用，粉丝多少都欢迎，我们还会提供高级版让你完整体验。**
你好，我们是开发MamaBee的Realm Labs，一个很小的团队。当初做MamaBee，是因为我们想要一个半夜喂奶时单手就能快速记录、又没有广告打扰的育儿记录App。
我们相信，选App时最靠谱的参考，是真正用过的爸妈的真实体验。所以我们希望和每天陪着粉丝一起带娃的创作者合作，让更多家庭认识MamaBee。
## 谁适合加入？
- **做育儿内容的宝妈、宝爸和带娃家人。**小红书的育儿笔记、抖音或视频号的短视频、B站的vlog、公众号文章；在海外的话，Instagram、TikTok、YouTube也都可以。
- **只推荐自己真心觉得好用的东西的人。**正在用育儿记录App，或者想试试的都欢迎。
- **粉丝数量不限。**比起粉丝数，我们更看重你和粉丝之间的信任。
- **使用iPhone的爸妈。**MamaBee目前只支持iPhone（iOS 17.6及以上），体验需要一部iPhone。
## 合作怎么进行？
- **第1步，发邮件申请：**发到[support@mamabee.app](${MAIL_CREATOR})，主题写“Creator program”。
- **第2步，收到完整条款：**团队会亲自回复，通过邮件说明完整条款，并为你开通MamaBee高级版。
- **第3步，真实使用：**记录宝宝的喂奶、睡眠和尿不湿，看看适不适合你家。
- **第4步，用你的方式分享：**一天作息的笔记、夜奶日常的短视频、B站测评或一篇公众号文章，形式你来定。
- **第5步，获得分成：**从你带来的收入中获得分成。具体怎么计算，都写在我们发给你的条款里，看清楚再决定。
[[TABLE:glance]]
## 我们能为创作者提供什么？
- **零前期费用。**加入不花一分钱。
- **提供高级版。**Sleep Coach小睡预测、不限次数的Bee AI、完整疫苗时间表都能用，让你基于整个App来分享体验。
- **直接对接开发团队。**你的问题和粉丝的反馈，会直接到做App的我们手里。
- **欢迎说真话。**MamaBee还做不到的地方，也请如实分享。
## 介绍MamaBee时可以讲的重点
为了让你介绍得准确，我们把MamaBee目前的功能整理在这里：
- **所有方案都没有广告**，免费版也一样。
- **2位家人免费实时同步**，妈妈记录的喂奶，爸爸手机上马上能看到。
- **单手记录（免费）：**睡眠、亲喂左右计时、瓶喂、吸奶、尿不湿、辅食、体温、用药、症状等。
- **生长与发育（免费）：**WHO生长百分位、45项以上CDC发育里程碑、时间线和7天趋势，还能导出给儿科医生看的PDF。
- **高级版：**Sleep Coach、不限次数的Bee AI（会参考宝宝记录回答的助手）、完整疫苗时间表、辅食过敏原测试、多宝宝同步和更多家人共享。
- **隐私：**记录默认保存在手机里，只有开启家人共享时才会上传到Realm Labs的服务器。我们不会出售你的数据。
## 如何申请
发邮件到[support@mamabee.app](${MAIL_CREATOR})，主题写 **“Creator program”**，并附上：
- 你的账号或频道链接
- 你所在的国家或地区
- 粉丝数量（大概的数字就行）
- 愿意的话，用一句话介绍你的家庭和平时分享的内容
用中文写邮件就可以。每一封邮件我们都会看，并逐一亲自回复。
## ${FAQ_H2['zh-cn']}
### 加入需要付费吗？
不需要。没有任何前期费用，MamaBee高级版也由我们提供。
### 粉丝不多也能申请吗？
能，粉丝数量没有限制。邮件里写上大概的粉丝数，能帮助我们了解你的账号。
### 分成比例是多少？
包括分成方式在内的完整条款，会在你来信后通过邮件说明。
### 只能说好话吗？
不是。真实的体验对其他爸妈最有帮助。合作内容请按照所在地区的法规和平台规则，清楚标注“广告”或“合作”。
[[CTA||分享之前，先在iPhone上体验没有广告的MamaBee]]
对App本身有想法？欢迎看看[MamaBee功能许愿](${base('zh-cn')}mamabee-feature-requests)，告诉我们你想要什么功能。`),

  A('mamabee-feature-requests',
    'MamaBee功能许愿：告诉我们你需要什么',
    '希望MamaBee增加什么功能，或者哪里可以做得更好？发邮件到support@mamabee.app告诉我们。每一封邮件我们都会看，可行的想法会尽最大努力做出来。',
    ['MamaBee', '功能许愿', '意见反馈', '育儿记录App'],
    {
      today: {
        caption: 'MamaBee目前的功能（仅支持iPhone，iOS 17.6及以上）',
        headers: ['免费', '高级版'],
        rows: [
          ['所有方案都没有广告', '免费版全部功能'],
          ['单手记录：睡眠、亲喂左右计时、瓶喂、吸奶、尿不湿、辅食、体温、用药、症状、就诊、自定义记录', 'Sleep Coach小睡预测'],
          ['2位家人实时同步', '不限次数的Bee AI（会参考记录回答的助手）'],
          ['WHO生长百分位、45项以上CDC发育里程碑', '完整疫苗时间表'],
          ['时间线、7天趋势、小组件', '辅食过敏原测试'],
          ['导出CSV、JSON、给儿科医生的PDF', '多宝宝同步、更多家人共享'],
          ['疫苗时间表前3个月', '30／90／365天趋势'],
        ],
      },
    },
`**希望MamaBee增加一个功能？发邮件到support@mamabee.app，主题写“Feature idea”，告诉我们什么能让你带娃的日子更轻松。我们是Realm Labs的小团队，每一封邮件都会看，也会尽最大努力把可行的想法做出来，帮助世界各地的新手爸妈。**
MamaBee是为世界各地的爸妈做的，从中国、马来西亚、新加坡，到日本、美国和巴西。很多好用的育儿记录功能，都源于爸妈半夜喂奶时的一个小小的“不方便”。我们无法保证每个想法都会实现，也不能承诺时间，但每一封邮件都会由做App的团队成员亲自阅读，并作为我们规划开发的参考。
## 怎么提交功能许愿？
- **收件人：**[support@mamabee.app](${MAIL_IDEA})
- **主题：**写“Feature idea”，邮件才能到对的人手里。
- **描述你遇到的情况。**比如“半夜迷迷糊糊，记不清上次喂的是哪一边”，这样具体的场景比“加一个按钮”更有帮助。
- **一封邮件一个想法最好**，整理成清单一起发也没问题。用中文写就可以。
## 邮件里请写上这些信息
- **宝宝多大**（2周和10个月需要的东西完全不同）
- **你想做什么**，以及现在卡在哪里
- **你用的手机**（iPhone型号和iOS版本）
- **你所在的国家或地区**（喂养、疫苗和体检安排各地都不一样）
- 方便说明的话，附上**截图**
## MamaBee现在能做什么？
发邮件之前，可以先看看目前的功能。如果某个功能和你想要的用法不一样，这也是很宝贵的反馈。
[[TABLE:today]]
## 爸妈常提到的需求
如果你需要以下任何一项，请告诉我们。这些只是爸妈常聊到的话题，不代表我们承诺或预告会推出：
- **其他设备。**MamaBee目前只支持iPhone。如果你需要安卓、iPad或Apple Watch版本，请顺便告诉我们家里是谁要用。
- **哄睡声音。**你想不想在App里用白噪音或摇篮曲？
- **孕期记录。**你想不想在宝宝出生前就开始记录？
- **还没有的记录或图表。**告诉我们你现在记在本子、备忘录或表格里的东西。
- **少点一下也好。**任何能让单手记录更快的小点子都欢迎。
## 发邮件之后会怎样？
每一封邮件我们都会看。有时为了更了解你的情况，我们会回信问你问题。相似的需求会归在一起，帮我们看清哪些是很多家庭都需要的。可行的想法我们会尽最大努力做出来，但无法承诺具体功能或时间。如果发现了Bug，也请发到同一个邮箱，告诉我们发生了什么。
## ${FAQ_H2['zh-cn']}
### 我的想法会被做出来吗？
我们没法保证，但每一封邮件都会看，对新手爸妈有帮助又可行的想法，我们会尽最大努力做出来。情况写得越详细越好。
### MamaBee是免费的吗？
下载免费，日常记录免费而且没有广告。Sleep Coach、不限次数的Bee AI和完整疫苗时间表属于高级版功能。
### 可以提和本地情况有关的需求吗？
当然可以。不管你在国内还是海外，当地的喂养习惯、疫苗或儿保体检安排有什么不同，都欢迎告诉我们。
[[CTA||还没用过MamaBee？在iPhone上体验没有广告的育儿记录]]
你也在做育儿内容吗？欢迎看看[MamaBee创作者计划](${base('zh-cn')}mamabee-creator-program)。`),
]

// ───────────────────────────────── PT-BR ─────────────────────────────────
PAGES['pt-br'] = [
  A('mamabee-creator-program',
    'Programa de Criadores MamaBee: parceria sem custo inicial',
    'Mãe ou pai criador de conteúdo? Indique o MamaBee, app de rotina do bebê sem anúncios, e ganhe parte da receita gerada. Sem custo inicial, todo tamanho.',
    ['MamaBee', 'programa de criadores', 'influenciadora materna', 'parceria com criadores', 'divisão de receita'],
    {
      glance: {
        caption: 'O Programa de Criadores MamaBee em resumo. Os termos completos são enviados por e-mail.',
        headers: ['Pergunta', 'Resposta'],
        rows: [
          ['Para quem é', 'Mães, pais e cuidadores que criam conteúdo sobre maternidade e paternidade'],
          ['Onde', 'Instagram, TikTok, YouTube, blogs e outros canais'],
          ['Custo para entrar', 'Nenhum. Não há custo inicial'],
          ['Como você ganha', 'Uma parte da receita que você gerar'],
          ['O que oferecemos', 'Acesso ao MamaBee Premium para testar todos os recursos'],
          ['Tamanho do público', 'Qualquer tamanho é bem-vindo'],
          ['Termos completos', 'Enviados para você por e-mail'],
          ['Como participar', 'E-mail para support@mamabee.app com o assunto "Creator program"'],
        ],
      },
    },
`**O Programa de Criadores MamaBee é para mães e pais que compartilham a rotina com o bebê no Instagram, no TikTok, no YouTube ou em blogs. Você apresenta o MamaBee ao seu público e recebe parte da receita que gerar. Não há custo inicial, todo tamanho de perfil é bem-vindo e você ganha acesso ao Premium.**
Oi! Nós somos um time pequeno na Realm Labs, quem cria o MamaBee. Fizemos o app porque queríamos um jeito tranquilo de registrar a rotina do bebê: rápido de usar com uma mão só na mamada das 3 da manhã e sem nenhum anúncio.
A gente acredita que a indicação que mais pesa na hora de escolher um app é a de quem usa no dia a dia. Por isso queremos trabalhar com criadoras e criadores que já ajudam outras famílias a atravessar os primeiros meses.
## Para quem é o programa?
- **Mães, pais e cuidadores que criam conteúdo.** Reels e stories no Instagram, vídeos no TikTok, vlogs no YouTube, blog ou newsletter sobre maternidade real: todo canal vale.
- **Quem só indica o que gosta de verdade.** Você usa um app de rotina do bebê, ou quer experimentar, e quer contar com sinceridade o que achou.
- **Qualquer tamanho de público.** Um perfil pequeno, com seguidores que confiam em você, importa tanto quanto um grande.
- **Famílias com iPhone.** Por enquanto o MamaBee é só para iPhone (iOS 17.6 ou mais recente), então você vai precisar de um iPhone para testar.
## Como funciona?
- **Passo 1: mande um e-mail.** Escreva para [support@mamabee.app](${MAIL_CREATOR}) com o assunto "Creator program".
- **Passo 2: receba os detalhes.** Nosso time responde pessoalmente, envia os termos completos por e-mail e libera o MamaBee Premium para você.
- **Passo 3: use de verdade.** Registre mamadas, sono e fraldas do seu bebê e veja se o app combina com a sua família.
- **Passo 4: compartilhe do seu jeito.** Um Reels com o dia a dia, um vídeo da madrugada no TikTok, uma resenha no YouTube ou um post no blog. Sua voz, seu formato.
- **Passo 5: receba sua parte.** Você ganha uma parte da receita que gerar. Como isso funciona está nos termos que enviamos, para você decidir com calma.
[[TABLE:glance]]
## O que oferecemos para criadores
- **Sem custo inicial.** Você não paga nada para participar.
- **Acesso ao Premium.** Teste o Sleep Coach (previsão de sonecas), a Bee AI ilimitada e o calendário de vacinas completo, não só os recursos gratuitos, e fale do app inteiro.
- **Contato direto com quem faz o app.** Suas dúvidas e o retorno dos seus seguidores chegam direto no nosso time.
- **Liberdade para ser sincera.** Preferimos que você conte o que realmente acha, inclusive o que o MamaBee ainda não faz.
## O que você pode contar sobre o MamaBee?
Para tudo o que você compartilhar ser correto, aqui está o que o MamaBee faz hoje:
- **Sem anúncios em nenhum plano**, nem na versão gratuita.
- **Sincronização em tempo real grátis para 2 cuidadores**, então mãe e pai veem cada mamada e soneca na hora.
- **Registro com uma mão só, grátis:** sono, amamentação com cronômetro de cada lado, mamadeira, extração de leite, fraldas, introdução alimentar, temperatura, remédios, sintomas e mais.
- **Crescimento e desenvolvimento, grátis:** percentis de crescimento da OMS, mais de 45 marcos do CDC, linha do tempo com análises de 7 dias e um PDF para levar ao pediatra.
- **Premium:** Sleep Coach, Bee AI ilimitada (uma assistente que conhece os registros do seu bebê), calendário de vacinas completo, teste de alergênicos da introdução alimentar, sincronização de vários bebês e mais cuidadores.
- **Privacidade:** os registros ficam no celular e só vão para os servidores da Realm Labs se o compartilhamento estiver ligado. Nunca vendemos seus dados.
## Como participar
Mande um e-mail para [support@mamabee.app](${MAIL_CREATOR}) com o assunto **"Creator program"** e inclua:
- os links dos seus canais
- o país onde você mora
- o tamanho do seu público (um número aproximado já ajuda)
- se quiser, uma frase sobre a sua família e o que você costuma compartilhar
Pode escrever em português. Lemos todos os e-mails e respondemos pessoalmente.
## ${FAQ_H2['pt-br']}
### Tem algum custo para participar?
Não. Não há custo inicial, e nós liberamos o acesso ao Premium para você testar o MamaBee direito.
### Preciso ter muitos seguidores?
Não. Criadores de qualquer tamanho são bem-vindos. Conte no e-mail o tamanho do seu público para entendermos o seu canal.
### Qual é a porcentagem da receita?
Enviamos os termos completos, incluindo como funciona a divisão de receita, por e-mail depois que você entrar em contato.
### Preciso falar só coisas boas?
Não. Conteúdo sincero é o que mais ajuda outras famílias. Sinalize as publicações da parceria como pedem o CONAR e a plataforma, por exemplo com #publi.
[[CTA||Experimente o MamaBee antes de indicar: o app de rotina do bebê sem anúncios para iPhone.]]
Tem uma ideia para o próprio app? Veja [sugestões de recursos para o MamaBee](${base('pt-br')}mamabee-feature-requests) e conte o que devemos criar.`),

  A('mamabee-feature-requests',
    'Sugestões para o MamaBee: conte o que você precisa',
    'Conte ao time do MamaBee quais recursos ajudariam você: mande sua ideia para support@mamabee.app. Lemos todos os e-mails e fazemos o possível.',
    ['MamaBee', 'sugestões de recursos', 'app de rotina do bebê', 'fale com o MamaBee'],
    {
      today: {
        caption: 'O que o MamaBee já faz (só iPhone, iOS 17.6 ou mais recente)',
        headers: ['Grátis', 'Premium'],
        rows: [
          ['Sem anúncios em nenhum plano', 'Tudo do plano grátis'],
          ['Registro com uma mão: sono, amamentação com cronômetro de cada lado, mamadeira, extração, fraldas, introdução alimentar, temperatura, remédios, sintomas, consultas, registros personalizados', 'Sleep Coach (previsão de sonecas)'],
          ['Sincronização em tempo real para 2 cuidadores', 'Bee AI ilimitada, uma assistente que conhece seus registros'],
          ['Percentis de crescimento da OMS e mais de 45 marcos do CDC', 'Calendário de vacinas completo'],
          ['Linha do tempo, análises de 7 dias e widgets', 'Teste de alergênicos da introdução alimentar'],
          ['Exportação em CSV, JSON e PDF para o pediatra', 'Vários bebês e mais cuidadores'],
          ['Primeiros 3 meses do calendário de vacinas', 'Análises de 30, 90 e 365 dias'],
        ],
      },
    },
`**Quer que o MamaBee faça algo que ainda não faz? Mande um e-mail para support@mamabee.app com o assunto "Feature idea" e conte o que deixaria seus dias com o bebê mais leves. Somos um time pequeno na Realm Labs: lemos todos os e-mails e faremos o possível para criar as ideias viáveis que ajudem famílias no mundo todo.**
Fazemos o MamaBee para famílias do mundo todo, do Brasil e de Portugal ao Japão, à Coreia, a Taiwan e aos Estados Unidos. Muitas das melhores ideias de um app de rotina do bebê nascem de um pequeno incômodo na mamada da madrugada. Não podemos prometer que toda ideia vai sair do papel, nem quando, mas cada mensagem é lida por quem faz o app e ajuda a decidir no que vamos trabalhar.
## Como mandar uma sugestão?
- **Escreva para** [support@mamabee.app](${MAIL_IDEA}).
- **Use o assunto** "Feature idea", para a mensagem chegar no lugar certo.
- **Conte o problema, não só a solução.** "Meio dormindo, eu esqueço de que lado dei de mamar por último" ajuda mais do que "coloquem um botão".
- **Uma ideia por e-mail é o ideal**, mas uma lista também é bem-vinda. Pode escrever em português.
## O que colocar no seu e-mail
- **A idade do bebê**, porque o que você precisa com 2 semanas é bem diferente de 10 meses
- **O que você está tentando fazer** e o que atrapalha hoje
- **Qual celular você usa**, como o modelo do iPhone e a versão do iOS
- **Seu país**, porque alimentação, vacinas e consultas mudam de um lugar para outro
- **Um print da tela**, se ajudar a explicar
## O que o MamaBee já faz
Antes de escrever, veja o que o app já faz hoje. Se algo daqui não funciona do jeito que você precisa, isso também é um retorno valioso.
[[TABLE:today]]
## O que mães e pais costumam pedir?
Conte para a gente se você precisa de algum destes. São assuntos que as famílias costumam trazer, não promessas nem pistas de recursos futuros:
- **Outros aparelhos.** Hoje o MamaBee é só para iPhone. Se você precisa dele no Android, no iPad ou no Apple Watch, conte também quem da família usaria.
- **Sons para ninar.** Você usaria ruído branco ou cantigas dentro do app?
- **Gestação.** Você gostaria de começar a registrar antes de o bebê nascer?
- **Um registro ou gráfico que ainda não existe.** Conte o que você anota hoje no papel, na caderneta ou no bloco de notas.
- **Qualquer coisa que economize um toque.** Pequenos detalhes que deixariam o registro com uma mão ainda mais rápido.
## O que acontece depois que você manda o e-mail?
Lemos todas as mensagens. Às vezes respondemos com uma pergunta para entender melhor a sua situação. Agrupamos pedidos parecidos, o que nos mostra o que muitas famílias precisam. Vamos fazer o possível para criar as ideias viáveis, mas não podemos prometer recursos específicos nem prazos. Encontrou um erro? Escreva para o mesmo endereço e conte o que aconteceu.
## ${FAQ_H2['pt-br']}
### Vocês vão criar a minha ideia?
Não podemos prometer, mas lemos todos os e-mails e fazemos o possível para criar ideias viáveis que ajudem mães e pais de primeira viagem. Quanto mais detalhes, melhor.
### O MamaBee é gratuito?
O download é grátis, sem anúncios e com registro do dia a dia gratuito. Sleep Coach, Bee AI ilimitada e o calendário de vacinas completo fazem parte do Premium.
### Posso sugerir algo pensando no Brasil?
Pode e deve. Conte o que é diferente por aqui, como a Caderneta da Criança, o calendário do SUS ou as consultas de puericultura.
[[CTA||Ainda não usa o MamaBee? Experimente o app de rotina do bebê sem anúncios no iPhone.]]
Você cria conteúdo sobre maternidade ou paternidade? Conheça o [Programa de Criadores MamaBee](${base('pt-br')}mamabee-creator-program).`),
]

// ───────────────────────────────── SAVE ─────────────────────────────────
function size(body) {
  let cjk = 0, words = 0
  for (const b of body) if (b._type === 'block') for (const s of b.children || []) {
    const t = s.text || ''
    cjk += (t.match(/[぀-ヿ㐀-鿿가-힯]/g) || []).length
    words += t.replace(/[぀-ヿ㐀-鿿가-힯]/g, ' ').split(/\s+/).filter(Boolean).length
  }
  return {cjk, words}
}

const DRY = !!process.env.DRY
for (const [lang, pages] of Object.entries(PAGES)) {
  for (const a of pages) {
    const body = md(a.body, a.tables)
    const doc = {
      _id: lang === 'en' ? `drafts.mamabee-${a.slug}` : `drafts.mamabee-${lang}-${a.slug}`,
      _type: 'article', brand: 'mamabee', ...(lang === 'en' ? {} : {language: lang}),
      title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description,
      author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body,
    }
    let coverFrom = null
    for (const rel of COVERS[a.slug] || []) {
      const src = await client.getDocument(`mamabee-${rel}`)
      if (src && src.coverImage) { doc.coverImage = src.coverImage; coverFrom = rel; break }
    }
    if (!DRY) await client.createOrReplace(doc)
    const {cjk, words} = size(body)
    const tables = body.filter((b) => b._type === 'comparisonTable').length
    const ctas = body.filter((b) => b._type === 'appCta').length
    const faqStart = body.findIndex((b) => b.style === 'h2' && b.children[0]?.text === FAQ_H2[lang])
    const faqEnd = body.findIndex((b, i) => i > faqStart && b.style === 'h2')
    const faqs = faqStart < 0 ? 0 : body.slice(faqStart, faqEnd < 0 ? undefined : faqEnd).filter((b) => b.style === 'h3').length
    const lede = body[0].children.map((s) => s.text).join('')
    const ledeSize = lang === 'en' || lang === 'pt-br' ? `${lede.split(/\s+/).filter(Boolean).length}w` : `${lede.length}c`
    const hrefs = [...new Set(body.flatMap((b) => (b.markDefs || []).map((d) => d.href).filter(Boolean)))]
    console.log(`${DRY ? '[DRY] ' : ''}draft ${doc._id}: ${cjk ? cjk + ' CJK chars, ' : ''}${words} words, ${tables} tables, ${faqs} FAQs, ${ctas} CTA, lede ${ledeSize}, title ${a.title.length}c, desc ${a.description.length}c, ${a.tags.length} tags, cover from ${coverFrom || 'NONE'}`)
    if (DRY) console.log('   links:', hrefs.join(' '))
  }
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
