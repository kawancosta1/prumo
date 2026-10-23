/*
  Roda todos os testes do Prumo: checagem de nomes globais e os testes no navegador falso (jsdom).
  Uso: cd testes && npm install && node rodar.js
*/
const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const TIPOS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml" };

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
    ["Estante", () => require("./estante")(url)],
    ["Leitura com amigos", () => require("./juntos")(url)],
    ["Mudança de endereço", () => require("./mudanca")(url)]
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
