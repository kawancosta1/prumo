/*
  visual-supremo.js - Motor de Aprimoramento Visual e Renderizacao Dinamica 2.5D do Prumo
  Injeta filtros SVG de profundidade, iluminacao especular, fisica de squash & stretch
  e micro-inclinacao 3D interativa.
*/
"use strict";

const DEFINICOES_SVG_SUPREMAS = `
  <svg id="svg-defs-supremas" style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
    <defs>
      <!-- Sombra de contato suave e oclusao de ambiente -->
      <filter id="filtro-sombra-suave" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0, 0, 0, 0.15)" />
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="rgba(0, 0, 0, 0.08)" />
      </filter>

      <!-- Brilho de aura bioluminescente para evolucao e vitoria -->
      <filter id="filtro-brilho-aura" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="
          1 0 0 0 1
          0 1 0 0 0.85
          0 0 1 0 0.3
          0 0 0 1 0" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Gradiente esferico para volume 2.5D dos Mascotes -->
      <radialGradient id="grad-volume-mascote" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.22" />
      </radialGradient>

      <!-- Gradiente dourado foil para acabamento nobre de livros -->
      <linearGradient id="grad-dourado-luxo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4af37" />
        <stop offset="25%" stop-color="#fff4b8" />
        <stop offset="50%" stop-color="#d4af37" />
        <stop offset="75%" stop-color="#aa7c11" />
        <stop offset="100%" stop-color="#ffd700" />
      </linearGradient>
    </defs>
  </svg>
`;

function inicializarVisualSupremo() {
  if (typeof document === "undefined") return;

  // Injetar os defs SVG caso ainda nao existam
  if (!document.getElementById("svg-defs-supremas")) {
    document.body.insertAdjacentHTML("afterbegin", DEFINICOES_SVG_SUPREMAS);
  }

  // Registrar listeners de inclinacao 3D (tilt) para cartoes e estante
  registrarEfeitoTilt3D();
  aplicarEfeitoSquashNoClique();
}

function registrarEfeitoTilt3D() {
  if (typeof document === "undefined") return;

  document.addEventListener("mousemove", e => {
    const alvos = document.querySelectorAll(".card, .mv-cartao-personalidade, .livro-lombada-real");
    alvos.forEach(el => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const centroX = rect.width / 2;
        const centroY = rect.height / 2;
        const rotX = ((y - centroY) / centroY) * -5;
        const rotY = ((x - centroX) / centroX) * 5;
        el.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(0, -4px, 0)`;
      }
    });
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    const alvos = document.querySelectorAll(".card, .mv-cartao-personalidade, .livro-lombada-real");
    alvos.forEach(el => {
      el.style.transform = "";
    });
  }, { passive: true });
}

function aplicarEfeitoSquashNoClique() {
  if (typeof document === "undefined") return;

  document.addEventListener("click", e => {
    const pet = e.target.closest(".pet-svg, .prumi, [data-act='pet-carinho']");
    if (!pet) return;

    pet.style.transition = "transform 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    pet.style.transform = "scale(1.22, 0.82)"; // Squash no clique

    setTimeout(() => {
      pet.style.transform = "scale(0.88, 1.18)"; // Stretch de recuperacao
      setTimeout(() => {
        pet.style.transform = "";
      }, 140);
    }, 120);
  });
}

// Executar ao carregar a pagina
if (typeof window !== "undefined") {
  window.inicializarVisualSupremo = inicializarVisualSupremo;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarVisualSupremo);
  } else {
    inicializarVisualSupremo();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DEFINICOES_SVG_SUPREMAS,
    inicializarVisualSupremo,
    registrarEfeitoTilt3D,
    aplicarEfeitoSquashNoClique
  };
}
