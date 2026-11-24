// Week-15 pt-BR MamaBee articles as DRAFTS only (never published by this script):
//   the-wonder-weeks-leaps  -> "salto de desenvolvimento" / "saltos de desenvolvimento"
//   when-to-start-solids    -> "introdução alimentar"
// Both reuse the English slug so they pair as hreflang translations (_id drafts.mamabee-pt-br-<slug>,
// language 'pt-br'). Written natively for Brazil: Guia Alimentar para Crianças Brasileiras Menores
// de 2 Anos (Ministério da Saúde, 2019), SBP guides (2017 BLW, 2024 alimentação complementar,
// aspiração de corpo estranho), CDC milestones, AAP/HealthyChildren and PubMed-indexed studies.
// MamaBee prices = owner-confirmed App Store Connect list (same as intl-wave2-pt-br.mjs).
// Cover images are copied from a related published article (fallbacks in order).
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week15-pt-br.mjs
// Dry run (build + stats + link check, no writes): DRY=1 node scripts/week15-pt-br.mjs
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

const LANG = 'pt-br'
const L = (slug) => `/mamabee/pt-br/articles/${slug}`
const EN = (slug) => `/mamabee/articles/${slug}`
const PRECO = 'R$ 29,90 por mês ou R$ 299,90 por ano na App Store brasileira'

const SRC = {
  guia: '[Guia Alimentar para Crianças Brasileiras Menores de 2 Anos, Ministério da Saúde (2019)](https://portaldeboaspraticas.iff.fiocruz.br/wp-content/uploads/2019/11/guia_da_crianca_2019.pdf)',
  sbp2024: '[SBP: Alimentação complementar para o lactente saudável, Guia Prático de Atualização nº 162 (2024)](https://www.sbp.com.br/fileadmin/user_upload/24579c-GPA_-_Alim_Compl_p_Lactente_Saudavel.pdf)',
  sbpBlw: '[SBP: A alimentação complementar e o método BLW, Departamento de Nutrologia (2017)](https://www.sbp.com.br/fileadmin/user_upload/2017/05/Nutrologia-AlimCompl-Metodo-BLW.pdf)',
  sbpEngasgo: '[SBP Pediatria para Famílias: aspiração de corpo estranho](https://www.sbp.com.br/pediatria-para-familias/seguranca-e-prevencao/aspiracao-de-corpo-estranho/)',
  sbpSono: '[Higiene do Sono, Departamento Científico de Medicina do Sono da SBP (2017)](https://www.sbp.com.br/fileadmin/user_upload/19807c-DocCient_-_Higiene_do_Sono.pdf)',
  bliss: '[Fangupo e colegas, Pediatrics (2016): BLISS e risco de engasgo](https://pubmed.ncbi.nlm.nih.gov/27647715/)',
  aapAlergenos: '[AAP/HealthyChildren: introdução de alimentos alergênicos](https://www.healthychildren.org/English/healthy-living/nutrition/Pages/when-to-introduce-egg-peanut-butter-and-other-common-food-allergens-to-your-baby-food-allergy-prevention-tips.aspx)',
  cdcEngasgo: '[CDC: alimentos com risco de engasgo](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html)',
  oms: '[OMS: alimentação de lactentes e crianças pequenas](https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding)',
  caderneta: '[Caderneta da Criança, Ministério da Saúde](https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta)',
  plooij1993: '[van de Rijt-Plooij e Plooij, J Child Psychol Psychiatry (1993)](https://pubmed.ncbi.nlm.nih.gov/8444994/)',
  deWeerth1999: '[de Weerth, van Geert e Hoijtink, Developmental Psychology (1999)](https://pubmed.ncbi.nlm.nih.gov/10442878/)',
  sadurni2002: '[Sadurní e Rostan, Spanish Journal of Psychology (2002)](https://pubmed.ncbi.nlm.nih.gov/12025364/)',
  sadurni2010: '[Sadurní, Pérez Burriel e Plooij, Spanish Journal of Psychology (2010)](https://pubmed.ncbi.nlm.nih.gov/20480682/)',
  cdcMarcos: '[CDC: marcos do desenvolvimento (2 meses a 18 meses)](https://www.cdc.gov/act-early/milestones/index.html)',
  aapFebre: '[AAP/HealthyChildren: febre, quando ligar para o pediatra](https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx)',
  aapChoro: '[AAP/HealthyChildren: como responder ao choro do bebê](https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Responding-to-Your-Babys-Cries.aspx)',
  aapSacudir: '[AAP/HealthyChildren: como prevenir a síndrome do bebê sacudido](https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Abusive-Head-Trauma-Shaken-Baby-Syndrome.aspx)',
  sns24: '[Saúde da criança, SNS 24 (Portugal)](https://www.sns24.gov.pt/pt/tema/saude-da-crianca/)',
}
const DISCLAIMER = 'Este conteúdo é apenas informativo e não substitui a orientação médica. Em caso de dúvida sobre a saúde do seu bebê, fale com o pediatra ou procure a unidade de saúde.'

// Related published article whose coverImage each draft copies (fallbacks in order).
const COVERS = {
  'the-wonder-weeks-leaps': ['the-wonder-weeks-leaps', 'baby-sleep-regressions-by-age', 'baby-milestones-by-month'],
  'when-to-start-solids': ['when-to-start-solids', 'baby-led-weaning', '6-month-old-schedule'],
}

const articles = [

  // ───────────────────────── 1. Salto de desenvolvimento ─────────────────────────
  A('the-wonder-weeks-leaps',
    'Salto de desenvolvimento do bebê: tabela, sinais e ciência',
    'Salto de desenvolvimento: tabela dos 10 saltos do livro As Semanas Mágicas, sinais, o que ajuda, quando chamar o pediatra e o que a ciência mostra.',
    ['salto de desenvolvimento', 'saltos de desenvolvimento do bebê', 'tabela dos saltos de desenvolvimento', 'semanas mágicas', 'bebê chorão e grudado'],
    {
      saltos: {
        caption: 'Semanas mais citadas pelo livro e pelo app, contadas a partir da data prevista do parto (DPP). Os marcos são das listas do CDC e servem como referência de idade, não como prova da teoria.',
        headers: ['Salto', 'Semana (desde a DPP)', 'Idade aproximada', 'Tema segundo o livro', 'Marcos comuns por volta dessa idade (CDC)'],
        rows: [
          ['1', 'Semana 5', 'Pouco mais de 1 mês', 'Sensações em mudança: o bebê percebe mais o mundo', 'Até os 2 meses: acalma quando você fala com ele, olha para o seu rosto'],
          ['2', 'Semana 8', 'Quase 2 meses', 'Padrões', 'Aos 2 meses: sorri quando você sorri, levanta a cabeça de bruços'],
          ['3', 'Semana 12', 'Cerca de 3 meses', 'Transições suaves', 'Até os 4 meses: arrulha ("aaah", "oooo"), leva as mãos à boca'],
          ['4', 'Semana 19', 'Cerca de 4 meses e meio', 'Eventos', 'Aos 4 meses: firma a cabeça sem apoio, segura um brinquedo na mão'],
          ['5', 'Semana 26', 'Cerca de 6 meses', 'Relações (perto, longe, dentro, fora)', 'Aos 6 meses: rola de bruços para barriga para cima, reconhece pessoas conhecidas'],
          ['6', 'Semana 37', 'Cerca de 8 meses e meio', 'Categorias', 'Aos 9 meses: estranha desconhecidos, senta sem apoio'],
          ['7', 'Semana 46', 'Cerca de 10 meses e meio', 'Sequências', 'Até 1 ano: põe objetos dentro de um pote, procura o que você esconde'],
          ['8', 'Semana 55', 'Cerca de 12 meses e meio', 'Programas', 'Com 1 ano: dá tchau, fica de pé com apoio, pega coisas pequenas em pinça'],
          ['9', 'Semana 64', 'Cerca de 15 meses', 'Princípios', 'Aos 15 meses: dá alguns passos sozinho, tenta dizer 1 ou 2 palavras'],
          ['10', 'Semana 75', 'Cerca de 17 meses', 'Sistemas', 'Aos 18 meses: anda sem apoio, tenta dizer 3 ou mais palavras'],
        ],
      },
      ciencia: {
        caption: 'Resumo honesto do que os estudos mostram até hoje.',
        headers: ['O que se diz', 'O que a pesquisa mostra'],
        rows: [
          ['O bebê não se desenvolve em linha reta', 'Coerente com a pesquisa: estudos que acompanharam bebês semana a semana encontraram grande variação de choro e manha de uma semana para outra'],
          ['Fases de manha vêm antes de habilidades novas', 'Evidência limitada: aparece em estudos pequenos, de 15 a 18 bebês, em parte feitos com os próprios autores da teoria'],
          ['São 10 saltos em semanas fixas, iguais para todos', 'Não confirmado: um estudo independente da Universidade de Groningen, com 4 bebês acompanhados por 15 meses, não encontrou esse padrão'],
          ['Contar a partir da data prevista do parto', 'Faz sentido para prematuros (a pediatria usa a idade corrigida), mas não prova o calendário'],
          ['Salto causa febre, vômito ou recusa total de mamar', 'Não. Esses sinais pedem avaliação do pediatra'],
        ],
      },
    },
`**Salto de desenvolvimento é o nome popular, vindo do livro As Semanas Mágicas (The Wonder Weeks), para fases em que o bebê fica mais chorão, grudado e dorme pior pouco antes de mostrar uma habilidade nova. O livro descreve 10 saltos até cerca de 20 meses, mas estudos independentes não confirmam um calendário fixo.**
Se alguém já disse para você "calma, é salto", você conhece a ideia: o bebê passa dias chorando mais, quer colo o tempo todo, acorda mais à noite, e uma semana depois aparece rolando ou balbuciando algo novo.
A teoria é reconfortante e muitas vezes parece certeira, mas é mais polêmica, cientificamente, do que a maioria dos pais imagina. Aqui você encontra a tabela dos saltos, os sinais, o que ajuda, quando procurar o pediatra e um resumo honesto da pesquisa.
## O que é salto de desenvolvimento?
A expressão vem do trabalho do casal holandês Hetty van de Rijt e Frans Plooij, que estudaram mães e bebês e publicaram, no começo dos anos 1990, o livro Oei, ik groei! Ele virou The Wonder Weeks em inglês e As Semanas Mágicas em português, e depois ganhou um app.
Segundo o livro, todo bebê passa por 10 "saltos mentais" nos primeiros 20 meses, 8 deles no primeiro ano. Em cada salto, o cérebro passaria a perceber o mundo de um jeito novo. Isso deixaria o bebê confuso e mais carente por um tempo, até que ele aprende a usar essa nova percepção e surgem habilidades novas.
O livro resume a fase difícil em três sinais, os famosos "3 Cs" do inglês: crying, clinginess e crankiness. Em português, é o bebê mais chorão, mais grudado e mais irritado.
## Tabela dos saltos de desenvolvimento
[[TABLE:saltos]]
Três detalhes importantes sobre essa tabela:
- **A conta é feita pela data prevista do parto, não pela data de nascimento.** Um bebê que nasceu 3 semanas antes da DPP, por exemplo, chega à "semana 5" do livro com 8 semanas de vida.
- **As semanas são aproximadas.** O próprio livro e o app mostram janelas de alguns dias a algumas semanas, e a fase de manha costuma começar antes da semana indicada. Um bebê que fica manhoso duas semanas antes ou depois está dentro do normal.
- **Os marcos da última coluna são referências de idade**, tiradas das listas de marcos do CDC dos Estados Unidos. Eles aparecem com ou sem "salto", e cada bebê tem o seu ritmo. No Brasil, o pediatra acompanha o desenvolvimento com os marcos da Caderneta da Criança.
## Quais são os sinais de um salto de desenvolvimento?
Qualquer que seja a sua opinião sobre a teoria, o padrão descrito é muito familiar para quem cuida de um bebê:
- **Mais choro e manha** do que o normal, sem causa óbvia
- **Mais grude:** quer colo o tempo todo, chora quando você sai do campo de visão
- **Sono pior:** sonecas mais curtas, mais despertares à noite, dificuldade para adormecer
- **Mamadas diferentes:** quer mamar mais vezes para se acalmar, ou se distrai e mama menos
- **Mais estranhamento** de pessoas que não são da rotina
- **Depois, uma novidade:** um som novo, um jeito novo de pegar as coisas, rolar, sentar, dar tchau
Repare que nenhum desses sinais inclui febre, vômitos, diarreia ou recusa total das mamadas. Esses sinais nunca devem ser atribuídos a um salto sem que o pediatra avalie.
## O que a ciência diz sobre os saltos de desenvolvimento?
### O que os criadores da teoria encontraram
O trabalho original acompanhou 15 mães holandesas e seus bebês do nascimento até os 20 meses, com questionários e entrevistas. Os autores relataram que os conflitos entre mãe e bebê se concentravam em períodos difíceis e bem definidos, precedidos por um comportamento "regressivo" do bebê, mais choro e mais apego.
### O que outros pesquisadores encontraram
- **Universidade de Groningen (Holanda, 1998):** Carolina de Weerth e Paul van Geert acompanharam 4 duplas de mãe e bebê, semana a semana, por 15 meses, observando choro, manha e contato com a mãe. Os resultados não confirmaram o padrão de 10 períodos com data marcada. Mais tarde, de Weerth apontou o tamanho pequeno da amostra como uma possível limitação.
- **O mesmo grupo (1999):** em outra análise, encontrou muita variação de choro, manha e tempo no colo de uma semana para outra, principalmente até os 10 meses. Ou seja, os altos e baixos existem, mas isso não é o mesmo que um calendário igual para todos.
- **Catalunha (Espanha, 2002 e 2010):** pesquisadoras da Universidade de Girona acompanharam 18 bebês e encontraram 8 períodos de "regressão" no primeiro ano, parecidos com os 8 primeiros do livro. Em 2010, num estudo com Frans Plooij como coautor, relataram que esses períodos coincidiam com o surgimento de habilidades novas.
### O que isso significa na prática
[[TABLE:ciencia]]
Resumindo: os estudos são poucos, pequenos e em parte feitos pelos próprios autores, e nenhum estudo grande e independente confirmou o calendário de 10 saltos. Isso não quer dizer que a sua experiência seja imaginação. Bebês têm semanas boas e semanas difíceis, e mudanças no desenvolvimento costumam mexer com o humor e o sono. Use a tabela como um mapa aproximado, não como uma agenda.
## Salto de desenvolvimento ou regressão do sono?
São duas lentes para olhar a mesma realidade. O salto de desenvolvimento, na linguagem do livro, fala de mudanças na percepção. A regressão do sono fala do sono que piora por algumas semanas, muitas vezes junto com marcos físicos como rolar, sentar, engatinhar ou ficar de pé.
O exemplo mais conhecido é a crise do sono por volta dos 4 meses, quando o sono do bebê amadurece e ele passa a acordar mais entre um ciclo e outro. Ela coincide, mais ou menos, com o quarto salto do livro. Veja o nosso guia da [regressão do sono dos 4 meses](${EN('4-month-sleep-regression')}) e o panorama das [regressões do sono por idade](${EN('baby-sleep-regressions-by-age')}), ambos em inglês.
Não vale a pena gastar energia decidindo em qual das duas o bebê está. O cuidado é o mesmo: mais colo, rotina previsível, sono protegido e paciência.
## Outras causas de manha que vale a pena considerar
Nem toda semana difícil é salto. Antes de colocar a culpa no calendário, pense também em:
- **Cansaço acumulado:** janelas de sono longas demais deixam o bebê irritado e com sono pior. Confira as faixas da [janela de sono por idade](${L('wake-windows-by-age')}).
- **Dentes:** baba, gengiva inchada e vontade de morder tudo. Segundo a Academia Americana de Pediatria (AAP), o nascimento dos dentes não causa febre alta nem diarreia. Veja os [sinais de dentição](${EN('baby-teething-symptoms')}) (em inglês).
- **Doença:** resfriado, otite, infecção urinária. Febre nunca é sinal de salto.
- **Vacinas:** o bebê pode ficar mais manhoso por um ou dois dias depois das vacinas. Converse com a equipe da unidade de saúde sobre o que esperar.
- **Mudanças na rotina:** viagem, visitas, volta da mãe ao trabalho, começo da creche, mudança de casa.
- **Ansiedade de separação:** a partir de 8 ou 9 meses, muitos bebês choram quando você sai, e isso é um sinal de vínculo saudável. Veja o nosso guia de [ansiedade de separação](${EN('baby-separation-anxiety')}) (em inglês).
## O que ajuda durante um salto de desenvolvimento
Chame de salto, de regressão ou só de semana difícil, o apoio é o mesmo.
### Ofereça mais colo e contato
Grude é necessidade, não manha "aprendida". Colo, sling, contato pele a pele e voz calma ajudam o bebê a se reorganizar. Responder ao choro não estraga o bebê.
### Mantenha a rotina previsível
Horários parecidos para acordar, mamar, tomar banho e dormir funcionam como uma âncora quando tudo parece novo para o bebê. A SBP orienta que o ritual de dormir comece quando os pais percebem os sinais de sonolência.
### Proteja o sono
Fases de manha costumam somar cansaço ao cansaço. Comece a acalmar o bebê nos primeiros sinais de sono, como bocejos e olhar parado, e não tente "cansar" o bebê para que ele durma melhor. Nas madrugadas, a SBP orienta luz fraca, voz baixa e cuidados breves.
### Dê chance para praticar a novidade
Tempo de barriga para baixo no chão, brincadeiras de esconde-achou, conversar e cantar, oferecer objetos de texturas diferentes. O bebê costuma ficar mais calmo quando consegue usar a habilidade nova.
### Abaixe a régua e reveze
Semana difícil é semana de sobrevivência. Menos compromissos, mais ajuda. Combine turnos com quem divide os cuidados para que cada um consiga dormir um bloco maior.
### Mantenha o sono seguro, mesmo no cansaço
Bebê dorme de barriga para cima, no berço, com colchão firme e sem travesseiros, protetores ou bichinhos. Evite cochilar com o bebê no colo no sofá ou na poltrona.
## O que evitar durante um salto
- **Não sacuda o bebê, nunca.** Se o choro deixar você no limite, a AAP orienta colocar o bebê em um lugar seguro, como o berço vazio, sair por 10 a 15 minutos, respirar e pedir ajuda.
- **Não espere o calendário para agir.** Se o bebê parece doente, ligue para o pediatra, esteja ou não "em semana de salto".
- **Não compare com a tabela o tempo todo.** Se o app está gerando mais ansiedade do que alívio, deixe-o de lado e observe o bebê que está na sua frente.
- **Não mude tudo de uma vez.** Grandes mudanças, como tirar a chupeta ou o quarto novo, ficam melhores para uma semana mais tranquila.
## Quando procurar o pediatra
Fale com o pediatra ou procure a unidade de saúde se o bebê:
- tem menos de 3 meses e febre de 38 °C ou mais: procure atendimento imediatamente, como orienta a AAP;
- tem febre em qualquer idade e parece muito doente, prostrado ou difícil de acordar;
- tem um choro diferente do habitual, muito agudo, fraco ou gemente, ou fica inconsolável por horas;
- recusa várias mamadas seguidas ou molha menos fraldas do que o normal (veja [quantas fraldas o bebê molha por dia](${L('how-many-wet-diapers-newborn')}));
- tem vômitos repetidos, diarreia, sangue nas fezes ou moleira afundada;
- perde habilidades que já tinha ou não está fazendo o esperado para a idade nas consultas de puericultura;
- passa muitas semanas manhoso sem nenhuma melhora.
Em caso de dificuldade para respirar, lábios arroxeados ou bebê que não reage, ligue para o SAMU (192). Em Portugal, ligue para o SNS 24 (808 24 24 24) ou, em emergência, para o 112.
E cuide de você também. Se a tristeza, a ansiedade ou a exaustão não passam, fale com o seu médico ou com a unidade de saúde. Em momentos de crise, o CVV atende 24 horas, de graça, pelo telefone 188.
## Vale a pena usar o app The Wonder Weeks?
Muitos pais gostam do app porque ele transforma uma semana difícil em sinal de progresso, e isso faz bem para o ânimo. Se ele ajuda você a ter paciência numa terça-feira de choro, está cumprindo o papel dele.
O cuidado é não deixar o app virar fonte de ansiedade: abrir a tela para ver se vem "tempestade" por aí, ou se preocupar porque a manha não bate com a semana prevista. Ele é uma ferramenta de conforto, não de diagnóstico. Quem acompanha o desenvolvimento do seu bebê é o pediatra, com a Caderneta da Criança.
## Como o MamaBee ajuda nas semanas difíceis
Numa semana de salto, a pergunta que mais cansa é "isso é normal ou tem alguma coisa errada?". Um registro simples responde boa parte dela. No MamaBee você registra sono, mamadas no peito com cronômetro para cada lado, mamadeiras, fraldas, temperatura e sintomas com um toque, de graça e sem anúncios.
A linha do tempo e os resumos de 7 dias mostram como o sono e as mamadas estão variando, e se a semana difícil já está passando. Você marca cada conquista nos mais de 45 marcos do CDC, para ver a novidade que veio depois da fase de manha. Se a dúvida for para o pediatra, o app gera um PDF pronto para levar à consulta. E 2 cuidadores ficam sincronizados em tempo real, com os dois no iPhone, para revezar sem perder informação.
No Premium (${PRECO}), a Bee AI ilimitada responde às suas dúvidas levando em conta o registro do seu bebê, e o Sleep Coach prevê a próxima soneca a partir do histórico. O MamaBee é só para iPhone.
[[CTA||Semana de salto? Registre sono, mamadas e sintomas em um toque e veja quando a fase está passando]]
## Perguntas frequentes
### Quantos saltos de desenvolvimento o bebê tem?
Segundo o livro As Semanas Mágicas, são 10 saltos até cerca de 20 meses, 8 deles no primeiro ano. Esse número vem da teoria dos autores e não foi confirmado por estudos independentes.
### Quanto tempo dura um salto de desenvolvimento?
Segundo o livro e o app, as fases duram de alguns dias a algumas semanas. Se a manha se arrasta por muitas semanas, procure outras causas, como dentes, doença, cansaço acumulado ou fome, e converse com o pediatra.
### Salto de desenvolvimento dá febre?
Não. Febre não é sinal de salto. Bebês com menos de 3 meses e febre de 38 °C ou mais precisam de avaliação médica imediata, e em qualquer idade a febre com prostração pede consulta.
### O salto conta pela data de nascimento ou pela data prevista do parto?
Pela data prevista do parto. Para bebês prematuros, isso se parece com a idade corrigida que o pediatra usa para acompanhar o desenvolvimento.
### Como saber se é salto ou dente nascendo?
Dentes costumam vir com baba, gengiva inchada e vontade de morder. Segundo a AAP, a dentição não causa febre alta nem diarreia. Muitas vezes as duas coisas acontecem juntas, e o cuidado é parecido: colo, rotina e paciência.
### Os saltos de desenvolvimento são comprovados?
Em parte. É bem aceito que o desenvolvimento tem altos e baixos e que fases de mudança mexem com o humor e o sono. O calendário de 10 saltos em semanas fixas, igual para todos os bebês, não foi confirmado pela pesquisa independente.
## Resumindo
Salto de desenvolvimento é uma ideia popular do livro As Semanas Mágicas: 10 fases de choro, grude e sono pior antes de novas habilidades, por volta das semanas 5, 8, 12, 19, 26, 37, 46, 55, 64 e 75 contadas da data prevista do parto. O padrão de semanas difíceis é real para muitas famílias, mas o calendário fixo não tem confirmação científica. Ofereça colo, rotina e sono protegido, fique de olho nos sinais que pedem o pediatra, e lembre que a semana difícil quase sempre termina com uma novidade.
Quando o bebê estiver perto dos 6 meses, o próximo grande marco é a comida: veja o nosso guia de [introdução alimentar](${L('when-to-start-solids')}). Para acompanhar as conquistas mês a mês, veja também os [marcos do desenvolvimento por mês](${EN('baby-milestones-by-month')}) (em inglês).
[[CTA||Baixe o MamaBee grátis: sono, mamadas e marcos em um toque, sem anúncios, e um PDF pronto para o pediatra]]
Fontes: ${SRC.plooij1993}; ${SRC.deWeerth1999}; ${SRC.sadurni2002}; ${SRC.sadurni2010}; ${SRC.cdcMarcos}; ${SRC.caderneta}; ${SRC.sbpSono}; ${SRC.aapFebre}; ${SRC.aapChoro}; ${SRC.aapSacudir}; ${SRC.sns24}. Estudo de Groningen: de Weerth C, van Geert P. Emotional instability as an indicator of strictly timed infantile developmental transitions. British Journal of Developmental Psychology, 1998;16.
Revisado em 24 de novembro de 2026. As Semanas Mágicas e The Wonder Weeks pertencem aos seus respectivos titulares; o MamaBee não tem relação com eles. ${DISCLAIMER}`),

  // ───────────────────────── 2. Introdução alimentar ─────────────────────────
  A('when-to-start-solids',
    'Introdução alimentar: quando começar, cardápio e BLW',
    'Introdução alimentar segundo o Ministério da Saúde e a SBP: quando começar, sinais de prontidão, primeiros alimentos, cardápio da 1ª semana, BLW e engasgo.',
    ['introdução alimentar', 'introdução alimentar 6 meses', 'cardápio introdução alimentar', 'BLW introdução alimentar', 'papinha bebê 6 meses'],
    {
      idade: {
        caption: 'Baseado no Guia Alimentar para Crianças Brasileiras Menores de 2 Anos (Ministério da Saúde, 2019). As quantidades são só uma referência: respeite a fome e a saciedade do bebê.',
        headers: ['Idade', 'Refeições além do leite materno', 'Consistência', 'Quantidade aproximada por refeição principal'],
        rows: [
          ['6 meses', 'Fruta no meio da manhã e no meio da tarde + 1 refeição principal (almoço ou jantar)', 'Amassado com garfo, sem liquidificar nem peneirar; carnes bem cozidas, picadinhas ou desfiadas', 'Comece com cerca de 1 colher de sobremesa de cada grupo; 2 a 3 colheres de sopa no total'],
          ['7 e 8 meses', 'Fruta de manhã e à tarde + almoço e jantar', 'Menos amassado, picadinho; pedaços macios que o bebê consiga pegar', '3 a 4 colheres de sopa no total'],
          ['9 a 11 meses', 'As mesmas refeições: fruta de manhã e à tarde, almoço e jantar', 'Picado, na consistência da comida da família', '4 a 5 colheres de sopa no total'],
          ['A partir de 1 ano', 'Comida da família, com café da manhã, lanches, almoço e jantar', 'A mesma da família, cortando pedaços grandes', 'Segue a fome da criança'],
        ],
      },
      prato: {
        caption: 'O prato principal do Guia: um alimento de cada grupo, separados no prato, sem misturar.',
        headers: ['Grupo', 'Exemplos'],
        rows: [
          ['Cereais, raízes e tubérculos', 'Arroz, macarrão, milho, batata, batata-doce, mandioca (aipim, macaxeira), inhame, cará'],
          ['Feijões', 'Feijão carioca, preto ou de corda, lentilha, ervilha, grão-de-bico (bem cozidos e amassados)'],
          ['Legumes e verduras', 'Abóbora, cenoura, chuchu, abobrinha, beterraba, brócolis, couve, espinafre'],
          ['Carnes e ovos', 'Carne bovina, frango, peixe sem espinhas, fígado, ovo inteiro bem cozido'],
          ['Frutas (nos lanches e um pedacinho junto à refeição)', 'Banana, mamão, manga, abacate, pera, melão, laranja; todas sem açúcar'],
        ],
      },
      semana: {
        caption: 'Exemplo para um bebê de 6 meses que mama no peito. Leite materno livre o dia todo e água nos intervalos. Tudo amassado com garfo, sem sal ou com o mínimo, sem açúcar.',
        headers: ['Dia', 'Lanche da manhã', 'Almoço (um alimento de cada grupo)', 'Lanche da tarde', 'Novidade do dia'],
        rows: [
          ['1', 'Banana amassada', 'Arroz bem cozido, feijão carioca amassado, abóbora, carne moída', 'Mamão amassado', 'Primeiro contato: aceitar 1 ou 2 colheradas já é ótimo'],
          ['2', 'Mamão amassado', 'Batata-doce, lentilha, cenoura, frango desfiado bem fino', 'Pera raspada', 'Lentilha e frango'],
          ['3', 'Manga amassada', 'Mandioca, feijão preto, chuchu, ovo cozido amassado', 'Banana amassada', 'Ovo inteiro, bem cozido'],
          ['4', 'Abacate amassado, sem açúcar', 'Arroz, feijão carioca, brócolis bem cozido, carne moída', 'Maçã raspada', 'Brócolis'],
          ['5', 'Pera raspada', 'Arroz, ervilha amassada, abobrinha, peixe desfiado sem espinhas', 'Melão amassado', 'Peixe'],
          ['6', 'Banana amassada', 'Macarrão bem cozido, feijão carioca, couve refogada bem picadinha, frango desfiado', 'Mamão amassado', 'Trigo (glúten) e couve'],
          ['7', 'Mamão amassado', 'Inhame, grão-de-bico amassado, beterraba, ovo cozido amassado', 'Manga amassada', 'Grão-de-bico e beterraba'],
        ],
      },
      metodos: {
        caption: 'Os três jeitos de oferecer a comida. A SBP não endossa nenhum método como o único correto.',
        headers: ['', 'Papinha amassada (colher)', 'BLW', 'Misto (o que a SBP descreve)'],
        rows: [
          ['Como funciona', 'Comida da família amassada com garfo, oferecida na colher', 'O bebê pega sozinho pedaços macios desde o início, sem colher', 'Comida amassada na colher e também pedaços macios para o bebê explorar com as mãos'],
          ['Pontos fortes', 'Mais fácil ver quanto o bebê comeu e garantir ferro', 'Autonomia, refeição em família, contato com texturas', 'Junta as vantagens e se adapta à família'],
          ['Cuidados', 'Não liquidificar; evoluir a consistência com o tempo', 'Risco de comer pouco ferro e calorias; atenção redobrada ao engasgo', 'Supervisão e pedaços no formato seguro'],
          ['Posição oficial', 'Recomendada pelo Ministério da Saúde e pela SBP', 'SBP (2017): não há evidência suficiente para dizer que é a única forma correta', 'É como o Guia do Ministério e a SBP descrevem a oferta'],
        ],
      },
      evitar: {
        caption: 'Guia Alimentar do Ministério da Saúde (2019) e SBP (2024).',
        headers: ['Alimento', 'Desde quando', 'Por quê'],
        rows: [
          ['Açúcar de qualquer tipo (refinado, mascavo, demerara, rapadura, melado)', 'Não oferecer antes de 2 anos', 'Favorece cárie, excesso de peso e preferência pelo doce'],
          ['Mel', 'Não oferecer antes de 2 anos (Guia do MS)', 'Tem os mesmos componentes do açúcar e, antes de 1 ano, traz risco de botulismo'],
          ['Ultraprocessados: biscoitos, salgadinhos, refrigerantes, embutidos, temperos prontos', 'Não oferecer antes de 2 anos', 'Excesso de açúcar, sal, gordura e aditivos'],
          ['Sucos, mesmo os naturais, e bebidas adoçadas', 'Não oferecer antes de 2 anos (SBP)', 'A fruta inteira tem fibras; o suco não'],
          ['Pipoca', 'Não oferecer antes de 2 anos', 'Alto risco de engasgo'],
          ['Castanhas e amendoim inteiros', 'Só triturados ou em pasta', 'Duros, podem causar engasgo e sufocamento'],
          ['Uva, acerola, tomate-cereja inteiros', 'Sempre sem sementes e cortados em pedaços bem pequenos', 'O formato redondo pode bloquear a via aérea'],
          ['Leite de vaca como refeição', 'Não antes dos 9 meses (Guia do MS)', 'Em pequena quantidade, dentro de receitas, pode a partir dos 6 meses'],
          ['Sal', 'Usar o mínimo, com temperos naturais', 'As famílias brasileiras já consomem quase 3 vezes o sódio recomendado'],
        ],
      },
    },
`**A introdução alimentar deve começar por volta dos 6 meses, quando o bebê senta com pouco ou nenhum apoio, já não empurra a comida para fora com a língua e mostra interesse. O Ministério da Saúde e a SBP orientam comida de verdade, amassada com garfo, sem açúcar, mantendo o leite materno até 2 anos ou mais.**
A primeira colherada costuma render careta e muita sujeira, e tudo isso é normal. Este guia responde às dúvidas mais comuns, de quando começar até papinha ou BLW, seguindo as duas principais referências do Brasil: o Guia Alimentar para Crianças Brasileiras Menores de 2 Anos, do Ministério da Saúde, e os documentos da Sociedade Brasileira de Pediatria (SBP).
## Quando começar a introdução alimentar?
Por volta dos 6 meses. Até essa idade, o leite materno sozinho oferece tudo o que o bebê precisa, e a recomendação do Ministério da Saúde, da SBP e da Organização Mundial da Saúde (OMS) é a amamentação exclusiva até os 6 meses, sem água, chás ou sucos.
A partir dos 6 meses, o bebê precisa de mais energia, ferro e outros nutrientes. O leite materno continua, de preferência até os 2 anos ou mais.
E quem toma fórmula? A SBP orienta que, como regra geral, a introdução alimentar comece aos 6 meses tanto para bebês amamentados quanto para os que recebem fórmula infantil. Para prematuros ou bebês com alguma condição de saúde, o pediatra pode ajustar o momento.
Começar antes da hora tem desvantagens: o Guia lembra que o bebê amamentado que recebe outros alimentos antes dos 6 meses passa a mamar menos no peito, e a SBP alerta que a introdução precoce pode trazer problemas de saúde. Atrasar muito também não é bom: segundo o Guia, adiar a introdução pode dificultar a aceitação da comida no futuro.
## Sinais de que o bebê está pronto para comer
O Guia do Ministério da Saúde descreve o bebê pronto para a introdução alimentar assim:
- **Senta com pouco ou nenhum apoio** e firma bem a cabeça e o pescoço
- **Diminui o reflexo de empurrar a comida com a língua** para fora da boca
- **Leva objetos à boca e faz movimentos de mastigar**
- **Mostra interesse:** observa você comer, abre a boca quando a colher se aproxima, tenta pegar a comida
Esses sinais aparecem juntos, em geral por volta dos 6 meses. Acordar mais à noite ou colocar a mão na boca não são sinais de prontidão. O reflexo de língua diminui a partir dos 4 ou 5 meses, mas ainda pode aparecer aos 6: se o bebê cuspir a comida nos primeiros dias, nem sempre é recusa.
## Introdução alimentar mês a mês: refeições, consistência e quantidade
[[TABLE:idade]]
A SBP propõe uma sequência parecida: por volta dos 6 meses, a primeira refeição principal, com todos os grupos de alimentos, e fruta. Por volta dos 7 meses, ou 30 dias depois da primeira, entra a segunda refeição principal e a fruta passa a ser oferecida duas vezes ao dia. Não há regra sobre qual refeição vem primeiro: pode ser almoço ou jantar, o que for melhor para a família.
O leite materno continua livre, sempre que o bebê quiser. No começo, não se preocupe com a quantidade: segundo o Guia, o leite materno continua sendo o principal alimento.
## Como montar o prato do bebê
O Guia recomenda que o almoço e o jantar tenham um alimento de cada grupo, separados no prato, sem misturar, para o bebê conhecer o sabor e a textura de cada um.
[[TABLE:prato]]
Prepare a comida junto com a da família, com pouco óleo vegetal, temperos naturais como cebola, alho, salsa e cebolinha, e o mínimo de sal. Se ficar seca, um pouco do caldo do feijão ou dos legumes ajuda.
### Ferro desde o início
A partir dos 6 meses, o bebê precisa de ferro além do que vem do leite. Boas fontes, segundo o Guia, são carnes, fígado, feijões, ovo e verduras verde-escuras. A vitamina C de frutas como laranja, acerola, goiaba e mamão, na mesma refeição, ajuda a aproveitar o ferro dos vegetais. Por isso o Guia e a SBP recomendam carnes ou ovos todos os dias. Entre 6 meses e 2 anos, alguns bebês também precisam de suplemento de ferro, que só um profissional de saúde pode prescrever e que está disponível nas Unidades Básicas de Saúde.
### Por que não bater no liquidificador?
O Guia é claro: nada de liquidificador, mixer ou peneira. A comida deve ser amassada com garfo e ficar firme na colher. Bebês que continuam só com textura líquida aceitam pior os alimentos sólidos depois, e sopas e caldos trazem mais água e menos nutrientes. A SBP prefere o nome "papa principal", e não "papa salgada": é comida de verdade, sem precisar de sal.
## Cardápio da primeira semana de introdução alimentar
O cardápio segue o esquema do Guia para os 6 meses: fruta no meio da manhã, almoço completo e fruta no meio da tarde, com leite materno à vontade. Pode trocar o almoço pelo jantar. No esquema da SBP, comece com uma fruta por dia e acrescente a segunda aos poucos.
[[TABLE:semana]]
Algumas dicas para essa semana:
- **Escolha um horário em que o bebê esteja acordado e bem-disposto**, longe da hora da soneca. No início, o Guia sugere oferecer a comida depois da mamada no peito.
- **Ofereça pouco e deixe o bebê pedir mais.** Cerca de 1 colher de sobremesa de cada grupo é o ponto de partida. Aceitar 1 ou 2 colheradas nos primeiros dias já é uma vitória.
- **Uma novidade por vez nos alimentos alergênicos.** Ovo, peixe, trigo e amendoim podem entrar desde os 6 meses. Oferecer um deles por vez, num dia sem outras novidades, facilita perceber se algo não caiu bem.
- **Varie a forma de preparo.** Se o bebê recusar a cenoura amassada, ofereça em outro dia, em pedaço maior para ele pegar, assada ou ralada.
## Papinha ou BLW: o que diz a SBP?
BLW vem do inglês baby-led weaning, ou introdução alimentar guiada pelo bebê: desde o início, ele pega sozinho pedaços macios de comida, sem colher.
[[TABLE:metodos]]
Para o Departamento de Nutrologia da SBP (2017), não há estudos em quantidade e qualidade suficientes para dizer que o BLW, ou a versão adaptada chamada BLISS, seja a única forma correta de introdução alimentar. As ideias do método são coerentes com o desenvolvimento infantil, e também não há evidência de que a colher seja menos estimulante. Na prática, o Ministério da Saúde e a SBP descrevem um caminho do meio: comida amassada na colher e pedaços macios para o bebê explorar com as mãos. A frase da SBP resume bem: "comer junto, e não dar de comer".
### E o engasgo no BLW?
Um estudo randomizado da Nova Zelândia, com 206 bebês, não encontrou mais engasgos no grupo que seguiu o BLISS, uma versão do BLW com orientações de segurança. Mas 35% dos bebês dos dois grupos engasgaram ao menos uma vez entre 6 e 8 meses. Em qualquer método, o formato do alimento e a supervisão fazem a diferença.
Se a família quiser seguir o BLW, as orientações do BLISS citadas pela SBP ajudam: alimento rico em ferro em toda refeição, um alimento rico em energia em toda refeição, pedaços grandes e macios que o bebê consiga pegar sozinho, nada redondo ou em formato de moeda, provar antes para conferir se o alimento não forma uma bola difícil de engolir, e bebê sempre sentado, ereto e com um adulto olhando. Para o passo a passo, veja o nosso guia de [baby-led weaning](${EN('baby-led-weaning')}) (em inglês).
## Alimentos alergênicos: ovo, amendoim e peixe
A orientação mudou: antes se recomendava atrasar ovo, peixe e amendoim. Hoje, a SBP orienta que alimentos potencialmente alergênicos, como ovo, peixe, amendoim e castanhas, podem ser introduzidos a partir do sexto mês, mesmo em bebês com história de alergia na família. Os estudos indicam que a introdução tardia, depois dos 12 meses, aumenta o risco de alergia. O glúten também pode entrar a partir dos 6 meses.
- **Ovo:** inteiro (gema e clara), sempre bem cozido, nunca cru ou mole.
- **Peixe:** bem cozido, desfiado, conferindo todas as espinhas.
- **Amendoim e castanhas:** nunca inteiros. Pasta de amendoim pura, sem açúcar e sem sal, em camada bem fina ou misturada à fruta amassada, ou castanhas bem trituradas.
- **Trigo:** macarrão bem cozido, pão sem açúcar em pedaço macio.
Depois de algo novo, observe o bebê nas horas seguintes. Manchas vermelhas, urticária, vômitos ou inchaço leve pedem contato com o pediatra antes de oferecer de novo. Se o bebê tem dermatite atópica grave ou já tem alergia diagnosticada, converse com o pediatra antes de introduzir os alergênicos. Mais detalhes em [como introduzir alergênicos](${EN('introducing-allergens-to-baby')}) (em inglês).
**Emergência:** dificuldade para respirar, chiado, inchaço nos lábios, no rosto ou na língua, vômitos repetidos ou bebê mole e pálido logo depois de comer são sinais de alergia grave. Ligue para o SAMU (192) imediatamente.
## Engasgo ou ânsia: como diferenciar e o que fazer
A ânsia de vômito é comum e protege o bebê: ele faz barulho, tosse, fica vermelho e empurra o alimento para a frente. Fique perto, calmo, e deixe o bebê resolver.
O engasgo de verdade é silencioso, ou quase: o bebê não consegue chorar, tossir nem respirar direito, pode ficar roxo e com cara de pânico. Isso é emergência.
### O que fazer se o bebê engasgar
Para bebês com menos de 1 ano, acordados, a SBP orienta:
- Deite o bebê de bruços sobre o seu antebraço, com a cabeça mais baixa que o corpo e a boca aberta
- Dê 5 batidas firmes com a base da mão nas costas, entre as escápulas
- Vire o bebê de barriga para cima no outro antebraço e faça 5 compressões no meio do peito, logo abaixo da linha dos mamilos
- Repita até o alimento sair. Se o bebê desmaiar, peça ajuda e ligue para o SAMU (192) no viva-voz para receber instruções
Mesmo que o engasgo pareça resolvido, leve o bebê para avaliação médica. Um curso de primeiros socorros para bebês dá muita segurança.
### Como prevenir
- Bebê sempre sentado, ereto, na cadeirinha, e com um adulto olhando o tempo todo. Nunca no carro, no colo deitado ou andando.
- Nada de telas na hora de comer: a atenção do bebê e a sua precisam estar na comida.
- Siga a lista de alimentos de risco abaixo. Segundo a SBP, pipoca, amendoim, castanhas, grãos de milho e feijão, salsicha e ossinhos estão entre os mais aspirados.
## O que não oferecer na introdução alimentar
[[TABLE:evitar]]
## Água na introdução alimentar
Quando a comida entra na rotina, o bebê precisa de água. O Guia orienta oferecer água potável, filtrada ou fervida, ao longo do dia, nos intervalos das refeições, em copo, de preferência liso e simples, sem canudo, e não na mamadeira. Água de coco, chás e sucos não substituem a água. Mais detalhes em [quando o bebê pode beber água](${EN('when-can-babies-drink-water')}) (em inglês).
## Dicas que facilitam a introdução alimentar
- **Comer junto.** O bebê aprende vendo a família comer a mesma comida, à mesa.
- **Ofereça de novo, e de novo.** A SBP lembra que pode ser preciso oferecer um alimento de 8 a 10 vezes ou mais até ele ser aceito. Não conclua que o bebê "não gosta" na primeira careta.
- **Respeite os sinais de saciedade.** Virar a cabeça, fechar a boca, empurrar a colher e perder o interesse querem dizer "chega". Não force, não faça chantagem, não distraia com o celular.
- **Deixe o bebê pegar a comida e aceite a bagunça.** Mãos na comida fazem parte do aprendizado; ofereça também uma colher pequena para ele tentar.
## Quando falar com o pediatra
Converse com o pediatra ou com a equipe da unidade de saúde se:
- o bebê tem mais de 7 ou 8 meses e ainda recusa quase toda comida, ou só aceita textura líquida;
- tem ânsia forte e frequente com qualquer textura;
- não está ganhando peso como esperado na curva da Caderneta da Criança;
- teve manchas, vômitos ou inchaço depois de um alimento novo;
- é prematuro ou tem alguma condição de saúde e você não sabe quando começar.
Em Portugal, ligue para o SNS 24 (808 24 24 24) ou, em emergência, para o 112.
## Como o MamaBee ajuda na introdução alimentar
Nas primeiras semanas, é difícil lembrar o que o bebê já provou e em que dia apareceu aquela mancha vermelha. No MamaBee você registra cada refeição sólida com um toque, junto com as mamadas no peito, mamadeiras e fraldas, de graça e sem anúncios. A linha do tempo mostra o dia inteiro do bebê, e os resumos de 7 dias ajudam a ver como a comida está se encaixando na rotina.
Dois cuidadores sincronizam em tempo real, com os dois no iPhone, e para a consulta o app gera um PDF com os registros para mostrar ao pediatra.
No Premium (${PRECO}), o Teste de Alergênicos da introdução alimentar acompanha cada alimento alergênico com um cronômetro de observação de 3 dias, e a Bee AI ilimitada responde às dúvidas de cardápio e de rotina levando em conta o registro do seu bebê. O MamaBee é só para iPhone.
[[CTA||Primeira papinha chegando? Registre cada alimento novo em um toque e nunca esqueça o que o bebê já provou]]
## Perguntas frequentes
### Posso começar a introdução alimentar com 4 meses?
O Ministério da Saúde e a SBP recomendam esperar até por volta dos 6 meses, com amamentação exclusiva até lá. Se o pediatra sugerir outro momento para o seu bebê, siga a orientação individual dele.
### Quantas colheres um bebê de 6 meses come?
O Guia sugere começar com cerca de 1 colher de sobremesa de cada grupo, chegando a 2 ou 3 colheres de sopa no total por refeição. Com 7 e 8 meses, 3 a 4 colheres de sopa. É só uma referência: respeite a fome e a saciedade do bebê.
### Pode bater a papinha no liquidificador?
Não. O Guia do Ministério da Saúde orienta amassar com garfo, sem liquidificar nem peneirar, para o bebê aprender a mastigar. Comida líquida por muito tempo dificulta a aceitação de alimentos mais firmes depois.
### Quando oferecer ovo ao bebê?
A partir dos 6 meses, inteiro e bem cozido. A SBP orienta que ovo, peixe e amendoim podem entrar desde o sexto mês, mesmo com histórico de alergia na família, porque atrasar depois dos 12 meses aumenta o risco de alergia.
### A SBP recomenda o BLW?
A SBP não recomenda o BLW como a única forma correta. Ela descreve um caminho misto, com comida amassada na colher e pedaços macios para o bebê explorar com as mãos, sempre com supervisão e cuidado com o engasgo.
## Resumindo
A introdução alimentar começa por volta dos 6 meses, quando o bebê dá sinais de prontidão, com leite materno mantido até 2 anos ou mais. Ofereça comida de verdade, da família, amassada com garfo, com um alimento de cada grupo separado no prato, frutas in natura, amassadas ou raspadas, nos lanches, água nos intervalos e nada de açúcar nem ultraprocessados até os 2 anos. Introduza ovo, peixe e amendoim desde os 6 meses, aprenda a diferenciar ânsia de engasgo e encare a bagunça como parte do aprendizado.
Ainda falta um pouco para os 6 meses e o bebê anda manhoso? Veja o nosso guia de [salto de desenvolvimento](${L('the-wonder-weeks-leaps')}). Para encaixar as refeições entre as sonecas, confira a [janela de sono por idade](${L('wake-windows-by-age')}) e o [exemplo de rotina do bebê de 6 meses](${EN('6-month-old-schedule')}) (em inglês).
[[CTA||Baixe o MamaBee grátis: papinhas, mamadas e fraldas em um toque, sem anúncios, e o Teste de Alergênicos quando você quiser]]
Fontes: ${SRC.guia}; ${SRC.sbp2024}; ${SRC.sbpBlw}; ${SRC.sbpEngasgo}; ${SRC.bliss}; ${SRC.oms}; ${SRC.aapAlergenos}; ${SRC.cdcEngasgo}; ${SRC.caderneta}; ${SRC.sns24}.
Revisado em 24 de novembro de 2026. ${DISCLAIMER}`),
]

const DRY = !!process.env.DRY
// Internal-link check: every /mamabee/pt-br/articles/<slug> must exist in pt-br (or be in this batch);
// every /mamabee/articles/<slug> must exist as a published English article.
const batch = new Set(articles.map((a) => a.slug))
const ptSlugs = new Set(await client.fetch('*[_type=="article"&&brand=="mamabee"&&language==$lang].slug.current', {lang: LANG}))
const enSlugs = new Set(await client.fetch('*[_type=="article"&&brand=="mamabee"&&!(_id in path("drafts.**"))&&(!defined(language)||language=="en")].slug.current'))
for (const a of articles) {
  const doc = {_id: `drafts.mamabee-${LANG}-${a.slug}`, _type: 'article', brand: 'mamabee', language: LANG, title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description, author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body: md(a.body, a.tables)}
  let coverFrom = null
  for (const rel of COVERS[a.slug] || []) {
    const src = await client.getDocument(`mamabee-${rel}`)
    if (src && src.coverImage) { doc.coverImage = src.coverImage; coverFrom = rel; break }
  }
  const hrefs = doc.body.flatMap((b) => (b.markDefs || []).map((d) => d.href).filter(Boolean))
  const internal = [...new Set(hrefs.filter((h) => h.startsWith('/mamabee/')))]
  const broken = internal.filter((h) => {
    const pt = h.match(/^\/mamabee\/pt-br\/articles\/([a-z0-9-]+)$/); if (pt) return !(ptSlugs.has(pt[1]) || batch.has(pt[1]))
    const en = h.match(/^\/mamabee\/articles\/([a-z0-9-]+)$/); if (en) return !enSlugs.has(en[1])
    return false
  })
  const text = doc.body.filter((b) => b._type === 'block').map((b) => b.children.map((s) => s.text).join('')).join('\n')
  const flags = []
  if (/R\$ ?(1\d\d|2[0-8]\d),|promo/i.test(text)) flags.push('promo/low price?')
  if (/(Bee AI|Sleep Coach|calendário vacinal|Teste de Alergênicos)[^.]{0,40}(grátis|gratuit)/i.test(text)) flags.push('Premium feature called free?')
  if (doc.body.filter((b) => b._type === 'appCta').length !== 2) flags.push('CTA count != 2')
  if (!DRY) await client.createOrReplace(doc)
  let w = 0; for (const b of doc.body) if (b._type === 'block' && b.children) for (const s of b.children) if (s.text) w += s.text.split(/\s+/).filter(Boolean).length
  const tables = doc.body.filter((b) => b._type === 'comparisonTable').length
  const faqStart = doc.body.findIndex((b) => b.style === 'h2' && b.children[0]?.text === 'Perguntas frequentes')
  const faqEnd = doc.body.findIndex((b, i) => i > faqStart && b.style === 'h2')
  const faqs = doc.body.slice(faqStart, faqEnd).filter((b) => b.style === 'h3').length
  const lede = doc.body[0].children.map((s) => s.text).join('').split(/\s+/).filter(Boolean).length
  console.log(`${DRY ? '[DRY] ' : ''}${w >= 1800 && w <= 2900 ? '✅' : '⚠️ '} draft: ${LANG}/${a.slug} (~${w} words, ${tables} tables, ${faqs} FAQs, lede ${lede}w, title ${a.title.length}c, desc ${a.description.length}c, cover from ${coverFrom || 'NONE'}, ${internal.length} internal links${broken.length ? ', BROKEN: ' + broken.join(' ') : ''}${flags.length ? ', FLAGS: ' + flags.join('; ') : ''})`)
  if (DRY) console.log('   internal:', internal.join(' '))
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is live.')
