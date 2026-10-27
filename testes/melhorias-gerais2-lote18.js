// Testes Novas Melhorias Gerais: Lote 18 (Itens 171 a 180)
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

  // 171. Probabilidade matemática de consolidação de hábito (regra dos 66 dias)
  const res171 = ev(`
    (() => {
      const p10 = calcularProbabilidadeSucessoHabito(10);
      const p70 = calcularProbabilidadeSucessoHabito(70);
      return p10.consolidado === false && p70.consolidado === true && p70.probabilidadePct > 90;
    })()
  `);
  ok(res171, "171. calcularProbabilidadeSucessoHabito mapeou consolidação pela regra dos 66 dias");

  // 172. Criação de gatilho de hábito encadeado (Habit Stacking)
  const res172 = ev(`
    (() => {
      const frase = gerarGatilhoHabitoEncaixado("almoçar", "ler 10 páginas");
      return frase.includes("Depois de almoçar") && frase.includes("ler 10 páginas");
    })()
  `);
  ok(res172, "172. gerarGatilhoHabitoEncaixado formulou gatilho de encadeamento de hábitos");

  // 173. Análise de obstáculos e motivos de falha de hábito
  const res173 = ev(`
    (() => {
      const d = avaliarMotivoFalhaHabito("cansaco");
      return d.includes("primeiras horas da manhã");
    })()
  `);
  ok(res173, "173. avaliarMotivoFalhaHabito forneceu contra-estratégia para o cansaço");

  // 174. Estrutura de desafio de 21 dias com marcos
  const res174 = ev(`
    (() => {
      const des = gerarDesafioHabito21Dias("Caminhada", "2026-10-27");
      return des.marcos.length === 3 && des.marcos[2].dia === 21;
    })()
  `);
  ok(res174, "174. gerarDesafioHabito21Dias estruturou marcos no 7º, 14º e 21º dias");

  // 175. Cálculo de tempo e dinheiro poupados ao evitar hábitos nocivos
  const res175 = ev(`
    (() => {
      const r = calcularTempoEconomizadoHabitosRuins(30, 20, 10); // 30min x 10 = 5h, R$20 x 10 = R$200
      return r.horasTotaisPoupadas === 5 && r.reaisPoupados === 200;
    })()
  `);
  ok(res175, "175. calcularTempoEconomizadoHabitosRuins quantificou horas e economia financeira");

  // 176. Círculo íntimo prioritário de contatos (Top 5)
  const res176 = ev(`
    (() => {
      const pessoas = [
        { id: 1, favorito: true },
        { id: 2, favorito: false },
        { id: 3, favorito: true }
      ];
      const circulo = agruparCirculoSocialIntimo(pessoas, 5);
      return circulo.length === 2 && circulo[0].id === 1;
    })()
  `);
  ok(res176, "176. agruparCirculoSocialIntimo filtrou os contatos favoritos");

  // 177. Lembrete de retorno de mensagens pendentes
  const res177 = ev(`
    (() => {
      const lembrete = gerarLembreteRetornoMensagem("Marina", "Trabalho de Biologia");
      return lembrete.nome === "Marina" && lembrete.lembrete.includes("Trabalho de Biologia");
    })()
  `);
  ok(res177, "177. gerarLembreteRetornoMensagem formatou alerta de conversa pendente");

  // 178. Média móvel semanal de humor e bem-estar
  const res178 = ev(`
    (() => {
      const b = calcularIndiceBemEstarEmocional([4, 5, 4, 5]);
      return b.media === 4.5 && b.estado === "otimo";
    })()
  `);
  ok(res178, "178. calcularIndiceBemEstarEmocional calculou média móvel e classificação de bem-estar");

  // 179. Texto motivador de incentivo para enviar a amigos
  const res179 = ev(`
    (() => {
      const msg = gerarMensagemIncentivoAmigo("Diego", "provas");
      return msg.includes("Diego") && msg.includes("provas") && msg.includes("Bora");
    })()
  `);
  ok(res179, "179. gerarMensagemIncentivoAmigo compôs mensagem motivacional pronta");

  // 180. Cartão estruturado de gratidão noturna
  const res180 = ev(`
    (() => {
      const c = formatarRegistroGratidaoDiario(["Saúde", "Paz", "Família"]);
      return c.itens.length === 3 && c.formatadoHtml.includes("Saúde");
    })()
  `);
  ok(res180, "180. formatarRegistroGratidaoDiario organizou lista noturna de gratidão");

  await fechar();
  return erros;
};
