/*
  Mundo Funkeiro: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.funkeiro = {
  name: "Funkeiro",
  desc: "Animado, criativo e cheio de gírias.",
  sad: "Aí não, pô! Tá vacilando comigo.",
  starter: ["juliet", "camisa_time"],
  hi: "Fala{nome}! Hoje são <b>{n}</b> tarefas, vamo que vamo!",
  cheers: ["É o fluxo! Uma a menos.", "Tá tranquilo, tá favorável!", "Meteu essa!"],
  drink: "Hidratou no grau. <b>+{ml} mL</b>!",
  goal: "Meta de água batida! Hoje é baile.",
  thirsty: "Bebe água, que tá precisando! Faltam <b>{ml} mL</b>.",
  late: "<b>{n}</b> atrasadas, mas a gente resolve no passinho.",
  night: "Acabou o baile do dia. Fecha tudo e descansa.",
  done: "Fechou o dia inteiro! Tá on demais.",
  focus: "Concentração total, sem vacilo."
};

THEMES.funkeiro = {
  font: '"Bowlby One"',
  ds: 0.82,
  L: ["#ECF5EA", "#FFFFFF", "#0E1A10", "#0E9444", "#14B88A", "#F8FCF7"],
  D: ["#07100A", "#101C13", "#E8F7EC", "#39FF88", "#39FFD2", "#18261C"],
  water: { name: "Água neon", spd: 1.8, amp: 6, part: "star" },
  vars: [
    { id: "base", name: "Baile" },
    { id: "rosa", name: "Rosa choque", price: 120, a: ["#D0136F", "#FF5CB0"] },
    { id: "lenda", name: "Ouro do baile", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* FUNKEIRO */
  {
    id: "bone_vermelho",
    p: "funkeiro",
    slot: "hat",
    name: "Boné vermelho",
    price: 60,
    svg: () => cap("#D2453B")
  },

  {
    id: "funk_platinado",
    p: "funkeiro",
    slot: "hair",
    name: "Nevou (platinado)",
    price: 110,
    svg: () =>
      `<path d="M27 44Q27 19 60 18Q93 19 93 44Q78 34 60 34Q42 34 27 44Z" fill="#F1E7B8" ${O}/><path d="M36 33L46 27M84 33L74 27" stroke="#9C8A3E" stroke-width="2" stroke-linecap="round"/>`
  },

  {
    id: "juliet",
    p: "funkeiro",
    slot: "face",
    name: "Óculos juliet",
    price: 110,
    svg: () =>
      `<path d="M31 58Q60 49 89 58L87 68Q75 77 63 67Q60 64 57 67Q45 77 33 68Z" fill="#F2622E" ${O}/><path d="M39 60Q46 57.5 51 60" stroke="#fff" stroke-width="2.2" opacity=".75" fill="none" stroke-linecap="round"/>`
  },

  {
    id: "funk_corrente",
    p: "funkeiro",
    slot: "neck",
    name: "Corrente grossa",
    price: 130,
    svg: () => chainN("#D9DDE3", 5.2)
  },

  {
    id: "camisa_time",
    p: "funkeiro",
    slot: "top",
    name: "Camisa listrada verde",
    price: 100,
    svg: () =>
      topBase("#F4F4F2") +
      stripesV("#1C8350", 14, 7, 4) +
      `<path d="M51 87L60 97L69 87" fill="none" ${O}/>` +
      topHem
  },

  {
    id: "funk_time_azul",
    p: "funkeiro",
    slot: "top",
    name: "Camisa listrada azul",
    price: 100,
    svg: () =>
      topBase("#F4F4F2") +
      stripesV("#1F4FB8", 14, 7, 4) +
      `<path d="M51 87L60 97L69 87" fill="none" ${O}/>` +
      topHem
  },

  {
    id: "funk_caixinha",
    p: "funkeiro",
    slot: "hand",
    name: "Caixinha de som",
    price: 110,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-13" y="-8" width="26" height="16" rx="5" fill="#1E1F24" ${O} stroke-width="1.8"/><circle cx="-5.5" r="4.5" fill="#39FF88" opacity=".85"/><circle cx="5.5" r="4.5" fill="#39FF88" opacity=".85"/><circle cx="-5.5" r="1.6" fill="#1E1F24"/><circle cx="5.5" r="1.6" fill="#1E1F24"/>`
      )
  },

  {
    id: "funk_bone_ouro",
    p: "funkeiro",
    slot: "hat",
    name: "Boné de ouro",
    ach: "produtivo",
    svg: () =>
      cap("#E2B23A") +
      `<path d="M44 26Q52 20 60 20" stroke="#FFF3C4" stroke-width="3" fill="none" stroke-linecap="round"/>`
  },

  {
    id: "funk_neon",
    p: "funkeiro",
    slot: "face",
    name: "Óculos neon",
    ach: "semana_agua",
    svg: () =>
      `<rect x="34" y="56" width="24" height="15" rx="4" fill="#39FF88" fill-opacity=".25" stroke="#39FF88" stroke-width="3.4"/><rect x="62" y="56" width="24" height="15" rx="4" fill="#FF4FB0" fill-opacity=".25" stroke="#FF4FB0" stroke-width="3.4"/><path d="M58 62H62" stroke="#39FF88" stroke-width="3"/>`
  }
);
