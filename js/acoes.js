/*
  O que acontece quando você clica, envia um formulário ou muda um campo.
*/
"use strict";

/* ================= ações ================= */
const getV = id => {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
};

const forms = {
  recado() {
    enviarRecado(getV("recado-txt"));
    const el = document.getElementById("recado-txt");
    if (el) el.value = "";
  },
  quick() {
    const raw = getV("q");
    if (!raw) return;
    const p = parseQuick(raw, selDay);
    if (!p.title) return toast("Escreva o nome da tarefa"), undefined;
    const nid = newId();
    S.tasks.push({
      id: nid,
      title: p.title,
      area: p.area || "geral",
      date: p.date,
      time: p.time,
      done: false,
      prio: p.prio,
      repeat: p.repeat,
      sub: []
    });
    document.getElementById("q").value = "";
    fx.newId = nid;
    if (p.date !== selDay) toast(`Adicionada para ${relDay(p.date)}`);
    react(
      "happy",
      `Anotado pra <b>${esc(relDay(p.date))}</b>${p.time ? ` às ${p.time}` : ""}. ${p.repeat ? "E eu repito pra você." : "Deixa comigo."}`,
      2400
    );
    return "q";
  },
  sub(f) {
    const id = f.dataset.id,
      x = S.tasks.find(t => t.id === id),
      v = getV("sub-" + id);
    if (!x || !v) return;
    x.sub.push({ id: newId(), t: v, done: false });
    return "sub-" + id;
  },
  subject() {
    const name = getV("s-name");
    if (!name) return;
    const s = { id: newId(), name, color: SUBJ_COLORS[S.subjects.length % SUBJ_COLORS.length] };
    S.subjects.push(s);
    if (!timer.subjectId) {
      timer.subjectId = s.id;
      saveTimerState();
    }
    return "s-name";
  },
  manual() {
    const sid = getV("m-subj"),
      min = parseInt(getV("m-min"), 10);
    if (!sid || !(min > 0)) return;
    S.sessions.push({ id: newId(), subjectId: sid, date: today(), min });
    toast(`${min} min de ${subjName(sid)} registrados`);
  },
  review() {
    const topic = getV("rv-topic"),
      sid = getV("rv-subj");
    if (!topic) return;
    S.reviews.push({
      id: newId(),
      subjectId: sid,
      topic,
      created: today(),
      step: 0,
      due: addDays(today(), REV_STEPS[0]),
      done: false
    });
    toast("Primeira revisão marcada para amanhã");
    return "rv-topic";
  },
  class() {
    const sid = getV("c-subj"),
      start = getV("c-start"),
      end = getV("c-end");
    if (!sid || !start || !end) return;
    S.classes.push({
      id: newId(),
      subjectId: sid,
      day: +getV("c-day"),
      start,
      end: end > start ? end : start,
      room: getV("c-room")
    });
  },
  exam() {
    const title = getV("e-title"),
      date = getV("e-date");
    if (!title || !date) return;
    S.exams.push({ id: newId(), title, subjectId: getV("e-subj"), date });
    return "e-title";
  },
  shop() {
    const text = getV("sh-text");
    if (!text) return;
    text
      .split(/\s*,\s*/)
      .filter(Boolean)
      .forEach(tx => S.shopping.push({ id: newId(), text: tx, done: false }));
    return "sh-text";
  },
  drink() {
    const ml = parseInt(getV("w-ml"), 10);
    if (!(ml > 0)) return;
    addWater(ml);
  },
  event() {
    const title = getV("ev-title"),
      date = getV("ev-date");
    if (!title || !date) return;
    S.events.push({ id: newId(), title, date, time: getV("ev-time"), place: getV("ev-place") });
    return "ev-title";
  },
  person() {
    const name = getV("p-name");
    if (!name) return;
    let bday = "";
    const m = getV("p-bday").match(/^(\d{1,2})\/(\d{1,2})$/);
    if (m && +m[1] >= 1 && +m[1] <= 31 && +m[2] >= 1 && +m[2] <= 12) bday = `${pad(+m[2])}-${pad(+m[1])}`;
    S.people.push({ id: newId(), name, last: "", every: +getV("p-every") || 0, bday });
    return "p-name";
  },
  parceria() {
    conectarPorCodigo(getV("par-codigo"), getV("par-tipo") || "namoro");
  },
  habit(f) {
    const name = getV("h-name");
    if (!name) return;
    const days = [...f.querySelectorAll('input[name="h-days"]:checked')].map(i => +i.value);
    S.habits.push({
      id: newId(),
      name,
      time: getV("h-time"),
      days: days.length ? days : [0, 1, 2, 3, 4, 5, 6],
      created: today()
    });
    return "h-name";
  }
};

function addWater(ml) {
  const d = today(),
    before = waterToday();
  (S.water[d] || (S.water[d] = [])).push({ t: nowHM(), ml });
  const tot = waterToday();
  fx.waterFrom = before;
  const pd = paidDay(d);
  if (tot >= S.waterGoal && before < S.waterGoal) {
    fx.big = true;
    if (!pd.water) {
      pd.water = 1;
      S.stats.water++;
      earn(20);
    }
    react("party", say("goal"), 4500);
    toast(`Meta de ${fmtML(S.waterGoal)} batida!`, false, "party");
  } else {
    const left = S.waterGoal - tot;
    react(
      "drink",
      left > 0
        ? say("drink", { ml }) + ` Faltam ${left.toLocaleString("pt-BR")} mL.`
        : `Glub! Já passou da meta, ${fmtML(tot)} hoje.`,
      2400
    );
    toast(`+${ml} mL · ${fmtML(tot)} hoje`, false, "drink");
  }
}

document.addEventListener("submit", e => {
  const f = e.target.closest("form[data-form]");
  if (!f) return;
  e.preventDefault();
  const fn = forms[f.dataset.form];
  if (!fn) return;
  const focusId = fn(f);
  commit();
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) el.focus();
  }
});

document.addEventListener("input", e => {
  if (e.target.id === "q") {
    const box = document.getElementById("qparsed");
    if (box) box.innerHTML = parsedPills(parseQuick(e.target.value, selDay), e.target.value);
  }
});

function toggleTask(x) {
  x.done = !x.done;
  if (x.done && x.repeat) {
    const base = x.date > today() ? x.date : today();
    const nd = nextDate(x.repeat, base);
    const n = {
      id: newId(),
      title: x.title,
      area: x.area,
      date: nd,
      time: x.time,
      done: false,
      prio: x.prio,
      repeat: x.repeat,
      sub: x.sub.map(s => ({ id: newId(), t: s.t, done: false }))
    };
    S.tasks.push(n);
    x.spawned = n.id;
    x.repeat = "";
    x.wasRepeat = n.repeat;
    toast(`Próxima: ${relDay(nd)}`);
  } else if (!x.done && x.spawned) {
    const i = S.tasks.findIndex(t => t.id === x.spawned && !t.done);
    if (i > -1) {
      x.repeat = S.tasks[i].repeat;
      S.tasks.splice(i, 1);
    } else if (x.wasRepeat) x.repeat = x.wasRepeat;
    delete x.spawned;
    delete x.wasRepeat;
  }
}

function logTimer() {
  const min = Math.round(elapsed() / 6e4);
  if (min >= 1 && timer.subjectId) {
    S.sessions.push({ id: newId(), subjectId: timer.subjectId, date: today(), min });
    S.stats.focus += min;
    earn(Math.min(40, Math.floor(min / 5) * 2));
    toast(`${min} min de ${subjName(timer.subjectId)} registrados`);
  } else toast("Menos de 1 minuto, nada registrado");
  timer.running = false;
  timer.acc = 0;
  timer.start = 0;
  timer.beeped = false;
  timer.label = "";
  saveTimerState();
}

function beep() {
  try {
    const A = window.AudioContext || window.webkitAudioContext;
    const a = new A();
    [0, 0.35, 0.7].forEach(t => {
      const o = a.createOscillator(),
        g = a.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.18, a.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + t + 0.3);
      o.connect(g).connect(a.destination);
      o.start(a.currentTime + t);
      o.stop(a.currentTime + t + 0.3);
    });
  } catch (e) {}
}

async function doExport() {
  const data = JSON.stringify(
    { app: "prumo", version: 2, exportedAt: new Date().toISOString(), state: S },
    null,
    1
  );
  const name = `prumo-backup-${today()}.json`;
  try {
    const dl = window.claude && (await window.claude.use("downloads"));
    if (dl) {
      await dl.save({ filename: name, data });
      toast("Backup salvo");
      return;
    }
  } catch (e) {
    if (e && e.code === "declined") return;
  }
  const box = document.getElementById("exportbox");
  if (box) {
    box.hidden = false;
    box.value = data;
    box.select();
    toast("Copie o texto abaixo e guarde num arquivo .json");
  }
}

document.getElementById("importfile").addEventListener("change", e => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const j = JSON.parse(r.result);
      if (!j || j.app !== "prumo" || !j.state) throw 0;
      snapUndo();
      S = normalize(j.state);
      commit();
      toast("Backup restaurado", true);
    } catch (_) {
      toast("Esse arquivo não é um backup do Prumo");
    }
    e.target.value = "";
  };
  r.readAsText(f);
});

document.addEventListener("click", e => {
  const tb = e.target.closest("[data-tab]");
  if (tb) {
    if (tab === tb.dataset.tab) return;
    tab = tb.dataset.tab;
    openTask = null;
    fx.enter = true;
    if (tab === "hoje") {
      poseIdx++;
      fx.entrada = pick(["pulo", "giro", "espiada", "aceno"]);
    }
    try {
      history.replaceState(null, "", "#" + tab);
    } catch (_) {}
    render();
    try {
      window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
    } catch (_) {}
    return;
  }
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const id = b.dataset.id,
    act = b.dataset.act,
    x = id ? S.tasks.find(t => t.id === id) : null;
  switch (act) {
    case "day":
      if (selDay !== b.dataset.d) {
        selDay = b.dataset.d;
        openTask = null;
        fx.enter = true;
        render();
      }
      break;
    case "open":
      openTask = openTask === id ? null : id;
      if (openTask) fx.opened = id;
      render();
      break;
    case "poke": {
      tipI = (tipI + 1) % TIPS.length;
      const k = b.dataset.kind;
      // O mundo pode ter um segredo ao tocar no Prumi (ex.: 13 toques viram morcego no emo)
      const efeitoMundo = MUNDO_FX[S.persona];
      if ((k === "hero" || k === "stage") && efeitoMundo && efeitoMundo.aoTocar && efeitoMundo.aoTocar())
        break;
      if (k === "hero" || k === "stage") {
        const d = today(),
          antes = S.carinho[d] || 0;
        S.carinho[d] = antes + 1;
        persist();
        if (antes < CARINHO_MAX) {
          const h = calcularHumor();
          react(
            h.valor < 30 ? "sad" : "happy",
            h.valor < 30
              ? `Obrigado pelo carinho... mas o que me anima mesmo é ver as tarefas feitas.`
              : pick([
                  "Hehe, que carinho bom!",
                  "Aaah, me senti amado.",
                  "Mais um carinho? Tô ficando mimado.",
                  "Isso me deixou mais feliz!"
                ]),
            2600
          );
          if (tab === "hoje") render();
          break;
        }
      }
      const msg =
        k === "water"
          ? waterToday() >= S.waterGoal
            ? "Tô cheinho! Obrigado por cuidar de mim (e de você)."
            : `Me enche? Faltam <b>${(S.waterGoal - waterToday()).toLocaleString("pt-BR")} mL</b> pra meta.`
          : k === "timer"
            ? timer.running
              ? "Foco! Eu cuido do tempo, você cuida do conteúdo."
              : "Escolhe a matéria e aperta Começar. Eu fico de olho."
            : TIPS[tipI];
      react(k === "timer" && timer.running ? "focus" : "happy", msg, 3800);
      if (k !== "hero") toast(msg.replace(/<[^>]+>/g, ""), false, "happy");
      break;
    }
    case "toggle":
      if (x) {
        toggleTask(x);
        if (x.done) {
          fx.toggled = id;
          fx.burst = `[data-act="toggle"][data-id="${id}"]`;
          const eraAtrasada = x.date < today();
          if (!x.paid) {
            S.stats.tasks++;
            x.paid = earn((x.prio === 3 ? 8 : 5) + (eraAtrasada ? 2 : 0), b); // guarda o que ganhou para devolver se desmarcar
          }
          if (eraAtrasada) {
            react(
              "happy",
              `Ufa! Uma atrasada a menos, já tô melhor. <b>+2 gotas</b> de bônus por resolver.`,
              3000
            );
            fx.toggled = id;
            fx.burst = `[data-act="toggle"][data-id="${id}"]`;
            commit();
            break;
          }
          const tt = S.tasks.filter(k => k.date === x.date);
          if (x.date === today() && tt.every(k => k.done)) {
            fx.big = true;
            react("party", say("done"), 4500);
          } else react("happy", say("cheers"), 2200);
        } else if (x.paid) {
          earn(-x.paid, b);
          S.stats.tasks = Math.max(0, S.stats.tasks - 1);
          x.paid = 0;
        }
        commit();
      }
      break;
    case "subtoggle":
      if (x) {
        const s = x.sub.find(s => s.id === b.dataset.sid);
        if (s) {
          s.done = !s.done;
          commit();
        }
      }
      break;
    case "subdel":
      if (x) {
        x.sub = x.sub.filter(s => s.id !== b.dataset.sid);
        commit();
      }
      break;
    case "prio":
      if (x) {
        x.prio = +b.dataset.p;
        commit();
      }
      break;
    case "postpone":
      if (x) {
        x.date = addDays(x.date < today() ? today() : x.date, 1);
        openTask = null;
        commit();
        toast("Adiada para " + relDay(x.date));
      }
      break;
    case "rollover": {
      snapUndo();
      let n = 0;
      S.tasks.forEach(t => {
        if (!t.done && t.date < today()) {
          t.date = today();
          n++;
        }
      });
      commit();
      toast(`${n} ${n === 1 ? "tarefa trazida" : "tarefas trazidas"} para hoje`, true);
      break;
    }
    case "focus":
      if (x) {
        if (!S.subjects.length) {
          tab = "estudos";
          render();
          toast("Cadastre uma matéria para usar o foco");
          break;
        }
        const m = S.subjects.find(s => norm(x.title).includes(norm(s.name.replace(/^exemplo:\s*/i, ""))));
        if (m) timer.subjectId = m.id;
        else if (!timer.subjectId) timer.subjectId = S.subjects[0].id;
        timer.label = x.title;
        timer.acc = 0;
        timer.beeped = false;
        timer.running = true;
        timer.start = Date.now();
        saveTimerState();
        tab = "estudos";
        openTask = null;
        render();
        window.scrollTo(0, 0);
      }
      break;
    case "del": {
      const lk = b.dataset.list;
      const doDel = () => {
        const list = S[lk];
        const i = list.findIndex(o => o.id === id);
        if (i > -1) {
          snapUndo();
          const name = list[i].title || list[i].name || list[i].text || list[i].topic || "Item";
          list.splice(i, 1);
          if (openTask === id) openTask = null;
          commit();
          toast(`"${name}" apagado`, true, "worried");
        }
      };
      const li = b.closest("ul.list>li");
      if (li && !RM) {
        li.classList.add("leaving");
        setTimeout(doDel, 230);
      } else doDel();
      break;
    }
    case "undo":
      if (undoState) {
        S = normalize(JSON.parse(undoState));
        undoState = null;
        commit();
        document.getElementById("toast").hidden = true;
      }
      break;
    case "drink":
      addWater(+b.dataset.ml);
      commit();
      break;
    case "undrink": {
      const arr = S.water[today()] || [];
      const i = +b.dataset.i;
      if (arr[i]) {
        snapUndo();
        const ml = arr[i].ml;
        arr.splice(i, 1);
        commit();
        toast(`${ml} mL removidos`, true);
      }
      break;
    }
    case "habit": {
      const d = today();
      const arr = S.habitLog[d] || (S.habitLog[d] = []);
      const i = arr.indexOf(id);
      if (i > -1) {
        arr.splice(i, 1);
        earn(-(paidDay(d)["h_" + id] || 5), b); // devolve o que ganhou ao marcar
        delete paidDay(d)["h_" + id];
      } else {
        arr.push(id);
        paidDay(d)["h_" + id] = earn(5, b);
        fx.habit = id;
        fx.burst = `[data-act="habit"][data-id="${id}"]`;
        const h = S.habits.find(o => o.id === id);
        if (h) {
          const st = habitStreak(h);
          react(
            st >= 7 ? "party" : "happy",
            st >= 2
              ? `<b>${st} dias seguidos</b> de ${esc(h.name)}! Não quebra a corrente.`
              : `Começou! ${esc(h.name)} feito hoje.`,
            2800
          );
          if (st > 0 && st % 7 === 0) fx.big = true;
        }
      }
      commit();
      break;
    }
    case "reviewed": {
      const r = S.reviews.find(o => o.id === id);
      if (r) {
        burstAt(`[data-act="reviewed"][data-id="${id}"]`, 16);
        earn(8, b);
        S.stats.reviews++;
        r.step++;
        r.last = today();
        if (r.step >= REV_STEPS.length) {
          r.done = true;
          fx.big = true;
          react("party", `<b>${esc(r.topic)}</b> fixado! Todas as revisões feitas.`, 4000);
        } else {
          r.due = addDays(today(), REV_STEPS[r.step]);
          react("happy", `Revisado! Te lembro de novo em <b>${REV_STEPS[r.step]} dias</b>.`, 2600);
          toast(`Próxima revisão em ${REV_STEPS[r.step]} dias`);
        }
        commit();
      }
      break;
    }
    case "shop": {
      const s = S.shopping.find(o => o.id === id);
      if (s) {
        s.done = !s.done;
        commit();
      }
      break;
    }
    case "clearshop":
      snapUndo();
      S.shopping = S.shopping.filter(s => !s.done);
      commit();
      toast("Itens comprados removidos", true);
      break;
    case "mealday":
      mealDay = +b.dataset.i;
      render();
      break;
    case "mealcheck": {
      const d = today();
      const c = S.mealCheck[d] || (S.mealCheck[d] = {});
      c[b.dataset.slot] = !c[b.dataset.slot];
      commit();
      break;
    }
    case "copymeals": {
      snapUndo();
      const src = S.meals[mealDay] || {};
      for (let i = 0; i < 7; i++) S.meals[i] = { ...src };
      commit();
      toast("Cardápio copiado para a semana toda", true);
      break;
    }
    case "talked": {
      const p = S.people.find(o => o.id === id);
      if (p) {
        p.last = today();
        earn(3, b);
        S.stats.talked++;
        react("happy", `Que bom que falou com <b>${esc(p.name)}</b>! Gente faz bem.`, 2600);
        commit();
      }
      break;
    }
    case "goal":
      timer.goal = +b.dataset.g;
      saveTimerState();
      render();
      break;
    case "start": {
      const sel = document.getElementById("tm-subj");
      if (sel && !timer.acc) timer.subjectId = sel.value;
      timer.running = true;
      timer.start = Date.now();
      saveTimerState();
      render();
      toast("Foco ligado. Bom estudo!", false, "focus");
      break;
    }
    case "pause":
      timer.acc = elapsed();
      timer.running = false;
      saveTimerState();
      render();
      break;
    case "finish": {
      const m = Math.round(elapsed() / 6e4);
      logTimer();
      if (m >= 1) {
        react("party", `<b>${m} min</b> de foco registrados. Orgulho!`, 3500);
        if (m >= 20) fx.big = true;
        else fx.burst = ".clock";
      }
      commit();
      break;
    }
    case "reset":
      timer.running = false;
      timer.acc = 0;
      timer.beeped = false;
      timer.label = "";
      saveTimerState();
      render();
      break;
    case "closeday": {
      snapUndo();
      const t = today(),
        tm = addDays(t, 1);
      let n = 0;
      S.tasks.forEach(k => {
        if (!k.done && k.date <= t) {
          k.date = tm;
          n++;
        }
      });
      S.journal[t] = { note: getV("jnote"), closed: true };
      {
        const pd = paidDay(t);
        if (!pd.close) {
          pd.close = 1;
          S.stats.closed++;
          earn(10, b);
        }
      }
      react(
        "sleepy",
        `Dia fechado${n ? `, ${n} ${n === 1 ? "tarefa foi" : "tarefas foram"} pra amanhã` : ""}. Descansa, você merece.`,
        4000
      );
      commit();
      toast(
        n
          ? `Dia fechado. ${n} ${n === 1 ? "tarefa foi" : "tarefas foram"} para amanhã.`
          : "Dia fechado. Bom descanso!",
        true
      );
      break;
    }
    case "reopen": {
      const j = S.journal[today()];
      if (j) {
        j.closed = false;
        commit();
      }
      break;
    }
    case "export":
      doExport();
      break;
    case "import":
      document.getElementById("importfile").click();
      break;
    case "wipe":
      if (!wipeArmed) {
        wipeArmed = true;
        render();
        setTimeout(() => {
          if (wipeArmed) {
            wipeArmed = false;
            if (tab === "ajustes") render();
          }
        }, 4000);
      } else {
        wipeArmed = false;
        snapUndo();
        S = blank();
        commit();
        toast("Tudo apagado", true);
      }
      break;
    case "ptab":
      prumiTab = b.dataset.t;
      tryItem = null;
      if (tryPal) {
        tryPal = null;
        applyTheme();
      }
      render();
      break;
    case "slot":
      slotSel = b.dataset.s;
      render();
      break;
    case "item": {
      const it = ITEM[id];
      if (!it) break;
      const st = itemState(it);
      if (st === "on") {
        delete S.equip[it.slot];
        tryItem = null;
        commit();
      } else if (st === "own") {
        S.equip[it.slot] = it.id;
        tryItem = null;
        react("happy", pick(["Ficou estiloso!", "Gostei desse look!", "Combinou demais!"]), 2200);
        commit();
      } else if (st === "lock") {
        const a = ACH[it.ach];
        toast(
          a ? `Lendário: desbloqueie com "${a.name}" (${a.desc.toLowerCase()})` : "Item lendário",
          false,
          "worried"
        );
      } else {
        tryItem = tryItem === it.id ? null : it.id;
        render();
      }
      break;
    }
    case "untry":
      tryItem = null;
      if (tryPal) {
        tryPal = null;
        applyTheme();
      }
      render();
      break;
    case "buy": {
      const it = ITEM[id];
      if (it && it.evento && !eventoAtivo(it)) break; // evento acabou
      if (!it || S.owned.includes(it.id) || S.coins < it.price) break;
      earn(-it.price, b);
      S.owned.push(it.id);
      S.equip[it.slot] = it.id;
      tryItem = null;
      fx.big = true;
      react("party", `Comprou <b>${esc(it.name.toLowerCase())}</b>! Tô me achando.`, 3200);
      toast(`${it.name} é seu!`, false, "party");
      commit();
      break;
    }
    case "unequip":
      delete S.equip[b.dataset.s];
      commit();
      break;
    case "tvar": {
      const th = TH(),
        v = th.vars.find(x => x.id === id);
      if (!v) break;
      const own = v.id === "base" || S.themeOwned.includes(S.persona + ":" + v.id) || (v.ach && S.ach[v.ach]);
      if (own) {
        S.themeBy[S.persona] = v.id;
        tryPal = null;
        applyTheme();
        commit();
        toast(`Tema ${v.name} aplicado`);
      } else if (v.ach) {
        const a = ACHS.find(a => a.id === v.ach);
        toast(
          a ? `Lendário: desbloqueie com "${a.name}" (${a.desc.toLowerCase()})` : "Tema lendário",
          false,
          "worried"
        );
      } else {
        tryPal = tryPal === v.id ? null : v.id;
        applyTheme(null, tryPal || undefined);
        render();
      }
      break;
    }
    case "buytvar": {
      const v = TH().vars.find(x => x.id === id);
      const key = S.persona + ":" + id;
      if (!v || !v.price || S.coins < v.price || S.themeOwned.includes(key)) break;
      earn(-v.price, b);
      S.themeOwned.push(key);
      S.themeBy[S.persona] = v.id;
      tryPal = null;
      applyTheme();
      fx.big = true;
      react("party", `Tema <b>${esc(v.name)}</b> desbloqueado!`, 3000);
      commit();
      break;
    }
    case "mode":
      S.mode = b.dataset.m;
      applyTheme();
      commit();
      break;
    case "gender":
      S.gender = b.dataset.g;
      commit();
      toast("Tratamento atualizado.");
      break;
    case "persona": {
      if (S.persona === id) break;
      setPersona(id);
      tryItem = null;
      tryPal = null;
      applyTheme();
      fx.enter = true;
      react("happy", say("cheers"), 4200);
      toast(`Agora eu sou ${PERSONAS[id].name}!`, false, "happy");
      commit();
      break;
    }
    case "ics": {
      try {
        saveIcs(JSON.parse(b.dataset.ev));
      } catch (_) {}
      break;
    }
    case "reonb":
      S.onboarded = false;
      onbShown = false;
      onb.step = 0;
      commit();
      break;
    case "onbnext": {
      const n = document.getElementById("onb-name");
      if (n) onb.name = n.value.trim().slice(0, 30);
      onb.step = Math.min(3, onb.step + 1);
      if (onb.step >= 2) applyTheme(onb.persona, "base");
      renderOnb();
      document.getElementById("onb").scrollTop = 0;
      break;
    }
    case "onbback":
      onb.step = Math.max(0, onb.step - 1);
      if (onb.step < 2) applyTheme();
      renderOnb();
      break;
    case "onbcal":
      onb.calendar = b.dataset.c;
      renderOnb();
      break;
    case "onbpers":
      onb.persona = b.dataset.p;
      applyTheme(onb.persona, "base");
      renderOnb();
      break;
    case "onbgender":
      onb.gender = b.dataset.g;
      renderOnb();
      break;
    case "onbdone": {
      S.name = onb.name;
      S.gender = onb.gender || "m";
      S.calendar = onb.calendar;
      setPersona(onb.persona);
      applyTheme();
      fx.enter = true;
      if (!S.welcomed) {
        S.welcomed = true;
        S.coins += 50;
        S.xp += 50;
      }
      S.onboarded = true;
      fx.big = true;
      react(
        "party",
        `Prontinho${nome()}! Agora eu sou ${esc(PERSONAS[S.persona].name.toLowerCase())}. Bora organizar esse dia?`,
        5000
      );
      commit();
      break;
    }
    case "sortear-subnick":
      S.perfil.subnick = pick(subnicksDoMundo());
      commit();
      publicarPerfil(true);
      break;
    case "humor":
      humorAberto = !humorAberto;
      render();
      break;
    case "pose":
      poseIdx++;
      render();
      break;
    case "mimo":
      enviarMimo(b.dataset.t);
      break;
    case "aceitar":
      aceitarPedido(id);
      break;
    case "desfazer":
      desfazerParceria();
      break;
    case "sample":
      loadSample();
      break;
  }
});

document.addEventListener("change", e => {
  const el = e.target,
    c = el.dataset.change;
  if (!c) return;
  const x = el.dataset.id ? S.tasks.find(t => t.id === el.dataset.id) : null;
  if (c === "meal") {
    const d = S.meals[mealDay] || (S.meals[mealDay] = {});
    d[el.dataset.slot] = el.value.trim();
    persist();
    return;
  }
  if (c === "tmsubj") {
    timer.subjectId = el.value;
    saveTimerState();
    return;
  }
  if (c === "tdate" && x && el.value) {
    x.date = el.value;
    commit();
    return;
  }
  if (c === "ttime" && x) {
    x.time = el.value;
    commit();
    return;
  }
  if (c === "trepeat" && x) {
    x.repeat = el.value;
    commit();
    return;
  }
  if (c === "tarea" && x) {
    x.area = el.value;
    commit();
    return;
  }
  if (c === "set-goal") {
    const v = parseInt(el.value, 10);
    if (v >= 500 && v <= 8000) {
      S.waterGoal = v;
      persist();
      toast(`Meta de água: ${fmtML(v)}`);
    }
    return;
  }
  if (c === "set-cup") {
    const v = parseInt(el.value, 10);
    if (v >= 10 && v <= 3000) {
      S.cups[+el.dataset.i] = v;
      persist();
    }
    return;
  }
  if (c === "perfil-subnick") {
    S.perfil.subnick = el.value.trim().slice(0, 60);
    persist();
    publicarPerfil(true);
    return;
  }
  if (c === "perfil-sobre") {
    S.perfil.sobre = el.value.slice(0, 400);
    persist();
    return;
  }
  if (c === "set-cal") {
    S.calendar = el.value;
    commit();
    toast("Lembretes vão para o " + CALS[S.calendar]);
    return;
  }
  if (c === "set-name") {
    S.name = el.value.trim().slice(0, 30);
    persist();
    react("happy", S.name ? `Prazer, <b>${esc(S.name)}</b>!` : "Tudo bem, sem nome então.");
    return;
  }
  if (c === "set-wake" && el.value) {
    S.wake = el.value;
    persist();
    return;
  }
  if (c === "set-sleep" && el.value) {
    S.sleep = el.value;
    persist();
    return;
  }
});
