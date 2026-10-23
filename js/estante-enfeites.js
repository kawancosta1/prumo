/*
  Decoração da Estante: móveis, fundos de parede e enfeites, comprados com "páginas" (js/leitura.js).
  Cada enfeite é desenhado em volta de (0, 0) = o meio da base dele, em pé sobre a prateleira.
  w = largura que ocupa na prateleira. mundo = só aparece naquele mundo (regra: mundos não se misturam).
  ach = lendário, liberado por uma conquista de leitura.
*/
"use strict";

/* ---------- móveis: cor da madeira, das bordas e o formato ---------- */
const MOVEIS = [
  { id: "clara", nome: "Madeira clara", preco: 0, cor: "#D9B48A", borda: "#9C7148", fundo: "#C49A6C" },
  { id: "escura", nome: "Madeira escura", preco: 150, cor: "#6B4A30", borda: "#3F2A1A", fundo: "#553A25" },
  { id: "preta", nome: "Preta", preco: 200, cor: "#2B2B33", borda: "#141416", fundo: "#1E1F24" },
  { id: "branca", nome: "Branca", preco: 200, cor: "#EDEAE4", borda: "#B8B2A8", fundo: "#DCD7CF" },
  {
    id: "caixote",
    nome: "Caixotes",
    preco: 250,
    cor: "#C9A46B",
    borda: "#8A6A3A",
    fundo: "#B48E57",
    caixote: true
  },
  {
    id: "gotica",
    nome: "Armário gótico",
    preco: 400,
    cor: "#1E1218",
    borda: "#B8975A",
    fundo: "#140C10",
    gotico: true,
    mundo: "emo"
  },
  {
    id: "case_rock",
    nome: "Estante de cases",
    preco: 300,
    cor: "#2B2B33",
    borda: "#C9CED6",
    fundo: "#1E1F24",
    mundo: "rock"
  }
];

/* ---------- fundos de parede (desenhados atrás da estante) ---------- */
const FUNDOS = [
  {
    id: "liso",
    nome: "Parede lisa",
    preco: 0,
    svg: (W, H) => `<rect width="${W}" height="${H}" fill="var(--sunken)"/>`
  },
  {
    id: "tijolo",
    nome: "Tijolinho",
    preco: 120,
    svg: (W, H) => {
      let s = `<rect width="${W}" height="${H}" fill="#B5654A"/>`;
      for (let y = 0, i = 0; y < H; y += 14, i++)
        for (let x = i % 2 ? -14 : 0; x < W; x += 28)
          s += `<rect x="${x + 1}" y="${y + 1}" width="26" height="12" rx="1" fill="#C7765A"/>`;
      return s;
    }
  },
  {
    id: "listras",
    nome: "Papel listrado",
    preco: 100,
    svg: (W, H) =>
      `<rect width="${W}" height="${H}" fill="#E8DDEB"/>${Array.from({ length: Math.ceil(W / 24) }, (_, i) => `<rect x="${i * 24}" width="10" height="${H}" fill="#D7C6DC"/>`).join("")}`
  },
  {
    id: "estrelas",
    nome: "Céu de estrelas",
    preco: 160,
    svg: (W, H) =>
      `<rect width="${W}" height="${H}" fill="#1A2040"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % W}" cy="${(i * 53) % H}" r="${i % 3 ? 0.9 : 1.6}" fill="#F2EAD3" opacity=".8"/>`).join("")}`
  },
  {
    id: "posteres",
    nome: "Pôsteres de banda",
    preco: 180,
    mundo: "emo",
    svg: (W, H, opts = {}) => {
      const x1 = opts && opts.noQuarto ? 116 : 14;
      const y1 = opts && opts.noQuarto ? 16 : 10;
      const x2 = opts && opts.noQuarto ? 154 : W - 50;
      const y2 = opts && opts.noQuarto ? 38 : 12;
      return `<rect width="${W}" height="${H}" fill="#2A1F33"/><g transform="translate(${x1} ${y1}) rotate(-5)"><rect width="34" height="44" fill="#141416" stroke="#C8102E"/><text x="17" y="16" font-size="6" text-anchor="middle" fill="#E0314F" font-family="Bungee,sans-serif">LUA</text><text x="17" y="24" font-size="6" text-anchor="middle" fill="#E0314F" font-family="Bungee,sans-serif">FRIA</text><rect x="2" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(-20 5 0)" opacity=".85"/><rect x="24" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(20 28 0)" opacity=".85"/></g><g transform="translate(${x2} ${y2}) rotate(4)"><rect width="36" height="46" fill="#F2EAD3"/><text x="18" y="16" font-size="5" text-anchor="middle" fill="#141416" font-family="Bungee,sans-serif">VAMPIROS</text><text x="18" y="23" font-size="5" text-anchor="middle" fill="#141416" font-family="Bungee,sans-serif">DE SÁBADO</text><rect x="2" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(-20 5 0)" opacity=".85"/><rect x="26" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(20 30 0)" opacity=".85"/></g>`;
    }
  },
  {
    id: "parede_show",
    nome: "Parede de show",
    preco: 180,
    mundo: "rock",
    svg: (W, H, opts = {}) => {
      const x1 = opts && opts.noQuarto ? 116 : 14;
      const y1 = opts && opts.noQuarto ? 16 : 10;
      const x2 = opts && opts.noQuarto ? 154 : W - 50;
      const y2 = opts && opts.noQuarto ? 38 : 12;
      return `<rect width="${W}" height="${H}" fill="#1A1A1C"/><path d="M${W * 0.2} 0L${W * 0.05} ${H}H${W * 0.35}Z" fill="#FFF6C8" opacity=".07"/><path d="M${W * 0.8} 0L${W * 0.65} ${H}H${W * 0.95}Z" fill="#FFF6C8" opacity=".07"/><g transform="translate(${x1} ${y1}) rotate(-4)"><rect width="34" height="44" fill="#141416" stroke="#F2C318"/><text x="17" y="16" font-size="5.6" text-anchor="middle" fill="#F2C318" font-family="Bungee,sans-serif">TROVÃO</text><path d="M19 20L12 31H17L14 40L23 27H18L21 20Z" fill="#F2C318"/><rect x="2" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(-20 5 0)" opacity=".85"/><rect x="24" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(20 28 0)" opacity=".85"/></g><g transform="translate(${x2} ${y2}) rotate(5)"><rect width="36" height="46" fill="#E0312F"/><text x="18" y="16" font-size="4.6" text-anchor="middle" fill="#F2F2F2" font-family="Bungee,sans-serif">OS AMPLI</text><text x="18" y="23" font-size="4.6" text-anchor="middle" fill="#F2F2F2" font-family="Bungee,sans-serif">FICADOS</text><circle cx="18" cy="35" r="7" fill="#141416"/><circle cx="18" cy="35" r="2" fill="#F2C318"/><rect x="2" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(-20 5 0)" opacity=".85"/><rect x="26" y="-1" width="8" height="3" fill="#EAD9A6" transform="rotate(20 30 0)" opacity=".85"/></g>`;
    }
  }
];

/* ---------- enfeites ---------- */
const ENFEITES = [
  // para todos os mundos
  {
    id: "vaso",
    nome: "Vasinho",
    preco: 40,
    w: 22,
    svg: () =>
      `<path d="M-7 0L-9 -14H9L7 0Z" fill="#C77A4A" stroke="#7A4A2A"/><path d="M0 -14Q-10 -24 -8 -32Q-2 -26 0 -14Q2 -30 8 -34Q10 -22 0 -14Z" fill="#5E9E5A"/>`
  },
  {
    id: "vela",
    nome: "Vela acesa",
    preco: 40,
    w: 14,
    svg: () =>
      `<rect x="-4" y="-18" width="8" height="18" rx="1" fill="#F2EAD3" stroke="#B8A88A"/><path class="chama" d="M0 -27Q4 -22 2 -19Q0 -17 -2 -19Q-4 -22 0 -27Z" fill="#FFB020"/>`
  },
  {
    id: "retrato",
    nome: "Porta-retrato do Fotolog",
    preco: 80,
    w: 26,
    // mostra a foto mais recente do Fotolog, ou um Prumi sorrindo
    svg: () => {
      const f = S.fotolog[0];
      const pr = prumi({
        mood: f ? f.mood : "happy",
        size: 18,
        eq: f ? f.eq : S.equip,
        p: f ? f.p : S.persona
      });
      return `<rect x="-12" y="-30" width="24" height="30" rx="1.5" fill="#B8975A"/><rect x="-9" y="-27" width="18" height="22" fill="#F2EAD3"/>${pr.replace("<svg ", '<svg x="-9" y="-28" ')}`;
    }
  },
  {
    id: "globo",
    nome: "Globo",
    preco: 90,
    w: 24,
    svg: () =>
      `<path d="M-7 0H7L4 -4H-4Z" fill="#6B4A30"/><path d="M0 -4V-8" stroke="#6B4A30" stroke-width="2"/><circle cy="-18" r="10" fill="#5B8FD0" stroke="#2F4F8F"/><path d="M-6 -24Q-2 -20 -5 -16Q0 -14 2 -18Q6 -20 4 -26Z" fill="#6FB06A"/><path d="M-12 -18A12 12 0 0 1 12 -18" fill="none" stroke="#B8975A" stroke-width="1.4"/>`
  },
  {
    id: "urso",
    nome: "Ursinho",
    preco: 60,
    w: 22,
    svg: () =>
      `<circle cx="-6" cy="-24" r="3.4" fill="#A8794A"/><circle cx="6" cy="-24" r="3.4" fill="#A8794A"/><circle cy="-19" r="7" fill="#C08A55"/><ellipse cy="-6" rx="9" ry="7" fill="#C08A55"/><circle cx="-2.4" cy="-20" r=".9" fill="#141416"/><circle cx="2.4" cy="-20" r=".9" fill="#141416"/><ellipse cy="-16.5" rx="2" ry="1.4" fill="#6B4A30"/>`
  },
  {
    id: "caneca",
    nome: "Caneca de chá",
    preco: 30,
    w: 18,
    svg: () =>
      `<path d="M-6 0V-14H6V0Z" fill="#F2F2F2" stroke="#8C8A96"/><path d="M6 -11Q11 -11 11 -7Q11 -3 6 -3" fill="none" stroke="#8C8A96" stroke-width="1.6"/><path class="vapor" d="M-2 -17Q-4 -21 -2 -24M2 -17Q0 -21 2 -24" fill="none" stroke="#9AA3AD"/>`
  },
  {
    id: "gato",
    nome: "Gato dormindo",
    preco: 100,
    w: 34,
    svg: () =>
      `<ellipse cy="-6" rx="15" ry="7" fill="#6C6A76"/><circle cx="11" cy="-9" r="6" fill="#6C6A76"/><path d="M7 -13L8 -19L11 -14ZM12 -14L15 -19L15 -12Z" fill="#6C6A76"/><path d="M9 -9q1.4 1 2.8 0M13 -9q1.4 1 2.6 0" stroke="#141416" stroke-width=".8" fill="none"/><path d="M-15 -4Q-20 -2 -17 2" stroke="#6C6A76" stroke-width="3" fill="none" stroke-linecap="round"/><text x="16" y="-20" font-size="7" fill="var(--muted)">z</text>`
  },
  {
    id: "luminaria",
    nome: "Luminária",
    preco: 70,
    w: 22,
    svg: () =>
      `<path d="M-6 0H6" stroke="#2B2B33" stroke-width="3"/><path d="M0 0V-18" stroke="#2B2B33" stroke-width="1.6"/><path d="M-9 -18L-5 -30H5L9 -18Z" fill="#F2C14E" stroke="#B8975A"/><path d="M-9 -18H9L14 2H-14Z" fill="#FFF6C8" opacity=".25"/>`
  },
  {
    id: "pilha",
    nome: "Pilha de livros deitados",
    preco: 50,
    w: 30,
    svg: () =>
      `<rect x="-14" y="-6" width="28" height="6" fill="#5B6FC2"/><rect x="-12" y="-12" width="25" height="6" fill="#C8102E"/><rect x="-13" y="-18" width="24" height="6" fill="#5E9E5A"/>`
  },
  {
    id: "relogio",
    nome: "Relógio antigo",
    preco: 80,
    w: 22,
    svg: () =>
      `<rect x="-9" y="-30" width="18" height="30" rx="3" fill="#6B4A30"/><circle cy="-20" r="6.5" fill="#F2EAD3" stroke="#B8975A"/><path d="M0 -20V-24M0 -20L3 -18" stroke="#141416" stroke-width="1"/><path d="M0 -10V-4" stroke="#B8975A" stroke-width="1.4"/><circle cy="-4" r="2" fill="#B8975A"/>`
  },
  // só no emo
  {
    id: "castical",
    nome: "Castiçal",
    preco: 90,
    w: 26,
    mundo: "emo",
    svg: () =>
      `<path d="M-9 0H9M0 0V-8M-10 -16Q-10 -8 0 -8Q10 -8 10 -16" fill="none" stroke="#B8975A" stroke-width="1.8"/>${[-10, 0, 10].map(x => `<rect x="${x - 1.8}" y="${x ? -26 : -30}" width="3.6" height="${x ? 10 : 14}" fill="#EFE6D6"/><path class="chama" d="M${x} ${x ? -32 : -36}Q${x + 2.4} ${x ? -29 : -33} ${x} ${x ? -26 : -30}Q${x - 2.4} ${x ? -29 : -33} ${x} ${x ? -32 : -36}Z" fill="#FFB020"/>`).join("")}`
  },
  {
    id: "rosas",
    nome: "Rosas secas",
    preco: 70,
    w: 20,
    mundo: "emo",
    svg: () =>
      `<path d="M-5 0L-6 -12H6L5 0Z" fill="#2B2B33"/><path d="M-2 -12L-6 -26M1 -12L2 -30M3 -12L7 -24" stroke="#2E4A2A" stroke-width="1.2"/>` +
      rose(-6, -27, 3, "#6E0E20") +
      rose(2, -31, 3.4, "#4A0A16") +
      rose(7, -25, 2.8, "#6E0E20")
  },
  {
    id: "corvo",
    nome: "Corvo",
    preco: 110,
    w: 24,
    mundo: "emo",
    svg: () =>
      `<path d="M-8 -6Q-6 -18 2 -17Q8 -17 9 -13L14 -12L9 -10Q8 -2 0 -1Q-4 -1 -9 2Q-7 -2 -8 -6Z" fill="#17171C"/><circle cx="4" cy="-14" r="1.1" fill="#C9CED6"/><path d="M-1 0V2M2 0V2" stroke="#B8975A"/>`
  },
  {
    id: "caveira",
    nome: "Caveira",
    preco: 80,
    w: 20,
    mundo: "emo",
    svg: () =>
      `<path d="M-8 -10Q-8 -22 0 -22Q8 -22 8 -10Q8 -5 4 -4V0H-4V-4Q-8 -5 -8 -10Z" fill="#EDE8DC" stroke="#8C8A96"/><ellipse cx="-3.2" cy="-11" rx="2.4" ry="2.8" fill="#2A2733"/><ellipse cx="3.2" cy="-11" rx="2.4" ry="2.8" fill="#2A2733"/><path d="M0 -8L-1.2 -5.4H1.2Z" fill="#2A2733"/>`
  },
  {
    id: "vinil",
    nome: "Discos de vinil",
    preco: 90,
    w: 30,
    mundo: "emo",
    svg: () =>
      `<rect x="-14" y="-28" width="28" height="28" fill="#5B2E7A"/><circle cy="-14" r="11" fill="#141416"/><circle cy="-14" r="3.4" fill="#C8102E"/><circle cy="-14" r="7" fill="none" stroke="#2B2B33"/>`
  },
  // outros mundos
  {
    id: "bonsai",
    nome: "Bonsai",
    preco: 90,
    w: 26,
    mundo: "zen",
    svg: () =>
      `<rect x="-11" y="-6" width="22" height="6" rx="1" fill="#6B4A30"/><path d="M0 -6Q-2 -12 2 -16Q6 -20 4 -24" stroke="#5A3A22" stroke-width="2.4" fill="none"/><ellipse cx="-4" cy="-20" rx="8" ry="5" fill="#5E9E5A"/><ellipse cx="6" cy="-26" rx="7" ry="4.4" fill="#6FB06A"/>`
  },
  {
    id: "controle",
    nome: "Controle de videogame",
    preco: 80,
    w: 28,
    mundo: "gamer",
    svg: () =>
      `<path d="M-12 -2Q-14 -12 -7 -12H7Q14 -12 12 -2Q11 2 7 0L4 -3H-4L-7 0Q-11 2 -12 -2Z" fill="#2B2B33"/><path d="M-8 -7H-4M-6 -9V-5" stroke="#F2F2F2" stroke-width="1.2"/><circle cx="6" cy="-8" r="1.2" fill="#C8102E"/><circle cx="8.6" cy="-6" r="1.2" fill="#2F6FD6"/>`
  },
  {
    id: "caneca_codigo",
    nome: "Caneca </>",
    preco: 50,
    w: 18,
    mundo: "programador",
    svg: () =>
      `<path d="M-6 0V-15H6V0Z" fill="#141416"/><path d="M6 -12Q11 -12 11 -8Q11 -4 6 -4" fill="none" stroke="#141416" stroke-width="1.8"/><text y="-5" font-size="6" text-anchor="middle" fill="#5FD06C" font-family="monospace">&lt;/&gt;</text>`
  },
  {
    id: "trico",
    nome: "Cestinha de tricô",
    preco: 60,
    w: 26,
    mundo: "vovo",
    svg: () =>
      `<path d="M-11 -10H11L9 0H-9Z" fill="#B8975A"/><circle cx="-4" cy="-12" r="5" fill="#E8337A"/><circle cx="5" cy="-12" r="4.4" fill="#5B8FD0"/><path d="M2 -16L8 -26M-1 -16L4 -27" stroke="#8C8A96"/>`
  },
  // lendários (conquistas de leitura em js/leitura.js)
  {
    id: "coruja_ouro",
    nome: "Coruja de ouro",
    ach: "rato_biblioteca",
    w: 22,
    svg: () =>
      `<ellipse cy="-12" rx="9" ry="12" fill="#E8C24A" stroke="#B8975A"/><circle cx="-3.6" cy="-16" r="3.2" fill="#FFF6C8"/><circle cx="3.6" cy="-16" r="3.2" fill="#FFF6C8"/><circle cx="-3.6" cy="-16" r="1.4" fill="#141416"/><circle cx="3.6" cy="-16" r="1.4" fill="#141416"/><path d="M-1.2 -13H1.2L0 -10.6Z" fill="#C77700"/><path d="M-7 -22L-8 -27L-4 -23M7 -22L8 -27L4 -23" fill="#E8C24A"/>`
  },
  {
    id: "ampulheta",
    nome: "Ampulheta",
    ach: "maratonista",
    w: 18,
    svg: () =>
      `<path d="M-8 0H8M-8 -30H8" stroke="#6B4A30" stroke-width="2.4"/><path d="M-6 -29Q-6 -18 0 -15Q6 -18 6 -29ZM-6 -1Q-6 -12 0 -15Q6 -12 6 -1Z" fill="#DCEBF2" stroke="#9AA3AD"/><path d="M-4 -2Q0 -7 4 -2Z M-3 -25H3Q2 -20 0 -18Q-2 -20 -3 -25Z" fill="#E8C24A"/>`
  },
  /* ---------- mundo Roqueiro ---------- */
  {
    id: "mini_amp",
    nome: "Mini amplificador",
    preco: 90,
    w: 24,
    mundo: "rock",
    svg: () =>
      `<rect x="-11" y="-20" width="22" height="20" rx="2" fill="#1E1F24" stroke="#141416"/><rect x="-9" y="-18" width="18" height="4" fill="#2B2B33"/>${[-6, -2, 2, 6].map(x => `<circle cx="${x}" cy="-16" r=".9" fill="#C9CED6"/>`).join("")}<rect x="-9" y="-12" width="18" height="10" fill="#3A3A44"/><text x="0" y="-5" font-size="3" text-anchor="middle" fill="#F2C318" font-family="Bungee,sans-serif">ROCK</text>`
  },
  {
    id: "vinil_pe",
    nome: "Vinil na capa",
    preco: 70,
    w: 26,
    mundo: "rock",
    svg: () =>
      `<circle cx="4" cy="-13" r="11" fill="#141416"/><circle cx="4" cy="-13" r="3.4" fill="#E0312F"/><rect x="-12" y="-24" width="20" height="24" fill="#2F6FD6" stroke="#141416" stroke-width=".8"/><path d="M-2 -18L-7 -10H-3L-6 -4L1 -13H-3L0 -18Z" fill="#F2C318"/>`
  },
  {
    id: "pote_baquetas",
    nome: "Pote de baquetas",
    preco: 60,
    w: 18,
    mundo: "rock",
    svg: () =>
      `<path d="M-4 -12L-8 -34M0 -12V-36M4 -12L8 -33" stroke="#D9B48A" stroke-width="2.2" stroke-linecap="round"/><path d="M-7 0L-8 -13H8L7 0Z" fill="#C8302C" stroke="#141416" stroke-width=".8"/>`
  },
  {
    id: "mini_guitarra",
    nome: "Guitarra em miniatura",
    preco: 110,
    w: 22,
    mundo: "rock",
    svg: () =>
      `<path d="M-6 0L6 0L3 -4H-3Z" fill="#3A3A44"/><g transform="translate(0 -14) scale(.7) rotate(38)">${guitar("#F07A1A", "#3A2A1E").replace(/var\(--ink\)/g, "#141416")}</g>`
  },
  {
    id: "palheta_ouro",
    nome: "Palheta de ouro",
    ach: "solo_epico",
    w: 18,
    mundo: "rock",
    svg: () =>
      `<rect x="-7" y="-4" width="14" height="4" fill="#141416"/><path d="M-7 -24Q0 -28 7 -24Q7.6 -14 0 -6Q-7.6 -14 -7 -24Z" fill="#E8C24A" stroke="#B8975A"/><path d="M-3 -22Q0 -23 3 -22" stroke="#FFF6C8" stroke-width="1.2" fill="none"/>`
  },
  {
    id: "busto",
    nome: "Busto clássico",
    ach: "classico",
    w: 22,
    svg: () =>
      `<rect x="-8" y="-6" width="16" height="6" fill="#D9D5CC"/><path d="M-10 -6Q-10 -14 0 -15Q10 -14 10 -6Z" fill="#EDEAE4"/><circle cy="-21" r="6.5" fill="#EDEAE4"/><path d="M-6 -24Q-4 -30 2 -29Q7 -28 6 -22" fill="none" stroke="#B8B2A8" stroke-width="1.6"/>`
  },
  {
    id: "trofeu",
    nome: "Troféu do desafio",
    ach: "desafio_ano",
    w: 20,
    svg: () =>
      `<rect x="-7" y="-4" width="14" height="4" fill="#6B4A30"/><path d="M0 -4V-9" stroke="#E8C24A" stroke-width="2.4"/><path d="M-7 -24H7Q7 -11 0 -9Q-7 -11 -7 -24Z" fill="#E8C24A" stroke="#B8975A"/><path d="M-7 -21Q-11 -21 -10 -16Q-9 -13 -6 -13M7 -21Q11 -21 10 -16Q9 -13 6 -13" fill="none" stroke="#E8C24A" stroke-width="1.6"/>`
  }
];

const ENFEITE = Object.fromEntries(ENFEITES.map(e => [e.id, e]));
/** Itens que aparecem no mundo atual (os de outros mundos ficam guardados, mas escondidos). */
const doMundo = x => !x.mundo || x.mundo === S.persona;
const temDecor = x => !x.preco || S.leitura.comprados.includes(x.id) || (x.ach && !!S.ach[x.ach]);
