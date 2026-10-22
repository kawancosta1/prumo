/*
  Funções pequenas usadas no app todo: datas, textos, ícones e o link do Google Agenda.
*/
"use strict";

/* ================= helpers ================= */
const pad = n => String(n).padStart(2, "0");

const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parse = s => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const addDays = (s, n) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
};

const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);

const today = () => ymd(new Date());

const nowHM = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const hm2min = s => {
  const [h, m] = (s || "0:0").split(":").map(Number);
  return h * 60 + (m || 0);
};

const wIdx = s => (parse(s).getDay() + 6) % 7;

/* segunda = 0 */
const mondayOf = s => addDays(s, -wIdx(s));

const newId = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

const esc = s =>
  String(s ?? "").replace(
    /[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const userG = () => (typeof S !== "undefined" && S.gender) || "m";

const flex = (m, f, n) => {
  const g = userG();
  return g === "f" ? f : g === "n" ? (n ?? m) : m;
};

const fmtML = n =>
  n >= 1000 ? (n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " L" : n + " mL";

const fmtMin = m => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? pad(m % 60) : ""}` : `${m} min`);

const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

const DIAS_CURTO = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

const DIAS_SEG = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

const BYDAY = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
];

const fmtLong = s => {
  const d = parse(s);
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
};

const fmtShort = s => {
  const d = parse(s);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};

function relDay(s) {
  const n = diffDays(today(), s);
  return n === 0
    ? "hoje"
    : n === 1
      ? "amanhã"
      : n === -1
        ? "ontem"
        : n > 1 && n < 7
          ? DIAS[parse(s).getDay()]
          : fmtShort(s);
}

const AREAS = { geral: "Geral", estudo: "Estudo", dieta: "Dieta", social: "Social" };

const PRIO = ["Nenhuma", "Baixa", "Média", "Alta"];

const REPEAT = {
  "": "Não repete",
  daily: "Todo dia",
  weekdays: "Dias úteis",
  weekly: "Toda semana",
  monthly: "Todo mês"
};

const RRULE = {
  daily: "RRULE:FREQ=DAILY",
  weekdays: "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
  weekly: "RRULE:FREQ=WEEKLY",
  monthly: "RRULE:FREQ=MONTHLY"
};

const SLOTS = [
  ["cafe", "Café da manhã"],
  ["almoco", "Almoço"],
  ["lanche", "Lanche"],
  ["janta", "Jantar"]
];

const SUBJ_COLORS = ["#2340C4", "#1C8350", "#AE2C76", "#A9670E", "#5B3FB8", "#0E7C86", "#C0352B"];

const REV_STEPS = [1, 3, 7, 15, 30];

const ICON = {
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M12 13v5M9.5 15.5h5"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  rep: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 5h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  cake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V12h16v9"/><path d="M2 21h20"/><path d="M4 16c2 1.5 4 1.5 5.3 0 1.4 1.5 3.6 1.5 5 0 1.3 1.5 3.7 1.5 5.7 0"/><path d="M12 8v4M12 4.5v.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  trophy:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a4 4 0 0 1-4 4M7 5H4v2a4 4 0 0 0 4 4"/></svg>'
};

/* Link do Google Agenda (o Samsung Calendar sincroniza com a conta Google) */
function gcal({ title, date, time, dur = 60, details = "", location = "", recur = "" }) {
  const p = new URLSearchParams({ action: "TEMPLATE", text: title });
  const [y, m, d] = date.split("-").map(Number);
  const f = (dt, t) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}` +
    (t ? `T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00` : "");
  if (time) {
    const [h, mi] = time.split(":").map(Number);
    const s = new Date(Date.UTC(y, m - 1, d, h, mi));
    const e = new Date(s.getTime() + dur * 6e4);
    p.set("dates", f(s, 1) + "/" + f(e, 1));
    p.set("ctz", "America/Sao_Paulo");
  } else {
    const s = new Date(Date.UTC(y, m - 1, d));
    const e = new Date(s.getTime() + 864e5);
    p.set("dates", f(s, 0) + "/" + f(e, 0));
  }
  p.set("details", details || "Criado no Prumo");
  if (location) p.set("location", location);
  if (recur) p.set("recur", recur);
  return "https://calendar.google.com/calendar/render?" + p.toString();
}

const pick = a => a[Math.floor(Math.random() * a.length)];
