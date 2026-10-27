// Testes Novas Melhorias Gerais: Lote 11 (Itens 101 a 110)
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

  // 101. Leitor centralizado de tokens de design CSS
  const res101 = ev(`
    (() => {
      return typeof obterTokenDesign === "function";
    })()
  `);
  ok(res101, "101. obterTokenDesign disponível para leitura de variáveis de design");

  // 102. Modo de alto contraste preto e branco acessível
  const res102 = ev(`
    (() => {
      const container = document.createElement("div");
      alternarModoAltoContraste(container, true);
      const okAtivo = container.classList.contains("modo-alto-contraste");
      alternarModoAltoContraste(container, false);
      const okInativo = !container.classList.contains("modo-alto-contraste");
      return okAtivo && okInativo;
    })()
  `);
  ok(res102, "102. alternarModoAltoContraste alternou visual monocromático acessível");

  // 103. Escala tipográfica dinâmica preservando proporções
  const res103 = ev(`
    (() => {
      const container = document.createElement("div");
      const f = aplicarEscalaTipografica(container, 1.2);
      return f === 1.2 && container.style.getPropertyValue("--escala-fonte") === "1.2";
    })()
  `);
  ok(res103, "103. aplicarEscalaTipografica ajustou fator de escala tipográfica");

  // 104. Descrição falada da expressão e água do mascote para leitor de tela
  const res104 = ev(`
    (() => {
      const desc = descreverExpressaoPrumiAcessivel("happy", 0.8);
      return desc.includes("feliz") && desc.includes("80%");
    })()
  `);
  ok(res104, "104. descreverExpressaoPrumiAcessivel gerou descrição falada detalhada");

  // 105. Verificação matemática de contraste relativo de cores WCAG
  const res105 = ev(`
    (() => {
      const cPB = verificarContrasteCoresWCAG("#000000", "#ffffff");
      const cCinza = verificarContrasteCoresWCAG("#777777", "#888888");
      return cPB.passaAA === true && cCinza.passaAA === false;
    })()
  `);
  ok(res105, "105. verificarContrasteCoresWCAG calculou luminância relativa e conformidade AA");

  // 106. Garantia de alvos de toque mínimos de 44x44px no mobile
  const res106 = ev(`
    (() => {
      const btn = document.createElement("button");
      adicionarAreaToqueAcessivel(btn);
      return btn.classList.contains("alvo-toque-44");
    })()
  `);
  ok(res106, "106. adicionarAreaToqueAcessivel aplicou classe de alvo mínimo");

  // 107. Anel duplo de foco visível para navegação por teclado
  const res107 = ev(`
    (() => {
      const el = document.createElement("input");
      gerarAnelFocoVisivelTeclado(el);
      return el.classList.contains("foco-teclado-duplo");
    })()
  `);
  ok(res107, "107. gerarAnelFocoVisivelTeclado ativou foco nítido para teclado");

  // 108. Focus Trap completo para modais e caixas de diálogo
  const res108 = ev(`
    (() => {
      return typeof travarFocoDentroModal === "function";
    })()
  `);
  ok(res108, "108. travarFocoDentroModal disponível para retenção de foco");

  // 109. Restauração de foco ao elemento disparador de modal
  const res109 = ev(`
    (() => {
      const btn = document.createElement("button");
      document.body.appendChild(btn);
      const focou = restaurarFocoOrigemModal(btn);
      document.body.removeChild(btn);
      return focou;
    })()
  `);
  ok(res109, "109. restaurarFocoOrigemModal retornou foco ao botão disparador");

  // 110. Anunciador dinâmico de regiões vivas acessíveis (aria-live)
  const res110 = ev(`
    (() => {
      return typeof anunciarMudancaRegiaoViva === "function" &&
        anunciarMudancaRegiaoViva("Teste de anúncio acessível");
    })()
  `);
  ok(res110, "110. anunciarMudancaRegiaoViva despachou mensagem para leitor de tela");

  await fechar();
  return erros;
};
