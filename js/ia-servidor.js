/*
  ia-servidor.js - Fala com a IA do Prumo no servidor (Cloud Function chatIA com Gemini)
  e possui fallback automático para API de LLM gratuita em nuvem (OpenAI-compatible via Pollinations)
  com suporte nativo a Function Calling / Tool Use (<acao>{...}</acao>).
*/
"use strict";

function montarInstrucoesFerramentasIA() {
  const hojeStr = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);
  const amanhaStr = typeof addDays === "function" ? addDays(hojeStr, 1) : hojeStr;
  return `
FERRAMENTAS E AÇÕES AUTOMÁTICAS DO APLICATIVO PRUMO (TOOL CALLING):
Você não é apenas um chat passivo — você controla o aplicativo Prumo para o usuário.
Sempre que o usuário pedir ou relatar uma ação abaixo (em qualquer formato de frase, gíria ou erro de digitação), responda normalmente de forma humana E inclua no final da sua resposta uma tag <acao>JSON_VALIDO</acao> em uma única linha:

1. REGISTRAR ÁGUA / HIDRATAÇÃO (ex: "bebi 1 litro de água", "tomei dois copos d'água", "hidratei 500ml"):
<acao>{"tipo":"registrar_agua","ml":1000}</acao>
(Regras: 1 litro = 1000, meio litro = 500, 1 copo = 250, 1 garrafinha = 500).

2. CRIAR TAREFA OU BLOCO DE ESTUDO (ex: "vou estudar cálculo amanhã às 16h por 1h30", "marca academia hoje 19h"):
<acao>{"tipo":"criar_tarefa","titulo":"Estudar Cálculo","data":"${amanhaStr}","hora":"16:00","duracaoMin":90,"area":"estudo","prioridade":2}</acao>
(Datas: hoje = "${hojeStr}", amanhã = "${amanhaStr}", ou "AAAA-MM-DD". Áreas válidas: "estudo", "trabalho", "dieta", "casa", "lazer").

3. REAGENDAR / ADIAR TAREFAS ATRASADAS OU PENDENTES (ex: "remarca minhas tarefas atrasadas para amanhã", "joga as pendências de hoje pra amanhã"):
<acao>{"tipo":"remarcar_tarefas","filtro":"atrasadas","dataDestino":"${amanhaStr}"}</acao>
(filtro: "atrasadas" ou "pendentes").

4. CRIAR FLASHCARDS SM-2 SOBRE QUALQUER MATÉRIA OU ASSUNTO (ex: "cria flashcards sobre Cálculo", "faz 3 flashcards de Direito Constitucional"):
<acao>{"tipo":"criar_flashcards","materia":"Cálculo","cards":[{"frente":"Pergunta objetiva 1?","verso":"Resposta clara e direta 1."},{"frente":"Pergunta objetiva 2?","verso":"Resposta clara e direta 2."},{"frente":"Pergunta objetiva 3?","verso":"Resposta clara e direta 3."}]}</acao>

Se a mensagem do usuário for apenas uma dúvida, conversa ou pedido de explicação teórica sem ação no app, responda normalmente sem emitir a tag <acao>.`;
}

async function chamarApiGratuitaLLM({
  modo = "chat",
  mensagem = "",
  historico = [],
  estilo = "",
  contexto = ""
} = {}) {
  const ehJsdom =
    typeof navigator !== "undefined" &&
    /jsdom/i.test(navigator.userAgent || "") &&
    !(typeof window !== "undefined" && window.__permitirFetchIAEmTeste);
  if (ehJsdom || typeof fetch !== "function") return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 22000);
  try {
    const promptSistema =
      modo === "json"
        ? "Você é um extrator estruturado de editais e planos de estudo. Responda EXCLUSIVAMENTE em JSON válido, sem blocos markdown."
        : [
            "Você é a IA oficial do aplicativo Prumo. Você conversa sobre QUALQUER assunto (estudos, matérias da faculdade, concursos, programação, ciência, rotina, carreira ou bate-papo geral) em português do Brasil.",
            estilo ? `Estilo da personalidade ativa:\n${estilo}` : "",
            contexto ? `${contexto}` : "",
            montarInstrucoesFerramentasIA(),
            "Use Markdown limpo (**negrito**, listas, tabelas quando útil). Seja direto, inteligente e natural."
          ]
            .filter(Boolean)
            .join("\n\n");

    const messages = [{ role: "system", content: promptSistema }];
    if (modo === "chat" && Array.isArray(historico)) {
      historico.slice(-8).forEach(h => {
        if (h && h.texto) {
          messages.push({
            role: h.role === "user" ? "user" : "assistant",
            content: String(h.texto).slice(0, 2000)
          });
        }
      });
    }
    messages.push({ role: "user", content: String(mensagem) });

    const r = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages,
        temperature: modo === "json" ? 0.2 : 0.7
      }),
      signal: ctrl.signal
    });
    if (!r.ok) return null;
    const dados = await r.json().catch(() => null);
    const txt =
      dados &&
      dados.choices &&
      dados.choices[0] &&
      dados.choices[0].message &&
      dados.choices[0].message.content;
    if (txt && String(txt).trim()) {
      return { texto: String(txt).trim(), fonte: "api-gratuita" };
    }
    return null;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Chama o servidor (Cloud Function Gemini) e, se não estiver publicado (404) ou sem conta,
 * usa automaticamente a API de LLM gratuita em nuvem (Pollinations OpenAI).
 */
async function chamarServidorIA({
  modo = "chat",
  mensagem = "",
  historico = [],
  estilo = "",
  contexto = ""
} = {}) {
  const u = typeof contaUsuario !== "undefined" ? contaUsuario : null;
  const base = typeof PAGAMENTO_API === "string" ? PAGAMENTO_API : "";

  if (u && u.emailVerified && typeof u.getIdToken === "function" && base) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 18000);
    try {
      const token = await u.getIdToken();
      const r = await fetch(`${base}/chatIA`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          modo,
          mensagem,
          historico,
          estilo,
          contexto: (contexto || "") + "\n" + montarInstrucoesFerramentasIA()
        }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const dados = await r.json().catch(() => ({}));
      if (r.ok && dados.texto) return dados;
      if (r.status === 429) {
        return { erro: dados.erro || "Limite diário atingido.", cota: true };
      }
    } catch (_) {
      clearTimeout(timer);
    }
  }

  // Fallback automático para API de LLM Gratuita (OpenAI-compatible) sem precisar de chave nem Cloud Function
  const gratis = await chamarApiGratuitaLLM({ modo, mensagem, historico, estilo, contexto });
  if (gratis && gratis.texto) return gratis;

  if (!u || !u.emailVerified) {
    return { semConta: true, erro: "Entre na sua conta para usar a IA completa." };
  }
  return { rede: true, erro: "Sem conexão com a IA agora." };
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
  window.chamarApiGratuitaLLM = chamarApiGratuitaLLM;
  window.montarInstrucoesFerramentasIA = montarInstrucoesFerramentasIA;
  window.historicoParaServidor = historicoParaServidor;
  window.lerJsonDaIA = lerJsonDaIA;
}
