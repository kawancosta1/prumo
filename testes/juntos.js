// Leitura com amigos: corrida, dupla, empréstimos, recomendações e clube do livro (com um Firestore falso em memória)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };
  const enviar = sel => D.querySelector(sel).dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));

  // Firestore falso: documentos num objeto, consultas com where/orderBy/limit e ouvintes (onSnapshot)
  ev(`(() => {
    window.__db = { docs: {}, ouvintes: [] };
    const copia = x => JSON.parse(JSON.stringify(x));
    const pai = p => p.split("/").slice(0, -1).join("/");
    const avisar = () => __db.ouvintes.slice().forEach(f => f());
    const snapDoc = p => ({ id: p.split("/").pop(), exists: !!__db.docs[p], data: () => (__db.docs[p] ? copia(__db.docs[p]) : undefined) });
    const consulta = (col, filtros = [], ordem = null, lim = 1e9) => {
      const q = {
        where: (c, op, v) => consulta(col, [...filtros, [c, op, v]], ordem, lim),
        orderBy: (c, dir) => consulta(col, filtros, [c, dir], lim),
        limit: n => consulta(col, filtros, ordem, n),
        lista() {
          let ds = Object.keys(__db.docs).filter(p => pai(p) === col).map(snapDoc);
          ds = ds.filter(d => filtros.every(([c, op, v]) => (op === "array-contains" ? (d.data()[c] || []).includes(v) : d.data()[c] === v)));
          if (ordem) ds.sort((a, b) => (a.data()[ordem[0]] - b.data()[ordem[0]]) * (ordem[1] === "desc" ? -1 : 1));
          return ds.slice(0, lim);
        },
        get: async () => ({ docs: q.lista(), empty: !q.lista().length }),
        onSnapshot(cb) { const f = () => cb({ docs: q.lista(), docChanges: () => [] }); __db.ouvintes.push(f); f(); return () => (__db.ouvintes = __db.ouvintes.filter(x => x !== f)); },
        add: async d => { const id = "d" + Math.random().toString(36).slice(2, 9); __db.docs[col + "/" + id] = copia(d); avisar(); return { id }; }
      };
      return q;
    };
    banco = {
      collection: p => consulta(p),
      doc: p => ({
        set: async d => { __db.docs[p] = copia(d); avisar(); },
        update: async d => { __db.docs[p] = { ...__db.docs[p], ...copia(d) }; avisar(); },
        delete: async () => { delete __db.docs[p]; avisar(); },
        get: async () => snapDoc(p),
        onSnapshot: cb => { const f = () => cb(snapDoc(p)); __db.ouvintes.push(f); f(); return () => (__db.ouvintes = __db.ouvintes.filter(x => x !== f)); }
      }),
      runTransaction: async () => {}
    };
    fb = { auth: {}, db: banco }; contaUsuario = { email: "eu@x.com", emailVerified: true }; meuId = "eu";
    S.onboarded = true; S.name = "Kawan"; S.consentimento = { versao: POLITICA_VERSAO, em: Date.now() };
    amizades = { a1_eu: { uids: ["eu", "a1"], estado: "aceita", de: "eu" }, a2_eu: { uids: ["eu", "a2"], estado: "aceita", de: "a2" } };
    carregarAmigo = async () => ({});
    amigosInfo.a1 = { vitrine: limparVitrine({ nome: "Bia", persona: "emo", semana: { seg: mondayOf(today()), paginas: 50, minutos: 20 } }) };
    amigosInfo.a2 = { vitrine: limparVitrine({ nome: "Leo", persona: "rock" }) };
    S.livros = [{ id: "duna", titulo: "Duna", autor: "Frank Herbert", paginas: 600, pagina: 120, contadas: 120, estante: "lendo", tags: [], citacoes: [], pago: {} }];
    S.leitura.log = { [today()]: 30 };
    tab = "estante"; estanteTab = "juntos"; commit();
  })()`);

  /* ---------- corrida e dupla ---------- */
  ok(/Corrida da semana/.test(M()) && D.querySelectorAll(".corrida-lista li").length === 3, "corrida com você e os dois amigos");
  ok(D.querySelector(".corrida-lista li:first-child .title").textContent === "Bia", "quem leu mais aparece primeiro");
  ok(ev("montarVitrine().semana.paginas") === 30, "seus números da semana vão na vitrine");
  ok(ev(`limparVitrine({ semana: { seg: "<b>", paginas: "x" } }).semana`) === null, "semana de amigo vem limpa");
  ev(`S.parceria.id = "a1"; parceiroDados = limparParceiro({ nome: "Bia", parceiro: "eu", semana: { seg: mondayOf(today()), paginas: 40, minutos: 0 } }); render();`);
  ok(/Leitura em dupla/.test(M()) && /70\/300 páginas/.test(M()), "leitura em dupla soma as páginas dos dois");
  ev(`S.parceria.id = null; parceiroDados = null;`);

  /* ---------- empréstimo ---------- */
  ev(`estanteTab = "estante"; livroAberto = "duna"; render();`);
  D.getElementById("emp-para-duna").value = "Ana";
  enviar('form[data-form="emprestar"]');
  await espera(20);
  ok(ev(`livro("duna").emprestimo.para`) === "Ana" && ev(`livro("duna").emprestimo.devolver`) === ev("addDays(today(), 30)"), "emprestar anota com quem e até quando");
  ev(`livro("duna").emprestimo.devolver = addDays(today(), -1); tab = "hoje"; render();`);
  ok(/Pegar de volta/.test(M()) && /Duna com Ana/.test(M()), "Hoje lembra do livro atrasado");
  ev(`tab = "estante"; estanteTab = "juntos"; render();`);
  clicar('[data-act="emprestimo-volta"][data-id="duna"]');
  ok(!ev(`livro("duna").emprestimo`), "Voltou tira o empréstimo");

  /* ---------- recomendar ---------- */
  ev(`estanteTab = "estante"; livroAberto = "duna"; render();`);
  D.getElementById("rec-amigo-duna").value = "a1";
  D.getElementById("rec-msg-duna").value = "Melhor ficção científica";
  enviar('form[data-form="recomendar"]');
  await espera(30);
  const rec = ev(`Object.entries(__db.docs).find(([p, d]) => p.startsWith("caixa/a1/itens/") && d.tipo === "livro")`);
  ok(rec && rec[1].livro.titulo === "Duna" && /Melhor ficção/.test(rec[1].texto), "recomendação vai para a caixa do amigo");
  ev(`caixaItens = [{ id: "r1", tipo: "livro", de: "a2", deNome: "Leo", texto: "Neuromancer <b>x</b>\\nlê isso", livro: { titulo: "Neuromancer <b>x</b>", autor: "Gibson", capa: "javascript:alert(1)" }, em: Date.now(), visto: false }]; tab = "avisos"; render();`);
  ok(/te recomendou/.test(M()) && !/<b>x<\/b>/.test(M()), "recomendação recebida aparece escapada");
  clicar('[data-act="rec-guardar"][data-id="r1"]');
  const novo = ev(`S.livros.find(l => l.titulo.startsWith("Neuromancer"))`);
  ok(novo && novo.estante === "quero" && novo.capa === "", "Pôr em Quero ler cria o livro (com capa insegura removida)");

  /* ---------- clube do livro ---------- */
  ev(`tab = "estante"; estanteTab = "juntos"; render();`);
  clicar('[data-act="clube-novo"]');
  D.getElementById("cl-nome").value = "Clube de Arrakis";
  D.getElementById("cl-livro").value = "duna";
  D.querySelector('.cl-amigo[value="a1"]').checked = true;
  enviar('form[data-form="clube-criar"]');
  await espera(40);
  const clube = ev(`Object.entries(__db.docs).find(([p]) => /^clubes\\/[^/]+$/.test(p))`);
  ok(clube && clube[1].membros.join() === "eu,a1" && clube[1].dono === "eu" && clube[1].livro.titulo === "Duna", "clube criado com você e a Bia");
  ok(ev(`Object.entries(__db.docs).some(([p, d]) => p.startsWith("caixa/a1/itens/") && d.tipo === "clube")`), "Bia recebe o convite na caixa");
  const idClube = clube[0].split("/")[1];
  ok(/Clube de Arrakis/.test(M()), "clube aparece na lista");
  clicar(`[data-act="clube-abrir"][data-id="${idClube}"]`);
  await espera(30);
  ok(ev(`__db.docs["clubes/${idClube}/membros/eu"].pagina`) === 120, "abrir publica sua página no clube");
  // a Bia está na página 300 e comenta lá
  ev(`__db.docs["clubes/${idClube}/membros/a1"] = { pagina: 300, nome: "Bia", em: 1 }; __db.docs["clubes/${idClube}/comentarios/c1"] = { de: "a1", deNome: "Bia", pagina: 300, texto: "Que reviravolta <img src=x>", em: 1 }; __db.ouvintes.slice().forEach(f => f()); render();`);
  ok(D.querySelectorAll(".clube-progresso li").length === 2 && /p\. 300/.test(M()), "progresso da Bia aparece");
  ok(!M().includes("Que reviravolta") && /Passe da página 300/.test(M()), "comentário depois da sua página fica escondido (sem spoiler)");
  D.getElementById("clc-txt").value = "Começo lento mas bom";
  D.getElementById("clc-pag").value = "100";
  enviar('form[data-form="clube-comentar"]');
  await espera(30);
  ok(/Começo lento mas bom/.test(M()), "seu comentário aparece");
  ev(`irParaPagina(livro("duna"), 310); render();`);
  await espera(20);
  ok(M().includes("Que reviravolta &lt;img src=x&gt;") && ev(`__db.docs["clubes/${idClube}/membros/eu"].pagina`) === 310, "passou da página: comentário aparece (escapado) e o clube vê seu progresso");
  // sair de um clube que não é seu
  ev(`__db.docs["clubes/outro"] = { nome: "Clube do Leo", livro: { titulo: "Duna" }, membros: ["a2", "eu"], dono: "a2", criado: 2 }; __db.ouvintes.slice().forEach(f => f()); fecharClube(); render();`);
  clicar('[data-act="clube-abrir"][data-id="outro"]');
  clicar('[data-act="clube-sair"]');
  clicar('[data-act="clube-sair"]');
  await espera(30);
  ok(ev(`__db.docs["clubes/outro"].membros.join()`) === "a2" && !ev(`__db.docs["clubes/outro/membros/eu"]`), "sair do clube do amigo");
  // apagar o próprio clube
  clicar(`[data-act="clube-abrir"][data-id="${idClube}"]`);
  clicar('[data-act="clube-apagar"]');
  clicar('[data-act="clube-apagar"]');
  await espera(30);
  ok(!ev(`__db.docs["clubes/${idClube}"]`) && !/Clube de Arrakis/.test(M()), "apagar o próprio clube");
  ok(ev(`limparClube("x", { nome: "<b>", membros: ["a", 3], livro: { titulo: "T", capa: "http://x" } }).livro.capa`) === "", "clube vindo do banco é limpo");

  fechar();
  return erros;
};
