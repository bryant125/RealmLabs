/* ============================================================
   MamaBee — legal pages i18n (Privacy + Terms)
   Key-based: each [data-i18n] element's full innerHTML is swapped,
   so inline <strong>/<a> and word order stay correct per language.
   Shares the footer #lang-select and the 'mb_lang' localStorage key
   with the landing page, so the chosen language carries across pages.

   NOTE: brand/technical tokens (MamaBee, iCloud, SwiftData, Core ML,
   Gemini Flash, Google, Apple, CSV/PDF/JSON, iOS, App Store, USD, and
   literal in-app navigation paths) are intentionally left untranslated.
   Machine-assisted translations of legal text — have a native speaker
   / lawyer review before relying on them in a given market.
   ============================================================ */
(function () {
  var LANGS = ['zh-Hans','zh-Hant','ja','ko','de','es','fr','it','ru','th','vi'];
  var DICT = {};
  function L(key, arr) { var o = {}; for (var i = 0; i < LANGS.length; i++) o[LANGS[i]] = arr[i]; DICT[key] = o; }

  /* ---------- shared ---------- */
  L('toc.label', ['本页内容','本頁內容','このページの内容','이 페이지 내용','Auf dieser Seite','En esta página','Sur cette page','In questa pagina','На этой странице','ในหน้านี้','Trong trang này']);
  L('legal.related', ['相关：','相關：','関連：','관련:','Verwandt:','Relacionado:','Connexe :','Correlato:','См. также:','ที่เกี่ยวข้อง:','Liên quan:']);
  L('legal.readTerms', ['阅读我们的服务条款','閱讀我們的服務條款','利用規約を読む','이용약관 보기','Unsere Nutzungsbedingungen lesen','Leer nuestros Términos de servicio','Lire nos Conditions de service','Leggi i nostri Termini di servizio','Читать наши Условия использования','อ่านข้อกำหนดการให้บริการ','Đọc Điều khoản dịch vụ']);
  L('legal.readPrivacy', ['阅读我们的隐私政策','閱讀我們的隱私政策','プライバシーポリシーを読む','개인정보 처리방침 보기','Unsere Datenschutzerklärung lesen','Leer nuestra Política de privacidad','Lire notre Politique de confidentialité','Leggi la nostra Informativa sulla privacy','Читать нашу Политику конфиденциальности','อ่านนโยบายความเป็นส่วนตัว','Đọc Chính sách quyền riêng tư']);

  /* ====================================================
     PRIVACY
     ==================================================== */
  L('pv.crumb', [
    '<a href="index.html" style="color:inherit">主页</a> · 法律 · 隐私',
    '<a href="index.html" style="color:inherit">首頁</a> · 法律 · 隱私',
    '<a href="index.html" style="color:inherit">ホーム</a> · 法的事項 · プライバシー',
    '<a href="index.html" style="color:inherit">홈</a> · 법적 고지 · 개인정보',
    '<a href="index.html" style="color:inherit">Start</a> · Rechtliches · Datenschutz',
    '<a href="index.html" style="color:inherit">Inicio</a> · Legal · Privacidad',
    '<a href="index.html" style="color:inherit">Accueil</a> · Mentions légales · Confidentialité',
    '<a href="index.html" style="color:inherit">Home</a> · Note legali · Privacy',
    '<a href="index.html" style="color:inherit">Главная</a> · Правовое · Конфиденциальность',
    '<a href="index.html" style="color:inherit">หน้าแรก</a> · กฎหมาย · ความเป็นส่วนตัว',
    '<a href="index.html" style="color:inherit">Trang chủ</a> · Pháp lý · Quyền riêng tư'
  ]);
  L('pv.title', ['隐私政策','隱私政策','プライバシーポリシー','개인정보 처리방침','Datenschutzerklärung','Política de privacidad','Politique de confidentialité','Informativa sulla privacy','Политика конфиденциальности','นโยบายความเป็นส่วนตัว','Chính sách quyền riêng tư']);
  L('pv.updated', ['最后更新：2026 年 5 月','最後更新：2026 年 5 月','最終更新：2026 年 5 月','최종 업데이트: 2026년 5월','Zuletzt aktualisiert: Mai 2026','Última actualización: mayo de 2026','Dernière mise à jour : mai 2026','Ultimo aggiornamento: maggio 2026','Последнее обновление: май 2026','อัปเดตล่าสุด: พฤษภาคม 2026','Cập nhật lần cuối: Tháng 5 năm 2026']);
  L('pv.toc.summary', ['通俗摘要','白話摘要','かんたんな概要','쉬운 요약','Zusammenfassung','Resumen sencillo','Résumé en clair','Riepilogo semplice','Кратко по-простому','สรุปแบบเข้าใจง่าย','Tóm tắt dễ hiểu']);

  L('pv.h.collect', ['我们收集什么','我們收集什麼','収集する情報','수집하는 정보','Was wir erfassen','Qué recopilamos','Ce que nous collectons','Cosa raccogliamo','Что мы собираем','ข้อมูลที่เราเก็บ','Những gì chúng tôi thu thập']);
  L('pv.h.lives', ['你的数据存放在哪里','你的資料存放在哪裡','データの保存場所','데이터가 저장되는 곳','Wo Ihre Daten liegen','Dónde viven tus datos','Où vivent vos données','Dove risiedono i tuoi dati','Где хранятся ваши данные','ข้อมูลของคุณอยู่ที่ไหน','Dữ liệu của bạn nằm ở đâu']);
  L('pv.h.ai', ['MamaBee AI 助手','MamaBee AI 助手','MamaBee AI アシスタント','MamaBee AI 어시스턴트','MamaBee KI-Assistent','Asistente de IA de MamaBee','Assistant IA MamaBee','Assistente IA di MamaBee','AI-ассистент MamaBee','ผู้ช่วย AI ของ MamaBee','Trợ lý AI MamaBee']);
  L('pv.h.dont', ['我们不做什么','我們不做什麼','私たちがしないこと','우리가 하지 않는 것','Was wir NICHT tun','Lo que NO hacemos','Ce que nous ne faisons pas','Ciò che NON facciamo','Чего мы НЕ делаем','สิ่งที่เราไม่ทำ','Những gì chúng tôi KHÔNG làm']);
  L('pv.h.rights', ['你的权利','你的權利','あなたの権利','당신의 권리','Ihre Rechte','Tus derechos','Vos droits','I tuoi diritti','Ваши права','สิทธิของคุณ','Quyền của bạn']);
  L('pv.h.children', ['儿童','兒童','お子さまについて','아동','Kinder','Niños','Enfants','Bambini','Дети','เด็ก','Trẻ em']);
  L('pv.h.contact', ['联系我们','聯絡我們','お問い合わせ','문의','Kontakt','Contacto','Contact','Contatti','Контакты','ติดต่อ','Liên hệ']);
  L('pv.h.perm', ['数据权限','資料權限','データ権限','데이터 권한','Datenberechtigungen','Permisos de datos','Autorisations de données','Autorizzazioni dati','Разрешения на данные','สิทธิ์การเข้าถึงข้อมูล','Quyền truy cập dữ liệu']);

  L('pv.sum.tag', ['🍯 通俗摘要','🍯 白話摘要','🍯 かんたんな概要','🍯 쉬운 요약','🍯 Zusammenfassung','🍯 Resumen sencillo','🍯 Résumé en clair','🍯 Riepilogo semplice','🍯 Кратко по-простому','🍯 สรุปแบบเข้าใจง่าย','🍯 Tóm tắt dễ hiểu']);
  L('pv.sum.body', [
    'MamaBee 是为记录宝宝的父母打造的。你的数据——宝宝的档案、照片以及你写下的每一条记录——都保存在你自己的设备上。我们不出售它，不在上面投放广告，也不对它做分析。唯一会离开你设备的情形，是你点按"询问 MamaBee AI"时（即便如此，我们也绝不发送宝宝的姓名或照片），或你点按导出时（我们把文件交给你，之后如何使用由你决定）。',
    'MamaBee 是為記錄寶寶的父母打造的。你的資料——寶寶的檔案、照片以及你寫下的每一條記錄——都保存在你自己的裝置上。我們不出售它，不在上面投放廣告，也不對它做分析。唯一會離開你裝置的情形，是你點按「詢問 MamaBee AI」時（即便如此，我們也絕不傳送寶寶的姓名或照片），或你點按匯出時（我們把檔案交給你，之後如何使用由你決定）。',
    'MamaBee は赤ちゃんを記録する親のために作られています。あなたのデータ——赤ちゃんのプロフィール、写真、あなたが書いたすべての記録——は、あなたの端末内に留まります。私たちはそれを売らず、広告も出さず、分析もしません。データが端末を離れるのは、「MamaBee AI に聞く」をタップしたとき（その場合でも赤ちゃんの名前や写真は決して送りません）か、エクスポートをタップしたとき（ファイルをお渡しします。その後の扱いはあなた次第です）だけです。',
    'MamaBee는 아기를 기록하는 부모를 위해 만들어졌습니다. 당신의 데이터 — 아기의 프로필, 사진, 당신이 작성한 모든 기록 — 는 당신의 기기에 남아 있습니다. 우리는 그것을 팔지 않고, 광고를 띄우지 않으며, 분석하지도 않습니다. 데이터가 기기를 벗어나는 유일한 경우는 "MamaBee AI에 묻기"를 탭할 때(그조차도 아기의 이름이나 사진은 절대 보내지 않습니다)이거나 내보내기를 탭할 때(파일을 건네드리며, 이후 사용은 당신에게 달려 있습니다)뿐입니다.',
    'MamaBee ist für Eltern gemacht, die ihr Baby tracken. Ihre Daten — das Profil Ihres Babys, Fotos und jeder Eintrag, den Sie schreiben — bleiben auf IHREM Gerät. Wir verkaufen sie nicht, zeigen keine Werbung darauf und werten sie nicht aus. Das Einzige, was Ihr Gerät je verlässt, ist, wenn Sie auf „MamaBee AI fragen" tippen (und selbst dann senden wir nie den Namen oder das Foto Ihres Babys) oder wenn Sie auf Export tippen (wir geben Ihnen eine Datei; was Sie damit tun, ist Ihre Sache).',
    'MamaBee está hecho para padres que registran a su bebé. Tus datos —el perfil de tu bebé, las fotos y cada registro que escribes— se quedan en TU dispositivo. No los vendemos, no mostramos anuncios y no hacemos analítica sobre ellos. Lo único que sale de tu dispositivo es cuando tocas "Preguntar a MamaBee AI" (y aun así nunca enviamos el nombre ni la foto de tu bebé) o cuando tocas Exportar (te damos un archivo; lo que hagas con él depende de ti).',
    'MamaBee est conçu pour les parents qui suivent leur bébé. Vos données — le profil de votre bébé, les photos et chaque enregistrement que vous écrivez — restent sur VOTRE appareil. Nous ne les vendons pas, n\'affichons pas de publicité dessus et ne faisons pas d\'analyse. La seule fois où quelque chose quitte votre appareil, c\'est quand vous touchez « Demander à MamaBee AI » (et même là, nous n\'envoyons jamais le nom ni la photo de votre bébé) ou quand vous touchez Exporter (nous vous remettons un fichier ; ce que vous en faites vous regarde).',
    'MamaBee è fatto per i genitori che monitorano il loro bambino. I tuoi dati — il profilo del tuo bambino, le foto e ogni voce che scrivi — restano sul TUO dispositivo. Non li vendiamo, non ci mostriamo pubblicità e non facciamo analisi su di essi. L\'unica volta in cui qualcosa lascia il tuo dispositivo è quando tocchi "Chiedi a MamaBee AI" (e anche allora non inviamo mai il nome o la foto del tuo bambino) o quando tocchi Esporta (ti consegniamo un file; cosa ne fai dipende da te).',
    'MamaBee создан для родителей, отслеживающих своего малыша. Ваши данные — профиль малыша, фотографии и каждая ваша запись — остаются на ВАШЕМ устройстве. Мы их не продаём, не показываем на них рекламу и не анализируем их. Единственный случай, когда что-либо покидает ваше устройство, — это когда вы нажимаете «Спросить MamaBee AI» (и даже тогда мы никогда не отправляем имя или фото малыша) или когда вы нажимаете «Экспорт» (мы выдаём вам файл; что с ним делать — решаете вы).',
    'MamaBee สร้างมาเพื่อพ่อแม่ที่บันทึกข้อมูลลูกน้อย ข้อมูลของคุณ — โปรไฟล์ของลูก รูปภาพ และทุกบันทึกที่คุณเขียน — จะอยู่บนอุปกรณ์ของคุณ เราไม่ขายมัน ไม่แสดงโฆษณาบนมัน และไม่วิเคราะห์มัน สิ่งเดียวที่ออกจากอุปกรณ์ของคุณคือเมื่อคุณแตะ "ถาม MamaBee AI" (และแม้กระนั้นเราก็ไม่เคยส่งชื่อหรือรูปของลูก) หรือเมื่อคุณแตะ ส่งออก (เรามอบไฟล์ให้คุณ ส่วนคุณจะนำไปทำอะไรก็แล้วแต่คุณ)',
    'MamaBee được tạo ra cho cha mẹ theo dõi em bé của mình. Dữ liệu của bạn — hồ sơ của bé, ảnh, và mọi nhật ký bạn viết — đều nằm trên THIẾT BỊ CỦA BẠN. Chúng tôi không bán nó, không hiển thị quảng cáo trên nó, và không phân tích nó. Lần duy nhất bất cứ thứ gì rời khỏi thiết bị của bạn là khi bạn chạm "Hỏi MamaBee AI" (và ngay cả khi đó chúng tôi cũng không bao giờ gửi tên hay ảnh của bé) hoặc khi bạn chạm Xuất (chúng tôi đưa bạn một tệp; bạn làm gì với nó là tùy bạn).'
  ]);

  L('pv.collect.1', [
    '<strong>宝宝档案</strong> — 姓名、出生日期与时间、性别、国家/地区、可选照片。',
    '<strong>寶寶檔案</strong> — 姓名、出生日期與時間、性別、國家/地區、可選照片。',
    '<strong>赤ちゃんのプロフィール</strong> — 名前、生年月日と時刻、性別、国、任意の写真。',
    '<strong>아기 프로필</strong> — 이름, 생년월일 및 시각, 성별, 국가, 선택적 사진.',
    '<strong>Baby-Profil</strong> — Name, Geburtsdatum und -zeit, Geschlecht, Land, optionales Foto.',
    '<strong>Perfil del bebé</strong> — nombre, fecha y hora de nacimiento, sexo, país, foto opcional.',
    '<strong>Profil du bébé</strong> — nom, date et heure de naissance, sexe, pays, photo facultative.',
    '<strong>Profilo del bambino</strong> — nome, data e ora di nascita, sesso, paese, foto facoltativa.',
    '<strong>Профиль малыша</strong> — имя, дата и время рождения, пол, страна, необязательное фото.',
    '<strong>โปรไฟล์ลูกน้อย</strong> — ชื่อ วันและเวลาเกิด เพศ ประเทศ รูปภาพ (ถ้ามี)',
    '<strong>Hồ sơ của bé</strong> — tên, ngày giờ sinh, giới tính, quốc gia, ảnh tùy chọn.'
  ]);
  L('pv.collect.2', [
    '<strong>追踪记录</strong> — 睡眠时段、喂养、换尿布（包括你附加的任何照片）、生长测量、健康事件、里程碑、活动、疫苗接种。',
    '<strong>追蹤記錄</strong> — 睡眠時段、餵養、換尿布（包括你附加的任何照片）、生長測量、健康事件、里程碑、活動、疫苗接種。',
    '<strong>記録ログ</strong> — 睡眠、授乳、おむつ替え（添付した写真を含む）、成長計測、健康イベント、マイルストーン、アクティビティ、予防接種。',
    '<strong>추적 기록</strong> — 수면 세션, 수유, 기저귀 교체(첨부한 사진 포함), 성장 측정, 건강 이벤트, 발달 이정표, 활동, 예방접종.',
    '<strong>Tracking-Logs</strong> — Schlafphasen, Mahlzeiten, Windelwechsel (inkl. angehängter Fotos), Wachstumsmessungen, Gesundheitsereignisse, Meilensteine, Aktivitäten, Impfungen.',
    '<strong>Registros de seguimiento</strong> — sesiones de sueño, tomas, cambios de pañal (incluida cualquier foto que adjuntes), mediciones de crecimiento, eventos de salud, hitos, actividades, vacunas.',
    '<strong>Journaux de suivi</strong> — sessions de sommeil, repas, changes (y compris toute photo que vous joignez), mesures de croissance, événements de santé, jalons, activités, vaccinations.',
    '<strong>Registri di tracciamento</strong> — sessioni di sonno, poppate, cambi di pannolino (incluse eventuali foto allegate), misurazioni della crescita, eventi di salute, traguardi, attività, vaccinazioni.',
    '<strong>Журналы отслеживания</strong> — сон, кормления, смены подгузников (включая прикреплённые фото), измерения роста, события здоровья, вехи, активности, прививки.',
    '<strong>บันทึกการติดตาม</strong> — ช่วงการนอน การป้อนนม การเปลี่ยนผ้าอ้อม (รวมถึงรูปที่คุณแนบ) การวัดการเติบโต เหตุการณ์สุขภาพ พัฒนาการ กิจกรรม การฉีดวัคซีน',
    '<strong>Nhật ký theo dõi</strong> — giấc ngủ, cữ bú, thay tã (bao gồm ảnh bạn đính kèm), số đo tăng trưởng, sự kiện sức khỏe, cột mốc, hoạt động, tiêm chủng.'
  ]);
  L('pv.collect.3', [
    '<strong>应用偏好</strong> — 计量单位、底部栏顺序、国家/地区选择。',
    '<strong>應用偏好</strong> — 計量單位、底部欄順序、國家/地區選擇。',
    '<strong>アプリの設定</strong> — 計測単位、下部バーの並び順、国の選択。',
    '<strong>앱 환경설정</strong> — 측정 단위, 하단 바 순서, 국가 선택.',
    '<strong>App-Einstellungen</strong> — Maßeinheiten, Reihenfolge der unteren Leiste, Länderauswahl.',
    '<strong>Preferencias de la app</strong> — unidades de medida, orden de la barra inferior, selección de país.',
    '<strong>Préférences de l\'app</strong> — unités de mesure, ordre de la barre inférieure, choix du pays.',
    '<strong>Preferenze dell\'app</strong> — unità di misura, ordine della barra inferiore, selezione del paese.',
    '<strong>Настройки приложения</strong> — единицы измерения, порядок нижней панели, выбор страны.',
    '<strong>การตั้งค่าแอป</strong> — หน่วยวัด ลำดับแถบด้านล่าง การเลือกประเทศ',
    '<strong>Tùy chọn ứng dụng</strong> — đơn vị đo, thứ tự thanh dưới, lựa chọn quốc gia.'
  ]);
  L('pv.collect.note', [
    '我们<strong>不会</strong>收集设备标识符、位置、通讯录，或任何并非由你直接输入/点按的其他信息。',
    '我們<strong>不會</strong>收集裝置識別碼、位置、通訊錄，或任何並非由你直接輸入/點按的其他資訊。',
    '私たちは、デバイス識別子、位置情報、連絡先、その他あなたが直接入力・タップしていないものを<strong>収集しません</strong>。',
    '우리는 기기 식별자, 위치, 연락처, 그리고 당신이 직접 입력/탭하지 않은 그 어떤 것도 <strong>수집하지 않습니다</strong>.',
    'Wir erfassen <strong>KEINE</strong> Gerätekennungen, keinen Standort, keine Kontakte und nichts anderes, das nicht direkt von Ihnen eingegeben/angetippt wurde.',
    '<strong>NO</strong> recopilamos identificadores del dispositivo, ubicación, contactos ni nada que no escribas o toques directamente.',
    'Nous ne collectons <strong>PAS</strong> d\'identifiants d\'appareil, de localisation, de contacts, ni quoi que ce soit que vous n\'avez pas directement saisi/touché.',
    '<strong>NON</strong> raccogliamo identificatori del dispositivo, posizione, contatti o qualsiasi altra cosa non digitata/toccata direttamente da te.',
    'Мы <strong>НЕ</strong> собираем идентификаторы устройства, геолокацию, контакты или что-либо ещё, что вы не вводили/нажимали напрямую.',
    'เรา<strong>ไม่</strong>เก็บตัวระบุอุปกรณ์ ตำแหน่ง รายชื่อผู้ติดต่อ หรือสิ่งอื่นใดที่คุณไม่ได้พิมพ์/แตะโดยตรง',
    'Chúng tôi <strong>KHÔNG</strong> thu thập mã định danh thiết bị, vị trí, danh bạ, hay bất cứ thứ gì khác không do bạn trực tiếp nhập/chạm.'
  ]);

  L('pv.lives.1', [
    '本地存储在你的设备上，位于 Apple 的 SwiftData 存储中。',
    '本地儲存在你的裝置上，位於 Apple 的 SwiftData 儲存中。',
    'あなたの端末内、Apple の SwiftData ストアにローカル保存されます。',
    '당신의 기기에, Apple의 SwiftData 저장소에 로컬로 보관됩니다.',
    'Lokal auf Ihrem Gerät, im SwiftData-Speicher von Apple.',
    'Localmente en tu dispositivo, en el almacén SwiftData de Apple.',
    'Localement sur votre appareil, dans le stockage SwiftData d\'Apple.',
    'Localmente sul tuo dispositivo, nell\'archivio SwiftData di Apple.',
    'Локально на вашем устройстве, в хранилище Apple SwiftData.',
    'จัดเก็บในเครื่องบนอุปกรณ์ของคุณ ในที่เก็บ SwiftData ของ Apple',
    'Cục bộ trên thiết bị của bạn, trong kho SwiftData của Apple.'
  ]);
  L('pv.lives.2', [
    '在启用 iCloud Drive 时，可选择通过你的私人 iCloud 账户同步（我们绝不会看到——由 Apple 直接在你的设备之间完成同步）。',
    '在啟用 iCloud Drive 時，可選擇透過你的私人 iCloud 帳戶同步（我們絕不會看到——由 Apple 直接在你的裝置之間完成同步）。',
    'iCloud Drive を有効にすると、あなたのプライベートな iCloud アカウントを通じて任意で同期されます（私たちはこれを見ることはなく、Apple があなたの端末間で直接同期します）。',
    'iCloud Drive를 켜면 당신의 비공개 iCloud 계정을 통해 선택적으로 동기화됩니다(우리는 이를 절대 보지 못하며, Apple이 당신의 기기 간에 직접 동기화합니다).',
    'Optional über Ihr privates iCloud-Konto synchronisiert, wenn iCloud Drive aktiviert ist (wir sehen das nie — Apple synchronisiert direkt zwischen Ihren Geräten).',
    'Opcionalmente sincronizado a través de tu cuenta privada de iCloud cuando iCloud Drive está activado (nunca lo vemos: Apple hace la sincronización directamente entre tus dispositivos).',
    'Synchronisé en option via votre compte iCloud privé quand iCloud Drive est activé (nous ne le voyons jamais — Apple synchronise directement entre vos appareils).',
    'Sincronizzato in via opzionale tramite il tuo account iCloud privato quando iCloud Drive è attivo (non lo vediamo mai — Apple esegue la sincronizzazione direttamente tra i tuoi dispositivi).',
    'По желанию синхронизируется через ваш личный аккаунт iCloud, если включён iCloud Drive (мы этого никогда не видим — Apple синхронизирует напрямую между вашими устройствами).',
    'ซิงค์ผ่านบัญชี iCloud ส่วนตัวของคุณได้ (ตัวเลือก) เมื่อเปิด iCloud Drive (เราไม่เคยเห็นข้อมูลนี้ — Apple ทำการซิงค์โดยตรงระหว่างอุปกรณ์ของคุณ)',
    'Tùy chọn đồng bộ qua tài khoản iCloud riêng của bạn khi bật iCloud Drive (chúng tôi không bao giờ thấy điều này — Apple đồng bộ trực tiếp giữa các thiết bị của bạn).'
  ]);
  L('pv.lives.3', [
    '照片使用附加到 SwiftData 记录的外部存储，以保持数据库体积小巧。',
    '照片使用附加到 SwiftData 記錄的外部儲存，以保持資料庫體積小巧。',
    '写真は SwiftData レコードに添付された外部ストレージを使用し、データベースを小さく保ちます。',
    '사진은 SwiftData 레코드에 연결된 외부 저장소를 사용해 데이터베이스를 작게 유지합니다.',
    'Fotos nutzen externen Speicher, der an den SwiftData-Datensatz angehängt ist, damit die Datenbank klein bleibt.',
    'Las fotos usan almacenamiento externo adjunto al registro de SwiftData para que la base de datos siga siendo pequeña.',
    'Les photos utilisent un stockage externe rattaché à l\'enregistrement SwiftData afin que la base de données reste légère.',
    'Le foto usano un archivio esterno collegato al record SwiftData così il database resta piccolo.',
    'Фотографии используют внешнее хранилище, привязанное к записи SwiftData, чтобы база данных оставалась небольшой.',
    'รูปภาพใช้ที่เก็บภายนอกที่แนบกับเรกคอร์ด SwiftData เพื่อให้ฐานข้อมูลมีขนาดเล็ก',
    'Ảnh dùng bộ nhớ ngoài gắn với bản ghi SwiftData để cơ sở dữ liệu luôn nhỏ gọn.'
  ]);
  L('pv.lives.note', [
    '我们不运行自己的服务器，也没有存放你记录的数据库。',
    '我們不營運自己的伺服器，也沒有存放你記錄的資料庫。',
    '私たちは自前のサーバーを運用しておらず、あなたの記録を保持するデータベースも持っていません。',
    '우리는 자체 서버를 운영하지 않으며, 당신의 기록이 담긴 데이터베이스도 없습니다.',
    'Wir betreiben keinen eigenen Server und haben keine Datenbank mit Ihren Datensätzen.',
    'No tenemos servidor propio ni una base de datos con tus registros.',
    'Nous n\'exploitons pas notre propre serveur et n\'avons pas de base de données contenant vos enregistrements.',
    'Non gestiamo un nostro server e non abbiamo un database con i tuoi dati.',
    'У нас нет собственного сервера и нет базы данных с вашими записями.',
    'เราไม่ได้ใช้งานเซิร์ฟเวอร์ของเราเอง และไม่มีฐานข้อมูลที่เก็บบันทึกของคุณ',
    'Chúng tôi không vận hành máy chủ riêng và không có cơ sở dữ liệu chứa bản ghi của bạn.'
  ]);

  L('pv.ai.intro', [
    '当你在 AI 助手中点按某个问题时，我们会向 Google（AI 提供方）发送：',
    '當你在 AI 助手中點按某個問題時，我們會向 Google（AI 提供方）傳送：',
    'AI アシスタントで質問をタップすると、私たちは Google（AI プロバイダー）に次を送信します：',
    'AI 어시스턴트에서 질문을 탭하면, 우리는 Google(AI 제공자)에 다음을 보냅니다:',
    'Wenn Sie im KI-Assistenten eine Frage antippen, senden wir an Google (den KI-Anbieter):',
    'Cuando tocas una pregunta en el Asistente de IA, enviamos a Google (el proveedor de IA):',
    'Quand vous touchez une question dans l\'assistant IA, nous envoyons à Google (le fournisseur d\'IA) :',
    'Quando tocchi una domanda nell\'Assistente IA, inviamo ad Google (il fornitore di IA):',
    'Когда вы нажимаете на вопрос в AI-ассистенте, мы отправляем в Google (поставщику ИИ):',
    'เมื่อคุณแตะคำถามในผู้ช่วย AI เราจะส่งไปยัง Google (ผู้ให้บริการ AI):',
    'Khi bạn chạm vào một câu hỏi trong Trợ lý AI, chúng tôi gửi đến Google (nhà cung cấp AI):'
  ]);
  L('pv.ai.1', ['你输入的问题。','你輸入的問題。','あなたが入力した質問。','당신이 입력한 질문.','Ihre eingegebene Frage.','Tu pregunta escrita.','Votre question saisie.','La tua domanda digitata.','Ваш набранный вопрос.','คำถามที่คุณพิมพ์','Câu hỏi bạn đã nhập.']);
  L('pv.ai.2', [
    '关于宝宝近期记录的简短数字摘要（例如"过去 7 天 8 次睡眠，共 56 小时，平均每次喂养 110 毫升"）。',
    '關於寶寶近期記錄的簡短數字摘要（例如「過去 7 天 8 次睡眠，共 56 小時，平均每次餵養 110 毫升」）。',
    '赤ちゃんの最近の記録の短い数値サマリー（例：「過去 7 日間で睡眠 8 回、合計 56 時間、平均授乳 110ml」）。',
    '아기의 최근 기록에 대한 짧은 수치 요약(예: "지난 7일간 수면 8회, 총 56시간, 평균 수유 110ml").',
    'Eine kurze numerische Zusammenfassung der jüngsten Logs Ihres Babys (z. B. „8 Schlafphasen in den letzten 7 Tagen mit insgesamt 56 Stunden, durchschnittliche Mahlzeit 110 ml").',
    'Un breve resumen numérico de los registros recientes de tu bebé (p. ej., "8 sesiones de sueño en los últimos 7 días que suman 56 horas, toma media de 110 ml").',
    'Un bref résumé chiffré des journaux récents de votre bébé (p. ex. « 8 sessions de sommeil sur les 7 derniers jours totalisant 56 heures, repas moyen 110 ml »).',
    'Un breve riepilogo numerico dei registri recenti del tuo bambino (es. "8 sessioni di sonno negli ultimi 7 giorni per un totale di 56 ore, poppata media 110 ml").',
    'Краткую числовую сводку недавних записей малыша (например, «8 периодов сна за 7 дней суммарно 56 часов, среднее кормление 110 мл»).',
    'สรุปตัวเลขสั้น ๆ ของบันทึกล่าสุดของลูก (เช่น "นอน 8 ครั้งใน 7 วันที่ผ่านมา รวม 56 ชั่วโมง ป้อนนมเฉลี่ย 110 มล.")',
    'Một bản tóm tắt số liệu ngắn về nhật ký gần đây của bé (ví dụ: "8 lần ngủ trong 7 ngày qua tổng cộng 56 giờ, cữ bú trung bình 110ml").'
  ]);
  L('pv.ai.3', [
    '宝宝以月计的年龄，以及（如已设置）性别。',
    '寶寶以月計的年齡，以及（如已設定）性別。',
    '赤ちゃんの月齢、設定されていれば性別。',
    '아기의 개월 수 나이, 설정되어 있다면 성별.',
    'Das Alter Ihres Babys in Monaten und das Geschlecht, falls angegeben.',
    'La edad de tu bebé en meses y el sexo, si está configurado.',
    'L\'âge de votre bébé en mois, et le sexe s\'il est renseigné.',
    'L\'età del tuo bambino in mesi e il sesso, se impostato.',
    'Возраст малыша в месяцах и пол, если указан.',
    'อายุของลูกเป็นเดือน และเพศ หากตั้งค่าไว้',
    'Tuổi của bé theo tháng, và giới tính nếu đã đặt.'
  ]);
  L('pv.ai.note', [
    '我们<strong>不会</strong>发送宝宝的姓名、照片、完整记录历史，或你写下的任何自由文本备注。助手内的"AI 上下文"面板会向你显示实际发出的确切数据，便于你自行核实。',
    '我們<strong>不會</strong>傳送寶寶的姓名、照片、完整記錄歷史，或你寫下的任何自由文字備註。助手內的「AI 內容」面板會向你顯示實際發出的確切資料，便於你自行核實。',
    '私たちは赤ちゃんの名前、写真、すべての記録履歴、あなたが書いた自由記述メモを<strong>送信しません</strong>。アシスタント内の「AI コンテキスト」シートに、実際に送信される正確なデータが表示され、自分で確認できます。',
    '우리는 아기의 이름, 사진, 전체 기록 이력, 당신이 작성한 자유 텍스트 메모를 <strong>보내지 않습니다</strong>. 어시스턴트 내의 "AI 컨텍스트" 시트에서 실제로 나가는 정확한 데이터를 직접 확인할 수 있습니다.',
    'Wir senden <strong>NICHT</strong> den Namen, das Foto, den vollständigen Verlauf oder freie Textnotizen Ihres Babys. Das Blatt „KI-Kontext" im Assistenten zeigt Ihnen die genauen ausgehenden Daten, sodass Sie es selbst überprüfen können.',
    '<strong>NO</strong> enviamos el nombre, la foto, el historial completo de registros ni ninguna nota de texto libre que hayas escrito sobre tu bebé. La hoja "Contexto de IA" dentro del asistente te muestra los datos exactos que salen, para que lo verifiques tú mismo.',
    'Nous n\'envoyons <strong>PAS</strong> le nom, la photo, l\'historique complet ni les notes en texte libre de votre bébé. La fiche « Contexte IA » dans l\'assistant vous montre les données exactes qui sortent, pour que vous puissiez le vérifier vous-même.',
    '<strong>NON</strong> inviamo il nome, la foto, l\'intera cronologia o eventuali note in testo libero sul tuo bambino. Il foglio "Contesto IA" nell\'assistente ti mostra i dati esatti in uscita, così puoi verificarlo tu stesso.',
    'Мы <strong>НЕ</strong> отправляем имя малыша, фото, всю историю записей или любые свободные текстовые заметки. Панель «Контекст ИИ» в ассистенте показывает точные исходящие данные, чтобы вы могли проверить сами.',
    'เรา<strong>ไม่</strong>ส่งชื่อลูก รูปภาพ ประวัติบันทึกทั้งหมด หรือโน้ตข้อความอิสระที่คุณเขียน แผง "บริบท AI" ในผู้ช่วยจะแสดงข้อมูลที่ส่งออกจริงให้คุณตรวจสอบเองได้',
    'Chúng tôi <strong>KHÔNG</strong> gửi tên bé, ảnh, toàn bộ lịch sử nhật ký, hay bất kỳ ghi chú văn bản tự do nào bạn viết. Bảng "Ngữ cảnh AI" trong trợ lý cho bạn thấy chính xác dữ liệu gửi đi để bạn tự kiểm chứng.'
  ]);

  L('pv.dont.1', ['绝不投放广告。','絕不投放廣告。','広告は一切ありません。','광고는 절대 없습니다.','Niemals Werbung.','Nunca publicidad.','Jamais de publicité.','Nessuna pubblicità, mai.','Никакой рекламы, никогда.','ไม่มีโฆษณาเด็ดขาด','Không bao giờ có quảng cáo.']);
  L('pv.dont.2', [
    '没有分析 SDK，没有追踪像素，没有行为画像。',
    '沒有分析 SDK，沒有追蹤像素，沒有行為剖析。',
    '分析 SDK も、トラッキングピクセルも、行動プロファイリングもありません。',
    '분석 SDK도, 추적 픽셀도, 행동 프로파일링도 없습니다.',
    'Keine Analyse-SDKs, keine Tracking-Pixel, kein Verhaltens-Profiling.',
    'Sin SDK de analítica, sin píxeles de rastreo, sin perfilado de comportamiento.',
    'Aucun SDK d\'analyse, aucun pixel de suivi, aucun profilage comportemental.',
    'Nessun SDK di analisi, nessun pixel di tracciamento, nessuna profilazione comportamentale.',
    'Никаких аналитических SDK, пикселей отслеживания и поведенческого профилирования.',
    'ไม่มี SDK วิเคราะห์ ไม่มีพิกเซลติดตาม ไม่มีการทำโปรไฟล์พฤติกรรม',
    'Không SDK phân tích, không pixel theo dõi, không lập hồ sơ hành vi.'
  ]);
  L('pv.dont.3', [
    '绝不向任何人出售、共享或授权你的数据。',
    '絕不向任何人出售、分享或授權你的資料。',
    'あなたのデータを誰かに販売・共有・ライセンス供与することはありません。',
    '당신의 데이터를 누구에게도 판매·공유·라이선스하지 않습니다.',
    'Kein Verkauf, keine Weitergabe und keine Lizenzierung Ihrer Daten an irgendwen.',
    'Sin venta, intercambio ni licencia de tus datos a nadie.',
    'Aucune vente, aucun partage, aucune licence de vos données à qui que ce soit.',
    'Nessuna vendita, condivisione o concessione in licenza dei tuoi dati a chiunque.',
    'Никакой продажи, передачи или лицензирования ваших данных кому-либо.',
    'ไม่ขาย ไม่แชร์ หรือให้สิทธิ์ข้อมูลของคุณแก่ใครทั้งสิ้น',
    'Không bán, chia sẻ hay cấp phép dữ liệu của bạn cho bất kỳ ai.'
  ]);
  L('pv.dont.4', [
    '没有第三方登录，没有社交账号登录，不收集电子邮箱。',
    '沒有第三方登入，沒有社交帳號登入，不收集電子郵件。',
    'サードパーティログインも、ソーシャルログインも、メール収集もありません。',
    '제3자 로그인도, 소셜 로그인도, 이메일 수집도 없습니다.',
    'Kein Drittanbieter-Login, kein Social-Login, keine E-Mail-Erfassung.',
    'Sin inicio de sesión de terceros, sin acceso con redes sociales, sin recogida de correo.',
    'Aucune connexion tierce, aucune connexion sociale, aucune collecte d\'e-mail.',
    'Nessun login di terze parti, nessun accesso social, nessuna raccolta di e-mail.',
    'Никакого стороннего входа, входа через соцсети и сбора email.',
    'ไม่มีการล็อกอินผ่านบุคคลที่สาม ไม่มีการล็อกอินผ่านโซเชียล ไม่เก็บอีเมล',
    'Không đăng nhập bên thứ ba, không đăng nhập mạng xã hội, không thu thập email.'
  ]);

  L('pv.rights.intro', [
    '因为数据存放在你的设备上，你可以直接掌控它：',
    '因為資料存放在你的裝置上，你可以直接掌控它：',
    'データはあなたの端末にあるため、あなたが直接コントロールできます：',
    '데이터가 당신의 기기에 있으므로, 당신이 직접 제어합니다:',
    'Da die Daten auf Ihrem Gerät liegen, kontrollieren Sie sie direkt:',
    'Como los datos viven en tu dispositivo, los controlas directamente:',
    'Comme les données vivent sur votre appareil, vous les contrôlez directement :',
    'Poiché i dati risiedono sul tuo dispositivo, li controlli direttamente:',
    'Поскольку данные хранятся на вашем устройстве, вы управляете ими напрямую:',
    'เนื่องจากข้อมูลอยู่บนอุปกรณ์ของคุณ คุณจึงควบคุมมันได้โดยตรง:',
    'Vì dữ liệu nằm trên thiết bị của bạn, bạn kiểm soát nó trực tiếp:'
  ]);
  L('pv.rights.1', [
    '<strong>导出</strong> — 个人资料 → 数据 → 导出为 CSV / PDF。',
    '<strong>匯出</strong> — 個人資料 → 資料 → 匯出為 CSV / PDF。',
    '<strong>エクスポート</strong> — プロフィール → データ → CSV / PDF でエクスポート。',
    '<strong>내보내기</strong> — 프로필 → 데이터 → CSV / PDF로 내보내기.',
    '<strong>Export</strong> — Profil → Daten → Als CSV / PDF exportieren.',
    '<strong>Exportar</strong> — Perfil → Datos → Exportar como CSV / PDF.',
    '<strong>Exporter</strong> — Profil → Données → Exporter en CSV / PDF.',
    '<strong>Esporta</strong> — Profilo → Dati → Esporta come CSV / PDF.',
    '<strong>Экспорт</strong> — Профиль → Данные → Экспорт в CSV / PDF.',
    '<strong>ส่งออก</strong> — โปรไฟล์ → ข้อมูล → ส่งออกเป็น CSV / PDF',
    '<strong>Xuất</strong> — Hồ sơ → Dữ liệu → Xuất ra CSV / PDF.'
  ]);
  L('pv.rights.2', [
    '<strong>编辑</strong> — 每条记录都可以从时间线中编辑或删除。',
    '<strong>編輯</strong> — 每條記錄都可以從時間軸中編輯或刪除。',
    '<strong>編集</strong> — すべての記録はタイムラインから編集・削除できます。',
    '<strong>편집</strong> — 모든 기록은 타임라인에서 편집하거나 삭제할 수 있습니다.',
    '<strong>Bearbeiten</strong> — Jeder Eintrag kann in der Timeline bearbeitet oder gelöscht werden.',
    '<strong>Editar</strong> — cada registro puede editarse o eliminarse desde la línea de tiempo.',
    '<strong>Modifier</strong> — chaque enregistrement peut être modifié ou supprimé depuis la frise.',
    '<strong>Modifica</strong> — ogni voce può essere modificata o eliminata dalla cronologia.',
    '<strong>Редактирование</strong> — любую запись можно изменить или удалить из ленты.',
    '<strong>แก้ไข</strong> — ทุกบันทึกแก้ไขหรือลบได้จากไทม์ไลน์',
    '<strong>Chỉnh sửa</strong> — mọi bản ghi có thể chỉnh hoặc xóa từ dòng thời gian.'
  ]);
  L('pv.rights.3', [
    '<strong>清除</strong> — 个人资料 → 账户 → 删除账户，会不可逆地清除一切。',
    '<strong>清除</strong> — 個人資料 → 帳戶 → 刪除帳戶，會不可逆地清除一切。',
    '<strong>消去</strong> — プロフィール → アカウント → アカウント削除で、すべてが取り消し不能に消去されます。',
    '<strong>완전 삭제</strong> — 프로필 → 계정 → 계정 삭제 시 모든 것이 되돌릴 수 없이 지워집니다.',
    '<strong>Löschen</strong> — Profil → Konto → Konto löschen entfernt alles unwiderruflich.',
    '<strong>Borrar</strong> — Perfil → Cuenta → Eliminar cuenta borra todo de forma irreversible.',
    '<strong>Effacer</strong> — Profil → Compte → Supprimer le compte efface tout de façon irréversible.',
    '<strong>Cancella</strong> — Profilo → Account → Elimina account cancella tutto in modo irreversibile.',
    '<strong>Удаление</strong> — Профиль → Аккаунт → Удалить аккаунт безвозвратно стирает всё.',
    '<strong>ล้างข้อมูล</strong> — โปรไฟล์ → บัญชี → ลบบัญชี จะลบทุกอย่างอย่างถาวร',
    '<strong>Xóa sạch</strong> — Hồ sơ → Tài khoản → Xóa tài khoản sẽ xóa mọi thứ không thể khôi phục.'
  ]);
  L('pv.rights.4', [
    '<strong>照片</strong> — 尿布照片和头像可以在记录的编辑界面中移除。',
    '<strong>照片</strong> — 尿布照片和頭像可以在記錄的編輯介面中移除。',
    '<strong>写真</strong> — おむつの写真やアバターは、記録の編集画面から削除できます。',
    '<strong>사진</strong> — 기저귀 사진과 아바타는 기록 편집 화면에서 제거할 수 있습니다.',
    '<strong>Fotos</strong> — Windelfotos und Avatare können im Bearbeitungsbildschirm des Eintrags entfernt werden.',
    '<strong>Fotos</strong> — las fotos de pañal y los avatares pueden quitarse desde la pantalla de edición del registro.',
    '<strong>Photos</strong> — les photos de couche et les avatars peuvent être retirés depuis l\'écran d\'édition de l\'enregistrement.',
    '<strong>Foto</strong> — le foto del pannolino e gli avatar possono essere rimossi dalla schermata di modifica della voce.',
    '<strong>Фото</strong> — фото подгузников и аватары можно удалить на экране редактирования записи.',
    '<strong>รูปภาพ</strong> — รูปผ้าอ้อมและรูปโปรไฟล์ลบได้จากหน้าจอแก้ไขของบันทึก',
    '<strong>Ảnh</strong> — ảnh tã và ảnh đại diện có thể xóa khỏi màn hình chỉnh sửa bản ghi.'
  ]);

  L('pv.children.body', [
    'MamaBee 是供成年父母用来记录自己婴儿的工具。婴儿不是应用的用户。父母才是其账户的数据主体。',
    'MamaBee 是供成年父母用來記錄自己嬰兒的工具。嬰兒不是應用的使用者。父母才是其帳戶的資料主體。',
    'MamaBee は、成人の親が自分の乳児を記録するためのツールです。赤ちゃんはアプリの利用者ではありません。親がそのアカウントのデータ主体です。',
    'MamaBee는 성인 부모가 자신의 영아를 기록하기 위한 도구입니다. 아기는 앱의 사용자가 아닙니다. 부모가 해당 계정의 정보주체입니다.',
    'MamaBee ist ein Werkzeug, das erwachsene Eltern nutzen, um ihr eigenes Baby zu tracken. Babys sind keine Nutzer der App. Eltern sind die betroffenen Personen ihres Kontos.',
    'MamaBee es una herramienta que usan padres adultos para registrar a su propio bebé. Los bebés no son usuarios de la app. Los padres son los titulares de los datos de su cuenta.',
    'MamaBee est un outil utilisé par des parents adultes pour suivre leur propre nourrisson. Les bébés ne sont pas des utilisateurs de l\'app. Les parents sont les personnes concernées par les données de leur compte.',
    'MamaBee è uno strumento usato da genitori adulti per monitorare il proprio neonato. I bambini non sono utenti dell\'app. I genitori sono gli interessati dei dati del proprio account.',
    'MamaBee — это инструмент, которым взрослые родители отслеживают своего младенца. Малыши не являются пользователями приложения. Субъектами данных аккаунта являются родители.',
    'MamaBee เป็นเครื่องมือที่พ่อแม่ผู้ใหญ่ใช้บันทึกข้อมูลทารกของตน ทารกไม่ใช่ผู้ใช้แอป พ่อแม่คือเจ้าของข้อมูลของบัญชี',
    'MamaBee là công cụ để cha mẹ trưởng thành theo dõi chính con mình. Em bé không phải người dùng của ứng dụng. Cha mẹ là chủ thể dữ liệu của tài khoản.'
  ]);

  L('pv.contact.body', [
    '对隐私有疑问或顾虑？请发送电子邮件至 <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>，我们会在几天内回复。本政策的更新会在此处以新的"最后更新"日期标示。',
    '對隱私有疑問或顧慮？請發送電子郵件至 <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>，我們會在幾天內回覆。本政策的更新會在此處以新的「最後更新」日期標示。',
    'プライバシーに関するご質問やご懸念は <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> までメールしてください。数日以内に返信します。本ポリシーの更新は、新しい「最終更新」日とともにここに示します。',
    '개인정보에 대한 질문이나 우려가 있으신가요? <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> 로 이메일을 보내시면 며칠 내에 답변드립니다. 이 방침의 업데이트는 새 "최종 업데이트" 날짜와 함께 여기에 표시됩니다.',
    'Fragen oder Bedenken zum Datenschutz? Schreiben Sie an <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>, wir antworten innerhalb weniger Tage. Aktualisierungen dieser Richtlinie werden hier mit einem neuen „Zuletzt aktualisiert"-Datum hervorgehoben.',
    '¿Dudas o inquietudes sobre privacidad? Escribe a <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> y responderemos en unos días. Las actualizaciones de esta política se destacarán aquí con una nueva fecha de "Última actualización".',
    'Des questions ou des préoccupations sur la confidentialité ? Écrivez à <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> et nous répondrons sous quelques jours. Les mises à jour de cette politique seront signalées ici avec une nouvelle date de « Dernière mise à jour ».',
    'Domande o dubbi sulla privacy? Scrivi a <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> e risponderemo entro pochi giorni. Gli aggiornamenti di questa informativa saranno evidenziati qui con una nuova data di "Ultimo aggiornamento".',
    'Вопросы или сомнения по поводу конфиденциальности? Напишите на <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>, и мы ответим в течение нескольких дней. Обновления этой политики будут отмечены здесь новой датой «Последнее обновление».',
    'มีคำถามหรือข้อกังวลเรื่องความเป็นส่วนตัว? อีเมลถึง <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> แล้วเราจะตอบกลับภายในไม่กี่วัน การอัปเดตนโยบายนี้จะถูกเน้นไว้ที่นี่พร้อมวันที่ "อัปเดตล่าสุด" ใหม่',
    'Có câu hỏi hoặc lo ngại về quyền riêng tư? Gửi email đến <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> và chúng tôi sẽ phản hồi trong vài ngày. Các cập nhật của chính sách này sẽ được nêu rõ tại đây kèm ngày "Cập nhật lần cuối" mới.'
  ]);

  L('pv.perm.why', [
    '<strong>我们为何询问</strong> — MamaBee 只请求使某项功能正常工作所需的最少权限。下面每项权限都是选择性加入的——拒绝它只会停用该功能，应用的其余部分照常运作。',
    '<strong>我們為何詢問</strong> — MamaBee 只請求使某項功能正常運作所需的最少權限。下面每項權限都是選擇性加入的——拒絕它只會停用該功能，應用的其餘部分照常運作。',
    '<strong>許可をお願いする理由</strong> — MamaBee は、機能を動かすために必要な最小限の権限のみを求めます。以下の各権限はオプトイン式で、拒否してもその機能が無効になるだけで、アプリの他の部分は動き続けます。',
    '<strong>요청하는 이유</strong> — MamaBee는 기능을 작동시키는 데 필요한 최소한의 권한만 요청합니다. 아래 각 권한은 선택 사항이며, 거부하면 해당 기능만 비활성화되고 앱의 나머지는 계속 작동합니다.',
    '<strong>Warum wir fragen</strong> — MamaBee fragt nur die Mindestberechtigungen ab, die nötig sind, damit eine Funktion arbeitet. Jede Berechtigung unten ist Opt-in — verweigern Sie sie, wird nur die Funktion deaktiviert, der Rest der App läuft weiter.',
    '<strong>Por qué lo pedimos</strong> — MamaBee pide los permisos mínimos necesarios para que una función funcione. Cada permiso de abajo es opcional: denegarlo solo desactiva esa función, el resto de la app sigue funcionando.',
    '<strong>Pourquoi nous demandons</strong> — MamaBee ne demande que les autorisations minimales nécessaires au fonctionnement d\'une fonctionnalité. Chaque autorisation ci-dessous est facultative — la refuser désactive seulement la fonctionnalité, le reste de l\'app continue de marcher.',
    '<strong>Perché lo chiediamo</strong> — MamaBee chiede solo le autorizzazioni minime necessarie a far funzionare una funzione. Ogni autorizzazione qui sotto è opt-in: negarla disattiva solo quella funzione, il resto dell\'app continua a funzionare.',
    '<strong>Почему мы спрашиваем</strong> — MamaBee запрашивает лишь минимум разрешений, нужных для работы функции. Каждое разрешение ниже включается по желанию — отказ просто отключит функцию, остальное приложение продолжит работать.',
    '<strong>เหตุผลที่เราขอ</strong> — MamaBee ขอสิทธิ์ขั้นต่ำที่จำเป็นต่อการทำงานของฟีเจอร์เท่านั้น ทุกสิทธิ์ด้านล่างเป็นแบบสมัครใจ — การปฏิเสธจะปิดเฉพาะฟีเจอร์นั้น ส่วนที่เหลือของแอปยังทำงานต่อไป',
    '<strong>Vì sao chúng tôi hỏi</strong> — MamaBee chỉ xin các quyền tối thiểu cần thiết để một tính năng hoạt động. Mỗi quyền dưới đây là tùy chọn — từ chối chỉ tắt tính năng đó, phần còn lại của ứng dụng vẫn chạy.'
  ]);

  L('pv.perm.lbl.why', ['为什么','為什麼','理由','이유','Warum','Por qué','Pourquoi','Perché','Зачем','ทำไม','Vì sao']);
  L('pv.perm.lbl.denied', ['若拒绝','若拒絕','拒否した場合','거부하면','Bei Verweigerung','Si se deniega','Si refusé','Se negato','Если отказать','หากปฏิเสธ','Nếu từ chối']);
  L('pv.perm.lbl.change', ['在哪里更改','在哪裡更改','変更場所','변경 위치','Wo ändern','Dónde cambiar','Où modifier','Dove cambiare','Где изменить','เปลี่ยนได้ที่','Đổi ở đâu']);

  L('pv.perm.photo.t', ['照片图库','照片圖庫','フォトライブラリ','사진 보관함','Fotomediathek','Fototeca','Photothèque','Libreria foto','Медиатека','คลังรูปภาพ','Thư viện ảnh']);
  L('pv.perm.photo.why', [
    '在个人资料中选择宝宝的头像、在辅食日志中附加食物照片，以及在尿布记录中附加便便照片，方便你在一天中监测颜色与质地。',
    '在個人資料中選擇寶寶的頭像、在副食品日誌中附加食物照片，以及在尿布記錄中附加便便照片，方便你在一天中監測顏色與質地。',
    'プロフィールで赤ちゃんのアバターを選ぶ、離乳食ジャーナルに食事の写真を添付する、おむつログにうんちの写真を添付して一日の色や状態を確認する、ために使います。',
    '프로필에서 아기 아바타 선택, 이유식 일지에 음식 사진 첨부, 기저귀 기록에 변 사진을 첨부해 하루 동안 색과 상태를 살피는 데 사용합니다.',
    'Zum Auswählen des Baby-Avatars im Profil, zum Anhängen von Essensfotos im Beikost-Tagebuch und zum Anhängen von Stuhlfotos im Windel-Log, damit Sie Farbe und Konsistenz über den Tag beobachten können.',
    'Para elegir el avatar del bebé en el perfil, adjuntar fotos de comida en el diario de sólidos y adjuntar fotos de caca en el registro de pañales para que puedas vigilar color y consistencia durante el día.',
    'Pour choisir l\'avatar du bébé dans le profil, joindre des photos de repas dans le journal des solides et joindre des photos de selles dans le journal des couches afin de suivre couleur et consistance au fil de la journée.',
    'Per scegliere l\'avatar del bambino nel profilo, allegare foto del cibo nel diario degli svezzamenti e allegare foto della cacca nel registro pannolini così da monitorare colore e consistenza durante la giornata.',
    'Чтобы выбрать аватар малыша в профиле, прикреплять фото еды в журнале прикорма и фото стула в журнале подгузников, чтобы вы могли отслеживать цвет и консистенцию в течение дня.',
    'เพื่อเลือกรูปโปรไฟล์ของลูกในโปรไฟล์ แนบรูปอาหารในสมุดบันทึกอาหารแข็ง และแนบรูปอุจจาระในบันทึกผ้าอ้อม เพื่อให้คุณติดตามสีและลักษณะตลอดวัน',
    'Để chọn ảnh đại diện của bé trong Hồ sơ, đính ảnh thức ăn trong nhật ký ăn dặm, và đính ảnh phân trong nhật ký tã để bạn theo dõi màu và độ đặc trong ngày.'
  ]);
  L('pv.perm.photo.denied', [
    '你仍然可以记录一切——只是没有照片。',
    '你仍然可以記錄一切——只是沒有照片。',
    'すべて記録できます——写真がないだけです。',
    '여전히 모든 것을 기록할 수 있습니다 — 사진만 없을 뿐입니다.',
    'Sie können trotzdem alles erfassen — nur ohne Fotos.',
    'Aún puedes registrar todo, solo que sin fotos.',
    'Vous pouvez toujours tout enregistrer — simplement sans photos.',
    'Puoi comunque registrare tutto — solo senza foto.',
    'Вы по-прежнему можете записывать всё — просто без фото.',
    'คุณยังบันทึกทุกอย่างได้ — แค่ไม่มีรูปภาพ',
    'Bạn vẫn ghi được mọi thứ — chỉ là không có ảnh.'
  ]);

  L('pv.perm.cam.t', ['相机','相機','カメラ','카메라','Kamera','Cámara','Appareil photo','Fotocamera','Камера','กล้อง','Máy ảnh']);
  L('pv.perm.cam.why', [
    '在添加便便或辅食条目时当场拍照，而不是从图库中选取。',
    '在新增便便或副食品條目時當場拍照，而不是從圖庫中選取。',
    'うんちや離乳食の記録を追加するとき、ギャラリーから選ぶ代わりにその場で撮影します。',
    '변이나 이유식 항목을 추가할 때 갤러리에서 고르는 대신 즉석에서 사진을 찍습니다.',
    'Um beim Hinzufügen eines Stuhl- oder Beikost-Eintrags direkt ein Foto zu machen, statt aus der Galerie zu wählen.',
    'Para tomar una foto en el momento al añadir una entrada de caca o comida sólida en vez de elegir de la galería.',
    'Pour prendre une photo sur le moment lors de l\'ajout d\'une entrée de selle ou d\'aliment solide, au lieu de choisir dans la galerie.',
    'Per scattare una foto sul momento quando aggiungi una voce di cacca o cibo solido invece di sceglierla dalla galleria.',
    'Чтобы сделать фото на месте при добавлении записи о стуле или прикорме вместо выбора из галереи.',
    'เพื่อถ่ายรูปทันทีเมื่อเพิ่มรายการอุจจาระหรืออาหารแข็ง แทนการเลือกจากแกลเลอรี',
    'Để chụp ảnh ngay khi thêm mục phân hoặc thức ăn dặm thay vì chọn từ thư viện.'
  ]);
  L('pv.perm.cam.denied', [
    '照片附件会改用照片图库。',
    '照片附件會改用照片圖庫。',
    '写真の添付はフォトライブラリにフォールバックします。',
    '사진 첨부는 사진 보관함으로 대체됩니다.',
    'Foto-Anhänge greifen auf die Fotomediathek zurück.',
    'Los adjuntos de fotos recurren a la fototeca.',
    'Les pièces jointes photo se rabattent sur la photothèque.',
    'Gli allegati foto ripiegano sulla libreria foto.',
    'Прикрепление фото переключится на медиатеку.',
    'การแนบรูปจะกลับไปใช้คลังรูปภาพแทน',
    'Đính kèm ảnh sẽ chuyển sang dùng thư viện ảnh.'
  ]);

  L('pv.perm.notif.t', ['通知','通知','通知','알림','Mitteilungen','Notificaciones','Notifications','Notifiche','Уведомления','การแจ้งเตือน','Thông báo']);
  L('pv.perm.notif.why', [
    '按你所在国家/地区接种时间表提醒即将到来的疫苗接种，以及可选的睡眠教练提示。',
    '按你所在國家/地區接種時間表提醒即將到來的疫苗接種，以及可選的睡眠教練提示。',
    'お住まいの国のスケジュールに沿った今後の予防接種のリマインダーと、任意のスリープコーチの通知。',
    '거주 국가 일정에 따른 예정된 예방접종 알림과, 선택적인 수면 코치 알림.',
    'Erinnerungen an anstehende Impfungen nach dem Plan Ihres Landes und optionale Schlafcoach-Hinweise.',
    'Recordatorios de próximas vacunas según el calendario de tu país y avisos opcionales de coach de sueño.',
    'Des rappels pour les vaccinations à venir selon le calendrier de votre pays et des invites facultatives de coach de sommeil.',
    'Promemoria per le vaccinazioni imminenti secondo il calendario del tuo paese e suggerimenti facoltativi del coach del sonno.',
    'Напоминания о предстоящих прививках по графику вашей страны и необязательные подсказки сон-коуча.',
    'การเตือนการฉีดวัคซีนที่กำลังจะถึงตามตารางของประเทศคุณ และคำแนะนำโค้ชการนอน (ตัวเลือก)',
    'Nhắc nhở về các mũi tiêm sắp tới theo lịch của quốc gia bạn, và gợi ý huấn luyện giấc ngủ tùy chọn.'
  ]);
  L('pv.perm.notif.denied', [
    '所有时间表仍会显示在应用内——你只是不会收到提示振动。',
    '所有時間表仍會顯示在應用內——你只是不會收到提示震動。',
    'すべてのスケジュールはアプリ内に表示されます——通知が来ないだけです。',
    '모든 일정은 앱 안에 그대로 표시됩니다 — 알림만 받지 않을 뿐입니다.',
    'Alle Pläne erscheinen weiterhin in der App — Sie bekommen nur kein Signal.',
    'Todos los calendarios siguen apareciendo en la app: solo no recibirás un aviso.',
    'Tous les calendriers apparaissent toujours dans l\'app — vous ne recevez simplement pas d\'alerte.',
    'Tutti i calendari restano visibili nell\'app — semplicemente non riceverai un avviso.',
    'Все графики по-прежнему отображаются в приложении — просто не будет сигнала.',
    'ตารางทั้งหมดยังแสดงในแอป — เพียงแต่คุณจะไม่ได้รับการเตือน',
    'Mọi lịch vẫn hiển thị trong ứng dụng — bạn chỉ không nhận được nhắc.'
  ]);

  L('pv.perm.icloud.t', ['iCloud 云盘','iCloud 雲碟','iCloud Drive','iCloud Drive','iCloud Drive','iCloud Drive','iCloud Drive','iCloud Drive','iCloud Drive','iCloud Drive','iCloud Drive']);
  L('pv.perm.icloud.why', [
    '通过你的私人 iCloud 账户，在你的 iPhone、iPad 和 Mac 之间同步宝宝的记录。我们绝不会看到这些数据——由 Apple 处理同步。',
    '透過你的私人 iCloud 帳戶，在你的 iPhone、iPad 和 Mac 之間同步寶寶的記錄。我們絕不會看到這些資料——由 Apple 處理同步。',
    'あなたのプライベートな iCloud アカウントを通じて、iPhone・iPad・Mac の間で赤ちゃんの記録を同期します。私たちはこのデータを見ることはなく、Apple が同期を処理します。',
    '당신의 비공개 iCloud 계정을 통해 iPhone, iPad, Mac 간에 아기 기록을 동기화합니다. 우리는 이 데이터를 절대 보지 못하며, Apple이 동기화를 처리합니다.',
    'Synchronisiert die Logs Ihres Babys über Ihr privates iCloud-Konto zwischen iPhone, iPad und Mac. Wir sehen diese Daten nie — Apple übernimmt die Synchronisierung.',
    'Sincroniza los registros de tu bebé entre tu iPhone, iPad y Mac a través de tu cuenta privada de iCloud. Nunca vemos estos datos: Apple se encarga de la sincronización.',
    'Synchronise les journaux de votre bébé entre votre iPhone, iPad et Mac via votre compte iCloud privé. Nous ne voyons jamais ces données — Apple gère la synchronisation.',
    'Sincronizza i registri del tuo bambino tra iPhone, iPad e Mac tramite il tuo account iCloud privato. Non vediamo mai questi dati — la sincronizzazione la gestisce Apple.',
    'Синхронизирует записи малыша между вашими iPhone, iPad и Mac через ваш личный аккаунт iCloud. Мы никогда не видим эти данные — синхронизацией занимается Apple.',
    'ซิงค์บันทึกของลูกระหว่าง iPhone, iPad และ Mac ผ่านบัญชี iCloud ส่วนตัวของคุณ เราไม่เคยเห็นข้อมูลนี้ — Apple เป็นผู้จัดการการซิงค์',
    'Đồng bộ nhật ký của bé giữa iPhone, iPad và Mac qua tài khoản iCloud riêng của bạn. Chúng tôi không bao giờ thấy dữ liệu này — Apple xử lý việc đồng bộ.'
  ]);
  L('pv.perm.icloud.denied', [
    'MamaBee 将完全在本设备上运行。其他设备将看不到相同的记录。',
    'MamaBee 將完全在本裝置上運行。其他裝置將看不到相同的記錄。',
    'MamaBee はこの端末内だけで動作します。他の端末では同じ記録は見られません。',
    'MamaBee는 이 기기에서만 작동합니다. 다른 기기에서는 같은 기록을 볼 수 없습니다.',
    'MamaBee läuft vollständig auf diesem Gerät. Andere Geräte sehen nicht dieselben Logs.',
    'MamaBee funciona por completo en este dispositivo. Otros dispositivos no verán los mismos registros.',
    'MamaBee fonctionne entièrement sur cet appareil. Les autres appareils ne verront pas les mêmes journaux.',
    'MamaBee funziona interamente su questo dispositivo. Gli altri dispositivi non vedranno gli stessi registri.',
    'MamaBee работает целиком на этом устройстве. Другие устройства не увидят те же записи.',
    'MamaBee จะทำงานบนอุปกรณ์นี้ทั้งหมด อุปกรณ์อื่นจะไม่เห็นบันทึกเดียวกัน',
    'MamaBee chạy hoàn toàn trên thiết bị này. Các thiết bị khác sẽ không thấy cùng nhật ký.'
  ]);

  /* ====================================================
     TERMS
     ==================================================== */
  L('tm.crumb', [
    '<a href="index.html" style="color:inherit">主页</a> · 法律 · 条款',
    '<a href="index.html" style="color:inherit">首頁</a> · 法律 · 條款',
    '<a href="index.html" style="color:inherit">ホーム</a> · 法的事項 · 利用規約',
    '<a href="index.html" style="color:inherit">홈</a> · 법적 고지 · 약관',
    '<a href="index.html" style="color:inherit">Start</a> · Rechtliches · Bedingungen',
    '<a href="index.html" style="color:inherit">Inicio</a> · Legal · Términos',
    '<a href="index.html" style="color:inherit">Accueil</a> · Mentions légales · Conditions',
    '<a href="index.html" style="color:inherit">Home</a> · Note legali · Termini',
    '<a href="index.html" style="color:inherit">Главная</a> · Правовое · Условия',
    '<a href="index.html" style="color:inherit">หน้าแรก</a> · กฎหมาย · ข้อกำหนด',
    '<a href="index.html" style="color:inherit">Trang chủ</a> · Pháp lý · Điều khoản'
  ]);
  L('tm.title', ['服务条款','服務條款','利用規約','이용약관','Nutzungsbedingungen','Términos de servicio','Conditions de service','Termini di servizio','Условия использования','ข้อกำหนดการให้บริการ','Điều khoản dịch vụ']);
  L('tm.updated', ['最后更新：2026 年 6 月','最後更新：2026 年 6 月','最終更新：2026 年 6 月','최종 업데이트: 2026년 6월','Zuletzt aktualisiert: Juni 2026','Última actualización: junio de 2026','Dernière mise à jour : juin 2026','Ultimo aggiornamento: giugno 2026','Последнее обновление: июнь 2026','อัปเดตล่าสุด: มิถุนายน 2026','Cập nhật lần cuối: Tháng 6 năm 2026']);
  L('tm.toc.summary', ['通俗摘要','白話摘要','かんたんな概要','쉬운 요약','Zusammenfassung','Resumen sencillo','Résumé en clair','Riepilogo semplice','Кратко по-простому','สรุปแบบเข้าใจง่าย','Tóm tắt dễ hiểu']);
  L('tm.toc.whatis', ['它是什么——以及不是什么','它是什麼——以及不是什麼','これは何か——そして何でないか','무엇인가 — 그리고 무엇이 아닌가','Was es ist — und nicht ist','Qué es, y qué no','Ce que c\'est — et ce que ce n\'est pas','Cos\'è — e cosa non è','Что это — и что не это','มันคืออะไร — และไม่ใช่อะไร','Nó là gì — và không là gì']);

  L('tm.h.who', ['我们是谁','我們是誰','私たちについて','우리는 누구인가','Wer wir sind','Quiénes somos','Qui nous sommes','Chi siamo','Кто мы','เราคือใคร','Chúng tôi là ai']);
  L('tm.h.whocan', ['谁可以使用 MamaBee','誰可以使用 MamaBee','MamaBee を使えるのは誰か','누가 MamaBee를 사용할 수 있나','Wer MamaBee nutzen darf','Quién puede usar MamaBee','Qui peut utiliser MamaBee','Chi può usare MamaBee','Кто может пользоваться MamaBee','ใครใช้ MamaBee ได้','Ai có thể dùng MamaBee']);
  L('tm.h.data', ['你的数据，你的账户','你的資料，你的帳戶','あなたのデータ、あなたのアカウント','당신의 데이터, 당신의 계정','Ihre Daten, Ihr Konto','Tus datos, tu cuenta','Vos données, votre compte','I tuoi dati, il tuo account','Ваши данные, ваш аккаунт','ข้อมูลของคุณ บัญชีของคุณ','Dữ liệu của bạn, tài khoản của bạn']);
  L('tm.h.whatis', ['MamaBee 是什么——以及不是什么','MamaBee 是什麼——以及不是什麼','MamaBee は何か——そして何でないか','MamaBee는 무엇인가 — 그리고 무엇이 아닌가','Was MamaBee ist — und was nicht','Qué es MamaBee, y qué no','Ce que MamaBee est — et n\'est pas','Cos\'è MamaBee — e cosa non è','Что такое MamaBee — и чем оно не является','MamaBee คืออะไร — และไม่ใช่อะไร','MamaBee là gì — và không là gì']);
  L('tm.h.ai', ['MamaBee AI 助手','MamaBee AI 助手','MamaBee AI アシスタント','MamaBee AI 어시스턴트','MamaBee KI-Assistent','Asistente de IA de MamaBee','Assistant IA MamaBee','Assistente IA di MamaBee','AI-ассистент MamaBee','ผู้ช่วย AI ของ MamaBee','Trợ lý AI MamaBee']);
  L('tm.h.premium', ['Premium 订阅','Premium 訂閱','Premium サブスクリプション','Premium 구독','Premium-Abonnements','Suscripciones Premium','Abonnements Premium','Abbonamenti Premium','Подписки Premium','การสมัครสมาชิก Premium','Đăng ký Premium']);
  L('tm.h.accept', ['可接受的使用','可接受的使用','許容される利用','허용되는 사용','Zulässige Nutzung','Uso aceptable','Utilisation acceptable','Uso accettabile','Допустимое использование','การใช้งานที่ยอมรับได้','Sử dụng hợp lệ']);
  L('tm.h.avail', ['服务可用性','服務可用性','サービスの可用性','서비스 가용성','Verfügbarkeit des Dienstes','Disponibilidad del servicio','Disponibilité du service','Disponibilità del servizio','Доступность сервиса','ความพร้อมให้บริการ','Tính khả dụng của dịch vụ']);
  L('tm.h.ip', ['知识产权','智慧財產權','知的財産','지식재산권','Geistiges Eigentum','Propiedad intelectual','Propriété intellectuelle','Proprietà intellettuale','Интеллектуальная собственность','ทรัพย์สินทางปัญญา','Sở hữu trí tuệ']);
  L('tm.h.warr', ['免责声明','免責聲明','保証の否認','보증의 부인','Gewährleistungsausschluss','Renuncia de garantías','Exclusion de garanties','Esclusione di garanzie','Отказ от гарантий','การปฏิเสธการรับประกัน','Tuyên bố từ chối bảo đảm']);
  L('tm.h.liab', ['责任限制','責任限制','責任の制限','책임의 제한','Haftungsbeschränkung','Limitación de responsabilidad','Limitation de responsabilité','Limitazione di responsabilità','Ограничение ответственности','การจำกัดความรับผิด','Giới hạn trách nhiệm']);
  L('tm.h.changes', ['条款的变更','條款的變更','規約の変更','약관의 변경','Änderungen dieser Bedingungen','Cambios en estos términos','Modifications de ces conditions','Modifiche a questi termini','Изменения этих условий','การเปลี่ยนแปลงข้อกำหนด','Thay đổi các điều khoản']);
  L('tm.h.law', ['适用法律','適用法律','準拠法','준거법','Geltendes Recht','Ley aplicable','Droit applicable','Legge applicabile','Применимое право','กฎหมายที่ใช้บังคับ','Luật điều chỉnh']);
  L('tm.h.contact', ['联系我们','聯絡我們','お問い合わせ','문의','Kontakt','Contacto','Contact','Contatti','Контакты','ติดต่อ','Liên hệ']);

  L('tm.sum.tag', ['🍯 通俗摘要','🍯 白話摘要','🍯 かんたんな概要','🍯 쉬운 요약','🍯 Zusammenfassung','🍯 Resumen sencillo','🍯 Résumé en clair','🍯 Riepilogo semplice','🍯 Кратко по-простому','🍯 สรุปแบบเข้าใจง่าย','🍯 Tóm tắt dễ hiểu']);
  L('tm.sum.body', [
    'MamaBee 是一款个人育儿记录应用。你下载它，记录宝宝的点滴，数据保存在你的设备上。你拥有放进去的一切。我们会尽力让它好用，但无法保证应用完美无缺，也不能替代医疗建议。使用 MamaBee 即表示你同意负责任地使用，并且不滥用 AI 功能。',
    'MamaBee 是一款個人育兒記錄應用。你下載它，記錄寶寶的點滴，資料保存在你的裝置上。你擁有放進去的一切。我們會盡力讓它好用，但無法保證應用完美無缺，也不能替代醫療建議。使用 MamaBee 即表示你同意負責任地使用，並且不濫用 AI 功能。',
    'MamaBee は個人向けの育児記録アプリです。ダウンロードして赤ちゃんのことを記録すると、データは端末に残ります。入力したものはすべてあなたのものです。私たちはうまく動くよう最善を尽くしますが、アプリが完璧であることや医療アドバイスの代わりになることは保証できません。MamaBee を使うことで、責任を持って利用し、AI 機能を悪用しないことに同意したものとします。',
    'MamaBee는 개인용 육아 기록 앱입니다. 다운로드하여 아기의 일들을 기록하면 데이터는 당신의 기기에 남습니다. 입력한 모든 것은 당신의 것입니다. 우리는 잘 작동하도록 최선을 다하지만, 앱이 완벽하다거나 의학적 조언을 대체한다고 약속할 수는 없습니다. MamaBee를 사용함으로써 책임감 있게 사용하고 AI 기능을 오용하지 않는 데 동의하게 됩니다.',
    'MamaBee ist eine persönliche Baby-Tracking-App. Sie laden sie herunter, protokollieren die Dinge Ihres Babys, und es bleibt auf Ihrem Gerät. Alles, was Sie eingeben, gehört Ihnen. Wir geben unser Bestes, damit sie gut funktioniert, können aber nicht versprechen, dass die App perfekt oder ein Ersatz für medizinischen Rat ist. Mit der Nutzung von MamaBee erklären Sie sich bereit, sie verantwortungsvoll zu nutzen und die KI-Funktionen nicht zu missbrauchen.',
    'MamaBee es una app personal de seguimiento del bebé. La descargas, registras las cosas de tu bebé y se queda en tu dispositivo. Eres dueño de todo lo que pones. Hacemos lo posible para que funcione bien, pero no podemos prometer que la app sea perfecta ni un sustituto del consejo médico. Al usar MamaBee, aceptas usarla de forma responsable y no hacer mal uso de las funciones de IA.',
    'MamaBee est une app personnelle de suivi de bébé. Vous la téléchargez, vous notez les choses de votre bébé, et cela reste sur votre appareil. Vous possédez tout ce que vous y mettez. Nous faisons de notre mieux pour qu\'elle fonctionne bien, mais ne pouvons pas promettre que l\'app est parfaite ni un substitut à un avis médical. En utilisant MamaBee, vous acceptez de l\'utiliser de façon responsable et de ne pas détourner les fonctions d\'IA.',
    'MamaBee è un\'app personale per il monitoraggio del bambino. La scarichi, registri le cose del tuo bambino e restano sul tuo dispositivo. Possiedi tutto ciò che inserisci. Facciamo del nostro meglio perché funzioni bene, ma non possiamo promettere che l\'app sia perfetta né un sostituto del parere medico. Usando MamaBee, accetti di usarla responsabilmente e di non abusare delle funzioni di IA.',
    'MamaBee — это личное приложение для отслеживания малыша. Вы скачиваете его, ведёте записи о малыше, и они остаются на вашем устройстве. Всё, что вы вносите, принадлежит вам. Мы стараемся, чтобы оно работало хорошо, но не можем обещать, что приложение идеально или заменяет медицинскую консультацию. Используя MamaBee, вы соглашаетесь применять его ответственно и не злоупотреблять функциями ИИ.',
    'MamaBee เป็นแอปบันทึกลูกน้อยส่วนบุคคล คุณดาวน์โหลด บันทึกเรื่องของลูก แล้วข้อมูลจะอยู่บนอุปกรณ์ของคุณ คุณเป็นเจ้าของทุกอย่างที่ใส่เข้าไป เราพยายามอย่างเต็มที่ให้มันใช้งานได้ดี แต่ไม่อาจรับประกันว่าแอปจะสมบูรณ์แบบหรือใช้แทนคำแนะนำทางการแพทย์ได้ การใช้ MamaBee ถือว่าคุณยอมรับที่จะใช้อย่างมีความรับผิดชอบและไม่ใช้ฟีเจอร์ AI ในทางที่ผิด',
    'MamaBee là ứng dụng theo dõi em bé cá nhân. Bạn tải về, ghi lại mọi thứ của bé, và nó nằm trên thiết bị của bạn. Bạn sở hữu mọi thứ mình nhập vào. Chúng tôi cố gắng hết sức để nó hoạt động tốt, nhưng không thể hứa rằng ứng dụng hoàn hảo hay thay thế lời khuyên y tế. Khi dùng MamaBee, bạn đồng ý sử dụng có trách nhiệm và không lạm dụng các tính năng AI.'
  ]);

  L('tm.notLegal', [
    '<strong>非法律意见。</strong> 在对消费者合同有严格要求的司法管辖区（欧盟、加州等）发布前，请让律师审阅。',
    '<strong>非法律意見。</strong> 在對消費者合約有嚴格要求的司法管轄區（歐盟、加州等）發布前，請讓律師審閱。',
    '<strong>法的助言ではありません。</strong> 消費者契約に厳しい要件のある法域（EU、カリフォルニアなど）で公開する前に、弁護士に確認してもらってください。',
    '<strong>법률 자문이 아닙니다.</strong> 소비자 계약 요건이 엄격한 관할권(EU, 캘리포니아 등)에서 게시하기 전에 변호사의 검토를 받으세요.',
    '<strong>Keine Rechtsberatung.</strong> Lassen Sie es vor der Veröffentlichung in Rechtsräumen mit strengen Verbrauchervertragsanforderungen (EU, Kalifornien usw.) von einem Anwalt prüfen.',
    '<strong>No es asesoramiento legal.</strong> Haz que un abogado lo revise antes de publicar en jurisdicciones con requisitos estrictos de contratos de consumo (UE, California, etc.).',
    '<strong>Pas un avis juridique.</strong> Faites-le relire par un avocat avant publication dans les juridictions aux exigences strictes en matière de contrats de consommation (UE, Californie, etc.).',
    '<strong>Non è una consulenza legale.</strong> Fai revisionare da un avvocato prima di pubblicare in giurisdizioni con requisiti rigorosi sui contratti con i consumatori (UE, California, ecc.).',
    '<strong>Не является юридической консультацией.</strong> Перед публикацией в юрисдикциях со строгими требованиями к потребительским договорам (ЕС, Калифорния и т. д.) обратитесь к юристу.',
    '<strong>ไม่ใช่คำแนะนำทางกฎหมาย</strong> โปรดให้ทนายความตรวจสอบก่อนเผยแพร่ในเขตอำนาจที่มีข้อกำหนดสัญญาผู้บริโภคเข้มงวด (EU, แคลิฟอร์เนีย ฯลฯ)',
    '<strong>Không phải tư vấn pháp lý.</strong> Hãy nhờ luật sư xem xét trước khi công bố ở các khu vực pháp lý có yêu cầu hợp đồng tiêu dùng nghiêm ngặt (EU, California, v.v.).'
  ]);

  L('tm.who.body', [
    'MamaBee 由 <strong>Realm Labs Studio</strong>（"我们"）构建和运营。联系方式：<a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>。',
    'MamaBee 由 <strong>Realm Labs Studio</strong>（「我們」）構建和營運。聯絡方式：<a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>。',
    'MamaBee は <strong>Realm Labs Studio</strong>（「私たち」）が構築・運営しています。連絡先：<a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>。',
    'MamaBee는 <strong>Realm Labs Studio</strong>("우리")가 구축하고 운영합니다. 연락처: <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'MamaBee wird von <strong>Realm Labs Studio</strong> („wir", „uns") entwickelt und betrieben. Kontakt: <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'MamaBee es creado y operado por <strong>Realm Labs Studio</strong> ("nosotros"). Contacto: <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'MamaBee est créé et exploité par <strong>Realm Labs Studio</strong> (« nous »). Contact : <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'MamaBee è creato e gestito da <strong>Realm Labs Studio</strong> ("noi"). Contatto: <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'MamaBee создаётся и управляется <strong>Realm Labs Studio</strong> («мы»). Контакт: <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'MamaBee สร้างและดำเนินการโดย <strong>Realm Labs Studio</strong> ("เรา") ติดต่อ: <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>',
    'MamaBee được xây dựng và vận hành bởi <strong>Realm Labs Studio</strong> ("chúng tôi"). Liên hệ: <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.'
  ]);

  L('tm.whocan.body', [
    'MamaBee 面向希望记录其照护中婴儿的成年人（18 岁以上）。儿童不是 MamaBee 的用户——只有成年父母、监护人或照护者才是。如果你是代表他人的孩子使用本应用（例如作为保姆或祖父母），即表示你确认已获得其父母/监护人的许可。',
    'MamaBee 面向希望記錄其照護中嬰兒的成年人（18 歲以上）。兒童不是 MamaBee 的使用者——只有成年父母、監護人或照護者才是。如果你是代表他人的孩子使用本應用（例如作為保母或祖父母），即表示你確認已獲得其父母/監護人的許可。',
    'MamaBee は、世話をしている乳児を記録したい成人（18 歳以上）向けです。子どもは MamaBee の利用者ではなく、成人の親・保護者・養育者のみが利用者です。他人の子ども（例：ベビーシッターや祖父母として）を記録するために使う場合、その親／保護者の許可を得ていることを確認したものとします。',
    'MamaBee는 자신이 돌보는 영아를 기록하려는 성인(18세 이상)을 위한 것입니다. 아동은 MamaBee의 사용자가 아니며, 성인 부모·보호자·양육자만 사용자입니다. 다른 사람의 자녀를 대신해(예: 보모나 조부모로서) 앱을 사용하는 경우, 부모/보호자의 허락을 받았음을 확인하는 것입니다.',
    'MamaBee richtet sich an Erwachsene (18+), die einen Säugling in ihrer Obhut tracken möchten. Kinder sind keine Nutzer von MamaBee — nur erwachsene Eltern, Erziehungsberechtigte oder Betreuer. Wenn Sie die App für das Kind einer anderen Person nutzen (z. B. als Kindermädchen oder Großelternteil), bestätigen Sie, die Erlaubnis der Eltern/Erziehungsberechtigten zu haben.',
    'MamaBee está pensado para adultos (mayores de 18) que quieran registrar a un bebé a su cuidado. Los niños no son usuarios de MamaBee, solo los padres, tutores o cuidadores adultos. Si usas la app en nombre del hijo de otra persona (p. ej., como niñera o abuelo), confirmas que tienes permiso del padre/tutor.',
    'MamaBee s\'adresse aux adultes (18 ans et plus) qui veulent suivre un nourrisson dont ils ont la charge. Les enfants ne sont pas des utilisateurs de MamaBee — seuls les parents, tuteurs ou personnes en charge adultes le sont. Si vous utilisez l\'app pour l\'enfant d\'autrui (p. ex. en tant que nounou ou grand-parent), vous confirmez avoir la permission du parent/tuteur.',
    'MamaBee è destinato ad adulti (18+) che vogliono monitorare un neonato di cui si prendono cura. I bambini non sono utenti di MamaBee — solo genitori, tutori o caregiver adulti. Se usi l\'app per conto del figlio di un\'altra persona (es. come tata o nonno), confermi di avere il permesso del genitore/tutore.',
    'MamaBee предназначен для взрослых (18+), которые хотят отслеживать младенца на своём попечении. Дети не являются пользователями MamaBee — только взрослые родители, опекуны или попечители. Если вы используете приложение от имени чужого ребёнка (например, как няня или бабушка/дедушка), вы подтверждаете, что у вас есть разрешение родителя/опекуна.',
    'MamaBee มีไว้สำหรับผู้ใหญ่ (อายุ 18 ปีขึ้นไป) ที่ต้องการบันทึกข้อมูลทารกในความดูแล เด็กไม่ใช่ผู้ใช้ MamaBee — มีเพียงพ่อแม่ ผู้ปกครอง หรือผู้ดูแลที่เป็นผู้ใหญ่เท่านั้น หากคุณใช้แอปแทนบุตรของผู้อื่น (เช่น ในฐานะพี่เลี้ยงหรือปู่ย่าตายาย) แสดงว่าคุณยืนยันว่าได้รับอนุญาตจากพ่อแม่/ผู้ปกครองแล้ว',
    'MamaBee dành cho người trưởng thành (18+) muốn theo dõi một em bé mà họ chăm sóc. Trẻ em không phải người dùng MamaBee — chỉ cha mẹ, người giám hộ hoặc người chăm sóc trưởng thành. Nếu bạn dùng ứng dụng thay cho con của người khác (ví dụ với tư cách người trông trẻ hoặc ông bà), bạn xác nhận đã được cha mẹ/người giám hộ cho phép.'
  ]);

  L('tm.data.1', [
    '所有追踪数据存放在你的设备上（如已启用，也在你的私人 iCloud 中）。你拥有它。',
    '所有追蹤資料存放在你的裝置上（如已啟用，也在你的私人 iCloud 中）。你擁有它。',
    'すべての記録データはあなたの端末（有効ならあなたのプライベート iCloud にも）に保存されます。それはあなたのものです。',
    '모든 추적 데이터는 당신의 기기(활성화된 경우 당신의 비공개 iCloud)에 저장됩니다. 당신이 소유합니다.',
    'Alle Tracking-Daten liegen auf Ihrem Gerät (und in Ihrer privaten iCloud, falls aktiviert). Sie gehören Ihnen.',
    'Todos los datos de seguimiento viven en tu dispositivo (y en tu iCloud privado, si está activado). Son tuyos.',
    'Toutes les données de suivi vivent sur votre appareil (et dans votre iCloud privé, si activé). Elles vous appartiennent.',
    'Tutti i dati di tracciamento risiedono sul tuo dispositivo (e nel tuo iCloud privato, se abilitato). Sono tuoi.',
    'Все данные отслеживания хранятся на вашем устройстве (и в вашем личном iCloud, если включён). Они принадлежат вам.',
    'ข้อมูลการติดตามทั้งหมดอยู่บนอุปกรณ์ของคุณ (และใน iCloud ส่วนตัวของคุณ หากเปิดใช้งาน) คุณเป็นเจ้าของ',
    'Toàn bộ dữ liệu theo dõi nằm trên thiết bị của bạn (và iCloud riêng của bạn, nếu bật). Bạn sở hữu nó.'
  ]);
  L('tm.data.2', [
    '删除应用或点按 <strong>个人资料 → 账户 → 删除账户</strong>，会不可逆地清除一切。我们无法为你恢复。',
    '刪除應用或點按 <strong>個人資料 → 帳戶 → 刪除帳戶</strong>，會不可逆地清除一切。我們無法為你復原。',
    'アプリを削除するか <strong>プロフィール → アカウント → アカウント削除</strong> をタップすると、すべてが取り消し不能に消去されます。私たちが復元することはできません。',
    '앱을 삭제하거나 <strong>프로필 → 계정 → 계정 삭제</strong>를 탭하면 모든 것이 되돌릴 수 없이 지워집니다. 우리는 복구해 드릴 수 없습니다.',
    'Das Löschen der App oder das Antippen von <strong>Profil → Konto → Konto löschen</strong> entfernt alles unwiderruflich. Wir können es nicht für Sie wiederherstellen.',
    'Eliminar la app o tocar <strong>Perfil → Cuenta → Eliminar cuenta</strong> borra todo de forma irreversible. No podemos recuperarlo por ti.',
    'Supprimer l\'app ou toucher <strong>Profil → Compte → Supprimer le compte</strong> efface tout de façon irréversible. Nous ne pouvons pas le récupérer pour vous.',
    'Eliminare l\'app o toccare <strong>Profilo → Account → Elimina account</strong> cancella tutto in modo irreversibile. Non possiamo recuperarlo per te.',
    'Удаление приложения или нажатие <strong>Профиль → Аккаунт → Удалить аккаунт</strong> безвозвратно стирает всё. Мы не сможем восстановить это для вас.',
    'การลบแอปหรือแตะ <strong>โปรไฟล์ → บัญชี → ลบบัญชี</strong> จะลบทุกอย่างอย่างถาวร เราไม่สามารถกู้คืนให้คุณได้',
    'Xóa ứng dụng hoặc chạm <strong>Hồ sơ → Tài khoản → Xóa tài khoản</strong> sẽ xóa mọi thứ không thể khôi phục. Chúng tôi không thể khôi phục giúp bạn.'
  ]);
  L('tm.data.3', [
    '你有责任备份自己的数据（应用内的 <strong>导出</strong> 工具可随时为你提供 CSV / PDF）。',
    '你有責任備份自己的資料（應用內的 <strong>匯出</strong> 工具可隨時為你提供 CSV / PDF）。',
    '自分のデータのバックアップはあなたの責任です（アプリ内の <strong>エクスポート</strong> ツールでいつでも CSV / PDF を取得できます）。',
    '자신의 데이터 백업은 당신의 책임입니다(앱 내 <strong>내보내기</strong> 도구로 언제든 CSV / PDF를 받을 수 있습니다).',
    'Für die Sicherung Ihrer eigenen Daten sind Sie verantwortlich (das <strong>Export</strong>-Tool in der App gibt Ihnen jederzeit CSV / PDF).',
    'Eres responsable de hacer copia de tus propios datos (la herramienta <strong>Exportar</strong> de la app te da CSV / PDF cuando quieras).',
    'Vous êtes responsable de la sauvegarde de vos propres données (l\'outil <strong>Exporter</strong> de l\'app vous donne du CSV / PDF quand vous voulez).',
    'Sei responsabile del backup dei tuoi dati (lo strumento <strong>Esporta</strong> nell\'app ti dà CSV / PDF quando vuoi).',
    'Вы сами отвечаете за резервное копирование своих данных (инструмент <strong>Экспорт</strong> в приложении выдаёт CSV / PDF в любой момент).',
    'คุณมีหน้าที่สำรองข้อมูลของคุณเอง (เครื่องมือ <strong>ส่งออก</strong> ในแอปให้ไฟล์ CSV / PDF แก่คุณได้ทุกเมื่อ)',
    'Bạn chịu trách nhiệm sao lưu dữ liệu của mình (công cụ <strong>Xuất</strong> trong ứng dụng cho bạn CSV / PDF bất cứ lúc nào).'
  ]);

  L('tm.whatis.1', [
    '<strong>它是：</strong> 一个记录与提醒工具，帮你记住何时发生了什么。',
    '<strong>它是：</strong> 一個記錄與提醒工具，幫你記住何時發生了什麼。',
    '<strong>これは：</strong> いつ何が起きたかを覚えておくための記録・リマインダーツールです。',
    '<strong>이것은:</strong> 언제 무슨 일이 있었는지 기억하도록 돕는 기록·알림 도구입니다.',
    '<strong>Es ist:</strong> ein Protokoll- und Erinnerungswerkzeug, das Ihnen hilft, sich zu merken, was wann passiert ist.',
    '<strong>Es:</strong> una herramienta de registro y recordatorios que te ayuda a recordar qué pasó y cuándo.',
    '<strong>C\'est :</strong> un outil de journalisation et de rappel pour vous aider à vous souvenir de ce qui s\'est passé et quand.',
    '<strong>È:</strong> uno strumento di registrazione e promemoria che ti aiuta a ricordare cosa è successo e quando.',
    '<strong>Это:</strong> инструмент для записей и напоминаний, помогающий помнить, что и когда произошло.',
    '<strong>มันคือ:</strong> เครื่องมือบันทึกและเตือนความจำที่ช่วยให้คุณจำได้ว่าเกิดอะไรขึ้นเมื่อไร',
    '<strong>Nó là:</strong> công cụ ghi chép và nhắc nhở giúp bạn nhớ điều gì đã xảy ra và khi nào.'
  ]);
  L('tm.whatis.2', [
    '<strong>它不是：</strong> 医疗建议、诊断工具，或儿科医生的替代品。如果宝宝身体不适，请联系真正的医生。AI 洞察、睡眠预测、生长百分位和里程碑指引都仅供参考。',
    '<strong>它不是：</strong> 醫療建議、診斷工具，或兒科醫生的替代品。如果寶寶身體不適，請聯絡真正的醫生。AI 洞察、睡眠預測、生長百分位和里程碑指引都僅供參考。',
    '<strong>これは：</strong> 医療アドバイス、診断ツール、または小児科医の代わりではありません。赤ちゃんの具合が悪いときは、実際の医師に連絡してください。AI のインサイト、睡眠予測、成長パーセンタイル、マイルストーン案内はすべて情報提供のみを目的としています。',
    '<strong>이것이 아닙니다:</strong> 의학적 조언, 진단 도구, 또는 소아과 의사의 대체물이 아닙니다. 아기가 아프면 실제 의사에게 연락하세요. AI 인사이트, 수면 예측, 성장 백분위수, 이정표 안내는 모두 정보 제공용일 뿐입니다.',
    '<strong>Es ist NICHT:</strong> medizinischer Rat, ein Diagnosewerkzeug oder ein Ersatz für einen Kinderarzt. Wenn Ihr Baby krank ist, rufen Sie einen echten Arzt. KI-Einblicke, Schlafvorhersagen, Wachstumsperzentile und Meilenstein-Hinweise sind alle nur informativ.',
    '<strong>NO es:</strong> asesoramiento médico, una herramienta de diagnóstico ni un sustituto del pediatra. Si tu bebé está enfermo, llama a un médico de verdad. Las ideas de IA, las predicciones de sueño, los percentiles de crecimiento y la guía de hitos son solo informativos.',
    '<strong>Ce n\'est PAS :</strong> un avis médical, un outil de diagnostic ni un substitut au pédiatre. Si votre bébé est malade, appelez un vrai médecin. Les aperçus IA, les prédictions de sommeil, les percentiles de croissance et les conseils sur les jalons sont uniquement informatifs.',
    '<strong>NON è:</strong> consiglio medico, strumento diagnostico o sostituto del pediatra. Se il tuo bambino sta male, chiama un vero medico. Spunti IA, previsioni del sonno, percentili di crescita e guida ai traguardi sono solo informativi.',
    '<strong>Это НЕ:</strong> медицинская консультация, диагностический инструмент или замена педиатра. Если малыш заболел, обратитесь к настоящему врачу. ИИ-выводы, прогнозы сна, перцентили роста и подсказки по вехам — только для информации.',
    '<strong>มันไม่ใช่:</strong> คำแนะนำทางการแพทย์ เครื่องมือวินิจฉัย หรือสิ่งแทนกุมารแพทย์ หากลูกไม่สบาย โปรดติดต่อแพทย์จริง ข้อมูลเชิงลึกจาก AI การทำนายการนอน เปอร์เซ็นไทล์การเติบโต และคำแนะนำพัฒนาการ ล้วนเป็นเพียงข้อมูลประกอบเท่านั้น',
    '<strong>Nó KHÔNG phải:</strong> lời khuyên y tế, công cụ chẩn đoán, hay thay thế bác sĩ nhi. Nếu bé không khỏe, hãy gọi bác sĩ thật. Thông tin AI, dự đoán giấc ngủ, bách phân vị tăng trưởng và hướng dẫn cột mốc đều chỉ mang tính tham khảo.'
  ]);

  L('tm.ai.intro', [
    'AI 助手是一项便利功能，由第三方模型（Google 的 Gemini Flash）驱动。当你使用它时：',
    'AI 助手是一項便利功能，由第三方模型（Google 的 Gemini Flash）驅動。當你使用它時：',
    'AI アシスタントは、サードパーティのモデル（Google の Gemini Flash）を利用した便利機能です。利用するとき：',
    'AI 어시스턴트는 제3자 모델(Google의 Gemini Flash)로 구동되는 편의 기능입니다. 사용할 때:',
    'Der KI-Assistent ist eine Komfortfunktion, die von einem Drittanbieter-Modell (Googles Gemini Flash) betrieben wird. Wenn Sie ihn nutzen:',
    'El Asistente de IA es una función de conveniencia impulsada por un modelo de terceros (Gemini Flash de Google). Cuando lo usas:',
    'L\'assistant IA est une fonction de confort propulsée par un modèle tiers (Gemini Flash d\'Google). Quand vous l\'utilisez :',
    'L\'Assistente IA è una funzione di comodità basata su un modello di terze parti (Gemini Flash di Google). Quando lo usi:',
    'AI-ассистент — это вспомогательная функция на основе стороннего модуля (Gemini Flash от Google). Когда вы его используете:',
    'ผู้ช่วย AI เป็นฟีเจอร์อำนวยความสะดวกที่ขับเคลื่อนด้วยโมเดลของบุคคลที่สาม (Gemini Flash ของ Google) เมื่อคุณใช้งาน:',
    'Trợ lý AI là tính năng tiện ích vận hành bằng mô hình của bên thứ ba (Gemini Flash của Google). Khi bạn dùng nó:'
  ]);
  L('tm.ai.1', [
    '它可能出错。AI 会"幻觉"。请把它的回答当作起点，而非定论。',
    '它可能出錯。AI 會「幻覺」。請把它的回答當作起點，而非定論。',
    '間違うことがあります。AI は「幻覚」を起こします。回答は出発点として扱い、最終的な答えとしないでください。',
    '틀릴 수 있습니다. AI는 "환각"을 일으킵니다. 답변은 최종 결론이 아니라 출발점으로 여기세요.',
    'Er kann sich irren. KI halluziniert. Behandeln Sie seine Antworten als Ausgangspunkt, nicht als letztes Wort.',
    'Puede equivocarse. La IA alucina. Trata sus respuestas como un punto de partida, no como la última palabra.',
    'Il peut se tromper. L\'IA hallucine. Considérez ses réponses comme un point de départ, pas comme une vérité finale.',
    'Può sbagliare. L\'IA ha allucinazioni. Tratta le sue risposte come un punto di partenza, non come l\'ultima parola.',
    'Он может ошибаться. ИИ «галлюцинирует». Считайте его ответы отправной точкой, а не истиной в последней инстанции.',
    'มันอาจผิดได้ AI "หลอน" ได้ ให้ถือว่าคำตอบเป็นจุดเริ่มต้น ไม่ใช่คำตอบสุดท้าย',
    'Nó có thể sai. AI "ảo giác". Hãy coi câu trả lời là điểm khởi đầu, không phải lời cuối.'
  ]);
  L('tm.ai.2', [
    '我们只发送隐私政策中所述的数据（<a class="inline" href="privacy.html#ai">"MamaBee AI 助手"</a>）。绝不发送宝宝的姓名、照片或自由文本备注。',
    '我們只傳送隱私政策中所述的資料（<a class="inline" href="privacy.html#ai">「MamaBee AI 助手」</a>）。絕不傳送寶寶的姓名、照片或自由文字備註。',
    'プライバシーポリシーに記載のデータ（<a class="inline" href="privacy.html#ai">「MamaBee AI アシスタント」</a>）のみを送信します。赤ちゃんの名前、写真、自由記述メモは決して送りません。',
    '개인정보 처리방침에 설명된 데이터(<a class="inline" href="privacy.html#ai">"MamaBee AI 어시스턴트"</a>)만 보냅니다. 아기의 이름, 사진, 자유 텍스트 메모는 절대 보내지 않습니다.',
    'Wir senden nur die in der Datenschutzerklärung beschriebenen Daten (<a class="inline" href="privacy.html#ai">„MamaBee KI-Assistent"</a>). Niemals den Namen, das Foto oder freie Textnotizen Ihres Babys.',
    'Solo enviamos los datos descritos en la Política de privacidad (<a class="inline" href="privacy.html#ai">"Asistente de IA de MamaBee"</a>). Nunca el nombre, la foto ni las notas de texto libre de tu bebé.',
    'Nous n\'envoyons que les données décrites dans la Politique de confidentialité (<a class="inline" href="privacy.html#ai">« Assistant IA MamaBee »</a>). Jamais le nom, la photo ni les notes en texte libre de votre bébé.',
    'Inviamo solo i dati descritti nell\'Informativa sulla privacy (<a class="inline" href="privacy.html#ai">"Assistente IA di MamaBee"</a>). Mai il nome, la foto o le note in testo libero del tuo bambino.',
    'Мы отправляем только данные, описанные в Политике конфиденциальности (<a class="inline" href="privacy.html#ai">«AI-ассистент MamaBee»</a>). Никогда — имя, фото или свободные заметки малыша.',
    'เราส่งเฉพาะข้อมูลที่อธิบายไว้ในนโยบายความเป็นส่วนตัว (<a class="inline" href="privacy.html#ai">"ผู้ช่วย AI ของ MamaBee"</a>) ไม่เคยส่งชื่อ รูป หรือโน้ตข้อความอิสระของลูก',
    'Chúng tôi chỉ gửi dữ liệu được mô tả trong Chính sách quyền riêng tư (<a class="inline" href="privacy.html#ai">"Trợ lý AI MamaBee"</a>). Không bao giờ gửi tên, ảnh hay ghi chú văn bản tự do của bé.'
  ]);
  L('tm.ai.3', [
    '请勿用助手来获取医学诊断。它会拒绝，而如果它没拒绝，你也不应相信它。',
    '請勿用助手來獲取醫學診斷。它會拒絕，而如果它沒拒絕，你也不應相信它。',
    '医学的診断を得るためにアシスタントを使わないでください。拒否しますし、たとえ拒否しなくても信用すべきではありません。',
    '의학적 진단을 받기 위해 어시스턴트를 사용하지 마세요. 거부할 것이며, 거부하지 않더라도 믿어서는 안 됩니다.',
    'Nutzen Sie den Assistenten nicht für eine medizinische Diagnose. Er wird ablehnen, und falls nicht, sollten Sie ihm nicht vertrauen.',
    'No uses el asistente para obtener un diagnóstico médico. Se negará, y si no lo hace, no deberías confiar en él.',
    'N\'utilisez pas l\'assistant pour obtenir un diagnostic médical. Il refusera, et s\'il ne refuse pas, vous ne devriez pas lui faire confiance.',
    'Non usare l\'assistente per ottenere una diagnosi medica. Si rifiuterà, e se non lo fa, non dovresti fidarti.',
    'Не используйте ассистента для постановки медицинского диагноза. Он откажет, а если нет — не стоит ему доверять.',
    'อย่าใช้ผู้ช่วยเพื่อขอการวินิจฉัยทางการแพทย์ มันจะปฏิเสธ และหากมันไม่ปฏิเสธ คุณก็ไม่ควรเชื่อ',
    'Đừng dùng trợ lý để được chẩn đoán y tế. Nó sẽ từ chối, và nếu không từ chối thì bạn cũng không nên tin.'
  ]);

  L('tm.premium.1', [
    'MamaBee Premium 通过 Apple 的 App Store 以自动续期订阅的方式计费。',
    'MamaBee Premium 透過 Apple 的 App Store 以自動續訂的方式計費。',
    'MamaBee Premium は、Apple の App Store を通じて自動更新サブスクリプションとして課金されます。',
    'MamaBee Premium은 Apple App Store를 통해 자동 갱신 구독으로 청구됩니다.',
    'MamaBee Premium wird über Apples App Store als automatisch verlängerndes Abonnement abgerechnet.',
    'MamaBee Premium se cobra a través de la App Store de Apple como suscripción de renovación automática.',
    'MamaBee Premium est facturé via l\'App Store d\'Apple sous forme d\'abonnement à renouvellement automatique.',
    'MamaBee Premium viene fatturato tramite l\'App Store di Apple come abbonamento a rinnovo automatico.',
    'MamaBee Premium оплачивается через App Store от Apple как автопродлеваемая подписка.',
    'MamaBee Premium เรียกเก็บเงินผ่าน App Store ของ Apple แบบสมัครสมาชิกต่ออายุอัตโนมัติ',
    'MamaBee Premium được tính phí qua App Store của Apple dưới dạng đăng ký tự động gia hạn.'
  ]);
  L('tm.premium.2', [
    '定价、续期、免费试用和退款均受 Apple 条款约束。你可随时在 <strong>iOS 设置 → Apple ID → 订阅</strong> 中管理或取消。',
    '定價、續訂、免費試用和退款均受 Apple 條款約束。你可隨時在 <strong>iOS 設定 → Apple ID → 訂閱</strong> 中管理或取消。',
    '価格、更新、無料トライアル、返金は Apple の規約に従います。<strong>iOS 設定 → Apple ID → サブスクリプション</strong> でいつでも管理・解約できます。',
    '가격, 갱신, 무료 체험, 환불은 Apple 약관의 적용을 받습니다. <strong>iOS 설정 → Apple ID → 구독</strong>에서 언제든 관리하거나 취소할 수 있습니다.',
    'Preis, Verlängerung, kostenlose Testphasen und Rückerstattungen unterliegen den Bedingungen von Apple. Verwalten oder kündigen Sie jederzeit unter <strong>iOS-Einstellungen → Apple-ID → Abonnements</strong>.',
    'El precio, la renovación, las pruebas gratuitas y los reembolsos se rigen por los términos de Apple. Gestiona o cancela cuando quieras en <strong>Ajustes de iOS → Apple ID → Suscripciones</strong>.',
    'Le prix, le renouvellement, les essais gratuits et les remboursements sont régis par les conditions d\'Apple. Gérez ou résiliez à tout moment dans <strong>Réglages iOS → Identifiant Apple → Abonnements</strong>.',
    'Prezzo, rinnovo, prove gratuite e rimborsi sono regolati dai termini di Apple. Gestisci o annulla quando vuoi in <strong>Impostazioni iOS → ID Apple → Abbonamenti</strong>.',
    'Цена, продление, бесплатные пробные периоды и возвраты регулируются условиями Apple. Управляйте или отменяйте в любой момент в <strong>Настройки iOS → Apple ID → Подписки</strong>.',
    'ราคา การต่ออายุ การทดลองใช้ฟรี และการคืนเงิน เป็นไปตามข้อกำหนดของ Apple จัดการหรือยกเลิกได้ทุกเมื่อใน <strong>การตั้งค่า iOS → Apple ID → การสมัครสมาชิก</strong>',
    'Giá, gia hạn, dùng thử miễn phí và hoàn tiền tuân theo điều khoản của Apple. Quản lý hoặc hủy bất cứ lúc nào trong <strong>Cài đặt iOS → Apple ID → Đăng ký</strong>.'
  ]);
  L('tm.premium.3', [
    '如果你取消，已有的记录仍会保留；只有高级 AI 功能会关闭。',
    '如果你取消，已有的記錄仍會保留；只有進階 AI 功能會關閉。',
    '解約しても既存の記録は残ります。オフになるのはプレミアムの AI 機能だけです。',
    '취소해도 기존 기록은 그대로 남습니다. 프리미엄 AI 기능만 꺼집니다.',
    'Wenn Sie kündigen, bleiben Ihre vorhandenen Logs erhalten; nur die Premium-KI-Funktionen werden deaktiviert.',
    'Si cancelas, tus registros existentes se quedan; solo se desactivan las funciones de IA premium.',
    'Si vous résiliez, vos journaux existants restent ; seules les fonctions IA premium se désactivent.',
    'Se annulli, i tuoi registri esistenti restano; si disattivano solo le funzioni IA premium.',
    'Если вы отмените подписку, существующие записи сохранятся; отключатся только премиум-функции ИИ.',
    'หากคุณยกเลิก บันทึกที่มีอยู่ยังคงอยู่ มีเพียงฟีเจอร์ AI พรีเมียมที่จะปิด',
    'Nếu bạn hủy, nhật ký hiện có vẫn còn; chỉ các tính năng AI cao cấp tắt đi.'
  ]);
  L('tm.premium.4', [
    '我们可能为新订阅者更改定价或功能范围，但不会在当前计费周期内削减现有订阅者已付费享有的内容。',
    '我們可能為新訂閱者更改定價或功能範圍，但不會在當前計費週期內削減現有訂閱者已付費享有的內容。',
    '新規加入者向けに価格や機能の内容を変更することがありますが、現在の請求期間において既存加入者がすでに支払って得ている内容を引き下げることはありません。',
    '신규 구독자에게는 가격이나 포함 기능을 변경할 수 있지만, 현재 청구 기간 동안 기존 구독자가 이미 결제한 내용을 축소하지는 않습니다.',
    'Wir können Preise oder den Funktionsumfang für neue Abonnenten ändern, werden aber nicht herabstufen, wofür bestehende Abonnenten in einem laufenden Abrechnungszeitraum bereits bezahlt haben.',
    'Podemos cambiar el precio o las funciones incluidas para nuevos suscriptores, pero no reduciremos lo que los suscriptores actuales ya pagaron en un periodo de facturación en curso.',
    'Nous pouvons modifier le prix ou les fonctionnalités incluses pour les nouveaux abonnés, mais nous ne réduirons pas ce que les abonnés existants ont déjà payé sur une période de facturation en cours.',
    'Possiamo cambiare prezzo o funzioni incluse per i nuovi abbonati, ma non ridurremo ciò che gli abbonati esistenti hanno già pagato in un periodo di fatturazione in corso.',
    'Мы можем менять цену или состав функций для новых подписчиков, но не урежем то, что нынешние подписчики уже оплатили в текущем расчётном периоде.',
    'เราอาจเปลี่ยนราคาหรือฟีเจอร์ที่รวมไว้สำหรับสมาชิกใหม่ แต่จะไม่ลดสิ่งที่สมาชิกเดิมได้จ่ายไปแล้วในรอบบิลปัจจุบัน',
    'Chúng tôi có thể đổi giá hoặc tính năng đi kèm cho người đăng ký mới, nhưng sẽ không cắt giảm những gì người đăng ký hiện tại đã trả trong kỳ thanh toán hiện hành.'
  ]);

  L('tm.accept.intro', ['请勿使用 MamaBee 来：','請勿使用 MamaBee 來：','MamaBee を次の目的で使用しないでください：','다음 용도로 MamaBee를 사용하지 마세요:','Nutzen Sie MamaBee nicht, um:','No uses MamaBee para:','N\'utilisez pas MamaBee pour :','Non usare MamaBee per:','Не используйте MamaBee, чтобы:','อย่าใช้ MamaBee เพื่อ:','Đừng dùng MamaBee để:']);
  L('tm.accept.1', [
    '追踪或监视你直接照护的孩子以外的任何人。',
    '追蹤或監視你直接照護的孩子以外的任何人。',
    'あなたが直接世話をしている子ども以外の誰かを追跡・監視すること。',
    '당신이 직접 돌보는 아이 외의 누군가를 추적하거나 감시하는 것.',
    'jemanden zu tracken oder zu überwachen, der nicht ein Kind in Ihrer direkten Obhut ist.',
    'rastrear o vigilar a alguien que no sea un niño bajo tu cuidado directo.',
    'suivre ou surveiller quelqu\'un d\'autre qu\'un enfant dont vous avez la charge directe.',
    'tracciare o sorvegliare chiunque non sia un bambino sotto la tua diretta cura.',
    'отслеживать или следить за кем-либо, кроме ребёнка на вашем непосредственном попечении.',
    'ติดตามหรือสอดส่องผู้อื่นนอกเหนือจากเด็กที่อยู่ในความดูแลโดยตรงของคุณ',
    'theo dõi hoặc giám sát bất kỳ ai khác ngoài đứa trẻ bạn trực tiếp chăm sóc.'
  ]);
  L('tm.accept.2', [
    '对应用进行逆向工程、反编译或篡改。',
    '對應用進行逆向工程、反編譯或竄改。',
    'アプリをリバースエンジニアリング、逆コンパイル、改ざんすること。',
    '앱을 리버스 엔지니어링하거나 디컴파일하거나 변조하는 것.',
    'die App zurückzuentwickeln, zu dekompilieren oder zu manipulieren.',
    'aplicar ingeniería inversa, descompilar o manipular la app.',
    'faire de l\'ingénierie inverse, décompiler ou altérer l\'app.',
    'decodificare, decompilare o manomettere l\'app.',
    'выполнять обратную разработку, декомпилировать или вмешиваться в приложение.',
    'ทำวิศวกรรมย้อนกลับ ถอดรหัส หรือดัดแปลงแอป',
    'dịch ngược, biên dịch ngược hoặc can thiệp vào ứng dụng.'
  ]);
  L('tm.accept.3', [
    '滥用、刷请求，或试图从 AI 助手批量提取回复。',
    '濫用、刷請求，或試圖從 AI 助手批次提取回覆。',
    'AI アシスタントを乱用・スパムし、または大量の応答を引き出そうとすること。',
    'AI 어시스턴트를 남용·스팸하거나 대량 응답을 추출하려 시도하는 것.',
    'den KI-Assistenten zu missbrauchen, zu spammen oder massenhaft Antworten zu extrahieren.',
    'abusar, hacer spam o intentar extraer respuestas en masa del Asistente de IA.',
    'abuser, spammer ou tenter d\'extraire en masse des réponses de l\'assistant IA.',
    'abusare, fare spam o tentare di estrarre risposte in massa dall\'Assistente IA.',
    'злоупотреблять, спамить или пытаться массово извлекать ответы из AI-ассистента.',
    'ใช้ในทางที่ผิด สแปม หรือพยายามดึงคำตอบจำนวนมากจากผู้ช่วย AI',
    'lạm dụng, spam hoặc cố trích xuất hàng loạt phản hồi từ Trợ lý AI.'
  ]);
  L('tm.accept.4', [
    '以任何违反适用法律的方式使用本应用。',
    '以任何違反適用法律的方式使用本應用。',
    '適用される法律に違反するいかなる方法でもアプリを使用すること。',
    '관련 법률을 위반하는 어떤 방식으로든 앱을 사용하는 것.',
    'die App auf eine Weise zu nutzen, die geltendes Recht verletzt.',
    'usar la app de cualquier forma que infrinja la ley aplicable.',
    'utiliser l\'app d\'une manière qui enfreint la loi applicable.',
    'usare l\'app in qualsiasi modo che violi la legge applicabile.',
    'использовать приложение любым способом, нарушающим применимое право.',
    'ใช้แอปในทางใดก็ตามที่ละเมิดกฎหมายที่ใช้บังคับ',
    'dùng ứng dụng theo bất kỳ cách nào vi phạm luật hiện hành.'
  ]);
  L('tm.accept.note', [
    '我们保留在不另行通知的情况下，停用对云端支持功能（目前为 AI 助手）的滥用行为的权利。',
    '我們保留在不另行通知的情況下，停用對雲端支援功能（目前為 AI 助手）的濫用行為的權利。',
    'クラウド連携機能（現時点では AI アシスタント）の不正利用を予告なく無効化する権利を留保します。',
    '우리는 통지 없이 클라우드 기반 기능(현재: AI 어시스턴트)의 남용을 비활성화할 권리를 보유합니다.',
    'Wir behalten uns das Recht vor, missbräuchliche Nutzung cloudgestützter Funktionen (derzeit: der KI-Assistent) ohne Vorankündigung zu deaktivieren.',
    'Nos reservamos el derecho de desactivar el uso abusivo de funciones basadas en la nube (actualmente: el Asistente de IA) sin previo aviso.',
    'Nous nous réservons le droit de désactiver tout usage abusif des fonctions liées au cloud (actuellement : l\'assistant IA) sans préavis.',
    'Ci riserviamo il diritto di disattivare l\'uso abusivo delle funzioni basate su cloud (attualmente: l\'Assistente IA) senza preavviso.',
    'Мы оставляем за собой право без уведомления отключать злоупотребление облачными функциями (сейчас — AI-ассистент).',
    'เราขอสงวนสิทธิ์ในการปิดการใช้งานที่เป็นการละเมิดของฟีเจอร์ที่พึ่งพาคลาวด์ (ปัจจุบันคือผู้ช่วย AI) โดยไม่ต้องแจ้งล่วงหน้า',
    'Chúng tôi có quyền vô hiệu hóa việc lạm dụng các tính năng dựa trên đám mây (hiện tại: Trợ lý AI) mà không cần báo trước.'
  ]);

  L('tm.avail.1', [
    '应用主要在你的设备上运行，因此即便我们离线它也能工作。',
    '應用主要在你的裝置上運行，因此即便我們離線它也能運作。',
    'アプリは主にあなたの端末で動作するため、私たちがオフラインでも動きます。',
    '앱은 주로 당신의 기기에서 작동하므로, 우리가 오프라인이어도 동작합니다.',
    'Die App läuft hauptsächlich auf Ihrem Gerät und funktioniert daher auch, wenn wir offline sind.',
    'La app funciona principalmente en tu dispositivo, así que funciona incluso cuando nosotros estamos sin conexión.',
    'L\'app fonctionne principalement sur votre appareil, elle marche donc même quand nous sommes hors ligne.',
    'L\'app funziona principalmente sul tuo dispositivo, quindi funziona anche quando noi siamo offline.',
    'Приложение работает в основном на вашем устройстве, поэтому оно работает, даже когда мы офлайн.',
    'แอปทำงานหลักบนอุปกรณ์ของคุณ จึงใช้งานได้แม้ในขณะที่เราออฟไลน์',
    'Ứng dụng chạy chủ yếu trên thiết bị của bạn, nên vẫn hoạt động ngay cả khi chúng tôi ngoại tuyến.'
  ]);
  L('tm.avail.2', [
    '依赖云端的功能（AI 助手、iCloud 同步）取决于第三方（Google、Apple），不保证 100% 可用。',
    '依賴雲端的功能（AI 助手、iCloud 同步）取決於第三方（Google、Apple），不保證 100% 可用。',
    'クラウド依存の機能（AI アシスタント、iCloud 同期）はサードパーティ（Google、Apple）に依存し、100% の可用性は保証されません。',
    '클라우드 의존 기능(AI 어시스턴트, iCloud 동기화)은 제3자(Google, Apple)에 의존하며 100% 가용성을 보장하지 않습니다.',
    'Cloud-abhängige Funktionen (KI-Assistent, iCloud-Sync) hängen von Dritten ab (Google, Apple) und sind nicht zu 100 % verfügbar garantiert.',
    'Las funciones que dependen de la nube (Asistente de IA, sincronización de iCloud) dependen de terceros (Google, Apple) y no se garantiza una disponibilidad del 100 %.',
    'Les fonctions dépendant du cloud (assistant IA, synchro iCloud) dépendent de tiers (Google, Apple) et ne sont pas garanties disponibles à 100 %.',
    'Le funzioni che dipendono dal cloud (Assistente IA, sincronizzazione iCloud) dipendono da terze parti (Google, Apple) e non è garantita una disponibilità del 100%.',
    'Облачные функции (AI-ассистент, синхронизация iCloud) зависят от третьих сторон (Google, Apple) и не гарантируют 100% доступности.',
    'ฟีเจอร์ที่พึ่งพาคลาวด์ (ผู้ช่วย AI, การซิงค์ iCloud) ขึ้นอยู่กับบุคคลที่สาม (Google, Apple) และไม่รับประกันว่าจะพร้อมใช้งาน 100%',
    'Các tính năng phụ thuộc đám mây (Trợ lý AI, đồng bộ iCloud) phụ thuộc bên thứ ba (Google, Apple) và không đảm bảo khả dụng 100%.'
  ]);
  L('tm.avail.3', [
    '我们可能更新、更改或停止某些功能。如果我们停止某项付费功能，会提供合理通知，并（在required情况下）按比例退款。',
    '我們可能更新、更改或停止某些功能。如果我們停止某項付費功能，會提供合理通知，並（在需要時）按比例退款。',
    '私たちは機能を更新・変更・終了することがあります。有料機能を終了する場合は、合理的な通知を行い、（必要な場合は）日割りで返金します。',
    '우리는 기능을 업데이트, 변경 또는 중단할 수 있습니다. 유료 기능을 중단하는 경우, 합리적인 통지를 하고 (필요한 경우) 일할 환불을 제공합니다.',
    'Wir können Funktionen aktualisieren, ändern oder einstellen. Wenn wir eine kostenpflichtige Funktion einstellen, geben wir eine angemessene Vorankündigung und (wo erforderlich) eine anteilige Rückerstattung.',
    'Podemos actualizar, cambiar o descontinuar funciones. Si descontinuamos una función de pago, daremos un aviso razonable y (cuando se requiera) un reembolso prorrateado.',
    'Nous pouvons mettre à jour, modifier ou abandonner des fonctionnalités. Si nous abandonnons une fonction payante, nous donnerons un préavis raisonnable et (le cas échéant) un remboursement au prorata.',
    'Possiamo aggiornare, modificare o interrompere funzioni. Se interrompiamo una funzione a pagamento, daremo un preavviso ragionevole e (ove richiesto) un rimborso proporzionale.',
    'Мы можем обновлять, изменять или прекращать функции. Если мы прекратим платную функцию, мы дадим разумное уведомление и (где требуется) пропорциональный возврат.',
    'เราอาจอัปเดต เปลี่ยนแปลง หรือยุติฟีเจอร์ หากเรายุติฟีเจอร์แบบเสียเงิน เราจะแจ้งล่วงหน้าอย่างสมเหตุสมผล และ (ในกรณีที่กำหนด) คืนเงินตามสัดส่วน',
    'Chúng tôi có thể cập nhật, thay đổi hoặc ngừng các tính năng. Nếu ngừng một tính năng trả phí, chúng tôi sẽ thông báo hợp lý và (khi cần) hoàn tiền theo tỷ lệ.'
  ]);

  L('tm.ip.1', [
    'MamaBee、蜜蜂标志、MamaBee 名称以及应用内的美术作品归 Realm Labs Studio 所有。',
    'MamaBee、蜜蜂標誌、MamaBee 名稱以及應用內的美術作品歸 Realm Labs Studio 所有。',
    'MamaBee、ミツバチのロゴ、MamaBee の名称、アプリ内のアートワークは Realm Labs Studio が所有します。',
    'MamaBee, 벌 로고, MamaBee 이름, 앱 내 아트워크는 Realm Labs Studio의 소유입니다.',
    'MamaBee, das Bienen-Logo, der Name MamaBee und die App-Grafiken gehören Realm Labs Studio.',
    'MamaBee, el logotipo de la abeja, el nombre MamaBee y las ilustraciones dentro de la app son propiedad de Realm Labs Studio.',
    'MamaBee, le logo de l\'abeille, le nom MamaBee et les illustrations de l\'app appartiennent à Realm Labs Studio.',
    'MamaBee, il logo dell\'ape, il nome MamaBee e le illustrazioni nell\'app sono di proprietà di Realm Labs Studio.',
    'MamaBee, логотип пчелы, название MamaBee и художественные элементы в приложении принадлежат Realm Labs Studio.',
    'MamaBee โลโก้ผึ้ง ชื่อ MamaBee และงานศิลป์ในแอป เป็นของ Realm Labs Studio',
    'MamaBee, logo con ong, tên MamaBee và hình minh họa trong ứng dụng thuộc sở hữu của Realm Labs Studio.'
  ]);
  L('tm.ip.2', [
    '该应用是授权给你使用的，而非出售。你获得在你拥有的设备上使用它的个人、不可转让的权利。',
    '該應用是授權給你使用的，而非出售。你獲得在你擁有的裝置上使用它的個人、不可轉讓的權利。',
    'アプリは販売ではなくライセンス供与されます。あなたは、自分が所有する端末で利用する個人的で譲渡不可の権利を得ます。',
    '앱은 판매가 아니라 당신에게 라이선스로 제공됩니다. 당신은 소유한 기기에서 사용할 개인적이고 양도 불가능한 권리를 얻습니다.',
    'Die App wird Ihnen lizenziert, nicht verkauft. Sie erhalten ein persönliches, nicht übertragbares Recht, sie auf Geräten zu nutzen, die Ihnen gehören.',
    'La app se te concede bajo licencia, no se vende. Obtienes un derecho personal e intransferible de usarla en dispositivos de tu propiedad.',
    'L\'app vous est concédée sous licence, et non vendue. Vous obtenez un droit personnel et non transférable de l\'utiliser sur des appareils qui vous appartiennent.',
    'L\'app ti è concessa in licenza, non venduta. Ottieni un diritto personale e non trasferibile di usarla su dispositivi di tua proprietà.',
    'Приложение предоставляется вам по лицензии, а не продаётся. Вы получаете личное, непередаваемое право использовать его на принадлежащих вам устройствах.',
    'แอปนี้ให้สิทธิ์การใช้งานแก่คุณ ไม่ใช่การขาย คุณได้รับสิทธิ์ส่วนบุคคลที่โอนไม่ได้ในการใช้บนอุปกรณ์ที่คุณเป็นเจ้าของ',
    'Ứng dụng được cấp phép cho bạn, không phải bán. Bạn nhận quyền cá nhân, không thể chuyển nhượng để dùng trên các thiết bị bạn sở hữu.'
  ]);
  L('tm.ip.3', [
    '你拥有自己记录的数据。我们不主张对你宝宝的照片、备注或你放入的任何其他内容的任何权利。',
    '你擁有自己記錄的資料。我們不主張對你寶寶的照片、備註或你放入的任何其他內容的任何權利。',
    'あなたが記録したデータはあなたのものです。私たちは、赤ちゃんの写真、メモ、あなたが入力した他のいかなるコンテンツについても権利を主張しません。',
    '당신이 기록한 데이터는 당신의 것입니다. 우리는 아기의 사진, 메모, 당신이 입력한 어떤 콘텐츠에 대해서도 권리를 주장하지 않습니다.',
    'Die Daten, die Sie protokollieren, gehören Ihnen. Wir beanspruchen keine Rechte an den Fotos, Notizen oder anderen Inhalten Ihres Babys, die Sie eingeben.',
    'Eres dueño de los datos que registras. No reclamamos ningún derecho sobre las fotos, notas o cualquier otro contenido de tu bebé que introduzcas.',
    'Vous possédez les données que vous enregistrez. Nous ne revendiquons aucun droit sur les photos, notes ou tout autre contenu de votre bébé que vous saisissez.',
    'Possiedi i dati che registri. Non rivendichiamo alcun diritto sulle foto, le note o qualsiasi altro contenuto del tuo bambino che inserisci.',
    'Вы владеете данными, которые записываете. Мы не претендуем на права на фотографии, заметки малыша или любой другой вносимый вами контент.',
    'คุณเป็นเจ้าของข้อมูลที่คุณบันทึก เราไม่อ้างสิทธิ์ใด ๆ ในรูปภาพ โน้ต หรือเนื้อหาอื่นใดของลูกที่คุณใส่เข้าไป',
    'Bạn sở hữu dữ liệu mình ghi. Chúng tôi không đòi bất kỳ quyền nào với ảnh, ghi chú của bé hay bất kỳ nội dung nào bạn nhập vào.'
  ]);

  L('tm.warr.body', [
    'MamaBee 按"现状"和"现有"提供，不附带任何明示或暗示的保证——包括但不限于适销性、特定用途适用性或不侵权的保证。我们不保证应用不中断、无错误，或 AI 输出准确无误。',
    'MamaBee 按「現狀」和「現有」提供，不附帶任何明示或暗示的保證——包括但不限於適銷性、特定用途適用性或不侵權的保證。我們不保證應用不中斷、無錯誤，或 AI 輸出準確無誤。',
    'MamaBee は「現状有姿」かつ「提供可能な範囲」で提供され、明示または黙示を問わずいかなる保証も伴いません——商品性、特定目的への適合性、非侵害の保証を含みますが、これらに限りません。アプリが中断しないこと、エラーがないこと、AI の出力が正確であることは保証しません。',
    'MamaBee는 "있는 그대로", "이용 가능한 대로" 제공되며, 상품성, 특정 목적 적합성, 비침해 보증을 포함하되 이에 국한되지 않는 어떠한 명시적·묵시적 보증도 하지 않습니다. 앱이 중단 없이, 오류 없이 작동하거나 AI 출력이 정확하다고 보증하지 않습니다.',
    'MamaBee wird „wie besehen" und „wie verfügbar" bereitgestellt, ohne jegliche ausdrückliche oder stillschweigende Gewährleistung — einschließlich, aber nicht beschränkt auf Gewährleistungen der Marktgängigkeit, Eignung für einen bestimmten Zweck oder Nichtverletzung. Wir gewährleisten nicht, dass die App unterbrechungsfrei oder fehlerfrei ist oder dass die KI-Ausgaben korrekt sind.',
    'MamaBee se ofrece "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas, incluidas (sin limitarse a) las de comerciabilidad, idoneidad para un fin concreto o no infracción. No garantizamos que la app sea ininterrumpida, libre de errores ni que los resultados de la IA sean exactos.',
    'MamaBee est fourni « tel quel » et « selon disponibilité », sans garantie d\'aucune sorte, expresse ou implicite — y compris, sans s\'y limiter, les garanties de qualité marchande, d\'adéquation à un usage particulier ou d\'absence de contrefaçon. Nous ne garantissons pas que l\'app soit ininterrompue, sans erreur, ni que les sorties de l\'IA soient exactes.',
    'MamaBee è fornito "così com\'è" e "come disponibile", senza garanzie di alcun tipo, esplicite o implicite — incluse, a titolo esemplificativo, garanzie di commerciabilità, idoneità a uno scopo particolare o non violazione. Non garantiamo che l\'app sia ininterrotta, priva di errori o che gli output dell\'IA siano accurati.',
    'MamaBee предоставляется «как есть» и «как доступно», без каких-либо гарантий, явных или подразумеваемых, включая, помимо прочего, гарантии товарной пригодности, пригодности для конкретной цели или ненарушения прав. Мы не гарантируем, что приложение будет работать без перебоев и ошибок или что выводы ИИ будут точными.',
    'MamaBee ให้บริการ "ตามสภาพ" และ "ตามที่มี" โดยไม่มีการรับประกันใด ๆ ทั้งโดยชัดแจ้งหรือโดยนัย — รวมถึงแต่ไม่จำกัดเพียงการรับประกันความเหมาะสมเชิงพาณิชย์ ความเหมาะสมต่อวัตถุประสงค์เฉพาะ หรือการไม่ละเมิดสิทธิ์ เราไม่รับประกันว่าแอปจะไม่สะดุด ไม่มีข้อผิดพลาด หรือผลลัพธ์ของ AI จะถูกต้อง',
    'MamaBee được cung cấp "nguyên trạng" và "theo mức khả dụng", không có bảo đảm nào, dù rõ ràng hay ngụ ý — bao gồm nhưng không giới hạn ở bảo đảm về khả năng thương mại, sự phù hợp cho một mục đích cụ thể, hay không vi phạm. Chúng tôi không bảo đảm ứng dụng không gián đoạn, không lỗi, hay đầu ra của AI chính xác.'
  ]);

  L('tm.liab.1', [
    '在法律允许的最大范围内，对于因你使用本应用而产生的任何间接、附带、特殊、后果性或惩罚性损害，或任何数据、收入或利润的损失，Realm Labs Studio 概不负责——即使已被告知此类可能性。对于任何与 MamaBee 相关的索赔，我们的累计总责任不超过索赔前 12 个月内你为该应用向我们支付的金额。',
    '在法律允許的最大範圍內，對於因你使用本應用而產生的任何間接、附帶、特殊、後果性或懲罰性損害，或任何資料、收入或利潤的損失，Realm Labs Studio 概不負責——即使已被告知此類可能性。對於任何與 MamaBee 相關的索賠，我們的累計總責任不超過索賠前 12 個月內你為該應用向我們支付的金額。',
    '法律で認められる最大限の範囲において、Realm Labs Studio は、アプリの利用から生じる間接的・付随的・特別・結果的・懲罰的損害、またはデータ・収益・利益の損失について、たとえその可能性を知らされていたとしても責任を負いません。MamaBee に関する請求についての当社の累計総責任は、請求前 12 か月間にあなたが当社にアプリの対価として支払った額を超えないものとします。',
    '법이 허용하는 최대 범위 내에서, Realm Labs Studio는 앱 사용으로 인해 발생하는 간접적·부수적·특별·결과적·징벌적 손해, 또는 데이터·수익·이익의 손실에 대해 — 그러한 가능성을 사전에 고지받았더라도 — 책임지지 않습니다. MamaBee와 관련된 모든 청구에 대한 당사의 총 누적 책임은 청구 이전 12개월간 당신이 앱에 대해 당사에 지불한 금액을 초과하지 않습니다.',
    'Soweit gesetzlich zulässig, haftet Realm Labs Studio nicht für indirekte, zufällige, besondere, Folge- oder Strafschäden oder für den Verlust von Daten, Einnahmen oder Gewinnen, die aus Ihrer Nutzung der App entstehen — selbst wenn wir auf die Möglichkeit hingewiesen wurden. Unsere gesamte Haftung für Ansprüche im Zusammenhang mit MamaBee übersteigt nicht den Betrag, den Sie uns in den 12 Monaten vor dem Anspruch für MamaBee gezahlt haben.',
    'En la máxima medida permitida por la ley, Realm Labs Studio no es responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de pérdidas de datos, ingresos o beneficios, derivados de tu uso de la app, incluso si se nos advirtió de la posibilidad. Nuestra responsabilidad total acumulada por cualquier reclamación relativa a MamaBee no superará el importe que nos pagaste por MamaBee en los 12 meses anteriores a la reclamación.',
    'Dans toute la mesure permise par la loi, Realm Labs Studio n\'est pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de toute perte de données, de revenus ou de bénéfices, découlant de votre utilisation de l\'app — même si nous avons été informés de cette possibilité. Notre responsabilité totale cumulée pour toute réclamation relative à MamaBee ne dépassera pas le montant que vous nous avez payé pour MamaBee dans les 12 mois précédant la réclamation.',
    'Nella misura massima consentita dalla legge, Realm Labs Studio non è responsabile per danni indiretti, incidentali, speciali, consequenziali o punitivi, né per perdita di dati, ricavi o profitti, derivanti dall\'uso dell\'app — anche se avvisati della possibilità. La nostra responsabilità complessiva per qualsiasi reclamo relativo a MamaBee non supererà l\'importo che ci hai pagato per MamaBee nei 12 mesi precedenti il reclamo.',
    'В максимально допустимой законом степени Realm Labs Studio не несёт ответственности за любые косвенные, случайные, специальные, последующие или штрафные убытки, а также за потерю данных, дохода или прибыли, возникшие из-за использования приложения, даже если нас предупреждали о такой возможности. Наша совокупная ответственность по любому требованию, связанному с MamaBee, не превысит суммы, уплаченной вами нам за MamaBee за 12 месяцев до требования.',
    'เท่าที่กฎหมายอนุญาตสูงสุด Realm Labs Studio ไม่รับผิดต่อความเสียหายทางอ้อม โดยบังเอิญ พิเศษ สืบเนื่อง หรือเชิงลงโทษ หรือการสูญเสียข้อมูล รายได้ หรือกำไร ที่เกิดจากการที่คุณใช้แอป — แม้เราจะได้รับแจ้งถึงความเป็นไปได้นั้น ความรับผิดรวมทั้งหมดของเราต่อข้อเรียกร้องใด ๆ ที่เกี่ยวกับ MamaBee จะไม่เกินจำนวนที่คุณจ่ายให้เราสำหรับ MamaBee ใน 12 เดือนก่อนการเรียกร้อง',
    'Trong phạm vi tối đa pháp luật cho phép, Realm Labs Studio không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hệ quả hay mang tính trừng phạt nào, hoặc bất kỳ mất mát dữ liệu, doanh thu hay lợi nhuận nào phát sinh từ việc bạn dùng ứng dụng — ngay cả khi chúng tôi đã được cảnh báo về khả năng đó. Tổng trách nhiệm gộp của chúng tôi cho bất kỳ khiếu nại nào liên quan đến MamaBee sẽ không vượt quá số tiền bạn đã trả cho chúng tôi cho MamaBee trong 12 tháng trước khiếu nại.'
  ]);
  L('tm.liab.2', [
    '某些司法管辖区不允许这些限制——在这种情况下，这些限制将在当地法律允许的最大范围内适用。',
    '某些司法管轄區不允許這些限制——在這種情況下，這些限制將在當地法律允許的最大範圍內適用。',
    '一部の法域ではこれらの制限が認められません。その場合、これらの制限はその地域で認められる最大限の範囲で適用されます。',
    '일부 관할권에서는 이러한 제한이 허용되지 않습니다 — 그 경우 이러한 제한은 해당 지역에서 허용되는 최대 범위 내에서 적용됩니다.',
    'Einige Rechtsräume lassen diese Beschränkungen nicht zu — in diesem Fall gelten die Beschränkungen im dort maximal zulässigen Umfang.',
    'Algunas jurisdicciones no permiten estos límites; en ese caso, los límites se aplican en la máxima medida permitida allí.',
    'Certaines juridictions n\'autorisent pas ces limites — auquel cas elles s\'appliquent dans toute la mesure permise localement.',
    'Alcune giurisdizioni non consentono questi limiti — in tal caso, i limiti si applicano nella misura massima ivi consentita.',
    'Некоторые юрисдикции не допускают таких ограничений — в этом случае они применяются в максимально допустимой там степени.',
    'บางเขตอำนาจไม่อนุญาตให้มีข้อจำกัดเหล่านี้ — ในกรณีนั้น ข้อจำกัดจะใช้บังคับเท่าที่กฎหมายในที่นั้นอนุญาตสูงสุด',
    'Một số khu vực pháp lý không cho phép các giới hạn này — khi đó, các giới hạn áp dụng trong phạm vi tối đa được cho phép tại đó.'
  ]);

  L('tm.changes.body', [
    '我们可能会不时更新这些条款。我们会更新上方的"最后更新"日期，对于重大变更，会在应用内发布提示。变更后继续使用 MamaBee 即表示你接受新条款。',
    '我們可能會不時更新這些條款。我們會更新上方的「最後更新」日期，對於重大變更，會在應用內發布提示。變更後繼續使用 MamaBee 即表示你接受新條款。',
    '私たちはこれらの規約を随時更新することがあります。上部の「最終更新」日を更新し、重要な変更についてはアプリ内でお知らせします。変更後も MamaBee を使い続けることは、新しい規約に同意したことを意味します。',
    '우리는 수시로 이 약관을 업데이트할 수 있습니다. 위의 "최종 업데이트" 날짜를 갱신하고, 중요한 변경에 대해서는 앱 내에 안내를 게시합니다. 변경 후에도 MamaBee를 계속 사용하면 새 약관에 동의하는 것입니다.',
    'Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Wir aktualisieren das „Zuletzt aktualisiert"-Datum oben und veröffentlichen bei wesentlichen Änderungen einen Hinweis in der App. Die fortgesetzte Nutzung von MamaBee nach einer Änderung bedeutet, dass Sie die neuen Bedingungen akzeptieren.',
    'Podemos actualizar estos términos de vez en cuando. Actualizaremos la fecha de "Última actualización" de arriba y, para cambios importantes, publicaremos un aviso en la app. Seguir usando MamaBee tras un cambio significa que aceptas los nuevos términos.',
    'Nous pouvons mettre à jour ces conditions de temps à autre. Nous mettrons à jour la date de « Dernière mise à jour » ci-dessus et, pour les changements importants, publierons une note dans l\'app. Continuer à utiliser MamaBee après un changement signifie que vous acceptez les nouvelles conditions.',
    'Possiamo aggiornare questi termini di tanto in tanto. Aggiorneremo la data di "Ultimo aggiornamento" qui sopra e, per modifiche sostanziali, pubblicheremo un avviso nell\'app. Continuare a usare MamaBee dopo una modifica significa che accetti i nuovi termini.',
    'Мы можем время от времени обновлять эти условия. Мы обновим дату «Последнее обновление» выше и для существенных изменений разместим уведомление в приложении. Продолжение использования MamaBee после изменения означает, что вы принимаете новые условия.',
    'เราอาจอัปเดตข้อกำหนดเหล่านี้เป็นครั้งคราว เราจะอัปเดตวันที่ "อัปเดตล่าสุด" ด้านบน และสำหรับการเปลี่ยนแปลงที่มีสาระสำคัญ จะโพสต์หมายเหตุในแอป การใช้ MamaBee ต่อไปหลังการเปลี่ยนแปลงถือว่าคุณยอมรับข้อกำหนดใหม่',
    'Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Chúng tôi sẽ cập nhật ngày "Cập nhật lần cuối" ở trên và, với các thay đổi quan trọng, đăng thông báo trong ứng dụng. Việc tiếp tục dùng MamaBee sau thay đổi nghĩa là bạn chấp nhận các điều khoản mới.'
  ]);

  L('tm.law.body', [
    '这些条款受 Realm Labs Studio 注册地所在司法管辖区的法律管辖，不考虑其法律冲突原则。<em>（发布前请将本句替换为实际司法管辖区——例如"美国加利福尼亚州"或"中国香港特别行政区"。）</em>',
    '這些條款受 Realm Labs Studio 註冊地所在司法管轄區的法律管轄，不考慮其法律衝突原則。<em>（發布前請將本句替換為實際司法管轄區——例如「美國加利福尼亞州」或「中國香港特別行政區」。）</em>',
    'これらの規約は、Realm Labs Studio が登録されている法域の法律に準拠し、その抵触法の原則は考慮されません。<em>（公開前に、この行を実際の法域——例：「米国カリフォルニア州」や「香港特別行政区」——に置き換えてください。）</em>',
    '이 약관은 Realm Labs Studio가 등록된 관할권의 법률에 따르며, 그 법률 충돌 원칙은 고려하지 않습니다. <em>(게시 전에 이 문장을 실제 관할권 — 예: "미국 캘리포니아주" 또는 "홍콩 특별행정구" — 으로 교체하세요.)</em>',
    'Diese Bedingungen unterliegen den Gesetzen der Rechtsordnung, in der Realm Labs Studio registriert ist, ungeachtet ihrer kollisionsrechtlichen Grundsätze. <em>(Ersetzen Sie diese Zeile vor der Veröffentlichung durch die tatsächliche Rechtsordnung — z. B. „der US-Bundesstaat Kalifornien" oder „die Sonderverwaltungsregion Hongkong".)</em>',
    'Estos términos se rigen por las leyes de la jurisdicción donde está registrada Realm Labs Studio, sin tener en cuenta sus principios de conflicto de leyes. <em>(Sustituye esta línea por la jurisdicción real antes de publicar, p. ej., "el Estado de California, EE. UU." o "la RAE de Hong Kong".)</em>',
    'Ces conditions sont régies par les lois de la juridiction où Realm Labs Studio est enregistrée, sans égard à ses principes de conflit de lois. <em>(Remplacez cette ligne par la juridiction réelle avant publication — p. ex. « l\'État de Californie, États-Unis » ou « la RAS de Hong Kong ».)</em>',
    'Questi termini sono regolati dalle leggi della giurisdizione in cui Realm Labs Studio è registrata, senza riguardo ai suoi principi sui conflitti di legge. <em>(Sostituisci questa riga con la giurisdizione effettiva prima della pubblicazione — es. "lo Stato della California, USA" o "la RAS di Hong Kong".)</em>',
    'Эти условия регулируются законами юрисдикции, в которой зарегистрирована Realm Labs Studio, без учёта её коллизионных норм. <em>(Перед публикацией замените эту строку фактической юрисдикцией — например, «штат Калифорния, США» или «САР Гонконг».)</em>',
    'ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายของเขตอำนาจที่ Realm Labs Studio จดทะเบียน โดยไม่คำนึงถึงหลักการขัดกันแห่งกฎหมาย <em>(โปรดแทนที่บรรทัดนี้ด้วยเขตอำนาจจริงก่อนเผยแพร่ — เช่น "รัฐแคลิฟอร์เนีย สหรัฐอเมริกา" หรือ "เขตบริหารพิเศษฮ่องกง")</em>',
    'Các điều khoản này được điều chỉnh bởi luật của khu vực pháp lý nơi Realm Labs Studio đăng ký, không xét đến các nguyên tắc xung đột pháp luật. <em>(Hãy thay dòng này bằng khu vực pháp lý thực tế trước khi công bố — ví dụ "Bang California, Hoa Kỳ" hoặc "Đặc khu Hành chính Hồng Kông".)</em>'
  ]);

  L('tm.contact.body', [
    '对这些条款有疑问？请发送电子邮件至 <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>。',
    '對這些條款有疑問？請發送電子郵件至 <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>。',
    'これらの規約についてご質問は <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> までメールしてください。',
    '이 약관에 대해 궁금한 점이 있으신가요? <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a> 로 이메일을 보내주세요.',
    'Fragen zu diesen Bedingungen? Schreiben Sie an <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    '¿Preguntas sobre estos términos? Escribe a <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'Des questions sur ces conditions ? Écrivez à <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'Domande su questi termini? Scrivi a <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'Вопросы по этим условиям? Напишите на <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.',
    'มีคำถามเกี่ยวกับข้อกำหนดเหล่านี้? อีเมลถึง <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>',
    'Có câu hỏi về các điều khoản này? Gửi email đến <a class="inline" href="mailto:support@realmlabs.app">support@realmlabs.app</a>.'
  ]);

  /* ---------- engine ---------- */
  var store = new WeakMap();

  // Capture every block's true English innerHTML SYNCHRONOUSLY at load,
  // before i18n.js (nav/footer translator) runs on DOMContentLoaded and
  // possibly mutates a shared word (e.g. "Contact") inside our blocks.
  (function captureNow() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      if (!store.has(els[i])) store.set(els[i], els[i].innerHTML);
    }
  })();

  function apply(lang) {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-i18n');
      if (!store.has(el)) store.set(el, el.innerHTML);
      var orig = store.get(el);
      if (lang === 'en' || !DICT[key] || !DICT[key][lang]) {
        el.innerHTML = orig;
      } else {
        el.innerHTML = DICT[key][lang];
      }
    }
    document.documentElement.setAttribute('lang', lang);
  }

  function current() { try { return localStorage.getItem('mb_lang') || 'en'; } catch (e) { return 'en'; } }

  function init() {
    var sel = document.getElementById('lang-select');
    if (sel) {
      if (sel.value !== current()) { try { sel.value = current(); } catch (e) {} }
      sel.addEventListener('change', function () {
        try { localStorage.setItem('mb_lang', sel.value); } catch (e) {}
        apply(sel.value);
      });
    }
    // re-apply on next tick too, so we win over i18n.js's own apply pass
    apply(current());
    setTimeout(function () { apply(current()); }, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
