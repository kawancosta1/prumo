/*
  Mundo Roqueiro: guarda-roupa extra, das eras do rock (anos 70, glam 80, punk, grunge 90, heavy metal,
  rockabilly e rock nacional) e do videogame de guitarra (trastes verde, vermelho, amarelo, azul e laranja,
  Star Power, estrada de notas). Carregado depois de js/mundos/rock.js.
  Regra: nada de nome, logo ou letra de banda real. Bandas, turnês e placas são inventadas.
  Lembrete das medidas: área 120 x 154, olhos em (47,64) e (73,64), boca perto de y=78, pescoço em y≈84.
*/
"use strict";

/* ---------- pedacinhos deste arquivo ---------- */
const TRASTES = ["#2FB344", "#E0312F", "#F2C318", "#2F6FD6", "#F07A1A"]; // verde, vermelho, amarelo, azul, laranja
// Nota redonda do videogame de guitarra (gema colorida com miolo branco)
const gema = (x, y, cor, r = 5) =>
  `<g transform="translate(${x} ${y})"><ellipse rx="${r}" ry="${r * 0.62}" fill="#141416"/><ellipse cy="-1" rx="${r * 0.9}" ry="${r * 0.52}" fill="${cor}"/><ellipse cy="-1.3" rx="${r * 0.42}" ry="${r * 0.24}" fill="#fff" opacity=".85"/></g>`;
// Raio
const raio = (x, y, s = 1, cor = "#FFC21A") =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M3 -10L-5 2H0L-3 10L6 -3H1Z" fill="${cor}" stroke="#141416" stroke-width=".8" stroke-linejoin="round"/>`;
// Palheta
const palheta = (x, y, cor, s = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M-5 -4Q0 -6.5 5 -4Q5.4 2 0 7Q-5.4 2 -5 -4Z" fill="${cor}" stroke="#141416" stroke-width=".7"/>`;
// Caixa de amplificador
const amp = (x, y, w, h) =>
  `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="2" fill="#1E1F24" stroke="#3A3A44"/><rect x="3" y="3" width="${w - 6}" height="${h * 0.22}" fill="#2B2B33"/>${[0.2, 0.4, 0.6, 0.8].map(k => `<circle cx="${w * k}" cy="${h * 0.13}" r="1.2" fill="#C9CED6"/>`).join("")}<rect x="3" y="${h * 0.3}" width="${w - 6}" height="${h * 0.64}" fill="#3A3A44"/>${Array.from({ length: 6 }, (_, i) => `<path d="M4 ${h * 0.34 + i * h * 0.1}H${w - 4}" stroke="#2B2B33" stroke-width="1"/>`).join("")}</g>`;
// Camiseta de banda inventada (mesmo jeito do emo)
const camisetaRock = (cor, corTexto, l1, l2, desenho = "") =>
  tee(
    cor,
    `<text x="60" y="${l2 ? 101 : 104}" font-size="6" font-weight="800" text-anchor="middle" fill="${corTexto}" font-family="Metal Mania,Bungee,Impact,sans-serif">${l1}</text>${l2 ? `<text x="60" y="108" font-size="6" font-weight="800" text-anchor="middle" fill="${corTexto}" font-family="Metal Mania,Bungee,Impact,sans-serif">${l2}</text>` : ""}${desenho}`
  );

ITEMS.push(
  /* ===================== cabeça ===================== */
  {
    id: "rock_faixa_80",
    p: "rock",
    slot: "hat",
    name: "Faixa de suor anos 80",
    price: 60,
    svg: () =>
      `<path d="M23 50Q60 28 97 50" fill="none" stroke="var(--ink)" stroke-width="11"/><path d="M23 50Q60 28 97 50" fill="none" stroke="#F2F2F2" stroke-width="8.6"/><path d="M23 47.6Q60 25.6 97 47.6" fill="none" stroke="#FF4FD8" stroke-width="2"/><path d="M23 52.4Q60 30.4 97 52.4" fill="none" stroke="#2F6FD6" stroke-width="2"/>`
  },
  {
    id: "rock_cowboy",
    p: "rock",
    slot: "hat",
    name: "Chapéu de couro",
    price: 120,
    svg: () =>
      cowboyHat("#2B1D14", "#C9A227") +
      [36, 48, 60, 72, 84]
        .map(
          x =>
            `<circle cx="${x}" cy="${x === 60 ? 26.4 : x === 48 || x === 72 ? 27.2 : 28.8}" r="1.3" fill="#E6E9ED"/>`
        )
        .join("")
  },
  {
    id: "rock_bone_roadie",
    p: "rock",
    slot: "hat",
    name: "Boné de roadie",
    price: 70,
    svg: () =>
      cap("#141416") +
      `<text x="60" y="38" font-size="7" font-weight="900" text-anchor="middle" fill="#F2F2F2" font-family="Bungee,Impact,sans-serif">EQUIPE</text>`
  },
  {
    id: "rock_coroa",
    p: "rock",
    slot: "hat",
    name: "Coroa do rei do rock",
    price: 220,
    svg: () =>
      `<path d="M32 44L28 16L44 30L60 10L76 30L92 16L88 44Z" fill="#E8C24A" ${O}/><path d="M32 44H88" stroke="#B8975A" stroke-width="3"/><circle cx="60" cy="34" r="3.4" fill="#C8302C" stroke="#141416"/><circle cx="44" cy="37" r="2.4" fill="#2F6FD6" stroke="#141416"/><circle cx="76" cy="37" r="2.4" fill="#2FB344" stroke="#141416"/>` +
      brilhinho(70, 18, 2.6, "#FFFFFF", 0.3)
  },
  {
    id: "rock_gorro_grunge",
    p: "rock",
    slot: "hat",
    name: "Gorro grunge",
    price: 70,
    svg: () => beanie("#5A6B3A", "#3F4A2A")
  },
  {
    id: "rock_chifres",
    p: "rock",
    slot: "hat",
    name: "Chifrinhos de diabinho",
    price: 80,
    svg: () =>
      `<path d="M24 46Q60 22 96 46" fill="none" stroke="#141416" stroke-width="3"/><path d="M36 37Q26 24 34 10Q38 24 46 31Z" fill="#E0312F" ${O}/><path d="M84 37Q94 24 86 10Q82 24 74 31Z" fill="#E0312F" ${O}/>`
  },

  /* ===================== cabelo ===================== */
  {
    id: "rock_cabelao",
    p: "rock",
    slot: "hair",
    name: "Cabelão metaleiro",
    price: 140,
    svg: () =>
      `<path d="M60 19Q100 20 102 56Q104 92 98 112Q90 100 88 70Q84 46 62 34Q60 26 58 34Q36 46 32 70Q30 100 22 112Q16 92 18 56Q20 20 60 19Z" fill="#141416" ${O}/><path d="M60 24V36" stroke="#3A3A44" stroke-width="1.4"/><path d="M90 46Q96 74 94 100M30 46Q24 74 26 100" stroke="#3A3A44" stroke-width="1.6" fill="none"/>`
  },
  {
    id: "rock_mullet",
    p: "rock",
    slot: "hair",
    name: "Mullet",
    price: 110,
    svg: () =>
      `<path d="M22 54Q20 24 60 21Q100 24 98 54Q104 72 100 92Q94 80 92 64Q88 48 80 44Q60 36 40 44Q32 48 28 64Q26 80 20 92Q16 72 22 54Z" fill="#6B4A30" ${O}/><path d="M40 30Q50 26 56 34M64 34Q72 26 82 30" stroke="#8A6A4A" stroke-width="1.6" fill="none"/>`
  },
  {
    id: "rock_topete",
    p: "rock",
    slot: "hair",
    name: "Topete rockabilly",
    price: 120,
    svg: () =>
      `<path d="M26 50Q22 30 36 24Q30 6 56 4Q86 2 92 18Q82 14 74 18Q98 22 96 50Q88 36 60 34Q34 36 26 50Z" fill="#241A14" ${O}/><path d="M44 12Q62 6 82 14M40 20Q58 14 78 20" stroke="#5A4A3A" stroke-width="1.8" fill="none"/><path d="M48 9Q54 7 58 8" stroke="#fff" stroke-width="1.6" opacity=".6" fill="none"/>`
  },
  {
    id: "rock_glam",
    p: "rock",
    slot: "hair",
    name: "Cabelo glam armado",
    price: 150,
    svg: () =>
      `<path d="M14 64Q4 40 18 26Q14 8 36 8Q46 -4 62 4Q80 -4 90 10Q110 10 104 32Q116 48 106 70Q100 84 96 64Q92 44 80 40Q60 34 40 40Q28 44 24 64Q20 84 14 64Z" fill="#F2D27A" ${O}/><path d="M28 20Q34 30 30 40M48 10Q52 22 48 30M74 10Q70 22 74 30M92 22Q86 30 90 40" stroke="#D9B04A" stroke-width="2" fill="none"/>` +
      brilhinho(40, 18, 2.4, "#FFFFFF", 0) +
      brilhinho(86, 30, 2, "#FFFFFF", 0.8)
  },
  {
    id: "rock_liberty",
    p: "rock",
    slot: "hair",
    name: "Spikes punk",
    price: 130,
    svg: () =>
      `<path d="M26 46L20 14L38 32L40 2L52 28L60 -4L68 28L80 2L82 32L100 14L94 46Q80 36 60 35Q40 36 26 46Z" fill="#5FD06C" ${O}/><path d="M38 32L40 8M60 28V2M82 32L80 8" stroke="#2E8A3E" stroke-width="1.4"/>`
  },
  {
    id: "rock_grunge",
    p: "rock",
    slot: "hair",
    name: "Cabelo grunge",
    price: 110,
    svg: () =>
      `<path d="M60 20Q98 20 100 54Q102 78 96 92Q92 74 90 62Q86 46 70 42Q63 38 60 30Q57 38 50 42Q34 46 30 62Q28 74 24 92Q18 78 20 54Q22 20 60 20Z" fill="#8A6A3A" ${O}/><path d="M60 22V30M58 26Q46 30 38 44M62 26Q74 30 82 44M92 58Q96 70 95 84M28 58Q24 70 25 84" stroke="#6B4A2A" stroke-width="1.6" fill="none"/>`
  },

  /* ===================== rosto ===================== */
  {
    id: "rock_redondos",
    p: "rock",
    slot: "face",
    name: "Óculos redondos",
    price: 80,
    svg: () =>
      `<circle cx="47" cy="64" r="9" fill="#F07A1A" fill-opacity=".55" stroke="#B8975A" stroke-width="2"/><circle cx="73" cy="64" r="9" fill="#F07A1A" fill-opacity=".55" stroke="#B8975A" stroke-width="2"/><path d="M56 63Q60 60 64 63" fill="none" stroke="#B8975A" stroke-width="2"/>`
  },
  {
    id: "rock_visor",
    p: "rock",
    slot: "face",
    name: "Visor neon",
    price: 120,
    svg: () =>
      `<rect x="30" y="56" width="60" height="15" rx="7.5" fill="#4FE3FF" fill-opacity=".55" stroke="#141416" stroke-width="2.2"/><path d="M36 60H84" stroke="#fff" stroke-width="1.6" opacity=".7"/>`
  },
  {
    id: "rock_delineado_estrela",
    p: "rock",
    slot: "face",
    name: "Delineado com estrela",
    price: 70,
    svg: () =>
      `<path d="M40 61Q47 57 54 60.5L58 57M80 61Q73 57 66 60.5L62 57" fill="none" stroke="#111" stroke-width="2.8" stroke-linecap="round"/>` +
      star5(84, 56, 4, "#FFC21A")
  },
  {
    id: "rock_corpse",
    p: "rock",
    slot: "cheek",
    name: "Pintura de metal extremo",
    price: 110,
    svg: () =>
      `<path d="M36 58Q40 52 47 54Q54 52 56 60Q56 70 50 74L47 80L44 74Q36 70 36 58Z" fill="#141416"/><path d="M84 58Q80 52 73 54Q66 52 64 60Q64 70 70 74L73 80L76 74Q84 70 84 58Z" fill="#141416"/><path d="M60 84V92M56 86L54 92M64 86L66 92" stroke="#141416" stroke-width="1.6" stroke-linecap="round"/>`
  },
  {
    id: "rock_raio_rosto",
    p: "rock",
    slot: "cheek",
    name: "Raio pintado no rosto",
    price: 80,
    svg: () =>
      `<path d="M78 48L64 66H72L66 84L84 62H75L82 48Z" fill="#E0312F" stroke="#2F6FD6" stroke-width="1.6" stroke-linejoin="round" opacity=".9"/>`
  },
  {
    id: "rock_suor",
    p: "rock",
    slot: "cheek",
    name: "Suor de show",
    price: 40,
    svg: () =>
      [
        [30, 50],
        [88, 46],
        [92, 60]
      ]
        .map(
          ([x, y]) =>
            `<path d="M${x} ${y}q3.4 5 0 7q-3.4-2 0-7z" fill="#8FD8FF" stroke="#2F6FD6" stroke-width=".6"/>`
        )
        .join("")
  },
  {
    id: "rock_lingua",
    p: "rock",
    slot: "mouth",
    name: "Língua pra fora",
    price: 70,
    // a língua sai da boca de cada humor
    svg: m => {
      const a = mouthAt(m) || { y: 80, xs: [56, 64] };
      const y = m === "happy" || m === "party" ? 84 : a.y + 2;
      return `<path d="M54 ${y}Q54 ${y + 12} 60 ${y + 12}Q66 ${y + 12} 66 ${y}Z" fill="#F27A9A" stroke="#141416" stroke-width="1.4"/><path d="M60 ${y + 1}V${y + 8}" stroke="#C84A6A" stroke-width="1"/>`;
    }
  },
  {
    id: "rock_dente_ouro",
    p: "rock",
    slot: "mouth",
    name: "Dente de ouro",
    price: 90,
    svg: m => {
      const a = mouthAt(m);
      if (!a) return "";
      return (
        `<rect x="${a.xs[1] - 2.6}" y="${a.y - 0.4}" width="5.2" height="5" rx="1" fill="#E8C24A" stroke="#141416" stroke-width=".7"/>` +
        brilhinho(a.xs[1] + 2, a.y, 1.6, "#FFFFFF", 0.4)
      );
    }
  },
  {
    id: "rock_grito",
    p: "rock",
    slot: "mouth",
    name: "Grito de vocalista",
    price: 80,
    svg: () =>
      `<ellipse cx="60" cy="82" rx="8" ry="10" fill="#3A0A14" stroke="#141416" stroke-width="2"/><path d="M53 76H67" stroke="#fff" stroke-width="2.6"/><ellipse cx="60" cy="88" rx="4" ry="2.6" fill="#F27A9A"/>`
  },

  /* ===================== pescoço ===================== */
  {
    id: "rock_corrente_ouro",
    p: "rock",
    slot: "neck",
    name: "Corrente grossa",
    price: 100,
    svg: () => chainN("#E8C24A", 4.4)
  },
  {
    id: "rock_lenco",
    p: "rock",
    slot: "neck",
    name: "Lenço no pescoço",
    price: 60,
    svg: () => neckBand("#C8302C", "#F2F2F2")
  },
  {
    id: "rock_disco_ouro",
    p: "rock",
    slot: "neck",
    name: "Medalha disco de ouro",
    price: 140,
    svg: () =>
      `<path d="M32 84Q60 102 88 84" fill="none" stroke="#B8975A" stroke-width="1.6"/><circle cx="60" cy="102" r="10" fill="#E8C24A" stroke="#141416" stroke-width="1.4"/><circle cx="60" cy="102" r="6.4" fill="none" stroke="#B8975A"/><circle cx="60" cy="102" r="2.4" fill="#C8302C"/>` +
      brilhinho(55, 97, 2, "#FFFFFF", 0.5)
  },

  /* ===================== roupas ===================== */
  {
    id: "rock_colete_patches",
    p: "rock",
    slot: "top",
    name: "Colete de patches",
    price: 170,
    svg: () =>
      vest("#4A6A9A", "#5A5A64") +
      `<rect x="38" y="95" width="9" height="7" fill="#141416" stroke="#F2C318" stroke-width=".8"/><circle cx="77" cy="98" r="4" fill="#C8302C" stroke="#141416" stroke-width=".8"/>` +
      raio(77, 98, 0.3, "#F2F2F2") +
      `<rect x="43" y="106" width="6" height="5" rx="1" fill="#2FB344" stroke="#141416" stroke-width=".6"/>` +
      star5(72, 108, 2.6, "#F2F2F2") +
      topHem
  },
  {
    id: "rock_flanela",
    p: "rock",
    slot: "top",
    name: "Flanela grunge",
    price: 110,
    svg: () => plaid("#3F5A2A", "#141416")
  },
  {
    id: "rock_regata",
    p: "rock",
    slot: "top",
    name: "Regata cavada",
    price: 80,
    svg: () => tank("#1E1F24", "#C8302C", "") + raio(60, 118, 1.3)
  },
  {
    id: "rock_camiseta_trovao",
    p: "rock",
    slot: "top",
    name: "Camiseta Trovão Elétrico",
    price: 110,
    svg: () => camisetaRock("#141416", "#FFC21A", "TROVÃO", "ELÉTRICO", raio(60, 117, 0.55))
  },
  {
    id: "rock_camiseta_turne",
    p: "rock",
    slot: "top",
    name: "Camiseta da turnê",
    price: 110,
    svg: () =>
      camisetaRock(
        "#5A5A64",
        "#F2F2F2",
        "OS VOLTS",
        "",
        `<text x="60" y="111" font-size="4.2" text-anchor="middle" fill="#F2C14E" font-family="Bungee,sans-serif">TURNÊ 2026</text>${[115, 119].map(y => `<path d="M53 ${y}H67" stroke="#C9CED6" stroke-width="1"/>`).join("")}`
      )
  },
  {
    id: "rock_t_nirvana",
    p: "rock",
    slot: "top",
    name: "Camiseta Sorriso Grunge",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#FFD86B", "SORRISO", "", '<circle cx="60" cy="114" r="3.8" fill="none" stroke="#FFD86B" stroke-width=".9"/><path d="M58 113l1 1M59 113l-1 1M61 113l1 1M62 113l-1 1M58 116q2 1.4 4 0" stroke="#FFD86B" stroke-width=".6" fill="none"/>')
  },
  {
    id: "rock_t_acdc",
    p: "rock",
    slot: "top",
    name: "Camiseta Alta Voltagem",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#E0312F", "ALTA", "VOLTAGEM", raio(60, 115, 0.65, "#FFC21A"))
  },
  {
    id: "rock_t_queen",
    p: "rock",
    slot: "top",
    name: "Camiseta Realeza",
    price: 100,
    svg: () =>
      camisetaRock("#1E1F24", "#F2C14E", "REALEZA", "", '<path d="M56 115l-1-4 2.5 2 2.5-3 2.5 3 2.5-2-1 4z" fill="#F2C14E"/>')
  },
  {
    id: "rock_t_guns",
    p: "rock",
    slot: "top",
    name: "Camiseta Balas & Rosas",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#FFD86B", "BALAS &", "ROSAS", '<circle cx="57" cy="114" r="2" fill="#C8102E"/><circle cx="63" cy="114" r="2" fill="#C8102E"/>')
  },
  {
    id: "rock_t_metallica",
    p: "rock",
    slot: "top",
    name: "Camiseta Metálica",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#C9CED6", "METÁLICA", "", '<path d="M53 113l7 4 7-4" stroke="#C9CED6" stroke-width="1" fill="none"/>')
  },
  {
    id: "rock_t_pinkfloyd",
    p: "rock",
    slot: "top",
    name: "Camiseta Prisma Cósmico",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#F2F2F2", "PRISMA", "", '<polygon points="60,111 56,117 64,117" fill="none" stroke="#F2F2F2" stroke-width=".8"/><path d="M60 114h5" stroke="#FF4FD8" stroke-width=".8"/>')
  },
  {
    id: "rock_t_stones",
    p: "rock",
    slot: "top",
    name: "Camiseta Pedras Rolantes",
    price: 100,
    svg: () =>
      camisetaRock("#1E1F24", "#F2F2F2", "PEDRAS", "", '<ellipse cx="60" cy="113" rx="4" ry="2.5" fill="#C8102E"/><path d="M58 114c0 3 4 3 4 0" fill="#E0312F"/>')
  },
  {
    id: "rock_t_led",
    p: "rock",
    slot: "top",
    name: "Camiseta Dirigível",
    price: 100,
    svg: () =>
      camisetaRock("#22232A", "#E8C24A", "DIRIGÍVEL", "", '<ellipse cx="60" cy="114" rx="5" ry="2" fill="#A8B0BC"/>')
  },
  {
    id: "rock_t_sabbath",
    p: "rock",
    slot: "top",
    name: "Camiseta Sábado Negro",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#9A4FD8", "SÁBADO", "NEGRO", '<path d="M60 111v6M58 113h4" stroke="#9A4FD8" stroke-width="1.2"/>')
  },
  {
    id: "rock_t_maiden",
    p: "rock",
    slot: "top",
    name: "Camiseta Donzela de Ferro",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#E0312F", "DONZELA", "", '<circle cx="60" cy="114" r="3" fill="#E8C24A"/><circle cx="59" cy="113" r=".6" fill="#C8102E"/><circle cx="61" cy="113" r=".6" fill="#C8102E"/>')
  },
  {
    id: "rock_t_rhcp",
    p: "rock",
    slot: "top",
    name: "Camiseta Pimenta Ardida",
    price: 100,
    svg: () =>
      camisetaRock("#1E1F24", "#F2F2F2", "PIMENTA", "", '<path d="M60 110v8M56 114h8M57 111l6 6M63 111l-6 6" stroke="#C8102E" stroke-width="1.4"/>')
  },
  {
    id: "rock_t_arctic",
    p: "rock",
    slot: "top",
    name: "Camiseta Macacos do Gelo",
    price: 100,
    svg: () =>
      camisetaRock("#141416", "#F2F2F2", "MACACOS", "", '<path d="M54 114q3-3 6 0t6 0" stroke="#F2F2F2" stroke-width="1" fill="none"/>')
  },
  {
    id: "rock_t_strokes",
    p: "rock",
    slot: "top",
    name: "Camiseta Os Traços",
    price: 100,
    svg: () =>
      camisetaRock("#1E1F24", "#FF8A00", "OS TRAÇOS", "", '<circle cx="60" cy="114" r="3" fill="none" stroke="#FF8A00" stroke-width="1"/>')
  },
  {
    id: "rock_t_radiohead",
    p: "rock",
    slot: "top",
    name: "Camiseta Cabeça de Rádio",
    price: 100,
    svg: () =>
      camisetaRock("#1B1B1E", "#E0312F", "CABEÇA", "DE RÁDIO", '<circle cx="60" cy="114" r="2.8" fill="#F2F2F2"/><circle cx="59" cy="113" r=".5" fill="#141416"/><circle cx="61" cy="113" r=".5" fill="#141416"/>')
  },
  {
    id: "rock_t_legiao",
    p: "rock",
    slot: "top",
    name: "Camiseta Legião da Cidade",
    price: 100,
    svg: () =>
      camisetaRock("#25262B", "#F2F2F2", "LEGIÃO", "", '<path d="M57 114h6M61 112l2 2-2 2" stroke="#F2F2F2" stroke-width=".9" fill="none"/>')
  },
  {
    id: "rock_zebra",
    p: "rock",
    slot: "top",
    name: "Blusa de zebra glam",
    price: 120,
    svg: () =>
      topBase("#F2F2F2") +
      Array.from({ length: 8 }, (_, i) => {
        const y = 92 + i * 7;
        return `<path d="M${i % 2 ? 30 : 20} ${y}Q40 ${y - 4} 52 ${y + 1}Q60 ${y + 4} 68 ${y}Q82 ${y - 5} ${i % 2 ? 92 : 100} ${y + 2}" stroke="#141416" stroke-width="${2.4 + (i % 3) * 0.6}" stroke-linecap="round" fill="none"/>`;
      }).join("") +
      `<path d="M47 88Q60 99 73 88" fill="none" stroke="#FF4FD8" stroke-width="3"/>` +
      topHem
  },
  {
    id: "rock_jaqueta_jeans",
    p: "rock",
    slot: "top",
    name: "Jaqueta jeans",
    price: 140,
    svg: () =>
      jacket("#4A6A9A", "#F2F2F2", "#3A5A88") +
      [100, 114, 128].map(y => `<circle cx="72" cy="${y}" r="1.6" fill="#B8975A"/>`).join("") +
      `<path d="M22 112H40M80 112H98" stroke="#E6C27A" stroke-width="1" stroke-dasharray="2 1.5"/>`
  },
  {
    id: "rock_camiseta_estrelas",
    p: "rock",
    slot: "top",
    name: "Camiseta cinco estrelas",
    price: 130,
    svg: () =>
      tee(
        "#10163A",
        [48, 60, 72].map((x, i) => star5(x, i === 1 ? 97 : 99, 5.2, "#F2C14E")).join("") +
          TRASTES.map((c, i) => gema(50 + i * 5, 109, c, 2.4)).join("")
      )
  },

  /* ===================== cintura ===================== */
  {
    id: "rock_cinto_balas",
    p: "rock",
    slot: "waist",
    name: "Cinto de balas",
    price: 100,
    svg: () =>
      `<rect x="0" y="109" width="120" height="9" fill="#2B1D14"/>${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 6 + 1}" y="105" width="3.4" height="13" rx="1.4" fill="#E8C24A" stroke="#8A6A3A" stroke-width=".5"/>`).join("")}`
  },
  {
    id: "rock_fivela",
    p: "rock",
    slot: "waist",
    name: "Fivela de estrela",
    price: 80,
    svg: () =>
      `<rect x="0" y="110" width="120" height="7" fill="#1E1F24"/><rect x="51" y="106" width="18" height="15" rx="3" fill="#C9CED6" stroke="#141416"/>` +
      star5(60, 113.5, 5, "#E8C24A")
  },
  {
    id: "rock_kilt",
    p: "rock",
    slot: "waist",
    name: "Kilt punk",
    price: 110,
    svg: () =>
      `<path d="M10 110H110L124 150H-4Z" fill="#2E5A2A"/>${[34, 46, 58, 70, 82].map(x => `<path d="M${x} 110L${x + (x - 60) / 4} 150" stroke="#C8302C" stroke-width="1.6"/>`).join("")}<path d="M0 124H120M0 136H120" stroke="#141416" stroke-width="2" opacity=".6"/><rect x="0" y="108" width="120" height="5" fill="#141416"/>` +
      alfinete(70, 126, 70)
  },

  /* ===================== bottons ===================== */
  {
    id: "rock_bottons",
    p: "rock",
    slot: "pins",
    name: "Bottons de palheta",
    price: 60,
    svg: () =>
      palheta(49, 104, "#E0312F", 1.1) +
      palheta(72, 108, "#2F6FD6", 1) +
      raio(54, 122, 0.55) +
      palheta(66, 124, "#F2C318", 0.9)
  },

  /* ===================== costas ===================== */
  {
    id: "rock_guitarra_costas",
    p: "rock",
    slot: "back",
    name: "Guitarra nas costas",
    price: 150,
    svg: () =>
      `<g transform="rotate(-32 60 80)"><rect x="57" y="-6" width="6" height="58" fill="#3A2A1E" ${O} stroke-width="1.6"/><path d="M55 -12H65V-4H55Z" fill="#141416"/><path d="M60 46C78 44 80 58 72 64C82 70 78 92 60 92C42 92 40 74 48 66C40 58 44 46 60 46Z" fill="#C8302C" ${O}/></g><path d="M28 56L92 108" stroke="#141416" stroke-width="3"/>`
  },
  {
    id: "rock_case",
    p: "rock",
    slot: "back",
    name: "Case com adesivos",
    price: 120,
    svg: () =>
      `<g transform="rotate(24 60 80)"><path d="M48 10H72V44Q86 50 84 72Q82 96 60 98Q38 96 36 72Q34 50 48 44Z" fill="#1E1F24" ${O}/><circle cx="56" cy="64" r="5" fill="#F2C318"/><rect x="62" y="74" width="12" height="7" fill="#E0312F"/>${star5(52, 82, 4, "#F2F2F2")}</g>`
  },

  /* ===================== pulso ===================== */
  {
    id: "rock_munhequeira_spikes",
    p: "rock",
    slot: "wrist",
    name: "Munhequeira de spikes",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6" y="-4" width="12" height="8" rx="2" fill="#141416"/>${[-4, 0, 4].map(i => `<path d="M${i - 1.6} -4L${i} -9L${i + 1.6} -4Z" fill="#C9CED6"/>`).join("")}`
      )
  },
  {
    id: "rock_munhequeira_listrada",
    p: "rock",
    slot: "wrist",
    name: "Munhequeira de suor",
    price: 40,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6" y="-4.5" width="12" height="9" rx="3" fill="#F2F2F2" stroke="#141416" stroke-width=".8"/><path d="M-6 -1.4H6M-6 1.4H6" stroke="#E0312F" stroke-width="1.4"/>`
      )
  },

  /* ===================== mãos ===================== */
  {
    id: "rock_controle",
    p: "rock",
    slot: "hand",
    name: "Controle de guitarra",
    price: 180,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-38)"><rect x="-2.6" y="-34" width="5.2" height="30" fill="#F2F2F2" stroke="#141416" stroke-width="1.2"/>${TRASTES.map((c, i) => `<rect x="-2" y="${-31 + i * 4.6}" width="4" height="3.4" rx=".8" fill="${c}"/>`).join("")}<rect x="-4" y="-38" width="8" height="5" rx="1.4" fill="#141416"/><path d="M0 -8C10 -8 11 -2 7 1C12 4 11 13 0 13C-11 13 -12 4 -7 1C-11 -2 -10 -8 0 -8Z" fill="#E0312F" stroke="#141416" stroke-width="1.6"/><rect x="-5" y="1" width="10" height="3" rx="1.4" fill="#F2F2F2" stroke="#141416" stroke-width=".7"/><path d="M5 6L11 10" stroke="#C9CED6" stroke-width="1.4"/></g>`
      )
  },
  {
    id: "rock_chifrinho",
    p: "rock",
    slot: "hand",
    name: "Mão de chifrinho",
    price: 50,
    // indicador e mindinho pra cima, os do meio dobrados
    svg: (x, y) =>
      H(
        x,
        y,
        `<g fill="var(--mascot, #F6F3F8)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"><path d="M-6 -3L-10 -17Q-8.6 -19.4 -6.6 -17.6L-2.4 -4Z"/><path d="M6 -3L10 -17Q8.6 -19.4 6.6 -17.6L2.4 -4Z"/><path d="M-7 6Q-9 -2 -6 -4H6Q9 -2 7 6Q4 10 -1 10Q-5 9 -7 6Z"/></g><path d="M-3 -4Q-2.4 -7 0 -6.6Q2.4 -7 3 -4" fill="none" stroke="var(--ink)" stroke-width="1.2"/><path d="M-4 1H3" stroke="var(--ink)" stroke-width="1.2" stroke-linecap="round"/>`
      )
  },
  {
    id: "rock_baquetas",
    p: "rock",
    slot: "hand",
    name: "Baquetas",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-8 12L8 -16M8 12L-8 -16" stroke="#D9B48A" stroke-width="3" stroke-linecap="round"/><path d="M-8 12L8 -16M8 12L-8 -16" stroke="#9C7148" stroke-width=".8" stroke-linecap="round"/><circle cx="8" cy="-16" r="1.8" fill="#F2EAD3"/><circle cx="-8" cy="-16" r="1.8" fill="#F2EAD3"/>`
      )
  },
  {
    id: "rock_baixo",
    p: "rock",
    slot: "hand",
    name: "Contrabaixo",
    price: 150,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-42)"><rect x="-2" y="-40" width="4" height="34" fill="#3A2A1E" stroke="#141416" stroke-width="1"/><rect x="-4" y="-46" width="8" height="7" rx="1.4" fill="#141416"/><path d="M0 -10C9 -12 12 -4 8 0C13 6 10 15 0 15C-10 15 -13 6 -8 0C-12 -4 -9 -12 0 -10Z" fill="#2F6FD6" stroke="#141416" stroke-width="1.6"/><path d="M-1.2 -38V10M1.2 -38V10" stroke="#C9CED6" stroke-width=".5"/><rect x="-4" y="3" width="8" height="3" fill="#141416"/></g>`
      )
  },
  {
    id: "rock_flying_v",
    p: "rock",
    slot: "hand",
    name: "Guitarra em V",
    price: 160,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-36)"><rect x="-2" y="-34" width="4" height="28" fill="#2B2B33" stroke="#141416" stroke-width="1"/><path d="M-2 -38H2L4 -34H-4Z" fill="#141416"/><path d="M0 -8L-12 16L-6 16L0 4L6 16L12 16Z" fill="#F2F2F2" stroke="#141416" stroke-width="1.6" stroke-linejoin="round"/><path d="M-3 2H3" stroke="#141416" stroke-width="2"/></g>`
      )
  },
  {
    id: "rock_keytar",
    p: "rock",
    slot: "hand",
    name: "Teclado-guitarra",
    price: 150,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-28)"><path d="M-14 -4H10L18 -14H22L14 6H-14Z" fill="#E8337A" stroke="#141416" stroke-width="1.4"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${-12 + i * 3.6}" y="-3" width="3" height="7" fill="#F2F2F2" stroke="#141416" stroke-width=".4"/>`).join("")}${[0, 1, 3, 4].map(i => `<rect x="${-10.2 + i * 3.6}" y="-3" width="1.8" height="4" fill="#141416"/>`).join("")}</g>`
      )
  },
  {
    id: "rock_isqueiro",
    p: "rock",
    slot: "hand",
    name: "Isqueiro aceso",
    price: 40,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-4" y="-6" width="8" height="14" rx="1.4" fill="#C9CED6" stroke="#141416" stroke-width="1"/><rect x="-4" y="-9" width="5" height="3" fill="#8C8A96"/><path class="chama" d="M0 -20Q4 -14 2 -11Q0 -9 -2 -11Q-4 -14 0 -20Z" fill="#FFB020"/><circle cy="-14" r="7" fill="#FFB020" opacity=".18"/>`
      )
  },
  {
    id: "rock_microfone_retro",
    p: "rock",
    slot: "hand",
    name: "Microfone retrô",
    price: 100,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 6V16" stroke="#C9CED6" stroke-width="2.4"/><rect x="-7" y="-14" width="14" height="20" rx="7" fill="#C9CED6" stroke="#141416" stroke-width="1.4"/>${[-9, -5, -1, 3].map(y => `<path d="M-6 ${y}H6" stroke="#8C8A96" stroke-width="1"/>`).join("")}`
      )
  },
  {
    id: "rock_vinil",
    p: "rock",
    slot: "hand",
    name: "Disco de vinil",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<circle r="11" fill="#141416"/><circle r="8" fill="none" stroke="#2B2B33"/><circle r="5.4" fill="none" stroke="#2B2B33"/><circle r="3.6" fill="#E0312F"/><circle r=".9" fill="#F2F2F2"/>`
      )
  },

  /* ===================== companheiros ===================== */
  {
    id: "rock_pet_bulldog",
    p: "rock",
    slot: "pet",
    name: "Buldogue de coleira",
    price: 140,
    svg: () =>
      `<g transform="translate(16 124)"><ellipse cx="2" cy="6" rx="10" ry="7" fill="#C9A06A" stroke="var(--ink)" stroke-width="1.1"/><circle cx="-2" cy="-5" r="8" fill="#C9A06A" stroke="var(--ink)" stroke-width="1.1"/><path d="M-9 -9L-12 -4L-7 -6ZM5 -9L8 -4L3 -6Z" fill="#8A6A3A"/><ellipse cx="-2" cy="-1" rx="4.4" ry="3" fill="#F2E2C8"/><circle cx="-2" cy="-2.4" r="1.2" fill="#141416"/><circle cx="-5" cy="-6" r="1" fill="#141416"/><circle cx="1" cy="-6" r="1" fill="#141416"/><path d="M-9 1H5" stroke="#141416" stroke-width="2.4"/>${[-7, -3, 1].map(x => `<path d="M${x - 1} 2L${x} 5L${x + 1} 2Z" fill="#C9CED6"/>`).join("")}</g>`
  },
  {
    id: "rock_pet_gato",
    p: "rock",
    slot: "pet",
    name: "Gato de moicano",
    price: 120,
    svg: () =>
      `<g transform="translate(14 118)"><path d="M10 6Q18 2 16 -8" fill="none" stroke="#141416" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="2" cy="4" rx="9" ry="7" fill="#141416"/><circle cx="0" cy="-6" r="6.5" fill="#141416"/><path d="M-6 -8L-6 -15L-1.5 -11ZM6 -8L6 -15L1.5 -11Z" fill="#141416"/><path d="M-2 -12L0 -19L2 -12L3 -18L4 -11" fill="#FF4FD8"/><ellipse cx="-2.4" cy="-6.5" rx="1.4" ry="1.8" fill="#5FD06C"/><ellipse cx="2.4" cy="-6.5" rx="1.4" ry="1.8" fill="#5FD06C"/></g>`
  },
  {
    id: "rock_pet_amp",
    p: "rock",
    slot: "pet",
    name: "Amplificador falante",
    price: 150,
    svg: () =>
      `<g transform="translate(6 112)">${amp(0, 0, 22, 26)}<circle cx="8" cy="16" r="1.6" fill="#F2F2F2"/><circle cx="14" cy="16" r="1.6" fill="#F2F2F2"/><path d="M8 21Q11 24 14 21" stroke="#F2F2F2" fill="none" stroke-width="1.2"/><path class="pisca" d="M24 6q3 2 0 4M27 4q5 4 0 8" stroke="var(--muted)" fill="none"/></g>`
  },
  {
    id: "rock_pet_pato",
    p: "rock",
    slot: "pet",
    name: "Patinho punk",
    price: 100,
    svg: () =>
      `<g transform="translate(16 128)"><ellipse cx="2" cy="4" rx="10" ry="7" fill="#F2C318" stroke="var(--ink)" stroke-width="1.1"/><circle cx="-3" cy="-5" r="6" fill="#F2C318" stroke="var(--ink)" stroke-width="1.1"/><path d="M-9 -5L-14 -3L-9 -2Z" fill="#F07A1A"/><circle cx="-4" cy="-6" r="1" fill="#141416"/><path d="M-3 -11L-2 -17L0 -11L2 -16L2 -10" fill="#5FD06C" stroke="#2E8A3E" stroke-width=".5"/></g>`
  },

  /* ===================== fio ===================== */
  {
    id: "rock_fio_cabo",
    p: "rock",
    slot: "string",
    name: "Cabo de guitarra",
    price: 70,
    svg: () =>
      `<path d="M60 -40Q56 -34 60 -28Q64 -22 60 -16Q56 -10 60 -4Q64 2 60 8Q57 13 60 19" fill="none" stroke="#141416" stroke-width="2.2"/><rect x="57.6" y="-44" width="4.8" height="7" rx="1" fill="#C9CED6" stroke="#141416" stroke-width=".7"/>`
  },
  {
    id: "rock_fio_palhetas",
    p: "rock",
    slot: "string",
    name: "Fio de palhetas",
    price: 60,
    svg: () =>
      `<line x1="60" y1="-40" x2="60" y2="19" stroke="#8C8A96" stroke-width="1.2"/>` +
      TRASTES.map((c, i) => palheta(60, -32 + i * 10, c, 0.9)).join("")
  },
  {
    id: "rock_fio_luzes",
    p: "rock",
    slot: "string",
    name: "Fio de luzes de palco",
    price: 80,
    svg: () =>
      `<line x1="60" y1="-40" x2="60" y2="19" stroke="#2B2B33" stroke-width="1.4"/>` +
      TRASTES.map(
        (c, i) =>
          `<circle class="pisca" style="animation-delay:${i * 0.3}s" cx="60" cy="${-32 + i * 10}" r="2.6" fill="${c}"/>`
      ).join("")
  },

  /* ===================== cenários ===================== */
  {
    id: "rock_bg_amps",
    p: "rock",
    slot: "bg",
    name: "Paredão de amplificadores",
    price: 170,
    svg: () =>
      amp(0, 60, 26, 30) +
      amp(0, 92, 26, 30) +
      amp(0, 124, 26, 24) +
      amp(94, 60, 26, 30) +
      amp(94, 92, 26, 30) +
      amp(94, 124, 26, 24) +
      `<path d="M0 148H120" stroke="#3A3A44" stroke-width="2"/>`
  },
  {
    id: "rock_bg_estadio",
    p: "rock",
    slot: "bg",
    name: "Estádio lotado",
    price: 180,
    svg: () => {
      let s = `<path d="M20 -6L0 60V-6Z" fill="#FFF6C8" opacity=".14"/><path d="M100 -6L120 60V-6Z" fill="#FFF6C8" opacity=".14"/><path d="M0 116Q60 96 120 116V148H0Z" fill="#2B2B33" opacity=".5"/>`;
      for (let i = 0; i < 26; i++)
        s += `<circle cx="${(i * 47) % 120}" cy="${120 + ((i * 13) % 26)}" r="${i % 3 ? 0.9 : 1.4}" class="pisca" style="animation-delay:${((i * 0.27) % 2).toFixed(2)}s" fill="#FFB020"/>`;
      return s;
    }
  },
  {
    id: "rock_bg_garagem",
    p: "rock",
    slot: "bg",
    name: "Garagem de ensaio",
    price: 140,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#5A5A64" opacity=".2"/>${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${i * 12}H120" stroke="#5A5A64" stroke-width="1.2" opacity=".35"/>`).join("")}<g transform="translate(96 118)"><ellipse rx="14" ry="5" fill="#C8302C"/><rect x="-14" y="0" width="28" height="18" fill="#C8302C"/><ellipse cy="18" rx="14" ry="5" fill="#8A1F1C"/><ellipse rx="14" ry="5" fill="none" stroke="#C9CED6"/></g><g transform="translate(14 126)"><ellipse rx="10" ry="3.4" fill="#E8C24A"/><path d="M0 0V22" stroke="#8C8A96" stroke-width="1.4"/></g><rect x="4" y="10" width="22" height="30" fill="#141416" transform="rotate(-6 15 25)"/><text x="15" y="28" font-size="4.4" text-anchor="middle" fill="#F2C318" font-family="Bungee,sans-serif" transform="rotate(-6 15 25)">CABO P10</text>`
  },
  {
    id: "rock_bg_estudio",
    p: "rock",
    slot: "bg",
    name: "Estúdio de gravação",
    price: 160,
    svg: () => {
      let espuma = "";
      for (let y = 0; y < 100; y += 10)
        for (let x = (y / 10) % 2 ? 5 : 0; x < 120; x += 10)
          espuma += `<path d="M${x} ${y}l5 5-5 5-5-5z" fill="#2B2B33" opacity=".22"/>`;
      return `${espuma}<rect x="40" y="0" width="40" height="14" rx="3" fill="#C8302C" class="pisca"/><text x="60" y="10" font-size="7" text-anchor="middle" fill="#fff" font-family="Bungee,sans-serif">NO AR</text><rect x="0" y="122" width="120" height="26" fill="#2B2B33" opacity=".85"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${6 + i * 10} 126V144" stroke="#5A5A64" stroke-width="1.4"/><rect x="${3 + i * 10}" y="${128 + ((i * 7) % 12)}" width="6" height="3" fill="${TRASTES[i % 5]}"/>`).join("")}`;
    }
  },
  {
    id: "rock_bg_onibus",
    p: "rock",
    slot: "bg",
    name: "Ônibus da turnê",
    price: 150,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="100" fill="#F07A1A" opacity=".18"/><circle cx="100" cy="30" r="12" fill="#F2C14E" opacity=".7"/><path d="M0 132H120V148H0Z" fill="#3A3A44" opacity=".6"/><path d="M0 140H120" stroke="#F2F2F2" stroke-dasharray="8 6"/><g transform="translate(-4 104)"><rect width="44" height="26" rx="4" fill="#1E1F24"/>${[4, 14, 24].map(x => `<rect x="${x}" y="5" width="8" height="7" fill="#4FE3FF" opacity=".6"/>`).join("")}<circle cx="10" cy="27" r="4.4" fill="#141416"/><circle cx="34" cy="27" r="4.4" fill="#141416"/><text x="22" y="22" font-size="4" text-anchor="middle" fill="#F2C318" font-family="Bungee,sans-serif">TURNÊ</text></g>`
  },
  {
    id: "rock_bg_estrada",
    p: "rock",
    slot: "bg",
    name: "Estrada de notas",
    price: 200,
    // a pista do videogame de guitarra: 5 trilhas que vêm de longe, notas coloridas e a linha de acerto
    svg: () => {
      const baixo = i => -4 + i * 25.6; // as 6 linhas das 5 trilhas, no pé do cenário
      const trilha = i => `M${54 + i * 3} -6L${baixo(i)} 148`;
      let s = `<path d="M54 -6H69L124 148H-4Z" fill="#141416" opacity=".55"/>`;
      for (let i = 0; i <= 5; i++)
        s += `<path d="${trilha(i)}" stroke="#C9CED6" stroke-width=".7" opacity=".6"/>`;
      for (let k = 1; k < 7; k++) {
        const y = -6 + k * k * 3.4;
        const t = (y + 6) / 154;
        s += `<path d="M${54 - 58 * t} ${y}H${69 + 55 * t}" stroke="#C9CED6" stroke-width=".5" opacity=".4"/>`;
      }
      [
        [0, 70],
        [2, 96],
        [4, 40],
        [1, 118],
        [3, 60]
      ].forEach(([i, y]) => {
        const t = (y + 6) / 154;
        const x = 55.5 + i * 3 + (baixo(i) + 12.8 - (55.5 + i * 3)) * t;
        s += gema(x.toFixed(1), y, TRASTES.at(i), 3 + 5 * t);
      });
      s += TRASTES.map(
        (c, i) =>
          `<circle cx="${(baixo(i) + 12.8).toFixed(1)}" cy="140" r="8" fill="none" stroke="${c}" stroke-width="2.6"/>`
      ).join("");
      return s;
    }
  },
  {
    id: "rock_bg_raios",
    p: "rock",
    slot: "bg",
    name: "Tempestade elétrica",
    price: 140,
    svg: () =>
      `<path d="M0 -6H120V40Q60 30 0 40Z" fill="#2B2B33" opacity=".35"/><path class="pisca" d="M22 10L12 40H20L10 72L32 32H22L30 10Z" fill="#F2C318" opacity=".85"/><path class="pisca" style="animation-delay:.7s" d="M98 4L88 30H96L86 60L106 24H97L104 4Z" fill="#4FE3FF" opacity=".75"/>`
  },
  {
    id: "rock_bg_festival",
    p: "rock",
    slot: "bg",
    name: "Festival na lama",
    price: 150,
    svg: () =>
      `<path d="M0 126Q30 120 60 126T120 124V148H0Z" fill="#6B4A30" opacity=".7"/><path d="M4 126L18 104L32 126Z" fill="#E0312F" opacity=".75"/><path d="M88 126L102 100L116 126Z" fill="#2F6FD6" opacity=".75"/>${[8, 30, 92, 112].map((x, i) => `<path d="M${x} 104V70" stroke="#5A5A64"/><path d="M${x} 70l10 3-10 3z" fill="${TRASTES[i]}"/>`).join("")}`
  },

  /* ===================== pele ===================== */
  {
    id: "rock_pele_cromada",
    p: "rock",
    slot: "skin",
    name: "Cromado",
    price: 140,
    color: "#C9CED6",
    ink: "#141416",
    svg: () =>
      `<path d="M30 40Q34 34 42 30M28 60Q30 50 34 46" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/><path d="M84 96Q90 86 92 74" stroke="#8C8A96" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/>`
  },
  {
    id: "rock_pele_tatuada",
    p: "rock",
    slot: "skin",
    name: "Tatuado",
    price: 160,
    color: "#F6F0EA",
    ink: "#141416",
    svg: () =>
      `<g opacity=".85"><path d="M30 92l-4-6q4-1 6 2l6-6q2 4-2 7l4 3q-4 2-7 0z" fill="#2F4F8F"/><path d="M84 92l-7-6.6a4 4 0 0 1 7-4.2 4 4 0 0 1 7 4.2z" fill="#C8302C"/><path d="M74 94Q84 90 94 94" stroke="#141416" fill="#F2F2F2" stroke-width=".8"/><text x="84" y="94" font-size="3.4" text-anchor="middle" fill="#141416" font-family="Caveat,cursive">rock</text>` +
      star5(40, 112, 5, "#141416") +
      `</g>`
  },
  {
    id: "rock_pele_neon",
    p: "rock",
    slot: "skin",
    name: "Neon",
    price: 180,
    color: "#1E1A2E",
    ink: "#F2F2F2",
    svg: () =>
      `<path d="M60 26C84 26 98 44 98 63C98 84 76 106 60 129C44 106 22 84 22 63C22 44 36 26 60 26Z" fill="none" stroke="#FF4FD8" stroke-width="2" opacity=".8" class="pisca"/>`
  },

  /* ===================== lendários (conquistas em js/conquistas.js) ===================== */
  {
    id: "rock_asas_fogo",
    p: "rock",
    slot: "back",
    name: "Asas de fogo",
    ach: "star_power",
    svg: () =>
      `<g class="wings"><path d="M26 66Q8 50 -2 30Q12 38 14 30Q20 42 24 34Q26 50 32 56Z" fill="#F07A1A" ${O}/><path d="M24 62Q12 50 6 40Q14 44 16 38Q20 48 26 54Z" fill="#F2C318"/><path d="M94 66Q112 50 122 30Q108 38 106 30Q100 42 96 34Q94 50 88 56Z" fill="#F07A1A" ${O}/><path d="M96 62Q108 50 114 40Q106 44 104 38Q100 48 94 54Z" fill="#F2C318"/></g>`
  },
  {
    id: "rock_guitarra_star",
    p: "rock",
    slot: "hand",
    name: "Guitarra Star Power",
    ach: "solo_epico",
    svg: (x, y) =>
      H(
        x,
        y,
        `<circle r="18" fill="#4FA3FF" opacity=".22"/>` +
          guitar("#4FA3FF", "#10163A") +
          `<path d="M-14 -20L-8 -12H-12L-6 -2" stroke="#BFE3FF" stroke-width="1.4" fill="none" class="pisca"/><path d="M14 -16L9 -9H12L6 0" stroke="#BFE3FF" stroke-width="1.4" fill="none" class="pisca" style="animation-delay:.4s"/>`
      )
  },
  {
    id: "rock_terno_dourado",
    p: "rock",
    slot: "top",
    name: "Terno dourado de rockstar",
    ach: "turne",
    svg: () =>
      jacket("#E8C24A", "#141416", "#C9A227") +
      [0, 1, 2, 3, 4, 5]
        .map(i => brilhinho(20 + i * 16, 100 + (i % 2) * 22, 2.2, "#FFFFFF", i * 0.3))
        .join("")
  }
);
