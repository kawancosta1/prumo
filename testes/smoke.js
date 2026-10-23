// Uso geral (abas, tarefa, água, mundos, dados de amigos)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  ok(ev("typeof S") === "object", "app carregou (S existe)");
  ok(/Só neste aparelho|Carregando|Sem conexão|Sincronizado/.test(w.document.getElementById("sync").textContent), "indicador de sync: " + w.document.getElementById("sync").textContent.trim());

  // boas-vindas pulada direto no estado, depois usa o app pelos cliques
  ev(`S.onboarded = true; S.welcomed = true; S.name = "Kawan"; commit();`);
  const clicar = sel => {
    const b = w.document.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };
  // criar tarefa
  ev(`S.tasks.push({ id: "t1", title: "Testar <b>xss</b>", date: today(), done: false, prio: 1, repeat: "", sub: [] }); commit();`);
  ok(w.document.querySelector("#main").innerHTML.includes("Testar &lt;b&gt;xss&lt;/b&gt;"), "tarefa aparece escapada");
  // beber água pelo botão
  const antes = ev("waterToday()");
  clicar('[data-act="cup"], [data-act="drink"], [data-act="water"]');
  await espera(100);
  ok(ev("waterToday()") > antes, "beber água aumenta o total");
  // marcar tarefa como feita
  clicar('[data-act="toggle"][data-id="t1"], [data-act="done"][data-id="t1"], [data-act="task-done"][data-id="t1"]');
  await espera(100);
  ok(ev(`S.tasks.find(t => t.id === "t1").done`) === true, "marcar tarefa como feita");
  // todas as abas
  for (const t of Object.keys(ev("VIEWS"))) {
    try {
      ev(`tab = ${JSON.stringify(t)}; render();`);
      ok(w.document.querySelector("#main").innerHTML.length > 50, "aba " + t);
    } catch (e) {
      erros.push("aba " + t + ": " + e.message);
    }
  }
  // loja em cada mundo
  for (const p of Object.keys(ev("PERSONAS"))) {
    try {
      ev(`setPersona ? setPersona(${JSON.stringify(p)}) : (S.persona = ${JSON.stringify(p)}); tab = "prumi"; render();`);
    } catch (e) {
      erros.push("mundo " + p + ": " + e.message);
    }
  }
  console.log("ok  loja/aba Prumi em " + Object.keys(ev("PERSONAS")).length + " mundos");

  // --- segurança: dados do par maliciosos ---
  const xss = `<img src=x onerror=alert(1)>`;
  ev(`
    window.__ruim = {
      nome: ${JSON.stringify(xss)}, persona: "naoexiste", agua: ${JSON.stringify(xss)}, equip: { hat: ${JSON.stringify(xss)} },
      status: ${JSON.stringify(xss)}, ouvindo: ${JSON.stringify(xss)}, subnick: ${JSON.stringify(xss)},
      humor: { nivel: ${JSON.stringify(xss)}, rosto: ${JSON.stringify(xss)} },
      parceiro: "eu", recados: [{ para: "eu", texto: ${JSON.stringify(xss)}, em: ${JSON.stringify(xss)} }],
      depoimentos: [{ para: "eu", texto: ${JSON.stringify(xss)}, em: ${JSON.stringify('1" onmouseover="alert(1)')} }]
    };
    meuId = "eu"; S.parceria.id = "par1";
    parceiroDados = limparParceiro(window.__ruim);
  `);
  ok(ev("parceriaAtiva()") === true, "parceria ativa com dados limpos");
  ok(ev("parceiroDados.persona") === "zen" && ev("parceiroDados.agua") === 0, "mundo e água inválidos viram padrão");
  ok(ev("parceiroDados.recados.length") === 1 && ev("parceiroDados.depoimentos[0].em") === 0, "recados e depoimentos mantidos e limpos");
  let html = "";
  for (const f of ["parceriaHeroHTML()", "depoimentosBlocoHTML()", "viewPrumi()"]) {
    try {
      html += ev(f);
    } catch (e) {
      erros.push(f + ": " + e.message);
    }
  }
  ok(html.length > 100 && !/<img src=x/i.test(html) && !/onmouseover="alert/.test(html), "nenhum HTML do par entra cru na tela");
  ok(ev(`limparPerfilPublico({ nome: ${JSON.stringify(xss)}, persona: 1, equip: "x", extra: 1 }).persona`) === "zen", "perfil público limpo");

  // --- formato do que o app publica x regras do Firestore ---
  const v = JSON.parse(ev("JSON.stringify(montarVitrine())"));
  const pf = ev(`(() => { const p = montarPerfil(); const { nome, usuario, codigo, persona, equip } = p; return JSON.stringify({ nome, usuario, codigo, persona, equip, atualizado: Date.now() }); })()`);
  const p = JSON.parse(pf);
  const chavesV = ["nome","usuario","persona","equip","parceiro","tipo","mimo","visto","nivel","sobre","visitas","layout","comunidades","top8","depoAceitos","status","ouvindo","subnick","humor","agua","livroAtual","estante","fotolog","mixtape","ingressos","semana"];
  const str = (x, n) => typeof x === "string" && x.length <= n;
  const num = x => typeof x === "number";
  const opt = (d, k, f) => !(k in d) || f(d[k]);
  const map = x => x && typeof x === "object" && !Array.isArray(x);
  ok(Object.keys(v).every(k => chavesV.includes(k)), "vitrine só tem campos permitidos: " + Object.keys(v).filter(k => !chavesV.includes(k)).join(","));
  ok(str(v.nome,60)&&str(v.usuario,21)&&str(v.persona,30)&&map(v.equip)&&num(v.visto)&&num(v.nivel)&&num(v.visitas)&&str(v.sobre,400)&&str(v.status,20)
     &&opt(v,"ouvindo",x=>str(x,120))&&opt(v,"subnick",x=>str(x,120))&&opt(v,"agua",num)&&Array.isArray(v.comunidades)&&Array.isArray(v.top8)&&Array.isArray(v.depoAceitos)
     &&opt(v,"fotolog",x=>Array.isArray(x)&&x.length<=9), "vitrine passa nas regras de tipo");
  ok(Object.keys(p).every(k => ["nome","usuario","codigo","persona","equip","atualizado"].includes(k)), "perfil só tem campos permitidos");
  ok(str(p.nome,60)&&str(p.usuario,21)&&str(p.codigo,12)&&str(p.persona,30)&&map(p.equip)&&num(p.atualizado), "perfil passa nas regras de tipo (codigo=" + p.codigo + ")");

  // vitrine com privacidade toda desligada também tem que passar
  ev(`S.privacidade = { estante: false, fotolog: false, humor: false, status: false };`);
  const v2 = JSON.parse(ev("JSON.stringify(montarVitrine())"));
  ok(str(v2.status,20) && Object.keys(v2).every(k => chavesV.includes(k)), "vitrine com tudo escondido também passa");

  // limpeza automática não apaga diário escrito
  ev(`S.journal["2020-01-01"] = { note: "texto antigo", closed: true }; S.journal["2020-01-02"] = { note: "", closed: true }; prune();`);
  ok(ev(`S.journal["2020-01-01"] && S.journal["2020-01-01"].note`) === "texto antigo" && !ev(`S.journal["2020-01-02"]`), "diário antigo com texto fica, dia vazio some");

  // avisos: banner no topo, escapa texto, configurações
  ev(`notificar({ titulo: "Oi <b>", texto: "Bia <img src=x> te mandou algo" })`);
  await espera(50);
  const ban = w.document.querySelector(".banner-aviso");
  ok(ban && /te mandou algo/.test(ban.textContent) && !ban.querySelector("img[src=x]"), "banner de aviso aparece e escapa o texto");
  ok(ev(`normalize({}).notif.som === true && normalize({ notif: { som: false } }).notif.som === false`), "som dos avisos ligado por padrão e respeita desligado");

  // espaço usado aparece em Ajustes
  ev(`tab = "ajustes"; commit();`);
  await espera(50);
  ok(/Espaço usado/.test(w.document.getElementById("main").textContent) && ev("tamanhoDados") > 100, "Ajustes mostra o espaço usado pelos dados");

  // atalhos do ícone e compartilhar
  ev(`history.replaceState(null, "", location.pathname + "?acao=agua"); window.__antes = waterToday(); tratarAtalho();`);
  ok(ev("waterToday() > __antes") && ev("location.search") === "", "atalho Beber água registra um copo e limpa o endereço");
  ev(`history.replaceState(null, "", location.pathname + "?titulo=Duna&link=https%3A%2F%2Fwww.amazon.com.br%2Fduna"); tratarAtalho();`);
  await espera(30);
  const cx = w.document.querySelector(".compartilhar");
  ok(cx && /Duna/.test(cx.textContent) && /Procurar livro/.test(cx.querySelector(".btn.primary").textContent), "compartilhar link de livro sugere procurar livro");
  cx && cx.querySelector('[data-c="tarefa"]').dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await espera(30);
  ok(ev(`tab === "hoje" && document.getElementById("q").value.includes("Duna")`), "virar tarefa preenche o campo de tarefa");

  // resumo da semana
  ev(`S.sessions.push({ id: "rs1", subjectId: "x", date: today(), min: 50 }); window.__rs = resumoSemanaHTML(mondayOf(today()));`);
  ok(/Estudo/.test(ev("__rs")) && /Compartilhar/.test(ev("__rs")), "resumo da semana monta o cartão");
  ev(`S.resumoVisto = mondayOf(today()); semanaDoResumo = () => null;`);
  ok(ev("resumoSemanaHTML()") === "", "resumo some depois de fechado");

  // relato de erros: desligado por padrão, nada sai sem aceite
  ok(ev("normalize({}).relatarErros") === false, "relato de erros começa desligado");
  ev(`S.relatarErros = false; guardarErro("teste", location.origin + "/js/x.js?v=1", 3); enviarRelatos();`);
  ok(ev("relatosPendentes.length") === 0, "sem aceite, erro não fica guardado para envio");
  ev(`S.relatarErros = true; relatosEnviados.clear(); guardarErro("teste2", location.origin + "/js/x.js?v=1", 3);`);
  ok(ev("relatosPendentes[0] && relatosPendentes[0].onde") === "js/x.js:3", "relato guarda só arquivo e linha, sem o endereço");
  ev("S.relatarErros = false; relatosPendentes.length = 0;");

  fechar();
  return erros;
};
