/*
  Coisas do app em geral:
  - Busca: lupa no topo (ou Ctrl+K, ou "/"): acha tarefas, livros, diário, matérias, provas, hábitos, pessoas e eventos.
  - Pendências: sem internet, Ajustes mostra o que está esperando pra ir pra conta.
  - Tema pela hora: modo "Pela hora" fica claro de dia e escuro à noite (das 18h às 6h).
  - Volume: um controle só pra todos os sons do app (avisos, pets, mundos).
*/
"use strict";

/* ===================== busca ===================== */
let buscaAberta = null;
const LUPA = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>`;
function resultadosBusca(q) {
  const n = norm(q.trim());
  if (n.length < 2) return [];
  const tem = s => typeof s === "string" && norm(s).includes(n);
  const r = [];
  for (const x of S.tasks)
    if (tem(x.title) || (x.sub || []).some(s => tem(s.t)))
      r.push({
        tipo: "Tarefa",
        titulo: x.title,
        sub: relDay(x.date) + (x.done ? " · feita" : ""),
        ir: { tab: "hoje", dia: x.date, tarefa: x.id },
        peso: x.done ? 1 : 3
      });
  for (const l of S.livros || [])
    if (tem(l.titulo) || tem(l.autor))
      r.push({ tipo: "Livro", titulo: l.titulo, sub: l.autor || "", ir: { tab: "estante" }, peso: 2 });
  for (const [d, j] of Object.entries(S.journal || {}))
    if (j && tem(j.note)) {
      const i = norm(j.note).indexOf(n);
      r.push({
        tipo: "Diário",
        titulo: "…" + j.note.slice(Math.max(0, i - 20), i + 40) + "…",
        sub: fmtLong(d),
        ir: { tab: "hoje", dia: d },
        peso: 1
      });
    }
  for (const m of S.subjects)
    if (tem(m.name))
      r.push({ tipo: "Matéria", titulo: m.name, sub: "Estudos", ir: { tab: "estudos" }, peso: 2 });
  for (const e of S.exams)
    if (tem(e.title))
      r.push({ tipo: "Prova", titulo: e.title, sub: fmtLong(e.date), ir: { tab: "estudos" }, peso: 2 });
  for (const h of S.habits)
    if (tem(h.name))
      r.push({ tipo: "Hábito", titulo: h.name, sub: "Hábitos", ir: { tab: "social" }, peso: 2 });
  for (const p of S.people)
    if (tem(p.name))
      r.push({ tipo: "Pessoa", titulo: p.name, sub: "Social", ir: { tab: "social" }, peso: 2 });
  for (const ev of S.events)
    if (tem(ev.title))
      r.push({
        tipo: "Evento",
        titulo: ev.title,
        sub: ev.date ? fmtLong(ev.date) : "",
        ir: { tab: "social" },
        peso: 2
      });
  for (const c of S.shopping)
    if (tem(c.text))
      r.push({ tipo: "Compras", titulo: c.text, sub: "Lista de compras", ir: { tab: "dieta" }, peso: 1 });
  return r.sort((a, b) => b.peso - a.peso).slice(0, 30);
}
function abrirBusca() {
  if (!S.onboarded) return;
  if (buscaAberta) return buscaAberta.querySelector("input").focus();
  const caixa = document.createElement("div");
  caixa.className = "busca-geral";
  caixa.setAttribute("role", "dialog");
  caixa.setAttribute("aria-label", "Buscar no Prumo");
  caixa.innerHTML = `<div class="busca-cartao"><div class="busca-campo">${LUPA}<input type="search" placeholder="Buscar tarefas, livros, diário..." autocomplete="off" aria-label="Buscar"><button class="icon" data-b="fechar" aria-label="Fechar busca">${ICON.x}</button></div><ul class="busca-lista" role="listbox"></ul></div>`;
  document.body.appendChild(caixa);
  buscaAberta = caixa;
  const input = caixa.querySelector("input"),
    lista = caixa.querySelector(".busca-lista");
  let achados = [];
  const desenhar = () => {
    achados = resultadosBusca(input.value);
    lista.innerHTML =
      input.value.trim().length < 2
        ? `<li class="busca-dica">Digite pelo menos 2 letras. Atalho: Ctrl+K ou /</li>`
        : achados.length
          ? achados
              .map(
                (a, i) =>
                  `<li><button type="button" data-i="${i}" ${i === 0 ? 'class="sel"' : ""}><span class="busca-tipo">${a.tipo}</span><span class="busca-titulo">${esc(a.titulo)}</span><span class="note">${esc(a.sub)}</span></button></li>`
              )
              .join("")
          : `<li class="busca-dica">Nada com "${esc(input.value.trim())}".</li>`;
  };
  const ir = a => {
    fecharBusca();
    tab = a.ir.tab;
    if (a.ir.dia) selDay = a.ir.dia;
    if (a.ir.tarefa) openTask = a.ir.tarefa;
    fx.enter = true;
    render();
    window.scrollTo(0, 0);
    if (a.ir.tarefa)
      setTimeout(() => {
        const el = document.querySelector(`[data-act="open"][data-id="${a.ir.tarefa}"]`);
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: RM ? "auto" : "smooth" });
      }, 80);
  };
  input.addEventListener("input", desenhar);
  input.addEventListener("keydown", e => {
    if (e.key === "Escape") fecharBusca();
    if (e.key === "Enter" && achados[0]) ir(achados[0]);
  });
  caixa.addEventListener("click", e => {
    const b = e.target.closest("[data-i]");
    if (b) return ir(achados[+b.dataset.i]);
    if (e.target === caixa || e.target.closest('[data-b="fechar"]')) fecharBusca();
  });
  desenhar();
  input.focus();
}
function fecharBusca() {
  if (buscaAberta) buscaAberta.remove();
  buscaAberta = null;
}
document.addEventListener("keydown", e => {
  const digitando = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || "");
  if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    abrirBusca();
  } else if (e.key === "/" && !digitando && !buscaAberta) {
    e.preventDefault();
    abrirBusca();
  }
});
{
  const bt = document.getElementById("busca-bt");
  if (bt) bt.addEventListener("click", abrirBusca);
}

/* ===================== pendências sem internet ===================== */
const NOMES_PARTES = {
  tasks: "Tarefas",
  water: "Água",
  habitLog: "Hábitos marcados",
  habits: "Hábitos",
  journal: "Diário",
  livros: "Estante",
  sessions: "Tempo de estudo",
  subjects: "Matérias",
  exams: "Provas",
  pets: "Pets",
  coins: "Gotas",
  meals: "Refeições",
  shopping: "Compras",
  people: "Pessoas",
  events: "Eventos",
  perfil: "Perfil",
  equip: "Roupas do Prumi"
};
function pendenciasNuvem() {
  if (!sujo || !ref || !base) return [];
  const mudou = Object.keys(S).filter(k => JSON.stringify(S[k]) !== JSON.stringify(base.state[k]));
  const nomes = mudou.map(k => NOMES_PARTES[k]).filter(Boolean);
  return nomes.length ? [...new Set(nomes)] : mudou.length ? ["Ajustes"] : [];
}
function pendenciasHTML() {
  const p = pendenciasNuvem();
  if (!p.length) return "";
  return `<div class="setrow"><div class="lbl"><b>Esperando pra ir pra conta</b><span class="note">${esc(p.join(", "))}. Fica salvo aqui e vai sozinho quando a internet voltar.</span></div><button class="btn small" data-act="enviar-agora">Tentar agora</button></div>`;
}
ACOES_EXTRAS["enviar-agora"] = () => {
  lastPushed = 0;
  push();
  setTimeout(render, 1500);
};

/* ===================== tema pela hora ===================== */
const noiteAgora = () => {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  return h >= 18 || h < 6;
};
{
  const escuroAntes = isDark;
  isDark = () => (S.mode === "hora" ? noiteAgora() : escuroAntes());
  let ultimo = null;
  setInterval(() => {
    if (S.mode !== "hora") return (ultimo = null);
    const agora = noiteAgora();
    if (ultimo !== null && agora !== ultimo) {
      applyTheme();
      softRender();
    }
    ultimo = agora;
  }, 60000);
}

/* ===================== volume ===================== */
const volumeApp = () =>
  S.notif && typeof S.notif.volume === "number" ? Math.max(0, Math.min(100, S.notif.volume)) : 100;
{
  const pegarAntes = pegarAudio;
  pegarAudio = function () {
    const ctx = pegarAntes();
    if (!ctx) return ctx;
    if (!ctx.mestrePrumo) {
      // todo som do app passa por aqui (quem usa ctx.destination recebe o volume geral)
      const real = ctx.destination;
      const g = ctx.createGain();
      g.connect(real);
      try {
        Object.defineProperty(ctx, "destination", { get: () => g, configurable: true });
        ctx.mestrePrumo = g;
      } catch (e) {
        return ctx;
      }
    }
    ctx.mestrePrumo.gain.value = (volumeApp() / 100) ** 1.6; // curva: o meio do controle já fica baixinho
    return ctx;
  };
}
function volumeAjustesHTML() {
  return `<div class="setrow"><div class="lbl"><b>Volume dos sons</b><span class="note">Vale pra avisos, pets e os sons dos mundos.</span></div><input type="range" min="0" max="100" step="5" value="${volumeApp()}" data-change="volume-app" aria-label="Volume dos sons" class="volume-app"></div>`;
}
MUDANCAS_EXTRAS["volume-app"] = el => {
  S.notif = { ...S.notif, volume: Math.max(0, Math.min(100, +el.value || 0)) };
  persist();
  if (typeof tocarSom === "function") tocarSom("aviso", true);
};
