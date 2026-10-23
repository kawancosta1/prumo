// Quarto, parte 2 (js/quarto-extras.js): lugares novos, itens vivos, kits, época, bagunça, presentes e arrastar
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };
  ev(`S.onboarded = true; S.semConta = true; S.leitura.saldo = 2000; setPersona("emo"); tab = "estante"; estanteTab = "decorar"; commit();`);
  await espera(30);

  for (const lugar of ["Luzes e varais", "Cortina", "Planta da janela", "Móvel", "Pelúcia"]) ok(M().includes(lugar), `loja tem o lugar ${lugar}`);
  ok(/Kit do mundo/.test(M()) && /Quarto gótico/.test(M()), "kit do mundo emo aparece");
  ok(/Arrastar coisas no quarto/.test(M()), "botão de arrastar coisas");

  // época: Halloween aparece de 15/10 a 05/11, Natal não
  ok(ev(`epocaAtiva("halloween", "2026-10-23") && !epocaAtiva("natal", "2026-10-23") && epocaAtiva("natal", "2027-01-03")`), "datas das épocas (inclusive virando o ano)");
  ok(ev(`quartoDisponivel(ITEM_QUARTO.q_teto_natal)`) === ev(`epocaAtiva("natal")`), "item de Natal só na época");

  // comprar e usar o kit inteiro dá o bônus
  clicar('[data-act="quarto"][data-id="q_kit_emo_teto"]');
  clicar('[data-act="quarto"][data-id="q_kit_emo_movel"]');
  await espera(20);
  ok(ev("S.leitura.comprados.includes('q_kit_emo_teto') && S.leitura.decor.quarto.movel === 'q_kit_emo_movel'"), "compra e usa os itens do kit");
  const antes = ev("S.leitura.saldo");
  clicar('[data-act="kit-premio"][data-id="emo"]');
  ok(ev("S.leitura.saldo") === antes + 30, "kit completo dá +30 páginas");
  ok(!D.querySelector('[data-act="kit-premio"]') && ev("S.leitura.saldo") === antes + 30, "bônus do kit só uma vez");

  // itens vivos
  ev(`S.tasks.push({ id: "mx", title: "Estudar <b>física</b>", area: "geral", date: today(), done: false, prio: 0, sub: [] });`);
  const mural = ev(`muralSVG(minhaEstante())`);
  ok(mural.includes("Estudar") && !mural.includes("<b>"), "mural mostra a tarefa de hoje com texto escapado");
  ok(ev(`plantaQuarto("girassol", minhaEstante())`).includes("fase0") && (ev(`for (let i = 0; i < 12; i++) S.habitLog[addDays(today(), -i)] = ["h1", "h2"]; plantaQuarto("girassol", minhaEstante())`) || "").includes("fase4"), "planta cresce com os hábitos feitos");
  ok(/papel|rect/.test(ev(`escrivaninhaSVG(minhaEstante())`)) && ev(`(S.tasks.forEach(t => (t.done = true)), escrivaninhaSVG(minhaEstante()))`).includes("luz-mesa"), "escrivaninha fica arrumada sem pendências");

  // bagunça e estrela cadente
  ev(`const e = quartoExtras(); e.bagunca = []; e.ultimaVisita = addDays(today(), -3); conferirBagunca(); tab = "estante"; estanteTab = "estante"; render();`);
  ok(ev("quartoExtras().bagunca.length") >= 3 && D.querySelectorAll(".roupa-chao").length >= 3, "depois de 3 dias fora aparecem roupas no chão");
  const s0 = ev("S.leitura.saldo");
  clicar('.roupa-chao[data-id="0"]');
  ok(ev("S.leitura.saldo") === s0 + 2, "arrumar uma roupa dá +2 páginas");
  ev(`quartoExtras().cadente = ""`);
  const s1 = ev("S.leitura.saldo");
  ev(`ACOES_EXTRAS["estrela-cadente"]()`);
  ev(`ACOES_EXTRAS["estrela-cadente"]()`);
  ok(ev("S.leitura.saldo") === s1 + 10, "estrela cadente dá +10 páginas uma vez por dia");

  // presente de amigo
  ev(`guardarPresente({ mimo: "presente_flores", deNome: "Bia <script>" }); guardarPresente({ mimo: "virus" }); render();`);
  ok(ev("quartoExtras().presentes.length") === 1 && /presente/.test(M()) && !/<script>/.test(M()), "presente de amigo aparece no quarto (e só presentes válidos)");
  ok(ev(`MIMO_TEXTO.presente_bolo`).includes("bolo"), "texto do aviso de presente");

  // posição livre
  ev(`quartoExtras().pos.poster = { x: 30, y: 40 }; S.leitura.decor.quarto.poster = "q_calendario"; S.leitura.comprados.push("q_calendario"); render();`);
  ok(/q-poster arrastavel" data-slot="poster" transform="translate\(30 40\)"/.test(M()), "pôster na posição escolhida");
  ev(`quartoExtras().pos.poster = { x: 9999, y: -50 }; render();`);
  ok(!/translate\(9999/.test(M()), "posição fora do quarto é corrigida");

  // amigo vê o quarto sem dados pessoais
  const amigo = ev(`quartoSVG({ lidos: [], lendo: [], decor: { enfeites: [], quarto: { poster: "q_mural", janela: "q_janela_viva" } }, equip: {}, persona: "emo", meu: false })`);
  ok(!amigo.includes("Estudar") && !amigo.includes("estrela-cadente"), "no quarto do amigo não aparecem suas tarefas nem a estrela");

  fechar();
  return erros;
};
