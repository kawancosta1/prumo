/*
  Quarto por mundo: define o quarto inicial de cada estilo do Prumi e adiciona itens de decoração temáticos
  para comprar com páginas na estante.
*/
"use strict";

const QUARTO_MUNDOS_NOVOS = [
  /* =========================================================
     1. MUNDO EMO
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_emo",
    nome: "Assoalho preto e roxo",
    preco: 0,
    mundo: "emo",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#16121D"/>` +
      `<rect y="${h - 26}" width="${w}" height="26" fill="#381D46"/>` +
      Array.from(
        { length: Math.ceil(w / 40) },
        (_, i) => `<path d="M${i * 40} 0v${h}" stroke="#271932" stroke-width="1.2"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_emo",
    nome: "Janela ogival sombria",
    preco: 0,
    mundo: "emo",
    svg: () =>
      `<path d="M8 70V28Q8 4 45 4Q82 4 82 28V70Z" fill="#140D18"/>` +
      `<circle cx="58" cy="24" r="12" fill="#D32742" opacity=".85"/>` +
      `<circle cx="53" cy="20" r="10" fill="#140D18"/>` +
      `<path d="M8 70V28Q8 4 45 4Q82 4 82 28V70Z" fill="none" stroke="#2D1F32" stroke-width="5"/>` +
      `<path d="M45 4V70M8 40H82" stroke="#2D1F32" stroke-width="2.5"/>` +
      `<rect x="4" y="68" width="82" height="8" rx="2" fill="#201524"/>`
  },
  {
    slot: "cama",
    id: "q_cama_emo",
    nome: "Cama vitoriana de veludo",
    preco: 0,
    mundo: "emo",
    svg: () =>
      `<rect x="6" y="8" width="8" height="62" rx="2" fill="#18131E"/>` +
      `<rect x="130" y="24" width="6" height="46" rx="2" fill="#18131E"/>` +
      `<rect x="10" y="38" width="124" height="24" rx="4" fill="#241B2C"/>` +
      `<rect x="14" y="28" width="30" height="14" rx="5" fill="#4A1625"/>` +
      `<path d="M46 36H132V58Q132 62 128 62H46Z" fill="#8A132C"/>` +
      `<path d="M46 36H132" stroke="#B81D3D" stroke-width="2"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#18131E"/><rect x="126" y="62" width="6" height="8" fill="#18131E"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_emo",
    nome: "Tapete teia sombria",
    preco: 0,
    mundo: "emo",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#18131F" stroke="#B81D3D" stroke-width="1.6"/>` +
      `<path d="M20 17H130M75 5V29M35 9L115 25M35 25L115 9" stroke="#681932" stroke-width="1.2"/>` +
      `<circle cx="75" cy="17" r="4" fill="#B81D3D"/>`
  },
  {
    slot: "luz",
    id: "q_luz_emo",
    nome: "Candelabro gótico",
    preco: 0,
    mundo: "emo",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" rx="1" fill="#201524"/>` +
      `<path d="M18 86V52M8 60Q8 52 18 52Q28 52 28 60" fill="none" stroke="#2B1D33" stroke-width="2.4"/>` +
      [8, 18, 28]
        .map(
          x =>
            `<rect x="${x - 2}" y="${x === 18 ? 38 : 46}" width="4" height="12" fill="#E6E0D5"/>` +
            `<path class="chama" d="M${x} ${x === 18 ? 30 : 38}q2 3 0 6q-2-3 0-6z" fill="#D32742"/>`
        )
        .join("")
  },
  {
    slot: "poster",
    id: "q_poster_emo_morcego",
    nome: "Pôster Morcego & Rosa",
    preco: 0,
    mundo: "emo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#140D18" stroke="#B81D3D" stroke-width="1.4"/>` +
      `<path d="M10 24Q16 14 22 20Q28 14 34 24Q28 28 22 25Q16 28 10 24Z" fill="#D32742"/>` +
      `<circle cx="22" cy="38" r="6" fill="#8A132C"/>` +
      `<path d="M19 38q3-4 6 0" stroke="#FAF6EE" stroke-width="1" fill="none"/>` +
      `<text x="22" y="50" font-size="3" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">ETERNIDADE</text>` +
      `<rect x="1" y="0" width="8" height="3" fill="#B81D3D" transform="rotate(-25 5 1)" opacity=".8"/>` +
      `<rect x="35" y="0" width="8" height="3" fill="#B81D3D" transform="rotate(25 39 1)" opacity=".8"/>`
  },
  {
    slot: "janela",
    id: "q_janela_emo_tempestade",
    nome: "Janela noite tempestuosa",
    preco: 120,
    mundo: "emo",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#120A1F"/>` +
      `<path d="M50 8L38 32H46L34 58L62 26H52Z" fill="#C084FC" opacity=".85"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#251633" stroke-width="5"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#251633" stroke-width="3"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#251633"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_emo_espinhos",
    nome: "Tapete coração espinhoso",
    preco: 85,
    mundo: "emo",
    svg: () =>
      `<path d="M75 30L34 13A20 20 0 0 1 75 7A20 20 0 0 1 116 13Z" fill="#22111E" stroke="#E11D48" stroke-width="1.8"/>` +
      `<path d="M45 14l4 4-2 2M65 10l2 5M85 10l-2 5M105 14l-4 4" stroke="#E11D48" stroke-width="1.6" fill="none"/>`
  },

  /* =========================================================
     2. MUNDO ROCK
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_rock",
    nome: "Piso de palco de madeira",
    preco: 0,
    mundo: "rock",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#1E1E24"/>` +
      Array.from(
        { length: Math.ceil(h / 14) },
        (_, i) =>
          `<path d="M0 ${i * 14}H${w}" stroke="#141418" stroke-width="1.4"/>` +
          Array.from(
            { length: Math.ceil(w / 50) },
            (_, k) => `<path d="M${k * 50 + (i % 2) * 25} ${i * 14}v14" stroke="#141418" stroke-width="1.2"/>`
          ).join("")
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_rock_garagem",
    nome: "Janela de garagem de ensaio",
    preco: 0,
    mundo: "rock",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#1C2028"/>` +
      `<path d="M4 44h82v26H4z" fill="#0F1218"/>` +
      `<circle cx="24" cy="22" r="9" fill="#F59E0B" opacity=".7"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#374151" stroke-width="5"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#374151" stroke-width="3"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#4B5563"/>`
  },
  {
    slot: "cama",
    id: "q_cama_rock",
    nome: "Cama colcha de couro & patches",
    preco: 0,
    mundo: "rock",
    svg: () =>
      `<rect x="4" y="14" width="10" height="56" rx="2" fill="#262626"/>` +
      `<rect x="10" y="38" width="126" height="24" rx="3" fill="#1F1F1F" stroke="#111"/>` +
      `<rect x="14" y="28" width="32" height="14" rx="5" fill="#3B3B3B"/>` +
      `<path d="M48 36H134V58Q134 62 130 62H48Z" fill="#DC2626"/>` +
      `<circle cx="70" cy="48" r="5" fill="#F59E0B"/><polygon points="95,44 100,54 90,54" fill="#2563EB"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#262626"/><rect x="126" y="62" width="6" height="8" fill="#262626"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_rock",
    nome: "Tapete palheta de guitarra",
    preco: 0,
    mundo: "rock",
    svg: () =>
      `<path d="M20 7Q75 2 130 7Q140 26 75 31Q10 26 20 7Z" fill="#B91C1C" stroke="#F59E0B" stroke-width="2"/>` +
      `<text x="75" y="20" font-size="8" font-weight="bold" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">ROCK</text>`
  },
  {
    slot: "luz",
    id: "q_luz_rock",
    nome: "Refletor de ensaio",
    preco: 0,
    mundo: "rock",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" rx="1" fill="#1F2937"/>` +
      `<path d="M18 86V36" stroke="#4B5563" stroke-width="2.6"/>` +
      `<path d="M6 36L12 18H24L30 36Z" fill="#DC2626"/>` +
      `<circle cx="18" cy="28" r="5" fill="#FDE047"/>` +
      `<path d="M8 36H28L36 78H0Z" fill="#FEF08A" opacity=".2"/>`
  },
  {
    slot: "poster",
    id: "q_poster_rock",
    nome: "Pôster Turnê Lendária",
    preco: 0,
    mundo: "rock",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#111827" stroke="#EF4444" stroke-width="1.4"/>` +
      `<text x="22" y="16" font-size="5.5" font-weight="900" text-anchor="middle" fill="#F59E0B" font-family="Impact,sans-serif">AO VIVO</text>` +
      `<path d="M16 22L28 34M28 22L16 34" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>` +
      `<text x="22" y="48" font-size="3" text-anchor="middle" fill="#FAF6EE" font-family="sans-serif">ESTÁDIO CHEIO</text>` +
      `<rect x="1" y="0" width="8" height="3" fill="#E5E7EB" transform="rotate(-25 5 1)" opacity=".8"/>` +
      `<rect x="35" y="0" width="8" height="3" fill="#E5E7EB" transform="rotate(25 39 1)" opacity=".8"/>`
  },
  {
    slot: "janela",
    id: "q_janela_rock_estudio",
    nome: "Janela estúdio de gravação",
    preco: 110,
    mundo: "rock",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#0B1320"/>` +
      `<circle cx="30" cy="30" r="14" fill="#3B82F6" opacity=".5"/>` +
      `<circle cx="58" cy="24" r="10" fill="#EF4444" opacity=".5"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#1E293B" stroke-width="5"/>` +
      `<path d="M45 4V70" stroke="#1E293B" stroke-width="3"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#334155"/>`
  },

  /* =========================================================
     3. MUNDO OTAKU
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_otaku",
    nome: "Tatame de palha tradicional",
    preco: 0,
    mundo: "otaku",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#D9CC9C"/>` +
      Array.from(
        { length: Math.ceil(w / 60) },
        (_, k) =>
          `<rect x="${k * 60 + 2}" y="2" width="56" height="${h - 4}" fill="#CFBF8C" stroke="#2E5A36" stroke-width="2.5"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_otaku",
    nome: "Janela shoji com vista para Fuji",
    preco: 0,
    mundo: "otaku",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#F87171"/>` +
      `<circle cx="64" cy="22" r="13" fill="#FEE2E2"/>` +
      `<polygon points="45,26 20,68 70,68" fill="#1E293B"/>` +
      `<polygon points="45,26 35,42 55,42" fill="#FFFFFF"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#78350F" stroke-width="5"/>` +
      `<path d="M45 4V70M4 26H86M4 48H86" stroke="#78350F" stroke-width="2"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#92400E"/>`
  },
  {
    slot: "cama",
    id: "q_cama_otaku",
    nome: "Futon japonês shonen",
    preco: 0,
    mundo: "otaku",
    svg: () =>
      `<rect x="6" y="50" width="130" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>` +
      `<rect x="10" y="40" width="34" height="12" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>` +
      `<path d="M46 44H134V64Q134 68 130 68H46Z" fill="#EF4444"/>` +
      `<circle cx="70" cy="54" r="3" fill="#FEF08A"/><circle cx="95" cy="54" r="3" fill="#FEF08A"/><circle cx="120" cy="54" r="3" fill="#FEF08A"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_otaku",
    nome: "Tapete flor de sakura",
    preco: 0,
    mundo: "otaku",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="72" ry="14" fill="#FCE7F3" stroke="#F472B6" stroke-width="1.5"/>` +
      [40, 62, 85, 108]
        .map(
          x =>
            `<path d="M${x} 17q-5-6 0-10q5 4 0 10zM${x} 17q5-6 10 0q-4 5-10 0zM${x} 17q-5 6 0 10q5-4 0-10z" fill="#EC4899" opacity=".8"/>`
        )
        .join("")
  },
  {
    slot: "luz",
    id: "q_luz_otaku",
    nome: "Lanterna andon de bambu",
    preco: 0,
    mundo: "otaku",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#78350F"/>` +
      `<rect x="11" y="32" width="14" height="54" fill="#FEF3C7" stroke="#78350F" stroke-width="1.8"/>` +
      `<path d="M11 46h14M11 60h14M11 74h14" stroke="#78350F" stroke-width="1.4"/>` +
      `<rect x="9" y="30" width="18" height="4" fill="#92400E"/>`
  },
  {
    slot: "poster",
    id: "q_poster_otaku",
    nome: "Pôster Protagonista Shonen",
    preco: 0,
    mundo: "otaku",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#EA580C" stroke="#FEE2E2" stroke-width="1.2"/>` +
      `<polygon points="22,10 26,24 40,24 28,32 33,46 22,37 11,46 16,32 4,24 18,24" fill="#FEF08A"/>` +
      `<text x="22" y="50" font-size="4" font-weight="bold" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif">FORÇA!</text>` +
      `<rect x="1" y="0" width="8" height="3" fill="#FEF08A" transform="rotate(-25 5 1)" opacity=".8"/>` +
      `<rect x="35" y="0" width="8" height="3" fill="#FEF08A" transform="rotate(25 39 1)" opacity=".8"/>`
  },
  {
    slot: "janela",
    id: "q_janela_otaku_neotokyo",
    nome: "Janela Neo Tóquio neon",
    preco: 125,
    mundo: "otaku",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#0F172A"/>` +
      `<rect x="12" y="30" width="14" height="40" fill="#1E293B"/>` +
      `<rect x="32" y="22" width="18" height="48" fill="#1E293B"/>` +
      `<rect x="56" y="34" width="16" height="36" fill="#1E293B"/>` +
      `<path d="M16 34h6M36 28h10M60 40h8" stroke="#38BDF8" stroke-width="1.8"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#E11D48" stroke-width="4"/>` +
      `<path d="M45 4V70" stroke="#E11D48" stroke-width="2"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#BE123C"/>`
  },
  {
    slot: "cama",
    id: "q_cama_otaku_capsula",
    nome: "Cama cápsula mecha",
    preco: 175,
    mundo: "otaku",
    svg: () =>
      `<rect x="8" y="24" width="126" height="42" rx="10" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>` +
      `<rect x="14" y="32" width="114" height="28" rx="6" fill="#0F172A"/>` +
      `<rect x="20" y="36" width="24" height="12" rx="4" fill="#38BDF8"/>` +
      `<path d="M50 40H122V56H50Z" fill="#F8FAFC"/>` +
      `<circle cx="118" cy="28" r="2.5" fill="#22C55E"/>`
  },

  /* =========================================================
     4. MUNDO FEITICEIRO
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_feiticeiro",
    nome: "Pedra azul da torre estelar",
    preco: 0,
    mundo: "feiticeiro",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#172554"/>` +
      Array.from(
        { length: Math.ceil(h / 16) },
        (_, i) =>
          `<path d="M0 ${i * 16}H${w}" stroke="#1E3A8A" stroke-width="1.2"/>` +
          Array.from(
            { length: Math.ceil(w / 45) },
            (_, k) => `<path d="M${k * 45 + (i % 2) * 22} ${i * 16}v16" stroke="#1E3A8A" stroke-width="1"/>`
          ).join("")
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_feiticeiro",
    nome: "Janela ogival céu astral",
    preco: 0,
    mundo: "feiticeiro",
    svg: () =>
      `<path d="M8 70V28Q8 4 45 4Q82 4 82 28V70Z" fill="#0B1329"/>` +
      [
        [24, 20],
        [66, 16],
        [36, 42],
        [58, 48],
        [45, 26]
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#FDE047"/>`)
        .join("") +
      `<path d="M24 20L45 26L66 16M45 26L36 42L58 48" stroke="#FDE047" stroke-width=".8" stroke-dasharray="2 2"/>` +
      `<path d="M8 70V28Q8 4 45 4Q82 4 82 28V70Z" fill="none" stroke="#CA8A04" stroke-width="4.5"/>` +
      `<path d="M45 4V70M8 44H82" stroke="#CA8A04" stroke-width="2"/>` +
      `<rect x="4" y="68" width="82" height="8" rx="2" fill="#A16207"/>`
  },
  {
    slot: "cama",
    id: "q_cama_feiticeiro",
    nome: "Cama dossel azul e dourado",
    preco: 0,
    mundo: "feiticeiro",
    svg: () =>
      `<path d="M8 2V70M132 2V70" stroke="#CA8A04" stroke-width="3.5"/>` +
      `<path d="M8 4H132" stroke="#CA8A04" stroke-width="3"/>` +
      `<path d="M10 6Q30 24 24 58M130 6Q110 24 116 58" stroke="#1E40AF" stroke-width="5" fill="none" opacity=".85"/>` +
      `<rect x="10" y="40" width="122" height="22" rx="3" fill="#172554"/>` +
      `<rect x="14" y="30" width="32" height="14" rx="5" fill="#FDE047"/>` +
      `<path d="M50 38H132V58Q132 62 128 62H50Z" fill="#1D4ED8"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_feiticeiro",
    nome: "Tapete círculo de runas",
    preco: 0,
    mundo: "feiticeiro",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="72" ry="14" fill="#0F172A" stroke="#CA8A04" stroke-width="2"/>` +
      `<ellipse cx="75" cy="17" rx="54" ry="10" fill="none" stroke="#38BDF8" stroke-width="1.2" stroke-dasharray="3 3"/>` +
      `<circle cx="75" cy="17" r="4.5" fill="#CA8A04"/>`
  },
  {
    slot: "luz",
    id: "q_luz_feiticeiro",
    nome: "Orbe de mana flutuante",
    preco: 0,
    mundo: "feiticeiro",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#1E293B"/>` +
      `<path d="M18 86V54" stroke="#CA8A04" stroke-width="2.2"/>` +
      `<path d="M12 54Q18 60 24 54" stroke="#CA8A04" stroke-width="2.2" fill="none"/>` +
      `<circle class="pisca" cx="18" cy="40" r="10" fill="#38BDF8" opacity=".7"/>` +
      `<circle cx="18" cy="40" r="5" fill="#FFFFFF"/>`
  },
  {
    slot: "poster",
    id: "q_poster_feiticeiro",
    nome: "Mapa celestial dos arcanos",
    preco: 0,
    mundo: "feiticeiro",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#0F172A" stroke="#CA8A04" stroke-width="1.5"/>` +
      `<circle cx="22" cy="24" r="14" fill="none" stroke="#38BDF8" stroke-width="1"/>` +
      `<polygon points="22,12 32,32 12,32" fill="none" stroke="#FDE047" stroke-width="1"/>` +
      `<polygon points="22,36 32,16 12,16" fill="none" stroke="#FDE047" stroke-width="1"/>` +
      `<text x="22" y="49" font-size="3" text-anchor="middle" fill="#CA8A04" font-family="serif">ARCANO</text>`
  },
  {
    slot: "cama",
    id: "q_cama_feiticeiro_astral",
    nome: "Cama grimório astral",
    preco: 185,
    mundo: "feiticeiro",
    svg: () =>
      `<path d="M10 54L30 36H110L130 54H10Z" fill="#1E3A8A" stroke="#CA8A04" stroke-width="2"/>` +
      `<rect x="18" y="38" width="104" height="20" rx="3" fill="#3B82F6"/>` +
      `<rect x="24" y="30" width="28" height="12" rx="4" fill="#FEF08A"/>` +
      `<circle cx="70" cy="48" r="4" fill="#FDE047"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_feiticeiro_mandala",
    nome: "Tapete mandala dourada",
    preco: 95,
    mundo: "feiticeiro",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="72" ry="14" fill="#1E1B4B" stroke="#F59E0B" stroke-width="2"/>` +
      `<path d="M30 17Q75 4 120 17Q75 30 30 17Z" fill="none" stroke="#FDE047" stroke-width="1.4"/>` +
      `<circle cx="75" cy="17" r="5" fill="#F59E0B"/>`
  },
  {
    slot: "movel",
    id: "q_feit_caldeirao_estudos",
    nome: "Caldeirão de estudos",
    preco: 120,
    mundo: "feiticeiro",
    svg: () =>
      `<ellipse cx="22" cy="18" rx="16" ry="6" fill="#334155"/>` +
      `<path d="M6 18Q4 42 22 44Q40 42 38 18Z" fill="#1E293B"/>` +
      `<ellipse cx="22" cy="18" rx="14" ry="4.5" fill="#7C3AED" opacity=".85"/>` +
      `<circle cx="18" cy="16" r="2.2" fill="#C4B5FD"/>` +
      `<path d="M10 42L6 46M34 42L38 46" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>`
  },
  {
    slot: "pelucia",
    id: "q_feit_globo_celeste",
    nome: "Globo celeste",
    preco: 110,
    mundo: "feiticeiro",
    svg: () =>
      `<circle cx="15" cy="13" r="10" fill="#1E1B4B" stroke="#CA8A04" stroke-width="1.2"/>` +
      `<path d="M5 13a10 10 0 0 0 20 0" stroke="#FDE047" stroke-width="1" fill="none"/>` +
      `<path d="M15 23v3M9 26h12" stroke="#CA8A04" stroke-width="1.8" stroke-linecap="round"/>`
  },
  {
    slot: "luz",
    id: "q_feit_vela_flutuante",
    nome: "Vela flutuante",
    preco: 95,
    mundo: "feiticeiro",
    svg: () =>
      `<g class="feit-vela-flutua"><rect x="15" y="14" width="8" height="20" rx="2" fill="#FEF08A" stroke="#EAB308" stroke-width="1"/>` +
      `<path d="M19 14v-4" stroke="#78350F" stroke-width="1.2"/>` +
      `<ellipse cx="19" cy="8" rx="3" ry="5" fill="#F97316"/>` +
      `<ellipse cx="19" cy="9" rx="1.5" ry="3" fill="#FEF08A"/></g>`
  },

  /* =========================================================
     5. MUNDO BRUXO
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_bruxo",
    nome: "Assoalho rústico com musgo",
    preco: 0,
    mundo: "bruxo",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#3F2E21"/>` +
      `<path d="M0 ${h - 12}Q40 ${h - 16} 80 ${h - 10}T160 ${h - 14}T240 ${h - 8}T360 ${h - 12}V${h}H0Z" fill="#2E5A27"/>` +
      Array.from(
        { length: Math.ceil(h / 15) },
        (_, i) => `<path d="M0 ${i * 15}H${w}" stroke="#2B1E14" stroke-width="1.2"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_bruxo",
    nome: "Janela redonda da cabana",
    preco: 0,
    mundo: "bruxo",
    svg: () =>
      `<circle cx="45" cy="40" r="34" fill="#1B2A1E"/>` +
      `<circle cx="34" cy="30" r="10" fill="#A3E635" opacity=".4"/>` +
      `<circle cx="45" cy="40" r="34" fill="none" stroke="#5D4037" stroke-width="5"/>` +
      `<path d="M45 6V74M11 40H79" stroke="#5D4037" stroke-width="3"/>` +
      `<path d="M22 65q10-8 23-4" stroke="#4D7C0F" stroke-width="3" fill="none"/>`
  },
  {
    slot: "cama",
    id: "q_cama_bruxo",
    nome: "Cama de hera e linho musgo",
    preco: 0,
    mundo: "bruxo",
    svg: () =>
      `<rect x="4" y="20" width="10" height="50" rx="3" fill="#4E342E"/>` +
      `<rect x="10" y="40" width="126" height="22" rx="4" fill="#2E402B"/>` +
      `<rect x="14" y="30" width="30" height="14" rx="5" fill="#E2E8F0"/>` +
      `<path d="M48 38H134V58Q134 62 130 62H48Z" fill="#4D7C0F"/>` +
      `<path d="M8 26Q20 34 30 28T50 36" stroke="#65A30D" stroke-width="2.5" fill="none"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#4E342E"/><rect x="126" y="62" width="6" height="8" fill="#4E342E"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_bruxo",
    nome: "Tapete teia da aranha",
    preco: 0,
    mundo: "bruxo",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#1F2937" stroke="#65A30D" stroke-width="1.8"/>` +
      `<path d="M15 17H135M75 4V30M30 8L120 26M30 26L120 8" stroke="#4B5563" stroke-width="1.2"/>` +
      `<circle cx="95" cy="13" r="3" fill="#A855F7"/>`
  },
  {
    slot: "luz",
    id: "q_luz_bruxo",
    nome: "Pote de cogumelos brilhantes",
    preco: 0,
    mundo: "bruxo",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#3E2723"/>` +
      `<rect x="11" y="46" width="14" height="40" rx="3" fill="#166534" opacity=".85" stroke="#3E2723" stroke-width="1.8"/>` +
      `<circle class="pisca" cx="16" cy="58" r="3.5" fill="#84CC16"/>` +
      `<circle class="pisca" style="animation-delay:.5s" cx="20" cy="72" r="3" fill="#C084FC"/>`
  },
  {
    slot: "poster",
    id: "q_poster_bruxo",
    nome: "Herbário de ervas mágicas",
    preco: 0,
    mundo: "bruxo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FEF3C7" stroke="#3E2723" stroke-width="1.4"/>` +
      `<path d="M22 42V14M22 24q-8-6-10 0q6 6 10 0M22 32q8-6 10 0q-6 6-10 0" stroke="#3F6212" stroke-width="2" fill="none"/>` +
      `<text x="22" y="49" font-size="3" text-anchor="middle" fill="#78350F" font-family="serif">BOTÂNICA</text>`
  },
  {
    slot: "cama",
    id: "q_cama_bruxo_tronco",
    nome: "Cama tronco de carvalho oco",
    preco: 170,
    mundo: "bruxo",
    svg: () =>
      `<path d="M6 32Q70 20 134 32V64H6Z" fill="#5D4037" stroke="#3E2723" stroke-width="2"/>` +
      `<rect x="14" y="38" width="112" height="22" rx="4" fill="#365314"/>` +
      `<circle cx="28" cy="34" r="6" fill="#FEF08A"/>`
  },

  /* =========================================================
     6. MUNDO GAMER
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_gamer",
    nome: "Piso cyber grid neon",
    preco: 0,
    mundo: "gamer",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#0A0A12"/>` +
      Array.from(
        { length: Math.ceil(h / 16) },
        (_, i) => `<path d="M0 ${i * 16}H${w}" stroke="#7C3AED" stroke-width="1.4"/>`
      ).join("") +
      Array.from(
        { length: Math.ceil(w / 36) },
        (_, k) => `<path d="M${k * 36} 0L${k * 42 - 30} ${h}" stroke="#7C3AED" stroke-width="1.2"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_gamer",
    nome: "Janela persiana skyline cyberpunk",
    preco: 0,
    mundo: "gamer",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#180B2B"/>` +
      `<rect x="14" y="24" width="16" height="46" fill="#06B6D4"/>` +
      `<rect x="36" y="16" width="20" height="54" fill="#A855F7"/>` +
      `<rect x="62" y="30" width="14" height="40" fill="#EC4899"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#2E1065" stroke-width="5"/>` +
      `<path d="M4 18h82M4 32h82M4 46h82M4 60h82" stroke="#000" stroke-width="1.8" opacity=".6"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#4C1D95"/>`
  },
  {
    slot: "cama",
    id: "q_cama_gamer",
    nome: "Cama setup ergonômica gamer",
    preco: 0,
    mundo: "gamer",
    svg: () =>
      `<rect x="4" y="16" width="12" height="54" rx="2" fill="#18181B"/>` +
      `<rect x="10" y="40" width="126" height="22" rx="3" fill="#27272A"/>` +
      `<rect x="16" y="28" width="30" height="14" rx="4" fill="#3B82F6"/>` +
      `<path d="M48 38H132V58Q132 62 128 62H48Z" fill="#18181B"/>` +
      `<path d="M48 44h84M48 52h84" stroke="#A855F7" stroke-width="2"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#18181B"/><rect x="126" y="62" width="6" height="8" fill="#18181B"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_gamer",
    nome: "Tapete controle retrô D-Pad",
    preco: 0,
    mundo: "gamer",
    svg: () =>
      `<rect x="15" y="4" width="120" height="26" rx="6" fill="#27272A" stroke="#7C3AED" stroke-width="1.6"/>` +
      `<path d="M30 17h16M38 9v16" stroke="#A1A1AA" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="100" cy="17" r="4.5" fill="#EF4444"/><circle cx="114" cy="17" r="4.5" fill="#3B82F6"/>`
  },
  {
    slot: "luz",
    id: "q_luz_gamer",
    nome: "Barra de LED RGB neon",
    preco: 0,
    mundo: "gamer",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#18181B"/>` +
      `<rect x="15" y="18" width="6" height="68" rx="2" fill="#06B6D4"/>` +
      `<path class="pisca" d="M15 18h6v22h-6z" fill="#EC4899"/>` +
      `<path class="pisca" style="animation-delay:.6s" d="M15 40h6v22h-6z" fill="#EAB308"/>`
  },
  {
    slot: "poster",
    id: "q_poster_gamer",
    nome: "Pôster Boss Final 16-Bit",
    preco: 0,
    mundo: "gamer",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#09090B" stroke="#06B6D4" stroke-width="1.4"/>` +
      `<rect x="12" y="14" width="20" height="18" fill="#EF4444"/>` +
      `<rect x="16" y="18" width="4" height="4" fill="#FACC15"/><rect x="24" y="18" width="4" height="4" fill="#FACC15"/>` +
      `<text x="22" y="46" font-size="3.5" font-weight="bold" text-anchor="middle" fill="#22C55E" font-family="monospace">HP 9999</text>`
  },
  {
    slot: "cama",
    id: "q_cama_gamer_rgb",
    nome: "Beliche streamer com tela",
    preco: 180,
    mundo: "gamer",
    svg: () =>
      `<rect x="6" y="6" width="8" height="64" fill="#18181B"/>` +
      `<rect x="128" y="6" width="8" height="64" fill="#18181B"/>` +
      `<rect x="12" y="16" width="118" height="16" fill="#27272A"/>` +
      `<rect x="12" y="46" width="118" height="16" fill="#27272A"/>` +
      `<rect x="40" y="48" width="40" height="12" fill="#06B6D4" opacity=".8"/>`
  },

  /* =========================================================
     7. MUNDO ZEN
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_zen",
    nome: "Assoalho de bambu natural",
    preco: 0,
    mundo: "zen",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#D8C8A3"/>` +
      Array.from(
        { length: Math.ceil(h / 12) },
        (_, i) => `<path d="M0 ${i * 12}H${w}" stroke="#C2B086" stroke-width="1"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_zen",
    nome: "Janela circular ensō",
    preco: 0,
    mundo: "zen",
    svg: () =>
      `<circle cx="45" cy="40" r="32" fill="#F1F5F9"/>` +
      `<path d="M20 54Q45 32 70 54" stroke="#64748B" stroke-width="2" fill="none"/>` +
      `<circle cx="56" cy="26" r="6" fill="#EF4444" opacity=".7"/>` +
      `<circle cx="45" cy="40" r="32" fill="none" stroke="#334155" stroke-width="4"/>` +
      `<path d="M45 8V72M13 40H77" stroke="#334155" stroke-width="1.8"/>`
  },
  {
    slot: "cama",
    id: "q_cama_zen",
    nome: "Futon zen de linho cru",
    preco: 0,
    mundo: "zen",
    svg: () =>
      `<rect x="6" y="52" width="130" height="16" rx="3" fill="#F8FAFC" stroke="#E2E8F0"/>` +
      `<rect x="12" y="42" width="30" height="12" rx="4" fill="#E2E8F0"/>` +
      `<path d="M46 48H132V64H46Z" fill="#65A30D"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_zen",
    nome: "Tapete lago de carpas koi",
    preco: 0,
    mundo: "zen",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5"/>` +
      `<path d="M48 17q8-6 16 0t16 0" stroke="#EA580C" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path d="M84 15q8 6 16 0t16 0" stroke="#0284C7" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  },
  {
    slot: "luz",
    id: "q_luz_zen",
    nome: "Luminária de pedra e vela",
    preco: 0,
    mundo: "zen",
    svg: () =>
      `<rect x="10" y="84" width="16" height="8" rx="2" fill="#64748B"/>` +
      `<rect x="12" y="48" width="12" height="36" rx="2" fill="#94A3B8"/>` +
      `<circle cx="18" cy="42" r="5" fill="#FEF08A"/>` +
      `<polygon points="8,40 18,28 28,40" fill="#475569"/>`
  },
  {
    slot: "poster",
    id: "q_poster_zen",
    nome: "Caligrafia da serenidade",
    preco: 0,
    mundo: "zen",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FDFBF7" stroke="#78716C" stroke-width="1.2"/>` +
      `<circle cx="22" cy="26" r="12" fill="none" stroke="#1C1917" stroke-width="3" stroke-dasharray="60 10"/>` +
      `<text x="22" y="49" font-size="3" text-anchor="middle" fill="#78716C" font-family="serif">PAZ</text>`
  },

  /* =========================================================
     8. MUNDO SERTANEJO
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_sertanejo",
    nome: "Tábua de peroba da fazenda",
    preco: 0,
    mundo: "sertanejo",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#854D0E"/>` +
      Array.from(
        { length: Math.ceil(h / 14) },
        (_, i) => `<path d="M0 ${i * 14}H${w}" stroke="#713F12" stroke-width="1.4"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_sertanejo",
    nome: "Janela com vista para o pasto",
    preco: 0,
    mundo: "sertanejo",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#60A5FA"/>` +
      `<path d="M4 42Q45 32 86 42V70H4Z" fill="#15803D"/>` +
      `<circle cx="68" cy="20" r="8" fill="#FDE047"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#78350F" stroke-width="5"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#78350F" stroke-width="2.5"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#92400E"/>`
  },
  {
    slot: "cama",
    id: "q_cama_sertanejo",
    nome: "Cama rústica de fazenda",
    preco: 0,
    mundo: "sertanejo",
    svg: () =>
      `<rect x="4" y="12" width="12" height="58" rx="2" fill="#78350F"/>` +
      `<rect x="10" y="38" width="126" height="24" rx="3" fill="#A16207"/>` +
      `<rect x="16" y="28" width="30" height="14" rx="4" fill="#FEF3C7"/>` +
      `<path d="M48 38H132V58Q132 62 128 62H48Z" fill="#B45309"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#78350F"/><rect x="126" y="62" width="6" height="8" fill="#78350F"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_sertanejo",
    nome: "Tapete couro de boi malhado",
    preco: 0,
    mundo: "sertanejo",
    svg: () =>
      `<path d="M15 12Q35 4 75 6Q115 4 135 12Q145 24 135 28Q115 32 75 30Q35 32 15 28Q5 24 15 12Z" fill="#FEF3C7" stroke="#78350F" stroke-width="1.5"/>` +
      `<path d="M30 14q10-4 14 6t-10 4zM90 12q14 2 12 10t-14-2z" fill="#78350F"/>`
  },
  {
    slot: "luz",
    id: "q_luz_sertanejo",
    nome: "Lampião a querosene rústico",
    preco: 0,
    mundo: "sertanejo",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#451A03"/>` +
      `<path d="M18 86V42" stroke="#78350F" stroke-width="2"/>` +
      `<path d="M10 58h16v18H10z" fill="#B45309" stroke="#451A03" stroke-width="1.6"/>` +
      `<circle cx="18" cy="67" r="4" fill="#FDE047"/>` +
      `<path d="M12 42h12" stroke="#451A03" stroke-width="2"/>`
  },
  {
    slot: "poster",
    id: "q_poster_sertanejo",
    nome: "Pôster Viola de Dez Cordas",
    preco: 0,
    mundo: "sertanejo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FEF3C7" stroke="#92400E" stroke-width="1.4"/>` +
      `<circle cx="22" cy="34" r="8" fill="#B45309"/><circle cx="22" cy="22" r="5" fill="#B45309"/>` +
      `<rect x="20" y="8" width="4" height="16" fill="#78350F"/>` +
      `<text x="22" y="49" font-size="3" font-weight="bold" text-anchor="middle" fill="#78350F" font-family="serif">MODA DE VIOLA</text>`
  },

  /* =========================================================
     9. MUNDO CLEANBOY
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_cleanboy",
    nome: "Porcelanato acetinado claro",
    preco: 0,
    mundo: "cleanboy",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#F1F5F9"/>` +
      Array.from(
        { length: Math.ceil(w / 40) },
        (_, i) => `<path d="M${i * 40} 0v${h}" stroke="#E2E8F0" stroke-width="1.2"/>`
      ).join("") +
      `<path d="M0 32H${w}" stroke="#E2E8F0" stroke-width="1.2"/>`
  },
  {
    slot: "janela",
    id: "q_janela_cleanboy",
    nome: "Janela ampla com luz difusa",
    preco: 0,
    mundo: "cleanboy",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#E0F2FE"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#94A3B8" stroke-width="3"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#94A3B8" stroke-width="1.5"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#CBD5E1"/>`
  },
  {
    slot: "cama",
    id: "q_cama_cleanboy",
    nome: "Cama plataforma de carvalho claro",
    preco: 0,
    mundo: "cleanboy",
    svg: () =>
      `<rect x="6" y="42" width="128" height="20" rx="3" fill="#E2D9C8"/>` +
      `<rect x="12" y="32" width="32" height="14" rx="4" fill="#FFFFFF" stroke="#E2E8F0"/>` +
      `<path d="M46 38H130V58Q130 62 126 62H46Z" fill="#F8FAFC" stroke="#E2E8F0"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_cleanboy",
    nome: "Tapete orgânico ondulado off-white",
    preco: 0,
    mundo: "cleanboy",
    svg: () =>
      `<path d="M15 14Q45 6 85 8Q125 10 135 18Q120 28 75 26Q30 24 15 14Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>`
  },
  {
    slot: "luz",
    id: "q_luz_cleanboy",
    nome: "Pendente nórdico fosco",
    preco: 0,
    mundo: "cleanboy",
    svg: () =>
      `<path d="M18 10V60" stroke="#64748B" stroke-width="1.5"/>` +
      `<path d="M10 60L18 42L26 60Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5"/>` +
      `<circle cx="18" cy="64" r="3" fill="#FEF08A"/>`
  },
  {
    slot: "poster",
    id: "q_poster_cleanboy",
    nome: "Gravura abstrata minimalista",
    preco: 0,
    mundo: "cleanboy",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>` +
      `<circle cx="22" cy="22" r="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.2"/>` +
      `<path d="M14 36Q22 28 30 36" stroke="#0F172A" stroke-width="1.4" fill="none"/>`
  },

  /* =========================================================
     10. MUNDO PROGRAMADOR
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_programador",
    nome: "Piso industrial anti-estático",
    preco: 0,
    mundo: "programador",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#1E293B"/>` +
      Array.from(
        { length: Math.ceil(h / 16) },
        (_, i) => `<path d="M0 ${i * 16}H${w}" stroke="#0F172A" stroke-width="1.4"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_programador",
    nome: "Janela chuva de código matriz",
    preco: 0,
    mundo: "programador",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#022C22"/>` +
      `<text x="14" y="18" font-size="5" fill="#22C55E" font-family="monospace">0101</text>` +
      `<text x="32" y="28" font-size="5" fill="#4ADE80" font-family="monospace">const</text>` +
      `<text x="54" y="38" font-size="5" fill="#86EFAC" font-family="monospace">&lt;/&gt;</text>` +
      `<text x="20" y="52" font-size="5" fill="#22C55E" font-family="monospace">git</text>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#0F172A" stroke-width="5"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#0F172A" stroke-width="2.5"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#1E293B"/>`
  },
  {
    slot: "cama",
    id: "q_cama_programador",
    nome: "Cama loft com almofada terminal",
    preco: 0,
    mundo: "programador",
    svg: () =>
      `<rect x="4" y="16" width="10" height="54" rx="2" fill="#334155"/>` +
      `<rect x="10" y="40" width="126" height="22" rx="3" fill="#1E293B"/>` +
      `<rect x="14" y="30" width="30" height="14" rx="4" fill="#0F172A"/>` +
      `<text x="29" y="40" font-size="6" text-anchor="middle" fill="#22C55E" font-family="monospace">&gt;_</text>` +
      `<path d="M46 38H132V58Q132 62 128 62H46Z" fill="#0284C7"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#334155"/><rect x="126" y="62" width="6" height="8" fill="#334155"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_programador",
    nome: "Tapete deskmat gigante console",
    preco: 0,
    mundo: "programador",
    svg: () =>
      `<rect x="15" y="4" width="120" height="26" rx="4" fill="#0F172A" stroke="#22C55E" stroke-width="1.6"/>` +
      `<text x="25" y="19" font-size="6" fill="#22C55E" font-family="monospace">$ npm run dev</text>`
  },
  {
    slot: "luz",
    id: "q_luz_programador",
    nome: "Lâmpada monitor lightbar",
    preco: 0,
    mundo: "programador",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#334155"/>` +
      `<path d="M18 86V38" stroke="#64748B" stroke-width="2.5"/>` +
      `<rect x="4" y="34" width="28" height="5" rx="2" fill="#0F172A"/>` +
      `<path d="M6 39L0 76H36L30 39Z" fill="#FEF08A" opacity=".2"/>`
  },
  {
    slot: "poster",
    id: "q_poster_programador",
    nome: "Cheat-sheet Git & Comandos",
    preco: 0,
    mundo: "programador",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#0F172A" stroke="#38BDF8" stroke-width="1.4"/>` +
      `<circle cx="14" cy="18" r="3" fill="#22C55E"/><path d="M14 21v14M14 28h12" stroke="#22C55E" stroke-width="1.6"/>` +
      `<circle cx="26" cy="28" r="3" fill="#EAB308"/>` +
      `<text x="22" y="48" font-size="3" text-anchor="middle" fill="#F8FAFC" font-family="monospace">git push</text>`
  },

  /* =========================================================
     11. MUNDO RAPPER
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_rapper",
    nome: "Parquê de quadra de basquete",
    preco: 0,
    mundo: "rapper",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#D97706"/>` +
      Array.from(
        { length: Math.ceil(h / 14) },
        (_, i) => `<path d="M0 ${i * 14}H${w}" stroke="#B45309" stroke-width="1.2"/>`
      ).join("") +
      `<ellipse cx="180" cy="${h}" rx="60" ry="24" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity=".6"/>`
  },
  {
    slot: "janela",
    id: "q_janela_rapper",
    nome: "Janela tijolos à vista e escada",
    preco: 0,
    mundo: "rapper",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#1E293B"/>` +
      `<path d="M14 10l8 12-8 12 8 12-8 12" stroke="#64748B" stroke-width="2" fill="none"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#B45309" stroke-width="4"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#B45309" stroke-width="2"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#78350F"/>`
  },
  {
    slot: "cama",
    id: "q_cama_rapper",
    nome: "Cama king grafite com colcha street",
    preco: 0,
    mundo: "rapper",
    svg: () =>
      `<rect x="4" y="16" width="10" height="54" rx="2" fill="#18181B"/>` +
      `<rect x="10" y="38" width="126" height="24" rx="3" fill="#27272A"/>` +
      `<rect x="16" y="28" width="30" height="14" rx="4" fill="#EAB308"/>` +
      `<path d="M48 38H132V58Q132 62 128 62H48Z" fill="#DC2626"/>` +
      `<text x="90" y="52" font-size="7" font-weight="bold" fill="#FACC15" font-family="Impact">FLOW</text>` +
      `<rect x="12" y="62" width="6" height="8" fill="#18181B"/><rect x="126" y="62" width="6" height="8" fill="#18181B"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_rapper",
    nome: "Tapete vinil de rima",
    preco: 0,
    mundo: "rapper",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#09090B" stroke="#27272A" stroke-width="1.5"/>` +
      `<ellipse cx="75" cy="17" rx="45" ry="9" fill="none" stroke="#3F3F46" stroke-width="1"/>` +
      `<ellipse cx="75" cy="17" rx="20" ry="4" fill="#EF4444"/>`
  },
  {
    slot: "luz",
    id: "q_luz_rapper",
    nome: "Letreiro neon ON AIR",
    preco: 0,
    mundo: "rapper",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#18181B"/>` +
      `<path d="M18 86V46" stroke="#3F3F46" stroke-width="2"/>` +
      `<rect x="2" y="28" width="32" height="18" rx="3" fill="#991B1B" stroke="#EF4444" stroke-width="1.6"/>` +
      `<text x="18" y="40" font-size="5" font-weight="bold" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif">ON AIR</text>`
  },
  {
    slot: "poster",
    id: "q_poster_rapper",
    nome: "Pôster Microfone Dourado",
    preco: 0,
    mundo: "rapper",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#09090B" stroke="#EAB308" stroke-width="1.5"/>` +
      `<circle cx="22" cy="22" r="7" fill="#FACC15"/><rect x="20" y="29" width="4" height="12" fill="#A1A1AA"/>` +
      `<text x="22" y="49" font-size="3" font-weight="bold" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif">HIP HOP</text>`
  },

  /* =========================================================
     12. MUNDO TRAPPER
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_trapper",
    nome: "Mármore preto polido com ouro",
    preco: 0,
    mundo: "trapper",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#09090B"/>` +
      `<path d="M0 16Q60 22 140 10T300 20T360 8" stroke="#EAB308" stroke-width="1" opacity=".7"/>` +
      `<path d="M40 ${h}Q120 40 220 50T360 38" stroke="#C084FC" stroke-width="1" opacity=".6"/>`
  },
  {
    slot: "janela",
    id: "q_janela_trapper",
    nome: "Janela panorâmica da cobertura",
    preco: 0,
    mundo: "trapper",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#1E1035"/>` +
      `<rect x="18" y="24" width="18" height="46" fill="#3B0764"/>` +
      `<rect x="44" y="16" width="24" height="54" fill="#581C87"/>` +
      `<circle cx="68" cy="24" r="3" fill="#EAB308"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#A855F7" stroke-width="3"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#7E22CE"/>`
  },
  {
    slot: "cama",
    id: "q_cama_trapper",
    nome: "Cama king veludo roxo com manta",
    preco: 0,
    mundo: "trapper",
    svg: () =>
      `<rect x="4" y="14" width="10" height="56" rx="2" fill="#09090B"/>` +
      `<rect x="10" y="38" width="126" height="24" rx="3" fill="#3B0764" stroke="#A855F7"/>` +
      `<rect x="16" y="26" width="32" height="14" rx="4" fill="#C084FC"/>` +
      `<path d="M50 38H132V58Q132 62 128 62H50Z" fill="#581C87"/>` +
      `<circle cx="90" cy="48" r="4" fill="#FACC15"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#09090B"/><rect x="126" y="62" width="6" height="8" fill="#09090B"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_trapper",
    nome: "Tapete notas de cem",
    preco: 0,
    mundo: "trapper",
    svg: () =>
      `<rect x="15" y="4" width="120" height="26" rx="3" fill="#064E3B" stroke="#34D399" stroke-width="1.8"/>` +
      `<circle cx="75" cy="17" r="6" fill="#047857"/>` +
      `<text x="75" y="20" font-size="7" font-weight="bold" text-anchor="middle" fill="#A7F3D0" font-family="sans-serif">$ 100</text>`
  },
  {
    slot: "luz",
    id: "q_luz_trapper",
    nome: "Corrente neon suspensa",
    preco: 0,
    mundo: "trapper",
    svg: () =>
      `<path d="M18 10V50" stroke="#FACC15" stroke-width="3" stroke-dasharray="4 2"/>` +
      `<circle class="pisca" cx="18" cy="60" r="10" fill="#C084FC" opacity=".8"/>` +
      `<circle cx="18" cy="60" r="4" fill="#FFFFFF"/>`
  },
  {
    slot: "poster",
    id: "q_poster_trapper",
    nome: "Pôster Trap Drip & Grillz",
    preco: 0,
    mundo: "trapper",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#180B2B" stroke="#C084FC" stroke-width="1.5"/>` +
      `<polygon points="22,14 28,24 16,24" fill="#38BDF8"/>` +
      `<polygon points="22,34 28,24 16,24" fill="#0284C7"/>` +
      `<text x="22" y="48" font-size="4" font-weight="bold" text-anchor="middle" fill="#FACC15" font-family="sans-serif">ICE DRIP</text>`
  },

  /* =========================================================
     13. MUNDO PAGODEIRO
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_pagodeiro",
    nome: "Deck de madeira de churrasco",
    preco: 0,
    mundo: "pagodeiro",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#9A3412"/>` +
      Array.from(
        { length: Math.ceil(h / 14) },
        (_, i) => `<path d="M0 ${i * 14}H${w}" stroke="#7C2D12" stroke-width="1.4"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_pagodeiro",
    nome: "Janela aberta pra tarde de sol",
    preco: 0,
    mundo: "pagodeiro",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#FDE047"/>` +
      `<circle cx="68" cy="20" r="12" fill="#F97316"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#7C2D12" stroke-width="4"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#7C2D12" stroke-width="2"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#9A3412"/>`
  },
  {
    slot: "cama",
    id: "q_cama_pagodeiro",
    nome: "Cama colcha do samba listrada",
    preco: 0,
    mundo: "pagodeiro",
    svg: () =>
      `<rect x="4" y="14" width="10" height="56" rx="2" fill="#7C2D12"/>` +
      `<rect x="10" y="38" width="126" height="24" rx="3" fill="#EA580C"/>` +
      `<rect x="14" y="28" width="30" height="14" rx="4" fill="#FFFFFF"/>` +
      `<path d="M48 38H132V58Q132 62 128 62H48Z" fill="#FACC15"/>` +
      `<path d="M60 38v24M80 38v24M100 38v24M120 38v24" stroke="#DC2626" stroke-width="3"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#7C2D12"/><rect x="126" y="62" width="6" height="8" fill="#7C2D12"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_pagodeiro",
    nome: "Tapete redondo de pandeiro",
    preco: 0,
    mundo: "pagodeiro",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="60" ry="14" fill="#FEF3C7" stroke="#9A3412" stroke-width="2.5"/>` +
      [30, 50, 75, 100, 120]
        .map(x => `<circle cx="${x}" cy="${x === 75 ? 5 : 8}" r="2.5" fill="#CA8A04"/>`)
        .join("")
  },
  {
    slot: "luz",
    id: "q_luz_pagodeiro",
    nome: "Varal de lâmpadas amarelas",
    preco: 0,
    mundo: "pagodeiro",
    svg: () =>
      `<path d="M0 30Q18 42 36 30" stroke="#78350F" stroke-width="1.5" fill="none"/>` +
      `<circle class="pisca" cx="10" cy="38" r="4" fill="#FDE047"/>` +
      `<circle class="pisca" style="animation-delay:.4s" cx="26" cy="38" r="4" fill="#F59E0B"/>`
  },
  {
    slot: "poster",
    id: "q_poster_pagodeiro",
    nome: "Pôster Roda de Samba & Cavaquinho",
    preco: 0,
    mundo: "pagodeiro",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FEF3C7" stroke="#EA580C" stroke-width="1.4"/>` +
      `<circle cx="22" cy="24" r="8" fill="#F97316"/><rect x="20" y="10" width="4" height="14" fill="#7C2D12"/>` +
      `<text x="22" y="48" font-size="3" font-weight="bold" text-anchor="middle" fill="#9A3412" font-family="sans-serif">RESENHA</text>`
  },

  /* =========================================================
     14. MUNDO FUNKEIRO
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_funkeiro",
    nome: "Piso espelhado reflexivo da pista",
    preco: 0,
    mundo: "funkeiro",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#18181B"/>` +
      Array.from(
        { length: Math.ceil(w / 30) },
        (_, i) =>
          `<rect x="${i * 30}" y="0" width="30" height="${h}" fill="${i % 2 === 0 ? "#27272A" : "#18181B"}"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_funkeiro",
    nome: "Janela vista pro baile iluminado",
    preco: 0,
    mundo: "funkeiro",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#0B0B14"/>` +
      `<circle cx="30" cy="34" r="6" fill="#F43F5E"/>` +
      `<circle cx="50" cy="28" r="8" fill="#06B6D4"/>` +
      `<circle cx="68" cy="38" r="5" fill="#A855F7"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#3F3F46" stroke-width="4"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#3F3F46" stroke-width="2"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#52525B"/>`
  },
  {
    slot: "cama",
    id: "q_cama_funkeiro",
    nome: "Cama mandrake tie-dye estilosa",
    preco: 0,
    mundo: "funkeiro",
    svg: () =>
      `<rect x="4" y="16" width="10" height="54" rx="2" fill="#18181B"/>` +
      `<rect x="10" y="38" width="126" height="24" rx="3" fill="#27272A"/>` +
      `<rect x="14" y="28" width="30" height="14" rx="4" fill="#06B6D4"/>` +
      `<path d="M48 38H132V58Q132 62 128 62H48Z" fill="#F43F5E"/>` +
      `<circle cx="85" cy="48" r="4" fill="#FACC15"/>` +
      `<rect x="12" y="62" width="6" height="8" fill="#18181B"/><rect x="126" y="62" width="6" height="8" fill="#18181B"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_funkeiro",
    nome: "Tapete lupa e cifrão reluzente",
    preco: 0,
    mundo: "funkeiro",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#09090B" stroke="#FACC15" stroke-width="1.8"/>` +
      `<text x="75" y="22" font-size="12" font-weight="900" text-anchor="middle" fill="#FACC15" font-family="sans-serif">$</text>`
  },
  {
    slot: "luz",
    id: "q_luz_funkeiro",
    nome: "Globo espelhado de luzes",
    preco: 0,
    mundo: "funkeiro",
    svg: () =>
      `<path d="M18 4V34" stroke="#71717A" stroke-width="1.6"/>` +
      `<circle class="pisca" cx="18" cy="42" r="10" fill="#E4E4E7" stroke="#71717A" stroke-width="1.2"/>` +
      `<path d="M8 42h20M18 32v20" stroke="#71717A" stroke-width=".8"/>`
  },
  {
    slot: "poster",
    id: "q_poster_funkeiro",
    nome: "Pôster Passinho dos Crias",
    preco: 0,
    mundo: "funkeiro",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#09090B" stroke="#F43F5E" stroke-width="1.4"/>` +
      `<text x="22" y="22" font-size="7" font-weight="900" text-anchor="middle" fill="#06B6D4" font-family="Impact">BAILE</text>` +
      `<text x="22" y="36" font-size="7" font-weight="900" text-anchor="middle" fill="#FACC15" font-family="Impact">FUNK</text>`
  },

  /* =========================================================
     15. MUNDO FORROZEIRO
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_forrozeiro",
    nome: "Tijolete de barro encerado",
    preco: 0,
    mundo: "forrozeiro",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#9A3412"/>` +
      Array.from(
        { length: Math.ceil(h / 16) },
        (_, i) =>
          `<path d="M0 ${i * 16}H${w}" stroke="#7C2D12" stroke-width="1.2"/>` +
          Array.from(
            { length: Math.ceil(w / 35) },
            (_, k) => `<path d="M${k * 35 + (i % 2) * 17} ${i * 16}v16" stroke="#7C2D12" stroke-width="1"/>`
          ).join("")
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_forrozeiro",
    nome: "Janela pro mandacaru ao pôr do sol",
    preco: 0,
    mundo: "forrozeiro",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#F97316"/>` +
      `<circle cx="45" cy="28" r="16" fill="#FDE047"/>` +
      `<path d="M60 40v30M56 50h8" stroke="#15803D" stroke-width="4" stroke-linecap="round"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#78350F" stroke-width="5"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#78350F" stroke-width="2.5"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#92400E"/>`
  },
  {
    slot: "cama",
    id: "q_cama_forrozeiro",
    nome: "Cama colcha de fuxico colorido",
    preco: 0,
    mundo: "forrozeiro",
    svg: () =>
      `<rect x="4" y="14" width="10" height="56" rx="2" fill="#78350F"/>` +
      `<rect x="10" y="38" width="126" height="24" rx="3" fill="#B45309"/>` +
      `<rect x="14" y="28" width="30" height="14" rx="4" fill="#FEF3C7"/>` +
      `<path d="M48 38H132V58Q132 62 128 62H48Z" fill="#DC2626"/>` +
      [58, 76, 94, 112].map(x => `<circle cx="${x}" cy="48" r="3.5" fill="#FACC15"/>`).join("") +
      `<rect x="12" y="62" width="6" height="8" fill="#78350F"/><rect x="126" y="62" width="6" height="8" fill="#78350F"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_forrozeiro",
    nome: "Tapete de chita florida",
    preco: 0,
    mundo: "forrozeiro",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="70" ry="14" fill="#EF4444" stroke="#FACC15" stroke-width="2"/>` +
      [35, 60, 90, 115]
        .map(
          x =>
            `<circle cx="${x}" cy="17" r="4" fill="#FACC15"/><circle cx="${x}" cy="17" r="1.8" fill="#047857"/>`
        )
        .join("")
  },
  {
    slot: "luz",
    id: "q_luz_forrozeiro",
    nome: "Candeeiro de barro com pavio",
    preco: 0,
    mundo: "forrozeiro",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#7C2D12"/>` +
      `<ellipse cx="18" cy="74" rx="8" ry="12" fill="#B45309" stroke="#7C2D12" stroke-width="1.5"/>` +
      `<path class="chama" d="M18 56q2 3 0 6q-2-3 0-6z" fill="#FDE047"/>`
  },
  {
    slot: "poster",
    id: "q_poster_forrozeiro",
    nome: "Xilogravura Casal no Forró",
    preco: 0,
    mundo: "forrozeiro",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FEF3C7" stroke="#18181B" stroke-width="2"/>` +
      `<circle cx="18" cy="20" r="5" fill="#18181B"/><circle cx="26" cy="22" r="4.5" fill="#18181B"/>` +
      `<path d="M14 26l8 14-4 8M28 28l-4 12 4 8" stroke="#18181B" stroke-width="2.5" fill="none"/>` +
      `<text x="22" y="49" font-size="3" font-weight="bold" text-anchor="middle" fill="#18181B" font-family="serif">CORDEL</text>`
  },

  /* =========================================================
     16. MUNDO VOVÓ
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_vovo",
    nome: "Tacos de madeira encerados da vovó",
    preco: 0,
    mundo: "vovo",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#D97706"/>` +
      Array.from(
        { length: Math.ceil(h / 14) },
        (_, i) =>
          `<path d="M0 ${i * 14}H${w}" stroke="#B45309" stroke-width="1.2"/>` +
          Array.from(
            { length: Math.ceil(w / 40) },
            (_, k) => `<path d="M${k * 40 + (i % 2) * 20} ${i * 14}v14" stroke="#B45309" stroke-width="1"/>`
          ).join("")
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_vovo",
    nome: "Janela com samambaia e cortina",
    preco: 0,
    mundo: "vovo",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#BAE6FD"/>` +
      `<path d="M4 4Q20 28 8 70M86 4Q70 28 82 70" stroke="#FFFFFF" stroke-width="6" fill="none"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#78350F" stroke-width="4"/>` +
      `<path d="M45 4V70M4 37H86" stroke="#78350F" stroke-width="2"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#92400E"/>`
  },
  {
    slot: "cama",
    id: "q_cama_vovo",
    nome: "Cama de ferro e manta de retalhos",
    preco: 0,
    mundo: "vovo",
    svg: () =>
      `<path d="M6 14V68M134 26V68" stroke="#78350F" stroke-width="3"/>` +
      `<rect x="10" y="40" width="124" height="22" rx="4" fill="#FFFFFF"/>` +
      `<rect x="14" y="30" width="30" height="14" rx="5" fill="#FCE7F3"/>` +
      `<path d="M46 38H130V58Q130 62 126 62H46Z" fill="#F472B6"/>` +
      [58, 80, 102, 124].map(x => `<rect x="${x}" y="42" width="10" height="10" fill="#FBBF24"/>`).join("")
  },
  {
    slot: "tapete",
    id: "q_tapete_vovo",
    nome: "Tapete redondo de crochê",
    preco: 0,
    mundo: "vovo",
    svg: () =>
      `<ellipse cx="75" cy="17" rx="60" ry="14" fill="#FCE7F3" stroke="#EC4899" stroke-width="2" stroke-dasharray="3 2"/>` +
      `<ellipse cx="75" cy="17" rx="40" ry="9" fill="#FDF2F8" stroke="#F472B6" stroke-width="1.5" stroke-dasharray="2 2"/>`
  },
  {
    slot: "luz",
    id: "q_luz_vovo",
    nome: "Abajur floral com cúpula de renda",
    preco: 0,
    mundo: "vovo",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#92400E"/>` +
      `<path d="M18 86V54" stroke="#78350F" stroke-width="2.5"/>` +
      `<path d="M6 54L12 36H24L30 54Z" fill="#FCE7F3" stroke="#F472B6" stroke-width="1.4"/>` +
      `<circle cx="18" cy="46" r="2.5" fill="#EC4899"/>`
  },
  {
    slot: "poster",
    id: "q_poster_vovo",
    nome: "Bordado Ponto Cruz Lar Doce Lar",
    preco: 0,
    mundo: "vovo",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#FEF3C7" stroke="#78350F" stroke-width="1.6"/>` +
      `<path d="M12 24L22 14L32 24V38H12Z" fill="none" stroke="#DC2626" stroke-width="1.8"/>` +
      `<text x="22" y="47" font-size="3" font-weight="bold" text-anchor="middle" fill="#78350F" font-family="serif">DOCE LAR</text>`
  },

  /* =========================================================
     17. MUNDO COACH
     ========================================================= */
  {
    slot: "chao",
    id: "q_chao_coach",
    nome: "Piso emborrachado preto de treino",
    preco: 0,
    mundo: "coach",
    svg: (w = 360, h = 64) =>
      `<rect width="${w}" height="${h}" fill="#18181B"/>` +
      Array.from(
        { length: Math.ceil(w / 30) },
        (_, i) =>
          `<rect x="${i * 30 + 1}" y="1" width="28" height="${h - 2}" fill="#27272A" stroke="#3F3F46" stroke-width="1"/>`
      ).join("")
  },
  {
    slot: "janela",
    id: "q_janela_coach",
    nome: "Janela nascer do sol 5AM no topo",
    preco: 0,
    mundo: "coach",
    svg: () =>
      `<rect x="4" y="4" width="82" height="66" fill="#F59E0B"/>` +
      `<polygon points="45,24 20,68 70,68" fill="#18181B"/>` +
      `<circle cx="45" cy="18" r="8" fill="#FEF08A"/>` +
      `<rect x="4" y="4" width="82" height="66" fill="none" stroke="#27272A" stroke-width="4"/>` +
      `<rect x="0" y="68" width="90" height="8" rx="2" fill="#3F3F46"/>`
  },
  {
    slot: "cama",
    id: "q_cama_coach",
    nome: "Cama ergonômica de recuperação",
    preco: 0,
    mundo: "coach",
    svg: () =>
      `<rect x="6" y="40" width="128" height="22" rx="4" fill="#27272A" stroke="#3F3F46"/>` +
      `<rect x="12" y="30" width="30" height="12" rx="4" fill="#3B82F6"/>` +
      `<path d="M46 36H130V56Q130 60 126 60H46Z" fill="#18181B"/>` +
      `<path d="M46 44h84" stroke="#10B981" stroke-width="2"/>`
  },
  {
    slot: "tapete",
    id: "q_tapete_coach",
    nome: "Tapete raia de corrida Start Now",
    preco: 0,
    mundo: "coach",
    svg: () =>
      `<rect x="15" y="4" width="120" height="26" rx="4" fill="#B91C1C" stroke="#EF4444" stroke-width="1.5"/>` +
      `<path d="M15 17h120" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 4"/>` +
      `<text x="75" y="22" font-size="6" font-weight="bold" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif">START</text>`
  },
  {
    slot: "luz",
    id: "q_luz_coach",
    nome: "Simulador de amanhecer neon 5AM",
    preco: 0,
    mundo: "coach",
    svg: () =>
      `<rect x="10" y="86" width="16" height="6" fill="#27272A"/>` +
      `<path d="M18 86V42" stroke="#3F3F46" stroke-width="2"/>` +
      `<circle class="pisca" cx="18" cy="34" r="12" fill="#F59E0B" opacity=".85"/>` +
      `<circle cx="18" cy="34" r="6" fill="#FEF08A"/>`
  },
  {
    slot: "poster",
    id: "q_poster_coach",
    nome: "Quadro Mindset de Alta Performance",
    preco: 0,
    mundo: "coach",
    svg: () =>
      `<rect x="2" y="2" width="40" height="52" fill="#18181B" stroke="#10B981" stroke-width="1.5"/>` +
      `<path d="M8 42L18 30L26 36L34 16" stroke="#10B981" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
      `<text x="22" y="49" font-size="3.5" font-weight="bold" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif">1% TODO DIA</text>`
  }
];

/* Registra os itens de quarto no catálogo global QUARTO e ITEM_QUARTO */
if (typeof QUARTO !== "undefined") {
  QUARTO.push(...QUARTO_MUNDOS_NOVOS);
  if (typeof ITEM_QUARTO !== "undefined") {
    QUARTO_MUNDOS_NOVOS.forEach(i => {
      ITEM_QUARTO[i.id] = i;
    });
  }
}

/* Configura o quarto inicial padrão de cada um dos 17 mundos */
if (typeof QUARTO_PADRAO_MUNDO !== "undefined") {
  Object.assign(QUARTO_PADRAO_MUNDO, {
    emo: {
      chao: "q_chao_emo",
      janela: "q_janela_emo",
      cama: "q_cama_emo",
      tapete: "q_tapete_emo",
      luz: "q_luz_emo",
      poster: "q_poster_emo_morcego"
    },
    rock: {
      chao: "q_chao_rock",
      janela: "q_janela_rock_garagem",
      cama: "q_cama_rock",
      tapete: "q_tapete_rock",
      luz: "q_luz_rock",
      poster: "q_poster_rock"
    },
    otaku: {
      chao: "q_chao_otaku",
      janela: "q_janela_otaku",
      cama: "q_cama_otaku",
      tapete: "q_tapete_otaku",
      luz: "q_luz_otaku",
      poster: "q_poster_otaku"
    },
    feiticeiro: {
      chao: "q_chao_feiticeiro",
      janela: "q_janela_feiticeiro",
      cama: "q_cama_feiticeiro",
      tapete: "q_tapete_feiticeiro",
      luz: "q_luz_feiticeiro",
      poster: "q_poster_feiticeiro"
    },
    bruxo: {
      chao: "q_chao_bruxo",
      janela: "q_janela_bruxo",
      cama: "q_cama_bruxo",
      tapete: "q_tapete_bruxo",
      luz: "q_luz_bruxo",
      poster: "q_poster_bruxo"
    },
    gamer: {
      chao: "q_chao_gamer",
      janela: "q_janela_gamer",
      cama: "q_cama_gamer",
      tapete: "q_tapete_gamer",
      luz: "q_luz_gamer",
      poster: "q_poster_gamer"
    },
    zen: {
      chao: "q_chao_zen",
      janela: "q_janela_zen",
      cama: "q_cama_zen",
      tapete: "q_tapete_zen",
      luz: "q_luz_zen",
      poster: "q_poster_zen"
    },
    sertanejo: {
      chao: "q_chao_sertanejo",
      janela: "q_janela_sertanejo",
      cama: "q_cama_sertanejo",
      tapete: "q_tapete_sertanejo",
      luz: "q_luz_sertanejo",
      poster: "q_poster_sertanejo"
    },
    cleanboy: {
      chao: "q_chao_cleanboy",
      janela: "q_janela_cleanboy",
      cama: "q_cama_cleanboy",
      tapete: "q_tapete_cleanboy",
      luz: "q_luz_cleanboy",
      poster: "q_poster_cleanboy"
    },
    programador: {
      chao: "q_chao_programador",
      janela: "q_janela_programador",
      cama: "q_cama_programador",
      tapete: "q_tapete_programador",
      luz: "q_luz_programador",
      poster: "q_poster_programador"
    },
    rapper: {
      chao: "q_chao_rapper",
      janela: "q_janela_rapper",
      cama: "q_cama_rapper",
      tapete: "q_tapete_rapper",
      luz: "q_luz_rapper",
      poster: "q_poster_rapper"
    },
    trapper: {
      chao: "q_chao_trapper",
      janela: "q_janela_trapper",
      cama: "q_cama_trapper",
      tapete: "q_tapete_trapper",
      luz: "q_luz_trapper",
      poster: "q_poster_trapper"
    },
    pagodeiro: {
      chao: "q_chao_pagodeiro",
      janela: "q_janela_pagodeiro",
      cama: "q_cama_pagodeiro",
      tapete: "q_tapete_pagodeiro",
      luz: "q_luz_pagodeiro",
      poster: "q_poster_pagodeiro"
    },
    funkeiro: {
      chao: "q_chao_funkeiro",
      janela: "q_janela_funkeiro",
      cama: "q_cama_funkeiro",
      tapete: "q_tapete_funkeiro",
      luz: "q_luz_funkeiro",
      poster: "q_poster_funkeiro"
    },
    forrozeiro: {
      chao: "q_chao_forrozeiro",
      janela: "q_janela_forrozeiro",
      cama: "q_cama_forrozeiro",
      tapete: "q_tapete_forrozeiro",
      luz: "q_luz_forrozeiro",
      poster: "q_poster_forrozeiro"
    },
    vovo: {
      chao: "q_chao_vovo",
      janela: "q_janela_vovo",
      cama: "q_cama_vovo",
      tapete: "q_tapete_vovo",
      luz: "q_luz_vovo",
      poster: "q_poster_vovo"
    },
    coach: {
      chao: "q_chao_coach",
      janela: "q_janela_coach",
      cama: "q_cama_coach",
      tapete: "q_tapete_coach",
      luz: "q_luz_coach",
      poster: "q_poster_coach"
    }
  });
}
