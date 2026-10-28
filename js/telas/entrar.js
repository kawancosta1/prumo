/*
  Tela de entrada: aparece ao abrir o Prumo quando a conta (Firebase) está ligada e ninguém entrou.
  - Entrar com Google
  - Criar conta com email e senha (o Firebase manda um link de confirmação para o email)
  - Entrar com email e senha, e "Esqueci a senha" (link para trocar a senha)
  - Continuar sem conta: os dados ficam só neste aparelho, como antes (S.semConta)
  Conta com email só sincroniza depois de confirmar o email (as regras do Firestore também exigem isso).
  LGPD: para ter conta a pessoa confirma que tem 18 anos ou mais, aceita a política (privacidade.html)
  e dá o consentimento para os dados de saúde (água, refeições, humor, diário). O aceite fica em S.consentimento.
  Se a política mudar, troque POLITICA_VERSAO: quem tem conta aceita de novo ao abrir o app.
*/
"use strict";

const POLITICA_VERSAO = "2026-10-23";

let entrar = {
    modo: "inicio",
    nome: "",
    email: "",
    senha: "",
    carregando: false,
    erro: "",
    aviso: "",
    aceite: { idade: false, saude: false }
  },
  entrarDesenhado = "";

const consentimentoOk = () => !!(S.consentimento && S.consentimento.versao === POLITICA_VERSAO);
const contaConfirmada = () => !!(contaUsuario && contaUsuario.emailVerified);

/** A tela aparece quando a conta está ligada, o Firebase já respondeu e a pessoa não escolheu ficar sem conta. */
const precisaEntrar = () =>
  contaConfigurada() && contaChecada && (contaConfirmada() ? !consentimentoOk() : (!S.semConta && !S.onboarded));

/** As duas caixinhas: 18 anos + política, e dados de saúde */
const aceiteHTML = () => `<div class="oaceite">
  <label><input type="checkbox" data-change="ent-aceite" data-k="idade" ${entrar.aceite.idade ? "checked" : ""}><span>Tenho 18 anos ou mais e li a <a href="privacidade.html" target="_blank" rel="noopener">política de privacidade</a>.</span></label>
  <label><input type="checkbox" data-change="ent-aceite" data-k="saude" ${entrar.aceite.saude ? "checked" : ""}><span>Autorizo guardar na minha conta os dados de saúde que eu registrar: água, refeições, humor e diário.</span></label>
</div>`;

/** Confere as caixinhas antes de criar ou entrar numa conta e guarda o aceite */
function aceitou() {
  if (!entrar.aceite.idade || !entrar.aceite.saude) {
    entrar.erro = "Marque as duas caixinhas para criar ou entrar numa conta.";
    renderOnb();
    return false;
  }
  S.consentimento = { versao: POLITICA_VERSAO, em: Date.now() };
  persist(true); // silencioso: guarda o consentimento sem invalidar a base da nuvem
  return true;
}

const ERROS_CONTA = {
  "auth/email-already-in-use": "Esse email já tem conta. Tente entrar.",
  "auth/invalid-email": "Esse email não parece certo.",
  "auth/weak-password": "A senha precisa de pelo menos 6 caracteres.",
  "auth/missing-password": "Digite a senha.",
  "auth/invalid-credential": "Email ou senha errados.",
  "auth/wrong-password": "Email ou senha errados.",
  "auth/user-not-found": "Email ou senha errados.",
  "auth/user-disabled": "Essa conta foi desativada.",
  "auth/too-many-requests": "Muitas tentativas. Espere um pouco e tente de novo.",
  "auth/network-request-failed": "Sem internet agora. Tente de novo.",
  "auth/operation-not-allowed": "Entrar com email ainda não foi ligado no Firebase."
};
const erroConta = e => ERROS_CONTA[(e && e.code) || ""] || "Não deu certo agora. Tente de novo.";

function entrarHTML() {
  const m = entrar.modo,
    c = entrar.carregando ? "disabled" : "";
  const erro = entrar.erro ? `<p class="oerro" role="alert">${esc(entrar.erro)}</p>` : "";
  const aviso = entrar.aviso ? `<p class="oaviso" role="status">${esc(entrar.aviso)}</p>` : "";
  const campoEmail = `<label class="ofield"><span class="label">Email</span><input id="ent-email" type="email" value="${esc(entrar.email)}" autocomplete="email" inputmode="email" autocapitalize="off" required></label>`;
  const hero = mood => `<div class="ohero">${prumi({ mood, size: 120, eq: {} })}</div>`;
  let c2 = "";
  if (m === "inicio")
    c2 = `${hero("happy")}<h2 class="oh">Oi! Eu sou o Prumi.</h2>
      <p class="op">Entre para guardar tudo na nuvem, usar no celular e no PC e ter amigos no Prumo.</p>
      ${aceiteHTML()}${erro}
      <button class="btn primary big" data-act="ent-google" ${c}>Entrar com Google</button>
      <div class="osep"><span>ou</span></div>
      <button class="btn big" data-act="ent-modo" data-id="criar" ${c}>Criar conta com email</button>
      <button class="btn ghost" data-act="ent-modo" data-id="email" ${c}>Já tenho conta com email</button>
      <button class="olink" data-act="ent-semconta">Continuar sem conta</button>
      <p class="note ocentro">Sem conta, tudo fica salvo só neste aparelho. Menores de 18 anos usam sem conta.</p>`;
  else if (m === "criar")
    c2 = `${hero("idle")}<h2 class="oh">Criar conta</h2>
      <form class="col" data-form="ent-criar">
        <label class="ofield"><span class="label">Como posso te chamar?</span><input id="ent-nome" type="text" value="${esc(entrar.nome)}" maxlength="30" autocomplete="given-name" required></label>
        ${campoEmail}
        <label class="ofield"><span class="label">Senha (mínimo 6 caracteres)</span><input id="ent-senha" type="password" minlength="6" autocomplete="new-password" required></label>
        ${erro}<button class="btn primary big" type="submit" ${c}>${entrar.carregando ? "Criando..." : "Criar conta"}</button>
      </form>
      <button class="olink" data-act="ent-modo" data-id="email">Já tenho conta</button>
      <button class="olink" data-act="ent-modo" data-id="inicio">Voltar</button>`;
  else if (m === "email")
    c2 = `${hero("happy")}<h2 class="oh">Entrar com email</h2>
      <form class="col" data-form="ent-entrar">
        ${campoEmail}
        <label class="ofield"><span class="label">Senha</span><input id="ent-senha" type="password" autocomplete="current-password" required></label>
        ${erro}${aviso}<button class="btn primary big" type="submit" ${c}>${entrar.carregando ? "Entrando..." : "Entrar"}</button>
      </form>
      <button class="olink" data-act="ent-modo" data-id="esqueci">Esqueci a senha</button>
      <button class="olink" data-act="ent-modo" data-id="criar">Criar conta</button>
      <button class="olink" data-act="ent-modo" data-id="inicio">Voltar</button>`;
  else if (m === "esqueci")
    c2 = `${hero("worried")}<h2 class="oh">Esqueci a senha</h2>
      <p class="op">Mando um link para o seu email. Por ele você cria uma senha nova.</p>
      <form class="col" data-form="ent-esqueci">${campoEmail}${erro}${aviso}
        <button class="btn primary big" type="submit" ${c}>${entrar.carregando ? "Mandando..." : "Mandar link"}</button>
      </form>
      <button class="olink" data-act="ent-modo" data-id="email">Voltar</button>`;
  else if (m === "aceitar")
    c2 = `${hero("idle")}<h2 class="oh">Sua privacidade</h2>
      <p class="op">Atualizamos a <a href="privacidade.html" target="_blank" rel="noopener">política de privacidade</a>. Para continuar usando a conta, confirme:</p>
      ${aceiteHTML()}${erro}
      <button class="btn primary big" data-act="ent-aceitar">Aceitar e continuar</button>
      <button class="btn ghost" data-act="ent-sair">Sair da conta</button>
      <p class="note ocentro">Saindo, seus dados continuam neste aparelho. Para apagar a conta, entre e vá em Ajustes.</p>`;
  else if (m === "verificar")
    c2 = `${hero("focus")}<h2 class="oh">Confirme seu email</h2>
      <p class="op">Mandei um link para <b>${esc((contaUsuario && contaUsuario.email) || entrar.email)}</b>. Abra o email, toque no link e volte aqui.</p>
      <p class="note ocentro">Não chegou? Olhe a caixa de spam.</p>${erro}${aviso}
      <button class="btn primary big" data-act="ent-confirmei" ${c}>${entrar.carregando ? "Conferindo..." : "Já confirmei"}</button>
      <button class="btn ghost" data-act="ent-reenviar" ${c}>Mandar o email de novo</button>
      <button class="olink" data-act="ent-outro">Usar outro email</button>`;
  return `<div class="osheet oentrar"><div class="ostep">${c2}</div></div>`;
}

/** Desenha a tela de entrada no mesmo painel das boas-vindas. Só redesenha quando algo muda (não apaga o que está sendo digitado). */
function mostrarEntrar(el, forcar) {
  if (contaUsuario && !contaUsuario.emailVerified && entrar.modo !== "verificar") entrar.modo = "verificar";
  if (contaConfirmada() && !consentimentoOk()) entrar.modo = "aceitar"; // conta antiga ou política nova
  const chave = JSON.stringify([entrar.modo, entrar.carregando, entrar.erro, entrar.aviso]);
  el.hidden = false;
  el.setAttribute("aria-label", "Entrar no Prumo");
  if (!forcar && chave === entrarDesenhado && el.querySelector(".oentrar")) return;
  entrarDesenhado = chave;
  el.innerHTML = entrarHTML();
  const primeiro = [...el.querySelectorAll("input")].find(i => !i.value);
  if (primeiro && !entrar.carregando && window.innerWidth > 700) primeiro.focus();
}

/** Guarda o que foi digitado antes de redesenhar */
const guardarCampos = () => {
  const v = id => {
    const x = document.getElementById(id);
    return x ? x.value.trim() : null;
  };
  if (v("ent-nome") !== null) entrar.nome = v("ent-nome");
  if (v("ent-email") !== null) entrar.email = v("ent-email");
  const s = document.getElementById("ent-senha");
  entrar.senha = s ? s.value : "";
};

/** Roda uma ação da conta mostrando "carregando" e o erro em português */
async function acaoConta(fn) {
  guardarCampos();
  entrar.carregando = true;
  entrar.erro = entrar.aviso = "";
  renderOnb();
  try {
    await fn(await carregarFirebase());
  } catch (e) {
    entrar.erro = erroConta(e);
  }
  entrar.carregando = false;
  entrar.senha = "";
  renderOnb();
}

const linkVolta = () => ({ url: location.origin + location.pathname });

ACOES_EXTRAS["ent-google"] = () => {
  entrar.erro = "";
  if (aceitou()) entrarComGoogle();
};
ACOES_EXTRAS["ent-modo"] = (b, id) => {
  guardarCampos();
  if ((id === "criar" || id === "email") && entrar.modo === "inicio" && !aceitou()) return;
  entrar.modo = id;
  entrar.erro = entrar.aviso = "";
  renderOnb();
};
ACOES_EXTRAS["ent-aceitar"] = () => {
  entrar.erro = "";
  if (aceitou()) commit(); // a tela some e o app segue (o aceite vai junto para a nuvem)
};
ACOES_EXTRAS["ent-sair"] = () => sairDaConta();
MUDANCAS_EXTRAS["ent-aceite"] = el => {
  entrar.aceite[el.dataset.k] = el.checked;
};
ACOES_EXTRAS["ent-semconta"] = () => {
  S.semConta = true;
  commit();
};
ACOES_EXTRAS["ent-reenviar"] = () =>
  acaoConta(async ({ auth }) => {
    await auth.currentUser.sendEmailVerification(linkVolta());
    entrar.aviso = "Pronto, mandei de novo.";
  });
ACOES_EXTRAS["ent-confirmei"] = () =>
  acaoConta(async ({ auth }) => {
    await auth.currentUser.reload();
    if (!auth.currentUser.emailVerified) {
      entrar.erro = "Ainda não vi a confirmação. Toque no link do email e tente de novo.";
      return;
    }
    await auth.currentUser.getIdToken(true); // o banco precisa saber que o email foi confirmado
    location.reload();
  });
ACOES_EXTRAS["ent-outro"] = async () => {
  if (fb) await fb.auth.signOut();
  contaUsuario = null;
  entrar = { ...entrar, modo: "criar", erro: "", aviso: "" };
  renderOnb();
};

FORMS_EXTRAS["ent-criar"] = () => {
  acaoConta(async ({ auth }) => {
    if (!entrar.nome) throw { code: "nome" };
    const cred = await auth.createUserWithEmailAndPassword(entrar.email, entrar.senha);
    await cred.user.updateProfile({ displayName: entrar.nome });
    S.name = entrar.nome.slice(0, 30);
    persist();
    await cred.user.sendEmailVerification(linkVolta());
    contaUsuario = cred.user;
    entrar.modo = "verificar";
  });
};
FORMS_EXTRAS["ent-entrar"] = () => {
  acaoConta(async ({ auth }) => {
    const cred = await auth.signInWithEmailAndPassword(entrar.email, entrar.senha);
    contaUsuario = cred.user;
    if (!cred.user.emailVerified) {
      await cred.user.sendEmailVerification(linkVolta()).catch(() => {});
      entrar.modo = "verificar";
      return;
    }
    location.reload(); // recarrega já ligado na conta
  });
};
FORMS_EXTRAS["ent-esqueci"] = () => {
  acaoConta(async ({ auth }) => {
    await auth.sendPasswordResetEmail(entrar.email, linkVolta());
    entrar.aviso = "Se esse email tiver conta, o link chega em instantes.";
  });
};
ERROS_CONTA.nome = "Diga como posso te chamar.";
