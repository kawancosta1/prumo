/*
  Os scripts do Prumo são clássicos: const/let/function de primeiro nível viram globais compartilhadas.
  Se dois arquivos declararem o mesmo nome com const/let/class, o navegador dá erro e o app inteiro não abre.
  Esta checagem lê os scripts na ordem do index.html e acusa nomes repetidos antes de enviar.
*/
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");

module.exports = raiz => {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const arquivos = [...html.matchAll(/<script src="([^"?]+)(\?[^"]*)?"><\/script>/g)].map(m => m[1]);
  const vistos = new Map(); // nome → { arquivo, tipo }
  const erros = [];
  for (const arq of arquivos) {
    const codigo = fs.readFileSync(path.join(raiz, arq), "utf8");
    let ast;
    try {
      ast = acorn.parse(codigo, { ecmaVersion: "latest", sourceType: "script" });
    } catch (e) {
      erros.push(`${arq}: erro de sintaxe (${e.message})`);
      continue;
    }
    const nomes = [];
    for (const n of ast.body) {
      if (n.type === "VariableDeclaration")
        for (const d of n.declarations) if (d.id.type === "Identifier") nomes.push([d.id.name, n.kind]);
      if (n.type === "FunctionDeclaration") nomes.push([n.id.name, "function"]);
      if (n.type === "ClassDeclaration") nomes.push([n.id.name, "class"]);
    }
    for (const [nome, tipo] of nomes) {
      const antes = vistos.get(nome);
      if (antes && (["let", "const", "class"].includes(tipo) || ["let", "const", "class"].includes(antes.tipo)))
        erros.push(`"${nome}" declarado em ${antes.arquivo} (${antes.tipo}) e de novo em ${arq} (${tipo}): o app não abriria`);
      else if (antes && antes.arquivo !== arq)
        console.log(`  aviso: function "${nome}" em ${antes.arquivo} é substituída por ${arq}`);
      vistos.set(nome, { arquivo: arq, tipo });
    }
  }
  console.log(`  ok  ${arquivos.length} scripts lidos, ${vistos.size} nomes globais`);
  return erros;
};
