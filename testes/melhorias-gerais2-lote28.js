// Testes Novas Melhorias Gerais: Lote 28 (Itens 271 a 280)
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

  // 271. Desafios semanais temticos
  const res271 = ev(`
    (() => {
      const d = gerarDesafioSemanalEspecial("Foco Laser");
      return d.tema === "Foco Laser" && d.recompensaGotas === 80 && d.ativo === true;
    })()
  `);
  ok(res271, "271. gerarDesafioSemanalEspecial criou evento semanal");

  // 272. Desconto progressivo por fidelidade na loja
  const res272 = ev(`
    (() => {
      const d1 = calcularDescontoFidelidadeLoja(5);
      const d2 = calcularDescontoFidelidadeLoja(20);
      return d1.descontoPorcentagem === 10 && d2.descontoPorcentagem === 25;
    })()
  `);
  ok(res272, "272. calcularDescontoFidelidadeLoja concedeu desconto limitado a 25%");

  // 273. Inventrio organizado por slots
  const res273 = ev(`
    (() => {
      const itens = [
        { id: "chapeu", slot: "cabeca" },
        { id: "capa", slot: "corpo" }
      ];
      const inv = gerarInventarioOrganizado(itens);
      return inv.cabeca.length === 1 && inv.corpo.length === 1 && inv.pet.length === 0;
    })()
  `);
  ok(res273, "273. gerarInventarioOrganizado separou itens por categoria corporal");

  // 274. Estgio evolutivo do mascote
  const res274 = ev(`
    (() => {
      const e1 = calcularNivelEvolucaoMascote(50);
      const e2 = calcularNivelEvolucaoMascote(600);
      return e1.estagio === "bebe" && e2.estagio === "sabio";
    })()
  `);
  ok(res274, "274. calcularNivelEvolucaoMascote determinou maturidade visual do Prumi");

  // 275. Bilhete dirio de sorteio
  const res275 = ev(`
    (() => {
      const b = gerarBilheteSorteioDiario(42);
      return b.numeroSorte === 42 && b.validado === true && typeof b.data === "string";
    })()
  `);
  ok(res275, "275. gerarBilheteSorteioDiario emitiu ticket do dia");

  // 276. Conquista: Mestre do Tempo
  const res276 = ev(`
    (() => {
      const c1 = avaliarConquistaMestreTempo(90);
      const c2 = avaliarConquistaMestreTempo(120);
      return c1.desbloqueado === false && c2.desbloqueado === true && c2.titulo === "Mestre do Tempo";
    })()
  `);
  ok(res276, "276. avaliarConquistaMestreTempo checou marca de 100h");

  // 277. Bnus de completude de coleo do mundo
  const res277 = ev(`
    (() => {
      const r1 = calcularRecompensaCompletudeMundo(10, 5);
      const r2 = calcularRecompensaCompletudeMundo(10, 10);
      return r1.completou === false && r2.completou === true && r2.bonusGotas === 150;
    })()
  `);
  ok(res277, "277. calcularRecompensaCompletudeMundo bonificou mundo 100%");

  // 278. Carta simblica do dia
  const res278 = ev(`
    (() => {
      const c = gerarCartaTarotDoDia(0);
      return c.nome === "A Estrela" && typeof c.reflexao === "string";
    })()
  `);
  ok(res278, "278. gerarCartaTarotDoDia gerou carta arquetpica diria");

  // 279. Bnus madrugador
  const res279 = ev(`
    (() => {
      const b1 = calcularBonusPrimeiraTarefaDia("07:30");
      const b2 = calcularBonusPrimeiraTarefaDia("10:00");
      return b1.madrugador === true && b1.bonusGotas === 15 && b2.madrugador === false;
    })()
  `);
  ok(res279, "279. calcularBonusPrimeiraTarefaDia bonificou primeira tarefa antes das 9h");

  // 280. Efeito de trofu desbloqueado
  const res280 = ev(`
    (() => {
      const t = gerarEfeitoTrofeuDesbloqueado("Super Foco");
      return t.conquista === "Super Foco" && t.animacao === "confetes-dourados";
    })()
  `);
  ok(res280, "280. gerarEfeitoTrofeuDesbloqueado montou payload sensorial comemorativo");

  await fechar();
  return erros;
};
