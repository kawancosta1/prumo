// Testes Social & Modo Dupla: Lote 4 (Itens 151 a 200)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "social";
    commit();
    render();
  `);
  await espera(30);

  // S151 a S160: Feeds e Conexões
  const res151a160 = ev(`
    (() => {
      const feed = gerarFeedAtividadesAmigos([{ autor: "Bia", acao: "bebeu água" }]);
      const reag = reagirAtividadeFeed(feed[0], "👏");
      const tempo = formatarTempoRelativoAtividade(Date.now() - 60000);
      const grp = agruparAtividadesPorDia([{ data: "Hoje", id: "1" }]);
      const flt = filtrarAtividadesPorCategoria([{ categoria: "estudo" }, { categoria: "agua" }], "estudo");
      const cons = calcularConsistenciaSemanalAmigo([true, true, true, true, true, false, false]);
      const card = gerarCardPerfilPublicoAmigo({ nome: "Lucas", mundo: "zen" });
      const tag = adicionarTagAmizade({ tags: ["Faculdade"] }, "Trabalho");
      const sug = gerarSugestaoAmigosPorInteresse(["zen"], [{ interesses: ["zen"] }]);
      const harm = calcularHarmoniaGrupoTotal([{ consistencia: 80 }, { consistencia: 90 }]);
      return feed[0].autor === "Bia" &&
             reag.reacoes["👏"] === 1 &&
             tempo === "Há 1 min" &&
             grp["Hoje"].length === 1 &&
             flt.length === 1 &&
             cons.diasAtivos === 5 &&
             card.mundoFavorito === "zen" &&
             tag.tags.length === 2 &&
             sug.length === 1 &&
             harm === 85;
    })()
  `);
  ok(res151a160, "S151 a S160: Feeds de amigos, reações e consistência validados");

  // S161 a S170: Metas Compartilhadas e Resumos
  const res161a170 = ev(`
    (() => {
      const metas = gerarMuralMetasCompartilhadas([{ meta: "Correr 5k", autor: "Leo" }]);
      const not = notificarMetaAmigoQuaseAlcancada("Pedro", "10 páginas");
      const ment = gerarBadgeMentorAmigo(4);
      const got = calcularGotasDoadasAmizade([{ valor: 20 }, { valor: 30 }]);
      const niver = gerarCartaoAniversarioAmigo("Lara", 22);
      const bvd = gerarMensagemBoasVindasNovoAmigo("Rafa");
      const resp = calcularTempoMedioRespostaDupla([]);
      const brlh = gerarEfeitoToqueBrilhoMultiplo(3);
      const resSoc = gerarResumoSocialSemanal({ abracos: 10 });
      const rank = gerarRankingSemCompeticaoToxica([{ nome: "Ana" }]);
      return metas.length === 1 &&
             not.amigo === "Pedro" &&
             ment.elegivel === true &&
             got === 50 &&
             niver.idade === 22 &&
             bvd.includes("Rafa") &&
             resp.minutosMedios === 15 &&
             brlh.quantidadeFagulhas === 12 &&
             resSoc.abracosRecebidos === 10 &&
             rank[0].tituloHonorario.includes("Madrugador");
    })()
  `);
  ok(res161a170, "S161 a S170: Metas compartilhadas, selo de mentor e ranking construtivo validados");

  // S171 a S180: Salas de Estudo e Notas Coletivas
  const res171a180 = ev(`
    (() => {
      const conv = gerarConviteClubeLink("c1", "ZEN-10");
      const dist = calcularDistribuicaoHorariosGrupo([{ hora: 10 }, { hora: 15 }]);
      const lembr = gerarLembreteEncontroVirtualEstudos("20:00", "História");
      const sala = gerarSalaVirtualGrupo("zen", [{ nome: "Ana" }]);
      const somSino = typeof tocarSinoInicioSessaoGrupo === "function";
      const pres = calcularPorcentagemPresencaGrupo([{ nome: "Ana", sessoes: 8 }], 10);
      const qb = gerarAnotacaoColetivaQuadroBranco([{ texto: "Ideia 1" }]);
      const bloq = bloquearEdicaoConcorrenteNota({ id: "n1", bloqueadoPor: "outro" }, "eu");
      const vers = gerarHistoricoVersoesNotaGrupo({ versoes: [1, 2] });
      const expMd = exportarAnotacoesGrupoMarkdown([{ autor: "Ana", texto: "Foco total" }]);
      return conv.includes("ZEN-10") &&
             dist.manha === 1 &&
             lembr.horario === "20:00" &&
             sala.totalCadeiras === 5 &&
             somSino &&
             pres[0].presencaPorcentagem === 80 &&
             qb.totalNotas === 1 &&
             bloq.podeEditar === false &&
             vers.length === 2 &&
             expMd.includes("Foco total");
    })()
  `);
  ok(res171a180, "S171 a S180: Salas de estudo coletivas, bloqueio de edição e exportação Markdown validados");

  // S181 a S190: Memórias e Polaroids
  const res181a190 = ev(`
    (() => {
      const imp = gerarEstatisticaImpactoSocial(30);
      const duet = gerarDuetoMascotesAnimado("prumi", "gato");
      const trio = gerarPoseComemorativaTrio(["prumi", "gato", "morcego"]);
      const pol = gerarFotoPolaroidColetiva(["Ana", "Bob"], "Hoje");
      const el = document.createElement("img");
      const sep = aplicarEfeitoFiltroSepiaPolaroid(el);
      const leg = gerarLegendaAutomaticaMemoria("Foco Noturno");
      const niv = calcularNivelComunidadePrumo(2500);
      const desbTema = desbloquearTemaExclusivoComunidade(2);
      const gent = gerarRelatorioImpactoGentileza(10);
      const fala = gerarBalaoFalaEspontaneoMascoteAmigo("Morceguinho");
      return imp.ganhoMotivacionalPorcentagem === 35 &&
             duet.animacao === "danca_sincronizada_alegre" &&
             trio.pets.length === 3 &&
             pol.classe === "polaroid-coletiva-card" &&
             sep &&
             leg.includes("Foco Noturno") &&
             niv.titulo.includes("Vila") &&
             desbTema.desbloqueado === true &&
             gent.sorrisosEstimados === 20 &&
             fala.icone === "🦇";
    })()
  `);
  ok(res181a190, "S181 a S190: Polaroids coletivas, dueto de pets e evolução da vila validados");

  // S191 a S200: Visitas, Certificados e Conclusão Social
  const res191a200 = ev(`
    (() => {
      const perm = configurarPermissaoVisitaQuarto(true);
      const vis = gerarListaVisitantesRecentes([{ nome: "Lia" }]);
      const peg = deixarPegadaMagicaNoQuarto("Lia");
      const rec = recolherEstrelinhaVisitante(peg);
      const mus = gerarMusicaTemaDuplaCustomizada(["piano"]);
      const cert = gerarCertificadoAmizadeEterna({ streak: 120 });
      const sincN = gerarSincroniaNoturnaDupla({ eu: "23:00", parceiro: "23:10" });
      const des21 = gerarDesafio21DiasDupla("Meditar");
      const trof = gerarTrofeuDiamanteSocial(10);
      const conc = concluirEixoSocial600("2.1.0");
      return perm.permitirVisitas === true &&
             vis.length === 1 &&
             peg.classe === "pegada-magica-quarto" &&
             rec.gotasGanhas === 1 &&
             mus.estilo.includes("zen") &&
             cert.titulo.includes("Eterna") &&
             sincN.diferencaMinutos === 10 &&
             des21.diasTotais === 21 &&
             trof.desbloqueado === true &&
             conc.totalMelhoriasConcluidas === 200 &&
             conc.hashIntegridade === "PRUMO-SOCIAL-200-VERIFIED";
    })()
  `);
  ok(res191a200, "S191 a S200: Visitas ao quarto, pegadas de estrelinha e certificação oficial de 200 itens de Social!");

  await fechar();
  return erros;
};
