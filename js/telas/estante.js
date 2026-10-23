/*
  Aba Estante (leitura estilo Skoob). Partes da tela:
  - Estante: o desenho do móvel com os livros lidos, o Prumi lendo e os livros em andamento.
  - Adicionar: busca por título, autor ou ISBN, código de barras e cadastro à mão.
  - Livros: as prateleiras (Lendo, Quero ler, Lidos...). Tocar num livro abre os detalhes.
  - Metas: desafio do ano e números da leitura.
  - Decorar: móveis, fundos e enfeites comprados com páginas.
  A lógica fica em js/leitura.js e os enfeites em js/estante-enfeites.js.
*/
"use strict";

let estanteTab = "estante",
  prateleiraSel = "lendo",
  livroAberto = null;

/* ---------- cores e capas ---------- */
const CORES_LOMBADA = [
  "#7A0F24",
  "#2F4F8F",
  "#1C8350",
  "#5B2E7A",
  "#A9670E",
  "#2B2B33",
  "#C8102E",
  "#0E7C86",
  "#AE2C76",
  "#6B4A30"
];
const corDoLivro = l =>
  CORES_LOMBADA.at([...l.id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 3) % CORES_LOMBADA.length);

/** Capa do livro: a imagem da busca ou uma capa desenhada com o título. */
function capaHTML(l, tam = 56) {
  const alt = Math.round(tam * 1.5);
  if (l.capa && /^https:\/\//.test(l.capa))
    return `<img class="capa" src="${esc(l.capa)}" alt="" width="${tam}" height="${alt}" loading="lazy" referrerpolicy="no-referrer">`;
  return capaDesenhada(l, corDoLivro(l)).replace("<svg ", `<svg width="${tam}" height="${alt}" `); // js/capas.js
}

const iconeNota = () => textoMundo("notaIcone", "★");
const notaHTML = (l, interativa) =>
  `<span class="nota" role="group" aria-label="Nota">${[1, 2, 3, 4, 5]
    .map(n =>
      interativa
        ? `<button data-act="livro-nota" data-id="${l.id}" data-n="${n}" aria-pressed="${l.nota >= n}" aria-label="Nota ${n}">${iconeNota()}</button>`
        : `<i class="${l.nota >= n ? "on" : ""}">${iconeNota()}</i>`
    )
    .join("")}</span>`;

const progressoDe = l => (l.paginas ? Math.round((l.pagina / l.paginas) * 100) : 0);

/* ---------- desenho da estante ---------- */
/** Dados da minha estante. Para a estante de um amigo, a vitrine dele manda os mesmos campos. */
const minhaEstante = () => ({
  lidos: livrosEm("lido"),
  lendo: [...livrosEm("lendo"), ...livrosEm("relendo")],
  decor: S.leitura.decor,
  equip: S.equip,
  persona: S.persona,
  meu: true
});

function estanteSVG(d = minhaEstante(), opcoes = {}) {
  const decor = d.decor || { movel: "clara", fundo: "liso", enfeites: [] };
  const doMundoDele = x => !x.mundo || x.mundo === d.persona;
  const movel = MOVEIS.find(m => m.id === decor.movel && doMundoDele(m)) || MOVEIS[0];
  const fundo = FUNDOS.find(f => f.id === decor.fundo && doMundoDele(f)) || FUNDOS[0];
  const W = 360,
    x0 = 30,
    x1 = 330,
    topo = opcoes.semPrumi ? 50 : 120, // altura da parte de cima (Prumi e livros deitados)
    alturaFileira = 82;
  // o que vai nas prateleiras: livros lidos (lombadas) e depois os enfeites colocados
  const pecas = [
    ...d.lidos.map(l => ({
      tipo: "livro",
      l,
      w: Math.max(10, Math.min(22, 7 + (l.paginas || 200) / 45)),
      h: Math.min(68, 44 + (l.paginas || 200) / 28)
    })),
    ...decor.enfeites
      .map(id => ENFEITE[id])
      .filter(e => e && doMundoDele(e) && (!d.meu || temDecor(e)))
      .map(e => ({ tipo: "enfeite", e, w: e.w + 6 }))
  ];
  // distribui as peças nas fileiras, da esquerda para a direita
  const fileiras = [[]];
  let usado = 0;
  for (const p of pecas) {
    if (usado + p.w > x1 - x0 - 12) {
      fileiras.push([]);
      usado = 0;
    }
    fileiras.at(-1).push(p);
    usado += p.w + 1;
  }
  if (fileiras.length < 2) fileiras.push([]); // sempre pelo menos 2 prateleiras
  const H = topo + fileiras.length * alturaFileira + 30;
  const base = i => topo + (i + 1) * alturaFileira; // y da tábua de cada fileira

  let miolo = "";
  fileiras.forEach((fila, i) => {
    let x = x0 + 8;
    fila.forEach(p => {
      if (p.tipo === "livro") {
        const l = p.l,
          y = base(i);
        miolo += `<g class="lombada" ${d.meu ? `data-act="livro-abrir" data-id="${l.id}"` : ""}><title>${esc(l.titulo)}</title><rect x="${x.toFixed(1)}" y="${(y - p.h).toFixed(1)}" width="${p.w.toFixed(1)}" height="${p.h.toFixed(1)}" rx="1.5" fill="${corDoLivro(l)}" stroke="rgba(0,0,0,.35)"/><path d="M${(x + 2).toFixed(1)} ${(y - p.h + 6).toFixed(1)}h${(p.w - 4).toFixed(1)}M${(x + 2).toFixed(1)} ${(y - 6).toFixed(1)}h${(p.w - 4).toFixed(1)}" stroke="rgba(255,255,255,.45)"/>${p.w >= 12 ? `<text transform="translate(${(x + p.w / 2 + 2.2).toFixed(1)} ${(y - 10).toFixed(1)}) rotate(-90)" font-size="6.6" fill="#fff" font-family='${estiloCapa(l).fonte}'>${esc(l.titulo.slice(0, Math.floor(p.h / 4.2)))}</text>` : ""}</g>`;
      } else {
        miolo += `<g transform="translate(${(x + p.w / 2).toFixed(1)} ${base(i)})">${p.e.svg()}</g>`;
      }
      x += p.w + 1;
    });
  });

  // móvel: laterais, tábuas e a tampa de cima
  const tabuas = fileiras
    .map(
      (_, i) =>
        `<rect x="${x0}" y="${base(i)}" width="${x1 - x0}" height="8" fill="${movel.cor}" stroke="${movel.borda}"/>${movel.caixote ? `<path d="M${x0} ${base(i) - alturaFileira + 8}H${x1}" stroke="${movel.borda}" stroke-dasharray="3 3"/>` : ""}`
    )
    .join("");
  const corpo = `<rect x="${x0 - 10}" y="${topo}" width="${x1 - x0 + 20}" height="${H - topo - 18}" fill="${movel.fundo}" stroke="${movel.borda}" stroke-width="1.5"/><rect x="${x0}" y="${topo + 8}" width="${x1 - x0}" height="${H - topo - 34}" fill="rgba(0,0,0,.18)"/>${tabuas}<rect x="${x0 - 14}" y="${topo - 4}" width="${x1 - x0 + 28}" height="10" rx="2" fill="${movel.cor}" stroke="${movel.borda}"/><rect x="${x0 - 6}" y="${H - 18}" width="12" height="12" fill="${movel.borda}"/><rect x="${x1 - 6}" y="${H - 18}" width="12" height="12" fill="${movel.borda}"/>${movel.gotico ? `<path d="M${x0 - 14} ${topo - 4}L${W / 2} ${topo - 26}L${x1 + 14} ${topo - 4}" fill="${movel.fundo}" stroke="${movel.borda}" stroke-width="1.5"/>` : ""}`;

  // em cima: livros que você está lendo, deitados, e o Prumi lendo
  const lendo = d.lendo.slice(0, 4);
  const pilha = lendo
    .map(
      (l, k) =>
        `<g ${d.meu ? `data-act="livro-abrir" data-id="${l.id}"` : ""} class="lombada"><title>${esc(l.titulo)}${l.paginas ? ` · ${progressoDe(l)}%` : ""}</title><rect x="${x0 + 6 + k * 2}" y="${topo - 14 - k * 9}" width="${70 - k * 4}" height="9" rx="1.5" fill="${corDoLivro(l)}" stroke="rgba(0,0,0,.35)"/><path d="M${x0 + 40 + k * 2} ${topo - 5 - k * 9}v8l3 -2.4 3 2.4v-8" fill="#C8102E"/></g>`
    )
    .join("");
  const humor = d.meu ? calcularHumor().nivel.rosto : "happy";
  const leitor = prumi({
    mood: ["sad", "cry", "upset"].includes(humor) ? "sad" : lendo.length ? "focus" : "happy",
    size: 84,
    eq: d.equip || {},
    p: d.persona
  }).replace("<svg ", `<svg x="${W / 2 + 34}" y="${topo - 110}" `);
  const livroNaMao = lendo.length
    ? `<path d="M${W / 2 + 58} ${topo - 34}l18 -4 18 4v14l-18 -4 -18 4z" fill="#FBF7EC" stroke="var(--ink)" stroke-width="1.2"/><path d="M${W / 2 + 76} ${topo - 38}v14" stroke="var(--ink)"/>`
    : "";

  return `<svg class="estante-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Estante com ${d.lidos.length} livros lidos">
    ${opcoes.semParede ? "" : `<g class="parede">${fundo.svg(W, H)}</g>`}${corpo}${miolo}${pilha}
    ${opcoes.semPrumi ? "" : `<g class="prumi-leitor" ${d.meu ? 'data-act="prumi-leitor"' : ""}>${leitor}${livroNaMao}</g>`}
  </svg>`;
}

/* ---------- partes da tela ---------- */
function cartaoLendoHTML(l) {
  return `<li class="livro-cartao"><button class="livro-capa" data-act="livro-abrir" data-id="${l.id}" aria-label="Abrir ${esc(l.titulo)}">${capaHTML(l, 52)}</button>
    <div class="main"><span class="title">${esc(l.titulo)}</span><span class="meta">${esc(l.autor || "Autor desconhecido")}</span>
      <div class="progress"><span style="width:${progressoDe(l)}%"></span></div>
      <span class="meta mono">${l.pagina}${l.paginas ? ` de ${l.paginas} páginas · ${progressoDe(l)}%` : " páginas"}</span>
      ${typeof previsaoHTML === "function" ? previsaoHTML(l) : ""}
      <div class="row" style="gap:6px"><button class="btn small primary" data-act="livro-timer" data-id="${l.id}">Ler agora</button><button class="btn small" data-act="livro-mais" data-id="${l.id}" data-n="10">+10</button><button class="btn small" data-act="livro-mais" data-id="${l.id}" data-n="25">+25</button><button class="btn small ghost" data-act="livro-abrir" data-id="${l.id}">Detalhes</button></div>
    </div></li>`;
}

function detalheLivroHTML(l) {
  return `<div class="card livro-detalhe">
    <div class="row" style="align-items:flex-start;gap:12px">${capaHTML(l, 72)}
      <div class="main" style="flex:1;min-width:0"><span class="title"><b>${esc(l.titulo)}</b></span><span class="meta">${esc(l.autor || "Autor desconhecido")}${l.ano ? ` · ${l.ano}` : ""}${l.paginas ? ` · ${l.paginas} páginas` : ""}</span>
      ${notaHTML(l, true)}
      <button class="btn small ghost" data-act="livro-fav" data-id="${l.id}" aria-pressed="${l.fav}">${l.fav ? "Favorito" : "Marcar como favorito"}</button></div></div>
    <div class="chips" role="group" aria-label="Prateleira">${Object.entries(ESTANTES)
      .map(
        ([k, n]) =>
          `<button class="chipbtn" data-act="livro-estante" data-id="${l.id}" data-e="${k}" aria-pressed="${l.estante === k}">${n}</button>`
      )
      .join("")}</div>
    ${typeof generosHTML === "function" ? generosHTML(l) : ""}
    ${typeof materiaLivroHTML === "function" ? materiaLivroHTML(l) : ""}
    ${
      l.estante !== "quero"
        ? `<form class="row" data-form="livro-pagina" data-id="${l.id}"><label class="note" for="lp-${l.id}">Estou na página</label><input id="lp-${l.id}" type="number" min="0" max="${l.paginas || 5000}" value="${l.pagina}" style="width:90px"><button class="btn small primary" type="submit">Salvar</button></form>
           <form class="row" data-form="livro-total" data-id="${l.id}"><label class="note" for="lt-${l.id}">Total de páginas</label><input id="lt-${l.id}" type="number" min="1" max="5000" value="${l.paginas || ""}" style="width:90px"><button class="btn small" type="submit">Ok</button></form>`
        : ""
    }
    <form class="col" data-form="livro-resenha" data-id="${l.id}"><label class="note" for="lr-${l.id}">Resenha${l.pago.resenha ? "" : " (ganha 20 páginas)"}</label><textarea id="lr-${l.id}" maxlength="1200" placeholder="O que achou? Sem spoiler, por favor.">${esc(l.resenha)}</textarea><div><button class="btn small" type="submit">Salvar resenha</button></div></form>
    <div class="col"><span class="note">Citações favoritas</span>
      ${l.citacoes.length ? `<ul class="citacoes">${l.citacoes.map((c, i) => `<li><q>${esc(c.texto)}</q>${c.pagina ? ` <span class="note">p. ${c.pagina}</span>` : ""}<button class="icon" data-act="livro-cit-del" data-id="${l.id}" data-i="${i}" aria-label="Apagar citação">${ICON.trash}</button></li>`).join("")}</ul>` : ""}
      <form class="row" data-form="livro-citacao" data-id="${l.id}"><input id="lc-${l.id}" type="text" maxlength="400" placeholder="Um trecho que marcou" style="flex:1" required><input id="lcp-${l.id}" type="number" min="1" placeholder="pág." style="width:72px"><button class="btn small" type="submit">Guardar</button></form>
    </div>
    <span class="note">${l.inicio ? `Começou em ${fmtShort(l.inicio)}` : ""}${l.fim ? ` · terminou em ${fmtShort(l.fim)} (${Math.max(1, diffDays(l.inicio || l.fim, l.fim) + 1)} dias)` : ""}</span>
    <div class="row"><button class="btn small ghost" data-act="livro-abrir" data-id="${l.id}">Fechar</button><button class="btn small ghost danger" data-act="livro-del" data-id="${l.id}">Tirar da estante</button></div>
  ${typeof fichasHTML === "function" ? fichasHTML(l) : ""}</div>`;
}

function adicionarHTML() {
  const r = busca.resultados;
  return `<form class="add" data-form="livro-busca"><input id="lb-q" class="grow" type="search" placeholder="Título, autor ou ISBN" value="${esc(busca.q)}" autocomplete="off" required><button class="btn primary" type="submit">Buscar</button></form>
  <div class="row"><button class="btn small" data-act="ler-codigo">Ler código de barras</button><span class="note">O ISBN são os números embaixo do código de barras.</span></div>
  ${busca.status === "buscando" ? `<div class="empty">Procurando nas bibliotecas...</div>` : ""}
  ${busca.status === "erro" ? `<div class="empty">Não consegui buscar agora (sem internet?). Dá pra cadastrar à mão aqui embaixo.</div>` : ""}
  ${busca.status === "ok" && !r.length ? `<div class="empty">Nada encontrado para "${esc(busca.q)}". Tenta outro nome ou cadastra à mão.</div>` : ""}
  ${
    r.length
      ? `<ul class="list resultados">${r
          .map(
            (x, i) =>
              `<li><div class="item">${capaHTML({ ...x, id: "r" + i, autor: x.autor || "" }, 44)}<div class="main"><span class="title">${esc(x.titulo)}</span><span class="meta">${esc(x.autor || "Autor desconhecido")}${x.ano ? ` · ${x.ano}` : ""}${x.paginas ? ` · ${x.paginas} p.` : ""}</span>
          <div class="row" style="gap:6px"><button class="btn small primary" data-act="livro-add" data-i="${i}" data-e="lendo">Lendo</button><button class="btn small" data-act="livro-add" data-i="${i}" data-e="quero">Quero ler</button><button class="btn small" data-act="livro-add" data-i="${i}" data-e="lido">Já li</button></div></div></div></li>`
          )
          .join("")}</ul><span class="note">Dados da Open Library e do Google Books.</span>`
      : ""
  }
  <details class="more"><summary>Cadastrar à mão</summary>
    <form class="col" data-form="livro-manual">
      <input id="lm-titulo" type="text" maxlength="160" placeholder="Título" required>
      <input id="lm-autor" type="text" maxlength="120" placeholder="Autor">
      <div class="row"><input id="lm-paginas" type="number" min="1" max="5000" placeholder="Páginas" style="width:110px"><select id="lm-estante" aria-label="Prateleira">${Object.entries(
        ESTANTES
      )
        .map(([k, n]) => `<option value="${k}">${n}</option>`)
        .join("")}</select><button class="btn primary" type="submit">Adicionar</button></div>
    </form>
  </details>`;
}

function prateleirasHTML() {
  const lista = livrosEm(prateleiraSel).sort((a, b) =>
    (b.fim || b.inicio || "").localeCompare(a.fim || a.inicio || "")
  );
  return `<div class="chips" role="group" aria-label="Prateleira">${Object.entries(ESTANTES)
    .map(
      ([k, n]) =>
        `<button class="chipbtn" data-act="prateleira" data-e="${k}" aria-pressed="${prateleiraSel === k}">${n} <span class="count">${livrosEm(k).length}</span></button>`
    )
    .join("")}</div>
  ${
    lista.length
      ? `<ul class="list livros">${lista
          .map(
            l =>
              `<li><button class="item livro-linha" data-act="livro-abrir" data-id="${l.id}">${capaHTML(l, 40)}<span class="main"><span class="title">${l.fav ? "♥ " : ""}${esc(l.titulo)}</span><span class="meta">${esc(l.autor || "Autor desconhecido")}</span>${l.estante === "lido" ? notaHTML(l, false) : l.estante === "lendo" || l.estante === "relendo" ? `<span class="meta mono">${progressoDe(l)}%</span>` : ""}</span></button></li>${livroAberto === l.id ? `<li class="aberto">${detalheLivroHTML(l)}</li>` : ""}`
          )
          .join("")}</ul>`
      : `<div class="empty">${prateleiraSel === "quero" ? "Nenhum livro na fila. Busque um em Adicionar." : "Nada nesta prateleira ainda."}</div>`
  }`;
}

function metasHTML() {
  const ano = today().slice(0, 4),
    meta = S.leitura.metas[ano] || 0,
    lidos = lidosNoAno(ano).length;
  const mesesRestantes = 12 - new Date().getMonth();
  const semana = paginasSemana(),
    maxSemana = Math.max(1, ...semana.map(s => s.n));
  const autor = autorMaisLido();
  return `<div class="card">
    <span class="label">Desafio de ${ano}</span>
    ${
      meta
        ? `<span><b class="mono" style="font-size:22px">${lidos}</b> de ${meta} livros</span><div class="progress"><span style="width:${Math.min(100, Math.round((lidos / meta) * 100))}%"></span></div><span class="note">${lidos >= meta ? "Desafio batido! Agora é bônus." : `Faltam ${meta - lidos}. No ritmo certo: ${Math.ceil((meta - lidos) / mesesRestantes)} por mês até dezembro.`}</span>`
        : `<span class="note">Quantos livros você quer ler este ano?</span>`
    }
    <form class="row" data-form="meta-ano"><input id="meta-ano" type="number" min="1" max="365" value="${meta || ""}" placeholder="Ex.: 24" style="width:90px"><button class="btn small" type="submit">${meta ? "Mudar meta" : "Definir meta"}</button></form>
  </div>
  <div class="card"><span class="label">Páginas nos últimos 7 dias</span>
    <div class="barrinhas">${semana.map(s => `<span title="${fmtShort(s.d)}: ${s.n} páginas"><i style="height:${Math.round((s.n / maxSemana) * 100)}%"></i><small>${DIAS_CURTO[wIdx(s.d)]}</small></span>`).join("")}</div>
    <span class="note">${semana.reduce((a, b) => a + b.n, 0)} páginas na semana · sequência de ${sequenciaLeitura()} ${sequenciaLeitura() === 1 ? "dia" : "dias"} lendo</span>
  </div>
  <div class="stats"><span>Lidos <b>${livrosEm("lido").length}</b></span><span>Páginas lidas <b>${S.leitura.total.toLocaleString("pt-BR")}</b></span><span>Maior dia <b>${maiorDia()}</b></span>${autor ? `<span>Autor mais lido <b>${esc(autor.autor)}</b> (${autor.n})</span>` : ""}</div>`;
}

function decorarHTML() {
  const d = S.leitura.decor;
  const preco = x =>
    x.ach
      ? `<span class="tag lock">${ICON.lock} Lendário</span>`
      : `<span class="tag price ${S.leitura.saldo < x.preco ? "short" : ""}">${x.preco} p.</span>`;
  const botao = (x, tipo, ativo) => {
    const tem = temDecor(x);
    return `<button class="sitem ${ativo ? "on" : tem ? "own" : x.ach ? "lock" : "buy"}" data-act="decor" data-tipo="${tipo}" data-id="${x.id}"><span class="sname">${esc(x.nome)}</span>${ativo ? `<span class="tag on">${tipo === "enfeite" ? "Na estante" : "Usando"}</span>` : tem ? `<span class="tag">${tipo === "enfeite" ? "Colocar" : "Usar"}</span>` : preco(x)}</button>`;
  };
  const miniEnfeite = e =>
    `<svg viewBox="-20 -40 40 44" width="44" height="48" aria-hidden="true">${e.svg()}</svg>`;
  return `<span class="note">Você tem <b>${S.leitura.saldo}</b> páginas para gastar. Cada página lida vale 1; terminar um livro dá 50; uma resenha dá 20.</span>
  <h3 class="h3">Estante</h3><div class="shop pal">${MOVEIS.filter(doMundo)
    .map(m =>
      botao(m, "movel", d.movel === m.id).replace(
        '<span class="sname">',
        `<span class="swatch" style="background:${m.cor};border:3px solid ${m.borda}"></span><span class="sname">`
      )
    )
    .join("")}</div>
  <h3 class="h3">Parede</h3><div class="shop pal">${FUNDOS.filter(doMundo)
    .map(f =>
      botao(f, "fundo", d.fundo === f.id).replace(
        '<span class="sname">',
        `<svg class="swatch" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice">${f.svg(60, 40)}</svg><span class="sname">`
      )
    )
    .join("")}</div>
  <h3 class="h3">Posições no quarto</h3>
  <div class="card" style="display:flex;flex-direction:column;gap:10px;margin-bottom:12px">
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
      <span class="label" style="font-size:13px">Colar pôster em:</span>
      <div class="seg" role="group">
        <button class="${(d.quarto?.posPoster || "centro") === "esquerda" ? "on" : ""}" data-act="quarto-pos" data-campo="posPoster" data-val="esquerda">Esquerda</button>
        <button class="${(d.quarto?.posPoster || "centro") === "centro" ? "on" : ""}" data-act="quarto-pos" data-campo="posPoster" data-val="centro">Centro</button>
        <button class="${(d.quarto?.posPoster || "centro") === "direita" ? "on" : ""}" data-act="quarto-pos" data-campo="posPoster" data-val="direita">Direita</button>
      </div>
    </div>
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
      <span class="label" style="font-size:13px">Onde fica o bichinho:</span>
      <div class="seg" role="group">
        <button class="${(d.quarto?.posPet || "cama") === "cama" ? "on" : ""}" data-act="quarto-pos" data-campo="posPet" data-val="cama">Na cama</button>
        <button class="${(d.quarto?.posPet || "cama") === "tapete" ? "on" : ""}" data-act="quarto-pos" data-campo="posPet" data-val="tapete">No tapete</button>
        <button class="${(d.quarto?.posPet || "cama") === "chao" ? "on" : ""}" data-act="quarto-pos" data-campo="posPet" data-val="chao">Perto da estante</button>
      </div>
    </div>
  </div>
  ${Object.entries(LUGARES_QUARTO)
    .map(([slot, lugar]) => {
      const atual = (d.quarto || {})[slot] ?? QUARTO_PADRAO[slot];
      const prev = i =>
        slot === "chao"
          ? `<svg class="swatch" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice">${i.svg(60, 40)}</svg>`
          : `<svg class="prev-quarto" viewBox="-4 -4 ${lugar.w + 8} ${lugar.h + 8}" aria-hidden="true">${i.svg()}</svg>`;
      const itens = QUARTO.filter(i => i.slot === slot && doMundo(i));
      const nenhum = ["poster", "tapete", "pet"].includes(slot)
        ? `<button class="sitem ${!atual ? "on" : "own"}" data-act="quarto" data-slot="${slot}" data-id=""><span class="sname">Nenhum</span><span class="tag ${!atual ? "on" : ""}">${!atual ? "Usando" : "Usar"}</span></button>`
        : "";
      return `<h3 class="h3">${lugar.nome}</h3><div class="shop">${nenhum}${itens
        .map(i =>
          botao(i, "quarto", atual === i.id)
            .replace('data-act="decor" data-tipo="quarto"', `data-act="quarto" data-slot="${slot}"`)
            .replace('<span class="sname">', `${prev(i)}<span class="sname">`)
        )
        .join("")}</div>`;
    })
    .join("")}
  <h3 class="h3">Enfeites da estante</h3><div class="shop">${ENFEITES.filter(
    e => doMundo(e) && (!e.premio || temDecor(e))
  )
    .map(e =>
      botao(e, "enfeite", d.enfeites.includes(e.id)).replace(
        '<span class="sname">',
        `${miniEnfeite(e)}<span class="sname">`
      )
    )
    .join("")}</div>
  <span class="note">Enfeites de um mundo só aparecem nele. Tocar num enfeite que já está na estante tira ele de lá.</span>`;
}

/* ---------- a tela ---------- */
function viewEstante() {
  const lendo = [...livrosEm("lendo"), ...livrosEm("relendo")];
  const aberto = livroAberto && livro(livroAberto);
  let corpo = "";
  if (estanteTab === "estante") {
    corpo = `${typeof sessaoHTML === "function" ? sessaoHTML() : ""}<div class="estante-quadro">${casaSVG()}</div>${casaEscolhaHTML()}
      ${aberto && estanteTab === "estante" ? detalheLivroHTML(aberto) : ""}
      <h2 class="h2">Lendo agora <span class="count">${lendo.length}</span></h2>
      ${lendo.length ? `<ul class="list">${lendo.map(cartaoLendoHTML).join("")}</ul>` : `<div class="empty">${textoMundo("vazioLeitura", "Nenhum livro aberto.")} <button class="btn small primary" data-act="estante-tab" data-t="adicionar">Adicionar um livro</button></div>`}`;
  } else if (estanteTab === "adicionar") corpo = adicionarHTML();
  else if (estanteTab === "livros") corpo = prateleirasHTML();
  else if (estanteTab === "metas")
    corpo =
      (typeof metaAjustesHTML === "function" ? metaAjustesHTML() : "") +
      (typeof recompensasHTML === "function" ? recompensasHTML() : "") +
      metasHTML();
  else corpo = decorarHTML();
  return `
  <section class="block"><h1 class="h1">Estante<small>${livrosEm("lido").length} lidos · ${lendo.length} lendo · ${S.leitura.saldo} páginas para decorar</small></h1>
    <div class="seg wide" role="group">${[
      ["estante", "Estante"],
      ["adicionar", "Adicionar"],
      ["livros", "Livros"],
      ["metas", "Metas"],
      ["decorar", "Decorar"]
    ]
      .map(
        ([k, l]) =>
          `<button data-act="estante-tab" data-t="${k}" aria-pressed="${estanteTab === k}">${l}</button>`
      )
      .join("")}</div>
  </section>
  <section class="block">${corpo}</section>`;
}

/* ---------- botões ---------- */
ACOES_EXTRAS["estante-tab"] = b => {
  estanteTab = b.dataset.t;
  livroAberto = null;
  render();
};
ACOES_EXTRAS.prateleira = b => {
  prateleiraSel = b.dataset.e;
  livroAberto = null;
  render();
};
ACOES_EXTRAS["livro-abrir"] = (b, id) => {
  livroAberto = livroAberto === id ? null : id;
  const l = livro(id);
  if (livroAberto && l && estanteTab === "livros") prateleiraSel = l.estante;
  render();
  if (livroAberto)
    setTimeout(
      () =>
        document
          .querySelector(".livro-detalhe")
          ?.scrollIntoView({ block: "nearest", behavior: RM ? "auto" : "smooth" }),
      50
    );
};
ACOES_EXTRAS["livro-add"] = b => {
  const x = busca.resultados[+b.dataset.i];
  if (!x) return;
  const repetido = S.livros.find(
    l => norm(l.titulo) === norm(x.titulo) && norm(l.autor) === norm(x.autor || "")
  );
  if (repetido) return toast(`Esse já está na estante (${ESTANTES[repetido.estante]})`, false, "worried");
  const l = novoLivro(x, b.dataset.e);
  S.livros.unshift(l);
  commit();
  toast(`${l.titulo}: ${ESTANTES[l.estante]}`, false, "happy");
};
ACOES_EXTRAS["livro-mais"] = (b, id) => {
  const l = livro(id);
  if (!l) return;
  const ganho = irParaPagina(l, l.pagina + +b.dataset.n);
  commit();
  if (ganho && l.estante !== "lido")
    react("happy", `Página ${l.pagina}! <b>+${ganho} páginas</b> pra decorar a estante.`, 2200);
};
ACOES_EXTRAS["livro-estante"] = (b, id) => {
  const l = livro(id);
  if (!l) return;
  const e = b.dataset.e;
  if (e === "lido") terminarLivro(l);
  else {
    if (e === "relendo") {
      l.pagina = 0;
      l.contadas = 0; // reler conta as páginas de novo
      l.inicio = today();
    }
    if (e === "lendo" && !l.inicio) l.inicio = today();
    l.estante = e;
  }
  commit();
};
ACOES_EXTRAS["livro-nota"] = (b, id) => {
  const l = livro(id);
  if (!l) return;
  l.nota = l.nota === +b.dataset.n ? 0 : +b.dataset.n;
  commit();
};
ACOES_EXTRAS["livro-fav"] = (b, id) => {
  const l = livro(id);
  if (l) l.fav = !l.fav;
  commit();
};
ACOES_EXTRAS["livro-cit-del"] = (b, id) => {
  const l = livro(id);
  if (l) l.citacoes.splice(+b.dataset.i, 1);
  commit();
};
ACOES_EXTRAS["livro-del"] = (b, id) => {
  snapUndo();
  S.livros = S.livros.filter(l => l.id !== id);
  livroAberto = null;
  commit();
  toast("Livro tirado da estante", true);
};
ACOES_EXTRAS["ler-codigo"] = () => lerCodigoDeBarras();
ACOES_EXTRAS["prumi-leitor"] = () => {
  const l = [...livrosEm("lendo"), ...livrosEm("relendo")][0];
  react(
    "happy",
    l
      ? `Tô lendo <b>${esc(l.titulo)}</b> com você: ${progressoDe(l)}% até agora. Hoje foram ${paginasHoje()} páginas.`
      : "Me dá um livro? Fico aqui esperando na estante.",
    3200
  );
  toast(l ? `${l.titulo}: ${progressoDe(l)}%` : "Adicione um livro pra eu ler junto", false, "happy");
};
// comprar ou usar uma parte do quarto (chão, janela, pôster, cama, tapete, luz, pet)
ACOES_EXTRAS.quarto = b => {
  const slot = b.dataset.slot,
    id = b.dataset.id;
  const d = S.leitura.decor;
  d.quarto = { ...QUARTO_PADRAO, ...(d.quarto || {}) };
  if (!id) {
    d.quarto[slot] = ""; // pôster, tapete e pet podem ficar vazios
    return commit();
  }
  const x = ITEM_QUARTO[id];
  if (!x) return;
  if (!temDecor(x)) {
    if (x.ach)
      return toast(`Lendário: libera com a conquista ${ACH[x.ach] ? ACH[x.ach].name : ""}`, false, "worried");
    if (S.leitura.saldo < x.preco)
      return toast(`Faltam ${x.preco - S.leitura.saldo} páginas. Bora ler!`, false, "worried");
    S.leitura.saldo -= x.preco;
    S.leitura.comprados.push(x.id);
    toast(`${x.nome} é seu!`, false, "party");
  }
  d.quarto[slot] = x.id;
  commit();
};

// "Ler agora" abre a sessão de leitura (js/leitura-dia.js)

ACOES_EXTRAS["pet-tocar"] = () => {
  const decor = (S.leitura && S.leitura.decor && S.leitura.decor.quarto) || {};
  const pId = decor.pet;
  const pet = ITEM_QUARTO[pId];
  if (!pet) return;
  const falas = {
    q_pet_gato_preto: "O gatinho preto deu uma espreguiçada e ronronou baixinho: mrrr...",
    q_pet_gato_laranja: "O gatinho laranja miou todo animado e esfregou a cabeça em você!",
    q_pet_cachorro: "O cãozinho caramelo abanou o rabinho e te deu uma lambidinha carinhosa!",
    q_pet_morcego: "O morceguinho bateu as asinhas de alegria!",
    q_pet_planta: "Você borrifou uma aguinha na monstera. Folhas bem hidratadas!",
    q_pet_hamster: "O hamster deu duas voltas na rodinha e pegou uma semente!",
    q_pet_calopsita: "A calopsita assobiou uma musiquinha feliz e abaixou a crista pra carinho!",
    q_pet_coelho: "O coelhinho mexeu o narizinho rápido e encostou a patinha em você!",
    q_pet_aquario: "O peixinho dourado nadou até a borda e soltou três bolhinhas!",
    q_pet_raposa: "A raposinha aconchegou o focinho no rabo felpudo e dormiu quentinha!"
  };
  const msg = falas[pet.id] || `Você fez um carinho no seu ${esc(pet.nome.toLowerCase())}!`;
  react("happy", msg, 3200);
  toast(msg, false, "happy");
};

ACOES_EXTRAS["quarto-pos"] = b => {
  const campo = b.dataset.campo;
  const val = b.dataset.val;
  const d = S.leitura.decor;
  d.quarto = { ...QUARTO_PADRAO, ...(d.quarto || {}) };
  d.quarto[campo] = val;
  commit();
  toast("Posição atualizada!", true);
};
// comprar ou usar móvel, parede e enfeite
ACOES_EXTRAS.decor = b => {
  const tipo = b.dataset.tipo,
    id = b.dataset.id;
  const lista = tipo === "movel" ? MOVEIS : tipo === "fundo" ? FUNDOS : ENFEITES;
  const x = lista.find(i => i.id === id);
  if (!x) return;
  const d = S.leitura.decor;
  if (!temDecor(x)) {
    if (x.ach)
      return toast(`Lendário: libera com a conquista ${ACH[x.ach] ? ACH[x.ach].name : ""}`, false, "worried");
    if (S.leitura.saldo < x.preco)
      return toast(`Faltam ${x.preco - S.leitura.saldo} páginas. Bora ler!`, false, "worried");
    S.leitura.saldo -= x.preco;
    S.leitura.comprados.push(x.id);
    toast(`${x.nome} é seu!`, false, "party");
  }
  if (tipo === "movel") d.movel = x.id;
  else if (tipo === "fundo") d.fundo = x.id;
  else if (d.enfeites.includes(x.id)) d.enfeites = d.enfeites.filter(e => e !== x.id);
  else d.enfeites.push(x.id);
  commit();
};

/* ---------- formulários ---------- */
FORMS_EXTRAS["livro-busca"] = () => {
  buscarLivros(getV("lb-q"));
};
FORMS_EXTRAS["livro-manual"] = () => {
  const titulo = getV("lm-titulo");
  if (!titulo) return;
  const l = novoLivro(
    { titulo, autor: getV("lm-autor"), paginas: getV("lm-paginas") },
    getV("lm-estante") || "lendo"
  );
  S.livros.unshift(l);
  toast(`${l.titulo}: ${ESTANTES[l.estante]}`, false, "happy");
};
FORMS_EXTRAS["livro-pagina"] = f => {
  const l = livro(f.dataset.id);
  if (!l) return;
  const ganho = irParaPagina(l, +getV("lp-" + l.id));
  if (ganho && l.estante !== "lido") toast(`+${ganho} páginas`, false, "happy");
};
FORMS_EXTRAS["livro-total"] = f => {
  const l = livro(f.dataset.id),
    n = +getV("lt-" + f.dataset.id);
  if (l && n > 0) l.paginas = Math.min(5000, Math.round(n));
};
FORMS_EXTRAS["livro-resenha"] = f => {
  const l = livro(f.dataset.id);
  if (!l) return;
  l.resenha = getV("lr-" + l.id).slice(0, 1200);
  if (l.resenha.length >= 20 && !l.pago.resenha) {
    l.pago.resenha = 1;
    ganharPaginas(20);
    toast("Resenha salva. +20 páginas", false, "happy");
  } else toast("Resenha salva", false, "happy");
};
FORMS_EXTRAS["livro-citacao"] = f => {
  const l = livro(f.dataset.id),
    texto = getV("lc-" + f.dataset.id);
  if (!l || !texto) return;
  l.citacoes.push({ texto: texto.slice(0, 400), pagina: +getV("lcp-" + l.id) || 0 });
};
FORMS_EXTRAS["meta-ano"] = () => {
  const n = +getV("meta-ano");
  if (n > 0) S.leitura.metas[today().slice(0, 4)] = Math.min(365, Math.round(n));
};
