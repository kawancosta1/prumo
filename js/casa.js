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
const vasoPlanta = (x, y, s = 1, cor = "#C4683A") =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-8 0H8L6 14H-6Z" fill="${cor}" stroke="#141416" stroke-width="1"/><path d="M0 0Q-10 -12 -14 -20M0 0Q2 -16 -2 -26M0 0Q10 -10 14 -18" stroke="#3F7A3A" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="-14" cy="-20" rx="5" ry="3" fill="#5FA05A" transform="rotate(-30 -14 -20)"/><ellipse cx="-2" cy="-26" rx="3" ry="5" fill="#5FA05A"/><ellipse cx="14" cy="-18" rx="5" ry="3" fill="#5FA05A" transform="rotate(30 14 -18)"/></g>`;
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
    desc: "Sofá, abajur de chão e um quadro na parede.",
    opcoes: {
      sofa: {
        nome: "Sofá",
        valores: [
          ["vermelho", "#B23A3A"],
          ["musgo", "#5E7A3A"],
          ["azul", "#33558C"],
          ["mostarda", "#D49A2A"]
        ]
      },
      parede: {
        nome: "Parede",
        valores: [
          ["areia", "#EADBC4"],
          ["salvia", "#C9D6C0", "Sálvia"],
          ["cinza", "#D2D2D8"],
          ["vinho", "#6E2A35"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op } = c;
      const sofa = op.sofa,
        escuro = escurecer(sofa, 0.72);
      return `<rect width="${W}" height="${chaoY}" fill="${op.parede}"/><rect y="${chaoY - 14}" width="${W}" height="14" fill="#F2EDE4" stroke="#C9BFAF"/>
        <g transform="translate(70 30)"><rect width="78" height="56" fill="#3A2A1E"/><rect x="5" y="5" width="68" height="46" fill="#9EC6D8"/><path d="M5 51L28 26L44 40L56 30L73 46V51Z" fill="#5E8C4A"/><circle cx="58" cy="16" r="6" fill="#F2D06B"/></g>
        <g transform="translate(0 ${chaoY})">${piso(W, 64, "#B98552", "#9C6B3E")}</g>
        <ellipse cx="100" cy="${chaoY + 30}" rx="90" ry="14" fill="#E9D7B8" stroke="#C9B48E"/>
        <g transform="translate(40 ${chaoY - 70})"><rect x="8" y="0" width="122" height="44" rx="10" fill="${escuro}"/><rect x="0" y="30" width="138" height="34" rx="9" fill="${sofa}" stroke="#141416" stroke-width="1.4"/><rect x="-4" y="18" width="22" height="46" rx="8" fill="${escuro}" stroke="#141416" stroke-width="1.4"/><rect x="120" y="18" width="22" height="46" rx="8" fill="${escuro}" stroke="#141416" stroke-width="1.4"/><path d="M69 32V60" stroke="${escuro}" stroke-width="1.6"/><rect x="8" y="64" width="6" height="8" fill="#3A2A1E"/><rect x="124" y="64" width="6" height="8" fill="#3A2A1E"/><rect x="96" y="14" width="24" height="20" rx="5" fill="#F2EDE4" stroke="#141416" stroke-width="1" transform="rotate(8 108 24)"/></g>
        <g transform="translate(20 ${chaoY - 116})"><path d="M-14 0H14L8 22H-8Z" fill="#F2E3B8" stroke="#141416" stroke-width="1.2"/><path d="M0 22V116" stroke="#3A3A44" stroke-width="2.4"/><ellipse cx="0" cy="118" rx="12" ry="3" fill="#3A3A44"/><path d="M-30 50L0 22L30 50" fill="#FFF3C4" opacity=".25"/></g>
        ${c.leitor(66, chaoY - 118)}${c.estante()}`;
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
      const { W, chaoY, op } = c;
      const az = op.azulejo,
        arm = op.armario;
      let azulejos = "";
      for (let y = 92; y < chaoY - 70; y += 14)
        for (let x = 0; x < 214; x += 14)
          azulejos +=
            c.escolha.azulejo === "xadrez"
              ? ((x + y) / 14) % 2 >= 1
                ? `<rect x="${x}" y="${y}" width="14" height="14" fill="${az}"/>`
                : ""
              : c.escolha.azulejo === "portugues"
                ? `<rect x="${x + 1}" y="${y + 1}" width="12" height="12" fill="none" stroke="${az}" stroke-width=".8"/><circle cx="${x + 7}" cy="${y + 7}" r="3" fill="none" stroke="${az}" stroke-width="1"/>`
                : `<rect x="${x + 0.5}" y="${y + 0.5}" width="13" height="6" rx="1" fill="${az}" opacity=".55"/><rect x="${x + 7.5}" y="${y + 7.5}" width="13" height="6" rx="1" fill="${az}" opacity=".55"/>`;
      return `<rect width="${W}" height="${chaoY}" fill="#F6EFE2"/><rect y="92" width="214" height="${chaoY - 162}" fill="#FBFAF6"/>${azulejos}
        <g transform="translate(20 20)">${[0, 1, 2].map(i => `<rect x="${i * 62}" y="0" width="58" height="56" rx="3" fill="${arm}" stroke="#141416" stroke-width="1.2"/><circle cx="${i * 62 + 50}" cy="46" r="2" fill="#6E6C78"/>`).join("")}</g>
        <g transform="translate(232 26)"><rect width="74" height="60" fill="#8FC7F2" stroke="#F2EDE4" stroke-width="5"/><path d="M37 0V60M0 30H74" stroke="#F2EDE4" stroke-width="3"/>${vasoPlanta(18, 52, 0.7)}${vasoPlanta(56, 52, 0.6, "#5A8CA8")}</g>
        <g transform="translate(0 ${chaoY})">${(() => {
          let s = `<rect width="${W}" height="64" fill="#EDE6D8"/>`;
          for (let y = 0, i = 0; y < 64; y += 16, i++)
            for (let x = i % 2 ? 16 : 0; x < W; x += 32)
              s += `<rect x="${x}" y="${y}" width="16" height="16" fill="#C9C2B2"/>`;
          return s;
        })()}</g>
        <g transform="translate(0 ${chaoY - 70})"><rect x="0" y="0" width="214" height="10" fill="#6E6C78"/><rect x="4" y="10" width="206" height="60" fill="${arm}" stroke="#141416" stroke-width="1.2"/>${[0, 1, 2].map(i => `<rect x="${12 + i * 66}" y="18" width="58" height="44" rx="2" fill="none" stroke="#141416" stroke-width=".8"/><rect x="${36 + i * 66}" y="22" width="10" height="2.4" rx="1" fill="#6E6C78"/>`).join("")}${caneca(40, -1)}<g transform="translate(150 -16)"><rect width="34" height="16" rx="2" fill="#E0312F" stroke="#141416" stroke-width="1"/><path d="M3 4H31M3 9H24" stroke="#F2EDE4" stroke-width="1.4"/></g></g>
        ${c.leitor(78, chaoY - 128, 58)}${c.estante()}`;
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
      const verde = noite ? "#2F4A2A" : "#6FAE4F";
      const tronco = (x, h) =>
        `<rect x="${x - 6}" y="${chaoY - h}" width="12" height="${h + 10}" fill="#6E4A2A" stroke="#3A2A1E" stroke-width="1"/><circle cx="${x}" cy="${chaoY - h}" r="34" fill="${noite ? "#24452A" : "#4F8F3E"}"/><circle cx="${x - 22}" cy="${chaoY - h + 14}" r="22" fill="${noite ? "#2A5030" : "#5FA04A"}"/><circle cx="${x + 20}" cy="${chaoY - h + 10}" r="24" fill="${noite ? "#2A5030" : "#5FA04A"}"/>`;
      let lugar = "";
      if (escolha.lugar === "rede")
        lugar = `${tronco(22, 150)}<rect x="200" y="${chaoY - 96}" width="8" height="106" fill="#6E4A2A" stroke="#3A2A1E"/><path d="M26 ${chaoY - 92}Q115 ${chaoY - 20} 204 ${chaoY - 92}" fill="none" stroke="#3A2A1E" stroke-width="1.2"/><path d="M36 ${chaoY - 84}Q115 ${chaoY - 6} 194 ${chaoY - 84}L196 ${chaoY - 74}Q115 ${chaoY + 6} 34 ${chaoY - 74}Z" fill="#E0312F" stroke="#141416" stroke-width="1.2"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${50 + i * 30} ${chaoY - 66 + Math.abs(i - 2) * -7}V${chaoY - 54 + Math.abs(i - 2) * -7}" stroke="#F2C318" stroke-width="3"/>`).join("")}${c.leitor(84, chaoY - 118, 58)}`;
      else if (escolha.lugar === "cadeira")
        lugar = `${tronco(30, 140)}<g transform="translate(70 ${chaoY - 50})"><path d="M0 50L30 0M60 50L44 6" stroke="#8C6A3A" stroke-width="3"/><path d="M8 8L44 4L52 40L18 44Z" fill="#2F6FD6" stroke="#141416" stroke-width="1"/>${[0, 1, 2].map(i => `<path d="M${10 + i * 12} 7L${20 + i * 12} 43" stroke="#F2F2F2" stroke-width="4"/>`).join("")}</g>${c.leitor(78, chaoY - 106, 58)}`;
      else
        lugar = `${tronco(30, 140)}<path d="M50 ${chaoY + 12}L190 ${chaoY + 6}L206 ${chaoY + 40}L40 ${chaoY + 46}Z" fill="#E0312F" stroke="#141416" stroke-width="1"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${58 + i * 24} ${chaoY + 11}L${54 + i * 26} ${chaoY + 44}" stroke="#F2F2F2" stroke-width="5" opacity=".8"/>`).join("")}${c.leitor(96, chaoY - 54, 58)}`;
      return `${ceuSVG(id + "c", W, chaoY + 4, hora)}
        <g fill="${noite ? "#3A2A1E" : "#C9A06A"}" stroke="#6E4A2A" stroke-width=".8">${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 19} ${chaoY - 40}l8 -8 8 8V${chaoY}H${i * 19}Z"/>`).join("")}<rect y="${chaoY - 28}" width="${W}" height="5"/><rect y="${chaoY - 12}" width="${W}" height="5"/></g>
        <rect y="${chaoY}" width="${W}" height="64" fill="${verde}"/>${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 37) % W} ${chaoY + 6 + ((i * 13) % 52)}l2 -6 2 6" stroke="${noite ? "#1F3520" : "#4F8F3E"}" stroke-width="1.2" fill="none"/>`).join("")}
        ${noite ? Array.from({ length: 6 }, (_, i) => `<circle class="pisca-casa" style="animation-delay:${i * 0.6}s" cx="${40 + i * 50}" cy="${chaoY - 50 + (i % 3) * 18}" r="1.8" fill="#E8F27A"/>`).join("") : ""}
        ${lugar}${c.estante()}`;
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
      const ceuH = chaoY - 40;
      let vista = ceuSVG(id + "v", W, ceuH, hora);
      if (escolha.vista === "mar")
        vista += `<rect y="${ceuH - 46}" width="${W}" height="46" fill="${hora === "noite" ? "#1B2E57" : "#3E8CC4"}"/>${[0, 1, 2].map(i => `<path d="M${20 + i * 110} ${ceuH - 30 + i * 8}q8 -4 16 0t16 0" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6"/>`).join("")}<path d="M260 ${ceuH - 46}l10 -14 10 14Z" fill="#F2F2F2"/>`;
      else if (escolha.vista === "montanhas")
        vista += `<path d="M0 ${ceuH}L60 ${ceuH - 70}L110 ${ceuH - 30}L170 ${ceuH - 90}L240 ${ceuH - 20}L300 ${ceuH - 64}L360 ${ceuH - 24}V${ceuH}Z" fill="${hora === "noite" ? "#2A3550" : "#6E8CA8"}"/><path d="M150 ${ceuH - 70}L170 ${ceuH - 90}L188 ${ceuH - 70}Z" fill="#F2F2F2"/>`;
      else
        vista += [0, 1, 2, 3, 4, 5, 6, 7, 8]
          .map(i => {
            const h = 30 + ((i * 37) % 60),
              x = i * 42;
            let janelas = "";
            for (let y = ceuH - h + 6; y < ceuH - 6; y += 10)
              for (let jx = x + 6; jx < x + 32; jx += 10)
                janelas += `<rect x="${jx}" y="${y}" width="4" height="5" fill="${hora === "noite" && (jx + y) % 3 ? "#FFE27A" : "rgba(255,255,255,.35)"}"/>`;
            return `<rect x="${x}" y="${ceuH - h}" width="38" height="${h}" fill="${hora === "noite" ? "#1E2338" : "#7A8396"}"/>${janelas}`;
          })
          .join("");
      return `${vista}<rect y="${ceuH}" width="${W}" height="40" fill="#E8DFD0"/>
        <g stroke="#3A3A44" stroke-width="2.4"><path d="M0 ${chaoY - 54}H${W}"/>${Array.from({ length: 19 }, (_, i) => `<path d="M${i * 20 + 6} ${chaoY - 54}V${chaoY}"/>`).join("")}</g>
        <g transform="translate(0 ${chaoY})">${(() => {
          let s = `<rect width="${W}" height="64" fill="#C4683A"/>`;
          for (let y = 0; y < 64; y += 16)
            for (let x = (y / 16) % 2 ? -12 : 0; x < W; x += 24)
              s += `<rect x="${x}" y="${y}" width="24" height="16" fill="none" stroke="#A8522A"/>`;
          return s;
        })()}</g>
        ${vasoPlanta(12, chaoY - 12, 1.3)}${vasoPlanta(196, chaoY - 10, 1.1, "#5A8CA8")}
        <g transform="translate(46 ${chaoY - 66})"><rect x="6" y="0" width="100" height="48" rx="16" fill="${op.poltrona}" stroke="#141416" stroke-width="1.4"/><rect x="-6" y="30" width="124" height="34" rx="10" fill="${op.poltrona}" stroke="#141416" stroke-width="1.4"/><rect x="-10" y="22" width="22" height="42" rx="9" fill="${escurecer(op.poltrona, 0.8)}" stroke="#141416" stroke-width="1.4"/><rect x="100" y="22" width="22" height="42" rx="9" fill="${escurecer(op.poltrona, 0.8)}" stroke="#141416" stroke-width="1.4"/></g>
        ${c.leitor(70, chaoY - 112, 60)}${caneca(182, chaoY - 4, "#2F6FD6")}${c.estante()}`;
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
          ["azul", "#C8D6E8"],
          ["verde", "#2F4A3A"],
          ["madeira", "#8C6A4A"]
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
      const { W, chaoY, op } = c;
      const notas = ["#F2C318", "#8FD3FF", "#FF9EB5", "#9FE29A"];
      return `<rect width="${W}" height="${chaoY}" fill="${op.parede}"/>
        <g transform="translate(26 26)"><rect width="110" height="70" rx="3" fill="#C9A06A" stroke="#6E4A2A" stroke-width="4"/>${notas.map((n, i) => `<rect x="${10 + i * 24}" y="${10 + (i % 2) * 22}" width="20" height="18" fill="${n}" transform="rotate(${i % 2 ? 4 : -5} ${20 + i * 24} ${19 + (i % 2) * 22})"/><circle cx="${20 + i * 24}" cy="${12 + (i % 2) * 22}" r="1.6" fill="#E0312F"/>`).join("")}<path d="M14 52H60M14 58H48" stroke="#6E4A2A" stroke-width="1.2"/></g>
        <g transform="translate(0 ${chaoY})">${piso(W, 64, "#8C6A4A", "#6E4E30")}</g>
        <g transform="translate(14 ${chaoY - 62})"><rect x="0" y="0" width="190" height="10" rx="2" fill="#6E4A2A" stroke="#3A2A1E"/><rect x="6" y="10" width="8" height="62" fill="#6E4A2A"/><rect x="176" y="10" width="8" height="62" fill="#6E4A2A"/><rect x="120" y="10" width="56" height="40" fill="#5E4026" stroke="#3A2A1E"/><path d="M128 24H168M128 36H168" stroke="#3A2A1E"/>
          <g transform="translate(150 -46)"><path d="M0 46V20L18 6" stroke="#3A3A44" stroke-width="2.4" fill="none"/><path d="M10 -2L30 10L22 18Z" fill="#3A3A44"/><path d="M26 14L60 60H-4Z" fill="${op.luz}" opacity=".3"/><ellipse cx="0" cy="46" rx="10" ry="3" fill="#3A3A44"/></g>
          <path d="M70 -2L96 -6L122 -2V2H70Z" fill="#FBF7EC" stroke="#141416" stroke-width=".8"/><rect x="34" y="-14" width="22" height="14" fill="#2F6FD6" stroke="#141416" stroke-width=".8"/><rect x="36" y="-22" width="18" height="8" fill="#E0312F" stroke="#141416" stroke-width=".8"/></g>
        ${c.leitor(66, chaoY - 124, 58)}
        <g transform="translate(60 ${chaoY - 46})"><rect x="0" y="0" width="56" height="10" rx="4" fill="#3A3A44"/><path d="M28 10V44M10 44H46" stroke="#3A3A44" stroke-width="3"/></g>
        ${c.estante()}`;
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
    desc: "Paredes de pedra, velas e um banco que já foi caixão.",
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
      const { W, chaoY, op } = c;
      let pedras = "";
      for (let y = 0, i = 0; y < chaoY; y += 22, i++)
        for (let x = i % 2 ? -20 : 0; x < W; x += 40)
          pedras += `<rect x="${x + 1}" y="${y + 1}" width="38" height="20" rx="3" fill="#3A3644" stroke="#25222C"/>`;
      const vela = (x, y, h) =>
        `<g transform="translate(${x} ${y})"><rect x="-4" y="${-h}" width="8" height="${h}" fill="#F2EAD3" stroke="#141416" stroke-width=".8"/><path d="M-4 ${-h + 4}q2 6 0 10" stroke="#E8DCC0" fill="none"/><path class="chama-casa" d="M0 ${-h - 12}Q5 ${-h - 4} 0 ${-h}Q-5 ${-h - 4} 0 ${-h - 12}Z" fill="#FFB238"/><circle cx="0" cy="${-h - 6}" r="12" fill="#FFB238" opacity=".14"/></g>`;
      return `<rect width="${W}" height="${chaoY}" fill="#2A2733"/>${pedras}
        <g transform="translate(150 20)"><path d="M0 70V26Q0 0 30 0Q60 0 60 26V70Z" fill="${op.vitral}" stroke="#141416" stroke-width="3"/><path d="M30 0V70M0 36H60M8 14L52 58M52 14L8 58" stroke="#141416" stroke-width="1.6"/><circle cx="30" cy="30" r="8" fill="#F2EAD3" opacity=".6"/></g>
        <g transform="translate(0 ${chaoY})"><rect width="${W}" height="64" fill="#1E1B24"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 32} 0V64" stroke="#2A2733"/>`).join("")}</g>
        <g transform="translate(16 ${chaoY - 40})"><path d="M10 0H150L160 20L150 44H10L0 20Z" fill="#3A2420" stroke="#141416" stroke-width="1.6"/><path d="M14 6H146L154 20L146 38H14L6 20Z" fill="#7A0F24"/><path d="M80 10V32M72 18H88" stroke="#E8C24A" stroke-width="2.4"/></g>
        ${vela(22, chaoY - 40, 30)}${vela(200, chaoY + 18, 40)}${vela(214, chaoY + 22, 26)}
        ${c.leitor(54, chaoY - 108, 60)}${c.estante()}`;
    }
  },
  {
    id: "estudio",
    nome: "Estúdio",
    preco: 250,
    mundo: "rock",
    desc: "Espuma acústica, amplificadores e o pedestal do microfone.",
    opcoes: {
      espuma: {
        nome: "Espuma",
        valores: [
          ["preta", "#26262E"],
          ["vermelha", "#7A1F22"],
          ["azul", "#1F3A7A"]
        ]
      }
    },
    desenho: c => {
      const { W, chaoY, op } = c;
      let espuma = "";
      for (let y = 0; y < chaoY; y += 26)
        for (let x = 0; x < W; x += 26)
          espuma += `<rect x="${x + 1}" y="${y + 1}" width="24" height="24" fill="${op.espuma}"/><path d="M${x + 1} ${y + 9}H${x + 25}M${x + 1} ${y + 17}H${x + 25}" stroke="${escurecer(op.espuma, 0.7)}"/>`;
      const ampli = (x, y, w, h) =>
        `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="3" fill="#1E1F24" stroke="#141416" stroke-width="1.4"/><rect x="4" y="4" width="${w - 8}" height="10" fill="#2B2B33"/>${[0, 1, 2, 3].map(i => `<circle cx="${10 + i * ((w - 20) / 3)}" cy="9" r="2" fill="#C9CED6"/>`).join("")}<rect x="4" y="18" width="${w - 8}" height="${h - 22}" fill="#3A3A44"/><path d="M4 ${18 + (h - 22) / 2}H${w - 4}" stroke="#2B2B33"/></g>`;
      return `<rect width="${W}" height="${chaoY}" fill="#141419"/>${espuma}
        <g transform="translate(0 ${chaoY})"><rect width="${W}" height="64" fill="#2B2B33"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 40} 0L${i * 40 - 30} 64" stroke="#3A3A44"/>`).join("")}</g>
        ${ampli(8, chaoY - 60, 70, 64)}${ampli(84, chaoY - 40, 56, 44)}
        <g transform="translate(176 ${chaoY - 120})"><path d="M0 0L-10 -14" stroke="#3A3A44" stroke-width="3"/><rect x="-16" y="-24" width="9" height="14" rx="4" fill="#C9CED6" stroke="#141416" transform="rotate(-36 -11 -17)"/><path d="M0 0V126M-16 126H16" stroke="#3A3A44" stroke-width="3"/></g>
        <path d="M150 0V22" stroke="#3A3A44"/><path d="M136 22H164L170 34H130Z" fill="#E0312F"/><path d="M130 34L104 ${chaoY - 40}H196L170 34Z" fill="#FFF6C8" opacity=".12"/>
        ${c.leitor(18, chaoY - 136, 58)}${c.estante()}`;
    }
  },
  {
    id: "biblioteca",
    nome: "Biblioteca secreta",
    libera: BIBLIOTECA_PAGINAS,
    desc: `Abre quando você junta ${BIBLIOTECA_PAGINAS} páginas lidas. A estante gira e revela tudo.`,
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
      const { W, chaoY, op } = c;
      let prateleiras = "";
      for (let y = 10, k = 0; y < chaoY - 40; y += 44, k++)
        prateleiras += `<rect x="0" y="${y + 36}" width="${W}" height="6" fill="#4A2E1A"/>${lombadas(4, y, W - 8, 36, k * 5 + 1)}`;
      return `<rect width="${W}" height="${chaoY}" fill="#2E1E12"/>${prateleiras}
        <g transform="translate(232 10)"><path d="M0 0V${chaoY - 10}M30 0V${chaoY - 10}" stroke="#8C6A4A" stroke-width="3"/>${Array.from({ length: Math.floor((chaoY - 20) / 18) }, (_, i) => `<path d="M0 ${12 + i * 18}H30" stroke="#8C6A4A" stroke-width="2.4"/>`).join("")}</g>
        <g transform="translate(0 ${chaoY})">${piso(W, 64, "#5A3A22", "#3A2414")}</g>
        <ellipse cx="110" cy="${chaoY + 30}" rx="100" ry="16" fill="#7A1F22" stroke="#4A0F12"/><ellipse cx="110" cy="${chaoY + 30}" rx="82" ry="11" fill="none" stroke="#E8C24A" stroke-width="1" opacity=".6"/>
        <g transform="translate(40 ${chaoY - 70})"><path d="M10 0Q60 -14 110 0V48H10Z" fill="${op.poltrona}" stroke="#141416" stroke-width="1.4"/>${[0, 1, 2, 3].map(i => `<circle cx="${28 + i * 22}" cy="14" r="1.6" fill="#141416" opacity=".5"/><circle cx="${38 + i * 22}" cy="28" r="1.6" fill="#141416" opacity=".5"/>`).join("")}<rect x="-6" y="34" width="132" height="34" rx="8" fill="${op.poltrona}" stroke="#141416" stroke-width="1.4"/><rect x="-12" y="22" width="22" height="46" rx="9" fill="${escurecer(op.poltrona, 0.8)}" stroke="#141416" stroke-width="1.4"/><rect x="110" y="22" width="22" height="46" rx="9" fill="${escurecer(op.poltrona, 0.8)}" stroke="#141416" stroke-width="1.4"/></g>
        <g transform="translate(190 ${chaoY - 6})"><path d="M0 0V-40" stroke="#E8C24A" stroke-width="2"/><path d="M-12 -40H12L6 -56H-6Z" fill="#2F6A3A" stroke="#141416"/><ellipse cx="0" cy="0" rx="10" ry="3" fill="#E8C24A"/><path d="M-20 -24L0 -40L20 -24" fill="#FFF3C4" opacity=".2"/></g>
        ${c.leitor(78, chaoY - 118, 60)}${c.estante()}`;
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
