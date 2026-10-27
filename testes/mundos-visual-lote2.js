// Testes de 100 melhorias visuais por personalidade: Lote 2 (gamer, programador, bruxo, feiticeiro)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    const mundos = ["gamer", "programador", "bruxo", "feiticeiro"];

    for (const m of mundos) {
      const total = ev(`obterMelhoriasDoMundo("${m}").length`);
      ok(total === 100, `${m}: possui exatamente 100 melhorias visuais cadastradas (total: ${total})`);

      const camadasValidas = ev(`
        (() => {
          const lista = obterMelhoriasDoMundo("${m}");
          const porCamada = {};
          lista.forEach(i => { porCamada[i.camada] = (porCamada[i.camada] || 0) + 1; });
          return Object.values(porCamada).every(count => count === 10);
        })()
      `);
      ok(camadasValidas, `${m}: distribuicao perfeita de 10 itens por camada visual`);

      const renderOk = ev(`
        (() => {
          const lista = obterMelhoriasDoMundo("${m}");
          return lista.every(item => typeof item.render() === "string" && item.render().includes(item.id));
        })()
      `);
      ok(renderOk, `${m}: todos os 100 renderizadores geram HTML integro com data-item-id`);

      ev(`aplicarMelhoriasVisuaisNoDOM("${m}")`);
      const bodyHasAttr = ev(`document.body.getAttribute("data-mundo-visual") === "${m}"`);
      ok(bodyHasAttr, `${m}: ativacao visual aplicada com sucesso no DOM`);
    }
  } finally {
    fechar();
  }
  return erros;
};
