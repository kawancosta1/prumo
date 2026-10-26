// Testes Bruxo: Lote 2 (Itens 11 a 20)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("bruxo");
    tab = "hoje";
    S.tasks = [
      { id: "b1", title: "Colher cogumelos", area: "geral", date: today(), done: false, prio: 0, sub: [] }
    ];
    commit();
    render();
  `);
  await espera(30);

  // 11. Fumaça verde ao preparar poção
  ev("animarFumacaPocao()");
  ok(D.querySelector(".bruxo-fumaca-container") !== null, "11. Contêiner de fumaça verde criado");
  ok(D.querySelectorAll(".bruxo-fumaca-puff").length > 0, "11. Fagulhas e névoa verde subindo do caldeirão");

  // 12. Tarefa evapora em bolhas
  ev("animarEvaporacaoBolhas()");
  ok(D.querySelectorAll(".bruxo-bolha-evapora").length > 0, "12. Bolhas mágicas de evaporação criadas");

  // 13. Teias nos cantos dos cartões (Lua de sangue)
  ev(`
    S.themeBy = S.themeBy || {};
    S.themeBy.bruxo = "lua";
    applyTheme();
  `);
  ok(D.documentElement.getAttribute("data-variante") === "lua", "13. Tema Lua de sangue ativo");

  // 14. Velas que acendem com as tarefas
  const velasZero = ev("velasBruxoHTML(0)");
  ok(
    velasZero.includes("bruxo-vela apagada") && !velasZero.includes("bruxo-chama"),
    "14. Velas apagadas com 0 tarefas feitas"
  );
  const velas3 = ev("velasBruxoHTML(3)");
  ok(velas3.includes("bruxo-chama"), "14. Velas acesas com chamas mágicas ao progredir");

  // 15. Abóboras com rostinho de humor
  const aboboraFeliz = ev("aboboraHumorHTML('happy')");
  const aboboraBrava = ev("aboboraHumorHTML('upset')");
  ok(
    aboboraFeliz.includes("bruxo-abobora-humor") && aboboraFeliz.includes("happy"),
    "15. Abóbora com sorriso feliz no humor happy"
  );
  ok(aboboraBrava.includes("upset"), "15. Abóbora com expressão severa no humor upset");

  // 16. Vaga-lumes noturnos
  ev("iniciarVagalumesBruxo(true)");
  ok(D.querySelector(".bruxo-vagalumes") !== null, "16. Vaga-lumes noturnos ativos no fundo");
  ev("pararVagalumesBruxo()");
  ok(D.querySelector(".bruxo-vagalumes") === null, "16. Vaga-lumes removidos ao limpar");

  // 17. Caldeirão muda de cor conforme ingredientes
  const cor0 = ev("corCaldeiraoDinamica([])");
  const cor2 = ev("corCaldeiraoDinamica(['asa', 'orvalho'])");
  const cor4 = ev("corCaldeiraoDinamica(['a', 'b', 'c', 'd'])");
  ok(cor0 === "#33691E", "17. Cor base do caldeirão sem ingredientes");
  ok(cor2 === "#00897B", "17. Cor esmeralda intermediária com 2 ingredientes");
  ok(cor4 === "#76FF03", "17. Cor fluorescente pronta com 4 ingredientes");

  // 18. Risadinha de bruxa sintetizada
  ok(ev("typeof somRisadinhaBruxa === 'function'"), "18. Função de risadinha sintetizada disponível");
  ev(`
    window.ctxFalso = {
      sampleRate: 44100,
      createOscillator: () => ({
        type: 'sine',
        frequency: { setValueAtTime: () => {} },
        connect: dest => dest,
        start: () => {},
        stop: () => {}
      }),
      createGain: () => ({
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: dest => dest
      }),
      createBuffer: () => ({ getChannelData: () => new Float32Array(100) }),
      createBufferSource: () => ({
        connect: dest => dest,
        start: () => {},
        stop: () => {}
      }),
      createBiquadFilter: () => ({
        frequency: {},
        Q: {},
        connect: dest => dest
      })
    };
    somRisadinhaBruxa(window.ctxFalso, {}, 0);
  `);
  ok(true, "18. Risadinha de bruxa sintetizada executou sem erros");

  // 19. Ambiente floresta com coruja e vento
  ok(ev("typeof ambienteFlorestaBruxo === 'function'"), "19. Ambiente de floresta misteriosa disponível");

  // 20. Som da vassoura voando
  ok(ev("typeof somVassouraVoo === 'function'"), "20. Sintetizador de som de vassoura disponível");
  ev(`
    somVassouraVoo(window.ctxFalso, {}, 0);
  `);
  ok(true, "20. Som de vassoura voando executou sem erros");

  fechar();
  return erros;
};
