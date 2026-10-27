// Testes Melhorias Gerais: Lote 11 (Itens 101 a 110)
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

  // 101. Mensagens de erro claras e orientadas à ação
  const res101 = ev(`
    (() => {
      const msgNet = formatarMensagemErroAcao("auth/network-request-failed");
      const msgLogin = formatarMensagemErroAcao("auth/wrong-password");
      return msgNet.includes("Sem conexão") && msgLogin.includes("senha");
    })()
  `);
  ok(res101, "101. formatarMensagemErroAcao forneceu mensagens explicativas com próximo passo");

  // 102. Feedback sonoro acessível para deficientes visuais
  const res102 = ev(`
    (() => {
      tocarSomAcessivel("sucesso");
      tocarSomAcessivel("alerta");
      return true;
    })()
  `);
  ok(res102, "102. tocarSomAcessivel executou tons sintéticos acessíveis sem erros");

  // 103. Desativação de gestos conflitantes com a navegação
  const res103 = ev(`
    (() => {
      const el = document.createElement("div");
      desativarArrastoConflitante(el);
      return el.classList.contains("conteudo-sem-arrasto-conflitante");
    })()
  `);
  ok(res103, "103. desativarArrastoConflitante aplicou classe de contenção de scroll");

  // 104. Preenchimento automático com autocomplete
  const res104 = ev(`
    (() => {
      const form = document.createElement("form");
      const inpEmail = document.createElement("input");
      inpEmail.type = "email";
      const inpSenha = document.createElement("input");
      inpSenha.type = "password";
      form.appendChild(inpEmail);
      form.appendChild(inpSenha);
      configurarAutocompleteFormulario(form);
      return inpEmail.getAttribute("autocomplete") === "email" &&
        inpSenha.getAttribute("autocomplete") === "current-password";
    })()
  `);
  ok(res104, "104. configurarAutocompleteFormulario atribuiu autocomplete semântico");

  // 105. Barra de progresso com atributos aria
  const res105 = ev(`
    (() => {
      const barra = document.createElement("div");
      atualizarBarraProgressoAria(barra, 45, 0, 100);
      return barra.getAttribute("role") === "progressbar" &&
        barra.getAttribute("aria-valuenow") === "45" &&
        barra.getAttribute("aria-valuemin") === "0" &&
        barra.getAttribute("aria-valuemax") === "100";
    })()
  `);
  ok(res105, "105. atualizarBarraProgressoAria atualizou atributos WCAG de progresso");

  // 106. Modo de alto contraste configurável
  const res106 = ev(`
    (() => {
      alternarAltoContraste(true);
      const ativo = document.documentElement.getAttribute("data-alto-contraste") === "true";
      alternarAltoContraste(false);
      const inativo = document.documentElement.getAttribute("data-alto-contraste") === "false";
      return ativo && inativo;
    })()
  `);
  ok(res106, "106. alternarAltoContraste gerenciou estado de alto contraste no documento");

  // 107. Título dinâmico do documento com pendências
  const res107 = ev(`
    (() => {
      const t1 = atualizarTituloDocumento("Hoje", 3);
      const t2 = atualizarTituloDocumento("Ajustes", 0);
      return t1 === "(3) Prumo - Hoje" && t2 === "Prumo - Ajustes";
    })()
  `);
  ok(res107, "107. atualizarTituloDocumento exibiu seção e contador de pendências");

  // 108. Suporte a modo paisagem em tablets
  const res108 = ev(`
    (() => {
      let temLandscape = false;
      for (const folha of Array.from(document.styleSheets)) {
        try {
          for (const regra of Array.from(folha.cssRules || [])) {
            if (regra.media && regra.media.mediaText.includes("landscape")) {
              temLandscape = true;
              break;
            }
          }
        } catch (_) {}
      }
      return temLandscape;
    })()
  `);
  ok(res108, "108. Regras de modo paisagem para tablets ativas no CSS");

  // 109. Prevenção de double-tap zoom
  const res109 = ev(`
    (() => {
      let temTouchAction = false;
      for (const folha of Array.from(document.styleSheets)) {
        try {
          for (const regra of Array.from(folha.cssRules || [])) {
            if (regra.cssText && regra.cssText.includes("touch-action: manipulation")) {
              temTouchAction = true;
              break;
            }
          }
        } catch (_) {}
      }
      return temTouchAction;
    })()
  `);
  ok(res109, "109. touch-action: manipulation ativo para prevenção de delay de clique");

  // 110. Associação <label for="..."> nos formulários
  const res110 = ev(`
    (() => {
      const form = document.createElement("div");
      const label = document.createElement("label");
      label.textContent = "Nome:";
      const input = document.createElement("input");
      form.appendChild(label);
      form.appendChild(input);
      document.body.appendChild(form);
      const ajustados = assegurarLabelsFormulario(form);
      const temFor = label.getAttribute("for") && label.getAttribute("for") === input.id;
      document.body.removeChild(form);
      return ajustados === 1 && temFor;
    })()
  `);
  ok(res110, "110. assegurarLabelsFormulario associou id e atributo for entre input e label");

  await fechar();
  return erros;
};
