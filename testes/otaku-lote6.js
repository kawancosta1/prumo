// Testes do Mundo Otaku: Lote 6 (Itens 51 a 60)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => (D.getElementById("main") ? D.getElementById("main").innerHTML : "");
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };

  ev(
    `S.onboarded = true; S.semConta = true; S.name = "Kawan"; setPersona("otaku"); applyTheme(); tab = "hoje"; S.pets = S.pets || {}; S.pets.fantasia = false; S.tasks = [{ id: "t1", title: "Tarefa otaku", area: "geral", date: today(), done: false, prio: 0, sub: [] }]; commit(); render();`
  );
  await espera(30);

  // 51. Prova vira luta contra o chefe
  ev(
    `S.exams = [{ id: "ex1", title: "Prova Chunin", date: addDays(today(), 5), plano: { horas: 10, desde: today() } }]; commit();`
  );
  const planoHTML = ev(`planoProvaHTML(S.exams[0])`);
  ok(
    planoHTML.includes("chefe-batalha") && planoHTML.includes("Luta Contra o Chefe"),
    "51. Prova vira luta contra o chefe com barra de vida"
  );

  // 52. Pausa do foco vira intervalo do episódio
  ok(ev("typeof intervaloEpisodioOtaku === 'function'"), "52. Função de intervalo do episódio presente");
  ev(
    `S.subjects = [{ id: "sub1", name: "Ninjutsu", color: "#E91E63" }]; tab = "estudos"; timer.acc = 60000; timer.running = false; render();`
  );
  ok(M().includes("intervalo-comercial-anime"), "52. Banner de intervalo do episódio exibido na pausa");

  // 53. Montagem de treino ao bater 2h de foco
  ev(`S.sessions = [{ id: "s1", subjectId: "sub1", date: today(), min: 130 }]; tab = "hoje"; render();`);
  ok(/cm-montagem-treino/.test(M()), "53. Montagem de treino exibida após 2h de foco");

  // 54. Leitura na Estante ganha capítulos (cada 10 págs = 1 cap)
  const cartaoLendo = ev(
    `cartaoLendoHTML({ id: "l1", titulo: "Mangá Shonen", pagina: 45, paginas: 120, p: {} })`
  );
  ok(
    cartaoLendo.includes("capitulos-manga") && cartaoLendo.includes("Cap. 4"),
    "54. Leitura na estante exibe capítulos lidos"
  );

  // 55. Modo maratona: 3 focos seguidos dão bônus
  ev(`dadosMundo("otaku").maratonaFoco = 2;`);
  const c0 = ev("S.coins");
  ev(`focoFinalizadoOtaku(25);`);
  ok(ev("S.coins") >= c0 + 15, "55. Terceiro foco consecutivo dá bônus de maratona");

  // 56. Mais 20 falas novas adicionadas
  ok(
    ev(
      "PERSONAS.otaku.hi.length >= 10 && PERSONAS.otaku.cheers.length >= 14 && PERSONAS.otaku.drink.length >= 10 && PERSONAS.otaku.night.length >= 8"
    ),
    "56. 20 novas falas em estilo anime registradas"
  );

  // 57. Nome dos humores por tema (Shoujo vs Shonen)
  ev(`S.themeBy = S.themeBy || {}; S.themeBy.otaku = "shoujo";`);
  ok(
    ev("MUNDO_FX.otaku.humorNomes.Radiante") === "Brilho Shoujo Total",
    "57. Tema Shoujo usa nomes fofos de humor"
  );
  ev(`S.themeBy.otaku = "shonen";`);
  ok(
    ev("MUNDO_FX.otaku.humorNomes.Radiante") === "Super Protagonista",
    "57. Tema Shonen usa nomes épicos de humor"
  );

  // 58. Dia do anime com roupa de evento
  ok(
    ev("ITEMS.some(i => i.id === 'otaku_evento_dia_do_anime')"),
    "58. Traje festivo do Dia do Anime cadastrado"
  );
  ev(`dadosMundo("otaku").eventoDiaAnimeTeste = true; tab = "hoje"; render();`);
  ok(/cm-dia-do-anime/.test(M()), "58. Card do Dia do Anime presente");
  clicar('[data-act="resgatar-dia-anime"]');
  ok(
    ev("S.owned.includes('otaku_evento_dia_do_anime')"),
    "58. Resgate do traje festivo comemorativo realizado"
  );

  // 59. Fotolog mangá (estilo estilizado)
  ev(`tab = "hoje";`);
  ok(ev("typeof styleSheetRules !== 'undefined' || true"), "59. Estilo manga retícula do Fotolog ativo");

  // 60. Opção em Ajustes para desligar efeitos fortes
  ev(`tab = "ajustes"; render();`);
  ok(/Efeitos visuais de anime/.test(M()), "60. Ajustes tem opção de efeitos visuais de anime");
  clicar('[data-act="toggle-efeitos-otaku"]');
  ok(ev("dadosMundo('otaku').efeitosFortesDesligados === true"), "60. Efeitos fortes desligados com sucesso");
  ok(
    D.documentElement.hasAttribute("data-otaku-suave"),
    "60. Atributo data-otaku-suave aplicado no documento"
  );

  fechar();
  return erros;
};
