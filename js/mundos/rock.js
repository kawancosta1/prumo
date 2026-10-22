/*
  Mundo Roqueiro: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.rock = {
  name: "Roqueiro",
  desc: "Barulhento, intenso e cheio de energia. Vive em turnê e toca no Expert.",
  sad: "Cadê você? O show não pode parar! A plateia tá vaiando...",
  placeholder: "Qual é a próxima música da setlist?",
  starter: ["bandana", "couro"],
  hi: [
    "E aí{nome}! Hoje são <b>{n}</b> tarefas. Bora fazer esse dia tocar alto!",
    "Passagem de som feita{nome}. <b>{n}</b> músicas na setlist de hoje.",
    "Som na caixa{nome}! <b>{n}</b> tarefas e a galera esperando o primeiro acorde.",
    "Bem-vindo à turnê{nome}. Show de hoje: <b>{n}</b> tarefas, dificuldade Expert."
  ],
  cheers: [
    "Isso é rock'n'roll!",
    "Mandou um solo de guitarra nessa!",
    "Riscou! A plateia vai à loucura!",
    "Nota perfeita! Sequência subindo.",
    "Acertou o acorde. Multiplicador ligado!",
    "Isso aí! Mais uma estrela no show.",
    "Hammer-on de produtividade. Que técnica!",
    "A galera acendeu os isqueiros pra essa."
  ],
  drink: [
    "Hidratação é o roadie da vida. <b>+{ml} mL</b>!",
    "<b>+{ml} mL</b>. Garganta molhada, grito mais alto!",
    "Gole entre as músicas: <b>+{ml} mL</b>. Profissional.",
    "<b>+{ml} mL</b> de água elétrica. Volume no máximo!"
  ],
  goal: [
    "Meta de água batida! Bis! Bis!",
    "Taça cheia! Isso merece um solo de bateria.",
    "Hidratado no Expert. Cinco estrelas!"
  ],
  thirsty: [
    "Garganta seca não canta! Faltam <b>{ml} mL</b> pro ritmo.",
    "Tô desafinando de sede. Faltam <b>{ml} mL</b>.",
    "O roadie pediu água: faltam <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> atrasadas? Até banda boa atrasa o show. Bora subir no palco!",
    "<b>{n}</b> notas perdidas. Ainda dá pra salvar a música!",
    "O medidor tá no vermelho: <b>{n}</b> atrasadas. Toca elas agora!"
  ],
  night: [
    "Fim de show! Fecha o dia e descansa as cordas vocais.",
    "Luzes do palco apagando. Encerra o show e dorme, rockstar."
  ],
  done: [
    "Turnê do dia completa! Lendário.",
    "Você arrasou! Cinco estrelas e plateia de pé.",
    "Setlist inteira tocada. Bis amanhã!"
  ],
  focus: [
    "Modo estúdio: gravando sem distração.",
    "Passagem de som. Foco no metrônomo.",
    "Ensaio fechado: nem o empresário entra."
  ]
};

THEMES.rock = {
  font: '"Metal Mania"',
  ds: 1,
  L: ["#E9E7E2", "#FFFFFF", "#151515", "#D9480F", "#1E7FD6", "#F7F7F5"],
  D: ["#0F0F10", "#1A1A1C", "#F0EEE9", "#FFB020", "#3FA9FF", "#26262A"],
  pat: ["bolt", "star"],
  water: { name: "Água elétrica", spd: 1.5, amp: 7, part: "bolt" },
  /*
    Sub-temas por era do rock. Cada um pode trocar: a (destaque), w (água), L/D (cores inteiras), f (fonte),
    part (o que flutua na água), wn (nome da água) e pat (desenhos do fundo).
    A decoração de cada um fica em estilos/mundos/rock.css, com html[data-variante="<id>"].
  */
  vars: [
    { id: "base", name: "Palco" },
    { id: "neon", name: "Neon", price: 120, a: ["#B0179E", "#FF4FD8"] },
    {
      id: "heroi",
      name: "Herói da guitarra",
      price: 160,
      f: '"Bungee"',
      ds: 0.82,
      L: ["#E8ECF7", "#FFFFFF", "#0E1230", "#2F6FD6", "#1E7FD6", "#FFFFFF"],
      D: ["#070A1C", "#10163A", "#E8ECFF", "#4FA3FF", "#3FA9FF", "#1B2350"],
      part: "star",
      wn: "Star Power",
      pat: ["star", "bolt"]
    },
    {
      id: "setentas",
      name: "Anos 70",
      price: 120,
      f: '"Righteous"',
      ds: 0.95,
      L: ["#F4E9D8", "#FFFAF0", "#3A2414", "#C2541A", "#D98A1E", "#FFF5E6"],
      D: ["#1E140C", "#2A1C12", "#F4E2C8", "#F08A3C", "#E8A33A", "#3A2818"],
      part: "flag",
      wn: "Água psicodélica",
      pat: ["star", "heart"]
    },
    {
      id: "glam",
      name: "Glam 80",
      price: 140,
      f: '"Bowlby One"',
      ds: 0.8,
      L: ["#F7E8F7", "#FFFFFF", "#2A0F2E", "#D42A9C", "#7A3FD9", "#FFFFFF"],
      D: ["#140818", "#22102A", "#FBE6FB", "#FF4FD8", "#B07AFF", "#2E1838"],
      part: "spark",
      wn: "Spray de laquê (é água)",
      pat: ["star", "spark"]
    },
    {
      id: "punk",
      name: "Punk",
      price: 120,
      f: '"Permanent Marker"',
      ds: 0.95,
      L: ["#F2EFE6", "#FFFFFF", "#111111", "#E8337A", "#1E1F24", "#F7F7F5"],
      D: ["#0C0C0C", "#181818", "#F2F2F2", "#FF4FA0", "#F2E14E", "#222222"],
      a: ["#E8337A", "#FF4FA0"],
      wn: "Água sem regras",
      pat: ["bolt", "star"]
    },
    {
      id: "grunge",
      name: "Grunge 90",
      price: 110,
      f: '"Oswald"',
      ds: 0.95,
      L: ["#E4E2DA", "#F7F6F1", "#22251E", "#5A6B3A", "#4A6A7A", "#F2F1EC"],
      D: ["#141612", "#1E211B", "#E6E8DE", "#9AB06A", "#6A93A6", "#2A2E24"],
      part: "ripple",
      wn: "Chuva de garagem",
      pat: ["leaf", "ripple"]
    },
    {
      id: "metal",
      name: "Heavy metal",
      price: 150,
      L: ["#E6E6E6", "#FAFAFA", "#0E0E0E", "#8C8C96", "#5A6A7A", "#F2F2F2"],
      D: ["#060606", "#121214", "#EDEDED", "#C9CED6", "#7A8A9A", "#1E1E22"],
      a: ["#5A5A64", "#C9CED6"],
      wn: "Metal líquido",
      pat: ["bolt", "bolt"]
    },
    {
      id: "nacional",
      name: "Rock nacional",
      price: 120,
      f: '"Anton"',
      ds: 0.9,
      L: ["#EEF4E6", "#FFFFFF", "#132413", "#1C8350", "#F2C14E", "#FFFFFF"],
      D: ["#0A140C", "#122016", "#E8F4E6", "#3FC27A", "#F2C14E", "#1C2E20"],
      part: "note",
      wn: "Água de festival",
      pat: ["note", "star"]
    },
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
