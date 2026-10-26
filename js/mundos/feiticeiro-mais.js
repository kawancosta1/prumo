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
