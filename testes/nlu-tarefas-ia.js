const { abrir } = require("./ambiente");

module.exports = async function (url) {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Frase exata do usuário com erro de digitação, data, hora aproximada e duração composta
    const p1 = ev(`parseQuick("vu estudar calcula amanha umas 16:00 durante 1 hora e meia")`);
    const amanha = ev(`addDays(today(), 1)`);
    ok(p1.title === "Estudar Cálculo", "corrige 'vu estudar calcula' para 'Estudar Cálculo': " + p1.title);
    ok(p1.date === amanha, "entende 'amanha' como data de amanhã: " + p1.date);
    ok(p1.time === "16:00", "entende 'umas 16:00' como 16:00: " + p1.time);
    ok(p1.dur === 90, "entende 'durante 1 hora e meia' como 90 min: " + p1.dur);
    ok(p1.area === "estudo", "infere área 'estudo' automaticamente: " + p1.area);

    // 2. Frases variadas em linguagem natural coloquial
    const p2 = ev(
      `parseQuick("vou revisar fisica depois de amanha as 4 e meia da tarde por 45 min urgente")`
    );
    const depAmanha = ev(`addDays(today(), 2)`);
    ok(p2.title === "Revisar Física", "corrige 'vou revisar fisica' para 'Revisar Física': " + p2.title);
    ok(p2.date === depAmanha, "entende 'depois de amanha': " + p2.date);
    ok(p2.time === "16:30", "entende 'as 4 e meia da tarde' como 16:30: " + p2.time);
    ok(p2.dur === 45, "entende 'por 45 min' como 45: " + p2.dur);
    ok(p2.prio === 3, "entende 'urgente' como prioridade alta (3): " + p2.prio);

    // 3. Intervalo de horário ("das 14h às 15h30")
    const p3 = ev(`parseQuick("tenho que treinar academia hj das 14h às 15h30")`);
    ok(p3.time === "14:00" && p3.dur === 90, "calcula início 14:00 e duração 90 min em 'das 14h às 15h30'");
    ok(p3.area === "dieta", "infere área 'dieta' para treino/academia: " + p3.area);

    // 4. Múltiplas tarefas na mesma frase
    const multi = ev(
      `extrairTarefasDeFrase("estudar calculo amanha as 16h por 1h30 e revisar ingles as 19h por 40 min")`
    );
    ok(
      Array.isArray(multi) && multi.length === 2,
      "separa 2 tarefas conectadas na mesma frase: " + multi.length
    );
    ok(
      multi[0].title === "Estudar Cálculo" && multi[0].time === "16:00" && multi[0].dur === 90,
      "primeira tarefa múltipla com título, hora e duração corretos"
    );
    ok(
      multi[1].title === "Revisar Inglês" &&
        multi[1].date === amanha &&
        multi[1].time === "19:00" &&
        multi[1].dur === 40,
      "segunda tarefa múltipla herda a data (amanhã) e aplica hora 19:00 e duração 40 min"
    );

    // 5. Criação automática de tarefa pela IA no chat e card de ação
    const qtdAntes = ev(`S.tasks.length`);
    const respIA = ev(
      `gerarRespostaAutonomaIA("vu estudar calcula amanha umas 16:00 durante 1 hora e meia")`
    );
    const qtdDepois = ev(`S.tasks.length`);
    ok(qtdDepois === qtdAntes + 1, "IA cria a tarefa automaticamente em S.tasks ao receber comando natural");
    ok(
      respIA && respIA.texto && respIA.texto.includes("[[ACAO_TAREFA_CRIADA:"),
      "resposta da IA inclui marcador de card interativo da tarefa criada"
    );
    const htmlCard = ev(`formatarTextoMensagemIA(${JSON.stringify(respIA.texto)})`);
    ok(
      htmlCard.includes("ia-focar-tarefa-chat") && htmlCard.includes("Estudar Cálculo"),
      "formatarTextoMensagemIA renderiza card com a tarefa criada e botão Focar"
    );

    // 6. Clicar em focar tarefa usa a duração (90 min) no cronômetro Pomodoro
    const ultimaId = ev(`S.tasks[S.tasks.length - 1].id`);
    ev(`ACOES_EXTRAS["ia-focar-tarefa-chat"]({ dataset: { id: ${JSON.stringify(ultimaId)} } })`);
    const metaTimer = ev(`timer.goal`);
    ok(metaTimer === 90, "iniciar foco na tarefa ajusta meta do cronômetro para 90 min: " + metaTimer);
  } finally {
    fechar();
  }
  return erros;
};
