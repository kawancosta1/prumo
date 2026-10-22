/*
  Conquistas, níveis (XP) e gotas.
*/
"use strict";

/* ---------- conquistas ---------- */
const ACHS = [
  {
    id: "primeira",
    name: "Primeiro passo",
    desc: "Concluir 1 tarefa",
    goal: 1,
    cur: () => S.stats.tasks,
    reward: 20
  },
  {
    id: "ritmo",
    name: "Pegando o ritmo",
    desc: "Concluir 25 tarefas",
    goal: 25,
    cur: () => S.stats.tasks,
    reward: 50
  },
  {
    id: "produtivo",
    name: "Máquina de produtividade",
    desc: "Concluir 100 tarefas",
    goal: 100,
    cur: () => S.stats.tasks,
    reward: 150,
    legend: true
  },
  {
    id: "hidratado",
    name: "Hidratado",
    desc: "Bater a meta de água 1 vez",
    goal: 1,
    cur: () => S.stats.water,
    reward: 20
  },
  {
    id: "semana_agua",
    name: "Oásis",
    desc: "Bater a meta de água 7 dias seguidos",
    goal: 7,
    cur: () => waterStreak(),
    reward: 100,
    legend: true
  },
  {
    id: "foco10",
    name: "Monge do foco",
    desc: "Somar 10 horas de foco no cronômetro",
    goal: 600,
    cur: () => S.stats.focus,
    reward: 100,
    fmt: v => fmtMin(v)
  },
  {
    id: "revisor",
    name: "Memória de elefante",
    desc: "Fazer 20 revisões espaçadas",
    goal: 20,
    cur: () => S.stats.reviews,
    reward: 80
  },
  {
    id: "habito21",
    name: "Hábito de ferro",
    desc: "21 dias seguidos em um hábito",
    goal: 21,
    cur: () => Math.max(0, ...S.habits.map(habitStreak)),
    reward: 150,
    legend: true
  },
  {
    id: "sociavel",
    name: "Gente boa",
    desc: "Registrar 15 contatos com pessoas",
    goal: 15,
    cur: () => S.stats.talked,
    reward: 60
  },
  {
    id: "dia_perfeito",
    name: "Dia perfeito",
    desc: "Fazer todas as tarefas (mín. 3) e bater a água no mesmo dia",
    goal: 1,
    cur: () => S.stats.perfect,
    reward: 80
  },
  {
    id: "coruja",
    name: "Fechador de dias",
    desc: "Fechar o dia 7 vezes",
    goal: 7,
    cur: () => S.stats.closed,
    reward: 60
  },
  {
    id: "colecionador",
    name: "Colecionador",
    desc: "Ter 15 itens no guarda-roupa",
    goal: 15,
    cur: () => S.owned.length,
    reward: 100
  },
  {
    id: "nivel5",
    name: "Veterano",
    desc: "Chegar ao nível 5",
    goal: 5,
    cur: () => levelOf(S.xp).lvl,
    reward: 100,
    theme: true
  },
  {
    // Secreta: aparece como "???" até ser descoberta (13 toques seguidos no Prumi emo)
    id: "morcego",
    name: "Segredo da noite",
    desc: "Descobriu um segredo escondido no Prumi",
    goal: 1,
    cur: () => S.stats.morcego || 0,
    reward: 30,
    secreta: true
  }
];

const ACH = Object.fromEntries(ACHS.map(a => [a.id, a]));

function levelOf(xp) {
  const lvl = Math.floor((1 + Math.sqrt(1 + xp / 12.5)) / 2),
    base = 50 * lvl * (lvl - 1),
    next = 50 * (lvl + 1) * lvl;
  return { lvl, cur: xp - base, need: next - base };
}

function waterStreak() {
  let d = today(),
    c = 0;
  if (!(S.paid[d] && S.paid[d].water)) d = addDays(d, -1);
  while (S.paid[d] && S.paid[d].water) {
    c++;
    d = addDays(d, -1);
  }
  return c;
}

/*
  Dá (n > 0) ou tira (n < 0) gotas. Ganhos podem ser multiplicados pelo mundo
  (ex.: lua cheia no emo dá gotas em dobro). Devolve quanto realmente entrou.
*/
function earn(n, el) {
  if (!n) return 0;
  const efeitoMundo = MUNDO_FX[S.persona];
  if (n > 0 && efeitoMundo && efeitoMundo.multiplicadorGotas) n = n * efeitoMundo.multiplicadorGotas();
  S.coins = Math.max(0, S.coins + n);
  if (n > 0) S.xp += n;
  if (RM) return n;
  const pill = document.getElementById("coins");
  if (!pill) return n;
  const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : pill.getBoundingClientRect();
  const f = document.createElement("span");
  f.className = "coinfly" + (n < 0 ? " neg" : "");
  f.textContent = (n > 0 ? "+" : "") + n;
  f.style.left = r.left + r.width / 2 + "px";
  f.style.top = r.top + "px";
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1100);
  pill.classList.remove("bump");
  void pill.offsetWidth;
  pill.classList.add("bump");
  return n;
}

const paidDay = d => S.paid[d] || (S.paid[d] = {});

function checkAch() {
  const got = [];
  for (const a of ACHS) {
    if (S.ach[a.id]) continue;
    if (a.cur() >= a.goal) {
      S.ach[a.id] = today();
      S.coins += a.reward;
      S.xp += a.reward;
      got.push(a);
    }
  }
  const d = today(),
    pd = paidDay(d),
    tt = S.tasks.filter(x => x.date === d);
  if (!pd.perfect && tt.length >= 3 && tt.every(x => x.done) && waterToday() >= S.waterGoal) {
    pd.perfect = 1;
    S.stats.perfect++;
    S.coins += 25;
    S.xp += 25;
    got.push({ name: "Dia perfeito do dia", reward: 25, daily: true });
  }
  return got;
}
