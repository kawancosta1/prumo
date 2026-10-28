// Sincronização entre aparelhos (js/estado.js): junta as mudanças dos dois lados em vez de um apagar o outro
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const t = (id, title, extra = "") =>
    `{ id: "${id}", title: "${title}", area: "geral", date: today(), done: false, prio: 0, sub: []${extra} }`;

  // junção pura
  ok(
    ev(`JSON.stringify(mesclar({ a: 1, b: 1 }, { a: 2, b: 1 }, { a: 1, b: 3 }))`) === '{"a":2,"b":3}',
    "cada lado mudou uma coisa: fica as duas"
  );
  ok(
    ev(
      `JSON.stringify(mesclar([{ id: "1", t: "a" }, { id: "2", t: "b" }], [{ id: "1", t: "a" }], [{ id: "1", t: "a" }, { id: "2", t: "b" }, { id: "3", t: "c" }]))`
    ) === '[{"id":"1","t":"a"},{"id":"3","t":"c"}]',
    "apagado aqui e novo lá: some um, entra o outro"
  );
  ok(
    ev(
      `JSON.stringify(mesclar([{ id: "1", t: "a", d: 0 }], [{ id: "1", t: "a", d: 1 }], [{ id: "1", t: "X", d: 0 }]))`
    ) === '[{"id":"1","t":"X","d":1}]',
    "mesma tarefa mudada nos dois (campos diferentes): junta"
  );
  ok(
    ev(
      `JSON.stringify(mesclar({ "2026-10-01": [{ t: "9:00", ml: 200 }] }, { "2026-10-01": [{ t: "9:00", ml: 200 }], "2026-10-02": [{ t: "8:00", ml: 300 }] }, { "2026-10-01": [{ t: "9:00", ml: 200 }], "2026-10-03": [{ t: "7:00", ml: 100 }] }))`
    ).includes("2026-10-03"),
    "água de dias diferentes nos dois aparelhos: fica tudo"
  );

  // aparelho sem a base nova e com dados velhos: antes de ver a nuvem não manda nada; depois junta sem perder
  ev(
    `window.__enviados = []; ref = { set: async b => { __enviados.push(JSON.parse(JSON.stringify(b))); } }; nuvemVista = false; base = null; S.name = ""; S.perfil.usuario = ""; S.tasks = [${t("v", "Velha")}]; updatedAt = Date.now() + 99999; persist(); push();`
  );
  ok(ev("__enviados.length") === 0, "não manda nada pra nuvem antes de ver o que tem lá");
  ev(
    `nuvemVista = true; receberDaNuvem({ updatedAt: 10, state: { ...JSON.parse(JSON.stringify(S)), name: "Kawan", perfil: { ...S.perfil, usuario: "kawan" }, tasks: [${t("n", "Nova do celular")}] } })`
  );
  await espera(30);
  ok(
    ev("S.name") === "Kawan" && ev("S.perfil.usuario") === "kawan",
    "nome e @ que vieram de outro aparelho ficam"
  );
  ok(ev(`S.tasks.map(t => t.id).sort().join("")`) === "nv", "sem base: junta as tarefas dos dois");

  // dois aparelhos de verdade (nuvem de mentira)
  ev(
    `S.onboarded = true; S.semConta = false; S.tasks = []; window.__enviados = []; ref = { set: async b => { __enviados.push(JSON.parse(JSON.stringify(b))); } }; base = null; sujo = false; updatedAt = 0; lastPushed = 0;`
  );
  ev(
    `receberDaNuvem({ updatedAt: 1000, state: { ...JSON.parse(JSON.stringify(S)), tasks: [${t("a", "Comprar pão")}], coins: 10 } })`
  );
  ok(ev(`S.tasks.length === 1 && base.updatedAt === 1000 && !sujo`), "primeira versão da nuvem vira a base");

  // este aparelho cria B; a nuvem (outro aparelho) cria C e muda o título de A
  ev(`S.tasks.push(${t("b", "Estudar")}); persist();`);
  ok(ev("sujo") === true, "mudança daqui fica marcada como não enviada");
  ev(
    `receberDaNuvem({ updatedAt: 1500, state: { ...JSON.parse(JSON.stringify(base.state)), tasks: [${t("a", "Comprar pão e leite")}, ${t("c", "Academia")}], coins: 25 } })`
  );
  await espera(30);
  const titulos = ev(`S.tasks.map(t => t.title).sort().join("|")`);
  ok(
    titulos === "Academia|Comprar pão e leite|Estudar",
    "junta: tarefa nova daqui, nova de lá e título mudado lá (" + titulos + ")"
  );
  ok(ev("S.coins") === 25, "o que só mudou lá chega aqui");
  ok(
    ev(`__enviados.length >= 1 && __enviados[__enviados.length - 1].state.tasks.length === 3`),
    "a versão junta é mandada pra nuvem"
  );
  ok(
    ev(`!sujo && base.updatedAt === __enviados[__enviados.length - 1].updatedAt`),
    "depois de mandar, a base é a versão junta"
  );

  // relógio do outro aparelho atrasado: versão "menor", mas diferente da base, não é ignorada
  ev(`S.tasks = S.tasks.filter(t => t.id !== "c"); persist();`);
  ev(
    `receberDaNuvem({ updatedAt: 5, state: { ...JSON.parse(JSON.stringify(base.state)), tasks: [...base.state.tasks, ${t("d", "Ligar pra vó")}] } })`
  );
  await espera(30);
  const t2 = ev(`S.tasks.map(t => t.id).sort().join("")`);
  ok(
    t2 === "abd",
    "relógio atrasado no outro aparelho não apaga nada; apagado aqui continua apagado (" + t2 + ")"
  );

  // mudança automática não disputa com a nuvem
  ev(`window.__v0 = updatedAt; persist(true);`);
  ok(ev("updatedAt === __v0"), "salvar automático não muda a versão");
  // nuvem mudou e aqui não: só usa a da nuvem
  ev(
    `sujo = false; receberDaNuvem({ updatedAt: 9000, state: { ...JSON.parse(JSON.stringify(base.state)), waterGoal: 3100 } })`
  );
  ok(ev("S.waterGoal") === 3100 && !ev("sujo"), "sem mudança aqui: pega a da nuvem direto");

  // celular ficou sem internet, mexeu e voltou: a versão dele chega sem ter visto o nosso último envio
  ev(`window.__enviados = []; sujo = false; S.tasks = [${t("p1", "Do PC")}]; persist();`);
  await espera(700);
  await espera(30);
  const meuEnvio = ev("base.enviado");
  ok(
    meuEnvio &&
      ev("__enviados.length") >= 1 &&
      ev("__enviados[__enviados.length - 1].linha.includes(base.enviado)"),
    "cada envio leva a linha de versões"
  );
  ev(
    `receberDaNuvem({ updatedAt: base.updatedAt + 50, linha: [1, 2, 3], state: { ...JSON.parse(JSON.stringify(S)), tasks: [${t("c1", "Do celular offline")}] } })`
  );
  await espera(30);
  ok(
    ev(`S.tasks.map(t => t.id).sort().join(",")`) === "c1,p1",
    "versão que não viu a nossa: junta em vez de apagar a tarefa daqui"
  );

  // falhou ao mandar: tenta de novo quando a internet volta
  ev(
    `window.__falhas = 0; ref = { set: async b => { if (__falhas++ < 1) throw { code: "unavailable" }; __enviados.push(b); } }; window.__antes = __enviados.length; S.tasks.push(${t("x1", "Sem rede")}); persist();`
  );
  await espera(800);
  ok(ev("sujo") === true, "falhou: continua marcado como pendente");
  w.dispatchEvent(new w.Event("online"));
  await espera(50);
  ok(ev("__enviados.length > __antes") && !ev("sujo"), "internet voltou: manda sozinho");

  // voltar no tempo
  await ev(`guardarVersao("teste")`);
  await espera(50);
  ok(ev("lerVersoes().length") >= 1, "guarda uma cópia compactada");
  const qtd = ev("S.tasks.length");
  ev(`S.tasks = []; persist(); tab = "ajustes"; render();`);
  const bt = () => w.document.querySelector('[data-act="versao-restaurar"]');
  ok(!!bt(), "aparece em Ajustes");
  bt().dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  bt().dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await espera(80);
  ok(ev("S.tasks.length") === qtd, "restaurar traz os dados de volta");

  // novo aparelho sem dados recebendo conta existente: mantém onboarded e persona da nuvem sem loop
  // novo aparelho sem dados recebendo conta existente: mantém onboarded e persona da nuvem sem loop
  const diag = ev(`
    (() => {
      S.onboarded = false;
      S.tasks = [];
      S.habits = [];
      sujo = false;
      base = null;
      receberDaNuvem({
        updatedAt: Date.now() + 1000000,
        state: {
          ...JSON.parse(JSON.stringify(S)),
          onboarded: true,
          name: "Kawan",
          persona: "rock",
          tasks: [{ id: "ok1", title: "Tarefa remota", area: "geral", date: today(), done: false, prio: 0, sub: [] }]
        }
      });
      renderOnb();
      return { onboarded: S.onboarded, name: S.name, persona: S.persona };
    })()
  `);
  ok(
    diag.onboarded === true && diag.name === "Kawan" && diag.persona === "rock",
    "aparelho novo recebendo conta existente mantém onboarded = true e persona da nuvem"
  );

  fechar();
  return erros;
};
