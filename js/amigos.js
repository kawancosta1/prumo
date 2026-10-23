/*
  Amigos (só com a conta Google/Firebase ligada). Como fica no Firestore:
    amizades/{uidA_uidB}  → { uids: [A, B] (em ordem), de: quem pediu, estado: "pendente" | "aceita" | "bloqueada",
                              bloqueadoPor, em }. O id junta os dois uids em ordem, então só existe um por dupla.
    perfis/{uid}          → o mínimo público (nome, @, código, mundo, roupas do Prumi): para achar a pessoa.
    vitrines/{uid}        → o que os AMIGOS veem: humor, água, status do MSN, livro atual, estante, Fotolog,
                            comunidades, Top 8, depoimentos aprovados. Respeita a privacidade (S.privacidade).
    caixa/{uid}/itens/{id}→ a caixa de avisos de cada um: recados, depoimentos, mimos, pedidos de par e visitas.
                            Só amigos escrevem nela; só o dono lê.
  As regras que garantem isso estão em firestore.rules.
*/
"use strict";

let amizades = {}; // id → dados da amizade
let amigosInfo = {}; // uid → { perfil, vitrine, em } (perfil público + vitrine)
let caixaItens = []; // itens da minha caixa de avisos, do mais novo pro mais velho
let caixaCarregada = false;
let amigoAberto = null; // uid do amigo cujo perfil está aberto
let pararAmizades = null,
  pararCaixa = null,
  vistoTimer = null;

const modoFirebase = () => !!(typeof fb !== "undefined" && fb && contaUsuario && banco);
const parId = (a, b) => (a < b ? `${a}_${b}` : `${b}_${a}`);
const outroDa = a => a.uids.find(u => u !== meuId);

/* ---------- listas ---------- */
const amizadesLista = () => Object.entries(amizades).map(([id, a]) => ({ id, ...a, uid: outroDa(a) }));
const amigosAceitos = () => amizadesLista().filter(a => a.estado === "aceita");
const pedidosRecebidos = () => amizadesLista().filter(a => a.estado === "pendente" && a.de !== meuId);
const pedidosEnviados = () => amizadesLista().filter(a => a.estado === "pendente" && a.de === meuId);
const bloqueados = () => amizadesLista().filter(a => a.estado === "bloqueada" && a.bloqueadoPor === meuId);
const ehAmigo = uid => amigosAceitos().some(a => a.uid === uid);
const nomeDe = uid => {
  const i = amigosInfo[uid] || {};
  return (i.vitrine && i.vitrine.nome) || (i.perfil && i.perfil.nome) || "Alguém";
};

/* ---------- liga tudo ao entrar (chamado em ligarBanco, js/estado.js) ---------- */
/* Se as regras do Firestore estiverem velhas, o Firebase nega o acesso: avisamos na tela de Amigos */
let avisoRegras = false;
const ehPermissao = e => !!e && (e.code === "permission-denied" || /permission/i.test(e.message || ""));
function regrasBloquearam(e) {
  if (!ehPermissao(e) || avisoRegras) return;
  avisoRegras = true;
  softRender();
}

function iniciarAmigos() {
  if (!modoFirebase()) return;
  if (typeof publicarPerfil === "function") publicarPerfil(true); // garante que os outros conseguem te achar
  if (!S.privacidade || typeof S.privacidade !== "object") S.privacidade = privacidadePadrao();
  pararAmizades = banco
    .collection("amizades")
    .where("uids", "array-contains", meuId)
    .onSnapshot(snap => {
      amizades = {};
      snap.docs.forEach(d => (amizades[d.id] = d.data()));
      // carrega o perfil de quem ainda não conhecemos (e a vitrine de quem é amigo)
      amizadesLista().forEach(a => carregarAmigo(a.uid, a.estado === "aceita"));
      softRender();
      atualizarSino();
    }, regrasBloquearam);
  pararCaixa = banco
    .collection(`caixa/${meuId}/itens`)
    .orderBy("em", "desc")
    .limit(100)
    .onSnapshot(
      snap => {
        const novos = caixaCarregada
          ? snap
              .docChanges()
              .filter(c => c.type === "added")
              .map(c => ({ id: c.doc.id, ...c.doc.data() }))
          : [];
        caixaItens = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        caixaCarregada = true;
        processarVisitas();
        novos.forEach(receberItem);
        softRender();
        atualizarSino();
      },
      () => {}
    );
  // "visto por último": republica a vitrine de tempos em tempos enquanto o app está aberto
  clearInterval(vistoTimer);
  vistoTimer = setInterval(() => {
    if (!document.hidden) publicarPerfil(true);
  }, 4 * 60e3);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) publicarPerfil(true);
  });
}

/** Busca perfil público e (se for amigo) a vitrine de alguém. Guarda por 2 minutos. */
async function carregarAmigo(uid, vitrineTambem, forcar) {
  const i = amigosInfo[uid] || (amigosInfo[uid] = {});
  if (!forcar && i.em && Date.now() - i.em < 120e3 && (!vitrineTambem || i.vitrine)) return i;
  i.em = Date.now();
  try {
    const p = await banco.doc("perfis/" + uid).get();
    i.perfil = p.exists ? limparPerfilPublico(p.data()) : null;
    if (vitrineTambem) {
      const v = await banco.doc("vitrines/" + uid).get();
      i.vitrine = v.exists ? limparVitrine(v.data()) : null;
    }
  } catch (e) {}
  softRender();
  return i;
}
const recarregarAmigos = () => amigosAceitos().forEach(a => carregarAmigo(a.uid, true, true));

/* ---------- pedidos de amizade ---------- */
/** Acha alguém pelo @ ou pelo código de 6 letras e manda o pedido. */
async function adicionarAmigo(quem) {
  quem = (quem || "").trim();
  if (!modoFirebase()) return toast("Entre com Google em Ajustes para ter amigos", false, "worried");
  if (!quem) return;
  // aceita "@nome", "nome" ou o código de 6 letras (maiúsculo ou minúsculo): tenta os dois jeitos
  const nome = quem.replace(/^@/, "").toLowerCase();
  const codigo = quem.replace(/^@/, "").toUpperCase();
  const pareceCodigo = /^[A-Z0-9]{6}$/.test(codigo) && !quem.startsWith("@");
  const porNome = () => (/^[a-z0-9_.]{3,20}$/.test(nome) ? uidDoUsuario(nome) : null);
  const porCodigo = async () => {
    if (!/^[A-Z0-9]{6}$/.test(codigo)) return null;
    const r = await banco.collection("perfis").where("codigo", "==", codigo).limit(1).get();
    return r.empty ? null : r.docs[0].id;
  };
  let uid = null;
  let erro = null;
  for (const busca of pareceCodigo ? [porCodigo, porNome] : [porNome, porCodigo]) {
    try {
      uid = await busca();
    } catch (e) {
      erro = e;
    }
    if (uid) break;
  }
  if (!uid && ehPermissao(erro)) {
    regrasBloquearam(erro);
    return toast(
      "O Firebase bloqueou a busca. Atualize as regras do Firestore (veja o aviso em Amigos).",
      false,
      "worried"
    );
  }
  if (!uid) return toast(`Não achei ${quem}. Confere o @ ou o código com a pessoa?`, false, "worried");
  if (uid === meuId) return toast("Esse é você =)", false, "happy");
  const id = parId(meuId, uid);
  const ja = amizades[id];
  if (ja) {
    if (ja.estado === "aceita") return toast("Vocês já são amigos", false, "happy");
    if (ja.estado === "pendente" && ja.de !== meuId) return aceitarAmigo(id);
    return toast(
      ja.estado === "pendente" ? "Pedido já enviado. Falta aceitar." : "Não dá pra adicionar essa pessoa.",
      false,
      "worried"
    );
  }
  try {
    await banco
      .doc("amizades/" + id)
      .set({ uids: [meuId, uid].sort(), de: meuId, estado: "pendente", em: Date.now() });
    toast(textoMundo("pedidoAmizade", "Pedido de amizade enviado!"), false, "happy");
  } catch (e) {
    if (ehPermissao(e)) {
      regrasBloquearam(e);
      return toast(
        "O Firebase bloqueou o pedido. Atualize as regras do Firestore (veja o aviso em Amigos).",
        false,
        "worried"
      );
    }
    toast("Não consegui mandar o pedido agora. Confere a internet e tenta de novo.", false, "worried");
  }
}
async function aceitarAmigo(id) {
  try {
    await banco.doc("amizades/" + id).update({ estado: "aceita", aceitoEm: Date.now() });
    fx.big = true;
    react(
      "party",
      `Agora vocês são amigos! Dá uma olhada no perfil de <b>${esc(nomeDe(outroDa(amizades[id])))}</b>.`,
      4000
    );
  } catch (e) {
    toast("Não consegui aceitar agora", false, "worried");
  }
}
async function removerAmizade(id) {
  const a = amizades[id];
  try {
    await banco.doc("amizades/" + id).delete();
    if (a && S.parceria.id === outroDa(a)) desfazerParceria(); // deixar de ser amigo também desfaz o par
    amigoAberto = null;
    toast("Pronto", false, "happy");
  } catch (e) {
    toast("Não consegui agora", false, "worried");
  }
}
async function bloquearAmigo(uid) {
  const id = parId(meuId, uid);
  try {
    if (amizades[id]) await banco.doc("amizades/" + id).update({ estado: "bloqueada", bloqueadoPor: meuId });
    else
      await banco.doc("amizades/" + id).set({
        uids: [meuId, uid].sort(),
        de: meuId,
        estado: "bloqueada",
        bloqueadoPor: meuId,
        em: Date.now()
      });
    if (S.parceria.id === uid) desfazerParceria();
    amigoAberto = null;
    toast("Bloqueado. Essa pessoa não vê mais seu perfil nem te manda nada.", false, "happy");
  } catch (e) {
    toast("Não consegui bloquear agora", false, "worried");
  }
}

/* ---------- caixa de avisos: recados, depoimentos, mimos, par, visitas ---------- */
const MIMOS_DIA = 5; // por amigo, por dia
function mimosHoje(uid) {
  try {
    const m = JSON.parse(lsGet("prumo-mimos") || "{}");
    return (m[today()] || {})[uid] || 0;
  } catch (e) {
    return 0;
  }
}
function contarMimo(uid) {
  let m = {};
  try {
    m = JSON.parse(lsGet("prumo-mimos") || "{}");
  } catch (e) {}
  const d = today();
  m = { [d]: { ...(m[d] || {}), [uid]: (m[d] && m[d][uid] ? m[d][uid] : 0) + 1 } }; // guarda só hoje
  lsSet("prumo-mimos", JSON.stringify(m));
}

/** Manda algo para a caixa de um amigo. tipo: recado, depoimento, mimo, par, visita. */
async function mandarParaCaixa(uid, tipo, texto = "", extra = {}) {
  if (!modoFirebase()) return false;
  try {
    await banco.collection(`caixa/${uid}/itens`).add({
      tipo,
      de: meuId,
      deNome: S.name || "",
      texto: String(texto).slice(0, 600),
      em: Date.now(),
      visto: false,
      ...extra
    });
    return true;
  } catch (e) {
    toast("Não consegui mandar agora", false, "worried");
    return false;
  }
}

async function mandarMimo(uid, tipo) {
  if (mimosHoje(uid) >= MIMOS_DIA)
    return toast(`Já foram ${MIMOS_DIA} mimos hoje pra essa pessoa. Amanhã tem mais!`, false, "happy");
  if (await mandarParaCaixa(uid, "mimo", "", { mimo: tipo })) {
    contarMimo(uid);
    react("happy", `Mandei pra <b>${esc(nomeDe(uid))}</b>!`, 2200);
  }
}
async function mandarRecado(uid, texto) {
  texto = (texto || "").trim();
  if (texto && (await mandarParaCaixa(uid, "recado", texto))) toast("Recado enviado!", false, "happy");
}
async function mandarDepoimento(uid, texto) {
  texto = (texto || "").trim();
  if (texto && (await mandarParaCaixa(uid, "depoimento", texto)))
    toast(`Depoimento enviado. Falta ${nomeDe(uid)} aprovar.`, false, "happy");
}
async function pedirPar(uid, tipo) {
  if (await mandarParaCaixa(uid, "par", tipo === "amizade" ? "amizade" : "namoro")) {
    S.parceria = { ...S.parceria, id: uid, tipo };
    commit();
    publicarPerfil(true);
    ouvirParceiro();
    toast("Pedido de par enviado!", false, "happy");
  }
}
function aceitarPar(item) {
  S.parceria = { ...S.parceria, id: item.de, tipo: item.texto === "amizade" ? "amizade" : "namoro" };
  marcarVisto([item]);
  commit();
  publicarPerfil(true);
  ouvirParceiro();
  fx.big = true;
  react(
    "party",
    item.texto === "amizade"
      ? "Agora a gente tem companhia! Amizade formada."
      : "Ownn, agora eu tenho um par! Que fofo.",
    4000
  );
}

/** Visitas: cada amigo que abre seu perfil deixa uma "visita" na caixa; aqui elas viram o contador. */
function processarVisitas() {
  const visitas = caixaItens.filter(i => i.tipo === "visita");
  if (!visitas.length) return;
  S.perfil.visitas = (S.perfil.visitas || 0) + visitas.length;
  persist();
  const lote = banco.batch();
  visitas.forEach(v => lote.delete(banco.doc(`caixa/${meuId}/itens/${v.id}`)));
  lote.commit().catch(() => {});
  caixaItens = caixaItens.filter(i => i.tipo !== "visita");
}
function registrarVisita(uid) {
  const k = "prumo-visitas-" + today();
  let feitas = [];
  try {
    feitas = JSON.parse(lsGet(k) || "[]");
  } catch (e) {}
  if (feitas.includes(uid)) return; // uma visita por amigo por dia
  lsSet(k, JSON.stringify([...feitas, uid]));
  mandarParaCaixa(uid, "visita");
}

/** Um item novo chegou enquanto o app estava aberto: o Prumi reage e o celular pode avisar. */
function receberItem(i) {
  if (i.tipo === "visita") return;
  const quem = esc(i.deNome || nomeDe(i.de));
  const textos = {
    recado: `<b>${quem}</b> te deixou um recado`,
    depoimento: `<b>${quem}</b> escreveu um depoimento pra você`,
    par: `<b>${quem}</b> quer ser seu par (${i.texto === "amizade" ? "amizade" : "namoro"})`,
    mimo: `<b>${quem}</b> ${MIMO_TEXTO[i.mimo] || "te mandou um mimo"}!`,
    mixtape: `<b>${quem}</b> te mandou uma mixtape`
  };
  const msg = textos[i.tipo] || `Novidade de <b>${quem}</b>`;
  if (i.tipo === "mimo") {
    const d = today();
    S.carinho[d] = (S.carinho[d] || 0) + 1;
    persist();
    if (i.mimo === "nudge") tremerTela();
    if (["abraco", "beijinho", "highfive"].includes(i.mimo)) setTimeout(bigConfetti, 200);
  }
  react(i.tipo === "mimo" && i.mimo === "agua" ? "drink" : "party", msg + ".", 4500);
  toast(msg.replace(/<[^>]+>/g, ""), false, "party");
  avisarNoCelular(msg.replace(/<[^>]+>/g, ""));
}

const itensNaoVistos = () =>
  caixaItens.filter(i => !i.visto && !(i.tipo === "depoimento" && S.perfil.depoVistos.includes(i.em)));
const totalAvisos = () => (modoFirebase() ? itensNaoVistos().length + pedidosRecebidos().length : 0);

function marcarVisto(itens) {
  const lote = banco.batch();
  let n = 0;
  itens
    .filter(i => !i.visto)
    .forEach(i => {
      lote.update(banco.doc(`caixa/${meuId}/itens/${i.id}`), { visto: true });
      i.visto = true;
      n++;
    });
  if (n) lote.commit().catch(() => {});
  atualizarSino();
}

/** Número vermelho no sininho do topo. */
function atualizarSino() {
  const sino = document.getElementById("sino"),
    amigosBt = document.getElementById("amigos-bt");
  const ligado = modoFirebase();
  if (sino) sino.hidden = !ligado;
  if (amigosBt) amigosBt.hidden = !ligado;
  const n = totalAvisos();
  const b = document.getElementById("sino-n");
  if (b) {
    b.textContent = n > 9 ? "9+" : n;
    b.hidden = !n;
  }
}

/* ---------- depoimentos e recados vindos da caixa (substituem os da parceria antiga) ---------- */
const depoimentosDaCaixa = () =>
  caixaItens.filter(i => i.tipo === "depoimento" && !S.perfil.depoVistos.includes(i.em));
const recadosDaCaixa = () => caixaItens.filter(i => i.tipo === "recado");
function decidirDepoimentoCaixa(id, aceitar) {
  const d = caixaItens.find(i => i.id === id);
  if (!d) return;
  S.perfil.depoVistos = [d.em, ...S.perfil.depoVistos].slice(0, 80);
  if (aceitar)
    S.perfil.depoAceitos = [
      { de: d.deNome || nomeDe(d.de), deUid: d.de, texto: d.texto, em: d.em },
      ...S.perfil.depoAceitos
    ].slice(0, 20);
  marcarVisto([d]);
  commit();
  publicarPerfil(true);
  toast(
    aceitar ? "Depoimento aprovado. Agora aparece no seu perfil." : "Depoimento recusado.",
    false,
    "happy"
  );
}

/* ---------- vitrine: o que os amigos veem ---------- */
const privacidadePadrao = () => ({ estante: true, fotolog: true, humor: false, status: false }); // humor e status começam escondidos

function montarVitrine() {
  const base = montarPerfil();
  const pv = { ...privacidadePadrao(), ...(S.privacidade || {}) };
  const lendo = [...livrosEm("lendo"), ...livrosEm("relendo")][0];
  const v = {
    nome: base.nome,
    usuario: base.usuario,
    persona: base.persona,
    equip: base.equip,
    parceiro: base.parceiro,
    tipo: base.tipo,
    mimo: base.mimo, // mimos do par (duo da Hoje)
    visto: Date.now(),
    nivel: levelOf(S.xp).lvl,
    sobre: S.perfil.sobre || "",
    visitas: S.perfil.visitas || 0,
    layout: S.perfil.layout || "classico",
    comunidades: COMUNIDADES.filter(c => S.ach[c.ach]).map(c => c.ach),
    top8: (S.perfil.top8 || [])
      .filter(ehAmigo)
      .slice(0, 8)
      .map(uid => {
        const v2 = (amigosInfo[uid] || {}).vitrine || {};
        return { uid, nome: v2.nome || nomeDe(uid), persona: v2.persona || "zen", equip: v2.equip || {} };
      }),
    depoAceitos: S.perfil.depoAceitos.slice(0, 20)
  };
  if (pv.status) Object.assign(v, { status: base.status, ouvindo: base.ouvindo, subnick: base.subnick });
  else v.status = "offline";
  if (pv.humor) Object.assign(v, { humor: base.humor, agua: base.agua });
  if (pv.estante) {
    v.livroAtual = lendo
      ? { titulo: lendo.titulo, autor: lendo.autor, progresso: progressoDe(lendo), capa: lendo.capa }
      : null;
    v.estante = {
      lidos: livrosEm("lido")
        .slice(0, 60)
        .map(l => ({
          id: l.id,
          titulo: l.titulo,
          autor: l.autor,
          paginas: l.paginas,
          nota: l.nota,
          capa: l.capa
        })),
      lendo: [...livrosEm("lendo"), ...livrosEm("relendo")]
        .slice(0, 4)
        .map(l => ({ id: l.id, titulo: l.titulo, paginas: l.paginas, pagina: l.pagina })),
      decor: S.leitura.decor,
      totalLidos: livrosEm("lido").length
    };
  }
  if (pv.fotolog) v.fotolog = S.fotolog.slice(0, 9);
  // Emo: a fita montada; Roqueiro: os ingressos da coleção (js/mundos/*-extras.js)
  const fita = S.emo && S.emo.mixtape;
  if (fita && fita.faixas && fita.faixas.length)
    v.mixtape = { nome: fita.nome || "", faixas: fita.faixas.slice(0, 10) };
  const ing = S.rock && S.rock.ingressos;
  if (ing && ing.length) v.ingressos = { total: ing.length, ultimos: ing.slice(0, 6) };
  return v;
}

/** Status do MSN de um amigo, levando em conta quando ele foi visto pela última vez. */
function statusDoAmigo(v) {
  if (!v || v.status === "offline") return { st: "offline", texto: "Offline" };
  const min = (Date.now() - (v.visto || 0)) / 60e3;
  if (min > 15)
    return {
      st: "offline",
      texto: `Visto ${min < 90 ? `há ${Math.round(min)} min` : min < 1440 ? `há ${Math.round(min / 60)} h` : `em ${fmtShort(ymd(new Date(v.visto)))}`}`
    };
  if (min > 5 && v.status === "online") return { st: "ausente", texto: "Ausente" };
  return { st: v.status, texto: STATUS_MSN[v.status] ? STATUS_MSN[v.status].nome : "Online" };
}

/* ---------- convite por link ---------- */
const linkConvite = () =>
  `${location.origin}${location.pathname}#add=${S.perfil.usuario ? "@" + S.perfil.usuario : S.codigo}`;
let conviteRecebido = null; // vindo do link (#add=...)
try {
  const m = /^#add=(.+)$/.exec(location.hash);
  if (m) {
    conviteRecebido = decodeURIComponent(m[1]);
    history.replaceState(null, "", location.pathname + "#amigos");
  }
} catch (e) {}

/** QR code do link de convite (biblioteca carregada só quando precisa). */
let qrPronto = null;
async function qrConvite() {
  if (!qrPronto) {
    qrPronto = new Promise((ok, erro) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
      s.onload = ok;
      s.onerror = erro;
      document.head.appendChild(s);
    });
  }
  try {
    await qrPronto;
    const q = qrcode(0, "M");
    q.addData(linkConvite());
    q.make();
    return q.createSvgTag({ cellSize: 5, margin: 2, scalable: true });
  } catch (e) {
    qrPronto = null;
    return "";
  }
}

/* ---------- apagar conta ---------- */
async function apagarConta() {
  if (!modoFirebase()) return;
  const uid = meuId;
  try {
    // amizades, caixa, vitrine, perfil, @ e a rotina
    const ams = await banco.collection("amizades").where("uids", "array-contains", uid).get();
    for (const d of ams.docs)
      await banco
        .doc("amizades/" + d.id)
        .delete()
        .catch(() => {});
    const cx = await banco.collection(`caixa/${uid}/itens`).get();
    for (const d of cx.docs)
      await banco
        .doc(`caixa/${uid}/itens/${d.id}`)
        .delete()
        .catch(() => {});
    if (S.perfil.usuario)
      await banco
        .doc("nomes/" + S.perfil.usuario)
        .delete()
        .catch(() => {});
    for (const p of ["vitrines/" + uid, "perfis/" + uid, `usuarios/${uid}/dados/rotina`])
      await banco
        .doc(p)
        .delete()
        .catch(() => {});
    try {
      await fb.auth.currentUser.delete();
    } catch (e) {
      // o Google pede um login recente para apagar: entra de novo e tenta outra vez
      if (e && e.code === "auth/requires-recent-login") {
        await fb.auth.currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider());
        await fb.auth.currentUser.delete();
      } else throw e;
    }
    S.perfil.usuario = "";
    S.parceria = { ...S.parceria, id: null };
    persist();
    alert("Conta apagada. Seus dados continuam só neste aparelho.");
    location.reload();
  } catch (e) {
    toast("Não consegui apagar tudo agora. Tenta de novo daqui a pouco.", false, "worried");
  }
}

/* ---------- limpeza do que vem de outra pessoa ----------
   Tudo que chega da vitrine de um amigo passa por aqui antes de ir pra tela:
   só humores, roupas, mundos e temas que existem no app. Textos ainda passam por esc() ao desenhar. */
const HUMORES_OK = ["idle", "happy", "party", "drink", "sleepy", "worried", "focus", "upset", "sad", "cry"];
const humorOk = m => (HUMORES_OK.includes(m) ? m : "happy");
const mundoOk = p => (PERSONAS[p] ? p : "zen");
function equipOk(e) {
  const o = {};
  if (e && typeof e === "object")
    for (const [k, v] of Object.entries(e)) if (ITEM[v] && ITEM[v].slot === k) o[k] = v;
  return o;
}
const texto = (s, max = 200) => (typeof s === "string" ? s.slice(0, max) : "");
const numero = (n, max = 1e15) => Math.max(0, Math.min(max, +n || 0));

/* Perfil público (perfis/{uid}): qualquer pessoa logada lê, então também vem limpo */
function limparPerfilPublico(p) {
  if (!p || typeof p !== "object") return null;
  return {
    nome: texto(p.nome, 30),
    usuario: texto(p.usuario, 21),
    codigo: texto(p.codigo, 12),
    persona: mundoOk(p.persona),
    equip: equipOk(p.equip),
    parceiro: texto(p.parceiro, 128) || null,
    tipo: p.tipo === "amizade" ? "amizade" : "namoro"
  };
}

function limparVitrine(v) {
  if (!v || typeof v !== "object") return null;
  const livroOk = l => ({
    id: texto(l && l.id, 40) || "x",
    titulo: texto(l && l.titulo, 160),
    autor: texto(l && l.autor, 120),
    paginas: numero(l && l.paginas, 5000),
    pagina: numero(l && l.pagina, 5000),
    nota: numero(l && l.nota, 5),
    capa: /^https:\/\//.test((l && l.capa) || "") ? texto(l.capa, 500) : ""
  });
  const est = v.estante && typeof v.estante === "object" ? v.estante : null;
  const dec = est && est.decor && typeof est.decor === "object" ? est.decor : {};
  return {
    nome: texto(v.nome, 30),
    usuario: texto(v.usuario, 21),
    persona: mundoOk(v.persona),
    equip: equipOk(v.equip),
    parceiro: texto(v.parceiro, 128) || null,
    tipo: v.tipo === "amizade" ? "amizade" : "namoro",
    mimo:
      v.mimo && typeof v.mimo === "object"
        ? { para: texto(v.mimo.para, 128), tipo: texto(v.mimo.tipo, 20), em: numero(v.mimo.em) }
        : null,
    visto: numero(v.visto),
    nivel: numero(v.nivel, 999),
    sobre: texto(v.sobre, 400),
    visitas: numero(v.visitas),
    layout: LAYOUTS_PERFIL.some(([k]) => k === v.layout) ? v.layout : "classico",
    status: STATUS_MSN[v.status] ? v.status : "offline",
    ouvindo: texto(v.ouvindo, 60),
    subnick: texto(v.subnick, 60),
    humor:
      v.humor && typeof v.humor === "object"
        ? {
            valor: numero(v.humor.valor, 100),
            nivel: texto(v.humor.nivel, 30),
            rosto: humorOk(v.humor.rosto)
          }
        : null,
    agua: numero(v.agua, 100),
    comunidades: Array.isArray(v.comunidades)
      ? v.comunidades.filter(a => COMUNIDADES.some(c => c.ach === a))
      : [],
    top8: Array.isArray(v.top8)
      ? v.top8.slice(0, 8).map(t => ({
          uid: texto(t && t.uid, 128),
          nome: texto(t && t.nome, 30),
          persona: mundoOk(t && t.persona),
          equip: equipOk(t && t.equip)
        }))
      : [],
    depoAceitos: Array.isArray(v.depoAceitos)
      ? v.depoAceitos
          .slice(0, 20)
          .map(d => ({ de: texto(d && d.de, 30), texto: texto(d && d.texto, 600), em: numero(d && d.em) }))
      : [],
    livroAtual: v.livroAtual
      ? { ...livroOk(v.livroAtual), progresso: numero(v.livroAtual.progresso, 100) }
      : null,
    estante: est
      ? {
          lidos: Array.isArray(est.lidos) ? est.lidos.slice(0, 60).map(livroOk) : [],
          lendo: Array.isArray(est.lendo) ? est.lendo.slice(0, 4).map(livroOk) : [],
          totalLidos: numero(est.totalLidos, 1e5),
          decor: {
            movel: texto(dec.movel, 30),
            fundo: texto(dec.fundo, 30),
            enfeites: Array.isArray(dec.enfeites) ? dec.enfeites.filter(e => ENFEITE[e]).slice(0, 30) : [],
            quarto: Object.fromEntries(
              Object.keys(LUGARES_QUARTO).map(slot => {
                const id = dec.quarto && dec.quarto[slot];
                return [
                  slot,
                  id === "" || (ITEM_QUARTO[id] && ITEM_QUARTO[id].slot === slot) ? id : QUARTO_PADRAO[slot]
                ];
              })
            )
          }
        }
      : null,
    mixtape:
      v.mixtape && typeof v.mixtape === "object" && Array.isArray(v.mixtape.faixas)
        ? {
            nome: texto(v.mixtape.nome, 40),
            faixas: v.mixtape.faixas
              .slice(0, 10)
              .map(f => texto(f, 60))
              .filter(Boolean)
          }
        : null,
    ingressos:
      v.ingressos && typeof v.ingressos === "object" && Array.isArray(v.ingressos.ultimos)
        ? {
            total: numero(v.ingressos.total, 999),
            ultimos: v.ingressos.ultimos.slice(0, 6).map(i => ({
              semana: /^\d{4}-\d\d-\d\d$/.test(i && i.semana) ? i.semana : today(),
              shows: numero(i && i.shows, 7),
              estrelas: numero(i && i.estrelas, 5),
              palco: texto(i && i.palco, 40),
              cor: /^#[0-9a-f]{6}$/i.test(i && i.cor) ? i.cor : "#E0312F"
            }))
          }
        : null,
    fotolog: Array.isArray(v.fotolog)
      ? v.fotolog.slice(0, 9).map(f => ({
          id: texto(f && f.id, 40),
          d: /^\d{4}-\d\d-\d\d$/.test(f && f.d) ? f.d : today(),
          p: mundoOk(f && f.p),
          eq: equipOk(f && f.eq),
          mood: humorOk(f && f.mood),
          agua: numero(f && f.agua, 1),
          legenda: texto(f && f.legenda, 120)
        }))
      : []
  };
}
