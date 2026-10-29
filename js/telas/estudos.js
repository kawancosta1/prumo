/*
  Aba Estudos.
*/
"use strict";

function viewEstudos() {
  const t = today(),
    mon = mondayOf(t);
  const subjOpts = sel =>
    S.subjects
      .map(s => `<option value="${s.id}" ${s.id === sel ? "selected" : ""}>${esc(s.name)}</option>`)
      .join("");
  const week = S.subjects.map(s => ({
    s,
    min: S.sessions.filter(x => x.subjectId === s.id && x.date >= mon).reduce((a, b) => a + b.min, 0)
  }));
  const total = week.reduce((a, b) => a + b.min, 0),
    max = Math.max(1, ...week.map(w => w.min));
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(t, i - 6));
  const mins = last7.map(d => S.sessions.filter(s => s.date === d).reduce((a, b) => a + b.min, 0));
  const exams = S.exams.filter(e => e.date >= t).sort((a, b) => (a.date < b.date ? -1 : 1));
  const ms = elapsed(),
    secs = Math.floor(ms / 1000),
    remain = timer.goal * 60 - secs,
    over = remain < 0,
    shown = Math.abs(remain),
    busy = timer.running || timer.acc > 0;
  const revDue = S.reviews.filter(r => !r.done && r.due <= t),
    revNext = S.reviews.filter(r => !r.done && r.due > t).sort((a, b) => (a.due < b.due ? -1 : 1));
  const streak = studyStreak();
  const byDay = Array.from({ length: 7 }, (_, i) =>
    S.classes.filter(c => c.day === i).sort((a, b) => (a.start < b.start ? -1 : 1))
  );
  return `
  <section class="block">
    <h1 class="h1">Estudos<small>${total ? `${fmtMin(total)} nesta semana` : textoMundo("vazioEstudos", "Nenhum estudo registrado nesta semana")}${streak ? ` · ${streak} ${streak === 1 ? "dia seguido" : "dias seguidos"} estudando` : ""}</small></h1>
  </section>
  <section class="block">
    <h2 class="h2">${textoMundo("foco", "Foco")}</h2>
    ${
      S.subjects.length
        ? `<div class="timer">
      ${timer.label ? `<span class="what">${esc(timer.label)}</span>` : ""}
      <div class="row" style="justify-content:space-between">
        <select id="tm-subj" data-change="tmsubj" aria-label="Matéria" ${busy ? "disabled" : ""}>${subjOpts(timer.subjectId)}</select>
        <div class="seg" role="group" aria-label="Duração">${[25, 50, 90].map(g => `<button data-act="goal" data-g="${g}" aria-pressed="${timer.goal === g}" ${busy ? "disabled" : ""}>${g} min</button>`).join("")}</div>
      </div>
      <div class="timerrow ${timer.running ? "rodando" : ""}"><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><div class="clock ${over ? "over" : ""}" id="clock">${over ? "+" : ""}${pad(Math.floor(shown / 60))}:${pad(shown % 60)}</div><button class="mslot" data-kind="timer" data-size="64" data-act="poke" aria-label="Prumi"></button></div>
      ${typeof renderCorpoDuploHTML === "function" ? renderCorpoDuploHTML() : ""}
      <div class="row">
        ${timer.running ? `<button class="btn" data-act="pause">Pausar</button>` : `<button class="btn primary" data-act="start">${timer.acc ? "Continuar" : "Começar"}</button>`}
        <button class="btn" data-act="finish" ${ms < 1000 ? "disabled" : ""}>Concluir e registrar</button>
        ${busy ? `<button class="btn ghost" data-act="reset">Zerar</button>` : ""}
      </div>
      ${timer.acc > 0 && !timer.running && S.persona === "otaku" ? `<div class="intervalo-comercial-anime">📺 <b>Intervalo Comercial do Episódio</b>: hora de esticar os braços e fazer um alongamento ninja!</div>` : ""}
      ${somDoMundo() ? `<div class="row">${botaoSom("chuva", textoMundo("somFocoNome", "Chuva durante o foco"))}</div>` : ""}
      <div class="row" style="margin-top:8px"><button class="barra-som-asmr" data-act="alternar-asmr">🎧 Som ASMR Vintage</button></div>
      <span class="note">Quando o tempo acaba, toca um aviso e o relógio continua contando o tempo extra. Ao concluir, os minutos vão para a matéria.</span>
    </div>`
        : `<div class="empty"><strong>Cadastre uma matéria primeiro.</strong>Use o campo de matérias mais abaixo, e o cronômetro de foco aparece aqui.</div>`
    }
  </section>
  <section class="block">
    <h2 class="h2">Revisão espaçada <span class="count">${revDue.length} para hoje</span></h2>
    <span class="note">Estudou um conteúdo? Registre aqui. O Prumo agenda revisões para 1, 3, 7, 15 e 30 dias depois, que é quando você estaria quase esquecendo.</span>
    ${S.subjects.length ? `<form class="add" data-form="review"><input id="rv-topic" class="grow" type="text" placeholder="Conteúdo estudado (ex.: limites laterais)" autocomplete="off" required><select id="rv-subj" aria-label="Matéria">${subjOpts(timer.subjectId)}</select><button class="btn" type="submit">Registrar</button></form>` : ""}
    ${revDue.length ? `<ul class="list">${revDue.map(reviewRow).join("")}</ul>` : S.reviews.length ? `<div class="empty">Nenhuma revisão para hoje.</div>` : ""}
    ${revNext.length ? `<details class="more"><summary>Próximas revisões (${revNext.length})</summary><ul class="list">${revNext.slice(0, 30).map(reviewRow).join("")}</ul></details>` : ""}
  </section>
  <section class="block">
    <h2 class="h2">Últimos 7 dias</h2>
    <div class="chart">${barChart(
      mins,
      last7.map(d => DIAS_CURTO[wIdx(d)]),
      {
        fmt: v => (v >= 60 ? (v / 60).toFixed(1).replace(".", ",") + "h" : v),
        color: "var(--estudo)",
        hiIdx: 6
      }
    )}</div>
  </section>
  ${typeof livrosEstudoHTML === "function" ? livrosEstudoHTML() : ""}
  <section class="block">
    <h2 class="h2">Matérias <span class="count">nesta semana</span></h2>
    ${S.subjects.length ? `<div class="bars">${week.map(({ s, min }) => `<div class="hbar" style="--c:${s.color}"><div class="top"><span class="title">${esc(s.name)}</span><span class="row" style="gap:2px"><span class="mono muted">${fmtMin(min)}</span><button class="icon" style="width:28px;height:28px;flex-basis:28px" data-act="del" data-list="subjects" data-id="${s.id}" aria-label="Apagar matéria">${ICON.trash}</button></span></div><div class="track"><div class="fill" style="width:${Math.round((min / max) * 100)}%"></div></div></div>`).join("")}</div>` : ""}
    <form class="add" data-form="subject"><input id="s-name" class="grow" type="text" placeholder="Nova matéria (ex.: Cálculo I)" autocomplete="off" required><button class="btn" type="submit">Adicionar matéria</button></form>
    ${S.subjects.length ? `<form class="add" data-form="manual"><select id="m-subj" aria-label="Matéria" class="grow">${subjOpts(timer.subjectId)}</select><input id="m-min" type="number" min="1" max="600" placeholder="min" style="width:84px" required><button class="btn" type="submit">Registrar estudo sem timer</button></form>` : ""}
  </section>
  <section class="block">
    <h2 class="h2">Grade de aulas</h2>
    ${
      S.subjects.length
        ? `<form class="add" data-form="class">
      <select id="c-subj" aria-label="Matéria" class="grow">${subjOpts("")}</select>
      <select id="c-day" aria-label="Dia">${DIAS_SEG.map((d, i) => `<option value="${i}">${d}</option>`).join("")}</select>
      <input id="c-start" type="time" value="08:10" required aria-label="Início"><input id="c-end" type="time" value="09:50" required aria-label="Fim">
      <input id="c-room" type="text" placeholder="Sala (opcional)" style="flex:1 1 120px" autocomplete="off">
      <button class="btn" type="submit">Adicionar aula</button></form>`
        : `<span class="note">Cadastre as matérias para montar a grade.</span>`
    }
    ${S.classes.length ? `<ul class="list">${byDay.map((cl, i) => (cl.length ? `<li class="sep label">${DIAS_SEG[i]}</li>` + cl.map(c => `<li class="a-estudo"><div class="item"><span class="slot" style="--c:${subjColor(c.subjectId)}">${ICON.book}</span><div class="main"><span class="title">${esc(subjName(c.subjectId) || "Matéria apagada")}</span><span class="meta"><span class="mono">${esc(c.start)}–${esc(c.end)}</span>${c.room ? `<span>·</span><span>${esc(c.room)}</span>` : ""}</span></div>${calLink({ title: subjName(c.subjectId) || "Aula", date: nextWd(c.day), time: c.start, dur: Math.max(15, hm2min(c.end) - hm2min(c.start)), location: c.room, recur: "RRULE:FREQ=WEEKLY" }, "Aula semanal no Google Agenda")}<button class="icon" data-act="del" data-list="classes" data-id="${c.id}" aria-label="Apagar aula">${ICON.trash}</button></div></li>`).join("") : "")).join("")}</ul><span class="note">As aulas aparecem automaticamente na aba Hoje.</span>` : ""}
  </section>
  <section class="block">
    <h2 class="h2">Provas e entregas</h2>
    <form class="add" data-form="exam">
      <input id="e-title" class="grow" type="text" placeholder="Ex.: P1, lista 3, simulado" autocomplete="off" required>
      <select id="e-subj" aria-label="Matéria"><option value="">Sem matéria</option>${subjOpts("")}</select>
      <input id="e-date" type="date" value="${addDays(t, 7)}" required aria-label="Data">
      <button class="btn" type="submit">Adicionar</button>
    </form>
    ${exams.length ? `<ul class="list">${exams.map(e => `<li><div class="item"><div class="main"><span class="title">${esc(e.title)}</span><span class="meta"><span class="chip" style="--c:${subjColor(e.subjectId)}">${esc(subjName(e.subjectId) || "Sem matéria")}</span><span>·</span><span>${fmtLong(e.date)}</span></span></div>${dueTag(diffDays(t, e.date))}${calLink({ title: (subjName(e.subjectId) ? subjName(e.subjectId) + ": " : "") + e.title, date: e.date })}<button class="icon" data-act="del" data-list="exams" data-id="${e.id}" aria-label="Apagar">${ICON.trash}</button></div>${typeof planoProvaHTML === "function" ? planoProvaHTML(e) : ""}</li>`).join("")}</ul>` : `<div class="empty">Nenhuma prova marcada.</div>`}
  </section>`;
}
