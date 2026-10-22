/*
  Mundo Emo: guarda-roupa extra (cabeça, cabelo, maquiagem, roupas, colares, mãos,
  companheiros, fios, cenários e pele). Carregado logo depois de js/mundos/emo.js.
  Regra: nada de nome, logo ou letra de banda real. Os nomes nos pôsteres e placas são inventados.
  Lembrete das medidas: área 120 x 154, olhos em (47,64) e (73,64), boca perto de y=78, pescoço em y≈84.
*/
"use strict";

/* ---------- pedacinhos reaproveitados neste arquivo ---------- */
// Ponto numa curva quadrática (para enfeitar faixas e colares)
const pontoQ = (a, c, b, t) => [
  (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]
];
// Estrelinha de 4 pontas (brilho)
const brilhinho = (x, y, r = 3, cor = "#fff", atraso = 0) =>
  `<path class="brilhinho" style="animation-delay:${atraso}s" d="M${x} ${y - r}Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y}Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r}Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y}Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r}Z" fill="${cor}"/>`;
// Alfinete de segurança
const alfinete = (x, y, giro = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${giro})"><path d="M-6 0H5M-6 0Q-8.4 -1.3 -6 -2.6H4" fill="none" stroke="#D9DDE3" stroke-width="1.3" stroke-linecap="round"/><circle cx="5.4" cy="-1.3" r="1.7" fill="#D9DDE3" stroke="#141416" stroke-width=".5"/></g>`;
// Fita K7 pequena (usada na mão e no fio)
const fitaK7 = (cor = "#141416", rotulo = "#F2EAD3") =>
  `<rect x="-11" y="-7" width="22" height="14" rx="1.6" fill="${cor}" ${O} stroke-width="1.4"/><rect x="-9" y="-5.6" width="18" height="6.6" rx="1" fill="${rotulo}"/><path d="M-7.5 -3.4H4M-7.5 -1.4H1" stroke="#C8102E" stroke-width=".7"/><circle cx="-4.5" cy="3.6" r="2.2" fill="#F2F2F2"/><circle cx="4.5" cy="3.6" r="2.2" fill="#F2F2F2"/><circle cx="-4.5" cy="3.6" r=".8" fill="${cor}"/><circle cx="4.5" cy="3.6" r=".8" fill="${cor}"/>`;
// Pôster de banda inventada
const poster = (x, y, giro, fundo, cor, l1, l2, desenho = "") =>
  `<g transform="translate(${x} ${y}) rotate(${giro})"><rect x="-13" y="-17" width="26" height="34" fill="${fundo}" stroke="#141416" stroke-width=".8"/><text y="-7" font-size="4.6" font-weight="800" text-anchor="middle" fill="${cor}" font-family="Bungee,Impact,sans-serif">${l1}</text><text y="-2" font-size="4.6" font-weight="800" text-anchor="middle" fill="${cor}" font-family="Bungee,Impact,sans-serif">${l2}</text>${desenho}<circle cx="-11" cy="-15" r=".9" fill="#C9CED6"/><circle cx="11" cy="-15" r=".9" fill="#C9CED6"/></g>`;

ITEMS.push(
  /* ===================== cabeça ===================== */
  {
    id: "emo_fedora",
    p: "emo",
    slot: "hat",
    name: "Fedora preta",
    price: 110,
    svg: () =>
      `<path d="M33 40Q31 15 46 12Q53 17 60 15Q67 17 74 12Q89 15 87 40Z" fill="#17171C" ${O}/><path d="M50 15Q60 22 70 15" fill="none" stroke="#33333B" stroke-width="2"/><path d="M33.5 33Q60 28 86.5 33L87 39.5Q60 34 33 39.5Z" fill="#C8102E"/><path d="M10 43Q60 29 110 43Q108 50 96 47Q60 37 24 47Q12 50 10 43Z" fill="#17171C" ${O}/>`
  },
  {
    id: "emo_veu",
    p: "emo",
    slot: "hat",
    name: "Véu gótico de renda",
    price: 150,
    svg: () => {
      // pontinhos da renda, só dentro do véu
      let renda = "";
      for (let x = 26; x <= 94; x += 5)
        for (let y = 42; y <= 80; y += 5) {
          const k = 1 - ((x - 60) / 39) ** 2;
          if (y > 46 - 6 * k + 2 && y < 72 + 6 * k - 2)
            renda += `<circle cx="${x + (y % 10 ? 2.5 : 0)}" cy="${y}" r=".75" fill="#141016" opacity=".6"/>`;
        }
      let barra = "";
      for (let i = 0; i <= 12; i++) {
        const [x, y] = pontoQ([20, 72], [60, 84], [100, 72], i / 12);
        barra += `<circle cx="${x.toFixed(1)}" cy="${(y + 1).toFixed(1)}" r="2.6" fill="none" stroke="#141016" stroke-width=".9" opacity=".8"/>`;
      }
      return `<path d="M22 46Q60 34 98 46L100 72Q60 84 20 72Z" fill="#141016" fill-opacity=".24" stroke="#141016" stroke-opacity=".5" stroke-width="1"/>${renda}${barra}<path d="M22 46Q60 34 98 46" fill="none" stroke="#141016" stroke-width="5" stroke-linecap="round"/>${rose(30, 42, 5)}${rose(40, 39, 3.4, "#6E0E20")}`;
    }
  },
  {
    id: "emo_faixa_cabeca",
    p: "emo",
    slot: "hat",
    name: "Faixa de cabeça",
    price: 60,
    svg: () => {
      const estrelas = [0.18, 0.38, 0.62, 0.82]
        .map(t => {
          const [x, y] = pontoQ([23, 50], [60, 28], [97, 50], t);
          return `<path transform="translate(${x.toFixed(1)} ${(y - 0.5).toFixed(1)}) scale(.5)" d="M0 -5L1.5 -1.5L5 -1.2L2.3 1.2L3 5L0 3L-3 5L-2.3 1.2L-5 -1.2L-1.5 -1.5Z" fill="#fff"/>`;
        })
        .join("");
      return `<path d="M23 50Q60 28 97 50" fill="none" stroke="var(--ink)" stroke-width="10.4" stroke-linecap="round"/><path d="M23 50Q60 28 97 50" fill="none" stroke="#C8102E" stroke-width="8" stroke-linecap="round"/>${estrelas}`;
    }
  },
  {
    id: "emo_bone_tras",
    p: "emo",
    slot: "hat",
    name: "Boné virado pra trás",
    price: 90,
    svg: () =>
      `<path d="M30 40H6Q2 46 12 48H32Z" fill="#141416" ${O}/><path d="M28 44Q28 14 60 14Q92 14 92 44Z" fill="#141416" ${O}/><path d="M48 44Q48 32 60 32Q72 32 72 44Z" fill="#2B2B33" stroke="var(--ink)" stroke-width="1.6"/><rect x="47" y="39" width="26" height="3.4" rx="1" fill="#C8102E"/><circle cx="60" cy="14.5" r="3" fill="#141416" ${O}/><path d="M40 20Q50 26 52 40M80 20Q70 26 68 40" stroke="#C8102E" stroke-width="1.2" fill="none" stroke-dasharray="2 1.6"/>`
  },
  {
    id: "emo_fone_concha",
    p: "emo",
    slot: "hat",
    name: "Fone grande de concha",
    price: 130,
    svg: () =>
      `<path d="M19 60Q16 12 60 12Q104 12 101 60" fill="none" stroke="var(--ink)" stroke-width="7.4"/><path d="M19 60Q16 12 60 12Q104 12 101 60" fill="none" stroke="#2B2B33" stroke-width="5"/><rect x="9" y="50" width="16" height="25" rx="7" fill="#141416" ${O}/><rect x="95" y="50" width="16" height="25" rx="7" fill="#141416" ${O}/><circle cx="17" cy="62.5" r="3.6" fill="#C8102E"/><circle cx="103" cy="62.5" r="3.6" fill="#C8102E"/><path d="M50 13H70" stroke="#C8102E" stroke-width="2.4"/>`
  },
  {
    id: "emo_orelhas_gato",
    p: "emo",
    slot: "hat",
    name: "Orelhinhas de gato",
    price: 70,
    svg: () =>
      `<path d="M24 46Q60 22 96 46" fill="none" stroke="#141416" stroke-width="3"/><path d="M30 40L31 10L52 30Z" fill="#141416" ${O}/><path d="M34.5 34L35 18.5L45.5 29Z" fill="#FF8FCB"/><path d="M90 40L89 10L68 30Z" fill="#141416" ${O}/><path d="M85.5 34L85 18.5L74.5 29Z" fill="#FF8FCB"/>`
  },

  /* ===================== cabelo ===================== */
  {
    id: "emo_franja_dupla",
    p: "emo",
    slot: "hair",
    name: "Franja cobrindo os dois olhos",
    price: 130,
    svg: () =>
      `<path d="M20 58Q16 22 60 19Q104 22 100 58Q100 66 95 76L89 66L84 74L78 65L72 73L67 64L61 73L55 64L49 73L44 65L38 74L33 66L27 76Q20 68 20 58Z" fill="#141416" ${O}/><path d="M38 28Q46 48 42 66M60 24Q64 46 61 66M80 28Q84 48 80 66" stroke="#3A3A44" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
  },
  {
    id: "emo_moicano",
    p: "emo",
    slot: "hair",
    name: "Moicano scene",
    price: 150,
    svg: () =>
      `<path d="M28 48Q26 30 40 26Q60 21 80 26Q94 30 92 48Q82 36 60 35Q38 36 28 48Z" fill="#2B2B33" opacity=".55"/><path d="M44 37L39 16L50 24L50 1L58 18L64 -3L68 18L78 5L76 26L85 20L76 37Q60 31 44 37Z" fill="#141416" ${O}/><path d="M47 31L41 18M53 27L51 5M63 24L64 1M70 26L77 9M76 32L83 22" stroke="#FF4FB0" stroke-width="2.6" stroke-linecap="round"/><path d="M76 37Q90 44 92 60Q86 56 80 62Q82 50 74 44Z" fill="#141416" ${O}/>`
  },
  {
    id: "emo_repicado",
    p: "emo",
    slot: "hair",
    name: "Repicado com spray",
    price: 140,
    svg: () =>
      `<path d="M22 56Q12 40 24 30Q18 16 33 15Q35 2 49 7Q57 -3 67 5Q79 -1 85 11Q99 11 97 25Q108 36 98 56Q92 47 88 55Q85 64 79 69Q81 57 75 51Q71 61 63 65Q67 53 61 47Q49 41 37 47Q29 49 22 56Z" fill="#141416" ${O}/><path d="M22 56Q17 70 21 84Q25 72 30 64Z" fill="#141416" ${O}/><path d="M98 56Q103 70 99 82Q95 70 91 62Z" fill="#141416" ${O}/><path d="M32 22L40 30M48 12L52 24M66 9L66 22M82 15L77 26M92 28L84 33" stroke="#4A4A55" stroke-width="2" stroke-linecap="round"/><path d="M70 14Q84 24 84 44" stroke="#C8102E" stroke-width="4" fill="none" stroke-linecap="round"/>`
  },
  {
    id: "emo_franja_roxa",
    p: "emo",
    slot: "hair",
    name: "Franja roxa",
    price: 110,
    svg: () => emoBangs("#5B2E7A", "#C9A0F0")
  },
  {
    id: "emo_franja_lima",
    p: "emo",
    slot: "hair",
    name: "Franja verde-limão",
    price: 120,
    svg: () =>
      emoBangs("#9BE23A", "#141416") +
      `<path d="M36 30Q30 38 28 48" stroke="#FF4FB0" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
  },

  /* ===================== rosto e maquiagem ===================== */
  {
    id: "emo_sombra_esfumada",
    p: "emo",
    slot: "cheek",
    name: "Sombra preta esfumada",
    price: 60,
    svg: () =>
      [47, 73]
        .map(
          x =>
            `<path d="M${x - 13} 63a13 10.5 0 1 0 26 0a13 10.5 0 1 0 -26 0ZM${x - 6} 63a6 7 0 1 1 12 0a6 7 0 1 1 -12 0Z" fill="#141016" fill-rule="evenodd" opacity=".14"/><path d="M${x - 9.5} 62a9.5 7.6 0 1 0 19 0a9.5 7.6 0 1 0 -19 0ZM${x - 5} 63a5 6 0 1 1 10 0a5 6 0 1 1 -10 0Z" fill="#141016" fill-rule="evenodd" opacity=".32"/>`
        )
        .join("")
  },
  {
    id: "emo_lapis_agua",
    p: "emo",
    slot: "face",
    name: "Lápis na linha d'água",
    price: 60,
    svg: () =>
      `<path d="M40.5 68.5Q47 73 53.5 68.5M66.5 68.5Q73 73 79.5 68.5" fill="none" stroke="#111" stroke-width="2.8" stroke-linecap="round"/><path d="M40 60Q47 55 54 59.5M80 60Q73 55 66 59.5" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>`
  },
  {
    id: "emo_pintinha",
    p: "emo",
    slot: "cheek",
    name: "Pintinha desenhada",
    price: 30,
    svg: () =>
      `<circle cx="81" cy="76" r="1.7" fill="#141016"/><circle cx="80.5" cy="75.4" r=".5" fill="#fff" opacity=".6"/>`
  },
  {
    id: "emo_septo",
    p: "emo",
    slot: "mouth",
    name: "Piercing de septo",
    price: 70,
    svg: () =>
      `<path d="M57 70A3 3 0 0 0 63 70" fill="none" stroke="#C9CED6" stroke-width="1.8" stroke-linecap="round"/><circle cx="57" cy="70" r="1.15" fill="#C9CED6"/><circle cx="63" cy="70" r="1.15" fill="#C9CED6"/>`
  },
  {
    id: "emo_argola_labio",
    p: "emo",
    slot: "mouth",
    name: "Argola no lábio",
    price: 70,
    // A argola acompanha a boca de cada humor
    svg: m => {
      const lugar = {
        happy: [65, 85.5],
        party: [65, 85.5],
        cry: [63, 86],
        worried: [63.5, 86],
        focus: [63, 83.6],
        upset: [64, 84.4],
        sad: [64, 85]
      };
      const [x, y] = lugar[m] || [63.5, 83];
      return `<circle cx="${x}" cy="${y}" r="2.6" fill="none" stroke="#C9CED6" stroke-width="1.7"/><circle cx="${x}" cy="${y + 2.6}" r=".9" fill="#E6E9ED"/>`;
    }
  },
  {
    id: "emo_lagrima_glitter",
    p: "emo",
    slot: "cheek",
    name: "Lágrima de glitter",
    price: 80,
    svg: () =>
      `<path d="M44 70Q48.6 77 44 80.6Q39.4 77 44 70Z" fill="#B9A6FF" stroke="#141016" stroke-width="1"/>` +
      brilhinho(44, 76.5, 1.6, "#fff", 0) +
      brilhinho(49.5, 72, 1.8, "#FF8FCB", 0.6) +
      brilhinho(39.5, 82, 1.5, "#B9A6FF", 1.1)
  },

  /* ===================== roupas ===================== */
  {
    id: "emo_colete",
    p: "emo",
    slot: "top",
    name: "Colete preto",
    price: 120,
    svg: () =>
      vest("#17171C", "#E9E6EC") +
      `<path d="M58 88H62L63.4 104L60 109L56.6 104Z" fill="#C8102E" ${O} stroke-width="1.2"/>` +
      topHem
  },
  {
    id: "emo_cardiga",
    p: "emo",
    slot: "top",
    name: "Cardigã furado",
    price: 120,
    svg: () =>
      topBase("#3E3747") +
      `<path d="M50 86Q60 96 70 86L66 150H54Z" fill="#141416"/><path d="M50 86L54 150M70 86L66 150" ${O} stroke-width="1.6"/>${[100, 114, 128, 142].map(y => `<circle cx="${50 + (y - 86) / 16}" cy="${y}" r="1.6" fill="#B8BEC6"/>`).join("")}<ellipse cx="32" cy="112" rx="3.4" ry="2.3" fill="#141416" opacity=".8"/><ellipse cx="86" cy="104" rx="2.6" ry="1.9" fill="#141416" opacity=".8"/><ellipse cx="80" cy="132" rx="3" ry="2" fill="#141416" opacity=".8"/><path d="M28.6 112l-1.6-1M35.4 112l1.6 1M83.4 104l-1.4-1.2" stroke="#3E3747" stroke-width=".9"/>` +
      topHem
  },
  {
    id: "emo_flanela",
    p: "emo",
    slot: "top",
    name: "Camisa de flanela xadrez",
    price: 110,
    svg: () =>
      topBase("#2F4F8F") +
      stripesV("#152642", 12, 4, 6) +
      stripesH("#152642", 12, 4, 90) +
      stripesV("#7FA2E8", 12, 1, 12) +
      `<path d="M47 86L58 96L60 89Z" fill="#152642" ${O}/><path d="M73 86L62 96L60 89Z" fill="#152642" ${O}/>` +
      topHem
  },
  {
    id: "emo_jaqueta_couro",
    p: "emo",
    slot: "top",
    name: "Jaqueta de couro",
    price: 180,
    svg: () =>
      jacket("#141416", "#3A3A44", "#26262B") +
      `<path d="M72 98L67 150" stroke="#B8BEC6" stroke-width="1.6" stroke-dasharray="1.6 1.2"/><circle cx="48" cy="100" r="1.1" fill="#D9DDE3"/><circle cx="50" cy="104" r="1.1" fill="#D9DDE3"/><circle cx="72" cy="100" r="1.1" fill="#D9DDE3"/><circle cx="70" cy="104" r="1.1" fill="#D9DDE3"/><path d="M26 96Q22 118 28 142M92 98Q96 118 90 140" stroke="#fff" stroke-opacity=".16" stroke-width="3" fill="none" stroke-linecap="round"/>`
  },
  {
    id: "emo_moletom_orelhas",
    p: "emo",
    slot: "top",
    name: "Moletom com orelhas",
    price: 130,
    svg: () =>
      hoodie("#26272C") +
      `<path d="M33 92L37 79L46 90Z" fill="#26272C" ${O} stroke-width="1.6"/><path d="M36.5 89L38.4 82.6L42.6 88.4Z" fill="#FF8FCB"/><path d="M87 92L83 79L74 90Z" fill="#26272C" ${O} stroke-width="1.6"/><path d="M83.5 89L81.6 82.6L77.4 88.4Z" fill="#FF8FCB"/>`
  },
  {
    id: "emo_rasgada",
    p: "emo",
    slot: "top",
    name: "Camiseta rasgada com alfinetes",
    price: 100,
    svg: () =>
      tee(
        "#1E1F24",
        `<path d="M30 102L37 99L34 106L41 105L35 113L31 108Z" fill="var(--mascot)" stroke="#000" stroke-opacity=".45" stroke-width=".8"/><path d="M76 120L84 117L80 124L87 125L79 131Z" fill="var(--mascot)" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>` +
          alfinete(38, 116, -20) +
          alfinete(72, 112, 15) +
          alfinete(52, 130, -5)
      )
  },
  {
    id: "emo_suspensorios",
    p: "emo",
    slot: "top",
    name: "Suspensórios",
    price: 90,
    svg: () =>
      tee(
        "#E9E6EC",
        `<path d="M44 87V150M76 87V150" stroke="#C8102E" stroke-width="5.4"/><rect x="40.6" y="122" width="6.8" height="5" rx="1" fill="#C9CED6" stroke="#141416" stroke-width=".8"/><rect x="72.6" y="122" width="6.8" height="5" rx="1" fill="#C9CED6" stroke="#141416" stroke-width=".8"/>`
      )
  },
  {
    id: "emo_gravata_borboleta",
    p: "emo",
    slot: "neck",
    name: "Gravata borboleta",
    price: 70,
    svg: () =>
      `<path d="M60 92L47 85V99Z" fill="#141416" ${O} stroke-width="1.6"/><path d="M60 92L73 85V99Z" fill="#141416" ${O} stroke-width="1.6"/><rect x="56.8" y="88.8" width="6.4" height="6.4" rx="1.6" fill="#C8102E" ${O} stroke-width="1.3"/>`
  },
  {
    id: "emo_cachecol",
    p: "emo",
    slot: "neck",
    name: "Cachecol listrado",
    price: 100,
    svg: () =>
      `<path d="M72 92L80 128L68 131L64 96Z" fill="#141416" ${O}/><path d="M68.6 104L74 103M70 112L76 110.6M71.4 120L77.6 118.6" stroke="#C8102E" stroke-width="3.4"/><path d="M68.4 131.4l-.6 4M72 130.8l-.2 4M75.6 130l.2 4M79 129.2l.6 4" stroke="#141416" stroke-width="1.4" stroke-linecap="round"/><path d="M25 80Q60 100 95 80L97 88Q60 109 23 88Z" fill="#141416" ${O}/><path d="M25 84Q60 104 95 84" stroke="#C8102E" stroke-width="6.6" stroke-dasharray="5 5" fill="none"/>`
  },
  /* ===================== cintura ===================== */
  {
    id: "emo_saia_xadrez",
    p: "emo",
    slot: "waist",
    name: "Saia xadrez",
    price: 110,
    svg: () =>
      `<path d="M10 110H110L124 150H-4Z" fill="#B3122E"/>${[30, 42, 54, 66, 78, 90].map(x => `<path d="M${x} 110L${x + (x - 60) / 4} 150" stroke="#141416" stroke-width="1.8" opacity=".75"/>`).join("")}${[118, 128, 138].map(y => `<path d="M0 ${y}H120" stroke="#141416" stroke-width="1.6" opacity=".6"/>`).join("")}<path d="M0 124H120" stroke="#F2F2F2" stroke-width=".7" opacity=".6"/><rect x="0" y="108" width="120" height="5" fill="#141416"/>`
  },
  {
    id: "emo_corrente_dupla",
    p: "emo",
    slot: "waist",
    name: "Corrente dupla",
    price: 90,
    svg: () =>
      `<rect x="0" y="110" width="120" height="6" fill="#1E1F24"/><path d="M47 115Q60 126 73 115" fill="none" stroke="#C9CED6" stroke-width="2.4" stroke-dasharray="2.8 1.4"/><path d="M49 116Q60 134 71 116" fill="none" stroke="#9AA3AD" stroke-width="2.4" stroke-dasharray="2.8 1.4"/><rect x="54" y="109" width="12" height="8" rx="2" fill="#C9CED6"/>`
  },

  /* ===================== pescoço ===================== */
  {
    id: "emo_crucifixo",
    p: "emo",
    slot: "neck",
    name: "Crucifixo",
    price: 80,
    svg: () =>
      `<path d="M32 84Q60 104 88 84" fill="none" stroke="#C9CED6" stroke-width="1.4"/><path d="M60 94V112M54.4 99.4H65.6" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M60 94V112M54.4 99.4H65.6" stroke="#C9CED6" stroke-width="2.8" stroke-linecap="round"/>`
  },
  {
    id: "emo_rosario",
    p: "emo",
    slot: "neck",
    name: "Rosário",
    price: 90,
    svg: () =>
      beads("#4A0A16", 1.9, 15) +
      `<path d="M60 96V111M55.6 100.4H64.4" stroke="var(--ink)" stroke-width="4.2" stroke-linecap="round"/><path d="M60 96V111M55.6 100.4H64.4" stroke="#B8975A" stroke-width="2.2" stroke-linecap="round"/>`
  },
  {
    id: "emo_colar_chave",
    p: "emo",
    slot: "neck",
    name: "Colar de chave",
    price: 80,
    svg: () =>
      `<path d="M32 84Q60 104 88 84" fill="none" stroke="#9AA3AD" stroke-width="1.4"/><circle cx="60" cy="98.6" r="3.6" fill="none" stroke="var(--ink)" stroke-width="3.6"/><circle cx="60" cy="98.6" r="3.6" fill="none" stroke="#B8975A" stroke-width="1.8"/><path d="M60 102V114M60 110.6H63.6M60 113.4H63" stroke="var(--ink)" stroke-width="3.4" stroke-linecap="round"/><path d="M60 102V114M60 110.6H63.6M60 113.4H63" stroke="#B8975A" stroke-width="1.8" stroke-linecap="round"/>`
  },
  {
    id: "emo_spikes",
    p: "emo",
    slot: "neck",
    name: "Gargantilha de spikes",
    price: 90,
    svg: () => {
      const pontas = [0.12, 0.26, 0.4, 0.54, 0.68, 0.82]
        .map(t => {
          const [x, y] = pontoQ([28, 82], [60, 100], [92, 82], t + 0.03);
          return `<path d="M${(x - 2.4).toFixed(1)} ${(y + 1.6).toFixed(1)}L${x.toFixed(1)} ${(y + 7.4).toFixed(1)}L${(x + 2.4).toFixed(1)} ${(y + 1.6).toFixed(1)}Z" fill="#D9DDE3" stroke="#141416" stroke-width=".7"/>`;
        })
        .join("");
      return `<path d="M28 82Q60 100 92 82" fill="none" stroke="var(--ink)" stroke-width="7"/><path d="M28 82Q60 100 92 82" fill="none" stroke="#1E1F24" stroke-width="4.6"/>${pontas}`;
    }
  },

  /* ===================== mãos ===================== */
  {
    id: "emo_bolsa_sangue",
    p: "emo",
    slot: "hand",
    name: "Bolsa de sangue com canudinho",
    price: 100,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 -9V-17Q0 -21 4 -21H8" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/><path d="M0 -9V-17Q0 -21 4 -21H8" fill="none" stroke="#F2F2F2" stroke-width="1.8" stroke-linecap="round"/><rect x="-8" y="-10" width="16" height="22" rx="3" fill="#9E0F24" ${O} stroke-width="1.6"/><rect x="-5.5" y="-4" width="11" height="7" rx="1" fill="#F2F2F2"/><text y="1.8" font-size="5" font-weight="900" text-anchor="middle" fill="#9E0F24" font-family="sans-serif">A+</text><path d="M-5 -8Q-5.6 2 -4.4 9" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
      )
  },
  {
    id: "emo_flip",
    p: "emo",
    slot: "hand",
    name: "Celular flip com chaveirinhos",
    price: 110,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-5 13Q-10 17 -9 21" fill="none" stroke="#C9CED6" stroke-width=".9"/><path d="M-9 21l1.1 2.4 2.5.3-1.9 1.7.5 2.5-2.2-1.3-2.2 1.3.5-2.5-1.9-1.7 2.5-.3z" fill="#FF4FB0" stroke="#141416" stroke-width=".5"/><path d="M-5 13Q-3 18 -4 22" fill="none" stroke="#C9CED6" stroke-width=".9"/><path d="M-4 26.4l-2.6-2.5a1.5 1.5 0 0 1 2.6-1.3 1.5 1.5 0 0 1 2.6 1.3z" fill="#4FE3FF" stroke="#141416" stroke-width=".5"/><rect x="-6" y="-16" width="12" height="15" rx="2.4" fill="#2B1D3A" ${O} stroke-width="1.5"/><rect x="-4" y="-14" width="8" height="9" rx="1" fill="#FF8FCB"/><path d="M-1.6 -10.6l1.6-1.4 1.6 1.4-1.6 1.6z" fill="#fff"/><rect x="-6" y="0" width="12" height="14" rx="2.4" fill="#2B1D3A" ${O} stroke-width="1.5"/>${[3, 6, 9].map(yy => `<path d="M-3.4 ${yy}h1.8M-.9 ${yy}h1.8M1.6 ${yy}h1.8" stroke="#C9CED6" stroke-width="1.2"/>`).join("")}<rect x="-6.6" y="-1.6" width="13.2" height="2.6" rx="1.3" fill="#141416"/>`
      )
  },
  {
    id: "emo_mp3",
    p: "emo",
    slot: "hand",
    name: "MP3 com fone",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-1.6 -9Q-7 -18 -3 -25M1.6 -9Q7 -18 3 -25" fill="none" stroke="#F2F2F2" stroke-width="1.2"/><path d="M-1.6 -9Q-7 -18 -3 -25M1.6 -9Q7 -18 3 -25" fill="none" stroke="var(--ink)" stroke-width=".5" stroke-dasharray="2 3"/><circle cx="-3" cy="-26" r="2.2" fill="#F2F2F2" stroke="var(--ink)" stroke-width=".9"/><circle cx="3" cy="-26" r="2.2" fill="#F2F2F2" stroke="var(--ink)" stroke-width=".9"/><rect x="-6" y="-10" width="12" height="20" rx="2.4" fill="#F2F2F2" ${O} stroke-width="1.5"/><rect x="-4.2" y="-8.4" width="8.4" height="6" rx=".8" fill="#2B2D3A"/><path d="M-3 -5h4" stroke="#7FE8FF" stroke-width=".8"/><circle cy="4" r="3.8" fill="#D9DDE3" stroke="#9AA3AD" stroke-width=".8"/><circle cy="4" r="1.4" fill="#F2F2F2" stroke="#9AA3AD" stroke-width=".6"/>`
      )
  },
  {
    id: "emo_camera",
    p: "emo",
    slot: "hand",
    name: "Câmera digital",
    price: 120,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-11" y="-7" width="22" height="14" rx="2.4" fill="#C9CED6" ${O} stroke-width="1.5"/><circle cx="2" cy="0" r="4.8" fill="#2B2D3A" stroke="#141416" stroke-width="1"/><circle cx="2" cy="0" r="2.4" fill="#4A5A8A"/><circle cx="1" cy="-1" r=".8" fill="#fff"/><rect x="-9" y="-5" width="5" height="3" rx=".6" fill="#F2F2F2"/><rect x="5" y="-9.6" width="4.4" height="2.6" rx=".6" fill="#C8102E" stroke="#141416" stroke-width=".6"/><path d="M-11 4H-14" stroke="#FF4FB0" stroke-width="1.6"/>` +
          brilhinho(-7, -12, 3.2, "#FFF6C8", 0.3)
      )
  },
  {
    id: "emo_fita_k7",
    p: "emo",
    slot: "hand",
    name: "Fita K7",
    price: 70,
    svg: (x, y) => H(x, y, `<g transform="rotate(-12)">${fitaK7()}</g>`)
  },
  {
    id: "emo_vela_preta",
    p: "emo",
    slot: "hand",
    name: "Vela preta",
    price: 80,
    svg: (x, y) =>
      H(
        x,
        y,
        `<circle cy="-14" r="7" fill="#FFB020" opacity=".18"/><rect x="-3.4" y="-8" width="6.8" height="20" rx="1" fill="#1E1F24" ${O} stroke-width="1.4"/><path d="M-3.4 -6Q-1.6 -4 -1.4 0Q-.4 -3 1 -4Q2.4 -2 3.4 -5" fill="none" stroke="#3A3A44" stroke-width="1.6"/><path d="M0 -8V-10.4" stroke="#141416" stroke-width="1"/><path class="chama" d="M0 -19Q3.4 -14 1.8 -11.4Q0 -9.8 -1.8 -11.4Q-3.4 -14 0 -19Z" fill="#FFB020"/><path class="chama" d="M0 -15.6Q1.4 -13 .8 -11.8Q0 -11 -.8 -11.8Q-1.4 -13 0 -15.6Z" fill="#FFF3C4"/>`
      )
  },
  {
    id: "emo_caveira_hamlet",
    p: "emo",
    slot: "hand",
    name: "Caveira de Hamlet",
    price: 120,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-9 -3Q-9 -15 0 -15Q9 -15 9 -3Q9 3 4.6 4.4V9H-4.6V4.4Q-9 3 -9 -3Z" fill="#EDE8DC" ${O} stroke-width="1.6"/><ellipse cx="-3.6" cy="-3" rx="2.6" ry="3" fill="#2A2733"/><ellipse cx="3.6" cy="-3" rx="2.6" ry="3" fill="#2A2733"/><path d="M0 0.6L-1.4 3.4H1.4Z" fill="#2A2733"/><path d="M-2.6 5V8.6M0 5V8.6M2.6 5V8.6" stroke="#2A2733" stroke-width=".8"/><path d="M4 -11Q6 -9 6 -6" stroke="#C9C1AE" stroke-width="1" fill="none"/>`
      )
  },
  {
    id: "emo_cafe",
    p: "emo",
    slot: "hand",
    name: "Café preto",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path class="vapor" d="M-3 -9Q-5 -13 -3 -16Q-1 -19 -3 -22M2 -9Q0 -13 2 -16Q4 -19 2 -22" fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-linecap="round"/><path d="M7 -3Q12.6 -3 12.6 2Q12.6 7 7 7" fill="none" stroke="var(--ink)" stroke-width="2.2"/><path d="M-7.4 -7H7.4V8Q7.4 11.6 4 11.6H-4Q-7.4 11.6 -7.4 8Z" fill="#141416" ${O} stroke-width="1.6"/><ellipse cy="-7" rx="7.4" ry="1.8" fill="#3A2416" ${O} stroke-width="1.2"/>` +
          bat(0, 3, 0.36, "#C8102E")
      )
  },
  {
    id: "emo_poesia",
    p: "emo",
    slot: "hand",
    name: "Caneta e papel de poesia",
    price: 60,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g transform="rotate(-8)"><rect x="-9" y="-13" width="18" height="24" rx="1" fill="#FBF7EC" ${O} stroke-width="1.4"/><path d="M-6 -8Q-2 -9.4 2 -8T6 -8M-6 -4Q-1 -5.4 3 -4M-6 0Q-3 -1.2 1 0T5 0M-6 4Q0 2.8 4 4" fill="none" stroke="#5B6FC2" stroke-width=".9"/><path d="M3 8.4l-2.4-2.2a1.4 1.4 0 0 1 2.4-1.2 1.4 1.4 0 0 1 2.4 1.2z" fill="#C8102E"/></g><path d="M-14 6L4 -16" stroke="#141416" stroke-width="2.6" stroke-linecap="round"/><path d="M-14 6L-15.6 8" stroke="#C9CED6" stroke-width="1.6" stroke-linecap="round"/>`
      )
  },

  /* ===================== companheiros ===================== */
  {
    id: "emo_pet_aranha",
    p: "emo",
    slot: "pet",
    name: "Aranha",
    price: 90,
    svg: () =>
      `<g transform="translate(18 0)"><line x1="0" y1="-6" x2="0" y2="22" stroke="#C9CED6" stroke-width=".8"/><g transform="translate(0 25)"><path d="M-2.4 -1.4L-7.6 -5.6L-9.4 -1.6M-2.6 .4L-8.4 .6L-10 4.4M-2.4 1.6L-7.2 5L-7.6 9M2.4 -1.4L7.6 -5.6L9.4 -1.6M2.6 .4L8.4 .6L10 4.4M2.4 1.6L7.2 5L7.6 9" fill="none" stroke="#141416" stroke-width="1.1" stroke-linejoin="round"/><ellipse cy="2" rx="4.2" ry="4.8" fill="#141416"/><circle cy="-3.4" r="2.8" fill="#141416"/><path d="M-1.4 1L1.4 1L0 3.2Z M-1.4 5.4L1.4 5.4L0 3.2Z" fill="#C8102E"/><circle cx="-1" cy="-3.8" r=".6" fill="#E0102E"/><circle cx="1" cy="-3.8" r=".6" fill="#E0102E"/></g></g>`
  },
  {
    id: "emo_pet_rato",
    p: "emo",
    slot: "pet",
    name: "Ratinho",
    price: 100,
    svg: () =>
      `<g transform="translate(16 130)"><path d="M8 3Q16 4 15 -4Q14 -9 18 -11" fill="none" stroke="#C8A0A8" stroke-width="1.3" stroke-linecap="round"/><ellipse cx="1" cy="1" rx="8.6" ry="6.4" fill="#8C8A96" stroke="var(--ink)" stroke-width="1.1"/><circle cx="-5" cy="-5.6" r="3.2" fill="#8C8A96" stroke="var(--ink)" stroke-width="1"/><circle cx="-5" cy="-5.6" r="1.6" fill="#FF8FCB"/><path d="M-6 -1Q-12 -1 -12.4 2Q-9 4 -5 3Z" fill="#8C8A96" stroke="var(--ink)" stroke-width="1"/><circle cx="-12.2" cy="1.8" r="1" fill="#FF8FCB"/><circle cx="-7.6" cy="0" r=".9" fill="#141416"/><path d="M-11 2.6l-3 1.4M-11 1.6l-3.4-.2" stroke="#141416" stroke-width=".5"/></g>`
  },
  {
    id: "emo_pet_coruja",
    p: "emo",
    slot: "pet",
    name: "Coruja",
    price: 140,
    svg: () =>
      `<g transform="translate(16 32)"><path d="M-11 12H11" stroke="#6B4E3D" stroke-width="2.4" stroke-linecap="round"/><path d="M-7 -6L-8 -12L-3.6 -8.4M7 -6L8 -12L3.6 -8.4" fill="#5C5A66"/><ellipse cy="2" rx="8.4" ry="10" fill="#5C5A66" stroke="var(--ink)" stroke-width="1.1"/><ellipse cy="5" rx="5" ry="5.6" fill="#8C8A96"/><path d="M-3 4l1.2 1.2M0 3.4l1.2 1.2M3 4l1.2 1.2M-1.6 7l1.2 1.2M1.6 7l1.2 1.2" stroke="#5C5A66" stroke-width=".7"/><circle cx="-3.4" cy="-3" r="3.2" fill="#F2C14E" stroke="#141416" stroke-width=".8"/><circle cx="3.4" cy="-3" r="3.2" fill="#F2C14E" stroke="#141416" stroke-width=".8"/><circle cx="-3.4" cy="-3" r="1.5" fill="#141416"/><circle cx="3.4" cy="-3" r="1.5" fill="#141416"/><path d="M-1.2 -.4L1.2 -.4L0 2Z" fill="#C77700"/><path d="M-3 11.4l-1 1.6M-1.6 11.6v1.8M1.6 11.6v1.8M3 11.4l1 1.6" stroke="#C77700" stroke-width=".9"/></g>`
  },
  {
    id: "emo_pet_morcego_voa",
    p: "emo",
    slot: "pet",
    name: "Morcego voando em volta",
    price: 160,
    // Dois movimentos de vai e vem (um no x e outro no y) formam uma volta em elipse. CSS em estilos/mundos/emo.css
    svg: () =>
      `<g transform="translate(60 66)"><g class="orbita-x"><g class="orbita-y"><g class="flap">${bat(0, 0, 0.95)}</g><circle cx="-1.7" cy="-1" r=".85" fill="#E0102E"/><circle cx="1.7" cy="-1" r=".85" fill="#E0102E"/></g></g></g>`
  },

  /* ===================== fio ===================== */
  {
    id: "emo_fio_tenis",
    p: "emo",
    slot: "string",
    name: "Tênis xadrez pendurado",
    price: 80,
    svg: () => {
      let xadrez = "";
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 2; j++)
          if ((i + j) % 2)
            xadrez += `<rect x="${-6 + i * 2.6}" y="${-4.4 + j * 2.4}" width="2.6" height="2.4" fill="#141416"/>`;
      return `<line x1="60" y1="-40" x2="60" y2="19" stroke="#F2F2F2" stroke-width="1.6"/><line x1="60" y1="-40" x2="60" y2="19" stroke="var(--ink)" stroke-width=".5" stroke-dasharray="1.4 2.2"/><g transform="translate(62 8) rotate(-18)"><path d="M-7 -5H2Q6 -5 8 -1Q10 1.6 8 2.4H-7Z" fill="#F2F2F2" stroke="var(--ink)" stroke-width="1"/>${xadrez}<rect x="-7.4" y="2" width="16" height="2.6" rx="1.2" fill="#F2F2F2" stroke="var(--ink)" stroke-width="1"/></g>`;
    }
  },
  {
    id: "emo_fio_k7",
    p: "emo",
    slot: "string",
    name: "Fio de fita K7",
    price: 70,
    svg: () =>
      `<path d="M60 -40V-6Q57 0 60 5Q63 10 60 14Q58 17 60 19" fill="none" stroke="#5A3A22" stroke-width="1.8"/><g transform="translate(60 3) scale(.5)">${fitaK7("#2B2D3A")}</g>`
  },

  /* ===================== cenários ===================== */
  {
    id: "emo_bg_quarto",
    p: "emo",
    slot: "bg",
    name: "Quarto emo",
    price: 170,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#2A1F33" opacity=".22"/><path d="M0 132H120" stroke="#2A1F33" stroke-width="1" opacity=".5"/>` +
      poster(15, 24, -6, "#141416", "#E0314F", "LUA", "FRIA", bat(0, 8, 0.45, "#E0314F")) +
      poster(
        102,
        22,
        5,
        "#F2EAD3",
        "#141416",
        "VAMPIROS",
        "DE SÁBADO",
        `<path d="M0 10l-4.4-4.2a2.6 2.6 0 0 1 4.4-2.6 2.6 2.6 0 0 1 4.4 2.6z" fill="#C8102E"/>`
      ) +
      poster(
        12,
        66,
        4,
        "#5B2E7A",
        "#FFE8F7",
        "ADEUS",
        "SEGUNDA",
        `<path d="M-6 8H6" stroke="#FFE8F7" stroke-width=".8"/>`
      ) +
      `<path d="M0 2Q30 12 60 4Q90 -4 120 6" fill="none" stroke="#3A3A44" stroke-width=".8"/>${[
        6, 20, 34, 48, 70, 84, 98, 114
      ]
        .map((x, i) => {
          const y =
            x < 60 ? 2 + 7 * Math.sin((x / 60) * Math.PI) : 4 + 4 * Math.sin(((x - 60) / 64) * Math.PI);
          return `<circle class="pisca" style="animation-delay:${(i * 0.37).toFixed(2)}s" cx="${x}" cy="${y.toFixed(1)}" r="1.8" fill="${["#FF4FB0", "#F2C14E", "#4FE3FF", "#C8102E"][i % 4]}"/>`;
        })
        .join(
          ""
        )}<path d="M88 132V120Q88 114 96 114H120V132Z" fill="#141416" opacity=".55"/><path d="M98 118l-3.4-3a1.9 1.9 0 0 1 3.4-1.8 1.9 1.9 0 0 1 3.4 1.8z" fill="#FF4FB0"/>`
  },
  {
    id: "emo_bg_galeria",
    p: "emo",
    slot: "bg",
    name: "Galeria do rock",
    price: 160,
    svg: () => {
      // piso quadriculado em perspectiva
      let piso = "";
      for (let i = -5; i <= 5; i++)
        piso += `<path d="M${60 + i * 6} 128L${60 + i * 12} 148" stroke="#3A3A44" stroke-width=".6" opacity=".6"/>`;
      return (
        `<rect x="0" y="-6" width="120" height="134" fill="#1A1A20" opacity=".16"/><path d="M0 128H120" stroke="#3A3A44" stroke-width="1" opacity=".7"/>${piso}<path d="M0 136H120M0 145H120" stroke="#3A3A44" stroke-width=".6" opacity=".5"/>` +
        // lojinhas da esquerda e da direita, com letreiros de neon genéricos
        `<rect x="0" y="46" width="28" height="62" rx="2" fill="#26272C" opacity=".7"/><rect x="3" y="62" width="22" height="34" fill="#5B2E7A" opacity=".35"/><text x="14" y="56" font-size="7" text-anchor="middle" fill="#FF4FD8" font-family="Bungee,Impact,sans-serif" class="neon">CDs</text>${[5, 12, 19].map(x => `<path d="M${x} 70h5v3h-1v6h-3v-6h-1z" fill="#141416" stroke="#C9CED6" stroke-width=".4"/>`).join("")}` +
        `<rect x="92" y="46" width="28" height="62" rx="2" fill="#26272C" opacity=".7"/><rect x="95" y="62" width="22" height="34" fill="#18A8DC" opacity=".25"/><text x="106" y="56" font-size="5.6" text-anchor="middle" fill="#4FE3FF" font-family="Bungee,Impact,sans-serif" class="neon">TATTOO</text><path d="M101 84l5-8 5 8z" fill="none" stroke="#4FE3FF" stroke-width=".8" opacity=".8"/>` +
        // escada rolante ao fundo
        `<path d="M30 40L90 4M34 44L94 8" stroke="#5C5A66" stroke-width="1.2" opacity=".5"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${36 + i * 9} ${36 - i * 5.4}l3 2" stroke="#5C5A66" stroke-width=".8" opacity=".5"/>`).join("")}`
      );
    }
  },
  {
    id: "emo_bg_palco",
    p: "emo",
    slot: "bg",
    name: "Palco com holofote",
    price: 170,
    svg: () =>
      `<g class="holofote"><path d="M52 -2H68L106 140H14Z" fill="#FFF6C8" opacity=".24"/></g><rect x="50" y="-6" width="20" height="8" rx="2" fill="#2B2B33"/><circle cx="60" cy="2" r="3" fill="#FFF6C8"/><rect x="0" y="138" width="120" height="10" fill="#2A1F17" opacity=".75"/><path d="M0 138H120" stroke="#B8975A" stroke-width="1.4" opacity=".7"/><rect x="1" y="108" width="20" height="30" rx="2" fill="#141416" opacity=".85"/><circle cx="11" cy="120" r="6" fill="#2B2B33"/><circle cx="11" cy="120" r="2.6" fill="#3A3A44"/><rect x="99" y="112" width="20" height="26" rx="2" fill="#141416" opacity=".85"/><circle cx="109" cy="123" r="5" fill="#2B2B33"/><circle cx="109" cy="123" r="2.2" fill="#3A3A44"/>`
  },
  {
    id: "emo_bg_show",
    p: "emo",
    slot: "bg",
    name: "Show lotado",
    price: 180,
    svg: () => {
      let galera = "";
      for (let i = 0; i < 12; i++) {
        const x = 5 + i * 10,
          y = 134 + (i % 3) * 3;
        galera += `<circle cx="${x}" cy="${y}" r="5.4" fill="#141416"/><path d="M${x - 4} ${y + 4}H${x + 4}V148H${x - 4}Z" fill="#141416"/>`;
        if (i % 3 === 1)
          galera += `<path d="M${x + 3} ${y - 2}L${x + 7} ${y - 16}" stroke="#141416" stroke-width="2.6" stroke-linecap="round"/><path d="M${x + 5.4} ${y - 18}l1.8-4M${x + 7} ${y - 17}l2.8-2.6" stroke="#141416" stroke-width="1.4" stroke-linecap="round"/>`;
        if (i % 4 === 2)
          galera += `<rect x="${x - 6}" y="${y - 19}" width="4" height="6" rx=".8" fill="#141416"/><rect x="${x - 5.4}" y="${y - 18.4}" width="2.8" height="4" fill="#FFF6C8" class="pisca"/>`;
      }
      return `<path d="M12 -6L0 70V30Z" fill="#C8102E" opacity=".2"/><path d="M108 -6L120 70V30Z" fill="#5B2E7A" opacity=".24"/><path d="M40 -6L20 90H40Z" fill="#FF4FD8" opacity=".1"/><path d="M80 -6L100 90H80Z" fill="#4FE3FF" opacity=".1"/>${galera}`;
    }
  },
  {
    id: "emo_bg_igreja",
    p: "emo",
    slot: "bg",
    name: "Igreja gótica",
    price: 170,
    svg: () => {
      const vitral = ["#C8102E", "#5B2E7A", "#2F4F8F", "#F2C14E", "#5E9E5A", "#C8102E", "#5B2E7A", "#2F4F8F"];
      const petalas = vitral
        .map(
          (c, i) =>
            `<path d="M60 22L${(60 + 13 * Math.cos((i * Math.PI) / 4)).toFixed(1)} ${(22 + 13 * Math.sin((i * Math.PI) / 4)).toFixed(1)}A13 13 0 0 1 ${(60 + 13 * Math.cos(((i + 1) * Math.PI) / 4)).toFixed(1)} ${(22 + 13 * Math.sin(((i + 1) * Math.PI) / 4)).toFixed(1)}Z" fill="${c}" opacity=".55"/>`
        )
        .join("");
      return `<path d="M14 148V50Q14 -4 60 -4Q106 -4 106 50V148Z" fill="#2A2733" opacity=".22"/><path d="M14 148V50Q14 -4 60 -4Q106 -4 106 50V148" fill="none" stroke="#5C5A66" stroke-width="2.4" opacity=".6"/>${petalas}<circle cx="60" cy="22" r="13" fill="none" stroke="#3A3A44" stroke-width="1.6"/><circle cx="60" cy="22" r="3.4" fill="#F2C14E" opacity=".7"/><rect x="0" y="40" width="9" height="108" fill="#5C5A66" opacity=".5"/><rect x="111" y="40" width="9" height="108" fill="#5C5A66" opacity=".5"/><path d="M0 40L4.5 26L9 40M111 40L115.5 26L120 40" fill="#5C5A66" opacity=".5"/><rect x="2.6" y="130" width="4" height="12" fill="#EFE6D6"/><path class="chama" d="M4.6 124Q6.6 127 5.6 129Q4.6 130 3.6 129Q2.6 127 4.6 124Z" fill="#FFB020"/><rect x="113.4" y="130" width="4" height="12" fill="#EFE6D6"/><path class="chama" d="M115.4 124Q117.4 127 116.4 129Q115.4 130 114.4 129Q113.4 127 115.4 124Z" fill="#FFB020"/>`;
    }
  },
  {
    id: "emo_bg_janela",
    p: "emo",
    slot: "bg",
    name: "Janela com chuva à noite",
    price: 150,
    svg: () =>
      `<rect x="6" y="0" width="108" height="118" rx="3" fill="#141A33" opacity=".55"/><circle cx="92" cy="20" r="8" fill="#F2EAD3" opacity=".8"/><circle cx="89" cy="18" r="1.6" fill="#000" opacity=".1"/><g class="rain">${Array.from({ length: 18 }, (_, i) => `<path d="M${((i * 41) % 100) + 10} ${((i * 29) % 100) + 4}l-2 8" stroke="#9BB0E0" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>`).join("")}</g><path d="M22 30Q21 44 23 56M98 60Q97 72 99 86" stroke="#9BB0E0" stroke-width="1.6" fill="none" opacity=".35" stroke-linecap="round"/><rect x="6" y="0" width="108" height="118" rx="3" fill="none" stroke="#3A2A1E" stroke-width="4"/><path d="M60 0V118M6 58H114" stroke="#3A2A1E" stroke-width="3"/><rect x="0" y="116" width="120" height="6" rx="1.6" fill="#3A2A1E"/>`
  },

  /* ===================== pele ===================== */
  {
    id: "emo_pele_brilho",
    p: "emo",
    slot: "skin",
    name: "Brilha no sol",
    price: 160,
    color: "#EEE6F6",
    ink: "#141416",
    // Pele com desenho extra: brilhinhos que piscam (desenhados dentro do corpo, em js/mascote/desenho.js)
    svg: () =>
      [
        [32, 52, 4, "#B9A6FF", 0],
        [88, 46, 3.4, "#FFD86B", 0.5],
        [28, 80, 3, "#8FD8FF", 1],
        [92, 80, 3.6, "#FF8FCB", 1.4],
        [60, 34, 2.8, "#B9A6FF", 0.8],
        [46, 104, 3, "#8FD8FF", 0.3],
        [74, 112, 2.6, "#FFD86B", 1.2]
      ]
        .map(
          ([x, y, r, cor, atraso]) =>
            brilhinho(x, y, r, cor, atraso) + brilhinho(x, y, r * 0.45, "#FFFFFF", atraso)
        )
        .join("")
  }
);

/* ===================== lendários das conquistas do emo (js/conquistas.js) ===================== */
ITEMS.push(
  {
    id: "emo_pena",
    p: "emo",
    slot: "hand",
    name: "Pena e tinteiro",
    ach: "poeta",
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-7 4H7L6 12H-6Z" fill="#1E1F24" ${O} stroke-width="1.4"/><ellipse cy="4" rx="7" ry="2" fill="#3A0610" ${O} stroke-width="1.2"/><path d="M2 3L12 -22Q16 -12 8 -4Q6 0 2 3Z" fill="#F2EAD3" ${O} stroke-width="1.3"/><path d="M3 2L11 -18" stroke="#B8975A" stroke-width=".9"/><path d="M8 -6l3-2M9 -10l3-2M10 -14l2.6-2" stroke="#B8975A" stroke-width=".7"/>` +
          brilhinho(-9, -8, 2.6, "#FFD86B", 0.2)
      )
  },
  {
    id: "emo_tiara_lua",
    p: "emo",
    slot: "hat",
    name: "Tiara da lua",
    ach: "criatura_noite",
    svg: () =>
      `<path d="M26 44Q60 22 94 44" fill="none" stroke="#B8975A" stroke-width="3"/><circle cx="60" cy="18" r="13" fill="#F2EAD3" opacity=".25"/><path d="M64 6A12 12 0 1 0 70 28A9.6 9.6 0 1 1 64 6Z" fill="#F2EAD3" ${O} stroke-width="1.6"/><circle cx="40" cy="36" r="2.2" fill="#C8102E"/><circle cx="80" cy="36" r="2.2" fill="#C8102E"/>` +
      brilhinho(80, 14, 3, "#FFFFFF", 0) +
      brilhinho(42, 20, 2.4, "#F2EAD3", 0.7)
  },
  {
    id: "emo_fio_lagrimas",
    p: "emo",
    slot: "string",
    name: "Fio de lágrimas",
    ach: "lagrimas_dia",
    svg: () =>
      `<line x1="60" y1="-40" x2="60" y2="19" stroke="#8FB4E8" stroke-width="1.4"/>${[-30, -16, -2, 11]
        .map(
          (y, i) =>
            `<path d="M60 ${y - 4}Q63.4 ${y + 1} 62 ${y + 3}A2.4 2.4 0 0 1 58 ${y + 3}Q56.6 ${y + 1} 60 ${y - 4}Z" fill="#8FD8FF" stroke="#2F4F8F" stroke-width=".7"/>` +
            brilhinho(61, y + 1, 1.2, "#FFFFFF", i * 0.4)
        )
        .join("")}`
  },
  {
    id: "emo_bg_fotolog",
    p: "emo",
    slot: "bg",
    name: "Flash de Fotolog",
    ach: "fotologueiro",
    svg: () =>
      `<circle cx="96" cy="16" r="26" fill="#FFFFFF" opacity=".5"/><circle cx="96" cy="16" r="12" fill="#FFFFFF" opacity=".8"/><g transform="rotate(-10 18 30)"><rect x="4" y="14" width="28" height="32" fill="#fff" stroke="#141416" stroke-width=".8"/><rect x="7" y="17" width="22" height="20" fill="#C9B6FF"/></g><g transform="rotate(8 104 116)"><rect x="90" y="100" width="28" height="32" fill="#fff" stroke="#141416" stroke-width=".8"/><rect x="93" y="103" width="22" height="20" fill="#FF8FCB"/></g><text x="16" y="128" font-size="9" fill="#C8102E" font-family="Caveat,cursive" transform="rotate(-8 16 128)">xoxo</text>` +
      brilhinho(70, 8, 4, "#FFFFFF", 0) +
      brilhinho(112, 40, 3, "#FFD86B", 0.5) +
      brilhinho(10, 70, 3, "#FF8FCB", 1) +
      brilhinho(108, 76, 2.4, "#8FD8FF", 1.3)
  }
);
