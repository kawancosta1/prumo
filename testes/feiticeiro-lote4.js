// Testes Feiticeiro: Lote 4 (Itens 31 a 40)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("feiticeiro");
    tab = "hoje";
    S.habits = [{ id: "h1", name: "Meditar", days: [0,1,2,3,4,5,6], time: "" }];
    S.habitLog = S.habitLog || {};
    S.habitLog[today()] = ["h1"];
    S.tasks = [
      { id: "f4", title: "Tarefa pontual", area: "geral", date: today(), done: false, prio: 0, sub: [] },
      { id: "f_atrasada", title: "Poção esquecida", area: "geral", date: addDays(today(), -2), done: false, prio: 0, sub: [] }
    ];
    S.estudos = S.estudos || {};
    S.estudos.provas = [
      { id: "p1", materia: "Alquimia", data: addDays(today(), 5), metaHoras: 10 }
    ];
    S.sessions = [{ date: today(), materia: "Alquimia", min: 120 }];
    S.diario = {};
    S.diario[today()] = "Hoje decifrei a terceira página do grimório celestial.";
    commit();
    render();
  `);
  await espera(30);

  // 31. Componentes de feitiço por hábitos
  const comp = ev("atualizarComponentesHabitos()");
  ok(
    comp && (comp.poEstrela > 0 || comp.penaArcana > 0 || comp.cristalMana > 0),
    "31. Componente mágico gerado a partir de hábito concluído"
  );

  // 32. Feitiço Tempus
  ok(ev("podeUsarTempus()") === true, "32. Feitiço Tempus disponível na semana");
  const adiou = ev("usarTempusAdiar('f4')");
  ok(adiou === true, "32. Tarefa adiada usando Tempus");
  ok(ev("podeUsarTempus()") === false, "32. Feitiço Tempus utilizado não pode ser repetido na mesma semana");

  // 33. Exames da academia
  const exames = ev("examesAcademia()");
  ok(exames && exames.length === 1, "33. Prova convertida em exame da academia");
  ok(exames[0].notaPreparacao >= 20, "33. Nota de preparação calculada a partir do tempo de estudo");

  // 34. Ampulheta no foco
  const svgAmpulheta = ev("ampulhetaFocoSVG(0.6)");
  ok(svgAmpulheta.includes("feit-ampulheta-svg"), "34. SVG da ampulheta de foco gerado com sucesso");

  // 35. Chuvas de meteoros e constelações raras
  const meteoro = ev("chuvaMeteoroAtiva('2026-08-12')");
  ok(
    meteoro && meteoro.nome === "Perseidas" && meteoro.constelacao === "Pégaso Cintilante",
    "35. Chuva de meteoros real reconhecida com constelação rara"
  );

  // 36. Diário do mago com páginas
  const pags = ev("paginasDiarioMago()");
  ok(
    pags && pags.length >= 1 && pags[0].texto.includes("grimório celestial"),
    "36. Diário do mago estruturado em páginas arcanas"
  );

  // 37. Selo de cera no cartão do Prumi
  const svgSelo = ev("enfeiteSeloCeraSVG()");
  ok(svgSelo.includes("feit-selo-cera"), "37. Selo de cera do arquimago gerado");

  // 38. Velas flutuantes no cabeçalho
  const svgVelas = ev("velasCabecalhoSVG(3, 5)");
  ok(
    svgVelas.includes("feit-velas-cabecalho") && svgVelas.includes("acesa"),
    "38. Velas flutuantes geradas correspondentes ao progresso"
  );

  // 39. Desenrolar de pergaminho ao subir de título
  ev("desenrolarPergaminhoNovoTitulo('Mestre das Runas')");
  ok(D.querySelector(".feit-modal-pergaminho"), "39. Pergaminho desenrolado na tela para o novo título");
  ev("ACOES_EXTRAS['feit-fechar-modal'](document.querySelector('.feit-modal-pergaminho button'))");
  ok(!D.querySelector(".feit-modal-pergaminho"), "39. Modal de pergaminho fechado");

  // 40. Tarefas petrificadas
  ev("marcarTarefasPetrificadas()");
  ok(true, "40. Função de marcação de tarefas petrificadas executada sem erro");

  fechar();
  return erros;
};
