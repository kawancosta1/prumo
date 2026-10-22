/*
  Humor do Prumi: pontuação de 0 a 100 e os motivos.
*/
"use strict";

/* ================= humor do Prumi ================= */
/*
  O humor é calculado na hora, a partir do que está salvo (não é guardado).
  Começa em 60 e cada fator soma ou subtrai pontos. O resultado fica entre 0 e 100.
  Para criar um fator novo: chame soma(pontos, "texto do motivo") dentro de calcularHumor().
*/
const HUMOR_NIVEIS = [
  { min: 85, nome: "Radiante", rosto: "party" },
  { min: 65, nome: "Feliz", rosto: "happy" },
  { min: 45, nome: "De boa", rosto: "idle" },
  { min: 30, nome: "Chateado", rosto: "upset" },
  { min: 15, nome: "Triste", rosto: "sad" },
  { min: 0, nome: "Arrasado", rosto: "cry" }
];

const CARINHO_MAX = 5; // toques no Prumi que contam por dia

function calcularHumor() {
  const hoje = today();
  const ontem = addDays(hoje, -1);
  const motivos = [];
  let valor = 60;
  const soma = (pontos, texto) => {
    if (!pontos) return;
    valor += pontos;
    motivos.push({ pontos, texto });
  };

  // Tarefas que passaram da data sem serem feitas
  const atrasadas = S.tasks.filter(t => !t.done && t.date < hoje);
  const esquecidas = atrasadas.filter(t => diffDays(t.date, hoje) >= 3);
  if (atrasadas.length)
    soma(
      -Math.min(40, atrasadas.length * 8),
      `${atrasadas.length} ${atrasadas.length === 1 ? "tarefa atrasada" : "tarefas atrasadas"}`
    );
  if (esquecidas.length)
    soma(
      -Math.min(15, esquecidas.length * 5),
      `${esquecidas.length} esquecida${esquecidas.length === 1 ? "" : "s"} há 3 dias ou mais`
    );

  // Tarefas concluídas hoje
  const feitasHoje = S.tasks.filter(t => t.done && t.date === hoje).length;
  if (feitasHoje)
    soma(
      Math.min(20, feitasHoje * 4),
      `${feitasHoje} ${feitasHoje === 1 ? "tarefa feita" : "tarefas feitas"} hoje`
    );

  // Água
  const agua = waterToday();
  if (agua >= S.waterGoal) soma(12, "meta de água batida");
  else if (waterPace() - agua >= 500) soma(-8, "água atrasada no ritmo");
  else if (agua > 0) soma(4, "água no ritmo");

  // Hábitos de hoje e de ontem
  const habitosHoje = S.habits.filter(h => habitDue(h, hoje));
  if (habitosHoje.length) {
    const feitos = habitosHoje.filter(h => habitDone(h, hoje)).length;
    if (feitos)
      soma(Math.round((10 * feitos) / habitosHoje.length), `${feitos} de ${habitosHoje.length} hábitos hoje`);
  }
  const falhasOntem = S.habits.filter(
    h => habitDue(h, ontem) && !habitDone(h, ontem) && h.created && h.created <= ontem
  ).length;
  if (falhasOntem)
    soma(
      -Math.min(12, falhasOntem * 4),
      `${falhasOntem} ${falhasOntem === 1 ? "hábito esquecido" : "hábitos esquecidos"} ontem`
    );

  // Revisões de estudo vencidas
  const revAtrasadas = S.reviews.filter(r => !r.done && r.due < hoje).length;
  if (revAtrasadas)
    soma(
      -Math.min(9, revAtrasadas * 3),
      `${revAtrasadas} ${revAtrasadas === 1 ? "revisão atrasada" : "revisões atrasadas"}`
    );

  // Ontem foi dia perfeito?
  if (S.paid[ontem] && S.paid[ontem].perfect) soma(8, "ontem foi um dia perfeito");

  // Fatores próprios do mundo (ex.: emo fica animado de noite e na lua cheia)
  const efeitoMundo = MUNDO_FX[S.persona];
  if (efeitoMundo && efeitoMundo.humorExtra) efeitoMundo.humorExtra(soma);

  // Carinho (toques no Prumi hoje)
  const carinho = Math.min(CARINHO_MAX, S.carinho[hoje] || 0);
  if (carinho) soma(carinho, "carinho");

  valor = Math.max(0, Math.min(100, Math.round(valor)));
  const nivelBase = HUMOR_NIVEIS.find(n => valor >= n.min);
  // O mundo pode dar outro nome para o nível (ex.: "De boa" vira "Melancólico" no emo)
  const nomes = (efeitoMundo && efeitoMundo.humorNomes) || {};
  const nivel = { ...nivelBase, nome: nomes[nivelBase.nome] || nivelBase.nome };
  return { valor, nivel, motivos, atrasadas: atrasadas.length };
}

/* Barra de humor que aparece abaixo do balão do Prumi */
let humorAberto = false;

function humorHTML() {
  if (!hasData()) return "";
  const h = calcularHumor();
  const cor =
    h.valor >= 65
      ? "var(--ok)"
      : h.valor >= 45
        ? "var(--accent)"
        : h.valor >= 30
          ? "var(--warn)"
          : "var(--danger)";
  return `<button class="humor" data-act="humor" aria-expanded="${humorAberto}">
      <span class="label">Humor</span>
      <span class="hbarra"><span style="width:${h.valor}%;background:${cor}"></span></span>
      <b style="color:${cor}">${h.nivel.nome}</b>
    </button>
    ${
      humorAberto
        ? `<div class="motivos">${h.motivos.length ? h.motivos.map(m => `<span class="${m.pontos > 0 ? "pos" : "neg"}"><b class="mono">${m.pontos > 0 ? "+" : ""}${m.pontos}</b> ${esc(m.texto)}</span>`).join("") : `<span>Nada mexeu com meu humor hoje ainda.</span>`}
      <span class="note">Começo o dia em 60. Tarefas atrasadas me deixam chateado; cumprir o combinado me anima. Toque em mim pra um carinho (vale até ${CARINHO_MAX} por dia).</span></div>`
        : ""
    }`;
}
