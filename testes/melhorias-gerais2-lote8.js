// Testes Novas Melhorias Gerais: Lote 8 (Itens 71 a 80)
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

  // 71. Meta dinâmica de hidratação esperada para o horário atual
  const res71 = ev(`
    (() => {
      const hora = new Date("2026-10-27T15:00:00");
      const ritmo = calcularHidratacaoHorarioRitmo(3000, "07:00", "23:00", hora);
      return ritmo > 1000 && ritmo < 2500;
    })()
  `);
  ok(res71, "71. calcularHidratacaoHorarioRitmo estimou volume proporcional ao meio do dia");

  // 72. Estrutura organizada de refeições diárias
  const res72 = ev(`
    (() => {
      const refeicoes = { 0: { cafe: "Ovos e café", almoco: "Salada e frango" } };
      const r = gerarDiarioAlimentarRefeicao(refeicoes, 0);
      return r.cafe === "Ovos e café" && r.registrado === true;
    })()
  `);
  ok(res72, "72. gerarDiarioAlimentarRefeicao estruturou blocos de refeição do dia");

  // 73. Medição de consumo de cafeína com alerta de horário
  const res73 = ev(`
    (() => {
      const c1 = calcularConsumoCafeinaDia(2, 10);
      const c2 = calcularConsumoCafeinaDia(3, 17);
      return c1.cafeinaMg === 160 && !c1.alertaSono && c2.alertaSono === true;
    })()
  `);
  ok(res73, "73. calcularConsumoCafeinaDia calculou cafeína e alertou ingestão tardia");

  // 74. Estado visual de hidratação do Prumi
  const res74 = ev(`
    (() => {
      const s1 = obterStatusDesidratacaoPrumi(3000, 2500);
      const s2 = obterStatusDesidratacaoPrumi(500, 2500);
      return s1.status === "radiante" && s2.status === "murcho";
    })()
  `);
  ok(res74, "74. obterStatusDesidratacaoPrumi refletiu estado do mascote por hidratação");

  // 75. Matriz mensal de atingimento de água para heatmap
  const res75 = ev(`
    (() => {
      const hist = { "2026-10-01": [{ ml: 2500 }] };
      const grid = gerarHistoricoMensalAguaHeatmap(hist, 9, 2026, 2500);
      return grid.length === 31 && grid[0].porcentagem === 100;
    })()
  `);
  ok(res75, "75. gerarHistoricoMensalAguaHeatmap gerou matriz de 31 dias com percentuais");

  // 76. Fator de compensação de hidratação por clima quente
  const res76 = ev(`
    (() => {
      const metaQuente = calcularFatorCompensacaoClima(32, 2500);
      const metaNormal = calcularFatorCompensacaoClima(22, 2500);
      return metaQuente === 3100 && metaNormal === 2500;
    })()
  `);
  ok(res76, "76. calcularFatorCompensacaoClima elevou meta em dias de calor intenso");

  // 77. Agrupamento de itens de lista de compras por categoria
  const res77 = ev(`
    (() => {
      const itens = [
        { name: "Maçã", categoria: "hortifruti" },
        { name: "Sabonete", categoria: "limpeza" }
      ];
      const g = gerarListaComprasAgrupada(itens);
      return g.hortifruti.length === 1 && g.limpeza.length === 1;
    })()
  `);
  ok(res77, "77. gerarListaComprasAgrupada organizou itens por setores do mercado");

  // 78. Verificação de alimentos próximos ao vencimento
  const res78 = ev(`
    (() => {
      const dispensa = [
        { name: "Iogurte", validade: "2026-10-29" },
        { name: "Arroz", validade: "2027-01-01" }
      ];
      const criticos = verificarValidadeAlimentos(dispensa, "2026-10-27");
      return criticos.length === 1 && criticos[0].name === "Iogurte";
    })()
  `);
  ok(res78, "78. verificarValidadeAlimentos identificou produtos com <= 3 dias de validade");

  // 79. Sequência contínua de dias cumprindo a meta de água
  const res79 = ev(`
    (() => {
      const hist = {
        "2026-10-27": [{ ml: 2600 }],
        "2026-10-26": [{ ml: 2500 }],
        "2026-10-25": [{ ml: 1000 }]
      };
      const streak = calcularSequenciaDiasAguaBatida(hist, 2500, "2026-10-27");
      return streak === 2;
    })()
  `);
  ok(res79, "79. calcularSequenciaDiasAguaBatida mediu sequência consecutiva de metas");

  // 80. Dicas contextuais de saúde baseadas no ritmo do dia
  const res80 = ev(`
    (() => {
      const dicaAgua = gerarDicaSaudeDia("normal", 30, 2);
      return dicaAgua.includes("copo d'água");
    })()
  `);
  ok(res80, "80. gerarDicaSaudeDia sugeriu hidratação ao detectar baixo percentual");

  await fechar();
  return erros;
};
