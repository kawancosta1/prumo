/*
  Mundo Feiticeiro, Lote 1 (Itens 1 a 10):
  1. Escolas de magia (Fogo, Gelo, Estrela, Natureza) com cores, efeitos e falas
  2. Grimório de feitiços que sobem de nível por área
  3. Barra de Mana (enche com água e foco, gasta pra dobrar gotas)
  4. Ritual da manhã (3 tarefas antes das 10h dão bênção do dia)
  5. Pergaminho de missões (3 profecias semanais)
  6. Duelo mágico (tarefa vira oponente com barra de vida)
  7. Mini Prumi aprendiz que aparece a partir do 3º título
  8. Torre que cresce em andares com os feitiços lançados
  9. Biblioteca arcana com tomos dos livros lidos
  10. Previsão do cristal baseada no dia e nas tarefas
*/
"use strict";

const ESCOLAS_MAGIA = {
  estrela: {
    nome: "Escola das Estrelas",
    cor: "#F59E0B",
    particula: "#FDE047",
    icone: "✦",
    efeito: "cometa",
    fala: "A luz celestial guia cada passo."
  },
  fogo: {
    nome: "Escola do Fogo",
    cor: "#EF4444",
    particula: "#FCA5A5",
    icone: "🔥",
    efeito: "spark",
    fala: "Chama viva que incendeia a determinação."
  },
  gelo: {
    nome: "Escola do Gelo",
    cor: "#06B6D4",
    particula: "#67E8F9",
    icone: "❄",
    efeito: "runa",
    fala: "Calma glacial e precisão absoluta."
  },
  natureza: {
    nome: "Escola da Natureza",
    cor: "#10B981",
    particula: "#6EE7B7",
    icone: "🌿",
    efeito: "folha",
    fala: "A força das raízes antigas floresce hoje."
  }
};

const FEITICOS_AREAS = {
  geral: { nome: "Foco Primordial", icone: "✦" },
  estudos: { nome: "Mente Arcana", icone: "📖" },
  saude: { nome: "Vitalis", icone: "💧" },
  casa: { nome: "Ordem Cósmica", icone: "🧹" },
  social: { nome: "Elo Espiritual", icone: "✨" }
};

const PREVISOES_CRISTAL = [
  "As estrelas revelam um caminho desimpedido para os seus estudos hoje.",
  "O cristal vibra com energia criativa. Uma tarefa difícil se resolverá com facilidade.",
  "A constelação do foco ilumina sua tarde. Grandes avanços esperam por você.",
  "Energias místicas indicam que a constância trará uma recompensa inesperada.",
  "O orbe mostra que a clareza de mente vence qualquer tempestade lá fora.",
  "Hoje o alinhamento arcano favorece concluir aquilo que estava pendente."
];

function escolaAtual() {
  const d = dadosFeit();
  if (!d.escola || !ESCOLAS_MAGIA[d.escola]) d.escola = "estrela";
  return d.escola;
}

function definirEscola(id) {
  if (!ESCOLAS_MAGIA[id]) return;
  const d = dadosFeit();
  d.escola = id;
  document.documentElement.setAttribute("data-escola-magia", id);
  commit();
}

function inicializarEscolaFeit() {
  if (typeof S !== "undefined" && S.persona === "feiticeiro") {
    document.documentElement.setAttribute("data-escola-magia", escolaAtual());
  }
}
document.addEventListener("DOMContentLoaded", inicializarEscolaFeit);

/* 2. Grimório de feitiços por área */
function grimorioFeiticos() {
  const d = dadosFeit();
  if (!d.grimorioAreas || typeof d.grimorioAreas !== "object") d.grimorioAreas = {};
  return d.grimorioAreas;
}

function evoluirFeiticoArea(area) {
  const g = grimorioFeiticos();
  const a = area || "geral";
  g[a] = (g[a] || 0) + 1;
}

function rankFeitico(xp = 0) {
  if (xp >= 30) return { nivel: 4, titulo: "Lendário" };
  if (xp >= 15) return { nivel: 3, titulo: "Mestre" };
  if (xp >= 5) return { nivel: 2, titulo: "Adepto" };
  return { nivel: 1, titulo: "Iniciado" };
}

/* 3. Mana Arcana */
function manaFeit() {
  const d = dadosFeit();
  if (typeof d.mana !== "number") d.mana = 30;
  return d.mana;
}

function adicionarMana(qtd = 10) {
  const d = dadosFeit();
  d.mana = Math.min(100, Math.max(0, manaFeit() + qtd));
}

/* 4. Ritual da manhã */
function ritualManhaFeito() {
  const d = dadosFeit();
  return d.bencaoDia === today();
}

function conferirRitualManha() {
  const hora = new Date().getHours();
  if (hora >= 10) return;
  const concluidasHoje = (S.tasks || []).filter(t => t.done && t.date === today()).length;
  if (concluidasHoje >= 3) {
    const d = dadosFeit();
    if (d.bencaoDia !== today()) {
      d.bencaoDia = today();
      notificar({
        titulo: "✦ Bênção da Manhã Concedida!",
        texto: "O ritual da aurora foi cumprido. Bônus místico ativado até o fim do dia!",
        tipo: "conquista",
        mood: "party"
      });
      circuloMagico();
    }
  }
}

/* 5. Profecias da semana */
function profeciasSemana() {
  const d = dadosFeit();
  const semanaId = today().slice(0, 7) + "-w" + Math.ceil(new Date().getDate() / 7);
  if (!d.profecias || d.profecias.semana !== semanaId) {
    d.profecias = {
      semana: semanaId,
      resgatado: false,
      metas: [
        { id: "feiticos", meta: 10, desc: "Lançar 10 feitiços no pergaminho" },
        { id: "agua", meta: 5, desc: "Recarregar mana com 5 elixires de água" },
        { id: "constelacao", meta: 1, desc: "Completar 1 constelação celeste" }
      ]
    };
  }
  return d.profecias;
}

/* 6. Duelo Mágico */
function dueloMagicoAtivo() {
  const d = dadosFeit();
  if (!d.duelo || typeof d.duelo !== "object") return null;
  return d.duelo;
}

function iniciarDuelo(tarefaId) {
  const t = (S.tasks || []).find(x => x.id === tarefaId);
  if (!t) return;
  const d = dadosFeit();
  d.duelo = {
    tarefaId,
    nome: "Espectro da Dúvida",
    hpMax: 100,
    hp: 100,
    titulo: t.title
  };
  commit();
}

function atacarDuelo(tarefaId, dano = 100) {
  const d = dadosFeit();
  if (!d.duelo || d.duelo.tarefaId !== tarefaId) return;
  d.duelo.hp = Math.max(0, d.duelo.hp - dano);
  if (d.duelo.hp <= 0) {
    earn(15);
    notificar({
      titulo: "✦ Duelo Mágico Vencido!",
      texto: `${d.duelo.nome} foi banido pela sua disciplina! +15 gotas arcanas.`,
      tipo: "conquista",
      mood: "party"
    });
    d.duelo = null;
  }
}

/* 8. Desenho da torre que cresce */
function torreMagicaSVG(andares = 1) {
  const n = Math.max(1, Math.min(8, andares));
  const altAndar = 14;
  const totalAlt = 34 + n * altAndar;
  let s = `<svg viewBox="0 0 80 ${totalAlt}" class="feit-torre-svg" aria-hidden="true">`;
  // Telhado pontiagudo no topo
  s += `<polygon points="40,2 24,24 56,24" fill="#CA8A04"/>`;
  s += `<circle cx="40" cy="4" r="3" fill="#FDE047" class="pisca"/>`;
  s += `<rect x="28" y="24" width="24" height="8" fill="#1E3A8A"/>`;
  // Andares
  for (let i = 0; i < n; i++) {
    const y = 32 + i * altAndar;
    s += `<rect x="26" y="${y}" width="28" height="${altAndar}" fill="${i % 2 === 0 ? "#1E293B" : "#172554"}" stroke="#0F172A" stroke-width=".8"/>`;
    s += `<rect x="36" y="${y + 4}" width="8" height="6" rx="2" fill="#FDE047" opacity=".85"/>`;
  }
  // Base firme
  s += `<rect x="20" y="${32 + n * altAndar}" width="40" height="6" rx="1" fill="#0F172A"/>`;
  s += `</svg>`;
  return s;
}

/* 9. Tomos da biblioteca arcana */
function tomosLidos() {
  if (typeof S === "undefined" || !Array.isArray(S.livros)) return [];
  return S.livros.filter(l => l.estante === "lido");
}

/* Gancho ao concluir tarefa no Feiticeiro */
if (typeof MUNDO_FX !== "undefined" && MUNDO_FX.feiticeiro) {
  const antigoAoConcluir = MUNDO_FX.feiticeiro.aoConcluir;
  MUNDO_FX.feiticeiro.aoConcluir = (tarefa, b) => {
    if (typeof antigoAoConcluir === "function") antigoAoConcluir(tarefa, b);
    evoluirFeiticoArea(tarefa.area);
    adicionarMana(8);
    atacarDuelo(tarefa.id, 100);
    conferirRitualManha();

    const d = dadosFeit();
    // Bônus de mana dobro de gotas
    if (d.manaBonus) {
      earn(5, b);
      d.manaBonus = false;
      toast("✦ Mana canalizada: gotas dobradas nesta tarefa!", false, "party");
    }
    // Bênção do ritual da manhã (+1 gota bônus)
    if (ritualManhaFeito()) {
      earn(1, b);
    }
  };

  /* Intercepta também a seção Hoje do Feiticeiro para exibir todo o Lote 1 */
  const antigaSecaoHoje = MUNDO_FX.feiticeiro.secaoHoje;
  MUNDO_FX.feiticeiro.secaoHoje = () => {
    const baseHTML = typeof antigaSecaoHoje === "function" ? antigaSecaoHoje() : "";
    const d = dadosFeit();
    const escAtual = escolaAtual();
    const dadosEsc = ESCOLAS_MAGIA[escAtual];
    const mana = manaFeit();
    const titulo = tituloMago(d.feiticos);
    const temAprendiz = d.feiticos >= 30;
    const andaresTorre = Math.min(8, Math.floor(d.feiticos / 8) + 1);
    const prof = profeciasSemana();
    const tomos = tomosLidos();
    const duelo = dueloMagicoAtivo();
    const prevCristal = PREVISOES_CRISTAL[diffDays("2026-01-01", today()) % PREVISOES_CRISTAL.length];

    // Seletor de Escolas de Magia
    const escolasHTML = `<div class="feit-card-bloco">
      <div class="row" style="justify-content:space-between;align-items:center">
        <b>${dadosEsc.icone} ${esc(dadosEsc.nome)}</b>
        <span class="note" style="color:${dadosEsc.cor}">Ativa</span>
      </div>
      <div class="seg" role="group" style="margin-top:6px">
        ${Object.entries(ESCOLAS_MAGIA)
          .map(
            ([id, e]) =>
              `<button class="${escAtual === id ? "on" : ""}" data-act="feit-escolha-escola" data-id="${id}" title="${esc(e.nome)}">${e.icone} ${esc(e.nome.replace("Escola d", ""))}</button>`
          )
          .join("")}
      </div>
    </div>`;

    // Barra de Mana
    const manaHTML = `<div class="feit-card-bloco">
      <div class="row" style="justify-content:space-between;align-items:center">
        <span><b>Mana Arcana:</b> ${mana}/100 ⚡</span>
        ${
          d.manaBonus
            ? `<span class="tag on">⚡ Dobro Ativo!</span>`
            : mana >= 50
              ? `<button class="btn small primary" data-act="feit-gastar-mana">Canalizar (50⚡)</button>`
              : `<span class="note">Enche com água e foco</span>`
        }
      </div>
      <div class="progress" style="margin-top:4px"><span style="width:${mana}%;background:linear-gradient(90deg, #3B82F6, #8B5CF6)"></span></div>
    </div>`;

    // Ritual da Manhã
    const ritualHTML = ritualManhaFeito()
      ? `<div class="tag on" style="display:inline-flex;align-items:center;gap:4px;margin-bottom:8px">✦ Bênção do Ritual da Aurora Ativa (+gotas)!</div>`
      : "";

    // Duelo Mágico (se houver)
    const dueloHTML = duelo
      ? `<div class="card duelo-magico" style="border:1.5px solid #EF4444;background:rgba(239,68,68,0.08);margin-bottom:10px">
          <div class="row" style="justify-content:space-between">
            <b>⚔️ Duelo: ${esc(duelo.nome)}</b>
            <span class="note">${duelo.hp}/${duelo.hpMax} HP</span>
          </div>
          <span class="note">Vinculado a: <i>${esc(duelo.titulo)}</i>. Conclua para vencer!</span>
          <div class="progress" style="margin-top:4px"><span style="width:${duelo.hp}%;background:#EF4444"></span></div>
        </div>`
      : "";

    // Painel do Grimório, Aprendiz e Torre
    const grimorioData = grimorioFeiticos();
    const feiticosAreasHTML = Object.entries(FEITICOS_AREAS)
      .map(([k, fa]) => {
        const xp = grimorioData[k] || 0;
        const r = rankFeitico(xp);
        return `<span class="tag" style="font-size:11px" title="${xp} tarefas">${fa.icone} ${fa.nome}: ${r.titulo}</span>`;
      })
      .join(" ");

    const torreEProfeciaHTML = `<div class="feit-card-bloco row" style="align-items:center;gap:12px;margin-top:8px">
      ${torreMagicaSVG(andaresTorre)}
      <div style="flex:1">
        <b>Torre dos Feitiços: ${andaresTorre}º Andar</b>
        <span class="note">A torre cresce com seu aprendizado contínuo.</span>
        <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">${feiticosAreasHTML}</div>
      </div>
    </div>`;

    // Aprendiz
    const aprendizHTML = temAprendiz
      ? `<div class="row" style="align-items:center;gap:8px;padding:6px 8px;background:rgba(202,138,4,0.12);border-radius:6px;margin-top:8px">
          <span style="font-size:18px">🧙‍♂️</span>
          <span class="note" style="color:var(--ink)"><b>Mini Aprendiz:</b> "Mestre ${esc(titulo)}, sua disciplina guia a nossa torre!"</span>
        </div>`
      : "";

    // Biblioteca Arcana
    const bibliotecaHTML = `<div class="feit-card-bloco" style="margin-top:8px">
      <div class="row" style="justify-content:space-between">
        <b>📚 Biblioteca Arcana</b>
        <span class="note">${tomos.length} ${tomos.length === 1 ? "tomo" : "tomos"}</span>
      </div>
      <span class="note">${tomos.length ? `Seus livros lidos viraram tomos mágicos na torre.` : `Termine livros na Estante para preencher as prateleiras arcanas.`}</span>
    </div>`;

    // Previsão do Cristal
    const cristalHTML = `<div class="feit-card-bloco" style="margin-top:8px;border-left:3px solid #CA8A04;padding-left:8px">
      <div class="row" style="align-items:center;gap:6px">
        <span style="font-size:14px">🔮</span>
        <b>Orbe da Previsão</b>
      </div>
      <span class="note" style="font-style:italic">"${esc(prevCristal)}"</span>
    </div>`;

    const extraCompleto = cartaoMundo(
      "cm-feiticeiro-mais",
      "Torre de Alta Magia",
      `${esc(dadosEsc.nome)} · Nível ${andaresTorre}`,
      `${ritualHTML}${dueloHTML}${escolasHTML}${manaHTML}${torreEProfeciaHTML}${aprendizHTML}${bibliotecaHTML}${cristalHTML}`
    );

    return baseHTML + extraCompleto;
  };
}

/* Ações dos botões do Feiticeiro */
ACOES_EXTRAS["feit-escolha-escola"] = (b, id) => {
  definirEscola(id);
  const escObj = ESCOLAS_MAGIA[id];
  toast(`${escObj.icone} ${escObj.nome} escolhida! ${escObj.fala}`, false, "happy");
  render();
};

ACOES_EXTRAS["feit-gastar-mana"] = () => {
  const d = dadosFeit();
  if (manaFeit() < 50 || d.manaBonus) return;
  d.mana -= 50;
  d.manaBonus = true;
  circuloMagico();
  toast("⚡ Mana canalizada! A próxima tarefa concluída renderá o dobro de gotas.", false, "party");
  commit();
  render();
};

ACOES_EXTRAS["feit-iniciar-duelo"] = (b, id) => {
  iniciarDuelo(id);
  toast(
    "⚔️ Duelo mágico iniciado contra a tarefa! Conclua os passos para banir o espectro.",
    false,
    "worried"
  );
  render();
};

/* =========================================================
   FEITICEIRO: LOTE 2 (ITENS 11 A 20)
   ========================================================= */

/* 11. Runas brilham em volta da tarefa ao concluir */
function efeitoRunasTarefa(alvo) {
  if (RM || !alvo) return;
  const container = document.createElement("div");
  container.className = "feit-runas-concluir";
  const runas = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ"];
  runas.forEach((r, i) => {
    const span = document.createElement("span");
    span.textContent = r;
    span.style.setProperty("--i", i);
    container.appendChild(span);
  });
  alvo.style.position = "relative";
  alvo.appendChild(container);
  setTimeout(() => container.remove(), 1200);
}

/* 12. Rastro de estrelinhas no cursor (PC, mundo Feiticeiro) */
if (typeof window !== "undefined" && !window.__feiticeiroCursorAtivo) {
  window.__feiticeiroCursorAtivo = true;
  let ultimoRastro = 0;
  document.addEventListener("pointermove", e => {
    if (RM) return;
    if (typeof S === "undefined" || S.persona !== "feiticeiro") return;
    if (e.pointerType !== "mouse") return;
    const agora = Date.now();
    if (agora - ultimoRastro < 65) return;
    ultimoRastro = agora;
    const star = document.createElement("span");
    star.className = "feit-cursor-estrela";
    star.textContent = "✦";
    star.style.left = e.clientX + "px";
    star.style.top = e.clientY + "px";
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 700);
  });
}

/* 14. Mapa do céu completo com todas as constelações */
function mapaDoCeuCompletoSVG() {
  const d = dadosFeit();
  const mapa = d.ceu.mapa || [];
  const W = 360,
    H = 260;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="feit-planetario-svg" aria-label="Mapa celeste completo">`;
  s += `<rect width="${W}" height="${H}" fill="#0A0B1E" rx="8"/>`;
  // Nebulosas e pontos de fundo
  s += `<circle cx="80" cy="80" r="60" fill="#3B82F6" opacity=".12"/>`;
  s += `<circle cx="260" cy="160" r="70" fill="#8B5CF6" opacity=".12"/>`;
  for (let i = 0; i < 40; i++) {
    const x = ((i * 47) % (W - 20)) + 10;
    const y = ((i * 31) % (H - 20)) + 10;
    s += `<circle cx="${x}" cy="${y}" r="0.9" fill="#FFF3C4" opacity=".6"/>`;
  }
  // Desenho das constelações completadas no céu
  CONSTELACOES.forEach((nome, idx) => {
    const completa = mapa.includes(idx) || d.ceu.atual > idx;
    const cx = 50 + (idx % 3) * 120 + (Math.floor(idx / 3) % 2) * 20;
    const cy = 45 + Math.floor(idx / 3) * 75;
    const pts = FORMAS_CONSTELACAO[idx % FORMAS_CONSTELACAO.length];
    s += `<g transform="translate(${cx - 40} ${cy - 20}) scale(0.7)">`;
    // Linhas
    pts.slice(1).forEach(([x, y], k) => {
      s += `<line x1="${pts[k][0]}" y1="${pts[k][1]}" x2="${x}" y2="${y}" stroke="${completa ? "#FDE047" : "#334155"}" stroke-width="${completa ? 1.4 : 0.8}"/>`;
    });
    // Estrelas
    pts.forEach(([x, y]) => {
      s += `<circle cx="${x}" cy="${y}" r="${completa ? 2.8 : 1.6}" fill="${completa ? "#FFE082" : "#475569"}"/>`;
    });
    s += `<text x="58" y="50" font-size="7" text-anchor="middle" fill="${completa ? "#FDE047" : "#64748B"}" font-family="serif">${esc(nome)}</text>`;
    s += `</g>`;
  });
  s += `</svg>`;
  return s;
}

ACOES_EXTRAS["feit-abrir-mapa-ceu"] = () => {
  const d = dadosFeit();
  const modal = document.createElement("div");
  modal.className = "modal-fundo feit-modal-ceu";
  modal.innerHTML = `<div class="modal card" style="max-width:380px">
    <div class="row" style="justify-content:space-between;align-items:center">
      <b>✦ Planetário da Torre</b>
      <button class="btn icon small" data-act="feit-fechar-modal">✕</button>
    </div>
    <span class="note" style="margin-bottom:8px">Constelações completadas: <b>${(d.ceu.mapa || []).length} de ${CONSTELACOES.length}</b></span>
    ${mapaDoCeuCompletoSVG()}
    <button class="btn small primary" style="margin-top:10px" data-act="feit-fechar-modal">Fechar Planetário</button>
  </div>`;
  document.body.appendChild(modal);
};

ACOES_EXTRAS["feit-fechar-modal"] = b => {
  const m = b.closest(".modal-fundo");
  if (m) m.remove();
};

/* 16. Poção do mascote brilha com a meta batida */
function conferirBrilhoPocaoHero() {
  if (typeof S === "undefined" || S.persona !== "feiticeiro") return;
  const bateu = (S.water || 0) >= (S.waterGoal || 2000);
  const hero = document.querySelector(".herobox");
  if (hero) hero.classList.toggle("pocao-brilhando", bateu);
}
document.addEventListener("DOMContentLoaded", conferirBrilhoPocaoHero);

/* 18. Som de Harpa ao concluir tarefa */
function somHarpaConcluir(ctx, saida, t) {
  // Arpejo de harpa celestial em 4 notas (C5, E5, G5, C6)
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    tocarTom(ctx, saida, t + i * 0.07, freq, 1.2, "sine", 0.06, 0.02);
    // Harmônico suave de corda
    tocarTom(ctx, saida, t + i * 0.07, freq * 2, 0.8, "triangle", 0.02, 0.01);
  });
}

/* 19. Coro suave ao completar constelação */
function somCoroConstelacao(ctx, saida, t = 0) {
  // Acorde místico de coro com 3 vozes
  [392, 493.88, 587.33].forEach(freq => {
    tocarTom(ctx, saida, t, freq, 2.5, "sine", 0.07, 0.3);
    tocarTom(ctx, saida, t + 0.1, freq * 1.5, 2.2, "sine", 0.03, 0.2);
  });
}

/* Atualiza os ganchos de som no feiticeiro */
if (typeof SONS_MUNDO !== "undefined" && SONS_MUNDO.feiticeiro) {
  SONS_MUNDO.feiticeiro.concluir = (ctx, saida, t) => {
    somHarpaConcluir(ctx, saida, t);
    // sino cristalino no topo
    tocarTom(ctx, saida, t + 0.28, 2093, 0.6, "sine", 0.04, 0.01);
  };

  /* 20. Som ambiente de biblioteca: lareira, páginas virando e coruja */
  SONS_MUNDO.feiticeiro.ambiente = ctx => {
    return ambienteComposto(ctx, { freq: 1100, tipo: "lowpass", vol: 0.04, onda: 0.06 }, [
      // Estalos de lareira
      [(c, s, t) => rajada(c, s, t, 0.06, 3200, "bandpass", 0.09, 0.9), 1200, 3800],
      // Página de livro virando
      [(c, s, t) => rajada(c, s, t, 0.2, 1400, "lowpass", 0.1, 1.2), 8000, 18000],
      // Pio de coruja suave ao longe
      [
        (c, s, t) => {
          tocarTom(c, s, t, 440, 0.4, "sine", 0.04, 0.1);
          tocarTom(c, s, t + 0.3, 330, 0.6, "sine", 0.05, 0.1);
        },
        16000,
        28000
      ]
    ]);
  };
}

/* Adiciona o botão do mapa do céu e gancho de runas ao concluir */
if (typeof MUNDO_FX !== "undefined" && MUNDO_FX.feiticeiro) {
  const antigoAoConcluirLote1 = MUNDO_FX.feiticeiro.aoConcluir;
  MUNDO_FX.feiticeiro.aoConcluir = (tarefa, b) => {
    if (typeof antigoAoConcluirLote1 === "function") antigoAoConcluirLote1(tarefa, b);
    if (b) efeitoRunasTarefa(b.closest(".card") || b);
  };
}

/* =========================================================
   FEITICEIRO: LOTE 3 (ITENS 21 A 30)
   ========================================================= */

/* 24. Títulos novos e títulos secretos */
function titulosSecretosDesbloqueados() {
  const d = dadosFeit();
  if (!Array.isArray(d.titulosSecretos)) d.titulosSecretos = [];
  return d.titulosSecretos;
}

function desbloquearTituloSecreto(id) {
  const d = dadosFeit();
  if (!Array.isArray(d.titulosSecretos)) d.titulosSecretos = [];
  if (!d.titulosSecretos.includes(id)) {
    d.titulosSecretos.push(id);
    commit();
    const sec = (typeof TITULOS_SECRETOS !== "undefined" ? TITULOS_SECRETOS : []).find(t => t.id === id);
    if (sec && typeof notificar === "function") {
      notificar({
        titulo: "Título Secreto Desbloqueado! ✦",
        texto: `Você conquistou: "${sec.titulo}"`,
        tipo: "conquista",
        mood: "party"
      });
    }
  }
}

/* 25. Selos mágicos colecionáveis por conquista */
const SELOS_MAGICOS = [
  { id: "selo_iniciado", nome: "Selo do Aprendiz", icone: "✦", desc: "Completou o primeiro ritual." },
  { id: "selo_fogo", nome: "Selo do Fogo", icone: "🔥", desc: "Concluiu tarefas na escola do fogo." },
  { id: "selo_gelo", nome: "Selo do Gelo", icone: "❄️", desc: "Manteve foco na escola do gelo." },
  { id: "selo_estrela", nome: "Selo Estelar", icone: "⭐", desc: "Completou uma constelação inteira." },
  { id: "selo_tempo", nome: "Selo do Tempo", icone: "⌛", desc: "Atingiu 50 minutos de estudo contínuo." }
];

function selosMagicosDesbloqueados() {
  const d = dadosFeit();
  if (!Array.isArray(d.selos)) d.selos = [];
  return d.selos;
}

function desbloquearSeloMagico(id) {
  const d = dadosFeit();
  if (!Array.isArray(d.selos)) d.selos = [];
  if (!d.selos.includes(id)) {
    d.selos.push(id);
    commit();
    const selo = SELOS_MAGICOS.find(s => s.id === id);
    if (selo && typeof notificar === "function") {
      notificar({
        titulo: "Novo Selo Mágico! ✦",
        texto: `Você obteve o ${selo.nome} (${selo.icone}).`,
        tipo: "conquista",
        mood: "party"
      });
    }
  }
}

/* 26. Academia com amigos (quem faz mais feitiços vira diretor) */
function rankingAcademiaFeiticeiro() {
  const d = dadosFeit();
  const feitosVc = d.feiticos || 0;
  const lista = [{ nome: (typeof S !== "undefined" && S.name) || "Você", feitiços: feitosVc, eVoce: true }];
  if (typeof S !== "undefined" && Array.isArray(S.friends) && S.friends.length) {
    S.friends.forEach(f => {
      lista.push({ nome: f.nome || f.name || "Mago Amigo", feitiços: f.feitosSemana || 5, eVoce: false });
    });
  } else {
    // Membros fictícios da academia para ranking dinâmico
    lista.push({ nome: "Mestre Elion", feitiços: 14, eVoce: false });
    lista.push({ nome: "Aluna Lyra", feitiços: 8, eVoce: false });
  }
  lista.sort((a, b) => b.feitiços - a.feitiços);
  lista.forEach((item, idx) => {
    item.posicao = idx + 1;
    item.diretor = idx === 0;
  });
  return lista;
}

/* 27. Mandar feitiço de ânimo para amigos pela caixa */
function mandarFeiticoAnimo(paraNome = "Amigo") {
  if (typeof S === "undefined") return;
  if (!Array.isArray(S.notifs)) S.notifs = [];
  S.notifs.unshift({
    id: "feit_animo_" + Date.now(),
    tipo: "feitico_animo",
    d: today(),
    de: S.name || "Feiticeiro",
    texto: `✦ Um feitiço de ânimo e clareza enviado para ${paraNome}!`
  });
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Feitiço de Ânimo Enviado! ✨",
      texto: `Sua energia mágica chegou até ${paraNome}.`,
      tipo: "social",
      mood: "happy"
    });
  }
}

ACOES_EXTRAS["feit-mandar-animo"] = () => {
  const nome = (typeof S !== "undefined" && S.pair && S.pair.name) || "seu amigo";
  mandarFeiticoAnimo(nome);
  render();
};

/* 28. Pet com chapéu de mago e faíscas ao pular */
function efeitoPetFaiscas(petEl) {
  if (RM || !petEl) return;
  for (let i = 0; i < 4; i++) {
    const s = document.createElement("span");
    s.className = "feit-pet-faisca";
    s.textContent = "✦";
    s.style.setProperty("--tx", `${(Math.random() - 0.5) * 32}px`);
    s.style.setProperty("--ty", `${-12 - Math.random() * 20}px`);
    s.style.left = "50%";
    s.style.top = "20%";
    petEl.style.position = "relative";
    petEl.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
}

/* 30. Moldura de pergaminho no Fotolog */
if (typeof MUNDO_FX !== "undefined" && MUNDO_FX.feiticeiro) {
  MUNDO_FX.feiticeiro.molduraFotolog = () => "feit-moldura-pergaminho";
}

/* Atualiza o cartão do Hoje com a Academia e Selos Mágicos */
if (typeof MUNDO_FX !== "undefined" && MUNDO_FX.feiticeiro) {
  const antigaSecaoHojeLote2 = MUNDO_FX.feiticeiro.secaoHoje;
  MUNDO_FX.feiticeiro.secaoHoje = () => {
    let html = "";
    if (typeof antigaSecaoHojeLote2 === "function") {
      html += antigaSecaoHojeLote2();
    }
    const ranking = rankingAcademiaFeiticeiro();
    const diretor = ranking.find(r => r.diretor);
    const selos = selosMagicosDesbloqueados();

    html += cartaoMundo(
      "cm-academia-amigos",
      "Academia Arcana",
      `Diretor da Semana: ${esc(diretor ? diretor.nome : "Você")}`,
      `<div class="note" style="margin-bottom:8px">Lançamento semanal de feitiços entre aprendizes e mestres.</div>
      <div class="row" style="gap:6px;margin-bottom:8px">
        ${ranking
          .slice(0, 3)
          .map(
            r =>
              `<div class="card sub sunken" style="flex:1;padding:6px;font-size:11px;text-align:center">
                <b>${r.posicao}º ${esc(r.nome)}</b><br>
                <span>${r.feitiços} feitiços</span>
                ${r.diretor ? '<div style="color:#F59E0B;font-weight:bold;font-size:10px">👑 Diretor</div>' : ""}
              </div>`
          )
          .join("")}
      </div>
      <div class="row" style="gap:6px">
        <button class="btn small" data-act="feit-mandar-animo">✨ Mandar Feitiço de Ânimo</button>
        <button class="btn small primary" data-act="feit-abrir-mapa-ceu">✦ Ver Planetário</button>
      </div>`
    );

    html += cartaoMundo(
      "cm-selos-magicos",
      "Selos Mágicos Colecionáveis",
      `${selos.length} de ${SELOS_MAGICOS.length} selos`,
      `<div class="row" style="gap:8px;flex-wrap:wrap">
        ${SELOS_MAGICOS.map(s => {
          const tem = selos.includes(s.id);
          return `<div class="card sub ${tem ? "" : "sunken"}" style="padding:6px 10px;text-align:center;opacity:${tem ? "1" : "0.45"}">
            <span style="font-size:16px">${s.icone}</span><br>
            <b style="font-size:10px">${esc(s.nome)}</b>
          </div>`;
        }).join("")}
      </div>`
    );

    /* 31. Componentes de feitiço */
    const comp = atualizarComponentesHabitos();
    html += cartaoMundo(
      "cm-componentes-magicos",
      "Bolsa de Componentes",
      "Ingredientes colhidos dos rituais diários",
      `<div class="row" style="gap:8px;text-align:center">
        <div class="card sub sunken" style="flex:1;padding:6px">⭐ <b>${comp.poEstrela || 0}</b><br><span style="font-size:10px">Pó de Estrela</span></div>
        <div class="card sub sunken" style="flex:1;padding:6px">🪶 <b>${comp.penaArcana || 0}</b><br><span style="font-size:10px">Pena Arcana</span></div>
        <div class="card sub sunken" style="flex:1;padding:6px">🔮 <b>${comp.cristalMana || 0}</b><br><span style="font-size:10px">Cristal de Mana</span></div>
      </div>`
    );

    /* 35. Chuva de meteoros rara */
    const meteoro = chuvaMeteoroAtiva();
    if (meteoro) {
      html += cartaoMundo(
        "cm-meteoro-raro",
        "Fenômeno Celestial Ativo! ☄️",
        `Chuva de ${esc(meteoro.nome)}`,
        `<div class="note">As estrelas cadentes revelaram a constelação rara <b>${esc(meteoro.constelacao)}</b>. Concentre-se nos feitiços de hoje para sintonizar a energia do cosmos!</div>`
      );
    }

    return html;
  };
}

/* =========================================================
   FEITICEIRO: LOTE 4 (ITENS 31 A 40)
   ========================================================= */

/* 31. Componentes de feitiço por hábitos */
function atualizarComponentesHabitos() {
  const d = dadosFeit();
  if (!d.componentes || typeof d.componentes !== "object") {
    d.componentes = { poEstrela: 0, penaArcana: 0, cristalMana: 0, habitosVistos: {} };
  }
  if (!d.componentes.habitosVistos) d.componentes.habitosVistos = {};
  if (typeof S === "undefined" || !Array.isArray(S.habits)) return d.componentes;

  const feitos = S.habits.filter(h => typeof habitDone === "function" && habitDone(h, today()));
  feitos.forEach((h, i) => {
    const chave = `${today()}_${h.id}`;
    if (!d.componentes.habitosVistos[chave]) {
      d.componentes.habitosVistos[chave] = true;
      const tipos = ["poEstrela", "penaArcana", "cristalMana"];
      const sorteado = tipos[i % tipos.length];
      d.componentes[sorteado] = (d.componentes[sorteado] || 0) + 1;
    }
  });
  return d.componentes;
}

/* 32. Feitiço Tempus: adiar 1x na semana sem quebrar sequência */
function podeUsarTempus() {
  const d = dadosFeit();
  const semana = typeof weekOf === "function" ? weekOf(today()) : today().slice(0, 7);
  return d.ultimoTempusSemana !== semana;
}

function usarTempusAdiar(tarefaId) {
  if (!podeUsarTempus()) return false;
  const t = typeof S !== "undefined" && Array.isArray(S.tasks) && S.tasks.find(x => x.id === tarefaId);
  if (!t) return false;
  const d = dadosFeit();
  d.ultimoTempusSemana = typeof weekOf === "function" ? weekOf(today()) : today().slice(0, 7);
  t.date = typeof addDays === "function" ? addDays(today(), 1) : today();
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Feitiço Tempus Lançado! ⌛",
      texto: "A tarefa foi adiada sem quebrar sua sequência arcana.",
      tipo: "sucesso",
      mood: "party"
    });
  }
  return true;
}

ACOES_EXTRAS["feit-tempus-adiar"] = (b, id) => {
  usarTempusAdiar(id);
  render();
};

/* 33. Exames da academia de magia */
function examesAcademia() {
  if (typeof S === "undefined" || !S.estudos || !Array.isArray(S.estudos.provas)) return [];
  return S.estudos.provas.map(p => {
    const minEstudados = (S.sessions || [])
      .filter(s => s.materia === p.materia)
      .reduce((acc, cur) => acc + (cur.min || 0), 0);
    const metaMin = (p.metaHoras || 10) * 60;
    const notaPreparacao = Math.min(100, Math.round((minEstudados / metaMin) * 100));
    return {
      ...p,
      notaPreparacao,
      classificacao:
        notaPreparacao >= 90
          ? "Arquimago (S)"
          : notaPreparacao >= 70
            ? "Adepto (A)"
            : notaPreparacao >= 50
              ? "Iniciado (B)"
              : "Aprendiz (C)"
    };
  });
}

/* 34. Ampulheta no foco */
function ampulhetaFocoSVG(fracao = 0.5) {
  const f = Math.max(0, Math.min(1, fracao));
  const baseH = f * 16;
  return `<svg viewBox="0 0 48 64" class="feit-ampulheta-svg" width="48" height="64">
    <rect x="6" y="4" width="36" height="4" rx="1.5" fill="#C9A646"/>
    <rect x="6" y="56" width="36" height="4" rx="1.5" fill="#C9A646"/>
    <path d="M10 8V56M38 8V56" stroke="#8C5A1E" stroke-width="2"/>
    <path d="M12 8C12 24 22 28 22 32C22 36 12 40 12 56H36C36 40 26 36 26 32C26 28 36 24 36 8Z" fill="#E0F2FE" fill-opacity=".25" stroke="#CA8A04" stroke-width="1.4"/>
    <path d="M14 8C14 20 22 25 24 28C26 25 34 20 34 8Z" fill="#FDE047" opacity="${Math.max(0.1, 1 - f * 0.9)}"/>
    <line x1="24" y1="28" x2="24" y2="48" stroke="#FDE047" stroke-width="1.2" stroke-dasharray="2 2"/>
    <path d="M14 56C14 50 18 ${56 - baseH} 24 ${56 - baseH}C30 ${56 - baseH} 34 50 34 56Z" fill="#FDE047"/>
  </svg>`;
}

/* 35. Chuvas de meteoros reais e constelações raras */
const METEOROS_REAIS = [
  { id: "lyrid", nome: "Líridas", mesDia: "04-22", constelacao: "Líra Celeste" },
  { id: "perseid", nome: "Perseidas", mesDia: "08-12", constelacao: "Pégaso Cintilante" },
  { id: "orionid", nome: "Orionídeas", mesDia: "10-21", constelacao: "Caçador Astral" },
  { id: "geminid", nome: "Geminídeas", mesDia: "12-14", constelacao: "Gêmeos do Vácuo" }
];

function chuvaMeteoroAtiva(dataStr = today()) {
  const md = dataStr.slice(5);
  return (
    METEOROS_REAIS.find(m => {
      return typeof diffDays === "function" && Math.abs(diffDays(`2026-${m.mesDia}`, `2026-${md}`)) <= 3;
    }) || null
  );
}

/* 36. Diário do mago com páginas do grimório */
function paginasDiarioMago() {
  if (typeof S === "undefined" || !S.diario) return [];
  const entradas = Object.entries(S.diario)
    .filter(([_, txt]) => txt && txt.trim())
    .sort(([d1], [d2]) => d2.localeCompare(d1));
  return entradas.map(([data, texto], idx) => ({
    pagina: idx + 1,
    data,
    texto
  }));
}

/* 37. Selo de cera no cartão do Prumi */
function enfeiteSeloCeraSVG() {
  return `<div class="feit-selo-cera" title="Selo do Arquimago">
    <svg viewBox="0 0 28 28" width="28" height="28">
      <circle cx="14" cy="14" r="12" fill="#B91C1C" stroke="#7F1D1D" stroke-width="1.5"/>
      <path d="M14 6L16 11L21 11L17 14L19 19L14 16L9 19L11 14L7 11L12 11Z" fill="#FDE047"/>
    </svg>
  </div>`;
}

/* 38. Velas flutuantes no cabeçalho */
function velasCabecalhoSVG(feitas = 0, total = 5) {
  const n = Math.min(7, Math.max(3, total || 5));
  let s = `<div class="feit-velas-cabecalho" style="display:flex;gap:6px;align-items:center;justify-content:center;margin:4px 0">`;
  for (let i = 0; i < n; i++) {
    const acesa = i < feitas;
    s += `<svg viewBox="0 0 16 26" width="16" height="26" class="feit-vela-item ${acesa ? "acesa" : "apagada"}">
      <rect x="4" y="10" width="8" height="14" rx="1.5" fill="${acesa ? "#FEF08A" : "#64748B"}" stroke="${acesa ? "#CA8A04" : "#334155"}" stroke-width="0.8"/>
      <path d="M8 10V7" stroke="#334155" stroke-width="1"/>
      ${acesa ? `<ellipse cx="8" cy="4.5" rx="2.5" ry="4" fill="#F97316" class="brilhinho"/><ellipse cx="8" cy="5" rx="1.2" ry="2.2" fill="#FEF08A"/>` : ""}
    </svg>`;
  }
  s += `</div>`;
  return s;
}

/* 39. Desenrolar de pergaminho ao subir de título */
function desenrolarPergaminhoNovoTitulo(novoTitulo) {
  if (RM) return;
  const overlay = document.createElement("div");
  overlay.className = "modal-fundo feit-modal-pergaminho";
  overlay.innerHTML = `<div class="feit-pergaminho-desenrola card">
    <div style="font-weight:bold;letter-spacing:1px;font-size:11px;margin-bottom:6px">✦ DECRETO DA TORRE ✦</div>
    <div style="margin:8px 0">
      <p style="font-size:12px;margin:4px 0">Pelo poder das estrelas e do grimório sagrado:</p>
      <h2 style="font-family:'Cinzel Decorative',serif;color:#B45309;margin:8px 0">${esc(novoTitulo)}</h2>
      <p class="note" style="font-size:11px">Um novo escalão de sabedoria foi alcançado.</p>
    </div>
    <button class="btn small primary" data-act="feit-fechar-modal" style="margin-top:10px">Aceitar Título</button>
  </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("ativo"), 30);
}

/* 40. Tarefas petrificadas (atrasadas) */
function marcarTarefasPetrificadas() {
  if (typeof S === "undefined" || S.persona !== "feiticeiro") return;
  const elCards = document.querySelectorAll(".card.tarefa");
  elCards.forEach(card => {
    if (card.classList.contains("atrasada")) {
      card.classList.add("tarefa-petrificada");
    }
  });
}
document.addEventListener("DOMContentLoaded", marcarTarefasPetrificadas);

/* Conecta selo de cera e velas flutuantes no enfeiteHero */
if (typeof MUNDO_FX !== "undefined" && MUNDO_FX.feiticeiro) {
  const antigoEnfeite = MUNDO_FX.feiticeiro.enfeiteHero;
  MUNDO_FX.feiticeiro.enfeiteHero = () => {
    const base = typeof antigoEnfeite === "function" ? antigoEnfeite() : "";
    const feitas =
      (typeof S !== "undefined" &&
        Array.isArray(S.tasks) &&
        S.tasks.filter(t => t.done && t.date === today()).length) ||
      0;
    const total =
      (typeof S !== "undefined" &&
        Array.isArray(S.tasks) &&
        S.tasks.filter(t => t.date === today()).length) ||
      5;
    return base + enfeiteSeloCeraSVG() + velasCabecalhoSVG(feitas, total);
  };
}

/* =========================================================
   FEITICEIRO: LOTE 5 (ITENS 41 A 50)
   ========================================================= */

/* 41. Som de varinha (brilho subindo) ao abrir o app */
function somVarinhaAbrir(ctx, saida, t = 0) {
  if (!ctx || !saida) return;
  [1046.5, 1318.5, 1567.98, 2093.0, 2637.0].forEach((freq, idx) => {
    tocarTom(ctx, saida, t + idx * 0.05, freq, 0.4, "sine", 0.05, 0.01);
  });
}
if (typeof SONS_MUNDO !== "undefined" && SONS_MUNDO.feiticeiro) {
  SONS_MUNDO.feiticeiro.abrir = somVarinhaAbrir;
}

/* 42. Gongo místico ao subir de título */
function somGongoMistico(ctx, saida, t = 0) {
  if (!ctx || !saida) return;
  tocarTom(ctx, saida, t, 110, 3.2, "sine", 0.12, 0.4);
  tocarTom(ctx, saida, t + 0.02, 220, 2.5, "triangle", 0.08, 0.2);
  tocarTom(ctx, saida, t + 0.05, 440, 1.8, "sine", 0.04, 0.1);
}

/* 43. Conquistas do mundo Feiticeiro */
const ACHS_FEITICEIRO = [
  {
    id: "feit_primeira_constelacao",
    nome: "Primeira constelação",
    desc: "Completou uma constelação inteira no céu.",
    goal: 1,
    cur: () => (dadosFeit().ceu.mapa || []).length
  },
  {
    id: "feit_torre_10_andares",
    nome: "Torre de 10 andares",
    desc: "Evoluiu a torre até alcançar 10 andares.",
    goal: 10,
    cur: () => Math.floor((dadosFeit().feiticos || 0) / 10) + 1
  },
  {
    id: "feit_grimorio_completo",
    nome: "Grimório completo",
    desc: "Lançou 120 feitiços nas artes arcanas.",
    goal: 120,
    cur: () => dadosFeit().feiticos || 0
  }
];

function checarConquistasFeiticeiro() {
  const d = dadosFeit();
  if (!Array.isArray(d.conquistas)) d.conquistas = [];
  ACHS_FEITICEIRO.forEach(ach => {
    if (!d.conquistas.includes(ach.id) && ach.cur() >= ach.goal) {
      d.conquistas.push(ach.id);
      commit();
      if (typeof notificar === "function") {
        notificar({
          titulo: "Conquista Arcana Desbloqueada! ✦",
          texto: `${ach.nome}: ${ach.desc}`,
          tipo: "conquista",
          mood: "party"
        });
      }
    }
  });
  return d.conquistas;
}

/* 44. Varinhas colecionáveis por madeira e núcleo */
const MADEIRAS_VARINHA = ["Sabugueiro", "Carvalho Antigo", "Ébano Puro", "Cerejeira", "Freixo Sagrado"];
const NUCLEOS_VARINHA = [
  "Fibra de Coração de Dragão",
  "Pena de Fênix",
  "Pelo de Unicórnio",
  "Pó de Estrela Cadente"
];

function forjarVarinhaFeiticeiro() {
  const d = dadosFeit();
  if (!Array.isArray(d.varinhasColecao)) d.varinhasColecao = [];
  const madeira = MADEIRAS_VARINHA[Math.floor(Math.random() * MADEIRAS_VARINHA.length)];
  const nucleo = NUCLEOS_VARINHA[Math.floor(Math.random() * NUCLEOS_VARINHA.length)];
  const comp = 25 + Math.floor(Math.random() * 10);
  const varinha = { id: "var_" + Date.now(), madeira, nucleo, comp: `${comp} cm`, data: today() };
  d.varinhasColecao.unshift(varinha);
  if (d.varinhasColecao.length > 6) d.varinhasColecao.pop();
  commit();
  if (typeof notificar === "function") {
    notificar({
      titulo: "Varinha Forjada! ✨",
      texto: `${madeira} com ${nucleo} (${comp} cm).`,
      tipo: "conquista",
      mood: "happy"
    });
  }
  return varinha;
}

ACOES_EXTRAS["feit-forjar-varinha"] = () => {
  forjarVarinhaFeiticeiro();
  render();
};

/* 46. Cartões de constelação para o perfil */
function cartoesConstelacaoPerfil() {
  const d = dadosFeit();
  const mapa = d.ceu.mapa || [];
  return mapa.map(idx => {
    const nome = CONSTELACOES[idx % CONSTELACOES.length];
    return {
      idx,
      nome,
      svg: constelacaoSVG(idx, 7)
    };
  });
}

/* 47. Duelo amistoso entre amigos */
function dueloAmistosoFeiticeiro(amigoNome = "Mago Convidado") {
  const feitosHoje =
    (typeof S !== "undefined" &&
      Array.isArray(S.tasks) &&
      S.tasks.filter(t => t.done && t.date === today()).length) ||
    0;
  const feitosAmigo = Math.floor(Math.random() * 4) + 1;
  const vencedor = feitosHoje >= feitosAmigo ? "Você" : amigoNome;
  return {
    amigo: amigoNome,
    voceFeitos: feitosHoje,
    amigoFeitos: feitosAmigo,
    vencedor,
    empate: feitosHoje === feitosAmigo
  };
}

/* 48. Biblioteca compartilhada com amigos */
function bibliotecaCompartilhadaHTML() {
  const meusLivros =
    (typeof S !== "undefined" && Array.isArray(S.livros) && S.livros.filter(l => l.estante === "lido")) || [];
  let lista = meusLivros.map(l => ({
    titulo: l.titulo || "Tomo Antigo",
    dono: (typeof S !== "undefined" && S.name) || "Você"
  }));
  if (typeof S !== "undefined" && Array.isArray(S.friends) && S.friends.length) {
    S.friends.forEach(f => {
      if (Array.isArray(f.livrosLidos)) {
        f.livrosLidos.forEach(t => lista.push({ titulo: t, dono: f.nome || "Amigo" }));
      }
    });
  } else {
    lista.push({ titulo: "Crônicas de Arcádia", dono: "Mestre Elion" });
    lista.push({ titulo: "Astrologia dos Antigos", dono: "Aluna Lyra" });
  }
  return `<div class="feit-biblio-compartilhada" style="display:flex;gap:6px;flex-wrap:wrap">
    ${lista
      .slice(0, 8)
      .map(
        b =>
          `<div class="card sub sunken" style="padding:4px 8px;font-size:11px">📖 <b>${esc(b.titulo)}</b><br><span class="note">${esc(b.dono)}</span></div>`
      )
      .join("")}
  </div>`;
}

/* 49. Coruja-correio animada entregando mimos */
function animarCorujaCorreio() {
  if (RM) return;
  const coruja = document.createElement("div");
  coruja.className = "feit-coruja-correio";
  coruja.innerHTML = `<svg viewBox="0 0 40 32" width="40" height="32">
    <path d="M4 14Q14 2 26 10Q38 18 36 28Q22 28 4 14Z" fill="#8D6E63"/>
    <circle cx="28" cy="14" r="5" fill="#FFE082"/>
    <circle cx="28" cy="14" r="2" fill="#212121"/>
    <rect x="30" y="16" width="8" height="4" rx="1" fill="#FEF08A" stroke="#B45309" stroke-width="0.8"/>
  </svg>`;
  document.body.appendChild(coruja);
  setTimeout(() => coruja.remove(), 2500);
}

/* 50. Pet aprende o truque "levitar" */
function truquePetLevitar() {
  const petEl = document.querySelector(".pet-box, .pet-canvas, #pet");
  if (petEl) {
    petEl.classList.add("feit-pet-levitando");
    setTimeout(() => petEl.classList.remove("feit-pet-levitando"), 3000);
  }
  if (typeof notificar === "function") {
    notificar({
      titulo: "Truque: Levitar! 🔮",
      texto: "Seu familiar está flutuando suavemente pelo ar.",
      tipo: "sucesso",
      mood: "party"
    });
  }
}
ACOES_EXTRAS["feit-pet-levitar"] = () => {
  truquePetLevitar();
};
