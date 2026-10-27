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

  if (typeof document !== "undefined") {
    const el =
      document.querySelector(`[data-tarefa-id="${tarefaId}"] .bruxo-sapo-badge`) ||
      document.querySelector(".bruxo-sapo-badge");
    if (el) {
      el.classList.add("bruxo-sapo-pula-some");
    }
  }

  if (typeof pegarAudio === "function") {
    try {
      const ctx = pegarAudio();
      if (ctx) somCoaxarSapo(ctx, ctx.destination, ctx.currentTime);
    } catch (_) {}
  }

  const d = dadosBruxo();
  d.saposDesencantados = (d.saposDesencantados || 0) + 1;

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

// 7 e 28. Voo de vassoura animado com pet a cada 5 tarefas
function animarVooVassoura() {
  if (RM) return;
  if (typeof pegarAudio === "function") {
    try {
      const ctx = pegarAudio();
      if (ctx) somVassouraVoo(ctx, ctx.destination, ctx.currentTime);
    } catch (_) {}
  }
  const v = document.createElement("div");
  v.className = "bruxo-vassoura-voo";
  v.innerHTML = `<svg viewBox="0 0 64 32" width="64" height="32">
    <path d="M4 28L48 6" stroke="#5D4037" stroke-width="4" stroke-linecap="round"/>
    <path d="M44 6L60 2L54 14Z" fill="#FBC02D"/>
    <circle cx="28" cy="14" r="5" fill="#4E342E"/>
    <g class="bruxo-pet-vassoura" transform="translate(16 16) scale(0.65)">
      <ellipse rx="6" ry="5" fill="#212121"/>
      <circle cx="4" cy="-2" r="3.5" fill="#212121"/>
      <polygon points="2,-5 4,-9 6,-5" fill="#212121"/>
      <circle cx="5" cy="-2" r="0.8" fill="#C6FF00"/>
    </g>
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
  if (typeof pegarAudio === "function") {
    try {
      const ctx = pegarAudio();
      if (ctx) somMiadoGato(ctx, ctx.destination, ctx.currentTime);
    } catch (_) {}
  }
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

// 11. Fumaça verde subindo ao preparar poção
function animarFumacaPocao() {
  if (typeof document === "undefined" || RM) return;
  const c = document.createElement("div");
  c.className = "bruxo-fumaca-container";
  for (let i = 0; i < 6; i++) {
    const puff = document.createElement("div");
    puff.className = "bruxo-fumaca-puff";
    const sz = 60 + Math.random() * 80;
    puff.style.width = sz + "px";
    puff.style.height = sz + "px";
    puff.style.left = `calc(50% - ${sz / 2}px + ${(Math.random() - 0.5) * 120}px)`;
    puff.style.bottom = `${20 + Math.random() * 60}px`;
    puff.style.setProperty("--dx", `${(Math.random() - 0.5) * 80}px`);
    puff.style.animationDelay = `${(i * 0.15).toFixed(2)}s`;
    c.appendChild(puff);
  }
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 2200);
}

const prepararOriginalBruxo = ACOES_EXTRAS["bru-preparar"];
ACOES_EXTRAS["bru-preparar"] = b => {
  animarFumacaPocao();
  if (typeof prepararOriginalBruxo === "function") prepararOriginalBruxo(b);
};

// 12. Tarefa concluída evapora em bolhas
function animarEvaporacaoBolhas(el) {
  if (typeof document === "undefined" || RM) return;
  let x = (typeof window !== "undefined" ? window.innerWidth : 400) / 2;
  let y = (typeof window !== "undefined" ? window.innerHeight : 600) / 2;
  if (el && typeof el.getBoundingClientRect === "function") {
    const r = el.getBoundingClientRect();
    if (r.width > 0 || r.height > 0) {
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
  }
  for (let i = 0; i < 6; i++) {
    const b = document.createElement("div");
    b.className = "bruxo-bolha-evapora";
    const sz = 10 + Math.random() * 14;
    b.style.width = sz + "px";
    b.style.height = sz + "px";
    b.style.left = `${x + (Math.random() - 0.5) * 60}px`;
    b.style.top = `${y + (Math.random() - 0.5) * 20}px`;
    b.style.animationDelay = `${(i * 0.08).toFixed(2)}s`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1000);
  }
}

// 14. Velas que acendem uma a uma conforme as tarefas do dia
function velasBruxoHTML(feitas) {
  const total =
    typeof feitas === "number"
      ? feitas
      : (typeof S !== "undefined" &&
          Array.isArray(S.tasks) &&
          S.tasks.filter(t => t.done && t.date === today()).length) ||
        0;
  let html = '<div class="bruxo-velas-altar" title="Velas sagradas acesas pelo trabalho do dia">';
  for (let i = 0; i < 5; i++) {
    const acesa = total >= i + 1;
    html += `<div class="bruxo-vela ${acesa ? "acesa" : "apagada"}">
      <div class="bruxo-pavio"></div>
      ${acesa ? '<div class="bruxo-chama"></div>' : ""}
    </div>`;
  }
  html += "</div>";
  return html;
}

// 15. Abóboras com rostinho que mudam com o humor no tema Abóboras
function aboboraHumorHTML(humor) {
  const h = humor || (typeof S !== "undefined" ? S.mood : "happy");
  let boca = "M6 14 Q10 18 14 14";
  let olhos =
    '<polygon points="5,8 7,5 9,8" fill="#1b120c"/><polygon points="11,8 13,5 15,8" fill="#1b120c"/>';
  if (h === "radiant") {
    olhos = '<circle cx="7" cy="7" r="2.2" fill="#fff"/><circle cx="13" cy="7" r="2.2" fill="#fff"/>';
    boca = "M5 13 Q10 20 15 13 Z";
  } else if (h === "upset") {
    olhos =
      '<line x1="5" y1="6" x2="8" y2="8" stroke="#1b120c" stroke-width="1.8"/><line x1="15" y1="6" x2="12" y2="8" stroke="#1b120c" stroke-width="1.8"/>';
    boca = "M6 16 L8 14 L10 16 L12 14 L14 16";
  } else if (h === "sad" || h === "cry") {
    olhos = '<circle cx="7" cy="8" r="1.5" fill="#1b120c"/><circle cx="13" cy="8" r="1.5" fill="#1b120c"/>';
    boca = "M6 17 Q10 12 14 17";
  }
  return `<svg class="bruxo-abobora-humor" viewBox="0 0 20 20" width="20" height="20" aria-label="Abóbora ${h}">
    <path d="M10 2 C9 1 11 0 10 3" stroke="#2e7d32" stroke-width="2" fill="none"/>
    <ellipse cx="10" cy="11" rx="8" ry="7" fill="#fb8c00"/>
    <ellipse cx="10" cy="11" rx="5" ry="7" fill="#f57c00"/>
    ${olhos}
    <path d="${boca}" stroke="#1b120c" stroke-width="1.5" fill="none"/>
  </svg>`;
}

// 16. Vaga-lumes no fundo à noite
function iniciarVagalumesBruxo(forcarNoite) {
  if (typeof document === "undefined" || RM) return;
  const hora = new Date().getHours();
  const ehNoite = forcarNoite || hora >= 18 || hora < 6;
  if (!ehNoite) return;
  if (document.querySelector(".bruxo-vagalumes")) return;
  const cont = document.createElement("div");
  cont.className = "bruxo-vagalumes";
  cont.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 10; i++) {
    const vl = document.createElement("span");
    vl.className = "bruxo-vagalume";
    vl.style.left = `${Math.random() * 95}%`;
    vl.style.top = `${Math.random() * 85 + 5}%`;
    vl.style.setProperty("--vx", `${(Math.random() - 0.5) * 60}px`);
    vl.style.setProperty("--vy", `${(Math.random() - 0.5) * 60}px`);
    vl.style.animationDelay = `${(Math.random() * 3).toFixed(1)}s`;
    vl.style.animationDuration = `${(3 + Math.random() * 2).toFixed(1)}s`;
    cont.appendChild(vl);
  }
  document.body.appendChild(cont);
}

function pararVagalumesBruxo() {
  if (typeof document === "undefined") return;
  const v = document.querySelector(".bruxo-vagalumes");
  if (v) v.remove();
}

// 17. Caldeirão muda de cor conforme ingredientes adicionados
function corCaldeiraoDinamica(itens, feita) {
  if (feita) {
    const p = typeof POCOES !== "undefined" && POCOES.find(x => x.nome === feita);
    return (p && p.cor) || "#76FF03";
  }
  const n = Array.isArray(itens) ? itens.length : 0;
  if (n === 0) return "#33691E";
  if (n === 1) return "#7B1FA2";
  if (n === 2) return "#00897B";
  if (n === 3) return "#FB8C00";
  return "#76FF03";
}

// 18. Risadinha de bruxa sintetizada ao bater a meta
function somRisadinhaBruxa(ctx, saida, t = 0) {
  if (!ctx || !saida) return;
  const notas = [880, 1174, 987, 1318, 1046, 880];
  notas.forEach((freq, idx) => {
    tocarTom(ctx, saida, t + idx * 0.08, freq, 0.12, "triangle", 0.08, 0.01);
    tocarTom(ctx, saida, t + idx * 0.08 + 0.01, freq * 1.5, 0.08, "sine", 0.04, 0.01);
  });
}

// 19. Coruja e vento no ambiente de foco "floresta"
function ambienteFlorestaBruxo(ctx) {
  const pioCoruja = (c, s, t) => {
    tocarTom(c, s, t, 520, 0.4, "sine", 0.05, 0.08);
    tocarTom(c, s, t + 0.35, 415, 0.6, "sine", 0.06, 0.1);
  };
  const vento = (c, s, t) => {
    rajada(c, s, t, 1.8, 480, "bandpass", 0.04, 0.6);
  };
  return ambienteComposto(ctx, { freq: 400, tipo: "lowpass", vol: 0.04, onda: 0.1 }, [
    [vento, 3000, 8000],
    [pioCoruja, 8000, 18000],
    [grilo, 1500, 4500]
  ]);
}

// 20. Som de vassoura passando quando atravessa a tela
function somVassouraVoo(ctx, saida, t = 0) {
  if (!ctx || !saida) return;
  rajada(ctx, saida, t, 0.65, 800, "bandpass", 0.12, 0.3);
  tocarTom(ctx, saida, t + 0.05, 320, 0.5, "sine", 0.06, 0.2);
}

// 25. Ervas raras por fase da lua
const ERVAS_RARAS_LUA = {
  cheia: {
    id: "flor_meia_noite",
    nome: "Flor da Meia-Noite",
    desc: "Brilha com luz prateada na mata fechada.",
    cor: "#E0E0E0"
  },
  nova: {
    id: "raiz_sombras",
    nome: "Raiz das Sombras",
    desc: "Absorve os sussurros do silêncio noturno.",
    cor: "#4A148C"
  },
  crescente: {
    id: "brotinho_estelar",
    nome: "Brotinho Estelar",
    desc: "Dourado como faísca de estrela cadente.",
    cor: "#FFD54F"
  },
  minguante: {
    id: "liquen_silencio",
    nome: "Líquen do Silêncio",
    desc: "Gélido e calmante para as poções ancestrais.",
    cor: "#80DEEA"
  }
};

function colherErvaRaraLua() {
  const lua = typeof faseLuaBruxo === "function" ? faseLuaBruxo() : { nome: "Lua Cheia" };
  let chave = "cheia";
  const n = (lua.nome || "").toLowerCase();
  if (n.includes("nova")) chave = "nova";
  else if (n.includes("crescente")) chave = "crescente";
  else if (n.includes("minguante")) chave = "minguante";

  const erva = ERVAS_RARAS_LUA[chave];
  const d = dadosBruxo();
  if (!Array.isArray(d.ervasRaras)) d.ervasRaras = [];
  d.ervasRaras.push({ id: erva.id, nome: erva.nome, colhidaEm: today() });
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Erva Rara Colhida! 🌙✨",
      texto: `Você encontrou ${erva.nome} sob a luz da ${lua.nome}.`,
      tipo: "conquista",
      mood: "happy"
    });
  }
  return erva;
}

// 26. Mandar poção pra amigo
function mandarPocaoAmigo(amigoNome, pocaoNome) {
  const pNome = pocaoNome || "Poção da Coragem";
  const aNome = amigoNome || "amigo";
  const d = dadosBruxo();
  if (!Array.isArray(d.pocoesEnviadas)) d.pocoesEnviadas = [];
  d.pocoesEnviadas.push({ amigo: aNome, pocao: pNome, data: today() });
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Poção Enviada! 🧪💌",
      texto: `${pNome} enviada com sucesso para ${aNome} com brilho verde mágico!`,
      tipo: "sucesso",
      mood: "party"
    });
  }
  return true;
}

// 27. Pet com chapéu de bruxa vira sapo por 5 segundos
function bruxoPetViraSapo() {
  const d = dadosBruxo();
  d.petSapoAte = Date.now() + 5000;
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Ribbit! O Pet virou sapo! 🐸👑",
      texto: "Um feitiço travesso transformou seu companheiro por 5 segundos!",
      tipo: "info",
      mood: "happy"
    });
  }
  return true;
}

// 30. Fotolog com moldura de folhas e cogumelos
function molduraFotologBruxoHTML(conteudo) {
  return `<div class="bruxo-fotolog-moldura">
    <div class="bruxo-fotolog-enfeite-folhas">🍃🍁</div>
    ${conteudo || ""}
    <div class="bruxo-fotolog-enfeite-cogu">🍄🌿</div>
  </div>`;
}

// 31. Encomendas diárias dos clientes da floresta
const CLIENTES_FLORESTA = [
  {
    cliente: "Esquilo da clareira",
    pocao: "Poção da Coragem",
    recompensa: 15,
    fala: "Tem nozes no alto da árvore que eu não consigo pegar sem coragem!"
  },
  {
    cliente: "Coruja sábia",
    pocao: "Xarope do Foco",
    recompensa: 15,
    fala: "Preciso catalogar as constelações desta noite sem piscar."
  },
  {
    cliente: "Família de sapos",
    pocao: "Chá da Gentileza",
    recompensa: 15,
    fala: "Queremos fazer as pazes com as rãs do lago vizinho."
  },
  {
    cliente: "Espírito do bosque",
    pocao: "Poção da Calma",
    recompensa: 15,
    fala: "O vento andou muito agitado hoje entre os pinheiros."
  }
];

function encomendasFlorestaBruxo() {
  const d = dadosBruxo();
  if (!d.encomendasDia || d.encomendasDia.data !== today()) {
    const idx = (diffDays("2026-01-01", today()) + 3) % CLIENTES_FLORESTA.length;
    d.encomendasDia = {
      data: today(),
      cliente: CLIENTES_FLORESTA[idx],
      entregue: false
    };
    commit();
  }
  return d.encomendasDia;
}

function entregarEncomendaFloresta() {
  const d = dadosBruxo();
  const enc = encomendasFlorestaBruxo();
  if (!enc || enc.entregue) return false;
  enc.entregue = true;
  if (typeof S !== "undefined") {
    S.coins = (S.coins || 0) + enc.cliente.recompensa;
  }
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Encomenda Entregue! 🍂📦",
      texto: `${enc.cliente.cliente} agradeceu com +${enc.cliente.recompensa} gotas douradas!`,
      tipo: "conquista",
      mood: "party"
    });
  }
  return true;
}

function encomendasFlorestaHTML() {
  const enc = encomendasFlorestaBruxo();
  return `<div class="card sub sunken" style="margin-top:6px;padding:8px">
    <div class="row" style="justify-content:space-between;align-items:center">
      <b>🌲 Pedido de: ${esc(enc.cliente.cliente)}</b>
      <span class="mono">${enc.entregue ? "✅ Entregue" : "⏳ Pendente"}</span>
    </div>
    <p style="font-size:12px;font-style:italic;margin:4px 0">"${esc(enc.cliente.fala)}"</p>
    <div class="row" style="justify-content:space-between;align-items:center;margin-top:4px">
      <span class="note">Item pedido: <b>${esc(enc.cliente.pocao)}</b> (+${enc.cliente.recompensa} gotas)</span>
      ${!enc.entregue ? `<button class="btn small primary" data-act="bruxo-entregar-encomenda">Entregar</button>` : ""}
    </div>
  </div>`;
}

ACOES_EXTRAS["bruxo-entregar-encomenda"] = () => {
  entregarEncomendaFloresta();
  render();
};

// 32. Estoque de ingredientes guardados pro dia seguinte
function guardarIngredienteEstoque(ingrediente) {
  const d = dadosBruxo();
  if (!Array.isArray(d.estoqueIngredientes)) d.estoqueIngredientes = [];
  if (d.estoqueIngredientes.length >= 4) return false;
  const ing = ingrediente || (d.caldeirao && d.caldeirao.itens && d.caldeirao.itens.pop());
  if (!ing) return false;
  d.estoqueIngredientes.push(ing);
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Ingrediente Guardado! 🏺",
      texto: `${ing} foi guardado na despensa pro dia seguinte.`,
      tipo: "info",
      mood: "happy"
    });
  }
  return true;
}

function usarIngredienteEstoque(idx = 0) {
  const d = dadosBruxo();
  if (!Array.isArray(d.estoqueIngredientes) || !d.estoqueIngredientes.length) return false;
  const [ing] = d.estoqueIngredientes.splice(idx, 1);
  if (!d.caldeirao.itens) d.caldeirao.itens = [];
  d.caldeirao.itens.push(ing);
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Ingrediente Resgatado! 🌿",
      texto: `${ing} foi jogado de volta no caldeirão.`,
      tipo: "sucesso",
      mood: "happy"
    });
  }
  return ing;
}

// 33. Poção que dá errado (fumaça colorida inofensiva e fala engraçada)
function prepararPocaoComChanceFalha(forcarFalha = false) {
  const d = dadosBruxo();
  const c = d.caldeirao;
  if (!forcarFalha && (c.itens.length < 4 || Math.random() > 0.15)) {
    return false;
  }
  animarFumacaPocao();
  if (typeof S !== "undefined") S.coins = (S.coins || 0) + 2;
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Puf! A poção explodiu em purpurina! ✨💨",
      texto: "Saiu uma fumacinha roxa cheirosa e o gato saiu correndo. Ganhou +2 gotas de consolação!",
      tipo: "info",
      mood: "upset"
    });
  }
  return true;
}

// 34. Calendário lunar do mês
function calendarioLunarMesHTML(ano, mes) {
  const agora = new Date();
  const a = typeof ano === "number" ? ano : agora.getFullYear();
  const m = typeof mes === "number" ? mes : agora.getMonth();
  const totalDias = new Date(a, m + 1, 0).getDate();
  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  let html = `<div class="card sub" style="margin-top:6px">
    <b>🌙 Calendário Lunar: ${nomesMeses[m]} ${a}</b>
    <div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:4px;margin-top:6px;text-align:center">`;

  for (let dia = 1; dia <= totalDias; dia++) {
    const dataStr = `${a}-${String(m + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const fl = faseLuaBruxo(dataStr);
    const ehHoje = dataStr === today();
    html += `<div style="padding:4px 2px;border-radius:4px;background:${ehHoje ? "rgba(118,255,3,0.18)" : "rgba(0,0,0,0.15)"};border:${ehHoje ? "1px solid #76ff03" : "1px solid transparent"}">
      <div style="font-size:9px">${dia}</div>
      <div style="font-size:14px">${fl.icone}</div>
    </div>`;
  }
  html += `</div></div>`;
  return html;
}

// 35. Amuletos de 3 ervas com efeito por 1 semana
function criarAmuletoErvas(e1 = "Alecrim", e2 = "Lavanda", e3 = "Camomila") {
  const d = dadosBruxo();
  d.amuletoAtivo = {
    nome: `Amuleto de ${e1}, ${e2} e ${e3}`,
    ervas: [e1, e2, e3],
    criadoEm: today(),
    expiraEm: addDays(today(), 7)
  };
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Amuleto Encantado Criado! 🪬🌿",
      texto: `Proteção das 3 ervas ativada até ${d.amuletoAtivo.expiraEm}!`,
      tipo: "sucesso",
      mood: "party"
    });
  }
  return d.amuletoAtivo;
}

// 36. Livro das sombras com capa roxa e cadeado opcional
function alternarCadeadoLivroSombras() {
  const d = dadosBruxo();
  d.livroTrancado = !d.livroTrancado;
  commit();
  return d.livroTrancado;
}

function livroDasSombrasHTML() {
  const d = dadosBruxo();
  const trancado = !!d.livroTrancado;
  return `<div class="card sub" style="background:#1e1035;border:2px solid #b388ff;border-radius:10px;padding:12px;margin-top:6px;color:#f3e8ff">
    <div class="row" style="justify-content:space-between;align-items:center">
      <div style="font-size:16px;font-weight:bold">📖 Livro das Sombras</div>
      <button class="btn small" data-act="bruxo-toggle-cadeado">${trancado ? "🔒 Trancado" : "🔓 Aberto"}</button>
    </div>
    <div style="text-align:center;padding:12px 0">
      <svg viewBox="0 0 80 100" width="80" height="100">
        <rect x="5" y="5" width="70" height="90" rx="6" fill="#311B92" stroke="#FFD54F" stroke-width="2"/>
        <circle cx="40" cy="50" r="18" fill="none" stroke="#FFD54F" stroke-width="1.8"/>
        <path d="M40 32 L40 68 M22 50 L58 50" stroke="#FFD54F" stroke-width="1.2"/>
        <circle cx="40" cy="50" r="6" fill="#76FF03"/>
      </svg>
    </div>
    ${trancado ? `<p class="note" style="text-align:center">O feitiço de tranca guarda seus segredos mais antigos.</p>` : `<p class="note" style="text-align:center">Páginas de feitiços e rituais abertas para consulta.</p>`}
  </div>`;
}

ACOES_EXTRAS["bruxo-toggle-cadeado"] = () => {
  alternarCadeadoLivroSombras();
  render();
};

// 37. Cogumelos que nascem no chão da tela ao longo do dia
function brotarCogumelosDia() {
  if (typeof document === "undefined" || RM) return;
  const feitas =
    (typeof S !== "undefined" &&
      Array.isArray(S.tasks) &&
      S.tasks.filter(t => t.done && t.date === today()).length) ||
    0;
  const qtd = Math.min(8, Math.max(1, Math.floor(feitas / 2) + 1));
  let cont = document.querySelector(".bruxo-cogu-container");
  if (!cont) {
    cont = document.createElement("div");
    cont.className = "bruxo-cogu-container";
    cont.setAttribute("aria-hidden", "true");
    document.body.appendChild(cont);
  }
  cont.innerHTML = "";
  const cores = ["#E53935", "#8E24AA", "#FB8C00", "#43A047", "#1E88E5"];
  for (let i = 0; i < qtd; i++) {
    const cogu = document.createElement("div");
    cogu.className = "bruxo-cogu-chao";
    const cor = cores[i % cores.length];
    cogu.innerHTML = `<svg viewBox="0 0 20 20" width="18" height="18">
      <rect x="8" y="10" width="4" height="10" rx="1" fill="#FFF3E0"/>
      <path d="M2 10 Q10 1 18 10 Z" fill="${cor}"/>
      <circle cx="6" cy="6" r="1.2" fill="#fff"/>
      <circle cx="12" cy="5" r="1.5" fill="#fff"/>
      <circle cx="15" cy="8" r="1" fill="#fff"/>
    </svg>`;
    cont.appendChild(cogu);
  }
}

// 40. Lua do cabeçalho muda de fase de verdade
function iconeLuaCabecalhoBruxo() {
  const fl = typeof faseLuaBruxo === "function" ? faseLuaBruxo() : { icone: "🌕" };
  return fl.icone;
}

// 41. Som de coaxar de sapo ao desencantar
function somCoaxarSapo(ctx, saida, t = 0) {
  if (!ctx || !saida) return;
  const o = ctx.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(260, t + 0.08);
  o.frequency.exponentialRampToValueAtTime(90, t + 0.18);
  const g = envelope(ctx, t, 0.02, 0.2, 0.14);
  o.connect(g).connect(saida);
  o.start(t);
  o.stop(t + 0.22);
}

// 42. Som de miado do gato ao dar conselho
function somMiadoGato(ctx, saida, t = 0) {
  if (!ctx || !saida) return;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(480, t);
  o.frequency.exponentialRampToValueAtTime(720, t + 0.12);
  o.frequency.exponentialRampToValueAtTime(420, t + 0.32);
  const g = envelope(ctx, t, 0.03, 0.35, 0.12);
  o.connect(g).connect(saida);
  o.start(t);
  o.stop(t + 0.38);
}

// 43. Conquistas próprias do mundo Bruxo
const CONQUISTAS_BRUXO = [
  {
    id: "mestre_pocoes",
    titulo: "Mestre das Poções",
    desc: "Descobriu 10 receitas mágicas diferentes.",
    icone: "🧪"
  },
  {
    id: "horta_completa",
    titulo: "Horta Completa",
    desc: "Cultivou e colheu as 7 ervas místicas da cabana.",
    icone: "🌿"
  },
  {
    id: "desencantador_sapos",
    titulo: "Desencantador da Floresta",
    desc: "Desencantou 5 tarefas transformadas em sapo.",
    icone: "🐸"
  }
];

function verificarConquistasBruxo() {
  const d = dadosBruxo();
  if (!Array.isArray(d.conquistas)) d.conquistas = [];
  const novas = [];

  const descobertas = Array.isArray(d.descobertas) ? d.descobertas.length : 0;
  if (descobertas >= 10 && !d.conquistas.includes("mestre_pocoes")) {
    d.conquistas.push("mestre_pocoes");
    novas.push("Mestre das Poções");
  }

  const estoqueErvas = Array.isArray(d.estoqueErvas) ? d.estoqueErvas.length : 0;
  if (estoqueErvas >= 7 && !d.conquistas.includes("horta_completa")) {
    d.conquistas.push("horta_completa");
    novas.push("Horta Completa");
  }

  const sapos = d.saposDesencantados || 0;
  if (sapos >= 5 && !d.conquistas.includes("desencantador_sapos")) {
    d.conquistas.push("desencantador_sapos");
    novas.push("Desencantador da Floresta");
  }

  if (novas.length > 0) {
    commit();
    if (typeof notificar === "function") {
      notificar({
        titulo: "Conquista Arcana Desbloqueada! 🏆✨",
        texto: novas.join(", "),
        tipo: "conquista",
        mood: "party"
      });
    }
  }
  return d.conquistas;
}

// 44. Coleção de frascos com formatos diferentes
const FRASCOS_BRUXO = [
  { id: "gota", nome: "Frasco Gota Clássico", icone: "💧" },
  { id: "estrela", nome: "Frasco Estrela Noturna", icone: "⭐" },
  { id: "cranio", nome: "Frasco Crânio Místico", icone: "💀" },
  { id: "abobora", nome: "Frasco Abóbora de Outono", icone: "🎃" }
];

function desbloquearFrascoBruxo(id) {
  const d = dadosBruxo();
  if (!Array.isArray(d.frascos)) d.frascos = ["gota"];
  if (!d.frascos.includes(id)) {
    d.frascos.push(id);
    commit();
    return true;
  }
  return false;
}

function colecaoFrascosHTML() {
  const d = dadosBruxo();
  if (!Array.isArray(d.frascos)) d.frascos = ["gota"];
  return `<div class="card sub" style="margin-top:6px">
    <b>🧪 Coleção de Frascos Alquímicos</b>
    <div class="row" style="gap:6px;margin-top:6px">
      ${FRASCOS_BRUXO.map(
        f => `
        <div class="card sub sunken" style="flex:1;text-align:center;padding:6px;opacity:${d.frascos.includes(f.id) ? "1" : "0.4"}">
          <div style="font-size:20px">${f.icone}</div>
          <div style="font-size:10px;font-weight:bold">${esc(f.nome)}</div>
        </div>
      `
      ).join("")}
    </div>
  </div>`;
}

// 46. Vassouras colecionáveis
const VASSOURAS_BRUXO = [
  { id: "palha", nome: "Vassoura de Palha Clássica", vel: "Básica" },
  { id: "galho", nome: "Vassoura de Galho Retorcido", vel: "Rápida" },
  { id: "cristal", nome: "Vassoura de Cristal Cintilante", vel: "Suprema" }
];

function trocarVassouraBruxo(id) {
  const d = dadosBruxo();
  d.vassouraAtual = id;
  commit();
  return d.vassouraAtual;
}

// 47. Troca de ervas raras com amigos
function trocarErvaRaraAmigo(amigoNome, minhaErva, ervaDesejada) {
  const d = dadosBruxo();
  if (!Array.isArray(d.trocasErvas)) d.trocasErvas = [];
  d.trocasErvas.push({
    amigo: amigoNome || "amigo",
    oferecida: minhaErva || "Alecrim",
    recebida: ervaDesejada || "Lavanda",
    data: today()
  });
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Troca Realizada no Coven! 🌿🤝",
      texto: `Você trocou ${minhaErva} por ${ervaDesejada} com ${amigoNome}!`,
      tipo: "sucesso",
      mood: "happy"
    });
  }
  return true;
}

// 48. Ranking do coven
function rankingCovenHTML() {
  const bruxas = [
    { nome: "Você", pocoes: 8, pontos: 120 },
    { nome: "Morgana da Clareira", pocoes: 6, pontos: 95 },
    { nome: "Bruxinha Luna", pocoes: 5, pontos: 80 }
  ];
  return `<div class="card sub sunken" style="margin-top:6px;padding:8px">
    <b>🏆 Ranking do Coven da Floresta</b>
    <div style="margin-top:6px;font-size:12px">
      ${bruxas
        .map(
          (b, i) => `
        <div class="row" style="justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.08)">
          <span><b>#${i + 1}</b> ${esc(b.nome)}</span>
          <span class="mono">${b.pocoes} poções (${b.pontos} pts)</span>
        </div>
      `
        )
        .join("")}
    </div>
  </div>`;
}

// 49. Mimo "chá de ervas" para mandar a amigos
function mandarMimoChaErvas(amigoNome, tipoCha = "Chá de Camomila") {
  const d = dadosBruxo();
  if (!Array.isArray(d.mimosEnviados)) d.mimosEnviados = [];
  d.mimosEnviados.push({ amigo: amigoNome || "amigo", cha: tipoCha, data: today() });
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Xícara de Chá Enviada! ☕🌿",
      texto: `Uma xícara quentinha de ${tipoCha} foi levada pela coruja até ${amigoNome}.`,
      tipo: "sucesso",
      mood: "happy"
    });
  }
  return true;
}

// 50. Gato preto passeia junto com o pet
function gatoPasseiaJuntoPetHTML() {
  return `<div class="bruxo-gato-pet-passeio" style="display:flex;align-items:center;gap:12px;margin:6px 0;padding:6px;background:rgba(0,0,0,0.15);border-radius:8px">
    <svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M6 24Q5 12 16 12Q27 12 26 24Z" fill="#212121"/>
      <circle cx="16" cy="10" r="7" fill="#212121"/>
      <polygon points="11,6 10,0 15,4" fill="#212121"/>
      <polygon points="21,6 22,0 17,4" fill="#212121"/>
      <circle cx="13" cy="9" r="1.4" fill="#C6FF00"/>
      <circle cx="19" cy="9" r="1.4" fill="#C6FF00"/>
    </svg>
    <span style="font-size:12px">🐈‍⬛ <b>O Gato Preto</b> acompanha os passos do seu companheiro pela cabana.</span>
  </div>`;
}

if (typeof SONS_MUNDO !== "undefined" && SONS_MUNDO.bruxo) {
  SONS_MUNDO.bruxo.meta = (ctx, saida, t) => {
    somRisadinhaBruxa(ctx, saida, t);
  };
  SONS_MUNDO.bruxo.ambiente = ctx => ambienteFlorestaBruxo(ctx);
  SONS_MUNDO.bruxo.sapo = (ctx, saida, t) => somCoaxarSapo(ctx, saida, t);
  SONS_MUNDO.bruxo.gato = (ctx, saida, t) => somMiadoGato(ctx, saida, t);
}

// 51. Foco vira "apurar a poção" (caldeirão borbulha mais forte durante o foco)
function apurarPocaoFocoHTML(tempoRestante = "25:00") {
  return `<div class="card sub" style="text-align:center;padding:12px;margin-top:6px;background:rgba(38,50,56,0.3)">
    <div style="font-size:15px;font-weight:bold;margin-bottom:6px">🧪 Apurando a Poção do Conhecimento</div>
    <svg viewBox="0 0 100 60" width="80" height="50">
      <path d="M20 25H80Q84 55 50 56Q16 55 20 25Z" fill="#263238" stroke="var(--ink)" stroke-width="1.8"/>
      <ellipse cx="50" cy="25" rx="30" ry="3.5" fill="#76FF03"/>
      <g class="bolhas-caldeirao">
        <circle cx="36" cy="20" r="3" fill="#76FF03"/>
        <circle cx="50" cy="16" r="4" fill="#B2FF59"/>
        <circle cx="64" cy="20" r="3" fill="#76FF03"/>
      </g>
    </svg>
    <div class="mono" style="font-size:18px;margin-top:4px">${esc(tempoRestante)}</div>
    <span class="note">Fogo brando aceso. Foco total sem mexer a colher!</span>
  </div>`;
}

// 52. Matérias viram ervas do grimório com cor própria
const MATERIAS_ERVAS_BRUXO = {
  exatas: { erva: "Alecrim da Lógica", cor: "#7CB342", icone: "🌿" },
  humanas: { erva: "Sálvia das Eras", cor: "#B388FF", icone: "🌾" },
  biologicas: { erva: "Arruda da Vida", cor: "#26A69A", icone: "🌱" },
  linguagens: { erva: "Hortelã da Eloquência", cor: "#FFB74D", icone: "🪻" },
  padrao: { erva: "Camomila dos Estudos", cor: "#81C784", icone: "🌼" }
};

function materiaErvaBruxo(materiaNome) {
  const norm = (materiaNome || "").toLowerCase();
  if (norm.includes("mat") || norm.includes("fís") || norm.includes("quím") || norm.includes("cálc")) {
    return MATERIAS_ERVAS_BRUXO.exatas;
  }
  if (norm.includes("hist") || norm.includes("geog") || norm.includes("filo") || norm.includes("socio")) {
    return MATERIAS_ERVAS_BRUXO.humanas;
  }
  if (norm.includes("bio") || norm.includes("saúde") || norm.includes("anatom")) {
    return MATERIAS_ERVAS_BRUXO.biologicas;
  }
  if (norm.includes("port") || norm.includes("ingl") || norm.includes("espanh") || norm.includes("liter")) {
    return MATERIAS_ERVAS_BRUXO.linguagens;
  }
  return MATERIAS_ERVAS_BRUXO.padrao;
}

// 53. Prova vira "noite de lua cheia" (contagem até a lua cheia)
function provaNoiteLuaCheiaHTML(prova) {
  const dias = prova && typeof prova.date === "string" ? Math.max(0, diffDays(today(), prova.date)) : 7;
  return `<div class="card sub" style="border:1px solid #ffd54f;background:rgba(255,213,79,0.08);margin-top:6px">
    <div class="row" style="justify-content:space-between;align-items:center">
      <b>🌕 Noite de Lua Cheia: ${esc((prova && prova.title) || "Grande Ritual de Prova")}</b>
      <span class="mono">${dias === 0 ? "Hoje!" : `em ${dias} dias`}</span>
    </div>
    <span class="note">O alinhamento lunar exige grimórios revisados e poções prontas.</span>
  </div>`;
}

// 54. Revisão espaçada vira "regar a planta"
function textoRevisaoEspacadaBruxo() {
  return "Regar o canteiro da memória 🪴";
}

// 55. Meta de leitura vira "páginas do livro das sombras"
function textoMetaLeituraBruxo(paginas = 0, meta = 10) {
  return `Páginas transcritas no Livro das Sombras: ${paginas} / ${meta} 📜✨`;
}

// 57. Humores por tema (Caldeirão tóxico vs Ervas)
function humorPorTemaBruxo(temaId, humor = "happy") {
  if (temaId === "caldeirao") {
    const mapa = {
      radiant: "Ebulição pura!",
      happy: "Borbulhas verdes",
      idle: "Fogo brando",
      upset: "Fumaça ácida",
      sad: "Caldeirão frio",
      cry: "Poção azedou"
    };
    return mapa[humor] || "Borbulhando";
  }
  if (temaId === "ervas") {
    const mapa = {
      radiant: "Flor de lótus aberta",
      happy: "Brotinho viçoso",
      idle: "Chá morno",
      upset: "Erva daninha",
      sad: "Folhas secas",
      cry: "Canteiro murcho"
    };
    return mapa[humor] || "Cultivando";
  }
  return null;
}

// 58. Evento de Halloween (15/10 a 05/11)
function eventoHalloweenBruxoAtivo(dataStr) {
  const d = dataStr ? parse(dataStr) : new Date();
  const mes = d.getMonth();
  const dia = d.getDate();
  return (mes === 9 && dia >= 15) || (mes === 10 && dia <= 5);
}

// 59. Sexta-feira 13 com fala e efeito especiais
function ehSextaFeira13Bruxo(dataStr) {
  const d = dataStr ? parse(dataStr) : new Date();
  return d.getDay() === 5 && d.getDate() === 13;
}

// 60. Opção em Ajustes para desligar cursor de vassoura e efeitos
function alternarEfeitosBruxoSuave() {
  const d = dadosBruxo();
  d.desligarEfeitosFortes = !d.desligarEfeitosFortes;
  commit();
  if (typeof applyTheme === "function") {
    applyTheme();
  }
  return d.desligarEfeitosFortes;
}

/* Conexão com eventos do Bruxo */
if (typeof MUNDO_FX !== "undefined" && MUNDO_FX.bruxo) {
  const antigoAoConcluirBruxo = MUNDO_FX.bruxo.aoConcluir;
  MUNDO_FX.bruxo.aoConcluir = (tarefa, b) => {
    if (typeof antigoAoConcluirBruxo === "function") antigoAoConcluirBruxo(tarefa, b);
    conferirProtecaoManha();
    animarEvaporacaoBolhas(b);
    const feitas =
      (typeof S !== "undefined" &&
        Array.isArray(S.tasks) &&
        S.tasks.filter(t => t.done && t.date === today()).length) ||
      0;
    if (feitas > 0 && feitas % 5 === 0) {
      animarVooVassoura();
    }
    const meta = (typeof S !== "undefined" && S.metaTarefas) || 5;
    if (feitas >= meta) {
      const d = dadosBruxo();
      if (!d.risadinhaHoje || d.risadinhaHoje !== today()) {
        d.risadinhaHoje = today();
        commit();
        if (typeof pegarAudio === "function") {
          try {
            const ctx = pegarAudio();
            if (ctx) somRisadinhaBruxa(ctx, ctx.destination, ctx.currentTime);
          } catch (_) {}
        }
      }
    }
  };

  const antigaTrocaAbaBruxo = MUNDO_FX.bruxo.trocaAba;
  MUNDO_FX.bruxo.trocaAba = () => {
    if (typeof antigaTrocaAbaBruxo === "function") antigaTrocaAbaBruxo();
    iniciarVagalumesBruxo();
    brotarCogumelosDia();
  };

  const antigaSecaoHojeBruxo = MUNDO_FX.bruxo.secaoHoje;
  MUNDO_FX.bruxo.secaoHoje = () => {
    let html = "";
    if (typeof antigaSecaoHojeBruxo === "function") {
      html += antigaSecaoHojeBruxo();
    }
    const lua = faseLuaBruxo();
    const conselho = conselhoGatoBruxo();
    const feitasHoje =
      (typeof S !== "undefined" &&
        Array.isArray(S.tasks) &&
        S.tasks.filter(t => t.done && t.date === today()).length) ||
      0;

    let decoracaoAbobora = "";
    if (typeof S !== "undefined" && S.themeBy && S.themeBy.bruxo === "abobora") {
      decoracaoAbobora = aboboraHumorHTML(S.mood);
    }

    let bannerEspecial = "";
    if (eventoHalloweenBruxoAtivo()) {
      bannerEspecial += `<div class="card sub sunken" style="border:1px solid #fb8c00;margin-bottom:6px">🎃 <b>Festival de Halloween das Bruxas:</b> Caldeirão com 2x bônus!</div>`;
    }
    if (ehSextaFeira13Bruxo()) {
      bannerEspecial += `<div class="card sub sunken" style="border:1px solid #7c4dff;margin-bottom:6px">🐈‍⬛ <b>Sexta-feira 13:</b> O gato preto ronrona mais alto. Sorte dobrada!</div>`;
    }

    html += cartaoMundo(
      "cm-bruxo-lua-gato",
      `${decoracaoAbobora}Fase Lunar: ${lua.nome} ${lua.icone}`,
      lua.bonus,
      `${bannerEspecial}
      <div class="card sub sunken" style="padding:8px;margin-bottom:6px">
        <b>🐈‍⬛ O Gato Preto Murmura:</b><br>
        <span style="font-size:12px;font-style:italic">"${esc(conselho)}"</span>
      </div>
      ${velasBruxoHTML(feitasHoje)}
      ${encomendasFlorestaHTML()}
      ${sabaDeSextaHTML()}
      ${livroDeReceitasHTML()}
      ${covenSemanalHTML()}
      ${grimorioErvasHTML()}
      ${calendarioLunarMesHTML()}
      ${livroDasSombrasHTML()}`
    );
    return html;
  };
}
