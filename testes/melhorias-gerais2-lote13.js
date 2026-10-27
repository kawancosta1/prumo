// Testes Novas Melhorias Gerais: Lote 13 (Itens 121 a 130)
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

  // 121. Gerador de código alfanumérico amigável para pareamento de dupla
  const res121 = ev(`
    (() => {
      const cod = gerarCodigoPareamentoDupla("usuario123");
      return typeof cod === "string" && cod.length === 6 && /^[A-Z0-9]{6}$/.test(cod);
    })()
  `);
  ok(res121, "121. gerarCodigoPareamentoDupla gerou PIN de 6 dígitos seguro e amigável");

  // 122. Contador de dias de relacionamento ou parceria
  const res122 = ev(`
    (() => {
      const dias = calcularDiasJuntosParceria("2026-10-17", "2026-10-27");
      return dias === 10;
    })()
  `);
  ok(res122, "122. calcularDiasJuntosParceria calculou tempo conjunto de relacionamento");

  // 123. Mensagem afetuosa estruturada de pombo-correio (nudge)
  const res123 = ev(`
    (() => {
      const m = gerarMensagemPomboCorreio("Amor", "Te amo!");
      return m.de === "Amor" && m.mensagem === "Te amo!" && m.lido === false;
    })()
  `);
  ok(res123, "123. gerarMensagemPomboCorreio empacotou bilhetinho afetuoso");

  // 124. Meta compartilhada e somada da dupla
  const res124 = ev(`
    (() => {
      const r = calcularMetaCompartilhadaDupla(2500, 3500, 6000);
      return r.soma === 6000 && r.porcentagem === 100 && r.batida === true;
    })()
  `);
  ok(res124, "124. calcularMetaCompartilhadaDupla unificou progresso conjunto da dupla");

  // 125. Formatação do mural de recados da dupla com ordenação
  const res125 = ev(`
    (() => {
      const recados = [
        { id: 1, enviadoEm: "2026-10-26T10:00:00Z" },
        { id: 2, enviadoEm: "2026-10-27T10:00:00Z" }
      ];
      const ord = formatarMuralRecadosParceria(recados);
      return ord[0].id === 2;
    })()
  `);
  ok(res125, "125. formatarMuralRecadosParceria ordenou bilhetes do mais recente ao antigo");

  // 126. Lista compartilhada de desejos (Wishlist de passeios/filmes)
  const res126 = ev(`
    (() => {
      const w = gerarWishlistCompartilhada([{ titulo: "Ver aurora boreal" }]);
      return w.length === 1 && w[0].titulo.includes("aurora") && w[0].feito === false;
    })()
  `);
  ok(res126, "126. gerarWishlistCompartilhada estruturou metas de passeios em conjunto");

  // 127. Ocultação de tarefas privadas no compartilhamento de dupla
  const res127 = ev(`
    (() => {
      const tPrivada = { title: "Surpresa de aniversário #privado" };
      const tPublica = { title: "Comprar ração do cachorro" };
      const vPriv = verificarPrivacidadeTarefa(tPrivada, true);
      const vPub = verificarPrivacidadeTarefa(tPublica, true);
      return vPriv === false && vPub === true;
    })()
  `);
  ok(res127, "127. verificarPrivacidadeTarefa escondeu tarefas marcadas como privadas");

  // 128. Poses e animações interativas para dois mascotes juntos
  const res128 = ev(`
    (() => {
      const p = obterAnimacaoInteracaoDuplaPrumi("abraco");
      return p.classe === "prumi-dupla-abraco" && typeof p.fala === "string";
    })()
  `);
  ok(res128, "128. obterAnimacaoInteracaoDuplaPrumi definiu pose conjunta de abraço");

  // 129. Criação de presente virtual para o mascote do parceiro
  const res129 = ev(`
    (() => {
      const g = gerarPresenteVirtualDupla("chapeu_bruxo", "Kawan", "Com carinho!");
      return g.itemId === "chapeu_bruxo" && g.de === "Kawan";
    })()
  `);
  ok(res129, "129. gerarPresenteVirtualDupla empacotou presente com dedicatória");

  // 130. Placar saudável e amigável de dedicação de foco
  const res130 = ev(`
    (() => {
      const placar = calcularPlacarAmigavelFoco(120, 90);
      return placar.lideranca === "pessoa1" && placar.totalHoras === 3.5;
    })()
  `);
  ok(res130, "130. calcularPlacarAmigavelFoco computou comparativo positivo de foco");

  await fechar();
  return erros;
};
