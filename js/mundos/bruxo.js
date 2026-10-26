/*
  Mundo Bruxo: bruxaria da floresta, caldeirão borbulhando, poções, gato preto e lua (verde e roxo).
  Diferente do Feiticeiro (torre, grimório e estrelas): aqui é mato, cogumelo, chá de ervas e caos fofo.
  Personalidade (falas), tema (cores, fonte, água, sub-temas) e itens da loja.
  A decoração da tela fica em estilos/mundos/bruxo.css e o resto do mundo em bruxo-extras.js.
*/
"use strict";

PART.bolha = c =>
  `<circle r="3.4" fill="#C6FF00" fill-opacity=".45" stroke="#E6FF9E" stroke-width=".8"/><circle cx="-1.2" cy="-1.2" r=".9" fill="#fff"/>`;
PART.cogu = c =>
  `<path d="M-4 0Q-4 -5 0 -5Q4 -5 4 0Z" fill="#E53935"/><rect x="-1.2" y="0" width="2.4" height="3.4" fill="#FFF3E0"/><circle cx="-1.6" cy="-2.6" r=".7" fill="#fff"/><circle cx="1.6" cy="-2" r=".6" fill="#fff"/>`;

PERSONAS.bruxo = {
  name: "Bruxo",
  desc: "Mexe o caldeirão, conversa com o gato e transforma bagunça em poção.",
  sad: [
    "O caldeirão esfriou... e o gato tá me olhando torto. Cadê você?",
    "Minhas plantas murcharam de saudade. Volta pra cabana?",
    "Até o sapo perguntou de você. Fiquei sem resposta."
  ],
  placeholder: "Que ingrediente vai pro caldeirão hoje?",
  starter: ["bru_chapeu", "bru_manto"],
  hi: [
    "Hehehe{nome}! O caldeirão tá quente e tem <b>{n}</b> tarefas pra jogar dentro.",
    "Lua crescente, vento bom{nome}. <b>{n}</b> ingredientes na receita de hoje.",
    "Acordei com o gato pisando na minha cara{nome}. <b>{n}</b> tarefas nos esperam.",
    "A bola de cristal tá meio embaçada, mas eu vejo <b>{n}</b> tarefas{nome}.",
    "Chá de ervas pronto{nome}. Bora mexer o caldeirão das <b>{n}</b> tarefas?"
  ],
  cheers: [
    "Plim! Jogou no caldeirão e virou poção.",
    "Hehehe, mais uma! O gato aprovou.",
    "Borbulhou bonito. Tarefa feita!",
    "Isso foi bruxaria de primeira.",
    "Um ingrediente a menos na receita.",
    "O sapo pulou de alegria. Riscou!",
    "Feitiço da produtividade funcionando.",
    "Caldeirão em ebulição! Continua.",
    "Até a lua sorriu agora."
  ],
  drink: [
    "<b>+{ml} mL</b> de chá de ervas. Ou é água... sei lá, funciona.",
    "Glub glub, <b>+{ml} mL</b> de poção verde (é água, juro).",
    "<b>+{ml} mL</b>. A bruxaria começa pela hidratação.",
    "Bebeu <b>{ml} mL</b> da fonte da floresta.",
    "<b>+{ml} mL</b>. O caldeirão também agradece."
  ],
  goal: [
    "Meta de água batida! Caldeirão cheinho.",
    "Hidratação de bruxa experiente. Até o gato tá impressionado.",
    "Poção completa! Pode voar de vassoura hoje."
  ],
  thirsty: [
    "Caldeirão secando! Faltam <b>{ml} mL</b>.",
    "Bruxa seca não faz poção. Bebe <b>{ml} mL</b>.",
    "As plantas e você precisam de água. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> tarefas viraram sapo de tão velhas. Bora desencantar?",
    "<b>{n}</b> atrasadas no fundo do caldeirão. Mexe que sai.",
    "Teia de aranha em <b>{n}</b> tarefas. Uma vassourada resolve."
  ],
  night: [
    "Lua cheia, hora de fechar o caldeirão. Dorme bem.",
    "O gato já tá enrolado. Fecha o dia e vem sonhar.",
    "As corujas acordaram. Bruxa boa descansa."
  ],
  done: [
    "Receita completa! Poção perfeita de dia produtivo.",
    "Caldeirão limpinho. Hoje você foi a bruxa mais poderosa da floresta.",
    "Tudo feito. Hora de um chá com o gato."
  ],
  focus: [
    "Mexendo o caldeirão em silêncio. Foco total.",
    "Concentração de bruxa: nem o gato derrubando coisas te distrai.",
    "Poção do foco servida. Bom estudo."
  ]
};

THEMES.bruxo = {
  font: '"Griffy"',
  ds: 1.06,
  L: ["#EEF3E6", "#FFFFFF", "#1D1A24", "#6A1B9A", "#7CB342", "#F7FAF2", "#1D1A24"],
  D: ["#0C0E0A", "#171A13", "#E9F1DE", "#B388FF", "#9CCC65", "#D8E3CB", "#171A13"],
  pat: ["cogu", "bolha"],
  water: { name: "Poção borbulhante", spd: 4.2, amp: 3.6, part: "bolha" },
  vars: [
    { id: "base", name: "Cabana da floresta" },
    {
      id: "caldeirao",
      name: "Caldeirão tóxico",
      price: 120,
      L: ["#E9F7D9", "#FFFFFF", "#132008", "#33691E", "#76FF03", "#F6FFEC", "#132008"],
      D: ["#060A03", "#0F170A", "#E6FFD0", "#B2FF59", "#76FF03", "#D6F2BE", "#0F170A"],
      part: "bolha",
      wn: "Gosma verde (é água)",
      pat: ["bolha", "bolha"]
    },
    {
      id: "lua",
      name: "Lua de sangue",
      price: 140,
      a: ["#B71C1C", "#FF5252"],
      w: ["#8E1B1B", "#E57373"],
      part: "lua",
      wn: "Chá de hibisco",
      pat: ["lua", "bat"]
    },
    {
      id: "cogumelos",
      name: "Clareira de cogumelos",
      price: 110,
      L: ["#FFF3EC", "#FFFFFF", "#2A1610", "#C62828", "#E57373", "#FFF9F5", "#2A1610"],
      a: ["#C62828", "#FF8A80"],
      part: "cogu",
      wn: "Orvalho da clareira",
      pat: ["cogu", "leaf"]
    },
    {
      id: "abobora",
      name: "Noite das abóboras",
      price: 130,
      L: ["#FFF3E0", "#FFFFFF", "#24130A", "#E65100", "#FB8C00", "#FFF8EF", "#24130A"],
      D: ["#120A04", "#1E120A", "#FFE9D2", "#FF9E40", "#FB8C00", "#F2DCC5", "#1E120A"],
      wn: "Sopa de abóbora",
      pat: ["leaf", "bat"]
    },
    {
      id: "ervas",
      name: "Jardim de ervas",
      price: 100,
      f: '"Caveat"',
      ds: 1.2,
      a: ["#2E7D32", "#81C784"],
      w: ["#8BC34A", "#AED581"],
      part: "leaf",
      wn: "Chá de camomila",
      pat: ["leaf", "leaf"]
    },
    {
      id: "pantano",
      name: "Pântano",
      price: 130,
      L: ["#E8F5E9", "#FFFFFF", "#1B2E1D", "#2E7D32", "#81C784", "#F1F8F2", "#1B2E1D"],
      D: ["#0A140C", "#122015", "#E8F5E9", "#66BB6A", "#81C784", "#C8E6C9", "#122015"],
      part: "bolha",
      wn: "Água do pântano",
      pat: ["leaf", "bolha"]
    },
    {
      id: "mar",
      name: "Bruxa do mar",
      price: 135,
      L: ["#E0F2F1", "#FFFFFF", "#0A2422", "#00695C", "#4DB6AC", "#F0FAF9", "#0A2422"],
      D: ["#051514", "#0A2422", "#E0F2F1", "#26A69A", "#4DB6AC", "#B2DFDB", "#0A2422"],
      part: "bolha",
      wn: "Água salgada encantada",
      pat: ["bolha", "lua"]
    },
    {
      id: "inverno",
      name: "Inverno de bruxa",
      price: 140,
      L: ["#EDE7F6", "#FFFFFF", "#1A1528", "#3F51B5", "#7986CB", "#F5F2FA", "#1A1528"],
      D: ["#0D0B17", "#171426", "#EDE7F6", "#5C6BC0", "#7986CB", "#C5CAE9", "#171426"],
      part: "lua",
      wn: "Chá de hortelã gélido",
      pat: ["lua", "cogu"]
    },
    { id: "lenda", name: "Lua roxa", ach: "nivel5", a: ["#4A148C", "#CE93D8"], w: ["#7B1FA2", "#BA68C8"] }
  ]
};

/* ---------- itens ---------- */
const chapeuBruxa = (c, faixa, fivela = "#C6A700") =>
  `<path d="M14 48Q60 34 106 48Q102 56 60 52Q18 56 14 48Z" fill="${c}" ${O}/><path d="M34 48Q40 28 48 16Q56 4 64 2Q82 -2 92 12Q78 8 74 18Q72 34 86 48Q60 42 34 48Z" fill="${c}" ${O}/><path d="M36 45Q60 39 84 45" stroke="${faixa}" stroke-width="5" fill="none"/><rect x="53" y="38" width="10" height="9" rx="1" fill="none" stroke="${fivela}" stroke-width="2"/>`;
const caldeiraoMini = (cor = "#76FF03") =>
  `<path d="M-12 -4H12Q14 10 0 12Q-14 10 -12 -4Z" fill="#263238" stroke="var(--ink)" stroke-width="1.6"/><rect x="-14" y="-7" width="28" height="4" rx="2" fill="#37474F" stroke="var(--ink)" stroke-width="1.2"/><ellipse cy="-5" rx="11" ry="2.4" fill="${cor}"/><g class="bolha-sobe"><circle cx="-4" cy="-9" r="2" fill="${cor}" opacity=".8"/><circle cx="3" cy="-12" r="1.5" fill="${cor}" opacity=".7"/></g>`;

ITEMS.push(
  {
    id: "bru_chapeu",
    p: "bruxo",
    slot: "hat",
    name: "Chapéu torto",
    price: 80,
    svg: () => chapeuBruxa("#2E1A47", "#7CB342")
  },
  {
    id: "bru_chapeu_verde",
    p: "bruxo",
    slot: "hat",
    name: "Chapéu do pântano",
    price: 110,
    svg: () =>
      chapeuBruxa("#33691E", "#6A1B9A") +
      `<path d="M88 12q6 2 4 8" stroke="#9CCC65" stroke-width="2" fill="none"/><circle cx="92" cy="22" r="2.4" fill="#9CCC65"/>`
  },
  {
    id: "bru_capuz",
    p: "bruxo",
    slot: "hat",
    name: "Capuz de folhas",
    price: 100,
    svg: () =>
      `<path d="M18 62Q14 14 60 12Q106 14 102 62Q96 40 60 36Q24 40 18 62Z" fill="#558B2F" ${O}/>` +
      [
        [30, 30, -30],
        [44, 20, -10],
        [60, 16, 0],
        [76, 20, 10],
        [90, 30, 30]
      ]
        .map(
          ([x, y, r]) =>
            `<path d="M${x} ${y}q-5 -8 0 -12q5 4 0 12z" fill="#8BC34A" transform="rotate(${r} ${x} ${y})"/>`
        )
        .join("")
  },
  {
    id: "bru_coroa_cogu",
    p: "bruxo",
    slot: "hat",
    name: "Coroa de cogumelos",
    price: 120,
    svg: () =>
      `<path d="M26 44Q60 28 94 44" stroke="#6D4C41" stroke-width="3" fill="none"/>` +
      [
        [32, 38, 6],
        [48, 32, 8],
        [64, 30, 7],
        [80, 34, 6]
      ]
        .map(
          ([x, y, r]) =>
            `<rect x="${x - 1.6}" y="${y}" width="3.2" height="${r * 0.8}" fill="#FFF3E0" ${O} stroke-width="1"/><path d="M${x - r} ${y}Q${x - r} ${y - r} ${x} ${y - r}Q${x + r} ${y - r} ${x + r} ${y}Z" fill="#E53935" ${O} stroke-width="1.2"/><circle cx="${x - r / 3}" cy="${y - r / 2}" r="${r / 5}" fill="#fff"/>`
        )
        .join("")
  },
  {
    id: "bru_chapeu_abobora",
    p: "bruxo",
    slot: "hat",
    name: "Chapéu de abóbora",
    ach: "produtivo",
    svg: () =>
      chapeuBruxa("#4A148C", "#FB8C00", "#FFD54F") +
      `<g transform="translate(76 36)"><ellipse rx="9" ry="7" fill="#FB8C00" ${O} stroke-width="1.4"/><path d="M-3 -7v14M3 -7v14" stroke="#E65100" stroke-width="1"/><path d="M0 -7q1 -4 3 -5" stroke="#558B2F" stroke-width="2"/><path d="M-4 -1l2 -2 2 2zM2 -1l2 -2 2 2z" fill="#3E2723"/><path d="M-4 3q4 3 8 0" stroke="#3E2723" stroke-width="1.2" fill="none"/></g>`
  },
  {
    id: "bru_cabelo",
    p: "bruxo",
    slot: "hair",
    name: "Cabelo de musgo",
    price: 100,
    svg: () =>
      hairMessy("#558B2F") +
      `<circle cx="40" cy="26" r="2.4" fill="#E53935"/><circle cx="82" cy="30" r="2" fill="#FFEB3B"/>`
  },
  {
    id: "bru_trancas",
    p: "bruxo",
    slot: "hair",
    name: "Tranças roxas",
    price: 120,
    svg: () =>
      `<path d="M22 56Q20 22 60 20Q100 22 98 56Q90 40 60 38Q30 40 22 56Z" fill="#6A1B9A" ${O}/>` +
      [22, 98]
        .map(
          x =>
            `<path d="M${x} 52Q${x - 4} 70 ${x} 88Q${x + 4} 100 ${x} 112" stroke="#6A1B9A" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${x - 3} 62l6 4M${x - 3} 76l6 4M${x - 3} 92l6 4" stroke="#4A148C" stroke-width="1.4"/><circle cx="${x}" cy="114" r="3" fill="#9CCC65" ${O} stroke-width="1"/>`
        )
        .join("")
  },
  {
    id: "bru_olhos_gato",
    p: "bruxo",
    slot: "face",
    name: "Olhos de gato",
    price: 90,
    svg: () =>
      [47, 73]
        .map(
          x =>
            `<ellipse cx="${x}" cy="64" rx="6.5" ry="5" fill="#E6EE9C" ${O} stroke-width="1.6"/><ellipse cx="${x}" cy="64" rx="1.6" ry="4.6" fill="#1B1B1B"/>`
        )
        .join("")
  },
  {
    id: "bru_oculos",
    p: "bruxo",
    slot: "face",
    name: "Óculos redondos de erva",
    price: 70,
    svg: () => lensPair("#C5E1A5", "#33691E", 11, 56, 16, 0.35)
  },
  {
    id: "bru_sardas",
    p: "bruxo",
    slot: "cheek",
    name: "Sardas de musgo",
    price: 50,
    svg: () =>
      [
        [38, 72],
        [42, 75],
        [36, 76],
        [80, 72],
        [84, 75],
        [78, 76]
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#7CB342"/>`)
        .join("")
  },
  {
    id: "bru_batom",
    p: "bruxo",
    slot: "mouth",
    name: "Batom de amora",
    price: 60,
    svg: () => `<path d="M51 74Q60 70 69 74Q60 80 51 74Z" fill="#6A1B9A" ${O} stroke-width="1.4"/>`
  },
  {
    id: "bru_colar_lua",
    p: "bruxo",
    slot: "neck",
    name: "Colar de lua",
    price: 80,
    svg: () =>
      `<path d="M29 84Q60 106 91 84" fill="none" stroke="#9E9E9E" stroke-width="1.6"/><path d="M62 100a7 7 0 1 0 4 12a5.6 5.6 0 1 1-4-12z" fill="#E0E0E0" ${O} stroke-width="1.2"/>`
  },
  {
    id: "bru_cristais",
    p: "bruxo",
    slot: "neck",
    name: "Colar de cristais",
    price: 100,
    svg: () =>
      `<path d="M29 84Q60 106 91 84" fill="none" stroke="#6D4C41" stroke-width="1.6"/>` +
      [
        [44, 96, "#CE93D8"],
        [60, 102, "#9CCC65"],
        [76, 96, "#80DEEA"]
      ]
        .map(([x, y, c]) => `<path d="M${x} ${y}l3 4-3 8-3-8z" fill="${c}" ${O} stroke-width="1"/>`)
        .join("")
  },
  {
    id: "bru_cachecol",
    p: "bruxo",
    slot: "neck",
    name: "Cachecol listrado",
    price: 80,
    svg: () =>
      `<path d="M28 84Q60 100 92 84L92 92Q60 108 28 92Z" fill="#6A1B9A" ${O}/><path d="M38 89l0 6M50 92l0 6M62 94l0 6M74 92l0 6M86 89l0 6" stroke="#9CCC65" stroke-width="4"/><path d="M34 94L28 130L38 132L42 96Z" fill="#6A1B9A" ${O}/><path d="M31 106l9 1M30 118l9 1" stroke="#9CCC65" stroke-width="4"/>`
  },
  {
    id: "bru_manto",
    p: "bruxo",
    slot: "top",
    name: "Manto remendado",
    price: 110,
    svg: () =>
      topBase("#4A148C") +
      `<rect x="20" y="108" width="16" height="14" fill="#7CB342" ${O} stroke-width="1.4" transform="rotate(-8 28 115)"/><path d="M22 110l12 10M34 110l-12 10" stroke="#33691E" stroke-width="1"/><rect x="82" y="124" width="14" height="12" fill="#FB8C00" ${O} stroke-width="1.4" transform="rotate(6 89 130)"/><path d="M44 86L60 104L76 86" fill="#2E1A47" ${O}/>` +
      topHem
  },
  {
    id: "bru_avental",
    p: "bruxo",
    slot: "top",
    name: "Avental de poções",
    price: 120,
    svg: () =>
      topBase("#37474F") +
      `<path d="M34 92H86V150H34Z" fill="#D7CCC8" ${O}/><path d="M34 92Q60 82 86 92" stroke="#8D6E63" stroke-width="2" fill="none"/><path d="M42 120h36v16H42z" fill="#BCAAA4" ${O} stroke-width="1.2"/><path d="M52 104h4l2 8h-8z" fill="#9CCC65" ${O} stroke-width="1"/><path d="M64 102h4l2 10h-8z" fill="#CE93D8" ${O} stroke-width="1"/>` +
      topHem
  },
  {
    id: "bru_capa_folhas",
    p: "bruxo",
    slot: "top",
    name: "Capa de folhas",
    price: 160,
    svg: () =>
      topBase("#33691E") +
      Array.from({ length: 14 }, (_, i) => {
        const x = 8 + (i % 7) * 17,
          y = 100 + Math.floor(i / 7) * 24;
        return `<path d="M${x} ${y}q-6 -10 0 -14q6 4 0 14z" fill="${i % 3 ? "#7CB342" : "#AED581"}" transform="rotate(${i % 2 ? 20 : -20} ${x} ${y})"/>`;
      }).join("") +
      topHem
  },
  {
    id: "bru_cinto",
    p: "bruxo",
    slot: "waist",
    name: "Cinto de frasquinhos",
    price: 80,
    svg: () =>
      `<path d="M8 124H112" stroke="#4E342E" stroke-width="6"/>` +
      [
        [30, "#9CCC65"],
        [46, "#CE93D8"],
        [74, "#FF8A65"],
        [90, "#80DEEA"]
      ]
        .map(
          ([x, c]) =>
            `<path d="M${x - 3} 126h6v4l2 6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3l2-6z" fill="${c}" ${O} stroke-width="1"/>`
        )
        .join("")
  },
  {
    id: "bru_botton",
    p: "bruxo",
    slot: "pins",
    name: "Botton de cogumelo",
    price: 50,
    svg: () =>
      `<circle cx="38" cy="106" r="7" fill="#FFF3E0" ${O} stroke-width="1.4"/><path d="M33 107Q33 101 38 101Q43 101 43 107Z" fill="#E53935"/><rect x="36.8" y="107" width="2.4" height="3.4" fill="#BCAAA4"/>`
  },
  {
    id: "bru_vassoura",
    p: "bruxo",
    slot: "back",
    name: "Vassoura nas costas",
    price: 130,
    svg: () =>
      `<path d="M12 150L100 40" stroke="#6D4C41" stroke-width="4" stroke-linecap="round"/><path d="M100 40l14 -18M100 40l18 -10M100 40l8 -20M100 40l18 -2" stroke="#C8A165" stroke-width="2.4" stroke-linecap="round"/><path d="M96 46l8 -10" stroke="#8D6E63" stroke-width="4"/>`
  },
  {
    id: "bru_pulseira",
    p: "bruxo",
    slot: "wrist",
    name: "Pulseira de ervas",
    price: 50,
    svg: () =>
      `<rect x="10" y="118" width="18" height="6" rx="3" fill="#6D4C41" ${O} stroke-width="1.2"/><path d="M14 118q-2 -4 2 -6M22 118q2 -5 -2 -6" stroke="#7CB342" stroke-width="2" fill="none"/>`
  },
  {
    id: "bru_caldeirao",
    p: "bruxo",
    slot: "hand",
    name: "Caldeirão de bolso",
    price: 120,
    svg: (x, y) => H(x, y + 4, caldeiraoMini())
  },
  {
    id: "bru_pocao",
    p: "bruxo",
    slot: "hand",
    name: "Poção borbulhante",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-3 -14h6v6l7 12a6 6 0 0 1-5 9h-10a6 6 0 0 1-5-9l7-12z" fill="#CE93D8" fill-opacity=".8" stroke="var(--ink)" stroke-width="1.6"/><rect x="-4" y="-17" width="8" height="4" rx="1" fill="#8D6E63"/><g class="bolha-sobe"><circle cx="-2" cy="2" r="1.6" fill="#fff" opacity=".8"/><circle cx="2" cy="-2" r="1.1" fill="#fff" opacity=".7"/></g>`
      )
  },
  {
    id: "bru_vassoura_mao",
    p: "bruxo",
    slot: "hand",
    name: "Vassoura voadora",
    price: 140,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-4 16L14 -30" stroke="#6D4C41" stroke-width="3.4" stroke-linecap="round"/><path d="M-4 16l-8 14M-4 16l-3 16M-4 16l3 16M-4 16l7 13" stroke="#C8A165" stroke-width="2.2" stroke-linecap="round"/><path d="M-8 10h8" stroke="#8D6E63" stroke-width="3"/>`
      )
  },
  {
    id: "bru_cajado_galho",
    p: "bruxo",
    slot: "hand",
    name: "Cajado de galho",
    price: 110,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M2 14Q4 -10 8 -40" stroke="#5D4037" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M8 -40q-8 -6 -10 -2M8 -40q6 -8 10 -6M6 -24q-6 -2 -8 2" stroke="#5D4037" stroke-width="2" fill="none"/><path d="M14 -46q-6 -6 0 -10q6 4 0 10z" fill="#7CB342"/><circle class="brilhinho" cx="8" cy="-44" r="3" fill="#C6FF00"/>`
      )
  },
  {
    id: "bru_gato",
    p: "bruxo",
    slot: "pet",
    name: "Gato preto",
    price: 150,
    svg: () =>
      `<g transform="translate(15 128)"><path d="M-9 8Q-10 -6 0 -6Q10 -6 9 8Z" fill="#212121" stroke="var(--ink)" stroke-width="1.1"/><circle cy="-10" r="7.5" fill="#212121"/><path d="M-6 -15l-1 -6 5 3M6 -15l1 -6 -5 3" fill="#212121"/><ellipse cx="-3" cy="-10" rx="1.6" ry="2" fill="#C6FF00"/><ellipse cx="3" cy="-10" rx="1.6" ry="2" fill="#C6FF00"/><ellipse cx="-3" cy="-10" rx=".5" ry="1.6" fill="#000"/><ellipse cx="3" cy="-10" rx=".5" ry="1.6" fill="#000"/><path d="M8 4q8 -2 6 -12" stroke="#212121" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-6 -2h12" stroke="#7B1FA2" stroke-width="1.6"/></g>`
  },
  {
    id: "bru_sapo",
    p: "bruxo",
    slot: "pet",
    name: "Sapo encantado",
    price: 120,
    svg: () =>
      `<g transform="translate(15 132)"><ellipse rx="10" ry="6.5" fill="#7CB342" stroke="var(--ink)" stroke-width="1.1"/><circle cx="-5" cy="-6" r="3.4" fill="#7CB342" stroke="var(--ink)" stroke-width="1"/><circle cx="5" cy="-6" r="3.4" fill="#7CB342" stroke="var(--ink)" stroke-width="1"/><circle cx="-5" cy="-6" r="1.4" fill="#212121"/><circle cx="5" cy="-6" r="1.4" fill="#212121"/><path d="M-5 1q5 3 10 0" stroke="#33691E" stroke-width="1" fill="none"/><path d="M-4 -10l1 -3 2 2 1 -3 2 3 1 -2 1 3z" fill="#FFD54F"/></g>`
  },
  {
    id: "bru_corvo",
    p: "bruxo",
    slot: "pet",
    name: "Corvo conselheiro",
    ach: "habito21",
    svg: () =>
      `<g transform="translate(16 126)"><path d="M-10 8Q-12 -6 0 -8Q10 -8 8 6Z" fill="#263238" stroke="var(--ink)" stroke-width="1.1"/><circle cx="3" cy="-8" r="6" fill="#263238"/><path d="M8 -8l7 2-7 2z" fill="#455A64"/><circle cx="4" cy="-9" r="1.3" fill="#B388FF"/><path d="M-10 4Q-18 0 -16 -6Q-10 0 -6 0z" fill="#37474F"/><path d="M-2 8v4M2 8v4" stroke="#455A64" stroke-width="1.2"/></g>`
  },
  {
    id: "bru_cabana",
    p: "bruxo",
    slot: "bg",
    name: "Cabana na floresta",
    price: 160,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#33691E" opacity=".3"/><path d="M0 148V110l12 -30 12 30V148ZM100 148V100l10 -30 10 30v48Z" fill="#1B5E20" opacity=".55"/><path d="M78 148V118h30v30Z" fill="#6D4C41" opacity=".6"/><path d="M74 120l19 -16 19 16z" fill="#4E342E" opacity=".7"/><rect class="pisca" x="86" y="126" width="8" height="8" fill="#FFE082"/>`
  },
  {
    id: "bru_lua_cheia",
    p: "bruxo",
    slot: "bg",
    name: "Lua cheia com morcegos",
    price: 150,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#2E1A47" opacity=".45"/><circle cx="92" cy="22" r="18" fill="#FFF8E1" opacity=".9"/><circle cx="86" cy="18" r="3" fill="#EFE5C8"/><circle cx="98" cy="28" r="2.4" fill="#EFE5C8"/>` +
      bat(30, 20, 0.6, "#1B1B1B") +
      bat(54, 34, 0.45, "#1B1B1B")
  },
  {
    id: "bru_caldeirao_bg",
    p: "bruxo",
    slot: "bg",
    name: "Caldeirão fumegante",
    ach: "semana_agua",
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#1B1B1B" opacity=".25"/><g transform="translate(100 134) scale(1.4)">${caldeiraoMini("#C6FF00")}</g><g class="vapor"><path d="M96 110q-6 -10 2 -18q8 -8 0 -18" stroke="#C5E1A5" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/><path d="M106 112q6 -10 -2 -18" stroke="#CE93D8" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/></g>`
  },
  {
    id: "bru_capa_corvo",
    p: "bruxo",
    slot: "top",
    name: "Capa de corvo",
    price: 130,
    svg: () =>
      `<path d="M22 66Q60 72 98 66L104 126Q60 134 16 126Z" fill="#1A1829" stroke="var(--ink)" stroke-width="1.4"/><path d="M28 80L34 94L42 82L48 96L54 84L60 98L66 84L72 96L78 82L86 94L92 80" stroke="#311B92" stroke-width="1.8" fill="none"/>`
  },
  {
    id: "bru_chapeu_cogu_gigante",
    p: "bruxo",
    slot: "hat",
    name: "Chapéu de cogumelo gigante",
    price: 140,
    svg: () =>
      `<path d="M10 50Q60 18 110 50Q98 62 60 56Q22 62 10 50Z" fill="#D32F2F" stroke="var(--ink)" stroke-width="1.8"/><ellipse cx="36" cy="40" rx="6" ry="4" fill="#FFF"/><ellipse cx="60" cy="32" rx="7" ry="5" fill="#FFF"/><ellipse cx="84" cy="40" rx="6" ry="4" fill="#FFF"/><rect x="52" y="52" width="16" height="8" fill="#FFF8E1" stroke="var(--ink)" stroke-width="1.2"/>`
  },
  {
    id: "bru_colar_dente_lua",
    p: "bruxo",
    slot: "neck",
    name: "Colar de dente de lua",
    price: 90,
    svg: () =>
      `<path d="M44 80Q60 98 76 80" stroke="#B0BEC5" stroke-width="1.5" fill="none"/><path d="M60 92Q64 96 62 104Q59 98 57 95Z" fill="#ECEFF1" stroke="#37474F" stroke-width="1"/>`
  },
  {
    id: "bru_botas_pontudas",
    p: "bruxo",
    slot: "shoes",
    name: "Botas pontudas",
    price: 110,
    svg: () =>
      `<path d="M38 132L36 148L24 148Q20 144 26 142L38 142ZM82 132L84 148L96 148Q100 144 94 142L82 142Z" fill="#2E1A47" stroke="var(--ink)" stroke-width="1.4"/><rect x="34" y="140" width="8" height="3" fill="#FBC02D"/><rect x="78" y="140" width="8" height="3" fill="#FBC02D"/>`
  },
  {
    id: "bru_coruja_neves",
    p: "bruxo",
    slot: "pet",
    name: "Coruja-das-neves",
    price: 160,
    svg: () =>
      `<g transform="translate(15 125)"><ellipse rx="8" ry="10" fill="#FAFAFA" stroke="var(--ink)" stroke-width="1.2"/><circle cx="-3" cy="-4" r="2.8" fill="#FFEB3B"/><circle cx="3" cy="-4" r="2.8" fill="#FFEB3B"/><circle cx="-3" cy="-4" r="1.2" fill="#000"/><circle cx="3" cy="-4" r="1.2" fill="#000"/><polygon points="0,-1 -2,2 2,2" fill="#FFA000"/><path d="M-5 12v3M-2 12v3M2 12v3M5 12v3" stroke="#BDBDBD" stroke-width="1.2"/></g>`
  },
  {
    id: "bru_morceguinho",
    p: "bruxo",
    slot: "pet",
    name: "Morceguinho fofo",
    price: 150,
    svg: () =>
      `<g transform="translate(15 127)"><circle cy="-2" r="7" fill="#311B92" stroke="var(--ink)" stroke-width="1.1"/><polygon points="-6,-7 -9,-14 -3,-9" fill="#311B92"/><polygon points="6,-7 9,-14 3,-9" fill="#311B92"/><circle cx="-2.5" cy="-2" r="1.4" fill="#CE93D8"/><circle cx="2.5" cy="-2" r="1.4" fill="#CE93D8"/><path d="M-7 0Q-18 -6 -14 6Q-10 4 -7 2Z" fill="#4A148C"/><path d="M7 0Q18 -6 14 6Q10 4 7 2Z" fill="#4A148C"/></g>`
  },
  {
    id: "bru_salamandra",
    p: "bruxo",
    slot: "pet",
    name: "Salamandra do fogo",
    price: 170,
    svg: () =>
      `<g transform="translate(15 132)"><path d="M-8 4Q-4 -4 4 -2Q12 0 16 6Q10 6 6 2Q-2 0 -6 6Z" fill="#E65100" stroke="var(--ink)" stroke-width="1.2"/><circle cx="-4" cy="-1" r="1.4" fill="#FFD54F"/><path d="M-1 2Q4 4 8 2" stroke="#FFAB00" stroke-width="1" fill="none"/></g>`
  }
);
