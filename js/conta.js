/*
  Conta do Prumo com Firebase: login com Google, nome de usuário (@) e o banco Firestore.
  Só liga quando FIREBASE_CONFIG (js/firebase-config.js) estiver preenchido.
  A sincronização em si é a mesma da versão Artifact: connect() e ligarBanco() em js/estado.js.

  Onde cada coisa fica no Firestore:
    usuarios/{uid}/dados/rotina  → o objeto S inteiro (só você lê e escreve)
    perfis/{uid}                 → perfil público (parceria, status do MSN, @, livro atual)
    nomes/{usuario}              → { uid }: garante que cada @ tem um dono só
  As regras de segurança estão em firestore.rules, na raiz do repositório.
*/
"use strict";

const FIREBASE_VERSAO = "10.14.1";
let fb = null; // { auth, db } depois que o Firebase carrega
let contaUsuario = null; // usuário logado (nome, e-mail, foto, uid)

const contaConfigurada = () =>
  !!(typeof FIREBASE_CONFIG !== "undefined" && FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey);

/** Carrega um script do Firebase (versão "compat", que funciona sem build). */
const carregarScript = src =>
  new Promise((ok, erro) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = ok;
    s.onerror = erro;
    document.head.appendChild(s);
  });

async function carregarFirebase() {
  if (fb) return fb;
  const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSAO}/`;
  await carregarScript(base + "firebase-app-compat.js");
  await Promise.all([
    carregarScript(base + "firebase-auth-compat.js"),
    carregarScript(base + "firebase-firestore-compat.js")
  ]);
  firebase.initializeApp(FIREBASE_CONFIG);
  // App Check: só liga se a chave do reCAPTCHA v3 estiver em js/firebase-config.js
  if (typeof FIREBASE_APPCHECK_CHAVE !== "undefined" && FIREBASE_APPCHECK_CHAVE) {
    try {
      await carregarScript(base + "firebase-app-check-compat.js");
      firebase.appCheck().activate(new firebase.appCheck.ReCaptchaV3Provider(FIREBASE_APPCHECK_CHAVE), true);
    } catch (e) {}
  }
  const db = firebase.firestore();
  try {
    // guarda uma cópia no aparelho: abre rápido e funciona sem internet
    db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
  } catch (e) {}
  fb = { auth: firebase.auth(), db };
  return fb;
}

/** Espera o Firebase dizer se tem alguém logado. Devolve { db, uid } ou null. */
async function iniciarConta() {
  try {
    const { auth, db } = await carregarFirebase();
    // volta de um login por redirecionamento (celular)
    await auth.getRedirectResult().catch(() => {});
    const user = await new Promise(ok => {
      const parar = auth.onAuthStateChanged(u => {
        parar();
        ok(u);
      });
    });
    contaUsuario = user;
    if (user && user.displayName && (!S.name || S.name === "Kawan")) {
      S.name = user.displayName.split(" ")[0].slice(0, 30); // o Prumi chama a pessoa pelo primeiro nome
      persist();
    }
    softRender();
    return user ? { db, uid: user.uid } : null;
  } catch (e) {
    toast("Não consegui falar com a conta agora. Seguindo só neste aparelho.", false, "worried");
    return null;
  }
}

async function entrarComGoogle() {
  if (!contaConfigurada()) return;
  const { auth } = await carregarFirebase();
  const provedor = new firebase.auth.GoogleAuthProvider();
  provedor.setCustomParameters({ prompt: "select_account" });
  try {
    await auth.signInWithPopup(provedor);
    location.reload(); // recarrega já ligado na conta (sobe os dados deste aparelho se a conta estiver vazia)
  } catch (e) {
    // celular costuma bloquear a janelinha: tenta pelo redirecionamento
    if (e && /popup-blocked|operation-not-supported/.test(e.code || ""))
      return auth.signInWithRedirect(provedor);
    if (e && e.code !== "auth/popup-closed-by-user")
      toast("Não deu pra entrar agora. Tenta de novo?", false, "worried");
  }
}

async function sairDaConta() {
  if (!fb) return;
  await fb.auth.signOut();
  location.reload(); // os dados continuam neste aparelho
}

/* ---------- nome de usuário (@) ---------- */
const usuarioValido = u => /^[a-z0-9_.]{3,20}$/.test(u);

async function escolherUsuario(u) {
  u = u.trim().toLowerCase().replace(/^@/, "");
  if (!usuarioValido(u))
    return toast("Use de 3 a 20 letras minúsculas, números, ponto ou _", false, "worried");
  if (!fb || !contaUsuario) return toast("Entre com Google primeiro", false, "worried");
  if (u === S.perfil.usuario) return;
  const uid = contaUsuario.uid;
  const novo = fb.db.doc("nomes/" + u);
  try {
    await fb.db.runTransaction(async t => {
      const d = await t.get(novo);
      if (d.exists && d.data().uid !== uid) throw new Error("ocupado");
      if (!d.exists) t.set(novo, { uid }); // só cria: as regras não deixam mudar o dono de um @
    });
    if (S.perfil.usuario)
      fb.db
        .doc("nomes/" + S.perfil.usuario)
        .delete()
        .catch(() => {}); // libera o @ antigo
    S.perfil.usuario = u;
    commit();
    publicarPerfil(true);
    toast(`Agora você é @${u}`, false, "party");
  } catch (e) {
    toast(
      e.message === "ocupado" ? `@${u} já tem dono. Tenta outro.` : "Não consegui salvar o @ agora.",
      false,
      "worried"
    );
  }
}

/** Acha o uid de alguém pelo @ (usado para conectar a parceria). */
async function uidDoUsuario(u) {
  if (!fb) return null;
  const d = await fb.db.doc("nomes/" + u.toLowerCase().replace(/^@/, "")).get();
  return d.exists ? d.data().uid : null;
}

/* ---------- bloco "Conta" em Ajustes ---------- */
function contaHTML() {
  if (!contaConfigurada())
    return `<div class="setrow"><div class="lbl"><b>Conta</b><span class="note">A conta com Google ainda não foi ligada. Por enquanto tudo fica salvo neste aparelho.</span></div></div>`;
  if (!contaUsuario)
    return `<div class="setrow"><div class="lbl"><b>Conta</b><span class="note">Entre para guardar tudo na nuvem, usar no celular e no PC e ter amigos no Prumo.</span></div><button class="btn primary" data-act="conta-entrar">Entrar com Google</button></div>`;
  return `<div class="setrow"><div class="lbl"><b>${esc(contaUsuario.displayName || "Conta Google")}</b><span class="note">${esc(contaUsuario.email || "")} · sincronizado</span></div><button class="btn small ghost" data-act="conta-sair">Sair</button></div>
    <div class="setrow"><div class="lbl"><b>Avisos no celular</b><span class="note">Notifica quando um amigo manda algo e o Prumo está em segundo plano.</span></div><button class="btn small ${S.avisosCelular ? "" : "ghost"}" data-act="avisos-celular">${S.avisosCelular ? "Ligados" : "Desligados"}</button></div>
    ${typeof jaInstalado === "function" && !jaInstalado() ? `<div class="setrow"><div class="lbl"><b>Instalar o Prumo</b><span class="note">Ícone na tela inicial, abre em tela cheia e funciona sem internet.</span></div><button class="btn small" data-act="instalar">Instalar</button></div>` : ""}
    <div class="setrow"><div class="lbl"><b>Seus dados</b><span class="note">Baixe tudo num arquivo ou apague a conta. Apagar tira você da nuvem e dos amigos; neste aparelho os dados continuam.</span></div><div class="row" style="gap:6px"><button class="btn small" data-act="export">Baixar meus dados</button><button class="btn small ghost danger" data-act="conta-apagar">Apagar conta</button></div></div>
    <div class="setrow"><div class="lbl"><b>Nome de usuário</b><span class="note">Seus amigos te acham por ele.</span></div><form class="row" data-form="conta-usuario" style="gap:6px"><input id="conta-usuario" type="text" maxlength="21" value="${S.perfil.usuario ? "@" + esc(S.perfil.usuario) : ""}" placeholder="@seunome" style="width:140px" autocomplete="off" autocapitalize="off"><button class="btn small" type="submit">Salvar</button></form></div>`;
}

ACOES_EXTRAS["conta-entrar"] = () => entrarComGoogle();
ACOES_EXTRAS["conta-sair"] = () => sairDaConta();
ACOES_EXTRAS["conta-apagar"] = b => {
  if (!b.dataset.certeza) {
    b.dataset.certeza = "1";
    b.textContent = "Toque de novo para apagar de vez";
    return;
  }
  apagarConta();
};
FORMS_EXTRAS["conta-usuario"] = () => {
  escolherUsuario(getV("conta-usuario"));
};
