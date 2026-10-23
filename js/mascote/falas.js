/*
  O que o Prumi fala no balão e as reações rápidas (react).
*/
"use strict";

let reaction = null,
  reactTimer = null;

const greet = () => {
  const h = new Date().getHours();
  return h < 5 ? "Boa noite" : h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};

const nome = () => (S.name ? `, <b>${esc(S.name)}</b>` : "");

function mascotContext() {
  const t = today(),
    now = nowHM();
  if (!hasData())
    return {
      mood: "happy",
      msg: `Oi${nome()}! Eu encho de água conforme você bebe e ganho roupinhas quando você cumpre metas. Escreve aí embaixo o que precisa fazer hoje.`
    };
  const tasks = S.tasks.filter(x => x.date === t),
    done = tasks.filter(x => x.done).length;
  const wt = waterToday(),
    behind = waterPace() - wt,
    goalHit = wt >= S.waterGoal;
  const overdue = S.tasks.filter(x => !x.done && x.date < t).length;
  const night = hm2min(now) >= hm2min(S.sleep) - 60 || hm2min(now) < hm2min(S.wake);
  const jr = S.journal[t] || {};
  if (timer.running)
    return { mood: "focus", msg: say("focus") + (timer.label ? ` <b>${esc(timer.label)}</b>.` : "") };
  if (night) return { mood: "sleepy", msg: jr.closed ? `Dia fechado. Boa noite${nome()}!` : say("night") };
  if (tasks.length && done === tasks.length && goalHit)
    return { mood: "party", msg: say("done") + ` E ainda bateu <b>${fmtML(S.waterGoal)}</b> de água!` };
  if (tasks.length && done === tasks.length) return { mood: "happy", msg: say("done") };
  const humor = calcularHumor();
  if (overdue)
    return {
      mood: humor.nivel.rosto === "idle" || humor.nivel.rosto === "happy" ? "worried" : humor.nivel.rosto,
      msg:
        humor.valor < 30
          ? say("sad") + ` Tem <b>${overdue}</b> ${overdue === 1 ? "tarefa atrasada" : "tarefas atrasadas"}.`
          : say("late", { n: overdue })
    };
  if (behind >= 500) return { mood: "worried", msg: say("thirsty", { ml: behind.toLocaleString("pt-BR") }) };
  if (goalHit) return { mood: "happy", msg: say("goal") };
  const rev = S.reviews.filter(r => !r.done && r.due <= t).length;
  if (rev)
    return {
      mood: "idle",
      msg: `Tem <b>${rev}</b> ${rev === 1 ? "revisão" : "revisões"} de estudo pra hoje. São rapidinhas e fixam o conteúdo.`
    };
  const nm = hm2min(now);
  const next = [
    ...tasks.filter(x => !x.done && x.time).map(x => ({ time: x.time, title: x.title })),
    ...S.classes
      .filter(c => c.day === wIdx(t))
      .map(c => ({ time: c.start, title: subjName(c.subjectId) || "Aula" }))
  ]
    .filter(x => hm2min(x.time) >= nm)
    .sort((a, b) => (a.time < b.time ? -1 : 1))[0];
  if (next && hm2min(next.time) - nm <= 60)
    return { mood: "idle", msg: `Daqui a <b>${hm2min(next.time) - nm} min</b>: ${esc(next.title)}.` };
  const latePerson = S.people
    .filter(p => p.every && p.last && diffDays(p.last, t) >= p.every * 1.5)
    .sort((a, b) => diffDays(b.last, t) - b.every - (diffDays(a.last, t) - a.every))[0];
  if (latePerson && !tasks.filter(x => !x.done).length) {
    const d = diffDays(latePerson.last, t);
    return {
      mood: "idle",
      msg: `Faz <b>${d} dias</b> que você não fala com <b>${esc(latePerson.name)}</b>. Que tal mandar um 'oi' hoje?`
    };
  }
  if (humor.valor < 30) return { mood: humor.nivel.rosto, msg: say("sad") };
  const rosto = humor.nivel.rosto === "party" ? "happy" : humor.nivel.rosto;
  if (!tasks.length)
    return {
      mood: rosto,
      msg: `${greet()}${nome()}! Ainda não tem tarefa pra hoje. Escreve aí embaixo o que vai fazer.`
    };
  return { mood: rosto, msg: say("hi", { n: tasks.length - done }) };
}

const TIPS = [
  "Dica: escreva <b>toda segunda 7h</b> e a tarefa se repete sozinha.",
  "Dica: <b>!1</b> no fim da tarefa marca prioridade alta.",
  "Tarefa grande demais? Abre os detalhes (⋯) e quebra em subtarefas.",
  "Cada copo que você registra me enche um pouquinho. Glub!",
  "Estudou algo hoje? Registra na revisão espaçada e eu te lembro na hora certa.",
  "Toque no ícone azul de agenda para criar o lembrete no seu celular.",
  "Manter contato com quem importa faz bem. Registre na aba Social quando falar com seus amigos!",
  "Não precisa ser perfeito, só não falhar dois dias seguidos."
];

let tipI = Math.floor(Math.random() * TIPS.length);

function react(mood, msg, ms = 2800) {
  reaction = { mood, msg };
  clearTimeout(reactTimer);
  updateMascots(true);
  reactTimer = setTimeout(() => {
    reaction = null;
    updateMascots(true);
  }, ms);
}

function updateMascots(pop) {
  const wt = waterToday(),
    fill = Math.min(1, wt / S.waterGoal);
  document.querySelectorAll(".mslot").forEach(el => {
    const k = el.dataset.kind,
      r = reaction && reaction.mood;
    let mood;
    if (k === "hero") mood = r || mascotContext().mood;
    else if (k === "water")
      mood = ["drink", "party", "happy"].includes(r)
        ? r
        : wt >= S.waterGoal
          ? "happy"
          : waterPace() - wt >= 500
            ? "worried"
            : "idle";
    else if (k === "timer") mood = ["party", "happy"].includes(r) ? r : timer.running ? "focus" : "idle";
    else mood = r || (hasData() ? calcularHumor().nivel.rosto : "idle");
    const eqs = el.dataset.eq || JSON.stringify(S.equip);
    const key = mood + "|" + fill.toFixed(3) + "|" + eqs;
    if (el.dataset.key === key) return;
    el.dataset.key = key;
    el.innerHTML = prumi({ mood, fill, size: +el.dataset.size || 96, eq: JSON.parse(eqs), vivo: true });
  });
  const b = document.getElementById("bubble");
  if (b) {
    const c = reaction && reaction.msg ? reaction : mascotContext();
    if (b.dataset.msg !== c.msg) {
      b.dataset.msg = c.msg;
      b.innerHTML = c.msg;
      if (pop && !RM) {
        b.classList.remove("pop");
        void b.offsetWidth;
        b.classList.add("pop");
      }
    }
  }
}

const heroHTML = () =>
  `<div class="herobox"><div class="hero"><button class="mslot ${fx.entrada ? "entra-" + fx.entrada : ""}" data-kind="hero" data-size="78" data-act="poke" aria-label="Prumi, toque para um carinho"></button><div class="bubble" id="bubble" aria-live="polite"></div></div>${humorHTML()}${enfeiteMundo()}</div>`;
