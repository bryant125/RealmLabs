// Week-16 pt-BR MamaBee articles as DRAFTS only (never published by this script):
//   how-to-increase-milk-supply      -> "como aumentar a produção de leite materno"
//   how-long-is-breast-milk-good-for -> "armazenamento leite materno"
// Both reuse the English slug so they pair as hreflang translations (_id drafts.mamabee-pt-br-<slug>,
// language 'pt-br'). Written natively for Brazil. Storage rules are the BRAZILIAN ones (Ministério da
// Saúde, Guia Alimentar para Crianças Brasileiras Menores de 2 Anos 2019, pp. 55-60; SBP Departamento
// Científico de Aleitamento Materno; Rede BLH), which differ from the CDC's: 12 h fridge, 15 days freezer,
// 12 h after thawing, no room-temperature window, never refreeze. Supply guidance: Guia p. 44 ("pouco
// leite"), p. 31 (no food proven to raise supply), SBP e-book Agosto Dourado 2022, TelessaúdeRS-UFRGS on
// galactagogues. No medicine doses anywhere.
// MamaBee prices = owner-confirmed App Store Connect list (same as week15-pt-br.mjs / intl-wave2-pt-br.mjs).
// Cover images are copied from a related published article (fallbacks in order).
// Run: cd RealmLabs && set -a && source .env && set +a && node scripts/week16-pt-br.mjs
// Dry run (build + stats + link check, no writes): DRY=1 node scripts/week16-pt-br.mjs
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
const PRECO = 'R$ 29,90 por mês ou R$ 299,90 por ano na App Store brasileira, preços conferidos em novembro de 2026 e que podem mudar'

const SRC = {
  guia: '[Guia Alimentar para Crianças Brasileiras Menores de 2 Anos, Ministério da Saúde (2019)](https://portaldeboaspraticas.iff.fiocruz.br/wp-content/uploads/2019/11/guia_da_crianca_2019.pdf)',
  sbpEbook: '[SBP, Departamento Científico de Aleitamento Materno: Pais, tirem suas dúvidas sobre aleitamento materno (e-book Agosto Dourado, 2022)](https://www.sbp.com.br/fileadmin/user_upload/sbp/2022/agosto/12/ebook_agosto_dourado_sbp.pdf)',
  sbpEstocar: '[SBP Pediatria para Famílias: como colher e estocar o leite materno](https://www.sbp.com.br/como-colher-e-estocar-o-leite-materno/)',
  rblh: '[Rede Brasileira de Bancos de Leite Humano (rBLH-BR, Fiocruz)](https://rblh.fiocruz.br/rblh-brasil)',
  rblhMapa: '[Rede BLH: encontre o banco de leite mais próximo](https://rblh.fiocruz.br/localizacao-dos-blhs)',
  rblhDoacao: '[Rede BLH / BLH Hucam: armazenamento do leite humano para doação](https://rblh.fiocruz.br/sites/rblh.fiocruz.br/files/usuario/114/como_e_feito_o_armazenamento_do_leite.pdf)',
  ufrgs: '[TelessaúdeRS-UFRGS: a prescrição de galactagogos é indicada para estimular a produção de leite materno? (2019)](https://www.ufrgs.br/telessauders/?p=24718)',
  aapLeite: '[AAP/HealthyChildren: como saber se o bebê está recebendo leite suficiente](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx)',
  oms: '[OMS: alimentação de lactentes e crianças pequenas](https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding)',
  nhsMastite: '[NHS: mastite](https://www.nhs.uk/conditions/mastitis/)',
  cdcLeite: '[CDC: como armazenar e preparar o leite materno (EUA)](https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html)',
}
const DISCLAIMER = 'Este conteúdo é apenas informativo e não substitui a orientação médica. Em caso de dúvida sobre a saúde do seu bebê, fale com o pediatra ou procure a unidade de saúde.'

// Related published article whose coverImage each draft copies (fallbacks in order).
const COVERS = {
  'how-to-increase-milk-supply': ['how-to-increase-milk-supply', 'cluster-feeding', 'best-breastfeeding-apps', 'exclusive-pumping-schedule'],
  'how-long-is-breast-milk-good-for': ['how-long-is-breast-milk-good-for', 'exclusive-pumping-schedule', 'introducing-a-bottle-to-breastfed-baby', 'best-breastfeeding-apps'],
}

const articles = [

  // ───────────────────────── 1. Como aumentar a produção de leite materno ─────────────────────────
  A('how-to-increase-milk-supply',
    'Como aumentar a produção de leite materno: o que funciona',
    'Como aumentar a produção de leite materno: livre demanda, pega, ordenha, o que é mito (canjica, cerveja preta, chás) e quando procurar o banco de leite.',
    ['como aumentar a produção de leite materno', 'pouco leite materno', 'alimentos que aumentam o leite materno', 'ordenha poderosa power pumping', 'banco de leite humano'],
    {
      sinais: {
        caption: 'Baseado no Guia Alimentar para Crianças Brasileiras Menores de 2 Anos (Ministério da Saúde), no e-book de aleitamento da SBP e na AAP.',
        headers: ['O que você percebe', 'Costuma ser normal?', 'O que observar'],
        rows: [
          ['Bebê quer mamar toda hora, às vezes de hora em hora no fim do dia', 'Sim. De 8 a 12 mamadas por dia é o esperado (SBP)', 'Se ele molha bem as fraldas e ganha peso, é demanda, não falta de leite'],
          ['Peito mais mole depois das primeiras semanas', 'Sim. A produção se ajusta ao bebê e a mama para de ficar tão cheia', 'Não é sinal de que o leite "secou"'],
          ['Sai pouco leite na bomba ou na ordenha manual', 'Sim, principalmente no começo', 'O bebê tira leite do peito melhor do que qualquer bomba. Ordenhar exige prática (Ministério da Saúde)'],
          ['Choro depois da mamada ou alguns dias sem cocô', 'Muitas vezes, sim', 'O Ministério da Saúde diz que isso não significa, por si só, pouco leite'],
          ['Menos de 6 fraldas molhadas por dia depois da primeira semana', 'Não', 'Fale com o pediatra ou com o banco de leite'],
          ['Bebê não ganha peso na curva da Caderneta', 'Não', 'Avaliação no mesmo período, com o pediatra'],
        ],
      },
      power: {
        caption: 'Exemplo de sessão de ordenha poderosa (power pumping). Não há estudos de qualidade sobre ela: use como complemento, depois do básico, e com orientação.',
        headers: ['Tempo', 'O que fazer'],
        rows: [
          ['0 a 20 min', 'Ordenhe (bomba ou mão)'],
          ['20 a 30 min', 'Descanse'],
          ['30 a 40 min', 'Ordenhe de novo'],
          ['40 a 50 min', 'Descanse'],
          ['50 a 60 min', 'Ordenhe pela última vez'],
        ],
      },
      mitos: {
        caption: 'Resumo do que dizem o Ministério da Saúde e o TelessaúdeRS-UFRGS.',
        headers: ['"Aumenta o leite"?', 'O que a evidência diz', 'Na prática'],
        rows: [
          ['Canjica', 'Sem comprovação. Nenhum alimento aumenta ou reduz a produção de leite, segundo o Ministério da Saúde', 'Pode comer se gosta, como parte de uma alimentação variada'],
          ['Cerveja preta', 'Não aumenta. O álcool pode diminuir a produção e passa rápido para o leite', 'Evite álcool durante a amamentação'],
          ['Chás (erva-doce, funcho e outros)', 'Sem evidência científica. Ervas não têm dose, pureza nem segurança controladas', 'Converse com o médico antes de usar qualquer chá ou suplemento'],
          ['Feno-grego, aveia, cardo-mariano', 'Sem evidência de que funcionem para a amamentação', 'Não substituem mamadas frequentes'],
          ['Cookies e suplementos "para lactação"', 'Não há estudos que provem efeito', 'Gastar com eles é opcional, não necessário'],
          ['Beber muita água além da sede', 'Não aumenta o leite', 'Beba água sempre que tiver sede e deixe uma garrafa por perto ao amamentar'],
        ],
      },
    },
`**Para aumentar a produção de leite materno, o que funciona é tirar mais leite do peito, com mais frequência: livre demanda, de 8 a 12 mamadas por dia (inclusive à noite), pega correta e, se preciso, ordenha depois das mamadas. Segundo o Ministério da Saúde, nenhum alimento ou bebida comprovadamente aumenta o leite.**
"Será que eu tenho leite suficiente?" é uma das dúvidas mais comuns das primeiras semanas. O Ministério da Saúde diz que a sensação de ter pouco leite é a principal razão para a oferta de outros leites ao bebê, mas que a maioria das mulheres produz leite suficiente quando o bebê mama com frequência, por tempo adequado e com boa pega.
Aqui você encontra como saber se o leite está mesmo pouco, o que realmente ajuda a produzir mais, o que é mito e onde conseguir ajuda gratuita no Brasil.
## Como funciona a produção de leite?
A produção de leite funciona por oferta e procura. Cada vez que o bebê mama, ou que você tira leite, o corpo recebe o recado de que precisa fabricar mais. Peito que fica cheio por muito tempo recebe o recado oposto.
Por isso, quase tudo o que aumenta a produção passa por esvaziar a mama mais vezes e melhor. E quase tudo o que derruba a produção passa por mamadas que diminuem sem ninguém perceber: chupeta para "segurar" a fome, mamadeira de complemento, água ou chá nos intervalos, noites longas sem mamar logo nas primeiras semanas.
Dois mitos que vale deixar para trás desde já:
- **Não existe leite fraco.** O Guia Alimentar do Ministério da Saúde diz que todo leite materno é adequado e que não se pode julgar o leite pela cor, pelo aspecto ou pelo sabor.
- **Mama pequena não produz menos.** O tamanho da mama depende da gordura do local. O leite é produzido pelas glândulas mamárias.
## Será que eu tenho pouco leite? Sinais de que o bebê mama bem
Antes de mudar qualquer coisa, olhe para o bebê. Segundo o Ministério da Saúde, se ele parece satisfeito depois das mamadas, é ativo, responde aos estímulos, faz xixi várias vezes ao dia (no mínimo 6 vezes) e, principalmente, está crescendo e ganhando peso na Caderneta da Criança, o leite oferecido é suficiente.
[[TABLE:sinais]]
Uma referência prática para a primeira semana: a contagem de fraldas molhadas sobe dia a dia até chegar a 6 ou mais. Veja a tabela completa em [quantas fraldas o recém-nascido usa por dia](${L('how-many-wet-diapers-newborn')}).
Também é comum o bebê passar algumas horas, geralmente no fim da tarde e à noite, querendo mamar sem parar. É a chamada mamada em cachos, ou cluster feeding, e não quer dizer falta de leite. Veja o nosso guia de [cluster feeding](${EN('cluster-feeding')}) (em inglês). Fases de manha com mais vontade de mamar, que muitos chamam de [salto de desenvolvimento](${L('the-wonder-weeks-leaps')}), também passam.
## 9 coisas que realmente aumentam a produção de leite
As medidas abaixo são as que o Guia Alimentar do Ministério da Saúde lista para aumentar a produção, com detalhes da SBP. Comece pelas primeiras: elas resolvem a maior parte dos casos.
### 1. Livre demanda, inclusive à noite
Ofereça o peito sempre que o bebê der sinais de fome, sem horário fixo e sem tempo cronometrado. A SBP explica que um bebê em aleitamento materno exclusivo mama, em geral, de 8 a 12 vezes ao dia, e que isso é normal, não sinal de leite fraco. As mamadas da madrugada contam muito: o Ministério da Saúde lembra que dar o peito à noite estimula a produção.
### 2. Pega e posição corretas
Pega ruim tira pouco leite e machuca. Sinais de uma boa pega: a boca do bebê bem aberta, o lábio de baixo virado para fora, o queixo encostado na mama, a barriga dele virada para a sua e mais aréola aparecendo acima da boca do que abaixo. Mamar não deve doer depois das primeiras sugadas. Se dói ou o mamilo sai achatado ou machucado, peça para alguém da maternidade, da unidade de saúde ou do banco de leite olhar uma mamada.
### 3. Deixe esvaziar bem um peito antes de trocar
O Guia orienta dar tempo para o bebê mamar bastante em um dos peitos antes de oferecer o outro. O leite do fim da mamada tem mais gordura, e o peito bem esvaziado recebe mais estímulo. Depois, ofereça o segundo peito. Na mamada seguinte, comece pelo que ficou por último.
### 4. Massagem e compressão durante a mamada
Massagear a mama durante as mamadas ajuda o leite a sair, principalmente quando o bebê começa a sugar devagar. Com a mão em "C", aperte a mama com suavidade quando ele fizer pausas longas, e solte quando ele voltar a sugar com vontade.
### 5. Tire o leite que sobrar depois da mamada
Retirar o leite que fica na mama, com a mão ou com bomba, depois das mamadas, é uma das medidas do Guia. É um estímulo a mais e ainda vira estoque para quando você precisar. Para guardar do jeito certo, veja [armazenamento do leite materno: prazos e como descongelar](${L('how-long-is-breast-milk-good-for')}).
### 6. Acorde o bebê sonolento para mamar
Recém-nascido muito sonolento mama pouco e estimula pouco. O Guia sugere fazer carinho nos pezinhos, conversar com ele e tirar um pouco da roupa quando ele dorme no peito ou não suga com vontade.
### 7. Evite mamadeira, chupeta e bico de silicone sem indicação
Cada mamadeira de complemento é uma mamada a menos no peito, e cada chupeta pode adiar um sinal de fome. O Ministério da Saúde orienta evitar mamadeiras, chupetas e bicos de silicone, e a SBP lembra que oferecer água ou chá nos intervalos diminui o estímulo do peito. Se o pediatra indicar complemento, pergunte se dá para oferecer no copinho e por quanto tempo.
### 8. Contato pele a pele
Bebê só de fralda no seu peito nu, coberto com uma manta, fica mais perto da fonte, acorda para mamar com mais facilidade e mama mais. O contato pele a pele está entre as medidas sem remédio que o TelessaúdeRS-UFRGS recomenda.
### 9. Descanso, água, comida de verdade e apoio
O Guia orienta beber água em quantidade suficiente para matar a sede, ter uma alimentação saudável e descansar sempre que possível. Cansaço e estresse pesam: a SBP lembra que o estado emocional pode influenciar a produção. Peça ajuda com a casa, a comida e as visitas. Amamentar é trabalho de tempo integral, e quem está perto pode cuidar do resto.
## Ordenha poderosa (power pumping): funciona?
A ordenha poderosa, ou power pumping, imita a mamada em cachos: você ordenha em blocos curtos com pausas, durante cerca de uma hora, uma vez por dia, por alguns dias seguidos.
[[TABLE:power]]
Seja honesta com as expectativas: não há estudos de qualidade mostrando que ela funciona melhor do que simplesmente ordenhar com mais frequência ao longo do dia. Ela faz sentido para quem já está fazendo o básico e quer um estímulo extra, ou para quem só tira leite. Ela nunca deve substituir as mamadas no peito.
Para mães que tiram leite de forma exclusiva, o ponto mais importante é a frequência. Para bebês prematuros, a SBP orienta extrair leite no mínimo 8 vezes ao dia, inclusive à noite, porque a produção noturna é maior. Veja um exemplo de rotina no nosso guia de [rotina de extração exclusiva](${EN('exclusive-pumping-schedule')}) (em inglês).
## Alimentos que aumentam o leite materno: mito ou verdade?
Canjica, cerveja preta, chá de erva-doce, muita água: toda família tem uma receita. O Guia Alimentar do Ministério da Saúde é direto: não existe comprovação de que alguma comida ou bebida aumente ou reduza a produção de leite materno.
[[TABLE:mitos]]
Isso não quer dizer que a alimentação não importe. Comer bem, com comida de verdade, faz bem para você, que está gastando muita energia. Só não vale trocar mamadas frequentes por receitas milagrosas, nem gastar o que não precisa.
## E os remédios para aumentar o leite?
Existem medicamentos que alguns médicos prescrevem para aumentar a produção, chamados galactagogos. O Ministério da Saúde fala em controvérsias sobre o uso, e o TelessaúdeRS-UFRGS explica que não há recomendação de uso rotineiro: as evidências mostram eficácia limitada e há preocupações com a segurança.
Eles só são considerados em situações específicas, depois de esgotadas as medidas sem remédio e de investigadas outras causas, como mãe ou bebê internados, relactação ou amamentação de filho adotivo. Nunca tome remédio ou suplemento para o leite por conta própria, nem por indicação de amiga ou da internet. Se acha que precisa, converse com o médico.
## Por que a produção de leite pode cair
Na maioria das vezes, a queda pode ser revertida com o manejo certo, diz o Ministério da Saúde. Causas comuns:
- **Menos mamadas:** complementos, chupeta, horários rígidos, bebê que passou a dormir longos períodos cedo demais
- **Dor e pega ruim:** fissuras e dor fazem a mãe adiar e encurtar as mamadas
- **Cansaço e estresse:** volta ao trabalho, falta de rede de apoio, noites muito difíceis
- **Separação do bebê** sem ordenha no horário em que ele mamaria
- **Nova gravidez:** a SBP cita que é comum ter menos leite durante uma nova gestação
- **Questões de saúde da mãe:** problemas de tireoide, restos de placenta e algumas cirurgias de mama, principalmente de redução, dependendo da técnica. O Guia lembra que cada caso precisa ser avaliado individualmente.
- **Medicamentos e anticoncepcionais:** pergunte ao médico se o que você usa é compatível com a amamentação, em vez de parar ou trocar sozinha
## Voltando ao trabalho: como manter a produção
Quem volta ao trabalho com o bebê ainda mamando consegue manter a produção tirando leite mais ou menos nos horários em que ele mamaria. Algumas dicas:
- **Comece o estoque algumas semanas antes**, tirando o leite que sobra depois de uma ou duas mamadas por dia.
- **Pergunte no RH** sobre as pausas para amamentação previstas na CLT e se a empresa tem sala de apoio à amamentação.
- **Mame bastante quando estiverem juntos**, principalmente de manhã cedo, à noite e nos fins de semana.
- **Combine com quem cuida do bebê** para oferecer o leite no copinho e não dar mamadeira logo antes de você chegar, para ele ainda querer o peito.
## Onde conseguir ajuda gratuita no Brasil
- **Banco de Leite Humano (BLH):** a Rede Brasileira de Bancos de Leite Humano, uma iniciativa do Ministério da Saúde com a Fiocruz, tem como objetivo apoiar, proteger e incentivar o aleitamento materno. Além de receber doações, os bancos fazem assistência em amamentação, com manejo clínico da lactação. Procure o mais perto de você no [mapa da Rede BLH](https://rblh.fiocruz.br/localizacao-dos-blhs).
- **Unidade Básica de Saúde (UBS):** a equipe de saúde da família acompanha o peso do bebê na Caderneta e pode ajudar com a pega.
- **Pediatra:** a SBP recomenda uma consulta com o pediatra ainda na gestação, a partir da 32ª semana, justamente para preparar a amamentação.
- **Consultora de amamentação com certificação IBCLC:** profissional especializada em lactação, que atende em consultório ou em casa. É um serviço particular.
## Quando procurar o pediatra ou o banco de leite
Procure ajuda no mesmo dia se o bebê:
- molha menos de 6 fraldas por dia depois do 5º dia de vida, ou o xixi fica escuro, com cheiro forte;
- ainda tem cristais alaranjados na fralda depois do 3º dia, ou o cocô continua preto e grudento no 4º ou 5º dia;
- perdeu mais de 8% a 10% do peso de nascimento, ou não está voltando a ganhar peso (a AAP considera essa a faixa de alerta);
- está muito sonolento, difícil de acordar para mamar, ou suga fraco e solta o peito logo;
- está ficando mais amarelo (icterícia), principalmente se também mama pouco;
- tem boca seca, moleira afundada ou chora sem lágrimas.
Bebê com menos de 3 meses e febre de 38 °C ou mais precisa de atendimento imediato. Em caso de dificuldade para respirar ou bebê que não reage, ligue para o SAMU (192).
E procure atendimento para você se:
- uma área da mama fica vermelha, quente, dolorida ou endurecida, principalmente com febre, calafrios ou sensação de gripe: pode ser mastite, que precisa de avaliação médica (NHS). Não pare de amamentar por conta própria;
- os mamilos estão rachados, sangrando ou a dor é forte em todas as mamadas;
- a tristeza, a ansiedade ou o cansaço não passam. Fale com o seu médico ou com a unidade de saúde. Em momentos de crise, o CVV atende 24 horas, de graça, pelo telefone 188.
## Como o MamaBee ajuda a aumentar o leite
Quando a dúvida é "ele está mamando o suficiente?", um registro simples responde mais do que a memória cansada da madrugada. No MamaBee você registra cada mamada no peito com cronômetro para o lado esquerdo e o direito, para não perder a conta de qual peito você ofereceu. Mamadeiras, extrações de leite e fraldas também entram com um toque, de graça e sem anúncios.
A linha do tempo mostra o dia inteiro, inclusive as mamadas da madrugada, e os resumos de 7 dias ajudam a ver se as mamadas e as fraldas estão aumentando depois que você mudou a rotina. Dois cuidadores ficam sincronizados em tempo real, com os dois no iPhone, para quem ajuda saber quando foi a última mamada. E, para a consulta com o pediatra ou no banco de leite, o app gera um PDF com os registros, sem você precisar lembrar de cabeça.
No Premium (${PRECO}), a Bee AI ilimitada responde às suas dúvidas do dia a dia levando em conta o registro do seu bebê. Ela não substitui a avaliação de um profissional de saúde. O MamaBee é só para iPhone.
[[CTA||Mamadas em cada peito, fraldas e extrações em um toque: veja em dias se a produção está aumentando]]
## Perguntas frequentes
### Quanto tempo leva para aumentar a produção de leite?
Varia de mãe para mãe. Muitas notam diferença depois de alguns dias de mamadas e ordenhas mais frequentes. Se em cerca de uma semana nada mudou, ou se o bebê não está ganhando peso, procure o pediatra ou o banco de leite antes disso.
### Beber muita água aumenta o leite materno?
Não. O Ministério da Saúde orienta beber água em quantidade suficiente para matar a sede. Forçar litros além da sede não aumenta a produção. Deixe uma garrafa por perto, porque amamentar dá sede.
### Cerveja preta aumenta o leite?
Não. O Ministério da Saúde explica que o álcool pode diminuir a produção de leite e passa rapidamente para o leite materno. O ideal é evitar bebidas alcoólicas durante a amamentação.
### Canjica aumenta o leite materno?
Não há comprovação. Canjica é comida e pode fazer parte de uma alimentação variada, mas o que aumenta a produção é o esvaziamento frequente da mama, não um alimento específico.
### Tirar pouco leite na bomba significa que tenho pouco leite?
Não necessariamente. O Ministério da Saúde lembra que retirar pouco leite não quer dizer que você não produz o suficiente: ordenhar exige prática. O melhor termômetro é o bebê: fraldas molhadas, ganho de peso e disposição.
### Dá para voltar a produzir leite depois de parar?
Muitas vezes, sim. É a relactação, que funciona com estímulo frequente da mama e acompanhamento profissional. Procure o banco de leite ou o pediatra o quanto antes, porque quanto menor o tempo sem amamentar, mais fácil costuma ser.
## Resumindo
A produção de leite responde ao esvaziamento da mama. Mamadas em livre demanda, de 8 a 12 por dia e também à noite, boa pega, um peito bem esvaziado antes do outro, ordenha depois das mamadas e contato pele a pele são o que realmente funciona. Canjica, cerveja preta, chás e cookies não têm comprovação, e remédio só com prescrição. Olhe para o bebê: fraldas molhadas e ganho de peso dizem mais do que o peito cheio ou vazio. Na dúvida, o banco de leite e a UBS ajudam de graça.
Quando o bebê começar a comida, por volta dos 6 meses, o leite materno continua: veja o nosso guia de [introdução alimentar](${L('when-to-start-solids')}). E se você está pensando em oferecer leite ordenhado na mamadeira, veja [como apresentar a mamadeira ao bebê amamentado](${EN('introducing-a-bottle-to-breastfed-baby')}) (em inglês).
[[CTA||Baixe o MamaBee grátis: cronômetro de cada peito, fraldas e extrações sem anúncios, para amamentar com mais confiança]]
Fontes: ${SRC.guia}; ${SRC.sbpEbook}; ${SRC.ufrgs}; ${SRC.rblh}; ${SRC.rblhMapa}; ${SRC.aapLeite}; ${SRC.oms}; ${SRC.nhsMastite}.
Revisado em 27 de novembro de 2026. ${DISCLAIMER}`),

  // ───────────────────────── 2. Armazenamento do leite materno ─────────────────────────
  A('how-long-is-breast-milk-good-for',
    'Armazenamento do leite materno: prazos e como descongelar',
    'Armazenamento do leite materno pelas regras do Brasil: 12 horas na geladeira, 15 dias no freezer, frasco de vidro, como descongelar e o que nunca fazer.',
    ['armazenamento leite materno', 'quanto tempo dura o leite materno na geladeira', 'como congelar leite materno', 'como descongelar leite materno', 'frasco de vidro para leite materno'],
    {
      prazos: {
        caption: 'Regras do Ministério da Saúde (Guia Alimentar, 2019) e da SBP para leite ordenhado em casa, para o próprio bebê.',
        headers: ['Onde está o leite', 'Por quanto tempo', 'Detalhes'],
        rows: [
          ['Fora da geladeira, logo depois de tirar', 'Não deixe', 'Guarde na geladeira ou no freezer imediatamente após a coleta (SBP)'],
          ['Geladeira, na prateleira mais perto do congelador', 'Até 12 horas', 'Temperatura máxima de 5 °C (SBP)'],
          ['Porta da geladeira', 'Nunca', 'A temperatura varia demais a cada abertura'],
          ['Congelador ou freezer', 'Até 15 dias', 'Contados da primeira coleta do frasco; temperatura de -3 °C ou menos (SBP)'],
          ['Descongelado, na geladeira', 'Até 12 horas', 'Aqueça só a porção que vai usar, em banho-maria com o fogo apagado'],
          ['Sobra no copinho, na xícara ou na colher', 'Descarte', 'Não volta para a geladeira'],
          ['Leite já descongelado', 'Não congele de novo', 'O Ministério da Saúde proíbe recongelar'],
          ['Leite para doação ao banco de leite', 'Congelado, até 10 dias', 'Depois disso, o banco precisa buscar ou receber o frasco'],
        ],
      },
      paises: {
        caption: 'Por que você encontra números diferentes na internet. Para quem mora no Brasil, valem as regras brasileiras.',
        headers: ['Situação', 'Brasil (Ministério da Saúde e SBP)', 'Estados Unidos (CDC)'],
        rows: [
          ['Temperatura ambiente', 'Não indicado: refrigerar logo após a coleta', 'Até 4 horas (até 25 °C)'],
          ['Geladeira', 'Até 12 horas', 'Até 4 dias'],
          ['Freezer', 'Até 15 dias', 'Cerca de 6 meses, aceitável até 12'],
          ['Descongelado na geladeira', 'Até 12 horas', 'Até 24 horas'],
        ],
      },
      pode: {
        caption: 'Resumo rápido para colar na geladeira.',
        headers: ['Pergunta', 'Resposta'],
        rows: [
          ['Esquentar no micro-ondas?', 'Não. Use banho-maria com o fogo apagado'],
          ['Ferver o leite?', 'Não. Ferver é só o frasco vazio, antes de usar'],
          ['Guardar na porta da geladeira?', 'Não. Use a prateleira mais perto do congelador'],
          ['Juntar leite de várias ordenhas no mesmo frasco?', 'Sim, dentro do prazo contado da primeira coleta'],
          ['Congelar de novo o leite descongelado?', 'Não'],
          ['Guardar a sobra que o bebê não tomou?', 'Não. Descarte'],
          ['Usar pote com tampa de metal?', 'Não. Tampa plástica'],
          ['Encher o frasco até a boca antes de congelar?', 'Não. Deixe 2 dedos de espaço, porque o vidro pode quebrar'],
        ],
      },
    },
`**No Brasil, o leite materno ordenhado dura até 12 horas na geladeira, na prateleira mais perto do congelador, e até 15 dias no congelador ou freezer, contados da primeira coleta. Depois de descongelado, vale por 12 horas na geladeira. Não deixe em temperatura ambiente, não use micro-ondas e nunca congele de novo.**
Se você pesquisou "quanto tempo dura o leite materno" e encontrou respostas como "4 dias na geladeira" ou "6 meses no freezer", não é impressão: os prazos americanos são bem diferentes dos brasileiros. Este guia segue as orientações do Ministério da Saúde, da Sociedade Brasileira de Pediatria (SBP) e da Rede Brasileira de Bancos de Leite Humano.
Aqui você encontra a tabela de prazos, como preparar o frasco de vidro, como tirar, guardar, descongelar e oferecer o leite, e como doar o que sobrar.
## Tabela: quanto tempo dura o leite materno
[[TABLE:prazos]]
Duas regras resolvem a maioria das dúvidas: **a validade conta a partir da primeira coleta do frasco**, e **leite que passou do prazo vai fora**, mesmo que pareça bom.
## Por que os prazos do Brasil são diferentes dos americanos?
Muitos sites e apps em português traduzem as orientações do CDC, a agência de saúde dos Estados Unidos. Elas são bem mais longas do que as brasileiras:
[[TABLE:paises]]
As regras brasileiras são mais conservadoras e seguem o mesmo cuidado usado pelos bancos de leite humano. Se você mora no Brasil, siga o Ministério da Saúde e a SBP, que são a referência do seu pediatra e do banco de leite da sua cidade. Na dúvida sobre um caso específico, pergunte a eles.
## Qual frasco usar para guardar o leite materno?
O Ministério da Saúde e a SBP orientam um **frasco de vidro com tampa plástica e boca larga**. Pode ser um vidro reaproveitado de alimento, como de café solúvel. Não use potes com tampa de metal.
Como preparar o frasco, passo a passo:
- Tire todo o rótulo e a cola do vidro, inclusive o papelzinho de dentro da tampa.
- Lave o vidro e a tampa com água e sabão, esfregando e enxaguando bem.
- Coloque vidro e tampa numa panela, cubra com água e deixe ferver por 15 minutos, contando a partir do início da fervura.
- Escorra a água e coloque o frasco e a tampa de boca para baixo sobre um pano limpo ou papel-toalha. Não enxugue.
- Quando estiver seco, feche e guarde o frasco num recipiente com tampa até usar.
E os saquinhos para leite materno vendidos em farmácias? Eles não aparecem nas orientações do Ministério da Saúde nem da SBP, que falam em vidro. Se você usar, siga as instruções do fabricante e mantenha os mesmos prazos brasileiros.
## Como tirar o leite com higiene
O jeito de tirar o leite influencia quanto tempo ele dura com segurança. O Guia Alimentar do Ministério da Saúde orienta:
- **Escolha um lugar limpo e tranquilo**, longe de animais.
- **Prenda e cubra o cabelo** com touca ou lenço, e cubra boca e nariz com máscara, fralda de pano ou lenço. Evite conversar enquanto tira o leite.
- **Tire anéis, pulseiras e relógio**, lave as mãos e os antebraços com água e sabão e seque com toalha limpa ou papel-toalha.
- **Massageie a mama** em movimentos circulares, começando pela aréola. Com a mão em "C", polegar acima da aréola e os outros dedos embaixo, firme os dedos, empurre a aréola em direção ao corpo e aperte com suavidade, sem deslizar na pele.
- **Despreze os primeiros jatos ou gotas** e então comece a coletar, mudando a posição dos dedos ao redor da aréola para esvaziar todas as áreas.
- **Alterne as mamas** quando o fluxo diminuir. No começo, leva de 20 a 30 minutos em cada mama. Com a prática, fica mais rápido, e não deve doer.
O Ministério da Saúde recomenda a retirada com as mãos. Se usar bomba manual ou elétrica, siga o manual do fabricante para lavar todas as peças depois de cada uso, porque bomba mal higienizada pode contaminar o leite e machucar o peito. Quer produzir mais? Veja [como aumentar a produção de leite materno](${L('how-to-increase-milk-supply')}).
## Como guardar o leite: rótulo, frasco e geladeira
- **Rotule o frasco** com data e hora da primeira coleta, numa etiqueta ou esparadrapo.
- **Guarde imediatamente**: no congelador ou freezer, se for para mais de 12 horas, ou na prateleira mais perto do congelador da geladeira, se for usar no mesmo dia.
- **Para completar o frasco**, tire o leite da próxima vez num outro recipiente de vidro fervido (copo, xícara ou vidro de boca larga) e, ao terminar, despeje esse leite sobre o que já está congelado no frasco.
- **Deixe 2 dedos de espaço** abaixo da tampa. Frasco cheio demais pode quebrar ao congelar.
- **A validade é a da primeira coleta.** Se você completou o frasco ao longo de 3 dias, os 15 dias contam a partir do primeiro.
- **Organize por data**, com os frascos mais antigos na frente, para serem usados primeiro.
## Como descongelar e aquecer o leite materno
1. Descongele o frasco inteiro **em banho-maria, com o fogo apagado**. A SBP orienta aquecer a água, desligar o fogo quando ela estiver em torno de 40 °C (quente, mas dá para encostar a mão sem queimar) e deixar o frasco ali até descongelar por completo.
2. **Nunca ferva o leite nem use micro-ondas.** O micro-ondas aquece de forma desigual e pode queimar a boca do bebê.
3. Agite o frasco suavemente para misturar a gordura, que costuma subir e formar uma camada.
4. Despeje só a quantidade que o bebê vai tomar agora num copinho, xícara ou colher fervidos por 15 minutos.
5. O que ficou no frasco volta para a geladeira, fora da porta, e pode ser usado em até 12 horas, sempre aquecido em banho-maria com o fogo apagado. Passado esse tempo, descarte.
6. O que sobrou no copinho, na xícara ou na colher vai fora. E leite descongelado não pode ser congelado de novo.
## Como oferecer o leite ao bebê: copinho, colher ou mamadeira?
O Ministério da Saúde orienta oferecer o leite ordenhado no copo, na xícara ou na colher, para não atrapalhar a amamentação no peito:
- Segure o bebê no colo, acordado e tranquilo, o mais sentado possível, com a cabeça firme e o pescoço alinhado ao corpo.
- Encoste a borda do copinho no lábio de baixo dele e deixe o leite apenas tocar o lábio. O bebê faz movimentos de lambida e engole.
- **Não despeje o leite na boca do bebê**, para evitar engasgo. Deixe que ele controle o ritmo.
Muitas famílias acabam usando mamadeira, principalmente quando o bebê vai para a creche. Se for o caso, converse com o pediatra e veja o nosso guia [como apresentar a mamadeira ao bebê amamentado](${EN('introducing-a-bottle-to-breastfed-baby')}) (em inglês).
## Quanto leite descongelar de cada vez?
A quantidade de leite a oferecer deve ser orientada pelos profissionais de saúde, diz o Ministério da Saúde, porque muda com a idade, o peso e a fome do bebê. Para ter uma ideia das quantidades por idade, veja [quanto o recém-nascido deve mamar](${EN('how-much-should-a-newborn-eat')}) (em inglês).
Como o leite descongelado dura só 12 horas, frascos menores ajudam a não desperdiçar. Para o dia na creche, descongele de manhã o que deve ser usado no dia, e combine com a equipe como aquecer e oferecer.
## Levando o leite para a creche ou o trabalho
- **Use bolsa térmica com gelo reciclável** e coloque o frasco na geladeira assim que chegar.
- **Os prazos não mudam:** as 12 horas da geladeira continuam contando desde a coleta, mesmo com o frasco na bolsa térmica.
- **No trabalho**, tire o leite em frascos de vidro fervidos, rotule e guarde na geladeira até a hora de ir embora. Pergunte se a empresa tem sala de apoio à amamentação.
- **Na creche**, rotule com o nome do bebê, data e hora da coleta, e combine que a sobra do copinho ou da mamadeira é descartada.
## Cor, cheiro e camadas: o leite está bom?
É normal o leite guardado se separar em camadas, com a gordura por cima: basta agitar com suavidade. A cor também muda de um dia para outro, e até ao longo da mamada. O Guia do Ministério da Saúde lembra que não se pode julgar o leite pela cor, pelo aspecto ou pelo sabor, e que não existe leite fraco.
O que manda é o prazo. Leite que passou das 12 horas na geladeira ou dos 15 dias no freezer, ou que ficou esquecido fora da geladeira, deve ser descartado. Na dúvida, jogue fora.
## Pode ou não pode: resumo rápido
[[TABLE:pode]]
## Doar o leite que sobra: como funciona
Se você tem mais leite do que o bebê precisa, ele pode ajudar bebês prematuros internados em UTI neonatal. Segundo a Rede Brasileira de Bancos de Leite Humano, iniciativa do Ministério da Saúde com a Fiocruz, a rede distribui cerca de 160 mil litros de leite humano por ano, principalmente para recém-nascidos de baixo peso.
Como funciona na prática:
- Procure o banco de leite mais perto no [mapa da Rede BLH](https://rblh.fiocruz.br/localizacao-dos-blhs). Ele faz um cadastro e explica as regras locais.
- Para doação, o leite fica congelado por no máximo 10 dias até ser entregue ou buscado pelo banco, segundo o Ministério da Saúde. Muitos bancos recolhem os frascos em casa: combine antes.
- Use o frasco de vidro fervido, rotulado com nome, data e hora da primeira coleta, e complete sempre sobre o leite já congelado, até faltarem 2 dedos para encher.
- Qualquer quantidade ajuda. O banco pasteuriza o leite antes de oferecer aos bebês.
Atenção: o bebê só deve receber o leite da própria mãe ou leite pasteurizado do banco de leite. Leite de outra mulher, sem passar pelo banco, não é seguro, mesmo que seja de alguém de confiança.
## Quando procurar ajuda
Fale com o pediatra ou procure a unidade de saúde se o bebê:
- tem febre: se tiver menos de 3 meses e 38 °C ou mais, procure atendimento imediatamente;
- tem vômitos repetidos, diarreia ou sangue nas fezes;
- recusa várias mamadas seguidas ou molha menos fraldas do que o normal (veja [quantas fraldas o recém-nascido usa por dia](${L('how-many-wet-diapers-newborn')}));
- é prematuro ou está internado: siga as regras de coleta e armazenamento da equipe da unidade neonatal, que costumam ser diferentes.
E procure atendimento para você se o peito fica vermelho, quente, dolorido ou endurecido, com febre ou sensação de gripe. Pode ser mastite, que precisa de avaliação (NHS). O banco de leite também ajuda com peito muito cheio, dor ao tirar leite e dúvidas sobre a ordenha.
## Como o MamaBee ajuda com o leite ordenhado
Rotular o frasco com a hora da primeira coleta é fácil. Lembrar, às 3 da manhã, se a última extração foi às 22h ou à meia-noite, nem tanto. No MamaBee você registra cada extração de leite e cada mamadeira com um toque, e a linha do tempo guarda o horário de tudo, de graça e sem anúncios. As mamadas no peito têm cronômetro para cada lado.
Quem fica com o bebê vê os mesmos registros: 2 cuidadores sincronizam em tempo real, com os dois no iPhone. Assim a avó ou o pai sabem quando o bebê tomou o último copinho, e você sabe, do trabalho, como foi a manhã. Se o casal reveza as madrugadas com leite ordenhado, veja também como [dividir os turnos da noite com um recém-nascido](${EN('newborn-night-shifts')}) (em inglês). Os resumos de 7 dias mostram como as mamadas e as extrações estão variando, e o app gera um PDF para levar ao pediatra.
No Premium (${PRECO}), a Bee AI ilimitada responde às suas dúvidas do dia a dia levando em conta o registro do seu bebê. Para prazos de armazenamento, a referência continua sendo esta tabela e o banco de leite. O MamaBee é só para iPhone. Quer comparar antes de baixar? Veja o nosso comparativo do [melhor aplicativo para bebê](${L('best-baby-tracker-apps-compared')}).
[[CTA||Extrações, mamadeiras e mamadas no mesmo lugar: saiba a hora de cada coleta sem depender da memória]]
## Perguntas frequentes
### Quanto tempo o leite materno dura na geladeira?
Até 12 horas, na prateleira mais perto do congelador, nunca na porta, segundo o Ministério da Saúde e a SBP. Se não for usar nesse prazo, congele logo depois de tirar.
### Quanto tempo o leite materno dura no freezer?
Até 15 dias no congelador ou freezer, contados da data e hora da primeira coleta do frasco. Depois disso, deve ser descartado.
### Leite materno pode ficar fora da geladeira?
A orientação brasileira é guardar na geladeira ou no freezer imediatamente após a coleta. A sobra que ficou no copinho depois da mamada deve ser descartada.
### Quanto tempo dura o leite materno descongelado?
Até 12 horas na geladeira, fora da porta. Aqueça só a porção que vai usar, em banho-maria com o fogo apagado, e não congele de novo.
### Pode esquentar leite materno no micro-ondas?
Não. O Ministério da Saúde orienta não ferver nem aquecer o leite no micro-ondas. Use banho-maria com o fogo apagado e agite o frasco suavemente antes de oferecer.
### Posso juntar leite de ordenhas diferentes no mesmo frasco?
Pode. Tire o leite num outro recipiente de vidro fervido e despeje sobre o leite já congelado, deixando 2 dedos de espaço. A validade é sempre a da primeira coleta.
## Resumindo
No Brasil, o leite materno ordenhado dura até 12 horas na geladeira e até 15 dias no freezer, contados da primeira coleta, e até 12 horas depois de descongelado. Use frasco de vidro com tampa plástica fervido por 15 minutos, rotule com data e hora, guarde longe da porta da geladeira, descongele em banho-maria com o fogo apagado e ofereça no copinho. Nada de micro-ondas, de recongelar ou de guardar sobras. E o leite que sobrar pode salvar um prematuro no banco de leite.
Para tirar mais leite, veja [como aumentar a produção de leite materno](${L('how-to-increase-milk-supply')}). Se você só tira leite, confira também a nossa [rotina de extração exclusiva](${EN('exclusive-pumping-schedule')}) (em inglês), e lembre que os prazos de armazenamento que valem no Brasil são os desta página.
[[CTA||Baixe o MamaBee grátis: registre cada extração e mamadeira sem anúncios e divida a rotina com quem cuida do bebê]]
Fontes: ${SRC.guia}; ${SRC.sbpEstocar}; ${SRC.sbpEbook}; ${SRC.rblh}; ${SRC.rblhMapa}; ${SRC.rblhDoacao}; ${SRC.cdcLeite}; ${SRC.nhsMastite}.
Revisado em 27 de novembro de 2026. ${DISCLAIMER}`),
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
  if (/realmlabs\.app|mamabee\.app/i.test(JSON.stringify(doc.body))) flags.push('hard-coded domain')
  if (/\d+\s?(mg|gotas|comprimido)/i.test(text)) flags.push('medicine dose?')
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
