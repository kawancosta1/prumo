// Testes de Calçados, Calças e Sombreamento 2.5D do Mascote Prumi
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Validar que SLOTS_EQ possui shoes e waist com rotulos corretos
    const slotsValidos = ev(`
      (() => {
        const temShoes = SLOTS_EQ.some(([k, l]) => k === "shoes" && l.includes("Calçad"));
        const temWaist = SLOTS_EQ.some(([k, l]) => k === "waist" && l.includes("Calça"));
        return temShoes && temWaist;
      })()
    `);
    ok(slotsValidos, "SLOTS_EQ inclui slots oficiais de 'shoes' (Calçados) e 'waist' (Calças e Cintura)");

    // 2. Validar que prumi() renderiza calçados e pernas com o novo viewBox expandido
    const prumiComCalcado = ev(`
      (() => {
        const svg = prumi({
          mood: "idle",
          eq: { shoes: "rock_coturno_rebites", waist: "rock_jeans_rasgado" }
        });
        const temShoes = svg.includes("prumi-shoes");
        const temCintura = svg.includes("prumi-cintura-ext");
        const temPernas = svg.includes("prumi-pernas");
        const temSombra = svg.includes("ellipse cx=\"60\" cy=\"156\"");
        const viewBoxCorreto = svg.includes("viewBox=\"0 -6 120 162\"");
        return temShoes && temCintura && temPernas && temSombra && viewBoxCorreto;
      })()
    `);
    ok(prumiComCalcado, "prumi() renderiza calçados, calças com caimento anatômico, perninhas e sombra sem truncar");

    // 3. Validar renderização de calçados pré-existentes (ex: bru_botas_pontudas do mundo bruxo)
    const botasBruxoOk = ev(`
      (() => {
        const svg = prumi({ mood: "idle", eq: { shoes: "bru_botas_pontudas" } });
        return svg.includes("prumi-shoes") && svg.includes("Botas pontudas") || svg.includes("2E1A47");
      })()
    `);
    ok(botasBruxoOk, "Botas pontudas do bruxo renderizam com sucesso com slot shoes ativo");

    // 4. Validar que itens de calçados e calças foram injetados em ITEM para todos os 17 mundos
    const itensCarregados = ev(`
      (() => {
        const mundos = ["rock", "emo", "otaku", "gamer", "cleanboy", "programador", "bruxo", "feiticeiro", "coach", "forrozeiro", "funkeiro", "pagodeiro", "rapper", "sertanejo", "trapper", "vovo", "zen"];
        const todosMundosTemShoes = mundos.every(m =>
          ITEMS.some(i => i.p === m && i.slot === "shoes")
        );
        const todosMundosTemWaist = mundos.every(m =>
          ITEMS.some(i => i.p === m && i.slot === "waist")
        );
        return todosMundosTemShoes && todosMundosTemWaist;
      })()
    `);
    ok(itensCarregados, "Todos os 17 mundos possuem calçados (shoes) e calças (waist) estilizados cadastrados");
  } finally {
    fechar();
  }
  return erros;
};
