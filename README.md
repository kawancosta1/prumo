# Prumo: guia do código

Este é o código do Prumo, organizado para você mexer na mão.
É **HTML, CSS e JavaScript puro**: sem React, sem build, sem instalar nada.
Para rodar no seu computador, abra o `index.html` no navegador.

> No computador, os dados ficam salvos só naquele navegador (aparece "Só neste aparelho").
> A sincronização entre aparelhos e a parceria só funcionam quando o Prumo está publicado no Claude.

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
| `js/eventos.js` | Eventos com itens por tempo limitado (Halloween, Sexta-feira 13, Dia do Rock) |
| `js/conquistas.js` | Conquistas, nível (XP) e gotas (`earn()`) |
| `js/agenda.js` | Lembretes para Google, Samsung e Apple |
| `js/efeitos.js` | Confete e animações de números |
| `js/humor.js` | **Humor do Prumi** (`calcularHumor()`) |
| `js/parceria.js` | Parceria: código, dupla abraçada, poses e mimos |
| `js/telas/*.js` | Uma função por aba (`viewHoje`, `viewEstudos`...) |
| `js/telas/perfil.js` | Perfil estilo MySpace na aba Prumi: subnick, música, Top 8 e recados |
| `js/render.js` | `render()`: desenha a aba atual |
| `js/acoes.js` | Cliques (`data-act`), formulários (`data-form`) e campos (`data-change`) |
| `js/tempo.js` | Cronômetro de foco e virada do dia |
| `js/inicio.js` | Liga tudo quando a página abre |
| `estilos/*.css` | Visual: `base.css` (cores e componentes), `mascote.css`, `recursos.css`, `animacoes.css`, `responsivo.css`. Decoração própria de cada mundo em `estilos/mundos/` (ex.: `emo.css`) |

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
- `confete`: `{ cores, formas }` do confete.
- `textos`: troca títulos, ex.: `{ diario: "Querido diário", foco: "Ensaio da banda" }`.
- `humorNomes` e `humorExtra(soma)`: nomes do humor e fatores extras.
- `multiplicadorGotas()`: multiplica as gotas ganhas.
- `enfeiteHero()`: HTML extra no cartão do Prumi (no emo, a lua de hoje).
- `camadasPrumi({ mood, temRosto, temCenario })`: devolve `{ fundo, rosto }` em SVG por cima/por trás do Prumi.
- `aoTocar()`: roda ao tocar no Prumi (devolva `true` para pular a reação normal).
- `musicas` e `subnicks`: usados no Perfil.

No CSS, use `html[data-mundo="emo"]` e `html[data-variante="scene"]` para enfeitar só um mundo ou tema.

### Criar um evento com itens limitados

Em `js/eventos.js`, adicione o evento em `EVENTOS` (com `ativo(data)` e `prazo()`) e itens com `p: "*"` e `evento: "<id>"`.
Eles aparecem em todos os mundos só enquanto o evento estiver ativo. Quem comprou fica com o item.

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

## 5. Formatação

O código foi formatado com o [Prettier](https://prettier.io). A configuração está em `.prettierrc.json`.
Se você usa VS Code, instale a extensão Prettier e ele formata sozinho ao salvar.
