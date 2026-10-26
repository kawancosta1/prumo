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
  },
  {
    id: "otaku_carta_senpai",
    p: "otaku",
    slot: "hand",
    name: "Carta do Senpai",
    price: 150,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-10" y="-8" width="20" height="14" rx="2" fill="#FFF0F5" stroke="var(--ink)" stroke-width="1.2"/><path d="M-10 -8L0 0L10 -8" stroke="var(--ink)" stroke-width="1.2" fill="none"/><path d="M0 0l-3 4h6z" fill="#E91E63"/>`
      )
  }
);

/* ==========================================================================
   OTAKU: LEVA 1 (Itens 1 a 10) - Temporadas, Vilão, Rival, Golpes e Rotina Anime
   ========================================================================== */

const NOMES_TEMPORADAS_OTAKU = [
  "O Despertar do Protagonista",
  "Arco da Determinação Infinita",
  "A Batalha pelo Amanhã",
  "Torneio dos Mestres",
  "A Chama da Coragem",
  "O Segredo da Estrela Cadente",
  "Rumo ao Topo do Mundo",
  "Aliança dos Heróis",
  "O Mistério do Templo Oculto",
  "Crônicas da Primavera Eterna",
  "O Golpe Final",
  "A Lenda Renascida"
];

function temporadaOtakuAtual() {
  const m = today().slice(0, 7);
  const idx = (parseInt(m.slice(5, 7), 10) - 1) % NOMES_TEMPORADAS_OTAKU.length;
  return { mes: m, nome: `Temporada ${m.slice(5, 7)}: ${NOMES_TEMPORADAS_OTAKU[idx]}` };
}

// 1. Temporadas: abertura no Hoje
function aberturaTemporadaHTML() {
  const t = temporadaOtakuAtual();
  const d = dadosMundo("otaku");
  const ehDia1 = today().slice(8) === "01";
  if (d.aberturaVista === t.mes) return "";
  if (!ehDia1 && d.aberturaVista) return "";
  return cartaoMundo(
    "cm-abertura",
    "Abertura da Temporada!",
    esc(t.nome),
    `<p class="note">Música épica tocando, pétalas ao vento e uma nova jornada que começa!</p>
     <div class="cm-botoes">
       <button class="btn small primary" data-act="otaku-abertura">Assistir abertura (+5 gotas)</button>
     </div>`
  );
}

ACOES_EXTRAS["otaku-abertura"] = () => {
  const t = temporadaOtakuAtual();
  const d = dadosMundo("otaku");
  d.aberturaVista = t.mes;
  premioMundo(5, "Abertura assistida! Nova temporada iniciada! +5 gotas.");
  MUNDO_FX.otaku.trocaAba();
  commit();
};

// 2. Próximo episódio: ao fechar o dia
function proximoEpisodioHTML() {
  if (!S.journal[today()]) return "";
  const amanha = addDays(today(), 1);
  const marcadas = S.tasks.filter(t => !t.done && t.date === amanha);
  const nomeHeroi = S.name || "nosso herói";
  const texto = marcadas.length
    ? `No próximo episódio de Prumo: "${esc(marcadas[0].title)}"! Conseguirá ${esc(nomeHeroi)} superar mais este desafio? Não perca!`
    : `No próximo episódio de Prumo: "O Enigma do Dia Livre"! Quais aventuras aguardam ${esc(nomeHeroi)}? Não perca!`;
  return `<div class="cm-proximo-ep"><b>Prévia do próximo episódio:</b> <i>${texto}</i></div>`;
}

// 3. Arco do vilão (3 ou mais atrasadas)
function vilaoOtakuHTML() {
  const atrasadas = S.tasks.filter(t => !t.done && t.date && t.date < today());
  const d = dadosMundo("otaku");
  if (atrasadas.length < 3) return "";
  if (!d.vilao || !d.vilao.ativo || d.vilao.derrotadoEm === today()) {
    d.vilao = {
      ativo: true,
      nome: "Lorde da Procrastinação",
      vidaMax: atrasadas.length,
      vidaAtual: atrasadas.length,
      derrotadoEm: ""
    };
  } else {
    if (atrasadas.length > d.vilao.vidaMax) d.vilao.vidaMax = atrasadas.length;
    d.vilao.vidaAtual = Math.min(d.vilao.vidaMax, atrasadas.length);
  }
  const pct = Math.max(0, Math.min(100, Math.round((d.vilao.vidaAtual / d.vilao.vidaMax) * 100)));
  return cartaoMundo(
    "cm-vilao",
    "Arco do Vilão!",
    esc(d.vilao.nome),
    `<div class="vilao-box">
      <div class="vilao-barra"><div class="hp-bar"><div class="hp-fill" style="width:${pct}%"></div></div><small>HP: ${d.vilao.vidaAtual}/${d.vilao.vidaMax} · Resolva tarefas atrasadas para derrotar o vilão!</small></div>
    </div>`
  );
}

// 4. Rival
function rivalOtakuHTML() {
  const d = dadosMundo("otaku");
  const sem = mondayOf(today());
  if (!d.rival || d.rival.semana !== sem) {
    const passadas = S.tasks.filter(t => t.done && t.date >= addDays(today(), -7)).length;
    const mediaDia = Math.max(2, Math.min(6, Math.round(passadas / 7) || 3));
    const diaSem = (new Date().getDay() + 6) % 7;
    d.rival = {
      semana: sem,
      nome: "Rival Takeshi",
      tarefas: Math.max(1, (diaSem + 1) * mediaDia)
    };
  }
  const feitasSemana = S.tasks.filter(t => t.done && (t.feitaEm || t.date) >= sem).length;
  const lider = feitasSemana >= d.rival.tarefas;
  return cartaoMundo(
    "cm-rival",
    "Duelo de Rivais",
    `Você vs ${esc(d.rival.nome)}`,
    `<div class="rival-placar">
      <div class="rival-item ${lider ? "vencendo" : ""}"><span>Você</span><b>${feitasSemana}</b></div>
      <div class="rival-vs">VS</div>
      <div class="rival-item ${!lider ? "vencendo" : ""}"><span>${esc(d.rival.nome)}</span><b>${d.rival.tarefas}</b></div>
    </div>
    <span class="note">${lider ? "Você está liderando a disputa da semana! Continue assim!" : "O rival está na frente! Conclua missões para virar o jogo!"}</span>`
  );
}

// 5. Ataque especial
const PREFIXOS_GOLPES = [
  "Rajada",
  "Corte Relâmpago",
  "Impacto Meteoro",
  "Dança das Lâminas",
  "Rugido do Trovão",
  "Vórtice Espiritual",
  "Explosão Estelar"
];
function nomeGolpeEspecial(titulo) {
  let h = 0;
  for (let i = 0; i < (titulo || "").length; i++) h = (h * 31 + titulo.charCodeAt(i)) | 0;
  const p = PREFIXOS_GOLPES[Math.abs(h) % PREFIXOS_GOLPES.length];
  return `${p}... ${titulo}!`;
}

// 6. Nível de poder no foco
function nivelPoderFoco() {
  const m = S.sessions.filter(s => s.date === today()).reduce((a, b) => a + b.min, 0);
  if (m >= 100) return { rank: "Mestre", poder: 9001, min: m };
  if (m >= 75) return { rank: "Jounin", poder: 5000, min: m };
  if (m >= 50) return { rank: "Chunin", poder: 1500, min: m };
  if (m >= 25) return { rank: "Genin", poder: 500, min: m };
  return { rank: "Iniciante", poder: 100, min: m };
}

// 7. Senpai notou (7 dias seguidos)
function diasSeguidosTarefas() {
  const dias = new Set(S.tasks.filter(t => t.done).map(t => t.feitaEm || t.date));
  let d = today(),
    c = 0;
  if (!dias.has(d)) d = addDays(d, -1);
  while (dias.has(d)) {
    c++;
    d = addDays(d, -1);
  }
  return c;
}

function verificarSenpaiNotou() {
  const streak = diasSeguidosTarefas();
  if (streak >= 7 && !S.owned.includes("otaku_carta_senpai")) {
    S.owned.push("otaku_carta_senpai");
    notificar({
      titulo: "O Senpai te notou!",
      texto: "7 dias seguidos de treino! Você recebeu a Carta do Senpai.",
      mood: "party",
      tipo: "conquista"
    });
    react("happy", "Kyaaa~! O Senpai finalmente notou sua dedicação!", 3500);
  }
}

// 8. Recapitulando (domingo)
function recapitulandoHTML() {
  if (new Date().getDay() !== 0) return "";
  const d7 = addDays(today(), -6);
  const feitas = S.tasks.filter(t => t.done && (t.feitaEm || t.date) >= d7).length;
  const foco = S.sessions.filter(s => s.date >= d7).reduce((a, b) => a + b.min, 0);
  const agua = Math.round(
    Array.from({ length: 7 }, (_, i) => waterToday(addDays(today(), -i))).reduce((a, b) => a + b, 0) / 1000
  );
  return cartaoMundo(
    "cm-recap",
    "Anteriormente em Prumo...",
    "Recapitulando a semana",
    `<p class="recap-texto">"Nosso protagonista venceu <b>${feitas} missões</b>, acumulou <b>${foco} minutos de treino</b> e bebeu <b>${agua} L de água</b>! Uma verdadeira saga heroica!"</p>`
  );
}

// 9. Hora do lámen
function horaDoLamen() {
  const h = new Date().getHours();
  return h >= 0 && h < 4;
}

// 10. Ficha de personagem
function fichaPersonagemOtaku() {
  const habitosNomes = S.habits.map(h => (h.name || "").toLowerCase()).join(" ");
  let classe = "Paladino da Produtividade";
  if (/treino|exerc|corr|academia|alongar|caminh/.test(habitosNomes)) classe = "Guerreiro do Dojo";
  else if (/estud|ler|livro|cálculo|program|pesquis/.test(habitosNomes)) classe = "Mago dos Pergaminhos";
  else if (/água|medit|respir|dorm|silênc/.test(habitosNomes)) classe = "Ninja da Concentração";

  const streak = diasSeguidosTarefas();
  const poder = levelOf(S.xp).lvl * 350 + streak * 75 + S.habits.length * 40;
  const golpeFav = S.habits.length ? `Técnica Suprema: ${S.habits[0].name}` : "Impacto do Foco Absoluto";
  const rank = nivelPoderFoco().rank;

  return { classe, poder, golpe: golpeFav, rank };
}

function fichaOtakuBlocoHTML() {
  if (S.persona !== "otaku") return "";
  const f = fichaPersonagemOtaku();
  return `<div class="ms-bloco ficha-otaku">
    <span class="ms-titulo">Ficha de Personagem (Anime)</span>
    <div class="ficha-otaku-corpo">
      <div class="ficha-linha"><b>Classe:</b> <span>${esc(f.classe)}</span></div>
      <div class="ficha-linha"><b>Poder de Combate:</b> <span class="mono">${f.poder.toLocaleString("pt-BR")}</span></div>
      <div class="ficha-linha"><b>Golpe Favorito:</b> <span>${esc(f.golpe)}</span></div>
      <div class="ficha-linha"><b>Rank Ninja no Foco:</b> <span>${esc(f.rank)}</span></div>
    </div>
  </div>`;
}

// Ganchos integrados do mundo Otaku
{
  const secaoAntes = MUNDO_FX.otaku.secaoHoje;
  MUNDO_FX.otaku.secaoHoje = () => {
    const epHTML = secaoAntes();
    const ab = aberturaTemporadaHTML();
    const vil = vilaoOtakuHTML();
    const riv = rivalOtakuHTML();
    const rec = recapitulandoHTML();
    const prox = proximoEpisodioHTML();
    const rk = nivelPoderFoco();
    const rankHTML = cartaoMundo(
      "cm-rank-foco",
      "Rank de Poder no Foco",
      `${rk.rank} (${rk.poder} de poder)`,
      `<span class="note">A cada 25 min de foco você sobe de rank ninja! Tempo hoje: <b>${rk.min} min</b>.</span>`
    );
    return ab + vil + epHTML + rankHTML + riv + rec + prox;
  };

  const concluirAntesLote1 = MUNDO_FX.otaku.aoConcluir;
  MUNDO_FX.otaku.aoConcluir = (x, el) => {
    concluirAntesLote1(x, el);
    verificarSenpaiNotou();
    const d = dadosMundo("otaku");
    if (d.vilao && d.vilao.ativo && d.vilao.vidaAtual > 0 && x && x.date && x.date < today()) {
      d.vilao.vidaAtual = Math.max(0, d.vilao.vidaAtual - 1);
      if (d.vilao.vidaAtual === 0 && d.vilao.derrotadoEm !== today()) {
        d.vilao.derrotadoEm = today();
        premioMundo(15, "Vilão derrotado! O arco do vilão foi superado. +15 gotas!");
      }
    }

    // 18. Som "shing" de espada ao concluir tarefa de prioridade alta
    if (x && x.prio >= 2 && typeof pegarAudio === "function" && S.sons && S.sons.pagina) {
      const ctx = pegarAudio();
      if (ctx) somShingEspada(ctx, saidaMundo(ctx, 0.8), ctx.currentTime + 0.05);
    }

    // 13 & 19. Lista toda feita: chuva de pétalas, letreiro Fim e jingle de abertura (uma vez por dia)
    const tarefasHoje = S.tasks.filter(t => t.date === today());
    const todasFeitas = tarefasHoje.length > 0 && tarefasHoje.every(t => t.done);
    if (todasFeitas && d.fimEpisodioDia !== today()) {
      d.fimEpisodioDia = today();
      mostrarLetreiroFim();
      MUNDO_FX.otaku.trocaAba();
      if (typeof pegarAudio === "function" && S.sons && S.sons.pagina) {
        const ctx = pegarAudio();
        if (ctx) jingleAberturaOtaku(ctx, saidaMundo(ctx, 0.7), ctx.currentTime + 0.2);
      }
    }
  };

  const trocaAbaAntesLote2 = MUNDO_FX.otaku.trocaAba;
  MUNDO_FX.otaku.trocaAba = () => {
    trocaAbaAntesLote2();
    const v = themeVar("otaku").id;
    if (v === "shonen") {
      cortinaDiagonalShonen();
    }
  };

  const camadasAntes = MUNDO_FX.otaku.camadasPrumi;
  MUNDO_FX.otaku.camadasPrumi = arg => {
    const base = camadasAntes ? camadasAntes(arg) : { fundo: "", rosto: "" };
    let rostoExtra = base.rosto || "";
    if (horaDoLamen()) {
      rostoExtra += `<g class="otaku-lamen-noite" transform="translate(68 112)">
        <path d="M-10 -2H10Q9 10 0 10Q-9 10 -10 -2Z" fill="#E53935" stroke="var(--ink)" stroke-width="1.2"/>
        <path d="M-8 -2q3 -3 6 0t6 0" stroke="#FBC02D" stroke-width="1.6" fill="none"/>
        <path d="M3 -8L-6 -18M6 -8L-1 -20" stroke="#8D6E63" stroke-width="1.2"/>
        <g class="vapor"><path d="M-2 -5q-2 -4 1 -7" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/></g>
      </g>`;
    }
    // 11. Expressões de anime no rosto por humor
    rostoExtra += expressoesAnimeSVG(arg.mood);
    // 14. Olhos brilhando de anime enquanto aura está ativa
    rostoExtra += olhosBrilhandoAuraSVG();
    return { fundo: base.fundo || "", rosto: rostoExtra };
  };

  const contextoAntes = MUNDO_FX.otaku.contextoMascote;
  MUNDO_FX.otaku.contextoMascote = () => {
    if (horaDoLamen()) {
      const falas = [
        "Hora do lámen da madrugada! O caldo perfeito para quem ainda está acordado.",
        "Lámen quentinho na madrugada... Todo protagonista treina até tarde!",
        "Madrugada de maratona de anime e tarefas pendentes... Come um lámen com o Prumi!"
      ];
      return { mood: "happy", msg: falas[new Date().getMinutes() % falas.length] };
    }
    return contextoAntes ? contextoAntes() : null;
  };
}

/* ==========================================================================
   OTAKU: LEVA 2 (Itens 11 a 20) - Visual, Efeitos e Sons
   ========================================================================== */

// 11. Expressões de anime no rosto por humor: gota de suor, veia de raiva, bochecha corada
function expressoesAnimeSVG(mood) {
  if (mood === "upset") {
    return `<g class="veia-raiva" transform="translate(85 36)">
      <path d="M-6 -2L-2 -2L-2 -6L2 -6L2 -2L6 -2L6 2L2 2L2 6L-2 6L-2 2L-6 2Z" fill="#E53935" stroke="var(--ink)" stroke-width="0.8"/>
      <path d="M-4 0H4M0 -4V4" stroke="#B71C1C" stroke-width="1.2"/>
    </g>`;
  }
  if (mood === "sad" || mood === "cry") {
    return `<g class="gota-suor-anime" transform="translate(86 46)">
      <path d="M0 -8Q6 2 3 7Q0 11 -4 8Q-7 4 -1 0Z" fill="#81D4FA" stroke="var(--ink)" stroke-width="1"/>
      <path d="M-1 2Q1 5 0 7" stroke="#fff" stroke-width="1" fill="none"/>
    </g>`;
  }
  if (mood === "happy" || mood === "party") {
    return `<g class="bochechas-anime">
      <ellipse cx="38" cy="72" rx="5" ry="3" fill="#F48FB1" opacity="0.85"/>
      <path d="M35 70l2 4M38 70l2 4M41 70l2 4" stroke="#E91E63" stroke-width="0.8"/>
      <ellipse cx="82" cy="72" rx="5" ry="3" fill="#F48FB1" opacity="0.85"/>
      <path d="M79 70l2 4M82 70l2 4M85 70l2 4" stroke="#E91E63" stroke-width="0.8"/>
    </g>`;
  }
  return "";
}

// 14. Olhos brilhando quando aura ativa
function olhosBrilhandoAuraSVG() {
  if (!auraLigada()) return "";
  return `<g class="olhos-brilho-anime">
    <path d="M47 57l1.5 5.5l5.5 1.5l-5.5 1.5l-1.5 5.5l-1.5-5.5l-5.5-1.5l5.5-1.5z" fill="#FFF9C4" opacity="0.9"/>
    <circle cx="47" cy="64" r="2.2" fill="#fff"/>
    <path d="M73 57l1.5 5.5l5.5 1.5l-5.5 1.5l-1.5 5.5l-1.5-5.5l-5.5-1.5l5.5-1.5z" fill="#FFF9C4" opacity="0.9"/>
    <circle cx="73" cy="64" r="2.2" fill="#fff"/>
  </g>`;
}

// 13. Letreiro FIM ao concluir todas as tarefas do dia
function mostrarLetreiroFim() {
  if (document.getElementById("letreiro-fim-anime")) return;
  const el = document.createElement("div");
  el.id = "letreiro-fim-anime";
  el.className = "letreiro-fim-anime";
  el.innerHTML = `<div class="fim-box"><span class="fim-kanji">完</span><span class="fim-texto">FIM DO EPISÓDIO</span></div>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// 15. Cortina diagonal no tema Shonen
function cortinaDiagonalShonen() {
  if (RM) return;
  const el = document.createElement("div");
  el.id = "cortina-shonen";
  el.className = "cortina-shonen";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 600);
}

// 18. Som "shing" de espada (WebAudio)
function somShingEspada(ctx, saida, t) {
  if (!ctx || !saida) return;
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(3200, t);
  o.frequency.exponentialRampToValueAtTime(1400, t + 0.15);
  const g = envelope(ctx, t, 0.005, 0.25, 0.18);
  o.connect(g).connect(saida);
  o.start(t);
  o.stop(t + 0.3);

  [4400, 5870, 7840].forEach((f, i) => sino(ctx, saida, t + 0.01 + i * 0.02, f, 0.6, 0.04, [1, 2]));
}

// 19. Jingle curto de abertura (5 notas) ao bater a meta do dia
function jingleAberturaOtaku(ctx, saida, t) {
  if (!ctx || !saida) return;
  const notas = [523.25, 659.25, 783.99, 880.0, 1046.5];
  notas.forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = envelope(ctx, t + i * 0.09, 0.01, 0.24, 0.12);
    o.connect(g).connect(saida);
    o.start(t + i * 0.09);
    o.stop(t + i * 0.09 + 0.28);
  });
}

// 20. Ambiente de foco "sala de aula": giz, relógio e cigarras
SONS_MUNDO.otaku.ambiente = ctx => {
  const base = ambienteRuido(ctx, { freq: 4800, tipo: "bandpass", vol: 0.035, onda: 0.16, q: 3 });
  const pulso = ctx.createOscillator();
  pulso.frequency.value = 38;
  const pg = ctx.createGain();
  pg.gain.value = 0.3;
  pulso.connect(pg).connect(base.saida.gain);
  pulso.start();

  const relogioTimer = setInterval(() => {
    if (!ctx || ctx.state === "closed") return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(1100, t);
    o.frequency.exponentialRampToValueAtTime(260, t + 0.025);
    const g = envelope(ctx, t, 0.001, 0.03, 0.025);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.04);
  }, 1000);

  return {
    parar() {
      clearInterval(relogioTimer);
      base.parar();
      pulso.stop(ctx.currentTime + 1.1);
    }
  };
};
