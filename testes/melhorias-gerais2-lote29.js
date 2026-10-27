// Testes Novas Melhorias Gerais: Lote 29 (Itens 281 a 290)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 281. Convite para pareamento em dupla
  const res281 = ev(`
    (() => {
      const c = gerarConvitePareamentoAmigo("PRU-5544");
      return c.codigo === "PRU-5544" && c.link.includes("PRU-5544");
    })()
  `);
  ok(res281, "281. gerarConvitePareamentoAmigo montou mensagem com link de conexo");

  // 282. Mdia de humor semanal da dupla
  const res282 = ev(`
    (() => {
      const m = calcularMediaHumorSemanalDupla([5, 5, 5], [5, 5, 5]);
      return m.mediaMinha === 5 && m.mediaParceiro === 5 && m.sintoniaDupla === 100;
    })()
  `);
  ok(res282, "282. calcularMediaHumorSemanalDupla calculou sintonia emocional");

  // 283. Notificao festiva de meta da dupla
  const res283 = ev(`
    (() => {
      const n = gerarNotificacaoMetaAlcancadaDupla("Bia", "Meditar 7 dias");
      return n.parceiro === "Bia" && n.mensagem.includes("Meditar 7 dias");
    })()
  `);
  ok(res283, "283. gerarNotificacaoMetaAlcancadaDupla criou alerta comemorativo");

  // 284. Lista de desejos compartilhada
  const res284 = ev(`
    (() => {
      const d = formatarListaDesejosCompartilhada([
        { item: "Livro novo", realizado: true },
        { item: "Jantar juntos", realizado: false }
      ]);
      return d.totalItens === 2 && d.concluidos === 1;
    })()
  `);
  ok(res284, "284. formatarListaDesejosCompartilhada totalizou desejos e conquistas");

  // 285. Sequncia contnua em dupla
  const res285 = ev(`
    (() => {
      const hist = [
        { ambosCumpriram: true },
        { ambosCumpriram: true },
        { ambosCumpriram: true }
      ];
      const s = calcularDiasConsecutivosDupla(hist);
      return s === 3;
    })()
  `);
  ok(res285, "285. calcularDiasConsecutivosDupla mensurou streak mtuo");

  // 286. Mensagem de carinho aleatria
  const res286 = ev(`
    (() => {
      const msg = gerarMensagemCarinhoAleatoria();
      return typeof msg === "string" && msg.length > 5;
    })()
  `);
  ok(res286, "286. gerarMensagemCarinhoAleatoria forneceu frase de apoio");

  // 287. Validao de cdigo de pareamento
  const res287 = ev(`
    (() => {
      const v1 = validarCodigoPareamentoValido("pru-ab12");
      const v2 = validarCodigoPareamentoValido("invalido");
      return v1.valido === true && v1.codigoFormatado === "PRU-AB12" && v2.valido === false;
    })()
  `);
  ok(res287, "287. validarCodigoPareamentoValido validou formato PRU-XXXX");

  // 288. Efeito de reao de corao
  const res288 = ev(`
    (() => {
      const cor = gerarEfeitoToqueCoracao(50, 80);
      return cor.x === 50 && cor.y === 80 && cor.animacao === "coracao-flutuante";
    })()
  `);
  ok(res288, "288. gerarEfeitoToqueCoracao criou coordenadas de reao");

  // 289. Distribuio de tarefas da dupla
  const res289 = ev(`
    (() => {
      const d = calcularDistribuicaoTarefasDupla(5, 5);
      return d.proporcaoEu === 50 && d.proporcaoParceiro === 50 && d.equilibrado === true;
    })()
  `);
  ok(res289, "289. calcularDistribuicaoTarefasDupla avaliou harmonia na diviso de tarefas");

  // 290. Selo de cumplicidade anual
  const res290 = ev(`
    (() => {
      const s = gerarSeloCumplicidadeAnual("2025-01-01", "2026-01-02");
      return s.elegivel === true && s.medalha.includes("Diamante");
    })()
  `);
  ok(res290, "290. gerarSeloCumplicidadeAnual concedeu medalha de 365 dias");

  await fechar();
  return erros;
};
