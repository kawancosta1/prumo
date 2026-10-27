// Testes Novas Melhorias Gerais: Lote 22 (Itens 211 a 220)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 211. Clculo de ciclos de sono REM (blocos de 90 min)
  const res211 = ev(`
    (() => {
      const s = calcularHorarioCiclosSonoREM("23:00", 5);
      return s.horaAcordar === "06:30" && s.duracaoMinutos === 450;
    })()
  `);
  ok(res211, "211. calcularHorarioCiclosSonoREM projetou horrio timo de despertar");

  // 212. Lembrete de alongamento postural ergonmico
  const res212 = ev(`
    (() => {
      const a1 = gerarLembreteAlongamentoErgonomico(30);
      const a2 = gerarLembreteAlongamentoErgonomico(75);
      return a1.precisaAlongar === false && a2.precisaAlongar === true;
    })()
  `);
  ok(res212, "212. gerarLembreteAlongamentoErgonomico alertou tempo excessivo sentado");

  // 213. ndice sinttico de qualidade do sono
  const res213 = ev(`
    (() => {
      const qBom = calcularIndiceQualidadeSono(8, 0);
      const qRuim = calcularIndiceQualidadeSono(4, 3);
      return qBom.pontuacao >= 85 && qBom.status === "excelente" && qRuim.status === "critico";
    })()
  `);
  ok(res213, "213. calcularIndiceQualidadeSono avaliou sono e despertares");

  // 214. Protocolo de desacelerao noturna
  const res214 = ev(`
    (() => {
      const proto = gerarProtocoloDesaceleracaoNoturna("23:00");
      return proto.length === 3 && proto[0].acao.includes("telas");
    })()
  `);
  ok(res214, "214. gerarProtocoloDesaceleracaoNoturna montou rotina de descanso");

  // 215. Registro de exposio  luz solar matinal
  const res215 = ev(`
    (() => {
      const sol = calcularExposicaoLuzSolarMatinal(20, "08:15");
      const solTarde = calcularExposicaoLuzSolarMatinal(20, "13:00");
      return sol.adequada === true && solTarde.adequada === false;
    })()
  `);
  ok(res215, "215. calcularExposicaoLuzSolarMatinal validou ritmo circadiano matutino");

  // 216. Janela de segurana da ltima refeio antes de dormir
  const res216 = ev(`
    (() => {
      const rBoa = avaliarImpactoAlimentacaoNoturna("19:30", "22:30");
      const rRuim = avaliarImpactoAlimentacaoNoturna("22:15", "22:30");
      return rBoa.adequado === true && rRuim.adequado === false;
    })()
  `);
  ok(res216, "216. avaliarImpactoAlimentacaoNoturna checou intervalo de digesto");

  // 217. Respirao guiada em caixa (Box Breathing 4-4-4-4)
  const res217 = ev(`
    (() => {
      const f0 = gerarRespiracaoGuiadaCaixa(0);
      const f1 = gerarRespiracaoGuiadaCaixa(1);
      return f0.fase === "Inspirar" && f1.fase === "Segurar com ar" && f0.duracaoSegundos === 4;
    })()
  `);
  ok(res217, "217. gerarRespiracaoGuiadaCaixa estruturou ciclo de 4 fases");

  // 218. Razo sdio/potssio estimada para presso equilibrada
  const res218 = ev(`
    (() => {
      const bom = calcularIngestaoSodioPotassioEquilibrio(2000, 3500);
      const ruim = calcularIngestaoSodioPotassioEquilibrio(4000, 1500);
      return bom.equilibrioBom === true && ruim.equilibrioBom === false;
    })()
  `);
  ok(res218, "218. calcularIngestaoSodioPotassioEquilibrio estimou razo balanceada");

  // 219. Alerta de troca de posio (sit-stand)
  const res219 = ev(`
    (() => {
      const s1 = gerarAlertaTrocaPosicaoSentado(20);
      const s2 = gerarAlertaTrocaPosicaoSentado(50);
      return s1.alerta === false && s2.alerta === true;
    })()
  `);
  ok(res219, "219. gerarAlertaTrocaPosicaoSentado preveniu sedentarismo postural");

  // 220. Termmetro ideal do quarto para sono profundo
  const res220 = ev(`
    (() => {
      const tempIdeal = calcularTendenciaTemperaturaSono(19);
      const tempQuente = calcularTendenciaTemperaturaSono(27);
      return tempIdeal.ideal === true && tempQuente.ideal === false;
    })()
  `);
  ok(res220, "220. calcularTendenciaTemperaturaSono identificou faixa trmica ptima");

  await fechar();
  return erros;
};
