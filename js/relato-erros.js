/*
  Relato de erros (só com o aceite em Ajustes, Seus dados): quando algo quebra no app de alguém,
  a mensagem técnica vai para a coleção "erros" do Firestore (só leitura pelo Console do Firebase).
  Vai: mensagem do erro, arquivo e linha, versão do app e navegador. Nada do que a pessoa escreveu.
  Limites: só com conta, no máximo 5 relatos por visita e sem repetir o mesmo erro.
  Carrega logo no começo para pegar erros de qualquer arquivo; envia quando a conta estiver pronta.
*/
"use strict";

const relatosPendentes = [];
const relatosEnviados = new Set();
let relatosNaVisita = 0;

/** Versão do app: o carimbo da publicação (?v= dos scripts) ou "dev". */
const versaoDoApp = () => {
  const s = document.querySelector('script[src*="js/util.js"]');
  const m = s && /[?&]v=([\w.-]+)/.exec(s.getAttribute("src"));
  return m ? m[1].slice(0, 20) : "dev";
};

function guardarErro(msg, arquivo, linha) {
  msg = String(msg || "erro").slice(0, 500);
  // o endereço do site sai; fica só o arquivo (js/hoje.js:120)
  const onde = `${String(arquivo || "")
    .replace(location.origin + "/", "")
    .replace(/\?.*$/, "")}:${linha || 0}`.slice(0, 200);
  const chave = msg + "|" + onde;
  if (relatosEnviados.has(chave) || relatosPendentes.length > 10) return;
  relatosEnviados.add(chave);
  relatosPendentes.push({
    msg,
    onde,
    versao: versaoDoApp(),
    em: Date.now(),
    navegador: navigator.userAgent.slice(0, 120)
  });
  setTimeout(enviarRelatos, 1000);
}

window.addEventListener("error", e => {
  if (!e.message || /^Script error\.?$/.test(e.message)) return; // erro de outro site, sem detalhes
  guardarErro(e.message, e.filename, e.lineno);
});
window.addEventListener("unhandledrejection", e => {
  const r = e.reason;
  if (r && (r.code || r.name === "AbortError")) return; // falha de rede ou do Firebase já tratada pelo app
  guardarErro(
    "Promessa sem tratamento: " + ((r && (r.message || r)) || "?"),
    (r && r.stack && (/(https?:\/\/[^\s)]+):(\d+)/.exec(r.stack) || [])[1]) || "",
    (r && r.stack && (/:(\d+):\d+\)?\s*$/m.exec(r.stack) || [])[1]) || 0
  );
});

function enviarRelatos() {
  if (typeof S === "undefined" || !S.relatarErros) return (relatosPendentes.length = 0);
  if (typeof modoFirebase !== "function" || !modoFirebase() || !banco) return; // tenta de novo no próximo erro
  while (relatosPendentes.length && relatosNaVisita < 5) {
    relatosNaVisita++;
    banco
      .collection("erros")
      .add(relatosPendentes.shift())
      .catch(() => {});
  }
  relatosPendentes.length = 0;
}

function relatoErrosAjustesHTML() {
  const comConta = typeof modoFirebase === "function" && modoFirebase();
  return `<div class="setrow"><div class="lbl"><b>Relatar erros</b><span class="note">${comConta ? "Se algo quebrar, manda só a mensagem técnica do erro (nada do que você escreveu) para eu consertar." : "Funciona com conta. Sem conta nada sai do aparelho."}</span></div><button class="btn small ${S.relatarErros ? "" : "ghost"}" data-act="relatar-erros" aria-pressed="${!!S.relatarErros}" ${comConta ? "" : "disabled"}>${S.relatarErros ? "Ligado" : "Desligado"}</button></div>`;
}
ACOES_EXTRAS["relatar-erros"] = () => {
  S.relatarErros = !S.relatarErros;
  commit();
  toast(S.relatarErros ? "Valeu! Se algo quebrar, eu fico sabendo." : "Relato de erros desligado.");
};
