/*
  Hábitos e água, um pouco mais gentis:
  - Folga: 1 dia por semana que não quebra a sequência do hábito (só conta numa semana em que o hábito foi feito
    pelo menos uma vez). Aparece no quadriculado como um floquinho. Dá pra desligar na aba Hábitos.
  - Água no mês: quadriculado das últimas 5 semanas, mais forte quanto mais perto da meta.
  Dados: S.habitosFolga = { ligado: true }.
*/
"use strict";

const folgaLigada = () => !(S.habitosFolga && S.habitosFolga.ligado === false);

/** Dias que viraram folga para este hábito (andando do dia de hoje pra trás, no máximo 1 por semana). */
function folgasDoHabito(h) {
  const folgas = new Set();
  if (!folgaLigada()) return folgas;
  const usadas = new Set();
  const feitoNaSemana = seg => {
    for (let i = 0; i < 7; i++) if (habitDone(h, addDays(seg, i))) return true;
    return false;
  };
  let d = addDays(today(), -1);
  for (let g = 0; g < 120; g++, d = addDays(d, -1)) {
    if (h.created && d < h.created) break;
    if (!habitDue(h, d) || habitDone(h, d)) continue;
    const seg = mondayOf(d);
    if (usadas.has(seg) || !feitoNaSemana(seg)) continue;
    usadas.add(seg);
    folgas.add(d);
  }
  return folgas;
}

habitStreak = function (h) {
  const folgas = folgasDoHabito(h);
  let d = today(),
    c = 0,
    guarda = 0;
  if (!habitDone(h, d)) d = addDays(d, -1);
  while (guarda++ < 400) {
    if (h.created && d < h.created && !habitDone(h, d)) break;
    if (habitDue(h, d)) {
      if (habitDone(h, d)) c++;
      else if (!folgas.has(d)) break; // folga: não soma, mas não quebra
    } else if (habitDone(h, d)) c++;
    d = addDays(d, -1);
  }
  return c;
};

const ontemFoiFolga = h => {
  let d = addDays(today(), -1),
    g = 0;
  while (!habitDue(h, d) && g++ < 7) d = addDays(d, -1);
  return folgasDoHabito(h).has(d);
};
{
  const perdeuAntes = habitMissedYesterday;
  habitMissedYesterday = h => perdeuAntes(h) && !ontemFoiFolga(h);
}

function folgaHabitosHTML() {
  if (!S.habits.length) return "";
  return `<div class="setrow folga-row"><div class="lbl"><b>Dia de folga</b><span class="note">1 dia por semana sem fazer não quebra a sequência (o floquinho no quadriculado).</span></div><button class="btn small ${folgaLigada() ? "" : "ghost"}" data-act="folga-habitos" aria-pressed="${folgaLigada()}">${folgaLigada() ? "Ligado" : "Desligado"}</button></div>`;
}
ACOES_EXTRAS["folga-habitos"] = () => {
  S.habitosFolga = { ...(S.habitosFolga || {}), ligado: !folgaLigada() };
  commit();
};

/* ---------- água no mês ---------- */
function aguaMesHTML() {
  const t = today();
  const ini = addDays(mondayOf(t), -28);
  let cel = "",
    batidas = 0,
    dias = 0;
  for (let i = 0; i < 35; i++) {
    const d = addDays(ini, i);
    if (d > t) {
      cel += `<i class="fut"></i>`;
      continue;
    }
    const ml = (S.water[d] || []).reduce((a, c) => a + (c.ml || 0), 0);
    const f = Math.min(1, ml / (S.waterGoal || 1));
    const nivel = ml === 0 ? 0 : f >= 1 ? 4 : f >= 0.66 ? 3 : f >= 0.33 ? 2 : 1;
    if (ml) dias++;
    if (f >= 1) batidas++;
    cel += `<i class="n${nivel} ${d === t ? "hoje" : ""}" title="${fmtShort(d)}: ${fmtML(ml)}"></i>`;
  }
  return `<section class="block"><h2 class="h2">Seu mês <span class="count">meta em ${batidas} de ${dias || 0} dias</span></h2>
    <div class="agua-mes"><div class="agua-mes-dias">${DIAS_CURTO.map(d => `<span>${d[0]}</span>`).join("")}</div><div class="agua-mes-grade">${cel}</div></div>
    <div class="agua-mes-legenda"><span>menos</span><i class="n1"></i><i class="n2"></i><i class="n3"></i><i class="n4"></i><span>meta</span></div></section>`;
}
