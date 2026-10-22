/*
  Prumo como app no celular (PWA) e avisos no celular.
  - Registra o service worker (sw.js): guarda o app no aparelho para abrir rápido e funcionar sem internet.
  - avisarNoCelular(): mostra uma notificação do sistema quando chega algo de um amigo e o app está em segundo plano.
  Observação: avisos com o app totalmente FECHADO precisariam de um servidor mandando push (fora do plano grátis).
*/
"use strict";

let registroSW = null;

if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !window.claude) {
  navigator.serviceWorker
    .register("sw.js")
    .then(r => (registroSW = r))
    .catch(() => {});
}

const notificacaoSuportada = () => "Notification" in window;

/** Liga ou desliga os avisos no celular (pede permissão na primeira vez). */
async function alternarAvisosCelular() {
  if (!notificacaoSuportada())
    return toast(
      "Este navegador não mostra notificações. No iPhone, instale o Prumo na tela inicial antes.",
      false,
      "worried"
    );
  if (!S.avisosCelular) {
    const ok =
      Notification.permission === "granted" || (await Notification.requestPermission()) === "granted";
    if (!ok)
      return toast(
        "Sem permissão para notificar. Dá pra liberar nas configurações do navegador.",
        false,
        "worried"
      );
  }
  S.avisosCelular = !S.avisosCelular;
  commit();
  if (S.avisosCelular) avisarNoCelular("Pronto! Vou avisar aqui quando um amigo mandar algo.", true);
}

/** Notificação do sistema (só quando o app não está na frente, para não repetir o toast). */
function avisarNoCelular(texto, mesmoNaFrente) {
  if (!S.avisosCelular || !notificacaoSuportada() || Notification.permission !== "granted") return;
  if (!document.hidden && !mesmoNaFrente) return;
  const opcoes = {
    body: texto,
    icon: "icones/icone-192.png",
    badge: "icones/icone-192.png",
    tag: "prumo-" + Date.now()
  };
  try {
    if (registroSW) registroSW.showNotification("Prumo", opcoes);
    else new Notification("Prumo", opcoes);
  } catch (e) {}
}

ACOES_EXTRAS["avisos-celular"] = () => alternarAvisosCelular();

/* Botão "Instalar o Prumo" (Chrome/Android guarda o pedido para a gente mostrar quando quiser) */
let pedidoInstalar = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  pedidoInstalar = e;
  softRender();
});
ACOES_EXTRAS.instalar = async () => {
  if (!pedidoInstalar)
    return toast("No iPhone: toque em Compartilhar e depois em Adicionar à Tela de Início.", false, "happy");
  pedidoInstalar.prompt();
  await pedidoInstalar.userChoice.catch(() => {});
  pedidoInstalar = null;
  render();
};
const jaInstalado = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
