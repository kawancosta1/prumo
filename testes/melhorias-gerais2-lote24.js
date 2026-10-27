// Testes Novas Melhorias Gerais: Lote 24 (Itens 231 a 240)
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

  // 231. Bilhete encantado para parceiro de hbitos
  const res231 = ev(`
    (() => {
      const b = gerarBilheteEncantadoParceria("Alice", "Bora treinar!");
      return b.remetente === "Alice" && b.mensagem === "Bora treinar!" && typeof b.timestamp === "number";
    })()
  `);
  ok(res231, "231. gerarBilheteEncantadoParceria estruturou recado afetivo");

  // 232. ndice de harmonia mtua da dupla
  const res232 = ev(`
    (() => {
      const h1 = calcularIndiceHarmoniaDupla(8, 10);
      const h2 = calcularIndiceHarmoniaDupla(2, 10);
      return h1.porcentagem === 80 && h1.harmonia === "Alta Sintonia" && h2.porcentagem === 20;
    })()
  `);
  ok(res232, "232. calcularIndiceHarmoniaDupla mensurou concluso conjunta");

  // 233. Contagem regressiva para data especial da dupla
  const res233 = ev(`
    (() => {
      const d = gerarLembreteDataEspecialParceria("2026-11-01", "2026-10-27");
      return d.diasRestantes === 5 && d.ehHoje === false;
    })()
  `);
  ok(res233, "233. gerarLembreteDataEspecialParceria computou dias at aniversrio/marco");

  // 234. Mural de fotos com polaroids da dupla
  const res234 = ev(`
    (() => {
      const m = formatarMuralFotograficoDupla([
        { url: "foto1.jpg", legenda: "Piquenique" },
        { url: "foto2.jpg" }
      ]);
      return m.total === 2 && m.fotosValidas[0].legenda === "Piquenique";
    })()
  `);
  ok(res234, "234. formatarMuralFotograficoDupla validou registros de memrias");

  // 235. Voto de compromisso semanal mtuo
  const res235 = ev(`
    (() => {
      const v = gerarVotoCompromissoSemanal("Beber 2L de gua juntos");
      return v.meta === "Beber 2L de gua juntos" && v.cumprido === false;
    })()
  `);
  ok(res235, "235. gerarVotoCompromissoSemanal formalizou meta em dupla");

  // 236. Contador de abraos virtuais trocados
  const res236 = ev(`
    (() => {
      const a = calcularContadorAbracosVirtuais(15);
      return a.total === 15 && a.calorAfeto === "Muito carinho";
    })()
  `);
  ok(res236, "236. calcularContadorAbracosVirtuais computou afeto acumulado");

  // 237. Mensagens de incentivo em udio/fala para o parceiro
  const res237 = ev(`
    (() => {
      const m = gerarMensagemVozFofaParceiro("animado");
      return typeof m.audioTexto === "string" && m.audioTexto.length > 0;
    })()
  `);
  ok(res237, "237. gerarMensagemVozFofaParceiro gerou mensagem adaptada ao humor");

  // 238. Controle de privacidade de tarefas no modo dupla
  const res238 = ev(`
    (() => {
      const p1 = validarStatusPrivacidadeRecado(true);
      const p2 = validarStatusPrivacidadeRecado(false);
      return p1.visibilidade === "privado" && p2.visibilidade === "publico";
    })()
  `);
  ok(res238, "238. validarStatusPrivacidadeRecado filtrou visibilidade");

  // 239. Pomodoro compartilhado sincronizado
  const res239 = ev(`
    (() => {
      const s1 = gerarSincronizacaoRitmoPomodoro(25, 25);
      const s2 = gerarSincronizacaoRitmoPomodoro(25, 10);
      return s1.sincronizados === true && s2.sincronizados === false && s2.diferencaMinutos === 15;
    })()
  `);
  ok(res239, "239. gerarSincronizacaoRitmoPomodoro verificou foco simultneo");

  // 240. Emblema comemorativo de casal/parceiro produtivo
  const res240 = ev(`
    (() => {
      const e1 = calcularEmblemaCasalProdutivo(35);
      const e2 = calcularEmblemaCasalProdutivo(5);
      return e1.estrelas === 3 && e2.estrelas === 1;
    })()
  `);
  ok(res240, "240. calcularEmblemaCasalProdutivo premiou frequncia da parceria");

  await fechar();
  return erros;
};
