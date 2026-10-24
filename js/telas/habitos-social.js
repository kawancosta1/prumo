/*
  Aba Hábitos e social.
*/
"use strict";

let openPerson = null;
let filtroGrupoPessoas = "todos";

const PESSOAS_GRUPOS = {
  amigos: "Amigos",
  familia: "Família",
  trabalho: "Trabalho",
  amor: "Amor",
  outro: "Outro"
};

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

  const gruposPresentes = Array.from(new Set(S.people.map(p => p.group || "amigos")));
  const ppl = [...S.people]
    .filter(p => filtroGrupoPessoas === "todos" || (p.group || "amigos") === filtroGrupoPessoas)
    .sort((a, b) => score(b) - score(a));

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
    <form class="add" data-form="person" style="flex-direction:column;flex-wrap:nowrap;gap:8px">
      <div class="row">
        <input id="p-name" class="grow" type="text" placeholder="Alguém que você quer manter por perto" autocomplete="off" required style="flex:1 1 180px">
        <select id="p-group" aria-label="Grupo">
          <option value="amigos" selected>Amigos</option>
          <option value="familia">Família</option>
          <option value="trabalho">Trabalho</option>
          <option value="amor">Amor</option>
          <option value="outro">Outro</option>
        </select>
        <input id="p-phone" type="tel" placeholder="WhatsApp (opcional)" style="flex:1 1 140px" autocomplete="off" aria-label="WhatsApp">
      </div>
      <div class="row" style="justify-content:space-between">
        <div class="row" style="gap:6px">
          <select id="p-every" aria-label="Frequência de contato">
            <option value="0">Sem meta</option>
            <option value="7">Toda semana</option>
            <option value="14">A cada 2 semanas</option>
            <option value="30" selected>Todo mês</option>
            <option value="90">A cada 3 meses</option>
          </select>
          <input id="p-bday" type="text" inputmode="numeric" placeholder="Aniv. dd/mm" style="width:105px" autocomplete="off" pattern="\\d{1,2}/\\d{1,2}" aria-label="Aniversário (dd/mm)">
        </div>
        <button class="btn" type="submit">Adicionar pessoa</button>
      </div>
    </form>
    ${
      gruposPresentes.length > 1
        ? `<div class="chips" style="margin:10px 0 6px 0">
          <button class="chipbtn ${filtroGrupoPessoas === "todos" ? "active" : ""}" data-act="filtro-grupo" data-g="todos">Todos (${S.people.length})</button>
          ${gruposPresentes
            .map(
              g =>
                `<button class="chipbtn ${filtroGrupoPessoas === g ? "active" : ""}" data-act="filtro-grupo" data-g="${g}">${PESSOAS_GRUPOS[g] || g} (${S.people.filter(p => (p.group || "amigos") === g).length})</button>`
            )
            .join("")}
        </div>`
        : ""
    }
    ${
      ppl.length
        ? `<ul class="list">${ppl.map(p => personRow(p, t)).join("")}</ul>
        <span class="note">Toque nos três pontinhos (⋯) para ver o histórico de conversas, anotações e editar detalhes.</span>`
        : `<div class="empty">${textoMundo("vazioPessoas", "Adicione amigos e família. Quem estiver há muito tempo sem contato sobe para o topo.")}</div>`
    }
  </section>`;
}

function personRow(p, t) {
  const n = p.last ? diffDays(p.last, t) : null,
    late = p.every && n !== null && n > p.every,
    bd = p.bday ? bdayNext(p.bday) : "",
    open = openPerson === p.id,
    waNum = p.phone ? p.phone.replace(/\D/g, "") : "",
    groupName = PESSOAS_GRUPOS[p.group || "amigos"] || p.group || "Amigos";

  const metaItems = [];
  if (n === null) {
    metaItems.push(
      `<span class="${p.every ? "due soon" : ""}" style="${p.every ? "padding:1px 6px" : ""}">Sem registro de contato</span>`
    );
  } else if (n === 0) {
    metaItems.push(`<span>Falou hoje</span>`);
  } else {
    metaItems.push(
      `<span class="${late ? "due soon" : ""}" style="${late ? "padding:1px 6px" : ""}">Último contato há ${n} ${n === 1 ? "dia" : "dias"}</span>`
    );
  }

  if (p.every) {
    metaItems.push(
      `<span>meta: ${p.every === 7 ? "toda semana" : p.every === 14 ? "a cada 2 sem." : p.every === 30 ? "todo mês" : "a cada 3 meses"}</span>`
    );
  }
  if (bd) {
    metaItems.push(`<span>aniv. ${fmtShort(bd)}</span>`);
  }
  if (p.notes) {
    metaItems.push(`<span title="Tem anotações">📝</span>`);
  }

  return `<li class="a-social">
    <div class="item">
      <span class="slot" style="color:var(--social)">${ICON.heart}</span>
      <div class="main clickable" data-act="open-person" data-id="${p.id}">
        <span class="title">${esc(p.name)} <small class="chip" style="font-size:10px;padding:1px 6px">${esc(groupName)}</small></span>
        <span class="meta">${metaItems.join("<span>·</span>")}</span>
      </div>
      ${bd ? calLink({ title: "Aniversário de " + p.name, date: bd, recur: "RRULE:FREQ=YEARLY" }, "Aniversário anual no Google Agenda") : ""}
      ${waNum ? `<a class="btn small ghost" href="https://wa.me/${waNum}" target="_blank" rel="noopener" title="Abrir conversa no WhatsApp">WhatsApp</a>` : ""}
      <button class="btn small" data-act="talked" data-id="${p.id}" ${n === 0 ? "disabled" : ""}>Falei hoje</button>
      <button class="icon" data-act="open-person" data-id="${p.id}" aria-expanded="${open}" aria-label="Detalhes">${ICON.more}</button>
    </div>
    ${open ? personDetail(p, t) : ""}
  </li>`;
}

function personDetail(p, t) {
  const history = Array.isArray(p.history) ? p.history : [];
  return `<div class="detail" style="border-top:1px dashed var(--border);margin-top:6px;padding-top:10px">
    <div class="field">
      <span class="label">Anotações sobre ${esc(p.name)}</span>
      <div style="display:flex;gap:6px;flex-direction:column">
        <textarea id="p-notes-${p.id}" rows="2" placeholder="Gostos, assuntos pendentes, ideias de presentes, coisas para lembrar…" style="width:100%">${esc(p.notes || "")}</textarea>
        <button class="btn small" style="align-self:flex-start" data-act="save-person-notes" data-id="${p.id}">Salvar anotações</button>
      </div>
    </div>

    <div class="field" style="margin-top:4px">
      <span class="label">Registrar conversa ou encontro</span>
      <div class="row" style="gap:6px">
        <input id="p-hnote-${p.id}" class="grow" type="text" placeholder="Como foi? (ex.: almoço, ligação de 20min, café)" autocomplete="off">
        <input id="p-hdate-${p.id}" type="date" value="${t}" style="width:130px" aria-label="Data">
        <button class="btn small primary" data-act="add-person-history" data-id="${p.id}">Registrar</button>
      </div>
    </div>

    <div class="field" style="margin-top:4px">
      <span class="label">Histórico recente (${history.length})</span>
      ${
        history.length
          ? `<ul class="subs" style="max-height:160px;overflow-y:auto;padding-right:4px">
            ${history
              .map(
                (h, idx) => `<li>
                <span class="mono" style="font-size:12px;color:var(--muted)">${fmtShort(h.date)}</span>
                <span style="flex:1;font-size:13px">${h.note ? esc(h.note) : '<em style="color:var(--muted)">Contato registrado</em>'}</span>
                <button class="icon" style="width:24px;height:24px;flex-basis:24px" data-act="del-person-history" data-id="${p.id}" data-idx="${idx}" aria-label="Apagar registro">${ICON.x}</button>
              </li>`
              )
              .join("")}
          </ul>`
          : `<span class="note" style="color:var(--muted)">Nenhum histórico registrado ainda.</span>`
      }
    </div>

    <div class="field" style="margin-top:6px">
      <span class="label">Editar informações</span>
      <div class="row" style="gap:6px;flex-wrap:wrap">
        <select id="p-edit-group-${p.id}" aria-label="Grupo">
          <option value="amigos" ${(p.group || "amigos") === "amigos" ? "selected" : ""}>Amigos</option>
          <option value="familia" ${p.group === "familia" ? "selected" : ""}>Família</option>
          <option value="trabalho" ${p.group === "trabalho" ? "selected" : ""}>Trabalho</option>
          <option value="amor" ${p.group === "amor" ? "selected" : ""}>Amor</option>
          <option value="outro" ${p.group === "outro" ? "selected" : ""}>Outro</option>
        </select>
        <select id="p-edit-every-${p.id}" aria-label="Frequência">
          <option value="0" ${!p.every ? "selected" : ""}>Sem meta</option>
          <option value="7" ${p.every === 7 ? "selected" : ""}>Toda semana</option>
          <option value="14" ${p.every === 14 ? "selected" : ""}>A cada 2 semanas</option>
          <option value="30" ${p.every === 30 ? "selected" : ""}>Todo mês</option>
          <option value="90" ${p.every === 90 ? "selected" : ""}>A cada 3 meses</option>
        </select>
        <input id="p-edit-bday-${p.id}" type="text" inputmode="numeric" placeholder="Aniv. dd/mm" value="${p.bday ? `${p.bday.split("-")[1]}/${p.bday.split("-")[0]}` : ""}" style="width:105px" pattern="\\d{1,2}/\\d{1,2}" aria-label="Aniversário (dd/mm)">
        <input id="p-edit-phone-${p.id}" type="tel" placeholder="WhatsApp" value="${esc(p.phone || "")}" style="flex:1 1 120px" aria-label="WhatsApp">
        <button class="btn small" data-act="edit-person" data-id="${p.id}">Salvar alterações</button>
        <button class="icon" style="margin-left:auto" data-act="del" data-list="people" data-id="${p.id}" aria-label="Apagar pessoa">${ICON.trash}</button>
      </div>
    </div>
  </div>`;
}

/* Ações extras para gerenciamento de pessoas */
ACOES_EXTRAS["open-person"] = (b, id) => {
  openPerson = openPerson === id ? null : id;
  render();
};

ACOES_EXTRAS["filtro-grupo"] = b => {
  filtroGrupoPessoas = b.dataset.g || "todos";
  render();
};

ACOES_EXTRAS["save-person-notes"] = (b, id) => {
  const p = S.people.find(o => o.id === id);
  if (!p) return;
  const campo = document.getElementById("p-notes-" + id);
  if (campo) {
    p.notes = campo.value.trim();
    commit();
    toast("Anotações salvas!", true, "happy");
  }
};

ACOES_EXTRAS["add-person-history"] = (b, id) => {
  const p = S.people.find(o => o.id === id);
  if (!p) return;
  const notaCampo = document.getElementById("p-hnote-" + id);
  const dataCampo = document.getElementById("p-hdate-" + id);
  const note = notaCampo ? notaCampo.value.trim() : "";
  const d = dataCampo && dataCampo.value ? dataCampo.value : today();

  if (!Array.isArray(p.history)) p.history = [];
  p.history.unshift({ date: d, note });
  p.history.sort((x, y) => (x.date < y.date ? 1 : -1));
  if (p.history.length > 30) p.history = p.history.slice(0, 30);

  if (!p.last || d >= p.last) p.last = d;

  earn(3, b);
  S.stats.talked++;
  react("happy", `Que bom que falou com <b>${esc(p.name)}</b>! Gente faz bem.`, 2600);
  commit();
  toast("Contato registrado!", true, "happy");
};

ACOES_EXTRAS["del-person-history"] = (b, id) => {
  const p = S.people.find(o => o.id === id);
  if (!p || !Array.isArray(p.history)) return;
  const idx = +b.dataset.idx;
  if (idx >= 0 && idx < p.history.length) {
    p.history.splice(idx, 1);
    p.last = p.history[0] ? p.history[0].date : "";
    commit();
  }
};

ACOES_EXTRAS["edit-person"] = (b, id) => {
  const p = S.people.find(o => o.id === id);
  if (!p) return;
  const grp = document.getElementById("p-edit-group-" + id);
  const evr = document.getElementById("p-edit-every-" + id);
  const bdy = document.getElementById("p-edit-bday-" + id);
  const phn = document.getElementById("p-edit-phone-" + id);

  if (grp) p.group = grp.value;
  if (evr) p.every = +evr.value || 0;
  if (phn) p.phone = phn.value.trim();
  if (bdy) {
    const m = bdy.value.trim().match(/^(\d{1,2})\/(\d{1,2})$/);
    p.bday = m && +m[1] >= 1 && +m[1] <= 31 && +m[2] >= 1 && +m[2] <= 12 ? `${pad(+m[2])}-${pad(+m[1])}` : "";
  }
  commit();
  toast("Dados atualizados!", true, "happy");
};

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
