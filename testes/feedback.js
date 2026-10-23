// Aba Feedback
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);


  const D = w.document, M = () => D.getElementById("main").innerHTML;
  const clicar = sel => { const b = D.querySelector(sel); if (!b) return erros.push("não achei " + sel); b.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); };
  const enviar = () => D.querySelector('form[data-form="feedback"]').dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  ev(`S.onboarded = true; S.semConta = true; commit();
    window.__envios = []; window.__resposta = { ok: true, json: { success: "true" } };
    window.fetch = (url, o) => { __envios.push({ url, corpo: Object.fromEntries(new URLSearchParams(o.body.toString())), tipoCorpo: o.body.constructor.name, ct: (o.headers || {})["Content-Type"] });
      if (__resposta.trava) return new Promise((ok, erro) => o.signal.addEventListener("abort", () => erro(new DOMException("demorou", "AbortError"))));
      if (__resposta.erro) return Promise.reject(new TypeError("offline"));
      return Promise.resolve({ ok: __resposta.ok, json: async () => __resposta.json }); };`);
  ok(D.querySelectorAll("#tabs button").length === 7 && !!D.querySelector('#tabs button[data-tab="feedback"]'), "aba Feedback na barra de abas");
  clicar('#tabs button[data-tab="feedback"]'); await espera(50);
  ok(/Enviar feedback/.test(M()) && /prumi\.prumo@gmail\.com/.test(M()), "aba abre com o formulário");
  ok(D.querySelector('#tabs button[data-tab="feedback"]').getAttribute("aria-current") === "page", "aba fica marcada");
  // vazio
  enviar(); await espera(50);
  ok(ev("__envios.length") === 0, "mensagem vazia não envia");
  // rascunho sobrevive a troca de aba
  D.getElementById("fb-texto").value = "O <b>timer</b> trava";
  D.getElementById("fb-texto").dispatchEvent(new w.Event("change", { bubbles: true }));
  clicar('#tabs button[data-tab="hoje"]'); clicar('#tabs button[data-tab="feedback"]'); await espera(30);
  ok(D.getElementById("fb-texto").value === "O <b>timer</b> trava", "rascunho continua depois de trocar de aba");
  clicar('[data-act="fb-tipo"][data-id="problema"]');
  ok(D.querySelector('[data-act="fb-tipo"][data-id="problema"]').getAttribute("aria-pressed") === "true" && D.getElementById("fb-texto").value.includes("timer"), "escolher tipo mantém o texto");
  // robô
  D.getElementById("fb-mel").value = "spam"; enviar(); await espera(50);
  ok(ev("__envios.length") === 0, "campo escondido preenchido (robô) não envia");
  D.getElementById("fb-mel").value = "";
  // envio certo
  D.getElementById("fb-email").value = "ana@x.com";
  enviar(); await espera(80);
  const e1 = ev("__envios[0]");
  ok(e1 && e1.url === "https://formsubmit.co/ajax/prumi.prumo@gmail.com", "envia para o email do Prumo");
  ok(e1 && e1.corpo._subject === "FEEDBACK" && e1.corpo.tipo === "Problema" && e1.corpo.mensagem === "O <b>timer</b> trava", "assunto FEEDBACK, tipo e mensagem");
  ok(e1 && e1.corpo._replyto === "ana@x.com" && !("tecnico" in e1.corpo), "email de resposta vai; dados do aparelho só se marcar");
  ok(/Valeu!/.test(M()) && /Sua mensagem chegou/.test(M()), "tela de agradecimento");
  ok(e1 && e1.tipoCorpo === "URLSearchParams" && !e1.ct, "manda como formulário comum (sem JSON, sem consulta prévia)");
  // limite de 30 s
  clicar('[data-act="fb-novo"]'); D.getElementById("fb-texto").value = "outra"; enviar(); await espera(50);
  ok(ev("__envios.length") === 1 && /Mandar outra|Enviar feedback/.test(M()), "não deixa mandar várias seguidas");
  // falha: oferece email
  ev("feedback.ultimo = 0; __resposta.erro = true;");
  D.getElementById("fb-texto").value = "sem internet"; D.getElementById("fb-tecnico").checked = true; enviar(); await espera(80);
  const link = D.querySelector('.oerro a');
  ok(link && link.getAttribute("href").startsWith("mailto:prumi.prumo@gmail.com?subject=FEEDBACK") && decodeURIComponent(link.getAttribute("href")).includes("sem internet"), "sem internet: oferece mandar pelo app de email");
  ok(ev("__envios[1].corpo.tecnico") && ev("__envios[1].corpo.tecnico").includes("Mundo:"), "com a caixinha marcada, manda dados do aparelho");
  ok(D.getElementById("fb-texto").value === "sem internet", "na falha o texto não some");
  // resposta de ativação do FormSubmit conta como falha
  ev("feedback.ultimo = 0; __resposta = { ok: true, json: { success: 'false', message: 'This form needs Activation' } };");
  enviar(); await espera(80);
  ok(/Não consegui enviar/.test(M()), "formulário ainda não ativado mostra erro com plano B");
  // servidor não responde: não fica travado em "Enviando"
  ev("feedback.ultimo = 0; feedback.erro = false; __resposta = { trava: true };");
  D.getElementById("fb-texto").value = "servidor lento"; enviar(); await espera(300);
  ok(/Enviando\.\.\./.test(M()), "enquanto espera mostra Enviando");
  await espera(12500);
  ok(/Valeu!/.test(M()) && /a confirmação demorou/.test(M()) && !/Enviando\.\.\./.test(M()), "depois de 12 s sai do Enviando e avisa que quase sempre chega");
  const plano = D.querySelector('.feedback a[href^="mailto:"]');
  ok(plano && decodeURIComponent(plano.getAttribute("href")).includes("servidor lento"), "e oferece mandar pelo app de email com a mesma mensagem");
  clicar('[data-act="fb-novo"]'); await espera(30);
  ok(/Enviar feedback/.test(M()) && D.getElementById("fb-texto").value === "", "Mandar outra volta ao formulário limpo");
  D.getElementById("fb-texto").value = "<b>timer</b>";
  // XSS no texto
  ok(!/<b>timer<\/b>/.test(M()), "texto da pessoa sempre escapado");
  ev("tab = 'ajustes'; render();");
  ok(/data-tab="feedback"/.test(M()), "Ajustes tem atalho para Feedback");
  fechar();
  return erros;
};
