/*
  Base dos temas: cores de cada mundo, água, padrão do fundo e modo claro/escuro.
*/
"use strict";

/* ---------- mundos: tema + água de cada personalidade ---------- */
/* L/D: [bg, surface, ink, accent, water, mascot] */
const THEMES = {}; // cada arquivo em mundos/ preenche a sua parte

const TH = p => THEMES[p || S.persona] || THEMES.zen;

function themeVar(p) {
  const pid = p || S.persona,
    th = TH(pid),
    vid =
      (themePreview && themePreview.p === pid && themePreview.v) || (S.themeBy && S.themeBy[pid]) || "base";
  return th.vars.find(x => x.id === vid) || th.vars[0];
}

function waterOf(p) {
  const th = TH(p),
    v = themeVar(p);
  return { ...th.water, part: v.part || th.water.part, name: v.wn || th.water.name };
}

const PART = {
  tear: c => `<path d="M0 -5Q4 0 3 2.5A3 3 0 0 1 -3 2.5Q-4 0 0 -5Z" fill="${c}"/>`,
  bolt: c => `<path d="M1.5 -6L-3 1H0L-1.5 6L3 -1H0Z" fill="#FFD23F"/>`,
  leaf: c =>
    `<path d="M-4 3Q-4 -5 4 -4Q4 4 -4 3Z" fill="#5E9E5A"/><path d="M-4 3L2 -2" stroke="#2E6B2A" stroke-width=".7"/>`,
  spark: c => `<path d="M0 -5L1.2 -1.2L5 0L1.2 1.2L0 5L-1.2 1.2L-5 0L-1.2 -1.2Z" fill="#fff"/>`,
  gem: c => `<path d="M0 -4L4 0L0 5L-4 0Z" fill="#FFF3C4"/>`,
  ice: c =>
    `<rect x="-3.5" y="-3.5" width="7" height="7" rx="1.2" fill="#fff" fill-opacity=".85" stroke="#9BE7FF" stroke-width=".8"/>`,
  note: c =>
    `<path d="M1 -5V2.5" stroke="#fff" stroke-width="1.4"/><ellipse cx="-1" cy="3" rx="2.4" ry="1.8" fill="#fff"/><path d="M1 -5Q4 -4 4 -1" stroke="#fff" stroke-width="1.4" fill="none"/>`,
  star: c =>
    `<path d="M0 -5L1.5 -1.5L5 -1.2L2.3 1.2L3 5L0 3L-3 5L-2.3 1.2L-5 -1.2L-1.5 -1.5Z" fill="#FF4FB0"/>`,
  flag: c => `<path d="M-4 -3H4L0 4Z" fill="#F2C14E"/>`,
  pixel: c => `<rect x="-2.5" y="-2.5" width="5" height="5" fill="#fff" fill-opacity=".85"/>`,
  petal: c => `<ellipse rx="2.4" ry="4" fill="#FFE1EC" transform="rotate(30)"/>`,
  bit: c =>
    `<text y="3" font-size="8" text-anchor="middle" fill="#D7FFE0" font-family="monospace" font-weight="700">1</text>`,
  bat: c => `<path d="${BAT}" fill="${c}" transform="scale(.42)"/>`,
  heartb: c =>
    `<path d="M0 4.6L-4.2 0.4A2.5 2.5 0 0 1 -0.3 -3.2L0.7 -1.1L-0.8 0.8L0.5 2.3Z" fill="${c}"/><path d="M0.8 4.8L1.7 2.3L0.4 0.8L1.9 -1.1L1 -3A2.5 2.5 0 0 1 4.8 0.4Z" fill="${c}"/>`,
  drop: c => `<path d="M0 -5Q4 0 3 2.5A3 3 0 0 1 -3 2.5Q-4 0 0 -5Z" fill="#7A0F24"/>`,
  ripple: c => `<circle r="3.2" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.2"/>`,
  plus: c => `<path d="M0 -4V4M-4 0H4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
  heart: c => `<path d="M0 4L-3.6 0.6A2.1 2.1 0 0 1 0 -2.2A2.1 2.1 0 0 1 3.6 0.6Z" fill="#FFD1DC"/>`
};

const wavePath = a => `M-120 0Q-105 ${-a} -90 0T-60 0T-30 0T0 0T30 0T60 0T90 0T120 0T150 0T180 0V170H-120Z`;

const hostTheme = document.documentElement.getAttribute("data-theme");

function isDark() {
  if (S.mode === "dark") return true;
  if (S.mode === "light") return false;
  if (hostTheme === "dark") return true;
  if (hostTheme === "light") return false;
  try {
    return matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) {
    return false;
  }
}

const hx = h => {
  h = h.replace("#", "");
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
};

const mix = (a, b, t) => {
  const A = hx(a),
    Bc = hx(b);
  return (
    "#" +
    A.map((v, i) =>
      Math.round(v + (Bc[i] - v) * t)
        .toString(16)
        .padStart(2, "0")
    ).join("")
  );
};

let themePreview = null;

/*
  Efeitos especiais de cada mundo (opcional). Um mundo pode definir, no seu arquivo em mundos/:
    MUNDO_FX.emo = { trocaAba() {...}, confete: { cores: [...], formas: ["morcego", "gota"] } }
  O CSS de decoração de cada mundo fica em estilos/mundos/<nome>.css, usando html[data-mundo="<nome>"].
*/
const MUNDO_FX = {};
/** Texto trocado pelo mundo atual (ex.: "Fechar o dia" vira "Querido diário" no emo). */
const textoMundo = (chave, padrao) => {
  const f = MUNDO_FX[S.persona];
  return (f && f.textos && f.textos[chave]) || padrao;
};
/** O mundo atual tem esse gancho? (ex.: temGancho("poemaDoDia")) */
const temGancho = nome => {
  const f = MUNDO_FX[S.persona];
  return !!(f && f[nome]);
};
/** Chama um gancho do mundo atual e devolve o resultado (ou "" se o mundo não tiver). */
const ganchoMundo = (nome, ...args) => {
  const f = MUNDO_FX[S.persona];
  return f && typeof f[nome] === "function" ? f[nome](...args) : "";
};
/** Enfeite do cartão do Prumi, se o mundo tiver (ex.: a lua de hoje no emo). */
const enfeiteMundo = () => {
  const f = MUNDO_FX[S.persona];
  return f && f.enfeiteHero ? f.enfeiteHero() : "";
};

function applyTheme(personaOverride, varOverride) {
  const pid = personaOverride || S.persona,
    th = TH(pid),
    dark = isDark(),
    k = dark ? 1 : 0;
  document.documentElement.dataset.mundo = pid; // permite CSS próprio de cada mundo
  themePreview = varOverride ? { p: pid, v: varOverride } : personaOverride ? { p: pid, v: "base" } : null;
  const v = themeVar(pid),
    wo = waterOf(pid);
  // O sub-tema pode trazer cores inteiras próprias (L/D); senão usa as do mundo
  const cores = dark ? v.D || th.D : v.L || th.L;
  document.documentElement.dataset.variante = v.id; // permite CSS próprio de cada sub-tema
  let [bg, surf, ink, acc, wat, masc] = cores;
  if (v.a) acc = v.a[k];
  if (v.w) wat = v.w[k];
  const r = document.documentElement,
    set = (n, val) => r.style.setProperty(n, val);
  r.setAttribute("data-theme", dark ? "dark" : "light");
  set("--bg", bg);
  set("--surface", surf);
  set("--ink", ink);
  set("--accent", acc);
  set("--estudo", acc);
  set("--accent-soft", mix(surf, acc, dark ? 0.22 : 0.14));
  set("--on-accent", lum(acc) > 0.42 ? "#111111" : "#FFFFFF");
  set("--muted", mix(ink, bg, 0.42));
  set("--line", mix(bg, ink, dark ? 0.16 : 0.13));
  set("--sunken", mix(bg, ink, dark ? 0.05 : 0.06));
  set("--water", wat);
  set("--water-soft", mix(surf, wat, dark ? 0.24 : 0.16));
  set("--mascot", masc);
  {
    const mk = cores[6];
    if (mk) set("--mink", mk);
    else r.style.removeProperty("--mink");
  }
  set("--f-display", (v.f || th.font) + ', "Bricolage Grotesque", system-ui, sans-serif');
  set("--ds", v.ds || th.ds);
  set("--color-scheme", dark ? "dark" : "light");
  r.style.colorScheme = dark ? "dark" : "light";
  const pc = mix(bg, ink, dark ? 0.07 : 0.06);
  const pats = v.pat || th.pat || [wo.part, wo.part],
    tint = str =>
      str
        .replace(/fill="#[0-9A-Fa-f]{3,6}"/g, `fill="${pc}"`)
        .replace(/stroke="#[0-9A-Fa-f]{3,6}"/g, `stroke="${pc}"`);
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><g transform="translate(22 26) scale(1.3)">${tint(PART[pats[0]](pc))}</g><g transform="translate(70 72) scale(1.1) rotate(20)">${tint(PART[pats[1] || pats[0]](pc))}</g></svg>`;
  document.body.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(tile)}")`;
}

function lum(h) {
  const [r, g, b] = hx(h).map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

try {
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    applyTheme();
  });
} catch (e) {}
