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

    // 2. A licença só vale se veio do servidor
    const resLic = ev(`
      (() => {
        const futuro = Date.now() + 5 * 864e5;
        aplicarLicencaServidor({ ativo: true, plano: "anual", expiraEm: futuro });
        const a = obterStatusPrumoPro();
        aplicarLicencaServidor({ ativo: true, plano: "vitalicio", vitalicio: true });
        const v = obterStatusPrumoPro();
        aplicarLicencaServidor({ ativo: true, plano: "anual", expiraEm: Date.now() - 1000 });
        const venc = obterStatusPrumoPro();
        aplicarLicencaServidor({ ativo: true, plano: "hacker", expiraEm: futuro });
        const estranho = obterStatusPrumoPro();
        aplicarLicencaServidor(null);
        const g = obterStatusPrumoPro();
        return a.ativo && a.plano === "anual" && a.expiraEm === futuro &&
               v.ativo && v.vitalicio && v.expiraEm === null &&
               !venc.ativo && venc.plano === "expirado" &&
               estranho.plano === "anual" && !g.ativo && g.plano === "gratis";
      })()
    `);
    ok(resLic, "licença do servidor libera, vence, aceita vitalício e volta ao gratuito");

    // 3. Estado forjado no próprio aparelho não libera o PRO
    const resForja = ev(`
      (() => {
        S.pro = { ativo: true, plano: "vitalicio", vitalicio: true, chave: "PRU-VIT-AAAA-BBBB-CCCC" };
        const forjado = obterStatusPrumoPro().ativo;
        cancelarLicencaPrumoPro();
        return forjado === false && obterStatusPrumoPro().ativo === false;
      })()
    `);
    ok(resForja, "S.pro sem origem do servidor (chave digitada ou editada) não libera o PRO");

    // 4. Sem conta, o app não consegue cobrar e avisa
    const resSemConta = await ev(`
      criarCobrancaPix("anual").then(r => typeof r.erro === "string" && r.erro.includes("conta"))
    `);
    ok(resSemConta, "criar cobrança sem conta pede para entrar");

    // 5. O app não carrega mais chave de licença nem Pix de mentira
    const resLimpo = ev(`
      typeof gerarChaveLicencaPro === "undefined" && typeof validarChaveLicencaPro === "undefined" &&
      typeof gerarPayloadPixCopiaECola === "undefined" && typeof gerarQrCodePixSvg === "undefined"
    `);
    ok(resLimpo, "sem gerador de chave local nem QR/Pix de mentira no app");

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
        const planos = (m.match(/data-plano="/g) || []).length;
        return m.includes("Eleve sua Rotina com o Prumo PRO") &&
               m.includes("Anual Pro") && m.includes("Mensal Pro") && m.includes("Vitalício Founder") &&
               planos === 3 && m.includes("Gerar Pix") && !m.includes("PRU-ANU-") && !m.includes("financeiro@prumo.app");
      })()
    `);
    ok(resModal, "modalPrumoProHTML mostra 3 planos e Gerar Pix, sem chave digitada nem Pix fixo");

    // 9b. Fluxo do modal: gerar Pix, mostrar QR e confirmar pagamento
    const resFluxo = await ev(`
      (async () => {
        const original = { c: window.criarCobrancaPix, v: window.verificarCobrancaPix };
        let pedido = null;
        window.criarCobrancaPix = async plano => { pedido = plano; return { id: "1234567890", copiaECola: "00020126PIXTESTE", qrBase64: "iVBORw0KGgo=", expiraEm: Date.now() + 60000 }; };
        window.verificarCobrancaPix = async () => ({ pago: true });
        abrirModalPrumoPro("anual");
        document.querySelector('.plano-card[data-plano="mensal"]').click();
        document.getElementById("bt-gerar-pix").click();
        await new Promise(r => setTimeout(r, 30));
        const mostrou = !document.getElementById("pro-pix-dados").hidden &&
          document.getElementById("pix-codigo-val").value === "00020126PIXTESTE" &&
          document.getElementById("pro-pix-qr").src.startsWith("data:image/png;base64,");
        document.getElementById("modal-pro-fechar-bt").click();
        window.criarCobrancaPix = original.c; window.verificarCobrancaPix = original.v;
        return pedido === "mensal" && mostrou && !document.getElementById("modal-pro-overlay");
      })()
    `);
    ok(resFluxo, "modal pede o plano escolhido ao servidor e mostra QR e copia e cola");

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

    // 16. Teste grátis, bloqueio no momento de uso e frase de valor
    const resBloqueio = ev(`
      (() => {
        cancelarLicencaPrumoPro();
        const m = modalPrumoProHTML("anual");
        const temBotao = m.includes('id="bt-teste-gratis"') && m.includes("7 dias grátis");
        const temRoi = m.includes("horas por ano") && m.includes("R$ 149,00");
        const card = cartaoCoachBloqueadoHTML();
        const cartaoOk = card.includes("coach-bloqueado") && card.includes('data-act="abrir-pro"');
        const abriu = exigirPrumoPro() === false && !!document.getElementById("modal-pro-overlay");
        document.getElementById("modal-pro-fechar-bt").click();
        aplicarLicencaServidor({ ativo: true, plano: "teste", expiraEm: Date.now() + 864e5 });
        const liberado = exigirPrumoPro() === true && !document.getElementById("modal-pro-overlay");
        const semBotao = !modalPrumoProHTML("anual").includes('id="bt-teste-gratis"') && modalPrumoProHTML("anual").includes("Teste grátis ativo");
        cancelarLicencaPrumoPro();
        return temBotao && temRoi && cartaoOk && abriu && liberado && semBotao;
      })()
    `);
    ok(resBloqueio, "sem PRO: convida a testar 7 dias e abre o checkout; com teste ativo libera");

    // 17. Aba Hoje: bloqueada sem PRO, completa com PRO
    const resHoje = ev(`
      (() => {
        cancelarLicencaPrumoPro();
        S.tab = "hoje";
        softRender();
        const livre = document.querySelector(".coach-bloqueado") && !document.querySelector(".coach-meta-principal");
        aplicarLicencaServidor({ ativo: true, plano: "anual", expiraEm: Date.now() + 864e5 });
        softRender();
        const pro = !document.querySelector(".coach-bloqueado") && document.querySelector(".coach-meta-principal");
        cancelarLicencaPrumoPro();
        return Boolean(livre && pro);
      })()
    `);
    ok(resHoje, "Hoje: coach bloqueado sem PRO e completo com PRO");
  } finally {
    fechar();
  }
  return erros;
};
