/*
  Mundo Clean boy: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.cleanboy = {
  name: "Clean boy",
  desc: "Arrumadinho, cheiroso e organizado.",
  sad: "Isso não tá nada clean... tô decepcionado.",
  starter: ["topete", "polo", "corrente_prata"],
  hi: "Bom dia{nome}. Look alinhado, agenda alinhada: <b>{n}</b> tarefas hoje.",
  cheers: ["Clean. Muito clean.", "Organizado é outro nível.", "Feito com estilo."],
  drink: "Pele boa começa na água. <b>+{ml} mL</b>.",
  goal: "Meta de água batida. Glow up garantido.",
  thirsty: "Hidratação baixa aparece na pele. Faltam <b>{ml} mL</b>.",
  late: "<b>{n}</b> atrasadas não combinam com seu estilo. Vamos ajustar?",
  night: "Skincare, fecha o dia e cama. Rotina impecável.",
  done: "Dia impecável. Nenhuma pendência fora do lugar.",
  focus: "Foco minimalista: só o essencial."
};

THEMES.cleanboy = {
  font: '"DM Serif Display"',
  ds: 1.05,
  L: ["#F4F5F7", "#FFFFFF", "#0F1B2D", "#1F3A68", "#5DB8E0", "#FFFFFF"],
  D: ["#0B111A", "#131B27", "#E8EDF4", "#9DB8E8", "#8FD6F2", "#1C2635"],
  water: { name: "Água cristalina", spd: 3.6, amp: 3, part: "spark" },
  vars: [
    { id: "base", name: "Alfaiataria" },
    { id: "areia", name: "Areia", price: 120, a: ["#8A6A43", "#D8B98A"] },
    { id: "lenda", name: "Black tie", ach: "nivel5", a: ["#1B1B1B", "#F0F0F0"] }
  ]
};

ITEMS.push(
  /* CLEAN BOY */
  {
    id: "topete",
    p: "cleanboy",
    slot: "hair",
    name: "Topete",
    price: 90,
    svg: () =>
      `<path d="M27 45Q24 15 58 13Q92 9 93 36Q85 25 70 27Q52 29 40 38Q33 41 27 45Z" fill="#5A3A22" ${O}/><path d="M50 20Q66 15 80 22" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  },

  {
    id: "clean_oculos",
    p: "cleanboy",
    slot: "face",
    name: "Óculos finos",
    price: 80,
    svg: () => lensPair("#BFE3F2", "#B08D3C", 3, 58, 12, 0.2)
  },

  {
    id: "corrente_prata",
    p: "cleanboy",
    slot: "neck",
    name: "Corrente de prata",
    price: 100,
    svg: () =>
      chainN("#C9CED6", 2.6, `<circle cx="60" cy="95" r="3" fill="#E6E9EE" ${O} stroke-width="1.4"/>`)
  },

  {
    id: "clean_gravata",
    p: "cleanboy",
    slot: "neck",
    name: "Gravata marinho",
    price: 80,
    svg: () =>
      `<path d="M55 86L65 86L62 92L67 116L60 125L53 116L58 92Z" fill="#1F3A68" ${O}/><path d="M57 100L64 96M56 108L65 103" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>`
  },

  {
    id: "camiseta_branca",
    p: "cleanboy",
    slot: "top",
    name: "Camiseta branca",
    price: 60,
    svg: () => tee("#F4F4F2")
  },

  {
    id: "polo",
    p: "cleanboy",
    slot: "top",
    name: "Polo",
    price: 100,
    svg: () =>
      topBase("#2F6FD6") +
      `<path d="M49 86L60 99L71 86L67 84H53Z" fill="#F4F4F2" ${O}/><circle cx="60" cy="104" r="1.8" fill="#F4F4F2"/><circle cx="60" cy="111" r="1.8" fill="#F4F4F2"/>` +
      topHem
  },

  {
    id: "camisa_social",
    p: "cleanboy",
    slot: "top",
    name: "Camisa social",
    price: 110,
    svg: () =>
      topBase("#F7F7F5") +
      `<path d="M60 92V150" stroke="#000" stroke-opacity=".15" stroke-width="2"/><circle cx="60" cy="102" r="1.7" fill="#9AA3AD"/><circle cx="60" cy="111" r="1.7" fill="#9AA3AD"/><circle cx="60" cy="120" r="1.7" fill="#9AA3AD"/><path d="M47 86L58 97L60 89Z" fill="#fff" ${O}/><path d="M73 86L62 97L60 89Z" fill="#fff" ${O}/>` +
      topHem
  },

  {
    id: "clean_perfume",
    p: "cleanboy",
    slot: "hand",
    name: "Perfume",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-3" y="-15" width="6" height="5" rx="1" fill="#B08D3C" ${O} stroke-width="1.4"/><rect x="-8" y="-10" width="16" height="20" rx="4" fill="#BFE3F2" fill-opacity=".85" ${O} stroke-width="1.8"/><rect x="-4" y="-3" width="8" height="6" rx="1" fill="#fff" opacity=".8"/>`
      )
  },

  {
    id: "terno",
    p: "cleanboy",
    slot: "top",
    name: "Terno",
    ach: "produtivo",
    svg: () =>
      jacket("#22252B", "#F4F4F2", "#30343C") +
      `<path d="M57 88H63L61.5 92L64 108L60 114L56 108L58.5 92Z" fill="#C0352B"/>`
  },

  {
    id: "clean_relogio",
    p: "cleanboy",
    slot: "hand",
    name: "Relógio de ouro",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-4" y="-13" width="8" height="26" rx="3" fill="#C9A227" ${O} stroke-width="1.6"/><circle r="7.5" fill="#F7F3E6" stroke="#C9A227" stroke-width="2.6"/><path d="M0 0V-4.5M0 0L3 1.5" stroke="#222" stroke-width="1.3" stroke-linecap="round"/>`
      )
  }
);
