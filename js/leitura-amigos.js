/*
  Leitura com amigos (aba Estante → Juntos):
  - Corrida da semana: páginas e minutos da semana seus e dos amigos (vem da vitrine: campo "semana").
  - Leitura em dupla: com o seu par, uma barra das páginas que vocês leram juntos na semana.
  - Clube do livro: amigos lendo o mesmo livro, com o progresso de cada um e comentários por página.
    Proteção contra spoiler: um comentário só aparece quando você passa da página dele.
    No Firestore: clubes/{id} = { nome, livro, membros, dono, criado },
                  clubes/{id}/membros/{uid} = { pagina, nome, em },
                  clubes/{id}/comentarios/{c} = { de, deNome, pagina, texto, em }.
  - Recomendar livro: manda um livro para a caixa de avisos de um amigo (tipo "livro").
  - Empréstimos: livro emprestado para alguém, com data para devolver (fica só no aparelho, em S).
  Tudo que vem de outra pessoa passa por limpeza antes de ir para a tela.
*/
"use strict";

const CLUBE_MAX = 12;
const DUPLA_META = 300; // páginas por semana, os dois juntos

/* ===================== corrida da semana ===================== */
/** Seus números da semana (publicados na vitrine para os amigos). */
function minhaSemana() {
  const seg = mondayOf(today());
  const dias = Array.from({ length: 7 }, (_, i) => addDays(seg, i)).filter(d => d <= today());
  return {
    seg,
    paginas: dias.reduce((a, d) => a + paginasDoDia(d), 0),
    minutos: dias.reduce((a, d) => a + minutosLeitura(d) + minutosEstudo(d), 0)
  };
}
const pontosSemana = s => (s ? Math.round(s.paginas + s.minutos / 2) : 0);
const semanaValida = s => s && s.seg === mondayOf(today());

function corridaHTML() {
  if (!modoFirebase()) return "";
  const amigos = amigosAceitos();
  amigos.forEach(a => !(amigosInfo[a.uid] && amigosInfo[a.uid].vitrine) && carregarAmigo(a.uid, true));
  const lista = [
    { nome: "Você", eu: true, s: minhaSemana() },
    ...amigos.map(a => {
      const v = (amigosInfo[a.uid] || {}).vitrine;
      return { nome: nomeDe(a.uid), s: v && semanaValida(v.semana) ? v.semana : null };
    })
  ].sort((a, b) => pontosSemana(b.s) - pontosSemana(a.s));
  const max = Math.max(1, ...lista.map(x => pontosSemana(x.s)));
  return `<div class="card corrida"><div class="row" style="justify-content:space-between"><b>Corrida da semana</b><small class="note">páginas + minutos</small></div>
    ${amigos.length ? `<ol class="corrida-lista">${lista.map((x, i) => `<li class="${x.eu ? "eu" : ""}"><span class="pos">${i + 1}º</span><div class="main"><span class="title">${esc(x.nome)}</span><div class="progress"><span style="width:${Math.round((pontosSemana(x.s) / max) * 100)}%"></span></div></div><span class="mono">${x.s ? `${x.s.paginas} p · ${x.s.minutos} min` : "sem leitura"}</span></li>`).join("")}</ol>` : `<span class="note">Adicione amigos para correr junto. <button class="olink" data-tab="amigos">Convidar amigos</button></span>`}
  </div>`;
}

/* ===================== leitura em dupla ===================== */
function duplaHTML() {
  if (typeof parceriaAtiva !== "function" || !parceriaAtiva()) return "";
  const eu = minhaSemana().paginas;
  const ele = parceiroDados && semanaValida(parceiroDados.semana) ? parceiroDados.semana.paginas : 0;
  const total = eu + ele;
  return `<div class="card dupla"><div class="row" style="justify-content:space-between"><b>Leitura em dupla</b><small class="note">${total}/${DUPLA_META} páginas na semana</small></div>
    <div class="dupla-barra"><span class="d-eu" style="width:${Math.min(100, (eu / DUPLA_META) * 100)}%"></span><span class="d-ele" style="width:${Math.min(100 - Math.min(100, (eu / DUPLA_META) * 100), (ele / DUPLA_META) * 100)}%"></span></div>
    <span class="note">Você: <b>${eu}</b> · ${esc(nomeParceiro())}: <b>${ele}</b>. ${total >= DUPLA_META ? "Meta da dupla batida!" : `Faltam ${DUPLA_META - total} páginas para a meta da dupla.`}</span></div>`;
}

/* ===================== empréstimos (só no aparelho) ===================== */
const emprestados = () => S.livros.filter(l => l.emprestimo && l.emprestimo.para);
function emprestimoHTML(l) {
  const e = l.emprestimo;
  if (e && e.para)
    return `<div class="row emprestimo"><span class="note">Emprestado para <b>${esc(e.para)}</b> em ${fmtShort(e.em)} · devolver até ${fmtShort(e.devolver)}</span><button class="btn small" data-act="emprestimo-volta" data-id="${l.id}">Voltou</button></div>`;
  return `<details class="more emprestar"><summary>Emprestar este livro</summary><form class="row" data-form="emprestar" data-id="${l.id}"><input id="emp-para-${l.id}" maxlength="40" placeholder="Para quem?" style="flex:1" autocomplete="off" required><select id="emp-prazo-${l.id}" aria-label="Prazo"><option value="14">2 semanas</option><option value="30" selected>1 mês</option><option value="60">2 meses</option></select><button class="btn small" type="submit">Emprestar</button></form></details>`;
}
FORMS_EXTRAS.emprestar = f => {
  const l = livro(f.dataset.id);
  if (!l) return;
  const para = getV("emp-para-" + l.id).slice(0, 40);
  if (!para) return;
  const dias = [14, 30, 60].includes(+getV("emp-prazo-" + l.id)) ? +getV("emp-prazo-" + l.id) : 30;
  l.emprestimo = { para, em: today(), devolver: addDays(today(), dias) };
  react(
    "happy",
    `Anotado: <b>${esc(l.titulo)}</b> com ${esc(para)} até ${fmtShort(l.emprestimo.devolver)}. Eu te lembro!`,
    3200
  );
};
ACOES_EXTRAS["emprestimo-volta"] = (b, id) => {
  const l = livro(id);
  if (!l) return;
  delete l.emprestimo;
  react("party", `<b>${esc(l.titulo)}</b> voltou pra estante!`, 2400);
  commit();
};
function emprestadosHTML() {
  const lista = emprestados();
  if (!lista.length) return "";
  return `<div class="card emprestados"><b>Livros emprestados</b><ul class="list">${lista
    .map(l => {
      const atraso = l.emprestimo.devolver < today();
      return `<li><div class="item">${capaHTML(l, 30)}<div class="main"><span class="title">${esc(l.titulo)}</span><span class="meta">${esc(l.emprestimo.para)} · ${atraso ? `<b class="atraso">devolver desde ${fmtShort(l.emprestimo.devolver)}</b>` : `até ${fmtShort(l.emprestimo.devolver)}`}</span></div><button class="btn small" data-act="emprestimo-volta" data-id="${l.id}">Voltou</button></div></li>`;
    })
    .join("")}</ul></div>`;
}
/** Aviso na aba Hoje de livro que já devia ter voltado. */
function emprestimoHojeHTML() {
  const atrasados = emprestados().filter(l => l.emprestimo.devolver <= today());
  if (!atrasados.length) return "";
  return `<section class="block"><button class="card aviso-emprestimo" data-tab="estante"><b>Pegar de volta</b><span>${atrasados.map(l => `${esc(l.titulo)} com ${esc(l.emprestimo.para)}`).join(" · ")}</span></button></section>`;
}

/* ===================== recomendar livro ===================== */
const livroLimpo = x => ({
  titulo: texto(x && x.titulo, 160) || "Sem título",
  autor: texto(x && x.autor, 120),
  paginas: numero(x && x.paginas, 5000),
  capa: /^https:\/\//.test((x && x.capa) || "") ? texto(x.capa, 500) : "",
  isbn: texto(x && x.isbn, 13).replace(/\D/g, "")
});
function recomendarHTML(l) {
  if (!modoFirebase() || !amigosAceitos().length) return "";
  return `<details class="more recomendar"><summary>Recomendar para um amigo</summary><form class="col" data-form="recomendar" data-id="${l.id}"><select id="rec-amigo-${l.id}" aria-label="Amigo" required><option value="">Para quem?</option>${amigosAceitos()
    .map(a => `<option value="${esc(a.uid)}">${esc(nomeDe(a.uid))}</option>`)
    .join(
      ""
    )}</select><input id="rec-msg-${l.id}" maxlength="200" placeholder="Por que vale a pena? (opcional)" autocomplete="off"><button class="btn small" type="submit">Recomendar</button></form></details>`;
}
FORMS_EXTRAS.recomendar = async f => {
  const l = livro(f.dataset.id);
  const uid = getV("rec-amigo-" + (l && l.id));
  if (!l || !uid) return toast("Escolha para quem", false, "worried");
  const msg = getV("rec-msg-" + l.id).slice(0, 200);
  const ok = await mandarParaCaixa(
    uid,
    "livro",
    `${l.titulo}${l.autor ? " · " + l.autor : ""}${msg ? "\n" + msg : ""}`,
    {
      livro: livroLimpo(l)
    }
  );
  if (ok) react("happy", `Recomendação mandada para <b>${esc(nomeDe(uid))}</b>!`, 2800);
};
/** Botão da caixa de avisos: pôr o livro recomendado em "Quero ler". */
ACOES_EXTRAS["rec-guardar"] = (b, id) => {
  const item = caixaItens.find(i => i.id === id);
  if (!item || item.tipo !== "livro") return;
  const dados = livroLimpo(item.livro || { titulo: String(item.texto || "").split("\n")[0] });
  if (S.livros.some(l => norm(l.titulo) === norm(dados.titulo)))
    return toast("Esse livro já está na sua estante", false, "idle");
  S.livros.push(novoLivro(dados, "quero"));
  react("happy", `<b>${esc(dados.titulo)}</b> foi para Quero ler.`, 2600);
  commit();
};

/* ===================== clube do livro ===================== */
let clubes = {}, // id → clube (limpo)
  clubeAberto = null,
  pararClubes = null,
  pararClubeAberto = [],
  comentariosClube = [],
  membrosClube = {},
  criandoClube = false;

function limparClube(id, d) {
  if (!d || typeof d !== "object" || !Array.isArray(d.membros)) return null;
  return {
    id,
    nome: texto(d.nome, 40) || "Clube do livro",
    livro: livroLimpo(d.livro),
    membros: d.membros.filter(u => typeof u === "string").slice(0, CLUBE_MAX),
    dono: texto(d.dono, 128),
    criado: numero(d.criado)
  };
}
const limparComentario = (id, c) => ({
  id,
  de: texto(c && c.de, 128),
  deNome: texto(c && c.deNome, 30),
  pagina: numero(c && c.pagina, 5000),
  texto: texto(c && c.texto, 500),
  em: numero(c && c.em)
});

function iniciarClubes() {
  if (pararClubes || !modoFirebase()) return;
  pararClubes = () => {}; // marca antes de assinar: a primeira resposta pode chegar na hora e redesenhar a tela
  pararClubes = banco
    .collection("clubes")
    .where("membros", "array-contains", meuId)
    .onSnapshot(
      snap => {
        clubes = {};
        snap.docs.forEach(d => {
          const c = limparClube(d.id, d.data());
          if (c) clubes[d.id] = c;
        });
        if (clubeAberto && !clubes[clubeAberto]) fecharClube();
        softRender();
      },
      () => {}
    );
}

/** Qual livro meu é o do clube (mesmo título). */
const meuLivroDoClube = c => S.livros.find(l => norm(l.titulo) === norm(c.livro.titulo));
const minhaPaginaNoClube = c => {
  const l = meuLivroDoClube(c);
  return l ? l.pagina : 0;
};

function abrirClube(id) {
  fecharClube();
  const c = clubes[id];
  if (!c) return;
  clubeAberto = id;
  publicarProgressoClube(c);
  pararClubeAberto.push(
    banco
      .collection(`clubes/${id}/comentarios`)
      .orderBy("em", "asc")
      .limit(200)
      .onSnapshot(
        snap => {
          comentariosClube = snap.docs.map(d => limparComentario(d.id, d.data()));
          softRender();
        },
        () => {}
      ),
    banco.collection(`clubes/${id}/membros`).onSnapshot(
      snap => {
        membrosClube = {};
        snap.docs.forEach(d => {
          const m = d.data() || {};
          membrosClube[d.id] = { pagina: numero(m.pagina, 5000), nome: texto(m.nome, 30) };
        });
        softRender();
      },
      () => {}
    )
  );
}
function fecharClube() {
  pararClubeAberto.forEach(p => p && p());
  pararClubeAberto = [];
  clubeAberto = null;
  comentariosClube = [];
  membrosClube = {};
}
function publicarProgressoClube(c) {
  if (!modoFirebase() || !c) return;
  banco
    .doc(`clubes/${c.id}/membros/${meuId}`)
    .set({ pagina: minhaPaginaNoClube(c), nome: S.name || "", em: Date.now() })
    .catch(() => {});
}
// quando a página de um livro de clube muda, avisa o clube
{
  const irAntes = irParaPagina;
  irParaPagina = function (l, nova) {
    const r = irAntes(l, nova);
    if (modoFirebase())
      Object.values(clubes)
        .filter(c => norm(c.livro.titulo) === norm(l.titulo))
        .forEach(publicarProgressoClube);
    return r;
  };
}

function clubesHTML() {
  if (!modoFirebase())
    return `<div class="card"><b>Clube do livro</b><span class="note">Leia o mesmo livro com amigos e comente sem spoiler. <button class="olink" data-tab="ajustes">Entre com uma conta</button> para usar.</span></div>`;
  iniciarClubes();
  if (clubeAberto && clubes[clubeAberto]) return clubeHTML(clubes[clubeAberto]);
  const lista = Object.values(clubes).sort((a, b) => b.criado - a.criado);
  const amigos = amigosAceitos();
  const meus = S.livros.filter(l => l.estante !== "abandonado");
  const form = criandoClube
    ? `<form class="col clube-novo" data-form="clube-criar"><input id="cl-nome" maxlength="40" placeholder="Nome do clube" required autocomplete="off">
        <select id="cl-livro" aria-label="Livro do clube" required><option value="">Escolha o livro</option>${meus.map(l => `<option value="${l.id}">${esc(l.titulo)}</option>`).join("")}</select>
        <span class="label">Quem vai ler junto</span><div class="clube-amigos">${amigos.map(a => `<label class="fb-check"><input type="checkbox" class="cl-amigo" value="${esc(a.uid)}"><span>${esc(nomeDe(a.uid))}</span></label>`).join("") || `<span class="note">Adicione amigos primeiro.</span>`}</div>
        <div class="row"><button class="btn primary" type="submit">Criar clube</button><button class="btn ghost" type="button" data-act="clube-cancelar">Cancelar</button></div></form>`
    : `<button class="btn" data-act="clube-novo">Criar um clube do livro</button>`;
  return `<div class="card clubes"><b>Clubes do livro</b>
    ${lista.length ? `<ul class="list">${lista.map(c => `<li><button class="item clube-linha" data-act="clube-abrir" data-id="${esc(c.id)}">${capaHTML({ ...c.livro, id: c.id }, 34)}<div class="main"><span class="title">${esc(c.nome)}</span><span class="meta">${esc(c.livro.titulo)} · ${c.membros.length} ${c.membros.length === 1 ? "pessoa" : "pessoas"}</span></div></button></li>`).join("")}</ul>` : `<span class="note">Nenhum clube ainda. Crie um e chame amigos para ler o mesmo livro.</span>`}
    ${form}</div>`;
}

function clubeHTML(c) {
  const minha = minhaPaginaNoClube(c);
  const tenho = !!meuLivroDoClube(c);
  const pessoas = c.membros.map(uid => {
    const m = membrosClube[uid] || {};
    const nome = uid === meuId ? "Você" : m.nome || nomeDe(uid);
    const pag = uid === meuId ? minha : m.pagina || 0;
    return { uid, nome, pag };
  });
  const comentario = x => {
    const visivel = x.de === meuId || minha >= x.pagina;
    return `<li class="${visivel ? "" : "spoiler"}"><span class="meta"><b>${esc(x.de === meuId ? "Você" : x.deNome || nomeDe(x.de))}</b> · página ${x.pagina}</span>${visivel ? `<p>${esc(x.texto)}</p>` : `<p class="note">Comentário escondido para não dar spoiler. Passe da página ${x.pagina} para ler.</p>`}${x.de === meuId ? `<button class="olink" data-act="clube-apagar-com" data-id="${esc(x.id)}">Apagar</button>` : ""}</li>`;
  };
  return `<div class="card clube-aberto"><div class="row" style="justify-content:space-between"><button class="btn small ghost" data-act="clube-voltar">← Clubes</button>${c.dono === meuId ? `<button class="olink" data-act="clube-apagar" data-id="${esc(c.id)}">Apagar clube</button>` : `<button class="olink" data-act="clube-sair" data-id="${esc(c.id)}">Sair do clube</button>`}</div>
    <div class="row" style="gap:12px;align-items:flex-start">${capaHTML({ ...c.livro, id: c.id }, 56)}<div class="main"><b>${esc(c.nome)}</b><span class="meta">${esc(c.livro.titulo)}${c.livro.autor ? ` · ${esc(c.livro.autor)}` : ""}</span></div></div>
    ${tenho ? "" : `<div class="row"><span class="note">Esse livro ainda não está na sua estante.</span><button class="btn small primary" data-act="clube-pegar-livro" data-id="${esc(c.id)}">Começar a ler</button></div>`}
    <ul class="clube-progresso">${pessoas.map(p => `<li class="${p.uid === meuId ? "eu" : ""}"><span>${esc(p.nome)}</span><div class="progress"><span style="width:${c.livro.paginas ? Math.min(100, Math.round((p.pag / c.livro.paginas) * 100)) : 0}%"></span></div><small class="mono">p. ${p.pag}</small></li>`).join("")}</ul>
    <b>Comentários</b>
    ${comentariosClube.length ? `<ul class="clube-comentarios">${comentariosClube.map(comentario).join("")}</ul>` : `<span class="note">Nenhum comentário ainda. Comente sobre a parte em que você está: quem ainda não chegou lá não vê.</span>`}
    <form class="col" data-form="clube-comentar" data-id="${esc(c.id)}"><textarea id="clc-txt" maxlength="500" rows="2" placeholder="O que achou até aqui?" required></textarea><div class="row"><label class="row" style="gap:6px"><span class="note">Sobre a página</span><input id="clc-pag" type="number" min="0" max="5000" value="${minha}" style="width:80px"></label><button class="btn small primary" type="submit">Comentar</button></div></form></div>`;
}

ACOES_EXTRAS["clube-novo"] = () => {
  criandoClube = true;
  render();
};
ACOES_EXTRAS["clube-cancelar"] = () => {
  criandoClube = false;
  render();
};
ACOES_EXTRAS["clube-abrir"] = (b, id) => {
  abrirClube(id);
  render();
};
ACOES_EXTRAS["clube-voltar"] = () => {
  fecharClube();
  render();
};
FORMS_EXTRAS["clube-criar"] = async () => {
  const nome = getV("cl-nome").slice(0, 40);
  const l = livro(getV("cl-livro"));
  if (!nome || !l) return toast("Dê um nome e escolha o livro", false, "worried");
  const convidados = [...document.querySelectorAll(".cl-amigo:checked")]
    .map(i => i.value)
    .filter(ehAmigo)
    .slice(0, CLUBE_MAX - 1);
  try {
    const ref = await banco.collection("clubes").add({
      nome,
      livro: livroLimpo(l),
      membros: [meuId, ...convidados],
      dono: meuId,
      criado: Date.now()
    });
    criandoClube = false;
    convidados.forEach(uid => mandarParaCaixa(uid, "clube", `${nome} · ${l.titulo}`, { clube: ref.id }));
    react(
      "party",
      `Clube <b>${esc(nome)}</b> criado! ${convidados.length ? "Avisei quem você chamou." : ""}`,
      3200
    );
    render();
  } catch (e) {
    toast("Não consegui criar o clube. As regras do Firebase estão atualizadas?", false, "worried");
  }
};
FORMS_EXTRAS["clube-comentar"] = async f => {
  const c = clubes[f.dataset.id];
  const txt = getV("clc-txt").slice(0, 500);
  if (!c || !txt) return;
  const pagina = Math.max(0, Math.min(5000, Math.round(+getV("clc-pag") || 0)));
  try {
    await banco
      .collection(`clubes/${c.id}/comentarios`)
      .add({ de: meuId, deNome: S.name || "", pagina, texto: txt, em: Date.now() });
    const campo = document.getElementById("clc-txt");
    if (campo) campo.value = "";
  } catch (e) {
    toast("Não consegui comentar agora", false, "worried");
  }
};
ACOES_EXTRAS["clube-apagar-com"] = (b, id) => {
  if (!clubeAberto) return;
  banco
    .doc(`clubes/${clubeAberto}/comentarios/${id}`)
    .delete()
    .catch(() => {});
};
ACOES_EXTRAS["clube-pegar-livro"] = (b, id) => {
  const c = clubes[id];
  if (!c || meuLivroDoClube(c)) return;
  S.livros.push(novoLivro(c.livro, "lendo"));
  commit();
  publicarProgressoClube(c);
};
ACOES_EXTRAS["clube-sair"] = async (b, id) => {
  const c = clubes[id];
  if (!c) return;
  if (!b.dataset.certeza) {
    b.dataset.certeza = "1";
    b.textContent = "Toque de novo para sair";
    return;
  }
  try {
    await banco
      .doc(`clubes/${id}/membros/${meuId}`)
      .delete()
      .catch(() => {});
    await banco.doc(`clubes/${id}`).update({ membros: c.membros.filter(u => u !== meuId) });
    fecharClube();
    render();
  } catch (e) {
    toast("Não consegui sair agora", false, "worried");
  }
};
ACOES_EXTRAS["clube-apagar"] = async (b, id) => {
  const c = clubes[id];
  if (!c || c.dono !== meuId) return;
  if (!b.dataset.certeza) {
    b.dataset.certeza = "1";
    b.textContent = "Toque de novo para apagar o clube";
    return;
  }
  try {
    await banco.doc(`clubes/${id}`).delete();
    fecharClube();
    render();
  } catch (e) {
    toast("Não consegui apagar agora", false, "worried");
  }
};

/** Ao apagar a conta: sai de todos os clubes (e apaga os que são seus). */
{
  const apagarAntes = apagarConta;
  apagarConta = async function () {
    if (modoFirebase())
      for (const c of Object.values(clubes))
        await (
          c.dono === meuId
            ? banco.doc(`clubes/${c.id}`).delete()
            : banco.doc(`clubes/${c.id}`).update({ membros: c.membros.filter(u => u !== meuId) })
        ).catch(() => {});
    return apagarAntes();
  };
}

/* ===================== aba Juntos ===================== */
function juntosHTML() {
  return `${duplaHTML()}${corridaHTML()}${clubesHTML()}${emprestadosHTML()}
    ${!modoFirebase() && !emprestados().length ? `<span class="note">Empréstimos funcionam sem conta: abra um livro e toque em "Emprestar este livro".</span>` : ""}`;
}
ACOES_EXTRAS["ir-juntos"] = () => {
  tab = "estante";
  estanteTab = "juntos";
  render();
};
