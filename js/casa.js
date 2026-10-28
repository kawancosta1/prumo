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
        nome: "Tapete",
        valores: [
          ["roxo", "#6A4A8C"],
          ["laranja", "#E07A3A"],
          ["cinza", "#7A7A84"]
        ]
      },
      pose: {
        nome: "Ação do Mago",
        valores: [
          ["idle", "Sentado", "Sentado"],
          ["lendo", "Lendo", "Lendo"],
          ["bebendo", "Poção", "Poção"],
          ["dormindo", "Cochilo", "Cochilo"],
          ["festa", "Festa", "Festa"]
        ]
      }
    },
    desenho: c => {
      const { W, H, chaoY, op, escolha, id } = c;
      const floorY = Math.round(H * 0.70);
      const corPuff = (escolha && escolha.puff) || "roxo";
      const poseEscolhida = (escolha && escolha.pose) || "idle";
      const mapaSpritesMago = {
        idle: "imagens/cenarios/feiticeiro/mago.png",
        lendo: "imagens/cenarios/feiticeiro/mago-lendo.png",
        bebendo: "imagens/cenarios/feiticeiro/mago-bebendo.png",
        dormindo: "imagens/cenarios/feiticeiro/mago-dormindo.png",
        festa: "imagens/cenarios/feiticeiro/mago-festa.png"
      };
      const spriteMago = mapaSpritesMago[poseEscolhida] || mapaSpritesMago.idle;
      const mostrarBlink = poseEscolhida === "idle";
      const filtroTapete =
        corPuff === "laranja"
          ? "hue-rotate(120deg) saturate(1.35) brightness(1.08)"
          : corPuff === "cinza"
            ? "grayscale(0.9) brightness(1.05)"
            : "none";

      // Motes de poeira analógica flutuando no feixe de sol pintado na parede
      const motes = [
        [248, 86, 1.3, 0],
        [218, 108, 1.0, 1.2],
        [188, 128, 1.4, 0.6],
        [156, 146, 1.1, 2.1],
        [124, 168, 1.3, 1.5],
        [275, 130, 1.2, 2.7],
        [235, 162, 1.0, 0.9]
      ]
        .map(
          ([mx, my, r, dl]) =>
            `<circle cx="${mx}" cy="${my}" r="${r}" fill="#FFF3C4" opacity="0.7" class="cenario-poeira-mote" style="animation-delay:${dl}s"/>`
        )
        .join("");

      return `
        <defs>
          <!-- Halo quente da lâmpada Edison e da vela -->
          <radialGradient id="${id}-edison-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFE885" stop-opacity="0.55"/>
            <stop offset="45%" stop-color="#F59E0B" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#D97706" stop-opacity="0"/>
          </radialGradient>
          <!-- Filtro sutil de granulação de película 1930s -->
          <filter id="${id}-sombra-guache" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#1A0F07" flood-opacity="0.58"/>
          </filter>
        </defs>

        <!-- CAMADA 0: Cenário de Fundo Pintado em Guache 1930s (Parede, Janela, Feixe de Sol e Piso) -->
        <image href="imagens/cenarios/feiticeiro/fundo.jpg" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>

        <!-- Brilho vivo pulsante na lâmpada Edison do fundo -->
        <circle cx="150" cy="${Math.round(H * 0.22)}" r="26" fill="url(#${id}-edison-glow)" class="lampada-casa" pointer-events="none"/>

        <!-- CAMADA 1: Quadro Astral na Parede Esquerda -->
        <g class="feit-item-quadro" filter="url(#${id}-sombra-guache)">
          <image href="imagens/cenarios/feiticeiro/quadro.png" x="8" y="16" width="42" height="65"/>
        </g>

        <!-- CAMADA 2: Vaso de Planta no Canto Esquerdo com Sombra de Contato -->
        <g class="feit-item-planta">
          <ellipse cx="27" cy="${floorY + 5}" rx="15" ry="4.5" fill="#160D06" opacity="0.62"/>
          <image href="imagens/cenarios/feiticeiro/planta.png" x="6" y="${floorY - 45}" width="42" height="54" filter="url(#${id}-sombra-guache)"/>
        </g>

        <!-- CAMADA 3: Baú de Madeira e Latão Encostado na Parede -->
        <g class="sotao-bau-grupo feit-item-bau">
          <ellipse cx="182" cy="${floorY + 7}" rx="30" ry="6" fill="#140B05" opacity="0.68"/>
          <image href="imagens/cenarios/feiticeiro/bau.png" x="152" y="${floorY - 45}" width="60" height="56" filter="url(#${id}-sombra-guache)"/>
        </g>

        <!-- CAMADA 4: Estante Rústica de Madeira com Vela Acesa e Planta Pendente -->
        <g class="feit-item-estante">
          <ellipse cx="284" cy="${floorY + 10}" rx="65" ry="8.5" fill="#140B05" opacity="0.68"/>
          <image href="imagens/cenarios/feiticeiro/estante.png" x="214" y="${floorY - 94}" width="140" height="114" filter="url(#${id}-sombra-guache)"/>
          <!-- Halo pulsante na chama da vela em cima da estante -->
          <circle cx="316" cy="${floorY - 88}" r="14" fill="url(#${id}-edison-glow)" class="chama-casa" pointer-events="none"/>
        </g>

        <!-- CAMADA 5: Tapete Redondo de Guache no Chão (Suporta troca de cor: Roxo / Laranja / Cinza) -->
        <g class="sotao-puff-grupo feit-item-tapete" style="filter:${filtroTapete}" data-cor="${op.puff}">
          <ellipse cx="96" cy="${floorY + 31}" rx="75" ry="31" fill="#120A05" opacity="0.52"/>
          <image href="imagens/cenarios/feiticeiro/tapete.png" x="20" y="${floorY - 4}" width="152" height="68"/>
        </g>

        <!-- CAMADA 6: Personagem Feiticeiro 1930s Sentado no Tapete com Rig de Animação Rubber-Hose -->
        <g class="prumi-leitor mago-1930s-container" data-act="mago-ciclo-pose" style="cursor:pointer">
          <!-- Sombra de contato do personagem sobre o tapete -->
          <ellipse cx="96" cy="${floorY + 34}" rx="31" ry="7.5" fill="#0E0816" opacity="0.58"/>
          <g class="mago-1930s-rig" style="transform-origin: 96px ${floorY + 32}px">
            <image href="${spriteMago}" x="52" y="${floorY - 56}" width="88" height="96"/>
            ${
              mostrarBlink
                ? `<!-- Pálpebras animadas para o piscar de olhos clássico anos 1930 -->
            <g class="mago-1930s-blink" pointer-events="none">
              <ellipse cx="90.5" cy="${floorY - 16.5}" rx="3.2" ry="4.5" fill="#F5D0A9"/>
              <ellipse cx="97.2" cy="${floorY - 15.8}" rx="3.2" ry="4.5" fill="#F5D0A9"/>
              <path d="M87.5 ${floorY - 16} Q90.5 ${floorY - 14} 93.5 ${floorY - 16}" stroke="#14100E" stroke-width="1.2" fill="none"/>
              <path d="M94.2 ${floorY - 15.3} Q97.2 ${floorY - 13.3} 100.2 ${floorY - 15.3}" stroke="#14100E" stroke-width="1.2" fill="none"/>
            </g>`
                : ""
            }
          </g>
        </g>

        <!-- CAMADA 7: Partículas de Poeira Iluminadas e Vinheta Analógica -->
        <g class="sotao-feixe-grupo" pointer-events="none">
          ${motes}
        </g>
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

ACOES_EXTRAS["mago-ciclo-pose"] = () => {
  const casa = minhaCasa();
  const ordem = ["idle", "lendo", "bebendo", "festa", "dormindo"];
  const falas = {
    idle: ["Pronto para mais um capítulo mágico!", "happy"],
    lendo: ["Estudando os segredos antigos do grimório...", "focus"],
    bebendo: ["Poção de hidratação pura! Glup, glup!", "drink"],
    festa: ["Pelas estrelas! Batemos mais uma meta!", "party"],
    dormindo: ["Zzz... sonhando com bibliotecas infinitas...", "sleepy"]
  };
  const atual = (casa.opcoes && casa.opcoes.sotao && casa.opcoes.sotao.pose) || "idle";
  const prox = ordem[(ordem.indexOf(atual) + 1) % ordem.length];
  casa.opcoes.sotao = { ...(casa.opcoes.sotao || {}), pose: prox };
  const [msg, humor] = falas[prox] || falas.idle;
  if (typeof react === "function") react(humor, msg, 2800);
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
