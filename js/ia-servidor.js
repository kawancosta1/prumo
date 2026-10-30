/*
  ia-servidor.js - Fala com a IA do Prumo no servidor (Cloud Function chatIA, que usa o Gemini).
  A pessoa precisa estar logada (email confirmado). A cota diária é controlada no servidor.
*/
"use strict";

/**
 * Chama o servidor. Devolve { texto, restantes, limite } ou { erro, semConta?, cota?, rede? }.
 * modo "chat": conversa em Markdown. modo "json": resposta em JSON (usado para ler edital).
 */
async function chamarServidorIA({
  modo = "chat",
  mensagem = "",
  historico = [],
  estilo = "",
  contexto = ""
} = {}) {
  const u = typeof contaUsuario !== "undefined" ? contaUsuario : null;
  if (!u || !u.emailVerified || typeof u.getIdToken !== "function") {
    return { semConta: true, erro: "Entre na sua conta para usar a IA completa." };
  }
  const base = typeof PAGAMENTO_API === "string" ? PAGAMENTO_API : "";
  if (!base) return { rede: true, erro: "IA indisponível agora." };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 55000);
  try {
    const token = await u.getIdToken();
    const r = await fetch(`${base}/chatIA`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ modo, mensagem, historico, estilo, contexto }),
      signal: ctrl.signal
    });
    const dados = await r.json().catch(() => ({}));
    if (r.ok && dados.texto) return dados;
    return { erro: dados.erro || "A IA não respondeu agora.", cota: r.status === 429, rede: r.status >= 500 };
  } catch (e) {
    return { rede: true, erro: "Sem conexão com a IA agora." };
  } finally {
    clearTimeout(timer);
  }
}

/** Histórico do chat do app -> formato do servidor */
function historicoParaServidor(hist) {
  return (Array.isArray(hist) ? hist : [])
    .filter(m => m && m.texto)
    .slice(-10)
    .map(m => ({ role: m.remetente === "user" ? "user" : "model", texto: String(m.texto).slice(0, 2000) }));
}

/** Extrai JSON de uma resposta (aceita cercas ```json e texto em volta) */
function lerJsonDaIA(texto) {
  const t = String(texto || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(t);
  } catch (e) {
    const a = t.indexOf("{");
    const b = t.lastIndexOf("}");
    if (a >= 0 && b > a) {
      try {
        return JSON.parse(t.slice(a, b + 1));
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
}

if (typeof window !== "undefined") {
  window.chamarServidorIA = chamarServidorIA;
  window.historicoParaServidor = historicoParaServidor;
  window.lerJsonDaIA = lerJsonDaIA;
}
