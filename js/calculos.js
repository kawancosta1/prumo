/*
  Contas que outras partes usam: água do dia, sequência de hábitos, próxima repetição etc.
*/
"use strict";

/* ================= cálculos ================= */
const waterToday = (d = today()) => (S.water[d] || []).reduce((a, b) => a + b.ml, 0);

function waterPace() {
  const w = hm2min(S.wake),
    sl = hm2min(S.sleep) > w ? hm2min(S.sleep) : hm2min(S.sleep) + 1440;
  let n = hm2min(nowHM());
  if (n < w && sl > 1440 && n + 1440 <= sl) n += 1440;
  const f = Math.min(1, Math.max(0, (n - w) / (sl - w)));
  return Math.round((S.waterGoal * f) / 50) * 50;
}

const habitDue = (h, d) => h.days.includes(wIdx(d));

const habitDone = (h, d) => (S.habitLog[d] || []).includes(h.id);
const isDiaDeRespiro = d => !!(S && S.respiro && S.respiro[d]);

function habitStreak(h) {
  let d = today(),
    c = 0,
    guard = 0;
  if (!habitDone(h, d) && !isDiaDeRespiro(d)) d = addDays(d, -1);
  while (guard++ < 400) {
    if (habitDue(h, d)) {
      if (habitDone(h, d) || isDiaDeRespiro(d)) c++;
      else break;
    } else if (habitDone(h, d) || isDiaDeRespiro(d)) c++;
    d = addDays(d, -1);
  }
  return c;
}

function habitMissedYesterday(h) {
  let d = addDays(today(), -1),
    g = 0;
  if (isDiaDeRespiro(d)) return false;
  while (!habitDue(h, d) && g++ < 7) {
    d = addDays(d, -1);
    if (isDiaDeRespiro(d)) return false;
  }
  return !habitDone(h, d) && h.created && h.created <= d;
}

function studyStreak() {
  const days = new Set(S.sessions.map(s => s.date));
  let d = today(),
    c = 0;
  if (!days.has(d)) d = addDays(d, -1);
  while (days.has(d)) {
    c++;
    d = addDays(d, -1);
  }
  return c;
}

const subjName = id => {
  const s = S.subjects.find(x => x.id === id);
  return s ? s.name : "";
};

const subjColor = id => {
  const s = S.subjects.find(x => x.id === id);
  return s ? s.color : "var(--geral)";
};

function dueTag(n, suffix = "") {
  return `<span class="due ${n < 0 ? "soon" : n <= 3 ? "soon" : n <= 7 ? "mid" : ""}">${n < 0 ? `há ${-n} ${-n === 1 ? "dia" : "dias"}` : n === 0 ? "hoje" : n === 1 ? "amanhã" : "em " + n + " dias"}${suffix}</span>`;
}

function nextDate(rep, from) {
  if (rep === "daily") return addDays(from, 1);
  if (rep === "weekdays") {
    let d = addDays(from, 1);
    while (wIdx(d) > 4) d = addDays(d, 1);
    return d;
  }
  if (rep === "weekly") return addDays(from, 7);
  if (rep === "monthly") {
    const p = parse(from);
    const day = p.getDate();
    const n = new Date(p.getFullYear(), p.getMonth() + 1, 1);
    const last = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
    n.setDate(Math.min(day, last));
    return ymd(n);
  }
  return null;
}

function bdayNext(mmdd) {
  const t = today(),
    y = parse(t).getFullYear();
  let d = `${y}-${mmdd}`;
  if (d < t) d = `${y + 1}-${mmdd}`;
  return d;
}
