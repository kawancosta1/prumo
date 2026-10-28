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

    // 10. Simulador de Economia e ROI do Usuário
    const resRoi = ev(`
      (() => {
        const r = calcularEconomiaAnualUsuario(12, 25, 30);
        return r.horasPoupadasSemana === 3.5 && r.horasPoupadasAno === 182 && r.multiplicadorROI > 20;
      })()
    `);
    ok(resRoi, "calcularEconomiaAnualUsuario calculou ROI expressivo e horas poupadas no ano");

    // 11. Curva de Energia Circadiana Biológica
    const resCurva = ev(`
      (() => {
        const matutino = calcularCurvaEnergiaCircadiana("07:00", "23:00", 9);
        const noturno = calcularCurvaEnergiaCircadiana("07:00", "23:00", 23);
        return matutino.nivelEnergia > noturno.nivelEnergia &&
               matutino.faseNome.includes("Pico") &&
               noturno.faseNome.includes("Sono");
      })()
    `);
    ok(resCurva, "calcularCurvaEnergiaCircadiana mapeou fases ultradianas de foco e repouso");

    // 12. Algoritmo SuperMemo SM-2 Avançado
    const resSm2 = ev(`
      (() => {
        const rev1 = calcularProximaRevisaoSM2Avancada(5, 0, 2.5, 1);
        const rev2 = calcularProximaRevisaoSM2Avancada(4, 2, 2.6, 6);
        const revFalha = calcularProximaRevisaoSM2Avancada(1, 4, 2.5, 30);
        return rev1.novoIntervaloDias === 1 &&
               rev2.novoIntervaloDias > 6 &&
               revFalha.novoIntervaloDias === 1 &&
               revFalha.novasRepeticoes === 0;
      })()
    `);
    ok(resSm2, "calcularProximaRevisaoSM2Avancada escalonou intervalos ótimos e tratou esquecimento");

    // 13. Matriz de Priorização de Eisenhower
    const resEisen = ev(`
      (() => {
        const tarefas = [
          { id: "1", title: "Crítica", prio: 3 },
          { id: "2", title: "Estratégica", prio: 1 },
          { id: "3", title: "Operacional", prio: 0, time: "14:00" },
          { id: "4", title: "Supérflua", prio: 0 }
        ];
        const m = gerarMatrizEisenhowerTarefas(tarefas);
        return m.q1.length === 1 && m.q2.length === 1 && m.q3.length === 1 && m.q4.length === 1 && m.estatisticas.pctEstrategico === 25;
      })()
    `);
    ok(resEisen, "gerarMatrizEisenhowerTarefas distribuiu tarefas nos 4 quadrantes estratégicos");

    // 14. Certificado Oficial de Disciplina em SVG
    const resCert = ev(`
      (() => {
        const svg = gerarCertificadoDisciplinaPro({ name: "Kawan Costa" }, 60);
        return svg.includes("<svg") &&
               svg.includes("CERTIFICADO OFICIAL") &&
               svg.includes("Kawan Costa") &&
               svg.includes("60 dias");
      })()
    `);
    ok(resCert, "gerarCertificadoDisciplinaPro produziu certificado vetorial nobre de maestria");

    // 15. Meta de Água Adaptativa por Biometria e Clima
    const resAgua = ev(`
      (() => {
        const a1 = gerarMetaDiariaAguaAdaptativa(70, "moderado", "temperado");
        const a2 = gerarMetaDiariaAguaAdaptativa(80, "intenso", "quente");
        return a1.metaMl === 2950 && a2.metaMl > a1.metaMl && a1.totalCopos === 10;
      })()
    `);
    ok(resAgua, "gerarMetaDiariaAguaAdaptativa calculou hidratação médica precisa por biometria e clima");
  } finally {
    fechar();
  }
  return erros;
};
