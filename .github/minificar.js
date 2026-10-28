/*
  .github/minificar.js - Minificador seguro para deploy de produção no Firebase Hosting.
  Remove comentários e espaços em branco excessivos sem alterar variáveis globais ou lógica.
  Elimina os avisos de "unminified JavaScript and CSS files" no SEMrush e Lighthouse.
*/
const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");

function minificarCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove comentarios
    .replace(/\s+/g, " ")             // colapsa espacos
    .replace(/\s*([\{\}:;,])\s*/g, "$1") // remove espacos ao redor de pontuacao
    .replace(/;}/g, "}")              // remove ponto e virgula final
    .trim();
}

function minificarJS(js) {
  // Minificacao segura de espacos e linhas vazias preservando sintaxe e literais
  const linhas = js.split("\n");
  const limpas = [];
  let emBloco = false;

  for (let linha of linhas) {
    let l = linha.trim();
    if (!l) continue;
    
    // Tratamento basico de comentarios de bloco
    if (emBloco) {
      const fim = l.indexOf("*/");
      if (fim !== -1) {
        l = l.slice(fim + 2).trim();
        emBloco = false;
      } else {
        continue;
      }
    }
    if (l.startsWith("/*")) {
      const fim = l.indexOf("*/");
      if (fim !== -1) {
        l = l.slice(fim + 2).trim();
      } else {
        emBloco = true;
        continue;
      }
    }
    if (!l) continue;
    if (l.startsWith("//") && !l.includes("https://") && !l.includes("http://")) continue;
    
    limpas.push(l);
  }
  return limpas.join("\n");
}

function varrerDiretorio(dir, ext) {
  let arquivos = [];
  const itens = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of itens) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      arquivos = arquivos.concat(varrerDiretorio(full, ext));
    } else if (item.isFile() && item.name.endsWith(ext)) {
      arquivos.push(full);
    }
  }
  return arquivos;
}

function executar() {
  console.log("Iniciando minificação de produção...");
  const cssFiles = varrerDiretorio(path.join(RAIZ, "estilos"), ".css");
  let totalSalvoCSS = 0;

  for (const f of cssFiles) {
    const orig = fs.readFileSync(f, "utf8");
    const mini = minificarCSS(orig);
    fs.writeFileSync(f, mini, "utf8");
    totalSalvoCSS += (orig.length - mini.length);
  }
  console.log(`✓ ${cssFiles.length} arquivos CSS minificados (economia de ${Math.round(totalSalvoCSS / 1024)} KB)`);

  const jsFiles = varrerDiretorio(path.join(RAIZ, "js"), ".js");
  let totalSalvoJS = 0;

  for (const f of jsFiles) {
    const orig = fs.readFileSync(f, "utf8");
    const mini = minificarJS(orig);
    fs.writeFileSync(f, mini, "utf8");
    totalSalvoJS += (orig.length - mini.length);
  }
  console.log(`✓ ${jsFiles.length} arquivos JS minificados (economia de ${Math.round(totalSalvoJS / 1024)} KB)`);
  console.log("Minificação de produção concluída com sucesso.");
}

if (require.main === module) {
  executar();
}

module.exports = { minificarCSS, minificarJS };
