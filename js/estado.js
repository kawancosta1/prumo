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
  usuario: "", // nome de usuário (@), escolhido em Ajustes quando há conta
  top8: [], // uids dos amigos no Top 8
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
  minutos: {}, // minutos de leitura por dia (js/leitura-dia.js)
  meta: { paginas: 10, minutos: 25 }, // meta do dia: páginas OU minutos de leitura e estudo
  escudos: 0, // escudos guardados para a sequência
  diasEscudo: [], // dias salvos por um escudo
  decor: {
    movel: "clara",
    fundo: "liso",
    enfeites: [],
    quarto: {},
    casa: { comodo: "quarto", tem: ["quarto"], opcoes: {} }
  }, // quarto (js/quarto.js) e cômodos da casa (js/casa.js)
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
  name: "",
  gender: "m",
  onboarded: false,
  welcomed: false,
  semConta: false, // escolheu "Continuar sem conta" na tela de entrada (js/telas/entrar.js)
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
  relatarErros: false,
  resumoVisto: "",
  perfil: perfilPadrao(), // perfil estilo MySpace/Orkut/MSN
  fotolog: [], // fotos do Fotolog, uma por dia fechado
  sons: { chuva: true, pagina: true }, // sons do clima no emo (js/sons.js)
  notif: { som: true, vibrar: true }, // som e vibração dos avisos (js/notificacoes.js)
  lembretes: { ligado: false, agua: true, tarefas: true, habitos: true, provas: true, tokens: [] }, // lembretes com o app fechado (js/lembretes.js)
  noites: [], // dias em que o app foi usado depois das 22h
  rock: { energia: 0, starAte: 0, usos: 0 }, // Star Power do mundo Roqueiro (js/mundos/rock-efeitos.js)
  pets: {}, // bichinhos adotados (js/pets.js)
  organizar: {}, // revisão da semana (js/organizar.js)
  habitosFolga: {}, // dias de folga dos hábitos: { habitId: [dias] } (js/habitos-mais.js)
  mundos: {}, // dados dos outros mundos: roça do sertanejo, boss do gamer... (js/mundos/*-extras.js)
  emo: { cartas: [], cadeado: null, mixtape: { nome: "", faixas: [] } }, // cartas, cadeado do diário e mixtape (js/mundos/emo-extras.js)
  livros: [], // Estante de leitura (js/leitura.js)
  privacidade: { estante: true, fotolog: true, humor: false, status: false }, // o que os amigos veem (humor e status começam escondidos)
  consentimento: null, // aceite da política de privacidade e dos dados de saúde: { versao, em } (js/telas/entrar.js)
  avisosCelular: false, // notificações no celular (js/pwa.js)
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
  b.exams.forEach(e => delete e.editandoPlano);
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
    p.group = p.group || "amigos";
    p.notes = p.notes || "";
    p.phone = p.phone || "";
    p.history = Array.isArray(p.history) ? p.history : p.last ? [{ date: p.last, note: "" }] : [];
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
  for (const k of ["depoAceitos", "depoVistos", "top8"]) if (!Array.isArray(b.perfil[k])) b.perfil[k] = [];
  b.privacidade = {
    estante: true,
    fotolog: true,
    humor: false,
    status: false,
    ...(b.privacidade && typeof b.privacidade === "object" ? b.privacidade : {})
  };
  if (!b.consentimento || typeof b.consentimento !== "object" || !b.consentimento.versao)
    b.consentimento = null;
  if (!Array.isArray(b.fotolog)) b.fotolog = [];
  if (!Array.isArray(b.noites)) b.noites = [];
  const rk = b.rock && typeof b.rock === "object" ? b.rock : {};
  b.rock = {
    ...rk,
    energia: Math.max(0, Math.min(100, +rk.energia || 0)),
    starAte: +rk.starAte || 0,
    usos: +rk.usos || 0,
    bis: +rk.bis || 0,
    bisDia: typeof rk.bisDia === "string" ? rk.bisDia : "",
    jogo: rk.jogo && typeof rk.jogo === "object" ? rk.jogo : { dia: "", recorde: 0, vezes: 0 }, // ensaio relâmpago
    banda: rk.banda && typeof rk.banda === "object" ? rk.banda : {}, // amigos na banda (js/mundos/rock-extras.js)
    ingressos: Array.isArray(rk.ingressos) ? rk.ingressos : [] // ingressos colecionáveis
  };
  // Mundo Emo: cartas pro futuro, cadeado do diário e a mixtape montada (js/mundos/emo-extras.js)
  const em = b.emo && typeof b.emo === "object" ? b.emo : {};
  b.emo = {
    ...em,
    cartas: Array.isArray(em.cartas) ? em.cartas : [],
    cadeado: em.cadeado && typeof em.cadeado === "object" ? em.cadeado : null,
    mixtape: em.mixtape && typeof em.mixtape === "object" ? em.mixtape : { nome: "", faixas: [] }
  };
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
  if (!b.leitura.decor.quarto || typeof b.leitura.decor.quarto !== "object") b.leitura.decor.quarto = {};
  {
    const casa = b.leitura.decor.casa;
    b.leitura.decor.casa = {
      comodo: casa && typeof casa.comodo === "string" ? casa.comodo : "quarto",
      tem: casa && Array.isArray(casa.tem) ? casa.tem : ["quarto"],
      opcoes: casa && casa.opcoes && typeof casa.opcoes === "object" ? casa.opcoes : {}
    };
  }
  if (!Array.isArray(b.leitura.comprados)) b.leitura.comprados = [];
  if (!b.leitura.minutos || typeof b.leitura.minutos !== "object") b.leitura.minutos = {};
  if (!b.leitura.meta || typeof b.leitura.meta !== "object") b.leitura.meta = { paginas: 10, minutos: 25 };
  b.leitura.meta = {
    paginas: Math.max(1, Math.min(500, +b.leitura.meta.paginas || 10)),
    minutos: Math.max(5, Math.min(600, +b.leitura.meta.minutos || 25))
  };
  b.leitura.escudos = Math.max(0, Math.min(3, +b.leitura.escudos || 0));
  if (!Array.isArray(b.leitura.diasEscudo)) b.leitura.diasEscudo = [];
  if (!b.sons || typeof b.sons !== "object") b.sons = {};
  b.sons = { chuva: b.sons.chuva !== false, pagina: b.sons.pagina !== false };
  if (!b.notif || typeof b.notif !== "object") b.notif = {};
  b.notif = { som: b.notif.som !== false, vibrar: b.notif.vibrar !== false };
  if (!b.lembretes || typeof b.lembretes !== "object") b.lembretes = {};
  b.lembretes = {
    ligado: b.lembretes.ligado === true,
    agua: b.lembretes.agua !== false,
    tarefas: b.lembretes.tarefas !== false,
    habitos: b.lembretes.habitos !== false,
    provas: b.lembretes.provas !== false,
    tokens: Array.isArray(b.lembretes.tokens)
      ? b.lembretes.tokens.filter(t => typeof t === "string").slice(0, 5)
      : []
  };
  if (!b.mundos || typeof b.mundos !== "object" || Array.isArray(b.mundos)) b.mundos = {};
  if (!b.pets || typeof b.pets !== "object" || Array.isArray(b.pets)) b.pets = {}; // o resto é arrumado em petsDados() (js/pets.js) // dados de cada mundo (js/mundos/*-extras.js)
  b.relatarErros = b.relatarErros === true; // relato de erros só com aceite (js/relato-erros.js)
  if (typeof b.resumoVisto !== "string") b.resumoVisto = ""; // segunda-feira da última semana resumida (js/resumo-semana.js)
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

/*
  Sincronização que junta mudanças (em vez de "o mais novo apaga o outro"):
  - base: a última versão que este aparelho e a nuvem tinham iguais (fica em localStorage, "prumo-base").
  - sujo: este aparelho mudou algo desde a base e ainda não mandou.
  Quando chega uma versão nova da nuvem e este aparelho também mudou, junta as duas com mesclar(base, aqui, nuvem):
  o que só um lado mudou fica; listas com id (tarefas, livros, hábitos...) juntam item por item, inclusive apagados.
  Não depende do relógio dos aparelhos: a versão da nuvem é reconhecida pelo número dela (updatedAt), não por ser maior.
*/
const LS_BASE = "prumo-base";
let base = null, // { state, updatedAt, linha, enviado }
  sujo = false;
try {
  const b = JSON.parse(lsGet(LS_BASE) || "null");
  if (b && b.state && typeof b.updatedAt === "number") base = b;
} catch (e) {}
/*
  linha: os últimos números de versão que a nuvem teve, em ordem. Cada envio leva a linha que ele conhecia + o número novo.
  enviado: a última versão que ESTE aparelho mandou e a nuvem confirmou.
  Se chega uma versão cuja linha não tem o "enviado" daqui, quem mandou não viu a nossa mudança
  (ex.: celular ficou sem internet, mexeu, e voltou depois). Aí junta em vez de aceitar por cima.
*/
function guardarBase(state, versao, linha, enviado) {
  base = {
    state: JSON.parse(JSON.stringify(state)),
    updatedAt: versao,
    linha: Array.isArray(linha)
      ? linha.slice(-40)
      : base && base.updatedAt === versao
        ? base.linha || []
        : [versao],
    enviado: enviado !== undefined ? enviado : base ? base.enviado || 0 : 0
  };
  lsSet(LS_BASE, JSON.stringify(base));
}

const iguais = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);
const objetoSimples = x => x && typeof x === "object" && !Array.isArray(x);
const listaComId = x =>
  Array.isArray(x) &&
  x.length > 0 &&
  x.every(i => objetoSimples(i) && (typeof i.id === "string" || typeof i.id === "number"));
/** Junta três versões: b (base comum), l (este aparelho) e r (nuvem). */
function mesclar(b, l, r) {
  if (iguais(l, r)) return l;
  if (iguais(l, b)) return r; // só a nuvem mudou
  if (iguais(r, b)) return l; // só aqui mudou
  // os dois mudaram
  if (
    (listaComId(l) || l?.length === 0) &&
    (listaComId(r) || r?.length === 0) &&
    (b === undefined || Array.isArray(b))
  ) {
    const porId = lista => new Map((lista || []).filter(objetoSimples).map(i => [String(i.id), i]));
    const B = porId(b),
      L = porId(l),
      R = porId(r);
    const ordem = [...R.keys(), ...[...L.keys()].filter(k => !R.has(k))];
    const saida = [];
    for (const id of ordem) {
      const bi = B.get(id),
        li = L.get(id),
        ri = R.get(id);
      if (li && ri) saida.push(mesclar(bi, li, ri));
      else if (li && !ri) {
        if (!bi || !iguais(bi, li)) saida.push(li); // novo aqui (ou mudou aqui e foi apagado lá: fica)
      } else if (ri && !li) {
        if (!bi || !iguais(bi, ri)) saida.push(ri); // novo lá (ou mudou lá e foi apagado aqui: fica)
      }
    }
    return saida;
  }
  if (objetoSimples(l) && objetoSimples(r)) {
    const bb = objetoSimples(b) ? b : {};
    const saida = {};
    for (const k of new Set([...Object.keys(l), ...Object.keys(r)])) {
      const temL = k in l,
        temR = k in r,
        temB = k in bb;
      if (temL && temR) saida[k] = mesclar(bb[k], l[k], r[k]);
      else if (temL) {
        if (!temB || !iguais(bb[k], l[k])) saida[k] = l[k]; // novo aqui
      } else if (temR) {
        if (!temB || !iguais(bb[k], r[k])) saida[k] = r[k]; // novo lá
      }
    }
    return saida;
  }
  const vazio = x => x === "" || x === null || x === undefined;
  if (vazio(l) && !vazio(r)) return r; // um lado em branco e o outro preenchido: fica o preenchido (nome, @...)
  return l; // valor simples mudado nos dois: fica o deste aparelho (a mudança mais recente que a pessoa vê)
}

function prune() {
  const lim = addDays(today(), -150);
  S.sessions = S.sessions.filter(s => s.date >= lim);
  for (const o of [S.water, S.habitLog, S.mealCheck, S.carinho])
    for (const k of Object.keys(o)) if (k < lim) delete o[k];
  // diário: o que a pessoa escreveu fica para sempre; só some o dia antigo sem texto
  for (const [k, j] of Object.entries(S.journal))
    if (k < lim && !(j && (j.note || "").trim())) delete S.journal[k];
  const pl = addDays(today(), -400);
  for (const k of Object.keys(S.paid)) if (k < pl) delete S.paid[k];
  for (const k of Object.keys(S.leitura.log)) if (k < pl) delete S.leitura.log[k]; // páginas por dia: guarda um ano
  for (const k of Object.keys(S.leitura.minutos || {})) if (k < pl) delete S.leitura.minutos[k];
  for (const k of Object.keys(S.leitura.sessoesDia || {})) if (k < lim) delete S.leitura.sessoesDia[k];
  const tl = addDays(today(), -45);
  S.tasks = S.tasks.filter(t => !(t.done && t.date < tl));
  S.events = S.events.filter(e => e.date >= tl);
  S.reviews = S.reviews.filter(r => !(r.done && r.last && r.last < lim));
}

/**
 * Salva. silencioso = mudança automática do app (não da pessoa): fica no aparelho e vai junto
 * na próxima mudança de verdade, sem disputar com a nuvem na abertura do app.
 */
function persist(silencioso) {
  if (silencioso === true) {
    lsSet(LS_KEY, JSON.stringify({ state: S, updatedAt, sujo }));
    return;
  }
  if (typeof publicarPerfil === "function") publicarPerfil();
  updatedAt = Math.max(Date.now(), (base ? base.updatedAt : 0) + 1, updatedAt + 1);
  sujo = true;
  prune();
  const texto = JSON.stringify({ state: S, updatedAt, sujo });
  lsSet(LS_KEY, texto);
  tamanhoDados = texto.length;
  avisarTamanho();
  if (ref) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(push, 600);
  }
}

/* Limite do banco: tudo vai num documento do Firestore, que aceita até 1 MB.
   Avisa (uma vez por dia) quando passa de 75%, para dar tempo de fazer backup e limpar. */
const LIMITE_DADOS = 1000000;
let tamanhoDados = 0;
const usoDados = () => Math.min(1, tamanhoDados / LIMITE_DADOS);
function avisarTamanho() {
  if (usoDados() < 0.75 || typeof notificar !== "function") return;
  const k = "prumo-aviso-tamanho";
  if (lsGet(k) === today()) return;
  lsSet(k, today());
  setTimeout(
    () =>
      notificar({
        titulo: "Seus dados estão quase no limite",
        texto: `Já usam ${Math.round(usoDados() * 100)}% do espaço da conta. Veja em Ajustes.`,
        mood: "worried",
        aba: "ajustes"
      }),
    1500
  );
}

function commit() {
  const got = checkAch();
  persist();
  render();
  if (got.length) {
    const g = got[got.length - 1];
    fx.big = true;
    setTimeout(bigConfetti, 150);
    document.dispatchEvent(new CustomEvent("prumo:conquista", { detail: { id: g.id } }));
    if (typeof tocarSom === "function") setTimeout(() => (tocarSom("conquista"), vibrar("conquista")), 150);
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

let nuvemVista = false; // só manda pra nuvem depois de ver o que já está lá (senão um aparelho atrasado apaga o resto)
let tentarDeNovo = null;
function push() {
  if (!nuvemVista || !ref) return;
  clearTimeout(tentarDeNovo);
  const linha = [...((base && base.linha) || []), updatedAt].slice(-40);
  const body = { state: JSON.parse(JSON.stringify(S)), updatedAt, linha };
  lastPushed = updatedAt;
  setSync(navigator.onLine === false ? "err" : "salvando");
  writing = writing
    .then(() => ref.set(body))
    .then(
      () => {
        guardarBase(body.state, body.updatedAt, body.linha, body.updatedAt);
        if (updatedAt === body.updatedAt) {
          sujo = false;
          lsSet(LS_KEY, JSON.stringify({ state: S, updatedAt, sujo }));
        }
        setSync("ok");
      },
      e => {
        const grande = e && e.code === "invalid-argument";
        setSync(grande || (e && e.code === "invalid_argument") ? "local" : "err");
        // falhou sem ser por tamanho: tenta de novo daqui a pouco (e assim que a internet voltar)
        if (!grande) {
          lastPushed = 0;
          tentarDeNovo = setTimeout(() => sujo && push(), 20000);
        }
        if (grande && typeof notificar === "function")
          notificar({
            titulo: "Não deu pra salvar na conta",
            texto: "Seus dados passaram do limite. Faça um backup em Ajustes e apague coisas antigas.",
            mood: "worried",
            aba: "ajustes"
          });
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
  el.className =
    "sync " + (mode === "ok" ? "ok" : mode === "local" ? "local" : mode === "salvando" ? "salvando" : "");
  el.querySelector("span").textContent =
    mode === "salvando"
      ? "Salvando…"
      : mode === "ok"
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
        ? contaConfigurada()
          ? "Os dados estão só neste navegador. Entre com Google em Ajustes para salvar na nuvem."
          : "Os dados estão salvos só neste navegador"
        : mode === "err"
          ? "Sem internet agora. O que você mudar fica salvo aqui e vai pra conta quando a internet voltar."
          : "";
}

/*
  Liga os dados a uma conta. Dois caminhos:
  1. Prumo aberto como Artifact do Claude: usa window.claude (banco e usuário do Claude).
  2. GitHub Pages com Firebase configurado (js/firebase-config.js) e login com Google feito (js/conta.js).
  Sem nenhum dos dois, fica "Só neste aparelho".
*/
async function connect() {
  const c = window.claude;
  if (c && typeof c.use === "function") {
    try {
      const [db, user] = await Promise.all([c.use("db"), c.use("user")]);
      const uid = db && user ? await user.id() : null;
      if (uid) return ligarBanco(db, uid, "data/users/" + uid + "/rotina");
    } catch (e) {}
    return setSync("local");
  }
  if (contaConfigurada()) {
    const conta = await iniciarConta(); // espera o Firebase dizer se tem alguém logado
    if (conta) return ligarBanco(conta.db, conta.uid, "usuarios/" + conta.uid + "/dados/rotina");
  }
  setSync("local");
}

/* Sincroniza S com um documento do banco e liga a parceria. O mais novo (updatedAt) ganha. */
function ligarBanco(db, uid, caminho) {
  ref = db.doc(caminho);
  iniciarParceria(db, uid);
  iniciarAmigos(); // amigos, avisos e vitrine (só com a conta Google; js/amigos.js)
  ref.onSnapshot(
    snap => {
      if (snap.metadata && snap.metadata.hasPendingWrites) return;
      nuvemVista = true;
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
      receberDaNuvem(d);
      markReady();
    },
    () => {
      setSync("local");
      markReady();
    }
  );
}

/** Uma versão da nuvem chegou: decide se usa, se junta ou se manda a daqui. */
function receberDaNuvem(d) {
  const versao = d.updatedAt || 0;
  const linha = Array.isArray(d.linha) ? d.linha : null;
  if (base && versao === base.updatedAt) {
    // nada novo na nuvem
    if (sujo && updatedAt !== lastPushed) push();
    return;
  }
  if (versao === updatedAt && !sujo) {
    guardarBase(d.state, versao, linha); // já é igual ao daqui
    return;
  }
  const remoto = JSON.parse(JSON.stringify(d.state));
  // quem mandou não viu o último envio daqui? (linha da nuvem sem o nosso número)
  const passouPorCima = !!(base && base.enviado && linha && !linha.includes(base.enviado));
  if (!sujo && !passouPorCima) {
    // só a nuvem mudou: usa a da nuvem
    S = normalize(remoto);
    updatedAt = versao;
    guardarBase(remoto, versao, linha);
    lsSet(LS_KEY, JSON.stringify({ state: S, updatedAt, sujo }));
    applyTheme();
    softRender();
    return;
  }
  if (typeof guardarVersao === "function") guardarVersao("antes de juntar com outro aparelho");
  const local = JSON.parse(JSON.stringify(S));
  let junto;
  if (!base || passouPorCima) {
    // sem base comum confiável: junta tudo (nada some); no que for diferente, vale o mais novo
    const novoAqui = sujo && updatedAt >= versao;
    junto = novoAqui ? mesclar(undefined, local, remoto) : mesclar(undefined, remoto, local);
  } else junto = mesclar(JSON.parse(JSON.stringify(base.state)), local, remoto); // os dois lados mudaram: junta
  S = normalize(junto);
  guardarBase(remoto, versao, linha || [versao]);
  updatedAt = Math.max(Date.now(), versao + 1, updatedAt + 1);
  sujo = true;
  lsSet(LS_KEY, JSON.stringify({ state: S, updatedAt, sujo }));
  applyTheme();
  softRender();
  push();
  if (passouPorCima && typeof toast === "function")
    toast("Juntei as mudanças do seu outro aparelho com as daqui.", false, "happy");
}

// a internet voltou: manda o que ficou pendente
addEventListener("online", () => {
  if (sujo && ref && updatedAt !== lastPushed) push();
});
addEventListener("offline", () => ref && setSync("err"));

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
