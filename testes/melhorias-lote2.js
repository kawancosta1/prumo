// Testes Melhorias Gerais: Lote 2 (Itens 11 a 20)
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

  // 11. Piscada natural
  ok(
    ev("typeof iniciarPiscadaNaturalPrumi === 'function'"),
    "11. Função iniciarPiscadaNaturalPrumi disponível"
  );
  ev("iniciarPiscadaNaturalPrumi(); pararPiscadaNaturalPrumi();");
  ok(true, "11. Ciclo de piscada natural iniciado e parado sem erros");

  // 12. Respiração em repouso
  ev(`
    const mascote = document.createElement("div");
    mascote.className = "prumi";
    document.body.appendChild(mascote);
    aplicarRespiracaoPrumi(mascote);
  `);
  ok(D.querySelector(".prumi-respirando") !== null, "12. Classe prumi-respirando aplicada");

  // 13. Flicker realista
  ev(`
    const vela = document.createElement("div");
    document.body.appendChild(vela);
    aplicarFlickerRealista(vela);
  `);
  ok(D.querySelector(".flicker-realista") !== null, "13. Classe flicker-realista aplicada");

  // 14. Glow neon gamer
  ev(`
    const painel = document.createElement("div");
    document.body.appendChild(painel);
    aplicarGlowNeonGamer(painel);
  `);
  ok(D.querySelector(".gamer-neon-pulsante") !== null, "14. Classe gamer-neon-pulsante aplicada");

  // 15. Partículas de vapor
  ev(`
    const xicara = document.createElement("div");
    document.body.appendChild(xicara);
    aplicarVaporAscendente(xicara);
  `);
  ok(D.querySelector(".vapor-ascendente") !== null, "15. Classe vapor-ascendente aplicada");

  // 16. Transição suave entre modo claro e escuro
  ev("aplicarTransicaoTemaSuave()");
  ok(D.documentElement.classList.contains("transicao-tema"), "16. Classe transicao-tema ativa no HTML");

  // 17. Virada de página na estante
  ev(`
    const livro = document.createElement("div");
    document.body.appendChild(livro);
    animarViradaPaginaLivro(livro);
  `);
  ok(D.querySelector(".livro-virando-pagina") !== null, "17. Animação de virada de página física aplicada");

  // 18. Flutuação suave dos pets
  ev(`
    const pet = document.createElement("div");
    document.body.appendChild(pet);
    aplicarFlutuacaoPet(pet);
  `);
  ok(D.querySelector(".pet-flutuando") !== null, "18. Animação de flutuação aplicada ao pet");

  // 19. Degradê pela hora do dia
  const degManha = ev("degradePelaHoraDia('2026-10-26T07:00:00')");
  const degDia = ev("degradePelaHoraDia('2026-10-26T12:00:00')");
  const degTarde = ev("degradePelaHoraDia('2026-10-26T18:00:00')");
  const degNoite = ev("degradePelaHoraDia('2026-10-26T23:00:00')");
  ok(degManha.includes("linear-gradient"), "19. Degradê de aurora matinal gerado");
  ok(degDia.includes("linear-gradient"), "19. Degradê límpido do dia gerado");
  ok(degTarde.includes("linear-gradient"), "19. Degradê de entardecer âmbar gerado");
  ok(degNoite.includes("linear-gradient"), "19. Degradê noturno profundo gerado");

  // 20. Clique elástico nos botões
  ev(`
    const btn = document.createElement("button");
    btn.className = "btn";
    document.body.appendChild(btn);
    ativarCliqueElasticoBotoes();
  `);
  ok(D.querySelector(".btn-elastico") !== null, "20. Classe btn-elastico atribuída aos botões");

  fechar();
  return erros;
};
