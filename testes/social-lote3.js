// Testes Social & Modo Dupla: Lote 3 (Itens 101 a 150)
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

  // S101 a S110: Clubes de Hábito
  const res101a110 = ev(`
    (() => {
      const c = inicializarClubeHabitos("Madrugadores", "☀️", "manha");
      const c2 = adicionarMembroClube(c, { id: "m1", nome: "Ana" });
      const meta = calcularMetaColetivaClube([{ progresso: 1000 }, { progresso: 1000 }], 2000);
      const mural = gerarMuralRecadosClube([{ autor: "Ana", mensagem: "Bom dia!" }]);
      const trofeu = calcularTrofeuSemanalClube(90);
      const lid = definirLiderancaRotativaClube([{ id: "1", nome: "Ana" }], 2);
      const ins = gerarInsigniaFundadorClube({ id: "1" });
      const pres = calcularTaxaPresencaSemanalClube([{ checkinsSemana: 7 }]);
      const notif = formatarNotificacaoClube("Marina", "completou o foco");
      const exp = exportarEstatisticasClube(c2.clube);
      return c.nome === "Madrugadores" &&
             c2.sucesso === true &&
             meta.porcentagem === 50 &&
             mural[0].mensagem === "Bom dia!" &&
             trofeu.medalha === "ouro" &&
             lid.liderSemana.nome === "Ana" &&
             ins.tituloInsignia.includes("Fundador") &&
             pres === 100 &&
             notif.texto.includes("Marina") &&
             exp.membrosTotal === 1;
    })()
  `);
  ok(res101a110, "S101 a S110: Clubes de hábito, liderança rotativa e presença validados");

  // S111 a S120: Desafios Comunitários
  const res111a120 = ev(`
    (() => {
      const des = gerarDesafioSazonalComunidade("Primavera", 1000);
      const cont = contribuirMetaGlobalComunidade(des, 500);
      const desb = desbloquearRecompensaColetiva(cont.eventoAtualizado);
      const term = gerarTermometroVisualEvento(500, 1000);
      const tmp = calcularTempoRestanteEvento("2026-11-01", "2026-10-27");
      const apoi = gerarListaApoiadoresDestaque([{ gotas: 100 }, { gotas: 200 }]);
      const cert = gerarCertificadoParticipacaoEvento("Festival Zen", "Kawan");
      const mult = calcularMultiplicadorEventoComunitario(true);
      const fas = gerarFaseVisualCenarioEvento(1);
      const arq = arquivarEventoConcluido(des);
      return des.metaGotas === 1000 &&
             cont.porcentagemGlobal === 50 &&
             desb.recompensaLiberada === false &&
             term.porcentagem === 50 &&
             tmp.diasRestantes === 5 &&
             apoi[0].gotas === 200 &&
             cert.selo.includes("Participante") &&
             mult === 1.2 &&
             fas.decoracao === "Guirlandas de Flores" &&
             arq.ativo === false;
    })()
  `);
  ok(res111a120, "S111 a S120: Desafios comunitários, termômetro visual e recompensas validados");

  // S121 a S130: Cartas e Pombos-Correio
  const res121a130 = ev(`
    (() => {
      const env = gerarEnvelopeCartaSeloPostal("Eu", "Tu", "prumi");
      const cat = obterCatalogoSelosPostais();
      const voo = calcularTempoVooPomboCorreio(30);
      const el = document.createElement("div");
      const p = gerarAnimacaoPomboChegando(el);
      const pap = formatarPapelCartaEnvelhecido();
      const origami = aplicarDobraCartaOrigami(el);
      const chg = verificarCartaChegouAoDestino(Date.now() - 5000, 1000);
      const carimbo = gerarCarimboPostalDataCidade("Campinas", "27 OUT");
      const gav = armazenarGavetaCartasGuardadas([], { id: "c1" });
      const not = gerarNotificacaoCartaNaCaixa();
      return env.classe === "papel-carta-vintage" &&
             cat.length === 3 &&
             voo.minutosVoo === 24 &&
             p !== null &&
             pap.textura.includes("pergaminho") &&
             origami &&
             chg.chegou === true &&
             carimbo.includes("Campinas") &&
             gav.length === 1 &&
             not.icone === "✉️";
    })()
  `);
  ok(res121a130, "S121 a S130: Cartas postais, voo de pombo e gaveta de memórias validados");

  // S131 a S140: Áudio-recados e Voz
  const res131a140 = ev(`
    (() => {
      const comp = compactarBlobAudioVoz({ tamanho: 100000 });
      const canvas = document.createElement("canvas");
      const okOnda = gerarVisualizadorOndaSonoraCanvas(canvas, [10, 20]);
      const dur = calcularDuracaoFormatadaAudio(75);
      const acel = gerarEfeitoVozAcelerada(1.5);
      const clip = validarMensagemVozSemClipping([0.1, 0.4]);
      const prev = gerarTranscricaoPreviaVoz("Olá meu querido amigo!");
      const html = gerarPlayerAudioCompactoHtml("a1", "0:12");
      const sussurro = typeof tocarSussurroMascoteAfeto === "function";
      const favs = gerarIndiceAudioRecadosFavoritos([{ id: "1", favorito: true }, { id: "2" }]);
      return comp.tamanhoCompactado === 45000 &&
             okOnda &&
             dur === "1:15" &&
             acel.taxaPlayback === 1.5 &&
             clip.seguro === true &&
             prev.includes("Olá") &&
             html.includes("btn-play-mini") &&
             sussurro &&
             favs.length === 1;
    })()
  `);
  ok(res131a140, "S131 a S140: Áudios comprimidos, visualizador de onda e player leve validados");

  // S141 a S150: Moderação e Segurança Comunitária
  const res141a150 = ev(`
    (() => {
      const flr = filtrarPalavrasOfensivasTexto("Que droga de dia idiota");
      const tax = limitarTaxaDisparosSocial(5, 10);
      const nom = validarTamanhoNomeExibicao("Kawan");
      const rel = gerarRelatorioUsoComunitario({ interacoes: 60 });
      const blq = alternarBloqueioTemporarioMembro({ membros: [{ id: "m1" }] }, "m1", 12);
      const prev = ocultarPreviewMensagemNotificacao(true);
      const integ = verificarIntegridadePayloadSocial({ id: "act-1", timestamp: Date.now() });
      const limp = limparCacheMensagensAntigas([{ timestamp: Date.now() }, { timestamp: 1000 }], 30);
      const termo = gerarTermoCompromissoGentileza();
      const badge = gerarBadgeCidadaoGentil(25);
      return flr.includes("🌸") &&
             tax.permitida === true &&
             nom.valido === true &&
             rel.statusConta === "cidadão_exemplar" &&
             blq.membros[0].bloqueadoAte > 0 &&
             prev.ocultarTexto === true &&
             integ === true &&
             limp.length === 1 &&
             termo.aceito === true &&
             badge.desbloqueado === true;
    })()
  `);
  ok(res141a150, "S141 a S150: Filtro de palavras ofensivas, rate limiting e termo de gentileza validados");

  await fechar();
  return erros;
};
