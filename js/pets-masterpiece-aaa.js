/*
  pets-masterpiece-aaa.js - Motor Dinamico de Animacao Triple-AAA para os Pets do Prumo
  Contem:
  - Sistema de Footstep Dust Puffs (nuvens de poeira de solo sincronizadas com as passadas)
  - Fisica de Gelatina Damped Harmonic Oscillator ao toque
  - Detector de Carinho Continuo com Modo Êxtase e Vibracao Haptica
*/
"use strict";

let _timerPoeiraPassos = null;
let _toquesConsecutivosCarinho = 0;
let _ultimoToqueCarinhoTempo = 0;

function inicializarPetsMasterpieceAAA() {
  if (typeof document === "undefined") return;

  iniciarSistemaPoeiraPassos();
  iniciarFisicaGelatinaNoClique();
  iniciarDetectorCarinhoContinuo();
}

/* ==========================================================================
   01. NUVENS DE POEIRA DE SOLO SINCRONIZADAS COM AS PASSADAS
   ========================================================================== */

function iniciarSistemaPoeiraPassos() {
  if (typeof document === "undefined") return;

  if (_timerPoeiraPassos) clearInterval(_timerPoeiraPassos);

  _timerPoeiraPassos = setInterval(() => {
    const petsAndando = document.querySelectorAll(".pet-agente .pet-svg.pose-andando, .pet-agente .pet-svg.pose-correndo");
    petsAndando.forEach(pet => {
      const agente = pet.closest(".pet-agente");
      if (!agente) return;

      const rect = agente.getBoundingClientRect();
      // Emite poeira atras do sentido de movimento do pet
      const vira = agente.classList.contains("vira");
      const dir = vira ? 1 : -1;
      const x = vira ? rect.right - 12 : rect.left + 12;
      const y = rect.bottom - 4;

      gerarPoeiraPasso(x, y, dir);
    });
  }, 220);
}

function gerarPoeiraPasso(x, y, dir = -1) {
  if (typeof document === "undefined") return;

  const poeira = document.createElement("div");
  poeira.className = "poeira-passo-solo";
  poeira.style.left = `${x}px`;
  poeira.style.top = `${y}px`;
  poeira.style.setProperty("--dir", dir);

  document.body.appendChild(poeira);
  setTimeout(() => { poeira.remove(); }, 460);
}

/* ==========================================================================
   02. FÍSICA DE GELATINA (DAMPED HARMONIC OSCILLATOR)
   ========================================================================== */

function iniciarFisicaGelatinaNoClique() {
  if (typeof document === "undefined") return;

  document.addEventListener("click", e => {
    const petSvg = e.target.closest(".pet-svg");
    if (!petSvg) return;

    petSvg.classList.remove("pet-jelly-click");
    void petSvg.offsetWidth; // Forca reflow para reiniciar animacao
    petSvg.classList.add("pet-jelly-click");

    setTimeout(() => {
      petSvg.classList.remove("pet-jelly-click");
    }, 660);
  });
}

/* ==========================================================================
   03. DETECTOR DE CARINHO CONTÍNUO & MODO ÊXTASE
   ========================================================================== */

function iniciarDetectorCarinhoContinuo() {
  if (typeof document === "undefined") return;

  const tratarMovimentoCarinho = e => {
    const petAlvo = e.target.closest(".pet-palco, .pet-agente, [data-act='pet-carinho']");
    if (!petAlvo) return;

    const agora = Date.now();
    if (agora - _ultimoToqueCarinhoTempo < 350) {
      _toquesConsecutivosCarinho++;
    } else {
      _toquesConsecutivosCarinho = 1;
    }
    _ultimoToqueCarinhoTempo = agora;

    if (_toquesConsecutivosCarinho >= 3) {
      ativarModoExtase(petAlvo);
    }
  };

  document.addEventListener("mousemove", tratarMovimentoCarinho, { passive: true });
  document.addEventListener("touchmove", tratarMovimentoCarinho, { passive: true });
}

function ativarModoExtase(container) {
  const svg = container.querySelector(".pet-svg");
  if (!svg || svg.classList.contains("pet-extase-carinho")) return;

  svg.classList.add("pet-extase-carinho");

  // Feedback Haptico caso disponivel no celular/navegador
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try { navigator.vibrate([20, 40, 20]); } catch (e) {}
  }

  // Gera chuva de particulas especiais de extase
  const rect = svg.getBoundingClientRect();
  const centroX = rect.left + rect.width / 2;
  const centroY = rect.top + rect.height / 2;

  if (typeof window.gerarParticulasCarinhoAAA === "function") {
    window.gerarParticulasCarinhoAAA(centroX, centroY, 6);
  }

  setTimeout(() => {
    svg.classList.remove("pet-extase-carinho");
    _toquesConsecutivosCarinho = 0;
  }, 1600);
}

// Inicializacao segura
if (typeof window !== "undefined") {
  window.inicializarPetsMasterpieceAAA = inicializarPetsMasterpieceAAA;
  window.gerarPoeiraPasso = gerarPoeiraPasso;
  window.ativarModoExtase = ativarModoExtase;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarPetsMasterpieceAAA);
  } else {
    inicializarPetsMasterpieceAAA();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    inicializarPetsMasterpieceAAA,
    gerarPoeiraPasso,
    ativarModoExtase
  };
}
