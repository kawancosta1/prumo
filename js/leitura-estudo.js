/*
  Estudo junto com a leitura:
  - Livro de estudo: um livro pode ser ligado a uma matéria. A sessão de leitura dele conta como estudo daquela matéria.
  - Minutos de estudo (foco em Estudos) também rendem páginas para decorar a estante: 1 minuto = 1 página.
  - Plano de prova: você diz quantas horas quer estudar até a prova e o app calcula quanto estudar por dia.
  - Fichamento: resumo por capítulo no detalhe do livro. Vira revisão espaçada (as revisões que já existem em Estudos).
    Um resumo caprichado (80 letras ou mais) vale +10 páginas, até 5 por dia.
*/
"use strict";

const FICHA_PAGINAS = 10,
  FICHAS_DIA = 5;

/* ===================== livro de estudo (ligado a uma matéria) ===================== */
const materiaDoLivro = l =>
  l && l.materiaId && S.subjects.some(s => s.id === l.materiaId) ? l.materiaId : "";

function materiaLivroHTML(l) {
  if (!S.subjects.length) return "";
  return `<label class="row materia-livro"><span class="label">Livro de estudo de</span><select data-change="livro-materia" data-id="${l.id}" aria-label="Matéria do livro"><option value="">Nenhuma matéria</option>${S.subjects.map(s => `<option value="${s.id}" ${s.id === l.materiaId ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>`;
}
MUDANCAS_EXTRAS["livro-materia"] = el => {
  const l = livro(el.dataset.id);
  if (!l) return;
  l.materiaId = S.subjects.some(s => s.id === el.value) ? el.value : "";
  if (l.materiaId)
    toast(`Leitura de ${l.titulo} agora conta como estudo de ${subjName(l.materiaId)}`, false, "happy");
  commit();
};

/* Sessão de leitura de um livro de estudo: os minutos vão para a matéria (sem contar duas vezes na meta) */
{
  const fimAntes = FORMS_EXTRAS["sessao-fim"];
  FORMS_EXTRAS["sessao-fim"] = f => {
    const s = sessaoAtual();
    const l = s && livro(s.livroId);
    const materia = materiaDoLivro(l);
    const min = s ? Math.round(tempoSessao(s) / 6e4) : 0;
    const res = fimAntes(f);
    if (materia && min >= 1) {
      const L = leituraDia();
      L.minutos[today()] = Math.max(0, (L.minutos[today()] || 0) - min);
      S.sessions.push({ id: newId(), subjectId: materia, date: today(), min, livro: l.id });
      S.stats.focus += min;
      setTimeout(() => toast(`${min} min também contados em ${subjName(materia)}`, false, "happy"), 1800);
    }
    return res;
  };
}

/** Livros de estudo na aba Estudos. */
function livrosEstudoHTML() {
  const lista = S.livros.filter(l => materiaDoLivro(l) && l.estante !== "lido" && l.estante !== "abandonado");
  if (!lista.length) return "";
  return `<section class="block"><h2 class="h2">Livros de estudo <span class="count">${lista.length}</span></h2><ul class="list">${lista
    .map(
      l =>
        `<li><div class="item"><span class="slot" style="--c:${subjColor(l.materiaId)}">${ICON.book}</span><div class="main"><span class="title">${esc(l.titulo)}</span><span class="meta"><span class="chip" style="--c:${subjColor(l.materiaId)}">${esc(subjName(l.materiaId))}</span><span>·</span><span>${l.paginas ? `${progressoDe(l)}%` : `pág. ${l.pagina}`}</span></span></div><button class="btn small primary" data-act="livro-timer" data-id="${l.id}">Ler agora</button></div></li>`
    )
    .join(
      ""
    )}</ul><span class="note">A sessão de leitura desses livros conta como estudo da matéria.</span></section>`;
}

/* ===================== minutos de estudo viram páginas ===================== */
{
  const logAntes = logTimer;
  logTimer = function () {
    const min = Math.round(elapsed() / 6e4);
    const materia = timer.subjectId;
    logAntes();
    if (min >= 1 && materia) {
      ganharPaginas(min);
      toast(`${min} min de ${subjName(materia)} registrados · +${min} páginas para decorar a estante`);
    }
  };
}

/* ===================== plano de prova ===================== */
/** Minutos estudados para a prova desde que o plano foi criado. */
function minutosParaProva(e) {
  return S.sessions
    .filter(s => (!e.subjectId || s.subjectId === e.subjectId) && s.date >= e.plano.desde && s.date <= e.date)
    .reduce((a, s) => a + s.min, 0);
}
/** Quanto estudar hoje para chegar na meta da prova. */
function planoDoDia(e) {
  if (!e.plano || e.date < today()) return null;
  const total = e.plano.horas * 60;
  const feito = minutosParaProva(e);
  const feitoHoje = S.sessions
    .filter(s => (!e.subjectId || s.subjectId === e.subjectId) && s.date === today())
    .reduce((a, s) => a + s.min, 0);
  const dias = Math.max(1, diffDays(today(), e.date)); // dias até a prova (sem contar o dia dela)
  const faltaAntesDeHoje = Math.max(0, total - (feito - feitoHoje));
  const porDia = Math.ceil(faltaAntesDeHoje / dias);
  return { total, feito, feitoHoje, dias, porDia, pronto: feito >= total };
}

function planoProvaHTML(e) {
  if (e.date < today()) return "";
  const p = planoDoDia(e);
  if (!p || e.editandoPlano)
    return `<form class="row plano-form" data-form="plano-prova" data-id="${e.id}"><span class="note">Quantas horas quer estudar até lá?</span><input id="pp-${e.id}" type="number" min="1" max="200" value="${e.plano ? e.plano.horas : 6}" style="width:70px" aria-label="Horas de estudo até a prova"><button class="btn small" type="submit">${e.plano ? "Salvar" : "Planejar"}</button></form>`;
  return `<div class="plano-prova ${p.pronto ? "pronto" : ""}"><div class="progress"><span style="width:${Math.min(100, Math.round((p.feito / p.total) * 100))}%"></span></div>
    <span class="note">${p.pronto ? `Meta de ${e.plano.horas}h batida! Agora é revisar com calma.` : `Hoje: <b>${p.feitoHoje}/${p.porDia} min</b> · ${fmtMin(p.feito)} de ${e.plano.horas}h · ${p.dias} ${p.dias === 1 ? "dia" : "dias"} até a prova`}</span>
    <button class="olink" data-act="plano-editar" data-id="${e.id}">Mudar plano</button></div>`;
}
FORMS_EXTRAS["plano-prova"] = f => {
  const e = S.exams.find(x => x.id === f.dataset.id);
  if (!e) return;
  const horas = Math.max(1, Math.min(200, Math.round(+getV("pp-" + e.id) || 0)));
  e.plano = { horas, desde: e.plano ? e.plano.desde : today() };
  delete e.editandoPlano;
  const p = planoDoDia(e);
  react(
    "happy",
    `Plano feito: <b>${p.porDia} min por dia</b> até ${fmtShort(e.date)}. Eu te lembro aqui!`,
    3600
  );
};
ACOES_EXTRAS["plano-editar"] = (b, id) => {
  const e = S.exams.find(x => x.id === id);
  if (!e) return;
  e.editandoPlano = true;
  render();
};

/** Linha curtinha para a aba Hoje (próximas provas). */
function planoHojeHTML(e) {
  const p = planoDoDia(e);
  if (!p || p.pronto) return "";
  return `<span class="meta plano-hoje">Estude hoje: <b>${Math.max(0, p.porDia - p.feitoHoje)} min</b>${p.feitoHoje >= p.porDia ? " (feito!)" : ""}</span>`;
}

/* ===================== fichamento com revisão espaçada ===================== */
function fichasHTML(l) {
  const fichas = Array.isArray(l.fichas) ? l.fichas : [];
  return `<details class="more fichamento" ${fichas.length ? "" : ""}><summary>Fichamento <span class="count">${fichas.length}</span></summary>
    <form class="col" data-form="ficha-nova" data-id="${l.id}">
      <input id="fc-cap-${l.id}" maxlength="60" placeholder="Capítulo ou assunto (ex.: Cap. 3, Derivadas)" autocomplete="off" required>
      <textarea id="fc-txt-${l.id}" maxlength="600" rows="3" placeholder="O que você aprendeu, em até 3 linhas" required></textarea>
      <label class="fb-check"><input id="fc-rev-${l.id}" type="checkbox" checked><span>Revisar depois (revisão espaçada em Estudos)</span></label>
      <button class="btn small" type="submit">Guardar ficha</button>
      <span class="note">Resumo com 80 letras ou mais vale <b>+${FICHA_PAGINAS} páginas</b> (até ${FICHAS_DIA} por dia).</span>
    </form>
    ${
      fichas.length
        ? `<ol class="fichas">${fichas
            .slice()
            .reverse()
            .map(
              f =>
                `<li><b>${esc(f.cap)}</b><p>${esc(f.texto)}</p><small>${fmtShort(f.em)}</small><button class="olink" data-act="ficha-apagar" data-id="${l.id}" data-f="${f.id}">Apagar</button></li>`
            )
            .join("")}</ol>`
        : ""
    }</details>`;
}
FORMS_EXTRAS["ficha-nova"] = f => {
  const l = livro(f.dataset.id);
  if (!l) return;
  const cap = getV("fc-cap-" + l.id).slice(0, 60),
    texto = getV("fc-txt-" + l.id).slice(0, 600);
  if (!cap || !texto) return;
  if (!Array.isArray(l.fichas)) l.fichas = [];
  const ficha = { id: newId(), cap, texto, em: today() };
  l.fichas.push(ficha);
  const revisar = document.getElementById("fc-rev-" + l.id);
  if (!revisar || revisar.checked)
    S.reviews.push({
      id: newId(),
      subjectId: materiaDoLivro(l),
      topic: `${l.titulo}: ${cap}`,
      texto,
      livroId: l.id,
      fichaId: ficha.id,
      created: today(),
      step: 0,
      due: addDays(today(), REV_STEPS[0]),
      done: false
    });
  const L = leituraDia();
  if (!L.fichasDia || L.fichasDia.d !== today()) L.fichasDia = { d: today(), n: 0 };
  let bonus = 0;
  if (texto.length >= 80 && L.fichasDia.n < FICHAS_DIA) {
    L.fichasDia.n++;
    bonus = ganharPaginas(FICHA_PAGINAS);
  }
  react(
    "happy",
    `Ficha guardada${!revisar || revisar.checked ? ", primeira revisão amanhã" : ""}.${bonus ? ` <b>+${bonus} páginas</b> pelo resumo caprichado!` : ""}`,
    3200
  );
};
ACOES_EXTRAS["ficha-apagar"] = (b, id) => {
  const l = livro(id);
  if (!l || !Array.isArray(l.fichas)) return;
  if (!b.dataset.certeza) {
    b.dataset.certeza = "1";
    b.textContent = "Toque de novo para apagar";
    return;
  }
  l.fichas = l.fichas.filter(f => f.id !== b.dataset.f);
  S.reviews = S.reviews.filter(r => r.fichaId !== b.dataset.f);
  commit();
};
