// Interações novas com o pet (js/pets-interacao.js)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;
  ev(
    `S.onboarded = true; S.semConta = true; S.coins = 100; S.wake = "00:01"; S.sleep = "23:59"; adocao = { especie: "gato", cor: "", nome: "Tico", personalidade: "agitado" }; FORMS_EXTRAS.adotar(); tab = "hoje"; render();`
  );
  await espera(30);
  const ag = () => D.querySelector("#pets-passeio .pet-agente");
  const A = "[...passeio.agentes.values()][0]";
  const clique = () => ag().dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ev(`${A}.ocupadoAte = 0; ${A}.preso = false;`);

  ok(/Tico/.test(ag().title) && /felicidade/.test(ag().title), "plaquinha com nome e humor");
  w.dispatchEvent(new w.MouseEvent("pointermove", { clientX: 390, clientY: 10 }));
  await espera(40);
  ok(ag().style.getPropertyValue("--olho-x") !== "", "olhos seguem o ponteiro");

  clique();
  clique();
  clique();
  await espera(120);
  ok(ev(`petAtivo().momentos.some(m => m.t === "Primeira cócega")`), "três toques rápidos: cócegas");
  ok(D.querySelectorAll("#pets-passeio .pet-combo").length >= 1, "corações do combo");

  ev(`${A}.toques = []`);
  for (let i = 0; i < 5; i++) {
    clique();
    await espera(300);
  }
  ok(ev(`petAtivo().momentos.some(m => m.t === "Combo de 5 carinhos")`), "combo de 5 carinhos vira momento");

  ag().dispatchEvent(
    new w.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 100, clientY: 400 })
  );
  ok(
    !!D.querySelector(".pet-menu") && /Vem comigo/.test(D.querySelector(".pet-menu").textContent),
    "botão direito abre o menu do pet"
  );
  ev(`fecharMenuPet()`);

  const g0 = ev("S.coins");
  ev(`${A}.preso = false; jogarPetisco()`);
  ok(ev("S.coins") === g0 - 1 && D.querySelector(".pet-petisco"), "jogar petisco custa 1 gota e cai no chão");

  ev(`${A}.preso = false; ${A}.presente = true; desenharAgente(${A});`);
  ok(!!ag().querySelector(".pet-presente"), "pet aparece com presente");
  const g1 = ev("S.coins");
  ev(`${A}.ignorarClique = false; tocarAgente(${A})`);
  ok(ev("S.coins") === g1 + 2 && !ev(`${A}.presente`), "pegar o presente dá +2 gotas");

  ev(
    `${A}.preso = false; ${A}.pose = "parado"; ultimaAcao = Date.now() - 6 * 60e3; Object.defineProperty(document, "hidden", { value: false, configurable: true }); conferirSoneca();`
  );
  ok(ev(`${A}.pose`) === "dormindo", "você sumiu 5 min: o pet tira soneca");
  ev(`tocarAgente(${A})`);
  ok(ev(`${A}.pose`) !== "dormindo", "um toque acorda o pet");

  ev(`tab = "prumi"; prumiTab = "pet"; render();`);
  ok(
    !!D.querySelector('[data-act="pet-chamar"]') &&
      /Jeitos de brincar/.test(D.getElementById("main").textContent),
    "painel com Brincar e a lista de jeitos"
  );

  fechar();
  return erros;
};
