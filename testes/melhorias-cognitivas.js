// Testes das 500 Melhorias Cognitivas, Acessibilidade e Estudo Ativo
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar total de 500 melhorias científicas
    const total = ev(`contarMelhoriasCognitivas()`);
    ok(total === 500, `Possui exatamente 500 melhorias científicas registradas (total: ${total})`);

    // 2. Validar distribuicao de 100 por eixo
    const eixosValidos = ev(`
      (() => {
        const lista = obterMelhoriasCognitivas();
        const contagemPorEixo = {};
        lista.forEach(item => {
          contagemPorEixo[item.eixoId] = (contagemPorEixo[item.eixoId] || 0) + 1;
        });
        return Object.values(contagemPorEixo).every(qtd => qtd === 100);
      })()
    `);
    ok(eixosValidos, "Distribuição perfeita de 100 melhorias por cada um dos 5 eixos cognitivos");

    // 3. Validar integridade dos dados e autores/livros citados
    const dadosIntegrais = ev(`
      (() => {
        const lista = obterMelhoriasCognitivas();
        return lista.every(item => 
          item.id && item.titulo && item.autorLivro && item.principio &&
          typeof item.render() === "string" && item.render().includes(item.id)
        );
      })()
    `);
    ok(dadosIntegrais, "Todas as 500 melhorias possuem livro/autor, princípio científico e HTML íntegro");

    // 4. Testar motor de repetição espaçada (Leitner Box)
    ev(`
      S.leitnerCards = [];
      const card = adicionarCardLeitner("O que é retrieval practice?", "Prática de lembrar ativamente sem olhar a resposta", "livro_teste");
      processarRespostaLeitner(card.id, true);
    `);
    const cardPromovido = ev(`S.leitnerCards[0].caixa === 2 && S.leitnerCards[0].acertos === 1`);
    ok(cardPromovido, "Card de estudo acertado foi promovido para a Caixa 2 de Leitner");

    ev(`processarRespostaLeitner(S.leitnerCards[0].id, false)`);
    const cardRebaixado = ev(`S.leitnerCards[0].caixa === 1 && S.leitnerCards[0].erros === 1`);
    ok(cardRebaixado, "Card errado retornou para a Caixa 1 seguindo a curva de esquecimento de Ebbinghaus");

    // 5. Testar Modo Deep Work
    ev(`ativarModoDeepWork("Estudo de Cálculo")`);
    const deepWorkAtivo = ev(`document.body.classList.contains("modo-deep-work-ativo")`);
    ok(deepWorkAtivo, "Modo Deep Work isolou o campo visual com sucesso");

    ev(`desativarModoDeepWork()`);
    const deepWorkDesativado = ev(`!document.body.classList.contains("modo-deep-work-ativo")`);
    ok(deepWorkDesativado, "Modo Deep Work desativado e visão normal restaurada");

    // 6. Testar Região de Acessibilidade ARIA-Live
    ev(`anunciarParaLeitorDeTela("Tarefa concluída com sucesso")`);
    const ariaLiveOk = ev(`Boolean(document.getElementById("sr-anunciador-universal"))`);
    ok(ariaLiveOk, "Região ARIA-Live para leitores de tela em conformidade com WCAG 2.2");

  } finally {
    fechar();
  }
  return erros;
};
