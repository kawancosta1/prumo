/*
  Mundo Rapper: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.rapper = {
  name: "Rapper",
  desc: "Rimas, atitude e visão de futuro.",
  sad: "Tá vacilando, mano. O corre não espera.",
  starter: ["bone_reto", "corrente_ouro"],
  hi: "Salve{nome}! Hoje são <b>{n}</b> tarefas na batida. Bora fazer acontecer.",
  cheers: ["Rimou com sucesso!", "Mais uma pro portfólio, irmão.", "Respeita o corre!"],
  drink: "Água no copo e flow no ponto. <b>+{ml} mL</b>.",
  goal: "Meta de água batida. Isso é disciplina, mano.",
  thirsty: "Sem água não tem flow. Faltam <b>{ml} mL</b> no ritmo.",
  late: "<b>{n}</b> atrasadas, mas o corre não para. Bora virar o jogo.",
  night: "Fim de expediente. Fecha o dia que amanhã tem mais.",
  done: "Corre do dia concluído. Visão!",
  focus: "Foco no papel, caneta na mão."
};

THEMES.rapper = {
  font: '"Anton"',
  ds: 1.05,
  L: ["#ECEAE4", "#FFFFFF", "#111111", "#A87A00", "#D4A21A", "#FAF8F2"],
  D: ["#0B0B0B", "#171717", "#F5F2EA", "#F2C14E", "#F2C14E", "#232323"],
  water: { name: "Ouro líquido", spd: 2.6, amp: 5, part: "gem" },
  vars: [
    { id: "base", name: "Ouro" },
    { id: "prata", name: "Prata", price: 120, a: ["#5E6470", "#C9CED6"], w: ["#8A929E", "#C9CED6"] },
    { id: "lenda", name: "Diamante", ach: "nivel5", a: ["#1677B0", "#7FD3FF"], w: ["#5CC8F2", "#9BE7FF"] }
  ]
};

ITEMS.push(
  /* RAPPER */
  {
    id: "bone_reto",
    p: "rapper",
    slot: "hat",
    name: "Boné aba reta",
    price: 90,
    svg: () =>
      `<path d="M28 44Q28 12 60 12Q92 12 92 44Z" fill="#1E1F24" ${O}/><rect x="20" y="40" width="80" height="8" rx="3" fill="#1E1F24" ${O}/><rect x="70" y="42" width="9" height="4" rx="1" fill="#E8C24A"/>`
  },

  {
    id: "rap_durag",
    p: "rapper",
    slot: "hat",
    name: "Durag",
    price: 80,
    svg: () =>
      `<path d="M25 48Q24 13 60 13Q96 13 95 48Q78 40 60 40Q42 40 25 48Z" fill="#2B2B33" ${O}/><path d="M60 13V40" stroke="#fff" stroke-opacity=".18" stroke-width="2"/><path d="M93 44Q104 56 100 76Q97 64 92 58Z" fill="#2B2B33" ${O}/><path d="M40 22Q50 17 58 18" stroke="#fff" stroke-opacity=".3" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  },

  {
    id: "rap_oculos",
    p: "rapper",
    slot: "face",
    name: "Óculos retangular",
    price: 90,
    svg: () => lensPair("#141416", "#C9A227", 1.5, 59, 9)
  },

  {
    id: "corrente_ouro",
    p: "rapper",
    slot: "neck",
    name: "Corrente de ouro",
    price: 150,
    svg: () =>
      chainN(
        "#E8B923",
        3.8,
        `<circle cx="60" cy="100" r="7" fill="#F2C14E" ${O}/><text x="60" y="103.5" font-size="9" text-anchor="middle" font-weight="800" fill="#8A6500" font-family="sans-serif">P</text>`
      )
  },

  {
    id: "rap_jersey",
    p: "rapper",
    slot: "top",
    name: "Regata de basquete",
    price: 120,
    svg: () => tank("#5B2A86", "#F2C14E", "23", "#F2C14E")
  },

  {
    id: "rap_moletom",
    p: "rapper",
    slot: "top",
    name: "Moletom mostarda",
    price: 120,
    svg: () => hoodie("#C9952B")
  },

  {
    id: "microfone",
    p: "rapper",
    slot: "hand",
    name: "Microfone",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-3" y="-1" width="6" height="16" rx="2" fill="#2B2D3A" ${O} stroke-width="1.8"/><circle cx="0" cy="-6" r="6.5" fill="#9AA3AD" ${O} stroke-width="1.8"/>`
      )
  },

  {
    id: "rap_caderno",
    p: "rapper",
    slot: "hand",
    name: "Caderno de rimas",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-9" y="-12" width="18" height="23" rx="2" fill="#F4F1EA" ${O} stroke-width="1.8"/><path d="M-5 -6h10M-5 -2h10M-5 2h7" stroke="#2F6FD6" stroke-width="1.3"/><path d="M6 6L12 -8" stroke="#E8C24A" stroke-width="2.4" stroke-linecap="round"/>`
      )
  },

  {
    id: "coroa",
    p: "rapper",
    slot: "hat",
    name: "Coroa",
    ach: "produtivo",
    svg: () =>
      `<path d="M34 38L34 13L46 24L54 7L60 20L66 7L74 24L86 13L86 38Z" fill="#F2C14E" ${O}/><circle cx="60" cy="30" r="3.6" fill="#C0352B"/><circle cx="46" cy="32" r="2.6" fill="#2F6FD6"/><circle cx="74" cy="32" r="2.6" fill="#1C8350"/>`
  },

  {
    id: "rap_diamante",
    p: "rapper",
    slot: "neck",
    name: "Corrente de diamante",
    ach: "semana_agua",
    svg: () =>
      chainN(
        "#BFEFFF",
        4,
        `<path d="M60 93L68 100L60 111L52 100Z" fill="#9BE7FF" ${O} stroke-width="1.6"/><path d="M52 100H68M60 93L57 100L60 111L63 100Z" fill="none" stroke="#fff" stroke-width="1"/>`
      )
  }
);
