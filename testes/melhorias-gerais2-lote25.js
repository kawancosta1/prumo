// Testes Novas Melhorias Gerais: Lote 25 (Itens 241 a 250)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 241. Sombra neumrfica suave para cards
  const res241 = ev(`
    (() => {
      const el = document.createElement("div");
      const okClass = aplicarSombraNeumorficaSuave(el);
      return okClass && el.classList.contains("card-neumorfico-suave");
    })()
  `);
  ok(res241, "241. aplicarSombraNeumorficaSuave aplicou classe estilstica de profundidade");

  // 242. Gradiente dinmico conforme hora do dia
  const res242 = ev(`
    (() => {
      const gDia = gerarGradienteDinamicoHoraDia(12);
      const gNoite = gerarGradienteDinamicoHoraDia(22);
      return gDia.includes("linear-gradient") && gNoite.includes("linear-gradient");
    })()
  `);
  ok(res242, "242. gerarGradienteDinamicoHoraDia gerou background atmosfrico");

  // 243. Borda neon pulsante em destaque
  const res243 = ev(`
    (() => {
      const el = document.createElement("div");
      const okBorda = aplicarBordaNeonPulsante(el, "amarelo");
      return okBorda && el.classList.contains("borda-neon-pulsante");
    })()
  `);
  ok(res243, "243. aplicarBordaNeonPulsante aplicou animao e cor de realce");

  // 244. Efeito de textura de papel amassado
  const res244 = ev(`
    (() => {
      const p = gerarEfeitoPapelAmassado("baixa");
      return p.includes("radial-gradient");
    })()
  `);
  ok(res244, "244. gerarEfeitoPapelAmassado gerou estilo ttil skeuomrfico");

  // 245. Transio 3D flipping card
  const res245 = ev(`
    (() => {
      const el = document.createElement("div");
      const okFlip = aplicarTransicaoFlippingCard(el);
      return okFlip && el.classList.contains("card-flip-3d");
    })()
  `);
  ok(res245, "245. aplicarTransicaoFlippingCard habilitou perspectiva 3D");

  // 246. Chuva de partculas temticas caindo suavemente
  const res246 = ev(`
    (() => {
      const c = document.createElement("div");
      document.body.appendChild(c);
      const total = gerarEfeitoChuvaParticulasCenario(c, 5);
      const filhos = c.querySelectorAll(".chuva-particula-queda").length;
      c.remove();
      return total === 5 && filhos === 5;
    })()
  `);
  ok(res246, "246. gerarEfeitoChuvaParticulasCenario inseriu partculas de ambiente");

  // 247. Efeito de mquina de escrever nas falas do Prumi
  const res247 = ev(`
    (() => {
      const el = document.createElement("p");
      const cancelar = aplicarEfeitoTextoDigitando(el, "Ol!", 10);
      return typeof cancelar === "function";
    })()
  `);
  ok(res247, "247. aplicarEfeitoTextoDigitando iniciou digitao gradual");

  // 248. Indicador circular de progresso SVG compacto
  const res248 = ev(`
    (() => {
      const ind = gerarIndicadorProgressoCircularSvg(50, 20);
      return ind.raio === 20 && ind.porcentagem === 50 && ind.circunferencia > 0;
    })()
  `);
  ok(res248, "248. gerarIndicadorProgressoCircularSvg calculou parmetros geomtricos");

  // 249. Elevao elstica suave ao pairar
  const res249 = ev(`
    (() => {
      const el = document.createElement("button");
      const okZoom = aplicarZoomHoverSuave(el);
      return okZoom && el.classList.contains("zoom-hover-suave");
    })()
  `);
  ok(res249, "249. aplicarZoomHoverSuave adicionou classe de microinterao ttil");

  // 250. Emblema e status descritivo de conectividade
  const res250 = ev(`
    (() => {
      const sNuvem = gerarEmblemaStatusConexao("nuvem");
      const sOff = gerarEmblemaStatusConexao("offline");
      return sNuvem.classe === "status-nuvem" && sOff.classe === "status-offline";
    })()
  `);
  ok(res250, "250. gerarEmblemaStatusConexao mapeou estados de rede");

  await fechar();
  return erros;
};
