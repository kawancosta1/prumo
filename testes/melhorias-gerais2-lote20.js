// Testes Novas Melhorias Gerais: Lote 20 (Itens 191 a 200)
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

  // 191. Índice composto de felicidade geral do mascote (0-100)
  const res191 = ev(`
    (() => {
      const f1 = calcularNivelFelicidadeGeralMascote(4, 90, 50);
      const f2 = calcularNivelFelicidadeGeralMascote(0, 10, 0);
      return f1.felicidade >= 80 && f1.estado === "radiante" && f2.estado === "preocupado";
    })()
  `);
  ok(res191, "191. calcularNivelFelicidadeGeralMascote calculou humor composto ponderado");

  // 192. Cenário automático por estação climática e hora
  const res192 = ev(`
    (() => {
      const cVerao = obterCenarioPorEstacaoClima(1, "dia");
      const cInverno = obterCenarioPorEstacaoClima(7, "noite");
      return cVerao.estacao === "verao" && cInverno.estacao === "inverno";
    })()
  `);
  ok(res192, "192. obterCenarioPorEstacaoClima alternou ambiente por estação e período");

  // 193. Personalização de cores em camisetas e itens básicos
  const res193 = ev(`
    (() => {
      const p = gerarPaletaPersonalizadaRoupa("#ff5722", "#ffffff");
      return p.primaria === "#ff5722" && p.classeCss === "roupa-customizada";
    })()
  `);
  ok(res193, "193. gerarPaletaPersonalizadaRoupa gerou paleta customizada para vestimentas");

  // 194. Levitação e brilho áureo para itens de raridade lendária
  const res194 = ev(`
    (() => {
      const div = document.createElement("div");
      const ok = aplicarEfeitoLevitacaoItemRaro(div, "lendario");
      return ok && div.classList.contains("item-lendario-levitando");
    })()
  `);
  ok(res194, "194. aplicarEfeitoLevitacaoItemRaro aplicou flutuação e brilho dourado");

  // 195. Suporte estrutural ao slot de sapatos no modelo do mascote
  const res195 = ev(`
    (() => {
      const s = gerarSlotVisualSapatos("sneakers_vermelho", "#f44336");
      return s.slot === "shoes" && s.id === "sneakers_vermelho";
    })()
  `);
  ok(res195, "195. gerarSlotVisualSapatos estruturou calçado para o mascote");

  // 196. Ativação de comemoração especial no dia do aniversário do usuário
  const res196 = ev(`
    (() => {
      const bdaySim = verificarAniversarioUsuarioHoje("2000-10-27", "2026-10-27");
      const bdayNao = verificarAniversarioUsuarioHoje("2000-05-15", "2026-10-27");
      return bdaySim === true && bdayNao === false;
    })()
  `);
  ok(res196, "196. verificarAniversarioUsuarioHoje disparou comemoração no dia do aniversário");

  // 197. Falas contextuais do Prumi baseadas na matéria de estudo
  const res197 = ev(`
    (() => {
      const f = gerarFrasesContextuaisMateria("Física", "zen");
      return f.includes("Física");
    })()
  `);
  ok(res197, "197. gerarFrasesContextuaisMateria gerou fala contextual por matéria");

  // 198. Multiplicador de bônus de gotas por dias ininterruptos
  const res198 = ev(`
    (() => {
      const m0 = calcularMultiplicadorGotasBonus(1);
      const m7 = calcularMultiplicadorGotasBonus(7);
      const m30 = calcularMultiplicadorGotasBonus(35);
      return m0 === 1.0 && m7 === 1.2 && m30 === 1.5;
    })()
  `);
  ok(res198, "198. calcularMultiplicadorGotasBonus concedeu bônus multiplicador progressivo");

  // 199. Pacote de presente virtual com dedicatória
  const res199 = ev(`
    (() => {
      const p = gerarCartaoPresenteItemLoja({ id: "pet_coruja" }, "Amigo");
      return p.itemId === "pet_coruja" && p.destinatario === "Amigo";
    })()
  `);
  ok(res199, "199. gerarCartaoPresenteItemLoja empacotou presente com dedicatória");

  // 200. Troféu comemorativo anual retrospectivo
  const res200 = ev(`
    (() => {
      const t = gerarTrofeuComemorativoAno({ tasks: 250, water: 90000, focus: 3600 });
      return t.tarefasTotais === 250 && t.litrosAguaTotais === 90 && t.horasFocoTotais === 60;
    })()
  `);
  ok(res200, "200. gerarTrofeuComemorativoAno estruturou troféu anual com marcos concluídos");

  await fechar();
  return erros;
};
