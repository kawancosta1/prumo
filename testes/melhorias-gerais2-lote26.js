// Testes Novas Melhorias Gerais: Lote 26 (Itens 251 a 260)
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

  // 251. Link de compartilhamento de meta com hash
  const res251 = ev(`
    (() => {
      const link = gerarLinkCompartilhamentoMeta({ titulo: "Correr 5k", progresso: 50 });
      return link.shareUrl.includes("https://prumo.app/#share=") && link.payload.titulo === "Correr 5k";
    })()
  `);
  ok(res251, "251. gerarLinkCompartilhamentoMeta codificou meta compartilhvel");

  // 252. Taxa de aderncia de planejamento de tempo
  const res252 = ev(`
    (() => {
      const ad = calcularTaxaAderenciaPlanejamento(60, 60);
      const ad2 = calcularTaxaAderenciaPlanejamento(60, 30);
      return ad.aderenciaPorcentagem === 100 && ad2.aderenciaPorcentagem === 50;
    })()
  `);
  ok(res252, "252. calcularTaxaAderenciaPlanejamento avaliou preciso da estimativa");

  // 253. Filtro por contexto (@casa, @rua, etc.)
  const res253 = ev(`
    (() => {
      const t = [
        { texto: "Comprar leite @rua" },
        { texto: "Arrumar gaveta @casa" }
      ];
      const filtrado = filtrarTarefasPorContextoLocal(t, "@casa");
      return filtrado.length === 1 && filtrado[0].texto.includes("@casa");
    })()
  `);
  ok(res253, "253. filtrarTarefasPorContextoLocal filtrou por marcador de ambiente");

  // 254. Clculo de alarme com margem de deslocamento
  const res254 = ev(`
    (() => {
      const alarme = calcularHorarioAlarmeComMargem("10:00", 30, 15);
      return alarme.horaAlarme === "09:15" && alarme.recuoTotalMinutos === 45;
    })()
  `);
  ok(res254, "254. calcularHorarioAlarmeComMargem calculou antecipao adequada");

  // 255. Resumo de produtividade estruturado
  const res255 = ev(`
    (() => {
      const res = gerarResumoProdutividadeSemanalEmail("Kawan", 90, 15, 240);
      return res.includes("Olá, Kawan!") && res.includes("90%") && res.includes("4.0 horas");
    })()
  `);
  ok(res255, "255. gerarResumoProdutividadeSemanalEmail gerou texto sinttico");

  // 256. Estimativa de tempo total pendente
  const res256 = ev(`
    (() => {
      const t = [
        { done: false, duracaoMinutos: 30 },
        { done: true, duracaoMinutos: 60 },
        { done: false, duracaoMinutos: 45 }
      ];
      const est = estimarTempoConclusaoLista(t);
      return est.tarefasPendentes === 2 && est.tempoTotalMinutos === 75 && est.tempoFormatado === "1h 15min";
    })()
  `);
  ok(res256, "256. estimarTempoConclusaoLista somou durao das pendncias");

  // 257. Agrupamento em Matriz de Prioridade
  const res257 = ev(`
    (() => {
      const t = [
        { texto: "!!! Pagar conta", prioridade: 3 },
        { texto: "!! Lavar carro", prioridade: 2 },
        { texto: "Assistir srie", prioridade: 1 }
      ];
      const grp = agruparTarefasPorPrioridadeMatriz(t);
      return grp.alta.length === 1 && grp.media.length === 1 && grp.baixa.length === 1;
    })()
  `);
  ok(res257, "257. agruparTarefasPorPrioridadeMatriz separou nveis de urgncia");

  // 258. Validador de limite de anotaes
  const res258 = ev(`
    (() => {
      const v = validarLimiteCaracteresNotas("Nota curta", 50);
      return v.valido === true && v.caracteresAtuais === 10 && v.restantes === 40;
    })()
  `);
  ok(res258, "258. validarLimiteCaracteresNotas mediu extenso do texto");

  // 259. Pontuao de eficincia do dia
  const res259 = ev(`
    (() => {
      const pont = calcularPontuacaoEficienciaDia(5, 4, 8);
      return pont.pontuacao === 100 && pont.tarefasScore === 50 && pont.pomodoroScore === 30;
    })()
  `);
  ok(res259, "259. calcularPontuacaoEficienciaDia ponderou hbitos saudveis");

  // 260. Dica personalizada de produtividade
  const res260 = ev(`
    (() => {
      const d = gerarDicaPersonalizadaProdutividade("matutino");
      return d.perfil === "matutino" && typeof d.dica === "string" && d.dica.length > 10;
    })()
  `);
  ok(res260, "260. gerarDicaPersonalizadaProdutividade forneceu orientao contextual");

  await fechar();
  return erros;
};
