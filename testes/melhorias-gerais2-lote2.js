// Testes Novas Melhorias Gerais: Lote 2 (Itens 11 a 20)
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

  // 11. Confete direcionado brotando do elemento clicado
  const res11 = ev(`
    (() => {
      const btn = document.createElement("button");
      document.body.appendChild(btn);
      const confetes = dispararConfeteBrotandoElemento(btn);
      const okC = confetes.length === 10 && confetes[0].classList.contains("particula-confete-brotando");
      document.body.removeChild(btn);
      return okC;
    })()
  `);
  ok(res11, "11. dispararConfeteBrotandoElemento gerou partículas coloridas com rotação");

  // 12. Ícone de cadeado que gira e abre suavemente ao autenticar
  const res12 = ev(`
    (() => {
      const el = document.createElement("div");
      animarCadeadoAutenticacao(el);
      return el.classList.contains("cadeado-girando-abre");
    })()
  `);
  ok(res12, "12. animarCadeadoAutenticacao disparou animação de abertura de cadeado");

  // 13. Movimento de folhas caindo ao arquivar um hábito antigo
  const res13 = ev(`
    (() => {
      const habito = document.createElement("div");
      document.body.appendChild(habito);
      const folhas = animarFolhasCaindoHabito(habito);
      const okF = folhas.length === 4 && folhas[0].classList.contains("particula-folha-caindo");
      document.body.removeChild(habito);
      return okF;
    })()
  `);
  ok(res13, "13. animarFolhasCaindoHabito gerou folhas em queda suave");

  // 14. Pulso rítmico no cronômetro Pomodoro no minuto final
  const res14 = ev(`
    (() => {
      const timer = document.createElement("div");
      aplicarPulsoMinutoFinalPomodoro(timer, true);
      const ativou = timer.classList.contains("pomodoro-pulso-urgente");
      aplicarPulsoMinutoFinalPomodoro(timer, false);
      const desativou = !timer.classList.contains("pomodoro-pulso-urgente");
      return ativou && desativou;
    })()
  `);
  ok(res14, "14. aplicarPulsoMinutoFinalPomodoro alternou pulso no minuto final");

  // 15. Efeito de carimbo com tinta seca ao marcar meta como concluída
  const res15 = ev(`
    (() => {
      const card = document.createElement("div");
      const carimbo = animarCarimboMetaConcluida(card, "FEITO!");
      return carimbo && carimbo.textContent === "FEITO!" && carimbo.classList.contains("carimbo-meta-concluida");
    })()
  `);
  ok(res15, "15. animarCarimboMetaConcluida carimbou o card com texto e animação");

  // 16. Piscar de olhos sincronizado entre o Prumi e o pet
  const res16 = ev(`
    (() => {
      const olho1 = document.createElement("div");
      const olho2 = document.createElement("div");
      sincronizarPiscadaPrumiPet(olho1, olho2);
      return olho1.classList.contains("olho-piscando-sincrono") &&
        olho2.classList.contains("olho-piscando-sincrono");
    })()
  `);
  ok(res16, "16. sincronizarPiscadaPrumiPet sincronizou o piscar entre mascote e pet");

  // 17. Balanço de cauda do pet ao receber carinho contínuo
  const res17 = ev(`
    (() => {
      const cauda = document.createElement("div");
      animarBalancoCaudaPet(cauda, true);
      const balancando = cauda.classList.contains("pet-cauda-balancando");
      animarBalancoCaudaPet(cauda, false);
      const parou = !cauda.classList.contains("pet-cauda-balancando");
      return balancando && parou;
    })()
  `);
  ok(res17, "17. animarBalancoCaudaPet ativou e desativou animação de cauda");

  // 18. Efeito de fita métrica desenhando o progresso nos hábitos
  const res18 = ev(`
    (() => {
      const barra = document.createElement("div");
      animarFitaProgressoHabito(barra, 85);
      return barra.style.width === "85%" && barra.classList.contains("fita-progresso-animada");
    })()
  `);
  ok(res18, "18. animarFitaProgressoHabito aplicou largura e textura de fita métrica");

  // 19. Nuvem de fumaça fofa de desenho animado ao excluir item
  const res19 = ev(`
    (() => {
      const item = document.createElement("div");
      document.body.appendChild(item);
      const fumacas = animarFumacaExclusao(item);
      const okFumaca = fumacas.length === 5 && fumacas[0].classList.contains("particula-fumaca-fofa");
      document.body.removeChild(item);
      return okFumaca;
    })()
  `);
  ok(res19, "19. animarFumacaExclusao gerou efeito lúdico de fumaça ao remover item");

  // 20. Expansão circular estilo revelação ao abrir modais em tela cheia
  const res20 = ev(`
    (() => {
      const modal = document.createElement("div");
      animarRevelacaoCircularModal(modal, 100, 200);
      return modal.classList.contains("modal-revelacao-circular") &&
        modal.style.getPropertyValue("--cx") === "100px";
    })()
  `);
  ok(res20, "20. animarRevelacaoCircularModal preparou coordenadas e classe de clipe circular");

  await fechar();
  return erros;
};
