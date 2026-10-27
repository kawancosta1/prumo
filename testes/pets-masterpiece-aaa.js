// Testes da Masterpiece de Animacao Triple-AAA para os Pets
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar disponibilidade das funcoes
    const funcoesDisponiveis = ev(`
      typeof inicializarPetsMasterpieceAAA === "function" &&
      typeof gerarPoeiraPasso === "function" &&
      typeof ativarModoExtase === "function"
    `);
    ok(funcoesDisponiveis, "Funções da Masterpiece de animação AAA disponíveis globalmente");

    // 2. Testar emissão de nuvem de poeira de passo
    ev(`gerarPoeiraPasso(150, 400, -1)`);
    const poeiraGerada = ev(`Boolean(document.querySelector(".poeira-passo-solo"))`);
    ok(poeiraGerada, "Nuvem de poeira de solo de passo gerada com sucesso no DOM");

    // 3. Testar modo êxtase de carinho
    ev(`
      (() => {
        const container = document.createElement("div");
        container.id = "fake-pet-extase";
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.className.baseVal = "pet-svg";
        container.appendChild(svg);
        document.body.appendChild(container);
        ativarModoExtase(container);
      })()
    `);
    const extaseAtivado = ev(`
      Boolean(document.querySelector("#fake-pet-extase .pet-extase-carinho"))
    `);
    ok(extaseAtivado, "Modo Êxtase e aura luminosa aplicados com sucesso ao mascote");

    // 4. Limpeza
    ev(`
      const f = document.getElementById("fake-pet-extase");
      if (f) f.remove();
      document.querySelectorAll(".poeira-passo-solo").forEach(p => p.remove());
    `);

  } finally {
    fechar();
  }
  return erros;
};
