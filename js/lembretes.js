/*
  Lembretes com o app fechado (notificação de verdade no celular), para quem tem conta.
  Como funciona, sem servidor pago:
  1. Aqui no app: pede permissão, pega o código de notificação do aparelho (Firebase Cloud Messaging)
     e calcula os próximos lembretes (água, tarefas com horário, hábitos com horário, véspera de prova).
  2. Guarda tudo em lembretes/{uid} no Firestore (só o dono lê e escreve).
  3. A Action agendada (.github/workflows/lembretes.yml) roda a cada 10 minutos, vê o que venceu e manda.
  4. O sw.js recebe: com o app fechado mostra a notificação do sistema; com o app aberto
     passa para a tela, que mostra o banner com o som do Prumo.
  Pode chegar com alguns minutos de atraso (o agendador do GitHub não é exato).
  Precisa da chave pública de Web Push em js/firebase-config.js (FIREBASE_VAPID_CHAVE).
*/
"use strict";

const LEMBRETE_HORAS = 48; // quanto à frente calcular
let mensageiro = null;
let syncLembretesTimer = null;
let ultimoLembretesEnviado = "";

const lembretesDisponivel = () =>
  typeof FIREBASE_VAPID_CHAVE !== "undefined" &&
  !!FIREBASE_VAPID_CHAVE &&
  typeof modoFirebase === "function" &&
  modoFirebase() &&
  "serviceWorker" in navigator &&
  "Notification" in window;

const momento = (d, hm) => new Date(`${d}T${hm}:00`).getTime();

/** Os próximos lembretes, já com hora certa (milissegundos), do mais cedo ao mais tarde. */
function proximosLembretes(agora = Date.now()) {
  const L = S.lembretes;
  const ate = agora + LEMBRETE_HORAS * 36e5;
  const itens = [];
  const add = (em, titulo, corpo, tag, aba) => {
    if (em > agora && em <= ate)
      itens.push({ em, titulo: titulo.slice(0, 80), corpo: corpo.slice(0, 200), tag, aba });
  };
  const dias = [today(), addDays(today(), 1)];
  // água: a cada 2 horas entre acordar e dormir; some no dia em que a meta já bateu
  if (L.agua) {
    const w = hm2min(S.wake),
      sl = hm2min(S.sleep) > w ? hm2min(S.sleep) : hm2min(S.sleep) + 1440;
    for (const d of dias) {
      if (d === today() && waterToday() >= S.waterGoal) continue;
      for (let m = w + 60; m < sl - 30; m += 120) {
        const hm = `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
        add(
          momento(d, hm),
          "Hora da água",
          `Um copo agora. A meta é ${fmtML(S.waterGoal)} hoje.`,
          `agua-${d}-${hm}`,
          "dieta"
        );
      }
    }
  }
  if (L.tarefas)
    for (const t of S.tasks)
      if (!t.done && t.time && dias.includes(t.date))
        add(momento(t.date, t.time), "Tarefa agora", t.title, `tarefa-${t.id}-${t.date}`, "hoje");
  if (L.habitos)
    for (const h of S.habits)
      if (h.time)
        for (const d of dias)
          if (habitDue(h, d) && !habitDone(h, d))
            add(momento(d, h.time), "Hábito", h.name, `habito-${h.id}-${d}`, "social");
  if (L.provas)
    for (const e of S.exams) {
      const vespera = addDays(e.date, -1);
      if (dias.includes(vespera)) {
        const nome = (subjName(e.subjectId) ? subjName(e.subjectId) + ": " : "") + e.title;
        add(
          momento(vespera, "19:00"),
          "Prova amanhã",
          `${nome}. Uma revisão leve hoje e boa noite de sono.`,
          `prova-${e.id}`,
          "estudos"
        );
      }
    }
  return itens.sort((a, b) => a.em - b.em).slice(0, 60);
}

async function pegarMensageiro() {
  if (mensageiro) return mensageiro;
  await carregarFirebase();
  if (!firebase.messaging)
    await carregarScript(
      `https://www.gstatic.com/firebasejs/${FIREBASE_VERSAO}/firebase-messaging-compat.js`
    );
  if (firebase.messaging.isSupported && !(await firebase.messaging.isSupported()))
    throw new Error("sem suporte");
  mensageiro = firebase.messaging();
  return mensageiro;
}

async function tokenDoAparelho() {
  const m = await pegarMensageiro();
  const reg = registroSW || (await navigator.serviceWorker.ready);
  return m.getToken({ vapidKey: FIREBASE_VAPID_CHAVE, serviceWorkerRegistration: reg });
}

/** Manda para o Firestore os próximos lembretes e o aparelho (só se mudou algo). */
async function sincronizarLembretes(forcar) {
  if (!S.lembretes.ligado || !lembretesDisponivel() || !banco || !meuId) return;
  try {
    const token = await tokenDoAparelho();
    if (!token) return;
    const tokens = [token, ...(S.lembretes.tokens || []).filter(t => t !== token)].slice(0, 5);
    S.lembretes.tokens = tokens;
    const doc = {
      tokens,
      itens: proximosLembretes(),
      fuso: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      atualizado: Date.now()
    };
    const chave = JSON.stringify([doc.tokens, doc.itens]);
    if (!forcar && chave === ultimoLembretesEnviado) return;
    ultimoLembretesEnviado = chave;
    await banco.doc(`lembretes/${meuId}`).set(doc, { merge: true });
  } catch (e) {
    if (forcar) throw e;
  }
}

function agendarSyncLembretes() {
  if (!S.lembretes.ligado) return;
  clearTimeout(syncLembretesTimer);
  syncLembretesTimer = setTimeout(() => sincronizarLembretes(), 4000);
}
// a cada mudança salva (beber água, concluir tarefa...) e de hora em hora (a janela anda)
{
  const persistAntes = persist;
  persist = function (silencioso) {
    persistAntes(silencioso);
    if (silencioso !== true) agendarSyncLembretes();
  };
  setInterval(agendarSyncLembretes, 36e5);
}

async function ligarLembretes() {
  if (!lembretesDisponivel())
    return toast(
      "Os lembretes com o app fechado precisam de conta e de um navegador com notificações.",
      false,
      "worried"
    );
  const permissao =
    Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permissao !== "granted")
    return toast(
      "Sem permissão para notificar. Dá pra liberar nas configurações do navegador.",
      false,
      "worried"
    );
  S.lembretes.ligado = true;
  try {
    await sincronizarLembretes(true);
    commit();
    notificar({
      titulo: "Lembretes ligados",
      texto: "Vou te avisar mesmo com o Prumo fechado. Pode chegar com alguns minutos de atraso.",
      tipo: "lembrete",
      mood: "party"
    });
  } catch (e) {
    S.lembretes.ligado = false;
    commit();
    toast("Não consegui ligar agora. Tenta de novo daqui a pouco.", false, "worried");
  }
}

async function desligarLembretes() {
  S.lembretes.ligado = false;
  ultimoLembretesEnviado = "";
  commit();
  try {
    if (banco && meuId) await banco.doc(`lembretes/${meuId}`).delete();
    if (mensageiro) await mensageiro.deleteToken().catch(() => {});
  } catch (e) {}
  S.lembretes.tokens = [];
  persist();
  toast("Lembretes com o app fechado desligados.");
}

ACOES_EXTRAS["lembretes-ligar"] = () => (S.lembretes.ligado ? desligarLembretes() : ligarLembretes());
ACOES_EXTRAS["lembretes-tipo"] = b => {
  const k = b.dataset.s;
  if (!["agua", "tarefas", "habitos", "provas"].includes(k)) return;
  S.lembretes[k] = !S.lembretes[k];
  commit();
};

function lembretesAjustesHTML() {
  const pode = lembretesDisponivel();
  const L = S.lembretes;
  const tipo = (k, rotulo) =>
    `<button class="chip-bt" data-act="lembretes-tipo" data-s="${k}" aria-pressed="${!!L[k]}">${rotulo}</button>`;
  return `<div class="setrow"><div class="lbl"><b>Lembretes com o app fechado</b><span class="note">${
    pode
      ? "Notificação no celular na hora da água, das tarefas e hábitos com horário e na véspera de prova. No iPhone, instale o Prumo na tela inicial antes."
      : typeof modoFirebase === "function" && modoFirebase()
        ? "Ainda não disponível neste navegador."
        : "Funciona com conta. Entre numa conta em Ajustes, Conta."
  }</span>${L.ligado ? `<div class="row lembretes-tipos">${tipo("agua", "Água")}${tipo("tarefas", "Tarefas")}${tipo("habitos", "Hábitos")}${tipo("provas", "Provas")}</div>` : ""}</div><button class="btn small ${L.ligado ? "" : "ghost"}" data-act="lembretes-ligar" aria-pressed="${!!L.ligado}" ${pode || L.ligado ? "" : "disabled"}>${L.ligado ? "Ligados" : "Ligar"}</button></div>`;
}

/* Com o app aberto, o service worker passa o lembrete para cá: banner com o som do Prumo. */
if ("serviceWorker" in navigator)
  navigator.serviceWorker.addEventListener("message", e => {
    const d = e.data || {};
    if (d.tipo !== "lembrete") return;
    notificar({
      titulo: String(d.titulo || "Prumo").slice(0, 80),
      texto: String(d.corpo || "").slice(0, 200),
      tipo: "lembrete",
      mood: /água/i.test(d.titulo || "") ? "drink" : "happy",
      aba: VIEWS[d.aba] ? d.aba : undefined
    });
  });
