// Testes Melhorias Gerais: Lote 6 (Itens 51 a 60)
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

  // 51. Limitação de intervalo de datas
  const intOk = ev("limitarIntervaloDatas('2026-01-01', '2026-01-10', 30)");
  const intLongo = ev("limitarIntervaloDatas('2026-01-01', '2027-01-01', 30)");
  const intInvalido = ev("limitarIntervaloDatas('2026-05-01', '2026-04-01', 30)");
  ok(intOk && intOk.dias === 9, "51. Intervalo válido calculado");
  ok(intLongo && intLongo.dias === 30, "51. Intervalo longo limitado ao teto seguro");
  ok(intInvalido === null, "51. Intervalo invertido rejeitado");

  // 52. Anonimização de feedback
  const anon = ev("anonimizarPayloadFeedback({ mensagem: '<script>x</script>Bug', tipo: 'erro' })");
  ok(
    anon && !anon.mensagem.includes("<script>") && anon.versao === "2.0",
    "52. Payload de feedback limpo e anonimizado"
  );

  // 53. Proteção e congelamento de objetos
  ev(`
    const config = { modo: "estrito", temas: { a: 1 } };
    protegerObjetosEstaticos(config);
    window._congelado = Object.isFrozen(config) && Object.isFrozen(config.temas);
  `);
  ok(ev("window._congelado === true"), "53. Objeto profundamente congelado contra mutações");

  // 54. Detecção de Honeypot
  ok(ev("verificarHoneypot('robô') === true"), "54. Preenchimento de campo honeypot detectado");
  ok(ev("verificarHoneypot('') === false"), "54. Campo honeypot vazio validado como humano");

  // 55. Modal de confirmação dupla
  ev(`
    modalConfirmacaoDupla("Apagar Tudo?", "Esta ação não pode ser desfeita.", () => {
      window._confirmou = true;
    });
  `);
  const overlay = D.querySelector(".modal-overlay");
  ok(overlay !== null, "55. Modal de confirmação dupla renderizado");
  const btnConfirma = overlay.querySelector("[data-btn-confirma]");
  btnConfirma.click();
  ok(ev("window._confirmou === true"), "55. Callback de confirmação executado");

  // 56. Atualização cirúrgica do DOM
  ev(`
    const div = document.createElement("div");
    div.id = "alvo-cirurgico";
    div.innerHTML = "Original";
    document.body.appendChild(div);
  `);
  const mudou = ev("atualizarElementoSeletivo('#alvo-cirurgico', 'Novo')");
  const repetiu = ev("atualizarElementoSeletivo('#alvo-cirurgico', 'Novo')");
  ok(mudou === true, "56. Atualização cirúrgica realizada quando o conteúdo mudou");
  ok(repetiu === false, "56. Repaint evitado quando o conteúdo é idêntico");

  // 57. Barramento de eventos desacoplado
  ev(`
    window._eventoRecebido = null;
    const remover = ouvirEventoEstado("tarefa_feita", dados => {
      window._eventoRecebido = dados.id;
    });
    dispararEventoEstado("tarefa_feita", { id: "t123" });
    remover();
  `);
  ok(
    ev("window._eventoRecebido === 't123'"),
    "57. Barramento de eventos disparou e recebeu dados corretamente"
  );

  // 58. Virtual scrolling leve
  const slice = ev("calcularItensVisiveis(100, 440, 44, 400)");
  ok(
    slice.inicio >= 0 && slice.fim <= 100 && slice.totalAltura === 4400,
    "58. Janela visível de virtual scrolling calculada com precisão"
  );

  // 59. Catálogo de símbolos SVG reutilizáveis
  const svgUse = ev("obterSimboloSVGReutilizavel('ico-check')");
  ok(svgUse.includes('<use href="#ico-check"/>'), "59. Símbolo SVG reutilizável com use gerado");

  // 60. Ciclo de vida para módulos de mundos
  ev(`
    registrarCicloVidaMundo("otaku", {
      mount: () => { window._otakuMontado = true; }
    });
    CICLO_VIDA_MUNDOS["otaku"].mount();
  `);
  ok(ev("window._otakuMontado === true"), "60. Ciclo de vida formal de mundo registrado e acionado");

  fechar();
  return erros;
};
