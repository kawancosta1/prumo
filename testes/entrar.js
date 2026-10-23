// Tela de entrada, consentimento e conta
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  const D = w.document, onb = () => D.getElementById("onb");
  const clicar = sel => { const b = D.querySelector(sel); if (!b) return erros.push("não achei " + sel); b.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); };
  const enviar = sel => D.querySelector(sel).dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  const digitar = (id, v) => { D.getElementById(id).value = v; };
  // Firebase falso
  ev(`
    window.__log = [];
    const usuario = (email, ok) => ({ email, emailVerified: ok, uid: "u1", displayName: "",
      updateProfile: async p => { __log.push("perfil:" + p.displayName); },
      sendEmailVerification: async () => { __log.push("verif:" + email); },
      reload: async () => { __log.push("reload"); },
      getIdToken: async f => { __log.push("token:" + f); } });
    window.__auth = { currentUser: null,
      createUserWithEmailAndPassword: async (e, s) => { if (s.length < 6) throw { code: "auth/weak-password" }; __auth.currentUser = usuario(e, false); return { user: __auth.currentUser }; },
      signInWithEmailAndPassword: async (e, s) => { if (s !== "certa123") throw { code: "auth/invalid-credential" }; __auth.currentUser = usuario(e, false); return { user: __auth.currentUser }; },
      sendPasswordResetEmail: async e => { __log.push("reset:" + e); },
      signOut: async () => { __auth.currentUser = null; } };
    fb = { auth: __auth, db: {} };
    carregarFirebase = async () => fb;
    contaChecada = true; contaUsuario = null; S.semConta = false; S.onboarded = false;
    appReady = true; render();
  `);
  ok(!onb().hidden && /Entrar com Google/.test(onb().innerHTML) && /Criar conta com email/.test(onb().innerHTML) && /Continuar sem conta/.test(onb().innerHTML), "ao abrir aparece a tela de entrada");
  ok(/18 anos ou mais/.test(onb().innerHTML) && /privacidade\.html/.test(onb().innerHTML) && /dados de saúde/.test(onb().innerHTML), "entrada mostra as caixinhas de idade, política e saúde");
  ev("window.__google = 0; entrarComGoogle = () => { __google++; };");
  clicar('[data-act="ent-google"]'); await espera(30);
  ok(ev("__google") === 0 && /Marque as duas caixinhas/.test(onb().innerHTML), "Google sem marcar as caixinhas não entra");
  clicar('[data-act="ent-modo"][data-id="criar"]'); await espera(30);
  ok(!D.getElementById("ent-email"), "criar conta sem marcar as caixinhas não abre");
  const marcar = k => { const c = D.querySelector(`input[data-k="${k}"]`); c.checked = true; c.dispatchEvent(new w.Event("change", { bubbles: true })); };
  marcar("idade");
  clicar('[data-act="ent-google"]'); await espera(30);
  ok(ev("__google") === 0, "só uma caixinha marcada não basta");
  marcar("saude");
  clicar('[data-act="ent-google"]'); await espera(30);
  ok(ev("__google") === 1 && ev("S.consentimento && S.consentimento.versao") === ev("POLITICA_VERSAO"), "com as duas marcadas, entra com Google e guarda o aceite");
  ev("S.consentimento = null; entrar.erro = ''; renderOnb();");
  ok(D.querySelector('input[data-k="saude"]').checked, "caixinhas continuam marcadas ao redesenhar");
  // criar conta: senha fraca
  clicar('[data-act="ent-modo"][data-id="criar"]');
  ok(!!D.getElementById("ent-email"), "abre o formulário de criar conta");
  digitar("ent-nome", "Ana"); digitar("ent-email", "ana@x.com"); digitar("ent-senha", "123");
  enviar('form[data-form="ent-criar"]'); await espera(50);
  ok(/pelo menos 6/.test(onb().innerHTML), "senha fraca mostra erro em português");
  ok(D.getElementById("ent-email").value === "ana@x.com" && D.getElementById("ent-nome").value === "Ana", "não perde o que foi digitado");
  digitar("ent-senha", "123456"); enviar('form[data-form="ent-criar"]'); await espera(50);
  ok(/Confirme seu email/.test(onb().innerHTML) && /ana@x\.com/.test(onb().innerHTML), "depois de criar, pede a confirmação do email");
  ok(ev("__log").includes("verif:ana@x.com") && ev("__log").includes("perfil:Ana") && ev("S.name") === "Ana", "manda o email de confirmação e guarda o nome");
  // ainda não confirmou
  clicar('[data-act="ent-confirmei"]'); await espera(50);
  ok(/Ainda não vi a confirmação/.test(onb().innerHTML), "sem confirmar, avisa");
  clicar('[data-act="ent-reenviar"]'); await espera(50);
  ok(/mandei de novo/.test(onb().innerHTML), "reenviar email");
  // render de fundo não apaga a tela
  ev("render()"); ok(/mandei de novo/.test(onb().innerHTML), "redesenho do app não apaga a tela de entrada");
  // confirmou
  ev("__auth.currentUser.emailVerified = true; contaUsuario = __auth.currentUser;");
  clicar('[data-act="ent-confirmei"]'); await espera(50);
  ok(ev("__log").includes("token:true"), "confirmado: atualiza o acesso e recarrega");
  // usar outro email / entrar com senha errada
  ev("contaUsuario = __auth.currentUser = null; entrar.modo = 'email'; entrar.erro = ''; renderOnb();");
  digitar("ent-email", "bia@x.com"); digitar("ent-senha", "errada");
  enviar('form[data-form="ent-entrar"]'); await espera(50);
  ok(/Email ou senha errados/.test(onb().innerHTML), "senha errada mostra erro");
  clicar('[data-act="ent-modo"][data-id="esqueci"]');
  ok(D.getElementById("ent-email").value === "bia@x.com", "esqueci a senha já vem com o email");
  enviar('form[data-form="ent-esqueci"]'); await espera(50);
  ok(ev("__log").includes("reset:bia@x.com") && /o link chega/.test(onb().innerHTML), "manda o link de trocar a senha");
  // entrar com conta não confirmada vai para verificar
  clicar('[data-act="ent-modo"][data-id="email"]'); digitar("ent-senha", "certa123");
  enviar('form[data-form="ent-entrar"]'); await espera(50);
  ok(/Confirme seu email/.test(onb().innerHTML), "entrar sem ter confirmado pede a confirmação");
  clicar('[data-act="ent-outro"]'); await espera(50);
  ok(/Criar conta/.test(onb().innerHTML) && ev("contaUsuario") === null, "usar outro email sai da conta");
  // continuar sem conta
  clicar('[data-act="ent-modo"][data-id="inicio"]');
  clicar('[data-act="ent-semconta"]'); await espera(50);
  ok(ev("S.semConta") === true && /Oi! Eu sou o Prumi/.test(onb().innerHTML) && /onbnext/.test(onb().innerHTML), "sem conta: segue para as boas-vindas");
  ok(JSON.parse(ev("lsGet(LS_KEY)")).state.semConta === true, "escolha de ficar sem conta fica salva");
  ev("S.onboarded = true; commit();"); await espera(400);
  ok(onb().hidden, "depois das boas-vindas o painel some");
  ev("tab = 'ajustes'; render();");
  ok(/Entrar ou criar conta/.test(D.getElementById("main").innerHTML), "Ajustes tem Entrar ou criar conta");
  clicar('[data-act="conta-abrir"]'); await espera(50);
  ok(!onb().hidden && /Entrar com Google/.test(onb().innerHTML), "Ajustes abre a tela de entrada de novo");
  // conta antiga já logada, sem aceite: pede para aceitar antes de usar
  ev("S.consentimento = null; entrar.aceite = { idade: false, saude: false }; contaUsuario = { email: 'velho@x.com', emailVerified: true }; contaChecada = true; commit();"); await espera(50);
  ok(!onb().hidden && /Sua privacidade/.test(onb().innerHTML) && /Sair da conta/.test(onb().innerHTML), "conta antiga sem aceite vê a tela de privacidade");
  clicar('[data-act="ent-aceitar"]'); await espera(30);
  ok(/Marque as duas caixinhas/.test(onb().innerHTML), "aceitar sem marcar não passa");
  marcar("idade"); marcar("saude"); clicar('[data-act="ent-aceitar"]'); await espera(400);
  ok(onb().hidden && ev("S.consentimento.versao") === ev("POLITICA_VERSAO"), "aceitou: a tela some e o aceite fica salvo");
  ev("tab = 'ajustes'; render();");
  ok(/Você aceitou a política em/.test(D.getElementById("main").innerHTML) && /href="privacidade.html"/.test(D.getElementById("main").innerHTML), "Ajustes mostra o aceite e o link da política");
  ev("S.consentimento.versao = 'velha'; commit();"); await espera(50);
  ok(/Sua privacidade/.test(onb().innerHTML), "política nova pede aceite de novo");
  ev("S.consentimento.versao = POLITICA_VERSAO; contaUsuario = null; commit();"); await espera(400);
  // privacidade por padrão
  ok(ev("blank().privacidade.humor") === false && ev("blank().privacidade.status") === false && ev("privacidadePadrao().humor") === false, "humor e status começam escondidos");
  ok(ev("normalize({ privacidade: { humor: true } }).privacidade.humor") === true && ev("normalize({}).privacidade.status") === false, "quem já escolheu mostrar continua mostrando");
  // Firebase ainda não respondeu: não bloqueia
  ev("contaChecada = false; S.semConta = false; commit();"); await espera(400);
  ok(onb().hidden, "sem resposta do Firebase (offline), o app não trava na entrada");
  fechar();
  return erros;
};
