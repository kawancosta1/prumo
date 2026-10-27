// Testes Bruxo: Lote 6 (Itens 51 a 60)
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

  // 51. Foco apurar poção
  const foco = ev("apurarPocaoFocoHTML('20:00')");
  ok(foco.includes("Apurando a Poção") && foco.includes("20:00"), "51. Foco apurar a poção renderizado");

  // 52. Matérias viram ervas do grimório
  const ervaCalc = ev("materiaErvaBruxo('Cálculo I')");
  const ervaBio = ev("materiaErvaBruxo('Biologia')");
  ok(ervaCalc && ervaCalc.erva.includes("Alecrim"), "52. Cálculo associado a Alecrim da Lógica");
  ok(ervaBio && ervaBio.erva.includes("Arruda"), "52. Biologia associada a Arruda da Vida");

  // 53. Prova vira noite de lua cheia
  const provaHtml = ev("provaNoiteLuaCheiaHTML({ title: 'Prova de Feitiçaria', date: addDays(today(), 4) })");
  ok(
    provaHtml.includes("Noite de Lua Cheia") && provaHtml.includes("4 dias"),
    "53. Prova convertida em ritual de lua cheia"
  );

  // 54. Revisão espaçada regar a planta
  const revTexto = ev("textoRevisaoEspacadaBruxo()");
  ok(revTexto.includes("Regar o canteiro"), "54. Revisão espaçada adaptada para regar a planta");

  // 55. Meta de leitura no Livro das Sombras
  const leitTexto = ev("textoMetaLeituraBruxo(15, 30)");
  ok(
    leitTexto.includes("Livro das Sombras") && leitTexto.includes("15 / 30"),
    "55. Meta de leitura adaptada para o Livro das Sombras"
  );

  // 56. Mais falas novas com gato e sapo
  ok(ev("PERSONAS.bruxo.hi.length >= 9"), "56. Falas de boas-vindas expandidas com gato e sapo");
  ok(ev("PERSONAS.bruxo.cheers.length >= 14"), "56. Falas de comemoração expandidas com gato e sapo");

  // 57. Humores por tema (Caldeirão vs Ervas)
  const humorCald = ev("humorPorTemaBruxo('caldeirao', 'radiant')");
  const humorErva = ev("humorPorTemaBruxo('ervas', 'radiant')");
  ok(humorCald && humorCald.includes("Ebulição"), "57. Humor customizado para Caldeirão tóxico");
  ok(humorErva && humorErva.includes("Flor de lótus"), "57. Humor customizado para Jardim de ervas");

  // 58. Evento de Halloween
  ok(
    ev("eventoHalloweenBruxoAtivo('2026-10-31')") === true,
    "58. Evento de Halloween ativo em 31 de outubro"
  );
  ok(ev("eventoHalloweenBruxoAtivo('2026-06-15')") === false, "58. Evento de Halloween inativo em junho");

  // 59. Sexta-feira 13
  ok(ev("ehSextaFeira13Bruxo('2026-11-13')") === true, "59. Sexta-feira 13 detectada com precisão");

  // 60. Opção de efeitos suaves / desligar cursor
  ev("alternarEfeitosBruxoSuave()");
  ok(D.documentElement.hasAttribute("data-bruxo-suave"), "60. Atributo data-bruxo-suave ativo no modo suave");

  fechar();
  return erros;
};
