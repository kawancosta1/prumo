# Prumo: guia do código

Este é o código do Prumo, organizado para você mexer na mão.
É **HTML, CSS e JavaScript puro**: sem React, sem build, sem instalar nada.
Para rodar no seu computador, abra o `index.html` no navegador.

> No computador, os dados ficam salvos só naquele navegador (aparece "Só neste aparelho").
> A sincronização entre aparelhos e a parceria funcionam no Artifact do Claude ou, no site (Firebase Hosting, https://prumo-66d76.web.app), com a conta Google (Firebase) ligada em `js/firebase-config.js`.

---

## 1. Como o app funciona (a ideia geral)

Pense no Prumo como **uma planilha + uma função que desenha a tela**:

1. **Todos os dados ficam num objeto só, chamado `S`** (de "state", estado).
   Tarefas, água, hábitos, gotas, roupas: tudo está dentro de `S`. Ele é criado em `js/estado.js`.
2. **Quando algo muda**, o código altera `S` e chama `commit()`.
   O `commit()` salva os dados (no navegador e na sua conta) e chama `render()`.
3. **`render()` apaga a tela e desenha tudo de novo** a partir de `S`.
   Cada aba é uma função que devolve o HTML como texto, por exemplo `viewHoje()`.

```
você clica  →  acoes.js muda S  →  commit()  →  salva  →  render()  →  tela nova
```

Por isso, para mudar o que aparece numa aba, você mexe na função `view...` dela.
Para mudar o que um botão faz, você procura o `data-act` dele em `js/acoes.js`.

---

## 2. Mapa dos arquivos

A **ordem dos scripts no `index.html` importa**: cada arquivo pode usar o que veio antes.

| Arquivo | O que tem |
|---|---|
| `js/util.js` | Datas (`today()`, `addDays()`), `esc()` para texto seguro, ícones, link do Google Agenda |
| `js/captura-rapida.js` | Entende "estudar amanhã 19h #estudo !1" |
| `js/estado.js` | O objeto `S`, salvar e carregar, sincronizar com a conta, `toast()` |
| `js/calculos.js` | Água do dia, sequência de hábitos, próxima data de tarefa repetida |
| `js/componentes.js` | Pedaços reaproveitados: linha de tarefa, widget de água, gráfico |
| `js/mascote/desenho.js` | **O desenho do Prumi** (`prumi()`): corpo, rostos, água, camadas de roupa |
| `js/mascote/roupas-base.js` | Formas prontas para desenhar roupas: `tee()`, `hoodie()`, `cap()`... |
| `js/mascote/falas.js` | O que o Prumi fala no balão (`mascotContext()`) e reações (`react()`) |
| `js/personalidades.js` | `say()` (falas da personalidade atual), `setPersona()` |
| `js/temas.js` | Aplica as cores do mundo atual, modo claro/escuro, água |
| `js/mundos/*.js` | **Um arquivo por personalidade**: falas, tema e itens da loja |
| `js/mundos/emo-roupas.js` | Guarda-roupa extra do Emo: fedora, véu, moicano, maquiagem, jaqueta de couro, bolsa de sangue, pets, cenários (quarto, galeria, palco, show, igreja, janela) e a pele que brilha |
| `js/mundos/emo-efeitos.js` | Efeitos especiais do Emo: sangue na troca de aba, lua real, sol, caixão, segredo dos 13 toques |
| `js/mundos/rock-roupas.js` | Guarda-roupa extra do Roqueiro, por era (anos 70, glam, punk, grunge, metal, rockabilly) e do videogame de guitarra: cabelões, maquiagem, coletes, controle de 5 trastes, guitarra em V, baixo, pets, cenários (amplificadores, estádio, estrada de notas) |
| `js/mundos/rock-efeitos.js` | Efeitos do Roqueiro: notas coloridas caindo ao trocar de aba, medidor da plateia, Star Power (gotas x2 por 30 min), turnê da semana, letra do dia, riff secreto dos 6 toques |
| `js/mundos/rock-extras.js` | Roqueiro, parte 2: guarda-roupa extra, setlist numerada com **bis** (tarefa bônus com gotas em dobro), **Ensaio relâmpago** (minijogo de ritmo de 30 s, 1x por dia vale gotas), **Sua banda** (amigos na bateria, baixo, guitarra e teclado) e **ingressos** colecionáveis (semana com 5+ shows). Dados em `S.rock` |
| `js/mundos/emo-extras.js` | Emo, parte 2: **madrugada** (cartão escuro, olheiras e falas da meia-noite às 5h), **chuva no vidro** durante o foco, **cartas pro futuro**, **Querido diário** com cadeado de PIN e **mixtape montável** (manda para amigos). Dados em `S.emo` |
| `js/eventos.js` | Eventos com itens por tempo limitado (Halloween, Sexta-feira 13, Dia do Rock, Dia dos Namorados e Natal gótico) |
| `js/conquistas.js` | Conquistas, nível (XP) e gotas (`earn()`) |
| `js/agenda.js` | Lembretes para Google, Samsung e Apple |
| `js/efeitos.js` | Confete e animações de números |
| `js/humor.js` | **Humor do Prumi** (`calcularHumor()`) |
| `js/parceria.js` | Parceria: código, dupla abraçada, poses e mimos |
| `js/internet2000.js` | Internet dos anos 2000 no perfil: status de MSN e "Ouvindo:", depoimentos com aprovação, comunidades (selos por conquista), contador de visitas, fundos do perfil e o Fotolog do dia |
| `js/sons.js` | Sons dos mundos, gerados com WebAudio. Emo: chuva no foco e virar página. Roqueiro: plateia no foco, palhetada ao concluir tarefa, acorde do Star Power e riff secreto (dá pra desligar) |
| `js/leitura.js` | Estante de leitura (estilo Skoob): livros, progresso, notas, metas, moeda "páginas", conquistas de leitura, busca na Open Library e no Google Books e leitor de código de barras |
| `js/leitura-dia.js` | Leitura no dia a dia: **sessão de leitura** com cronômetro, Prumi de óculos e sons ambiente (biblioteca, café, chuva, lareira), **meta do dia** (páginas ou minutos, anel no cartão do Prumi), **sequência** de dias lendo ou estudando com **escudos**, e previsão de término dos livros |
| `js/leitura-metas.js` | Metas e recompensas (Estante → Metas): **missões da semana** com baú de troféu, **desafio do mês** com selo, **marcos** a cada 500 páginas, **mapa do ano**, **passaporte** de carimbos, **retrospectiva** e os **gêneros** dos livros (chips no detalhe). Troféus são enfeites que só se ganham (`premio: true`) |
| `js/leitura-estudo.js` | Estudo junto com a leitura: **livro de estudo** ligado a uma matéria (a sessão de leitura conta como estudo), **minutos de foco viram páginas** para decorar, **plano de prova** (horas até a prova viram meta por dia) e **fichamento** que vira revisão espaçada. Carrega depois de `acoes.js` (estende `logTimer`) |
| `js/leitura-amigos.js` | Leitura com amigos: **corrida da semana** (páginas + minutos), **leitura em dupla**, **clube do livro** sem spoiler (comentários escondidos até sua página), **recomendar livro** pela caixa e **empréstimos** com lembrete de devolução. Aba Juntos da Estante |
| `js/estante-enfeites.js` | Móveis, paredes e enfeites da estante (comprados com páginas; alguns só aparecem num mundo) |
| `js/telas/estante.js` | Aba Estante: desenho da estante, Lendo agora, Adicionar, Livros, Metas e Decorar |
| `js/firebase-config.js` | A configuração do Firebase (enquanto for `null`, o app fica só no aparelho) |
| `js/conta.js` | Conta pelo Firebase (Google ou email): login, nome de usuário (@) e o bloco Conta em Ajustes. As regras do banco estão em `firestore.rules` |
| `js/mudanca.js` | Mudança de endereço: no site antigo (GitHub Pages) mostra a faixa "O Prumo mudou de endereço" e leva os dados no `#` do link; no novo, recebe só se o aparelho ainda não tiver dados ali |
| `firebase.json` | Publicação no Firebase Hosting: arquivos que sobem, cache e cabeçalhos de segurança (CSP). A Action publica o site e as regras a cada push na `main` |
| `js/telas/entrar.js` | Tela de entrada ao abrir o app: entrar com Google, criar conta e entrar com email e senha (confirmação por link no email), esqueci a senha e continuar sem conta (`S.semConta`). Para ter conta: 18 anos ou mais e aceite da política e dos dados de saúde (`S.consentimento`). Mudou a política? Troque `POLITICA_VERSAO` e todos aceitam de novo |
| `js/telas/feedback.js` | Aba Feedback: ideia, problema ou elogio vai para prumi.prumo@gmail.com com o assunto FEEDBACK, pelo FormSubmit (formsubmit.co). Sem internet, abre o app de email preenchido |
| `privacidade.html` | Política de privacidade (LGPD). Contato: prumi.prumo@gmail.com |
| `js/amigos.js` | Amigos (com a conta Google): pedidos, vitrine (o que amigos veem), caixa de avisos (recados, depoimentos, mimos, par, visitas), bloqueio, visto por último, convite por link e QR, apagar conta |
| `js/telas/amigos.js` | Telas de Amigos (lista, perfil do amigo, privacidade) e Avisos (o sininho do topo) |
| `js/pwa.js` | Prumo instalável no celular (service worker `sw.js`) e avisos do sistema |
| `sw.js`, `manifest.webmanifest`, `icones/` | O app instalável: guarda o Prumo no aparelho (troque `VERSAO` no `sw.js` para forçar uma atualização geral) |
| `js/capas.js` | Capas desenhadas com título estilizado (6 estilos) para livros sem foto |
| `js/quarto.js` | Quarto de leitura: chão, janela, pôster, cama, tapete e luz comprados com páginas, com a estante dentro |
| `js/casa.js` | Casa da leitura: cômodos além do quarto (sala, cozinha, quintal com céu pela hora, varanda, escritório, sótão, cripta no emo, estúdio no rock e a biblioteca secreta com 1.000 páginas). Comprados com páginas, com opções de cor grátis. Dados em `S.leitura.decor.casa` |
| `js/telas/*.js` | Uma função por aba (`viewHoje`, `viewEstudos`...) |
| `js/telas/perfil.js` | Perfil estilo MySpace na aba Prumi: subnick, música, Top 8 e recados |
| `js/render.js` | `render()`: desenha a aba atual |
| `js/acoes.js` | Cliques (`data-act`), formulários (`data-form`) e campos (`data-change`) |
| `js/tempo.js` | Cronômetro de foco e virada do dia |
| `js/inicio.js` | Liga tudo quando a página abre |
| `estilos/*.css` | Visual: `base.css` (cores e componentes), `mascote.css`, `recursos.css`, `animacoes.css`, `responsivo.css`. Decoração própria de cada mundo em `estilos/mundos/` (ex.: `emo.css`, `rock.css`) |

---

## 3. Receitas (como fazer as coisas mais comuns)

### Adicionar uma roupa nova

1. Abra o mundo da personalidade, por exemplo `js/mundos/emo.js`.
2. No `ITEMS.push(...)`, copie um item parecido e troque os campos:

```js
{
  id: "emo_meu_chapeu",   // único no app inteiro
  p: "emo",               // de qual mundo ele é
  slot: "hat",            // onde vai (veja a lista abaixo)
  name: "Meu chapéu",     // nome na loja
  price: 90,              // preço em gotas (ou ach: "produtivo" para lendário)
  svg: () => `<path d="..." fill="#141416" ${O}/>`
}
```

**Slots:** `hat` chapéu, `hair` cabelo, `face` olhos, `cheek` maquiagem, `mouth` boca, `skin` pele,
`neck` pescoço, `top` roupa, `waist` cintura, `pins` bottons, `back` costas, `wrist` pulso, `hand` mão, `pet` companheiro, `string` fio, `bg` cenário.

**Dicas para desenhar:**
- O Prumi é desenhado numa área de **120 x 154**. O corpo vai mais ou menos de x=20 a x=100.
- Os olhos ficam em (47, 64) e (73, 64), a boca perto de y=78, e o "pescoço" em y≈84.
- `${O}` é o contorno padrão (linha escura). Use em quase tudo.
- Itens de mão e pulso recebem `(x, y)`: use `H(x, y, "...desenho...")` para desenhar em volta de (0, 0).
- Itens de rosto e boca recebem o humor (`m`), para se encaixar em cada expressão.
- Pele tem `color` (cor do corpo) e `ink` (cor do rosto). Pode ter `svg()` também: o desenho fica por cima do corpo, por baixo da roupa (ex.: brilhinhos em `emo_pele_brilho`).
- Animações prontas no CSS do emo: `class="chama"` (vela), `brilhinho`, `vapor`, `pisca`, `neon`, `holofote` e `orbita-x`/`orbita-y` (pet voando em volta).

### Mudar as falas de uma personalidade

No arquivo do mundo, edite `PERSONAS.emo = { ... }`.
Cada fala pode ser um texto ou uma lista de textos (aí ele escolhe uma).
`{nome}`, `{n}` e `{ml}` são trocados pelo nome, pelo número de tarefas e pelos mL.

### Mudar cores ou água de um mundo

No arquivo do mundo, edite `THEMES.emo = { ... }`:
- `L` e `D` são as cores no modo claro e no escuro: `[fundo, cartões, texto, destaque, água, corpo do Prumi]`.
- `water` define o nome, a velocidade da onda (`spd`), a altura da onda (`amp`) e o que flutua (`part`).
- `vars` são os temas extras do mundo (com `price` para comprar, ou `ach` para lendário).

### Dar efeitos especiais a um mundo (`MUNDO_FX`)

Cada mundo pode ter um objeto `MUNDO_FX.<mundo>` com ganchos opcionais (veja o exemplo completo em `js/mundos/emo-efeitos.js`):
- `trocaAba()`: roda ao trocar de aba (no emo, o sangue escorrendo).
- `secaoHoje()`: devolve HTML de seções extras no fim da aba Hoje (no rock: bis, ensaio, banda e ingressos; no emo: cartas, diário e mixtape).
- `contextoMascote()`: devolve `{ mood, msg }` para o Prumi falar algo próprio do mundo naquele momento (no emo, a madrugada), ou `""`.
- `diarioTrancado()`: `true` esconde a nota do dia fechado na aba Hoje (cadeado do diário no emo).
- `confete`: `{ cores, formas }` do confete.
- `textos`: troca títulos, ex.: `{ diario: "Querido diário", foco: "Ensaio da banda" }`.
- `humorNomes` e `humorExtra(soma)`: nomes do humor e fatores extras.
- `multiplicadorGotas()`: multiplica as gotas ganhas.
- `enfeiteHero()`: HTML extra no cartão do Prumi (no emo, a lua de hoje).
- `camadasPrumi({ mood, temRosto, temCenario })`: devolve `{ fundo, rosto }` em SVG por cima/por trás do Prumi.
- `aoTocar()`: roda ao tocar no Prumi (devolva `true` para pular a reação normal).
- `musicas` e `subnicks`: usados no Perfil.
- `legendasFotolog`: legendas das fotos do Fotolog.
- `habitosSugeridos`: lista de hábitos que aparecem como sugestão na aba Hábitos.
- `poemaDoDia()`: devolve um poema (texto). Mostra o botão "Poema do dia" no diário (o nome do botão vem de `textos.poemaBotao`; no rock é "Letra do dia").
- `aoConcluir(tarefa)`: roda quando uma tarefa é concluída pela primeira vez (no rock, enche a barra do Star Power).
- `resumoSemana()`: devolve HTML de um resumo da semana na aba Hoje (no emo, a "Mixtape da semana").
- Nas telas, use `temGancho("nome")` para saber se o mundo tem um gancho e `ganchoMundo("nome")` para chamá-lo.

Textos que cada mundo pode trocar em `textos` (chave → texto padrão): `tarefas`, `adicionar`, `vazioHoje`, `atrasadas`,
`trazerTudo`, `fecharDia`, `fecharComPendentes` (use `{n}`), `diaFechado`, `reabrir`, `diaPerfeito`, `adicionarHabito`,
`vazioHabitos`, `vazioCompromissos`, `vazioPessoas`, `vazioEstudos`, `conviteTitulo`, `conviteDica`, `conviteBotao`,
`pedidoChegou`, `poemaBotao`, `poemaFala`, os nomes dos sons (`sonsTitulo`, `somFoco`, `somFocoNome`, `somFocoDica`,
`somTarefa`, `somTarefaNome`, `somTarefaDica`) e `conquista_<id>` (nome de uma conquista).

### Mundo Roqueiro (videogame de guitarra)

- Cada tarefa concluída é uma "nota": as caixinhas viram notas nas cores dos 5 trastes (verde, vermelho, amarelo, azul, laranja).
- Tarefas de prioridade alta são "notas estrela": brilham e enchem mais a barra do Star Power (34% contra 20%).
- Com a barra cheia, um toque no cartão do Prumi liga o Star Power: 30 minutos de gotas em dobro e tudo fica azul elétrico.
  Os dados ficam em `S.rock = { energia, starAte, usos }`.
- O cartão do Prumi mostra o medidor da plateia (vermelho, amarelo, verde), a dificuldade do dia (Fácil a Expert) e o multiplicador (x1 a x4).
- A "Turnê da semana" dá de 1 a 5 estrelas para cada dia (tarefas feitas e meta de água), em palcos que crescem com o nível.
- Conquistas: Star Power (5 ativações), Solo épico (10 tarefas num dia), Turnê completa (14 dias seguidos) e o secreto Riff.
- Regra: nada de nome, logo ou letra de banda real. Bandas, turnês e letras são inventadas.

No CSS, use `html[data-mundo="emo"]` e `html[data-variante="scene"]` para enfeitar só um mundo ou tema.

### Registrar um botão novo sem mexer no `acoes.js`

Arquivos novos podem registrar seus próprios cliques, formulários e campos (os registros ficam em `js/util.js`):

```js
ACOES_EXTRAS["meu-botao"] = (botao, id) => { /* data-act="meu-botao" */ };
FORMS_EXTRAS.meuForm = () => { /* data-form="meuForm" */ };
MUDANCAS_EXTRAS["meu-campo"] = campo => { /* data-change="meu-campo" */ };
```

### Fotolog, comunidades e MSN

- Fotolog: `tirarFotolog()` roda ao fechar o dia e guarda a foto em `S.fotolog` (uma por dia, até 40).
  Cada mundo pode ter legendas próprias em `MUNDO_FX.<mundo>.legendasFotolog`.
- Comunidades: lista `COMUNIDADES` em `js/internet2000.js`. Cada uma tem `ach` (a conquista que libera).
- Status do MSN, "Ouvindo:" e depoimentos vão no perfil público da parceria (`montarPerfil()` em `js/parceria.js`).

### Criar um evento com itens limitados

Em `js/eventos.js`, adicione o evento em `EVENTOS` (com `ativo(data)` e `prazo()`) e itens com `p: "*"` e `evento: "<id>"`.
Eles aparecem em todos os mundos só enquanto o evento estiver ativo. Quem comprou fica com o item.

### Criar um enfeite da estante

Em `js/estante-enfeites.js`, adicione em `ENFEITES`. O desenho fica em volta de (0, 0), que é o meio da base, em pé na prateleira:

```js
{ id: "abajur", nome: "Abajur", preco: 60, w: 20, mundo: "emo",
  svg: () => `<rect x="-6" y="-20" width="12" height="20" fill="#C8102E"/>` }
```

`w` é a largura na prateleira, `mundo` deixa o enfeite só naquele mundo e `ach` no lugar de `preco` faz dele lendário.

### Criar uma conquista

Em `js/conquistas.js`, adicione um item em `ACHS`:

```js
{ id: "madrugador", name: "Madrugador", desc: "Concluir 10 tarefas antes das 9h",
  goal: 10, cur: () => S.stats.cedo, reward: 60 }
```

Use `secreta: true` para ela aparecer como "???" até ser descoberta. `cur()` diz quanto falta. Quando `cur() >= goal`, a conquista é liberada sozinha.

### Mexer no humor

Em `js/humor.js`, dentro de `calcularHumor()`, cada fator é uma linha com `soma(pontos, "motivo")`.
Para criar um fator novo, por exemplo "estudou hoje":

```js
const minutos = S.sessions.filter(s => s.date === hoje).reduce((a, b) => a + b.min, 0);
if (minutos >= 30) soma(6, "estudou 30 min hoje");
```

O motivo aparece sozinho na lista que abre ao tocar na barra de humor.

### Criar uma pose nova da dupla

Poses que valem para namoro e amizade ficam em `POSES_EXTRAS` (ex.: "Foto de Fotolog" e "Dividindo a franja"). Use `semCabelo: true` para tirar cabelo e chapéu dos dois na pose.

Em `js/parceria.js`, adicione uma pose em `POSES.namoro` ou `POSES.amizade`.
Cada pose diz a posição (`x`), a rotação (`rot`) e o rosto (`mood`) de cada Prumi, e um enfeite (`extra`) em SVG.

---

## 4. Glossário de nomes curtos

O código tem alguns nomes curtos herdados do protótipo:

| Nome | Significa |
|---|---|
| `S` | Todos os dados salvos (o estado) |
| `fx` | Efeitos para o próximo `render()` (confete, item novo, água subindo) |
| `commit()` | Salva e redesenha |
| `persist()` | Só salva |
| `react(humor, texto)` | O Prumi reage por alguns segundos |
| `say("chave")` | Fala da personalidade atual |
| `esc(texto)` | Deixa texto seguro para colocar no HTML (use sempre com texto do usuário) |
| `earn(n)` | Dá (ou tira) gotas |
| `ITEM[id]` | Acha um item pelo id |
| `TH()` | Tema do mundo atual |

---

## 5. Testes

Na pasta `testes/` (não fazem parte do site): `cd testes && npm install && node rodar.js`.
- `globais.js`: acusa dois arquivos declarando o mesmo nome global (isso impediria o app de abrir).
- `smoke.js`, `entrar.js`, `feedback.js`: abrem o Prumo num navegador falso (jsdom) e usam o app como uma pessoa.
Também rodam no GitHub a cada push. Se aparecer um X vermelho no commit, algo quebrou.

## 6. Formatação

O código foi formatado com o [Prettier](https://prettier.io). A configuração está em `.prettierrc.json`.
Se você usa VS Code, instale a extensão Prettier e ele formata sozinho ao salvar.
