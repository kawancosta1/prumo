/*
  Quarto, parte 2 (depois de js/quarto.js):
  - Lugares novos: teto (luzes e varais), cortina, planta (na janela), movel (no chão da frente) e pelucia (na cama).
  - Itens vivos: janela com o céu da hora real (e estrela cadente rara pra pegar), plantas que crescem com os hábitos,
    escrivaninha arrumada ou bagunçada conforme as tarefas, mural de post-its das tarefas de hoje, calendário da sequência,
    quadro com a última foto do Fotolog e prateleira de troféus das provas.
  - Pelúcias que vêm das conquistas, kits por mundo (bônus de páginas ao completar), decoração de época
    (Halloween, Natal, férias e São João), vitrola e rádio que tocam de verdade.
  - Modo bagunça: depois de 2 dias sem abrir o app aparecem roupas no chão. Toque pra arrumar.
  - Presentes de amigos aparecem no chão por 7 dias. Posição livre: arrastar pôster, bichinho, móvel e pelúcia.
*/
"use strict";

Object.assign(LUGARES_QUARTO, {
  teto: { nome: "Luzes e varais", w: 360, h: 28 },
  cortina: { nome: "Cortina", w: 106, h: 96 },
  planta: { nome: "Planta da janela", w: 36, h: 34 },
  movel: { nome: "Móvel", w: 44, h: 46 },
  pelucia: { nome: "Pelúcia", w: 30, h: 26 }
});
Object.assign(QUARTO_PADRAO, { teto: "", cortina: "", planta: "", movel: "q_vitrola", pelucia: "" });
const LUGARES_OPCIONAIS = ["poster", "tapete", "pet", "teto", "cortina", "planta", "movel", "pelucia"];
const ARRASTAVEIS = { poster: 1, pet: 1, movel: 1, pelucia: 1 };

/** Dados extras do quarto (só os seus). */
function quartoExtras() {
  const dec = S.leitura.decor;
  if (!dec.extras || typeof dec.extras !== "object") dec.extras = {};
  const e = dec.extras;
  if (!Array.isArray(e.bagunca)) e.bagunca = [];
  if (!Array.isArray(e.presentes)) e.presentes = [];
  if (!Array.isArray(e.kits)) e.kits = [];
  if (!e.pos || typeof e.pos !== "object") e.pos = {};
  e.presentes = e.presentes
    .filter(p => p && typeof p.t === "string" && diffDays(p.em, today()) <= 7)
    .slice(-5);
  return e;
}

/* ===================== época ===================== */
const EPOCAS = {
  halloween: { nome: "Halloween", de: "10-15", ate: "11-05" },
  natal: { nome: "Natal", de: "12-01", ate: "01-06" },
  ferias: { nome: "Férias", de: "01-07", ate: "02-28" },
  saojoao: { nome: "São João", de: "06-01", ate: "07-15" }
};
function epocaAtiva(id, dia = today()) {
  const e = EPOCAS[id];
  if (!e) return true;
  const md = dia.slice(5);
  return e.de <= e.ate ? md >= e.de && md <= e.ate : md >= e.de || md <= e.ate;
}
/** Aparece na loja? Itens de época só na época (ou se você já tem). */
const quartoDisponivel = i => !i.epoca || epocaAtiva(i.epoca) || !!temDecor(i);

/* ===================== desenhos de apoio ===================== */
const corda = (w, y = 8) =>
  `<path d="M0 ${y}Q${w / 4} ${y + 10} ${w / 2} ${y}T${w} ${y}" stroke="#5D4037" stroke-width="1" fill="none"/>`;
/** Varal no teto com um enfeite repetido (motivo desenhado num quadrado de 16). */
function varal(w, motivo, cores, passo = 30, classe = "") {
  let s = corda(w);
  for (let x = 12, i = 0; x < w; x += passo, i++) {
    const y = 8 + Math.sin(((x % (w / 2)) / (w / 2)) * Math.PI) * 5;
    s += `<g class="${classe}" style="--d:${(i % 5) * 0.35}s;color:${cores[i % cores.length]}" transform="translate(${x - 8} ${y})">${motivo}</g>`;
  }
  return s;
}
const MOTIVO = {
  lampada: `<path d="M8 0v3" stroke="#5D4037"/><ellipse class="luzinha" cx="8" cy="8" rx="3.4" ry="4.6" fill="currentColor"/>`,
  bandeira: `<path d="M1 0H15L8 13Z" fill="currentColor"/>`,
  morcego: `<path d="M8 4Q10 1 11 3.6Q15 1 16 4.5Q13 6 13.5 8Q11 6.6 8 9Q5 6.6 2.5 8Q3 6 0 4.5Q1 1 5 3.6Q6 1 8 4Z" fill="currentColor"/>`,
  palheta: `<path d="M3 2Q8 0 13 2Q13.5 8 8 13Q2.5 8 3 2Z" fill="currentColor"/>`,
  estrela: `<path d="M8 1l2 4.6 5 .5-3.8 3.4 1.1 4.9L8 11.8l-4.3 2.6 1.1-4.9L1 6.1l5-.5z" fill="currentColor"/>`,
  lanterna: `<path d="M8 0v2" stroke="#5D4037"/><rect class="luzinha" x="3" y="2" width="10" height="12" rx="4" fill="currentColor"/><path d="M3 5h10M3 11h10" stroke="#000" stroke-opacity=".25"/>`,
  vinil: `<circle cx="8" cy="8" r="7" fill="#111"/><circle cx="8" cy="8" r="2.6" fill="currentColor"/>`,
  diamante: `<path d="M3 5L6 1H10L13 5L8 13Z" fill="currentColor"/>`,
  sino: `<path d="M8 0v3" stroke="#5D4037"/><path d="M4 11Q4 3 8 3Q12 3 12 11Z" fill="currentColor"/><circle cx="8" cy="12" r="1.4" fill="#5D4037"/>`,
  ferradura: `<path d="M3 2Q2 13 8 13Q14 13 13 2" stroke="currentColor" stroke-width="2.6" fill="none"/>`,
  croche: `<rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor"/><rect x="5" y="5" width="6" height="6" rx="1" fill="#fff" opacity=".5"/>`,
  abobora: `<ellipse cx="8" cy="9" rx="6.5" ry="5" fill="#F57C00"/><path d="M8 4V1" stroke="#33691E" stroke-width="1.6"/><path d="M5 8l1.4-1.4L7.8 8M8.2 8l1.4-1.4L11 8M5 11q3 2 6 0" stroke="#3E2723" stroke-width="1" fill="none"/>`,
  balao: `<path d="M8 0v2" stroke="#5D4037"/><path d="M8 2Q14 4 13 9Q11 13 8 14Q5 13 3 9Q2 4 8 2Z" fill="currentColor"/><path d="M6 14h4l-1 2h-2z" fill="#8D6E63"/>`,
  meia: `<path d="M5 0h6v8l3 3q1 4-3 4H6q-2 0-2-3Z" fill="currentColor"/><rect x="5" y="0" width="6" height="3" fill="#fff"/>`
};

/* ===================== itens novos ===================== */
const QUARTO_NOVOS = [
  /* ---------- luzes e varais (teto) ---------- */
  {
    slot: "teto",
    id: "q_pisca",
    nome: "Pisca-pisca colorido",
    preco: 70,
    svg: () =>
      varal(360, MOTIVO.lampada, ["#FFD54F", "#FF8A80", "#80D8FF", "#B9F6CA", "#EA80FC"], 24, "pisca")
  },
  {
    slot: "teto",
    id: "q_pisca_quente",
    nome: "Luzinhas amarelas",
    preco: 60,
    svg: () => varal(360, MOTIVO.lampada, ["#FFE082"], 20, "pisca")
  },
  {
    slot: "teto",
    id: "q_varal_estrelas",
    nome: "Varal de estrelas",
    preco: 55,
    svg: () => varal(360, MOTIVO.estrela, ["#FFD54F", "#FFF59D"], 34)
  },
  {
    slot: "teto",
    id: "q_teto_halloween",
    nome: "Abóboras e teias",
    preco: 80,
    epoca: "halloween",
    svg: () =>
      varal(360, MOTIVO.abobora, ["#F57C00"], 40) +
      `<path d="M0 0L22 0L0 22Z M0 0L14 14M0 8L8 0" stroke="#9E9E9E" stroke-width=".7" fill="none"/><path d="M360 0L338 0L360 22ZM360 0L346 14" stroke="#9E9E9E" stroke-width=".7" fill="none"/>`
  },
  {
    slot: "teto",
    id: "q_teto_natal",
    nome: "Pisca-pisca de Natal",
    preco: 80,
    epoca: "natal",
    svg: () =>
      varal(360, MOTIVO.lampada, ["#E53935", "#43A047", "#FFD54F"], 18, "pisca") +
      varal(360, MOTIVO.meia, ["#E53935"], 90).replace(/<path d="M0 8Q[^"]+"[^>]*>/, "")
  },
  {
    slot: "teto",
    id: "q_teto_saojoao",
    nome: "Balões de São João",
    preco: 80,
    epoca: "saojoao",
    svg: () => varal(360, MOTIVO.balao, ["#E53935", "#FDD835", "#1E88E5", "#43A047"], 30)
  },
  {
    slot: "teto",
    id: "q_teto_ferias",
    nome: "Varal de conchinhas",
    preco: 70,
    epoca: "ferias",
    svg: () =>
      varal(
        360,
        `<path d="M8 2Q15 6 13 12H3Q1 6 8 2Z" fill="currentColor"/><path d="M8 3V12M5 5l1 7M11 5l-1 7" stroke="#fff" stroke-width=".6" opacity=".7"/>`,
        ["#FFCCBC", "#FFE0B2", "#F8BBD0"],
        32
      )
  },

  /* ---------- cortinas ---------- */
  {
    slot: "cortina",
    id: "q_cortina_linho",
    nome: "Cortina de linho",
    preco: 60,
    svg: () => cortinaSVG("#EFE6D6", "#D7CCB8")
  },
  {
    slot: "cortina",
    id: "q_cortina_veludo",
    nome: "Cortina de veludo",
    preco: 90,
    svg: () => cortinaSVG("#7B1E3A", "#5A1229")
  },
  {
    slot: "cortina",
    id: "q_cortina_azul",
    nome: "Cortina azul com estrelas",
    preco: 80,
    svg: () => cortinaSVG("#2C3E7A", "#1F2D5C", true)
  },
  {
    slot: "cortina",
    id: "q_persiana",
    nome: "Persiana",
    preco: 70,
    svg: () =>
      `<rect x="8" y="2" width="90" height="4" fill="#BDBDBD"/>${[...Array(9)].map((_, i) => `<rect x="9" y="${8 + i * 4}" width="88" height="2.6" rx="1" fill="#E0E0E0" stroke="#BDBDBD" stroke-width=".4"/>`).join("")}<path d="M94 6V46" stroke="#9E9E9E" stroke-width=".8"/>`
  },

  /* ---------- plantas que crescem com os hábitos ---------- */
  {
    slot: "planta",
    id: "q_planta_samambaia",
    nome: "Samambaia",
    preco: 40,
    cresce: true,
    svg: (w, h, d) => plantaQuarto("samambaia", d)
  },
  {
    slot: "planta",
    id: "q_planta_cacto",
    nome: "Cacto",
    preco: 40,
    cresce: true,
    svg: (w, h, d) => plantaQuarto("cacto", d)
  },
  {
    slot: "planta",
    id: "q_planta_girassol",
    nome: "Girassol",
    preco: 55,
    cresce: true,
    svg: (w, h, d) => plantaQuarto("girassol", d)
  },

  /* ---------- móveis do chão ---------- */
  {
    slot: "movel",
    id: "q_puff",
    nome: "Puff redondo",
    preco: 50,
    svg: () =>
      `<ellipse cx="22" cy="40" rx="18" ry="5" fill="#000" opacity=".15"/><path d="M4 26Q4 14 22 14Q40 14 40 26V36Q40 42 22 42Q4 42 4 36Z" fill="#F06292" stroke="var(--ink)" stroke-width="1.4"/><ellipse cx="22" cy="20" rx="17" ry="6" fill="#F48FB1"/><circle cx="22" cy="20" r="1.6" fill="#C2185B"/>`
  },
  {
    slot: "movel",
    id: "q_aquario",
    nome: "Aquário",
    preco: 120,
    toque: "aquario",
    svg: () =>
      `<rect x="4" y="12" width="36" height="28" rx="3" fill="#81D4FA" opacity=".7" stroke="var(--ink)" stroke-width="1.4"/><path d="M6 18h32" stroke="#fff" opacity=".6"/><g class="peixe"><path d="M14 26q4-4 9 0q-5 4-9 0zM14 26l-4-3v6z" fill="#FF7043"/></g><g class="peixe p2"><path d="M30 33q-3-3-7 0q4 3 7 0zM30 33l3-2v4z" fill="#FFD54F"/></g><path d="M8 40q4-6 2-10M34 40q-2-5 1-8" stroke="#43A047" stroke-width="1.6" fill="none"/><rect x="2" y="40" width="40" height="5" rx="1" fill="#5D4037"/>`
  },
  {
    slot: "movel",
    id: "q_vitrola",
    nome: "Vitrola 1930 (toca de verdade)",
    preco: 0,
    toque: "vitrola",
    svg: (w, h, d) => (typeof desenharVitrolaSVG === "function" ? desenharVitrolaSVG({ w, h, d, interativo: false }) : `<rect x="2" y="22" width="40" height="22" rx="2" fill="#8D6E63"/>`)
  },
  {
    slot: "movel",
    id: "q_radio",
    nome: "Rádio antigo (toca de verdade)",
    preco: 110,
    toque: "radio",
    svg: () =>
      `<rect x="4" y="16" width="36" height="26" rx="5" fill="#D7A86E" stroke="var(--ink)" stroke-width="1.4"/><circle cx="15" cy="29" r="7" fill="#5D4037"/>${[0, 1, 2].map(i => `<path d="M10 ${25 + i * 4}h10" stroke="#8D6E63"/>`).join("")}<rect x="26" y="22" width="10" height="5" rx="1" fill="#FFF8E1"/><circle cx="29" cy="34" r="2" fill="#5D4037"/><circle cx="35" cy="34" r="2" fill="#5D4037"/><path d="M30 16L36 6" stroke="#9E9E9E" stroke-width="1.2"/>`
  },
  {
    slot: "movel",
    id: "q_bau",
    nome: "Baú de madeira",
    preco: 70,
    svg: () =>
      `<rect x="4" y="22" width="36" height="20" rx="2" fill="#A1887F" stroke="var(--ink)" stroke-width="1.4"/><path d="M4 24Q22 10 40 24" fill="#8D6E63" stroke="var(--ink)" stroke-width="1.4"/><path d="M12 22V42M32 22V42" stroke="#5D4037" stroke-width="2"/><rect x="19" y="26" width="6" height="7" rx="1" fill="#FFD54F" stroke="#5D4037"/>`
  },
  {
    slot: "movel",
    id: "q_trofeus_chao",
    nome: "Estante de troféus",
    preco: 100,
    svg: (w, h, d) => trofeusSVG(d, 44, 46)
  },
  {
    slot: "movel",
    id: "q_movel_abobora",
    nome: "Abóbora iluminada",
    preco: 70,
    epoca: "halloween",
    svg: () =>
      `<ellipse cx="22" cy="32" rx="18" ry="12" fill="#F57C00" stroke="var(--ink)" stroke-width="1.4"/><path d="M14 22Q22 18 30 22M22 20V12" stroke="#33691E" stroke-width="2.4" fill="none"/><path class="luzinha" d="M12 30l4-4l4 4zM24 30l4-4l4 4zM14 36q8 5 16 0l-3 3h-3l-2-2l-2 2h-3z" fill="#FFEB3B"/>`
  },
  {
    slot: "movel",
    id: "q_movel_arvore",
    nome: "Arvorezinha de Natal",
    preco: 90,
    epoca: "natal",
    svg: () =>
      `<path d="M22 4L36 24H28L40 38H4L16 24H8Z" fill="#2E7D32" stroke="var(--ink)" stroke-width="1.2"/><rect x="18" y="38" width="8" height="6" fill="#6D4C41"/>${[
        [18, 18],
        [26, 22],
        [14, 32],
        [30, 33],
        [22, 28]
      ]
        .map(
          ([x, y], i) =>
            `<circle class="luzinha" style="--d:${i * 0.3}s" cx="${x}" cy="${y}" r="2" fill="${["#E53935", "#FFD54F", "#29B6F6"][i % 3]}"/>`
        )
        .join("")}<path d="M22 0l1.4 2.8 3 .4-2.2 2 .6 3-2.8-1.6-2.8 1.6.6-3-2.2-2 3-.4z" fill="#FFD54F"/>`
  },
  {
    slot: "movel",
    id: "q_movel_boia",
    nome: "Boia de flamingo",
    preco: 80,
    epoca: "ferias",
    svg: () =>
      `<ellipse cx="22" cy="36" rx="18" ry="8" fill="#F48FB1" stroke="var(--ink)" stroke-width="1.4"/><ellipse cx="22" cy="36" rx="8" ry="3" fill="var(--bg, #fff)"/><path d="M34 32Q40 18 32 12Q28 10 28 16" stroke="#F48FB1" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M27 15l-4 2" stroke="#3E2723" stroke-width="2"/>`
  },
  {
    slot: "movel",
    id: "q_movel_fogueira",
    nome: "Fogueirinha de São João",
    preco: 80,
    epoca: "saojoao",
    svg: () =>
      `<path d="M8 42l28-8M8 34l28 8" stroke="#5D4037" stroke-width="4" stroke-linecap="round"/><path class="luzinha" d="M22 36q-12-8-4-22q2 8 6 6q-2-10 6-14q-2 12 4 16q4-4 2-8q8 12-4 22z" fill="#FF7043"/>`
  },

  /* ---------- itens vivos ---------- */
  {
    slot: "janela",
    id: "q_janela_viva",
    nome: "Janela viva (céu de agora)",
    preco: 150,
    svg: (w, h, d) => janelaViva(d)
  },
  {
    slot: "cama",
    id: "q_escrivaninha",
    nome: "Escrivaninha de estudo",
    preco: 130,
    mesa: true,
    svg: (w, h, d) => escrivaninhaSVG(d)
  },
  {
    slot: "poster",
    id: "q_mural",
    nome: "Mural de post-its (suas tarefas)",
    preco: 90,
    svg: (w, h, d) => muralSVG(d)
  },
  {
    slot: "poster",
    id: "q_calendario",
    nome: "Calendário da sequência",
    preco: 70,
    svg: (w, h, d) => calendarioSVG(d)
  },
  {
    slot: "poster",
    id: "q_quadro_fotolog",
    nome: "Quadro com sua foto do Fotolog",
    preco: 80,
    svg: (w, h, d) => quadroFotologSVG(d)
  },
  {
    slot: "poster",
    id: "q_prateleira_trofeus",
    nome: "Prateleira de troféus",
    preco: 90,
    svg: (w, h, d) => trofeusSVG(d, 44, 56)
  },

  /* ---------- pelúcias (das conquistas) ---------- */
  {
    slot: "pelucia",
    id: "q_urso",
    nome: "Ursinho de pelúcia",
    preco: 60,
    ach: "primeira",
    svg: () => pelucia("#A1887F", "urso")
  },
  {
    slot: "pelucia",
    id: "q_coelho_pelucia",
    nome: "Coelhinho de pelúcia",
    preco: 60,
    ach: "hidratado",
    svg: () => pelucia("#F5F5F5", "coelho")
  },
  {
    slot: "pelucia",
    id: "q_dino",
    nome: "Dinossauro de pelúcia",
    preco: 60,
    ach: "ritmo",
    svg: () => pelucia("#81C784", "dino")
  },
  {
    slot: "pelucia",
    id: "q_polvo",
    nome: "Polvinho de pelúcia",
    preco: 60,
    ach: "foco10",
    svg: () => pelucia("#CE93D8", "polvo")
  },
  {
    slot: "pelucia",
    id: "q_gato_pelucia",
    nome: "Gatinho de pelúcia",
    preco: 60,
    ach: "semana_agua",
    svg: () => pelucia("#FFB74D", "gato")
  },
  {
    slot: "pelucia",
    id: "q_estrela_pelucia",
    nome: "Estrela de pelúcia",
    preco: 60,
    ach: "dia_perfeito",
    svg: () => pelucia("#FFD54F", "estrela")
  }
];

/* ---------- mais tapetes, pisos e camas ---------- */
QUARTO_NOVOS.push(
  {
    slot: "tapete",
    id: "q_tapete_felpudo",
    nome: "Tapete felpudo",
    preco: 60,
    svg: () =>
      `<ellipse cx="75" cy="17" rx="72" ry="15" fill="#F5F5F5" stroke="#E0E0E0" stroke-width="3" stroke-dasharray="2 2"/><ellipse cx="75" cy="17" rx="60" ry="10" fill="#FAFAFA"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_persa",
    nome: "Tapete persa",
    preco: 90,
    svg: () =>
      `<rect x="4" y="4" width="142" height="26" rx="2" fill="#8E2430" stroke="#5E1220"/><rect x="12" y="9" width="126" height="16" fill="none" stroke="#E0B23A" stroke-width="1.4"/><path d="M75 9L90 17L75 25L60 17Z" fill="#1A3A6B" stroke="#E0B23A"/>${[...Array(14)].map((_, i) => `<path d="M${6 + i * 10.5} 30v4M${6 + i * 10.5} 4v-4" stroke="#E0B23A"/>`).join("")}`
  },
  {
    slot: "tapete",
    id: "q_tapete_arcoiris",
    nome: "Tapete arco-íris",
    preco: 70,
    svg: () =>
      ["#E53935", "#FB8C00", "#FDD835", "#43A047", "#1E88E5", "#8E24AA"]
        .map(
          (c, i) =>
            `<path d="M${10 + i * 6} 32A${65 - i * 6} ${28 - i * 4} 0 0 1 ${140 - i * 6} 32" fill="none" stroke="${c}" stroke-width="5"/>`
        )
        .join("")
  },
  {
    slot: "chao",
    id: "q_porcelanato",
    nome: "Porcelanato",
    preco: 110,
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#E8E4DE"/>${Array.from({ length: Math.ceil(w / 40) }, (_, i) => `<path d="M${i * 40} 0v${h}" stroke="#D3CEC6"/>`).join("")}${Array.from({ length: Math.ceil(h / 32) }, (_, i) => `<path d="M0 ${i * 32}H${w}" stroke="#D3CEC6"/>`).join("")}<path d="M0 6H${w}" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>`
  },
  {
    slot: "chao",
    id: "q_grama",
    nome: "Grama sintética",
    preco: 90,
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#66BB6A"/>${Array.from({ length: 90 }, (_, i) => `<path d="M${(i * 41) % w} ${4 + ((i * 17) % (h - 6))}l2 -5l2 5" stroke="#43A047" fill="none"/>`).join("")}`
  },
  {
    slot: "cama",
    id: "q_cama_dossel",
    nome: "Cama com dossel",
    preco: 160,
    svg: () =>
      `<path d="M8 0V70M132 0V70" stroke="#8D6E63" stroke-width="4"/><path d="M8 2H132" stroke="#8D6E63" stroke-width="4"/><path d="M10 4Q30 26 24 60M130 4Q110 26 116 60" stroke="#F8BBD0" stroke-width="6" fill="none" opacity=".85"/><rect x="10" y="40" width="122" height="22" rx="4" fill="#FFFFFF" stroke="#B8B2A8"/><rect x="14" y="30" width="34" height="14" rx="6" fill="#FCE4EC" stroke="#B8B2A8"/><path d="M50 38H132V58Q132 62 128 62H50Z" fill="#CE93D8"/><path d="M50 38H132" stroke="#AB47BC" stroke-width="2"/>`
  },
  {
    slot: "cama",
    id: "q_cama_rede",
    nome: "Rede",
    preco: 100,
    svg: () =>
      `<path d="M6 0V70M134 0V70" stroke="#8D6E63" stroke-width="4"/><path d="M6 14Q70 74 134 14" stroke="#E53935" stroke-width="9" fill="none"/><path d="M6 14Q70 66 134 14" stroke="#FDD835" stroke-width="3" fill="none"/>${[20, 40, 60, 80, 100, 120].map(x => `<path d="M${x} ${44 + Math.sin(((x - 6) / 128) * Math.PI) * 12}v6" stroke="#FFFFFF" stroke-width="1.6"/>`).join("")}`
  }
);

/* ---------- kits por mundo: um varal e um móvel de cada mundo ---------- */
const KITS_MUNDO = [
  {
    mundo: "emo",
    nome: "Quarto gótico",
    teto: ["Morceguinhos", MOTIVO.morcego, ["#141416", "#4A148C"]],
    movel: [
      "Candelabro",
      `<rect x="20" y="20" width="4" height="22" fill="#424242"/><path d="M10 42h24" stroke="#424242" stroke-width="3"/><path d="M8 20h28" stroke="#424242" stroke-width="2"/>${[10, 22, 34].map(x => `<rect x="${x - 2.4}" y="10" width="4.8" height="10" fill="#F5F5F5"/><path class="luzinha" d="M${x} 3q3 4 0 7q-3-3 0-7z" fill="#FFB300"/>`).join("")}`
    ]
  },
  {
    mundo: "rock",
    nome: "Garagem de banda",
    teto: ["Varal de palhetas", MOTIVO.palheta, ["#E53935", "#FDD835", "#1E88E5"]],
    movel: [
      "Amplificador",
      `<rect x="4" y="12" width="36" height="32" rx="2" fill="#212121" stroke="var(--ink)" stroke-width="1.4"/><rect x="8" y="20" width="28" height="20" rx="2" fill="#424242"/><path d="M8 24h28M8 28h28M8 32h28M8 36h28" stroke="#616161"/><rect x="8" y="14" width="28" height="4" fill="#BDBDBD"/>${[12, 18, 24, 30].map(x => `<circle cx="${x}" cy="16" r="1" fill="#212121"/>`).join("")}`
    ]
  },
  {
    mundo: "zen",
    nome: "Canto da calma",
    teto: ["Sinos de vento", MOTIVO.sino, ["#B0BEC5", "#CFD8DC"]],
    movel: [
      "Fonte de bambu",
      `<ellipse cx="22" cy="38" rx="18" ry="6" fill="#90A4AE" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="22" cy="36" rx="14" ry="3.6" fill="#4FC3F7"/><path d="M30 34V14M30 14L14 22" stroke="#9CCC65" stroke-width="4" stroke-linecap="round"/><path class="agua-cai" d="M14 23v11" stroke="#4FC3F7" stroke-width="1.6"/>`
    ]
  },
  {
    mundo: "sertanejo",
    nome: "Rancho",
    teto: ["Ferraduras da sorte", MOTIVO.ferradura, ["#9E9E9E", "#8D6E63"]],
    movel: [
      "Sela no cavalete",
      `<path d="M6 42V26M38 42V26M4 26H40" stroke="#6D4C41" stroke-width="3"/><path d="M8 26Q8 12 22 14Q36 12 36 26Z" fill="#8B5A2B" stroke="var(--ink)" stroke-width="1.4"/><path d="M14 20q8-4 16 0" stroke="#D9B26A" stroke-width="1.6" fill="none"/>`
    ]
  },
  {
    mundo: "cleanboy",
    nome: "Loft minimalista",
    teto: ["Pendentes de vidro", MOTIVO.lampada, ["#FFF8E1"]],
    movel: [
      "Mesinha com vaso",
      `<rect x="8" y="26" width="28" height="3" fill="#ECEFF1" stroke="#90A4AE"/><path d="M12 29v14M32 29v14" stroke="#90A4AE" stroke-width="2"/><path d="M18 26q-2-8 4-10q6 2 4 10z" fill="#FAFAFA" stroke="#90A4AE"/><path d="M22 16q-6-10 2-14M22 16q6-8 0-14" stroke="#66BB6A" stroke-width="1.4" fill="none"/>`
    ]
  },
  {
    mundo: "rapper",
    nome: "Estúdio caseiro",
    teto: ["Varal de vinis", MOTIVO.vinil, ["#F2C14E", "#E53935"]],
    movel: [
      "Boombox",
      `<rect x="2" y="18" width="40" height="22" rx="3" fill="#424242" stroke="var(--ink)" stroke-width="1.4"/><circle cx="12" cy="30" r="7" fill="#212121" stroke="#9E9E9E"/><circle cx="32" cy="30" r="7" fill="#212121" stroke="#9E9E9E"/><rect x="18" y="22" width="8" height="5" fill="#F2C14E"/><path d="M8 18Q22 6 36 18" stroke="#9E9E9E" stroke-width="2" fill="none"/>`
    ]
  },
  {
    mundo: "trapper",
    nome: "Cobertura neon",
    teto: ["Neon de diamantes", MOTIVO.diamante, ["#E040FB", "#80DEEA"]],
    movel: [
      "Cofre cravejado",
      `<rect x="6" y="12" width="32" height="32" rx="3" fill="#37474F" stroke="var(--ink)" stroke-width="1.4"/><circle cx="22" cy="28" r="7" fill="#546E7A" stroke="#E1F5FE"/><path d="M22 22v12M16 28h12" stroke="#E1F5FE" stroke-width="1.2"/>${[
        [10, 16],
        [34, 16],
        [10, 40],
        [34, 40]
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#E1F5FE"/>`)
        .join("")}`
    ]
  },
  {
    mundo: "pagodeiro",
    nome: "Quintal da resenha",
    teto: ["Luzinhas de quintal", MOTIVO.lampada, ["#FFE082", "#FFCC80"]],
    movel: [
      "Caixa térmica",
      `<rect x="4" y="18" width="36" height="24" rx="3" fill="#1E88E5" stroke="var(--ink)" stroke-width="1.4"/><rect x="4" y="16" width="36" height="6" rx="2" fill="#FFFFFF" stroke="var(--ink)" stroke-width="1.2"/><path d="M16 16v-4h12v4" stroke="var(--ink)" stroke-width="1.6" fill="none"/>`
    ]
  },
  {
    mundo: "funkeiro",
    nome: "Baile no quarto",
    teto: ["Neon do baile", MOTIVO.estrela, ["#FF2BD6", "#00E5FF", "#C6FF00"]],
    movel: [
      "Caixa de som de paredão",
      `<rect x="6" y="4" width="32" height="40" rx="2" fill="#1A1A22" stroke="var(--ink)" stroke-width="1.4"/><circle cx="22" cy="16" r="7" fill="#2A2A35" stroke="#555"/><circle cx="22" cy="33" r="8" fill="#2A2A35" stroke="#555"/><circle class="luzinha" cx="22" cy="33" r="3" fill="#00E5FF"/>`
    ]
  },
  {
    mundo: "forrozeiro",
    nome: "Casa de taipa",
    teto: ["Bandeirinhas", MOTIVO.bandeira, ["#E53935", "#FDD835", "#1E88E5", "#43A047"]],
    movel: [
      "Sanfona no banquinho",
      `<rect x="10" y="32" width="24" height="4" fill="#8D6E63"/><path d="M12 36v8M32 36v8" stroke="#6D4C41" stroke-width="2.4"/><rect x="8" y="14" width="28" height="18" rx="2" fill="#C62828" stroke="var(--ink)" stroke-width="1.2"/><path d="M14 14v18M20 14v18M26 14v18" stroke="#8E0000"/><rect x="8" y="14" width="6" height="18" fill="#FAFAFA" stroke="var(--ink)" stroke-width=".8"/>`
    ]
  },
  {
    mundo: "gamer",
    nome: "Setup gamer",
    teto: ["Fita de LED RGB", MOTIVO.lampada, ["#FF4081", "#7C4DFF", "#00E5FF", "#C6FF00"]],
    movel: [
      "Fliperama mini",
      `<path d="M10 44V8Q10 4 14 4H30Q34 4 34 8V44Z" fill="#311B92" stroke="var(--ink)" stroke-width="1.4"/><rect x="14" y="8" width="16" height="12" fill="#000"/><rect class="luzinha" x="16" y="10" width="4" height="4" fill="#00E5FF"/><rect x="12" y="24" width="20" height="5" fill="#4527A0"/><circle cx="18" cy="26.5" r="1.6" fill="#FF4081"/><circle cx="26" cy="26.5" r="1.6" fill="#C6FF00"/>`
    ]
  },
  {
    mundo: "otaku",
    nome: "Quarto japonês",
    teto: ["Lanternas japonesas", MOTIVO.lanterna, ["#E53935", "#FFFFFF"]],
    movel: [
      "Mesinha kotatsu",
      `<path d="M4 30h36l-4 12H8Z" fill="#E57373" stroke="var(--ink)" stroke-width="1.2"/><rect x="2" y="26" width="40" height="5" rx="1" fill="#8D6E63" stroke="var(--ink)" stroke-width="1.2"/><circle cx="18" cy="22" r="4" fill="#FF8A65"/><circle cx="26" cy="23" r="3.4" fill="#FFB74D"/>`
    ]
  },
  {
    mundo: "programador",
    nome: "Home office dev",
    teto: ["Fita de LED verde", MOTIVO.lampada, ["#40C463", "#9BE9A8"]],
    movel: [
      "Servidor caseiro",
      `<rect x="10" y="4" width="24" height="40" rx="2" fill="#263238" stroke="var(--ink)" stroke-width="1.4"/>${[10, 18, 26, 34].map(y => `<rect x="13" y="${y}" width="18" height="5" rx="1" fill="#37474F"/><circle class="luzinha" style="--d:${y / 30}s" cx="28" cy="${y + 2.5}" r="1.2" fill="#40C463"/>`).join("")}`
    ]
  },
  {
    mundo: "coach",
    nome: "Academia em casa",
    teto: [
      "Bandeiras de chegada",
      `<rect x="1" y="0" width="14" height="12" fill="#fff"/>${[0, 1, 2, 3].map(i => `<rect x="${1 + (i % 2) * 7}" y="${Math.floor(i / 2) * 6}" width="7" height="6" fill="#212121"/>`).join("")}`,
      ["#fff"]
    ],
    movel: [
      "Halteres no suporte",
      `<path d="M8 44L14 18M36 44L30 18M12 26H32M10 36H34" stroke="#616161" stroke-width="2.4"/>${[26, 36].map(y => `<rect x="12" y="${y - 3}" width="4" height="6" fill="#212121"/><rect x="28" y="${y - 3}" width="4" height="6" fill="#212121"/>`).join("")}`
    ]
  },
  {
    mundo: "vovo",
    nome: "Casa de vó",
    teto: ["Varal de crochê", MOTIVO.croche, ["#E57373", "#64B5F6", "#FFD54F", "#BA68C8"]],
    movel: [
      "Cadeira de balanço",
      `<path d="M12 6v26M32 6v26" stroke="#8D6E63" stroke-width="3"/><path d="M12 8h20M12 14h20" stroke="#8D6E63" stroke-width="2"/><path d="M8 30h28" stroke="#6D4C41" stroke-width="3"/><path d="M6 44Q22 36 38 44" stroke="#6D4C41" stroke-width="3" fill="none"/><path d="M12 32v10M32 32v10" stroke="#8D6E63" stroke-width="2.4"/><rect x="14" y="24" width="16" height="6" rx="2" fill="#E57373"/>`
    ]
  },
  {
    mundo: "feiticeiro",
    nome: "Torre do mago",
    teto: ["Estrelas penduradas", MOTIVO.estrela, ["#FFE082", "#90CAF9", "#E1BEE7"]],
    movel: [
      "Estante de grimórios",
      `<rect x="6" y="4" width="32" height="40" rx="2" fill="#4E342E" stroke="var(--ink)" stroke-width="1.4"/><path d="M6 18h32M6 32h32" stroke="#3E2723" stroke-width="2"/>${[8, 13, 18, 23, 28].map((x, i) => `<rect x="${x}" y="${7 + (i % 2)}" width="4" height="${10 - (i % 2)}" fill="${["#283593", "#7A1F2B", "#B8862B", "#2E7D32"][i % 4]}"/><rect x="${x + 1}" y="${21 + (i % 2)}" width="4" height="${10 - (i % 2)}" fill="${["#7A1F2B", "#B8862B", "#283593", "#2E7D32"][i % 4]}"/>`).join("")}<circle class="luzinha" cx="30" cy="38" r="3" fill="#80DEEA"/>`
    ]
  },
  {
    mundo: "bruxo",
    nome: "Cabana da bruxa",
    teto: ["Ervas secando", MOTIVO.abobora, ["#7CB342", "#FB8C00", "#9575CD"]],
    movel: [
      "Caldeirão no canto",
      `<path d="M8 44l-3 4M36 44l3 4" stroke="#37474F" stroke-width="2.4"/><path d="M6 22H38Q40 46 22 46Q4 46 6 22Z" fill="#263238" stroke="var(--ink)" stroke-width="1.4"/><rect x="3" y="18" width="38" height="6" rx="3" fill="#37474F"/><ellipse cx="22" cy="20" rx="16" ry="2.6" fill="#76FF03"/><circle class="luzinha" cx="16" cy="14" r="2.4" fill="#9CCC65"/><circle class="luzinha" style="--d:.6s" cx="26" cy="10" r="1.8" fill="#CE93D8"/>`
    ]
  }
];
KITS_MUNDO.forEach(k => {
  QUARTO_NOVOS.push(
    {
      slot: "teto",
      id: `q_kit_${k.mundo}_teto`,
      nome: k.teto[0],
      preco: 90,
      mundo: k.mundo,
      kit: k.mundo,
      svg: () => varal(360, k.teto[1], k.teto[2], 28, "pisca")
    },
    {
      slot: "movel",
      id: `q_kit_${k.mundo}_movel`,
      nome: k.movel[0],
      preco: 110,
      mundo: k.mundo,
      kit: k.mundo,
      svg: () => `<ellipse cx="22" cy="44" rx="18" ry="3" fill="#000" opacity=".12"/>${k.movel[1]}`
    }
  );
});
QUARTO.push(...QUARTO_NOVOS);
QUARTO_NOVOS.forEach(i => (ITEM_QUARTO[i.id] = i));

/* ===================== desenhos dos itens vivos ===================== */
function cortinaSVG(c, sombra, estrelas) {
  const lado = (x, dir) =>
    `<path d="M${x} 4Q${x + dir * 22} 30 ${x + dir * 6} 60Q${x + dir * 2} 80 ${x + dir * 14} 94H${x}Z" fill="${c}" stroke="${sombra}" stroke-width="1"/><path d="M${x + dir * 6} 8Q${x + dir * 14} 40 ${x + dir * 6} 90" stroke="${sombra}" stroke-width="1.4" fill="none"/>${estrelas ? [20, 46, 72].map(y => `<path d="M${x + dir * 8} ${y}l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2-.3z" fill="#FFD54F"/>`).join("") : ""}`;
  return `<rect x="0" y="0" width="106" height="4" rx="2" fill="#5D4037"/>${lado(2, 1)}${lado(104, -1)}`;
}

/** Quantas vezes os hábitos foram feitos nas últimas 2 semanas (crescimento das plantas). */
function cuidadoComPlantas() {
  let n = 0;
  for (let i = 0; i < 14; i++) n += (S.habitLog[addDays(today(), -i)] || []).length;
  return n;
}
function plantaQuarto(tipo, d) {
  const n = d && d.meu ? cuidadoComPlantas() : 8;
  const fase = n >= 20 ? 4 : n >= 10 ? 3 : n >= 5 ? 2 : n >= 1 ? 1 : 0; // 0 broto ... 4 florida
  const vaso = `<path d="M8 22H28L25 34H11Z" fill="#D84315" stroke="var(--ink)" stroke-width="1.2"/><rect x="6" y="20" width="24" height="4" rx="1" fill="#E64A19" stroke="var(--ink)" stroke-width="1"/>`;
  let p = "";
  if (tipo === "cacto") {
    const h = [3, 7, 11, 15, 17][fase];
    p = `<rect x="15" y="${20 - h}" width="6" height="${h}" rx="3" fill="#66BB6A" stroke="#2E7D32"/>${fase >= 2 ? `<path d="M15 ${18 - h / 2}h-4v-5" stroke="#66BB6A" stroke-width="4" stroke-linecap="round" fill="none"/>` : ""}${fase >= 3 ? `<path d="M21 ${16 - h / 3}h4v-4" stroke="#66BB6A" stroke-width="4" stroke-linecap="round" fill="none"/>` : ""}${fase >= 4 ? `<circle cx="18" cy="${19 - h}" r="2.6" fill="#F06292"/>` : ""}`;
  } else if (tipo === "girassol") {
    const h = [3, 8, 12, 16, 18][fase];
    p = `<path d="M18 20V${20 - h}" stroke="#43A047" stroke-width="2"/>${fase >= 1 ? `<path d="M18 16q-5-1-6-4q4 0 6 3M18 13q5-1 6-4q-4 0-6 3" fill="#66BB6A"/>` : ""}${fase >= 3 ? `<circle cx="18" cy="${20 - h}" r="${fase >= 4 ? 5 : 3}" fill="#FFC928" stroke="#E0A100"/><circle cx="18" cy="${20 - h}" r="${fase >= 4 ? 2.2 : 1.2}" fill="#6D4C2B"/>` : ""}`;
  } else {
    const folhas = [1, 3, 5, 7, 9][fase];
    for (let i = 0; i < folhas; i++) {
      const a = -80 + (i / Math.max(1, folhas - 1)) * 160;
      p += `<path d="M18 20Q${18 + Math.sin((a * Math.PI) / 180) * 10} ${20 - 6 - fase * 2} ${18 + Math.sin((a * Math.PI) / 180) * (8 + fase * 3)} ${20 - Math.cos((a * Math.PI) / 180) * (6 + fase * 3)}" stroke="#43A047" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
  }
  return `<g class="planta-viva fase${fase}">${p}${vaso}</g>`;
}

/** Céu da janela: cor e astros pela hora real; à noite, às vezes uma estrela cadente pra pegar. */
function janelaViva(d) {
  const h = new Date().getHours();
  const hora = h >= 5 && h < 8 ? "manha" : h >= 8 && h < 17 ? "dia" : h >= 17 && h < 19 ? "tarde" : "noite";
  const ceus = {
    manha: ["#FFCC80", "#B3E5FC"],
    dia: ["#64B5F6", "#BBDEFB"],
    tarde: ["#FF8A65", "#FFD180"],
    noite: ["#0D1B3D", "#283E7A"]
  };
  const [c1, c2] = ceus[hora];
  let astros = "";
  if (hora === "noite") {
    astros =
      [...Array(12)]
        .map(
          (_, i) =>
            `<circle class="estrelinha" style="--d:${(i * 0.4) % 3}s" cx="${8 + ((i * 37) % 74)}" cy="${6 + ((i * 23) % 50)}" r="${i % 4 ? 0.7 : 1.2}" fill="#fff"/>`
        )
        .join("") +
      `<circle cx="66" cy="16" r="7" fill="#F4F1DE"/><circle cx="69" cy="14" r="6.4" fill="${c1}"/>`;
    const e = d && d.meu ? quartoExtras() : null;
    const temCadente = e && e.cadente !== today() && hashTexto(today() + (S.codigo || "")) % 3 === 0;
    if (temCadente)
      astros += `<g class="cadente" data-act="estrela-cadente" style="cursor:pointer"><rect x="0" y="0" width="82" height="60" fill="transparent"/><path d="M58 8L30 26" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/><circle cx="30" cy="26" r="2" fill="#FFF59D"/></g>`;
  } else {
    const x = { manha: 14, dia: 40, tarde: 66 }[hora],
      y = { manha: 44, dia: 18, tarde: 44 }[hora];
    astros = `<circle cx="${x}" cy="${y}" r="9" fill="${hora === "tarde" ? "#FF7043" : "#FFD54F"}"/><path class="nuvem" d="M10 30q2-6 8-4q2-5 8-2q6 0 5 6z" fill="#fff" opacity=".85"/>`;
  }
  return `<rect x="0" y="0" width="90" height="80" rx="3" fill="#ECEFF1" stroke="var(--ink)" stroke-width="1.6"/><svg x="4" y="4" width="82" height="66" viewBox="0 0 82 66"><defs><linearGradient id="ceu-janela" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="82" height="66" fill="url(#ceu-janela)"/>${astros}<path d="M0 66L18 50L32 58L50 44L82 60V66Z" fill="${hora === "noite" ? "#1B2A4E" : "#7CB342"}" opacity=".8"/></svg><path d="M45 4V70M4 37H86" stroke="#ECEFF1" stroke-width="3"/><rect x="0" y="72" width="90" height="8" rx="1" fill="#CFD8DC" stroke="var(--ink)" stroke-width="1.2"/>`;
}

/** Escrivaninha: arrumada quando as tarefas de hoje estão feitas, bagunçada quando tem muita coisa pendente. */
function escrivaninhaSVG(d) {
  const pendentes = d && d.meu ? S.tasks.filter(t => t.date <= today() && !t.done).length : 1;
  const papeis = Math.min(6, pendentes);
  let pilha = "";
  for (let i = 0; i < papeis; i++)
    pilha += `<rect x="${70 + (i % 3) * 14 + ((i * 7) % 5)}" y="${20 - Math.floor(i / 3) * 3 - (i % 2)}" width="14" height="10" fill="#FAFAFA" stroke="#BDBDBD" stroke-width=".6" transform="rotate(${((i * 23) % 30) - 15} ${77 + (i % 3) * 14} 25)"/>`;
  const arrumada = papeis === 0;
  return `<rect x="10" y="26" width="124" height="6" rx="1.5" fill="#A1887F" stroke="var(--ink)" stroke-width="1.4"/><rect x="104" y="32" width="26" height="30" fill="#8D6E63" stroke="var(--ink)" stroke-width="1.2"/><path d="M104 46h26" stroke="var(--ink)" stroke-width="1"/><circle cx="117" cy="40" r="1.4" fill="#FFD54F"/><circle cx="117" cy="54" r="1.4" fill="#FFD54F"/><path d="M16 32V68" stroke="var(--ink)" stroke-width="3"/>
    <path d="M24 26V10l10-6" stroke="#455A64" stroke-width="2" fill="none"/><path d="M30 2l10 4l-4 6z" fill="#455A64"/>${arrumada ? `<path class="luz-mesa" d="M38 10L56 26H22Z" fill="#FFF59D" opacity=".35"/>` : ""}
    <rect x="44" y="12" width="20" height="14" rx="1" fill="#37474F"/><rect x="46" y="14" width="16" height="9" fill="${arrumada ? "#81D4FA" : "#455A64"}"/>
    ${arrumada ? `<path d="M80 26q-2-8 4-10q4 2 2 10z" fill="#66BB6A"/><rect x="78" y="20" width="10" height="6" fill="#E64A19"/><text x="96" y="22" font-size="5" fill="#2E7D32">✓</text>` : pilha}
    <rect x="24" y="44" width="22" height="24" rx="4" fill="#5C6BC0" stroke="var(--ink)" stroke-width="1.2"/><path d="M28 68v-4M42 68v-4" stroke="var(--ink)" stroke-width="2"/>`;
}

/** Mural de cortiça com os post-its das tarefas de hoje (some quando você conclui). */
function muralSVG(d) {
  const tarefas = d && d.meu ? S.tasks.filter(t => t.date === today() && !t.done).slice(0, 4) : [];
  const cores = ["#FFF59D", "#F8BBD0", "#B3E5FC", "#C8E6C9"];
  const postits = tarefas
    .map((t, i) => {
      const x = 4 + (i % 2) * 19,
        y = 6 + Math.floor(i / 2) * 22;
      const palavras = t.title
        .split(/\s+/)
        .slice(0, 2)
        .map(p => esc(p.slice(0, 7)));
      return `<g transform="rotate(${i % 2 ? 4 : -4} ${x + 8} ${y + 8})"><title>${esc(t.title)}</title><rect x="${x}" y="${y}" width="17" height="17" fill="${cores[i]}"/><circle cx="${x + 8.5}" cy="${y + 1.6}" r="1.2" fill="#E53935"/>${palavras.map((p, k) => `<text x="${x + 1.4}" y="${y + 7.4 + k * 5}" font-size="4.2" fill="#37474F">${p}</text>`).join("")}</g>`;
    })
    .join("");
  return `<rect x="0" y="0" width="44" height="52" rx="2" fill="#C8A165" stroke="#8D6E63" stroke-width="2.4"/>${[...Array(18)].map((_, i) => `<circle cx="${3 + ((i * 13) % 38)}" cy="${3 + ((i * 7) % 46)}" r=".5" fill="#8D6E63"/>`).join("")}${postits || `<text x="22" y="28" text-anchor="middle" font-size="5" fill="#5D4037">tudo feito</text>`}`;
}

/** Calendário do mês com os dias de sequência marcados (dias com tarefa concluída ou meta de água). */
function calendarioSVG(d) {
  const hoje = new Date(today() + "T12:00:00");
  const ano = hoje.getFullYear(),
    mes = hoje.getMonth();
  const primeiro = new Date(ano, mes, 1);
  const dias = new Date(ano, mes + 1, 0).getDate();
  const offset = (primeiro.getDay() + 6) % 7;
  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const marcado = dia => {
    if (!d || !d.meu) return dia % 3 === 0;
    const ds = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return (
      waterToday(ds) >= S.waterGoal ||
      S.tasks.some(t => t.done && (t.feitaEm || t.date) === ds) ||
      (S.habitLog[ds] || []).length > 0
    );
  };
  let c = "";
  for (let i = 1; i <= dias; i++) {
    const k = offset + i - 1;
    const x = 3 + (k % 7) * 5.6,
      y = 17 + Math.floor(k / 7) * 6;
    const m = i <= hoje.getDate() && marcado(i);
    c += `<rect x="${x}" y="${y}" width="4.6" height="4.6" rx=".8" fill="${m ? "#E53935" : "#ECEFF1"}"/>${i === hoje.getDate() ? `<rect x="${x - 0.6}" y="${y - 0.6}" width="5.8" height="5.8" rx="1" fill="none" stroke="#212121" stroke-width=".7"/>` : ""}`;
  }
  return `<rect x="0" y="2" width="44" height="54" rx="2" fill="#FFFFFF" stroke="var(--ink)" stroke-width="1.4"/><rect x="0" y="2" width="44" height="12" rx="2" fill="#E53935"/><text x="22" y="11" text-anchor="middle" font-size="7" font-weight="700" fill="#fff">${meses[mes]}</text><circle cx="12" cy="2" r="1.6" fill="#424242"/><circle cx="32" cy="2" r="1.6" fill="#424242"/>${c}`;
}

/** Quadro com a foto mais recente do Fotolog (o Prumi daquele dia). */
function quadroFotologSVG(d) {
  const f = d && d.meu && Array.isArray(S.fotolog) ? S.fotolog[0] : null;
  const mini = f
    ? prumi({ mood: f.mood || "happy", size: 30, eq: f.eq || {}, p: f.p, fill: f.agua || 0.5 }).replace(
        "<svg ",
        '<svg x="7" y="8" '
      )
    : prumi({ mood: "happy", size: 30, eq: (d && d.equip) || {}, p: d && d.persona }).replace(
        "<svg ",
        '<svg x="7" y="8" '
      );
  return `<rect x="0" y="0" width="44" height="56" rx="2" fill="#8D6E63" stroke="var(--ink)" stroke-width="1.4"/><rect x="4" y="4" width="36" height="48" fill="#FFF8E1"/>${mini}${f ? `<text x="22" y="50" text-anchor="middle" font-size="4.4" fill="#6D4C41">${esc(fmtShort(f.d || today()))}</text>` : ""}`;
}

/** Troféus: um por prova que já passou (até 6). */
function trofeusSVG(d, w, h) {
  const n = d && d.meu ? Math.min(6, S.exams.filter(e => e.date < today()).length) : 2;
  const taca = (x, y, c) =>
    `<path d="M${x} ${y}h8v4q0 5-4 5q-4 0-4-5z" fill="${c}" stroke="var(--ink)" stroke-width=".6"/><path d="M${x + 4} ${y + 9}v3M${x + 1.5} ${y + 13}h5" stroke="${c}" stroke-width="1.6"/>`;
  let t = "";
  for (let i = 0; i < n; i++)
    t += taca(
      4 + (i % 3) * 13,
      (i < 3 ? 6 : 26) + (h > 50 ? 4 : 0),
      ["#FFD54F", "#CFD8DC", "#FFB74D"][i % 3]
    );
  return `<rect x="0" y="${h > 50 ? 0 : 2}" width="${w}" height="${h - 2}" rx="2" fill="#795548" stroke="var(--ink)" stroke-width="1.2"/><path d="M2 ${h > 50 ? 24 : 22}H${w - 2}M2 ${h > 50 ? 44 : 42}H${w - 2}" stroke="#4E342E" stroke-width="2"/>${t || `<text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-size="5" fill="#D7CCC8">sem provas ainda</text>`}`;
}

function pelucia(c, tipo) {
  const olhos = `<circle cx="12" cy="12" r="1" fill="#212121"/><circle cx="18" cy="12" r="1" fill="#212121"/>`;
  const corpo = `<ellipse cx="15" cy="20" rx="9" ry="6" fill="${c}" stroke="var(--ink)" stroke-width="1"/>`;
  const cabeca = `<circle cx="15" cy="12" r="7" fill="${c}" stroke="var(--ink)" stroke-width="1"/>`;
  const extra = {
    urso: `<circle cx="9.5" cy="6.5" r="2.6" fill="${c}" stroke="var(--ink)" stroke-width="1"/><circle cx="20.5" cy="6.5" r="2.6" fill="${c}" stroke="var(--ink)" stroke-width="1"/>`,
    coelho: `<ellipse cx="11.5" cy="2" rx="2" ry="5" fill="${c}" stroke="var(--ink)" stroke-width="1"/><ellipse cx="18.5" cy="2" rx="2" ry="5" fill="${c}" stroke="var(--ink)" stroke-width="1"/>`,
    dino: `<path d="M10 6l2-3 2 3 2-3 2 3" fill="#43A047"/>`,
    polvo: `<path d="M8 18q-2 6 1 7M12 19q-1 6 2 6M18 19q1 6-2 6M22 18q2 6-1 7" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    gato: `<path d="M9 8l1-5 4 3M21 8l-1-5-4 3" fill="${c}" stroke="var(--ink)" stroke-width=".9"/>`,
    estrela: ""
  }[tipo];
  if (tipo === "estrela")
    return `<path d="M15 2l3.4 7 7.6 1-5.5 5.2 1.3 7.6L15 19l-6.8 3.8 1.3-7.6L4 10l7.6-1z" fill="${c}" stroke="var(--ink)" stroke-width="1"/>${olhos}<path d="M13 15q2 1.6 4 0" stroke="#212121" stroke-width=".8" fill="none"/>`;
  return `${tipo === "polvo" ? "" : corpo}${extra}${cabeca}${olhos}<path d="M13.6 15q1.4 1.2 2.8 0" stroke="#212121" stroke-width=".8" fill="none"/><circle cx="10" cy="14.4" r="1.2" fill="#F48FB1" opacity=".7"/><circle cx="20" cy="14.4" r="1.2" fill="#F48FB1" opacity=".7"/>`;
}

/* ===================== presentes e bagunça ===================== */
const PRESENTES = {
  presente_flores: {
    nome: "Flores",
    texto: "deixou flores no seu quarto",
    svg: `<path d="M10 22h10l-2 10h-6z" fill="#90CAF9" stroke="var(--ink)" stroke-width=".8"/>${[
      [10, 12, "#F06292"],
      [16, 8, "#FFD54F"],
      [21, 13, "#BA68C8"]
    ]
      .map(
        ([x, y, c]) =>
          `<path d="M15 22L${x} ${y}" stroke="#43A047" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3.2" fill="${c}"/>`
      )
      .join("")}`
  },
  presente_bolo: {
    nome: "Bolo",
    texto: "deixou um bolo no seu quarto",
    svg: `<ellipse cx="15" cy="30" rx="13" ry="3" fill="#ECEFF1"/><rect x="5" y="18" width="20" height="11" rx="2" fill="#F8BBD0" stroke="var(--ink)" stroke-width=".8"/><path d="M5 22q5 3 10 0q5 3 10 0" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M15 18v-5" stroke="#FFD54F" stroke-width="1.4"/><path d="M15 10q2 2 0 3q-2-1 0-3z" fill="#FF7043"/>`
  },
  presente_carta: {
    nome: "Cartinha",
    texto: "deixou uma cartinha no seu quarto",
    svg: `<rect x="4" y="16" width="22" height="15" rx="1.4" fill="#FFF8E1" stroke="var(--ink)" stroke-width=".8"/><path d="M4 16l11 8l11-8" stroke="#BCAAA4" fill="none"/><path d="M15 25l-2-2a1.4 1.4 0 0 1 2-2a1.4 1.4 0 0 1 2 2z" fill="#E53935"/>`
  },
  presente_caixa: {
    nome: "Caixinha surpresa",
    texto: "deixou uma caixinha surpresa no seu quarto",
    svg: `<rect x="5" y="16" width="20" height="15" rx="1.4" fill="#7E57C2" stroke="var(--ink)" stroke-width=".8"/><path d="M15 16v15M5 22h20" stroke="#FFD54F" stroke-width="2"/><path d="M15 16q-6-6-6-2q0 2 6 2q6 0 6-2q0-4-6 2z" fill="none" stroke="#FFD54F" stroke-width="1.6"/>`
  }
};
Object.entries(PRESENTES).forEach(([k, p]) => (MIMO_TEXTO[k] = p.texto));

const ROUPAS_BAGUNCA = [
  `<path d="M2 6l6-4h6l6 4-3 4-3-2v10H8V8L5 10z" fill="currentColor" stroke="var(--ink)" stroke-width=".8"/>`,
  `<path d="M4 2h12l2 14h-6l-2-8-2 8H2z" fill="currentColor" stroke="var(--ink)" stroke-width=".8"/>`,
  `<path d="M6 2h6v8l4 3q1 4-3 4H6q-2 0-2-3Z" fill="currentColor" stroke="var(--ink)" stroke-width=".8"/>`
];

/** Volta depois de 2+ dias sem abrir: roupas no chão. */
function conferirBagunca() {
  if (!S.onboarded) return;
  const e = quartoExtras();
  const ultima = e.ultimaVisita;
  if (ultima && diffDays(ultima, today()) >= 2 && !e.bagunca.length) {
    const n = Math.min(5, 2 + diffDays(ultima, today()));
    e.bagunca = [...Array(n)].map((_, i) => ({
      x: 10 + ((i * 67) % 140),
      y: 18 + ((i * 13) % 30),
      r: ((i * 47) % 60) - 30,
      c: ["#E57373", "#64B5F6", "#FFD54F", "#81C784", "#BA68C8"][i % 5],
      f: i % ROUPAS_BAGUNCA.length
    }));
  }
  if (e.ultimaVisita !== today()) {
    e.ultimaVisita = today();
    persist(true); // automático: não disputa com a nuvem na abertura
  }
}
document.addEventListener("DOMContentLoaded", conferirBagunca);

/* ===================== o quarto desenhado de novo, com as camadas novas ===================== */
quartoSVG = function (d = minhaEstante()) {
  const decor = d.decor || {};
  const padraoMundo =
    typeof quartoPadraoDoMundo === "function" ? quartoPadraoDoMundo(d.persona) : QUARTO_PADRAO;
  const q = { ...padraoMundo, ...(decor.quarto || {}) };
  if (!q.movel && q.movel !== "vazio") q.movel = "q_vitrola";
  const doMundoDele = x => !x.mundo || x.mundo === d.persona;
  const usar = slot => {
    const id = q[slot];
    const i = ITEM_QUARTO[id];
    if (i && i.slot === slot && doMundoDele(i) && (!d.meu || temDecor(i) || id === padraoMundo[slot]))
      return i;
    const defId = padraoMundo[slot] || QUARTO_PADRAO[slot];
    return (
      ITEM_QUARTO[defId] ||
      QUARTO.find(x => x.slot === slot && x.id === defId) ||
      QUARTO.find(x => x.slot === slot && x.id === QUARTO_PADRAO[slot]) ||
      null
    );
  };
  const extras = d.meu ? quartoExtras() : { pos: {}, bagunca: [], presentes: [] };
  const fundo = FUNDOS.find(f => f.id === decor.fundo && doMundoDele(f)) || FUNDOS[0];
  const est = estanteSVG(d, { semParede: true, semPrumi: true });
  const altEst = +(/viewBox="0 0 360 (\d+)"/.exec(est) || [0, 300])[1];
  const escala = 0.47,
    largE = Math.round(360 * escala),
    altE = Math.round(altEst * escala);
  const W = 360,
    altChao = 64;
  const H = Math.max(270, altE + altChao + 20);
  const chaoY = H - altChao;

  const cama = usar("cama");
  const mesa = cama && cama.mesa;
  const temCama = !!cama && !mesa;
  const movel = usar("movel");
  const posPoster = { esquerda: { x: 20, y: 26 }, centro: { x: 120, y: 30 }, direita: { x: 154, y: 34 } }[
    q.posPoster || "centro"
  ] || { x: 120, y: 30 };
  const posPetBase = {
    cama: temCama ? { x: 104, y: chaoY - 48 } : { x: 76, y: chaoY - 36 },
    tapete: { x: 80, y: chaoY + 12 },
    chao: { x: movel ? 106 : 154, y: chaoY + 12 }
  }[q.posPet || "cama"] || { x: 104, y: chaoY - 48 };
  const padrao = {
    teto: { x: 0, y: 0 },
    janela: { x: 16, y: 22 },
    cortina: { x: 8, y: 14 },
    planta: { x: 64, y: 70 },
    poster: posPoster,
    tapete: { x: 20, y: chaoY + 16 },
    cama: { x: 4, y: chaoY - 62 },
    pelucia: { x: 96, y: chaoY - 60 },
    pet: posPetBase,
    luz: { x: 146, y: chaoY - 86 },
    movel: { x: 148, y: chaoY + 4 }
  };
  const lugar = slot => {
    const p = ARRASTAVEIS[slot] && extras.pos && extras.pos[slot];
    return p && typeof p.x === "number"
      ? { x: Math.max(-10, Math.min(W - 20, p.x)), y: Math.max(0, Math.min(H - 20, p.y)) }
      : padrao[slot];
  };
  const em = (slot, extra = "") => {
    const i = usar(slot);
    if (!i) return "";
    const { x, y } = lugar(slot);
    const toque =
      i.toque && d.meu ? ` data-act="movel-tocar" data-id="${i.toque}" style="cursor:pointer"` : "";
    return `<g class="q-${slot}${ARRASTAVEIS[slot] ? " arrastavel" : ""}" data-slot="${slot}" transform="translate(${x} ${y})"${toque}${extra}>${i.svg(undefined, undefined, d)}</g>`;
  };
  const chao = usar("chao");
  const luz = usar("luz");
  const lendo = d.lendo && d.lendo.length;
  const px = mesa ? 30 : temCama ? 40 : 70,
    py = mesa ? chaoY - 88 : temCama ? chaoY - 104 : chaoY - 60;
  const leitor = prumi({
    mood: lendo ? "focus" : "happy",
    size: 62,
    eq: d.equip || {},
    p: d.persona
  }).replace("<svg ", `<svg x="${px}" y="${py}" `);
  const livroNaMao = lendo
    ? `<path d="M${px + 18} ${py + 58}l13 -3 13 3v10l-13 -3 -13 3z" fill="#FBF7EC" stroke="var(--ink)" stroke-width="1"/>`
    : "";
  const bagunca = (extras.bagunca || [])
    .map(
      (r, i) =>
        `<g class="roupa-chao" data-act="arrumar-bagunca" data-id="${i}" style="cursor:pointer;color:${r.c}" transform="translate(${r.x} ${chaoY + r.y}) rotate(${r.r} 10 10)"><rect width="22" height="20" fill="transparent"/>${ROUPAS_BAGUNCA[r.f] || ROUPAS_BAGUNCA[0]}</g>`
    )
    .join("");
  const presentes = (extras.presentes || [])
    .slice(-3)
    .map((p, i) =>
      PRESENTES[p.t]
        ? `<g class="presente" transform="translate(${6 + i * 30} ${chaoY + 20})"><title>${esc(PRESENTES[p.t].nome)} de ${esc(p.de || "um amigo")}</title>${PRESENTES[p.t].svg}</g>`
        : ""
    )
    .join("");
  const noite = new Date().getHours() >= 18 || new Date().getHours() < 6;
  return `<svg class="estante-svg quarto-svg ${noite ? "quarto-noite" : ""}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Quarto de leitura com ${d.lidos.length} livros lidos">
    <g class="parede">${fundo.svg(W, chaoY, { noQuarto: true })}</g>
    ${luz && luz.topo ? `<g>${luz.topo(W)}</g>` : ""}
    ${em("janela")}${em("cortina")}${em("planta")}${em("poster")}${em("teto")}
    <g transform="translate(0 ${chaoY})">${chao ? chao.svg(W, altChao) : ""}</g>
    <rect x="0" y="${chaoY - 4}" width="${W}" height="5" fill="rgba(0,0,0,.18)"/>
    ${em("tapete")}${em("cama")}${temCama ? em("pelucia") : ""}
    <g class="q-pet-slot" ${d.meu ? 'data-act="pet-tocar"' : ""} style="cursor:pointer">${em("pet")}</g>
    ${em("luz")}
    <svg x="${W - largE - 6}" y="${chaoY + 6 - altE}" width="${largE}" height="${altE}" viewBox="0 0 360 ${altEst}">${est.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</svg>
    ${em("movel")}${presentes}${bagunca}${caminhaPet(d, chaoY)}
    <g class="prumi-leitor" ${d.meu ? 'data-act="prumi-leitor"' : ""}>${leitor}${livroNaMao}</g>
  </svg>`;
};

/** O pet de verdade (js/pets.js) na caminha, com a plaquinha do nome. */
function caminhaPet(d, chaoY) {
  const pet = d.meu ? (typeof petAtivo === "function" ? petAtivo() : null) : d.pet;
  if (!pet || typeof petSVG !== "function") return "";
  const dorme = typeof dormindoAgora === "function" && dormindoAgora();
  const x = 64,
    y = chaoY + 6;
  return `<g class="caminha-pet" transform="translate(${x} ${y})"><title>${esc(pet.nome)}</title><ellipse cx="26" cy="40" rx="26" ry="8" fill="#000" opacity=".12"/><path d="M2 30Q2 18 26 18Q50 18 50 30V36Q50 44 26 44Q2 44 2 36Z" fill="#8D6E63" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="26" cy="30" rx="20" ry="7" fill="#FFCCBC"/><svg x="4" y="-4" width="44" height="41" viewBox="-4 -8 54 50">${petSVG(
    pet,
    { pose: dorme ? "dormindo" : "sentado", tam: 44 }
  )
    .replace(/^<svg[^>]*>/, "")
    .replace(
      /<\/svg>$/,
      ""
    )}</svg><rect x="14" y="38" width="24" height="7" rx="2" fill="#FFF8E1" stroke="#8D6E63" stroke-width=".6"/><text x="26" y="43.4" text-anchor="middle" font-size="4.6" fill="#5D4037">${esc(pet.nome.slice(0, 10))}</text></g>`;
}

/* ===================== ações ===================== */
ACOES_EXTRAS["estrela-cadente"] = () => {
  const e = quartoExtras();
  if (e.cadente === today()) return;
  e.cadente = today();
  S.leitura.saldo += 10;
  notificar({
    titulo: "Estrela cadente!",
    texto: "Você pegou uma estrela cadente. Faz um pedido! +10 páginas.",
    tipo: "conquista",
    mood: "party"
  });
  commit();
};
ACOES_EXTRAS["arrumar-bagunca"] = (b, id) => {
  const e = quartoExtras();
  const i = +id;
  if (!e.bagunca[i]) return;
  e.bagunca.splice(i, 1);
  S.leitura.saldo += 2;
  if (typeof tocarSom === "function") tocarSom("feito");
  if (!e.bagunca.length) react("party", "Quarto arrumado! Bem melhor assim.", 2800);
  else toast(`Arrumado! +2 páginas. Falta${e.bagunca.length === 1 ? "" : "m"} ${e.bagunca.length}.`);
  commit();
};

/* vitrola e rádio tocam um som de verdade (toque de novo pra parar) */
let musicaQuarto = null;
function pararMusicaQuarto() {
  if (musicaQuarto) musicaQuarto.parar();
  musicaQuarto = null;
}
function tocarMusicaQuarto(tipo) {
  const ctx = pegarAudio();
  if (!ctx) return;
  const saida = saidaMundo(ctx, 0.7);
  const ciclos = {
    vitrola: [
      [261.6, 329.6, 392, 493.9],
      [220, 261.6, 329.6, 392],
      [174.6, 220, 261.6, 329.6],
      [196, 246.9, 293.7, 349.2]
    ],
    radio: [
      [293.7, 370, 440],
      [246.9, 293.7, 370],
      [329.6, 415.3, 493.9],
      [220, 277.2, 329.6]
    ]
  }[tipo];
  let i = 0,
    vivo = true;
  const chiado = ambienteRuido(ctx, {
    freq: tipo === "radio" ? 2500 : 5000,
    tipo: "bandpass",
    vol: tipo === "radio" ? 0.03 : 0.015,
    q: 0.5
  });
  const passo = () => {
    if (!vivo) return;
    const t = ctx.currentTime + 0.05;
    const ac = ciclos[i++ % ciclos.length];
    ac.forEach((f, k) =>
      tocarTom(ctx, saida, t + k * 0.03, f, 1.9, tipo === "radio" ? "triangle" : "sine", 0.05, 0.05)
    );
    tocarTom(ctx, saida, t, ac[0] / 2, 1.6, "sine", 0.08, 0.02);
    bumbo(ctx, saida, t, 0.12);
    caixa(ctx, saida, t + 1, 0.04);
    setTimeout(passo, 2000);
  };
  passo();
  musicaQuarto = { tipo, parar: () => ((vivo = false), chiado.parar()) };
}
ACOES_EXTRAS["movel-tocar"] = (b, id) => {
  if (id === "vitrola" || id === "radio") {
    if (typeof alternarVitrola1930 === "function") {
      alternarVitrola1930();
      return;
    }
    if (typeof alternarMusicaPrumo === "function") {
      alternarMusicaPrumo();
      return;
    }
  }
  if (id === "aquario") {
    react("happy", "Os peixinhos vieram ver você e soltaram umas bolhinhas!", 2600);
    return;
  }
  if (musicaQuarto && musicaQuarto.tipo === id) {
    pararMusicaQuarto();
    toast(id === "vitrola" ? "Vitrola parada." : "Rádio desligado.");
    return;
  }
  pararMusicaQuarto();
  tocarMusicaQuarto(id);
  toast(
    id === "vitrola"
      ? "Tocando um disco. Toque de novo pra parar."
      : "Rádio ligado. Toque de novo pra desligar."
  );
};
ACOES_EXTRAS["vitrola-tocar"] = () => {
  if (typeof alternarVitrola1930 === "function") {
    alternarVitrola1930();
  }
};
document.addEventListener("click", e => {
  const t = e.target.closest("[data-tab]");
  if (t && musicaQuarto) pararMusicaQuarto(); // trocou de aba: para a música
});

/* ===================== kits ===================== */
function kitsDoMundo() {
  return KITS_MUNDO.filter(k => k.mundo === S.persona).map(k => {
    const ids = [`q_kit_${k.mundo}_teto`, `q_kit_${k.mundo}_movel`];
    const q = { ...QUARTO_PADRAO, ...(S.leitura.decor.quarto || {}) };
    const usando = ids.filter(id => q[ITEM_QUARTO[id].slot] === id).length;
    return { ...k, ids, usando, completo: usando === ids.length };
  });
}
function kitsHTML() {
  const ks = kitsDoMundo();
  if (!ks.length) return "";
  const e = quartoExtras();
  return `<h3 class="h3">Kit do mundo</h3>${ks
    .map(
      k =>
        `<div class="kit-mundo"><b>${esc(k.nome)}</b><span class="note">${k.ids.map(id => esc(ITEM_QUARTO[id].nome)).join(" + ")}. Use os dois e ganhe <b>+30 páginas</b>.</span><div class="cm-barra"><span style="width:${(k.usando / k.ids.length) * 100}%"></span></div>${k.completo && !e.kits.includes(k.mundo) ? `<button class="btn small primary" data-act="kit-premio" data-id="${k.mundo}">Pegar o bônus (+30 páginas)</button>` : e.kits.includes(k.mundo) ? `<span class="note">Kit completo!</span>` : ""}</div>`
    )
    .join("")}`;
}
ACOES_EXTRAS["kit-premio"] = (b, id) => {
  const e = quartoExtras();
  const k = kitsDoMundo().find(x => x.mundo === id);
  if (!k || !k.completo || e.kits.includes(id)) return;
  e.kits.push(id);
  S.leitura.saldo += 30;
  notificar({
    titulo: "Kit completo!",
    texto: `${k.nome}: +30 páginas pra decorar.`,
    tipo: "conquista",
    mood: "party"
  });
  commit();
};

/* ===================== arrumar (posição livre) ===================== */
let arrumandoQuarto = false;
ACOES_EXTRAS["quarto-arrumar"] = () => {
  arrumandoQuarto = !arrumandoQuarto;
  document.documentElement.classList.toggle("arrumando-quarto", arrumandoQuarto);
  toast(
    arrumandoQuarto
      ? "Arraste o pôster, o bichinho, o móvel e a pelúcia. Toque em Pronto quando terminar."
      : "Quarto arrumado!"
  );
  render();
};
ACOES_EXTRAS["quarto-pos-reset"] = () => {
  quartoExtras().pos = {};
  commit();
};
function arrumarHTML() {
  return `<div class="row arrumar-quarto"><button class="btn small ${arrumandoQuarto ? "primary" : ""}" data-act="quarto-arrumar">${arrumandoQuarto ? "Pronto" : "Arrastar coisas no quarto"}</button>${Object.keys(quartoExtras().pos).length ? `<button class="btn small ghost" data-act="quarto-pos-reset">Voltar ao lugar</button>` : ""}</div>`;
}
{
  let arrasto = null;
  document.addEventListener("pointerdown", e => {
    if (!arrumandoQuarto) return;
    const g = e.target.closest(".quarto-svg .arrastavel");
    if (!g) return;
    const svg = g.ownerSVGElement;
    const pt = svg.createSVGPoint();
    const paraSVG = ev => {
      pt.x = ev.clientX;
      pt.y = ev.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(g.getAttribute("transform")) || [0, 0, 0];
    const ini = paraSVG(e);
    arrasto = { g, slot: g.dataset.slot, x0: +m[1], y0: +m[2], ini, paraSVG };
    e.preventDefault();
    g.setPointerCapture && g.setPointerCapture(e.pointerId);
  });
  document.addEventListener("pointermove", e => {
    if (!arrasto) return;
    const p = arrasto.paraSVG(e);
    arrasto.x = Math.round(arrasto.x0 + p.x - arrasto.ini.x);
    arrasto.y = Math.round(arrasto.y0 + p.y - arrasto.ini.y);
    arrasto.g.setAttribute("transform", `translate(${arrasto.x} ${arrasto.y})`);
  });
  document.addEventListener("pointerup", () => {
    if (!arrasto) return;
    if (typeof arrasto.x === "number") {
      quartoExtras().pos[arrasto.slot] = { x: arrasto.x, y: arrasto.y };
      persist();
    }
    arrasto = null;
  });
}

/* ===================== presente para um amigo ===================== */
function presenteHTML(uid) {
  return `<div class="presentes-amigo"><span class="note">Deixar um presente no quarto:</span><div class="row">${Object.entries(
    PRESENTES
  )
    .map(
      ([k, p]) =>
        `<button class="btn small" data-act="amigo-presente" data-id="${esc(uid)}" data-t="${k}"><svg viewBox="0 0 30 34" width="18" height="20" aria-hidden="true">${p.svg}</svg>${p.nome}</button>`
    )
    .join("")}</div></div>`;
}
ACOES_EXTRAS["amigo-presente"] = (b, id) => {
  if (!PRESENTES[b.dataset.t]) return;
  mandarMimo(id, b.dataset.t);
};
/** Chamado quando chega um mimo de presente (js/amigos.js, receberItem). */
function guardarPresente(i) {
  if (!PRESENTES[i.mimo]) return;
  const e = quartoExtras();
  e.presentes.push({ t: i.mimo, de: String(i.deNome || "").slice(0, 30), em: today() });
  persist();
}
