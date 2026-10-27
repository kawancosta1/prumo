// Testes Novas Melhorias Gerais: Lote 17 (Itens 161 a 170)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 161. Estimativa e equilíbrio de macronutrientes na dieta
  const res161 = ev(`
    (() => {
      const macros = calcularDistribuicaoMacronutrientes([{ desc: "Frango com arroz e azeite" }]);
      return macros.proteinaGramas === 25 && macros.carboGramas === 35 && macros.gorduraGramas === 15;
    })()
  `);
  ok(res161, "161. calcularDistribuicaoMacronutrientes estimou gramas de proteínas, carboidratos e gorduras");

  // 162. Status de jejum intermitente e janela alimentar
  const res162 = ev(`
    (() => {
      const hora = new Date("2026-10-27T12:00:00");
      const j = verificarJanelaJejumIntermitente("20:00", 16, hora); // 20h às 12h = 16 horas
      return j.concluido === true && j.decorridoHoras === 16;
    })()
  `);
  ok(res162, "162. verificarJanelaJejumIntermitente calculou progresso e término de janela de jejum");

  // 163. Ponderação de ingestão total de líquidos por tipo de bebida
  const res163 = ev(`
    (() => {
      const reg = [{ ml: 1000, tipo: "agua" }, { ml: 500, tipo: "suco" }]; // 1000 + 450 = 1450
      const r = calcularIngestaoLiquidosTotais(reg);
      return r.totalEfetivoML === 1450;
    })()
  `);
  ok(res163, "163. calcularIngestaoLiquidosTotais ponderou hidratação efetiva por bebida");

  // 164. Alerta para intervalo excessivo sem hidratação (> 120 min)
  const res164 = ev(`
    (() => {
      const a1 = gerarAlertaHorarioHidratacao(60);
      const a2 = gerarAlertaHorarioHidratacao(130);
      return a1.precisaBeber === false && a2.precisaBeber === true;
    })()
  `);
  ok(res164, "164. gerarAlertaHorarioHidratacao sinalizou pausa excessiva sem água");

  // 165. Estimativa de calorias e classificação de densidade energética
  const res165 = ev(`
    (() => {
      const c = calcularMediaCaloriasAproximada([{}, {}, {}]); // 3 refeições = 1350 kcal
      return c.caloriasEstimadas === 1350 && c.classificacao === "moderada";
    })()
  `);
  ok(res165, "165. calcularMediaCaloriasAproximada estimou aporte calórico diário");

  // 166. Avaliação da diversidade de grupos alimentares no dia
  const res166 = ev(`
    (() => {
      const r = avaliarQualidadeAlimentarDia(["fruta", "legume", "proteina", "graos"]);
      return r.totalGrupos === 4 && r.balanceado === true;
    })()
  `);
  ok(res166, "166. avaliarQualidadeAlimentarDia mediu diversidade de grupos alimentares");

  // 167. Efeito de transbordamento visual quando água atinge > 120% da meta
  const res167 = ev(`
    (() => {
      const el = document.createElement("div");
      const okTrans = obterAnimacaoAguaTransbordando(el, 130);
      return okTrans && el.classList.contains("agua-transbordando-efeito");
    })()
  `);
  ok(res167, "167. obterAnimacaoAguaTransbordando ativou brilho e borbulhamento por superação");

  // 168. Acréscimo dinâmico de água por tempo de atividade física
  const res168 = ev(`
    (() => {
      const p = gerarPlanoHidratacaoTreino(60, 2500); // 60min = +500mL
      return p.extraTreinoML === 500 && p.metaTotalTreinoML === 3000;
    })()
  `);
  ok(res168, "168. gerarPlanoHidratacaoTreino acrescentou hidratação proporcional ao exercício");

  // 169. Histórico e média ponderada de peso corporal
  const res169 = ev(`
    (() => {
      const r = calcularHistoricoPesoMensal([70, 71, 72]);
      return r.media === 71 && r.delta === 2 && r.totalRegistros === 3;
    })()
  `);
  ok(res169, "169. calcularHistoricoPesoMensal calculou média e oscilação de peso");

  // 170. Sugestão automática de cardápio saudável semanal
  const res170 = ev(`
    (() => {
      const c = gerarCardapioSemanalSugerido("vegetariano");
      return c.almoco.includes("grão-de-bico");
    })()
  `);
  ok(res170, "170. gerarCardapioSemanalSugerido sugeriu refeições nutritivas por preferência");

  await fechar();
  return erros;
};
