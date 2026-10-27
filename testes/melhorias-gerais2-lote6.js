// Testes Novas Melhorias Gerais: Lote 6 (Itens 51 a 60)
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

  // 51. Alerta sonoro com sintetizador nativo Web Audio API sem arquivos externos
  const res51 = ev(`
    (() => {
      return typeof tocarSomSintetizado === "function";
    })()
  `);
  ok(res51, "51. tocarSomSintetizado disponível para síntese senoidal pura");

  // 52. Medidor de intensidade de hábitos com gradiente de medalha/metal
  const res52 = ev(`
    (() => {
      const b3 = obterCorIntensidadeHabito(3);
      const b7 = obterCorIntensidadeHabito(7);
      const b21 = obterCorIntensidadeHabito(25);
      const b60 = obterCorIntensidadeHabito(65);
      return b3.nivel === "Bronze" && b7.nivel === "Prata" && b21.nivel === "Ouro" && b60.nivel === "Diamante";
    })()
  `);
  ok(res52, "52. obterCorIntensidadeHabito escalou níveis por marcos de dias");

  // 53. Estimativa de tempo total de tarefas do dia
  const res53 = ev(`
    (() => {
      const tarefas = [
        { title: "Estudar cálculo 1h30" },
        { title: "Ler artigo 45min" },
        { title: "Academia", dur: "1h" }
      ];
      const r = calcularTempoTotalEstimadoMinutos(tarefas);
      return r.minutos === 215 && r.formatado === "3h 35min";
    })()
  `);
  ok(res53, "53. calcularTempoTotalEstimadoMinutos somou estimativas de tempo em horas e minutos");

  // 54. Formatação humanizada de datas relativas com Intl.RelativeTimeFormat
  const res54 = ev(`
    (() => {
      const hj = formatarDataRelativaIntl("2026-10-27", "2026-10-27");
      const am = formatarDataRelativaIntl("2026-10-28", "2026-10-27");
      const on = formatarDataRelativaIntl("2026-10-26", "2026-10-27");
      return hj.toLowerCase() === "hoje" && am.toLowerCase() === "amanhã" && on.toLowerCase() === "ontem";
    })()
  `);
  ok(res54, "54. formatarDataRelativaIntl formatou ontem, hoje e amanhã via Intl");

  // 55. Modo foco estrito: recolhimento de distrações
  const res55 = ev(`
    (() => {
      const container = document.createElement("div");
      aplicarModoFocoEstrito(container, true);
      const ligou = container.classList.contains("modo-foco-estrito-ativo");
      aplicarModoFocoEstrito(container, false);
      const desligou = !container.classList.contains("modo-foco-estrito-ativo");
      return ligou && desligou;
    })()
  `);
  ok(res55, "55. aplicarModoFocoEstrito alternou classe de isolamento visual no container");

  // 56. Agrupamento de tarefas por período do dia (Manhã, Tarde, Noite)
  const res56 = ev(`
    (() => {
      const tarefas = [
        { id: 1, time: "09:00" },
        { id: 2, time: "14:30" },
        { id: 3, time: "20:00" },
        { id: 4, time: "" }
      ];
      const g = agruparTarefasPorPeriodo(tarefas);
      return g.manha.length === 1 && g.tarde.length === 1 && g.noite.length === 1 && g.flexivel.length === 1;
    })()
  `);
  ok(res56, "56. agruparTarefasPorPeriodo dividiu tarefas em manhã, tarde, noite e flexível");

  // 57. Comparativo de hidratação semanal com média diária
  const res57 = ev(`
    (() => {
      const hist = {
        "2026-10-25": [{ ml: 1000 }, { ml: 1000 }],
        "2026-10-26": [{ ml: 3000 }]
      };
      const r = calcularMediaAguaSemanal(hist, 2500, 2);
      return r.totalML === 5000 && r.mediaML === 2500 && r.porcentagemMeta === 100;
    })()
  `);
  ok(res57, "57. calcularMediaAguaSemanal calculou média diária e proporção da meta");

  // 58. Detecção e aviso de sono irregular
  const res58 = ev(`
    (() => {
      const sIdeal = verificarJanelaSonoSaudavel("07:00", "23:00"); // 8 horas
      const sCurto = verificarJanelaSonoSaudavel("07:00", "03:00"); // 4 horas
      return sIdeal.horas === 8 && sIdeal.saudavel === true && sCurto.saudavel === false;
    })()
  `);
  ok(res58, "58. verificarJanelaSonoSaudavel mediu horas e avaliou janela de descanso");

  // 59. Indicador de checklist/subtarefas com barra de preenchimento
  const res59 = ev(`
    (() => {
      const subs = [{ done: true }, { done: true }, { done: false }, { done: false }];
      const r = gerarBarraProgressoSubtarefas(subs);
      return r.total === 4 && r.concluidas === 2 && r.porcentagem === 50 && r.rotulo.includes("2/4");
    })()
  `);
  ok(res59, "59. gerarBarraProgressoSubtarefas calculou progresso percentual de subtarefas");

  // 60. Sistema de Desfazer em fila (Undo Stack de até 5 ações)
  const res60 = ev(`
    (() => {
      const fila = criarFilaDesfazer(3);
      fila.push({ passo: 1 });
      fila.push({ passo: 2 });
      fila.push({ passo: 3 });
      fila.push({ passo: 4 }); // 1 deve ser descartado pois max = 3
      const u4 = fila.pop();
      const u3 = fila.pop();
      return u4.passo === 4 && u3.passo === 3 && fila.tamanho() === 1;
    })()
  `);
  ok(res60, "60. criarFilaDesfazer gerenciou pilha de histórico com limite máximo");

  await fechar();
  return erros;
};
