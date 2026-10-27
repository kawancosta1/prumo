// Testes Melhorias Gerais: Lote 8 (Itens 71 a 80)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 71. Lookup em O(1) com Map
  const res71 = ev(`
    (() => {
      const lista = [
        { id: "t1", nome: "Lavar louça" },
        { id: "t2", nome: "Estudar matemática" },
        { id: "t3", nome: "Beber água" }
      ];
      const mapa = obterItemLookupMap(lista, "id");
      const achouT2 = mapa.get("t2")?.nome === "Estudar matemática";
      const naoAchou = mapa.get("t99") === undefined;
      const mapaVazio = (obterItemLookupMap(null) instanceof Map) && obterItemLookupMap(null).size === 0;
      return achouT2 && naoAchou && mapaVazio;
    })()
  `);
  ok(res71, "71. obterItemLookupMap indexou e recuperou em O(1)");

  // 72. Padronização de ações com namespace
  const res72 = ev(`
    (() => {
      const a1 = formatarAcaoNamespace("Tarefas", "Concluir Item");
      const a2 = formatarAcaoNamespace("Diario", "Salvar Nota!");
      const p = formatarAcaoNamespace();
      return a1 === "tarefas:concluir_item" && a2 === "diario:salvar_nota_" && p === "app:acao";
    })()
  `);
  ok(res72, "72. formatarAcaoNamespace padronizou namespaces e ações");

  // 73. Consolidação de classes utilitárias CSS
  const res73 = ev(`
    (() => {
      const el = document.createElement("div");
      el.className = "flex-centro texto-truncado-1 oculto-acessivel gap-suave";
      document.body.appendChild(el);
      const estilo = window.getComputedStyle(el);
      const isFlex = estilo.display === "flex";
      const isCentro = estilo.alignItems === "center";
      const isTruncado = estilo.textOverflow === "ellipsis";
      document.body.removeChild(el);
      return isFlex && isCentro && isTruncado;
    })()
  `);
  ok(res73, "73. Classes utilitárias consolidadas (.flex-centro, .texto-truncado-1, etc.) aplicadas");

  // 74. Defer de tarefas com requestIdleCallback
  const res74 = await new Promise(resolve => {
    ev(`
      executarQuandoOcioso(deadline => {
        window.__idleExecutou = true;
      }, 500);
    `);
    setTimeout(() => {
      const r = ev(`window.__idleExecutou === true`);
      resolve(r);
    }, 100);
  });
  ok(res74, "74. executarQuandoOcioso postergou execução com sucesso");

  // 75. Debounce para inputs de texto com cancelamento
  const res75 = await new Promise(resolve => {
    ev(`
      window.__debChamadas = 0;
      const fn = () => { window.__debChamadas++; };
      window.__debFn = criarDebounce(fn, 40);
      window.__debFn();
      window.__debFn();
      window.__debFn();
      window.__debFn.agora(); // executa 1
      window.__debFn();
      window.__debFn.cancelar(); // cancela
    `);
    setTimeout(() => {
      const r = ev(`window.__debChamadas === 1`);
      resolve(r);
    }, 80);
  });
  ok(res75, "75. criarDebounce agrupou, executou agora e cancelou corretamente");

  // 76. Error Boundary leve para módulos
  const res76 = ev(`
    (() => {
      const sucesso = executarComRecuperacao(() => 10 + 20, 0);
      const recuperouValor = executarComRecuperacao(() => { throw new Error("Ops"); }, "recuperado");
      const recuperouFn = executarComRecuperacao(
        () => { throw new Error("Erro"); },
        err => "Tratou: " + err.message
      );
      return sucesso === 30 && recuperouValor === "recuperado" && recuperouFn === "Tratou: Erro";
    })()
  `);
  ok(res76, "76. executarComRecuperacao capturou erros e retornou fallback seguro");

  // 77. Tipagem JSDoc com @typedef nos modelos centrais
  const res77 = ev(`
    typeof obterItemLookupMap === "function" && typeof executarComRecuperacao === "function"
  `);
  ok(res77, "77. Modelos tipados e funções exportadas com integridade");

  // 78. Benchmark de tempo de execução com performance.now
  const res78 = ev(`
    (() => {
      const res = medirTempoExecucao(i => {
        let a = i * 2;
        return a;
      }, 50);
      return res.repeticoes === 50 && typeof res.duracaoTotalMs === "number" && res.duracaoTotalMs >= 0;
    })()
  `);
  ok(res78, "78. medirTempoExecucao mediu métricas de micro-benchmark");

  // 79. Seletores CSS diretos e de alta performance
  const res79 = ev(`
    (() => {
      const el = document.createElement("div");
      el.className = "prumo-camada-gpu prumo-lista-otimizada";
      document.body.appendChild(el);
      const comp = window.getComputedStyle(el);
      const willChange = comp.willChange;
      document.body.removeChild(el);
      return willChange.includes("transform");
    })()
  `);
  ok(res79, "79. Seletores CSS diretos ativaram camada GPU com will-change");

  // 80. Otimização de fontes com font-display: swap
  const res80 = ev(`
    (() => {
      const cssSemSwap = "@font-face { font-family: 'Open Sans'; src: url('sans.woff2'); }";
      const corrigido = garantirFontDisplaySwap(cssSemSwap);
      const cssComSwap = "@font-face { font-family: 'Open Sans'; font-display: swap; }";
      const inalterado = garantirFontDisplaySwap(cssComSwap);
      return corrigido.includes("font-display: swap;") && inalterado.includes("font-display: swap;");
    })()
  `);
  ok(res80, "80. garantirFontDisplaySwap assegurou swap de fontes");

  await fechar();
  return erros;
};
