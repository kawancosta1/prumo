/*
  ia.js - regras puras da IA do Prumo (sem rede, sem Firebase): limpeza de entrada, limites e
  montagem do pedido ao Gemini. Fica separado do index.js para ser testado com node puro.
*/
"use strict";

const LIMITE_GRATIS = 15; // mensagens por dia
const LIMITE_PRO = 300;
const MAX_MENSAGEM = 4000;
const MAX_EDITAL = 40000;
const MAX_HISTORICO = 10;

function limparTexto(v, max) {
  return String(v == null ? "" : v)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u202a-\u202e\u2066-\u2069]/g, "")
    .slice(0, max);
}

/** Dia (YYYY-MM-DD) no fuso de Brasília, para zerar a cota à meia-noite daqui */
function diaBrasilia(agora) {
  return new Date(agora - 3 * 3600 * 1000).toISOString().slice(0, 10);
}

function limiteDiario(proAtivo) {
  return proAtivo ? LIMITE_PRO : LIMITE_GRATIS;
}

/** Conta uma mensagem na cota do dia. Devolve { ok, uso } sem mexer em nada fora do objeto novo. */
function contarUso(atual, agora, proAtivo) {
  const dia = diaBrasilia(agora);
  const n = atual && atual.dia === dia && Number.isFinite(atual.n) ? atual.n : 0;
  const limite = limiteDiario(proAtivo);
  if (n >= limite) return { ok: false, limite, uso: { dia, n } };
  return { ok: true, limite, restantes: limite - n - 1, uso: { dia, n: n + 1 } };
}

/** Histórico do app -> contents do Gemini (alterna user/model e sempre começa e termina em user) */
function montarContents(historico, mensagem, max) {
  const contents = [];
  (Array.isArray(historico) ? historico : []).slice(-MAX_HISTORICO).forEach(m => {
    if (!m || typeof m !== "object") return;
    const role = m.role === "model" ? "model" : "user";
    const texto = limparTexto(m.texto, 2000);
    if (!texto) return;
    const ultimo = contents[contents.length - 1];
    if (ultimo && ultimo.role === role) ultimo.parts[0].text += "\n" + texto;
    else contents.push({ role, parts: [{ text: texto }] });
  });
  while (contents.length && contents[0].role !== "user") contents.shift();
  while (contents.length && contents[contents.length - 1].role === "user") contents.pop();
  contents.push({ role: "user", parts: [{ text: limparTexto(mensagem, max || MAX_MENSAGEM) }] });
  return contents;
}

function montarSistemaChat(estilo, contexto) {
  return [
    "Você é o Prumi, a IA do aplicativo Prumo, e funciona como um assistente completo, no estilo do Gemini.",
    "Responda qualquer assunto: estudos, matemática passo a passo, programação, redação, resumos, ideias, textos, explicações e planejamento.",
    "Responda em português do Brasil, a menos que a pessoa escreva em outro idioma.",
    "Use Markdown: listas, **negrito**, tabelas simples e blocos de código com crases quando for código.",
    "Seja direto e claro. Mostre o raciocínio quando ajudar a entender. Se não souber ou não tiver certeza, diga isso em vez de inventar.",
    "Para edital, lei, data de prova e valor de taxa, avise que a fonte oficial manda e que a pessoa deve conferir.",
    "Não ajude a trapacear em prova nem com conteúdo perigoso. Em saúde, dê informação geral e indique procurar um profissional.",
    estilo ? "Jeito de falar (personalidade do mascote): " + limparTexto(estilo, 1500) : "",
    contexto ? "Dados do app da pessoa (use só se ajudar): " + limparTexto(contexto, 1500) : ""
  ]
    .filter(Boolean)
    .join("\n");
}

const SISTEMA_JSON =
  "Você é um assistente de planejamento de estudos. Responda SOMENTE com JSON válido, sem crases de markdown e sem texto fora do JSON.";

function extrairTextoGemini(data) {
  const partes =
    data &&
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts;
  if (!Array.isArray(partes)) return "";
  return partes.map(p => (p && typeof p.text === "string" ? p.text : "")).join("");
}

module.exports = {
  LIMITE_GRATIS,
  LIMITE_PRO,
  MAX_MENSAGEM,
  MAX_EDITAL,
  limparTexto,
  diaBrasilia,
  limiteDiario,
  contarUso,
  montarContents,
  montarSistemaChat,
  SISTEMA_JSON,
  extrairTextoGemini
};
