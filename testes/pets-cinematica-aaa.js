// Testes do Motor de Animacao de Pets Nivel Triple-AAA
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar funcoes de inicializacao AAA
    const funcoesDisponiveis = ev(`
      typeof inicializarCinematicaPetsAAA === "function" &&
      typeof gerarParticulasCarinhoAAA === "function" &&
      typeof gerarOndaDeChoqueSolo === "function"
    `);
    ok(funcoesDisponiveis, "Funções do motor de cinemática AAA disponíveis no escopo global");

    // 2. Testar emissão de partículas de carinho
    ev(`gerarParticulasCarinhoAAA(200, 200, 4)`);
    const particulasCriadas = ev(`document.querySelectorAll(".particula-carinho-aaa").length >= 4`);
    ok(particulasCriadas, "Partículas cinemáticas de carinho geradas com física no DOM");

    // 3. Testar onda de choque no solo
    ev(`
      (() => {
        const fakePalco = document.createElement("div");
        fakePalco.id = "fake-palco-pet";
        document.body.appendChild(fakePalco);
        gerarOndaDeChoqueSolo(fakePalco);
      })()
    `);
    const ondaCriada = ev(`Boolean(document.querySelector(".onda-choque-solo-aaa"))`);
    ok(ondaCriada, "Onda de choque elástica no solo gerada com sucesso");

    // 4. Limpeza do elemento fake
    ev(`
      const f = document.getElementById("fake-palco-pet");
      if (f) f.remove();
      document.querySelectorAll(".particula-carinho-aaa").forEach(p => p.remove());
    `);

  } finally {
    fechar();
  }
  return erros;
};
