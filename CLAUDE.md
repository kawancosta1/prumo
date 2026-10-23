# Prumo: instruções para o Claude

Prumo é um organizador pessoal (tarefas, estudos, água, hábitos, vida social) com o mascote Prumi.
O dono é o Kawan. Ele fala português do Brasil, informal, e prefere respostas curtas e diretas.
O site fica no Firebase Hosting: https://prumo-66d76.web.app (publicado a partir da branch `main`).
O endereço antigo (https://kawancosta1.github.io/prumo, GitHub Pages) continua no ar só para levar os dados de quem usa sem conta (`js/mudanca.js`).

## Como trabalhar neste repositório

- Fluxo padrão: o Kawan manda um pedido, você implementa, testa e **faz commit e push direto na `main`**
  (a Action `.github/workflows/testes.yml` roda os testes e, se passarem, publica o site **e as regras do Firestore** no Firebase). Não abra PR, a não ser que ele peça.
- Mensagens de commit em português, curtas, dizendo o que mudou para o usuário.
- Depois de enviar, responda em poucas linhas o que mudou e lembre que o site atualiza em 1 a 2 minutos.

## Arquitetura (leia o README.md para o mapa completo)

- HTML, CSS e JavaScript puro. Sem build, sem framework, sem dependências.
- `index.html` carrega `estilos/*.css` e depois os scripts de `js/` **numa ordem fixa**: cada arquivo usa o que veio antes.
  Se criar um arquivo novo, adicione o `<script>` no lugar certo da lista.
- Scripts clássicos (não são módulos): `const`/`let`/`function` de primeiro nível ficam visíveis para os arquivos seguintes.
- Todos os dados estão no objeto `S` (`js/estado.js`). Para mudar algo: altere `S` e chame `commit()` (salva e redesenha).
- Cada aba é uma função `view...()` em `js/telas/` que devolve HTML como texto. Botões usam `data-act`, tratados em `js/acoes.js`.
- Um arquivo por personalidade em `js/mundos/`: `PERSONAS.x` (falas), `THEMES.x` (cores, fonte, água) e `ITEMS.push(...)` (roupas).
- O mascote é SVG desenhado por `prumi()` em `js/mascote/desenho.js` (área 120 x 154; olhos em (47,64) e (73,64)).
- Sempre use `esc()` em texto vindo do usuário antes de colocar no HTML.

## Regras de dados

- Sem conta, os dados ficam no `localStorage` do navegador (um por endereço). `window.claude` não existe lá,
  então sincronização e parceria ficam desligadas (o app mostra "Só neste aparelho"). Não quebre esse caminho.
- Ao mudar o formato de `S`, trate dados antigos em `normalize()` (`js/estado.js`) para ninguém perder nada.

## Como testar antes de enviar

- Rode os testes: `cd testes && npm install && node rodar.js` (nomes globais repetidos, uso geral, entrada e feedback, no jsdom).
  Eles também rodam sozinhos no GitHub a cada push (`.github/workflows/testes.yml`). Fluxo novo? Acrescente um teste em `testes/`.
- Abra o `index.html` num navegador (ou Playwright/jsdom) e confira que não há erro no console.
- Teste o fluxo mexido: boas-vindas, criar tarefa, marcar como feita, beber água, abrir a aba Prumi e a loja.
- Rode o Prettier com a configuração do repositório: `npx prettier --write "js/**/*.js" "estilos/*.css"`.

## Publicação (Firebase Hosting)

- `firebase.json` define o que sobe, o cache e os cabeçalhos de segurança (CSP). Script novo de outro site?
  Acrescente o domínio na CSP, senão o navegador bloqueia. Não use `onclick=`/`onload=` no HTML (a CSP bloqueia scripts inline).
- A Action usa o segredo `FIREBASE_SERVICE_ACCOUNT` do GitHub. Sem ele, os testes rodam mas nada é publicado.
- Mexeu em `firestore.rules`? Vai sozinho no push, depois de passar nos testes de `testes/regras/rodar.js`
  (acrescente casos lá para coleção nova).
- Não precisa trocar `?v=` à mão para o site no ar: a publicação carimba tudo com o commit (`.github/carimbar.sh`).
- O repositório é público: logs das Actions nunca podem mostrar dados de usuário.
- Avisos para a pessoa: use `notificar({ titulo, texto, tipo, mood, aba })` (banner + som), não `alert`.

## Estilo

- Textos da interface em português do Brasil, frases curtas e diretas, sem travessões.
- Funciona no celular (cerca de 400px de largura) e no modo claro e escuro.
- Respeite `prefers-reduced-motion` em animações novas.
