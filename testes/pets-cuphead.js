// Testes de Animacao, Shaders e Interacoes dos Pets estilo Cuphead (1930s)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar presenca dos Shaders SVG no DOM
    const shadersOk = ev(`
      (() => {
        const el = document.getElementById("cuphead-shaders-svg");
        if (!el) return false;
        const temFiltro1 = !!el.querySelector("#cuphead-ink-filter-1");
        const temFiltro2 = !!el.querySelector("#cuphead-ink-filter-2");
        const temHalftone = !!el.querySelector("#cuphead-halftone");
        return temFiltro1 && temFiltro2 && temHalftone;
      })()
    `);
    ok(shadersOk, "Shaders SVG de celuloide e nanquim hand-drawn (feTurbulence) injetados com sucesso");

    // 2. Validar funcoes de interacao e fisica da bolinha
    const funcoesOk = ev(`
      (() => {
        const temBolinha = typeof jogarBolinhaParaPet === "function";
        const temSom = typeof tocarSomCuphead === "function";
        const temEstrelas = typeof soltarEstrelasCuphead === "function";
        return temBolinha && temSom && temEstrelas;
      })()
    `);
    ok(funcoesOk, "Funcoes de fisica da bolinha (jogarBolinhaParaPet), audio vintage e particulas disponiveis");

    // 3. Validar sintese de audio procedural vintage
    const audioOk = ev(`
      (() => {
        try {
          tocarSomCuphead("boing");
          tocarSomCuphead("ragtime-acorde");
          return true;
        } catch (_) {
          return false;
        }
      })()
    `);
    ok(audioOk, "Sintetizador WebAudio de harmônicos ragtime e mola cartoon executa sem erros");
  } finally {
    fechar();
  }
  return erros;
};
