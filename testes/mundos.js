// Mundos Roqueiro e Emo, parte 2: guarda-roupa, bis, ensaio, banda, ingressos, cartas, diário, madrugada, chuva e mixtape
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
  const enviar = sel => D.querySelector(sel).dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  const mudar = (sel, valor) => {
    const el = D.querySelector(sel);
    if (!el) return erros.push("não achei " + sel);
    el.value = valor;
    el.dispatchEvent(new w.Event("change", { bubbles: true }));
  };

  ev(`S.onboarded = true; S.semConta = true; S.name = "Kawan"; S.tasks.push({ id: "base", title: "base", area: "geral", date: addDays(today(), -1), done: true, prio: 0, repeat: "", sub: [] }); commit();`);

  /* ---------- Roqueiro: guarda-roupa ---------- */
  const novos = ev(`ITEMS.filter(i => i.p === "rock" && ["pins","wrist","string","neck","mouth","cheek","pet"].includes(i.slot)).length`);
  ok(novos >= 30, `roqueiro tem ${novos} itens pequenos (bottons, pulso, fio, colar, boca, maquiagem, pets)`);
  const quebrados = ev(`ITEMS.filter(i => i.p === "rock").filter(i => { try { const s = i.slot === "wrist" || i.slot === "hand" ? i.svg(10, 80) : i.svg("happy"); return typeof s !== "string" || !s.length; } catch (e) { return true; } }).map(i => i.id)`);
  ok(quebrados.length === 0, "todos os itens do roqueiro desenham sem erro " + quebrados.join(","));
  ok(ev(`new Set(ITEMS.map(i => i.id)).size === ITEMS.length`), "nenhum id de item repetido no app");

  ev(`setPersona("rock"); tab = "hoje"; render();`);
  ok(/Ensaio relâmpago/.test(M()) && /Sua banda/.test(M()) && /Coleção de ingressos/.test(M()), "Hoje do roqueiro tem ensaio, banda e ingressos");
  ok(/Entre com uma conta/.test(M()), "sem conta, a banda explica que precisa de amigos");

  /* ---------- Bis ---------- */
  ev(`S.tasks.push({ id: "t1", title: "Música 1", area: "geral", date: today(), done: false, prio: 0, repeat: "", sub: [] }, { id: "t2", title: "Música 2", area: "geral", date: today(), done: false, prio: 0, repeat: "", sub: [] }); commit();`);
  ok(!/pede BIS/.test(M()), "sem setlist completa, nada de bis");
  clicar('[data-act="toggle"][data-id="t1"]');
  clicar('[data-act="toggle"][data-id="t2"]');
  await espera(50);
  ok(/A plateia pede BIS/.test(M()), "setlist completa: a plateia pede bis");
  clicar('[data-act="bis-outra"]');
  const sugestao = D.querySelector(".bis-sugestao").textContent;
  clicar('[data-act="bis-tocar"]');
  await espera(30);
  const bis = ev(`S.tasks.find(t => t.bis)`);
  ok(bis && bis.title === "Bis: " + sugestao && ev("S.rock.bisDia") === ev("today()"), "bis vira uma tarefa na setlist");
  const gotasNormal = ev(`S.tasks.find(t => t.id === "t1").paid`);
  clicar(`[data-act="toggle"][data-id="${bis.id}"]`);
  await espera(30);
  const pagoBis = ev(`S.tasks.find(t => t.bis).paid`);
  ok(pagoBis === gotasNormal * 2, `bis paga em dobro (${pagoBis} contra ${gotasNormal})`);
  ok(/Bis tocado/.test(M()) && !/pede BIS/.test(M()), "depois do bis, não pede de novo hoje");
  const antesDesmarcar = ev("S.coins");
  clicar(`[data-act="toggle"][data-id="${bis.id}"]`);
  await espera(30);
  ok(ev("S.coins") === antesDesmarcar - pagoBis, "desmarcar o bis devolve as gotas em dobro");

  /* ---------- Ensaio relâmpago ---------- */
  const moedas0 = ev("S.coins");
  clicar('[data-act="ensaio-abrir"]');
  await espera(50);
  ok(!!D.getElementById("jogo-ritmo") && D.querySelectorAll(".jr-bt").length === 5, "ensaio abre com 5 pistas");
  // acerta as três primeiras notas no tempo certo e erra uma tecla vazia
  for (let k = 0; k < 3; k++) {
    ev(`(() => { const n = jogo.notas.filter(n => !n.acertou)[0]; jogo.inicio = performance.now() - n.t * 1000; tocarPista(n.pista); })()`);
  }
  ok(ev("jogo.acertos") === 3 && ev("jogo.combo") === 3 && ev("jogo.pontos") === 300, "acertos no tempo contam pontos e combo");
  ev(`jogo.inicio = performance.now() + 60000; tocarPista(0)`);
  ok(ev("jogo.combo") === 0, "tocar fora do tempo zera o combo");
  ev("terminarEnsaio()");
  await espera(30);
  ok(!D.getElementById("jr-fim").hidden && /gotas/.test(D.getElementById("jr-fim").textContent), "fim do ensaio mostra o resultado");
  ok(ev("S.coins") > moedas0 && ev("S.rock.jogo.dia") === ev("today()") && ev("S.rock.jogo.recorde") === 300, "primeiro ensaio do dia dá gotas e guarda o recorde");
  w.document.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape" }));
  await espera(30);
  ok(!D.getElementById("jogo-ritmo"), "Esc fecha o ensaio");
  const moedas1 = ev("S.coins");
  clicar('[data-act="ensaio-abrir"]');
  ok(/treino livre/.test(D.getElementById("jr-dica").textContent), "segundo ensaio do dia é treino livre");
  ev("terminarEnsaio()");
  ok(ev("S.coins") === moedas1, "treino livre não dá gotas");
  clicar('[data-jr="fechar"]');

  /* ---------- Banda ---------- */
  // conta e amigos de mentira (sem Firebase): um banco que não faz nada e duas amizades aceitas
  ev(`(() => {
      const docFalso = { set: async () => {}, get: async () => ({ exists: false, data: () => null }), delete: async () => {}, onSnapshot: () => () => {} };
      const consulta = { onSnapshot: () => () => {}, get: async () => ({ docs: [], empty: true }), where: () => consulta, limit: () => consulta };
      banco = { doc: () => docFalso, collection: () => ({ ...consulta, add: async () => ({}) }), runTransaction: async () => {} };
      fb = { auth: {}, db: banco }; contaUsuario = { email: "eu@x.com", emailVerified: true }; meuId = "eu";
      S.consentimento = { versao: POLITICA_VERSAO, em: Date.now() };
      amizades = { a1_eu: { uids: ["eu", "a1"], estado: "aceita", de: "eu" }, a2_eu: { uids: ["eu", "a2"], estado: "aceita", de: "a2" } };
      carregarAmigo = async () => ({});
      amigosInfo.a1 = { vitrine: { nome: "Bia", persona: "emo", equip: {} } }; amigosInfo.a2 = { vitrine: { nome: "Leo", persona: "rock", equip: {} } };
      render();
    })()`);
  mudar('select[data-change="banda-membro"][data-k="bateria"]', "a1");
  ok(ev("S.rock.banda.bateria") === "a1" && /<b>Bia<\/b> entrou na banda/.test(D.getElementById("bubble").innerHTML), "amigo entra na bateria");
  mudar('select[data-change="banda-membro"][data-k="baixo"]', "a1");
  ok(ev("S.rock.banda.baixo") === "a1" && !ev("S.rock.banda.bateria"), "um amigo toca um instrumento só");
  ok(D.querySelectorAll(".palco-banda .membro").length === 5 && D.querySelectorAll(".palco-banda .membro.vaga").length === 3, "palco mostra você, um amigo e três vagas");

  /* ---------- Ingressos ---------- */
  ev(`(() => { const seg = addDays(mondayOf(today()), -7); for (let i = 0; i < 6; i++) S.tasks.push({ id: "w" + i, title: "show", area: "geral", date: addDays(seg, i), done: true, prio: 0, repeat: "", sub: [] }); })()`);
  const moedas2 = ev("S.coins");
  const novosIng = ev("conferirIngressos().length");
  ok(novosIng === 1 && ev("S.rock.ingressos.length") === 1 && ev("S.coins") === moedas2 + 25, "semana com 6 shows vira ingresso e dá 25 gotas");
  ok(ev("conferirIngressos().length") === 0 && ev("S.rock.ingressos.length") === 1, "o mesmo ingresso não é entregue duas vezes");
  ev(`tab = "prumi"; prumiTab = "perfil"; render();`);
  ok(/Ingressos \(1\)/.test(M()), "ingresso aparece no perfil");
  const vit = ev(`JSON.stringify(montarVitrine())`);
  ok(JSON.parse(vit).ingressos.total === 1, "amigos veem os ingressos na vitrine");
  ok(ev(`limparVitrine({ ingressos: { total: 1, ultimos: [{ semana: "<b>", cor: "red;x", palco: "<i>p</i>", shows: 99 }] } }).ingressos.ultimos[0].cor`) === "#E0312F", "ingresso de amigo vem limpo");

  /* ---------- Emo ---------- */
  ev(`setPersona("emo"); tab = "hoje"; render();`);
  ok(/Cartas pro futuro/.test(M()) && /Querido diário/.test(M()) && /Monte sua mixtape/.test(M()), "Hoje do emo tem cartas, diário e mixtape");

  // Cartas
  D.getElementById("carta-txt").value = "Oi eu do futuro <b>!</b>";
  mudar("#carta-prazo", "7");
  enviar('form[data-form="carta-nova"]');
  await espera(30);
  const carta = ev("S.emo.cartas[0]");
  ok(carta && carta.abre === ev("addDays(today(), 7)") && !carta.aberta, "carta lacrada para daqui a 7 dias");
  ok(!M().includes("Oi eu do futuro"), "carta lacrada não mostra o texto");
  ev(`ACOES_EXTRAS["carta-abrir"](null, S.emo.cartas[0].id)`);
  ok(!ev("S.emo.cartas[0].aberta"), "não abre antes da data");
  ev(`S.emo.cartas[0].abre = today(); render();`);
  ok(/Chegou uma carta do passado/.test(M()), "no dia, a carta chega");
  clicar('[data-act="carta-abrir"]');
  await espera(30);
  ok(ev("S.emo.cartas[0].aberta") && M().includes("Oi eu do futuro &lt;b&gt;!&lt;/b&gt;"), "carta aberta mostra o texto (escapado)");

  // Diário com cadeado
  ev(`S.journal[addDays(today(), -2)] = { note: "segredo do diário", closed: true }; S.journal[today()] = { note: "texto-hoje-secreto", closed: true }; render();`);
  ok(M().includes("segredo do diário"), "diário mostra as páginas sem cadeado");
  D.getElementById("diario-pin1").value = "1234";
  D.getElementById("diario-pin2").value = "4321";
  enviar('form[data-form="diario-cadeado"]');
  ok(!ev("S.emo.cadeado"), "PINs diferentes não trancam");
  D.getElementById("diario-pin1").value = "1234";
  D.getElementById("diario-pin2").value = "1234";
  enviar('form[data-form="diario-cadeado"]');
  await espera(30);
  ok(ev("S.emo.cadeado") && !JSON.stringify(ev("S.emo.cadeado")).includes("1234"), "cadeado guarda só o resumo do PIN");
  ok(!M().includes("segredo do diário") && !M().includes("texto-hoje-secreto") && !M().includes("Oi eu do futuro"), "trancado: páginas, nota de hoje e cartas abertas somem " + ["segredo do diário", "texto-hoje-secreto", "Oi eu do futuro"].filter(t => M().includes(t)).join("|"));
  D.getElementById("diario-pin").value = "0000";
  enviar('form[data-form="diario-abrir"]');
  ok(!M().includes("segredo do diário"), "PIN errado não abre");
  D.getElementById("diario-pin").value = "1234";
  enviar('form[data-form="diario-abrir"]');
  await espera(30);
  ok(M().includes("segredo do diário") && M().includes("texto-hoje-secreto"), "PIN certo abre o diário");
  clicar('[data-act="diario-trancar"]');
  clicar('[data-act="diario-esqueci"]');
  clicar('[data-act="diario-esqueci-sim"]');
  await espera(30);
  ok(!ev("S.emo.cadeado") && M().includes("segredo do diário"), "esqueci o PIN tira o cadeado sem perder páginas");

  // Madrugada
  ev(`window.__DataReal = Date; Date = class extends __DataReal { constructor(...a) { if (a.length) super(...a); else super(2026, 9, 24, 3, 10); } static now() { return new __DataReal(2026, 9, 24, 3, 10).getTime(); } }; selDay = today(); conferirClimaEmo(); render();`);
  ok(D.documentElement.classList.contains("madrugada"), "de madrugada o html ganha a classe madrugada");
  ev("reaction = null; render();");
  ok(D.querySelector(".hero .olheiras") && /manhã|vampiros|diário|cidade|estrelas|Madrugada/.test(D.getElementById("bubble").innerHTML), "Prumi com olheiras e fala de madrugada " + !!D.querySelector(".hero .olheiras") + " " + D.getElementById("bubble").innerHTML.slice(0, 80));
  ev(`Date = __DataReal; selDay = today(); conferirClimaEmo(); render();`);
  ok(!D.documentElement.classList.contains("madrugada") || new w.Date().getHours() < 5, "de dia a classe sai");

  // Chuva no vidro
  ev(`timer.running = true; timer.start = Date.now(); conferirClimaEmo(); render();`);
  ok(D.documentElement.classList.contains("chovendo") && D.querySelectorAll(".herobox .vidro-chuva i").length === 18, "foco ligado: chove no vidro do cartão");
  ev(`timer.running = false; conferirClimaEmo();`);
  ok(!D.documentElement.classList.contains("chovendo"), "foco parado: a chuva para");

  // Mixtape
  mudar("#mix-nome", "Pra chorar no ônibus");
  D.getElementById("mix-faixa").value = "Minha <música>";
  enviar('form[data-form="mix-faixa"]');
  clicar('[data-act="mix-inventar"]');
  await espera(30);
  ok(ev("S.emo.mixtape.nome") === "Pra chorar no ônibus" && ev("S.emo.mixtape.faixas.length") === 2, "fita com nome e duas faixas");
  ok(M().includes("Minha &lt;música&gt;"), "faixa escapada na tela");
  ev(`window.__enviado = null; mandarParaCaixa = async (uid, tipo, texto, extra) => { __enviado = { uid, tipo, texto, extra }; return true; }; render();`);
  mudar('select[data-change="mix-amigo"]', "a2");
  clicar('[data-act="mix-mandar"]');
  await espera(30);
  const env = ev("__enviado");
  ok(env && env.uid === "a2" && env.tipo === "mixtape" && env.texto.startsWith("Pra chorar no ônibus\nMinha <música>") && env.extra.mixtape.faixas.length === 2, "fita mandada para o amigo pela caixa");
  ok(JSON.parse(ev(`JSON.stringify(montarVitrine())`)).mixtape.faixas.length === 2, "amigos veem a fita na vitrine");
  ev(`caixaItens = [{ id: "c1", tipo: "mixtape", de: "a1", deNome: "<b>Bia</b>", texto: "Fita <i>x</i>\\nfaixa <img src=x>", em: Date.now(), visto: false }]; tab = "avisos"; render();`);
  ok(/te mandou uma mixtape/.test(M()) && !/<img src=x>/.test(M()) && !/<i>x<\/i>/.test(M()), "mixtape recebida aparece nos avisos, escapada");

  fechar();
  return erros;
};
