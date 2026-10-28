// Teste do Painel de Metricas de Negocio & Valuation (M&A)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar objeto e funcao de calculo de metricas
    const metricas = ev(`
      (() => {
        if (typeof calcularMetricasDoApp !== "function") return null;
        return calcularMetricasDoApp();
      })()
    `);
    ok(metricas && metricas.valuationTotal >= 30000, `Metricas calculadas com sucesso: Valuation R$ ${metricas ? metricas.valuationTotal : 0} >= R$ 30.000`);
    ok(metricas && metricas.margem >= 95, `Margem operacional de custo fixo zero calculada: ${metricas ? metricas.margem : 0}% >= 95%`);

    // 2. Validar abertura e fechamento do painel executivo
    const painelAbriu = ev(`
      (() => {
        abrirPainelValuation();
        const el = document.getElementById("modal-valuation");
        const aberto = Boolean(el && el.querySelector(".val-price"));
        fecharPainelValuation();
        const fechado = !document.getElementById("modal-valuation");
        return aberto && fechado;
      })()
    `);
    ok(painelAbriu, "Painel Executivo de Valuation abre com hero/preço e fecha com sucesso");

    // 3. Validar se a secao existe na aba ajustes
    const secaoAjustes = ev(`
      (() => {
        const html = typeof viewAjustes === "function" ? viewAjustes() : "";
        return html.includes("abrir-valuation");
      })()
    `);
    ok(secaoAjustes, "Botao 'Abrir Painel' de Valuation esta integrado na aba Ajustes");
  } finally {
    fechar();
  }
  return erros;
};
