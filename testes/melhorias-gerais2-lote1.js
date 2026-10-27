// Testes Novas Melhorias Gerais: Lote 1 (Itens 1 a 10)
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

  // 1. Transição de fade suave ao trocar de aba sem saltos na rolagem
  const res1 = ev(`
    (() => {
      const el = document.createElement("div");
      document.body.appendChild(el);
      aplicarFadeTransicaoAba(el);
      const temClasse = el.classList.contains("fade-transicao-aba");
      document.body.removeChild(el);
      return temClasse;
    })()
  `);
  ok(res1, "1. aplicarFadeTransicaoAba adicionou classe de animação suave");

  // 2. Efeito de brilho perolado nas gotas quando a meta diária for batida
  const res2 = ev(`
    (() => {
      const el = document.createElement("div");
      aplicarBrilhoPeroladoGotas(el, true);
      const ativou = el.classList.contains("brilho-perolado-gotas");
      aplicarBrilhoPeroladoGotas(el, false);
      const desativou = !el.classList.contains("brilho-perolado-gotas");
      return ativou && desativou;
    })()
  `);
  ok(res2, "2. aplicarBrilhoPeroladoGotas alternou efeito perolado no elemento");

  // 3. Micro-salto elástico do Prumi quando você adiciona uma nova tarefa
  const res3 = ev(`
    (() => {
      const el = document.createElement("div");
      animarSaltoElasticoPrumi(el);
      return el.classList.contains("salto-elastico-prumi");
    })()
  `);
  ok(res3, "3. animarSaltoElasticoPrumi disparou animação elástica do mascote");

  // 4. Animação de poeira mágica ao subir de nível no perfil
  const res4 = ev(`
    (() => {
      const alvo = document.createElement("div");
      document.body.appendChild(alvo);
      const particulas = animarPoeiraMagicaLevelUp(alvo, 6);
      const criadas = particulas.length === 6 && particulas[0].classList.contains("particula-poeira-magica");
      document.body.removeChild(alvo);
      return criadas;
    })()
  `);
  ok(res4, "4. animarPoeiraMagicaLevelUp gerou partículas douradas orbitando o elemento");

  // 5. Ondulação concêntrica ao tocar no botão de beber água
  const res5 = ev(`
    (() => {
      const btn = document.createElement("button");
      btn.style.width = "60px";
      btn.style.height = "60px";
      document.body.appendChild(btn);
      const onda = animarOndulacaoConcentricaAgua(btn, 30, 30);
      const temOnda = onda && onda.classList.contains("ondulacao-onda");
      document.body.removeChild(btn);
      return temOnda;
    })()
  `);
  ok(res5, "5. animarOndulacaoConcentricaAgua criou onda radial centralizada");

  // 6. Vibração sutil no card ao arrastar para reordenar itens
  const res6 = ev(`
    (() => {
      const card = document.createElement("div");
      aplicarVibracaoArrastoCard(card, true);
      const ligou = card.classList.contains("card-vibrando-arrasto");
      aplicarVibracaoArrastoCard(card, false);
      const desligou = !card.classList.contains("card-vibrando-arrasto");
      return ligou && desligou;
    })()
  `);
  ok(res6, "6. aplicarVibracaoArrastoCard ativou micro-vibração durante arrasto");

  // 7. Efeito de desdobrar pergaminho ao abrir notas longas do diário
  const res7 = ev(`
    (() => {
      const nota = document.createElement("div");
      animarDesdobrarPergaminho(nota);
      return nota.classList.contains("desdobrar-pergaminho");
    })()
  `);
  ok(res7, "7. animarDesdobrarPergaminho aplicou classe de desdobramento de pergaminho");

  // 8. Brilho metálico sutil nos selos de conquistas recém-desbloqueadas
  const res8 = ev(`
    (() => {
      const selo = document.createElement("div");
      aplicarBrilhoMetalicoSelo(selo);
      return selo.classList.contains("brilho-metalico-selo");
    })()
  `);
  ok(res8, "8. aplicarBrilhoMetalicoSelo aplicou efeito de reflexo metálico");

  // 9. Rastro de faíscas ao concluir todas as tarefas de prioridade alta
  const res9 = ev(`
    (() => {
      const alvo = document.createElement("div");
      document.body.appendChild(alvo);
      const faiscas = animarRastroFaiscasConclusao(alvo);
      const okFaiscas = faiscas.length > 0 && faiscas[0].classList.contains("particula-faisca-conclusao");
      document.body.removeChild(alvo);
      return okFaiscas;
    })()
  `);
  ok(res9, "9. animarRastroFaiscasConclusao dispersou faíscas de comemoração");

  // 10. Transição fluida entre modo claro e escuro em todos os elementos
  const res10 = ev(`
    (() => {
      aplicarTransicaoModoEscuroSuave(200);
      return document.documentElement.classList.contains("transicao-tema-ativa");
    })()
  `);
  ok(res10, "10. aplicarTransicaoModoEscuroSuave ativou suavização global de troca de tema");

  await fechar();
  return erros;
};
