// Testes Bruxo: Lote 5 (Itens 41 a 50)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("bruxo");
    applyTheme();
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 41. Som de coaxar de sapo
  ok(ev("typeof somCoaxarSapo === 'function'"), "41. Função de som de coaxar do sapo disponível");
  ev(`
    window.ctxFalso = {
      createOscillator: () => ({
        type: 'sawtooth',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: dest => dest,
        start: () => {},
        stop: () => {}
      }),
      createGain: () => ({
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: dest => dest
      })
    };
    somCoaxarSapo(window.ctxFalso, {}, 0);
  `);
  ok(true, "41. Som de coaxar do sapo executou sem erros");

  // 42. Som de miado do gato
  ok(ev("typeof somMiadoGato === 'function'"), "42. Função de som de miado do gato disponível");
  ev(`
    somMiadoGato(window.ctxFalso, {}, 0);
  `);
  ok(true, "42. Som de miado do gato executou sem erros");

  // 43. Conquistas próprias do mundo
  ok(ev("CONQUISTAS_BRUXO.length === 3"), "43. Três conquistas místicas configuradas");
  ev(`
    dadosBruxo().saposDesencantados = 6;
    verificarConquistasBruxo();
  `);
  ok(
    ev("dadosBruxo().conquistas.includes('desencantador_sapos')"),
    "43. Conquista Desencantador da Floresta desbloqueada"
  );

  // 44. Coleção de frascos
  ok(ev("FRASCOS_BRUXO.length === 4"), "44. Coleção com 4 formatos de frascos catalogados");
  ev("desbloquearFrascoBruxo('abobora')");
  ok(ev("dadosBruxo().frascos.includes('abobora')"), "44. Frasco Abóbora de Outono desbloqueado");
  const frascosHtml = ev("colecaoFrascosHTML()");
  ok(frascosHtml.includes("Coleção de Frascos"), "44. HTML da estante de frascos gerado");

  // 45. Roupas lendárias em ITEMS (manto de outono e chapéu com lua de verdade)
  const itens = ev("ITEMS.map(i => i.id)");
  ok(itens.includes("bru_manto_outono"), "45. Roupa lendária bru_manto_outono presente");
  ok(itens.includes("bru_chapeu_lua_real"), "45. Roupa lendária bru_chapeu_lua_real presente");

  // 46. Vassouras colecionáveis
  ok(ev("VASSOURAS_BRUXO.length === 3"), "46. Três modelos de vassouras colecionáveis catalogadas");
  ev("trocarVassouraBruxo('cristal')");
  ok(ev("dadosBruxo().vassouraAtual === 'cristal'"), "46. Vassoura atual alterada para cristal");

  // 47. Troca de ervas raras com amigos
  const trocou = ev("trocarErvaRaraAmigo('Bia', 'Alecrim', 'Lavanda')");
  ok(
    trocou === true && ev("dadosBruxo().trocasErvas.length > 0"),
    "47. Troca de ervas com amigos registrada no coven"
  );

  // 48. Ranking do coven
  const ranking = ev("rankingCovenHTML()");
  ok(ranking.includes("Ranking do Coven da Floresta"), "48. Ranking semanal do coven renderizado");

  // 49. Mimo chá de ervas
  const mimo = ev("mandarMimoChaErvas('Morgana', 'Chá de Hortelã')");
  ok(mimo === true && ev("dadosBruxo().mimosEnviados.length > 0"), "49. Xícara de chá enviada para amiga");

  // 50. Gato preto passeia junto com o pet
  const passeio = ev("gatoPasseiaJuntoPetHTML()");
  ok(passeio.includes("bruxo-gato-pet-passeio"), "50. HTML do gato preto passeando junto ao pet gerado");

  fechar();
  return erros;
};
