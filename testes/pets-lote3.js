// Testes Pets & Mascotes Encantados: Lote 3 (Itens 301 a 350)
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

  // P301 a P310: Árvore de Talentos e Habilidades
  const res301a310 = ev(`
    (() => {
      const arv = inicializarArvoreHabilidadesPet("prumi");
      const desb = desbloquearHabilidadePet(arv, "passiva_vigor_agua", 1);
      const pts = calcularPontosTalentoDisponiveis(3, 60);
      const foc = aplicarPassivaMascoteFoco(true, 25);
      const ser = aplicarPassivaMascoteSerenidade(true, "alto");
      const vig = aplicarPassivaMascoteVigor(true, 8);
      const rst = resetarArvoreTalentosPet(arv, 20);
      const svg = gerarVisualizadorArvoreHabilidadesSvg(arv);
      const mae = calcularNivelMaestriaRamo(arv, "foco");
      const emb = gerarEmblemaMestreEspecialidade("foco");
      return arv.ramos.foco.nivel === 1 &&
             desb.sucesso === true &&
             pts === 9 &&
             foc.gotasExtras === 5 &&
             ser.humorPreservado === true &&
             vig.afetoMultiplicador === 1.5 &&
             rst.arvoreResetada.pontosDisponiveis === 6 &&
             svg.includes("<svg") &&
             mae.porcentagem === 20 &&
             emb.titulo.includes("Mestre");
    })()
  `);
  ok(res301a310, "P301 a P310: Árvore de talentos, passivas de foco/zen e reset de pontos validados");

  // P311 a P320: Sentimentos Complexos e Afeto
  const res311a320 = ev(`
    (() => {
      const sent = calcularSentimentoCompostoPet("radiante", 90, 80);
      const fala = gerarFalaAconselhamentoEmocional("ansioso", "prumi");
      const memo = registrarMomentoMarcantePet("Passeio");
      const afin = calcularNivelAfinidadeMutua(25);
      const adm = gerarAnimacaoOlharDeAdmiracao("prumi");
      const abr = gerarEfeitoAbracoEnvolventePet();
      const auto = sugerirAutoCuidadoGentilPet(4);
      const res = calcularResilienciaEmocionalPet(2);
      const cart = gerarCartaMensalDoMascote("Kawan", "Outubro");
      const pos = gerarPoseConfiancaTotal(90);
      return sent.includes("Pleno") &&
             fala.includes("Feche os olhos") &&
             memo.emocao === "inestimável" &&
             afin.afinidadePorcentagem === 100 &&
             adm.queixoApoiadoNosBracos === true &&
             abr.animacao.includes("abraco") &&
             auto.precisaPausa === true &&
             res.naoFicaBravo === true &&
             cart.includes("Kawan") &&
             pos.pose === "dormindo_barriga_para_cima";
    })()
  `);
  ok(res311a320, "P311 a P320: Sentimentos sutis, apoio emocional e pose de confiança total validados");

  // P321 a P330: Passeios e Descobertas
  const res321a330 = ev(`
    (() => {
      const pas = iniciarPasseioVirtualParque("gato", 30);
      const desc = calcularDescobertasPasseio(30, 0.5);
      const rel = gerarRelatorioAventuraPet(pas);
      const tes = coletarTesouroPasseio(desc.tesouroEncontrado);
      const can = calcularCansacoPosPasseio(30);
      const bio = desbloquearNovoBiomaPasseio(25);
      const fot = gerarFotoPostalDoPasseio("Lago", "prumi");
      const enc = calcularEncontroAnimaisSelvagens(0.2);
      const mus = gerarMusicaAmbientePasseio("Bosque");
      const diar = gerarDiarioDoExplorador(6);
      return pas.emAndamento === true &&
             desc.gotasBonus > 0 &&
             rel.retornouEmSeguranca === true &&
             tes.coletado === true &&
             can.soninhoGostoso === true &&
             bio.total === 4 &&
             fot.classe === "polaroid-passeio-card" &&
             enc.animal !== "" &&
             mus.elementosSonoros.length === 3 &&
             diar.seloExplorador.includes("Explorador");
    })()
  `);
  ok(res321a330, "P321 a P330: Passeios virtuais, tesouros, biomas e polaroids de aventura validados");

  // P331 a P340: Feng Shui e Móveis do Quarto
  const res331a340 = ev(`
    (() => {
      const feng = calcularPontuacaoFengShuiQuarto([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
      const inter = interagirPetComMovel("gato", "estante");
      const arr = gerarAnimacaoArranharArranhador("gato");
      const cx = gerarAnimacaoEsconderNaCaixaPapelao();
      const lar = acenderLareiraAconchegante(true);
      const plt = gerarPlantaInteriorCrescimento(6);
      const vin = tocarDiscoVinilVitrola("Lofi");
      const grp = reorganizarMoveisGridSnap(124, 87, 20);
      const chuv = gerarEfeitoJanelaChuvosaQuarto(true);
      const conf = calcularNivelConfortoGeralQuarto([{ conforto: 20 }, { conforto: 35 }]);
      return feng.scoreFengShui === 72 &&
             inter.acaoDescricao.includes("subiu no topo") &&
             arr.afetoGanho === 3 &&
             cx.dentroDaCaixa === true &&
             lar.lareiraAcesa === true &&
             plt.estagioNome.includes("Planta Frondosa") &&
             vin.notasMusicaisFlutuando === true &&
             grp.x === 120 && grp.y === 80 &&
             chuv.classeEfeito.includes("janela-chuvosa") &&
             conf.recuperacaoEnergiaAcelerada === true;
    })()
  `);
  ok(res331a340, "P331 a P340: Feng Shui do quarto, arranhador, vitrola e grid snap de móveis validados");

  // P341 a P350: Genética Mágica e Certidão de Nascimento
  const res341a350 = ev(`
    (() => {
      const gen = gerarVariacaoCoresGeneticaPet("raposa", 1);
      const rar = calcularRaridadePadraoPelagem("Raposa Ártica Albina");
      const bril = aplicarEfeitoParticulasBrilhoCorporal("poeira_estelar");
      const aces = gerarAcessorioPersonalizadoArtesanal("coleira", "#00ff00", "Bolinha");
      const comp = calcularCompatibilidadeCosmetica("cartola", "oculos_sol");
      const asas = gerarAsasMagicasMascote("fada");
      const rast = gerarEfeitoRastroPassosMagicos("flores");
      const salv = salvarPresetGeneticoPet({ especie: "gato", cor: "#ff0000" });
      const carg = carregarPresetGeneticoPet(salv.codigoPreset);
      const cert = gerarCertificadoNascimentoMascote({ nome: "Prumi" });
      return gen.especie === "raposa" &&
             rar.raridade === "mistico" &&
             bril.animacao.includes("brilhante") &&
             aces.gravacaoPlacaMetal === "Bolinha" &&
             comp.compativel === true &&
             asas.flutuandoLeve === true &&
             rast.particulasPorSegundo === 4 &&
             carg.especie === "gato" &&
             cert.guardiao === "Kawan";
    })()
  `);
  ok(res341a350, "P341 a P350: Variação genética rara, presets compartilháveis e certidão de nascimento validados");

  await fechar();
  return erros;
};
