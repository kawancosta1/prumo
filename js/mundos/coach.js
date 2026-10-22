/*
  Mundo Coach: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.coach = {
  name: "Coach",
  desc: "Motivação no máximo, energia sem fim.",
  sad: "Não era isso que a gente combinou, campeão!",
  starter: ["faixa_suor", "apito", "coach_regata"],
  hi: "VAMO{nome}! Hoje são <b>{n}</b> tarefas, e você dá conta de TODAS!",
  cheers: ["ISSO! Você é imparável!", "Mais uma! Disciplina vence motivação!", "É sobre isso! Segue!"],
  drink: "Hidratação é performance! <b>+{ml} mL</b>!",
  goal: "META BATIDA! Campeões bebem água!",
  thirsty: "Bora, campeão! Faltam <b>{ml} mL</b> pro ritmo!",
  late: "<b>{n}</b> atrasadas? Sem desculpa, só ação! Bora!",
  night: "Recuperação também é treino. Fecha o dia e dorme.",
  done: "100% do dia! Você é referência!",
  focus: "Foco de atleta. Sem distrações!"
};

THEMES.coach = {
  font: '"Oswald"',
  ds: 1.05,
  L: ["#F4F2EF", "#FFFFFF", "#141414", "#D81E15", "#2FA8E8", "#FFFFFF"],
  D: ["#0D0D0D", "#181818", "#F5F5F5", "#FF4433", "#59D2FE", "#242424"],
  water: { name: "Hidratação de campeão", spd: 1.4, amp: 6, part: "plus" },
  vars: [
    { id: "base", name: "Pódio" },
    { id: "verde", name: "Verde energia", price: 120, a: ["#23892F", "#5CE06E"] },
    { id: "lenda", name: "Medalha de ouro", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* COACH */
  {
    id: "faixa_suor",
    p: "coach",
    slot: "hat",
    name: "Faixa de suor",
    price: 50,
    svg: () =>
      `<path d="M22 48Q60 32 98 48L98 56Q60 40 22 56Z" fill="#F4F4F2" ${O}/><path d="M22 52Q60 36 98 52" stroke="#C0352B" stroke-width="2.6" fill="none"/>`
  },

  { id: "coach_bone", p: "coach", slot: "hat", name: "Boné de treino", price: 60, svg: () => cap("#E2231A") },

  {
    id: "coach_esportivo",
    p: "coach",
    slot: "face",
    name: "Óculos esportivo",
    price: 100,
    svg: () =>
      `<path d="M31 59Q60 51 89 59L87 69Q60 76 33 69Z" fill="#FF7A1A" fill-opacity=".85" ${O}/><path d="M38 61Q50 58 58 59" stroke="#fff" stroke-width="2" opacity=".7" fill="none" stroke-linecap="round"/>`
  },

  {
    id: "apito",
    p: "coach",
    slot: "neck",
    name: "Apito",
    price: 40,
    svg: () =>
      `<path d="M33 84L60 103L87 84" fill="none" stroke="#C0352B" stroke-width="2"/><rect x="53" y="101" width="15" height="8" rx="3" fill="#C9CED6" ${O}/>`
  },

  {
    id: "coach_regata",
    p: "coach",
    slot: "top",
    name: "Regata esportiva",
    price: 80,
    svg: () => tank("#E2231A", "#F4F4F2", "1")
  },

  {
    id: "coach_agasalho",
    p: "coach",
    slot: "top",
    name: "Agasalho",
    price: 130,
    svg: () =>
      topBase("#1F3A68") +
      `<path d="M60 88V150" stroke="#C9CED6" stroke-width="2.4"/><path d="M8 92V150M15 94V150M105 94V150M112 92V150" stroke="#F4F4F2" stroke-width="3"/><path d="M48 86L60 96L72 86" fill="none" stroke="#F4F4F2" stroke-width="3"/>` +
      topHem
  },

  {
    id: "coach_halter",
    p: "coach",
    slot: "hand",
    name: "Halter",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-8" y="-2" width="16" height="4" rx="1.5" fill="#9AA3AD" ${O} stroke-width="1.2"/><rect x="-14" y="-8" width="6" height="16" rx="2" fill="#2B2D3A" ${O} stroke-width="1.4"/><rect x="8" y="-8" width="6" height="16" rx="2" fill="#2B2D3A" ${O} stroke-width="1.4"/>`
      )
  },

  {
    id: "coach_cronometro",
    p: "coach",
    slot: "hand",
    name: "Cronômetro",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-2.5" y="-15" width="5" height="4" rx="1" fill="#9AA3AD"/><circle r="10" fill="#F4F4F2" ${O} stroke-width="1.8"/><path d="M0 0V-6M0 0L4 3" stroke="#E2231A" stroke-width="1.8" stroke-linecap="round"/>`
      )
  },

  {
    id: "coach_medalha",
    p: "coach",
    slot: "neck",
    name: "Medalha de ouro",
    ach: "produtivo",
    svg: () =>
      `<path d="M40 84L56 108H64L80 84" fill="none" stroke="#E2231A" stroke-width="5"/><path d="M46 84L58 106M74 84L62 106" stroke="#2F6FD6" stroke-width="2.4"/><circle cx="60" cy="113" r="8" fill="#F2C14E" ${O}/><path d="M60 108l1.5 3.2 3.4.4-2.5 2.3.7 3.4-3.1-1.8-3.1 1.8.7-3.4-2.5-2.3 3.4-.4z" fill="#FFF3C4"/>`
  },

  {
    id: "garrafinha",
    p: "coach",
    slot: "hand",
    name: "Garrafinha",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-5.5" y="-12" width="11" height="24" rx="4.5" fill="#4CC3E6" ${O} stroke-width="1.8"/><rect x="-3.5" y="-17" width="7" height="6" rx="1.5" fill="#2340C4" ${O} stroke-width="1.6"/><path d="M-2 -6v10" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`
      )
  }
);
