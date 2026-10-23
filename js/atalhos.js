/*
  Atalhos do ícone e "Compartilhar com o Prumo" (app instalado no celular).
  - Atalhos (segurar o ícone): ?acao=agua bebe um copo, ?acao=tarefa abre o campo de tarefa,
    ?acao=foco abre o cronômetro de Estudos, ?acao=livro abre a Estante.
  - Compartilhar: outro app manda título, texto e link
    (manifest: share_target manda ./?titulo=&texto=&link=). O Prumo pergunta se vira tarefa ou livro (busca na Estante).
  Os parâmetros saem do endereço logo depois, para não repetir ao recarregar.
*/
"use strict";

/** Texto compartilhado: junta título, texto e link sem repetir. */
function textoCompartilhado(p) {
  const partes = [];
  for (const k of ["titulo", "texto", "link"]) {
    const v = (p.get(k) || "").trim().slice(0, 300);
    if (v && !partes.some(x => x.includes(v))) partes.push(v);
  }
  return partes.join(" ").slice(0, 400);
}

/** Um link de livro (Amazon, Skoob, Goodreads, Google Livros) ou um texto que parece título de livro. */
const pareceLivro = t => /amazon\.|skoob|goodreads|books\.google|openlibrary|isbn/i.test(t);

function focarTarefa(texto) {
  tab = "hoje";
  selDay = today();
  render();
  const q = document.getElementById("q");
  if (!q) return;
  if (texto != null) {
    q.value = texto;
    q.dispatchEvent(new Event("input", { bubbles: true })); // mostra a data e a área entendidas
  }
  q.focus();
}

function perguntarCompartilhado(texto) {
  const caixa = document.createElement("div");
  caixa.className = "compartilhar";
  caixa.setAttribute("role", "dialog");
  caixa.setAttribute("aria-label", "O que fazer com o que você compartilhou");
  const livroPrimeiro = pareceLivro(texto);
  const bt = (acao, rotulo, primario) =>
    `<button class="btn ${primario ? "primary" : ""}" type="button" data-c="${acao}">${rotulo}</button>`;
  caixa.innerHTML = `<div class="compartilhar-cartao"><b>Chegou no Prumo</b><p>${esc(texto)}</p><div class="row">${bt("tarefa", "Virar tarefa", !livroPrimeiro)}${bt("livro", "Procurar livro", livroPrimeiro)}${bt("nada", "Cancelar")}</div></div>`;
  document.body.appendChild(caixa);
  caixa.querySelector(".btn.primary").focus();
  caixa.addEventListener("click", e => {
    const b = e.target.closest("[data-c]");
    if (!b && e.target !== caixa) return;
    caixa.remove();
    const c = b ? b.dataset.c : "nada";
    if (c === "tarefa") focarTarefa(texto);
    if (c === "livro") {
      tab = "estante";
      estanteTab = "adicionar";
      // tira o endereço e deixa só palavras: a busca de livros procura melhor assim
      const busca =
        texto
          .replace(/https?:\/\/\S+/g, " ")
          .replace(/\s+/g, " ")
          .trim() || texto;
      render();
      buscarLivros(busca.slice(0, 120));
    }
  });
}

function tratarAtalho() {
  const p = new URLSearchParams(location.search);
  const acao = p.get("acao");
  const compartilhou = ["titulo", "texto", "link"].some(k => p.has(k));
  if (!acao && !compartilhou) return;
  history.replaceState(null, "", location.pathname + location.hash);
  if (!S.onboarded) return; // primeiro as boas-vindas
  if (compartilhou) {
    const texto = textoCompartilhado(p);
    if (texto) perguntarCompartilhado(texto);
    return;
  }
  if (acao === "agua") {
    const ml = S.cups[1] || S.cups[0] || 250;
    addWater(ml);
    commit();
  } else if (acao === "tarefa") focarTarefa();
  else if (acao === "foco") {
    tab = "estudos";
    render();
  } else if (acao === "livro") {
    tab = "estante";
    estanteTab = "estante";
    render();
  }
}
tratarAtalho();
