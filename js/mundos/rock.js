/*
  Mundo Roqueiro: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.rock = {
  name: "Roqueiro",
  desc: "Barulhento, intenso e cheio de energia.",
  sad: "Cadê você? O show não pode parar!",
  starter: ["bandana", "couro"],
  hi: "E aí{nome}! Hoje são <b>{n}</b> tarefas. Bora fazer esse dia tocar alto!",
  cheers: ["Isso é rock'n'roll!", "Mandou um solo de guitarra nessa!", "Riscou! A plateia vai à loucura!"],
  drink: "Hidratação é o roadie da vida. <b>+{ml} mL</b>!",
  goal: "Meta de água batida! Bis! Bis!",
  thirsty: "Garganta seca não canta! Faltam <b>{ml} mL</b> pro ritmo.",
  late: "<b>{n}</b> atrasadas? Até banda boa atrasa o show. Bora subir no palco!",
  night: "Fim de show! Fecha o dia e descansa as cordas vocais.",
  done: "Turnê do dia completa! Lendário.",
  focus: "Modo estúdio: gravando sem distração."
};

THEMES.rock = {
  font: '"Metal Mania"',
  ds: 1,
  L: ["#E9E7E2", "#FFFFFF", "#151515", "#D9480F", "#1E7FD6", "#F7F7F5"],
  D: ["#0F0F10", "#1A1A1C", "#F0EEE9", "#FFB020", "#3FA9FF", "#26262A"],
  water: { name: "Água elétrica", spd: 1.5, amp: 7, part: "bolt" },
  vars: [
    { id: "base", name: "Palco" },
    { id: "neon", name: "Neon", price: 120, a: ["#B0179E", "#FF4FD8"] },
    { id: "lenda", name: "Disco de ouro", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* ROCK */
  {
    id: "bandana",
    p: "rock",
    slot: "hat",
    name: "Bandana",
    price: 70,
    svg: () =>
      `<path d="M23 47Q60 26 97 47L97 55Q60 37 23 55Z" fill="#C8302C" ${O}/><path d="M96 49l13-7-2 11zM96 51l11 9-13 0z" fill="#C8302C" ${O}/><circle cx="42" cy="44" r="1.7" fill="#fff"/><circle cx="60" cy="38.5" r="1.7" fill="#fff"/><circle cx="78" cy="44" r="1.7" fill="#fff"/>`
  },

  {
    id: "moicano",
    p: "rock",
    slot: "hair",
    name: "Moicano",
    price: 110,
    svg: () => `<path d="M48 31L44 5L55 21L60 -2L65 21L76 5L72 31Z" fill="#E8337A" ${O}/>`
  },

  {
    id: "rock_aviador",
    p: "rock",
    slot: "face",
    name: "Óculos aviador",
    price: 90,
    svg: () =>
      `<path d="M35 58H57Q57 74 46 74Q35 73 35 58Z" fill="#2B2D3A" stroke="#C9A227" stroke-width="2.2"/><path d="M63 58H85Q85 73 74 74Q63 74 63 58Z" fill="#2B2D3A" stroke="#C9A227" stroke-width="2.2"/><path d="M57 59.5Q60 57 63 59.5" fill="none" stroke="#C9A227" stroke-width="2.2"/>`
  },

  {
    id: "rock_spikes",
    p: "rock",
    slot: "neck",
    name: "Coleira de spikes",
    price: 80,
    svg: () =>
      `<path d="M28 83Q60 102 92 83" fill="none" stroke="#1E1F24" stroke-width="7" stroke-linecap="round"/>${necklacePts(
        7
      )
        .map(
          ([x, y]) =>
            `<path d="M${x - 3} ${y + 2}L${x} ${y + 9}L${x + 3} ${y + 2}Z" fill="#C9CED6" stroke="#555" stroke-width=".8"/>`
        )
        .join("")}`
  },

  {
    id: "camiseta_preta",
    p: "rock",
    slot: "top",
    name: "Camiseta do raio",
    price: 70,
    svg: () =>
      tee(
        "#26272C",
        `<path d="M63 99L54 112H60L56 124L67 109H61L65 99Z" fill="#FFC21A" stroke="#26272C" stroke-width="1"/>`
      )
  },

  {
    id: "camiseta_estrela",
    p: "rock",
    slot: "top",
    name: "Camiseta estrela",
    price: 90,
    svg: () =>
      tee(
        "#E4572E",
        `<path d="M60 102l3.5 7.3 8 1-5.8 5.5 1.5 7.9-7.2-4-7.2 4 1.5-7.9-5.8-5.5 8-1z" fill="#F2C14E" ${O} stroke-width="1.6"/>`
      )
  },

  {
    id: "couro",
    p: "rock",
    slot: "top",
    name: "Jaqueta de couro",
    price: 180,
    svg: () =>
      jacket("#1F1F23", "#F4F4F2", "#2E2E34") +
      `<path d="M66 112L72 150" stroke="#9AA3AD" stroke-width="1.6" stroke-dasharray="2 2"/>`
  },

  {
    id: "rock_guitarra",
    p: "rock",
    slot: "hand",
    name: "Guitarra",
    price: 130,
    svg: (x, y) => H(x, y, guitar("#C8302C", "#3A2A1E"))
  },

  {
    id: "rock_guitarra_fogo",
    p: "rock",
    slot: "hand",
    name: "Guitarra de fogo",
    ach: "produtivo",
    svg: (x, y) =>
      H(
        x,
        y,
        guitar("#FF8A1F", "#3A2A1E") +
          `<path d="M-8 14Q-12 4 -6 -2Q-6 6 0 7Q-2 0 3 -6Q2 4 8 8Q10 14 2 16Q-4 17 -8 14Z" fill="#FFD23F" opacity=".85" transform="rotate(-38)"/>`
      )
  },

  {
    id: "rock_oculos_estrela",
    p: "rock",
    slot: "face",
    name: "Óculos de estrela",
    ach: "semana_agua",
    svg: () => star5(47, 64, 11, "#FFC21A") + star5(73, 64, 11, "#FFC21A") + `<path d="M57 63H63" ${O}/>`
  }
);
