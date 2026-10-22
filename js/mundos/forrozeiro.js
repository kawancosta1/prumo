/*
  Mundo Forrozeiro: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.forrozeiro = {
  name: "Forrozeiro",
  desc: "Arretado, acolhedor e sempre animado.",
  sad: "Oxe, me deixou de lado, foi? Fiquei aperreado.",
  starter: ["chapeu_couro", "lenco"],
  hi: "Oxe{nome}, bom dia! Hoje tem <b>{n}</b> tarefas, bora arrochar!",
  cheers: ["Arretado demais!", "Eita, que beleza! Uma a menos.", "Massa! Tá voando."],
  drink: "Água fresquinha pra aguentar o xote. <b>+{ml} mL</b>.",
  goal: "Meta de água batida! Tô mais cheio que açude no inverno.",
  thirsty: "Oxente, tô seco! Faltam <b>{ml} mL</b> pro ritmo.",
  late: "Tem <b>{n}</b> atrasadas, visse? Bora resolver sem aperreio.",
  night: "A festa acabou. Fecha o dia e vai dormir.",
  done: "Tudo feito! Hoje tem forró pé de serra.",
  focus: "Foco total, sem arrodeio."
};

THEMES.forrozeiro = {
  font: '"Fredoka"',
  ds: 1.05,
  L: ["#FFF5E3", "#FFFFFF", "#2A1408", "#C81E25", "#2F86C9", "#FFFDF6"],
  D: ["#160D06", "#22150B", "#FCEBD5", "#FF5A5F", "#5CB2F0", "#2D1E12"],
  water: { name: "Água do açude", spd: 3.2, amp: 4, part: "flag" },
  vars: [
    { id: "base", name: "Chita" },
    { id: "mandacaru", name: "Mandacaru", price: 120, a: ["#2E8B3A", "#5FD06C"] },
    { id: "lenda", name: "São João", ach: "nivel5", a: ["#C77700", "#FFCA3A"] }
  ]
};

ITEMS.push(
  /* FORROZEIRO */
  {
    id: "chapeu_couro",
    p: "forrozeiro",
    slot: "hat",
    name: "Chapéu de couro",
    price: 120,
    svg: () => leatherHat("#8A5A2E")
  },

  {
    id: "forro_palha",
    p: "forrozeiro",
    slot: "hat",
    name: "Chapéu de palha",
    price: 80,
    svg: () =>
      `<path d="M38 37Q38 13 60 13Q82 13 82 37Z" fill="#E7C878" ${O}/><ellipse cx="60" cy="38" rx="46" ry="8" fill="#E7C878" ${O}/><path d="M42 24L50 30M66 18L74 24M30 39L40 41M80 41L90 39" stroke="#B8923C" stroke-width="1.6"/><rect x="66" y="25" width="8" height="7" fill="#D2232A" ${O} stroke-width="1" transform="rotate(-12 70 28)"/>`
  },

  { id: "lenco", p: "forrozeiro", slot: "neck", name: "Lenço", price: 50, svg: () => neckBand("#C8302C") },

  {
    id: "forro_bandeirinhas",
    p: "forrozeiro",
    slot: "neck",
    name: "Bandeirinhas",
    price: 80,
    svg: () =>
      `<path d="M26 82Q60 100 94 82" fill="none" stroke="#6B4E3D" stroke-width="1.4"/>` +
      necklacePts(7)
        .map(
          ([x, y], i) =>
            `<path d="M${x - 4.5} ${y - 1}L${x + 4.5} ${y - 1}L${x} ${y + 9}Z" fill="${["#D2232A", "#F2C14E", "#2E8B3A", "#2F86C9", "#E86A92"][i % 5]}" stroke="#2A1408" stroke-width=".8"/>`
        )
        .join("")
  },

  {
    id: "forro_chita",
    p: "forrozeiro",
    slot: "top",
    name: "Camisa de chita",
    price: 120,
    svg: () =>
      topBase("#D2232A") +
      [
        [30, 104, "#F2C14E"],
        [60, 120, "#2F86C9"],
        [90, 104, "#F2C14E"],
        [44, 138, "#2E8B3A"],
        [80, 138, "#F2C14E"]
      ]
        .map(
          ([x, y, c]) =>
            `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/><path d="M${x - 9} ${y + 6}q4-3 6 2" stroke="#2E8B3A" stroke-width="2" fill="none"/>`
        )
        .join("") +
      `<path d="M47 86L58 96L60 89Z" fill="#A81B21" ${O}/><path d="M73 86L62 96L60 89Z" fill="#A81B21" ${O}/>` +
      topHem
  },

  {
    id: "forro_amarela",
    p: "forrozeiro",
    slot: "top",
    name: "Chita amarela",
    price: 120,
    svg: () =>
      topBase("#F2B21C") +
      [
        [28, 108, "#D2232A"],
        [58, 124, "#2E8B3A"],
        [92, 110, "#D2232A"],
        [74, 140, "#2F86C9"],
        [40, 140, "#D2232A"]
      ]
        .map(
          ([x, y, c]) =>
            `<circle cx="${x}" cy="${y}" r="6.5" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`
        )
        .join("") +
      topHem
  },

  {
    id: "forro_sanfona",
    p: "forrozeiro",
    slot: "hand",
    name: "Sanfona",
    price: 140,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-15" y="-10" width="8" height="20" rx="2" fill="#D2232A" ${O} stroke-width="1.6"/><rect x="7" y="-10" width="8" height="20" rx="2" fill="#D2232A" ${O} stroke-width="1.6"/><path d="M-7 -9L-4 9L-1 -9L2 9L5 -9L7 9" fill="none" stroke="#2A1408" stroke-width="1.4"/><path d="M-7 -9H7M-7 9H7" stroke="#2A1408" stroke-width="1.2"/><circle cx="-11" cy="-4" r="1.2" fill="#fff"/><circle cx="-11" cy="1" r="1.2" fill="#fff"/><circle cx="11" cy="-4" r="1.2" fill="#fff"/>`
      )
  },

  {
    id: "forro_triangulo",
    p: "forrozeiro",
    slot: "hand",
    name: "Triângulo",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 -12L11 9H-9" fill="none" stroke="#C9CED6" stroke-width="2.6" stroke-linejoin="round"/><path d="M-12 -2L4 2" stroke="#6B4E3D" stroke-width="2" stroke-linecap="round"/>`
      )
  },

  {
    id: "forro_couro_ouro",
    p: "forrozeiro",
    slot: "hat",
    name: "Chapéu de couro dourado",
    ach: "produtivo",
    svg: () => leatherHat("#C9952B", "#FFF3C4")
  },

  {
    id: "forro_quadrilha",
    p: "forrozeiro",
    slot: "top",
    name: "Camisa de quadrilha",
    ach: "semana_agua",
    svg: () =>
      plaid("#2E8B3A", "rgba(0,0,0,.22)") +
      `<rect x="22" y="104" width="13" height="12" fill="#F2C14E" ${O} stroke-width="1.2" transform="rotate(-8 28 110)"/><rect x="80" y="122" width="13" height="12" fill="#D2232A" ${O} stroke-width="1.2" transform="rotate(10 86 128)"/>`
  }
);
