/*
  Mundo Pagodeiro: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.pagodeiro = {
  name: "Pagodeiro",
  desc: "Resenha boa, alegria e roda de samba.",
  sad: "Assim a roda perde o ritmo, parceiro. Fiquei tristinho.",
  starter: ["regata", "pandeiro"],
  hi: "Opa{nome}! Hoje são <b>{n}</b> tarefas, mas com alegria tudo flui.",
  cheers: ["Aí sim! Bate na palma da mão!", "Que resenha boa, uma a menos!", "Feito! Toca um pagodinho aí."],
  drink: "Uma água geladinha pra animar a roda. <b>+{ml} mL</b>.",
  goal: "Meta de água batida! Hoje tem samba.",
  thirsty: "Tô mais seco que pandeiro sem couro. Faltam <b>{ml} mL</b>.",
  late: "<b>{n}</b> atrasadas, mas sem estresse. Um passo de cada vez.",
  night: "A roda acabou. Fecha o dia e vai descansar.",
  done: "Dia completo! Esse merece um samba.",
  focus: "Foco agora, resenha depois."
};

THEMES.pagodeiro = {
  font: '"Righteous"',
  ds: 1,
  L: ["#FFF2E0", "#FFFFFF", "#2A1A0E", "#D9560F", "#7CBF7C", "#FFFCF6"],
  D: ["#1A120A", "#251A10", "#FBEBD7", "#FF9A4D", "#A7E0A0", "#2E2216"],
  water: { name: "Água de coco", spd: 2.8, amp: 5, part: "note" },
  vars: [
    { id: "base", name: "Resenha" },
    { id: "mar", name: "Mar", price: 120, a: ["#0E7CA8", "#5EC6F0"], w: ["#3FA9D6", "#5EC6F0"] },
    { id: "lenda", name: "Roda de ouro", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* PAGODEIRO */
  {
    id: "panama",
    p: "pagodeiro",
    slot: "hat",
    name: "Chapéu panamá",
    price: 100,
    svg: () =>
      `<path d="M40 37Q40 13 60 13Q80 13 80 37Z" fill="#EFE3C2" ${O}/><path d="M41 31H79" stroke="#26272B" stroke-width="5"/><ellipse cx="60" cy="38" rx="46" ry="8" fill="#EFE3C2" ${O}/>`
  },

  { id: "pag_bone", p: "pagodeiro", slot: "hat", name: "Boné branco", price: 60, svg: () => cap("#F4F4F2") },

  {
    id: "pag_espelhado",
    p: "pagodeiro",
    slot: "face",
    name: "Óculos espelhado",
    price: 100,
    svg: () =>
      `<rect x="35" y="57" width="23" height="14" rx="6" fill="#4CC3E6" ${O}/><rect x="62" y="57" width="23" height="14" rx="6" fill="#4CC3E6" ${O}/><path d="M37 62H56M64 62H83" stroke="#FF8FC0" stroke-width="4"/><path d="M58 62H62" ${O}/>`
  },

  {
    id: "pag_buzios",
    p: "pagodeiro",
    slot: "neck",
    name: "Colar de búzios",
    price: 70,
    svg: () =>
      necklacePts(9)
        .map(
          ([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2.2" fill="#FBF3E2" ${O} stroke-width="1.1"/>`
        )
        .join("")
  },

  {
    id: "regata",
    p: "pagodeiro",
    slot: "top",
    name: "Regata",
    price: 60,
    svg: () =>
      `<path d="M0 87H42Q60 112 78 87H120V150H0Z" fill="#E8C24A"/><path d="M14 87H42Q60 112 78 87H106" fill="none" ${O}/>`
  },

  {
    id: "florida",
    p: "pagodeiro",
    slot: "top",
    name: "Camisa florida",
    price: 120,
    svg: () =>
      topBase("#2EA3A3") +
      flowersOn(
        [
          [36, 100],
          [56, 112],
          [80, 98],
          [70, 126],
          [44, 128],
          [92, 118]
        ],
        3.6
      ) +
      `<path d="M47 86L58 96L60 89Z" fill="#1F7F7F" ${O}/><path d="M73 86L62 96L60 89Z" fill="#1F7F7F" ${O}/>` +
      topHem
  },

  {
    id: "pandeiro",
    p: "pagodeiro",
    slot: "hand",
    name: "Pandeiro",
    price: 80,
    svg: (x, y) =>
      H(
        x,
        y,
        `<circle r="11" fill="#EAD7AE" ${O} stroke-width="1.8"/><circle r="11" fill="none" stroke="#8B5A2B" stroke-width="3.2"/>${[0, 72, 144, 216, 288].map(a => `<rect x="-2.5" y="-13" width="5" height="4" rx="1" fill="#C9CED6" transform="rotate(${a})"/>`).join("")}`
      )
  },

  {
    id: "pag_cavaquinho",
    p: "pagodeiro",
    slot: "hand",
    name: "Cavaquinho",
    price: 110,
    svg: (x, y) => H(x, y, `<g transform="scale(.82)">${guitar("#B5763A", "#5A3A22", true)}</g>`)
  },

  {
    id: "pag_seda",
    p: "pagodeiro",
    slot: "top",
    name: "Camisa de seda dourada",
    ach: "produtivo",
    svg: () =>
      topBase("#D9A520") +
      `<path d="M20 100L44 140M70 96L96 140" stroke="#FFF3C4" stroke-opacity=".55" stroke-width="5"/><path d="M47 86L58 97L60 89Z" fill="#B88A12" ${O}/><path d="M73 86L62 97L60 89Z" fill="#B88A12" ${O}/>` +
      topHem
  },

  {
    id: "chapeu_praia",
    p: "pagodeiro",
    slot: "hat",
    name: "Chapéu de praia",
    ach: "semana_agua",
    svg: () =>
      `<path d="M38 37Q38 12 60 12Q82 12 82 37Z" fill="#F6D365" ${O}/><path d="M39 31H81" stroke="#E86A92" stroke-width="5"/><ellipse cx="60" cy="38" rx="52" ry="9" fill="#F6D365" ${O}/>`
  }
);
