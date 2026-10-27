// Testes Melhorias Gerais: Lote 16 (Itens 151 a 160)
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

  // 151. Clube do livro compartilhado sem spoilers
  const res151 = ev(`
    (() => {
      const comentarios = [
        { autor: "Bia", pagina: 20, texto: "Começo empolgante!" },
        { autor: "Leo", pagina: 120, texto: "O vilão foi revelado!" }
      ];
      const html = clubeLivroSemSpoilerHTML(comentarios, 50);
      return html.includes("Começo empolgante!") &&
        html.includes("spoiler-oculto") &&
        html.includes("O vilão foi revelado!");
    })()
  `);
  ok(res151, "151. clubeLivroSemSpoilerHTML protegeu comentários além da página atual");

  // 152. Metas de leitura compartilhadas colaborativas
  const res152 = ev(`
    (() => {
      const meta = metaLeituraColaborativa(200, [
        { membro: "Eu", paginas: 120 },
        { membro: "Carlos", paginas: 90 }
      ]);
      return meta.totalLido === 210 &&
        meta.progressoPct === 100 &&
        meta.medalha.includes("Diamante");
    })()
  `);
  ok(res152, "152. metaLeituraColaborativa consolidou progresso em equipe");

  // 153. Empréstimo de livros com data de devolução
  const res153 = ev(`
    (() => {
      const emp = registrarEmprestimoLivro("livro_12", "Lucas", "2026-12-31");
      return emp.livroId === "livro_12" &&
        emp.amigoNome === "Lucas" &&
        emp.atrasado === false;
    })()
  `);
  ok(res153, "153. registrarEmprestimoLivro anotou empréstimo e prazos");

  // 154. Feed de reações carinhosas com gotas mágicas
  const res154 = ev(`
    (() => {
      const reacao = reagirComGotasAmigo("amigo_bia", 3, "Mandou bem!");
      return reacao.amigoId === "amigo_bia" &&
        reacao.gotasEnviadas === 3 &&
        reacao.mensagem === "Mandou bem!";
    })()
  `);
  ok(res154, "154. reagirComGotasAmigo enviou gotas e mensagem de incentivo");

  // 155. Desafio semanal de produtividade em dupla
  const res155 = ev(`
    (() => {
      const desafio = desafioProdutividadeDupla({ pontos: 35 }, { pontos: 25 }, 50);
      return desafio.totalPontos === 60 && desafio.atingida === true;
    })()
  `);
  ok(res155, "155. desafioProdutividadeDupla apurou meta colaborativa de produtividade");

  // 156. Calculadora de ingestão ideal de água por peso
  const res156 = ev(`
    (() => {
      const c1 = calcularMetaAguaPeso(70, "leve");
      const c2 = calcularMetaAguaPeso(70, "intenso");
      return c1.metaDiariaMl === 2450 && c2.metaDiariaMl === 3450 && c1.coposRecomendados === 10;
    })()
  `);
  ok(res156, "156. calcularMetaAguaPeso calculou hidratação personalizada por peso e rotina");

  // 157. Busca com pesquisa fonética e aproximada
  const res157 = ev(`
    (() => {
      const lista = ["Relatório Mensal", "Comprar café", "Academia"];
      const achouComAcento = buscaFoneticaAproximada("relatorio", lista);
      const achouErroDigito = buscaFoneticaAproximada("kafe", ["cafe", "cha"]);
      return achouComAcento.length === 1 && achouErroDigito.length >= 1;
    })()
  `);
  ok(res157, "157. buscaFoneticaAproximada localizou termos com tolerância a acentos e digitação");

  // 158. Agendamento visual em linha do tempo diária
  const res158 = ev(`
    (() => {
      const html = linhaDoTempoTarefasHTML([
        { hora: "14:00", titulo: "Reunião" },
        { hora: "09:00", titulo: "Exercício" }
      ]);
      return html.includes("timeline-container") &&
        html.includes("09:00") &&
        html.indexOf("09:00") < html.indexOf("14:00");
    })()
  `);
  ok(res158, "158. linhaDoTempoTarefasHTML ordenou e renderizou cronograma");

  // 159. Notificações inteligentes baseadas no horário de sono
  const res159 = ev(`
    (() => {
      // Dormir 23h, acordar 7h
      const podeTarde = horarioPermitidoNotificar(15, 23, 7);
      const bloqueiaMadrugada = horarioPermitidoNotificar(2, 23, 7);
      const bloqueiaNoite = horarioPermitidoNotificar(23, 23, 7);
      return podeTarde === true && bloqueiaMadrugada === false && bloqueiaNoite === false;
    })()
  `);
  ok(res159, "159. horarioPermitidoNotificar respeitou horários de sono do usuário");

  // 160. Modo offline total com fila resiliente de sincronização
  const res160 = ev(`
    (() => {
      let fila = [];
      fila = filaOfflineSincronia(fila, { tipo: "tarefa", idEntidade: "t1", acao: "criar" });
      fila = filaOfflineSincronia(fila, { tipo: "tarefa", idEntidade: "t1", acao: "editar" });
      return fila.length === 1 && fila[0].acao === "editar";
    })()
  `);
  ok(res160, "160. filaOfflineSincronia deduplicou e enfileirou ações offline com resiliência");

  await fechar();
  return erros;
};
