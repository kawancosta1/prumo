// Testes Feiticeiro: Lote 1 (Itens 1 a 10)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("feiticeiro");
    tab = "hoje";
    S.tasks = [{ id: "f1", title: "Estudar alquimia", area: "estudos", date: today(), done: false, prio: 0, sub: [] }];
    commit();
    render();
  `);
  await espera(30);

  // 1. Escolas de magia
  ok(ev("escolaAtual()") === "estrela", "1. Escola padrão é estrela");
  ev("definirEscola('fogo')");
  ok(
    ev("escolaAtual()") === "fogo" && D.documentElement.getAttribute("data-escola-magia") === "fogo",
    "1. Troca de escola para fogo atualiza atributo no documento"
  );

  // 2. Grimório de feitiços por área
  ev("evoluirFeiticoArea('estudos')");
  ev("evoluirFeiticoArea('estudos')");
  ok(ev("grimorioFeiticos().estudos") === 2, "2. Evolução de feitiço na área de estudos conta XP");
  ok(ev("rankFeitico(2).titulo") === "Iniciado", "2. Rank Iniciado com 2 XP");
  ok(ev("rankFeitico(6).titulo") === "Adepto", "2. Rank Adepto com 6 XP");
  ok(ev("rankFeitico(16).titulo") === "Mestre", "2. Rank Mestre com 16 XP");
  ok(ev("rankFeitico(35).titulo") === "Lendário", "2. Rank Lendário com 35 XP");

  // 3. Mana Arcana
  ev("adicionarMana(25)");
  const manaAntes = ev("manaFeit()");
  ok(manaAntes >= 50, "3. Mana acumula com foco e água");
  ev("ACOES_EXTRAS['feit-gastar-mana']()");
  ok(ev("dadosFeit().manaBonus === true"), "3. Canalizar mana ativa bônus de feitiço duplo de gotas");

  // 4. Ritual da manhã
  ev(`
    const d = dadosFeit();
    d.bencaoDia = today();
    commit();
  `);
  ok(ev("ritualManhaFeito()") === true, "4. Ritual da manhã reconhece bênção diária ativa");

  // 5. Profecias da semana
  const prof = ev("profeciasSemana()");
  ok(prof && prof.metas && prof.metas.length === 3, "5. Três profecias da semana registradas");

  // 6. Duelo mágico
  ev("iniciarDuelo('f1')");
  ok(ev("dueloMagicoAtivo().hp") === 100, "6. Duelo mágico iniciado com 100 HP");
  ev("atacarDuelo('f1', 100)");
  ok(!ev("dueloMagicoAtivo()"), "6. Duelo finalizado e banido com sucesso");

  // 7. Mini aprendiz aparece a partir de 30 feitiços
  ev(`
    const d2 = dadosFeit();
    d2.feiticos = 35;
    commit();
    render();
  `);
  await espera(20);
  ok(M().includes("Mini Aprendiz"), "7. Mini aprendiz ativo para títulos de Mago iniciado em diante");

  // 8. Torre mágica desenha andares
  const svgTorre = ev("torreMagicaSVG(3)");
  ok(
    svgTorre.includes("feit-torre-svg") && svgTorre.includes("polygon"),
    "8. Desenho da torre mágica renderizado em SVG"
  );

  // 9. Biblioteca arcana
  ev(`
    S.livros = [{ id: "l1", titulo: "O Nome do Vento", paginas: 600, estante: "lido" }];
    commit();
    render();
  `);
  await espera(20);
  ok(
    ev("tomosLidos().length") === 1 && M().includes("1 tomo"),
    "9. Livros lidos viram tomos na biblioteca arcana"
  );

  // 10. Previsão do cristal
  ok(M().includes("Orbe da Previsão"), "10. Card da previsão do cristal exibido no Hoje");

  fechar();
  return erros;
};
