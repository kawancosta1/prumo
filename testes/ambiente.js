/*
  Abre o Prumo num navegador falso (jsdom), servindo os arquivos do repositório.
  Bloqueia tudo que é de fora (Google Fonts, Firebase, APIs de livros) para o teste não depender da internet.
*/
const { JSDOM, VirtualConsole, ResourceLoader } = require("jsdom");

const espera = ms => new Promise(r => setTimeout(r, ms));

async function abrir(url) {
  const erros = [];
  const vc = new VirtualConsole();
  vc.on("error", (...a) => erros.push("console.error: " + a.map(String).join(" ").slice(0, 300)));
  vc.on("jsdomError", e => {
    const m = String(e.message || e);
    if (/Could not load (link|script|img)|Could not parse CSS|Not implemented/.test(m)) return; // fontes, CDN, canvas
    erros.push("jsdomError: " + m.slice(0, 300) + (e.detail ? " :: " + String(e.detail.stack || e.detail).slice(0, 400) : ""));
  });
  class SoLocal extends ResourceLoader {
    fetch(u, o) {
      if (!u.startsWith(url)) return Promise.reject(new Error("bloqueado " + u));
      return super.fetch(u, o);
    }
  }
  const dom = await JSDOM.fromURL(url, {
    runScripts: "dangerously",
    resources: new SoLocal(),
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      w.matchMedia = q => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      w.HTMLCanvasElement.prototype.getContext = () => null;
      w.Element.prototype.animate = () => ({ finished: Promise.resolve(), cancel() {} });
      w.scrollTo = () => {};
    }
  });
  const w = dom.window;
  w.addEventListener("error", e => erros.push("window error: " + e.message));
  const ev = s => w.eval(s);
  for (let i = 0; i < 100 && !(ev("typeof checkAch") === "function" && ev("typeof appReady") !== "undefined" && w.document.readyState === "complete"); i++)
    await espera(200);
  if (ev("typeof checkAch") !== "function") throw new Error("o app não terminou de carregar (algum script travou ou deu erro)");
  await espera(1500);
  const ok = (cond, msg) => {
    if (!cond) erros.push("FALHOU: " + msg);
    else console.log("  ok  " + msg);
  };
  return { w, ev, erros, ok, espera, fechar: () => w.close() };
}

module.exports = { abrir, espera };
