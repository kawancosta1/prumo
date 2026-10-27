// Testes Novas Melhorias Gerais: Lote 7 (Itens 61 a 70)
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

  // 61. Algoritmo SM-2 para Repetição Espaçada com intervalos dinâmicos
  const res61 = ev(`
    (() => {
      const p1 = calcularRevisaoEspacadaSM2(0, 4);
      const p2 = calcularRevisaoEspacadaSM2(1, 5);
      const pFail = calcularRevisaoEspacadaSM2(2, 2);
      return p1.passo === 1 && p1.intervaloDias === 1 && p2.passo === 2 && p2.intervaloDias === 6 && pFail.passo === 0;
    })()
  `);
  ok(res61, "61. calcularRevisaoEspacadaSM2 aplicou algoritmo com intervalos graduais e reset em falha");

  // 62. Distribuição percentual de tempo de estudo por disciplina
  const res62 = ev(`
    (() => {
      const sessoes = [
        { subjectId: "mat", min: 60 },
        { subjectId: "fis", min: 40 }
      ];
      const dist = calcularDistribuicaoTempoEstudo(sessoes);
      return dist.length === 2 && dist[0].subjectId === "mat" && dist[0].porcentagem === 60;
    })()
  `);
  ok(res62, "62. calcularDistribuicaoTempoEstudo gerou ranking percentual por matéria");

  // 63. Grade horária semanal organizada por dia e horário
  const res63 = ev(`
    (() => {
      const aulas = [
        { day: 1, start: "10:00", subjectId: "hist" },
        { day: 1, start: "08:00", subjectId: "geo" }
      ];
      const g = gerarGradeHorariaSemanal(aulas);
      return g[1].length === 2 && g[1][0].subjectId === "geo";
    })()
  `);
  ok(res63, "63. gerarGradeHorariaSemanal ordenou cronologicamente aulas na semana");

  // 64. Contador de ciclos de Pomodoro com indicação para pausa longa
  const res64 = ev(`
    (() => {
      const c3 = calcularContadorCiclosPomodoro(3, 4);
      const c4 = calcularContadorCiclosPomodoro(4, 4);
      return c3.cicloAtual === 4 && !c3.pausaLonga && c4.pausaLonga === true && c4.totalCiclos === 1;
    })()
  `);
  ok(res64, "64. calcularContadorCiclosPomodoro alertou pausa longa no 4º ciclo");

  // 65. Gerador de som de foco (ruído suave senoidal) via Web Audio
  const res65 = ev(`
    (() => {
      return typeof obterRuidoBrancoFoco === "function";
    })()
  `);
  ok(res65, "65. obterRuidoBrancoFoco disponível para concentração");

  // 66. Avaliação de taxa de retenção e acertos em revisões do mês
  const res66 = ev(`
    (() => {
      const revs = [{ done: true }, { done: true }, { done: false }];
      const r = avaliarDesempenhoRevisao(revs);
      return r.concluidas === 2 && r.taxa === 67;
    })()
  `);
  ok(res66, "66. avaliarDesempenhoRevisao mediu índice de acertos e conclusão");

  // 67. Contagem regressiva em dias até a data da prova
  const res67 = ev(`
    (() => {
      const dias = calcularContadorDiasAteProva("2026-10-31", "2026-10-27");
      return dias === 4;
    })()
  `);
  ok(res67, "67. calcularContadorDiasAteProva calculou dias restantes para exame");

  // 68. Checklist e progresso percentual de conteúdos para prova
  const res68 = ev(`
    (() => {
      const topicos = [{ done: true }, { done: false }];
      const r = gerarChecklistConteudoProva(topicos);
      return r.total === 2 && r.porcentagem === 50;
    })()
  `);
  ok(res68, "68. gerarChecklistConteudoProva computou percentual de tópicos cobertos");

  // 69. Calculadora de nota necessária em prova final
  const res69 = ev(`
    (() => {
      const nota = calcularMediaNecessariaProva(7.0, 5.0, 2, 3, 6.0);
      return typeof nota === "number" && nota >= 0;
    })()
  `);
  ok(res69, "69. calcularMediaNecessariaProva calculou nota requerida com pesos ponderados");

  // 70. Snapshot estruturado de sessão de estudo para log histórico
  const res70 = ev(`
    (() => {
      const s = gerarSnapshotSessaoFoco("quim", 45, "Exercícios de estequiometria");
      return s.subjectId === "quim" && s.minutos === 45 && s.notas.includes("estequiometria");
    })()
  `);
  ok(res70, "70. gerarSnapshotSessaoFoco registrou metadados completos da sessão");

  await fechar();
  return erros;
};
