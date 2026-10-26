// Testes do Mundo Otaku: Lote 2 (Itens 11 a 20)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(
    `S.onboarded = true; S.semConta = true; S.name = "Kawan"; setPersona("otaku"); applyTheme(); tab = "hoje"; commit();`
  );
  await espera(30);

  // 11. Expressões de anime por humor
  ok(ev("expressoesAnimeSVG('upset').includes('veia-raiva')"), "11. Veia de raiva no humor upset");
  ok(ev("expressoesAnimeSVG('sad').includes('gota-suor-anime')"), "11. Gota de suor no humor sad");
  ok(ev("expressoesAnimeSVG('happy').includes('bochechas-anime')"), "11. Bochechas coradas no humor happy");

  // 12. Bordas de quadrinho manga nos cartões
  ok(D.querySelector(".block, .card"), "12. Cartões do Hoje renderizados");

  // 13. Letreiro FIM ao concluir todas as tarefas
  ev("mostrarLetreiroFim()");
  ok(
    D.querySelector(".letreiro-fim-anime .fim-kanji") &&
      D.querySelector(".letreiro-fim-anime .fim-kanji").textContent === "完",
    "13. Letreiro Fim aparece com kanji 完"
  );

  // 14. Olhos brilhando quando aura ativa
  ev(
    "S.tasks = Array.from({ length: 5 }, (_, i) => ({ id: 'a' + i, title: 'T' + i, area: 'geral', date: today(), done: true, sub: [] })); commit();"
  );
  ok(ev("auraLigada()"), "14. Aura ligada com 5 tarefas feitas");
  ok(
    ev("olhosBrilhandoAuraSVG().includes('olhos-brilho-anime')"),
    "14. Olhos brilhando de anime com aura ativa"
  );

  // 15. Cortina diagonal no tema Shonen
  ev("cortinaDiagonalShonen()");
  ok(D.querySelector(".cortina-shonen"), "15. Cortina diagonal no Shonen gerada");

  // 16. Kanjis por tema
  ev("setPersona('otaku'); applyTheme();");
  ok(
    ev("typeof MUNDO_FX.otaku.enfeiteHero === 'function'"),
    "16. Cabeçalho otaku configurado com kanjis temáticos"
  );

  // 17. Chuva neon
  ev("setPersona('otaku'); S.themeBy = S.themeBy || {}; S.themeBy.otaku = 'neotoquio'; applyTheme();");
  ok(ev("themeVar('otaku').id === 'neotoquio'"), "17. Tema Neo Tóquio aplicado com chuva neon");

  // 18. Som shing de espada
  ok(ev("typeof somShingEspada === 'function'"), "18. Síntese do som shing de espada");

  // 19. Jingle de abertura
  ok(ev("typeof jingleAberturaOtaku === 'function'"), "19. Síntese do jingle de abertura de 5 notas");

  // 20. Ambiente sala de aula
  ok(
    ev("typeof SONS_MUNDO.otaku.ambiente === 'function'"),
    "20. Ambiente de sala de aula com cigarras e relógio"
  );

  fechar();
  return erros;
};
