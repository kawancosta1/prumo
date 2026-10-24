/*
  Os outros mundos, caprichados (vem depois dos arquivos de cada mundo):
  falas novas (várias por momento, como no emo), sub-temas novos e mais roupinhas.
  Cada bloco é um mundo. A decoração da tela de todos fica em estilos/mundos/skins.css.
*/
"use strict";

/** Item curtinho: itemMundo("rapper", "rap_x", "hat", "Nome", 90, () => svg) */
const itemMundo = (p, id, slot, name, price, svg, extra = {}) => ({
  id,
  p,
  slot,
  name,
  price,
  svg,
  ...extra
});
/** Sub-tema curtinho: só troca destaque (a) e água (w) e o resto que vier em extra. */
const temaMundo = (id, name, price, a, w, extra = {}) => ({
  id,
  name,
  price,
  a,
  ...(w ? { w } : {}),
  ...extra
});
/** Coloca sub-temas antes do lendário (que fica sempre por último). */
const maisTemas = (m, lista) => {
  const vs = THEMES[m].vars;
  const i = vs.findIndex(v => v.ach);
  vs.splice(i < 0 ? vs.length : i, 0, ...lista);
};
/** Junta roupinhas novas sem repetir nome que o mundo já tem. */
const maisItens = (...novos) =>
  ITEMS.push(
    ...novos.filter(n => !ITEMS.some(i => i.id === n.id || (i.p === n.p && norm(i.name) === norm(n.name))))
  );
const maisFalas = (m, f) => Object.assign(PERSONAS[m], f);

/* =============== SERTANEJO =============== */
maisFalas("sertanejo", {
  desc: "Romântico, do interior e sempre de boa. Café passado, modão e pôr do sol na porteira.",
  sad: [
    "Fiquei igual porteira aberta: esperando você voltar...",
    "Sem você o modão fica sem graça, sô.",
    "O cavalo até perguntou de você."
  ],
  hi: [
    "Bão{nome}? Hoje tem <b>{n}</b> tarefas na lida. Bora que bora!",
    "Café passado, galo cantou{nome}. <b>{n}</b> tarefas pra hoje.",
    "Ô de casa{nome}! A lida de hoje tem <b>{n}</b> tarefas.",
    "Bom dia, peão{nome}! Laça essas <b>{n}</b> tarefas que o dia é nosso."
  ],
  cheers: [
    "Ô trem bão! Uma a menos.",
    "Isso aí, peão! Tá no laço.",
    "Feito! Isso merece um modão.",
    "Laçou bonito, sô!",
    "Porteira fechada, tarefa feita.",
    "Eita que o rodeio tá pegando fogo!",
    "Mais uma pra conta. Que orgulho, uai."
  ],
  drink: [
    "<b>+{ml} mL</b> da água da mina. Fresquinha!",
    "Bebeu <b>{ml} mL</b>. O gado agradece o exemplo.",
    "<b>+{ml} mL</b> de água de pote de barro.",
    "<b>+{ml} mL</b>. Peão hidratado não cai do cavalo."
  ],
  goal: [
    "Meta de água batida! Açude cheio, sô.",
    "Água da mina toda bebida. Bão demais!",
    "Hidratado igual pasto depois da chuva."
  ],
  thirsty: [
    "Tá seco igual estrada de terra em agosto. Faltam <b>{ml} mL</b>.",
    "Bebe <b>{ml} mL</b>, que o sol tá quente na lida.",
    "O pote tá esperando. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> tarefas fugiram do curral. Bora laçar?",
    "<b>{n}</b> atrasadas no pasto. Uma de cada vez, sô.",
    "Ficou <b>{n}</b> pra trás. Peão não desiste."
  ],
  night: [
    "Já é noite no sertão. Fecha o dia e vai descansar.",
    "A lua subiu na porteira. Hora da rede.",
    "Grilo cantando, fogão a lenha apagando. Boa noite."
  ],
  done: [
    "Lida completa! Agora é viola e café.",
    "Tudo feito, sô. Pode pôr o modão no talo.",
    "Dia ganho. O rodeio é seu!"
  ],
  focus: [
    "Concentração de quem tira leite: calma e firme.",
    "Foco na lida, peão.",
    "Silêncio que o boi tá dormindo. Foco."
  ]
});
maisTemas("sertanejo", [
  temaMundo("rodeio", "Arena de rodeio", 140, ["#9C2A1A", "#FF7043"], ["#C8862B", "#E0A35A"], {
    wn: "Água do bebedouro",
    pat: ["star", "flag"]
  }),
  temaMundo("pasto", "Pasto verde", 110, ["#2E7D32", "#81C784"], ["#4FC0B8", "#80CBC4"], {
    part: "leaf",
    wn: "Água da chuva",
    pat: ["leaf", "leaf"]
  }),
  temaMundo("jeans", "Jeans e couro", 120, ["#1F4E79", "#6FA8DC"], null, {
    wn: "Água gelada da garrafa térmica"
  }),
  temaMundo("fogueira", "Fogueira de festa", 130, ["#D84315", "#FFAB40"], ["#FF8F00", "#FFB74D"], {
    part: "spark",
    wn: "Quentão sem álcool",
    pat: ["spark", "star"]
  })
]);
maisItens(
  itemMundo("sertanejo", "sert_chapeu_branco_2", "hat", "Chapéu de rodeio branco", 130, () =>
    cowboyHat("#F5F0E6", "#8B5A2B")
  ),
  itemMundo(
    "sertanejo",
    "sert_chapeu_palha",
    "hat",
    "Chapéu de palha",
    70,
    () =>
      cowboyHat("#E9C46A", "#C62828") +
      `<path d="M20 40l80 0" stroke="#B5892E" stroke-width=".8" stroke-dasharray="2 2"/>`
  ),
  itemMundo("sertanejo", "sert_bigode_2", "mouth", "Bigode de violeiro", 60, () => mustache("#4A2E12")),
  itemMundo("sertanejo", "sert_lenco_2", "neck", "Lenço xadrez no pescoço", 70, () =>
    neckBand("#C62828", "#fff")
  ),
  itemMundo(
    "sertanejo",
    "sert_fivela_2",
    "waist",
    "Fivelão de rodeio",
    110,
    () =>
      `<path d="M6 124H114" stroke="#5D3A1A" stroke-width="7"/><ellipse cx="60" cy="124" rx="14" ry="9" fill="#C9A646" ${O} stroke-width="1.6"/>${star5(60, 124, 5, "#FFF3C4")}`
  ),
  itemMundo(
    "sertanejo",
    "sert_colete_2",
    "top",
    "Colete de couro com franja",
    140,
    () =>
      vest("#8B5A2B", "#F5F0E6") +
      `<path d="M4 140l2 8M10 140l2 8M16 140l2 8M104 140l2 8M110 140l2 8M116 140l2 8" stroke="#6B4421" stroke-width="2"/>`
  ),
  itemMundo("sertanejo", "sert_viola_2", "hand", "Viola caipira", 140, (x, y) =>
    H(x, y, guitar("#C98B4B", "#5A3A22", true))
  ),
  itemMundo("sertanejo", "sert_laco_2", "hand", "Laço de corda", 90, (x, y) =>
    H(
      x,
      y,
      `<ellipse cx="6" cy="-10" rx="12" ry="8" fill="none" stroke="#C8A165" stroke-width="2.4"/><path d="M-2 8Q0 -2 -4 -6" stroke="#C8A165" stroke-width="2.4" fill="none"/>`
    )
  ),
  itemMundo(
    "sertanejo",
    "sert_cavalo_2",
    "pet",
    "Potrinho",
    170,
    () =>
      `<g transform="translate(16 128)"><path d="M-12 8Q-12 -4 0 -4Q8 -4 8 4V8Z" fill="#8D5A3B" stroke="var(--ink)" stroke-width="1"/><path d="M4 -4Q6 -14 12 -16Q16 -12 12 -6Z" fill="#8D5A3B" stroke="var(--ink)" stroke-width="1"/><circle cx="11" cy="-12" r="1" fill="#212121"/><path d="M6 -12Q2 -6 4 -2" stroke="#3E2723" stroke-width="2.4" fill="none"/><path d="M-10 8v6M-4 8v6M2 8v6M6 8v6" stroke="#5D3A1A" stroke-width="2"/></g>`
  ),
  itemMundo(
    "sertanejo",
    "sert_por_sol",
    "bg",
    "Pôr do sol na porteira",
    160,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#FFB74D" opacity=".4"/><circle cx="60" cy="110" r="26" fill="#FF7043" opacity=".55"/><path d="M0 116H120V148H0Z" fill="#8D6E63" opacity=".45"/><path d="M8 116V96M28 116V96M8 102H28M8 110H28" stroke="#5D3A1A" stroke-width="3" opacity=".7"/>`
  )
);

/* =============== CLEAN BOY =============== */
maisFalas("cleanboy", {
  desc: "Arrumadinho, cheiroso e organizado. Perfume bom, tênis branco e agenda em dia.",
  sad: [
    "Meu tênis branco ficou sem graça sem você...",
    "Arrumei tudo e você não apareceu.",
    "O perfume até evaporou de saudade."
  ],
  hi: [
    "Bom dia{nome}. Look alinhado, agenda alinhada: <b>{n}</b> tarefas hoje.",
    "Cama arrumada, café coado{nome}. <b>{n}</b> tarefas no planner.",
    "Skincare feito{nome}. Agora são <b>{n}</b> tarefas, com calma e capricho.",
    "Tênis limpo, mente limpa{nome}. <b>{n}</b> tarefas hoje."
  ],
  cheers: [
    "Clean. Muito clean.",
    "Organizado é outro nível.",
    "Feito com estilo.",
    "Impecável.",
    "Riscou sem amassar a camisa.",
    "Cheiroso e produtivo.",
    "Mais uma, alinhadinha."
  ],
  drink: [
    "<b>+{ml} mL</b> de água cristalina. Pele agradece.",
    "<b>+{ml} mL</b>. Hidratação é o melhor skincare.",
    "Copo de vidro, <b>{ml} mL</b>, com rodela de limão.",
    "<b>+{ml} mL</b>. Clean por dentro e por fora."
  ],
  goal: [
    "Meta de água batida. Pele de comercial.",
    "Hidratado com elegância.",
    "Garrafa vazia, missão cumprida."
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>. Pele seca não combina com você.",
    "Bebe <b>{ml} mL</b>, com estilo.",
    "Hidratação primeiro: faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> tarefas fora do lugar. Vamos organizar?",
    "<b>{n}</b> atrasadas bagunçando o planner.",
    "Tem <b>{n}</b> pendentes. Arruma uma de cada vez."
  ],
  night: [
    "Hora do skincare da noite e cama arrumada.",
    "Fecha o dia, pendura a roupa de amanhã e descansa.",
    "Luz baixa, playlist calma. Boa noite."
  ],
  done: [
    "Tudo em ordem. Que sensação boa.",
    "Lista vazia e quarto arrumado. Perfeito.",
    "Dia impecável do começo ao fim."
  ],
  focus: [
    "Mesa limpa, mente focada.",
    "Foco elegante: sem pressa e sem bagunça.",
    "Celular virado pra baixo. Foco."
  ]
});
maisTemas("cleanboy", [
  temaMundo("ceu", "Céu limpo", 110, ["#1E88E5", "#90CAF9"], ["#4FC3F7", "#81D4FA"], {
    wn: "Água com hortelã"
  }),
  temaMundo("salvia", "Verde sálvia", 120, ["#5B7F64", "#A5C9AE"], ["#7DB8A5", "#A5D6C4"], {
    part: "leaf",
    wn: "Água com pepino",
    pat: ["leaf", "spark"]
  }),
  temaMundo("bege", "Bege old money", 140, ["#7A6248", "#D8C3A5"], ["#C9B79C", "#E0D4C0"], {
    f: '"Cormorant Garamond"',
    ds: 1.12,
    wn: "Água com gás"
  }),
  temaMundo("menta", "Menta fresca", 110, ["#00897B", "#80CBC4"], ["#4DD0E1", "#80DEEA"], {
    part: "ice",
    wn: "Água gelada com menta",
    pat: ["ice", "spark"]
  })
]);
maisItens(
  itemMundo("cleanboy", "clean_bone", "hat", "Boné liso branco", 80, () => cap("#FAFAFA")),
  itemMundo(
    "cleanboy",
    "clean_topete_loiro",
    "hair",
    "Topete platinado",
    130,
    () =>
      `<path d="M24 52Q20 30 40 24Q50 10 70 14Q92 18 96 50Q88 36 74 34Q66 22 52 28Q34 30 24 52Z" fill="#ECE3C8" ${O}/>`
  ),
  itemMundo("cleanboy", "clean_oculos_2", "face", "Óculos de armação fina", 90, () =>
    lensPair("#E3F2FD", "#90A4AE", 6, 57, 13, 0.25)
  ),
  itemMundo(
    "cleanboy",
    "clean_relogio_2",
    "wrist",
    "Relógio prata",
    120,
    () =>
      `<rect x="10" y="117" width="20" height="7" rx="3" fill="#B0BEC5" ${O} stroke-width="1.2"/><circle cx="20" cy="120.5" r="4.6" fill="#ECEFF1" ${O} stroke-width="1.2"/><path d="M20 118v3l2 1" stroke="#455A64" stroke-width=".8"/>`
  ),
  itemMundo(
    "cleanboy",
    "clean_sueter",
    "top",
    "Suéter de tricô bege",
    150,
    () =>
      topBase("#E8DCC6") +
      stripesV("#D9CBB0", 8, 2, 4) +
      `<path d="M40 86Q60 100 80 86" stroke="#CDBE9F" stroke-width="5" fill="none"/>` +
      topHem
  ),
  itemMundo(
    "cleanboy",
    "clean_camisa",
    "top",
    "Camisa social azul clara",
    140,
    () =>
      topBase("#BBDEFB") +
      `<path d="M48 86L60 98L72 86L66 84L60 92L54 84Z" fill="#E3F2FD" ${O} stroke-width="1.4"/><path d="M60 98V150" stroke="#90CAF9" stroke-width="1.4"/>${[106, 118, 130, 142].map(y => `<circle cx="60" cy="${y}" r="1.4" fill="#fff"/>`).join("")}` +
      topHem
  ),
  itemMundo("cleanboy", "clean_perfume_2", "hand", "Perfume importado", 110, (x, y) =>
    H(
      x,
      y,
      `<rect x="-7" y="-10" width="14" height="18" rx="3" fill="#B3E5FC" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.4"/><rect x="-3" y="-15" width="6" height="5" fill="#212121"/><path d="M-4 -4h8" stroke="#fff" stroke-width="1.4"/><circle class="brilhinho" cx="6" cy="-14" r="1.6" fill="#fff"/>`
    )
  ),
  itemMundo(
    "cleanboy",
    "clean_tenis",
    "pet",
    "Tênis branco impecável",
    120,
    () =>
      `<g transform="translate(14 136)"><path d="M-12 4V-2Q-6 -8 2 -6Q8 -4 12 0V4Z" fill="#FAFAFA" stroke="var(--ink)" stroke-width="1.2"/><rect x="-13" y="3" width="26" height="4" rx="2" fill="#E0E0E0" stroke="var(--ink)" stroke-width="1"/><path d="M-4 -4l4 2M-2 -6l4 2" stroke="#90A4AE" stroke-width=".8"/><circle class="brilhinho" cx="8" cy="-6" r="1.4" fill="#90CAF9"/></g>`
  ),
  itemMundo(
    "cleanboy",
    "clean_closet",
    "bg",
    "Closet organizado",
    160,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#ECEFF1" opacity=".6"/><path d="M4 20H116" stroke="#B0BEC5" stroke-width="2"/>${[10, 26, 42, 84, 100].map((x, i) => `<path d="M${x} 20l-6 6v24h12V26z" fill="${["#BBDEFB", "#E8DCC6", "#FAFAFA", "#C5E1A5", "#F8BBD0"][i]}" opacity=".8"/>`).join("")}`
  )
);

/* =============== RAPPER =============== */
maisFalas("rapper", {
  desc: "Rimas, atitude e visão de futuro. Caderno de letras na mão e a quebrada no coração.",
  sad: [
    "O beat tocou e você não tava... saudade, irmão.",
    "Sem você a rima não fecha.",
    "Caderno de letra parado. Volta pro corre."
  ],
  hi: [
    "Salve{nome}! Hoje são <b>{n}</b> tarefas na batida. Bora fazer acontecer.",
    "Bom dia, MC{nome}! <b>{n}</b> versos pra rimar hoje.",
    "Respeita a caminhada{nome}: <b>{n}</b> tarefas e muita atitude.",
    "O beat tá rolando{nome}. São <b>{n}</b> tarefas no corre."
  ],
  cheers: [
    "Rimou com sucesso!",
    "Mais uma pro portfólio, irmão.",
    "Respeita o corre!",
    "Flow absurdo!",
    "Isso é rima de ouro.",
    "Do caderno pro palco. Feito!",
    "A quebrada tá orgulhosa."
  ],
  drink: [
    "<b>+{ml} mL</b>. Garganta molhada, rima afiada.",
    "Hidratou: <b>+{ml} mL</b>. MC de respeito cuida da voz.",
    "<b>+{ml} mL</b> pra segurar o verso longo.",
    "<b>+{ml} mL</b> de ouro líquido."
  ],
  goal: [
    "Meta de água batida. Voz de campeão.",
    "Hidratado igual disco de platina.",
    "Água no talo. Pode soltar o verso."
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>. Sem água não tem rima.",
    "Garganta seca, verso travado. Bebe <b>{ml} mL</b>.",
    "Bebe <b>{ml} mL</b> e volta pro palco."
  ],
  late: [
    "<b>{n}</b> versos pendentes. A gente termina essa letra.",
    "<b>{n}</b> atrasadas. Corre que dá tempo.",
    "Ficou <b>{n}</b> pra trás. Sem desistir, irmão."
  ],
  night: [
    "Show acabou. Fecha o dia e descansa a voz.",
    "Luz da cidade acesa, caderno fechado. Boa noite.",
    "O beat silenciou. Hora de dormir."
  ],
  done: ["Álbum do dia completo!", "Tudo feito. Isso é história.", "Lista vazia. Mic drop."],
  focus: [
    "Fone no ouvido, foco no verso.",
    "Escrevendo em silêncio. Foco total.",
    "Sem distração, só o beat e você."
  ]
});
maisTemas("rapper", [
  temaMundo("rua", "Grafite da rua", 120, ["#D32F2F", "#FF6E6E"], null, {
    f: '"Permanent Marker"',
    wn: "Água da garrafinha",
    pat: ["star", "drop"]
  }),
  temaMundo("vinil", "Vinil antigo", 130, ["#5D4037", "#BCAAA4"], ["#8D6E63", "#BCAAA4"], {
    part: "note",
    wn: "Chá gelado",
    pat: ["note", "note"]
  }),
  temaMundo("platina", "Disco de platina", 160, ["#607D8B", "#CFD8DC"], ["#B0BEC5", "#ECEFF1"], {
    part: "gem",
    wn: "Água de platina"
  }),
  temaMundo("noite", "Cidade à noite", 140, ["#7E57C2", "#B39DDB"], ["#5C6BC0", "#9FA8DA"], {
    part: "spark",
    wn: "Água das luzes",
    pat: ["spark", "star"]
  })
]);
maisItens(
  itemMundo(
    "rapper",
    "rap_bone_preto",
    "hat",
    "Boné aba reta preto",
    90,
    () =>
      cap("#212121") +
      `<text x="60" y="36" font-size="11" text-anchor="middle" fill="#F2C14E" font-weight="900" font-family="Anton,Impact,sans-serif">MC</text>`
  ),
  itemMundo(
    "rapper",
    "rap_bandana",
    "hat",
    "Bandana na cabeça",
    80,
    () =>
      `<path d="M24 46Q24 16 60 16Q96 16 96 46Z" fill="#1565C0" ${O}/><circle cx="44" cy="30" r="2" fill="#fff"/><circle cx="62" cy="24" r="2" fill="#fff"/><circle cx="78" cy="32" r="2" fill="#fff"/><path d="M94 42l12 8-4 6" fill="#1565C0" ${O} stroke-width="1.6"/>`
  ),
  itemMundo("rapper", "rap_oculos_ouro_2", "face", "Óculos de aro dourado", 120, () =>
    lensPair("#5D4037", "#F2C14E", 3, 58, 12, 0.85)
  ),
  itemMundo(
    "rapper",
    "rap_dente",
    "mouth",
    "Dente de ouro",
    90,
    () =>
      `<path d="M50 74Q60 80 70 74" stroke="var(--ink)" stroke-width="2" fill="none"/><rect x="62" y="74" width="4" height="4" rx="1" fill="#F2C14E" stroke="#9A6B00" stroke-width=".8"/>`
  ),
  itemMundo("rapper", "rap_corrente_mic", "neck", "Corrente com microfone", 150, () =>
    chainN(
      "#F2C14E",
      3.4,
      `<rect x="56" y="100" width="8" height="12" rx="4" fill="#F2C14E" ${O} stroke-width="1.2"/><path d="M60 112v4" stroke="#F2C14E" stroke-width="2"/>`
    )
  ),
  itemMundo(
    "rapper",
    "rap_jaqueta",
    "top",
    "Jaqueta de time oversized",
    160,
    () =>
      topBase("#1B1B1B") +
      `<path d="M0 84H40V150H0ZM120 84H80V150H120Z" fill="#F2C14E" opacity=".9"/><path d="M60 88V150" stroke="#F2C14E" stroke-width="2"/><text x="30" y="122" font-size="16" font-weight="900" fill="#1B1B1B" font-family="Anton,Impact,sans-serif">23</text>` +
      topHem
  ),
  itemMundo("rapper", "rap_caderno_2", "hand", "Caderno de rimas", 90, (x, y) =>
    H(
      x,
      y,
      `<rect x="-10" y="-14" width="18" height="24" rx="1" fill="#FFF8E1" stroke="var(--ink)" stroke-width="1.4"/><path d="M-8 -14v24" stroke="#E53935" stroke-width="1"/><path d="M-5 -8h10M-5 -4h10M-5 0h8M-5 4h9" stroke="#90A4AE" stroke-width=".8"/>`
    )
  ),
  itemMundo(
    "rapper",
    "rap_boombox",
    "pet",
    "Boombox",
    150,
    () =>
      `<g transform="translate(16 132)"><rect x="-14" y="-10" width="28" height="18" rx="3" fill="#37474F" stroke="var(--ink)" stroke-width="1.2"/><circle cx="-7" cy="-1" r="5" fill="#212121" stroke="#90A4AE" stroke-width="1"/><circle cx="7" cy="-1" r="5" fill="#212121" stroke="#90A4AE" stroke-width="1"/><rect x="-4" y="-8" width="8" height="3" fill="#00E5FF"/><path d="M-10 -10Q0 -18 10 -10" stroke="#90A4AE" stroke-width="1.6" fill="none"/></g>`
  ),
  itemMundo(
    "rapper",
    "rap_muro_2",
    "bg",
    "Muro grafitado",
    170,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#9E9E9E" opacity=".35"/>${[0, 20, 40, 60, 80, 100, 120].map(y => `<path d="M0 ${y}H120" stroke="#757575" opacity=".4"/>`).join("")}<text x="8" y="40" font-size="22" font-family="Permanent Marker, cursive" fill="#E91E63" opacity=".7">RIMA</text><text x="54" y="80" font-size="18" font-family="Permanent Marker, cursive" fill="#2979FF" opacity=".7">CORRE</text>`
  )
);

/* =============== TRAPPER =============== */
maisFalas("trapper", {
  desc: "Estiloso, confiante e focado no bag. Drip na roupa e disciplina na rotina.",
  sad: [
    "Sem você o drip perdeu o brilho...",
    "Fiquei no estúdio sozinho, mano.",
    "O beat tá parado esperando você."
  ],
  hi: [
    "Ayy{nome}! <b>{n}</b> tarefas hoje, é tudo pelo bag.",
    "Acordei no drip{nome}. <b>{n}</b> tarefas no roteiro.",
    "Bom dia{nome}! <b>{n}</b> tarefas, sem pressa e sem pausa.",
    "Skrrt{nome}! Hoje são <b>{n}</b> missões. Bora brilhar."
  ],
  cheers: [
    "Skrrt! Mais uma no bolso.",
    "Isso é drip de produtividade.",
    "Brabo demais!",
    "Gelo no pulso, tarefa feita.",
    "Ayy, tá voando!",
    "Mais uma pro hit do dia.",
    "Diamante lapidado."
  ],
  drink: [
    "<b>+{ml} mL</b> no gelo. Refrescante.",
    "<b>+{ml} mL</b>. Hidratação também é drip.",
    "Copo com gelo, <b>{ml} mL</b>. Brilhou.",
    "<b>+{ml} mL</b> de água com estilo."
  ],
  goal: [
    "Meta de água batida. Gelo total.",
    "Hidratado e brilhando igual diamante.",
    "Garrafa vazia, bag cheio."
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>. Até o gelo derreteu.",
    "Bebe <b>{ml} mL</b>, mano.",
    "Sem água o brilho apaga. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> tarefas atrasadas. Bora correr atrás do bag.",
    "<b>{n}</b> pendentes. Foco no objetivo.",
    "Ficou <b>{n}</b> pra trás. Sem estresse, só ação."
  ],
  night: [
    "A noite chegou. Fecha o dia e descansa, amanhã tem mais.",
    "Estúdio fechado. Boa noite.",
    "Luz roxa apagada. Hora de dormir."
  ],
  done: ["Tudo feito. Isso é hit.", "Lista zerada. Drip infinito.", "Dia brabo do começo ao fim."],
  focus: ["Foco no bag.", "Sem distração. Só o objetivo.", "Modo estúdio: gravando o futuro."]
});
maisTemas("trapper", [
  temaMundo("ouro", "Ouro rosé", 140, ["#B76E79", "#F4B6C2"], ["#E8A0AA", "#F4C2CC"], {
    part: "gem",
    wn: "Água rosé"
  }),
  temaMundo("verde", "Verde cash", 130, ["#2E7D32", "#69F0AE"], ["#00C853", "#69F0AE"], {
    part: "gem",
    wn: "Água verde"
  }),
  temaMundo("fumaca", "Fumaça roxa", 120, ["#7B1FA2", "#CE93D8"], ["#9575CD", "#B39DDB"], {
    wn: "Água na neblina",
    pat: ["spark", "ice"]
  }),
  temaMundo("preto", "Tudo preto", 150, ["#212121", "#BDBDBD"], ["#424242", "#9E9E9E"], {
    wn: "Água preta (é água, juro)"
  })
]);
maisItens(
  itemMundo(
    "trapper",
    "trap_balaclava",
    "hat",
    "Touca com orelhinha",
    110,
    () =>
      beanie("#4A148C", "#4A148C", "#E040FB") +
      `<path d="M30 20l-4 -12 12 6M90 20l4 -12 -12 6" fill="#4A148C" ${O} stroke-width="1.6"/>`
  ),
  itemMundo(
    "trapper",
    "trap_trancas_2",
    "hair",
    "Tranças com miçanga",
    140,
    () =>
      `<path d="M22 52Q20 22 60 20Q100 22 98 52Q90 38 60 36Q30 38 22 52Z" fill="#212121" ${O}/>${[26, 36, 84, 94].map(x => `<path d="M${x} 46V${x < 60 ? 92 : 92}" stroke="#212121" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="94" r="3" fill="#E040FB"/>`).join("")}`
  ),
  itemMundo(
    "trapper",
    "trap_lagrima",
    "cheek",
    "Tatuagem de lagrimazinha",
    60,
    () =>
      `<path d="M80 72q2 4 0 6q-2 -2 0 -6z" fill="#212121"/><path d="M38 70l2 0M38 72h3" stroke="#212121" stroke-width=".8"/>`
  ),
  itemMundo(
    "trapper",
    "trap_grillz",
    "mouth",
    "Grillz de diamante",
    160,
    () =>
      `<path d="M50 74Q60 82 70 74Z" fill="#E1F5FE" ${O} stroke-width="1.4"/><path d="M54 75v3M58 76v3M62 76v3M66 75v3" stroke="#81D4FA" stroke-width="1"/><circle class="brilhinho" cx="64" cy="76" r="1.2" fill="#fff"/>`
  ),
  itemMundo(
    "trapper",
    "trap_corrente_dupla",
    "neck",
    "Correntes duplas",
    170,
    () =>
      chainN("#ECEFF1", 3, "") +
      `<path d="M24 86Q60 118 96 86" fill="none" stroke="#F2C14E" stroke-width="3" stroke-dasharray="2.7 1.4"/><path d="M56 108l4 -4 4 4 -4 6z" fill="#B3E5FC" ${O} stroke-width="1"/>`
  ),
  itemMundo(
    "trapper",
    "trap_puffer_2",
    "top",
    "Jaqueta puffer",
    170,
    () =>
      topBase("#7B1FA2") +
      stripesH("#6A1B9A", 12, 3, 96) +
      `<path d="M60 86V150" stroke="#4A148C" stroke-width="2.4"/>` +
      topHem
  ),
  itemMundo("trapper", "trap_copo", "hand", "Copo com gelo", 80, (x, y) =>
    H(
      x,
      y,
      `<path d="M-7 -12H7L5 10H-5Z" fill="#E1F5FE" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.4"/><rect x="-4" y="-8" width="4" height="4" fill="#fff" stroke="#81D4FA" stroke-width=".6"/><rect x="0" y="-4" width="4" height="4" fill="#fff" stroke="#81D4FA" stroke-width=".6"/><path d="M3 -12L8 -20" stroke="#E040FB" stroke-width="1.6"/>`
    )
  ),
  itemMundo(
    "trapper",
    "trap_cachorro",
    "pet",
    "Pitbull de corrente",
    160,
    () =>
      `<g transform="translate(16 130)"><path d="M-12 10Q-12 -4 0 -4Q12 -4 12 10Z" fill="#9E9E9E" stroke="var(--ink)" stroke-width="1"/><circle cy="-8" r="7" fill="#9E9E9E" stroke="var(--ink)" stroke-width="1"/><path d="M-6 -14l-3 -3M6 -14l3 -3" stroke="#757575" stroke-width="2.4" stroke-linecap="round"/><circle cx="-2.5" cy="-9" r="1" fill="#212121"/><circle cx="2.5" cy="-9" r="1" fill="#212121"/><ellipse cy="-5" rx="2.4" ry="1.6" fill="#212121"/><path d="M-6 0Q0 4 6 0" stroke="#F2C14E" stroke-width="2" fill="none"/></g>`
  ),
  itemMundo(
    "trapper",
    "trap_estudio",
    "bg",
    "Estúdio com luz roxa",
    170,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#4A148C" opacity=".45"/><rect class="neon" x="10" y="10" width="40" height="6" rx="3" fill="#E040FB" opacity=".8"/><rect x="86" y="40" width="26" height="60" rx="3" fill="#212121" opacity=".6"/><circle cx="99" cy="58" r="8" fill="#424242"/><circle cx="99" cy="84" r="10" fill="#424242"/>`
  )
);

/* =============== PAGODEIRO =============== */
maisFalas("pagodeiro", {
  desc: "Resenha boa, alegria e roda de samba. Pandeiro na mão e sorriso no rosto.",
  sad: [
    "A roda ficou sem graça sem você...",
    "Cavaquinho desafinou de saudade.",
    "Tô esperando você pra puxar o refrão."
  ],
  hi: [
    "Opa{nome}! Hoje são <b>{n}</b> tarefas, mas com alegria tudo flui.",
    "Bom dia, parceiro{nome}! A roda de hoje tem <b>{n}</b> tarefas.",
    "E aí{nome}? <b>{n}</b> tarefas e uma resenha boa no fim do dia.",
    "Bate na palma{nome}! <b>{n}</b> tarefas no repertório."
  ],
  cheers: [
    "Aí sim! Bate na palma da mão!",
    "Que resenha boa, uma a menos!",
    "Feito! Toca um pagodinho aí.",
    "Isso é samba no pé!",
    "Ô lê lê, riscou!",
    "O pandeiro tá batendo forte!",
    "Mais uma! A roda tá animada."
  ],
  drink: [
    "<b>+{ml} mL</b> de água de coco. Resenha hidratada!",
    "<b>+{ml} mL</b>. Cantor bom molha a garganta.",
    "Bebeu <b>{ml} mL</b>. Bora pro próximo samba.",
    "<b>+{ml} mL</b> geladinho, na beira da praia."
  ],
  goal: [
    "Meta de água batida! Hidratado igual coqueiro.",
    "Água no ponto. Pode cantar a noite toda.",
    "Garrafa vazia, coração cheio."
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>. A garganta tá pedindo.",
    "Bebe <b>{ml} mL</b> que o samba é longo.",
    "Sem água não tem refrão. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> atrasadas, mas a roda continua. Bora?",
    "<b>{n}</b> tarefas esperando a vez de cantar.",
    "Ficou <b>{n}</b> pra trás. Na resenha a gente resolve."
  ],
  night: [
    "A roda acabou. Fecha o dia e vai descansar.",
    "Último samba da noite. Boa noite, parceiro.",
    "Lua no céu, pandeiro guardado."
  ],
  done: [
    "Tudo feito! Hoje a roda foi perfeita.",
    "Lista vazia. Pode puxar o samba de comemoração.",
    "Dia arretado de bom."
  ],
  focus: [
    "Foco no ensaio, a roda é depois.",
    "Concentração de quem afina o cavaco.",
    "Silêncio na roda. Foco."
  ]
});
maisTemas("pagodeiro", [
  temaMundo("roda", "Roda de samba", 130, ["#1B5E20", "#66BB6A"], ["#FDD835", "#FFEE58"], {
    wn: "Caldo de cana (é água)",
    pat: ["note", "star"]
  }),
  temaMundo("praia", "Pagode na praia", 120, ["#00838F", "#4DD0E1"], ["#26C6DA", "#80DEEA"], {
    wn: "Água de coco gelada"
  }),
  temaMundo("quintal", "Quintal de casa", 110, ["#BF360C", "#FF8A65"], null, {
    wn: "Suco de caju",
    pat: ["leaf", "note"]
  }),
  temaMundo("estrela", "Show de estrela", 150, ["#6A1B9A", "#CE93D8"], ["#F2C14E", "#FFE082"], {
    part: "spark",
    wn: "Água com brilho",
    pat: ["spark", "note"]
  })
]);
maisItens(
  itemMundo("pagodeiro", "pag_chapeu_panama", "hat", "Chapéu panamá", 110, () =>
    cowboyHat("#F5F0E6", "#212121").replace(
      /Q34 7 50 9Q60 17 70 9Q86 7 82 36/,
      "Q36 14 50 14Q60 18 70 14Q84 14 82 36"
    )
  ),
  itemMundo("pagodeiro", "pag_bone_branco", "hat", "Boné branco virado", 80, () =>
    cap("#FAFAFA").replace(/M60 44H108Q111 50 100 51H60Z/, "M60 44H12Q9 50 20 51H60Z")
  ),
  itemMundo("pagodeiro", "pag_oculos", "face", "Óculos espelhado", 100, () =>
    lensPair("#4FC3F7", "#212121", 4, 58, 12, 0.85)
  ),
  itemMundo("pagodeiro", "pag_cordao_2", "neck", "Cordão com medalha", 120, () =>
    chainN(
      "#F2C14E",
      2.6,
      `<circle cx="60" cy="106" r="6" fill="#F2C14E" ${O} stroke-width="1.2"/>${star5(60, 106, 3, "#FFF3C4")}`
    )
  ),
  itemMundo(
    "pagodeiro",
    "pag_camisa_floral",
    "top",
    "Camisa floral",
    150,
    () =>
      topBase("#1565C0") +
      flowersOn(
        [
          [16, 100],
          [40, 120],
          [84, 104],
          [104, 128],
          [28, 142],
          [92, 146],
          [60, 134]
        ],
        4.4
      ) +
      `<path d="M48 86L60 98L72 86" fill="#0D47A1" ${O}/>` +
      topHem
  ),
  itemMundo("pagodeiro", "pag_cavaco", "hand", "Cavaquinho", 140, (x, y) =>
    H(x, y, guitar("#E2B547", "#6D4C41", true))
  ),
  itemMundo("pagodeiro", "pag_tantan", "hand", "Tantã", 130, (x, y) =>
    H(
      x,
      y,
      `<rect x="-8" y="-16" width="16" height="28" rx="3" fill="#C62828" stroke="var(--ink)" stroke-width="1.4"/><ellipse cy="-16" rx="8" ry="2.4" fill="#FFF8E1" stroke="var(--ink)" stroke-width="1"/><path d="M-8 -6h16M-8 4h16" stroke="#FDD835" stroke-width="1.4"/>`
    )
  ),
  itemMundo(
    "pagodeiro",
    "pag_cooler",
    "pet",
    "Coolerzinho",
    100,
    () =>
      `<g transform="translate(16 134)"><rect x="-12" y="-8" width="24" height="14" rx="2" fill="#E53935" stroke="var(--ink)" stroke-width="1.2"/><rect x="-12" y="-11" width="24" height="5" rx="2" fill="#FAFAFA" stroke="var(--ink)" stroke-width="1"/><path d="M-4 -11v-3h8v3" stroke="#757575" stroke-width="1.4" fill="none"/></g>`
  ),
  itemMundo(
    "pagodeiro",
    "pag_laje",
    "bg",
    "Laje com varal de luzes",
    160,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#FF8A65" opacity=".3"/><path d="M0 14Q60 34 120 14" stroke="#5D4037" stroke-width="1" fill="none"/>${[10, 30, 50, 70, 90, 110].map((x, i) => `<circle class="pisca" style="animation-delay:${i * 0.2}s" cx="${x}" cy="${20 + Math.sin(i) * 4}" r="3" fill="${["#FDD835", "#E53935", "#43A047"][i % 3]}"/>`).join("")}<path d="M0 120H120V148H0Z" fill="#8D6E63" opacity=".35"/>`
  )
);

/* =============== FUNKEIRO =============== */
maisFalas("funkeiro", {
  desc: "Animado, criativo e cheio de gírias. O grave bate e a produtividade vem junto.",
  sad: [
    "O baile ficou vazio sem você, mano...",
    "Caixa de som desligada de saudade.",
    "Volta que o fluxo tá parado!"
  ],
  hi: [
    "Fala{nome}! Hoje são <b>{n}</b> tarefas, vamo que vamo!",
    "Bom dia, cria{nome}! <b>{n}</b> tarefas no baile de hoje.",
    "Tá tranquilo, tá favorável{nome}: <b>{n}</b> tarefas pra hoje.",
    "Solta o grave{nome}! São <b>{n}</b> tarefas."
  ],
  cheers: [
    "É o fluxo! Uma a menos.",
    "Tá tranquilo, tá favorável!",
    "Meteu essa!",
    "Mandou o passinho!",
    "Que isso, mano, brabo!",
    "O grave bateu forte nessa.",
    "Riscou no estilo, é nóis!"
  ],
  drink: [
    "<b>+{ml} mL</b>. Hidratado pro baile!",
    "Bebeu <b>{ml} mL</b>, tá no fluxo.",
    "<b>+{ml} mL</b> pra aguentar o passinho.",
    "<b>+{ml} mL</b> geladinha, é nóis."
  ],
  goal: [
    "Meta de água batida! Pode dançar até amanhã.",
    "Hidratação no talo, mano.",
    "Garrafa zerada. Baile garantido."
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>. Sem água não tem passinho.",
    "Bebe <b>{ml} mL</b>, cria!",
    "O grave pede água. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> tarefas ficaram pra trás. Bora no fluxo?",
    "<b>{n}</b> atrasadas. Mete marcha!",
    "Ficou <b>{n}</b>. Sem moscar, mano."
  ],
  night: [
    "Acabou o baile do dia. Fecha tudo e descansa.",
    "Som desligado. Boa noite, cria.",
    "Hora de dormir pra voltar mais forte."
  ],
  done: ["Tudo feito! O baile foi histórico.", "Lista zerada. É nóis!", "Dia brabo, mano."],
  focus: [
    "Foco no corre, o baile é depois.",
    "Fone no ouvido, mente no objetivo.",
    "Concentração total, sem moscar."
  ]
});
maisTemas("funkeiro", [
  temaMundo("neon", "Baile neon", 140, ["#D500F9", "#EA80FC"], ["#00E5FF", "#84FFFF"], {
    part: "star",
    wn: "Água neon azul",
    pat: ["star", "bolt"]
  }),
  temaMundo("favela", "Morro ao entardecer", 130, ["#E65100", "#FFB74D"], ["#FFA726", "#FFCC80"], {
    wn: "Guaraná (é água)"
  }),
  temaMundo("ouro", "Kit de ouro", 150, ["#B8860B", "#FFD54F"], ["#F2C14E", "#FFE082"], {
    part: "gem",
    wn: "Água dourada"
  }),
  temaMundo("azul", "Azul de baile", 120, ["#1565C0", "#64B5F6"], null, { wn: "Água geladíssima" })
]);
maisItens(
  itemMundo("funkeiro", "funk_bone_aba", "hat", "Boné de aba curva", 80, () => cap("#00897B")),
  itemMundo(
    "funkeiro",
    "funk_luzes",
    "hair",
    "Cabelo com luzes",
    120,
    () =>
      hairSpiky("#3E2723") +
      `<path d="M40 22L44 32M54 14L56 30M66 12L66 28M78 18L76 30" stroke="#FFE082" stroke-width="3" stroke-linecap="round"/>`
  ),
  itemMundo(
    "funkeiro",
    "funk_sobrancelha",
    "face",
    "Risquinho na sobrancelha",
    40,
    () =>
      `<path d="M38 52Q46 48 54 52M66 52Q74 48 82 52" stroke="var(--ink)" stroke-width="2.6" fill="none"/><path d="M48 49l1 4M72 49l-1 4" stroke="var(--bg, #fff)" stroke-width="1.4"/>`
  ),
  itemMundo("funkeiro", "funk_corrente_2", "neck", "Correntão de prata", 130, () =>
    chainN("#CFD8DC", 4.4, "")
  ),
  itemMundo(
    "funkeiro",
    "funk_camisa_listrada",
    "top",
    "Camisa de time listrada",
    130,
    () =>
      topBase("#FAFAFA") +
      stripesV("#1B5E20", 14, 7, 0) +
      `<text x="60" y="130" font-size="18" text-anchor="middle" fill="#FDD835" font-weight="900" font-family="Anton,Impact,sans-serif" stroke="#1B5E20" stroke-width=".8">10</text>` +
      topHem
  ),
  itemMundo(
    "funkeiro",
    "funk_bermuda",
    "waist",
    "Bermuda de tactel",
    90,
    () =>
      `<path d="M0 124H120V150H0Z" fill="#2979FF" opacity=".9"/><path d="M0 124H120" stroke="#fff" stroke-width="2"/><path d="M100 128v20" stroke="#fff" stroke-width="2"/>`
  ),
  itemMundo("funkeiro", "funk_caixa", "hand", "Caixinha de som", 110, (x, y) =>
    H(
      x,
      y,
      `<rect x="-9" y="-12" width="18" height="22" rx="3" fill="#212121" stroke="var(--ink)" stroke-width="1.4"/><circle cy="-3" r="5" fill="#424242" stroke="#00E676" stroke-width="1.2"/><circle cy="6" r="2" fill="#424242"/>`
    )
  ),
  itemMundo(
    "funkeiro",
    "funk_moto",
    "pet",
    "Motinha de brinquedo",
    140,
    () =>
      `<g transform="translate(16 134)"><circle cx="-8" cy="4" r="5" fill="#212121"/><circle cx="8" cy="4" r="5" fill="#212121"/><path d="M-8 4L-2 -4H6L8 4" stroke="#E53935" stroke-width="3" fill="none"/><path d="M4 -4l2 -6h4" stroke="#424242" stroke-width="1.6" fill="none"/></g>`
  ),
  itemMundo(
    "funkeiro",
    "funk_paredao",
    "bg",
    "Paredão de som",
    170,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#1B1B1B" opacity=".35"/>${[
        [0, 40],
        [30, 40],
        [0, 90],
        [30, 90],
        [90, 40],
        [90, 90]
      ]
        .map(
          ([x, y]) =>
            `<rect x="${x}" y="${y}" width="30" height="48" fill="#212121" opacity=".7"/><circle cx="${x + 15}" cy="${y + 20}" r="10" fill="#424242"/><circle class="pisca" cx="${x + 15}" cy="${y + 20}" r="4" fill="#00E676"/>`
        )
        .join("")}`
  )
);

/* =============== FORROZEIRO =============== */
maisFalas("forrozeiro", {
  desc: "Arretado, acolhedor e sempre animado. Sanfona, xote e cuscuz no café.",
  sad: [
    "Oxe, sumiu? O forró ficou sem par...",
    "A sanfona tocou triste hoje.",
    "Até o mandacaru sentiu sua falta."
  ],
  hi: [
    "Oxe{nome}, bom dia! Hoje tem <b>{n}</b> tarefas, bora arrochar!",
    "Cuscuz no prato{nome}! São <b>{n}</b> tarefas no arraiá de hoje.",
    "Eita{nome}! <b>{n}</b> tarefas e muito xote.",
    "Bom dia, meu rei{nome}! <b>{n}</b> tarefas pra dançar hoje."
  ],
  cheers: [
    "Arretado demais!",
    "Eita, que beleza! Uma a menos.",
    "Massa! Tá voando.",
    "Oxente, que rapidez!",
    "Isso é forró pé de serra!",
    "Arrochou bonito!",
    "A sanfona tá tocando de alegria."
  ],
  drink: [
    "<b>+{ml} mL</b> da água do açude. Fresquinha!",
    "Bebeu <b>{ml} mL</b>. O sertão agradece.",
    "<b>+{ml} mL</b> pra aguentar o xote.",
    "<b>+{ml} mL</b> de água de moringa."
  ],
  goal: [
    "Meta de água batida! Açude transbordando.",
    "Hidratado igual mandacaru depois da chuva.",
    "Água bebida, forró garantido."
  ],
  thirsty: [
    "Tá seco igual sertão em outubro. Faltam <b>{ml} mL</b>.",
    "Bebe <b>{ml} mL</b>, meu rei.",
    "A moringa tá esperando: <b>{ml} mL</b>."
  ],
  late: [
    "Oxe, <b>{n}</b> atrasadas! Bora resolver?",
    "<b>{n}</b> tarefas ficaram no arraiá passado.",
    "Ficou <b>{n}</b>. Uma de cada vez, com calma."
  ],
  night: [
    "O forró acabou. Fecha o dia e vai sonhar.",
    "Lua no sertão, rede armada. Boa noite.",
    "Fogueira apagando. Hora de dormir."
  ],
  done: [
    "Tudo feito! O arraiá foi bom demais.",
    "Lista vazia. Agora é xote até cansar.",
    "Dia arretado do começo ao fim."
  ],
  focus: [
    "Foco igual sanfoneiro afinando.",
    "Concentração de quem faz cuscuz: no ponto certo.",
    "Silêncio no terreiro. Foco."
  ]
});
maisTemas("forrozeiro", [
  temaMundo("arraia", "Arraiá", 130, ["#D84315", "#FF8A65"], ["#FDD835", "#FFEE58"], {
    part: "flag",
    wn: "Água com cravo",
    pat: ["flag", "star"]
  }),
  temaMundo("sertao", "Sertão ao meio-dia", 120, ["#A1662F", "#E0A35A"], ["#FFB300", "#FFCA28"], {
    wn: "Água de moringa",
    pat: ["leaf", "flag"]
  }),
  temaMundo("praia_ne", "Praia do Nordeste", 120, ["#00838F", "#4DD0E1"], ["#26C6DA", "#80DEEA"], {
    wn: "Água de coco"
  }),
  temaMundo("xilogravura", "Xilogravura", 140, ["#212121", "#BDBDBD"], ["#5D4037", "#A1887F"], {
    f: '"Rye"',
    wn: "Tinta de cordel"
  })
]);
maisItens(
  itemMundo("forrozeiro", "forro_chapeu_palha", "hat", "Chapéu de palha de São João", 80, () =>
    cowboyHat("#F2D58A", "#E53935")
  ),
  itemMundo(
    "forrozeiro",
    "forro_trancinha",
    "hair",
    "Trancinhas com fita",
    110,
    () =>
      hairMessy("#4E342E") +
      `<path d="M28 50Q22 70 26 90M92 50Q98 70 94 90" stroke="#4E342E" stroke-width="5" fill="none"/><circle cx="26" cy="92" r="3.4" fill="#E53935"/><circle cx="94" cy="92" r="3.4" fill="#1E88E5"/>`
  ),
  itemMundo(
    "forrozeiro",
    "forro_pintinha",
    "cheek",
    "Pintinhas de caipira",
    40,
    () =>
      `<circle cx="40" cy="74" r="1.6" fill="#5D4037"/><circle cx="80" cy="74" r="1.6" fill="#5D4037"/><circle cx="44" cy="72" r="1" fill="#5D4037"/>`
  ),
  itemMundo(
    "forrozeiro",
    "forro_vestido",
    "top",
    "Vestido de chita",
    150,
    () =>
      topBase("#E53935") +
      flowersOn(
        [
          [14, 98],
          [36, 116],
          [60, 104],
          [84, 120],
          [104, 100],
          [24, 138],
          [70, 140],
          [100, 142]
        ],
        4.6
      ) +
      topHem
  ),
  itemMundo("forrozeiro", "forro_camisa_xadrez", "top", "Camisa xadrez de quadrilha", 120, () =>
    plaid("#1E88E5", "#0D47A1")
  ),
  itemMundo("forrozeiro", "forro_triangulo_2", "hand", "Triângulo", 90, (x, y) =>
    H(
      x,
      y,
      `<path d="M0 -16L12 8H-12Z" fill="none" stroke="#B0BEC5" stroke-width="2.4" stroke-linejoin="round"/><path d="M10 -8L18 -4" stroke="#757575" stroke-width="2" stroke-linecap="round"/>`
    )
  ),
  itemMundo("forrozeiro", "forro_milho", "hand", "Espiga de milho", 60, (x, y) =>
    H(
      x,
      y,
      `<ellipse rx="6" ry="13" fill="#FDD835" stroke="var(--ink)" stroke-width="1.4"/><path d="M-6 6Q-12 -6 -4 -14M6 6Q12 -6 4 -14" fill="#7CB342" stroke="var(--ink)" stroke-width="1"/>`
    )
  ),
  itemMundo(
    "forrozeiro",
    "forro_bode_2",
    "pet",
    "Bodinho",
    140,
    () =>
      `<g transform="translate(16 128)"><path d="M-12 8Q-12 -4 0 -4Q10 -4 10 8Z" fill="#EFEBE9" stroke="var(--ink)" stroke-width="1"/><circle cx="8" cy="-8" r="5.4" fill="#EFEBE9" stroke="var(--ink)" stroke-width="1"/><path d="M6 -13q-2 -5 -6 -6M10 -13q2 -5 6 -5" stroke="#8D6E63" stroke-width="1.6" fill="none"/><path d="M9 -3q0 4 -2 6" stroke="#BCAAA4" stroke-width="1.6"/><circle cx="9" cy="-9" r=".9" fill="#212121"/><path d="M-10 8v6M-4 8v6M2 8v6M6 8v6" stroke="#8D6E63" stroke-width="1.6"/></g>`
  ),
  itemMundo(
    "forrozeiro",
    "forro_fogueira_2",
    "bg",
    "Fogueira de São João",
    160,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#1A237E" opacity=".3"/><path d="M0 10Q30 22 60 10T120 10" stroke="#5D4037" fill="none"/>${[8, 28, 48, 68, 88, 108].map((x, i) => `<path d="M${x} ${12 + (i % 2) * 2}l6 0-3 6z" fill="${["#E53935", "#FDD835", "#1E88E5", "#43A047"][i % 4]}"/>`).join("")}<path class="chama" d="M96 140q-8 -18 4 -30q-2 10 6 14q4 -8 0 -16q14 12 4 32z" fill="#FF7043" opacity=".8"/>`
  )
);

/* =============== GAMER =============== */
maisFalas("gamer", {
  desc: "Competitivo, conquista cada XP. Speedrun nas tarefas e boss fight nas provas.",
  sad: [
    "Player 2 desconectou... volta pro lobby?",
    "Fiquei AFK esperando você.",
    "Sem você, o save tá parado."
  ],
  hi: [
    "GG{nome}! Missões do dia: <b>{n}</b>. Bora farmar XP.",
    "Player 1 entrou{nome}! <b>{n}</b> quests no mapa.",
    "Novo dia, nova run{nome}. São <b>{n}</b> missões.",
    "Carregando... 100%{nome}! <b>{n}</b> tarefas desbloqueadas."
  ],
  cheers: [
    "+XP! Missão concluída.",
    "Combo! Mais uma.",
    "Quest completa. Próxima!",
    "Headshot na tarefa!",
    "Achievement desbloqueado!",
    "Speedrun respeitável.",
    "GG EZ!"
  ],
  drink: [
    "<b>+{ml} mL</b> de poção de mana!",
    "HP recuperado: <b>+{ml} mL</b>.",
    "<b>+{ml} mL</b>. Buff de hidratação ativo.",
    "Bebeu <b>{ml} mL</b>. Cooldown zerado."
  ],
  goal: [
    "Meta de água batida! Barra de mana cheia.",
    "Hidratação max level.",
    "Água 100%. Pode enfrentar o boss."
  ],
  thirsty: [
    "HP baixo! Faltam <b>{ml} mL</b>.",
    "Debuff de sede ativo. Bebe <b>{ml} mL</b>.",
    "Sem mana pra skill. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> quests atrasadas no log. Bora completar?",
    "<b>{n}</b> missões falharam no tempo. Retry?",
    "Ficou <b>{n}</b> no mapa. Respawn e vai!"
  ],
  night: [
    "Hora de salvar o jogo. Fecha o dia e descansa.",
    "Logout do dia. Até amanhã, player.",
    "Servidor em manutenção: hora de dormir."
  ],
  done: ["Todas as quests completas! Fim da fase.", "100% do mapa explorado. GG!", "Run perfeita, sem dano."],
  focus: ["Modo ranqueada: foco total.", "Sem pausa, sem lag. Foco.", "Concentração de final de campeonato."]
});
maisTemas("gamer", [
  temaMundo("retro", "Fliperama retrô", 130, ["#E53935", "#FF8A80"], ["#FFD54F", "#FFE082"], {
    part: "pixel",
    wn: "Ficha de fliperama",
    pat: ["pixel", "star"]
  }),
  temaMundo("cyber", "Cyber verde", 140, ["#00C853", "#69F0AE"], ["#00E5FF", "#84FFFF"], {
    part: "bit",
    wn: "Energético de pixel (é água)",
    pat: ["bit", "pixel"]
  }),
  temaMundo("gameboy", "Portátil verdinho", 150, ["#306230", "#8BAC0F"], ["#8BAC0F", "#9BBC0F"], {
    L: ["#C4CFA1", "#E0E8C0", "#0F380F", "#306230", "#8BAC0F", "#E0E8C0", "#0F380F"],
    D: ["#0F380F", "#1E4A1E", "#C4CFA1", "#8BAC0F", "#9BBC0F", "#306230", "#1E4A1E"],
    wn: "Água 8 bits"
  }),
  temaMundo("fantasia", "RPG de fantasia", 140, ["#6D4C41", "#BCAAA4"], ["#7E57C2", "#B39DDB"], {
    part: "gem",
    wn: "Poção de cura",
    pat: ["gem", "star"]
  })
]);
maisItens(
  itemMundo(
    "gamer",
    "game_bone_rgb",
    "hat",
    "Boné com LED",
    110,
    () =>
      cap("#212121") +
      `<path class="neon" d="M32 40Q60 30 88 40" stroke="#00E5FF" stroke-width="2.4" fill="none"/>`
  ),
  itemMundo(
    "gamer",
    "game_cogumelo",
    "hat",
    "Chapéu de cogumelo pixel",
    120,
    () =>
      `<path d="M24 44Q24 12 60 12Q96 12 96 44Z" fill="#E53935" ${O}/><circle cx="44" cy="26" r="6" fill="#fff"/><circle cx="74" cy="22" r="7" fill="#fff"/><circle cx="62" cy="38" r="4" fill="#fff"/>`
  ),
  itemMundo(
    "gamer",
    "game_visor",
    "face",
    "Visor de realidade virtual",
    150,
    () =>
      `<rect x="30" y="54" width="60" height="20" rx="8" fill="#37474F" ${O}/><rect x="36" y="58" width="48" height="12" rx="5" fill="#00E5FF" opacity=".75"/><path d="M30 64H18M90 64h12" stroke="#212121" stroke-width="3"/>`
  ),
  itemMundo(
    "gamer",
    "game_pixel_bochecha",
    "cheek",
    "Bochecha de pixel",
    40,
    () =>
      `<rect x="34" y="70" width="4" height="4" fill="#FF4081"/><rect x="38" y="72" width="4" height="4" fill="#FF4081"/><rect x="78" y="72" width="4" height="4" fill="#FF4081"/><rect x="82" y="70" width="4" height="4" fill="#FF4081"/>`
  ),
  itemMundo(
    "gamer",
    "game_camisa_time",
    "top",
    "Camisa de time de e-sports",
    150,
    () =>
      topBase("#311B92") +
      `<path d="M0 100L60 120L120 100V112L60 132L0 112Z" fill="#00E5FF"/><text x="60" y="146" font-size="10" text-anchor="middle" fill="#fff" font-weight="900" font-family="monospace">PRO</text>` +
      topHem
  ),
  itemMundo("gamer", "game_espada", "hand", "Espada de pixel", 130, (x, y) =>
    H(
      x,
      y,
      `<path d="M0 6L22 -22L26 -20L4 8Z" fill="#B0BEC5" stroke="var(--ink)" stroke-width="1.2"/><path d="M-4 0l10 10" stroke="#795548" stroke-width="4"/><path d="M-6 10l4 -4" stroke="#FFD54F" stroke-width="4"/>`
    )
  ),
  itemMundo("gamer", "game_coracao", "pins", "Vidas extras", 60, () =>
    [32, 42]
      .map(x => `<path d="M${x} 112l-4 -4a2.4 2.4 0 0 1 4 -3 2.4 2.4 0 0 1 4 3z" fill="#E53935"/>`)
      .join("")
  ),
  itemMundo(
    "gamer",
    "game_slime",
    "pet",
    "Slime de estimação",
    120,
    () =>
      `<g transform="translate(16 134)"><path d="M-12 6Q-12 -10 0 -10Q12 -10 12 6Z" fill="#64DD17" fill-opacity=".85" stroke="var(--ink)" stroke-width="1.1"/><circle cx="-4" cy="-2" r="1.6" fill="#212121"/><circle cx="4" cy="-2" r="1.6" fill="#212121"/><path d="M-6 -7q2 -2 4 -1" stroke="#fff" stroke-width="1.4" fill="none"/></g>`
  ),
  itemMundo(
    "gamer",
    "game_mapa",
    "bg",
    "Mapa de fase",
    160,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#7CB342" opacity=".35"/><path d="M10 130Q30 100 60 110T110 70" stroke="#FFF8E1" stroke-width="4" stroke-dasharray="6 5" fill="none"/>${[
        [10, 130],
        [60, 110],
        [110, 70]
      ]
        .map(
          ([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#FFD54F" stroke="#212121" stroke-width="1.4"/>`
        )
        .join("")}<rect x="96" y="20" width="16" height="22" fill="#8D6E63" opacity=".7"/>`
  )
);

/* =============== PROGRAMADOR =============== */
maisFalas("programador", {
  desc: "Lógico, cafeinado e cheio de piadas de TI. Resolve bug de dia e pensa em refatorar de noite.",
  sad: [
    "404: usuário não encontrado...",
    "Ficou um tempão sem commit. Saudade, dev.",
    "O café esfriou esperando você."
  ],
  hi: [
    "Hello, world{nome}! Backlog de hoje: <b>{n}</b> tarefas.",
    "Bom dia{nome}! <b>{n}</b> issues abertas na sprint.",
    "git pull{nome}: chegaram <b>{n}</b> tarefas novas.",
    "Café compilado{nome}. Rodando <b>{n}</b> tarefas em produção."
  ],
  cheers: [
    "Task merged!",
    "Build passou! Uma a menos.",
    'git commit -m "feito"',
    "Testes verdes!",
    "Bug resolvido. Ninguém sabe como.",
    "Deploy sem quebrar nada!",
    "Refatorou a vida. Lindo."
  ],
  drink: [
    "<b>+{ml} mL</b> de água.exe executado.",
    "Hidratação: <b>{ml} mL</b> retornou 200 OK.",
    "<b>+{ml} mL</b>. Nem só de café vive o dev.",
    "while(sede) beber(<b>{ml}</b>);"
  ],
  goal: [
    "Meta de água batida. 100% de cobertura.",
    "Hidratação em produção, sem bugs.",
    "Garrafa vazia: tarefa concluída com sucesso."
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>. Erro: corpo sem água.",
    "Warning: sede detectada. Bebe <b>{ml} mL</b>.",
    "Exception não tratada: faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> tarefas em débito técnico. Bora pagar?",
    "<b>{n}</b> issues antigas no backlog.",
    "Ficou <b>{n}</b>. Um commit de cada vez."
  ],
  night: [
    "Fim do expediente. Fecha o dia e desliga o monitor.",
    "Modo escuro ativado: hora de dormir.",
    "shutdown -h now (você, não o PC)."
  ],
  done: [
    "Sprint concluída! Backlog zerado.",
    "Tudo em produção. Merecido.",
    "Lista vazia. Isso não é bug, é feature."
  ],
  focus: ["Modo foco: notificações desativadas.", "Flow state iniciado.", "Debugando em silêncio."]
});
maisTemas("programador", [
  temaMundo("vscode", "Editor escuro", 130, ["#0078D4", "#4FC3F7"], ["#569CD6", "#9CDCFE"], {
    D: ["#1E1E1E", "#252526", "#D4D4D4", "#4FC3F7", "#569CD6", "#2D2D30", "#252526"],
    wn: "Água tipada"
  }),
  temaMundo("hacker", "Hacker de filme", 140, ["#00C853", "#00FF41"], ["#00E676", "#69F0AE"], {
    D: ["#000000", "#050F05", "#00FF41", "#00FF41", "#00C853", "#0A1A0A", "#050F05"],
    part: "bit",
    wn: "Água em binário"
  }),
  temaMundo("cafe", "Café expresso", 110, ["#6D4C41", "#BCAAA4"], ["#8D6E63", "#A1887F"], {
    wn: "Café (é água, mentira, é café)"
  }),
  temaMundo("solar", "Paleta solarizada", 120, ["#B58900", "#E0B33A"], ["#268BD2", "#5EB0E8"], {
    L: ["#FDF6E3", "#FFFDF5", "#073642", "#B58900", "#268BD2", "#FFFDF5", "#073642"],
    D: ["#002B36", "#073642", "#EEE8D5", "#E0B33A", "#5EB0E8", "#0B3D49", "#073642"],
    wn: "Água com timestamp"
  })
]);
maisItens(
  itemMundo(
    "programador",
    "dev_fone",
    "hat",
    "Fone com microfone",
    120,
    () =>
      `<path d="M24 52Q24 16 60 16Q96 16 96 52" stroke="#37474F" stroke-width="5" fill="none"/><rect x="16" y="46" width="12" height="18" rx="5" fill="#263238" ${O} stroke-width="1.6"/><rect x="92" y="46" width="12" height="18" rx="5" fill="#263238" ${O} stroke-width="1.6"/><path d="M22 64Q24 76 40 78" stroke="#37474F" stroke-width="2" fill="none"/><circle cx="41" cy="78" r="2" fill="#263238"/>`
  ),
  itemMundo(
    "programador",
    "dev_capuz",
    "hat",
    "Capuz de hacker",
    130,
    () => `<path d="M18 62Q14 14 60 12Q106 14 102 62Q96 40 60 36Q24 40 18 62Z" fill="#212121" ${O}/>`
  ),
  itemMundo(
    "programador",
    "dev_oculos_tela",
    "face",
    "Óculos com reflexo de código",
    120,
    () =>
      lensPair("#0D1117", "#212121", 4, 57, 14, 0.85) +
      `<path d="M38 61h8M38 64h12M64 61h10M64 64h6" stroke="#40C463" stroke-width="1.2"/>`
  ),
  itemMundo(
    "programador",
    "dev_cracha_2",
    "neck",
    "Crachá da empresa",
    70,
    () =>
      `<path d="M40 84L60 104L80 84" stroke="#1565C0" stroke-width="2" fill="none"/><rect x="52" y="104" width="16" height="20" rx="2" fill="#FAFAFA" ${O} stroke-width="1.2"/><rect x="55" y="107" width="10" height="7" fill="#90CAF9"/><path d="M55 118h10M55 121h7" stroke="#90A4AE" stroke-width="1"/>`
  ),
  itemMundo("programador", "dev_camiseta_bug", "top", "Camiseta 'it works on my machine'", 120, () =>
    tee(
      "#263238",
      `<text x="60" y="118" font-size="7" text-anchor="middle" fill="#40C463" font-family="monospace">it works on</text><text x="60" y="128" font-size="7" text-anchor="middle" fill="#40C463" font-family="monospace">my machine</text>`
    )
  ),
  itemMundo("programador", "dev_teclado_2", "hand", "Teclado mecânico", 140, (x, y) =>
    H(
      x,
      y,
      `<rect x="-16" y="-6" width="32" height="12" rx="2" fill="#37474F" stroke="var(--ink)" stroke-width="1.4"/>${[-12, -6, 0, 6, 12].map(k => `<rect x="${k - 2}" y="-4" width="4" height="3" fill="${k === 0 ? "#FF4081" : "#ECEFF1"}"/><rect x="${k - 2}" y="1" width="4" height="3" fill="#ECEFF1"/>`).join("")}`
    )
  ),
  itemMundo(
    "programador",
    "dev_patinho_2",
    "pet",
    "Patinho de borracha (debug)",
    100,
    () =>
      `<g transform="translate(16 132)"><ellipse rx="10" ry="7" fill="#FFEB3B" stroke="var(--ink)" stroke-width="1.1"/><circle cx="5" cy="-8" r="5.4" fill="#FFEB3B" stroke="var(--ink)" stroke-width="1"/><path d="M10 -8l4 1-4 2z" fill="#FF9800"/><circle cx="6" cy="-9" r="1" fill="#212121"/></g>`
  ),
  itemMundo(
    "programador",
    "dev_wrist",
    "wrist",
    "Pulseira de silicone 'debug'",
    40,
    () =>
      `<rect x="10" y="118" width="18" height="6" rx="3" fill="#40C463" ${O} stroke-width="1.2"/><text x="19" y="123" font-size="4" text-anchor="middle" fill="#0D1117" font-family="monospace">debug</text>`
  ),
  itemMundo(
    "programador",
    "dev_setup_2",
    "bg",
    "Setup com dois monitores",
    170,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#263238" opacity=".4"/><rect x="2" y="20" width="44" height="30" rx="2" fill="#0D1117" opacity=".8"/><rect x="74" y="20" width="44" height="30" rx="2" fill="#0D1117" opacity=".8"/>${[26, 31, 36, 41].map((y, i) => `<path d="M6 ${y}h${10 + i * 6}M78 ${y}h${30 - i * 5}" stroke="${i % 2 ? "#569CD6" : "#40C463"}" stroke-width="2"/>`).join("")}`
  )
);

/* =============== ZEN =============== */
maisFalas("zen", {
  desc: "Calmo, gentil e equilibrado. Chá quente, respiração lenta e um passo de cada vez.",
  sad: [
    "Senti sua falta, mas está tudo bem. Volte quando puder.",
    "O jardim ficou quieto sem você.",
    "Respirei por nós dois enquanto você não vinha."
  ],
  hi: [
    "Respira{nome}. Hoje são <b>{n}</b> tarefas, uma de cada vez.",
    "Bom dia{nome}. O chá está pronto e há <b>{n}</b> tarefas pra cuidar com calma.",
    "Que seu dia seja leve{nome}. <b>{n}</b> tarefas, sem pressa.",
    "O sol nasceu devagar{nome}. Vamos com ele: <b>{n}</b> tarefas."
  ],
  cheers: [
    "Muito bem. Sinta essa pequena vitória.",
    "Um passo de cada vez. Lindo.",
    "Feito com presença.",
    "Que leveza.",
    "Respira e agradece. Concluída.",
    "Como a água, você seguiu o caminho.",
    "Gentil com você mesmo. Muito bem."
  ],
  drink: [
    "<b>+{ml} mL</b>. Sinta a água descendo devagar.",
    "<b>+{ml} mL</b> de calma em forma líquida.",
    "Gole consciente: <b>{ml} mL</b>.",
    "<b>+{ml} mL</b>. Seu corpo agradece em silêncio."
  ],
  goal: [
    "Meta de água alcançada. Equilíbrio.",
    "Corpo hidratado, mente tranquila.",
    "Como o rio que chega ao mar. Meta batida."
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>. Ouça seu corpo.",
    "Uma pausa pra água: <b>{ml} mL</b>.",
    "Gentileza começa com um copo d'água. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> tarefas esperando. Sem culpa, só recomeço.",
    "<b>{n}</b> pendências. Respira e escolha a primeira.",
    "Ficou <b>{n}</b>. Tudo bem, o agora é o que importa."
  ],
  night: [
    "A noite pede descanso. Fecha o dia com gratidão.",
    "Apaga as luzes devagar. Boa noite.",
    "Três coisas boas de hoje, e depois dormir."
  ],
  done: ["Tudo feito. Que paz.", "Lista vazia, coração leve.", "Dia completo. Agradeça a você mesmo."],
  focus: ["Uma coisa de cada vez.", "Respira fundo e foca no agora.", "Silêncio, presença e foco."]
});
maisTemas("zen", [
  temaMundo("cerejeira", "Cerejeira", 130, ["#C2185B", "#F48FB1"], ["#F8BBD0", "#F8BBD0"], {
    part: "petal",
    wn: "Chá de flor",
    pat: ["petal", "leaf"]
  }),
  temaMundo("oceano", "Oceano calmo", 120, ["#00695C", "#80CBC4"], ["#4DB6AC", "#80CBC4"], {
    part: "ripple",
    wn: "Água do mar calmo",
    pat: ["ripple", "ripple"]
  }),
  temaMundo("pedra", "Jardim de pedras", 110, ["#616161", "#BDBDBD"], ["#90A4AE", "#B0BEC5"], {
    wn: "Água da fonte",
    pat: ["ripple", "leaf"]
  }),
  temaMundo("vela", "Luz de vela", 130, ["#E65100", "#FFB74D"], ["#FFCC80", "#FFE0B2"], {
    part: "spark",
    wn: "Chá de camomila quente"
  })
]);
maisItens(
  itemMundo(
    "zen",
    "zen_chapeu_bambu_2",
    "hat",
    "Chapéu de bambu",
    110,
    () =>
      `<path d="M10 46L60 18L110 46Q60 54 10 46Z" fill="#D7B377" ${O}/><path d="M20 44L60 22M40 47L60 22M80 47L60 22M100 44L60 22" stroke="#B08A4A" stroke-width="1"/>`
  ),
  itemMundo(
    "zen",
    "zen_flor_cabelo",
    "hair",
    "Flor de lótus no cabelo",
    90,
    () =>
      `<g transform="translate(86 34)"><path d="M0 4q-8 -4 -8 -12q8 2 8 12zM0 4q8 -4 8 -12q-8 2 -8 12zM0 4q-3 -8 0 -16q3 8 0 16z" fill="#F8BBD0" stroke="#AD1457" stroke-width="1"/></g>`
  ),
  itemMundo(
    "zen",
    "zen_olhos_fechados",
    "face",
    "Olhos em meditação",
    50,
    () =>
      `<path d="M40 64Q47 69 54 64M66 64Q73 69 80 64" stroke="var(--ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
  ),
  itemMundo(
    "zen",
    "zen_ponto",
    "cheek",
    "Ponto de luz na testa",
    60,
    () =>
      `<circle class="brilhinho" cx="60" cy="48" r="3" fill="#FFB74D"/><circle cx="60" cy="48" r="6" fill="#FFB74D" opacity=".25"/>`
  ),
  itemMundo(
    "zen",
    "zen_mala",
    "neck",
    "Japamala de sementes",
    90,
    () => beads("#8D6E63", 2.4, 15) + `<path d="M60 104v10" stroke="#C62828" stroke-width="3"/>`
  ),
  itemMundo(
    "zen",
    "zen_kimono",
    "top",
    "Roupa de linho",
    130,
    () =>
      topBase("#E8E0D0") +
      `<path d="M42 84L60 116L78 84" stroke="#B5A88F" stroke-width="3" fill="none"/><path d="M0 120H120" stroke="#8D9B7A" stroke-width="5"/>` +
      topHem
  ),
  itemMundo("zen", "zen_cha", "hand", "Xícara de chá", 70, (x, y) =>
    H(
      x,
      y,
      `<path d="M-8 -6H8Q8 8 0 8Q-8 8 -8 -6Z" fill="#FAFAFA" stroke="var(--ink)" stroke-width="1.4"/><path d="M8 -2q5 0 4 4q-1 3 -5 2" stroke="var(--ink)" stroke-width="1.2" fill="none"/><ellipse cy="-6" rx="8" ry="1.6" fill="#AED581"/><g class="vapor"><path d="M-2 -10q-2 -4 1 -8" stroke="#BDBDBD" stroke-width="1.2" fill="none"/></g>`
    )
  ),
  itemMundo(
    "zen",
    "zen_tartaruga_2",
    "pet",
    "Tartaruga sábia",
    130,
    () =>
      `<g transform="translate(16 134)"><ellipse rx="11" ry="7" fill="#7CB342" stroke="var(--ink)" stroke-width="1.1"/><path d="M-6 -4l4 4 4 -4 4 4" stroke="#558B2F" stroke-width="1" fill="none"/><circle cx="12" cy="0" r="3.4" fill="#AED581" stroke="var(--ink)" stroke-width="1"/><circle cx="13" cy="-1" r=".8" fill="#212121"/><path d="M-8 6v3M8 6v3" stroke="#AED581" stroke-width="2.4"/></g>`
  ),
  itemMundo(
    "zen",
    "zen_jardim",
    "bg",
    "Jardim zen de areia",
    160,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#E8E0D0" opacity=".55"/>${[100, 110, 120, 130, 140].map(y => `<path d="M0 ${y}Q30 ${y - 4} 60 ${y}T120 ${y}" stroke="#C9BFA9" stroke-width="1.4" fill="none"/>`).join("")}<ellipse cx="96" cy="118" rx="12" ry="7" fill="#9E9E9E" opacity=".7"/><ellipse cx="22" cy="132" rx="8" ry="5" fill="#9E9E9E" opacity=".7"/>`
  )
);

/* =============== COACH =============== */
maisFalas("coach", {
  desc: "Motivação no máximo, energia sem fim. Apito no pescoço e meta no papel.",
  sad: [
    "SUMIU?! Campeão não abandona o treino!",
    "Fiquei no vestiário esperando você.",
    "Sem você a meta ficou parada. Volta!"
  ],
  hi: [
    "VAMO{nome}! Hoje são <b>{n}</b> tarefas, e você dá conta de TODAS!",
    "Bom dia, campeão{nome}! <b>{n}</b> tarefas no treino de hoje.",
    "Acorda que o pódio te espera{nome}! <b>{n}</b> tarefas!",
    "Disciplina{nome}! São <b>{n}</b> tarefas. Um, dois, VAI!"
  ],
  cheers: [
    "ISSO! Você é imparável!",
    "Mais uma! Disciplina vence motivação!",
    "É sobre isso! Segue!",
    "MEDALHA DE OURO!",
    "Ninguém segura você hoje!",
    "Mais uma repetição! FORÇA!",
    "Campeão faz, não promete!"
  ],
  drink: [
    "<b>+{ml} mL</b>! Hidratação de atleta!",
    "<b>+{ml} mL</b>. Músculo agradece!",
    "BEBEU <b>{ml} mL</b>! Isso é foco!",
    "<b>+{ml} mL</b>. Água é combustível de campeão!"
  ],
  goal: [
    "META BATIDA! Hidratação de pódio!",
    "Garrafa zerada! Você é outro nível!",
    "Água no máximo, desempenho no máximo!"
  ],
  thirsty: [
    "Faltam <b>{ml} mL</b>! Sem desculpa!",
    "BEBE <b>{ml} mL</b> agora! Vai!",
    "Atleta desidratado não ganha. Faltam <b>{ml} mL</b>!"
  ],
  late: [
    "<b>{n}</b> atrasadas? Sem desculpa, só ação! Bora!",
    "<b>{n}</b> pendentes. Reação de campeão: AGORA!",
    "Ficou <b>{n}</b> pra trás. Recupera no sprint final!"
  ],
  night: [
    "Treino encerrado! Descanso também é treino.",
    "Fecha o dia, campeão. Recuperação é tudo.",
    "8 horas de sono: a meta mais importante."
  ],
  done: [
    "TUDO FEITO! Você é uma máquina!",
    "Lista zerada! Isso é mentalidade de campeão!",
    "Dia perfeito! Pódio garantido!"
  ],
  focus: ["Foco total! Nada te para!", "Modo competição ativado!", "Respira, foca e EXECUTA!"]
});
maisTemas("coach", [
  temaMundo("academia", "Academia às 5h", 130, ["#212121", "#FF5252"], ["#FF5252", "#FF8A80"], {
    wn: "Isotônico (é água)",
    pat: ["plus", "bolt"]
  }),
  temaMundo("maratona", "Maratona", 120, ["#0277BD", "#4FC3F7"], ["#29B6F6", "#81D4FA"], {
    wn: "Água do posto de hidratação"
  }),
  temaMundo("crossfit", "Box de crossfit", 140, ["#F57F17", "#FFD54F"], ["#FFCA28", "#FFE082"], {
    part: "bolt",
    wn: "Água com eletrólitos",
    pat: ["bolt", "plus"]
  }),
  temaMundo("yoga", "Yoga ao ar livre", 110, ["#7B1FA2", "#CE93D8"], ["#BA68C8", "#E1BEE7"], {
    wn: "Água com limão"
  })
]);
maisItens(
  itemMundo(
    "coach",
    "coach_bone_2",
    "hat",
    "Boné de treinador",
    80,
    () =>
      cap("#D81E15") +
      `<text x="60" y="36" font-size="10" text-anchor="middle" fill="#fff" font-weight="900" font-family="Oswald,Impact,sans-serif">GO</text>`
  ),
  itemMundo(
    "coach",
    "coach_viseira_2",
    "hat",
    "Viseira de corrida",
    70,
    () =>
      `<path d="M26 44Q60 34 94 44" stroke="#212121" stroke-width="5" fill="none"/><path d="M60 44H104Q108 50 96 52H60Z" fill="#2FA8E8" ${O}/>`
  ),
  itemMundo(
    "coach",
    "coach_oculos",
    "face",
    "Óculos esportivo",
    110,
    () =>
      `<path d="M30 60Q60 52 90 60L88 70Q74 74 62 66H58Q46 74 32 70Z" fill="#FF6D00" fill-opacity=".8" ${O}/>`
  ),
  itemMundo(
    "coach",
    "coach_medalha_2",
    "neck",
    "Medalha de ouro",
    130,
    () =>
      `<path d="M42 84L58 108M78 84L62 108" stroke="#1E88E5" stroke-width="5"/><circle cx="60" cy="112" r="8" fill="#FFC107" ${O} stroke-width="1.4"/><text x="60" y="115.5" font-size="9" text-anchor="middle" fill="#B26A00" font-weight="900">1</text>`
  ),
  itemMundo(
    "coach",
    "coach_agasalho_2",
    "top",
    "Agasalho de treino",
    140,
    () =>
      topBase("#1565C0") +
      `<path d="M0 96H120M0 104H120" stroke="#fff" stroke-width="3"/><path d="M60 86V150" stroke="#0D47A1" stroke-width="2.4"/>` +
      topHem
  ),
  itemMundo("coach", "coach_haltere", "hand", "Haltere", 100, (x, y) =>
    H(
      x,
      y,
      `<path d="M-12 0H12" stroke="#757575" stroke-width="3"/><rect x="-16" y="-6" width="5" height="12" rx="1" fill="#212121"/><rect x="11" y="-6" width="5" height="12" rx="1" fill="#212121"/>`
    )
  ),
  itemMundo("coach", "coach_garrafa", "hand", "Garrafa de 2 litros", 80, (x, y) =>
    H(
      x,
      y,
      `<rect x="-6" y="-16" width="12" height="28" rx="4" fill="#4FC3F7" fill-opacity=".6" stroke="var(--ink)" stroke-width="1.4"/><rect x="-3" y="-20" width="6" height="4" fill="#212121"/><path d="M-6 -6h12M-6 2h12" stroke="#fff" stroke-width="1"/>`
    )
  ),
  itemMundo(
    "coach",
    "coach_cronometro_2",
    "pet",
    "Cronômetro falante",
    110,
    () =>
      `<g transform="translate(16 132)"><circle r="9" fill="#FAFAFA" stroke="var(--ink)" stroke-width="1.2"/><rect x="-2" y="-13" width="4" height="4" fill="#212121"/><path d="M0 0V-6M0 0l4 2" stroke="#D81E15" stroke-width="1.6"/><circle cx="-3.4" cy="3" r=".9" fill="#212121"/><circle cx="3.4" cy="3" r=".9" fill="#212121"/></g>`
  ),
  itemMundo(
    "coach",
    "coach_podio_2",
    "bg",
    "Pódio",
    170,
    () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#FFC107" opacity=".22"/><rect x="40" y="100" width="40" height="48" fill="#FFC107" opacity=".7"/><rect x="0" y="116" width="40" height="32" fill="#B0BEC5" opacity=".7"/><rect x="80" y="124" width="40" height="24" fill="#BF8A5A" opacity=".7"/><text x="60" y="130" font-size="20" text-anchor="middle" fill="#fff" font-weight="900">1</text>`
  )
);

/* =============== VOVÓ =============== */
if (PERSONAS.vovo) {
  maisFalas("vovo", {
    sad: [
      "Fiz bolo e você não veio, meu bem...",
      "Sentei na cadeira de balanço esperando você.",
      "A casa ficou quieta sem você, querido."
    ],
    cheers: [
      "Muito bem, meu amor! Toma um biscoito.",
      "Que orgulho da vovó!",
      "Feito! Vem cá ganhar um cheiro.",
      "Isso, querido! Devagar se vai longe.",
      "Ai, que capricho!",
      "Vovó vai contar pra família toda!",
      "Mais uma! Tá merecendo um docinho."
    ],
    drink: [
      "<b>+{ml} mL</b>. Bebe água, meu filho!",
      "Isso, <b>+{ml} mL</b>. Vovó fica tranquila.",
      "<b>+{ml} mL</b> de água fresquinha do filtro de barro.",
      "Bebeu <b>{ml} mL</b>. Agora come uma fruta."
    ],
    goal: [
      "Meta de água batida! Vovó tá orgulhosa.",
      "Hidratadinho que só vendo.",
      "Bebeu tudo! Merece um pedaço de bolo."
    ],
    thirsty: [
      "Faltam <b>{ml} mL</b>, meu bem. Bebe água!",
      "Tá com a boca seca? Faltam <b>{ml} mL</b>.",
      "Vovó não sossega: faltam <b>{ml} mL</b>."
    ],
    focus: [
      "Faz com calma, que pressa é inimiga da perfeição.",
      "Concentra, querido. Vovó faz silêncio.",
      "Um ponto de crochê de cada vez."
    ]
  });
  maisTemas("vovo", [
    temaMundo("bolo", "Bolo de fubá", 110, ["#C77700", "#FFCA28"], ["#FFE082", "#FFECB3"], {
      wn: "Café com leite (é água)"
    }),
    temaMundo("jardim", "Jardim de rosas", 120, ["#AD1457", "#F48FB1"], ["#F8BBD0", "#F8BBD0"], {
      part: "petal",
      wn: "Água de rosas"
    }),
    temaMundo("toalha", "Toalha xadrez", 110, ["#C62828", "#EF9A9A"], null, {
      wn: "Suco de laranja da feira"
    }),
    temaMundo("novela", "Hora da novela", 130, ["#4527A0", "#B39DDB"], ["#7E57C2", "#B39DDB"], {
      wn: "Chá de erva-doce"
    })
  ]);
}

/* vovó: roupinhas novas */
if (PERSONAS.vovo)
  maisItens(
    itemMundo(
      "vovo",
      "vovo_touca_croche",
      "hat",
      "Touca de crochê",
      90,
      () =>
        beanie("#F8BBD0", "#E57399") +
        flowersOn(
          [
            [44, 30],
            [72, 26]
          ],
          4
        )
    ),
    itemMundo(
      "vovo",
      "vovo_coque_branco",
      "hair",
      "Coque branquinho",
      100,
      () =>
        `<path d="M24 54Q22 26 60 24Q98 26 96 54Q86 40 60 38Q34 40 24 54Z" fill="#F5F5F5" ${O}/><circle cx="60" cy="18" r="11" fill="#F5F5F5" ${O}/><path d="M54 12l12 10" stroke="#C9A646" stroke-width="2"/>`
    ),
    itemMundo(
      "vovo",
      "vovo_oculos_corrente",
      "face",
      "Óculos com cordinha",
      90,
      () =>
        lensPair("#E3F2FD", "#8D6E63", 7, 58, 12, 0.3) +
        `<path d="M35 64Q24 84 30 100M85 64Q96 84 90 100" stroke="#C9A646" stroke-width="1" fill="none"/>`
    ),
    itemMundo(
      "vovo",
      "vovo_xale",
      "top",
      "Xale de crochê",
      140,
      () =>
        topBase("#B39DDB") +
        `<path d="M0 84L60 140L120 84" fill="#F8BBD0" ${O}/>${[20, 40, 60, 80, 100].map(x => `<circle cx="${x}" cy="${100 + Math.abs(60 - x) * -0.4 + 20}" r="3" fill="#fff" opacity=".7"/>`).join("")}` +
        topHem
    ),
    itemMundo("vovo", "vovo_agulhas_novelo", "hand", "Agulhas de tricô com novelo", 90, (x, y) =>
      H(
        x,
        y,
        `<circle cy="4" r="8" fill="#E57399" stroke="var(--ink)" stroke-width="1.4"/><path d="M-6 0q6 4 12 0M-6 6q6 -3 12 1" stroke="#AD1457" stroke-width="1" fill="none"/><path d="M-4 -2L10 -24M2 -2L-8 -24" stroke="#BCAAA4" stroke-width="2" stroke-linecap="round"/>`
      )
    ),
    itemMundo(
      "vovo",
      "vovo_gatinho",
      "pet",
      "Gatinho no novelo",
      130,
      () =>
        `<g transform="translate(16 130)"><circle cx="-6" cy="6" r="6" fill="#64B5F6" stroke="var(--ink)" stroke-width="1"/><path d="M0 8Q0 -4 8 -4Q14 -4 14 8Z" fill="#FFB74D" stroke="var(--ink)" stroke-width="1"/><circle cx="9" cy="-8" r="5" fill="#FFB74D" stroke="var(--ink)" stroke-width="1"/><path d="M6 -12l-1 -4 3 2M12 -12l1 -4 -3 2" fill="#FFB74D"/><path d="M7 -8q1 -1 2 0M10 -8q1 -1 2 0" stroke="#212121" stroke-width=".8" fill="none"/></g>`
    ),
    itemMundo(
      "vovo",
      "vovo_cozinha",
      "bg",
      "Cozinha com bolo na mesa",
      160,
      () =>
        `<rect x="0" y="-6" width="120" height="154" fill="#FFE0B2" opacity=".45"/>${[0, 12, 24, 36, 48, 60, 72, 84, 96, 108].map((x, i) => `<rect x="${x}" y="120" width="12" height="12" fill="${i % 2 ? "#E57373" : "#FFF"}" opacity=".6"/><rect x="${x}" y="132" width="12" height="12" fill="${i % 2 ? "#FFF" : "#E57373"}" opacity=".6"/>`).join("")}<path d="M86 118h28v-12q-14 -8 -28 0z" fill="#FFCA28" opacity=".8"/>`
    )
  );
