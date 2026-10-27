// Testes Novas Melhorias Gerais: Lote 21 (Itens 201 a 210)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 201. Taxa percentual semanal de concluso
  const res201 = ev(`
    (() => {
      const res = calcularTaxaConclusaoTarefasSemanal([
        { id: "1", done: true },
        { id: "2", done: false },
        { id: "3", done: true },
        { id: "4", done: true }
      ]);
      return res.taxa === 75 && res.total === 4 && res.concluidas === 3;
    })()
  `);
  ok(res201, "201. calcularTaxaConclusaoTarefasSemanal calculou porcentagem correta");

  // 202. Deteco de tarefas estagnadas h mais de X dias
  const res202 = ev(`
    (() => {
      const agora = Date.now();
      const diaMs = 86400000;
      const tarefas = [
        { id: "t1", texto: "Velha", done: false, dataCriacao: agora - (20 * diaMs) },
        { id: "t2", texto: "Nova", done: false, dataCriacao: agora - (2 * diaMs) }
      ];
      const estagnadas = identificarTarefasEstagnadas(tarefas, 14, agora);
      return estagnadas.length === 1 && estagnadas[0].id === "t1";
    })()
  `);
  ok(res202, "202. identificarTarefasEstagnadas filtrou itens pendentes antigos");

  // 203. Sequenciamento de tarefas com dependncia
  const res203 = ev(`
    (() => {
      const t = [
        { id: "t2", dependeDe: "t1" },
        { id: "t1" },
        { id: "t3" }
      ];
      const seq = gerarSequenciaDependenciaTarefas(t);
      return seq[0].id === "t1" && seq[1].id === "t3" && seq[2].id === "t2";
    })()
  `);
  ok(res203, "203. gerarSequenciaDependenciaTarefas ordenou pr-requisitos primeiro");

  // 204. Horrio ideal sugerido para agendamento
  const res204 = ev(`
    (() => {
      const tarefas = [{ hora: "08:00" }, { hora: "08:30" }, { hora: "09:00" }];
      const livre = calcularHorarioIdealAgendamento(tarefas, 30);
      return livre.slot === "09:30 - 10:00";
    })()
  `);
  ok(res204, "204. calcularHorarioIdealAgendamento identificou slot livre");

  // 205. Agrupamento por nvel de esforo estimado
  const res205 = ev(`
    (() => {
      const t = [
        { id: "1", duracaoMinutos: 15 },
        { id: "2", duracaoMinutos: 45 },
        { id: "3", duracaoMinutos: 90 }
      ];
      const grp = agruparTarefasPorNivelEsforco(t);
      return grp.baixo.length === 1 && grp.medio.length === 1 && grp.alto.length === 1;
    })()
  `);
  ok(res205, "205. agruparTarefasPorNivelEsforco categorizou esforco por duracao");

  // 206. Relatrio sinttico de tarefas arquivadas
  const res206 = ev(`
    (() => {
      const arq = [
        { id: "1", categoria: "trabalho", dataCriacao: 1000 },
        { id: "2", categoria: "estudo", dataCriacao: 500 }
      ];
      const rel = gerarRelatorioTarefasArquivadas(arq);
      return rel.total === 2 && rel.porCategoria.trabalho === 1 && rel.maisAntiga.id === "2";
    })()
  `);
  ok(res206, "206. gerarRelatorioTarefasArquivadas agregou historico");

  // 207. Validador de conciso do ttulo da tarefa
  const res207 = ev(`
    (() => {
      const vCurto = validarTituloTarefaConciso("Ler captulo 3", 50);
      const vLongo = validarTituloTarefaConciso("A".repeat(60), 50);
      return vCurto.valido === true && vLongo.valido === false && vLongo.excedente === 10;
    })()
  `);
  ok(res207, "207. validarTituloTarefaConciso checou limite de caracteres");

  // 208. Clculo de economia de tempo por automaes
  const res208 = ev(`
    (() => {
      const res = calcularEconomiaTempoPorAutomacao(12, 10);
      return res.minutos === 120 && res.horasFormatadas === "2h 0min";
    })()
  `);
  ok(res208, "208. calcularEconomiaTempoPorAutomacao calculou tempo economizado");

  // 209. Sugesto inteligente de descanso ps-foco
  const res209 = ev(`
    (() => {
      const p1 = gerarSugestaoPausaAposBlocoTarefas(45);
      const p2 = gerarSugestaoPausaAposBlocoTarefas(150);
      return p1.pausaSugeridaMin === 5 && p2.pausaSugeridaMin === 25;
    })()
  `);
  ok(res209, "209. gerarSugestaoPausaAposBlocoTarefas sugeriu pausa proporcional");

  // 210. Exportao de tarefas em Markdown
  const res210 = ev(`
    (() => {
      const md = exportarTarefasParaFormatoMarkdown([
        { texto: "Comprar po", done: true },
        { texto: "Estudar JS", done: false }
      ]);
      return md.includes("- [x] Comprar po") && md.includes("- [ ] Estudar JS");
    })()
  `);
  ok(res210, "210. exportarTarefasParaFormatoMarkdown formatou checklist legvel");

  await fechar();
  return erros;
};
