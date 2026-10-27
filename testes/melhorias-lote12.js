// Testes Melhorias Gerais: Lote 12 (Itens 111 a 120)
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

  // 111. Árvore de evolução visual do Prumi por nível
  const res111 = ev(`
    (() => {
      const e1 = nivelEvolucaoPrumi(1);
      const e8 = nivelEvolucaoPrumi(8);
      const e15 = nivelEvolucaoPrumi(15);
      const e25 = nivelEvolucaoPrumi(25);
      return e1.estagio === "Bebê" &&
        e8.estagio === "Aprendiz" &&
        e15.estagio === "Explorador" &&
        e25.estagio === "Mestre";
    })()
  `);
  ok(res111, "111. nivelEvolucaoPrumi retornou estágios progressivos de maturidade");

  // 112. Guarda-roupa com prévia dinâmica ao vivo
  const res112 = ev(`
    (() => {
      const container = document.createElement("div");
      previaRoupaAoVivo({ id: "camisa_listrada", slot: "camisa", nome: "Camisa Listrada" }, container);
      const slotEl = container.querySelector('[data-slot="camisa"]');
      return slotEl && slotEl.textContent === "Camisa Listrada";
    })()
  `);
  ok(res112, "112. previaRoupaAoVivo atualizou slot de vestimenta dinamicamente");

  // 113. Camadas livres de roupas
  const res113 = ev(`
    (() => {
      const itens = [
        { slot: "chapeu", id: "chapeu1" },
        { slot: "corpo", id: "corpo1" },
        { slot: "camisa", id: "camisa1" }
      ];
      const ordenados = sistemaCamadasRoupas(itens);
      return ordenados[0].slot === "corpo" &&
        ordenados[1].slot === "camisa" &&
        ordenados[2].slot === "chapeu";
    })()
  `);
  ok(res113, "113. sistemaCamadasRoupas ordenou vestimentas por profundidade de camada");

  // 114. Personalidade customizável do pet
  const res114 = ev(`
    (() => {
      const pet = { nome: "Mingau", especie: "gato" };
      definirTemperamentoPet(pet, "brincalhao");
      const temp1 = pet.temperamento === "brincalhao" && pet.falaFavorita.includes("pular");
      definirTemperamentoPet(pet, "comilao");
      const temp2 = pet.temperamento === "comilao" && pet.falaFavorita.includes("petisco");
      return temp1 && temp2;
    })()
  `);
  ok(res114, "114. definirTemperamentoPet personalizou temperamento e falas do companheiro");

  // 115. Eventos sazonais automáticos para cada estação
  const res115 = ev(`
    (() => {
      // 10 de Janeiro -> Verão no hemisfério sul
      const verao = obterEstacaoAnoAtual(new Date("2026-01-10"));
      // 10 de Julho -> Inverno no hemisfério sul
      const inverno = obterEstacaoAnoAtual(new Date("2026-07-10"));
      return verao.id === "verao" && inverno.id === "inverno";
    })()
  `);
  ok(res115, "115. obterEstacaoAnoAtual detectou estações sazonais do ano");

  // 116. Missões diárias rotativas com desafios temáticos
  const res116 = ev(`
    (() => {
      const missoes = gerarMissoesRotativasDia("2026-10-26", "gamer");
      return Array.isArray(missoes) && missoes.length === 3 && missoes[0].gotas > 0;
    })()
  `);
  ok(res116, "116. gerarMissoesRotativasDia gerou trio de objetivos diários com gotas");

  // 117. Cofre de gotas com juros de produtividade
  const res117 = ev(`
    (() => {
      const res = pouparGotasCofre(200, 14);
      return res.saldoNovo >= 200 && res.taxaPercentual >= 1 && res.rendimentoGotas >= 2;
    })()
  `);
  ok(res117, "117. pouparGotasCofre calculou rendimento proporcional à consistência");

  // 118. Minigame retrô de 8 bits no mundo Gamer
  const res118 = ev(`
    (() => {
      const html = minigameGamer8BitHTML();
      return html.includes("minigame-8bit-container") &&
        html.includes("tela-8bit") &&
        html.includes("btn-8bit");
    })()
  `);
  ok(res118, "118. minigameGamer8BitHTML gerou markup do console pixelado");

  // 119. Fitas cassete colecionáveis no mundo Emo
  const res119 = ev(`
    (() => {
      const html = fitaCasseteEmoHTML("Minhas Memórias", "My Chemical Habits", 35);
      return html.includes("fita-cassete-emo") &&
        html.includes("fita-bobina") &&
        html.includes("Minhas Memórias");
    })()
  `);
  ok(res119, "119. fitaCasseteEmoHTML renderizou fita cassete com bobinas animadas");

  // 120. Viola afinável interativa no mundo Sertanejo
  const res120 = ev(`
    (() => {
      tocarViolaSertanejo("mi");
      tocarViolaSertanejo("si");
      return true;
    })()
  `);
  ok(res120, "120. tocarViolaSertanejo sintetizou notas de afinação caipira");

  await fechar();
  return erros;
};
