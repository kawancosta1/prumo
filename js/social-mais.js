/*
  Mais coisas com os amigos (aba Amigos, só com conta):
  - Desafio da semana: ranking de água e de tarefas feitas na semana (vem do campo "semana" da vitrine).
  - Sala de foco: quem está com o cronômetro ligado aparece "focando agora"; "Focar junto" liga o seu
    cronômetro pra acabar na mesma hora que o do amigo.
  - Reações: a última conquista de cada amigo aparece com botões de reação (vai pra caixa dele, tipo "reacao").
  A semana publicada ganha: agua (mL), tarefas, focoAte (quando o foco acaba) e conq ({ id, em }).
*/
"use strict";

const REACOES = { palmas: "👏", fogo: "🔥", coracao: "💛", gota: "💧" };

function aguaDaSemana() {
  const seg = mondayOf(today());
  let ml = 0;
  for (let i = 0; i < 7; i++) ml += (S.water[addDays(seg, i)] || []).reduce((a, c) => a + (c.ml || 0), 0);
  return ml;
}
const tarefasDaSemana = () => {
  const seg = mondayOf(today());
  return S.tasks.filter(x => x.done && (x.feitaEm || x.date) >= seg && (x.feitaEm || x.date) <= today())
    .length;
};
function focoTerminaEm() {
  if (typeof timer === "undefined" || !timer.running) return 0;
  const resta = timer.goal * 60e3 - elapsed();
  return resta > 30e3 ? Math.round(Date.now() + resta) : 0;
}
function ultimaConquista() {
  const [id, em] = Object.entries(S.ach || {}).sort((a, b) => (a[1] < b[1] ? 1 : -1))[0] || [];
  return id && ACH[id] ? { id, em: String(em).slice(0, 10) } : null;
}
{
  const semanaAntes = minhaSemana;
  minhaSemana = () => ({
    ...semanaAntes(),
    agua: aguaDaSemana(),
    tarefas: tarefasDaSemana(),
    focoAte: focoTerminaEm(),
    conq: ultimaConquista()
  });
}
// ligou ou desligou o foco: avisa os amigos (o perfil só é publicado quando muda)
{
  let focandoAntes = false;
  setInterval(() => {
    const agora = typeof timer !== "undefined" && timer.running;
    if (agora !== focandoAntes && typeof publicarPerfil === "function") publicarPerfil(true);
    focandoAntes = agora;
  }, 15000);
}

/** Limpeza dos campos novos da semana de um amigo (chamado por limparVitrine). */
function limparSemanaExtra(s) {
  if (!s || typeof s !== "object") return {};
  const n = (v, max) => Math.max(0, Math.min(max, +v || 0));
  const conq =
    s.conq && typeof s.conq === "object" && ACH[s.conq.id] && /^\d{4}-\d\d-\d\d$/.test(s.conq.em)
      ? { id: s.conq.id, em: s.conq.em }
      : null;
  return {
    agua: n(s.agua, 1e5),
    tarefas: n(s.tarefas, 1e4),
    focoAte: n(s.focoAte, Date.now() + 4 * 36e5),
    conq
  };
}

const semanaDoAmigo = uid => {
  const v = (amigosInfo[uid] || {}).vitrine;
  return v && v.semana && v.semana.seg === mondayOf(today()) ? v.semana : null;
};

function desafioSemanaHTML(amigos) {
  if (!amigos.length) return "";
  const eu = minhaSemana();
  const linha = [
    { nome: "Você", eu: true, s: eu },
    ...amigos.map(a => ({ nome: nomeDe(a.uid), s: semanaDoAmigo(a.uid) }))
  ];
  const tabela = (campo, fmt) =>
    linha
      .slice()
      .sort((a, b) => ((b.s && b.s[campo]) || 0) - ((a.s && a.s[campo]) || 0))
      .slice(0, 6)
      .map(
        (p, i) =>
          `<li class="${p.eu ? "eu" : ""}"><span class="desafio-pos">${["🥇", "🥈", "🥉"][i] || i + 1}</span><span class="grow">${esc(p.nome)}</span><b class="mono">${fmt((p.s && p.s[campo]) || 0)}</b></li>`
      )
      .join("");
  const fim = addDays(mondayOf(today()), 6);
  return `<section class="block"><h2 class="h2">Desafio da semana <span class="count">até ${fmtShort(fim)}</span></h2>
    <div class="desafio-grade"><div class="card"><b>💧 Quem bebe mais água</b><ol class="desafio-lista">${tabela("agua", fmtML)}</ol></div>
    <div class="card"><b>✅ Quem conclui mais tarefas</b><ol class="desafio-lista">${tabela("tarefas", n => n)}</ol></div></div>
    <span class="note">Recomeça toda segunda.</span></section>`;
}

function salaFocoHTML(amigos) {
  const agora = Date.now();
  const focando = amigos
    .map(a => ({ uid: a.uid, s: semanaDoAmigo(a.uid) }))
    .filter(x => x.s && x.s.focoAte > agora + 60e3);
  if (!focando.length) return "";
  return `<section class="block"><h2 class="h2">Focando agora <span class="count">${focando.length}</span></h2><ul class="list">${focando
    .map(x => {
      const min = Math.ceil((x.s.focoAte - agora) / 6e4);
      return `<li><div class="item"><span class="foco-ponto" aria-hidden="true"></span><div class="main"><span class="title">${esc(nomeDe(x.uid))}</span><span class="meta">mais ${min} min de foco</span></div><button class="btn small primary" data-act="focar-junto" data-id="${esc(x.uid)}">${timer.running ? "Focando" : "Focar junto"}</button></div></li>`;
    })
    .join("")}</ul></section>`;
}
ACOES_EXTRAS["focar-junto"] = (b, uid) => {
  const s = semanaDoAmigo(uid);
  if (!s || s.focoAte < Date.now() + 60e3) return toast("O foco dessa pessoa já acabou.");
  if (timer.running) return toast("Seu cronômetro já está ligado. Bom foco!");
  if (!S.subjects.length) {
    tab = "estudos";
    render();
    return toast("Cadastre uma matéria pra usar o foco");
  }
  timer.goal = Math.max(1, Math.ceil((s.focoAte - Date.now()) / 6e4));
  if (!timer.subjectId) timer.subjectId = S.subjects[0].id;
  timer.label = "Foco com " + nomeDe(uid);
  timer.acc = 0;
  timer.beeped = false;
  timer.running = true;
  timer.start = Date.now();
  saveTimerState();
  publicarPerfil(true);
  mandarParaCaixa(uid, "reacao", "focou junto com você", { reacao: "foco" });
  tab = "estudos";
  render();
  window.scrollTo(0, 0);
  toast(`Focando junto com ${nomeDe(uid)} por ${timer.goal} min!`, false, "focus");
};

function conquistasAmigosHTML(amigos) {
  const recentes = amigos
    .map(a => ({ uid: a.uid, s: semanaDoAmigo(a.uid) }))
    .filter(x => x.s && x.s.conq && diffDays(x.s.conq.em, today()) <= 7)
    .slice(0, 5);
  if (!recentes.length) return "";
  const feitas = reacoesFeitas();
  return `<section class="block"><h2 class="h2">Conquistas dos amigos</h2><ul class="list">${recentes
    .map(x => {
      const chave = x.uid + ":" + x.s.conq.id;
      return `<li><div class="item"><span class="trophy on">${ICON.trophy}</span><div class="main"><span class="title">${esc(nomeDe(x.uid))}</span><span class="meta">conquistou ${esc(ACH[x.s.conq.id].name)} · ${esc(relDay(x.s.conq.em))}</span></div>
      <div class="reacoes">${
        feitas[chave]
          ? `<span class="reacao-feita">${REACOES[feitas[chave]] || "👏"}</span>`
          : Object.entries(REACOES)
              .map(
                ([k, e]) =>
                  `<button class="reacao" data-act="reagir-conquista" data-id="${esc(x.uid)}" data-r="${k}" aria-label="Reagir com ${e}">${e}</button>`
              )
              .join("")
      }</div></div></li>`;
    })
    .join("")}</ul></section>`;
}
function reacoesFeitas() {
  try {
    return JSON.parse(lsGet("prumo-reacoes") || "{}");
  } catch (e) {
    return {};
  }
}
ACOES_EXTRAS["reagir-conquista"] = async (b, uid) => {
  const s = semanaDoAmigo(uid);
  const r = b.dataset.r;
  if (!s || !s.conq || !REACOES[r]) return;
  const ok = await mandarParaCaixa(uid, "reacao", ACH[s.conq.id].name, { reacao: r });
  if (!ok) return;
  const f = reacoesFeitas();
  f[uid + ":" + s.conq.id] = r;
  lsSet("prumo-reacoes", JSON.stringify(Object.fromEntries(Object.entries(f).slice(-60))));
  render();
};

/** Tudo isso na aba Amigos (chamado por js/telas/amigos.js). */
function socialMaisHTML(amigos) {
  return salaFocoHTML(amigos) + desafioSemanaHTML(amigos) + conquistasAmigosHTML(amigos);
}
