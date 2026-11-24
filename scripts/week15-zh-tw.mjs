// Week-15 MamaBee zh-TW (Taiwan) articles as DRAFTS only (never published by this script):
//   1. baby-sleep-regressions-by-age (睡眠倒退期) — reuses the English slug so the pages pair via hreflang.
//   2. baby-milk-refusal-phase (厭奶期) — Taiwan-only topic, new English-style slug.
// Numbers follow the series canonical sheet (wake windows, naps, AASM totals) and the zh-tw
// feeding article (奶量表). Every medical claim cites a source listed at the end of its article.
// Taiwan sources: 國健署《兒童衛教手冊》(2025年7月第8版)、《母乳哺育手冊》、兒童健康手冊、衛福部安全睡眠新聞稿.
// MamaBee prices: owner-confirmed App Store Connect list (TW NT$150 / NT$1,490). No promo price.
// Cover images are copied from a related published article (fallbacks in order).
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week15-zh-tw.mjs
// Dry run (build + stats, no writes): DRY=1 node scripts/week15-zh-tw.mjs
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

const LANG = 'zh-tw'
const L = (slug) => `/mamabee/zh-tw/articles/${slug}`
const DISCLAIMER = '*本文僅供一般資訊參考，不構成醫療建議。寶寶的睡眠、餵食或健康有任何疑問，請諮詢您的小兒科醫師；緊急狀況請撥 119。*'

// Related published article whose coverImage each draft copies (fallbacks in order).
// Keys are draft slugs; values are suffixes of published _ids (mamabee-<value>).
const COVERS = {
  'baby-sleep-regressions-by-age': ['baby-sleep-regressions-by-age', '4-month-sleep-regression', '8-month-sleep-regression'],
  'baby-milk-refusal-phase': ['baby-feeding-schedule-by-age', 'dream-feed', 'baby-teething-symptoms'],
}

// Internal links must point at these (existing zh-tw slugs + this batch, plus EN tools).
const ALLOWED = new Set([
  ...['baby-feeding-schedule-by-age', 'baby-vaccine-schedule-explained', 'best-baby-tracker-apps-compared', 'mamabee-vs-baby-tracker', 'mamabee-vs-piyolog', 'well-baby-visit-schedule', 'baby-sleep-regressions-by-age', 'baby-milk-refusal-phase'].map(L),
  '/mamabee/tools/wake-window-calculator', '/mamabee/tools/baby-sleep-schedule-generator',
])

const articles = [

  // ───────────────────────────── 1. 睡眠倒退期 ─────────────────────────────
  A('baby-sleep-regressions-by-age',
    '睡眠倒退期怎麼辦？4個月到1歲半各階段徵兆、多久會過',
    '睡眠倒退期是什麼？一次整理4個月、6個月、8–10個月、1歲、1歲半寶寶睡眠倒退期的徵兆、原因、多久會過，附清醒時間表、實用做法，以及什麼時候該看小兒科。',
    ['睡眠倒退期', '4個月睡眠倒退期', '寶寶夜醒', '寶寶睡眠', '8個月睡眠倒退期'],
    {
      ages: {
        caption: '各月齡睡眠倒退期一覽（時間因寶寶而異）',
        headers: ['階段', '常見時間', '常見徵兆', '可能原因', '多久會過（出處）'],
        rows: [
          ['4個月', '睡眠約從3到4個月開始改變，有的寶寶早一點或晚一點', '入睡變難、夜醒變多、小睡變短、醒來很煩躁', '睡眠週期成熟、逐漸整合，淺睡時更容易醒', '多數幾天到幾週（Sleep Foundation）'],
          ['6個月', '約6個月；很多寶寶不會遇到', '夜醒、小睡長短不一、睡前比較黏人', '翻身、學坐、開始認人、長牙、副食品、作息調整', '通常幾天到幾週（Sleep Foundation）'],
          ['8–10個月', '約8個月前後，也常被叫做9個月、10個月倒退期', '半夜扶站在床上、一放下就哭、抗拒小睡', '爬行、扶站、分離焦慮、長牙、3次小睡改2次', '沒有確切天數，只說通常很短暫（Sleep Foundation）'],
          ['1歲', '約12個月', '小睡縮短或拒睡、夜醒、睡前哭鬧', '學走路、分離焦慮、長牙、太早改成1次小睡', '多數不超過幾週（Sleep Foundation）'],
          ['1歲半', '約18個月', '睡前拖延、說「不要」、夜醒、拒絕午睡、早醒', '自主意識、分離焦慮、臼齒、語言大爆發', '很少超過幾週；持續1個月以上請問醫師（Sleep Foundation）'],
        ],
      },
      wake: {
        caption: '各月齡清醒時間與小睡參考（範圍值，不是考試標準）',
        headers: ['月齡', '兩次睡眠之間的清醒時間', '白天小睡', '一天總睡眠（含小睡）'],
        rows: [
          ['4個月', '約90–120分鐘', '3–4次，慢慢變成3次', '12–16小時（4–12個月）'],
          ['6個月', '約2–2.5小時，睡前那段可接近3小時', '3次，白天合計約3小時', '12–16小時'],
          ['8個月', '約2.75–3.5小時', '2次為主，少數還在3次', '12–16小時'],
          ['9–10個月', '約3–4小時', '2次，白天合計約2–3小時', '12–16小時'],
          ['1歲', '約3–4小時', '多數還是2次', '11–14小時（1–2歲）'],
          ['1歲半', '—', '多數改成1次午睡', '11–14小時'],
        ],
      },
      check: {
        caption: '是睡眠倒退期，還是別的原因？',
        headers: ['可能原因', '常見線索', '可以怎麼做'],
        rows: [
          ['睡眠倒退期', '剛學會新技能、白天精神好、沒有發燒，幾週內慢慢回穩', '作息穩定、白天多練習新技能、夜裡安撫簡短一致'],
          ['長牙', '流口水、愛咬東西、牙齦腫、比平常煩躁', '冰涼固齒器、乾淨手指輕按牙齦；長牙不會造成發燒（AAP）'],
          ['感冒、鼻塞', '流鼻水、咳嗽、呼吸聲大、喝奶喝幾口就停', '注意體溫和精神；呼吸費力或發燒請就醫'],
          ['中耳炎', '耳朵痛常在夜裡更明顯，睡不好、可能發燒', '盡快讓小兒科醫師檢查耳朵（AAP）'],
          ['肚子餓、奶量改變', '夜奶突然變多、白天喝得比較少', '看一天總奶量、尿布和體重，和醫師討論夜奶'],
          ['作息不合了', '小睡拖很久才睡著、睡前一直玩、清晨5點就醒', '依月齡調整清醒時間，或檢查是不是到了減少小睡的時候'],
        ],
      },
    },
`**睡眠倒退期是指寶寶原本睡得還不錯，卻突然夜醒變多、小睡變短、哄睡變難的一段時間，最常被提到的是4個月、6個月、8–10個月、1歲和1歲半。它不是醫學診斷，多半和翻身、爬行、分離焦慮、長牙等發展有關；美國睡眠基金會（Sleep Foundation）指出，多數只持續幾天到幾週。**
前一週寶寶還能一覺睡到半夜，這一週卻每兩小時醒一次，小睡睡30分鐘就哭醒。很多爸媽這時才第一次在網路上搜尋「睡眠倒退期」，而且通常是在凌晨三點。
先說結論：這幾乎都是暫時的，也很常見。這篇把各月齡的睡眠倒退期整理在一起：什麼時候會發生、有哪些徵兆、多久會過（只寫有出處的說法），以及這段時間可以怎麼做、什麼情況要看小兒科。
## 睡眠倒退期是什麼？是真的嗎？
「睡眠倒退期」（英文 sleep regression）是爸媽和育兒書很常用的說法，不是醫學上的診斷名稱。Sleep Foundation 把它描述成寶寶「在朝穩定睡眠前進的路上，停下來或退了一步」。研究對「到底幾個月會發生」其實沒有定論，所以月齡只是提醒，不是每個寶寶都會遇到，也不會準時報到。
那為什麼睡眠會突然變差？國健署《兒童衛教手冊》說明，嬰幼兒夜間睡眠分成7到8個週期，淺睡和深睡交替。當寶寶正在學翻身、學爬、開始認人，或牙齦不舒服，淺睡時就更容易醒過來，而且醒了不一定能自己再睡回去。換句話說，睡眠變差常常是因為寶寶「正在長大」，不是你做錯了什麼。
## 各月齡睡眠倒退期一覽
[[TABLE:ages]]
表格裡的「多久會過」都來自 Sleep Foundation 各月齡的說明。它們用的字眼是「幾天到幾週」「很少超過幾週」，沒有一個精準的天數；如果有人跟你說「一定剛好6週」，聽聽就好。
## 4個月睡眠倒退期
4個月這一次最常被討論，也最容易嚇到爸媽，因為它常常出現在寶寶剛開始睡得比較長的時候。
### 4個月睡眠倒退期的徵兆
Sleep Foundation 列出的常見徵兆有：
- 入睡變難，睡前比較躁動
- 夜醒變多，醒來常伴隨哭鬧
- 醒來時很煩躁
- 白天加晚上的總睡眠變少
### 為什麼會發生？
Sleep Foundation 指出，寶寶的睡眠大約從3到4個月開始改變、逐漸整合，有的寶寶會早幾個月或晚幾個月才出現困擾。所以「3個月就開始睡不好」也不奇怪，常常是同一件事提早發生。這個階段的小睡時間也還不穩，白天一累過頭，晚上就更難睡。
### 多久會過？
Sleep Foundation 的說法是，多數情況下睡眠問題只會持續幾天到幾週。要注意的是，睡眠週期的成熟本身不會「退回去」，回穩的關鍵是寶寶慢慢學會在淺睡時接上下一段睡眠。
### 4個月可以怎麼做
- **清醒時間抓在90到120分鐘左右**，別讓寶寶累過頭，累過頭反而更難睡。
- **開始建立固定的睡前儀式**，例如洗澡、換睡衣、餵奶、唱同一首歌，每天順序一樣。
- **偶爾試著在寶寶想睡但還醒著時放上床**。不用一次到位，一天成功一次也是進步。
- **夜奶照常回應**。這個月齡夜裡喝0到2次奶都很常見，是否該減少請和醫師討論，奶量可以參考[0–12個月寶寶奶量表](${L('baby-feeding-schedule-by-age')})。
## 6個月：不一定算倒退期
很多寶寶在6個月左右睡得一樣好，甚至更好。Sleep Foundation 也說，有些寶寶會經歷6個月睡眠倒退，但很多寶寶不會；通常沒有單一原因，多半是發展進度不平均。
這個月齡常見的干擾包括：會翻身、開始學坐、開始認得爸媽而有一點分離焦慮、第一顆牙快冒出來，還有開始吃副食品、作息跟著調整。美國兒科學會（AAP）指出，第一顆牙通常在6到10個月之間長出來，但不舒服可能更早開始。
Sleep Foundation 說6個月的睡眠倒退通常持續幾天到幾週。這段時間以維持3次小睡、清醒時間約2到2.5小時為原則。國健署《兒童衛教手冊》也建議，6個月大以後儘量讓寶寶學會自行入睡，家長的幫助愈少愈好；總是靠拍、抱、搖或奶睡的寶寶，夜裡從深睡回到淺睡時，發現沒人哄就容易醒來。
## 8–10個月睡眠倒退期（9個月、10個月倒退期）
有人叫它8個月倒退期，也有人說9個月或10個月，指的多半是同一段時間：寶寶一口氣學會好多事。
### 8–10個月常見的徵兆
- 半夜在床上扶站、坐起來，卻不知道怎麼躺回去
- 一放上床就哭，或爸媽一離開房間就大哭（分離焦慮）
- 抗拒小睡、小睡變短
- 夜醒變多，或晚上睡得比較少、白天睡比較多
### 為什麼會發生？
Sleep Foundation 列出的可能原因有：長牙不舒服、情緒發展帶來的分離焦慮、對環境更敏感而容易過度刺激，以及體能進步讓寶寶在床上靜不下來。這些變化常常同時發生，很難說是哪一個。另外，很多寶寶在這個階段從3次小睡改成2次，過渡期間的作息也會比較亂。
### 多久會過？
Sleep Foundation 沒有給8個月睡眠倒退期確切的天數，只說通常很短暫；如果睡眠問題持續很久或愈來愈嚴重，可以和小兒科醫師討論。
### 8–10個月可以怎麼做
- **白天讓寶寶大量練習爬、坐、扶站**，技能練熟了，半夜就比較不會「加班練習」。
- **教寶寶從站姿坐下**：白天在沙發或家具旁陪他練習彎膝蓋坐下。
- **分離焦慮時，道別要短而一致**。說好「媽媽在這裡，晚安」就離開，需要時再回來看一下，不要偷偷溜走。
- **小睡從3次改2次時，搭配提早一點的就寢時間**，補上白天少睡的部分。
- **床墊降到最低**：AAP 建議在寶寶會坐之前就把床墊降到他不會跌出來的高度，學會站之前降到最低。
## 1歲睡眠倒退期
1歲前後，寶寶開始學走路，分離焦慮還在，牙齒也一顆顆冒出來。Sleep Foundation 提到的原因還包括新的作息或睡眠訓練帶來的調適。Sleep Foundation 表示，多數情況下1歲睡眠倒退期的症狀不會超過幾週。
這個年紀最常見的陷阱是：寶寶拒絕第二次小睡幾天，爸媽就以為該改成1次小睡了。KidsHealth 指出，年紀小的幼兒可能還會睡兩次，多數是到18個月左右才改成一天1次。如果寶寶只是偶爾拒睡，先維持2次小睡、清醒時間約3到4小時，短睡的日子就提早上床。
這時也很適合把睡前儀式固定下來。國健署《兒童衛教手冊》建議建立一套有固定順序、安靜的「就寢儀式」，例如尿尿、洗澡、換睡衣、刷牙、上床、講故事、道晚安、關燈，幫助孩子放鬆入睡。
## 1歲半睡眠倒退期
1歲半的寶寶已經是會說「不要」的小小孩了。Sleep Foundation 列出的原因包括：想要更多自主而抗拒上床、傍晚過度興奮、活動量變大、分離焦慮、長牙不舒服（這時常是臼齒），以及作息改變。
常見的樣子是：睡前一直討「再一本書」「再喝一口水」、爸媽一走就哭、半夜醒來叫人、拒絕午睡或清晨很早就醒。
Sleep Foundation 說1歲半睡眠倒退期的症狀很少超過幾週；如果睡眠問題持續1個月以上，建議和小兒科醫師討論。
可以這樣做：
- **維持1次午睡、固定時間**，午睡短的日子就早點上床。
- **事先講好規則，再給兩個小選擇**：「要穿恐龍睡衣還是星星睡衣？」「要讀這本還是那本？」讓孩子有掌控感，但不是決定要不要睡。
- **夜裡回應簡短、無聊、一致**，不要開燈玩起來。
- **不要因為倒退期就急著換大床**。AAP 建議等孩子身高約89公分，或床欄高度低於身高的四分之三時再換床；在那之前，熟悉的嬰兒床通常比較安全，也比較不會讓睡眠更亂。
## 睡眠倒退期多久會過？
綜合 Sleep Foundation 對各月齡的說明：多數是幾天到幾週，很少超過幾週。它們沒有給一個所有寶寶都適用的天數。
比起數日子，更實際的是觀察「有沒有在慢慢變好」：夜醒的次數變少、醒來比較快能睡回去、小睡慢慢拉長、白天的脾氣也變好。很多時候，寶寶把新技能練熟的那幾天，睡眠就跟著回穩。
如果睡不好已經拖了好幾週還在變糟，或同時有發燒、耳朵痛、喝奶變少、尿布變少，就不要只當成倒退期，請看下面「什麼時候要看小兒科」。
## 睡眠倒退期怎麼辦？7個實用做法
### 1. 作息和睡前儀式維持不變
倒退期最怕的是每天換一種方法。起床時間、小睡時間、睡前儀式盡量照舊，寶寶才有東西可以依靠。
### 2. 依月齡抓清醒時間
很多「倒退期」其實是寶寶醒太久累過頭，或作息已經不合現在的月齡。下表是各月齡的參考範圍，總睡眠時數來自美國睡眠醫學會（AASM），國健署《兒童衛教手冊》也採用同樣的建議。
[[TABLE:wake]]
想依寶寶的起床時間排出一天的小睡，可以用我們的[清醒時間計算器](/mamabee/tools/wake-window-calculator)（英文介面）。
### 3. 白天多練習新技能
寶寶正在學翻身、爬、扶站時，白天給他很多趴玩和地板時間。白天練得夠，晚上比較不會一直想練。
### 4. 夜醒時先等一下
國健署《兒童衛教手冊》提醒，寶寶淺睡時會有些動靜，除非大哭，盡量避免不必要的安撫，例如馬上餵奶、拍背，給寶寶機會學習自己再睡著。等一兩分鐘再進去，常常會發現他自己睡回去了。
### 5. 讓寶寶在「之後要睡的地方」入睡
國健署也提到，寶寶在大人懷裡或沙發上睡著後再移到小床，淺睡時感覺到環境不一樣就容易醒來。能的話，讓入睡的地方就是夜裡睡覺的地方。
### 6. 安撫可以，但小心養成新習慣
倒退期當然可以多抱、多陪。只是如果每次都用開車兜風、半夜三點餵奶來哄睡，倒退期過了，這些習慣可能還留著。給安撫，但盡量用之後也願意持續的方式。
### 7. 照顧好自己
夫妻輪流顧夜，一人負責上半夜、一人負責下半夜，至少每個人都有一段完整的睡眠。家事先放低標準，有人願意幫忙就接受。如果情緒低落、焦慮到睡不著的狀況持續很久，請找醫師聊聊，也可以撥衛福部安心專線1925。
## 是睡眠倒退期，還是生病或長牙？
不是每一段睡不好都是倒退期。先排除這些常見的「冒牌貨」：
[[TABLE:check]]
真正的睡眠倒退期，通常沒有明顯的外在原因，而且幾週內會慢慢好轉。如果拖很久、或伴隨身體不舒服的症狀，就該往其他方向找原因。寶寶喝奶也一起變少的話，可以參考[厭奶期怎麼分辨與改善](${L('baby-milk-refusal-phase')})。
## 睡眠倒退期要不要睡眠訓練？
每個家庭對睡眠訓練的看法不同，沒有標準答案。很多爸媽會選擇先用一致的作息撐過倒退期，等寶寶狀況穩定、沒有生病或長牙不舒服時，再決定要不要調整入睡方式。如果你想開始，先和小兒科醫師討論寶寶的體重和夜奶需求，選一個全家都做得到的方法，並且持續做下去。
## 倒退期也別放鬆安全睡眠
半夜很累的時候，最容易把寶寶抱上大床一起睡。國健署提醒，1歲以下寶寶要避免「5大NG」：
- **任何時候都要仰睡**，不要趴睡或側睡。
- **1歲以下不用枕頭**，包含中間凹陷或有洞的枕頭。
- **同房不同床**，不要和寶寶同床睡。
- **不要包太多、穿太多**，房間保持通風。
- **床面要堅實平整**，床上不放枕頭、絨毛玩具、棉被或床圍。
AAP 也建議寶寶會坐之前就把嬰兒床床墊降低，學會站之前降到最低。
## 什麼時候要看小兒科？
睡眠倒退期本身不需要治療，但出現下面這些情況，請帶寶寶看小兒科，不要只當成倒退期：
- **3個月以下的寶寶發燒**：國健署列為必須儘速就醫的狀況。
- **耳朵痛的跡象**：夜裡特別痛、睡不好，或合併發燒（AAP）。
- **喝奶次數變少、尿布或大便明顯變少、體重增加不理想**（Sleep Foundation）。
- **睡覺時呼吸異常**，例如明顯打鼾、呼吸暫停（Sleep Foundation）。
- **國健署列出的危險徵兆**：持續嘔吐、哭沒有眼淚、尿量大幅減少、呼吸急促或吸氣時胸壁凹陷、意識不清或持續昏睡、抽搐、皮膚出現紫斑、嘴唇或手腳發黑。
- **睡不好持續1個月以上**，或一直沒有好轉的跡象（Sleep Foundation）。
- **你覺得哪裡不對勁**。爸媽的直覺很重要，問一下醫師也沒關係。
如果剛好遇到健檢時間，可以把睡眠問題一起寫進問題清單，健檢時程請看[兒童預防保健7+2](${L('well-baby-visit-schedule')})。緊急狀況請直接撥119。
## MamaBee怎麼陪你度過睡眠倒退期
睡眠倒退期最累人的，除了睡不飽，還有「搞不清楚」：昨晚到底醒了幾次？是越來越糟，還是其實已經在變好？是倒退期，還是生病了？
MamaBee 是 iPhone 上的寶寶紀錄 App，所有方案都沒有廣告，日常記錄都免費：
- **半夜單手就能記**：睡眠、親餵左右計時、瓶餵、擠奶、尿布、副食品，還有體溫、用藥和症狀，一按就記下來。
- **看見趨勢，不靠記憶**：時間軸和7天趨勢讓你看到小睡和夜間睡眠是不是在慢慢回穩。倒退期最需要的，就是這種「其實有在變好」的證據。
- **夫妻2人免費即時同步**：輪班顧夜時，接手的人打開就知道寶寶上一覺幾點睡、上一餐喝了多少。
- **看醫師時有完整紀錄**：免費匯出給小兒科醫師的PDF，不用在診間靠回想。
- **Premium（月費NT$150、年費NT$1,490）**：Sleep Coach 依寶寶的作息預測下一次小睡時間；Bee AI 會根據你的紀錄回答「最近夜醒變多正常嗎」這類問題；還能看30、90、365天的長期趨勢。
紀錄以手機本機為主，只有開啟共享時才會同步到 Realm Labs 的伺服器，資料不會被販售。想比較其他App，可以看[2026寶寶紀錄App推薦](${L('best-baby-tracker-apps-compared')})；正在用Piyo日誌的話，也可以參考[Piyo日誌和MamaBee的比較](${L('mamabee-vs-piyolog')})。
[[CTA||夜醒幾次、睡了多久，一按就記下來：免費下載MamaBee，沒有廣告。]]
## 常見問題
### 睡眠倒退期多久會過？
Sleep Foundation 對各月齡的說法是多數幾天到幾週，很少超過幾週。如果持續1個月以上，或越來越嚴重，請和小兒科醫師討論。
### 4個月睡眠倒退期幾個月開始？
寶寶的睡眠大約從3到4個月開始改變，所以有些寶寶3個月多就開始睡不好，也有人晚一點才出現。每個寶寶時間不同，不一定剛好4個月。
### 每個寶寶都會有睡眠倒退期嗎？
不會。這些月齡只是常見的時間點，有的寶寶幾乎沒感覺就過去了，有的特別明顯。Sleep Foundation 也提到，不是每個寶寶都會經歷6個月或8個月的睡眠倒退。
### 8個月、9個月、10個月睡眠倒退期是同一個嗎？
大多指同一段時間。寶寶在8到10個月間學爬、扶站、開始有分離焦慮，也常從3次小睡改成2次，所以有人在8個月遇到，有人到9、10個月才開始。
### 睡眠倒退期可以奶睡或抱睡嗎？
可以安撫，寶寶需要你。只是國健署提醒，總是靠拍、抱、搖或奶睡的寶寶，夜裡淺睡時更容易醒來找人；能的話，偶爾讓寶寶在想睡但還醒著時放上床練習。
### 1歲睡眠倒退期要改成1次小睡嗎？
通常還不用急。KidsHealth 指出多數幼兒到18個月左右才改成一天1次小睡；1歲時偶爾拒睡，先維持2次小睡、短睡的日子提早上床。
## 重點整理
睡眠倒退期是常見、暫時的睡眠變化，最常在4個月、6個月、8–10個月、1歲和1歲半出現，多半和寶寶的發展有關，Sleep Foundation 說多數只持續幾天到幾週。這段時間維持作息和睡前儀式、依月齡抓清醒時間、白天多練習新技能、夜裡安撫簡短一致，並且守住安全睡眠。有發燒、耳朵痛、喝奶或尿布變少，或拖了1個月以上，就請看小兒科。撐過去之後，你會發現寶寶又多會了一件事。
[[CTA||倒退期一定會過去。用MamaBee看見寶寶的睡眠一天天回穩，夫妻同步也免費。]]
資料來源：[國民健康署：兒童衛教手冊（2025年7月第8版）](https://www.hpa.gov.tw/Pages/EBook.aspx?nodeid=1459)、[衛生福利部國民健康署：避免5大NG行為，寶寶一眠大一吋](https://mohw.gov.tw/cp-16-73280-1.html)、[國民健康署：兒童健康手冊](https://www.hpa.gov.tw/Pages/EBook.aspx?nodeid=1139)、[Sleep Foundation：4-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/4-month-sleep-regression)、[Sleep Foundation：6-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/6-month-sleep-regression)、[Sleep Foundation：8-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/8-month-sleep-regression)、[Sleep Foundation：12-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/12-month-sleep-regression)、[Sleep Foundation：18-Month Sleep Regression](https://www.sleepfoundation.org/baby-sleep/18-month-sleep-regression)、[AASM：兒童建議睡眠時數（PMC）](https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/)、[KidsHealth：Naps](https://kidshealth.org/en/parents/naps.html)、[AAP HealthyChildren：Safe Sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx)、[AAP HealthyChildren：Make Baby's Room Safe](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx)、[AAP HealthyChildren：Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx)、[AAP HealthyChildren：Ear Infection Information](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx)
${DISCLAIMER}`),

  // ───────────────────────────── 2. 厭奶期 ─────────────────────────────
  A('baby-milk-refusal-phase',
    '厭奶期怎麼辦？寶寶幾個月會厭奶、原因與改善方法',
    '厭奶期是什麼？寶寶幾個月會厭奶、為什麼喝幾口就轉頭？整理分心、長牙、生病等原因，教你用尿布數和體重分辨是不是真的吃不夠，附改善方法與何時要看小兒科。',
    ['厭奶期', '寶寶厭奶', '厭奶期幾個月', '寶寶奶量變少', '厭奶期改善'],
    {
      glance: {
        caption: '厭奶期重點一覽',
        headers: ['問題', '重點'],
        rows: [
          ['厭奶期是什麼', '寶寶突然對喝奶沒興趣、奶量變少的一段時間；是台灣常用的說法，不是醫學診斷'],
          ['常見月齡', '常在4到6個月前後被提到，但更早或更晚都可能'],
          ['常見原因', '好奇分心、長牙、鼻塞感冒或嘴巴痛、成長速度放慢、作息改變、被逼著喝'],
          ['先看什麼', '濕尿布一天6片以上、精神好、體重沿著生長曲線增加'],
          ['怎麼改善', '安靜昏暗的地方餵、趁想睡或剛睡醒時餵、看一天總量、不強迫'],
          ['何時看醫師', '尿布變少、體重不增、發燒、嘔吐、腹瀉、昏睡、3個月以下發燒'],
        ],
      },
      causes: {
        caption: '寶寶為什麼會厭奶？常見原因與對策',
        headers: ['原因', '你可能看到', '可以怎麼做'],
        rows: [
          ['好奇、容易分心', '喝幾口就轉頭看聲音、邊喝邊玩、一有人說話就不喝', '換到安靜、光線柔和的地方餵，關掉電視和手機'],
          ['長牙', '流口水、愛咬東西、牙齦腫、比平常煩躁', '冰涼固齒器、乾淨手指輕按牙齦；長牙不會發燒（AAP）'],
          ['鼻塞、感冒', '吸幾口就鬆開、呼吸聲很大、流鼻水', '少量多餐；發燒、呼吸費力請就醫'],
          ['耳朵痛（中耳炎）', '喝奶時哭、夜裡哭醒、可能發燒', '盡快讓小兒科醫師檢查（AAP）'],
          ['嘴巴痛', '口腔白斑擦不掉、嘴破、流口水變多、一喝就哭', '看小兒科；腸病毒常見的手足口病、疱疹性咽峽炎會讓嘴巴痛，出現重症前兆要到大醫院（國健署）'],
          ['成長速度放慢', '精神好、尿布正常，只是喝得比以前少', '看一天總量和生長曲線，不要追著餵'],
          ['作息或環境改變', '換照顧者、出遊、媽媽換了香水或沐浴乳', '作息盡量規律，多抱抱、多肌膚接觸（USDA WIC）'],
          ['被逼著喝完', '一看到奶瓶就哭、扭身、把奶嘴吐出來', '讓寶寶決定喝多少，飽了就停（AAP）'],
        ],
      },
      enough: {
        caption: '厭奶還是真的吃不夠？看這幾件事',
        headers: ['觀察', '比較放心', '要找小兒科'],
        rows: [
          ['濕尿布', '一天6片以上、很濕，尿液清澈或淡黃（國健署）', '少於6片、尿色很深，或尿量大幅減少（國健署、AAP）'],
          ['體重', '沿著兒童健康手冊的生長曲線穩定增加', '體重停滯或下降，曲線一直往下掉'],
          ['精神', '醒著時有精神、會玩會笑、會看人', '昏睡、叫不太醒、活動力明顯變差（國健署）'],
          ['嘴巴與眼淚', '嘴唇濕潤，哭的時候有眼淚', '嘴巴乾、哭沒有眼淚、囟門凹陷（AAP）'],
          ['大便', '次數和顏色跟平常差不多', '腹瀉超過一天、帶血，或顏色偏白（對照手冊大便卡）'],
          ['一天總奶量', '單餐變少，但一天加起來大致在範圍內', '一整天都喝得很少，而且尿布同時變少'],
        ],
      },
    },
`**厭奶期是台灣爸媽常說的「寶寶突然不愛喝奶」：喝幾口就轉頭、邊喝邊東張西望，奶量比之前少。它不是醫學診斷，常在4到6個月前後被提到，多半和好奇分心、長牙、成長速度放慢或生病有關。只要寶寶精神好、一天濕尿布6片以上、體重沿著生長曲線增加，通常不必太擔心。**
前一個月還能一口氣喝完180 ml，這幾天卻喝60 ml就把頭轉開，再塞奶嘴就開始哭。很多爸媽一邊泡奶一邊焦慮：「是不是厭奶期？要不要換奶粉？會不會餓壞？」
這篇整理厭奶期常見的月齡、原因，教你用尿布數和體重分辨「只是不想喝」還是「真的吃不夠」，再給你在家就能試的改善方法，以及什麼時候一定要看小兒科。
## 厭奶期一覽
[[TABLE:glance]]
## 厭奶期是什麼？
「厭奶期」是台灣、香港很常見的說法，指寶寶在某段時間對喝奶變得沒興趣：奶量變少、喝一下就停、喝奶時很容易分心。醫學上沒有一個叫「厭奶期」的診斷，也沒有固定的開始和結束日期。
英文裡比較接近的說法，是親餵寶寶的「nursing strike」（罷奶）。美國農業部的 WIC 母乳哺育資源說明，寶寶突然不太想吸奶，代表「有些事情改變了，但不一定是出了問題」；原本喝得好好的1歲以下寶寶，通常也還沒準備好要斷奶。
所以面對厭奶期，重點不是「怎麼讓寶寶喝完」，而是先確認寶寶有沒有吃夠、有沒有生病，再減少讓他分心的因素。
## 厭奶期幾個月開始？
厭奶期最常在4到6個月前後被提到。國健署《兒童衛教手冊》談副食品時，也是在「滿4到6個月」這一段提到寶寶「出現厭奶」的情況。不過這不是固定的時程：有的寶寶3個月就開始邊喝邊看，有的到8、9個月才挑嘴，也有寶寶從來沒有明顯的厭奶期。
為什麼常在這個時候？幾件事剛好同時發生：
- **寶寶開始注意世界**。WIC 的資料提到，寶寶長大一點、開始注意周遭時，比較容易出現不肯吸奶的狀況。
- **體重增加的速度變慢**。國健署《母乳哺育手冊》提到，寶寶體重增加的速度會隨年齡越大越緩慢；長得沒那麼快，胃口也可能跟著平穩下來。
- **長牙的不舒服開始了**。AAP 指出第一顆牙通常在6到10個月長出來，但不舒服最早可能從3個月就開始。
## 厭奶期的常見表現
- 喝幾口就轉頭、推開奶瓶，或把乳頭、奶嘴吐出來
- 一有聲音、有人走過就停下來看，喝喝停停
- 每餐奶量比之前少，或每餐拖很久
- 白天喝得少，晚上或半夜喝得比較多
- 一看到奶瓶就扭身、哭鬧
CDC 也列出寶寶吃飽的訊號：閉上嘴巴、把頭轉離乳房或奶瓶、雙手放鬆。AAP 則提醒，如果寶寶喝奶時變得扭來扭去、很容易分心，多半表示他已經喝夠了。所以有些「厭奶」，其實是寶寶在告訴你「我飽了」。
## 寶寶為什麼會厭奶？
[[TABLE:causes]]
WIC 的資料也列出讓寶寶突然不想吸奶的常見原因：感冒、耳朵感染、鼻塞、腸胃不舒服、長牙、鵝口瘡、嘴邊皰疹，以及環境裡讓他分心的事、作息改變、和媽媽分開一段時間、媽媽換了香皂或香水的味道。
年紀比較小的寶寶也要想到腸絞痛。國健署《兒童衛教手冊》描述，腸絞痛的寶寶常在傍晚或半夜哭鬧，看起來像肚子餓，卻拒絕吸奶。
## 厭奶還是真的吃不夠？先看尿布和體重
這是最重要的一段。比起「這一餐喝了幾ml」，醫師更在意的是寶寶整體有沒有吃夠：
[[TABLE:enough]]
### 尿布：一天6片以上
國健署《母乳哺育手冊》的參考表是，出生5天以後，寶寶一天會有6片以上的濕尿布，尿布很濕，尿液清澈或淡黃；出生5天後一天排尿少於6次而且顏色很深，就是沒喝到足夠奶水的表徵之一。AAP 也把「嬰兒一天濕尿布少於6片」列為脫水的警訊。
### 體重：看曲線，不看一次
國健署《母乳哺育手冊》提到，寶寶4個月前每月最少增加500公克，之後增加速度會隨年齡越大越緩慢。所以4到6個月的寶寶，體重增加比之前慢、奶量沒有一直往上加，本來就是正常的。把每次健檢量到的體重畫在兒童健康手冊的生長曲線上，只要沿著自己的曲線前進，就比單看一餐的奶量可靠得多。
### 奶量：看一天總量
4到6個月的寶寶，瓶餵常見是一餐約150到210 ml、一天約5到6次；6到9個月一餐約180到240 ml、一天約4到5次。這些只是參考值，AAP 也說寶寶通常會自己一天一天調整食量，而且配方奶一天平均不需要超過約960 ml。各月齡的完整數字可以看[0–12個月寶寶奶量表](${L('baby-feeding-schedule-by-age')})。
如果單餐變少，但一天加起來還在範圍內、尿布正常、精神好，多半就是暫時的厭奶。
## 厭奶期怎麼辦？10個改善方法
### 1. 換到安靜、光線柔和的地方餵
WIC 建議在遠離電視和強光的安靜地方餵奶。關掉電視、手機放旁邊，讓寶寶面向牆壁或窩在你懷裡，少一點讓他想轉頭看的東西。
### 2. 趁想睡或剛睡醒時餵
WIC 也建議在寶寶有飢餓或想睡的訊號、剛睡醒時試著餵。這時候寶寶比較放鬆，也比較不會被周遭吸引。很多厭奶的寶寶，睡前那一餐反而喝得最好。
### 3. 看一天總量，不要只盯一餐
一餐少、下一餐多，一天加起來夠就好。把每一餐記下來，比靠印象準確，也比較不會因為一餐喝不好就整天焦慮。
### 4. 不追著餵、不強迫喝完
AAP 的原則是讓寶寶告訴你他喝夠了。寶寶閉嘴、轉頭、推開，就先停下來。追著餵、硬塞奶嘴，只會讓寶寶把喝奶和不愉快連在一起，更排斥。
### 5. 喝不下就先收，過一陣子再試
WIC 建議，寶寶很挫折時先停下，晚一點再試。與其一餐拖40分鐘，不如收起來，等寶寶下一次有飢餓訊號再餵。
### 6. 親餵媽媽：換姿勢、多肌膚接觸、按時擠奶
WIC 的建議包括：試試不同的哺乳姿勢、多抱抱和肌膚接觸，並且在原本餵奶的時間擠奶或手擠，維持奶量、避免塞奶或脹奶。母乳哺育的問題也可以打國健署孕產婦關懷專線0800-870-870。
### 7. 瓶餵寶寶：檢查奶嘴和餵奶方式
奶嘴太慢會讓寶寶吸得很累，太快則容易嗆到。可以觀察寶寶吸吮和吞嚥的節奏，必要時換一個階段的奶嘴；奶溫、奶粉沖泡方式維持和平常一樣。不要因為厭奶就自己頻繁換奶粉，想換之前先問小兒科醫師。
### 8. 先處理不舒服
長牙時，可以先給冰涼的固齒器，或用乾淨的手指輕按牙齦，再餵奶。AAP 指出長牙不會造成發燒，所以如果寶寶發燒，請找其他原因。鼻塞時少量多餐，必要時請小兒科醫師教你怎麼清鼻子。
### 9. 滿4到6個月：和醫師討論副食品
國健署《兒童衛教手冊》提到，滿4到6個月的寶寶如果「出現厭奶但沒生病或其他原因」，可以考慮在滿4個月後開始添加副食品；但前提是先排除生病，所以請先讓小兒科醫師評估。手冊也提醒，糊狀食物要用湯匙餵，避免把副食品加進奶瓶和奶一起餵。
### 10. 不用拿水或果汁來補
AAP 指出6個月前的寶寶以母乳或配方奶為主，不需要額外喝水；6個月後可以用杯子喝一點水，1歲以下不建議喝果汁。厭奶時用水或果汁填飽肚子，反而會讓寶寶更不想喝奶。
[[CTA||每一餐喝了多少、一天濕尿布幾片，用MamaBee一按就記下，厭奶期不再靠印象。]]
## 厭奶期會持續多久？
厭奶期沒有官方的固定天數，各家說法也不一樣。WIC 對罷奶的描述是，寶寶通常不久後就會重新開始喝。與其等一個日期，不如每天看三件事：尿布數、精神、體重。
如果這三件事都正常，寶寶只是喝得比較少，可以照上面的方法慢慢來。如果奶量越來越少，而且尿布跟著變少、體重停滯，就不要再等了，請帶寶寶看小兒科。
## 厭奶期和睡眠的關係
厭奶常和睡不好一起出現：白天喝得少，半夜就醒來討奶；長牙或鼻塞，也會同時影響喝奶和睡眠。4個月、8到10個月前後的寶寶，也可能同時碰上睡眠倒退期。想了解各月齡夜醒的原因和對策，可以看[睡眠倒退期怎麼辦](${L('baby-sleep-regressions-by-age')})。
## 什麼時候要看小兒科？
有以下任何一種情況，就不是單純的厭奶期，請盡快就醫：
- **3個月以下的寶寶發燒**（國健署）。
- **濕尿布一天少於6片、尿色很深，或尿量大幅減少**（國健署、AAP）。
- **哭沒有眼淚、嘴巴很乾、囟門凹陷**等脫水徵兆（AAP、國健署）。
- **體重沒增加或下降**，或出生兩週後還沒回到出生體重（國健署）。
- **持續嘔吐**，或吐出綠色、帶血的東西。
- **腹瀉超過一天**（AAP）。
- **昏睡、叫不太醒、活動力明顯降低、呼吸急促**（國健署）。
- **嘴破、口腔有白斑，或發燒加上拒吃**。腸病毒發病後7天內出現嗜睡、意識不清、活動力降低、手腳無力、肌躍型抽搐、持續嘔吐或呼吸急促等重症前兆，國健署建議及早到大醫院就醫。
- **耳朵痛的跡象**，例如喝奶時哭、夜裡哭醒，或合併發燒（AAP）。
就算沒有上面的狀況，只要你很擔心，也可以直接問小兒科醫師。4到6個月、6個月到1歲剛好都有公費健檢，可以把奶量和尿布紀錄帶去，健檢時程請看[兒童預防保健7+2](${L('well-baby-visit-schedule')})；同一天如果要打預防針，可以順便對照[寶寶疫苗時程表](${L('baby-vaccine-schedule-explained')})。緊急狀況請直接撥119。
## MamaBee怎麼幫你看懂厭奶期
厭奶期最折磨人的，是每一餐都在猜：「今天是不是又喝太少？」MamaBee 讓答案來自紀錄，而不是凌晨三點的記憶。
MamaBee 是 iPhone 上的寶寶紀錄 App，所有方案都沒有廣告，日常記錄都免費：
- **每一餐一按就記**：瓶餵的ml數、親餵左右邊計時、擠奶量，加上副食品。
- **尿布一起記**：濕、便、混合、乾，一天幾片一目了然，這正是分辨「厭奶」和「吃不夠」最需要的數字。
- **時間軸和7天趨勢**：看見一天總奶量和尿布的變化，知道寶寶是暫時喝少，還是一直往下掉。
- **WHO成長百分位**：輸入身高體重，就能看到寶寶有沒有沿著自己的曲線長大，和兒童健康手冊用的是同一套標準。
- **夫妻2人免費即時同步**：阿嬤或另一半餵的那一餐也記得到，不會漏算。
- **看醫師時直接匯出PDF**：免費匯出給小兒科醫師看的紀錄，比口頭描述清楚得多。
- **Premium（月費NT$150、年費NT$1,490）**：Bee AI 會根據你的紀錄回答「這週奶量變少要擔心嗎」這類問題，也能看30、90、365天的長期趨勢；Sleep Coach 小睡預測也包含在內。
紀錄以手機本機為主，只有開啟共享時才會同步到 Realm Labs 的伺服器，資料不會被販售。想比較其他記錄App，可以看[2026寶寶紀錄App推薦](${L('best-baby-tracker-apps-compared')})；正在用Piyo日誌的話，也可以參考[Piyo日誌和MamaBee的比較](${L('mamabee-vs-piyolog')})。
## 常見問題
### 厭奶期是幾個月？
厭奶期最常在4到6個月前後被提到，但沒有固定月齡，有的寶寶更早或更晚，也有寶寶沒有明顯的厭奶期。它是台灣常用的說法，不是醫學診斷。
### 厭奶期會持續多久？
沒有官方的固定天數，多數寶寶過一陣子就會恢復。與其數日子，不如每天看尿布數、精神和體重；如果尿布變少或體重停滯，請看小兒科。
### 寶寶厭奶一天要喝多少才夠？
4到6個月的寶寶瓶餵常見一餐約150到210 ml、一天5到6次，但每個寶寶食量不同。比起奶量，一天濕尿布6片以上、精神好、體重沿著曲線增加，才是吃夠的主要依據。
### 厭奶期要換奶粉嗎？
多數厭奶和奶粉無關，常是分心、長牙或成長速度放慢。不建議因為厭奶就自己頻繁換奶粉；如果懷疑寶寶對奶粉不適應，例如一直吐、腹瀉或起疹子，請先問小兒科醫師。
### 厭奶期可以提早吃副食品嗎？
國健署《兒童衛教手冊》提到，滿4到6個月的寶寶如果出現厭奶但沒生病或其他原因，可以考慮在滿4個月後開始添加副食品。請先讓小兒科醫師排除生病，再決定開始的時間。
### 寶寶厭奶，半夜喝比較多正常嗎？
很常見。白天容易分心，半夜想睡時反而喝得好，一天總量就補回來了。只要尿布和體重正常，可以先接受這個節奏，再慢慢把白天的餵奶環境調整得安靜一點。
## 重點整理
厭奶期是寶寶一段時間對喝奶沒興趣，常在4到6個月前後出現，多半和好奇分心、長牙、成長速度放慢或身體不舒服有關。判斷有沒有吃夠，看的是一天濕尿布6片以上、精神好、體重沿著生長曲線增加，而不是單餐的ml數。改善的關鍵是安靜的環境、趁想睡或剛睡醒時餵、看一天總量、不強迫。尿布變少、體重不增、發燒、嘔吐、腹瀉或昏睡，就請盡快看小兒科。
[[CTA||奶量、尿布、體重放在同一個地方：免費下載MamaBee，夫妻同步也不用錢。]]
資料來源：[國民健康署：兒童衛教手冊（2025年7月第8版）](https://www.hpa.gov.tw/Pages/EBook.aspx?nodeid=1459)、[國民健康署：母乳哺育手冊](https://www.hpa.gov.tw/Pages/EBook.aspx?nodeid=1586)、[國民健康署：兒童健康手冊](https://www.hpa.gov.tw/Pages/EBook.aspx?nodeid=1139)、[AAP HealthyChildren：Amount and Schedule of Formula Feedings](https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx)、[AAP HealthyChildren：How to Tell if Baby is Getting Enough Milk](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx)、[AAP HealthyChildren：Dehydration](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Dehydration.aspx)、[AAP HealthyChildren：Teething Pain](https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx)、[AAP HealthyChildren：Ear Infection Information](https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Ear-Infection-Information.aspx)、[AAP HealthyChildren：Recommended Drinks for Young Children](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Recommended-Drinks-for-Young-Children-Ages-0-5.aspx)、[CDC：Signs Your Child Is Hungry or Full](https://www.cdc.gov/infant-toddler-nutrition/mealtime/signs-your-child-is-hungry-or-full.html)、[USDA WIC Breastfeeding Support：Why Baby May Suddenly Refuse the Breast](https://wicbreastfeeding.fna.usda.gov/why-baby-may-suddenly-refuse-breast)
${DISCLAIMER}`),
]

// CJK text has no spaces, so count characters for CJK and words for Latin text.
const CJK = /[぀-ヿ㐀-鿿가-힯]/g
const DRY = !!process.env.DRY
for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${LANG}-${a.slug}`, _type: 'article', brand: 'mamabee', language: LANG, title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  let coverFrom = null
  for (const rel of COVERS[a.slug] || []) {
    const src = await client.getDocument(`mamabee-${rel}`)
    if (src && src.coverImage) { doc.coverImage = src.coverImage; coverFrom = rel; break }
  }
  const hrefs = doc.body.flatMap((b) => (b.markDefs || []).map((d) => d.href).filter(Boolean))
  const internal = [...new Set(hrefs.filter((h) => h.startsWith('/mamabee/')))]
  const bad = internal.filter((h) => !ALLOWED.has(h))
  if (bad.length) throw new Error(`${a.slug}: unknown internal links ${bad.join(' ')}`)
  const text = doc.body.filter((b) => b._type === 'block').map((b) => b.children.map((s) => s.text).join('')).join('\n')
  for (const banned of [/免費.{0,6}(Sleep Coach|Bee AI)/, /(Sleep Coach|Bee AI).{0,6}免費/, /疫苗.{0,8}免費/, /優惠|特價|折扣|隱私標籤/]) if (banned.test(text)) throw new Error(`${a.slug}: banned phrase ${banned}`)
  if (!DRY) await client.createOrReplace(doc)
  const cjk = (text.match(CJK) || []).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  const ctas = doc.body.filter((b) => b._type === 'appCta').length
  const faqStart = doc.body.findIndex((b) => b.style === 'h2' && b.children[0]?.text === '常見問題')
  const faqEnd = doc.body.findIndex((b, i) => i > faqStart && b.style === 'h2')
  const faqs = faqStart < 0 ? 0 : doc.body.slice(faqStart, faqEnd).filter((b) => b.style === 'h3').length
  const lede = (doc.body[0].children.map((s) => s.text).join('').match(CJK) || []).length
  console.log(`${DRY ? '[DRY] ' : ''}draft ${LANG}/${a.slug} (${cjk} CJK chars, ${tables} tables, ${faqs} FAQs, ${ctas} CTAs, lede ${lede} chars, title ${a.title.length}c, desc ${a.description.length}c, cover from ${coverFrom || 'NONE'}, ${internal.length} internal links)`)
  if (DRY) console.log('   internal:', internal.join(' '))
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
