/*
  Desenho do Prumi em SVG: corpo, rosto de cada humor, água, roupas por cima.
*/
"use strict";

/* ================= Prumi, o mascote ================= */
const RM = (() => {
  try {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    return false;
  }
})();

const BODY = "M60 24C86 24 100 44 100 63C100 86 77 108 60 133C43 108 20 86 20 63C20 44 34 24 60 24Z";

const WAVE = "M-120 0Q-105-5-90 0T-60 0T-30 0T0 0T30 0T60 0T90 0T120 0T150 0T180 0V170H-120Z";

const lvlFor = f => (f > 0 ? 133 - Math.pow(Math.min(1, f), 0.62) * 111 : 148);

let mid = 0;

function mouthAt(m) {
  if (m === "happy" || m === "party") return { y: 74.5, xs: [54.5, 65.5], open: true };
  if (m === "drink" || m === "sleepy") return null;
  if (m === "worried") return { y: 82, xs: [55, 65] };
  if (m === "upset" || m === "sad") return { y: 79.5, xs: [55, 65] };
  if (m === "cry") return { y: 77, xs: [55.5, 64.5] };
  if (m === "focus") return { y: 81, xs: [55.5, 64.5] };
  return { y: 78.6, xs: [55.5, 64.5] };
}

const fangs = (m, blood) => {
  const a = mouthAt(m);
  if (!a) return "";
  return a.xs
    .map(
      (x, i) =>
        `<path d="M${x - 2.2} ${a.y}L${x + 2.2} ${a.y}L${x} ${a.y + 5.2}Z" fill="#FFFFFF" stroke="#111" stroke-width=".9" stroke-linejoin="round"/>${blood && i === 1 ? `<path d="M${x} ${a.y + 5}Q${x + 0.9} ${a.y + 8} ${x} ${a.y + 9.6}Q${x - 0.9} ${a.y + 8} ${x} ${a.y + 5}Z" fill="#B00020"/>` : ""}`
    )
    .join("");
};

const lips = (m, c, w = 5.6, op = 1) => {
  if (m === "happy" || m === "party")
    return `<path d="M49 74Q60 92 71 74Z" fill="none" stroke="${c}" stroke-width="${w * 0.6}" stroke-linejoin="round" opacity="${op}"/>`;
  if (m === "drink" || m === "sleepy")
    return `<ellipse cx="60" cy="79.5" rx="4.6" ry="4.4" fill="none" stroke="${c}" stroke-width="${w * 0.5}" opacity="${op}"/>`;
  if (m === "worried")
    return `<path d="M50 82Q55 77.5 60 82Q65 86.5 70 82" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
  if (m === "focus")
    return `<path d="M54 81H66" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
  return `<path d="M52 77Q60 85 68 77" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
};

const closedEyes = m => ["happy", "party", "drink", "sleepy", "cry"].includes(m);

/*
  Desenha o Prumi. Opções:
  mood (rosto), fill (0 a 1, quanto de água), size (largura em px), eq (roupas por slot),
  p (personalidade, para a água e efeitos), semL/semR e armL/armR (braços, usados nas poses da dupla),
  vivo (true nos Prumis principais: deixa o mundo adicionar camadas, como óculos de sol ou caixão).
*/
function prumi({ mood = "idle", fill = 0, size = 96, eq, p, semL, semR, armL: armLx, armR: armRx, vivo }) {
  const e = eq || (typeof S !== "undefined" && S.equip) || {};
  const it = s => (e[s] && ITEM[e[s]] ? ITEM[e[s]] : null);
  const id = "pm" + ++mid,
    lvl = lvlFor(fill).toFixed(1);
  const blush = `<ellipse class="blush" cx="38" cy="73" rx="6.5" ry="3.6"/><ellipse class="blush" cx="82" cy="73" rx="6.5" ry="3.6"/>`;
  let face = "",
    up = false,
    extra = "",
    inner = "";
  switch (mood) {
    case "happy":
    case "party":
      face =
        `<path class="st" d="M41 65Q47 57 53 65"/><path class="st" d="M67 65Q73 57 79 65"/><path class="ink" d="M49 74Q60 92 71 74Z"/>` +
        blush;
      up = true;
      if (mood === "party")
        extra = `<path class="spk" d="M12 28l2.4 5.6 5.6 2.4-5.6 2.4-2.4 5.6-2.4-5.6-5.6-2.4 5.6-2.4z"/><path class="spk s2" d="M108 18l2 4.6 4.6 2-4.6 2-2 4.6-2-4.6-4.6-2 4.6-2z"/><path class="spk s3" d="M110 96l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6z"/>`;
      break;
    case "drink":
      face =
        `<path class="st" d="M41 64Q47 58 53 64"/><path class="st" d="M67 64Q73 58 79 64"/><ellipse class="ink" cx="60" cy="79" rx="4.2" ry="4.6"/>` +
        blush;
      inner = `<circle class="bub" cx="48" cy="126" r="3"/><circle class="bub" cx="64" cy="128" r="2.2"/><circle class="bub" cx="72" cy="124" r="2.6"/>`;
      break;
    case "sleepy":
      face =
        `<path class="st" d="M41 63Q47 68 53 63"/><path class="st" d="M67 63Q73 68 79 63"/><ellipse class="ink" cx="60" cy="80" rx="3.2" ry="2.6"/>` +
        blush;
      extra = `<text class="zz" x="94" y="40" font-size="15">z</text><text class="zz z2" x="98" y="32" font-size="20">Z</text>`;
      break;
    case "worried":
      face = `<path class="st" d="M40 55L52 50.5"/><path class="st" d="M80 55L68 50.5"/><ellipse class="ink eye" cx="47" cy="64" rx="3.5" ry="4.4"/><ellipse class="ink eye" cx="73" cy="64" rx="3.5" ry="4.4"/><path class="st" d="M50 82Q55 77.5 60 82Q65 86.5 70 82"/>`;
      extra = `<path class="sweat" d="M100 36q6 8.5 0 12q-6-3.5 0-12z"/>`;
      break;
    case "focus":
      face = `<path class="st" d="M40 57L53 60"/><path class="st" d="M80 57L67 60"/><ellipse class="ink eye" cx="47" cy="66" rx="3.5" ry="3.8"/><ellipse class="ink eye" cx="73" cy="66" rx="3.5" ry="3.8"/><path class="st" d="M54 81H66"/>`;
      if (!it("hat"))
        extra = `<path class="band" d="M24 46Q60 34 96 46"/><path class="band" d="M96 46l9-6M96 46l10 3" style="stroke-width:4"/>`;
      break;
    case "upset":
      face =
        `<path class="st" d="M40 54.5L52 58"/><path class="st" d="M80 54.5L68 58"/><ellipse class="ink eye" cx="47" cy="64.5" rx="3.4" ry="3.6"/><ellipse class="ink eye" cx="73" cy="64.5" rx="3.4" ry="3.6"/><path class="st" d="M52 82Q60 76 68 82"/>` +
        blush;
      extra = `<path class="huff" d="M98 50q5-2 8 1M100 56q5-1 7 2" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/>`;
      break;
    case "sad":
      face = `<path class="st" d="M40 56L52 52.5"/><path class="st" d="M80 56L68 52.5"/><ellipse class="ink eye" cx="47" cy="65" rx="3.6" ry="4.4"/><ellipse class="ink eye" cx="73" cy="65" rx="3.6" ry="4.4"/><circle cx="48.2" cy="63.4" r="1.2" fill="#fff"/><circle cx="74.2" cy="63.4" r="1.2" fill="#fff"/><path class="st" d="M51 83Q60 75 69 83"/>`;
      extra = `<path class="tear" d="M44 71Q47 76 44 78Q41 76 44 71Z"/>`;
      break;
    case "cry":
      face = `<path class="st" d="M41 61Q47 66 53 61"/><path class="st" d="M67 61Q73 66 79 61"/><path class="st" d="M40 54L51 51M80 54L69 51"/><path class="ink" d="M51 85Q52 76 60 76Q68 76 69 85Q60 81 51 85Z"/>`;
      extra = `<path class="tear t1" d="M43 66Q46 72 43 74Q40 72 43 66Z"/><path class="tear t2" d="M77 66Q80 72 77 74Q74 72 77 66Z"/><g class="cloud"><path d="M78 6Q78 -1 85 0Q88 -6 95 -3Q102 -5 103 2Q109 3 107 8Z" fill="#8C8A96"/><path class="drop1" d="M86 12l-1.5 4M94 12l-1.5 4M101 12l-1.5 4" stroke="#7FA2FF" stroke-width="1.6" stroke-linecap="round"/></g>`;
      break;
    default:
      face =
        `<ellipse class="ink eye" cx="47" cy="64" rx="3.7" ry="4.7"/><ellipse class="ink eye" cx="73" cy="64" rx="3.7" ry="4.7"/><path class="st" d="M52 77Q60 85 68 77"/>` +
        blush;
  }
  const hand = it("hand"),
    hp = up ? [112, 52] : [111, 83];
  const armL = semL ? "" : armLx || (up ? "M21 69Q10 63 8 52" : "M21 71Q12 74 9 83"),
    armR = semR ? "" : armRx || (up ? "M99 69Q110 63 112 52" : "M99 71Q108 74 111 83");
  const top = it("top"),
    tw =
      typeof THEMES !== "undefined" && typeof S !== "undefined"
        ? waterOf(p)
        : { spd: 2.6, amp: 5, part: "spark" },
    wv = wavePath(tw.amp);
  const parts =
    fill > 0
      ? [
          [44, 20, 0],
          [62, 30, 1.1],
          [74, 14, 2.2]
        ]
          .map(
            ([x, y, dl]) =>
              `<g transform="translate(${x} ${y})"><g class="part" style="animation-delay:${dl}s">${PART[tw.part]("#fff")}</g></g>`
          )
          .join("")
      : "";
  const skin = it("skin"),
    str = it("string"),
    bgI = it("bg"),
    pet = it("pet"),
    back = it("back"),
    wr = it("wrist"),
    mo = it("mouth"),
    ck = it("cheek"),
    lp = up ? [8, 52] : [9, 83],
    cintura = it("waist"),
    bottons = it("pins");
  // Camadas extras que o mundo pode adicionar (ex.: emo-efeitos.js: caixão e óculos de sol)
  const efeitoMundo = vivo && typeof MUNDO_FX !== "undefined" ? MUNDO_FX[p || S.persona] : null;
  const camadas =
    efeitoMundo && efeitoMundo.camadasPrumi
      ? efeitoMundo.camadasPrumi({ mood, temRosto: !!it("face"), temCenario: !!bgI })
      : { fundo: "", rosto: "" };
  return `<svg class="prumi m-${mood}" style="--ws:${tw.spd}s${skin ? `;--mink:${skin.ink}` : ""}" viewBox="0 -6 120 154" width="${size}" height="${Math.round(size * 1.28)}" role="img" aria-label="Prumi">
    <defs><clipPath id="${id}"><path d="${BODY}"/></clipPath></defs>
    ${camadas.fundo}${bgI ? `<g class="bgi">${bgI.svg()}</g>` : ""}${pet ? `<g class="pet">${pet.svg()}</g>` : ""}
    <g class="swing">${str ? str.svg() : `<line class="string" x1="60" y1="-6" x2="60" y2="19"/>`}<g class="hop">
      ${back ? back.svg() : ""}
      <rect class="cap" x="51.5" y="16.5" width="17" height="10" rx="3.5"/>
      <path class="body" d="${BODY}"${skin ? ` style="fill:${skin.color}"` : ""}/>
      <g clip-path="url(#${id})">${top ? top.svg() : ""}${cintura ? cintura.svg() : ""}${bottons ? bottons.svg() : ""}<g class="waterg${top ? " wet" : ""}" data-lvl="${lvl}" transform="translate(0 ${lvl})"><g transform="translate(-20 -3)"><path class="wave2" d="${wv}"/></g><path class="wave" d="${wv}"/>${parts}</g>${inner}</g>
      <path class="outline" d="${BODY}"/>${top ? "" : `<path class="shine" d="M34 54Q36 40 49 35"/>`}
      ${it("neck") ? it("neck").svg() : ""}
      <g class="arm l"><path class="armp" d="${armL}"/>${wr ? wr.svg(lp[0], lp[1]) : ""}</g>
      <g class="arm r"><path class="armp" d="${armR}"/>${hand ? hand.svg(hp[0], hp[1]) : ""}</g>
      ${face}${ck ? ck.svg(mood) : ""}${mo ? mo.svg(mood) : ""}${it("face") ? it("face").svg(mood) : ""}${camadas.rosto}${it("hair") ? it("hair").svg() : ""}${it("hat") ? it("hat").svg() : ""}${extra}
    </g></g></svg>`;
}
