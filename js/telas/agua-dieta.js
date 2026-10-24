/*
  Aba Água e dieta.
*/
"use strict";

function viewDieta() {
  const t = today(),
    todayIdx = wIdx(t),
    day = S.meals[mealDay] || {},
    isTodayMeal = mealDay === todayIdx,
    chk = S.mealCheck[t] || {};
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(t, i - 6)),
    wv = last7.map(d => waterToday(d)),
    hit = wv.filter(v => v >= S.waterGoal).length;
  const avg = Math.round(wv.reduce((a, b) => a + b, 0) / 7 / 10) * 10;
  const shop = S.shopping;
  const remindTimes = (() => {
    const w = hm2min(S.wake),
      sl = hm2min(S.sleep) > w ? hm2min(S.sleep) : hm2min(S.sleep) + 1440,
      out = [];
    for (let m = w + 60; m < sl - 30; m += 120) out.push(`${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`);
    return out;
  })();
  return `
  <section class="block"><h1 class="h1">Água e dieta<small>Meta de ${fmtML(S.waterGoal)} por dia · média de ${fmtML(avg)} nos últimos 7 dias</small></h1></section>
  <section class="block">${waterWidget(true)}</section>
  <section class="block">
    <h2 class="h2">Últimos 7 dias <span class="count">meta batida em ${hit} de 7</span></h2>
    <div class="chart">${barChart(
      wv,
      last7.map(d => DIAS_CURTO[wIdx(d)]),
      {
        goal: S.waterGoal,
        fmt: v => (v / 1000).toFixed(1).replace(".", ","),
        color: "var(--water)",
        hiIdx: 6
      }
    )}</div>
    <details class="more"><summary>Lembretes de água no ${CALS[S.calendar] || CALS.google}</summary>
      <span class="note">Cada horário abre um lembrete que se repete todo dia. Os horários seguem o que você definiu em Ajustes (acordar ${esc(S.wake)}, dormir ${esc(S.sleep)}).</span>
      <div class="links" style="margin-top:10px">${remindTimes.map(h => calBtn({ title: "Beber água", date: t, time: h, dur: 5, recur: "RRULE:FREQ=DAILY", details: `Meta: ${fmtML(S.waterGoal)} por dia` }, h)).join("")}</div>
    </details>
  </section>
  ${typeof aguaMesHTML === "function" ? aguaMesHTML() : ""}
  <section class="block">
    <h2 class="h2">Cardápio da semana</h2>
    <div class="days">${DIAS_CURTO.map((d, i) => `<button class="day" data-act="mealday" data-i="${i}" aria-pressed="${i === mealDay}"><span>${i === todayIdx ? "hoje" : ""}</span><b style="font-size:14px">${d}</b></button>`).join("")}</div>
    <div class="meals">${SLOTS.map(([k, l]) => `<div class="meal a-dieta">${isTodayMeal ? `<button class="check" data-act="mealcheck" data-slot="${k}" aria-pressed="${!!chk[k]}" aria-label="Comi conforme o plano">${ICON.check}</button>` : ""}<label class="mm"><span class="label">${l}</span><input id="meal-${k}" type="text" data-change="meal" data-slot="${k}" value="${esc(day[k] || "")}" placeholder="O que vai comer?" autocomplete="off"></label></div>`).join("")}</div>
    <div class="row"><span class="note" style="flex:1">${isTodayMeal ? "Marque o que você seguiu hoje. " : ""}Salva sozinho ao sair do campo.</span><button class="btn small ghost" data-act="copymeals">Copiar ${DIAS_SEG[mealDay]} para todos os dias</button></div>
  </section>
  <section class="block">
    <h2 class="h2">Lista de compras <span class="count">${shop.filter(s => !s.done).length} faltando</span></h2>
    <form class="add" data-form="shop"><input id="sh-text" class="grow" type="text" placeholder="Adicionar item…" autocomplete="off" required><button class="btn" type="submit">Adicionar</button></form>
    ${
      shop.length
        ? `<ul class="list">${[...shop]
            .sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0))
            .map(
              s =>
                `<li class="a-dieta ${s.done ? "done" : ""}"><div class="item"><button class="check" data-act="shop" data-id="${s.id}" aria-pressed="${!!s.done}" aria-label="Marcar">${ICON.check}</button><div class="main"><span class="title">${esc(s.text)}</span></div><button class="icon" data-act="del" data-list="shopping" data-id="${s.id}" aria-label="Apagar">${ICON.trash}</button></div></li>`
            )
            .join("")}</ul>
    ${shop.some(s => s.done) ? `<div><button class="btn small ghost" data-act="clearshop">Tirar os comprados da lista</button></div>` : ""}`
        : `<div class="empty">Lista vazia.</div>`
    }
  </section>`;
}
