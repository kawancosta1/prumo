/*
  Aba Hábitos e social.
*/
"use strict";

function viewSocial() {
  const t = today();
  const evs = S.events
    .filter(e => e.date >= t)
    .sort((a, b) => (a.date + (a.time || "") < b.date + (b.time || "") ? -1 : 1));
  const score = p => {
    if (!p.last) return 1e6;
    const n = diffDays(p.last, t);
    return p.every ? (n / p.every) * 100 : n;
  };
  const ppl = [...S.people].sort((a, b) => score(b) - score(a));
  return `
  <section class="block"><h1 class="h1">Hábitos e social<small>O que você quer manter todo dia e as pessoas que importam</small></h1></section>
  ${parceriaSecaoHTML()}
  <section class="block">
    <h2 class="h2">Hábitos</h2>
    <form class="add" data-form="habit" style="flex-direction:column;flex-wrap:nowrap">
      <div class="row"><input id="h-name" class="grow" type="text" placeholder="Ex.: ler 20 min, academia, dormir até 23h" autocomplete="off" required style="flex:1 1 200px"><input id="h-time" type="time" aria-label="Horário do lembrete"></div>
      <div class="row" style="justify-content:space-between">${wdPicker("h-days", [0, 1, 2, 3, 4, 5, 6])}<button class="btn" type="submit">${textoMundo("adicionarHabito", "Adicionar hábito")}</button></div>
    </form>
    ${sugestoesHabitosHTML()}
    ${S.habits.length ? `<ul class="list">${S.habits.map(h => habitRow(h, true)).join("")}</ul><span class="note">O quadriculado mostra as últimas 12 semanas. O ícone de agenda cria um lembrete que se repete nos dias escolhidos.</span>` : `<div class="empty">${textoMundo("vazioHabitos", "Nenhum hábito ainda. Comece com um ou dois. Hábitos pequenos e diários pegam mais fácil.")}</div>`}
  </section>
  <section class="block">
    <h2 class="h2">Compromissos</h2>
    <form class="add" data-form="event">
      <input id="ev-title" class="grow" type="text" placeholder="Ex.: aniversário, rolê, jantar" autocomplete="off" required>
      <input id="ev-date" type="date" value="${t}" required aria-label="Data">
      <input id="ev-time" type="time" aria-label="Horário">
      <input id="ev-place" type="text" placeholder="Local (opcional)" style="flex:1 1 140px" autocomplete="off">
      <button class="btn" type="submit">Adicionar</button>
    </form>
    ${
      evs.length
        ? `<ul class="list">${evs
            .map(e => {
              const n = diffDays(t, e.date);
              return `<li class="a-social"><div class="item"><span class="slot">${ICON.pin}</span><div class="main"><span class="title">${esc(e.title)}</span><span class="meta"><span class="chip">${n === 0 ? "Hoje" : n === 1 ? "Amanhã" : esc(fmtLong(e.date))}</span>${e.time ? `<span>·</span><span class="mono">${esc(e.time)}</span>` : ""}${e.place ? `<span>·</span><span>${esc(e.place)}</span>` : ""}</span></div>${calLink({ title: e.title, date: e.date, time: e.time, dur: 120, location: e.place })}<button class="icon" data-act="del" data-list="events" data-id="${e.id}" aria-label="Apagar">${ICON.trash}</button></div></li>`;
            })
            .join("")}</ul>`
        : `<div class="empty">${textoMundo("vazioCompromissos", "Nenhum compromisso pela frente. Eles também aparecem na aba Hoje.")}</div>`
    }
  </section>
  <section class="block">
    <h2 class="h2">Pessoas</h2>
    <form class="add" data-form="person">
      <input id="p-name" class="grow" type="text" placeholder="Alguém que você quer ver mais" autocomplete="off" required>
      <select id="p-every" aria-label="Frequência de contato"><option value="0">Sem meta</option><option value="7">Toda semana</option><option value="14">A cada 2 semanas</option><option value="30" selected>Todo mês</option><option value="90">A cada 3 meses</option></select>
      <input id="p-bday" type="text" inputmode="numeric" placeholder="Aniv. dd/mm" style="width:110px" autocomplete="off" pattern="\\d{1,2}/\\d{1,2}" aria-label="Aniversário (dd/mm)">
      <button class="btn" type="submit">Adicionar</button>
    </form>
    ${
      ppl.length
        ? `<ul class="list">${ppl
            .map(p => {
              const n = p.last ? diffDays(p.last, t) : null,
                late = p.every && n !== null && n > p.every,
                bd = p.bday ? bdayNext(p.bday) : "";
              return `<li><div class="item"><div class="main"><span class="title">${esc(p.name)}</span><span class="meta">${n === null ? `<span class="${p.every ? "due soon" : ""}" style="${p.every ? "padding:1px 6px" : ""}">Sem registro de contato</span>` : n === 0 ? "Falou hoje" : `<span class="${late ? "due soon" : ""}" style="${late ? "padding:1px 6px" : ""}">Último contato há ${n} ${n === 1 ? "dia" : "dias"}</span>`}${p.every ? `<span>·</span><span>meta: ${p.every === 7 ? "toda semana" : p.every === 14 ? "a cada 2 semanas" : p.every === 30 ? "todo mês" : "a cada 3 meses"}</span>` : ""}${bd ? `<span>·</span><span>aniv. ${fmtShort(bd)}</span>` : ""}</span></div>
        ${bd ? calLink({ title: "Aniversário de " + p.name, date: bd, recur: "RRULE:FREQ=YEARLY" }, "Aniversário anual no Google Agenda") : ""}
        <button class="btn small" data-act="talked" data-id="${p.id}" ${n === 0 ? "disabled" : ""}>Falei hoje</button><button class="icon" data-act="del" data-list="people" data-id="${p.id}" aria-label="Apagar">${ICON.trash}</button></div></li>`;
            })
            .join(
              ""
            )}</ul><span class="note">Quem está mais atrasado em relação à meta de contato aparece primeiro.</span>`
        : `<div class="empty">${textoMundo("vazioPessoas", "Adicione amigos e família. Quem estiver há muito tempo sem contato sobe para o topo.")}</div>`
    }
  </section>`;
}

/* Hábitos sugeridos pelo mundo atual (ex.: MUNDO_FX.emo.habitosSugeridos). Toque para adicionar. */
function sugestoesHabitosHTML() {
  const f = MUNDO_FX[S.persona];
  const lista = ((f && f.habitosSugeridos) || []).filter(n => !S.habits.some(h => norm(h.name) === norm(n)));
  if (!lista.length) return "";
  return `<div class="sugestoes"><span class="note">Sugestões do mundo ${esc(P().name)}:</span><div class="chips">${lista.map(n => `<button class="chipbtn" data-act="habito-sugerido" data-n="${esc(n)}">+ ${esc(n)}</button>`).join("")}</div></div>`;
}

ACOES_EXTRAS["habito-sugerido"] = b => {
  const name = b.dataset.n;
  if (!name || S.habits.some(h => norm(h.name) === norm(name))) return;
  S.habits.push({ id: newId(), name, time: "", days: [0, 1, 2, 3, 4, 5, 6], created: today() });
  commit();
  toast(`Hábito adicionado: ${name}`, false, "happy");
};
