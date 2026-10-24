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
  pet: { nome: "Bichinho", w: 48, h: 40 },
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
  {
    slot: "janela",
    id: "q_janela_entardecer",
    nome: "Entardecer dourado",
    preco: 90,
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#E86A52"/><rect x="4" y="30" width="82" height="40" fill="#F49A68"/><circle cx="45" cy="46" r="16" fill="#FFD86B"/><path d="M4 56h82v14H4z" fill="#2E2038"/><path d="M14 32q8-4 18 0t18-2q6-4 14 0" stroke="#FFFFFF" stroke-width="1.6" opacity=".5" fill="none"/><rect x="4" y="4" width="82" height="66" fill="none" stroke="#EDE8DC" stroke-width="5"/><path d="M45 4V70M4 37H86" stroke="#EDE8DC" stroke-width="3"/><rect x="0" y="68" width="90" height="8" rx="2" fill="#DDD6C8"/>`
  },

  /* ---------- pôster ---------- */
  {
    slot: "poster",
    id: "q_poster_livro_fav",
    nome: "Quadro do livro favorito",
    preco: 80,
    svg: () => {
      const fav =
        (typeof S !== "undefined" && S.livros && S.livros.find(l => l.fav)) ||
        (typeof S !== "undefined" && S.livros && S.livros.find(l => l.estante === "lido")) ||
        (typeof S !== "undefined" && S.livros && S.livros[0]);
      const tit = fav ? fav.titulo : "Meu Livro";
      const cor = fav && typeof corLivro === "function" ? corLivro(fav.titulo) : "#C8302C";
      return `<rect x="2" y="2" width="40" height="52" fill="#FAF6EE" stroke="#6B4A30" stroke-width="2.2"/><rect x="5" y="5" width="34" height="46" fill="${cor}" stroke="#3A2A1E" stroke-width=".8"/><rect x="8" y="10" width="28" height="20" fill="#FAF6EE" rx="1"/><text x="22" y="18" font-size="3.6" font-weight="bold" text-anchor="middle" fill="#141416" font-family="sans-serif">${esc(tit.slice(0, 10))}</text><text x="22" y="25" font-size="2.8" text-anchor="middle" fill="#666" font-family="sans-serif">${esc(tit.slice(10, 20))}</text><path d="M19 36l3 3 3-3-3-3z" fill="#D9B86A"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`;
    }
  },
  {
    slot: "poster",
    id: "q_poster_gato",
    nome: "Pôster de gatinho",
    preco: 50,
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FBE3EA" stroke="#141416" stroke-width=".8"/><ellipse cx="22" cy="36" rx="10" ry="8" fill="#6C6A76"/><circle cx="22" cy="24" r="7" fill="#6C6A76"/><path d="M16 20l-1-7 5 4zM28 20l1-7-5 4z" fill="#6C6A76"/><circle cx="19.5" cy="24" r="1" fill="#141416"/><circle cx="24.5" cy="24" r="1" fill="#141416"/><text x="22" y="50" font-size="4.6" text-anchor="middle" fill="#5A1630" font-family="Caveat,cursive">miau</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
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
      `<rect x="2" y="2" width="40" height="52" fill="#F2F2F2" stroke="#141416" stroke-width=".8"/><path d="M21 40L9 28.6A6.6 6.6 0 0 1 21 21.4L23 25L20 29L23 33Z" fill="#C8102E"/><path d="M24 41L26 33L23 29L26 25L24 21.6A6.6 6.6 0 0 1 35 28.6Z" fill="#C8102E"/><text x="22" y="50" font-size="4.4" text-anchor="middle" fill="#141416" font-family="Caveat,cursive">xoxo</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_sunset",
    nome: "Pôster Sunset Synthwave",
    preco: 70,
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#180C2E" stroke="#E03185" stroke-width="1.2"/><path d="M4 36h36v16H4z" fill="#0E071A"/><path d="M4 38h36M4 42h36M4 47h36M12 36l-8 16M22 36v16M32 36l8 16" stroke="#4FE3FF" stroke-width=".6"/><circle cx="22" cy="28" r="13" fill="#FF8A00"/><path d="M9 25h26M10 28h24M12 31h20M15 34h14" stroke="#180C2E" stroke-width="1.4"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_cafe_livros",
    nome: "Pôster Café & Livros",
    preco: 60,
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#F4EDE2" stroke="#6B4A30" stroke-width="1"/><rect x="10" y="38" width="24" height="6" fill="#C8302C" rx="1"/><rect x="8" y="44" width="28" height="6" fill="#2F6FD6" rx="1"/><rect x="13" y="26" width="16" height="12" fill="#6B4A30" rx="2"/><path d="M29 29c3 0 4 2 4 4s-1 4-4 4" stroke="#6B4A30" stroke-width="1.6" fill="none"/><path d="M18 22c0-3 2-4 2-7M22 22c0-3 2-4 2-7" stroke="#9C8B7A" stroke-width="1" stroke-linecap="round" fill="none"/><text x="22" y="12" font-size="3.8" text-anchor="middle" font-weight="bold" fill="#6B4A30" font-family="sans-serif">LEIA MAIS</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_pixel",
    nome: "Pôster Espada 8-Bit",
    preco: 80,
    mundo: "gamer",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1E1F24" stroke="#4FE3FF" stroke-width="1.2"/><rect x="20" y="8" width="4" height="4" fill="#4FE3FF"/><rect x="20" y="12" width="4" height="4" fill="#4FE3FF"/><rect x="20" y="16" width="4" height="4" fill="#4FE3FF"/><rect x="20" y="20" width="4" height="4" fill="#4FE3FF"/><rect x="20" y="24" width="4" height="4" fill="#4FE3FF"/><rect x="12" y="28" width="20" height="4" fill="#F2C318"/><rect x="20" y="32" width="4" height="8" fill="#8A6A3A"/><rect x="18" y="40" width="8" height="4" fill="#F2C318"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },

  /* ---------- pôsteres paródia: mundo emo ---------- */
  {
    slot: "poster",
    id: "q_poster_mcr",
    nome: "Pôster Meu Romance Químico",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#C8102E"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#E0314F" font-family="Bungee,sans-serif">MEU</text><text x="22" y="23" font-size="5" text-anchor="middle" fill="#E0314F" font-family="Bungee,sans-serif">ROMANCE</text><path d="M16 38l6 6 6-6a5 5 0 0 0-7-7l-1 1-1-1a5 5 0 0 0-7 7z" fill="#C8102E"/><text x="22" y="50" font-size="3" text-anchor="middle" fill="#C9C1AE" font-family="sans-serif">PARADA NEGRA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_paramais",
    nome: "Pôster Paramais",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1E1F24" stroke="#FFC21A"/><text x="22" y="18" font-size="5" text-anchor="middle" fill="#FFC21A" font-family="Bungee,sans-serif">PARA</text><text x="22" y="25" font-size="5" text-anchor="middle" fill="#FFC21A" font-family="Bungee,sans-serif">MAIS</text><path d="M12 34h20M12 39h20M12 44h20" stroke="#FF4FD8" stroke-width="2.5"/><text x="22" y="51" font-size="3" text-anchor="middle" fill="#FFD86B" font-family="sans-serif">RIOT!</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_fallout",
    nome: "Pôster Cai Fora Boy",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#241B2E" stroke="#F2C14E"/><text x="22" y="17" font-size="4.8" text-anchor="middle" fill="#F2C14E" font-family="Bungee,sans-serif">CAI FORA</text><text x="22" y="24" font-size="4.8" text-anchor="middle" fill="#F2C14E" font-family="Bungee,sans-serif">BOY</text><circle cx="22" cy="36" r="8" fill="#5B2E7A"/><path d="M18 36l3 3 5-5" stroke="#F2C14E" stroke-width="1.6" fill="none"/><text x="22" y="51" font-size="3" text-anchor="middle" fill="#F2EAD3" font-family="sans-serif">SOB A CORTINA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_panic",
    nome: "Pôster Pânico na Pista",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1C141E" stroke="#D9B86A"/><text x="22" y="16" font-size="4.8" text-anchor="middle" fill="#D9B86A" font-family="Bungee,sans-serif">PÂNICO!</text><text x="22" y="23" font-size="4.8" text-anchor="middle" fill="#D9B86A" font-family="Bungee,sans-serif">NA PISTA</text><circle cx="22" cy="35" r="7" fill="#8A1A3A"/><polygon points="22,30 20,40 24,40" fill="#D9B86A"/><text x="22" y="51" font-size="2.8" text-anchor="middle" fill="#F2EAD3" font-family="sans-serif">FEBRE DE CABARÉ</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_greenday",
    nome: "Pôster Dia Verde",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#4FC488"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#4FC488" font-family="Bungee,sans-serif">DIA</text><text x="22" y="23" font-size="5" text-anchor="middle" fill="#4FC488" font-family="Bungee,sans-serif">VERDE</text><circle cx="22" cy="35" r="7" fill="#C8102E"/><rect x="20" y="25" width="4" height="4" fill="#4FC488"/><text x="22" y="50" font-size="3" text-anchor="middle" fill="#4FC488" font-family="sans-serif">CORAÇÃO GRANADA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_blink",
    nome: "Pôster Pisca-182",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1E1F24" stroke="#4FE3FF"/><text x="22" y="17" font-size="5" text-anchor="middle" fill="#4FE3FF" font-family="Bungee,sans-serif">PISCA</text><text x="22" y="24" font-size="5" text-anchor="middle" fill="#FFD86B" font-family="Bungee,sans-serif">182</text><circle cx="22" cy="36" r="8" fill="#FFD86B"/><circle cx="19" cy="34" r="1.4" fill="#141416"/><path d="M24 33l3 2-3 2" stroke="#141416" stroke-width="1.2" fill="none"/><path d="M18 39q4 3 8 0" stroke="#141416" stroke-width="1.2" fill="none"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_evanescence",
    nome: "Pôster Desvanecer",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#0E121E" stroke="#8CBECF"/><text x="22" y="18" font-size="4.2" text-anchor="middle" fill="#8CBECF" font-family="serif">DESVANECER</text><circle cx="22" cy="34" r="9" fill="none" stroke="#8CBECF" stroke-width="1.2"/><circle cx="22" cy="34" r="6" fill="#182A4A" opacity=".7"/><text x="22" y="51" font-size="2.8" text-anchor="middle" fill="#7FA2E8" font-family="sans-serif">ME TRAGA À VIDA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_simpleplan",
    nome: "Pôster Plano Simples",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#22232A" stroke="#E0312F"/><text x="22" y="16" font-size="4.6" text-anchor="middle" fill="#E0312F" font-family="Bungee,sans-serif">PLANO</text><text x="22" y="23" font-size="4.6" text-anchor="middle" fill="#E0312F" font-family="Bungee,sans-serif">SIMPLES</text><polygon points="22,28 24,34 30,34 25,38 27,44 22,40 17,44 19,38 14,34 20,34" fill="#F2C14E"/><text x="22" y="51" font-size="3" text-anchor="middle" fill="#F2F2F2" font-family="sans-serif">SEM CAPACETE</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_avril",
    nome: "Pôster Abril Skater",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#FF4FD8"/><text x="22" y="16" font-size="4.8" text-anchor="middle" fill="#FF4FD8" font-family="Bungee,sans-serif">ABRIL</text><text x="22" y="23" font-size="4.8" text-anchor="middle" fill="#FF4FD8" font-family="Bungee,sans-serif">SKATER</text><polygon points="22,28 24,34 30,34 25,38 27,44 22,40 17,44 19,38 14,34 20,34" fill="#141416" stroke="#FF4FD8" stroke-width="1.4"/><path d="M21 42l2 8 2-8z" fill="#C8102E"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_theused",
    nome: "Pôster Os Usados",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1B1B1E" stroke="#D9D5CC"/><text x="22" y="17" font-size="5" text-anchor="middle" fill="#D9D5CC" font-family="Bungee,sans-serif">OS</text><text x="22" y="24" font-size="5" text-anchor="middle" fill="#D9D5CC" font-family="Bungee,sans-serif">USADOS</text><rect x="14" y="31" width="16" height="10" fill="#C8102E" rx="2"/><rect x="18" y="29" width="8" height="14" fill="#FAF6EE" opacity=".6" transform="rotate(45 22 36)"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_tbs",
    nome: "Pôster Devolve o Domingo",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#201A24" stroke="#E8C24A"/><text x="22" y="16" font-size="4.2" text-anchor="middle" fill="#E8C24A" font-family="Bungee,sans-serif">DEVOLVE O</text><text x="22" y="23" font-size="4.2" text-anchor="middle" fill="#E8C24A" font-family="Bungee,sans-serif">DOMINGO</text><circle cx="22" cy="35" r="7" fill="none" stroke="#E8C24A" stroke-width="1.4"/><path d="M22 31v4l3 2" stroke="#E8C24A" stroke-width="1.2" stroke-linecap="round"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_ptv",
    nome: "Pôster Fura o Véu",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#FF6B8B"/><text x="22" y="16" font-size="4.6" text-anchor="middle" fill="#FF6B8B" font-family="Bungee,sans-serif">FURA O</text><text x="22" y="23" font-size="4.6" text-anchor="middle" fill="#FF6B8B" font-family="Bungee,sans-serif">VÉU</text><circle cx="22" cy="35" r="6" fill="#C8102E"/><path d="M18 42l8-14" stroke="#FAF6EE" stroke-width="1.4" stroke-linecap="round"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_sws",
    nome: "Pôster Com Sereias",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141C24" stroke="#7FE3FF"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#7FE3FF" font-family="Bungee,sans-serif">COM</text><text x="22" y="23" font-size="4.4" text-anchor="middle" fill="#7FE3FF" font-family="Bungee,sans-serif">SEREIAS</text><path d="M12 36q5-4 10 0t10 0" stroke="#7FE3FF" stroke-width="2" fill="none"/><path d="M12 42q5-4 10 0t10 0" stroke="#7FE3FF" stroke-width="1.4" fill="none"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_atl",
    nome: "Pôster Fundo do Poço",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1E1A26" stroke="#FFB4D6"/><text x="22" y="16" font-size="4.2" text-anchor="middle" fill="#FFB4D6" font-family="Bungee,sans-serif">FUNDO DO</text><text x="22" y="23" font-size="5" text-anchor="middle" fill="#FFB4D6" font-family="Bungee,sans-serif">POÇO</text><circle cx="22" cy="35" r="6" fill="#FAF6EE"/><circle cx="20" cy="34" r="1.2" fill="#141416"/><circle cx="24" cy="34" r="1.2" fill="#141416"/><path d="M19 41l6-6M25 41l-6-6" stroke="#C8102E" stroke-width="1.2"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_nx",
    nome: "Pôster Gelo Zero",
    preco: 70,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#161B24" stroke="#4FE3FF"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#4FE3FF" font-family="Bungee,sans-serif">GELO</text><text x="22" y="23" font-size="5" text-anchor="middle" fill="#4FE3FF" font-family="Bungee,sans-serif">ZERO</text><ellipse cx="22" cy="36" rx="7" ry="9" fill="none" stroke="#4FE3FF" stroke-width="2.5"/><text x="22" y="51" font-size="3" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">ALÉM DE MIM</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },

  /* ---------- pôsteres paródia: mundo rock ---------- */
  {
    slot: "poster",
    id: "q_poster_nirvana",
    nome: "Pôster Sorriso Grunge",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#182A40" stroke="#FFD86B"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#FFD86B" font-family="Bungee,sans-serif">SORRISO</text><circle cx="22" cy="32" r="10" fill="none" stroke="#FFD86B" stroke-width="1.8"/><path d="M17 29l3 3M20 29l-3 3M24 29l3 3M27 29l-3 3M17 37q5 4 10 0" stroke="#FFD86B" stroke-width="1.4" fill="none"/><text x="22" y="50" font-size="3" text-anchor="middle" fill="#FFD86B" font-family="sans-serif">CHEIRO DE JOVEM</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_acdc",
    nome: "Pôster Alta Voltagem",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#E0312F"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#E0312F" font-family="Bungee,sans-serif">ALTA</text><text x="22" y="24" font-size="5" text-anchor="middle" fill="#E0312F" font-family="Bungee,sans-serif">VOLTAGEM</text><path d="M23 26L14 39H20L17 48L28 35H22L25 26Z" fill="#F2C318"/><text x="22" y="51" font-size="3" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">ESTRADA DO SOM</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_queen",
    nome: "Pôster Realeza",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1C1A22" stroke="#F2C14E"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#F2C14E" font-family="Bungee,sans-serif">REALEZA</text><path d="M12 36l-2-10 6 5 6-7 6 7 6-5-2 10z" fill="#F2C14E"/><circle cx="16" cy="24" r="1.2" fill="#C8102E"/><circle cx="22" cy="22" r="1.4" fill="#2F6FD6"/><circle cx="28" cy="24" r="1.2" fill="#C8102E"/><text x="22" y="50" font-size="2.8" text-anchor="middle" fill="#F2EAD3" font-family="sans-serif">RAPSÓDIA BOÊMIA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_guns",
    nome: "Pôster Balas & Rosas",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#F2C318"/><text x="22" y="16" font-size="4.4" text-anchor="middle" fill="#F2C318" font-family="Bungee,sans-serif">BALAS &</text><text x="22" y="23" font-size="5" text-anchor="middle" fill="#F2C318" font-family="Bungee,sans-serif">ROSAS</text><circle cx="16" cy="34" r="5" fill="#C8102E"/><circle cx="28" cy="34" r="5" fill="#C8102E"/><path d="M12 39h20M22 28v16" stroke="#F2C318" stroke-width="1.8"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_metallica",
    nome: "Pôster Metálica",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#C9CED6"/><text x="22" y="18" font-size="5" text-anchor="middle" fill="#C9CED6" font-family="Bungee,sans-serif">METÁLICA</text><path d="M8 24l14 8 14-8" stroke="#C9CED6" stroke-width="2" fill="none"/><rect x="18" y="36" width="8" height="12" fill="#FAF6EE" rx="1"/><text x="22" y="51" font-size="2.8" text-anchor="middle" fill="#C9CED6" font-family="sans-serif">MESTRE DAS CORDAS</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_pinkfloyd",
    nome: "Pôster Prisma Cósmico",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#FAF6EE"/><text x="22" y="16" font-size="5" text-anchor="middle" fill="#FAF6EE" font-family="Bungee,sans-serif">PRISMA</text><polygon points="22,24 12,39 32,39" fill="none" stroke="#FAF6EE" stroke-width="1.4"/><path d="M22 31L38 34" stroke="#E0312F" stroke-width="1.2"/><path d="M22 32L38 36" stroke="#F2C318" stroke-width="1.2"/><path d="M22 33L38 38" stroke="#2FB344" stroke-width="1.2"/><path d="M22 34L38 40" stroke="#2F6FD6" stroke-width="1.2"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_stones",
    nome: "Pôster Pedras Rolantes",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1E1F24" stroke="#E0312F"/><text x="22" y="16" font-size="4.4" text-anchor="middle" fill="#FAF6EE" font-family="Bungee,sans-serif">PEDRAS</text><text x="22" y="23" font-size="4.4" text-anchor="middle" fill="#FAF6EE" font-family="Bungee,sans-serif">ROLANTES</text><ellipse cx="22" cy="32" rx="9" ry="6" fill="#C8102E"/><path d="M18 33c0 7 8 7 8 0" fill="#E0312F"/><path d="M22 33v5" stroke="#141416" stroke-width="1"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_led",
    nome: "Pôster Dirigível",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#22232B" stroke="#E8C24A"/><text x="22" y="17" font-size="4.4" text-anchor="middle" fill="#E8C24A" font-family="Bungee,sans-serif">DIRIGÍVEL</text><ellipse cx="22" cy="32" rx="13" ry="5.5" fill="#8C96A6"/><rect x="18" y="37" width="8" height="2" fill="#606874"/><text x="22" y="50" font-size="2.8" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">ESCADA PRO CÉU</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_sabbath",
    nome: "Pôster Sábado Negro",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#9A4FD8"/><text x="22" y="16" font-size="4.8" text-anchor="middle" fill="#9A4FD8" font-family="Bungee,sans-serif">SÁBADO</text><text x="22" y="23" font-size="5" text-anchor="middle" fill="#9A4FD8" font-family="Bungee,sans-serif">NEGRO</text><path d="M22 26v16M16 32h12" stroke="#9A4FD8" stroke-width="3" stroke-linecap="round"/><text x="22" y="50" font-size="3" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">PARANÓIDE</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_maiden",
    nome: "Pôster Donzela de Ferro",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#E0312F"/><text x="22" y="16" font-size="4.4" text-anchor="middle" fill="#E0312F" font-family="Bungee,sans-serif">DONZELA</text><circle cx="22" cy="32" r="8" fill="#8A6A3A"/><circle cx="19" cy="31" r="1.4" fill="#FFC21A"/><circle cx="25" cy="31" r="1.4" fill="#FFC21A"/><path d="M18 36h8" stroke="#141416" stroke-width="1.2"/><text x="22" y="50" font-size="2.8" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">NÚMERO DA FERA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_rhcp",
    nome: "Pôster Pimenta Ardida",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1E1F24" stroke="#FAF6EE"/><text x="22" y="16" font-size="4.4" text-anchor="middle" fill="#FAF6EE" font-family="Bungee,sans-serif">PIMENTA</text><path d="M22 24v18M13 33h18M16 27l12 12M28 27l-12 12" stroke="#E0312F" stroke-width="3" stroke-linecap="round"/><text x="22" y="50" font-size="2.8" text-anchor="middle" fill="#E0312F" font-family="sans-serif">CALIFÓRNIA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_arctic",
    nome: "Pôster Macacos do Gelo",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#141416" stroke="#FAF6EE"/><text x="22" y="16" font-size="4.2" text-anchor="middle" fill="#FAF6EE" font-family="Bungee,sans-serif">MACACOS</text><path d="M6 33q4-10 8 0t8 0t8 0t8 0" stroke="#FAF6EE" stroke-width="1.8" fill="none"/><text x="22" y="50" font-size="3" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">A.M.</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_strokes",
    nome: "Pôster Os Traços",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1E1F24" stroke="#FF8A00"/><text x="22" y="17" font-size="4.4" text-anchor="middle" fill="#FF8A00" font-family="Bungee,sans-serif">OS TRAÇOS</text><circle cx="22" cy="33" r="8" fill="none" stroke="#FF8A00" stroke-width="2.5"/><text x="22" y="50" font-size="2.8" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">IS THIS IT</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_radiohead",
    nome: "Pôster Cabeça de Rádio",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#1A1A1E" stroke="#E0312F"/><text x="22" y="15" font-size="4" text-anchor="middle" fill="#E0312F" font-family="Bungee,sans-serif">CABEÇA DE</text><text x="22" y="22" font-size="4.8" text-anchor="middle" fill="#E0312F" font-family="Bungee,sans-serif">RÁDIO</text><circle cx="22" cy="34" r="8" fill="#FAF6EE"/><circle cx="19" cy="33" r="1.4" fill="#141416"/><circle cx="25" cy="33" r="1.4" fill="#141416"/><path d="M17 38l2-2 2 2 2-2 2 2" stroke="#141416" stroke-width="1" fill="none"/><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
  },
  {
    slot: "poster",
    id: "q_poster_legiao",
    nome: "Pôster Legião da Cidade",
    preco: 70,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#24252B" stroke="#FAF6EE"/><text x="22" y="17" font-size="5" text-anchor="middle" fill="#FAF6EE" font-family="Bungee,sans-serif">LEGIÃO</text><path d="M12 33h16M24 29l4 4-4 4" stroke="#FAF6EE" stroke-width="2" fill="none"/><text x="22" y="50" font-size="3" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">GERAÇÃO COCA-COLA</text><rect x="1" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(-25 5 1)" opacity=".85"/><rect x="35" y="0" width="8" height="3" fill="#EAD9A6" transform="rotate(25 39 1)" opacity=".85"/>`
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

  /* ---------- bichinho (pet) ---------- */
  {
    slot: "pet",
    id: "q_pet_gato_preto",
    nome: "Gato preto na cama",
    preco: 60,
    svg: () =>
      `<ellipse cx="22" cy="24" rx="16" ry="11" fill="#18181C"/><circle cx="12" cy="18" r="9" fill="#18181C"/><path d="M6 14l-2-6 6 3zM14 12l3-6 1 6z" fill="#18181C"/><path d="M6 13l-1-4 4 2zM14 12l2-4 1 4z" fill="#E8829C"/><ellipse cx="10" cy="19" rx="1.4" ry=".6" fill="#E8829C"/><path d="M8 22c2 1 4 1 6 0" stroke="#444" stroke-width=".6" fill="none"/><path d="M36 26c4-1 6-4 5-8" stroke="#18181C" stroke-width="3" stroke-linecap="round" fill="none"/><text x="30" y="11" font-size="6.5" font-family="Caveat,cursive" fill="#888">zZz</text>`
  },
  {
    slot: "pet",
    id: "q_pet_gato_laranja",
    nome: "Gato laranja curioso",
    preco: 90,
    svg: () =>
      `<ellipse cx="22" cy="25" rx="15" ry="10" fill="#E88538"/><path d="M15 17l2 4M21 16l1 4M27 17l-1 4" stroke="#C4601A" stroke-width="1.2" stroke-linecap="round"/><circle cx="12" cy="18" r="8.5" fill="#E88538"/><path d="M6 13l-2-6 6 3zM15 12l3-6 1 6z" fill="#E88538"/><path d="M6 12l-1-4 4 2zM15 11l2-4 1 4z" fill="#FCE4D6"/><ellipse cx="10" cy="17" rx="1.4" ry="1.8" fill="#141416"/><ellipse cx="15" cy="17" rx="1.4" ry="1.8" fill="#141416"/><ellipse cx="12.5" cy="20" rx="1.2" ry=".7" fill="#FCE4D6"/><path d="M35 25c4-1 6-5 4-9" stroke="#E88538" stroke-width="3" stroke-linecap="round" fill="none"/>`
  },
  {
    slot: "pet",
    id: "q_pet_cachorro",
    nome: "Cachorrinho caramelo",
    preco: 110,
    svg: () =>
      `<ellipse cx="24" cy="25" rx="16" ry="11" fill="#C99452"/><circle cx="13" cy="19" r="8.5" fill="#C99452"/><ellipse cx="7" cy="19" rx="3.5" ry="6" fill="#9C682B" transform="rotate(15 7 19)"/><ellipse cx="17" cy="19" rx="3.5" ry="6" fill="#9C682B" transform="rotate(-15 17 19)"/><circle cx="10.5" cy="18" r="1.2" fill="#141416"/><circle cx="15.5" cy="18" r="1.2" fill="#141416"/><ellipse cx="13" cy="21" rx="2" ry="1.2" fill="#141416"/><ellipse cx="11" cy="31" rx="4" ry="2" fill="#C99452"/><ellipse cx="20" cy="31" rx="4" ry="2" fill="#C99452"/><path d="M38 24c3-2 5-6 3-8" stroke="#C99452" stroke-width="3" stroke-linecap="round" fill="none"/>`
  },
  {
    slot: "pet",
    id: "q_pet_morcego",
    nome: "Morceguinho de estimação",
    preco: 100,
    mundo: "emo",
    svg: () =>
      `<path d="M22 14c-6-8-16-6-20 2 6 3 9 9 10 14 3-3 7-4 10-4s7 1 10 4c1-5 4-11 10-14-4-8-14-10-20-2z" fill="#1E1624"/><ellipse cx="22" cy="24" rx="7" ry="10" fill="#2E2436"/><circle cx="22" cy="15" r="5.5" fill="#2E2436"/><path d="M18 11l-2-5 4 3zM26 11l2-5-4 3z" fill="#2E2436"/><circle cx="20" cy="15" r="1.2" fill="#C8102E"/><circle cx="24" cy="15" r="1.2" fill="#C8102E"/><path d="M20 18l1 2 1-2 1 2 1-2" stroke="#fff" stroke-width=".8" fill="none"/>`
  },
  {
    slot: "pet",
    id: "q_pet_planta",
    nome: "Vaso de Monstera",
    preco: 70,
    svg: () =>
      `<path d="M12 24h20l-3 14H15Z" fill="#C98A60"/><rect x="10" y="22" width="24" height="3" rx="1" fill="#DF9F74"/><path d="M22 22V6M22 14q-10-8-12-3q4 6 12 3M22 12q10-8 12-3q-4 6-12 3M22 8q-6-8-8-4q3 5 8 4" stroke="#2B6B38" stroke-width="2.2" stroke-linecap="round" fill="none"/>`
  },
  {
    slot: "pet",
    id: "q_pet_hamster",
    nome: "Hamster na gaiolinha",
    preco: 90,
    svg: () =>
      `<rect x="6" y="12" width="32" height="24" rx="4" fill="#E8F4F8" stroke="#8CBECF" stroke-width="1.2" opacity=".9"/><path d="M10 12v24M16 12v24M22 12v24M28 12v24M34 12v24" stroke="#8CBECF" stroke-width=".8"/><ellipse cx="22" cy="27" rx="6" ry="5" fill="#E8B07A"/><circle cx="17" cy="25" r="3.5" fill="#E8B07A"/><circle cx="16" cy="24" r=".9" fill="#141416"/><circle cx="15" cy="26" r=".6" fill="#E8829C"/>`
  },
  {
    slot: "pet",
    id: "q_pet_calopsita",
    nome: "Calopsita no poleiro",
    preco: 80,
    svg: () =>
      `<rect x="10" y="34" width="28" height="3" fill="#8A6A3A" rx="1"/><rect x="23" y="36" width="3" height="6" fill="#6B4A30"/><ellipse cx="24" cy="24" rx="8" ry="11" fill="#ECE8D8"/><circle cx="24" cy="15" r="6" fill="#F4E662"/><path d="M22 9c-1-5 2-8 3-9 0 3-1 6 1 8" stroke="#F4E662" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="21" cy="14" r="1.1" fill="#141416"/><path d="M18 15l-3 2 3 1z" fill="#E89A38"/><circle cx="26" cy="16" r="2.2" fill="#E86238" opacity=".85"/><path d="M28 24c3 3 5 10 4 14" stroke="#9C9886" stroke-width="3" stroke-linecap="round" fill="none"/>`
  },
  {
    slot: "pet",
    id: "q_pet_coelho",
    nome: "Coelhinho branco",
    preco: 85,
    svg: () =>
      `<ellipse cx="24" cy="26" rx="14" ry="10" fill="#FFFFFF" stroke="#D8D4CC" stroke-width=".8"/><circle cx="14" cy="20" r="8" fill="#FFFFFF" stroke="#D8D4CC" stroke-width=".8"/><ellipse cx="11" cy="9" rx="2.5" ry="7" fill="#FFFFFF" stroke="#D8D4CC" stroke-width=".8" transform="rotate(-10 11 9)"/><ellipse cx="11" cy="9" rx="1.4" ry="5" fill="#F4B8C8" transform="rotate(-10 11 9)"/><ellipse cx="17" cy="9" rx="2.5" ry="7" fill="#FFFFFF" stroke="#D8D4CC" stroke-width=".8" transform="rotate(10 17 9)"/><ellipse cx="17" cy="9" rx="1.4" ry="5" fill="#F4B8C8" transform="rotate(10 17 9)"/><circle cx="11" cy="19" r="1.2" fill="#C8102E"/><circle cx="37" cy="24" r="3.2" fill="#FFFFFF" stroke="#D8D4CC" stroke-width=".8"/><ellipse cx="12" cy="22" rx="1" ry=".7" fill="#F4B8C8"/>`
  },
  {
    slot: "pet",
    id: "q_pet_aquario",
    nome: "Aquário redondo",
    preco: 95,
    svg: () =>
      `<circle cx="24" cy="24" r="16" fill="#9FD3F2" opacity=".85" stroke="#7CB8D8" stroke-width="1.6"/><circle cx="24" cy="24" r="14" fill="#6FBEE6" opacity=".5"/><ellipse cx="24" cy="10" rx="10" ry="2.5" fill="#E8F4FA" stroke="#7CB8D8" stroke-width="1"/><ellipse cx="24" cy="38" rx="8" ry="2" fill="#D4B482"/><ellipse cx="24" cy="24" rx="4.5" ry="3" fill="#FF8A00"/><path d="M28 24l5-4v8z" fill="#FF8A00"/><circle cx="21" cy="23" r=".8" fill="#141416"/><circle cx="20" cy="17" r="1" fill="#fff" opacity=".7"/><circle cx="23" cy="14" r="1.4" fill="#fff" opacity=".8"/>`
  },
  {
    slot: "pet",
    id: "q_pet_raposa",
    nome: "Raposinha dormindo",
    preco: 120,
    svg: () =>
      `<ellipse cx="24" cy="26" rx="15" ry="10" fill="#E05A20"/><path d="M12 28c3 4 8 6 14 6 8 0 14-5 14-11-2 4-6 6-12 6s-12-3-16-1z" fill="#FFFFFF"/><circle cx="15" cy="20" r="7.5" fill="#E05A20"/><path d="M10 15l-3-6 6 3zM18 14l3-6 1 6z" fill="#E05A20"/><path d="M10 14l-1-4 3 2zM18 14l2-4 1 4z" fill="#1E1F24"/><path d="M10 22c2-1 4-1 6 0" stroke="#141416" stroke-width=".8" fill="none"/><ellipse cx="13" cy="23" rx="1.2" ry=".8" fill="#141416"/><path d="M30 20c4-1 8-1 9 4s-4 9-11 8c6 0 9-4 8-8s-3-4-6-4z" fill="#FFFFFF"/><text x="32" y="12" font-size="6" font-family="Caveat,cursive" fill="#888">zZz</text>`
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
  {
    slot: "tapete",
    id: "q_tapete_coracao",
    nome: "Tapete coração",
    preco: 50,
    svg: () =>
      `<path d="M75 30L38 14A18 18 0 0 1 75 9A18 18 0 0 1 112 14Z" fill="#F48BA7"/><path d="M75 26L44 14A14 14 0 0 1 75 11A14 14 0 0 1 106 14Z" fill="#E86488"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_k7",
    nome: "Tapete fita cassete",
    preco: 90,
    svg: () =>
      `<rect x="25" y="4" width="100" height="26" rx="4" fill="#1E1F24" stroke="#444" stroke-width="1.2"/><rect x="42" y="8" width="66" height="18" fill="#FAF6EE" rx="2"/><circle cx="56" cy="17" r="4.5" fill="#1E1F24"/><circle cx="94" cy="17" r="4.5" fill="#1E1F24"/><rect x="65" y="13" width="20" height="8" fill="#C8302C"/>`
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
  },
  {
    slot: "luz",
    id: "q_luz_fairy",
    nome: "Luzinhas pisca-pisca",
    preco: 80,
    topo: W =>
      `<path d="M0 8Q90 26 180 14T360 16" fill="none" stroke="#333" stroke-width=".8"/>${Array.from({ length: 14 }, (_, i) => `<circle cx="${18 + i * 24}" cy="${14 + Math.sin(i * 1.1) * 6}" r="2.8" fill="${["#FFD86B", "#FF9E79", "#7FE3FF", "#FFB4D6"][i % 4]}" class="pisca"/><circle cx="${18 + i * 24}" cy="${14 + Math.sin(i * 1.1) * 6}" r="5" fill="${["#FFD86B", "#FF9E79", "#7FE3FF", "#FFB4D6"][i % 4]}" opacity=".35"/>`).join("")}`,
    svg: () =>
      `<rect x="14" y="24" width="8" height="68" fill="none"/><circle cx="18" cy="40" r="4" fill="#FFD86B" class="pisca"/><circle cx="18" cy="60" r="4" fill="#FF9E79" class="pisca"/><circle cx="18" cy="80" r="4" fill="#7FE3FF" class="pisca"/>`
  },
  {
    slot: "luz",
    id: "q_luz_lava",
    nome: "Luminária de lava",
    preco: 95,
    svg: () =>
      `<rect x="12" y="66" width="12" height="26" rx="2" fill="#1E1F24"/><path d="M13 22h10l3 44H10Z" fill="#7C2282"/><circle cx="18" cy="34" r="3.2" fill="#FF4E98"/><ellipse cx="18" cy="46" rx="3.6" ry="5" fill="#FF4E98"/><circle cx="18" cy="58" r="2.6" fill="#FF4E98"/><path d="M12 20h12v4H12z" fill="#C9CED6"/><rect x="10" y="86" width="16" height="6" rx="1" fill="#C9CED6"/>`
  }
];

const QUARTO_PADRAO = {
  chao: "q_madeira",
  janela: "q_noite",
  poster: "",
  cama: "q_cama",
  pet: "",
  tapete: "",
  luz: "q_abajur",
  posPoster: "centro",
  posPet: "cama"
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

  // Posições personalizadas
  const posPoster = q.posPoster || "centro";
  const posPet = q.posPet || "cama";

  const posterCoord = {
    esquerda: { x: 20, y: 26 },
    centro: { x: 120, y: 30 },
    direita: { x: 154, y: 34 }
  }[posPoster] || { x: 120, y: 30 };

  const petCoord =
    {
      cama: temCama ? { x: 104, y: chaoY - 48 } : { x: 76, y: chaoY - 36 },
      tapete: { x: 80, y: chaoY + 12 },
      chao: { x: 154, y: chaoY + 12 }
    }[posPet] || (temCama ? { x: 104, y: chaoY - 48 } : { x: 76, y: chaoY - 36 });

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
    <g class="parede">${fundo.svg(W, chaoY, { noQuarto: true })}</g>
    ${luz && luz.topo ? `<g>${luz.topo(W)}</g>` : ""}
    ${em("janela", 16, 22)}${em("poster", posterCoord.x, posterCoord.y)}
    <g transform="translate(0 ${chaoY})">${chao ? chao.svg(W, altChao) : ""}</g>
    <rect x="0" y="${chaoY - 4}" width="${W}" height="5" fill="rgba(0,0,0,.18)"/>
    ${em("tapete", 20, chaoY + 16)}
    ${em("cama", 4, chaoY - 62)}
    <g class="q-pet-slot" ${d.meu ? 'data-act="pet-tocar"' : ""} style="cursor:pointer">${em("pet", petCoord.x, petCoord.y)}</g>
    ${em("luz", 146, chaoY - 86)}
    <svg x="${W - largE - 6}" y="${chaoY + 6 - altE}" width="${largE}" height="${altE}" viewBox="0 0 360 ${altEst}">${est.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</svg>
    <g class="prumi-leitor" ${d.meu ? 'data-act="prumi-leitor"' : ""}>${leitor}${livroNaMao}</g>
  </svg>`;
}
