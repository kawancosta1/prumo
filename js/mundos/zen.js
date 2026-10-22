/*
  Mundo Zen: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.zen = {
  name: "Zen",
  desc: "Calmo, gentil e equilibrado.",
  sad: "Sinto um desequilíbrio... vamos respirar e recomeçar?",
  starter: ["coque", "colar_flores"],
  hi: "Respira{nome}. Hoje são <b>{n}</b> tarefas, uma de cada vez.",
  cheers: ["Muito bem. Sinta essa pequena vitória.", "Um passo de cada vez. Lindo.", "Feito com presença."],
  drink: "Água é vida. Sinta cada gole. <b>+{ml} mL</b>.",
  goal: "Meta de água batida. Corpo e mente em equilíbrio.",
  thirsty: "Seu corpo pede água. Faltam <b>{ml} mL</b>.",
  late: "<b>{n}</b> atrasadas. Sem culpa: só recomeça agora.",
  night: "A noite pede descanso. Fecha o dia com gratidão.",
  done: "Tudo feito. Aproveita a paz desse momento.",
  focus: "Presença total no agora."
};

THEMES.zen = {
  font: '"Cormorant Garamond"',
  ds: 1.15,
  L: ["#EEF1EA", "#FBFCF8", "#1F2A22", "#4F6E4B", "#7DB8B2", "#FBFDF8"],
  D: ["#0F1411", "#171E19", "#E3EBE2", "#9CC497", "#8FD3CB", "#222B25"],
  water: { name: "Água em paz", spd: 6.5, amp: 2, part: "ripple" },
  vars: [
    { id: "base", name: "Bambu" },
    { id: "lavanda", name: "Lavanda", price: 120, a: ["#6A58A8", "#B9A8E8"] },
    { id: "lenda", name: "Iluminado", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* ZEN */
  {
    id: "coque",
    p: "zen",
    slot: "hair",
    name: "Coque",
    price: 70,
    svg: () =>
      `<circle cx="60" cy="13" r="10" fill="#3B2A1E" ${O}/><path d="M29 41Q33 21 60 21Q87 21 91 41Q76 30 60 31Q44 30 29 41Z" fill="#3B2A1E" ${O}/>`
  },

  {
    id: "zen_flor",
    p: "zen",
    slot: "hat",
    name: "Flor no cabelo",
    price: 60,
    svg: () =>
      `<g transform="translate(84 34)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-6" rx="4.4" ry="6.4" fill="#F28AB2" ${O} stroke-width="1.4" transform="rotate(${a})"/>`).join("")}<circle r="2.8" fill="#F2C14E"/></g>`
  },

  {
    id: "zen_oculos",
    p: "zen",
    slot: "face",
    name: "Óculos redondinhos",
    price: 70,
    svg: () =>
      `<circle cx="47" cy="64" r="7.5" fill="#9CC497" fill-opacity=".35" stroke="#6B4E3D" stroke-width="2"/><circle cx="73" cy="64" r="7.5" fill="#9CC497" fill-opacity=".35" stroke="#6B4E3D" stroke-width="2"/><path d="M54.5 63Q60 60 65.5 63" fill="none" stroke="#6B4E3D" stroke-width="2"/>`
  },

  {
    id: "colar_flores",
    p: "zen",
    slot: "neck",
    name: "Colar de flores",
    price: 80,
    svg: () => flowersOn(necklacePts(7))
  },

  {
    id: "zen_japamala",
    p: "zen",
    slot: "neck",
    name: "Japamala",
    price: 70,
    svg: () =>
      beads("#8B5A2B", 2.4, 13) +
      `<circle cx="60" cy="103" r="3" fill="#5E7D5A" ${O} stroke-width="1.2"/><path d="M60 106V114" stroke="#C8102E" stroke-width="2.6" stroke-linecap="round"/>`
  },

  {
    id: "zen_tunica",
    p: "zen",
    slot: "top",
    name: "Túnica de linho",
    price: 110,
    svg: () =>
      topBase("#E8DFC8") +
      `<path d="M50 86L60 104L70 86" fill="none" stroke="#B8A57E" stroke-width="2.4"/><path d="M0 120Q60 128 120 120" stroke="#5E7D5A" stroke-width="5" fill="none"/>` +
      topHem
  },

  {
    id: "zen_bonsai",
    p: "zen",
    slot: "hand",
    name: "Bonsai",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-9 5H9L7 12H-7Z" fill="#8B5A2B" ${O} stroke-width="1.6"/><path d="M0 5Q-2 -1 2 -5" stroke="#6B4E3D" stroke-width="2.4" fill="none"/><ellipse cx="-4" cy="-6" rx="6" ry="4" fill="#5E9E5A"/><ellipse cx="5" cy="-9" rx="6" ry="4" fill="#4C8A48"/>`
      )
  },

  {
    id: "zen_vela",
    p: "zen",
    slot: "hand",
    name: "Vela",
    price: 50,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-5" y="-4" width="10" height="16" rx="2" fill="#F4F1EA" ${O} stroke-width="1.6"/><path d="M0 -4V-7" stroke="#333" stroke-width="1.2"/><path d="M0 -15Q4 -10 0 -7Q-4 -10 0 -15Z" fill="#FFB020"/>`
      )
  },

  {
    id: "aureola",
    p: "zen",
    slot: "hat",
    name: "Auréola",
    ach: "produtivo",
    svg: () =>
      `<ellipse cx="60" cy="6" rx="24" ry="6" fill="none" stroke="#F2C14E" stroke-width="4.5"/><ellipse cx="60" cy="6" rx="24" ry="6" fill="none" stroke="#FFF3C4" stroke-width="1.5"/>`
  },

  {
    id: "zen_lotus",
    p: "zen",
    slot: "hand",
    name: "Flor de lótus",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<ellipse cy="8" rx="12" ry="3.5" fill="#5E9E5A"/>${[-50, -25, 0, 25, 50].map(a => `<ellipse cx="0" cy="-3" rx="4" ry="9" fill="#F7A8C8" ${O} stroke-width="1.2" transform="rotate(${a} 0 6)"/>`).join("")}`
      )
  }
);
