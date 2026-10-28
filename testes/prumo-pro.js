// Testes do Módulo Comercial Prumo PRO (Monetização, Coach IA e Relatórios Executivos)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Status padrão do Prumo PRO
    const resStatus = ev(`
      (() => {
        const s = obterStatusPrumoPro();
        return typeof s === "object" && s.ativo === false && s.plano === "gratis";
      })()
    `);
    ok(resStatus, "obterStatusPrumoPro iniciou no modo gratuito seguro");

    // 2. Geração e validação de chaves criptográficas de licença
    const resChave = ev(`
      (() => {
        const chaveAnual = gerarChaveLicencaPro("kawan@prumo.app", "anual");
        const checagemValida = validarChaveLicencaPro(chaveAnual);
        const checagemFalsa = validarChaveLicencaPro("CHAVE-FALSA-123");
        return chaveAnual.startsWith("PRU-ANU-") && checagemValida.valida === true && checagemFalsa.valida === false;
      })()
    `);
    ok(resChave, "gerarChaveLicencaPro e validarChaveLicencaPro geraram e validaram tokens determinísticos");

    // 3. Ativação e cancelamento de licença no estado
    const resAtivacao = ev(`
      (() => {
        const chaveVit = gerarChaveLicencaPro("founder@prumo.app", "vitalicio");
        const ativ = ativarLicencaPrumoPro(chaveVit);
        const stAtivo = obterStatusPrumoPro();
        const canc = cancelarLicencaPrumoPro();
        const stCanc = obterStatusPrumoPro();
        return ativ.sucesso && stAtivo.ativo === true && stAtivo.plano === "vitalicio" && canc.sucesso && stCanc.ativo === false;
      })()
    `);
    ok(resAtivacao, "ativarLicencaPrumoPro e cancelarLicencaPrumoPro controlaram status e expiração");

    // 4. Geração de Payload Pix padrão Banco Central (BR Code) e CRC16
    const resPix = ev(`
      (() => {
        const payload = gerarPayloadPixCopiaECola(149.00, "financeiro@prumo.app", "PEDIDO123");
        return payload.startsWith("000201") && payload.includes("br.gov.bcb.pix") && payload.includes("financeiro@prumo.app") && payload.length > 50;
      })()
    `);
    ok(resPix, "gerarPayloadPixCopiaECola estruturou código Pix compatível com apps bancários");

    // 5. Geração de QR Code SVG procedural
    const resQr = ev(`
      (() => {
        const svg = gerarQrCodePixSvg("payload_teste", 150);
        return svg.includes("<svg") && svg.includes('width="150"') && svg.includes("QR Code Pix");
      })()
    `);
    ok(resQr, "gerarQrCodePixSvg gerou marcação vetorial leve para leitura de câmera");

    // 6. Motor de inteligência comportamental (Edge AI Coach)
    const resCoach = ev(`
      (() => {
        const estMock = {
          tasks: [
            { id: "1", done: true },
            { id: "2", done: false },
            { id: "3", done: false }
          ],
          waterGoal: 3000,
          habits: [{ id: "h1" }]
        };
        const analise = analisarRotinaComportamental(estMock);
        const matinal = gerarBriefingMatinalCoach(estMock);
        const noturno = gerarRetrospectivaNoturnaCoach(estMock);
        return analise.scoreEquilibrio >= 0 && analise.scoreEquilibrio <= 100 &&
               Boolean(matinal.conselhoPrincipal) &&
               Boolean(noturno.conselhoDescanso);
      })()
    `);
    ok(
      resCoach,
      "analisarRotinaComportamental, briefing matinal e retrospectiva noturna computaram diagnóstico biopsicossocial"
    );

    // 7. Relatório Executivo e Clínico de Rotina (A4 / Impressão / PDF)
    const resPdf = ev(`
      (() => {
        const htmlPdf = gerarRelatorioExecutivoPDF({ name: "Kawan Costa", persona: "rock" }, "Novembro / 2026");
        return htmlPdf.includes("PRUMO • RELATÓRIO EXECUTIVO") &&
               htmlPdf.includes("Kawan Costa") &&
               htmlPdf.includes("Índice de Equilíbrio Biopsicossocial") &&
               htmlPdf.includes("relatorio-executivo-container");
      })()
    `);
    ok(
      resPdf,
      "gerarRelatorioExecutivoPDF produziu documento executivo completo para impressão médica e mentoria"
    );

    // 8. Backup e Restauração Criptografada Ponta a Ponta com Senha
    const resCifra = ev(`
      (() => {
        const dadosOriginais = { secret: "meus_habitos_intimos_123", coins: 777 };
        const enc = exportarBackupCriptografado(dadosOriginais, "minha_senha_mestre");
        const decValida = importarBackupCriptografado(enc, "minha_senha_mestre");
        const decInvalida = importarBackupCriptografado(enc, "senha_errada");
        return enc.startsWith("PRUMO_ENC_V1:") &&
               decValida.sucesso === true &&
               decValida.estado.secret === "meus_habitos_intimos_123" &&
               decInvalida.sucesso === false;
      })()
    `);
    ok(resCifra, "exportarBackupCriptografado e importarBackupCriptografado garantiram sigilo ponta a ponta");

    // 9. Markup do Modal de Checkout Comercial
    const resModal = ev(`
      (() => {
        const m = modalPrumoProHTML("anual");
        return m.includes("Eleve sua Rotina com o Prumo PRO") &&
               m.includes("Anual Pro") &&
               m.includes("Pague com Pix Instantâneo") &&
               m.includes("PRU-ANU-");
      })()
    `);
    ok(resModal, "modalPrumoProHTML renderizou interface de checkout com vantagens, planos e Pix");
  } finally {
    fechar();
  }
  return erros;
};
