// Os outros 13 mundos (js/mundos/*-extras.js): cartão no Hoje, sons, efeitos, roupas e o recurso de cada um
const { abrir } = require("./ambiente");

const MUNDOS = ["sertanejo", "forrozeiro", "pagodeiro", "funkeiro", "rapper", "trapper", "gamer", "otaku", "programador", "zen", "coach", "vovo", "cleanboy"];

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };
  // conclui uma tarefa nova pelo botão, como a pessoa faria
  const concluir = async (titulo, prio = 0) => {
    const id = "t" + Math.random().toString(36).slice(2, 8);
    ev(`S.tasks.push({ id: "${id}", title: "${titulo}", area: "geral", date: today(), done: false, prio: ${prio}, repeat: "", sub: [] }); tab = "hoje"; render();`);
    clicar(`[data-act="toggle"][data-id="${id}"]`);
    await espera(30);
    return id;
  };

  ev(`S.onboarded = true; S.semConta = true; S.name = "Kawan"; commit();`);
  ok(ev(`new Set(ITEMS.map(i => i.id)).size === ITEMS.length`), "nenhum id de item repetido");

  for (const m of MUNDOS) {
    ev(`setPersona("${m}"); applyTheme(); tab = "hoje"; S.tasks = [{ id: "fixa", title: "Tarefa de base", area: "geral", date: addDays(today(), 1), done: false, prio: 0, repeat: "", sub: [] }]; commit();`);
    await espera(20);
    const fx = ev(`(() => { const f = MUNDO_FX["${m}"]; return f && [typeof f.secaoHoje, typeof f.trocaAba, Object.keys(f.textos || {}).length, typeof f.enfeiteHero].join() })()`);
    ok(fx && fx.startsWith("function,function,") && Number(fx.split(",")[2]) >= 15, `${m}: efeitos, textos e cartão próprios`);
    ok(/cartao-mundo/.test(M()), `${m}: cartão do mundo aparece no Hoje`);
    ok(ev(`typeof SONS_MUNDO["${m}"].concluir === "function" && typeof SONS_MUNDO["${m}"].ambiente === "function" && somDoMundo()`), `${m}: som ao concluir e som ambiente`);
    const quebrados = ev(`ITEMS.filter(i => i.p === "${m}").filter(i => { try { const s = ["wrist", "hand"].includes(i.slot) ? i.svg(10, 80) : i.svg("happy"); return typeof s !== "string" || !s.length || /undefined|NaN/.test(s); } catch (e) { return true; } }).map(i => i.id)`);
    ok(quebrados.length === 0, `${m}: roupas desenham sem erro ${quebrados.join(",")}`);
    ok(ev(`ITEMS.filter(i => i.p === "${m}").length`) >= 15, `${m}: guarda-roupa com roupas novas (${ev(`ITEMS.filter(i => i.p === "${m}").length`)})`);
    ev(`MUNDO_FX["${m}"].trocaAba()`);
    await concluir("Estudar cálculo");
    ok(/cartao-mundo/.test(M()), `${m}: concluir tarefa não quebra o cartão`);
    ok(ev(`textoMundo("tarefas", "x")`) !== "x", `${m}: textos da aba Hoje no jeito do mundo`);
  }

  /* ---------- recursos de cada mundo ---------- */
  ev(`setPersona("sertanejo"); dadosMundo("sertanejo").canteiros = [{ tipo: "milho", regas: 4 }, { tipo: "feijao", regas: 4 }, { tipo: "girassol", regas: 4 }]; S.tasks = []; commit();`);
  await concluir("Lida");
  ok(ev(`rocaDados().canteiros.filter(c => c.regas === 5).length`) === 1, "sertanejo: tarefa rega um canteiro e ele amadurece");
  const gotas0 = ev("S.coins");
  clicar('[data-act="roca-colher"]');
  ok(ev("S.coins") >= gotas0 + 12 && ev("rocaDados().colhidos") === 1, "sertanejo: colher dá gotas e replanta");

  ev(`setPersona("forrozeiro"); S.tasks = []; S.water = {}; commit();`);
  for (let i = 0; i < 6; i++) await concluir("Xote " + i);
  ok(ev("bandeirinhasHoje()") === 12 && /forro-quadrilha/.test(M()), "forró: 6 tarefas completam o varal e liberam a quadrilha");
  clicar('[data-act="forro-quadrilha"]');
  ok(!/forro-quadrilha/.test(M()), "forró: quadrilha só uma vez por dia");

  ev(`setPersona("pagodeiro"); S.tasks = []; commit();`);
  await concluir("Samba 1");
  await concluir("Samba 2");
  ok(ev("naRoda()") === 2 && /pagode-tocar/.test(M()), "pagode: cada tarefa chama um instrumento pra roda");

  ev(`setPersona("rapper"); S.tasks = []; commit();`);
  await concluir("Lavar a louça");
  ok(/lavar a louça/i.test(ev("versoDoDia()[0]")), "rap: tarefa vira verso com o nome dela " + ev("versoDoDia()[0]"));

  ev(`setPersona("gamer"); dadosMundo("gamer").semana = ""; S.tasks = []; commit();`);
  await concluir("Quest", 3);
  ok(ev("bossDados().vida") === 80, "gamer: tarefa de prioridade alta tira 20 do boss");

  ev(`setPersona("programador"); S.tasks = []; dadosMundo("programador").contrib = {}; commit();`);
  await concluir("Corrigir o bug do login");
  ok(ev("devDados().contrib[today()]") === 1 && ev("devDados().commits[0].m").startsWith("fix: "), "programador: tarefa vira commit com o tipo certo " + ev("JSON.stringify([devDados().contrib[today()], devDados().commits[0]])"));
  clicar('[data-act="dev-push"]');
  ok(ev("devDados().push") === ev("today()"), "programador: git push do dia");

  ev(`setPersona("vovo"); dadosMundo("vovo").semana = ""; S.tasks = []; commit();`);
  await concluir("Ligar pra vó");
  ok(ev("mantaDados().pontos.length") === 1, "vovó: afazer vira quadradinho na manta");

  ev(`setPersona("cleanboy"); S.tasks = [{ id: "fixa", title: "Base", area: "geral", date: addDays(today(), 1), done: false, prio: 0, repeat: "", sub: [] }]; commit();`);
  for (const c of ["cama", "pele", "roupa", "mesa", "agua"]) clicar(`[data-act="clean-cuidado"][data-id="${c}"]`);
  ok(ev("rotinaDados().impecaveis.includes(today())"), "clean boy: 5 cuidados fazem o dia impecável");

  ev(`setPersona("coach"); S.habits = [{ id: "hx", name: "Ler", days: [0,1,2,3,4,5,6], time: "", created: today() }]; S.habitLog[today()] = ["hx"]; delete dadosMundo("coach").habito; tab = "hoje"; commit();`);
  const sel = D.querySelector('[data-change="coach-habito"]');
  sel.value = "hx";
  sel.dispatchEvent(new w.Event("change", { bubbles: true }));
  ok(ev("progressoDesafio(coachDados()).feitos") === 1, "coach: desafio de 21 dias conta o hábito feito");
  clicar('[data-act="coach-energia"][data-id="4"]');
  ok(ev("coachDados().energia[today()]") === 4, "coach: check-in de energia");

  ev(`setPersona("trapper"); S.tasks = []; dadosMundo("trapper").dias = []; dadosMundo("trapper").liberadas = 0; commit();`);
  for (let i = 0; i < 3; i++) await concluir("Faixa " + i);
  await espera(1500);
  ok(ev("dripDados().dias.includes(today())"), "trap: 3 tarefas no dia contam pro drip");

  ev(`setPersona("otaku"); S.tasks = []; commit();`);
  for (let i = 0; i < 3; i++) await concluir("Missão " + i);
  clicar('[data-act="otaku-pacote"]');
  ok(ev("dadosMundo('otaku').album.length") === 1, "otaku: pacotinho dá uma figurinha");

  ev(`setPersona("zen"); commit();`);
  ok(/zen-respirar/.test(M()), "zen: botão de respirar");

  ok(ev(`normalize({ mundos: [1, 2] }).mundos`) && !Array.isArray(ev(`normalize({ mundos: [1, 2] }).mundos`)), "dados dos mundos inválidos viram objeto vazio");

  fechar();
  return erros;
};
