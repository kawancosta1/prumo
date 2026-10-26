/*
  Mundo Bruxo - Melhorias e Rotina Mágica (Itens 1 a 60)
  Bruxaria na rotina: receitas, fases da lua reais, horta que cresce, coven e conselhos do gato.
*/
"use strict";

/* =========================================================
   BRUXO: LOTE 1 (ITENS 1 A 10)
   ========================================================= */

// 1. Livro de receitas: 20 poções para descobrir
const POCOES_BRUXO_20 = [
  {
    id: "pocao_coragem",
    nome: "Poção da Coragem",
    desc: "Dá vontade de encarar a tarefa mais difícil.",
    cor: "#FF7043",
    ings: [0, 1]
  },
  {
    id: "pocao_sono",
    nome: "Elixir do Sono Bom",
    desc: "Garante descanso profundo sob as estrelas.",
    cor: "#9575CD",
    ings: [1, 2]
  },
  {
    id: "pocao_foco",
    nome: "Xarope do Foco",
    desc: "Bloqueia distrações e celular por 25 minutos.",
    cor: "#4FC3F7",
    ings: [2, 3]
  },
  {
    id: "pocao_gentileza",
    nome: "Chá da Gentileza",
    desc: "Incentiva a mandar mensagem carinhosa.",
    cor: "#F48FB1",
    ings: [3, 4]
  },
  {
    id: "pocao_sorte",
    nome: "Gosma da Sorte",
    desc: "Aumenta chances de surpresas alegres.",
    cor: "#9CCC65",
    ings: [4, 5]
  },
  {
    id: "pocao_agua",
    nome: "Tônico da Hidratação",
    desc: "Lembra seu corpo do próximo copo d'água.",
    cor: "#80DEEA",
    ings: [5, 6]
  },
  {
    id: "pocao_calma",
    nome: "Poção da Calma",
    desc: "Três respirações bem lentas e paz mental.",
    cor: "#AED581",
    ings: [6, 7]
  },
  {
    id: "pocao_ideias",
    nome: "Néctar da Criatividade",
    desc: "Desperta lampejos de inspiração súbita.",
    cor: "#FFD54F",
    ings: [7, 8]
  },
  {
    id: "pocao_voo",
    nome: "Essência de Voo",
    desc: "Faz o dia passar leve como uma brisa.",
    cor: "#CE93D8",
    ings: [8, 9]
  },
  {
    id: "pocao_visao",
    nome: "Tinta da Clarividência",
    desc: "Ajuda a enxergar as prioridades com nitidez.",
    cor: "#7E57C2",
    ings: [0, 2]
  },
  {
    id: "pocao_riso",
    nome: "Orvalho da Gargalhada",
    desc: "Transforma qualquer estresse em bom humor.",
    cor: "#FFB74D",
    ings: [1, 3]
  },
  {
    id: "pocao_lua",
    nome: "Lágrima de Lua Cheia",
    desc: "Potencializa a energia de todas as tarefas.",
    cor: "#FFF59D",
    ings: [2, 4]
  },
  {
    id: "pocao_musgo",
    nome: "Unguento do Enraizamento",
    desc: "Acalma a ansiedade e firma os pés no chão.",
    cor: "#558B2F",
    ings: [3, 5]
  },
  {
    id: "pocao_ventos",
    nome: "Bruma dos Ventos",
    desc: "Limpa a névoa das tarefas acumuladas.",
    cor: "#B2DFDB",
    ings: [4, 6]
  },
  {
    id: "pocao_aurora",
    nome: "Orvalho da Alvorada",
    desc: "Dá disposição para pular da cama cedinho.",
    cor: "#FF8A65",
    ings: [5, 7]
  },
  {
    id: "pocao_memoria",
    nome: "Chá da Memória Antiga",
    desc: "Excelente para fixar estudos e leituras.",
    cor: "#8D6E63",
    ings: [6, 8]
  },
  {
    id: "pocao_vigor",
    nome: "Xarope do Vigor Físico",
    desc: "Ideal para exercícios e caminhadas no bosque.",
    cor: "#D84315",
    ings: [7, 9]
  },
  {
    id: "pocao_amizade",
    nome: "Bálsamo da União",
    desc: "Aquece as relações com amigos do coven.",
    cor: "#EC407A",
    ings: [0, 3]
  },
  {
    id: "pocao_segredo",
    nome: "Néctar do Silêncio",
    desc: "Garante recolhimento e paz interior.",
    cor: "#37474F",
    ings: [1, 4]
  },
  {
    id: "pocao_suprema",
    nome: "Magnum Opus da Bruxa",
    desc: "A poção definitiva que coroa um dia lendário.",
    cor: "#76FF03",
    ings: [0, 9]
  }
];

function descobrirPocao(ing1Idx, ing2Idx) {
  const d = dadosBruxo();
  if (!Array.isArray(d.descobertas)) d.descobertas = [];
  const achada =
    POCOES_BRUXO_20.find(
      p =>
        (p.ings[0] === ing1Idx && p.ings[1] === ing2Idx) || (p.ings[0] === ing2Idx && p.ings[1] === ing1Idx)
    ) || POCOES_BRUXO_20[d.descobertas.length % POCOES_BRUXO_20.length];

  if (!d.descobertas.includes(achada.id)) {
    d.descobertas.push(achada.id);
    commit();
    if (typeof notificar === "function") {
      notificar({
        titulo: "Nova Poção Descoberta! 🧪",
        texto: `${achada.nome}: ${achada.desc}`,
        tipo: "conquista",
        mood: "party"
      });
    }
  }
  return achada;
}

function livroDeReceitasHTML() {
  const d = dadosBruxo();
  const desc = d.descobertas || [];
  return `<div class="card sub" style="margin-top:6px">
    <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px">
      <b>📖 Livro de Receitas da Cabana</b>
      <span class="mono">${desc.length} / 20 descobertas</span>
    </div>
    <div class="row" style="gap:6px;flex-wrap:wrap">
      ${POCOES_BRUXO_20.slice(0, 10)
        .map(p => {
          const tem = desc.includes(p.id);
          return `<div class="card sub ${tem ? "" : "sunken"}" style="padding:4px 8px;font-size:11px;opacity:${tem ? "1" : "0.5"}">
          <span style="color:${p.cor}">🧪</span> <b>${esc(p.nome)}</b>
        </div>`;
        })
        .join("")}
    </div>
  </div>`;
}

// 2. Fases da lua reais e bônus de lua cheia
function faseLuaBruxo(dataStr = today()) {
  const ref = new Date("2026-01-18T00:00:00Z");
  const agora = new Date(dataStr + "T12:00:00Z");
  const diffDias = (agora - ref) / (1000 * 60 * 60 * 24);
  const ciclo = 29.53058867;
  const fase = ((diffDias % ciclo) + ciclo) % ciclo;

  if (fase < 1.84)
    return { nome: "Lua Nova", icone: "🌑", bonus: "Ideal para plantar novos rituais e hábitos." };
  if (fase < 7.38)
    return { nome: "Lua Crescente", icone: "🌒", bonus: "Energia crescente: +10% de gotas nas tarefas." };
  if (fase < 9.23)
    return { nome: "Quarto Crescente", icone: "🌓", bonus: "Foco elevado para superar pendências." };
  if (fase < 14.77)
    return { nome: "Crescente Gibosa", icone: "🌔", bonus: "Caldeirão esquentando para o ápice lunar." };
  if (fase < 16.61)
    return {
      nome: "Lua Cheia",
      icone: "🌕",
      bonus: "Lua Cheia ativa! Poções rendem gotas em dobro (+20).",
      dobro: true
    };
  if (fase < 22.15)
    return {
      nome: "Minguante Gibosa",
      icone: "🌖",
      bonus: "Momento propício para organizar e limpar a cabana."
    };
  if (fase < 23.99)
    return { nome: "Quarto Minguante", icone: "🌗", bonus: "Descarte de hábitos improdutivos facilitado." };
  return { nome: "Lua Minguante", icone: "🌘", bonus: "Silêncio noturno para colheitas tranquilas." };
}

// 3. Horta que cresce (hábitos viram plantas que crescem em 7 dias)
function hortaCrescePlantas() {
  const d = dadosBruxo();
  if (!d.hortaPlantas || typeof d.hortaPlantas !== "object") d.hortaPlantas = {};
  if (typeof S === "undefined" || !Array.isArray(S.habits)) return [];

  return S.habits.map((h, i) => {
    let p = d.hortaPlantas[h.id];
    if (!p) {
      p = { dias: 1, colhida: false, inicio: today() };
      d.hortaPlantas[h.id] = p;
    }
    const feitoHoje = typeof habitDone === "function" && habitDone(h, today());
    if (feitoHoje && p.ultimoDiaFeito !== today()) {
      p.ultimoDiaFeito = today();
      p.dias = Math.min(7, (p.dias || 0) + 1);
      commit();
    }
    const nomeErva = ERVAS[i % ERVAS.length];
    return {
      habitoId: h.id,
      nomeHabito: h.name,
      erva: nomeErva,
      dias: p.dias || 1,
      prontaParaColher: p.dias >= 7 && !p.colhida
    };
  });
}

function colherPlantaHorta(habitoId) {
  const d = dadosBruxo();
  if (!d.hortaPlantas) d.hortaPlantas = {};
  const p = d.hortaPlantas[habitoId];
  if (!p || p.dias < 7) return false;
  p.dias = 0;
  p.colhida = true;
  if (!Array.isArray(d.estoqueErvas)) d.estoqueErvas = [];
  d.estoqueErvas.push({ data: today(), habitoId });
  if (typeof S !== "undefined") {
    S.coins = (S.coins || 0) + 15;
  }
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Erva Mística Colhida! 🌿",
      texto: "Plantação de 7 dias maturada com sucesso (+15 gotas).",
      tipo: "conquista",
      mood: "happy"
    });
  }
  return true;
}

ACOES_EXTRAS["bruxo-colher-erva"] = (b, id) => {
  colherPlantaHorta(id);
  render();
};

// 4. Feitiço de proteção (3 tarefas antes das 12h)
function protecaoSequenciaBruxo() {
  const d = dadosBruxo();
  return d.protecaoSequencia === today();
}

function conferirProtecaoManha(forcarHora) {
  const h = typeof forcarHora === "number" ? forcarHora : new Date().getHours();
  if (h >= 12) return;
  const feitas =
    (typeof S !== "undefined" &&
      Array.isArray(S.tasks) &&
      S.tasks.filter(t => t.done && t.date === today()).length) ||
    0;
  if (feitas >= 3) {
    const d = dadosBruxo();
    if (d.protecaoSequencia !== today()) {
      d.protecaoSequencia = today();
      commit();
      if (typeof notificar === "function") {
        notificar({
          titulo: "Feitiço de Proteção Ativado! 🛡️",
          texto: "3 tarefas matinais concluídas. Sua sequência está protegida por 24h.",
          tipo: "sucesso",
          mood: "party"
        });
      }
    }
  }
}

// 5. Maldição da procrastinação (tarefa atrasada há 3 dias vira sapo com 2 cliques)
function conferirMaldicaoProcrastinacao() {
  if (typeof S === "undefined" || !Array.isArray(S.tasks)) return [];
  const atrasadas3Dias = S.tasks.filter(
    t => !t.done && typeof diffDays === "function" && diffDays(t.date, today()) >= 3
  );
  atrasadas3Dias.forEach(t => {
    if (typeof t.sapo !== "number") t.sapo = 2;
  });
  return atrasadas3Dias;
}

function desencantarSapoTarefa(tarefaId) {
  const t = typeof S !== "undefined" && Array.isArray(S.tasks) && S.tasks.find(x => x.id === tarefaId);
  if (!t || typeof t.sapo !== "number") return false;
  t.sapo -= 1;
  if (t.sapo <= 0) {
    delete t.sapo;
    commit();
    if (typeof notificar === "function") {
      notificar({
        titulo: "Sapo Desencantado! ✨🐸",
        texto: "A maldição se desfez com um estalo mágico. Agora termine a tarefa!",
        tipo: "sucesso",
        mood: "happy"
      });
    }
  } else {
    commit();
  }
  return true;
}

ACOES_EXTRAS["bruxo-desencantar-sapo"] = (b, id) => {
  desencantarSapoTarefa(id);
  render();
};

// 6. Coven: caldeirão coletivo da semana com amigos
function covenSemanalHTML() {
  const feitasHoje =
    (typeof S !== "undefined" && Array.isArray(S.tasks) && S.tasks.filter(t => t.done).length) || 0;
  const totalCoven = feitasHoje + 18; // Soma cooperativa simulada
  const metaCoven = 30;
  const pct = Math.min(100, Math.round((totalCoven / metaCoven) * 100));
  return `<div class="card sub" style="margin-top:6px">
    <div class="row" style="justify-content:space-between;align-items:center">
      <b>🔮 Coven da Floresta</b>
      <span class="mono">${totalCoven} / ${metaCoven} tarefas</span>
    </div>
    <div style="background:#263238;height:8px;border-radius:4px;overflow:hidden;margin:6px 0">
      <div style="background:#76FF03;width:${pct}%;height:100%"></div>
    </div>
    <span class="note">Amigos mexem o caldeirão semanal juntos. Complete a meta para colher orvalho raro!</span>
  </div>`;
}

// 7. Voo de vassoura animado a cada 5 tarefas
function animarVooVassoura() {
  if (RM) return;
  const v = document.createElement("div");
  v.className = "bruxo-vassoura-voo";
  v.innerHTML = `<svg viewBox="0 0 64 32" width="64" height="32">
    <path d="M4 28L48 6" stroke="#5D4037" stroke-width="4" stroke-linecap="round"/>
    <path d="M44 6L60 2L54 14Z" fill="#FBC02D"/>
    <circle cx="28" cy="14" r="5" fill="#4E342E"/>
  </svg>`;
  document.body.appendChild(v);
  setTimeout(() => v.remove(), 2600);
}

// 8. Gato conselheiro
const CONSELHOS_GATO = [
  "Miau... faz a tarefa mais curtinha primeiro pra esquentar o caldeirão.",
  "Beba um gole de água fresca antes de lançar outro encantamento.",
  "Cuidado com essa tarefa antiga... ouço o coaxar de um sapo se aproximando.",
  "Um gato nunca tem pressa: respire fundo e termine uma coisa por vez.",
  "As folhas de alecrim dizem que hoje é dia de riscar tudo do pergaminho."
];

function conselhoGatoBruxo() {
  const idx = Math.floor(Math.random() * CONSELHOS_GATO.length);
  return CONSELHOS_GATO[idx];
}

// 9. Sabá de sexta (resumo da semana vira festa na fogueira)
function sabaDeSextaHTML() {
  const ehSexta = new Date().getDay() === 5;
  if (!ehSexta) return "";
  return `<div class="bruxo-saba-fogueira" style="margin-top:8px;text-align:center">
    <div style="font-size:20px;margin-bottom:4px">🔥 <b>Sabá de Sexta na Clareira</b> 🔥</div>
    <p class="note" style="margin:4px 0">Reúna o coven ao redor das chamas sagradas para celebrar as vitórias da semana!</p>
    <button class="btn small primary" data-act="bruxo-celebrar-saba">Dançar ao Redor do Fogo (+5 gotas)</button>
  </div>`;
}

ACOES_EXTRAS["bruxo-celebrar-saba"] = () => {
  const d = dadosBruxo();
  if (d.sabaCelebrado !== today()) {
    d.sabaCelebrado = today();
    if (typeof S !== "undefined") S.coins = (S.coins || 0) + 5;
    commit();
    if (typeof notificar === "function") {
      notificar({
        titulo: "Sabá Celebrado! 🔥✨",
        texto: "Você dançou ao redor da fogueira com os espíritos da floresta.",
        tipo: "conquista",
        mood: "party"
      });
    }
    render();
  }
};

// 10. Grimório de ervas: fichas e efeitos
const FICHAS_ERVAS = [
  { nome: "Alecrim", efeito: "Clareza mental e memória para os rituais.", icone: "🌿" },
  { nome: "Lavanda", efeito: "Paz profunda e proteção contra pesadelos.", icone: "🪻" },
  { nome: "Hortelã", efeito: "Frescor revigorante e coragem de ação.", icone: "🌱" },
  { nome: "Camomila", efeito: "Suavidade no caldeirão e paciência.", icone: "🌼" },
  { nome: "Sálvia", efeito: "Purificação de energias densas da cabana.", icone: "🌾" },
  { nome: "Manjericão", efeito: "Atrai gotas douradas e prosperidade.", icone: "🍀" },
  { nome: "Arruda", efeito: "Escudo inabalável contra o mau-olhado.", icone: "🪴" }
];

function grimorioErvasHTML() {
  return `<div class="card sub" style="margin-top:6px">
    <b>🌿 Grimório das Ervas da Cabana</b>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px">
      ${FICHAS_ERVAS.map(
        e => `
        <div class="card sub sunken" style="flex:1;min-width:110px;padding:6px;font-size:11px">
          <b>${e.icone} ${esc(e.nome)}</b><br>
          <span class="note">${esc(e.effect || e.efeito)}</span>
        </div>
      `
      ).join("")}
    </div>
  </div>`;
}

/* Conexão com eventos do Bruxo */
if (typeof MUNDO_FX !== "undefined" && MUNDO_FX.bruxo) {
  const antigoAoConcluirBruxo = MUNDO_FX.bruxo.aoConcluir;
  MUNDO_FX.bruxo.aoConcluir = (tarefa, b) => {
    if (typeof antigoAoConcluirBruxo === "function") antigoAoConcluirBruxo(tarefa, b);
    conferirProtecaoManha();
    const feitas =
      (typeof S !== "undefined" &&
        Array.isArray(S.tasks) &&
        S.tasks.filter(t => t.done && t.date === today()).length) ||
      0;
    if (feitas > 0 && feitas % 5 === 0) {
      animarVooVassoura();
    }
  };

  const antigaSecaoHojeBruxo = MUNDO_FX.bruxo.secaoHoje;
  MUNDO_FX.bruxo.secaoHoje = () => {
    let html = "";
    if (typeof antigaSecaoHojeBruxo === "function") {
      html += antigaSecaoHojeBruxo();
    }
    const lua = faseLuaBruxo();
    const conselho = conselhoGatoBruxo();

    html += cartaoMundo(
      "cm-bruxo-lua-gato",
      `Fase Lunar: ${lua.nome} ${lua.icone}`,
      lua.bonus,
      `<div class="card sub sunken" style="padding:8px;margin-bottom:6px">
        <b>🐈‍⬛ O Gato Preto Murmura:</b><br>
        <span style="font-size:12px;font-style:italic">"${esc(conselho)}"</span>
      </div>
      ${sabaDeSextaHTML()}
      ${livroDeReceitasHTML()}
      ${covenSemanalHTML()}
      ${grimorioErvasHTML()}`
    );
    return html;
  };
}
