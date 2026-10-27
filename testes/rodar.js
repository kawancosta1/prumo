/*
  Roda todos os testes do Prumo: checagem de nomes globais e os testes no navegador falso (jsdom).
  Uso: cd testes && npm install && node rodar.js
*/
const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const TIPOS = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml"
};

// servidor simples com os arquivos do repositório
const servidor = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const arq = path.join(RAIZ, path.normalize(p));
  if (!arq.startsWith(RAIZ) || !fs.existsSync(arq) || fs.statSync(arq).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "Content-Type": TIPOS[path.extname(arq)] || "application/octet-stream" });
  fs.createReadStream(arq).pipe(res);
});

(async () => {
  await new Promise(ok => servidor.listen(0, "127.0.0.1", ok));
  const url = `http://127.0.0.1:${servidor.address().port}/`;
  const suites = [
    ["Nomes globais", () => require("./globais")(RAIZ)],
    ["Uso geral", () => require("./smoke")(url)],
    ["Entrada e conta", () => require("./entrar")(url)],
    ["Feedback", () => require("./feedback")(url)],
    ["Mundos Roqueiro e Emo", () => require("./mundos")(url)],
    ["Os outros 13 mundos", () => require("./mundos-novos")(url)],
    ["Otaku: Lote 1 (Itens 1 a 10)", () => require("./otaku-lote1")(url)],
    ["Otaku: Lote 2 (Itens 11 a 20)", () => require("./otaku-lote2")(url)],
    ["Otaku: Lote 3 (Itens 21 a 30)", () => require("./otaku-lote3")(url)],
    ["Otaku: Lote 4 (Itens 31 a 40)", () => require("./otaku-lote4")(url)],
    ["Otaku: Lote 5 (Itens 41 a 50)", () => require("./otaku-lote5")(url)],
    ["Otaku: Lote 6 (Itens 51 a 60)", () => require("./otaku-lote6")(url)],
    ["Feiticeiro: Lote 1 (Itens 1 a 10)", () => require("./feiticeiro-lote1")(url)],
    ["Feiticeiro: Lote 2 (Itens 11 a 20)", () => require("./feiticeiro-lote2")(url)],
    ["Feiticeiro: Lote 3 (Itens 21 a 30)", () => require("./feiticeiro-lote3")(url)],
    ["Feiticeiro: Lote 4 (Itens 31 a 40)", () => require("./feiticeiro-lote4")(url)],
    ["Feiticeiro: Lote 5 (Itens 41 a 50)", () => require("./feiticeiro-lote5")(url)],
    ["Feiticeiro: Lote 6 (Itens 51 a 60)", () => require("./feiticeiro-lote6")(url)],
    ["Bruxo: Lote 1 (Itens 1 a 10)", () => require("./bruxo-lote1")(url)],
    ["Bruxo: Lote 2 (Itens 11 a 20)", () => require("./bruxo-lote2")(url)],
    ["Bruxo: Lote 3 (Itens 21 a 30)", () => require("./bruxo-lote3")(url)],
    ["Bruxo: Lote 4 (Itens 31 a 40)", () => require("./bruxo-lote4")(url)],
    ["Bruxo: Lote 5 (Itens 41 a 50)", () => require("./bruxo-lote5")(url)],
    ["Bruxo: Lote 6 (Itens 51 a 60)", () => require("./bruxo-lote6")(url)],
    ["Melhorias Gerais: Lote 1 (Itens 1 a 10)", () => require("./melhorias-lote1")(url)],
    ["Melhorias Gerais: Lote 2 (Itens 11 a 20)", () => require("./melhorias-lote2")(url)],
    ["Melhorias Gerais: Lote 3 (Itens 21 a 30)", () => require("./melhorias-lote3")(url)],
    ["Melhorias Gerais: Lote 4 (Itens 31 a 40)", () => require("./melhorias-lote4")(url)],
    ["Melhorias Gerais: Lote 5 (Itens 41 a 50)", () => require("./melhorias-lote5")(url)],
    ["Melhorias Gerais: Lote 6 (Itens 51 a 60)", () => require("./melhorias-lote6")(url)],
    ["Melhorias Gerais: Lote 7 (Itens 61 a 70)", () => require("./melhorias-lote7")(url)],
    ["Melhorias Gerais: Lote 8 (Itens 71 a 80)", () => require("./melhorias-lote8")(url)],
    ["Melhorias Gerais: Lote 9 (Itens 81 a 90)", () => require("./melhorias-lote9")(url)],
    ["Melhorias Gerais: Lote 10 (Itens 91 a 100)", () => require("./melhorias-lote10")(url)],
    ["Melhorias Gerais: Lote 11 (Itens 101 a 110)", () => require("./melhorias-lote11")(url)],
    ["Melhorias Gerais: Lote 12 (Itens 111 a 120)", () => require("./melhorias-lote12")(url)],
    ["Melhorias Gerais: Lote 13 (Itens 121 a 130)", () => require("./melhorias-lote13")(url)],
    ["Melhorias Gerais: Lote 14 (Itens 131 a 140)", () => require("./melhorias-lote14")(url)],
    ["Melhorias Gerais: Lote 15 (Itens 141 a 150)", () => require("./melhorias-lote15")(url)],
    ["Melhorias Gerais: Lote 16 (Itens 151 a 160)", () => require("./melhorias-lote16")(url)],
    ["Novas Melhorias Gerais: Lote 1 (Itens 1 a 10)", () => require("./melhorias-gerais2-lote1")(url)],
    ["Novas Melhorias Gerais: Lote 2 (Itens 11 a 20)", () => require("./melhorias-gerais2-lote2")(url)],
    ["Novas Melhorias Gerais: Lote 3 (Itens 21 a 30)", () => require("./melhorias-gerais2-lote3")(url)],
    ["Novas Melhorias Gerais: Lote 4 (Itens 31 a 40)", () => require("./melhorias-gerais2-lote4")(url)],
    ["Novas Melhorias Gerais: Lote 5 (Itens 41 a 50)", () => require("./melhorias-gerais2-lote5")(url)],
    ["Novas Melhorias Gerais: Lote 6 (Itens 51 a 60)", () => require("./melhorias-gerais2-lote6")(url)],
    ["Novas Melhorias Gerais: Lote 7 (Itens 61 a 70)", () => require("./melhorias-gerais2-lote7")(url)],
    ["Novas Melhorias Gerais: Lote 8 (Itens 71 a 80)", () => require("./melhorias-gerais2-lote8")(url)],
    ["Novas Melhorias Gerais: Lote 9 (Itens 81 a 90)", () => require("./melhorias-gerais2-lote9")(url)],
    ["Novas Melhorias Gerais: Lote 10 (Itens 91 a 100)", () => require("./melhorias-gerais2-lote10")(url)],
    ["Novas Melhorias Gerais: Lote 11 (Itens 101 a 110)", () => require("./melhorias-gerais2-lote11")(url)],
    ["Novas Melhorias Gerais: Lote 12 (Itens 111 a 120)", () => require("./melhorias-gerais2-lote12")(url)],
    ["Novas Melhorias Gerais: Lote 13 (Itens 121 a 130)", () => require("./melhorias-gerais2-lote13")(url)],
    ["Novas Melhorias Gerais: Lote 14 (Itens 131 a 140)", () => require("./melhorias-gerais2-lote14")(url)],
    ["Novas Melhorias Gerais: Lote 15 (Itens 141 a 150)", () => require("./melhorias-gerais2-lote15")(url)],
    ["Novas Melhorias Gerais: Lote 16 (Itens 151 a 160)", () => require("./melhorias-gerais2-lote16")(url)],
    ["Novas Melhorias Gerais: Lote 17 (Itens 161 a 170)", () => require("./melhorias-gerais2-lote17")(url)],
    ["Novas Melhorias Gerais: Lote 18 (Itens 171 a 180)", () => require("./melhorias-gerais2-lote18")(url)],
    ["Novas Melhorias Gerais: Lote 19 (Itens 181 a 190)", () => require("./melhorias-gerais2-lote19")(url)],
    ["Novas Melhorias Gerais: Lote 20 (Itens 191 a 200)", () => require("./melhorias-gerais2-lote20")(url)],
    ["Novas Melhorias Gerais: Lote 21 (Itens 201 a 210)", () => require("./melhorias-gerais2-lote21")(url)],
    ["Novas Melhorias Gerais: Lote 22 (Itens 211 a 220)", () => require("./melhorias-gerais2-lote22")(url)],
    ["Novas Melhorias Gerais: Lote 23 (Itens 221 a 230)", () => require("./melhorias-gerais2-lote23")(url)],
    ["Novas Melhorias Gerais: Lote 24 (Itens 231 a 240)", () => require("./melhorias-gerais2-lote24")(url)],
    ["Novas Melhorias Gerais: Lote 25 (Itens 241 a 250)", () => require("./melhorias-gerais2-lote25")(url)],
    ["Novas Melhorias Gerais: Lote 26 (Itens 251 a 260)", () => require("./melhorias-gerais2-lote26")(url)],
    ["Novas Melhorias Gerais: Lote 27 (Itens 261 a 270)", () => require("./melhorias-gerais2-lote27")(url)],
    ["Novas Melhorias Gerais: Lote 28 (Itens 271 a 280)", () => require("./melhorias-gerais2-lote28")(url)],
    ["Novas Melhorias Gerais: Lote 29 (Itens 281 a 290)", () => require("./melhorias-gerais2-lote29")(url)],
    ["Novas Melhorias Gerais: Lote 30 (Itens 291 a 300)", () => require("./melhorias-gerais2-lote30")(url)],
    ["Social e Modo Dupla: Expansão Lote 1 (Itens 1 a 50)", () => require("./social-lote1")(url)],
    ["Social e Modo Dupla: Expansão Lote 2 (Itens 51 a 100)", () => require("./social-lote2")(url)],
    ["Social e Modo Dupla: Expansão Lote 3 (Itens 101 a 150)", () => require("./social-lote3")(url)],
    ["Social e Modo Dupla: Expansão Lote 4 (Itens 151 a 200)", () => require("./social-lote4")(url)],
    ["Pets e Mascotes: Expansão Lote 1 (Itens 201 a 250)", () => require("./pets-lote1")(url)],
    ["Pets e Mascotes: Expansão Lote 2 (Itens 251 a 300)", () => require("./pets-lote2")(url)],
    ["Pets e Mascotes: Expansão Lote 3 (Itens 301 a 350)", () => require("./pets-lote3")(url)],
    ["Pets e Mascotes: Expansão Lote 4 (Itens 351 a 400)", () => require("./pets-lote4")(url)],
    ["Estante e Leitura: Expansão Lote 1 (Itens 401 a 450)", () => require("./estante-lote1")(url)],
    ["Estante e Leitura: Expansão Lote 2 (Itens 451 a 500)", () => require("./estante-lote2")(url)],
    ["Estante e Leitura: Expansão Lote 3 (Itens 501 a 550)", () => require("./estante-lote3")(url)],
    ["Estante e Leitura: Expansão Lote 4 (Itens 551 a 600)", () => require("./estante-lote4")(url)],
    ["Mundos Visuais: Expansão Lote 1 (Zen, Rock, Emo, Otaku - 400 itens)", () => require("./mundos-visual-lote1")(url)],
    ["Mundos Visuais: Expansão Lote 2 (Gamer, Prog, Bruxo, Feiticeiro - 400 itens)", () => require("./mundos-visual-lote2")(url)],
    ["Mundos Visuais: Expansão Lote 3 (Cleanboy, Coach, Forró, Funk - 400 itens)", () => require("./mundos-visual-lote3")(url)],
    ["Mundos Visuais: Expansão Lote 4 (Pagode, Rap, Sertanejo, Trap, Vovó - 500 itens)", () => require("./mundos-visual-lote4")(url)],
    ["Top 20 Referências por Personalidade (20 x 16+)", () => require("./referencias-mundos")(url)],
    ["Averiguação Divertida da Leitura (Pet & Estante)", () => require("./leitura-averiguacao")(url)],
    ["Aprimoramento Visual Supremo (2.5D, Filtros e Física)", () => require("./visual-supremo")(url)],
    ["Cinemática de Pets Nível Triple-AAA", () => require("./pets-cinematica-aaa")(url)],
    ["Pets Masterpiece Triple-AAA (Jiggle, Rigging e Partículas)", () => require("./pets-masterpiece-aaa")(url)],
    ["Estante", () => require("./estante")(url)],
    ["Quarto (decoração nova)", () => require("./quarto")(url)],
    ["Quarto por Mundo", () => require("./quarto-mundos")(url)],
    ["Pets", () => require("./pets")(url)],
    ["Sincronia", () => require("./sincronia")(url)],
    ["Novidades", () => require("./novidades")(url)],
    ["Pets: interações", () => require("./pets-interacao")(url)],
    ["Leitura com amigos", () => require("./juntos")(url)],
    ["Mudança de endereço", () => require("./mudanca")(url)],
    ["Carteiro dos lembretes", () => require("./carteiro")()]
  ];
  let falhas = 0;
  for (const [nome, rodar] of suites) {
    console.log(`\n${nome}`);
    let erros;
    try {
      erros = await rodar();
    } catch (e) {
      erros = [String((e && e.stack) || e)];
    }
    for (const e of erros) console.log("  ERRO: " + e);
    falhas += erros.length;
  }
  servidor.close();
  console.log(falhas ? `\n${falhas} problema(s).` : "\nTudo certo.");
  process.exit(falhas ? 1 : 0);
})();
