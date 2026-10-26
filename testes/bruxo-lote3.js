// Testes Bruxo: Lote 3 (Itens 21 a 30)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("bruxo");
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 21. Mais 3 temas em THEMES.bruxo.vars (Pântano, Bruxa do mar, Inverno de bruxa)
  const vars = ev("THEMES.bruxo.vars.map(v => v.id)");
  ok(vars.includes("pantano"), "21. Tema Pântano presente em THEMES.bruxo.vars");
  ok(vars.includes("mar"), "21. Tema Bruxa do mar presente em THEMES.bruxo.vars");
  ok(vars.includes("inverno"), "21. Tema Inverno de bruxa presente em THEMES.bruxo.vars");

  // 22. Roupas em ITEMS (capa de corvo, chapéu de cogumelo gigante, colar de dente de lua, botas pontudas)
  const itens = ev("ITEMS.map(i => i.id)");
  ok(itens.includes("bru_capa_corvo"), "22. Roupa bru_capa_corvo presente");
  ok(itens.includes("bru_chapeu_cogu_gigante"), "22. Roupa bru_chapeu_cogu_gigante presente");
  ok(itens.includes("bru_colar_dente_lua"), "22. Roupa bru_colar_dente_lua presente");
  ok(itens.includes("bru_botas_pontudas"), "22. Roupa bru_botas_pontudas presente");

  // 23. Familiares em ITEMS (coruja-das-neves, morceguinho, salamandra)
  ok(itens.includes("bru_coruja_neves"), "23. Familiar bru_coruja_neves presente");
  ok(itens.includes("bru_morceguinho"), "23. Familiar bru_morceguinho presente");
  ok(itens.includes("bru_salamandra"), "23. Familiar bru_salamandra presente");

  // 24. Prateleira de poções que vai ficando bonita no quarto
  ok(
    ev("!!ITEM_QUARTO['q_bruxo_prateleira_quarto']"),
    "24. Enfeite de prateleira de poções presente no quarto"
  );

  // 25. Ervas raras por fase da lua
  const erva = ev("colherErvaRaraLua()");
  ok(erva && erva.id && erva.nome, "25. Erva rara colhida com sucesso conforme fase lunar");
  ok(ev("dadosBruxo().ervasRaras.length > 0"), "25. Erva rara catalogada no inventário de dados");

  // 26. Mandar poção pra amigo
  const mandou = ev("mandarPocaoAmigo('Kaka', 'Poção da Coragem')");
  ok(mandou === true, "26. Poção mágica enviada com sucesso para amigo");
  ok(ev("dadosBruxo().pocoesEnviadas.length > 0"), "26. Envio de poção registrado");

  // 27. Pet com chapéu de bruxa vira sapo por 5 segundos
  const virou = ev("bruxoPetViraSapo()");
  ok(
    virou === true && ev("dadosBruxo().petSapoAte > Date.now()"),
    "27. Pet transformado temporariamente em sapo"
  );

  // 28. Pet sobe na vassoura durante o voo
  ev("animarVooVassoura()");
  ok(D.querySelector(".bruxo-pet-vassoura") !== null, "28. Pet sobrevoando a tela montado na vassoura");

  // 29. Kit de quarto: caldeirão grande, ervas penduradas, janela com lua
  ok(ev("!!ITEM_QUARTO['q_bruxo_caldeirao_grande']"), "29. Caldeirão grande presente no quarto");
  ok(ev("!!ITEM_QUARTO['q_bruxo_ervas_penduradas']"), "29. Ervas penduradas presentes no quarto");
  ok(ev("!!ITEM_QUARTO['q_bruxo_janela_lua']"), "29. Janela com lua presente no quarto");

  // 30. Fotolog com moldura de folhas e cogumelos
  const moldura = ev("molduraFotologBruxoHTML('<img src=\"x\">')");
  ok(moldura.includes("bruxo-fotolog-moldura"), "30. Moldura de folhas e cogumelos gerada para o fotolog");

  fechar();
  return erros;
};
