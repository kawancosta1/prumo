/*
  Parceria: perfil público, código de convite, dupla abraçada, poses e mimos.
*/
"use strict";

/* ================= parceria: dois Prumis juntos ================= */
/*
  Como funciona:
  - Cada pessoa publica um "perfil público" em perfis/<id> (nome, personalidade, roupas, humor, água, código).
  - Para conectar, você digita o código da outra pessoa. Seu perfil passa a apontar para ela (parceiro = id dela).
  - Quando os dois perfis apontam um para o outro, a parceria está ativa.
  - Mimos: você grava um "mimo" no seu perfil; o app do parceiro está ouvindo seu perfil e reage na hora.
  Tudo isso depende do banco do artifact (db). Sem ele, a seção explica o que falta.
*/
const TIPOS_PARCERIA = { namoro: "Namorados", amizade: "Amigos" };

const MIMOS = {
  namoro: [
    ["abraco", "Abraço"],
    ["beijinho", "Beijinho"],
    ["agua", "Bebe água!"],
    ["forca", "Força!"],
    ["nudge", "Chamar a atenção"]
  ],
  amizade: [
    ["highfive", "High-five"],
    ["abraco", "Abraço"],
    ["agua", "Bebe água!"],
    ["forca", "Força!"],
    ["nudge", "Chamar a atenção"]
  ]
};

const MIMO_TEXTO = {
  abraco: "te mandou um abraço apertado",
  beijinho: "te mandou um beijinho",
  agua: "mandou você beber água!",
  forca: "mandou força pra você hoje",
  highfive: "te mandou um high-five",
  nudge: "chamou a sua atenção!"
};

let banco = null; // namespace do db, quando disponível
let meuId = null; // id do usuário atual
let parceiroDados = null; // último perfil público do parceiro
let pedidos = []; // perfis que apontam para mim sem eu ter aceitado
let pararParceiro = null; // função para parar de ouvir o perfil do parceiro
let ultimoPerfilEnviado = ""; // evita regravar o perfil se nada mudou
let perfilTimer = null;
let mimoCooldown = 0; // espera entre um mimo e outro

function gerarCodigo() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += letras[Math.floor(Math.random() * letras.length)];
  return c;
}

/* Perfil público que o parceiro enxerga */
function montarPerfil() {
  const h = calcularHumor();
  return {
    nome: S.name || "",
    persona: S.persona,
    equip: S.equip,
    humor: { valor: h.valor, nivel: h.nivel.nome, rosto: h.nivel.rosto },
    agua: Math.round(Math.min(1, waterToday() / S.waterGoal) * 100),
    codigo: S.codigo,
    usuario: S.perfil.usuario || "",
    parceiro: S.parceria.id || null,
    tipo: S.parceria.tipo || "namoro",
    mimo: S.parceria.mimoEnviado || null,
    subnick: S.perfil.subnick || "", // frase do "MSN" que aparece pro parceiro
    recados: (S.parceria.recados || []).slice(0, 10), // recados que EU mandei (estilo Orkut)
    status: statusMsn(), // status do MSN
    ouvindo: S.perfil.status === "offline" ? "" : S.perfil.ouvindo || "",
    depoimentos: (S.parceria.depoimentos || []).slice(0, 5) // depoimentos que EU escrevi (esperam aprovação)
  };
}

function publicarPerfil(agora) {
  if (!banco || !meuId) return;
  clearTimeout(perfilTimer);
  perfilTimer = setTimeout(
    async () => {
      const perfil = montarPerfil();
      const json = JSON.stringify(perfil);
      if (json === ultimoPerfilEnviado) return;
      ultimoPerfilEnviado = json;
      try {
        await banco.doc("perfis/" + meuId).set({ ...perfil, atualizado: Date.now() });
      } catch (e) {
        ultimoPerfilEnviado = "";
      }
    },
    agora ? 0 : 1500
  );
}

/* Liga a parceria quando o banco está pronto (chamado em connect) */
function iniciarParceria(db, uid) {
  banco = db;
  meuId = uid;
  if (!S.codigo) {
    S.codigo = gerarCodigo();
    persist();
  }
  publicarPerfil(true);
  // Quem está apontando para mim?
  db.collection("perfis")
    .where("parceiro", "==", uid)
    .onSnapshot(
      snap => {
        pedidos = snap.docs
          .filter(d => d.exists && d.id !== S.parceria.id)
          .map(d => ({ id: d.id, ...d.data() }));
        softRender();
      },
      () => {}
    );
  ouvirParceiro();
}

function ouvirParceiro() {
  if (pararParceiro) {
    pararParceiro();
    pararParceiro = null;
  }
  parceiroDados = null;
  if (!banco || !S.parceria.id) return;
  pararParceiro = banco.doc("perfis/" + S.parceria.id).onSnapshot(
    snap => {
      parceiroDados = snap.exists ? snap.data() : null;
      receberMimo();
      avisarRecadoNovo();
      softRender();
    },
    () => {}
  );
}

const parceriaAtiva = () => !!(parceiroDados && S.parceria.id && parceiroDados.parceiro === meuId);

const nomeParceiro = () => (parceiroDados && parceiroDados.nome) || "Seu parceiro";

async function conectarPorCodigo(codigo, tipo) {
  codigo = codigo.trim();
  if (!banco) return toast("A parceria precisa da sua conta conectada", false, "worried");
  // pelo @ (conta Firebase): acha o uid direto em nomes/
  if (codigo.startsWith("@") && typeof uidDoUsuario === "function") {
    const uid = await uidDoUsuario(codigo).catch(() => null);
    if (!uid) return toast(`Não achei ${codigo}. Confere o nome?`, false, "worried");
    if (uid === meuId) return toast("Esse é você", false, "worried");
    S.parceria = { ...S.parceria, id: uid, tipo };
    commit();
    publicarPerfil(true);
    ouvirParceiro();
    return toast("Pedido enviado! Falta a outra pessoa aceitar.", false, "happy");
  }
  codigo = codigo.toUpperCase();
  if (codigo === S.codigo) return toast("Esse é o seu próprio código", false, "worried");
  try {
    const res = await banco.collection("perfis").where("codigo", "==", codigo).limit(1).get();
    if (res.empty) return toast("Não achei esse código. Confere com a outra pessoa?", false, "worried");
    S.parceria = { ...S.parceria, id: res.docs[0].id, tipo };
    commit();
    publicarPerfil(true);
    ouvirParceiro();
    toast("Pedido enviado! Falta a outra pessoa aceitar.", false, "happy");
  } catch (e) {
    toast("Não consegui conectar agora. Tenta de novo daqui a pouco.", false, "worried");
  }
}

function aceitarPedido(id) {
  const p = pedidos.find(x => x.id === id);
  if (!p) return;
  S.parceria = { ...S.parceria, id, tipo: p.tipo || "namoro" };
  commit();
  publicarPerfil(true);
  ouvirParceiro();
  fx.big = true;
  react(
    "party",
    p.tipo === "amizade"
      ? "Agora a gente tem companhia! Amizade formada."
      : "Ownn, agora eu tenho um par! Que fofo.",
    4000
  );
}

function desfazerParceria() {
  S.parceria = { ...S.parceria, id: null, tipo: "namoro" };
  commit();
  publicarPerfil(true);
  ouvirParceiro();
  toast("Parceria desfeita", false, "sad");
}

function enviarMimo(tipo) {
  if (!parceriaAtiva()) return;
  if (Date.now() < mimoCooldown)
    return toast("Calma, espera uns segundinhos pra mandar outro", false, "happy");
  mimoCooldown = Date.now() + 15000;
  S.parceria.mimoEnviado = { para: S.parceria.id, tipo, em: Date.now() };
  persist();
  publicarPerfil(true);
  react("happy", `Mandei pra <b>${esc(nomeParceiro())}</b>!`, 2200);
}

function receberMimo() {
  const m = parceiroDados && parceiroDados.mimo;
  if (!m || m.para !== meuId || m.em <= (S.parceria.mimoVisto || 0)) return;
  S.parceria.mimoVisto = m.em;
  const d = today();
  S.carinho[d] = (S.carinho[d] || 0) + 1;
  persist();
  const frase = `${nomeParceiro()} ${MIMO_TEXTO[m.tipo] || "te mandou um mimo"}`;
  react(
    m.tipo === "agua" ? "drink" : "party",
    `<b>${esc(nomeParceiro())}</b> ${MIMO_TEXTO[m.tipo] || "te mandou um mimo"}!`,
    4500
  );
  toast(frase, false, "party");
  if (m.tipo === "nudge") tremerTela(); // "chamar a atenção" do MSN: a tela treme
  if (m.tipo === "abraco" || m.tipo === "beijinho" || m.tipo === "highfive") setTimeout(bigConfetti, 200);
}

/* ---------- poses da dupla ---------- */
/*
  Cada pose diz onde fica cada Prumi (x, y, rotação), o rosto, os braços e um enfeite (extra).
  Os braços de abraço são desenhados por cima dos dois corpos, em coordenadas da cena (240 x 175).
*/
const HEART = (x, y, s = 1, c = "#E8337A") =>
  `<path d="M${x} ${y + 7 * s}l${-7 * s} ${-6.6 * s}a${4 * s} ${4 * s} 0 0 1 ${7 * s} ${-4.2 * s} ${4 * s} ${4 * s} 0 0 1 ${7 * s} ${4.2 * s}z" fill="${c}"/>`;

const POSES = {
  namoro: [
    {
      nome: "Abraço",
      l: { x: 27, rot: 8, mood: "happy", semR: true },
      r: { x: 93, rot: -8, mood: "happy", semL: true },
      bracos: `<path d="M128 80Q146 70 158 82" class="dbraco"/><path d="M112 80Q94 70 82 82" class="dbraco"/>`,
      extra: `<g class="dcorac">${HEART(120, 6, 1.1)}${HEART(100, 20, 0.6, "#FF7AA8")}${HEART(142, 18, 0.5, "#FF7AA8")}</g>`
    },
    {
      nome: "Beijinho",
      l: { x: 30, rot: 15, mood: "happy" },
      r: { x: 90, rot: -15, mood: "happy" },
      extra: `<g class="dpop">${HEART(120, 30, 1.3)}</g>`
    },
    {
      nome: "Mãos dadas",
      l: { x: 20, rot: 0, mood: "idle", armR: "M99 71Q108 82 113 90" },
      r: { x: 100, rot: 0, mood: "idle", armL: "M21 71Q12 82 7 90" },
      extra: `<g class="dcorac">${HEART(120, 50, 0.8)}</g>`
    },
    {
      nome: "Coração",
      l: { x: 14, rot: 4, mood: "happy" },
      r: { x: 106, rot: -4, mood: "happy" },
      extra: `<g class="dpulse"><path d="M120 66l-22-20a12 12 0 0 1 22-14 12 12 0 0 1 22 14z" fill="none" stroke="#E8337A" stroke-width="4.5" stroke-linejoin="round"/></g>`
    },
    {
      nome: "Dividindo o fone",
      l: { x: 22, rot: 4, mood: "happy", armR: "M99 71Q106 86 110 96" },
      r: { x: 98, rot: -4, mood: "happy", armL: "M21 71Q14 86 10 96" },
      extra: `<g class="fone"><path d="M119 70Q117 92 120 104M121 70Q124 92 120 104" fill="none" stroke="var(--ink)" stroke-width="1.6"/><circle cx="118.5" cy="69" r="2.6" fill="#F7F5FA" stroke="var(--ink)" stroke-width="1.2"/><circle cx="121.5" cy="69" r="2.6" fill="#F7F5FA" stroke="var(--ink)" stroke-width="1.2"/><rect x="113" y="104" width="14" height="22" rx="3" fill="#2B2D3A" stroke="var(--ink)" stroke-width="1.4"/><rect x="115" y="107" width="10" height="13" rx="1" fill="#7FE8FF"/></g><g class="dcorac"><path d="M140 40v-8l6 -2v8" fill="none" stroke="var(--muted)" stroke-width="1.4"/><circle cx="138" cy="40" r="2" fill="var(--muted)"/><circle cx="144" cy="38" r="2" fill="var(--muted)"/></g>`
    },
    {
      nome: "Juntinhos",
      l: { x: 29, rot: 12, mood: "sleepy", semR: true },
      r: { x: 91, rot: -12, mood: "sleepy", semL: true },
      bracos: `<path d="M128 84Q144 78 154 88" class="dbraco"/>`,
      extra: ""
    }
  ],
  amizade: [
    {
      nome: "High-five",
      l: { x: 12, rot: 3, mood: "party", armR: "M99 69Q110 48 116 32" },
      r: { x: 108, rot: -3, mood: "party", armL: "M21 69Q10 48 4 32" },
      extra: `<g class="dpop"><path d="M120 18l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#F2C14E"/></g>`
    },
    {
      nome: "Abraço de amigo",
      l: { x: 27, rot: 7, mood: "happy", semR: true },
      r: { x: 93, rot: -7, mood: "happy", semL: true },
      bracos: `<path d="M128 80Q146 70 158 82" class="dbraco"/><path d="M112 80Q94 70 82 82" class="dbraco"/>`,
      extra: ""
    },
    {
      nome: "Comemoração",
      l: { x: 20, rot: -4, mood: "party", pula: 1 },
      r: { x: 100, rot: 4, mood: "party", pula: 2 },
      extra: ""
    },
    {
      nome: "Dividindo o fone",
      l: { x: 22, rot: 4, mood: "happy", armR: "M99 71Q106 86 110 96" },
      r: { x: 98, rot: -4, mood: "happy", armL: "M21 71Q14 86 10 96" },
      extra: `<g class="fone"><path d="M119 70Q117 92 120 104M121 70Q124 92 120 104" fill="none" stroke="var(--ink)" stroke-width="1.6"/><circle cx="118.5" cy="69" r="2.6" fill="#F7F5FA" stroke="var(--ink)" stroke-width="1.2"/><circle cx="121.5" cy="69" r="2.6" fill="#F7F5FA" stroke="var(--ink)" stroke-width="1.2"/><rect x="113" y="104" width="14" height="22" rx="3" fill="#2B2D3A" stroke="var(--ink)" stroke-width="1.4"/><rect x="115" y="107" width="10" height="13" rx="1" fill="#7FE8FF"/></g><g class="dcorac"><path d="M140 40v-8l6 -2v8" fill="none" stroke="var(--muted)" stroke-width="1.4"/><circle cx="138" cy="40" r="2" fill="var(--muted)"/><circle cx="144" cy="38" r="2" fill="var(--muted)"/></g>`
    },
    {
      nome: "Ombro a ombro",
      l: { x: 24, rot: 5, mood: "happy", semR: true },
      r: { x: 96, rot: -2, mood: "happy" },
      bracos: `<path d="M128 78Q148 52 168 66" class="dbraco"/>`,
      extra: ""
    }
  ]
};

/* Poses extras da dupla, nas duas parcerias */
const CAMERA_FOTOLOG = `<g class="dpop"><g transform="translate(206 26) rotate(12)"><rect x="-11" y="-7" width="22" height="14" rx="2.4" fill="#C9CED6" stroke="var(--ink)" stroke-width="1.6"/><circle cx="2" cy="0" r="4.6" fill="#2B2D3A"/><circle cx="2" cy="0" r="2.2" fill="#4A5A8A"/></g><path d="M178 10l2.6 6 6 2.6-6 2.6-2.6 6-2.6-6-6-2.6 6-2.6z" fill="#FFF6C8"/></g>`;
const FRANJA_DIVIDIDA = `<path d="M54 64Q56 30 96 26Q120 22 144 26Q184 30 186 64Q172 52 160 58Q156 74 146 90Q148 70 134 60Q120 56 106 60Q92 70 94 90Q84 74 80 58Q68 52 54 64Z" fill="#141416" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/><path d="M100 32Q120 26 140 32" stroke="#C8102E" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const POSES_EXTRAS = [
  {
    nome: "Foto de Fotolog",
    l: { x: 20, rot: 8, mood: "happy", semR: true },
    r: { x: 100, rot: -8, mood: "party", semL: true, armR: "M99 69Q112 46 110 22" },
    extra: CAMERA_FOTOLOG
  },
  {
    nome: "Dividindo a franja",
    l: { x: 24, rot: 9, mood: "happy", semR: true },
    r: { x: 96, rot: -9, mood: "happy", semL: true },
    semCabelo: true,
    extra: FRANJA_DIVIDIDA
  }
];
POSES.namoro.push(...POSES_EXTRAS);
POSES.amizade.push(...POSES_EXTRAS);

let poseIdx = Math.floor(Math.random() * 10);

/* "Chamar a atenção": a tela toda treme por um instante */
function tremerTela() {
  if (RM) return;
  const wrap = document.querySelector(".wrap");
  wrap.classList.remove("tremendo");
  void wrap.offsetWidth;
  wrap.classList.add("tremendo");
  setTimeout(() => wrap.classList.remove("tremendo"), 700);
}

/* ---------- Recados (estilo Orkut) ---------- */
/* Cada um guarda os recados que MANDOU no próprio perfil; o parceiro lê os que são pra ele. */
function recadosRecebidos() {
  if (!parceiroDados || !Array.isArray(parceiroDados.recados)) return [];
  return parceiroDados.recados.filter(r => r.para === meuId).sort((a, b) => b.em - a.em);
}
function enviarRecado(texto) {
  texto = texto.trim().slice(0, 240);
  if (!texto || !parceriaAtiva()) return;
  S.parceria.recados = [{ para: S.parceria.id, texto, em: Date.now() }, ...(S.parceria.recados || [])].slice(
    0,
    10
  );
  persist();
  publicarPerfil(true);
  toast("Recado enviado!", false, "happy");
}
function avisarRecadoNovo() {
  const r = recadosRecebidos()[0];
  if (!r || r.em <= (S.parceria.recadoVisto || 0)) return;
  S.parceria.recadoVisto = r.em;
  persist();
  toast(`Novo recado de ${nomeParceiro()}!`, false, "happy");
}

function duoHTML() {
  const tipo = S.parceria.tipo === "amizade" ? "amizade" : "namoro";
  const lista = POSES[tipo];
  const pose = lista[poseIdx % lista.length];
  const minhaAgua = Math.min(1, waterToday() / S.waterGoal);
  const desenhar = (lado, eq, persona, fill, def) => {
    if (pose.semCabelo) eq = { ...eq, hair: undefined, hat: undefined };
    const svg = prumi({
      mood: def.mood,
      fill,
      size: 120,
      eq,
      p: persona,
      semL: def.semL,
      semR: def.semR,
      armL: def.armL,
      armR: def.armR
    });
    return `<g class="dlado ${def.pula ? "pula" + def.pula : ""}" transform="rotate(${def.rot} ${def.x + 60} 150)">${svg.replace("<svg ", `<svg x="${def.x}" y="12" overflow="visible" `)}</g>`;
  };
  const eu = desenhar("l", S.equip, S.persona, minhaAgua, pose.l);
  const ele = desenhar(
    "r",
    parceiroDados.equip || {},
    parceiroDados.persona,
    (parceiroDados.agua || 0) / 100,
    pose.r
  );
  // Os dois com o colar de metade de coração: o coração se completa entre eles
  const metades =
    S.equip.neck === "emo_metade_coracao" &&
    parceiroDados.equip &&
    parceiroDados.equip.neck === "emo_metade_coracao"
      ? `<g class="dpulse">${HEART(120, 94, 1.1, "#C8102E")}</g>`
      : "";
  return `<svg class="duo" viewBox="0 0 240 175" role="img" aria-label="Você e ${esc(nomeParceiro())}, pose ${pose.nome}">${ele}${eu}${pose.bracos || ""}${pose.extra}${metades}</svg>`;
}

function parceriaHeroHTML() {
  const p = parceiroDados;
  const mimos = MIMOS[S.parceria.tipo === "amizade" ? "amizade" : "namoro"];
  return `<div class="herobox">${enfeiteMundo()}
    <button class="duowrap" data-act="pose" aria-label="Trocar pose">${duoHTML()}</button>
    <div class="duoinfo"><span><b>${esc(S.name || "Você")}</b> e <b>${esc(nomeParceiro())}</b> · ${TIPOS_PARCERIA[S.parceria.tipo] || "Parceria"}</span>
      ${linhaMsnHTML(nomeParceiro(), p.status, p.ouvindo)}
      ${p.subnick ? `<span class="subnick letreiro"><span>${esc(nomeParceiro())} diz: ${esc(p.subnick)}</span></span>` : ""}
      <span class="note">${esc(nomeParceiro())} está <b>${esc((p.humor && p.humor.nivel) || "de boa").toLowerCase()}</b> · água ${p.agua || 0}% · toque nos Prumis pra trocar a pose</span></div>
    <div class="bubble solo" id="bubble" aria-live="polite"></div>
    <div class="mimos">${mimos.map(([k, l]) => `<button class="btn small" data-act="mimo" data-t="${k}">${l}</button>`).join("")}</div>
    ${humorHTML()}
  </div>`;
}

/* Seção de parceria na aba Hábitos e social */
function parceriaSecaoHTML() {
  if (!banco) {
    return `<section class="block"><h2 class="h2">Parceria</h2><div class="empty"><strong>${textoMundo("conviteTitulo", "Junte seu Prumi com o de outra pessoa.")}</strong>${contaConfigurada() ? "Entre com Google em Ajustes. Depois é só passar seu código ou seu @ para a outra pessoa." : "Para isso, o Prumo precisa estar ligado a uma conta. A conta com Google chega em breve."}</div></section>`;
  }
  const pend = S.parceria.id && !parceriaAtiva();
  return `<section class="block"><h2 class="h2">Parceria</h2>
    ${pedidos.map(p => `<div class="card pedido"><span><b>${esc(p.nome || "Alguém")}</b> ${textoMundo("pedidoChegou", `quer ser ${p.tipo === "amizade" ? "seu amigo(a)" : "seu namorado(a)"} no Prumo.`)}</span><div class="row"><button class="btn small primary" data-act="aceitar" data-id="${esc(p.id)}">Aceitar</button></div></div>`).join("")}
    ${
      parceriaAtiva()
        ? `<div class="card"><span>Você e <b>${esc(nomeParceiro())}</b> são <b>${(TIPOS_PARCERIA[S.parceria.tipo] || "").toLowerCase()}</b> no Prumo. Os dois Prumis aparecem juntos na aba Hoje.</span><div><button class="btn small ghost danger" data-act="desfazer">Desfazer parceria</button></div></div>`
        : pend
          ? `<div class="card"><span>Pedido enviado. Assim que a outra pessoa aceitar, os Prumis aparecem juntos.</span><div><button class="btn small ghost" data-act="desfazer">Cancelar pedido</button></div></div>`
          : `<div class="card">
          <span>Seu código: <b class="mono codigo">${esc(S.codigo || "…")}</b></span>
          <span class="note">${textoMundo("conviteDica", "Passe esse código para a outra pessoa, ou digite o código dela aqui embaixo.")}</span>
          <form class="row" data-form="parceria">
            <input id="par-codigo" type="text" maxlength="21" placeholder="Código ou @" style="width:130px" autocomplete="off" autocapitalize="off" required>
            <select id="par-tipo" aria-label="Tipo"><option value="namoro">Namorado(a)</option><option value="amizade">Amigo(a)</option></select>
            <button class="btn primary" type="submit">${textoMundo("conviteBotao", "Conectar")}</button>
          </form>
        </div>`
    }
  </section>`;
}
