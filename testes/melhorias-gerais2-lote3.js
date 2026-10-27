// Testes Novas Melhorias Gerais: Lote 3 (Itens 21 a 30)
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

  // 21. Efeito de água enchendo a tela de baixo para cima na meta batida
  const res21 = ev(`
    (() => {
      const onda = animarOndaTelaCheiaAguaBatida();
      return onda && onda.classList.contains("onda-tela-cheia-agua");
    })()
  `);
  ok(res21, "21. animarOndaTelaCheiaAguaBatida criou elemento de onda com animação");

  // 22. Troca de roupa do Prumi com efeito de giro rápido de 360 graus
  const res22 = ev(`
    (() => {
      const el = document.createElement("div");
      animarGiroTrocaRoupaPrumi(el);
      return el.classList.contains("prumi-giro-360");
    })()
  `);
  ok(res22, "22. animarGiroTrocaRoupaPrumi ativou giro tridimensional no mascote");

  // 23. Estrelas cadentes de fundo quando for noite e tudo estiver feito
  const res23 = ev(`
    (() => {
      const estrelas = gerarEstrelasCadentesNoite(document.body, 3);
      return estrelas.length === 3 && estrelas[0].classList.contains("estrela-cadente-noite");
    })()
  `);
  ok(res23, "23. gerarEstrelasCadentesNoite dispersou estrelas cadentes noturnas");

  // 24. Transição de texto numérico com rolagem de odômetro vertical
  const res24 = ev(`
    (() => {
      const el = document.createElement("span");
      animarOdometroVerticalGotas(el, 45);
      return el.classList.contains("odometro-coluna-numerica") && el.getAttribute("data-valor") === "45";
    })()
  `);
  ok(res24, "24. animarOdometroVerticalGotas atualizou valor e classe de odômetro");

  // 25. Sombra projetada dinâmica que muda de ângulo com a hora do dia
  const res25 = ev(`
    (() => {
      const sManha = calcularAnguloSombraHoraDia(6);
      const sMeioDia = calcularAnguloSombraHoraDia(12);
      const sTarde = calcularAnguloSombraHoraDia(18);
      return sManha.offsetX < 0 && sMeioDia.offsetX === 0 && sTarde.offsetX > 0;
    })()
  `);
  ok(res25, "25. calcularAnguloSombraHoraDia calculou projeção de sombra por hora");

  // 26. Balanço de corda suspensa nas placas dos mundos na loja
  const res26 = ev(`
    (() => {
      const placa = document.createElement("div");
      animarPlacaMundoBalancando(placa, true);
      const balancou = placa.classList.contains("placa-mundo-balancando");
      animarPlacaMundoBalancando(placa, false);
      const parou = !placa.classList.contains("placa-mundo-balancando");
      return balancou && parou;
    })()
  `);
  ok(res26, "26. animarPlacaMundoBalancando alternou balanço suave da placa");

  // 27. Deslize elástico no rodapé quando o usuário chega ao fim da página
  const res27 = ev(`
    (() => {
      const rodape = document.createElement("footer");
      aplicarDeslizeElasticoRodape(rodape);
      return rodape.classList.contains("rodape-deslize-elastico");
    })()
  `);
  ok(res27, "27. aplicarDeslizeElasticoRodape adicionou classe de recuo elástico");

  // 28. Pulso de alerta vermelho suave em tarefas atrasadas há mais de 3 dias
  const res28 = ev(`
    (() => {
      const cardAtrasado = document.createElement("div");
      aplicarAlertaAtrasoLongoSutil(cardAtrasado, 4);
      const ligou = cardAtrasado.classList.contains("alerta-atraso-vermelho-sutil");
      const cardNormal = document.createElement("div");
      aplicarAlertaAtrasoLongoSutil(cardNormal, 1);
      const naoLigou = !cardNormal.classList.contains("alerta-atraso-vermelho-sutil");
      return ligou && naoLigou;
    })()
  `);
  ok(res28, "28. aplicarAlertaAtrasoLongoSutil aplicou destaque sutil em atrasos longos");

  // 29. Efeito de abrir cortina no quarto ao iniciar o dia pela primeira vez
  const res29 = ev(`
    (() => {
      const cortina = document.createElement("div");
      animarAberturaCortinaQuarto(cortina);
      return cortina.classList.contains("cortina-abrindo-quarto");
    })()
  `);
  ok(res29, "29. animarAberturaCortinaQuarto recolheu cortina do quarto");

  // 30. Efeito de fechar persiana no quarto ao bater a meta noturna
  const res30 = ev(`
    (() => {
      const persiana = document.createElement("div");
      animarFechamentoPersianaQuarto(persiana);
      return persiana.classList.contains("persiana-fechando-quarto");
    })()
  `);
  ok(res30, "30. animarFechamentoPersianaQuarto desceu persiana de descanso");

  await fechar();
  return erros;
};
