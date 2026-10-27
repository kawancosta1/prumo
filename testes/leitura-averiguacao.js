// Testes do Sistema de Averiguacao Divertida da Leitura com o Pet e Estante
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar cartas de desafio
    const totalCartas = ev(`CARTAS_DESAFIO_LEITURA.length`);
    ok(totalCartas === 4, `Possui 4 cartas lúdicas de desafio cadastradas (total: ${totalCartas})`);

    const cartasCompletas = ev(`
      CARTAS_DESAFIO_LEITURA.every(c => c.id && c.icone && c.titulo && c.placeholder)
    `);
    ok(cartasCompletas, "Todas as cartas possuem id, ícone, título e placeholder");

    // 2. Validar humores
    const totalHumores = ev(`HUMORES_LIVRO.length`);
    ok(totalHumores === 5, `Possui 5 humores de leitura cadastrados (total: ${totalHumores})`);

    // 3. Simular averiguação de leitura no estado
    ev(`
      S.pet = { nome: "Pruminho", tipo: "gato", fome: 60, felicidade: 40, xp: 10 };
      S.coins = 50;
      salvarAveriguacaoNoEstado({
        livroId: "livro_teste_123",
        cartaId: "conselho_autor",
        humorId: "mindblown",
        resposta: "Foque no essencial e elimine o ruído!",
        data: new Date().toISOString()
      });
    `);

    const gravouAverig = ev(`Boolean(S.averiguacoes && S.averiguacoes["livro_teste_123"])`);
    ok(gravouAverig, "Averiguação salva com sucesso em S.averiguacoes");

    const petBeneficiado = ev(`S.pet.fome < 60 && S.pet.felicidade > 40 && S.pet.xp > 10`);
    ok(petBeneficiado, "Mascote foi alimentado, ganhou felicidade e XP com a leitura averiguada");

    const ganhouGotas = ev(`S.coins > 50`);
    ok(ganhouGotas, "Usuário recebeu gotas de recompensa pela averiguação concluída");

    // 4. Testar renderização do selo e figurinha da estante
    const seloHtml = ev(`renderizarSeloEstante("livro_teste_123")`);
    ok(
      typeof seloHtml === "string" && seloHtml.includes("selo-carimbo-verificado") && seloHtml.includes("figurinha-estante-colecao"),
      "Gera selo carimbado e figurinha colecionável para a estante"
    );

    // 5. Testar desafio relâmpago do pet
    const desafio = ev(`lancarDesafioRelampagoPet()`);
    ok(desafio && desafio.titulo && desafio.respostaOculta === "Foque no essencial e elimine o ruído!", "Pet consegue lançar desafio surpresa sobre o livro lido");

  } finally {
    fechar();
  }
  return erros;
};
