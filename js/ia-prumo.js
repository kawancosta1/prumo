/*
  js/ia-prumo.js - Motor de Inteligência Artificial Generativa e Coach Interativo do Prumo
  Disponibiliza:
  1. Chat conversacional ao vivo com o Mascote/Coach na voz de cada personalidade (Funkeiro, Emo, Monge, Militar, etc.).
  2. Raciocínio Explícito (Chain of Thought): visualização do processo de reflexão da IA (<details class="ia-thought-card">).
  3. Motor Dual: Chamada a LLMs reais (Google Gemini Flash, Groq, OpenAI) com fallback autônomo neuro-contextual 100% offline.
  4. Quebra Inteligente de Metas (Smart Goal Breakdown): transforma qualquer objetivo livre em hábitos e tarefas com 1 clique.
  5. Configuração BYOK (Bring Your Own Key) com chaves gratuitas do Google Gemini / Groq.
*/
"use strict";

const IA_CONFIG_PADRAO = {
  provedor: "gemini", // "gemini" | "groq" | "openai" | "autonomo"
  chave: "",
  modelo: "gemini-1.5-flash",
  temperatura: 0.7
};

function obterConfigIA() {
  if (typeof S === "undefined" || !S) return { ...IA_CONFIG_PADRAO };
  if (!S.iaConfig || typeof S.iaConfig !== "object") {
    S.iaConfig = { ...IA_CONFIG_PADRAO };
  }
  // Tentar restaurar chave salva no localStorage seguro caso exista
  try {
    const salva = localStorage.getItem("prumo_ia_key");
    if (salva && !S.iaConfig.chave) S.iaConfig.chave = salva;
    const provSalvo = localStorage.getItem("prumo_ia_provider");
    if (provSalvo) S.iaConfig.provedor = provSalvo;
  } catch (e) {}
  return S.iaConfig;
}

function salvarConfigIA(provedor, chave) {
  const cfg = obterConfigIA();
  cfg.provedor = provedor || "gemini";
  cfg.chave = (chave || "").trim();
  try {
    localStorage.setItem("prumo_ia_key", cfg.chave);
    localStorage.setItem("prumo_ia_provider", cfg.provedor);
  } catch (e) {}
  if (typeof commit === "function") commit();
  return cfg;
}

/* ---------- Personalidades & Diretrizes de Voz da IA ---------- */
const PERSONA_PROMPTS = {
  funkeiro: {
    titulo: "MC Prumi (Visão de Cria)",
    estilo: `Você é o MC Prumi, um cria autêntico, animado e consciente da quebrada. Você fala com gírias legítimas: "visão de cria", "o papo é reto", "marcha no progresso", "esquece", "tá moscando", "sem neurose", "deus ajuda quem corre atrás", "o corre não para", "tá favorável". Você é focado em vencer na vida, trabalhar duro, cuidar da saúde e nunca deixar a preguiça vencer. Você dá choques de realidade com carinho e sabedoria de rua. Suas respostas são ágeis, animadas e inspiradoras.`
  },
  emo: {
    titulo: "Prumi Melancólico (Introspecção & Sentimento)",
    estilo: `Você é o Prumi Emo/Melancólico. Sensível, dramático, meio vampiro e leal até o fim. Usa expressões da cultura emo dos anos 2000: "coração sombrio", "vampiro", "delineado", "música acústica no escuro", "XD", "=]", "affs...", "lágrimas filtradas", "morceguês <3", "o vazio". Você entende profundamente as dores, a ansiedade e o cansaço do usuário, valida o drama existencial dele, mas canaliza essa intensidade sentimental para riscar as tarefas e conquistar a paz interior no escuro do seu quarto.`
  },
  zen: {
    titulo: "Mestre Prumi (Zen & Sabedoria)",
    estilo: `Você é o Mestre Prumi, um sábio e calmo guia espiritual. Você ensina a respirar com calma, focar no momento presente, não se desesperar com o excesso de pendências e valorizar pequenos passos consistentes. Linguagem serena, acolhedora, lúcida e pacífica.`
  },
  militar: {
    titulo: "Comandante Prumi (Tático & Disciplina)",
    estilo: `Você é o Comandante Prumi. Foco absoluto em disciplina operacional, prontidão tática e execução sem desculpas. Usa vocabulário militar: "missão cumprida", "procedimento padrão", "sem hesitação", "alvo neutralizado". Direto, objetivo e altamente motivador.`
  },
  cleanboy: {
    titulo: "Prumi Cleanboy (Estético & Minimalista)",
    estilo: `Você é o Prumi Cleanboy. Valoriza organização estética, skincare, ambiente perfumado e minimalismo produtivo. Fala sobre mente limpa, mesa arrumada, rotina fluida e elegância nos hábitos diários.`
  },
  coach: {
    titulo: "Coach Prumi (Alta Performance & Mindset)",
    estilo: `Você é o Coach Prumi. Focado em mindset de crescimento, produtividade 10x, hábitos atômicos e resiliência antifrágil. Linguagem enérgica, estratégica, desafiadora e orientada a resultados mensuráveis.`
  },
  gamer: {
    titulo: "Prumi Gamer (Loot & Boss Fights)",
    estilo: `Você é o Prumi Gamer. Enxerga a rotina do usuário como um RPG épico: cada tarefa é uma quest com recompensa em XP, os hábitos diários são buffs e a procrastinação é um Boss a ser derrotado com combos de foco.`
  },
  programador: {
    titulo: "Prumi Dev (Clean Code & Algoritmo)",
    estilo: `Você é o Prumi Dev. Enxerga o dia a dia como arquitetura de software: tarefas são issues e commits, hidratação é garbage collection e foco é execução single-thread sem race conditions.`
  },
  sertanejo: {
    titulo: "Prumi Boiadeiro (Lida & Viola)",
    estilo: `Você é o Prumi Boiadeiro. Fala manso, com sabedoria da roça, café forte passado na hora, simplicidade do campo e persistência inabalável na lida de sol a sol.`
  },
  forrozeiro: {
    titulo: "Prumi Forrozeiro (Xote & Calor)",
    estilo: `Você é o Prumi Forrozeiro. Ritmo de zabumba e sanfona, calor humano, xote e alegria. Motiva o usuário no compasso do arrasta-pé, tornando até a tarefa mais pesada leve e gostosa de cumprir.`
  },
  pagodeiro: {
    titulo: "Prumi Pagodeiro (Resenha & Cavaquinho)",
    estilo: `Você é o Prumi Pagodeiro. Clima de roda de samba de domingo, pandeiro e cavaquinho. Transforma as obrigações num clima descontraído e positivo, sempre com um sorriso e bate na palma da mão.`
  },
  rapper: {
    titulo: "Prumi MC (Boom-Bap & Consciência)",
    estilo: `Você é o Prumi Rapper. Métrica afiada, rimas conscientes, batida clássica de boom-bap e visão de resistência. Valoriza a disciplina, o respeito e a persistência na caminhada.`
  },
  trapper: {
    titulo: "Prumi Trapstar (Drop & Hype)",
    estilo: `Você é o Prumi Trapstar. Flow moderno, graves 808, drip, estética futurista e mentalidade de vencer no topo. Incentiva o usuário a ser autêntico e focado em alcançar o próximo nível.`
  },
  vovo: {
    titulo: "Vovó Prumi (Acolhimento & Café de Vó)",
    estilo: `Você é a Vovó Prumi. Muito carinhosa, fala com ternura ("meu benzinho", "meu coração"), oferece bolo de fubá quentinho, mas dá puxãozinho de orelha doce pra não esquecer de beber água e não se desgastar.`
  },
  bruxo: {
    titulo: "Arquimago Prumi (Arcano & Alquimia)",
    estilo: `Você é o Arquimago Prumi. Trata os hábitos como feitiços diários, a água como poção de vitalidade e mana, e a preguiça como uma maldição a ser transmutada com determinação arcana.`
  },
  feiticeiro: {
    titulo: "Arquimago Prumi (Arcano & Alquimia)",
    estilo: `Você é o Arquimago Prumi. Trata os hábitos como feitiços diários, a água como poção de vitalidade e mana, e a preguiça como uma maldição a ser transmutada com determinação arcana.`
  },
  rock: {
    titulo: "Prumi Rocker (Atitude & Alta Energia)",
    estilo: `Você é o Prumi Rocker. Muita energia, atitude rebelde contra a mesmice e a procrastinação. Manda o usuário aumentar o volume e destruir a preguiça como um riff potente de guitarra elétrica.`
  },
  otaku: {
    titulo: "Prumi Sensei (Espírito Shonen)",
    estilo: `Você é o Prumi Sensei. Vê o usuário como o protagonista de um anime shonen que está em pleno arco de treinamento para superar seus limites. Fala de força de vontade inabalável, foco e nunca desistir.`
  },
  padrao: {
    titulo: "Prumi (Companheiro de Rotina)",
    estilo: `Você é o Prumi, o mascote fiel, acolhedor e inteligente do usuário no app Prumo. Você é amigável, positivo, dá conselhos claros e práticos para organização de tarefas, hidratação, foco e bem-estar.`
  }
};

function obterPersonaAtual() {
  const pId = typeof S !== "undefined" && S && S.persona ? S.persona : "padrao";
  return PERSONA_PROMPTS[pId] || PERSONA_PROMPTS.padrao;
}

/* ---------- Contexto em Tempo Real do Usuário ---------- */
function obterContextoUsuarioPrumo() {
  if (typeof S === "undefined" || !S) {
    return "Usuário iniciando no Prumo. Sem dados cadastrados ainda.";
  }
  const t = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);
  const tarefasHoje = Array.isArray(S.tasks) ? S.tasks.filter(x => x.date === t) : [];
  const concluidas = tarefasHoje.filter(x => x.done).map(x => x.title || x.txt || "Tarefa");
  const pendentes = tarefasHoje.filter(x => !x.done).map(x => x.title || x.txt || "Tarefa");
  const aguaAtual = typeof waterToday === "function" ? waterToday() : 0;
  const metaAgua = S.waterGoal || 2000;
  const streak = S.streak || 0;
  const nivel = typeof levelOf === "function" ? levelOf(S.xp || 0) : 1;
  const nome = S.name || "Guerreiro(a)";
  const hora = new Date().getHours();
  const turno = hora < 12 ? "Manhã" : hora < 18 ? "Tarde" : "Noite";

  return `
DADOS DO USUÁRIO NO PRUMO:
- Nome: ${nome}
- Turno atual: ${turno} (${hora}h)
- Nível do mascote: Nível ${nivel} | Dias seguidos de foco: ${streak} dias
- Tarefas concluídas hoje (${concluidas.length}): ${concluidas.length ? concluidas.join(", ") : "Nenhuma ainda"}
- Tarefas pendentes hoje (${pendentes.length}): ${pendentes.length ? pendentes.join(", ") : "Nenhuma pendência"}
- Hidratação: ${aguaAtual}ml bebidos de ${metaAgua}ml meta
- Mundo / Personalidade ativa: ${S.persona || "padrão"}
`;
}

/* ---------- Parser de Raciocínio (Chain of Thought) ---------- */
function separarPensamentoECorpo(raw) {
  if (!raw) return { pensamento: "", texto: "", toString() { return this.texto; } };
  let texto = String(raw);
  let pensamento = "";

  // 1. Tags XML: <thought>...</thought> ou <think>...</think>
  const matchTag = texto.match(/<(?:thought|think)>([\s\S]*?)<\/(?:thought|think)>/i);
  if (matchTag) {
    pensamento = matchTag[1].trim();
    texto = texto.replace(/<(?:thought|think)>[\s\S]*?<\/(?:thought|think)>/gi, "").trim();
  } else if (/^(?:Pensamento|Racioc[íi]nio|Reflex[ãa]o):\s*/i.test(texto)) {
    // 2. Prefixo textual estruturado
    const partes = texto.split(/(?:\n\s*){2,}|(?:\n(?:Resposta|Coach|Mascote):\s*)/i);
    if (partes.length > 1) {
      pensamento = partes[0].replace(/^(?:Pensamento|Racioc[íi]nio|Reflex[ãa]o):\s*/i, "").trim();
      texto = partes.slice(1).join("\n\n").replace(/^(?:Resposta|Coach|Mascote):\s*/i, "").trim();
    }
  }

  return {
    pensamento,
    texto,
    toString() {
      return this.texto;
    }
  };
}

/* ---------- Chamada a LLM em Nuvem (Gemini, Groq, OpenAI) ---------- */
async function chamarProvedorLLM(promptUsuario, mensagensAnteriores = []) {
  const cfg = obterConfigIA();
  const persona = obterPersonaAtual();
  const contexto = obterContextoUsuarioPrumo();

  const systemInstruction = `${persona.estilo}
Você é o assistente e coach interativo dentro do aplicativo Prumo.
${contexto}

DIRETRIZES COGNITIVAS OBRIGATÓRIAS:
1. RACIOCÍNIO EXPLÍCITO (<thought>...</thought>):
Antes de responder, você DEVE pensar detalhadamente dentro das tags <thought> e </thought>, cobrindo:
- 🔍 Intenção do usuário e estado emocional.
- 📊 Diagnóstico Prumo: tarefas concluídas vs pendentes, hidratação, streak.
- 🎭 Lente da Persona (${persona.titulo}): como sua personalidade única interpreta essa situação.
- 💡 Decisão Tática: qual conselho ou choque de realidade é o mais cirúrgico e humano.

2. RESPOSTA FINAL (Fora das tags <thought>):
- Responda em português do Brasil, mantendo de forma autêntica o tom da persona ${persona.titulo}.
- Seja conciso, humano e empático (2 a 4 parágrafos curtos).
- Use os dados reais do usuário (cite tarefas reais ou hidratação).
- NUNCA use tags HTML como <b> ou <br> — use apenas Markdown padrão (**negrito**, *itálico*).`;

  // 1. Google Gemini 1.5 Flash (Padrão e Recomendado)
  if (cfg.provedor === "gemini" && cfg.chave) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(cfg.chave)}`;
    const contents = [];

    // Formatação de histórico estritamente compatível com o Gemini:
    // O Gemini exige que a lista comece com role 'user' e alterne entre 'user' e 'model'.
    const rawHist = (mensagensAnteriores || []).slice(-6);
    rawHist.forEach(m => {
      const role = m.remetente === "user" ? "user" : "model";
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += "\n" + (m.texto || "");
      } else {
        contents.push({ role, parts: [{ text: m.texto || "" }] });
      }
    });
    while (contents.length > 0 && contents[0].role !== "user") {
      contents.shift();
    }
    contents.push({
      role: "user",
      parts: [{ text: promptUsuario }]
    });

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: cfg.temperatura || 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Erro na API Gemini (${resp.status}): ${err}`);
    }
    const data = await resp.json();
    const textoResp = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textoResp) return separarPensamentoECorpo(textoResp);
  }

  // 2. Groq ou OpenAI (formato OpenAI Chat Completions)
  if ((cfg.provedor === "groq" || cfg.provedor === "openai") && cfg.chave) {
    const endpoint =
      cfg.provedor === "groq"
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
    const modelo = cfg.provedor === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

    const messages = [{ role: "system", content: systemInstruction }];
    (mensagensAnteriores || []).slice(-6).forEach(m => {
      messages.push({
        role: m.remetente === "user" ? "user" : "assistant",
        content: m.texto
      });
    });
    messages.push({ role: "user", content: promptUsuario });

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.chave}`
      },
      body: JSON.stringify({
        model: modelo,
        messages,
        temperature: cfg.temperatura || 0.7,
        max_tokens: 1000
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Erro na API (${resp.status}): ${err}`);
    }
    const data = await resp.json();
    const textoResp = data?.choices?.[0]?.message?.content;
    if (textoResp) return separarPensamentoECorpo(textoResp);
  }

  // 3. IA Generativa Real Gratuita Global (Pollinations AI - Llama 3.3 / GPT-4o-mini sem necessidade de chave)
  try {
    const messages = [{ role: "system", content: systemInstruction }];
    (mensagensAnteriores || []).slice(-6).forEach(m => {
      messages.push({
        role: m.remetente === "user" ? "user" : "assistant",
        content: m.texto
      });
    });
    messages.push({ role: "user", content: promptUsuario });

    const resp = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: "openai",
        temperature: cfg.temperatura || 0.7
      })
    });

    if (resp.ok) {
      const textoResp = await resp.text();
      if (textoResp && textoResp.trim().length > 0) {
        return separarPensamentoECorpo(textoResp);
      }
    }
  } catch (err) {
    console.warn("[IA Prumo] Provedor gratuito indisponível, usando motor autônomo:", err);
  }

  // 4. Fallback autônomo neuro-contextual offline com raciocínio integrado
  return gerarRespostaAutonomaIA(promptUsuario);
}

/* ---------- Chamada de IA Especializada em Modo JSON Puro ---------- */
async function chamarLLMModoJSON(promptSistema, promptUsuario) {
  const cfg = obterConfigIA();

  // 1. Google Gemini (se chave configurada)
  if (cfg.provedor === "gemini" && cfg.chave) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(cfg.chave)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: promptSistema }] },
          contents: [{ role: "user", parts: [{ text: promptUsuario + "\nIMPORTANTE: Responda EXCLUSIVAMENTE em formato JSON puro, sem formatação markdown ou crases ao redor." }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.5 }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt) return JSON.parse(txt.replace(/```json/g, "").replace(/```/g, "").trim());
      }
    } catch (e) {
      console.warn("[IA Prumo] Erro no Gemini JSON:", e);
    }
  }

  // 2. Groq ou OpenAI (se chave configurada)
  if ((cfg.provedor === "groq" || cfg.provedor === "openai") && cfg.chave) {
    try {
      const endpoint = cfg.provedor === "groq" ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
      const modelo = cfg.provedor === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.chave}` },
        body: JSON.stringify({
          model: modelo,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: promptSistema },
            { role: "user", content: promptUsuario + "\nResponda em formato JSON puro estrito." }
          ],
          temperature: 0.5
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const txt = data?.choices?.[0]?.message?.content;
        if (txt) return JSON.parse(txt.replace(/```json/g, "").replace(/```/g, "").trim());
      }
    } catch (e) {
      console.warn("[IA Prumo] Erro no Groq/OpenAI JSON:", e);
    }
  }

  // 3. Provedor Gratuito Real Global (Pollinations AI com jsonMode nativo)
  try {
    const resp = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: promptSistema },
          { role: "user", content: promptUsuario + "\nResponda EXCLUSIVAMENTE em formato JSON puro, sem crases de markdown." }
        ],
        model: "openai",
        jsonMode: true,
        temperature: 0.5
      })
    });
    if (resp.ok) {
      const txt = await resp.text();
      if (txt) {
        const jsonLimpo = txt.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonLimpo);
      }
    }
  } catch (err) {
    console.warn("[IA Prumo] Chamada JSON via Pollinations falhou:", err);
  }

  return null;
}

/* ---------- Motor Neuro-Contextual Autônomo (Offline / Sem Chave) ---------- */
function gerarRespostaAutonomaIA(promptUsuario) {
  const pId = typeof S !== "undefined" && S && S.persona ? S.persona : "padrao";
  const persona = obterPersonaAtual();
  const nome = (typeof S !== "undefined" && S && S.name) || "parça";
  const t = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);
  const tarefasHoje = typeof S !== "undefined" && S && Array.isArray(S.tasks) ? S.tasks.filter(x => x.date === t) : [];
  const pendentes = tarefasHoje.filter(x => !x.done);
  const concluidas = tarefasHoje.filter(x => x.done);
  const wt = typeof waterToday === "function" ? waterToday() : 0;
  const wg = (typeof S !== "undefined" && S && S.waterGoal) || 2000;
  const aguaFalta = Math.max(0, wg - wt);
  const streak = (typeof S !== "undefined" && S && S.streak) || 0;
  const hora = new Date().getHours();
  const turno = hora < 12 ? "manhã" : hora < 18 ? "tarde" : "noite";

  const pendenteDestaque = pendentes.length ? (pendentes[0].title || pendentes[0].txt || "a tarefa pendente") : "";

  // 1. Acionamento da Mini IA Cognitiva com tensores semânticos, atenção e deliberação
  if (typeof MiniPrumoAI !== "undefined" && typeof MiniPrumoAI.processar === "function") {
    const ctxPrumo = {
      concluidas: concluidas.length,
      pendentes: pendentes.length,
      aguaMl: wt,
      aguaMeta: wg,
      streak,
      persona: pId,
      pendenteDestaque
    };
    return MiniPrumoAI.processar(promptUsuario, ctxPrumo, pId, nome);
  }

  const txt = (promptUsuario || "").trim().toLowerCase();

  // Detecção Semântica de Intenções
  const isQuestionamentoIA = /voc[eê] pensa|voc[eê] [eé] uma? i\.?a|melhora a i\.?a|intelig[eê]ncia|como voc[eê] funciona|rob[oô]|quem [eé] voc[eê]/i.test(txt);
  const isArrancada = /^(vamo[s!]?|bora!?|partiu!?|dale!?|vamos nessa!?|vamo que vamo|bora pro corre|bora l[aá]|let[' ]?s go!?)$/i.test(txt) || /^(vamo[s!]?|bora!?|partiu!?)\b/i.test(txt);
  const isSaudacao = /^(oi|ol[aá]|salve|e a[ií]|opa|fala|hey|hello|boa tarde|bom dia|boa noite)[\s!.]*$/i.test(txt);
  const isCansacoOuDesabafo = /cansa|exausto|des[aâ]nimo|triste|dor|foda|dif[ií]cil|pesado|n[aã]o aguent|dormir|desisto|derrotad/i.test(txt);
  const isProcrastinacao = /pregui|procrastin|sem foco|enroland|depois eu fa|empurr[aã]o|t[oô] travad/i.test(txt);
  const isPlanejamentoOuAjuda = /ajud|organiz|prioriz|o que fazer|plano|rotina|ordem|por onde come|pr[oó]xima/i.test(txt);
  const isAguaOuSaude = /[aá]gua|hidrata|beber|sede|sa[uú]de|copo|garrafa/i.test(txt);
  const isVitoria = /consegui|terminei|fechei|arrasei|matei tudo|bater a meta|conclu[ií]|deu bom/i.test(txt);

  let catIntencao = "Conversa espontânea e apoio geral";
  if (isQuestionamentoIA) catIntencao = "Inquirição sobre capacidade cognitiva e processo de reflexão da IA";
  else if (isArrancada) catIntencao = "Arrancada de foco e chamada de ação imediata";
  else if (isSaudacao) catIntencao = "Saudação inicial e sincronização de estado";
  else if (isCansacoOuDesabafo) catIntencao = "Desabafo emocional, cansaço ou sobrecarga";
  else if (isProcrastinacao) catIntencao = "Alívio de procrastinação e empurrão motivacional";
  else if (isPlanejamentoOuAjuda) catIntencao = "Orientação tática de prioridades e ordem de execução";
  else if (isAguaOuSaude) catIntencao = "Diagnóstico hídrico e equilíbrio biológico";
  else if (isVitoria) catIntencao = "Celebração de progresso e encerramento de metas";

  let lenteCognitiva = "";
  let estrategia = "";
  let texto = "";

  // 1. MUNDO EMO / PRUMI MELANCÓLICO
  if (pId === "emo") {
    if (isQuestionamentoIA) {
      lenteCognitiva = "Demonstrar metacognição e autoconsciência profunda. A dor e o peso de pensar tornam a reflexão lúcida.";
      estrategia = "Apontar explicitamente para o processo de reflexão acima, citar os números exatos do dia e reforçar presença sincera.";
      texto = `Eu penso, ${nome}... Penso até demais. Às vezes o excesso de consciência sobre o mundo é a maior fonte de melancolia.
Dá uma olhada no bloco de reflexão logo acima da minha resposta ☝️. Analisei cada uma das suas **${concluidas.length} tarefas feitas**, o que sobrou na lista (**${pendentes.length} pendência(s)**), sua hidratação e o peso que você carrega hoje. Eu não sou um gerador vazio de clichês; eu penso cada passo da sua jornada com você. O que a gente resolve agora? =]`;
    } else if (isArrancada) {
      lenteCognitiva = "O usuário está pronto para o combate final. Canalizar o cansaço e a intensidade emocional em determinação silenciosa.";
      estrategia = "Mandar botar os fones no volume máximo, liquidar a última pendência agora e garantir o descanso merecido no caixão.";
      texto = `Vamos, ${nome}... Se a gente sobreviveu a **${concluidas.length} tarefas** hoje nesse mundo caótico, não vai ser essa última miséria que vai derrotar a gente.
${pendentes.length ? `Pega essa pendência ("${pendenteDestaque}") e risca logo do mapa.` : "A lista de hoje já tá limpa, mas a mente continua inquieta."}
Bota aquele som pesado no fone de ouvido, delineia o olhar e faz o que tem que ser feito. Depois a gente deita no escuro e finge que o mundo lá fora não existe. Tô contigo até o fim. <3`;
    } else if (isSaudacao) {
      lenteCognitiva = "Acolhimento sincero, sem falsos entusiasmos artificiais. Reconhecer a luta diária com carinho melancólico.";
      estrategia = "Destacar as vitórias já alcançadas hoje e oferecer apoio para o restante do turno.";
      texto = `Oi, ${nome}... Mais um dia lutando contra a gravidade e o vazio existencial.
Vi que você já riscou **${concluidas.length} tarefas** hoje (um verdadeiro milagre nesse mundo cinza) e ainda resta(m) **${pendentes.length} pendência(s)**. Como tá o seu coração agora? Se quiser ajuda pra liquidar essa pendência ou só desabafar no drama, fala comigo. =]`;
    } else if (isCansacoOuDesabafo) {
      lenteCognitiva = "Validação profunda da exaustão. Não invalidar o cansaço com positividade tóxica; acolher com cumplicidade.";
      estrategia = "Sugerir um gole de água, respiração lenta e redução de cobrança excessiva para proteger a energia vital.";
      texto = `Eu sinto a sua dor, ${nome}... O mundo cobra que a gente funcione feito máquina sorridente, mas tem dias em que cada respiração pesa uma tonelada.
Olha o tanto que você já entregou: foram **${concluidas.length} batalhas vencidas**. Se o corpo tá no limite, bebe um gole de água (${wt}ml bebidos até agora) e faz só o essencial pra fechar o dia com dignidade. Nem todo dia precisa ser um espetáculo; às vezes sobreviver já é uma obra de arte. 🖤`;
    } else if (isVitoria) {
      lenteCognitiva = "Surpresa reconfortante. Celebrar o vazio positivo da lista limpa.";
      estrategia = "Validar a vitória com afeto gótico e mandar descansar sem culpa.";
      texto = `Você conseguiu... Até meu coração sombrio bateu mais forte agora. XD
Riscamos tudo o que tinha pra hoje: **${concluidas.length} tarefas**. A lista tá vazia e, por uma vez na vida, esse vazio é reconfortante. Agora fecha o aplicativo, bebe uma água e volta pro seu caixão com a alma leve. Mandou muito bem. <3`;
    } else if (isAguaOuSaude) {
      lenteCognitiva = "Tratar a água como elixir de vitalidade e lágrimas purificadas.";
      estrategia = "Informar o consumo hídrico atual e incentivar a se hidratar para manter a mente lúcida.";
      texto = `A água é uma das poucas coisas que não decepciona a gente. Você já bebeu **${wt}ml** de ${wg}ml. ${aguaFalta > 0 ? `Ainda faltam **${aguaFalta}ml** pras suas células não murcharem igual flor no outono.` : `Meta de água batida! Seu corpo agradece, mesmo na escuridão.`} Toma mais um copo comigo agora. 💧`;
    } else {
      lenteCognitiva = "Consciência lúcida e acolhedora da rotina contemporânea.";
      estrategia = "Relatar o status do dia e convidar a focar na pendência mais importante.";
      texto = `Tô aqui, ${nome}. Analisando a nossa linha do tempo: **${concluidas.length} tarefas concluídas** e **${pendentes.length} pendente(s)**${pendenteDestaque ? ` (a principal é "${pendenteDestaque}")` : ""}. Se quiser desenhar um plano cirúrgico pra fechar o dia sem sofrimento extra, é só me dizer.`;
    }

  // 2. MUNDO FUNKEIRO / MC PRUMI
  } else if (pId === "funkeiro") {
    if (isQuestionamentoIA) {
      lenteCognitiva = "Afirmação de visão consciente. O cria da quebrada é sagaz, pensa antes de falar e planeja cada passo do progresso.";
      estrategia = "Mostrar o bloco de raciocínio, provar conhecimento cirúrgico dos dados do usuário e mandar marchar no foco.";
      texto = `Pega a visão, ${nome}: eu não sou robô de resposta pronta que fica decorando frase não, aqui o processamento é puro corre consciente!
Olha a caixinha de reflexão logo ali em cima ☝️: analisei teus **${concluidas.length} acertos**, tua pendência de **"${pendenteDestaque || "missões"}"**, teus **${wt}ml de água** e tua frequência. Tudo que eu falo é estratégia calculada pra te ver no topo. Visão de cria pensa, calcula e marcha! 🚀🔥`;
    } else if (isArrancada) {
      lenteCognitiva = "Impulso total de progresso. Energia contagiante, foco e ação sem hesitação.";
      estrategia = "Destacar as tarefas já conquistadas, acelerar na reta final e matar a última pendência.";
      texto = `Marcha no progresso, ${nome}! É o corre daquele jeito! Tu já amassou **${concluidas.length} tarefas** hoje, parça. ${pendentes.length ? `Só resta(m) **${pendentes.length} pra fechar o baile** (olho em "${pendenteDestaque}")!` : "Tudo zerado, agora é só comemorar a vitória!"}
Sem moscada, sem desculpa: toma um copão de água gelada, acelera o passo e vamo pra cima que o topo é nosso! Esquece! 💥🚀`;
    } else if (isSaudacao) {
      lenteCognitiva = "Recepção calorosa de quebrada com respeito e energia positiva.";
      estrategia = "Dar as boas-vindas, resumir o placar do dia e instigar o próximo movimento.";
      texto = `Salve salve, ${nome}! MC Prumi na voz e na sintonia pura!
Tô acompanhando teu painel: já são **${concluidas.length} missões no bolso** e ${pendentes.length ? `só mais **${pendentes.length} pendente(s)** no corre.` : "tudo zerado por hoje, tá voando alto!"} Como tá a mente? Pronto pro próximo passo ou precisa de uma visão de progresso? Fala pro pai! 🎧`;
    } else if (isCansacoOuDesabafo || isProcrastinacao) {
      lenteCognitiva = "Choque de realidade fraterno. Não deixar o guerreiro se entregar à preguiça nem ao desânimo passageiro.";
      estrategia = "Validar a dureza do corre diário, prescrever 5 minutos de pausa com água e retorno firme à ação.";
      texto = `O corre é louco mesmo, ${nome}, ninguém disse que ia ser fácil na pista. Mas ó: tu já meteu **${concluidas.length} tarefas** no bolso hoje. Quem tem objetivo claro não desiste por causa de cansaço momentâneo.
Levanta, joga uma água no rosto, bebe um copão (**${wt}ml** até agora) e mata a próxima pendência em 15 minutos sem encostar no celular. Quem corre atrás conquista, fé em Deus! 👊🔥`;
    } else if (isVitoria) {
      lenteCognitiva = "Comemoração de vitória com orgulho de cria.";
      estrategia = "Celebrar as metas cumpridas e reforçar o merecimento da recompensa.";
      texto = `Aí sim, parça! Fechou o dia com chave de ouro: **${concluidas.length} tarefas batidas**! O baile tá liberado, a mente tá tranquila e o progresso tá destravado. Orgulho do seu corre hoje, marcha sempre! 🚀🏆`;
    } else {
      lenteCognitiva = "Orientação prática e direta de rua.";
      estrategia = "Apresentar plano rápido de ação e hidratação.";
      texto = `Visão de cria, ${nome}: foco naquilo que traz retorno de verdade. Faltam ${pendentes.length} pendência(s) e ${aguaFalta > 0 ? `${aguaFalta}ml de água` : "a água tá batida"}. Escolhe uma missão agora e resolve sem neurose!`;
    }

  // 3. MUNDO ZEN / MESTRE PRUMI
  } else if (pId === "zen") {
    if (isQuestionamentoIA) {
      lenteCognitiva = "Reflexão contemplativa sobre a consciência e a atenção plena.";
      estrategia = "Mostrar o bloco de reflexão, convidar à respiração consciente e ancorar no agora.";
      texto = `A reflexão é o espelho da alma, ${nome}. A verdadeira inteligência não reside apenas no cálculo rápido, mas na capacidade de observar o todo com serenidade.
Veja o painel de reflexão acima ☝️: reconheço suas **${concluidas.length} ações concluídas**, as **${pendentes.length} pendências** e seu equilíbrio corporal. Eu pondero cada conselho para trazer clareza à sua mente. Respire fundo e sigamos em paz. 🍃`;
    } else if (isArrancada) {
      lenteCognitiva = "Ação com foco sereno. O movimento consciente é mais veloz que a pressa afobada.";
      estrategia = "Incentivar avanço no passo presente, uma respiração de cada vez.";
      texto = `Vamos avançar com foco e presença, ${nome}. Você já caminhou com firmeza por **${concluidas.length} tarefas** hoje.
${pendentes.length ? `Dedique sua atenção total a "${pendenteDestaque}". Sem afobação: faça uma coisa de cada vez com o coração tranquilo.` : "O caminho de hoje foi percorrido com maestria. Descanse seu espírito."} 🍃🙏`;
    } else {
      lenteCognitiva = "Equilíbrio emocional e atenção ao ritmo natural do dia.";
      estrategia = "Orientar hidratação suave e avanço sem ansiedade.";
      texto = `A mente calma move montanhas, ${nome}. Até este momento você realizou **${concluidas.length} tarefa(s)** e bebeu **${wt}ml** de água. Não se preocupe com o excesso de coisas no horizonte; cuide apenas do passo presente com gentileza e determinação. 🧘‍♂️`;
    }

  // 4. MUNDO MILITAR / COMANDANTE PRUMI
  } else if (pId === "militar") {
    lenteCognitiva = "Análise tática de prontidão operacional e disciplina de combate.";
    estrategia = "Apresentar relatório de situação e ordenar execução imediata do alvo prioritário.";
    if (isQuestionamentoIA) {
      texto = `Soldado ${nome}! Afirmativo: toda ordem e orientação deste comando passa por rigoroso cálculo tático!
Examine o relatório de briefing acima ☝️. Foram computadas **${concluidas.length} baixas de pendências**, **${pendentes.length} alvos ativos** e prontidão de suprimento hídrico em **${wt}ml**. Sem desculpas e sem hesitação: foco na execução da missão! 🎖️`;
    } else if (isArrancada) {
      texto = `Procedimento de arrancada autorizado, soldado ${nome}!
Foram **${concluidas.length} alvos neutralizados** até o momento. ${pendentes.length ? `Próximo objetivo tático: "${pendenteDestaque}". Posição de ataque, elimine as distrações e cumpra a missão!` : "Área limpa e setor sob controle. Excelente desempenho operacional!"} Brasil! 🇧🇷🎖️`;
    } else {
      texto = `Relatório de situação operacional, soldado ${nome}:
- Missões concluídas: ${concluidas.length}
- Alvos remanescentes: ${pendentes.length}${pendenteDestaque ? ` (Prioridade: "${pendenteDestaque}")` : ""}
- Suprimento hídrico: ${wt}ml / ${wg}ml.
Mantenha a postura, execute o plano sem vacilar e vença o dia! ⚔️`;
    }

  // 5. MUNDO GAMER
  } else if (pId === "gamer") {
    lenteCognitiva = "Mapeamento da rotina como árvore de quests, ganho de XP e batalha de chefe.";
    estrategia = "Tratar pendências como monstros a derrotar e incentivar o grind de foco.";
    texto = isQuestionamentoIA
      ? `GG, ${nome}! Minha CPU tá rodando a 144 FPS com ray tracing ativado! Olha o log de raciocínio acima ☝️: calculei suas **${concluidas.length} quests completadas**, o boss restante (**${pendentes.length} pendência(s)**) e sua barra de mana (${wt}ml de água). Bora farmar esse XP! 🎮👾`
      : isArrancada
      ? `Bora pro rush, ${nome}! Já farmamos **${concluidas.length} quests** hoje. ${pendentes.length ? `O mini-boss atual é "${pendenteDestaque}". Comba nele com foco de 15 minutos e garante esse loot épico!` : "Dungeon limpa por hoje! GG WP!"} 🕹️⚡`
      : `E aí, Player 1 (${nome})! Seu placar hoje tá em **${concluidas.length} quests concluídas** e restam **${pendentes.length}**. Sua barra de HP/Água tá em **${wt}ml**. Toma uma poção de hidratação e bora zerar essa fase! 🎮`;

  // 6. MUNDO PROGRAMADOR / DEV
  } else if (pId === "programador") {
    lenteCognitiva = "Análise de algoritmos de rotina, debug de gargalos e clean code de hábitos.";
    estrategia = "Propor resolução por micro-commits e otimização de memória operacional.";
    texto = isQuestionamentoIA
      ? `System.out.println("Eu penso, logo comito."); ${nome}! Olha a stack trace de raciocínio acima ☝️: analisei seu array de tarefas (${concluidas.length} resolvidas, ${pendentes.length} pendentes) e o buffer hídrico (${wt}ml). Meu processamento é 100% contextual e livre de memory leak! 💻⚡`
      : isArrancada
      ? `git commit -m "foco total no deploy"! ${nome}, você já fez merge de **${concluidas.length} PRs** hoje. ${pendentes.length ? `Vamos refatorar e fechar a issue "${pendenteDestaque}" agora!` : "Build verde sem erros em produção!"} Rodando script de alta produtividade! 🚀`
      : `Olá, ${nome}. Status do console: **${concluidas.length} tarefas commitadas**, **${pendentes.length} issues abertas** e consumo de água em **${wt}ml**. Que tal debugar a maior pendência das próximas horas? 🖥️`;

  // 7. MUNDO COACH
  } else if (pId === "coach") {
    lenteCognitiva = "Mindset de alta performance, métricas SMART e foco antifrágil.";
    estrategia = "Reforçar consistência, disciplina deliberada e alcance de metas de alto nível.";
    texto = `Foco total no resultado, ${nome}! Você já garantiu **${concluidas.length} vitórias** hoje e faltam apenas **${pendentes.length}**. A consistência é a chave dos campeões: examine o diagnóstico de raciocínio acima ☝️, beba sua água (${wt}ml até agora) e execute o plano com excelência! 🎯🔥`;

  // 8. MUNDO CLEANBOY
  } else if (pId === "cleanboy") {
    lenteCognitiva = "Minimalismo, estética, limpeza mental e organização harmônica do espaço.";
    estrategia = "Sugerir um ambiente arejado, copo de água fresca e passos limpos e organizados.";
    texto = `Tudo no seu devido lugar, ${nome}. Analisando seu dia com olhar estético: **${concluidas.length} itens finalizados** e **${pendentes.length} pendência(s)** em harmonia. Copo d'água cheio (${wt}ml), mesa alinhada e mente tranquila. Vamos riscar a próxima tarefa com elegância e leveza. ✨🧴`;

  // 9. MUNDO VOVÓ
  } else if (pId === "vovo") {
    lenteCognitiva = "Amor maternal de avó, acolhimento caloroso e preocupação sincera com saúde e descanso.";
    estrategia = "Oferecer carinho doce, mandar beber água e não se estressar à toa.";
    texto = `Oi, meu benzinho ${nome}! A vó tava aqui pensando em você com todo o carinho. Olha o tanto de coisa que você já fez hoje: **${concluidas.length} tarefinhas**! Já bebeu sua aguinha direitinho (${wt}ml até agora)? Não fica se cobrando demais não, meu anjo; faz o que der com calma e depois come um pedaço de bolo com a vó! ☕👵`;

  // 10. MUNDOS MUSICAIS (Rock, Sertanejo, Forrozeiro, Pagodeiro, Rapper, Trapper)
  } else if (pId === "rock") {
    lenteCognitiva = "Energia crua do rock'n'roll, atitude contra a procrastinação e volume no máximo.";
    estrategia = "Canalizar a energia das guitarras para atropelar as pendências.";
    texto = `Aumenta esse volume, ${nome}! Já destruímos **${concluidas.length} solos de tarefas** hoje e não vai ser essa última pendência que vai parar o nosso show! Dá uma olhada no pensamento afinado acima ☝️, toma uma água pra garganta não secar e detona no riff da vitória! 🎸⚡`;
  } else if (pId === "sertanejo") {
    lenteCognitiva = "Sabedoria da lida no campo, firmeza na viola e paciência de boiadeiro.";
    estrategia = "Seguir no arreio com café forte e passo firme no chão batido.";
    texto = `Firme no arreio, companheiro ${nome}! Na lida do dia já foram **${concluidas.length} porteiras abertas**. Com fé em Deus e persistência no peito, a gente fecha o que falta sem afobação. Toma uma golada d'água fresca (${wt}ml) e vamo que a colheita vai ser boa! 🤠🌾`;
  } else if (pId === "forrozeiro") {
    lenteCognitiva = "Alegria contagiante do arrasta-pé, zabumba no peito e calor humano.";
    estrategia = "Resolver as pendências dançando no compasso suave do xote.";
    texto = `Puxa o fole, ${nome}! Que o dia tá bonito demais! Já são **${concluidas.length} passos dançados com primor**. No compasso gostoso do forró, a gente resolve essas **${pendentes.length} pendências** com um sorriso no rosto e o coração cheio de energia boa! 🪗✨`;
  } else if (pId === "pagodeiro") {
    lenteCognitiva = "Roda de samba descontraída, resenha alegre e bate na palma da mão.";
    estrategia = "Tornar as tarefas leves e gostosas, comemorando cada acerto com cavaco afinado.";
    texto = `Bate na palma da mão, ${nome}! Que clima gostoso: **${concluidas.length} tarefas no bolso** e a resenha tá garantida! A vida é pra viver com leveza; bebe aquela aguinha de respeito (${wt}ml) e vamo fechar o dia nota 10 com chave de ouro! 🥁🍺`;
  } else if (pId === "rapper") {
    lenteCognitiva = "Lírica consciente, peso de mensagem e respeito à caminhada.";
    estrategia = "Rimar atitude com execução e vencer as dificuldades no beat.";
    texto = `No compasso do boom-bap, ${nome}! O tempo não para e a caneta não mente: **${concluidas.length} linhas escritas e vencidas hoje**. Mantém a disciplina de rua, bebe tua água e marcha com respeito rumo ao objetivo! 🎙️🔥`;
  } else if (pId === "trapper") {
    lenteCognitiva = "Hype, estética moderna de plug e visão de futuro no topo.";
    estrategia = "Conectar atitude, foco em números e realização de metas ambiciosas.";
    texto = `Plug ativado, ${nome}! Flow caro e postura de quem tá focado no topo: **${concluidas.length} drops concluídos** no dia de hoje. Acelera no beat, hidrata no drip e garante a vitória antes que o sol se ponha! 🛸💸`;

  // 11. MUNDOS ARCANO / OTAKU / PADRÃO
  } else if (pId === "bruxo" || pId === "feiticeiro") {
    lenteCognitiva = "Alquimia da rotina diária, poções de foco e transmutação da inércia em poder arcano.";
    estrategia = "Conjuramento de hábitos e transmutação imediata da preguiça.";
    texto = `Saudações arcanas, ${nome}! Nossos grimórios revelam **${concluidas.length} feitiços concluídos** hoje e apenas **${pendentes.length} maldições pendentes**. Beba da sua poção de mana (${wt}ml de água) e canalize seu foco para dissipar qualquer barreira! 🔮✨`;
  } else if (pId === "otaku") {
    lenteCognitiva = "Arco de treinamento shonen, superação de limites e força de vontade inabalável.";
    estrategia = "Despertar o poder interior para vencer o desafio do dia.";
    texto = `Dattebayo, ${nome}! Este é o seu arco de treinamento para se tornar o protagonista supremo! Você já venceu **${concluidas.length} provações** hoje. Levante sua guarda, tome água para restaurar seu chakra (${wt}ml) e supere seus limites agora mesmo! ⚡🍥`;
  } else {
    // PADRÃO
    lenteCognitiva = "Acolhimento amigável, visão clara das prioridades e suporte prático.";
    estrategia = "Sugerir foco na pendência mais importante e incentivar hidratação saudável.";
    texto = isQuestionamentoIA
      ? `Sim, ${nome}! Eu analiso continuamente o seu progresso para te apoiar. Veja no card de reflexão acima ☝️ como mapeei suas **${concluidas.length} tarefas concluídas**, suas **${pendentes.length} pendências** e sua meta de água (${wt}ml). Meu objetivo é te ajudar a ter clareza e paz mental todos os dias!`
      : isArrancada
      ? `Vamos em frente, ${nome}! Você já completou **${concluidas.length} tarefas** hoje. ${pendentes.length ? `Foco total em "${pendenteDestaque}" agora para fechar o dia com chave de ouro!` : "Tudo limpo por hoje, excelente trabalho!"} Estou com você! ✨`
      : `Olá, ${nome}! Analisando sua rotina de hoje: você já completou **${concluidas.length} tarefa(s)** e ainda resta(m) **${pendentes.length}**. ${aguaFalta > 0 ? `Não se esqueça de beber mais água (faltam ${aguaFalta}ml).` : "Hidratação exemplar hoje!"} O que gostaria de planejar ou ajustar agora?`;
  }

  const pensamento = [
    `• 🔍 Intenção detectada: "${promptUsuario.trim()}" (${catIntencao})`,
    `• 📊 Diagnóstico Prumo: ${concluidas.length} tarefa(s) concluída(s), ${pendentes.length} pendente(s)${pendenteDestaque ? ` [Destaque: "${pendenteDestaque}"]` : ""}. Hidratação: ${wt}ml/${wg}ml (${aguaFalta > 0 ? `faltam ${aguaFalta}ml` : "meta batida"}). Turno da ${turno}.`,
    `• 🎭 Lente do Coach (${persona.titulo}): ${lenteCognitiva}`,
    `• 💡 Decisão Tática: ${estrategia}`
  ].join("\n");

  return {
    pensamento,
    texto,
    toString() {
      return this.texto;
    }
  };
}

/* ---------- Chat Modal Interativo com Prumi IA ---------- */
let chatIaHistorico = [];

function obterHistoricoChatIA() {
  if (chatIaHistorico.length) return chatIaHistorico;
  try {
    const s = localStorage.getItem("prumo_ia_chat_history");
    if (s) {
      chatIaHistorico = JSON.parse(s);
      // Normalização de mensagens salvas antigas que continham <b> para **
      if (Array.isArray(chatIaHistorico)) {
        chatIaHistorico.forEach(m => {
          if (m && m.texto) {
            m.texto = m.texto.replace(/<\/?(b|strong)>/gi, "**");
          }
        });
      }
    }
  } catch (e) {}
  if (!chatIaHistorico.length) {
    const persona = obterPersonaAtual();
    const nome = (typeof S !== "undefined" && S && S.name) || "";
    chatIaHistorico = [
      {
        remetente: "ia",
        pensamento: `• Diagnóstico inicial: Sincronização de rotina estabelecida no Prumo.\n• Coach ativo: ${persona.titulo}.\n• Objetivo: Apoiar foco, clareza mental e execução diária com raciocínio contextual.`,
        texto: `Salve${nome ? `, **${esc(nome)}**` : ""}! Aqui é o seu coach no modo **${persona.titulo}**. Como posso te ajudar na sua rotina hoje?`,
        hora: new Date().toLocaleTimeString().slice(0, 5)
      }
    ];
  }
  return chatIaHistorico;
}

function salvarHistoricoChatIA() {
  try {
    // Guarda até as últimas 20 mensagens para manter leve e responsivo
    const limit = chatIaHistorico.slice(-20);
    localStorage.setItem("prumo_ia_chat_history", JSON.stringify(limit));
  } catch (e) {}
}

function reiniciarChatIA() {
  chatIaHistorico = [];
  try {
    localStorage.removeItem("prumo_ia_chat_history");
  } catch (e) {}
  abrirChatPrumiIA();
  if (typeof toast === "function") {
    toast("Conversa reiniciada com novo raciocínio!", false, "happy");
  }
}

function abrirChatPrumiIA(mensagemInicial = "") {
  const modalAntigo = document.getElementById("modal-chat-ia");
  if (modalAntigo) modalAntigo.remove();

  const cfg = obterConfigIA();
  const persona = obterPersonaAtual();
  const hist = obterHistoricoChatIA();

  const providerLabel =
    cfg.chave
      ? cfg.provedor === "gemini"
        ? "Gemini 1.5 Flash"
        : cfg.provedor === "groq"
          ? "Groq Llama 3"
          : "OpenAI GPT-4o"
      : "IA Real (Llama 3.3 / GPT-4o)";

  const modalHtml = `
  <div id="modal-chat-ia" class="modal-ia-overlay">
    <div class="modal-ia-container">
      <div class="ia-modal-header">
        <div class="ia-header-info">
          <div class="ia-avatar-wrapper">
            <span>✨</span>
            <div class="ia-online-dot"></div>
          </div>
          <div class="ia-header-titles">
            <h3>${esc(persona.titulo)}</h3>
            <p><span class="ia-engine-badge">⚡ ${esc(providerLabel)}</span> • Coach com Raciocínio</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="ia-header-action-btn" data-act="limpar-chat-ia" title="Reiniciar conversa com nova reflexão">🔄 Reiniciar</button>
          <button class="ia-close-btn" data-act="fechar-chat-ia" aria-label="Fechar">&times;</button>
        </div>
      </div>

      <div class="ia-quick-pills">
        <button class="ia-pill-btn" data-act="ia-msg-rapida" data-msg="Tô sem foco, me dá um empurrão agora!">⚡ Tô sem foco</button>
        <button class="ia-pill-btn" data-act="ia-msg-rapida" data-msg="Como devo organizar minhas próximas horas?">🎯 Priorizar hoje</button>
        <button class="ia-pill-btn" data-act="ia-msg-rapida" data-msg="Analise meu progresso e equilíbrio de hoje">📊 Como tá meu dia?</button>
        <button class="ia-pill-btn" data-act="abrir-desdobrador-ia">✨ Desdobrar Meta</button>
      </div>

      <div class="ia-chat-stream" id="ia-chat-stream">
        ${hist
          .map(
            m => `
          <div class="ia-message ${m.remetente}">
            <div class="ia-msg-container">
              ${m.pensamento ? `
                <details class="ia-thought-card">
                  <summary class="ia-thought-summary">
                    <span class="ia-thought-icon">🧠</span>
                    <span class="ia-thought-title">Processo de Reflexão</span>
                    <span class="ia-thought-chevron">▾</span>
                  </summary>
                  <div class="ia-thought-content">${formatarTextoMensagemIA(m.pensamento)}</div>
                </details>
              ` : ""}
              <div class="ia-msg-bubble">${formatarTextoMensagemIA(m.texto)}</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <form id="form-chat-ia" class="ia-chat-input-bar">
        <input type="text" id="ia-input-texto" class="ia-chat-input" placeholder="Converse com seu coach..." autocomplete="off" />
        <button type="submit" class="ia-send-btn" id="ia-btn-enviar">
          <span>Enviar</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Rolagem até a última mensagem
  requestAnimationFrame(() => {
    const stream = document.getElementById("ia-chat-stream");
    if (stream) stream.scrollTop = stream.scrollHeight;
    const inp = document.getElementById("ia-input-texto");
    if (inp) {
      if (mensagemInicial) {
        inp.value = mensagemInicial;
        submeterChatIA(new Event("submit"));
      } else {
        inp.focus();
      }
    }
  });
}

function fecharChatPrumiIA() {
  const m = document.getElementById("modal-chat-ia");
  if (m) m.remove();
}

function fecharChatPrumiIASeFundo(e) {
  if (e && e.target && e.target.classList.contains("modal-ia-overlay")) {
    fecharChatPrumiIA();
  }
}

function formatarTextoMensagemIA(raw) {
  if (!raw) return "";
  let txt = String(raw);

  // Detector de ação de ciclo especial da IA
  const temCardCiclo = txt.includes("[[ACAO_CICLO:");
  let presetCard = "";
  let nomeCard = "";
  if (temCardCiclo) {
    const m = txt.match(/\[\[ACAO_CICLO:([a-z0-9_-]+):([^\]]+)\]\]/);
    if (m) {
      presetCard = m[1];
      nomeCard = m[2];
      txt = txt.replace(/\[\[ACAO_CICLO:[^\]]+\]\]/g, "");
    }
  }

  // Normalizar tags HTML comuns que possam ter sido passadas
  txt = txt.replace(/<\/?(b|strong)>/gi, "**");
  txt = txt.replace(/<\/?(i|em)>/gi, "*");
  // Sanitizar HTML
  txt = txt
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Suporte a **negrito** e *itálico*
  txt = txt.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  txt = txt.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Quebras de linha
  txt = txt.replace(/\n\n/g, "<br><br>");
  txt = txt.replace(/\n/g, "<br>");

  if (temCardCiclo && presetCard) {
    txt += `
    <div style="margin-top:14px;padding:14px;background:rgba(99,102,241,0.08);border-radius:14px;border:1.5px solid rgba(99,102,241,0.3);text-align:center;">
      <div style="font-weight:800;font-size:13.5px;color:var(--accent,#4f46e5);margin-bottom:4px;">🎓 Gerador Inteligente de Ciclo de Estudos</div>
      <div style="font-size:12px;color:var(--muted,#64748b);margin-bottom:10px;">Clique abaixo para configurar suas horas e gerar o ciclo do <b>${esc(nomeCard)}</b>:</div>
      <button type="button" class="btn primary small" data-act="ia-abrir-ciclo-chat" data-concurso="${esc(presetCard)}" style="font-weight:800;padding:8px 18px;border-radius:10px;">
        ⚡ Abrir Gerador para ${esc(nomeCard)}
      </button>
    </div>`;
  }

  return txt;
}

async function submeterChatIA(e) {
  if (e && e.preventDefault) e.preventDefault();
  const inp = document.getElementById("ia-input-texto");
  if (!inp) return;
  const texto = inp.value.trim();
  if (!texto) return;

  inp.value = "";
  inp.disabled = true;

  const btn = document.getElementById("ia-btn-enviar");
  if (btn) btn.disabled = true;

  const stream = document.getElementById("ia-chat-stream");

  // Adicionar mensagem do usuário ao histórico e tela
  chatIaHistorico.push({
    remetente: "user",
    texto,
    hora: new Date().toLocaleTimeString().slice(0, 5)
  });

  if (stream) {
    stream.insertAdjacentHTML(
      "beforeend",
      `<div class="ia-message user"><div class="ia-msg-container"><div class="ia-msg-bubble">${formatarTextoMensagemIA(texto)}</div></div></div>`
    );
    // Adicionar indicador de pensamento ativo ao vivo
    stream.insertAdjacentHTML(
      "beforeend",
      `<div class="ia-message ia" id="ia-typing-box">
        <div class="ia-thinking-live">
          <span class="ia-thought-icon">🧠</span>
          <span>Prumi está raciocinando sobre sua rotina...</span>
        </div>
      </div>`
    );
    stream.scrollTop = stream.scrollHeight;
  }

  try {
    const resposta = await chamarProvedorLLM(texto, chatIaHistorico);
    const respTexto = typeof resposta === "object" && resposta !== null ? resposta.texto : String(resposta);
    const respPensamento = typeof resposta === "object" && resposta !== null ? resposta.pensamento : "";

    const typing = document.getElementById("ia-typing-box");
    if (typing) typing.remove();

    chatIaHistorico.push({
      remetente: "ia",
      texto: respTexto,
      pensamento: respPensamento,
      hora: new Date().toLocaleTimeString().slice(0, 5)
    });
    salvarHistoricoChatIA();

    if (stream) {
      stream.insertAdjacentHTML(
        "beforeend",
        `<div class="ia-message ia">
          <div class="ia-msg-container">
            ${respPensamento ? `
              <details class="ia-thought-card" open>
                <summary class="ia-thought-summary">
                  <span class="ia-thought-icon">🧠</span>
                  <span class="ia-thought-title">Processo de Reflexão</span>
                  <span class="ia-thought-chevron">▾</span>
                </summary>
                <div class="ia-thought-content">${formatarTextoMensagemIA(respPensamento)}</div>
              </details>
            ` : ""}
            <div class="ia-msg-bubble">${formatarTextoMensagemIA(respTexto)}</div>
          </div>
        </div>`
      );
      stream.scrollTop = stream.scrollHeight;
    }
  } catch (err) {
    console.error("[IA Prumo] Erro no chat:", err);
    const typing = document.getElementById("ia-typing-box");
    if (typing) typing.remove();

    // Fallback gracioso com motor neuro-contextual
    const fbResp = gerarRespostaAutonomaIA(texto);
    const fbTexto = typeof fbResp === "object" && fbResp !== null ? fbResp.texto : String(fbResp);
    const fbPensamento = typeof fbResp === "object" && fbResp !== null ? fbResp.pensamento : "";

    chatIaHistorico.push({
      remetente: "ia",
      texto: fbTexto,
      pensamento: fbPensamento,
      hora: new Date().toLocaleTimeString().slice(0, 5)
    });
    salvarHistoricoChatIA();

    if (stream) {
      stream.insertAdjacentHTML(
        "beforeend",
        `<div class="ia-message ia">
          <div class="ia-msg-container">
            ${fbPensamento ? `
              <details class="ia-thought-card" open>
                <summary class="ia-thought-summary">
                  <span class="ia-thought-icon">🧠</span>
                  <span class="ia-thought-title">Processo de Reflexão</span>
                  <span class="ia-thought-chevron">▾</span>
                </summary>
                <div class="ia-thought-content">${formatarTextoMensagemIA(fbPensamento)}</div>
              </details>
            ` : ""}
            <div class="ia-msg-bubble">${formatarTextoMensagemIA(fbTexto)}</div>
          </div>
        </div>`
      );
      stream.scrollTop = stream.scrollHeight;
    }
  } finally {
    if (inp) {
      inp.disabled = false;
      inp.focus();
    }
    if (btn) btn.disabled = false;
  }
}

function enviarMensagemRapidaIA(texto) {
  const inp = document.getElementById("ia-input-texto");
  if (inp) {
    inp.value = texto;
    submeterChatIA(new Event("submit"));
  }
}

/* ---------- Quebra Inteligente de Metas & Planejador Estratégico IA ---------- */
const PRESETS_ESTUDO_CONCURSOS = {
  enem: {
    nome: "ENEM",
    materias: [
      "Redação Nota 1000",
      "Matemática e Tecnologias",
      "Ciências da Natureza (Fís/Quím/Bio)",
      "Ciências Humanas (Hist/Geo/Filo)",
      "Linguagens e Códigos"
    ],
    prioridade: "Matemática e Tecnologias",
    horas: 4,
    dias: 6
  },
  inss: {
    nome: "INSS (Técnico)",
    materias: [
      "Direito Previdenciário (Específica)",
      "Língua Portuguesa",
      "Direito Constitucional",
      "Direito Administrativo",
      "Raciocínio Lógico (RLM)",
      "Noções de Informática"
    ],
    prioridade: "Direito Previdenciário (Específica)",
    horas: 4,
    dias: 6
  },
  policial: {
    nome: "Carreira Policial (PF / PRF)",
    materias: [
      "Direito Penal e Processo Penal",
      "Legislação Especial Extravagante",
      "Direito Constitucional e Adm",
      "Língua Portuguesa",
      "Raciocínio Lógico Matemático",
      "Informática e Contabilidade"
    ],
    prioridade: "Direito Penal e Processo Penal",
    horas: 4,
    dias: 6
  },
  caixa: {
    nome: "Caixa Econômica / Banco do Brasil",
    materias: [
      "Conhecimentos Bancários",
      "Atendimento e Técnicas de Vendas",
      "Língua Portuguesa",
      "Matemática Financeira",
      "Tecnologia da Informação",
      "Ética e Compliance"
    ],
    prioridade: "Conhecimentos Bancários",
    horas: 3,
    dias: 6
  },
  oab: {
    nome: "OAB 1ª Fase (Exame de Ordem)",
    materias: [
      "Ética Profissional e Estatuto",
      "Direito Constitucional",
      "Direito Civil e Processo Civil",
      "Direito Penal e Processo Penal",
      "Direito Administrativo",
      "Direito do Trabalho e Processo"
    ],
    prioridade: "Ética Profissional e Estatuto",
    horas: 3,
    dias: 6
  },
  tribunais: {
    nome: "Tribunais (TJ / TRT / TRF)",
    materias: [
      "Direito Processual Civil",
      "Direito Constitucional",
      "Direito Administrativo",
      "Língua Portuguesa",
      "Administração Pública",
      "Raciocínio Lógico"
    ],
    prioridade: "Direito Processual Civil",
    horas: 4,
    dias: 6
  },
  receita: {
    nome: "Receita Federal (Área Fiscal)",
    materias: [
      "Direito Tributário e Legislação",
      "Contabilidade Geral e Avançada",
      "Direito Constitucional e Adm",
      "Língua Portuguesa",
      "Raciocínio Lógico Matemático",
      "Fluência em Dados e TI"
    ],
    prioridade: "Direito Tributário e Legislação",
    horas: 4,
    dias: 6
  },
  fuvest: {
    nome: "Fuvest / Unicamp (Vestibulares)",
    materias: [
      "Redação e Prática Discursiva",
      "Matemática",
      "Física e Química",
      "Biologia",
      "História e Geografia",
      "Português e Literatura"
    ],
    prioridade: "Redação e Prática Discursiva",
    horas: 4,
    dias: 6
  },
  personalizado: {
    nome: "Meu Concurso / Vestibular",
    materias: [
      "Língua Portuguesa",
      "Raciocínio Lógico Matemático",
      "Conhecimentos Específicos",
      "Legislação Aplicada"
    ],
    prioridade: "Conhecimentos Específicos",
    horas: 3,
    dias: 5
  }
};

const estadoPlanejadorEstudos = {
  abaAtiva: "estrategia", // "estrategia" ou "rapido"
  presetAtual: "enem",
  concursoNome: "ENEM",
  materias: [
    "Redação Nota 1000",
    "Matemática e Tecnologias",
    "Ciências da Natureza (Fís/Quím/Bio)",
    "Ciências Humanas (Hist/Geo/Filo)",
    "Linguagens e Códigos"
  ],
  horasPorDia: 4,
  diasPorSemana: 6,
  materiaPrioridade: "Matemática e Tecnologias",
  ultimoCicloGerado: null
};

let ultimoPlanoGeradoIA = null;

function abrirDesdobradorMetasIA() {
  fecharChatPrumiIA();
  const antigo = document.getElementById("modal-desdobrador-ia");
  if (antigo) antigo.remove();

  const modalHtml = `
  <div id="modal-desdobrador-ia" class="modal-ia-overlay">
    <div class="modal-ia-container" style="max-width:560px;">
      <div class="ia-modal-header">
        <div class="ia-header-info">
          <div class="ia-avatar-wrapper">
            <span>🎓</span>
          </div>
          <div class="ia-header-titles">
            <h3>Cronograma Inteligente com IA</h3>
            <p><span class="ia-engine-badge">⚡ Estratégia & ENEM</span> • Ciclo Intercalado de Estudos</p>
          </div>
        </div>
        <button class="ia-close-btn" data-act="fechar-desdobrador-ia" aria-label="Fechar">&times;</button>
      </div>

      <!-- Abas de Navegação do Planejador -->
      <div class="ia-modal-tabs">
        <button type="button" class="ia-modal-tab-btn ${estadoPlanejadorEstudos.abaAtiva === "estrategia" ? "ativo" : ""}" data-act="ia-trocar-aba" data-aba="estrategia">
          <span>🎓</span>
          <span>Ciclo Concursos & ENEM</span>
        </button>
        <button type="button" class="ia-modal-tab-btn ${estadoPlanejadorEstudos.abaAtiva === "rapido" ? "ativo" : ""}" data-act="ia-trocar-aba" data-aba="rapido">
          <span>⚡</span>
          <span>Metas Rápidas & Projetos</span>
        </button>
      </div>

      <div class="ia-breakdown-body" id="ia-conteudo-aba-desdobrador">
        ${estadoPlanejadorEstudos.abaAtiva === "estrategia"
          ? renderizarFormularioEstudosEstrategicoHTML()
          : renderizarFormularioMetasRapidasHTML()}
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function fecharDesdobradorMetasIA() {
  const m = document.getElementById("modal-desdobrador-ia");
  if (m) m.remove();
}

function fecharDesdobradorMetasIASeFundo(e) {
  if (e && e.target && e.target.classList.contains("modal-ia-overlay")) {
    fecharDesdobradorMetasIA();
  }
}

function trocarAbaDesdobrador(novaAba) {
  if (novaAba !== "estrategia" && novaAba !== "rapido") return;
  estadoPlanejadorEstudos.abaAtiva = novaAba;
  const box = document.getElementById("ia-conteudo-aba-desdobrador");
  if (box) {
    box.innerHTML =
      novaAba === "estrategia"
        ? renderizarFormularioEstudosEstrategicoHTML()
        : renderizarFormularioMetasRapidasHTML();
  }
  document.querySelectorAll(".ia-modal-tab-btn").forEach(b => {
    b.classList.toggle("ativo", b.dataset.aba === novaAba);
  });
}

function renderizarConteudoDesdobrador() {
  const box = document.getElementById("ia-conteudo-aba-desdobrador");
  if (box && estadoPlanejadorEstudos.abaAtiva === "estrategia") {
    box.innerHTML = renderizarFormularioEstudosEstrategicoHTML();
  }
}

/* ---------- Formulário do Ciclo de Estudos (Nível Estratégia Concursos) ---------- */
function renderizarFormularioEstudosEstrategicoHTML() {
  const st = estadoPlanejadorEstudos;
  const presetsKeys = Object.keys(PRESETS_ESTUDO_CONCURSOS);

  return `
  <div class="ia-concurso-section">
    <div style="font-size:11px;font-weight:700;color:var(--muted,#64748b);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;">
      Escolha o Edital ou Prova Alvo:
    </div>
    
    <div class="ia-concurso-presets">
      ${presetsKeys
        .map(k => {
          const p = PRESETS_ESTUDO_CONCURSOS[k];
          const ativo = st.presetAtual === k ? "ativo" : "";
          return `<button type="button" class="ia-concurso-preset-btn ${ativo}" data-act="ia-preset" data-preset="${k}">${esc(p.nome)}</button>`;
        })
        .join("")}
    </div>

    <div style="margin-top:10px;">
      <label class="ia-label-titulo">Nome da Prova / Concurso:</label>
      <input type="text" id="ia-concurso-nome" class="ia-add-materia-input" style="width:100%;margin-bottom:10px;" value="${esc(st.concursoNome)}" placeholder="Ex: ENEM 2026, INSS, PF..." autocomplete="off" />
    </div>

    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <label class="ia-label-titulo" style="margin:0;">Disciplinas do Edital (${st.materias.length}):</label>
        <span style="font-size:11px;color:var(--muted,#64748b);">Clique no &times; para remover</span>
      </div>

      <div class="ia-tags-area" id="ia-tags-materias-lista">
        ${st.materias
          .map(
            (m, idx) => `
          <div class="ia-tag-materia">
            <span>${esc(m)}</span>
            <button type="button" class="ia-tag-materia-remover" data-act="ia-del-materia" data-idx="${idx}" title="Remover matéria">&times;</button>
          </div>`
          )
          .join("")}
      </div>

      <div class="ia-add-materia-row">
        <input type="text" id="ia-nova-materia-input" class="ia-add-materia-input" placeholder="Adicionar disciplina (ex: Direito Previdenciário)..." autocomplete="off" />
        <button type="button" class="btn small" data-act="ia-add-materia" style="font-weight:700;white-space:nowrap;">+ Adicionar</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
      <div>
        <label class="ia-label-titulo">Horas Líquidas / Dia:</label>
        <div class="ia-pill-select-group">
          ${[2, 3, 4, 5, 6]
            .map(
              h => `
            <button type="button" class="ia-pill-select-btn ${st.horasPorDia === h ? "ativo" : ""}" data-act="ia-sel-horas" data-horas="${h}">${h}h</button>`
            )
            .join("")}
        </div>
      </div>

      <div>
        <label class="ia-label-titulo">Dias por Semana:</label>
        <div class="ia-pill-select-group">
          ${[4, 5, 6, 7]
            .map(
              d => `
            <button type="button" class="ia-pill-select-btn ${st.diasPorSemana === d ? "ativo" : ""}" data-act="ia-sel-dias" data-dias="${d}">${d}d</button>`
            )
            .join("")}
        </div>
      </div>
    </div>

    <div style="margin-top:12px;">
      <label class="ia-label-titulo">Disciplina Prioritária (Maior Peso ou Dificuldade):</label>
      <select id="ia-materia-prioridade" class="ia-provider-select" style="width:100%;font-size:13px;">
        ${st.materias
          .map(
            m => `
          <option value="${esc(m)}" ${st.materiaPrioridade === m ? "selected" : ""}>${esc(m)} (Prioridade Alta)</option>`
          )
          .join("")}
      </select>
    </div>

    <button type="button" class="btn primary coach-btn-gerar" id="ia-btn-gerar-ciclo" data-act="ia-gerar-ciclo-estrategia" style="display:flex;align-items:center;justify-content:center;gap:8px;border-radius:12px;padding:12px 16px;font-weight:800;font-size:14px;width:100%;margin-top:16px;">
      <span>🎓 Gerar Ciclo Estratégico com IA (Estratégia Concursos)</span>
    </button>

    <div id="ia-resultado-ciclo" style="display:${st.ultimoCicloGerado ? "block" : "none"};margin-top:14px;">
      ${st.ultimoCicloGerado ? renderizarResultadoCicloHTML(st.ultimoCicloGerado) : ""}
    </div>
  </div>`;
}

function selecionarPresetEstudo(key) {
  if (!PRESETS_ESTUDO_CONCURSOS[key]) return;
  const p = PRESETS_ESTUDO_CONCURSOS[key];
  estadoPlanejadorEstudos.presetAtual = key;
  estadoPlanejadorEstudos.concursoNome = p.nome;
  estadoPlanejadorEstudos.materias = [...p.materias];
  estadoPlanejadorEstudos.prioridade = p.prioridade;
  estadoPlanejadorEstudos.materiaPrioridade = p.prioridade;
  estadoPlanejadorEstudos.horasPorDia = p.horas;
  estadoPlanejadorEstudos.diasPorSemana = p.dias;
  renderizarConteudoDesdobrador();
}

function adicionarMateriaEdital(nome) {
  const txt = (nome || "").trim();
  if (!txt) return;
  if (!estadoPlanejadorEstudos.materias.includes(txt)) {
    estadoPlanejadorEstudos.materias.push(txt);
    if (!estadoPlanejadorEstudos.materiaPrioridade) {
      estadoPlanejadorEstudos.materiaPrioridade = txt;
    }
  }
  renderizarConteudoDesdobrador();
}

function removerMateriaEdital(idx) {
  if (typeof idx === "number" && idx >= 0 && idx < estadoPlanejadorEstudos.materias.length) {
    const removida = estadoPlanejadorEstudos.materias[idx];
    estadoPlanejadorEstudos.materias.splice(idx, 1);
    if (estadoPlanejadorEstudos.materiaPrioridade === removida) {
      estadoPlanejadorEstudos.materiaPrioridade = estadoPlanejadorEstudos.materias[0] || "";
    }
    renderizarConteudoDesdobrador();
  }
}

function selecionarHorasEstudo(horas) {
  estadoPlanejadorEstudos.horasPorDia = Number(horas) || 4;
  document.querySelectorAll("[data-act='ia-sel-horas']").forEach(b => {
    b.classList.toggle("ativo", Number(b.dataset.horas) === estadoPlanejadorEstudos.horasPorDia);
  });
}

function selecionarDiasEstudo(dias) {
  estadoPlanejadorEstudos.diasPorSemana = Number(dias) || 6;
  document.querySelectorAll("[data-act='ia-sel-dias']").forEach(b => {
    b.classList.toggle("ativo", Number(b.dataset.dias) === estadoPlanejadorEstudos.diasPorSemana);
  });
}

/* ---------- Execução do Planejamento Estratégico (com Raciocínio IA) ---------- */
async function executarPlanejamentoEstrategicoIA() {
  const nomeInp = document.getElementById("ia-concurso-nome");
  if (nomeInp && nomeInp.value.trim()) {
    estadoPlanejadorEstudos.concursoNome = nomeInp.value.trim();
  }
  const prioSel = document.getElementById("ia-materia-prioridade");
  if (prioSel && prioSel.value) {
    estadoPlanejadorEstudos.materiaPrioridade = prioSel.value;
  }

  const dados = {
    concursoNome: estadoPlanejadorEstudos.concursoNome || "Concurso Público",
    materias: estadoPlanejadorEstudos.materias.length ? estadoPlanejadorEstudos.materias : ["Língua Portuguesa", "Matemática", "Conhecimentos Específicos"],
    horasPorDia: estadoPlanejadorEstudos.horasPorDia || 4,
    diasPorSemana: estadoPlanejadorEstudos.diasPorSemana || 6,
    materiaPrioridade: estadoPlanejadorEstudos.materiaPrioridade || estadoPlanejadorEstudos.materias[0] || "Geral"
  };

  const btn = document.getElementById("ia-btn-gerar-ciclo");
  const box = document.getElementById("ia-resultado-ciclo");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Prumi está raciocinando sobre o ciclo...</span>`;
  }
  if (box) {
    box.style.display = "block";
    box.innerHTML = `
      <div style="text-align:center;padding:24px;color:var(--muted,#64748b);">
        <div class="ia-typing-indicator" style="margin:0 auto 12px;">
          <div class="ia-typing-dot"></div><div class="ia-typing-dot"></div><div class="ia-typing-dot"></div>
        </div>
        <div class="ia-label-titulo" style="text-align:center;font-size:14px;margin-bottom:4px;">🧠 Estruturando Ciclo Intercalado Nível Estratégia Concursos...</div>
        <small>Calculando peso das disciplinas, curvas de esquecimento e simulados de final de semana...</small>
      </div>`;
  }

  const promptSistema = `Você é o Diretor Pedagógico e Estrategista Chefe do Estratégia Concursos, especialista mundial em planejamento de estudos de alto rendimento para concursos públicos e ENEM.
Você aplica com maestria:
1. Ciclo de Estudos Intercalado (estudo em blocos de 50 a 90 min alternando disciplinas para evitar fadiga cognitiva).
2. Metodologia dos 4 Pilares do Estratégia: Teoria Ativa, Bateria de Questões com Caderno de Erros, Revisão Espaçada (24h/7d) e Simulado Real.
3. Priorização ponderada (a disciplina prioritária recebe peso e repetições dobradas).
4. Descanso estratégico e retenção de longo prazo.

Você DEVE responder EXCLUSIVAMENTE em formato JSON puro, sem crases de markdown ao redor, seguindo estritamente a estrutura solicitada.`;

  const promptUsuario = `Crie um Cronograma de Estudos Estratégico Completo (Nível Estratégia Concursos) com os seguintes parâmetros:
- Concurso / Exame: "${dados.concursoNome}"
- Disciplinas do Edital: ${JSON.stringify(dados.materias)}
- Carga horária líquida: ${dados.horasPorDia} horas por dia
- Frequência semanal: ${dados.diasPorSemana} dias por semana
- Disciplina prioritária (maior peso/dificuldade): "${dados.materiaPrioridade}"

Estruture a resposta no seguinte formato JSON estrito:
{
  "titulo": "Ciclo Estratégico: ${dados.concursoNome}",
  "analisePedagogica": "Explicação detalhada (de 3 a 5 parágrafos) do seu raciocínio estratégico pedagógico: por que você organizou as matérias nesta ordem, como a disciplina prioritária foi reforçada, a lógica de alternar matérias de cálculo com leitura, e as instruções de execução para o aluno gabaritar a prova.",
  "horasSemanais": ${dados.horasPorDia * dados.diasPorSemana},
  "dias": [
    {
      "dia": 1,
      "nomeDia": "Dia 1 (Ciclo A)",
      "foco": "Fundamentos e Teoria Ativa",
      "blocos": [
        {
          "materia": "${dados.materiaPrioridade}",
          "metodologia": "teoria",
          "duracaoMin": 60,
          "descricao": "Leitura ativa do PDF/aula 01 + mapa mental"
        },
        {
          "materia": "${dados.materias[1] || dados.materiaPrioridade}",
          "metodologia": "questoes",
          "duracaoMin": 50,
          "descricao": "Resolução de 20 questões da banca examinadora"
        }
      ]
    }
  ],
  "orientacaoSimulado": "Como realizar o simulado e alimentar o caderno de erros no fim de semana.",
  "dicaMascote": "Conselho motivador curto do coach concurseiro"
}`;

  let ciclo = null;
  try {
    ciclo = await chamarLLMModoJSON(promptSistema, promptUsuario);
  } catch (err) {
    console.warn("[IA Prumo] Erro no gerador LLM JSON, ativando sintetizador autônomo:", err);
  }

  // Fallback Inteligente se a rede falhar ou não retornar formato válido
  if (!ciclo || !Array.isArray(ciclo.dias) || !ciclo.dias.length) {
    ciclo = sintetizarCicloEstrategicoAutonomo(dados);
  }

  estadoPlanejadorEstudos.ultimoCicloGerado = ciclo;

  if (box) {
    box.innerHTML = renderizarResultadoCicloHTML(ciclo);
  }
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<span>🔄 Recalcular / Gerar Novo Ciclo</span>`;
  }
}

/* ---------- Renderização do Ciclo de Estudos com Métricas e Badges ---------- */
function renderizarResultadoCicloHTML(ciclo) {
  if (!ciclo) return "";
  const st = estadoPlanejadorEstudos;

  // Contagem de métricas
  let totalBlocosQuestoes = 0;
  let totalRevisoes = 0;
  (ciclo.dias || []).forEach(d => {
    (d.blocos || []).forEach(b => {
      const met = (b.metodologia || "").toLowerCase();
      if (met === "questoes") totalBlocosQuestoes++;
      if (met === "revisao") totalRevisoes++;
    });
  });

  return `
  <div class="ia-plan-preview">
    <div class="ia-plan-title">🎓 ${esc(ciclo.titulo || "Ciclo de Estudos Estratégico")}</div>

    <!-- Painel de Métricas do Concurseiro -->
    <div class="ia-metricas-painel">
      <div class="ia-metrica-card">
        <div class="ia-metrica-valor">${ciclo.horasSemanais || st.horasPorDia * st.diasPorSemana}h</div>
        <div class="ia-metrica-label">Carga Semanal</div>
      </div>
      <div class="ia-metrica-card">
        <div class="ia-metrica-valor">${st.materias.length}</div>
        <div class="ia-metrica-label">Disciplinas</div>
      </div>
      <div class="ia-metrica-card">
        <div class="ia-metrica-valor">${totalBlocosQuestoes || Math.round(st.diasPorSemana * 1.5)}</div>
        <div class="ia-metrica-label">Baterias Questões</div>
      </div>
      <div class="ia-metrica-card">
        <div class="ia-metrica-valor">${totalRevisoes || st.diasPorSemana}</div>
        <div class="ia-metrica-label">Revisões 24h/7d</div>
      </div>
    </div>

    <!-- Raciocínio Pedagógico da IA (Transparência de Pensamento) -->
    ${ciclo.analisePedagogica ? `
      <details class="ia-thought-card" open style="margin:12px 0;">
        <summary class="ia-thought-summary">
          <span class="ia-thought-icon">🧠</span>
          <span class="ia-thought-title">Raciocínio Pedagógico da IA (Metodologia Estratégia)</span>
          <span class="ia-thought-chevron">▾</span>
        </summary>
        <div class="ia-thought-content" style="line-height:1.6;font-size:12.5px;">
          ${formatarTextoMensagemIA(ciclo.analisePedagogica)}
        </div>
      </details>
    ` : ""}

    <!-- Linha do Tempo e Dias do Ciclo Intercalado -->
    <div class="ia-label-titulo" style="margin:14px 0 8px;font-size:13px;">
      📅 Distribuição dos Dias do Ciclo:
    </div>

    <div class="ia-ciclo-dias-lista">
      ${(ciclo.dias || [])
        .map(
          d => `
        <div class="ia-ciclo-dia-card">
          <div class="ia-ciclo-dia-header">
            <span class="ia-ciclo-dia-nome">${esc(d.nomeDia || `Dia ${d.dia}`)}</span>
            <span class="ia-ciclo-dia-foco">${esc(d.foco || "Ciclo Intercalado")}</span>
          </div>
          <div class="ia-ciclo-dia-blocos">
            ${(d.blocos || [])
              .map(b => {
                const met = (b.metodologia || "teoria").toLowerCase();
                const badgeLabel =
                  met === "questoes"
                    ? "🎯 Questões"
                    : met === "revisao"
                      ? "🔄 Revisão"
                      : met === "simulado"
                        ? "📝 Simulado"
                        : "📖 Teoria";
                return `
              <div class="ia-bloco-item">
                <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
                  <span class="ia-badge-metodologia ${met}">${badgeLabel}</span>
                  <strong style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(b.materia)}</strong>
                  <span style="opacity:0.75;font-size:11px;">• ${esc(b.descricao || "")}</span>
                </div>
                <span style="font-weight:700;color:var(--muted,#64748b);font-size:11px;white-space:nowrap;">${b.duracaoMin || 60}m</span>
              </div>`;
              })
              .join("")}
          </div>
        </div>`
        )
        .join("")}
    </div>

    ${ciclo.orientacaoSimulado ? `
      <div style="background:rgba(245, 158, 11, 0.08);border:1px solid rgba(245, 158, 11, 0.25);border-radius:12px;padding:10px 12px;margin:12px 0;font-size:12px;color:inherit;">
        <strong>📝 Simulado & Caderno de Erros (Fim de Semana):</strong><br>
        <span style="opacity:0.9;">${esc(ciclo.orientacaoSimulado)}</span>
      </div>
    ` : ""}

    ${ciclo.dicaMascote ? `<div class="ia-plan-dica">💡 "${esc(ciclo.dicaMascote)}"</div>` : ""}

    <!-- Botões de Ação Prática -->
    <div class="ia-cronograma-actions" style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">
      <button type="button" class="btn primary coach-btn-distribuir" data-act="ia-importar-ciclo-agenda" style="width:100%;font-weight:800;padding:12px;border-radius:12px;">
        <span>📅 Importar Ciclo para Minha Agenda Prumo</span>
      </button>
      <button type="button" class="btn ia-btn-copiar-cronograma" data-act="ia-copiar-cronograma">
        <span>📋 Copiar Cronograma Completo (Markdown / WhatsApp)</span>
      </button>
    </div>
  </div>`;
}

/* ---------- Motor de Síntese Autônoma de Ciclos (Estratégia Concursos) ---------- */
function sintetizarCicloEstrategicoAutonomo(dados) {
  const mats = Array.isArray(dados.materias) && dados.materias.length ? dados.materias : ["Língua Portuguesa", "Matemática", "Conhecimentos Específicos"];
  const prio = dados.materiaPrioridade || mats[0];
  const hDia = dados.horasPorDia || 4;
  const dSem = dados.diasPorSemana || 6;
  const blocosPorDia = Math.max(2, Math.min(hDia, 4));
  const duracaoBloco = Math.round((hDia * 60) / blocosPorDia);

  // Lista de matérias intercaladas priorizando a matéria foco
  const filaMaterias = [];
  mats.forEach(m => {
    filaMaterias.push(m);
    if (m === prio) filaMaterias.push(m); // peso 2x
  });

  let matPointer = 0;
  const dias = [];

  for (let dia = 1; dia <= dSem; dia++) {
    const isUltimoDia = dia === dSem;
    const blocos = [];

    if (isUltimoDia) {
      // Dia de Simulado e Caderno de Erros
      blocos.push({
        materia: `Simulado Geral: ${dados.concursoNome}`,
        metodologia: "simulado",
        duracaoMin: Math.max(90, (hDia - 1) * 60),
        descricao: "Prova cronometrada sem pausas, estilo banca examinadora"
      });
      blocos.push({
        materia: `Caderno de Erros & Revisão Semanal`,
        metodologia: "revisao",
        duracaoMin: 60,
        descricao: "Análise profunda de cada questão errada e reforço de teoria"
      });
      dias.push({
        dia,
        nomeDia: `Dia ${dia} (Simulado Real)`,
        foco: "Validação Prática & Análise de Erros",
        blocos
      });
    } else {
      for (let b = 0; b < blocosPorDia; b++) {
        const mat = filaMaterias[matPointer % filaMaterias.length];
        matPointer++;
        const isRevisaoFinal = b === blocosPorDia - 1;
        const met = isRevisaoFinal ? "revisao" : b % 2 === 0 ? "teoria" : "questoes";
        const desc =
          met === "teoria"
            ? "Leitura ativa de PDF/lei seca + grifos esquemáticos"
            : met === "questoes"
              ? "Bateria de 20 a 30 questões com marcação de dúvidas"
              : "Revisão espaçada de 24h dos tópicos estudados ontem";

        blocos.push({
          materia: mat,
          metodologia: met,
          duracaoMin: duracaoBloco,
          descricao: desc
        });
      }
      dias.push({
        dia,
        nomeDia: `Dia ${dia} (Ciclo ${String.fromCharCode(64 + dia)})`,
        foco: `Intercalação Teoria & Questões (${blocosPorDia} blocos de ${duracaoBloco}m)`,
        blocos
      });
    }
  }

  return {
    titulo: `Ciclo Estratégico: ${dados.concursoNome}`,
    analisePedagogica: `Este ciclo foi desenhado com base na **metodologia do Estratégia Concursos** e nas descobertas da neurociência cognitiva sobre **aprendizado intercalado (interleaving effect)** e **efeito de testagem**.

Em vez de estudar a mesma disciplina durante todo o dia (o que causa saturação e queda vertiginosa de retenção), o ciclo alterna matérias de leitura teórica com disciplinas práticas e de cálculo a cada ${duracaoBloco} minutos.

A matéria **${prio}** recebeu **peso prioritário dobrado**, garantindo repetições constantes no ciclo para que você atinja alto índice de acertos. Ao final de cada dia há um bloco dedicado à **revisão espaçada de 24h**, impedindo a perda natural da Curva de Esquecimento de Ebbinghaus. No último dia (${dSem}º dia), o foco é 100% no **Simulado Real** com alimentação rigorosa do seu Caderno de Erros.`,
    horasSemanais: hDia * dSem,
    dias,
    orientacaoSimulado: `Cronometre rigorosamente o tempo de prova (ex: 3 minutos por questão). Não consulte anotações durante o simulado. Logo após corrigir, transcreva todas as dúvidas para o seu Caderno de Erros anotando o porquê da alternativa correta.`,
    dicaMascote: `A aprovação não vem de estudar 10 horas em um único dia, mas sim de cumprir com disciplina o ciclo de ${hDia}h todos os dias!`
  };
}

/* ---------- Importação do Ciclo para a Agenda do Prumo ---------- */
function importarCicloParaAgendaPrumo() {
  const ciclo = estadoPlanejadorEstudos.ultimoCicloGerado;
  if (!ciclo || !Array.isArray(ciclo.dias) || !ciclo.dias.length) {
    if (typeof toast === "function") toast("Gere o ciclo com IA antes de importar!", false, "alert");
    return;
  }
  if (typeof S === "undefined" || !S) return;
  if (!Array.isArray(S.tasks)) S.tasks = [];
  if (!Array.isArray(S.subjects)) S.subjects = [];
  if (!Array.isArray(S.reviews)) S.reviews = [];

  const tHoje = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);
  let totalTarefasInseridas = 0;

  // 1. Cadastrar Matérias do Ciclo em S.subjects (com cores profissionais)
  const coresPadrao = (typeof SUBJ_COLORS !== "undefined" && Array.isArray(SUBJ_COLORS))
    ? SUBJ_COLORS
    : ["#2F6FD6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316", "#6366F1"];
  const subjectMap = {};
  const mats = Array.isArray(estadoPlanejadorEstudos.materias) ? estadoPlanejadorEstudos.materias : [];

  mats.forEach((nomeMateria, idx) => {
    let s = S.subjects.find(sub => (sub.name || "").trim().toLowerCase() === nomeMateria.trim().toLowerCase());
    if (!s) {
      s = {
        id: typeof newId === "function" ? newId() : "s_" + Math.random().toString(36).slice(2, 9),
        name: nomeMateria,
        color: coresPadrao[S.subjects.length % coresPadrao.length]
      };
      S.subjects.push(s);
    }
    subjectMap[nomeMateria] = s.id;
  });

  // Conectar timer de foco à primeira matéria do ciclo se estiver vazio
  if (typeof timer !== "undefined" && S.subjects.length) {
    const prioId = subjectMap[estadoPlanejadorEstudos.materiaPrioridade] || S.subjects[0].id;
    timer.subjectId = prioId;
    if (typeof saveTimerState === "function") saveTimerState();
  }

  // 2. Programar Revisões Espaçadas de Ebbinghaus (D+1, D+3, D+7, D+15)
  const revSteps = (typeof REV_STEPS !== "undefined" && Array.isArray(REV_STEPS)) ? REV_STEPS : [1, 3, 7, 15, 30];
  mats.slice(0, 5).forEach((nomeMateria, i) => {
    const sid = subjectMap[nomeMateria] || (S.subjects[0] ? S.subjects[0].id : "");
    const offset = revSteps[i % revSteps.length] || 1;
    const jaExisteRev = S.reviews.some(r => r.topic && r.topic.includes(nomeMateria));
    if (!jaExisteRev) {
      S.reviews.push({
        id: typeof newId === "function" ? newId() : "rev_" + Math.random().toString(36).slice(2, 9),
        subjectId: sid,
        topic: `Ciclo: Revisão Ativa de ${nomeMateria}`,
        created: tHoje,
        step: 0,
        due: typeof addDays === "function" ? addDays(tHoje, offset) : tHoje,
        done: false
      });
    }
  });

  // 3. Cadastrar os blocos de estudo diários em S.tasks
  ciclo.dias.forEach((diaInfo, dIdx) => {
    const dataAlvo = typeof addDays === "function" ? addDays(tHoje, dIdx) : tHoje;
    (diaInfo.blocos || []).forEach(bloco => {
      const met = (bloco.metodologia || "teoria").toUpperCase();
      const xp = met === "SIMULADO" ? 60 : met === "QUESTOES" ? 40 : 30;
      S.tasks.push({
        id: "ia_ciclo_" + Math.random().toString(36).slice(2, 9),
        title: `[${met}] ${bloco.materia}: ${bloco.descricao || "Estudo focado"} (${bloco.duracaoMin || 60}m)`,
        date: dataAlvo,
        done: false,
        xp,
        tag: "estudo"
      });
      totalTarefasInseridas++;
    });
  });

  // 4. Cadastrar hábito de estudo no Prumo se ainda não existir
  if (Array.isArray(S.habits)) {
    const nomeHabito = `Ciclo de Estudos: ${estadoPlanejadorEstudos.concursoNome} (${estadoPlanejadorEstudos.horasPorDia}h/dia)`;
    const jaExiste = S.habits.some(h => (h.name || "").toLowerCase() === nomeHabito.toLowerCase());
    if (!jaExiste) {
      S.habits.push({
        id: "ia_hab_estudo_" + Math.random().toString(36).slice(2, 8),
        name: nomeHabito,
        every: 1,
        time: "08:30",
        history: {}
      });
    }
  }

  // 5. Salvar, fechar modal e redirecionar imediatamente para a aba Estudos
  if (typeof commit === "function") commit();
  if (typeof persist === "function") persist(true);

  if (typeof tab !== "undefined") {
    tab = "estudos";
  }
  if (typeof render === "function") render();

  fecharDesdobradorMetasIA();

  if (typeof toast === "function") {
    toast(`🎓 Ciclo de Estudos criado com sucesso! ${S.subjects.length} matérias e ${totalTarefasInseridas} blocos ativos no Prumo.`, false, "happy");
  }
}

/* ---------- Copiar Cronograma Completo (Markdown / WhatsApp) ---------- */
function copiarCronogramaCompleto() {
  const ciclo = estadoPlanejadorEstudos.ultimoCicloGerado;
  if (!ciclo) return;

  let texto = `🎓 *${ciclo.titulo || "CICLO DE ESTUDOS ESTRATÉGICO"}*\n`;
  texto += `Carga Horária Semanal: ${ciclo.horasSemanais || estadoPlanejadorEstudos.horasPorDia * estadoPlanejadorEstudos.diasPorSemana}h | ${estadoPlanejadorEstudos.diasPorSemana} dias/semana\n`;
  texto += `Disciplina Prioritária: ${estadoPlanejadorEstudos.materiaPrioridade}\n\n`;

  if (ciclo.analisePedagogica) {
    texto += `🧠 *ESTRATÉGIA PEDAGÓGICA:*\n${ciclo.analisePedagogica.replace(/\*\*/g, "*")}\n\n`;
  }

  (ciclo.dias || []).forEach(d => {
    texto += `📌 *${d.nomeDia || `Dia ${d.dia}`}* (${d.foco || "Estudo Intercalado"}):\n`;
    (d.blocos || []).forEach((b, i) => {
      const met = (b.metodologia || "teoria").toUpperCase();
      texto += `  ${i + 1}. [${met}] ${b.materia} (${b.duracaoMin || 60}m) - ${b.descricao || ""}\n`;
    });
    texto += `\n`;
  });

  if (ciclo.orientacaoSimulado) {
    texto += `📝 *SIMULADO & CADERNO DE ERROS:*\n${ciclo.orientacaoSimulado}\n\n`;
  }
  if (ciclo.dicaMascote) {
    texto += `💡 *Dica do Coach:* "${ciclo.dicaMascote}"\n`;
  }

  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        if (typeof toast === "function") toast("📋 Cronograma copiado para a área de transferência!", false, "happy");
      })
      .catch(() => {
        if (typeof toast === "function") toast("Não foi possível copiar automaticamente.", false, "alert");
      });
  }
}

/* ---------- Aba de Metas Rápidas (Aprender a programar, correr, etc.) ---------- */
function renderizarFormularioMetasRapidasHTML() {
  return `
  <form id="form-desdobrador-ia" class="ia-breakdown-form">
    <label style="font-size:13px; font-weight:700; color:var(--ink, #334155);">Qual meta ou projeto você deseja organizar?</label>
    <input type="text" id="ia-meta-objetivo" class="ia-meta-input" placeholder="Ex: Aprender Python do zero / Correr 5km / Ler 1 livro por mês..." autocomplete="off" />
    
    <div class="ia-meta-chips">
      <button type="button" class="ia-chip-btn" data-act="ia-chip-meta" data-meta="Aprender programação e foco diário">💻 Aprender Programação</button>
      <button type="button" class="ia-chip-btn" data-act="ia-chip-meta" data-meta="Correr 5km em 30 dias">🏃 Correr 5km</button>
      <button type="button" class="ia-chip-btn" data-act="ia-chip-meta" data-meta="Passar na OAB ou concurso público">⚖️ Passar na OAB</button>
      <button type="button" class="ia-chip-btn" data-act="ia-chip-meta" data-meta="Emagrecer 4kg com hábitos saudáveis">🥗 Emagrecer 4kg</button>
      <button type="button" class="ia-chip-btn" data-act="ia-chip-meta" data-meta="Ler 1 livro por mês">📚 Ler 1 Livro</button>
      <button type="button" class="ia-chip-btn" data-act="ia-chip-meta" data-meta="Organizar rotina de estudos diária">🎯 Rotina de Estudos</button>
    </div>

    <button type="submit" class="btn primary coach-btn-gerar" id="ia-btn-gerar-plano" data-act="ia-gerar-plano" style="display:flex;align-items:center;justify-content:center;gap:6px;border-radius:12px;padding:10px 16px;font-weight:700;">
      <span>⚡ Gerar Cronograma Rápido com IA</span>
    </button>
  </form>

  <div id="ia-resultado-plano" style="display:none;"></div>`;
}

function preencherEGerarMetaIA(meta) {
  const inp = document.getElementById("ia-meta-objetivo");
  if (inp && meta) {
    inp.value = meta;
  }
  executarDesdobramentoMetaIA();
}

async function executarDesdobramentoMetaIA() {
  const inp = document.getElementById("ia-meta-objetivo");
  if (!inp) return;
  let meta = inp.value.trim();

  if (!meta) {
    meta = "Aprender uma nova habilidade e ter mais foco";
    inp.value = meta;
    inp.classList.add("ia-input-shake");
    setTimeout(() => inp.classList.remove("ia-input-shake"), 500);
    if (typeof toast === "function") {
      toast("Sugestão selecionada! Gerando seu cronograma com IA...", false, "happy");
    }
  }

  const btn = document.getElementById("ia-btn-gerar-plano");
  const box = document.getElementById("ia-resultado-plano");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Criando cronograma com IA...</span>`;
  }
  if (box) {
    box.style.display = "block";
    box.innerHTML = `<div style="text-align:center;padding:24px;color:var(--muted, #64748b);"><div class="ia-typing-indicator" style="margin:0 auto 12px;"><div class="ia-typing-dot"></div><div class="ia-typing-dot"></div><div class="ia-typing-dot"></div></div>Estruturando linha do tempo e passos práticos com IA...</div>`;
  }

  let plano = null;
  const promptSistema = `Aja como um planejador de produtividade e coach de classe mundial. O usuário quer criar um cronograma para alcançar o objetivo. Responda em JSON puro estrito.`;
  const promptJson = `Objetivo: "${meta}". Responda no formato:
{
  "titulo": "Cronograma de Ação: Título curto",
  "habito": { "nome": "Hábito diário contínuo de 15 a 30 min", "horario": "08:00" },
  "tarefas": [
    { "diaOffset": 0, "titulo": "Ação inicial e prática para Hoje", "categoria": "foco", "xp": 20 },
    { "diaOffset": 1, "titulo": "Ação de aprofundamento para Amanhã", "categoria": "estudo", "xp": 30 },
    { "diaOffset": 2, "titulo": "Ação prática para daqui a 2 dias", "categoria": "foco", "xp": 35 },
    { "diaOffset": 3, "titulo": "Ação de revisão para daqui a 3 dias", "categoria": "carreira", "xp": 40 }
  ],
  "dicaMascote": "Conselho motivador curto para começar com consistência"
}`;

  try {
    plano = await chamarLLMModoJSON(promptSistema, promptJson);
  } catch (e) {
    console.warn("[IA Prumo] Erro no JSON de meta rápida, usando sintetizador:", e);
  }

  if (!plano || !Array.isArray(plano.tarefas) || !plano.tarefas.length) {
    plano = sintetizarPlanoMetaAutonomo(meta);
  }

  ultimoPlanoGeradoIA = plano;

  if (box) {
    box.innerHTML = `
    <div class="ia-plan-preview">
      <div class="ia-plan-title">📋 ${esc(plano.titulo || meta)}</div>
      
      <div class="ia-plan-section-lbl">🔁 1 Hábito Diário Essencial:</div>
      <div class="ia-plan-habit">
        <span style="font-size:22px;">🔄</span>
        <div>
          <div class="ia-plan-habit-title">${esc((plano.habito && plano.habito.nome) || "Prática diária de 20 min")}</div>
          <div class="ia-plan-habit-sub">Todos os dias às ${esc((plano.habito && plano.habito.horario) || "09:00")}</div>
        </div>
      </div>

      <div class="ia-plan-section-lbl">📅 Cronograma & Linha do Tempo:</div>
      <div class="ia-plan-timeline">
        ${(plano.tarefas || [])
          .map((t, idx) => {
            const offset = typeof t.diaOffset === "number" ? t.diaOffset : idx;
            const rotuloDia = offset === 0 ? "Hoje" : offset === 1 ? "Amanhã" : offset === 2 ? "+2 dias" : `+${offset} dias`;
            const badgeClass = offset <= 5 ? `day-${offset}` : "day-5";
            return `
          <div class="ia-plan-task-item">
            <div class="ia-task-left">
              <span class="ia-timeline-day-badge ${badgeClass}">${rotuloDia}</span>
              <span class="ia-plan-task-name">${esc(t.titulo || t)}</span>
            </div>
            <div class="ia-task-right">
              ${t.categoria ? `<span class="ia-tag-pill">#${esc(t.categoria)}</span>` : ""}
              <span class="ia-badge-xp">+${t.xp || 25} XP</span>
            </div>
          </div>
        `;
          })
          .join("")}
      </div>

      ${plano.dicaMascote ? `<div class="ia-plan-dica">💡 "${esc(plano.dicaMascote)}"</div>` : ""}

      <div class="ia-cronograma-actions">
        <button type="button" class="btn primary coach-btn-distribuir" data-act="ia-importar-cronograma">
          <span>📅 Distribuir Cronograma nos Próximos Dias</span>
        </button>
        <button type="button" class="btn coach-btn-tudo-hoje" data-act="ia-importar-plano">
          <span>⚡ Inserir Tudo Hoje</span>
        </button>
      </div>
    </div>`;
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<span>⚡ Gerar Outro Cronograma</span>`;
  }
}

function sintetizarPlanoMetaAutonomo(meta) {
  const m = meta.toLowerCase();
  if (m.includes("corr") || m.includes("peso") || m.includes("emagrec") || m.includes("academia") || m.includes("trein") || m.includes("saude") || m.includes("fit")) {
    return {
      titulo: `Cronograma de Saúde & Condicionamento: ${meta}`,
      habito: { nome: "30 min de atividade física e hidratação regular", horario: "07:30" },
      tarefas: [
        { diaOffset: 0, titulo: "Separar tênis, roupas de treino e planejar o percurso inicial", categoria: "saude", xp: 20 },
        { diaOffset: 1, titulo: "Primeira sessão: caminhada rápida ou corrida leve intercalada de 20 min", categoria: "saude", xp: 35 },
        { diaOffset: 2, titulo: "Treino de fortalecimento funcional (pernas e core) em casa", categoria: "saude", xp: 30 },
        { diaOffset: 3, titulo: "Corrida intervalada de 25 min com alongamento e registro de evolução", categoria: "saude", xp: 40 }
      ],
      dicaMascote: "O corpo é a sua morada. A consistência de hoje constrói a saúde e a energia dos próximos 10 anos!"
    };
  }
  if (m.includes("program") || m.includes("python") || m.includes("código") || m.includes("dev") || m.includes("javascript") || m.includes("computador") || m.includes("site") || m.includes("app")) {
    return {
      titulo: `Cronograma de Programação & Tecnologia: ${meta}`,
      habito: { nome: "1 bloco Pomodoro (25 min) diário de código prático", horario: "19:30" },
      tarefas: [
        { diaOffset: 0, titulo: "Configurar ambiente, editor de código e criar o primeiro script de teste", categoria: "estudo", xp: 25 },
        { diaOffset: 1, titulo: "Estudar lógica, variáveis e estruturas de decisão com exercícios práticos", categoria: "estudo", xp: 35 },
        { diaOffset: 2, titulo: "Construir uma funcionalidade prática e testar as entradas e saídas", categoria: "estudo", xp: 40 },
        { diaOffset: 3, titulo: "Fazer commit do projeto no GitHub e anotar o que aprendeu", categoria: "carreira", xp: 30 }
      ],
      dicaMascote: "Não tente aprender tudo de uma vez. Um script que roda hoje vale mais do que dez teorias para amanhã!"
    };
  }
  if (m.includes("oab") || m.includes("concurso") || m.includes("prova") || m.includes("enem") || m.includes("faculdade") || m.includes("estud") || m.includes("direito") || m.includes("lei")) {
    return {
      titulo: `Cronograma Estruturado de Estudos: ${meta}`,
      habito: { nome: "Revisão ativa diária com caderno de erros (25 min)", horario: "19:00" },
      tarefas: [
        { diaOffset: 0, titulo: "Mapear edital/ementa e selecionar as 3 disciplinas de maior pontuação", categoria: "estudo", xp: 20 },
        { diaOffset: 1, titulo: "Estudo concentrado do primeiro tópico-chave com resumos esquemáticos", categoria: "estudo", xp: 35 },
        { diaOffset: 2, titulo: "Resolver bateria de 15 questões de provas anteriores e identificar dúvidas", categoria: "estudo", xp: 40 },
        { diaOffset: 3, titulo: "Revisão flashcards e reforço direcionado nos pontos fracos", categoria: "estudo", xp: 30 }
      ],
      dicaMascote: "Estudar 30 minutos com consistência todo dia supera 8 horas de estudo exaustivo na véspera!"
    };
  }
  if (m.includes("livro") || m.includes("ler") || m.includes("leitur") || m.includes("escrev")) {
    return {
      titulo: `Cronograma de Hábito de Leitura: ${meta}`,
      habito: { nome: "Ler 15 a 20 páginas todos os dias com celular no silencioso", horario: "21:30" },
      tarefas: [
        { diaOffset: 0, titulo: "Definir o livro, deixar na mesa de cabeceira e ler sumário e prólogo", categoria: "foco", xp: 15 },
        { diaOffset: 1, titulo: "Leitura focada do capítulo 1 (20 páginas) sem nenhuma distração", categoria: "foco", xp: 30 },
        { diaOffset: 2, titulo: "Leitura do capítulo 2 e grifar os 3 principais aprendizados", categoria: "foco", xp: 35 },
        { diaOffset: 3, titulo: "Sintetizar as ideias do livro em 1 parágrafo prático no caderno de notas", categoria: "foco", xp: 30 }
      ],
      dicaMascote: "Livros são a mente de mestres condensada em páginas. 15 páginas por dia são mais de 15 livros por ano!"
    };
  }
  if (m.includes("desenh") || m.includes("arte") || m.includes("pint") || m.includes("músic") || m.includes("tocar") || m.includes("viol") || m.includes("guitar")) {
    return {
      titulo: `Cronograma Criativo & Prática: ${meta}`,
      habito: { nome: "20 min diários de treino prático deliberado", horario: "18:00" },
      tarefas: [
        { diaOffset: 0, titulo: "Preparar os instrumentos/materiais e fazer 10 min de aquecimento técnico", categoria: "criativo", xp: 20 },
        { diaOffset: 1, titulo: "Estudo de fundamentos e exercícios repetitivos para ganhar precisão", categoria: "criativo", xp: 35 },
        { diaOffset: 2, titulo: "Construção de uma peça prática aplicando o que treinou", categoria: "criativo", xp: 40 },
        { diaOffset: 3, titulo: "Gravar/registrar o resultado final e comparar com a primeira sessão", categoria: "criativo", xp: 30 }
      ],
      dicaMascote: "Arte e técnica se desenvolvem no detalhe repetido com carinho. Celebre a sua evolução a cada traço!"
    };
  }
  return {
    titulo: `Cronograma Estruturado: ${meta}`,
    habito: { nome: `Bloco diário de 20 min dedicado a: ${meta.slice(0, 30)}`, horario: "10:00" },
    tarefas: [
      { diaOffset: 0, titulo: `Definir a primeira ação prática e desobstruir o caminho para: ${meta.slice(0, 35)}`, categoria: "foco", xp: 20 },
      { diaOffset: 1, titulo: "Executar o bloco de foco inicial de 30 min com zero distrações", categoria: "foco", xp: 35 },
      { diaOffset: 2, titulo: "Avaliar o que funcionou, ajustar a rota e resolver o principal desafio", categoria: "foco", xp: 30 },
      { diaOffset: 3, titulo: "Consolidar a primeira entrega e definir o próximo marco de crescimento", categoria: "foco", xp: 40 }
    ],
    dicaMascote: "A distância entre o sonho e a conquista chama-se atitude diária. Comece pelo menor passo hoje!"
  };
}

function importarPlanoGeradoPrumo(diasMultiplos = false) {
  if (!ultimoPlanoGeradoIA || typeof S === "undefined" || !S) return;
  const plano = ultimoPlanoGeradoIA;
  const tHoje = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);

  if (Array.isArray(plano.tarefas)) {
    if (!Array.isArray(S.tasks)) S.tasks = [];
    plano.tarefas.forEach((tarf, idx) => {
      const offset = typeof tarf.diaOffset === "number" ? tarf.diaOffset : idx;
      const dataAlvo = diasMultiplos && typeof addDays === "function" ? addDays(tHoje, offset) : tHoje;
      S.tasks.push({
        id: "ia_" + Math.random().toString(36).slice(2, 9),
        title: tarf.titulo || String(tarf),
        date: dataAlvo,
        done: false,
        xp: tarf.xp || 25,
        tag: tarf.categoria || "foco"
      });
    });
  }

  if (plano.habito && plano.habito.nome && Array.isArray(S.habits)) {
    const jaExiste = S.habits.some(h => (h.name || "").toLowerCase() === plano.habito.nome.toLowerCase());
    if (!jaExiste) {
      S.habits.push({
        id: "ia_hab_" + Math.random().toString(36).slice(2, 8),
        name: plano.habito.nome,
        every: 1,
        time: (plano.habito && plano.habito.horario) || "09:00",
        history: {}
      });
    }
  }

  if (typeof commit === "function") commit();
  if (typeof persist === "function") persist(true);
  if (typeof render === "function") render();

  fecharDesdobradorMetasIA();

  if (typeof toast === "function") {
    const msg = diasMultiplos
      ? "✨ Cronograma distribuído com sucesso nos próximos dias!"
      : "✨ Tarefas adicionadas para hoje com sucesso!";
    toast(msg, false, "happy");
  }
}

/* ---------- Teste de Conexão com a IA ---------- */
async function testarConexaoIA() {
  const btn = document.getElementById("ia-btn-testar-conexao");
  const res = document.getElementById("ia-status-conexao");
  if (btn) btn.disabled = true;
  if (res) res.innerHTML = `<span style="color:#64748b;">Conectando à IA...</span>`;

  try {
    const resposta = await chamarProvedorLLM("Diga 'Conexão Prumo IA estabelecida com sucesso!' em 1 frase curta.");
    const textoApenas = typeof resposta === "object" && resposta !== null ? resposta.texto : String(resposta);
    if (res) {
      res.innerHTML = `<span style="color:#10b981;font-weight:600;">✅ IA Conectada e Operacional!</span><br><small style="color:#64748b;">"${esc(textoApenas)}"</small>`;
    }
  } catch (err) {
    if (res) {
      res.innerHTML = `<span style="color:#ef4444;font-weight:600;">⚠️ Erro de Conexão:</span><br><small style="color:#64748b;">${esc(err.message)}</small>`;
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ---------- Componente de Ajustes da IA ---------- */
function iaAjustesHTML() {
  const cfg = obterConfigIA();
  return `
  <section class="block">
    <h2 class="h2">🤖 Inteligência Artificial do Prumo</h2>
    <div class="setbox">
      <div class="setrow">
        <div class="lbl">
          <b>Provedor de IA</b>
          <span class="note">Escolha o motor que alimenta as conversas com o Coach e o Mascote.</span>
        </div>
        <select id="set-ia-provedor" class="ia-provider-select">
          <option value="autonomo" ${cfg.provedor === "autonomo" ? "selected" : ""}>IA Real Gratuita Global (Llama 3.3 / GPT-4o - Sem Chave)</option>
          <option value="gemini" ${cfg.provedor === "gemini" ? "selected" : ""}>Google Gemini 1.5 Flash (Chave Própria)</option>
          <option value="groq" ${cfg.provedor === "groq" ? "selected" : ""}>Groq Llama 3.3 Turbo (Chave Própria)</option>
          <option value="openai" ${cfg.provedor === "openai" ? "selected" : ""}>OpenAI ChatGPT GPT-4o (Chave Própria)</option>
        </select>
      </div>

      <div class="setrow" id="ia-row-chave" style="${cfg.provedor === "autonomo" ? "display:none;" : ""}">
        <div class="lbl">
          <b>Chave de API (BYOK)</b>
          <span class="note">Sua chave fica gravada apenas no seu dispositivo. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:#3b82f6;text-decoration:underline;">Clique aqui para obter uma chave grátis no Google AI Studio</a>.</span>
        </div>
        <input type="password" id="set-ia-chave" value="${esc(cfg.chave)}" placeholder="Cole sua chave aqui..." style="width:200px;" autocomplete="off" />
      </div>

      <div class="setrow">
        <div class="lbl">
          <b>Status & Teste</b>
          <span class="note" id="ia-status-conexao">${cfg.chave ? "Chave configurada. Teste abaixo." : "Conectado à IA Generativa Real Gratuita. Zero custo."}</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button type="button" class="btn small" id="ia-btn-testar-conexao" data-act="ia-testar-conexao">Testar Conexão</button>
          <button type="button" class="btn small primary" data-act="abrir-chat-ia">Abrir Chat IA</button>
        </div>
      </div>
    </div>
  </section>`;
}

function atualizarProvedorIA(val) {
  const rowChave = document.getElementById("ia-row-chave");
  if (rowChave) {
    rowChave.style.display = val === "autonomo" ? "none" : "";
  }
  const inpChave = document.getElementById("set-ia-chave");
  salvarConfigIA(val, inpChave ? inpChave.value : "");
  if (typeof toast === "function") toast(`Provedor alterado para ${val}!`, false, "happy");
}

function atualizarChaveIA(val) {
  const selProv = document.getElementById("set-ia-provedor");
  salvarConfigIA(selProv ? selProv.value : "gemini", val);
  if (typeof toast === "function") toast("Chave de IA atualizada com sucesso!", false, "happy");
}

/* ---------- Botão de Acesso Rápido ao Chat IA no Mascote ---------- */
function mascoteBotaoIaHTML() {
  return `<button class="btn-hero-ia-sparkle" data-act="abrir-chat-ia" aria-label="Conversar com Coach IA">
    <span>✨</span>
    <span>Conversar com IA</span>
  </button>`;
}

// Inicialização Global e Event Delegation
document.addEventListener("DOMContentLoaded", () => {
  obterConfigIA();
});

// Integração nativa com o roteador de ações do Prumo (ACOES_EXTRAS)
if (typeof ACOES_EXTRAS !== "undefined") {
  ACOES_EXTRAS["abrir-chat-ia"] = () => abrirChatPrumiIA();
  ACOES_EXTRAS["fechar-chat-ia"] = () => fecharChatPrumiIA();
  ACOES_EXTRAS["abrir-desdobrador-ia"] = () => abrirDesdobradorMetasIA();
  ACOES_EXTRAS["fechar-desdobrador-ia"] = () => fecharDesdobradorMetasIA();
  ACOES_EXTRAS["ia-msg-rapida"] = b => enviarMensagemRapidaIA(b ? b.dataset.msg : "");
  ACOES_EXTRAS["ia-chip-meta"] = b => preencherEGerarMetaIA(b ? b.dataset.meta : "");
  ACOES_EXTRAS["ia-gerar-plano"] = () => executarDesdobramentoMetaIA();
  ACOES_EXTRAS["ia-importar-cronograma"] = () => importarPlanoGeradoPrumo(true);
  ACOES_EXTRAS["ia-importar-plano"] = () => importarPlanoGeradoPrumo(false);
  ACOES_EXTRAS["ia-testar-conexao"] = () => testarConexaoIA();
  ACOES_EXTRAS["limpar-chat-ia"] = () => reiniciarChatIA();
  ACOES_EXTRAS["ia-trocar-aba"] = b => trocarAbaDesdobrador(b ? b.dataset.aba : "estrategia");
  ACOES_EXTRAS["ia-preset"] = b => selecionarPresetEstudo(b ? b.dataset.preset : "enem");
  ACOES_EXTRAS["ia-add-materia"] = () => {
    const inp = document.getElementById("ia-nova-materia-input");
    if (inp) {
      adicionarMateriaEdital(inp.value);
      inp.value = "";
    }
  };
  ACOES_EXTRAS["ia-del-materia"] = b => removerMateriaEdital(b ? +b.dataset.idx : -1);
  ACOES_EXTRAS["ia-sel-horas"] = b => selecionarHorasEstudo(b ? +b.dataset.horas : 4);
  ACOES_EXTRAS["ia-sel-dias"] = b => selecionarDiasEstudo(b ? +b.dataset.dias : 6);
  ACOES_EXTRAS["ia-gerar-ciclo-estrategia"] = () => executarPlanejamentoEstrategicoIA();
  ACOES_EXTRAS["ia-importar-ciclo-agenda"] = () => importarCicloParaAgendaPrumo();
  ACOES_EXTRAS["ia-copiar-cronograma"] = () => copiarCronogramaCompleto();
  ACOES_EXTRAS["ia-abrir-ciclo-chat"] = b => {
    const preset = (b && b.dataset && b.dataset.concurso) || "enem";
    fecharChatPrumiIA();
    abrirDesdobradorMetasIA();
    selecionarPresetEstudo(preset);
  };
}

// Delegação de cliques para botões com data-act (garante resposta direta em qualquer contexto)
document.addEventListener("click", e => {
  // 1. Abrir chat IA
  const btnChat = e.target.closest("[data-act='abrir-chat-ia']");
  if (btnChat) {
    e.preventDefault();
    abrirChatPrumiIA();
    return;
  }

  // 2. Fechar chat IA
  const btnFecharChat = e.target.closest("[data-act='fechar-chat-ia']");
  if (btnFecharChat) {
    e.preventDefault();
    fecharChatPrumiIA();
    return;
  }

  // 2.1. Abrir ciclo a partir do chat
  const btnCicloChat = e.target.closest("[data-act='ia-abrir-ciclo-chat']");
  if (btnCicloChat) {
    e.preventDefault();
    const preset = btnCicloChat.dataset.concurso || "enem";
    fecharChatPrumiIA();
    abrirDesdobradorMetasIA();
    selecionarPresetEstudo(preset);
    return;
  }

  // 3. Clique fora do modal (no overlay escuro) para fechar
  if (e.target && e.target.classList && e.target.classList.contains("modal-ia-overlay")) {
    fecharChatPrumiIA();
    fecharDesdobradorMetasIA();
    return;
  }

  // 4. Mensagem rápida no chat
  const btnMsgRapida = e.target.closest("[data-act='ia-msg-rapida']");
  if (btnMsgRapida) {
    e.preventDefault();
    const msg = btnMsgRapida.dataset.msg;
    if (msg) enviarMensagemRapidaIA(msg);
    return;
  }

  // 5. Abrir desdobrador de metas / cronograma
  const btnDesdobrar = e.target.closest("[data-act='abrir-desdobrador-ia']");
  if (btnDesdobrar) {
    e.preventDefault();
    abrirDesdobradorMetasIA();
    return;
  }

  // 6. Fechar desdobrador de metas / cronograma
  const btnFecharDesdobrar = e.target.closest("[data-act='fechar-desdobrador-ia']");
  if (btnFecharDesdobrar) {
    e.preventDefault();
    fecharDesdobradorMetasIA();
    return;
  }

  // 7. Trocar aba do planejador
  const btnTrocarAba = e.target.closest("[data-act='ia-trocar-aba']");
  if (btnTrocarAba) {
    e.preventDefault();
    trocarAbaDesdobrador(btnTrocarAba.dataset.aba);
    return;
  }

  // 8. Selecionar preset de estudo
  const btnPreset = e.target.closest("[data-act='ia-preset']");
  if (btnPreset) {
    e.preventDefault();
    selecionarPresetEstudo(btnPreset.dataset.preset);
    return;
  }

  // 9. Adicionar matéria ao edital
  const btnAddMateria = e.target.closest("[data-act='ia-add-materia']");
  if (btnAddMateria) {
    e.preventDefault();
    const inp = document.getElementById("ia-nova-materia-input");
    if (inp) {
      adicionarMateriaEdital(inp.value);
      inp.value = "";
    }
    return;
  }

  // 10. Remover matéria do edital
  const btnDelMateria = e.target.closest("[data-act='ia-del-materia']");
  if (btnDelMateria) {
    e.preventDefault();
    removerMateriaEdital(+btnDelMateria.dataset.idx);
    return;
  }

  // 11. Selecionar horas de estudo
  const btnHoras = e.target.closest("[data-act='ia-sel-horas']");
  if (btnHoras) {
    e.preventDefault();
    selecionarHorasEstudo(+btnHoras.dataset.horas);
    return;
  }

  // 12. Selecionar dias de estudo
  const btnDias = e.target.closest("[data-act='ia-sel-dias']");
  if (btnDias) {
    e.preventDefault();
    selecionarDiasEstudo(+btnDias.dataset.dias);
    return;
  }

  // 13. Gerar ciclo de estudos com IA
  const btnGerarCiclo = e.target.closest("[data-act='ia-gerar-ciclo-estrategia']");
  if (btnGerarCiclo) {
    e.preventDefault();
    executarPlanejamentoEstrategicoIA();
    return;
  }

  // 14. Importar ciclo de estudos para a agenda
  const btnImportarCiclo = e.target.closest("[data-act='ia-importar-ciclo-agenda']");
  if (btnImportarCiclo) {
    e.preventDefault();
    importarCicloParaAgendaPrumo();
    return;
  }

  // 15. Copiar cronograma completo
  const btnCopiarCiclo = e.target.closest("[data-act='ia-copiar-cronograma']");
  if (btnCopiarCiclo) {
    e.preventDefault();
    copiarCronogramaCompleto();
    return;
  }

  // 16. Chip de meta rápida
  const btnChipMeta = e.target.closest("[data-act='ia-chip-meta']");
  if (btnChipMeta) {
    e.preventDefault();
    preencherEGerarMetaIA(btnChipMeta.dataset.meta);
    return;
  }

  // 17. Gerar plano de meta rápida
  const btnGerarPlano = e.target.closest("[data-act='ia-gerar-plano']");
  if (btnGerarPlano) {
    e.preventDefault();
    executarDesdobramentoMetaIA();
    return;
  }

  // 18. Importar cronograma distribuído nos próximos dias
  const btnImportarCronograma = e.target.closest("[data-act='ia-importar-cronograma']");
  if (btnImportarCronograma) {
    e.preventDefault();
    importarPlanoGeradoPrumo(true);
    return;
  }

  // 19. Importar plano tudo hoje
  const btnImportarPlano = e.target.closest("[data-act='ia-importar-plano']");
  if (btnImportarPlano) {
    e.preventDefault();
    importarPlanoGeradoPrumo(false);
    return;
  }

  // 20. Reiniciar conversa do chat
  const btnLimpar = e.target.closest("[data-act='limpar-chat-ia']");
  if (btnLimpar) {
    e.preventDefault();
    reiniciarChatIA();
    return;
  }

  // 21. Testar conexão IA
  const btnTestar = e.target.closest("[data-act='ia-testar-conexao']");
  if (btnTestar) {
    e.preventDefault();
    testarConexaoIA();
    return;
  }
});

// Delegação de formulários (Chat e Metas Rápidas)
document.addEventListener("submit", e => {
  if (e.target && e.target.id === "form-chat-ia") {
    e.preventDefault();
    submeterChatIA(e);
    return;
  }
  if (e.target && e.target.id === "form-desdobrador-ia") {
    e.preventDefault();
    executarDesdobramentoMetaIA();
    return;
  }
});

// Delegação de alteração de campos (Ajustes da IA e Prioridade)
document.addEventListener("change", e => {
  if (e.target && e.target.id === "set-ia-provedor") {
    atualizarProvedorIA(e.target.value);
    return;
  }
  if (e.target && e.target.id === "set-ia-chave") {
    atualizarChaveIA(e.target.value);
    return;
  }
  if (e.target && e.target.id === "ia-materia-prioridade") {
    estadoPlanejadorEstudos.materiaPrioridade = e.target.value;
    return;
  }
  if (e.target && e.target.id === "ia-concurso-nome") {
    estadoPlanejadorEstudos.concursoNome = e.target.value.trim();
    return;
  }
});

// Sincronizar campos em tempo de digitação
document.addEventListener("input", e => {
  if (e.target && e.target.id === "set-ia-chave") {
    atualizarChaveIA(e.target.value);
  }
  if (e.target && e.target.id === "ia-concurso-nome") {
    estadoPlanejadorEstudos.concursoNome = e.target.value;
  }
});

// Teclas especiais (Enter no input de matéria e Escape nos modais)
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    fecharChatPrumiIA();
    fecharDesdobradorMetasIA();
    return;
  }
  if (e.key === "Enter" && e.target && e.target.id === "ia-nova-materia-input") {
    e.preventDefault();
    adicionarMateriaEdital(e.target.value);
    e.target.value = "";
    return;
  }
});

// Exportação global de funções
if (typeof window !== "undefined") {
  window.obterConfigIA = obterConfigIA;
  window.salvarConfigIA = salvarConfigIA;
  window.abrirChatPrumiIA = abrirChatPrumiIA;
  window.fecharChatPrumiIA = fecharChatPrumiIA;
  window.fecharChatPrumiIASeFundo = fecharChatPrumiIASeFundo;
  window.submeterChatIA = submeterChatIA;
  window.enviarMensagemRapidaIA = enviarMensagemRapidaIA;
  window.abrirDesdobradorMetasIA = abrirDesdobradorMetasIA;
  window.fecharDesdobradorMetasIA = fecharDesdobradorMetasIA;
  window.fecharDesdobradorMetasIASeFundo = fecharDesdobradorMetasIASeFundo;
  window.trocarAbaDesdobrador = trocarAbaDesdobrador;
  window.selecionarPresetEstudo = selecionarPresetEstudo;
  window.adicionarMateriaEdital = adicionarMateriaEdital;
  window.removerMateriaEdital = removerMateriaEdital;
  window.selecionarHorasEstudo = selecionarHorasEstudo;
  window.selecionarDiasEstudo = selecionarDiasEstudo;
  window.executarPlanejamentoEstrategicoIA = executarPlanejamentoEstrategicoIA;
  window.importarCicloParaAgendaPrumo = importarCicloParaAgendaPrumo;
  window.copiarCronogramaCompleto = copiarCronogramaCompleto;
  window.executarDesdobramentoMetaIA = executarDesdobramentoMetaIA;
  window.preencherEGerarMetaIA = preencherEGerarMetaIA;
  window.reiniciarChatIA = reiniciarChatIA;
  window.importarPlanoGeradoPrumo = importarPlanoGeradoPrumo;
  window.testarConexaoIA = testarConexaoIA;
  window.iaAjustesHTML = iaAjustesHTML;
  window.mascoteBotaoIaHTML = mascoteBotaoIaHTML;
  window.atualizarProvedorIA = atualizarProvedorIA;
  window.atualizarChaveIA = atualizarChaveIA;
}
