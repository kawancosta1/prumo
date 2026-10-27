// Testes Pets & Mascotes Encantados: Lote 4 (Itens 351 a 400)
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

  // P351 a P360: Reações, Pomodoro e Companhia
  const res351a360 = ev(`
    (() => {
      const reac = gerarReacaoPetConquistaDificil("ouro");
      const comp = calcularNivelCompanheirismoPomodoro(10);
      const liv = gerarAnimacaoPetDormindoComLivro();
      const gul = processarPetGuloseimaFavorita({}, "Salmão");
      const pipa = gerarAnimacaoPetEmpinandoPipa();
      const adapt = calcularInteligenciaAdaptativaPet({ horarioProcrastinacao: "15:00" });
      const suss = gerarSussurroIncentivoPomodoro(4);
      const pose = gerarPoseFotoCabine3D("prumi", "pulo");
      const fid = calcularNivelFidelidadePet(365);
      const chuv = gerarReacaoPetClimaChuvoso();
      return reac.tier === "ouro" &&
             comp.nivelSincronia === 6 &&
             liv.queixoNaLombada === true &&
             gul.felicidade === 100 &&
             pipa.alturaMetros === 15 &&
             adapt.horarioAtencao === "15:00" &&
             suss.sussurro.includes("minutinhos") &&
             pose.prontoParaDownload === true &&
             fid.fidelidadeSuprema === true &&
             chuv.capaChuvaAmarela === true;
    })()
  `);
  ok(res351a360, "P351 a P360: Comemoração cinematográfica, fidelidade de 365 dias e inteligência adaptativa validados");

  // P361 a P370: Estrelas, Música e Doutorado
  const res361a370 = ev(`
    (() => {
      const est = gerarEventoEstrelaCadenteNoQuarto();
      const frag = coletarFragmentoEstrelaCadente();
      const mus = gerarAnimacaoPetTocandoInstrumento("flauta");
      const harm = calcularHarmoniaMusicalMascote(60);
      const camuf = gerarEfeitoCamuflagemMascote("rock");
      const pesc = gerarAnimacaoPetPescandoGotas();
      const gula = calcularNivelGulaPet(15);
      const somVoz = typeof gerarBalbucioVozSintetizadaWebAudio === "function";
      const pena = gerarAnimacaoTrocaDePenaOuPeloSazonal();
      const diplo = gerarDiplomaMascoteDoutorHonorario(210);
      return est.estrelaCadenteVisivel === true &&
             frag.gotasGanhas === 10 &&
             mus.instrumento === "flauta" &&
             harm.tempoCompassoMs === 1000 &&
             camuf.corAuraAdaptada === "#e11d48" &&
             pesc.pescandoNoPier === true &&
             gula.barriguinhaCheia === true &&
             somVoz &&
             pena.peninhasMagicasRecolhidas === 3 &&
             diplo.doutoradoConcedido === true;
    })()
  `);
  ok(res361a370, "P361 a P370: Estrela cadente, instrumentos musicais, camuflagem e diploma honorário validados");

  // P371 a P380: Jogos e Cuidados Diários
  const res371a380 = ev(`
    (() => {
      const fort = gerarAnimacaoPetConstruindoForteAlmofadas();
      const pata = gerarMinijogoAdivinheEmQualPataEsta("esquerda");
      const acerto = calcularProbabilidadeAcertoBrincadeira("esquerda", "esquerda");
      const brilho = gerarEfeitoBrilhoMagicoPelagem("mistico");
      const jorn = gerarAnimacaoPetLendoJornalManha();
      const heroi = gerarPosturaSuperHeroiPet();
      const fel = calcularMultiplicadorFelicidadeGeral({ agua: 90, sono: 90, carinho: 90, tarefas: 90 });
      const cor = gerarEfeitoCoracaoBateAsas();
      const sem = gerarAnimacaoPetPlantandoSemente();
      const colh = colherGotaDaPlantaPet();
      return fort.almofadasEmpilhadas === 5 &&
             pata.pataPremiada === "esquerda" &&
             acerto.acertou === true &&
             brilho.brilhoPerolado === true &&
             jorn.oculosNaPontaDoNariz === true &&
             heroi.pose === "heroi_destemido" &&
             fel.felicidadeScore === 90 &&
             cor.icone.includes("🕊️") &&
             sem.tempoColheitaHoras === 24 &&
             colh.gotasColhidas === 5;
    })()
  `);
  ok(res371a380, "P371 a P380: Forte de almofadas, jogo da patinha premiada e cultivo de sementes validados");

  // P381 a P390: Harmonia em Dupla e Amizade Animal
  const res381a390 = ev(`
    (() => {
      const son = gerarSonecaCompartilhadaModoDupla("prumi", "gato");
      const troc = gerarAnimacaoTrocaDePresenteEntrePets("gato", "raposa");
      const svgArco = gerarEfeitoAmizadeEntrePetsSvg();
      const harm = calcularNivelHarmoniaBichinhos({ streak: 20 });
      const emb = gerarEmblemaMelhoresAmigosAnimais();
      const out = gerarAnimacaoPetApanhandoFolhaOutono();
      const neve = gerarAnimacaoPetFazendoBonecoNeve();
      const cosm = gerarEfeitoAuraCosmicaPet();
      const cresc = calcularVelocidadeCrescimentoFilhote(60);
      const rede = gerarAnimacaoPetBocejandoNaRede();
      return son.ambosDormindo === true &&
             troc.presente.includes("Frutinha") &&
             svgArco.includes("<svg") &&
             harm.nivelAmizadePets === 5 &&
             emb.trofeu.includes("Aliança Animal") &&
             out.pegouNoAr === true &&
             neve.bonecoDeNeve === true &&
             cosm.luasOrbitando === 3 &&
             cresc.adulto === true &&
             rede.naRede === true;
    })()
  `);
  ok(res381a390, "P381 a P390: Soneca conjunta em dupla, amizade animal, aura cósmica e boneco de neve validados");

  // P391 a P400: Interações Sensoriais Finais e Conclusão do Eixo Pets
  const res391a400 = ev(`
    (() => {
      const post = gerarLembretePosturalPet();
      const can = gerarAnimacaoPetBebendoAguaCanudinho();
      const estGiro = gerarEfeitoEstrelasGirandoAposGiro();
      const apeg = calcularPontuacaoApegoEterno({ dias: 100, carinhos: 200 });
      const guar = gerarAnimacaoPetSegurandoGuardaChuva();
      const peg = gerarEfeitoPegadaLuminosaNoEscuro();
      const sin = gerarAnimacaoPetTocandoSininhoAlarme();
      const cart = gerarCartaDespedidaDoDiaPet();
      const trof = gerarTrofeuGuardiãoDosMascotes();
      const conc = concluirEixoPets600("2.3.0");
      return post.alertaPostura === true &&
             can.bebendoComCanudo === true &&
             estGiro.girou360 === true &&
             apeg.scoreApegoEterno > 0 &&
             guar.guardaChuvaAmarelo === true &&
             peg.classe === "pegada-fosforescente-noite" &&
             sin.bateuNoSininho === true &&
             cart.icone.includes("🌙") &&
             trof.honrariaMaxima === true &&
             conc.totalMelhoriasConcluidas === 200 &&
             conc.hashIntegridade === "PRUMO-PETS-200-VERIFIED";
    })()
  `);
  ok(res391a400, "P391 a P400: Lembrete postural, pegada fosforescente e selo oficial de 200 itens concluídos em Pets!");

  await fechar();
  return erros;
};
