// Testes Estante & Vida Literária: Lote 2 (Itens 451 a 500)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "estante";
    commit();
    render();
  `);
  await espera(30);

  // E451 a E460: Clube do Livro da Dupla e Lombadas Customizadas
  const res451a460 = ev(`
    (() => {
      const cl = inicializarClubeLivroDupla("Dom Casmurro", 40);
      const par = calcularParidadeLeituraDupla(50, 52);
      const not = enviarMarcadorPaginaAmigo("Carol", 120);
      const fita = gerarFitaMarcadorDuplaConectada();
      const deb = criarDebateCapituloDupla("Capítulo 3", "Capitu traiu?");
      const cons = calcularConsistenciaLeituraSemanal([true, true, true, true, true, false, false]);
      const lomSvg = gerarLombadaPersonalizadaSvg(30, 180, "#2c3e50", "Memórias");
      const tex = gerarEfeitoPapelTexturaPagina();
      const tmpCap = calcularTempoMedioPorCapitulo(14, 0.7);
      const emp = gerarMarcadorLivroEmprestado("Marcos", "2026-10-27");
      return cl.livro === "Dom Casmurro" &&
             par.juntosNoCapitulo === true &&
             not.icone === "🔖" &&
             fita.sintoniaLeitura === true &&
             deb.capitulo === "Capítulo 3" &&
             cons.streakLeituraAtivo === true &&
             lomSvg.includes("<svg") &&
             tex.classe === "papel-polen-soft" &&
             tmpCap.minutosEstimados === 20 &&
             emp.amigo === "Marcos";
    })()
  `);
  ok(res451a460, "E451 a E460: Clube do livro da dupla, paridade de leitura, textura Pólen Soft e lombada SVG validados");

  // E461 a E470: Ex-Libris, Filtros e Conforto Visual
  const res461a470 = ev(`
    (() => {
      const ex = gerarSeloExLibrisPersonalizado("Kawan Costa", "🦉");
      const dec = agruparLivrosPorSeculoOuDecada([{ titulo: "Obra 1", anoPublicacao: 1984 }]);
      const sug = gerarSugestaoProximaLeitura([{ status: "quero-ler", categoria: "Filosofia" }], { categoria: "Filosofia" });
      const dist = calcularPaginasEquivalentesDistancia(5000);
      const rep = gerarRelatorioTrimestralLeitura("Q4 2026", [{ status: "lido" }]);
      const amb = aplicarModoNoturnoComLuzAmbarLeitura(true);
      const el = document.createElement("div");
      const abr = gerarAnimacaoAbrirLivro3D(el);
      const comp = calcularIndiceCompletudeLeiturasAno(12, 10);
      const fras = gerarFraseMotivacionalLiteraria(0);
      const badg = gerarBadgesColecionadorEstante(30);
      return ex.includes("EX LIBRIS") &&
             dec["1980s"].length === 1 &&
             sug.livroSugerido.categoria === "Filosofia" &&
             dist.totalMetros === 1100 &&
             rep.livrosFinalizados === 1 &&
             amb.classe === "modo-leitura-ambar" &&
             abr &&
             comp.porcentagem >= 80 &&
             fras.autor.includes("Borges") &&
             badg.tituloBadge.includes("Filósofo");
    })()
  `);
  ok(res461a470, "E461 a E470: Selo Ex-Libris, modo âmbar 2700K, recomendação de leitura e badges de leitor validados");

  // E471 a E480: Audiobooks, Sons e Scroll
  const res471a480 = ev(`
    (() => {
      const aban = gerarGavetaLivrosAbandonados([{ id: "liv-1" }]);
      const apr = calcularPorcentagemAproveitamentoLeitura(40, 20);
      const aud = gerarListaAudiobooksIntegrados([{ titulo: "Sapiens", minutosTotais: 600, minutosOuvidos: 300 }]);
      const conv = converterMinutosAudioEmPaginas(100, 0.6);
      const somFolh = typeof gerarEfeitoSomFolhearPaginaWebAudio === "function";
      const top3 = gerarCardResumoTop3Leituras([{ titulo: "A", avaliacaoEstrelas: 5 }, { titulo: "B", avaliacaoEstrelas: 4 }, { titulo: "C", avaliacaoEstrelas: 5 }]);
      const dens = calcularDensidadeLiterariaMes([60, 20, 80]);
      const marcCap = gerarMarcadorCapituloAtualSvg("Capítulo 1");
      const rem = gerarIndiceRemissivoPessoalNotas([{ topico: "Estoicismo" }, { topico: "Foco" }]);
      const scrl = salvarPosicaoScrollEstante(500);
      return aban.livrosPausados.length === 1 &&
             apr.densidadePaginasPorMinuto === 0.5 &&
             aud[0].porcentagem === 50 &&
             conv.paginasEquivalentes === 60 &&
             somFolh &&
             top3.podioCompleto === true &&
             dens.diasRecordeLeitura === 2 &&
             marcCap.includes("Capítulo 1") &&
             rem.totalTopicos === 2 &&
             scrl.scrollSalvoY === 500;
    })()
  `);
  ok(res471a480, "E471 a E480: Audiobooks integrados, som de folhear página, densidade de leitura e índice remissivo validados");

  // E481 a E490: Curiosidades e Estatura de Livros
  const res481a490 = ev(`
    (() => {
      const esp = gerarFiltroPorEspessuraLivro([{ paginasTotais: 150 }, { paginasTotais: 600 }], "curtos");
      const tempo = calcularTempoTotalDedicadoLeitura([{ tempoMinutos: 60 }, { tempoMinutos: 120 }]);
      const flut = gerarAnimacaoLivroFlutuandoAoConcluir();
      const fitaSvg = gerarMarcadorDePaginaFitaSvg("#10b981");
      const cent = verificarConquistaLivroCentenario({ anoPublicacao: 1880 });
      const sint = gerarSinteseAprendizadoLeitura({ titulo: "Walden" }, "Viver com simplicidade");
      const caf = calcularEquivalenciaCafePorPaginas(450);
      const voz = gerarAnotacaoVozParaFichamento({ tamanho: 40000 });
      const est = gerarVisualizadorEstaturaPilhaLivros([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
      const ouro = gerarEfeitoBrilhoOuroLombadaClassicos();
      return esp.length === 1 &&
             tempo.totalMinutos === 180 &&
             flut.animacao.includes("flutua") &&
             fitaSvg.includes("<polygon") &&
             cent.centenario === true &&
             sint.includes("simplicidade") &&
             caf.xicarasCafe === 10 &&
             voz.anexadoAFicha === true &&
             est.alturaCentimetros > 10 &&
             ouro.acabamentoLuxo === true;
    })()
  `);
  ok(res481a490, "E481 a E490: Estatura da pilha física de livros, equivalência de café, clássico centenário e fita SVG validados");

  // E491 a E500: Fluxo Profundo, Troféu e Marco 500
  const res491a500 = ev(`
    (() => {
      const vel = calcularVelocidadeMediaGeralLeitor([0.6, 0.8]);
      const apar = gerarAparadorCristalArcanoSvg();
      const rec = gerarCardRecomendacaoParaAmigo({ titulo: "Siddhartha", autor: "Hesse" }, 5);
      const imers = calcularNivelImersaoLeitura(50);
      const marcFoto = gerarMarcadorDePaginaComFotoDupla("foto.jpg");
      const capaAlt = gerarCapaAlternativaModerna({ corCapa: "#0f172a" });
      const nac = calcularProporcaoNacionalVsEstrangeira([{ nacional: true }, { nacional: false }]);
      const folh = gerarEfeitoFolhaSecaComoMarcador();
      const trof = gerarTrofeuBibliotecarioHonorario(12000);
      const conc = concluirMarcoEstante500("2.4.0");
      return vel.ppmHistoricoMedio === 0.7 &&
             apar.includes("<svg") &&
             rec.estrelas === "⭐⭐⭐⭐⭐" &&
             imers.estadoFluxo.includes("Deep Reading") &&
             marcFoto.classe === "marcador-polaroid-fita" &&
             capaAlt.estilo.includes("minimalista") &&
             nac.porcentagemNacional === 50 &&
             folh.icone === "🍂" &&
             trof.desbloqueado === true &&
             conc.itensConcluidos === 100 &&
             conc.hashIntegridade === "PRUMO-ESTANTE-LOTE1-VERIFIED";
    })()
  `);
  ok(res491a500, "E491 a E500: Deep Reading imersivo, literatura nacional, aparador de cristal e marco de 100 itens de Estante validados");

  await fechar();
  return erros;
};
