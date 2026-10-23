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

  fechar();
  return erros;
};
