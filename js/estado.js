/*
  Os dados do app (S), como são salvos (navegador + conta Claude) e o estado da tela.
*/
"use strict";

/* ================= estado ================= */
/* Campos do perfil estilo MySpace/Orkut/MSN (dados antigos ganham esses valores em normalize) */
const perfilPadrao = () => ({
  sobre: "",
  subnick: "",
  status: "online", // MSN: online, ausente, ocupado ou offline (aparecer offline)
  ouvindo: "", // "Ouvindo:" do MSN
  visitas: 0, // contador de visitas
  layout: "classico", // fundo do perfil
  depoAceitos: [], // depoimentos que você aprovou
  depoVistos: [] // depoimentos já aprovados ou recusados (pelo horário de envio)
});

/* Dados da leitura: registro de páginas por dia, metas, moeda "páginas" e a decoração da estante */
const leituraPadrao = () => ({
  log: {},
  metas: {},
  saldo: 0,
  total: 0,
  decor: { movel: "clara", fundo: "liso", enfeites: [] },
  comprados: []
});

const blank = () => ({
  v: 2,
  tasks: [],
  subjects: [],
  exams: [],
  sessions: [],
  classes: [],
  reviews: [],
  meals: {},
  mealCheck: {},
  shopping: [],
  water: {},
  waterGoal: 3500,
  cups: [200, 300, 500, 750],
  wake: "07:00",
  sleep: "23:00",
  name: "Kawan",
  gender: "m",
  onboarded: false,
  welcomed: false,
  persona: "zen",
  calendar: "google",
  mode: "auto",
  themeBy: {},
  themeOwned: [],
  coins: 0,
  xp: 0,
  owned: [],
  equip: {},
  equipBy: {},
  ach: {},
  paid: {},
  stats: { tasks: 0, water: 0, focus: 0, reviews: 0, talked: 0, perfect: 0, closed: 0 },
  carinho: {},
  perfil: { sobre: "", subnick: "" }, // perfil estilo MySpace (o resto dos campos vem em perfilPadrao)
  fotolog: [], // fotos do Fotolog, uma por dia fechado
  sons: { chuva: true, pagina: true }, // sons do clima no emo (js/sons.js)
  noites: [], // dias em que o app foi usado depois das 22h
  livros: [], // Estante de leitura (js/leitura.js)
  leitura: leituraPadrao(),
  parceria: { id: null, tipo: "namoro" },
  codigo: "",
  events: [],
  people: [],
  habits: [],
  habitLog: {},
  journal: {}
});

let S = blank(),
  updatedAt = 0;

const LS_KEY = "prumo-state",
  LS_TIMER = "prumo-timer";

const lsGet = k => {
  try {
    return localStorage.getItem(k);
  } catch (e) {
    return null;
  }
};

const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch (e) {}
};

function normalize(x) {
  const b = blank();
  if (!x || typeof x !== "object") return b;
  for (const k in b) if (x[k] !== undefined) b[k] = x[k];
  if ((x.v || 1) < 2) {
    /* migra a versão 1: copos de 250 mL */
    const w = {};
    for (const [d, n] of Object.entries(x.water || {}))
      if (typeof n === "number" && n > 0) w[d] = [{ t: "12:00", ml: n * 250 }];
    b.water = w;
    b.waterGoal = 3500;
  }
  for (const k of Object.keys(b.water)) if (!Array.isArray(b.water[k])) delete b.water[k];
  if (!(b.waterGoal > 0)) b.waterGoal = 3500;
  if (!Array.isArray(b.cups) || b.cups.length !== 4) b.cups = [200, 300, 500, 750];
  b.tasks.forEach(t => {
    t.prio = t.prio || 0;
    t.repeat = t.repeat || "";
    t.sub = Array.isArray(t.sub) ? t.sub : [];
  });
  b.habits.forEach(h => {
    if (!Array.isArray(h.days) || !h.days.length) h.days = [0, 1, 2, 3, 4, 5, 6];
  });
  b.people.forEach(p => {
    p.every = p.every || 0;
    p.bday = p.bday || "";
  });
  if (!b.stats || typeof b.stats !== "object") b.stats = {};
  for (const k of ["tasks", "water", "focus", "reviews", "talked", "perfect", "closed", "morcego"])
    b.stats[k] = +b.stats[k] || 0;
  if (!b.equip || typeof b.equip !== "object") b.equip = {};
  for (const k of Object.keys(b.equip)) if (!ITEM[b.equip[k]]) delete b.equip[k];
  if (!PERSONAS[b.persona]) b.persona = "zen";
  {
    const before = (b.owned || []).length;
    b.owned = (b.owned || []).filter(i => ITEM[i] && !ITEM[i].ach);
    b.coins += Math.max(0, before - b.owned.length) * 80;
  }
  for (const k of Object.keys(b.equip))
    if (!ITEM[b.equip[k]] || (ITEM[b.equip[k]].p !== b.persona && ITEM[b.equip[k]].p !== "*"))
      delete b.equip[k];
  if (!b.equipBy || typeof b.equipBy !== "object") b.equipBy = {};
  if (!b.themeBy || typeof b.themeBy !== "object") b.themeBy = {};
  if (!Array.isArray(b.themeOwned)) b.themeOwned = [];
  delete b.palette;
  delete b.ownedPal;
  if (!b.carinho || typeof b.carinho !== "object") b.carinho = {};
  if (!b.perfil || typeof b.perfil !== "object") b.perfil = {};
  b.perfil = { ...perfilPadrao(), ...b.perfil };
  for (const k of ["depoAceitos", "depoVistos"]) if (!Array.isArray(b.perfil[k])) b.perfil[k] = [];
  if (!Array.isArray(b.fotolog)) b.fotolog = [];
  if (!Array.isArray(b.noites)) b.noites = [];
  if (!Array.isArray(b.livros)) b.livros = [];
  b.livros.forEach(l => {
    for (const k of ["tags", "citacoes"]) if (!Array.isArray(l[k])) l[k] = [];
    if (!l.pago || typeof l.pago !== "object") l.pago = {};
    l.pagina = +l.pagina || 0;
    l.contadas = +l.contadas || 0;
  });
  b.leitura = { ...leituraPadrao(), ...(b.leitura && typeof b.leitura === "object" ? b.leitura : {}) };
  b.leitura.decor = { ...leituraPadrao().decor, ...b.leitura.decor };
  if (!Array.isArray(b.leitura.decor.enfeites)) b.leitura.decor.enfeites = [];
  if (!Array.isArray(b.leitura.comprados)) b.leitura.comprados = [];
  if (!b.sons || typeof b.sons !== "object") b.sons = {};
  b.sons = { chuva: b.sons.chuva !== false, pagina: b.sons.pagina !== false };
  if (!b.parceria || typeof b.parceria !== "object") b.parceria = { id: null, tipo: "namoro" };
  if (!Array.isArray(b.parceria.depoimentos)) b.parceria.depoimentos = [];
  if (!["m", "f", "n"].includes(b.gender)) b.gender = "m";
  b.v = 2;
  return b;
}

let ref = null,
  writing = Promise.resolve(),
  saveTimer = null,
  lastPushed = 0;

function prune() {
  const lim = addDays(today(), -150);
  S.sessions = S.sessions.filter(s => s.date >= lim);
  for (const o of [S.water, S.habitLog, S.mealCheck, S.journal, S.carinho])
    for (const k of Object.keys(o)) if (k < lim) delete o[k];
  const pl = addDays(today(), -400);
  for (const k of Object.keys(S.paid)) if (k < pl) delete S.paid[k];
  for (const k of Object.keys(S.leitura.log)) if (k < pl) delete S.leitura.log[k]; // páginas por dia: guarda um ano
  const tl = addDays(today(), -45);
  S.tasks = S.tasks.filter(t => !(t.done && t.date < tl));
  S.events = S.events.filter(e => e.date >= tl);
  S.reviews = S.reviews.filter(r => !(r.done && r.last && r.last < lim));
}

function persist() {
  if (typeof publicarPerfil === "function") publicarPerfil();
  updatedAt = Date.now();
  prune();
  lsSet(LS_KEY, JSON.stringify({ state: S, updatedAt }));
  if (ref) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(push, 600);
  }
}

function commit() {
  const got = checkAch();
  persist();
  render();
  if (got.length) {
    const g = got[got.length - 1];
    fx.big = true;
    setTimeout(bigConfetti, 150);
    react(
      "party",
      g.daily
        ? `${textoMundo("diaPerfeito", "Dia perfeito")}! <b>+${g.reward} gotas</b>.`
        : `Conquista: <b>${esc(g.name)}</b>! +${g.reward} gotas${g.legend ? ` e itens lendários liberados` : g.theme ? ` e um tema lendário em cada personalidade` : ""}.`,
      5000
    );
    toast(
      g.daily
        ? `${textoMundo("diaPerfeito", "Dia perfeito")}! +${g.reward} gotas`
        : `Conquista desbloqueada: ${g.name}`,
      false,
      "party"
    );
  }
}

function push() {
  const body = { state: JSON.parse(JSON.stringify(S)), updatedAt };
  lastPushed = updatedAt;
  writing = writing
    .then(() => ref.set(body))
    .then(
      () => setSync("ok"),
      e => {
        setSync(e && e.code === "invalid_argument" ? "local" : "err");
      }
    );
}

function markReady() {
  if (appReady) return;
  appReady = true;
  renderOnb();
}

function setSync(mode) {
  if (mode === "local") setTimeout(markReady, 0);
  const el = document.getElementById("sync");
  el.className = "sync " + (mode === "ok" ? "ok" : mode === "local" ? "local" : "");
  el.querySelector("span").textContent =
    mode === "ok"
      ? "Sincronizado"
      : mode === "local"
        ? "Só neste aparelho"
        : mode === "err"
          ? "Sem conexão"
          : "Carregando…";
  el.title =
    mode === "ok"
      ? "Seus dados estão salvos na sua conta e aparecem no celular e no PC"
      : mode === "local"
        ? "Os dados estão salvos só neste navegador"
        : "";
}

async function connect() {
  const c = window.claude;
  if (!c || typeof c.use !== "function") {
    setSync("local");
    return;
  }
  try {
    const [db, user] = await Promise.all([c.use("db"), c.use("user")]);
    if (!db || !user) {
      setSync("local");
      return;
    }
    const uid = await user.id();
    if (!uid) {
      setSync("local");
      return;
    }
    ref = db.doc("data/users/" + uid + "/rotina");
    iniciarParceria(db, uid);
    ref.onSnapshot(
      snap => {
        if (snap.metadata && snap.metadata.hasPendingWrites) return;
        if (!snap.exists) {
          if (hasData()) push();
          setSync("ok");
          markReady();
          return;
        }
        const d = snap.data();
        setSync("ok");
        if (!d || !d.state) {
          markReady();
          return;
        }
        if ((d.updatedAt || 0) > updatedAt) {
          S = normalize(JSON.parse(JSON.stringify(d.state)));
          updatedAt = d.updatedAt;
          lsSet(LS_KEY, JSON.stringify({ state: S, updatedAt }));
          applyTheme();
          softRender();
        } else if (updatedAt > (d.updatedAt || 0) && updatedAt !== lastPushed) {
          push();
        }
        markReady();
      },
      () => {
        setSync("local");
        markReady();
      }
    );
  } catch (e) {
    setSync("local");
  }
}

const hasData = () =>
  S.tasks.length ||
  S.subjects.length ||
  S.events.length ||
  S.people.length ||
  S.habits.length ||
  S.shopping.length ||
  Object.keys(S.meals).length ||
  Object.keys(S.water).length;

/* ================= estado da tela ================= */
let tab = "hoje",
  selDay = today(),
  mealDay = wIdx(today()),
  openTask = null,
  pendingRender = false,
  undoState = null,
  toastTimer = null,
  wipeArmed = false;

let timer = { running: false, subjectId: "", goal: 25, start: 0, acc: 0, beeped: false, label: "" };

try {
  const t = JSON.parse(lsGet(LS_TIMER) || "null");
  if (t) timer = Object.assign(timer, t);
} catch (e) {}

const saveTimerState = () => lsSet(LS_TIMER, JSON.stringify(timer));

const elapsed = () => timer.acc + (timer.running ? Date.now() - timer.start : 0);

function softRender() {
  const a = document.activeElement;
  if (a && a.closest && a.closest("#main") && /INPUT|SELECT|TEXTAREA/.test(a.tagName)) {
    pendingRender = true;
    return;
  }
  render();
}

document.addEventListener("focusout", () => {
  if (pendingRender)
    setTimeout(() => {
      const a = document.activeElement;
      if (!(a && /INPUT|SELECT|TEXTAREA/.test(a.tagName))) {
        pendingRender = false;
        render();
      }
    }, 0);
});

function toast(msg, undo, mood = "happy") {
  const t = document.getElementById("toast");
  t.innerHTML =
    `<span class="tm">${prumi({ mood, fill: Math.min(1, waterToday() / S.waterGoal), size: 28 })}</span><span>${esc(msg)}</span>` +
    (undo ? `<button data-act="undo">Desfazer</button>` : "");
  t.hidden = false;
  t.classList.remove("show");
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.hidden = true;
    undoState = null;
  }, 6000);
}

const snapUndo = () => {
  undoState = JSON.stringify(S);
};
