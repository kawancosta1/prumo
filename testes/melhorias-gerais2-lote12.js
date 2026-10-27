// Testes Novas Melhorias Gerais: Lote 12 (Itens 111 a 120)
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

  // 111. Parser de tags livres (#tag) além das 4 fixas
  const res111 = ev(`
    (() => {
      const tags = extrairTagsPersonalizadas("Reunião com #cliente e #urgente hoje");
      return tags.length === 2 && tags.includes("#cliente") && tags.includes("#urgente");
    })()
  `);
  ok(res111, "111. extrairTagsPersonalizadas extraiu tags livres customizadas");

  // 112. Filtro de tarefas por tags personalizadas
  const res112 = ev(`
    (() => {
      const tarefas = [
        { id: 1, title: "Comprar pão #casa" },
        { id: 2, title: "Relatório #trabalho" }
      ];
      const filtradas = filtrarTarefasPorTags(tarefas, ["#casa"]);
      return filtradas.length === 1 && filtradas[0].id === 1;
    })()
  `);
  ok(res112, "112. filtrarTarefasPorTags filtrou tarefas por tag correspondente");

  // 113. Cálculo de sobrecarga de horas planejadas no dia (> 8h)
  const res113 = ev(`
    (() => {
      const tNormais = [{ dur: 120 }, { dur: 180 }]; // 300 min (5h)
      const tPesadas = [{ dur: 300 }, { dur: 240 }]; // 540 min (9h)
      const c1 = calcularCargaHorariaPlanejadaDia(tNormais, 480);
      const c2 = calcularCargaHorariaPlanejadaDia(tPesadas, 480);
      return !c1.sobrecarregado && c2.sobrecarregado === true && c2.horas === 9;
    })()
  `);
  ok(res113, "113. calcularCargaHorariaPlanejadaDia alertou sobrecarga ao passar de 8h");

  // 114. Reordenação de tarefas por drag-and-drop
  const res114 = ev(`
    (() => {
      const t = [{ id: "a" }, { id: "b" }, { id: "c" }];
      const reord = reordenarTarefasOrdemManual(t, "c", "a");
      return reord[0].id === "c" && reord[1].id === "a";
    })()
  `);
  ok(res114, "114. reordenarTarefasOrdemManual moveu item para nova posição");

  // 115. Execução de ações em lote em tarefas selecionadas
  const res115 = ev(`
    (() => {
      const t = [{ id: "1", done: false }, { id: "2", done: false }];
      const concluidas = executarAcaoEmLoteTarefas(t, ["1", "2"], "concluir");
      return concluidas.every(x => x.done === true);
    })()
  `);
  ok(res115, "115. executarAcaoEmLoteTarefas concluiu tarefas em lote");

  // 116. Busca textual em tarefas ignorando acentos e maiúsculas
  const res116 = ev(`
    (() => {
      const t = [{ title: "Relatório de Gestão" }, { title: "Comprar café" }];
      const r = filtrarTarefasTextoBusca(t, "gestao");
      return r.length === 1 && r[0].title.includes("Gestão");
    })()
  `);
  ok(res116, "116. filtrarTarefasTextoBusca realizou busca sem sensibilidade a acento");

  // 117. Templates prontos de rotinas diárias
  const res117 = ev(`
    (() => {
      const mat = gerarTemplateRotina("matinal");
      return Array.isArray(mat) && mat.length >= 3 && mat[0].title.includes("Alongamento");
    })()
  `);
  ok(res117, "117. gerarTemplateRotina retornou modelo estruturado de rotina");

  // 118. Contador e formato humanizado de dias de atraso de tarefa
  const res118 = ev(`
    (() => {
      const at = calcularContadorDiasAtrasoTarefa("2026-10-24", "2026-10-27");
      return at.atrasada === true && at.dias === 3 && at.texto.includes("3 dias");
    })()
  `);
  ok(res118, "118. calcularContadorDiasAtrasoTarefa quantificou dias em atraso");

  // 119. Duplicação de tarefa com subtarefas
  const res119 = ev(`
    (() => {
      const t = { id: "t1", title: "Projeto", sub: [{ id: "s1", t: "Etapa 1" }] };
      const dup = duplicarTarefaComSubtarefas(t);
      return dup.id !== "t1" && dup.title.includes("cópia") && dup.sub.length === 1 && dup.sub[0].id !== "s1";
    })()
  `);
  ok(res119, "119. duplicarTarefaComSubtarefas gerou cópia completa com novos IDs");

  // 120. Envio de tarefa para lixeira temporária com expiração
  const res120 = ev(`
    (() => {
      const item = gerarItemLixeira({ id: "t9", title: "Excluída" }, 7);
      return item.itemOriginal.id === "t9" && typeof item.expiraEm === "string";
    })()
  `);
  ok(res120, "120. gerarItemLixeira moveu item para retenção temporária de 7 dias");

  await fechar();
  return erros;
};
