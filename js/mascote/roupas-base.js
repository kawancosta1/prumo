/*
  Formas reaproveitadas para desenhar roupas (camiseta, moletom, boné, chapéu...).
*/
"use strict";

/* ---------- guarda-roupa ---------- */
const O = 'stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"';

const SLOTS_EQ = [
  ["hat", "Chapéus"],
  ["hair", "Cabelo"],
  ["face", "Olhos"],
  ["cheek", "Maquiagem"],
  ["mouth", "Boca"],
  ["skin", "Pele"],
  ["neck", "Pescoço"],
  ["top", "Roupas"],
  ["waist", "Cintura"],
  ["pins", "Bottons"],
  ["back", "Costas"],
  ["wrist", "Pulso"],
  ["hand", "Nas mãos"],
  ["pet", "Companheiro"],
  ["string", "Fio"],
  ["bg", "Cenário"]
];

const topBase = c => `<path d="M0 84Q60 98 120 84V150H0Z" fill="${c}"/>`;

const topHem = `<path d="M14 85.5Q60 99 106 85.5" fill="none" ${O}/>`;

const stripesV = (c, step = 12, w = 6, x0 = 4) => {
  let s = "";
  for (let x = x0; x < 120; x += step) s += `<rect x="${x}" y="84" width="${w}" height="66" fill="${c}"/>`;
  return s;
};

const stripesH = (c, step = 10, h = 4, y0 = 92) => {
  let s = "";
  for (let y = y0; y < 150; y += step) s += `<rect x="0" y="${y}" width="120" height="${h}" fill="${c}"/>`;
  return s;
};

const hoodie = c =>
  topBase(c) +
  `<path d="M42 114H78L74 130H46Z" fill="#000" opacity=".18"/><path d="M40 86Q60 104 80 86" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="6"/><path d="M55 92V106M65 92V106" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>` +
  topHem;

const tee = (c, extra = "") =>
  topBase(c) +
  `<path d="M47 88Q60 99 73 88" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3"/>` +
  extra +
  topHem;

const cap = c =>
  `<path d="M28 44Q28 14 60 14Q92 14 92 44Z" fill="${c}" ${O}/><path d="M60 44H108Q111 50 100 51H60Z" fill="${c}" ${O}/><circle cx="60" cy="14.5" r="3" fill="${c}" ${O}/>`;

const glasses = (fill, op = 1) =>
  `<rect x="35" y="57" width="23" height="14" rx="5" fill="${fill}" fill-opacity="${op}" ${O}/><rect x="62" y="57" width="23" height="14" rx="5" fill="${fill}" fill-opacity="${op}" ${O}/><path d="M58 62H62" ${O}/>`;

const flowersOn = (pts, r = 4.2) =>
  pts
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${["#F28AB2", "#F2C14E", "#FFFFFF", "#F27A5E"][i % 4]}" ${O} stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="1.4" fill="#C77700"/>`
    )
    .join("");

const necklacePts = n =>
  Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n,
      x = (1 - t) * (1 - t) * 28 + 2 * t * (1 - t) * 60 + t * t * 92,
      y = (1 - t) * (1 - t) * 84 + 2 * t * (1 - t) * 104 + t * t * 84;
    return [+x.toFixed(1), +y.toFixed(1)];
  });

const H = (x, y, s) => `<g transform="translate(${x} ${y})">${s}</g>`;

/* helpers extras */
const cowboyHat = (c, band = "#4A2E12") =>
  `<path d="M38 36Q34 7 50 9Q60 17 70 9Q86 7 82 36Z" fill="${c}" ${O}/><path d="M39 30Q60 25 81 30" stroke="${band}" stroke-width="4.5" fill="none"/><path d="M5 37Q60 21 115 37Q114 46 101 44Q60 33 19 44Q6 46 5 37Z" fill="${c}" ${O}/>`;

const leatherHat = (c, star = "#E8C24A") =>
  `<path d="M11 43Q60 -16 109 43Q60 26 11 43Z" fill="${c}" ${O}/><path d="M60 13l3 6.3 6.8.8-5 4.6 1.3 6.7-6.1-3.4-6.1 3.4 1.3-6.7-5-4.6 6.8-.8z" fill="${star}" ${O} stroke-width="1.4"/>`;

const beanie = (c, band, stripe) =>
  `<path d="M27 46Q27 9 60 9Q93 9 93 46Z" fill="${c}" ${O}/>${stripe ? `<path d="M30 30Q60 21 90 30" stroke="${stripe}" stroke-width="4.5" fill="none"/><path d="M36 19Q60 12 84 19" stroke="${stripe}" stroke-width="4" fill="none"/>` : `<path d="M40 14V38M50 11V38M60 10V38M70 11V38M80 14V38" stroke="#000" stroke-opacity=".2" stroke-width="2"/>`}<rect x="24" y="38" width="72" height="12" rx="6" fill="${band}" ${O}/>`;

const plaid = (c, dark) =>
  topBase(c) +
  stripesV(dark, 12, 4, 6) +
  stripesH(dark, 12, 4, 90) +
  `<path d="M47 86L58 96L60 89Z" fill="${dark}" ${O}/><path d="M73 86L62 96L60 89Z" fill="${dark}" ${O}/>` +
  topHem;

const jacket = (c, shirt, lap) =>
  topBase(c) +
  `<path d="M50 86L60 112L70 86Z" fill="${shirt}"/><path d="M50 86L60 112L44 106Z" fill="${lap}" ${O}/><path d="M70 86L60 112L76 106Z" fill="${lap}" ${O}/>` +
  topHem;

const vest = (c, shirt) =>
  topBase(shirt) +
  `<path d="M0 84Q30 92 47 92L52 150H0Z" fill="${c}" ${O}/><path d="M120 84Q90 92 73 92L68 150H120Z" fill="${c}" ${O}/><circle cx="44" cy="110" r="1.6" fill="#E8C24A"/><circle cx="76" cy="110" r="1.6" fill="#E8C24A"/>`;

const chainN = (c, w = 3.6, pend = "") =>
  `<path d="M29 84Q60 106 91 84" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${w * 0.9} ${w * 0.45}" stroke-linecap="round"/>${pend}`;

const neckBand = (c, dots = "#fff") =>
  `<path d="M31 82Q60 96 89 82L60 111Z" fill="${c}" ${O}/><circle cx="52" cy="93" r="1.6" fill="${dots}"/><circle cx="66" cy="93" r="1.6" fill="${dots}"/><circle cx="60" cy="101" r="1.6" fill="${dots}"/>`;

const beads = (c, r = 2.6, n = 11, stroke = true) =>
  necklacePts(n)
    .map(
      ([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${stroke ? O.replace("2.4", "1.2") : ""}/>`
    )
    .join("");

const tank = (c, trim, num, numc = "#fff") =>
  `<path d="M0 87H42Q60 112 78 87H120V150H0Z" fill="${c}"/><path d="M14 87H42Q60 112 78 87H106" fill="none" stroke="${trim}" stroke-width="3.2"/><text x="60" y="130" font-size="20" font-weight="900" text-anchor="middle" fill="${numc}" font-family="Anton,Impact,sans-serif">${num}</text>`;

const star5 = (cx, cy, r, c) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      rr = i % 2 ? r * 0.45 : r;
    d += (i ? "L" : "M") + (cx + Math.cos(a) * rr).toFixed(1) + " " + (cy + Math.sin(a) * rr).toFixed(1);
  }
  return `<path d="${d}Z" fill="${c}" ${O} stroke-width="1.6"/>`;
};

const hairSpiky = c =>
  `<path d="M24 50Q20 32 30 25L27 11L42 20L46 5L56 17L64 2L70 17L82 6L84 21L97 16L92 31Q100 39 96 50Q86 37 60 35Q34 37 24 50Z" fill="${c}" ${O}/>`;

const hairMessy = c =>
  `<path d="M24 47Q17 35 28 30Q25 18 40 19Q44 7 58 13Q70 4 79 16Q93 13 92 28Q103 34 96 47Q84 35 60 35Q36 35 24 47Z" fill="${c}" ${O}/>`;

const lensPair = (fill, stroke, rx = 5, y = 57, h = 14, op = 1) =>
  `<rect x="35" y="${y}" width="23" height="${h}" rx="${rx}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="2.4"/><rect x="62" y="${y}" width="23" height="${h}" rx="${rx}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="2.4"/><path d="M58 ${y + 5}H62" stroke="${stroke}" stroke-width="2.4"/>`;

const mustache = c =>
  `<path d="M47 74Q53.5 69 60 72.5Q66.5 69 73 74Q68 79.5 60 75.5Q52 79.5 47 74Z" fill="${c}" ${O} stroke-width="1.8"/>`;

const guitar = (c, neck = "#5A3A22", hole = false) =>
  `<g transform="rotate(-38)"><rect x="-1.9" y="-27" width="3.8" height="20" fill="${neck}" ${O} stroke-width="1.4"/><rect x="-3.2" y="-31" width="6.4" height="5" rx="1" fill="${neck}"/><path d="M0 -9C8 -9 9 -3 6 0C10 3 9 11 0 11C-9 11 -10 3 -6 0C-9 -3 -8 -9 0 -9Z" fill="${c}" ${O} stroke-width="1.8"/>${hole ? `<circle cy="1" r="2.6" fill="#2B1D12"/>` : `<rect x="-3.5" y="2" width="7" height="2.2" fill="#222"/>`}</g>`;

/* ---------- mundo emo: itens extras ---------- */
const BAT =
  "M0 -3Q2.5 -8 3.5 -3.5Q9 -8.5 15 -4Q12 0 13 4.5Q9 2 7 5.5Q4 2.5 2 4.5Q1 2.5 0 3.5Q-1 2.5 -2 4.5Q-4 2.5 -7 5.5Q-9 2 -13 4.5Q-12 0 -15 -4Q-9 -8.5 -3.5 -3.5Q-2.5 -8 0 -3Z";

const bat = (x, y, s = 1, c = "#141416") =>
  `<path d="${BAT}" fill="${c}" transform="translate(${x} ${y}) scale(${s})"/>`;

const rose = (x, y, r = 4.5, c = "#A3102A") =>
  `<g transform="translate(${x} ${y})"><path d="M-3 ${r * 0.6}Q-${r * 1.6} ${r * 1.4} -${r * 1.7} ${r * 0.3}Q-${r} ${r * 0.2} -2 ${r * 0.9}Z" fill="#2E5A2A"/><circle r="${r}" fill="${c}" stroke="#3A0610" stroke-width="1"/><path d="M-${r * 0.5} 0A${r * 0.5} ${r * 0.5} 0 1 1 0 ${r * 0.5}M-${r * 0.2} -${r * 0.6}Q${r * 0.7} -${r * 0.5} ${r * 0.6} ${r * 0.2}" fill="none" stroke="#3A0610" stroke-width=".9"/></g>`;

const emoBangs = (c, streak) =>
  `<path d="M21 55Q22 21 60 20Q95 21 99 50Q91 44 85 53Q79 67 66 77Q73 61 66 51Q50 41 34 47Q25 49 21 55Z" fill="${c}" ${O}/>${streak ? `<path d="M70 26Q84 32 86 52Q80 62 72 70" stroke="${streak}" stroke-width="5" fill="none" stroke-linecap="round"/>` : ""}`;

const ITEMS = []; // cada arquivo em mundos/ adiciona seus itens aqui
