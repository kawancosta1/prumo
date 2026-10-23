// Pets (js/pets.js e js/pets-passeio.js): adotar, cuidar, passeio, caminhada, quarto, perfil e limpeza de dados de fora
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };
  ev(`S.onboarded = true; S.semConta = true; S.coins = 300; S.wake = "00:01"; S.sleep = "23:59"; setPersona("emo"); tab = "prumi"; prumiTab = "pet"; commit();`);
  await espera(30);
  ok(/Adote um bichinho/.test(M()) && /Morceguinho/.test(M()), "tela de adoção com o pet do mundo (morcego no emo)");
  clicar('[data-act="adotar-especie"][data-id="cachorro"]');
  clicar('[data-act="adotar-pers"][data-id="dramatico"]');
  D.getElementById("adotar-nome").value = "Biscoito <b>";
  D.querySelector('form[data-form="adotar"]').dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  await espera(30);
  ok(ev("petsDados().lista.length") === 1 && ev("petAtivo().especie") === "cachorro" && ev("petAtivo().personalidade") === "dramatico", "adota o cachorro dramático");
  ok(D.querySelector(".pet-nome").textContent === "Biscoito <b>" && !D.querySelector(".pet-nome b"), "nome do pet escapado no painel");
  ok(D.querySelectorAll("#pets-passeio .pet-agente").length === 1, "pet aparece passeando pela tela");

  // cuidar
  ev(`petAtivo().comeuEm = Date.now() - 20 * 36e5`);
  ok(ev("Math.round(fomePet(petAtivo()))") === 20, "fome cai 4 por hora");
  const g0 = ev("S.coins");
  clicar('[data-act="pet-comida"]');
  ok(ev("S.coins") === g0 - 5 && ev("fomePet(petAtivo())") > 99, "dar comida custa 5 gotas e enche a barriga");
  clicar('[data-act="pet-carinho"]');
  ok(ev("petAtivo().carinhos[today()]") === 1, "carinho conta");
  clicar('[data-act="pet-banho"]');
  ok(ev("petAtivo().banho") === ev("today()") && D.querySelector('[data-act="pet-banho"]').disabled, "banho uma vez por dia");
  clicar('[data-act="pet-acess"][data-id="chapeu_coroa"]');
  ok(ev("petAtivo().acess.chapeu") === "chapeu_coroa" && ev("petsDados().donos.includes('chapeu_coroa')"), "compra e usa acessório");
  ok(D.querySelector('[data-act="pet-truque"][data-id="rolar"]').disabled, "truque sem a conquista fica travado");
  ok(ev(`petAtivo().comeuEm = 0; petAtivo().carinhos = {}; tristinho(petAtivo())`) === true, "sem cuidado fica tristinho (e não some)");
  ok(ev("petsDados().lista.length") === 1, "pet nunca é apagado");

  // caminhada: cada tarefa concluída é um passo
  ev(`petsDados().caminhada.passos = 14; S.tasks.push({ id: "pt1", title: "Passear", area: "geral", date: today(), done: false, prio: 0, sub: [] }); tab = "hoje"; render();`);
  clicar('[data-act="toggle"][data-id="pt1"]');
  await espera(30);
  ok(ev("petsDados().caminhada.passos") === 15 && ev("petsDados().caminhada.chegou") === true, "tarefa concluída é um passo e a caminhada chega no destino");
  ok(ev(`petAtivo().momentos.some(m => m.t.startsWith("Cartão postal"))`), "cartão postal no álbum");

  // passeio liga e desliga
  ev(`tab = "prumi"; prumiTab = "pet"; render();`);
  clicar('[data-act="pet-passeio"]');
  await espera(20);
  ok(D.querySelectorAll("#pets-passeio .pet-agente").length === 0, "desligar o passeio tira o pet da tela");
  clicar('[data-act="pet-passeio"]');
  ok(D.querySelectorAll("#pets-passeio .pet-agente").length === 1, "religar traz de volta");

  // esconde-esconde
  clicar('[data-act="pet-esconde"]');
  ok(ev("petsDados().esconde.dia") === ev("today()") && ev("petsDados().esconde.aba") !== "prumi", "pet se esconde em outra aba");
  ev(`tab = petsDados().esconde.aba; render();`);
  const ag = D.querySelector("#pets-passeio .pet-agente");
  ok(ag && ag.classList.contains("escondido") && !ag.hidden, "na aba certa aparece só uma pontinha");
  const g1 = ev("S.coins");
  ag.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok(ev("S.coins") === g1 + 5 && ev("petsDados().esconde.achado"), "achou! +5 gotas");

  // mais pets, quarto e perfil
  ev(`tab = "prumi"; prumiTab = "pet"; petSel = "adotar"; render();`);
  ok(/Adotar mais um/.test(M()), "dá pra adotar mais um");
  ok(/caminha-pet/.test(ev("quartoSVG(minhaEstante())")), "pet dorme na caminha do quarto");
  ok(ev("JSON.stringify(petParaVitrine())").includes("cachorro"), "pet vai pro perfil dos amigos");
  ok(ev(`limparPetPublico({ especie: "dragao" })`) === null, "espécie desconhecida vinda de fora é recusada");
  const limpo = ev(`JSON.stringify(limparPetPublico({ especie: "gato", cor: "<script>", nome: "x".repeat(80), personalidade: "hacker", acess: { chapeu: "coleira_azul", roupa: "roupa_capa" } }))`);
  ok(limpo.includes('"cor":"laranja"') && limpo.includes('"personalidade":"curioso"') && !limpo.includes("coleira_azul") && limpo.includes("roupa_capa") && !limpo.includes("x".repeat(21)), "pet vindo de fora é limpo (cor, nome, jeito e acessórios)");
  ok(/fl-pet/.test(ev(`fotoHTML({ d: today(), mood: "happy", agua: .5, eq: {}, p: "emo", legenda: "", pet: petParaVitrine() })`)), "pet aparece na foto do Fotolog");

  fechar();
  return erros;
};
