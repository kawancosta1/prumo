// Testes Bruxo: Lote 1 (Itens 1 a 10)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("bruxo");
    tab = "hoje";
    S.habits = [{ id: "hb1", name: "Cuidar das ervas", days: [0,1,2,3,4,5,6], time: "" }];
    S.habitLog = S.habitLog || {};
    S.habitLog[today()] = ["hb1"];
    S.tasks = [
      { id: "b1", title: "Colher cogumelos", area: "geral", date: today(), done: false, prio: 0, sub: [] },
      { id: "b2", title: "Destilar lavanda", area: "geral", date: today(), done: false, prio: 0, sub: [] },
      { id: "b3", title: "Acender o caldeirão", area: "geral", date: today(), done: false, prio: 0, sub: [] },
      { id: "b_antiga", title: "Vassoura esquecida", area: "geral", date: addDays(today(), -4), done: false, prio: 0, sub: [] }
    ];
    commit();
    render();
  `);
  await espera(30);

  // 1. Livro de receitas (20 poções)
  ok(ev("POCOES_BRUXO_20.length === 20"), "1. Livro de receitas contém 20 poções catalogadas");
  const novaPocao = ev("descobrirPocao(0, 1)");
  ok(
    novaPocao && ev(`dadosBruxo().descobertas.includes("${novaPocao.id}")`),
    "1. Descoberta de poção registrada com sucesso"
  );

  // 2. Fases da lua reais
  const lua = ev("faseLuaBruxo('2026-10-26')");
  ok(lua && lua.nome && lua.icone && lua.bonus, "2. Fase da lua real com bônus identificada");

  // 3. Horta que cresce
  const horta = ev("hortaCrescePlantas()");
  ok(horta && horta.length >= 1, "3. Plantas da horta conectadas aos hábitos diários");
  ev(`
    const d = dadosBruxo();
    d.hortaPlantas['hb1'].dias = 7;
    commit();
  `);
  const colheu = ev("colherPlantaHorta('hb1')");
  ok(colheu === true, "3. Erva colhida com sucesso aos 7 dias de cultivo");

  // 4. Feitiço de proteção matinal
  ev(`
    S.tasks[0].done = true;
    S.tasks[1].done = true;
    S.tasks[2].done = true;
    commit();
    conferirProtecaoManha(9);
  `);
  ok(ev("protecaoSequenciaBruxo()") === true, "4. Feitiço de proteção de sequência ativado");

  // 5. Maldição da procrastinação
  ev("conferirMaldicaoProcrastinacao()");
  ok(
    ev("S.tasks.find(t => t.id === 'b_antiga').sapo") >= 1,
    "5. Tarefa com 4 dias de atraso amaldiçoada como sapo"
  );
  ev("desencantarSapoTarefa('b_antiga')");
  ev("desencantarSapoTarefa('b_antiga')");
  ok(!ev("S.tasks.find(t => t.id === 'b_antiga').sapo"), "5. Sapo desencantado após 2 toques");

  // 6. Coven semanal
  const covenHtml = ev("covenSemanalHTML()");
  ok(covenHtml.includes("Coven da Floresta"), "6. Caldeirão do coven semanal exibido");

  // 7. Voo de vassoura
  ev("animarVooVassoura()");
  ok(D.querySelector(".bruxo-vassoura-voo"), "7. Vassoura animada sobrevoando a tela");

  // 8. Gato conselheiro
  const conselho = ev("conselhoGatoBruxo()");
  ok(conselho && conselho.length > 5, "8. Conselho sábio do gato preto obtido");

  // 9. Sabá de sexta
  ok(ev("typeof sabaDeSextaHTML === 'function'"), "9. Função do Sabá de sexta disponível");

  // 10. Grimório de ervas
  ok(ev("FICHAS_ERVAS.length === 7"), "10. Sete ervas da cabana com fichas catalogadas");
  const grimorioHtml = ev("grimorioErvasHTML()");
  ok(grimorioHtml.includes("Grimório das Ervas"), "10. HTML do grimório de ervas gerado com sucesso");

  fechar();
  return erros;
};
