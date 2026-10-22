/*
  Leitura (estilo Skoob): livros, progresso, notas, resenhas, metas e a moeda "páginas".
  A tela fica em js/telas/estante.js e os enfeites da estante em js/estante-enfeites.js.

  Como os dados ficam em S:
    S.livros  = [{ id, titulo, autor, paginas, isbn, capa, ano, estante, pagina, contadas, nota,
                   resenha, inicio, fim, tags, citacoes, fav, pago }]
    S.leitura = { log: { "AAAA-MM-DD": páginas lidas no dia }, metas: { "2027": 24 },
                  saldo (páginas para gastar), total (páginas já ganhas), decor, comprados }
  A busca usa a Open Library e o Google Books (grátis, sem chave). Os resultados ficam guardados
  no aparelho por 7 dias para não repetir pedidos.
*/
"use strict";

/* ---------- prateleiras ---------- */
const ESTANTES = {
  lendo: "Lendo",
  quero: "Quero ler",
  lido: "Lidos",
  relendo: "Relendo",
  abandonado: "Abandonados"
};

const livro = id => S.livros.find(l => l.id === id);
const livrosEm = e => S.livros.filter(l => l.estante === e);
const lidosNoAno = (ano = today().slice(0, 4)) =>
  S.livros.filter(l => l.estante === "lido" && (l.fim || "").startsWith(ano));
const paginasHoje = () => S.leitura.log[today()] || 0;

/** Novo livro com todos os campos (vindo da busca ou digitado). */
function novoLivro(dados, estante = "lendo") {
  const l = {
    id: newId(),
    titulo: (dados.titulo || "Sem título").slice(0, 160),
    autor: (dados.autor || "").slice(0, 120),
    paginas: Math.max(0, Math.min(5000, Math.round(+dados.paginas || 0))),
    isbn: (dados.isbn || "").replace(/\D/g, "").slice(0, 13),
    capa: /^https:\/\//.test(dados.capa || "") ? dados.capa : "",
    ano: +dados.ano || 0,
    estante,
    pagina: 0,
    contadas: 0, // maior página já paga em "páginas" (evita ganhar duas vezes pela mesma página)
    nota: 0,
    resenha: "",
    inicio: estante === "lendo" ? today() : "",
    fim: "",
    tags: [],
    citacoes: [],
    fav: false,
    pago: {} // bônus já pagos: fim, resenha
  };
  if (estante === "lido") terminarLivro(l, true);
  return l;
}

/* ---------- moeda: páginas ---------- */
/** Dá (ou tira) páginas de saldo. Devolve o quanto entrou. */
function ganharPaginas(n) {
  if (!n) return 0;
  S.leitura.saldo = Math.max(0, S.leitura.saldo + n);
  if (n > 0) S.leitura.total += n;
  return n;
}

/** Atualiza a página atual. Páginas novas viram moeda e entram no registro do dia. */
function irParaPagina(l, nova) {
  const max = l.paginas || 5000;
  nova = Math.max(0, Math.min(max, Math.round(nova)));
  const ganho = Math.max(0, nova - l.contadas);
  l.pagina = nova;
  if (ganho) {
    l.contadas = nova;
    ganharPaginas(ganho);
    const d = today();
    S.leitura.log[d] = (S.leitura.log[d] || 0) + ganho;
    marcarHabitoLeitura();
    if (typeof somPagina === "function") somPagina();
  }
  if (!l.inicio) l.inicio = today();
  if (l.paginas && nova >= l.paginas && l.estante !== "lido") terminarLivro(l);
  return ganho;
}

/** Marca como lido: data de fim, página final e bônus de 50 páginas (uma vez por livro). */
function terminarLivro(l, silencioso) {
  l.estante = "lido";
  l.fim = l.fim || today();
  if (l.paginas) l.pagina = l.paginas;
  if (!l.pago.fim) {
    l.pago.fim = 1;
    ganharPaginas(50);
  }
  if (!silencioso) {
    fx.big = true;
    react(
      "party",
      textoMundo("livroLido", "Terminou! Mais um pra estante. <b>+50 páginas</b> de bônus."),
      4500
    );
  }
}

/** Hábito automático: um hábito com "ler" ou "leitura" no nome é marcado quando você lê. */
function marcarHabitoLeitura() {
  const d = today();
  const arr = S.habitLog[d] || (S.habitLog[d] = []);
  S.habits
    .filter(h => /\b(ler|leitura|livro)\b/.test(norm(h.name)) && habitDue(h, d) && !arr.includes(h.id))
    .forEach(h => arr.push(h.id));
}

/* ---------- números ---------- */
function sequenciaLeitura() {
  let d = today(),
    c = 0;
  if (!S.leitura.log[d]) d = addDays(d, -1);
  while (S.leitura.log[d]) {
    c++;
    d = addDays(d, -1);
  }
  return c;
}
function paginasSemana() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today(), i - 6);
    return { d, n: S.leitura.log[d] || 0 };
  });
}
function autorMaisLido() {
  const conta = {};
  S.livros
    .filter(l => l.estante === "lido" && l.autor)
    .forEach(l => (conta[l.autor] = (conta[l.autor] || 0) + 1));
  const top = Object.entries(conta).sort((a, b) => b[1] - a[1])[0];
  return top ? { autor: top[0], n: top[1] } : null;
}
const maiorDia = () => Math.max(0, ...Object.values(S.leitura.log));

/* ---------- conquistas de leitura (entram na lista geral) ---------- */
ACHS.push(
  {
    id: "primeiro_livro",
    name: "Primeiro livro",
    desc: "Terminar 1 livro na Estante",
    goal: 1,
    cur: () => livrosEm("lido").length,
    reward: 20
  },
  {
    id: "leitor",
    name: "Leitor de verdade",
    desc: "Terminar 10 livros",
    goal: 10,
    cur: () => livrosEm("lido").length,
    reward: 80
  },
  {
    id: "rato_biblioteca",
    name: "Rato de biblioteca",
    desc: "Terminar 50 livros (libera um enfeite lendário)",
    goal: 50,
    cur: () => livrosEm("lido").length,
    reward: 200
  },
  {
    id: "maratonista",
    name: "Maratonista",
    desc: "Ler 300 páginas num dia só (libera um enfeite lendário)",
    goal: 300,
    cur: () => maiorDia(),
    reward: 100
  },
  {
    id: "classico",
    name: "Clássico",
    desc: "Terminar um livro publicado antes de 1900 (libera um enfeite lendário)",
    goal: 1,
    cur: () => S.livros.filter(l => l.estante === "lido" && l.ano && l.ano < 1900).length,
    reward: 60
  },
  {
    id: "desafio_ano",
    name: "Desafio do ano",
    desc: "Bater a meta de livros do ano",
    goal: 1,
    cur: () => {
      const ano = today().slice(0, 4),
        meta = S.leitura.metas[ano] || 0;
      return meta && lidosNoAno(ano).length >= meta ? 1 : 0;
    },
    reward: 150
  }
);
for (const a of ACHS) ACH[a.id] = a;

/* ---------- busca de livros ---------- */
let busca = { q: "", status: "", resultados: [] }; // estado da última busca

const CACHE_BUSCA = "prumo-busca-livros";
function cacheBusca(q, valor) {
  let c = {};
  try {
    c = JSON.parse(lsGet(CACHE_BUSCA) || "{}");
  } catch (e) {}
  const k = norm(q);
  if (valor === undefined) {
    const e = c[k];
    return e && Date.now() - e.em < 7 * 864e5 ? e.r : null;
  }
  c[k] = { em: Date.now(), r: valor };
  const chaves = Object.keys(c).sort((a, b) => c[b].em - c[a].em);
  chaves.slice(30).forEach(x => delete c[x]); // guarda só as 30 últimas buscas
  lsSet(CACHE_BUSCA, JSON.stringify(c));
}

async function buscarOpenLibrary(q, isbn) {
  const url = isbn
    ? `https://openlibrary.org/search.json?isbn=${isbn}&limit=5`
    : `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10&fields=key,title,author_name,number_of_pages_median,first_publish_year,isbn,cover_i`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("open library");
  const j = await r.json();
  return (j.docs || []).map(d => ({
    titulo: d.title,
    autor: (d.author_name || []).slice(0, 2).join(", "),
    paginas: d.number_of_pages_median || 0,
    ano: d.first_publish_year || 0,
    isbn: isbn || (d.isbn || []).find(x => x.length === 13) || "",
    capa: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : ""
  }));
}

async function buscarGoogleLivros(q, isbn) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${isbn ? "isbn:" + isbn : encodeURIComponent(q)}&maxResults=10&printType=books`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("google books");
  const j = await r.json();
  return (j.items || []).map(({ volumeInfo: v = {} }) => ({
    titulo: v.title + (v.subtitle ? ": " + v.subtitle : ""),
    autor: (v.authors || []).slice(0, 2).join(", "),
    paginas: v.pageCount || 0,
    ano: +(v.publishedDate || "").slice(0, 4) || 0,
    isbn: ((v.industryIdentifiers || []).find(i => i.type === "ISBN_13") || {}).identifier || "",
    capa: ((v.imageLinks || {}).thumbnail || "").replace(/^http:/, "https:")
  }));
}

/** Busca nas duas fontes ao mesmo tempo e junta os resultados sem repetir. */
async function buscarLivros(q) {
  q = q.trim();
  if (!q) return;
  const isbn = /^[\d\s-]{10,17}$/.test(q) ? q.replace(/\D/g, "") : "";
  busca = { q, status: "buscando", resultados: [] };
  softRender();
  const guardado = cacheBusca(q);
  if (guardado) {
    busca = { q, status: "ok", resultados: guardado };
    return softRender();
  }
  const [google, ol] = await Promise.allSettled([buscarGoogleLivros(q, isbn), buscarOpenLibrary(q, isbn)]);
  const todos = [...(google.value || []), ...(ol.value || [])];
  const vistos = new Set();
  const resultados = todos
    .filter(r => r.titulo)
    .filter(r => {
      const k = norm(r.titulo + "|" + (r.autor || "").split(",")[0]);
      if (vistos.has(k)) return false;
      vistos.add(k);
      return true;
    })
    .slice(0, 12);
  const falhou = google.status === "rejected" && ol.status === "rejected";
  busca = { q, status: falhou ? "erro" : "ok", resultados };
  if (!falhou) cacheBusca(q, resultados);
  softRender();
}

/* ---------- código de barras (ISBN) pela câmera ---------- */
async function lerCodigoDeBarras() {
  if (!("BarcodeDetector" in window) || !navigator.mediaDevices) {
    toast(
      "Este navegador não lê código de barras. Digite o ISBN: são os números embaixo do código.",
      false,
      "worried"
    );
    return;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  } catch (e) {
    toast("Sem acesso à câmera. Dá pra digitar o ISBN.", false, "worried");
    return;
  }
  const detector = new BarcodeDetector({ formats: ["ean_13"] });
  const caixa = document.createElement("div");
  caixa.className = "leitor-codigo";
  caixa.innerHTML = `<div class="leitor-janela"><video playsinline muted></video><span class="leitor-mira"></span><p>Aponte para o código de barras do livro</p><button class="btn" type="button">Cancelar</button></div>`;
  document.body.appendChild(caixa);
  const video = caixa.querySelector("video");
  video.srcObject = stream;
  await video.play().catch(() => {});
  let ativo = true;
  const fechar = () => {
    ativo = false;
    stream.getTracks().forEach(t => t.stop());
    caixa.remove();
  };
  caixa.querySelector("button").onclick = fechar;
  const procurar = async () => {
    if (!ativo) return;
    try {
      const achados = await detector.detect(video);
      const isbn = achados.map(a => a.rawValue).find(v => /^97[89]\d{10}$/.test(v));
      if (isbn) {
        fechar();
        estanteTab = "adicionar";
        render();
        const campo = document.getElementById("lb-q");
        if (campo) campo.value = isbn;
        return buscarLivros(isbn);
      }
    } catch (e) {}
    setTimeout(procurar, 300);
  };
  procurar();
}
