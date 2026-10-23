// Mudança de endereço: dados vão do endereço antigo para o novo pelo # do link
const { abrir } = require("./ambiente");

// o jsdom não tem streams de compressão; usa os do Node (os navegadores têm os seus)
const comStreams = w => Object.assign(w, { CompressionStream, DecompressionStream, Response, Blob, TextEncoder, TextDecoder });

module.exports = async url => {
  const todos = [];
  let r = await abrir(url);
  comStreams(r.w);
  r.ev(`S.onboarded = true; S.semConta = true; S.tasks.push({ id: "mud1", title: "Tarefa que vai junto <b>", done: false, created: today() }); commit();
    window.__p = null; pacoteMudanca().then(p => (__p = p));`);
  await r.espera(200);
  const pacote = r.ev("__p");
  r.ok(typeof pacote === "string" && /^z[A-Za-z0-9_-]+$/.test(pacote), "dados viram texto compactado para o link");

  // banner só aparece quando o endereço novo responde
  r.ev(`window.fetch = () => Promise.reject(new TypeError("fora do ar")); avisarMudanca();`);
  await r.espera(50);
  r.ok(!r.w.document.querySelector(".mudanca"), "sem faixa enquanto o endereço novo não está no ar");
  r.ev(`window.fetch = () => Promise.resolve({ json: async () => ({ ativo: true, endereco: "https://javascript:alert(1)/" }) }); avisarMudanca();`);
  await r.espera(50);
  r.ok(!r.w.document.querySelector(".mudanca"), "endereço estranho no mudanca.json é ignorado");
  r.ev(`window.fetch = () => Promise.resolve({ json: async () => ({ ativo: true, endereco: "https://prumo-66d76.web.app/" }) }); avisarMudanca();`);
  await r.espera(50);
  r.ok(/mudou de endereço/.test((r.w.document.querySelector(".mudanca") || {}).textContent || ""), "faixa de mudança aparece no endereço antigo");
  todos.push(...r.erros);
  r.fechar();

  // aparelho novo, sem dados: recebe
  r = await abrir(url + "#mudanca=" + pacote);
  comStreams(r.w);
  // na abertura o jsdom ainda não tinha os streams: repete com eles
  r.ev(`localStorage.clear(); history.replaceState(null, "", location.pathname + "#mudanca=${pacote}"); receberMudanca();`);
  await r.espera(200);
  r.ok(r.ev(`S.tasks.some(t => t.id === "mud1" && t.title === "Tarefa que vai junto <b>")`), "dados chegam no endereço novo");
  r.ok(!!r.ev(`lsGet(LS_KEY)`), "dados ficam salvos no aparelho");
  r.ok(r.ev("location.hash") === "", "o # some do endereço depois");
  // já tem dados: link não troca nada
  r.ev(`S.tasks = S.tasks.filter(t => t.id !== "mud1"); S.tasks.push({ id: "minha", title: "Minha", done: false, created: today() }); commit();
    history.replaceState(null, "", location.pathname + "#mudanca=${pacote}"); receberMudanca();`);
  await r.espera(200);
  r.ok(r.ev(`S.tasks.some(t => t.id === "minha") && !S.tasks.some(t => t.id === "mud1")`), "link não troca dados de quem já tem dados aqui");
  // link quebrado
  r.ev(`localStorage.clear(); history.replaceState(null, "", location.pathname + "#mudanca=zlixo"); receberMudanca();`);
  await r.espera(200);
  r.ok(/Não consegui trazer/.test(r.w.document.getElementById("toast").textContent), "link quebrado avisa sem quebrar o app");
  todos.push(...r.erros);
  r.fechar();
  return todos;
};
