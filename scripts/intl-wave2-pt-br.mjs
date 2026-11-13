// Wave-2 pt-BR MamaBee articles (hreflang pt-BR + pt). DRAFTS only.
// Bebê+ facts verified on 2026-11-14: iTunes lookup country=br/pt (id1093774002), apps.apple.com/br page,
// the 100 most recent BR App Store reviews (RSS), and Google Play (com.hp.babyapp, "Contém anúncios").
// MamaBee prices = owner-confirmed App Store Connect list (WAVE2-ADDENDUM).
// Run: set -a && source .env && set +a && node scripts/intl-wave2-pt-br.mjs
import {A, saveDrafts} from './lib/intl-draft.mjs'

const L = (slug) => `/mamabee/pt-br/articles/${slug}`
const DATA = '14 de novembro de 2026'

const SRC = {
  caderneta: '[Caderneta da Criança, Ministério da Saúde](https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta)',
  aleitamento: '[Aleitamento materno, Ministério da Saúde](https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/aleitamento-materno)',
  sbpSono: '[Higiene do Sono, Departamento Científico de Medicina do Sono da SBP (2017)](https://www.sbp.com.br/fileadmin/user_upload/19807c-DocCient_-_Higiene_do_Sono.pdf)',
  aapHoras: '[AAP/HealthyChildren: horas de sono recomendadas por idade](https://www.healthychildren.org/English/healthy-living/sleep/Pages/healthy-sleep-habits-how-many-hours-does-your-child-need.aspx)',
  aapSonoBebe: '[AAP/HealthyChildren: como ajudar o bebê a dormir](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/getting-your-baby-to-sleep.aspx)',
  aapLeite: '[AAP/HealthyChildren: como saber se o bebê está recebendo leite suficiente](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx)',
  aapDesidratacao: '[AAP/HealthyChildren: desidratação](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/dehydration.aspx)',
  oms: '[Padrões de crescimento infantil da OMS](https://www.who.int/tools/child-growth-standards)',
  boletim: '[Boletim de Saúde Infantil e Juvenil, SNS 24 (Portugal)](https://www.sns24.gov.pt/pt/servico/boletim-de-saude-infantil-e-juvenil/)',
  sns24Crianca: '[Saúde da criança, SNS 24 (Portugal)](https://www.sns24.gov.pt/pt/tema/saude-da-crianca/)',
  bebeMaisAS: '[Bebê+ na App Store Brasil](https://apps.apple.com/br/app/id1093774002)',
  bebeMaisGP: '[Bebê+ na Google Play](https://play.google.com/store/apps/details?id=com.hp.babyapp)',
}
const DISCLAIMER = 'Este conteúdo é apenas informativo e não substitui a orientação médica. Em caso de dúvida sobre a saúde do seu bebê, fale com o pediatra ou procure a unidade de saúde.'

const articles = [

  // ───────────────────────── 1. Bebê+ (Philips) vs MamaBee ─────────────────────────
  A('mamabee-vs-baby-plus-philips',
    'Bebê+ (Philips) vs MamaBee em 2026: qual app escolher?',
    'Bebê+ da Philips ou MamaBee? Comparamos os dois apps gratuitos: registros, conteúdo, uso de madrugada, Android e uso com o parceiro.',
    ['app bebê mais', 'bebê+ philips', 'aplicativo para bebê recém-nascido', 'app amamentação grátis', 'diário do bebê'],
    {
      lado: {
        caption: `App Store Brasil e Google Play, conferidas em ${DATA}.`,
        headers: ['', 'Bebê+ (Philips)', 'MamaBee'],
        rows: [
          ['Desenvolvedor', 'Philips Digital UK Limited', 'Realm Labs'],
          ['Na App Store desde', '2016', '2026'],
          ['Avaliações (App Store BR)', '10,8 mil, média 4,77', 'Novo no Brasil'],
          ['Preço', 'Grátis (a página indica compras dentro do app, sem listar preços)', 'Grátis; Premium opcional R$ 29,90/mês ou R$ 299,90/ano'],
          ['Anúncios', 'A ficha da Google Play informa "Contém anúncios"', 'Nenhum, em nenhum plano'],
          ['Aparelhos', 'iPhone e iPad (iOS 14+) e Android', 'Só iPhone (iOS 17.6+)'],
          ['Foco', 'Guia do primeiro ano + registros', 'Registro rápido da rotina + relatórios'],
          ['Artigos, vídeos e sons', 'Blog diário, guias semanais, vídeos de amamentação, ruído branco, cantigas', 'Não; Bee AI para perguntas (Premium)'],
          ['Mamadas, sono, fraldas', 'Sim', 'Sim, com cronômetro por lado e fraldas xixi, cocô, misto ou seca'],
          ['Crescimento', 'Registro de crescimento com gráficos', 'Percentis da OMS'],
          ['Marcos e memórias', 'Marcos, diário, fotos e registro de dentes', '45+ marcos do CDC'],
          ['Gêmeos ou mais de um bebê', 'Sim, grátis', 'Premium'],
          ['Uso com o parceiro', 'Compartilhamento do app; avaliações divergem sobre o tempo real', '2 cuidadores grátis, em tempo real (os dois no iPhone)'],
          ['Widgets', 'Avaliações de 2025 e 2026 pedem widget', 'Sim, grátis'],
          ['Exportação para o pediatra', 'Não aparece na página da App Store', 'CSV, JSON e PDF, grátis'],
          ['Previsão de soneca', 'Não anunciada', 'Sleep Coach (Premium)'],
          ['App Saúde da Apple', 'Sincroniza, se você permitir', 'Não faz parte dos recursos anunciados'],
        ],
      },
      escolha: {
        caption: 'Qual app combina com cada situação.',
        headers: ['A sua situação', 'Melhor escolha', 'Por quê'],
        rows: [
          ['Primeiro filho, quer ler e aprender semana a semana', 'Bebê+', 'Artigos, guias e vídeos de amamentação de graça'],
          ['Um dos pais usa Android', 'Bebê+', 'O MamaBee só funciona no iPhone'],
          ['Gêmeos, sem querer pagar nada', 'Bebê+', 'Múltiplos são grátis; no MamaBee, só no Premium'],
          ['Casal dividindo a madrugada, os dois com iPhone', 'MamaBee', 'Sincronização em tempo real para 2, grátis'],
          ['Quer levar números organizados à consulta', 'MamaBee', 'Resumos de 7 dias, percentis da OMS e PDF para o pediatra'],
          ['Não quer anúncios em nenhuma hipótese', 'MamaBee', 'Sem anúncios em nenhum plano'],
          ['Quer previsão de soneca', 'MamaBee Premium ou Napper', 'O Bebê+ não anuncia previsão'],
        ],
      },
    },
`**O Bebê+ (Baby+), da Philips, é um app gratuito que junta registro de mamadas, sono e fraldas com artigos, vídeos de amamentação e ruído branco, e funciona no iPhone e no Android. O MamaBee é focado no registro rápido: um toque, sem anúncios, sincronização em tempo real para 2 cuidadores e PDF para o pediatra, só no iPhone.**
Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. O Bebê+ é um dos apps de bebê mais conhecidos do Brasil, e vamos dizer com clareza quando ele é a melhor escolha.
Quem procura "app bebê mais" no Google normalmente já ouviu falar dele na maternidade, num grupo de mães ou porque usou o Gravidez+, o app de gestação da mesma Philips, que tem mais de 74 mil avaliações na App Store brasileira. A passagem é natural: termina a gravidez, começa o Bebê+. A dúvida é se ele dá conta da rotina real do recém-nascido, principalmente de madrugada e quando duas pessoas dividem os cuidados.
Todas as informações abaixo foram conferidas na App Store brasileira e na Google Play em ${DATA}.
## O que é o app Bebê+ da Philips?
O **Bebê+ | Seu registro do bebê** (Baby+, em inglês) é publicado pela Philips Digital UK Limited e está na App Store desde maio de 2016. No Brasil, tem 10.785 avaliações, com média 4,77, e aparecia em 42º lugar na categoria Medicina no dia da nossa consulta. Na Google Play, a versão Android passa de 5 milhões de downloads.
A proposta é acompanhar os "primeiros 1000 dias". O app combina três coisas:
- **Conteúdo:** blog diário, guias de desenvolvimento semana a semana, vídeos sobre a pega na amamentação, dicas de recuperação pós-parto e ideias de atividades para a idade do bebê.
- **Registros:** crescimento, alimentação (peito, mamadeira e extração de leite), sono, fraldas, saúde (temperatura, remédios e vacinas), consultas, dentes e até o peso da mãe.
- **Memórias e sons:** diário, fotos de momentos, marcos como engatinhar e andar, ruído branco e cantigas de ninar da Disney.
Também tem suporte a gêmeos e múltiplos, sincroniza com o app Saúde da Apple (se você permitir) e oferece o compartilhamento do app com pessoas queridas para registrar o crescimento juntos.
## Bebê+ é bom? O que dizem as avaliações no Brasil
Lemos as 100 avaliações mais recentes da App Store brasileira, de 2023 a outubro de 2026. O tom geral é muito positivo. Os elogios mais comuns: é gratuito ("é surreal como algo gratuito pode ser tão eficaz e funcional", escreveu uma mãe em outubro de 2026), é fácil de usar, tem botões grandes e os gráficos de crescimento lembram os da caderneta do SUS. Vários pais também elogiam o suporte por e-mail, que ajudou a recuperar contas e históricos.
As críticas também se repetem, e ajudam a decidir:
- **Tela clara de madrugada.** É o pedido mais frequente: cerca de 1 em cada 5 das avaliações que lemos, de 2023 a 2026, pede um modo escuro porque a tela branca "clareia demais" o quarto nas mamadas da noite.
- **Compartilhamento entre pai e mãe.** Algumas famílias contam que usam a mesma conta em dois celulares e que tudo sincroniza. Outras dizem que o compartilhamento não funciona em tempo real ou pedem um jeito de adicionar o pai à conta.
- **Registros que somem.** Há relatos, sobretudo em 2023 e 2024, de mamadas e sonecas que desapareceram depois de atualizações ou de um novo login. Em 2025 e 2026, algumas avaliações dizem que o cronômetro de mamada registrou o horário errado.
- **Widget e Apple Watch.** Avaliações de 2025 e 2026 pedem um widget na tela de início e integração com o Apple Watch.
Contexto: a última atualização do Bebê+ na App Store é a versão 3.1, de 20 de novembro de 2025, com "algumas correções de erros". Novidades grandes, como o modo escuro, não tinham chegado até a data desta comparação.
## Bebê+ vs MamaBee: comparação lado a lado
[[TABLE:lado]]
## Onde o Bebê+ vence
- **Conteúdo para o primeiro ano.** Artigos diários, guias semanais e vídeos de amamentação, tudo de graça. O MamaBee não tem uma biblioteca de artigos. No Premium, a Bee AI responde perguntas, mas não substitui um guia editorial.
- **Android.** O Bebê+ existe na Google Play. Se um dos dois usa Android, ele serve para o casal. O MamaBee não.
- **iPad e iPhones mais antigos.** Roda a partir do iOS 14, também no iPad. O MamaBee pede iOS 17.6 ou mais recente e funciona só no iPhone.
- **Gêmeos sem custo.** O Bebê+ registra múltiplos de graça. No MamaBee, mais de um bebê é recurso do Premium.
- **Sons e memórias.** Ruído branco, cantigas, diário, fotos e registro de dentes.
- **App Saúde e estrada.** Sincroniza com o app Saúde, tem quase dez anos de App Store e mais de 10 mil avaliações no Brasil. O MamaBee chegou em 2026.
- **Continuidade com o Gravidez+.** Se você usou o app de gestação da Philips, o Bebê+ vai parecer familiar desde o primeiro dia.
## Onde o MamaBee é diferente
O MamaBee foi feito para o momento em que você tem um bebê no colo e um dedo livre. O registro fica em botões grandes, na parte de baixo da tela, em um toque, e a interface está em português.
- **Sem anúncios em nenhum plano.** Na Google Play, a ficha do Bebê+ informa "Contém anúncios". Na App Store, não encontramos reclamações de anúncios nas avaliações recentes que lemos.
- **Sincronização em tempo real para 2 cuidadores, grátis.** O que um registra aparece na hora no celular do outro, cada um com o seu acesso. Os dois precisam de iPhone.
- **Fraldas com detalhe.** Xixi, cocô, misto ou seca, lado a lado com as mamadas na linha do tempo do dia. Explicamos por que isso importa em [quantas fraldas o recém-nascido usa por dia](${L('how-many-wet-diapers-newborn')}).
- **Amamentação com cronômetro por lado.** Esquerdo e direito, além de mamadeira e extração de leite.
- **Widgets** na tela de início, de graça, para ver a última mamada sem abrir o app.
- **Percentis da OMS** para peso, comprimento e perímetro cefálico, a mesma referência das curvas da Caderneta da Criança, e mais de 45 marcos do desenvolvimento do CDC americano.
- **Resumos de 7 dias e PDF para o pediatra**, além de exportação em CSV e JSON.
- **Privacidade local.** Os registros ficam no seu iPhone, a menos que você ative o compartilhamento com o parceiro. Os dados nunca são vendidos.
O Premium é opcional e custa R$ 29,90 por mês ou R$ 299,90 por ano na App Store brasileira. Ele traz o Sleep Coach, que prevê a próxima soneca a partir do histórico do seu bebê, a Bee AI ilimitada, o teste de alergênicos da introdução alimentar com cronômetro de reação de 3 dias, vários bebês, mais cuidadores, análises de 30, 90 e 365 dias e o calendário vacinal completo. No grátis, o calendário vacinal mostra só os 3 primeiros meses.
[[CTA||Registro em um toque, sem anúncios e com o parceiro em tempo real: experimente o MamaBee grátis]]
## Onde o MamaBee perde
- Não tem Android, iPad nem Apple Watch.
- Não tem artigos, vídeos de amamentação, ruído branco nem cantigas.
- Gêmeos e mais de um bebê exigem o Premium. No Bebê+, são grátis.
- É novo: não tem o histórico nem as milhares de avaliações do Bebê+.
- Previsão de soneca, IA e calendário vacinal completo são pagos. O Bebê+ não cobra pelo que oferece.
## Como usar um app de bebê de madrugada sem acender o quarto
Como a tela clara é a queixa número um das avaliações do Bebê+, vale uma dica que serve para qualquer app no iPhone, inclusive o nosso:
- **Reduzir Ponto Branco:** em Ajustes, Acessibilidade, Tela e Tamanho do Texto. Diminui a intensidade das cores claras muito além do brilho mínimo.
- **Atalho de Acessibilidade:** em Ajustes, Acessibilidade, Atalho de Acessibilidade, escolha Reduzir Ponto Branco. Assim, três cliques no botão lateral ligam e desligam o ajuste no escuro.
- **Inversão Inteligente:** no mesmo menu de Tela e Tamanho do Texto, inverte as cores da maioria dos apps sem estragar as fotos.
A Sociedade Brasileira de Pediatria, no documento sobre higiene do sono, orienta que, ao cuidar da criança durante a noite, os pais usem uma luz fraca, falem baixo e sejam breves. Um registro de um toque ajuda nisso. Se o desafio da casa é acertar a hora de cada soneca, veja também a nossa [tabela de janela de sono por idade](${L('wake-windows-by-age')}).
## Bebê+ ou MamaBee: qual escolher?
[[TABLE:escolha]]
**Escolha o Bebê+ se** você quer aprender enquanto registra, gosta de ter conteúdo semana a semana no mesmo app, tem gêmeos ou alguém da casa usa Android.
**Escolha o MamaBee se** o casal divide a madrugada com dois iPhones, você quer registrar sem anúncios em um toque e chegar à consulta com resumos, percentis e um PDF pronto.
Dá também para usar os dois: o Bebê+ para ler os guias da semana e o MamaBee para os registros do dia a dia. Se você ainda está comparando, veja o nosso [comparativo de 6 aplicativos para bebê](${L('best-baby-tracker-apps-compared')}) e a comparação entre [Meu Bebê e MamaBee](${L('mamabee-vs-meu-bebe')}), outro app gratuito e muito popular no Brasil. Para previsão de soneca, o especialista é o Napper: detalhamos em [Napper é bom? Napper vs MamaBee](${L('napper-vs-mamabee')}).
## E em Portugal?
Na App Store portuguesa, o Bebê+ aparece com o mesmo nome e tem 1.154 avaliações, com média 4,67. O MamaBee aparece como "MamaBee: Diário do Bebé", com Premium a 5,99 € por mês ou 59,99 € por ano. Lá, o registro oficial da criança é o Boletim de Saúde Infantil e Juvenil, e não a Caderneta.
## O app substitui a Caderneta da Criança?
Nenhum dos dois substitui. A Caderneta da Criança, entregue na alta da maternidade, é o documento oficial: nela o profissional de saúde anota crescimento, desenvolvimento e vacinas. Os apps registram o dia a dia, aquelas mamadas, fraldas e sonecas que ninguém consegue lembrar na consulta de puericultura. As vacinas seguem o calendário do Ministério da Saúde e precisam estar anotadas na Caderneta.
## Perguntas frequentes
### O app Bebê+ é gratuito?
Sim. O Bebê+ é gratuito para baixar e usar no iPhone e no Android. A página da App Store indica compras dentro do app, sem listar preços, e a ficha da Google Play informa que a versão Android contém anúncios.
### O Bebê+ tem modo escuro?
Não encontramos essa opção na página da App Store em ${DATA}, e muitas avaliações de 2023 a 2026 pedem um modo escuro para as mamadas da noite. Enquanto isso, o ajuste Reduzir Ponto Branco do iPhone diminui bastante o clarão de qualquer app.
### Dá para usar o Bebê+ com o pai em outro celular?
O Bebê+ permite compartilhar o app com outras pessoas. Nas avaliações, algumas famílias dizem que a sincronização funciona bem, e outras, que não acontece em tempo real. No MamaBee, 2 cuidadores sincronizam de graça em tempo real, desde que os dois usem iPhone.
### O Bebê+ funciona no Android?
Sim. O Bebê+ está na Google Play, com mais de 5 milhões de downloads. O MamaBee, por enquanto, funciona só no iPhone.
### Qual é melhor: Bebê+ ou MamaBee?
Para conteúdo sobre o primeiro ano, gêmeos sem custo ou um casal com Android, o Bebê+. Para registro rápido sem anúncios, sincronização em tempo real para dois iPhones e um PDF para o pediatra, o MamaBee.
## Resumindo
O Bebê+ é um guia do primeiro ano com registros, gratuito, com Android e quase dez anos de estrada. As avaliações elogiam o conteúdo e a simplicidade e pedem modo escuro, widget e um compartilhamento mais confiável entre os pais. O MamaBee é o app de registro para quem usa iPhone: um toque, sem anúncios, dois cuidadores em tempo real, percentis da OMS e um relatório pronto para a consulta.
[[CTA||Baixe o MamaBee grátis: registro em um toque, sem anúncios, e os dados do seu bebê ficam com você]]
Fontes: ${SRC.bebeMaisAS}; ${SRC.bebeMaisGP}; ${SRC.caderneta}; ${SRC.sbpSono}; ${SRC.oms}; ${SRC.boletim}.
Recursos, avaliações e preços conferidos na App Store do Brasil e de Portugal e na Google Play em ${DATA}, e podem mudar. As críticas citadas são opiniões de usuários publicadas na App Store brasileira. ${DISCLAIMER}`),

  // ───────────────────────── 2. Janela de sono por idade ─────────────────────────
  A('wake-windows-by-age',
    'Janela de sono do bebê por idade: tabela mês a mês',
    'Janela de sono do bebê de 0 a 12 meses: tabela mês a mês com tempo acordado e número de sonecas, sinais de sono e quando falar com o pediatra.',
    ['janela de sono bebê', 'janela de vigília', 'quantas sonecas o bebê faz', 'rotina do bebê por mês', 'sono do bebê por idade'],
    {
      mes: {
        caption: 'Faixas práticas, não uma norma oficial. Para prematuros, use a idade corrigida.',
        headers: ['Idade', 'Janela de sono (tempo acordado)', 'Sonecas por dia', 'O que esperar'],
        rows: [
          ['0 a 4 semanas', '35 a 60 min', '6 a 8, curtas e irregulares', 'Mama, fica um pouquinho acordado e dorme de novo'],
          ['1 mês', '45 a 75 min', '5 a 7', 'Dia e noite ainda misturados'],
          ['2 meses', '1h a 1h30', '4 a 6', 'Primeiros sorrisos, mais tempo alerta'],
          ['3 meses', '1h15 a 1h45', '4 a 5', 'Sonecas de 30 a 45 min são comuns'],
          ['4 meses', '1h30 a 2h', '3 a 4', 'Fase da regressão do sono dos 4 meses'],
          ['5 meses', '2h a 2h30', '3', 'Sonecas começam a se organizar'],
          ['6 meses', '2h a 2h45', '3 (alguns já em 2)', 'Começa a introdução alimentar'],
          ['7 meses', '2h30 a 3h', '2 a 3', 'Transição de 3 para 2 sonecas'],
          ['8 meses', '2h30 a 3h15', '2', 'Ansiedade de separação pode atrapalhar'],
          ['9 meses', '2h45 a 3h30', '2', 'Engatinhar e ficar de pé "treinam" no berço'],
          ['10 meses', '3h a 3h45', '2', 'Dia de duas sonecas bem previsível'],
          ['11 meses', '3h a 4h', '2', 'Algumas recusas de soneca são normais'],
          ['12 meses', '3h a 4h', '2 (a maioria)', 'A passagem para 1 soneca costuma vir depois de 1 ano'],
        ],
      },
      dia: {
        caption: 'Exemplos de um dia com acordar às 7h. Os horários são ilustrativos; desloque o dia inteiro se a família dorme mais tarde.',
        headers: ['Idade', 'Sonecas (exemplo)', 'Hora de dormir', 'Janelas usadas'],
        rows: [
          ['4 meses (4 sonecas)', '8h45, 11h30, 14h15 e uma curta às 16h45', '19h', 'Cerca de 1h45'],
          ['6 meses (3 sonecas)', '9h, 12h15 e uma curta às 16h', '19h', '2h a 2h20'],
          ['9 meses (2 sonecas)', '9h45 e 14h15', '19h', '2h45 a 3h15'],
          ['12 meses (2 sonecas)', '10h e 14h30', '19h30', '3h a 3h30'],
        ],
      },
    },
`**Janela de sono, ou janela de vigília, é o tempo que o bebê aguenta ficar acordado entre um sono e outro. Vai de 35 a 60 minutos no recém-nascido a 3 ou 4 horas perto de 1 ano, enquanto as sonecas caem de 6 a 8 por dia para 2. É uma referência prática: os sinais de sono do bebê valem mais que o relógio.**
Sabe aquele choro do fim da tarde que nada resolve, nem peito, nem fralda, nem arroto? Muitas vezes o bebê só passou do ponto: ficou acordado tempo demais e agora está cansado demais para dormir.
Neste guia, você encontra a tabela mês a mês de 0 a 12 meses, quantas sonecas o bebê faz em cada idade, os sinais de sono e quando conversar com o pediatra. Em Portugal, o termo mais usado é janela de vigília, e a soneca é a sesta, mas a lógica é a mesma.
## O que é janela de sono do bebê?
A janela de sono é o intervalo entre o bebê acordar e voltar a dormir, contando mamada, troca de fralda, colo e brincadeira. Quando você começa a acalmar o bebê perto do fim dessa janela, o sono vem com mais facilidade. Quando ela passa muito do ponto, o bebê briga com o sono, chora mais e costuma acordar mais vezes.
Janela de sono e janela de vigília são a mesma coisa.
Um aviso honesto antes da tabela: **não existe uma tabela oficial de janelas de sono.** Nem o Ministério da Saúde nem a Sociedade Brasileira de Pediatria (SBP) publicam números de tempo acordado por mês. As faixas abaixo são usadas na prática por pais, consultoras de sono e apps, e funcionam como ponto de partida.
O que as referências dizem é coerente com elas. No documento sobre higiene do sono, o Departamento de Medicina do Sono da SBP explica que, até cerca de dois meses, o bebê tem um ciclo de sono e vigília desorganizado e acorda mais ou menos a cada três horas para mamar e ser cuidado. Com o tempo, o sono da noite vai prevalecendo e os cochilos diurnos diminuem. A SBP também orienta que o ritual de dormir comece quando os pais percebem os sinais de sonolência. Já a Academia Americana de Pediatria (AAP) adota a recomendação de 12 a 16 horas de sono a cada 24 horas, somando noite e sonecas, entre 4 e 12 meses.
## Janela de sono do bebê por idade: tabela mês a mês
[[TABLE:mes]]
Três detalhes que a tabela não mostra:
- **A primeira janela do dia costuma ser a mais curta.** Muitos bebês estão prontos para a primeira soneca pouco depois de acordar. Ao longo do dia, as janelas tendem a se alongar um pouco.
- **Bebês prematuros seguem a idade corrigida.** Um bebê de 4 meses que nasceu dois meses antes se comporta, no sono, mais como um de 2 meses. A Caderneta da Criança também usa a idade corrigida para acompanhar o desenvolvimento dos prematuros.
- **Há bebês "dorminhocos" e bebês "ligados".** Alguns precisam de janelas no limite de baixo da faixa; outros aguentam o limite de cima. Ajuste de 10 a 15 minutos por vez e observe por alguns dias.
## Janela de sono do recém-nascido (0 a 2 meses)
Nas primeiras semanas, a janela é curtíssima: de 35 a 60 minutos. Na prática, o recém-nascido mama, fica um pouquinho acordado olhando para você e já dorme de novo. Muitas vezes a mamada sozinha ocupa metade da janela.
Nessa fase, a prioridade é a alimentação, não o horário. O Ministério da Saúde lembra que os bebês não têm horário certo para mamar e costumam mamar muitas vezes, de dia e de noite, principalmente nos primeiros meses. Não estique o intervalo entre mamadas para "encaixar" uma soneca.
Para ajudar o bebê a separar o dia da noite, deixe a luz natural entrar durante o dia e mantenha a casa em penumbra à noite, com voz baixa nas mamadas da madrugada. Se o recém-nascido dorme tanto que é difícil acordá-lo para mamar, ou molha poucas fraldas, fale com o pediatra: veja quantas são esperadas em [quantas fraldas o recém-nascido usa por dia](${L('how-many-wet-diapers-newborn')}).
## Janela de sono do bebê de 3 e 4 meses
Entre 3 e 4 meses, as janelas passam de 1h15 para perto de 2 horas, e o bebê começa a fazer de 3 a 4 sonecas. Sonecas curtas, de 30 a 45 minutos, são muito comuns nessa idade e não significam que algo está errado.
É também a época da regressão do sono dos 4 meses, a crise do sono: o sono amadurece, o bebê acorda mais entre um ciclo e outro, e a rotina pode desandar por algumas semanas. Janelas adequadas evitam somar cansaço a essa fase.
## Janela de sono do bebê de 5 e 6 meses
Com 5 e 6 meses, a janela fica entre 2 e 2h45, e a maioria dos bebês faz 3 sonecas: duas mais longas e uma curta no fim da tarde. Aos 6 meses começa a introdução alimentar, que mexe na rotina: encaixe as refeições na parte acordada da janela, não logo antes de dormir.
Entre 6 e 8 meses, muitos bebês começam a recusar a terceira soneca. Se o bebê demora muito para dormir à tarde ou a hora de dormir à noite vira uma batalha, pode ser o sinal de que está na hora de passar para 2 sonecas, com janelas um pouco mais longas.
## Janela de sono do bebê de 7 a 9 meses
Dos 7 aos 9 meses, as janelas ficam entre 2h30 e 3h30, e o dia se organiza em 2 sonecas, uma de manhã e outra à tarde. O bebê senta, engatinha e fica de pé no berço, e a ansiedade de separação pode dificultar o adormecer. Rituais curtos e previsíveis ajudam mais do que estender a janela para "cansar" o bebê.
## Janela de sono do bebê de 10 a 12 meses
Perto de 1 ano, a janela chega a 3 a 4 horas, e a maioria dos bebês ainda faz 2 sonecas. A passagem para uma soneca só costuma acontecer depois do primeiro aniversário, muitas vezes entre 12 e 18 meses. Não tenha pressa: cortar a soneca da manhã cedo demais costuma gerar um bebê exausto no fim do dia.
## Quantas sonecas o bebê faz por idade? Exemplos de rotina
A segunda tabela mostra como as janelas viram um dia real. Os horários consideram um bebê que acorda às 7h.
[[TABLE:dia]]
No Brasil, muitas famílias colocam o bebê para dormir entre 20h e 21h. Tudo bem: o que importa é o tamanho das janelas. Se o bebê acorda às 8h, desloque o dia inteiro uma hora.
## Sinais de sono: como saber que a janela está fechando
O relógio deixa você perto; os sinais do bebê deixam você no ponto certo.
- **Sinais precoces:** bocejos, olhar parado ou perdido, menos movimento, bebê mais quieto, perda de interesse pelos brinquedos.
- **Sinais tardios:** sobrancelhas avermelhadas, esfregar os olhos, puxar a orelha, mãos fechadas, choramingo.
- **Passou do ponto:** choro forte, corpo arqueado, agitação de "segundo fôlego", como se o bebê tivesse ganhado energia.
O ideal é começar a desacelerar nos sinais precoces: diminuir a luz, trocar a fralda, uma música calma, o colo. A SBP sugere colocar a criança no berço ainda acordada, mas sonolenta, sempre que possível.
[[CTA||Registre cada soneca com um toque e veja as janelas do seu bebê na linha do tempo do MamaBee]]
## Erros comuns com a janela de sono
- **Manter o bebê acordado para ele "cansar" e dormir melhor à noite.** Costuma dar o efeito contrário: bebês cansados demais dormem pior e acordam mais.
- **Ignorar os sinais porque o relógio diz que ainda é cedo.** Em dias de vacina, calor, passeio ou dente nascendo, as janelas encurtam.
- **Tratar a tabela como lei.** A faixa é ponto de partida. O seu bebê é quem dá a palavra final.
## Janela de sono e sono seguro
Acertar a janela não muda as regras de sono seguro, que valem para todas as sonecas, inclusive as do carrinho e as da casa da avó. A orientação da SBP e da Caderneta da Criança é colocar o bebê para dormir de barriga para cima, no berço, com colchão firme e sem travesseiros, protetores, cobertores soltos ou bichinhos. Evite dormir com o bebê no sofá ou na poltrona.
À noite, a SBP recomenda que, ao cuidar da criança, os pais usem luz fraca, falem baixo e sejam breves, sem estimular o bebê.
## Quando falar com o pediatra sobre o sono do bebê
Variações na janela são normais. Converse com o pediatra, na consulta de puericultura ou antes dela, se:
- o recém-nascido dorme tanto que é difícil acordá-lo para mamar;
- o bebê ronca alto com frequência, faz pausas na respiração ou respira com esforço durante o sono;
- o sono muda de repente junto com febre, recusa das mamadas, vômitos ou um choro diferente do normal;
- o bebê não está ganhando peso como esperado;
Em caso de dificuldade para respirar, lábios arroxeados ou bebê muito difícil de acordar, procure atendimento de urgência ou ligue para o SAMU (192). Em Portugal, ligue para o SNS 24 (808 24 24 24) ou, em emergência, para o 112.
## Como o MamaBee ajuda a encontrar a janela do seu bebê
No MamaBee, você registra o sono com um toque e um cronômetro, junto com mamadas e fraldas, e vê na linha do tempo quanto tempo o bebê ficou acordado entre um sono e outro. Os resumos de 7 dias mostram o total de sono por dia, de graça e sem anúncios. Se vocês dividem os cuidados, 2 cuidadores sincronizam em tempo real, com os dois no iPhone.
No Premium (R$ 29,90 por mês ou R$ 299,90 por ano na App Store brasileira), o Sleep Coach usa o histórico de sono do seu bebê para prever a próxima janela de soneca. Se a previsão de sono é tudo o que você procura, compare com o Napper, o especialista da categoria, em [Napper é bom? Napper vs MamaBee](${L('napper-vs-mamabee')}). E para ver outras opções, confira o nosso [comparativo de aplicativos para bebê](${L('best-baby-tracker-apps-compared')}), incluindo o [Bebê+ da Philips](${L('mamabee-vs-baby-plus-philips')}).
## Perguntas frequentes
### Qual é a janela de sono de um bebê de 2 meses?
Com 2 meses, a maioria dos bebês fica acordada de 1 hora a 1h30 entre um sono e outro e faz de 4 a 6 sonecas por dia. É uma faixa prática, não uma regra: comece a acalmar o bebê nos primeiros bocejos.
### Quantas sonecas um bebê de 6 meses faz?
Em geral, 3 sonecas por dia, com janelas de 2 a 2h45. Entre 6 e 8 meses, muitos bebês passam para 2 sonecas; o sinal costuma ser a recusa da terceira soneca ou uma hora de dormir difícil.
### Janela de sono e janela de vigília são a mesma coisa?
Sim. Os dois nomes descrevem o tempo que o bebê fica acordado entre um sono e outro. Em Portugal, janela de vigília é o termo mais comum, e a soneca é chamada de sesta.
### O que acontece se o bebê passar da janela de sono?
Ele tende a ficar cansado demais, chora mais e tem mais dificuldade para dormir, além de acordar mais vezes. Se isso acontecer, reduza os estímulos: quarto escuro, colo, balanço suave e voz baixa.
### Devo acordar o bebê da soneca?
Às vezes. Encurtar uma soneca muito longa no fim da tarde ajuda a proteger o sono da noite, como orienta a SBP. No recém-nascido, acordar para mamar só deve ser rotina se o pediatra orientar, por exemplo quando o ganho de peso preocupa.
## Resumindo
A janela de sono vai de 35 a 60 minutos no recém-nascido a 3 ou 4 horas perto de 1 ano, e as sonecas caem de 6 a 8 para 2 por dia. Use a tabela como ponto de partida, confie nos sinais de sono do seu bebê e comece a desacelerar antes do choro de cansaço. Nenhum órgão oficial publica uma tabela de janelas, então ajuste com calma e converse com o pediatra se algo parecer fora do normal.
[[CTA||Baixe o MamaBee grátis: sono, mamadas e fraldas em um toque, sem anúncios, e o Sleep Coach quando você quiser]]
Fontes: ${SRC.sbpSono}; ${SRC.aapHoras}; ${SRC.aapSonoBebe}; ${SRC.aleitamento}; ${SRC.caderneta}; ${SRC.sns24Crianca}.
Revisado em ${DATA}. As faixas de janela de sono são uma referência prática, não uma recomendação oficial. ${DISCLAIMER}`),

  // ───────────────────────── 3. Quantas fraldas o recém-nascido usa por dia ─────────────────────────
  A('how-many-wet-diapers-newborn',
    'Quantas fraldas o recém-nascido usa por dia? Xixi e cocô',
    'Quantas fraldas o recém-nascido molha e suja por dia, dia a dia, quantos pacotes comprar, cores do xixi e do cocô e quando procurar o pediatra.',
    ['quantas fraldas o recém-nascido usa por dia', 'xixi do recém-nascido', 'cocô do bebê', 'fezes do recém-nascido', 'quantas fraldas comprar'],
    {
      dias: {
        caption: 'Mínimos esperados a cada 24 horas no aleitamento materno. Mais do que isso é normal.',
        headers: ['Idade', 'Fraldas com xixi', 'Fraldas com cocô', 'Como é o cocô'],
        rows: [
          ['1º dia', '1 ou mais', '1 ou mais', 'Preto ou verde-escuro, grosso e grudento (mecônio)'],
          ['2º dia', '1 a 2 ou mais', '1 ou mais', 'Ainda escuro e grudento'],
          ['3º dia', '3 ou mais, mais pesadas', '2 ou mais', 'Em transição: marrom, verde ou amarelo, mais mole'],
          ['4º dia', '3 ou mais', '2 ou mais', 'Esverdeado a amarelo'],
          ['5º e 6º dias', '5 ou mais', '2 a 4 ou mais', 'Amarelo, mole, pode ser bem líquido'],
          ['7º dia até 4 semanas', '6 ou mais, bem molhadas', '3 a 4 ou mais (muitos bebês fazem a cada mamada)', 'Amarelo-mostarda, mole, com grumos'],
        ],
      },
      compra: {
        caption: 'Estimativas para planejar as compras. Cada bebê é diferente; confira a faixa de peso na embalagem da sua marca.',
        headers: ['Fase', 'Trocas por dia', 'Fraldas por mês', 'Tamanho mais comum'],
        rows: [
          ['1º mês', '8 a 12', '240 a 360', 'RN ou P, conforme o peso'],
          ['1 a 3 meses', '7 a 10', '210 a 300', 'P, depois M'],
          ['3 a 6 meses', '6 a 8', '180 a 240', 'M'],
          ['6 a 12 meses', '5 a 7', '150 a 210', 'M ou G'],
        ],
      },
    },
`**O recém-nascido costuma molhar 1 fralda no 1º dia, cerca de 3 no 3º dia e 5 ou mais no 5º dia. Depois da primeira semana, o esperado são 6 ou mais fraldas bem molhadas por dia. Somando xixi e cocô, o bebê usa em média de 8 a 12 fraldas por dia no primeiro mês.**
A fralda é a única parte da mamada que dá para ver: você não sabe quantos mililitros o bebê tirou do peito, mas consegue contar o que sai. Por isso o pediatra pergunta das fraldas em toda consulta das primeiras semanas.
Aqui você encontra a contagem dia a dia, quantas fraldas comprar, as cores normais do xixi e do cocô, a escala de cores de fezes da Caderneta da Criança e quando procurar o pediatra.
## Quantas fraldas o recém-nascido usa por dia?
São dois números diferentes:
- **Fraldas molhadas, o sinal de que o bebê mama bem.** Começam baixas e sobem dia a dia na primeira semana, até chegar a 6 ou mais por dia.
- **Trocas de fralda, o que você vai gastar.** No primeiro mês, ficam entre 8 e 12 por dia, porque muitas trocas acontecem a cada mamada, e o bebê também faz cocô com frequência.
Os números de fraldas molhadas são mínimos. Mais é sempre bem-vindo. O mais importante é a tendência: a contagem deve subir durante a primeira semana e depois se manter.
## Xixi e cocô por dia: tabela da primeira semana
[[TABLE:dias]]
A conta segue mais ou menos a idade do bebê em dias nos primeiros dias: uma fralda molhada no 1º dia, três no 3º dia, cinco no 5º dia. A partir de 5 a 7 dias de vida, a Academia Americana de Pediatria (AAP) espera 6 ou mais fraldas molhadas por dia, com xixi quase transparente ou amarelo-claro, junto com pelo menos 8 a 12 mamadas em 24 horas.
Conte as 24 horas inteiras, não "desde o café da manhã". As fraldas da madrugada entram na conta, e é aí que mais se perde o fio quando duas pessoas fazem as trocas.
## Quantas fraldas molhadas no 1º, 2º e 3º dia?
- **1º dia:** uma ou duas fraldas molhadas é normal. O colostro, o primeiro leite, vem em pouca quantidade e é muito concentrado.
- **2º dia:** de uma a duas ou mais. Alguns pais encontram uma mancha alaranjada, rosada ou cor de tijolo na fralda. São os uratos, cristais de um xixi muito concentrado, comuns nos primeiros dias.
- **3º dia:** a contagem deve chegar a três ou mais, e as fraldas ficam mais pesadas. É quando a descida do leite costuma acontecer. Se os cristais alaranjados continuarem depois do 3º dia, conte ao pediatra ou à equipe de amamentação, porque pode ser sinal de que o bebê ainda não está recebendo leite suficiente.
## Xixi do recém-nascido: cores e os cristais alaranjados
- **Transparente ou amarelo-claro:** o esperado depois dos primeiros dias. Sinal de boa hidratação.
- **Amarelo-escuro, com cheiro forte:** xixi concentrado. Observe as mamadas e a contagem de fraldas do dia.
- **Cristais alaranjados, rosados ou cor de tijolo:** comuns nos 2 ou 3 primeiros dias. Depois disso, avise o pediatra.
- **Um pouco de secreção com sangue na fralda de meninas, na primeira semana:** pode ser a chamada falsa menstruação, causada pelos hormônios da mãe que passaram para o bebê. Costuma ser passageira, mas comente na consulta.
- **Sangue em qualquer outra situação, ou xixi escuro que mancha a fralda:** procure o pediatra.
As fraldas descartáveis absorvem tanto que uma fralda molhada pode parecer seca. Muitas marcas têm uma faixa indicadora que muda de cor com o xixi. Outro truque usado em hospitais do Reino Unido: coloque de 2 a 4 colheres de sopa de água numa fralda limpa e sinta o peso. É mais ou menos assim que uma fralda bem molhada fica.
## Cocô do bebê: cores normais e a escala de cores da Caderneta
O cocô muda rápido na primeira semana, e a cor conta muito:
- **Dias 1 e 2:** mecônio, preto ou verde-escuro, grudento como piche, pelo menos uma vez por dia.
- **Dias 3 e 4:** fezes de transição, marrons, verdes ou amarelas, cada vez mais moles, pelo menos duas vezes por dia.
- **A partir do 5º dia:** no aleitamento materno, amarelo-mostarda, mole e com grumos, como sementinhas. A AAP fala em pelo menos 3 a 4 por dia entre 5 e 7 dias de vida.
- **Verde:** costuma ser normal se o bebê está bem, mama bem e ganha peso.
- **Bebês de fórmula:** o cocô costuma ser mais pastoso, amarelo-acastanhado ou esverdeado e com cheiro mais forte.
A Caderneta da Criança traz uma **escala de cores das fezes**, incluída por especialistas da SBP em parceria com o Ministério da Saúde. Ela ajuda a reconhecer fezes muito claras, brancas, acinzentadas ou amarelo-palha, que podem indicar um problema no fígado e nas vias biliares, como a atresia de vias biliares. Esse problema precisa ser descoberto cedo. Compare o cocô do bebê com a escala e **procure o pediatra no mesmo dia** se as fezes estiverem claras, principalmente se o bebê continuar amarelinho (com icterícia) depois de 2 semanas de vida ou se o xixi estiver escuro.
Também vale ligar para o pediatra se o cocô continuar preto e grudento no 4º ou 5º dia, se tiver sangue ou se ficar muito líquido e frequente de repente.
[[CTA||Registre xixi, cocô, fralda mista ou seca com um toque no MamaBee]]
## Quantas fraldas comprar? Pacotes por tamanho
Para o enxoval e o chá de fraldas, a tabela abaixo ajuda a estimar o consumo.
[[TABLE:compra]]
Para transformar em pacotes, divida pela quantidade de fraldas do pacote que você costuma comprar. Se o pacote tem 40 unidades, por exemplo, um mês de recém-nascido gasta de 6 a 9 pacotes.
Algumas dicas de quem já passou por isso:
- **Não estoque muita fralda RN.** Muitos bebês nascem perto do limite de peso do tamanho RN ou crescem rápido e passam para o P em poucas semanas. Um ou dois pacotes de RN costumam bastar para começar.
- **Peça tamanhos maiores no chá de fraldas.** O P e o M são usados por muito mais tempo. A faixa de peso de cada tamanho muda de marca para marca, então confira a embalagem.
- **Sinal de que a fralda ficou pequena:** marcas vermelhas na coxa ou na cintura e vazamentos frequentes.
- **Fraldas de pano reutilizáveis:** a contagem de trocas por dia é parecida ou um pouco maior.
## Peito ou fórmula: muda alguma coisa?
A meta de fraldas molhadas depois da primeira semana é a mesma: 6 ou mais por dia. Bebês em aleitamento materno podem molhar menos fraldas nos dois ou três primeiros dias, porque o colostro vem em pouca quantidade e o volume de leite aumenta aos poucos. O Ministério da Saúde lembra que, nos primeiros meses, os bebês mamam muitas vezes, de dia e de noite, sem horário fixo.
O cocô é onde os dois grupos mais diferem. Como ele varia muito, a contagem de fraldas molhadas é o termômetro mais confiável do dia a dia para os dois. Depois das primeiras semanas, alguns bebês em aleitamento materno exclusivo passam a fazer cocô com menos frequência, às vezes com dias de intervalo. Se o cocô vem mole e o bebê está bem e ganhando peso, isso costuma ser normal, mas confirme com o pediatra.
## Sinais de desidratação no bebê
A AAP lista estes sinais de alerta de desidratação leve a moderada em bebês:
- menos de seis fraldas molhadas por dia;
- boca seca;
- menos lágrimas ao chorar;
- moleira afundada;
- bebê brincando ou interagindo menos que o normal.
Sinais de desidratação grave incluem bebê muito irritado ou sonolento demais, olhos fundos, mãos e pés frios e manchados, pele enrugada e xixi só uma ou duas vezes por dia. A orientação da AAP é avisar o pediatra imediatamente se qualquer um desses sinais aparecer.
## Quando procurar o pediatra por causa das fraldas
Ligue para o pediatra ou procure a unidade de saúde no mesmo dia se:
- o bebê molha ou suja menos fraldas do que a tabela indica para a idade;
- depois da primeira semana, são menos de seis fraldas molhadas em 24 horas;
- os cristais alaranjados continuam depois do 3º dia;
- o cocô ainda está preto e grudento no 4º ou 5º dia;
- as fezes estão claras, brancas ou acinzentadas na escala da Caderneta;
- o bebê está sonolento demais para acordar para as mamadas ou mama menos de 8 vezes em 24 horas;
- aparece qualquer sinal de desidratação.
Procure atendimento de urgência se o bebê estiver muito difícil de acordar, com mãos e pés frios e manchados, ou tiver feito xixi só uma ou duas vezes no dia. No Brasil, o SAMU atende pelo 192. Em Portugal, o SNS 24 atende pelo 808 24 24 24, e o número de emergência é o 112.
A primeira consulta do bebê deve acontecer já na primeira semana de vida, e o peso conferido ali é a outra metade da resposta à pergunta "ele está mamando o suficiente?".
## Como registrar as fraldas ajuda
No MamaBee, você registra fralda com xixi, cocô, mista ou seca com um dedo só. Fralda mista conta como xixi e como cocô, então a contagem de molhadas continua certa. A linha do tempo mostra as fraldas do dia ao lado das mamadas, para você ver de relance se está tudo no caminho. Se você e o parceiro fazem as trocas, 2 cuidadores sincronizam de graça em tempo real, com os dois no iPhone. Antes da consulta, exporte um PDF dos últimos dias para o pediatra ver números reais em vez de palpites. Tudo isso no plano grátis, sem anúncios.
Os dados ficam no seu iPhone, a menos que você ative o compartilhamento, e nunca são vendidos. Se você ainda está escolhendo um app, veja o nosso [comparativo de aplicativos para bebê](${L('best-baby-tracker-apps-compared')}), a comparação entre [Meu Bebê e MamaBee](${L('mamabee-vs-meu-bebe')}) e entre [Bebê+ e MamaBee](${L('mamabee-vs-baby-plus-philips')}). E quando as fraldas estiverem em ordem e o desafio passar a ser o sono, a nossa [tabela de janela de sono por idade](${L('wake-windows-by-age')}) ajuda a acertar a hora das sonecas.
## Perguntas frequentes
### Quantas fraldas o recém-nascido usa por dia?
No primeiro mês, de 8 a 12 trocas por dia. Dessas, o esperado é 1 fralda molhada no 1º dia, cerca de 3 no 3º dia, 5 ou mais no 5º dia e 6 ou mais bem molhadas por dia depois da primeira semana.
### Quantas vezes o recém-nascido faz cocô por dia?
Pelo menos uma vez por dia nos dias 1 e 2, pelo menos duas nos dias 3 e 4 e, a partir do 5º dia, várias vezes por dia. Muitos bebês em aleitamento materno fazem cocô depois de quase todas as mamadas nas primeiras semanas.
### Xixi laranja no recém-nascido é normal?
Cristais alaranjados, rosados ou cor de tijolo na fralda são comuns nos 2 ou 3 primeiros dias. Se continuarem depois disso, avise o pediatra, porque podem indicar que o bebê precisa de mais leite.
### Cocô verde no bebê é normal?
Na maioria das vezes, sim, se o bebê está bem, mama bem e ganha peso. O que pede atenção no mesmo dia são fezes muito claras, brancas ou acinzentadas, que devem ser comparadas com a escala de cores da Caderneta da Criança.
### Quantos pacotes de fralda RN devo comprar?
Um ou dois pacotes costumam bastar para começar, porque muitos bebês passam rápido para o tamanho P. Concentre o estoque e o chá de fraldas nos tamanhos P e M, conferindo a faixa de peso na embalagem.
### Quantas fraldas molhadas mostram que o bebê está mamando bem?
Depois da primeira semana, 6 ou mais fraldas bem molhadas por dia, com xixi claro, junto com 8 a 12 mamadas em 24 horas e ganho de peso nas consultas.
## Resumindo
Espere 1 fralda molhada no 1º dia, 5 ou mais no 5º dia e 6 ou mais bem molhadas por dia depois da primeira semana. Confira se o cocô fica amarelo até o 5º dia, compare as fezes com a escala de cores da Caderneta e ligue para o pediatra se a contagem cair ou aparecerem sinais de desidratação. Para as compras, conte com 8 a 12 trocas por dia no primeiro mês e não exagere no tamanho RN.
[[CTA||Baixe o MamaBee grátis: fraldas e mamadas em um toque, sem anúncios, e um PDF pronto para o pediatra]]
Fontes: ${SRC.aapLeite}; ${SRC.aapDesidratacao}; ${SRC.caderneta}; ${SRC.aleitamento}; ${SRC.sns24Crianca}.
Revisado em ${DATA}. ${DISCLAIMER}`),
]

await saveDrafts('pt-br', articles)
