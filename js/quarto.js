/*
  Quarto de leitura: a estante fica dentro de um quarto que você monta com "páginas" (js/leitura.js).
  Cada parte do quarto é um "lugar" (slot): chao, janela, poster, cama, tapete e luz.
  A parede é o FUNDOS e a estante é o MOVEIS, os dois em js/estante-enfeites.js.

  Para criar um item: adicione em QUARTO com slot, id único (comece com "q_"), nome, preco (ou ach para
  lendário), mundo (opcional, só aparece naquele mundo) e svg(). Cada lugar tem um tamanho (LUGARES_QUARTO):
  o desenho usa essa área, com (0, 0) no canto de cima à esquerda.
*/
"use strict";

const LUGARES_QUARTO = {
  janela: { nome: "Janela", w: 90, h: 80 },
  poster: { nome: "Pôster", w: 44, h: 56 },
  cama: { nome: "Cama", w: 140, h: 70 },
  tapete: { nome: "Tapete", w: 150, h: 34 },
  luz: { nome: "Luz", w: 36, h: 92 },
  chao: { nome: "Chão", w: 360, h: 64 }
};

const QUARTO = [
  /* ---------- chão ---------- */
  {
    slot: "chao",
    id: "q_madeira",
    nome: "Assoalho",
    preco: 0,
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#B98552"/>${Array.from({ length: Math.ceil(h / 12) }, (_, i) => `<path d="M0 ${i * 12}H${w}" stroke="#9C6B3E"/>${Array.from({ length: Math.ceil(w / 60) }, (_, k) => `<path d="M${k * 60 + (i % 2) * 30} ${i * 12}v12" stroke="#9C6B3E"/>`).join("")}`).join("")}`
  },
  {
    slot: "chao",
    id: "q_tacos",
    nome: "Tacos claros",
    preco: 80,
    svg: (w = 360, h = 64) => {
      let s = `<rect width="${w}" height="${h}" fill="#E2C79C"/>`;
      for (let y = 0; y < h; y += 16)
        for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32)
          s += `<path d="M${x} ${y}h16v16h-16z" fill="#D4B482"/><path d="M${x + 4} ${y}v16M${x + 8} ${y}v16M${x + 12} ${y}v16" stroke="#C9A672" stroke-width=".6"/>`;
      return s;
    }
  },
  {
    slot: "chao",
    id: "q_xadrez",
    nome: "Piso xadrez",
    preco: 120,
    svg: (w = 360, h = 64) => {
      let s = `<rect width="${w}" height="${h}" fill="#F2F2F2"/>`;
      for (let y = 0, i = 0; y < h; y += 16, i++)
        for (let x = i % 2 ? 16 : 0; x < w; x += 32)
          s += `<rect x="${x}" y="${y}" width="16" height="16" fill="#1E1F24"/>`;
      return s;
    }
  },
  {
    slot: "chao",
    id: "q_carpete",
    nome: "Carpete roxo",
    preco: 100,
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#5B3F7A"/>${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 53) % w}" cy="${(i * 29) % h}" r=".8" fill="#7A5A9E"/>`).join("")}`
  },
  {
    slot: "chao",
    id: "q_tatame",
    nome: "Tatame",
    preco: 100,
    mundo: "zen",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#C9C08A"/>${Array.from({ length: Math.ceil(w / 60) }, (_, k) => `<rect x="${k * 60 + 1}" y="1" width="58" height="${h - 2}" fill="none" stroke="#3F5A2A" stroke-width="2"/>`).join("")}`
  },

  /* ---------- janela ---------- */
  {
    slot: "janela",
    id: "q_noite",
    nome: "Noite estrelada",
    preco: 0,
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#1A2040"/>${[
        [14, 14],
        [70, 12],
        [30, 44],
        [76, 52],
        [52, 24]
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`)
        .join(
          ""
        )}<circle cx="62" cy="26" r="7" fill="#F2EAD3"/><rect x="4" y="4" width="82" height="66" fill="none" stroke="#F2F2F2" stroke-width="5"/><path d="M45 4V70M4 37H86" stroke="#F2F2F2" stroke-width="3"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#E6E1D8"/>`
  },
  {
    slot: "janela",
    id: "q_dia",
    nome: "Dia de sol",
    preco: 60,
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#9FD3F2"/><circle cx="64" cy="22" r="9" fill="#FFD86B"/><path d="M6 60q12 -10 24 -2q10 -8 22 0q14 -10 32 0V70H6Z" fill="#7CBF6A"/><path d="M14 22q4 -5 10 -2q4 -4 8 0q4 1 2 4H14Z" fill="#fff"/><rect x="4" y="4" width="82" height="66" fill="none" stroke="#F2F2F2" stroke-width="5"/><path d="M45 4V70M4 37H86" stroke="#F2F2F2" stroke-width="3"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#E6E1D8"/>`
  },
  {
    slot: "janela",
    id: "q_chuva",
    nome: "Chuva na janela",
    preco: 80,
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#3A4A66"/><g class="rain">${Array.from({ length: 14 }, (_, i) => `<path d="M${((i * 23) % 76) + 8} ${((i * 17) % 56) + 6}l-2 7" stroke="#9BB0E0" stroke-width="1.1" stroke-linecap="round"/>`).join("")}</g><rect x="4" y="4" width="82" height="66" fill="none" stroke="#5A3A22" stroke-width="5"/><path d="M45 4V70M4 37H86" stroke="#5A3A22" stroke-width="3"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#5A3A22"/>`
  },
  {
    slot: "janela",
    id: "q_cidade",
    nome: "Cidade à noite",
    preco: 120,
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#241A3A"/>${[
        [6, 40, 14],
        [22, 30, 12],
        [36, 46, 14],
        [52, 24, 12],
        [66, 38, 18]
      ]
        .map(
          ([x, y, w]) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${70 - y}" fill="#141024"/>${[0, 1, 2]
              .map(k => `<rect x="${x + 3}" y="${y + 5 + k * 9}" width="3" height="3" fill="#F2C14E"/>`)
              .join("")}`
        )
        .join(
          ""
        )}<rect x="4" y="4" width="82" height="66" fill="none" stroke="#2B2B33" stroke-width="5"/><path d="M45 4V70" stroke="#2B2B33" stroke-width="3"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#2B2B33"/>`
  },
  {
    slot: "janela",
    id: "q_lua_sangue",
    nome: "Lua de sangue",
    preco: 150,
    mundo: "emo",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#1A0C14"/><circle cx="45" cy="34" r="16" fill="#8A0F22"/><circle cx="40" cy="29" r="3" fill="#000" opacity=".2"/><path d="M14 18l3 2-3 2M70 54l3 2-3 2" stroke="#C9C1AE"/><path d="M45 4V70M4 37H86" stroke="#1E1218" stroke-width="3"/><path d="M4 70V30Q4 4 45 4Q86 4 86 30V70" fill="none" stroke="#1E1218" stroke-width="6"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#B8975A"/>`
  },
  {
    slot: "janela",
    id: "q_vitral",
    nome: "Vitral",
    ach: "leitor",
    svg: () =>
      `<path d="M4 70V34Q4 4 45 4Q86 4 86 34V70Z" fill="#2A2733"/>${[
        "#C8102E",
        "#2F4F8F",
        "#F2C14E",
        "#1C8350",
        "#5B2E7A",
        "#C8102E"
      ]
        .map(
          (c, i) =>
            `<path d="M45 40L${45 + 40 * Math.cos(Math.PI + (i * Math.PI) / 5)} ${40 + 40 * Math.sin(Math.PI + (i * Math.PI) / 5)}L${45 + 40 * Math.cos(Math.PI + ((i + 1) * Math.PI) / 5)} ${40 + 40 * Math.sin(Math.PI + ((i + 1) * Math.PI) / 5)}Z" fill="${c}" opacity=".75"/>`
        )
        .join(
          ""
        )}<path d="M4 70V34Q4 4 45 4Q86 4 86 34V70Z" fill="none" stroke="#B8975A" stroke-width="4"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#B8975A"/>`
  },

  /* ---------- pôster ---------- */
  {
    slot: "poster",
    id: "q_poster_gato",
    nome: "Pôster de gatinho",
    preco: 50,
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FBE3EA" stroke="#141416" stroke-width=".8"/><ellipse cx="22" cy="36" rx="10" ry="8" fill="#6C6A76"/><circle cx="22" cy="24" r="7" fill="#6C6A76"/><path d="M16 20l-1-7 5 4zM28 20l1-7-5 4z" fill="#6C6A76"/><circle cx="19.5" cy="24" r="1" fill="#141416"/><circle cx="24.5" cy="24" r="1" fill="#141416"/><text x="22" y="50" font-size="4.6" text-anchor="middle" fill="#5A1630" font-family="Caveat,cursive">miau</text>`
  },
  {
    slot: "poster",
    id: "q_poster_mapa",
    nome: "Mapa-múndi",
    preco: 60,
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#F2EAD3" stroke="#8A6A3A" stroke-width="1"/><path d="M8 16q6 -4 10 0t8 4q4 -2 4 4t-6 4q-4 6-10 2t-6-8ZM26 30q6 -2 8 4t-2 10q-6 2-8-4t2-10Z" fill="#8FB07A"/><path d="M6 46h32" stroke="#8A6A3A" stroke-width=".6"/>`
  },
  {
    slot: "poster",
    id: "q_poster_lua",
    nome: "Fases da lua",
    preco: 70,
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1A2040"/>${[0, 1, 2, 3, 4]
        .map(
          i =>
            `<circle cx="22" cy="${10 + i * 9}" r="3.4" fill="#F2EAD3"/><circle cx="${22 + (i - 2) * 2.4}" cy="${10 + i * 9}" r="3.4" fill="#1A2040" opacity="${i === 2 ? 0 : 1}"/>`
        )
        .join("")}`
  },
  {
    slot: "poster",
    id: "q_poster_banda",
    nome: "Pôster Lua Fria",
    preco: 80,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#C8102E" stroke-width="1"/><text x="22" y="18" font-size="7" text-anchor="middle" fill="#E0314F" font-family="Bungee,Impact,sans-serif">LUA</text><text x="22" y="27" font-size="7" text-anchor="middle" fill="#E0314F" font-family="Bungee,Impact,sans-serif">FRIA</text>` +
      bat(22, 40, 0.7, "#E0314F") +
      `<text x="22" y="51" font-size="3.4" text-anchor="middle" fill="#C9C1AE" font-family="sans-serif">TURNÊ DA SAUDADE</text>`
  },
  {
    slot: "poster",
    id: "q_poster_coracao",
    nome: "Coração partido",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#F2F2F2" stroke="#141416" stroke-width=".8"/><path d="M21 40L9 28.6A6.6 6.6 0 0 1 21 21.4L23 25L20 29L23 33Z" fill="#C8102E"/><path d="M24 41L26 33L23 29L26 25L24 21.6A6.6 6.6 0 0 1 35 28.6Z" fill="#C8102E"/><text x="22" y="50" font-size="4.4" text-anchor="middle" fill="#141416" font-family="Caveat,cursive">xoxo</text>`
  },

  /* ---------- cama ---------- */
  {
    slot: "cama",
    id: "q_cama",
    nome: "Cama simples",
    preco: 0,
    svg: () =>
      `<rect x="4" y="18" width="10" height="52" rx="2" fill="#8A6A3A"/><rect x="10" y="40" width="126" height="22" rx="4" fill="#F2F2F2" stroke="#B8B2A8"/><rect x="14" y="30" width="34" height="14" rx="6" fill="#FFFFFF" stroke="#B8B2A8"/><path d="M50 38H136V58Q136 62 132 62H50Z" fill="#7FA2E8"/><path d="M50 38H136" stroke="#5B7FC8" stroke-width="2"/><rect x="12" y="62" width="6" height="8" fill="#8A6A3A"/><rect x="128" y="62" width="6" height="8" fill="#8A6A3A"/>`
  },
  {
    slot: "cama",
    id: "q_cama_edredom",
    nome: "Cama com edredom",
    preco: 120,
    svg: () =>
      `<rect x="2" y="10" width="14" height="60" rx="3" fill="#E6E1D8" stroke="#B8B2A8"/><rect x="10" y="40" width="128" height="22" rx="4" fill="#F2F2F2"/><rect x="16" y="28" width="30" height="16" rx="7" fill="#FFD1DC"/><rect x="28" y="30" width="26" height="14" rx="6" fill="#FFFFFF" stroke="#E6E1D8"/><path d="M46 34Q90 28 138 36V60Q138 64 134 64H46Z" fill="#F28AB2"/>${[60, 80, 100, 120].map(x => `<circle cx="${x}" cy="48" r="2.4" fill="#fff" opacity=".7"/>`).join("")}<rect x="12" y="62" width="6" height="8" fill="#B8B2A8"/><rect x="128" y="62" width="6" height="8" fill="#B8B2A8"/>`
  },
  {
    slot: "cama",
    id: "q_futon",
    nome: "Futon",
    preco: 100,
    mundo: "zen",
    svg: () =>
      `<rect x="6" y="54" width="130" height="14" rx="3" fill="#F2EAD3" stroke="#C9C08A"/><rect x="10" y="46" width="30" height="10" rx="4" fill="#FFFFFF" stroke="#C9C08A"/><path d="M42 50H134V62H42Z" fill="#5E9E5A"/>`
  },
  {
    slot: "cama",
    id: "q_caixao",
    nome: "Caixão de veludo",
    preco: 300,
    mundo: "emo",
    svg: () =>
      `<path d="M8 50L22 30H118L134 50L122 66H20Z" fill="#3A2420" stroke="#1E1218" stroke-width="1.6"/><path d="M14 50L25 35H115L127 50L118 61H24Z" fill="#7A0F24"/><rect x="30" y="38" width="22" height="12" rx="5" fill="#B3122E"/><path d="M90 44h16M98 38v14" stroke="#E8C24A" stroke-width="2"/><rect x="20" y="64" width="6" height="6" fill="#1E1218"/><rect x="116" y="64" width="6" height="6" fill="#1E1218"/>`
  },
  {
    slot: "cama",
    id: "q_beliche",
    nome: "Beliche",
    preco: 200,
    svg: () =>
      `<rect x="6" y="0" width="6" height="70" fill="#6B4A30"/><rect x="128" y="0" width="6" height="70" fill="#6B4A30"/><rect x="10" y="14" width="120" height="12" fill="#F2F2F2"/><path d="M40 12H130V24H40Z" fill="#5E9E5A"/><rect x="10" y="48" width="120" height="12" fill="#F2F2F2"/><path d="M40 46H130V58H40Z" fill="#C8102E" opacity=".85"/><rect x="8" y="26" width="124" height="4" fill="#6B4A30"/><rect x="8" y="60" width="124" height="4" fill="#6B4A30"/><path d="M118 26v20M124 26v20M118 32h6M118 38h6" stroke="#6B4A30" stroke-width="1.6"/>`
  },

  /* ---------- tapete ---------- */
  {
    slot: "tapete",
    id: "q_tapete_redondo",
    nome: "Tapete redondo",
    preco: 40,
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#E8C24A"/><ellipse cx="75" cy="17" rx="54" ry="9" fill="none" stroke="#C99A2E" stroke-width="2"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_listrado",
    nome: "Tapete listrado",
    preco: 60,
    svg: () =>
      `<rect x="6" y="4" width="138" height="26" rx="3" fill="#7FA2E8"/>${[0, 1, 2, 3].map(i => `<rect x="6" y="${8 + i * 6}" width="138" height="2.4" fill="#F2F2F2"/>`).join("")}<path d="M6 4v26M144 4v26" stroke="#F2F2F2" stroke-width="2" stroke-dasharray="1.5 1.5"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_felpudo",
    nome: "Tapete felpudo",
    preco: 80,
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#F2F2F2"/>${Array.from({ length: 40 }, (_, i) => `<path d="M${12 + ((i * 37) % 126)} ${8 + ((i * 13) % 18)}l1.4 -2.4" stroke="#D9D5CC"/>`).join("")}`
  },
  {
    slot: "tapete",
    id: "q_tapete_xadrez",
    nome: "Tapete xadrez",
    preco: 90,
    mundo: "emo",
    svg: () => {
      let s = `<rect x="6" y="4" width="138" height="26" fill="#F2F2F2"/>`;
      for (let y = 0; y < 3; y++)
        for (let x = y % 2; x < 16; x += 2)
          s += `<rect x="${6 + x * 8.6}" y="${4 + y * 8.7}" width="8.6" height="8.7" fill="#141416"/>`;
      return (
        s + `<rect x="6" y="4" width="138" height="26" fill="none" stroke="#C8102E" stroke-width="1.6"/>`
      );
    }
  },

  /* ---------- luz ---------- */
  {
    slot: "luz",
    id: "q_abajur",
    nome: "Abajur",
    preco: 0,
    svg: () =>
      `<rect x="6" y="56" width="24" height="36" rx="2" fill="#8A6A3A"/><path d="M18 56V40" stroke="#2B2B33" stroke-width="2"/><path d="M6 40L11 24H25L30 40Z" fill="#F2C14E"/><path d="M6 40H30L40 70H-4Z" fill="#FFF6C8" opacity=".22"/>`
  },
  {
    slot: "luz",
    id: "q_lava",
    nome: "Luminária de lava",
    preco: 120,
    svg: () =>
      `<rect x="6" y="56" width="24" height="36" rx="2" fill="#2B2B33"/><path d="M12 56L14 26H22L24 56Z" fill="#5B2E7A"/><circle class="pisca" cx="18" cy="44" r="3.4" fill="#FF4FD8"/><circle class="pisca" style="animation-delay:.8s" cx="17" cy="33" r="2.4" fill="#FF4FD8"/><path d="M12 56H24M14 26H22" stroke="#C9CED6" stroke-width="2"/>`
  },
  {
    slot: "luz",
    id: "q_pisca",
    nome: "Pisca-pisca",
    preco: 90,
    // além do desenho no lugar, enfeita o alto da parede (topo)
    svg: () =>
      `<rect x="6" y="56" width="24" height="36" rx="2" fill="#8A6A3A"/><circle cx="18" cy="48" r="7" fill="#5E9E5A"/>`,
    topo: W =>
      `<path d="M0 8Q${W / 4} 22 ${W / 2} 10T${W} 12" fill="none" stroke="#3A3A44" stroke-width=".8"/>${Array.from(
        { length: 14 },
        (_, i) => {
          const x = 12 + i * ((W - 24) / 13),
            y = 10 + 7 * Math.sin((i / 13) * Math.PI * 2);
          return `<circle class="pisca" style="animation-delay:${(i * 0.31).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${["#FF4FB0", "#F2C14E", "#4FE3FF", "#5FD06C"][i % 4]}"/>`;
        }
      ).join("")}`
  },
  {
    slot: "luz",
    id: "q_lanterna",
    nome: "Lanterna japonesa",
    preco: 100,
    mundo: "zen",
    svg: () =>
      `<rect x="6" y="56" width="24" height="36" rx="2" fill="#6B4A30"/><path d="M18 56V52" stroke="#141416"/><ellipse cx="18" cy="40" rx="10" ry="13" fill="#F2EAD3" stroke="#C8102E" stroke-width="1.4"/><path d="M8 34H28M8 46H28" stroke="#C8102E" stroke-width=".8"/>`
  },
  {
    slot: "luz",
    id: "q_candelabro",
    nome: "Candelabro",
    preco: 140,
    mundo: "emo",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#B8975A"/><path d="M18 86V50M6 58Q6 50 18 50Q30 50 30 58" fill="none" stroke="#B8975A" stroke-width="2"/>${[
        6, 18, 30
      ]
        .map(
          x =>
            `<rect x="${x - 2}" y="${x === 18 ? 36 : 44}" width="4" height="${x === 18 ? 14 : 14}" fill="#1E1F24"/><path class="chama" d="M${x} ${x === 18 ? 28 : 36}Q${x + 2.6} ${x === 18 ? 32 : 40} ${x} ${x === 18 ? 36 : 44}Q${x - 2.6} ${x === 18 ? 32 : 40} ${x} ${x === 18 ? 28 : 36}Z" fill="#FFB020"/>`
        )
        .join("")}`
  },
  /* ---------- mundo Roqueiro ---------- */
  {
    slot: "chao",
    id: "q_palco",
    nome: "Chão de palco",
    preco: 160,
    mundo: "rock",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#1E1F24"/>${Array.from({ length: Math.ceil(w / 40) }, (_, k) => `<path d="M${k * 40} 0V${h}" stroke="#2B2B33"/>`).join("")}<path d="M${w * 0.3 - 6} ${h * 0.4}l12 12M${w * 0.3 + 6} ${h * 0.4}l-12 12M${w * 0.7 - 6} ${h * 0.5}l12 12M${w * 0.7 + 6} ${h * 0.5}l-12 12" stroke="#F2C318" stroke-width="3"/><path d="M8 ${h - 10}Q${w / 3} ${h - 22} ${w / 2} ${h - 8}T${w - 8} ${h - 14}" fill="none" stroke="#141416" stroke-width="3"/>`
  },
  {
    slot: "janela",
    id: "q_janela_estadio",
    nome: "Vista do estádio",
    preco: 150,
    mundo: "rock",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#10163A"/><path d="M20 4L4 50V4ZM70 4L86 50V4Z" fill="#FFF6C8" opacity=".25"/><path d="M4 54Q45 40 86 54V70H4Z" fill="#2B2B33"/>${Array.from({ length: 14 }, (_, i) => `<circle class="pisca" style="animation-delay:${((i * 0.37) % 2).toFixed(2)}s" cx="${8 + i * 5.6}" cy="${58 + (i % 3) * 3}" r="1" fill="#FFB020"/>`).join("")}<path d="M45 4V70M4 37H86" stroke="#2B2B33" stroke-width="3"/><rect x="4" y="4" width="82" height="66" fill="none" stroke="#3A3A44" stroke-width="5"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#5A5A64"/>`
  },
  {
    slot: "poster",
    id: "q_poster_trovao",
    nome: "Pôster Trovão Elétrico",
    preco: 80,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#F2C318"/><text x="22" y="15" font-size="6.4" text-anchor="middle" fill="#F2C318" font-family="Metal Mania,Bungee,sans-serif">TROVÃO</text><path d="M25 19L16 33H22L18 45L29 29H23L27 19Z" fill="#F2C318"/><text x="22" y="52" font-size="3.4" text-anchor="middle" fill="#C9CED6" font-family="sans-serif">TURNÊ ELÉTRICA</text>`
  },
  {
    slot: "poster",
    id: "q_poster_guitarra",
    nome: "Quadro com guitarra",
    preco: 140,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#E9E7E2" stroke="#6B4A30" stroke-width="3"/><g transform="translate(22 30) scale(.9)">${guitar("#2F6FD6", "#3A2A1E").replace(/var\(--ink\)/g, "#141416")}</g>`
  },
  {
    slot: "poster",
    id: "q_disco_ouro",
    nome: "Disco de ouro emoldurado",
    ach: "star_power",
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#B8975A" stroke-width="3"/><circle cx="22" cy="24" r="14" fill="#E8C24A"/><circle cx="22" cy="24" r="9" fill="none" stroke="#B8975A"/><circle cx="22" cy="24" r="3.6" fill="#C8302C"/><rect x="10" y="42" width="24" height="7" fill="#E9E7E2"/><path d="M13 45.5H31" stroke="#141416" stroke-width=".8"/>`
  },
  {
    slot: "cama",
    id: "q_cama_case",
    nome: "Cama de cases",
    preco: 260,
    mundo: "rock",
    svg: () =>
      `<rect x="6" y="40" width="128" height="26" rx="2" fill="#1E1F24" stroke="#141416" stroke-width="1.6"/>${[18, 52, 86, 120].map(x => `<rect x="${x - 5}" y="44" width="10" height="5" fill="#C9CED6"/><rect x="${x - 5}" y="57" width="10" height="5" fill="#C9CED6"/>`).join("")}<rect x="6" y="30" width="128" height="12" rx="4" fill="#C8302C"/><rect x="10" y="22" width="32" height="12" rx="5" fill="#F2F2F2"/><rect x="6" y="10" width="10" height="32" fill="#1E1F24"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="11" cy="${15 + i * 5}" r="1.4" fill="${["#2FB344", "#E0312F", "#F2C318", "#2F6FD6", "#F07A1A"][i]}"/>`).join("")}`
  },
  {
    slot: "tapete",
    id: "q_tapete_notas",
    nome: "Tapete estrada de notas",
    preco: 130,
    mundo: "rock",
    svg: () =>
      `<path d="M40 4H110L144 30H6Z" fill="#141416"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${40 + i * 14} 4L${6 + i * 27.6} 30" stroke="#5A5A64"/>`).join("")}${["#2FB344", "#E0312F", "#F2C318", "#2F6FD6", "#F07A1A"].map((c, i) => `<ellipse cx="${19.8 + i * 27.6}" cy="25" rx="7" ry="3" fill="none" stroke="${c}" stroke-width="2"/>`).join("")}<ellipse cx="62" cy="12" rx="4" ry="1.8" fill="#E0312F"/><ellipse cx="96" cy="17" rx="5" ry="2.2" fill="#2F6FD6"/>`
  },
  {
    slot: "luz",
    id: "q_neon_raio",
    nome: "Neon de raio",
    preco: 120,
    mundo: "rock",
    svg: () =>
      `<rect x="6" y="56" width="24" height="36" rx="2" fill="#1E1F24"/><circle cx="18" cy="74" r="7" fill="#3A3A44"/><circle cx="18" cy="74" r="3" fill="#141416"/><path class="pisca" d="M22 10L10 32H17L12 50L27 26H19L24 10Z" fill="none" stroke="#4FE3FF" stroke-width="2.4" stroke-linejoin="round" style="filter:drop-shadow(0 0 3px #4FE3FF)"/>`
  }
];

const QUARTO_PADRAO = {
  chao: "q_madeira",
  janela: "q_noite",
  poster: "",
  cama: "q_cama",
  tapete: "",
  luz: "q_abajur"
};
const ITEM_QUARTO = Object.fromEntries(QUARTO.map(i => [i.id, i]));

/** Desenha o quarto inteiro, com a estante dentro. d = minhaEstante() ou os dados da vitrine de um amigo. */
function quartoSVG(d = minhaEstante()) {
  const decor = d.decor || {};
  const q = { ...QUARTO_PADRAO, ...(decor.quarto || {}) };
  const doMundoDele = x => !x.mundo || x.mundo === d.persona;
  const usar = slot => {
    const i = ITEM_QUARTO[q[slot]];
    if (i && i.slot === slot && doMundoDele(i) && (!d.meu || temDecor(i))) return i;
    return QUARTO.find(x => x.slot === slot && x.id === QUARTO_PADRAO[slot]) || null;
  };
  const fundo = FUNDOS.find(f => f.id === decor.fundo && doMundoDele(f)) || FUNDOS[0];

  // a estante, menor, encostada na parede da direita
  const est = estanteSVG(d, { semParede: true, semPrumi: true });
  const altEst = +(/viewBox="0 0 360 (\d+)"/.exec(est) || [0, 300])[1];
  const escala = 0.47,
    largE = Math.round(360 * escala),
    altE = Math.round(altEst * escala);
  const W = 360,
    altChao = 64;
  const H = Math.max(270, altE + altChao + 20);
  const chaoY = H - altChao;

  const em = (slot, x, y) => {
    const i = usar(slot);
    return i ? `<g class="q-${slot}" transform="translate(${x} ${y})">${i.svg()}</g>` : "";
  };
  const chao = usar("chao");
  const luz = usar("luz");
  const temCama = !!usar("cama");
  const lendo = d.lendo && d.lendo.length;
  const leitor = prumi({
    mood: lendo ? "focus" : "happy",
    size: 62,
    eq: d.equip || {},
    p: d.persona
  }).replace("<svg ", `<svg x="${temCama ? 40 : 70}" y="${temCama ? chaoY - 104 : chaoY - 60}" `);
  const livroNaMao = lendo
    ? `<path d="M${(temCama ? 40 : 70) + 18} ${temCama ? chaoY - 46 : chaoY - 2}l13 -3 13 3v10l-13 -3 -13 3z" fill="#FBF7EC" stroke="var(--ink)" stroke-width="1"/>`
    : "";
  return `<svg class="estante-svg quarto-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Quarto de leitura com ${d.lidos.length} livros lidos">
    <g class="parede">${fundo.svg(W, chaoY)}</g>
    ${luz && luz.topo ? `<g>${luz.topo(W)}</g>` : ""}
    ${em("janela", 16, 22)}${em("poster", 120, 30)}
    <g transform="translate(0 ${chaoY})">${chao ? chao.svg(W, altChao) : ""}</g>
    <rect x="0" y="${chaoY - 4}" width="${W}" height="5" fill="rgba(0,0,0,.18)"/>
    ${em("tapete", 20, chaoY + 16)}
    ${em("cama", 4, chaoY - 62)}
    ${em("luz", 146, chaoY - 86)}
    <svg x="${W - largE - 6}" y="${chaoY + 6 - altE}" width="${largE}" height="${altE}" viewBox="0 0 360 ${altEst}">${est.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</svg>
    <g class="prumi-leitor" ${d.meu ? 'data-act="prumi-leitor"' : ""}>${leitor}${livroNaMao}</g>
  </svg>`;
}
