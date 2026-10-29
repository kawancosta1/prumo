/*
  js/estudos-avancados.js - Ferramentas de Alta Performance para Estudos:
  1. Bateria Diária de Questões (contador de metas, acertos, taxa de precisão e gamificação).
  2. Caderno de Erros Estratégico (classificação por Teoria, Falta de Atenção, Pegadinha, Cálculo ou Tempo).
  3. Sistema de Flashcards com Repetição Espaçada SM-2 (Algoritmo SuperMemo 2, revisão interativa e atalhos).
  4. Gerador Inteligente de Flashcards Acadêmicos.
*/
"use strict";

const MOTIVOS_ERRO_ESTUDO = {
  teoria: { label: "Teoria / Lacuna", emoji: "🧠", cor: "#8B5CF6", bg: "rgba(139, 92, 246, 0.12)" },
  atencao: { label: "Falta de Atenção", emoji: "👁️", cor: "#F59E0B", bg: "rgba(245, 158, 11, 0.12)" },
  pegadinha: { label: "Pegadinha da Banca", emoji: "🪤", cor: "#EF4444", bg: "rgba(239, 68, 68, 0.12)" },
  calculo: { label: "Cálculo / Álgebra", emoji: "📐", cor: "#3B82F6", bg: "rgba(59, 130, 246, 0.12)" },
  tempo: { label: "Pressão / Tempo", emoji: "⏳", cor: "#64748B", bg: "rgba(100, 116, 139, 0.12)" }
};

let filtroCadernoAtivo = "todos"; // "todos", "pendentes", "superados"
let estadoSessaoFlashcard = null; // { deck: [], idx: 0, virado: false, respondidos: 0, acertos: 0 }

/** Garante e normaliza a bateria de questões de hoje */
function garantirQuestionStats() {
  const tHoje = today();
  if (!S.questionStats || typeof S.questionStats !== "object") {
    S.questionStats = { date: tHoje, done: 0, correct: 0, goal: 30 };
  } else {
    if (S.questionStats.date !== tHoje) {
      S.questionStats.date = tHoje;
      S.questionStats.done = 0;
      S.questionStats.correct = 0;
    }
    if (typeof S.questionStats.done !== "number") S.questionStats.done = 0;
    if (typeof S.questionStats.correct !== "number") S.questionStats.correct = 0;
    if (typeof S.questionStats.goal !== "number" || S.questionStats.goal <= 0) S.questionStats.goal = 30;
  }
  return S.questionStats;
}

/** Garante lista de flashcards */
function garantirFlashcards() {
  if (!Array.isArray(S.flashcards)) S.flashcards = [];
  return S.flashcards;
}

/** Garante lista de caderno de erros */
function garantirCadernoErros() {
  if (!Array.isArray(S.errorLog)) S.errorLog = [];
  return S.errorLog;
}

/** Algoritmo SuperMemo SM-2 para repetição espaçada */
function calcularSM2SuperMemo(card, avaliacao) {
  // avaliacao: 1 (Errei), 2 (Difícil), 3 (Bom), 4 (Fácil)
  const q = Number(avaliacao);
  let reps = card.repetitions || 0;
  let interval = card.interval || 1;
  let ef = card.easeFactor || 2.5;

  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    if (reps === 0) {
      interval = 1;
    } else if (reps === 1) {
      interval = q === 4 ? 4 : 6;
    } else {
      const bonus = q === 4 ? 1.3 : 1.0;
      interval = Math.max(1, Math.round(interval * ef * bonus));
    }
    reps++;
  }

  // Ajuste matemático do fator de facilidade (EF)
  const grade = q === 1 ? 1 : q === 2 ? 2 : q === 3 ? 4 : 5;
  ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (ef < 1.3) ef = 1.3;

  return {
    repetitions: reps,
    interval: interval,
    easeFactor: parseFloat(ef.toFixed(2)),
    due: addDays(today(), interval)
  };
}

/* ==========================================================================
   RENDERIZAÇÃO DA BATERIA DIÁRIA DE QUESTÕES
   ========================================================================== */
function renderBateriaQuestoesHTML() {
  const qs = garantirQuestionStats();
  const done = qs.done;
  const correct = qs.correct;
  const goal = qs.goal;
  const erros = Math.max(0, done - correct);
  const taxa = done > 0 ? Math.round((correct / done) * 100) : 0;
  const pctMeta = Math.min(100, Math.round((done / goal) * 100));

  let taxaClasse = "alta";
  if (done > 0) {
    if (taxa < 65) taxaClasse = "baixa";
    else if (taxa < 80) taxaClasse = "media";
  }

  return `
  <section class="block">
    <div class="bateria-questoes-container">
      <div class="bateria-header">
        <div class="bateria-titulo-grupo">
          <div class="bateria-icone">🎯</div>
          <div>
            <h3 class="bateria-titulo">Bateria Diária de Questões</h3>
            <span class="bateria-subtitulo">${done} de ${goal} resolvidas hoje · Meta: ${pctMeta}% concluída</span>
          </div>
        </div>
        ${done > 0 ? `<span class="bateria-taxa-badge ${taxaClasse}">📊 ${taxa}% de Acertos</span>` : ""}
      </div>

      <div class="bateria-progresso-trilho" title="${pctMeta}% da meta de hoje">
        <div class="bateria-progresso-preenchimento" style="width: ${pctMeta}%"></div>
      </div>

      <div class="bateria-stats-grid">
        <div class="bateria-stat-item">
          <div class="bateria-stat-valor acerto">${correct}</div>
          <div class="bateria-stat-rotulo">Acertos</div>
        </div>
        <div class="bateria-stat-item">
          <div class="bateria-stat-valor erro">${erros}</div>
          <div class="bateria-stat-rotulo">Erros</div>
        </div>
        <div class="bateria-stat-item">
          <div class="bateria-stat-valor meta">${goal}</div>
          <div class="bateria-stat-rotulo">Meta Diária</div>
        </div>
      </div>

      <div class="bateria-acoes-row">
        <button type="button" class="btn btn-questao-acerto" data-act="questao-mais-acerto" title="Registrar questão acertada">
          ✅ +1 Acerto
        </button>
        <button type="button" class="btn btn-questao-erro" data-act="questao-mais-erro" title="Registrar erro e catalogar no Caderno de Erros">
          ❌ +1 Erro
        </button>
        <button type="button" class="btn ghost small" data-act="questao-ajustar-meta" title="Alterar a meta de questões do dia">
          🎯 Meta: ${goal}
        </button>
        <button type="button" class="btn ghost small" data-act="questao-zerar-hoje" title="Reiniciar contagem de hoje">
          🔄 Zerar
        </button>
        <button type="button" class="btn ghost small" data-act="abrir-respiracao-478" title="Respiração 4-7-8 para foco e combate à ansiedade de provas">
          🧘 60s Foco
        </button>
      </div>
    </div>
  </section>`;
}

/* ==========================================================================
   RENDERIZAÇÃO DOS FLASHCARDS (SUPERMEMO SM-2)
   ========================================================================== */
function flashcardsParaRevisarHoje() {
  const fcs = garantirFlashcards();
  const tHoje = today();
  return fcs.filter(c => !c.due || c.due <= tHoje);
}

function renderFlashcardsHTML() {
  const fcs = garantirFlashcards();
  const devidos = flashcardsParaRevisarHoje();
  const tHoje = today();

  return `
  <section class="block">
    <div class="flashcards-header-acoes">
      <h2 class="h2" style="margin:0;">Flashcards SM-2 <span class="count">${devidos.length} para hoje</span></h2>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button type="button" class="btn small" data-act="abrir-modal-novo-flashcard">+ Novo Card</button>
        <button type="button" class="btn small ghost" data-act="gerar-flashcards-ia" style="font-weight:700;">✨ Gerar com IA</button>
      </div>
    </div>

    <div class="flashcards-deck-card">
      <div class="flashcards-deck-info">
        <div class="flashcards-deck-icone">🗂️</div>
        <div>
          <h3 class="flashcards-deck-titulo">Baralho Ativo de Repetição Espaçada</h3>
          <div class="flashcards-deck-sub">
            <b>${devidos.length}</b> aguardando revisão · <b>${fcs.length}</b> cartões no total
          </div>
        </div>
      </div>
      <div class="flashcards-deck-botoes">
        <button type="button" class="btn primary" data-act="iniciar-revisao-flashcards" ${devidos.length === 0 ? "disabled" : ""} style="font-weight:700;">
          ▶ Revisar Agora (${devidos.length})
        </button>
      </div>
    </div>

    ${fcs.length > 0 ? `
    <details class="more" style="margin-top:10px;">
      <summary>Ver todos os flashcards (${fcs.length})</summary>
      <ul class="list" style="margin-top:8px;">
        ${fcs.slice(0, 40).map(c => `
          <li>
            <div class="item">
              <span class="slot" style="--c:${subjColor(c.subjectId)}">🗂️</span>
              <div class="main">
                <span class="title">${esc(c.front)}</span>
                <span class="meta">
                  <span class="chip" style="--c:${subjColor(c.subjectId)}">${esc(subjName(c.subjectId) || "Geral")}</span>
                  <span>·</span>
                  <span>Próxima: ${c.due <= tHoje ? "<b>Hoje</b>" : fmtShort(c.due)}</span>
                  <span>·</span>
                  <span>Repetições: ${c.repetitions || 0}</span>
                </span>
              </div>
              <button class="icon" data-act="excluir-flashcard" data-id="${c.id}" aria-label="Apagar flashcard">${ICON.trash}</button>
            </div>
          </li>
        `).join("")}
      </ul>
    </details>
    ` : ""}
  </section>`;
}

/* ==========================================================================
   RENDERIZAÇÃO DO CADERNO DE ERROS ESTRATÉGICO
   ========================================================================== */
function renderCadernoErrosHTML() {
  const erros = garantirCadernoErros();
  const total = erros.length;
  const pendentes = erros.filter(e => !e.resolved).length;
  const superados = erros.filter(e => e.resolved).length;

  // Raio-X Diagnóstico de causas raízes
  const contagemMotivos = {};
  for (const k of Object.keys(MOTIVOS_ERRO_ESTUDO)) contagemMotivos[k] = 0;
  for (const e of erros) {
    if (contagemMotivos[e.reason] !== undefined) contagemMotivos[e.reason]++;
  }

  let listaExibida = erros;
  if (filtroCadernoAtivo === "pendentes") listaExibida = erros.filter(e => !e.resolved);
  else if (filtroCadernoAtivo === "superados") listaExibida = erros.filter(e => e.resolved);

  return `
  <section class="block">
    <div class="caderno-header-acoes">
      <h2 class="h2" style="margin:0;">Caderno de Erros Estratégico <span class="count">${pendentes} pendentes</span></h2>
      <button type="button" class="btn small primary" data-act="abrir-modal-novo-erro" style="font-weight:700;">
        + Catalogar Erro
      </button>
    </div>

    ${total > 0 ? `
    <div class="caderno-raio-x">
      <div class="caderno-raio-x-titulo">
        <span>🔍 <b>Raio-X Cognitivo</b>: onde você está perdendo pontos</span>
      </div>
      <div class="caderno-raio-x-pills">
        ${Object.entries(MOTIVOS_ERRO_ESTUDO).map(([k, m]) => {
          const qtd = contagemMotivos[k] || 0;
          const pct = total > 0 ? Math.round((qtd / total) * 100) : 0;
          return `<span class="caderno-raio-x-pill" style="border-left: 3px solid ${m.cor};">
            ${m.emoji} ${m.label}: <b>${qtd} (${pct}%)</b>
          </span>`;
        }).join("")}
      </div>
    </div>

    <div class="caderno-filtros-row">
      <button type="button" class="caderno-filtro-btn ${filtroCadernoAtivo === "todos" ? "ativo" : ""}" data-act="filtro-caderno-erros" data-filtro="todos">
        Todos (${total})
      </button>
      <button type="button" class="caderno-filtro-btn ${filtroCadernoAtivo === "pendentes" ? "ativo" : ""}" data-act="filtro-caderno-erros" data-filtro="pendentes">
        Pendentes (${pendentes})
      </button>
      <button type="button" class="caderno-filtro-btn ${filtroCadernoAtivo === "superados" ? "ativo" : ""}" data-act="filtro-caderno-erros" data-filtro="superados">
        Superados (${superados})
      </button>
    </div>
    ` : ""}

    ${listaExibida.length > 0 ? `
    <div class="caderno-erros-lista">
      ${listaExibida.map(e => {
        const m = MOTIVOS_ERRO_ESTUDO[e.reason] || MOTIVOS_ERRO_ESTUDO.teoria;
        return `
        <div class="caderno-erro-item ${e.resolved ? "superado" : ""}">
          <div class="caderno-erro-topo">
            <span class="badge-motivo-erro" style="background:${m.bg};color:${m.cor};border-color:${m.cor}40;">
              ${m.emoji} ${m.label}
            </span>
            <span class="chip" style="--c:${subjColor(e.subjectId)}">${esc(subjName(e.subjectId) || "Geral")}</span>
          </div>

          <div class="caderno-erro-topico">${esc(e.topic)}</div>

          ${e.note ? `
          <div class="caderno-regra-ouro-box">
            <b>💡 Regra de Ouro / Como Não Errar:</b> ${esc(e.note)}
          </div>
          ` : ""}

          <div class="caderno-erro-rodape">
            <span>Registrado em ${fmtShort(e.date || today())}</span>
            <div class="caderno-erro-acoes">
              <button type="button" class="btn small" data-act="criar-flashcard-do-erro" data-id="${e.id}" title="Gerar Flashcard SM-2 focado nesta regra">
                🗂️ Virar Card
              </button>
              <button type="button" class="btn small ${e.resolved ? "ghost" : "primary"}" data-act="alternar-erro-superado" data-id="${e.id}">
                ${e.resolved ? "↩ Reabrir" : "✅ Dominado"}
              </button>
              <button type="button" class="icon" data-act="excluir-erro-caderno" data-id="${e.id}" aria-label="Apagar">${ICON.trash}</button>
            </div>
          </div>
        </div>
        `;
      }).join("")}
    </div>
    ` : `
    <div class="empty">
      <strong>${total === 0 ? "Nenhum erro catalogado ainda." : "Nenhum erro nesta categoria."}</strong>
      Quando errar uma questão em simulados ou listas, registre aqui a causa raiz. Isolar o erro é a forma mais rápida de subir seu percentual de acertos!
    </div>
    `}
  </section>`;
}

/* ==========================================================================
   MODAIS E TELAS INTERATIVAS
   ========================================================================== */

/** Modal de Sessão de Revisão de Flashcards com SM-2 */
function abrirModalRevisaoFlashcards() {
  const devidos = flashcardsParaRevisarHoje();
  if (!devidos.length) {
    toast("Nenhum flashcard precisando de revisão hoje!", false, "happy");
    return;
  }

  estadoSessaoFlashcard = {
    deck: [...devidos],
    idx: 0,
    virado: false,
    respondidos: 0,
    acertos: 0
  };

  const modalExistente = document.getElementById("modal-revisao-flashcards");
  if (modalExistente) modalExistente.remove();

  const modalHtml = `
  <div id="modal-revisao-flashcards" class="modal-estudo-overlay" data-act="fechar-modal-estudo-fundo">
    <div class="modal-estudo-container" onclick="event.stopPropagation()">
      <div class="modal-estudo-header">
        <h3 class="modal-estudo-header-titulo">
          <span>🗂️</span> Revisão Ativa SM-2
        </h3>
        <button type="button" class="modal-estudo-fechar" data-act="fechar-modal-revisao-flashcards">&times;</button>
      </div>
      <div class="modal-estudo-corpo" id="flashcard-sessao-corpo">
        ${renderCardSessaoHTML()}
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function fecharModalRevisaoFlashcards() {
  const m = document.getElementById("modal-revisao-flashcards");
  if (m) m.remove();
  estadoSessaoFlashcard = null;
  render();
}

function renderCardSessaoHTML() {
  if (!estadoSessaoFlashcard) return "";
  const { deck, idx, virado } = estadoSessaoFlashcard;

  if (idx >= deck.length) {
    // Fim da sessão de estudos!
    const bonusXp = 50;
    const bonusMoedas = 20;
    S.xp = (S.xp || 0) + bonusXp;
    S.coins = (S.coins || 0) + bonusMoedas;
    commit();

    return `
    <div class="flashcard-sucesso-container">
      <div class="flashcard-sucesso-emoji">🏆</div>
      <h2 class="h2" style="margin:0;">Sessão Concluída!</h2>
      <p style="color:var(--sub);margin:0;">Você revisou todos os <b>${deck.length} flashcards</b> devidos para hoje.</p>
      <div style="background:var(--sunken);padding:10px 16px;border-radius:12px;font-weight:700;color:#10B981;">
        +${bonusXp} XP · +${bonusMoedas} Gotas / Moedas
      </div>
      <button type="button" class="btn primary" data-act="fechar-modal-revisao-flashcards" style="margin-top:12px;font-weight:700;">
        Concluir e Voltar
      </button>
    </div>`;
  }

  const card = deck[idx];
  const total = deck.length;

  return `
  <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;color:var(--sub);">
    <span class="chip" style="--c:${subjColor(card.subjectId)}">${esc(subjName(card.subjectId) || "Geral")}</span>
    <span>Card <b>${idx + 1}</b> de <b>${total}</b></span>
  </div>

  <div class="flashcard-arena">
    <div class="flashcard-flipper-box ${virado ? "virado" : ""}">
      <div class="flashcard-pergunta-txt">
        ${esc(card.front)}
      </div>

      ${virado ? `
      <div class="flashcard-resposta-box">
        <div style="font-size:0.75rem;font-weight:700;color:#8B5CF6;text-transform:uppercase;margin-bottom:4px;">Resposta:</div>
        <div class="flashcard-resposta-txt">${esc(card.back)}</div>
      </div>
      ` : ""}
    </div>
  </div>

  ${!virado ? `
  <button type="button" class="btn primary" data-act="mostrar-resposta-flashcard" style="width:100%;padding:14px;font-weight:700;font-size:1rem;">
    👁️ Mostrar Resposta (Espaço)
  </button>
  ` : `
  <div>
    <div style="font-size:0.75rem;color:var(--sub);text-align:center;margin-bottom:8px;">
      Como foi a lembrança? Escolha o nível (Teclas 1, 2, 3, 4):
    </div>
    <div class="flashcard-sm2-grid">
      <button type="button" class="btn-sm2 btn-sm2-repetir" data-act="avaliar-flashcard" data-rating="1">
        1. Repetir
        <span>1 dia</span>
      </button>
      <button type="button" class="btn-sm2 btn-sm2-dificil" data-act="avaliar-flashcard" data-rating="2">
        2. Difícil
        <span>1 dia</span>
      </button>
      <button type="button" class="btn-sm2 btn-sm2-bom" data-act="avaliar-flashcard" data-rating="3">
        3. Bom
        <span>${calcularSM2SuperMemo(card, 3).interval}d</span>
      </button>
      <button type="button" class="btn-sm2 btn-sm2-facil" data-act="avaliar-flashcard" data-rating="4">
        4. Fácil
        <span>${calcularSM2SuperMemo(card, 4).interval}d</span>
      </button>
    </div>
  </div>
  `}`;
}

/** Modal para Criar Novo Flashcard */
function abrirModalNovoFlashcard(subjId = "", frente = "", verso = "") {
  const modalExistente = document.getElementById("modal-novo-flashcard");
  if (modalExistente) modalExistente.remove();

  const subjOpts = S.subjects
    .map(s => `<option value="${s.id}" ${s.id === subjId ? "selected" : ""}>${esc(s.name)}</option>`)
    .join("");

  const modalHtml = `
  <div id="modal-novo-flashcard" class="modal-estudo-overlay" data-act="fechar-modal-estudo-fundo">
    <div class="modal-estudo-container" onclick="event.stopPropagation()">
      <div class="modal-estudo-header">
        <h3 class="modal-estudo-header-titulo">
          <span>🗂️</span> Novo Flashcard
        </h3>
        <button type="button" class="modal-estudo-fechar" data-act="fechar-modal-novo-flashcard">&times;</button>
      </div>
      <form class="modal-estudo-corpo" data-form="novo-flashcard">
        <div>
          <label class="label" for="fc-subj">Matéria:</label>
          <select id="fc-subj" style="width:100%;margin-top:4px;">
            <option value="">Sem matéria vinculada</option>
            ${subjOpts}
          </select>
        </div>
        <div>
          <label class="label" for="fc-front">Frente (Pergunta, Conceito ou Fórmula):</label>
          <textarea id="fc-front" rows="3" style="width:100%;margin-top:4px;resize:vertical;" required placeholder="Ex.: O que diz a Regra da Cadeia para [f(g(x))]'?">${esc(frente)}</textarea>
        </div>
        <div>
          <label class="label" for="fc-back">Verso (Resposta, Resolução ou Mnemônico):</label>
          <textarea id="fc-back" rows="3" style="width:100%;margin-top:4px;resize:vertical;" required placeholder="Ex.: A derivada é f'(g(x)) * g'(x)">${esc(verso)}</textarea>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
          <button type="button" class="btn ghost" data-act="fechar-modal-novo-flashcard">Cancelar</button>
          <button type="submit" class="btn primary" style="font-weight:700;">Salvar Flashcard</button>
        </div>
      </form>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function fecharModalNovoFlashcard() {
  const m = document.getElementById("modal-novo-flashcard");
  if (m) m.remove();
}

/** Modal para Registrar Questão no Caderno de Erros */
function abrirModalNovoErro(subjId = "", topico = "", motivo = "atencao") {
  const modalExistente = document.getElementById("modal-novo-erro");
  if (modalExistente) modalExistente.remove();

  const subjOpts = S.subjects
    .map(s => `<option value="${s.id}" ${s.id === subjId ? "selected" : ""}>${esc(s.name)}</option>`)
    .join("");

  const modalHtml = `
  <div id="modal-novo-erro" class="modal-estudo-overlay" data-act="fechar-modal-estudo-fundo">
    <div class="modal-estudo-container" onclick="event.stopPropagation()">
      <div class="modal-estudo-header">
        <h3 class="modal-estudo-header-titulo">
          <span>📖</span> Catalogar Questão Errada
        </h3>
        <button type="button" class="modal-estudo-fechar" data-act="fechar-modal-novo-erro">&times;</button>
      </div>
      <form class="modal-estudo-corpo" data-form="novo-erro-caderno">
        <div>
          <label class="label" for="ce-subj">Matéria:</label>
          <select id="ce-subj" style="width:100%;margin-top:4px;">
            <option value="">Sem matéria vinculada</option>
            ${subjOpts}
          </select>
        </div>
        <div>
          <label class="label" for="ce-reason">Causa Raiz do Erro:</label>
          <select id="ce-reason" style="width:100%;margin-top:4px;" required>
            ${Object.entries(MOTIVOS_ERRO_ESTUDO).map(([k, m]) => `
              <option value="${k}" ${k === motivo ? "selected" : ""}>${m.emoji} ${m.label} - ${m.desc || ""}</option>
            `).join("")}
          </select>
        </div>
        <div>
          <label class="label" for="ce-topic">Enunciado / Tópico da Questão:</label>
          <input type="text" id="ce-topic" style="width:100%;margin-top:4px;" required placeholder="Ex.: Integral por Partes - Sinal do termo v*du" value="${esc(topico)}">
        </div>
        <div>
          <label class="label" for="ce-note">💡 Regra de Ouro / Como Nunca Mais Errar:</label>
          <textarea id="ce-note" rows="3" style="width:100%;margin-top:4px;resize:vertical;" placeholder="Ex.: Sempre escrever 'u = ...' e 'dv = ...' de forma explícita antes de aplicar uv - ∫v du para não inverter os sinais."></textarea>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
          <button type="button" class="btn ghost" data-act="fechar-modal-novo-erro">Cancelar</button>
          <button type="submit" class="btn primary" style="font-weight:700;">Salvar no Caderno</button>
        </div>
      </form>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function fecharModalNovoErro() {
  const m = document.getElementById("modal-novo-erro");
  if (m) m.remove();
}

/** Catálogo de Flashcards Pré-Configurados por Disciplina */
const PRESETS_FLASHCARDS_ACADEMICOS = {
  calculo: [
    { front: "Qual é a derivada de f(x) = ln(x)?", back: "f'(x) = 1/x (para x > 0)" },
    { front: "Qual é a Regra da Cadeia para [f(g(x))]'?", back: "[f(g(x))]' = f'(g(x)) · g'(x)" },
    { front: "Qual é a integral indefinida de 1/x dx?", back: "∫(1/x) dx = ln|x| + C (lembrar sempre do módulo!)" },
    { front: "Qual é o Limite Fundamental Trigonométrico lim (x→0) [sen(x)/x]?", back: "O limite é igual a 1." },
    { front: "O que diz o Teorema Fundamental do Cálculo (Parte 1)?", back: "Se f é contínua e g(x) = ∫ₐˣ f(t) dt, então g'(x) = f(x)." }
  ],
  direito: [
    { front: "Quais são os Remédios Constitucionais estritamente gratuitos?", back: "Habeas Corpus (HC) e Habeas Data (HD) são gratuitos a qualquer cidadão (Art. 5º, LXXVII da CF/88)." },
    { front: "Quais são os 5 Princípios Expressos da Administração Pública?", back: "Mnemônico LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (Art. 37 da CF/88)." },
    { front: "Qual a diferença entre Anulação e Revogação do ato administrativo?", back: "Anulação = decorre de Ilegalidade (efeito ex tunc / retroage). Revogação = juízo de Conveniência e Oportunidade (efeito ex nunc / não retroage)." },
    { front: "O que é o Princípio da Anterioridade Tributária Nonagesimal?", back: "A cobrança de tributo só pode ocorrer após decorridos 90 dias da publicação da lei que o instituiu ou aumentou (com as devidas exceções)." }
  ],
  portugues: [
    { front: "Quando ocorre crase facultativa diante de pronomes possessivos?", back: "A crase é FACULTATIVA diante de pronomes possessivos femininos ADJETIVOS que acompanham substantivo (ex: Fui à minha casa / Fui a minha casa)." },
    { front: "Qual a regência correta do verbo 'Aspirar' no sentido de desejar?", back: "É Transitivo Indireto e rege a preposição 'a' (ex: Ele aspira AO cargo público)." },
    { front: "O que é uma Oração Subordinada Substantiva Apositiva?", back: "É aquela que exerce a função sintática de aposto, geralmente introduzida por dois-pontos ou travessão explicando um termo anterior." }
  ],
  programacao: [
    { front: "Qual é a complexidade média e pior caso do QuickSort?", back: "Médio: O(n log n). Pior caso: O(n²) (quando o pivô escolhido é sempre o menor ou maior elemento)." },
    { front: "Qual a diferença fundamental entre BFS e DFS?", back: "BFS (Busca em Largura) utiliza Fila (FIFO) e explora por níveis. DFS (Busca em Profundidade) utiliza Pilha/Recursão (LIFO) e desce até as folhas." },
    { front: "O que caracteriza uma função pura no paradigma funcional?", back: "1. Retorna sempre o mesmo resultado para os mesmos argumentos. 2. Não gera efeitos colaterais externos (side effects)." }
  ]
};

/** Modal para Gerar Flashcards com IA */
function abrirModalGeradorFlashcardsIA() {
  const modalExistente = document.getElementById("modal-gerador-fc-ia");
  if (modalExistente) modalExistente.remove();

  const subjOpts = S.subjects
    .map(s => `<option value="${s.id}">${esc(s.name)}</option>`)
    .join("");

  const modalHtml = `
  <div id="modal-gerador-fc-ia" class="modal-estudo-overlay" data-act="fechar-modal-estudo-fundo">
    <div class="modal-estudo-container" onclick="event.stopPropagation()">
      <div class="modal-estudo-header">
        <h3 class="modal-estudo-header-titulo">
          <span>✨</span> Gerador de Flashcards Acadêmicos
        </h3>
        <button type="button" class="modal-estudo-fechar" data-act="fechar-modal-gerador-fc-ia">&times;</button>
      </div>
      <div class="modal-estudo-corpo">
        <p style="font-size:0.85rem;color:var(--sub);margin:0;">
          Selecione a matéria para importar pacotes cognitivos de alta retenção prontos para o algoritmo SM-2:
        </p>

        <div>
          <label class="label" for="ia-fc-materia">Vincular à Matéria do Prumo:</label>
          <select id="ia-fc-materia" style="width:100%;margin-top:4px;">
            <option value="">Sem matéria específica</option>
            ${subjOpts}
          </select>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
          <button type="button" class="btn" data-act="importar-pacote-flashcard" data-pacote="calculo" style="justify-content:flex-start;text-align:left;padding:12px;">
            📐 <b>Cálculo & Matemática Universitária</b> (5 cards essenciais)
          </button>
          <button type="button" class="btn" data-act="importar-pacote-flashcard" data-pacote="direito" style="justify-content:flex-start;text-align:left;padding:12px;">
            ⚖️ <b>Direito Constitucional & Administrativo</b> (4 cards de concursos)
          </button>
          <button type="button" class="btn" data-act="importar-pacote-flashcard" data-pacote="portugues" style="justify-content:flex-start;text-align:left;padding:12px;">
            📚 <b>Língua Portuguesa & Regência</b> (3 cards de pegadinhas)
          </button>
          <button type="button" class="btn" data-act="importar-pacote-flashcard" data-pacote="programacao" style="justify-content:flex-start;text-align:left;padding:12px;">
            💻 <b>Algoritmos & Estruturas de Dados</b> (3 cards de computação)
          </button>
        </div>

        <div style="display:flex;justify-content:flex-end;margin-top:8px;">
          <button type="button" class="btn ghost" data-act="fechar-modal-gerador-fc-ia">Fechar</button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function fecharModalGeradorFlashcardsIA() {
  const m = document.getElementById("modal-gerador-fc-ia");
  if (m) m.remove();
}

/** Modal de Respiração 4-7-8 Guiada (Anti-Ansiedade e Reativação de Foco) */
let timerRespiracaoId = null;

function abrirModalRespiracao478() {
  const modalExistente = document.getElementById("modal-respiracao-478");
  if (modalExistente) modalExistente.remove();

  if (timerRespiracaoId) {
    clearInterval(timerRespiracaoId);
    timerRespiracaoId = null;
  }

  const modalHtml = `
  <div id="modal-respiracao-478" class="modal-estudo-overlay" data-act="fechar-modal-estudo-fundo">
    <div class="modal-estudo-container" style="max-width:440px;" onclick="event.stopPropagation()">
      <div class="modal-estudo-header">
        <h3 class="modal-estudo-header-titulo">
          <span>🧘</span> Respiração Guiada 4-7-8
        </h3>
        <button type="button" class="modal-estudo-fechar" data-act="fechar-modal-respiracao">&times;</button>
      </div>
      <div class="modal-estudo-corpo">
        <div class="respiracao-box">
          <div class="respiracao-instrucao">
            Técnica para desacelerar batimentos cardíacos, reduzir cortisol e restabelecer clareza mental e foco.
          </div>
          <div class="respiracao-circulo-container">
            <div id="respiracao-circulo" class="respiracao-circulo">4</div>
          </div>
          <div id="respiracao-fase" class="respiracao-fase-rotulo">Prepare-se...</div>
          <div id="respiracao-ciclo" style="font-size:0.8rem;color:var(--sub);margin-top:6px;">Ciclo 1 de 3</div>
        </div>
        <div style="display:flex;justify-content:center;margin-top:8px;">
          <button type="button" class="btn primary small" data-act="fechar-modal-respiracao" style="font-weight:700;">Concluir e Voltar</button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  iniciarCiclosRespiracao();
}

function fecharModalRespiracao478() {
  if (timerRespiracaoId) {
    clearInterval(timerRespiracaoId);
    timerRespiracaoId = null;
  }
  const m = document.getElementById("modal-respiracao-478");
  if (m) m.remove();
}

function iniciarCiclosRespiracao() {
  const circulo = document.getElementById("respiracao-circulo");
  const faseEl = document.getElementById("respiracao-fase");
  const cicloEl = document.getElementById("respiracao-ciclo");
  if (!circulo || !faseEl) return;

  let cicloAtual = 1;
  const maxCiclos = 3;

  function executarFase() {
    if (!document.getElementById("modal-respiracao-478")) return;

    // Fase 1: Inspirar (4s)
    circulo.className = "respiracao-circulo inspirar";
    faseEl.textContent = "Inspire pelo nariz (4s)...";
    let contagem = 4;
    circulo.textContent = contagem;

    const tInspirar = setInterval(() => {
      contagem--;
      if (contagem >= 1) circulo.textContent = contagem;
      if (contagem <= 0) {
        clearInterval(tInspirar);
        if (!document.getElementById("modal-respiracao-478")) return;

        // Fase 2: Segurar (7s)
        circulo.className = "respiracao-circulo segurar";
        faseEl.textContent = "Segure o ar nos pulmões (7s)...";
        contagem = 7;
        circulo.textContent = contagem;

        const tSegurar = setInterval(() => {
          contagem--;
          if (contagem >= 1) circulo.textContent = contagem;
          if (contagem <= 0) {
            clearInterval(tSegurar);
            if (!document.getElementById("modal-respiracao-478")) return;

            // Fase 3: Expirar (8s)
            circulo.className = "respiracao-circulo expirar";
            faseEl.textContent = "Expire suavemente pela boca (8s)...";
            contagem = 8;
            circulo.textContent = contagem;

            const tExpirar = setInterval(() => {
              contagem--;
              if (contagem >= 1) circulo.textContent = contagem;
              if (contagem <= 0) {
                clearInterval(tExpirar);
                if (!document.getElementById("modal-respiracao-478")) return;

                cicloAtual++;
                if (cicloAtual <= maxCiclos) {
                  if (cicloEl) cicloEl.textContent = `Ciclo ${cicloAtual} de ${maxCiclos}`;
                  executarFase();
                } else {
                  faseEl.textContent = "✨ Mente equilibrada e desperta!";
                  circulo.textContent = "✓";
                  circulo.className = "respiracao-circulo inspirar";
                  S.xp = (S.xp || 0) + 15;
                  commit();
                  toast("Respiração concluída! +15 XP para seu foco mental.", false, "happy");
                }
              }
            }, 1000);
          }
        }, 1000);
      }
    }, 1000);
  }

  executarFase();
}

/* ==========================================================================
   REGISTRO DE AÇÕES (ACOES_EXTRAS)
   ========================================================================== */
ACOES_EXTRAS["questao-mais-acerto"] = () => {
  const qs = garantirQuestionStats();
  qs.done++;
  qs.correct++;
  S.stats.tasks = (S.stats.tasks || 0) + 1;
  toast(`+1 Acerto! (${qs.correct}/${qs.done} hoje)`, false, "happy");

  if (qs.done === qs.goal) {
    S.xp = (S.xp || 0) + 30;
    S.coins = (S.coins || 0) + 15;
    react("party", `Meta de <b>${qs.goal} questões</b> batida hoje! +30 XP e +15 Gotas para você!`, 3600);
  }
  commit();
  render();
};

ACOES_EXTRAS["questao-mais-erro"] = () => {
  const qs = garantirQuestionStats();
  qs.done++;
  commit();
  toast(`Questão catalogada como erro. Vamos isolar a causa raiz!`, false, "focus");
  abrirModalNovoErro(timer.subjectId || "", "", "atencao");
};

ACOES_EXTRAS["questao-ajustar-meta"] = () => {
  const qs = garantirQuestionStats();
  const metas = [15, 30, 50, 100];
  const idx = metas.indexOf(qs.goal);
  qs.goal = metas[(idx + 1) % metas.length];
  commit();
  toast(`Meta de questões ajustada para ${qs.goal} questões/dia`);
  render();
};

ACOES_EXTRAS["questao-zerar-hoje"] = () => {
  const qs = garantirQuestionStats();
  qs.done = 0;
  qs.correct = 0;
  commit();
  toast("Contagem diária de questões reiniciada.");
  render();
};

ACOES_EXTRAS["abrir-modal-novo-erro"] = () => {
  abrirModalNovoErro(timer.subjectId || "", "", "teoria");
};

ACOES_EXTRAS["fechar-modal-novo-erro"] = () => {
  fecharModalNovoErro();
};

ACOES_EXTRAS["alternar-erro-superado"] = (btn, id) => {
  const erros = garantirCadernoErros();
  const item = erros.find(e => e.id === id);
  if (!item) return;
  item.resolved = !item.resolved;
  if (item.resolved) {
    toast("Parabéns! Erro marcado como Superado/Dominado!", false, "happy");
    S.xp = (S.xp || 0) + 15;
  }
  commit();
  render();
};

ACOES_EXTRAS["criar-flashcard-do-erro"] = (btn, id) => {
  const erros = garantirCadernoErros();
  const e = erros.find(x => x.id === id);
  if (!e) return;
  const frente = `Como evitar o erro em: ${e.topic}?`;
  const verso = e.note ? `${e.note}` : `Atenção aos conceitos e causas de pegadinha do tópico: ${e.topic}`;
  abrirModalNovoFlashcard(e.subjectId || "", frente, verso);
};

ACOES_EXTRAS["abrir-respiracao-478"] = () => {
  abrirModalRespiracao478();
};

ACOES_EXTRAS["fechar-modal-respiracao"] = () => {
  fecharModalRespiracao478();
};

ACOES_EXTRAS["excluir-erro-caderno"] = (btn, id) => {
  S.errorLog = (S.errorLog || []).filter(e => e.id !== id);
  commit();
  toast("Registro de erro removido.");
  render();
};

ACOES_EXTRAS["filtro-caderno-erros"] = btn => {
  const filtro = btn.dataset.filtro;
  if (filtro) {
    filtroCadernoAtivo = filtro;
    render();
  }
};

ACOES_EXTRAS["abrir-modal-novo-flashcard"] = () => {
  abrirModalNovoFlashcard(timer.subjectId || "", "", "");
};

ACOES_EXTRAS["fechar-modal-novo-flashcard"] = () => {
  fecharModalNovoFlashcard();
};

ACOES_EXTRAS["iniciar-revisao-flashcards"] = () => {
  abrirModalRevisaoFlashcards();
};

ACOES_EXTRAS["fechar-modal-revisao-flashcards"] = () => {
  fecharModalRevisaoFlashcards();
};

ACOES_EXTRAS["fechar-modal-estudo-fundo"] = (btn, id, e) => {
  if (e && e.target && e.target.classList.contains("modal-estudo-overlay")) {
    e.target.remove();
    estadoSessaoFlashcard = null;
    render();
  }
};

ACOES_EXTRAS["mostrar-resposta-flashcard"] = () => {
  if (!estadoSessaoFlashcard) return;
  estadoSessaoFlashcard.virado = true;
  const corpo = document.getElementById("flashcard-sessao-corpo");
  if (corpo) corpo.innerHTML = renderCardSessaoHTML();
};

ACOES_EXTRAS["avaliar-flashcard"] = btn => {
  if (!estadoSessaoFlashcard) return;
  const { deck, idx } = estadoSessaoFlashcard;
  const cardOriginal = deck[idx];
  const rating = parseInt(btn.dataset.rating, 10) || 3;

  if (cardOriginal) {
    const atualizado = calcularSM2SuperMemo(cardOriginal, rating);
    cardOriginal.repetitions = atualizado.repetitions;
    cardOriginal.interval = atualizado.interval;
    cardOriginal.easeFactor = atualizado.easeFactor;
    cardOriginal.due = atualizado.due;

    // Atualiza também no S.flashcards principal
    const noEstado = S.flashcards.find(c => c.id === cardOriginal.id);
    if (noEstado) {
      Object.assign(noEstado, atualizado);
    }
  }

  estadoSessaoFlashcard.respondidos++;
  if (rating >= 3) estadoSessaoFlashcard.acertos++;

  estadoSessaoFlashcard.idx++;
  estadoSessaoFlashcard.virado = false;

  commit();
  const corpo = document.getElementById("flashcard-sessao-corpo");
  if (corpo) corpo.innerHTML = renderCardSessaoHTML();
};

ACOES_EXTRAS["excluir-flashcard"] = (btn, id) => {
  S.flashcards = (S.flashcards || []).filter(c => c.id !== id);
  commit();
  toast("Flashcard apagado.");
  render();
};

ACOES_EXTRAS["gerar-flashcards-ia"] = () => {
  abrirModalGeradorFlashcardsIA();
};

ACOES_EXTRAS["fechar-modal-gerador-fc-ia"] = () => {
  fecharModalGeradorFlashcardsIA();
};

ACOES_EXTRAS["importar-pacote-flashcard"] = btn => {
  const pct = btn.dataset.pacote;
  const lista = PRESETS_FLASHCARDS_ACADEMICOS[pct];
  if (!lista || !lista.length) return;

  const selMateriaEl = document.getElementById("ia-fc-materia");
  const subjId = selMateriaEl ? selMateriaEl.value : "";
  const fcs = garantirFlashcards();

  for (const item of lista) {
    fcs.push({
      id: newId(),
      subjectId: subjId,
      front: item.front,
      back: item.back,
      repetitions: 0,
      interval: 1,
      easeFactor: 2.5,
      due: today(),
      created: today()
    });
  }

  commit();
  fecharModalGeradorFlashcardsIA();
  toast(`+${lista.length} Flashcards importados com sucesso!`, false, "happy");
  render();
};

/* ==========================================================================
   REGISTRO DE FORMULÁRIOS (FORMS_EXTRAS)
   ========================================================================== */
FORMS_EXTRAS["novo-flashcard"] = () => {
  const sid = getV("fc-subj");
  const front = getV("fc-front");
  const back = getV("fc-back");
  if (!front || !back) return;

  const fcs = garantirFlashcards();
  fcs.push({
    id: newId(),
    subjectId: sid,
    front,
    back,
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    due: today(),
    created: today()
  });

  commit();
  fecharModalNovoFlashcard();
  toast("Flashcard cadastrado para repetição espaçada!");
  render();
};

FORMS_EXTRAS["novo-erro-caderno"] = () => {
  const sid = getV("ce-subj");
  const reason = getV("ce-reason") || "teoria";
  const topic = getV("ce-topic");
  const note = getV("ce-note");
  if (!topic) return;

  const erros = garantirCadernoErros();
  erros.unshift({
    id: newId(),
    date: today(),
    subjectId: sid,
    reason,
    topic,
    note,
    resolved: false
  });

  commit();
  fecharModalNovoErro();
  toast("Questão catalogada no seu Caderno de Erros!", false, "focus");
  render();
};

/* ==========================================================================
   ATALHOS DE TECLADO PARA FLASHCARDS
   ========================================================================== */
document.addEventListener("keydown", e => {
  if (!estadoSessaoFlashcard) return;
  const modal = document.getElementById("modal-revisao-flashcards");
  if (!modal) return;

  if (e.key === "Escape") {
    fecharModalRevisaoFlashcards();
    return;
  }

  // Tecla Espaço ou Enter: virar o card
  if ((e.code === "Space" || e.key === "Enter") && !estadoSessaoFlashcard.virado) {
    e.preventDefault();
    ACOES_EXTRAS["mostrar-resposta-flashcard"]();
    return;
  }

  // Teclas 1, 2, 3, 4: avaliar card após virado
  if (estadoSessaoFlashcard.virado && ["1", "2", "3", "4"].includes(e.key)) {
    e.preventDefault();
    const btn = modal.querySelector(`[data-act="avaliar-flashcard"][data-rating="${e.key}"]`);
    if (btn) btn.click();
  }
});
