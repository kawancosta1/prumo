/*
  Metas e recompensas da leitura e do estudo (aparecem em Estante → Metas):
  - Missões da semana: 3 desafios sorteados por semana. Cada um dá gotas e páginas; as 3 juntas abrem o baú com um troféu.
  - Desafio do mês: um tema por mês (terror em outubro, clássico em maio...). Vale gotas e um selo.
  - Marcos de páginas: a cada 500 páginas, uma surpresa.
  - Mapa do ano: um quadradinho por dia, mais forte quanto mais você leu e estudou.
  - Passaporte de leitura: carimbos por gênero, época e tamanho dos livros lidos.
  - Retrospectiva: o seu ano em livros, pronto para compartilhar.
  Gêneros: o livro ganha gêneros nas tags (chips no detalhe do livro).
*/
"use strict";

/* ===================== gêneros (tags dos livros) ===================== */
const GENEROS = [
  ["romance", "Romance"],
  ["fantasia", "Fantasia"],
  ["terror", "Terror"],
  ["suspense", "Suspense"],
  ["ficcao-cientifica", "Ficção científica"],
  ["classico", "Clássico"],
  ["nao-ficcao", "Não ficção"],
  ["biografia", "Biografia"],
  ["poesia", "Poesia"],
  ["hq", "HQ e mangá"],
  ["didatico", "Didático"],
  ["autoajuda", "Desenvolvimento pessoal"],
  ["nacional", "Autor nacional"]
];
const NOME_GENERO = Object.fromEntries(GENEROS);
const temGenero = (l, g) => Array.isArray(l.tags) && l.tags.includes(g);

function generosHTML(l) {
  return `<div class="generos"><span class="label">Gêneros</span><div class="chips" role="group" aria-label="Gêneros">${GENEROS.map(([k, n]) => `<button class="chipbtn" data-act="livro-genero" data-id="${l.id}" data-g="${k}" aria-pressed="${temGenero(l, k)}">${n}</button>`).join("")}</div></div>`;
}
ACOES_EXTRAS["livro-genero"] = (b, id) => {
  const l = livro(id);
  const g = b.dataset.g;
  if (!l || !NOME_GENERO[g]) return;
  if (!Array.isArray(l.tags)) l.tags = [];
  l.tags = temGenero(l, g) ? l.tags.filter(t => t !== g) : [...l.tags, g].slice(0, 8);
  commit();
};

/* ===================== troféus (enfeites que só se ganham) ===================== */
const TROFEUS = [
  {
    id: "trofeu_ouro",
    nome: "Troféu dourado",
    w: 22,
    svg: () =>
      `<path d="M-6 0H6V-3H3V-8H-3V-3H-6Z" fill="#8C6A2A"/><path d="M-8 -26H8Q8 -12 0 -9Q-8 -12 -8 -26Z" fill="#E8C24A" stroke="#8C6A2A"/><path d="M-8 -23Q-13 -23 -12 -18Q-11 -14 -6 -14M8 -23Q13 -23 12 -18Q11 -14 6 -14" fill="none" stroke="#E8C24A" stroke-width="1.8"/><path d="M-4 -22Q-4 -15 -1 -13" stroke="#FFF3B0" stroke-width="1.4" fill="none"/>`
  },
  {
    id: "trofeu_livro",
    nome: "Livro de ouro",
    w: 24,
    svg: () =>
      `<path d="M-11 0V-18L0 -21L11 -18V0L0 -3Z" fill="#E8C24A" stroke="#8C6A2A"/><path d="M0 -21V-3" stroke="#8C6A2A"/><path d="M-8 -15L-2 -16.5M-8 -11L-2 -12.5M2 -16.5L8 -15M2 -12.5L8 -11" stroke="#8C6A2A" stroke-width=".8"/><path class="pisca" d="M9 -26l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#FFF3B0"/>`
  },
  {
    id: "trofeu_ampulheta",
    nome: "Ampulheta do foco",
    w: 16,
    svg: () =>
      `<rect x="-7" y="-2" width="14" height="2" fill="#6E4A2A"/><rect x="-7" y="-28" width="14" height="2" fill="#6E4A2A"/><path d="M-5 -26H5Q5 -18 0 -14Q5 -10 5 -2H-5Q-5 -10 0 -14Q-5 -18 -5 -26Z" fill="#D9EEF7" stroke="#6E4A2A" stroke-width=".8"/><path d="M-3 -22H3Q2 -18 0 -16Q-2 -18 -3 -22ZM-4 -3Q0 -8 4 -3Z" fill="#E8C24A"/>`
  },
  {
    id: "trofeu_coruja",
    nome: "Coruja sábia",
    w: 20,
    svg: () =>
      `<ellipse cx="0" cy="-10" rx="8" ry="10" fill="#8C6A4A" stroke="#4A2E1A"/><path d="M-8 -18L-6 -24L-3 -19M8 -18L6 -24L3 -19" fill="#8C6A4A" stroke="#4A2E1A"/><circle cx="-3.4" cy="-14" r="3" fill="#FBF7EC"/><circle cx="3.4" cy="-14" r="3" fill="#FBF7EC"/><circle cx="-3.4" cy="-14" r="1.4" fill="#141416"/><circle cx="3.4" cy="-14" r="1.4" fill="#141416"/><path d="M-1 -11L0 -9L1 -11Z" fill="#E8A23A"/><path d="M-5 -6Q0 -3 5 -6" stroke="#C9A06A" fill="none"/>`
  },
  {
    id: "trofeu_medalha",
    nome: "Medalha de leitor",
    w: 18,
    svg: () =>
      `<path d="M-5 -28L0 -16L5 -28" stroke="#2F6FD6" stroke-width="3" fill="none"/><circle cx="0" cy="-9" r="8" fill="#E8C24A" stroke="#8C6A2A"/><circle cx="0" cy="-9" r="5" fill="none" stroke="#8C6A2A" stroke-width=".8"/><path d="M-3 -10L-1 -8L3 -12" stroke="#8C6A2A" stroke-width="1.4" fill="none"/>`
  },
  {
    id: "trofeu_globo",
    nome: "Globo do passaporte",
    w: 20,
    svg: () =>
      `<rect x="-6" y="-2" width="12" height="2" fill="#6E4A2A"/><path d="M0 -2V-6" stroke="#6E4A2A" stroke-width="2"/><circle cx="0" cy="-16" r="9" fill="#5AA0D8" stroke="#2A5A8A"/><path d="M-6 -20Q-2 -22 0 -18Q3 -15 1 -12Q-3 -12 -6 -16Z M3 -24Q7 -22 7 -18Q5 -19 3 -21Z" fill="#6FAE4F"/><path d="M-9 -16H9" stroke="#2A5A8A" stroke-width=".5"/>`
  }
];
for (const t of TROFEUS) {
  t.preco = 1; // nunca à venda: só vale quando você ganha (fica em S.leitura.comprados)
  t.premio = true;
  ENFEITES.push(t);
  ENFEITE[t.id] = t;
}
const trofeuDisponivel = () => TROFEUS.find(t => !S.leitura.comprados.includes(t.id));
/** Entrega um troféu ainda não ganho (ou gotas, se já tem todos). Devolve o texto do prêmio. */
function ganharTrofeu() {
  const t = trofeuDisponivel();
  if (t) {
    S.leitura.comprados.push(t.id);
    return `o troféu <b>${t.nome}</b> para a estante`;
  }
  earn(50);
  return "<b>+50 gotas</b> (você já tem todos os troféus)";
}

/* ===================== missões da semana ===================== */
const semanaDe = d => mondayOf(d);
const diasDaSemana = (seg = semanaDe(today())) =>
  Array.from({ length: 7 }, (_, i) => addDays(seg, i)).filter(d => d <= today());
const somaDias = (dias, f) => dias.reduce((a, d) => a + f(d), 0);

const MISSOES = [
  {
    id: "paginas",
    meta: () => Math.max(50, Math.round((leituraDia().meta.paginas * 5) / 10) * 10),
    texto: n => `Ler ${n} páginas`,
    feito: dias => somaDias(dias, paginasDoDia)
  },
  {
    id: "minutos",
    meta: () => 120,
    texto: n => `Estudar ${n} minutos`,
    feito: dias => somaDias(dias, minutosEstudo)
  },
  {
    id: "focos",
    meta: () => 3,
    texto: n => `Fazer ${n} focos de 25 minutos`,
    feito: dias => S.sessions.filter(s => dias.includes(s.date) && s.min >= 25).length
  },
  {
    id: "sessoes",
    meta: () => 3,
    texto: n => `Fazer ${n} sessões de leitura`,
    feito: dias => somaDias(dias, d => (leituraDia().sessoesDia || {})[d] || 0)
  },
  {
    id: "metas",
    meta: () => 4,
    texto: n => `Bater a meta do dia em ${n} dias`,
    feito: dias => dias.filter(d => progressoMeta(d) >= 1).length
  },
  {
    id: "livro",
    meta: () => 1,
    texto: () => "Terminar um livro",
    feito: dias => S.livros.filter(l => l.estante === "lido" && dias.includes(l.fim)).length
  },
  {
    id: "minutosLeitura",
    meta: () => 90,
    texto: n => `Ler por ${n} minutos`,
    feito: dias => somaDias(dias, minutosLeitura)
  }
];
const MISSAO_GOTAS = 30,
  MISSAO_PAGINAS = 30;

/** As 3 missões desta semana (sorteio fixo pela data da segunda-feira). */
function missoesDaSemana() {
  const seg = semanaDe(today());
  let h = [...seg].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 17);
  const pool = MISSOES.slice();
  const escolhidas = [];
  while (escolhidas.length < 3) {
    h = (h * 1103515245 + 12345) >>> 0;
    escolhidas.push(pool.splice(h % pool.length, 1)[0]);
  }
  const dias = diasDaSemana(seg);
  return escolhidas.map(m => {
    const meta = m.meta();
    const feito = Math.min(meta, m.feito(dias));
    return { id: m.id, texto: m.texto(meta), meta, feito, pronta: feito >= meta };
  });
}
function estadoMissoes() {
  const L = leituraDia();
  const seg = semanaDe(today());
  if (!L.missoes || L.missoes.semana !== seg) L.missoes = { semana: seg, pagas: [], bau: false };
  return L.missoes;
}
ACOES_EXTRAS["missao-pegar"] = (b, id) => {
  const e = estadoMissoes();
  const m = missoesDaSemana().find(x => x.id === id);
  if (!m || !m.pronta || e.pagas.includes(id)) return;
  e.pagas.push(id);
  earn(MISSAO_GOTAS, b);
  ganharPaginas(MISSAO_PAGINAS);
  react("party", `Missão cumprida! <b>+${MISSAO_GOTAS} gotas</b> e <b>+${MISSAO_PAGINAS} páginas</b>.`, 3200);
  commit();
};
ACOES_EXTRAS["missao-bau"] = () => {
  const e = estadoMissoes();
  if (e.bau || e.pagas.length < 3) return;
  e.bau = true;
  fx.big = true;
  react("party", `Baú da semana aberto! Você ganhou ${ganharTrofeu()}.`, 5000);
  commit();
};

function missoesHTML() {
  const e = estadoMissoes();
  const lista = missoesDaSemana();
  const fim = addDays(semanaDe(today()), 6);
  const faltam = diffDays(today(), fim);
  const item = m => {
    const paga = e.pagas.includes(m.id);
    return `<li class="missao ${paga ? "paga" : m.pronta ? "pronta" : ""}"><div class="missao-txt"><b>${esc(m.texto)}</b><div class="progress"><span style="width:${Math.round((m.feito / m.meta) * 100)}%"></span></div><small>${m.feito}/${m.meta}</small></div>${paga ? `<span class="tag on">Feita</span>` : m.pronta ? `<button class="btn small primary" data-act="missao-pegar" data-id="${m.id}">Pegar prêmio</button>` : `<span class="tag">+${MISSAO_GOTAS} gotas</span>`}</li>`;
  };
  const todas = e.pagas.length >= 3;
  return `<div class="card missoes"><div class="row" style="justify-content:space-between"><b>Missões da semana</b><small class="note">${faltam > 0 ? `faltam ${faltam} ${faltam === 1 ? "dia" : "dias"}` : "último dia!"}</small></div>
    <ul class="lista-missoes">${lista.map(item).join("")}</ul>
    <div class="bau ${todas && !e.bau ? "pronto" : ""}">${BAU_SVG(e.bau)}<span>${e.bau ? "Baú aberto. Volte na segunda para novas missões." : todas ? "As 3 missões feitas! Abra o baú." : `Cumpra as 3 missões para abrir o baú com um troféu para a estante.`}</span>${todas && !e.bau ? `<button class="btn small primary" data-act="missao-bau">Abrir o baú</button>` : ""}</div></div>`;
}
const BAU_SVG = aberto =>
  `<svg viewBox="0 0 40 32" width="40" height="32" aria-hidden="true">${aberto ? `<path d="M4 12L8 2H32L36 12Z" fill="#8C5A2A" stroke="#3A2A1E"/><circle cx="20" cy="12" r="6" fill="#FFE27A" opacity=".7"/>` : `<path d="M4 14Q4 4 20 4Q36 4 36 14Z" fill="#8C5A2A" stroke="#3A2A1E"/>`}<rect x="4" y="14" width="32" height="16" rx="2" fill="#A86A32" stroke="#3A2A1E"/><path d="M4 18H36" stroke="#E8C24A" stroke-width="2"/><rect x="17" y="15" width="6" height="7" rx="1" fill="#E8C24A" stroke="#3A2A1E"/></svg>`;

/* ===================== marcos de páginas ===================== */
const MARCO = 500;
function conferirMarcos() {
  const L = leituraDia();
  const alcancado = Math.floor((L.total || 0) / MARCO);
  if (L.marcos === undefined) L.marcos = alcancado; // quem já tinha páginas não ganha tudo de uma vez
  if (alcancado <= L.marcos) return;
  const premios = [];
  for (let k = L.marcos + 1; k <= alcancado; k++)
    premios.push(k % 2 ? ganharTrofeu() : (earn(50), "<b>+50 gotas</b>"));
  L.marcos = alcancado;
  fx.big = true;
  setTimeout(
    () =>
      react(
        "party",
        `Marco de <b>${alcancado * MARCO} páginas</b>! Você ganhou ${premios.join(" e ")}.`,
        5200
      ),
    600
  );
  persist();
}

/* ===================== desafio do mês ===================== */
const DESAFIOS_MES = [
  {
    nome: "Começo leve",
    desc: "Terminar um livro de até 200 páginas",
    ok: l => l.paginas && l.paginas <= 200
  },
  { nome: "Mês do amor", desc: "Terminar um romance", ok: l => temGenero(l, "romance") },
  {
    nome: "Mundo real",
    desc: "Terminar um livro de não ficção",
    ok: l => temGenero(l, "nao-ficcao") || temGenero(l, "biografia")
  },
  { nome: "Mês da poesia", desc: "Terminar um livro de poesia", ok: l => temGenero(l, "poesia") },
  {
    nome: "Mês do clássico",
    desc: "Terminar um livro de antes de 1950 (ou marcado como clássico)",
    ok: l => (l.ano && l.ano < 1950) || temGenero(l, "classico")
  },
  { nome: "Mês da fantasia", desc: "Terminar uma fantasia", ok: l => temGenero(l, "fantasia") },
  { nome: "Férias em quadrinhos", desc: "Terminar uma HQ ou mangá", ok: l => temGenero(l, "hq") },
  { nome: "Mês do suspense", desc: "Terminar um suspense", ok: l => temGenero(l, "suspense") },
  {
    nome: "Mês da literatura nacional",
    desc: "Terminar um livro de autor nacional",
    ok: l => temGenero(l, "nacional")
  },
  { nome: "Mês do terror", desc: "Terminar um livro de terror", ok: l => temGenero(l, "terror") },
  {
    nome: "Mês do futuro",
    desc: "Terminar uma ficção científica",
    ok: l => temGenero(l, "ficcao-cientifica")
  },
  {
    nome: "Tijolão de fim de ano",
    desc: "Terminar um livro com 500 páginas ou mais",
    ok: l => l.paginas >= 500
  }
];
const DESAFIO_GOTAS = 40;
const mesAtual = () => today().slice(0, 7);
const desafioDoMes = () => DESAFIOS_MES[+today().slice(5, 7) - 1];

function conferirDesafio() {
  const L = leituraDia();
  if (!Array.isArray(L.selos)) L.selos = [];
  const mes = mesAtual();
  if (L.selos.some(s => s.mes === mes)) return;
  const d = desafioDoMes();
  const livroOk = S.livros.find(l => l.estante === "lido" && (l.fim || "").startsWith(mes) && d.ok(l));
  if (!livroOk) return;
  L.selos.push({ mes, nome: d.nome });
  earn(DESAFIO_GOTAS);
  setTimeout(
    () =>
      react(
        "party",
        `Desafio do mês cumprido: <b>${esc(d.nome)}</b>! +${DESAFIO_GOTAS} gotas e um selo.`,
        4600
      ),
    700
  );
  persist();
}

function desafioHTML() {
  const L = leituraDia();
  const d = desafioDoMes();
  const feito = (L.selos || []).some(s => s.mes === mesAtual());
  const selos = (L.selos || []).slice(-12);
  return `<div class="card desafio-mes ${feito ? "feito" : ""}"><small class="label">Desafio de ${MESES_NOME[+today().slice(5, 7) - 1]}</small><b>${esc(d.nome)}</b><span class="note">${esc(d.desc)}. ${feito ? "Feito! Selo garantido." : `Vale <b>+${DESAFIO_GOTAS} gotas</b> e um selo. Marque o gênero no detalhe do livro.`}</span>
    ${selos.length ? `<div class="selos">${selos.map(s => `<span class="selo" title="${esc(s.nome)}">${esc(MESES_CURTO[+s.mes.slice(5, 7) - 1])}<small>${esc(s.mes.slice(0, 4))}</small></span>`).join("")}</div>` : ""}</div>`;
}
const MESES_NOME = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
];
const MESES_CURTO = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/* ===================== mapa do ano ===================== */
function forcaDoDia(d) {
  const v = paginasDoDia(d) + (minutosLeitura(d) + minutosEstudo(d)) / 2;
  return v <= 0 ? 0 : v < 10 ? 1 : v < 25 ? 2 : v < 50 ? 3 : 4;
}
function mapaAnoHTML() {
  const ano = today().slice(0, 4);
  const inicio = `${ano}-01-01`;
  const primeiroDia = wIdx(inicio); // 0 = segunda
  const cel = 6,
    gap = 1.4;
  let quadros = "",
    ativos = 0;
  for (let i = 0, d = inicio; d.startsWith(ano); i++, d = addDays(d, 1)) {
    const pos = i + primeiroDia;
    const col = Math.floor(pos / 7),
      lin = pos % 7;
    const f = d > today() ? -1 : forcaDoDia(d);
    if (f > 0) ativos++;
    quadros += `<rect x="${col * (cel + gap)}" y="${10 + lin * (cel + gap)}" width="${cel}" height="${cel}" rx="1.4" class="mapa-f${f}"><title>${fmtShort(d)}: ${paginasDoDia(d)} páginas, ${minutosLeitura(d) + minutosEstudo(d)} min</title></rect>`;
  }
  const meses = MESES_CURTO.map((m, k) => {
    const d = `${ano}-${pad(k + 1)}-01`;
    const col = Math.floor((diffDays(inicio, d) + primeiroDia) / 7);
    return `<text x="${col * (cel + gap)}" y="7" class="mapa-mes">${m}</text>`;
  }).join("");
  const largura = 54 * (cel + gap);
  return `<div class="card mapa-ano"><div class="row" style="justify-content:space-between"><b>Mapa de ${ano}</b><small class="note">${ativos} ${ativos === 1 ? "dia" : "dias"} lendo ou estudando</small></div>
    <div class="mapa-rolar"><svg viewBox="0 0 ${largura} ${10 + 7 * (cel + gap)}" width="100%" role="img" aria-label="Mapa do ano: ${ativos} dias com leitura ou estudo">${meses}${quadros}</svg></div>
    <div class="mapa-legenda"><small>menos</small>${[0, 1, 2, 3, 4].map(f => `<i class="mapa-f${f}"></i>`).join("")}<small>mais</small></div></div>`;
}

/* ===================== passaporte de leitura ===================== */
const CARIMBOS = [
  ...GENEROS.map(([k, n]) => ({ id: "g_" + k, nome: n, ok: l => temGenero(l, k) })),
  { id: "e_antigo", nome: "Antes de 1900", ok: l => l.ano && l.ano < 1900 },
  { id: "e_1900", nome: "1900 a 1949", ok: l => l.ano >= 1900 && l.ano < 1950 },
  { id: "e_1950", nome: "1950 a 1979", ok: l => l.ano >= 1950 && l.ano < 1980 },
  { id: "e_1980", nome: "1980 a 1999", ok: l => l.ano >= 1980 && l.ano < 2000 },
  { id: "e_2000", nome: "Anos 2000", ok: l => l.ano >= 2000 && l.ano < 2010 },
  { id: "e_2010", nome: "Anos 2010", ok: l => l.ano >= 2010 && l.ano < 2020 },
  { id: "e_2020", nome: "Anos 2020", ok: l => l.ano >= 2020 },
  { id: "t_curto", nome: "Leitura rápida", ok: l => l.paginas && l.paginas < 150 },
  { id: "t_tijolo", nome: "Tijolão", ok: l => l.paginas >= 500 }
];
function passaporteHTML() {
  const lidos = livrosEm("lido");
  const tem = CARIMBOS.filter(c => lidos.some(c.ok));
  const cores = ["#C8102E", "#2F6FD6", "#2FB344", "#8C4AC8", "#E07A1A", "#1A8C8C"];
  return `<div class="card passaporte"><div class="row" style="justify-content:space-between"><b>Passaporte de leitura</b><small class="note">${tem.length}/${CARIMBOS.length} carimbos</small></div>
    <div class="carimbos">${CARIMBOS.map((c, i) => {
      const ok = tem.includes(c);
      return `<span class="carimbo ${ok ? "ok" : ""}" style="--c:${cores[i % cores.length]}" title="${esc(c.nome)}">${esc(c.nome)}</span>`;
    }).join("")}</div>
    <span class="note">Carimbos vêm dos livros lidos: gênero, época e tamanho.</span></div>`;
}

/* ===================== retrospectiva do ano ===================== */
function retrospectiva(ano = today().slice(0, 4)) {
  const lidos = S.livros.filter(l => l.estante === "lido" && (l.fim || "").startsWith(ano));
  const dias = Object.keys(S.leitura.log).filter(d => d.startsWith(ano));
  const paginas = dias.reduce((a, d) => a + S.leitura.log[d], 0);
  const minutos = Object.entries(leituraDia().minutos)
    .filter(([d]) => d.startsWith(ano))
    .reduce((a, [, m]) => a + m, 0);
  // maior sequência de dias lendo no ano
  let maior = 0,
    atual = 0;
  for (let d = `${ano}-01-01`; d.startsWith(ano) && d <= today(); d = addDays(d, 1)) {
    atual = S.leitura.log[d] ? atual + 1 : 0;
    maior = Math.max(maior, atual);
  }
  const conta = arr => {
    const c = {};
    arr.forEach(x => (c[x] = (c[x] || 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1])[0];
  };
  const genero = conta(lidos.flatMap(l => (l.tags || []).filter(t => NOME_GENERO[t])));
  const autor = conta(lidos.filter(l => l.autor).map(l => l.autor));
  const melhor = lidos.filter(l => l.nota).sort((a, b) => b.nota - a.nota)[0];
  const porMes = {};
  dias.forEach(d => (porMes[d.slice(5, 7)] = (porMes[d.slice(5, 7)] || 0) + S.leitura.log[d]));
  const mesTop = Object.entries(porMes).sort((a, b) => b[1] - a[1])[0];
  return {
    ano,
    livros: lidos.length,
    paginas,
    minutos,
    maior,
    genero: genero ? NOME_GENERO[genero[0]] : "",
    autor: autor ? autor[0] : "",
    melhor: melhor ? melhor.titulo : "",
    mes: mesTop ? MESES_NOME[+mesTop[0] - 1] : ""
  };
}
function retrospectivaHTML() {
  const r = retrospectiva();
  if (!r.livros && !r.paginas) return "";
  const linha = (n, t) => `<li><b>${n}</b><span>${t}</span></li>`;
  return `<div class="card retro"><small class="label">Seu ${r.ano} em livros${today().slice(5, 7) === "12" ? "" : " (até agora)"}</small>
    <ul class="retro-numeros">${linha(r.livros, r.livros === 1 ? "livro lido" : "livros lidos")}${linha(r.paginas, "páginas")}${linha(fmtMin(r.minutos || 0), "lendo")}${linha(r.maior, r.maior === 1 ? "dia seguido" : "dias seguidos")}</ul>
    ${r.genero || r.autor || r.melhor || r.mes ? `<ul class="retro-destaques">${r.genero ? `<li>Gênero favorito: <b>${esc(r.genero)}</b></li>` : ""}${r.autor ? `<li>Autor mais lido: <b>${esc(r.autor)}</b></li>` : ""}${r.melhor ? `<li>Melhor nota: <b>${esc(r.melhor)}</b></li>` : ""}${r.mes ? `<li>Mês campeão: <b>${esc(r.mes)}</b></li>` : ""}</ul>` : ""}
    <button class="btn small" data-act="retro-compartilhar">Compartilhar</button></div>`;
}
ACOES_EXTRAS["retro-compartilhar"] = async () => {
  const r = retrospectiva();
  const texto = `Meu ${r.ano} em livros no Prumo: ${r.livros} ${r.livros === 1 ? "livro" : "livros"}, ${r.paginas} páginas${r.maior ? `, ${r.maior} dias seguidos lendo` : ""}${r.genero ? `. Gênero favorito: ${r.genero}` : ""}${r.melhor ? `. Melhor leitura: ${r.melhor}` : ""}.`;
  try {
    if (navigator.share) await navigator.share({ text: texto });
    else {
      await navigator.clipboard.writeText(texto);
      toast("Resumo copiado. É só colar!", false, "happy");
    }
  } catch (e) {}
};

/* ===================== tela ===================== */
/** Tudo de metas e recompensas, no topo de Estante → Metas. */
function recompensasHTML() {
  conferirMarcos();
  conferirDesafio();
  const L = leituraDia();
  const proximo = (Math.floor((L.total || 0) / MARCO) + 1) * MARCO;
  return `${missoesHTML()}${desafioHTML()}
    <div class="card marco"><div class="row" style="justify-content:space-between"><b>Próximo marco: ${proximo} páginas</b><small class="note">${L.total || 0} lidas</small></div><div class="progress"><span style="width:${Math.round((((L.total || 0) % MARCO) / MARCO) * 100)}%"></span></div><span class="note">A cada ${MARCO} páginas, uma surpresa: troféu para a estante ou gotas.</span></div>
    ${mapaAnoHTML()}${passaporteHTML()}${retrospectivaHTML()}`;
}
