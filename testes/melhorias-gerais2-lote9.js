// Testes Novas Melhorias Gerais: Lote 9 (Itens 81 a 90)
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

  // 81. Congelamento de sequência de hábito usando moedas/gotas
  const res81 = ev(`
    (() => {
      const hab = { id: "h1", streak: 12 };
      const rOk = aplicarCongelamentoHabito(hab, 100, 50);
      const rFail = aplicarCongelamentoHabito(hab, 30, 50);
      return rOk.sucesso === true && rOk.saldoRestante === 50 && rFail.sucesso === false;
    })()
  `);
  ok(res81, "81. aplicarCongelamentoHabito protegeu streak debitando gotas");

  // 82. Índice percentual de consistência de hábitos nos últimos 30 dias
  const res82 = ev(`
    (() => {
      return typeof calcularIndiceConsistenciaHabito === "function";
    })()
  `);
  ok(res82, "82. calcularIndiceConsistenciaHabito disponível para cálculo de consistência");

  // 83. Agrupamento de contatos sociais por status de periodicidade
  const res83 = ev(`
    (() => {
      const pessoas = [
        { id: "p1", name: "Ana", every: 7, last: "2026-10-20" },
        { id: "p2", name: "Beto", every: 7, last: "2026-10-10" }
      ];
      const g = agruparContatosPorFrequencia(pessoas, "2026-10-27");
      return g.hoje.length === 1 && g.atrasados.length === 1;
    })()
  `);
  ok(res83, "83. agruparContatosPorFrequencia separou contatos de hoje e atrasados");

  // 84. Cálculo da idade que o contato completará no próximo aniversário
  const res84 = ev(`
    (() => {
      const idade = calcularIdadeAniversariante("1998-05-14", "2026-10-27");
      return idade === 28;
    })()
  `);
  ok(res84, "84. calcularIdadeAniversariante calculou idade exata por ano de referência");

  // 85. Templates simpáticos de felicitações de aniversário
  const res85 = ev(`
    (() => {
      const tAmigo = gerarTemplateMensagemAniversario("Lucas", "amigo");
      return tAmigo.includes("Lucas") && tAmigo.includes("🎉");
    })()
  `);
  ok(res85, "85. gerarTemplateMensagemAniversario gerou texto acolhedor de parabéns");

  // 86. Média e distribuição de humores do fechamento do dia no mês
  const res86 = ev(`
    (() => {
      const diarios = {
        "2026-10-26": { humor: 4 },
        "2026-10-27": { humor: 5 }
      };
      const r = analisarHumorDiarioMensal(diarios);
      return r.media === 4.5 && r.total === 2;
    })()
  `);
  ok(res86, "86. analisarHumorDiarioMensal calculou média das avaliações emocionais");

  // 87. Perguntas reflexivas guiadas rotativas para fechamento noturno
  const res87 = ev(`
    (() => {
      const p1 = obterPerguntasReflexivasDiario(0);
      const p2 = obterPerguntasReflexivasDiario(1);
      return typeof p1 === "string" && p1 !== p2;
    })()
  `);
  ok(res87, "87. obterPerguntasReflexivasDiario forneceu perguntas rotativas de reflexão");

  // 88. Sequência de noites fechando o dia no diário
  const res88 = ev(`
    (() => {
      const diarios = {
        "2026-10-27": { closed: true },
        "2026-10-26": { closed: true }
      };
      const s = calcularDiasSeguidosFechandoDia(diarios, "2026-10-27");
      return s === 2;
    })()
  `);
  ok(res88, "88. calcularDiasSeguidosFechandoDia mediu streak noturno de diário");

  // 89. Ficha de ideias de presentes e preferências anotadas para contatos
  const res89 = ev(`
    (() => {
      const c = { id: "p1", name: "Carla", presentes: ["Livro de ficção"] };
      const f = gerarCartaoPresenteContato(c, ["Café especial"]);
      return f.sugestoes.length === 2 && f.sugestoes.includes("Café especial");
    })()
  `);
  ok(res89, "89. gerarCartaoPresenteContato reuniu lista de ideias de mimos");

  // 90. Resumo consolidado de rotina semanal
  const res90 = ev(`
    (() => {
      const r = formatarRelatorioRotinaSemanal({ tarefasFeitas: 18, minutosFoco: 180, aguaMediaML: 2400 });
      return r.tarefasFeitas === 18 && r.horasFoco === 3 && r.aguaMediaLitros === 2.4;
    })()
  `);
  ok(res90, "90. formatarRelatorioRotinaSemanal consolidou métricas semanais");

  await fechar();
  return erros;
};
