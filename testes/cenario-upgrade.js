// Testes do Upgrade Visual e Iluminação do Cenário (Estética Indie Game / Fantasia 2.5D)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar que quartoSVG() agora orquestra defs volumétricos, sombras e feixe de luz
    const quartoUpgradeOk = ev(`
      (() => {
        if (typeof quartoSVG !== "function") return false;
        const svg = quartoSVG();
        const temDefsLuz = svg.includes("luz-janela-beam") || svg.includes("luz-luar-beam");
        const temFiltroSombra = svg.includes("sombra-suave-direcional") && svg.includes("sombra-contato-ao");
        const temCamadaSombras = svg.includes("camada-sombras-cenario");
        const temLuzVolumetrica = svg.includes("camada-luz-janela") && svg.includes("cenario-poeira-mote");
        const temRodapeArtesanal = svg.includes("rodape-artesanal");
        return temDefsLuz && temFiltroSombra && temCamadaSombras && temLuzVolumetrica && temRodapeArtesanal;
      })()
    `);
    ok(quartoUpgradeOk, "quartoSVG() inclui luz volumétrica, partículas de poeira mágica, sombras de contato e rodapé artesanal");

    // 2. Validar aprimoramento de materiais (assoalho com veios e chanfros, janela com reflexos, cama 3D)
    const materiaisOk = ev(`
      (() => {
        const chaoAprimorado = aprimorarChaoAssoalho("<rect width='360' height='64'/>", 360, 64);
        const temVeios = chaoAprimorado.includes("veios-madeira-chao");
        const temBisel = chaoAprimorado.includes("chao-profundidade-grad");

        const janelaAprimorada = aprimorarJanelaVisual("<rect width='82' height='66'/>");
        const temReflexoVidro = janelaAprimorada.includes("cenario-vidro-reflexo");

        const camaAprimorada = aprimorarCamaVisual("<rect width='120' height='60'/>");
        const temVolumeCama = camaAprimorada.includes("cama-volume-3d");

        return temVeios && temBisel && temReflexoVidro && temVolumeCama;
      })()
    `);
    ok(materiaisOk, "Funções de materiais enriquecem chão (veios/bisel), janela (reflexos especulares) e cama (volume 3D)");
  } finally {
    fechar();
  }
  return erros;
};
