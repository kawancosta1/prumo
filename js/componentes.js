/*
  Pedaços de tela reaproveitados: linha de tarefa, widget de água, gráfico, hábito, revisão.
*/
"use strict";

/* ================= componentes ================= */
function taskRow(x, { showDate = false } = {}) {
  const open = openTask === x.id,
    subDone = x.sub.filter(s => s.done).length;
  const meta = [];
  if (showDate) meta.push(`<span class="due soon" style="padding:1px 6px">${esc(relDay(x.date))}</span>`);
  if (x.time) meta.push(`<span class="mono">${esc(x.time)}</span>`);
  meta.push(`<span class="chip">${AREAS[x.area] || "Geral"}</span>`);
  if (x.prio) {
    meta.push(
      `<span class="prio p${x.prio}" title="Prioridade ${PRIO[x.prio].toLowerCase()}">${"!".repeat(x.prio)}</span>`
    );
    if (S.persona === "otaku" && x.prio >= 2 && typeof nomeGolpeEspecial === "function") {
      meta.push(
        `<span class="chip chip-golpe" title="Ataque especial">${esc(nomeGolpeEspecial(x.title))}</span>`
      );
    }
  }
  if (x.repeat) meta.push(`<span title="${REPEAT[x.repeat]}" style="display:inline-flex">${ICON.rep}</span>`);
  if (x.sub.length) meta.push(`<span class="mono">${subDone}/${x.sub.length}</span>`);
  const atrasada = !x.done && x.date < today(); // no emo, vira fantasminha (ver estilos/mundos/emo.css)
  return `<li class="a-${x.area} ${x.prio ? "pr" + x.prio : ""} ${x.done ? "done" : ""} ${atrasada ? "atrasada" : ""} ${fx.newId === x.id ? "is-new" : ""} ${fx.toggled === x.id && x.done ? "just-done" : ""}">
    <div class="item">
      <button class="check" data-act="toggle" data-id="${x.id}" aria-pressed="${!!x.done}" aria-label="Concluir ${esc(x.title)}">${ICON.check}</button>
      <div class="main clickable" data-act="open" data-id="${x.id}"><span class="title">${esc(x.title)}</span><span class="meta">${meta.join("<span>·</span>")}</span></div>
      ${calLink({ title: x.title, date: x.date, time: x.time, dur: 60, recur: RRULE[x.repeat] || "" })}
      <button class="icon" data-act="open" data-id="${x.id}" aria-expanded="${open}" aria-label="Detalhes">${ICON.more}</button>
    </div>
    ${open ? taskDetail(x) : ""}
  </li>`;
}

function taskDetail(x) {
  return `<div class="detail ${fx.opened === x.id ? "opening" : ""}">
    <div class="field"><span class="label">Subtarefas</span>
      ${x.sub.length ? `<ul class="subs">${x.sub.map(s => `<li class="${s.done ? "done" : ""}"><button class="check" data-act="subtoggle" data-id="${x.id}" data-sid="${s.id}" aria-pressed="${!!s.done}" aria-label="Concluir subtarefa">${ICON.check}</button><span class="title" style="flex:1">${esc(s.t)}</span><button class="icon" style="width:28px;height:28px;flex-basis:28px" data-act="subdel" data-id="${x.id}" data-sid="${s.id}" aria-label="Apagar subtarefa">${ICON.x}</button></li>`).join("")}</ul>` : ""}
      <form class="subform" data-form="sub" data-id="${x.id}"><input type="text" id="sub-${x.id}" placeholder="Quebrar em um passo menor…" autocomplete="off" required><button class="btn small" type="submit">Adicionar</button></form>
      ${typeof passosPara === "function" ? `<button class="olink" data-act="quebrar-passos" data-id="${x.id}">Quebrar em passos pra mim</button>` : ""}
    </div>
    <div class="row">
      <input type="date" id="td-${x.id}" data-change="tdate" data-id="${x.id}" value="${x.date}" aria-label="Data">
      <input type="time" id="tt-${x.id}" data-change="ttime" data-id="${x.id}" value="${esc(x.time)}" aria-label="Horário">
      <select id="tr-${x.id}" data-change="trepeat" data-id="${x.id}" aria-label="Repetição">${Object.entries(
        REPEAT
      )
        .map(([k, v]) => `<option value="${k}" ${x.repeat === k ? "selected" : ""}>${v}</option>`)
        .join("")}</select>
      <select id="ta-${x.id}" data-change="tarea" data-id="${x.id}" aria-label="Área">${Object.entries(AREAS)
        .map(([k, v]) => `<option value="${k}" ${x.area === k ? "selected" : ""}>${v}</option>`)
        .join("")}</select>
    </div>
    <div class="field"><span class="label">Prioridade</span><div class="seg" role="group">${PRIO.map((p, i) => `<button data-act="prio" data-id="${x.id}" data-p="${i}" aria-pressed="${x.prio === i}">${p}</button>`).join("")}</div></div>
    <div class="row">
      ${!x.done ? `<button class="btn small" data-act="postpone" data-id="${x.id}">Adiar para amanhã</button>` : ""}
      ${!x.done ? `<button class="btn small" data-act="focus" data-id="${x.id}">${ICON.play.replace("<svg", '<svg width="12" height="12"')} Focar agora</button>` : ""}
      <button class="btn small ghost danger" data-act="del" data-list="tasks" data-id="${x.id}">Apagar</button>
    </div>
  </div>`;
}

function waterWidget(full) {
  const tot = waterToday(),
    g = S.waterGoal,
    pct = Math.min(1, tot / g),
    pace = waterPace(),
    diff = tot - pace;
  const from = fx.waterFrom != null ? Math.min(1, fx.waterFrom / g) : pct;
  const log = (S.water[today()] || []).map((e, i) => ({ ...e, i })).reverse();
  return `<div class="water a-water">
    <div class="wtop">
      ${full ? `<button class="mslot" data-kind="water" data-size="84" data-act="poke" aria-label="Prumi, ${Math.round(pct * 100)}% cheio"></button>` : ""}
      <div style="display:flex;flex-direction:column;gap:6px;min-width:0;flex:1">
        <span class="wname">${esc(waterOf().name)}</span>
        <div class="wnum"><span id="wcount" data-to="${tot}">${(fx.waterFrom != null ? fx.waterFrom : tot).toLocaleString("pt-BR")}</span> <small>/ ${fmtML(g)} · ${Math.round(pct * 100)}%</small></div>
        ${full ? "" : `<div class="wfill"><span data-to="${(pct * 100).toFixed(1)}" style="width:${(from * 100).toFixed(1)}%"></span></div>`}
        ${
          tot >= g
            ? `<div class="pace"><span class="tag ahead">Meta batida</span></div>`
            : `<div class="pace"><span>Faltam <b class="mono">${(g - tot).toLocaleString("pt-BR")} mL</b></span>
          <span class="tag ${diff >= 0 ? "ahead" : "behind"}">${diff >= 0 ? "No ritmo" : `${(-diff).toLocaleString("pt-BR")} mL atrás`}</span></div>
          <span class="note">Até agora o ideal seria ${pace.toLocaleString("pt-BR")} mL.</span>`
        }
      </div>
    </div>
    <div class="cupbtns">${S.cups.map(c => `<button class="btn" data-act="drink" data-ml="${c}">+${c}</button>`).join("")}</div>
    ${full ? `<form class="row" data-form="drink" style="gap:6px"><input type="number" id="w-ml" min="10" max="3000" step="10" placeholder="Outro valor (mL)" style="flex:1" required><button class="btn water" type="submit">Adicionar</button></form>` : ""}
    ${log.length ? `<div class="wlog">${(full ? log : log.slice(0, 4)).map(e => `<button data-act="undrink" data-i="${e.i}" title="Remover este registro"><span class="mono">${esc(e.t)}</span><b>${e.ml}</b>${ICON.x}</button>`).join("")}${!full && log.length > 4 ? `<span class="note">+${log.length - 4}</span>` : ""}</div>` : ""}
  </div>`;
}

function barChart(vals, labels, { goal = 0, fmt = v => v, color = "var(--accent)", hiIdx = -1 } = {}) {
  const W = 320,
    H = 120,
    top = 16,
    bottom = 18,
    ch = H - top - bottom,
    n = vals.length,
    gw = W / n,
    bw = Math.min(28, gw * 0.6);
  const max = Math.max(goal || 0, ...vals, 1) * 1.05;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" style="--c:${color}">`;
  vals.forEach((v, i) => {
    const h = (v / max) * ch,
      x = i * gw + (gw - bw) / 2,
      y = top + ch - h;
    s += `<rect class="bar ${goal && v < goal ? "dim" : ""}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, v ? 2 : 0).toFixed(1)}" rx="3"/>`;
    if (v)
      s += `<text class="v" x="${(x + bw / 2).toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle">${fmt(v)}</text>`;
    s += `<text x="${(i * gw + gw / 2).toFixed(1)}" y="${H - 4}" text-anchor="middle" ${i === hiIdx ? 'style="fill:var(--ink);font-weight:700"' : ""}>${labels[i]}</text>`;
  });
  if (goal) {
    const gy = top + ch - (goal / max) * ch;
    s += `<line class="goal" x1="0" x2="${W}" y1="${gy.toFixed(1)}" y2="${gy.toFixed(1)}"/>`;
  }
  return s + `</svg>`;
}

function habitRow(h, full) {
  const t = today(),
    done = habitDone(h, t),
    due = habitDue(h, t),
    st = habitStreak(h);
  let heat = "";
  if (full) {
    const folgas = typeof folgasDoHabito === "function" ? folgasDoHabito(h) : new Set();
    const start = addDays(mondayOf(t), -77);
    for (let i = 0; i < 84; i++) {
      const d = addDays(start, i);
      const cls =
        d > t
          ? "fut"
          : habitDone(h, d)
            ? "on"
            : !habitDue(h, d)
              ? "off"
              : h.created && d < h.created
                ? "off"
                : folgas.has(d)
                  ? "folga"
                  : "miss";
      heat += `<i class="${cls}" title="${fmtShort(d)}"></i>`;
    }
  }
  const daysTxt =
    h.days.length === 7
      ? "Todo dia"
      : h.days.length === 5 && h.days.every(d => d < 5)
        ? "Dias úteis"
        : h.days.map(d => DIAS_CURTO[d]).join(", ");
  const warn = full && !done && due && habitMissedYesterday(h);
  return `<li class="a-social ${done ? "done" : ""} ${fx.habit === h.id && done ? "just-done" : ""}"><div class="item">
    <button class="check" data-act="habit" data-id="${h.id}" aria-pressed="${done}" aria-label="Marcar ${esc(h.name)}">${ICON.check}</button>
    <div class="main"><span class="title" style="text-decoration:none;color:var(--ink)">${esc(h.name)}</span>
      <span class="meta">${h.time ? `<span class="mono">${esc(h.time)}</span><span>·</span>` : ""}${full ? `<span>${daysTxt}</span><span>·</span>` : ""}<span class="mono"><span class="${fx.habit === h.id && done ? "bump" : ""}">${st}</span> ${st === 1 ? textoMundo("sequencia", ["dia seguido"])[0] : textoMundo("sequencia", [0, "dias seguidos"])[1]}</span></span>
      ${warn ? `<span class="warnline">Ontem ficou sem. Não deixe falhar dois dias seguidos.</span>` : ""}
    </div>
    ${full ? calLink({ title: h.name, date: t, time: h.time, dur: 15, recur: h.days.length === 7 ? "RRULE:FREQ=DAILY" : "RRULE:FREQ=WEEKLY;BYDAY=" + h.days.map(d => BYDAY[d]).join(","), details: "Hábito criado no Prumo" }, "Lembrete recorrente no Google Agenda") + `<button class="icon" data-act="del" data-list="habits" data-id="${h.id}" aria-label="Apagar hábito">${ICON.trash}</button>` : ""}
  </div>${full ? `<div style="padding:0 12px 12px 46px"><div class="heat">${heat}</div></div>` : ""}</li>`;
}

function wdPicker(name, checked) {
  return `<div class="wd" role="group" aria-label="Dias da semana">${DIAS_CURTO.map((d, i) => `<label><input type="checkbox" name="${name}" value="${i}" ${checked.includes(i) ? "checked" : ""}><span>${d}</span></label>`).join("")}</div>`;
}

function reviewRow(r) {
  const t = today(),
    n = diffDays(t, r.due);
  return `<li><div class="item"><span class="slot" style="--c:${subjColor(r.subjectId)}">${ICON.book}</span><div class="main"><span class="title">${esc(r.topic)}</span>${r.texto ? `<details class="ficha-rev"><summary>ver a ficha</summary><p>${esc(r.texto)}</p></details>` : ""}<span class="meta"><span class="chip" style="--c:${subjColor(r.subjectId)}">${esc(subjName(r.subjectId) || "Sem matéria")}</span><span>·</span><span>Revisão ${r.step + 1} de ${REV_STEPS.length}</span></span></div>${n > 0 ? dueTag(n) : n < 0 ? dueTag(n) : ""}${n <= 0 ? `<button class="btn small" data-act="reviewed" data-id="${r.id}">Revisei</button>` : `<button class="icon" data-act="del" data-list="reviews" data-id="${r.id}" aria-label="Apagar">${ICON.trash}</button>`}</div></li>`;
}
