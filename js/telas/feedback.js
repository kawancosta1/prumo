/*
  Aba Feedback: a pessoa escreve uma ideia, um problema ou um elogio e chega no email do Prumo
  com o assunto "FEEDBACK". O site não tem servidor, então o envio passa pelo FormSubmit (formsubmit.co).
  Na primeira mensagem o FormSubmit manda um email de ativação para FEEDBACK_EMAIL: é preciso clicar em "Activate Form".
  Sem internet ou se o FormSubmit falhar, oferece abrir o app de email com tudo preenchido (mailto).
*/
"use strict";

const FEEDBACK_EMAIL = "prumi.prumo@gmail.com";
const FEEDBACK_ASSUNTO = "FEEDBACK";
const FEEDBACK_TIPOS = [
  ["ideia", "Ideia"],
  ["problema", "Problema"],
  ["elogio", "Elogio"],
  ["outro", "Outro"]
];

const FEEDBACK_ESPERA = 12e3; // se o FormSubmit não responder nesse tempo, a mensagem quase sempre já foi

let feedback = {
  tipo: "ideia",
  texto: "",
  email: "",
  tecnico: false,
  enviando: false,
  enviado: false,
  erro: false,
  ultimo: 0
};

/** Informações técnicas, só enviadas se a pessoa marcar a caixinha */
const feedbackTecnico = () =>
  `Navegador: ${navigator.userAgent} | Tela: ${window.innerWidth}x${window.innerHeight} | Mundo: ${S.persona} | Conta: ${typeof contaUsuario !== "undefined" && contaUsuario ? "sim" : "não"}`;

const feedbackTipoNome = () => (FEEDBACK_TIPOS.find(([k]) => k === feedback.tipo) || FEEDBACK_TIPOS[0])[1];

/** Link de email já preenchido (plano B) */
function feedbackMailto() {
  const texto = feedback.texto || feedback.ultimaMsg || "";
  const corpo = `${feedbackTipoNome()}\n\n${texto}${feedback.email ? `\n\nResponder para: ${feedback.email}` : ""}${feedback.tecnico ? `\n\n${feedbackTecnico()}` : ""}`;
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(FEEDBACK_ASSUNTO)}&body=${encodeURIComponent(corpo)}`;
}

function viewFeedback() {
  if (feedback.enviado)
    return `<section class="block feedback">
      <div class="fb-hero">${prumi({ mood: "party", size: 110, fill: Math.min(1, waterToday() / S.waterGoal) })}</div>
      <h1 class="h1">Valeu!</h1>
      <p class="note">${feedback.incerto ? `Mandei, mas a confirmação demorou. Ela quase sempre chega. Se quiser garantir, <a href="${esc(feedbackMailto())}">mande também pelo app de email</a>.` : `Sua mensagem chegou. Ela ajuda muito a deixar o Prumo melhor.${feedback.email ? " Se precisar, a gente responde no seu email." : ""}`}</p>
      <div class="row"><button class="btn primary" data-act="fb-novo">Mandar outra</button><button class="btn ghost" data-tab="hoje">Voltar para Hoje</button></div>
    </section>`;
  const tipos = FEEDBACK_TIPOS.map(
    ([k, l]) =>
      `<button type="button" data-act="fb-tipo" data-id="${k}" aria-pressed="${feedback.tipo === k}">${l}</button>`
  ).join("");
  return `<section class="block feedback">
    <div class="fb-hero">${prumi({ mood: "happy", size: 96, fill: Math.min(1, waterToday() / S.waterGoal) })}</div>
    <h1 class="h1">Feedback<small>Conta pra gente o que achou</small></h1>
    <form class="col" data-form="feedback">
      <div class="seg fb-tipos" role="group" aria-label="Tipo">${tipos}</div>
      <label class="col"><span class="label">Mensagem</span>
        <textarea id="fb-texto" data-change="fb" maxlength="2000" rows="6" required placeholder="O que deu errado, o que você queria ter ou o que mais curtiu?">${esc(feedback.texto)}</textarea></label>
      <label class="col"><span class="label">Seu email (opcional, para a gente responder)</span>
        <input id="fb-email" data-change="fb" type="email" maxlength="120" autocomplete="email" value="${esc(feedback.email)}"></label>
      <input id="fb-mel" class="fb-mel" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="fb-check"><input id="fb-tecnico" data-change="fb" type="checkbox" ${feedback.tecnico ? "checked" : ""}><span>Mandar junto informações do aparelho (navegador, tamanho da tela e mundo). Ajuda a achar problemas.</span></label>
      ${feedback.erro ? `<p class="oerro" role="alert">Não consegui enviar agora. <a href="${esc(feedbackMailto())}">Mandar pelo app de email</a></p>` : ""}
      <button class="btn primary big" type="submit" ${feedback.enviando ? "disabled" : ""}>${feedback.enviando ? "Enviando..." : "Enviar feedback"}</button>
      <p class="note">Vai para ${FEEDBACK_EMAIL} pelo FormSubmit, que entrega a mensagem por email. Veja a <a href="privacidade.html" target="_blank" rel="noopener">política de privacidade</a>.</p>
    </form>
  </section>`;
}

/** Guarda o que está escrito antes de qualquer redesenho */
function feedbackGuardar() {
  const t = document.getElementById("fb-texto"),
    e = document.getElementById("fb-email"),
    c = document.getElementById("fb-tecnico");
  if (t) feedback.texto = t.value.trim().slice(0, 2000);
  if (e) feedback.email = e.value.trim().slice(0, 120);
  if (c) feedback.tecnico = c.checked;
}

async function enviarFeedback() {
  feedbackGuardar();
  const mel = document.getElementById("fb-mel");
  if (mel && mel.value) return; // robô preencheu o campo escondido
  if (!feedback.texto) return toast("Escreva uma mensagem antes de enviar", false, "worried");
  if (feedback.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedback.email))
    return toast("Esse email não parece certo", false, "worried");
  if (Date.now() - feedback.ultimo < 30e3)
    return toast("Espera um pouquinho antes de mandar outra", false, "worried");
  feedback.enviando = true;
  feedback.erro = false;
  render();
  const corpo = {
    _subject: FEEDBACK_ASSUNTO,
    _template: "table",
    _captcha: "false",
    tipo: feedbackTipoNome(),
    mensagem: feedback.texto,
    enviado_em: new Date().toLocaleString("pt-BR")
  };
  if (feedback.email) {
    corpo.email = feedback.email;
    corpo._replyto = feedback.email;
  }
  if (feedback.tecnico) corpo.tecnico = feedbackTecnico();
  // Formulário comum (não JSON): o navegador manda direto, sem a consulta prévia de CORS que pode travar.
  const ctrl = typeof AbortController === "function" ? new AbortController() : null;
  const limite = setTimeout(() => ctrl && ctrl.abort(), FEEDBACK_ESPERA);
  const deuCerto = incerto => {
    feedback = {
      ...feedback,
      ultimaMsg: feedback.texto,
      texto: "",
      enviando: false,
      enviado: true,
      incerto,
      ultimo: Date.now()
    };
    fx.burst = ".fb-hero";
    toast("Feedback enviado. Valeu!", false, "party");
  };
  try {
    const r = await fetch("https://formsubmit.co/ajax/" + FEEDBACK_EMAIL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams(corpo),
      signal: ctrl ? ctrl.signal : undefined
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !(j.success === true || j.success === "true")) throw new Error(j.message || "falhou");
    deuCerto(false);
  } catch (e) {
    if (e && e.name === "AbortError")
      deuCerto(true); // demorou demais: o pedido já saiu, então tratamos como enviado
    else {
      feedback.enviando = false;
      feedback.erro = true;
    }
  }
  clearTimeout(limite);
  render();
}

FORMS_EXTRAS.feedback = () => {
  enviarFeedback();
};
ACOES_EXTRAS["fb-tipo"] = (b, id) => {
  feedbackGuardar();
  feedback.tipo = id;
  render();
};
MUDANCAS_EXTRAS.fb = () => feedbackGuardar(); // guarda o rascunho ao sair do campo
ACOES_EXTRAS["fb-novo"] = () => {
  feedback.enviado = feedback.incerto = false;
  render();
};
