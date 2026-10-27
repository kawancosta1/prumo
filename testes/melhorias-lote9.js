// Testes Melhorias Gerais: Lote 9 (Itens 81 a 90)
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

  // 81. Cache em memória para templates SVG
  const res81 = ev(`
    (() => {
      let chamadas = 0;
      const gerador = () => { chamadas++; return "<svg id='teste'></svg>"; };
      limparCacheSVG();
      const svg1 = obterCacheSVG("meu_svg", gerador);
      const svg2 = obterCacheSVG("meu_svg", gerador);
      return svg1 === svg2 && chamadas === 1;
    })()
  `);
  ok(res81, "81. obterCacheSVG reutilizou resultado sem invocar gerador repetidamente");

  // 82. Sistema de migração de versões de esquema
  const res82 = ev(`
    (() => {
      const estadoV1 = { _versao: 1, usuario: "kawan" };
      const migradores = {
        2: est => ({ ...est, pontos: 100 }),
        3: est => ({ ...est, titulo: "Mestre" })
      };
      const estadoV3 = migrarVersaoEsquema(estadoV1, 3, migradores);
      return estadoV3._versao === 3 && estadoV3.pontos === 100 && estadoV3.titulo === "Mestre";
    })()
  `);
  ok(res82, "82. migrarVersaoEsquema migrou incrementalmente para a versão alvo");

  // 83. Memoização de cálculos de diffDays
  const res83 = ev(`
    (() => {
      const d1 = memoDiffDays("2026-10-01", "2026-10-10");
      const d2 = memoDiffDays("2026-10-01", "2026-10-10");
      return d1 === 9 && d2 === 9;
    })()
  `);
  ok(res83, "83. memoDiffDays calculou e memoizou diferença em dias");

  // 84. Otimização de cache offline no Service Worker
  const res84 = ev(`
    (() => {
      const manifesto = gerarCacheManifesto("2.1.0", ["/novidades.html"]);
      return manifesto.nomeCache === "prumo-cache-v2.1.0" &&
        manifesto.arquivos.includes("/novidades.html") &&
        manifesto.arquivos.includes("/index.html");
    })()
  `);
  ok(res84, "84. gerarCacheManifesto estruturou recursos offline de forma determinística");

  // 85. Validação rigorosa de "use strict" em scripts
  const res85 = ev(`
    (() => {
      const codigoOk = '"use strict"; const x = 1;';
      const codigoComComentario = '/* licenca */ \\n "use strict"; const y = 2;';
      const codigoSem = 'const z = 3;';
      return validarUseStrictEmScript(codigoOk) &&
        validarUseStrictEmScript(codigoComComentario) &&
        !validarUseStrictEmScript(codigoSem);
    })()
  `);
  ok(res85, "85. validarUseStrictEmScript detectou presença e ausência de modo estrito");

  // 86. Validador de contraste WCAG 2.1 AA
  const res86 = ev(`
    (() => {
      // Preto sobre branco: razão 21:1 (passa)
      const resPretoBranco = validarContrasteWCAG("#000000", "#ffffff");
      // Cinza claro sobre branco: baixa razão (não passa)
      const resCinzaBranco = validarContrasteWCAG("#cccccc", "#ffffff");
      return resPretoBranco.passaNormal && !resCinzaBranco.passaNormal;
    })()
  `);
  ok(res86, "86. validarContrasteWCAG aferiu conformidade com critérios WCAG 2.1 AA");

  // 87. Áreas de toque mínimas de 48px em mobile CSS
  const res87 = ev(`
    (() => {
      const el = document.createElement("button");
      el.className = "touch-minimo";
      document.body.appendChild(el);
      const estilo = window.getComputedStyle(el);
      const minW = parseInt(estilo.minWidth, 10);
      const minH = parseInt(estilo.minHeight, 10);
      document.body.removeChild(el);
      return minW >= 48 && minH >= 48;
    })()
  `);
  ok(res87, "87. Classe .touch-minimo garantiu dimensões mínimas de 48x48px");

  // 88. Navegação por teclado com anéis de foco visíveis
  const res88 = ev(`
    (() => {
      // Confere se as regras de focus-visible estão registradas nos stylesheets
      let achouFocusVisible = false;
      for (const folha of Array.from(document.styleSheets)) {
        try {
          for (const regra of Array.from(folha.cssRules || [])) {
            if (regra.selectorText && regra.selectorText.includes(":focus-visible")) {
              achouFocusVisible = true;
              break;
            }
          }
        } catch (_) {}
      }
      return achouFocusVisible;
    })()
  `);
  ok(res88, "88. Regras de :focus-visible ativas nos estilos do app");

  // 89. Regiões dinâmicas aria-live="polite"
  const res89 = await new Promise(resolve => {
    ev(`
      anunciarLeitorTela("Tarefa concluída!");
    `);
    setTimeout(() => {
      const r = ev(`
        (() => {
          const el = document.getElementById("prumo-aria-live");
          return el && el.getAttribute("aria-live") === "polite" && el.textContent === "Tarefa concluída!";
        })()
      `);
      resolve(r);
    }, 50);
  });
  ok(res89, "89. anunciarLeitorTela criou live region e comunicou mensagem");

  // 90. Rótulos semânticos aria-label automáticos em botões icon-only
  const res90 = ev(`
    (() => {
      const container = document.createElement("div");
      const btnIcon = document.createElement("button");
      btnIcon.setAttribute("title", "Adicionar item");
      container.appendChild(btnIcon);
      document.body.appendChild(container);
      const alterados = assegurarAriaLabelsBotoes(container);
      const temAria = btnIcon.getAttribute("aria-label") === "Adicionar item";
      document.body.removeChild(container);
      return alterados === 1 && temAria;
    })()
  `);
  ok(res90, "90. assegurarAriaLabelsBotoes preencheu rótulo acessível a partir do title");

  await fechar();
  return erros;
};
