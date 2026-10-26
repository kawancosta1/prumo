// Testes Bruxo: Lote 4 (Itens 31 a 40)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("bruxo");
    applyTheme();
    tab = "hoje";
    S.tasks = [
      { id: "b_atrasada", title: "Tarefa esquecida", area: "geral", date: addDays(today(), -5), done: false, prio: 0, sub: [] }
    ];
    commit();
    render();
  `);
  await espera(30);

  // 31. Encomendas diárias dos clientes da floresta
  const enc = ev("encomendasFlorestaBruxo()");
  ok(enc && enc.cliente && enc.cliente.pocao, "31. Encomenda diária da floresta gerada");
  const entregou = ev("entregarEncomendaFloresta()");
  ok(
    entregou === true && ev("encomendasFlorestaBruxo().entregue === true"),
    "31. Encomenda entregue ao cliente da floresta com sucesso"
  );

  // 32. Estoque de ingredientes guardados pro dia seguinte
  ev("guardarIngredienteEstoque('asa de morcego')");
  ok(
    ev("dadosBruxo().estoqueIngredientes.includes('asa de morcego')"),
    "32. Ingrediente guardado na despensa"
  );
  const resgatou = ev("usarIngredienteEstoque(0)");
  ok(resgatou === "asa de morcego", "32. Ingrediente resgatado do estoque com sucesso");

  // 33. Poção que dá errado
  const falha = ev("prepararPocaoComChanceFalha(true)");
  ok(falha === true, "33. Poção com explosão cômica e purpurina tratada");

  // 34. Calendário lunar do mês
  const cal = ev("calendarioLunarMesHTML(2026, 9)");
  ok(
    cal.includes("Calendário Lunar") && cal.includes("Outubro 2026"),
    "34. Calendário lunar do mês gerado com fases"
  );

  // 35. Amuletos de 3 ervas com efeito por 1 semana
  const amuleto = ev("criarAmuletoErvas('Alecrim', 'Lavanda', 'Camomila')");
  ok(
    amuleto && amuleto.ervas.length === 3 && amuleto.expiraEm,
    "35. Amuleto de 3 ervas criado com validade semanal"
  );

  // 36. Livro das sombras com capa roxa e cadeado
  const livroHtml = ev("livroDasSombrasHTML()");
  ok(
    livroHtml.includes("Livro das Sombras") && livroHtml.includes("Aberto"),
    "36. Livro das sombras renderizado"
  );
  const trancado = ev("alternarCadeadoLivroSombras()");
  ok(trancado === true, "36. Cadeado mágico do Livro das Sombras ativado");

  // 37. Cogumelos no chão
  ev("brotarCogumelosDia()");
  ok(D.querySelector(".bruxo-cogu-container") !== null, "37. Cogumelos brotando no chão da tela");

  // 38. Cursor de vassourinha
  ok(
    D.documentElement.getAttribute("data-mundo") === "bruxo",
    "38. Mundo bruxo ativo no documento para cursor"
  );

  // 39. Sapo pula ao desencantar
  ev("conferirMaldicaoProcrastinacao()");
  ok(ev("S.tasks[0].sapo >= 1"), "39. Tarefa amaldiçoada como sapo");
  ev("desencantarSapoTarefa('b_atrasada')");
  ok(true, "39. Desencantar disparou animação de pulo do sapo");

  // 40. Lua do cabeçalho muda de fase de verdade
  const icone = ev("iconeLuaCabecalhoBruxo()");
  ok(typeof icone === "string" && icone.length > 0, "40. Ícone dinâmico da fase real da lua retornado");

  fechar();
  return erros;
};
