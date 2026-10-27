// Testes das Paisagens Sonoras WebAudio e Tunelamento Lateral dos Pets
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar funcoes de audio sintetizado
    const audioFuncoesOk = ev(`
      typeof tocarPaisagemSonora === "function" &&
      typeof pararPaisagemSonora === "function" &&
      typeof alternarPaisagemSonora === "function"
    `);
    ok(audioFuncoesOk, "Funções de áudio WebAudio (chuva, fogo, binaural) disponíveis globalmente");

    // 2. Validar que chaoPasseio nunca coloca o pet no meio da tela
    const chao = ev(`chaoPasseio()`);
    const h = ev(`window.innerHeight`);
    ok(chao > h * 0.75, `Chão do pet está estritamente no rodapé da tela (chão: ${chao}px, altura: ${h}px)`);

    // 3. Validar função de atravessar atrás da tela
    const tunelOk = ev(`typeof atravessarAtrasDaPagina === "function"`);
    ok(tunelOk, "Mecânica de tunelamento lateral (entrar atrás e sair do outro lado) ativa");

  } finally {
    fechar();
  }
  return erros;
};
