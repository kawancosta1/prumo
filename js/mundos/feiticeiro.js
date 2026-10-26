/*
  Mundo Feiticeiro: um mago estudioso de torre, grimório e céu estrelado (azul profundo e dourado).
  Personalidade (falas), tema (cores, fonte, água, sub-temas) e itens da loja.
  A decoração da tela fica em estilos/mundos/feiticeiro.css e o resto do mundo em feiticeiro-extras.js.
*/
"use strict";

// partículas da água deste mundo
PART.runa = c =>
  `<circle r="3.6" fill="none" stroke="#FFE7A3" stroke-width="1"/><path d="M0 -3.6V3.6M-3.1 -1.8L3.1 1.8M3.1 -1.8L-3.1 1.8" stroke="#FFE7A3" stroke-width=".7"/>`;
PART.cometa = c =>
  `<path d="M-6 3L1 -1" stroke="#FFF3C4" stroke-width="1.2" stroke-linecap="round" opacity=".7"/><circle cx="2" cy="-1.6" r="2" fill="#FFF3C4"/>`;
PART.lua = c => `<path d="M1 -4.4a4.4 4.4 0 1 0 3 7.6a3.5 3.5 0 1 1 -3 -7.6z" fill="${c}"/>`;

PERSONAS.feiticeiro = {
  name: "Feiticeiro",
  desc: "Estudioso de torre alta: grimório aberto, estrelas e paciência de mil anos.",
  sad: [
    "Meu grimório ficou empoeirado... você sumiu da torre.",
    "As estrelas perguntaram por você. Eu disse que estava estudando outra magia.",
    "Até a coruja ficou preocupada. Volta pra torre?"
  ],
  placeholder: "Qual feitiço você vai lançar hoje?",
  starter: ["feit_chapeu", "feit_manto"],
  hi: [
    "Saudações{nome}! O pergaminho de hoje tem <b>{n}</b> feitiços pra lançar.",
    "As estrelas se alinharam{nome}: <b>{n}</b> tarefas e uma xícara de chá de lavanda.",
    "Bom dia, aprendiz{nome}. <b>{n}</b> encantamentos esperam na mesa da torre.",
    "Abri o grimório na página certa{nome}. São <b>{n}</b> feitiços hoje.",
    "O cristal mostrou seu dia{nome}: <b>{n}</b> tarefas e um final brilhante.",
    "Pelos ventos do zênite{nome}! Temos <b>{n}</b> encantamentos a transcrever.",
    "Os astrolábios da torre indicam <b>{n}</b> missões arcanas hoje.",
    "Saudações místicas! O círculo está traçado com <b>{n}</b> deveres sagrados.",
    "Que a luz de Éter guie seus passos: <b>{n}</b> feitiços catalogados.",
    "A névoa matinal se dissipa revelando <b>{n}</b> feitiços no pergaminho."
  ],
  cheers: [
    "Feitiço lançado com perfeição! ✦",
    "Abracadabra... e riscou da lista.",
    "Isso foi magia de nível avançado.",
    "A torre inteira brilhou agora.",
    "Mais uma runa acesa no seu caminho.",
    "Nem o arquimago faria mais rápido.",
    "Encantamento concluído. Anota no grimório!",
    "Uma estrela nova nasceu no seu céu.",
    "Lumen! Mais uma tarefa iluminada.",
    "Ressonância arcana perfeita! O tomo vibrou.",
    "Gesta gloriosa! As runas dançam em seu louvor.",
    "Magia primordial em estado puro! Excelente trabalho.",
    "Feitiço cravado com tinta estelar no livro mestre.",
    "A trama do cosmos se alinhou com essa conclusão."
  ],
  drink: [
    "<b>+{ml} mL</b> de poção de clareza. A mente agradece.",
    "Bebeu <b>{ml} mL</b> da fonte encantada. Mana recuperada!",
    "<b>+{ml} mL</b>. Até o feitiço mais forte precisa de água.",
    "Elixir de cristal: <b>+{ml} mL</b>.",
    "<b>+{ml} mL</b> e o cajado brilhou mais forte."
  ],
  goal: [
    "Meta de água batida! Sua mana está no máximo.",
    "Fonte encantada cheia. Os anciões aprovariam.",
    "Hidratação lendária. Pode lançar feitiços até a meia-noite."
  ],
  thirsty: [
    "Sua mana está baixa. Faltam <b>{ml} mL</b> pra recarregar.",
    "O cristal escureceu um pouco. Bebe <b>{ml} mL</b> pra ele voltar a brilhar.",
    "Nenhum feiticeiro estuda com sede. Faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> feitiços esquecidos no pergaminho. Vamos desfazer essa maldição?",
    "<b>{n}</b> tarefas atrasadas viraram névoa. Um passe de mágica e some.",
    "A ampulheta virou e ficaram <b>{n}</b> pra trás. Sem pânico, um de cada vez."
  ],
  night: [
    "A lua subiu na torre. Fecha o grimório do dia e descansa.",
    "Hora das estrelas. Anota o que aprendeu e vai sonhar com constelações.",
    "Até os feiticeiros dormem. Apaga a vela.",
    "O véu da noite cobriu o santuário. Repouse sua mente arcana.",
    "As corujas assumem a vigília. Bons sonhos entre as constelações."
  ],
  done: [
    "Pergaminho completo! Hoje você foi um arquimago.",
    "Todos os feitiços lançados. A torre está em paz.",
    "Lista vazia. Isso sim é magia de verdade.",
    "O grande ritual de hoje está selado e consumado!",
    "Nem nos mais antigos alfarrábios se viu tamanha proeza.",
    "A torre refulge em triunfo! Dia magistralmente concluído.",
    "Todas as profecias do dia foram cumpridas com perfeição."
  ],
  focus: [
    "Silêncio na biblioteca. Hora de estudar o grimório.",
    "Concentração de feiticeiro: nem um dragão passando te distrai.",
    "A vela está acesa. Foco até ela derreter.",
    "Canalize sua energia no vórtice do aprendizado.",
    "Mente límpida como poção recém-destilada: foco absoluto."
  ]
};

THEMES.feiticeiro = {
  font: '"Cinzel Decorative"',
  ds: 0.92,
  L: ["#EEF0FA", "#FFFFFF", "#1A1B3A", "#3949AB", "#5C6BC0", "#F7F8FF", "#1A1B3A"],
  D: ["#0A0B1E", "#14163A", "#E8EAFF", "#8C9EFF", "#7986CB", "#D9DCF5", "#14163A"],
  pat: ["spark", "runa"],
  water: { name: "Poção de clareza", spd: 3.4, amp: 3.4, part: "runa" },
  vars: [
    { id: "base", name: "Torre estrelada" },
    {
      id: "grimorio",
      name: "Grimório antigo",
      price: 120,
      f: '"Cormorant Garamond"',
      ds: 1.12,
      L: ["#F2E8CF", "#FBF5E4", "#3B2A14", "#8C5A1E", "#B8862B", "#FFF8E6", "#3B2A14"],
      D: ["#1C140A", "#2A1F10", "#F2E6CC", "#E0A84A", "#C9A646", "#EADBB8", "#2A1F10"],
      part: "cometa",
      wn: "Tinta de pena",
      pat: ["runa", "star"]
    },
    {
      id: "astral",
      name: "Viagem astral",
      price: 150,
      L: ["#F1EAFB", "#FFFFFF", "#24123F", "#7B2FD0", "#9C6BFF", "#FBF7FF", "#24123F"],
      D: ["#0B0618", "#160C2C", "#F2E8FF", "#C38CFF", "#9C6BFF", "#E2D4F7", "#160C2C"],
      part: "cometa",
      wn: "Poeira de estrela",
      pat: ["spark", "lua"]
    },
    {
      id: "gelo",
      name: "Mago do gelo",
      price: 130,
      a: ["#0277BD", "#80D8FF"],
      w: ["#4FC3F7", "#81D4FA"],
      part: "ice",
      wn: "Água de geleira",
      pat: ["ice", "spark"]
    },
    {
      id: "fogo",
      name: "Mago do fogo",
      price: 130,
      L: ["#FFF1E6", "#FFFFFF", "#3A1408", "#D84315", "#FF7043", "#FFF8F2", "#3A1408"],
      D: ["#170805", "#26100A", "#FFE9DF", "#FF8A50", "#FF7043", "#F2D9CF", "#26100A"],
      part: "spark",
      wn: "Lava fria (é água)",
      pat: ["spark", "bolt"]
    },
    {
      id: "academia",
      name: "Academia de magia",
      price: 140,
      f: '"Cormorant Garamond"',
      ds: 1.1,
      a: ["#7A1F2B", "#E57373"],
      w: ["#B8862B", "#E8C55A"],
      wn: "Chá da biblioteca",
      pat: ["runa", "lua"]
    },
    {
      id: "sombras",
      name: "Mago das sombras",
      price: 150,
      L: ["#ECEBF2", "#FFFFFF", "#211D2D", "#4A3E65", "#6B5B8E", "#F8F7FC", "#211D2D"],
      D: ["#0E0C14", "#181522", "#EBE8F5", "#9D8EC2", "#7E6EAA", "#D8D2EB", "#181522"],
      part: "lua",
      wn: "Essência sombria",
      pat: ["lua", "spark"]
    },
    {
      id: "druida",
      name: "Druida",
      price: 150,
      L: ["#F0F4EE", "#FFFFFF", "#1E2D1A", "#2E6B2A", "#5E9E5A", "#F7FAF5", "#1E2D1A"],
      D: ["#0B1408", "#142010", "#E8F2E4", "#7EC478", "#5E9E5A", "#D3E8CD", "#142010"],
      part: "leaf",
      wn: "Orvalho da floresta",
      pat: ["leaf", "spark"]
    },
    {
      id: "arcanoreal",
      name: "Arcano real",
      price: 160,
      L: ["#F7F0FA", "#FFFFFF", "#2A1238", "#6A1B9A", "#AB47BC", "#FCF8FD", "#2A1238"],
      D: ["#12051A", "#220D30", "#F8EAFE", "#CE93D8", "#AB47BC", "#E8CEF2", "#220D30"],
      part: "gem",
      wn: "Néctar dourado",
      pat: ["gem", "runa"]
    },
    {
      id: "lenda",
      name: "Eclipse dourado",
      ach: "nivel5",
      a: ["#B8860B", "#FFD54F"],
      w: ["#3949AB", "#7986CB"]
    }
  ]
};

/* ---------- itens ---------- */
const estrelaFeit = (x, y, r = 3, c = "#E8C55A") =>
  `<path d="M${x} ${y - r}l${r * 0.28} ${r * 0.72} ${r * 0.72} ${r * 0.28}-${r * 0.72} ${r * 0.28}-${r * 0.28} ${r * 0.72}-${r * 0.28}-${r * 0.72}-${r * 0.72}-${r * 0.28} ${r * 0.72}-${r * 0.28}z" fill="${c}"/>`;
const chapeuMago = (c, faixa, estrelas = true) =>
  `<path d="M22 46Q60 34 98 46Q96 52 60 50Q24 52 22 46Z" fill="${c}" ${O}/><path d="M34 46Q46 30 50 14Q54 0 72 -4Q62 6 66 18Q72 32 86 46Q60 40 34 46Z" fill="${c}" ${O}/><path d="M36 43Q60 37 84 43" stroke="${faixa}" stroke-width="4" fill="none"/>${estrelas ? estrelaFeit(56, 28, 3.4) + estrelaFeit(68, 16, 2.4) + estrelaFeit(48, 38, 2) : ""}`;
const mantoFeit = (c, borda, estrelas) =>
  topBase(c) +
  `<path d="M40 84Q60 104 80 84L74 150H46Z" fill="#000" opacity=".14"/><path d="M42 85Q60 100 78 85" stroke="${borda}" stroke-width="3" fill="none"/><path d="M60 98V150" stroke="${borda}" stroke-width="2.4"/>` +
  (estrelas
    ? estrelaFeit(24, 112, 3.4) +
      estrelaFeit(98, 120, 3) +
      estrelaFeit(34, 138, 2.4) +
      estrelaFeit(90, 140, 2.2)
    : "") +
  topHem;

ITEMS.push(
  {
    id: "feit_chapeu",
    p: "feiticeiro",
    slot: "hat",
    name: "Chapéu de mago",
    price: 80,
    svg: () => chapeuMago("#283593", "#E8C55A")
  },
  {
    id: "feit_chapeu_roxo",
    p: "feiticeiro",
    slot: "hat",
    name: "Chapéu da noite",
    price: 120,
    svg: () => chapeuMago("#4A148C", "#B388FF") + estrelaFeit(76, 30, 2.6, "#FFF59D")
  },
  {
    id: "feit_capuz",
    p: "feiticeiro",
    slot: "hat",
    name: "Capuz de aprendiz",
    price: 90,
    svg: () =>
      `<path d="M18 62Q14 14 60 12Q106 14 102 62Q96 40 60 36Q24 40 18 62Z" fill="#37474F" ${O}/><path d="M60 12Q72 0 80 6" stroke="#37474F" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M30 46Q60 30 90 46" stroke="#E8C55A" stroke-width="1.8" stroke-dasharray="3 3" fill="none"/>`
  },
  {
    id: "feit_capelo",
    p: "feiticeiro",
    slot: "hat",
    name: "Capelo da academia",
    price: 110,
    svg: () =>
      `<path d="M34 42Q34 28 60 28Q86 28 86 42Z" fill="#1A1B3A" ${O}/><path d="M20 26L60 14L100 26L60 38Z" fill="#1A1B3A" ${O}/><circle cx="60" cy="26" r="2.4" fill="#E8C55A"/><path d="M60 26L92 30V46" stroke="#E8C55A" stroke-width="1.8" fill="none"/><path d="M89 46h6l-1 7h-4z" fill="#E8C55A"/>`
  },
  {
    id: "feit_tiara",
    p: "feiticeiro",
    slot: "hat",
    name: "Tiara de estrelas",
    price: 130,
    svg: () =>
      `<path d="M26 44Q60 26 94 44" stroke="#C9A646" stroke-width="3" fill="none"/>` +
      [
        [34, 37, 3],
        [47, 31, 4],
        [60, 27, 5.4],
        [73, 31, 4],
        [86, 37, 3]
      ]
        .map(([x, y, r]) => estrelaFeit(x, y, r, "#FFE082"))
        .join("")
  },
  {
    id: "feit_coroa_runas",
    p: "feiticeiro",
    slot: "hat",
    name: "Coroa de runas",
    ach: "produtivo",
    svg: () =>
      `<path d="M28 44L30 22L42 32L50 16L60 28L70 16L78 32L90 22L92 44Z" fill="#E8C55A" ${O}/>` +
      [36, 48, 60, 72, 84]
        .map(
          (x, i) =>
            `<circle class="brilhinho" style="animation-delay:${i * 0.3}s" cx="${x}" cy="38" r="2.6" fill="${["#90CAF9", "#CE93D8", "#80CBC4"][i % 3]}"/>`
        )
        .join("")
  },
  {
    id: "feit_cabelo",
    p: "feiticeiro",
    slot: "hair",
    name: "Cabelo prateado",
    price: 100,
    svg: () =>
      `<path d="M20 70Q14 30 40 22Q60 14 82 22Q106 30 100 70Q96 50 90 44Q80 34 60 34Q40 34 30 44Q24 50 20 70Z" fill="#CFD8DC" ${O}/><path d="M40 26Q50 30 52 38M70 24Q78 30 80 38" stroke="#90A4AE" stroke-width="1.6" fill="none"/>`
  },
  {
    id: "feit_cabelo_azul",
    p: "feiticeiro",
    slot: "hair",
    name: "Topete arcano",
    price: 110,
    svg: () =>
      hairMessy("#3F51B5") + `<path d="M58 14Q66 8 74 16" stroke="#90CAF9" stroke-width="3" fill="none"/>`
  },
  {
    id: "feit_oculos",
    p: "feiticeiro",
    slot: "face",
    name: "Óculos de meia-lua",
    price: 70,
    svg: () =>
      `<path d="M36 64Q46 72 56 64" fill="none" stroke="#C9A646" stroke-width="2.4"/><path d="M64 64Q74 72 84 64" fill="none" stroke="#C9A646" stroke-width="2.4"/><path d="M56 64H64" stroke="#C9A646" stroke-width="2"/><path d="M36 64H30M84 64H90" stroke="#C9A646" stroke-width="1.6"/>`
  },
  {
    id: "feit_monoculo",
    p: "feiticeiro",
    slot: "face",
    name: "Monóculo de cristal",
    price: 90,
    svg: () =>
      `<circle cx="73" cy="64" r="9" fill="#B3E5FC" fill-opacity=".35" stroke="#C9A646" stroke-width="2.4"/><path d="M82 66Q90 80 86 96" stroke="#C9A646" stroke-width="1.2" fill="none"/><path d="M68 60l4 -2" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`
  },
  {
    id: "feit_olhos_brilho",
    p: "feiticeiro",
    slot: "face",
    name: "Olhos de mana",
    price: 120,
    svg: () =>
      [47, 73]
        .map(
          x =>
            `<circle class="brilhinho" cx="${x}" cy="64" r="7" fill="#82B1FF" opacity=".35"/><circle cx="${x}" cy="64" r="3.4" fill="#E3F2FD"/>`
        )
        .join("")
  },
  {
    id: "feit_runa_bochecha",
    p: "feiticeiro",
    slot: "cheek",
    name: "Runas na bochecha",
    price: 60,
    svg: () =>
      `<g stroke="#5C6BC0" stroke-width="1.4" fill="none"><path d="M36 74l4 -6 4 6M38 72h4"/><path d="M80 68v8M77 70l6 4M83 70l-6 4"/></g>`
  },
  {
    id: "feit_barba",
    p: "feiticeiro",
    slot: "mouth",
    name: "Barba de sábio",
    price: 100,
    svg: () =>
      `<path d="M38 74Q40 70 48 72Q60 76 72 72Q80 70 82 74Q86 96 60 120Q34 96 38 74Z" fill="#ECEFF1" ${O}/><path d="M50 84Q52 98 58 108M70 84Q68 98 62 108M60 82V112" stroke="#B0BEC5" stroke-width="1.4" fill="none"/><path d="M50 74Q55 78 60 75Q65 78 70 74" stroke="var(--ink)" stroke-width="1.6" fill="none"/>`
  },
  {
    id: "feit_amuleto",
    p: "feiticeiro",
    slot: "neck",
    name: "Amuleto de cristal",
    price: 90,
    svg: () =>
      chainN(
        "#C9A646",
        2.2,
        `<path d="M60 96L66 104L60 116L54 104Z" fill="#80DEEA" ${O} stroke-width="1.4"/><path d="M58 102l2 -3" stroke="#fff" stroke-width="1.2"/>`
      )
  },
  {
    id: "feit_cachecol",
    p: "feiticeiro",
    slot: "neck",
    name: "Cachecol da academia",
    price: 80,
    svg: () =>
      `<path d="M28 84Q60 100 92 84L92 92Q60 108 28 92Z" fill="#283593" ${O}/><path d="M38 89l0 6M50 92l0 6M62 94l0 6M74 92l0 6M86 89l0 6" stroke="#C9A646" stroke-width="3"/><path d="M80 94L84 130L94 128L90 92Z" fill="#283593" ${O}/><path d="M82 104l9 -1M83 114l9 -1" stroke="#C9A646" stroke-width="3"/>`
  },
  {
    id: "feit_manto",
    p: "feiticeiro",
    slot: "top",
    name: "Manto estrelado",
    price: 120,
    svg: () => mantoFeit("#283593", "#E8C55A", true)
  },
  {
    id: "feit_tunica",
    p: "feiticeiro",
    slot: "top",
    name: "Túnica de aprendiz",
    price: 90,
    svg: () =>
      topBase("#795548") +
      `<path d="M46 86L60 104L74 86" fill="#D7CCC8" ${O}/><path d="M0 118H120" stroke="#5D4037" stroke-width="5"/><rect x="54" y="114" width="12" height="9" rx="2" fill="#C9A646" ${O} stroke-width="1.4"/>` +
      topHem
  },
  {
    id: "feit_manto_fogo",
    p: "feiticeiro",
    slot: "top",
    name: "Manto das chamas",
    price: 160,
    svg: () =>
      mantoFeit("#BF360C", "#FFCA28", false) +
      `<path d="M0 150Q10 130 20 144Q26 124 36 142Q44 126 52 146Q62 128 70 146Q78 126 86 142Q96 124 102 144Q112 130 120 150Z" fill="#FF7043" opacity=".85"/>`
  },
  {
    id: "feit_manto_gelo",
    p: "feiticeiro",
    slot: "top",
    name: "Manto de geada",
    price: 160,
    svg: () =>
      mantoFeit("#0277BD", "#E1F5FE", false) +
      [
        [24, 116],
        [96, 120],
        [40, 140],
        [84, 138]
      ]
        .map(
          ([x, y]) =>
            `<path d="M${x} ${y - 6}V${y + 6}M${x - 5} ${y - 3}L${x + 5} ${y + 3}M${x + 5} ${y - 3}L${x - 5} ${y + 3}" stroke="#E1F5FE" stroke-width="1.6"/>`
        )
        .join("")
  },
  {
    id: "feit_cinto",
    p: "feiticeiro",
    slot: "waist",
    name: "Cinto de pergaminhos",
    price: 70,
    svg: () =>
      `<path d="M8 126H112" stroke="#5D4037" stroke-width="6"/><rect x="28" y="120" width="8" height="18" rx="3" fill="#F3E5C0" ${O} stroke-width="1.2"/><rect x="82" y="120" width="8" height="18" rx="3" fill="#F3E5C0" ${O} stroke-width="1.2"/><circle cx="60" cy="126" r="4" fill="#C9A646" ${O} stroke-width="1.2"/>`
  },
  {
    id: "feit_broche",
    p: "feiticeiro",
    slot: "pins",
    name: "Broche de lua",
    price: 50,
    svg: () =>
      `<circle cx="38" cy="106" r="7" fill="#1A1B3A" ${O} stroke-width="1.4"/><path d="M40 101a5 5 0 1 0 3 8a4 4 0 1 1-3-8z" fill="#FFE082"/>`
  },
  {
    id: "feit_capa",
    p: "feiticeiro",
    slot: "back",
    name: "Capa flutuante",
    price: 140,
    svg: () =>
      `<path d="M22 84Q4 110 2 150H118Q116 110 98 84Q60 96 22 84Z" fill="#1A237E" ${O}/><path d="M22 84Q60 96 98 84" stroke="#C9A646" stroke-width="3" fill="none"/>`
  },
  {
    id: "feit_pulseira",
    p: "feiticeiro",
    slot: "wrist",
    name: "Pulseira de runas",
    price: 50,
    svg: () =>
      `<rect x="10" y="118" width="18" height="6" rx="3" fill="#C9A646" ${O} stroke-width="1.2"/><path d="M15 119v4M19 119l2 4M24 119v4" stroke="#1A237E" stroke-width="1"/>`
  },
  {
    id: "feit_varinha",
    p: "feiticeiro",
    slot: "hand",
    name: "Varinha",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-2 8L18 -26" stroke="#5D4037" stroke-width="3.4" stroke-linecap="round"/><path d="M-2 8L4 -2" stroke="#3E2723" stroke-width="4.2" stroke-linecap="round"/><g class="brilhinho">${estrelaFeit(19, -28, 4.2, "#FFE082")}</g>`
      )
  },
  {
    id: "feit_cajado",
    p: "feiticeiro",
    slot: "hand",
    name: "Cajado de cristal",
    price: 150,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M2 14L10 -40" stroke="#6D4C41" stroke-width="4" stroke-linecap="round"/><path d="M10 -40Q2 -46 6 -54M10 -40Q18 -46 14 -54" stroke="#6D4C41" stroke-width="2.4" fill="none"/><path d="M10 -56L15 -48L10 -38L5 -48Z" fill="#80DEEA" stroke="var(--ink)" stroke-width="1.4"/><circle class="brilhinho" cx="10" cy="-48" r="9" fill="#80DEEA" opacity=".3"/>`
      )
  },
  {
    id: "feit_grimorio",
    p: "feiticeiro",
    slot: "hand",
    name: "Grimório aberto",
    price: 120,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-14 -8Q-6 -12 0 -8Q6 -12 14 -8V8Q6 4 0 8Q-6 4 -14 8Z" fill="#F3E5C0" stroke="var(--ink)" stroke-width="1.6"/><path d="M0 -8V8" stroke="#8D6E63" stroke-width="1.2"/><path d="M-11 -4h8M-11 -1h7M3 -4h8M3 -1h6" stroke="#8D6E63" stroke-width=".8"/><circle cx="7" cy="3" r="2" fill="none" stroke="#3949AB" stroke-width=".8"/>`
      )
  },
  {
    id: "feit_bola",
    p: "feiticeiro",
    slot: "hand",
    name: "Bola de cristal",
    price: 130,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-9 8h18l-3 5h-12z" fill="#6D4C41" stroke="var(--ink)" stroke-width="1.4"/><circle cy="-2" r="10" fill="#B39DDB" fill-opacity=".55" stroke="var(--ink)" stroke-width="1.6"/><path d="M-5 -6q2-3 5-3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/><circle class="brilhinho" cx="2" cy="0" r="3" fill="#E1BEE7"/>`
      )
  },
  {
    id: "feit_coruja",
    p: "feiticeiro",
    slot: "pet",
    name: "Coruja sábia",
    price: 160,
    svg: () =>
      `<g transform="translate(15 126)"><path d="M-9 10Q-12 -10 0 -12Q12 -10 9 10Z" fill="#8D6E63" stroke="var(--ink)" stroke-width="1.1"/><path d="M-9 -9l-2 -6 6 3M9 -9l2 -6 -6 3" fill="#8D6E63" stroke="var(--ink)" stroke-width="1"/><circle cx="-4" cy="-4" r="3.6" fill="#FFF8E1" stroke="var(--ink)" stroke-width=".8"/><circle cx="4" cy="-4" r="3.6" fill="#FFF8E1" stroke="var(--ink)" stroke-width=".8"/><circle cx="-4" cy="-4" r="1.6" fill="#212121"/><circle cx="4" cy="-4" r="1.6" fill="#212121"/><path d="M-1 0l1 2 1 -2z" fill="#FFA000"/><path d="M-5 4q5 3 10 0" stroke="#5D4037" stroke-width="1" fill="none"/><rect x="-7" y="-15" width="14" height="3" fill="#1A1B3A"/><path d="M-4 -15l4 -4 4 4z" fill="#1A1B3A"/></g>`
  },
  {
    id: "feit_estrelinha",
    p: "feiticeiro",
    slot: "pet",
    name: "Estrelinha familiar",
    price: 120,
    svg: () =>
      `<g transform="translate(14 120)" class="brilhinho">${estrelaFeit(0, 0, 9, "#FFE082")}<circle cx="-2.5" cy="-1" r="1" fill="#3E2723"/><circle cx="2.5" cy="-1" r="1" fill="#3E2723"/><path d="M-2 2q2 2 4 0" stroke="#3E2723" stroke-width=".8" fill="none"/></g>`
  },
  {
    id: "feit_dragao",
    p: "feiticeiro",
    slot: "pet",
    name: "Dragãozinho",
    ach: "habito21",
    svg: () =>
      `<g transform="translate(16 126)"><path d="M-12 8Q-14 -6 -2 -8Q10 -10 10 2Q10 10 -12 8Z" fill="#43A047" stroke="var(--ink)" stroke-width="1.1"/><path d="M-4 -6Q-14 -18 -2 -16Q2 -10 -4 -6Z" fill="#81C784" stroke="var(--ink)" stroke-width=".9"/><circle cx="4" cy="-3" r="1.4" fill="#212121"/><path d="M9 -1q4 0 6 -2" stroke="#FF7043" stroke-width="1.6" stroke-linecap="round"/><path d="M-12 6Q-20 6 -18 -2" stroke="#43A047" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-6 -7l1 -3M-2 -8l1 -3" stroke="#2E7D32" stroke-width="1.2"/></g>`
  },
  {
    id: "feit_ceu",
    p: "feiticeiro",
    slot: "bg",
    name: "Céu estrelado",
    price: 150,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#1A237E" opacity=".55"/>` +
      [
        [12, 10],
        [30, 30],
        [100, 14],
        [86, 40],
        [14, 70],
        [106, 80],
        [20, 120],
        [104, 128]
      ]
        .map(
          ([x, y], i) =>
            `<g class="brilhinho" style="animation-delay:${i * 0.25}s">${estrelaFeit(x, y, 2 + (i % 3), "#FFF59D")}</g>`
        )
        .join("") +
      `<path d="M96 2a10 10 0 1 0 8 16a8 8 0 1 1-8-16z" fill="#FFF59D"/>`
  },
  {
    id: "feit_biblioteca",
    p: "feiticeiro",
    slot: "bg",
    name: "Biblioteca da torre",
    price: 170,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#4E342E" opacity=".4"/>` +
      [8, 44, 80]
        .map(
          y =>
            `<rect x="0" y="${y + 28}" width="120" height="3" fill="#3E2723" opacity=".6"/>` +
            Array.from(
              { length: 12 },
              (_, i) =>
                `<rect x="${2 + i * 10}" y="${y + 6 + (i % 3)}" width="7" height="${22 - (i % 3)}" fill="${["#7A1F2B", "#283593", "#2E7D32", "#B8862B"][i % 4]}" opacity=".55"/>`
            ).join("")
        )
        .join("")
  },
  {
    id: "feit_torre",
    p: "feiticeiro",
    slot: "bg",
    name: "Torre do arquimago",
    ach: "semana_agua",
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#283593" opacity=".35"/><path d="M92 148V40l8 -18 8 18V148Z" fill="#5C6BC0" opacity=".7"/><path d="M90 40h20l-10 -26z" fill="#1A237E" opacity=".8"/><rect class="pisca" x="97" y="60" width="6" height="8" fill="#FFE082"/><rect x="97" y="90" width="6" height="8" fill="#FFE082" opacity=".7"/>` +
      estrelaFeit(16, 14, 3, "#FFF59D") +
      estrelaFeit(40, 6, 2, "#FFF59D")
  },
  {
    id: "feit_robe_arquimago",
    p: "feiticeiro",
    slot: "top",
    name: "Robe de arquimago",
    price: 170,
    svg: () =>
      topBase("#1A1B3A") +
      `<path d="M42 84L60 110L78 84" fill="#E8C55A" ${O}/><path d="M50 90L60 102L70 90" fill="#1A1B3A"/><path d="M60 110V150" stroke="#E8C55A" stroke-width="3"/><path d="M0 144H120" stroke="#C9A646" stroke-width="4"/><g stroke="#E8C55A" stroke-width="1.6" fill="none"><circle cx="34" cy="120" r="4"/><circle cx="86" cy="120" r="4"/></g>` +
      topHem
  },
  {
    id: "feit_cajado_dragao",
    p: "feiticeiro",
    slot: "hand",
    name: "Cajado de dragão",
    price: 180,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M2 14L10 -42" stroke="#4E342E" stroke-width="4.2" stroke-linecap="round"/><path d="M6 -36Q12 -44 14 -52Q8 -48 4 -44" stroke="#D84315" stroke-width="3" fill="none"/><circle cx="12" cy="-48" r="4.5" fill="#FF8A65" stroke="#BF360C" stroke-width="1.2"/><g class="brilhinho">${estrelaFeit(12, -48, 5, "#FFE082")}</g>`
      )
  },
  {
    id: "feit_chapeu_lua",
    p: "feiticeiro",
    slot: "hat",
    name: "Chapéu de lua",
    price: 130,
    svg: () =>
      chapeuMago("#311B92", "#9575CD", false) +
      `<path d="M64 20a6 6 0 1 0 4 9a5 5 0 1 1-4-9z" fill="#FFF59D"/><g class="brilhinho">${estrelaFeit(50, 32, 2.6, "#FFE082")}</g>`
  },
  {
    id: "feit_oculos_alquimista",
    p: "feiticeiro",
    slot: "face",
    name: "Óculos de alquimista",
    price: 110,
    svg: () =>
      `<rect x="34" y="58" width="16" height="12" rx="3" fill="#FFE082" fill-opacity=".3" stroke="#8D6E63" stroke-width="2"/><rect x="64" y="58" width="16" height="12" rx="3" fill="#80DEEA" fill-opacity=".3" stroke="#8D6E63" stroke-width="2"/><path d="M50 64H64M34 64H28M80 64H86" stroke="#8D6E63" stroke-width="2"/>`
  },
  {
    id: "feit_fenix",
    p: "feiticeiro",
    slot: "pet",
    name: "Fênix",
    price: 180,
    svg: () =>
      `<g transform="translate(15 124)"><path d="M-10 10Q-14 -6 -2 -8Q8 -8 10 4Q8 10 -10 10Z" fill="#D84315" stroke="var(--ink)" stroke-width="1.1"/><path d="M-4 -8Q-2 -18 6 -12Q0 -8 -4 -8Z" fill="#FF7043" stroke="var(--ink)" stroke-width=".9"/><circle cx="4" cy="-4" r="1.5" fill="#FFE082"/><path d="M-10 4Q-18 6 -16 -2" stroke="#FF7043" stroke-width="2.5" fill="none"/><g class="brilhinho">${estrelaFeit(8, -12, 3, "#FFD54F")}</g></g>`
  },
  {
    id: "feit_gato_estrela",
    p: "feiticeiro",
    slot: "pet",
    name: "Gato-estrela",
    price: 170,
    svg: () =>
      `<g transform="translate(15 125)"><ellipse cx="0" cy="0" rx="9" ry="8" fill="#1A1B3A" stroke="var(--ink)" stroke-width="1.1"/><path d="M-7 -6L-9 -13L-2 -8M2 -8L9 -13L7 -6" fill="#1A1B3A" stroke="var(--ink)" stroke-width="1"/><circle cx="-3" cy="-1" r="1.4" fill="#FFE082"/><circle cx="3" cy="-1" r="1.4" fill="#FFE082"/><g class="brilhinho">${estrelaFeit(0, -2, 2.5, "#80D8FF")}</g></g>`
  },
  {
    id: "feit_golem_pedra",
    p: "feiticeiro",
    slot: "pet",
    name: "Golem de pedra",
    price: 160,
    svg: () =>
      `<g transform="translate(15 125)"><rect x="-9" y="-10" width="18" height="18" rx="4" fill="#78909C" stroke="var(--ink)" stroke-width="1.2"/><rect x="-5" y="-4" width="3" height="3" fill="#80DEEA"/><rect x="2" y="-4" width="3" height="3" fill="#80DEEA"/><path d="M-6 3h12" stroke="#37474F" stroke-width="1.4"/></g>`
  },
  {
    id: "feit_manto_galaxia",
    p: "feiticeiro",
    slot: "top",
    name: "Manto de galáxia",
    price: 220,
    svg: () =>
      topBase("#0B071A") +
      `<path d="M20 90Q60 120 100 90L92 150H28Z" fill="#311B92" opacity=".7"/>` +
      `<circle cx="40" cy="110" r="14" fill="#7C4DFF" opacity=".35" class="brilhinho"/>` +
      `<circle cx="78" cy="126" r="16" fill="#00E5FF" opacity=".25" class="brilhinho"/>` +
      estrelaFeit(32, 102, 3, "#FFF59D") +
      estrelaFeit(84, 116, 2.5, "#80D8FF") +
      estrelaFeit(54, 134, 3.4, "#E1BEE7") +
      topHem
  },
  {
    id: "feit_coroa_cometas",
    p: "feiticeiro",
    slot: "hat",
    name: "Coroa de cometas",
    price: 190,
    svg: () =>
      `<path d="M24 44L32 18L44 32L60 10L76 32L88 18L96 44Z" fill="#CA8A04" ${O}/>` +
      `<path d="M32 18L18 8" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M60 10L60 -4" stroke="#FFF59D" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="M88 18L102 8" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>` +
      `<circle cx="60" cy="38" r="4" fill="#67E8F9" class="brilhinho"/>`
  },
  {
    id: "feit_manto_solsticio",
    p: "feiticeiro",
    slot: "top",
    name: "Manto do Solstício Solar",
    price: 0,
    svg: () =>
      topBase("#F59E0B") +
      `<path d="M42 84L60 114L78 84" fill="#FEF08A" ${O}/>` +
      `<circle cx="60" cy="114" r="6" fill="#F97316"/>` +
      `<path d="M20 120Q60 145 100 120L94 150H26Z" fill="#D97706" opacity=".8"/>` +
      estrelaFeit(60, 114, 4, "#FEF08A") +
      topHem
  }
);
