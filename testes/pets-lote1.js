// Testes Pets & Mascotes Encantados: Lote 1 (Itens 201 a 250)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "prumi";
    commit();
    render();
  `);
  await espera(30);

  // P201 a P210: FSM e Emoções
  const res201a210 = ev(`
    (() => {
      const fsm = inicializarMaquinaEstadosHumorPet("ocioso");
      const transOk = fsm.transicaoPara("radiante");
      const dec = calcularDecaimentoHumorPet(5, true);
      const spl = interpolarCoordenadasExpressaoSpline(0, 10, 0.5);
      const mat = obterMatrizPersonalidadePet("zen");
      const af = calcularAfetoLongoPrazoPet(40, 100);
      const mem = gerarMemoriaEpisodicaPet({ melhorDia: "quarta-feira", horasTotal: 10 });
      const voz = sintetizarVozProceduralPet("alegre");
      const pup = calcularDilatacaoPupilar("claro", false);
      const clim = calcularReacaoClimaticaPet("inverno", 12);
      const resp = gerarCicloRespiracaoInvoluntaria(1800);
      return fsm.estadoAtual === "radiante" &&
             transOk === true &&
             dec.pontuacaoHumor <= 40 &&
             spl === 5 &&
             mat.paciencia === 95 &&
             af.tituloAfeto.includes("Companheiro") &&
             mem.includes("quarta-feira") &&
             voz.freqBase === 580 &&
             pup.raioPupila === 3.5 &&
             clim.usaCachecol === true &&
             resp.classe === "pet-respiracao-involuntaria";
    })()
  `);
  ok(res201a210, "P201 a P210: FSM de 8 estados, decaimento de humor, pupila e clima validados");

  // P211 a P220: Física de Mola e Carinho
  const res211a220 = ev(`
    (() => {
      const mola = calcularMassaMolaPet(0, 100, 0);
      const sq1 = aplicarDeformacaoSquashStretch(6, false);
      const sq2 = aplicarDeformacaoSquashStretch(0, true);
      const olho = calcularRastreamentoOlhosCursor(50, 50, 100, 50, 5);
      const piscar = gerarTempoProximoPiscar(0.5);
      const cosq = processarCosquinhasBarriga(8);
      const iner = calcularInerciaArrastoPet(10, 0);
      const part = gerarParticulasQuiqueChao(200, 100);
      const tq = diferenciarTipoToquePet(700);
      const ron = gerarPadraoRonromHaptico();
      const tex = obterPropriedadesTexturaPet("prumi");
      return mola.posicao > 0 &&
             sq1.classe === "pet-squash-pulo" &&
             sq2.classe === "pet-squash-queda" &&
             olho.deltaX === 5 &&
             piscar.intervaloMs >= 3000 &&
             cosq.rindo === true &&
             iner.anguloPernasGraus === -15 &&
             part.length === 2 &&
             tq.tipo === "abraço_apertado" &&
             ron.length === 6 &&
             tex.sensacao.includes("gelatinoso");
    })()
  `);
  ok(res211a220, "P211 a P220: Física spring-mass, squash & stretch, rastreamento ocular e cócegas validados");

  // P221 a P230: Ciclo Circadiano
  const res221a230 = ev(`
    (() => {
      const pij = verificarHoraPijamaPet("23:15");
      const zzz = gerarParticulasSonoZzz(100, 100);
      const esp = gerarAnimacaoEspreguicar("07:30");
      const son = verificarSonecaVespertina("13:45", 12);
      const pens = gerarPensamentoSonhoPet(0);
      const luz = ajustarIluminacaoQuartoPet(true, 23);
      const madr = gerarAvisoMadrugadaCarinhoso(3);
      const curv = calcularCurvaEnergiaCircadianaPet(10, 10);
      const hig = gerarRotinaHigieneNoturna();
      const sonamb = gerarEventoSonambulismo();
      return pij.vesteToucaDormir === true &&
             zzz.length === 3 &&
             esp.espreguicando === true &&
             son.tirandoSoneca === true &&
             pens.icone.includes("💧") &&
             luz.luzApagada === true &&
             madr.ehMadrugada === true &&
             curv.vitalidadePorcentagem === 100 &&
             hig.prontoParaDormir === true &&
             sonamb.caminhandoDormindo === true;
    })()
  `);
  ok(res221a230, "P221 a P230: Hora do pijama, soneca da tarde, sono Zzz e aviso de madrugada validados");

  // P231 a P240: Alimentação e Cuidados
  const res231a240 = ev(`
    (() => {
      const tig = calcularNivelTigelaAguaPet(8);
      const bisc = concederBiscoitoEstrela("08:15");
      const frut = colherFrutaPomarMetas(8);
      const cha = prepararChaCamomilaPet();
      const mast = calcularEstagioMastigacaoComida(3, 4);
      const mig = gerarMigalhasLimpezaChao(3);
      const dig = calcularEfeitoDigestaoEnergizante(20);
      const cup = gerarCupcakeAniversarioPet(true);
      const poc = aplicarPocaoHidratacaoConcentrada({});
      const fav = obterPratoFavoritoPet("gato");
      return tig.tigelaCheia === true &&
             bisc.ganhouBiscoito === true &&
             frut.frutasGanhas === 2 &&
             cha.bebida.includes("Camomila") &&
             mast.mordidasRestantes === 1 &&
             mig.length === 3 &&
             dig.noPicoEnergia === true &&
             cup.velinhaAcesa === true &&
             poc.hidratacao === 100 &&
             fav.icone.includes("🐟");
    })()
  `);
  ok(res231a240, "P231 a P240: Tigela d'água, biscoito estrela, pomar das metas e cupcake de aniversário validados");

  // P241 a P250: Guarda-Roupa Modular
  const res241a250 = ev(`
    (() => {
      const cam = ordenarCamadasSvgPet({ corpo: "capa", cabeca: "chapeu" });
      const pend = calcularFisicaPendularCachecol(4);
      const ocl = gerarReflexoOculosSvg(20, 10);
      const moch = gerarMiniaturaMochilaLivroLendo({ titulo: "Sapiens" });
      const somPass = obterSomPassosCalcado("tenis");
      const aura = gerarAuraNivelEstudoPet(60);
      const filt = gerarFiltroTingimentoRoupasHsl(180, 80, 50);
      const prov = calcularZoomProvadorLoja("cabeca");
      const conj = obterConjuntoTematicoCompleto("mago");
      const slots = gerarSlotsLooksFavoritos([], { id: "look1" });
      return cam.length === 7 &&
             pend.anguloOscilacaoGraus === 16 &&
             ocl.includes("<rect") &&
             moch.visivelNaMochila === true &&
             somPass.efeitoSonoro === "squeak_macio" &&
             aura.classeAura.includes("aura-roxo") &&
             filt.includes("hue-rotate") &&
             prov.zoom === 2.0 &&
             conj.nome.includes("Arcanista") &&
             slots.length === 1;
    })()
  `);
  ok(res241a250, "P241 a P250: Camadas SVG, física de cachecol, auras por nível e provador 2X validados");

  await fechar();
  return erros;
};
