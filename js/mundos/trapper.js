/*
  Mundo Trapper: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.trapper = {
  name: "Trapper",
  desc: "Estiloso, confiante e focado no bag.",
  sad: "Tá faltando drip nessa rotina, hein? Fiquei mal.",
  starter: ["touca", "oculos_escuros"],
  hi: "Ayy{nome}! <b>{n}</b> tarefas hoje, é tudo pelo bag.",
  cheers: ["Skrrt! Mais uma no bolso.", "Isso é drip de produtividade.", "Brabo demais!"],
  drink: "Hidratado e no estilo. <b>+{ml} mL</b>, ayy.",
  goal: "Meta de água batida. Gotejando sucesso.",
  thirsty: "Tá faltando drip... digo, água. <b>{ml} mL</b> pro ritmo.",
  late: "<b>{n}</b> atrasadas, mas a gente não para. Bora!",
  night: "A noite chegou. Fecha o dia e descansa, amanhã tem mais.",
  done: "Missão cumprida. Só os brabos.",
  focus: "Modo foco ativado. Sem distração, só visão."
};

THEMES.trapper = {
  font: '"Bungee"',
  ds: 0.8,
  L: ["#F1EAF6", "#FFFFFF", "#1A1024", "#C2187A", "#5EC8E0", "#FBF8FF"],
  D: ["#0D0814", "#170F22", "#F1E8FA", "#FF4FB0", "#7FE8FF", "#261A35"],
  water: { name: "Água no gelo", spd: 2.2, amp: 4, part: "ice" },
  vars: [
    { id: "base", name: "Neon rosa" },
    { id: "roxo", name: "Roxo", price: 120, a: ["#6A2FC0", "#B48CFF"] },
    { id: "lenda", name: "Ice", ach: "nivel5", a: ["#0E8FB8", "#7FE8FF"] }
  ]
};

ITEMS.push(
  /* TRAPPER */
  {
    id: "touca",
    p: "trapper",
    slot: "hat",
    name: "Touca",
    price: 70,
    svg: () => beanie("#3A3F58", "#2A2E42")
  },

  {
    id: "trap_dreads",
    p: "trapper",
    slot: "hair",
    name: "Twists coloridos",
    price: 110,
    svg: () =>
      [
        [34, 34, 26, 12],
        [44, 27, 40, 6],
        [54, 24, 53, 2],
        [66, 24, 67, 2],
        [76, 27, 80, 6],
        [86, 34, 94, 12]
      ]
        .map(
          ([x1, y1, x2, y2]) =>
            `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#2A1B2E" stroke-width="7.5" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="3.6" fill="#FF4FB0"/>`
        )
        .join("") + `<path d="M28 42Q32 26 60 25Q88 26 92 42Q78 34 60 34Q42 34 28 42Z" fill="#2A1B2E" ${O}/>`
  },

  {
    id: "oculos_escuros",
    p: "trapper",
    slot: "face",
    name: "Óculos escuros",
    price: 90,
    svg: () =>
      glasses("#141416") +
      `<path d="M39 60.5h6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/><path d="M66 60.5h6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>`
  },

  {
    id: "trap_oculos_rosa",
    p: "trapper",
    slot: "face",
    name: "Óculos rosa",
    price: 100,
    svg: () => lensPair("#FF4FB0", "var(--ink)", 6, 57, 14, 0.55)
  },

  {
    id: "trap_ice",
    p: "trapper",
    slot: "neck",
    name: "Corrente ice",
    price: 150,
    svg: () =>
      beads("#DFF8FF", 2.6, 13) +
      `<rect x="54" y="99" width="12" height="12" rx="2" fill="#BFEFFF" ${O} stroke-width="1.4" transform="rotate(45 60 105)"/>`
  },

  {
    id: "trap_puffer",
    p: "trapper",
    slot: "top",
    name: "Jaqueta puffer",
    price: 150,
    svg: () =>
      topBase("#1E1F24") +
      [100, 112, 124, 136]
        .map(
          y =>
            `<path d="M0 ${y}Q60 ${y + 8} 120 ${y}" stroke="#000" stroke-opacity=".45" stroke-width="2.4" fill="none"/>`
        )
        .join("") +
      `<path d="M60 92V150" stroke="#9AA3AD" stroke-width="2"/>` +
      topHem
  },

  {
    id: "trap_moletom",
    p: "trapper",
    slot: "top",
    name: "Moletom neon",
    price: 120,
    svg: () => hoodie("#E0177D")
  },

  {
    id: "trap_celular",
    p: "trapper",
    slot: "hand",
    name: "Celular",
    price: 80,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-7" y="-13" width="14" height="25" rx="3" fill="#1E1F24" ${O} stroke-width="1.8"/><rect x="-5" y="-10" width="10" height="17" rx="1" fill="#7FE8FF"/><circle cy="9.5" r="1" fill="#555"/>`
      )
  },

  {
    id: "trap_pelucia",
    p: "trapper",
    slot: "top",
    name: "Casaco de pelúcia",
    ach: "produtivo",
    svg: () =>
      topBase("#A35BD8") +
      necklacePts(9)
        .map(([x, y]) => `<circle cx="${x}" cy="${y - 2}" r="6" fill="#C08AF0"/>`)
        .join("") +
      [
        [18, 110],
        [30, 128],
        [94, 112],
        [104, 130],
        [46, 140],
        [76, 138]
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#C08AF0" opacity=".7"/>`)
        .join("") +
      topHem
  },

  {
    id: "trap_gelo",
    p: "trapper",
    slot: "hand",
    name: "Garrafa com gelo",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6" y="-12" width="12" height="24" rx="4.5" fill="#BFEFFF" fill-opacity=".9" ${O} stroke-width="1.8"/><rect x="-4" y="-17" width="8" height="6" rx="1.5" fill="#FF4FB0" ${O} stroke-width="1.4"/><rect x="-3.5" y="-5" width="5" height="5" rx="1" fill="#fff" transform="rotate(15)"/><rect x="-1" y="3" width="4.5" height="4.5" rx="1" fill="#fff" transform="rotate(-10)"/>`
      )
  }
);
