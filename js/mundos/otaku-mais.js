/*
  Mundo Otaku, caprichado (vem depois de otaku.js e otaku-extras.js):
  - Falas novas (várias por momento, como no emo).
  - Sub-temas: Shoujo, Shonen, Mecha, Neo Tóquio, Mangá preto e branco, Festival de verão.
  - Efeitos: linhas de velocidade e onomatopeia na troca de aba; balão "SUGOI!" ao concluir tarefa;
    linhas de concentração em volta do cronômetro no foco (estilos/mundos/otaku.css).
  - Mais roupinhas: cabelos de anime, olhos brilhando, faixas, uniformes, armas de madeira e mascotes.
*/
"use strict";

Object.assign(PERSONAS.otaku, {
  desc: "Protagonista da própria história: anime, determinação e lámen da madrugada.",
  sad: [
    "Senpai não me notou hoje... buá.",
    "Episódio de enchimento sem você. Volta, protagonista!",
    "Fiquei olhando pela janela da sala igual cena triste de anime..."
  ],
  placeholder: "Qual é a missão de hoje, protagonista?",
  hi: [
    "Ohayo{nome}! Hoje são <b>{n}</b> missões. O arco de treinamento começa!",
    "Abertura tocando{nome}! Episódio de hoje: <b>{n}</b> desafios.",
    "Yosh{nome}! <b>{n}</b> tarefas e muita determinação.",
    'O narrador disse: "e assim começa mais um dia". São <b>{n}</b> missões{nome}.',
    "Kon'nichiwa{nome}! Prepara o lámen: <b>{n}</b> tarefas no roteiro."
  ],
  cheers: [
    "Sugoi! Uma a menos!",
    "Isso foi digno de protagonista!",
    "Power up! Continua assim!",
    "Golpe crítico na lista de tarefas!",
    "O público tá gritando seu nome!",
    "Nível subindo... subindo... SUBIU!",
    "Kira kira! Riscou com estilo.",
    "Nem o rival faria tão rápido.",
    "Plot twist: você é muito produtivo."
  ],
  drink: [
    "<b>+{ml} mL</b> de chakra recuperado!",
    "Glub! <b>+{ml} mL</b>. Barra de energia subindo.",
    "<b>+{ml} mL</b> de chá gelado de máquina de vending.",
    "Recuperou <b>{ml} mL</b> de HP. Pronto pro próximo round!",
    "<b>+{ml} mL</b>. Todo protagonista se hidrata antes da luta."
  ],
  goal: [
    "Meta de água batida! Forma final desbloqueada.",
    "Barra de chakra cheia! Pode usar o golpe especial.",
    "Hidratação nível chefe final. Sugoi!"
  ],
  thirsty: [
    "Meu chakra tá acabando! Faltam <b>{ml} mL</b>.",
    "HP baixo, piscando vermelho! Bebe <b>{ml} mL</b>.",
    "Nem herói luta com sede. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> atrasadas... é o arco do vilão. Vamos superar!",
    "<b>{n}</b> missões do episódio passado. Hora do flashback e da virada!",
    "O vilão roubou <b>{n}</b> tarefas. Bora recuperar?"
  ],
  night: [
    "Oyasumi! Fecha o dia e descansa.",
    "Cena pós-créditos: você dormindo bem. Fecha o dia!",
    "Até o protagonista precisa de um episódio de descanso."
  ],
  done: [
    "Episódio do dia concluído. Que final épico!",
    "Todas as missões cumpridas! Música de encerramento tocando.",
    "Lista vazia. Isso merece uma temporada nova."
  ],
  focus: [
    "Treino intenso, igual montagem de anime.",
    "Linhas de concentração ativadas. Foco total!",
    "Modo treino: nem o lámen te distrai."
  ]
});

THEMES.otaku.vars.splice(
  2,
  0,
  {
    id: "shoujo",
    name: "Shoujo pastel",
    price: 120,
    f: '"Fredoka"',
    L: ["#FFF4FA", "#FFFFFF", "#3A1E35", "#E35BA8", "#F7A8D2", "#FFFAFD", "#3A1E35"],
    D: ["#1A0E18", "#261424", "#FFE8F6", "#FF8ACB", "#F7A8D2", "#2E1A2B", "#261424"],
    part: "heart",
    wn: "Chá de morango",
    pat: ["heart", "petal"]
  },
  {
    id: "shonen",
    name: "Shonen de batalha",
    price: 140,
    f: '"Bowlby One"',
    ds: 0.85,
    L: ["#FFF4E6", "#FFFFFF", "#1A1208", "#F06A00", "#FF9F1C", "#FFFBF5", "#1A1208"],
    D: ["#120C05", "#1E150A", "#FFEEDB", "#FF8A1C", "#FFB04D", "#2A1E10", "#1E150A"],
    part: "bolt",
    wn: "Energia de luta",
    pat: ["bolt", "star"]
  },
  {
    id: "mecha",
    name: "Piloto de mecha",
    price: 150,
    f: '"Oswald"',
    L: ["#EEF2F6", "#FFFFFF", "#101820", "#1565C0", "#90A4AE", "#F7F9FB", "#101820"],
    D: ["#080C10", "#111820", "#E3ECF5", "#4FA3FF", "#90A4AE", "#1C2630", "#111820"],
    part: "pixel",
    wn: "Fluido de refrigeração",
    pat: ["pixel", "bolt"]
  },
  {
    id: "neotoquio",
    name: "Neo Tóquio",
    price: 160,
    f: '"VT323"',
    ds: 1.2,
    L: ["#F2EEFF", "#FFFFFF", "#120A26", "#E5007E", "#00B8D4", "#FAF8FF", "#120A26"],
    D: ["#07040F", "#100A20", "#F5E9FF", "#FF2E97", "#00E5FF", "#1C1230", "#100A20"],
    part: "spark",
    wn: "Refri neon",
    pat: ["spark", "pixel"]
  },
  {
    id: "manga",
    name: "Mangá preto e branco",
    price: 140,
    f: '"Bangers", "Bowlby One"',
    L: ["#F4F4F4", "#FFFFFF", "#0A0A0A", "#0A0A0A", "#555555", "#FFFFFF", "#0A0A0A"],
    D: ["#0A0A0A", "#151515", "#F4F4F4", "#F4F4F4", "#9E9E9E", "#1E1E1E", "#151515"],
    part: "spark",
    wn: "Tinta nanquim",
    pat: ["star", "plus"]
  },
  {
    id: "festival",
    name: "Festival de verão",
    price: 130,
    a: ["#D84315", "#FF8A65"],
    w: ["#F9A825", "#FFD54F"],
    part: "spark",
    wn: "Raspadinha de morango",
    pat: ["star", "petal"]
  }
);

/* ---------- efeitos ---------- */
const ONOMATOPEIAS = ["ドドド", "ゴゴゴ", "バーン", "キラキラ", "シュッ", "ドーン"];
function linhasDeVelocidade(texto) {
  if (RM) return;
  const velho = document.getElementById("linhas-otaku");
  if (velho) velho.remove();
  const el = document.createElement("div");
  el.id = "linhas-otaku";
  el.setAttribute("aria-hidden", "true");
  const raios = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * 360 + Math.random() * 4;
    const l = 30 + Math.random() * 22;
    return `<path d="M0 -${100 - l}L-${0.8 + Math.random() * 1.4} -100H${0.8 + Math.random() * 1.4}Z" transform="rotate(${a.toFixed(1)})"/>`;
  }).join("");
  el.innerHTML = `<svg viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice"><g fill="currentColor">${raios}</g></svg>${texto ? `<b class="sfx-otaku">${texto}</b>` : ""}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
function balaoSugoi(alvo) {
  if (RM) return;
  const r =
    alvo && alvo.getBoundingClientRect
      ? alvo.getBoundingClientRect()
      : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
  const el = document.createElement("div");
  el.className = "sugoi-otaku";
  el.setAttribute("aria-hidden", "true");
  el.textContent = pick(["SUGOI!", "YOSH!", "KIRA!", "NICE!", "SUGEE!"]);
  el.style.left = Math.min(innerWidth - 120, Math.max(10, r.left + r.width + 8)) + "px";
  el.style.top = Math.max(60, r.top - 30) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}
{
  const trocaAntes = MUNDO_FX.otaku.trocaAba;
  MUNDO_FX.otaku.trocaAba = () => {
    const v = themeVar("otaku").id;
    if (v === "shonen" || v === "manga" || v === "mecha" || Math.random() < 0.35)
      linhasDeVelocidade(pick(ONOMATOPEIAS));
    else trocaAntes();
  };
  const concluirAntes = MUNDO_FX.otaku.aoConcluir;
  MUNDO_FX.otaku.aoConcluir = (x, el) => {
    concluirAntes(x, el);
    balaoSugoi(el);
  };
}
MUNDO_FX.otaku.humorNomes = {
  Radiante: "Modo kira kira",
  Feliz: "Sugoi",
  "De boa": "Na paz do dojo",
  Chateado: "Gota de suor",
  Triste: "Chuva de anime",
  Arrasado: "Fim de temporada"
};
Object.assign(MUNDO_FX.otaku.textos, {
  sequencia: ["dia de treino", "dias de treino"],
  trazerTudo: "Trazer pro episódio de hoje"
});

/* ---------- roupinhas novas ---------- */
const olhoAnime = (x, cor) =>
  `<ellipse cx="${x}" cy="64" rx="6.4" ry="8" fill="#fff" ${O} stroke-width="1.6"/><ellipse cx="${x}" cy="66" rx="4.6" ry="6" fill="${cor}"/><ellipse cx="${x}" cy="67" rx="2.4" ry="3.4" fill="#141414"/><circle cx="${x - 2}" cy="61.5" r="2" fill="#fff"/><circle cx="${x + 2}" cy="69" r="1" fill="#fff"/>`;
const cabeloAnime = (c, sombra) =>
  `<path d="M18 62Q12 26 44 18Q60 12 78 18Q108 26 102 62Q98 50 92 46L94 56Q86 44 80 40L80 52Q72 40 64 38L60 50L56 38Q46 40 40 52L40 40Q32 44 28 56L28 46Q22 50 18 62Z" fill="${c}" ${O}/><path d="M40 26Q54 20 70 24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55" fill="none"/>${sombra ? `<path d="M30 36Q60 28 90 36" stroke="${sombra}" stroke-width="2" fill="none" opacity=".5"/>` : ""}`;

ITEMS.push(
  {
    id: "otaku_cabelo_azul",
    p: "otaku",
    slot: "hair",
    name: "Cabelo de protagonista",
    price: 120,
    svg: () => cabeloAnime("#2F5FD0", "#1B3A8A")
  },
  {
    id: "otaku_cabelo_loiro",
    p: "otaku",
    slot: "hair",
    name: "Cabelo de rival loiro",
    price: 130,
    svg: () =>
      hairSpiky("#FFD54F") + `<path d="M40 30L44 18M60 26V10M80 30L78 18" stroke="#F9A825" stroke-width="2"/>`
  },
  {
    id: "otaku_maria_chiquinha",
    p: "otaku",
    slot: "hair",
    name: "Maria-chiquinha longa",
    price: 140,
    svg: () =>
      cabeloAnime("#7E57C2", "#4527A0") +
      [18, 102]
        .map(
          x =>
            `<path d="M${x} 50Q${x + (x < 60 ? -14 : 14)} 80 ${x + (x < 60 ? -6 : 6)} 128Q${x} 110 ${x} 90" fill="#7E57C2" ${O}/><circle cx="${x}" cy="50" r="4.6" fill="#FF4F9A" ${O} stroke-width="1.4"/>`
        )
        .join("")
  },
  {
    id: "otaku_olhos_brilho",
    p: "otaku",
    slot: "face",
    name: "Olhos brilhando de anime",
    price: 110,
    svg: () => olhoAnime(47, "#5C6BC0") + olhoAnime(73, "#5C6BC0")
  },
  {
    id: "otaku_olhos_estrela",
    p: "otaku",
    slot: "face",
    name: "Olhos de estrelinha",
    price: 120,
    svg: () => [47, 73].map(x => star5(x, 64, 7, "#FFD54F")).join("")
  },
  {
    id: "otaku_curativo",
    p: "otaku",
    slot: "cheek",
    name: "Curativo de herói",
    price: 50,
    svg: () =>
      `<rect x="74" y="70" width="14" height="6" rx="2" fill="#FFCC80" ${O} stroke-width="1.2" transform="rotate(-20 81 73)"/><path d="M79 71v4M83 70v4" stroke="#E0A060" stroke-width=".8" transform="rotate(-20 81 73)"/>`
  },
  {
    id: "otaku_blush",
    p: "otaku",
    slot: "cheek",
    name: "Blush tímido",
    price: 40,
    svg: () =>
      `<g stroke="#FF6F9A" stroke-width="1.6" stroke-linecap="round"><path d="M34 74l3 -4M38 75l3 -4M42 76l3 -4"/><path d="M76 72l3 -4M80 73l3 -4M84 74l3 -4"/></g>`
  },
  {
    id: "otaku_boca_gato",
    p: "otaku",
    slot: "mouth",
    name: "Boquinha de gato",
    price: 50,
    svg: () =>
      `<path d="M52 74q4 4 8 0q4 4 8 0" stroke="var(--ink)" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
  },
  {
    id: "otaku_presa",
    p: "otaku",
    slot: "mouth",
    name: "Dentinho de vampira",
    price: 60,
    svg: () =>
      `<path d="M50 74Q60 80 70 74" stroke="var(--ink)" stroke-width="2" fill="none"/><path d="M63 76l2 5 2 -5.4z" fill="#fff" stroke="var(--ink)" stroke-width="1"/>`
  },
  {
    id: "otaku_sino",
    p: "otaku",
    slot: "neck",
    name: "Coleira com sininho",
    price: 70,
    svg: () =>
      `<path d="M30 84Q60 100 90 84" stroke="#E53935" stroke-width="5" fill="none"/><circle cx="60" cy="98" r="5" fill="#FFD54F" ${O} stroke-width="1.4"/><path d="M57 98h6M60 98v4" stroke="#B7892B" stroke-width="1"/>`
  },
  {
    id: "otaku_gakuran",
    p: "otaku",
    slot: "top",
    name: "Uniforme gakuran",
    price: 140,
    svg: () =>
      topBase("#1B1F2A") +
      `<path d="M54 86h12v64H54z" fill="#262B38"/>${[96, 108, 120, 132].map(y => `<circle cx="60" cy="${y}" r="2" fill="#E8C55A"/>`).join("")}<path d="M46 84L60 92L74 84" stroke="#3A4152" stroke-width="4" fill="none"/>` +
      topHem
  },
  {
    id: "otaku_jaqueta_luta",
    p: "otaku",
    slot: "top",
    name: "Kimono de luta laranja",
    price: 150,
    svg: () =>
      topBase("#F57C00") +
      `<path d="M40 84L64 120L66 150H56L52 120Z" fill="#1565C0" opacity=".9"/><path d="M80 84L58 118" stroke="#E65100" stroke-width="4"/><rect x="0" y="122" width="120" height="8" fill="#1565C0"/><circle cx="90" cy="104" r="8" fill="#FFF8E1" ${O} stroke-width="1.4"/><text x="90" y="108" font-size="10" text-anchor="middle" font-weight="900" fill="#E65100">亀</text>` +
      topHem
  },
  {
    id: "otaku_piloto",
    p: "otaku",
    slot: "top",
    name: "Traje de piloto",
    price: 170,
    svg: () =>
      topBase("#ECEFF1") +
      `<path d="M0 100H40L48 150H0Z M120 100H80L72 150H120Z" fill="#E53935" ${O}/><path d="M44 86H76L72 110H48Z" fill="#37474F" ${O}/><circle cx="60" cy="98" r="3.4" fill="#00E5FF"/>` +
      topHem
  },
  {
    id: "otaku_mochila",
    p: "otaku",
    slot: "back",
    name: "Mochila escolar randoseru",
    price: 130,
    svg: () =>
      `<rect x="4" y="88" width="30" height="40" rx="8" fill="#C62828" ${O}/><rect x="4" y="88" width="30" height="16" rx="8" fill="#B71C1C" ${O}/><circle cx="19" cy="104" r="2.4" fill="#FFD54F"/><path d="M34 92Q46 90 50 100" stroke="#5D4037" stroke-width="3" fill="none"/>`
  },
  {
    id: "otaku_asas",
    p: "otaku",
    slot: "back",
    name: "Asinhas de anjo",
    price: 160,
    svg: () =>
      `<path d="M24 92Q-6 70 2 110Q10 100 14 112Q18 100 26 108Z" fill="#fff" ${O}/><path d="M96 92Q126 70 118 110Q110 100 106 112Q102 100 94 108Z" fill="#fff" ${O}/>`
  },
  {
    id: "otaku_pulseira",
    p: "otaku",
    slot: "wrist",
    name: "Pulseira de miçangas kawaii",
    price: 40,
    svg: () =>
      [10, 15, 20, 25]
        .map(
          (x, i) =>
            `<circle cx="${x}" cy="121" r="2.6" fill="${["#FF7AA8", "#81D4FA", "#FFF59D", "#B39DDB"][i]}" ${O} stroke-width=".8"/>`
        )
        .join("")
  },
  {
    id: "otaku_katana",
    p: "otaku",
    slot: "hand",
    name: "Katana de madeira",
    price: 140,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 8Q10 -20 26 -40" stroke="#ECEFF1" stroke-width="3.6" stroke-linecap="round" fill="none"/><path d="M0 8Q10 -20 26 -40" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" fill="none" opacity=".15"/><path d="M-6 2l12 6" stroke="#212121" stroke-width="3" stroke-linecap="round"/><path d="M-2 12L2 2" stroke="#5D4037" stroke-width="4" stroke-linecap="round"/>`
      )
  },
  {
    id: "otaku_microfone",
    p: "otaku",
    slot: "hand",
    name: "Microfone de idol",
    price: 120,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 12L6 -6" stroke="#F48FB1" stroke-width="3.4" stroke-linecap="round"/><circle cx="7" cy="-10" r="6" fill="#ECEFF1" stroke="var(--ink)" stroke-width="1.4"/><path d="M3 -12h8M3 -9h8" stroke="#B0BEC5" stroke-width=".8"/>${star5(12, -20, 3.4, "#FFD54F")}`
      )
  },
  {
    id: "otaku_lamen",
    p: "otaku",
    slot: "hand",
    name: "Tigela de lámen",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-12 -2H12Q11 12 0 12Q-11 12 -12 -2Z" fill="#E53935" stroke="var(--ink)" stroke-width="1.4"/><path d="M-10 -2q4 -4 8 0t8 0" stroke="#FBC02D" stroke-width="2" fill="none"/><circle cx="6" cy="-4" r="3" fill="#FFF8E1" stroke="#FBC02D" stroke-width="1"/><path d="M4 -10L-8 -24M8 -10L-2 -26" stroke="#8D6E63" stroke-width="1.4"/><g class="vapor"><path d="M-4 -6q-2 -5 1 -9" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/></g>`
      )
  },
  {
    id: "otaku_mascote_raposa",
    p: "otaku",
    slot: "pet",
    name: "Kitsune de nove caudas",
    price: 180,
    svg: () =>
      `<g transform="translate(16 128)">${[-50, -25, 0, 25, 50].map(a => `<path d="M-2 4Q-14 -6 -12 -20Q-4 -12 -2 4Z" fill="#FFB74D" stroke="var(--ink)" stroke-width=".8" transform="rotate(${a} -2 4)"/>`).join("")}<path d="M-8 10Q-9 -2 0 -3Q9 -2 8 10Z" fill="#FF9800" stroke="var(--ink)" stroke-width="1"/><circle cy="-7" r="6.5" fill="#FF9800" stroke="var(--ink)" stroke-width="1"/><path d="M-5 -11l-2 -6 5 3M5 -11l2 -6 -5 3" fill="#FF9800" stroke="var(--ink)" stroke-width=".8"/><path d="M-4 -4q4 3 8 0" fill="#fff"/><path d="M-3 -8q1 -1 2 0M1 -8q1 -1 2 0" stroke="#212121" stroke-width=".9" fill="none"/></g>`
  },
  {
    id: "otaku_mascote_mochi",
    p: "otaku",
    slot: "pet",
    name: "Mochi falante",
    price: 120,
    svg: () =>
      `<g transform="translate(15 132)"><ellipse rx="11" ry="8" fill="#FFF0F5" stroke="var(--ink)" stroke-width="1.1"/><circle cx="-4" cy="-1" r="1.2" fill="#212121"/><circle cx="4" cy="-1" r="1.2" fill="#212121"/><path d="M-2 2q2 2 4 0" stroke="#212121" stroke-width=".8" fill="none"/><ellipse cx="-7" cy="2" rx="2" ry="1.2" fill="#F8BBD0"/><ellipse cx="7" cy="2" rx="2" ry="1.2" fill="#F8BBD0"/><path d="M-2 -8l2 -4 2 4" fill="#81C784"/></g>`
  },
  {
    id: "otaku_cidade",
    p: "otaku",
    slot: "bg",
    name: "Neo Tóquio à noite",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#120A26" opacity=".55"/>` +
      [
        [0, 70, 16],
        [18, 50, 14],
        [34, 84, 12],
        [86, 60, 14],
        [102, 40, 18]
      ]
        .map(
          ([x, y, w]) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${148 - y}" fill="#2A1A4A" opacity=".85"/>` +
            Array.from(
              { length: 4 },
              (_, i) =>
                `<rect class="pisca" style="animation-delay:${((x + i) % 7) / 3}s" x="${x + 3}" y="${y + 6 + i * 14}" width="4" height="4" fill="${i % 2 ? "#FF2E97" : "#00E5FF"}"/>`
            ).join("")
        )
        .join("") +
      `<rect class="neon" x="88" y="30" width="26" height="10" rx="2" fill="none" stroke="#FF2E97" stroke-width="1.6"/>`
  },
  {
    id: "otaku_sala",
    p: "otaku",
    slot: "bg",
    name: "Sala de aula ao entardecer",
    price: 160,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#FFB74D" opacity=".35"/><rect x="2" y="4" width="40" height="50" fill="#FFE0B2" opacity=".7" stroke="#8D6E63" stroke-width="2"/><path d="M22 4v50M2 29h40" stroke="#8D6E63" stroke-width="2"/><rect x="70" y="10" width="48" height="26" fill="#2E7D32" opacity=".6"/><path d="M76 18h20M76 26h30" stroke="#fff" stroke-width="1.4" opacity=".8"/>`
  },
  {
    id: "otaku_coroa_estrela",
    p: "otaku",
    slot: "hat",
    name: "Tiara de idol",
    ach: "habito21",
    svg: () =>
      `<path d="M28 44Q60 26 92 44" stroke="#F8BBD0" stroke-width="4" fill="none"/>` +
      star5(60, 28, 9, "#FFD54F") +
      `<circle class="brilhinho" cx="44" cy="34" r="2.6" fill="#FFF59D"/><circle class="brilhinho" style="animation-delay:.4s" cx="76" cy="34" r="2.6" fill="#FFF59D"/>`
  },
  {
    id: "otaku_aura",
    p: "otaku",
    slot: "skin",
    name: "Aura de poder",
    price: 200,
    color: "#FFF6D5",
    ink: "#5D4037",
    svg: () =>
      `<path class="brilhinho" d="${BODY}" fill="none" stroke="#FFD54F" stroke-width="12" opacity=".75"/><path d="M30 120l6 -10M88 118l-5 -9M60 140v-12" stroke="#FFB300" stroke-width="2.4" stroke-linecap="round"/>`
  }
);
