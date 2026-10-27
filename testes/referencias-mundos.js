// Testes das Top 20 Referencias Culturais dos Mundos (20 x 16+)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    const mundosPrincipais = [
      "zen", "rock", "emo", "otaku", "gamer", "programador",
      "bruxo", "feiticeiro", "cleanboy", "coach", "forrozeiro",
      "funkeiro", "pagodeiro", "rapper", "sertanejo", "vovo"
    ];

    // Verificar as 16 personalidades principais
    for (const m of mundosPrincipais) {
      const lista = ev(`obterReferenciasDoMundo("${m}")`);
      ok(Array.isArray(lista) && lista.length === 20, `${m}: possui exatamente as top 20 referências culturais cadastradas (total: ${lista ? lista.length : 0})`);

      const dadosCompletos = ev(`
        (() => {
          const refs = obterReferenciasDoMundo("${m}");
          return refs.every(r => 
            r.titulo && r.autor && r.categoria && r.descricao && r.citacao && r.icone &&
            !r.titulo.includes("undefined") && !r.citacao.includes("undefined")
          );
        })()
      `);
      ok(dadosCompletos, `${m}: todas as 20 referências têm título, autor, categoria, descrição, citação e ícone válidos`);

      // Testar card render
      const cardHtml = ev(`gerarCardReferencia(obterReferenciaAleatoria("${m}"))`);
      ok(typeof cardHtml === "string" && cardHtml.includes("card-referencia-mundo") && cardHtml.includes("card-ref-citacao"), `${m}: gera card HTML com estrutura e aspas estilizadas`);

      // Testar galeria completa
      const galeriaHtml = ev(`renderizarGaleriaReferencias("${m}")`);
      ok(typeof galeriaHtml === "string" && galeriaHtml.includes("grid-referencias-mundo"), `${m}: renderiza galeria completa em grid responsivo`);
    }

    // Verificar contagem global cobrindo as 17 personalidades
    const totalGeral = ev(`contarReferenciasMundos()`);
    ok(totalGeral >= 320, `Contagem total de referências atinge ou supera 320 referências (obtido: ${totalGeral})`);
  } finally {
    fechar();
  }
  return erros;
};
