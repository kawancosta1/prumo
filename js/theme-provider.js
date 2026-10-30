/*
  theme-provider.js - Provedor e Gerenciador de Tema Dinâmico (Module C).
  Lê 'prumo-theme' no localStorage, respeita prefers-color-scheme e alterna a classe .dark e data-theme no <html>.
*/
"use strict";

const OUVINTES_TEMA = new Set();

/**
 * Lê o estado do tema conforme a especificação do Module C:
 * 1. localStorage.getItem('prumo-theme')
 * 2. matchMedia('(prefers-color-scheme: dark)')
 */
function obterModoPreferenciaSistema() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch (e) {
    return "light";
  }
}

function obterEstadoTemaInicial() {
  let salvo = null;
  try {
    salvo = localStorage.getItem("prumo-theme");
  } catch (e) {}

  if (salvo === "dark" || salvo === "light") {
    return salvo;
  }
  return obterModoPreferenciaSistema();
}

/**
 * Aplica as classes e atributos ao elemento raiz <html> e <body>:
 * - Alterna a classe .dark
 * - Define atributo data-theme="dark"|"light"
 */
function aplicarModoTemaRoot(modo) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  const isDark = modo === "dark";

  r.setAttribute("data-theme", isDark ? "dark" : "light");
  r.classList.toggle("dark", isDark);
  if (document.body) {
    document.body.classList.toggle("dark", isDark);
  }

  try {
    localStorage.setItem("prumo-theme", modo);
  } catch (e) {}

  if (typeof S !== "undefined" && S) {
    S.mode = modo;
  }

  // Notifica os ouvintes registrados
  OUVINTES_TEMA.forEach(fn => {
    try {
      fn(modo);
    } catch (err) {}
  });

  if (typeof window !== "undefined" && typeof CustomEvent === "function") {
    window.dispatchEvent(new CustomEvent("prumothemechange", { detail: { modo, isDark } }));
  }
}

const ThemeProvider = {
  get modo() {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  },
  obterTemaAtual() {
    return this.modo;
  },
  definirTema(modo) {
    const m = modo === "auto" ? obterModoPreferenciaSistema() : modo === "dark" ? "dark" : "light";
    aplicarModoTemaRoot(m);
    if (typeof applyTheme === "function") applyTheme();
  },
  alternarTema() {
    const proximo = this.modo === "dark" ? "light" : "dark";
    this.definirTema(proximo);
    return proximo;
  },
  escutar(callback) {
    if (typeof callback === "function") OUVINTES_TEMA.add(callback);
    return () => OUVINTES_TEMA.delete(callback);
  }
};

// Inicialização imediata
(function inicializarTemaRoot() {
  const modoInicial = obterEstadoTemaInicial();
  aplicarModoTemaRoot(modoInicial);

  if (typeof window !== "undefined" && window.matchMedia) {
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        let salvo = null;
        try {
          salvo = localStorage.getItem("prumo-theme");
        } catch (_) {}
        // Só segue o sistema se o usuário não tiver forçado um modo manual ou se estiver em auto
        if (!salvo || salvo === "auto") {
          aplicarModoTemaRoot(e.matches ? "dark" : "light");
          if (typeof applyTheme === "function") applyTheme();
        }
      });
    } catch (_) {}
  }
})();

if (typeof window !== "undefined") {
  window.ThemeProvider = ThemeProvider;
  window.obterEstadoTemaInicial = obterEstadoTemaInicial;
  window.aplicarModoTemaRoot = aplicarModoTemaRoot;
}
