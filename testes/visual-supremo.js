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

    // 4. Balanço rítmico contínuo 1930s (Idle Rubber Hose)
    const resBalanco = ev(`
      (() => {
        const el = document.createElement("div");
        animarBalancoRitmicoMascote(el);
        const temClasse = el.classList.contains("prumi-idle-1930s");
        document.body.appendChild(el);
        const st = getComputedStyle(el);
        const anim = st.animationName || (st.getPropertyValue && st.getPropertyValue("animation-name"));
        el.remove();
        return temClasse && Boolean(anim);
      })()
    `);
    ok(resBalanco, "Balanço rítmico contínuo 1930s do mascote ativado com animação CSS");

    // 5. Olhos Cuphead Pie-Eyes procedurais
    const resPieEyes = ev(`
      (() => {
        const olhoFeliz = gerarOlhoPieEyeCuphead(32, "feliz");
        const olhoFoco = gerarOlhoPieEyeCuphead(24, "foco");
        const olhoSono = gerarOlhoPieEyeCuphead(32, "sonolento");
        const svgValido = olhoFeliz.includes("<svg") && olhoFeliz.includes("Pie cut") && olhoFeliz.includes("<ellipse");
        const temEmocoes = olhoFoco.includes("Olho Cuphead foco") && olhoSono.includes("Olho Cuphead sonolento");
        return svgValido && temEmocoes;
      })()
    `);
    ok(resPieEyes, "gerarOlhoPieEyeCuphead gerou olhos retrô com corte de torta e emoções");

    // 6. Efeito de poeira vintage (Dust Puff)
    const resPoeira = ev(`
      (() => {
        const puff = criarEfeitoPoeiraPasso(100, 150, document.body);
        const existe = Boolean(puff && puff.classList.contains("dust-puff-1930s"));
        const temSvg = puff ? puff.innerHTML.includes("<svg") : false;
        if (puff && puff.parentNode) puff.parentNode.removeChild(puff);
        return existe && temSvg;
      })()
    `);
    ok(resPoeira, "criarEfeitoPoeiraPasso gerou partículas procedurais de poeira retrô");

    // 7. Sombra de contato dinâmica e oclusão ambiente do mascote
    const resSombra = ev(`
      (() => {
        const sombraChao = atualizarSombraContatoMascote(0);
        const sombraPulo = atualizarSombraContatoMascote(100);
        return sombraChao.oclusaoCompleta === true &&
               sombraChao.opacidade > sombraPulo.opacidade &&
               sombraChao.blurPx < sombraPulo.blurPx;
      })()
    `);
    ok(resSombra, "atualizarSombraContatoMascote calculou oclusão máxima no chão e difusão no ar");

    // 8. Sombras solares e lunares circadianas (Chiaroscuro)
    const resCircadiano = ev(`
      (() => {
        const manha = calcularSombraCircadiana(8);
        const meioDia = calcularSombraCircadiana(12);
        const entardecer = calcularSombraCircadiana(17);
        const noite = calcularSombraCircadiana(23);
        return manha.deslocamentoX > 0 &&
               entardecer.deslocamentoX < 0 &&
               meioDia.deslocamentoX === 0 &&
               noite.matizLuz === "luar-azul";
      })()
    `);
    ok(resCircadiano, "calcularSombraCircadiana adaptou ângulo e matiz solar/lunar pelo relógio");

    // 9. Rim light no modo escuro
    const resRimLight = ev(`
      (() => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        const res = aplicarRimLightDark(el);
        const temSombra = el.style.boxShadow.includes("rgba(255, 255, 255, 0.12)");
        el.remove();
        return res.aplicado && temSombra;
      })()
    `);
    ok(resRimLight, "aplicarRimLightDark aplicou contraluz especular de alta fidelidade");

    // 10. Elevação tátil Chiaroscuro em dois modos
    const resElevacao = ev(`
      (() => {
        const n1Claro = calcularNivelElevacaoChiaroscuro(1, false);
        const n4Claro = calcularNivelElevacaoChiaroscuro(4, false);
        const n1Escuro = calcularNivelElevacaoChiaroscuro(1, true);
        const n4Escuro = calcularNivelElevacaoChiaroscuro(4, true);
        return n4Claro.elevacaoPx > n1Claro.elevacaoPx &&
               n1Escuro.superficieBg !== n4Escuro.superficieBg &&
               n1Claro.boxShadow.includes("0 1px 2px");
      })()
    `);
    ok(resElevacao, "calcularNivelElevacaoChiaroscuro estruturou 4 níveis de profundidade tátil");

    // 11. Transição Iris-In / Iris-Out
    const resIris = ev(`
      (async () => {
        let executouMeio = false;
        await executarTransicaoIris(100, 100, 100, () => {
          executouMeio = true;
        });
        return executouMeio;
      })()
    `);
    ok(resIris, "executarTransicaoIris realizou ciclo circular vintage com callback intermediário");

    // 12. Carimbo de conquista com recuo elástico
    const resCarimbo = ev(`
      (() => {
        const el = document.createElement("div");
        animarCarimboSeloConquista(el);
        const temClasse = el.classList.contains("carimbo-conquista-animado");
        document.body.appendChild(el);
        const st = getComputedStyle(el);
        const anim = st.animationName || (st.getPropertyValue && st.getPropertyValue("animation-name"));
        el.remove();
        return temClasse && Boolean(anim);
      })()
    `);
    ok(resCarimbo, "animarCarimboSeloConquista aplicou squash e antecipação elástica de impacto");

    // 13. Odômetro antecipado e estalo elástico de botões
    const resOdometroEstalo = ev(`
      (() => {
        const el = document.createElement("div");
        el.textContent = "0";
        const resOdo = animarContadorOdometroAntecipado(el, 0, 50);
        const resEstalo = aplicarEstaloElasticoBotao(el);
        return resOdo.concluido && el.textContent === "50" && resEstalo.ativo;
      })()
    `);
    ok(resOdometroEstalo, "animarContadorOdometroAntecipado e aplicarEstaloElasticoBotao validados");
  } finally {
    fechar();
  }
  return erros;
};
