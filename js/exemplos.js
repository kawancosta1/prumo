/*
  Dados de exemplo do botão "Ver com exemplos".
*/
"use strict";

function loadSample() {
  const t = today(),
    tm = addDays(t, 1);
  const c1 = { id: newId(), name: "Exemplo: Cálculo I", color: SUBJ_COLORS[0] },
    c2 = { id: newId(), name: "Exemplo: Banco de Dados", color: SUBJ_COLORS[1] };
  S.subjects.push(c1, c2);
  timer.subjectId = c1.id;
  saveTimerState();
  S.tasks.push(
    {
      id: newId(),
      title: "Exemplo: lista de Cálculo",
      area: "estudo",
      date: t,
      time: "19:00",
      done: false,
      prio: 3,
      repeat: "",
      sub: [
        { id: newId(), t: "Exercícios 1 a 5", done: true },
        { id: newId(), t: "Exercícios 6 a 10", done: false }
      ]
    },
    {
      id: newId(),
      title: "Exemplo: preparar marmitas",
      area: "dieta",
      date: t,
      time: "21:00",
      done: false,
      prio: 0,
      repeat: "weekly",
      sub: []
    },
    {
      id: newId(),
      title: "Exemplo: responder mensagens",
      area: "social",
      date: t,
      time: "",
      done: true,
      prio: 0,
      repeat: "",
      sub: []
    },
    {
      id: newId(),
      title: "Exemplo: academia",
      area: "geral",
      date: tm,
      time: "07:00",
      done: false,
      prio: 2,
      repeat: "",
      sub: []
    }
  );
  S.classes.push({
    id: newId(),
    subjectId: c1.id,
    day: wIdx(t),
    start: "10:00",
    end: "11:40",
    room: "Exemplo: sala 5-001"
  });
  S.sessions.push(
    { id: newId(), subjectId: c1.id, date: addDays(t, -1), min: 50 },
    { id: newId(), subjectId: c2.id, date: t, min: 25 }
  );
  S.reviews.push({
    id: newId(),
    subjectId: c1.id,
    topic: "Exemplo: limites laterais",
    created: addDays(t, -1),
    step: 0,
    due: t,
    done: false
  });
  S.exams.push({ id: newId(), title: "Exemplo: P1", subjectId: c1.id, date: addDays(t, 6) });
  S.meals[wIdx(t)] = {
    cafe: "Exemplo: pão com ovo e café",
    almoco: "Exemplo: bandejão",
    lanche: "Exemplo: fruta",
    janta: "Exemplo: arroz, frango e salada"
  };
  S.shopping.push(
    { id: newId(), text: "Exemplo: ovos", done: false },
    { id: newId(), text: "Exemplo: frango", done: false }
  );
  S.water[t] = [
    { t: "08:00", ml: 500 },
    { t: "10:30", ml: 300 }
  ];
  S.events.push({
    id: newId(),
    title: "Exemplo: jantar com amigos",
    date: addDays(t, 2),
    time: "20:00",
    place: ""
  });
  S.people.push({
    id: newId(),
    name: "Exemplo: amigo da faculdade",
    last: addDays(t, -20),
    every: 14,
    bday: ""
  });
  S.habits.push({
    id: newId(),
    name: "Exemplo: ler 20 minutos",
    time: "22:00",
    days: [0, 1, 2, 3, 4, 5, 6],
    created: addDays(t, -10)
  });
  S.habitLog[addDays(t, -2)] = [S.habits[S.habits.length - 1].id];
  S.habitLog[addDays(t, -3)] = [S.habits[S.habits.length - 1].id];
  commit();
  toast("Exemplos adicionados. Apague quando quiser.");
}
