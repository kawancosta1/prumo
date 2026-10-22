/*
  Mundo Emo: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.emo = {
  name: "Emo",
  desc: "Sensível, dramático, meio vampiro e leal até o fim.",
  sad: "Você me esqueceu... igual todo mundo esquece.",
  placeholder: "O que fazer antes do sol nascer?",
  starter: ["franja", "moletom_preto"],
  hi: [
    "Oi{nome}... mais um dia nesse mundo cinza. Mas tem <b>{n}</b> tarefas, então vamos.",
    "Boa noite{nome}. Ou bom dia, tanto faz, o sol me odeia. <b>{n}</b> tarefas hoje.",
    "Acordei do caixão{nome}. <b>{n}</b> tarefas nos esperam nessa escuridão.",
    "O desfile começa agora{nome}: <b>{n}</b> tarefas e muito drama."
  ],
  cheers: [
    "Uma a menos. Meu coração sombrio sorriu por um segundo.",
    "Feito. Até eu tô menos triste agora.",
    "Riscou! Isso merece uma música acústica no escuro.",
    "Concluída. Nem a morte me impede de ser produtivo.",
    "Mais uma. Vou escrever um poema sobre isso.",
    "Feito com sangue, suor e delineado.",
    "Feito! =] (não se acostuma, eu continuo triste)",
    "XD riscou! Meu coração de vampiro bateu uma vez.",
    'Rawr! Isso quer dizer "mandou bem" em morceguês <3'
  ],
  drink: [
    "Glub... hoje é água, mas eu finjo que é vinho. <b>+{ml} mL</b>.",
    "A água é a única que me entende. <b>+{ml} mL</b>.",
    "<b>+{ml} mL</b>. Vampiro hidratado é vampiro feliz (ou quase).",
    "Bebi <b>{ml} mL</b> de lágrimas filtradas.",
    "<b>+{ml} mL</b> =] pelo menos a água não me abandona."
  ],
  goal: [
    "Meta de água batida. Tô cheio... de água e de sentimentos.",
    "Nem um vampiro é tão hidratado quanto eu hoje.",
    "Taça cheia. Brindemos à escuridão (com água)."
  ],
  thirsty: [
    "Tô secando igual meu coração. Faltam <b>{ml} mL</b> pro ritmo.",
    "Até vampiro bebe alguma coisa. Faltam <b>{ml} mL</b>.",
    "Minhas lágrimas acabaram. Repõe aí: <b>{ml} mL</b>."
  ],
  late: [
    "<b>{n}</b> atrasadas... ninguém entende a minha dor. Bora resolver?",
    "<b>{n}</b> tarefas assombrando a lista. Vamos exorcizar?",
    "affs... <b>{n}</b> atrasadas viraram fantasminhas =("
  ],
  night: [
    "A noite chegou, minha hora favorita. Fecha o dia e descansa.",
    "Lua cheia lá fora. Fecha o dia e volta pro caixão."
  ],
  done: [
    "Tudo feito. Talvez a vida não seja tão ruim assim.",
    "Lista vazia. Pela primeira vez, o vazio é bom."
  ],
  focus: ["Fones no ouvido, mundo lá fora. Foco.", "Concentração de vampiro: nem a luz do sol me distrai."]
};

THEMES.emo = {
  font: '"Pirata One"',
  ds: 1.08,
  L: ["#E9E5EB", "#FFFFFF", "#141016", "#A3102A", "#5B2E7A", "#F6F3F8"],
  D: ["#0B090D", "#161219", "#EDE6EE", "#E0314F", "#8A55B5", "#D6CEDD", "#141016"],
  pat: ["bat", "heartb"],
  water: { name: "Lágrimas", spd: 4.8, amp: 3, part: "tear" },
  /*
    Sub-temas por era. Cada um pode trocar: a (destaque), w (água), L/D (cores inteiras), f (fonte),
    part (o que flutua na água), wn (nome da água) e pat (desenhos do fundo).
    A decoração extra de cada um fica em estilos/mundos/emo.css, com html[data-variante="<id>"].
  */
  vars: [
    { id: "base", name: "Desfile negro" },
    {
      id: "vinho",
      name: "Vinho tinto",
      price: 120,
      a: ["#6E0F24", "#C2304E"],
      w: ["#5C0A1E", "#9E1636"],
      part: "drop",
      wn: "Vinho tinto (é água, juro)",
      pat: ["drop", "bat"]
    },
    {
      id: "caderno",
      name: "Caderno de escola",
      price: 100,
      f: '"Permanent Marker"',
      ds: 0.95,
      L: ["#F4F1E6", "#FFFEF9", "#1E2235", "#2B2B6E", "#5B6FC2", "#FFFFFF"],
      a: ["#2B2B6E", "#8C8CFF"],
      wn: "Tinta de caneta",
      pat: ["star", "heartb"]
    },
    {
      id: "scene",
      name: "Scene colorido",
      price: 140,
      f: '"Bungee"',
      ds: 0.8,
      L: ["#FFF0FA", "#FFFFFF", "#1A1024", "#D0137A", "#18A8DC", "#FFFFFF"],
      D: ["#0F0A14", "#1A1022", "#FFE8F7", "#FF4FD8", "#4FE3FF", "#2A1A35"],
      part: "star",
      wn: "Água neon",
      pat: ["star", "heartb"]
    },
    {
      id: "gotico",
      name: "Gótico 80",
      price: 120,
      a: ["#3A3A44", "#C9C3D6"],
      w: ["#2E2E38", "#5C5C70"],
      wn: "Neblina",
      pat: ["bat", "bat"]
    },
    {
      id: "vitoriano",
      name: "Vampiro vitoriano",
      price: 160,
      f: '"Cormorant Garamond"',
      ds: 1.15,
      L: ["#F3ECE9", "#FFFBFA", "#2A0F15", "#7A0F24", "#5C0A1E", "#FBF6F5"],
      D: ["#0E0709", "#1A0E12", "#F0E2E6", "#C2304E", "#8A1F38", "#E6D8DC", "#1A0E12"],
      part: "drop",
      wn: "Sangue nobre (é água)",
      pat: ["heartb", "drop"]
    },
    {
      id: "praca",
      name: "Emo de praça",
      price: 100,
      f: '"Permanent Marker"',
      ds: 0.95,
      a: ["#B3122E", "#FF4F6E"],
      wn: "Água do bebedouro",
      pat: ["heartb", "star"]
    },
    { id: "lenda", name: "Cinzas", ach: "nivel5", a: ["#4A4A52", "#B9B9C4"], w: ["#2E2E38", "#6C6C80"] }
  ]
};

ITEMS.push(
  /* EMO */
  {
    id: "franja",
    p: "emo",
    slot: "hair",
    name: "Franja emo",
    price: 80,
    svg: () =>
      `<path d="M21 55Q22 21 60 20Q95 21 99 50Q91 44 85 53Q79 67 66 77Q73 61 66 51Q50 41 34 47Q25 49 21 55Z" fill="#1E1F24" ${O}/><path d="M76 34Q86 40 88 48" stroke="#6E58C8" stroke-width="3" fill="none" stroke-linecap="round"/>`
  },

  {
    id: "emo_franja_vermelha",
    p: "emo",
    slot: "hair",
    name: "Franja com mecha",
    price: 110,
    svg: () =>
      `<path d="M21 55Q22 21 60 20Q95 21 99 50Q91 44 85 53Q79 67 66 77Q73 61 66 51Q50 41 34 47Q25 49 21 55Z" fill="#1E1F24" ${O}/><path d="M70 26Q84 32 86 52Q80 62 72 70" stroke="#C8102E" stroke-width="5" fill="none" stroke-linecap="round"/>`
  },

  {
    id: "emo_gorro",
    p: "emo",
    slot: "hat",
    name: "Gorro listrado",
    price: 80,
    svg: () => beanie("#1E1F24", "#1E1F24", "#C8102E")
  },

  {
    id: "emo_delineado",
    p: "emo",
    slot: "face",
    name: "Delineado",
    price: 60,
    svg: () =>
      `<path d="M40 60.5Q47 55.5 54 59.5L58 56" fill="none" stroke="#111" stroke-width="2.8" stroke-linecap="round"/><path d="M80 60.5Q73 55.5 66 59.5L62 56" fill="none" stroke="#111" stroke-width="2.8" stroke-linecap="round"/><path d="M42 69Q47 71.5 52 69M68 69Q73 71.5 78 69" fill="none" stroke="#111" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`
  },

  {
    id: "emo_cadeado",
    p: "emo",
    slot: "neck",
    name: "Corrente com cadeado",
    price: 90,
    svg: () =>
      chainN(
        "#9AA3AD",
        2.8,
        `<path d="M56 97V93a4 4 0 0 1 8 0v4" fill="none" stroke="#6E747E" stroke-width="2"/><rect x="53.5" y="96" width="13" height="10" rx="2" fill="#B8BEC6" ${O} stroke-width="1.6"/><circle cx="60" cy="100.5" r="1.4" fill="#222"/>`
      )
  },

  {
    id: "moletom_preto",
    p: "emo",
    slot: "top",
    name: "Moletom preto",
    price: 110,
    svg: () => hoodie("#26272C")
  },

  {
    id: "emo_caveira",
    p: "emo",
    slot: "top",
    name: "Camiseta caveirinha",
    price: 100,
    svg: () =>
      tee(
        "#1E1F24",
        `<circle cx="60" cy="108" r="7.5" fill="#EEE"/><rect x="55.5" y="112" width="9" height="6" rx="1.5" fill="#EEE"/><circle cx="57" cy="107.5" r="2" fill="#1E1F24"/><circle cx="63" cy="107.5" r="2" fill="#1E1F24"/><path d="M58 116v2M60 116v2M62 116v2" stroke="#1E1F24" stroke-width=".9"/>`
      )
  },

  {
    id: "emo_listrado",
    p: "emo",
    slot: "top",
    name: "Blusa listrada",
    price: 100,
    svg: () => topBase("#1E1F24") + stripesH("#C8102E", 10, 4, 92) + topHem
  },

  {
    id: "emo_caderno",
    p: "emo",
    slot: "hand",
    name: "Caderno de poesia",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-9" y="-12" width="18" height="23" rx="2" fill="#1E1F24" ${O} stroke-width="1.8"/><path d="M0 4l-4.2-4a2.6 2.6 0 0 1 4.2-3 2.6 2.6 0 0 1 4.2 3z" fill="#C8102E"/>`
      )
  },

  {
    id: "emo_desfile",
    p: "emo",
    slot: "top",
    name: "Jaqueta de desfile",
    ach: "produtivo",
    svg: () =>
      topBase("#141418") +
      `<path d="M18 88L102 140" stroke="#C8102E" stroke-width="9"/><path d="M52 90V150M68 90V150" stroke="#F2F2F2" stroke-width="2"/>${[100, 112, 124, 136].map(y => `<circle cx="46" cy="${y}" r="2" fill="#E8C24A"/><circle cx="74" cy="${y}" r="2" fill="#E8C24A"/>`).join("")}<path d="M22 86L34 92M98 86L86 92" stroke="#E8C24A" stroke-width="3"/>` +
      topHem
  },

  {
    id: "emo_guarda_chuva",
    p: "emo",
    slot: "hand",
    name: "Guarda-chuva preto",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 -4V14Q0 18 -4 17" fill="none" stroke="#333" stroke-width="2.2" stroke-linecap="round"/><path d="M-17 -4Q-15 -20 0 -21Q15 -20 17 -4Q14 -7 11.3 -4Q8.5 -7 5.6 -4Q2.8 -7 0 -4Q-2.8 -7 -5.6 -4Q-8.5 -7 -11.3 -4Q-14 -7 -17 -4Z" fill="#1E1F24" ${O} stroke-width="1.8"/>`
      )
  },

  /* chapéus */
  {
    id: "emo_cartola",
    p: "emo",
    slot: "hat",
    name: "Cartola com rosa",
    price: 160,
    svg: () =>
      `<rect x="44" y="0" width="32" height="34" rx="3" fill="#18181C" ${O}/><rect x="44" y="24" width="32" height="6" fill="#7A0F24"/><ellipse cx="60" cy="35" rx="31" ry="6" fill="#18181C" ${O}/>` +
      rose(77, 27, 5)
  },

  {
    id: "emo_espinhos",
    p: "emo",
    slot: "hat",
    name: "Coroa de espinhos",
    price: 120,
    svg: () =>
      `<path d="M26 41Q60 25 94 41" stroke="#2A2A2E" stroke-width="4" fill="none"/><path d="M27 37Q60 30 93 37" stroke="#3A3A40" stroke-width="3" fill="none"/>` +
      [
        [32, 36, -30],
        [42, 31, -15],
        [52, 28, -5],
        [62, 28, 8],
        [72, 29, 15],
        [82, 32, 25],
        [90, 36, 35]
      ]
        .map(
          ([x, y, a]) =>
            `<path d="M${x - 2} ${y}L${x} ${y - 7}L${x + 2} ${y}Z" fill="#2A2A2E" transform="rotate(${a} ${x} ${y})"/>`
        )
        .join("") +
      `<circle cx="45" cy="34" r="1.6" fill="#B00020"/>`
  },

  {
    id: "emo_laco",
    p: "emo",
    slot: "hat",
    name: "Laço preto",
    price: 70,
    svg: () =>
      `<path d="M74 27L90 16Q97 26 90 36Z" fill="#141416" ${O}/><path d="M74 27L58 16Q51 26 58 36Z" fill="#141416" ${O}/><circle cx="74" cy="27" r="4.6" fill="#7A0F24" ${O}/>`
  },

  {
    id: "emo_tiara_morcego",
    p: "emo",
    slot: "hat",
    name: "Tiara de morcego",
    price: 90,
    svg: () =>
      `<path d="M25 45Q60 21 95 45" fill="none" stroke="#141416" stroke-width="4.5" stroke-linecap="round"/>` +
      bat(60, 22, 1.35) +
      `<circle cx="57.5" cy="21" r=".9" fill="#E0102E"/><circle cx="62.5" cy="21" r=".9" fill="#E0102E"/>`
  },

  /* cabelo */
  {
    id: "emo_cabelo_vermelho",
    p: "emo",
    slot: "hair",
    name: "Cabelo vermelho de palco",
    price: 150,
    svg: () =>
      `<path d="M25 47Q14 60 20 76Q25 64 31 57Z" fill="#C4161C" ${O}/><path d="M95 47Q106 60 100 76Q95 64 89 57Z" fill="#C4161C" ${O}/>` +
      hairMessy("#C4161C") +
      `<path d="M44 22Q52 18 58 20" stroke="#FF6B5E" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>`
  },

  {
    id: "emo_armado",
    p: "emo",
    slot: "hair",
    name: "Cabelo armado gótico",
    price: 150,
    svg: () =>
      `<path d="M18 57Q5 41 15 31L5 19L23 22L19 6L35 16L39 0L51 12L60 -5L69 12L81 0L85 16L101 6L97 22L115 19L105 31Q115 41 102 57Q92 40 60 37Q28 40 18 57Z" fill="#141416" ${O}/><path d="M30 22L38 30M86 20L80 30M58 4L60 14" stroke="#3A3A44" stroke-width="2" stroke-linecap="round"/>`
  },

  {
    id: "emo_franja_platinada",
    p: "emo",
    slot: "hair",
    name: "Franja platinada",
    price: 120,
    svg: () => emoBangs("#EDE6D6", "#1E1F24")
  },

  {
    id: "emo_franja_azul",
    p: "emo",
    slot: "hair",
    name: "Franja azul-noite",
    price: 110,
    svg: () => emoBangs("#23306B", "#7FA2FF")
  },

  /* olhos */
  {
    id: "emo_borrado",
    p: "emo",
    slot: "face",
    name: "Delineado borrado",
    price: 80,
    svg: m =>
      `<ellipse cx="47" cy="64" rx="10" ry="8" fill="#141416" opacity=".42"/><ellipse cx="73" cy="64" rx="10" ry="8" fill="#141416" opacity=".42"/><path d="M44 71Q43 77 45 82M76 71Q78 76 76 80" stroke="#141416" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/>`
  },

  {
    id: "emo_lentes",
    p: "emo",
    slot: "face",
    name: "Olhos de vampiro",
    price: 130,
    svg: m =>
      closedEyes(m)
        ? ""
        : [47, 73]
            .map(
              x =>
                `<circle cx="${x}" cy="64" r="4.6" fill="#E0102E" stroke="#5A0010" stroke-width="1"/><ellipse cx="${x}" cy="64" rx="1.1" ry="3.4" fill="#111"/><circle cx="${x + 1.6}" cy="62" r="1" fill="#fff" opacity=".85"/>`
            )
            .join("")
  },

  {
    id: "emo_mascara",
    p: "emo",
    slot: "face",
    name: "Máscara de baile",
    price: 140,
    svg: () =>
      `<path fill-rule="evenodd" d="M30 60Q32 52 46 55Q54 57 60 60Q66 57 74 55Q88 52 90 60Q90 72 78 73Q68 74 60 66Q52 74 42 73Q30 72 30 60ZM47 58.5A6 5 0 1 0 47.01 58.5ZM73 58.5A6 5 0 1 0 73.01 58.5Z" fill="#141416" stroke="#7A0F24" stroke-width="1.8"/><path d="M89 58Q100 44 98 32Q94 46 87 55Z" fill="#7A0F24" ${O} stroke-width="1.2"/>`
  },

  {
    id: "emo_coracao_preto",
    p: "emo",
    slot: "face",
    name: "Óculos coração preto",
    price: 90,
    svg: () =>
      [47, 73]
        .map(
          x =>
            `<path d="M${x} 73.5l-9-8.6a5.2 5.2 0 0 1 9-5.4 5.2 5.2 0 0 1 9 5.4z" fill="#141416" ${O}/><path d="M${x - 6} 63.5q1.5-2.5 3.5-2" stroke="#fff" stroke-width="1.4" fill="none" opacity=".6" stroke-linecap="round"/>`
        )
        .join("") + `<path d="M56 63H64" ${O}/>`
  },

  /* maquiagem */
  {
    id: "emo_olheiras",
    p: "emo",
    slot: "cheek",
    name: "Olheiras roxas",
    price: 40,
    svg: () =>
      `<path d="M41 70.5Q47 74.5 53 70.5M67 70.5Q73 74.5 79 70.5" fill="none" stroke="#6E4FA0" stroke-width="2.6" stroke-linecap="round" opacity=".75"/>`
  },

  {
    id: "emo_estrela_rosto",
    p: "emo",
    slot: "cheek",
    name: "Estrela na bochecha",
    price: 50,
    svg: () => star5(85, 74, 5, "#141416")
  },

  {
    id: "emo_coracao_partido",
    p: "emo",
    slot: "cheek",
    name: "Coração partido",
    price: 60,
    svg: () =>
      `<g transform="translate(35 75)"><path d="M0 5L-5 0.4A2.9 2.9 0 0 1 -0.3 -3.4L0.8 -1.2L-0.8 0.8L0.6 2.4Z" fill="#C8102E"/><path d="M0.9 5.2L1.9 2.4L0.5 0.8L2.1 -1.2L1.1 -3.2A2.9 2.9 0 0 1 5.6 0.4Z" fill="#C8102E"/></g>`
  },

  {
    id: "emo_lagrima_preta",
    p: "emo",
    slot: "cheek",
    name: "Lágrima de rímel",
    price: 60,
    svg: () =>
      `<path d="M44 70Q42 76 44.5 81Q46 86 43.5 92" fill="none" stroke="#141416" stroke-width="2.2" stroke-linecap="round"/><path d="M43.5 91Q46.5 95 43.5 97.5Q40.5 95 43.5 91Z" fill="#141416"/>`
  },

  {
    id: "emo_teia_rosto",
    p: "emo",
    slot: "cheek",
    name: "Teia no rosto",
    price: 60,
    svg: () =>
      `<g stroke="#141416" stroke-width="1" fill="none" opacity=".8"><path d="M95 54L83 66M95 54L85 58M95 54L88 70M95 54L80 61"/><path d="M89 57.5Q87 61 85.5 63.5M86 61Q84.5 63 83 64.5M91 62Q89.5 64.5 87 67"/></g>`
  },

  /* boca */
  { id: "emo_presas", p: "emo", slot: "mouth", name: "Presinhas", price: 80, svg: m => fangs(m, false) },

  {
    id: "emo_presas_sangue",
    p: "emo",
    slot: "mouth",
    name: "Presinhas com sangue",
    price: 110,
    svg: m => fangs(m, true)
  },

  {
    id: "emo_batom_preto",
    p: "emo",
    slot: "mouth",
    name: "Batom preto",
    price: 60,
    svg: m => lips(m, "#141416")
  },

  {
    id: "emo_batom_borrado",
    p: "emo",
    slot: "mouth",
    name: "Batom vermelho borrado",
    price: 90,
    svg: m =>
      `<ellipse cx="60" cy="${(mouthAt(m) || { y: 79 }).y + 1}" rx="11" ry="5.5" fill="#C8102E" opacity=".28"/>` +
      lips(m, "#C8102E", 6, 0.9)
  },

  {
    id: "emo_snakebites",
    p: "emo",
    slot: "mouth",
    name: "Piercing snakebite",
    price: 80,
    svg: m => {
      const a = mouthAt(m) || { y: 79 };
      const y = a.open ? 84 : a.y + 5.4;
      return `<circle cx="54" cy="${y}" r="2.4" fill="none" stroke="#C9CED6" stroke-width="1.6"/><circle cx="66" cy="${y}" r="2.4" fill="none" stroke="#C9CED6" stroke-width="1.6"/>`;
    }
  },

  /* pele */
  {
    id: "emo_pele_palida",
    p: "emo",
    slot: "skin",
    name: "Pálido vampiro",
    price: 60,
    color: "#F1EDF0",
    ink: "#141416"
  },

  {
    id: "emo_pele_cinza",
    p: "emo",
    slot: "skin",
    name: "Cinza tumular",
    price: 80,
    color: "#A9A7B0",
    ink: "#141416"
  },

  {
    id: "emo_pele_lilas",
    p: "emo",
    slot: "skin",
    name: "Lilás",
    price: 80,
    color: "#CDB8E8",
    ink: "#1E1428"
  },

  {
    id: "emo_pele_porcelana",
    p: "emo",
    slot: "skin",
    name: "Porcelana",
    price: 100,
    color: "#FFFFFF",
    ink: "#141416"
  },

  /* pescoço */
  {
    id: "emo_veludo",
    p: "emo",
    slot: "neck",
    name: "Gargantilha de veludo",
    price: 70,
    svg: () =>
      `<path d="M30 83Q60 99 90 83" fill="none" stroke="#141416" stroke-width="5" stroke-linecap="round"/><path d="M60 89L64 93L60 99L56 93Z" fill="#B00020" ${O} stroke-width="1.2"/>`
  },

  {
    id: "emo_colar_morcego",
    p: "emo",
    slot: "neck",
    name: "Colar de morcego",
    price: 80,
    svg: () => chainN("#9AA3AD", 2.2) + bat(60, 100, 0.62, "#141416")
  },

  {
    id: "emo_colar_caveira",
    p: "emo",
    slot: "neck",
    name: "Colar de caveira",
    price: 80,
    svg: () =>
      chainN(
        "#9AA3AD",
        2.2,
        `<circle cx="60" cy="99" r="5" fill="#EEE" ${O} stroke-width="1.2"/><rect x="57" y="102" width="6" height="4" rx="1" fill="#EEE" ${O} stroke-width="1"/><circle cx="58.2" cy="98.8" r="1.3" fill="#141416"/><circle cx="61.8" cy="98.8" r="1.3" fill="#141416"/>`
      )
  },

  {
    id: "emo_gravata_vermelha",
    p: "emo",
    slot: "neck",
    name: "Gravata vermelha fina",
    price: 70,
    svg: () => `<path d="M57 86L63 86L61.5 91L64 120L60 127L56 120L58.5 91Z" fill="#C8102E" ${O}/>`
  },

  /* roupas */
  {
    id: "emo_helena",
    p: "emo",
    slot: "top",
    name: "Camisa preta social",
    price: 140,
    svg: () =>
      topBase("#141416") +
      `<path d="M47 86L58 97L60 89Z" fill="#2A2A30" ${O}/><path d="M73 86L62 97L60 89Z" fill="#2A2A30" ${O}/><path d="M57.5 95L62.5 95L61.5 99L63.5 128L60 134L56.5 128L58.5 99Z" fill="#C8102E"/><rect x="2" y="108" width="12" height="10" fill="#C8102E"/><circle cx="8" cy="113" r="3" fill="#EEE"/>` +
      topHem
  },

  {
    id: "emo_sueter",
    p: "emo",
    slot: "top",
    name: "Suéter largão",
    price: 120,
    svg: () =>
      topBase("#1B1B1F") +
      `<path d="M38 86Q60 104 82 86" fill="none" stroke="#2E2E36" stroke-width="5"/>` +
      [24, 32, 40, 48, 56, 64, 72, 80, 88, 96]
        .map(x => `<path d="M${x} 138V150" stroke="#2E2E36" stroke-width="2.4"/>`)
        .join("") +
      `<path d="M30 112Q34 120 30 128M90 106Q86 114 91 122" stroke="#2E2E36" stroke-width="1.6" fill="none"/>` +
      topHem
  },

  {
    id: "emo_tartan",
    p: "emo",
    slot: "top",
    name: "Xadrez vermelho e preto",
    price: 110,
    svg: () => plaid("#7A0F24", "rgba(0,0,0,.5)")
  },

  {
    id: "emo_patches",
    p: "emo",
    slot: "top",
    name: "Jaqueta com patches",
    price: 180,
    svg: () =>
      jacket("#1F1F23", "#C8102E", "#2E2E34") +
      `<rect x="18" y="104" width="13" height="13" rx="2" fill="#E8E2EC" ${O} stroke-width="1.2"/><path d="M24.5 107L26 110.5L29.5 111L27 113L27.5 116.5L24.5 114.8L21.5 116.5L22 113L19.5 111L23 110.5Z" fill="#141416"/><circle cx="88" cy="112" r="7" fill="#C8102E" ${O} stroke-width="1.2"/><path d="M85 109L91 115M91 109L85 115" stroke="#fff" stroke-width="2"/><rect x="78" y="128" width="16" height="8" rx="1.5" fill="#6E4FA0" ${O} stroke-width="1.2"/>`
  },

  {
    id: "emo_arrastao",
    p: "emo",
    slot: "top",
    name: "Blusa arrastão",
    price: 90,
    svg: () =>
      topBase("#1B1B1F") +
      Array.from(
        { length: 14 },
        (_, i) =>
          `<path d="M${i * 10 - 10} 84L${i * 10 + 50} 150M${i * 10 + 10} 84L${i * 10 - 50} 150" stroke="#8C8A96" stroke-width=".8" opacity=".6"/>`
      ).join("") +
      topHem
  },

  /* costas */
  {
    id: "emo_capa",
    p: "emo",
    slot: "back",
    name: "Capa de vampiro",
    price: 200,
    svg: () =>
      `<path d="M30 50Q14 96 6 142L60 128L114 142Q106 96 90 50Z" fill="#141416" ${O}/><path d="M36 58Q24 98 18 134L60 124L102 134Q96 98 84 58Z" fill="#8A0F22"/><path d="M28 50L18 30L40 44M92 50L102 30L80 44" fill="#141416" ${O}/>`
  },

  /* pulso */
  {
    id: "emo_munhequeira",
    p: "emo",
    slot: "wrist",
    name: "Munhequeira listrada",
    price: 50,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-20)"><rect x="-5.5" y="-6" width="11" height="10" rx="2" fill="#141416" ${O} stroke-width="1.4"/><path d="M-5.5 -2.5H5.5M-5.5 1H5.5" stroke="#FF4FB0" stroke-width="2"/></g>`
      )
  },

  {
    id: "emo_rebites",
    p: "emo",
    slot: "wrist",
    name: "Pulseira de rebites",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-20)"><rect x="-5.5" y="-5" width="11" height="8" rx="2" fill="#141416" ${O} stroke-width="1.4"/><circle cx="-2.6" cy="-1" r="1.3" fill="#D9DDE3"/><circle cx="1" cy="-1" r="1.3" fill="#D9DDE3"/><circle cx="4" cy="-1" r="1" fill="#D9DDE3"/></g>`
      )
  },

  {
    id: "emo_pulseiras",
    p: "emo",
    slot: "wrist",
    name: "Pulseiras de borracha",
    price: 40,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-20)">${["#FF4FB0", "#141416", "#7FE8FF", "#C8102E", "#B48CFF"].map((c, i) => `<rect x="-6" y="${-6 + i * 2.3}" width="12" height="2" rx="1" fill="${c}"/>`).join("")}</g>`
      )
  },

  {
    id: "emo_luva",
    p: "emo",
    slot: "wrist",
    name: "Luva arrastão",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<circle r="5.6" fill="#141416" fill-opacity=".25" stroke="#141416" stroke-width="1.6"/><path d="M-4 -4L4 4M-4 4L4 -4M-5.5 0H5.5M0 -5.5V5.5" stroke="#141416" stroke-width=".7"/>`
      )
  },

  /* mãos */
  {
    id: "emo_taca",
    p: "emo",
    slot: "hand",
    name: "Taça de vinho",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-7 -15H7Q7.5 -3 0 -1.5Q-7.5 -3 -7 -15Z" fill="#fff" fill-opacity=".35" ${O} stroke-width="1.6"/><path d="M-6.6 -9H6.6Q6.4 -3.2 0 -2.2Q-6.4 -3.2 -6.6 -9Z" fill="#7A0F24"/><path d="M0 -1.5V9" stroke="var(--ink)" stroke-width="1.6"/><ellipse cy="10" rx="5.5" ry="1.8" fill="#fff" fill-opacity=".35" ${O} stroke-width="1.4"/><path d="M-4.5 -13Q-4.5 -10 -3.6 -9.4" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/>`
      )
  },

  {
    id: "emo_rosa",
    p: "emo",
    slot: "hand",
    name: "Rosa vermelha",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 0V18" stroke="#2E5A2A" stroke-width="2"/><path d="M0 9Q-6 6 -7 10Q-3 12 0 10" fill="#2E5A2A"/>` +
          rose(0, -3, 6)
      )
  },

  {
    id: "emo_castical",
    p: "emo",
    slot: "hand",
    name: "Castiçal",
    price: 110,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-9 -4Q-9 3 0 3Q9 3 9 -4M0 3V12M-5 13H5" fill="none" stroke="#B8975A" stroke-width="2"/>${[-9, 0, 9].map(cx => `<rect x="${cx - 1.8}" y="${cx === 0 ? -14 : -10}" width="3.6" height="${cx === 0 ? 10 : 6}" fill="#EFE6D6" stroke="#B8975A" stroke-width=".8"/><path d="M${cx} ${cx === 0 ? -20 : -16}Q${cx + 2.6} ${cx === 0 ? -16 : -12} ${cx} ${cx === 0 ? -14 : -10}Q${cx - 2.6} ${cx === 0 ? -16 : -12} ${cx} ${cx === 0 ? -20 : -16}Z" fill="#FFB020"/>`).join("")}`
      )
  },

  {
    id: "emo_microfone",
    p: "emo",
    slot: "hand",
    name: "Microfone de vocalista",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 14Q-2 22 -10 22" fill="none" stroke="#C8102E" stroke-width="1.6"/><rect x="-3" y="-1" width="6" height="16" rx="2" fill="#141416" ${O} stroke-width="1.8"/><circle cx="0" cy="-6" r="6.5" fill="#3A3A40" ${O} stroke-width="1.8"/><path d="M-4 -8H4M-4.5 -5H4.5" stroke="#777" stroke-width=".8"/>`
      )
  },

  {
    id: "emo_guitarra",
    p: "emo",
    slot: "hand",
    name: "Guitarra preta",
    price: 130,
    svg: (x, y) =>
      H(
        x,
        y,
        guitar("#141416", "#3A2A1E") +
          `<path d="M-2 3L3 -1" stroke="#C8102E" stroke-width="1.6" transform="rotate(-38)"/>`
      )
  },

  /* companheiros */
  {
    id: "emo_pet_morcego",
    p: "emo",
    slot: "pet",
    name: "Morceguinho",
    price: 120,
    svg: () =>
      `<g transform="translate(16 30)"><g class="flap">${bat(0, 0, 1.1)}</g><circle cx="-1.8" cy="-1" r=".9" fill="#E0102E"/><circle cx="1.8" cy="-1" r=".9" fill="#E0102E"/></g>`
  },

  {
    id: "emo_pet_gato",
    p: "emo",
    slot: "pet",
    name: "Gatinho preto",
    price: 140,
    svg: () =>
      `<g transform="translate(14 118)"><path d="M10 6Q18 2 16 -8" fill="none" stroke="#141416" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="2" cy="4" rx="9" ry="7" fill="#141416"/><circle cx="0" cy="-6" r="6.5" fill="#141416"/><path d="M-6 -8L-6 -15L-1.5 -11ZM6 -8L6 -15L1.5 -11Z" fill="#141416"/><ellipse cx="-2.4" cy="-6.5" rx="1.4" ry="1.8" fill="#F2C14E"/><ellipse cx="2.4" cy="-6.5" rx="1.4" ry="1.8" fill="#F2C14E"/></g>`
  },

  {
    id: "emo_pet_corvo",
    p: "emo",
    slot: "pet",
    name: "Corvo",
    price: 140,
    svg: () =>
      `<g transform="translate(14 26)"><path d="M-8 2Q-6 -8 2 -7Q8 -7 9 -3L14 -2L9 0Q8 8 0 9Q-4 9 -8 13Q-7 7 -8 2Z" fill="#17171C"/><path d="M-4 0Q0 6 6 3" fill="none" stroke="#2E2E38" stroke-width="1.4"/><circle cx="4" cy="-4" r="1.1" fill="#C9CED6"/></g>`
  },

  /* fio */
  {
    id: "emo_fio_corrente",
    p: "emo",
    slot: "string",
    name: "Fio de corrente",
    price: 60,
    svg: () =>
      `<line x1="60" y1="-40" x2="60" y2="19" stroke="#8C8A96" stroke-width="3.2" stroke-dasharray="3.4 1.8"/>`
  },

  {
    id: "emo_fio_rosas",
    p: "emo",
    slot: "string",
    name: "Fio com rosas",
    price: 90,
    svg: () =>
      `<line x1="60" y1="-40" x2="60" y2="19" stroke="#2E5A2A" stroke-width="2"/>` +
      rose(60, 2, 3.4) +
      rose(60, 11, 2.8)
  },

  {
    id: "emo_fio_aranha",
    p: "emo",
    slot: "string",
    name: "Fio com aranha",
    price: 80,
    svg: () =>
      `<line x1="60" y1="-40" x2="60" y2="19" stroke="#C9CED6" stroke-width="1.4"/><g transform="translate(60 6)"><ellipse rx="2.8" ry="3.4" fill="#141416"/><path d="M-2 -1L-6 -4M-2 1L-6.5 1M-2 2L-5.5 5.5M2 -1L6 -4M2 1L6.5 1M2 2L5.5 5.5" stroke="#141416" stroke-width="1"/></g>`
  },

  {
    id: "emo_fio_vermelho",
    p: "emo",
    slot: "string",
    name: "Fio vermelho",
    price: 40,
    svg: () => `<line x1="60" y1="-40" x2="60" y2="19" stroke="#C8102E" stroke-width="2.4"/>`
  },

  /* cenários */
  {
    id: "emo_bg_lua",
    p: "emo",
    slot: "bg",
    name: "Lua de sangue",
    price: 150,
    svg: () =>
      `<circle cx="18" cy="16" r="12" fill="#8A0F22" opacity=".85"/><circle cx="14" cy="12" r="2.6" fill="#000" opacity=".15"/><circle cx="22" cy="20" r="1.8" fill="#000" opacity=".15"/>` +
      bat(102, 14, 0.7, "#3A3A44") +
      bat(92, 28, 0.5, "#3A3A44") +
      bat(28, 40, 0.45, "#3A3A44")
  },

  {
    id: "emo_bg_chuva",
    p: "emo",
    slot: "bg",
    name: "Chuva triste",
    price: 100,
    svg: () =>
      `<g class="rain">${Array.from({ length: 16 }, (_, i) => `<path d="M${((i * 37) % 118) + 2} ${((i * 53) % 140) - 4}l-3 9" stroke="#7A86A8" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>`).join("")}</g><path d="M4 8Q4 0 12 1Q15 -6 23 -3Q30 -6 32 2Q38 3 36 9Z" fill="#7A7A88" opacity=".6"/><path d="M86 6Q86 -1 93 0Q96 -6 103 -3Q110 -5 111 2Q117 3 115 8Z" fill="#7A7A88" opacity=".6"/>`
  },

  {
    id: "emo_bg_rosas",
    p: "emo",
    slot: "bg",
    name: "Rosas murchas",
    price: 110,
    svg: () =>
      `<path d="M4 148Q8 128 14 120M14 148Q16 132 22 128M106 148Q104 130 98 122M116 148Q112 134 108 128" stroke="#2E4A2A" stroke-width="1.8" fill="none"/>` +
      rose(14, 120, 5, "#6E0E20") +
      rose(22, 128, 3.6, "#4A0A16") +
      rose(98, 122, 5, "#6E0E20") +
      rose(108, 128, 3.4, "#4A0A16") +
      `<path d="M30 142q3-2 5 0q-2 3-5 0zM88 140q3-2 5 0q-2 3-5 0z" fill="#6E0E20"/>`
  },

  {
    id: "emo_bg_castelo",
    p: "emo",
    slot: "bg",
    name: "Castelo sombrio",
    price: 160,
    svg: () =>
      `<circle cx="100" cy="18" r="9" fill="#E8E2D0" opacity=".7"/><path d="M0 148V112H6V104H10V112H16V96L20 88L24 96V112H30V106H34V148Z" fill="#2A2733" opacity=".9"/><rect x="21" y="100" width="2" height="4" fill="#F2C14E"/><path d="M100 148V124H104V118H108V124H112V112L116 106L120 112V148Z" fill="#2A2733" opacity=".9"/>` +
      bat(84, 30, 0.5, "#3A3A44")
  },

  {
    id: "emo_bg_cemiterio",
    p: "emo",
    slot: "bg",
    name: "Cemitério ao luar",
    price: 130,
    svg: () =>
      `<circle cx="20" cy="14" r="8" fill="#E8E2D0" opacity=".6"/><path d="M0 148Q60 136 120 148Z" fill="#2A2733" opacity=".5"/><path d="M6 146V132Q6 126 12 126Q18 126 18 132V146Z" fill="#5C5A66" opacity=".85"/><path d="M100 146V128H104V124H108V128H112V132H108V146Z" fill="#5C5A66" opacity=".85"/><path d="M84 146V136Q84 131 89 131Q94 131 94 136V146Z" fill="#5C5A66" opacity=".7"/>`
  },

  /* lendário extra */
  {
    id: "emo_asas",
    p: "emo",
    slot: "back",
    name: "Asas de morcego",
    ach: "habito21",
    svg: () =>
      `<g class="wings"><path d="M26 62Q10 40 -4 44Q4 52 0 58Q8 58 6 66Q14 64 14 72Q20 68 26 74Z" fill="#141416" ${O}/><path d="M94 62Q110 40 124 44Q116 52 120 58Q112 58 114 66Q106 64 106 72Q100 68 94 74Z" fill="#141416" ${O}/></g>`
  }
);

/* ---------- Roupas das eras: praça, scene, bandas inventadas, desfile branco ---------- */
// Camiseta com nome de banda inventada (nada de banda de verdade)
const camisetaBanda = (cor, corTexto, linha1, linha2, desenho = "") =>
  tee(
    cor,
    `<text x="60" y="${linha2 ? 106 : 110}" font-size="7.2" font-weight="800" text-anchor="middle" fill="${corTexto}" font-family="Bungee,Impact,sans-serif">${linha1}</text>${linha2 ? `<text x="60" y="114" font-size="7.2" font-weight="800" text-anchor="middle" fill="${corTexto}" font-family="Bungee,Impact,sans-serif">${linha2}</text>` : ""}${desenho}`
  );
// Botton redondo (broche) na altura do peito
const botton = (x, y, fundo, miolo) =>
  `<g transform="translate(${x} ${y})"><circle r="5.6" fill="${fundo}" ${O} stroke-width="1.4"/><circle r="5.6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1" transform="scale(.8)"/>${miolo}</g>`;
const coracaoMini = (c = "#C8102E") =>
  `<path d="M0 3L-3 0.4A1.7 1.7 0 0 1 0 -1.6A1.7 1.7 0 0 1 3 0.4Z" fill="${c}"/>`;

ITEMS.push(
  /* camisetas de bandas inventadas */
  {
    id: "emo_banda_coracao",
    p: "emo",
    slot: "top",
    name: "Camiseta Coração Partido FC",
    price: 110,
    svg: () =>
      camisetaBanda(
        "#141416",
        "#F2F2F2",
        "CORAÇÃO",
        "PARTIDO FC",
        `<g transform="translate(60 124)">${coracaoMini("#C8102E")}</g>`
      )
  },
  {
    id: "emo_banda_melancolicos",
    p: "emo",
    slot: "top",
    name: "Camiseta Os Melancólicos",
    price: 110,
    svg: () =>
      camisetaBanda(
        "#2A2733",
        "#C9C3D6",
        "OS",
        "MELANCÓLICOS",
        `<path d="M64 120a6 6 0 1 1 -6 -8a4.6 4.6 0 0 0 6 8z" fill="#F2EAD3"/>`
      )
  },
  {
    id: "emo_banda_neon",
    p: "emo",
    slot: "top",
    name: "Camiseta Lágrimas de Neon",
    price: 120,
    svg: () =>
      camisetaBanda(
        "#5B2E7A",
        "#4FE3FF",
        "LÁGRIMAS",
        "DE NEON",
        `<path d="M60 119q3 4.6 0 6.6q-3-2 0-6.6z" fill="#FF4FD8"/>`
      )
  },
  {
    id: "emo_jaqueta_branca",
    p: "emo",
    slot: "top",
    name: "Jaqueta de desfile branca",
    price: 200,
    svg: () =>
      topBase("#EDEAE4") +
      `<path d="M52 90V150M68 90V150" stroke="#141416" stroke-width="2"/>${[100, 112, 124, 136].map(y => `<circle cx="46" cy="${y}" r="2" fill="#B8975A"/><circle cx="74" cy="${y}" r="2" fill="#B8975A"/>`).join("")}<path d="M20 86L36 93M100 86L84 93" stroke="#141416" stroke-width="3"/><path d="M14 98H30" stroke="#C8102E" stroke-width="5"/>` +
      topHem
  },
  /* cintura */
  {
    id: "emo_cinto_xadrez",
    p: "emo",
    slot: "waist",
    name: "Cinto xadrez",
    price: 70,
    svg: () =>
      `<rect x="0" y="110" width="120" height="8" fill="#141416"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${i * 4}" y="${i % 2 ? 110 : 114}" width="4" height="4" fill="#F2F2F2"/>`).join("")}<rect x="54" y="108" width="12" height="12" rx="2" fill="none" stroke="#C9CED6" stroke-width="2.4"/>`
  },
  {
    id: "emo_cinto_rebites",
    p: "emo",
    slot: "waist",
    name: "Cinto de rebites",
    price: 80,
    svg: () =>
      `<rect x="0" y="110" width="120" height="8" fill="#141416"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 9 + 3} 117L${i * 9 + 6} 111L${i * 9 + 9} 117Z" fill="#D9DDE3"/>`).join("")}<rect x="53" y="108" width="14" height="12" rx="2" fill="#B8BEC6" ${O} stroke-width="1.2"/>`
  },
  {
    id: "emo_corrente_carteira",
    p: "emo",
    slot: "waist",
    name: "Cinto com corrente de carteira",
    price: 90,
    svg: () =>
      `<rect x="0" y="110" width="120" height="7" fill="#1E1F24"/><rect x="54" y="109" width="12" height="9" rx="2" fill="#C9CED6"/><path d="M36 117Q44 138 70 132" fill="none" stroke="#C9CED6" stroke-width="2.6" stroke-dasharray="3 1.6"/>`
  },
  /* bottons */
  {
    id: "emo_botton_estrela",
    p: "emo",
    slot: "pins",
    name: "Botton de estrela",
    price: 40,
    svg: () =>
      botton(
        42,
        100,
        "#FF4FB0",
        `<path d="M0 -3.2L0.9 -1L3.2 -1L1.4 0.5L2 2.8L0 1.5L-2 2.8L-1.4 0.5L-3.2 -1L-0.9 -1Z" fill="#141416"/>`
      )
  },
  {
    id: "emo_botton_coracao",
    p: "emo",
    slot: "pins",
    name: "Botton coração partido",
    price: 40,
    svg: () =>
      botton(
        42,
        100,
        "#141416",
        `<path d="M0 3L-3 0.4A1.7 1.7 0 0 1 0 -1.6L-0.6 0.6L0.6 1.4Z" fill="#C8102E"/><path d="M0.5 3L1.1 1.4L-0.1 0.6L0.5 -1.6A1.7 1.7 0 0 1 3 0.4Z" fill="#C8102E"/>`
      )
  },
  {
    id: "emo_botton_caveira",
    p: "emo",
    slot: "pins",
    name: "Botton de caveira",
    price: 40,
    svg: () =>
      botton(
        78,
        100,
        "#2A2733",
        `<circle cy="-0.6" r="2.6" fill="#EEE"/><rect x="-1.5" y="1.2" width="3" height="1.8" fill="#EEE"/><circle cx="-0.9" cy="-0.8" r=".7" fill="#2A2733"/><circle cx="0.9" cy="-0.8" r=".7" fill="#2A2733"/>`
      )
  },
  {
    id: "emo_botton_xoxo",
    p: "emo",
    slot: "pins",
    name: "Botton XOXO",
    price: 40,
    svg: () =>
      botton(
        78,
        100,
        "#F2F2F2",
        `<text y="1.8" font-size="3.6" font-weight="900" text-anchor="middle" fill="#C8102E" font-family="sans-serif">XOXO</text>`
      )
  },
  {
    id: "emo_botton_rawr",
    p: "emo",
    slot: "pins",
    name: "Botton rawr",
    price: 50,
    svg: () =>
      botton(
        42,
        100,
        "#5FD06C",
        `<text y="1.6" font-size="3.4" font-weight="900" text-anchor="middle" fill="#141416" font-family="sans-serif">rawr</text>`
      )
  },
  {
    id: "emo_bottons_combo",
    p: "emo",
    slot: "pins",
    name: "Coleção de bottons",
    price: 130,
    svg: () =>
      botton(
        38,
        98,
        "#FF4FB0",
        `<path d="M0 -3.2L0.9 -1L3.2 -1L1.4 0.5L2 2.8L0 1.5L-2 2.8L-1.4 0.5L-3.2 -1L-0.9 -1Z" fill="#141416"/>`
      ) +
      botton(
        50,
        108,
        "#F2F2F2",
        `<text y="1.8" font-size="3.6" font-weight="900" text-anchor="middle" fill="#C8102E" font-family="sans-serif">XOXO</text>`
      ) +
      botton(80, 98, "#141416", coracaoMini()) +
      botton(
        70,
        110,
        "#5FD06C",
        `<text y="1.6" font-size="3.4" font-weight="900" text-anchor="middle" fill="#141416" font-family="sans-serif">rawr</text>`
      )
  },
  /* costas */
  {
    id: "emo_mochila",
    p: "emo",
    slot: "back",
    name: "Mochila cheia de bottons",
    price: 140,
    svg: () =>
      `<rect x="10" y="44" width="100" height="84" rx="18" fill="#26272C" ${O}/>` +
      botton(17, 64, "#FF4FB0", coracaoMini("#141416")) +
      botton(
        16,
        80,
        "#F2F2F2",
        `<text y="1.8" font-size="3.6" font-weight="900" text-anchor="middle" fill="#C8102E" font-family="sans-serif">XOXO</text>`
      ) +
      botton(103, 70, "#5FD06C", "") +
      botton(104, 86, "#C8102E", "")
  },
  {
    id: "emo_violao_costas",
    p: "emo",
    slot: "back",
    name: "Violão nas costas",
    price: 150,
    svg: () =>
      `<g transform="rotate(32 60 80)"><rect x="57" y="-4" width="6" height="56" fill="#6B4E3D" ${O} stroke-width="1.6"/><rect x="55" y="-10" width="10" height="9" rx="2" fill="#3A2A1E"/><path d="M60 46C76 46 78 60 72 66C80 72 78 92 60 92C42 92 40 72 48 66C42 60 44 46 60 46Z" fill="#C98B4A" ${O}/></g>`
  },
  /* cabelos scene */
  {
    id: "emo_chapinha",
    p: "emo",
    slot: "hair",
    name: "Franja de chapinha",
    price: 120,
    svg: () =>
      `<path d="M20 58Q18 22 60 19Q96 20 100 46Q100 70 96 92Q90 70 88 56Q82 46 74 44Q66 60 58 84Q54 66 56 48Q40 44 28 52Q24 70 24 88Q18 74 20 58Z" fill="#141416" ${O}/><path d="M70 26Q80 30 84 40" stroke="#3A3A44" stroke-width="2" fill="none" stroke-linecap="round"/>`
  },
  {
    id: "emo_bicolor",
    p: "emo",
    slot: "hair",
    name: "Franja preta e rosa",
    price: 130,
    svg: () =>
      `<path d="M21 55Q22 21 60 20Q95 21 99 50Q91 44 85 53Q79 67 66 77Q73 61 66 51Q50 41 34 47Q25 49 21 55Z" fill="#141416" ${O}/><path d="M60 20Q95 21 99 50Q91 44 85 53Q79 67 66 77Q73 61 66 51Q64 40 60 20Z" fill="#FF4FB0" ${O}/>`
  },
  {
    id: "emo_scene_azul",
    p: "emo",
    slot: "hair",
    name: "Cabelo scene com mechas",
    price: 140,
    svg: () =>
      `<path d="M22 54Q16 34 26 26L22 12L38 20L42 6L52 16L60 2L68 16L78 6L82 20L98 12L94 26Q104 34 98 54Q94 44 86 52Q80 66 68 74Q74 58 66 50Q50 40 34 46Q26 48 22 54Z" fill="#141416" ${O}/><path d="M44 14L48 30M62 6L62 26M80 12L74 30" stroke="#4FE3FF" stroke-width="3.4" stroke-linecap="round"/>`
  },
  {
    id: "emo_laco_rosa",
    p: "emo",
    slot: "hat",
    name: "Laço rosa de bolinha",
    price: 70,
    svg: () =>
      `<path d="M30 30L14 18Q8 28 14 38Z" fill="#FF4FB0" ${O}/><path d="M30 30L46 18Q52 28 46 38Z" fill="#FF4FB0" ${O}/><circle cx="30" cy="30" r="4.6" fill="#FF8FCB" ${O}/><circle cx="17" cy="25" r="1.4" fill="#fff"/><circle cx="19" cy="33" r="1.4" fill="#fff"/><circle cx="43" cy="25" r="1.4" fill="#fff"/><circle cx="41" cy="33" r="1.4" fill="#fff"/>`
  },
  /* olhos e maquiagem */
  {
    id: "emo_gatinho",
    p: "emo",
    slot: "face",
    name: "Delineado gatinho",
    price: 70,
    svg: m =>
      `<path d="M40 61Q47 57.5 54 60.5L60 55.5" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M80 61Q73 57.5 66 60.5L60 55.5" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M41 59.5l-2-2.6M44 58.3l-1.4-2.8M76 58.3l1.4-2.8M79 59.5l2-2.6" stroke="#111" stroke-width="1.2" stroke-linecap="round"/>`
  },
  {
    id: "emo_aro_grosso",
    p: "emo",
    slot: "face",
    name: "Óculos de aro grosso",
    price: 80,
    svg: () =>
      lensPair("#BFE3F2", "#141416", 3, 56, 15, 0.15).replace(/stroke-width="2.4"/g, 'stroke-width="4"')
  },
  {
    id: "emo_estrela_olho",
    p: "emo",
    slot: "cheek",
    name: "Estrela pintada no olho",
    price: 70,
    svg: () =>
      `<path d="M73 52L76 60.5L84.5 61L78 66.5L80.5 75L73 70L65.5 75L68 66.5L61.5 61L70 60.5Z" fill="none" stroke="#141416" stroke-width="2" stroke-linejoin="round"/>`
  },
  /* pescoço */
  {
    id: "emo_metade_coracao",
    p: "emo",
    slot: "neck",
    name: "Colar metade de coração",
    price: 90,
    svg: () =>
      chainN("#C9CED6", 2.2) +
      `<path d="M60 108L52.4 100.8A4.4 4.4 0 0 1 59.6 95.4L61 98.4L59 101.4L61.4 104.4Z" fill="#C8102E" ${O} stroke-width="1.2"/>`
  },
  /* companheiros */
  {
    id: "emo_ursinho_zumbi",
    p: "emo",
    slot: "pet",
    name: "Ursinho zumbi",
    price: 130,
    svg: () =>
      `<g transform="translate(15 120)"><circle cx="-5.5" cy="-13" r="3.6" fill="#8C7A86" stroke="var(--ink)" stroke-width="1"/><circle cx="5.5" cy="-13" r="3.6" fill="#8C7A86" stroke="var(--ink)" stroke-width="1"/><circle cy="-6" r="7.5" fill="#A8949F" stroke="var(--ink)" stroke-width="1.2"/><ellipse cy="6" rx="8.5" ry="8" fill="#A8949F" stroke="var(--ink)" stroke-width="1.2"/><path d="M-4.4 -8.4l2.4 2.4M-2 -8.4l-2.4 2.4" stroke="#141416" stroke-width="1.1"/><circle cx="3" cy="-7" r="1.2" fill="#141416"/><path d="M-3 -2.5h6M-2 -3.6v2.2M0 -3.6v2.2M2 -3.6v2.2" stroke="#141416" stroke-width=".7"/><path d="M-4 4l8 0M-2 2.4v3.2M2 2.4v3.2" stroke="#C8102E" stroke-width=".9"/></g>`
  },
  {
    id: "emo_coracao_pelucia",
    p: "emo",
    slot: "pet",
    name: "Coração de pelúcia costurado",
    price: 110,
    svg: () =>
      `<g transform="translate(16 30)"><path d="M0 10L-9 1.6A5.4 5.4 0 0 1 0 -5.2A5.4 5.4 0 0 1 9 1.6Z" fill="#C8102E" stroke="var(--ink)" stroke-width="1.2"/><path d="M-1 -4L1 2L-1 6" fill="none" stroke="#141416" stroke-width=".9" stroke-dasharray="1.4 1"/><path d="M-3 -1.4l2 .8M-2.6 2.4l2 .4M0 5l1.8-.6" stroke="#141416" stroke-width=".8"/></g>`
  },
  {
    id: "emo_morcego_pendurado",
    p: "emo",
    slot: "pet",
    name: "Morcego de cabeça pra baixo",
    price: 120,
    svg: () =>
      `<g transform="translate(16 4)"><path d="M-10 -6H10" stroke="#6B4E3D" stroke-width="2.4" stroke-linecap="round"/><path d="M-1.5 -6V-3M1.5 -6V-3" stroke="#141416" stroke-width="1"/><path d="M0 -3Q7 -2 6 8Q4 13 0 14Q-4 13 -6 8Q-7 -2 0 -3Z" fill="#141416"/><path d="M-3 13L-2 16.5L0 14L2 16.5L3 13" fill="#141416"/><circle cx="-1.6" cy="10" r=".9" fill="#E0102E"/><circle cx="1.6" cy="10" r=".9" fill="#E0102E"/></g>`
  }
);
