// Testes Pets & Mascotes Encantados: Lote 2 (Itens 251 a 300)
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

  // P251 a P260: Espécies e Minijogos
  const res251a260 = ev(`
    (() => {
      const esp = inicializarEspeciePet("raposa");
      const oci = obterAnimacaoOciosaEspecie("morcego");
      const evo = calcularEstagioEvolucaoMascote(700);
      const fala = gerarBalaoDialogoProceduralPet("focado", 14, "resolver contas");
      const dedos = processarCarinhoMultiploDedos(3);
      const grav = gerarMinijogoPegarGraveto(100);
      const bolha = gerarBalaoDeSabaoInterativo(50, 50);
      const estouro = bolha.estourar();
      const aro = gerarTruquePularAro(4);
      const amb = calcularFelicidadePorAmbiente(4);
      const mus = gerarReacaoMascoteMusica(60);
      return esp.especie === "raposa" &&
             oci.animacao.includes("ponta_cabeca") &&
             evo.estagio === 3 &&
             fala.includes("resolver contas") &&
             dedos.ronronandoIntenso === true &&
             grav.petCorrendo === true &&
             estouro.gotasRecompensa === 1 &&
             aro.aptoParaAcrobacia === true &&
             amb.bonusAmbiente === 20 &&
             mus.duracaoCompassoSegundos === 1.0;
    })()
  `);
  ok(res251a260, "P251 a P260: Espécies (raposa/morcego), balões contextuais e bolhas de sabão validados");

  // P261 a P270: Visitas e Cuidados Avançados
  const res261a270 = ev(`
    (() => {
      const vis = receberMascoteVisitanteAmigo("coruja", "Beatriz");
      const inter = gerarInteracaoDoisPetsQuarto("prumi", "gato");
      const desp = despedidaMascoteVisitante("coruja");
      const diar = gerarRegistroDiarioMascote({ carinho: "muito afeto" });
      const brinq = calcularPreferenciaBrinquedoPet("gato");
      const susto = gerarAnimacaoSustoComico();
      const brilho = gerarEfeitoBrilhoOlhosAmor(90);
      const vitor = gerarPoseVitoriaConquista("10 dias de foco");
      const banho = gerarBanhoEspumaMascote();
      const sec = calcularSecagemPelagemPet(3);
      return vis.visitanteEspecie === "coruja" &&
             inter.atividade.includes("cochilo") &&
             desp.gotasGanhas === 5 &&
             diar.includes("muito afeto") &&
             brinq.icone.includes("🧶") &&
             susto.olhosArregalados === true &&
             brilho.olhosCoracao === true &&
             vitor.pose === "trofeu_erguido" &&
             banho.naBanheira === true &&
             sec.seco === true;
    })()
  `);
  ok(res261a270, "P261 a P270: Pets visitantes, brinquedos por espécie e banho relaxante validados");

  // P271 a P280: Sons, Truques e Efeitos
  const res271a280 = ev(`
    (() => {
      const comp = gerarCompanhiaPetAbaEspecifica("estudos");
      const disf = gerarDisfarceMascote("festa");
      const custo = calcularCustoTreinamentoTruque("media");
      const diplo = gerarDiplomaTreinadorMascotes(4);
      const svgEvo = gerarEfeitoEvolucaoMascoteSvg();
      const energ = calcularConsumoEnergiaBrincadeiras(20);
      const som1 = typeof gerarSomRonromWebAudio === "function";
      const som2 = typeof gerarSomPioCoruja === "function";
      const som3 = typeof gerarSomEcoMorcego === "function";
      const som4 = typeof gerarSomLatidinhoRaposa === "function";
      return comp.acessorio.includes("Óculos") &&
             disf.disfarce.includes("Bigode") &&
             custo.custoGotas === 30 &&
             diplo.autorizado === true &&
             svgEvo.includes("<svg") &&
             energ.energiaGasta === 40 &&
             som1 && som2 && som3 && som4;
    })()
  `);
  ok(res271a280, "P271 a P280: Companhia por aba, síntese sonora de 4 espécies e diploma validados");

  // P281 a P290: Hábitos, Caminhas e Conquistas
  const res281a290 = ev(`
    (() => {
      const cam = gerarCaminhaCustomizadaPet("folhas");
      const pisc = calcularVelocidadePiscadelasAnsiedade(5);
      const cord = gerarBrinquedoCordaPuxar();
      const peg = gerarEfeitoPegadaTintaColorida(50, 80, "#ff0000");
      const el = document.createElement("div");
      const elP = document.createElement("div");
      elP.className = "pegada-tinta-anim";
      el.appendChild(elP);
      const limp = limparPegadasTintaComEsponja(el);
      const pose = gerarPoseDormindoEncolhidinho();
      const boc = gerarEfeitoBocejoContagioso();
      const bon = calcularBonusAfetoPorConsistencia(10);
      const rec = gerarReacaoPetAoBaterRecorde("Novo Foco");
      const med = gerarMedalhaAmigoMaisFiel(60);
      return cam.nome.includes("Folhas") &&
             pisc.estadoMental.includes("zen") &&
             cord.disputaEquilibrada === true &&
             peg.icone === "🐾" &&
             limp === 1 &&
             pose.caudaEnrolada === true &&
             boc.bocejando === true &&
             bon.multiplicadorAfeto > 1.0 &&
             rec.animacao.includes("cambalhota") &&
             med.brilhoMetal === "dourado";
    })()
  `);
  ok(res281a290, "P281 a P290: Caminha de folhas, limpeza de pegadas, bocejo e medalha de fidelidade validados");

  // P291 a P300: Interações Finais do Eixo Pets (Lote 1)
  const res291a300 = ev(`
    (() => {
      const suss = gerarSussurroDormirPet("Prumi");
      const laser = gerarAnimacaoPerseguirLaser(100, 100);
      const mini = gerarMascoteMiniaturaBarraNavegacao();
      const soc = calcularNivelSociabilidadePet(6);
      const flor = gerarEfeitoFlorNaCabeca("margarida");
      const banq = gerarBanqueteComemorativoMascotes(["prumi", "gato"]);
      const somb = gerarSombraProjetadaDinamicaPet(1.2, 0.8);
      const tele = gerarEfeitoTeletransporteMagicoPet();
      const ind = calcularIndiceCompanheirismoVitalicio({ dias: 30, horasFoco: 50, carinhos: 80 });
      const conc = concluirMarcoPets300("2.2.0");
      return suss.includes("Boa noite") &&
             laser.petCorrendo === true &&
             mini.iconeMini === "🐾" &&
             soc.tituloSocial.includes("Anfitrião") &&
             flor.nome.includes("Margarida") &&
             banq.celebrando === true &&
             somb.classe === "sombra-projetada-pet" &&
             tele.duracaoSegundos === 1.2 &&
             ind.pontuacaoGeral > 0 &&
             conc.itensConcluidos === 100 &&
             conc.hashIntegridade === "PRUMO-PETS-LOTE1-VERIFIED";
    })()
  `);
  ok(res291a300, "P291 a P300: Perseguir laser, flor na cabeça, banquete e marco de 100 itens de Pets validados");

  await fechar();
  return erros;
};
