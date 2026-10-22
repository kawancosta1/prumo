/*
  Mundo Sertanejo: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.sertanejo = {
  name: "Sertanejo",
  desc: "Romântico, do interior e sempre de boa.",
  sad: "Tô mais triste que modão de corno, viu?",
  starter: ["cowboy", "xadrez"],
  hi: "Bão{nome}? Hoje tem <b>{n}</b> tarefas na lida. Bora que bora!",
  cheers: ["Ô trem bão! Uma a menos.", "Isso aí, peão! Tá no laço.", "Feito! Isso merece um modão."],
  drink: "Água fresquinha igual de mina. <b>+{ml} mL</b>!",
  goal: "Meta de água batida! Tô igual açude cheio.",
  thirsty: "Tô mais seco que pasto em agosto! Faltam <b>{ml} mL</b>.",
  late: "Tem <b>{n}</b> tarefas atrasadas, sô. Vamo tocar a boiada?",
  night: "Já é noite no sertão. Fecha o dia e vai descansar.",
  done: "Lida do dia completa! Hoje a sofrência é só de alegria.",
  focus: "Foco igual peão em cima do touro."
};

THEMES.sertanejo = {
  font: '"Rye"',
  ds: 0.82,
  L: ["#F3EBDD", "#FFFDF8", "#2B1D12", "#8B4A1C", "#2F8C8C", "#FFFBF2"],
  D: ["#17110B", "#221A12", "#F2E6D3", "#E0A35A", "#4FC0B8", "#2E241A"],
  water: { name: "Água da mina", spd: 3.2, amp: 4, part: "leaf" },
  vars: [
    { id: "base", name: "Couro" },
    { id: "sol", name: "Pôr do sol no campo", price: 120, a: ["#C2410C", "#FF8F4D"] },
    { id: "lenda", name: "Rodeio de ouro", ach: "nivel5", a: ["#9A6B00", "#F2C14E"] }
  ]
};

ITEMS.push(
  /* SERTANEJO */
  {
    id: "cowboy",
    p: "sertanejo",
    slot: "hat",
    name: "Chapéu de cowboy",
    price: 120,
    svg: () => cowboyHat("#9C6A35")
  },

  {
    id: "sert_chapeu_branco",
    p: "sertanejo",
    slot: "hat",
    name: "Chapéu branco",
    price: 140,
    svg: () => cowboyHat("#F2EEE4", "#2B1D12")
  },

  {
    id: "sert_bigode",
    p: "sertanejo",
    slot: "face",
    name: "Bigodão",
    price: 70,
    svg: () => mustache("#4A2E12")
  },

  {
    id: "sert_lenco",
    p: "sertanejo",
    slot: "neck",
    name: "Lenço azul",
    price: 60,
    svg: () => neckBand("#2F5EA8")
  },

  {
    id: "xadrez",
    p: "sertanejo",
    slot: "top",
    name: "Camisa xadrez",
    price: 110,
    svg: () => plaid("#B7372E", "rgba(0,0,0,.28)")
  },

  {
    id: "sert_xadrez_azul",
    p: "sertanejo",
    slot: "top",
    name: "Xadrez azul",
    price: 110,
    svg: () => plaid("#2F5EA8", "rgba(0,0,0,.28)")
  },

  {
    id: "sert_colete",
    p: "sertanejo",
    slot: "top",
    name: "Colete de couro",
    price: 130,
    svg: () => vest("#8B5A2B", "#F4F1EA")
  },

  {
    id: "sert_viola",
    p: "sertanejo",
    slot: "hand",
    name: "Viola",
    price: 120,
    svg: (x, y) => H(x, y, guitar("#C98B4A", "#6B4E3D", true))
  },

  {
    id: "sert_chapeu_ouro",
    p: "sertanejo",
    slot: "hat",
    name: "Chapéu de ouro",
    ach: "produtivo",
    svg: () =>
      cowboyHat("#E2B23A", "#7A5200") +
      `<path d="M52 20l2 4.4 4.8.6-3.5 3.3.9 4.8-4.2-2.4-4.2 2.4.9-4.8-3.5-3.3 4.8-.6z" fill="#FFF3C4" stroke="#7A5200" stroke-width="1"/>`
  },

  {
    id: "sert_jeans",
    p: "sertanejo",
    slot: "top",
    name: "Camisa jeans",
    ach: "semana_agua",
    svg: () =>
      topBase("#4A79B8") +
      `<path d="M60 92V150" stroke="#E8C24A" stroke-width="1.4" stroke-dasharray="3 2"/><rect x="34" y="102" width="14" height="11" rx="1.5" fill="none" stroke="#E8C24A" stroke-width="1.3" stroke-dasharray="2 1.5"/><rect x="72" y="102" width="14" height="11" rx="1.5" fill="none" stroke="#E8C24A" stroke-width="1.3" stroke-dasharray="2 1.5"/><path d="M47 86L58 96L60 89Z" fill="#3B66A0" ${O}/><path d="M73 86L62 96L60 89Z" fill="#3B66A0" ${O}/>` +
      topHem
  }
);
