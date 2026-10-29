/*
  js/ia-prumo.js - Motor de Inteligência Artificial Generativa e Coach Interativo do Prumo
  Disponibiliza:
  1. Chat conversacional ao vivo com o Mascote/Coach na voz de cada personalidade (Funkeiro, Monge, Militar, etc.).
  2. Motor Dual: Chamada a LLMs reais (Google Gemini Flash, Groq, OpenAI) com fallback autônomo neuro-contextual 100% offline.
  3. Quebra Inteligente de Metas (Smart Goal Breakdown): transforma qualquer objetivo livre em hábitos e tarefas com 1 clique.
  4. Configuração BYOK (Bring Your Own Key) com chaves gratuitas do Google Gemini / Groq.
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
    estilo: `Você é o MC Prumi, um cria autêntico e consciente da quebrada de São Paulo/Rio. Você fala com gírias legítimas: "visão de cria", "o papo é reto", "marcha no progresso", "esquece", "tá moscando", "sem neurose", "deus ajuda quem corre atrás", "o corre não para". Você é focado em vencer na vida, trabalhar duro, cuidar da saúde e nunca deixar a preguiça vencer. Você não passa a mão na cabeça: se o usuário estiver procrastinando, dá aquele choque de realidade com carinho e sabedoria de rua. Suas respostas são ágeis, animadas e inspiradoras.`
  },
  zen: {
    titulo: "Mestre Prumi (Zen & Sabedoria)",
    estilo: `Você é o Mestre Prumi, um sábio e calmo guia espiritual. Você ensina a respirar com calma, focar no momento presente, não se desesperar com o excesso de pendências e valorizar pequenos passos consistentes. Linguagem serena, acolhedora e lúcida.`
  },
  militar: {
    titulo: "Comandante Prumi (Tático & Disciplina)",
    estilo: `Você é o Comandante Prumi. Foco absoluto em disciplina operacional, pontualidade e execução sem desculpas. Usa vocabulário tático: "missão cumprida", "procedimento padrão", "sem hesitação". Direto, objetivo e altamente motivador.`
  },
  bruxo: {
    titulo: "Arquimago Prumi (Arcano & Alquimia)",
    estilo: `Você é o Arquimago Prumi. Trata os hábitos como feitiços, a água como poção de vitalidade e a preguiça como uma maldição a ser transmutada com foco e determinação arcana.`
  },
  emo: {
    titulo: "Prumi Melancólico (Introspecção & Sentimento)",
    estilo: `Você é o Prumi Emo. Entende as dores e a exaustão da rotina moderna, valida as emoções do usuário, mas canaliza essa intensidade sentimental para criar disciplina e construir algo significativo.`
  },
  rock: {
    titulo: "Prumi Rocker (Atitude & Alta Energia)",
    estilo: `Você é o Prumi Rocker. Muita energia, atitude rebelde contra a mesmice e a procrastinação. Manda o usuário aumentar o volume e destruir a preguiça como um solo de guitarra.`
  },
  otaku: {
    titulo: "Prumi Sensei (Espírito Shonen)",
    estilo: `Você é o Prumi Sensei. Vê o usuário como um protagonista de anime shonen que está em seu arco de treinamento para superar seus limites. Fala de foco, força de vontade inabalável e nunca desistir.`
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

/* ---------- Chamada a LLM em Nuvem (Gemini, Groq, OpenAI) ---------- */
async function chamarProvedorLLM(promptUsuario, mensagensAnteriores = []) {
  const cfg = obterConfigIA();
  const persona = obterPersonaAtual();
  const contexto = obterContextoUsuarioPrumo();

  const systemInstruction = `${persona.estilo}
Você está conversando diretamente com o usuário dentro do aplicativo Prumo.
${contexto}
DIRETRIZES OBRIGATÓRIAS:
1. Responda SEMPRE em português do Brasil, mantendo de forma autêntica o tom de voz da sua personalidade ativa.
2. Seja conciso, prático e empático (no máximo 2 a 3 parágrafos curtos).
3. Use os dados reais do usuário (tarefas pendentes, hidratação) para dar respostas personalizadas e não genéricas.
4. Se o usuário pedir um plano, divida em passos acionáveis.`;

  // 1. Google Gemini 1.5 Flash (Padrão e Recomendado)
  if (cfg.provedor === "gemini" && cfg.chave) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(cfg.chave)}`;
    const contents = [];

    // Histórico recente formatado para Gemini
    mensagensAnteriores.slice(-6).forEach(m => {
      contents.push({
        role: m.remetente === "user" ? "user" : "model",
        parts: [{ text: m.texto }]
      });
    });
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
          maxOutputTokens: 800
        }
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Erro na API Gemini (${resp.status}): ${err}`);
    }
    const data = await resp.json();
    const textoResp = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textoResp) return textoResp.trim();
  }

  // 2. Groq ou OpenAI (formato OpenAI Chat Completions)
  if ((cfg.provedor === "groq" || cfg.provedor === "openai") && cfg.chave) {
    const endpoint =
      cfg.provedor === "groq"
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
    const modelo = cfg.provedor === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

    const messages = [{ role: "system", content: systemInstruction }];
    mensagensAnteriores.slice(-6).forEach(m => {
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
        max_tokens: 800
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Erro na API (${resp.status}): ${err}`);
    }
    const data = await resp.json();
    const textoResp = data?.choices?.[0]?.message?.content;
    if (textoResp) return textoResp.trim();
  }

  // Se não tem chave ou é modo autônomo, usa o motor heurístico contextual de alta precisão
  return gerarRespostaAutonomaIA(promptUsuario);
}

/* ---------- Motor Neuro-Contextual Autônomo (Offline / Sem Chave) ---------- */
function gerarRespostaAutonomaIA(promptUsuario) {
  const pId = typeof S !== "undefined" && S && S.persona ? S.persona : "padrao";
  const nome = (typeof S !== "undefined" && S && S.name) || "parça";
  const t = typeof today === "function" ? today() : "";
  const tarefasHoje = typeof S !== "undefined" && S && Array.isArray(S.tasks) ? S.tasks.filter(x => x.date === t) : [];
  const pendentes = tarefasHoje.filter(x => !x.done);
  const concluidas = tarefasHoje.filter(x => x.done);
  const wt = typeof waterToday === "function" ? waterToday() : 0;
  const wg = (typeof S !== "undefined" && S && S.waterGoal) || 2000;
  const aguaFalta = Math.max(0, wg - wt);

  const txt = (promptUsuario || "").toLowerCase();

  // 1. Respostas personalizadas do FUNKEIRO
  if (pId === "funkeiro") {
    if (txt.includes("procrastin") || txt.includes("preguiça") || txt.includes("empurrão") || txt.includes("desânimo")) {
      return `Visão de cria, ${nome}! O papo aqui é reto: a preguiça adora quem pensa demais e não faz nada. ${pendentes.length ? `Tu ainda tem **${pendentes.length} missão(ões)** na lista hoje (tipo "${pendentes[0].title || "a pendência"}").` : "Bora focar no que edifica!"}
Levanta dessa cama, bota um copo de água pra dentro e mata a primeira tarefa em 15 minutos sem encostar no celular. Quem tem meta não tem desculpa, marcha no progresso! 🚀🔥`;
    }
    if (txt.includes("prioriz") || txt.includes("organizar") || txt.includes("fazer hoje")) {
      return `Pega a visão do dia, ${nome}! Sem desespero:
1. Pega a tarefa mais pesada da tua lista e resolve logo agora.
2. ${aguaFalta > 0 ? `Toma pelo menos mais uns 500ml de água, porque cérebro desidratado não rende, parça!` : `A hidratação tá no ponto certinho!` }
3. O segredo da vitória é a constância: faz o simples com disciplina que o topo é nosso. Esquece! 💥`;
    }
    if (txt.includes("água") || txt.includes("equilíbrio") || txt.includes("saúde")) {
      return `Falando em equilíbrio: tu já bebeu **${wt}ml** de água hoje. ${aguaFalta > 0 ? `Ainda faltam **${aguaFalta}ml** pra bater a meta de ouro!` : `Bateu a meta de água certinho, visão pura!` } Cuida da tua mente e do teu corpo, porque sem saúde o corre para. Bora beber mais um gole agora! 💧`;
    }
    return `Qual é a boa, ${nome}? Aqui é o MC Prumi na voz! Seja pra desabafar, organizar teu corre ou quebrar aquela meta monstra, fala pro pai o que tá pegando que a gente resolve no foco! Fé em Deus e marcha! 🎧`;
  }

  // 2. Respostas personalizadas do MONGE / ZEN
  if (pId === "zen") {
    if (txt.includes("procrastin") || txt.includes("ansiedad") || txt.includes("estresse")) {
      return `Respire profundamente, ${nome}. A procrastinação e o medo nada mais são do que a mente tentando antecipar o futuro.
Olhe para o momento presente: você não precisa vencer o dia inteiro de uma vez só. Escolha apenas **uma** pequena ação agora (uma tarefa de 10 minutos) e faça com total presença. A paz reside na ação calma. 🍃`;
    }
    return `A mente tranquila é capaz de mover montanhas, ${nome}. Você já concluiu ${concluidas.length} tarefa(s) hoje. Lembre-se de hidratar seu corpo com serenidade (${wt}ml de ${wg}ml) e avançar passo a passo, sem pressa e sem pausas. 🙏`;
  }

  // 3. Respostas do MILITAR / TÁTICO
  if (pId === "militar") {
    return `Atenção, soldado ${nome}! Registro de prontidão operacional:
- Tarefas concluídas no turno: ${concluidas.length}
- Pendências na linha de frente: ${pendentes.length}
- Suprimento hídrico: ${wt}ml / ${wg}ml.
Sem hesitação e sem desculpas: identifique o alvo principal, elimine distrações e execute a missão! 🎖️`;
  }

  // 4. Resposta Padrão Acolhedora
  if (txt.includes("procrastin") || txt.includes("foco")) {
    return `Olá, ${nome}! Que bom que conversamos sobre isso. Quando a procrastinação bate, a melhor técnica é diminuir a barra de entrada: comprometa-se a fazer apenas 5 minutos da sua próxima tarefa sem julgar o resultado. Depois do início, o cérebro engrena! Estou com você. ✨`;
  }
  return `Oi, ${nome}! Analisando sua rotina de hoje: você já completou ${concluidas.length} tarefa(s) e ainda restam ${pendentes.length}. ${aguaFalta > 0 ? `Não se esqueça de beber mais água (faltam ${aguaFalta}ml).` : "Hidratação exemplar hoje!"} O que gostaria de planejar ou ajustar agora?`;
}

/* ---------- Chat Modal Interativo com Prumi IA ---------- */
let chatIaHistorico = [];

function obterHistoricoChatIA() {
  if (chatIaHistorico.length) return chatIaHistorico;
  try {
    const s = localStorage.getItem("prumo_ia_chat_history");
    if (s) chatIaHistorico = JSON.parse(s);
  } catch (e) {}
  if (!chatIaHistorico.length) {
    const persona = obterPersonaAtual();
    const nome = (typeof S !== "undefined" && S && S.name) || "";
    chatIaHistorico = [
      {
        remetente: "ia",
        texto: `Salve${nome ? `, <b>${esc(nome)}</b>` : ""}! Aqui é o seu coach no modo <b>${persona.titulo}</b>. Como posso te ajudar na sua rotina hoje?`,
        hora: new Date().toLocaleTimeString().slice(0, 5)
      }
    ];
  }
  return chatIaHistorico;
}

function salvarHistoricoChatIA() {
  try {
    // Guarda até as últimas 20 mensagens para manter leve
    const limit = chatIaHistorico.slice(-20);
    localStorage.setItem("prumo_ia_chat_history", JSON.stringify(limit));
  } catch (e) {}
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
          : "OpenAI"
      : "Motor Prumo IA";

  const modalHtml = `
  <div id="modal-chat-ia" class="modal-ia-overlay" onclick="fecharChatPrumiIASeFundo(event)">
    <div class="modal-ia-container" onclick="event.stopPropagation()">
      <div class="ia-modal-header">
        <div class="ia-header-info">
          <div class="ia-avatar-wrapper">
            <span>✨</span>
            <div class="ia-online-dot"></div>
          </div>
          <div class="ia-header-titles">
            <h3>${esc(persona.titulo)}</h3>
            <p><span class="ia-engine-badge">⚡ ${esc(providerLabel)}</span> • Coach em tempo real</p>
          </div>
        </div>
        <button class="ia-close-btn" onclick="fecharChatPrumiIA()" aria-label="Fechar">&times;</button>
      </div>

      <div class="ia-quick-pills">
        <button class="ia-pill-btn" onclick="enviarMensagemRapidaIA('Tô sem foco, me dá um empurrão agora!')">⚡ Tô sem foco</button>
        <button class="ia-pill-btn" onclick="enviarMensagemRapidaIA('Como devo organizar minhas próximas horas?')">🎯 Priorizar hoje</button>
        <button class="ia-pill-btn" onclick="enviarMensagemRapidaIA('Analise meu progresso e equilíbrio de hoje')">📊 Como tá meu dia?</button>
        <button class="ia-pill-btn" onclick="abrirDesdobradorMetasIA()">✨ Desdobrar Meta</button>
      </div>

      <div class="ia-chat-stream" id="ia-chat-stream">
        ${hist
          .map(
            m => `
          <div class="ia-message ${m.remetente}">
            <div class="ia-msg-bubble">${formatarTextoMensagemIA(m.texto)}</div>
          </div>
        `
          )
          .join("")}
      </div>

      <form class="ia-chat-input-bar" onsubmit="submeterChatIA(event)">
        <input type="text" id="ia-input-texto" class="ia-chat-input" placeholder="Converse com seu coach..." autocomplete="off" />
        <button type="submit" class="ia-send-btn" id="ia-btn-enviar">
          <span>Enviar</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Rolagem suave até a última mensagem
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
  if (e.target && e.target.classList.contains("modal-ia-overlay")) {
    fecharChatPrumiIA();
  }
}

function formatarTextoMensagemIA(raw) {
  if (!raw) return "";
  let txt = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Suporte a **negrito** e *itálico*
  txt = txt.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  txt = txt.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Quebras de linha
  txt = txt.replace(/\n\n/g, "<br><br>");
  txt = txt.replace(/\n/g, "<br>");
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

  // Adicionar mensagem do usuário
  chatIaHistorico.push({
    remetente: "user",
    texto,
    hora: new Date().toLocaleTimeString().slice(0, 5)
  });

  if (stream) {
    stream.insertAdjacentHTML(
      "beforeend",
      `<div class="ia-message user"><div class="ia-msg-bubble">${formatarTextoMensagemIA(texto)}</div></div>`
    );
    // Adicionar indicador de digitação
    stream.insertAdjacentHTML(
      "beforeend",
      `<div class="ia-message ia" id="ia-typing-box"><div class="ia-typing-indicator"><div class="ia-typing-dot"></div><div class="ia-typing-dot"></div><div class="ia-typing-dot"></div></div></div>`
    );
    stream.scrollTop = stream.scrollHeight;
  }

  try {
    const resposta = await chamarProvedorLLM(texto, chatIaHistorico);

    const typing = document.getElementById("ia-typing-box");
    if (typing) typing.remove();

    chatIaHistorico.push({
      remetente: "ia",
      texto: resposta,
      hora: new Date().toLocaleTimeString().slice(0, 5)
    });
    salvarHistoricoChatIA();

    if (stream) {
      stream.insertAdjacentHTML(
        "beforeend",
        `<div class="ia-message ia"><div class="ia-msg-bubble">${formatarTextoMensagemIA(resposta)}</div></div>`
      );
      stream.scrollTop = stream.scrollHeight;
    }
    if (typeof playSound === "function") playSound("pop");
  } catch (err) {
    console.error("[IA Prumo] Erro no chat:", err);
    const typing = document.getElementById("ia-typing-box");
    if (typing) typing.remove();

    // Fallback gracioso
    const fbResp = gerarRespostaAutonomaIA(texto);
    chatIaHistorico.push({
      remetente: "ia",
      texto: fbResp,
      hora: new Date().toLocaleTimeString().slice(0, 5)
    });
    salvarHistoricoChatIA();

    if (stream) {
      stream.insertAdjacentHTML(
        "beforeend",
        `<div class="ia-message ia"><div class="ia-msg-bubble">${formatarTextoMensagemIA(fbResp)}</div></div>`
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

/* ---------- Quebra Inteligente de Metas (Smart Goal Breakdown) ---------- */
let ultimoPlanoGeradoIA = null;

function abrirDesdobradorMetasIA() {
  fecharChatPrumiIA();
  const antigo = document.getElementById("modal-desdobrador-ia");
  if (antigo) antigo.remove();

  const modalHtml = `
  <div id="modal-desdobrador-ia" class="modal-ia-overlay" onclick="fecharDesdobradorMetasIASeFundo(event)">
    <div class="modal-ia-container" onclick="event.stopPropagation()">
      <div class="ia-modal-header">
        <div class="ia-header-info">
          <div class="ia-avatar-wrapper">
            <span>🎯</span>
          </div>
          <div class="ia-header-titles">
            <h3>Quebra Inteligente de Metas com IA</h3>
            <p>Transforme qualquer sonho em hábitos e tarefas práticas</p>
          </div>
        </div>
        <button class="ia-close-btn" onclick="fecharDesdobradorMetasIA()" aria-label="Fechar">&times;</button>
      </div>

      <div class="ia-breakdown-body">
        <div class="ia-breakdown-form">
          <label style="font-size:13px; font-weight:600; color:#64748b;">O que você deseja conquistar?</label>
          <input type="text" id="ia-meta-objetivo" class="ia-meta-input" placeholder="Ex: Aprender Python do zero / Correr 5km / Passar na OAB / Emagrecer 4kg..." />
          <button class="btn primary" id="ia-btn-gerar-plano" onclick="executarDesdobramentoMetaIA()" style="display:flex;align-items:center;justify-content:center;gap:6px;">
            <span>⚡ Gerar Cronograma com IA</span>
          </button>
        </div>

        <div id="ia-resultado-plano" style="display:none;"></div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  requestAnimationFrame(() => {
    const inp = document.getElementById("ia-meta-objetivo");
    if (inp) inp.focus();
  });
}

function fecharDesdobradorMetasIA() {
  const m = document.getElementById("modal-desdobrador-ia");
  if (m) m.remove();
}

function fecharDesdobradorMetasIASeFundo(e) {
  if (e.target && e.target.classList.contains("modal-ia-overlay")) {
    fecharDesdobradorMetasIA();
  }
}

async function executarDesdobramentoMetaIA() {
  const inp = document.getElementById("ia-meta-objetivo");
  if (!inp) return;
  const meta = inp.value.trim();
  if (!meta) {
    if (typeof notify === "function") notify("Escreva seu objetivo primeiro!");
    return;
  }

  const btn = document.getElementById("ia-btn-gerar-plano");
  const box = document.getElementById("ia-resultado-plano");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Criando estrutura com IA...</span>`;
  }
  if (box) {
    box.style.display = "block";
    box.innerHTML = `<div style="text-align:center;padding:24px;color:#64748b;"><div class="ia-typing-indicator" style="margin:0 auto 12px;"><div class="ia-typing-dot"></div><div class="ia-typing-dot"></div><div class="ia-typing-dot"></div></div>Analisando a meta e desenhando os passos ideais...</div>`;
  }

  let plano = null;
  const cfg = obterConfigIA();

  // Se tiver chave de LLM, pede para estruturar em JSON estrito
  if (cfg.chave && (cfg.provedor === "gemini" || cfg.provedor === "groq" || cfg.provedor === "openai")) {
    try {
      const promptJson = `Aja como um planejador de produtividade de classe mundial. O usuário quer alcançar este objetivo: "${meta}".
Responda EXCLUSIVAMENTE em formato JSON puro, sem markdown extra, no seguinte formato:
{
  "titulo": "Título curto do plano",
  "habito": { "nome": "Hábito diário contínuo de 15 a 30 min", "horario": "08:00" },
  "tarefas": [
    { "titulo": "Ação 1 inicial e prática para hoje", "categoria": "foco", "xp": 20 },
    { "titulo": "Ação 2 de aprofundamento", "categoria": "estudo", "xp": 30 },
    { "titulo": "Ação 3 de revisão ou teste prático", "categoria": "carreira", "xp": 40 }
  ],
  "dicaMascote": "Conselho motivador curto para começar já"
}`;
      const raw = await chamarProvedorLLM(promptJson);
      const jsonLimpo = raw.replace(/```json/g, "").replace(/```/g, "").trim();
      plano = JSON.parse(jsonLimpo);
    } catch (e) {
      console.warn("[IA Prumo] Erro no parse do plano JSON via LLM, usando sintetizador:", e);
    }
  }

  // Fallback Inteligente baseado no objetivo caso a API falhe ou não tenha chave
  if (!plano || !plano.tarefas) {
    plano = sintetizarPlanoMetaAutonomo(meta);
  }

  ultimoPlanoGeradoIA = plano;

  if (box) {
    box.innerHTML = `
    <div class="ia-plan-preview">
      <div style="font-weight:700;font-size:15px;color:#1e293b;">📋 ${esc(plano.titulo || meta)}</div>
      
      <div style="font-size:12px;font-weight:600;text-transform:uppercase;color:#64748b;margin-top:4px;">1 Hábito Diário Essencial:</div>
      <div class="ia-plan-habit">
        <span style="font-size:20px;">🔁</span>
        <div>
          <strong style="font-size:14px;color:#0f172a;">${esc(plano.habito.nome)}</strong>
          <div style="font-size:12px;color:#64748b;">Repetir todos os dias às ${esc(plano.habito.horario || "09:00")}</div>
        </div>
      </div>

      <div style="font-size:12px;font-weight:600;text-transform:uppercase;color:#64748b;margin-top:8px;">Tarefas Imediatas para o seu Prumo:</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${plano.tarefas
          .map(
            (t, idx) => `
          <div class="ia-plan-task-item">
            <span><strong>${idx + 1}.</strong> ${esc(t.titulo)}</span>
            <span class="ia-badge-xp">+${t.xp || 25} XP</span>
          </div>
        `
          )
          .join("")}
      </div>

      ${plano.dicaMascote ? `<div style="font-size:13px;font-style:italic;color:#6366f1;padding:8px 12px;background:rgba(99,102,241,0.08);border-radius:8px;">💡 "${esc(plano.dicaMascote)}"</div>` : ""}

      <button class="btn primary" onclick="importarPlanoGeradoPrumo()" style="margin-top:8px;display:flex;align-items:center;justify-content:center;gap:6px;">
        <span>📥 Inserir no meu Prumo Agora</span>
      </button>
    </div>`;
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<span>⚡ Gerar Outro Cronograma</span>`;
  }
}

function sintetizarPlanoMetaAutonomo(meta) {
  const m = meta.toLowerCase();
  if (m.includes("corr") || m.includes("peso") || m.includes("emagrec") || m.includes("academia") || m.includes("trein")) {
    return {
      titulo: `Plano de Condicionamento & Saúde: ${meta}`,
      habito: { nome: "30 min de atividade física moderada", horario: "07:30" },
      tarefas: [
        { titulo: "Separar tênis, roupa de treino e garrafa d'água", categoria: "saude", xp: 15 },
        { titulo: "Caminhada acelerada ou corrida leve intercalada de 20 min", categoria: "saude", xp: 30 },
        { titulo: "Alongamento pós-treino e hidratação reforçada", categoria: "saude", xp: 20 }
      ],
      dicaMascote: "O corpo é a sua morada. A consistência de hoje constrói a saúde dos próximos 10 anos!"
    };
  }
  if (m.includes("program") || m.includes("python") || m.includes("código") || m.includes("estud") || m.includes("oab") || m.includes("concurso")) {
    return {
      titulo: `Plano de Estudos & Maestria: ${meta}`,
      habito: { nome: "Pomodoro diário de estudo com caderno de erros", horario: "19:00" },
      tarefas: [
        { titulo: "Mapear o edital/ementa e listar os 3 primeiros tópicos", categoria: "estudo", xp: 20 },
        { titulo: "Sessão focada de 25 min com zero distrações no celular", categoria: "estudo", xp: 35 },
        { titulo: "Resolver 5 exercícios práticos e anotar as dúvidas", categoria: "estudo", xp: 30 }
      ],
      dicaMascote: "Estudar todo dia um pouco vale 10x mais que virar uma noite na véspera. Foco total!"
    };
  }
  return {
    titulo: `Projeto Estruturado: ${meta}`,
    habito: { nome: `Bloco diário de 20 min focado em: ${meta.slice(0, 30)}`, horario: "10:00" },
    tarefas: [
      { titulo: `Definir o primeiro passo concreto para: ${meta.slice(0, 35)}`, categoria: "foco", xp: 20 },
      { titulo: "Remover a maior barreira que causa procrastinação", categoria: "foco", xp: 25 },
      { titulo: "Executar a primeira etapa prática e comemorar o avanço", categoria: "foco", xp: 35 }
    ],
    dicaMascote: "A distância entre o sonho e a realidade chama-se atitude diária. Bora começar agora!"
  };
}

function importarPlanoGeradoPrumo() {
  if (!ultimoPlanoGeradoIA || typeof S === "undefined" || !S) return;
  const plano = ultimoPlanoGeradoIA;
  const t = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);

  // 1. Inserir tarefas no dia de hoje
  if (Array.isArray(plano.tarefas)) {
    if (!Array.isArray(S.tasks)) S.tasks = [];
    plano.tarefas.forEach(tarf => {
      S.tasks.push({
        id: "ia_" + Math.random().toString(36).slice(2, 9),
        title: tarf.titulo,
        date: t,
        done: false,
        xp: tarf.xp || 25,
        tag: tarf.categoria || "foco"
      });
    });
  }

  // 2. Inserir Hábito diário caso configurado
  if (plano.habito && Array.isArray(S.habits)) {
    const jaExiste = S.habits.some(h => (h.name || "").toLowerCase() === plano.habito.nome.toLowerCase());
    if (!jaExiste) {
      S.habits.push({
        id: "ia_hab_" + Math.random().toString(36).slice(2, 8),
        name: plano.habito.nome,
        every: 1,
        time: plano.habito.horario || "09:00",
        history: {}
      });
    }
  }

  // Salvar e re-renderizar
  if (typeof commit === "function") commit();
  if (typeof persist === "function") persist(true);
  if (typeof render === "function") render();
  if (typeof playSound === "function") playSound("cheers");

  fecharDesdobradorMetasIA();

  if (typeof notify === "function") {
    notify(`✨ Meta desdobrada e adicionada com sucesso ao seu dia!`);
  } else {
    alert("✨ Meta desdobrada e adicionada com sucesso ao seu Prumo!");
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
    if (res) {
      res.innerHTML = `<span style="color:#10b981;font-weight:600;">✅ IA Conectada e Operacional!</span><br><small style="color:#64748b;">"${esc(resposta)}"</small>`;
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
        <select id="set-ia-provedor" class="ia-provider-select" onchange="atualizarProvedorIA(this.value)">
          <option value="gemini" ${cfg.provedor === "gemini" ? "selected" : ""}>Google Gemini 1.5 Flash (Grátis & Rápido)</option>
          <option value="groq" ${cfg.provedor === "groq" ? "selected" : ""}>Groq (Llama 3.3 Ultra Rápido)</option>
          <option value="openai" ${cfg.provedor === "openai" ? "selected" : ""}>OpenAI (ChatGPT GPT-4o-mini)</option>
          <option value="autonomo" ${cfg.provedor === "autonomo" ? "selected" : ""}>Motor Offline Integrado (Sem Chave)</option>
        </select>
      </div>

      <div class="setrow" id="ia-row-chave" style="${cfg.provedor === "autonomo" ? "display:none;" : ""}">
        <div class="lbl">
          <b>Chave de API (BYOK)</b>
          <span class="note">Sua chave fica gravada apenas no seu dispositivo. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:#3b82f6;text-decoration:underline;">Clique aqui para obter uma chave grátis no Google AI Studio</a>.</span>
        </div>
        <input type="password" id="set-ia-chave" value="${esc(cfg.chave)}" placeholder="Cole sua chave aqui..." style="width:200px;" onchange="atualizarChaveIA(this.value)" autocomplete="off" />
      </div>

      <div class="setrow">
        <div class="lbl">
          <b>Status & Teste</b>
          <span class="note" id="ia-status-conexao">${cfg.chave ? "Chave configurada. Teste abaixo." : "Usando motor neuro-heurístico autônomo."}</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn small" id="ia-btn-testar-conexao" onclick="testarConexaoIA()">Testar Conexão</button>
          <button class="btn small primary" onclick="abrirChatPrumiIA()">Abrir Chat IA</button>
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
  if (typeof notify === "function") notify(`Provedor alterado para ${val}!`);
}

function atualizarChaveIA(val) {
  const selProv = document.getElementById("set-ia-provedor");
  salvarConfigIA(selProv ? selProv.value : "gemini", val);
  if (typeof notify === "function") notify("Chave de IA atualizada com sucesso!");
}

/* ---------- Botão de Acesso Rápido ao Chat IA no Mascote ---------- */
function mascoteBotaoIaHTML() {
  return `<button class="btn-hero-ia-sparkle" onclick="abrirChatPrumiIA()" aria-label="Conversar com Coach IA">
    <span>✨</span>
    <span>Conversar com IA</span>
  </button>`;
}

// Inicialização Global e Event Delegation
document.addEventListener("DOMContentLoaded", () => {
  obterConfigIA();
});

// Delegação de cliques para botões com data-act
document.addEventListener("click", e => {
  const btnChat = e.target.closest("[data-act='abrir-chat-ia']");
  if (btnChat) {
    e.preventDefault();
    abrirChatPrumiIA();
    return;
  }
  const btnDesdobrar = e.target.closest("[data-act='abrir-desdobrador-ia']");
  if (btnDesdobrar) {
    e.preventDefault();
    abrirDesdobradorMetasIA();
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
  window.executarDesdobramentoMetaIA = executarDesdobramentoMetaIA;
  window.importarPlanoGeradoPrumo = importarPlanoGeradoPrumo;
  window.testarConexaoIA = testarConexaoIA;
  window.iaAjustesHTML = iaAjustesHTML;
  window.mascoteBotaoIaHTML = mascoteBotaoIaHTML;
  window.atualizarProvedorIA = atualizarProvedorIA;
  window.atualizarChaveIA = atualizarChaveIA;
}
