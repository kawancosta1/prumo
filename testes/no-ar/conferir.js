// Confere o site publicado de verdade, num Chromium, logo depois da publicação.
// Pega o que só aparece no ar: proteção (CSP) bloqueando algo, arquivo faltando, cache velho, erro no console.
// Uso: node conferir.js [endereço]   (na Action: depois do passo de publicar)
const { chromium } = require("playwright");

const SITE = (process.argv[2] || "https://prumo-66d76.web.app/").replace(/\/?$/, "/");
let CARIMBO = (process.env.GITHUB_SHA || "").slice(0, 10);
const { execSync } = require("child_process");
/** Quem está no ar é um commit mais novo que este? (outro envio publicou logo depois) */
function maisNovoNoAr(noAr) {
  try {
    execSync(`git merge-base --is-ancestor ${process.env.GITHUB_SHA} $(git rev-parse ${noAr})`, { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}
const problemas = [];
const ok = (cond, msg) => {
  if (cond) console.log("  ok  " + msg);
  else {
    console.log("  FALHOU  " + msg);
    problemas.push(msg);
  }
};
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] } : {});
  const ctx = await navegador.newContext({ viewport: { width: 400, height: 860 } });
  const pagina = await ctx.newPage();
  const erros = [];
  pagina.on("pageerror", e => erros.push("erro: " + e.message));
  pagina.on("console", m => {
    const t = m.text();
    if (/^CSP /.test(t)) erros.push(t);
    else if (m.type() === "error" && !/favicon|ERR_INTERNET|net::ERR_ABORTED/.test(t)) erros.push("console: " + t.slice(0, 200));
  });
  pagina.on("response", r => {
    if (r.url().startsWith(SITE) && r.status() >= 400) erros.push(`${r.status()} em ${r.url()}`);
  });
  await ctx.addInitScript(() =>
    document.addEventListener("securitypolicyviolation", e =>
      console.log(`CSP bloqueou ${e.blockedURI || "inline"} (${e.violatedDirective}) em ${e.sourceFile}:${e.lineNumber}`)
    )
  );

  // 1. A versão nova já está no ar? (o CDN pode levar alguns segundos)
  let html = "";
  for (let i = 0; i < 12; i++) {
    html = await (await fetch(SITE + "?conferir=" + Date.now(), { cache: "no-store" })).text();
    if (!CARIMBO || html.includes("?v=" + CARIMBO)) break;
    await espera(5000);
  }
  if (CARIMBO && !html.includes("?v=" + CARIMBO)) {
    const noAr = (/\?v=([0-9a-f]{10})"/.exec(html) || [])[1];
    if (noAr && maisNovoNoAr(noAr)) {
      console.log(`  (no ar já está ${noAr}, mais novo que ${CARIMBO}: confiro esse)`);
      CARIMBO = noAr;
    }
  }
  ok(!CARIMBO || html.includes("?v=" + CARIMBO), `index.html da publicação ${CARIMBO || "(local)"} no ar`);

  // 2. Abre o app como quem usa sem conta e passa por todas as abas
  await pagina.goto(SITE, { waitUntil: "load" });
  await pagina.waitForFunction(() => typeof checkAch === "function" && typeof render === "function", null, { timeout: 30000 });
  await pagina.evaluate(() => {
    S.onboarded = true;
    S.semConta = true;
    S.consentimento = { versao: POLITICA_VERSAO, em: Date.now() };
    commit();
  });
  await espera(800);
  const abas = await pagina.$$eval("#tabs button[data-tab]", bs => bs.map(b => b.dataset.tab));
  ok(abas.length >= 6, `barra de abas com ${abas.length} abas`);
  for (const aba of abas) {
    await pagina.click(`#tabs button[data-tab="${aba}"]`);
    await espera(400);
    const tam = await pagina.$eval("#main", m => m.innerHTML.length);
    ok(tam > 200, `aba ${aba} abre`);
  }
  for (const aba of ["ajustes", "prumi"]) {
    await pagina.evaluate(a => ((tab = a), render()), aba);
    await espera(300);
    ok((await pagina.$eval("#main", m => m.innerHTML.length)) > 200, `tela ${aba} abre`);
  }

  // 3. Firebase carrega com a proteção ligada (scripts do gstatic e conexão com o Google)
  const fb = await pagina.evaluate(async () => {
    try {
      await carregarFirebase();
      return typeof firebase !== "undefined" && firebase.apps.length > 0;
    } catch (e) {
      return String((e && (e.message || (e.target && e.target.src) || e.type)) || e);
    }
  });
  ok(fb === true, "Firebase carrega" + (fb === true ? "" : ` (${fb})`));

  // 4. Service worker guarda o app (abre rápido e sem internet)
  const sw = await pagina.evaluate(async () => {
    const r = await Promise.race([navigator.serviceWorker.ready, new Promise(ok => setTimeout(() => ok(null), 15000))]);
    if (!r) return { ativo: false };
    await new Promise(ok => setTimeout(ok, 3000));
    const nomes = await caches.keys();
    let n = 0;
    for (const nome of nomes) n += (await (await caches.open(nome)).keys()).length;
    return { ativo: true, nomes, n };
  });
  ok(sw.ativo, "service worker ativo");
  ok(!CARIMBO || (sw.nomes || []).some(n => n.endsWith(CARIMBO)), `cache da versão ${CARIMBO || ""}`);
  ok((sw.n || 0) > 50, `app guardado no aparelho (${sw.n || 0} arquivos)`);

  // 5. Outras páginas e a ponte de mudança
  const priv = await fetch(SITE + "privacidade.html");
  ok(priv.ok, "página de privacidade");
  const mud = await fetch(SITE + "mudanca.json", { headers: { Origin: "https://kawancosta1.github.io" } });
  ok(mud.ok && mud.headers.get("access-control-allow-origin") === "https://kawancosta1.github.io", "mudanca.json liberado para o endereço antigo");
  const cab = (await fetch(SITE)).headers;
  ok(/default-src 'self'/.test(cab.get("content-security-policy") || ""), "cabeçalho de proteção (CSP) no ar");

  ok(!erros.length, "sem erros no console" + (erros.length ? ": " + erros.slice(0, 6).join(" | ") : ""));
  await navegador.close();
  if (problemas.length) {
    console.log("::error title=Site no ar::" + problemas.join("%0A").replace(/\n/g, " "));
    process.exit(1);
  }
  console.log("\nSite no ar conferido.");
})().catch(e => {
  console.log("::error title=Site no ar::" + String((e && e.stack) || e).replace(/\n/g, "%0A"));
  process.exit(1);
});
