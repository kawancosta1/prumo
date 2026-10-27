// Testes Melhorias Gerais: Lote 13 (Itens 121 a 130)
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

  // 121. Console interativo de comandos no mundo Programador
  const res121 = ev(`
    (() => {
      const outHelp = executarComandoConsole("help");
      const outPing = executarComandoConsole("ping");
      const outGotas = executarComandoConsole("gotas", { gotas: 42 });
      return outHelp.includes("Comandos disponíveis") &&
        outPing.includes("PONG") &&
        outGotas.includes("42💧");
    })()
  `);
  ok(res121, "121. executarComandoConsole processou comandos de terminal");

  // 122. Jardim zen com pedras empilháveis
  const res122 = ev(`
    (() => {
      const html = jardimZenPedrasHTML(4);
      return html.includes("jardim-zen-pedras") &&
        (html.match(/class="pedra-zen"/g) || []).length === 4;
    })()
  `);
  ok(res122, "122. jardimZenPedrasHTML gerou estrutura com pedras empilhadas");

  // 123. Bateria de dedilhado rápido no mundo Roqueiro
  const res123 = ev(`
    (() => {
      const bumbo = bateriaRockDedilhado("bumbo");
      const caixa = bateriaRockDedilhado("caixa");
      return bumbo !== undefined && caixa !== undefined;
    })()
  `);
  ok(res123, "123. bateriaRockDedilhado sintetizou percussão com precisão");

  // 124. Livro de receitas de chás e bolos no mundo Vovó
  const res124 = ev(`
    (() => {
      const html = receitasVovoHTML("Chá");
      return html.includes("Camomila") && html.includes("Custo:");
    })()
  `);
  ok(res124, "124. receitasVovoHTML listou itens culinários com filtros");

  // 125. Painel de metas SMART e gráficos de linha no mundo Coach
  const res125 = ev(`
    (() => {
      const html = painelCoachMetasHTML([
        { titulo: "Aprender TypeScript", progresso: 75 }
      ]);
      return html.includes("Aprender TypeScript") && html.includes("75%");
    })()
  `);
  ok(res125, "125. painelCoachMetasHTML renderizou barra de progresso de metas");

  // 126. Pista de dança ritmada no mundo Forrozeiro
  const res126 = ev(`
    (() => {
      const html = pistaForroHTML("baião");
      return html.includes("pista-forro") && html.includes("baião");
    })()
  `);
  ok(res126, "126. pistaForroHTML montou passos ritmados no piso de forró");

  // 127. Roda de samba interativa no mundo Pagodeiro
  const res127 = ev(`
    (() => {
      const html = rodaSambaHTML(["cavaquinho", "pandeiro"]);
      return html.includes("Cavaquinho") && html.includes("Pandeiro");
    })()
  `);
  ok(res127, "127. rodaSambaHTML exibiu instrumentos ativos na roda");

  // 128. Paredão de som com equalizador visual no mundo Funkeiro
  const res128 = ev(`
    (() => {
      const html = paredaoFunkHTML([10, 20, 30]);
      return html.includes("paredao-funk") &&
        (html.match(/class="eq-barra"/g) || []).length === 3;
    })()
  `);
  ok(res128, "128. paredaoFunkHTML renderizou barras dinâmicas do paredão");

  // 129. Vitrine de sneakers e correntes no mundo Trapper
  const res129 = ev(`
    (() => {
      const html = vitrineSneakersHTML([
        { id: "s1", nome: "Air Max Prumo" }
      ]);
      return html.includes("vitrine-sneakers") && html.includes("Air Max Prumo");
    })()
  `);
  ok(res129, "129. vitrineSneakersHTML apresentou coleção de streetwear");

  // 130. Rotina de skincare matinal e noturna no mundo Cleanboy
  const res130 = ev(`
    (() => {
      const html = rotinaSkincareHTML("Protetor Solar", true);
      return html.includes("card-skincare") &&
        html.includes("Protetor Solar") &&
        html.includes("✨");
    })()
  `);
  ok(res130, "130. rotinaSkincareHTML formatou checklist de autocuidado diário");

  await fechar();
  return erros;
};
