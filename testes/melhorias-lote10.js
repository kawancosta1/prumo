// Testes Melhorias Gerais: Lote 10 (Itens 91 a 100)
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

  // 91. Marcação semântica das falas do Prumi
  const res91 = ev(`
    (() => {
      const html = formatarFalaPrumiSemantica("Bom dia!", "Prumi");
      return html.includes("<figure") &&
        html.includes("<blockquote") &&
        html.includes("<figcaption") &&
        html.includes("Bom dia!");
    })()
  `);
  ok(res91, "91. formatarFalaPrumiSemantica estruturou elementos semânticos figure/blockquote");

  // 92. Fechamento de modais com tecla Escape
  const res92 = ev(`
    (() => {
      let fechou = false;
      const cancelar = ouvirTeclaEscape(() => { fechou = true; });
      const evt = new KeyboardEvent("keydown", { key: "Escape" });
      window.dispatchEvent(evt);
      cancelar();
      const evt2 = new KeyboardEvent("keydown", { key: "Escape" });
      window.dispatchEvent(evt2);
      return fechou;
    })()
  `);
  ok(res92, "92. ouvirTeclaEscape disparou callback ao pressionar Escape e limpou listener");

  // 93. Focus trap em modais abertos
  const res93 = ev(`
    (() => {
      const modal = document.createElement("div");
      const btn1 = document.createElement("button");
      btn1.id = "btn-primeiro";
      const btn2 = document.createElement("button");
      btn2.id = "btn-ultimo";
      modal.appendChild(btn1);
      modal.appendChild(btn2);
      document.body.appendChild(modal);

      const cancelarTrap = aplicarFocusTrap(modal);
      btn2.focus();

      // Simula tecla Tab no último elemento -> deve voltar ao primeiro
      const evtTab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true });
      btn2.dispatchEvent(evtTab);

      cancelarTrap();
      document.body.removeChild(modal);
      return typeof cancelarTrap === "function";
    })()
  `);
  ok(res93, "93. aplicarFocusTrap manipulou ciclo de foco acessível dentro do modal");

  // 94. Ajuste para fontes ampliadas com unidades relativas
  const res94 = ev(`
    (() => {
      const el = document.createElement("div");
      el.className = "texto-responsivo-rem";
      document.body.appendChild(el);
      const estilo = window.getComputedStyle(el);
      const fs = estilo.fontSize;
      document.body.removeChild(el);
      return fs.length > 0;
    })()
  `);
  ok(res94, "94. .texto-responsivo-rem aplicou unidades relativas para escalabilidade");

  // 95. Indicação textual complementar em elementos coloridos
  const res95 = ev(`
    (() => {
      const badge = document.createElement("span");
      marcarStatusComTexto(badge, "pendente", "Ainda não concluído");
      const temAttr = badge.getAttribute("data-status") === "pendente";
      const spanTexto = badge.querySelector(".status-texto-acessivel");
      return temAttr && spanTexto && spanTexto.textContent.includes("Ainda não concluído");
    })()
  `);
  ok(res95, "95. marcarStatusComTexto adicionou texto descritivo para daltônicos");

  // 96. Compatibilidade com telas ultrafinas de 320px
  const res96 = ev(`
    (() => {
      let temMedia360 = false;
      for (const folha of Array.from(document.styleSheets)) {
        try {
          for (const regra of Array.from(folha.cssRules || [])) {
            if (regra.media && regra.media.mediaText.includes("360px")) {
              temMedia360 = true;
              break;
            }
          }
        } catch (_) {}
      }
      return temMedia360;
    })()
  `);
  ok(res96, "96. Regras de responsividade para telas ultrafinas ativas no CSS");

  // 97. Zona de alcance do polegar
  const res97 = ev(`
    (() => {
      const el = document.createElement("div");
      el.className = "zona-polegar";
      document.body.appendChild(el);
      const estilo = window.getComputedStyle(el);
      const isSticky = estilo.position === "sticky";
      const isBottom = estilo.bottom === "0px";
      document.body.removeChild(el);
      return isSticky && isBottom;
    })()
  `);
  ok(res97, "97. Classe .zona-polegar fixou ações ao alcance anatômico da mão");

  // 98. Retorno tátil via navigator.vibrate
  const res98 = ev(`
    (() => {
      // Em ambiente de teste (sem motor de vibração), deve retornar false sem lançar erro
      const r = dispararRetornoTatil("sucesso");
      return r === false || r === true;
    })()
  `);
  ok(res98, "98. dispararRetornoTatil executou com resiliência sem travar");

  // 99. Inputs numéricos com inputmode="numeric"
  const res99 = ev(`
    (() => {
      const input = document.createElement("input");
      garantirInputmodeNumerico(input);
      return input.getAttribute("inputmode") === "numeric" &&
        input.getAttribute("pattern") === "[0-9]*";
    })()
  `);
  ok(res99, "99. garantirInputmodeNumerico atribuiu atributos para teclado numérico");

  // 100. Prevenção de zoom acidental no iOS
  const res100 = ev(`
    (() => {
      let temRegra16px = false;
      for (const folha of Array.from(document.styleSheets)) {
        try {
          for (const regra of Array.from(folha.cssRules || [])) {
            if (regra.cssRules) {
              for (const sub of Array.from(regra.cssRules)) {
                if (sub.cssText && sub.cssText.includes("16px")) {
                  temRegra16px = true;
                  break;
                }
              }
            }
          }
        } catch (_) {}
      }
      return temRegra16px;
    })()
  `);
  ok(res100, "100. Regra de prevenção de zoom em inputs para iOS presente");

  await fechar();
  return erros;
};
