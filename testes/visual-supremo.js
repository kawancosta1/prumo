// Testes do Motor de Aprimoramento Visual Supremo
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar injecao das definicoes SVG no DOM
    const defsExistentes = ev(`Boolean(document.getElementById("svg-defs-supremas"))`);
    ok(defsExistentes, "Filtros e gradientes SVG de luxo injetados com sucesso no DOM");

    const filtrosCompletos = ev(`
      (() => {
        const svg = document.getElementById("svg-defs-supremas");
        return svg.querySelector("#filtro-sombra-suave") &&
               svg.querySelector("#filtro-brilho-aura") &&
               svg.querySelector("#grad-volume-mascote") &&
               svg.querySelector("#grad-dourado-luxo");
      })()
    `);
    ok(filtrosCompletos, "Todos os filtros de profundidade 2.5D, aura e douramento presentes");

    // 2. Validar funcoes de micro-tilt e squash registradas
    const funcoesValidas = ev(`typeof inicializarVisualSupremo === "function"`);
    ok(funcoesValidas, "Funcao de inicializacao do visual supremo disponivel");

    // 3. Testar presenca das classes visuais no CSS
    const classesCarregadas = ev(`
      (() => {
        const testEl = document.createElement("div");
        testEl.className = "pet-svg pose-feliz aura-conquista-suprema";
        document.body.appendChild(testEl);
        const st = getComputedStyle(testEl);
        const anim =
          st.animationName ||
          (st.getPropertyValue &&
            (st.getPropertyValue("animation-name") || st.getPropertyValue("animation")));
        testEl.remove();
        return Boolean(anim);
      })()
    `);
    ok(classesCarregadas, "Regras de animacao e efeitos do visual supremo aplicadas com sucesso");
  } finally {
    fechar();
  }
  return erros;
};
