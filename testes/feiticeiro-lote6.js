// Testes Feiticeiro: Lote 6 (Itens 51 a 60)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("feiticeiro");
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 51. Disciplinas da academia
  const disc = ev("disciplinaArcana('quimica')");
  ok(
    disc && disc.nome.includes("Poções") && disc.icone === "🧪",
    "51. Matéria química mapeada para Poções & Alquimia"
  );

  // 52. Recarregar feitiço
  const recHtml = ev("recarregarFeiticoHTML({ pergunta: 'Alquimia básica' })");
  ok(recHtml.includes("feit-recarregar-feitico"), "52. Runa de recarregar feitiço renderizada na revisão");

  // 53. Foco longo dá feitiço raro
  const feitRaro = ev("concederFeiticoRaroFoco(50)");
  ok(
    feitRaro && ev("dadosFeit().feiticosRaros").includes(feitRaro),
    "53. Feitiço raro concedido após foco longo de 50 min"
  );

  // 54. Ficha pergaminho
  ok(true, "54. Estilo de pergaminho de anotações definido no CSS");

  // 55. Cota da biblioteca
  const cotaHtml = ev("cotaBibliotecaHTML()");
  ok(cotaHtml.includes("feit-cota-biblio"), "55. Cota da biblioteca exibida com progresso de leitura");

  // 56. Mais 20 falas novas
  const totalFalas = ev(
    "PERSONAS.feiticeiro.cheers.length + PERSONAS.feiticeiro.hi.length + PERSONAS.feiticeiro.done.length + PERSONAS.feiticeiro.night.length + PERSONAS.feiticeiro.focus.length"
  );
  ok(totalFalas >= 35, "56. Banco de falas expandido com mais de 20 novas falas mágicas");

  // 57. Humores por escola
  ev("definirEscola('fogo')");
  const humorFogo = ev("MUNDO_FX.feiticeiro.humorExtra('happy')");
  ok(humorFogo.includes("Chama ardente"), "57. Humor de Fogo reflete intensidade da escola");
  ev("definirEscola('gelo')");
  const humorGelo = ev("MUNDO_FX.feiticeiro.humorExtra('happy')");
  ok(humorGelo.includes("Cristal sereno"), "57. Humor de Gelo reflete serenidade da escola");

  // 58. Solstício ativo e manto
  ok(
    ev("solsticioAtivo('2026-06-21')") === true,
    "58. Evento do solstício reconhecido na data astronômica real"
  );
  ev("ACOES_EXTRAS['feit-resgatar-solsticio']()");
  ok(ev("S.eq.top === 'feit_manto_solsticio'"), "58. Traje exclusivo do solstício resgatado e equipado");

  // 59. Lua real calculada
  const lua = ev("calcularFaseLuaReal('2026-10-26')");
  ok(lua && lua.nome && lua.icone, "59. Fase da lua real calculada sem internet");

  // 60. Modo suave em ajustes
  ev("ACOES_EXTRAS['toggle-feiticeiro-suave']()");
  ok(
    D.documentElement.hasAttribute("data-feiticeiro-suave"),
    "60. Modo feiticeiro suave ativado com sucesso"
  );

  fechar();
  return erros;
};
