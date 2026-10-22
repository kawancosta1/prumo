/*
  Capas desenhadas para livros sem foto de capa: cada livro ganha um estilo (sempre o mesmo para o
  mesmo livro), com título em tipografia própria, moldura e um enfeite. A fonte do estilo também
  aparece na lombada da estante (js/telas/estante.js).
  Para criar um estilo: adicione em ESTILOS_CAPA com fundo(cor), fonte, tamanho e o desenho.
*/
"use strict";

const hashTexto = s => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Quebra o título em linhas de até `max` letras (sem cortar palavras, até 4 linhas). */
function quebrarTitulo(t, max) {
  const linhas = [];
  let atual = "";
  for (const p of t.split(/\s+/)) {
    if ((atual + " " + p).trim().length > max && atual) {
      linhas.push(atual);
      atual = p;
    } else atual = (atual + " " + p).trim();
  }
  if (atual) linhas.push(atual);
  if (linhas.length > 4) {
    linhas.length = 4;
    linhas[3] = linhas[3].slice(0, max - 1) + "…";
  }
  return linhas;
}

/* Cada estilo desenha numa área de 100 x 150 */
const ESTILOS_CAPA = [
  {
    id: "classico",
    fonte: '"Cormorant Garamond", Georgia, serif',
    peso: 700,
    caixa: false,
    letras: 11,
    tinta: "#F2E2B8",
    fundo: c =>
      `<rect width="100" height="150" fill="${c}"/><rect x="6" y="6" width="88" height="138" fill="none" stroke="#D9B86A" stroke-width="1.6"/><rect x="9.5" y="9.5" width="81" height="131" fill="none" stroke="#D9B86A" stroke-width=".6"/><path d="M38 108h24M50 102l3 6-3 6-3-6z" stroke="#D9B86A" fill="#D9B86A" stroke-width=".8"/>`,
    y: 44
  },
  {
    id: "moderno",
    fonte: "Anton, Impact, sans-serif",
    peso: 400,
    caixa: true,
    letras: 9,
    tinta: "#FFFFFF",
    tintaAutor: "#1E1F24",
    fundo: c =>
      `<rect width="100" height="150" fill="#F2F0EC"/><path d="M0 0H100V96L0 120Z" fill="${c}"/><circle cx="78" cy="122" r="12" fill="${c}" opacity=".35"/>`,
    y: 30
  },
  {
    id: "romance",
    fonte: "Caveat, cursive",
    peso: 600,
    caixa: false,
    letras: 12,
    tinta: "#5A1630",
    fundo: c =>
      `<rect width="100" height="150" fill="#FBE3EA"/><circle cx="50" cy="118" r="34" fill="${c}" opacity=".18"/><path d="M50 128l-10-9.4a6 6 0 0 1 10-6.4 6 6 0 0 1 10 6.4z" fill="${c}"/><path d="M8 12q42 -8 84 0" stroke="${c}" fill="none" stroke-width="1.2" opacity=".6"/>`,
    y: 40
  },
  {
    id: "fantasia",
    fonte: '"Pirata One", "Metal Mania", serif',
    peso: 400,
    caixa: false,
    letras: 11,
    tinta: "#F6E7B0",
    fundo: c =>
      `<rect width="100" height="150" fill="#14122A"/><rect width="100" height="150" fill="${c}" opacity=".35"/><path d="M62 104A16 16 0 1 0 74 132A13 13 0 1 1 62 104Z" fill="#F6E7B0"/>${[
        [14, 18],
        [86, 26],
        [20, 96],
        [80, 88],
        [44, 132]
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#fff"/>`)
        .join("")}`,
    y: 40
  },
  {
    id: "pulp",
    fonte: "Bungee, Impact, sans-serif",
    peso: 400,
    caixa: true,
    letras: 8,
    tinta: "#141416",
    yAutor: 104,
    fundo: c =>
      `<rect width="100" height="150" fill="#F2C14E"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M50 112L${-20 + i * 28} 150H${-6 + i * 28}Z" fill="${c}" opacity=".85"/>`).join("")}<rect x="0" y="0" width="100" height="10" fill="${c}"/>`,
    y: 34
  },
  {
    id: "minimal",
    fonte: "Lora, Georgia, serif",
    peso: 700,
    caixa: false,
    letras: 12,
    tinta: "#1E1F24",
    fundo: c =>
      `<rect width="100" height="150" fill="#FFFFFF"/><rect x="0" y="0" width="14" height="150" fill="${c}"/><path d="M26 120h60" stroke="${c}" stroke-width="2"/>`,
    y: 36,
    x: 56
  }
];

/** Estilo fixo de cada livro (pelo título e autor, para o mesmo livro ficar igual em todo lugar). */
const estiloCapa = l => ESTILOS_CAPA[hashTexto((l.titulo || "") + (l.autor || "")) % ESTILOS_CAPA.length];

/** Capa desenhada em SVG, com o título estilizado. */
function capaDesenhada(l, cor) {
  const e = estiloCapa(l);
  const titulo = e.caixa ? (l.titulo || "").toUpperCase() : l.titulo || "";
  const linhas = quebrarTitulo(titulo, e.letras);
  const tam = Math.max(
    9,
    Math.min(e.caixa ? 15 : 17, (104 / Math.max(...linhas.map(x => x.length), 4)) * (e.caixa ? 1.05 : 1.55))
  );
  const x = e.x || 50,
    ancora = "middle";
  const autor = (l.autor || "").split(",")[0].slice(0, 26);
  return `<svg class="capa desenhada" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${e.fundo(cor)}
    <text x="${x}" y="${e.y}" text-anchor="${ancora}" font-family='${e.fonte}' font-weight="${e.peso}" font-size="${tam.toFixed(1)}" fill="${e.tinta}">${linhas.map((t, i) => `<tspan x="${x}" dy="${i ? (tam * 1.05).toFixed(1) : 0}">${esc(t)}</tspan>`).join("")}</text>
    ${autor ? `<text x="${x}" y="${e.yAutor || 140}" text-anchor="${ancora}" font-family="Instrument Sans, sans-serif" font-size="${Math.min(7, 150 / autor.length).toFixed(1)}" letter-spacing=".5" fill="${e.tintaAutor || e.tinta}" opacity=".9">${esc(autor.toUpperCase())}</text>` : ""}
  </svg>`;
}
