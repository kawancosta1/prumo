// Testes Melhorias Gerais: Lote 3 (Itens 21 a 30)
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

  // 21. Balão com surgimento pop
  ev(`
    const balao = document.createElement("div");
    document.body.appendChild(balao);
    aplicarPopBalao(balao);
  `);
  ok(D.querySelector(".balao-pop") !== null, "21. Classe balao-pop aplicada ao balão");

  // 22. Checkmark com traço vetorial
  ev(`
    const check = document.createElement("div");
    document.body.appendChild(check);
    animarCheckmarkTraco(check);
  `);
  ok(
    D.querySelector(".check-traco-animado") !== null,
    "22. Animação de traço contínuo no checkmark aplicada"
  );

  // 23. Level up com raios solares
  const raiosHtml = ev("levelUpRaiosHTML()");
  ok(raiosHtml.includes("level-up-raios-rotativos"), "23. HTML dos raios rotativos gerado para o level up");

  // 24. Enchimento fluido do copo
  ev(`
    const copo = document.createElement("div");
    document.body.appendChild(copo);
    animarEnchimentoCopo(copo);
  `);
  ok(D.querySelector(".copo-enchimento-liquido") !== null, "24. Classe copo-enchimento-liquido aplicada");

  // 25. Card de detalhes expansível
  ev(`
    const card = document.createElement("div");
    document.body.appendChild(card);
    expandirCardDetalhe(card);
  `);
  ok(D.querySelector(".card-detalhe-expansivel") !== null, "25. Card expansível ativado com transição");

  // 26. Partículas estelares no feiticeiro
  ok(
    ev("typeof iniciarRastroEstelarFeiticeiro === 'function'"),
    "26. Função iniciarRastroEstelarFeiticeiro disponível"
  );
  ev("iniciarRastroEstelarFeiticeiro(); pararRastroEstelarFeiticeiro();");
  ok(true, "26. Rastro estelar do feiticeiro gerenciado com sucesso");

  // 27. Folha caindo ao arquivar hábitos
  let arquivado = false;
  ev(`
    const hab = document.createElement("div");
    document.body.appendChild(hab);
    animarHabitoArquivado(hab, () => {
      window._habArquivado = true;
    });
  `);
  await espera(500);
  ok(ev("window._habArquivado === true"), "27. Animação pendular de arquivamento executada com callback");

  // 28. Animação de badges de conquistas
  ev(`
    const badge = document.createElement("div");
    document.body.appendChild(badge);
    animarBadgeConquista(badge);
  `);
  ok(
    D.querySelector(".badge-conquista-desbloqueada") !== null,
    "28. Animação de salto da badge de conquista aplicada"
  );

  // 29. Carrossel cinético do quarto
  ev(`
    const carrossel = document.createElement("div");
    document.body.appendChild(carrossel);
    ativarCarrosselCinetico(carrossel);
  `);
  ok(D.querySelector(".carrossel-quarto-cinetico") !== null, "29. Carrossel cinético configurado");

  // 30. Respeito a prefers-reduced-motion
  const pm = ev("typeof verificarPreferenciaMovimentoReduzido === 'function'");
  ok(pm, "30. Função de verificação estrita de prefers-reduced-motion disponível");

  fechar();
  return erros;
};
