/*
  Entende frases como "estudar amanhã 19h #estudo !1" e transforma em tarefa.
*/
"use strict";

/* ================= captura rápida (linguagem natural) ================= */
const WD = { segunda: 0, terca: 1, quarta: 2, quinta: 3, sexta: 4, sabado: 5, domingo: 6 };

const WD_RE = "(segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo)";

const B = "(?<![\\p{L}\\d])",
  E = "(?![\\p{L}\\d])";

function nextWd(i, base) {
  const b = base || today();
  return addDays(b, (i - wIdx(b) + 7) % 7);
}

function parseQuick(raw, baseDate) {
  const t = today();
  let s = " " + raw + " ";
  const o = { title: "", date: null, time: "", area: "", prio: 0, repeat: "" };
  const take = (re, fn) => {
    s = s.replace(new RegExp(re, "iu"), (...m) => {
      const r = fn(m);
      return r === false ? m[0] : " ";
    });
  };
  take(`#(estudos?|dieta|social|geral)${E}`, m => {
    const a = norm(m[1]);
    o.area = a.startsWith("estud") ? "estudo" : a;
  });
  take(`(?<=\\s)!([123])(?=\\s)`, m => {
    o.prio = 4 - +m[1];
  });
  take(`(?<=\\s)(!{1,3})(?=\\s)`, m => {
    o.prio = m[1].length === 1 ? 3 : m[1].length === 2 ? 2 : 3;
  });
  take(`${B}(todos os dias|todo dia|diariamente)${E}`, () => {
    o.repeat = "daily";
  });
  take(`${B}(dias [úu]teis|todo dia [úu]til|de segunda a sexta)${E}`, () => {
    o.repeat = "weekdays";
  });
  take(`${B}tod[ao]s? (?:as? |os? )?${WD_RE}s?(?:-feiras?)?${E}`, m => {
    o.repeat = "weekly";
    o.date = nextWd(WD[norm(m[1])]);
  });
  take(`${B}(toda semana|semanalmente)${E}`, () => {
    o.repeat = "weekly";
  });
  take(`${B}(todo m[êe]s|mensalmente)${E}`, () => {
    o.repeat = "monthly";
  });
  take(`${B}depois de amanh[ãa]${E}`, () => {
    o.date = addDays(t, 2);
  });
  take(`${B}amanh[ãa]${E}`, () => {
    o.date = addDays(t, 1);
  });
  take(`${B}hoje${E}`, () => {
    o.date = t;
  });
  take(`${B}(?:(?:na|nesta|pr[óo]xima) )?${WD_RE}(?:-feira)?${E}`, m => {
    if (o.date) return false;
    o.date = nextWd(WD[norm(m[1])]);
  });
  take(`${B}(?:dia )?(\\d{1,2})/(\\d{1,2})(?:/(\\d{2,4}))?${E}`, m => {
    const d = +m[1],
      mo = +m[2];
    if (d < 1 || d > 31 || mo < 1 || mo > 12) return false;
    let y = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : new Date().getFullYear();
    let s2 = `${y}-${pad(mo)}-${pad(d)}`;
    if (!m[3] && s2 < t) s2 = `${y + 1}-${pad(mo)}-${pad(d)}`;
    o.date = s2;
  });
  take(`${B}dia (\\d{1,2})${E}`, m => {
    const d = +m[1];
    if (d < 1 || d > 31) return false;
    const n = new Date();
    let c = new Date(n.getFullYear(), n.getMonth(), d);
    if (ymd(c) < t) c = new Date(n.getFullYear(), n.getMonth() + 1, d);
    o.date = ymd(c);
  });
  take(`${B}(?:(?:[àa]s|at[ée]) )?(\\d{1,2})(?:h(\\d{2})?|:(\\d{2}))(?:min)?${E}`, m => {
    const h = +m[1],
      mi = +(m[2] || m[3] || 0);
    if (h > 23 || mi > 59) return false;
    o.time = `${pad(h)}:${pad(mi)}`;
  });
  take(`${B}(?:ao )?meio-dia${E}`, () => {
    o.time = "12:00";
  });
  o.title = s
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+(às|as|no|na|de|em)$/i, "");
  if (!o.date) o.date = baseDate || t;
  return o;
}

function parsedPills(p, raw) {
  if (!raw.trim()) return "";
  const a = [];
  a.push(relDay(p.date).replace(/^./, c => c.toUpperCase()));
  if (p.time) a.push(p.time);
  if (p.area) a.push(AREAS[p.area]);
  if (p.prio) a.push("Prioridade " + PRIO[p.prio].toLowerCase());
  if (p.repeat) a.push(REPEAT[p.repeat]);
  return a.map(x => `<span class="pill">${esc(x)}</span>`).join("");
}
