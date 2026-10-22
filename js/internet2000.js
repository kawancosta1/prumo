/*
  Internet dos anos 2000 no perfil do Prumi (aba Prumi → Perfil):
  - Status de MSN (Online, Ausente, Ocupado, Aparecer offline) e "Ouvindo:", que o par vê no duo da Hoje.
  - Depoimentos do Orkut: você escreve para o seu par, e ele aprova ou recusa antes de aparecer.
  - Comunidades do Orkut: selos liberados por conquistas.
  - Contador de visitas estilo MySpace e escolha do fundo do perfil.
  - Fotolog: ao fechar o dia sai uma "foto" do Prumi de cima, com legenda, guardada na galeria.
  As frases e legendas podem ser trocadas por cada mundo (MUNDO_FX.<mundo>.legendasFotolog).
*/
"use strict";

/* ================= MSN ================= */
const STATUS_MSN = {
  online: { nome: "Online", cor: "#3CC24A" },
  ausente: { nome: "Ausente", cor: "#F2B233" },
  ocupado: { nome: "Ocupado", cor: "#E0314F" },
  offline: { nome: "Aparecer offline", cor: "#9AA3AD" }
};
const statusMsn = () => (STATUS_MSN[S.perfil.status] ? S.perfil.status : "online");

/** Linha estilo MSN: bolinha de status, nome e o "Ouvindo:". Quem aparece offline fica cinza e sem música. */
function linhaMsnHTML(nome, status, ouvindo) {
  const st = STATUS_MSN[status] || STATUS_MSN.online;
  const rotulo = status === "offline" ? "Offline" : st.nome;
  return `<span class="msn"><i class="msn-bola" style="--c:${st.cor}"></i><b>${esc(nome)}</b> <span class="note">(${rotulo})</span>${ouvindo && status !== "offline" ? `<span class="msn-ouvindo">♪ Ouvindo: ${esc(ouvindo)}</span>` : ""}</span>`;
}

/* ================= depoimentos (Orkut) ================= */
// Os que o par escreveu para mim e eu ainda não aprovei nem recusei
function depoimentosPendentes() {
  if (!parceiroDados || !Array.isArray(parceiroDados.depoimentos)) return [];
  return parceiroDados.depoimentos.filter(d => d.para === meuId && !S.perfil.depoVistos.includes(d.em));
}
function escreverDepoimento(texto) {
  texto = texto.trim().slice(0, 400);
  if (!texto || !parceriaAtiva()) return;
  S.parceria.depoimentos = [{ para: S.parceria.id, texto, em: Date.now() }, ...S.parceria.depoimentos].slice(
    0,
    5
  );
  persist();
  publicarPerfil(true);
  toast(`Depoimento enviado. Falta ${nomeParceiro()} aprovar.`, false, "happy");
}
function decidirDepoimento(em, aceitar) {
  const d = depoimentosPendentes().find(x => x.em === em);
  if (!d) return;
  S.perfil.depoVistos = [em, ...S.perfil.depoVistos].slice(0, 40);
  if (aceitar)
    S.perfil.depoAceitos = [{ de: nomeParceiro(), texto: d.texto, em }, ...S.perfil.depoAceitos].slice(0, 20);
  commit();
  toast(
    aceitar ? "Depoimento aprovado. Agora aparece no seu perfil." : "Depoimento recusado.",
    false,
    "happy"
  );
}

/* ================= comunidades (Orkut) ================= */
// Cada comunidade é liberada por uma conquista (ACHS em js/conquistas.js). Os nomes são inventados.
const COMUNIDADES = [
  { nome: "Eu sobrevivi à segunda-feira", ach: "ritmo", cor: "#2F4F8F", icone: "check" },
  { nome: "Bebo água chorando", ach: "semana_agua", cor: "#5B6FC2", icone: "gota" },
  { nome: "Eu odeio acordar cedo", ach: "criatura_noite", cor: "#2A2733", icone: "lua" },
  { nome: "Escrevo poemas às 3h", ach: "poeta", cor: "#7A0F24", icone: "pena" },
  { nome: "Flash na cara, coração na mão", ach: "fotologueiro", cor: "#C8102E", icone: "camera" },
  { nome: "Riscar lista é minha terapia", ach: "produtivo", cor: "#1C8350", icone: "check" },
  { nome: "Não sou antissocial, só seletivo", ach: "sociavel", cor: "#5B2E7A", icone: "coracao" },
  { nome: "Estudo ouvindo música triste", ach: "foco10", cor: "#141416", icone: "fone" },
  { nome: "Hábito é tipo tatuagem", ach: "habito21", cor: "#A9670E", icone: "estrela" },
  { nome: "Dia perfeito existe sim", ach: "dia_perfeito", cor: "#AE2C76", icone: "estrela" },
  { nome: "Minha franja tem vida própria", ach: "colecionador", cor: "#3A3A44", icone: "coracao" },
  { nome: "Rawr quer dizer eu te amo", ach: "morcego", cor: "#141016", icone: "morcego" }
];
const ICONES_COMUNIDADE = {
  check: `<path d="M8 15l4 4 8-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  gota: `<path d="M14 6Q20 13 19 17A5 5 0 0 1 9 17Q8 13 14 6Z" fill="#fff"/><path d="M11 22l-1 3M17 22l1 3" stroke="#BFE3F2" stroke-width="1.6" stroke-linecap="round"/>`,
  lua: `<path d="M17 6A8 8 0 1 0 22 19A7 7 0 0 1 17 6Z" fill="#F2EAD3"/>`,
  pena: `<path d="M20 5Q8 9 9 21L11 19Q12 11 20 5Z" fill="#fff"/><path d="M9 21L7 24" stroke="#fff" stroke-width="1.6"/>`,
  camera: `<rect x="6" y="10" width="16" height="11" rx="2" fill="#fff"/><circle cx="14" cy="15.5" r="3.4" fill="#C8102E"/><rect x="9" y="8" width="5" height="3" fill="#fff"/>`,
  coracao: `<path d="M14 22l-6.4-6a3.8 3.8 0 0 1 6.4-4 3.8 3.8 0 0 1 6.4 4z" fill="#fff"/>`,
  fone: `<path d="M8 17V14a6 6 0 0 1 12 0v3" fill="none" stroke="#fff" stroke-width="2"/><rect x="6" y="16" width="4" height="6" rx="1.4" fill="#fff"/><rect x="18" y="16" width="4" height="6" rx="1.4" fill="#fff"/>`,
  estrela: `<path d="M14 6l2.4 5 5.4.6-4 3.7 1.1 5.4L14 18l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" fill="#fff"/>`,
  morcego: `<g transform="translate(14 14) scale(.62)"><path d="${BAT}" fill="#fff"/></g>`
};
const comunidadeIcone = c =>
  `<svg class="com-icone" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="5" fill="${c.cor}"/>${ICONES_COMUNIDADE[c.icone] || ""}</svg>`;

/* ================= contador de visitas e fundos ================= */
function contarVisita() {
  S.perfil.visitas = (S.perfil.visitas || 0) + 1;
  persist();
}
const LAYOUTS_PERFIL = [
  ["classico", "Clássico"],
  ["estrelas", "Estrelinhas"],
  ["xadrez", "Xadrez"],
  ["oncinha", "Oncinha"],
  ["noite", "Noite"],
  ["coracoes", "Corações"]
];
const contadorHTML = n =>
  `<span class="contador" aria-label="${n} visitas">${String(n)
    .padStart(6, "0")
    .split("")
    .map(d => `<i>${d}</i>`)
    .join("")}</span>`;

/* ================= Fotolog ================= */
const LEGENDAS_FOTOLOG = [
  "mais um dia sobrevivido =]",
  "eu e minha melhor versão (ou quase)",
  "hoje foram {n} tarefas e zero arrependimentos",
  "flash na cara e coração na mão",
  "não repara a bagunça, repara no sorriso",
  "{ml} de água hoje. hidratado e lindo",
  "xoxo, {nome}",
  "fim do dia, começo do descanso"
];
let fotoAberta = null; // id da foto ampliada na galeria

/** Tira a foto do dia (uma por dia). Devolve a foto nova, ou null se hoje já tinha. */
function tirarFotolog() {
  const d = today();
  if (S.fotolog.some(f => f.d === d)) return null;
  const efeitoMundo = MUNDO_FX[S.persona];
  const lista = (efeitoMundo && efeitoMundo.legendasFotolog) || LEGENDAS_FOTOLOG;
  const feitas = S.tasks.filter(t => t.date === d && t.done).length;
  const legenda = pick(lista)
    .replace("{n}", feitas)
    .replace("{ml}", fmtML(waterToday()))
    .replace("{nome}", S.name || "Prumi");
  const h = calcularHumor();
  const foto = {
    id: newId(),
    d,
    p: S.persona,
    eq: { ...S.equip },
    mood: ["cry", "sad", "upset"].includes(h.nivel.rosto) ? "sad" : pick(["happy", "idle", "party"]),
    agua: Math.round(Math.min(1, waterToday() / S.waterGoal) * 100) / 100,
    legenda
  };
  S.fotolog = [foto, ...S.fotolog].slice(0, 40);
  return foto;
}

/** Uma foto: o Prumi visto de cima, meio torto, com o braço levantado segurando a câmera. */
function fotoHTML(f, grande) {
  const data = f.d
    .split("-")
    .reverse()
    .join(".")
    .replace(/\.(\d\d)(\d\d)$/, ".$2");
  return `<figure class="fotolog-foto ${grande ? "grande" : ""}"><div class="fl-quadro"><div class="fl-angulo">${prumi({ mood: f.mood, fill: f.agua, size: 120, eq: f.eq, p: f.p, armR: "M99 69Q113 52 109 30" })}</div><span class="fl-flash"></span><span class="fl-data">${data}</span></div>${grande ? `<figcaption>${esc(f.legenda)}</figcaption>` : ""}</figure>`;
}

function fotologHTML() {
  if (!S.fotolog.length)
    return `<span class="note">Nenhuma foto ainda. Toda vez que você fecha o dia na aba Hoje, sai uma foto nova aqui.</span>`;
  const aberta = S.fotolog.find(f => f.id === fotoAberta);
  return `${
    aberta
      ? `<div class="fl-aberta">${fotoHTML(aberta, true)}<div class="row"><span class="note">${fmtLong(aberta.d)}</span><button class="btn small ghost" data-act="foto-fechar">Fechar</button></div></div>`
      : ""
  }<div class="fl-galeria">${S.fotolog
    .map(
      f =>
        `<button class="fl-mini ${f.id === fotoAberta ? "on" : ""}" data-act="foto-abrir" data-id="${f.id}" aria-label="Foto de ${fmtShort(f.d)}">${fotoHTML(f, false)}</button>`
    )
    .join("")}</div>`;
}

/* ================= blocos do perfil ================= */
function msnBlocoHTML() {
  const st = statusMsn();
  const musica = musicasDoMundo()[calcularHumor().nivel.rosto] || "";
  return `<div class="ms-bloco">
      <span class="ms-titulo">MSN</span>
      <div class="msn-status" role="group" aria-label="Status">${Object.entries(STATUS_MSN)
        .map(
          ([k, v]) =>
            `<button class="chipbtn" data-act="msn-status" data-s="${k}" aria-pressed="${st === k}"><i class="msn-bola" style="--c:${v.cor}"></i>${v.nome}</button>`
        )
        .join("")}</div>
      <label class="note" for="perfil-subnick">Subnick</label>
      <div class="row">
        <input id="perfil-subnick" type="text" data-change="perfil-subnick" maxlength="60" value="${esc(S.perfil.subnick)}" placeholder="Sua frase do dia" autocomplete="off" style="flex:1">
        <button class="btn small" data-act="sortear-subnick">Sortear frase</button>
      </div>
      <label class="note" for="perfil-ouvindo">Ouvindo</label>
      <div class="row">
        <input id="perfil-ouvindo" type="text" data-change="perfil-ouvindo" maxlength="60" value="${esc(S.perfil.ouvindo)}" placeholder="Nome de uma música (inventada também vale)" autocomplete="off" style="flex:1">
        ${musica ? `<button class="btn small" data-act="ouvindo-humor">Usar a do humor</button>` : ""}
      </div>
      <span class="note">Seu par vê o status, o subnick e o que você está ouvindo, igual no MSN.</span>
    </div>`;
}

function depoimentosBlocoHTML() {
  const amigo = parceriaAtiva();
  const pend = amigo ? depoimentosPendentes() : [];
  const aceitos = S.perfil.depoAceitos;
  return `<div class="ms-bloco">
      <span class="ms-titulo">Depoimentos</span>
      ${pend
        .map(
          d =>
            `<div class="depo pendente"><span class="note"><b>${esc(nomeParceiro())}</b> escreveu um depoimento pra você. Aceitar?</span><p>${esc(d.texto)}</p><div class="row"><button class="btn small primary" data-act="depo-aceitar" data-em="${d.em}">Aceitar</button><button class="btn small ghost" data-act="depo-recusar" data-em="${d.em}">Recusar</button></div></div>`
        )
        .join("")}
      ${aceitos.length ? `<ul class="recados depos">${aceitos.map(d => `<li><b>${esc(d.de)}</b> <span class="note">${fmtShort(ymd(new Date(d.em)))}</span><p>${esc(d.texto)}</p></li>`).join("")}</ul>` : !pend.length ? `<span class="note">Nenhum depoimento aprovado ainda.</span>` : ""}
      ${
        amigo
          ? `<form class="col" data-form="depoimento"><textarea id="depo-txt" maxlength="400" placeholder="Escreva um depoimento para ${esc(nomeParceiro())}. Só aparece depois que a pessoa aprovar." required></textarea><div><button class="btn small primary" type="submit">Enviar depoimento</button></div></form>`
          : `<span class="note">Com uma parceria conectada, vocês podem escrever depoimentos um pro outro.</span>`
      }
    </div>`;
}

function comunidadesBlocoHTML() {
  const minhas = COMUNIDADES.filter(c => S.ach[c.ach]);
  const faltam = COMUNIDADES.length - minhas.length;
  return `<div class="ms-bloco">
      <span class="ms-titulo">Comunidades (${minhas.length})</span>
      ${minhas.length ? `<div class="comunidades">${minhas.map(c => `<span class="comunidade">${comunidadeIcone(c)}<span>${esc(c.nome)}</span></span>`).join("")}</div>` : ""}
      <span class="note">${faltam ? `${minhas.length ? "Mais" : "Ainda"} ${faltam} ${faltam === 1 ? "comunidade" : "comunidades"} pra descobrir. Cada conquista libera uma.` : "Você entrou em todas as comunidades!"}</span>
    </div>`;
}

function layoutBlocoHTML() {
  return `<div class="ms-bloco">
      <span class="ms-titulo">Layout do perfil</span>
      <div class="chips" role="group" aria-label="Fundo do perfil">${LAYOUTS_PERFIL.map(([k, l]) => `<button class="chipbtn" data-act="perfil-layout" data-l="${k}" aria-pressed="${S.perfil.layout === k}">${l}</button>`).join("")}</div>
    </div>`;
}

/* ================= botões, formulários e campos ================= */
ACOES_EXTRAS["msn-status"] = b => {
  S.perfil.status = b.dataset.s;
  commit();
  publicarPerfil(true);
};
ACOES_EXTRAS["ouvindo-humor"] = () => {
  S.perfil.ouvindo = musicasDoMundo()[calcularHumor().nivel.rosto] || "";
  commit();
  publicarPerfil(true);
};
ACOES_EXTRAS["depo-aceitar"] = b => decidirDepoimento(+b.dataset.em, true);
ACOES_EXTRAS["depo-recusar"] = b => decidirDepoimento(+b.dataset.em, false);
ACOES_EXTRAS["perfil-layout"] = b => {
  S.perfil.layout = b.dataset.l;
  commit();
};
ACOES_EXTRAS["foto-abrir"] = (b, id) => {
  fotoAberta = fotoAberta === id ? null : id;
  render();
};
ACOES_EXTRAS["foto-fechar"] = () => {
  fotoAberta = null;
  render();
};
FORMS_EXTRAS.depoimento = () => {
  escreverDepoimento(getV("depo-txt"));
};
MUDANCAS_EXTRAS["perfil-ouvindo"] = el => {
  S.perfil.ouvindo = el.value.trim().slice(0, 60);
  persist();
  publicarPerfil(true);
};
