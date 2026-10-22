/*
  Mundo Otaku: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.otaku = {
  name: "Otaku",
  desc: "Fã de anime, movido a determinação.",
  sad: "Senpai não me notou hoje... buá.",
  starter: ["orelhas_gato", "moletom_roxo"],
  hi: "Ohayo{nome}! Hoje são <b>{n}</b> tarefas. O arco de treinamento começa!",
  cheers: ["Sugoi! Uma a menos!", "Isso foi digno de protagonista!", "Power up! Continua assim!"],
  drink: "<b>+{ml} mL</b> de chakra recuperado!",
  goal: "Meta de água batida! Forma final desbloqueada.",
  thirsty: "Meu chakra tá acabando! Faltam <b>{ml} mL</b>.",
  late: "<b>{n}</b> atrasadas... é o arco do vilão. Vamos superar!",
  night: "Oyasumi! Fecha o dia e descansa.",
  done: "Episódio do dia concluído. Que final épico!",
  focus: "Treino intenso, igual montagem de anime."
};

THEMES.otaku = {
  font: '"M PLUS Rounded 1c"',
  ds: 1,
  L: ["#FFF0F5", "#FFFFFF", "#2A1420", "#D63C72", "#F28AB2", "#FFFAFC"],
  D: ["#160A10", "#22111A", "#FBE6EF", "#FF7AA8", "#FF9EC4", "#2E1A24"],
  water: { name: "Água de sakura", spd: 3.6, amp: 3, part: "petal" },
  vars: [
    { id: "base", name: "Sakura" },
    { id: "verao", name: "Céu de verão", price: 120, a: ["#2F6BC9", "#8CB8FF"], w: ["#6AA8F0", "#8CC8FF"] },
    { id: "lenda", name: "Lua roxa", ach: "nivel5", a: ["#6A3FC4", "#B48CFF"] }
  ]
};

ITEMS.push(
  /* OTAKU */
  {
    id: "orelhas_gato",
    p: "otaku",
    slot: "hat",
    name: "Orelhas de gato",
    price: 90,
    svg: () =>
      `<path d="M26 45Q60 17 94 45" fill="none" stroke="#6B4BB8" stroke-width="5" stroke-linecap="round"/><path d="M29 41L31 11L52 28Z" fill="#6B4BB8" ${O}/><path d="M91 41L89 11L68 28Z" fill="#6B4BB8" ${O}/><path d="M33.5 34L35 19L45 27Z" fill="#F2A7C3"/><path d="M86.5 34L85 19L75 27Z" fill="#F2A7C3"/>`
  },

  {
    id: "otaku_faixa",
    p: "otaku",
    slot: "hat",
    name: "Faixa de treino",
    price: 80,
    svg: () =>
      `<path d="M22 48Q60 32 98 48L98 57Q60 41 22 57Z" fill="#2F4FA8" ${O}/><rect x="48" y="37" width="24" height="12" rx="2" fill="#C9CED6" ${O} stroke-width="1.6"/><path d="M54 43h12" stroke="#555" stroke-width="1.6"/><path d="M97 50l12 6M97 53l10 10" stroke="#2F4FA8" stroke-width="4" stroke-linecap="round"/>`
  },

  {
    id: "otaku_cabelo",
    p: "otaku",
    slot: "hair",
    name: "Cabelo rosa anime",
    price: 120,
    svg: () => hairSpiky("#FF7AA8")
  },

  {
    id: "oculos_coracao",
    p: "otaku",
    slot: "face",
    name: "Óculos de coração",
    price: 100,
    svg: () =>
      [47, 73]
        .map(
          x => `<path d="M${x} 73.5l-9-8.6a5.2 5.2 0 0 1 9-5.4 5.2 5.2 0 0 1 9 5.4z" fill="#E8337A" ${O}/>`
        )
        .join("") + `<path d="M56 63H64" ${O}/>`
  },

  {
    id: "otaku_cachecol",
    p: "otaku",
    slot: "neck",
    name: "Cachecol vermelho",
    price: 80,
    svg: () =>
      `<path d="M70 95L78 128L88 124L80 91Z" fill="#C8102E" ${O}/><path d="M26 80Q60 100 94 80L94 90Q60 110 26 90Z" fill="#C8102E" ${O}/>`
  },

  {
    id: "otaku_marinheiro",
    p: "otaku",
    slot: "top",
    name: "Uniforme marinheiro",
    price: 130,
    svg: () =>
      topBase("#F7F7F5") +
      `<path d="M30 86L60 116L90 86L102 92L86 104H34L18 92Z" fill="#1F3A68" ${O}/><path d="M30 99H90" stroke="#fff" stroke-width="1.6"/><path d="M60 112L52 120L60 117L68 120Z" fill="#C8102E" ${O} stroke-width="1.4"/>` +
      topHem
  },

  {
    id: "moletom_roxo",
    p: "otaku",
    slot: "top",
    name: "Moletom roxo",
    price: 120,
    svg: () => hoodie("#6B4BB8")
  },

  {
    id: "otaku_onigiri",
    p: "otaku",
    slot: "hand",
    name: "Onigiri",
    price: 50,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 -12Q4 -12 11 4Q13 10 6 10H-6Q-13 10 -11 4Q-4 -12 0 -12Z" fill="#FAFAFA" ${O} stroke-width="1.8"/><rect x="-6" y="2" width="12" height="8" fill="#1F3324"/>`
      )
  },

  {
    id: "otaku_sakura",
    p: "otaku",
    slot: "hat",
    name: "Coroa de sakura",
    ach: "produtivo",
    svg: () =>
      `<path d="M26 44Q60 22 94 44" fill="none" stroke="#6B8E4E" stroke-width="3"/>` +
      [
        [30, 40],
        [40, 33],
        [50, 29],
        [60, 27],
        [70, 29],
        [80, 33],
        [90, 40]
      ]
        .map(
          ([x, y], i) =>
            `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-3.6" rx="2.6" ry="3.6" fill="${i % 2 ? "#FFB7D0" : "#FF8FB8"}" transform="rotate(${a})"/>`).join("")}<circle r="1.5" fill="#F2C14E"/></g>`
        )
        .join("")
  },

  {
    id: "otaku_lanterna",
    p: "otaku",
    slot: "hand",
    name: "Lanterna japonesa",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 -17V-12" stroke="#333" stroke-width="1.6"/><rect x="-6" y="-13" width="12" height="3" rx="1" fill="#222"/><ellipse cy="0" rx="10" ry="11" fill="#E0314F" ${O} stroke-width="1.8"/><path d="M-10 -4H10M-10 4H10" stroke="#A01530" stroke-width="1.2"/><rect x="-6" y="10" width="12" height="3" rx="1" fill="#222"/>`
      )
  }
);
