/*
  Mundo Gamer: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.gamer = {
  name: "Gamer",
  desc: "Competitivo, conquista cada XP.",
  sad: "Game over chegando... bora salvar o progresso?",
  starter: ["headset", "controle"],
  hi: "GG{nome}! Missões do dia: <b>{n}</b>. Bora farmar XP.",
  cheers: ["+XP! Missão concluída.", "Combo! Mais uma.", "Quest completa. Próxima!"],
  drink: "Poção de vida consumida. <b>+{ml} mL</b> de HP.",
  goal: "Barra de hidratação no máximo! Buff ativado.",
  thirsty: "HP baixo! Bebe uma poção: faltam <b>{ml} mL</b>.",
  late: "<b>{n}</b> quests atrasadas no log. Bora limpar o mapa.",
  night: "Hora de salvar o jogo. Fecha o dia e descansa.",
  done: "Fase concluída com 100%! Flawless.",
  focus: "Modo ranqueada: sem AFK."
};

THEMES.gamer = {
  font: '"Press Start 2P"',
  ds: 0.55,
  L: ["#EDEFF7", "#FFFFFF", "#11131C", "#6B2EFF", "#2B6BFF", "#F7F8FF"],
  D: ["#07080F", "#10121C", "#E8EAFF", "#00E5FF", "#5A7BFF", "#1A1D2E"],
  water: { name: "Poção de mana", spd: 2, amp: 4, part: "pixel" },
  vars: [
    { id: "base", name: "RGB" },
    { id: "vida", name: "Poção de vida", price: 120, a: ["#D01F36", "#FF4D6A"], w: ["#E0263B", "#FF4D6A"] },
    { id: "lenda", name: "Lendário", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* GAMER */
  {
    id: "headset",
    p: "gamer",
    slot: "hat",
    name: "Headset gamer",
    price: 140,
    svg: () =>
      `<path d="M21 60Q19 15 60 15Q101 15 99 60" fill="none" stroke="#2B2D3A" stroke-width="7" stroke-linecap="round"/><rect x="11" y="50" width="15" height="25" rx="6" fill="#6B4BD8" ${O}/><rect x="94" y="50" width="15" height="25" rx="6" fill="#6B4BD8" ${O}/><path d="M17 73Q19 90 40 87" fill="none" stroke="#2B2D3A" stroke-width="3" stroke-linecap="round"/><circle cx="41" cy="87" r="3.6" fill="#2B2D3A"/><rect x="14" y="56" width="4" height="12" rx="2" fill="#4CF0C8"/>`
  },

  {
    id: "gamer_cabelo",
    p: "gamer",
    slot: "hair",
    name: "Cabelo azul espetado",
    price: 110,
    svg: () => hairSpiky("#2B7BFF")
  },

  {
    id: "gamer_vr",
    p: "gamer",
    slot: "face",
    name: "Óculos VR",
    price: 150,
    svg: () =>
      `<path d="M22 62Q20 60 30 60M98 62Q100 60 90 60" stroke="#2B2D3A" stroke-width="4"/><rect x="30" y="54" width="60" height="21" rx="7" fill="#2B2D3A" ${O}/><rect x="35" y="61" width="50" height="6" rx="3" fill="#00E5FF"/>`
  },

  {
    id: "gamer_rgb",
    p: "gamer",
    slot: "top",
    name: "Moletom RGB",
    price: 140,
    svg: () =>
      hoodie("#1A1D2E") +
      `<path d="M2 100Q60 112 118 100" stroke="#FF3D7F" stroke-width="3" fill="none"/><path d="M2 106Q60 118 118 106" stroke="#00E5FF" stroke-width="3" fill="none"/><path d="M2 112Q60 124 118 112" stroke="#7CFF4F" stroke-width="3" fill="none"/>`
  },

  {
    id: "gamer_pixel",
    p: "gamer",
    slot: "top",
    name: "Camiseta pixel",
    price: 100,
    svg: () =>
      tee(
        "#26272C",
        [
          [54, 104],
          [66, 104],
          [50, 108],
          [58, 108],
          [62, 108],
          [70, 108],
          [50, 112],
          [54, 112],
          [58, 112],
          [62, 112],
          [66, 112],
          [70, 112],
          [54, 116],
          [58, 116],
          [62, 116],
          [66, 116],
          [58, 120],
          [62, 120]
        ]
          .map(([x, y]) => `<rect x="${x}" y="${y}" width="4" height="4" fill="#FF3D7F"/>`)
          .join("")
      )
  },

  {
    id: "controle",
    p: "gamer",
    slot: "hand",
    name: "Controle",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-13" y="-7" width="26" height="15" rx="7" fill="#2B2D3A" ${O} stroke-width="1.8"/><circle cx="6" cy="-1" r="2" fill="#E8337A"/><circle cx="9.5" cy="2.5" r="2" fill="#4CC3E6"/><path d="M-9 0.5h7M-5.5 -3v7" stroke="#fff" stroke-width="1.8"/>`
      )
  },

  {
    id: "gamer_mouse",
    p: "gamer",
    slot: "hand",
    name: "Mouse RGB",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 -12Q9 -12 9 0Q9 12 0 12Q-9 12 -9 0Q-9 -12 0 -12Z" fill="#2B2D3A" ${O} stroke-width="1.8"/><path d="M0 -12V-3" stroke="#00E5FF" stroke-width="2"/><path d="M-8 4Q0 8 8 4" stroke="#FF3D7F" stroke-width="2" fill="none"/>`
      )
  },

  {
    id: "gamer_coroa",
    p: "gamer",
    slot: "hat",
    name: "Coroa pixelada",
    ach: "produtivo",
    svg: () =>
      `<path d="M34 38V18H40V24H46V12H52V22H58V8H62V22H68V12H74V24H80V18H86V38Z" fill="#F2C14E" ${O}/><rect x="56" y="28" width="8" height="6" fill="#00E5FF"/><rect x="42" y="30" width="5" height="5" fill="#FF3D7F"/><rect x="73" y="30" width="5" height="5" fill="#7CFF4F"/>`
  },

  {
    id: "gamer_pocao",
    p: "gamer",
    slot: "hand",
    name: "Poção de mana",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-3" y="-15" width="6" height="5" rx="1" fill="#8B5A2B"/><path d="M-3 -10V-6Q-11 -2 -11 5Q-11 13 0 13Q11 13 11 5Q11 -2 3 -6V-10Z" fill="#5A7BFF" ${O} stroke-width="1.8"/><circle cx="-3" cy="4" r="2" fill="#fff" opacity=".7"/>`
      )
  }
);
