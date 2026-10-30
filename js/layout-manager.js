/*
  layout-manager.js - Gerenciador de Layout (Computador / Celular / Auto).
  Controla o modo de visualização entre Desktop Widescreen e Celular Compacto.
*/
"use strict";

function obterLayoutSalvo() {
  let salvo = null;
  try {
    salvo = localStorage.getItem("prumo-layout");
  } catch (_) {}
  if (salvo === "desktop" || salvo === "mobile" || salvo === "auto") {
    return salvo;
  }
  return (typeof S !== "undefined" && S && S.layout) || "auto";
}

function aplicarLayout(modo) {
  const m = modo === "desktop" || modo === "mobile" ? modo : "auto";
  const r = document.documentElement;

  if (m === "auto") {
    r.removeAttribute("data-layout");
  } else {
    r.setAttribute("data-layout", m);
  }

  try {
    localStorage.setItem("prumo-layout", m);
  } catch (_) {}

  if (typeof S !== "undefined" && S) {
    S.layout = m;
  }

  const btn = document.getElementById("layout-toggle-bt");
  if (btn) {
    const isWidescreen = window.innerWidth >= 960;
    const ativoDesktop = m === "desktop" || (m === "auto" && isWidescreen);
    btn.setAttribute(
      "title",
      ativoDesktop
        ? "Modo Computador Ativo (Toque para alternar para Celular)"
        : "Modo Celular Ativo (Toque para alternar para Computador)"
    );
    btn.classList.toggle("ativo", m === "desktop");
  }

  if (typeof placeInd === "function") {
    setTimeout(placeInd, 50);
  }
}

function alternarLayout() {
  const atual = obterLayoutSalvo();
  const isWidescreen = typeof window !== "undefined" && window.innerWidth >= 960;
  let proximo;

  if (atual === "auto") {
    proximo = isWidescreen ? "mobile" : "desktop";
  } else if (atual === "desktop") {
    proximo = "mobile";
  } else {
    proximo = "auto";
  }

  aplicarLayout(proximo);
  const msg =
    proximo === "desktop"
      ? "🖥️ Modo Computador (Widescreen) ativado!"
      : proximo === "mobile"
        ? "📱 Modo Celular (Compacto) ativado!"
        : "🔄 Modo Automático (Seguindo a tela) ativado!";
  if (typeof toast === "function") toast(msg, false, "happy");
  if (typeof render === "function") render();
  return proximo;
}

// Inicialização imediata do layout
(function initLayoutRoot() {
  const modoInicial = obterLayoutSalvo();
  aplicarLayout(modoInicial);

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      if (typeof placeInd === "function") placeInd();
    });

    window.ACOES_EXTRAS = window.ACOES_EXTRAS || {};
    window.ACOES_EXTRAS["toggle-layout"] = () => {
      alternarLayout();
    };
  }
})();

if (typeof window !== "undefined") {
  window.obterLayoutSalvo = obterLayoutSalvo;
  window.aplicarLayout = aplicarLayout;
  window.alternarLayout = alternarLayout;
}
