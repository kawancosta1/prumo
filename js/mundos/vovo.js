/*
  Mundo Vovô fofo: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.vovo = {
  name: "Vovô fofo",
  desc: "Carinhoso, sábio e cheio de conselhos.",
  sad: "Vovô ficou preocupado com você, meu bem.",
  starter: ["boina", "oculos_leitura", "cardiga"],
  hi: "Bom dia{nome}, meu bem! Hoje são <b>{n}</b> tarefinhas. Se agasalha!",
  cheers: [
    "Muito bem! Vovô tá orgulhoso.",
    "Que capricho! Uma a menos.",
    "Isso, devagarinho se chega longe."
  ],
  drink: "Bebe aguinha, que faz bem! <b>+{ml} mL</b>.",
  goal: "Bebeu toda a água! Vovô fica tranquilo.",
  thirsty: "Tá bebendo pouca água, viu? Faltam <b>{ml} mL</b>.",
  late: "Tem <b>{n}</b> coisinhas atrasadas. Sem pressa, mas não esquece!",
  night: "Já tá tarde, hein? Fecha o dia e vai dormir.",
  done: "Fez tudo! Merece um bolinho.",
  focus: "Concentra, que depois a gente toma um café."
};

THEMES.vovo = {
  font: '"Lora"',
  ds: 1.05,
  L: ["#F6F0E6", "#FFFDF9", "#2D2218", "#9A4A26", "#86B9D6", "#FFFDF8"],
  D: ["#15100B", "#201912", "#F2E7D8", "#E0A07A", "#9CCBE6", "#2D241B"],
  water: { name: "Aguinha fresca", spd: 4.6, amp: 2.5, part: "heart" },
  vars: [
    { id: "base", name: "Lareira" },
    { id: "jardim", name: "Jardim", price: 120, a: ["#4F7535", "#9CC47A"] },
    { id: "lenda", name: "Relíquia", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* VOVÔ */
  {
    id: "boina",
    p: "vovo",
    slot: "hat",
    name: "Boina",
    price: 80,
    svg: () =>
      `<path d="M23 41Q25 13 62 13Q99 15 97 38Q60 47 23 41Z" fill="#6B4E3D" ${O}/><circle cx="62" cy="11.5" r="3" fill="#6B4E3D" ${O}/>`
  },

  {
    id: "vovo_chapeu",
    p: "vovo",
    slot: "hat",
    name: "Chapéu de feltro",
    price: 100,
    svg: () =>
      `<path d="M40 37Q40 13 60 13Q80 13 80 37Z" fill="#7A7468" ${O}/><path d="M52 14Q60 20 68 14" fill="none" stroke="#5E594F" stroke-width="2"/><path d="M41 31H79" stroke="#3A3530" stroke-width="5"/><ellipse cx="60" cy="38" rx="38" ry="6.5" fill="#7A7468" ${O}/>`
  },

  {
    id: "oculos_leitura",
    p: "vovo",
    slot: "face",
    name: "Óculos de leitura",
    price: 60,
    svg: () =>
      `<path d="M37 64H57Q57 73 47 73Q37 73 37 64Z" fill="#BFE3F2" fill-opacity=".3" ${O}/><path d="M63 64H83Q83 73 73 73Q63 73 63 64Z" fill="#BFE3F2" fill-opacity=".3" ${O}/><path d="M57 65H63" ${O}/>`
  },

  {
    id: "vovo_bigode",
    p: "vovo",
    slot: "face",
    name: "Bigode branco",
    price: 70,
    svg: () => mustache("#F2F2F2")
  },

  {
    id: "cachecol",
    p: "vovo",
    slot: "neck",
    name: "Cachecol de tricô",
    price: 70,
    svg: () =>
      `<path d="M70 95L75 121L85 118L80 91Z" fill="#2E8B6E" ${O}/><path d="M26 80Q60 100 94 80L94 90Q60 110 26 90Z" fill="#2E8B6E" ${O}/><path d="M36 87Q60 101 84 87" stroke="#F2C14E" stroke-width="2" fill="none"/>`
  },

  {
    id: "cardiga",
    p: "vovo",
    slot: "top",
    name: "Cardigã",
    price: 100,
    svg: () =>
      topBase("#C9A27A") +
      `<path d="M54 88L60 98L66 88V150H54Z" fill="#F4F4F2"/><path d="M54 88V150M66 88V150" ${O}/><circle cx="51" cy="104" r="1.8" fill="#6B4E3D"/><circle cx="51" cy="114" r="1.8" fill="#6B4E3D"/><circle cx="51" cy="124" r="1.8" fill="#6B4E3D"/>` +
      topHem
  },

  {
    id: "pijama",
    p: "vovo",
    slot: "top",
    name: "Pijama",
    price: 90,
    svg: () =>
      topBase("#5C7FD6") +
      stripesH("rgba(255,255,255,.35)", 10, 3, 92) +
      `<circle cx="60" cy="102" r="2" fill="#fff"/><circle cx="60" cy="114" r="2" fill="#fff"/>` +
      topHem
  },

  {
    id: "livro",
    p: "vovo",
    slot: "hand",
    name: "Livro",
    price: 50,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-9" y="-12" width="18" height="23" rx="2" fill="#2F6FD6" ${O} stroke-width="1.8"/><path d="M-5 -6h10M-5 -2h10" stroke="#fff" stroke-width="1.6"/>`
      )
  },

  {
    id: "vovo_bengala",
    p: "vovo",
    slot: "hand",
    name: "Bengala",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-2 22V-8Q-2 -15 4 -15Q10 -15 10 -9" fill="none" stroke="#6B4E3D" stroke-width="3.6" stroke-linecap="round"/>`
      )
  },

  {
    id: "monoculo",
    p: "vovo",
    slot: "face",
    name: "Monóculo",
    ach: "produtivo",
    svg: () =>
      `<circle cx="73" cy="64" r="9.5" fill="#FFF3C4" fill-opacity=".25" stroke="#E8B923" stroke-width="3"/><path d="M81 70Q88 86 81 102" stroke="#E8B923" stroke-width="1.6" fill="none"/>`
  },

  {
    id: "vovo_cha",
    p: "vovo",
    slot: "hand",
    name: "Xícara de chá",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<ellipse cy="9" rx="12" ry="3" fill="#F4F1EA" ${O} stroke-width="1.4"/><path d="M-8 -3H8Q8 8 0 8Q-8 8 -8 -3Z" fill="#F4F1EA" ${O} stroke-width="1.6"/><path d="M8 -1Q13 0 12 3Q11 6 7 5" fill="none" ${O} stroke-width="1.6"/><path d="M-7 -3H7" stroke="#C98B4A" stroke-width="2.2"/><path d="M-2 -7q2-2.5 0-5M3 -7q2-2.5 0-5" stroke="var(--muted)" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
      )
  }
);
