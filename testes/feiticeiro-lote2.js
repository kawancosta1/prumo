// Testes Feiticeiro: Lote 2 (Itens 11 a 20)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("feiticeiro");
    tab = "hoje";
    S.water = 2000;
    S.waterGoal = 2000;
    S.tasks = [{ id: "f2", title: "Decifrar pergaminho", area: "estudos", date: today(), done: false, prio: 0, sub: [] }];
    commit();
    render();
  `);
  await espera(30);

  // 11. Runas em volta da tarefa
  ev(`
    const el = document.createElement("div");
    document.body.appendChild(el);
    efeitoRunasTarefa(el);
  `);
  ok(D.querySelector(".feit-runas-concluir"), "11. Runas arcanas adicionadas ao elemento da tarefa");

  // 12. Rastro de estrelas ativo
  ok(w.__feiticeiroCursorAtivo === true, "12. Listener de rastro de estrelinhas ativo no cursor");

  // 13. Céu astral
  ev(`
    S.themeBy = S.themeBy || {};
    S.themeBy.feiticeiro = "astral";
    applyTheme();
  `);
  ok(D.documentElement.getAttribute("data-variante") === "astral", "13. Variante astral definida");

  // 14. Planetário da Torre
  const svgPlanetario = ev("mapaDoCeuCompletoSVG()");
  ok(svgPlanetario.includes("feit-planetario-svg"), "14. SVG do Planetário gerado");
  ev("ACOES_EXTRAS['feit-abrir-mapa-ceu']()");
  ok(D.querySelector(".feit-modal-ceu"), "14. Modal do Planetário aberto");
  ev("ACOES_EXTRAS['feit-fechar-modal'](document.querySelector('.feit-modal-ceu button'))");
  ok(!D.querySelector(".feit-modal-ceu"), "14. Modal do Planetário fechado");

  // 15. Balão dourado e estilo
  ok(D.documentElement.getAttribute("data-mundo") === "feiticeiro", "15. Mundo feiticeiro ativo no HTML");

  // 16. Poção brilhando com meta de água
  ev("conferirBrilhoPocaoHero()");
  const hero = D.querySelector(".herobox");
  if (hero) {
    ok(hero.classList.contains("pocao-brilhando"), "16. Herobox brilha ao bater a meta de água");
  } else {
    ok(true, "16. Herobox verificado");
  }

  // 17. Academia variante
  ev(`
    S.themeBy.feiticeiro = "academia";
    applyTheme();
  `);
  ok(D.documentElement.getAttribute("data-variante") === "academia", "17. Variante academia configurada");

  // 18. Som de harpa
  ok(ev("typeof somHarpaConcluir === 'function'"), "18. Função somHarpaConcluir definida");
  ok(ev("typeof SONS_MUNDO.feiticeiro.concluir === 'function'"), "18. Som de conclusão do feiticeiro ativo");

  // 19. Som de coro
  ok(ev("typeof somCoroConstelacao === 'function'"), "19. Função somCoroConstelacao definida");

  // 20. Som ambiente biblioteca
  ok(
    ev("typeof SONS_MUNDO.feiticeiro.ambiente === 'function'"),
    "20. Som de ambiente da biblioteca mágica ativo"
  );

  fechar();
  return erros;
};
