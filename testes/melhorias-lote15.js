// Testes Melhorias Gerais: Lote 15 (Itens 141 a 150)
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

  // 141. Fichas de estudo com repetição espaçada SM-2
  const res141 = ev(`
    (() => {
      const r1 = calcularProximaRevisaoSM2(2.5, 0, 1, 5);
      const r2 = calcularProximaRevisaoSM2(r1.fatorFacilidade, r1.repeticoes, r1.intervaloDias, 5);
      return r1.repeticoes === 1 && r1.intervaloDias === 1 && r2.intervaloDias === 6;
    })()
  `);
  ok(res141, "141. calcularProximaRevisaoSM2 computou progressão de revisões espaçadas");

  // 142. Modo Prova com contagem regressiva e distribuição
  const res142 = ev(`
    (() => {
      const plano = planoRevisaoProva(3, ["Álgebra", "Geometria", "Probabilidade"]);
      return Array.isArray(plano) && plano.length === 3 && plano[2].ehSimulado === true;
    })()
  `);
  ok(res142, "142. planoRevisaoProva distribuiu tópicos pelos dias até a prova");

  // 143. Histórico comparativo de hidratação semanal
  const res143 = ev(`
    (() => {
      const comp = comparativoAguaSemanal([2000, 2500, 1800, 2200], 2000);
      return comp.total === 8500 && comp.melhorDia === 2500 && comp.mediaDiaria > 2000;
    })()
  `);
  ok(res143, "143. comparativoAguaSemanal calculou médias e pico de consumo hídrico");

  // 144. Rotina matinal guiada no Hoje
  const res144 = ev(`
    (() => {
      const html = rotinaMatinalHojeHTML(["Copo de agua", "Revisao"]);
      return html.includes("card-rotina-matinal") &&
        html.includes("Copo de agua") &&
        html.includes("Revisao");
    })()
  `);
  ok(res144, "144. rotinaMatinalHojeHTML gerou card matinal motivador");

  // 145. Resumo executivo de encerramento do dia
  const res145 = ev(`
    (() => {
      const html = resumoEncerramentoDiaHTML({ tarefasFeitas: 6, gotasGanhas: 18 });
      return html.includes("card-resumo-encerramento") &&
        html.includes("6") &&
        html.includes("18💧");
    })()
  `);
  ok(res145, "145. resumoEncerramentoDiaHTML montou fechamento noturno produtivo");

  // 146. Agrupamento de tarefas por contexto e tags
  const res146 = ev(`
    (() => {
      const tarefas = [
        { titulo: "Comprar leite #casa" },
        { titulo: "Enviar relatório #trabalho" },
        { titulo: "Pagar conta #casa" },
        { titulo: "Ler 10 páginas" }
      ];
      const g = agruparTarefasPorTags(tarefas);
      return g.casa.length === 2 && g.trabalho.length === 1 && g.geral.length === 1;
    })()
  `);
  ok(res146, "146. agruparTarefasPorTags categorizou itens por hashtags de contexto");

  // 147. Exportação e importação em formato Markdown
  const res147 = ev(`
    (() => {
      const lista = [
        { titulo: "Comprar pão", feita: true },
        { titulo: "Estudar lógica", feita: false }
      ];
      const md = exportarTarefasMarkdown(lista);
      const importadas = importarTarefasMarkdown(md);
      return importadas.length === 2 &&
        importadas[0].feita === true &&
        importadas[0].titulo === "Comprar pão" &&
        importadas[1].feita === false;
    })()
  `);
  ok(res147, "147. exportarTarefasMarkdown e importarTarefasMarkdown converteram perfeitamente");

  // 148. Pareamento rápido entre dispositivos via QR Code ou Link seguro
  const res148 = ev(`
    (() => {
      const payload = gerarPayloadPareamento({ tarefas: [{ id: "t1" }], gotas: 10 });
      return typeof payload === "string" && payload.length > 0;
    })()
  `);
  ok(res148, "148. gerarPayloadPareamento comprimiu dados essenciais para pareamento");

  // 149. Resolução visual de conflitos de sincronia
  const res149 = ev(`
    (() => {
      const loc = [{ id: "t1", titulo: "Versão Local", atualizadoEm: 200 }];
      const rem = [{ id: "t1", titulo: "Versão Remota", atualizadoEm: 100 }];
      const fusao = resolverConflitoSincronia(loc, rem);
      return fusao.length === 1 && fusao[0].titulo === "Versão Local";
    })()
  `);
  ok(res149, "149. resolverConflitoSincronia unificou tarefas preservando estado mais recente");

  // 150. Música ambiente binaural sintetizada para estudos
  const res150 = ev(`
    (() => {
      const conexoes = [];
      window.AudioContext = class {
        constructor() {
          this.currentTime = 0;
          this.destination = {};
        }
        createOscillator() {
          return {
            frequency: { setValueAtTime: () => {} },
            connect: dest => conexoes.push(dest),
            start: () => {},
            stop: () => {}
          };
        }
        createGain() {
          return {
            gain: { setValueAtTime: () => {} },
            connect: dest => conexoes.push(dest)
          };
        }
      };
      const som = iniciarSonsBinaurais(200, 10);
      delete window.AudioContext;
      if (som && typeof som.parar === "function") {
        som.parar();
        return conexoes.length >= 3;
      }
      return false;
    })()
  `);
  ok(res150, "150. iniciarSonsBinaurais ativou osciladores de frequências binaurais");

  await fechar();
  return erros;
};
