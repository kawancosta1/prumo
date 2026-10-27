// Testes Novas Melhorias Gerais: Lote 27 (Itens 261 a 270)
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

  // 261. Taxa de recuperao noturna
  const res261 = ev(`
    (() => {
      const r1 = calcularTaxaRecuperacaoNoturna(8, "baixo");
      const r2 = calcularTaxaRecuperacaoNoturna(4, "alto");
      return r1.score === 100 && r1.status === "Revitalizado" && r2.status === "Fadiga";
    })()
  `);
  ok(res261, "261. calcularTaxaRecuperacaoNoturna mensurou prontido fsica");

  // 262. Lembrete postural
  const res262 = ev(`
    (() => {
      const p1 = gerarLembretePosturaColuna(30);
      const p2 = gerarLembretePosturaColuna(60);
      return p1.alerta === false && p2.alerta === true;
    })()
  `);
  ok(res262, "262. gerarLembretePosturaColuna alertou necessidade de correo postural");

  // 263. ndice inteligente de hidratao
  const res263 = ev(`
    (() => {
      const h1 = calcularIndiceHidratacaoInteligente(8, 20, false);
      const h2 = calcularIndiceHidratacaoInteligente(8, 32, true);
      return h1.metaAjustada === 8 && h2.metaAjustada === 12;
    })()
  `);
  ok(res263, "263. calcularIndiceHidratacaoInteligente ajustou copos por calor e exerccio");

  // 264. Sntese das reflexes do dirio
  const res264 = ev(`
    (() => {
      const s = gerarSinteseReflexaoDiario({ gratidao: "minha sade", vitoria: "concluir o projeto", melhoria: "beber mais gua" });
      return s.includes("minha sade") && s.includes("concluir o projeto");
    })()
  `);
  ok(res264, "264. gerarSinteseReflexaoDiario estruturou sntese harmoniosa");

  // 265. Classificao do tempo de telas
  const res265 = ev(`
    (() => {
      const t1 = calcularTempoTotalTelas(120);
      const t2 = calcularTempoTotalTelas(400);
      return t1.categoria === "saudavel" && t2.categoria === "excessivo";
    })()
  `);
  ok(res265, "265. calcularTempoTotalTelas avaliou exposio a telas");

  // 266. Protocolo de alvio visual 20-20-20
  const res266 = ev(`
    (() => {
      const v = gerarExercicioVisao202020();
      return v.intervaloMin === 20 && v.duracaoSegundos === 20 && v.distanciaPes === 20;
    })()
  `);
  ok(res266, "266. gerarExercicioVisao202020 forneceu regra de proteo ocular");

  // 267. Balano calrico
  const res267 = ev(`
    (() => {
      const b1 = avaliarConsumoCaloricoBalanco(2000, 2000);
      const b2 = avaliarConsumoCaloricoBalanco(1500, 2000);
      return b1.balanco === "equilibrio" && b2.balanco === "deficit";
    })()
  `);
  ok(res267, "267. avaliarConsumoCaloricoBalanco comparou calorias");

  // 268. Contagem regressiva at consolidao do hbito
  const res268 = ev(`
    (() => {
      const h = calcularDiasAteRenovacaoHabito(20, 66);
      return h.diasRestantes === 46 && h.progressoPorcentagem === 30;
    })()
  `);
  ok(res268, "268. calcularDiasAteRenovacaoHabito calculou dias para marco de 66 dias");

  // 269. Checklist de rotina matinal
  const res269 = ev(`
    (() => {
      const r = gerarChecklistRotinaMatinal({ agua: true, luz: true });
      return r.length === 4 && r[0].feito === true && r[2].feito === false;
    })()
  `);
  ok(res269, "269. gerarChecklistRotinaMatinal montou hbitos essenciais");

  // 270. ndice geral de vitalidade
  const res270 = ev(`
    (() => {
      const vit = calcularNivelVitalidadeGeral(90, 90, 80, 85);
      return vit.pontuacao >= 80 && vit.status === "Vitalidade Radiante";
    })()
  `);
  ok(res270, "270. calcularNivelVitalidadeGeral computou ndice holstico");

  await fechar();
  return erros;
};
