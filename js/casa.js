/*
  Casa da leitura: além do quarto (js/quarto.js), a estante pode ficar em outros cômodos.
  Cada cômodo é comprado com "páginas" (a moeda da leitura) e tem opções de decoração grátis.
  Alguns só aparecem num mundo (cripta no emo, estúdio no rock) e a biblioteca secreta abre com 1.000 páginas.

  Onde fica em S: S.leitura.decor.casa = { comodo: "sala", tem: ["sala"], opcoes: { sala: { sofa: "verde" } } }
  (vai junto com a decoração na vitrine, então os amigos veem o cômodo escolhido).

  Para criar um cômodo: adicione em COMODOS com id, nome, preco (ou libera), mundo (opcional), opcoes e desenho(ctx).
  ctx traz W e H do desenho, chaoY (onde começa o chão), a escolha de cada opção (ctx.op.nome)
  e as funções leitor(x, y, tamanho) e estante(x?) que encaixam o Prumi lendo e a estante.
*/
"use strict";

const BIBLIOTECA_PAGINAS = 1000; // páginas ganhas para abrir a biblioteca secreta

/** Hora do dia para o céu: dia, tarde (pôr do sol) ou noite. */
function horaDoCeu(data = new Date()) {
  const h = data.getHours();
  return h >= 6 && h < 17 ? "dia" : h >= 17 && h < 19 ? "tarde" : "noite";
}
const CEUS = {
  dia: ["#8FC7F2", "#D7EEFB"],
  tarde: ["#F28C5B", "#FBD38D"],
  noite: ["#0F1B3D", "#2B3B6E"]
};
/** Céu com sol, pôr do sol ou lua e estrelas, conforme a hora. */
function ceuSVG(id, w, h, hora = horaDoCeu()) {
  const [a, b] = CEUS[hora];
  let astro = "";
  if (hora === "dia")
    astro = `<circle cx="${w * 0.78}" cy="${h * 0.28}" r="16" fill="#FFE27A"/><circle cx="${w * 0.78}" cy="${h * 0.28}" r="24" fill="#FFE27A" opacity=".25"/>`;
  if (hora === "tarde") astro = `<circle cx="${w * 0.7}" cy="${h * 0.86}" r="22" fill="#FF7A45"/>`;
  if (hora === "noite")
    astro =
      `<circle cx="${w * 0.78}" cy="${h * 0.26}" r="12" fill="#F2EAD3"/><circle cx="${w * 0.78 + 5}" cy="${h * 0.26 - 3}" r="11" fill="${a}"/>` +
      Array.from(
        { length: 22 },
        (_, i) =>
          `<circle class="pisca-casa" style="animation-delay:${(i % 7) * 0.4}s" cx="${(i * 47) % w}" cy="${((i * 29) % (h * 0.8)).toFixed(0)}" r="${i % 3 ? 0.9 : 1.4}" fill="#fff"/>`
      ).join("");
  const nuvens =
    hora === "noite"
      ? ""
      : `<g fill="#fff" opacity="${hora === "dia" ? 0.9 : 0.55}"><ellipse cx="${w * 0.22}" cy="${h * 0.3}" rx="26" ry="9"/><ellipse cx="${w * 0.22 + 16}" cy="${h * 0.3 - 6}" rx="16" ry="9"/><ellipse cx="${w * 0.5}" cy="${h * 0.18}" rx="20" ry="7"/></g>`;
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>${astro}${nuvens}`;
}

/* ---------- peças reaproveitadas ---------- */
/** Escurece uma cor #rrggbb (f = 0.8 deixa 20% mais escura). */
const escurecer = (hex, f = 0.75) =>
  "#" +
  [1, 3, 5]
    .map(i =>
      Math.round(parseInt(hex.slice(i, i + 2), 16) * f)
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
function pisoVolumetrico(w, h, cor, linha) {
  const altT = 12;
  const numTabuas = Math.ceil(h / altT);
  let tabuas = "";
  for (let i = 0; i < numTabuas; i++) {
    const y = i * altT;
    const variacao = i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    tabuas += `<rect x="0" y="${y}" width="${w}" height="${altT}" fill="${cor}"/>`;
    tabuas += `<rect x="0" y="${y}" width="${w}" height="${altT}" fill="${variacao}"/>`;
    tabuas += `<line x1="0" y1="${y + 0.8}" x2="${w}" y2="${y + 0.8}" stroke="#FFFFFF" stroke-opacity="0.20" stroke-width="0.8"/>`;
    tabuas += `<line x1="0" y1="${y + altT}" x2="${w}" y2="${y + altT}" stroke="${linha}" stroke-width="1.2" stroke-opacity="0.75"/>`;
    const vx = (i * 79) % Math.max(10, w - 80);
    tabuas += `<path d="M${vx} ${y + 5}Q${vx + 34} ${y + 2.5} ${vx + 68} ${y + 6.5}" stroke="${linha}" stroke-opacity="0.28" stroke-width="0.7" fill="none"/>`;
  }
  for (let i = 0; i < 24; i++) {
    const row = Math.floor(i / 6);
    const y = row * altT;
    const x = ((i * 67) + (row % 2 ? 33 : 0)) % w;
    tabuas += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + altT}" stroke="${linha}" stroke-width="1.2" stroke-opacity="0.65"/>`;
    tabuas += `<line x1="${x + 0.8}" y1="${y}" x2="${x + 0.8}" y2="${y + altT}" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="0.6"/>`;
  }
  return `<g class="piso-volumetrico">${tabuas}<rect width="${w}" height="${h}" fill="rgba(0,0,0,0.08)" pointer-events="none"/></g>`;
}
const piso = (w, h, cor, linha) => pisoVolumetrico(w, h, cor, linha);
const vasoPlanta = (x, y, s = 1, cor = "#C4683A") => {
  const metaAgua = typeof waterToday === "function" && typeof S !== "undefined" && waterToday() >= (S.waterGoal || 2000);
  const flores = metaAgua && typeof florzinhasPlantaSVG === "function" ? florzinhasPlantaSVG() : "";
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-8 0H8L6 14H-6Z" fill="${cor}" stroke="#141416" stroke-width="1"/><path d="M0 0Q-10 -12 -14 -20M0 0Q2 -16 -2 -26M0 0Q10 -10 14 -18" stroke="#3F7A3A" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="-14" cy="-20" rx="5" ry="3" fill="#5FA05A" transform="rotate(-30 -14 -20)"/><ellipse cx="-2" cy="-26" rx="3" ry="5" fill="#5FA05A"/><ellipse cx="14" cy="-18" rx="5" ry="3" fill="#5FA05A" transform="rotate(30 14 -18)"/>${flores}</g>`;
};
const caneca = (x, y, cor = "#E0312F") =>
  `<g transform="translate(${x} ${y})"><path d="M-5 -8H5V2Q5 5 0 5Q-5 5 -5 2Z" fill="${cor}" stroke="#141416" stroke-width="1"/><path d="M5 -5Q9 -5 9 -2Q9 1 5 1" fill="none" stroke="#141416" stroke-width="1.2"/><path class="vapor-casa" d="M-2 -11Q-4 -15 -2 -19M2 -11Q4 -16 2 -21" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
const lombadas = (x, y, w, h, seed = 1) => {
  // fileira de livros de fundo (não são os seus: só decoração)
  const cores = ["#7A2E2E", "#2E4A7A", "#3F6A3A", "#8A6A2A", "#5A3A6A", "#2A5A5A", "#A04A2A"];
  let s = "",
    cx = x,
    i = seed;
  while (cx < x + w - 4) {
    const lw = 4 + ((i * 7) % 5),
      lh = h - ((i * 5) % 9);
    s += `<rect x="${cx}" y="${y + h - lh}" width="${lw}" height="${lh}" fill="${cores[i % cores.length]}" stroke="#141416" stroke-width=".4"/>`;
    cx += lw + 0.6;
    i++;
  }
  return s;
};

/** Feixe de luz volumétrico dinâmico com partículas de poeira dourada flutuando (estilo Sótão) */
function feixeLuzVolumetricoSVG({ id, x1, y1, x2, chaoY, hora = horaDoCeu(), motes = 7 }) {
  const isNoite = hora === "noite";
  const isTarde = hora === "tarde";
  const moteColor = isNoite ? "#E0E7FF" : isTarde ? "#FED7AA" : "#FEF08A";
  const beamGrad = isNoite
    ? `<stop offset="0%" stop-color="#C7D2FE" stop-opacity="0.32"/><stop offset="50%" stop-color="#818CF8" stop-opacity="0.14"/><stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/>`
    : isTarde
      ? `<stop offset="0%" stop-color="#FBD38D" stop-opacity="0.44"/><stop offset="50%" stop-color="#F28C5B" stop-opacity="0.18"/><stop offset="100%" stop-color="#FF7A45" stop-opacity="0"/>`
      : `<stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.42"/><stop offset="45%" stop-color="#FFEAA7" stop-opacity="0.22"/><stop offset="85%" stop-color="#FDCB6E" stop-opacity="0.06"/><stop offset="100%" stop-color="#FAD390" stop-opacity="0"/>`;

  let motesSvg = "";
  for (let i = 0; i < motes; i++) {
    const prog = (i + 1) / (motes + 1);
    const mx = x1 + (x2 - x1) * prog + ((i % 3) - 1) * 14;
    const my = y1 + (chaoY - y1) * prog + ((i % 2) - 0.5) * 12;
    const r = i % 3 === 0 ? 1.4 : i % 2 === 0 ? 1.0 : 1.2;
    motesSvg += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${r}" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:${(i * 0.7).toFixed(1)}s"/>`;
  }

  return `
    <defs>
      <linearGradient id="${id}-feixe-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        ${beamGrad}
      </linearGradient>
    </defs>
    <g class="sotao-feixe-grupo" pointer-events="none">
      <polygon points="${x1},${y1} ${x1 + 40},${y1} ${x2 + 75},${chaoY + 12} ${x2 - 35},${chaoY + 12}" fill="url(#${id}-feixe-grad)" class="cenario-feixe-luz"/>
      <polygon points="${x1 + 8},${y1 + 4} ${x1 + 32},${y1 + 4} ${x2 + 45},${chaoY + 8} ${x2 - 10},${chaoY + 8}" fill="url(#${id}-feixe-grad)" opacity="0.6" class="cenario-feixe-luz"/>
      <ellipse cx="${x2 + 20}" cy="${chaoY + 16}" rx="65" ry="14" fill="${isNoite ? '#818CF8' : '#FFEAA7'}" opacity="${isNoite ? 0.08 : 0.16}"/>
      <g class="sotao-motes">
        ${motesSvg}
      </g>
    </g>
  `;
}

/** Vitrola Vintage 1930 interativa com som analógico para todas as salas */
function vitrolaVintageCasa(x, y) {
  return `
    <g class="sotao-vitrola-canto" transform="translate(${x} ${y})" data-act="vitrola-tocar" style="cursor:pointer;" role="button" tabindex="0" title="Vitrola 1930 (Toque para ouvir o disco de vinil)">
      <ellipse cx="24" cy="46" rx="16" ry="3.5" fill="#140D07" opacity="0.45"/>
      <rect x="10" y="36" width="28" height="9" rx="1.5" fill="#4E2711" stroke="#231006" stroke-width="0.8"/>
      <line x1="13" y1="45" x2="13" y2="47" stroke="#231006" stroke-width="1.6"/>
      <line x1="35" y1="45" x2="35" y2="47" stroke="#231006" stroke-width="1.6"/>
      <g transform="translate(0 -6)">
        ${typeof desenharVitrolaSVG === "function" ? desenharVitrolaSVG({ interativo: false }) : ""}
      </g>
    </g>
  `;
}

/** Rodapé arquitetônico clássico entalhado */
function rodapeVintage(w, chaoY, cor = "#4A331E") {
  return `
    <g class="sotao-rodape" pointer-events="none">
      <rect x="0" y="${chaoY - 14}" width="${w}" height="14" fill="${cor}"/>
      <line x1="0" y1="${chaoY - 14}" x2="${w}" y2="${chaoY - 14}" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="0.8"/>
      <rect x="0" y="${chaoY - 11}" width="${w}" height="3" fill="#FFFFFF" fill-opacity="0.09"/>
      <line x1="0" y1="${chaoY}" x2="${w}" y2="${chaoY}" stroke="#140D07" stroke-width="1.2" stroke-opacity="0.75"/>
    </g>
  `;
}

/* ---------- os cômodos ---------- */
const COMODOS = [
  {
    id: "quarto",
    nome: "Quarto",
    preco: 0,
    desc: "Onde tudo começou. Decore em Decorar."
  },
  {
    id: "sala",
    nome: "Sala",
    preco: 150,
    desc: "Sofá vintage, abajur clássico com luz quente e janela com feixe de sol.",
    opcoes: {
      sofa: {
        nome: "Sofá",
        valores: [
          ["vermelho", "#9E2A2B"],
          ["musgo", "#4F6D38"],
          ["azul", "#2B4C7E"],
          ["mostarda", "#C98A1E"]
        ]
      },
      parede: {
        nome: "Parede",
        valores: [
          ["areia", "#E8D8C0"],
          ["salvia", "#BFCDB4", "Sálvia"],
          ["cinza", "#CACAD2"],
          ["vinho", "#65232D"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op, id } = c;
      const hora = horaDoCeu();
      const isNoite = hora === "noite";
      const isTarde = hora === "tarde";
      const ceuCores = CEUS[hora] || CEUS.dia;
      const sofa = op.sofa;
      const escuro = escurecer(sofa, 0.68);
      const luzSofa = escurecer(sofa, 1.25) || "#FFFFFF";

      const defs = `
        <defs>
          <linearGradient id="${id}-parede-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${escurecer(op.parede, 1.15)}"/>
            <stop offset="65%" stop-color="${op.parede}"/>
            <stop offset="100%" stop-color="${escurecer(op.parede, 0.85)}"/>
          </linearGradient>
          <linearGradient id="${id}-boiserie-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#EFE6D8"/>
            <stop offset="100%" stop-color="#D8CCB8"/>
          </linearGradient>
          <linearGradient id="${id}-janela-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${ceuCores[0]}"/>
            <stop offset="100%" stop-color="${ceuCores[1]}"/>
          </linearGradient>
          <radialGradient id="${id}-abajur-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFF7CD" stop-opacity="0.65"/>
            <stop offset="35%" stop-color="#FDE047" stop-opacity="0.3"/>
            <stop offset="70%" stop-color="#EAB308" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#CA8A04" stop-opacity="0"/>
          </radialGradient>
        </defs>
      `;

      let boiserie = "";
      for (let bx = 16; bx < W - 20; bx += 58) {
        boiserie += `
          <rect x="${bx}" y="${chaoY - 60}" width="50" height="44" rx="2" fill="none" stroke="#C4B59D" stroke-width="1.2"/>
          <rect x="${bx + 3}" y="${chaoY - 57}" width="44" height="38" rx="1.5" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.45"/>
        `;
      }

      const jw = 74, jh = 76, jx = 210, jy = 16;
      const janela = `
        <g class="sala-janela-grupo">
          <rect x="${jx}" y="${jy}" width="${jw}" height="${jh}" rx="3" fill="#3D2916" stroke="#25170B" stroke-width="1.2"/>
          <rect x="${jx + 3}" y="${jy + 3}" width="${jw - 6}" height="${jh - 6}" rx="2" fill="url(#${id}-janela-ceu)"/>
          ${isNoite ? `<circle cx="${jx + 50}" cy="${jy + 22}" r="6" fill="#F4EEDC"/><circle cx="${jx + 53}" cy="${jy + 20}" r="5" fill="${ceuCores[0]}"/>` : `<circle cx="${jx + 50}" cy="${jy + 24}" r="7" fill="${isTarde ? '#FF7A45' : '#FFE27A'}"/>`}
          <line x1="${jx + jw / 2}" y1="${jy + 3}" x2="${jx + jw / 2}" y2="${jy + jh - 3}" stroke="#5C3F24" stroke-width="2.4"/>
          <line x1="${jx + 3}" y1="${jy + jh * 0.45}" x2="${jx + jw - 3}" y2="${jy + jh * 0.45}" stroke="#5C3F24" stroke-width="2"/>
          <path d="M${jx - 4} ${jy - 4} Q${jx + 8} ${jy + jh * 0.4} ${jx - 2} ${jy + jh + 4} L${jx - 8} ${jy + jh + 4} Q${jx - 10} ${jy + jh * 0.5} ${jx - 8} ${jy - 4} Z" fill="#8B2635" stroke="#50121B" stroke-width="0.8"/>
          <path d="M${jx + jw + 4} ${jy - 4} Q${jx + jw - 8} ${jy + jh * 0.4} ${jx + jw + 2} ${jy + jh + 4} L${jx + jw + 8} ${jy + jh + 4} Q${jx + jw + 10} ${jy + jh * 0.5} ${jx + jw + 8} ${jy - 4} Z" fill="#8B2635" stroke="#50121B" stroke-width="0.8"/>
          <line x1="${jx - 14}" y1="${jy - 4}" x2="${jx + jw + 14}" y2="${jy - 4}" stroke="#C59B27" stroke-width="2.5"/>
          <circle cx="${jx - 14}" cy="${jy - 4}" r="3" fill="#D4AF37"/>
          <circle cx="${jx + jw + 14}" cy="${jy - 4}" r="3" fill="#D4AF37"/>
        </g>
      `;

      const quadro = `
        <g transform="translate(68 24)">
          <rect width="84" height="60" rx="3" fill="#5A3A1E" stroke="#3A220F" stroke-width="1.8"/>
          <rect x="3" y="3" width="78" height="54" rx="2" fill="#D4AF37" stroke="#A68018" stroke-width="1.2"/>
          <rect x="7" y="7" width="70" height="46" fill="#87CEEB"/>
          <path d="M7 47 L28 24 L48 38 L62 26 L77 44 V53 H7 Z" fill="#4A7C38"/>
          <path d="M26 36 L40 22 L56 34 L68 25 L77 36 V53 H26 Z" fill="#386228" opacity="0.6"/>
          <circle cx="62" cy="18" r="6" fill="#FFE87A"/>
          <polygon points="7,7 28,7 18,53 7,53" fill="#FFFFFF" opacity="0.14"/>
        </g>
      `;

      const tapete = `
        <g transform="translate(100 ${chaoY + 30})">
          <ellipse cx="0" cy="0" rx="98" ry="16" fill="#4A1E24" stroke="#2D0F14" stroke-width="1.2"/>
          <ellipse cx="0" cy="0" rx="88" ry="13" fill="#D8C8A8" stroke="#B8A480" stroke-width="0.8"/>
          <ellipse cx="0" cy="0" rx="76" ry="10" fill="#8B2635"/>
          <ellipse cx="0" cy="0" rx="60" ry="7" fill="#D8C8A8" opacity="0.85"/>
        </g>
      `;

      const sofaSvg = `
        <g transform="translate(42 ${chaoY - 72})">
          <rect x="8" y="0" width="124" height="46" rx="10" fill="${escuro}" stroke="#141416" stroke-width="1.4"/>
          <path d="M38 4V44M68 4V44M98 4V44" stroke="${escurecer(sofa, 0.5)}" stroke-width="1.4" opacity="0.7"/>
          <rect x="0" y="32" width="140" height="34" rx="9" fill="${sofa}" stroke="#141416" stroke-width="1.4"/>
          <line x1="4" y1="34" x2="136" y2="34" stroke="${luzSofa}" stroke-width="1" opacity="0.4"/>
          <rect x="-4" y="20" width="24" height="46" rx="9" fill="${escuro}" stroke="#141416" stroke-width="1.4"/>
          <rect x="120" y="20" width="24" height="46" rx="9" fill="${escuro}" stroke="#141416" stroke-width="1.4"/>
          <polygon points="10,66 14,75 8,75" fill="#3A220F"/>
          <polygon points="130,66 134,75 128,75" fill="#3A220F"/>
          <path d="M78 30 Q86 46 82 65 L102 65 Q106 46 98 30 Z" fill="#E8DCC0" stroke="#BAAA8A" stroke-width="0.8"/>
          <rect x="100" y="14" width="26" height="22" rx="6" fill="#F2EDE4" stroke="#141416" stroke-width="1" transform="rotate(8 113 25)"/>
          <circle cx="113" cy="25" r="2.2" fill="#BAAA8A"/>
        </g>
      `;

      const abajur = `
        <g transform="translate(24 ${chaoY - 118})">
          <circle cx="0" cy="18" r="38" fill="url(#${id}-abajur-glow)" pointer-events="none"/>
          <path d="M-15 0 H15 L10 24 H-10 Z" fill="#F8E7B9" stroke="#141416" stroke-width="1.2"/>
          ${Array.from({ length: 9 }, (_, i) => `<line x1="${-9 + i * 2.2}" y1="24" x2="${-9 + i * 2.2}" y2="28" stroke="#D4AF37" stroke-width="1"/>`).join("")}
          <path d="M0 24 V118" stroke="#5A4A38" stroke-width="2.6"/>
          <ellipse cx="0" cy="118" rx="14" ry="3.5" fill="#3D3024" stroke="#1E160E" stroke-width="1"/>
        </g>
      `;

      const feixe = feixeLuzVolumetricoSVG({ id, x1: jx + 10, y1: jy + 10, x2: 120, chaoY, hora, motes: 8 });
      const vitrola = vitrolaVintageCasa(10, chaoY - 48);
      const rodape = rodapeVintage(W, chaoY, "#4A331E");

      return `
        ${defs}
        <rect width="${W}" height="${chaoY}" fill="url(#${id}-parede-grad)"/>
        <rect x="0" y="0" width="${W}" height="6" fill="#4A331E"/>
        <line x1="0" y1="6" x2="${W}" y2="6" stroke="#D4AF37" stroke-width="0.8" opacity="0.6"/>
        <rect x="0" y="${chaoY - 64}" width="${W}" height="50" fill="url(#${id}-boiserie-grad)"/>
        <line x1="0" y1="${chaoY - 64}" x2="${W}" y2="${chaoY - 64}" stroke="#C4B59D" stroke-width="1.6"/>
        ${boiserie}
        ${janela}
        ${quadro}
        <g transform="translate(0 ${chaoY})">${piso(W, 64, "#9E6B3E", "#7A4D26")}</g>
        ${rodape}
        ${tapete}
        ${sofaSvg}
        ${abajur}
        ${vitrola}
        ${c.leitor(66, chaoY - 118)}
        ${c.estante()}
        ${feixe}
      `;
    }
  },
  {
    id: "cozinha",
    nome: "Cozinha",
    preco: 150,
    desc: "Livros de receita, caneca fumegando e plantinhas na janela.",
    opcoes: {
      azulejo: {
        nome: "Azulejo",
        valores: [
          ["portugues", "#2F5DA8", "Português"],
          ["metro", "#6FA58A", "Metrô"],
          ["xadrez", "#C0392B"]
        ]
      },
      armario: {
        nome: "Armários",
        valores: [
          ["madeira", "#A8784A"],
          ["branco", "#EFEDE6"],
          ["menta", "#9FD4BE"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op, id } = c;
      const hora = horaDoCeu();
      const isNoite = hora === "noite";
      const isTarde = hora === "tarde";
      const ceuCores = CEUS[hora] || CEUS.dia;
      const az = op.azulejo, arm = op.armario;
      const armEscuro = escurecer(arm, 0.7);

      const defs = `
        <defs>
          <linearGradient id="${id}-parede-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FDFBF7"/>
            <stop offset="100%" stop-color="#EFE8DA"/>
          </linearGradient>
          <linearGradient id="${id}-janela-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${ceuCores[0]}"/>
            <stop offset="100%" stop-color="${ceuCores[1]}"/>
          </linearGradient>
          <linearGradient id="${id}-bancada-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E8E2D5"/>
            <stop offset="50%" stop-color="#D5CEBF"/>
            <stop offset="100%" stop-color="#B8B0A0"/>
          </linearGradient>
        </defs>
      `;

      let azulejos = "";
      for (let y = 92; y < chaoY - 70; y += 14) {
        for (let x = 0; x < 216; x += 14) {
          if (c.escolha.azulejo === "xadrez") {
            if (((x + y) / 14) % 2 >= 1) {
              azulejos += `<rect x="${x}" y="${y}" width="14" height="14" fill="${az}"/><line x1="${x}" y1="${y}" x2="${x + 14}" y2="${y}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.6"/>`;
            }
          } else if (c.escolha.azulejo === "portugues") {
            azulejos += `<rect x="${x + 1}" y="${y + 1}" width="12" height="12" fill="none" stroke="${az}" stroke-width=".8"/><circle cx="${x + 7}" cy="${y + 7}" r="3" fill="none" stroke="${az}" stroke-width="1"/><circle cx="${x + 7}" cy="${y + 7}" r="0.8" fill="${az}"/>`;
          } else {
            azulejos += `<rect x="${x + 0.5}" y="${y + 0.5}" width="13" height="6" rx="1" fill="${az}" opacity=".65"/><line x1="${x + 1}" y1="${y + 1}" x2="${x + 13}" y2="${y + 1}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="0.5"/><rect x="${x + 7.5}" y="${y + 7.5}" width="13" height="6" rx="1" fill="${az}" opacity=".65"/>`;
          }
        }
      }

      // Janela cottage arqueada
      const jx = 226, jy = 20, jw = 82, jh = 68;
      const janela = `
        <g class="cozinha-janela-grupo">
          <path d="M${jx} ${jy + jh} V${jy + 20} Q${jx + jw / 2} ${jy - 8} ${jx + jw} ${jy + 20} V${jy + jh} Z" fill="#4A341E" stroke="#2B1A0C" stroke-width="1.4"/>
          <path d="M${jx + 3} ${jy + jh - 3} V${jy + 21} Q${jx + jw / 2} ${jy - 5} ${jx + jw - 3} ${jy + 21} V${jy + jh - 3} Z" fill="url(#${id}-janela-ceu)"/>
          ${isNoite ? `<circle cx="${jx + 56}" cy="${jy + 22}" r="6" fill="#F4EEDC"/><circle cx="${jx + 59}" cy="${jy + 20}" r="5" fill="${ceuCores[0]}"/>` : `<circle cx="${jx + 56}" cy="${jy + 24}" r="7" fill="${isTarde ? '#FF7A45' : '#FFE27A'}"/>`}
          <line x1="${jx + jw / 2}" y1="${jy + 6}" x2="${jx + jw / 2}" y2="${jy + jh - 3}" stroke="#5C3F24" stroke-width="2.2"/>
          <line x1="${jx + 3}" y1="${jy + 36}" x2="${jx + jw - 3}" y2="${jy + 36}" stroke="#5C3F24" stroke-width="2"/>
          <!-- Cortina xadrez com nózinho -->
          <path d="M${jx + 2} ${jy + 16} Q${jx + 16} ${jy + 28} ${jx + 6} ${jy + 46} L${jx + 1} ${jy + 46} Z" fill="#C0392B" opacity="0.8"/>
          <path d="M${jx + jw - 2} ${jy + 16} Q${jx + jw - 16} ${jy + 28} ${jx + jw - 6} ${jy + 46} L${jx + jw - 1} ${jy + 46} Z" fill="#C0392B" opacity="0.8"/>
          <!-- Floreira com ervas aromáticas -->
          <rect x="${jx - 2}" y="${jy + jh - 8}" width="${jw + 4}" height="10" rx="2" fill="#754823" stroke="#3D220E" stroke-width="1"/>
          ${vasoPlanta(jx + 18, jy + jh - 10, 0.75, "#C4683A")}
          ${vasoPlanta(jx + 58, jy + jh - 10, 0.65, "#4F7A5A")}
        </g>
      `;

      // Armários superiores estilo shaker
      const armarios = `
        <g transform="translate(16 16)">
          ${[0, 1, 2]
            .map(
              i => `
            <g transform="translate(${i * 64} 0)">
              <rect width="60" height="58" rx="2" fill="${arm}" stroke="#2B1A0C" stroke-width="1.2"/>
              <rect x="5" y="5" width="50" height="48" rx="1.5" fill="none" stroke="${armEscuro}" stroke-width="1.2"/>
              <circle cx="52" cy="48" r="2.2" fill="#C59B27" stroke="#684E0B" stroke-width="0.6"/>
              <line x1="2" y1="2" x2="58" y2="2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.8"/>
            </g>
          `
            )
            .join("")}
        </g>
      `;

      // Piso quadriculado retrô
      let pisoCozinha = `<g transform="translate(0 ${chaoY})">`;
      pisoCozinha += `<rect width="${W}" height="64" fill="#E8DEC8"/>`;
      for (let py = 0, idx = 0; py < 64; py += 16, idx++) {
        for (let px = idx % 2 ? 16 : 0; px < W; px += 32) {
          pisoCozinha += `<rect x="${px}" y="${py}" width="16" height="16" fill="#A89A84"/><line x1="${px}" y1="${py}" x2="${px + 16}" y2="${py}" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="0.6"/>`;
        }
      }
      pisoCozinha += `</g>`;

      // Bancada com chaleira fumegante e caneca
      const bancada = `
        <g transform="translate(0 ${chaoY - 72})">
          <rect x="0" y="0" width="218" height="12" rx="1" fill="url(#${id}-bancada-grad)" stroke="#3D2916" stroke-width="1"/>
          <line x1="0" y1="1" x2="218" y2="1" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="0.8"/>
          <rect x="4" y="12" width="210" height="60" fill="${arm}" stroke="#2B1A0C" stroke-width="1.2"/>
          ${[0, 1, 2]
            .map(
              i => `
            <rect x="${14 + i * 68}" y="20" width="58" height="44" rx="2" fill="none" stroke="${armEscuro}" stroke-width="1"/>
            <rect x="${38 + i * 68}" y="23" width="12" height="2.6" rx="1" fill="#C59B27"/>
          `
            )
            .join("")}
          ${caneca(42, -1)}
          <!-- Chaleira retrô de ferro fundido com vapor -->
          <g transform="translate(156 -18)">
            <ellipse cx="14" cy="14" rx="12" ry="7" fill="#2E2E34" stroke="#141416" stroke-width="1"/>
            <path d="M4 14 Q3 4 14 4 Q25 4 24 14 Z" fill="#3D3D45" stroke="#141416" stroke-width="1"/>
            <path d="M22 8 Q28 6 30 2" stroke="#141416" stroke-width="1.8" fill="none"/>
            <path class="vapor-casa" d="M30 1 Q28 -4 31 -8 M32 0 Q35 -5 33 -10" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.8"/>
            <path d="M8 4 Q14 -4 20 4" stroke="#C59B27" stroke-width="1.4" fill="none"/>
          </g>
        </g>
      `;

      const feixe = feixeLuzVolumetricoSVG({ id, x1: jx + 10, y1: jy + 10, x2: 120, chaoY, hora, motes: 7 });
      const vitrola = vitrolaVintageCasa(10, chaoY - 48);
      const rodape = rodapeVintage(W, chaoY, "#4A331E");

      return `
        ${defs}
        <rect width="${W}" height="${chaoY}" fill="url(#${id}-parede-grad)"/>
        <rect y="92" width="216" height="${chaoY - 164}" fill="#FDFCF8"/>
        ${azulejos}
        ${armarios}
        ${janela}
        ${pisoCozinha}
        ${rodape}
        ${bancada}
        ${vitrola}
        ${c.leitor(78, chaoY - 128, 58)}
        ${c.estante()}
        ${feixe}
      `;
    }
  },
  {
    id: "quintal",
    nome: "Quintal",
    preco: 200,
    desc: "Rede entre as árvores e um céu que muda com a hora.",
    opcoes: {
      lugar: {
        nome: "Onde ler",
        valores: [
          ["rede", "Rede"],
          ["cadeira", "Cadeira de praia"],
          ["toalha", "Toalha na grama"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, escolha, id } = c;
      const hora = horaDoCeu();
      const noite = hora === "noite";
      const isTarde = hora === "tarde";
      const verdeGrama = noite ? "#1F3A22" : isTarde ? "#528536" : "#5DAA42";
      const verdeEscuro = escurecer(verdeGrama, 0.7);

      const tronco = (x, h) => `
        <rect x="${x - 7}" y="${chaoY - h}" width="14" height="${h + 10}" fill="#5A3A1E" stroke="#3A220F" stroke-width="1.2"/>
        <path d="M${x - 4} ${chaoY - h + 10} Q${x} ${chaoY - 10} ${x - 2} ${chaoY}" stroke="#3A220F" stroke-width="0.8" fill="none" opacity="0.6"/>
        <circle cx="${x}" cy="${chaoY - h}" r="38" fill="${noite ? "#1A3520" : isTarde ? "#4A7A34" : "#458C36"}"/>
        <circle cx="${x - 24}" cy="${chaoY - h + 15}" r="26" fill="${noite ? "#23452A" : isTarde ? "#5E9442" : "#55A244"}"/>
        <circle cx="${x + 22}" cy="${chaoY - h + 12}" r="28" fill="${noite ? "#23452A" : isTarde ? "#5E9442" : "#55A244"}"/>
        <circle cx="${x}" cy="${chaoY - h - 10}" r="22" fill="${noite ? "#2E5535" : isTarde ? "#6EA84E" : "#68BA52"}"/>
      `;

      // Varal com lâmpadas vintage (fairy lights) entre as árvores
      const cordaoLuzes = `
        <g class="quintal-luzinhas">
          <path d="M22 ${chaoY - 110} Q115 ${chaoY - 80} 208 ${chaoY - 100}" fill="none" stroke="#2B2B30" stroke-width="1.2"/>
          ${[0, 1, 2, 3, 4]
            .map(i => {
              const lx = 48 + i * 36;
              const ly = chaoY - 96 + Math.sin((i / 4) * Math.PI) * 14;
              return `
              <circle cx="${lx}" cy="${ly + 6}" r="12" fill="#FDE047" opacity="${noite ? 0.35 : 0.15}" class="lampada-casa"/>
              <circle cx="${lx}" cy="${ly + 6}" r="3.2" fill="#FFEAA7" stroke="#D97706" stroke-width="0.6"/>
            `;
            })
            .join("")}
        </g>
      `;

      let lugar = "";
      if (escolha.lugar === "rede") {
        lugar = `
          ${tronco(22, 150)}
          <rect x="202" y="${chaoY - 98}" width="10" height="108" fill="#5A3A1E" stroke="#3A220F" stroke-width="1.2"/>
          <!-- Cordas da rede -->
          <path d="M26 ${chaoY - 92} Q115 ${chaoY - 18} 204 ${chaoY - 92}" fill="none" stroke="#BA9E76" stroke-width="1.6"/>
          <!-- Tecido da rede com franjas artesanais -->
          <path d="M34 ${chaoY - 84} Q115 ${chaoY - 4} 196 ${chaoY - 84} L198 ${chaoY - 72} Q115 ${chaoY + 8} 32 ${chaoY - 72} Z" fill="#9E2A2B" stroke="#141416" stroke-width="1.2"/>
          ${[0, 1, 2, 3, 4]
            .map(
              i => `
            <path d="M${50 + i * 30} ${chaoY - 64 + Math.abs(i - 2) * -7} V${chaoY - 50 + Math.abs(i - 2) * -7}" stroke="#F2C318" stroke-width="3"/>
          `
            )
            .join("")}
          ${c.leitor(84, chaoY - 116, 58)}
        `;
      } else if (escolha.lugar === "cadeira") {
        lugar = `
          ${tronco(30, 140)}
          <g transform="translate(68 ${chaoY - 52})">
            <path d="M0 52 L32 0 M64 52 L46 6" stroke="#8C6A3A" stroke-width="3.2"/>
            <path d="M8 8 L46 4 L54 42 L18 46 Z" fill="#2B4C7E" stroke="#141416" stroke-width="1.2"/>
            ${[0, 1, 2].map(i => `<path d="M${10 + i * 12} 7 L${20 + i * 12} 45" stroke="#FFFFFF" stroke-width="4"/>`).join("")}
          </g>
          ${c.leitor(78, chaoY - 106, 58)}
        `;
      } else {
        lugar = `
          ${tronco(30, 140)}
          <path d="M48 ${chaoY + 12} L192 ${chaoY + 6} L208 ${chaoY + 42} L38 ${chaoY + 48} Z" fill="#9E2A2B" stroke="#141416" stroke-width="1.2"/>
          ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${56 + i * 24} ${chaoY + 11} L${52 + i * 26} ${chaoY + 46}" stroke="#FFFFFF" stroke-width="5" opacity=".85"/>`).join("")}
          ${c.leitor(96, chaoY - 54, 58)}
        `;
      }

      // Cerca rústica de madeira no fundo
      const cerca = `
        <g fill="${noite ? "#3A2A1E" : "#C9A06A"}" stroke="#5A3A1E" stroke-width="0.8">
          ${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 19} ${chaoY - 42} l8 -8 8 8 V${chaoY} H${i * 19} Z"/>`).join("")}
          <rect y="${chaoY - 30}" width="${W}" height="5"/>
          <rect y="${chaoY - 14}" width="${W}" height="5"/>
        </g>
      `;

      // Gramado vivo com tufos de relva e pedras de jardim
      const gramado = `
        <rect y="${chaoY}" width="${W}" height="64" fill="${verdeGrama}"/>
        <line x1="0" y1="${chaoY}" x2="${W}" y2="${chaoY}" stroke="${verdeEscuro}" stroke-width="1.4"/>
        ${Array.from({ length: 35 }, (_, i) => `<path d="M${(i * 37) % W} ${chaoY + 8 + ((i * 13) % 48)} l2 -7 2 7" stroke="${verdeEscuro}" stroke-width="1.4" fill="none"/>`).join("")}
        <!-- Pedras de caminho no jardim -->
        <ellipse cx="60" cy="${chaoY + 48}" rx="14" ry="6" fill="#A89A84" stroke="#7A6E5C" stroke-width="0.8"/>
        <ellipse cx="140" cy="${chaoY + 52}" rx="16" ry="7" fill="#A89A84" stroke="#7A6E5C" stroke-width="0.8"/>
        <ellipse cx="220" cy="${chaoY + 46}" rx="15" ry="6" fill="#A89A84" stroke="#7A6E5C" stroke-width="0.8"/>
      `;

      const vagalumes = noite
        ? Array.from({ length: 8 }, (_, i) => `<circle class="pisca-casa" style="animation-delay:${i * 0.5}s" cx="${30 + i * 42}" cy="${chaoY - 55 + (i % 3) * 20}" r="2" fill="#E8F27A"/>`).join("")
        : "";

      const feixe = feixeLuzVolumetricoSVG({ id, x1: 40, y1: 10, x2: 130, chaoY, hora, motes: 8 });
      const vitrola = vitrolaVintageCasa(10, chaoY - 48);

      return `
        ${ceuSVG(id + "c", W, chaoY + 4, hora)}
        ${cerca}
        ${gramado}
        ${vagalumes}
        ${cordaoLuzes}
        ${lugar}
        ${vitrola}
        ${c.estante()}
        ${feixe}
      `;
    }
  },
  {
    id: "varanda",
    nome: "Varanda",
    preco: 250,
    desc: "Poltrona, plantas e uma vista bonita.",
    opcoes: {
      vista: {
        nome: "Vista",
        valores: [
          ["cidade", "Cidade"],
          ["mar", "Mar"],
          ["montanhas", "Montanhas"]
        ]
      },
      poltrona: {
        nome: "Poltrona",
        valores: [
          ["terracota", "#C4683A"],
          ["verde", "#4F7A5A"],
          ["creme", "#E8DCC0"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, escolha, op, id } = c;
      const hora = horaDoCeu();
      const isNoite = hora === "noite";
      const isTarde = hora === "tarde";
      const ceuH = chaoY - 38;

      let vista = ceuSVG(id + "v", W, ceuH, hora);
      if (escolha.vista === "mar") {
        vista += `
          <rect y="${ceuH - 46}" width="${W}" height="46" fill="${isNoite ? "#16284E" : isTarde ? "#C45A34" : "#2E7BB8"}"/>
          ${[0, 1, 2].map(i => `<path d="M${20 + i * 110} ${ceuH - 30 + i * 8} q8 -4 16 0 t16 0" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity=".6"/>`).join("")}
          <path d="M260 ${ceuH - 46} l10 -14 10 14 Z" fill="#F2F2F2"/>
        `;
      } else if (escolha.vista === "montanhas") {
        vista += `
          <path d="M0 ${ceuH} L60 ${ceuH - 74} L110 ${ceuH - 34} L170 ${ceuH - 96} L240 ${ceuH - 24} L300 ${ceuH - 68} L360 ${ceuH - 28} V${ceuH} Z" fill="${isNoite ? "#1F2B44" : isTarde ? "#8C4E3A" : "#557A98"}"/>
          <path d="M150 ${ceuH - 74} L170 ${ceuH - 96} L188 ${ceuH - 74} Z" fill="#FFFFFF" opacity="0.85"/>
        `;
      } else {
        vista += [0, 1, 2, 3, 4, 5, 6, 7, 8]
          .map(i => {
            const h = 32 + ((i * 37) % 64), x = i * 42;
            let janelas = "";
            for (let y = ceuH - h + 6; y < ceuH - 6; y += 10) {
              for (let jx = x + 6; jx < x + 32; jx += 10) {
                janelas += `<rect x="${jx}" y="${y}" width="4" height="5" fill="${isNoite && (jx + y) % 3 ? "#FFE27A" : "rgba(255,255,255,.3)"}"/>`;
              }
            }
            return `<rect x="${x}" y="${ceuH - h}" width="38" height="${h}" fill="${isNoite ? "#141A2B" : "#657285"}"/>${janelas}`;
          })
          .join("");
      }

      // Guarda-corpo monumental de ferro forjado art-nouveau
      const gradeado = `
        <g class="varanda-grade" stroke="#25262E" stroke-width="2.2">
          <!-- Corrimão de madeira nobre -->
          <rect x="0" y="${chaoY - 56}" width="${W}" height="7" rx="1.5" fill="#5C3B1E" stroke="#3A220F" stroke-width="1"/>
          <line x1="0" y1="${chaoY - 50}" x2="${W}" y2="${chaoY - 50}" stroke="#25262E" stroke-width="2.4"/>
          <line x1="0" y1="${chaoY - 6}" x2="${W}" y2="${chaoY - 6}" stroke="#25262E" stroke-width="2.4"/>
          ${Array.from({ length: 18 }, (_, i) => `
            <line x1="${i * 20 + 10}" y1="${chaoY - 50}" x2="${i * 20 + 10}" y2="${chaoY - 6}"/>
            <!-- Arabesco decorativo -->
            <circle cx="${i * 20 + 10}" cy="${chaoY - 28}" r="4.5" fill="none" stroke="#25262E" stroke-width="1.4"/>
          `).join("")}
        </g>
      `;

      // Piso de lajotas de terracota clássicas
      let pisoTerracota = `<g transform="translate(0 ${chaoY})">`;
      pisoTerracota += `<rect width="${W}" height="64" fill="#B8582E"/>`;
      for (let y = 0; y < 64; y += 16) {
        for (let x = (y / 16) % 2 ? -12 : 0; x < W; x += 24) {
          pisoTerracota += `<rect x="${x}" y="${y}" width="24" height="16" fill="none" stroke="#8A3E1E" stroke-width="1.2"/>`;
          pisoTerracota += `<line x1="${x + 1}" y1="${y + 1}" x2="${x + 23}" y2="${y + 1}" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="0.8"/>`;
        }
      }
      pisoTerracota += `</g>`;

      // Poltrona de vime com almofadão confortável
      const poltrona = `
        <g transform="translate(46 ${chaoY - 68})">
          <rect x="6" y="0" width="102" height="50" rx="16" fill="${op.poltrona}" stroke="#141416" stroke-width="1.4"/>
          <rect x="-6" y="32" width="126" height="34" rx="10" fill="${op.poltrona}" stroke="#141416" stroke-width="1.4"/>
          <!-- Braços de vime com textura -->
          <rect x="-10" y="24" width="22" height="42" rx="9" fill="${escurecer(op.poltrona, 0.78)}" stroke="#141416" stroke-width="1.4"/>
          <rect x="102" y="24" width="22" height="42" rx="9" fill="${escurecer(op.poltrona, 0.78)}" stroke="#141416" stroke-width="1.4"/>
          <!-- Manta de frio jogada -->
          <path d="M28 28 Q44 48 40 66 L60 66 Q64 48 54 28 Z" fill="#E8DCC0" stroke="#BAAA8A" stroke-width="0.8"/>
        </g>
      `;

      const feixe = feixeLuzVolumetricoSVG({ id, x1: 280, y1: 10, x2: 120, chaoY, hora, motes: 8 });
      const vitrola = vitrolaVintageCasa(10, chaoY - 48);

      return `
        ${vista}
        <rect y="${ceuH}" width="${W}" height="38" fill="#E2D8C8"/>
        ${pisoTerracota}
        ${gradeado}
        ${vasoPlanta(12, chaoY - 12, 1.3)}
        ${vasoPlanta(198, chaoY - 10, 1.15, "#4F7A5A")}
        ${poltrona}
        ${vitrola}
        ${c.leitor(70, chaoY - 112, 60)}
        ${caneca(184, chaoY - 4, "#2F6FD6")}
        ${c.estante()}
        ${feixe}
      `;
    }
  },
  {
    id: "escritorio",
    nome: "Escritório",
    preco: 300,
    desc: "Mesa de estudo, abajur e um quadro de recados.",
    opcoes: {
      parede: {
        nome: "Parede",
        valores: [
          ["azul", "#B8CCDE"],
          ["verde", "#2A4535"],
          ["madeira", "#7C5A3A"]
        ]
      },
      luz: {
        nome: "Luz",
        valores: [
          ["quente", "#FFD27A"],
          ["fria", "#CFE6FF"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op, id } = c;
      const hora = horaDoCeu();
      const notas = ["#F2C318", "#8FD3FF", "#FF9EB5", "#9FE29A"];

      const defs = `
        <defs>
          <linearGradient id="${id}-parede-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${escurecer(op.parede, 1.12)}"/>
            <stop offset="100%" stop-color="${op.parede}"/>
          </linearGradient>
          <linearGradient id="${id}-boiserie-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5A3A1E"/>
            <stop offset="100%" stop-color="#3D2411"/>
          </linearGradient>
          <radialGradient id="${id}-banker-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#A7F3D0" stop-opacity="0.7"/>
            <stop offset="35%" stop-color="#34D399" stop-opacity="0.32"/>
            <stop offset="70%" stop-color="#059669" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#047857" stop-opacity="0"/>
          </radialGradient>
        </defs>
      `;

      // Quadro de cortiça clássico com recados
      const quadroAvisos = `
        <g transform="translate(24 24)">
          <rect width="114" height="74" rx="3" fill="#C9A06A" stroke="#4A2E16" stroke-width="4"/>
          <line x1="2" y1="2" x2="112" y2="2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.8"/>
          ${notas
            .map(
              (n, i) => `
            <rect x="${12 + i * 24}" y="${10 + (i % 2) * 24}" width="20" height="18" fill="${n}" transform="rotate(${i % 2 ? 4 : -5} ${22 + i * 24} ${19 + (i % 2) * 24})"/>
            <circle cx="${22 + i * 24}" cy="${12 + (i % 2) * 24}" r="1.8" fill="#E0312F"/>
          `
            )
            .join("")}
          <path d="M14 56 H64 M14 62 H50" stroke="#5A3A1E" stroke-width="1.2"/>
        </g>
      `;

      // Mesa roll-top clássica de carvalho
      const escrivaninha = `
        <g transform="translate(14 ${chaoY - 64})">
          <!-- Tampo da mesa chanfrado -->
          <rect x="0" y="0" width="194" height="12" rx="2" fill="#5E3E22" stroke="#2B1A0C" stroke-width="1.2"/>
          <line x1="2" y1="2" x2="192" y2="2" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="0.8"/>
          <!-- Pés robustos -->
          <rect x="6" y="12" width="10" height="62" fill="#4E3218" stroke="#2B1A0C" stroke-width="1"/>
          <rect x="178" y="12" width="10" height="62" fill="#4E3218" stroke="#2B1A0C" stroke-width="1"/>
          <!-- Gaveteiro clássico com puxadores de concha de latão -->
          <rect x="120" y="12" width="58" height="42" fill="#442A12" stroke="#2B1A0C" stroke-width="1.2"/>
          <line x1="120" y1="26" x2="178" y2="26" stroke="#2B1A0C" stroke-width="1"/>
          <line x1="120" y1="40" x2="178" y2="40" stroke="#2B1A0C" stroke-width="1"/>
          <ellipse cx="149" cy="19" rx="5" ry="2" fill="#C59B27"/>
          <ellipse cx="149" cy="33" rx="5" ry="2" fill="#C59B27"/>
          <ellipse cx="149" cy="47" rx="5" ry="2" fill="#C59B27"/>
          <!-- Luminária banqueiro clássica (Banker's Lamp) -->
          <g transform="translate(152 -46)">
            <circle cx="20" cy="12" r="32" fill="url(#${id}-banker-glow)" pointer-events="none"/>
            <path d="M0 46 V18 L18 8" stroke="#C59B27" stroke-width="2.6" fill="none"/>
            <ellipse cx="20" cy="10" rx="14" ry="6" fill="#047857" stroke="#064E3B" stroke-width="1.2"/>
            <ellipse cx="20" cy="10" rx="11" ry="3.5" fill="#10B981"/>
            <line x1="16" y1="14" x2="16" y2="22" stroke="#C59B27" stroke-width="0.8"/>
            <circle cx="16" cy="23" r="1.4" fill="#C59B27"/>
            <ellipse cx="0" cy="46" rx="10" ry="3.5" fill="#8C6A3A" stroke="#4E3218" stroke-width="1"/>
          </g>
          <!-- Livros e papéis sobre a mesa -->
          <path d="M68 -2 L94 -6 L120 -2 V2 H68 Z" fill="#FDFBF7" stroke="#141416" stroke-width=".8"/>
          <rect x="32" y="-14" width="24" height="14" fill="#2B4C7E" stroke="#141416" stroke-width=".8"/>
          <rect x="34" y="-22" width="20" height="8" fill="#9E2A2B" stroke="#141416" stroke-width=".8"/>
        </g>
      `;

      // Cadeira giratória de escritório vintage
      const cadeira = `
        <g transform="translate(60 ${chaoY - 48})">
          <rect x="0" y="0" width="58" height="12" rx="4" fill="#3D2916" stroke="#25170B" stroke-width="1.2"/>
          <path d="M29 12 V44 M10 44 H48" stroke="#25262E" stroke-width="3.2"/>
        </g>
      `;

      const feixe = feixeLuzVolumetricoSVG({ id, x1: 220, y1: 15, x2: 130, chaoY, hora, motes: 7 });
      const vitrola = vitrolaVintageCasa(10, chaoY - 48);
      const rodape = rodapeVintage(W, chaoY, "#3A220F");

      return `
        ${defs}
        <rect width="${W}" height="${chaoY}" fill="url(#${id}-parede-grad)"/>
        <!-- Boiserie inferior de madeira de lei -->
        <rect x="0" y="${chaoY - 66}" width="${W}" height="52" fill="url(#${id}-boiserie-grad)"/>
        <line x1="0" y1="${chaoY - 66}" x2="${W}" y2="${chaoY - 66}" stroke="#2B1A0C" stroke-width="1.6"/>
        ${quadroAvisos}
        <g transform="translate(0 ${chaoY})">${piso(W, 64, "#6E4E30", "#4E3218")}</g>
        ${rodape}
        ${escrivaninha}
        ${cadeira}
        ${vitrola}
        ${c.leitor(66, chaoY - 124, 58)}
        ${c.estante()}
        ${feixe}
      `;
    }
  },
  {
    id: "sotao",
    nome: "Sótão",
    preco: 350,
    desc: "Teto inclinado, janela redonda, baú e um puff fofo.",
    opcoes: {
      puff: {
        nome: "Puff",
        valores: [
          ["roxo", "#6A4A8C"],
          ["laranja", "#E07A3A"],
          ["cinza", "#7A7A84"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op, id } = c;
      const hora = horaDoCeu();
      const isNoite = hora === "noite";
      const isTarde = hora === "tarde";
      const puffCor = op.puff || "#6A4A8C";
      const puffEscuro = escurecer(puffCor, 0.65);
      const puffLuz = escurecer(puffCor, 1.25) || "#FFFFFF";
      const ceuCores = CEUS[hora] || CEUS.dia;

      const beamGrad = isNoite
        ? `<stop offset="0%" stop-color="#C7D2FE" stop-opacity="0.32"/><stop offset="50%" stop-color="#818CF8" stop-opacity="0.14"/><stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/>`
        : isTarde
          ? `<stop offset="0%" stop-color="#FBD38D" stop-opacity="0.45"/><stop offset="50%" stop-color="#F28C5B" stop-opacity="0.18"/><stop offset="100%" stop-color="#FF7A45" stop-opacity="0"/>`
          : `<stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.42"/><stop offset="45%" stop-color="#FFEAA7" stop-opacity="0.22"/><stop offset="85%" stop-color="#FDCB6E" stop-opacity="0.06"/><stop offset="100%" stop-color="#FAD390" stop-opacity="0"/>`;
      const moteColor = isNoite ? "#E0E7FF" : isTarde ? "#FED7AA" : "#FEF08A";

      const defs = `
        <defs>
          <linearGradient id="${id}-parede-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C2A882"/>
            <stop offset="25%" stop-color="#DFCCAA"/>
            <stop offset="85%" stop-color="#D5BF9D"/>
            <stop offset="100%" stop-color="#B8A07A"/>
          </linearGradient>
          <linearGradient id="${id}-telhado-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6E4E30"/>
            <stop offset="50%" stop-color="#825C38"/>
            <stop offset="100%" stop-color="#553A22"/>
          </linearGradient>
          <linearGradient id="${id}-eave-sombra" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E140A" stop-opacity="0.40"/>
            <stop offset="100%" stop-color="#1E140A" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="${id}-beam-janela" x1="100%" y1="0%" x2="0%" y2="100%">
            ${beamGrad}
          </linearGradient>
          <radialGradient id="${id}-janela-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${isNoite ? "#C7D2FE" : "#FFF3D0"}" stop-opacity="0.38"/>
            <stop offset="60%" stop-color="${isNoite ? "#818CF8" : "#FFEAA7"}" stop-opacity="0.14"/>
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="${id}-janela-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${ceuCores[0]}"/>
            <stop offset="100%" stop-color="${ceuCores[1]}"/>
          </linearGradient>
          <radialGradient id="${id}-lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFF7CD" stop-opacity="0.65"/>
            <stop offset="30%" stop-color="#FDE047" stop-opacity="0.35"/>
            <stop offset="65%" stop-color="#EAB308" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#CA8A04" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="${id}-bau-tampa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9C6B3E"/>
            <stop offset="35%" stop-color="#80542C"/>
            <stop offset="100%" stop-color="#50331A"/>
          </linearGradient>
          <linearGradient id="${id}-bau-corpo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#5A391D"/>
            <stop offset="30%" stop-color="#7A4E2A"/>
            <stop offset="75%" stop-color="#694121"/>
            <stop offset="100%" stop-color="#4E2F16"/>
          </linearGradient>
          <radialGradient id="${id}-puff-vol" cx="65%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
            <stop offset="25%" stop-color="${puffCor}"/>
            <stop offset="75%" stop-color="${puffEscuro}"/>
            <stop offset="100%" stop-color="${escurecer(puffEscuro, 0.75)}"/>
          </radialGradient>
          <clipPath id="${id}j"><circle cx="250" cy="30" r="26"/></clipPath>
        </defs>
      `;

      const tabuasParede = Array.from({ length: 18 }, (_, i) => {
        const x = i * 20;
        const knot = i % 4 === 1
          ? `<circle cx="${x + 10}" cy="${60 + (i * 27) % (chaoY - 100)}" r="1.8" fill="#B59972" opacity="0.6"/>
             <ellipse cx="${x + 10}" cy="${60 + (i * 27) % (chaoY - 100)}" rx="3.5" ry="5" fill="none" stroke="#A88B64" stroke-width="0.6" opacity="0.5"/>`
          : "";
        return `
          <line x1="${x}" y1="0" x2="${x}" y2="${chaoY}" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="0.8"/>
          <line x1="${x + 0.8}" y1="0" x2="${x + 0.8}" y2="${chaoY}" stroke="#A68C66" stroke-opacity="0.45" stroke-width="1.2"/>
          ${knot}
        `;
      }).join("");

      const rafters = Array.from({ length: 10 }, (_, i) => {
        const rx = i * 40;
        const ry = chaoY - 40 - i * ((chaoY - 80) / 9);
        return `
          <polygon points="${rx},${ry} ${rx + 7},${ry - 4} ${rx + 7},0 ${rx},0" fill="#442D18" opacity="0.85"/>
          <polygon points="${rx + 7},${ry - 4} ${rx + 11},${ry - 7} ${rx + 11},0 ${rx + 7},0" fill="#845D38"/>
          <line x1="${rx + 7}" y1="${ry - 4}" x2="${rx + 7}" y2="0" stroke="#B88A58" stroke-width="0.9" opacity="0.85"/>
        `;
      }).join("");

      const celestial = isNoite
        ? `<circle cx="258" cy="22" r="7" fill="#F4EEDC"/><circle cx="261" cy="20" r="6" fill="${ceuCores[0]}"/>
           <circle cx="242" cy="24" r="1.1" fill="#FFFFFF" opacity="0.8"/>
           <circle cx="255" cy="40" r="0.9" fill="#FFFFFF" opacity="0.75"/>
           <circle cx="238" cy="35" r="1.3" fill="#FFFFFF" opacity="0.9"/>`
        : isTarde
          ? `<circle cx="254" cy="28" r="8" fill="#FF7A45"/><circle cx="254" cy="28" r="14" fill="#FFB088" opacity="0.3"/>`
          : `<circle cx="254" cy="26" r="7.5" fill="#FFE27A"/><circle cx="254" cy="26" r="15" fill="#FFE27A" opacity="0.25"/>`;

      const janelaRedonda = `
        <g class="sotao-janela-grupo">
          <circle cx="250" cy="30" r="38" fill="url(#${id}-janela-halo)"/>
          <circle cx="250" cy="30" r="30" fill="#4A331E" stroke="#322213" stroke-width="1.2"/>
          <circle cx="250" cy="30" r="28" fill="#75502E"/>
          <g clip-path="url(#${id}j)">
            <rect x="220" y="0" width="60" height="60" fill="url(#${id}-janela-ceu)"/>
            ${celestial}
            <polygon points="234,14 246,14 238,46 226,46" fill="#FFFFFF" opacity="0.22"/>
            <polygon points="252,14 266,14 256,46 242,46" fill="#FFFFFF" opacity="0.14"/>
          </g>
          <circle cx="250" cy="30" r="26" fill="none" stroke="#5E4024" stroke-width="5"/>
          <circle cx="250" cy="30" r="28.5" fill="none" stroke="#2B1A0C" stroke-width="1" opacity="0.65"/>
          <circle cx="250" cy="30" r="23.5" fill="none" stroke="#A87E54" stroke-width="0.8" opacity="0.8"/>
          <path d="M224 30H276M250 4V56" stroke="#462E19" stroke-width="3.4"/>
          <path d="M224 29.2H276M249.2 4V56" stroke="#B88E62" stroke-width="0.8" opacity="0.85"/>
        </g>
      `;

      const feixeLuz = `
        <g class="sotao-feixe-grupo" pointer-events="none">
          <polygon points="250,30 274,44 190,${chaoY + 12} 18,${chaoY + 12}" fill="url(#${id}-beam-janela)" class="cenario-feixe-luz"/>
          <polygon points="242,26 260,34 140,${chaoY + 8} 45,${chaoY + 8}" fill="url(#${id}-beam-janela)" opacity="0.6" class="cenario-feixe-luz"/>
          <ellipse cx="115" cy="${chaoY + 18}" rx="85" ry="16" fill="${isNoite ? '#818CF8' : '#FFEAA7'}" opacity="${isNoite ? 0.08 : 0.16}"/>
          <g class="sotao-motes">
            <circle cx="228" cy="58" r="1.3" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:0s"/>
            <circle cx="204" cy="85" r="1.0" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:1.5s"/>
            <circle cx="178" cy="115" r="1.5" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:0.8s"/>
            <circle cx="145" cy="142" r="1.2" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:2.4s"/>
            <circle cx="120" cy="170" r="1.4" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:1.1s"/>
            <circle cx="95" cy="195" r="1.1" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:3.2s"/>
            <circle cx="160" cy="165" r="0.9" fill="${moteColor}" class="cenario-poeira-mote" style="animation-delay:1.9s"/>
          </g>
        </g>
      `;

      const lampada = `
        <g class="sotao-lampada-grupo">
          <path d="M150 0 Q149.5 15 150 30" stroke="#1E1E24" stroke-width="1.6" fill="none"/>
          <rect x="146" y="27" width="8" height="5" rx="1" fill="#C59B27" stroke="#684E0B" stroke-width="0.8"/>
          <line x1="146" y1="29" x2="154" y2="29" stroke="#E6C458" stroke-width="0.6"/>
          <circle cx="150" cy="38" r="32" fill="url(#${id}-lamp-glow)" pointer-events="none"/>
          <circle cx="150" cy="37" r="7" fill="#FFEAA7" stroke="#D97706" stroke-width="0.9" class="lampada-casa"/>
          <circle cx="148" cy="35" r="2.2" fill="#FFFFFF" opacity="0.65"/>
          <path d="M148.5 35.5 Q150 34 151.5 35.5 Q150 38 148.5 39.5" fill="none" stroke="#D97706" stroke-width="0.8"/>
        </g>
      `;

      const bauX = 150, bauY = chaoY - 34;
      const bau = `
        <g class="sotao-bau-grupo" transform="translate(${bauX} ${bauY})">
          <ellipse cx="28" cy="37" rx="34" ry="7" fill="#120A05" opacity="0.55"/>
          <polygon points="-6,36 28,34 62,36 50,42 -14,42" fill="#120A05" opacity="0.25"/>
          <rect x="0" y="11" width="56" height="26" rx="2" fill="url(#${id}-bau-corpo)" stroke="#2D1A0B" stroke-width="1.2"/>
          <line x1="1" y1="19" x2="55" y2="19" stroke="#3D2411" stroke-width="1"/>
          <line x1="1" y1="20" x2="55" y2="20" stroke="#9C6B3E" stroke-width="0.6" opacity="0.5"/>
          <line x1="1" y1="28" x2="55" y2="28" stroke="#3D2411" stroke-width="1"/>
          <line x1="1" y1="29" x2="55" y2="29" stroke="#9C6B3E" stroke-width="0.6" opacity="0.5"/>
          <path d="M-2 11 Q28 0 58 11 Z" fill="url(#${id}-bau-tampa)" stroke="#2D1A0B" stroke-width="1.2"/>
          <path d="M0 11 Q28 2 56 11" fill="none" stroke="#C48E55" stroke-width="1.4" opacity="0.8"/>
          <path d="M-2 11 H58" stroke="#241407" stroke-width="2"/>
          <rect x="8" y="2" width="7" height="34" fill="#C59B27" stroke="#4A3405" stroke-width="0.8"/>
          <line x1="9" y1="2" x2="9" y2="36" stroke="#FDE047" stroke-width="0.8" opacity="0.8"/>
          <circle cx="11.5" cy="5" r="1.1" fill="#4A3405"/><circle cx="11.5" cy="5" r="0.7" fill="#FDE047"/>
          <circle cx="11.5" cy="18" r="1.1" fill="#4A3405"/><circle cx="11.5" cy="18" r="0.7" fill="#FDE047"/>
          <circle cx="11.5" cy="30" r="1.1" fill="#4A3405"/><circle cx="11.5" cy="30" r="0.7" fill="#FDE047"/>
          <rect x="41" y="2" width="7" height="34" fill="#C59B27" stroke="#4A3405" stroke-width="0.8"/>
          <line x1="42" y1="2" x2="42" y2="36" stroke="#FDE047" stroke-width="0.8" opacity="0.8"/>
          <circle cx="44.5" cy="5" r="1.1" fill="#4A3405"/><circle cx="44.5" cy="5" r="0.7" fill="#FDE047"/>
          <circle cx="44.5" cy="18" r="1.1" fill="#4A3405"/><circle cx="44.5" cy="18" r="0.7" fill="#FDE047"/>
          <circle cx="44.5" cy="30" r="1.1" fill="#4A3405"/><circle cx="44.5" cy="30" r="0.7" fill="#FDE047"/>
          <rect x="23" y="7" width="10" height="13" rx="1.5" fill="#EAB308" stroke="#5A4004" stroke-width="0.9"/>
          <rect x="24" y="8" width="8" height="5" fill="#FDE047"/>
          <circle cx="28" cy="14" r="1.3" fill="#241407"/>
          <polygon points="27.4,14 28.6,14 29,17.5 27,17.5" fill="#241407"/>
          <path d="M-2 22 Q-6 24 -2 27" stroke="#241407" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <path d="M58 22 Q62 24 58 27" stroke="#241407" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        </g>
      `;

      const puff = `
        <g class="sotao-puff-grupo">
          <ellipse cx="80" cy="${chaoY + 14}" rx="68" ry="22" fill="#0E0C16" opacity="0.5"/>
          <ellipse cx="80" cy="${chaoY + 12}" rx="62" ry="16" fill="#0E0C16" opacity="0.3"/>
          <ellipse cx="80" cy="${chaoY + 6}" rx="64" ry="28" fill="url(#${id}-puff-vol)" stroke="#1C1824" stroke-width="1.5"/>
          <ellipse cx="82" cy="${chaoY - 4}" rx="46" ry="16" fill="${puffLuz}" opacity="0.22"/>
          <path d="M26 ${chaoY + 8} Q55 ${chaoY - 4} 76 ${chaoY + 2}" fill="none" stroke="${puffEscuro}" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M27 ${chaoY + 7} Q55 ${chaoY - 5} 76 ${chaoY + 1}" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.3"/>
          <path d="M134 ${chaoY + 8} Q105 ${chaoY - 4} 84 ${chaoY + 2}" fill="none" stroke="${puffEscuro}" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M133 ${chaoY + 7} Q105 ${chaoY - 5} 84 ${chaoY + 1}" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.3"/>
          <ellipse cx="80" cy="${chaoY + 1}" rx="22" ry="7" fill="${puffEscuro}" opacity="0.45"/>
          <path d="M24 ${chaoY + 14} Q80 ${chaoY + 28} 136 ${chaoY + 14}" fill="none" stroke="${puffEscuro}" stroke-width="1.4" stroke-dasharray="3,2.5" opacity="0.7"/>
        </g>
      `;

      const sombraEstante = `<rect x="${W - 176}" y="${chaoY - 2}" width="176" height="6" fill="#120A05" opacity="0.4"/>`;

      return `
        ${defs}
        <rect width="${W}" height="${chaoY}" fill="url(#${id}-parede-grad)"/>
        ${tabuasParede}
        <path d="M0 0H${W}V40L0 ${chaoY - 40}Z" fill="url(#${id}-telhado-grad)"/>
        <polygon points="0,${chaoY - 40} ${W},40 ${W},56 0,${chaoY - 24}" fill="url(#${id}-eave-sombra)"/>
        ${rafters}
        ${janelaRedonda}
        <g transform="translate(0 ${chaoY})">
          ${piso(W, 64, "#A8845A", "#7A5634")}
        </g>
        <g class="sotao-rodape">
          <rect x="0" y="${chaoY - 6}" width="${W}" height="6" fill="#6B4727"/>
          <line x1="0" y1="${chaoY - 6}" x2="${W}" y2="${chaoY - 6}" stroke="#9E6E41" stroke-width="1"/>
          <rect x="0" y="${chaoY}" width="${W}" height="3" fill="#140D07" opacity="0.45"/>
        </g>
        ${sombraEstante}
        <g class="sotao-vitrola-canto" transform="translate(10 ${chaoY - 48})" data-act="vitrola-tocar" style="cursor:pointer;" role="button" tabindex="0" title="Vitrola 1930 (Toque para ouvir o disco de vinil)">
          <ellipse cx="24" cy="46" rx="16" ry="3.5" fill="#140D07" opacity="0.5"/>
          <rect x="10" y="36" width="28" height="9" rx="1.5" fill="#4E2711" stroke="#231006" stroke-width="0.8"/>
          <line x1="13" y1="45" x2="13" y2="47" stroke="#231006" stroke-width="1.6"/>
          <line x1="35" y1="45" x2="35" y2="47" stroke="#231006" stroke-width="1.6"/>
          <g transform="translate(0 -6)">
            ${typeof desenharVitrolaSVG === "function" ? desenharVitrolaSVG({ interativo: false }) : ""}
          </g>
        </g>
        ${bau}
        ${puff}
        ${lampada}
        ${c.leitor(50, chaoY - 66, 60)}
        ${c.estante()}
        ${feixeLuz}
      `;
    }
  },
  {
    id: "cripta",
    nome: "Cripta de leitura",
    preco: 250,
    mundo: "emo",
    desc: "Paredes de pedra, vitrais góticos, velas e banco vitoriano.",
    opcoes: {
      vitral: {
        nome: "Vitral",
        valores: [
          ["sangue", "#C8102E"],
          ["roxo", "#6A2A8C"],
          ["azul", "#2A4A8C"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op, id } = c;
      const hora = horaDoCeu();
      const vitralCor = op.vitral;

      const defs = `
        <defs>
          <linearGradient id="${id}-pedra-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E1C24"/>
            <stop offset="100%" stop-color="#14131A"/>
          </linearGradient>
          <radialGradient id="${id}-vela-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFD27A" stop-opacity="0.8"/>
            <stop offset="40%" stop-color="#FF9E3B" stop-opacity="0.35"/>
            <stop offset="80%" stop-color="#E05615" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#991B1B" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="${id}-vitral-beam" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${vitralCor}" stop-opacity="0.5"/>
            <stop offset="60%" stop-color="${vitralCor}" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="${vitralCor}" stop-opacity="0"/>
          </linearGradient>
        </defs>
      `;

      let pedras = "";
      for (let y = 0, i = 0; y < chaoY; y += 22, i++) {
        for (let x = i % 2 ? -20 : 0; x < W; x += 40) {
          pedras += `<rect x="${x + 1}" y="${y + 1}" width="38" height="20" rx="3" fill="#2E2B38" stroke="#1A1822" stroke-width="1.2"/>`;
          pedras += `<line x1="${x + 2}" y1="${y + 2}" x2="${x + 38}" y2="${y + 2}" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="0.8"/>`;
        }
      }

      const vela = (x, y, h) => `
        <g transform="translate(${x} ${y})">
          <ellipse cx="0" cy="0" rx="10" ry="3" fill="#0E0D12" opacity="0.6"/>
          <rect x="-4" y="${-h}" width="8" height="${h}" rx="1" fill="#E8DEC4" stroke="#141416" stroke-width="0.8"/>
          <path d="M-4 ${-h + 4} Q-1 ${-h + 10} -3 ${-h + 16}" stroke="#D5CAAD" stroke-width="1.2" fill="none"/>
          <circle cx="0" cy="${-h - 7}" r="24" fill="url(#${id}-vela-glow)" pointer-events="none"/>
          <path class="chama-casa" d="M0 ${-h - 14} Q5 ${-h - 5} 0 ${-h} Q-5 ${-h - 5} 0 ${-h - 14} Z" fill="#FFC107"/>
          <circle cx="0" cy="${-h - 6}" r="3" fill="#FFFBEB"/>
        </g>
      `;

      const vx = 150, vy = 16;
      const vitral = `
        <g class="cripta-vitral">
          <path d="M${vx} ${vy + 74} V${vy + 26} Q${vx} ${vy} ${vx + 32} ${vy} Q${vx + 64} ${vy} ${vx + 64} ${vy + 26} V${vy + 74} Z" fill="${vitralCor}" stroke="#141416" stroke-width="3.4"/>
          <path d="M${vx + 32} ${vy} V${vy + 74} M${vx} ${vy + 36} H${vx + 64} M${vx + 8} ${vy + 14} L${vx + 56} ${vy + 62} M${vx + 56} ${vy + 14} L${vx + 8} ${vy + 62}" stroke="#141416" stroke-width="1.8"/>
          <circle cx="${vx + 32}" cy="${vy + 30}" r="9" fill="#FFFFFF" opacity="0.45"/>
        </g>
      `;

      const banco = `
        <g transform="translate(16 ${chaoY - 42})">
          <ellipse cx="80" cy="42" rx="76" ry="10" fill="#0E0D12" opacity="0.6"/>
          <path d="M10 0 H150 L160 20 L150 44 H10 L0 20 Z" fill="#2E1C1A" stroke="#141416" stroke-width="1.6"/>
          <path d="M14 6 H146 L154 20 L146 38 H14 L6 20 Z" fill="#6A1024"/>
          <line x1="16" y1="8" x2="144" y2="8" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="0.8"/>
          <path d="M80 10 V32 M72 18 H88" stroke="#D4AF37" stroke-width="2.6"/>
        </g>
      `;

      const feixeMistico = `
        <g class="sotao-feixe-grupo" pointer-events="none">
          <polygon points="${vx + 10},${vy + 30} ${vx + 54},${vy + 30} 130,${chaoY + 12} 20,${chaoY + 12}" fill="url(#${id}-vitral-beam)" class="cenario-feixe-luz"/>
          <g class="sotao-motes">
            <circle cx="140" cy="65" r="1.3" fill="#F472B6" class="cenario-poeira-mote" style="animation-delay:0s"/>
            <circle cx="115" cy="95" r="1.1" fill="#C084FC" class="cenario-poeira-mote" style="animation-delay:1.4s"/>
            <circle cx="85" cy="130" r="1.5" fill="#F472B6" class="cenario-poeira-mote" style="animation-delay:0.7s"/>
            <circle cx="60" cy="165" r="1.2" fill="#E879F9" class="cenario-poeira-mote" style="animation-delay:2.1s"/>
          </g>
        </g>
      `;

      const vitrola = vitrolaVintageCasa(10, chaoY - 48);

      return `
        ${defs}
        <rect width="${W}" height="${chaoY}" fill="url(#${id}-pedra-grad)"/>
        ${pedras}
        ${vitral}
        <g transform="translate(0 ${chaoY})">
          <rect width="${W}" height="64" fill="#14131A"/>
          ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 32}" y1="0" x2="${i * 32}" y2="64" stroke="#25222C" stroke-width="1.2"/><line x1="${i * 32 + 1}" y1="0" x2="${i * 32 + 1}" y2="64" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="0.8"/>`).join("")}
        </g>
        ${banco}
        ${vela(22, chaoY - 42, 32)}
        ${vela(202, chaoY + 18, 42)}
        ${vela(218, chaoY + 22, 28)}
        ${vitrola}
        ${c.leitor(54, chaoY - 108, 60)}
        ${c.estante()}
        ${feixeMistico}
      `;
    }
  },
  {
    id: "estudio",
    nome: "Estúdio",
    preco: 250,
    mundo: "rock",
    desc: "Painéis acústicos, amplificador valvulado e pedestal vintage.",
    opcoes: {
      espuma: {
        nome: "Espuma",
        valores: [
          ["preta", "#1F1F26"],
          ["vermelha", "#6E1B1E"],
          ["azul", "#1A2F63"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op, id } = c;
      const hora = horaDoCeu();
      const corEspuma = op.espuma;

      const defs = `
        <defs>
          <linearGradient id="${id}-spotlight-beam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.55"/>
            <stop offset="45%" stop-color="#FEF08A" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="${id}-lamp-spot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#D97706" stop-opacity="0"/>
          </radialGradient>
        </defs>
      `;

      let espuma = "";
      for (let y = 0; y < chaoY; y += 26) {
        for (let x = 0; x < W; x += 26) {
          espuma += `
            <rect x="${x + 1}" y="${y + 1}" width="24" height="24" rx="2" fill="${corEspuma}" stroke="#101014" stroke-width="1"/>
            <line x1="${x + 2}" y1="${y + 9}" x2="${x + 24}" y2="${y + 9}" stroke="${escurecer(corEspuma, 0.65)}" stroke-width="1.2"/>
            <line x1="${x + 2}" y1="${y + 17}" x2="${x + 24}" y2="${y + 17}" stroke="${escurecer(corEspuma, 0.65)}" stroke-width="1.2"/>
            <line x1="${x + 2}" y1="${y + 2}" x2="${x + 24}" y2="${y + 2}" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="0.8"/>
          `;
        }
      }

      const ampli = (x, y, w, h) => `
        <g transform="translate(${x} ${y})">
          <rect width="${w}" height="${h}" rx="3" fill="#18181E" stroke="#0C0C10" stroke-width="1.4"/>
          <polygon points="0,0 8,0 0,8" fill="#94A3B8"/>
          <polygon points="${w},0 ${w - 8},0 ${w},8" fill="#94A3B8"/>
          <polygon points="0,${h} 8,${h} 0,${h - 8}" fill="#94A3B8"/>
          <polygon points="${w},${h} ${w - 8},${h} ${w},${h - 8}" fill="#94A3B8"/>
          <rect x="5" y="5" width="${w - 10}" height="10" rx="1" fill="#2B2B33"/>
          ${[0, 1, 2, 3].map(i => `<circle cx="${11 + i * ((w - 22) / 3)}" cy="10" r="2.2" fill="#E2E8F0" stroke="#0F172A" stroke-width="0.6"/>`).join("")}
          <circle cx="${w - 10}" cy="10" r="2.2" fill="#EF4444" class="lampada-casa"/>
          <rect x="5" y="19" width="${w - 10}" height="${h - 24}" rx="1" fill="#D4AF37" stroke="#1A1A22" stroke-width="1" opacity="0.85"/>
          <line x1="5" y1="${19 + (h - 24) / 2}" x2="${w - 5}" y2="${19 + (h - 24) / 2}" stroke="#78350F" stroke-width="1.2"/>
        </g>
      `;

      const microfone = `
        <g transform="translate(176 ${chaoY - 120})">
          <line x1="0" y1="0" x2="-10" y2="-14" stroke="#64748B" stroke-width="3.2"/>
          <rect x="-18" y="-26" width="12" height="16" rx="4" fill="#CBD5E1" stroke="#0F172A" stroke-width="1.2" transform="rotate(-36 -12 -18)"/>
          <line x1="-18" y1="-22" x2="-6" y2="-22" stroke="#475569" stroke-width="1" transform="rotate(-36 -12 -18)"/>
          <line x1="0" y1="0" x2="0" y2="126" stroke="#475569" stroke-width="3"/>
          <ellipse cx="0" cy="126" rx="16" ry="4" fill="#1E293B" stroke="#0F172A" stroke-width="1.2"/>
        </g>
      `;

      const spotlight = `
        <g class="estudio-spotlight">
          <line x1="150" y1="0" x2="150" y2="24" stroke="#475569" stroke-width="3.2"/>
          <polygon points="134,24 166,24 172,36 128,36" fill="#DC2626" stroke="#1E1E24" stroke-width="1.2"/>
          <ellipse cx="150" cy="36" rx="22" ry="6" fill="url(#${id}-lamp-spot)"/>
          <polygon points="128,36 172,36 210,${chaoY + 12} 80,${chaoY + 12}" fill="url(#${id}-spotlight-beam)" class="cenario-feixe-luz"/>
          <ellipse cx="145" cy="${chaoY + 16}" rx="65" ry="14" fill="#FEF08A" opacity="0.16"/>
          <g class="sotao-motes">
            <circle cx="152" cy="70" r="1.3" fill="#FEF08A" class="cenario-poeira-mote" style="animation-delay:0s"/>
            <circle cx="138" cy="110" r="1.0" fill="#FEF08A" class="cenario-poeira-mote" style="animation-delay:1.2s"/>
            <circle cx="165" cy="145" r="1.4" fill="#FEF08A" class="cenario-poeira-mote" style="animation-delay:0.6s"/>
          </g>
        </g>
      `;

      const vitrola = vitrolaVintageCasa(10, chaoY - 48);

      return `
        ${defs}
        <rect width="${W}" height="${chaoY}" fill="#101014"/>
        ${espuma}
        <g transform="translate(0 ${chaoY})">
          <rect width="${W}" height="64" fill="#1E1F26"/>
          ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40 - 28}" y2="64" stroke="#2D2E38" stroke-width="1.4"/>`).join("")}
        </g>
        ${ampli(8, chaoY - 62, 72, 66)}
        ${ampli(84, chaoY - 42, 58, 46)}
        ${microfone}
        ${spotlight}
        ${vitrola}
        ${c.leitor(18, chaoY - 136, 58)}
        ${c.estante()}
      `;
    }
  },
  {
    id: "biblioteca",
    nome: "Biblioteca secreta",
    libera: BIBLIOTECA_PAGINAS,
    desc: `Abre quando você junta ${BIBLIOTECA_PAGINAS} páginas lidas. Estantes de jacarandá e poltrona Chesterfield.`,
    opcoes: {
      poltrona: {
        nome: "Poltrona",
        valores: [
          ["couro", "#6E2A1E"],
          ["veludo", "#2A4A3A"],
          ["vinho", "#5A1A2A"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op, id } = c;
      const hora = horaDoCeu();
      const corPoltrona = op.poltrona;

      const defs = `
        <defs>
          <linearGradient id="${id}-claraboia-beam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.45"/>
            <stop offset="50%" stop-color="#FFEAA7" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#FAD390" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="${id}-lampada-leitura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.75"/>
            <stop offset="40%" stop-color="#FDE047" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#EAB308" stop-opacity="0"/>
          </radialGradient>
        </defs>
      `;

      let prateleiras = "";
      for (let y = 10, k = 0; y < chaoY - 40; y += 44, k++) {
        prateleiras += `
          <rect x="0" y="${y + 36}" width="${W}" height="7" rx="1" fill="#3D2411" stroke="#241407" stroke-width="1"/>
          <line x1="0" y1="${y + 37}" x2="${W}" y2="${y + 37}" stroke="#7A4D28" stroke-width="0.8"/>
          ${lombadas(4, y, W - 8, 36, k * 5 + 1)}
        `;
      }

      const escada = `
        <g class="biblioteca-escada" transform="translate(230 10)">
          <line x1="-230" y1="4" x2="40" y2="4" stroke="#C59B27" stroke-width="2.6"/>
          <circle cx="0" cy="4" r="3.5" fill="#D4AF37" stroke="#4A3405" stroke-width="0.8"/>
          <circle cx="30" cy="4" r="3.5" fill="#D4AF37" stroke="#4A3405" stroke-width="0.8"/>
          <line x1="0" y1="4" x2="0" y2="${chaoY - 10}" stroke="#5A3A1E" stroke-width="3.6"/>
          <line x1="30" y1="4" x2="30" y2="${chaoY - 10}" stroke="#5A3A1E" stroke-width="3.6"/>
          ${Array.from({ length: Math.floor((chaoY - 20) / 18) }, (_, i) => `<line x1="0" y1="${14 + i * 18}" x2="30" y2="${14 + i * 18}" stroke="#8C6A4A" stroke-width="2.8"/>`).join("")}
        </g>
      `;

      const tapete = `
        <g transform="translate(110 ${chaoY + 30})">
          <ellipse cx="0" cy="0" rx="104" ry="17" fill="#58161A" stroke="#2F0A0D" stroke-width="1.4"/>
          <ellipse cx="0" cy="0" rx="90" ry="13" fill="#D8C8A8" stroke="#B8A480" stroke-width="0.8"/>
          <ellipse cx="0" cy="0" rx="78" ry="10" fill="#7A1F22"/>
          <ellipse cx="0" cy="0" rx="64" ry="7" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.7"/>
        </g>
      `;

      const poltrona = `
        <g transform="translate(40 ${chaoY - 72})">
          <path d="M10 0 Q60 -16 110 0 V50 H10 Z" fill="${corPoltrona}" stroke="#141416" stroke-width="1.6"/>
          ${[0, 1, 2, 3]
            .map(
              i => `
            <circle cx="${28 + i * 22}" cy="15" r="2.2" fill="#0F0F14" opacity="0.6"/>
            <circle cx="${39 + i * 22}" cy="30" r="2.2" fill="#0F0F14" opacity="0.6"/>
            <line x1="${28 + i * 22}" y1="15" x2="${39 + i * 22}" y2="30" stroke="#0F0F14" stroke-width="0.8" opacity="0.3"/>
          `
            )
            .join("")}
          <rect x="-6" y="34" width="134" height="34" rx="9" fill="${corPoltrona}" stroke="#141416" stroke-width="1.4"/>
          <rect x="-12" y="22" width="22" height="46" rx="9" fill="${escurecer(corPoltrona, 0.75)}" stroke="#141416" stroke-width="1.4"/>
          <rect x="112" y="22" width="22" height="46" rx="9" fill="${escurecer(corPoltrona, 0.75)}" stroke="#141416" stroke-width="1.4"/>
        </g>
      `;

      const luminaria = `
        <g transform="translate(192 ${chaoY - 6})">
          <circle cx="0" cy="-48" r="28" fill="url(#${id}-lampada-leitura)" pointer-events="none"/>
          <line x1="0" y1="0" x2="0" y2="-44" stroke="#C59B27" stroke-width="2.4"/>
          <path d="M-14 -44 H14 L8 -60 H-8 Z" fill="#2F6A3A" stroke="#141416" stroke-width="1"/>
          <ellipse cx="0" cy="0" rx="12" ry="3.5" fill="#8C6A3A" stroke="#4E3218" stroke-width="1"/>
        </g>
      `;

      const claraboia = `
        <g class="biblioteca-claraboia">
          <polygon points="80,0 200,0 240,${chaoY + 12} 40,${chaoY + 12}" fill="url(#${id}-claraboia-beam)" class="cenario-feixe-luz"/>
          <g class="sotao-motes">
            <circle cx="120" cy="40" r="1.4" fill="#FEF08A" class="cenario-poeira-mote" style="animation-delay:0s"/>
            <circle cx="160" cy="75" r="1.1" fill="#FEF08A" class="cenario-poeira-mote" style="animation-delay:1.5s"/>
            <circle cx="105" cy="115" r="1.5" fill="#FEF08A" class="cenario-poeira-mote" style="animation-delay:0.8s"/>
            <circle cx="175" cy="155" r="1.2" fill="#FEF08A" class="cenario-poeira-mote" style="animation-delay:2.3s"/>
          </g>
        </g>
      `;

      const feixe = claraboia;
      const vitrola = vitrolaVintageCasa(10, chaoY - 48);
      const rodape = rodapeVintage(W, chaoY, "#241407");

      return `
        ${defs}
        <rect width="${W}" height="${chaoY}" fill="#241407"/>
        ${prateleiras}
        ${escada}
        <g transform="translate(0 ${chaoY})">${piso(W, 64, "#4A2A14", "#2B1608")}</g>
        ${rodape}
        ${tapete}
        ${poltrona}
        ${luminaria}
        ${vitrola}
        ${c.leitor(78, chaoY - 118, 60)}
        ${c.estante()}
        ${feixe}
      `;
    }
  }
];
const COMODO = Object.fromEntries(COMODOS.map(c => [c.id, c]));

/* ---------- dados ---------- */
const casaPadrao = () => ({ comodo: "quarto", tem: ["quarto"], opcoes: {} });
function minhaCasa() {
  const d = S.leitura.decor;
  if (!d.casa || typeof d.casa !== "object") d.casa = casaPadrao();
  if (!Array.isArray(d.casa.tem)) d.casa.tem = ["quarto"];
  if (!d.casa.opcoes || typeof d.casa.opcoes !== "object") d.casa.opcoes = {};
  return d.casa;
}
const doMundoCasa = (c, persona = S.persona) => !c.mundo || c.mundo === persona;
const comodoLiberado = c => !c.libera || (S.leitura.total || 0) >= c.libera;
const temComodo = c => c.id === "quarto" || minhaCasa().tem.includes(c.id) || (c.libera && comodoLiberado(c));

/** Escolha atual de cada opção do cômodo (com padrão = primeira opção). */
function escolhasDo(c, casa) {
  const salvas = (casa && casa.opcoes && casa.opcoes[c.id]) || {};
  const escolha = {},
    op = {};
  for (const [k, o] of Object.entries(c.opcoes || {})) {
    const v = o.valores.find(([id]) => id === salvas[k]) || o.valores[0];
    escolha[k] = v[0];
    op[k] = v[1];
  }
  return { escolha, op };
}

let casaId = 0;
/** Desenha o cômodo escolhido (d = minhaEstante() ou a estante de um amigo). O quarto continua em quartoSVG. */
function casaSVG(d = minhaEstante()) {
  const casa = (d.decor && d.decor.casa) || casaPadrao();
  const c = COMODO[casa.comodo];
  if (!c || c.id === "quarto" || !doMundoCasa(c, d.persona) || (d.meu && !temComodo(c))) return quartoSVG(d);
  const id = "casa" + ++casaId;
  // a estante, menor, encostada na direita
  const est = estanteSVG(d, { semParede: true, semPrumi: true });
  const altEst = +(/viewBox="0 0 360 (\d+)"/.exec(est) || [0, 300])[1];
  const escala = 0.47,
    largE = Math.round(360 * escala),
    altE = Math.round(altEst * escala);
  const W = 360,
    altChao = 64;
  const H = Math.max(270, altE + altChao + 20);
  const chaoY = H - altChao;
  const lendo = d.lendo && d.lendo.length;
  const { escolha, op } = escolhasDo(c, casa);
  const ctx = {
    W,
    H,
    chaoY,
    id,
    escolha,
    op,
    estante: () =>
      `<svg x="${W - largE - 6}" y="${chaoY + 6 - altE}" width="${largE}" height="${altE}" viewBox="0 0 360 ${altEst}">${est.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</svg>`,
    leitor: (x, y, tam = 62) => {
      const p = prumi({
        mood: lendo ? "focus" : "happy",
        size: tam,
        eq: d.equip || {},
        p: d.persona
      }).replace("<svg ", `<svg x="${x}" y="${y}" `);
      const k = tam / 62;
      const livro = lendo
        ? `<path d="M${x + 18 * k} ${y + 58 * k}l${13 * k} ${-3 * k} ${13 * k} ${3 * k}v${10 * k}l${-13 * k} ${-3 * k} ${-13 * k} ${3 * k}z" fill="#FBF7EC" stroke="var(--ink)" stroke-width="1"/>`
        : "";
      return `<g class="prumi-leitor" ${d.meu ? 'data-act="prumi-leitor"' : ""}>${p}${livro}</g>`;
    }
  };
  return `<svg class="estante-svg quarto-svg casa-svg casa-${c.id}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.nome)} com ${d.lidos.length} livros lidos">${c.desenho(ctx)}</svg>`;
}

/* ---------- escolher e comprar cômodos (aparece embaixo do desenho, na aba Estante) ---------- */
function casaEscolhaHTML() {
  const casa = minhaCasa();
  const atual = COMODO[casa.comodo] && temComodo(COMODO[casa.comodo]) ? COMODO[casa.comodo] : COMODO.quarto;
  const lista = COMODOS.filter(c => doMundoCasa(c));
  const cartao = c => {
    const tem = temComodo(c);
    const ativo = c.id === atual.id;
    const estado = ativo
      ? `<span class="tag on">Aqui</span>`
      : tem
        ? `<span class="tag">Ir</span>`
        : c.libera
          ? `<span class="tag lock">${ICON.lock} ${Math.min(S.leitura.total || 0, c.libera)}/${c.libera}</span>`
          : `<span class="tag price ${S.leitura.saldo < c.preco ? "short" : ""}">${c.preco} p.</span>`;
    return `<button class="comodo ${ativo ? "on" : ""} ${tem ? "" : "fechado"}" data-act="casa-ir" data-id="${c.id}" aria-pressed="${ativo}"><b>${esc(c.nome)}</b>${estado}</button>`;
  };
  const opcoes = Object.entries(atual.opcoes || {});
  const { escolha } = escolhasDo(atual, casa);
  return `<div class="casa-comodos" role="group" aria-label="Cômodos">${lista.map(cartao).join("")}</div>
    ${opcoes.length ? `<div class="casa-opcoes">${opcoes.map(([k, o]) => `<div class="row"><span class="label">${esc(o.nome)}</span><div class="seg" role="group">${o.valores.map(([v, valor, nome]) => `<button data-act="casa-op" data-k="${k}" data-v="${v}" aria-pressed="${escolha[k] === v}">${/^#/.test(valor) ? `<i class="casa-cor" style="background:${valor}"></i>` : ""}${esc(nome || rotuloOpcao(v, valor))}</button>`).join("")}</div></div>`).join("")}</div>` : ""}`;
}
const rotuloOpcao = (v, valor) =>
  /^#/.test(valor) ? v.charAt(0).toUpperCase() + v.slice(1).replace(/-/g, " ") : valor;

ACOES_EXTRAS["casa-ir"] = (b, id) => {
  const c = COMODO[id];
  if (!c || !doMundoCasa(c)) return;
  const casa = minhaCasa();
  if (!temComodo(c)) {
    if (c.libera) {
      react(
        "idle",
        `A biblioteca secreta abre com <b>${c.libera} páginas</b>. Você tem ${S.leitura.total || 0}.`,
        3200
      );
      return;
    }
    if (S.leitura.saldo < c.preco) {
      react(
        "worried",
        `Faltam <b>${c.preco - S.leitura.saldo} páginas</b> para a ${esc(c.nome.toLowerCase())}. Bora ler!`,
        3000
      );
      return;
    }
    if (!b.dataset.certeza) {
      b.dataset.certeza = "1";
      b.querySelector(".tag").textContent = `Comprar por ${c.preco} p.?`;
      return;
    }
    S.leitura.saldo -= c.preco;
    casa.tem.push(c.id);
    fx.big = true;
    react("party", `Mudança feita! A estante agora fica na <b>${esc(c.nome.toLowerCase())}</b>.`, 3200);
  }
  casa.comodo = c.id;
  commit();
};
ACOES_EXTRAS["casa-op"] = b => {
  const casa = minhaCasa();
  const c = COMODO[casa.comodo];
  if (
    !c ||
    !c.opcoes ||
    !c.opcoes[b.dataset.k] ||
    !c.opcoes[b.dataset.k].valores.some(([v]) => v === b.dataset.v)
  )
    return;
  casa.opcoes[c.id] = { ...(casa.opcoes[c.id] || {}), [b.dataset.k]: b.dataset.v };
  commit();
};

/** Limpa a casa que vem da vitrine de um amigo. */
function limparCasa(x) {
  if (!x || typeof x !== "object" || !COMODO[x.comodo]) return casaPadrao();
  const opcoes = {};
  const c = COMODO[x.comodo];
  const salvas = x.opcoes && typeof x.opcoes === "object" ? x.opcoes[c.id] || {} : {};
  const limpas = {};
  for (const [k, o] of Object.entries(c.opcoes || {}))
    if (o.valores.some(([v]) => v === salvas[k])) limpas[k] = salvas[k];
  opcoes[c.id] = limpas;
  return { comodo: c.id, tem: [c.id], opcoes };
}
