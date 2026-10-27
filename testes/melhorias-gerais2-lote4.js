// Testes Novas Melhorias Gerais: Lote 4 (Itens 31 a 40)
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

  // 31. Otimização no carregamento de fontes secundárias sem bloquear pintura
  const res31 = ev(`
    (() => {
      const link = document.createElement("link");
      link.id = "fontes-teste-31";
      link.media = "print";
      document.head.appendChild(link);
      const ativou = otimizarCarregamentoFontesSecundarias("fontes-teste-31");
      const okMedia = link.media === "all";
      document.head.removeChild(link);
      return ativou && okMedia;
    })()
  `);
  ok(res31, "31. otimizarCarregamentoFontesSecundarias ativou media=all sem bloqueio");

  // 32. Preservação de foco ativo ao re-renderizar conteúdo
  const res32 = ev(`
    (() => {
      const container = document.createElement("div");
      const input = document.createElement("input");
      input.id = "campo-foco-32";
      container.appendChild(input);
      document.body.appendChild(container);
      input.focus();
      let focouNovo = false;
      preservarFocoElemento(container, () => {
        container.innerHTML = '<input id="campo-foco-32">';
      });
      focouNovo = document.activeElement && document.activeElement.id === "campo-foco-32";
      document.body.removeChild(container);
      return focouNovo;
    })()
  `);
  ok(res32, "32. preservarFocoElemento restaurou o foco no campo após re-render");

  // 33. Preservação da posição de rolagem em containers de tarefas
  const res33 = ev(`
    (() => {
      const cont = document.createElement("div");
      cont.scrollTop = 120;
      const salvo = preservarPosicaoScrollContainer(cont, () => {});
      return salvo === 120;
    })()
  `);
  ok(res33, "33. preservarPosicaoScrollContainer salvou e restaurou scrollTop");

  // 34. Pool de contexto 2D e dimensões de Canvas para partículas
  const res34 = ev(`
    (() => {
      const c = document.createElement("canvas");
      c.width = 300;
      c.height = 150;
      const p1 = obterPoolCanvasParticulas(c);
      const p2 = obterPoolCanvasParticulas(c);
      return p1 && p1 === p2 && p1.largura === 300;
    })()
  `);
  ok(res34, "34. obterPoolCanvasParticulas reutilizou cache de contexto e dimensões");

  // 35. Cache seletivo em Map de elementos DOM frequentes
  const res35 = ev(`
    (() => {
      const el = document.createElement("div");
      el.id = "el-cache-35";
      document.body.appendChild(el);
      const obtido1 = obterElementoCache("el-cache-35");
      const obtido2 = obterElementoCache("el-cache-35");
      document.body.removeChild(el);
      return obtido1 === el && obtido2 === el;
    })()
  `);
  ok(res35, "35. obterElementoCache retornou e memorizou elemento do DOM");

  // 36. Download nativo de backup JSON no navegador via Blob
  const res36 = ev(`
    (() => {
      return typeof baixarBackupJsonNavegador === "function" &&
        baixarBackupJsonNavegador({ app: "prumo" }, "teste.json");
    })()
  `);
  ok(res36, "36. baixarBackupJsonNavegador executou fluxo nativo de Blob e download");

  // 37. Download nativo de arquivo de calendário ICS via Blob
  const res37 = ev(`
    (() => {
      return typeof baixarArquivoIcsNavegador === "function" &&
        baixarArquivoIcsNavegador("BEGIN:VCALENDAR\\nEND:VCALENDAR", "evento.ics");
    })()
  `);
  ok(res37, "37. baixarArquivoIcsNavegador executou fluxo nativo de arquivo de calendário");

  // 38. Cálculo correto de prioridades por quantidade de pontos de exclamação
  const res38 = ev(`
    (() => {
      const p1 = calcularPrioridadeExclamacoes("!");
      const p2 = calcularPrioridadeExclamacoes("!!");
      const p3 = calcularPrioridadeExclamacoes("!!!");
      return p1 === 1 && p2 === 2 && p3 === 3;
    })()
  `);
  ok(res38, "38. calcularPrioridadeExclamacoes mapeou ! (1), !! (2) e !!! (3)");

  // 39. Verificação de cota excedida de armazenamento no LocalStorage
  const res39 = ev(`
    (() => {
      const errQuota = { name: "QuotaExceededError", code: 22 };
      const resQ = verificarCotaArmazenamento(errQuota);
      const errNormal = new Error("Erro comum");
      const resN = verificarCotaArmazenamento(errNormal);
      return resQ.excedeu === true && resN.excedeu === false;
    })()
  `);
  ok(res39, "39. verificarCotaArmazenamento identificou QuotaExceededError e mensagens");

  // 40. Tratamento global de atalhos de teclado (1-5 abas, N nova tarefa, Esc fechar)
  const res40 = ev(`
    (() => {
      let chamadaAba = null;
      let chamouNova = false;
      let chamouFechar = false;
      const a1 = tratarAtalhoTecladoGeral({ key: "2", target: document.body }, a => { chamadaAba = a; });
      const aN = tratarAtalhoTecladoGeral({ key: "n", target: document.body }, null, () => { chamouNova = true; });
      const aEsc = tratarAtalhoTecladoGeral({ key: "Escape", target: document.body }, null, null, () => { chamouFechar = true; });
      return a1 === "estudos" && chamadaAba === "estudos" && chamouNova && chamouFechar;
    })()
  `);
  ok(res40, "40. tratarAtalhoTecladoGeral disparou callbacks de abas, nova tarefa e Escape");

  await fechar();
  return erros;
};
