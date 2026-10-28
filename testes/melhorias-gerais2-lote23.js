// Testes Novas Melhorias Gerais: Lote 23 (Itens 221 a 230)
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

  // 221. Clculo dinmico de preo em promoes relmpago
  const res221 = ev(`
    (() => {
      const p = calcularPrecoDinamicoItemPromocao(150, 30);
      return p.precoFinal === 105 && p.economizado === 45;
    })()
  `);
  ok(res221, "221. calcularPrecoDinamicoItemPromocao aplicou desconto");

  // 222. Roda da fortuna diria do Prumi
  const res222 = ev(`
    (() => {
      const giro1 = gerarRodaDaFortunaDiaria(false, 0.4);
      const giro2 = gerarRodaDaFortunaDiaria(true);
      return giro1.podeGirar === true && giro1.premio.valor > 0 && giro2.podeGirar === false;
    })()
  `);
  ok(res222, "222. gerarRodaDaFortunaDiaria concedeu giro nico e recompensa");

  // 223. Multiplicador combo de tarefas completadas em sequncia
  const res223 = ev(`
    (() => {
      const c1 = calcularMultiplicadorComboTarefas(1);
      const c4 = calcularMultiplicadorComboTarefas(4);
      return c1.multiplicador === 1 && c4.multiplicador === 1.3 && c4.bonusGotas === 6;
    })()
  `);
  ok(res223, "223. calcularMultiplicadorComboTarefas bonificou streak contnuo");

  // 224. Histrico e extrato transparente de transaes de gotas
  const res224 = ev(`
    (() => {
      const trans = [
        { tipo: "ganho", valor: 50 },
        { tipo: "gasto", valor: 30 },
        { tipo: "ganho", valor: 20 }
      ];
      const saldo = gerarHistoricoTransacoesGotas(trans);
      return saldo.totalGanho === 70 && saldo.totalGasto === 30 && saldo.saldoFinal === 40;
    })()
  `);
  ok(res224, "224. gerarHistoricoTransacoesGotas consolidou fluxo financeiro ldico");

  // 225. Elegibilidade de itens lendrios
  const res225 = ev(`
    (() => {
      const apto = verificarElegibilidadeItemLendario(15, 600, 35);
      const inapto = verificarElegibilidadeItemLendario(5, 100, 10);
      return apto.elegivel === true && inapto.elegivel === false && inapto.pendencias.length === 3;
    })()
  `);
  ok(res225, "225. verificarElegibilidadeItemLendario avaliou requisitos de desbloqueio");

  // 226. Ba semanal com recompensas por consistncia
  const res226 = ev(`
    (() => {
      const b7 = gerarBauRecompensasSemanal(7);
      const b3 = gerarBauRecompensasSemanal(3);
      return b7.disponivel === true && b7.gotasBonus === 100 && b3.disponivel === false;
    })()
  `);
  ok(res226, "226. gerarBauRecompensasSemanal premiou semana completa");

  // 227. Progressividade de custo para mundos superiores
  const res227 = ev(`
    (() => {
      const m1 = calcularCustoDesbloqueioMundo(1, 200);
      const m3 = calcularCustoDesbloqueioMundo(3, 200);
      return m1.custo === 200 && m3.custo === 450 && m3.nivelMinimo === 9;
    })()
  `);
  ok(res227, "227. calcularCustoDesbloqueioMundo escalonou custo e nvel necessrio");

  // 228. Card de colecionador com efeito visual por raridade
  const res228 = ev(`
    (() => {
      const c = gerarCardColecionadorRaridade({ id: "coroa", raridade: "lendario" });
      return c.raridade === "lendario" && c.brilhoBorda.includes("ouro");
    })()
  `);
  ok(res228, "228. gerarCardColecionadorRaridade definiu estilizao colecionvel");

  // 229. Nvel de maestria do Prumi
  const res229 = ev(`
    (() => {
      const m = calcularNivelMaestriaPersonalidade(250);
      return (
        m.nivel === 3 &&
        (m.titulo === "Sábio" || m.titulo === "Sbio") &&
        m.progressoProximo === 50
      );
    })()
  `);
  ok(res229, "229. calcularNivelMaestriaPersonalidade computou progresso de personalidade");

  // 230. Insgnia comemorativa de eventos temticos
  const res230 = ev(`
    (() => {
      const ins = gerarInsigniaComemorativaEvento("Festival de Vero", true);
      return ins.obtido === true && ins.evento === "Festival de Vero";
    })()
  `);
  ok(res230, "230. gerarInsigniaComemorativaEvento gerou badge de evento sazonal");

  await fechar();
  return erros;
};
