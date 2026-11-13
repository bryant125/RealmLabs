// Wave-1 pt-BR MamaBee articles (hreflang pt-BR + pt). DRAFTS only.
// Prices/ratings verified on the Brazilian App Store (apps.apple.com/br + iTunes lookup country=br)
// and napper.app/pt/pricing on 2026-11-13. PT € prices checked on apps.apple.com/pt the same day.
// Run: set -a && source .env && set +a && node scripts/intl-wave1-pt-br.mjs
import {A, saveDrafts} from './lib/intl-draft.mjs'

const L = (slug) => `/mamabee/pt-br/articles/${slug}`
const DATA = '13 de novembro de 2026'

const SRC = {
  caderneta: '[Caderneta da Criança, Ministério da Saúde](https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta)',
  vacinas: '[Calendário de Vacinação, Ministério da Saúde](https://www.gov.br/saude/pt-br/vacinacao/calendario)',
  aleitamento: '[Aleitamento materno, Ministério da Saúde](https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/aleitamento-materno)',
  oms: '[Padrões de crescimento infantil da OMS](https://www.who.int/tools/child-growth-standards)',
  boletim: '[Boletim de Saúde Infantil e Juvenil, SNS 24 (Portugal)](https://www.sns24.gov.pt/pt/servico/boletim-de-saude-infantil-e-juvenil/)',
  napperPrecos: '[Preços do Napper (napper.app)](https://napper.app/pt/pricing)',
  napperAS: '[Napper na App Store Brasil](https://apps.apple.com/br/app/id1491340863)',
  meuBebeAS: '[Meu Bebê na App Store Brasil](https://apps.apple.com/br/app/id1439575933)',
  bebeMaisAS: '[Bebê+ na App Store Brasil](https://apps.apple.com/br/app/id1093774002)',
  babyTrackerAS: '[Baby Tracker na App Store Brasil](https://apps.apple.com/br/app/id779656557)',
  blumyAS: '[Blumy na App Store Brasil](https://apps.apple.com/br/app/id6748893262)',
}
const DISCLAIMER = 'Este conteúdo é apenas informativo e não substitui a orientação médica. Em caso de dúvida sobre a saúde do seu bebê, fale com o pediatra ou procure a unidade de saúde.'

const articles = [

  // ───────────────────────── 1. Roundup ─────────────────────────
  A('best-baby-tracker-apps-compared',
    'Melhor aplicativo para bebê em 2026: 6 apps comparados',
    'Comparamos Meu Bebê, Napper, Bebê+, Baby Tracker, Blumy e MamaBee: preço em reais, anúncios, previsão de soneca e uso com o parceiro.',
    ['melhor aplicativo para acompanhar bebê', 'aplicativo para bebê recém-nascido', 'app amamentação grátis', 'app rotina bebê grátis', 'aplicativo sono do bebê'],
    {
      lado: {
        caption: `App Store brasileira, conferida em ${DATA}. Avaliações = número de notas e média.`,
        headers: ['App', 'Avaliações (BR)', 'O que é grátis', 'Plano pago (BR)', 'Android', 'Apple Watch'],
        rows: [
          ['Meu Bebê (Diário da Amamentação)', '30,5 mil (4,93)', 'Registro completo, sem anúncios', 'Não é preciso pagar (a página indica compras opcionais, sem preços)', 'Não encontramos', 'Sim'],
          ['Napper', '17,8 mil (4,96)', 'Sono diário e horário por idade', 'Napper Unlimited R$ 89,90/ano', 'Sim', 'Sim'],
          ['Bebê+ (Philips)', '10,8 mil (4,77)', 'Registro, artigos e vídeos', 'Não é preciso pagar (a página indica compras opcionais, sem preços)', 'Sim', 'Não'],
          ['Baby Tracker (Nighp)', '4,3 mil (4,85)', 'Registro completo, com anúncios', 'Sem anúncios R$ 29,90; Plus R$ 39,90/mês ou R$ 299,90/ano', 'Sim', 'Sim'],
          ['Blumy', '1,6 mil (4,86)', 'Versão limitada', 'Pro R$ 24,90/mês ou R$ 134,90 a R$ 149,90/ano; Premium R$ 29,90/mês ou R$ 239,00/ano', 'Sim', 'Não'],
          ['MamaBee', 'Novo no Brasil', 'Registro completo, sem anúncios, 2 cuidadores, PDF', 'Premium R$ 29,90/mês ou R$ 299,90/ano', 'Não', 'Não'],
        ],
      },
      custo: {
        caption: `Quanto custa o primeiro ano no plano anual (App Store Brasil, ${DATA}).`,
        headers: ['App e plano', '1 ano', 'O que o dinheiro compra'],
        rows: [
          ['Meu Bebê', 'R$ 0', 'Nada a pagar para registrar'],
          ['Bebê+', 'R$ 0', 'Nada a pagar para registrar'],
          ['MamaBee grátis', 'R$ 0', 'Registro completo, percentis, sincronização para 2, PDF'],
          ['Baby Tracker sem anúncios', 'R$ 29,90', 'Remove os anúncios'],
          ['Napper Unlimited', 'R$ 89,90', 'Previsão de sonecas, curso e sons de sono'],
          ['Blumy Pro anual', 'R$ 134,90 a R$ 149,90', 'Previsões, compartilhamento com a família, IA'],
          ['Blumy Premium anual', 'R$ 239,00', 'Plano mais completo da Blumy'],
          ['MamaBee Premium anual', 'R$ 299,90', 'Sleep Coach, Bee AI ilimitada, alergênicos, calendário vacinal completo'],
          ['Baby Tracker Plus anual', 'R$ 299,90', 'Sem anúncios e dicas de horários (What’s Next)'],
        ],
      },
    },
`**O melhor aplicativo para acompanhar bebê depende da sua rotina. O Meu Bebê é o mais popular e é gratuito. O Napper é o melhor para prever sonecas. O Baby Tracker tem Android e Apple Watch. O MamaBee reúne registro completo, compartilhamento com o parceiro e PDF para o pediatra, de graça e sem anúncios, só no iPhone.**
Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. Justamente por isso, vamos dizer com clareza quando outro aplicativo é a melhor escolha.
São 3 da manhã, o bebê está no colo e sobra um dedo livre no celular. A pergunta é sempre a mesma: foi no peito esquerdo ou no direito? A última mamada foi há uma hora e meia ou há duas? É para esse momento que existe um app de rotina do bebê, e é por ele que vale a pena julgar cada um.
Testamos os seis aplicativos que os pais brasileiros mais baixam e comparam: Meu Bebê (Diário da Amamentação), Napper, Bebê+ da Philips, Baby Tracker, Blumy e o nosso MamaBee. Todos os preços abaixo foram conferidos na App Store brasileira em ${DATA}.
## Qual é o melhor aplicativo para acompanhar bebê? A resposta curta
- **Quer só registrar, de graça e sem complicação:** Meu Bebê. São mais de 30 mil avaliações com média 4,9, e os pais repetem nas avaliações que ele é "realmente grátis".
- **O sono do bebê é o problema da casa:** Napper. A previsão de sonecas é a mais elogiada da categoria, e o plano principal custa R$ 89,90 por ano.
- **O casal tem um Android e um iPhone:** Baby Tracker ou Napper, que existem nas duas lojas.
- **Quer artigos e vídeos junto com o registro:** Bebê+, da Philips.
- **Quer um app brasileiro, com IA e foco em sono:** Blumy, com assinatura.
- **Quer registro completo sem anúncios, sincronização com o parceiro e um PDF para levar à consulta:** MamaBee, grátis no iPhone.
## Comparação lado a lado: preço, plano grátis e aparelhos
[[TABLE:lado]]
Dois detalhes importam mais do que parece. O primeiro é o aparelho do casal: se um dos dois usa Android, só Napper, Bebê+, Baby Tracker e Blumy servem para os dois. O segundo é o que fica de fora do plano grátis. No Napper e na Blumy, a previsão de sono é paga. No Baby Tracker, o grátis vem com anúncios.
## Quanto custa cada aplicativo para bebê em um ano?
[[TABLE:custo]]
Sendo direto: o MamaBee Premium está entre os planos mais caros desta lista. Se você só quer previsão de soneca, o Napper Unlimited custa bem menos. A nossa aposta é outra: tudo o que você registra todos os dias fica no plano grátis, sem anúncios e sem prazo. O Premium é para quem quer previsão de sono, IA, o teste de alergênicos e o calendário vacinal completo no mesmo app.
## Meu Bebê (Diário da Amamentação) é bom?
É, e é o líder no Brasil por bons motivos. O app do desenvolvedor Aleksei Neiman está na App Store desde 2018 e tem 30.481 avaliações com média 4,93. Registra mamadas (peito, mamadeira e papinha), extração de leite, fraldas, sono, humor, temperatura, remédios, vacinas, consultas, peso e medidas, com fotos e notas.
- **Pontos fortes:** grátis de verdade e sem anúncios, segundo as avaliações; muito simples; cronômetros para mamada e sono; widget; app para iPhone, iPad e Apple Watch.
- **O que os pais pedem:** várias avaliações recentes pedem lembretes e notificações, por exemplo para sonecas ou vitaminas.
- **Escolha se:** você quer um diário simples e gratuito e não precisa de previsão nem de relatórios.
Fizemos uma comparação completa em [Meu Bebê vs MamaBee](${L('mamabee-vs-meu-bebe')}).
## Napper é bom para o sono do bebê?
Para sono, é a referência. O Napper, criado em Estocolmo, tem 17.775 avaliações no Brasil com média 4,96. Nas avaliações, os pais dizem que ele acerta a hora da soneca "na casa do minuto". Também registra mamadas, mamadeiras e fraldas, e permite compartilhar o bebê e a assinatura com quantos cuidadores você quiser.
- **Pontos fortes:** previsão de sonecas e da hora de dormir; curso sobre sono; sons para dormir; Android e Apple Watch.
- **Pontos fracos:** o grátis se limita ao acompanhamento diário do sono e a um horário baseado na idade. Algumas avaliações reclamam que a previsão passou a ser cobrada.
- **Escolha se:** o sono é a sua maior dificuldade e você está disposto a pagar por isso.
Detalhamos preço e plano grátis em [Napper é bom? Napper vs MamaBee](${L('napper-vs-mamabee')}).
## Bebê+ da Philips: vale a pena?
O Bebê+ é mais um guia do primeiro ano do que um diário puro. Traz artigos, vídeos sobre a pega na amamentação, ruído branco e cantigas, além de registros de mamada, sono, fralda, crescimento, saúde e dentes. Tem 10.785 avaliações com média 4,77 e versão para Android.
- **Pontos fortes:** conteúdo editorial gratuito e farto; suporte a gêmeos; integração com o app Saúde.
- **Pontos de atenção:** muitas avaliações pedem um modo escuro, porque a tela clara incomoda nas mamadas da madrugada. Outras relatam registros que somem e dizem que o compartilhamento entre pai e mãe não funciona em tempo real. A última atualização na App Store é de novembro de 2025.
- **Escolha se:** você quer conteúdo semana a semana junto com o registro.
## Baby Tracker: o veterano com Android e Apple Watch
O Baby Tracker, da Nighp, existe desde 2014. Registra mamadas, sono, fraldas, extração, crescimento com os padrões da OMS, vacinas e marcos, exporta PDF e funciona no Apple Watch, com a Siri e no Android. A versão grátis tem anúncios. Para tirá-los, são R$ 29,90. A assinatura Plus (R$ 39,90 por mês ou R$ 299,90 por ano) acrescenta dicas de horário de sono, mamada e fralda.
- **Escolha se:** o casal usa celulares diferentes ou você quer Apple Watch.
## Blumy: a startup brasileira de sono
A Blumy é brasileira, foi lançada em 2025 e tem 1.589 avaliações com média 4,86. Prevê sonecas e hora de dormir, mostra saltos de desenvolvimento e tem a Blu, uma assistente com IA. Os recursos completos, incluindo o compartilhamento com a família, ficam na Blumy Pro, com teste grátis de 7 dias.
- **Escolha se:** você quer um app nacional focado em sono e rotina e aceita assinar.
## MamaBee: registro completo, grátis e sem anúncios
O MamaBee foi pensado para o uso com uma mão só, de madrugada: botões grandes na parte de baixo da tela e registro em um toque. A interface está em português.
No plano grátis, sem anúncios em nenhum plano, você tem:
- Sono, amamentação com cronômetro para o lado esquerdo e o direito, mamadeira e extração de leite, fraldas, introdução alimentar, atividades, temperatura, remédios, sintomas, consultas e registros personalizados.
- Crescimento com percentis da OMS e mais de 45 marcos do desenvolvimento do CDC americano.
- Linha do tempo, resumos dos últimos 7 dias e widgets.
- Sincronização em tempo real para 2 cuidadores (os dois precisam de iPhone).
- Exportação em CSV, JSON e um PDF para o pediatra.
O Premium acrescenta o Sleep Coach (previsão da próxima soneca), a Bee AI ilimitada, o teste de alergênicos da introdução alimentar com cronômetro de reação de 3 dias, vários bebês, mais cuidadores, análises de 30, 90 e 365 dias e o calendário vacinal completo. No grátis, o calendário vacinal mostra só os 3 primeiros meses.
Os registros ficam no seu aparelho, a menos que você ative o compartilhamento com o parceiro, e os dados nunca são vendidos.
- **Onde perdemos:** só iPhone (iOS 17.6 ou mais recente), sem Android, iPad nem Apple Watch; somos novos e ainda não temos as dezenas de milhares de avaliações dos líderes; o Premium custa mais que o Napper.
[[CTA||Experimente o MamaBee grátis: registro completo, sem anúncios, no seu iPhone]]
## O aplicativo substitui a Caderneta da Criança?
Não. A Caderneta da Criança, que toda criança nascida no Brasil recebe na alta da maternidade, é o documento oficial: nela o profissional de saúde anota crescimento, desenvolvimento e vacinas. O app serve para o dia a dia, com as mamadas, fraldas e sonecas que ninguém consegue lembrar na consulta.
Os gráficos de crescimento da Caderneta seguem as curvas da OMS, a mesma referência dos percentis do MamaBee. Já os marcos do desenvolvimento do MamaBee vêm da lista do CDC americano, que não é idêntica à da Caderneta. Na dúvida, vale o que o pediatra avalia na consulta de puericultura. As vacinas seguem o calendário do Ministério da Saúde, e o registro oficial é o da Caderneta.
## E em Portugal?
Os mesmos apps existem em Portugal, mas a App Store portuguesa mostra os preços em euros. O MamaBee aparece como "MamaBee: Diário do Bebé", com Premium a 5,99 € por mês ou 59,99 € por ano. O Napper Unlimited aparece a 35,99 €. O documento oficial é o Boletim de Saúde Infantil e Juvenil, do SNS 24.
## Como escolher em um minuto
Pergunte a si mesmo: o que está mais difícil agora?
- **O sono:** Napper, ou Blumy se preferir um app brasileiro.
- **Nada específico, só quero lembrar das coisas:** Meu Bebê.
- **O casal usa Android e iPhone:** Baby Tracker ou Napper.
- **Quero tudo num lugar só, sem anúncios, e um relatório para o pediatra:** MamaBee.
Escolha um e fique com ele. O valor de um app de rotina do bebê cresce com o tempo: seis semanas de histórico valem mais do que um app melhor instalado ontem.
## Perguntas frequentes
### Qual é o melhor aplicativo gratuito para bebê?
Para registrar sem pagar nada, o Meu Bebê (Diário da Amamentação) e o MamaBee são gratuitos e sem anúncios. O Bebê+ também é gratuito. O MamaBee inclui no grátis percentis da OMS, marcos, sincronização para 2 cuidadores e PDF para o pediatra.
### Existe app de rotina do bebê sem anúncios?
Sim. O Meu Bebê não exibe anúncios, segundo as avaliações dos usuários, e o MamaBee não tem anúncios em nenhum plano. O Baby Tracker mostra anúncios na versão grátis e cobra R$ 29,90 para removê-los.
### Qual aplicativo para bebê o pai e a mãe podem usar juntos?
Meu Bebê, Napper, Blumy (no plano Pro), Baby Tracker e MamaBee permitem que mais de um cuidador registre. No MamaBee, 2 cuidadores sincronizam de graça em tempo real, mas os dois precisam de iPhone. Se um usa Android, prefira Napper ou Baby Tracker.
### O aplicativo substitui a Caderneta da Criança?
Não. A Caderneta é o registro oficial de crescimento, desenvolvimento e vacinas, preenchido pelo profissional de saúde. O app complementa com a rotina diária e ajuda a responder às perguntas do pediatra.
### O Napper é pago?
Em parte. O Napper tem uma versão grátis com acompanhamento diário do sono e horário por idade. A previsão personalizada, o curso e os sons exigem o Napper Unlimited, que custa R$ 89,90 por ano na App Store brasileira.
## Resumindo
Não existe um único melhor aplicativo para bebê. O Meu Bebê é o diário gratuito mais querido do Brasil. O Napper é o especialista em sono. O Baby Tracker e o Napper atendem casais com Android. O Bebê+ traz conteúdo. A Blumy é a aposta nacional em sono com IA. O MamaBee é o app completo, gratuito e sem anúncios para quem usa iPhone e quer levar um relatório pronto para a consulta.
[[CTA||Baixe o MamaBee grátis: um toque para registrar, sem anúncios, e os dados do seu bebê ficam com você]]
Fontes: ${SRC.caderneta}; ${SRC.vacinas}; ${SRC.oms}; ${SRC.boletim}; ${SRC.meuBebeAS}; ${SRC.napperAS}; ${SRC.bebeMaisAS}; ${SRC.babyTrackerAS}; ${SRC.blumyAS}; ${SRC.napperPrecos}.
Preços, avaliações e recursos conferidos na App Store do Brasil e de Portugal em ${DATA}, e podem mudar. ${DISCLAIMER}`),

  // ───────────────────────── 2. Napper vs MamaBee ─────────────────────────
  A('napper-vs-mamabee',
    'Napper é bom? Napper vs MamaBee: preço e diferenças em 2026',
    'Napper é bom e vale o preço? Comparamos o Napper com o MamaBee: o que é grátis, preços em reais na App Store e para quem cada app faz mais sentido.',
    ['napper é bom', 'napper é pago', 'napper app', 'previsão de soneca', 'aplicativo sono do bebê'],
    {
      lado: {
        caption: `App Store Brasil e napper.app, conferidos em ${DATA}.`,
        headers: ['', 'Napper', 'MamaBee'],
        rows: [
          ['Avaliações na App Store (BR)', '17,8 mil, média 4,96', 'Novo no Brasil'],
          ['Foco', 'Sono do bebê', 'Registro completo do bebê'],
          ['O que é grátis', 'Acompanhamento diário do sono e horário baseado na idade', 'Sono, mamadas, fraldas, crescimento, saúde, marcos, sincronização para 2 e exportação'],
          ['Plano pago', 'Napper Unlimited R$ 89,90/ano', 'Premium R$ 29,90/mês ou R$ 299,90/ano'],
          ['Teste grátis', '7 dias', 'Não é preciso: o núcleo é grátis'],
          ['Previsão de soneca', 'Sim, personalizada (pago)', 'Sleep Coach (Premium)'],
          ['Curso e sons de sono', 'Sim', 'Não'],
          ['Assistente com IA', 'Não anunciado', 'Bee AI ilimitada (Premium)'],
          ['Cuidadores', 'Ilimitados, dividindo a assinatura', '2 grátis; mais no Premium'],
          ['Android / Apple Watch', 'Sim / Sim', 'Não / Não'],
          ['Crescimento e marcos', 'Não aparecem na página da App Store', 'Percentis da OMS e 45+ marcos do CDC, grátis'],
          ['Exportação', 'Não documentada', 'CSV, JSON e PDF para o pediatra, grátis'],
        ],
      },
      custo: {
        caption: `Custo nos planos anuais da App Store brasileira (${DATA}).`,
        headers: ['', '1 ano', '2 anos'],
        rows: [
          ['Napper grátis (sem previsão)', 'R$ 0', 'R$ 0'],
          ['Napper Unlimited', 'R$ 89,90', 'R$ 179,80'],
          ['MamaBee grátis (sem previsão)', 'R$ 0', 'R$ 0'],
          ['MamaBee Premium anual', 'R$ 299,90', 'R$ 599,80'],
        ],
      },
    },
`**Sim, o Napper é bom: é o app mais elogiado para prever sonecas, com média 4,96 em 17,8 mil avaliações no Brasil. Mas a previsão é paga, no Napper Unlimited de R$ 89,90 por ano. Se o sono é o problema, fique com o Napper. Se você quer registrar tudo de graça e sem anúncios, o MamaBee é a alternativa.**
Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. E dizemos sem rodeio: em sono, o Napper é o produto mais maduro.
O Napper nasceu em Estocolmo, em 2019, criado por um pai em licença-paternidade que queria entender o sono da filha. Hoje diz ajudar mais de 100 mil famílias. A dúvida que aparece no Google, "napper é bom?" ou "napper é pago?", na verdade esconde outra pergunta: você precisa de um especialista em sono ou de um app que registre a rotina inteira?
## Napper é bom? O que dizem as avaliações no Brasil
Lemos as 50 avaliações mais recentes da App Store brasileira. A grande maioria é de 5 estrelas, e o elogio se repete: a previsão funciona. Uma mãe escreve que o app acerta a hora de dormir e de acordar "na casa do minuto". Outra conta que, depois de alguns dias, o Napper "percebeu a janela das sonecas" do bebê. Vários pais dizem que o app recalcula sozinho conforme o bebê dorme mais ou menos.
Também há críticas, e elas ajudam a decidir:
- Uma avaliação reclama que o app passou a cobrar pela previsão logo depois do primeiro dia.
- Uma família com assinatura conta que o convite para a babá passou a dar erro e que o suporte não resolveu.
- Uma mãe sente falta de registros como passeio, banho e brincadeiras e diz que acaba usando dois apps.
- Uma avaliação de 4 estrelas diz que a previsão da hora de dormir à noite nem sempre bate.
## Napper é pago? O que é grátis e quanto custa
O Napper tem uma versão gratuita, mas ela é pequena. Pela página de preços do próprio Napper, o grátis inclui o acompanhamento diário do sono e um horário de sono baseado na idade. O Napper Unlimited libera a análise e a personalização do sono (a previsão), o curso sobre sono, os sons para dormir, tendências e estatísticas e o registro ilimitado de categorias.
Na App Store brasileira, o Napper Unlimited custa R$ 89,90, um plano anual segundo o site do Napper, com 7 dias de teste. A lista de compras do app mostra ainda outros planos, de R$ 22,90 a R$ 359,90, com nomes que não indicam o período. Confira o valor e a renovação na tela de assinatura antes de confirmar.
Em Portugal, o mesmo Napper Unlimited aparece a 35,99 € na App Store portuguesa.
## Napper vs MamaBee: comparação lado a lado
[[TABLE:lado]]
## Onde o Napper vence
- **Previsão de sono com anos de ajuste.** O algoritmo do Napper está no mercado desde 2019 e é o motivo de quase todas as avaliações positivas. O nosso Sleep Coach é mais novo.
- **Um programa de sono, não só um registro.** Curso, sons para dormir, tendências e, no iOS 27, a próxima soneca aparece até na busca do iPhone.
- **A família toda na mesma assinatura.** Pai, mãe, avós e babá podem registrar sem custo extra.
- **Android e Apple Watch.** Se um dos dois usa Android, o Napper funciona para ambos. O MamaBee não.
- **Preço da previsão.** Se você só quer saber a hora da próxima soneca, R$ 89,90 por ano é bem menos que o MamaBee Premium.
## Onde o MamaBee é diferente
- **Tudo o que você registra, grátis.** Sono com cronômetro, amamentação com lado esquerdo e direito, mamadeira e extração de leite, fraldas, introdução alimentar, temperatura, remédios, sintomas, consultas e registros personalizados. Sem limite de categorias e sem anúncios em nenhum plano.
- **Saúde e desenvolvimento no mesmo app.** Crescimento com percentis da OMS, a mesma referência das curvas da Caderneta da Criança, e mais de 45 marcos do desenvolvimento do CDC americano.
- **Sincronização para 2 cuidadores, grátis e em tempo real.** Os dois precisam de iPhone.
- **Relatório para a consulta.** Exportação em CSV, JSON e um PDF para o pediatra, sem custo.
- **Privacidade local.** Os registros ficam no seu iPhone, a menos que você ative o compartilhamento com o parceiro. Nunca vendemos dados.
No Premium, o Sleep Coach usa o histórico de sono do seu próprio bebê para prever a próxima janela de soneca. O plano também inclui a Bee AI ilimitada, o teste de alergênicos da introdução alimentar com cronômetro de reação de 3 dias, vários bebês, mais cuidadores, análises de 30, 90 e 365 dias e o calendário vacinal completo (no grátis, o calendário mostra só os 3 primeiros meses).
[[CTA||Um app grátis para mamadas, sono e saúde, com previsão de soneca quando você quiser]]
## Onde o MamaBee perde
- O Napper tem curso e sons de sono. O MamaBee não tem.
- O Napper tem Android e Apple Watch. O MamaBee é só para iPhone, com iOS 17.6 ou mais recente.
- No Napper, a assinatura cobre cuidadores ilimitados. No MamaBee, o grátis sincroniza dois; mais cuidadores exigem o Premium.
- O Napper tem anos de estrada e milhares de avaliações no Brasil. O MamaBee acabou de chegar.
- Para quem só quer previsão de soneca, o Napper sai mais barato.
## Quanto custa cada um em 1 e 2 anos?
[[TABLE:custo]]
A conta é clara: para previsão de sono, o Napper é a opção mais barata desta comparação. O MamaBee Premium custa mais porque junta outras coisas, como IA, alergênicos e o calendário vacinal completo. A diferença real está no plano grátis: o do MamaBee registra a rotina inteira, enquanto o do Napper cobre o sono.
## Napper ou MamaBee: qual escolher?
**Escolha o Napper se** o sono é a parte mais difícil dos seus dias, você quer um curso e sons para dormir, ou alguém da casa usa Android.
**Escolha o MamaBee se** você quer um único app, gratuito e sem anúncios, para mamadas, fraldas, sono, crescimento e consultas, com um PDF pronto para o pediatra. A previsão de soneca fica como opção para depois.
Dá também para usar os dois: o Napper para a soneca e o MamaBee para o resto. Uma mãe, nas avaliações do Napper, conta que já usa dois apps assim.
Se você ainda está comparando opções, veja nosso guia com [6 aplicativos para bebê comparados](${L('best-baby-tracker-apps-compared')}), incluindo Meu Bebê, Bebê+, Baby Tracker e Blumy.
Seja qual for o app, a orientação da Caderneta da Criança vale para todas as sonecas: o bebê dorme de barriga para cima, no berço, sem travesseiros nem objetos soltos. Se o sono mudar de repente junto com febre, recusa das mamadas ou choro diferente do normal, procure o pediatra.
## Perguntas frequentes
### O Napper é pago?
Em parte. A versão grátis tem acompanhamento diário do sono e horário por idade. A previsão personalizada, o curso, os sons e as estatísticas exigem o Napper Unlimited, que custa R$ 89,90 por ano na App Store brasileira, com 7 dias de teste.
### O Napper é bom para recém-nascido?
Pode ajudar, mas a previsão precisa de dados. Pelas avaliações, alguns pais começam a registrar desde o nascimento e dizem que as previsões ficam mais certeiras com o tempo. Nas primeiras semanas, o mais importante é registrar mamadas e fraldas, o que o MamaBee faz de graça.
### O Napper funciona no Android?
Sim. O Napper está na Google Play e tem app para Apple Watch. O MamaBee, por enquanto, funciona só no iPhone.
### Dá para compartilhar o Napper com o pai ou a babá?
Sim. O Napper permite compartilhar o bebê, e a assinatura, com quantos cuidadores forem necessários. O MamaBee sincroniza 2 cuidadores de graça em tempo real, desde que os dois usem iPhone.
### O MamaBee prevê sonecas como o Napper?
Sim, no Premium. O Sleep Coach prevê a próxima janela de soneca com base no histórico de sono do seu bebê. O MamaBee não tem curso nem sons de sono.
## Resumindo
O Napper é um especialista em sono muito bem avaliado, e se o sono é todo o seu problema, vale o que custa. O MamaBee é o app completo: gratuito e sem anúncios para tudo o que você registra no dia a dia, com previsão de soneca, IA e teste de alergênicos no Premium para quem quiser.
[[CTA||Baixe o MamaBee grátis: registro em um toque, sem anúncios, e os dados do seu bebê ficam com você]]
Fontes: ${SRC.napperPrecos}; ${SRC.napperAS}; ${SRC.caderneta}; ${SRC.oms}.
Preços, avaliações e recursos conferidos na App Store do Brasil e de Portugal e no site do Napper em ${DATA}, e podem mudar. ${DISCLAIMER}`),

  // ───────────────────────── 3. Meu Bebê vs MamaBee ─────────────────────────
  A('mamabee-vs-meu-bebe',
    'Meu Bebê (Diário da Amamentação) vs MamaBee em 2026',
    'Meu Bebê ou MamaBee? Comparamos os dois apps gratuitos e sem anúncios: registros, Apple Watch, uso com o parceiro, crescimento e PDF para o pediatra.',
    ['meu bebê diário da amamentação', 'app meu bebê', 'app amamentação grátis', 'diário do bebê', 'aplicativo para bebê recém-nascido'],
    {
      lado: {
        caption: `App Store Brasil, conferida em ${DATA}.`,
        headers: ['', 'Meu Bebê (Diário da Amamentação)', 'MamaBee'],
        rows: [
          ['Desenvolvedor', 'Aleksei Neiman', 'Realm Labs'],
          ['Na App Store desde', '2018', '2026'],
          ['Avaliações (BR)', '30,5 mil, média 4,93', 'Novo no Brasil'],
          ['Preço', 'Grátis (a página indica compras opcionais, sem preços)', 'Grátis; Premium opcional'],
          ['Anúncios', 'Não, segundo as avaliações', 'Nenhum, em nenhum plano'],
          ['Aparelhos', 'iPhone, iPad e Apple Watch (iOS 16+)', 'Só iPhone (iOS 17.6+)'],
          ['Android', 'Não encontramos na Google Play', 'Não'],
          ['Mamadas, extração, fraldas, sono', 'Sim, com cronômetros', 'Sim, com cronômetro por lado'],
          ['Peso e medidas', 'Sim', 'Sim, com percentis da OMS'],
          ['Marcos do desenvolvimento', 'Notas de eventos (primeiras palavras, primeira risada)', 'Lista de 45+ marcos do CDC'],
          ['Fotos', 'Sim, com seção de fotos mensais', 'Não é o foco'],
          ['Uso com o parceiro', 'Sim, segundo as avaliações', '2 cuidadores grátis, em tempo real'],
          ['Resumos e relatórios', 'Estatísticas de sono e padrões', 'Linha do tempo e resumos de 7 dias; 30/90/365 dias no Premium'],
          ['Exportação para o pediatra', 'Não aparece na página da App Store', 'CSV, JSON e PDF, grátis'],
          ['Previsão de soneca e IA', 'Não anunciadas', 'Sleep Coach e Bee AI (Premium)'],
          ['Rótulo de privacidade', 'Só "dados não vinculados a você"', 'Inclui dados usados para rastreamento e vinculados a você'],
        ],
      },
    },
`**O Meu Bebê (Diário da Amamentação) é o app de registro mais popular do Brasil: grátis, sem anúncios, simples e com Apple Watch. O MamaBee também é gratuito e sem anúncios e acrescenta percentis da OMS, lista de marcos, resumos semanais e PDF para o pediatra. Para um diário simples, o Meu Bebê basta.**
Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. O Meu Bebê é o líder do Brasil por mérito, e vamos mostrar onde ele é melhor que o nosso app.
## Qual é o app "Meu Bebê Diário da Amamentação"?
Vale esclarecer primeiro, porque há mais de um app com nome parecido na App Store. O que os pais brasileiros mais usam é o **Meu Bebê゜Diário da Amamentação**, do desenvolvedor **Aleksei Neiman**, com mais de 30 mil avaliações. Existe também o "Meu Bebê－Diário de Amamentação", da Wachanga, que é outro app. Neste artigo, falamos do primeiro.
O Meu Bebê está na App Store desde 2018 e tem 30.481 avaliações no Brasil, com média 4,93, um número que poucos apps de bebê alcançam. Registra:
- Alimentação no peito, na mamadeira ou com papinha, além dos horários de extração de leite.
- Trocas de fralda, sono, atividades, humor, choro com duração e banho.
- Temperatura, doenças, remédios, vacinas e consultas, com notas.
- Peso, comprimento e perímetro cefálico.
- Fotos e comentários, incluindo uma seção com uma foto por mês para montar a linha do tempo do primeiro ano.
## Meu Bebê Diário da Amamentação é bom?
É muito bom no que se propõe. Lemos as 50 avaliações mais recentes da App Store brasileira, quase todas de 5 estrelas. Os elogios se repetem: "realmente grátis", "sem anúncios chatos", "simples de usar" e "ideal para compartilhar com o parceiro". Uma mãe resume: "melhor opção grátis e em português".
O que os pais pedem também é consistente. Várias avaliações recentes pedem notificações e lembretes, por exemplo para avisar a hora da soneca ou das vitaminas de uso contínuo. Uma mãe não encontrou onde lançar peso e medidas, embora o app tenha esse registro.
## O que o Meu Bebê faz melhor que o MamaBee
- **Confiança comprovada.** Mais de 30 mil avaliações e sete anos de atualizações. O MamaBee chegou em 2026.
- **Apple Watch e iPad.** O Meu Bebê funciona no relógio e no tablet. O MamaBee, por enquanto, só no iPhone.
- **Celulares mais antigos.** O Meu Bebê roda a partir do iOS 16. O MamaBee pede iOS 17.6 ou mais recente.
- **Simplicidade.** Para quem só quer marcar mamada, fralda e soneca, menos telas é uma vantagem real.
- **Memórias.** A seção de fotos mensais e os registros de primeiras palavras e primeira risada fazem do Meu Bebê também um álbum.
- **Privacidade declarada mais enxuta.** No rótulo de privacidade da App Store, o Meu Bebê declara apenas "dados não vinculados a você". O rótulo do MamaBee é mais extenso: inclui identificadores e dados de uso.
## Meu Bebê vs MamaBee: comparação lado a lado
[[TABLE:lado]]
Um ponto vale para os dois: não encontramos uma versão Android do Meu Bebê na Google Play em ${DATA}, e o MamaBee também não tem Android. Se o pai ou a mãe usa Android, nenhum dos dois serve para o casal registrar junto. Nesse caso, veja o Napper ou o Baby Tracker no nosso [comparativo de aplicativos para bebê](${L('best-baby-tracker-apps-compared')}).
## Onde o MamaBee é diferente
Os dois são gratuitos e sem anúncios, então a escolha não é sobre preço. É sobre o que você quer que o app faça com os seus registros.
- **Percentis da OMS.** O MamaBee mostra em que percentil estão o peso, o comprimento e o perímetro cefálico. Os gráficos da Caderneta da Criança também seguem as curvas da OMS, então a referência é a mesma que o pediatra usa.
- **Marcos do desenvolvimento em lista.** São mais de 45 marcos do CDC americano para acompanhar por idade. A lista do CDC não é idêntica à da Caderneta; na consulta de puericultura, vale a avaliação do pediatra.
- **Resumos de 7 dias.** Quantas mamadas, quanto sono e quantas fraldas por dia, sem fazer conta de cabeça.
- **PDF para o pediatra.** Exportação grátis em PDF, CSV e JSON, para levar à consulta ou guardar.
- **Sincronização em tempo real para 2 cuidadores**, grátis, com os dois no iPhone.
O Premium, opcional, custa R$ 29,90 por mês ou R$ 299,90 por ano na App Store brasileira. Ele traz o Sleep Coach, que prevê a próxima soneca a partir do histórico do seu bebê, a Bee AI ilimitada, o teste de alergênicos da introdução alimentar com cronômetro de reação de 3 dias, vários bebês, mais cuidadores, análises de 30, 90 e 365 dias e o calendário vacinal completo. No grátis, o calendário vacinal mostra só os 3 primeiros meses. Em Portugal, os preços aparecem em euros: 5,99 € por mês ou 59,99 € por ano.
[[CTA||Quer percentis, resumos e um PDF para o pediatra? Experimente o MamaBee grátis]]
## Onde o MamaBee perde
- Não tem Apple Watch nem iPad, e exige iOS 17.6 ou mais recente.
- É novo: não tem o histórico nem as 30 mil avaliações do Meu Bebê.
- Não tem a seção de fotos mensais nem o foco em memórias.
- O rótulo de privacidade da App Store do Meu Bebê é mais enxuto que o nosso.
- Recursos como previsão de soneca e IA são pagos. Quem não quer nada disso não precisa deles.
## Vale a pena trocar o Meu Bebê pelo MamaBee?
Se você usa o Meu Bebê e está feliz, provavelmente não. O valor de um diário do bebê cresce com o histórico, e trocar no meio do caminho tem custo. Fique com ele se você só precisa lembrar a última mamada, a última fralda e a última soneca.
O MamaBee faz mais sentido em três situações:
- **Você quer chegar à consulta com dados organizados:** percentis, resumos da semana e um PDF.
- **Vocês querem dividir a madrugada:** com os dois no iPhone, o que um registra aparece na hora para o outro.
- **Está chegando a introdução alimentar:** o MamaBee registra os alimentos e, no Premium, acompanha a introdução de alergênicos com cronômetro de reação.
Se a dúvida for sono, compare também o Napper, que é o especialista da categoria: veja [Napper é bom? Napper vs MamaBee](${L('napper-vs-mamabee')}).
## O app substitui a Caderneta da Criança?
Nenhum dos dois substitui. A Caderneta da Criança é o documento oficial, entregue na alta da maternidade, com crescimento, desenvolvimento e vacinas anotados pelo profissional de saúde. Os apps registram o dia a dia. As vacinas seguem o calendário do Ministério da Saúde e precisam estar anotadas na Caderneta. Em Portugal, o equivalente é o Boletim de Saúde Infantil e Juvenil.
## Perguntas frequentes
### O app Meu Bebê Diário da Amamentação é gratuito?
Sim. É gratuito para baixar e usar, e as avaliações destacam que não é preciso pagar para registrar. A App Store indica compras opcionais dentro do app, mas não lista os preços.
### O Meu Bebê tem anúncios?
Segundo as avaliações recentes dos usuários na App Store brasileira, não. O MamaBee também não tem anúncios, em nenhum plano.
### O Meu Bebê funciona no Android?
Não encontramos uma versão Android do Meu Bebê, do desenvolvedor Aleksei Neiman, na Google Play em ${DATA}. Na App Store, ele funciona no iPhone, no iPad e no Apple Watch. O MamaBee funciona só no iPhone.
### Dá para usar o Meu Bebê com o parceiro?
Sim. Várias avaliações elogiam o compartilhamento entre os pais. No MamaBee, 2 cuidadores sincronizam de graça em tempo real, desde que os dois usem iPhone.
### Qual é melhor: Meu Bebê ou MamaBee?
Para um diário simples, gratuito e com Apple Watch, o Meu Bebê. Para percentis da OMS, marcos, resumos semanais e um PDF para o pediatra, também de graça e sem anúncios, o MamaBee.
## Resumindo
O Meu Bebê é o diário de amamentação gratuito mais querido do Brasil, e merece a fama: simples, sem anúncios e com Apple Watch. O MamaBee é a opção para quem quer que os registros virem informação: percentis da OMS, marcos, resumos e relatório para a consulta, também de graça e sem anúncios, só no iPhone.
[[CTA||Baixe o MamaBee grátis: registro em um toque, sem anúncios, e um PDF pronto para o pediatra]]
Fontes: ${SRC.meuBebeAS}; ${SRC.caderneta}; ${SRC.vacinas}; ${SRC.aleitamento}; ${SRC.oms}; ${SRC.boletim}.
Recursos, avaliações e preços conferidos na App Store do Brasil e de Portugal e na Google Play em ${DATA}, e podem mudar. ${DISCLAIMER}`),
]

await saveDrafts('pt-br', articles)
