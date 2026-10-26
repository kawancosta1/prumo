// Testes Feiticeiro: Lote 3 (Itens 21 a 30)
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
    commit();
    render();
  `);
  await espera(30);

  // 21. Mais 3 temas: sombras, druida, arcanoreal
  const vars = ev("THEMES.feiticeiro.vars.map(v => v.id)");
  ok(vars.includes("sombras"), "21. Tema Mago das sombras presente");
  ok(vars.includes("druida"), "21. Tema Druida presente");
  ok(vars.includes("arcanoreal"), "21. Tema Arcano real presente");

  // 22. Roupas novas
  const itemIds = ev("ITEMS.map(i => i.id)");
  ok(itemIds.includes("feit_robe_arquimago"), "22. Roupa feit_robe_arquimago presente");
  ok(itemIds.includes("feit_cajado_dragao"), "22. Roupa feit_cajado_dragao presente");
  ok(itemIds.includes("feit_chapeu_lua"), "22. Roupa feit_chapeu_lua presente");
  ok(itemIds.includes("feit_oculos_alquimista"), "22. Roupa feit_oculos_alquimista presente");

  // 23. Familiares
  ok(itemIds.includes("feit_fenix"), "23. Familiar feit_fenix presente");
  ok(itemIds.includes("feit_gato_estrela"), "23. Familiar feit_gato_estrela presente");
  ok(itemIds.includes("feit_golem_pedra"), "23. Familiar feit_golem_pedra presente");

  // 24. Títulos e títulos secretos
  const titulos = ev("TITULOS_MAGO.map(t => t[1])");
  ok(titulos.includes("Guardião do Astral"), "24. Título Guardião do Astral presente");
  ok(titulos.includes("Tecelão do Tempo"), "24. Título Tecelão do Tempo presente");
  ev("desbloquearTituloSecreto('feit_sec_astronomo')");
  ok(
    ev("titulosSecretosDesbloqueados()").includes("feit_sec_astronomo"),
    "24. Título secreto desbloqueado com sucesso"
  );

  // 25. Selos mágicos
  ok(ev("SELOS_MAGICOS.length >= 5"), "25. Lista de selos mágicos definida");
  ev("desbloquearSeloMagico('selo_fogo')");
  ok(ev("selosMagicosDesbloqueados()").includes("selo_fogo"), "25. Selo mágico desbloqueado");

  // 26. Academia com amigos
  const ranking = ev("rankingAcademiaFeiticeiro()");
  ok(ranking && ranking.length >= 2, "26. Ranking da academia gerado");
  ok(
    ranking.some(r => r.diretor === true),
    "26. Diretor da semana apontado no ranking"
  );

  // 27. Feitiço de ânimo
  ev("mandarFeiticoAnimo('Teste')");
  ok(
    ev("S.notifs.some(n => n.tipo === 'feitico_animo')"),
    "27. Feitiço de ânimo registrado nas notificações"
  );

  // 28. Faíscas no pet
  ev(`
    const petEl = document.createElement("div");
    document.body.appendChild(petEl);
    efeitoPetFaiscas(petEl);
  `);
  ok(D.querySelector(".feit-pet-faisca"), "28. Faíscas adicionadas ao elemento do pet");

  // 29. Kit de quarto
  const quartoIds = ev("QUARTO.map(q => q.id)");
  ok(quartoIds.includes("q_feit_caldeirao_estudos"), "29. Item de quarto caldeirão de estudos presente");
  ok(quartoIds.includes("q_feit_globo_celeste"), "29. Item de quarto globo celeste presente");
  ok(quartoIds.includes("q_feit_vela_flutuante"), "29. Item de quarto vela flutuante presente");

  // 30. Moldura de pergaminho no Fotolog
  ok(
    ev("MUNDO_FX.feiticeiro.molduraFotolog()") === "feit-moldura-pergaminho",
    "30. Moldura de pergaminho do Fotolog configurada"
  );

  fechar();
  return erros;
};
