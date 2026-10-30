/*
  markdown-ia.js - Renderizador de Markdown seguro para as respostas da IA.
  Tudo é escapado ANTES de virar HTML (a IA e o texto da pessoa nunca entram como marcação).
  Suporta: títulos, listas, tabelas, citações, código (com botão copiar), negrito, itálico,
  código em linha e links https.
*/
"use strict";

function escMd(s) {
  return String(s == null ? "" : s).replace(
    /[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

function mdInline(texto) {
  let s = escMd(texto);
  const codigos = [];
  s = s.replace(/`([^`\n]+)`/g, (m, c) => {
    codigos.push(c);
    return "\u0000" + (codigos.length - 1) + "\u0000";
  });
  s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*\w])\*([^*\s][^*\n]*?)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)"]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => "<code>" + codigos[+i] + "</code>");
}

function mdCelulas(linha) {
  return linha
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(c => c.trim());
}

function renderizarMarkdownSeguro(src) {
  const linhas = String(src == null ? "" : src)
    .replace(/\r\n?/g, "\n")
    .split("\n");
  const html = [];
  let i = 0;
  const ehLista = l => /^\s*([-*•]|\d+[.)])\s+\S/.test(l);
  const ehTabelaSep = l => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.includes("-");
  const ehEspecial = l => /^\s*(```|#{1,4}\s|>\s?|---+\s*$)/.test(l) || ehLista(l);

  while (i < linhas.length) {
    const l = linhas[i];
    if (!l.trim()) {
      i++;
      continue;
    }
    const cerca = /^\s*```\s*([\w+-]*)/.exec(l);
    if (cerca) {
      const cod = [];
      i++;
      while (i < linhas.length && !/^\s*```/.test(linhas[i])) cod.push(linhas[i++]);
      i++;
      const lang = escMd(cerca[1] || "");
      html.push(
        `<pre class="ia-code"><div class="ia-code-topo"><span>${lang || "código"}</span><button type="button" class="ia-copiar-codigo" data-act="ia-copiar-codigo">Copiar</button></div><code>${escMd(cod.join("\n"))}</code></pre>`
      );
      continue;
    }
    const tit = /^\s*(#{1,4})\s+(.+?)\s*#*\s*$/.exec(l);
    if (tit) {
      html.push(`<h4 class="ia-h ia-h${tit[1].length}">${mdInline(tit[2])}</h4>`);
      i++;
      continue;
    }
    if (/^\s*---+\s*$/.test(l)) {
      html.push("<hr>");
      i++;
      continue;
    }
    if (/^\s*>\s?/.test(l)) {
      const q = [];
      while (i < linhas.length && /^\s*>\s?/.test(linhas[i])) q.push(linhas[i++].replace(/^\s*>\s?/, ""));
      html.push(`<blockquote>${q.map(mdInline).join("<br>")}</blockquote>`);
      continue;
    }
    if (l.includes("|") && i + 1 < linhas.length && ehTabelaSep(linhas[i + 1])) {
      const cab = mdCelulas(l);
      i += 2;
      const corpo = [];
      while (i < linhas.length && linhas[i].includes("|") && linhas[i].trim())
        corpo.push(mdCelulas(linhas[i++]));
      html.push(
        `<div class="ia-tabela"><table><thead><tr>${cab.map(c => `<th>${mdInline(c)}</th>`).join("")}</tr></thead><tbody>${corpo
          .map(r => `<tr>${cab.map((_, k) => `<td>${mdInline(r[k] || "")}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`
      );
      continue;
    }
    if (ehLista(l)) {
      const ordenada = /^\s*\d+[.)]/.test(l);
      const itens = [];
      while (i < linhas.length && ehLista(linhas[i])) {
        itens.push(linhas[i++].replace(/^\s*([-*•]|\d+[.)])\s+/, ""));
      }
      const tag = ordenada ? "ol" : "ul";
      html.push(`<${tag}>${itens.map(t => `<li>${mdInline(t)}</li>`).join("")}</${tag}>`);
      continue;
    }
    const par = [];
    while (i < linhas.length && linhas[i].trim() && !ehEspecial(linhas[i])) par.push(linhas[i++]);
    if (!par.length) par.push(linhas[i++]);
    html.push(`<p>${par.map(mdInline).join("<br>")}</p>`);
  }
  return html.join("");
}

if (typeof window !== "undefined") {
  window.renderizarMarkdownSeguro = renderizarMarkdownSeguro;
}
if (typeof ACOES_EXTRAS !== "undefined") {
  ACOES_EXTRAS["ia-copiar-codigo"] = b => {
    const cod = b && b.closest("pre") && b.closest("pre").querySelector("code");
    if (!cod) return;
    const texto = cod.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(texto).catch(() => {});
    b.textContent = "Copiado ✓";
    setTimeout(() => {
      b.textContent = "Copiar";
    }, 2000);
  };
}
if (typeof module !== "undefined" && module.exports) module.exports = { renderizarMarkdownSeguro };
