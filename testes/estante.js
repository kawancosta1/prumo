// Estante: casa da leitura (cômodos) e, nas próximas partes, leitura no dia a dia, metas e amigos
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
  ev(`S.onboarded = true; S.semConta = true; S.leitura.saldo = 100; S.leitura.total = 100; tab = "estante"; estanteTab = "estante"; commit();`);

  /* ---------- cômodos ---------- */
  ok(D.querySelectorAll(".comodo").length >= 8 && /Quarto/.test(M()) && /Sala/.test(M()), "aba Estante mostra os cômodos");
  ok(!D.querySelector('.comodo[data-id="cripta"]') && !D.querySelector('.comodo[data-id="estudio"]'), "cômodos de outros mundos não aparecem");
  clicar('.comodo[data-id="sala"]');
  ok(ev("minhaCasa().comodo") === "quarto" && ev("S.leitura.saldo") === 100, "sem páginas suficientes não compra");
  ev(`S.leitura.saldo = 400; render();`);
  clicar('.comodo[data-id="sala"]');
  ok(ev("minhaCasa().comodo") === "quarto" && /Comprar por 150/.test(D.querySelector('.comodo[data-id="sala"]').textContent), "primeiro toque pede confirmação");
  clicar('.comodo[data-id="sala"]');
  await espera(30);
  ok(ev("minhaCasa().comodo") === "sala" && ev("S.leitura.saldo") === 250 && ev("minhaCasa().tem.includes('sala')"), "segundo toque compra e muda para a sala");
  ok(!!D.querySelector(".casa-svg.casa-sala"), "desenho da sala aparece");
  clicar('[data-act="casa-op"][data-k="sofa"][data-v="azul"]');
  ok(ev("minhaCasa().opcoes.sala.sofa") === "azul" && M().includes("#33558C"), "trocar a cor do sofá");
  clicar('.comodo[data-id="quarto"]');
  ok(ev("minhaCasa().comodo") === "quarto" && ev("S.leitura.saldo") === 250 && !D.querySelector(".casa-sala"), "voltar ao quarto é grátis");
  clicar('.comodo[data-id="sala"]');
  ok(ev("minhaCasa().comodo") === "sala" && ev("S.leitura.saldo") === 250, "cômodo comprado não cobra de novo");

  // biblioteca secreta
  clicar('.comodo[data-id="biblioteca"]');
  ok(ev("minhaCasa().comodo") === "sala", "biblioteca fechada com menos de 1000 páginas");
  ev(`S.leitura.total = 1000; render();`);
  clicar('.comodo[data-id="biblioteca"]');
  ok(ev("minhaCasa().comodo") === "biblioteca" && !!D.querySelector(".casa-biblioteca"), "com 1000 páginas a biblioteca abre de graça");

  // todos os cômodos desenham, em todos os mundos que podem
  const falhos = ev(`COMODOS.filter(c => c.id !== "quarto").filter(c => { try { const d = { ...minhaEstante(), persona: c.mundo || "zen", decor: { ...S.leitura.decor, casa: { comodo: c.id, tem: [c.id], opcoes: {} } }, meu: false }; return !casaSVG(d).includes("casa-" + c.id); } catch (e) { return true; } }).map(c => c.id)`);
  ok(falhos.length === 0, "todos os cômodos desenham " + falhos.join(","));

  // mundo
  ev(`setPersona("emo"); applyTheme(); render();`);
  ok(!!D.querySelector('.comodo[data-id="cripta"]'), "no emo aparece a cripta");

  // amigos: casa vinda da vitrine é limpa
  ok(ev(`JSON.stringify(limparCasa({ comodo: "sala", tem: ["x"], opcoes: { sala: { sofa: "<b>", parede: "cinza" } } }))`) === JSON.stringify({ comodo: "sala", tem: ["sala"], opcoes: { sala: { parede: "cinza" } } }), "casa do amigo vem limpa");
  ok(ev(`limparCasa({ comodo: "<img>" }).comodo`) === "quarto", "cômodo desconhecido vira quarto");
  const amigo = ev(`casaSVG({ lidos: [], lendo: [], decor: { movel: "clara", fundo: "liso", enfeites: [], quarto: {}, casa: { comodo: "cripta", tem: ["cripta"], opcoes: {} } }, persona: "rock", equip: {}, meu: false })`);
  ok(!amigo.includes("casa-cripta"), "cripta não aparece para amigo de outro mundo");
  const vit = JSON.parse(ev("JSON.stringify(montarVitrine())"));
  ok(vit.estante && vit.estante.decor.casa.comodo === "biblioteca", "amigos veem o cômodo escolhido");

  /* ---------- leitura no dia a dia ---------- */
  ev(`setPersona("zen"); applyTheme(); S.livros.push({ id: "lv", titulo: "Duna", autor: "F", paginas: 400, pagina: 100, contadas: 100, estante: "lendo", tags: [], citacoes: [], pago: {} }); S.leitura.log = {}; S.leitura.minutos = {}; S.sessions = []; S.leitura.metaFeita = ""; tab = "hoje"; render();`);
  ok(!!D.querySelector(".herobox .meta-dia") && /0\/10 páginas ou 0\/25 min/.test(M()), "Hoje mostra a meta do dia no cartão do Prumi");
  // sessão de leitura
  ev(`tab = "estante"; estanteTab = "estante"; render();`);
  clicar('[data-act="livro-timer"][data-id="lv"]');
  await espera(30);
  ok(!!D.querySelector(".card.sessao") && /Duna/.test(D.querySelector(".card.sessao").textContent), "Ler agora abre a sessão de leitura");
  ok(!!D.querySelector(".sessao-prumi .oculos-leitura") && !!D.querySelector(".sessao-prumi .hop .livro-aberto"), "Prumi lê junto, de óculos e livro (dentro do balanço)");
  ev(`tab = "hoje"; render();`);
  ok(/Lendo <b>Duna<\/b>/.test(M()), "Hoje avisa que a sessão está rolando");
  ev(`tab = "estante"; render(); (() => { const s = sessaoAtual(); s.inicio = Date.now() - 20 * 60000; salvarSessao(s); })(); render();`);
  clicar('[data-act="sessao-som"][data-som="cafe"]');
  ok(JSON.parse(ev("lsGet(LS_SESSAO)")).som === "cafe", "escolher som ambiente");
  clicar('[data-act="sessao-terminar"]');
  ok(!!D.getElementById("sessao-pagina") && D.getElementById("sessao-pagina").value === "100", "terminar pergunta a página (começa na atual)");
  const moedas = ev("S.coins");
  D.getElementById("sessao-pagina").value = "130";
  D.querySelector('form[data-form="sessao-fim"]').dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  await espera(30);
  ok(ev("minutosLeitura()") === 20 && ev("paginasDoDia()") === 30 && ev("livro('lv').pagina") === 130, "sessão registra 20 min e 30 páginas");
  ok(ev("S.coins") > moedas && !ev("sessaoAtual()") && !D.querySelector(".card.sessao"), "sessão dá gotas e fecha");
  // meta do dia
  ok(ev("progressoMeta()") === 1, "30 páginas batem a meta de 10");
  const m2 = ev("S.coins");
  ev(`tab = "hoje"; render();`);
  ok(ev("S.coins") === m2 + 10 && ev("S.leitura.metaFeita") === ev("today()"), "meta batida dá 10 gotas");
  ev("render()");
  ok(ev("S.coins") === m2 + 10, "a meta paga uma vez só por dia");
  // previsão
  ev(`tab = "estante"; render();`);
  ok(/No seu ritmo/.test(M()), "previsão de término aparece no livro");
  // escudos e sequência
  ev(`S.coins = 200; S.leitura.escudos = 0; render();`);
  ev(`tab = "estante"; estanteTab = "metas"; render();`);
  clicar('[data-act="escudo-comprar"]');
  ok(ev("S.leitura.escudos") === 1 && ev("S.coins") === 140, "comprar escudo custa 60 gotas");
  ev(`S.leitura.log = { [addDays(today(), -3)]: 5, [addDays(today(), -2)]: 5 }; S.leitura.minutos = {}; S.leitura.diasEscudo = []; S.leitura.escudoChecado = addDays(today(), -2); conferirEscudos();`);
  ok(ev("S.leitura.escudos") === 0 && ev("S.leitura.diasEscudo.includes(addDays(today(), -1))") && ev("sequenciaAtual()") === 3, "escudo salva ontem e a sequência continua em 3 dias");
  ev(`S.leitura.escudos = 0; S.leitura.diasEscudo = []; S.leitura.escudoChecado = addDays(today(), -2); conferirEscudos();`);
  ok(ev("sequenciaAtual()") === 0, "sem escudo, um dia vazio zera a sequência");
  const campo = D.querySelector('[data-change="meta-paginas"]');
  campo.value = "30";
  campo.dispatchEvent(new w.Event("change", { bubbles: true }));
  ok(ev("S.leitura.meta.paginas") === 30, "ajustar a meta de páginas");

  /* ---------- metas e recompensas ---------- */
  ev(`S.livros.push({ id: "lg", titulo: "Livro G", autor: "Machado", paginas: 300, pagina: 10, contadas: 10, estante: "lendo", tags: [], citacoes: [], pago: {} }); livroAberto = "lg"; tab = "estante"; estanteTab = "estante"; render();`);
  clicar('[data-act="livro-genero"][data-id="lg"][data-g="terror"]');
  ok(ev(`livro("lg").tags.includes("terror")`), "marcar gênero no livro");
  clicar('[data-act="livro-genero"][data-id="lg"][data-g="terror"]');
  ok(!ev(`livro("lg").tags.includes("terror")`), "desmarcar gênero");
  // muita atividade hoje: quase todas as missões ficam prontas
  ev(`S.leitura.log[today()] = 600; S.leitura.minutos[today()] = 200; S.leitura.sessoesDia = { [today()]: 5 }; for (let i = 0; i < 4; i++) S.sessions.push({ id: "s" + i, subjectId: "x", date: today(), min: 30 }); S.livros.push({ id: "lf", titulo: "Feito", autor: "A", paginas: 100, pagina: 100, contadas: 100, estante: "lido", fim: today(), tags: [], citacoes: [], pago: { fim: 1 } }); S.leitura.total = 400; estanteTab = "metas"; render();`);
  ok(D.querySelectorAll(".lista-missoes .missao").length === 3, "três missões na semana");
  const pronta = D.querySelector('[data-act="missao-pegar"]');
  ok(!!pronta, "atividade deixa missão pronta para pegar");
  if (pronta) {
    const g0 = ev("S.coins"),
      p0 = ev("S.leitura.saldo");
    pronta.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    ok(ev("S.coins") >= g0 + 30 && ev("S.leitura.saldo") === p0 + 30, "missão dá 30 gotas e 30 páginas");
    const id = pronta.dataset.id;
    const g1 = ev("S.coins"),
      p1 = ev("S.leitura.saldo");
    ev(`ACOES_EXTRAS["missao-pegar"](document.body, ${JSON.stringify(id)})`);
    ok(ev("S.coins") === g1 && ev("S.leitura.saldo") === p1, "a mesma missão não paga duas vezes");
  }
  ev(`estadoMissoes().pagas = missoesDaSemana().map(m => m.id); render();`);
  const trofeus0 = ev("TROFEUS.filter(t => S.leitura.comprados.includes(t.id)).length");
  clicar('[data-act="missao-bau"]');
  ok(ev("estadoMissoes().bau") && ev("TROFEUS.filter(t => S.leitura.comprados.includes(t.id)).length") === trofeus0 + 1, "baú dá um troféu");
  ev(`estanteTab = "decorar"; render();`);
  ok(M().includes(ev("TROFEUS.find(t => S.leitura.comprados.includes(t.id)).nome")) && !M().includes(ev("TROFEUS.find(t => !S.leitura.comprados.includes(t.id)).nome")), "troféu ganho aparece em Decorar; os outros não");
  // marcos de páginas
  ev(`S.leitura.marcos = undefined; S.leitura.total = 400; conferirMarcos(); S.leitura.total = 520; conferirMarcos();`);
  ok(ev("S.leitura.marcos") === 1 && ev("TROFEUS.filter(t => S.leitura.comprados.includes(t.id)).length") === trofeus0 + 2, "marco de 500 páginas dá surpresa");
  // desafio do mês
  ev(`S.livros.push({ id: "d1", titulo: "Curto", autor: "B", paginas: 150, ano: 1890, pagina: 150, contadas: 150, estante: "lido", fim: today(), tags: GENEROS.map(g => g[0]), citacoes: [], pago: { fim: 1 } }, { id: "d2", titulo: "Longo", autor: "B", paginas: 600, ano: 1890, pagina: 600, contadas: 600, estante: "lido", fim: today(), tags: GENEROS.map(g => g[0]), citacoes: [], pago: { fim: 1 } }); S.leitura.selos = [];`);
  const g2 = ev("S.coins");
  ev(`estanteTab = "metas"; render();`);
  ok(ev("S.leitura.selos.length") === 1 && ev("S.coins") === g2 + 40 && /Feito! Selo garantido/.test(M()), "desafio do mês dá selo e 40 gotas");
  ok(D.querySelectorAll(".mapa-ano rect").length >= 365 && D.querySelectorAll(".mapa-ano .mapa-f4").length >= 1, "mapa do ano com todos os dias");
  ok(D.querySelectorAll(".carimbo.ok").length >= 10, "passaporte com carimbos dos livros lidos");
  ok(/livros lidos/.test(M()) && /Gênero favorito/.test(M()), "retrospectiva do ano");

  /* ---------- estudo junto com a leitura ---------- */
  ev(`S.subjects.push({ id: "calc", name: "Cálculo", color: "#2F6FD6" }); S.livros.push({ id: "ld", titulo: "Guidorizzi", autor: "H", paginas: 500, pagina: 20, contadas: 20, estante: "lendo", tags: [], citacoes: [], pago: {} }); tab = "estante"; estanteTab = "estante"; livroAberto = "ld"; render();`);
  const sel = D.querySelector('select[data-change="livro-materia"][data-id="ld"]');
  ok(!!sel, "detalhe do livro tem a matéria");
  sel.value = "calc";
  sel.dispatchEvent(new w.Event("change", { bubbles: true }));
  ok(ev(`livro("ld").materiaId`) === "calc", "livro ligado a Cálculo");
  ev(`tab = "estudos"; render();`);
  ok(/Livros de estudo/.test(M()) && /Guidorizzi/.test(M()), "Estudos mostra os livros de estudo");
  ev(`S.leitura.minutos = {}; S.sessions = []; iniciarSessao("ld"); (() => { const s = sessaoAtual(); s.inicio = Date.now() - 30 * 60000; salvarSessao(s); })(); encerrando = true; render();`);
  D.getElementById("sessao-pagina").value = "40";
  D.querySelector('form[data-form="sessao-fim"]').dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  await espera(30);
  ok(ev(`S.sessions.filter(s => s.subjectId === "calc" && s.livro === "ld").reduce((a, s) => a + s.min, 0)`) === 30 && ev("minutosLeitura()") === 0, "leitura do livro de estudo vira 30 min de Cálculo (sem contar duas vezes)");
  // estudo vira páginas
  const p0 = ev("S.leitura.saldo");
  ev(`timer.subjectId = "calc"; timer.running = false; timer.acc = 12 * 60000; logTimer();`);
  ok(ev("S.leitura.saldo") === p0 + 12, "12 min de foco rendem 12 páginas para decorar");
  // plano de prova
  ev(`S.exams.push({ id: "p1", title: "P1", subjectId: "calc", date: addDays(today(), 4) }); S.sessions = []; tab = "estudos"; render();`);
  ok(!!D.querySelector('form[data-form="plano-prova"][data-id="p1"]'), "prova tem botão de planejar");
  D.getElementById("pp-p1").value = "6";
  D.querySelector('form[data-form="plano-prova"][data-id="p1"]').dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  await espera(30);
  ok(ev(`S.exams[0].plano.horas`) === 6 && ev(`planoDoDia(S.exams[0]).porDia`) === 90, "6h em 4 dias = 90 min por dia");
  ev(`S.sessions.push({ id: "x1", subjectId: "calc", date: today(), min: 40 }); tab = "hoje"; render();`);
  ok(/Estude hoje: <b>50 min<\/b>/.test(M()), "Hoje mostra quanto falta estudar para a prova");
  // fichamento
  ev(`tab = "estante"; estanteTab = "estante"; livroAberto = "ld"; render();`);
  const p1 = ev("S.leitura.saldo");
  D.getElementById("fc-cap-ld").value = "Cap. 3: Derivadas";
  D.getElementById("fc-txt-ld").value = "Derivada é a taxa de variação instantânea. Regra da cadeia: derive a de fora e multiplique pela de dentro.";
  D.querySelector('form[data-form="ficha-nova"]').dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  await espera(30);
  ok(ev(`livro("ld").fichas.length`) === 1 && ev("S.leitura.saldo") === p1 + 10, "ficha guardada vale +10 páginas");
  const rev = ev(`S.reviews.find(r => r.fichaId)`);
  ok(rev && rev.subjectId === "calc" && rev.due === ev("addDays(today(), 1)") && /Derivadas/.test(rev.topic), "ficha vira revisão espaçada para amanhã");
  ev(`S.reviews.find(r => r.fichaId).due = today(); tab = "estudos"; render();`);
  ok(/ver a ficha/.test(M()) && /taxa de variação/.test(M()), "revisão mostra o texto da ficha");

  fechar();
  return erros;
};
