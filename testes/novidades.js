// Organizar, hábitos/água, busca, tema pela hora, volume e evolução dos pets
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };
  const t = (id, title, extra = "") =>
    `{ id: "${id}", title: "${title}", area: "geral", date: today(), done: false, prio: 0, sub: []${extra} }`;
  ev(
    `S.onboarded = true; S.semConta = true; S.coins = 100; S.wake = "00:01"; S.sleep = "23:59"; S.tasks = [${t("a", "Estudar cálculo", ", prio: 3")}, ${t("b", "Ligar pro banco")}, ${t("c", "Reunião", ', time: "23:30"')}]; tab = "hoje"; render();`
  );

  // planejar meu dia
  ok(/Planejar meu dia/.test(M()), "Hoje oferece planejar o dia");
  clicar('[data-act="plano-abrir"]');
  ok(D.querySelectorAll(".plano-lista li").length === 3, "plano lista as 3 tarefas");
  ok(
    D.querySelector(".plano-lista li:not(.fixa) .plano-titulo").textContent === "Estudar cálculo",
    "a mais importante vem primeiro"
  );
  clicar('[data-act="plano-usar"]');
  ok(
    ev(`S.tasks.find(x => x.id === "a").time`) && ev(`S.tasks.find(x => x.id === "c").time`) === "23:30",
    "usar horários põe hora nas soltas e mantém as fixas"
  );

  // quebrar em passos
  ev(`openTask = "a"; render();`);
  clicar('[data-act="quebrar-passos"]');
  ok(ev(`S.tasks.find(x => x.id === "a").sub.length`) >= 3, "quebrar em passos cria subtarefas");
  ok(
    ev(`passosPara("lavar a louça, varrer e tirar o lixo").length`) === 3,
    "título com várias partes vira um passo por parte"
  );

  // revisão da semana (domingo)
  ok(
    ev(
      `[5, 6].includes((new Date().getDay() + 6) % 7) ? !!revisaoPendente() || !!S.organizar.revisao : revisaoPendente() === null`
    ),
    "revisão da semana só no domingo e na segunda"
  );

  // reta final das provas
  ev(
    `S.subjects = [{ id: "m1", name: "Cálculo", color: "#2340C4" }]; S.exams = [{ id: "e1", title: "P1 de Cálculo", subjectId: "m1", date: addDays(today(), 3), plano: { horas: 6, desde: today() } }]; openTask = null; render();`
  );
  ok(/reta-final/.test(M()) && /P1 de Cálculo/.test(M()), "prova perto mostra a contagem");
  clicar('[data-act="prova-estudar"]');
  ok(
    ev("timer.running && timer.subjectId === 'm1' && tab === 'estudos'"),
    "Estudar agora liga o foco da matéria"
  );
  ev(`timer.running = false; timer.acc = 0; saveTimerState();`);

  // folga dos hábitos
  ev(
    `const seg = mondayOf(today()); S.habits = [{ id: "h1", name: "Ler", time: "", days: [0,1,2,3,4,5,6], created: addDays(today(), -10) }]; S.habitLog = {}; for (let i = 1; i <= 6; i++) if (i !== 3) { const d = addDays(today(), -i); (S.habitLog[d] = S.habitLog[d] || []).push("h1"); }`
  );
  const comFolga = ev(`habitStreak(S.habits[0])`);
  ev(`S.habitosFolga = { ligado: false }`);
  const semFolga = ev(`habitStreak(S.habits[0])`);
  ok(
    comFolga > semFolga && semFolga === 2,
    `folga não quebra a sequência (${comFolga} com folga, ${semFolga} sem)`
  );
  ev(`S.habitosFolga = { ligado: true }; tab = "social"; render();`);
  ok(
    /Dia de folga/.test(M()) && D.querySelector(".heat i.folga"),
    "folga aparece no quadriculado e nos ajustes"
  );

  // água no mês
  ev(`tab = "dieta"; render();`);
  ok(D.querySelectorAll(".agua-mes-grade i").length === 35, "quadriculado da água no mês");

  // busca
  ev(`abrirBusca()`);
  const campo = D.querySelector(".busca-geral input");
  campo.value = "calculo";
  campo.dispatchEvent(new w.Event("input", { bubbles: true }));
  ok(
    D.querySelectorAll(".busca-lista [data-i]").length >= 2,
    "busca acha tarefa, matéria e prova (sem acento)"
  );
  D.querySelector('.busca-lista [data-i="0"]').dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok(
    !D.querySelector(".busca-geral") && ev("tab") === "hoje" && ev("openTask") === "a",
    "clicar no resultado abre a tarefa"
  );

  // tema pela hora e volume
  ev(`S.mode = "hora"`);
  ok(ev("isDark()") === ev("noiteAgora()"), "tema pela hora segue o relógio");
  ev(`S.mode = "auto"; S.notif.volume = 40; tab = "ajustes"; render();`);
  ok(
    D.querySelector('[data-change="volume-app"]') &&
      D.querySelector('[data-change="volume-app"]').value === "40",
    "controle de volume em Ajustes"
  );

  // pets: truque por dias, fala, fantasia, lembrança, ninhada
  ev(
    `adocao = { especie: "gato", cor: "", nome: "Mingau", personalidade: "curioso" }; FORMS_EXTRAS.adotar();`
  );
  ev(
    `const x = petAtivo(); x.cuidados = Array.from({ length: 6 }, (_, i) => addDays(today(), -i - 1)); cuidou(x);`
  );
  ok(ev(`petAtivo().truques.includes("acenar")`), "7 dias de cuidado: aprende a acenar sozinho");
  ev(`tab = "hoje"; render(); S.tasks.push(${t("n1", "Prova de física")}); render();`);
  await espera(20);
  const fala = D.querySelector("#pets-passeio .pet-fala");
  ok(fala && fala.textContent.length > 3, "pet comenta a tarefa nova");
  ok(
    ev(
      `(() => { const e0 = epocaAtiva; epocaAtiva = id => id === "natal"; const s = fantasiaPetSVG(petAtivo()); epocaAtiva = e0; return s.length > 0; })()`
    ),
    "fantasia da época quando está sem chapéu"
  );
  const g0 = ev("S.coins");
  ev(`deixarLembranca({ nome: "Rex", dono: "Bia", especie: "cachorro" })`);
  ok(
    ev("petsDados().lembrancas.length") === 1 && ev("S.coins") === g0 + 2,
    "visita deixa lembrança e +2 gotas"
  );
  ev(
    `adocao = { especie: "coelho", cor: "", nome: "Neve", personalidade: "curioso" }; FORMS_EXTRAS.adotar(); petsDados().ninhada = { dias: Array.from({ length: 29 }, (_, i) => addDays(today(), -i - 1)) }; petsDados().lista.forEach(p => { p.comeuEm = Date.now(); p.carinhos[today()] = 5; });`
  );
  ev(`S.tasks.forEach(x => (x.done = true, x.feitaEm = today()));`);
  ev(`conferirNinhada()`);
  ok(
    ev("petsDados().lista.length") === 3 && ev("petsDados().lista[2].pais.length") === 2,
    "30 dias felizes juntos: nasce um filhote"
  );

  fechar();
  return erros;
};
