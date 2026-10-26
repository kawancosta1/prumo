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
  ev(
    `S.onboarded = true; S.semConta = true; S.coins = 300; S.wake = "00:01"; S.sleep = "23:59"; setPersona("emo"); tab = "prumi"; prumiTab = "pet"; commit();`
  );
  await espera(30);
  ok(
    /Adote um bichinho/.test(M()) && /Morceguinho/.test(M()),
    "tela de adoção com o pet do mundo (morcego no emo)"
  );
  clicar('[data-act="adotar-especie"][data-id="cachorro"]');
  clicar('[data-act="adotar-pers"][data-id="dramatico"]');
  D.getElementById("adotar-nome").value = "Biscoito <b>";
  D.querySelector('form[data-form="adotar"]').dispatchEvent(
    new w.Event("submit", { bubbles: true, cancelable: true })
  );
  await espera(30);
  ok(
    ev("petsDados().lista.length") === 1 &&
      ev("petAtivo().especie") === "cachorro" &&
      ev("petAtivo().personalidade") === "dramatico",
    "adota o cachorro dramático"
  );
  ok(
    D.querySelector(".pet-nome").textContent === "Biscoito <b>" && !D.querySelector(".pet-nome b"),
    "nome do pet escapado no painel"
  );
  ok(D.querySelectorAll("#pets-passeio .pet-agente").length === 1, "pet aparece passeando pela tela");

  // cuidar
  ev(`petAtivo().comeuEm = Date.now() - 20 * 36e5`);
  ok(ev("Math.round(fomePet(petAtivo()))") === 20, "fome cai 4 por hora");
  const g0 = ev("S.coins");
  clicar('[data-act="pet-comida"]');
  ok(
    ev("S.coins") === g0 - 5 && ev("fomePet(petAtivo())") > 99,
    "dar comida custa 5 gotas e enche a barriga"
  );
  const mult = ev("MUNDO_FX[S.persona] && MUNDO_FX[S.persona].multiplicadorGotas ? MUNDO_FX[S.persona].multiplicadorGotas() : 1");
  const g3 = ev("S.coins");
  clicar('[data-act="pet-carinho"]');
  ok(ev("petAtivo().carinhos[today()]") === 1, "carinho conta");
  ok(ev("S.coins") === g3 + 1 * mult, "carinho vale 1 gota");
  ev(`for (let i = 0; i < 15; i++) fazerCarinho(petAtivo())`);
  ok(ev("S.coins") === g3 + 10 * mult, "carinho rende no máximo 10 gotas por dia");
  clicar('[data-act="pet-banho"]');
  ok(
    ev("petAtivo().banho") === ev("today()") && D.querySelector('[data-act="pet-banho"]').disabled,
    "banho uma vez por dia"
  );
  const g2 = ev("S.coins");
  clicar('[data-act="pet-acess"][data-id="chapeu_coroa"]');
  ok(
    !ev("petAtivo().acess.chapeu") &&
      ev("S.coins") === g2 &&
      D.querySelector('.pet-comprar [data-act="pet-acess-comprar"]'),
    "acessório novo: prova primeiro e o botão de comprar aparece ali embaixo"
  );
  ok(
    /chapeu|M28 9V3/.test(D.querySelector(".pet-grande").innerHTML),
    "pet grande mostra o acessório provando"
  );
  clicar('[data-act="pet-acess-comprar"]');
  ok(
    ev("petAtivo().acess.chapeu") === "chapeu_coroa" &&
      ev("petsDados().donos.includes('chapeu_coroa')") &&
      ev("S.coins") === g2 - 90,
    "compra e usa acessório"
  );
  clicar('[data-act="pet-acess"][data-id="chapeu_coroa"]');
  ok(!ev("petAtivo().acess.chapeu"), "tocar no que já está usando tira");
  ok(
    D.querySelector('[data-act="pet-truque"][data-id="rolar"]').disabled,
    "truque sem a conquista fica travado"
  );
  ok(
    ev(`petAtivo().comeuEm = 0; petAtivo().carinhos = {}; tristinho(petAtivo())`) === true,
    "sem cuidado fica tristinho (e não some)"
  );
  ok(ev("petsDados().lista.length") === 1, "pet nunca é apagado");

  // caminhada: cada tarefa concluída é um passo
  ev(
    `petsDados().caminhada.passos = 14; S.tasks.push({ id: "pt1", title: "Passear", area: "geral", date: today(), done: false, prio: 0, sub: [] }); tab = "hoje"; render();`
  );
  clicar('[data-act="toggle"][data-id="pt1"]');
  await espera(30);
  ok(
    ev("petsDados().caminhada.passos") === 15 && ev("petsDados().caminhada.chegou") === true,
    "tarefa concluída é um passo e a caminhada chega no destino"
  );
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
  ok(
    ev("petsDados().esconde.dia") === ev("today()") && ev("petsDados().esconde.aba") !== "prumi",
    "pet se esconde em outra aba"
  );
  ev(`tab = petsDados().esconde.aba; render();`);
  const ag = D.querySelector("#pets-passeio .pet-agente");
  ok(ag && ag.classList.contains("escondido") && !ag.hidden, "na aba certa aparece só uma pontinha");
  const g1 = ev("S.coins");
  ag.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok(ev("S.coins") === g1 + 5 * mult && ev("petsDados().esconde.achado"), "achou! +5 gotas");

  // arrastar: pega, leva e solta (cai no chão); toque rápido continua sendo carinho
  ev(`tab = "hoje"; render();`);
  const ag2 = D.querySelector("#pets-passeio .pet-agente");
  const pe = (tipo, x, y) =>
    ag2.dispatchEvent(new w.MouseEvent(tipo, { bubbles: true, clientX: x, clientY: y, button: 0 }));
  ev(
    `const a = [...passeio.agentes.values()][0]; a.x = 50; a.y = chaoPasseio(); a.ocupadoAte = 0; posicionar(a, false);`
  );
  pe("pointerdown", 60, ev("chaoPasseio()") + 10);
  pe("pointermove", 120, 120);
  pe("pointermove", 160, 100);
  ok(ev("[...passeio.agentes.values()][0].pose") === "segurado", "arrastando: fica pendurado");
  pe("pointerup", 160, 100);
  ok(
    ev("[...passeio.agentes.values()][0].y") === ev("chaoPasseio()") ||
      ev("!![...passeio.agentes.values()][0].ancora"),
    "soltou: cai no chão ou num card"
  );
  const carinhosAntes = ev("petAtivo().carinhos[today()] || 0");
  ag2.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok(
    ev("petAtivo().carinhos[today()] || 0") === carinhosAntes,
    "o clique logo depois de soltar não conta como carinho"
  );
  // rolar a página: quem está em cima de card desce
  ev(
    `const a = [...passeio.agentes.values()][0]; a.ignorarClique = false; a.ancora = { el: document.querySelector("#main .block"), dx: 0 };`
  );
  w.dispatchEvent(new w.Event("scroll"));
  ok(
    ev("[...passeio.agentes.values()][0].ancora") === null,
    "rolou a página: desce do card em vez de ir junto"
  );
  // tocar no vazio não dispara ao começar a rolar (pointerdown); só no clique
  ev(
    `const a = [...passeio.agentes.values()][0]; a.preso = false; a.ocupadoAte = 0; window.__x0 = a.x; ultimoScroll = 0;`
  );
  D.getElementById("main").dispatchEvent(
    new w.MouseEvent("pointerdown", { bubbles: true, clientX: 300, clientY: 300 })
  );
  ok(ev("[...passeio.agentes.values()][0].x") === ev("__x0"), "encostar o dedo pra rolar não puxa o pet");

  // espécies novas e o jeito de cada uma
  ev(`tab = "prumi"; prumiTab = "pet"; petSel = "adotar"; render();`);
  ok(
    D.querySelector('[data-act="adotar-especie"][data-id="vaca"]') &&
      D.querySelector('[data-id="boi"]') &&
      D.querySelector('[data-id="coala"]'),
    "vaca, boi e coala pra adotar"
  );
  clicar('[data-act="adotar-especie"][data-id="coala"]');
  D.getElementById("adotar-nome").value = "Eucalipto";
  D.querySelector('form[data-form="adotar"]').dispatchEvent(
    new w.Event("submit", { bubbles: true, cancelable: true })
  );
  await espera(20);
  ok(
    ev("petAtivo().especie") === "cachorro" && ev("petsDados().lista.some(p => p.especie === 'coala')"),
    "adota a coala"
  );
  ok(/Abraço apertado/.test(M()), "coala tem o abraço apertado");
  const g4 = ev("S.coins");
  clicar('[data-act="pet-especial"]');
  ok(
    ev("S.coins") === g4 + 3 * mult && ev(`petDoPainel().especialDia === today()`),
    "interação especial dá +3 uma vez por dia"
  );
  clicar('[data-act="pet-especial"]');
  ok(ev("S.coins") === g4 + 3 * mult, "segunda vez no dia não dá mais gota");
  for (const e of ["vaca", "boi", "coala"])
    ok(
      /<svg/.test(
        ev(
          `petSVG({ especie: "${e}", cor: "", nome: "x", personalidade: "curioso", acess: {}, cuidados: [], carinhos: {} }, { pose: "pastando" })`
        )
      ),
      "desenha " + e
    );

  // mais pets, quarto e perfil
  ev(`tab = "prumi"; prumiTab = "pet"; petSel = "adotar"; render();`);
  ok(/Adotar mais um/.test(M()), "dá pra adotar mais um");
  ok(/caminha-pet/.test(ev("quartoSVG(minhaEstante())")), "pet dorme na caminha do quarto");
  ok(ev("JSON.stringify(petParaVitrine())").includes("cachorro"), "pet vai pro perfil dos amigos");
  ok(ev(`limparPetPublico({ especie: "dragao" })`) === null, "espécie desconhecida vinda de fora é recusada");
  const limpo = ev(
    `JSON.stringify(limparPetPublico({ especie: "gato", cor: "<script>", nome: "x".repeat(80), personalidade: "hacker", acess: { chapeu: "coleira_azul", roupa: "roupa_capa" } }))`
  );
  ok(
    limpo.includes('"cor":"laranja"') &&
      limpo.includes('"personalidade":"curioso"') &&
      !limpo.includes("coleira_azul") &&
      limpo.includes("roupa_capa") &&
      !limpo.includes("x".repeat(21)),
    "pet vindo de fora é limpo (cor, nome, jeito e acessórios)"
  );
  ok(
    /fl-pet/.test(
      ev(
        `fotoHTML({ d: today(), mood: "happy", agua: .5, eq: {}, p: "emo", legenda: "", pet: petParaVitrine() })`
      )
    ),
    "pet aparece na foto do Fotolog"
  );

  // loja do Prumi: escolheu, o botão de comprar aparece embaixo do item e numa barrinha presa embaixo da tela
  ev(`tab = "prumi"; prumiTab = "visual"; tryItem = null; S.coins = 999; render();`);
  const item = D.querySelector('.sitem.buy[data-act="item"]');
  if (!item) erros.push("sem item pra comprar na loja");
  else {
    const id = item.dataset.id;
    item.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    ok(
      D.querySelector(`.sitem-caixa [data-act="buy"][data-id="${id}"]`) &&
        D.querySelector(`.trybar.flutua [data-act="buy"][data-id="${id}"]`),
      "comprar aparece embaixo do item e na barrinha flutuante"
    );
    D.querySelector(`.sitem-caixa [data-act="buy"]`).dispatchEvent(
      new w.MouseEvent("click", { bubbles: true })
    );
    ok(
      ev(`S.owned.includes("${id}") && S.equip[ITEM["${id}"].slot] === "${id}"`) &&
        !D.querySelector(".trybar.flutua"),
      "comprou ali mesmo e já está usando"
    );
  }

  fechar();
  return erros;
};
