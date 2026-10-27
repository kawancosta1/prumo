// Testes Novas Melhorias Gerais: Lote 16 (Itens 151 a 160)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 151. Cálculo de densidade e índice de produtividade diária
  const res151 = ev(`
    (() => {
      const r = calcularDensidadeProdutividade(6, 120);
      return r.tarefasFeitas === 6 && r.horasFoco === 2 && r.densidade === 3;
    })()
  `);
  ok(res151, "151. calcularDensidadeProdutividade calculou índice de tarefas por hora de foco");

  // 152. Matriz de Eisenhower em 4 quadrantes
  const res152 = ev(`
    (() => {
      const tarefas = [
        { id: 1, prio: 3, time: "10:00" },
        { id: 2, prio: 2, time: "" },
        { id: 3, prio: 1, time: "14:00" },
        { id: 4, prio: 0, time: "" }
      ];
      const m = agruparTarefasPorMatrizEisenhower(tarefas);
      return m.urgenteImportante.length === 1 && m.planejar.length === 1 && m.delegar.length === 1 && m.eliminar.length === 1;
    })()
  `);
  ok(res152, "152. agruparTarefasPorMatrizEisenhower separou tarefas nos 4 quadrantes");

  // 153. Cálculo de tempo médio gasto por tarefa concluída
  const res153 = ev(`
    (() => {
      const tarefas = [{ done: true }, { done: true }, { done: false }];
      const r = calcularTempoMedioPorTarefa(tarefas, 60);
      return r.tarefasConcluidas === 2 && r.mediaMinutosPorTarefa === 30;
    })()
  `);
  ok(res153, "153. calcularTempoMedioPorTarefa mediu média de minutos por conclusão");

  // 154. Pomodoro flexível com pausas proporcionais ao tempo de foco
  const res154 = ev(`
    (() => {
      const p = gerarIntervalosPomodoroFlexivel(50);
      return p.foco === 50 && p.pausaCurta === 10 && p.pausaLonga === 30;
    })()
  `);
  ok(res154, "154. gerarIntervalosPomodoroFlexivel calculou pausas proporcionais a 50min");

  // 155. Modo de descanso ocular noturno com filtro âmbar suave
  const res155 = ev(`
    (() => {
      const div = document.createElement("div");
      aplicarModoNoturnoDescansoOlhos(div, true);
      const ligou = div.classList.contains("modo-descanso-olhos");
      aplicarModoNoturnoDescansoOlhos(div, false);
      const desligou = !div.classList.contains("modo-descanso-olhos");
      return ligou && desligou;
    })()
  `);
  ok(res155, "155. aplicarModoNoturnoDescansoOlhos alternou filtro de descanso ocular");

  // 156. Previsão de horário de conclusão de todas as pendências
  const res156 = ev(`
    (() => {
      const tarefas = [{ dur: 30 }, { dur: 30 }];
      const r = calcularPrevisaoConclusaoDia(tarefas, new Date("2026-10-27T10:00:00"));
      return r.totalMinutosRestantes === 60 && r.horarioEstimado === "11:00";
    })()
  `);
  ok(res156, "156. calcularPrevisaoConclusaoDia estimou horário de término do dia");

  // 157. Marcador e cálculo de horário para lembretes relativos
  const res157 = ev(`
    (() => {
      const h = gerarMarcadorLembreteRelativo(15, "14:30");
      return h === "14:15";
    })()
  `);
  ok(res157, "157. gerarMarcadorLembreteRelativo calculou antecedência exata de aviso");

  // 158. Validação de sobrecarga de tarefas em blocos individuais
  const res158 = ev(`
    (() => {
      const rOk = validarLimiteTarefasPorBloco([1, 2, 3], 5);
      const rFail = validarLimiteTarefasPorBloco([1, 2, 3, 4, 5, 6], 5);
      return rOk.aceitavel === true && rFail.aceitavel === false;
    })()
  `);
  ok(res158, "158. validarLimiteTarefasPorBloco preveniu saturação de tarefas");

  // 159. Recomendações de esforço por ciclo de energia circadiana
  const res159 = ev(`
    (() => {
      const rManha = calcularFatorEnergiaMomentoDia(9);
      const rNoite = calcularFatorEnergiaMomentoDia(21);
      return rManha.nivel === "pico" && rNoite.nivel === "relaxamento";
    })()
  `);
  ok(res159, "159. calcularFatorEnergiaMomentoDia mapeou níveis de energia pelo relógio circadiano");

  // 160. Relatório consolidado mensal de produtividade
  const res160 = ev(`
    (() => {
      const r = gerarRelatorioProdutividadeMensal([{ min: 600 }], [{ done: true }, { done: true }]);
      return r.horasFocoTotais === 10 && r.totalTarefasFeitas === 2;
    })()
  `);
  ok(res160, "160. gerarRelatorioProdutividadeMensal consolidou indicadores de produtividade do mês");

  await fechar();
  return erros;
};
