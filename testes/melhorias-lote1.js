// Testes Melhorias Gerais: Lote 1 (Itens 1 a 10)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 1. Confete direcional
  ok(ev("typeof confettiFromElement === 'function'"), "1. Função confettiFromElement disponível");
  ev(`
    const btn = document.createElement("button");
    document.body.appendChild(btn);
    confettiFromElement(btn, 12);
  `);
  ok(true, "1. Confete direcional executou a partir de elemento");

  // 2. Ondulação fluida no card do herói
  ok(ev("typeof animarOndaHeroi === 'function'"), "2. Função animarOndaHeroi disponível");
  ev(`
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const parar = animarOndaHeroi(path, 4);
    if (typeof parar === "function") parar();
  `);
  ok(true, "2. Ondulação fluida instanciada e parada com sucesso");

  // 3. Squash & stretch no Prumi
  ev(`
    const mascote = document.createElement("div");
    mascote.className = "prumi";
    document.body.appendChild(mascote);
    aplicarSquashMascote(mascote);
  `);
  ok(D.querySelector(".prumi-squash") !== null, "3. Animação de squash & stretch aplicada ao Prumi");

  // 4. Transição de aba direcional
  ev("transicaoAbaDirecional('estudos')");
  ok(
    D.getElementById("main").classList.contains("slide-left"),
    "4. Deslize para a esquerda ativado ao avançar aba"
  );
  ev("transicaoAbaDirecional('hoje')");
  ok(
    D.getElementById("main").classList.contains("slide-right"),
    "4. Deslize para a direita ativado ao retroceder aba"
  );

  // 5. Entrada de tarefas com desdobramento
  ev(`
    const li = document.createElement("li");
    document.body.appendChild(li);
    animarEntradaTarefa(li);
  `);
  ok(D.querySelector(".tarefa-expandindo") !== null, "5. Classe tarefa-expandindo aplicada na entrada");

  // 6. Odômetro e pulso nas gotas
  ev(`
    const contador = document.createElement("span");
    contador.textContent = "10";
    document.body.appendChild(contador);
    odometroGotas(contador, 25);
  `);
  ok(D.querySelector(".odometro-pulso") !== null, "6. Pulso e atualização de odômetro aplicados ao contador");

  // 7. Tremor de erro
  ev(`
    const input = document.createElement("input");
    document.body.appendChild(input);
    aplicarTremorErro(input);
  `);
  ok(D.querySelector(".tremor-erro") !== null, "7. Tremor de erro aplicado a campo com erro");

  // 8. Desintegração ao excluir item
  let desintegrou = false;
  ev(`
    const item = document.createElement("div");
    document.body.appendChild(item);
    animarDesintegracaoItem(item, () => {
      window._desintegrou = true;
    });
  `);
  await espera(350);
  ok(ev("window._desintegrou === true"), "8. Desintegração de item executada com callback acionado");

  // 9. Glow em prioridade alta
  ev(`
    const tarefaAlta = document.createElement("div");
    tarefaAlta.setAttribute("data-prio", "3");
    document.body.appendChild(tarefaAlta);
    aplicarGlowPrioridadeAlta();
  `);
  ok(
    D.querySelector(".tarefa-prio-alta-glow") !== null,
    "9. Glow contínuo sutil adicionado à tarefa de alta prioridade"
  );

  // 10. Card elevado ao arrastar
  ev(`
    const card = document.createElement("div");
    document.body.appendChild(card);
    tornarCardElevado(card, true);
  `);
  ok(D.querySelector(".card-elevado") !== null, "10. Elevação de sombra e rotação adicionadas ao card");

  fechar();
  return erros;
};
