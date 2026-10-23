/*
  Mundo Roqueiro, parte 2:
  - guarda-roupa extra (bottons, pulseiras, fios, colares, bocas, maquiagem e companheiros);
  - Setlist com bis: tarefas numeradas como faixas do show; concluiu tudo, a plateia pede bis (tarefa bônus, gotas em dobro);
  - Ensaio relâmpago: minijogo de ritmo de 30 segundos, uma vez por dia valendo gotas;
  - Sua banda: amigos viram bateria, baixo, guitarra base e teclado no palco;
  - Ingressos: cada semana com 5 ou mais shows vira um ingresso colecionável (aparece no perfil).
  Os dados ficam em S.rock (normalizados em js/estado.js). Regra: nada de banda real, tudo inventado.
*/
"use strict";

/* ===================== guarda-roupa extra ===================== */
const bottonRedondo = (x, y, fundo, borda, desenho) =>
  `<g transform="translate(${x} ${y})"><circle r="5.4" fill="${fundo}" stroke="${borda}" stroke-width=".9"/>${desenho}<path d="M-3.4 -2.6A4.2 4.2 0 0 1 0.4 -4.2" stroke="#fff" stroke-width=".8" fill="none" opacity=".6" stroke-linecap="round"/></g>`;

/** Estrela de 5 pontas com contorno fino (a star5 de roupas-base.js tem contorno grosso para itens grandes). */
const estrelinha = (cx, cy, r, c, contorno = 0.7) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      rr = i % 2 ? r * 0.45 : r;
    d += (i ? "L" : "M") + (cx + Math.cos(a) * rr).toFixed(1) + " " + (cy + Math.sin(a) * rr).toFixed(1);
  }
  return `<path d="${d}Z" fill="${c}" stroke="#141416" stroke-width="${contorno}" stroke-linejoin="round"/>`;
};

ITEMS.push(
  /* ---------- bottons ---------- */
  {
    id: "rock_botton_caveira",
    p: "rock",
    slot: "pins",
    name: "Botton de caveirinha",
    price: 50,
    svg: () =>
      bottonRedondo(
        47,
        103,
        "#141416",
        "#F2F2F2",
        `<path d="M-2.8 0.6A2.8 2.8 0 1 1 2.8 0.6V2.4H-2.8Z" fill="#F2F2F2"/><circle cx="-1.1" cy="-.2" r=".75" fill="#141416"/><circle cx="1.1" cy="-.2" r=".75" fill="#141416"/><path d="M-1 2.4V3.4M0 2.4V3.4M1 2.4V3.4" stroke="#F2F2F2" stroke-width=".5"/>`
      )
  },
  {
    id: "rock_bottons_trastes",
    p: "rock",
    slot: "pins",
    name: "Bottons dos 5 trastes",
    price: 70,
    svg: () =>
      TRASTES.map((c, i) => {
        const x = 46 + i * 7,
          y = 104 + Math.abs(i - 2) * 1.2;
        return `<circle cx="${x}" cy="${y.toFixed(1)}" r="2.9" fill="${c}" stroke="#141416" stroke-width=".7"/><circle cx="${x - 0.9}" cy="${(y - 0.9).toFixed(1)}" r=".8" fill="#fff" opacity=".7"/>`;
      }).join("")
  },
  {
    id: "rock_botton_vinil",
    p: "rock",
    slot: "pins",
    name: "Botton de vinil",
    price: 50,
    svg: () =>
      bottonRedondo(
        73,
        102,
        "#141416",
        "#2B2B33",
        `<circle r="3.6" fill="none" stroke="#3A3A44" stroke-width=".5"/><circle r="2.2" fill="#E0312F"/><circle r=".5" fill="#F2F2F2"/>`
      )
  },
  {
    id: "rock_botton_estrela",
    p: "rock",
    slot: "pins",
    name: "Botton de estrela do rock",
    price: 60,
    svg: () => bottonRedondo(70, 110, "#2F6FD6", "#141416", estrelinha(0, 0.4, 3.6, "#F2C318", 0.5))
  },

  /* ---------- pulso ---------- */
  {
    id: "rock_pulseira_tachas",
    p: "rock",
    slot: "wrist",
    name: "Pulseira de couro com tachas",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6.5" y="-3.6" width="13" height="7.2" rx="2" fill="#5A3A22" stroke="#141416" stroke-width=".8"/>${[-3.6, 0, 3.6].map(i => `<circle cx="${i}" cy="0" r="1.25" fill="#D9DDE3" stroke="#6E6C78" stroke-width=".4"/>`).join("")}`
      )
  },
  {
    id: "rock_pulseiras_borracha",
    p: "rock",
    slot: "wrist",
    name: "Pulseiras de borracha",
    price: 40,
    svg: (x, y) =>
      H(
        x,
        y,
        ["#2FB344", "#E0312F", "#F2C318"]
          .map(
            (c, i) =>
              `<rect x="-6.2" y="${-4.6 + i * 3}" width="12.4" height="2.6" rx="1.3" fill="${c}" stroke="#141416" stroke-width=".5" transform="rotate(${(i - 1) * 6})"/>`
          )
          .join("")
      )
  },
  {
    id: "rock_pulseira_vip",
    p: "rock",
    slot: "wrist",
    name: "Pulseira VIP do festival",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6.2" y="-2.6" width="12.4" height="5.2" rx="1.4" fill="#F07A1A" stroke="#141416" stroke-width=".7"/><path d="M-6 0H6" stroke="#FFD08A" stroke-width=".6" stroke-dasharray="1.4 1"/><rect x="3.4" y="1.8" width="5" height="6.4" rx="1" fill="#F2F2F2" stroke="#141416" stroke-width=".6" transform="rotate(14 5.9 5)"/><path d="M4.6 4.2H7.4M4.6 5.8H6.8" stroke="#141416" stroke-width=".5" transform="rotate(14 5.9 5)"/>`
      )
  },

  /* ---------- fio ---------- */
  {
    id: "rock_fio_corrente_palheta",
    p: "rock",
    slot: "string",
    name: "Corrente com palheta",
    price: 80,
    svg: () => {
      let elos = "";
      for (let i = 0, y = -40; y < 19; i++, y += 3.3)
        elos +=
          i % 2
            ? `<rect x="59.4" y="${(y - 0.6).toFixed(1)}" width="1.2" height="4.5" rx=".6" fill="#8E7A3E"/>`
            : `<ellipse cx="60" cy="${(y + 1.6).toFixed(1)}" rx="1.7" ry="2.35" fill="none" stroke="#E8C24A" stroke-width="1.1"/>`;
      return (
        elos +
        `<path d="M60 -8L63.5 -6" stroke="#E8C24A" stroke-width=".8"/>` +
        palheta(66, -3, "#E0312F", 0.9)
      );
    }
  },
  {
    id: "rock_fio_espiral",
    p: "rock",
    slot: "string",
    name: "Cabo espiral de estúdio",
    price: 70,
    svg: () => {
      let voltas = "";
      for (let y = -40; y < 16; y += 2.6)
        voltas += `<path d="M57 ${y.toFixed(1)}Q60 ${(y - 1.6).toFixed(1)} 63 ${y.toFixed(1)}Q60 ${(y + 2.2).toFixed(1)} 57 ${(y + 2.6).toFixed(1)}" fill="none" stroke="#141416" stroke-width="1.2"/>`;
      return (
        voltas +
        `<path d="M57 ${(16).toFixed(1)}Q60 17 60 19" fill="none" stroke="#141416" stroke-width="1.2"/>`
      );
    }
  },
  {
    id: "rock_fio_corda_violao",
    p: "rock",
    slot: "string",
    name: "Corda de violão",
    price: 50,
    svg: () =>
      `<line x1="60" y1="-40" x2="60" y2="17" stroke="#C9A06A" stroke-width="1.3"/><line x1="60" y1="-40" x2="60" y2="17" stroke="#8C6A3A" stroke-width="1.3" stroke-dasharray=".4 .8" opacity=".7"/><circle cx="60" cy="17.6" r="1.6" fill="#C9A06A" stroke="#6E4E26" stroke-width=".5"/>`
  },

  /* ---------- pescoço ---------- */
  {
    id: "rock_cracha_backstage",
    p: "rock",
    slot: "neck",
    name: "Crachá de backstage",
    price: 90,
    svg: () =>
      `<path d="M38 84L54 104M82 84L66 104" stroke="#E0312F" stroke-width="3" stroke-linecap="round"/><path d="M38 84L54 104M82 84L66 104" stroke="#141416" stroke-width=".7" stroke-dasharray="1.6 1.6"/><rect x="51" y="102" width="18" height="22" rx="2" fill="#F2F2F2" stroke="#141416" stroke-width="1.2"/><rect x="51" y="102" width="18" height="6" rx="2" fill="#141416"/><path d="M54 105H66" stroke="#F2C318" stroke-width="1.4"/><path d="M54 112H66M54 115.5H63M54 119H65" stroke="#8C8A96" stroke-width="1.1"/><circle cx="60" cy="102" r="1.2" fill="#C9CED6" stroke="#141416" stroke-width=".5"/>`
  },
  {
    id: "rock_colar_palheta",
    p: "rock",
    slot: "neck",
    name: "Colar de palheta gigante",
    price: 70,
    svg: () =>
      `<path d="M32 84Q60 104 88 84" fill="none" stroke="#141416" stroke-width="1.4"/>` +
      palheta(60, 102, "#F2C318", 1.9)
  },
  {
    id: "rock_gargantilha_argola",
    p: "rock",
    slot: "neck",
    name: "Gargantilha com argola",
    price: 60,
    svg: () =>
      `<path d="M30 84Q60 100 90 84" fill="none" stroke="#141416" stroke-width="5" stroke-linecap="round"/><path d="M30 84Q60 100 90 84" fill="none" stroke="#3A3A44" stroke-width="1" stroke-linecap="round"/><circle cx="60" cy="96.6" r="3.8" fill="none" stroke="#D9DDE3" stroke-width="1.6"/>`
  },

  /* ---------- boca ---------- */
  {
    id: "rock_palheta_boca",
    p: "rock",
    slot: "mouth",
    name: "Palheta na boca",
    price: 50,
    svg: m => {
      const a = mouthAt(m) || { y: 79, xs: [56, 64] };
      return `<g transform="rotate(-24 ${a.xs[1] + 2} ${a.y + 1})">${palheta(a.xs[1] + 2.6, a.y + 1.2, "#E0312F", 0.85)}</g>`;
    }
  },
  {
    id: "rock_piercing_labio",
    p: "rock",
    slot: "mouth",
    name: "Piercing no lábio",
    price: 60,
    svg: m => {
      const a = mouthAt(m) || { y: 79, xs: [56, 64] };
      const x = (a.xs[0] + a.xs[1]) / 2 - 2.6;
      return `<circle cx="${x}" cy="${a.y + 3.6}" r="1.7" fill="none" stroke="#D9DDE3" stroke-width="1.1"/><circle cx="${x + 1.5}" cy="${a.y + 2.6}" r=".6" fill="#D9DDE3"/>`;
    }
  },

  /* ---------- maquiagem ---------- */
  {
    id: "rock_glitter",
    p: "rock",
    slot: "cheek",
    name: "Estrelas de glitter",
    price: 50,
    svg: () =>
      estrelinha(32, 71, 3.4, "#F2C318") +
      estrelinha(88, 69, 2.8, "#F2C318") +
      estrelinha(84, 78, 2, "#8FD3FF", 0.5) +
      brilhinho(36, 79, 1.4, "#FFFFFF", 0.3)
  },
  {
    id: "rock_delineado",
    p: "rock",
    slot: "cheek",
    name: "Delineado borrado de show",
    price: 60,
    svg: () =>
      `<path d="M39 70Q47 74 55 70" fill="none" stroke="#141416" stroke-width="2.2" stroke-linecap="round" opacity=".55"/><path d="M65 70Q73 74 81 70" fill="none" stroke="#141416" stroke-width="2.2" stroke-linecap="round" opacity=".55"/><path d="M44 72Q44 78 45 82M76 72Q77 77 75 80" fill="none" stroke="#141416" stroke-width="1.3" stroke-linecap="round" opacity=".5"/>`
  },
  {
    id: "rock_listras_guerra",
    p: "rock",
    slot: "cheek",
    name: "Listras azuis no rosto",
    price: 50,
    svg: () =>
      `<path d="M28 69L40 67M29 74L41 72M80 67L92 69M79 72L91 74" stroke="#2F6FD6" stroke-width="2.4" stroke-linecap="round"/>`
  },

  /* ---------- companheiros ---------- */
  {
    id: "rock_pet_corvo",
    p: "rock",
    slot: "pet",
    name: "Corvo do palco",
    price: 120,
    svg: () =>
      `<g transform="translate(15 124)"><path d="M-2 10L-8 14M2 10L0 15" stroke="#3A3A44" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="0" cy="3" rx="8.4" ry="7" fill="#141416"/><path d="M-8 2Q-15 6 -12 10Q-6 8 -4 4Z" fill="#2B2B33"/><circle cx="4" cy="-5" r="5.6" fill="#141416"/><path d="M8.6 -6L14 -4.4L8.6 -2.8Z" fill="#8C8A96"/><circle cx="5.4" cy="-6.2" r="1.3" fill="#F2F2F2"/><circle cx="5.7" cy="-6.2" r=".6" fill="#141416"/><path d="M1 -10L2.6 -13L4 -10" fill="#141416"/></g>`
  },
  {
    id: "rock_pet_rato",
    p: "rock",
    slot: "pet",
    name: "Ratinho de estúdio",
    price: 100,
    svg: () =>
      `<g transform="translate(15 128)"><path d="M-8 6Q-16 6 -15 0" fill="none" stroke="#C9A6A6" stroke-width="1.3" stroke-linecap="round"/><ellipse cx="0" cy="3" rx="8" ry="6" fill="#A7A4B0" stroke="var(--ink)" stroke-width="1"/><circle cx="4" cy="-4" r="5" fill="#A7A4B0" stroke="var(--ink)" stroke-width="1"/><circle cx="0.6" cy="-8.4" r="2.6" fill="#E8B4C0" stroke="var(--ink)" stroke-width=".8"/><circle cx="7.6" cy="-8" r="2.6" fill="#E8B4C0" stroke="var(--ink)" stroke-width=".8"/><circle cx="5.6" cy="-4" r=".9" fill="#141416"/><circle cx="9" cy="-2.6" r="1" fill="#E07A9A"/><path d="M-0.6 -6Q4 -13 9 -6" fill="none" stroke="#141416" stroke-width="1.4"/><rect x="-2" y="-7" width="3" height="4.4" rx="1.2" fill="#E0312F" stroke="#141416" stroke-width=".6"/><rect x="7.6" y="-6.6" width="3" height="4.4" rx="1.2" fill="#E0312F" stroke="#141416" stroke-width=".6"/></g>`
  },
  {
    id: "rock_pet_tartaruga",
    p: "rock",
    slot: "pet",
    name: "Tartaruga de spikes",
    price: 110,
    svg: () =>
      `<g transform="translate(15 132)"><ellipse cx="-7" cy="5" rx="2.4" ry="1.8" fill="#6FB34F" stroke="var(--ink)" stroke-width=".8"/><ellipse cx="6" cy="5" rx="2.4" ry="1.8" fill="#6FB34F" stroke="var(--ink)" stroke-width=".8"/><circle cx="11" cy="0" r="3.6" fill="#6FB34F" stroke="var(--ink)" stroke-width=".9"/><circle cx="12.2" cy="-.8" r=".7" fill="#141416"/><path d="M-11 3A11 9 0 0 1 9 3Z" fill="#2E4A26" stroke="var(--ink)" stroke-width="1"/>${[-7, -2.5, 2, 6].map(x => `<path d="M${x - 1.6} ${-2 - Math.abs(x + 0.5) * -0.05}L${x} ${-6.5 + Math.abs(x + 0.5) * 0.28}L${x + 1.6} ${-2}Z" fill="#D9DDE3" stroke="#141416" stroke-width=".5"/>`).join("")}</g>`
  },
  {
    id: "rock_pet_papagaio",
    p: "rock",
    slot: "pet",
    name: "Papagaio vocalista",
    price: 130,
    svg: () =>
      `<g transform="translate(15 122)"><path d="M-3 9L-6 18L0 12L2 19L3 10Z" fill="#2F6FD6" stroke="var(--ink)" stroke-width=".8"/><ellipse cx="0" cy="3" rx="7.4" ry="8" fill="#2FB344" stroke="var(--ink)" stroke-width="1"/><path d="M-6 0Q-11 6 -6 10Q-3 6 -3 2Z" fill="#F2C318" stroke="var(--ink)" stroke-width=".7"/><circle cx="2" cy="-6" r="5.4" fill="#E0312F" stroke="var(--ink)" stroke-width="1"/><path d="M6.4 -7Q11 -5.6 7.6 -2Q6.4 -4 6.4 -7Z" fill="#F2F2F2" stroke="var(--ink)" stroke-width=".7"/><circle cx="3.4" cy="-7.2" r="1.2" fill="#F2F2F2"/><circle cx="3.6" cy="-7.2" r=".6" fill="#141416"/><path class="pisca" d="M13 -12l2 -2M14 -8h3M13 -4l2 2" stroke="#F2C318" stroke-width="1.1" stroke-linecap="round"/></g>`
  }
);

/* ===================== dados do rock (S.rock) ===================== */
const rockExtras = () => {
  const r = rockDados();
  if (!r.jogo || typeof r.jogo !== "object") r.jogo = { dia: "", recorde: 0, vezes: 0 };
  if (!r.banda || typeof r.banda !== "object") r.banda = {};
  if (!Array.isArray(r.ingressos)) r.ingressos = [];
  return r;
};

/* ===================== Setlist com bis ===================== */
// Tarefas curtinhas para o bis (a plateia pede mais uma)
const BIS_SUGESTOES = [
  "Ler 10 páginas de um livro",
  "Arrumar a mesa em 5 minutos",
  "Beber um copo d'água",
  "Alongar por 3 minutos",
  "Planejar a setlist de amanhã",
  "Revisar uma matéria por 10 minutos",
  "Mandar mensagem pra alguém da banda",
  "Treinar o instrumento por 10 minutos",
  "Separar a roupa de amanhã",
  "Responder aquela mensagem pendente"
];
let bisSugestao = 0;

/** A plateia pede bis quando a setlist de hoje acabou (pelo menos 2 músicas) e o bis ainda não foi tocado hoje. */
function pedeBis() {
  const d = today();
  const tt = S.tasks.filter(t => t.date === d);
  return tt.length >= 2 && tt.every(t => t.done) && rockExtras().bisDia !== d;
}
const bisDeHoje = () => S.tasks.find(t => t.bis && t.date === today());

function bisHTML() {
  const b = bisDeHoje();
  if (b)
    return b.done
      ? `<div class="card bis feito"><b>Bis tocado!</b><span class="note">A plateia foi embora cantando. Gotas em dobro no bis.</span></div>`
      : `<div class="card bis"><b>Bis no palco</b><span class="note">Conclua <b>${esc(b.title.replace(/^Bis: /, ""))}</b> na setlist para ganhar gotas em dobro.</span></div>`;
  if (!pedeBis()) return "";
  const s = BIS_SUGESTOES[bisSugestao % BIS_SUGESTOES.length];
  return `<div class="card bis pede"><b>A plateia pede BIS!</b><span class="note">A setlist acabou e ninguém foi embora. Toca mais uma? Vale <b>gotas em dobro</b>.</span>
    <span class="bis-sugestao">${esc(s)}</span>
    <div class="row"><button class="btn primary" data-act="bis-tocar">Tocar o bis</button><button class="btn ghost" data-act="bis-outra">Outra música</button></div></div>`;
}

ACOES_EXTRAS["bis-outra"] = () => {
  bisSugestao++;
  render();
};
ACOES_EXTRAS["bis-tocar"] = () => {
  if (!pedeBis()) return;
  const r = rockExtras();
  r.bisDia = today();
  const id = newId();
  S.tasks.push({
    id,
    title: "Bis: " + BIS_SUGESTOES[bisSugestao % BIS_SUGESTOES.length],
    area: "geral",
    date: today(),
    time: "",
    done: false,
    prio: 0,
    repeat: "",
    sub: [],
    bis: true
  });
  fx.newId = id;
  if (typeof somPalhetada === "function" && S.sons.pagina) somPalhetada();
  react("party", "BIS! BIS! Mais uma música na setlist, valendo <b>gotas em dobro</b>.", 3600);
  commit();
};

/* ===================== Ensaio relâmpago (minijogo de ritmo) ===================== */
const JOGO_SEGUNDOS = 30;
const JOGO_QUEDA = 1.6; // segundos que a nota leva do topo até a linha
const JANELA_BOA = 0.075,
  JANELA_OK = 0.17;
const TECLAS_JOGO = ["a", "s", "d", "j", "k"];
const TONS_JOGO = [82.41, 98, 110, 123.47, 146.83];
let jogo = null;

const jogouHoje = () => rockExtras().jogo.dia === today();

/** Monta as notas do ensaio: um riff que acelera aos poucos, com alguns acordes. */
function notasDoEnsaio() {
  const notas = [];
  let t = 1.8,
    ant = 2;
  while (t < JOGO_SEGUNDOS) {
    const progresso = t / JOGO_SEGUNDOS;
    const passo = pick(
      progresso < 0.35 ? [0.6, 0.6, 0.45] : progresso < 0.7 ? [0.45, 0.45, 0.3] : [0.3, 0.3, 0.45, 0.22]
    );
    let pista = Math.max(0, Math.min(4, ant + pick([-2, -1, 1, 1, 2, 0])));
    if (pista === ant && Math.random() < 0.6) pista = (pista + 1 + Math.floor(Math.random() * 4)) % 5;
    notas.push({ t, pista });
    if (Math.random() < 0.12 + progresso * 0.1 && pista < 4) notas.push({ t, pista: pista + 1 }); // acorde
    ant = pista;
    t += passo;
  }
  return notas;
}

function abrirEnsaio() {
  if (document.getElementById("jogo-ritmo")) return;
  const valendo = !jogouHoje();
  const el = document.createElement("div");
  el.id = "jogo-ritmo";
  el.className = "jogo-ritmo";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Ensaio relâmpago");
  el.innerHTML = `<div class="jr-caixa">
    <div class="jr-topo"><b>Ensaio relâmpago</b><span class="jr-num"><small>pontos</small><b id="jr-pontos">0</b></span><span class="jr-num"><small>combo</small><b id="jr-combo">x1</b></span><span class="jr-num"><small>tempo</small><b id="jr-tempo">${JOGO_SEGUNDOS}</b></span><button class="btn small ghost" data-jr="fechar">Sair</button></div>
    <div class="jr-pista" id="jr-pista">${CORES_TRASTE.map((c, i) => `<div class="jr-linha" data-jr-pista="${i}" style="--c:${c}"></div>`).join("")}<div class="jr-alvo"></div></div>
    <div class="jr-botoes">${CORES_TRASTE.map((c, i) => `<button class="jr-bt" data-jr-pista="${i}" style="--c:${c}" aria-label="Pista ${i + 1}, tecla ${TECLAS_JOGO[i].toUpperCase()}"><span>${TECLAS_JOGO[i].toUpperCase()}</span></button>`).join("")}</div>
    <div class="jr-fim" id="jr-fim" hidden></div>
    <p class="jr-dica" id="jr-dica">Toque a pista (ou as teclas A S D J K) quando a nota chegar na linha. ${valendo ? "O primeiro ensaio do dia vale gotas." : "Você já ensaiou hoje: este é treino livre, sem gotas."}</p>
  </div>`;
  document.body.appendChild(el);
  document.documentElement.classList.add("jogando");
  jogo = {
    el,
    notas: notasDoEnsaio(),
    inicio: performance.now() + 900,
    pontos: 0,
    combo: 0,
    maior: 0,
    acertos: 0,
    valendo,
    fim: false
  };
  jogo.total = jogo.notas.length;
  requestAnimationFrame(quadroDoJogo);
}

const multJogo = () => Math.min(4, 1 + Math.floor(jogo.combo / 8));

function quadroDoJogo() {
  if (!jogo || jogo.fim) return;
  const agora = (performance.now() - jogo.inicio) / 1000;
  const pista = document.getElementById("jr-pista");
  if (!pista) return;
  const alto = pista.clientHeight * 0.84; // altura da linha de acerto
  for (const n of jogo.notas) {
    if (n.fora) continue;
    const falta = n.t - agora;
    if (falta > JOGO_QUEDA) continue;
    if (!n.el) {
      n.el = document.createElement("span");
      n.el.className = "jr-nota";
      n.el.style.setProperty("--c", CORES_TRASTE[n.pista]);
      pista.children[n.pista].appendChild(n.el);
    }
    const y = (1 - falta / JOGO_QUEDA) * alto;
    n.el.style.transform = `translateY(${y.toFixed(1)}px)`;
    if (!n.acertou && falta < -JANELA_OK) {
      n.fora = true;
      n.el.classList.add("errou");
      setTimeout(() => n.el && n.el.remove(), 300);
      jogo.combo = 0;
      atualizarPlacar();
    } else if (n.acertou) {
      n.fora = true;
    }
  }
  const resta = Math.max(0, Math.ceil(JOGO_SEGUNDOS + 1 - agora));
  const tempo = document.getElementById("jr-tempo");
  if (tempo) tempo.textContent = resta;
  if (agora > JOGO_SEGUNDOS + 1) return terminarEnsaio();
  requestAnimationFrame(quadroDoJogo);
}

function atualizarPlacar() {
  const p = document.getElementById("jr-pontos"),
    c = document.getElementById("jr-combo");
  if (p) p.textContent = jogo.pontos;
  if (c) c.textContent = `x${multJogo()}${jogo.combo >= 4 ? ` · ${jogo.combo}` : ""}`;
}

function tocarPista(i) {
  if (!jogo || jogo.fim) return;
  const agora = (performance.now() - jogo.inicio) / 1000;
  const linha = document.querySelector(`#jr-pista [data-jr-pista="${i}"]`);
  let melhor = null;
  for (const n of jogo.notas)
    if (n.pista === i && !n.acertou && !n.fora && Math.abs(n.t - agora) <= JANELA_OK)
      if (!melhor || Math.abs(n.t - agora) < Math.abs(melhor.t - agora)) melhor = n;
  if (!melhor) {
    jogo.combo = 0;
    if (linha) (linha.classList.remove("erro"), void linha.offsetWidth, linha.classList.add("erro"));
    atualizarPlacar();
    return;
  }
  const perfeita = Math.abs(melhor.t - agora) <= JANELA_BOA;
  melhor.acertou = true;
  jogo.acertos++;
  jogo.combo++;
  jogo.maior = Math.max(jogo.maior, jogo.combo);
  jogo.pontos += (perfeita ? 100 : 50) * multJogo() * (starAtivo() ? 2 : 1);
  if (melhor.el) {
    melhor.el.classList.add(perfeita ? "perfeita" : "boa");
    setTimeout(() => melhor.el && melhor.el.remove(), 260);
  }
  if (linha) (linha.classList.remove("acerto"), void linha.offsetWidth, linha.classList.add("acerto"));
  if (S.sons.pagina && typeof powerChord === "function") {
    const ctx = pegarAudio();
    if (ctx) powerChord(ctx, ctx.currentTime, TONS_JOGO[i], 0.28, 0.1);
  }
  atualizarPlacar();
}

function terminarEnsaio() {
  if (!jogo || jogo.fim) return;
  jogo.fim = true;
  const r = rockExtras();
  const precisao = jogo.total ? jogo.acertos / jogo.total : 0;
  const recorde = jogo.pontos > (r.jogo.recorde || 0);
  let gotas = 0;
  if (jogo.valendo) {
    gotas = earn(Math.round(5 + 35 * precisao));
    r.energia = Math.min(100, (r.energia || 0) + Math.round(20 * precisao));
    r.jogo.dia = today();
  }
  r.jogo.recorde = Math.max(r.jogo.recorde || 0, jogo.pontos);
  r.jogo.vezes = (r.jogo.vezes || 0) + 1;
  const nota =
    precisao >= 0.95
      ? "Lendário"
      : precisao >= 0.8
        ? "Arrasou"
        : precisao >= 0.6
          ? "Mandou bem"
          : precisao >= 0.35
            ? "Bom ensaio"
            : "Desafinou";
  const fim = document.getElementById("jr-fim");
  if (fim) {
    fim.hidden = false;
    fim.innerHTML = `<b class="jr-nota-final">${nota}!</b>
      <span>${jogo.acertos} de ${jogo.total} notas (${Math.round(precisao * 100)}%) · maior combo ${jogo.maior}</span>
      <span>${jogo.pontos} pontos${recorde ? " · <b>novo recorde!</b>" : ` · recorde ${r.jogo.recorde}`}</span>
      ${jogo.valendo ? `<span class="jr-premio">+${gotas} gotas e Star Power +${Math.round(20 * precisao)}%</span>` : `<span class="note">Treino livre: amanhã tem ensaio valendo gotas de novo.</span>`}
      <div class="row"><button class="btn primary" data-jr="fechar">Fechar</button><button class="btn ghost" data-jr="de-novo">Tocar de novo</button></div>`;
  }
  const dica = document.getElementById("jr-dica");
  if (dica) dica.hidden = true;
  commit();
}

function fecharEnsaio() {
  if (jogo) jogo.fim = true;
  jogo = null;
  const el = document.getElementById("jogo-ritmo");
  if (el) el.remove();
  document.documentElement.classList.remove("jogando");
  render();
}

ACOES_EXTRAS["ensaio-abrir"] = () => abrirEnsaio();
document.addEventListener("pointerdown", e => {
  const alvo = e.target.closest && e.target.closest("[data-jr-pista]");
  if (alvo && jogo) {
    e.preventDefault();
    tocarPista(+alvo.dataset.jrPista);
  }
});
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-jr]");
  if (!b) return;
  if (b.dataset.jr === "fechar") fecharEnsaio();
  if (b.dataset.jr === "de-novo") {
    fecharEnsaio();
    abrirEnsaio();
  }
});
document.addEventListener("keydown", e => {
  if (!document.getElementById("jogo-ritmo")) return;
  if (e.key === "Escape") return fecharEnsaio();
  const i = TECLAS_JOGO.indexOf(e.key.toLowerCase());
  const n = "12345".indexOf(e.key);
  if ((i >= 0 || n >= 0) && !e.repeat) {
    e.preventDefault();
    tocarPista(i >= 0 ? i : n);
  }
});

function ensaioHTML() {
  const r = rockExtras();
  return `<div class="card ensaio"><div class="ensaio-txt"><b>Ensaio relâmpago</b><span class="note">${jogouHoje() ? `Ensaio de hoje feito. Recorde: <b>${r.jogo.recorde}</b> pontos. Dá pra treinar sem gotas.` : `30 segundos de notas caindo. O primeiro do dia vale até <b>40 gotas</b> e enche o Star Power.`}</span></div>
    <button class="btn ${jogouHoje() ? "ghost" : "primary"}" data-act="ensaio-abrir">${jogouHoje() ? "Treinar" : "Tocar"}</button></div>`;
}

/* ===================== Sua banda ===================== */
const INSTRUMENTOS = [
  ["bateria", "Bateria"],
  ["baixo", "Baixo"],
  ["guitarra", "Guitarra base"],
  ["teclado", "Teclado"]
];
/** Desenho pequeno de cada instrumento (área de 40 x 30). */
const INSTRUMENTO_SVG = {
  bateria: `<ellipse cx="20" cy="22" rx="11" ry="7" fill="#E0312F" stroke="#141416" stroke-width="1.4"/><ellipse cx="20" cy="18" rx="11" ry="4" fill="#F2F2F2" stroke="#141416" stroke-width="1.2"/><ellipse cx="6" cy="10" rx="6" ry="1.6" fill="#E8C24A" stroke="#141416" stroke-width=".8"/><path d="M6 10V27M34 12V27" stroke="#141416" stroke-width="1"/><ellipse cx="34" cy="12" rx="5" ry="1.4" fill="#E8C24A" stroke="#141416" stroke-width=".8"/><path d="M12 6L18 14M28 6L23 14" stroke="#C9A06A" stroke-width="1.6" stroke-linecap="round"/>`,
  baixo: `<g transform="translate(20 18) rotate(-35)"><rect x="-1.6" y="-20" width="3.2" height="22" fill="#5A3A22"/><rect x="-2.6" y="-24" width="5.2" height="5" rx="1" fill="#141416"/><path d="M-7 2Q-9 10 -4 12Q0 14 4 12Q9 10 7 2Q5 -2 0 -1Q-5 -2 -7 2Z" fill="#2F6FD6" stroke="#141416" stroke-width="1.2"/><path d="M-0.6 -18V8M0.6 -18V8" stroke="#D9DDE3" stroke-width=".4"/></g>`,
  guitarra: `<g transform="translate(20 18) rotate(30)"><rect x="-1.4" y="-19" width="2.8" height="20" fill="#3A2A1E"/><path d="M-2.4 -23H2.4V-18H-2.4Z" fill="#141416"/><path d="M-8 3Q-10 -3 -5 -3Q-3 -5 0 -3Q3 -5 5 -3Q10 -3 8 3Q7 11 0 12Q-7 11 -8 3Z" fill="#F2C318" stroke="#141416" stroke-width="1.2"/><circle cx="0" cy="3" r="2" fill="#141416"/></g>`,
  teclado: `<rect x="3" y="10" width="34" height="13" rx="2" fill="#141416"/><rect x="5" y="15" width="30" height="6" fill="#F2F2F2"/>${[9, 13, 17, 23, 27, 31].map(x => `<rect x="${x - 1}" y="15" width="2" height="3.6" fill="#141416"/>`).join("")}<circle cx="9" cy="12.6" r="1" fill="#E0312F"/><circle cx="13" cy="12.6" r="1" fill="#2FB344"/><path d="M8 23V29M32 23V29" stroke="#141416" stroke-width="1.6"/>`
};

function bandaHTML() {
  const r = rockExtras();
  const temConta = typeof modoFirebase === "function" && modoFirebase();
  const amigos = temConta && typeof amigosAceitos === "function" ? amigosAceitos() : [];
  // carrega o Prumi de quem está na banda e ainda não chegou
  for (const [k] of INSTRUMENTOS) {
    const uid = r.banda[k];
    if (uid && amigos.some(a => a.uid === uid) && !(amigosInfo[uid] && amigosInfo[uid].vitrine))
      carregarAmigo(uid, true);
  }
  const membro = ([k, nome]) => {
    const uid = r.banda[k];
    const amigo = uid && amigos.some(a => a.uid === uid) ? (amigosInfo[uid] || {}).vitrine : null;
    const opcoes = `<select data-change="banda-membro" data-k="${k}" aria-label="Quem toca ${nome.toLowerCase()}"><option value="">Vaga aberta</option>${amigos.map(a => `<option value="${esc(a.uid)}" ${a.uid === uid ? "selected" : ""}>${esc(nomeDe(a.uid))}</option>`).join("")}</select>`;
    return `<li class="membro ${amigo ? "" : "vaga"}"><span class="membro-prumi">${amigo ? prumi({ mood: "happy", size: 52, eq: amigo.equip, p: amigo.persona }) : `<span class="vaga-txt">?</span>`}</span>
      <svg class="instrumento" viewBox="0 0 40 30" width="44" height="33" aria-hidden="true">${INSTRUMENTO_SVG[k]}</svg>
      <span class="membro-nome"><b>${nome}</b>${amigos.length ? opcoes : `<small>${amigo ? esc(amigo.nome) : "Vaga aberta"}</small>`}</span></li>`;
  };
  const voce = `<li class="membro voce"><span class="membro-prumi">${prumi({ mood: "party", size: 60 })}</span><svg class="instrumento" viewBox="-20 -26 36 40" width="40" height="44" aria-hidden="true">${guitar("#E0312F", "#3A2A1E").replace(/var\(--ink\)/g, "#141416")}</svg><span class="membro-nome"><b>Vocal e guitarra</b><small>Você</small></span></li>`;
  const completa = INSTRUMENTOS.every(([k]) => r.banda[k] && amigos.some(a => a.uid === r.banda[k]));
  return `<section class="block banda"><details class="more" ${completa ? "" : "open"}><summary>Sua banda <span class="count">${INSTRUMENTOS.filter(([k]) => r.banda[k] && amigos.some(a => a.uid === r.banda[k])).length + 1}/5</span></summary>
    <ul class="palco-banda">${membro(INSTRUMENTOS[0])}${membro(INSTRUMENTOS[1])}${voce}${membro(INSTRUMENTOS[2])}${membro(INSTRUMENTOS[3])}</ul>
    <span class="note">${!temConta ? `A banda é formada com amigos. <button class="olink" data-tab="ajustes">Entre com uma conta</button> para chamar sua galera.` : !amigos.length ? `Chame amigos para tocar com você. <button class="olink" data-tab="amigos">Convidar amigos</button>` : completa ? "Banda completa! Bora pra turnê." : "Escolha quem toca cada instrumento."}</span></details></section>`;
}

MUDANCAS_EXTRAS["banda-membro"] = el => {
  const r = rockExtras();
  const k = el.dataset.k;
  if (!INSTRUMENTOS.some(([i]) => i === k)) return;
  // um amigo toca um instrumento só
  for (const [i] of INSTRUMENTOS) if (i !== k && el.value && r.banda[i] === el.value) r.banda[i] = "";
  r.banda[k] = el.value;
  if (el.value) react("party", `<b>${esc(nomeDe(el.value))}</b> entrou na banda!`, 2600);
  commit();
};

/* ===================== Ingressos colecionáveis ===================== */
const INGRESSO_SHOWS = 5; // shows numa semana para ganhar o ingresso
const INGRESSO_GOTAS = 25;

/** Confere as semanas que já terminaram (até 6 para trás) e entrega os ingressos novos. */
function conferirIngressos() {
  if (S.persona !== "rock") return [];
  const r = rockExtras();
  const novos = [];
  const estaSemana = mondayOf(today());
  for (let k = 1; k <= 6; k++) {
    const seg = addDays(estaSemana, -7 * k);
    if (r.ingressos.some(i => i.semana === seg)) continue;
    const notas = [];
    for (let d = 0; d < 7; d++) {
      const n = estrelasDoDia(addDays(seg, d));
      if (n) notas.push(n);
    }
    if (notas.length < INGRESSO_SHOWS) continue;
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;
    const nivel = levelOf(S.xp).lvl;
    const ingresso = {
      semana: seg,
      shows: notas.length,
      estrelas: Math.round(media * 10) / 10,
      palco: PALCOS[Math.min(PALCOS.length - 1, Math.max(0, nivel - 1) + (media >= 4.5 ? 1 : 0))],
      cor: CORES_TRASTE[r.ingressos.length % CORES_TRASTE.length]
    };
    r.ingressos.unshift(ingresso);
    novos.push(ingresso);
  }
  if (novos.length) {
    r.ingressos.sort((a, b) => (a.semana < b.semana ? 1 : -1));
    r.ingressos = r.ingressos.slice(0, 52);
    earn(INGRESSO_GOTAS * novos.length);
    setTimeout(() => {
      toast(
        novos.length === 1
          ? `Ingresso novo na coleção! +${INGRESSO_GOTAS} gotas`
          : `${novos.length} ingressos novos na coleção!`,
        false,
        "party"
      );
      fx.big = true;
    }, 900);
    persist();
  }
  return novos;
}

/** Desenho de um ingresso (com canhoto). */
function ingressoHTML(i, pequeno) {
  const fim = addDays(i.semana, 6);
  return `<div class="ingresso ${pequeno ? "pequeno" : ""}" style="--c:${esc(i.cor || "#E0312F")}"><div class="ing-corpo"><small>Turnê da semana</small><b>${esc(i.palco)}</b><span>${fmtShort(i.semana)} a ${fmtShort(fim)}</span>${estrelasHTML(Math.round(i.estrelas))}</div><div class="ing-canhoto"><b>${i.shows}</b><small>shows</small></div></div>`;
}

function ingressosHTML() {
  conferirIngressos();
  const r = rockExtras();
  const lista = r.ingressos;
  return `<section class="block ingressos"><details class="more"><summary>Coleção de ingressos <span class="count">${lista.length}</span></summary>
    ${lista.length ? `<div class="ing-lista">${lista.map(i => ingressoHTML(i)).join("")}</div>` : ""}
    <span class="note">Cada semana com ${INGRESSO_SHOWS} ou mais shows (dias com tarefas concluídas ou meta de água) vira um ingresso. Vale <b>+${INGRESSO_GOTAS} gotas</b> e aparece no seu perfil.</span></details></section>`;
}

/* ===================== ganchos ===================== */
// Seção extra na aba Hoje (js/telas/hoje.js chama ganchoMundo("secaoHoje"))
MUNDO_FX.rock.secaoHoje = () =>
  `${bisHTML() || ""}<section class="block">${ensaioHTML()}</section>${bandaHTML()}${ingressosHTML()}`;

// Bis vale gotas em dobro: soma de novo o que a tarefa deu (e guarda, para devolver se desmarcar)
{
  const concluirAntes = MUNDO_FX.rock.aoConcluir;
  MUNDO_FX.rock.aoConcluir = (x, el) => {
    if (concluirAntes) concluirAntes(x, el);
    if (x.bis && !x.bisPago && x.paid > 0) {
      x.bisPago = 1;
      x.paid += earn(x.paid, el);
      rockExtras().bis = (rockExtras().bis || 0) + 1;
      setTimeout(() => toast("Bis tocado! Gotas em dobro.", false, "party"), 600);
    }
  };
}
