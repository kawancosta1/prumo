/*
  Ajudas de organização que aparecem na aba Hoje:
  - "Planejar meu dia": o Prumi monta a ordem das tarefas de hoje (as com horário ficam onde estão;
    as outras entram nos buracos, da mais importante pra menos), e dá pra usar esses horários com um toque.
  - Quebrar em passos: no detalhe da tarefa, vira 3 a 5 subtarefas pelo tipo da tarefa.
  - Revisão da semana (domingo, ou segunda se passou): o que ficou pra trás vai pra semana que vem, amanhã ou some.
  - Reta final das provas: faltando 7 dias ou menos, um cartão com a contagem e "Estudar agora".
  Dados: S.organizar = { revisao: "segunda-feira da semana revisada" }.
*/
"use strict";

let planoAberto = false;
const orgDados = () => {
  if (!S.organizar || typeof S.organizar !== "object") S.organizar = {};
  return S.organizar;
};
const minParaHM = m => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;

/** Quanto tempo uma tarefa deve levar (palpite): mais subtarefas, mais tempo. */
const duracaoTarefa = x =>
  Math.max(30, Math.min(90, (x.sub || []).filter(s => !s.done).length * 15 || (x.prio >= 3 ? 45 : 30)));

/** Plano do dia: lista de { x, ini, fim, fixa } em minutos do dia. */
function planoDoDiaHoje() {
  const t = today();
  const abertas = S.tasks.filter(x => x.date === t && !x.done);
  const agora = new Date();
  let cursor = Math.ceil((agora.getHours() * 60 + agora.getMinutes()) / 15) * 15;
  let fimDia = hm2min(S.sleep || "23:00") - 30;
  if (fimDia <= cursor) fimDia = cursor + 240;
  const fixas = abertas
    .filter(x => x.time)
    .map(x => ({ x, ini: hm2min(x.time), fim: hm2min(x.time) + duracaoTarefa(x), fixa: true }))
    .sort((a, b) => a.ini - b.ini);
  const soltas = abertas
    .filter(x => !x.time)
    .sort(
      (a, b) =>
        (b.prio || 0) - (a.prio || 0) || (a.area === "estudo" ? -1 : 0) - (b.area === "estudo" ? -1 : 0)
    );
  const plano = [...fixas];
  for (const x of soltas) {
    const dur = duracaoTarefa(x);
    // pula as tarefas com horário que estão no caminho
    let mexeu = true;
    while (mexeu) {
      mexeu = false;
      for (const f of plano)
        if (cursor < f.fim && cursor + dur > f.ini) {
          cursor = Math.ceil(f.fim / 15) * 15;
          mexeu = true;
        }
    }
    plano.push({ x, ini: cursor, fim: cursor + dur, fixa: false, depois: cursor + dur > fimDia });
    cursor += dur + 10; // respiro de 10 min
  }
  return plano.sort((a, b) => a.ini - b.ini);
}

function planoDiaHTML() {
  const plano = planoDoDiaHoje();
  if (!plano.length)
    return `<section class="block"><div class="card plano-dia"><b>Nada em aberto hoje.</b><span class="note">Aproveita o tempo livre!</span><button class="btn small ghost" data-act="plano-fechar">Fechar</button></div></section>`;
  const soltas = plano.filter(p => !p.fixa).length;
  return `<section class="block"><div class="card plano-dia"><div class="row" style="justify-content:space-between"><b>Seu plano de hoje</b><button class="icon" data-act="plano-fechar" aria-label="Fechar plano">${ICON.x}</button></div>
    <ol class="plano-lista">${plano
      .map(
        p =>
          `<li class="${p.fixa ? "fixa" : ""} ${p.depois ? "tarde" : ""}"><span class="mono">${minParaHM(p.ini)}</span><span class="plano-titulo">${esc(p.x.title)}</span><span class="note">${p.fixa ? "já tinha horário" : `${p.fim - p.ini} min`}</span></li>`
      )
      .join("")}</ol>
    ${plano.some(p => p.depois) ? `<span class="note">As últimas passam do seu horário de dormir. Dá pra deixar alguma pra amanhã.</span>` : ""}
    ${soltas ? `<div class="row"><button class="btn small primary" data-act="plano-usar">Usar esses horários</button><button class="btn small ghost" data-act="plano-fechar">Agora não</button></div>` : ""}</div></section>`;
}
ACOES_EXTRAS["plano-abrir"] = () => {
  planoAberto = true;
  render();
  react("happy", "Montei um plano com o que falta hoje. Começa pelo primeiro!", 3000);
};
ACOES_EXTRAS["plano-fechar"] = () => ((planoAberto = false), render());
ACOES_EXTRAS["plano-usar"] = () => {
  const plano = planoDoDiaHoje();
  plano.filter(p => !p.fixa).forEach(p => (p.x.time = minParaHM(p.ini)));
  planoAberto = false;
  commit();
  toast("Horários colocados nas tarefas", false, "happy");
};

/* ---------- quebrar em passos ---------- */
const MODELOS_PASSOS = [
  [
    /prova|estud|revis|materia|matéria|exerc|lista de|calculo|cálculo|fisica|física|quimica|química/,
    [
      "Separar o material",
      "Ler o resumo do conteúdo",
      "Fazer 5 exercícios",
      "Corrigir e anotar os erros",
      "Revisar o que errou"
    ]
  ],
  [
    /trabalho|projeto|relatorio|relatório|apresenta|tcc|artigo|slide/,
    [
      "Definir o que precisa entregar",
      "Juntar as fontes e ideias",
      "Fazer um rascunho rápido",
      "Melhorar o rascunho",
      "Revisar e entregar"
    ]
  ],
  [
    /limp|arrum|organiz|faxina|lavar/,
    ["Pôr uma música", "Tirar o que está fora do lugar", "Limpar a parte principal", "Jogar o lixo fora"]
  ],
  [/compra|mercado|feira/, ["Ver o que está faltando", "Fazer a lista", "Ir comprar", "Guardar tudo"]],
  [
    /academia|treino|corr|exercicio físico|caminh/,
    ["Separar a roupa", "Beber água", "Aquecer 5 min", "Treinar", "Alongar"]
  ],
  [/ler|livro|leitura|capitulo|capítulo/, ["Achar um lugar tranquilo", "Ler 10 páginas", "Anotar uma ideia"]],
  [
    /email|e-mail|mensagem|responder|ligar|marcar/,
    ["Separar o que precisa dizer", "Escrever", "Revisar e mandar"]
  ]
];
function passosPara(titulo) {
  const t = norm(titulo);
  // "fazer X e Y, Z" vira um passo para cada parte
  const partes = titulo
    .split(/,| e | depois /i)
    .map(s => s.trim())
    .filter(s => s.length > 2);
  if (partes.length >= 2) return partes.slice(0, 6).map(s => s.replace(/^./, c => c.toUpperCase()));
  const modelo = MODELOS_PASSOS.find(([re]) => re.test(t));
  return modelo
    ? modelo[1]
    : ["Fazer só os primeiros 5 minutos", "Fazer a parte principal", "Revisar e finalizar"];
}
ACOES_EXTRAS["quebrar-passos"] = (b, id) => {
  const x = S.tasks.find(k => k.id === id);
  if (!x) return;
  const ja = new Set(x.sub.map(s => norm(s.t)));
  const novos = passosPara(x.title).filter(p => !ja.has(norm(p)));
  if (!novos.length) return toast("Os passos já estão aí!");
  novos.forEach(p => x.sub.push({ id: newId(), t: p, done: false }));
  commit();
  react("happy", `Quebrei em <b>${novos.length} passos</b>. Um de cada vez!`, 2600);
};

/* ---------- revisão da semana ---------- */
function revisaoPendente() {
  const t = today(),
    wd = wIdx(t);
  // domingo revisa a semana que está acabando; segunda ainda dá pra revisar a passada
  const seg = wd === 6 ? mondayOf(t) : wd === 0 ? mondayOf(addDays(t, -1)) : null;
  if (!seg || orgDados().revisao === seg) return null;
  const fim = addDays(seg, 6);
  const pendentes = S.tasks.filter(
    x => !x.done && x.date >= seg && x.date <= fim && x.date <= t && !x.repeat
  );
  const feitas = S.tasks.filter(x => x.done && x.date >= seg && x.date <= fim).length;
  return { seg, pendentes, feitas };
}
function revisaoSemanaHTML() {
  const r = revisaoPendente();
  if (!r) return "";
  const proxSeg = addDays(r.seg, 7);
  return `<section class="block"><div class="card revisao-semana"><b>Revisão da semana</b>
    <span class="note">Você concluiu <b>${r.feitas}</b> ${r.feitas === 1 ? "tarefa" : "tarefas"}. ${r.pendentes.length ? `Ficaram ${r.pendentes.length} pra trás. Decide o destino de cada uma:` : "Nada ficou pra trás. Que semana!"}</span>
    ${r.pendentes.length ? `<ul class="revisao-lista">${r.pendentes.map(x => `<li><span>${esc(x.title)}</span><span class="row"><button class="btn small" data-act="rev-mover" data-id="${x.id}" data-d="${proxSeg}">Semana que vem</button><button class="btn small ghost" data-act="rev-mover" data-id="${x.id}" data-d="${addDays(today(), 1)}">Amanhã</button><button class="icon" data-act="rev-apagar" data-id="${x.id}" aria-label="Apagar">${ICON.trash}</button></span></li>`).join("")}</ul>` : ""}
    <button class="btn small primary" data-act="rev-fim">Fechar a semana (+10 gotas)</button></div></section>`;
}
ACOES_EXTRAS["rev-mover"] = b => {
  const x = S.tasks.find(k => k.id === b.dataset.id);
  if (!x) return;
  x.date = b.dataset.d;
  commit();
};
ACOES_EXTRAS["rev-apagar"] = (b, id) => {
  snapUndo();
  S.tasks = S.tasks.filter(k => k.id !== id);
  commit();
  toast("Tarefa apagada", true);
};
ACOES_EXTRAS["rev-fim"] = b => {
  const r = revisaoPendente();
  if (!r) return;
  orgDados().revisao = r.seg;
  earn(10, b);
  fx.big = true;
  react("party", "Semana fechada! A próxima começa leve.", 3000);
  commit();
};

/* ---------- reta final das provas ---------- */
function retaFinalHTML() {
  const t = today();
  const perto = S.exams
    .filter(e => e.date >= t && diffDays(t, e.date) <= 7)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 2);
  return perto
    .map(e => {
      const dias = diffDays(t, e.date);
      const p = typeof planoDoDia === "function" ? planoDoDia(e) : null;
      const falta = p && !p.pronto ? Math.max(0, p.porDia - p.feitoHoje) : 0;
      return `<section class="block"><div class="card reta-final"><div class="reta-num"><b>${dias === 0 ? "Hoje" : dias}</b><span>${dias === 0 ? "é a prova" : dias === 1 ? "dia" : "dias"}</span></div>
        <div class="col"><b>${esc(e.title)}</b><span class="note">${esc(subjName(e.subjectId) || "Sem matéria")}${falta ? ` · faltam ${falta} min de estudo hoje` : p && p.pronto ? " · meta batida, só revisar" : ""}</span>
        ${dias > 0 ? `<button class="btn small primary" data-act="prova-estudar" data-id="${e.id}">Estudar agora</button>` : `<span class="note">Boa prova! Respira fundo.</span>`}</div></div></section>`;
    })
    .join("");
}
ACOES_EXTRAS["prova-estudar"] = (b, id) => {
  const e = S.exams.find(k => k.id === id);
  if (!e) return;
  if (!S.subjects.length) {
    tab = "estudos";
    render();
    return toast("Cadastre a matéria pra usar o foco");
  }
  const p = typeof planoDoDia === "function" ? planoDoDia(e) : null;
  timer.subjectId =
    e.subjectId && S.subjects.some(s => s.id === e.subjectId) ? e.subjectId : S.subjects[0].id;
  timer.goal = Math.max(15, Math.min(60, p && !p.pronto ? p.porDia - p.feitoHoje : 25)) || 25;
  timer.label = e.title;
  timer.acc = 0;
  timer.beeped = false;
  timer.running = true;
  timer.start = Date.now();
  saveTimerState();
  tab = "estudos";
  render();
  window.scrollTo(0, 0);
  toast(`Foco de ${timer.goal} min pra ${e.title}. Bora!`, false, "focus");
};

/** Tudo que entra na aba Hoje (chamado por js/telas/hoje.js). */
function organizarHojeHTML() {
  const pend = S.tasks.filter(x => x.date === today() && !x.done).length;
  return (
    retaFinalHTML() +
    revisaoSemanaHTML() +
    (planoAberto
      ? planoDiaHTML()
      : pend >= 2
        ? `<section class="block"><button class="card plano-chamar" data-act="plano-abrir"><b>Planejar meu dia</b><span class="note">O Prumi monta a ordem das ${pend} tarefas que faltam.</span></button></section>`
        : "")
  );
}
