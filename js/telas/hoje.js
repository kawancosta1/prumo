/*
  Aba Hoje.
*/
"use strict";

/* ================= telas ================= */
function viewHoje() {
  const t = today(),
    isToday = selDay === t,
    wd = wIdx(selDay);
  const tasks = S.tasks.filter(x => x.date === selDay);
  const done = tasks.filter(x => x.done).length;
  const timed = [],
    untimed = [];
  tasks.forEach(x => (x.time ? timed : untimed).push({ k: "task", time: x.time, x }));
  S.classes.filter(c => c.day === wd).forEach(c => timed.push({ k: "class", time: c.start, x: c }));
  S.events
    .filter(e => e.date === selDay)
    .forEach(e => (e.time ? timed : untimed).push({ k: "event", time: e.time, x: e }));
  timed.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : (b.x.prio || 0) - (a.x.prio || 0)));
  untimed.sort((a, b) => (a.x.done ? 1 : 0) - (b.x.done ? 1 : 0) || (b.x.prio || 0) - (a.x.prio || 0));
  const now = nowHM();
  let nowPlaced = !isToday;
  const rowOf = it => {
    if (it.k === "task") return taskRow(it.x);
    if (it.k === "class")
      return `<li class="a-estudo"><div class="item"><span class="slot">${ICON.book}</span><div class="main"><span class="title">${esc(subjName(it.x.subjectId) || "Aula")}</span><span class="meta"><span class="mono">${esc(it.x.start)}–${esc(it.x.end)}</span><span>·</span><span class="chip">Aula</span>${it.x.room ? `<span>·</span><span>${esc(it.x.room)}</span>` : ""}</span></div></div></li>`;
    return `<li class="a-social"><div class="item"><span class="slot">${ICON.pin}</span><div class="main"><span class="title">${esc(it.x.title)}</span><span class="meta">${it.x.time ? `<span class="mono">${esc(it.x.time)}</span><span>·</span>` : ""}<span class="chip">Compromisso</span>${it.x.place ? `<span>·</span><span>${esc(it.x.place)}</span>` : ""}</span></div></div></li>`;
  };
  let listHtml = "";
  timed.forEach(it => {
    if (!nowPlaced && it.time > now) {
      listHtml += `<li class="nowline">AGORA ${now}</li>`;
      nowPlaced = true;
    }
    listHtml += rowOf(it);
  });
  if (!nowPlaced && timed.length) listHtml += `<li class="nowline">AGORA ${now}</li>`;
  if (untimed.length) {
    if (timed.length) listHtml += `<li class="sep label">Sem horário</li>`;
    untimed.forEach(it => (listHtml += rowOf(it)));
  }
  const overdue = isToday
    ? S.tasks.filter(x => !x.done && x.date < t).sort((a, b) => (a.date < b.date ? -1 : 1))
    : [];
  const revDue = isToday ? S.reviews.filter(r => !r.done && r.due <= t) : [];
  const habitsToday = S.habits.filter(h => habitDue(h, t));
  const exams = S.exams
    .filter(e => e.date >= t)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 3);
  const bdays = S.people
    .filter(p => p.bday)
    .map(p => ({ p, d: bdayNext(p.bday) }))
    .filter(o => diffDays(t, o.d) <= 7)
    .sort((a, b) => (a.d < b.d ? -1 : 1));
  const peopleDue = S.people
    .filter(p => p.every && (!p.last || diffDays(p.last, t) >= p.every))
    .sort((a, b) => {
      const sa = !a.last ? 1e6 : diffDays(a.last, t) - a.every;
      const sb = !b.last ? 1e6 : diffDays(b.last, t) - b.every;
      return sb - sa;
    })
    .slice(0, 3);
  const fresh = !hasData(),
    hour = new Date().getHours(),
    jr = S.journal[t] || {};
  const pend = tasks.filter(x => !x.done).length;
  const qp = document.getElementById("q")?.value || "";
  return `
  <section class="block">
    <h1 class="h1">${isToday ? "Hoje" : selDay === addDays(t, 1) ? "Amanhã" : selDay === addDays(t, -1) ? "Ontem" : esc(DIAS[parse(selDay).getDay()].replace(/^./, c => c.toUpperCase()))}<small>${fmtLong(selDay)}</small></h1>
    ${isToday ? (parceriaAtiva() ? parceriaHeroHTML() : heroHTML()) : ""}
    ${
      isToday &&
      typeof gerarBriefingMatinalCoach === "function" &&
      typeof obterStatusPrumoPro === "function" &&
      !obterStatusPrumoPro().ativo
        ? cartaoCoachBloqueadoHTML()
        : isToday && typeof gerarBriefingMatinalCoach === "function"
          ? `
      <div class="card-coach-ia">
        <div class="coach-header">
          <span class="coach-titulo">🤖 Coach de Rotina com IA</span>
          <span class="coach-score">Equilíbrio: ${gerarBriefingMatinalCoach().score}/100</span>
        </div>
        <div class="coach-texto"><strong>${esc(gerarBriefingMatinalCoach().saudacao)}</strong> ${esc(gerarBriefingMatinalCoach().conselhoPrincipal)}</div>
        <div class="coach-meta-principal">🎯 ${esc(gerarBriefingMatinalCoach().focoSugerido)}</div>
        <div class="coach-acoes-ia">
          <button class="btn small primary coach-btn-chat" data-act="abrir-chat-ia">💬 Conversar com Coach</button>
          <button class="btn small coach-btn-cronograma" data-act="abrir-desdobrador-ia">✨ Desdobrar Meta com IA</button>
        </div>
      </div>
    `
          : ""
    }
    ${isToday && typeof isDiaDeRespiro === "function" && isDiaDeRespiro(t) ? renderBannerRespiroHTML(t) : ""}
    ${isToday && pedidos.length && !parceriaAtiva() ? `<button class="card pedido" data-tab="social"><span><b>${esc(pedidos[0].nome || "Alguém")}</b> quer juntar o Prumi com o seu. Toque para ver.</span></button>` : ""}
    ${isToday ? `<div class="stats"><span>${textoMundo("tarefas", "Tarefas")} <b>${done}/${tasks.length}</b></span><span>Água <b>${fmtML(waterToday())}</b> de ${fmtML(S.waterGoal)}</span>${habitsToday.length ? `<span>Hábitos <b>${habitsToday.filter(h => habitDone(h, t)).length}/${habitsToday.length}</b></span>` : ""}${S.sessions.some(s => s.date === t) ? `<span>Estudo <b>${fmtMin(S.sessions.filter(s => s.date === t).reduce((a, b) => a + b.min, 0))}</b></span>` : ""}</div>` : tasks.length ? `<div class="stats"><span>${textoMundo("tarefas", "Tarefas")} <b>${done}/${tasks.length}</b></span></div>` : ""}
    ${tasks.length ? `<div class="progress"><span data-to="${Math.round((done / tasks.length) * 100)}" style="width:${fx.enter ? 0 : lastProg}%"></span></div>` : ""}
    <div class="days">${Array.from({ length: 9 }, (_, k) => k - 1)
      .map(i => {
        const d = addDays(t, i),
          pd = parse(d),
          p = S.tasks.some(x => x.date === d && !x.done);
        return `<button class="day" data-act="day" data-d="${d}" aria-pressed="${d === selDay}">${p ? '<i class="dot"></i>' : ""}<span>${i === 0 ? "hoje" : DIAS_CURTO[wIdx(d)]}</span><b>${pd.getDate()}</b></button>`;
      })
      .join("")}</div>
  </section>
  <section class="block">
    <form class="add quick" data-form="quick">
      <div class="row1"><input id="q" type="text" placeholder="${esc(P().placeholder || "O que você precisa fazer?")}" autocomplete="off" required value="${esc(qp)}"><button class="btn primary" type="submit">${textoMundo("adicionar", "Adicionar")}</button></div>
      <div class="parsed" id="qparsed">${parsedPills(parseQuick(qp, selDay), qp)}</div>
      <div class="hint">Escreva do seu jeito: <code>revisar cálculo amanhã 19h #estudo !1</code> · <code>academia toda segunda 7h</code></div>
    </form>
    ${typeof barraSelecaoTarefasHTML === "function" ? barraSelecaoTarefasHTML(tasks, selDay) : ""}
    ${listHtml ? `<ul class="list">${listHtml}</ul>` : fresh ? `<div class="empty"><strong>Seu dia começa aqui.</strong>Escreva uma tarefa acima. Data, horário, área (#estudo, #dieta, #social) e prioridade (!1, !2, !3) são entendidos sozinhos. O ícone azul cria o lembrete no Google Agenda, que aparece no Samsung se a conta Google estiver sincronizada.<button class="btn small" data-act="sample">Ver com exemplos</button></div>` : `<div class="empty">${isToday ? textoMundo("vazioHoje", "Nada marcado para hoje.") : "Nada marcado para este dia."}</div>`}
  </section>
  ${isToday && typeof organizarHojeHTML === "function" ? organizarHojeHTML() : ""}
  ${isToday && typeof resumoSemanaHTML === "function" ? resumoSemanaHTML() : ""}
  ${isToday && typeof emprestimoHojeHTML === "function" ? emprestimoHojeHTML() : ""}
  ${overdue.length ? `<section class="block"><h2 class="h2">${textoMundo("atrasadas", "Atrasadas")} <span class="row" style="gap:6px"><span class="count">${overdue.length}</span><button class="btn small" data-act="rollover">${textoMundo("trazerTudo", "Trazer tudo para hoje")}</button></span></h2><ul class="list">${overdue.map(x => taskRow(x, { showDate: true })).join("")}</ul></section>` : ""}
  ${bdays.length ? `<section class="block"><h2 class="h2">Aniversários chegando</h2><ul class="list">${bdays.map(({ p, d }) => `<li class="a-social"><div class="item"><span class="slot">${ICON.cake}</span><div class="main"><span class="title">${esc(p.name)}</span><span class="meta">${fmtLong(d)}</span></div>${dueTag(diffDays(t, d))}</div></li>`).join("")}</ul></section>` : ""}
  ${
    isToday && peopleDue.length
      ? `<section class="block"><h2 class="h2">Falar hoje <span class="count">${peopleDue.length}</span></h2><ul class="list">${peopleDue
          .map(p => {
            const dias = p.last ? diffDays(p.last, t) : null;
            const waNum = p.phone ? p.phone.replace(/\D/g, "") : "";
            return `<li class="a-social"><div class="item"><span class="slot" style="color:var(--social)">${ICON.heart}</span><div class="main"><span class="title">${esc(p.name)}</span><span class="meta">${dias === null ? "Sem registro de contato" : `Sem contato há ${dias} ${dias === 1 ? "dia" : "dias"}`} · meta: ${p.every === 7 ? "toda semana" : p.every === 14 ? "a cada 2 sem." : p.every === 30 ? "todo mês" : "a cada 3 meses"}</span></div>${waNum ? `<a class="btn small ghost" href="https://wa.me/${waNum}" target="_blank" rel="noopener">WhatsApp</a>` : ""}<button class="btn small" data-act="talked" data-id="${p.id}">Falei hoje</button></div></li>`;
          })
          .join("")}</ul></section>`
      : ""
  }
  ${revDue.length ? `<section class="block"><h2 class="h2">Revisões de hoje <span class="count">${revDue.length}</span></h2><ul class="list">${revDue.map(reviewRow).join("")}</ul></section>` : ""}
  ${isToday && habitsToday.length ? `<section class="block"><h2 class="h2">Hábitos <span class="count">${habitsToday.filter(h => habitDone(h, t)).length}/${habitsToday.length}</span></h2>${typeof isDiaDeRespiro === "function" && !isDiaDeRespiro(t) && typeof renderBannerRespiroHTML === "function" ? renderBannerRespiroHTML(t) : ""}<ul class="list">${habitsToday.map(h => habitRow(h, false)).join("")}</ul></section>` : ""}
  ${isToday ? `<section class="block"><h2 class="h2">Água</h2>${waterWidget(false)}</section>` : ""}
  ${exams.length && isToday ? `<section class="block"><h2 class="h2">Próximas provas</h2><ul class="list">${exams.map(e => `<li><div class="item"><div class="main"><span class="title">${esc(e.title)}</span><span class="meta"><span class="chip" style="--c:${subjColor(e.subjectId)}">${esc(subjName(e.subjectId) || "Sem matéria")}</span><span>·</span><span>${fmtShort(e.date)}</span></span>${typeof planoHojeHTML === "function" ? planoHojeHTML(e) : ""}</div>${dueTag(diffDays(t, e.date))}</div></li>`).join("")}</ul></section>` : ""}
  ${
    isToday && !fresh
      ? `<section class="block diario"><h2 class="h2">${textoMundo("diario", "Fechar o dia")}</h2>
    <div class="card">${
      jr.closed
        ? `<span class="closed">${textoMundo("diaFechado", "Dia fechado.")}</span>${jr.note ? (ganchoMundo("diarioTrancado") ? `<span class="note">A nota de hoje está no diário trancado.</span>` : `<span class="nota-dia">${esc(jr.note)}</span>`) : ""}<div><button class="btn small ghost" data-act="reopen">${textoMundo("reabrir", "Reabrir")}</button></div>`
        : `
      <span class="note">${hour < 18 ? "Faça isso à noite: revise o que rolou e deixe amanhã pronto." : "Hora de revisar o dia e deixar amanhã pronto."} ${done} feitas, ${pend} pendentes, ${fmtML(waterToday())} de água.</span>
      <textarea id="jnote" placeholder="${textoMundo("diarioDica", "Como foi o dia? O que ficou de aprendizado? (opcional)")}">${esc(jr.note || "")}</textarea>
      <div class="row"><button class="btn primary" data-act="closeday">${(pend ? textoMundo("fecharComPendentes", "Mover {n} para amanhã e fechar") : textoMundo("fecharDia", "Fechar o dia")).replace("{n}", `${pend} ${pend === 1 ? "pendente" : "pendentes"}`)}</button>${temGancho("poemaDoDia") ? `<button class="btn ghost" data-act="poema-do-dia">${textoMundo("poemaBotao", "Poema do dia")}</button>` : ""}</div>`
    }
    </div></section>`
      : ""
  }
  ${isToday && !fresh ? ganchoMundo("resumoSemana") : ""}
  ${isToday && !fresh ? ganchoMundo("secaoHoje") : ""}
  `;
}

/* Botão "Poema do dia" no diário (só aparece se o mundo tiver poemaDoDia, ex.: emo) */
ACOES_EXTRAS["poema-do-dia"] = () => {
  const campo = document.getElementById("jnote");
  if (!campo) return;
  const poema = ganchoMundo("poemaDoDia");
  campo.value = (campo.value.trim() ? campo.value.trim() + "\n\n" : "") + poema;
  campo.style.height = "auto";
  campo.style.height = campo.scrollHeight + "px";
  react("happy", textoMundo("poemaFala", "Escrevi um poema pra hoje. Pode mexer, ele é seu."), 2600);
};

/* Barra de Seleção e Exclusão em Lote de Tarefas */
function barraSelecaoTarefasHTML(tasks, dia) {
  if (!tasks || !tasks.length) return "";
  const feitas = tasks.filter(x => x.done).length;
  const pendentes = tasks.filter(x => !x.done).length;
  const selCount = tasks.filter(x => typeof tarefasSelecionadas !== "undefined" && tarefasSelecionadas && tarefasSelecionadas.has(x.id)).length;
  const todasSel = tasks.length > 0 && selCount === tasks.length;

  if (selCount > 0) {
    return `
    <div class="tarefas-lote-bar ativa">
      <div class="lote-info">
        <label class="tarefa-sel-label" title="Alternar todas as tarefas" aria-label="Alternar todas as tarefas">
          <input type="checkbox" class="tarefa-sel-chk" data-change="toggle-todas-tarefas" ${todasSel ? "checked" : ""}>
          <span class="tarefa-sel-custom" aria-hidden="true"></span>
        </label>
        <span class="lote-texto"><b>${selCount}</b> de ${tasks.length} selecionada${selCount > 1 ? "s" : ""}</span>
      </div>
      <div class="lote-botoes">
        <button type="button" class="btn small danger" data-act="apagar-tarefas-selecionadas" title="Apagar tarefas selecionadas">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          <span>Apagar selecionadas</span>
        </button>
        <button type="button" class="btn small ghost" data-act="desmarcar-todas-tarefas">Cancelar</button>
      </div>
    </div>`;
  }

  return `
  <div class="tarefas-lote-bar">
    <div class="lote-info">
      <label class="tarefa-sel-label" title="Selecionar todas para apagar" aria-label="Selecionar todas para apagar">
        <input type="checkbox" class="tarefa-sel-chk" data-change="toggle-todas-tarefas">
        <span class="tarefa-sel-custom" aria-hidden="true"></span>
      </label>
      <span class="lote-hint">Selecionar para apagar:</span>
    </div>
    <div class="lote-botoes">
      <button type="button" class="btn-lote-pill" data-act="sel-todas-tarefas">Todas (${tasks.length})</button>
      ${feitas > 0 ? `<button type="button" class="btn-lote-pill" data-act="sel-feitas-tarefas">Feitas (${feitas})</button>` : ""}
      ${pendentes > 0 ? `<button type="button" class="btn-lote-pill" data-act="sel-pendentes-tarefas">Pendentes (${pendentes})</button>` : ""}
    </div>
  </div>`;
}

if (typeof MUDANCAS_EXTRAS !== "undefined") {
  MUDANCAS_EXTRAS["sel-tarefa"] = el => {
    const id = el.dataset.id;
    if (!id || typeof tarefasSelecionadas === "undefined") return;
    if (el.checked) tarefasSelecionadas.add(id);
    else tarefasSelecionadas.delete(id);
    render();
  };

  MUDANCAS_EXTRAS["toggle-todas-tarefas"] = el => {
    if (typeof tarefasSelecionadas === "undefined") return;
    const t = S.tasks.filter(x => x.date === selDay);
    if (el.checked) {
      t.forEach(x => tarefasSelecionadas.add(x.id));
    } else {
      t.forEach(x => tarefasSelecionadas.delete(x.id));
    }
    render();
  };
}

if (typeof ACOES_EXTRAS !== "undefined") {
  ACOES_EXTRAS["sel-todas-tarefas"] = () => {
    if (typeof tarefasSelecionadas === "undefined") return;
    const t = S.tasks.filter(x => x.date === selDay);
    t.forEach(x => tarefasSelecionadas.add(x.id));
    render();
  };

  ACOES_EXTRAS["sel-feitas-tarefas"] = () => {
    if (typeof tarefasSelecionadas === "undefined") return;
    tarefasSelecionadas.clear();
    const feitas = S.tasks.filter(x => x.date === selDay && x.done);
    feitas.forEach(x => tarefasSelecionadas.add(x.id));
    render();
  };

  ACOES_EXTRAS["sel-pendentes-tarefas"] = () => {
    if (typeof tarefasSelecionadas === "undefined") return;
    tarefasSelecionadas.clear();
    const pend = S.tasks.filter(x => x.date === selDay && !x.done);
    pend.forEach(x => tarefasSelecionadas.add(x.id));
    render();
  };

  ACOES_EXTRAS["desmarcar-todas-tarefas"] = () => {
    if (typeof tarefasSelecionadas === "undefined") return;
    tarefasSelecionadas.clear();
    render();
  };

  ACOES_EXTRAS["apagar-tarefas-selecionadas"] = () => {
    if (typeof tarefasSelecionadas === "undefined" || !tarefasSelecionadas.size) return;
    const idsParaApagar = new Set(tarefasSelecionadas);
    const qtd = idsParaApagar.size;
    snapUndo();

    S.tasks = S.tasks.filter(t => !idsParaApagar.has(t.id));

    if (openTask && idsParaApagar.has(openTask)) {
      openTask = null;
    }

    tarefasSelecionadas.clear();
    commit();
    toast(`${qtd} ${qtd === 1 ? "tarefa apagada" : "tarefas apagadas"}`, true, "worried");
    if (typeof react === "function") {
      react("worried", `${qtd} ${qtd === 1 ? "tarefa foi apagada" : "tarefas foram apagadas"}. Se foi sem querer, dá pra desfazer ali embaixo.`, 2800);
    }
  };
}
