// Testes Estante & Vida Literária: Lote 1 (Itens 401 a 450)
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

  // E401 a E410: Modelagem e OpenLibrary
  const res401a410 = ev(`
    (() => {
      const liv = inicializarModeloLivroEstante({ titulo: "Grande Sertão", autor: "Guimarães Rosa", paginasTotais: 600 });
      const epIsbn = formatarEndpointOpenLibrary("9788535902778");
      const epTit = formatarEndpointOpenLibrary("Dom Casmurro");
      const capa = gerarCapaProceduralSvgLivro("Ensaio", "Saramago", "Filosofia");
      const ppm = calcularVelocidadeLeituraPpm(30, 60);
      const proj = calcularDataEstimadaTerminoLivro(150, 0.5, 30);
      const val = validarAtualizacaoPaginaLivro(50, 70, 200);
      const reg = registrarSessaoLeituraHistorico(liv, 20, 40);
      const csv = exportarEstanteParaFormatoCsv([liv]);
      const rel = processarReleituraLivro(liv);
      const div = calcularIndiceDiversidadeGeneros([liv, { categoria: "História" }]);
      return liv.paginasTotais === 600 &&
             epIsbn.tipo === "isbn" &&
             epTit.tipo === "titulo" &&
             capa.includes("<svg") &&
             ppm.ppm === 0.5 &&
             proj.diasNecessarios === 10 &&
             val.valido === true &&
             reg.tempoMinutos === 40 &&
             csv.includes("Grande Sertão") &&
             rel.totalVezesLido === 2 &&
             div.totalGenerosDiferentes === 2;
    })()
  `);
  ok(res401a410, "E401 a E410: Modelagem de livro, OpenLibrary, capa procedural SVG, PPM e projeção de término validados");

  // E411 a E420: Estante 3D e Lombadas
  const res411a420 = ev(`
    (() => {
      const mad = gerarEstiloPrateleiraMadeiraNobre("clara");
      const esp = calcularEspessuraLombadaLivro(600);
      const txt = gerarTextoLombadaVertical("1984", "Orwell");
      const fris = gerarFrisosDouradosLombada(true);
      const reord = calcularReordenacaoLivrosEstante([{ id: "1" }, { id: "2" }, { id: "3" }], "3", "1");
      const filt = filtrarLivrosPorPrateleiraTematica([{ id: "1", status: "lendo" }], "lendo");
      const incl = gerarInclinacaoLivroFimPrateleira(true);
      const apar = obterAparadorLivrosTema("cristal");
      const spot = gerarFocoLuzLeituraSpotlight("livro-1");
      const modo = alternarModoVisualizacaoEstante("grade_capas");
      return mad.classe.includes("prateleira-madeira-clara") &&
             esp.larguraPx >= 35 &&
             txt.classe === "texto-lombada-vertical" &&
             fris.ouroMetalizado === true &&
             reord[0].id === "3" &&
             filt.length === 1 &&
             incl.anguloGraus === 12 &&
             apar.icone.includes("🔮") &&
             spot.classe === "spotlight-leitura" &&
             modo.classeContainer.includes("grade_capas");
    })()
  `);
  ok(res411a420, "E411 a E420: Prateleira de nogueira 3D, espessura de lombada proporcional, aparadores e spotlight validados");

  // E421 a E430: Sessão Literária e Cronômetro
  const res421a430 = ev(`
    (() => {
      const som = gerarTrilhaAmbienteLeitura("lareira");
      const cron = iniciarCronometroSessaoLeitura(25, 50);
      const fita = gerarFitaMarcadoraCetimSvg("#c62828", 50);
      const el = document.createElement("div");
      const folh = aplicarEfeito3DFolhearPagina(el);
      const imer = alternarModoImersaoTotalLeitura(true);
      const desc = verificarDescansoOcularLeitor(35);
      const not = anotarInsightMarginalRapido("liv-1", "Insight profundo");
      const msg = calcularMensagemQuantoFalta(160, 200);
      const anim = gerarAnimacaoConclusaoLivro({ titulo: "O Alquimista" });
      const card = gerarCardCompartilhamentoTermino({ titulo: "Duna", paginasTotais: 500 });
      return som.volumeSugerido === 0.18 &&
             cron.metaPaginas === 25 &&
             fita.classe === "fita-cetim-marcador" &&
             folh &&
             imer.notificacoesBloqueadas === true &&
             desc.alertaDescanso === true &&
             not.texto.includes("profundo") &&
             msg.paginasRestantes === 40 &&
             anim.animacao.includes("chuva_estrelas") &&
             card.titulo === "Duna";
    })()
  `);
  ok(res421a430, "E421 a E430: Trilha ambiente, cronômetro de páginas, fita de cetim e descanso ocular validados");

  // E431 a E440: Fichamento e Citações
  const res431a440 = ev(`
    (() => {
      const pal = obterPaletaCoresGrifador();
      const cit = formatarCitacaoDestacada("Conhece-te a ti mesmo", "Apologia", "Platão", 20, "verde");
      const html = gerarCartaoCitacaoEsteticoHtml(cit);
      const busc = buscarCitacoesPorPalavraChave([cit], "mesmo");
      const gloss = salvarPalavraGlossarioLiterario([], "Epifania", "Revelação súbita");
      const ficha = estruturarFichaLeituraTresAtos("A busca pelo sentido", "Mudou minha visão", "Passagem x");
      const aval = avaliarLivroMultiCriterios({ ritmo: 5, profundidade: 5, clareza: 5, originalidade: 5 });
      const rand = selecionarCitacaoAleatoriaWidget([cit]);
      const el = document.createElement("p");
      const spoil = aplicarBlurSpoilerResenha(el);
      const md = exportarCitacoesParaMarkdown({ titulo: "Apologia" }, [cit]);
      return pal.amarelo.classe === "grifo-amarelo" &&
             cit.corGrifo === "verde" &&
             html.includes("cartao-citacao-literario") &&
             busc.length === 1 &&
             gloss[0].palavra === "Epifania" &&
             ficha.preenchida === true &&
             aval.mediaGeral === 5.0 &&
             rand.texto.includes("Conhece-te") &&
             spoil &&
             md.includes("Apologia");
    })()
  `);
  ok(res431a440, "E431 a E440: Grifador 4 cores pastel, glossário literário, ficha em 3 atos e blur contra spoilers validados");

  // E441 a E450: Desafios e Metas
  const res441a450 = ev(`
    (() => {
      const des = calcularProgressoDesafioAnualLeitura(9, 12);
      const term = gerarTermometroPaginasMes([{ paginas: 300 }]);
      const dev = avaliarConquistaDevoradorLivros(550);
      const read = gerarEventoMaratonaLeituraReadathon("2026-11-01", 12);
      const bin = inicializarBingoLiterario(2026);
      const arv = calcularEstagioArvoreConhecimento(10);
      const trof = avaliarTrofeuExploradorGeneros(["A", "B", "C", "D", "E"]);
      const cur = calcularEstatisticaRitmoLeituraCuriosidades([{ titulo: "A", paginasTotais: 100 }, { titulo: "B", paginasTotais: 800 }]);
      const hum = gerarRelacaoHumorLeitura([], []);
      const cert = gerarCertificadoLeitorDoAno(2026, "Kawan", 15, 4500);
      return des.porcentagem === 75 &&
             term.totalPaginasMes === 300 &&
             dev.alcancado === true &&
             read.multiplicadorGotas === 1.5 &&
             bin.totalQuadrados === 25 &&
             arv.estagio.includes("Frondosa") &&
             trof.desbloqueado === true &&
             cur.livroMaisLongo.titulo === "B" &&
             hum.impactoPositivo === true &&
             cert.selo.includes("PRUMO");
    })()
  `);
  ok(res441a450, "E441 a E450: Desafio anual de 12 livros, bingo literário, devorador de livros e certificado de leitor validados");

  await fechar();
  return erros;
};
